import { createHash } from 'node:crypto';
import { existsSync, rmSync } from 'node:fs';
import path from 'node:path';
import type { PipelineDirs } from './dirs';
import { MAX_STATE_FILE_BYTES, moveInto, readJsonFile, safeJoin, writeJsonAtomic } from './fs';
import { loadHistory, PLATFORMS, PUBLICATION_PROVIDERS, type History, type Platform, type PublicationProvider } from './history';
import { fileStemFor, parseRenderId } from './ids';
import { acquireLock } from './lock';
import { freeAuditPath, isIsoTimestamp, PROVIDER_UUID_RE, readReceiptFile, RECORDED_BY_RE, MAX_RECEIPT_NOTES } from './publication';
import { listContentFiles } from './queue';
import type { CiRun } from './ciRun';

/**
 * Analytics snapshots — how the repository LEARNS how a published video did.
 *
 * Same model as publication receipts: the repository never calls Metricool.
 * The external Analyst Agent reads Metricool and writes ONE snapshot per
 * render × platform into `analytics/pending/`; `social:analytics:apply`
 * validates every snapshot (contract + history: the post must be published)
 * and applies them ALL OR NONE into `analytics/metrics.json` (latest values per
 * render × platform). The performance engine (growth/performance.ts) reads it.
 *
 * Metric values: a number ≥ 0, or `null` = the network doesn't provide it /
 * not available yet. A key absent from a snapshot = not reported (the previous
 * value is kept). Rates (retention, viewRate, fullVideoWatchedRate) are 0..1;
 * durations in seconds; watchMinutes in minutes.
 */
export const SNAPSHOT_VERSION = 1;

export const PLATFORM_METRICS: Record<Platform, readonly string[]> = {
  instagram: ['views', 'reach', 'likes', 'comments', 'shares', 'saves', 'interactions', 'averageWatchTime', 'retention', 'viewRate', 'followersGained'],
  tiktok: ['views', 'reach', 'likes', 'comments', 'shares', 'averageWatchTime', 'fullVideoWatchedRate', 'profileViews', 'followersGained'],
  youtube: ['views', 'likes', 'comments', 'shares', 'watchMinutes', 'averageViewDuration', 'subscribersGained'],
  facebook: ['views', 'reach', 'likes', 'comments', 'shares', 'interactions'],
};
export const RATE_METRICS = ['retention', 'viewRate', 'fullVideoWatchedRate'] as const;
const SNAPSHOT_KEYS = ['$schema', 'snapshotVersion', 'renderId', 'platform', 'provider', 'collectedAt', 'providerPostUuid', 'metrics', 'recordedBy', 'notes'] as const;
const REQUIRED_KEYS = ['snapshotVersion', 'renderId', 'platform', 'provider', 'collectedAt', 'metrics'] as const;

export type MetricValues = Record<string, number | null>;
export type AnalyticsSnapshot = {
  renderId: string;
  platform: Platform;
  provider: PublicationProvider;
  collectedAt: string;
  providerPostUuid: string | null;
  metrics: MetricValues;
  recordedBy: string | null;
  notes: string | null;
};

export type ParsedSnapshot = { ok: true; snapshot: AnalyticsSnapshot } | { ok: false; errors: string[] };

export function parseSnapshot(raw: unknown): ParsedSnapshot {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return { ok: false, errors: ['a snapshot must be ONE JSON object'] };
  const o = raw as Record<string, unknown>;
  const errors: string[] = [];
  for (const k of Object.keys(o)) if (!(SNAPSHOT_KEYS as readonly string[]).includes(k)) errors.push(`${k}: unknown field`);
  for (const k of REQUIRED_KEYS) if (o[k] === undefined || o[k] === null) errors.push(`${k}: required`);
  if (o.snapshotVersion !== undefined && o.snapshotVersion !== SNAPSHOT_VERSION) errors.push(`snapshotVersion: must be ${SNAPSHOT_VERSION}`);
  if (typeof o.renderId === 'string') {
    try {
      parseRenderId(o.renderId);
    } catch (err) {
      errors.push(`renderId: ${(err as Error).message}`);
    }
  } else if (o.renderId !== undefined) errors.push('renderId: must be a string');
  const platform = o.platform as Platform;
  if (o.platform !== undefined && !PLATFORMS.includes(platform)) errors.push(`platform: must be one of ${PLATFORMS.join(', ')}`);
  if (o.provider !== undefined && !PUBLICATION_PROVIDERS.includes(o.provider as PublicationProvider)) errors.push(`provider: must be one of ${PUBLICATION_PROVIDERS.join(', ')}`);
  if (o.collectedAt !== undefined && (typeof o.collectedAt !== 'string' || !isIsoTimestamp(o.collectedAt))) errors.push('collectedAt: must be a full ISO 8601 date-time with seconds and offset');
  if (o.providerPostUuid !== undefined && (typeof o.providerPostUuid !== 'string' || !PROVIDER_UUID_RE.test(o.providerPostUuid))) errors.push('providerPostUuid: must match -?[A-Za-z0-9][A-Za-z0-9._:-]{0,127}');
  if (o.recordedBy !== undefined && (typeof o.recordedBy !== 'string' || !RECORDED_BY_RE.test(o.recordedBy))) errors.push('recordedBy: must match [A-Za-z0-9][A-Za-z0-9 ._-]{0,79}');
  if (o.notes !== undefined && (typeof o.notes !== 'string' || o.notes.length > MAX_RECEIPT_NOTES)) errors.push(`notes: must be a string (≤ ${MAX_RECEIPT_NOTES} chars)`);
  const metrics: MetricValues = {};
  if (o.metrics !== undefined) {
    if (typeof o.metrics !== 'object' || o.metrics === null || Array.isArray(o.metrics)) errors.push('metrics: must be an object { metric: number | null }');
    else {
      const allowed = PLATFORM_METRICS[platform] ?? [];
      const entries = Object.entries(o.metrics as Record<string, unknown>);
      if (!entries.length) errors.push('metrics: at least one metric is required');
      for (const [k, v] of entries) {
        if (!allowed.includes(k)) errors.push(`metrics.${k}: not a ${o.platform} metric (allowed: ${allowed.join(', ')})`);
        else if (v === null) metrics[k] = null;
        else if (typeof v !== 'number' || !Number.isFinite(v) || v < 0) errors.push(`metrics.${k}: must be a number ≥ 0 or null (not available)`);
        else if ((RATE_METRICS as readonly string[]).includes(k) && v > 1) errors.push(`metrics.${k}: is a rate, must be between 0 and 1 (got ${v})`);
        else metrics[k] = v;
      }
    }
  }
  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    snapshot: {
      renderId: o.renderId as string,
      platform,
      provider: o.provider as PublicationProvider,
      collectedAt: o.collectedAt as string,
      providerPostUuid: typeof o.providerPostUuid === 'string' ? o.providerPostUuid : null,
      metrics,
      recordedBy: typeof o.recordedBy === 'string' ? o.recordedBy : null,
      notes: typeof o.notes === 'string' ? o.notes : null,
    },
  };
}

/** `<stem>.<platform>.metrics.<sha256[0..12]>` — deterministic, filesystem-safe. */
export function snapshotIdOf(s: AnalyticsSnapshot): string {
  const facts = [s.renderId, s.platform, s.provider, s.collectedAt, s.providerPostUuid, Object.entries(s.metrics).sort(([a], [b]) => a.localeCompare(b))];
  return `${fileStemFor(parseRenderId(s.renderId))}.${s.platform}.metrics.${createHash('sha256').update(JSON.stringify(facts)).digest('hex').slice(0, 12)}`;
}

// ─── the metrics store ─────────────────────────────────────────────────────

export type PostMetrics = {
  renderId: string;
  platform: Platform;
  provider: PublicationProvider;
  providerPostUuid: string | null;
  publishedAt: string | null;
  firstCollectedAt: string;
  collectedAt: string;
  snapshots: number;
  metrics: MetricValues;
  lastSnapshotId: string;
};
export type MetricsStore = { schemaVersion: 1; posts: Record<string, PostMetrics> };

export const postKey = (renderId: string, platform: string) => `${renderId}|${platform}`;
export const emptyMetrics = (): MetricsStore => ({ schemaVersion: 1, posts: {} });

export function loadMetrics(dirs: PipelineDirs): MetricsStore {
  if (!existsSync(dirs.metricsFile)) return emptyMetrics();
  const raw = readJsonFile(dirs.metricsFile, MAX_STATE_FILE_BYTES) as Partial<MetricsStore>;
  if (raw.schemaVersion !== 1 || typeof raw.posts !== 'object' || raw.posts === null) throw new Error(`${dirs.metricsFile}: unsupported metrics format`);
  return { schemaVersion: 1, posts: raw.posts };
}

/** Analytics as an OPTIONAL input of the growth engine: missing or unreadable metrics never block a run. */
export type AnalyticsStatus = { status: 'ok' | 'empty' | 'unavailable'; posts: number; error: string | null };

/** loadMetrics for the selector: an unreadable metrics.json degrades to "no analytics" (cold start), never throws. */
export function loadMetricsSafe(dirs: PipelineDirs): { store: MetricsStore; analytics: AnalyticsStatus } {
  try {
    const store = loadMetrics(dirs);
    const posts = Object.keys(store.posts).length;
    return { store, analytics: { status: posts ? 'ok' : 'empty', posts, error: null } };
  } catch (err) {
    return { store: emptyMetrics(), analytics: { status: 'unavailable', posts: 0, error: err instanceof Error ? err.message : String(err) } };
  }
}

export function saveMetrics(dirs: PipelineDirs, store: MetricsStore): void {
  writeJsonAtomic(dirs.metricsFile, { schemaVersion: 1, posts: Object.fromEntries(Object.keys(store.posts).sort().map((k) => [k, store.posts[k]])) });
}

// ─── plan & apply (all or nothing) ─────────────────────────────────────────

export type SnapshotPlanItem =
  | { name: string; ok: true; raw: unknown; snapshot: AnalyticsSnapshot; snapshotId: string; outcome: 'applied' | 'unchanged'; note: string | null }
  | { name: string; ok: false; raw: unknown; kind: 'unsafe_file' | 'invalid' | 'unknown_render' | 'not_published' | 'mismatch'; errors: string[]; renderId: string | null; platform: string | null };

export type SnapshotPlan = { items: SnapshotPlanItem[]; store: MetricsStore; valid: boolean };

export function planSnapshots(dirs: PipelineDirs, history: History, current: MetricsStore): SnapshotPlan {
  const { entries, unsafe } = listContentFiles(dirs.analyticsPending);
  const items: SnapshotPlanItem[] = unsafe.map((name) => ({ name, ok: false, raw: null, kind: 'unsafe_file', errors: ['file name must match [A-Za-z0-9][A-Za-z0-9._-]*.json and be a regular file'], renderId: null, platform: null }));
  const store: MetricsStore = JSON.parse(JSON.stringify(current)) as MetricsStore;
  const parsed: { name: string; raw: unknown; snapshot: AnalyticsSnapshot }[] = [];
  for (const name of entries) {
    let raw: unknown = null;
    try {
      raw = readReceiptFile(safeJoin(dirs.analyticsPending, name));
    } catch (err) {
      items.push({ name, ok: false, raw, kind: 'invalid', errors: [(err as Error).message], renderId: null, platform: null });
      continue;
    }
    const p = parseSnapshot(raw);
    const o = (typeof raw === 'object' && raw ? raw : {}) as Record<string, unknown>;
    if (!p.ok) items.push({ name, ok: false, raw, kind: 'invalid', errors: p.errors, renderId: typeof o.renderId === 'string' ? o.renderId : null, platform: typeof o.platform === 'string' ? o.platform : null });
    else parsed.push({ name, raw, snapshot: p.snapshot });
  }
  parsed.sort((a, b) => Date.parse(a.snapshot.collectedAt) - Date.parse(b.snapshot.collectedAt) || a.name.localeCompare(b.name));
  for (const { name, raw, snapshot: s } of parsed) {
    const fail = (kind: 'unknown_render' | 'not_published' | 'mismatch', error: string) => items.push({ name, ok: false, raw, kind, errors: [error], renderId: s.renderId, platform: s.platform });
    const record = history.records[s.renderId];
    if (!record) {
      fail('unknown_render', `unknown renderId ${s.renderId} (no such video in history.json)`);
      continue;
    }
    const entry = record.platforms.find((p) => p.platform === s.platform);
    if (!entry || entry.status !== 'published') {
      fail('not_published', `${s.renderId} is ${entry?.status ?? 'notScheduled'} on ${s.platform}: metrics are only recorded for published posts`);
      continue;
    }
    if (s.providerPostUuid && entry.providerPostUuid && s.providerPostUuid !== entry.providerPostUuid) {
      fail('mismatch', `providerPostUuid ${s.providerPostUuid} is not the published post (${entry.providerPostUuid})`);
      continue;
    }
    const snapshotId = snapshotIdOf(s);
    const key = postKey(s.renderId, s.platform);
    const prev = store.posts[key];
    if (prev && (prev.lastSnapshotId === snapshotId || Date.parse(s.collectedAt) < Date.parse(prev.collectedAt))) {
      items.push({ name, ok: true, raw, snapshot: s, snapshotId, outcome: 'unchanged', note: prev.lastSnapshotId === snapshotId ? 'snapshot already applied' : `older than the stored one (${prev.collectedAt})` });
      continue;
    }
    store.posts[key] = {
      renderId: s.renderId,
      platform: s.platform,
      provider: s.provider,
      providerPostUuid: s.providerPostUuid ?? entry.providerPostUuid,
      publishedAt: entry.publishedAt,
      firstCollectedAt: prev?.firstCollectedAt ?? s.collectedAt,
      collectedAt: s.collectedAt,
      snapshots: (prev?.snapshots ?? 0) + 1,
      // Keys absent from the snapshot keep their previous value (metrics arrive with delays).
      metrics: { ...(prev?.metrics ?? {}), ...s.metrics },
      lastSnapshotId: snapshotId,
    };
    items.push({ name, ok: true, raw, snapshot: s, snapshotId, outcome: 'applied', note: prev ? `update #${prev.snapshots + 1}` : null });
  }
  items.sort((a, b) => a.name.localeCompare(b.name));
  return { items, store, valid: items.every((i) => i.ok) };
}

export type AnalyticsApplyResult = { dryRun: boolean; plan: SnapshotPlan; applied: boolean; quarantined: string[]; auditFiles: string[] };

/** Applies every pending snapshot — ALL OR NOTHING (same contract as publication receipts). */
export function applyPendingSnapshots(opts: { dirs: PipelineDirs; dryRun?: boolean; now?: () => string; run?: CiRun | null }): AnalyticsApplyResult {
  const { dirs, dryRun = false } = opts;
  const now = (opts.now ?? (() => new Date().toISOString()))();
  const release = dryRun ? () => {} : acquireLock(dirs.lockFile);
  try {
    const plan = planSnapshots(dirs, loadHistory(dirs), loadMetrics(dirs));
    const result: AnalyticsApplyResult = { dryRun, plan, applied: false, quarantined: [], auditFiles: [] };
    if (dryRun || !plan.items.length) return result;
    if (!plan.valid) {
      for (const item of plan.items) {
        if (item.ok || item.kind === 'unsafe_file') continue;
        const moved = moveInto(safeJoin(dirs.analyticsPending, item.name), dirs.analyticsFailed);
        writeJsonAtomic(moved.replace(/\.json$/, '.error.json'), { kind: item.kind, errors: item.errors, renderId: item.renderId, platform: item.platform, failedAt: now, sourceFile: item.name, run: opts.run ?? null });
        result.quarantined.push(path.basename(moved));
      }
      return result;
    }
    for (const item of plan.items) {
      if (!item.ok) continue;
      const audit = freeAuditPath(dirs.analyticsApplied, item.snapshotId);
      writeJsonAtomic(audit, { snapshotId: item.snapshotId, outcome: item.outcome, note: item.note, appliedAt: now, sourceFile: item.name, run: opts.run ?? null, snapshot: item.raw });
      result.auditFiles.push(path.basename(audit));
    }
    saveMetrics(dirs, plan.store);
    for (const item of plan.items) rmSync(safeJoin(dirs.analyticsPending, item.name), { force: true });
    result.applied = true;
    return result;
  } finally {
    release();
  }
}
