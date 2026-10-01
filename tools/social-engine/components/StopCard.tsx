import { fitFontSize } from '../lib/fonts';
import { COLORS, FONTS, SAFE } from '../lib/theme';

/** Lower card describing the current stop: counter + progress, event title, place, arc. */
export function StopCard({ index, count, stopLabel, title, place, arc, appear, frameWidth }: {
  index: number;
  count: number;
  stopLabel: string;
  title: string;
  place: string;
  arc?: string;
  appear: number;
  frameWidth: number;
}) {
  if (appear <= 0) return null;
  const inner = frameWidth - SAFE.side * 2 - 80;
  const titleSize = fitFontSize(title, { maxWidth: inner, maxLines: 2, max: 60, min: 40, glyph: 0.54 });
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.side,
        right: SAFE.side,
        bottom: SAFE.bottom,
        opacity: appear,
        transform: `translateY(${(1 - appear) * 36}px)`,
        padding: '34px 40px 36px',
        borderRadius: 28,
        background: 'rgba(12,13,17,0.88)',
        border: `2px solid ${COLORS.ink600}`,
        borderLeft: `8px solid ${COLORS.red500}`,
        boxShadow: '0 18px 50px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: FONTS.mono, fontWeight: 500, fontSize: 26, letterSpacing: '0.18em', color: COLORS.red500, textTransform: 'uppercase' }}>
          {stopLabel} {pad(index + 1)} / {pad(count)}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {Array.from({ length: count }, (_, i) => (
            <div key={i} style={{ width: i === index ? 34 : 14, height: 14, borderRadius: 7, background: i <= index ? COLORS.red500 : COLORS.ink500 }} />
          ))}
        </div>
      </div>
      <div style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: titleSize, lineHeight: 1.1, color: COLORS.white, letterSpacing: '-0.01em' }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontFamily: FONTS.sans, fontWeight: 500, fontSize: 32, color: COLORS.ink200 }}>
          {/* Pin dot drawn in CSS: a glyph like ◉ isn't in the brand fonts and would come from the OS. */}
          <span style={{ width: 16, height: 16, borderRadius: '50%', border: `3px solid ${COLORS.red500}`, boxSizing: 'border-box', flexShrink: 0 }} />
          {place}
        </span>
        {arc && (
          <span
            style={{
              fontFamily: FONTS.sans,
              fontWeight: 600,
              fontSize: 24,
              color: COLORS.ink100,
              padding: '6px 16px',
              borderRadius: 999,
              border: `1.5px solid ${COLORS.ink500}`,
              background: COLORS.ink800,
            }}
          >
            {arc}
          </span>
        )}
      </div>
    </div>
  );
}
