import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { easeInOut, progress } from '../lib/easing';
import { fitFontSize } from '../lib/fonts';
import { COLORS, FONTS, SAFE } from '../lib/theme';
import { Kicker } from './Kicker';

/**
 * Opening hook (first ~2 s): one big, mobile-readable line (≤ 2 lines),
 * words rising in quickly, a red underline drawing, then a short exit.
 * Restrained on purpose — the text must be readable from frame ~10.
 */
export function Hook({ text, kicker, end }: { text: string; kicker: string; end: number }) {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const maxWidth = width - SAFE.side * 2 - 40;
  const fontSize = fitFontSize(text, { maxWidth, maxLines: 2, max: 118, min: 64, glyph: 0.55 });
  const words = text.split(/\s+/);
  const exit = progress(frame, end - 8, 8, easeInOut);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: `0 ${SAFE.side}px`,
        opacity: 1 - exit,
        transform: `translateY(${-40 * exit}px)`,
      }}
    >
      <div style={{ width: maxWidth, display: 'flex', flexDirection: 'column', gap: 36, marginTop: -80 }}>
        <Kicker style={{ opacity: progress(frame, 0, 8) }}>{kicker}</Kicker>
        <div
          style={{
            fontFamily: FONTS.sans,
            fontWeight: 800,
            fontSize,
            lineHeight: 1.06,
            letterSpacing: '-0.02em',
            color: COLORS.white,
            textShadow: '0 4px 30px rgba(0,0,0,0.6)',
          }}
        >
          {words.map((word, i) => {
            const p = progress(frame, 2 + i * 2, 10);
            return (
              <span key={i} style={{ display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 34}px)`, marginRight: '0.26em' }}>
                {word}
              </span>
            );
          })}
        </div>
        <div style={{ height: 10, width: 260 * progress(frame, 8 + words.length * 2, 14), background: COLORS.red500, borderRadius: 5 }} />
      </div>
    </AbsoluteFill>
  );
}
