/**
 * social:render:queue — renders every valid file of content/queue/, in order.
 * social:retry:failed  — moves content/failed/ back to the queue and renders it.
 *
 *   npm run social:render:queue -- --dry-run          # plan only: nothing rendered, nothing changed
 *   npm run social:render:queue -- --id character-journey:naruto:itachi-uchiha@en
 *   npm run social:retry:failed -- --id <renderId>    # or all failed content
 *
 * Videos are rendered ONE AT A TIME (--concurrency = frames in parallel inside
 * a video). A lock prevents two batches at once. The catalog is refreshed at
 * the end so its history columns stay true. Every run (dry or real) writes the
 * machine-readable output/render-summary.json.
 *
 * Environment (CI-friendly, no npm argument forwarding needed):
 *   SOCIAL_RENDER_LIMIT=<n>   same as --limit
 */
import { buildCatalog, writeCatalog } from '../pipeline/catalog';
import { buildRunSummary, writeRunSummary } from '../pipeline/runSummary';
import { requeueFailed, runBatch } from '../pipeline/batch';
import { pipelineDirs } from '../pipeline/dirs';
import { loadHistory } from '../pipeline/history';
import { LockError } from '../pipeline/lock';
import path from 'node:path';
import { parseArgs, type FlagSpec } from './args';
import { fail, listFlag, numberFlag, remotionRendererFactory, stringFlag } from './common';

const SPEC: FlagSpec = {
  'dry-run': 'boolean', id: 'string', limit: 'string', concurrency: 'string', 'browser-executable': 'string',
  'retry-failed': 'boolean', 'requeue-only': 'boolean', 'no-catalog': 'boolean', help: 'boolean',
};

const HELP = `Usage: npm run social:render:queue -- [options]
  --dry-run             validate + show what would be rendered (no MP4, no state change)
  --id <renderId,…>     only these render ids
  --limit <n>           at most n videos
  --concurrency <n>     frames rendered in parallel inside a video (videos: always one at a time)
  --browser-executable  headless Chromium path
  --retry-failed        (social:retry:failed) move content/failed/ back to the queue first, render only those
  --requeue-only        with --retry-failed: requeue without rendering
  --no-catalog          don't refresh catalog/catalog.json at the end
`;

function envLimit(): number | undefined {
  const raw = process.env.SOCIAL_RENDER_LIMIT;
  if (!raw) return undefined;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) fail(`SOCIAL_RENDER_LIMIT must be a positive integer (got "${raw}")`, 2);
  return n;
}

async function main() {
  const { flags, errors } = parseArgs(process.argv.slice(2), SPEC);
  if (flags.help) return console.log(HELP);
  if (errors.length) fail(`${errors.join('\n  ')}\n\n${HELP}`, 2);
  const dirs = pipelineDirs();
  const ids = listFlag(flags, 'id');
  const dryRun = Boolean(flags['dry-run']);

  let files: string[] | undefined;
  if (flags['retry-failed']) {
    if (dryRun) fail('--dry-run with --retry-failed: run `npm run social:render:queue -- --dry-run` after requeueing', 2);
    const { files: requeued } = await requeueFailed(dirs, { ids });
    console.log(`\n↺ requeued ${requeued.length} failed item(s)${requeued.length ? `: ${requeued.join(', ')}` : ''}`);
    if (!requeued.length || flags['requeue-only']) return;
    files = requeued;
  }

  const result = await runBatch({
    dirs,
    dryRun,
    ids: flags['retry-failed'] ? undefined : ids,
    files,
    limit: numberFlag(flags, 'limit') ?? envLimit(),
    createRenderer: remotionRendererFactory(dirs, { browserExecutable: stringFlag(flags, 'browser-executable'), concurrency: numberFlag(flags, 'concurrency') ?? null }),
    log: (line) => console.log(line),
  });

  const summaryFile = writeRunSummary(dirs, buildRunSummary(dirs, result, new Date().toISOString()));

  if (dryRun) {
    console.log(`\nDRY RUN — ${result.considered} file(s) in the queue, nothing rendered, nothing changed`);
    for (const p of result.planned) {
      console.log(`\n  ✔ ${p.name}  →  ${p.renderId}`);
      for (const n of p.notes) console.log(`    note: ${n}`);
      for (const line of p.summary) console.log(`    ${line}`);
    }
    for (const r of result.rejected) console.log(`\n  ✖ ${r.name}  [${r.kind}] → would move to content/failed/\n    ${r.errors.join('\n    ')}`);
    console.log(`\n${result.planned.length} would render · ${result.rejected.length} would be rejected`);
    console.log(`summary: ${path.relative(process.cwd(), summaryFile)}\n`);
    if (result.rejected.length) process.exitCode = 1;
    return;
  }

  const failedTotal = result.failed.length + result.rejected.length;
  console.log(`\n──────── batch summary ────────`);
  console.log(`${result.considered} queued · ${result.rendered.length} rendered · ${failedTotal} failed`);
  for (const r of result.rendered) console.log(`  ✔ ${r.renderId}  →  ${r.outputFile}`);
  for (const f of result.failed) console.log(`  ✖ ${f.renderId ?? f.name} (${f.name}): ${f.error}`);
  for (const r of result.rejected) console.log(`  ✖ ${r.name} [${r.kind}]: ${r.errors.join('; ')}`);
  if (failedTotal) console.log(`  → retry: npm run social:retry:failed`);
  console.log(`  summary: ${path.relative(process.cwd(), summaryFile)}`);

  if (!flags['no-catalog']) {
    writeCatalog(dirs, await buildCatalog(dirs, loadHistory(dirs), new Date().toISOString()));
    console.log('  catalog refreshed');
  }
  console.log('');
  if (failedTotal) process.exitCode = 1;
}

main().catch((err: unknown) => {
  if (err instanceof LockError) fail(err.message);
  console.error(err);
  fail('Batch aborted (critical error above). Queued items were left in the queue.');
});
