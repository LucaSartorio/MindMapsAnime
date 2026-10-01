import { useVideoConfig } from 'remotion';
import { COLORS, FONTS, SAFE } from '../lib/theme';

/**
 * Place name callout above a pin, kept inside the safe area. Width is
 * estimated (deterministic) to clamp it horizontally without DOM measuring.
 */
export function LocationLabel({ x, y, text, opacity, size = 34, offset = 52 }: { x: number; y: number; text: string; opacity: number; size?: number; offset?: number }) {
  const { width } = useVideoConfig();
  if (opacity <= 0) return null;
  const estWidth = text.length * size * 0.58 + 48;
  const half = estWidth / 2;
  const cx = Math.min(Math.max(x, SAFE.side + half), width - SAFE.side - half);
  return (
    <div
      style={{
        position: 'absolute',
        left: cx,
        top: y - offset,
        transform: `translate(-50%, -100%) translateY(${(1 - opacity) * 14}px)`,
        opacity,
        padding: `${size * 0.28}px ${size * 0.6}px`,
        borderRadius: 999,
        background: 'rgba(7,7,9,0.86)',
        border: `2px solid ${COLORS.ink500}`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.55)',
        fontFamily: FONTS.sans,
        fontWeight: 700,
        fontSize: size,
        color: COLORS.white,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
}
