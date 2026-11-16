#!/usr/bin/env node
/**
 * `npm run claude:validate` — static checks for the Claude Code development system (`.claude/` + CLAUDE.md).
 * Zero dependencies (Node ≥ 22 for fs.globSync). Exit 1 on any error, warnings are informative.
 *
 * Checks
 *  - agents (.claude/agents/*.md): frontmatter on line 1, known fields only, name = file name, description,
 *    model alias, effort level, known tool names, maxTurns integer, colour;
 *  - skills (.claude/skills/<name>/SKILL.md): name = directory, description ≤ 1536 chars, known fields, booleans,
 *    `context: fork` + existing `agent`, argument-hint ⇒ arguments are used, body ≤ 500 lines;
 *  - rules (.claude/rules/*.md): only `paths` in frontmatter, every glob matches at least one file (stale paths);
 *  - settings.json: valid JSON, no bypass/default-mode/model override, no blanket Bash allow, hook scripts exist;
 *  - references: every `npm run <script>` mentioned in CLAUDE.md/.claude/docs guide exists in package.json, every
 *    `.claude/rules|agents|skills` and `docs/*.md` path mentioned exists;
 *  - CLAUDE.md lists every agent, skill and rule; context budget of always-loaded instructions.
 * Field lists follow the official docs (code.claude.com/docs/en/sub-agents, /skills, /memory) as of 2026-11.
 */
import { existsSync, globSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';

const ROOT = process.cwd();
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

const AGENT_FIELDS = new Set(['name', 'description', 'tools', 'disallowedTools', 'model', 'permissionMode', 'maxTurns',
  'autoCompactWindow', 'skills', 'mcpServers', 'hooks', 'memory', 'background', 'omitClaudeMd', 'effort', 'isolation',
  'color', 'initialPrompt', 'experimental']);
const SKILL_FIELDS = new Set(['name', 'description', 'when_to_use', 'argument-hint', 'arguments', 'disable-model-invocation',
  'user-invocable', 'allowed-tools', 'disallowed-tools', 'model', 'effort', 'context', 'agent', 'background', 'hooks',
  'paths', 'shell', 'metadata', 'license', 'compatibility']);
const MODELS = new Set(['sonnet', 'opus', 'haiku', 'fable', 'inherit']);
const EFFORTS = new Set(['low', 'medium', 'high', 'xhigh', 'max']);
const COLORS = new Set(['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan']);
const TOOLS = new Set(['WebSearch', 'Read', 'Write', 'Edit', 'NotebookEdit', 'Glob', 'Grep', 'Bash', 'WebFetch', 'WebSearch', 'Agent',
  'Skill', 'TodoWrite', 'TaskCreate', 'TaskUpdate', 'TaskList', 'TaskGet', 'Monitor', 'ToolSearch']);
const BUILTIN_AGENTS = new Set(['Explore', 'Plan', 'general-purpose']);
const BOOL = /^(true|false|yes|no|on|off|1|0)$/;

/** Minimal YAML frontmatter reader: `key: value` scalars and `- item` lists (all this repo uses). */
function frontmatter(file) {
  const text = readFileSync(file, 'utf8');
  if (!text.startsWith('---\n')) return { fm: null, body: text };
  const end = text.indexOf('\n---', 4);
  if (end < 0) return { fm: null, body: text };
  const fm = {};
  let last = null;
  for (const line of text.slice(4, end).split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && last) {
      if (!Array.isArray(fm[last])) fm[last] = [];
      fm[last].push(item[1].replace(/^["']|["']$/g, ''));
      continue;
    }
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) {
      err(`${rel(file)}: unparseable frontmatter line "${line}"`);
      continue;
    }
    last = kv[1];
    if (last in fm) err(`${rel(file)}: duplicate frontmatter key "${last}"`);
    fm[last] = kv[2].replace(/^["']|["']$/g, '');
  }
  return { fm, body: text.slice(end + 4) };
}
const rel = (p) => p.replace(ROOT + '/', '');
const list = (v) => (Array.isArray(v) ? v : String(v ?? '').split(',').map((s) => s.trim()).filter(Boolean));

// ---------------------------------------------------------------- agents
const agentsDir = join(ROOT, '.claude/agents');
const agents = existsSync(agentsDir) ? readdirSync(agentsDir).filter((f) => f.endsWith('.md')) : [];
const agentNames = new Set();
const agentProfile = new Map();
for (const f of agents) {
  const file = join(agentsDir, f);
  const { fm, body } = frontmatter(file);
  if (!fm) { err(`${rel(file)}: frontmatter must start on line 1`); continue; }
  for (const k of Object.keys(fm)) if (!AGENT_FIELDS.has(k)) err(`${rel(file)}: unknown agent field "${k}" (ignored by Claude Code)`);
  if (!fm.name) err(`${rel(file)}: missing name`);
  else if (fm.name !== basename(f, '.md')) err(`${rel(file)}: name "${fm.name}" ≠ file name`);
  if (!fm.description || fm.description.length < 60) err(`${rel(file)}: description missing or too short to route on`);
  if (fm.model && !MODELS.has(fm.model) && !/^claude-[a-z0-9-]+$/.test(fm.model)) err(`${rel(file)}: invalid model "${fm.model}"`);
  if (!fm.model) warn(`${rel(file)}: no model → falls back to CLAUDE_CODE_SUBAGENT_MODEL / parent model`);
  if (fm.effort && !EFFORTS.has(fm.effort)) err(`${rel(file)}: invalid effort "${fm.effort}"`);
  if (fm.model && fm.model !== 'inherit' && !fm.effort) warn(`${rel(file)}: model set without explicit effort`);
  for (const t of [...list(fm.tools), ...list(fm.disallowedTools)]) {
    const base = t.replace(/\(.*$/, '');
    if (!TOOLS.has(base) && !base.startsWith('mcp__')) err(`${rel(file)}: unknown tool "${t}"`);
  }
  if (fm.maxTurns && !/^\d+$/.test(fm.maxTurns)) err(`${rel(file)}: maxTurns must be an integer`);
  if (fm.color && !COLORS.has(fm.color)) err(`${rel(file)}: invalid color "${fm.color}"`);
  if (fm.permissionMode === 'bypassPermissions') err(`${rel(file)}: bypassPermissions is not allowed in this repo`);
  // Least privilege: without an explicit `tools:` an agent inherits EVERY tool, MCP writers included
  // (merge PR, push files, create sessions/triggers…), which bypass the git hook entirely.
  if (!fm.tools) err(`${rel(file)}: no explicit tools allowlist (inherits all tools, MCP writers included)`);
  for (const t of list(fm.tools)) {
    if (t.startsWith('mcp__') && (!/__(?:[a-z]+_)*(get|list|read|search)(?:_[a-z]+)*$/.test(t) || /(write|create|update|delete|merge|push|trigger|run|fork|resolve|add|enable|disable)/.test(t.split('__').pop()))) err(`${rel(file)}: MCP tool "${t}" is not read-only`);
    if (t === 'Agent') err(`${rel(file)}: sub-agents must not spawn agents (only the orchestrator coordinates)`);
  }
  const tl = list(fm.tools);
  agentProfile.set(fm.name, { bash: tl.includes('Bash'), writes: tl.some((t) => ['Edit', 'Write', 'NotebookEdit'].includes(t)) });
  if (!/STATUS/.test(body)) warn(`${rel(file)}: no output contract (STATUS …) in the body`);
  agentNames.add(fm.name);
}

// Read-only agents (Bash, no Edit/Write) must be the ones the Bash policy hook restricts, and vice versa.
const policyFile = join(ROOT, '.claude/hooks/bash-policy.mjs');
if (existsSync(policyFile)) {
  const m = readFileSync(policyFile, 'utf8').match(/READ_ONLY_AGENTS = new Set\(\[([^\]]*)\]/);
  const listed = new Set((m?.[1] ?? '').match(/'[^']+'/g)?.map((x) => x.slice(1, -1)) ?? []);
  for (const [name, p] of agentProfile) {
    if (p.bash && !p.writes && !listed.has(name)) err(`.claude/hooks/bash-policy.mjs: read-only agent ${name} (Bash, no Edit/Write) missing from READ_ONLY_AGENTS`);
    if (listed.has(name) && p.writes) err(`.claude/hooks/bash-policy.mjs: ${name} is in READ_ONLY_AGENTS but has Edit/Write`);
  }
  for (const name of listed) if (!agentProfile.has(name) && !BUILTIN_AGENTS.has(name)) err(`.claude/hooks/bash-policy.mjs: READ_ONLY_AGENTS lists unknown agent ${name}`);
} else err('.claude/hooks/bash-policy.mjs is missing');

// ---------------------------------------------------------------- skills
const skillsDir = join(ROOT, '.claude/skills');
const skills = existsSync(skillsDir) ? readdirSync(skillsDir).filter((d) => statSync(join(skillsDir, d)).isDirectory()) : [];
for (const dir of skills) {
  const file = join(skillsDir, dir, 'SKILL.md');
  if (!existsSync(file)) { err(`.claude/skills/${dir}: missing SKILL.md`); continue; }
  const { fm, body } = frontmatter(file);
  if (!fm) { err(`${rel(file)}: frontmatter must start on line 1`); continue; }
  for (const k of Object.keys(fm)) if (!SKILL_FIELDS.has(k)) err(`${rel(file)}: unknown skill field "${k}"`);
  if (fm.name && fm.name !== dir) err(`${rel(file)}: name "${fm.name}" ≠ directory "${dir}"`);
  const desc = (fm.description ?? '') + (fm.when_to_use ?? '');
  if (desc.length < 60) err(`${rel(file)}: description missing or too short to trigger on`);
  if (desc.length > 1536) err(`${rel(file)}: description + when_to_use > 1536 chars (truncated in the listing)`);
  for (const b of ['disable-model-invocation', 'user-invocable', 'background'])
    if (b in fm && !BOOL.test(fm[b])) err(`${rel(file)}: ${b} must be a boolean`);
  if (fm.context && fm.context !== 'fork') err(`${rel(file)}: context supports only "fork"`);
  if (fm.agent && !fm.context) err(`${rel(file)}: agent is only used with context: fork`);
  if (fm.agent && !agentNames.has(fm.agent) && !BUILTIN_AGENTS.has(fm.agent)) err(`${rel(file)}: unknown agent "${fm.agent}"`);
  if (fm.model && !MODELS.has(fm.model)) err(`${rel(file)}: invalid model "${fm.model}"`);
  if (fm.effort && !EFFORTS.has(fm.effort)) err(`${rel(file)}: invalid effort "${fm.effort}"`);
  if (fm.model && !fm.context) warn(`${rel(file)}: model on an inline skill overrides the owner's model while it runs`);
  if (fm['argument-hint'] && !/\$(ARGUMENTS|\d|\{)/.test(body)) err(`${rel(file)}: argument-hint set but the body never uses $ARGUMENTS/$N`);
  for (const a of list(fm['allowed-tools'])) if (/^Bash(\(\*\))?$/.test(a)) err(`${rel(file)}: blanket Bash in allowed-tools`);
  if (body.split('\n').length > 500) warn(`${rel(file)}: body > 500 lines (move reference material to files)`);
}

// ---------------------------------------------------------------- rules
const rulesDir = join(ROOT, '.claude/rules');
const rules = existsSync(rulesDir) ? readdirSync(rulesDir).filter((f) => f.endsWith('.md')) : [];
let alwaysLoaded = 0;
for (const f of rules) {
  const file = join(rulesDir, f);
  const { fm } = frontmatter(file);
  const size = readFileSync(file, 'utf8').length;
  if (!fm || !fm.paths) { alwaysLoaded += size; warn(`${rel(file)}: no paths → loaded in every session (${size} chars)`); continue; }
  for (const k of Object.keys(fm)) if (k !== 'paths') err(`${rel(file)}: rules only support "paths" (found "${k}")`);
  for (const p of list(fm.paths)) {
    const pattern = p.startsWith('/') ? p.slice(1) : p;
    let hits = [];
    try { hits = globSync(pattern, { cwd: ROOT, exclude: (n) => n === 'node_modules' }); } catch (e) { err(`${rel(file)}: bad glob "${p}": ${e.message}`); }
    if (hits.length === 0) err(`${rel(file)}: path pattern "${p}" matches no file (stale path?)`);
  }
}

// ---------------------------------------------------------------- settings.json
const settingsFile = join(ROOT, '.claude/settings.json');
if (existsSync(settingsFile)) {
  let s;
  try { s = JSON.parse(readFileSync(settingsFile, 'utf8')); } catch (e) { err(`.claude/settings.json: invalid JSON (${e.message})`); }
  if (s) {
    if ('model' in s || 'effortLevel' in s) err('.claude/settings.json: must not force the session model/effort (owner choice)');
    if (s.permissions?.defaultMode) err('.claude/settings.json: defaultMode must not be set from the repo');
    if (s.env && Object.keys(s.env).some((k) => /SUBAGENT_MODEL|EFFORT_LEVEL/.test(k))) err('.claude/settings.json: env overrides per-agent model/effort routing');
    for (const a of s.permissions?.allow ?? []) if (/^Bash(\(\*\))?$/.test(a) || a === 'Edit' || a === 'Write') err(`.claude/settings.json: blanket allow "${a}"`);
    for (const groups of Object.values(s.hooks ?? {}))
      for (const g of groups) for (const h of g.hooks ?? []) {
        const m = String(h.command ?? '').match(/\.claude\/hooks\/[\w.-]+/);
        if (m && !existsSync(join(ROOT, m[0]))) err(`.claude/settings.json: hook script ${m[0]} not found`);
      }
  }
}

// ---------------------------------------------------------------- references
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const scripts = new Set(Object.keys(pkg.scripts ?? {}));
const docFiles = ['CLAUDE.md', 'docs/CLAUDE_DEVELOPMENT_SYSTEM.md',
  ...agents.map((f) => `.claude/agents/${f}`), ...skills.map((d) => `.claude/skills/${d}/SKILL.md`),
  ...rules.map((f) => `.claude/rules/${f}`)].filter((f) => existsSync(join(ROOT, f)));
for (const f of docFiles) {
  const text = readFileSync(join(ROOT, f), 'utf8');
  for (const m of text.matchAll(/npm run (?:-s |--silent )?([a-z][\w:.-]*)/g)) {
    const name = m[1].replace(/[.:]$/, '');
    if (!scripts.has(name)) err(`${f}: references "npm run ${name}" which is not in package.json`);
  }
  for (const m of text.matchAll(/`((?:\.claude\/(?:rules|agents|skills|hooks)|docs)\/[\w./-]+\.(?:md|mjs|json))`/g)) {
    if (m[1].includes('<') || m[1].includes('*')) continue;
    if (!existsSync(join(ROOT, m[1]))) err(`${f}: references missing file ${m[1]}`);
  }
}

// ---------------------------------------------------------------- CLAUDE.md coverage + budget
const claude = readFileSync(join(ROOT, 'CLAUDE.md'), 'utf8');
for (const f of rules) if (!claude.includes(`\`${f}\``)) err(`CLAUDE.md: rule ${f} missing from the context map`);
const guide = join(ROOT, 'docs/CLAUDE_DEVELOPMENT_SYSTEM.md');
if (existsSync(guide)) {
  const g = readFileSync(guide, 'utf8');
  for (const a of agentNames) if (!g.includes(a)) err(`docs/CLAUDE_DEVELOPMENT_SYSTEM.md: agent ${a} not documented`);
  for (const d of skills) if (!g.includes(`/${d}`)) err(`docs/CLAUDE_DEVELOPMENT_SYSTEM.md: skill /${d} not documented`);
} else err('docs/CLAUDE_DEVELOPMENT_SYSTEM.md is missing');
const startup = claude.length + alwaysLoaded;
const BUDGET = 20000;
if (claude.length > 40000) err(`CLAUDE.md is ${claude.length} chars (> 40000)`);
else if (startup > BUDGET) warn(`always-loaded instructions ${startup} chars > budget ${BUDGET}`);

// ---------------------------------------------------------------- report
console.log(`claude:validate · ${agents.length} agents · ${skills.length} skills · ${rules.length} rules · ` +
  `always-loaded instructions ${startup} chars (CLAUDE.md ${claude.length})`);
for (const w of warnings) console.log(`[WARN] ${w}`);
for (const e of errors) console.log(`[ERR ] ${e}`);
if (errors.length) { console.log(`${errors.length} error(s)`); process.exit(1); }
console.log('OK');
