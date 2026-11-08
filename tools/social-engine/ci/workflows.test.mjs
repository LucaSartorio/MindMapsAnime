// Invarianti di sicurezza dei workflow del social engine (SEC-01 · docs/SOCIAL_STATE_BOT.md).
// Verifiche statiche sul testo YAML, senza dipendenze: npm run social:state:test
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { PROFILES } from './state-bundle.mjs';

const wf = (name) => readFileSync(new URL(`../../../.github/workflows/${name}`, import.meta.url), 'utf8');
/** Blocchi `jobs.<id>` (indentazione a 2 spazi sotto `jobs:`). */
/** Testo YAML senza commenti (righe intere e commenti in coda). */
const strip = (text) => text.replace(/^\s*#.*$/gm, '').replace(/\s+#\s.*$/gm, '');
function jobs(text) {
  const clean = strip(text);
  const body = clean.slice(clean.indexOf('\njobs:\n'));
  const out = {};
  const re = /^ {2}([A-Za-z0-9_-]+):\n([\s\S]*?)(?=^ {2}[A-Za-z0-9_-]+:\n|(?![\s\S]))/gm;
  for (const m of body.matchAll(re)) out[m[1]] = m[2];
  return out;
}
const triggers = (text) => text.slice(text.indexOf('\non:\n'), text.indexOf('\npermissions:'));
const usesLines = (text) => [...text.matchAll(/^\s*uses:\s*(\S+)/gm)].map((m) => m[1]);

test('social-state-persist.yml: segreti solo nel job privilegiato, trigger fidati, action fissate', () => {
  const t = wf('social-state-persist.yml');
  const j = jobs(t);
  assert.deepEqual(Object.keys(j), ['check', 'prepare', 'persist']);
  const on = triggers(t);
  for (const bad of ['pull_request', 'pull_request_target', 'workflow_run', 'issue_comment', 'push:', 'schedule']) {
    assert.ok(!on.includes(bad), `trigger non ammesso: ${bad}`);
  }
  assert.match(on, /workflow_call:/);
  // prepare: niente environment, niente segreti, niente scrittura
  assert.ok(!/environment:/.test(j.prepare) && !/secrets\./.test(j.prepare));
  assert.ok(!/(?<!permission-)contents:\s*write/.test(t), 'nessun job con contents: write');
  // persist: environment social-state, niente npm / setup-node / merge driver / commit-state
  assert.match(j.persist, /^ {4}environment: social-state$/m);
  for (const bad of [/\bnpm\b/, /setup-node/, /merge\.social/, /commit-state\.sh/, /\bnpx\b/, /\btsx\b/]) assert.ok(!bad.test(j.persist), `nel job privilegiato: ${bad}`);
  // il token viene coniato dopo il plan e solo con Contents: write
  const plan = j.persist.indexOf('Verify and plan');
  const mint = j.persist.indexOf('create-github-app-token');
  const push = j.persist.indexOf('state-bundle.mjs push');
  assert.ok(plan > 0 && mint > plan && push > mint, 'ordine: plan → token → push');
  assert.deepEqual([...j.persist.matchAll(/permission-([a-z-]+):\s*(\S+)/g)].map((m) => `${m[1]}=${m[2]}`), ['contents=write']);
  assert.match(j.persist, /client-id: \$\{\{ vars\.STATE_BOT_CLIENT_ID \}\}/);
  assert.match(j.persist, /private-key: \$\{\{ secrets\.STATE_BOT_PRIVATE_KEY \}\}/);
  // segreti solo nei due job con environment social-state (check senza push, persist)
  assert.equal((strip(t).match(/secrets\./g) ?? []).length, 2);
  for (const k of ['check', 'persist']) {
    assert.match(j[k], /^ {4}environment: social-state$/m);
    assert.equal((j[k].match(/secrets\.STATE_BOT_PRIVATE_KEY/g) ?? []).length, 1);
  }
  // check: niente checkout, niente codice del repository, nessuna scrittura
  for (const bad of [/actions\/checkout/, /\bnpm\b/, /git push/, /state-bundle\.mjs/]) assert.ok(!bad.test(j.check), `nel job check: ${bad}`);
  assert.match(j.check, /git ls-remote/);
  // nessuna credenziale persistita dai checkout; action esterne fissate a uno SHA
  assert.equal((t.match(/persist-credentials: false/g) ?? []).length, (t.match(/actions\/checkout@/g) ?? []).length);
  for (const u of usesLines(t)) assert.match(u, /^[\w./-]+@[0-9a-f]{40}$/, `non fissata a uno SHA: ${u}`);
});

const migrated = [
  { file: 'social-render.yml', job: 'render', profile: 'render', skip: '[skip social-render]' },
  ...(existsSync(new URL('../../../.github/workflows/social-publication-state.yml', import.meta.url)) &&
  wf('social-publication-state.yml').includes('social-state-persist.yml')
    ? [{ file: 'social-publication-state.yml', job: 'apply', profile: 'publication', skip: '[skip social-publication]' }]
    : []),
];

for (const m of migrated) {
  test(`${m.file}: job di lavoro in sola lettura, stato al State Bot, loop guard`, () => {
    const t = wf(m.file);
    const j = jobs(t);
    assert.match(j[m.job], /permissions:\n\s+contents: read\n/);
    assert.ok(!/contents:\s*write/.test(t), 'nessun contents: write');
    assert.ok(!/secrets\./.test(t), 'nessun segreto nel workflow di lavoro');
    assert.ok(!t.includes('commit-state.sh'), 'commit-state.sh non più usato');
    assert.match(j[m.job], /github\.actor != 'github-actions\[bot\]'/);
    assert.match(j[m.job], /github\.actor != vars\.STATE_BOT_LOGIN/);
    assert.ok(j[m.job].includes(`!contains(github.event.head_commit.message, '${m.skip}')`));
    assert.match(j[m.job], new RegExp(`state-bundle\\.mjs export[\\s\\S]*--profile ${m.profile}`));
    for (const k of ['state', 'state-retry']) {
      assert.match(j[k], /uses: \.\/\.github\/workflows\/social-state-persist\.yml/);
      assert.match(j[k], new RegExp(`profile: ${m.profile}\\n`));
    }
    assert.match(j['state-retry'], /needs\.state\.outputs\.result == 'conflict'/);
    for (const u of usesLines(t).filter((x) => !x.startsWith('./'))) assert.match(u, /^[\w./-]+@[0-9a-f]{40}$/, `non fissata a uno SHA: ${u}`);
  });
}

test('i commit di stato portano [skip ci] e lo skip del proprio workflow (loop guard)', () => {
  assert.match(PROFILES.render.subject, /\[skip social-render\] \[skip ci\]$/);
  assert.match(PROFILES.publication.subject, /\[skip social-publication\] \[skip ci\]$/);
});
