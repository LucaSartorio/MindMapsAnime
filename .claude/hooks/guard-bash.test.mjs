import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { check } from './guard-bash.mjs';

/** Throwaway repo on `branch`, remote `origin` (never contacted), optional upstream/config. */
function repo(branch, { upstream = branch, config = {} } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'guard-bash-'));
  const g = (...a) => assert.equal(spawnSync('git', ['-C', dir, ...a]).status, 0, a.join(' '));
  g('init', '-q', '-b', branch);
  g('-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-q', '--allow-empty', '-m', 'init');
  g('remote', 'add', 'origin', 'https://example.invalid/repo.git');
  g('config', `branch.${branch}.remote`, 'origin');
  g('config', `branch.${branch}.merge`, `refs/heads/${upstream}`);
  for (const [k, v] of Object.entries(config)) g('config', k, v);
  return dir;
}

const repos = {
  main: repo('main'),
  feat: repo('feat/x'),
  featTracksMain: repo('feat/y', { upstream: 'main' }),
  matching: repo('feat/z', { config: { 'push.default': 'matching' } }),
  remotePush: repo('feat/w', { config: { 'remote.origin.push': 'refs/heads/feat/w:refs/heads/main' } }),
  aliases: repo('feat/a', { config: { 'alias.ship': 'push origin HEAD:main', 'alias.p': '!git push origin main', 'alias.st': 'status' } }),
};
process.on('exit', () => { for (const d of Object.values(repos)) rmSync(d, { recursive: true, force: true }); });

const blocked = [
  // implicit targets resolved from the repo state
  ['main', 'git push'],
  ['main', 'git push origin'],
  ['main', 'git push origin HEAD'],
  ['main', 'git push -u origin HEAD'],
  ['main', 'git push origin @'],
  ['main', 'git push --force-with-lease'],
  ['main', 'git push --force-with-lease origin HEAD'],
  ['featTracksMain', 'git push'],
  ['featTracksMain', 'git push origin'],
  ['matching', 'git push'],
  ['remotePush', 'git push origin'],
  ['feat', `git -C ${repos.main} push`],
  ['feat', `cd ${repos.main} && git push`],
  // explicit targets and refspecs
  ['feat', 'git push origin main'],
  ['feat', 'git push origin HEAD:main'],
  ['feat', 'git push origin HEAD:refs/heads/main'],
  ['feat', 'git push origin feat/x:main'],
  ['feat', 'git push origin feat/x:master'],
  ['feat', 'git push -o ci.skip origin main'],
  ['feat', 'git push --push-option ci.skip origin HEAD:main'],
  ['feat', 'git push --force-with-lease=main:abc123 origin HEAD:main'],
  // force / mass / delete
  ['feat', 'git push --force origin feat/x'],
  ['feat', 'git push -f origin feat/x'],
  ['feat', 'git push -uf origin feat/x'],
  ['feat', 'git push origin +feat/x'],
  ['feat', 'git push --all origin'],
  ['feat', 'git push --branches origin'],
  ['feat', 'git push --mirror origin'],
  ['feat', 'git push --prune origin'],
  ['feat', 'git push origin --delete feat/x'],
  ['feat', 'git push -d origin feat/x'],
  ['feat', 'git push origin :feat/x'],
  ['feat', "git push origin 'refs/heads/*:refs/heads/*'"],
  // wrappers, shells, substitution, paths
  ['feat', 'bash -c "git push origin main"'],
  ['feat', "sh -c 'cd /tmp && git push -f origin feat/x'"],
  ['feat', 'eval git push origin main'],
  ['feat', 'echo "$(git push origin main)"'],
  ['feat', 'x=`git push origin main`'],
  ['feat', '/usr/bin/git push origin main'],
  ['feat', 'sudo -u bot git push origin main'],
  ['feat', 'env GIT_TRACE=1 git push origin main'],
  ['feat', 'GIT_TRACE=1 git push origin main'],
  ['feat', 'timeout 60 git push --force origin feat/x'],
  ['feat', 'git -c core.pager=cat push origin main'],
  ['feat', '(git push origin main)'],
  ['feat', "cat <<'EOF' > notes.md\ntext\nEOF\ngit push origin main"],
  // aliases
  ['aliases', 'git ship'],
  ['aliases', 'git p'],
  // ANSI-C quoting: `\'` does not end $'…' in bash; before the 2026-11-18 hotfix the lexer ended it there, swallowed
  // the next command as quoted text and decoded nothing (bash -n accepts all of these)
  ['feat', `echo $'\\''; git push --force origin feat/x; echo "'"`],
  ['feat', `echo $'\\''; git push origin main #'`],
  ['feat', "git push origin $'ma\\x69n'"],
  ['feat', "git push origin $'main'"],
  ['feat', "git push $'--force' origin feat/x"],
  ['feat', "$'\\x67it' $'\\x70\\x75sh' origin main"],
  ['feat', "bash -c $'git push --force origin main'"],
  ['feat', "git push $'\\455\\455force' origin feat/x"], // octal > 0377: bash keeps the low byte, \455 = '-'
  // values the guard cannot see: command substitution and parameters in push arguments
  ['feat', 'git push origin $(echo main)'],
  ['feat', 'git push origin "$(echo main)"'],
  ['feat', 'git push origin `echo main`'],
  ['feat', 'git push $(echo --force) origin feat/x'],
  ['feat', 'B=main; git push origin $B'],
  ['feat', 'git push origin "${B}"'],
  // directory decided at run time: implicit or HEAD pushes cannot be resolved (`cd $(…)` was a regression of the
  // placeholder above; `cd "$HOME"`, `cd -` were already unchecked)
  ['main', 'cd $(git rev-parse --show-toplevel) && git push'],
  ['main', 'git -C "$(pwd)" push'],
  ['main', 'cd "$HOME" && cd - && git push'],
  ['main', 'cd ~/repo && git push origin HEAD'],
  ['aliases', 'git -C "$(pwd)" ship'],
];
const allowed = [
  ['feat', 'git push'],
  ['feat', 'git push origin'],
  ['feat', 'git push -u origin HEAD'],
  ['feat', 'git push -u origin feat/x'],
  ['feat', 'git push --force-with-lease origin feat/x'],
  ['feat', 'git push -o ci.skip origin feat/x'],
  ['feat', 'git push origin --tags'],
  ['feat', 'git push origin feat/x:feat/x-backup'],
  ['aliases', 'git st'],
  ['main', 'git status && git diff'],
  ['main', 'git fetch origin main && git merge --no-edit FETCH_HEAD'],
  ['main', 'git log --oneline main..HEAD'],
  ['main', 'npm run build'],
  ['main', 'echo "git push origin main"'],
  ['main', "grep -n 'git push origin main' docs/x.md"],
  ['main', 'rg "push.*main" .claude'],
  ['main', "python3 - <<'EOF'\ns = 'git push --dry-run origin HEAD:main'\nEOF"],
  ['main', "cat > f.md <<EOF\n  git push --force origin main\nEOF"],
  // ANSI-C strings and substitutions outside `git push` stay allowed
  ['main', "printf $'a\\tb\\n'"],
  ['main', "echo $'it\\'s'"],
  ['feat', "git push origin feat/x && echo $'done\\n'"],
  ['main', "IFS=$'\\n'; git log --oneline -3"],
  ['main', 'git log $(git merge-base HEAD origin/main)..HEAD'],
  ['main', 'echo "branch: $(git rev-parse --abbrev-ref HEAD)"'],
  ['feat', 'cd $(git rev-parse --show-toplevel) && git push origin feat/x'],
  ['feat', 'cd "$HOME" && git status'],
  ['main', 'git -C "$(pwd)" log -1'],
];

for (const [r, c] of blocked) test(`blocks [${r}] ${c.split('\n').join(' ⏎ ')}`, () => assert.ok(check(c, { cwd: repos[r] }), c));
for (const [r, c] of allowed) test(`allows [${r}] ${c.split('\n').join(' ⏎ ')}`, () => assert.equal(check(c, { cwd: repos[r] }), null, c));

test('hook process (bash-policy.mjs): exit 2 on a blocked push (cwd from the payload), 0 otherwise', () => {
  const hook = fileURLToPath(new URL('./bash-policy.mjs', import.meta.url));
  const run = (command, cwd) =>
    spawnSync(process.execPath, [hook], { input: JSON.stringify({ tool_name: 'Bash', cwd, tool_input: { command } }) });
  assert.equal(run('git push', repos.main).status, 2);
  assert.equal(run('git push', repos.feat).status, 0);
  assert.equal(run('git push origin main', repos.feat).status, 2);
  // the push guard applies to sub-agents too, whatever their type
  assert.equal(spawnSync(process.execPath, [hook], { input: JSON.stringify({ agent_type: 'frontend-specialist', cwd: repos.feat, tool_input: { command: 'git push origin main' } }) }).status, 2);
});
