import { existsSync, readdirSync } from 'node:fs';
import { SocialEngineError } from '../lib/errors';
import { planContent, parseContentRequest, type PlannedContent } from './content';
import type { PipelineDirs } from './dirs';
import { checkDuplicate } from './duplicates';
import { QUEUE_FILE_RE, isRegularFile, readJsonFile, safeJoin } from './fs';
import type { History } from './history';

/**
 * File-based queue: `content/queue/*.json`, processed in file-name order
 * (`0001-…`, `0002-…`). One JSON object per file. Anything dropped there that
 * passes the contract is rendered by the batch — no CLI needed.
 */
export type QueueIssueKind = 'unsafe_file' | 'invalid' | 'data' | 'duplicate';

export type QueueItem =
  | { name: string; file: string; ok: true; plan: PlannedContent; raw: unknown; notes: string[] }
  | { name: string; file: string; ok: false; kind: QueueIssueKind; errors: string[]; raw: unknown };

/** Sorted file names of a content directory; `.error.json` side files are not entries. */
export function listContentFiles(dir: string): { entries: string[]; unsafe: string[] } {
  if (!existsSync(dir)) return { entries: [], unsafe: [] };
  const entries: string[] = [];
  const unsafe: string[] = [];
  for (const name of readdirSync(dir).sort()) {
    if (name.startsWith('.') || name.toLowerCase().endsWith('.md') || name.endsWith('.error.json')) continue;
    if (!QUEUE_FILE_RE.test(name) || !isRegularFile(safeJoin(dir, name))) unsafe.push(name);
    else entries.push(name);
  }
  return { entries, unsafe };
}

/**
 * Reads + validates every file of `dir` (default: the queue) against the
 * schema, the real data and the duplicate policy — read-only, no side effects.
 * Earlier files win when two describe the same renderId.
 */
export async function inspectQueue(dirs: PipelineDirs, history: History, dir: string = dirs.queue): Promise<QueueItem[]> {
  const { entries, unsafe } = listContentFiles(dir);
  const items: QueueItem[] = unsafe.map((name) => ({
    name,
    file: '',
    ok: false as const,
    kind: 'unsafe_file' as const,
    errors: ['ignored: file name must match [A-Za-z0-9][A-Za-z0-9._-]*.json and be a regular file'],
    raw: null,
  }));
  const seen = new Map<string, string>();
  for (const name of entries) {
    const file = safeJoin(dir, name);
    let raw: unknown = null;
    try {
      raw = readJsonFile(file);
    } catch (err) {
      items.push({ name, file, ok: false, kind: 'invalid', errors: [(err as Error).message], raw });
      continue;
    }
    const parsed = parseContentRequest(raw);
    if (!parsed.ok) {
      items.push({ name, file, ok: false, kind: 'invalid', errors: parsed.errors, raw });
      continue;
    }
    let plan: PlannedContent;
    try {
      plan = await planContent(dirs, parsed.request);
    } catch (err) {
      const message = err instanceof SocialEngineError || err instanceof Error ? err.message : String(err);
      items.push({ name, file, ok: false, kind: 'data', errors: [message], raw });
      continue;
    }
    const verdict = checkDuplicate({
      renderId: plan.renderId,
      contentId: plan.contentId,
      history,
      queued: seen,
      allowRerender: parsed.request.allowRerender,
    });
    if (!verdict.ok) {
      items.push({ name, file, ok: false, kind: 'duplicate', errors: [verdict.reason], raw });
      continue;
    }
    seen.set(plan.renderId, name);
    items.push({ name, file, ok: true, plan, raw, notes: verdict.notes });
  }
  return items;
}

/** Next queue number, across every content state (numbers are never reused). */
export function nextSequence(dirs: PipelineDirs): number {
  let max = 0;
  for (const dir of [dirs.queue, dirs.rendered, dirs.failed, dirs.archive]) {
    for (const name of listContentFiles(dir).entries) {
      const m = /^(\d{4,})-/.exec(name);
      if (m) max = Math.max(max, Number(m[1]));
    }
  }
  return max + 1;
}

export function queueFileName(sequence: number, fileStem: string): string {
  return `${String(sequence).padStart(4, '0')}-${fileStem}.json`;
}
