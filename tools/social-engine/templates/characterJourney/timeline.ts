import { MIN_SECONDS_PER_STOP } from '../../config/defaults';
import { clamp } from '../../lib/easing';

/**
 * Scene plan of a CharacterJourney video, in frames. Pure & deterministic:
 * same duration + stop count → same plan.
 *
 *   hook ─► intro (establishing map) ─► journey (N stops) ─► recap ─► CTA
 *
 * The rhythm adapts to the data: few stops → each stop is capped at
 * MAX_SECONDS_PER_STOP and the spare time goes to intro/recap/CTA;
 * many stops → the resolver samples them down to what fits
 * (`maxStopsForDuration`) so every stop stays readable.
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

const MAX_SECONDS_PER_STOP = 2.8;
/** Share of a stop segment spent travelling (the rest is the dwell on the stop). */
const TRAVEL_SHARE = 0.42;

function baseSeconds(total: number) {
  const hook = clamp(total * 0.11, 2, 2.6);
  const cta = clamp(total * 0.13, 2.6, 3.6);
  const recap = clamp(total * 0.17, 2.8, 5);
  const intro = clamp(total * 0.12, 2.2, 3.2);
  return { hook, cta, recap, intro, journey: total - hook - cta - recap - intro };
}

/** How many stops fit the journey scene of a video of `totalSeconds`. */
export function maxStopsForDuration(totalSeconds: number): number {
  return Math.max(2, Math.floor(baseSeconds(totalSeconds).journey / MIN_SECONDS_PER_STOP));
}

export function planJourney(totalSeconds: number, fps: number, stopCount: number): JourneyPlan {
  const s = baseSeconds(totalSeconds);
  const n = Math.max(1, stopCount);
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
