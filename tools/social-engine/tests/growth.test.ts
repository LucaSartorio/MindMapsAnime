/**
 * Growth engine tests: editorial rotation, selector, hook/CTA engines, platform
 * metadata, analytics snapshots, performance scoring, cold start, history
 * migration. Pure functions run on synthetic feeds; the pipeline parts run in a
 * temporary sandbox (the real history is only READ).
 */
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { buildCatalog, NEXT_FILE, type Catalog, type CatalogItem } from '../pipeline/catalog';
import { pipelineDirs, type PipelineDirs } from '../pipeline/dirs';
import { emptyHistory, ensureRecord, loadHistory, normalizeHistory, saveHistory, transition, type History, type HistoryRecord } from '../pipeline/history';
import { parseContentId, parseRenderId } from '../pipeline/ids';
import { applyPendingReceipts } from '../pipeline/publication';
import { applyPendingSnapshots, emptyMetrics, loadMetrics, loadMetricsSafe, parseSnapshot, postKey } from '../pipeline/analytics';
import { buildSnapshotSchema } from '../pipeline/analyticsSchema';
import { SNAPSHOT_SCHEMA_FILE } from '../pipeline/schemaFiles';
import { parseContentRequest } from '../pipeline/content';
import { enqueueMany } from '../pipeline/enqueue';
import { feedItemFromSocial } from '../growth/feed';
import { GROWTH_CONFIG, HOOK_TYPES, type GrowthConfig } from '../growth/config';
import { buildFeed, characterKey, feedItemOf, type FeedItem } from '../growth/feed';
import { editorialConstraints, hardRuleViolations, ruleViolations, softAdjustment, trailingStreak } from '../growth/rules';
import { chooseHook, HOOK_BANK, hookOptions } from '../growth/hooks';
import { chooseCta, ctaOptions, CTA_BANK } from '../growth/ctas';
import { buildPlatformMetadata, type SocialFacts } from '../growth/metadata';
import { buildPerformance, ratesOf, scoreRates, type PerformanceReport } from '../growth/performance';
import { candidatesFromCatalog, selectNext, type Candidate } from '../growth/selector';
import { planBacklog, planMismatch, planNext, type NextPlan } from '../growth/plan';
import { selectionReport } from '../growth/report';
import { createRng } from '../growth/rng';
import { CONTENT_TYPES, IMPLEMENTED_CONTENT_TYPES, templateForContentType } from '../growth/contentTypes';
import { TEMPLATE_LIST, findTemplate } from '../templates/registry';
import { ENGINE_DIR } from '../render/paths';
import { section, test } from './harness';

const NOW = '2026-10-06T12:00:00.000Z';
const sandboxes: string[] = [];

// ─── fixtures ──────────────────────────────────────────────────────────────
let seq = 0;
function feedItem(anime: string, subject: string, contentType = 'character-journey', extra: Partial<FeedItem> = {}): FeedItem {
  seq++;
  return {
    renderId: `${contentType}:${anime}:${subject}${extra.part ? `:part-0${extra.part}` : ''}@en`,
    contentId: `${contentType}:${anime}:${subject}`,
    contentType,
    animes: [anime],
    characters: [characterKey(anime, subject)],
    seriesId: null,
    part: null,
    partCount: null,
    hookType: null,
    hookId: null,
    ctaType: null,
    durationSeconds: 27,
    createdAt: `2026-10-0${Math.min(9, 1 + Math.floor(seq / 10))}T00:00:${String(seq % 60).padStart(2, '0')}Z`,
    state: 'published',
    ...extra,
  };
}

function candidate(anime: string, subject: string, contentType = 'character-journey', extra: Partial<Candidate> = {}): Candidate {
  const contentId = `${contentType}:${anime}:${subject}${extra.part ? `:part-0${extra.part}` : ''}`;
  return {
    renderId: `${contentId}@en`,
    contentId,
    contentType,
    templateId: contentType === 'guess-character' ? 'guessCharacter' : contentType === 'character-versus' ? 'characterVersus' : 'characterJourney',
    anime,
    animes: [anime],
    animeTitles: [anime],
    characters: [characterKey(anime, subject)],
    characterNames: [subject],
    seriesId: null,
    part: null,
    partCount: null,
    importance: 'main',
    durationSeconds: 27,
    item: { id: contentId, anime, animeTitle: anime, subject, facts: { places: 10, journeyArcs: 3 }, displayName: { en: subject, it: subject } } as unknown as CatalogItem,
    request: { template: 'characterJourney', anime, subject },
    ...extra,
  };
}

/** A performance report with given shrunk estimates (not cold start). */
function perf(estimates: { anime?: Record<string, number>; character?: Record<string, number>; contentType?: Record<string, number> } = {}, coldStart = false): PerformanceReport {
  const dim = (m: Record<string, number> = {}) => Object.fromEntries(Object.entries(m).map(([k, v]) => [k, { mean: v, n: 10, estimate: v }]));
  return {
    schemaVersion: 1,
    samples: coldStart ? 0 : 40,
    contents: coldStart ? 0 : 20,
    coldStart,
    globalMean: 50,
    weights: GROWTH_CONFIG.performanceWeights,
    posts: [],
    dimensions: { content: {}, character: dim(estimates.character), anime: dim(estimates.anime), contentType: dim(estimates.contentType), hookType: {}, durationBucket: {}, platform: {} },
  };
}
const exploitOnly: GrowthConfig = { ...GROWTH_CONFIG, explorationRate: 0 };
const exploreOnly: GrowthConfig = { ...GROWTH_CONFIG, explorationRate: 1 };

// ─── sandbox helpers ───────────────────────────────────────────────────────
const GOKU = 'character-journey:dragonball:goku:part-01@en';
function sandbox(): PipelineDirs {
  const root = mkdtempSync(path.join(tmpdir(), 'social-growth-'));
  sandboxes.push(root);
  return pipelineDirs(root);
}
function put(dirs: PipelineDirs, name: string, value: unknown) {
  mkdirSync(dirs.analyticsPending, { recursive: true });
  writeFileSync(path.join(dirs.analyticsPending, name), JSON.stringify(value));
}
/** Goku Part 1 rendered, published on Instagram (receipt pipeline), scheduled on TikTok. */
function publishedSandbox(): PipelineDirs {
  const dirs = sandbox();
  const h: History = emptyHistory();
  const { contentId, locale, variant } = parseRenderId(GOKU);
  const { anime, subject, segment } = parseContentId(contentId);
  const r: HistoryRecord = ensureRecord(h, { renderId: GOKU, contentId, template: 'characterJourney', anime, subject, locale, variant, segment, segmentFingerprint: null }, '2026-10-02T10:00:00Z', 'x.json');
  transition(r, 'rendering', '2026-10-02T10:01:00Z');
  transition(r, 'rendered', '2026-10-02T10:02:00Z', { renderedAt: '2026-10-02T10:02:00Z', durationSeconds: 25 });
  saveHistory(dirs, h);
  mkdirSync(dirs.publicationPending, { recursive: true });
  const receipt = (platform: string, status: string, extra: Record<string, unknown>) =>
    writeFileSync(path.join(dirs.publicationPending, `${platform}-${status}.json`), JSON.stringify({ receiptVersion: 1, renderId: GOKU, platform, provider: 'metricool', status, recordedAt: '2026-10-02T15:10:00Z', ...extra }));
  receipt('instagram', 'published', { publishedAt: '2026-10-02T15:00:00Z' });
  receipt('facebook', 'published', { publishedAt: '2026-10-02T15:00:00Z' });
  receipt('tiktok', 'scheduled', { scheduledFor: '2026-10-09T15:00:00Z' });
  assert.ok(applyPendingReceipts({ dirs, now: () => NOW }).applied);
  return dirs;
}

section('editorial rotation (hard rules)');
await test('max 2 same anime in a row: a 3rd consecutive Naruto is rejected; 1 Naruto after 1 is fine', () => {
  const two = [feedItem('onepiece', 'luffy'), feedItem('naruto', 'naruto'), feedItem('naruto', 'sasuke', 'guess-character')];
  assert.equal(trailingStreak(two, (f) => f.animes.includes('naruto')), 2);
  assert.match(hardRuleViolations(candidate('naruto', 'kakashi'), two).join(), /anime streak: the last 2 items are naruto/);
  assert.deepEqual(hardRuleViolations(candidate('naruto', 'kakashi'), two.slice(0, 2)), []);
  assert.deepEqual(hardRuleViolations(candidate('onepiece', 'zoro'), two), []);
});
await test('a cross-world versus counts for BOTH anime in the streak', () => {
  const feed = [feedItem('naruto', 'naruto'), { ...feedItem('naruto', 'sasuke', 'character-versus'), animes: ['naruto', 'onepiece'] }];
  assert.match(hardRuleViolations(candidate('naruto', 'kakashi'), feed).join(), /anime streak/);
  assert.deepEqual(hardRuleViolations(candidate('onepiece', 'zoro'), feed), []);
  const vs = candidate('dragonball', 'goku', 'character-versus', { animes: ['dragonball', 'naruto'], characters: ['dragonball:goku', 'naruto:itachi'] });
  assert.match(hardRuleViolations(vs, feed).join(), /anime streak/, 'a versus with Naruto in it is a 3rd Naruto');
});
await test('the same character is never twice in a row (any format)', () => {
  const feed = [feedItem('onepiece', 'luffy')];
  assert.match(hardRuleViolations(candidate('onepiece', 'luffy', 'guess-character'), feed).join(), /character streak/);
  const vs = candidate('naruto', 'naruto', 'character-versus', { animes: ['naruto', 'onepiece'], characters: ['naruto:naruto', 'onepiece:luffy'] });
  assert.match(hardRuleViolations(vs, feed).join(), /character streak/);
  assert.deepEqual(hardRuleViolations(candidate('onepiece', 'luffy', 'guess-character'), [...feed, feedItem('naruto', 'x')]), [], 'fine once someone else was in between');
});
await test('multi-part ordering: never Part N before N-1, never a part twice or backwards', () => {
  const series = 'character-journey:dragonball:goku';
  const p = (n: number) => candidate('dragonball', 'goku', 'character-journey', { seriesId: series, part: n, partCount: 5 });
  assert.match(hardRuleViolations(p(2), []).join(), /Part 2 before Part 1/);
  const feed = [feedItem('dragonball', 'goku', 'character-journey', { seriesId: series, part: 1 }), feedItem('naruto', 'a'), feedItem('onepiece', 'b'), feedItem('bleach', 'c')];
  assert.deepEqual(hardRuleViolations(p(2), feed), []);
  assert.match(hardRuleViolations(p(3), feed).join(), /Part 3 before Part 2/);
  assert.match(hardRuleViolations(p(1), feed).join(), /later or equal part/);
});
await test('journey spacing: at least 2 items between parts (hard), 3 preferred (soft)', () => {
  const series = 'character-journey:dragonball:goku';
  const p2 = candidate('dragonball', 'goku', 'character-journey', { seriesId: series, part: 2, partCount: 5 });
  const base = [feedItem('dragonball', 'goku', 'character-journey', { seriesId: series, part: 1 })];
  assert.match(hardRuleViolations(p2, [...base, feedItem('naruto', 'a')]).join(), /only 1 item\(s\) since Part 1 \(min 2\)/);
  const two = [...base, feedItem('naruto', 'a'), feedItem('onepiece', 'b')];
  assert.deepEqual(hardRuleViolations(p2, two), []);
  assert.match(softAdjustment(p2, two).reasons.join(), /only 2 items since the previous part \(preferred 3\)/);
  const three = [...two, feedItem('bleach', 'c')];
  assert.doesNotMatch(softAdjustment(p2, three).reasons.join(), /preferred/);
  assert.match(softAdjustment(p2, three).reasons.join(), /continues a started series/);
});

section('selector: performance optimizes, rotation decides');
await test('MANDATORY: Naruto 100 / Sasuke 95 / Kakashi 90 / Luffy 70, last two are Naruto → Luffy (best other anime)', () => {
  const feed = [feedItem('naruto', 'naruto-uzumaki', 'character-journey'), feedItem('naruto', 'sasuke-uchiha', 'guess-character')];
  const candidates = [
    candidate('naruto', 'naruto-uzumaki', 'character-versus'),
    candidate('naruto', 'sasuke-uchiha', 'character-journey'),
    candidate('naruto', 'kakashi-hatake', 'character-journey'),
    candidate('naruto', 'itachi-uchiha', 'guess-character'),
    candidate('onepiece', 'monkey-d-luffy', 'character-journey'),
    candidate('dragonball', 'goku', 'character-journey'),
  ];
  const scores = { 'naruto:naruto-uzumaki': 100, 'naruto:sasuke-uchiha': 95, 'naruto:kakashi-hatake': 90, 'naruto:itachi-uchiha': 99, 'onepiece:monkey-d-luffy': 70, 'dragonball:goku': 40 };
  const report = perf({ anime: { naruto: 100, onepiece: 70, dragonball: 40 }, character: scores });
  for (const config of [exploitOnly, exploreOnly, GROWTH_CONFIG]) {
    for (let seed = 0; seed < 25; seed++) {
      const s = selectNext({ candidates, feed, performance: report, config, seed: `s${seed}` });
      assert.ok(s.ok);
      assert.notEqual(s.pick.candidate.anime, 'naruto', `seed ${seed}: picked ${s.pick.candidate.renderId}`);
      assert.ok(!s.ranked.some((r) => r.candidate.animes.includes('naruto')), 'no Naruto candidate is even ranked');
    }
  }
  const exploit = selectNext({ candidates, feed, performance: report, config: exploitOnly, seed: 'x' });
  assert.ok(exploit.ok);
  assert.equal(exploit.pick.candidate.characters[0], 'onepiece:monkey-d-luffy', 'the best NON-Naruto content');
  assert.equal(exploit.rejected.MAX_SAME_ANIME_STREAK, 4);
});
await test('performance wins among VALID candidates: the best anime gets more space, never a 3-in-a-row', () => {
  const report = perf({ anime: { naruto: 95, onepiece: 50, dragonball: 50, bleach: 50 } });
  const pool = [
    ...['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((s) => candidate('naruto', `n-${s}`)),
    ...['a', 'b', 'c', 'd'].map((s) => candidate('onepiece', `o-${s}`)),
    ...['a', 'b', 'c', 'd'].map((s) => candidate('dragonball', `d-${s}`)),
    ...['a', 'b', 'c', 'd'].map((s) => candidate('bleach', `b-${s}`)),
  ];
  const feed: FeedItem[] = [];
  for (let i = 0; i < 14; i++) {
    const s = selectNext({ candidates: pool.filter((c) => !feed.some((f) => f.renderId === c.renderId)), feed, performance: report, config: exploitOnly });
    assert.ok(s.ok);
    feed.push(feedItem(s.pick.candidate.anime, s.pick.candidate.characters[0].split(':')[1]));
  }
  const animes = feed.map((f) => f.animes[0]);
  for (let i = 2; i < animes.length; i++) assert.ok(!(animes[i] === animes[i - 1] && animes[i] === animes[i - 2]), `3 in a row at ${i}: ${animes.join(' → ')}`);
  const naruto = animes.filter((a) => a === 'naruto').length;
  assert.ok(naruto >= 5 && naruto <= 9, `Naruto gets more space (${naruto}/14) without monopolising: ${animes.join(' → ')}`);
});
await test('exploration vs exploitation: ~30% of runs explore (seeded), cold start never optimises', () => {
  const c = [candidate('naruto', 'a'), candidate('onepiece', 'b')];
  let explore = 0;
  for (let i = 0; i < 400; i++) if (selectNext({ candidates: c, feed: [], performance: perf({}), seed: `run-${i}` }).mode === 'explore') explore++;
  assert.ok(explore > 90 && explore < 150, `explore share ${explore}/400`);
  for (let i = 0; i < 20; i++) assert.equal(selectNext({ candidates: c, feed: [], performance: perf({}, true), seed: `r${i}` }).mode, 'coldstart');
  // Exploitation follows performance, exploration favours what the feed has seen least.
  const feed = [feedItem('naruto', 'x'), feedItem('bleach', 'y'), feedItem('naruto', 'z'), feedItem('bleach', 'w')];
  const report = perf({ anime: { naruto: 90, onepiece: 20 } });
  const both = [candidate('naruto', 'a'), candidate('onepiece', 'b')];
  const ex = selectNext({ candidates: both, feed, performance: report, config: exploitOnly, seed: 'a' });
  assert.ok(ex.ok && ex.pick.candidate.anime === 'naruto');
  const nov = selectNext({ candidates: both, feed, performance: report, config: exploreOnly, seed: 'a' });
  assert.ok(nov.ok && nov.pick.candidate.anime === 'onepiece', 'explore picks the anime the feed has not shown');
});
await test('determinism + fail-safe: same state → same pick; nothing valid → blocked (publish nothing)', () => {
  const c = [candidate('naruto', 'a'), candidate('onepiece', 'b'), candidate('bleach', 'c')];
  const a = selectNext({ candidates: c, feed: [feedItem('dragonball', 'z')], performance: perf({}) });
  const b = selectNext({ candidates: c, feed: [feedItem('dragonball', 'z')], performance: perf({}) });
  assert.deepEqual(a, b);
  const feed = [feedItem('naruto', 'a'), feedItem('naruto', 'b')];
  const blocked = selectNext({ candidates: [candidate('naruto', 'c'), candidate('naruto', 'd')], feed, performance: perf({}) });
  assert.ok(!blocked.ok);
  assert.match(blocked.reason, /fail-safe/);
});
await test('duplicates: anything already queued/rendered/published is never a candidate again', async () => {
  const dirs = sandbox();
  const { catalog } = await buildCatalog(dirs, emptyHistory(), NOW);
  const all = candidatesFromCatalog(catalog, new Set());
  const taken = new Set([all[0].renderId, all[1].renderId]);
  const rest = candidatesFromCatalog(catalog, taken);
  assert.equal(rest.length, all.length - 2);
  assert.ok(!rest.some((c) => taken.has(c.renderId)));
  assert.match(hardRuleViolations(all[2], [{ ...feedItem('x', 'y'), renderId: all[2].renderId }]).join(), /duplicate/);
});

section('selector on the REAL catalog');
let realCatalog: Catalog;
await test('60 consecutive runs on the real catalog keep every hard rule (Naruto boosted to the top)', async () => {
  realCatalog = (await buildCatalog(sandbox(), emptyHistory(), NOW)).catalog;
  const report = perf({ anime: { naruto: 99, onepiece: 60, dragonball: 55 }, contentType: { 'character-journey': 80 } });
  const feed: FeedItem[] = [];
  const types = new Set<string>();
  for (let i = 0; i < 60; i++) {
    const taken = new Set(feed.map((f) => f.renderId));
    const s = selectNext({ candidates: candidatesFromCatalog(realCatalog, taken), feed, performance: report, seed: `sim-${i}` });
    assert.ok(s.ok, `run ${i} blocked`);
    const c = s.pick.candidate;
    assert.deepEqual(hardRuleViolations(c, feed), [], `run ${i}`);
    types.add(c.contentType);
    feed.push({ ...feedItem(c.anime, 'x'), renderId: c.renderId, contentId: c.contentId, contentType: c.contentType, animes: c.animes, characters: c.characters, seriesId: c.seriesId, part: c.part, partCount: c.partCount });
  }
  for (let i = 2; i < feed.length; i++) {
    for (const a of feed[i].animes) assert.ok(!(feed[i - 1].animes.includes(a) && feed[i - 2].animes.includes(a)), `3 × ${a} at ${i}`);
  }
  for (let i = 1; i < feed.length; i++) assert.ok(!feed[i].characters.some((c) => feed[i - 1].characters.includes(c)), `same character twice at ${i}`);
  const parts = feed.filter((f) => f.seriesId);
  for (const f of parts) {
    if (f.part! > 1) {
      const prev = feed.findIndex((g) => g.seriesId === f.seriesId && g.part === f.part! - 1);
      assert.ok(prev >= 0 && feed.indexOf(f) - prev - 1 >= 2, `${f.renderId} spacing`);
    }
  }
  assert.deepEqual([...types].sort(), ['character-journey', 'character-versus', 'guess-character'], 'formats alternate');
  const naruto = feed.filter((f) => f.animes.includes('naruto')).length;
  assert.ok(naruto >= 8 && naruto <= 40, `Naruto (best) gets more space, not the whole feed: ${naruto}/60`);
});
await test('next plan on the real catalog: a complete, valid queue request (hook, CTA, types, selection)', async () => {
  const history = emptyHistory();
  const { plan } = planNext({ catalog: realCatalog, history, performance: perf({}, true), now: NOW });
  assert.equal(plan.status, 'ready');
  assert.equal(plan.mode, 'coldstart');
  const req = parseContentRequest(plan.request);
  assert.ok(req.ok, req.ok ? '' : req.errors.join('; '));
  assert.ok(plan.request && HOOK_TYPES.includes(plan.request.hookType as never) && typeof plan.request.cta === 'string' && plan.request.locale === 'en');
});
await test('catalog/next.json is in sync with the committed stable state (npm run social:catalog)', async () => {
  const real = pipelineDirs();
  const queued = readdirSync(real.queue, { withFileTypes: true })
    .some((entry) => entry.isFile() && entry.name.endsWith('.json'));

  // Queue PRs intentionally add transient state without regenerating next.json.
  // After merge, the render/state workflow consumes the queue and regenerates
  // catalog artifacts. Enforcing next.json sync while a queue item is present
  // makes every valid queue-only PR fail solely because its candidate set changed.
  if (queued) return;

  const committed = JSON.parse(readFileSync(path.join(real.catalog, NEXT_FILE), 'utf8')) as { generatedAt: string; pick?: unknown; request?: unknown; status: string };
  const built = await buildCatalog(real, loadHistory(real), committed.generatedAt);
  assert.deepEqual([committed.status, committed.pick, committed.request], [built.plan.status, built.plan.pick, built.plan.request], 'stale next.json: run `npm run social:catalog`');
});

section('growth engine = the ONLY source of truth for the daily run (tests A–G)');
await test('TEST A: Naruto Journey → Sasuke Guess; Kakashi 100 / Naruto 95 / Luffy 70 / Goku 60 → Kakashi & Naruto EXCLUDED (MAX_SAME_ANIME_STREAK), Luffy or Goku selected', () => {
  const feed = [feedItem('naruto', 'naruto-uzumaki', 'character-journey'), feedItem('naruto', 'sasuke-uchiha', 'guess-character')];
  const candidates = [
    candidate('naruto', 'kakashi-hatake', 'character-journey'),
    candidate('naruto', 'naruto-uzumaki', 'guess-character'),
    candidate('onepiece', 'monkey-d-luffy', 'character-journey'),
    candidate('dragonball', 'goku', 'character-journey'),
  ];
  const report = perf({ character: { 'naruto:kakashi-hatake': 100, 'naruto:naruto-uzumaki': 95, 'onepiece:monkey-d-luffy': 70, 'dragonball:goku': 60 }, anime: { naruto: 100, onepiece: 70, dragonball: 60 } });
  for (const [config, coldStart] of [[exploitOnly, false], [exploreOnly, false], [GROWTH_CONFIG, true]] as const) {
    for (let i = 0; i < 20; i++) {
      const s = selectNext({ candidates, feed, performance: coldStart ? perf({}, true) : report, config, seed: `a${i}` });
      assert.ok(s.ok);
      assert.ok(['onepiece:monkey-d-luffy', 'dragonball:goku'].includes(s.pick.candidate.characters[0]), `picked ${s.pick.candidate.renderId}`);
      const excluded = Object.fromEntries(s.trace.excluded.map((e) => [e.characters[0], e.reasons]));
      assert.deepEqual(excluded['naruto:kakashi-hatake'], ['MAX_SAME_ANIME_STREAK']);
      assert.deepEqual(excluded['naruto:naruto-uzumaki'], ['MAX_SAME_ANIME_STREAK']);
      assert.equal(s.trace.constraints.forcedAnimeRotation, true);
      assert.deepEqual(s.trace.constraints.blockedAnimes, ['naruto']);
    }
  }
  // The excluded Naruto candidates had the higher potential: performance never overrides the rotation.
  const s = selectNext({ candidates, feed, performance: report, config: exploitOnly });
  assert.ok(s.ok && s.pick.candidate.characters[0] === 'onepiece:monkey-d-luffy');
  assert.ok(s.trace.excluded[0].potentialScore > s.trace.score!, 'Kakashi would have scored more, still excluded');
  assert.ok(s.trace.explanation.some((e) => /Forced anime rotation/.test(e)));
});
await test('TEST B: Naruto Journey → Luffy Journey: Naruto (highest score) is eligible again and wins in exploitation', () => {
  const feed = [feedItem('naruto', 'naruto-uzumaki'), feedItem('onepiece', 'monkey-d-luffy')];
  const kakashi = candidate('naruto', 'kakashi-hatake', 'guess-character');
  assert.deepEqual(ruleViolations(kakashi, feed), []);
  const s = selectNext({ candidates: [kakashi, candidate('dragonball', 'goku'), candidate('bleach', 'ichigo-kurosaki')], feed, performance: perf({ anime: { naruto: 95, dragonball: 60, bleach: 55 } }), config: exploitOnly });
  assert.ok(s.ok && s.pick.candidate.renderId === kakashi.renderId, s.ok ? s.pick.candidate.renderId : 'blocked');
  assert.equal(s.trace.constraints.forcedAnimeRotation, false);
});
await test('TEST C: Goku Part 1 → Luffy: Goku Part 2 is NOT eligible yet (JOURNEY_PART_SPACING); after 2 items it is', () => {
  const series = 'character-journey:dragonball:goku';
  const p1 = feedItem('dragonball', 'goku', 'character-journey', { part: 1, partCount: 6, seriesId: series });
  const p2 = candidate('dragonball', 'goku', 'character-journey', { part: 2, partCount: 6, seriesId: series });
  const feed = [p1, feedItem('onepiece', 'monkey-d-luffy')];
  assert.deepEqual(ruleViolations(p2, feed).map((v) => v.code), ['JOURNEY_PART_SPACING']);
  const s = selectNext({ candidates: [p2, candidate('bleach', 'ichigo-kurosaki')], feed, performance: perf({ anime: { dragonball: 100 } }), config: exploitOnly });
  assert.ok(s.ok && s.pick.candidate.anime === 'bleach');
  assert.deepEqual(s.trace.hardRulesTriggered, { JOURNEY_PART_SPACING: 1 });
  assert.deepEqual(ruleViolations(p2, [...feed, feedItem('naruto', 'kakashi-hatake')]), []);
  // Never Part 3 before Part 2.
  const p3 = candidate('dragonball', 'goku', 'character-journey', { part: 3, partCount: 6, seriesId: series });
  assert.deepEqual(ruleViolations(p3, [...feed, feedItem('naruto', 'a'), feedItem('bleach', 'b')]).map((v) => v.code), ['JOURNEY_PART_ORDER']);
});
await test('TEST D: analytics missing or unreadable → the publisher continues, cold-start/editorial selection', async () => {
  const dirs = sandbox();
  mkdirSync(path.dirname(dirs.metricsFile), { recursive: true });
  writeFileSync(dirs.metricsFile, '{ "schemaVersion": 99, "posts": "broken" ');
  assert.throws(() => loadMetrics(dirs));
  assert.equal(loadMetricsSafe(dirs).analytics.status, 'unavailable');
  const built = await buildCatalog(dirs, emptyHistory(), NOW);
  assert.deepEqual([built.plan.status, built.plan.mode, built.plan.analytics.status, built.performance.coldStart], ['ready', 'coldstart', 'unavailable', true]);
  assert.ok(built.plan.request && built.plan.trace?.status === 'selected');
  assert.match(built.plan.trace!.explanation[0], /Cold start/);
});
await test('TEST E: Journey 90 vs Guess 80, Journey in content-type cooldown → GuessCharacter is selected (soft, not hard)', () => {
  const feed = [feedItem('bleach', 'ichigo-kurosaki', 'character-journey')];
  const journey = candidate('naruto', 'kakashi-hatake', 'character-journey', { durationSeconds: 33 });
  const guess = candidate('onepiece', 'roronoa-zoro', 'guess-character', { durationSeconds: 27 });
  const report = perf({ contentType: { 'character-journey': 90, 'guess-character': 80 }, anime: { naruto: 90, onepiece: 80 }, character: { 'naruto:kakashi-hatake': 90, 'onepiece:roronoa-zoro': 80 } });
  report.dimensions.durationBucket = { long: { mean: 90, n: 10, estimate: 90 }, medium: { mean: 80, n: 10, estimate: 80 } };
  const noMix: GrowthConfig = { ...exploitOnly, penalties: { ...exploitOnly.penalties, formatDeficit: 0 } };
  const s = selectNext({ candidates: [journey, guess], feed, performance: report, config: noMix });
  assert.ok(s.ok);
  assert.equal(Math.round(s.ranked.find((r) => r.candidate === journey)!.base), 90);
  assert.equal(Math.round(s.ranked.find((r) => r.candidate === guess)!.base), 80);
  assert.equal(s.pick.candidate.contentType, 'guess-character', 'the format cooldown outweighs a 10-point edge');
  assert.ok(s.ranked.find((r) => r.candidate === journey)!.reasons.some((r) => /format cooldown/.test(r)));
  // Soft only: with the journey alone it is still selectable.
  assert.ok(selectNext({ candidates: [journey], feed, performance: report, config: noMix }).ok);
  // A long Journey streak pushes harder (Journey × 4 → other formats).
  const streak = [1, 2, 3, 4].map((i) => feedItem(['bleach', 'naruto', 'onepiece', 'hunterxhunter'][i - 1], `s${i}`));
  const adj = (n: number) => softAdjustment(candidate('dragonball', 'goku'), streak.slice(0, n)).adjustment;
  assert.ok(adj(4) < adj(2) && adj(2) < 0, `${adj(2)} → ${adj(4)}`);
});
await test('TEST F: after a Naruto content, Naruto Journey AND Naruto GuessCharacter are both excluded (character cooldown is format-agnostic)', () => {
  const feed = [feedItem('onepiece', 'monkey-d-luffy'), feedItem('naruto', 'naruto-uzumaki', 'character-versus', { characters: ['naruto:naruto-uzumaki', 'bleach:ichigo-kurosaki'], animes: ['naruto', 'bleach'] })];
  const journey = candidate('naruto', 'naruto-uzumaki', 'character-journey');
  const guess = candidate('naruto', 'naruto-uzumaki', 'guess-character');
  for (const c of [journey, guess]) assert.deepEqual(ruleViolations(c, feed).map((v) => v.code), ['MAX_SAME_CHARACTER_STREAK'], c.renderId);
  // The opponent of a versus counts as a character of that video too.
  assert.deepEqual(ruleViolations(candidate('bleach', 'ichigo-kurosaki', 'guess-character'), feed).map((v) => v.code), ['MAX_SAME_CHARACTER_STREAK']);
  const s = selectNext({ candidates: [journey, guess, candidate('dragonball', 'goku')], feed, performance: perf({ character: { 'naruto:naruto-uzumaki': 100 } }), config: exploitOnly });
  assert.ok(s.ok && s.pick.candidate.anime === 'dragonball');
  assert.deepEqual(editorialConstraints(feed).blockedCharacters, ['naruto:naruto-uzumaki', 'bleach:ichigo-kurosaki']);
});
await test('TEST G: a rendered video never published → NO new selection, publish the existing render (backlog first)', () => {
  const h = emptyHistory();
  const add = (renderId: string, at: string) => {
    const { contentId, locale, variant } = parseRenderId(renderId);
    const { anime, subject, segment } = parseContentId(contentId);
    const r = ensureRecord(h, { renderId, contentId, template: 'characterJourney', anime, subject, locale, variant, segment, segmentFingerprint: null }, at, 'x.json');
    transition(r, 'rendering', at);
    transition(r, 'rendered', at, { renderedAt: at, durationSeconds: 27, artifact: { name: 'a', runId: '1', runAttempt: '1', runUrl: 'u', video: 'v.mp4', manifest: 'm.json', sha256: null, expiresAt: '2026-12-31T00:00:00Z' } });
    return r;
  };
  const r = add('character-journey:naruto:kakashi-hatake@en', '2026-10-05T08:00:00Z');
  const catalog = { templates: {} } as unknown as Catalog;
  const { plan, selection } = planNext({ catalog, history: h, performance: perf({}, true), now: NOW });
  assert.equal(plan.status, 'backlog');
  assert.equal(selection, null, 'the selector does not even run');
  assert.equal(plan.request, undefined);
  assert.deepEqual(plan.backlog.unpublished.map((b) => b.renderId), [r.renderId]);
  assert.match(plan.reason!, /publish the existing render first/);
  // Once scheduled somewhere it is an UNFINISHED publication: it no longer blocks new content.
  r.platforms = [{ platform: 'instagram', status: 'scheduled', provider: 'metricool', scheduledFor: '2026-10-07T08:00:00Z', publishedAt: null, providerPostId: null, providerPostUuid: null, plannerUrl: null, publicUrl: null, error: null, updatedAt: NOW, receiptIds: [] } as never];
  const b = planBacklog(h, NOW);
  assert.deepEqual([b.unpublished.length, b.unfinished.map((u) => u.missing.length)], [0, [3]]);
  assert.notEqual(planNext({ catalog, history: h, performance: perf({}, true), now: NOW }).plan.status, 'backlog');
  // A queue file waiting for the render workflow is also backlog (no second video).
  assert.equal(planNext({ catalog, history: h, performance: perf({}, true), now: NOW, queueFiles: ['0012-x.json'] }).plan.status, 'backlog');
});
await test('gate: a queued feed video must BE the plan request (identity, hook, CTA, selection seed); backlog → nothing may be queued', () => {
  const plan = { status: 'ready', pick: { renderId: 'guess-character:bleach:renji-abarai@en' }, request: { template: 'guessCharacter', anime: 'bleach', subject: 'renji-abarai', locale: 'en', hook: 'H', hookType: 'question', hookId: 'gc-q-1', cta: 'C', ctaType: 'comment-guess', selection: { mode: 'coldstart', score: 1, seed: 'S' } } } as unknown as NextPlan;
  const raw = { $schema: 'x', ...plan.request! };
  assert.equal(planMismatch(plan, 'guess-character:bleach:renji-abarai@en', raw), null);
  assert.match(planMismatch(plan, 'character-journey:hunterxhunter:killua-zoldyck:part-01@en', raw)!, /growth engine selected/);
  assert.match(planMismatch(plan, 'guess-character:bleach:renji-abarai@en', { ...raw, cta: 'Follow for Part 2 and explore the journey on AniMapVerse' })!, /cta/);
  assert.match(planMismatch(plan, 'guess-character:bleach:renji-abarai@en', { ...raw, selection: { seed: 'other' } })!, /seed/);
  assert.match(planMismatch({ ...plan, status: 'backlog', reason: 'publish X' } as NextPlan, 'guess-character:bleach:renji-abarai@en', raw)!, /backlog/);
});
await test('SelectionTrace: machine-readable, explains the decision, no secret; the report shows pick, mode, recent feed, rules, exclusions', () => {
  const feed = [feedItem('naruto', 'naruto-uzumaki'), feedItem('naruto', 'sasuke-uchiha', 'guess-character')];
  const s = selectNext({ candidates: [candidate('naruto', 'kakashi-hatake'), candidate('onepiece', 'monkey-d-luffy', 'guess-character')], feed, performance: perf({}, true) });
  assert.ok(s.ok);
  const t = s.trace;
  assert.deepEqual([t.traceVersion, t.status, t.contentType, t.mode, t.candidates.considered, t.candidates.eligible], [1, 'selected', 'guess-character', 'coldstart', 2, 1]);
  assert.deepEqual(t.recent.map((r) => r.animes[0]), ['naruto', 'naruto']);
  assert.deepEqual(t.excluded.map((e) => [e.characters[0], e.reasons]), [['naruto:kakashi-hatake', ['MAX_SAME_ANIME_STREAK']]]);
  assert.doesNotMatch(JSON.stringify(t), /token|secret|password|api[_-]?key/i);
  const report = selectionReport({ status: 'ready', trace: t, analytics: { status: 'empty', posts: 0, error: null }, backlog: { unpublished: [], unfinished: [], inProgress: [] } } as unknown as NextPlan).join('\n');
  for (const needle of ['SOCIAL CONTENT SELECTION', 'Selected: guess-character:onepiece:monkey-d-luffy@en', 'Selection mode: coldstart', 'Recent anime: naruto → naruto', 'Forced anime rotation: YES', 'reason: maxSameAnimeStreak']) {
    assert.ok(report.includes(needle), `report misses "${needle}"\n${report}`);
  }
});
await test('content type → template → Remotion composition (no workflow edit per format); legacy journey CTA never generated', () => {
  const ids = new Set<string>();
  for (const type of IMPLEMENTED_CONTENT_TYPES) {
    const templateId = templateForContentType(type);
    const template = templateId ? findTemplate(templateId) : undefined;
    assert.ok(template && TEMPLATE_LIST.includes(template), `${type} has a registered template`);
    ids.add(template!.compositionId);
  }
  assert.equal(ids.size, IMPLEMENTED_CONTENT_TYPES.length, 'one composition per content type');
  assert.equal(templateForContentType('guess-location'), null, 'declared types are not rendered');
  assert.ok(!CTA_BANK.some((c) => /full journey/i.test(c.video)), 'the old "full journey on AniMapVerse" CTA is not a growth CTA');
});
await test('every implemented format can be planned with a growth hook + CTA (the template default CTA is never needed)', async () => {
  for (const type of IMPLEMENTED_CONTENT_TYPES) {
    const only = { ...realCatalog, templates: Object.fromEntries(Object.entries(realCatalog.templates).filter(([id]) => templateForContentType(type) === id)) } as Catalog;
    const { plan } = planNext({ catalog: only, history: emptyHistory(), performance: perf({}, true), now: NOW });
    assert.equal(plan.status, 'ready', type);
    assert.equal(plan.pick!.contentType, type);
    assert.ok(typeof plan.request!.cta === 'string' && typeof plan.request!.ctaType === 'string' && typeof plan.request!.hook === 'string', type);
    assert.doesNotMatch(String(plan.request!.cta), /full journey/i);
  }
});

section('hook & CTA engines');
await test('hooks: filled, ≤ 90 chars, typed, role-aware; guess hooks never contain the answer', () => {
  const vars = { character: 'Naruto Uzumaki', anime: 'Naruto', places: '14', arcs: '10', part: '2', total: '3', prev: '1', count: '6', characterA: 'Goku', characterB: 'Luffy' };
  for (const t of HOOK_BANK) assert.ok(HOOK_TYPES.includes(t.hookType), t.id);
  const first = hookOptions('character-journey', 'first', vars, []);
  const cont = hookOptions('character-journey', 'continuation', vars, []);
  assert.ok(first.length >= 6 && cont.length >= 3);
  assert.ok(cont.every((h) => /Part 2|Part 1|Name every stop/.test(h.hook)), 'later parts reference the series');
  for (const h of [...first, ...cont, ...hookOptions('character-versus', 'single', vars, [])]) {
    assert.ok(h.hook.length <= 90 && !/\{\w+\}/.test(h.hook), h.hook);
  }
  const { character: _c, ...guessVars } = vars;
  const guess = hookOptions('guess-character', 'single', guessVars, []);
  assert.ok(guess.length >= 4);
  assert.ok(guess.every((h) => !h.hook.includes('Naruto Uzumaki')));
  // Missing data → the template is skipped (never a half-filled hook).
  assert.ok(!hookOptions('character-journey', 'first', { character: 'X', anime: 'Y' }, []).some((h) => h.hookId === 'cj-fact-2'));
});
await test('hooks rotate: a template used in the last 4 items is not reused; the previous hook type is avoided', () => {
  const vars = { character: 'Goku', anime: 'Dragon Ball', places: '32', arcs: '16' };
  const feed = [feedItem('a', 'a', 'character-journey', { hookId: 'cj-challenge-1', hookType: 'challenge' })];
  const options = hookOptions('character-journey', 'first', vars, feed);
  assert.ok(!options.some((o) => o.hookId === 'cj-challenge-1'));
  for (let i = 0; i < 30; i++) {
    const h = chooseHook({ contentType: 'character-journey', role: 'first', vars, feed, mode: 'explore', rng: createRng(`h${i}`) });
    assert.ok(h && h.hookType !== 'challenge', `${h?.hookType}`);
  }
  // Exploit follows the best hook type.
  const h = chooseHook({ contentType: 'character-journey', role: 'first', vars, feed: [], mode: 'exploit', typeScores: { fact: 90, question: 40, challenge: 40, curiosity: 40 }, rng: createRng('z') });
  assert.equal(h?.hookType, 'fact');
});
await test('CTAs: a non-final part always promises the next part; the site only now and then; types rotate', () => {
  const part = chooseCta({ contentType: 'character-journey', nextPart: 2, vars: {} }, [], createRng('a'));
  assert.deepEqual(part, { ctaType: 'follow-next-part', cta: 'Follow for Part 2.' });
  assert.ok(ctaOptions({ contentType: 'guess-character', nextPart: null, vars: {} }).every((c) => c.ctaType !== 'site-visit'));
  const siteRecent = [feedItem('a', 'a', 'character-journey', { ctaType: 'site-visit' })];
  for (let i = 0; i < 30; i++) {
    const c = chooseCta({ contentType: 'character-journey', nextPart: null, vars: {} }, siteRecent, createRng(`c${i}`));
    assert.ok(c && c.ctaType !== 'site-visit');
  }
  const lastWasMissed = [feedItem('a', 'a', 'character-journey', { ctaType: 'comment-missed-location' })];
  for (let i = 0; i < 20; i++) assert.notEqual(chooseCta({ contentType: 'character-journey', nextPart: null, vars: {} }, lastWasMissed, createRng(`d${i}`))?.ctaType, 'comment-missed-location');
  const vs = ctaOptions({ contentType: 'character-versus', nextPart: null, vars: { characterA: 'Goku', characterB: 'Luffy' } });
  assert.ok(vs.some((c) => c.cta === 'Goku or Luffy? Tell us.'));
});

section('platform metadata');
const facts = (over: Partial<SocialFacts> = {}): SocialFacts => ({
  contentType: 'character-journey', animes: ['naruto'], animeTitles: ['Naruto'], characterNames: ['Naruto Uzumaki'], part: 1, partCount: 2, places: 14,
  pageUrl: 'https://animapverse.com/en/naruto/characters/naruto-uzumaki', spoilerFree: false, ...over,
});
await test('captions per network: IG engagement, TikTok short, YouTube searchable (≤ 100) + madeForKids false, Facebook simple', () => {
  const m = buildPlatformMetadata(facts(), 'Can you name every place Naruto Uzumaki visited?', 'follow-next-part');
  assert.equal(m.youtubeTitle, 'Every Place Naruto Uzumaki Visited 🍥 | Naruto Journey Part 1 of 2');
  assert.ok(m.youtubeTitle.length <= 100);
  assert.match(m.youtubeDescription, /Subscribe for Part 2\./);
  assert.match(m.instagramCaption, /Follow for Part 2\.[\s\S]*Save it[\s\S]*#naruto/);
  assert.ok(m.tiktokCaption.length < m.instagramCaption.length);
  assert.match(m.facebookCaption, /animapverse\.com/);
  assert.deepEqual([m.madeForKids, m.youtube.madeForKids], [false, false]);
  assert.ok(m.hashtags.includes('#narutouzumaki') && m.hashtags.includes('#AniMapVerse'));
});
await test('guess captions never reveal the answer; versus captions never reveal the winner', () => {
  const g = buildPlatformMetadata(facts({ contentType: 'guess-character', part: null, partCount: null, places: 6, spoilerFree: true, pageUrl: 'https://animapverse.com/en/naruto/map' }), 'Who visited all these places?', 'comment-guess');
  for (const text of [g.instagramCaption, g.tiktokCaption, g.youtubeTitle, g.youtubeDescription, g.facebookCaption, g.hashtags.join(' ')]) {
    assert.doesNotMatch(text, /Uzumaki|narutouzumaki/i, text);
  }
  assert.match(g.youtubeTitle, /^Guess the Naruto Character/);
  const v = buildPlatformMetadata(facts({ contentType: 'character-versus', animes: ['naruto', 'onepiece'], animeTitles: ['Naruto', 'One Piece'], characterNames: ['Naruto Uzumaki', 'Monkey D. Luffy'], part: null, partCount: null, places: null }), 'Who travelled more?', 'comment-pick-side');
  assert.equal(v.youtubeTitle, 'Naruto Uzumaki vs Monkey D. Luffy: Who Travelled More? 🍥');
  assert.doesNotMatch([v.instagramCaption, v.tiktokCaption, v.youtubeTitle, v.youtubeDescription, v.facebookCaption].join(' '), /(Uzumaki|Luffy) wins|\d+ places vs/i);
  assert.ok(v.hashtags.includes('#onepiece'));
});

section('analytics, performance, cold start');
await test('rates are normalized by views; missing / null metrics are dropped and weights re-normalized', () => {
  const { views, rates } = ratesOf({ views: 1000, shares: 10, comments: 6, likes: 60, saves: null, followersGained: 4, averageWatchTime: 15 }, 30);
  assert.equal(views, 1000);
  assert.deepEqual(rates, { shares: 0.01, comments: 0.006, likes: 0.06, follows: 0.004, retention: 0.5 });
  const full = scoreRates(rates)!;
  assert.ok(full > 40 && full < 60, `${full}`);
  assert.equal(scoreRates({}), null, 'no metric → no score');
  assert.ok(scoreRates({ shares: 0.02 })! > scoreRates({ shares: 0.005 })!);
  assert.equal(ratesOf({ views: null, likes: 5 }, 30).views, null, 'views not available yet → unscored');
});
await test('snapshots: contract, published-only, merge of delayed metrics, older ones ignored, all-or-nothing', () => {
  const dirs = publishedSandbox();
  const snap = (over: Record<string, unknown> = {}) => ({ snapshotVersion: 1, renderId: GOKU, platform: 'instagram', provider: 'metricool', collectedAt: '2026-10-06T08:00:00Z', metrics: { views: 1000, likes: 50, saves: null }, ...over });
  assert.ok(parseSnapshot(snap()).ok);
  for (const [bad, re] of [
    [snap({ metrics: { views: -1 } }), /must be a number ≥ 0/],
    [snap({ metrics: { retention: 35 } }), /is a rate/],
    [snap({ metrics: { subscribersGained: 3 } }), /not a instagram metric/],
    [snap({ metrics: {} }), /at least one metric/],
    [snap({ token: 'x' }), /token: unknown field/],
    [snap({ collectedAt: '2026-10-06' }), /collectedAt/],
  ] as const) {
    const p = parseSnapshot(bad);
    assert.ok(!p.ok && re.test(p.errors.join(' ')), JSON.stringify(bad));
  }
  put(dirs, 'a.json', snap());
  assert.ok(applyPendingSnapshots({ dirs, now: () => NOW }).applied);
  put(dirs, 'b.json', snap({ collectedAt: '2026-10-07T08:00:00Z', metrics: { views: 3000, shares: 30 } }));
  assert.ok(applyPendingSnapshots({ dirs, now: () => NOW }).applied);
  const post = loadMetrics(dirs).posts[postKey(GOKU, 'instagram')];
  assert.deepEqual([post.snapshots, post.metrics], [2, { views: 3000, likes: 50, saves: null, shares: 30 }], 'absent keys keep the previous value');
  put(dirs, 'c.json', snap({ collectedAt: '2026-10-05T08:00:00Z', metrics: { views: 1 } }));
  const old = applyPendingSnapshots({ dirs, now: () => NOW });
  assert.ok(old.applied && old.plan.items[0].ok && old.plan.items[0].outcome === 'unchanged');
  const before = readFileSync(dirs.metricsFile, 'utf8');
  put(dirs, 'd.json', snap({ collectedAt: '2026-10-08T08:00:00Z' }));
  put(dirs, 'e.json', snap({ platform: 'tiktok', metrics: { views: 5 } }));
  const r = applyPendingSnapshots({ dirs, now: () => NOW });
  assert.ok(!r.applied, 'TikTok is only scheduled → the whole batch is rejected');
  assert.equal(readFileSync(dirs.metricsFile, 'utf8'), before);
  assert.deepEqual(r.quarantined, ['e.json']);
});
await test('performance: Facebook never drives the score, immature metrics weigh less, estimates shrink to the mean', () => {
  const dirs = publishedSandbox();
  const metrics = emptyMetrics();
  const add = (platform: string, m: Record<string, number | null>, collectedAt = '2026-10-06T08:00:00Z') =>
    (metrics.posts[postKey(GOKU, platform)] = { renderId: GOKU, platform: platform as never, provider: 'metricool', providerPostUuid: null, publishedAt: '2026-10-02T15:00:00Z', firstCollectedAt: collectedAt, collectedAt, snapshots: 1, metrics: m, lastSnapshotId: 'x' });
  add('instagram', { views: 1000, shares: 20, comments: 10, likes: 80, saves: 20, followersGained: 8, retention: 0.7 });
  add('facebook', { views: 1000, shares: 0, comments: 0, likes: 0 });
  const report = buildPerformance(loadHistory(dirs), metrics);
  assert.equal(report.contents, 1);
  assert.equal(report.dimensions.platform.facebook.n, 1);
  const ig = report.posts.find((p) => p.platform === 'instagram')!;
  assert.equal(report.dimensions.content['character-journey:dragonball:goku:part-01'].mean, ig.score, 'facebook (weight 0) does not drag it down');
  const est = report.dimensions.anime.dragonball;
  const k = GROWTH_CONFIG.minimumSamples;
  assert.equal(est.estimate, Math.round(((1 * est.mean + k * report.globalMean) / (1 + k)) * 100) / 100, 'shrunk estimate (n·mean + k·global)/(n + k)');
  assert.ok(report.coldStart, `1 scored video < minimumSamples ${GROWTH_CONFIG.minimumSamples}`);
  add('instagram', { views: 1000, shares: 20 }, '2026-10-02T20:00:00Z');
  assert.equal(buildPerformance(loadHistory(dirs), metrics).posts.find((p) => p.platform === 'instagram')!.mature, false);
});
await test('no analytics at all: cold start, the publisher still plans (analytics are optional)', async () => {
  const dirs = sandbox();
  const built = await buildCatalog(dirs, emptyHistory(), NOW);
  assert.deepEqual([built.performance.samples, built.performance.coldStart, built.plan.status, built.plan.mode], [0, true, 'ready', 'coldstart']);
});

section('history: social block & migration');
await test('records older than the growth engine load and derive their feed facts (no rewrite needed)', () => {
  const legacy = {
    schemaVersion: 1,
    records: {
      'character-journey:dragonball:goku:part-02@en': {
        renderId: 'character-journey:dragonball:goku:part-02@en', contentId: 'character-journey:dragonball:goku:part-02', template: 'characterJourney', anime: 'dragonball', subject: 'goku', locale: 'en', variant: null,
        createdAt: '2026-10-02T10:00:00Z', updatedAt: 'x', renderStatus: 'rendered', renderedAt: 'x', outputFile: null, manifestFile: null, sourceFile: null, durationSeconds: 30, attempts: 1, lastError: null,
        publicationStatus: 'notPublished', publishedAt: null, platforms: [],
      },
    },
  };
  const r = normalizeHistory(legacy).records['character-journey:dragonball:goku:part-02@en'];
  assert.deepEqual([r.social, r.artifact, r.segment], [null, null, null]);
  const f = feedItemOf(r);
  assert.deepEqual([f.contentType, f.animes, f.characters, f.seriesId, f.part], ['character-journey', ['dragonball'], ['dragonball:goku'], 'character-journey:dragonball:goku', 2]);
});
await test('the real feed today: Goku → Naruto → Luffy part 1 (old local renders and other locales are not in the feed)', () => {
  const real = pipelineDirs();
  const feed = buildFeed(loadHistory(real), NOW);
  assert.deepEqual(feed.slice(0, 3).map((f) => f.renderId), [
    'character-journey:dragonball:goku:part-01@en',
    'character-journey:naruto:naruto-uzumaki:part-01@en',
    'character-journey:onepiece:monkey-d-luffy:part-01@en',
  ]);
  assert.ok(!feed.some((f) => f.renderId.endsWith('@it') || f.renderId === 'character-journey:naruto:itachi-uchiha@en'));
});

await test('enqueue writes the social block (format, characters, hook/CTA types, captions); versus keeps both characters', async () => {
  const dirs = sandbox();
  const results = await enqueueMany(
    dirs,
    [
      { template: 'guessCharacter', anime: 'naruto', subject: 'naruto-uzumaki', locale: 'en', hook: 'Who visited all these places?', hookType: 'question', hookId: 'gc-question-1', cta: 'Did you get it right?', ctaType: 'comment-guess', selection: { mode: 'coldstart', score: 80, seed: 's' } },
      { template: 'characterVersus', anime: 'dragonball', subject: 'goku', opponent: { anime: 'one-piece', subject: 'luffy' }, locale: 'en' },
    ],
    { now: () => NOW },
  );
  assert.ok(results.every((r) => r.ok), JSON.stringify(results.map((r) => (r.ok ? r.renderId : r.errors))));
  const history = loadHistory(dirs);
  const guess = history.records['guess-character:naruto:naruto-uzumaki@en'].social!;
  assert.deepEqual([guess.contentType, guess.characters, guess.hookType, guess.hookId, guess.ctaType, guess.selection?.mode], ['guess-character', ['naruto:naruto-uzumaki'], 'question', 'gc-question-1', 'comment-guess', 'coldstart']);
  assert.ok(guess.platformMetadata && !/Uzumaki/.test(guess.platformMetadata.instagramCaption + guess.platformMetadata.youtubeTitle));
  assert.match(guess.platformMetadata.facebookCaption, /\/en\/naruto\/map/, 'guess links the map, not the answer page');
  const ok = results[1].ok ? results[1] : null;
  assert.ok(ok);
  assert.deepEqual([ok.entry.subject, ok.entry.opponent], [ok.plan.resolved.identity.subject.split('-vs-')[0], { anime: 'onepiece', subject: 'monkey-d-luffy' }]);
  const vs = history.records[ok.renderId].social!;
  assert.deepEqual([vs.contentType, vs.animes, vs.characters.length], ['character-versus', ['dragonball', 'onepiece'], 2]);
  // The editorial check builds feed items from queue entries the same way.
  const f = feedItemFromSocial(ok.renderId, ok.plan.contentId, vs, NOW);
  assert.match(hardRuleViolations({ ...f, renderId: 'x@en' }, [f]).join(), /character streak/);
});

section('content types & schemas');
await test('content types: journey, guess and versus implemented; guess-location and journey-comparison declared', () => {
  assert.deepEqual(IMPLEMENTED_CONTENT_TYPES, ['character-journey', 'guess-character', 'character-versus']);
  assert.deepEqual([CONTENT_TYPES['guess-location'].implemented, CONTENT_TYPES['journey-comparison'].implemented], [false, false]);
});
await test('analytics/schemas/analytics-snapshot.schema.json matches the TypeScript constants', () => {
  assert.deepEqual(JSON.parse(readFileSync(SNAPSHOT_SCHEMA_FILE, 'utf8')), buildSnapshotSchema(), 'stale schema: run `npm run social:schema`');
});
await test('growth config: weights sum to 1, maxSameAnimeStreak = 2 (hard), every knob in one place', () => {
  const sum = Object.values(GROWTH_CONFIG.performanceWeights).reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(sum - 1) < 1e-9);
  assert.deepEqual([GROWTH_CONFIG.maxSameAnimeStreak, GROWTH_CONFIG.maxSameCharacterStreak, GROWTH_CONFIG.minItemsBetweenJourneyParts, GROWTH_CONFIG.preferredItemsBetweenJourneyParts, GROWTH_CONFIG.explorationRate], [2, 1, 2, 3, 0.3]);
  assert.equal(GROWTH_CONFIG.platformWeights.facebook, 0);
  void ENGINE_DIR;
});

for (const root of sandboxes) rmSync(root, { recursive: true, force: true });
