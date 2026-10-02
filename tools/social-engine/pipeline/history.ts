import { existsSync } from 'node:fs';
import type { VideoLocale } from '../config/types';
import type { PipelineDirs } from './dirs';
import { MAX_STATE_FILE_BYTES, readJsonFile, writeJsonAtomic } from './fs';

/**
 * Persistent memory of the pipeline: one record per renderId, in
 * `history/history.json` (versioned — it's what prevents the same video from
 * being produced twice, or scheduled twice, across machines and sessions).
 *
 * Two independent state machines:
 *   renderStatus  queued → rendering → rendered | failed   (failed → queued = retry)
 *   publication   PER PLATFORM (instagram · tiktok · youtube), driven only by
 *                 publication receipts (pipeline/publication.ts):
 *                 notScheduled → scheduled → published,  scheduled → failed → scheduled …
 *                 `publicationStatus` is the deterministic aggregate of the platforms.
 */
export const RENDER_STATUSES = ['queued', 'rendering', 'rendered', 'failed'] as const;
export type RenderStatus = (typeof RENDER_STATUSES)[number];
/**
 * Aggregate over the platforms that have a state (platforms never touched don't count):
 *   notPublished        no platform has a state
 *   scheduled           ≥ 1 scheduled, none published
 *   partiallyPublished  ≥ 1 published and ≥ 1 other platform scheduled/failed
 *   published           every platform with a state is published
 *   failed              only failures (nothing scheduled or published)
 */
export const PUBLICATION_STATUSES = ['notPublished', 'scheduled', 'partiallyPublished', 'published', 'failed'] as const;
export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number];
export const PLATFORMS = ['instagram', 'tiktok', 'youtube'] as const;
export type Platform = (typeof PLATFORMS)[number];
/** Who scheduled/published the video for us. The repository never calls them: the external Publishing Agent does. */
export const PUBLICATION_PROVIDERS = ['metricool'] as const;
export type PublicationProvider = (typeof PUBLICATION_PROVIDERS)[number];
/** State of one platform. `notScheduled` = no entry in `platforms[]`. */
export const PLATFORM_STATES = ['notScheduled', 'scheduled', 'published', 'failed'] as const;
export type PlatformState = (typeof PLATFORM_STATES)[number];
export type RecordedPlatformState = Exclude<PlatformState, 'notScheduled'>;

/**
 * Publication state of ONE render on ONE platform. Timestamps are kept exactly as
 * the receipt gave them (ISO 8601 with their original offset); `updatedAt` is
 * when the pipeline applied the last receipt (UTC).
 */
export type PlatformPublication = {
  platform: Platform;
  /** null only for entries migrated from the pre-receipt format (provider unknown). */
  provider: PublicationProvider | null;
  status: RecordedPlatformState;
  /** When the post goes / went live according to the scheduler (scheduled receipts). */
  scheduledFor: string | null;
  /** recordedAt of the receipt that scheduled it. */
  scheduledAt: string | null;
  publishedAt: string | null;
  /** recordedAt of the last failed receipt. */
  failedAt: string | null;
  /** Provider ids: kept apart — Metricool may change the id while the UUID stays stable. */
  providerPostId: string | null;
  providerPostUuid: string | null;
  /** Provider back-office link (debug / manual review). NOT the public post. */
  plannerUrl: string | null;
  /** The public post on the platform (published only). */
  publicUrl: string | null;
  lastError: string | null;
  /** Scheduling attempts (a retry after a failure counts). */
  attempts: number;
  /** Receipt ids that changed this entry, oldest first (audit: publication/applied/<id>.json). */
  receipts: string[];
  updatedAt: string;
};

/** Where the MP4 of a CI render can be downloaded (GitHub workflow artifact; null for local renders). */
export type RenderArtifact = {
  name: string;
  runId: string;
  runAttempt: string;
  runUrl: string;
  /** Paths inside the artifact. */
  video: string;
  manifest: string;
  /** sha256 of the MP4 (also in the manifest); null when unknown. */
  sha256: string | null;
  /** The artifact is deleted by GitHub after this (retention). */
  expiresAt: string;
};

export type HistoryRecord = {
  renderId: string;
  contentId: string;
  template: string;
  anime: string;
  subject: string;
  locale: VideoLocale;
  variant: string | null;
  /** Part key for a series (`part-02`), null for a single video. */
  segment: string | null;
  /** Fingerprint of the part's stops when it was queued/rendered (detects data drift). */
  segmentFingerprint: string | null;
  createdAt: string;
  updatedAt: string;
  renderStatus: RenderStatus;
  renderedAt: string | null;
  /** Repo-relative paths (the MP4 itself is never committed). */
  outputFile: string | null;
  manifestFile: string | null;
  /** Content file name (in content/<state>/). */
  sourceFile: string | null;
  durationSeconds: number | null;
  attempts: number;
  lastError: string | null;
  /** CI artifact holding the MP4 (null: rendered locally / before artifacts were recorded). */
  artifact: RenderArtifact | null;
  /** Derived from `platforms` (never set by hand). */
  publicationStatus: PublicationStatus;
  /** Earliest publishedAt over the platforms (derived). */
  publishedAt: string | null;
  /** One entry per platform that has a state, in PLATFORMS order. */
  platforms: PlatformPublication[];
};

export type History = { schemaVersion: 1; records: Record<string, HistoryRecord> };

/** Allowed renderStatus moves. `rendering → queued` = recovery after a crash; `rendered → queued` = explicit re-render. */
export const RENDER_TRANSITIONS: Record<RenderStatus, readonly RenderStatus[]> = {
  queued: ['rendering', 'failed'],
  rendering: ['rendered', 'failed', 'queued'],
  rendered: ['queued'],
  failed: ['queued', 'rendering'],
};

export function canTransition(from: RenderStatus, to: RenderStatus): boolean {
  return RENDER_TRANSITIONS[from].includes(to);
}

export function emptyHistory(): History {
  return { schemaVersion: 1, records: {} };
}

export function loadHistory(dirs: PipelineDirs): History {
  if (!existsSync(dirs.historyFile)) return emptyHistory();
  return normalizeHistory(readJsonFile(dirs.historyFile, MAX_STATE_FILE_BYTES), dirs.historyFile);
}

/**
 * Accepts every format history.json ever had and returns the current one:
 *   - records written before series existed have no segment fields (single videos);
 *   - records written before receipts have no `artifact` and may hold the old
 *     `platforms: [{ platform, publishedAt, url }]` entries → migrated to
 *     published entries (provider unknown, publicUrl = url);
 *   - publicationStatus / publishedAt are always re-derived from the platforms.
 */
export function normalizeHistory(raw: unknown, source = 'history'): History {
  const h = raw as Partial<History> | null;
  if (!h || h.schemaVersion !== 1 || typeof h.records !== 'object' || h.records === null) {
    throw new Error(`${source}: unsupported history format`);
  }
  const records: Record<string, HistoryRecord> = {};
  for (const [key, r] of Object.entries(h.records)) {
    const platforms = (Array.isArray(r.platforms) ? r.platforms : []).map((p) => normalizePlatform(p, `${source}: ${key}`));
    const record: HistoryRecord = { ...r, segment: r.segment ?? null, segmentFingerprint: r.segmentFingerprint ?? null, artifact: r.artifact ?? null, platforms: sortPlatforms(platforms) };
    records[key] = withDerivedPublication(record);
  }
  return { schemaVersion: 1, records };
}

function normalizePlatform(raw: unknown, where: string): PlatformPublication {
  const p = (raw ?? {}) as Record<string, unknown>;
  const str = (k: string) => (typeof p[k] === 'string' && p[k] !== '' ? (p[k] as string) : null);
  const platform = p.platform as Platform;
  if (!PLATFORMS.includes(platform)) throw new Error(`${where}: unknown platform "${String(p.platform)}"`);
  if (typeof p.status !== 'string') {
    // Pre-receipt format: { platform, publishedAt, url } meant "published there".
    return { ...emptyPlatform(platform, null, str('publishedAt') ?? ''), status: 'published', publishedAt: str('publishedAt'), publicUrl: str('url') };
  }
  const status = p.status as RecordedPlatformState;
  if (!PLATFORM_STATES.includes(status) || (status as PlatformState) === 'notScheduled') throw new Error(`${where}: invalid ${platform} status "${status}"`);
  const provider = p.provider === null ? null : (p.provider as PublicationProvider);
  if (provider !== null && !PUBLICATION_PROVIDERS.includes(provider)) throw new Error(`${where}: unknown provider "${String(p.provider)}"`);
  return {
    platform,
    provider,
    status,
    scheduledFor: str('scheduledFor'),
    scheduledAt: str('scheduledAt'),
    publishedAt: str('publishedAt'),
    failedAt: str('failedAt'),
    providerPostId: str('providerPostId'),
    providerPostUuid: str('providerPostUuid'),
    plannerUrl: str('plannerUrl'),
    publicUrl: str('publicUrl'),
    lastError: str('lastError'),
    attempts: typeof p.attempts === 'number' ? p.attempts : 0,
    receipts: Array.isArray(p.receipts) ? p.receipts.filter((x): x is string => typeof x === 'string') : [],
    updatedAt: str('updatedAt') ?? '',
  };
}

export function emptyPlatform(platform: Platform, provider: PublicationProvider | null, now: string): PlatformPublication {
  return {
    platform, provider, status: 'scheduled', scheduledFor: null, scheduledAt: null, publishedAt: null, failedAt: null,
    providerPostId: null, providerPostUuid: null, plannerUrl: null, publicUrl: null, lastError: null, attempts: 0, receipts: [], updatedAt: now,
  };
}

export function sortPlatforms(platforms: PlatformPublication[]): PlatformPublication[] {
  return [...platforms].sort((a, b) => PLATFORMS.indexOf(a.platform) - PLATFORMS.indexOf(b.platform));
}

export function platformState(record: Pick<HistoryRecord, 'platforms'>, platform: Platform): PlatformState {
  return record.platforms.find((p) => p.platform === platform)?.status ?? 'notScheduled';
}

/** The aggregate rule (see PUBLICATION_STATUSES). */
export function derivePublicationStatus(platforms: readonly Pick<PlatformPublication, 'status'>[]): PublicationStatus {
  if (!platforms.length) return 'notPublished';
  const has = (s: RecordedPlatformState) => platforms.some((p) => p.status === s);
  if (has('published')) return platforms.every((p) => p.status === 'published') ? 'published' : 'partiallyPublished';
  if (has('scheduled')) return 'scheduled';
  return 'failed';
}

/** Re-derives publicationStatus + publishedAt from the platforms (in place; returns the record). */
export function withDerivedPublication(record: HistoryRecord): HistoryRecord {
  record.publicationStatus = derivePublicationStatus(record.platforms);
  const times = record.platforms.flatMap((p) => (p.status === 'published' && p.publishedAt ? [p.publishedAt] : []));
  record.publishedAt = times.length ? times.reduce((a, b) => (Date.parse(b) < Date.parse(a) ? b : a)) : null;
  return record;
}

/** Saved with sorted keys: stable diffs, easy to read for people and agents. */
export function saveHistory(dirs: PipelineDirs, history: History): void {
  const records: Record<string, HistoryRecord> = {};
  for (const key of Object.keys(history.records).sort()) records[key] = history.records[key];
  writeJsonAtomic(dirs.historyFile, { schemaVersion: 1, records });
}

export type RecordIdentity = Pick<HistoryRecord, 'renderId' | 'contentId' | 'template' | 'anime' | 'subject' | 'locale' | 'variant' | 'segment' | 'segmentFingerprint'>;

/** Creates the record (as `queued`) if missing; returns it. */
export function ensureRecord(history: History, identity: RecordIdentity, now: string, sourceFile: string | null): HistoryRecord {
  const existing = history.records[identity.renderId];
  if (existing) return existing;
  const record: HistoryRecord = {
    ...identity,
    createdAt: now,
    updatedAt: now,
    renderStatus: 'queued',
    renderedAt: null,
    outputFile: null,
    manifestFile: null,
    sourceFile,
    durationSeconds: null,
    attempts: 0,
    lastError: null,
    artifact: null,
    publicationStatus: 'notPublished',
    publishedAt: null,
    platforms: [],
  };
  history.records[identity.renderId] = record;
  return record;
}

/** Applies a renderStatus change, refusing illegal moves. */
export function transition(record: HistoryRecord, to: RenderStatus, now: string, patch: Partial<HistoryRecord> = {}): HistoryRecord {
  if (record.renderStatus !== to && !canTransition(record.renderStatus, to)) {
    throw new Error(`Illegal status change for ${record.renderId}: ${record.renderStatus} → ${to}`);
  }
  Object.assign(record, patch, { renderStatus: to, updatedAt: now });
  return record;
}

export function recordsOf(history: History, contentId: string): HistoryRecord[] {
  return Object.values(history.records).filter((r) => r.contentId === contentId);
}
