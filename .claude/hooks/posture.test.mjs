import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { check, compute, write } from './posture.mjs';

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'posture-'));
  mkdirSync(join(root, '.claude/agents'), { recursive: true });
  mkdirSync(join(root, '.claude/skills/demo'), { recursive: true });
  mkdirSync(join(root, '.claude/hooks'), { recursive: true });
  writeFileSync(join(root, '.claude/settings.json'), JSON.stringify({
    permissions: { allow: ['Bash(npm run build)'], ask: ['Edit(/.github/**)'], deny: ['Read(./.env)', 'Edit(/src/data/*/slugs.ts)'] },
    hooks: { PreToolUse: [{ matcher: 'Bash', hooks: [{ type: 'command', command: 'node guard.mjs' }] }] },
  }));
  writeFileSync(join(root, '.claude/agents/reader.md'), '---\nname: reader\ndescription: d\ntools: Read, Grep\n---\nbody\n');
  writeFileSync(join(root, '.claude/skills/demo/SKILL.md'), '---\nname: demo\ndescription: d\nallowed-tools:\n  - Bash(npm run -s x *)\n---\nbody\n');
  writeFileSync(join(root, '.claude/hooks/bash-policy.mjs'), "export const READ_ONLY_AGENTS = new Set(['Plan', 'reader']);\n");
  cpSync(new URL('./config-path-guard.mjs', import.meta.url), join(root, '.claude/hooks/config-path-guard.mjs'));
  return root;
}
const edit = (root, f, fn) => writeFileSync(join(root, f), fn(readFileSync(join(root, f), 'utf8')));

test('missing snapshot is an error; write then check is clean; write is idempotent', () => {
  const root = fixture();
  assert.match(check(root)[0], /missing/);
  assert.equal(write(root), true);
  assert.deepEqual(check(root), []);
  assert.equal(write(root), false); // same configuration → byte-identical snapshot, no diff
});

const weakenings = [
  ['a deny rule removed', '.claude/settings.json', (t) => t.replace('"Read(./.env)",', ''), /settings\.deny/],
  ['an ask rule removed', '.claude/settings.json', (t) => t.replace('"Edit(/.github/**)"', ''), /settings\.ask/],
  ['the Bash hook removed', '.claude/settings.json', (t) => t.replace(/"hooks":\{.*\}\]\}\]\}/, '"hooks":{}'), /settings\.hooks/],
  ['defaultMode bypassPermissions', '.claude/settings.json', (t) => t.replace('"permissions":{', '"permissions":{"defaultMode":"bypassPermissions",'), /defaultMode/],
  ['an agent gains Bash + Write', '.claude/agents/reader.md', (t) => t.replace('tools: Read, Grep', 'tools: Read, Grep, Bash, Write'), /agents\.reader\.tools/],
  ['an agent loses its allowlist', '.claude/agents/reader.md', (t) => t.replace('tools: Read, Grep\n', ''), /agents\.reader\.tools/],
  ['a skill pre-approves more tools', '.claude/skills/demo/SKILL.md', (t) => t.replace('  - Bash(npm run -s x *)', '  - Bash(npm run -s x *)\n  - Bash(git push *)'), /skills\.demo\.allowedTools/],
  ['an agent leaves the read-only set', '.claude/hooks/bash-policy.mjs', (t) => t.replace(", 'reader'", ''), /readOnlyAgents/],
  ['guard code edited', '.claude/hooks/config-path-guard.mjs', (t) => t.replace("'.claude/skills/auto-config/**',", ''), /files\.\.claude\/hooks\/config-path-guard\.mjs/],
];
for (const [label, file, fn, key] of weakenings)
  test(`detects: ${label}`, () => {
    const root = fixture();
    write(root);
    edit(root, file, fn);
    const problems = check(root);
    assert.ok(problems.length > 0, label);
    assert.ok(problems.some((p) => key.test(p)), problems.join('\n'));
  });

test('a strengthening is reported too (a stale snapshot would hide a later weakening)', () => {
  const root = fixture();
  write(root);
  edit(root, '.claude/settings.json', (t) => t.replace('"deny":[', '"deny":["Edit(/CLAUDE.md)",'));
  assert.ok(check(root).some((p) => /settings\.deny/.test(p)));
});

test('a new agent appears in the posture with its tools', () => {
  const root = fixture();
  writeFileSync(join(root, '.claude/agents/new.md'), '---\nname: new-agent\ndescription: d\n---\n');
  assert.equal(compute(root).agents['new-agent'].tools, '(all)');
});
