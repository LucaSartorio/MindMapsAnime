#!/usr/bin/env node
/**
 * PreToolUse(Edit|Write|NotebookEdit) guard, wired in .claude/settings.json: confines the file writes of the
 * CONFINED_AGENTS (the auto-config `configuration-manager`) to the Claude Code configuration it may change, and keeps
 * it away from the files that govern or protect it. Other callers pass through untouched (exit 0 in ~40 ms).
 *
 * A write is allowed only if BOTH the requested path and its real path (symlinks resolved on the deepest existing
 * ancestor) are inside the project, match ALLOWED and match no PROTECTED pattern. Only text/config extensions are
 * writable: executable code (scripts, hooks, tests) is proposed in the report and written by the main session.
 * Bash writes are closed separately: bash-policy.mjs applies the read-only policy to CONFINED_AGENTS.
 * Limits: a guard-rail for Claude Code sessions (repo settings are ignored in Projects threads); the boundaries that
 * hold for everyone are CODEOWNERS + review, and `claude:validate` (security-posture snapshot) in Site CI.
 * Tests: node --test .claude/hooks/config-path-guard.test.mjs
 */
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Sub-agents whose Edit/Write is confined here (and whose Bash is read-only, see bash-policy.mjs). */
export const CONFINED_AGENTS = new Set(['configuration-manager']);

/** Repo-relative POSIX patterns: `*` = one path segment, `**` = any depth. */
export const ALLOWED = ['.claude/agents/**/*.md', '.claude/skills/**', 'docs/claude-config/**', 'docs/CLAUDE_DEVELOPMENT_SYSTEM.md'];
export const PROTECTED = [
  '.claude/agents/configuration-manager.md', // its own instructions
  '.claude/agents/configuration-reviewer.md', // the independent reviewer
  '.claude/agents/security-devops.md', // the security reviewer
  '.claude/skills/auto-config/**', // the procedure, policy, sources allowlist and scripts that govern it
];
const WRITABLE_EXT = /\.(md|json|txt|ya?ml)$/i;

export function globToRegExp(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*' && glob[i + 1] === '*') { re += glob[i + 2] === '/' ? '(?:.*/)?' : '.*'; i += glob[i + 2] === '/' ? 2 : 1; }
    else if (c === '*') re += '[^/]*';
    else re += c.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^${re}$`);
}
const ALLOWED_RE = ALLOWED.map(globToRegExp);
const PROTECTED_RE = PROTECTED.map(globToRegExp);

/** Real path of `p`, resolving symlinks on the deepest ancestor that exists (the file itself may not exist yet). */
function realish(p) {
  let cur = p;
  const tail = [];
  while (!existsSync(cur)) {
    const up = dirname(cur);
    if (up === cur) return p;
    tail.unshift(basename(cur));
    cur = up;
  }
  return join(realpathSync(cur), ...tail);
}

/** Returns a reason when `filePath` must not be written by a confined agent, else null. */
export function pathReason(filePath, root) {
  if (typeof filePath !== 'string' || !filePath || filePath.includes('\0')) return 'missing or invalid file path';
  const realRoot = realpathSync(root);
  const abs = isAbsolute(filePath) ? resolve(filePath) : resolve(root, filePath);
  const candidates = new Set([relative(resolve(root), abs), relative(realRoot, abs), relative(realRoot, realish(abs))]);
  for (const rel of candidates) {
    const posix = rel.split(sep).join('/');
    if (!posix || posix.startsWith('..') || isAbsolute(rel)) return `${filePath} is outside the project`;
    if (PROTECTED_RE.some((r) => r.test(posix))) return `${posix} is protected (changes to the auto-config protections need the owner: report a proposal)`;
    if (!ALLOWED_RE.some((r) => r.test(posix))) return `${posix} is outside the configuration-manager allowlist (${ALLOWED.join(', ')})`;
    if (!WRITABLE_EXT.test(posix)) return `${posix}: only .md/.json/.txt/.yaml files are writable (propose executable code in the report)`;
  }
  return null;
}

export function decide(input, env = process.env) {
  const agent = input?.agent_type;
  if (!agent || !CONFINED_AGENTS.has(agent)) return null;
  const ti = input.tool_input ?? {};
  const target = ti.file_path ?? ti.notebook_path;
  const root = env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
  try {
    return pathReason(target, root);
  } catch (e) {
    return `cannot resolve ${target}: ${e.message}`;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  let input;
  try {
    input = JSON.parse(readFileSync(0, 'utf8') || '{}');
  } catch {
    process.stderr.write('[config-path-guard] unreadable hook input: blocked\n');
    process.exit(2);
  }
  const r = decide(input);
  if (r) {
    process.stderr.write(`[config-path-guard] ${r}. Agent ${input.agent_type} may only edit agent/skill definitions and docs/claude-config/.\n`);
    process.exit(2);
  }
  process.exit(0);
}
