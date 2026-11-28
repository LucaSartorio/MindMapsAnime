#!/usr/bin/env node
/**
 * Single PreToolUse(Bash) entry point, wired in .claude/settings.json:
 *   1. every caller (main session and every sub-agent): git push guard (guard-bash.mjs);
 *   2. READ-ONLY sub-agents (identified by `agent_type` in the hook input): read-only allowlist (readonly-bash.mjs).
 * Why here and not in the agents' frontmatter `hooks:` — Claude Code skips the frontmatter hooks of project agents
 * until the folder is trusted, and `claude -p` never counts as trusted (verified 2026-11-16: the frontmatter hook did
 * not run, the settings hook did). Project settings hooks receive `agent_id`/`agent_type` for sub-agent tool calls.
 * Limits: not applied in Claude Code Projects cloud threads (repo settings ignored there); a guard-rail, not a
 * security boundary — the ruleset on `main` is (docs/SECURITY_SEC-02.md).
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONFINED_AGENTS } from './config-path-guard.mjs';
import { check as pushReason } from './guard-bash.mjs';
import { reason as readOnlyReason } from './readonly-bash.mjs';

/** Sub-agents whose Bash must stay read-only: the repo's read-only agents (kept in sync with .claude/agents by
 * `npm run claude:validate`) + the built-in `Plan` agent, which replaces the former code-architect for design work. */
export const READ_ONLY_AGENTS = new Set(['Plan', 'security-devops', 'lightweight-research', 'configuration-reviewer']);

/** Returns `[reason, source]` when the call must be blocked, else null. */
export function decide(input) {
  const command = input?.tool_input?.command;
  const agent = input?.agent_type;
  if (agent && READ_ONLY_AGENTS.has(agent)) {
    const r = readOnlyReason(command);
    if (r) return [`${r}. Agent ${agent} is read-only: report the change as a proposal instead`, 'readonly-bash'];
  }
  // Confined writers (config-path-guard.mjs): Edit/Write limited to an allowlist, so Bash must not write either.
  if (agent && CONFINED_AGENTS.has(agent)) {
    const r = readOnlyReason(command);
    if (r) return [`${r}. Agent ${agent} has read-only Bash: write configuration files with Edit/Write (path-guarded) or propose the command`, 'readonly-bash'];
  }
  const p = pushReason(command, { cwd: input?.cwd || process.cwd() });
  return p ? [`${p}. See .claude/rules/security.md and CLAUDE.md "Git & delivery"`, 'guard-bash'] : null;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  let input;
  try {
    input = JSON.parse(readFileSync(0, 'utf8') || '{}');
  } catch {
    process.stderr.write('[bash-policy] unreadable hook input: blocked\n');
    process.exit(2);
  }
  const verdict = decide(input);
  if (verdict) {
    process.stderr.write(`[${verdict[1]}] ${verdict[0]}.\n`);
    process.exit(2);
  }
  process.exit(0);
}
