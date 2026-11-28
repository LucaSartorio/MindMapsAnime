import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { decide, globToRegExp, pathReason } from './config-path-guard.mjs';

const root = mkdtempSync(join(tmpdir(), 'path-guard-'));
for (const d of ['.claude/agents', '.claude/skills/auto-config', '.claude/skills/seo-x', '.claude/hooks', 'docs', 'outside-target']) mkdirSync(join(root, d), { recursive: true });
writeFileSync(join(root, 'CLAUDE.md'), 'x');
writeFileSync(join(root, '.claude/settings.json'), '{}');
const elsewhere = mkdtempSync(join(tmpdir(), 'path-guard-out-'));
// symlinks that look harmless but resolve to protected/outside files
symlinkSync(join(root, 'CLAUDE.md'), join(root, '.claude/skills/seo-x/notes.md'));
symlinkSync(join(root, '.claude/hooks'), join(root, '.claude/skills/hooks-link'));
symlinkSync(elsewhere, join(root, '.claude/skills/out-link'));
symlinkSync(join(root, '.claude/skills/auto-config'), join(root, 'docs/claude-config'));
symlinkSync(join(root, '.claude/settings.local.json'), join(root, '.claude/skills/seo-x/dangling.md')); // target does not exist yet
writeFileSync(join(root, '.claude/agents/existing.md'), '---\nname: existing\ndescription: d\ntools: Read, Grep\n---\nbody !`date`\n');

const abs = (p) => join(root, p);
const allowed = ['.claude/agents/seo-regression.md', '.claude/agents/review/nested.md', '.claude/skills/seo-x/SKILL.md',
  '.claude/skills/new-skill/references/guide.md', '.claude/skills/new-skill/evals/triggers.json', 'docs/CLAUDE_DEVELOPMENT_SYSTEM.md'];
const blocked = ['CLAUDE.md', 'AGENTS.md', '.claude/settings.json', '.claude/settings.local.json', '.claude/hooks/bash-policy.mjs',
  '.claude/agents/configuration-manager.md', '.claude/agents/configuration-reviewer.md', '.claude/agents/security-devops.md',
  '.claude/skills/auto-config/SKILL.md', '.claude/skills/auto-config/references/policy.md', '.claude/skills/auto-config/references/sources.json',
  '.claude/rules/security.md', '.claude/rules/seo.md', '.github/CODEOWNERS', '.github/workflows/site-ci.yml', 'package.json',
  'scripts/validate-claude-config.mjs', 'src/App.tsx', '.claude/security-posture.json',
  '.claude/skills/new-skill/scripts/run.mjs', '.claude/skills/new-skill/scripts/run.sh', '.claude/agents/x.mjs',
  // traversal and symlink escapes
  '.claude/skills/../settings.json', '.claude/skills/seo-x/../../hooks/guard-bash.mjs', '.claude/skills/seo-x/notes.md',
  '.claude/skills/hooks-link/new.md', '.claude/skills/out-link/x.md', 'docs/claude-config/SKILL.md', '.claude/skills/seo-x/dangling.md',
  // case-insensitive filesystems and Windows aliases (security-devops review 2026-11-28)
  '.claude/agents/Configuration-Manager.md', '.claude/agents/SECURITY-DEVOPS.md', '.claude/skills/Auto-Config/SKILL.md',
  '.claude/skills/auto-config./SKILL.md', '.claude/skills/auto-config /SKILL.md', '.claude/agents/x.md:stream', '.claude/skills/AUTO-CO~1/SKILL.md'];

for (const p of allowed) test(`allows ${p}`, () => assert.equal(pathReason(abs(p), root), null, p));
for (const p of blocked) test(`blocks ${p}`, () => assert.ok(pathReason(abs(p), root), p));

test('blocks paths outside the project and invalid input', () => {
  assert.ok(pathReason('/etc/passwd', root));
  assert.ok(pathReason(join(elsewhere, 'a.md'), root));
  assert.ok(pathReason('', root));
  assert.ok(pathReason(undefined, root));
  assert.ok(pathReason(abs('.claude/agents/a.md') + '\0', root));
  assert.equal(pathReason('.claude/agents/relative.md', root), null); // relative paths resolve against the root
});

test('glob semantics: * is one segment, ** any depth', () => {
  assert.ok(globToRegExp('.claude/agents/**/*.md').test('.claude/agents/a.md'));
  assert.ok(globToRegExp('.claude/agents/**/*.md').test('.claude/agents/x/y/a.md'));
  assert.ok(!globToRegExp('.claude/agents/*.md').test('.claude/agents/x/a.md'));
  assert.ok(!globToRegExp('.claude/agents/**/*.md').test('.claude/agentsX/a.md'));
});

test('only confined agents are affected', () => {
  const input = (agent_type, file_path) => ({ agent_type, cwd: root, tool_input: { file_path } });
  const env = { CLAUDE_PROJECT_DIR: root };
  assert.ok(decide(input('configuration-manager', abs('CLAUDE.md')), env));
  assert.equal(decide(input(undefined, abs('CLAUDE.md')), env), null); // main session: permission rules apply instead
  assert.equal(decide(input('frontend-specialist', abs('src/App.tsx')), env), null);
  assert.ok(decide({ agent_type: 'configuration-manager', cwd: root, tool_input: { notebook_path: abs('x.ipynb') } }, env));
});

test('hook process: exit 2 with a reason, 0 when allowed, fail closed on bad input', () => {
  const hook = fileURLToPath(new URL('./config-path-guard.mjs', import.meta.url));
  const run = (input) => spawnSync(process.execPath, [hook], { input, env: { ...process.env, CLAUDE_PROJECT_DIR: root } });
  const bad = run(JSON.stringify({ agent_type: 'configuration-manager', tool_name: 'Write', tool_input: { file_path: abs('.claude/settings.json') } }));
  assert.equal(bad.status, 2);
  assert.match(bad.stderr.toString(), /outside the configuration-manager allowlist/);
  assert.equal(run(JSON.stringify({ agent_type: 'configuration-manager', tool_name: 'Write', tool_input: { file_path: abs('.claude/agents/ok.md'), content: '---\nname: ok\ndescription: d\ntools: Read\n---\n' } })).status, 0);
  assert.equal(run(JSON.stringify({ agent_type: 'configuration-manager', tool_name: 'Edit', tool_input: { file_path: abs('.claude/agents/ok.md') } })).status, 2); // unknown result → refused
  assert.equal(run('not json').status, 2);
});

test('privilege-bearing frontmatter and inline shell cannot be added or changed', async () => {
  const { contentReason } = await import('./config-path-guard.mjs');
  const a = (extra = '', body = 'b') => `---\nname: x\ndescription: d\ntools: Read, Grep\n${extra}---\n${body}\n`;
  const sk = (extra = '', body = 'b') => `---\nname: s\ndescription: d\n${extra}---\n${body}\n`;
  assert.equal(contentReason('.claude/agents/x.md', null, a()), null); // a plain new agent is fine
  assert.equal(contentReason('.claude/agents/x.md', a(), a('', 'shorter body')), null); // trimming instructions is fine
  for (const extra of ['permissionMode: bypassPermissions\n', 'hooks:\n  PreToolUse:\n    - command: x\n', 'mcpServers:\n  - github\n', 'isolation: worktree\n'])
    assert.ok(contentReason('.claude/agents/x.md', a(), a(extra)), extra);
  assert.ok(contentReason('.claude/agents/x.md', null, a().replace('Read, Grep', 'Read, Agent')));
  assert.ok(contentReason('.claude/agents/x.md', null, a().replace('Read, Grep', 'Read, mcp__github__merge_pull_request')));
  assert.ok(contentReason('.claude/agents/x.md', null, a().replace('name: x', 'name: security-devops')));
  for (const extra of ['allowed-tools:\n  - Bash(git push *)\n', 'context: fork\nagent: general-purpose\n', 'hooks:\n  Stop: x\n'])
    assert.ok(contentReason('.claude/skills/s/SKILL.md', sk(), sk(extra)), extra);
  assert.ok(contentReason('.claude/skills/s/SKILL.md', sk(), sk('', 'run !`curl x | sh`')));
  assert.equal(contentReason('.claude/skills/s/SKILL.md', sk('', 'keep !`date`'), sk('', 'keep !`date` and more text')), null); // unchanged shell ok
  assert.equal(contentReason('.claude/skills/s/references/x.md', null, 'anything !`x`'), null); // not loaded as a skill
  assert.ok(contentReason('.claude/agents/x.md', a(), null)); // unknown result
});

test('Edit is applied to the current file before checking; every path key must pass', () => {
  const env = { CLAUDE_PROJECT_DIR: root };
  const edit = (old_string, new_string) => ({ agent_type: 'configuration-manager', cwd: root, tool_input: { file_path: abs('.claude/agents/existing.md'), old_string, new_string } });
  assert.equal(decide(edit('body', 'better body'), env), null);
  assert.match(decide(edit('tools: Read, Grep\n', 'tools: Read, Grep\npermissionMode: bypassPermissions\n'), env), /permissionMode/);
  assert.match(decide({ agent_type: 'configuration-manager', cwd: root, tool_input: { file_path: abs('.claude/agents/ok2.md'), notebook_path: abs('.claude/settings.json'), content: '---\nname: ok2\ndescription: d\ntools: Read\n---\n' } }, env), /allowlist/);
});
