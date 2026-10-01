/**
 * social:validate — checks for the private social engine (plain node:assert,
 * like scripts/test-seo.ts). Covers: config schema, template registry, anime /
 * character / journey resolution, localization, sampling & timing, output
 * paths, and the isolation of the engine from the public app.
 */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { animeWorlds } from '@/data/worlds';
import { VERTICAL_FORMAT } from '../config/defaults';
import type { CharacterJourneyConfig } from '../config/types';
import { buildCharacterJourney, pickHighlights, sampleStops } from '../data/journey';
import { loadWorld } from '../data/world';
import { RenderDataError, SocialEngineError } from '../lib/errors';
import { resolveCharacterJourney } from '../templates/characterJourney/resolve';
import { maxStopsForDuration, planJourney } from '../templates/characterJourney/timeline';
import { TEMPLATE_LIST, findTemplate, parseSocialVideoConfig } from '../templates/registry';
import { ENGINE_DIR, OUTPUT_DIR, REPO_ROOT, SRC_DIR, resolveOutputPath } from './paths';

let passed = 0;
const failures: string[] = [];
async function test(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    passed++;
    console.log(`  ✔ ${name}`);
  } catch (err) {
    failures.push(name);
    console.log(`  ✖ ${name}\n    ${err instanceof Error ? err.message.split('\n').join('\n    ') : String(err)}`);
  }
}
async function rejects(fn: () => Promise<unknown>, pattern: RegExp, type: new (...a: never[]) => Error = SocialEngineError) {
  await assert.rejects(fn, (err: unknown) => {
    assert.ok(err instanceof type, `expected ${type.name}, got ${String(err)}`);
    assert.match((err as Error).message, pattern);
    return true;
  });
}
const itachi: CharacterJourneyConfig = { template: 'characterJourney', anime: 'naruto', subject: 'itachi-uchiha' };
const example = JSON.parse(readFileSync(path.join(ENGINE_DIR, 'examples/itachi-character-journey.json'), 'utf8')) as unknown;

console.log('\nconfig schema');
await test('the Itachi example is valid', () => {
  const r = parseSocialVideoConfig(example);
  assert.ok(r.ok, r.ok ? '' : r.errors.join('; '));
});
await test('CLI alias "character-journey" maps to characterJourney', () => {
  const r = parseSocialVideoConfig({ template: 'character-journey', anime: 'naruto', subject: 'itachi' });
  assert.ok(r.ok && r.config.template === 'characterJourney');
});
await test('missing / unknown / out-of-range fields are all reported', () => {
  const r = parseSocialVideoConfig({ template: 'characterJourney', locale: 'fr', durationSeconds: 300, colour: 'red', journey: { maxStops: 40 } });
  assert.ok(!r.ok);
  const all = r.errors.join('\n');
  for (const key of ['anime', 'subject', 'locale', 'durationSeconds', 'colour', 'journey.maxStops']) assert.match(all, new RegExp(`^${key.replace('.', '\\.')}:`, 'm'));
});
await test('unknown template and non-object configs are rejected', () => {
  assert.ok(!parseSocialVideoConfig({ template: 'nope', anime: 'naruto' }).ok);
  assert.ok(!parseSocialVideoConfig('naruto').ok);
  assert.ok(!parseSocialVideoConfig([]).ok);
});
await test('audio must be a local audio file path', () => {
  assert.ok(!parseSocialVideoConfig({ ...itachi, audio: { src: 'track.exe' } }).ok);
  assert.ok(!parseSocialVideoConfig({ ...itachi, audio: { src: 'a.mp3', volume: 3 } }).ok);
  assert.ok(parseSocialVideoConfig({ ...itachi, audio: { src: 'music/a.mp3', volume: 0.5 } }).ok);
});
await test('every content/*.json config is valid', () => {
  const dir = path.join(ENGINE_DIR, 'content');
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const r = parseSocialVideoConfig(JSON.parse(readFileSync(path.join(dir, file), 'utf8')));
    assert.ok(r.ok, `${file}: ${r.ok ? '' : r.errors.join('; ')}`);
  }
});

console.log('\ntemplate registry');
await test('ids, composition ids and CLI names are unique', () => {
  for (const key of ['id', 'compositionId', 'cliName'] as const) {
    const values = TEMPLATE_LIST.map((t) => t[key]);
    assert.equal(new Set(values).size, values.length, `duplicate ${key}`);
  }
});
await test('lookup by id or CLI name; each example parses', () => {
  for (const t of TEMPLATE_LIST) {
    assert.equal(findTemplate(t.id), t);
    assert.equal(findTemplate(t.cliName), t);
    assert.ok(parseSocialVideoConfig(t.example).ok, `${t.id} example`);
  }
});

console.log('\ndata resolution');
await test('anime: internal slug and public URL slug both resolve', async () => {
  assert.equal((await loadWorld('hunterxhunter')).world.slug, 'hunterxhunter');
  assert.equal((await loadWorld('hunter-x-hunter')).world.slug, 'hunterxhunter');
});
await test('anime: unknown and coming-soon worlds fail clearly', async () => {
  await rejects(() => loadWorld('pokemon'), /Unknown anime "pokemon"/);
  const soon = animeWorlds.find((w) => w.status === 'coming_soon');
  if (soon) await rejects(() => loadWorld(soon.slug), /has no dataset yet/);
});
await test('character: slug, id and short id resolve to Itachi', async () => {
  for (const subject of ['itachi-uchiha', 'char-itachi', 'itachi']) {
    const data = await resolveCharacterJourney({ ...itachi, subject });
    assert.equal(data.character.id, 'char-itachi', subject);
  }
});
await test('character: unknown subject fails with suggestions', async () => {
  await rejects(() => resolveCharacterJourney({ ...itachi, subject: 'itachi-uchia' }), /character "itachi-uchia" not found[\s\S]*Did you mean: itachi-uchiha/, RenderDataError);
});
await test('journey: Itachi has ≥ 2 projected, in-bounds stops from real data', async () => {
  const data = await resolveCharacterJourney(itachi);
  assert.ok(data.stops.length >= 2);
  assert.ok(data.stops.length <= maxStopsForDuration(data.durationSeconds));
  for (const s of data.stops) {
    assert.ok(s.point.x >= 0 && s.point.x <= data.map.width && s.point.y >= 0 && s.point.y <= data.map.height, s.locationId);
  }
  // Sub-map place (Uchiha District, Konoha sub-map) is drawn at the Konoha pin.
  const district = data.stops.find((s) => s.locationId === 'loc-konoha-uchiha-district');
  assert.ok(district && district.anchorLocationId === 'loc-konoha');
  assert.ok(data.highlights.length >= 2 && data.highlights.length <= 5);
  assert.equal(data.pageLabel, 'animapverse.com/en/naruto/characters/itachi-uchiha');
});
await test('journey: a character without route/located events fails (no empty video)', async () => {
  const { dataset } = await loadWorld('naruto');
  const lonely = dataset.characters.find((c) => buildCharacterJourney(dataset, c).stops.length === 0);
  assert.ok(lonely, 'expected at least one character without journey data');
  await rejects(() => resolveCharacterJourney({ ...itachi, subject: lonely.id }), /journey data missing for character/, RenderDataError);
});
await test('journey: unknown route ids and off-journey highlights fail', async () => {
  await rejects(() => resolveCharacterJourney({ ...itachi, journey: { routeIds: ['route-nope'] } }), /unknown route id/, RenderDataError);
  await rejects(() => resolveCharacterJourney({ ...itachi, highlights: ['loc-suna'] }), /is not a stop of this journey/, RenderDataError);
});
await test('template is generic: Sasuke, Kakashi, Luffy, Zoro, Gon, Killua all resolve', async () => {
  const cases: [string, string][] = [
    ['naruto', 'sasuke-uchiha'], ['naruto', 'kakashi-hatake'], ['onepiece', 'monkey-d-luffy'],
    ['onepiece', 'roronoa-zoro'], ['hunter-x-hunter', 'gon-freecss'], ['hunterxhunter', 'killua-zoldyck'],
  ];
  for (const [anime, subject] of cases) {
    const data = await resolveCharacterJourney({ template: 'characterJourney', anime, subject });
    assert.ok(data.stops.length >= 2, `${anime}/${subject}`);
  }
});

console.log('\nlocalization');
await test('it/en: hook, CTA, names and URLs come out in the right language', async () => {
  const en = await resolveCharacterJourney({ ...itachi, locale: 'en' });
  const it = await resolveCharacterJourney({ ...itachi, locale: 'it' });
  assert.equal(en.hook, "Follow Itachi Uchiha's journey across the Naruto world");
  assert.equal(it.hook, 'Segui il viaggio di Itachi Uchiha nel mondo di Naruto');
  assert.notEqual(en.cta, it.cta);
  assert.equal(en.map.name, 'Elemental Nations');
  assert.equal(it.map.name, 'Nazioni Elementali');
  assert.ok(it.stops.some((s) => s.placeName === 'Quartiere Uchiha'));
  assert.ok(it.pageLabel.endsWith('/it/naruto/characters/itachi-uchiha'));
});
await test('no unresolved Localizable leaks into the video data', async () => {
  for (const locale of ['it', 'en'] as const) {
    const json = JSON.stringify(await resolveCharacterJourney({ ...itachi, locale }));
    assert.ok(!json.includes('[object Object]'), locale);
  }
});
await test('explicit hook/CTA override the defaults', async () => {
  const data = await resolveCharacterJourney({ ...itachi, hook: 'Custom hook', cta: 'Custom CTA' });
  assert.equal(data.hook, 'Custom hook');
  assert.equal(data.cta, 'Custom CTA');
});

console.log('\nrhythm & sampling');
await test('sampling keeps first/last, respects max and order', () => {
  const stops = Array.from({ length: 10 }, (_, i) => ({ score: i % 3, id: i, anchorLocationId: `p${i}` }));
  const out = sampleStops(stops, 5);
  assert.equal(out.length, 5);
  assert.equal(out[0].id, 0);
  assert.equal(out[4].id, 9);
  assert.deepEqual(out.map((s) => s.id), [...out.map((s) => s.id)].sort((a, b) => a - b));
  assert.equal(sampleStops(stops.slice(0, 3), 5).length, 3);
});
await test('sampled journeys never repeat a pin twice in a row (real data, all worlds)', async () => {
  for (const anime of ['naruto', 'onepiece', 'hunterxhunter', 'dragonball', 'blackclover']) {
    const { dataset } = await loadWorld(anime);
    for (const c of dataset.characters) {
      const sampled = sampleStops(buildCharacterJourney(dataset, c).stops, 6);
      sampled.forEach((s, i) => assert.ok(i === 0 || s.anchorLocationId !== sampled[i - 1].anchorLocationId, `${c.id} @${i}`));
    }
  }
});
await test('highlights are unique places in journey order', () => {
  const stops = [{ score: 3, anchorLocationId: 'a' }, { score: 5, anchorLocationId: 'b' }, { score: 9, anchorLocationId: 'a' }, { score: 1, anchorLocationId: 'c' }];
  assert.deepEqual(pickHighlights(stops, 3), [1, 2, 3]);
});
await test('timeline tiles the full duration for 12–60 s and 2–8 stops', () => {
  for (const seconds of [12, 15, 22, 30, 45, 60]) {
    for (let n = 2; n <= 8; n++) {
      const p = planJourney(seconds, VERTICAL_FORMAT.fps, n);
      assert.equal(p.total, seconds * VERTICAL_FORMAT.fps);
      assert.ok(p.hook.end === p.intro.start && p.intro.end === p.journey.start && p.journey.end === p.recap.start && p.recap.end === p.cta.start && p.cta.end === p.total);
      assert.ok(p.hook.end >= 2 * VERTICAL_FORMAT.fps, 'hook ≥ 2 s');
      p.stops.forEach((s, i) => {
        assert.ok(s.travelStart < s.arrive && s.arrive < s.leave, `stop ${i} (${seconds}s/${n})`);
        if (i > 0) assert.equal(s.travelStart, p.stops[i - 1].leave);
      });
    }
  }
});
await test('short videos animate fewer stops', () => {
  assert.ok(maxStopsForDuration(12) < maxStopsForDuration(22));
  assert.ok(maxStopsForDuration(12) >= 2);
});

console.log('\noutput & isolation');
await test('output path is deterministic and under output/', async () => {
  const t = findTemplate('characterJourney');
  assert.ok(t);
  const a = await t.resolve(itachi);
  const b = await t.resolve(itachi);
  assert.equal(a.outputBaseName, 'itachi-uchiha-character-journey-en');
  assert.deepEqual(a.props, b.props);
  assert.equal(resolveOutputPath(a.outputBaseName), path.join(OUTPUT_DIR, 'itachi-uchiha-character-journey-en.mp4'));
  assert.throws(() => resolveOutputPath('x', 'video.mov'));
});
await test('renders, caches and media files are gitignored', () => {
  const gi = readFileSync(path.join(REPO_ROOT, '.gitignore'), 'utf8');
  for (const rule of ['tools/social-engine/output/*', 'tools/social-engine/.cache/', '*.mp4']) assert.ok(gi.includes(rule), rule);
});
await test('the public app never imports the engine or Remotion', () => {
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = path.join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.(tsx?|jsx?|css)$/.test(name)) {
        const code = readFileSync(full, 'utf8');
        if (/from ['"](remotion|@remotion\/[^'"]+)['"]|social-engine/.test(code)) offenders.push(path.relative(REPO_ROOT, full));
      }
    }
  };
  walk(SRC_DIR);
  assert.deepEqual(offenders, []);
  const pkg = JSON.parse(readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8')) as { dependencies: Record<string, string>; devDependencies: Record<string, string> };
  assert.ok(!Object.keys(pkg.dependencies).some((d) => d === 'remotion' || d.startsWith('@remotion/')), 'Remotion must stay a devDependency');
});

console.log(`\n${failures.length ? '✖' : '✔'} ${passed} passed, ${failures.length} failed\n`);
if (failures.length) process.exit(1);
