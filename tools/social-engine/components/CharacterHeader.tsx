import { COLORS, FONTS, SAFE } from '../lib/theme';
import { BrandMark } from './BrandMark';

/**
 * Persistent top HUD of character videos: brand, monogram (used instead of a
 * portrait: no official artwork is ever pulled in), name and tagline.
 */
export function CharacterHeader({ name, initials, tagline, kicker, badge, appear }: {
  name: string;
  initials: string;
  tagline?: string;
  kicker: string;
  /** Series position ("Part 2 of 5"): a discreet outlined pill next to the kicker. */
  badge?: string;
  appear: number;
}) {
  if (appear <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: SAFE.top - 40,
        left: SAFE.side,
        right: SAFE.side,
        opacity: appear,
        transform: `translateY(${(1 - appear) * -24}px)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 26,
      }}
    >
      <BrandMark size={50} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <div
          style={{
            width: 118,
            height: 118,
            flexShrink: 0,
            borderRadius: '50%',
            border: `4px solid ${COLORS.red500}`,
            background: `radial-gradient(circle at 35% 30%, ${COLORS.ink600}, ${COLORS.ink900})`,
            boxShadow: `0 0 28px ${COLORS.red500}66`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONTS.display,
            fontWeight: 700,
            fontSize: 46,
            color: COLORS.white,
          }}
        >
          {initials}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontFamily: FONTS.mono, fontWeight: 500, fontSize: 24, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.red500 }}>
              {kicker}
            </span>
            {badge && (
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontWeight: 500,
                  fontSize: 20,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: COLORS.ink100,
                  padding: '4px 12px',
                  borderRadius: 999,
                  border: `1.5px solid ${COLORS.red500}`,
                  whiteSpace: 'nowrap',
                }}
              >
                {badge}
              </span>
            )}
          </div>
          <div style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: name.length > 18 ? 60 : 72, lineHeight: 1.02, color: COLORS.white, textShadow: '0 4px 24px rgba(0,0,0,0.7)' }}>
            {name}
          </div>
          {tagline && (
            <div style={{ fontFamily: FONTS.sans, fontWeight: 500, fontSize: 30, color: COLORS.ink200 }}>{tagline}</div>
          )}
        </div>
      </div>
    </div>
  );
}
