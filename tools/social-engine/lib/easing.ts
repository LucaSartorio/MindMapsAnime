import { Easing, interpolate } from 'remotion';

export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

/** 0→1 progress of `frame` over [start, start+duration], eased and clamped. */
export function progress(frame: number, start: number, duration: number, easing: (t: number) => number = easeOut): number {
  if (duration <= 0) return frame >= start ? 1 : 0;
  return interpolate(frame, [start, start + duration], [0, 1], {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

/** Fade-in over `inDur` from `start`, fade-out over `outDur` ending at `end`. */
export function fadeWindow(frame: number, start: number, end: number, inDur: number, outDur: number): number {
  return Math.min(progress(frame, start, inDur), 1 - progress(frame, end - outDur, outDur, easeInOut));
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
