import type { Span } from '../characterJourney/timeline';

/** CharacterVersus scene plan: hook → side A → side B → comparison → reveal → CTA (fixed 22 s). */
export const VERSUS_SECONDS = { hook: 2.8, side: 5, compare: 3.5, reveal: 3, cta: 3 } as const;
export const VERSUS_DURATION_SECONDS = Math.round(VERSUS_SECONDS.hook + 2 * VERSUS_SECONDS.side + VERSUS_SECONDS.compare + VERSUS_SECONDS.reveal + VERSUS_SECONDS.cta);

export type VersusPlan = { total: number; hook: Span; a: Span; b: Span; compare: Span; reveal: Span; cta: Span };

export function planVersus(totalSeconds: number, fps: number): VersusPlan {
  const total = Math.round(totalSeconds * fps);
  const f = (s: number) => Math.round(s * fps);
  const hookEnd = f(VERSUS_SECONDS.hook);
  const ctaStart = total - f(VERSUS_SECONDS.cta);
  const revealStart = ctaStart - f(VERSUS_SECONDS.reveal);
  const compareStart = revealStart - f(VERSUS_SECONDS.compare);
  const mid = Math.round((hookEnd + compareStart) / 2);
  return {
    total,
    hook: { start: 0, end: hookEnd },
    a: { start: hookEnd, end: mid },
    b: { start: mid, end: compareStart },
    compare: { start: compareStart, end: revealStart },
    reveal: { start: revealStart, end: ctaStart },
    cta: { start: ctaStart, end: total },
  };
}
