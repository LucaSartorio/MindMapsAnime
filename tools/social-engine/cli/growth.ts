/**
 * Growth engine CLI.
 *
 *   npm run social:next                  the next video (selector + hook + CTA + SelectionTrace), as catalog/next.json says it
 *   npm run social:performance           performance report (scores per anime / character / format / hook…)
 *   npm run social:editorial:check       queue files vs the HARD editorial rules (CI gate; exit 1 on violation)
 *        -- --require-selection          + every NEW feed video must BE the growth engine's selection
 *                                          (catalog/next.json `request`, or the plan recomputed from the
 *                                          committed state) — the agent never picks content by itself
 */
import { existsSync, readFileSync } from 'node:fs';
import { buildCatalog, NEXT_FILE } from '../pipeline/catalog';
import { socialMetaFor } from '../pipeline/content';
import { pipelineDirs } from '../pipeline/dirs';
import { loadHistory } from '../pipeline/history';
import { inspectQueue } from '../pipeline/queue';
import { GROWTH_CONFIG } from '../growth/config';
import { buildFeed, feedItemFromSocial } from '../growth/feed';
import { planMismatch, type NextPlan } from '../growth/plan';
import { selectionReport, titleResolver } from '../growth/report';
import { hardRuleViolations } from '../growth/rules';
import { parseArgs, type FlagSpec } from './args';
import { fail } from './common';

const SPEC: FlagSpec = { 'require-selection': 'boolean' };

function readCommittedPlan(file: string): NextPlan | null {
  try {
    return existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')) as NextPlan) : null;
  } catch {
    return null;
  }
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const { flags, errors } = parseArgs(rest, SPEC);
  if (errors.length) fail(errors.join('\n  '), 2);
  const dirs = pipelineDirs();
  const now = new Date().toISOString();
  const history = loadHistory(dirs);
  if (command === 'next' || command === 'performance') {
    const built = await buildCatalog(dirs, history, now);
    if (command === 'performance') {
      const p = built.performance;
      console.log(`\n${p.contents} scored video(s), ${p.samples} post(s) · ${p.coldStart ? 'COLD START (variety first)' : 'optimising'} · global mean ${p.globalMean}`);
      for (const [dim, values] of Object.entries(p.dimensions)) {
        const rows = Object.entries(values).sort((a, b) => b[1].estimate - a[1].estimate).slice(0, 8);
        if (rows.length) console.log(`\n${dim}:\n${rows.map(([k, v]) => `  ${k.padEnd(48)} estimate ${String(v.estimate).padStart(6)} · mean ${v.mean} · n ${v.n}`).join('\n')}`);
      }
      return console.log('');
    }
    const n = built.plan;
    console.log(`\n${selectionReport(n, titleResolver(built.catalog)).join('\n')}\n`);
    if (n.status === 'backlog') return console.log('→ queue NOTHING today: publish / finish the backlog above.\n');
    if (n.status !== 'ready' || !n.pick) return fail(`BLOCKED: ${n.reason ?? 'no valid candidate'} (nothing should be published)`);
    console.log(`request (copy into content/queue/):\n${JSON.stringify(n.request, null, 2)}\n`);
    return;
  }
  if (command === 'editorial-check') {
    const items = (await inspectQueue(dirs, history)).filter((i): i is Extract<typeof i, { ok: true }> => i.ok);
    const queuedIds = new Set(items.map((i) => i.plan.renderId));
    const feed = buildFeed(history, now).filter((f) => !queuedIds.has(f.renderId));
    // The plan BEFORE this queue: recomputed from the committed state, and the committed next.json.
    const plans: NextPlan[] = [];
    if (flags['require-selection']) {
      plans.push((await buildCatalog(dirs, history, now, { ignoreQueue: true })).plan);
      const committed = readCommittedPlan(`${dirs.catalog}/${NEXT_FILE}`);
      if (committed) plans.push(committed);
    }
    let violations = 0;
    let newFeedVideos = 0;
    for (const item of items) {
      if (item.plan.locale !== GROWTH_CONFIG.feedLocale) {
        console.log(`– ${item.name}: ${item.plan.locale} (not the ${GROWTH_CONFIG.feedLocale} feed) — not checked`);
        continue;
      }
      const f = feedItemFromSocial(item.plan.renderId, item.plan.contentId, socialMetaFor(item.plan), now);
      const v = hardRuleViolations(f, feed, GROWTH_CONFIG);
      const retry = history.records[item.plan.renderId]?.renderStatus === 'failed';
      if (flags['require-selection'] && !retry) {
        newFeedVideos++;
        const raw = (typeof item.raw === 'object' && item.raw !== null ? item.raw : {}) as Record<string, unknown>;
        const mismatches = plans.map((p) => planMismatch(p, item.plan.renderId, raw));
        if (newFeedVideos > GROWTH_CONFIG.videosPerRun) v.push(`one new video per run: ${item.name} is new feed video #${newFeedVideos} of this change (max ${GROWTH_CONFIG.videosPerRun})`);
        else if (!mismatches.some((m) => m === null)) v.push(`not the growth engine selection — ${mismatches[0] ?? 'no plan available'} (the agent never chooses content: copy catalog/next.json)`);
      }
      if (v.length) {
        violations++;
        console.log(`✖ ${item.name} (${item.plan.renderId})\n  ${v.join('\n  ')}`);
      } else console.log(`✔ ${item.name} (${item.plan.renderId})${retry ? ' — retry of a failed render' : ''}`);
      feed.push(f);
    }
    if (violations) fail(`${violations} queued video(s) break the editorial rules (see docs/SOCIAL_ENGINE.md › Editorial Rotation). Queue exactly catalog/next.json "request".`);
    return console.log(`\n✔ ${items.length} queued item(s) respect the editorial rules${flags['require-selection'] ? ' and are the growth engine selection' : ''}`);
  }
  fail('usage: growth.ts <next|performance|editorial-check> [--require-selection]', 2);
}

main().catch((err: unknown) => fail(err instanceof Error ? err.message : String(err)));
