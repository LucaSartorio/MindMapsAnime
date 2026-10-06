/**
 * Growth engine CLI.
 *
 *   npm run social:next                  the next video to queue (selector + hook + CTA), as catalog/next.json says it
 *   npm run social:performance           performance report (scores per anime / character / format / hook…)
 *   npm run social:editorial:check       queue files vs the HARD editorial rules (CI gate; exit 1 on violation)
 */
import { buildCatalog } from '../pipeline/catalog';
import { socialMetaFor } from '../pipeline/content';
import { pipelineDirs } from '../pipeline/dirs';
import { loadHistory } from '../pipeline/history';
import { inspectQueue } from '../pipeline/queue';
import { GROWTH_CONFIG } from '../growth/config';
import { buildFeed, feedItemFromSocial } from '../growth/feed';
import { hardRuleViolations } from '../growth/rules';
import { fail } from './common';

async function main() {
  const [command] = process.argv.slice(2);
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
    console.log(`\nmode: ${n.mode} · seed ${n.seed} · ${n.eligible}/${n.considered} candidates editorially valid`);
    console.log(`feed tail: ${n.feedTail.map((f) => `${f.animes.join('+')}/${f.contentType}`).join(' → ') || '(empty)'}`);
    console.log(`rejected by hard rules: ${Object.entries(n.rejected).map(([k, v]) => `${k} ${v}`).join(' · ') || 'none'}`);
    if (n.status !== 'ready' || !n.pick) return fail(`BLOCKED: ${n.reason ?? 'no valid candidate'} (nothing should be published)`);
    console.log(`\nNEXT → ${n.pick.renderId} (${n.pick.contentType}, score ${n.pick.score})\n  ${n.pick.reasons.join('\n  ')}`);
    console.log(`\nrequest (copy into content/queue/):\n${JSON.stringify(n.request, null, 2)}\n`);
    console.log(`alternatives: ${n.alternatives.map((a) => `${a.renderId} (${a.score})`).join(', ')}\n`);
    return;
  }
  if (command === 'editorial-check') {
    const items = (await inspectQueue(dirs, history)).filter((i): i is Extract<typeof i, { ok: true }> => i.ok);
    const queuedIds = new Set(items.map((i) => i.plan.renderId));
    const feed = buildFeed(history, now).filter((f) => !queuedIds.has(f.renderId));
    let violations = 0;
    for (const item of items) {
      if (item.plan.locale !== GROWTH_CONFIG.feedLocale) {
        console.log(`– ${item.name}: ${item.plan.locale} (not the ${GROWTH_CONFIG.feedLocale} feed) — not checked`);
        continue;
      }
      const f = feedItemFromSocial(item.plan.renderId, item.plan.contentId, socialMetaFor(item.plan), now);
      const v = hardRuleViolations(f, feed, GROWTH_CONFIG);
      if (v.length) {
        violations++;
        console.log(`✖ ${item.name} (${item.plan.renderId})\n  ${v.join('\n  ')}`);
      } else console.log(`✔ ${item.name} (${item.plan.renderId})`);
      feed.push(f);
    }
    if (violations) fail(`${violations} queued video(s) break the editorial rules (see docs/SOCIAL_ENGINE.md › Editorial Rotation). Pick from catalog/next.json.`);
    return console.log(`\n✔ ${items.length} queued item(s) respect the editorial rules`);
  }
  fail('usage: growth.ts <next|performance|editorial-check>', 2);
}

main().catch((err: unknown) => fail(err instanceof Error ? err.message : String(err)));
