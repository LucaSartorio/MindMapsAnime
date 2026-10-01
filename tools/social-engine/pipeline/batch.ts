import { rmSync } from 'node:fs';
import path from 'node:path';
import type { VideoInfo } from '../render/session';
import type { PlannedContent } from './content';
import type { PipelineDirs } from './dirs';
import { relToRepo } from './dirs';
import { moveInto, readJsonFile, safeJoin, writeJsonAtomic } from './fs';
import { ensureRecord, loadHistory, saveHistory, transition, type History } from './history';
import { listContentFiles, inspectQueue, type QueueItem } from './queue';
import { acquireLock } from './lock';
import { writeManifest } from './manifest';
import { parseContentRequest, planContent } from './content';
import { parseRenderId } from './ids';

/**
 * Batch render of the file queue.
 *
 *   validate all → (dry run stops here, nothing written)
 *   lock → invalid/duplicate files → content/failed/ (+ .error.json)
 *   valid → history `queued` → one shared renderer → for each, IN ORDER:
 *     rendering → MP4 + manifest → rendered (file → content/rendered/)
 *               ↘ failed (file → content/failed/ + .error.json, history.lastError)
 *
 * One bad item never stops the batch; only a critical error (lock, renderer
 * setup) aborts it, leaving every item queued. History is saved after each step.
 */
export type ItemRenderer = { render(plan: PlannedContent, outputFile: string): Promise<VideoInfo> };
export type RendererFactory = (plans: PlannedContent[]) => Promise<ItemRenderer>;

export type BatchOptions = {
  dirs: PipelineDirs;
  createRenderer: RendererFactory;
  dryRun?: boolean;
  /** Only these renderIds. */
  ids?: string[];
  /** Only these queue file names (retry). */
  files?: string[];
  limit?: number;
  now?: () => string;
  log?: (line: string) => void;
};

export type BatchResult = {
  dryRun: boolean;
  considered: number;
  rendered: { renderId: string; file: string; outputFile: string; manifestFile: string }[];
  failed: { name: string; renderId: string | null; error: string }[];
  rejected: { name: string; kind: string; errors: string[]; raw: unknown }[];
  planned: { name: string; renderId: string; notes: string[]; summary: string[] }[];
};

const isoNow = () => new Date().toISOString();

/** Repo-relative, trimmed stack (no machine-specific absolute paths in versioned files). */
function cleanStack(err: unknown, repoRoot: string): string | null {
  if (!(err instanceof Error) || !err.stack) return null;
  return err.stack.split('\n').slice(0, 10).join('\n').split(repoRoot + path.sep).join('');
}

function writeFailure(dirs: PipelineDirs, file: string, info: Record<string, unknown>): string {
  const moved = moveInto(file, dirs.failed);
  writeJsonAtomic(moved.replace(/\.json$/, '.error.json'), info);
  return moved;
}

export async function runBatch(opts: BatchOptions): Promise<BatchResult> {
  const { dirs, dryRun = false } = opts;
  const now = opts.now ?? isoNow;
  const log = opts.log ?? (() => {});
  const release = dryRun ? () => {} : acquireLock(dirs.lockFile);
  const result: BatchResult = { dryRun, considered: 0, rendered: [], failed: [], rejected: [], planned: [] };
  try {
    const history: History = loadHistory(dirs);
    let items: QueueItem[] = await inspectQueue(dirs, history);
    if (opts.files) items = items.filter((i) => opts.files!.includes(i.name));
    if (opts.ids) items = items.filter((i) => i.ok && opts.ids!.includes(i.plan.renderId));
    const valid = items.filter((i): i is Extract<QueueItem, { ok: true }> => i.ok).slice(0, opts.limit ?? Infinity);
    const invalid = items.filter((i): i is Extract<QueueItem, { ok: false }> => !i.ok);
    result.considered = valid.length + invalid.length;
    for (const i of valid) result.planned.push({ name: i.name, renderId: i.plan.renderId, notes: i.notes, summary: i.plan.resolved.summary });
    for (const i of invalid) result.rejected.push({ name: i.name, kind: i.kind, errors: i.errors, raw: i.raw });
    if (dryRun) return result;

    // Rejected files: kept (never deleted), moved aside with the reason.
    for (const i of invalid) {
      if (i.kind === 'unsafe_file' || !i.file) continue;
      writeFailure(dirs, i.file, { kind: i.kind, errors: i.errors, failedAt: now(), sourceFile: i.name, config: i.raw });
      log(`  ✖ ${i.name}: ${i.kind} — ${i.errors.join('; ')}`);
    }
    if (!valid.length) return result;

    for (const i of valid) {
      const { contentId, locale, variant } = parseRenderId(i.plan.renderId);
      const r = ensureRecord(history, { renderId: i.plan.renderId, contentId, template: i.plan.template.id, anime: i.plan.resolved.identity.anime, subject: i.plan.resolved.identity.subject, locale, variant }, now(), i.name);
      // Crash recovery (a previous run died mid-render) and explicit retries/re-renders go back to queued.
      if (r.renderStatus !== 'queued') transition(r, 'queued', now(), { sourceFile: i.name });
    }
    saveHistory(dirs, history);

    const renderer = await opts.createRenderer(valid.map((i) => i.plan));
    for (const [index, item] of valid.entries()) {
      const { plan } = item;
      const record = history.records[plan.renderId];
      log(`\n[${index + 1}/${valid.length}] ${plan.renderId}  (${item.name})`);
      transition(record, 'rendering', now(), { attempts: record.attempts + 1 });
      saveHistory(dirs, history);
      const outputFile = safeJoin(dirs.output, `${plan.fileStem}.mp4`);
      try {
        const info = await renderer.render(plan, outputFile);
        const renderedAt = now();
        const manifestFile = writeManifest(dirs, plan, outputFile, info, renderedAt, item.raw);
        const moved = moveInto(item.file, dirs.rendered);
        transition(record, 'rendered', renderedAt, {
          renderedAt,
          outputFile: relToRepo(dirs, outputFile),
          manifestFile: relToRepo(dirs, manifestFile),
          durationSeconds: info.durationInFrames / info.fps,
          sourceFile: path.basename(moved),
          lastError: null,
        });
        result.rendered.push({ renderId: plan.renderId, file: path.basename(moved), outputFile: relToRepo(dirs, outputFile), manifestFile: relToRepo(dirs, manifestFile) });
        log(`  ✔ ${relToRepo(dirs, outputFile)}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        rmSync(outputFile, { force: true }); // never leave a partial MP4 behind
        const moved = writeFailure(dirs, item.file, {
          kind: 'render',
          renderId: plan.renderId,
          contentId: plan.contentId,
          errors: [message],
          stack: cleanStack(err, dirs.repoRoot),
          failedAt: now(),
          attempt: record.attempts,
          sourceFile: item.name,
          config: item.raw,
        });
        transition(record, 'failed', now(), { lastError: message, sourceFile: path.basename(moved) });
        result.failed.push({ name: item.name, renderId: plan.renderId, error: message });
        log(`  ✖ ${message}`);
      }
      saveHistory(dirs, history);
    }
    return result;
  } finally {
    release();
  }
}

/**
 * Moves failed content back to the queue (all, or only the given renderIds /
 * file names) and marks it `queued` in history. The `.error.json` is removed:
 * the last error stays in history. Returns the requeued file names.
 */
export async function requeueFailed(dirs: PipelineDirs, filter: { ids?: string[] } = {}, now: () => string = isoNow): Promise<{ files: string[]; skipped: string[] }> {
  const release = acquireLock(dirs.lockFile);
  try {
    const history = loadHistory(dirs);
    const files: string[] = [];
    const skipped: string[] = [];
    for (const name of listContentFiles(dirs.failed).entries) {
      const file = safeJoin(dirs.failed, name);
      let renderId: string | null = null;
      try {
        const parsed = parseContentRequest(readJsonFile(file));
        if (parsed.ok) renderId = (await planContent(dirs, parsed.request)).renderId;
      } catch {
        /* still unplannable: requeued anyway when no filter, the batch reports why */
      }
      if (filter.ids && !(renderId && filter.ids.includes(renderId))) {
        skipped.push(name);
        continue;
      }
      const moved = moveInto(file, dirs.queue);
      rmSync(file.replace(/\.json$/, '.error.json'), { force: true });
      if (renderId && history.records[renderId]?.renderStatus === 'failed') transition(history.records[renderId], 'queued', now(), { sourceFile: path.basename(moved) });
      files.push(path.basename(moved));
    }
    saveHistory(dirs, history);
    return { files, skipped };
  } finally {
    release();
  }
}
