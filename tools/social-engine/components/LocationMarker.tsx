import { COLORS, FONTS } from '../lib/theme';

/**
 * Numbered journey pin (screen space, constant size). `appear` 0..1 pops it in;
 * `active` adds the pulse rings (`pulse` = 0..1 phase, driven by the frame).
 */
export function LocationMarker({ x, y, index, appear, active, pulse, emphasis = 1, dim = false }: {
  x: number;
  y: number;
  index: number;
  appear: number;
  active: boolean;
  pulse: number;
  emphasis?: number;
  dim?: boolean;
}) {
  if (appear <= 0) return null;
  const r = 26 * emphasis;
  const scale = appear < 1 ? 0.4 + 0.6 * appear + Math.sin(appear * Math.PI) * 0.25 : 1;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 0,
        height: 0,
        opacity: dim ? 0.55 : Math.min(1, appear * 1.5),
        transform: `scale(${scale})`,
      }}
    >
      {active &&
        [0, 0.5].map((offset) => {
          const t = (pulse + offset) % 1;
          return (
            <div
              key={offset}
              style={{
                position: 'absolute',
                left: -(r + 44 * t),
                top: -(r + 44 * t),
                width: (r + 44 * t) * 2,
                height: (r + 44 * t) * 2,
                borderRadius: '50%',
                border: `3px solid ${COLORS.red500}`,
                opacity: 0.8 * (1 - t),
              }}
            />
          );
        })}
      <div
        style={{
          position: 'absolute',
          left: -r,
          top: -r,
          width: r * 2,
          height: r * 2,
          borderRadius: '50%',
          background: active ? COLORS.red500 : COLORS.red600,
          border: `${Math.round(4 * emphasis)}px solid ${COLORS.white}`,
          boxShadow: `0 0 ${active ? 30 : 14}px ${COLORS.red500}aa, 0 4px 14px rgba(0,0,0,0.6)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONTS.sans,
          fontWeight: 800,
          fontSize: 24 * emphasis,
          color: COLORS.white,
        }}
      >
        {index + 1}
      </div>
    </div>
  );
}
