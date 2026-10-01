import type { CSSProperties, ReactNode } from 'react';
import { COLORS, FONTS } from '../lib/theme';

/** Small uppercase, letter-spaced label (section kickers, counters). */
export function Kicker({ children, color = COLORS.red500, size = 28, style }: { children: ReactNode; color?: string; size?: number; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontFamily: FONTS.mono,
        fontWeight: 500,
        fontSize: size,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
