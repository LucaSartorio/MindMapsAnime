// node --test scripts/claude-usage-report.test.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fromResult, fromTranscript, summarize } from './claude-usage-report.mjs';

const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 100, cache_creation_input_tokens: 20 };
const block = (requestId, content, ts) => JSON.stringify({ type: 'assistant', requestId, effort: 'high', timestamp: ts,
  message: { id: `msg-${requestId}`, model: 'claude-sonnet-5-5', usage, content } });

test('transcript: usage counted once per request even when repeated on every content block', () => {
  const lines = [
    block('r1', [{ type: 'thinking', thinking: '' }], '2026-11-18T10:00:00Z'),
    block('r1', [{ type: 'tool_use', id: 't1', name: 'Bash' }], '2026-11-18T10:00:01Z'),
    block('r1', [{ type: 'tool_use', id: 't2', name: 'Agent' }], '2026-11-18T10:00:02Z'),
    block('r2', [{ type: 'text', text: 'done' }], '2026-11-18T10:00:30Z'),
    JSON.stringify({ type: 'user', timestamp: '2026-11-18T10:00:10Z', message: { content: 'tool result' } }),
    'not json',
  ];
  const r = fromTranscript('s.jsonl', lines);
  assert.equal(r.turns, 2);
  assert.equal(r.input, 20);
  assert.equal(r.output, 10);
  assert.equal(r.cacheRead, 200);
  assert.equal(r.cacheWrite, 40);
  assert.equal(r.toolCalls, 2);
  assert.equal(r.delegations, 1);
  assert.equal(r.durationS, 30);
  assert.deepEqual([...r.models], ['claude-sonnet-5-5']);
  assert.deepEqual([...r.efforts], ['high']);
});

test('claude -p result: modelUsage wins over the aggregate usage, cost and errors carried over', () => {
  const r = fromResult('run.json', {
    type: 'result', subtype: 'success', is_error: false, duration_ms: 12500, num_turns: 4, total_cost_usd: 0.25,
    usage: { input_tokens: 999 },
    modelUsage: { 'claude-opus-5-5': { inputTokens: 7, outputTokens: 3, cacheReadInputTokens: 50, cacheCreationInputTokens: 0 },
      'claude-haiku-5-5': { inputTokens: 1, outputTokens: 1, cacheReadInputTokens: 0, cacheCreationInputTokens: 0 } },
  });
  assert.equal(r.input, 8);
  assert.equal(r.durationS, 12.5);
  assert.equal(r.turns, 4);
  assert.equal(r.costUsd, 0.25);
  assert.equal(r.error, false);
  assert.equal(fromResult('x.json', { subtype: 'error_max_turns' }).error, true);
});

test('summary: only "pass" counts as solved; unknown cost stays unknown', () => {
  const a = fromResult('a.json', { duration_ms: 1000, total_cost_usd: 0.5, usage: { input_tokens: 100, output_tokens: 0 } });
  const b = fromResult('b.json', { duration_ms: 1000, total_cost_usd: 0.3, usage: { input_tokens: 100, output_tokens: 0 } });
  const s = summarize([a, b], { 'a.json': 'pass', 'b.json': 'fail' });
  assert.equal(s.solved, 1);
  assert.equal(s.tokensPerSolved, 200);
  assert.equal(s.costPerSolved, 0.8);
  const t = fromTranscript('t.jsonl', []);
  assert.equal(summarize([a, t], { 'a.json': 'pass' }).costPerSolved, null);
});
