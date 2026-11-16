#!/usr/bin/env node
/**
 * PreToolUse hook (Bash) — blocks the few git commands that can destroy shared history or bypass review:
 *   - `git push` with `--force` / `-f` / `+refspec` (`--force-with-lease` stays allowed: it is the documented
 *     recovery path after a merged PR and cannot silently drop others' commits);
 *   - `git push` that targets `main`/`master` (feature branches only; the State Bot pushes from CI, not here);
 *   - `git push --mirror` / `--delete` / `:branch` deletions.
 * Exit 2 = block (stderr is shown to Claude). Anything else exits 0 immediately: the hook must stay cheap.
 * Prefix permission rules can be sidestepped (`git -C . push`), so this parses the command instead.
 * Tests: node --test .claude/hooks/guard-bash.test.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const PROTECTED = new Set(['main', 'master']);

/** Remove heredoc bodies: text written to a file (docs mentioning `git push`) is data, not a command. */
function stripHeredocs(command) {
  return command.replace(/<<-?\s*(['"]?)(\w+)\1[^\n]*\n[\s\S]*?\n\s*\2\s*(?=\n|$)/g, '');
}

/** Split a shell line into simple commands (good enough for policy checks, not a full shell parser). */
function segments(command) {
  return stripHeredocs(command).split(/\|\||&&|;|\||&|\n|\$\(|`/).map((s) => s.trim()).filter(Boolean);
}

/** Leading tokens that still run the following command (env assignments, wrappers). */
const WRAPPERS = new Set(['sudo', 'command', 'builtin', 'nohup', 'time', 'nice', 'exec', 'env']);

/** Returns a reason string if the command must be blocked, else null. */
export function check(command) {
  if (typeof command !== 'string' || !/\bgit\b/.test(command) || !/\bpush\b/.test(command)) return null;
  for (const seg of segments(command)) {
    const words = seg.split(/\s+/).map((w) => w.replace(/^['"(]+|['")]+$/g, ''));
    // `git` must be the command itself (after env assignments / wrappers), not an argument of echo/grep/…
    let gi = 0;
    while (gi < words.length && (WRAPPERS.has(words[gi]) || /^[A-Za-z_]\w*=/.test(words[gi]))) gi++;
    if (words[gi] === 'timeout') gi += 2;
    if (words[gi] !== 'git') continue;
    // skip global options like `-C dir`, `-c k=v`, `--git-dir=…` until the subcommand
    let i = gi + 1;
    while (i < words.length && words[i].startsWith('-')) i += words[i] === '-C' || words[i] === '-c' ? 2 : 1;
    if (words[i] !== 'push') continue;
    const args = words.slice(i + 1);
    for (const a of args) {
      if (a === '--force' || a === '-f' || /^-[a-zA-Z]*f[a-zA-Z]*$/.test(a) && !a.startsWith('--')) {
        return 'force push is blocked (use a normal push, or --force-with-lease only for the documented merged-PR case)';
      }
      if (a === '--mirror' || a === '--delete' || a === '-d') return `git push ${a} is blocked`;
    }
    const positional = args.filter((a) => !a.startsWith('-'));
    // positional[0] = remote, the rest = refspecs
    for (const ref of positional.slice(1)) {
      if (ref.startsWith('+')) return 'force push via +refspec is blocked';
      if (ref.startsWith(':')) return 'deleting a remote branch is blocked';
      const dst = ref.includes(':') ? ref.split(':').pop() : ref;
      const name = dst.replace(/^refs\/heads\//, '');
      if (PROTECTED.has(name)) return `pushing to ${name} is blocked: work on a feature branch and open a PR`;
    }
  }
  return null;
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  let input = {};
  try {
    input = JSON.parse(readFileSync(0, 'utf8') || '{}');
  } catch {
    process.exit(0);
  }
  const reason = check(input?.tool_input?.command);
  if (reason) {
    process.stderr.write(`[guard-bash] ${reason}. See .claude/rules/security.md and CLAUDE.md "Git & delivery".\n`);
    process.exit(2);
  }
  process.exit(0);
}
