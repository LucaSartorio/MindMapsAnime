import { MIN_SECONDS_PER_STOP } from '../../config/defaults';
import { clamp } from '../../lib/easing';

/**
 * Scene plan of a CharacterJourney video, in frames. Pure & deterministic:
 * same duration + stop count → same plan.
 *
 *   hook ─► intro (establishing map) ─► journey (N stops) ─► recap ─► CTA
 *
 * The rhythm adapts to the data: the automatic duration
 * (`recommendedDurationSeconds`) gives every stop ~2.8 s (travel + dwell);
 * few stops → each stop is capped at MAX_SECONDS_PER_STOP and the spare time
 * goes to intro/recap/CTA; an explicit duration too short for the stops →
 * the resolver samples them down to what fits (`maxStopsForDuration`).
 */
export type Span = { start: number; end: number };
export type StopTiming = { travelStart: number; arrive: number; leave: number };
export type JourneyPlan = {
  fps: number;
  total: number;
  hook: Span;
  intro: Span;
  journey: Span;
  stops: StopTiming[];
  recap: Span;
  cta: Span;
};

/** A stop never gets more than this (extra time goes to intro/recap/CTA). */
const MAX_SECONDS_PER_STOP = 3.4;
/** Share of a stop segment spent travelling (the rest is the dwell on the stop). */
const TRAVEL_SHARE = 0.42;

/**
 * Automatic length of a CharacterJourney video: ~13.5 s of fixed scenes
 * (hook, establishing map, recap, CTA) + ~2.75 s per animated stop, clamped
 * to 24–38 s. 4 → 25 s · 5 → 27 s · 6 → 30 s · 7 → 33 s · 8 → 36 s.
 * Longer journeys don't get longer videos: they become more parts.
 */
export const AUTO_DURATION_MIN = 24;
export const AUTO_DURATION_MAX = 38;
export const AUTO_FIXED_SECONDS = 13.5;
export const AUTO_SECONDS_PER_STOP = 2.75;

export function recommendedDurationSeconds(stopCount: number): number {
  return clamp(Math.round(AUTO_FIXED_SECONDS + AUTO_SECONDS_PER_STOP * stopCount), AUTO_DURATION_MIN, AUTO_DURATION_MAX);
}

/**
 * Scene budgets: the hook, intro and CTA have fixed, readable lengths (they
 * only shrink for short, explicitly requested durations); the recap grows a
 * little with the stop count (more pins to frame); EVERYTHING ELSE goes to the
 * journey, so more stops → more journey time, never a longer hook.
 */
function baseSeconds(total: number, stopCount: number) {
  const hook = clamp(total * 0.11, 2, 2.6);
  const cta = clamp(total * 0.13, 2.6, 3.2);
  const intro = clamp(total * 0.12, 2.2, 2.8);
  const recap = clamp(Math.min(3.4 + 0.15 * stopCount, total * 0.17), 2.8, 5);
  return { hook, cta, recap, intro, journey: total - hook - cta - recap - intro };
}

/** How many stops fit the journey scene of a video of `totalSeconds` (≥ MIN_SECONDS_PER_STOP each). */
export function maxStopsForDuration(totalSeconds: number): number {
  let n = 2;
  while (n < 12 && baseSeconds(totalSeconds, n + 1).journey / (n + 1) >= MIN_SECONDS_PER_STOP) n++;
  return n;
}

export function planJourney(totalSeconds: number, fps: number, stopCount: number): JourneyPlan {
  const n = Math.max(1, stopCount);
  const s = baseSeconds(totalSeconds, n);
  if (s.journey / n > MAX_SECONDS_PER_STOP) {
    const extra = s.journey - n * MAX_SECONDS_PER_STOP;
    s.journey = n * MAX_SECONDS_PER_STOP;
    s.recap += extra * 0.45;
    s.intro += extra * 0.35;
    s.cta += extra * 0.2;
  }
  const total = Math.round(totalSeconds * fps);
  const f = (sec: number) => Math.round(sec * fps);
  const hookEnd = f(s.hook);
  const introEnd = hookEnd + f(s.intro);
  const ctaStart = total - f(s.cta);
  const recapStart = ctaStart - f(s.recap);
  // The journey absorbs rounding so the scenes always tile the full duration.
  const journeyFrames = recapStart - introEnd;
  const seg = journeyFrames / n;
  const stops: StopTiming[] = Array.from({ length: n }, (_, i) => {
    const travelStart = Math.round(introEnd + i * seg);
    return {
      travelStart,
      arrive: Math.round(introEnd + i * seg + seg * TRAVEL_SHARE),
      leave: Math.round(introEnd + (i + 1) * seg),
    };
  });
  return {
    fps,
    total,
    hook: { start: 0, end: hookEnd },
    intro: { start: hookEnd, end: introEnd },
    journey: { start: introEnd, end: recapStart },
    stops,
    recap: { start: recapStart, end: ctaStart },
    cta: { start: ctaStart, end: total },
  };
}
