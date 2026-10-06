import type { CSSProperties } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { easeInOut, progress } from '../lib/easing';
import { fitFontSize } from '../lib/fonts';
import { COLORS, FONTS, SAFE } from '../lib/theme';
import { Kicker } from './Kicker';

/** A number counting up from 0 to `value` between `start` and `start + duration`. */
export function CountUp({ value, start, duration, style }: { value: number; start: number; duration: number; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  return <span style={style}>{Math.round(value * progress(frame, start, duration, easeInOut))}</span>;
}

export type VersusEntry = { name: string; world: string; value: number; secondary: string; accent: string; winner: boolean };

/**
 * Side-by-side comparison: two labelled bars growing to their value (scaled
 * on the larger one), the winner's bar outlined. Reused by the reveal frame.
 */
export function VersusBars({ title, unit, entries, start }: { title: string; unit: string; entries: [VersusEntry, VersusEntry]; start: number }) {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const max = Math.max(1, ...entries.map((e) => e.value));
  const grow = progress(frame, start + 6, 30, easeInOut);
  const inner = width - SAFE.side * 2;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', padding: `0 ${SAFE.side}px`, opacity: progress(frame, start, 8) }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 54, marginTop: -40 }}>
        <Kicker size={32}>{title}</Kicker>
        {entries.map((e, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20 }}>
              <div style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: fitFontSize(e.name, { maxWidth: inner * 0.7, maxLines: 1, max: 62, min: 38, glyph: 0.62 }), color: COLORS.white, whiteSpace: 'nowrap' }}>{e.name}</div>
              <div style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 72, color: COLORS.white }}>{Math.round(e.value * grow)}</div>
            </div>
            <div style={{ height: 44, borderRadius: 22, background: COLORS.ink700, overflow: 'hidden', border: e.winner && grow >= 1 ? `3px solid ${COLORS.white}` : `3px solid transparent` }}>
              <div style={{ height: '100%', width: `${(e.value / max) * 100 * grow}%`, background: e.accent, borderRadius: 22, boxShadow: `0 0 30px ${e.accent}88` }} />
            </div>
            <div style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: 30, color: COLORS.ink200 }}>{`${e.world} · ${unit} · ${e.secondary}`}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
}
