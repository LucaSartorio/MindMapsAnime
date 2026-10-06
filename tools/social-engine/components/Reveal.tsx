import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { progress } from '../lib/easing';
import { fitFontSize } from '../lib/fonts';
import { COLORS, FONTS, SAFE } from '../lib/theme';
import { Kicker } from './Kicker';

/**
 * Big answer reveal (guess / versus): a flash, the name springing in with a
 * glow in the world's accent colour, then a detail line. Pure function of the frame.
 */
export function Reveal({ kicker, title, detail, accent = COLORS.red500, start }: { kicker: string; title: string; detail?: string; accent?: string; start: number }) {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const local = frame - start;
  const flash = Math.max(0, 1 - local / 8);
  const pop = spring({ frame: local - 2, fps, config: { damping: 12, stiffness: 140 } });
  const line = progress(frame, start + 14, 12);
  const size = fitFontSize(title, { maxWidth: width - SAFE.side * 2, maxLines: 2, max: 128, min: 70, glyph: 0.62 });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: `rgba(7,7,9,${0.78 * progress(frame, start, 6)})` }}>
      <AbsoluteFill style={{ background: COLORS.white, opacity: flash * 0.5 }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30, padding: `0 ${SAFE.side}px`, textAlign: 'center', marginTop: -60 }}>
        <Kicker color={accent} size={32} style={{ opacity: Math.min(1, pop * 1.5) }}>{kicker}</Kicker>
        <div style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: size, lineHeight: 1.04, color: COLORS.white, transform: `scale(${0.6 + 0.4 * pop})`, opacity: Math.min(1, pop * 1.4), textShadow: `0 0 50px ${accent}aa, 0 6px 30px rgba(0,0,0,0.8)` }}>
          {title}
        </div>
        {detail && <div style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: 40, color: COLORS.ink100, opacity: line, transform: `translateY(${(1 - line) * 18}px)` }}>{detail}</div>}
      </div>
    </AbsoluteFill>
  );
}
