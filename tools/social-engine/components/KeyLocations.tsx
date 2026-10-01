import { useCurrentFrame } from 'remotion';
import { progress } from '../lib/easing';
import { COLORS, FONTS, SAFE } from '../lib/theme';

export type KeyLocationItem = { number: number; name: string; detail: string };

/** Recap panel: 3–5 key places of the journey + whole-journey stats, staggered in. */
export function KeyLocations({ heading, stats, items, start, appear }: {
  heading: string;
  stats: string;
  items: KeyLocationItem[];
  start: number;
  appear: number;
}) {
  const frame = useCurrentFrame();
  if (appear <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.side,
        right: SAFE.side,
        bottom: SAFE.bottom - 40,
        opacity: appear,
        padding: '34px 38px',
        borderRadius: 28,
        background: 'rgba(12,13,17,0.9)',
        border: `2px solid ${COLORS.ink600}`,
        boxShadow: '0 18px 50px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20 }}>
        <span style={{ fontFamily: FONTS.mono, fontWeight: 500, fontSize: 26, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.red500 }}>{heading}</span>
        <span style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: 26, color: COLORS.ink300 }}>{stats}</span>
      </div>
      {items.map((item, i) => {
        const p = progress(frame, start + 8 + i * 5, 12);
        return (
          <div key={item.number} style={{ display: 'flex', alignItems: 'center', gap: 24, opacity: p, transform: `translateX(${(1 - p) * 40}px)` }}>
            <div
              style={{
                width: 58,
                height: 58,
                flexShrink: 0,
                borderRadius: '50%',
                background: COLORS.red600,
                border: `3px solid ${COLORS.white}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONTS.sans,
                fontWeight: 800,
                fontSize: 26,
                color: COLORS.white,
              }}
            >
              {item.number}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 38, color: COLORS.white, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
              <span style={{ fontFamily: FONTS.sans, fontWeight: 500, fontSize: 27, color: COLORS.ink300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.detail}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
