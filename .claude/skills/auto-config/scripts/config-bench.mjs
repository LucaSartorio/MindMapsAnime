#!/usr/bin/env node
/**
 * Static benchmark of the Claude Code configuration: what every session pays in context, what each component
 * weighs, which privileges exist, how much instruction text is duplicated. Deterministic and free (no model call);
 * the live token measurement (claude -p) is in references/benchmark.md.
 *
 *   npm run -s claude:bench                         metrics of the working tree
 *   npm run -s claude:bench -- --base origin/main   base ref vs working tree (or --head <ref>), with verdict flags
 *   … --json | --strict (exit 1 when a flag is raised)
 *
 * "≈tokens" = chars / 4: an ESTIMATE for comparing versions, not a measurement (measure with claude -p).
 * Tests: node --test .claude/skills/auto-config/scripts/config-bench.test.mjs
 */
import { execFileSync } from 'node:child_process';
import { globSync, lstatSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PATTERNS = [/^CLAUDE\.md$/, /^AGENTS\.md$/, /^\.claude\/agents\/.+\.md$/, /^\.claude\/skills\/[^/]+\/SKILL\.md$/, /^\.claude\/rules\/[^/]+\.md$/, /^\.claude\/settings\.json$/, /^\.claude\/hooks\/bash-policy\.mjs$/, /^\.claude\/hooks\/config-path-guard\.mjs$/];

/** Reader over the working tree (`ref` undefined) or a git ref. */
export function reader(root, ref) {
  if (!ref) {
    const files = globSync(['CLAUDE.md', 'AGENTS.md', '.claude/**/*'], { cwd: root }).map((f) => f.split('\\').join('/'))
      .filter((f) => PATTERNS.some((p) => p.test(f)) && !lstatSync(join(root, f)).isSymbolicLink());
    return { files, read: (f) => readFileSync(join(root, f), 'utf8') };
  }
  if (!/^[A-Za-z0-9._/@^~-]+$/.test(ref) || ref.startsWith('-')) throw new Error(`invalid git ref "${ref}"`);
  const git = (...a) => execFileSync('git', ['-C', root, ...a], { encoding: 'utf8', maxBuffer: 64 << 20, env: { ...process.env, GIT_PAGER: 'cat', PAGER: 'cat' } });
  const files = git('ls-tree', '-r', '--name-only', ref, '--', 'CLAUDE.md', 'AGENTS.md', '.claude').split('\n').filter((f) => PATTERNS.some((p) => p.test(f)));
  return { files, read: (f) => git('show', `${ref}:${f}`) };
}

function fm(text) {
  if (!text.startsWith('---\n')) return { fm: {}, body: text };
  const end = text.indexOf('\n---', 4);
  const out = {};
  let last = null;
  for (const line of text.slice(4, end).split('\n')) {
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && last) { out[last] = [...(Array.isArray(out[last]) ? out[last] : []), item[1]]; continue; }
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (kv) { last = kv[1]; out[last] = kv[2].replace(/^["']|["']$/g, ''); }
  }
  return { fm: out, body: text.slice(end + 4) };
}
const list = (v) => (Array.isArray(v) ? v : String(v ?? '').split(',').map((s) => s.trim()).filter(Boolean));
const setFrom = (text, name) => (text.match(new RegExp(`${name} = new Set\\(\\[([^\\]]*)\\]`))?.[1].match(/'[^']+'/g) ?? []).length;

export function metrics({ files, read }) {
  const m = { claudeMdChars: 0, alwaysRulesChars: 0, listingChars: 0, agents: 0, skills: 0, autoSkills: 0, rules: 0,
    agentPromptChars: 0, maxAgentPrompt: '', skillBodyChars: 0, maxSkillBody: '', writers: 0, bashAgents: 0, webAgents: 0,
    mcpTools: 0, agentsWithAllTools: 0, readOnlyAgents: 0, confinedAgents: 0, allowRules: 0, askRules: 0, denyRules: 0, hooks: 0, duplicateLines: 0 };
  let maxA = 0;
  let maxS = 0;
  const lineFiles = new Map();
  const track = (file, text) => {
    for (const raw of text.split('\n')) {
      const l = raw.replace(/^[\s>*|#-]+/, '').replace(/\s+/g, ' ').trim().toLowerCase();
      if (l.length < 50 || l.startsWith('```') || /^[-|: ]+$/.test(l)) continue;
      if (!lineFiles.has(l)) lineFiles.set(l, new Set());
      lineFiles.get(l).add(file);
    }
  };
  for (const f of files) {
    const text = read(f);
    if (f === 'CLAUDE.md') { m.claudeMdChars = text.length; track(f, text); }
    else if (f.startsWith('.claude/agents/')) {
      const { fm: a, body } = fm(text);
      m.agents++;
      m.listingChars += `${a.name}: ${a.description ?? ''}`.length;
      m.agentPromptChars += body.length;
      if (body.length > maxA) { maxA = body.length; m.maxAgentPrompt = `${a.name} ${body.length}`; }
      const t = list(a.tools);
      if (!a.tools) m.agentsWithAllTools++;
      if (t.some((x) => ['Edit', 'Write', 'NotebookEdit'].includes(x)) || !a.tools) m.writers++;
      if (t.includes('Bash') || !a.tools) m.bashAgents++;
      if (t.some((x) => ['WebFetch', 'WebSearch'].includes(x)) || !a.tools) m.webAgents++;
      m.mcpTools += t.filter((x) => x.startsWith('mcp__')).length;
      track(f, body);
    } else if (f.startsWith('.claude/skills/')) {
      const { fm: s, body } = fm(text);
      m.skills++;
      // Model-invocable skills put their description in every session's listing.
      if (!/^(true|yes|on|1)$/.test(s['disable-model-invocation'] ?? '')) { m.autoSkills++; m.listingChars += `${s.name}: ${s.description ?? ''}${s.when_to_use ?? ''}`.length; }
      m.skillBodyChars += body.length;
      if (body.length > maxS) { maxS = body.length; m.maxSkillBody = `${s.name ?? f} ${body.length}`; }
      track(f, body);
    } else if (f.startsWith('.claude/rules/')) {
      const { fm: r } = fm(text);
      m.rules++;
      if (!r.paths) m.alwaysRulesChars += text.length;
      track(f, text);
    } else if (f === '.claude/settings.json') {
      try {
        const s = JSON.parse(text);
        m.allowRules = s.permissions?.allow?.length ?? 0;
        m.askRules = s.permissions?.ask?.length ?? 0;
        m.denyRules = s.permissions?.deny?.length ?? 0;
        m.hooks = Object.values(s.hooks ?? {}).flat().reduce((n, g) => n + (g.hooks?.length ?? 0), 0);
      } catch { m.hooks = -1; }
    } else if (f.endsWith('bash-policy.mjs')) m.readOnlyAgents = setFrom(text, 'READ_ONLY_AGENTS');
    else if (f.endsWith('config-path-guard.mjs')) m.confinedAgents = setFrom(text, 'CONFINED_AGENTS');
  }
  m.duplicateLines = [...lineFiles.values()].filter((s) => s.size > 1).length;
  m.startupChars = m.claudeMdChars + m.alwaysRulesChars + m.listingChars;
  m.startupTokensEst = Math.round(m.startupChars / 4);
  return m;
}

/** Verdict flags for base → head (policy §7). */
export function flags(base, head) {
  const out = [];
  const growth = base.startupChars ? (head.startupChars - base.startupChars) / base.startupChars : 0;
  if (growth > 0.02) out.push(`always-loaded context +${(growth * 100).toFixed(1)}% (> 2%): state the reason`);
  for (const k of ['writers', 'bashAgents', 'webAgents', 'mcpTools', 'agentsWithAllTools', 'allowRules'])
    if (head[k] > base[k]) out.push(`privilege ↑ ${k} ${base[k]} → ${head[k]}: owner approval`);
  for (const k of ['denyRules', 'askRules', 'hooks', 'readOnlyAgents'])
    if (head[k] < base[k]) out.push(`protection ↓ ${k} ${base[k]} → ${head[k]}: owner approval`);
  if (head.duplicateLines > base.duplicateLines) out.push(`duplicated instruction lines ${base.duplicateLines} → ${head.duplicateLines}`);
  if (head.agentsWithAllTools > 0) out.push('an agent has no tools allowlist');
  return out;
}

const KEYS = ['startupChars', 'startupTokensEst', 'claudeMdChars', 'alwaysRulesChars', 'listingChars', 'agents', 'skills', 'autoSkills', 'rules',
  'agentPromptChars', 'skillBodyChars', 'writers', 'bashAgents', 'webAgents', 'mcpTools', 'agentsWithAllTools', 'readOnlyAgents', 'confinedAgents',
  'allowRules', 'askRules', 'denyRules', 'hooks', 'duplicateLines'];

export function main(argv, { root = process.cwd(), out = (s) => process.stdout.write(s) } = {}) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : undefined; };
  const baseRef = arg('--base');
  const head = metrics(reader(root, arg('--head')));
  if (!baseRef) {
    if (argv.includes('--json')) out(JSON.stringify(head, null, 2) + '\n');
    else out(KEYS.map((k) => `${k.padEnd(20)} ${head[k]}`).join('\n') + `\nlargest agent prompt: ${head.maxAgentPrompt} · largest skill body: ${head.maxSkillBody}\n(≈tokens = chars/4, estimate)\n`);
    return 0;
  }
  const base = metrics(reader(root, baseRef));
  const f = flags(base, head);
  if (argv.includes('--json')) out(JSON.stringify({ base, head, flags: f }, null, 2) + '\n');
  else {
    out(`${'metric'.padEnd(20)} ${'base'.padStart(8)} ${'head'.padStart(8)} ${'delta'.padStart(8)}\n`);
    for (const k of KEYS) out(`${k.padEnd(20)} ${String(base[k]).padStart(8)} ${String(head[k]).padStart(8)} ${String(head[k] - base[k]).padStart(8)}\n`);
    out(f.length ? `FLAGS:\n${f.map((x) => `  - ${x}`).join('\n')}\n` : 'FLAGS: none\n');
    out('(≈tokens = chars/4, estimate; privilege/protection flags need the owner, see policy §7)\n');
  }
  return argv.includes('--strict') && f.length ? 1 : 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try { process.exit(main(process.argv.slice(2))); } catch (e) { process.stderr.write(`[claude-bench] ${e.message}\n`); process.exit(2); }
}
