import { AbsoluteFill } from 'remotion';
import { COLORS } from '../lib/theme';

/** Brand backdrop: ink black, faint atlas grid, a low red glow (same mood as the site/OG image). */
export function Backdrop() {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink950 }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '54px 54px',
        }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 45% at 50% 100%, ${COLORS.red700}55, transparent 70%)` }} />
    </AbsoluteFill>
  );
}
