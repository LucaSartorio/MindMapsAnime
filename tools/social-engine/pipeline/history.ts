import { existsSync } from 'node:fs';
import type { VideoLocale } from '../config/types';
import type { PipelineDirs } from './dirs';
import { readJsonFile, writeJsonAtomic } from './fs';

/**
 * Persistent memory of the pipeline: one record per renderId, in
 * `history/history.json` (versioned — it's what prevents the same video from
 * being produced twice, across machines and sessions).
 *
 * Two independent state machines:
 *   renderStatus       queued → rendering → rendered | failed   (failed → queued = retry)
 *   publicationStatus  notPublished → partiallyPublished → published   (reserved: no publishing yet)
 */
export const RENDER_STATUSES = ['queued', 'rendering', 'rendered', 'failed'] as const;
export type RenderStatus = (typeof RENDER_STATUSES)[number];
export const PUBLICATION_STATUSES = ['notPublished', 'partiallyPublished', 'published'] as const;
export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number];
export const PLATFORMS = ['youtube', 'tiktok', 'instagram'] as const;
export type Platform = (typeof PLATFORMS)[number];

export type PlatformPublication = { platform: Platform; publishedAt: string; url?: string };

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
  publicationStatus: PublicationStatus;
  publishedAt: string | null;
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
  const raw = readJsonFile(dirs.historyFile) as Partial<History>;
  if (raw.schemaVersion !== 1 || typeof raw.records !== 'object' || raw.records === null) {
    throw new Error(`${dirs.historyFile}: unsupported history format`);
  }
  // Records written before series existed have no segment fields: they are single videos.
  const records: Record<string, HistoryRecord> = {};
  for (const [key, r] of Object.entries(raw.records)) records[key] = { ...r, segment: r.segment ?? null, segmentFingerprint: r.segmentFingerprint ?? null };
  return { schemaVersion: 1, records };
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
