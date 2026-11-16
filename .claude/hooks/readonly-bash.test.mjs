import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { reason } from './readonly-bash.mjs';

const allowed = [
  'rg -n "export function resolveSeoPath" src',
  'rg "=>" src/lib/filters.ts | head -5',
  'grep -rn "a > b" docs',
  'ls -la .claude && wc -l CLAUDE.md',
  'git log --oneline -5',
  'git diff origin/main...FETCH_HEAD --stat',
  'git show HEAD:package.json | jq .scripts',
  'git fetch origin pull/319/head',
  'git fetch origin main',
  'git branch -a',
  'git branch --contains HEAD',
  'git config --get remote.origin.url',
  'git status 2>&1',
  'git log 2>/dev/null | head',
  'npm run -s data:coverage -- jujutsukaisen',
  'npm run test:ci-scope',
  'npm run claude:validate',
  'npm ls react',
  'npm audit --omit=dev',
  'npx tsc --noEmit -p tools/social-engine/tsconfig.json',
  'node --test .claude/hooks/guard-bash.test.mjs',
  'node scripts/validate-claude-config.mjs',
  'find src -name "*.ts" -newer package.json',
  "sed -n '1,40p' src/seo/metadata.ts",
  "awk '{print $1}' package.json",
  'cd src && ls',
  'echo "$(git rev-parse HEAD)"',
  'bash -c "git status"',
];
const blocked = [
  'echo hi > file.txt',
  'cat a >> b',
  'git log > log.txt',
  'tee out.txt < in',
  "sed -i 's/a/b/' src/x.ts",
  "sed -ni 's/a/b/p' x",
  'find . -name "*.tmp" -delete',
  'find . -exec rm {} \\;',
  'rm -rf dist',
  'mv a b',
  'touch x',
  'git commit -m x',
  'git add .',
  'git checkout -b x',
  'git push -u origin feat',
  'git reset --hard',
  'git stash',
  'git branch new-branch',
  'git branch -D old',
  'git tag v1',
  'git config user.name x',
  'git fetch origin pull/1/head:pr-1',
  'git diff --output=x.patch',
  'npm install lodash',
  'npm ci',
  'npm run build',
  'npm run seo:slugs',
  'npm run social:next',
  'npm audit fix',
  'npx prettier --write .',
  'node -e "require(\'fs\').writeFileSync(\'x\',\'y\')"',
  'python3 -c "open(\'x\',\'w\')"',
  'curl -X POST https://example.com',
  'bash -c "echo x > y"',
  'echo "$(touch x)"',
  "awk '{print > \"out\"}' f",
  'sudo ls',
  "cat > f.md <<'EOF'\nhello\nEOF",
  'ls && rm x',
];

for (const c of allowed) test(`allows: ${c}`, () => assert.equal(reason(c), null, c));
for (const c of blocked) test(`blocks: ${c.split('\n').join(' ⏎ ')}`, () => assert.ok(reason(c), c));

test('bash-policy.mjs applies the read-only policy only to read-only agents', () => {
  const hook = fileURLToPath(new URL('./bash-policy.mjs', import.meta.url));
  const run = (agent_type, command) =>
    spawnSync(process.execPath, [hook], { input: JSON.stringify({ agent_type, tool_input: { command } }) }).status;
  for (const a of ['code-architect', 'security-devops', 'lightweight-research']) {
    assert.equal(run(a, 'touch /tmp/x'), 2, a);
    assert.equal(run(a, 'git log -1'), 0, a);
  }
  assert.equal(run('frontend-specialist', 'echo hi > /tmp/allowed-for-writers'), 0);
  assert.equal(run(undefined, 'npm run build'), 0); // main session: only the push guard
  assert.equal(spawnSync(process.execPath, [hook], { input: 'not json' }).status, 2); // fail closed
});
