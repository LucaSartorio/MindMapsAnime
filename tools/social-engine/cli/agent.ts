/**
 * social:agent — the daily social cycle, end to end, as the repository sees it.
 *
 *   npm run social:agent -- --dry-run     read the REAL state, run the REAL selector, build + validate
 *                                         the queue item, metadata and composition; write NOTHING
 *   npm run social:agent                  same, then write the ONE queue file of the day into
 *                                         content/queue/ (commit + PR are the agent's job — no git here)
 *   npm run social:agent -- --json        print the machine-readable result (plan, SelectionTrace, steps)
 *
 * The agent never chooses content: STEP 7 is the growth engine's decision
 * (the same `planNext` that writes catalog/next.json). The repository never
 * publishes: STEP 10–11 describe what the Publishing Agent does in Metricool
 * with the ready-made metadata, and which receipts must come back.
 *
 *   STEP 1  Reconciliation        pending publication receipts + analytics snapshots (applied IN MEMORY only)
 *   STEP 2  Catalog/History Load
 *   STEP 3  Analytics Load        optional: unavailable → cold-start/editorial selection, never a blocker
 *   STEP 4  Candidate Generation
 *   STEP 5  Editorial Filtering   HARD rules (maxSameAnimeStreak, maxSameCharacterStreak, journey parts)
 *   STEP 6  Performance Scoring   cooldowns + exploration/exploitation, among VALID candidates only
 *   STEP 7  Content Selection     or BACKLOG (an unpublished render is today's video) / BLOCKED (fail-safe)
 *   STEP 8  Queue                 generic queue item (any content type) validated like a PR
 *   STEP 9  Render                composition routed by content type (the Social render workflow renders)
 *   STEP 10 Publish               platform metadata from the growth engine (no last-minute captions)
 *   STEP 11 Receipts              one receipt per platform expected in publication/pending/
 *   STEP 12 Final State
 *
 * Exit codes: 0 ok (selected, backlog or blocked = nothing to do) · 1 a step failed · 2 usage.
 */
import { appendFileSync } from 'node:fs';
import { buildCatalog, type BuiltCatalog } from '../pipeline/catalog';
import { socialMetaFor } from '../pipeline/content';
import { pipelineDirs, relToRepo } from '../pipeline/dirs';
import { enqueueMany } from '../pipeline/enqueue';
import { safeJoin, writeJsonAtomic } from '../pipeline/fs';
import { loadHistory, PLATFORMS, type History } from '../pipeline/history';
import { loadMetricsSafe, planSnapshots, type AnalyticsStatus, type MetricsStore } from '../pipeline/analytics';
import { planReceipts } from '../pipeline/publication';
import { GROWTH_CONFIG } from '../growth/config';
import { buildFeed, feedItemFromSocial } from '../growth/feed';
import { PLATFORM_TARGETS, type PlatformMetadata } from '../growth/metadata';
import { selectionReport, titleResolver } from '../growth/report';
import { ruleViolations } from '../growth/rules';
import { templateForContentType } from '../growth/contentTypes';
import { findTemplate } from '../templates/registry';
import { parseArgs, type FlagSpec } from './args';
import { fail } from './common';

const SPEC: FlagSpec = { 'dry-run': 'boolean', json: 'boolean' };

type StepStatus = 'ok' | 'skipped' | 'warning' | 'failed';
type Step = { n: number; name: string; status: StepStatus; detail: string[] };

const STEP_NAMES = [
  'Reconciliation', 'Catalog/History Load', 'Analytics Load', 'Candidate Generation', 'Editorial Filtering', 'Performance Scoring',
  'Content Selection', 'Queue', 'Render', 'Publish', 'Receipts', 'Final State',
];

class StepFailure extends Error {
  constructor(readonly step: number, message: string, readonly recovery: string) {
    super(message);
  }
}

async function main() {
  const { flags, errors } = parseArgs(process.argv.slice(2), SPEC);
  if (errors.length) fail(errors.join('\n  '), 2);
  const dryRun = Boolean(flags['dry-run']);
  const json = Boolean(flags.json);
  const dirs = pipelineDirs();
  const now = new Date().toISOString();
  const steps: Step[] = [];
  const log = (...lines: string[]) => {
    if (!json) console.log(lines.join('\n'));
  };
  const step = (n: number, status: StepStatus, detail: string[]) => {
    steps.push({ n, name: STEP_NAMES[n - 1], status, detail });
    const mark = { ok: '✔', skipped: '–', warning: '!', failed: '✖' }[status];
    log(`\nSTEP ${n} - ${STEP_NAMES[n - 1]}  ${mark}`, ...detail.map((d) => `  ${d}`));
  };

  log(`\nANIMAPVERSE SOCIAL AGENT${dryRun ? ' — DRY RUN (nothing is written, pushed or published)' : ''}  ·  ${now}`);
  let built: BuiltCatalog | null = null;
  let report: Record<string, unknown> = {};
  try {
    // STEP 1 — reconciliation: what the state WILL be once pending receipts/snapshots are applied.
    let history: History = loadHistory(dirs);
    const metricsLoad = loadMetricsSafe(dirs);
    let metrics: MetricsStore = metricsLoad.store;
    let analytics: AnalyticsStatus = metricsLoad.analytics;
    const receipts = planReceipts(dirs, history, now);
    const snapshots = analytics.status === 'unavailable' ? null : planSnapshots(dirs, history, metrics);
    const s1: string[] = [];
    let s1status: StepStatus = 'ok';
    if (receipts.items.length) {
      if (receipts.valid) {
        history = receipts.history;
        s1.push(`${receipts.items.length} pending publication receipt(s): valid, reconciled in memory (the Social publication state workflow applies them on main)`);
      } else {
        s1status = 'warning';
        s1.push(`${receipts.items.filter((i) => !i.ok).length} INVALID pending receipt(s): ignored (they change nothing; fix them — npm run social:publication:validate)`);
      }
    } else s1.push('no pending publication receipt');
    if (snapshots?.items.length) {
      if (snapshots.valid) {
        metrics = snapshots.store;
        analytics = { ...analytics, status: Object.keys(metrics.posts).length ? 'ok' : 'empty', posts: Object.keys(metrics.posts).length };
        s1.push(`${snapshots.items.length} pending analytics snapshot(s): valid, merged in memory`);
      } else {
        s1status = 'warning';
        s1.push(`${snapshots.items.filter((i) => !i.ok).length} INVALID analytics snapshot(s): ignored (npm run social:analytics:validate)`);
      }
    } else s1.push('no pending analytics snapshot');
    step(1, s1status, s1);

    // STEP 2 — catalog + history (and the plan: one source of truth, the same as catalog/next.json).
    built = await buildCatalog(dirs, history, now, { metrics: { store: metrics, analytics } });
    const plan = built.plan;
    const titleOf = titleResolver(built.catalog);
    const feed = buildFeed(history, now);
    step(2, 'ok', [
      `${Object.keys(history.records).length} history record(s) · feed (${GROWTH_CONFIG.feedLocale}) ${feed.length} video(s)`,
      `catalog: ${Object.values(built.catalog.templates).reduce((n, t) => n + (t?.items.length ?? 0), 0)} producible item(s)`,
      `backlog: ${plan.backlog.unpublished.length} unpublished render(s) · ${plan.backlog.unfinished.length} unfinished publication(s) · ${plan.backlog.inProgress.length} render(s) in progress`,
    ]);

    // STEP 3 — analytics: optimisation input, never a single point of failure.
    step(3, analytics.status === 'unavailable' ? 'warning' : 'ok', [
      `analytics: ${analytics.status}${analytics.error ? ` — ${analytics.error}` : ''} (${analytics.posts} post(s) with metrics)`,
      `performance: ${built.performance.contents} scored video(s) · ${built.performance.coldStart ? `COLD START (< minimumSamples ${GROWTH_CONFIG.minimumSamples}) → editorial/variety selection` : 'optimising'}`,
      ...(analytics.status === 'unavailable' ? ['Metricool analytics unavailable → cold-start/editorial selection (the publisher continues)'] : []),
    ]);

    const t = plan.trace;
    if (plan.status === 'backlog' || !t) {
      for (const n of [4, 5, 6]) step(n, 'skipped', ['backlog first: no new selection']);
      step(7, 'ok', [`BACKLOG — ${plan.reason ?? ''}`, ...plan.backlog.unpublished.map((b) => `publish: ${b.renderId} (missing ${b.missing.join(', ')})`), ...plan.backlog.inProgress.map((b) => `in progress: ${b.id} (${b.state})`)]);
      step(8, 'skipped', ['nothing to queue']);
      step(9, 'skipped', ['nothing to render']);
      const entry = built.catalog.publishing.ready.find((e) => e.renderId === plan.backlog.unpublished[0]?.renderId);
      step(10, entry ? 'ok' : 'skipped', entry ? publishLines(entry.platformMetadata, entry.renderId) : ['render in progress: publish after the Social render workflow']);
      step(11, entry ? 'ok' : 'skipped', entry ? receiptLines(entry.renderId) : ['—']);
      step(12, 'ok', ['backlog: no new content today (publish / finish the existing render)']);
      report = { status: 'backlog', plan };
      return finish(report, plan.backlog.unpublished[0]?.renderId ?? null);
    }

    // STEP 4–6 — the trace of the real selector.
    step(4, 'ok', [
      `${t.candidates.considered} candidate(s): ${Object.entries(t.candidates.byContentType).map(([c, v]) => `${c} ${v.considered}`).join(' · ')}`,
    ]);
    const k = t.constraints;
    step(5, 'ok', [
      `recent anime: ${t.recent.map((r) => r.animes.map(titleOf).join('+')).join(' → ') || '(empty)'}`,
      `forced anime rotation: ${k.forcedAnimeRotation ? `YES — ${k.blockedAnimes.map(titleOf).join(', ')} excluded (maxSameAnimeStreak ${GROWTH_CONFIG.maxSameAnimeStreak})` : 'no'}`,
      `character blocked: ${k.blockedCharacters.join(', ') || 'none'} (maxSameCharacterStreak ${GROWTH_CONFIG.maxSameCharacterStreak})`,
      `hard rules: ${Object.entries(t.hardRulesTriggered).map(([c, n]) => `${c} ${n}`).join(' · ') || 'none'} → ${t.candidates.eligible} valid`,
    ]);
    step(6, 'ok', [
      `mode: ${t.mode} (explorationRate ${GROWTH_CONFIG.explorationRate}; cold start below ${GROWTH_CONFIG.minimumSamples} scored videos)`,
      `format streak: ${k.contentTypeStreak.contentType ?? '—'} × ${k.contentTypeStreak.length} (soft content-type cooldown)`,
      ...t.ranked.slice(0, 3).map((r) => `${r.renderId}  ${r.score}`),
    ]);
    if (plan.status !== 'ready' || !plan.request || !plan.pick) {
      step(7, 'ok', [`BLOCKED — ${plan.reason ?? 'no valid candidate'} (fail-safe: publish nothing rather than break the rotation)`]);
      for (const n of [8, 9, 10, 11]) step(n, 'skipped', ['blocked']);
      step(12, 'ok', ['blocked: nothing queued']);
      report = { status: 'blocked', plan };
      return finish(report, null);
    }
    step(7, 'ok', selectionReport(plan, titleOf).slice(2));

    // STEP 8 — the generic queue item (any content type), validated exactly like a PR.
    const [result] = await enqueueMany(dirs, [plan.request], { dryRun: true, now: () => now });
    if (!result.ok) throw new StepFailure(8, `queue item rejected: ${result.errors.join('; ')}`, 'nothing written; regenerate the plan (npm run social:catalog) and retry');
    const meta = socialMetaFor(result.plan);
    const editorial = ruleViolations(feedItemFromSocial(result.renderId, result.plan.contentId, meta, now), feed, GROWTH_CONFIG);
    if (editorial.length) throw new StepFailure(8, `editorial rules: ${editorial.map((v) => v.code).join(', ')}`, 'nothing written');
    let written: string | null = null;
    if (!dryRun) {
      writeJsonAtomic(safeJoin(dirs.queue, result.file), result.entry);
      written = `${relToRepo(dirs, dirs.queue)}/${result.file}`;
    }
    step(8, 'ok', [
      `${result.file} — ${result.renderId}`,
      `schema ✔ · data ✔ · duplicates ✔ · editorial rules ✔ · is the growth engine selection ✔`,
      written ? `written: ${written} → commit on a branch + PR (Social validate)` : 'dry run: not written',
    ]);

    // STEP 9 — composition routed by content type (no workflow edit per format).
    const templateId = templateForContentType(meta.contentType);
    const template = templateId ? findTemplate(templateId) : undefined;
    if (!template || template.id !== result.plan.template.id) throw new StepFailure(9, `no composition for content type ${meta.contentType}`, 'nothing written');
    step(9, 'ok', [
      `${meta.contentType} → composition ${template.compositionId} (${result.plan.resolved.durationSeconds}s, 1080×1920) + cover`,
      'rendered by the Social render workflow after the PR merge (MP4 + cover as workflow artifact)',
    ]);

    // STEP 10–11 — publishing is done OUTSIDE the repository (Publishing Agent + Metricool).
    step(10, meta.platformMetadata ? 'ok' : 'failed', publishLines(meta.platformMetadata, result.renderId));
    if (!meta.platformMetadata) throw new StepFailure(10, 'no platform metadata for the selected content', 'nothing published; the queue file is valid but captions are missing');
    step(11, 'ok', receiptLines(result.renderId));
    step(12, 'ok', [dryRun ? 'dry run: state unchanged (no file, no push, no PR, no publication)' : `queued: ${written} (history/catalog are updated by the workflows)`]);
    report = { status: 'selected', plan, queueFile: result.file, entry: result.entry, social: meta, written };
    return finish(report, result.renderId, meta.platformMetadata, String(result.entry.hook ?? ''), String(result.entry.cta ?? ''));
  } catch (err) {
    const failure = err instanceof StepFailure ? err : new StepFailure(steps.length + 1, err instanceof Error ? err.message : String(err), 'nothing written');
    step(failure.step, 'failed', [failure.message]);
    log('', 'FAILED STEP', `  STEP ${failure.step} - ${STEP_NAMES[failure.step - 1]}`, 'REASON', `  ${failure.message}`, 'RECOVERY STATE', `  ${failure.recovery}`, '');
    if (json) console.log(JSON.stringify({ status: 'failed', failedStep: failure.step, reason: failure.message, recovery: failure.recovery, steps, trace: built?.plan.trace ?? null }, null, 2));
    process.exitCode = 1;
  }

  function finish(result: Record<string, unknown>, renderId: string | null, metadata?: PlatformMetadata | null, hook?: string, cta?: string): void {
    const plan = built!.plan;
    const t = plan.trace;
    const titleOf = titleResolver(built!.catalog);
    const lines = ['', 'ANIMAPVERSE SOCIAL AGENT', ''];
    if (plan.status === 'ready' && t) {
      lines.push('Selected:', `  ${t.renderId} — ${t.contentType}`, 'Anime:', `  ${t.animes.map(titleOf).join(' + ')}`, 'Selection:', `  ${t.mode} · score ${t.score}`);
      lines.push('Why:', ...t.explanation.map((e) => `  ${e}`));
      if (hook) lines.push('Hook:', `  ${hook}`);
      if (cta) lines.push('CTA:', `  ${cta}`);
    } else lines.push(`Status: ${plan.status.toUpperCase()}`, `Why: ${plan.reason ?? ''}`);
    if (renderId) lines.push('Platforms:', ...PLATFORMS.map((p) => `  ${PLATFORM_TARGETS[p]}`));
    lines.push('Final state:', `  ${plan.status === 'ready' ? (dryRun ? 'dry run — nothing queued' : 'queued') : plan.status}`);
    if (metadata === null) lines.push('  ! no platform metadata');
    log(...lines, '');
    if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `\`\`\`\n${lines.join('\n')}\n\`\`\`\n`);
    if (json) console.log(JSON.stringify({ ...result, dryRun, steps }, null, 2));
  }
}

function publishLines(metadata: PlatformMetadata | null, renderId: string): string[] {
  if (!metadata) return [`${renderId}: no growth metadata (legacy video) → the Publishing Agent's legacy caption fallback applies`];
  return [
    'the repository never publishes: the Publishing Agent schedules in Metricool with THESE captions (verbatim, no regeneration):',
    ...PLATFORMS.map((p) => `${PLATFORM_TARGETS[p]}`),
    `instagramCaption: ${metadata.instagramCaption.split('\n')[0]} …`,
    `tiktokCaption: ${metadata.tiktokCaption.slice(0, 90)}${metadata.tiktokCaption.length > 90 ? '…' : ''}`,
    `youtubeTitle: ${metadata.youtubeTitle}`,
    `facebookCaption: ${metadata.facebookCaption.split('\n')[0]} …`,
  ];
}

function receiptLines(renderId: string): string[] {
  return [
    `expected: ${PLATFORMS.length}/${PLATFORMS.length} receipts for ${renderId} (${PLATFORMS.join(', ')}) → publication/pending/ (PR)`,
    'scheduled → published per platform; never schedule a platform twice (an ambiguous Metricool error = re-read the planner first)',
  ];
}

main().catch((err: unknown) => fail(err instanceof Error ? err.message : String(err)));
