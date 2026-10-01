import assert from 'node:assert/strict';
import { SocialEngineError } from '../lib/errors';

/** Tiny test harness (no framework in this repo — same spirit as scripts/test-seo.ts). */
let passed = 0;
const failures: string[] = [];

export function section(name: string): void {
  console.log(`\n${name}`);
}

export async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try {
    await fn();
    passed++;
    console.log(`  ✔ ${name}`);
  } catch (err) {
    failures.push(name);
    console.log(`  ✖ ${name}\n    ${err instanceof Error ? err.message.split('\n').join('\n    ') : String(err)}`);
  }
}

export async function rejects(fn: () => Promise<unknown>, pattern: RegExp, type: new (...a: never[]) => Error = SocialEngineError): Promise<void> {
  await assert.rejects(fn, (err: unknown) => {
    assert.ok(err instanceof type, `expected ${type.name}, got ${String(err)}`);
    assert.match((err as Error).message, pattern);
    return true;
  });
}

export function report(): void {
  console.log(`\n${failures.length ? '✖' : '✔'} ${passed} passed, ${failures.length} failed\n`);
  if (failures.length) process.exitCode = 1;
}
