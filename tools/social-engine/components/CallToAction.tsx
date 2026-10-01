import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { progress } from '../lib/easing';
import { fitFontSize } from '../lib/fonts';
import { COLORS, FONTS, SAFE } from '../lib/theme';
import { Kicker } from './Kicker';

/** Closing card: AniMapVerse mark, a calm CTA, the domain and the exact page path. */
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
  const ctaSize = fitFontSize(cta, { maxWidth: width - SAFE.side * 2, maxLines: 2, max: 56, min: 40, glyph: 0.54 });
  return (
    <AbsoluteFill style={{ background: `rgba(7,7,9,${0.9 * veil})`, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34, padding: `0 ${SAFE.side}px`, marginTop: -60, textAlign: 'center' }}>
        <Img src={staticFile('icon-512.png')} style={{ width: 300, height: 300, opacity: Math.min(1, logo * 1.4), transform: `scale(${0.7 + 0.3 * logo})` }} />
        <div style={{ opacity: text, transform: `translateY(${(1 - text) * 20}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <div style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 88, color: COLORS.white, lineHeight: 1 }}>AniMapVerse</div>
          <Kicker color={COLORS.ink300} size={24}>{tagline}</Kicker>
        </div>
        {kicker && (
          <Kicker color={COLORS.red500} size={26} style={{ opacity: text, marginTop: 14, marginBottom: -18 }}>
            {kicker}
          </Kicker>
        )}
        <div style={{ opacity: text, fontFamily: FONTS.sans, fontWeight: 600, fontSize: ctaSize, lineHeight: 1.18, color: COLORS.ink100, maxWidth: width - SAFE.side * 2, marginTop: 20 }}>
          {cta}
        </div>
        <div style={{ opacity: url, transform: `scale(${0.92 + 0.08 * url})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{ padding: '18px 44px', borderRadius: 999, background: COLORS.red500, fontFamily: FONTS.sans, fontWeight: 800, fontSize: 46, color: COLORS.white, boxShadow: `0 10px 40px ${COLORS.red500}66` }}>
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
