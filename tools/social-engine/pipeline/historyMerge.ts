import { normalizeHistory, withDerivedPublication, type History, type HistoryRecord } from './history';

/**
 * Three-way merge of history.json, FIELD BY FIELD per record — used as a git
 * merge driver when two workflows commit state concurrently (Social render
 * writes render fields, Social publication state writes the publication fields
 * of the SAME file). For each field of each record:
 *   unchanged on one side → take the other side; equal on both → keep;
 *   changed differently on both → conflict (the merge fails, nothing is guessed).
 * `updatedAt` takes the latest value; the publication aggregate is re-derived.
 */
export type MergeResult = { ok: true; history: History } | { ok: false; conflicts: string[] };

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const DERIVED = new Set(['publicationStatus', 'publishedAt']);

export function mergeHistories(baseRaw: unknown, oursRaw: unknown, theirsRaw: unknown): MergeResult {
  const base = normalizeHistory(baseRaw, 'base');
  const ours = normalizeHistory(oursRaw, 'ours');
  const theirs = normalizeHistory(theirsRaw, 'theirs');
  const conflicts: string[] = [];
  const records: Record<string, HistoryRecord> = {};
  const ids = new Set([...Object.keys(ours.records), ...Object.keys(theirs.records)]);
  for (const id of ids) {
    const b = base.records[id];
    const o = ours.records[id];
    const t = theirs.records[id];
    if (!o || !t) {
      // Added on one side only (records are never deleted by the pipeline).
      records[id] = (o ?? t)!;
      continue;
    }
    const merged: Record<string, unknown> = {};
    const before = conflicts.length;
    for (const key of new Set([...Object.keys(o), ...Object.keys(t)])) {
      if (DERIVED.has(key)) continue;
      const ov = (o as Record<string, unknown>)[key];
      const tv = (t as Record<string, unknown>)[key];
      const bv = b ? (b as Record<string, unknown>)[key] : undefined;
      if (key === 'updatedAt') merged[key] = String(ov) > String(tv) ? ov : tv;
      else if (same(ov, tv) || same(tv, bv)) merged[key] = ov;
      else if (same(ov, bv)) merged[key] = tv;
      else conflicts.push(`${id}.${key}`);
    }
    // The aggregate is re-derived from the merged platforms.
    if (conflicts.length === before) records[id] = withDerivedPublication(merged as HistoryRecord);
  }
  if (conflicts.length) return { ok: false, conflicts };
  return { ok: true, history: { schemaVersion: 1, records } };
}
