#!/usr/bin/env node
/**
 * Security-posture snapshot of the Claude Code configuration: `.claude/security-posture.json` (generated, committed).
 *
 * The snapshot records what grants or limits power: settings permissions and hooks, every agent's tools /
 * permissionMode / mcpServers / hooks / isolation, every skill's allowed-tools / context / agent / hooks, the read-only
 * and confined agent sets, and content hashes of the guard code and of the files that govern the auto-config system
 * (hooks, validator, reviewer/manager agents, auto-config skill, CODEOWNERS, Site CI).
 *
 * `npm run claude:validate` (Site CI, every PR) fails when the live configuration differs from the snapshot, in either
 * direction (a stale snapshot would hide a later weakening). An intended change is acknowledged by running
 * `npm run claude:posture:update` and committing the snapshot: the diff then shows exactly what changed, for the code
 * owner to review. Agents cannot do this step: the snapshot is an Edit deny in settings.json, the writing script is
 * not in the read-only allowlist, and the configuration-manager path guard refuses it.
 * Limits: protects against mistakes and unreviewed self-modification, not against a hostile PR that also rewrites the
 * snapshot — that needs CODEOWNERS review (docs/SECURITY_SEC-01.md).
 *
 *   node .claude/hooks/posture.mjs            check (exit 1 on any difference)
 *   node .claude/hooks/posture.mjs --write    rewrite the snapshot
 * Tests: node --test .claude/hooks/posture.test.mjs
 */
import { createHash } from 'node:crypto';
import { existsSync, globSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SNAPSHOT = '.claude/security-posture.json';
/** Files whose exact content is part of the posture. Globs are POSIX, relative to the project root. */
export const HASHED = ['.claude/hooks/*.mjs', 'scripts/validate-claude-config.mjs', '.claude/agents/configuration-manager.md',
  '.claude/agents/configuration-reviewer.md', '.claude/agents/security-devops.md', '.claude/rules/security.md',
  '.claude/skills/auto-config/SKILL.md', '.claude/skills/auto-config/references/policy.md',
  '.claude/skills/auto-config/references/sources.json', '.claude/skills/auto-config/scripts/*.mjs',
  '.github/CODEOWNERS', '.github/workflows/site-ci.yml'];

const sha = (t) => createHash('sha256').update(t.replace(/\r\n?/g, '\n')).digest('hex').slice(0, 16);
const sortList = (v) => (v === undefined ? undefined : [...(Array.isArray(v) ? v : String(v).split(/[,\s]+/))].map((s) => s.trim()).filter(Boolean).sort());

/** Frontmatter scalars and lists (same subset as scripts/validate-claude-config.mjs). */
function fm(text) {
  if (!text.startsWith('---\n')) return {};
  const end = text.indexOf('\n---', 4);
  const out = {};
  let last = null;
  for (const line of text.slice(4, end < 0 ? 4 : end).split('\n')) {
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && last) { out[last] = [...(Array.isArray(out[last]) ? out[last] : []), item[1].replace(/^["']|["']$/g, '')]; continue; }
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (kv) { last = kv[1]; out[last] = kv[2].replace(/^["']|["']$/g, ''); }
  }
  return out;
}

const setFrom = (file, name) => {
  if (!existsSync(file)) return null;
  const m = readFileSync(file, 'utf8').match(new RegExp(`${name} = new Set\\(\\[([^\\]]*)\\]`));
  return (m?.[1].match(/'[^']+'/g) ?? []).map((x) => x.slice(1, -1)).sort();
};

export function compute(root) {
  const p = (r) => join(root, r);
  const settings = existsSync(p('.claude/settings.json')) ? JSON.parse(readFileSync(p('.claude/settings.json'), 'utf8')) : {};
  const perms = settings.permissions ?? {};
  const hooks = {};
  for (const [event, groups] of Object.entries(settings.hooks ?? {}).sort())
    hooks[event] = groups.map((g) => ({ matcher: g.matcher ?? '', commands: (g.hooks ?? []).map((h) => `${h.type}:${h.command ?? h.url ?? h.prompt ?? ''}`) }));
  const agents = {};
  const agentDir = p('.claude/agents');
  if (existsSync(agentDir))
    for (const f of globSync('**/*.md', { cwd: agentDir }).sort()) {
      const a = fm(readFileSync(join(agentDir, f), 'utf8'));
      agents[a.name ?? basename(f, '.md')] = { tools: sortList(a.tools) ?? '(all)', disallowedTools: sortList(a.disallowedTools), permissionMode: a.permissionMode, mcpServers: a.mcpServers, hooks: a.hooks, isolation: a.isolation };
    }
  const skills = {};
  const skillDir = p('.claude/skills');
  if (existsSync(skillDir))
    for (const d of readdirSync(skillDir).sort()) {
      const f = join(skillDir, d, 'SKILL.md');
      if (!statSync(join(skillDir, d)).isDirectory() || !existsSync(f)) continue;
      const s = fm(readFileSync(f, 'utf8'));
      skills[d] = { allowedTools: sortList(s['allowed-tools']), context: s.context, agent: s.agent, hooks: s.hooks, disableModelInvocation: s['disable-model-invocation'] };
    }
  const files = {};
  for (const g of HASHED) for (const f of globSync(g, { cwd: root }).sort()) files[f] = sha(readFileSync(p(f), 'utf8'));
  return JSON.parse(JSON.stringify({
    settings: { allow: sortList(perms.allow ?? []), ask: sortList(perms.ask ?? []), deny: sortList(perms.deny ?? []), defaultMode: perms.defaultMode,
      additionalDirectories: perms.additionalDirectories, hooks, env: Object.keys(settings.env ?? {}).sort(), sandbox: settings.sandbox,
      disableAllHooks: settings.disableAllHooks, enabledPlugins: settings.enabledPlugins },
    readOnlyAgents: setFrom(p('.claude/hooks/bash-policy.mjs'), 'READ_ONLY_AGENTS'),
    confinedAgents: setFrom(p('.claude/hooks/config-path-guard.mjs'), 'CONFINED_AGENTS'),
    agents, skills, files,
  }));
}

/** Flatten to `path → JSON value` for a readable diff. */
function flat(o, pre = '', out = {}) {
  if (o && typeof o === 'object' && !Array.isArray(o)) for (const [k, v] of Object.entries(o)) flat(v, pre ? `${pre}.${k}` : k, out);
  else out[pre] = JSON.stringify(o);
  return out;
}

/** Differences between snapshot and live posture, each `{ key, before, after }`. */
export function diff(before, after) {
  const a = flat(before);
  const b = flat(after);
  return [...new Set([...Object.keys(a), ...Object.keys(b)])].sort().filter((k) => a[k] !== b[k]).map((k) => ({ key: k, before: a[k] ?? '(absent)', after: b[k] ?? '(absent)' }));
}

export function check(root) {
  const file = join(root, SNAPSHOT);
  if (!existsSync(file)) return [`${SNAPSHOT} is missing: run npm run claude:posture:update and commit it`];
  let snap;
  try { snap = JSON.parse(readFileSync(file, 'utf8')); } catch (e) { return [`${SNAPSHOT}: invalid JSON (${e.message})`]; }
  delete snap.$comment;
  return diff(snap, compute(root)).map((d) => `security posture changed: ${d.key}: ${d.before} → ${d.after}`);
}

export function write(root) {
  const text = JSON.stringify({ $comment: 'GENERATED by `npm run claude:posture:update`. A change here is a change to permissions, hooks, agent/skill privileges or guard code: owner review required (CODEOWNERS).', ...compute(root) }, null, 2) + '\n';
  const file = join(root, SNAPSHOT);
  const changed = !existsSync(file) || readFileSync(file, 'utf8') !== text;
  if (changed) writeFileSync(file, text);
  return changed;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const root = process.cwd();
  if (process.argv.includes('--write')) {
    console.log(`[posture] ${write(root) ? 'snapshot updated' : 'snapshot unchanged'}: ${SNAPSHOT}`);
  } else {
    const problems = check(root);
    for (const m of problems) console.log(`[ERR ] ${m}`);
    console.log(problems.length ? `[posture] ${problems.length} difference(s): review them; if intended, npm run claude:posture:update and commit the snapshot` : '[posture] OK');
    process.exit(problems.length ? 1 : 0);
  }
}
