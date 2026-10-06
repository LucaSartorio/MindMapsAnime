import type { CSSProperties } from 'react';
import { AbsoluteFill, Composition, Img, staticFile } from 'remotion';
import { VERTICAL_FORMAT } from '../config/defaults';
import { fitFontSize, useBrandFonts } from '../lib/fonts';
import { COLORS, FONTS, SAFE } from '../lib/theme';
import { Backdrop } from './Backdrop';
import { BrandMark } from './BrandMark';
import { Kicker } from './Kicker';

/**
 * Automatic cover (thumbnail) of a video: a 1080×1920 still rendered next to
 * the MP4 (`<stem>.cover.png`). Strong AniMapVerse identity (ink, grid, brand
 * mark, Cinzel title) + per-ANIME accent (the world's theme colour) + per-FORMAT
 * badge/layout, so journey / guess / versus covers are recognisable at a glance.
 */
export type CoverFormat = 'journey' | 'guess' | 'versus';
export type CoverProps = {
  format: CoverFormat;
  /** "Goku's Journey" · "Guess the character" · "Naruto vs Luffy". */
  title: string;
  subtitle?: string;
  /** Small line above the title (world title(s)). */
  kicker: string;
  /** Badge (e.g. "Part 1 of 5"). */
  badge?: string;
  /** Format label shown in the pill (JOURNEY / GUESS / VERSUS). */
  formatLabel: string;
  /** World theme colour(s): accent of the cover (versus: one per side). */
  accents: string[];
  /** Map image(s) behind the title (public-dir relative). */
  backgrounds: string[];
  /** Versus only: the two names. */
  sides?: [string, string];
};

const FORMAT_COLOR: Record<CoverFormat, string> = { journey: COLORS.red500, guess: '#f5b21a', versus: '#1f9aff' };
export const COVER_COMPOSITION_ID = 'SocialCover';

export function coverText(p: CoverProps): string {
  return [p.title, p.subtitle ?? '', p.kicker, p.badge ?? '', p.formatLabel, ...(p.sides ?? [])].join(' ');
}

function MapBackground({ src, accent, style }: { src?: string; accent: string; style?: CSSProperties }) {
  return (
    <div style={{ position: 'absolute', overflow: 'hidden', ...style }}>
      {src ? <Img src={staticFile(src)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }} /> : null}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${COLORS.ink950}ee 0%, ${COLORS.ink950}55 40%, ${COLORS.ink950}aa 70%, ${COLORS.ink950} 100%)` }} />
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 90% 55% at 50% 45%, ${accent}44, transparent 70%)` }} />
    </div>
  );
}

export function Cover(props: CoverProps) {
  useBrandFonts(coverText(props));
  const { width, height } = VERTICAL_FORMAT;
  const accent = props.accents[0] ?? COLORS.red500;
  const maxWidth = width - SAFE.side * 2;
  const titleSize = fitFontSize(props.title, { maxWidth, maxLines: 3, max: 132, min: 72, glyph: 0.62 });
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink950, fontFamily: FONTS.sans }}>
      <Backdrop />
      {props.format === 'versus' ? (
        <>
          <MapBackground src={props.backgrounds[0]} accent={props.accents[0] ?? accent} style={{ left: 0, right: 0, top: 0, height: height / 2 }} />
          <MapBackground src={props.backgrounds[1] ?? props.backgrounds[0]} accent={props.accents[1] ?? accent} style={{ left: 0, right: 0, top: height / 2, height: height / 2 }} />
        </>
      ) : (
        <MapBackground src={props.backgrounds[0]} accent={accent} style={{ inset: 0 }} />
      )}
      <AbsoluteFill style={{ padding: `${SAFE.top}px ${SAFE.side}px ${SAFE.bottom}px`, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40, width: maxWidth }}>
          <div style={{ padding: '12px 30px', borderRadius: 999, background: FORMAT_COLOR[props.format], color: COLORS.ink950, fontFamily: FONTS.mono, fontWeight: 500, fontSize: 30, letterSpacing: '0.22em' }}>
            {props.formatLabel}
          </div>
          <Kicker color={COLORS.ink100} size={30}>{props.kicker}</Kicker>
          {props.format === 'versus' && props.sides ? (
            <VersusTitle sides={props.sides} accents={props.accents} maxWidth={maxWidth} />
          ) : (
            <div style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: titleSize, lineHeight: 1.05, color: COLORS.white, textShadow: `0 6px 40px ${accent}88, 0 4px 20px rgba(0,0,0,0.8)` }}>
              {props.format === 'guess' ? '?' : null}
              {props.format === 'guess' ? <br /> : null}
              {props.title}
            </div>
          )}
          {props.subtitle && <div style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 48, color: COLORS.ink100 }}>{props.subtitle}</div>}
          {props.badge && (
            <div style={{ padding: '14px 36px', borderRadius: 999, border: `3px solid ${accent}`, color: COLORS.white, fontFamily: FONTS.sans, fontWeight: 800, fontSize: 44 }}>{props.badge}</div>
          )}
        </div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: SAFE.bottom - 120, display: 'flex', justifyContent: 'center' }}>
        <BrandMark size={64} />
      </div>
    </AbsoluteFill>
  );
}

export function VersusTitle({ sides, accents, maxWidth, scale = 1 }: { sides: [string, string]; accents: string[]; maxWidth: number; scale?: number }) {
  const size = (name: string) => fitFontSize(name, { maxWidth, maxLines: 2, max: 104 * scale, min: 60 * scale, glyph: 0.62 });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 * scale }}>
      <div style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: size(sides[0]), lineHeight: 1.05, color: COLORS.white, textShadow: `0 6px 40px ${accents[0] ?? COLORS.red500}aa` }}>{sides[0]}</div>
      <div style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 88 * scale, color: COLORS.red500, letterSpacing: '0.04em' }}>VS</div>
      <div style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: size(sides[1]), lineHeight: 1.05, color: COLORS.white, textShadow: `0 6px 40px ${accents[1] ?? COLORS.red500}aa` }}>{sides[1]}</div>
    </div>
  );
}

const EXAMPLE_COVER: CoverProps = {
  format: 'journey',
  title: "Itachi Uchiha's Journey",
  kicker: 'Naruto',
  formatLabel: 'JOURNEY',
  accents: ['#f06600'],
  backgrounds: [],
};

/** Registered in Root: rendered as a still (frame 0) after each video. */
export function CoverComposition() {
  return (
    <Composition
      id={COVER_COMPOSITION_ID}
      component={Cover}
      width={VERTICAL_FORMAT.width}
      height={VERTICAL_FORMAT.height}
      fps={VERTICAL_FORMAT.fps}
      durationInFrames={VERTICAL_FORMAT.fps}
      defaultProps={EXAMPLE_COVER}
    />
  );
}
