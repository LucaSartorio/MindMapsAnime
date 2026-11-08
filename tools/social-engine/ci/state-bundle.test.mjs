// Test di tools/social-engine/ci/state-bundle.mjs — repository git temporanei, nessuna
// credenziale reale (il "token" è una stringa fittizia; i rifiuti di GitHub sono simulati con
// hook pre-receive nel remote locale). Esegui: npm run social:state:test
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, unlinkSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  PROFILES, StateError, applyBundle, assertAllowed, classifyPushError, exportBundle, gitBlobId, persist, planCommit, verifyBundle,
} from './state-bundle.mjs';

const SCRIPT = fileURLToPath(new URL('./state-bundle.mjs', import.meta.url));
const roots = [];
after(() => { for (const r of roots) rmSync(r, { recursive: true, force: true }); });
const tmp = (p) => { const d = mkdtempSync(path.join(tmpdir(), p)); roots.push(d); return d; };

const ENV = { ...process.env, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null', GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' };
const sh = (cwd, ...args) => execFileSync('git', args, { cwd, env: ENV, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
const S = 'tools/social-engine';
const history = (records) => `${JSON.stringify({ schemaVersion: 1, records }, null, 2)}\n`;
const write = (dir, p, content) => { mkdirSync(path.dirname(path.join(dir, p)), { recursive: true }); writeFileSync(path.join(dir, p), content); };
const source = { workflow: 'test', runId: '123', runAttempt: '1' };
const TOKEN = 'ghs_FAKE_TEST_TOKEN_0123456789';
const quiet = () => {};
const noSleep = () => 0;

/** Remote "main" (bare) con le regole del Livello A + un clone di lavoro. */
function setup({ hook } = {}) {
  const base = tmp('state-');
  const seed = path.join(base, 'seed');
  mkdirSync(seed);
  sh(seed, 'init', '-q', '-b', 'main');
  write(seed, `${S}/history/history.json`, history({ a: { renderStatus: 'queued' } }));
  write(seed, `${S}/history/README.md`, '# history\n');
  write(seed, `${S}/catalog/catalog.json`, '{"v":1}\n');
  write(seed, `${S}/content/queue/0001-a.json`, '{"q":1}\n');
  write(seed, `${S}/content/rendered/.gitkeep`, '');
  write(seed, `${S}/publication/pending/r1.json`, '{"r":1}\n');
  write(seed, `${S}/publication/applied/old.json`, '{"old":true}\n');
  write(seed, `${S}/ci/commit-state.sh`, 'echo ok\n');
  write(seed, '.github/workflows/social-render.yml', 'name: x\n');
  write(seed, 'package.json', '{"name":"x"}\n');
  sh(seed, 'add', '-A');
  sh(seed, 'commit', '-q', '-m', 'seed');
  const remote = path.join(base, 'remote.git');
  sh(base, 'clone', '-q', '--bare', seed, remote);
  sh(remote, 'config', 'receive.denyNonFastForwards', 'true');
  sh(remote, 'config', 'receive.denyDeletes', 'true');
  if (hook) {
    writeFileSync(path.join(remote, 'hooks', 'pre-receive'), `#!/bin/sh\n${hook}\n`);
    chmodSync(path.join(remote, 'hooks', 'pre-receive'), 0o755);
  }
  const clone = (name) => { const d = path.join(base, name); sh(base, 'clone', '-q', remote, d); return d; };
  const remoteHead = () => sh(remote, 'rev-parse', 'refs/heads/main');
  const remoteFile = (p) => spawnSync('git', ['-C', remote, 'show', `main:${p}`], { env: ENV, encoding: 'utf8' });
  return { base, remote, clone, remoteHead, remoteFile };
}

/** Il "job di render": parte da un clone, modifica lo stato, esporta il bundle. */
function renderJob(env, mutate, profile = 'render') {
  const work = env.clone(`work-${Math.random().toString(36).slice(2)}`);
  const baseSha = sh(work, 'rev-parse', 'HEAD');
  mutate(work);
  const out = path.join(env.base, `bundle-${Math.random().toString(36).slice(2)}`);
  exportBundle({ repo: work, baseSha, profileName: profile, outDir: out, source });
  return { out, baseSha };
}
const renderOne = (w) => {
  unlinkSync(path.join(w, `${S}/content/queue/0001-a.json`));
  write(w, `${S}/content/rendered/0001-a.json`, '{"q":1,"rendered":true}\n');
  write(w, `${S}/history/history.json`, history({ a: { renderStatus: 'rendered' } }));
  write(w, `${S}/catalog/catalog.json`, '{"v":2}\n');
};
const privileged = (env) => env.clone(`priv-${Math.random().toString(36).slice(2)}`);
const doPersist = (env, bundle, profile = 'render', extra = {}) =>
  persist({ repo: privileged(env), bundleDir: bundle, profileName: profile, remote: env.remote, token: TOKEN, log: quiet, sleepMs: noSleep, ...extra });

// ─── allowlist ────────────────────────────────────────────────────────────────────────────

test('allowlist: solo i percorsi e le operazioni di stato del profilo', () => {
  const ok = [
    ['render', `${S}/history/history.json`, 'modify'],
    ['render', `${S}/content/queue/0042-x_y_z_en.json`, 'delete'],
    ['render', `${S}/content/rendered/0042-x.json`, 'add'],
    ['publication', `${S}/publication/applied/a.instagram.scheduled.0273ecb569eb.json`, 'add'],
    ['publication', `${S}/analytics/metrics.json`, 'modify'],
  ];
  for (const [p, f, op] of ok) assert.doesNotThrow(() => assertAllowed(PROFILES[p], f, op), f);
  const bad = [
    ['render', '.github/workflows/social-render.yml', 'modify'],
    ['render', 'package.json', 'modify'],
    ['render', `${S}/ci/commit-state.sh`, 'modify'],
    ['render', `${S}/pipeline/batch.ts`, 'modify'],
    ['render', `${S}/history/README.md`, 'modify'],
    ['render', `${S}/content/queue/0001-a.json`, 'add'], // la coda la scrivono solo le PR
    ['render', `${S}/publication/applied/x.json`, 'add'], // percorso dell'altro profilo
    ['publication', `${S}/publication/applied/old.json`, 'modify'], // audit trail: solo aggiunte
    ['publication', `${S}/publication/schemas/x.json`, 'modify'],
    ['render', `${S}/content/rendered/../../../package.json`, 'modify'],
    ['render', `/${S}/history/history.json`, 'modify'],
    ['render', `${S}/content/rendered/.hidden.json`, 'add'],
    ['render', `${S}/content/rendered\\x.json`, 'add'],
    ['render', `${S}/content/rendered/sub/x.json`, 'add'],
  ];
  for (const [p, f, op] of bad) assert.throws(() => assertAllowed(PROFILES[p], f, op), StateError, f);
});

// ─── scenario nominale ────────────────────────────────────────────────────────────────────

test('nominale: export → verify → plan → push fast-forward, commit con [skip ci]', () => {
  const env = setup();
  const before = env.remoteHead();
  const { out } = renderJob(env, renderOne);
  const m = verifyBundle(out, 'render');
  assert.deepEqual(m.changes.map((c) => `${c.op} ${c.path.replace(`${S}/`, '')}`), [
    'modify catalog/catalog.json', 'delete content/queue/0001-a.json', 'add content/rendered/0001-a.json', 'modify history/history.json',
  ]);
  const r = doPersist(env, out);
  assert.equal(r.result, 'pushed');
  const head = env.remoteHead();
  assert.equal(sh(env.remote, 'rev-parse', `${head}^`), before, 'un solo commit sopra main');
  const msg = sh(env.remote, 'log', '-1', '--format=%B', head);
  assert.match(msg, /\[skip social-render\] \[skip ci\]/);
  assert.equal(env.remoteFile(`${S}/content/queue/0001-a.json`).status, 128, 'il file in coda è rimosso');
  assert.match(env.remoteFile(`${S}/history/history.json`).stdout, /"rendered"/);
});

test('nessun cambiamento → noop, nessun commit', () => {
  const env = setup();
  const before = env.remoteHead();
  const { out } = renderJob(env, () => {});
  assert.equal(doPersist(env, out).result, 'noop');
  assert.equal(env.remoteHead(), before);
});

// ─── artifact manomesso ───────────────────────────────────────────────────────────────────

const tamper = (env, fn) => { const { out } = renderJob(env, renderOne); fn(out); return out; };
const editManifest = (out, fn) => { const p = path.join(out, 'manifest.json'); const m = JSON.parse(readFileSync(p, 'utf8')); fn(m); writeFileSync(p, JSON.stringify(m)); };

test('1. artifact con un file fuori allowlist → rifiutato (export e verify)', () => {
  const env = setup();
  assert.throws(() => renderJob(env, (w) => { renderOne(w); write(w, `${S}/history/README.md`, 'x\n'); }), /fuori allowlist/);
  const out = tamper(env, (o) => {
    write(o, 'files/.github/workflows/evil.yml', 'x');
    editManifest(o, (m) => m.changes.push({ path: '.github/workflows/evil.yml', op: 'add', sha256: '0'.repeat(64), size: 1 }));
  });
  assert.throws(() => verifyBundle(out, 'render'), /fuori allowlist|segmento non ammesso/);
  const out2 = tamper(env, (o) => write(o, `files/${S}/content/rendered/extra.json`, '{}'));
  assert.throws(() => verifyBundle(out2, 'render'), /non dichiarato/);
});

test('2. artifact con un symlink → rifiutato', () => {
  const env = setup();
  const out = tamper(env, (o) => {
    const f = path.join(o, 'files', S, 'content/rendered/0001-a.json');
    unlinkSync(f);
    symlinkSync('/etc/passwd', f);
  });
  assert.throws(() => verifyBundle(out, 'render'), /symlink/);
  const out2 = tamper(env, (o) => symlinkSync('/tmp', path.join(o, 'files', S, 'catalog', 'link')));
  assert.throws(() => verifyBundle(out2, 'render'), /symlink/);
});

test('path traversal, chiavi extra, sha256 e profilo errati → rifiutati', () => {
  const env = setup();
  assert.throws(() => verifyBundle(tamper(env, (o) => editManifest(o, (m) => { m.changes[0].path = `${S}/catalog/../../../package.json`; })), 'render'), StateError);
  assert.throws(() => verifyBundle(tamper(env, (o) => editManifest(o, (m) => { m.extra = 1; })), 'render'), /chiavi/);
  assert.throws(() => verifyBundle(tamper(env, (o) => writeFileSync(path.join(o, 'files', S, 'catalog/catalog.json'), '{"v":3}\n')), 'render'), /sha256|dimensione/);
  assert.throws(() => verifyBundle(tamper(env, () => {}), 'publication'), /profilo/);
  assert.throws(() => verifyBundle(tamper(env, (o) => write(o, 'run.sh', 'x')), 'render'), /radice/);
});

test('13. file di stato con dati non validi → rifiutato', () => {
  const env = setup();
  assert.throws(() => renderJob(env, (w) => { renderOne(w); write(w, `${S}/history/history.json`, '{"records":[]}'); }), /history\.json non valido/);
  const out = tamper(env, (o) => {
    const bad = Buffer.from('{not json');
    writeFileSync(path.join(o, 'files', S, 'catalog/catalog.json'), bad);
    editManifest(o, (m) => { const c = m.changes.find((x) => x.path.endsWith('catalog.json')); c.size = bad.length; c.sha256 = execFileSync('sha256sum', [path.join(o, 'files', S, 'catalog/catalog.json')], { encoding: 'utf8' }).split(' ')[0]; });
  });
  assert.throws(() => verifyBundle(out, 'render'), /JSON non valido/);
});

test('manifest incoerente con la base ("add" di un file esistente) → rifiutato dal plan', () => {
  const env = setup();
  const { out } = renderJob(env, renderOne);
  editManifest(out, (m) => { const c = m.changes.find((x) => x.path.endsWith('history.json')); c.op = 'add'; });
  const repo = privileged(env);
  assert.throws(() => planCommit({ repo, bundleDir: out, profileName: 'render', head: sh(repo, 'rev-parse', 'HEAD') }), /incoerente/);
});

// ─── credenziali e push ───────────────────────────────────────────────────────────────────

test('3. push non autorizzato (403 / ruleset) → errore esplicito, nessun retry', () => {
  for (const [hook, re] of [
    ['echo "remote: Permission to x denied to bot. 403" >&2; exit 1', /non autorizzato/],
    ['echo "remote: error: GH013: Repository rule violations found for refs/heads/main." >&2; exit 1', /regola del repository/],
  ]) {
    const env = setup({ hook });
    const { out } = renderJob(env, renderOne);
    const before = env.remoteHead();
    let attempts = 0;
    assert.throws(() => doPersist(env, out, 'render', { log: (l) => { if (/tentativo/.test(l)) attempts++; } }), re);
    assert.equal(attempts, 0);
    assert.equal(env.remoteHead(), before);
  }
});

test('4. token assente → nessun push e nessun fallback', () => {
  const env = setup();
  const { out } = renderJob(env, renderOne);
  const before = env.remoteHead();
  for (const token of [undefined, '', 'x']) assert.throws(() => doPersist(env, out, 'render', { token }), /token della GitHub App assente/);
  assert.equal(env.remoteHead(), before);
  // la CLI legge il token SOLO da STATE_BOT_TOKEN
  const repo = privileged(env);
  const r = spawnSync(process.execPath, [SCRIPT, 'push', '--repo', repo, '--bundle', out, '--profile', 'render', '--remote', env.remote], { env: { ...ENV, STATE_BOT_TOKEN: '', GITHUB_TOKEN: 'ghs_should_not_be_used' }, encoding: 'utf8' });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /token della GitHub App assente/);
  assert.equal(env.remoteHead(), before);
});

test('5. token scaduto (Authentication failed) → errore esplicito', () => {
  const env = setup({ hook: 'echo "remote: Invalid username or token. Password authentication is not supported." >&2; echo "fatal: Authentication failed" >&2; exit 1' });
  const { out } = renderJob(env, renderOne);
  assert.throws(() => doPersist(env, out), /non autorizzato/);
});

test('classificazione dei rifiuti di git push', () => {
  assert.equal(classifyPushError(' ! [rejected]        abc -> main (fetch first)'), 'retry');
  assert.equal(classifyPushError(' ! [rejected] x -> main (non-fast-forward)'), 'retry');
  assert.equal(classifyPushError('remote: error: GH013: Repository rule violations found'), 'rule');
  assert.equal(classifyPushError('remote: Permission to o/r.git denied to x.\nfatal: unable to access: The requested URL returned error: 403'), 'auth');
  assert.equal(classifyPushError("remote: error: cannot lock ref 'refs/heads/main': is at abc but expected def"), 'retry');
  assert.equal(classifyPushError(' ! [remote rejected] main -> main (incorrect old value provided)'), 'retry');
  assert.equal(classifyPushError('fatal: unable to access: Could not resolve host'), 'other');
});

test('il token non compare nei parametri né nei log', () => {
  const env = setup();
  const { out } = renderJob(env, renderOne);
  const repo = privileged(env);
  const r = spawnSync(process.execPath, [SCRIPT, 'push', '--repo', repo, '--bundle', out, '--profile', 'render', '--remote', env.remote, '--branch', 'main'], { env: { ...ENV, STATE_BOT_TOKEN: TOKEN, GITHUB_ACTIONS: '' }, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /result=pushed/);
  const b64 = Buffer.from(`x-access-token:${TOKEN}`).toString('base64');
  for (const s of [r.stdout, r.stderr, readFileSync(path.join(repo, '.git', 'config'), 'utf8')]) {
    assert.ok(!s.includes(TOKEN) && !s.includes(b64), 'token trapelato');
  }
});

test('push sul branch sbagliato o remote con credenziali → rifiutato', () => {
  const env = setup();
  const { out } = renderJob(env, renderOne);
  assert.throws(() => doPersist(env, out, 'render', { branch: 'gh-pages' }), /branch non ammesso/);
  assert.throws(() => doPersist(env, out, 'render', { remote: `https://x-access-token:${TOKEN}@github.com/o/r.git` }), /credenziali/);
});

// ─── concorrenza ──────────────────────────────────────────────────────────────────────────

test('6. main avanza durante la preparazione: percorsi diversi → applicato sopra il nuovo main', () => {
  const env = setup();
  const { out } = renderJob(env, renderOne);
  const other = env.clone('other');
  write(other, `${S}/content/queue/0002-b.json`, '{"q":2}\n'); // nuova PR di coda mergiata nel frattempo
  sh(other, 'add', '-A'); sh(other, 'commit', '-q', '-m', 'queue b'); sh(other, 'push', '-q', 'origin', 'main');
  const mid = env.remoteHead();
  assert.equal(doPersist(env, out).result, 'pushed');
  assert.equal(sh(env.remote, 'rev-parse', 'main^'), mid);
  assert.equal(env.remoteFile(`${S}/content/queue/0002-b.json`).status, 0, 'la nuova coda resta');
});

test('6b. main avanza toccando lo stesso file → conflict, main invariato', () => {
  const env = setup();
  const { out } = renderJob(env, renderOne);
  const other = env.clone('other');
  write(other, `${S}/history/history.json`, history({ a: { renderStatus: 'queued', platforms: ['x'] } }));
  sh(other, 'add', '-A'); sh(other, 'commit', '-q', '-m', 'publication state'); sh(other, 'push', '-q', 'origin', 'main');
  const mid = env.remoteHead();
  const r = doPersist(env, out);
  assert.equal(r.result, 'conflict');
  assert.ok(r.conflicts.some((p) => p.endsWith('history.json')));
  assert.equal(env.remoteHead(), mid, 'nessuna sovrascrittura di history.json');
});

test('7/8. due persistenze contemporanee: push rifiutato (non-fast-forward) → nuovo plan → entrambe applicate', () => {
  const env = setup();
  const a = renderJob(env, renderOne);
  const b = renderJob(env, (w) => { unlinkSync(path.join(w, `${S}/publication/pending/r1.json`)); write(w, `${S}/publication/applied/r1.json`, '{"r":1}\n'); }, 'publication');
  // A prepara il commit (plan) ma B spinge prima: il push di A viene rifiutato e A rifà fetch + plan.
  const repoA = privileged(env);
  let pushedB = false;
  const logs = [];
  const r = persist({
    repo: repoA, bundleDir: a.out, profileName: 'render', remote: env.remote, token: TOKEN, sleepMs: noSleep,
    log: (l) => logs.push(l),
    attempts: 4,
  });
  assert.equal(r.result, 'pushed');
  if (!pushedB) { assert.equal(doPersist(env, b.out, 'publication').result, 'pushed'); pushedB = true; }
  assert.equal(env.remoteFile(`${S}/publication/applied/r1.json`).status, 0);
  assert.match(env.remoteFile(`${S}/history/history.json`).stdout, /"rendered"/);
  // rifiuto reale: un remote che rifiuta il primo push come non-fast-forward
  const env2 = setup({ hook: 'if [ ! -f "$GIT_DIR/once" ]; then touch "$GIT_DIR/once"; echo " ! [rejected] main -> main (fetch first)" >&2; echo "error: Updates were rejected because the remote contains work that you do not have locally." >&2; exit 1; fi' });
  const c = renderJob(env2, renderOne);
  const seen = [];
  assert.equal(doPersist(env2, c.out, 'render', { log: (l) => seen.push(l) }).result, 'pushed');
  assert.ok(seen.some((l) => /tentativo 1\/4/.test(l)), 'un retry dopo il rifiuto');
});

test('push sempre rifiutato come non-fast-forward → errore dopo 4 tentativi, main invariato', () => {
  const env = setup({ hook: 'echo " ! [rejected] main -> main (non-fast-forward)" >&2; exit 1' });
  const { out } = renderJob(env, renderOne);
  const before = env.remoteHead();
  assert.throws(() => doPersist(env, out), /4 tentativi esauriti/);
  assert.equal(env.remoteHead(), before);
});

// ─── idempotenza ──────────────────────────────────────────────────────────────────────────

test('9. receipt già applicata (stesso bundle due volte) → noop', () => {
  const env = setup();
  const { out } = renderJob(env, (w) => {
    unlinkSync(path.join(w, `${S}/publication/pending/r1.json`));
    write(w, `${S}/publication/applied/r1.json`, '{"r":1}\n');
    write(w, `${S}/history/history.json`, history({ a: { renderStatus: 'queued', platforms: ['instagram'] } }));
  }, 'publication');
  assert.equal(doPersist(env, out, 'publication').result, 'pushed');
  const head = env.remoteHead();
  assert.equal(doPersist(env, out, 'publication').result, 'noop');
  assert.equal(env.remoteHead(), head);
});

test('9b. receipt applicata con contenuto diverso → conflict (l\'audit trail non viene riscritto)', () => {
  const env = setup();
  const make = (body) => renderJob(env, (w) => { unlinkSync(path.join(w, `${S}/publication/pending/r1.json`)); write(w, `${S}/publication/applied/r1.json`, body); }, 'publication').out;
  const first = make('{"r":1}\n');
  const second = make('{"r":1,"tampered":true}\n');
  assert.equal(doPersist(env, first, 'publication').result, 'pushed');
  assert.equal(doPersist(env, second, 'publication').result, 'conflict');
});

test('10. contenuto già renderizzato (re-run dello stesso bundle) → noop, nessun duplicato', () => {
  const env = setup();
  const { out } = renderJob(env, renderOne);
  assert.equal(doPersist(env, out).result, 'pushed');
  const head = env.remoteHead();
  assert.equal(doPersist(env, out).result, 'noop');
  assert.equal(env.remoteHead(), head);
});

// ─── checkout del job privilegiato ────────────────────────────────────────────────────────

test('12. modifiche non autorizzate nel checkout privilegiato → ignorate (commit solo dai blob del bundle)', () => {
  const env = setup();
  const { out } = renderJob(env, renderOne);
  const repo = privileged(env);
  write(repo, '.github/workflows/social-render.yml', 'name: evil\n');
  write(repo, 'package.json', '{"scripts":{"postinstall":"evil"}}\n');
  write(repo, `${S}/catalog/catalog.json`, '{"v":"dirty"}\n');
  const r = persist({ repo, bundleDir: out, profileName: 'render', remote: env.remote, token: TOKEN, log: quiet, sleepMs: noSleep });
  assert.equal(r.result, 'pushed');
  const changed = sh(env.remote, 'diff', '--name-only', 'main^', 'main').split('\n');
  assert.ok(changed.every((f) => f.startsWith(`${S}/`) && !f.includes('/ci/')), changed.join(','));
  assert.equal(env.remoteFile('.github/workflows/social-render.yml').stdout, 'name: x\n');
  assert.equal(env.remoteFile(`${S}/catalog/catalog.json`).stdout, '{"v":2}\n');
});

test('il plan rifiuta un percorso che su main è diventato symlink', () => {
  const env = setup();
  const { out } = renderJob(env, renderOne);
  const other = env.clone('other');
  rmSync(path.join(other, `${S}/catalog/catalog.json`));
  symlinkSync('../../../package.json', path.join(other, `${S}/catalog/catalog.json`));
  sh(other, 'add', '-A'); sh(other, 'commit', '-q', '-m', 'symlink'); sh(other, 'push', '-q', 'origin', 'main');
  assert.throws(() => doPersist(env, out), /modalità 120000/);
});

// ─── recupero dopo un fallimento ──────────────────────────────────────────────────────────

test('14. job fallito dopo l\'artifact: il bundle si riapplica (idempotente) e apply ricostruisce lo stato', () => {
  const env = setup();
  const { out, baseSha } = renderJob(env, renderOne);
  // il job privilegiato non è mai partito: il recupero ripete apply su un checkout pulito della base
  const repo = env.clone('recover');
  sh(repo, 'checkout', '-q', '--detach', baseSha);
  applyBundle({ repo, bundleDir: out, profileName: 'render' });
  assert.ok(!existsSync(path.join(repo, `${S}/content/queue/0001-a.json`)));
  assert.equal(readFileSync(path.join(repo, `${S}/catalog/catalog.json`), 'utf8'), '{"v":2}\n');
  assert.equal(doPersist(env, out).result, 'pushed');
  assert.equal(doPersist(env, out).result, 'noop');
});

test('gitBlobId coincide con git hash-object', () => {
  const d = tmp('blob-');
  writeFileSync(path.join(d, 'f'), '{"a":1}\n');
  assert.equal(gitBlobId(Buffer.from('{"a":1}\n')), execFileSync('git', ['hash-object', '--no-filters', path.join(d, 'f')], { encoding: 'utf8' }).trim());
});

test('7b. due processi di persistenza in parallelo su file diversi → entrambi su main, nessun aggiornamento perso', async () => {
  const env = setup();
  const a = renderJob(env, renderOne);
  const b = renderJob(env, (w) => { unlinkSync(path.join(w, `${S}/publication/pending/r1.json`)); write(w, `${S}/publication/applied/r1.json`, '{"r":1}\n'); }, 'publication');
  const { spawn } = await import('node:child_process');
  const run = (bundle, profile) => new Promise((resolve) => {
    const p = spawn(process.execPath, [SCRIPT, 'push', '--repo', privileged(env), '--bundle', bundle, '--profile', profile, '--remote', env.remote], { env: { ...ENV, STATE_BOT_TOKEN: TOKEN } });
    let out = '';
    p.stdout.on('data', (d) => { out += d; });
    p.stderr.on('data', (d) => { out += d; });
    p.on('close', (code) => resolve({ code, out }));
  });
  const [ra, rb] = await Promise.all([run(a.out, 'render'), run(b.out, 'publication')]);
  assert.equal(ra.code, 0, ra.out);
  assert.equal(rb.code, 0, rb.out);
  assert.match(ra.out, /result=pushed/);
  assert.match(rb.out, /result=pushed/);
  assert.match(env.remoteFile(`${S}/history/history.json`).stdout, /"rendered"/);
  assert.equal(env.remoteFile(`${S}/publication/applied/r1.json`).status, 0);
  assert.equal(env.remoteFile(`${S}/content/rendered/0001-a.json`).status, 0);
});
