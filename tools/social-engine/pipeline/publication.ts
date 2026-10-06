import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import type { PipelineDirs } from './dirs';
import { isRegularFile, moveInto, safeJoin, writeJsonAtomic } from './fs';
import {
  emptyPlatform,
  loadHistory,
  normalizeHistory,
  platformState,
  PLATFORMS,
  PUBLICATION_PROVIDERS,
  saveHistory,
  sortPlatforms,
  withDerivedPublication,
  type History,
  type Platform,
  type PlatformPublication,
  type PlatformState,
  type PublicationProvider,
  type RecordedPlatformState,
} from './history';
import { fileStemFor, parseRenderId } from './ids';
import { acquireLock } from './lock';
import { listContentFiles } from './queue';
import type { CiRun } from './ciRun';

/**
 * Publication receipts — how the repository LEARNS what happened on the socials.
 *
 * The repository never publishes and never calls a provider. An external
 * Publishing Agent (ChatGPT Work + Metricool) schedules/publishes a rendered
 * video, then writes ONE receipt per event per platform into
 * `publication/pending/`. This module validates receipts (contract + history +
 * state machine) and applies them to history.json, atomically per batch.
 *
 *   pending/*.json ─ validate all ─┬─ every receipt valid → history updated → applied/<receiptId>.json
 *                                  └─ any invalid → NOTHING applied; invalid → failed/ (+ .error.json)
 *
 * Contract: docs/SOCIAL_PUBLISHING_CONTRACT.md · schema: publication/schemas/.
 */
export const RECEIPT_VERSION = 1;
export const RECEIPT_STATUSES = ['scheduled', 'published', 'failed'] as const satisfies readonly RecordedPlatformState[];
export type ReceiptStatus = (typeof RECEIPT_STATUSES)[number];

export const MAX_RECEIPT_FILE_BYTES = 16 * 1024;
export const MAX_URL_CHARS = 2048;
export const MAX_ERROR_CHARS = 1000;
export const MAX_RECEIPT_NOTES = 500;
/** Provider post id / uuid: opaque, but never a path, a URL or free text. */
export const PROVIDER_REF_RE = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
/** Provider post UUID: same token, plus ONE optional leading "-" (Metricool returns signed numeric ids, e.g. -2035779932044177791). */
export const PROVIDER_UUID_RE = /^-?[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
export const RECORDED_BY_RE = /^[A-Za-z0-9][A-Za-z0-9 ._-]{0,79}$/;
/** Full ISO 8601 date-time WITH seconds and an explicit offset (Z or ±hh:mm). The original string is kept. */
export const ISO_TIMESTAMP_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,9})?(?:Z|([+-])(\d{2}):(\d{2}))$/;
/** Render ids accepted in a receipt (same grammar as pipeline/ids.ts). */
export const RENDER_ID_PATTERN = '^[a-z0-9]+(?:-[a-z0-9]+)*(?::[a-z0-9]+(?:-[a-z0-9]+)*){2,3}@(?:en|it)(?:\\+[a-z0-9]+(?:-[a-z0-9]+)*)?$';

type FieldKind = 'const' | 'renderId' | 'platform' | 'provider' | 'status' | 'timestamp' | 'providerRef' | 'providerUuid' | 'url' | 'error' | 'recordedBy' | 'notes' | 'schemaRef';
/** Every field a receipt may carry — the ONE table the parser and the JSON Schema are built from. */
export const RECEIPT_FIELDS = {
  $schema: { kind: 'schemaRef', description: 'Optional pointer to the schema (ignored).' },
  receiptVersion: { kind: 'const', description: `Contract version: always ${RECEIPT_VERSION}.` },
  renderId: { kind: 'renderId', description: 'The video, exactly as in history.json / render-summary.json (e.g. character-journey:dragonball:goku:part-01@en).' },
  platform: { kind: 'platform', description: 'Where the video is scheduled/published.' },
  provider: { kind: 'provider', description: 'Scheduling tool used by the Publishing Agent.' },
  status: { kind: 'status', description: 'What happened: scheduled (queued in the provider), published (live), failed.' },
  recordedAt: { kind: 'timestamp', description: 'When the agent recorded the event (ISO 8601 with offset).' },
  scheduledFor: { kind: 'timestamp', description: 'Planned go-live time, with the ORIGINAL offset (e.g. 2026-10-05T10:00:00+02:00).' },
  publishedAt: { kind: 'timestamp', description: 'When the post went live (ISO 8601 with offset).' },
  providerPostId: { kind: 'providerRef', description: 'Provider post id (Metricool may change it after edits).' },
  providerPostUuid: { kind: 'providerUuid', description: 'Provider post UUID (stable in Metricool; preferred for matching).' },
  plannerUrl: { kind: 'url', description: 'Provider planner/back-office link (debug). NOT the public post.' },
  publicUrl: { kind: 'url', description: 'Public URL of the post on the platform.' },
  error: { kind: 'error', description: 'What went wrong (failed only).' },
  recordedBy: { kind: 'recordedBy', description: 'Who wrote the receipt (e.g. "chatgpt-work-publishing-agent").' },
  notes: { kind: 'notes', description: 'Free notes for people. Stored in the audit trail, never interpreted.' },
} as const satisfies Record<string, { kind: FieldKind; description: string }>;
export type ReceiptField = keyof typeof RECEIPT_FIELDS;

const COMMON_REQUIRED = ['receiptVersion', 'renderId', 'platform', 'provider', 'status', 'recordedAt'] as const satisfies readonly ReceiptField[];
const COMMON_OPTIONAL = ['$schema', 'providerPostId', 'providerPostUuid', 'plannerUrl', 'recordedBy', 'notes'] as const satisfies readonly ReceiptField[];
/** Per status: extra required fields and extra allowed fields (anything else is an error). */
export const RECEIPT_STATUS_FIELDS: Record<ReceiptStatus, { required: readonly ReceiptField[]; optional: readonly ReceiptField[] }> = {
  scheduled: { required: ['scheduledFor'], optional: [] },
  published: { required: ['publishedAt'], optional: ['scheduledFor', 'publicUrl'] },
  failed: { required: ['error'], optional: ['scheduledFor'] },
};
export function receiptFieldsFor(status: ReceiptStatus): { required: ReceiptField[]; allowed: ReceiptField[] } {
  const extra = RECEIPT_STATUS_FIELDS[status];
  const required = [...COMMON_REQUIRED, ...extra.required];
  return { required, allowed: [...required, ...COMMON_OPTIONAL, ...extra.optional] };
}

export type PublicationReceipt = {
  receiptVersion: typeof RECEIPT_VERSION;
  renderId: string;
  platform: Platform;
  provider: PublicationProvider;
  status: ReceiptStatus;
  recordedAt: string;
  scheduledFor: string | null;
  publishedAt: string | null;
  providerPostId: string | null;
  providerPostUuid: string | null;
  plannerUrl: string | null;
  publicUrl: string | null;
  error: string | null;
  recordedBy: string | null;
  notes: string | null;
};

// ─── strict JSON ───────────────────────────────────────────────────────────

/** JSON.parse + rejection of duplicate keys (JSON.parse silently keeps the last one). */
export function parseStrictJson(text: string): unknown {
  const value = JSON.parse(text) as unknown; // syntax errors surface here
  const stack: { keys: Set<string> | null; expectKey: boolean }[] = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      let j = i + 1;
      while (text[j] !== '"') j += text[j] === '\\' ? 2 : 1;
      const top = stack[stack.length - 1];
      if (top?.keys && top.expectKey) {
        const key = JSON.parse(text.slice(i, j + 1)) as string;
        if (top.keys.has(key)) throw new Error(`duplicate key "${key}"`);
        top.keys.add(key);
        top.expectKey = false;
      }
      i = j;
    } else if (ch === '{') stack.push({ keys: new Set(), expectKey: true });
    else if (ch === '[') stack.push({ keys: null, expectKey: false });
    else if (ch === '}' || ch === ']') stack.pop();
    else if (ch === ',' && stack[stack.length - 1]?.keys) stack[stack.length - 1].expectKey = true;
  }
  return value;
}

/** Reads a receipt file: regular file only (no symlink), small, strict JSON. */
export function readReceiptFile(file: string): unknown {
  if (!isRegularFile(file)) throw new Error('not a regular file');
  if (lstatSync(file).size > MAX_RECEIPT_FILE_BYTES) throw new Error(`file too large (> ${MAX_RECEIPT_FILE_BYTES} bytes)`);
  try {
    return parseStrictJson(readFileSync(file, 'utf8'));
  } catch (err) {
    throw new Error(`invalid JSON: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ─── field validation ──────────────────────────────────────────────────────

export function isIsoTimestamp(value: string): boolean {
  const m = ISO_TIMESTAMP_RE.exec(value);
  if (!m) return false;
  const [y, mo, d, h, mi, s] = m.slice(1, 7).map(Number);
  const daysInMonth = new Date(Date.UTC(y, mo, 0)).getUTCDate();
  if (mo < 1 || mo > 12 || d < 1 || d > daysInMonth || h > 23 || mi > 59 || s > 59) return false;
  if (m[8] && (Number(m[8]) > 14 || Number(m[9]) > 59)) return false;
  return Number.isFinite(Date.parse(value));
}

export function isSafeHttpsUrl(value: string): boolean {
  if (value.length > MAX_URL_CHARS || /\s/.test(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && url.hostname.includes('.');
  } catch {
    return false;
  }
}

const hasControlChars = (v: string) => [...v].some((c) => { const n = c.charCodeAt(0); return (n < 32 && c !== '\n' && c !== '\t') || n === 127; });

function checkField(field: ReceiptField, value: unknown): string | null {
  const kind: FieldKind = RECEIPT_FIELDS[field].kind;
  const text = typeof value === 'string' ? value : null;
  switch (kind) {
    case 'schemaRef':
      return text !== null && text.length <= 200 ? null : 'must be a string (≤ 200 chars)';
    case 'const':
      return value === RECEIPT_VERSION ? null : `must be ${RECEIPT_VERSION}`;
    case 'renderId':
      if (text === null) return 'must be a string';
      try {
        parseRenderId(text);
        return null;
      } catch (err) {
        return (err as Error).message;
      }
    case 'platform':
      return PLATFORMS.includes(value as Platform) ? null : `must be one of ${PLATFORMS.join(', ')}`;
    case 'provider':
      return PUBLICATION_PROVIDERS.includes(value as PublicationProvider) ? null : `must be one of ${PUBLICATION_PROVIDERS.join(', ')}`;
    case 'status':
      return RECEIPT_STATUSES.includes(value as ReceiptStatus) ? null : `must be one of ${RECEIPT_STATUSES.join(', ')}`;
    case 'timestamp':
      return text !== null && isIsoTimestamp(text) ? null : 'must be a full ISO 8601 date-time with seconds and offset (e.g. 2026-10-05T10:00:00+02:00)';
    case 'providerRef':
      return text !== null && PROVIDER_REF_RE.test(text) ? null : 'must match [A-Za-z0-9][A-Za-z0-9._:-]{0,127}';
    case 'providerUuid':
      return text !== null && PROVIDER_UUID_RE.test(text) ? null : 'must match -?[A-Za-z0-9][A-Za-z0-9._:-]{0,127}';
    case 'url':
      return text !== null && isSafeHttpsUrl(text) ? null : `must be an https URL without credentials (≤ ${MAX_URL_CHARS} chars)`;
    case 'error':
      return text !== null && text.trim().length > 0 && text.length <= MAX_ERROR_CHARS && !hasControlChars(text) ? null : `must be a non-empty string (≤ ${MAX_ERROR_CHARS} chars, no control characters)`;
    case 'recordedBy':
      return text !== null && RECORDED_BY_RE.test(text) ? null : 'must match [A-Za-z0-9][A-Za-z0-9 ._-]{0,79}';
    case 'notes':
      return text !== null && text.length <= MAX_RECEIPT_NOTES && !hasControlChars(text) ? null : `must be a string (≤ ${MAX_RECEIPT_NOTES} chars, no control characters)`;
    default: {
      const never: never = kind;
      return `unknown field kind ${String(never)}`;
    }
  }
}

export type ParsedReceipt = { ok: true; receipt: PublicationReceipt } | { ok: false; errors: string[] };

/** Contract check (structure only — history and transitions are checked by planReceipts). */
export function parseReceipt(raw: unknown): ParsedReceipt {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return { ok: false, errors: ['a receipt must be ONE JSON object'] };
  const obj = raw as Record<string, unknown>;
  const errors: string[] = [];
  const status = obj.status as ReceiptStatus;
  if (!RECEIPT_STATUSES.includes(status)) return { ok: false, errors: [`status: must be one of ${RECEIPT_STATUSES.join(', ')}`] };
  const { required, allowed } = receiptFieldsFor(status);
  for (const key of Object.keys(obj)) {
    if (!allowed.includes(key as ReceiptField)) {
      errors.push(key in RECEIPT_FIELDS ? `${key}: not allowed when status is "${status}"` : `${key}: unknown field`);
    }
  }
  for (const key of required) if (obj[key] === undefined || obj[key] === null) errors.push(`${key}: required when status is "${status}"`);
  for (const key of allowed) {
    if (obj[key] === undefined || ((obj[key] === null) && required.includes(key))) continue; // null is never a valid value
    const problem = checkField(key, obj[key]);
    if (problem) errors.push(`${key}: ${problem}`);
  }
  if (errors.length) return { ok: false, errors };
  const s = (k: ReceiptField) => (typeof obj[k] === 'string' ? (obj[k] as string) : null);
  return {
    ok: true,
    receipt: {
      receiptVersion: RECEIPT_VERSION,
      renderId: obj.renderId as string,
      platform: obj.platform as Platform,
      provider: obj.provider as PublicationProvider,
      status,
      recordedAt: obj.recordedAt as string,
      scheduledFor: s('scheduledFor'),
      publishedAt: s('publishedAt'),
      providerPostId: s('providerPostId'),
      providerPostUuid: s('providerPostUuid'),
      plannerUrl: s('plannerUrl'),
      publicUrl: s('publicUrl'),
      error: s('error'),
      recordedBy: s('recordedBy'),
      notes: s('notes'),
    },
  };
}

// ─── identity ──────────────────────────────────────────────────────────────

/**
 * Stable, filesystem-safe receipt id, derived from the event itself:
 *   <fileStem>.<platform>.<status>.<sha256(event)[0..12]>
 *   dragonball_goku_character-journey_part-01_en.instagram.scheduled.4f1c2a9e0b7d
 * The hash covers every fact of the event (render, platform, provider, status,
 * timestamps incl. recordedAt, provider refs, URLs, error) — NOT the file name,
 * recordedBy or notes. The same event sent twice → the same id → applied once.
 */
export function receiptIdOf(r: PublicationReceipt): string {
  const facts = [r.renderId, r.platform, r.provider, r.status, r.recordedAt, r.scheduledFor, r.publishedAt, r.providerPostId, r.providerPostUuid, r.plannerUrl, r.publicUrl, r.error];
  const hash = createHash('sha256').update(JSON.stringify(facts)).digest('hex').slice(0, 12);
  return `${fileStemFor(parseRenderId(r.renderId))}.${r.platform}.${r.status}.${hash}`;
}

// ─── state machine ─────────────────────────────────────────────────────────

/**
 * Legal moves of ONE platform of ONE render (notScheduled = no entry yet):
 *
 *   notScheduled → scheduled | published (immediate publish / import) | failed
 *   scheduled    → published | failed            (same provider post, or no conflicting id)
 *   scheduled    → scheduled                     ONLY the same provider post (uuid/id match):
 *                                                identical = no-op, new scheduledFor = reschedule
 *   failed       → scheduled (retry) | published | failed
 *   published    → published                     ONLY the same post, no conflicting value (enrichment / no-op)
 *   published    → scheduled | failed            REJECTED (it's live: never schedule it again)
 *
 * A receipt whose id was already applied is a no-op, whatever the current state.
 */
export const PUBLICATION_TRANSITIONS: Record<PlatformState, readonly ReceiptStatus[]> = {
  notScheduled: ['scheduled', 'published', 'failed'],
  scheduled: ['scheduled', 'published', 'failed'],
  failed: ['scheduled', 'published', 'failed'],
  published: ['published'],
};

export type TransitionOutcome =
  | { ok: true; outcome: 'applied' | 'unchanged'; from: PlatformState; to: PlatformState; entry: PlatformPublication; note: string | null }
  | { ok: false; from: PlatformState; to: ReceiptStatus; error: string };

type PostMatch = 'match' | 'conflict' | 'unknown';
/** Is the receipt about the provider post already recorded? UUID first (stable), then id. */
export function matchPost(entry: PlatformPublication, r: PublicationReceipt): PostMatch {
  if (entry.provider !== null && entry.provider !== r.provider) return 'conflict';
  if (entry.providerPostUuid && r.providerPostUuid) return entry.providerPostUuid === r.providerPostUuid ? 'match' : 'conflict';
  if (entry.providerPostId && r.providerPostId) return entry.providerPostId === r.providerPostId ? 'match' : 'conflict';
  return 'unknown';
}

const describePost = (e: Pick<PlatformPublication, 'provider' | 'providerPostUuid' | 'providerPostId'>) =>
  [e.provider ?? 'unknown provider', e.providerPostUuid && `uuid ${e.providerPostUuid}`, e.providerPostId && `id ${e.providerPostId}`].filter(Boolean).join(', ');

const STATE_KEYS = ['provider', 'status', 'scheduledFor', 'scheduledAt', 'publishedAt', 'failedAt', 'providerPostId', 'providerPostUuid', 'plannerUrl', 'publicUrl', 'lastError', 'attempts'] as const;
const sameState = (a: PlatformPublication, b: PlatformPublication) => STATE_KEYS.every((k) => a[k] === b[k]);

/** Pure: the next state of a platform entry for a receipt (nothing is mutated). */
export function nextPlatformState(current: PlatformPublication | undefined, r: PublicationReceipt, receiptId: string, now: string): TransitionOutcome {
  const from: PlatformState = current?.status ?? 'notScheduled';
  const reject = (error: string): TransitionOutcome => ({ ok: false, from, to: r.status, error });
  if (current?.receipts.includes(receiptId)) return { ok: true, outcome: 'unchanged', from, to: from, entry: current, note: 'receipt already applied' };
  if (!PUBLICATION_TRANSITIONS[from].includes(r.status)) {
    return reject(`${r.platform} is already ${from}${current?.publishedAt ? ` (${current.publishedAt})` : ''} — a ${r.status} receipt can't change a live post; never schedule it again`);
  }
  const base = current ? { ...current, receipts: [...current.receipts] } : emptyPlatform(r.platform, r.provider, now);
  const refs = (prefer: 'receipt' | 'keep') => ({
    providerPostId: prefer === 'receipt' ? r.providerPostId : (r.providerPostId ?? base.providerPostId),
    providerPostUuid: prefer === 'receipt' ? r.providerPostUuid : (r.providerPostUuid ?? base.providerPostUuid),
    plannerUrl: prefer === 'receipt' ? r.plannerUrl : (r.plannerUrl ?? base.plannerUrl),
  });
  const match = current ? matchPost(current, r) : 'unknown';
  let next: PlatformPublication;
  let note: string | null = null;

  switch (r.status) {
    case 'scheduled': {
      if (from === 'scheduled') {
        if (match === 'conflict') return reject(`${r.platform} is already scheduled (${describePost(base)}); a different post (${describePost({ ...r })}) would publish the video twice`);
        if (match === 'unknown') return reject(`${r.platform} is already scheduled; this receipt shares no providerPostUuid/providerPostId with it, so it can't be proven to be the same post`);
        next = { ...base, ...refs('keep'), scheduledFor: r.scheduledFor };
        if (base.scheduledFor !== r.scheduledFor) note = `rescheduled from ${base.scheduledFor ?? '?'}`;
      } else {
        // First scheduling, or a retry after a failure: a brand-new provider post.
        next = { ...base, provider: r.provider, status: 'scheduled', ...refs('receipt'), scheduledFor: r.scheduledFor, scheduledAt: r.recordedAt, publishedAt: null, publicUrl: null, attempts: base.attempts + 1 };
        if (from === 'failed') note = `retry #${next.attempts}`;
      }
      break;
    }
    case 'published': {
      if (match === 'conflict' && from !== 'failed') return reject(`${r.platform} is ${from} as another post (${describePost(base)}); this receipt describes ${describePost({ ...r })}`);
      if (from === 'published') {
        if (base.publishedAt && r.publishedAt && Date.parse(base.publishedAt) !== Date.parse(r.publishedAt)) return reject(`${r.platform} was already published at ${base.publishedAt}; receipt says ${r.publishedAt}`);
        if (base.publicUrl && r.publicUrl && base.publicUrl !== r.publicUrl) return reject(`${r.platform} already has publicUrl ${base.publicUrl}; receipt says ${r.publicUrl}`);
        next = { ...base, ...refs('keep'), publicUrl: base.publicUrl ?? r.publicUrl, scheduledFor: base.scheduledFor ?? r.scheduledFor };
      } else {
        next = {
          ...base,
          provider: r.provider,
          status: 'published',
          ...refs('keep'),
          scheduledFor: r.scheduledFor ?? base.scheduledFor,
          publishedAt: r.publishedAt,
          publicUrl: r.publicUrl,
          attempts: from === 'notScheduled' ? 1 : base.attempts,
        };
        if (from === 'notScheduled') note = 'published without a scheduled receipt (immediate publish / import)';
      }
      break;
    }
    case 'failed': {
      if (from === 'scheduled' && match === 'conflict') return reject(`${r.platform} is scheduled as another post (${describePost(base)}); the failure describes ${describePost({ ...r })}`);
      next = { ...base, provider: r.provider, status: 'failed', ...refs('keep'), scheduledFor: r.scheduledFor ?? base.scheduledFor, failedAt: r.recordedAt, lastError: r.error, attempts: from === 'notScheduled' ? 1 : base.attempts };
      break;
    }
    default: {
      const never: never = r.status;
      return reject(`unknown status ${String(never)}`);
    }
  }
  if (current && sameState(current, next)) return { ok: true, outcome: 'unchanged', from, to: from, entry: current, note: 'already recorded (same post, same values)' };
  next.receipts.push(receiptId);
  next.updatedAt = now;
  return { ok: true, outcome: 'applied', from, to: next.status, entry: next, note };
}

// ─── batch planning & application ──────────────────────────────────────────

export type ReceiptIssueKind = 'unsafe_file' | 'invalid' | 'unknown_render' | 'not_rendered' | 'transition';

export type ReceiptPlanItem =
  | {
      name: string;
      ok: true;
      raw: unknown;
      receipt: PublicationReceipt;
      receiptId: string;
      from: PlatformState;
      to: PlatformState;
      outcome: 'applied' | 'unchanged';
      note: string | null;
    }
  | {
      name: string;
      ok: false;
      raw: unknown;
      kind: ReceiptIssueKind;
      errors: string[];
      renderId: string | null;
      platform: string | null;
      /** State found in history (when known) and the state the receipt asked for. */
      currentState: PlatformState | null;
      requestedState: string | null;
    };

export type ReceiptPlan = { items: ReceiptPlanItem[]; history: History; valid: boolean };

const STATUS_ORDER: Record<ReceiptStatus, number> = { scheduled: 0, failed: 1, published: 2 };

/**
 * Validates every pending receipt and simulates them, in event order, on a COPY
 * of the history (nothing is written). `history` in the result is the state
 * after all valid receipts; `valid` is false as soon as one receipt is not.
 */
export function planReceipts(dirs: PipelineDirs, history: History, now: string, dir: string = dirs.publicationPending): ReceiptPlan {
  const { entries, unsafe } = listContentFiles(dir);
  const items: ReceiptPlanItem[] = unsafe.map((name) => ({
    name, ok: false, raw: null, kind: 'unsafe_file', errors: ['file name must match [A-Za-z0-9][A-Za-z0-9._-]*.json and be a regular file'],
    renderId: null, platform: null, currentState: null, requestedState: null,
  }));
  const parsed: { name: string; raw: unknown; receipt: PublicationReceipt }[] = [];
  for (const name of entries) {
    let raw: unknown = null;
    const fail = (kind: ReceiptIssueKind, errors: string[]) => {
      const o = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;
      items.push({ name, ok: false, raw, kind, errors, renderId: typeof o.renderId === 'string' ? o.renderId : null, platform: typeof o.platform === 'string' ? o.platform : null, currentState: null, requestedState: typeof o.status === 'string' ? o.status : null });
    };
    try {
      raw = readReceiptFile(safeJoin(dir, name));
    } catch (err) {
      fail('invalid', [(err as Error).message]);
      continue;
    }
    const p = parseReceipt(raw);
    if (!p.ok) fail('invalid', p.errors);
    else parsed.push({ name, raw, receipt: p.receipt });
  }

  // Simulate on a deep copy, in event order (several receipts may concern the same render/platform).
  const sim = normalizeHistory(JSON.parse(JSON.stringify(history)) as unknown);
  parsed.sort((a, b) => Date.parse(a.receipt.recordedAt) - Date.parse(b.receipt.recordedAt) || STATUS_ORDER[a.receipt.status] - STATUS_ORDER[b.receipt.status] || a.name.localeCompare(b.name));
  for (const { name, raw, receipt } of parsed) {
    const record = sim.records[receipt.renderId];
    const issue = (kind: ReceiptIssueKind, error: string, currentState: PlatformState | null) =>
      items.push({ name, ok: false, raw, kind, errors: [error], renderId: receipt.renderId, platform: receipt.platform, currentState, requestedState: receipt.status });
    if (!record) {
      issue('unknown_render', `unknown renderId ${receipt.renderId}: no such video in history.json (use the renderId of a rendered video, from history / render-summary.json)`, null);
      continue;
    }
    if (record.renderStatus !== 'rendered') {
      issue('not_rendered', `${receipt.renderId} is ${record.renderStatus}, not rendered — only rendered videos can be scheduled or published`, platformState(record, receipt.platform));
      continue;
    }
    const receiptId = receiptIdOf(receipt);
    const current = record.platforms.find((p) => p.platform === receipt.platform);
    const result = nextPlatformState(current, receipt, receiptId, now);
    if (!result.ok) {
      issue('transition', `${result.from} → ${result.to} refused: ${result.error}`, result.from);
      continue;
    }
    if (result.outcome === 'applied') {
      record.platforms = sortPlatforms([...record.platforms.filter((p) => p.platform !== receipt.platform), result.entry]);
      record.updatedAt = now;
      withDerivedPublication(record);
    }
    items.push({ name, ok: true, raw, receipt, receiptId, from: result.from, to: result.to, outcome: result.outcome, note: result.note });
  }
  items.sort((a, b) => a.name.localeCompare(b.name));
  return { items, history: sim, valid: items.every((i) => i.ok) };
}

export type ApplyResult = {
  dryRun: boolean;
  plan: ReceiptPlan;
  /** True when the history was updated (all receipts valid, not a dry run). */
  applied: boolean;
  /** Files moved to publication/failed/ (invalid batch). */
  quarantined: string[];
  /** Audit files written to publication/applied/. */
  auditFiles: string[];
};

/** `<base>.json`, or `<base>-2.json`, `-3`… when taken (an audit file is never overwritten). */
export function freeAuditPath(dir: string, base: string): string {
  let target = safeJoin(dir, `${base}.json`);
  for (let n = 2; existsSync(target); n++) target = safeJoin(dir, `${base}-${n}.json`);
  return target;
}

/**
 * Applies every pending receipt — ALL OR NOTHING:
 *   - all valid → history updated, each receipt archived as publication/applied/<receiptId>.json
 *     (original receipt + transition + run), pending files removed;
 *   - any invalid → history untouched, NO receipt applied; the invalid ones are moved to
 *     publication/failed/ with a .error.json (the valid ones stay pending for the next run).
 * Holds the pipeline lock (history has one writer at a time). Crash-safe: audit
 * files first, then history, then the pending files are removed — a re-run of a
 * half-done apply sees the receipts as already applied (no-op).
 */
export function applyPendingReceipts(opts: { dirs: PipelineDirs; dryRun?: boolean; now?: () => string; run?: CiRun | null }): ApplyResult {
  const { dirs, dryRun = false } = opts;
  const now = (opts.now ?? (() => new Date().toISOString()))();
  const release = dryRun ? () => {} : acquireLock(dirs.lockFile);
  try {
    const plan = planReceipts(dirs, loadHistory(dirs), now);
    const result: ApplyResult = { dryRun, plan, applied: false, quarantined: [], auditFiles: [] };
    if (dryRun || !plan.items.length) return result;
    if (!plan.valid) {
      for (const item of plan.items) {
        if (item.ok || item.kind === 'unsafe_file') continue;
        const moved = moveInto(safeJoin(dirs.publicationPending, item.name), dirs.publicationFailed);
        writeJsonAtomic(moved.replace(/\.json$/, '.error.json'), {
          kind: item.kind,
          errors: item.errors,
          renderId: item.renderId,
          platform: item.platform,
          currentState: item.currentState,
          requestedState: item.requestedState,
          failedAt: now,
          sourceFile: item.name,
          run: opts.run ?? null,
        });
        result.quarantined.push(path.basename(moved));
      }
      return result;
    }
    for (const item of plan.items) {
      if (!item.ok) continue;
      const audit = freeAuditPath(dirs.publicationApplied, item.receiptId);
      writeJsonAtomic(audit, {
        receiptId: item.receiptId,
        outcome: item.outcome,
        transition: { from: item.from, to: item.to },
        note: item.note,
        appliedAt: now,
        sourceFile: item.name,
        run: opts.run ?? null,
        receipt: item.raw,
      });
      result.auditFiles.push(path.basename(audit));
    }
    saveHistory(dirs, plan.history);
    for (const item of plan.items) rmSync(safeJoin(dirs.publicationPending, item.name), { force: true });
    result.applied = true;
    return result;
  } finally {
    release();
  }
}
