import { useCurrentFrame, useVideoConfig } from 'remotion';
import { progress } from '../lib/easing';
import { COLORS, FONTS, SAFE } from '../lib/theme';

/** Row of step dots (clue 3 of 5): filled up to `current`, the active one in red. */
export function StepDots({ count, current, appear = 1 }: { count: number; current: number; appear?: number }) {
  return (
    <div style={{ display: 'flex', gap: 14, opacity: appear }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{ width: i === current ? 46 : 18, height: 18, borderRadius: 9, background: i < current ? COLORS.ink100 : i === current ? COLORS.red500 : COLORS.ink600, transition: 'none' }} />
      ))}
    </div>
  );
}

/**
 * "Time to guess" countdown: a ring that empties over `duration` frames with
 * the remaining seconds in the middle. Used before every reveal.
 */
export function Countdown({ start, duration, label }: { start: number; duration: number; label: string }) {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  if (frame < start || frame >= start + duration) return null;
  const t = progress(frame, start, duration, (x) => x);
  const left = Math.max(1, Math.ceil((start + duration - frame) / fps));
  const r = 120;
  const c = 2 * Math.PI * r;
  const appear = progress(frame, start, 8);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: SAFE.bottom + 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, opacity: appear }}>
      <div style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 56, color: COLORS.white, textShadow: '0 4px 24px rgba(0,0,0,0.8)', maxWidth: width - SAFE.side * 2, textAlign: 'center' }}>{label}</div>
      <svg width={r * 2 + 24} height={r * 2 + 24}>
        <circle cx={r + 12} cy={r + 12} r={r} fill="rgba(7,7,9,0.8)" stroke={COLORS.ink600} strokeWidth={14} />
        <circle cx={r + 12} cy={r + 12} r={r} fill="none" stroke={COLORS.red500} strokeWidth={14} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * t} transform={`rotate(-90 ${r + 12} ${r + 12})`} />
        <text x={r + 12} y={r + 12} textAnchor="middle" dominantBaseline="central" fill={COLORS.white} style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 110 }}>
          {left}
        </text>
      </svg>
    </div>
  );
}
