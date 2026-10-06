import type { Span } from '../characterJourney/timeline';

/**
 * GuessCharacter scene plan (frames): hook → N clues → countdown → reveal → CTA.
 * Pure & deterministic. Automatic length: 9.6 s of fixed scenes + 2.4 s per clue
 * (4 → 19 s · 5 → 22 s · 6 → 24 s).
 */
export const GUESS_HOOK_SECONDS = 2.8;
export const GUESS_CLUE_SECONDS = 2.4;
export const GUESS_THINK_SECONDS = 3;
export const GUESS_REVEAL_SECONDS = 3;
export const GUESS_CTA_SECONDS = 3;

export function guessDurationSeconds(clues: number): number {
  return Math.round(GUESS_HOOK_SECONDS + GUESS_CLUE_SECONDS * clues + GUESS_THINK_SECONDS + GUESS_REVEAL_SECONDS + GUESS_CTA_SECONDS);
}

export type GuessPlan = { total: number; hook: Span; clues: Span[]; think: Span; reveal: Span; cta: Span };

export function planGuess(totalSeconds: number, fps: number, clues: number): GuessPlan {
  const total = Math.round(totalSeconds * fps);
  const f = (s: number) => Math.round(s * fps);
  const hookEnd = f(GUESS_HOOK_SECONDS);
  const ctaStart = total - f(GUESS_CTA_SECONDS);
  const revealStart = ctaStart - f(GUESS_REVEAL_SECONDS);
  const thinkStart = revealStart - f(GUESS_THINK_SECONDS);
  // The clues absorb any extra/rounding time so scenes tile the full duration.
  const seg = (thinkStart - hookEnd) / Math.max(1, clues);
  return {
    total,
    hook: { start: 0, end: hookEnd },
    clues: Array.from({ length: clues }, (_, i) => ({ start: Math.round(hookEnd + i * seg), end: Math.round(hookEnd + (i + 1) * seg) })),
    think: { start: thinkStart, end: revealStart },
    reveal: { start: revealStart, end: ctaStart },
    cta: { start: ctaStart, end: total },
  };
}
