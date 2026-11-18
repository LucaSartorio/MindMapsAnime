#!/usr/bin/env node
/**
 * Claude Code usage summary for the before/after benchmark (docs/CLAUDE_DEVELOPMENT_SYSTEM.md §8).
 * Zero dependencies, read-only, local. Prints numbers only: never prompts, results, tool inputs or file contents.
 *
 * Inputs (any mix, one row each):
 *   - `<run>.json`  = output of `claude -p --output-format json "<prompt>" > <run>.json`
 *                     (duration, turns, usage, modelUsage, total_cost_usd = estimated API cost);
 *   - `<session>.jsonl` = transcript under ~/.claude/projects/<repo>/ (tool calls, delegations, models, effort);
 *                     its sub-agent transcripts `<session>/subagents/*.jsonl` are added automatically.
 * Transcripts repeat the same `usage` on every content block of one API response: requests are de-duplicated by
 * `requestId` (fallback `message.id`), otherwise tokens would be counted several times.
 *
 *   node scripts/claude-usage-report.mjs [--outcomes outcomes.json] [--json] <files…>
 * outcomes.json = { "<file basename>": "pass" | "fail" | "partial" | "blocked" } (filled by hand after checking the
 * task); only `pass` counts as a task solved correctly, for tokens/cost per solved task.
 * Tests: node --test scripts/claude-usage-report.test.mjs
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const DELEGATION_TOOLS = new Set(['Agent', 'Task']);

function emptyRow(file) {
  return { file: basename(file), source: '', input: 0, output: 0, cacheRead: 0, cacheWrite: 0, models: new Set(),
    efforts: new Set(), durationS: null, turns: 0, toolCalls: 0, delegations: 0, costUsd: null, error: false };
}

function addUsage(row, u = {}) {
  row.input += u.input_tokens ?? u.inputTokens ?? 0;
  row.output += u.output_tokens ?? u.outputTokens ?? 0;
  row.cacheRead += u.cache_read_input_tokens ?? u.cacheReadInputTokens ?? 0;
  row.cacheWrite += u.cache_creation_input_tokens ?? u.cacheCreationInputTokens ?? 0;
}

/** `claude -p --output-format json` result. */
export function fromResult(file, data) {
  const row = emptyRow(file);
  row.source = 'claude -p';
  if (data.modelUsage && Object.keys(data.modelUsage).length) {
    for (const [model, u] of Object.entries(data.modelUsage)) { row.models.add(model); addUsage(row, u); }
  } else addUsage(row, data.usage);
  row.durationS = typeof data.duration_ms === 'number' ? data.duration_ms / 1000 : null;
  row.turns = data.num_turns ?? 0;
  row.costUsd = typeof data.total_cost_usd === 'number' ? data.total_cost_usd : null;
  row.error = Boolean(data.is_error) || (data.subtype && data.subtype !== 'success');
  return row;
}

/** Transcript lines (main session + sub-agents). */
export function fromTranscript(file, lines) {
  const row = emptyRow(file);
  row.source = 'transcript';
  const seenReq = new Set();
  const seenTool = new Set();
  let first = Infinity;
  let last = -Infinity;
  for (const line of lines) {
    if (!line.trim()) continue;
    let e;
    try { e = JSON.parse(line); } catch { continue; }
    const ts = Date.parse(e.timestamp ?? '');
    if (!Number.isNaN(ts)) { first = Math.min(first, ts); last = Math.max(last, ts); }
    if (e.type !== 'assistant' || !e.message) continue;
    const key = e.requestId ?? e.message.id ?? e.uuid;
    if (!seenReq.has(key)) {
      seenReq.add(key);
      addUsage(row, e.message.usage);
      row.turns += 1;
      if (e.message.model) row.models.add(e.message.model);
      if (e.effort) row.efforts.add(e.effort);
    }
    for (const b of Array.isArray(e.message.content) ? e.message.content : []) {
      if (b?.type !== 'tool_use' || seenTool.has(b.id)) continue;
      seenTool.add(b.id);
      row.toolCalls += 1;
      if (DELEGATION_TOOLS.has(b.name)) row.delegations += 1;
    }
  }
  if (Number.isFinite(first) && Number.isFinite(last)) row.durationS = (last - first) / 1000;
  return row;
}

export function readInput(file) {
  const text = readFileSync(file, 'utf8');
  if (file.endsWith('.jsonl')) {
    const lines = text.split('\n');
    const sub = join(dirname(file), basename(file, '.jsonl'), 'subagents');
    if (existsSync(sub)) for (const f of readdirSync(sub).filter((n) => n.endsWith('.jsonl')).sort())
      lines.push(...readFileSync(join(sub, f), 'utf8').split('\n'));
    return fromTranscript(file, lines);
  }
  const data = JSON.parse(text);
  return fromResult(file, Array.isArray(data) ? data.find((x) => x?.type === 'result') ?? {} : data);
}

export function summarize(rows, outcomes = {}) {
  const total = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, durationS: 0, toolCalls: 0, delegations: 0, turns: 0, costUsd: 0 };
  let costKnown = true;
  for (const r of rows) {
    for (const k of ['input', 'output', 'cacheRead', 'cacheWrite', 'toolCalls', 'delegations', 'turns']) total[k] += r[k];
    total.durationS += r.durationS ?? 0;
    if (r.costUsd == null) costKnown = false; else total.costUsd += r.costUsd;
    r.outcome = outcomes[r.file] ?? '?';
  }
  const solved = rows.filter((r) => r.outcome === 'pass').length;
  const tokens = total.input + total.output + total.cacheRead + total.cacheWrite;
  return { rows, total: { ...total, tokens, costUsd: costKnown ? total.costUsd : null }, solved,
    tokensPerSolved: solved ? Math.round(tokens / solved) : null,
    costPerSolved: solved && costKnown ? total.costUsd / solved : null };
}

const n = (x) => (x == null ? 'n/a' : typeof x === 'number' ? (Number.isInteger(x) ? x.toLocaleString('en-US') : x.toFixed(2)) : x);

function printMarkdown(s) {
  console.log('| Run | Source | Models | Effort | Input | Output | Cache read | Cache write | Duration s | Turns | Tool calls | Delegations | Est. API $ | Outcome |');
  console.log('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const r of s.rows) console.log(`| ${r.file} | ${r.source} | ${[...r.models].join(', ') || 'n/a'} | ${[...r.efforts].join(', ') || 'n/a'} | ` +
    `${n(r.input)} | ${n(r.output)} | ${n(r.cacheRead)} | ${n(r.cacheWrite)} | ${n(r.durationS)} | ${n(r.turns)} | ` +
    `${r.source === 'transcript' ? n(r.toolCalls) : 'n/a'} | ${r.source === 'transcript' ? n(r.delegations) : 'n/a'} | ${n(r.costUsd)} | ${r.error ? 'error' : r.outcome} |`);
  const t = s.total;
  console.log(`\nTotal tokens ${n(t.tokens)} (input ${n(t.input)}, output ${n(t.output)}, cache read ${n(t.cacheRead)}, cache write ${n(t.cacheWrite)}) · ` +
    `duration ${n(t.durationS)} s · solved ${s.solved}/${s.rows.length} · tokens per solved task ${n(s.tokensPerSolved)} · ` +
    `est. API cost per solved task ${s.costPerSolved == null ? 'n/a' : '$' + s.costPerSolved.toFixed(4)}`);
  console.log('Est. API $ is the client estimate at list prices: not a subscription charge, not the usage-limit consumption.');
}

function main(argv) {
  const files = [];
  let outcomes = {};
  let json = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--json') json = true;
    else if (argv[i] === '--outcomes') outcomes = JSON.parse(readFileSync(argv[++i], 'utf8'));
    else files.push(argv[i]);
  }
  if (!files.length) {
    console.error('usage: node scripts/claude-usage-report.mjs [--outcomes outcomes.json] [--json] <run.json|session.jsonl>…');
    process.exit(2);
  }
  const s = summarize(files.map(readInput), outcomes);
  if (json) console.log(JSON.stringify(s, (k, v) => (v instanceof Set ? [...v] : v), 2));
  else printMarkdown(s);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) main(process.argv.slice(2));
