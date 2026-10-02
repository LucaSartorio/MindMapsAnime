/**
 * Publication-state tests. Everything that writes runs in a temporary sandbox
 * root (same layout as tools/social-engine/) with a fixture history — the real
 * history.json is only ever READ (and checked to be byte-identical afterwards).
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { buildCatalog } from '../pipeline/catalog';
import { pipelineDirs, type PipelineDirs } from '../pipeline/dirs';
import {
  derivePublicationStatus,
  emptyHistory,
  ensureRecord,
  loadHistory,
  normalizeHistory,
  saveHistory,
  transition,
  type History,
  type HistoryRecord,
  type RenderArtifact,
} from '../pipeline/history';
import { mergeHistories } from '../pipeline/historyMerge';
import { parseContentId, parseRenderId } from '../pipeline/ids';
import {
  applyPendingReceipts,
  isIsoTimestamp,
  parseReceipt,
  parseStrictJson,
  planReceipts,
  receiptIdOf,
  type PublicationReceipt,
} from '../pipeline/publication';
import { buildReceiptSchema } from '../pipeline/publicationSchema';
import { RECEIPT_SCHEMA_FILE } from '../pipeline/schemaFiles';
import { ENGINE_DIR, REPO_ROOT } from '../render/paths';
import { section, test } from './harness';

const GOKU1 = 'character-journey:dragonball:goku:part-01@en';
const GOKU2 = 'character-journey:dragonball:goku:part-02@en';
const ITACHI = 'character-journey:naruto:itachi-uchiha@en';
const NOW = '2026-10-02T12:30:00.000Z';
const ARTIFACT: RenderArtifact = {
  name: 'animapverse-social-render-1-1', runId: '1', runAttempt: '1', runUrl: 'https://github.com/o/r/actions/runs/1',
  video: 'videos/x.mp4', manifest: 'manifests/x.manifest.json', sha256: null, expiresAt: '2026-11-01T00:00:00Z',
};

const sandboxes: string[] = [];
function sandbox(records: Record<string, Partial<HistoryRecord>> = { [GOKU1]: {}, [GOKU2]: {} }): PipelineDirs {
  const root = mkdtempSync(path.join(tmpdir(), 'social-publication-'));
  sandboxes.push(root);
  const dirs = pipelineDirs(root);
  const history = emptyHistory();
  for (const [renderId, patch] of Object.entries(records)) addRecord(history, renderId, patch);
  saveHistory(dirs, history);
  mkdirSync(dirs.publicationPending, { recursive: true });
  return dirs;
}

function addRecord(history: History, renderId: string, patch: Partial<HistoryRecord> = {}): HistoryRecord {
  const { contentId, locale, variant } = parseRenderId(renderId);
  const { anime, subject, segment } = parseContentId(contentId);
  const r = ensureRecord(history, { renderId, contentId, template: 'characterJourney', anime, subject, locale, variant, segment, segmentFingerprint: null }, '2026-10-02T10:00:00.000Z', 'x.json');
  transition(r, 'rendering', '2026-10-02T10:01:00.000Z');
  transition(r, 'rendered', '2026-10-02T10:02:00.000Z', { renderedAt: '2026-10-02T10:02:00.000Z', artifact: ARTIFACT });
  Object.assign(r, patch);
  return r;
}

type Raw = Record<string, unknown>;
const scheduled = (over: Raw = {}): Raw => ({
  receiptVersion: 1, renderId: GOKU1, platform: 'instagram', provider: 'metricool', status: 'scheduled',
  recordedAt: '2026-10-02T12:00:00Z', scheduledFor: '2026-10-05T10:00:00+02:00',
  providerPostId: '1001', providerPostUuid: 'uuid-aaa', plannerUrl: 'https://app.metricool.com/planner?post=1001', ...over,
});
const published = (over: Raw = {}): Raw => ({
  receiptVersion: 1, renderId: GOKU1, platform: 'instagram', provider: 'metricool', status: 'published',
  recordedAt: '2026-10-05T08:05:00Z', publishedAt: '2026-10-05T10:00:12+02:00', providerPostUuid: 'uuid-aaa',
  publicUrl: 'https://www.instagram.com/reel/ABC123/', ...over,
});
const failed = (over: Raw = {}): Raw => ({
  receiptVersion: 1, renderId: GOKU1, platform: 'instagram', provider: 'metricool', status: 'failed',
  recordedAt: '2026-10-05T08:10:00Z', providerPostUuid: 'uuid-aaa', error: 'Instagram rejected the media (aspect ratio)', ...over,
});

let fileCounter = 0;
function put(dirs: PipelineDirs, receipt: Raw | string, name = `r-${String(++fileCounter).padStart(4, '0')}.json`): string {
  writeFileSync(path.join(dirs.publicationPending, name), typeof receipt === 'string' ? receipt : JSON.stringify(receipt, null, 2));
  return name;
}
const apply = (dirs: PipelineDirs) => applyPendingReceipts({ dirs, now: () => NOW });
const record = (dirs: PipelineDirs, renderId = GOKU1) => loadHistory(dirs).records[renderId];
const platform = (dirs: PipelineDirs, p: string, renderId = GOKU1) => record(dirs, renderId).platforms.find((x) => x.platform === p);
const historyText = (dirs: PipelineDirs) => readFileSync(dirs.historyFile, 'utf8');
const ls = (dir: string) => (existsSync(dir) ? readdirSync(dir).sort() : []);
const parsedReceipt = (raw: Raw): PublicationReceipt => {
  const p = parseReceipt(raw);
  assert.ok(p.ok, JSON.stringify(p));
  return p.receipt;
};

section('publication receipts: contract');
await test('scheduled / published / failed receipts parse; status-specific fields are enforced', () => {
  for (const raw of [scheduled(), published(), failed()]) assert.ok(parseReceipt(raw).ok);
  const cases: [Raw, RegExp][] = [
    [scheduled({ scheduledFor: undefined }), /scheduledFor: required/],
    [scheduled({ publicUrl: 'https://www.instagram.com/reel/x/' }), /publicUrl: not allowed when status is "scheduled"/],
    [scheduled({ error: 'x' }), /error: not allowed/],
    [published({ publishedAt: undefined }), /publishedAt: required/],
    [failed({ error: undefined }), /error: required/],
    [failed({ publishedAt: '2026-10-05T10:00:00Z' }), /publishedAt: not allowed/],
    [scheduled({ receiptVersion: 2 }), /receiptVersion: must be 1/],
    [scheduled({ token: 'secret' }), /token: unknown field/],
    [scheduled({ status: 'publishing' }), /status: must be one of/],
    [scheduled({ platform: 'facebook' }), /platform: must be one of instagram, tiktok, youtube/],
    [scheduled({ provider: 'buffer' }), /provider: must be one of metricool/],
    [scheduled({ recordedAt: undefined }), /recordedAt: required/],
    [scheduled({ providerPostId: null }), /providerPostId: must match/],
    [published({ publicUrl: null }), /publicUrl: must be an https URL/],
  ];
  for (const [raw, pattern] of cases) {
    const p = parseReceipt(raw);
    assert.ok(!p.ok, `accepted ${JSON.stringify(raw)}`);
    assert.match(p.errors.join('\n'), pattern);
  }
  assert.ok(!parseReceipt([scheduled()]).ok);
  assert.ok(!parseReceipt('x').ok);
});
await test('timestamps: full ISO 8601 with seconds and offset, real calendar dates; the original offset is kept', () => {
  for (const ok of ['2026-10-05T10:00:00+02:00', '2026-10-05T08:00:00Z', '2026-10-05T08:00:00.123Z', '2028-02-29T00:00:00-05:00']) assert.ok(isIsoTimestamp(ok), ok);
  for (const bad of ['2026-10-05', '2026-10-05T10:00+02:00', '2026-10-05T10:00:00', '2026-02-30T10:00:00Z', '2026-10-05T24:00:00Z', '2026-13-01T00:00:00Z', '2026-10-05 10:00:00Z', '2026-10-05T10:00:00+15:00', 'tomorrow']) {
    assert.ok(!isIsoTimestamp(bad), bad);
  }
  assert.equal(parsedReceipt(scheduled()).scheduledFor, '2026-10-05T10:00:00+02:00');
});
await test('URLs: https only, no credentials, no whitespace; ids are opaque tokens, never paths', () => {
  for (const url of ['http://app.metricool.com/x', 'javascript:alert(1)', 'https://user:pw@app.metricool.com/', 'file:///etc/passwd', 'https://exa mple.com', 'https://localhost/x', `https://a.com/${'x'.repeat(2100)}`]) {
    assert.ok(!parseReceipt(scheduled({ plannerUrl: url })).ok, url);
  }
  for (const id of ['../../etc/passwd', 'a/b', 'a b', '', '-x', 'x'.repeat(200)]) assert.ok(!parseReceipt(scheduled({ providerPostId: id })).ok, id);
  for (const rid of ['../history/history.json', 'character-journey:dragonball:goku@fr', 'Character-Journey:a:b@en', 'character-journey:a@en']) {
    assert.ok(!parseReceipt(scheduled({ renderId: rid })).ok, rid);
  }
});
await test('strict JSON: duplicate keys are rejected (JSON.parse would silently keep the last one)', () => {
  assert.throws(() => parseStrictJson('{"status":"scheduled","status":"published"}'), /duplicate key "status"/);
  assert.throws(() => parseStrictJson('{"a":{"b":1,"b":2}}'), /duplicate key "b"/);
  assert.deepEqual(parseStrictJson('{"a":{"b":1},"b":{"a":"\\"b\\""},"c":[{"a":1},{"a":2}]}'), { a: { b: 1 }, b: { a: '"b"' }, c: [{ a: 1 }, { a: 2 }] });
});
await test('receiptId: deterministic, filesystem-safe, tied to the event (not to notes / file name)', () => {
  const r = parsedReceipt(scheduled());
  const id = receiptIdOf(r);
  assert.match(id, /^dragonball_goku_character-journey_part-01_en\.instagram\.scheduled\.[0-9a-f]{12}$/);
  assert.equal(receiptIdOf(parsedReceipt(scheduled({ notes: 'hello', recordedBy: 'chatgpt-work' }))), id);
  assert.notEqual(receiptIdOf(parsedReceipt(scheduled({ recordedAt: '2026-10-02T12:00:01Z' }))), id);
  assert.notEqual(receiptIdOf(parsedReceipt(scheduled({ providerPostId: '1002' }))), id);
});
await test('files: unsafe names, symlinks, oversize and invalid JSON are rejected unread', () => {
  const dirs = sandbox();
  writeFileSync(path.join(dirs.publicationPending, 'bad name.json'), JSON.stringify(scheduled()));
  symlinkSync(dirs.historyFile, path.join(dirs.publicationPending, 'link.json'));
  put(dirs, JSON.stringify({ ...scheduled(), notes: 'x'.repeat(400), pad: 'y'.repeat(17000) }), 'big.json');
  put(dirs, '{"receiptVersion":1,', 'broken.json');
  put(dirs, '{"status":"scheduled","status":"published"}', 'dup.json');
  const plan = planReceipts(dirs, loadHistory(dirs), NOW);
  const kinds = Object.fromEntries(plan.items.map((i) => [i.name, i.ok ? 'ok' : `${i.kind}: ${i.errors.join(' ')}`]));
  assert.match(kinds['bad name.json'], /^unsafe_file/);
  assert.match(kinds['link.json'], /^unsafe_file/);
  assert.match(kinds['big.json'], /too large/);
  assert.match(kinds['broken.json'], /invalid JSON/);
  assert.match(kinds['dup.json'], /duplicate key/);
  assert.equal(plan.valid, false);
});
await test('publication/schemas/publication-receipt.schema.json matches the TypeScript constants (npm run social:schema)', () => {
  const committed = JSON.parse(readFileSync(RECEIPT_SCHEMA_FILE, 'utf8')) as unknown;
  assert.deepEqual(committed, buildReceiptSchema(), 'stale schema: run `npm run social:schema`');
  const variants = (buildReceiptSchema().oneOf as { title: string; additionalProperties: boolean; required: string[]; properties: Record<string, unknown> }[]);
  assert.deepEqual(variants.map((v) => v.title), ['scheduled', 'published', 'failed']);
  for (const v of variants) assert.equal(v.additionalProperties, false);
  assert.ok(variants[0].required.includes('scheduledFor') && !('publicUrl' in variants[0].properties));
  assert.ok(variants[1].required.includes('publishedAt') && 'publicUrl' in variants[1].properties);
  assert.ok(variants[2].required.includes('error'));
});

section('publication state machine');
await test('rendered + notScheduled → scheduled (history, aggregate, audit trail, pending emptied)', () => {
  const dirs = sandbox();
  const name = put(dirs, scheduled({ recordedBy: 'chatgpt-work-publishing-agent' }));
  const result = apply(dirs);
  assert.ok(result.applied);
  const ig = platform(dirs, 'instagram')!;
  assert.deepEqual(
    [ig.status, ig.provider, ig.scheduledFor, ig.scheduledAt, ig.providerPostId, ig.providerPostUuid, ig.plannerUrl, ig.publicUrl, ig.attempts, ig.updatedAt],
    ['scheduled', 'metricool', '2026-10-05T10:00:00+02:00', '2026-10-02T12:00:00Z', '1001', 'uuid-aaa', 'https://app.metricool.com/planner?post=1001', null, 1, NOW],
  );
  assert.equal(record(dirs).publicationStatus, 'scheduled');
  assert.equal(record(dirs).publishedAt, null, 'scheduled is NOT published');
  assert.equal(record(dirs).renderStatus, 'rendered');
  assert.deepEqual(ls(dirs.publicationPending), []);
  const [audit] = ls(dirs.publicationApplied);
  assert.equal(audit, `${ig.receipts[0]}.json`);
  const trail = JSON.parse(readFileSync(path.join(dirs.publicationApplied, audit), 'utf8')) as Raw;
  assert.deepEqual([trail.outcome, trail.transition, trail.sourceFile, (trail.receipt as Raw).recordedBy], ['applied', { from: 'notScheduled', to: 'scheduled' }, name, 'chatgpt-work-publishing-agent']);
});
await test('scheduled → published (publishedAt + publicUrl; plannerUrl stays apart from publicUrl)', () => {
  const dirs = sandbox();
  put(dirs, scheduled());
  apply(dirs);
  put(dirs, published());
  assert.ok(apply(dirs).applied);
  const ig = platform(dirs, 'instagram')!;
  assert.deepEqual([ig.status, ig.publishedAt, ig.publicUrl, ig.plannerUrl, ig.providerPostId, ig.scheduledFor, ig.receipts.length], [
    'published', '2026-10-05T10:00:12+02:00', 'https://www.instagram.com/reel/ABC123/', 'https://app.metricool.com/planner?post=1001', '1001', '2026-10-05T10:00:00+02:00', 2,
  ]);
  assert.deepEqual([record(dirs).publicationStatus, record(dirs).publishedAt], ['published', '2026-10-05T10:00:12+02:00']);
});
await test('scheduled → failed, then failed → scheduled is a retry (new post, attempts 2)', () => {
  const dirs = sandbox();
  put(dirs, scheduled());
  apply(dirs);
  put(dirs, failed());
  assert.ok(apply(dirs).applied);
  let ig = platform(dirs, 'instagram')!;
  assert.deepEqual([ig.status, ig.lastError, ig.failedAt, ig.providerPostUuid, record(dirs).publicationStatus], ['failed', 'Instagram rejected the media (aspect ratio)', '2026-10-05T08:10:00Z', 'uuid-aaa', 'failed']);
  put(dirs, scheduled({ recordedAt: '2026-10-05T09:00:00Z', scheduledFor: '2026-10-06T18:00:00+02:00', providerPostId: '2002', providerPostUuid: 'uuid-bbb', plannerUrl: undefined }));
  const result = apply(dirs);
  assert.ok(result.applied);
  assert.match(String(result.plan.items[0].ok && result.plan.items[0].note), /retry #2/);
  ig = platform(dirs, 'instagram')!;
  assert.deepEqual([ig.status, ig.attempts, ig.providerPostUuid, ig.providerPostId, ig.plannerUrl, ig.scheduledFor], ['scheduled', 2, 'uuid-bbb', '2002', null, '2026-10-06T18:00:00+02:00']);
  assert.equal(record(dirs).publicationStatus, 'scheduled');
});
await test('the same scheduled receipt twice is idempotent (history byte-identical, no duplicate entry)', () => {
  const dirs = sandbox();
  put(dirs, scheduled());
  apply(dirs);
  const before = historyText(dirs);
  put(dirs, scheduled(), 'again.json');
  const result = apply(dirs);
  assert.ok(result.applied);
  assert.deepEqual(result.plan.items.map((i) => i.ok && [i.outcome, i.from, i.to]), [['unchanged', 'scheduled', 'scheduled']]);
  assert.equal(historyText(dirs), before, 'history must not change (no timestamp bump, no duplicate)');
  assert.equal(record(dirs).platforms.length, 1);
  assert.equal(ls(dirs.publicationApplied).length, 2, 'two audit files (the second marked unchanged)');
  // Same post re-sent later (new recordedAt, same values) is also a no-op.
  put(dirs, scheduled({ recordedAt: '2026-10-02T13:00:00Z' }));
  assert.ok(apply(dirs).applied);
  assert.equal(historyText(dirs), before);
});
await test('same renderId + platform scheduled with a DIFFERENT Metricool post → rejected (would publish twice)', () => {
  const dirs = sandbox();
  put(dirs, scheduled());
  apply(dirs);
  const before = historyText(dirs);
  for (const other of [scheduled({ providerPostId: '9999', providerPostUuid: 'uuid-zzz', recordedAt: '2026-10-02T14:00:00Z' }), scheduled({ providerPostId: undefined, providerPostUuid: undefined, plannerUrl: undefined, recordedAt: '2026-10-02T14:00:00Z' })]) {
    const name = put(dirs, other);
    const result = apply(dirs);
    assert.ok(!result.applied);
    assert.equal(historyText(dirs), before, 'history untouched');
    assert.deepEqual(result.quarantined, [name]);
    const err = JSON.parse(readFileSync(path.join(dirs.publicationFailed, name.replace(/\.json$/, '.error.json')), 'utf8')) as Raw;
    assert.deepEqual([err.kind, err.renderId, err.platform, err.currentState, err.requestedState], ['transition', GOKU1, 'instagram', 'scheduled', 'scheduled']);
    assert.match(String(err.errors), /already scheduled/);
  }
});
await test('scheduled → scheduled with the same post UUID = reschedule (id may change, uuid is stable)', () => {
  const dirs = sandbox();
  put(dirs, scheduled());
  apply(dirs);
  put(dirs, scheduled({ recordedAt: '2026-10-03T09:00:00Z', scheduledFor: '2026-10-07T21:00:00+02:00', providerPostId: '1003' }));
  const result = apply(dirs);
  assert.ok(result.applied);
  const ig = platform(dirs, 'instagram')!;
  assert.deepEqual([ig.status, ig.scheduledFor, ig.providerPostId, ig.providerPostUuid, ig.attempts], ['scheduled', '2026-10-07T21:00:00+02:00', '1003', 'uuid-aaa', 1]);
  assert.match(String(result.plan.items[0].ok && result.plan.items[0].note), /rescheduled/);
});
await test('published → scheduled and published → failed are rejected; a contradicting published receipt too', () => {
  const dirs = sandbox();
  put(dirs, scheduled());
  put(dirs, published());
  apply(dirs);
  const before = historyText(dirs);
  const attempts: [Raw, RegExp][] = [
    [scheduled({ recordedAt: '2026-10-06T00:00:00Z' }), /published → scheduled refused/],
    [failed({ recordedAt: '2026-10-06T00:00:00Z' }), /published → failed refused/],
    [published({ recordedAt: '2026-10-06T00:00:00Z', publicUrl: 'https://www.instagram.com/reel/OTHER/' }), /already has publicUrl/],
    [published({ recordedAt: '2026-10-06T00:00:00Z', providerPostUuid: 'uuid-zzz' }), /another post/],
  ];
  for (const [raw, pattern] of attempts) {
    put(dirs, raw);
    const result = apply(dirs);
    assert.ok(!result.applied);
    assert.match(result.plan.items.map((i) => (i.ok ? '' : i.errors.join(' '))).join(' '), pattern);
    assert.equal(historyText(dirs), before);
  }
});
await test('unknown renderId and non-rendered videos (queued / rendering / failed) are rejected', () => {
  const dirs = sandbox({ [GOKU1]: { renderStatus: 'queued', renderedAt: null }, [GOKU2]: { renderStatus: 'failed' }, [ITACHI]: { renderStatus: 'rendering' } });
  const before = historyText(dirs);
  put(dirs, scheduled({ renderId: 'character-journey:dragonball:vegeta@en' }));
  put(dirs, scheduled());
  put(dirs, scheduled({ renderId: GOKU2 }));
  put(dirs, scheduled({ renderId: ITACHI }));
  const result = apply(dirs);
  assert.ok(!result.applied);
  assert.deepEqual(result.plan.items.map((i) => !i.ok && i.kind), ['unknown_render', 'not_rendered', 'not_rendered', 'not_rendered']);
  assert.match(result.plan.items.map((i) => (i.ok ? '' : i.errors[0])).join('\n'), /is queued[\s\S]*is failed[\s\S]*is rendering/);
  assert.equal(historyText(dirs), before);
  assert.equal(ls(dirs.publicationFailed).filter((f) => f.endsWith('.error.json')).length, 4);
});
await test('platforms are independent: Instagram + TikTok scheduled = two entries; YouTube stays notScheduled', () => {
  const dirs = sandbox();
  put(dirs, scheduled());
  put(dirs, scheduled({ platform: 'tiktok', providerPostId: '7001', providerPostUuid: 'uuid-tt' }));
  apply(dirs);
  const r = record(dirs);
  assert.deepEqual(r.platforms.map((p) => [p.platform, p.status, p.providerPostUuid]), [['instagram', 'scheduled', 'uuid-aaa'], ['tiktok', 'scheduled', 'uuid-tt']]);
  assert.equal(r.publicationStatus, 'scheduled');
  assert.equal(r.platforms.find((p) => p.platform === 'youtube'), undefined);
});
await test('aggregate: IG published + TikTok scheduled → partiallyPublished; only IG published → published; only failed → failed', () => {
  const dirs = sandbox();
  put(dirs, published());
  apply(dirs);
  assert.equal(record(dirs).publicationStatus, 'published', 'platforms never touched do not count');
  put(dirs, scheduled({ platform: 'tiktok', providerPostUuid: 'uuid-tt', recordedAt: '2026-10-06T00:00:00Z' }));
  apply(dirs);
  assert.equal(record(dirs).publicationStatus, 'partiallyPublished');
  const f = sandbox();
  put(f, failed());
  apply(f);
  assert.equal(record(f).publicationStatus, 'failed');
  const s = (...st: ('scheduled' | 'published' | 'failed')[]) => derivePublicationStatus(st.map((status) => ({ status })));
  assert.deepEqual([s(), s('scheduled'), s('published'), s('published', 'scheduled'), s('published', 'failed'), s('scheduled', 'failed'), s('failed'), s('published', 'published')], [
    'notPublished', 'scheduled', 'published', 'partiallyPublished', 'partiallyPublished', 'scheduled', 'failed', 'published',
  ]);
});
await test('notScheduled → published directly (immediate publish / import) is supported and flagged', () => {
  const dirs = sandbox();
  put(dirs, published({ providerPostUuid: undefined }));
  const result = apply(dirs);
  assert.ok(result.applied);
  assert.match(String(result.plan.items[0].ok && result.plan.items[0].note), /without a scheduled receipt/);
  assert.deepEqual([platform(dirs, 'instagram')?.status, platform(dirs, 'instagram')?.attempts], ['published', 1]);
});
await test('batch is ALL OR NOTHING: one invalid receipt → none applied; valid ones stay pending', () => {
  const dirs = sandbox();
  const before = historyText(dirs);
  const good = put(dirs, scheduled());
  const bad = put(dirs, scheduled({ renderId: GOKU2, platform: 'myspace' }));
  const result = apply(dirs);
  assert.ok(!result.applied);
  assert.equal(historyText(dirs), before);
  assert.deepEqual(ls(dirs.publicationPending), [good]);
  assert.deepEqual(ls(dirs.publicationFailed), [bad, bad.replace(/\.json$/, '.error.json')].sort());
  assert.deepEqual(ls(dirs.publicationApplied), []);
  // Next run: only the valid one is left → applied.
  assert.ok(apply(dirs).applied);
  assert.equal(platform(dirs, 'instagram')?.status, 'scheduled');
});
await test('receipts of one batch are applied in event order (scheduled then published, whatever the file names)', () => {
  const dirs = sandbox();
  put(dirs, published(), 'a-published.json');
  put(dirs, scheduled(), 'z-scheduled.json');
  const result = apply(dirs);
  assert.ok(result.applied);
  assert.equal(platform(dirs, 'instagram')?.status, 'published');
  assert.equal(platform(dirs, 'instagram')?.receipts.length, 2);
});
await test('dry run / validate writes nothing', () => {
  const dirs = sandbox();
  put(dirs, scheduled());
  put(dirs, scheduled({ renderId: 'character-journey:dragonball:vegeta@en' }));
  const snapshot = () => JSON.stringify([historyText(dirs), ls(dirs.publicationPending), ls(dirs.publicationApplied), ls(dirs.publicationFailed)]);
  const before = snapshot();
  const result = applyPendingReceipts({ dirs, dryRun: true, now: () => NOW });
  assert.deepEqual([result.applied, result.plan.valid, result.plan.items.length], [false, false, 2]);
  assert.equal(snapshot(), before);
});

section('publication: series, catalog, migration');
await test('series: Goku Part 1 and Part 2 have independent publication states', () => {
  const dirs = sandbox();
  put(dirs, scheduled());
  apply(dirs);
  assert.equal(record(dirs, GOKU1).publicationStatus, 'scheduled');
  assert.deepEqual([record(dirs, GOKU2).publicationStatus, record(dirs, GOKU2).platforms], ['notPublished', []]);
  put(dirs, scheduled({ renderId: GOKU2, providerPostId: '3003', providerPostUuid: 'uuid-p2', recordedAt: '2026-10-02T15:00:00Z' }));
  put(dirs, published());
  apply(dirs);
  assert.deepEqual([record(dirs, GOKU1).publicationStatus, record(dirs, GOKU2).publicationStatus], ['published', 'scheduled']);
  assert.equal(platform(dirs, 'instagram', GOKU2)?.providerPostUuid, 'uuid-p2');
});
await test('catalog: rendered / scheduled / published are distinct per locale and platform; ready list = priority 1', async () => {
  const GOKU3 = 'character-journey:dragonball:goku:part-03@en';
  const LOCAL = 'character-journey:dragonball:goku:part-04@en';
  const OLD = 'character-journey:dragonball:goku:part-05@en';
  const dirs = sandbox({
    [GOKU1]: { renderedAt: '2026-10-02T10:02:00.000Z' },
    [GOKU2]: { renderedAt: '2026-10-02T10:03:00.000Z' },
    [GOKU3]: { renderedAt: '2026-10-02T10:04:00.000Z' },
    [LOCAL]: { artifact: null },
    [OLD]: { artifact: { ...ARTIFACT, expiresAt: '2026-09-01T00:00:00Z' } },
  });
  put(dirs, scheduled({ renderId: GOKU2 }));
  put(dirs, published({ renderId: GOKU3 }));
  apply(dirs);
  const { catalog } = await buildCatalog(dirs, loadHistory(dirs), NOW);
  const items = catalog.templates.characterJourney!.items;
  const item = (n: number) => items.find((i) => i.id === `character-journey:dragonball:goku:part-0${n}`)!;
  const view = (n: number) => [item(n).renderedLocales, item(n).scheduledLocales, item(n).publishedLocales, item(n).renderedBefore, item(n).publishedBefore];
  assert.deepEqual(view(1), [['en'], [], [], true, false], 'rendered ≠ published');
  assert.deepEqual(view(2), [['en'], ['en'], [], true, false]);
  assert.deepEqual(view(3), [['en'], [], ['en'], true, true]);
  assert.deepEqual(item(2).publication, [{ renderId: GOKU2, locale: 'en', variant: null, status: 'scheduled', platforms: { instagram: 'scheduled', tiktok: 'notScheduled', youtube: 'notScheduled' } }]);
  const pub = catalog.publishing;
  assert.equal(pub.contract, 'docs/SOCIAL_PUBLISHING_CONTRACT.md');
  // Priority 1 for Instagram = ready entries where instagram is notScheduled/failed.
  const igTodo = pub.ready.filter((e) => ['notScheduled', 'failed'].includes(e.platforms.instagram)).map((e) => e.renderId);
  assert.deepEqual(igTodo, [GOKU1]);
  // Parts 2/3 are still listed (TikTok/YouTube to do) but never for Instagram.
  assert.deepEqual(pub.ready.map((e) => e.renderId), [GOKU1, GOKU2, GOKU3]);
  const g1 = pub.ready[0];
  assert.deepEqual([g1.subjectName, g1.segment, g1.partNumber, g1.partCount, g1.artifact?.name, g1.publicationStatus], ['Goku', 'part-01', 1, 5, ARTIFACT.name, 'notPublished']);
  assert.deepEqual(pub.unavailable.map((u) => [u.renderId, u.reason]), [[LOCAL, 'no_artifact'], [OLD, 'artifact_expired']]);
  assert.deepEqual([pub.summary.rendered, pub.summary.notPublished, pub.summary.scheduled, pub.summary.published, pub.summary.unavailable], [5, 3, 1, 1, 2]);
});
await test('migration: an old history record with platforms [{platform, publishedAt, url}] loads as published', () => {
  const legacy = {
    schemaVersion: 1,
    records: {
      [ITACHI]: {
        renderId: ITACHI, contentId: 'character-journey:naruto:itachi-uchiha', template: 'characterJourney', anime: 'naruto', subject: 'itachi-uchiha', locale: 'en', variant: null,
        createdAt: 'x', updatedAt: 'x', renderStatus: 'rendered', renderedAt: 'x', outputFile: null, manifestFile: null, sourceFile: null, durationSeconds: 22, attempts: 1, lastError: null,
        publicationStatus: 'partiallyPublished', publishedAt: null,
        platforms: [{ platform: 'instagram', publishedAt: '2026-09-01T10:00:00Z', url: 'https://www.instagram.com/reel/OLD/' }],
      },
    },
  };
  const r = normalizeHistory(legacy).records[ITACHI];
  assert.deepEqual([r.segment, r.segmentFingerprint, r.artifact, r.publicationStatus, r.publishedAt], [null, null, null, 'published', '2026-09-01T10:00:00Z']);
  const [ig] = r.platforms;
  assert.deepEqual([ig.platform, ig.status, ig.provider, ig.publishedAt, ig.publicUrl, ig.plannerUrl, ig.receipts], ['instagram', 'published', null, '2026-09-01T10:00:00Z', 'https://www.instagram.com/reel/OLD/', null, []]);
  // The migrated entry obeys the state machine: never scheduled again.
  const dirs = sandbox({});
  writeFileSync(dirs.historyFile, JSON.stringify(legacy));
  put(dirs, scheduled({ renderId: ITACHI }));
  assert.ok(!apply(dirs).applied);
  assert.throws(() => normalizeHistory({ schemaVersion: 1, records: { [ITACHI]: { ...legacy.records[ITACHI], platforms: [{ platform: 'myspace' }] } } }), /unknown platform/);
});
await test('the REAL history is only read: a receipt for Goku Part 1 EN is planned on a copy, never written', () => {
  // Must hold whatever its real state is (notScheduled today; scheduled/published after the first real test).
  const real = pipelineDirs();
  const before = readFileSync(real.historyFile, 'utf8');
  const history = loadHistory(real);
  const r = history.records[GOKU1];
  assert.ok(r, 'Goku Part 1 EN must exist in the real history');
  assert.equal(r.renderStatus, 'rendered');
  assert.equal(r.artifact?.name, 'animapverse-social-render-36996948068-1');
  for (const rec of Object.values(history.records)) assert.equal(rec.publicationStatus, derivePublicationStatus(rec.platforms), `${rec.renderId}: aggregate is derived`);
  const dirs = sandbox({});
  put(dirs, scheduled({ providerPostUuid: 'fixture-never-real', providerPostId: 'fixture-never-real' }));
  const plan = planReceipts(dirs, history, NOW);
  const state = r.platforms.find((p) => p.platform === 'instagram')?.status ?? 'notScheduled';
  if (state === 'notScheduled' || state === 'failed') {
    assert.deepEqual(plan.items.map((i) => i.ok && [i.receipt.renderId, i.from, i.to]), [[GOKU1, state, 'scheduled']]);
    assert.equal(plan.history.records[GOKU1].publicationStatus, 'scheduled', 'simulated copy');
  } else {
    assert.ok(!plan.valid, `a second scheduling of a ${state} video must be refused`);
  }
  assert.equal(readFileSync(real.historyFile, 'utf8'), before, 'real history untouched');
  assert.deepEqual(loadHistory(real).records[GOKU1].platforms, r.platforms);
});

section('concurrent state commits (history merge driver)');
const baseHistory = () => {
  const h = emptyHistory();
  addRecord(h, GOKU1);
  addRecord(h, GOKU2);
  return JSON.parse(JSON.stringify(h)) as History;
};
await test('render fields on one side + publication fields on the other merge field by field', () => {
  const base = baseHistory();
  const render = JSON.parse(JSON.stringify(base)) as History;
  addRecord(render, ITACHI);
  render.records[GOKU2].attempts = 2;
  const dirs = sandbox({});
  saveHistory(dirs, base);
  put(dirs, scheduled());
  const pub = planReceipts(dirs, loadHistory(dirs), NOW).history;
  const merged = mergeHistories(base, render, pub);
  assert.ok(merged.ok, JSON.stringify(merged));
  const m = merged.history.records;
  assert.deepEqual([Object.keys(m).sort(), m[GOKU1].publicationStatus, m[GOKU1].platforms[0].status, m[GOKU2].attempts], [[GOKU1, GOKU2, ITACHI].sort(), 'scheduled', 'scheduled', 2]);
  assert.deepEqual(mergeHistories(base, pub, render), merged, 'symmetric');
});
await test('the same field changed differently on both sides is a conflict (never guessed)', () => {
  const base = baseHistory();
  const a = JSON.parse(JSON.stringify(base)) as History;
  const b = JSON.parse(JSON.stringify(base)) as History;
  a.records[GOKU1].lastError = 'a';
  b.records[GOKU1].lastError = 'b';
  const merged = mergeHistories(base, a, b);
  assert.ok(!merged.ok);
  assert.deepEqual(merged.conflicts, [`${GOKU1}.lastError`]);
});
await test('git rebase with the merge driver (as the workflows run it) merges concurrent state commits', () => {
  const repo = mkdtempSync(path.join(tmpdir(), 'social-merge-'));
  sandboxes.push(repo);
  const git = (...args: string[]) => execFileSync('git', args, { cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const file = path.join(repo, 'tools/social-engine/history/history.json');
  mkdirSync(path.dirname(file), { recursive: true });
  const write = (h: History) => writeFileSync(file, `${JSON.stringify(h, null, 2)}\n`);
  git('init', '-q', '-b', 'main');
  git('config', 'user.email', 't@t');
  git('config', 'user.name', 't');
  writeFileSync(path.join(repo, '.gitattributes'), readFileSync(path.join(REPO_ROOT, '.gitattributes')));
  const driver = `"${path.join(REPO_ROOT, 'node_modules/.bin/tsx')}" --tsconfig "${path.join(ENGINE_DIR, 'tsconfig.json')}" "${path.join(ENGINE_DIR, 'cli/merge-history.ts')}" %O %A %B`;
  git('config', 'merge.social-history.driver', driver);
  const base = baseHistory();
  write(base);
  git('add', '-A');
  git('commit', '-qm', 'base');
  git('checkout', '-qb', 'publication');
  const pub = JSON.parse(JSON.stringify(base)) as History;
  const dirs = sandbox({});
  saveHistory(dirs, base);
  put(dirs, scheduled());
  write(planReceipts(dirs, loadHistory(dirs), NOW).history);
  git('commit', '-qam', 'publication state');
  git('checkout', '-q', 'main');
  const render = JSON.parse(JSON.stringify(pub)) as History;
  addRecord(render, ITACHI);
  write(render);
  git('commit', '-qam', 'render state');
  git('checkout', '-q', 'publication');
  git('rebase', '-q', 'main');
  const result = normalizeHistory(JSON.parse(readFileSync(file, 'utf8')));
  assert.deepEqual([Object.keys(result.records).length, result.records[GOKU1].publicationStatus, result.records[ITACHI].renderStatus], [3, 'scheduled', 'rendered']);
});

section('publication workflows');
const workflow = (name: string) => readFileSync(path.join(REPO_ROOT, '.github', 'workflows', name), 'utf8');
await test('social-publication-validate.yml: PRs only, read-only, no secrets, validation + scope + tests', () => {
  const y = workflow('social-publication-validate.yml');
  assert.match(y, /pull_request:\s*\n\s*paths:\s*\n\s*- 'tools\/social-engine\/publication\/pending\/\*\*'/);
  assert.doesNotMatch(y, /^\s*pull_request_target:|\$\{\{\s*secrets\.|contents: write/m);
  assert.match(y, /permissions:\s*\n\s*contents: read/);
  for (const step of ['social:publication:check-scope', 'social:publication:validate', 'social:publication:test']) assert.ok(y.includes(`npm run ${step}`), step);
});
await test('social-publication-state.yml: main only, own concurrency group, write only on the job, three loop guards', () => {
  const y = workflow('social-publication-state.yml');
  assert.match(y, /push:\s*\n\s*branches: \[main\]\s*\n\s*paths:\s*\n\s*- 'tools\/social-engine\/publication\/pending\/\*\*'/);
  assert.match(y, /group: animapverse-social-publication-state\s*\n\s*cancel-in-progress: false/);
  assert.match(y, /^permissions:\s*\n\s*contents: read/m);
  assert.equal(y.match(/contents: write/g)?.length, 1);
  assert.match(y, /github\.actor != 'github-actions\[bot\]'/);
  assert.match(y, /\[skip social-publication\]/);
  assert.match(y, /\[skip ci\]/);
  assert.doesNotMatch(y, /^\s*pull_request_target:|metricool\.com\/api|secrets\.(?!GITHUB_TOKEN)/im);
  // Only state paths are committed, through the shared script (also used by Social render).
  assert.match(y, /ci\/commit-state\.sh\s*\n\s*"chore\(social\): record publication state \[skip social-publication\] \[skip ci\]"\s*\n\s*tools\/social-engine\/history tools\/social-engine\/publication tools\/social-engine\/catalog\n/);
  assert.match(readFileSync(path.join(ENGINE_DIR, 'ci', 'commit-state.sh'), 'utf8'), /git add -A -- "\$@"/);
  for (const step of ['social:publication:validate', 'social:publication:apply']) assert.ok(y.includes(`npm run ${step}`), step);
});
await test('no provider API, token or SDK anywhere in the engine (the repo never publishes)', () => {
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, name.name);
      if (name.isDirectory()) {
        if (!['node_modules', 'output', '.cache', 'tests', 'catalog', 'publication', 'history', 'content'].includes(name.name)) walk(full);
      } else if (/\.(ts|tsx|json|ya?ml)$/.test(name.name)) {
        const text = readFileSync(full, 'utf8');
        if (/api\.metricool|graph\.facebook|graph\.instagram|open\.tiktokapis|googleapis\.com\/upload|METRICOOL_|userToken|access_token/i.test(text)) offenders.push(full);
      }
    }
  };
  walk(ENGINE_DIR);
  walk(path.join(REPO_ROOT, '.github', 'workflows'));
  assert.deepEqual(offenders, []);
});

for (const dir of sandboxes) rmSync(dir, { recursive: true, force: true });
