#!/usr/bin/env node
/**
 * `node scripts/state-fingerprint.mjs [--explain]` — one hash of everything a check's result depends on, so a passed
 * check is reused only when the input is provably the same (.claude/agents/qa-performance-engineer.md). No cache, no
 * storage: the caller compares the value printed before the check with the value printed now. Any doubt → re-run.
 *
 * Components (read-only for the work tree, the real index and the files' contents listed below):
 *  - work tree: tracked AND untracked, non-ignored files by CONTENT (a temporary copy of the index + `git add -A` +
 *    `git write-tree`; deletions, renames, binaries and untracked edits all change it). Only new blob objects are
 *    written to .git/objects (harmless, garbage-collected);
 *  - installed dependencies: `node_modules/.package-lock.json` (rewritten by every npm install/ci);
 *  - ignored env files `.env*`: size + mtime only (never opened: they may hold keys);
 *  - runtime: Node version, platform, and the build-relevant environment variables (VITE_*, NODE_ENV, CI, BASE,
 *    PLAYWRIGHT_*) as a hash of their values (never printed).
 * Exit 1 (no fingerprint) outside a git work tree: the caller must then re-run.
 * Tests: node --test scripts/state-fingerprint.test.mjs
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ENV = /^(VITE_|PLAYWRIGHT_)|^(NODE_ENV|CI|BASE)$/;
const sha = (s) => createHash('sha256').update(s).digest('hex');

function git(cwd, args, env) {
  return execFileSync('git', args, { cwd, env: { ...process.env, ...env }, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

/** Tree id of the work tree as `git add -A` would stage it, without touching the real index. */
function workTree(cwd) {
  const top = git(cwd, ['rev-parse', '--show-toplevel']);
  const realIndex = resolve(top, git(top, ['rev-parse', '--git-path', 'index']));
  const dir = mkdtempSync(join(tmpdir(), 'state-fp-'));
  const index = join(dir, 'index');
  try {
    if (existsSync(realIndex)) copyFileSync(realIndex, index); // reuse the stat cache: only changed files are re-hashed
    const env = { GIT_INDEX_FILE: index };
    git(top, ['add', '-A'], env);
    return { top, tree: git(top, ['write-tree'], env) };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

export function components(cwd = process.cwd()) {
  const { top, tree } = workTree(cwd);
  const lock = join(top, 'node_modules', '.package-lock.json');
  const envFiles = readdirSync(top).filter((f) => f.startsWith('.env') && f !== '.env.example').sort()
    .map((f) => { const s = statSync(join(top, f)); return `${f}:${s.size}:${s.mtimeMs}`; });
  const vars = Object.keys(process.env).filter((k) => ENV.test(k)).sort().map((k) => `${k}=${process.env[k]}`);
  return {
    tree,
    dependencies: existsSync(lock) ? sha(readFileSync(lock)).slice(0, 16) : 'none',
    envFiles: envFiles.length ? sha(envFiles.join('\n')).slice(0, 16) : 'none',
    runtime: `${process.version} ${process.platform}-${process.arch}`,
    envVars: `${vars.length} var(s) ${sha(vars.join('\n')).slice(0, 16)}`,
  };
}

export function fingerprint(cwd = process.cwd()) {
  const c = components(cwd);
  return sha(JSON.stringify(c)).slice(0, 20);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try {
    if (process.argv.includes('--explain')) for (const [k, v] of Object.entries(components())) console.log(`${k.padEnd(12)} ${v}`);
    console.log(`state-fingerprint ${fingerprint()}`);
  } catch (e) {
    console.error(`[state-fingerprint] no fingerprint (${e.message.split('\n')[0]}): re-run the check`);
    process.exit(1);
  }
}
