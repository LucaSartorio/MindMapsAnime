import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Absolute paths of the engine, resolved from this file (works from any cwd). */
export const ENGINE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const REPO_ROOT = path.resolve(ENGINE_DIR, '../..');
export const PUBLIC_DIR = path.join(REPO_ROOT, 'public');
export const SRC_DIR = path.join(REPO_ROOT, 'src');
export const ENTRY_POINT = path.join(ENGINE_DIR, 'index.ts');
/**
 * Headless Chromium for Remotion: `--browser-executable`, then
 * `SOCIAL_BROWSER_EXECUTABLE`, then a Playwright "headless shell" if one is
 * installed (`PLAYWRIGHT_BROWSERS_PATH`). `undefined` → Remotion downloads its own.
 */
export function detectBrowserExecutable(flag?: string): string | undefined {
  const explicit = flag ?? process.env.SOCIAL_BROWSER_EXECUTABLE;
  if (explicit) {
    if (!existsSync(explicit)) throw new Error(`Browser executable not found: ${explicit}`);
    return explicit;
  }
  const pwRoot = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (!pwRoot || !existsSync(pwRoot)) return undefined;
  const shells = readdirSync(pwRoot).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse();
  for (const dir of shells) {
    for (const rel of ['chrome-linux/headless_shell', 'chrome-headless-shell-linux64/chrome-headless-shell']) {
      const candidate = path.join(pwRoot, dir, rel);
      if (existsSync(candidate)) return candidate;
    }
  }
  return undefined;
}
