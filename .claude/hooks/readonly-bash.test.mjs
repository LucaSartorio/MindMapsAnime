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
  // read-only forms of programs that also have write/exec options (2026-11-18)
  "sed -n '/start/,/end/p' f",
  "sed 's/^/  /' f",
  "sed -E 's#a/b#c#g' f",
  "sed 's/;/,/g' f",
  "sed -n -e '1,3p' -e '9q' f",
  "sed '/^#/d' f",
  'sort -k2 -t, a | uniq -c | sort -rn',
  'uniq -f 2 f',
  'xxd -l 64 f',
  'tree -L 2 src',
  'git -C tools log -1',
  'git fetch -u origin main',
  'git grep -n foo',
  'FOO=1 npm run validate:data',
  'export LANG=C',
  'rg --pre-glob "*.ts" foo src',
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
  // indirect writes through allowed programs (2026-11-18)
  'sort -o out.txt src/a.ts',
  'sort -uo out a',
  'sort --output=x a',
  'uniq in.txt out.txt',
  "sed -n 'w out.txt' f",
  "sed -n -e '1w /tmp/x' f",
  "sed 's/a/b/w out' f",
  "sed '1r /etc/hosts' f",
  'sed -f script.sed f',
  'xxd a.bin b.hex',
  'tree -o out.txt',
  // command execution through allowed programs (git -c verified to run commands in `status` and `diff`)
  "sed '1e touch x' f",
  "git -c core.fsmonitor='touch /tmp/x' status",
  "git -c diff.external='touch /tmp/x' diff",
  'git --config-env=core.pager=X log',
  'git log -p --ext-diff',
  "git fetch --upload-pack='touch /tmp/x' /tmp/repo",
  "git ls-remote -u 'touch x' /tmp/r",
  'git grep -Oless foo',
  "GIT_EXTERNAL_DIFF='touch x' git diff",
  'env GIT_PAGER=x git log',
  'export GIT_EXTERNAL_DIFF=x; git diff',
  'GIT_EXTERNAL_DIFF=x; git diff',
  "PAGER='touch y' git log",
  'NODE_OPTIONS=--require=./x.js npm run validate:data',
  "rg --pre 'touch /tmp/x' foo src",
  'rg --pre=sh foo src',
  "sort -S 1 --compress-program='touch' a",
  'GIT_CONFIG_KEY_0=core.fsmonitor git status',
  'HOME=/tmp/h git status',
  'XDG_CONFIG_HOME=/tmp/h git log',
  'git --exec-path=/tmp/bin status',
];

for (const c of allowed) test(`allows: ${c}`, () => assert.equal(reason(c), null, c));
for (const c of blocked) test(`blocks: ${c.split('\n').join(' ⏎ ')}`, () => assert.ok(reason(c), c));

test('bash-policy.mjs applies the read-only policy only to read-only agents', () => {
  const hook = fileURLToPath(new URL('./bash-policy.mjs', import.meta.url));
  const run = (agent_type, command) =>
    spawnSync(process.execPath, [hook], { input: JSON.stringify({ agent_type, tool_input: { command } }) }).status;
  for (const a of ['Plan', 'security-devops', 'lightweight-research']) {
    assert.equal(run(a, 'touch /tmp/x'), 2, a);
    assert.equal(run(a, 'git log -1'), 0, a);
  }
  assert.equal(run('frontend-specialist', 'echo hi > /tmp/allowed-for-writers'), 0);
  assert.equal(run(undefined, 'npm run build'), 0); // main session: only the push guard
  assert.equal(spawnSync(process.execPath, [hook], { input: 'not json' }).status, 2); // fail closed
});
