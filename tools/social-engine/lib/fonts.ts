import { useEffect, useState } from 'react';
import { cancelRender, continueRender, delayRender } from 'remotion';

/**
 * Font faces are declared by the @fontsource CSS imported in the bundle entry
 * (`index.ts`) — the same font packages as the site, never OS fonts. This hook
 * blocks the frame capture until the faces covering `text` (every character
 * the video will show) are loaded: subsets are split by unicode-range, so a
 * name like "Jinchūriki" needs latin-ext, not just latin.
 */
const FONT_SPECS = ['800 64px Inter', '700 64px Inter', '600 64px Inter', '500 64px Inter', '700 64px Cinzel', '500 32px "JetBrains Mono"'];
const BASE_TEXT = 'AaBbZz0123456789 ·—/:';

/**
 * Characters the bundled font subsets cover (latin, latin-ext, general
 * punctuation, € ™ arrows). Text outside this set would fall back to an OS
 * font and render differently per platform — tests check the data stays inside.
 */
export const FONT_COVERAGE_RE = /^[\u0020-\u024F\u2000-\u206F\u20AC\u2122\u2190-\u2193\u2212\u2215]*$/u;

export function useBrandFonts(text = ''): void {
  const [handle] = useState(() => delayRender('Loading brand fonts'));
  useEffect(() => {
    const sample = [...new Set(BASE_TEXT + text)].join('');
    Promise.all(FONT_SPECS.map((spec) => document.fonts.load(spec, sample)))
      .then(() => continueRender(handle))
      .catch((err: unknown) => cancelRender(err instanceof Error ? err : new Error(String(err))));
  }, [handle, text]);
}

/**
 * Largest font size (≤ max) at which `text` fits `maxLines` lines of `maxWidth` px,
 * from an average glyph width (deterministic, no DOM measuring).
 */
export function fitFontSize(text: string, opts: { maxWidth: number; maxLines: number; max: number; min: number; glyph?: number }): number {
  const glyph = opts.glyph ?? 0.56;
  const longestWord = Math.max(...text.split(/\s+/).map((w) => w.length), 1);
  const byLines = (opts.maxWidth * opts.maxLines) / (glyph * Math.max(text.length, 1) * 1.08);
  const byWord = opts.maxWidth / (glyph * longestWord);
  return Math.round(Math.max(opts.min, Math.min(opts.max, byLines, byWord)));
}
