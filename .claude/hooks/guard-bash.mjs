#!/usr/bin/env node
/**
 * Git push guard (library for the PreToolUse Bash hook `bash-policy.mjs`) — blocks git pushes that could rewrite or update a protected branch, or delete branches:
 *   - force: `--force`, `-f` (also combined, e.g. `-uf`), `+refspec`. `--force-with-lease` stays allowed on feature
 *     branches (documented recovery path after a merged PR) but is blocked like any push when the target is protected;
 *   - target `main`/`master`, explicit (`main`, `HEAD:main`, `refs/heads/main`) or IMPLICIT: `git push`,
 *     `git push origin`, `git push origin HEAD|@` resolved from the repo state (current branch, its upstream,
 *     `push.default`, `remote.<name>.push`);
 *   - mass/destructive pushes: `--all`, `--branches`, `--mirror`, `--prune`, `--delete`/`-d`, `:branch`, wildcard refspecs.
 * Also sees through `bash|sh -c "…"`, `eval …`, `$(…)`/backticks, wrappers (`sudo`, `env`, `timeout`, `xargs`…),
 * `/usr/bin/git`, `git -C <dir>`, `cd <dir> && …` and git aliases (`git config alias.x`, `!shell` aliases).
 * Heredoc bodies and quoted arguments of other programs are data, not commands.
 *
 * This is a guard-rail for agents in THIS session, not a security boundary: an agent can still push through the
 * GitHub API or another tool. The real protection of `main` is the repository ruleset (docs/SECURITY_SEC-02.md).
 * Library used by bash-policy.mjs (the hook entry point). Commands without "git"/"push" return immediately.
 * Tests: node --test .claude/hooks/guard-bash.test.mjs
 */
import { spawnSync } from 'node:child_process';
import { basename, resolve } from 'node:path';

export const PROTECTED = new Set(['main', 'master']);
const SHELLS = new Set(['bash', 'sh', 'zsh', 'dash', 'ksh']);
const WRAPPERS = new Set(['sudo', 'command', 'builtin', 'nohup', 'time', 'nice', 'exec', 'env', 'stdbuf', 'ionice', 'xargs']);
/** git builtins we never need to resolve as aliases (cheap path). */
const GIT_BUILTINS = new Set(['status', 'diff', 'log', 'show', 'add', 'commit', 'fetch', 'pull', 'merge', 'rebase',
  'checkout', 'switch', 'branch', 'tag', 'stash', 'reset', 'restore', 'rm', 'mv', 'init', 'clone', 'remote', 'config',
  'rev-parse', 'ls-files', 'blame', 'grep', 'cherry-pick', 'revert', 'worktree', 'submodule', 'describe', 'shortlog',
  'reflog', 'cat-file', 'merge-base', 'for-each-ref', 'show-ref', 'symbolic-ref', 'ls-remote', 'apply', 'am', 'bisect',
  'clean', 'gc', 'notes', 'archive', 'help', 'version', 'push']);
/** `git push` options that take a separate value. */
const PUSH_VALUE_OPTS = new Set(['-o', '--push-option', '--repo', '--receive-pack', '--exec']);

/** Default git runner: `git -C dir …` → trimmed stdout, or null on failure. */
function runGit(dir, args) {
  const r = spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8', timeout: 3000 });
  return r.status === 0 ? r.stdout.trim() : null;
}

/** Remove heredoc bodies: text written to a file (docs mentioning `git push`) is data. */
export function stripHeredocs(s) {
  return s.replace(/<<-?\s*(['"]?)([\w.-]+)\1[^\n]*\n[\s\S]*?\n[ \t]*\2[ \t]*(?=\n|$)/g, '');
}

/**
 * Quote-aware lexer: returns simple commands as token arrays, plus the bodies of command substitutions
 * (`$(…)`, backticks — they run even inside double quotes) to be checked recursively.
 */
export function lex(input) {
  const commands = [];
  const subs = [];
  let tokens = [];
  let cur = '';
  let has = false;
  const pushTok = () => { if (has) tokens.push(cur); cur = ''; has = false; };
  const endCmd = () => { pushTok(); if (tokens.length) commands.push(tokens); tokens = []; };
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === "'") { const j = input.indexOf("'", i + 1); const e = j < 0 ? input.length : j; cur += input.slice(i + 1, e); has = true; i = e; continue; }
    if (c === '\\' && i + 1 < input.length) { cur += input[i + 1]; has = true; i++; continue; }
    if (c === '$' && input[i + 1] === '(' || c === '`') {
      // command substitution: capture its body (balanced parens / matching backtick)
      let j = i + (c === '`' ? 1 : 2), depth = 1;
      const start = j;
      if (c === '`') { while (j < input.length && input[j] !== '`') j++; subs.push(input.slice(start, j)); i = j; continue; }
      for (; j < input.length && depth; j++) { if (input[j] === '(') depth++; else if (input[j] === ')') depth--; }
      subs.push(input.slice(start, j - 1)); i = j - 1; has = true; continue;
    }
    if (c === '"') {
      let j = i + 1;
      for (; j < input.length && input[j] !== '"'; j++) {
        if (input[j] === '\\' && j + 1 < input.length) { cur += input[++j]; continue; }
        if (input[j] === '$' && input[j + 1] === '(' || input[j] === '`') {
          const open = input[j];
          let k = j + (open === '`' ? 1 : 2), depth = 1;
          const st = k;
          if (open === '`') { while (k < input.length && input[k] !== '`') k++; subs.push(input.slice(st, k)); j = k; continue; }
          for (; k < input.length && depth; k++) { if (input[k] === '(') depth++; else if (input[k] === ')') depth--; }
          subs.push(input.slice(st, k - 1)); j = k - 1; continue;
        }
        cur += input[j];
      }
      has = true; i = j; continue;
    }
    if (c === ';' || c === '\n' || c === '|' || c === '&' || c === '(' || c === ')' || c === '{' || c === '}') { endCmd(); continue; }
    if (c === ' ' || c === '\t') { pushTok(); continue; }
    cur += c; has = true;
  }
  endCmd();
  return { commands, subs };
}

/** Strip env assignments and wrappers (with their options) → index of the real program. */
export function programIndex(t) {
  let i = 0;
  while (i < t.length) {
    const w = basename(t[i]);
    if (/^[A-Za-z_]\w*=/.test(t[i])) { i++; continue; }
    if (w === 'timeout') { i++; while (i < t.length && t[i].startsWith('-')) i++; i++; continue; }
    if (WRAPPERS.has(w)) {
      i++;
      while (i < t.length && t[i].startsWith('-')) i += ['-u', '-g', '-n', '-I', '-L', '-P', '-n'].includes(t[i]) ? 2 : 1;
      continue;
    }
    break;
  }
  return i;
}

function refName(r) { return r.replace(/^refs\/heads\//, ''); }

/** Check one `git push` invocation; `args` = tokens after `push`. */
function checkPush(args, dir, git) {
  const opts = [];
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (PUSH_VALUE_OPTS.has(a)) { i++; continue; }
    if (a.startsWith('-') && a !== '-') opts.push(a); else positional.push(a);
  }
  for (const o of opts) {
    if (o === '--force' || o === '-f' || (/^-[A-Za-z]+$/.test(o) && o.includes('f'))) return 'force push is blocked (use --force-with-lease, only on a feature branch)';
    if (['--mirror', '--all', '--branches', '--prune', '--delete', '-d'].includes(o) || (/^-[A-Za-z]+$/.test(o) && o.includes('d')))
      return `git push ${o} is blocked (can update or delete protected branches)`;
  }
  const refspecs = positional.slice(1);
  const current = () => git(dir, ['symbolic-ref', '--short', '-q', 'HEAD']);
  const checkRefspec = (spec) => {
    if (spec.startsWith('+')) return 'force push via +refspec is blocked';
    if (spec.startsWith(':')) return 'deleting a remote branch is blocked';
    if (spec.includes('*')) return 'wildcard refspecs are blocked';
    let [src, dst] = spec.includes(':') ? spec.split(':') : [spec, undefined];
    if (dst === undefined) dst = src === 'HEAD' || src === '@' ? current() ?? '' : src;
    const name = refName(dst);
    if (PROTECTED.has(name)) return `pushing to ${name} is blocked: work on a feature branch and open a PR`;
    return null;
  };
  if (refspecs.length) {
    for (const s of refspecs) { const r = checkRefspec(s); if (r) return r; }
    return null;
  }
  // Implicit push: resolve what git would push.
  const remote = positional[0] ?? (() => { const b = current(); return (b && git(dir, ['config', '--get', `branch.${b}.remote`])) || 'origin'; })();
  const configured = git(dir, ['config', '--get-all', `remote.${remote}.push`]);
  if (configured) {
    for (const s of configured.split('\n')) { const r = checkRefspec(s.trim()); if (r) return `${r} (remote.${remote}.push)`; }
    return null;
  }
  const mode = git(dir, ['config', '--get', 'push.default']) ?? 'simple';
  if (mode === 'nothing') return null;
  if (mode === 'matching') return 'implicit push with push.default=matching can update main: name the branch explicitly';
  const b = current();
  if (!b) return null; // detached HEAD: git refuses an implicit push
  if (PROTECTED.has(b)) return `implicit push from ${b} is blocked: you are on ${b}, use a feature branch`;
  const merge = git(dir, ['config', '--get', `branch.${b}.merge`]);
  if (merge && PROTECTED.has(refName(merge)) && mode !== 'current')
    return `implicit push is blocked: branch ${b} tracks ${refName(merge)}; push with an explicit refspec`;
  return null;
}

/** Returns a reason string if the command must be blocked, else null. */
export function check(command, { cwd = process.cwd(), git = runGit, depth = 0 } = {}) {
  if (typeof command !== 'string' || depth > 4) return null;
  if (!/\bgit\b|push/.test(command)) return null;
  const { commands, subs } = lex(stripHeredocs(command));
  for (const s of subs) { const r = check(s, { cwd, git, depth: depth + 1 }); if (r) return r; }
  let dir = cwd;
  for (const t of commands) {
    let i = programIndex(t);
    const prog = basename(t[i] ?? '');
    if (prog === 'cd') { if (t[i + 1]) dir = resolve(dir, t[i + 1]); continue; }
    if (SHELLS.has(prog)) {
      const c = t.indexOf('-c', i);
      if (c > 0 && t[c + 1]) { const r = check(t[c + 1], { cwd: dir, git, depth: depth + 1 }); if (r) return r; }
      continue;
    }
    if (prog === 'eval') { const r = check(t.slice(i + 1).join(' '), { cwd: dir, git, depth: depth + 1 }); if (r) return r; continue; }
    if (prog !== 'git') continue;
    let gdir = dir;
    i++;
    while (i < t.length && t[i].startsWith('-')) {
      if (t[i] === '-C') { gdir = resolve(gdir, t[i + 1] ?? '.'); i += 2; continue; }
      i += t[i] === '-c' ? 2 : 1;
    }
    let sub = t[i];
    let rest = t.slice(i + 1);
    if (sub && !GIT_BUILTINS.has(sub)) {
      const alias = git(gdir, ['config', '--get', `alias.${sub}`]);
      if (alias) {
        if (alias.startsWith('!')) { const r = check(alias.slice(1) + ' ' + rest.join(' '), { cwd: gdir, git, depth: depth + 1 }); if (r) return r; continue; }
        const at = lex(alias).commands[0] ?? [];
        sub = at[0];
        rest = [...at.slice(1), ...rest];
      }
    }
    if (sub !== 'push') continue;
    const r = checkPush(rest, gdir, git);
    if (r) return r;
  }
  return null;
}
