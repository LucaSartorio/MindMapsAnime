#!/usr/bin/env node
/**
 * Social state bundle — persistenza dello stato del social engine su `main` con
 * separazione dei privilegi (SEC-01, docs/SECURITY_SEC-01.md · docs/SOCIAL_STATE_BOT.md).
 *
 * ZERO dipendenze: solo `node:` e la CLI `git`. Il job privilegiato (quello che riceve il
 * token della GitHub App "AniMapVerse State Bot") esegue SOLO questo file, dal checkout
 * pulito di `main`: niente `npm ci`, niente npm scripts, niente merge driver, niente hook.
 *
 *   export   (job NON privilegiato) differenze dei percorsi di stato tra <base> e il working
 *            tree → bundle: manifest.json + files/<path> (contenuto completo, sha256)
 *   verify   valida un bundle (dato NON fidato): schema, allowlist esatta per profilo,
 *            operazioni consentite, niente symlink / traversal / file extra, sha256, JSON
 *   apply    (job NON privilegiato) scrive un bundle verificato nel working tree
 *   plan     (job privilegiato, SENZA token) calcola il commit su `main`: confronto per
 *            percorso tra base, HEAD di main e contenuto nuovo (mai merge testuali)
 *   push     (job privilegiato, CON token) ripete verify + plan sul main più recente e spinge
 *            il commit senza force; su non-fast-forward rifà fetch e plan (max 4 tentativi)
 *
 * Esito di plan/push (stdout `result=…`, e in Actions anche $GITHUB_OUTPUT):
 *   pushed · noop (niente da scrivere o già applicato) · conflict (un percorso è cambiato su
 *   main dopo la base: va ripreparato dal job non privilegiato, che usa il merge driver) ·
 *   commit (solo plan: c'è un commit da spingere). Ogni altro problema = exit 1.
 *
 * Il token arriva SOLO dalla variabile d'ambiente STATE_BOT_TOKEN, passa a git come header
 * HTTP via GIT_CONFIG_* (mai nell'URL, nei parametri o nei log) e non viene mai scritto.
 */
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import {
  appendFileSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, unlinkSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const FORMAT = 'animapverse-social-state';
export const VERSION = 1;
const ROOT = 'tools/social-engine';
/** Nome di un file di stato: niente separatori, niente punto iniziale, solo .json. */
const NAME = '[A-Za-z0-9][A-Za-z0-9._@+-]{0,200}\\.json';
const MAX_CHANGES = 2000;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_MANIFEST_BYTES = 2 * 1024 * 1024;

/**
 * Allowlist ESATTA per profilo: percorso → operazioni ammesse rispetto alla base
 * (add = nuovo file, modify = file esistente cambiato, delete = file rimosso).
 * Tutto il resto (workflow, script, package.json, codice, README, schemi…) è rifiutato.
 */
const rule = (re, ops) => ({ re: new RegExp(`^${ROOT}/${re}$`), ops });
export const PROFILES = {
  render: {
    scopes: [`${ROOT}/history`, `${ROOT}/content`, `${ROOT}/catalog`],
    subject: 'chore(social): record rendered content [skip social-render] [skip ci]',
    rules: [
      rule('history/history\\.json', ['add', 'modify']),
      rule(`catalog/${NAME}`, ['add', 'modify']),
      rule(`content/queue/${NAME}`, ['delete']),
      rule(`content/rendered/${NAME}`, ['add', 'modify']),
      rule(`content/failed/${NAME}`, ['add', 'modify', 'delete']),
    ],
  },
  publication: {
    scopes: [`${ROOT}/history`, `${ROOT}/publication`, `${ROOT}/analytics`, `${ROOT}/catalog`],
    subject: 'chore(social): record publication state [skip social-publication] [skip ci]',
    rules: [
      rule('history/history\\.json', ['add', 'modify']),
      rule(`catalog/${NAME}`, ['add', 'modify']),
      rule(`publication/pending/${NAME}`, ['delete']),
      // publication/applied/ è un audit trail versionato: solo aggiunte, mai modifiche.
      rule(`publication/applied/${NAME}`, ['add']),
      rule(`publication/failed/${NAME}`, ['add', 'modify']),
      rule(`analytics/pending/${NAME}`, ['delete']),
      rule(`analytics/applied/${NAME}`, ['add']),
      rule(`analytics/failed/${NAME}`, ['add', 'modify']),
      rule('analytics/metrics\\.json', ['add', 'modify']),
    ],
  },
};

export class StateError extends Error {}
const fail = (msg) => { throw new StateError(msg); };

// ─── git (configurazione isolata: niente config globale/di sistema, niente hook) ──────────

/** Ambiente di git: ignora configurazioni globali e di sistema, mai prompt di credenziali. */
function gitEnv(extra = {}) {
  const env = { ...process.env, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null', GIT_TERMINAL_PROMPT: '0', ...extra };
  delete env.STATE_BOT_TOKEN; // git non lo riceve mai come variabile: solo come header (vedi push)
  return env;
}
const SAFE = ['-c', 'core.hooksPath=/dev/null', '-c', 'core.fsmonitor=false'];

export function git(repo, args, { input, env, allowFail = false } = {}) {
  const r = spawnSync('git', [...SAFE, '-C', repo, ...args], { input, env: gitEnv(env), maxBuffer: 256 * 1024 * 1024 });
  if (r.status !== 0 && !allowFail) {
    fail(`git ${args[0]} non riuscito (exit ${r.status}): ${r.stderr.toString().trim().split('\n').slice(-3).join(' | ')}`);
  }
  return { code: r.status, stdout: r.stdout, stderr: r.stderr.toString() };
}
const gitText = (repo, args, opts) => git(repo, args, opts).stdout.toString().trim();

/** Blob di <rev>:<path>, o null se il percorso non esiste in quella revisione. */
function blobAt(repo, rev, file) {
  const r = git(repo, ['rev-parse', '--verify', '--quiet', `${rev}:${file}`], { allowFail: true });
  return r.code === 0 ? r.stdout.toString().trim() : null;
}
/** Modalità del percorso nella revisione (100644, 100755, 120000 = symlink, 160000 = submodule). */
function modeAt(repo, rev, file) {
  const out = gitText(repo, ['ls-tree', rev, '--', file]);
  return out ? out.split(/\s/)[0] : null;
}

/** Id git di un blob calcolato in memoria (stesso algoritmo di `git hash-object`). */
export const gitBlobId = (buf) => createHash('sha1').update(`blob ${buf.length}\0`).update(buf).digest('hex');
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');

// ─── percorsi e regole ─────────────────────────────────────────────────────────────────────

/** Percorso relativo sicuro: niente assoluti, `..`, `\`, segmenti vuoti o nascosti, controlli. */
export function assertSafePath(p) {
  if (typeof p !== 'string' || p.length === 0 || p.length > 400) fail(`percorso non valido: ${JSON.stringify(p)}`);
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x1f\x7f\\]/.test(p)) fail(`percorso con caratteri non ammessi: ${JSON.stringify(p)}`);
  if (p.startsWith('/') || p !== path.posix.normalize(p)) fail(`percorso non normalizzato o assoluto: ${p}`);
  for (const seg of p.split('/')) if (!seg || seg === '.' || seg === '..' || seg.startsWith('.')) fail(`segmento non ammesso in ${p}`);
}

export function profileOf(name) {
  const profile = PROFILES[name];
  if (!profile) fail(`profilo sconosciuto: ${JSON.stringify(name)} (ammessi: ${Object.keys(PROFILES).join(', ')})`);
  return profile;
}

/** L'operazione `op` su `p` è ammessa dal profilo? */
export function assertAllowed(profile, p, op) {
  assertSafePath(p);
  const r = profile.rules.find((x) => x.re.test(p));
  if (!r) fail(`percorso fuori allowlist: ${p}`);
  if (!r.ops.includes(op)) fail(`operazione "${op}" non ammessa su ${p} (ammesse: ${r.ops.join(', ')})`);
}

// ─── manifest e bundle ─────────────────────────────────────────────────────────────────────

const HEX40 = /^[0-9a-f]{40}$/;
const HEX64 = /^[0-9a-f]{64}$/;
const SOURCE_VALUE = /^[A-Za-z0-9 ._/:@+-]{0,200}$/;

function readJsonFile(file, maxBytes) {
  const st = lstatSync(file, { throwIfNoEntry: false });
  if (!st) fail(`file mancante: ${file}`);
  if (!st.isFile()) fail(`non è un file regolare: ${file}`);
  if (st.size > maxBytes) fail(`file troppo grande: ${file}`);
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    return fail(`JSON non valido in ${file}: ${e.message}`);
  }
}

function assertExactKeys(obj, keys, where) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) fail(`${where}: oggetto atteso`);
  const extra = Object.keys(obj).filter((k) => !keys.includes(k));
  const missing = keys.filter((k) => !(k in obj));
  if (extra.length || missing.length) fail(`${where}: chiavi non ammesse [${extra}] / mancanti [${missing}]`);
}

/** Controlli di contenuto dei file di stato (dato non fidato). */
function assertStateContent(p, buf) {
  let data;
  try {
    data = JSON.parse(buf.toString('utf8'));
  } catch (e) {
    fail(`JSON non valido nel file di stato ${p}: ${e.message}`);
  }
  if (p.endsWith('/history/history.json')) {
    if (!data || typeof data !== 'object' || data.schemaVersion !== 1 || !data.records || typeof data.records !== 'object' || Array.isArray(data.records)) {
      fail(`history.json non valido: atteso { schemaVersion: 1, records: {…} }`);
    }
  } else if (data === null || typeof data !== 'object') {
    fail(`file di stato non valido (atteso oggetto o array JSON): ${p}`);
  }
}

/** Elenco ricorsivo dei file di una cartella SENZA seguire i symlink; rifiuta tutto ciò che non è file/dir. */
function walkFiles(dir, rel = '') {
  const out = [];
  for (const name of readdirSync(path.join(dir, rel)).sort()) {
    const r = rel ? `${rel}/${name}` : name;
    const st = lstatSync(path.join(dir, r));
    if (st.isSymbolicLink()) fail(`symlink non ammesso nel bundle: ${r}`);
    if (st.isDirectory()) out.push(...walkFiles(dir, r));
    else if (st.isFile()) out.push({ rel: r, size: st.size });
    else fail(`voce non ammessa nel bundle (né file né cartella): ${r}`);
  }
  return out;
}

/**
 * Valida un bundle (dato NON fidato) per il profilo atteso. Ritorna il manifest validato.
 * Non legge mai fuori da <bundleDir> e non segue symlink.
 */
export function verifyBundle(bundleDir, profileName) {
  const profile = profileOf(profileName);
  const rootSt = lstatSync(bundleDir, { throwIfNoEntry: false });
  if (!rootSt || !rootSt.isDirectory() || rootSt.isSymbolicLink()) fail(`bundle non trovato o non è una cartella: ${bundleDir}`);
  const top = readdirSync(bundleDir).sort();
  const extraTop = top.filter((n) => n !== 'manifest.json' && n !== 'files');
  if (extraTop.length) fail(`voci non ammesse nella radice del bundle: ${extraTop.join(', ')}`);
  const m = readJsonFile(path.join(bundleDir, 'manifest.json'), MAX_MANIFEST_BYTES);
  assertExactKeys(m, ['format', 'version', 'profile', 'baseSha', 'source', 'changes'], 'manifest');
  if (m.format !== FORMAT || m.version !== VERSION) fail(`manifest: formato/versione non supportati (${m.format} v${m.version})`);
  if (m.profile !== profileName) fail(`manifest: profilo "${m.profile}" diverso da quello atteso "${profileName}"`);
  if (typeof m.baseSha !== 'string' || !HEX40.test(m.baseSha)) fail('manifest: baseSha non valido');
  assertExactKeys(m.source, ['workflow', 'runId', 'runAttempt'], 'manifest.source');
  for (const [k, v] of Object.entries(m.source)) if (typeof v !== 'string' || !SOURCE_VALUE.test(v)) fail(`manifest.source.${k} non valido`);
  if (!Array.isArray(m.changes) || m.changes.length > MAX_CHANGES) fail('manifest: changes deve essere un array (max 2000)');
  const seen = new Set();
  const expectedFiles = new Map();
  for (const [i, c] of m.changes.entries()) {
    assertExactKeys(c, ['path', 'op', 'sha256', 'size'], `changes[${i}]`);
    if (!['add', 'modify', 'delete'].includes(c.op)) fail(`changes[${i}]: op non valida`);
    assertAllowed(profile, c.path, c.op);
    if (seen.has(c.path)) fail(`percorso duplicato nel manifest: ${c.path}`);
    seen.add(c.path);
    if (c.op === 'delete') {
      if (c.sha256 !== null || c.size !== null) fail(`changes[${i}]: delete non deve avere sha256/size`);
    } else {
      if (typeof c.sha256 !== 'string' || !HEX64.test(c.sha256)) fail(`changes[${i}]: sha256 non valido`);
      if (!Number.isInteger(c.size) || c.size < 0 || c.size > MAX_FILE_BYTES) fail(`changes[${i}]: size non valida`);
      expectedFiles.set(c.path, c);
    }
  }
  const filesDir = path.join(bundleDir, 'files');
  const fst = lstatSync(filesDir, { throwIfNoEntry: false });
  const present = fst ? (fst.isDirectory() && !fst.isSymbolicLink() ? walkFiles(filesDir) : fail('files/ non è una cartella')) : [];
  const presentSet = new Set(present.map((f) => f.rel));
  for (const f of present) if (!expectedFiles.has(f.rel)) fail(`file non dichiarato nel manifest: files/${f.rel}`);
  for (const [p, c] of expectedFiles) {
    if (!presentSet.has(p)) fail(`file dichiarato ma assente: files/${p}`);
    const buf = readFileSync(path.join(filesDir, p));
    if (buf.length !== c.size) fail(`dimensione diversa dal manifest: ${p}`);
    if (sha256(buf) !== c.sha256) fail(`sha256 diverso dal manifest: ${p}`);
    assertStateContent(p, buf);
  }
  return m;
}

const fileBuf = (bundleDir, p) => readFileSync(path.join(bundleDir, 'files', p));

// ─── export (job non privilegiato) ────────────────────────────────────────────────────────

/**
 * Differenze tra <baseSha> e il working tree nei percorsi del profilo → bundle in <outDir>.
 * Usa un indice temporaneo: l'indice del repository non viene toccato.
 */
export function exportBundle({ repo, baseSha, profileName, outDir, source }) {
  const profile = profileOf(profileName);
  if (!HEX40.test(baseSha)) fail('baseSha non valido');
  if (existsSync(outDir) && readdirSync(outDir).length) fail(`la cartella di output non è vuota: ${outDir}`);
  const tmp = mkdtempSync(path.join(tmpdir(), 'state-index-'));
  const index = path.join(tmp, 'index');
  try {
    const env = { GIT_INDEX_FILE: index };
    git(repo, ['read-tree', baseSha], { env });
    // solo le cartelle che esistono nella base o nel working tree (git add fallisce sulle altre)
    const scopes = profile.scopes.filter((s) => existsSync(path.join(repo, s)) || gitText(repo, ['ls-tree', '--name-only', baseSha, '--', s]) !== '');
    if (scopes.length) git(repo, ['add', '-A', '--', ...scopes], { env });
    const raw = scopes.length
      ? git(repo, ['diff', '--cached', '--name-status', '-z', '--no-renames', baseSha, '--', ...scopes], { env }).stdout.toString()
      : '';
    const parts = raw.split('\0').filter(Boolean);
    const changes = [];
    for (let i = 0; i < parts.length; i += 2) {
      const status = parts[i];
      const p = parts[i + 1];
      const op = { A: 'add', M: 'modify', D: 'delete' }[status];
      if (!op) fail(`cambiamento non supportato (${status}) su ${p}: solo aggiunte, modifiche e cancellazioni di file`);
      assertAllowed(profile, p, op);
      if (op === 'delete') {
        changes.push({ path: p, op, sha256: null, size: null });
        continue;
      }
      const st = lstatSync(path.join(repo, p));
      if (!st.isFile() || st.isSymbolicLink()) fail(`non è un file regolare: ${p}`);
      const buf = readFileSync(path.join(repo, p));
      if (buf.length > MAX_FILE_BYTES) fail(`file troppo grande: ${p}`);
      assertStateContent(p, buf);
      const dest = path.join(outDir, 'files', p);
      mkdirSync(path.dirname(dest), { recursive: true });
      writeFileSync(dest, buf);
      changes.push({ path: p, op, sha256: sha256(buf), size: buf.length });
    }
    changes.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
    const manifest = { format: FORMAT, version: VERSION, profile: profileName, baseSha, source, changes };
    mkdirSync(outDir, { recursive: true });
    writeFileSync(path.join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
    return manifest;
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

// ─── apply (job non privilegiato: ricostruisce lo stato grezzo prima del rebase) ──────────

export function applyBundle({ repo, bundleDir, profileName }) {
  const m = verifyBundle(bundleDir, profileName);
  for (const c of m.changes) {
    const dest = path.join(repo, c.path);
    if (c.op === 'delete') {
      if (existsSync(dest)) unlinkSync(dest);
      continue;
    }
    mkdirSync(path.dirname(dest), { recursive: true });
    const st = lstatSync(dest, { throwIfNoEntry: false });
    if (st && (st.isSymbolicLink() || !st.isFile())) fail(`destinazione non regolare: ${c.path}`);
    writeFileSync(dest, fileBuf(bundleDir, c.path));
  }
  return m;
}

// ─── plan (job privilegiato, senza token) ─────────────────────────────────────────────────

/**
 * Confronto PER PERCORSO, mai merge di contenuto:
 *   HEAD == base → si applica; HEAD == nuovo (o già cancellato) → già applicato; altrimenti conflitto.
 * Lavora solo sugli oggetti git (indice temporaneo): il working tree del checkout è ignorato.
 */
export function planCommit({ repo, bundleDir, profileName, head, author }) {
  const m = verifyBundle(bundleDir, profileName);
  if (!HEX40.test(head)) fail('HEAD non valido');
  if (git(repo, ['cat-file', '-e', `${m.baseSha}^{commit}`], { allowFail: true }).code !== 0) {
    fail(`la base ${m.baseSha.slice(0, 12)} non è nel clone: aumentare fetch-depth`);
  }
  if (git(repo, ['merge-base', '--is-ancestor', m.baseSha, head], { allowFail: true }).code !== 0) {
    fail(`la base ${m.baseSha.slice(0, 12)} non è un antenato di main (${head.slice(0, 12)})`);
  }
  const apply = [];
  const skipped = [];
  const conflicts = [];
  for (const c of m.changes) {
    const base = blobAt(repo, m.baseSha, c.path);
    const cur = blobAt(repo, head, c.path);
    if (c.op === 'add' && base !== null) fail(`manifest incoerente: "add" ma ${c.path} esiste nella base`);
    if (c.op !== 'add' && base === null) fail(`manifest incoerente: "${c.op}" ma ${c.path} non esiste nella base`);
    for (const rev of [m.baseSha, head]) {
      const mode = modeAt(repo, rev, c.path);
      if (mode && mode !== '100644') fail(`${c.path} in ${rev.slice(0, 12)} ha modalità ${mode} (atteso 100644)`);
    }
    const next = c.op === 'delete' ? null : gitBlobId(fileBuf(bundleDir, c.path));
    if (cur === base) apply.push({ ...c, blob: next });
    else if (cur === next) skipped.push(c.path);
    else conflicts.push(c.path);
  }
  if (conflicts.length) return { result: 'conflict', conflicts, skipped, manifest: m };
  if (!apply.length) return { result: 'noop', skipped, manifest: m };

  const tmp = mkdtempSync(path.join(tmpdir(), 'state-plan-'));
  try {
    const env = { GIT_INDEX_FILE: path.join(tmp, 'index') };
    git(repo, ['read-tree', head], { env });
    for (const c of apply) {
      if (c.op === 'delete') {
        git(repo, ['update-index', '--force-remove', '--', c.path], { env });
      } else {
        const blob = gitText(repo, ['hash-object', '-w', '--no-filters', '--stdin'], { input: fileBuf(bundleDir, c.path) });
        if (blob !== c.blob) fail(`hash inatteso per ${c.path}`);
        git(repo, ['update-index', '--add', '--cacheinfo', `100644,${blob},${c.path}`], { env });
      }
    }
    const tree = gitText(repo, ['write-tree'], { env });
    if (tree === gitText(repo, ['rev-parse', `${head}^{tree}`])) return { result: 'noop', skipped, manifest: m };
    const runUrl = runUrlOf(m.source.runId);
    const message = `${profileOf(profileName).subject}\n\n${runUrl ? `Run: ${runUrl}\n` : ''}State bundle: ${m.changes.length} change(s) on base ${m.baseSha.slice(0, 12)}\n`;
    const who = author ?? { name: 'AniMapVerse State Bot', email: 'state-bot@users.noreply.github.com' };
    const ident = { GIT_AUTHOR_NAME: who.name, GIT_AUTHOR_EMAIL: who.email, GIT_COMMITTER_NAME: who.name, GIT_COMMITTER_EMAIL: who.email };
    const commit = gitText(repo, ['commit-tree', tree, '-p', head, '-F', '-'], { input: message, env: ident });
    return { result: 'commit', commit, tree, applied: apply.map((c) => c.path), skipped, manifest: m };
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

function runUrlOf(runId) {
  const server = process.env.GITHUB_SERVER_URL;
  const repo = process.env.GITHUB_REPOSITORY;
  if (!runId || !server || !repo) return null;
  if (!/^https:\/\/[A-Za-z0-9.-]+$/.test(server) || !/^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/.test(repo) || !/^[0-9]+$/.test(runId)) return null;
  return `${server}/${repo}/actions/runs/${runId}`;
}

// ─── push (job privilegiato, con token) ───────────────────────────────────────────────────

/** Configurazione git per l'header di autenticazione: solo via ambiente, mai URL o argv. */
function authEnv(token) {
  const basic = Buffer.from(`x-access-token:${token}`).toString('base64');
  if (process.env.GITHUB_ACTIONS === 'true') process.stdout.write(`::add-mask::${basic}\n`);
  return {
    GIT_CONFIG_COUNT: '1',
    GIT_CONFIG_KEY_0: 'http.https://github.com/.extraheader',
    GIT_CONFIG_VALUE_0: `AUTHORIZATION: basic ${basic}`,
  };
}

/** Classifica il rifiuto del push: solo il non-fast-forward è ritentabile. */
export function classifyPushError(stderr) {
  if (/\[rejected\].*\((fetch first|non-fast-forward)\)|non-fast-forward|Updates were rejected because the (remote|tip)/i.test(stderr)) return 'retry';
  // corsa sull'aggiornamento del ref (due push nello stesso istante): main è cambiato, si riprova
  if (/cannot lock ref|incorrect old value provided|failed to update ref|is at [0-9a-f]+ but expected/i.test(stderr)) return 'retry';
  if (/GH013|GH006|protected branch|Repository rule violations|ruleset/i.test(stderr)) return 'rule';
  if (/\b(401|403)\b|Authentication failed|Permission to .* denied|Invalid username or (password|token)|could not read Username|bad credentials/i.test(stderr)) return 'auth';
  return 'other';
}

/**
 * Fetch di main, plan e push non forzato; su non-fast-forward rifà fetch + plan (max <attempts>).
 * <remote> è un URL senza credenziali (https://github.com/owner/repo.git o, nei test, un percorso).
 */
export function persist({ repo, bundleDir, profileName, remote, branch = 'main', token, author, attempts = 4, sleepMs = (n) => n * 5000, log = console.log }) {
  if (branch !== 'main' && !process.env.STATE_ALLOW_TEST_BRANCH) fail(`branch non ammesso: ${branch} (solo main)`);
  if (!/^[A-Za-z0-9._-]+$/.test(branch)) fail('nome di branch non valido');
  if (!token || typeof token !== 'string' || token.length < 8) fail('token della GitHub App assente: niente push (nessun fallback ad altre credenziali)');
  if (/@/.test(remote) || /\/\/[^/]*:[^/]*@/.test(remote)) fail('il remote non deve contenere credenziali');
  const env = authEnv(token);
  for (let attempt = 1; attempt <= attempts; attempt++) {
    git(repo, ['fetch', '--quiet', '--no-tags', '--depth=100', remote, `+refs/heads/${branch}:refs/state-bot/${branch}`], { env });
    const head = gitText(repo, ['rev-parse', `refs/state-bot/${branch}`]);
    const plan = planCommit({ repo, bundleDir, profileName, head, author });
    if (plan.result !== 'commit') {
      log(`[state] ${plan.result}${plan.conflicts ? `: ${plan.conflicts.join(', ')}` : ''}`);
      return { ...plan, head, attempt };
    }
    const r = git(repo, ['push', '--porcelain', remote, `${plan.commit}:refs/heads/${branch}`], { env, allowFail: true });
    if (r.code === 0) {
      log(`[state] pushed ${plan.commit.slice(0, 12)} on ${branch} (parent ${head.slice(0, 12)}, ${plan.applied.length} file)`);
      return { ...plan, result: 'pushed', head, attempt };
    }
    const kind = classifyPushError(r.stderr);
    if (kind === 'rule') fail(`push rifiutato da una regola del repository (ruleset/branch protection): l'app è nella bypass list? ${tail(r.stderr)}`);
    if (kind === 'auth') fail(`push non autorizzato (token assente, scaduto o senza Contents: write): ${tail(r.stderr)}`);
    if (kind !== 'retry') fail(`push non riuscito: ${tail(r.stderr)}`);
    log(`[state] ${branch} è avanzato durante il push (tentativo ${attempt}/${attempts}): nuovo fetch e nuovo plan`);
    if (attempt < attempts) sleepSync(sleepMs(attempt));
  }
  return fail(`${branch} ha continuato a muoversi: ${attempts} tentativi esauriti, nulla è stato perso (il bundle resta nell'artifact)`);
}

const tail = (s) => s.trim().split('\n').slice(-2).join(' | ').replace(/x-access-token:[^@\s]+/g, 'x-access-token:***');
function sleepSync(ms) {
  if (ms > 0) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

// ─── CLI ──────────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const [cmd, ...rest] = argv;
  const opts = {};
  for (let i = 0; i < rest.length; i++) {
    const k = rest[i];
    if (!k.startsWith('--')) fail(`argomento inatteso: ${k}`);
    const v = rest[i + 1];
    if (v === undefined || v.startsWith('--')) fail(`valore mancante per ${k}`);
    opts[k.slice(2)] = v;
    i++;
  }
  return { cmd, opts };
}
const need = (opts, k) => opts[k] ?? fail(`--${k} obbligatorio`);

function output(pairs) {
  for (const [k, v] of Object.entries(pairs)) {
    if (!/^[a-z-]+$/.test(k) || /[\r\n]/.test(String(v))) fail('output non valido');
    console.log(`${k}=${v}`);
    if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${k}=${v}\n`);
  }
}

export function main(argv = process.argv.slice(2)) {
  const { cmd, opts } = parseArgs(argv);
  const source = {
    workflow: process.env.GITHUB_WORKFLOW ?? 'local',
    runId: process.env.GITHUB_RUN_ID ?? 'local',
    runAttempt: process.env.GITHUB_RUN_ATTEMPT ?? '1',
  };
  switch (cmd) {
    case 'export': {
      const m = exportBundle({ repo: need(opts, 'repo'), baseSha: need(opts, 'base'), profileName: need(opts, 'profile'), outDir: need(opts, 'out'), source });
      output({ changes: m.changes.length });
      return 0;
    }
    case 'verify': {
      const m = verifyBundle(need(opts, 'bundle'), need(opts, 'profile'));
      output({ changes: m.changes.length, base: m.baseSha });
      return 0;
    }
    case 'apply': {
      const m = applyBundle({ repo: need(opts, 'repo'), bundleDir: need(opts, 'bundle'), profileName: need(opts, 'profile') });
      output({ changes: m.changes.length, base: m.baseSha });
      return 0;
    }
    case 'plan': {
      const repo = need(opts, 'repo');
      const head = gitText(repo, ['rev-parse', need(opts, 'head')]);
      const plan = planCommit({ repo, bundleDir: need(opts, 'bundle'), profileName: need(opts, 'profile'), head });
      if (plan.conflicts?.length) console.log(`[state] conflitti: ${plan.conflicts.join(', ')}`);
      output({ result: plan.result });
      return 0;
    }
    case 'push': {
      const slug = opts['app-slug'];
      if (slug !== undefined && !/^[a-z0-9-]{1,80}$/.test(slug)) fail('app-slug non valido');
      const author = slug ? { name: `${slug}[bot]`, email: `${slug}[bot]@users.noreply.github.com` } : undefined;
      const r = persist({
        repo: need(opts, 'repo'), bundleDir: need(opts, 'bundle'), profileName: need(opts, 'profile'),
        remote: need(opts, 'remote'), branch: opts.branch ?? 'main', token: process.env.STATE_BOT_TOKEN, author,
      });
      output({ result: r.result, commit: r.result === 'pushed' ? r.commit : '' });
      return 0;
    }
    default:
      return fail(`comando sconosciuto: ${cmd ?? '(nessuno)'} — export | verify | apply | plan | push`);
  }
}

const isCli = () => {
  try {
    return process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
};
if (isCli()) {
  try {
    process.exitCode = main();
  } catch (e) {
    console.error(`::error::${e instanceof StateError ? e.message : `errore inatteso: ${e.message}`}`);
    process.exitCode = 1;
  }
}
