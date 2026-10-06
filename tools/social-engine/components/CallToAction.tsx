import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { progress } from '../lib/easing';
import { fitFontSize } from '../lib/fonts';
import { COLORS, FONTS, SAFE } from '../lib/theme';
import { Kicker } from './Kicker';

/**
 * Closing card. Engagement first: the CTA (follow / comment / next part) is the
 * headline; the AniMapVerse mark and the domain stay as a smaller signature.
 */
export function CallToAction({ cta, kicker, tagline, siteLabel, pageLabel, start }: {
  cta: string;
  /** Optional small line above the CTA (series: "Next: Part 3 of 5"). */
  kicker?: string;
  tagline: string;
  siteLabel: string;
  pageLabel: string;
  start: number;
}) {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const local = frame - start;
  const veil = progress(frame, start, 12);
  const logo = spring({ frame: local - 4, fps, config: { damping: 16, stiffness: 120 } });
  const text = progress(frame, start + 12, 12);
  const url = progress(frame, start + 20, 12);
  const ctaSize = fitFontSize(cta, { maxWidth: width - SAFE.side * 2, maxLines: 3, max: 84, min: 48, glyph: 0.56 });
  return (
    <AbsoluteFill style={{ background: `rgba(7,7,9,${0.9 * veil})`, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34, padding: `0 ${SAFE.side}px`, marginTop: -60, textAlign: 'center' }}>
        <Img src={staticFile('icon-512.png')} style={{ width: 220, height: 220, opacity: Math.min(1, logo * 1.4), transform: `scale(${0.7 + 0.3 * logo})` }} />
        <div style={{ opacity: text, transform: `translateY(${(1 - text) * 20}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <div style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 64, color: COLORS.white, lineHeight: 1 }}>AniMapVerse</div>
          <Kicker color={COLORS.ink300} size={24}>{tagline}</Kicker>
        </div>
        {kicker && (
          <Kicker color={COLORS.red500} size={26} style={{ opacity: text, marginTop: 14, marginBottom: -18 }}>
            {kicker}
          </Kicker>
        )}
        <div style={{ opacity: text, transform: `scale(${0.94 + 0.06 * text})`, fontFamily: FONTS.sans, fontWeight: 800, fontSize: ctaSize, lineHeight: 1.12, color: COLORS.white, maxWidth: width - SAFE.side * 2, marginTop: 20, textShadow: `0 6px 30px ${COLORS.red500}55` }}>
          {cta}
        </div>
        <div style={{ opacity: url, transform: `scale(${0.92 + 0.08 * url})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{ padding: '12px 34px', borderRadius: 999, background: COLORS.red500, fontFamily: FONTS.sans, fontWeight: 800, fontSize: 34, color: COLORS.white, boxShadow: `0 10px 40px ${COLORS.red500}66` }}>
            {siteLabel}
          </div>
          {pageLabel !== siteLabel && (
            <div style={{ fontFamily: FONTS.mono, fontWeight: 500, fontSize: 24, color: COLORS.ink300 }}>{pageLabel}</div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
}
