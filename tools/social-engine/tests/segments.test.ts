/**
 * Segmented CharacterJourney: partition algorithm, invariants on the real
 * data, dynamic duration/timing, series identity, duplicates per part.
 */
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { VERTICAL_FORMAT } from '../config/defaults';
import { buildCharacterJourney } from '../data/journey';
import { SINGLE_MAX_STOPS, SOFT_MAX_STOPS, arcGroups, effectiveArcs, partitionSizes, segmentJourney, segmentKey } from '../data/segments';
import { loadWorld } from '../data/world';
import { RenderDataError } from '../lib/errors';
import { buildCatalog } from '../pipeline/catalog';
import { pipelineDirs } from '../pipeline/dirs';
import { enqueueMany } from '../pipeline/enqueue';
import { emptyHistory, loadHistory } from '../pipeline/history';
import { fileStemFor, parseContentId, parseRenderId, seriesIdOf } from '../pipeline/ids';
import { resolveCharacterJourney } from '../templates/characterJourney/resolve';
import {
  AUTO_DURATION_MAX,
  AUTO_DURATION_MIN,
  maxStopsForDuration,
  planJourney,
  recommendedDurationSeconds,
} from '../templates/characterJourney/timeline';
import { rejects, section, test } from './harness';

const WORLDS = ['naruto', 'onepiece', 'hunterxhunter', 'dragonball', 'blackclover'];
const fixedNow = () => '2026-10-02T10:00:00.000Z';

section('partition algorithm');
await test('reference cases', () => {
  const cases: [number[], number[]][] = [
    [[1, 2, 3], [6]], // small arcs are merged
    [[6, 1, 1], [8]], // not 6 + 2
    [[4, 4], [8]],
    [[3, 3, 3], [3, 6]], // arcs ≤ 8 are never cut; the small part goes first, not as a tail
    [[1, 1, 1, 1, 1, 1], [6]],
    [[8], [8]],
    [[14], [7, 7]], // a huge arc is split internally, evenly
    [[6, 6, 2], [6, 8]], // rebalanced: no tiny "2" tail
    [[2, 2, 2, 2, 2], [4, 6]],
    [[1, 2, 3, 2, 4, 1, 3, 3], [6, 6, 7]], // the example of the brief
    [[9], [4, 5]],
    [[20], [6, 7, 7]],
    [[1, 8], [4, 5]], // a 1-stop part is never produced when anything else works
    [[2], [2]],
    [[], []],
  ];
  for (const [groups, expected] of cases) assert.deepEqual(partitionSizes(groups), expected, JSON.stringify(groups));
});

await test('exhaustive invariants (every sequence of up to 6 arcs of 1–10 stops)', () => {
  let checked = 0;
  const visit = (groups: number[]) => {
    if (groups.length) {
      const sizes = partitionSizes(groups);
      const total = groups.reduce((a, b) => a + b, 0);
      assert.equal(sizes.reduce((a, b) => a + b, 0), total, `sum ${groups}`);
      assert.ok(sizes.every((n) => n >= 1 && n <= SOFT_MAX_STOPS), `size ${groups} → ${sizes}`);
      if (total <= SINGLE_MAX_STOPS) assert.deepEqual(sizes, [total], `single ${groups}`);
      else {
        assert.ok(sizes.length >= 2, `series ${groups}`);
        assert.ok(sizes.every((n) => n >= 2), `no 1-stop part ${groups} → ${sizes}`);
        // A cut inside an arc only happens when that arc is bigger than SOFT_MAX
        // or when no partition cutting at arc boundaries only exists.
        const boundaryOnlyExists = feasibleAtBoundaries(groups);
        let pos = 0;
        for (const n of sizes.slice(0, -1)) {
          pos += n;
          const arcSize = arcSizeInside(groups, pos);
          if (arcSize !== null) assert.ok(arcSize > SOFT_MAX_STOPS || !boundaryOnlyExists, `needless cut inside an arc: ${groups} → ${sizes}`);
        }
      }
      // Deterministic.
      assert.deepEqual(partitionSizes(groups), sizes);
      checked++;
    }
    if (groups.length < 6) for (let g = 1; g <= 10; g++) visit([...groups, g]);
  };
  /** Size of the arc strictly containing position `pos` (null when `pos` is an arc boundary). */
  const arcSizeInside = (groups: number[], pos: number): number | null => {
    let start = 0;
    for (const g of groups) {
      if (pos > start && pos < start + g) return g;
      start += g;
    }
    return null;
  };
  // A boundary-only partition with parts of 2..8 stops exists.
  const feasibleAtBoundaries = (groups: number[]): boolean => {
    const ok: boolean[] = [true];
    for (let i = 1; i <= groups.length; i++) {
      ok[i] = false;
      let sum = 0;
      for (let j = i; j >= 1; j--) {
        sum += groups[j - 1];
        if (sum > SOFT_MAX_STOPS) break;
        if (sum >= 2 && ok[j - 1]) ok[i] = true;
      }
    }
    return ok[groups.length];
  };
  visit([]);
  assert.ok(checked > 1_000_000);
});

await test('segment keys are versioned', () => {
  assert.equal(segmentKey(1), 'part-01');
  assert.equal(segmentKey(12), 'part-12');
  assert.equal(segmentKey(3, 2), 'part-03-v2', 'a future algorithm never reuses "part-03"');
});

/** Same check as in the exhaustive test, for real arc groups. */
function boundaryPartitionExists(groups: number[]): boolean {
  const ok: boolean[] = [true];
  for (let i = 1; i <= groups.length; i++) {
    ok[i] = false;
    let sum = 0;
    for (let j = i; j >= 1; j--) {
      sum += groups[j - 1];
      if (sum > SOFT_MAX_STOPS) break;
      if (sum >= 2 && ok[j - 1]) ok[i] = true;
    }
  }
  return ok[groups.length];
}

section('segmentation on the real journeys');
type Journey = ReturnType<typeof buildCharacterJourney>;
const journeys: { world: string; id: string; journey: Journey }[] = [];
for (const world of WORLDS) {
  const { dataset } = await loadWorld(world);
  for (const c of dataset.characters) {
    const journey = buildCharacterJourney(dataset, c);
    if (journey.stops.length >= 2) journeys.push({ world, id: c.id, journey });
  }
}

await test(`every journey (${journeys.length}) is partitioned into ordered, disjoint, complete parts`, () => {
  for (const { id, journey } of journeys) {
    const seg = segmentJourney(journey.stops);
    const flat = seg.segments.flatMap((s) => journey.stops.slice(s.start, s.end));
    assert.deepEqual(flat, journey.stops, `${id}: stops preserved in order, none twice`);
    seg.segments.forEach((s, i) => {
      assert.equal(s.partNumber, i + 1, id);
      assert.equal(s.partCount, seg.segments.length, id);
      assert.equal(s.key, segmentKey(i + 1), id);
      assert.ok(s.end - s.start >= 2 && s.end - s.start <= SOFT_MAX_STOPS, `${id} ${s.key}: ${s.end - s.start} stops`);
      if (i > 0) assert.equal(s.start, seg.segments[i - 1].end, id);
    });
    assert.equal(seg.mode, journey.stops.length <= SINGLE_MAX_STOPS ? 'single' : 'series', id);
    // Arcs never jump: a part boundary inside an arc only splits an arc bigger than SOFT_MAX
    // (or one that cannot be placed otherwise, e.g. a 1-stop journey head before an 8-stop arc).
    const groups = arcGroups(journey.stops);
    for (let i = 1; i < seg.segments.length; i++) {
      const cut = seg.segments[i].start;
      const group = groups.find((g) => g.start < cut && cut < g.start + g.size);
      if (group) assert.ok(group.size > SOFT_MAX_STOPS || !boundaryPartitionExists(groups.map((g) => g.size)), `${id}: needless cut inside ${group.arcId}`);
    }
    // Arc order never goes backwards: each part starts at or after the previous part's last arc.
    const arcs = effectiveArcs(journey.stops);
    const order = [...new Set(arcs)];
    for (let i = 1; i < seg.segments.length; i++) {
      const prevLast = order.indexOf(arcs[seg.segments[i - 1].end - 1]);
      const nextFirst = order.indexOf(arcs[seg.segments[i].start]);
      assert.ok(nextFirst >= prevLast, `${id}: part ${i + 1} goes back in the arcs`);
    }
    assert.deepEqual(segmentJourney(journey.stops), seg, `${id}: deterministic`);
  }
});

await test('Goku and Sasuke are series of balanced parts', () => {
  const goku = journeys.find((j) => j.id === 'char-dbz-goku');
  const sasuke = journeys.find((j) => j.id === 'char-sasuke');
  assert.ok(goku && sasuke);
  const g = segmentJourney(goku.journey.stops);
  assert.equal(g.mode, 'series');
  assert.ok(g.segments.length >= 4, `Goku: ${g.segments.length} parts`);
  assert.ok(g.segments.every((s) => s.arcIds.length >= 1));
  const s = segmentJourney(sasuke.journey.stops);
  assert.equal(s.mode, 'series');
});

section('dynamic duration & timing');
await test('4–8 stops → 25/27/30/33/36 s, monotonic, within 24–38 s', () => {
  assert.deepEqual([4, 5, 6, 7, 8].map(recommendedDurationSeconds), [25, 27, 30, 33, 36]);
  let prev = 0;
  for (let n = 1; n <= 12; n++) {
    const d = recommendedDurationSeconds(n);
    assert.ok(d >= AUTO_DURATION_MIN && d <= AUTO_DURATION_MAX, `${n}: ${d}`);
    assert.ok(d >= prev, 'monotonic');
    prev = d;
  }
});
await test('every automatic plan gives each stop ≥ 2.6 s, and fixed scenes do not grow with the stops', () => {
  const fps = VERTICAL_FORMAT.fps;
  let hook = -1;
  for (let n = 2; n <= SOFT_MAX_STOPS; n++) {
    const seconds = recommendedDurationSeconds(n);
    const plan = planJourney(seconds, fps, n);
    assert.equal(plan.total, seconds * fps);
    assert.equal(plan.stops.length, n);
    for (const st of plan.stops) assert.ok(st.leave - st.travelStart >= 2.6 * fps, `${n} stops: ${(st.leave - st.travelStart) / fps}s per stop`);
    if (hook >= 0) assert.equal(plan.hook.end, hook, 'hook length is fixed');
    hook = plan.hook.end;
    assert.ok(maxStopsForDuration(seconds) >= n, `${n} stops fit their own automatic duration`);
  }
});

section('series identity & duplicates');
await test('part ids, render ids and file names', () => {
  const id = 'character-journey:dragonball:goku:part-02';
  assert.deepEqual(parseContentId(id), { template: 'character-journey', anime: 'dragonball', subject: 'goku', segment: 'part-02' });
  assert.equal(seriesIdOf(id), 'character-journey:dragonball:goku');
  assert.equal(fileStemFor(parseRenderId(`${id}@en`)), 'dragonball_goku_character-journey_part-02_en');
  assert.equal(fileStemFor(parseRenderId(`${id}@it+teaser`)), 'dragonball_goku_character-journey_part-02_it_teaser');
});
await test('segment is required for a series, forbidden for a single journey, must exist', async () => {
  const goku = { template: 'characterJourney' as const, anime: 'dragonball', subject: 'goku' };
  await rejects(() => resolveCharacterJourney(goku), /series of \d+ parts: set "segment" to one of part-01, part-02/, RenderDataError);
  await rejects(() => resolveCharacterJourney({ ...goku, segment: 'part-99' }), /segment "part-99" does not exist/, RenderDataError);
  await rejects(() => resolveCharacterJourney({ template: 'characterJourney', anime: 'naruto', subject: 'itachi', segment: 'part-01' }), /single video: remove "segment"/, RenderDataError);
});
await test('a part shows only its own stops, with part-aware hook / CTA / labels (en, it)', async () => {
  const { dataset } = await loadWorld('dragonball');
  const journey = buildCharacterJourney(dataset, dataset.characters.find((c) => c.id === 'char-dbz-goku')!);
  const seg = segmentJourney(journey.stops);
  const total = seg.segments.length;
  for (const s of seg.segments) {
    const en = await resolveCharacterJourney({ template: 'characterJourney', anime: 'dragonball', subject: 'goku', segment: s.key });
    assert.deepEqual(en.stops.map((x) => x.anchorLocationId), journey.stops.slice(s.start, s.end).map((x) => x.anchorLocationId), s.key);
    assert.equal(en.series?.partNumber, s.partNumber);
    assert.equal(en.series?.label, `Part ${s.partNumber} of ${total}`);
    assert.equal(en.durationSeconds, recommendedDurationSeconds(s.end - s.start));
    assert.equal(en.stats.journeyStops, journey.stops.length);
    if (s.partNumber === 1) assert.match(en.hook, /journey begins — Part 1 of/);
    else if (s.partNumber === total) assert.match(en.hook, /last stretch of .* — Part \d+ of/);
    else assert.match(en.hook, /journey continues — Part \d+ of/);
    assert.equal(en.cta, s.partNumber === total ? 'Explore the full journey on AniMapVerse' : 'Continue the journey on AniMapVerse');
    assert.equal(Boolean(en.series?.nextLabel), s.partNumber < total);
  }
  const it = await resolveCharacterJourney({ template: 'characterJourney', anime: 'dragonball', subject: 'goku', segment: 'part-02', locale: 'it' });
  assert.match(it.hook, /continua — Parte 2 di/);
  assert.equal(it.cta, 'Continua il viaggio su AniMapVerse');
});
await test('duplicates are per part: part-01 en twice ✗, part-02 en ✓, part-01 it ✓, part-01 en + variant ✓', async () => {
  const root = mkdtempSync(path.join(tmpdir(), 'social-segments-'));
  try {
    const dirs = pipelineDirs(root);
    const goku = (extra: Record<string, unknown>) => ({ template: 'characterJourney', anime: 'dragonball', subject: 'goku', ...extra });
    const r = await enqueueMany(
      dirs,
      [goku({ segment: 'part-01' }), goku({ segment: 'part-01' }), goku({ segment: 'part-02' }), goku({ segment: 'part-01', locale: 'it' }), goku({ segment: 'part-01', variant: 'teaser' })],
      { now: fixedNow },
    );
    assert.deepEqual(r.map((x) => x.ok), [true, false, true, true, true]);
    assert.ok(!r[1].ok && /already queued/.test(r[1].errors[0]));
    const files = r.filter((x): x is Extract<typeof x, { ok: true }> => x.ok).map((x) => x.file);
    assert.deepEqual(files, [
      '0001-dragonball_goku_character-journey_part-01_en.json',
      '0002-dragonball_goku_character-journey_part-02_en.json',
      '0003-dragonball_goku_character-journey_part-01_it.json',
      '0004-dragonball_goku_character-journey_part-01_en_teaser.json',
    ]);
    const entry = JSON.parse(readFileSync(path.join(dirs.queue, files[0]), 'utf8')) as Record<string, unknown>;
    assert.deepEqual(Object.keys(entry).slice(0, 8), ['$schema', 'id', 'status', 'template', 'anime', 'subject', 'segment', 'locale']);
    assert.equal(entry.id, 'character-journey:dragonball:goku:part-01');
    const rec = loadHistory(dirs).records['character-journey:dragonball:goku:part-01@en'];
    assert.equal(rec.segment, 'part-01');
    assert.match(rec.segmentFingerprint ?? '', /^[0-9a-f]{8}$/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

section('catalog series');
await test('every part is an item; parts are ordered and linked; ids are unique', async () => {
  const root = mkdtempSync(path.join(tmpdir(), 'social-segcat-'));
  try {
    const history = emptyHistory();
    // A legacy (pre-series) whole-journey render of a subject that is now a series.
    history.records['character-journey:onepiece:monkey-d-luffy@it'] = {
      ...JSON.parse(JSON.stringify(loadHistory(pipelineDirs()).records['character-journey:onepiece:monkey-d-luffy@it'] ?? {
        renderId: 'character-journey:onepiece:monkey-d-luffy@it', contentId: 'character-journey:onepiece:monkey-d-luffy', template: 'characterJourney',
        anime: 'onepiece', subject: 'monkey-d-luffy', locale: 'it', variant: null, segment: null, segmentFingerprint: null, createdAt: '', updatedAt: '',
        renderStatus: 'rendered', renderedAt: '', outputFile: null, manifestFile: null, sourceFile: null, durationSeconds: 22, attempts: 1, lastError: null,
        publicationStatus: 'notPublished', publishedAt: null, platforms: [],
      })),
    };
    const { catalog } = await buildCatalog(pipelineDirs(root), history, fixedNow());
    const items = catalog.templates.characterJourney?.items ?? [];
    assert.equal(new Set(items.map((i) => i.id)).size, items.length);
    const goku = items.filter((i) => i.subject === 'goku');
    assert.ok(goku.length >= 4);
    goku.forEach((item, i) => {
      assert.equal(item.series?.partNumber, i + 1);
      assert.equal(item.series?.partCount, goku.length);
      assert.equal(item.series?.id, 'character-journey:dragonball:goku');
      assert.equal(item.series?.previousId, i ? goku[i - 1].id : null);
      assert.equal(item.series?.nextId, goku[i + 1]?.id ?? null);
      assert.equal(item.id, `character-journey:dragonball:goku:${item.series?.segment}`);
      assert.equal(item.recommendedDurationSeconds, recommendedDurationSeconds(Number(item.facts.animatedStops)));
      assert.ok(Number(item.facts.animatedStops) <= SOFT_MAX_STOPS);
    });
    const itachi = items.find((i) => i.subject === 'itachi-uchiha');
    assert.equal(itachi?.series, null, 'short journeys stay single, with their old id');
    assert.equal(itachi?.id, 'character-journey:naruto:itachi-uchiha');
    const luffy = items.filter((i) => i.subject === 'monkey-d-luffy');
    assert.ok(luffy.length > 1 && luffy.every((i) => i.series?.legacyRenderedLocales?.join() === 'it' && !i.renderedBefore));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
