#!/usr/bin/env node
/**
 * Read-only Bash policy for the READ-ONLY sub-agents (Plan, security-devops, lightweight-research),
 * applied by the PreToolUse hook `bash-policy.mjs` when `agent_type` is one of them. Their `tools:` allowlist already removes Edit/Write/MCP writers;
 * this closes the remaining gap: Bash can write (`sed -i`, `>`, `git commit`, `npm install`…).
 *
 * Policy = allowlist: every simple command (pipes, `&&`, `$(…)`, `bash -c` included) must be a known read-only
 * program/subcommand, and no output redirection is allowed except to /dev/null or between streams (`2>&1`).
 * `git fetch` is allowed (it only updates remote-tracking refs/FETCH_HEAD, never the work tree or local branches).
 * Tests: node --test .claude/hooks/readonly-bash.test.mjs
 */
import { basename, resolve } from 'node:path';
import { lex, programIndex, stripHeredocs } from './guard-bash.mjs';

const PROGRAMS = new Set(['ls', 'cat', 'head', 'tail', 'wc', 'grep', 'egrep', 'fgrep', 'rg', 'sort', 'uniq', 'cut', 'tr',
  'jq', 'diff', 'cmp', 'stat', 'file', 'du', 'df', 'pwd', 'echo', 'printf', 'true', 'false', 'basename', 'dirname',
  'realpath', 'readlink', 'which', 'type', 'date', 'tree', 'column', 'nl', 'comm', 'xxd', 'od', 'hexdump', 'test', '[',
  'seq', 'expr', 'sha256sum', 'sha1sum', 'md5sum', 'cd', 'export', 'set', 'find', 'sed', 'awk', 'git', 'npm', 'npx', 'node']);
const GIT_READ = new Set(['log', 'show', 'diff', 'status', 'rev-parse', 'ls-files', 'ls-tree', 'blame', 'grep', 'cat-file',
  'merge-base', 'describe', 'shortlog', 'for-each-ref', 'show-ref', 'name-rev', 'rev-list', 'count-objects', 'check-ignore',
  'var', 'version', 'help', 'fetch', 'branch', 'remote', 'config', 'tag', 'stash', 'reflog', 'worktree', 'ls-remote']);
/** npm scripts that only read or validate (no state, no generated files). */
export const NPM_READ = new Set(['validate:data', 'validate:i18n', 'test:seo', 'test:ci-scope', 'i18n:status', 'i18n:audit',
  'data:coverage', 'coverage:chapters', 'claude:validate', 'social:validate', 'social:state:test', 'social:growth:test',
  'social:publication:test', 'social:editorial:check', 'social:editorial:check:selection', 'social:publication:list',
  'social:analytics:list', 'social:publication:validate', 'social:analytics:validate', 'social:validate:queue']);
const NODE_SCRIPTS = new Set(['scripts/validate-claude-config.mjs', 'scripts/ci-site-scope.mjs']);

/** Replace quoted text with spaces so `rg "=>"` is not mistaken for a redirection. */
function maskQuotes(s) {
  return s.replace(/'[^']*'|"(?:\\.|[^"\\])*"/g, (m) => ' '.repeat(m.length));
}

function gitReason(args) {
  let i = 0;
  while (i < args.length && args[i].startsWith('-')) {
    // `-c key=value` / `--config-env` / `--exec-path` can point core.fsmonitor, diff.external, core.pager… at any
    // program, which then runs inside an otherwise read-only subcommand (verified with `status` and `diff`).
    if (args[i] === '-c' || /^--config-env(=|$)|^--exec-path=/.test(args[i])) return `git ${args[i]} can make git run arbitrary commands`;
    i += args[i] === '-C' ? 2 : 1;
  }
  const sub = args[i];
  const rest = args.slice(i + 1);
  const pos = rest.filter((a) => !a.startsWith('-'));
  if (!GIT_READ.has(sub)) return `git ${sub ?? ''} is not read-only`;
  const has = (...f) => rest.some((a) => f.some((x) => a === x || a.startsWith(x + '=')));
  if (sub === 'fetch' && rest.some((a) => a.includes(':'))) return 'git fetch into a local ref (refspec with ":") is not read-only';
  if (sub === 'branch' && pos.length && !has('--list', '-l', '--contains', '--merged', '--no-merged', '--points-at')) return 'git branch with a name creates/changes a branch';
  if (sub === 'branch' && has('-d', '-D', '-m', '-M', '-c', '-C', '--delete', '--move', '--copy', '--set-upstream-to', '-u', '--unset-upstream', '--edit-description')) return 'git branch modification is not read-only';
  if (sub === 'tag' && pos.length && !has('--list', '-l', '--contains', '--points-at')) return 'git tag with a name creates a tag';
  if (sub === 'tag' && has('-d', '--delete', '-a', '-s', '-f')) return 'git tag modification is not read-only';
  if (sub === 'config' && !has('--get', '--get-all', '--get-regexp', '--list', '-l', '--show-origin')) return 'git config without --get/--list writes configuration';
  if (sub === 'remote' && pos.length && !['show', 'get-url'].includes(pos[0])) return `git remote ${pos[0]} is not read-only`;
  if (sub === 'stash' && pos[0] !== 'list' && pos[0] !== 'show') return 'git stash (other than list/show) changes the work tree';
  if (sub === 'reflog' && pos.length && pos[0] !== 'show') return 'git reflog (other than show) is not read-only';
  if (sub === 'worktree' && pos[0] !== 'list') return 'git worktree (other than list) is not read-only';
  if ((sub === 'diff' || sub === 'log' || sub === 'show') && has('--output')) return `git ${sub} --output writes a file`;
  if (has('--ext-diff')) return 'git --ext-diff runs an external program';
  if (has('--upload-pack', '--receive-pack', '--exec') || (sub === 'ls-remote' && rest.includes('-u'))) return `git ${sub} with a custom pack program runs arbitrary commands`;
  if (sub === 'grep' && rest.some((a) => /^-O|^--open-files-in-pager/.test(a))) return 'git grep -O runs a pager program';
  return null;
}

/** Variables that make an allowed program run another program (git, pagers, node) or read another git config. */
const EXEC_ENV = /^(GIT_[A-Z0-9_]*|PAGER|LESSOPEN|LESSCLOSE|NODE_OPTIONS|HOME|XDG_CONFIG_HOME)=/;

/** Number of operands, skipping the values of the given options. */
function operands(args, valueOptions = []) {
  let n = 0;
  for (let k = 0; k < args.length; k++) {
    if (valueOptions.includes(args[k])) k++;
    else if (args[k] === '-' || !args[k].startsWith('-')) n++;
  }
  return n;
}

// sed: only addresses + print/delete/quit/hold-style commands and `s///` with flags g p i I m M N. Anything else
// (the `w`/`W` write and `e` execute commands, the `s///w`/`s///e` flags, `r`, blocks) is refused: fail closed.
const SED_ADDR = String.raw`(?:\d+(?:~\d+)?|\$|\/(?:\\.|[^\/\\\n])*\/[IM]?)`;
const SED_SUBST = String.raw`s([^\\\n\s])(?:\\.|(?!\1)[^\\\n])*\1(?:\\.|(?!\1)[^\\\n])*\1[gpiImM0-9]*`;
const SED_CMD = new RegExp(String.raw`\s*(?:${SED_ADDR}(?:\s*,\s*${SED_ADDR})?\s*!?\s*)?(?:[pPdDlnNxhHgGz=]|[qQ]\d*|${SED_SUBST})\s*(?:;|\n|$)`, 'y');
function sedScriptIsReadOnly(script) {
  for (let pos = 0; pos < script.trimEnd().length;) {
    SED_CMD.lastIndex = pos;
    const m = SED_CMD.exec(script);
    if (!m || !m[0].length) return false;
    pos += m[0].length;
  }
  return true;
}
function sedReason(args) {
  const scripts = [];
  let operand = null;
  for (let k = 0; k < args.length; k++) {
    const a = args[k];
    if (a === '--file' || a.startsWith('--file=') || /^-[a-zA-Z]*f/.test(a)) return 'sed -f runs a script file';
    if (a === '--expression' || /^-[a-zA-Z]*e$/.test(a)) scripts.push(args[++k] ?? '');
    else if (a.startsWith('--expression=')) scripts.push(a.slice(13));
    else if (!a.startsWith('-') && operand === null) operand = a;
  }
  if (!scripts.length && operand !== null) scripts.push(operand);
  return scripts.every(sedScriptIsReadOnly) ? null : 'sed script with commands other than print/delete/substitute (w, e, r…) is not read-only';
}

function commandReason(t) {
  const i = programIndex(t);
  if (i > 0 && basename(t[0]) === 'sudo') return 'sudo is not allowed';
  const prog = basename(t[i] ?? '');
  const args = t.slice(i + 1);
  const assigned = [...t.slice(0, i), ...(prog === 'export' ? args : [])].find((a) => EXEC_ENV.test(a)) ?? (EXEC_ENV.test(prog) ? prog : null);
  if (assigned) return `setting ${assigned.split('=')[0]} can make an allowed program run another one`;
  if (!prog) return null;
  if (/^[A-Za-z_]\w*=/.test(prog)) return null;
  if (['bash', 'sh', 'zsh', 'dash'].includes(prog)) {
    const c = args.indexOf('-c');
    return c >= 0 && args[c + 1] ? reason(args[c + 1]) : `${prog} without -c is not allowed`;
  }
  if (!PROGRAMS.has(prog)) return `${prog} is not in the read-only allowlist`;
  if (prog === 'find' && args.some((a) => /^-(delete|exec|execdir|ok|okdir|fprint0?|fprintf|fls)$/.test(a))) return 'find with -delete/-exec/-fprint is not read-only';
  if (prog === 'sed' && args.some((a) => a === '--in-place' || a.startsWith('--in-place=') || /^-[a-zA-Z]*i/.test(a))) return 'sed -i edits files';
  if (prog === 'sed') { const r = sedReason(args); if (r) return r; }
  if (prog === 'sort' && args.some((a) => a === '--output' || a.startsWith('--output=') || /^-[a-zA-Z]*o/.test(a))) return 'sort -o writes a file';
  if (prog === 'sort' && args.some((a) => a.startsWith('--compress-program'))) return 'sort --compress-program runs a program';
  if (prog === 'rg' && args.some((a) => a === '--pre' || a.startsWith('--pre='))) return 'rg --pre runs a program on every file';
  if (prog === 'tree' && args.some((a) => a === '-o')) return 'tree -o writes a file';
  if (prog === 'uniq' && operands(args, ['-f', '-s', '-w']) > 1) return 'uniq with an OUTPUT operand writes a file';
  if (prog === 'xxd' && operands(args, ['-c', '-g', '-l', '-o', '-s', '-n', '-cols', '-groupsize', '-len', '-seek', '-name']) > 1) return 'xxd with an outfile writes a file';
  if (prog === 'awk' && args.some((a) => /system\s*\(|print[^|]*>|\|\s*getline|fflush/.test(a))) return 'awk script that writes or runs commands';
  if (prog === 'git') return gitReason(args);
  if (prog === 'npm') {
    const a = args.filter((x) => x !== '-s' && x !== '--silent');
    if (a[0] === 'run' || a[0] === 'run-script') return NPM_READ.has(a[1]) ? null : `npm run ${a[1]} is not a read-only script`;
    if (['ls', 'list', 'view', 'outdated', 'why', 'explain', '--version', '-v'].includes(a[0])) return null;
    if (a[0] === 'audit' && !a.includes('fix')) return null;
    return `npm ${a[0] ?? ''} is not read-only`;
  }
  if (prog === 'npx') {
    const a = args.filter((x) => x !== '--no-install' && x !== '--no');
    if (a[0] === 'tsc' && (a.includes('--noEmit') || a.includes('-b') || a.includes('--build'))) return null;
    return `npx ${a[0] ?? ''} is not read-only`;
  }
  if (prog === 'node') {
    if (args[0] === '--test') return null;
    if (args[0] && NODE_SCRIPTS.has(args[0].replace(/^\.\//, ''))) return null;
    if (['--version', '-v'].includes(args[0])) return null;
    return 'node: only `node --test …` and the repo validators are allowed';
  }
  return null;
}

/** Returns a reason string if the command is not read-only, else null. */
export function reason(command) {
  if (typeof command !== 'string' || !command.trim()) return null;
  const text = stripHeredocs(command);
  if (/<<-?\s*['"]?[\w.-]+/.test(command) && />/.test(maskQuotes(command.split('\n')[0]).replace(/<</g, ''))) {
    return 'writing a heredoc to a file is not read-only';
  }
  // Harmless redirections (to /dev/null, between streams) are removed before checking for writes.
  const harmless = (s) => s.replace(/&>>?\s*\/dev\/null/g, '').replace(/\d*>>?\s*\/dev\/null/g, '').replace(/\d*>&\d/g, '');
  const masked = harmless(maskQuotes(text)).replace(/<\(/g, '(');
  if (/>/.test(masked)) return 'output redirection to a file is not read-only';
  const { commands, subs } = lex(harmless(text));
  for (const s of subs) { const r = reason(s); if (r) return r; }
  for (const t of commands) {
    const r = commandReason(t);
    if (r) return r;
  }
  return null;
}
