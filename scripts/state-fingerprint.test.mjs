// node --test scripts/state-fingerprint.test.mjs — every case where a stale "passed" result must NOT be reused.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, unlinkSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { fingerprint } from './state-fingerprint.mjs';

const repo = mkdtempSync(join(tmpdir(), 'fp-test-'));
after(() => rmSync(repo, { recursive: true, force: true }));
const git = (...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd: repo, encoding: 'utf8' });
const put = (f, s) => writeFileSync(join(repo, f), s);
git('init', '-q', '.');
put('a.txt', 'one\n');
put('img.bin', Buffer.from([0, 1]));
put('.gitignore', 'node_modules\ndist\n.env\n');
put('.env.example', 'KEY=\n');
git('add', '-A');
git('commit', '-qm', 'init');
mkdirSync(join(repo, 'node_modules'));
put('node_modules/.package-lock.json', '{"v":1}');

const changes = (mutate) => {
  const before = fingerprint(repo);
  mutate();
  return before !== fingerprint(repo);
};

test('nothing relevant changed → same fingerprint (reuse allowed)', () => {
  assert.equal(fingerprint(repo), fingerprint(repo));
  assert.ok(!changes(() => { mkdirSync(join(repo, 'dist'), { recursive: true }); put('dist/index.html', 'x'); }), 'ignored build output is not an input');
});
test('tracked file modified', () => assert.ok(changes(() => put('a.txt', 'two\n'))));
test('tracked binary modified', () => assert.ok(changes(() => put('img.bin', Buffer.from([0, 2])))));
test('untracked file added', () => assert.ok(changes(() => put('new.txt', 'u1\n'))));
test('untracked file modified without renaming it', () => assert.ok(changes(() => put('new.txt', 'u2\n'))));
test('untracked file deleted', () => assert.ok(changes(() => unlinkSync(join(repo, 'new.txt')))));
test('tracked file deleted', () => assert.ok(changes(() => unlinkSync(join(repo, 'img.bin')))));
test('installed dependencies changed', () => assert.ok(changes(() => put('node_modules/.package-lock.json', '{"v":2}'))));
test('relevant config: ignored .env file edited (stat only, content never read)', () => {
  put('.env', 'A=1\n');
  assert.ok(changes(() => { put('.env', 'A=22\n'); utimesSync(join(repo, '.env'), new Date(), new Date(Date.now() + 5000)); }));
});
test('relevant config: build environment variable changed', () => {
  const old = process.env.VITE_FP_TEST;
  try { assert.ok(changes(() => { process.env.VITE_FP_TEST = String(Date.now()); })); }
  finally { if (old === undefined) delete process.env.VITE_FP_TEST; else process.env.VITE_FP_TEST = old; }
});
test('the real index is left untouched', () => {
  put('staged-check.txt', 'x');
  const index = readFileSync(join(repo, '.git', 'index'));
  fingerprint(repo);
  assert.deepEqual(readFileSync(join(repo, '.git', 'index')), index);
  assert.match(git('status', '--porcelain'), /\?\? staged-check\.txt/);
});
test('outside a git work tree → throws (caller must re-run)', () => {
  const plain = mkdtempSync(join(tmpdir(), 'fp-plain-'));
  try { assert.throws(() => fingerprint(plain)); } finally { rmSync(plain, { recursive: true, force: true }); }
});
