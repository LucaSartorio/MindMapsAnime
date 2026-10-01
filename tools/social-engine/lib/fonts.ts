import { useEffect, useState } from 'react';
import { cancelRender, continueRender, delayRender } from 'remotion';

/**
 * Font faces are declared by the @fontsource CSS imported in the bundle entry
 * (`index.ts`) — the same font packages as the site. This hook blocks the frame
 * capture until they're actually loaded, so no frame renders with a fallback font.
 */
const FONT_SPECS = ['800 64px Inter', '700 64px Inter', '600 64px Inter', '500 64px Inter', '700 64px Cinzel', '500 32px "JetBrains Mono"'];

export function useBrandFonts(): void {
  const [handle] = useState(() => delayRender('Loading brand fonts'));
  useEffect(() => {
    Promise.all(FONT_SPECS.map((spec) => document.fonts.load(spec)))
      .then(() => continueRender(handle))
      .catch((err: unknown) => cancelRender(err instanceof Error ? err : new Error(String(err))));
  }, [handle]);
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
