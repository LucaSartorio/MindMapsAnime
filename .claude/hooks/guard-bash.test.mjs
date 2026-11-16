import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { check } from './guard-bash.mjs';

const blocked = [
  'git push --force origin feat/x',
  'git push -f origin feat/x',
  'git push -uf origin feat/x',
  'git push origin +feat/x',
  'git push origin main',
  'git push origin HEAD:main',
  'git push origin HEAD:refs/heads/main',
  'git -C . push origin master',
  'cd repo && git push origin main',
  'GIT_TRACE=1 git push origin main',
  'timeout 60 git push --force origin feat/x',
  '(git push origin main)',
  "cat <<'EOF' > notes.md\ntext\nEOF\ngit push origin main",
  'git push --mirror origin',
  'git push origin --delete feat/x',
  'git push origin :feat/x',
];
const allowed = [
  'git push -u origin claude/upbeat-gauss-77j6h8',
  'git push --force-with-lease origin claude/x',
  'git push',
  'git status && git diff',
  'npm run build',
  'git log --oneline main..HEAD',
  'echo "push to main later"',
  'echo "git push origin main"',
  'grep -n "git push origin main" docs/x.md',
  "python3 - <<'EOF'\ns = 'git push --dry-run origin HEAD:main'\nEOF",
  "cat > f.md <<EOF\n  git push --force origin main\nEOF",
  'git fetch origin main && git merge --no-edit FETCH_HEAD',
];

for (const c of blocked) test(`blocks: ${c}`, () => assert.ok(check(c), c));
for (const c of allowed) test(`allows: ${c}`, () => assert.equal(check(c), null, c));

test('hook process exits 2 on a blocked command and 0 otherwise', () => {
  const hook = fileURLToPath(new URL('./guard-bash.mjs', import.meta.url));
  const run = (command) =>
    spawnSync(process.execPath, [hook], { input: JSON.stringify({ tool_name: 'Bash', tool_input: { command } }) });
  assert.equal(run('git push origin main').status, 2);
  assert.equal(run('git push -u origin feat/x').status, 0);
  assert.equal(spawnSync(process.execPath, [hook], { input: 'not json' }).status, 0);
});
