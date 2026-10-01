/**
 * Content-pipeline tests. Everything runs in a temporary sandbox root (same
 * layout as tools/social-engine/) with a FAKE renderer, so queue/history/
 * failure/retry logic is tested without Chromium. Real renders are exercised
 * by `npm run social:render:queue`.
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { runBatch, requeueFailed, type RendererFactory } from '../pipeline/batch';
import { buildCatalog, CATALOG_FILE, type Catalog } from '../pipeline/catalog';
import { parseContentRequest, planContent, resolveAudioPath } from '../pipeline/content';
import { pipelineDirs, type PipelineDirs } from '../pipeline/dirs';
import { checkDuplicate } from '../pipeline/duplicates';
import { enqueueMany } from '../pipeline/enqueue';
import { listContentFiles } from '../pipeline/queue';
import { moveInto, safeJoin } from '../pipeline/fs';
import { canTransition, emptyHistory, ensureRecord, loadHistory, RENDER_STATUSES, transition } from '../pipeline/history';
import { contentIdFor, fileStemFor, parseContentId, parseRenderId, renderIdFor } from '../pipeline/ids';
import { acquireLock, LockError } from '../pipeline/lock';
import { buildContentSchema } from '../pipeline/schema';
import { ENGINE_DIR, REPO_ROOT } from '../render/paths';
import { resolveCharacterJourney } from '../templates/characterJourney/resolve';
import { videoText } from '../templates/characterJourney/CharacterJourney';
import { FONT_COVERAGE_RE } from '../lib/fonts';
import { buildRunSummary } from '../pipeline/runSummary';
import { section, test } from './harness';

const sandboxes: string[] = [];
function sandbox(): PipelineDirs {
  const root = mkdtempSync(path.join(tmpdir(), 'social-pipeline-'));
  sandboxes.push(root);
  return pipelineDirs(root);
}
const fixedNow = () => '2026-10-01T12:00:00.000Z';
const req = (subject: string, extra: Record<string, unknown> = {}) => ({ template: 'characterJourney', anime: 'naruto', subject, ...extra });

/** Fake renderer: writes a tiny file; fails for requests whose notes say FAIL. */
const fakeRenderer: RendererFactory = async () => ({
  async render(plan, outputFile) {
    if (plan.request.notes === 'FAIL') throw new Error('simulated render crash');
    mkdirSync(path.dirname(outputFile), { recursive: true });
    writeFileSync(outputFile, `fake ${plan.renderId}`);
    return { width: 1080, height: 1920, fps: 30, durationInFrames: plan.resolved.durationSeconds * 30 };
  },
});
const run = (dirs: PipelineDirs, extra: Partial<Parameters<typeof runBatch>[0]> = {}) =>
  runBatch({ dirs, createRenderer: fakeRenderer, now: fixedNow, ...extra });
const snapshot = (dirs: PipelineDirs) =>
  JSON.stringify(
    [dirs.queue, dirs.rendered, dirs.failed, dirs.output, dirs.history].map((d) => (existsSync(d) ? readdirSync(d).sort() : [])),
  ) + (existsSync(dirs.historyFile) ? readFileSync(dirs.historyFile, 'utf8') : '');

section('content ids & naming');
await test('ids are stable, readable and parse back', () => {
  const id = contentIdFor('character-journey', 'naruto', 'itachi-uchiha');
  assert.equal(id, 'character-journey:naruto:itachi-uchiha');
  assert.deepEqual(parseContentId(id), { template: 'character-journey', anime: 'naruto', subject: 'itachi-uchiha', segment: null });
  const rid = renderIdFor({ contentId: id, locale: 'it', variant: 'teaser' });
  assert.equal(rid, 'character-journey:naruto:itachi-uchiha@it+teaser');
  assert.deepEqual(parseRenderId(rid), { contentId: id, locale: 'it', variant: 'teaser' });
  assert.equal(fileStemFor(parseRenderId(rid)), 'naruto_itachi-uchiha_character-journey_it_teaser');
  assert.equal(fileStemFor(parseRenderId(`${id}@en`)), 'naruto_itachi-uchiha_character-journey_en');
});
await test('unsafe segments can never become ids or file names', () => {
  for (const bad of ['../etc', 'A', 'a b', 'a/b', 'a_b', '', '-a', 'a'.repeat(81)]) {
    assert.throws(() => contentIdFor('character-journey', 'naruto', bad), Error, bad);
  }
  assert.throws(() => renderIdFor({ contentId: 'character-journey:naruto:x', locale: 'en', variant: '../x' }));
  assert.throws(() => parseRenderId('character-journey:naruto:x@fr'));
});
await test('content id ignores hook, CTA, locale and the subject spelling', async () => {
  const dirs = sandbox();
  const forms = [req('itachi-uchiha'), req('char-itachi', { hook: 'Other hook', locale: 'it' }), req('itachi', { anime: 'naruto', cta: 'x' })];
  const ids = new Set<string>();
  for (const f of forms) {
    const parsed = parseContentRequest(f);
    assert.ok(parsed.ok);
    ids.add((await planContent(dirs, parsed.request)).contentId);
  }
  assert.deepEqual([...ids], ['character-journey:naruto:itachi-uchiha']);
  const parsed = parseContentRequest({ template: 'character-journey', anime: 'one-piece', subject: 'luffy', segment: 'part-02' });
  assert.ok(parsed.ok);
  assert.equal((await planContent(dirs, parsed.request)).contentId, 'character-journey:onepiece:monkey-d-luffy:part-02');
});

section('content request parsing');
await test('pipeline fields are validated with the video config', () => {
  assert.ok(parseContentRequest(req('itachi', { id: 'character-journey:naruto:itachi-uchiha', status: 'queued', variant: 'v2', notes: 'why' })).ok);
  const r = parseContentRequest(req('itachi', { status: 'rendered', variant: 'Bad Variant', notes: 'x'.repeat(600), allowRerender: 'yes', extra: 1 }));
  assert.ok(!r.ok);
  for (const key of ['status', 'variant', 'notes', 'allowRerender', 'extra']) assert.ok(r.errors.some((e) => e.startsWith(`${key}:`)), key);
});
await test('a wrong explicit id is refused', async () => {
  const parsed = parseContentRequest(req('itachi', { id: 'character-journey:naruto:sasuke-uchiha' }));
  assert.ok(parsed.ok);
  await assert.rejects(() => planContent(sandbox(), parsed.request), /id mismatch/);
});

section('filesystem safety');
await test('safeJoin refuses traversal and absolute segments', () => {
  const base = sandbox().queue;
  for (const bad of ['../x.json', '/etc/passwd', 'a/../../x', '']) assert.throws(() => safeJoin(base, bad), Error, bad);
  assert.equal(safeJoin(base, 'ok.json'), path.join(base, 'ok.json'));
});
await test('audio can only come from <root>/audio/', () => {
  const dirs = sandbox();
  mkdirSync(dirs.audio, { recursive: true });
  writeFileSync(path.join(dirs.audio, 'tone.mp3'), 'x');
  assert.equal(resolveAudioPath(dirs, 'tone.mp3'), path.join(dirs.audio, 'tone.mp3'));
  assert.equal(resolveAudioPath(dirs, 'audio/tone.mp3'), path.join(dirs.audio, 'tone.mp3'));
  for (const bad of ['../../etc/passwd.mp3', '/tmp/tone.mp3', 'audio/../tone.mp3', 'missing.mp3']) assert.throws(() => resolveAudioPath(dirs, bad), Error, bad);
});
await test('queue scan skips unsafe names and symlinks; moves never overwrite', () => {
  const dirs = sandbox();
  mkdirSync(dirs.queue, { recursive: true });
  writeFileSync(path.join(dirs.queue, '0001-ok.json'), '{}');
  writeFileSync(path.join(dirs.queue, 'bad name.json'), '{}');
  writeFileSync(path.join(dirs.queue, 'README.md'), '#');
  symlinkSync('/etc/hostname', path.join(dirs.queue, '0002-link.json'));
  const { entries, unsafe } = listContentFiles(dirs.queue);
  assert.deepEqual(entries, ['0001-ok.json']);
  assert.deepEqual(unsafe.sort(), ['0002-link.json', 'bad name.json']);
  mkdirSync(dirs.rendered, { recursive: true });
  writeFileSync(path.join(dirs.rendered, '0001-ok.json'), 'old');
  assert.equal(path.basename(moveInto(path.join(dirs.queue, '0001-ok.json'), dirs.rendered)), '0001-ok-2.json');
});

section('history & status');
await test('render status machine only allows legal moves', () => {
  const legal = new Set(['queued>rendering', 'queued>failed', 'rendering>rendered', 'rendering>failed', 'rendering>queued', 'rendered>queued', 'failed>queued', 'failed>rendering']);
  for (const a of RENDER_STATUSES) for (const b of RENDER_STATUSES) if (a !== b) assert.equal(canTransition(a, b), legal.has(`${a}>${b}`), `${a}>${b}`);
  const h = emptyHistory();
  const r = ensureRecord(h, { renderId: 'character-journey:naruto:x@en', contentId: 'character-journey:naruto:x', template: 'characterJourney', anime: 'naruto', subject: 'x', locale: 'en', variant: null, segment: null, segmentFingerprint: null }, fixedNow(), null);
  assert.equal(ensureRecord(h, r, fixedNow(), null), r, 'idempotent');
  assert.equal(r.publicationStatus, 'notPublished');
  assert.deepEqual(r.platforms, []);
  transition(r, 'rendering', fixedNow());
  transition(r, 'rendered', fixedNow());
  assert.throws(() => transition(r, 'failed', fixedNow()), /Illegal status change/);
});
await test('duplicate policy: queued/rendered blocked, failed = retry, variant/locale allowed', () => {
  const h = emptyHistory();
  const base = { renderId: 'character-journey:naruto:x@en', contentId: 'character-journey:naruto:x', template: 'characterJourney', anime: 'naruto', subject: 'x', locale: 'en' as const, variant: null, segment: null, segmentFingerprint: null };
  const args = { renderId: base.renderId, contentId: base.contentId, history: h, queued: new Map<string, string>(), allowRerender: false };
  assert.ok(checkDuplicate(args).ok);
  assert.ok(!checkDuplicate({ ...args, queued: new Map([[base.renderId, '0001.json']]) }).ok);
  const r = ensureRecord(h, base, fixedNow(), null);
  transition(r, 'rendering', fixedNow());
  transition(r, 'failed', fixedNow());
  assert.ok(checkDuplicate(args).ok, 'failed → retry allowed');
  transition(r, 'rendering', fixedNow());
  transition(r, 'rendered', fixedNow());
  const blocked = checkDuplicate(args);
  assert.ok(!blocked.ok && /already rendered/.test(blocked.reason));
  assert.ok(checkDuplicate({ ...args, allowRerender: true }).ok);
  const other = checkDuplicate({ ...args, renderId: `${base.contentId}@it` });
  assert.ok(other.ok && other.notes.some((n) => /already rendered as: en/.test(n)));
});

section('queue → batch → history');
await test('enqueue writes canonical, numbered entries and rejects duplicates', async () => {
  const dirs = sandbox();
  const results = await enqueueMany(dirs, [req('itachi'), req('itachi-uchiha'), req('itachi', { locale: 'it' }), req('nobody-at-all')], { now: fixedNow });
  assert.deepEqual(results.map((r) => r.ok), [true, false, true, false]);
  assert.deepEqual(listContentFiles(dirs.queue).entries, ['0001-naruto_itachi-uchiha_character-journey_en.json', '0002-naruto_itachi-uchiha_character-journey_it.json']);
  const entry = JSON.parse(readFileSync(path.join(dirs.queue, '0001-naruto_itachi-uchiha_character-journey_en.json'), 'utf8')) as Record<string, unknown>;
  assert.equal(entry.id, 'character-journey:naruto:itachi-uchiha');
  assert.equal(entry.subject, 'itachi-uchiha');
  assert.equal(entry.locale, 'en');
  assert.equal(entry.durationSeconds, 27, 'automatic duration: 5 stops → 27 s');
  assert.equal(entry.hook, "Follow Itachi Uchiha's journey across the Naruto world.");
  assert.equal(entry.cta, 'Explore the full journey on AniMapVerse');
  assert.ok(parseContentRequest(entry).ok, 'canonical entry is itself a valid request');
  assert.equal(loadHistory(dirs).records['character-journey:naruto:itachi-uchiha@en'].renderStatus, 'queued');
  const again = await enqueueMany(dirs, [req('char-itachi')], { now: fixedNow });
  assert.ok(!again[0].ok && /already queued/.test(again[0].errors[0]));
});
await test('dry run reads and plans but changes nothing', async () => {
  const dirs = sandbox();
  await enqueueMany(dirs, [req('itachi'), req('jiraiya')], { now: fixedNow });
  const before = snapshot(dirs);
  const r = await run(dirs, { dryRun: true });
  assert.equal(r.planned.length, 2);
  assert.equal(snapshot(dirs), before);
});
await test('batch renders in order, isolates failures, keeps everything, writes manifests', async () => {
  const dirs = sandbox();
  await enqueueMany(dirs, [req('itachi'), req('jiraiya', { notes: 'FAIL' }), req('sasuke-uchiha', { segment: 'part-01' })], { now: fixedNow });
  writeFileSync(path.join(dirs.queue, '0004-agent.json'), '{ not json');
  writeFileSync(path.join(dirs.queue, '0005-agent.json'), JSON.stringify(req('char-itachi')));
  const r = await run(dirs);
  assert.deepEqual(r.rendered.map((x) => x.renderId), ['character-journey:naruto:itachi-uchiha@en', 'character-journey:naruto:sasuke-uchiha:part-01@en']);
  assert.deepEqual(r.failed.map((x) => x.renderId), ['character-journey:naruto:jiraiya@en']);
  assert.deepEqual(r.rejected.map((x) => x.kind).sort(), ['duplicate', 'invalid']);
  assert.deepEqual(listContentFiles(dirs.queue).entries, []);
  assert.equal(listContentFiles(dirs.rendered).entries.length, 2);
  assert.deepEqual(listContentFiles(dirs.failed).entries, ['0002-naruto_jiraiya_character-journey_en.json', '0004-agent.json', '0005-agent.json']);
  const err = JSON.parse(readFileSync(path.join(dirs.failed, '0002-naruto_jiraiya_character-journey_en.error.json'), 'utf8')) as Record<string, unknown>;
  assert.equal(err.renderId, 'character-journey:naruto:jiraiya@en');
  assert.deepEqual(err.errors, ['simulated render crash']);
  assert.equal((err.config as { subject: string }).subject, 'jiraiya');
  assert.equal(err.failedAt, fixedNow());
  const h = loadHistory(dirs).records;
  const ok = h['character-journey:naruto:itachi-uchiha@en'];
  assert.equal(ok.renderStatus, 'rendered');
  assert.equal(ok.renderedAt, fixedNow());
  assert.equal(ok.attempts, 1);
  assert.ok(ok.outputFile?.endsWith('output/naruto_itachi-uchiha_character-journey_en.mp4'));
  const manifest = JSON.parse(readFileSync(path.join(dirs.output, 'naruto_itachi-uchiha_character-journey_en.manifest.json'), 'utf8')) as Record<string, unknown>;
  assert.equal(manifest.contentId, 'character-journey:naruto:itachi-uchiha');
  assert.equal(manifest.resolution, '1080x1920');
  assert.equal((manifest.sourceConfig as { subject: string }).subject, 'itachi-uchiha');
  // Machine-readable run summary (what the GitHub artifact carries).
  const summary = buildRunSummary(dirs, r, fixedNow());
  assert.deepEqual(summary.counts, { considered: 5, rendered: 2, failed: 3, planned: 3, remainingInQueue: 0 });
  assert.deepEqual(summary.rendered[0], {
    renderId: 'character-journey:naruto:itachi-uchiha@en',
    contentId: 'character-journey:naruto:itachi-uchiha',
    template: 'characterJourney',
    anime: 'naruto',
    subject: 'itachi-uchiha',
    locale: 'en',
    variant: null,
    seriesId: null,
    segment: null,
    partNumber: null,
    partCount: null,
    title: 'Itachi Uchiha · Character Journey',
    durationSeconds: 27,
    sha256: (manifest as { sha256: string }).sha256,
    video: 'videos/naruto_itachi-uchiha_character-journey_en.mp4',
    manifest: 'manifests/naruto_itachi-uchiha_character-journey_en.manifest.json',
    sourceFile: '0001-naruto_itachi-uchiha_character-journey_en.json',
  });
  const part = summary.rendered[1];
  assert.deepEqual([part.seriesId, part.segment, part.partNumber, part.partCount], ['character-journey:naruto:sasuke-uchiha', 'part-01', 1, 2]);
  assert.equal(part.video, 'videos/naruto_sasuke-uchiha_character-journey_part-01_en.mp4');
  const partManifest = JSON.parse(readFileSync(path.join(dirs.output, 'naruto_sasuke-uchiha_character-journey_part-01_en.manifest.json'), 'utf8')) as { segment: Record<string, unknown> };
  for (const key of ['seriesId', 'segment', 'partNumber', 'partCount', 'arcIds', 'arcTitles', 'firstArc', 'lastArc', 'fullJourneyStopCount', 'segmentStopCount', 'segmentationVersion', 'fingerprint']) {
    assert.ok(key in partManifest.segment, `manifest.segment.${key}`);
  }
  assert.equal((manifest as { segment: unknown }).segment, null, 'single video → no segment');
  const crash = summary.failed.find((f) => f.kind === 'render');
  assert.deepEqual([crash?.renderId, crash?.anime, crash?.subject, crash?.errors], ['character-journey:naruto:jiraiya@en', 'naruto', 'jiraiya', ['simulated render crash']]);
  assert.deepEqual(summary.failed.filter((f) => f.kind !== 'render').map((f) => [f.kind, f.subject]).sort(), [['duplicate', 'char-itachi'], ['invalid', null]]);
  assert.equal(h['character-journey:naruto:jiraiya@en'].renderStatus, 'failed');
  assert.equal(h['character-journey:naruto:jiraiya@en'].lastError, 'simulated render crash');
  assert.ok(!existsSync(path.join(dirs.output, 'naruto_jiraiya_character-journey_en.mp4')), 'no partial output');
  // Rendered content can't be queued again; a variant or a human override can.
  const again = await enqueueMany(dirs, [req('itachi'), req('itachi', { variant: 'teaser', hook: 'Itachi, again?' }), req('itachi', { allowRerender: true })], { now: fixedNow });
  assert.deepEqual(again.map((x) => x.ok), [false, true, true]);
});
await test('retry: failed content goes back to the queue and renders', async () => {
  const dirs = sandbox();
  await enqueueMany(dirs, [req('itachi', { notes: 'FAIL' }), req('jiraiya', { notes: 'FAIL' })], { now: fixedNow });
  await run(dirs);
  assert.equal(listContentFiles(dirs.failed).entries.length, 2);
  const { files } = await requeueFailed(dirs, { ids: ['character-journey:naruto:itachi-uchiha@en'] }, fixedNow);
  assert.equal(files.length, 1);
  assert.equal(listContentFiles(dirs.failed).entries.length, 1, 'only the requested one');
  assert.ok(!existsSync(path.join(dirs.failed, files[0].replace('.json', '.error.json'))));
  assert.equal(loadHistory(dirs).records['character-journey:naruto:itachi-uchiha@en'].renderStatus, 'queued');
  // Fix the content (as a person would) and render only the retried file.
  const file = path.join(dirs.queue, files[0]);
  const fixed = { ...(JSON.parse(readFileSync(file, 'utf8')) as Record<string, unknown>) };
  delete fixed.notes;
  writeFileSync(file, JSON.stringify(fixed));
  const r = await run(dirs, { files });
  assert.equal(r.rendered.length, 1);
  const rec = loadHistory(dirs).records['character-journey:naruto:itachi-uchiha@en'];
  assert.equal(rec.renderStatus, 'rendered');
  assert.equal(rec.attempts, 2);
  assert.equal(rec.lastError, null);
});
await test('a crash mid-render is recovered on the next run', async () => {
  const dirs = sandbox();
  await enqueueMany(dirs, [req('itachi')], { now: fixedNow });
  // Simulate a dead process: history says "rendering", the file is still queued.
  const h = JSON.parse(readFileSync(dirs.historyFile, 'utf8')) as { records: Record<string, { renderStatus: string }> };
  h.records['character-journey:naruto:itachi-uchiha@en'].renderStatus = 'rendering';
  writeFileSync(dirs.historyFile, JSON.stringify(h));
  const r = await run(dirs);
  assert.equal(r.rendered.length, 1);
  assert.equal(loadHistory(dirs).records['character-journey:naruto:itachi-uchiha@en'].renderStatus, 'rendered');
});
await test('lock: one batch at a time, stale locks are taken over', async () => {
  const dirs = sandbox();
  const release = acquireLock(dirs.lockFile);
  assert.throws(() => acquireLock(dirs.lockFile), LockError);
  await assert.rejects(() => run(dirs), LockError);
  release();
  writeFileSync(dirs.lockFile, JSON.stringify({ pid: 2 ** 22 + 12345, startedAt: 'long ago' }));
  acquireLock(dirs.lockFile)();
  assert.ok(!existsSync(dirs.lockFile));
});

section('catalog');
let sandboxCatalog: Catalog | undefined;
await test('catalog lists only renderable content, per world, with reasons for the rest', async () => {
  const dirs = sandbox();
  const { catalog, excluded } = await buildCatalog(dirs, emptyHistory(), fixedNow());
  sandboxCatalog = catalog;
  const t = catalog.templates.characterJourney;
  assert.ok(t);
  for (const anime of ['naruto', 'onepiece', 'hunterxhunter', 'dragonball', 'blackclover']) assert.ok((t.summary[anime]?.characters ?? 0) > 0, anime);
  assert.equal(new Set(t.items.map((i) => i.id)).size, t.items.length, 'unique ids');
  const itachi = t.items.find((i) => i.id === 'character-journey:naruto:itachi-uchiha');
  assert.ok(itachi);
  assert.deepEqual(itachi.locales, ['en', 'it']);
  assert.equal(itachi.facts.places, 5);
  const x = excluded.templates.characterJourney;
  assert.ok(x && (x.byReason.no_journey_data ?? 0) > 0);
  assert.ok(x.items.every((i) => i.reason && i.subjectId));
});
await test('every catalog item resolves in every declared locale, with text the bundled fonts cover', async () => {
  const t = sandboxCatalog?.templates.characterJourney;
  assert.ok(t);
  const uncovered = new Set<string>();
  for (const item of t.items) {
    for (const locale of item.locales) {
      const data = await resolveCharacterJourney({ template: 'characterJourney', anime: item.anime, subject: item.subject, locale, ...(item.series ? { segment: item.series.segment } : {}) });
      assert.equal(data.stops.length, item.facts.animatedStops, `${item.id}: catalog stops = rendered stops`);
      assert.equal(data.durationSeconds, item.recommendedDurationSeconds, `${item.id}: catalog duration = rendered duration`);
      for (const ch of videoText(data)) if (!FONT_COVERAGE_RE.test(ch)) uncovered.add(`${ch} U+${ch.codePointAt(0)?.toString(16)} (${item.id}@${locale})`);
    }
  }
  // A character outside the @fontsource subsets would be drawn with an OS font (different on Windows/Linux).
  assert.deepEqual([...uncovered], []);
});
await test('catalog reflects history and queue (rendered / queued / published)', async () => {
  const dirs = sandbox();
  await enqueueMany(dirs, [req('itachi')], { now: fixedNow });
  await run(dirs);
  await enqueueMany(dirs, [req('itachi', { locale: 'it' }), req('jiraiya')], { now: fixedNow });
  const history = loadHistory(dirs);
  history.records['character-journey:naruto:itachi-uchiha@en'].publicationStatus = 'published';
  const { catalog } = await buildCatalog(dirs, history, fixedNow());
  const items = catalog.templates.characterJourney?.items ?? [];
  const itachi = items.find((i) => i.subject === 'itachi-uchiha');
  assert.deepEqual([itachi?.renderedLocales, itachi?.queuedLocales, itachi?.renderedBefore, itachi?.publishedBefore], [['en'], ['it'], true, true]);
  const kakashi = items.find((i) => i.subject === 'jiraiya');
  assert.deepEqual([kakashi?.renderedBefore, kakashi?.queuedLocales], [false, ['en']]);
});

section('versioned artifacts stay in sync');
await test('schemas/social-content.schema.json matches the TypeScript constants (npm run social:schema)', () => {
  const committed = JSON.parse(readFileSync(path.join(ENGINE_DIR, 'schemas', 'social-content.schema.json'), 'utf8')) as unknown;
  assert.deepEqual(committed, buildContentSchema());
});
await test('contract examples resolve against the real data (segments exist)', async () => {
  const dirs = sandbox();
  const examples = JSON.parse(readFileSync(path.join(ENGINE_DIR, 'examples', 'agent-response.json'), 'utf8')) as unknown[];
  for (const e of [...examples, JSON.parse(readFileSync(path.join(ENGINE_DIR, 'examples', 'tests', 'valid-sasuke-en.json'), 'utf8')) as unknown]) {
    const r = parseContentRequest(e);
    assert.ok(r.ok, r.ok ? '' : r.errors.join('; '));
    await planContent(dirs, r.request);
  }
});
await test('contract examples are valid requests and use only schema fields', () => {
  const schema = buildContentSchema() as { oneOf: { properties: Record<string, unknown> }[] };
  const allowed = new Set(schema.oneOf.flatMap((o) => Object.keys(o.properties)));
  const examples = JSON.parse(readFileSync(path.join(ENGINE_DIR, 'examples', 'agent-response.json'), 'utf8')) as unknown[];
  assert.ok(examples.length >= 2);
  for (const e of examples) {
    const r = parseContentRequest(e);
    assert.ok(r.ok, r.ok ? '' : r.errors.join('; '));
    for (const key of Object.keys(e as object)) assert.ok(allowed.has(key), key);
  }
});
await test('catalog/catalog.json is up to date with the data (npm run social:catalog)', async () => {
  // Status columns (rendered/queued/published) change with every queued PR and are
  // refreshed by each batch run; what must never be stale is what's PRODUCIBLE.
  const STATUS = ['renderedLocales', 'publishedLocales', 'queuedLocales', 'renderedBefore', 'publishedBefore'];
  const strip = (c: Catalog) =>
    JSON.parse(JSON.stringify(c, (key, value: unknown) => (STATUS.includes(key) || key === 'generatedAt' ? undefined : value))) as unknown;
  const dirs = pipelineDirs(ENGINE_DIR);
  const committed = JSON.parse(readFileSync(path.join(dirs.catalog, CATALOG_FILE), 'utf8')) as Catalog;
  const { catalog } = await buildCatalog(dirs, loadHistory(dirs), committed.generatedAt);
  assert.deepEqual(strip(committed), strip(catalog));
});
await test('source is versioned, runtime artifacts are ignored', () => {
  const ignored = (p: string) => {
    try {
      execFileSync('git', ['check-ignore', '-q', p], { cwd: REPO_ROOT });
      return true;
    } catch {
      return false;
    }
  };
  for (const p of ['output/x.mp4', 'output/x.manifest.json', 'output/preview/x.png', '.cache/queue.lock', 'audio/track.mp3', 'content/queue/0001-x.json.123.tmp'])
    assert.ok(ignored(`tools/social-engine/${p}`), `${p} should be ignored`);
  for (const p of ['catalog/catalog.json', 'history/history.json', 'content/queue/0001-x.json', 'content/failed/0001-x.error.json', 'schemas/social-content.schema.json', 'audio/README.md'])
    assert.ok(!ignored(`tools/social-engine/${p}`), `${p} should be versioned`);
});

for (const root of sandboxes) rmSync(root, { recursive: true, force: true });
