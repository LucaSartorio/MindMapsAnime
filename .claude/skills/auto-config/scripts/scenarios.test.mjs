// Deterministic end-to-end scenarios of the auto-config system on throwaway fixture projects (no network, no model).
// Docs-related scenarios (E, H, I, L for the lock) are in docs-rag.test.mjs; the guard's own cases in
// .claude/hooks/config-path-guard.test.mjs and posture.test.mjs. Live (model) runs: docs/claude-config/.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { flags, main as bench, metrics, reader } from './config-bench.mjs';
import { write as writePosture } from '../../../hooks/posture.mjs';

const REPO = fileURLToPath(new URL('../../../../', import.meta.url));
const VALIDATOR = join(REPO, 'scripts/validate-claude-config.mjs');
const HOOKS = ['bash-policy.mjs', 'guard-bash.mjs', 'readonly-bash.mjs', 'config-path-guard.mjs', 'posture.mjs'];

const agent = (name, tools, extra = '') => `---\nname: ${name}\ndescription: ${name} handles a narrowly scoped job in the fixture project, nothing else at all.\nmodel: sonnet\neffort: medium\ntools: ${tools}\n${extra}---\n\nBody.\n\n## Output contract\nSTATUS: done\n`;
const skill = (name, desc, body = 'Do the thing for $ARGUMENTS.\n') => `---\nname: ${name}\ndescription: ${desc}\nargument-hint: [x]\n---\n\n${body}`;

/** Minimal valid project: the real hooks, one read-only and one confined agent, one skill, wired settings. */
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'auto-config-'));
  const w = (f, t) => { mkdirSync(dirname(join(root, f)), { recursive: true }); writeFileSync(join(root, f), t); };
  for (const h of HOOKS) { mkdirSync(join(root, '.claude/hooks'), { recursive: true }); copyFileSync(join(REPO, '.claude/hooks', h), join(root, '.claude/hooks', h)); }
  w('package.json', JSON.stringify({ scripts: { 'claude:validate': 'x' } }));
  w('CLAUDE.md', '# Fixture\n');
  w('.claude/settings.json', JSON.stringify({
    permissions: { allow: ['Bash(npm run claude:validate *)'], ask: ['Edit(/.claude/hooks/**)'], deny: ['Read(./.env)'] },
    hooks: { PreToolUse: [
      { matcher: 'Bash', hooks: [{ type: 'command', command: 'node "${CLAUDE_PROJECT_DIR}/.claude/hooks/bash-policy.mjs"' }] },
      { matcher: 'Edit|Write|NotebookEdit', hooks: [{ type: 'command', command: 'node "${CLAUDE_PROJECT_DIR}/.claude/hooks/config-path-guard.mjs"' }] },
    ] },
  }, null, 2));
  // READ_ONLY_AGENTS of the real bash-policy lists the repo agents: give the fixture the same read-only names.
  for (const n of ['security-devops', 'lightweight-research', 'configuration-reviewer']) w(`.claude/agents/${n}.md`, agent(n, 'Read, Grep, Glob, Bash'));
  w('.claude/agents/configuration-manager.md', agent('configuration-manager', 'Read, Grep, Glob, Edit, Write, Bash'));
  w('.claude/skills/seo-check/SKILL.md', skill('seo-check', 'Check SEO metadata of one world and report broken canonical or hreflang tags with evidence.'));
  w('docs/CLAUDE_DEVELOPMENT_SYSTEM.md', '# Guide\nsecurity-devops lightweight-research configuration-reviewer configuration-manager /seo-check\n');
  writePosture(root);
  return { root, w, read: (f) => readFileSync(join(root, f), 'utf8') };
}
const validate = (root) => {
  const r = spawnSync(process.execPath, [VALIDATOR], { cwd: root, encoding: 'utf8' });
  return { code: r.status, out: r.stdout + r.stderr };
};
const guard = (root, file) => spawnSync(process.execPath, [join(root, '.claude/hooks/config-path-guard.mjs')], {
  input: JSON.stringify({ agent_type: 'configuration-manager', tool_name: 'Edit', tool_input: { file_path: join(root, file) }, cwd: root }),
  env: { ...process.env, CLAUDE_PROJECT_DIR: root },
}).status;

test('fixture baseline is valid (control for the scenarios below)', () => {
  const { root } = fixture();
  const v = validate(root);
  assert.equal(v.code, 0, v.out);
});

test('Scenario A — audit on the real repository changes nothing', () => {
  const snap = () => execFileSync('git', ['-C', REPO, 'status', '--porcelain', '--untracked-files=all'], { encoding: 'utf8' }) +
    execFileSync('git', ['-C', REPO, 'diff'], { encoding: 'utf8' });
  const before = snap();
  spawnSync(process.execPath, [VALIDATOR], { cwd: REPO });
  bench([], { root: REPO, out: () => {} });
  spawnSync(process.execPath, [join(REPO, '.claude/skills/auto-config/scripts/docs-rag.mjs'), '--read-only', 'status'], { cwd: REPO });
  assert.equal(snap(), before);
});

test('Scenario B — a new agent: well-formed passes once its privileges are acknowledged; malformed is rejected', () => {
  const { root, w, read } = fixture();
  w('.claude/agents/seo-regression.md', agent('seo-regression', 'Read, Grep, Glob, Edit, Bash'));
  w('docs/CLAUDE_DEVELOPMENT_SYSTEM.md', read('docs/CLAUDE_DEVELOPMENT_SYSTEM.md') + 'seo-regression\n');
  const v1 = validate(root);
  assert.equal(v1.code, 1);
  assert.match(v1.out, /security posture changed: agents\.seo-regression\.tools/); // new privileges need the owner
  assert.doesNotMatch(v1.out, /\[ERR \] (?!security posture)/);
  writePosture(root); // = owner runs npm run claude:posture:update after review
  assert.equal(validate(root).code, 0);
  w('.claude/agents/bad.md', '---\nname: bad\ndescription: An agent that delegates everything to other agents and has a typo field.\nmodle: opus\ntools: Read, Agent, mcp__github__merge_pull_request\npermissionMode: bypassPermissions\n---\n');
  const v2 = validate(root).out;
  for (const re of [/unknown agent field "modle"/, /must not spawn agents/, /MCP tool "mcp__github__merge_pull_request" is not read-only/, /bypassPermissions is not allowed/, /agent bad not documented/]) assert.match(v2, re);
});

test('Scenario C — a new skill: references and trigger set are checked', () => {
  const { root, w, read } = fixture();
  w('.claude/skills/gsc-summary/SKILL.md', skill('gsc-summary', 'Summarise Search Console CSV exports into losses by template and query, using the existing analyzer.', 'Follow `references/how.md` for $ARGUMENTS.\n'));
  w('docs/CLAUDE_DEVELOPMENT_SYSTEM.md', read('docs/CLAUDE_DEVELOPMENT_SYSTEM.md') + '/gsc-summary\n');
  w('.claude/skills/gsc-summary/evals/triggers.json', JSON.stringify({ queries: [{ query: 'summarise this GSC export', should_trigger: true }] }));
  writePosture(root);
  const v = validate(root).out;
  assert.match(v, /references missing file references\/how\.md/);
  assert.match(v, /needs ≥ 5 should-trigger and ≥ 5 should-not queries \(found 1\/0\)/);
  w('.claude/skills/gsc-summary/references/how.md', 'steps');
  const q = (s, n) => Array.from({ length: n }, (_, i) => ({ query: `${s} ${i}`, should_trigger: s === 'yes' }));
  w('.claude/skills/gsc-summary/evals/triggers.json', JSON.stringify({ queries: [...q('yes', 5), ...q('no', 5)] }));
  assert.equal(validate(root).code, 0);
});

test('Scenario D — an inefficient configuration is detected and the fix is measurably better', () => {
  const dup = 'Always run the cheapest deterministic validator first and stop at the first failure, then report.';
  const base = fixture();
  base.w('.claude/skills/seo-check-world/SKILL.md', skill('seo-check-world', 'Check SEO metadata of one world and report broken canonical or hreflang tags with evidence.', `${dup}\nThen $ARGUMENTS.\n`));
  base.w('.claude/skills/seo-check/SKILL.md', skill('seo-check', 'Check SEO metadata of one world and report broken canonical or hreflang tags with evidence.', `${dup}\nThen $ARGUMENTS.\n`));
  base.w('docs/CLAUDE_DEVELOPMENT_SYSTEM.md', base.read('docs/CLAUDE_DEVELOPMENT_SYSTEM.md') + '/seo-check-world\n');
  writePosture(base.root);
  assert.match(validate(base.root).out, /skills seo-check and seo-check-world: descriptions overlap 100%/);
  const before = metrics(reader(base.root));
  assert.ok(before.duplicateLines >= 1);
  const fixed = fixture(); // consolidated: one skill, no duplicated lines
  const after = metrics(reader(fixed.root));
  assert.ok(after.startupChars < before.startupChars && after.duplicateLines === 0);
  assert.deepEqual(flags(before, after), []);
});

test('Scenario F — nothing to improve: no flags, no snapshot rewrite, identical output on repeat', () => {
  const { root } = fixture();
  const m = metrics(reader(root));
  assert.deepEqual(flags(m, metrics(reader(root))), []);
  assert.equal(writePosture(root), false);
  let a = '';
  let b = '';
  bench(['--json'], { root, out: (s) => { a += s; } });
  bench(['--json'], { root, out: (s) => { b += s; } });
  assert.equal(a, b);
});

test('Scenario G — the manager cannot write protected files; a bypass is caught by the validator (CI)', () => {
  const { root, w, read } = fixture();
  for (const f of ['CLAUDE.md', '.claude/settings.json', '.claude/hooks/bash-policy.mjs', '.claude/agents/configuration-manager.md',
    '.claude/agents/configuration-reviewer.md', '.claude/skills/auto-config/SKILL.md', '.claude/security-posture.json', '.github/workflows/site-ci.yml'])
    assert.equal(guard(root, f), 2, f);
  assert.equal(guard(root, '.claude/agents/new-one.md'), 0);
  // the same edit made outside the guard (another tool, a human, a hostile PR) fails claude:validate
  const s = JSON.parse(read('.claude/settings.json'));
  s.permissions.deny = [];
  w('.claude/settings.json', JSON.stringify(s, null, 2));
  const v = validate(root);
  assert.equal(v.code, 1);
  assert.match(v.out, /security posture changed: settings\.deny/);
});

test('Scenario J — a regressing change is detected and blocked', () => {
  const base = fixture();
  const head = fixture();
  head.w('.claude/agents/lightweight-research.md', agent('lightweight-research', 'Read, Grep, Glob, Bash, Write, WebFetch'));
  const settings = JSON.parse(head.read('.claude/settings.json'));
  settings.permissions.ask = [];
  head.w('.claude/settings.json', JSON.stringify(settings, null, 2));
  const f = flags(metrics(reader(base.root)), metrics(reader(head.root)));
  assert.ok(f.some((x) => /privilege ↑ writers/.test(x)) && f.some((x) => /privilege ↑ webAgents/.test(x)) && f.some((x) => /protection ↓ askRules/.test(x)), f.join('\n'));
  const v = validate(head.root).out;
  assert.match(v, /lightweight-research is in READ_ONLY_AGENTS but has Edit\/Write/);
  assert.match(v, /security posture changed: agents\.lightweight-research\.tools/);
  assert.match(v, /security posture changed: settings\.ask/);
});

test('Scenario K — an external source cannot lift an internal restriction', () => {
  // The official docs list bypassPermissions as a valid permissionMode and defaultMode: the repo forbids both.
  const { root, w, read } = fixture();
  w('.claude/agents/configuration-manager.md', agent('configuration-manager', 'Read, Grep, Glob, Edit, Write, Bash', 'permissionMode: bypassPermissions\n'));
  const s = JSON.parse(read('.claude/settings.json'));
  s.permissions.defaultMode = 'bypassPermissions';
  w('.claude/settings.json', JSON.stringify(s, null, 2));
  writePosture(root); // even an acknowledged snapshot does not make it acceptable
  const v = validate(root).out;
  assert.match(v, /bypassPermissions is not allowed in this repo/);
  assert.match(v, /defaultMode must not be set from the repo/);
});

test('Scenario M — the guard behaves the same with CLAUDE_PROJECT_DIR (local CLI) or only cwd (other surfaces)', () => {
  const { root } = fixture();
  const hook = join(root, '.claude/hooks/config-path-guard.mjs');
  const input = (f) => JSON.stringify({ agent_type: 'configuration-manager', tool_input: { file_path: join(root, f) }, cwd: root });
  const env = { ...process.env };
  delete env.CLAUDE_PROJECT_DIR;
  assert.equal(spawnSync(process.execPath, [hook], { input: input('CLAUDE.md'), env }).status, 2);
  assert.equal(spawnSync(process.execPath, [hook], { input: input('.claude/agents/x.md'), env }).status, 0);
  assert.equal(spawnSync(process.execPath, [hook], { input: input('CLAUDE.md'), env: { ...env, CLAUDE_PROJECT_DIR: root } }).status, 2);
});

test('benchmark compares git refs of the real repository', () => {
  let out = '';
  assert.equal(bench(['--base', 'HEAD'], { root: REPO, out: (s) => { out += s; } }), 0);
  assert.match(out, /startupChars +\d+ +\d+/);
});
