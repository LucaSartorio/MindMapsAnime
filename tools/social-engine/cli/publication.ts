/**
 * Publication state CLI — the repository side of publishing (it never publishes).
 *
 *   npm run social:publication:validate    validate publication/pending/*.json (contract + history + transitions), change nothing
 *   npm run social:publication:apply:dry   same, printed as the plan "renderId · platform · old → new"
 *   npm run social:publication:apply       validate ALL → apply ALL (history + catalog, pending → applied/)
 *                                          or, if one is invalid, apply NONE (invalid → failed/) and exit 1
 *   npm run social:publication:list        rendered videos and their state per platform
 *        -- --pending [--platform instagram]   only what still has to be scheduled there
 *   npm run social:publication:check-scope   (CI) a PR that adds receipts may ONLY add receipts
 *
 * Exit codes: 0 ok · 1 invalid receipt / scope · 2 usage.
 */
import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { buildCatalog, writeCatalog } from '../pipeline/catalog';
import { ciRunFromEnv } from '../pipeline/ciRun';
import { pipelineDirs, relToRepo, type PipelineDirs } from '../pipeline/dirs';
import { loadHistory, platformState, PLATFORMS, type Platform } from '../pipeline/history';
import { LockError } from '../pipeline/lock';
import { applyPendingReceipts, planReceipts, type ReceiptPlan, type ReceiptPlanItem } from '../pipeline/publication';
import { parseArgs, type FlagSpec } from './args';
import { fail, stringFlag } from './common';

const COMMANDS = ['validate', 'apply', 'list', 'check-scope'] as const;
type Command = (typeof COMMANDS)[number];
const SPEC: FlagSpec = { 'dry-run': 'boolean', 'no-catalog': 'boolean', pending: 'boolean', platform: 'string' };

function describe(item: ReceiptPlanItem): string[] {
  if (!item.ok) {
    return [
      `✖ ${item.name}  [${item.kind}]`,
      ...(item.renderId ? [`  ${item.renderId}${item.platform ? ` · ${item.platform}` : ''}`] : []),
      ...(item.currentState || item.requestedState ? [`  current: ${item.currentState ?? '?'} · requested: ${item.requestedState ?? '?'}`] : []),
      ...item.errors.map((e) => `  error: ${e}`),
    ];
  }
  const r = item.receipt;
  const when = r.status === 'published' ? `published: ${r.publishedAt}` : r.status === 'failed' ? `error: ${r.error}` : `scheduled: ${r.scheduledFor}`;
  const refs = [r.providerPostUuid && `uuid ${r.providerPostUuid}`, r.providerPostId && `id ${r.providerPostId}`].filter(Boolean).join(' · ');
  return [
    `${item.outcome === 'applied' ? '✔' : '='} ${r.renderId}`,
    `  ${r.platform}  ${item.from} → ${item.to}${item.outcome === 'unchanged' ? '  (no change)' : ''}`,
    `  provider: ${r.provider}${refs ? ` · ${refs}` : ''}`,
    `  ${when}`,
    ...(item.note ? [`  note: ${item.note}`] : []),
    `  receipt: ${item.name} → ${item.receiptId}`,
  ];
}

function totals(plan: ReceiptPlan): string {
  const ok = plan.items.filter((i) => i.ok);
  const applied = ok.filter((i) => i.ok && i.outcome === 'applied').length;
  return `${plan.items.length} receipt(s): ${applied} change state · ${ok.length - applied} already recorded · ${plan.items.length - ok.length} invalid`;
}

function stepSummary(markdown: string): void {
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${markdown}\n`);
}

function markdownReport(title: string, plan: ReceiptPlan, footer: string): string {
  const rows = plan.items.map((i) =>
    i.ok
      ? `| ✔ | \`${i.receipt.renderId}\` | ${i.receipt.platform} | ${i.from} → ${i.to}${i.outcome === 'unchanged' ? ' (no change)' : ''} | ${i.name} |`
      : `| ✖ | \`${i.renderId ?? '?'}\` | ${i.platform ?? '?'} | ${i.currentState ?? '?'} → ${i.requestedState ?? '?'}: ${i.errors.join(' / ').replace(/\|/g, '\\|')} | ${i.name} |`,
  );
  return [`# ${title}`, '', totals(plan), '', '| | renderId | platform | transition | file |', '| --- | --- | --- | --- | --- |', ...rows, '', footer].join('\n');
}

function validate(dirs: PipelineDirs, label: string): void {
  const plan = planReceipts(dirs, loadHistory(dirs), new Date().toISOString());
  console.log(`\n${label} — ${relToRepo(dirs, dirs.publicationPending)}/ (nothing is written)\n`);
  if (!plan.items.length) console.log('  no pending receipts');
  for (const item of plan.items) console.log(`${describe(item).join('\n')}\n`);
  console.log(totals(plan));
  if (!plan.valid) console.log('\n✖ the batch is NOT applicable: apply would apply none of these receipts.\n');
  stepSummary(markdownReport(`Publication receipts — ${label}`, plan, plan.valid ? 'All receipts are valid.' : '**Invalid receipts: nothing would be applied.**'));
  if (!plan.valid) process.exitCode = 1;
}

async function apply(dirs: PipelineDirs, refreshCatalog: boolean): Promise<void> {
  const result = applyPendingReceipts({ dirs, run: ciRunFromEnv() });
  const { plan } = result;
  console.log(`\nAPPLY — ${relToRepo(dirs, dirs.publicationPending)}/\n`);
  if (!plan.items.length) {
    console.log('  no pending receipts — nothing to do\n');
    stepSummary('# Publication state\n\nNo pending receipts — nothing to do.');
    return;
  }
  for (const item of plan.items) console.log(`${describe(item).join('\n')}\n`);
  console.log(totals(plan));
  if (!result.applied) {
    console.log(`\n✖ NOTHING was applied (all-or-nothing batch): history is unchanged.`);
    if (result.quarantined.length) console.log(`  invalid receipt(s) moved to ${relToRepo(dirs, dirs.publicationFailed)}/: ${result.quarantined.join(', ')} (+ .error.json)`);
    console.log('  valid receipts stay pending and are applied by the next run.\n');
    stepSummary(markdownReport('Publication state — REJECTED', plan, `**Nothing was applied.** Invalid receipts moved to \`publication/failed/\`: ${result.quarantined.join(', ') || '—'}. Valid ones stay pending.`));
    process.exitCode = 1;
    return;
  }
  console.log(`\n✔ history updated · ${result.auditFiles.length} receipt(s) archived in ${relToRepo(dirs, dirs.publicationApplied)}/`);
  if (refreshCatalog) {
    writeCatalog(dirs, await buildCatalog(dirs, loadHistory(dirs), new Date().toISOString()));
    console.log('✔ catalog refreshed');
  }
  console.log('');
  stepSummary(markdownReport('Publication state — applied', plan, 'History and catalog updated; receipts archived in `publication/applied/`.'));
}

function list(dirs: PipelineDirs, pendingOnly: boolean, platform: Platform | undefined): void {
  const platforms = platform ? [platform] : [...PLATFORMS];
  const records = Object.values(loadHistory(dirs).records)
    .filter((r) => r.renderStatus === 'rendered')
    .filter((r) => !pendingOnly || platforms.some((p) => ['notScheduled', 'failed'].includes(platformState(r, p))))
    .sort((a, b) => (a.renderedAt ?? '').localeCompare(b.renderedAt ?? ''));
  console.log(`\n${'renderId'.padEnd(58)} ${'status'.padEnd(18)} ${platforms.map((p) => p.padEnd(13)).join(' ')} artifact`);
  for (const r of records) {
    const artifact = r.artifact ? (Date.parse(r.artifact.expiresAt) > Date.now() ? r.artifact.name : 'expired') : '—';
    console.log(`${r.renderId.padEnd(58)} ${r.publicationStatus.padEnd(18)} ${platforms.map((p) => platformState(r, p).padEnd(13)).join(' ')} ${artifact}`);
  }
  console.log(`\n${records.length} rendered video(s)${pendingOnly ? ` still to schedule on ${platforms.join('/')}` : ''}\n`);
}

/**
 * A PR that adds publication receipts must contain ONLY new files in
 * publication/pending/ — the agent never edits history, catalog, the audit
 * trail or the engine. PRs that don't touch pending/ are not concerned.
 */
function checkScope(dirs: PipelineDirs): void {
  const base = process.env.SOCIAL_SCOPE_BASE ?? 'HEAD^1';
  const out = execFileSync('git', ['diff', '--name-status', '--no-renames', base, 'HEAD'], { cwd: dirs.repoRoot, encoding: 'utf8' });
  const changes = out.split('\n').filter(Boolean).map((line) => {
    const [status, file] = line.split('\t');
    return { status, file };
  });
  // Agent input folders: publication receipts (Publishing Agent) and analytics snapshots (Analyst Agent).
  const inboxes = [dirs.publicationPending, dirs.analyticsPending].map((d) => `${relToRepo(dirs, d)}/`);
  const inInbox = (file: string) => inboxes.some((dir) => file.startsWith(dir));
  const touched = changes.filter((c) => inInbox(c.file));
  if (!touched.length) return console.log('✔ no publication receipt / analytics snapshot in this change — scope check not needed');
  const bad = changes.filter((c) => !(c.status === 'A' && inboxes.some((dir) => c.file.startsWith(dir) && /^[^/]+\.json$/.test(c.file.slice(dir.length)))));
  if (bad.length) {
    console.error(`\n✖ a change that adds receipts/snapshots may ONLY add new ${inboxes.map((d) => `${d}*.json`).join(' or ')} files.\n  Not allowed here:\n${bad.map((c) => `    ${c.status} ${c.file}`).join('\n')}\n`);
    process.exitCode = 1;
    return;
  }
  console.log(`✔ scope ok: ${touched.length} new receipt/snapshot file(s), nothing else`);
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  if (!COMMANDS.includes(command as Command)) fail(`usage: publication.ts <${COMMANDS.join('|')}> [options]`, 2);
  const { flags, errors } = parseArgs(rest, SPEC);
  if (errors.length) fail(errors.join('\n  '), 2);
  const dirs = pipelineDirs();
  const platform = stringFlag(flags, 'platform');
  if (platform !== undefined && !PLATFORMS.includes(platform as Platform)) fail(`--platform must be one of ${PLATFORMS.join(', ')}`, 2);
  switch (command as Command) {
    case 'validate':
      return validate(dirs, flags['dry-run'] ? 'DRY RUN' : 'VALIDATE');
    case 'apply':
      return flags['dry-run'] ? validate(dirs, 'DRY RUN') : apply(dirs, !flags['no-catalog']);
    case 'list':
      return list(dirs, Boolean(flags.pending), platform as Platform | undefined);
    case 'check-scope':
      return checkScope(dirs);
  }
}

main().catch((err: unknown) => {
  if (err instanceof LockError) fail(err.message);
  fail(err instanceof Error ? err.message : String(err));
});
