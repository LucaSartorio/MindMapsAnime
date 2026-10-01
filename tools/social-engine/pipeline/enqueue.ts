import { SocialEngineError } from '../lib/errors';
import { canonicalQueueEntry, parseContentRequest, planContent, recordIdentity, type PlannedContent } from './content';
import type { PipelineDirs } from './dirs';
import { checkDuplicate } from './duplicates';
import { safeJoin, writeJsonAtomic } from './fs';
import { ensureRecord, loadHistory, saveHistory, transition } from './history';
import { acquireLock } from './lock';
import { inspectQueue, nextSequence, queueFileName } from './queue';

export type EnqueueResult =
  | { ok: true; file: string; renderId: string; notes: string[]; plan: PlannedContent; entry: Record<string, unknown> }
  | { ok: false; errors: string[] };

/**
 * Validates requests (schema → real data → duplicate policy) and writes each
 * accepted one as a canonical `content/queue/NNNN-<stem>.json` + a `queued`
 * history record. Requests are processed in order, so a batch can't contain
 * the same renderId twice either.
 */
export async function enqueueMany(dirs: PipelineDirs, raws: unknown[], opts: { dryRun?: boolean; now?: () => string } = {}): Promise<EnqueueResult[]> {
  const now = opts.now ?? (() => new Date().toISOString());
  const release = opts.dryRun ? () => {} : acquireLock(dirs.lockFile);
  try {
    const history = loadHistory(dirs);
    const queued = new Map<string, string>();
    for (const item of await inspectQueue(dirs, history)) if (item.ok) queued.set(item.plan.renderId, item.name);
    let sequence = nextSequence(dirs);
    const results: EnqueueResult[] = [];
    for (const raw of raws) {
      const parsed = parseContentRequest(raw);
      if (!parsed.ok) {
        results.push({ ok: false, errors: parsed.errors });
        continue;
      }
      let plan: PlannedContent;
      try {
        plan = await planContent(dirs, parsed.request);
      } catch (err) {
        results.push({ ok: false, errors: [err instanceof SocialEngineError || err instanceof Error ? err.message : String(err)] });
        continue;
      }
      const verdict = checkDuplicate({ renderId: plan.renderId, contentId: plan.contentId, history, queued, allowRerender: parsed.request.allowRerender });
      if (!verdict.ok) {
        results.push({ ok: false, errors: [verdict.reason] });
        continue;
      }
      const file = queueFileName(sequence++, plan.fileStem);
      const entry = canonicalQueueEntry(plan);
      queued.set(plan.renderId, file);
      if (!opts.dryRun) {
        writeJsonAtomic(safeJoin(dirs.queue, file), entry);
        const record = ensureRecord(history, recordIdentity(plan), now(), file);
        if (record.renderStatus !== 'queued') transition(record, 'queued', now(), { sourceFile: file });
      }
      results.push({ ok: true, file, renderId: plan.renderId, notes: verdict.notes, plan, entry });
    }
    if (!opts.dryRun) saveHistory(dirs, history);
    return results;
  } finally {
    release();
  }
}
