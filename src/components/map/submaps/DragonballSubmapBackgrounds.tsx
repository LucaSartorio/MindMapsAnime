import type { MapLevel } from '@/types';

/**
 * Sfondi SVG dedicati per le sotto-mappe di Dragon Ball.
 *
 * Attualmente copre lo «Spazio (GT)»: una carta stellare generata localmente
 * (campo di stelle deterministico, nebulosa e orbite tratteggiate) su cui sono
 * ancorati i pin dei pianeti percorsi in Dragon Ball GT. Nessun asset ufficiale
 * — solo forme geometriche. viewBox = width×height del relativo MapLevel.
 */

interface Props {
  level: MapLevel;
}

/** PRNG deterministico (mulberry32) per un campo di stelle stabile tra render. */
function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getDragonballSubmapBackground(level: MapLevel): React.ReactNode | null {
  if (level.slug === 'gt-space') return <GtSpaceBackground level={level} />;
  return null;
}

function GtSpaceBackground({ level }: Props) {
  const { width: w, height: h } = level;
  const rng = makeRng(0x67740007); // seed fisso → stelle stabili
  const stars = Array.from({ length: 220 }, () => ({
    cx: rng() * w,
    cy: rng() * h,
    r: rng() * 1.6 + 0.3,
    o: rng() * 0.6 + 0.2,
  }));
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <radialGradient id="gt-space-bg" cx="50%" cy="45%" r="75%">
          <stop offset="0%" stopColor="#0b1024" />
          <stop offset="55%" stopColor="#070813" />
          <stop offset="100%" stopColor="#03040a" />
        </radialGradient>
        <radialGradient id="gt-nebula" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(120,90,200,0.20)" />
          <stop offset="100%" stopColor="rgba(120,90,200,0)" />
        </radialGradient>
        <radialGradient id="gt-nebula-2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(210,110,60,0.16)" />
          <stop offset="100%" stopColor="rgba(210,110,60,0)" />
        </radialGradient>
      </defs>

      <rect width={w} height={h} fill="url(#gt-space-bg)" />
      {/* Nebulose morbide */}
      <ellipse cx={w * 0.30} cy={h * 0.32} rx={w * 0.32} ry={h * 0.28} fill="url(#gt-nebula)" />
      <ellipse cx={w * 0.74} cy={h * 0.68} rx={w * 0.30} ry={h * 0.26} fill="url(#gt-nebula-2)" />

      {/* Campo stellare */}
      {stars.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#dfe6ff" opacity={s.o} />
      ))}

      {/* Orbite tratteggiate concentriche attorno alla Terra (centro) come guida visiva */}
      <g fill="none" stroke="rgba(150,170,230,0.18)" strokeWidth="1.5" strokeDasharray="7 11">
        <ellipse cx={w / 2} cy={h / 2} rx={w * 0.18} ry={h * 0.16} />
        <ellipse cx={w / 2} cy={h / 2} rx={w * 0.32} ry={h * 0.29} />
        <ellipse cx={w / 2} cy={h / 2} rx={w * 0.45} ry={h * 0.42} />
      </g>

      <text
        x="40"
        y={h - 26}
        fill="rgba(200,210,255,0.4)"
        fontSize="15"
        fontFamily="JetBrains Mono, monospace"
      >
        ※ Spazio (GT) · Sfere del Drago Nere · schema stellare · posizioni indicative
      </text>
    </svg>
  );
}
