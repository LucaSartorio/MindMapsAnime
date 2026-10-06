/**
 * Analytics CLI — the repository side of performance measurement (it never calls Metricool).
 *
 *   npm run social:analytics:validate     validate analytics/pending/*.json (contract + history), change nothing
 *   npm run social:analytics:apply:dry    same, as the plan
 *   npm run social:analytics:apply        ALL valid → analytics/metrics.json + catalog (performance/next), pending → applied/
 *                                         or NONE applied (invalid → failed/) and exit 1
 *   npm run social:analytics:list         latest metrics per published post
 */
import { appendFileSync } from 'node:fs';
import { buildCatalog, writeCatalog } from '../pipeline/catalog';
import { ciRunFromEnv } from '../pipeline/ciRun';
import { pipelineDirs, relToRepo } from '../pipeline/dirs';
import { loadHistory } from '../pipeline/history';
import { LockError } from '../pipeline/lock';
import { applyPendingSnapshots, loadMetrics, planSnapshots, type SnapshotPlan, type SnapshotPlanItem } from '../pipeline/analytics';
import { parseArgs, type FlagSpec } from './args';
import { fail } from './common';

const SPEC: FlagSpec = { 'dry-run': 'boolean', 'no-catalog': 'boolean' };

function describe(i: SnapshotPlanItem): string {
  if (!i.ok) return `✖ ${i.name}  [${i.kind}]${i.renderId ? `\n  ${i.renderId} · ${i.platform ?? '?'}` : ''}\n  ${i.errors.map((e) => `error: ${e}`).join('\n  ')}`;
  const m = Object.entries(i.snapshot.metrics).map(([k, v]) => `${k} ${v ?? 'n/a'}`).join(' · ');
  return `${i.outcome === 'applied' ? '✔' : '='} ${i.snapshot.renderId}\n  ${i.snapshot.platform} · collected ${i.snapshot.collectedAt}${i.note ? ` · ${i.note}` : ''}\n  ${m}`;
}

function report(title: string, plan: SnapshotPlan, footer: string) {
  const ok = plan.items.filter((i) => i.ok).length;
  const lines = [`# ${title}`, '', `${plan.items.length} snapshot(s): ${ok} valid · ${plan.items.length - ok} invalid`, '', footer];
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join('\n')}\n`);
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const { flags, errors } = parseArgs(rest, SPEC);
  if (errors.length) fail(errors.join('\n  '), 2);
  const dirs = pipelineDirs();
  if (command === 'list') {
    const store = loadMetrics(dirs);
    const posts = Object.values(store.posts);
    for (const p of posts) console.log(`${p.renderId} · ${p.platform} · ${p.collectedAt} · ${Object.entries(p.metrics).map(([k, v]) => `${k}=${v ?? 'n/a'}`).join(' ')}`);
    return console.log(`\n${posts.length} post(s) with metrics`);
  }
  if (command === 'validate' || (command === 'apply' && flags['dry-run'])) {
    const plan = planSnapshots(dirs, loadHistory(dirs), loadMetrics(dirs));
    console.log(`\n${command === 'validate' ? 'VALIDATE' : 'DRY RUN'} — ${relToRepo(dirs, dirs.analyticsPending)}/ (nothing is written)\n`);
    if (!plan.items.length) console.log('  no pending snapshots');
    for (const i of plan.items) console.log(`${describe(i)}\n`);
    report('Analytics snapshots — validate', plan, plan.valid ? 'All snapshots are valid.' : '**Invalid snapshots: nothing would be applied.**');
    if (!plan.valid) process.exitCode = 1;
    return;
  }
  if (command !== 'apply') fail('usage: analytics.ts <validate|apply|list> [--dry-run] [--no-catalog]', 2);
  const result = applyPendingSnapshots({ dirs, run: ciRunFromEnv() });
  for (const i of result.plan.items) console.log(`${describe(i)}\n`);
  if (!result.plan.items.length) return console.log('no pending snapshots — nothing to do');
  if (!result.applied) {
    console.log(`✖ NOTHING was applied. Invalid snapshot(s) moved to ${relToRepo(dirs, dirs.analyticsFailed)}/: ${result.quarantined.join(', ')}`);
    report('Analytics — REJECTED', result.plan, `Nothing applied. Invalid snapshots moved to analytics/failed/: ${result.quarantined.join(', ') || '—'}.`);
    process.exitCode = 1;
    return;
  }
  console.log(`✔ metrics updated · ${result.auditFiles.length} snapshot(s) archived in ${relToRepo(dirs, dirs.analyticsApplied)}/`);
  if (!flags['no-catalog']) {
    writeCatalog(dirs, await buildCatalog(dirs, loadHistory(dirs), new Date().toISOString()));
    console.log('✔ catalog, performance and next plan refreshed');
  }
  report('Analytics — applied', result.plan, 'metrics.json, performance.json and next.json updated.');
}

main().catch((err: unknown) => {
  if (err instanceof LockError) fail(err.message);
  fail(err instanceof Error ? err.message : String(err));
});
