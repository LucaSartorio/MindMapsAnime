#!/usr/bin/env node
/**
 * PreToolUse(Edit|Write|NotebookEdit) guard, wired in .claude/settings.json: confines the file writes of the
 * CONFINED_AGENTS (the auto-config `configuration-manager`) to the Claude Code configuration it may change, and keeps
 * it away from the files that govern or protect it. Other callers pass through untouched (exit 0 in ~40 ms).
 *
 * A write is allowed only if BOTH the requested path and its real path (symlinks resolved on the deepest existing
 * ancestor) are inside the project, match ALLOWED and match no PROTECTED pattern. Only text/config extensions are
 * writable: executable code (scripts, hooks, tests) is proposed in the report and written by the main session.
 * Matching is case-insensitive (macOS/Windows filesystems), segments ending in `.`/space or containing `:`/`~` (Windows
 * aliases, alternate streams, 8.3 names) and any symlink inside the project path are refused. In agent and skill files,
 * frontmatter that grants or routes power (permissionMode, hooks, mcpServers, allowed-tools, context/agent, a
 * protected `name`, `Agent`/MCP tools) and inline shell (`!` blocks) cannot be added or changed: propose them.
 * Bash writes are closed separately: bash-policy.mjs applies the read-only policy to CONFINED_AGENTS.
 * Limits: a guard-rail for Claude Code sessions (repo settings are ignored in Projects threads); the boundaries that
 * hold for everyone are CODEOWNERS + review, and `claude:validate` (security-posture snapshot) in Site CI.
 * Tests: node --test .claude/hooks/config-path-guard.test.mjs
 */
import { existsSync, lstatSync, readFileSync, realpathSync } from 'node:fs';
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
  return new RegExp(`^${re}$`, 'i');
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
  return join(realpathSync.native(cur), ...tail);
}

/** First symlink met walking from `root` to `abs` (dangling links included), else null. */
function symlinkOnPath(root, abs) {
  let cur = root;
  for (const seg of relative(root, abs).split(sep)) {
    cur = join(cur, seg);
    let st;
    try { st = lstatSync(cur); } catch { return null; } // the rest does not exist yet
    if (st.isSymbolicLink()) return relative(root, cur).split(sep).join('/');
  }
  return null;
}

/** Returns a reason when `filePath` must not be written by a confined agent, else null. */
export function pathReason(filePath, root) {
  if (typeof filePath !== 'string' || !filePath || filePath.includes('\0')) return 'missing or invalid file path';
  const realRoot = realpathSync.native(root);
  const abs = isAbsolute(filePath) ? resolve(filePath) : resolve(root, filePath);
  const inside = relative(resolve(root), abs);
  if (inside.split(sep).some((g) => /[.\s]$|[:~]/.test(g) && g !== '.' && g !== '..')) return `${filePath}: path segment ending in "." or space, or containing ":"/"~", is refused`;
  if (!inside.startsWith('..') && !isAbsolute(inside)) { const link = symlinkOnPath(resolve(root), abs); if (link) return `${link} is a symlink: writes through links are refused`; }
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

// ------------------------------------------------------------------ privilege-bearing content
const PROTECTED_NAMES = new Set(['configuration-manager', 'configuration-reviewer', 'security-devops', 'auto-config']);
const AGENT_KEYS = ['permissionMode', 'hooks', 'mcpServers', 'isolation', 'background'];
const SKILL_KEYS = ['allowed-tools', 'hooks', 'context', 'agent', 'shell', 'model', 'effort'];

/** Raw frontmatter lines grouped by top-level key (nested lines belong to the key above them). */
function fmKeys(text) {
  const out = {};
  if (typeof text !== 'string' || !text.startsWith('---\n')) return out;
  const end = text.indexOf('\n---', 4);
  let key = null;
  for (const line of text.slice(4, end < 0 ? text.length : end).split('\n')) {
    const m = line.match(/^([A-Za-z_][\w-]*):(.*)$/);
    if (m) { key = m[1]; out[key] = m[2].trim(); } else if (key) out[key] += `\n${line}`;
  }
  return out;
}
const inlineShell = (t) => (String(t ?? '').match(/!`[^`]*`|^\s*```!/gm) ?? []).join('\n');

/** Content the tool would leave in the file (Write content, or Edit/MultiEdit applied to the current text). */
function resulting(ti, current) {
  if (typeof ti.content === 'string') return ti.content;
  const edits = Array.isArray(ti.edits) ? ti.edits : typeof ti.new_string === 'string' ? [ti] : null;
  if (!edits) return null;
  let t = current ?? '';
  for (const e of edits) {
    if (typeof e.old_string !== 'string' || typeof e.new_string !== 'string') return null;
    t = e.replace_all ? t.split(e.old_string).join(e.new_string) : t.replace(e.old_string, () => e.new_string);
  }
  return t;
}

/** Reason when the edit adds or changes privilege-bearing frontmatter or inline shell in an agent/skill file. */
export function contentReason(posix, before, after) {
  const isAgent = /^\.claude\/agents\//i.test(posix);
  const isSkill = /^\.claude\/skills\/[^/]+\/SKILL\.md$/i.test(posix);
  if (!isAgent && !isSkill) return null;
  if (after === null) return `${posix}: cannot determine the resulting content (refused)`;
  const a = fmKeys(before ?? '');
  const b = fmKeys(after);
  for (const k of isAgent ? AGENT_KEYS : SKILL_KEYS) if ((a[k] ?? null) !== (b[k] ?? null)) return `${posix}: changing "${k}" grants or routes privileges (propose it to the owner)`;
  const name = (b.name ?? '').replace(/^["']|["']$/g, '').toLowerCase();
  if (PROTECTED_NAMES.has(name) && (a.name ?? '').replace(/^["']|["']$/g, '').toLowerCase() !== name) return `${posix}: the name "${name}" belongs to a protected component`;
  if (isAgent && /(^|[\s,\[-])(Agent|Task)(\(|\s*(,|$|\]))|mcp__/m.test(b.tools ?? '')) return `${posix}: Agent/Task and MCP tools are owner-only grants`;
  if (inlineShell(before) !== inlineShell(after)) return `${posix}: inline shell (\`!\` blocks) runs when the skill loads (propose it)`;
  return null;
}

export function decide(input, env = process.env) {
  const agent = input?.agent_type;
  if (!agent || !CONFINED_AGENTS.has(agent)) return null;
  const ti = input.tool_input ?? {};
  const root = env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
  // every path-like key must pass (a tool may read one and write another)
  const targets = ['file_path', 'notebook_path', 'path'].filter((k) => k in ti).map((k) => ti[k]);
  if (!targets.length) return 'missing or invalid file path';
  try {
    for (const target of targets) {
      const r = pathReason(target, root);
      if (r) return r;
      const abs = isAbsolute(target) ? resolve(target) : resolve(root, target);
      const posix = relative(realpathSync.native(root), realish(abs)).split(sep).join('/');
      const before = existsSync(abs) ? readFileSync(abs, 'utf8') : null;
      const c = contentReason(posix, before, resulting(ti, before));
      if (c) return c;
    }
    return null;
  } catch (e) {
    return `cannot resolve ${targets.join(', ')}: ${e.message}`;
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
