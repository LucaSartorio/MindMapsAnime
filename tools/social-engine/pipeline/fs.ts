import { existsSync, lstatSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Filesystem guards of the pipeline. Content files are written by people and,
 * later, by an agent: nothing they contain may choose a path. Every path is
 * built from validated slugs and checked to stay inside its base directory.
 */
export const QUEUE_FILE_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,150}\.json$/;
/** Content JSON files are tiny; anything bigger is rejected unread. */
export const MAX_CONTENT_FILE_BYTES = 64 * 1024;

export function isInside(base: string, target: string): boolean {
  const rel = path.relative(path.resolve(base), path.resolve(target));
  return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel);
}

/** `path.join` that refuses to leave `base` (path traversal, absolute segments). */
export function safeJoin(base: string, ...segments: string[]): string {
  for (const s of segments) {
    if (!s || s.includes('\0') || path.isAbsolute(s)) throw new Error(`Unsafe path segment "${s}"`);
  }
  const target = path.resolve(base, ...segments);
  if (!isInside(base, target)) throw new Error(`Path escapes ${base}: ${segments.join('/')}`);
  return target;
}

/** True for a regular file (symlinks and directories are never followed). */
export function isRegularFile(file: string): boolean {
  try {
    return lstatSync(file).isFile();
  } catch {
    return false;
  }
}

/** Atomic JSON write (temp file + rename): a crash never leaves a half-written file. */
export function writeJsonAtomic(file: string, value: unknown): void {
  mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  writeFileSync(tmp, `${JSON.stringify(value, null, 2)}\n`);
  renameSync(tmp, file);
}

export function readJsonFile(file: string): unknown {
  if (!isRegularFile(file)) throw new Error(`Not a regular file: ${path.basename(file)}`);
  if (lstatSync(file).size > MAX_CONTENT_FILE_BYTES) throw new Error(`File too large (> ${MAX_CONTENT_FILE_BYTES} bytes)`);
  try {
    return JSON.parse(readFileSync(file, 'utf8')) as unknown;
  } catch (err) {
    throw new Error(`Invalid JSON: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/** Moves `file` into `dir`, keeping its name; adds `-2`, `-3`… on collision. Returns the new path. */
export function moveInto(file: string, dir: string): string {
  mkdirSync(dir, { recursive: true });
  const ext = path.extname(file);
  const base = path.basename(file, ext);
  let target = safeJoin(dir, `${base}${ext}`);
  for (let n = 2; existsSync(target); n++) target = safeJoin(dir, `${base}-${n}${ext}`);
  renameSync(file, target);
  return target;
}
