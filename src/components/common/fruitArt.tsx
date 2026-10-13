import type { ReactNode } from 'react';
import type { FruitLook } from '@/types';
import { shade } from '@/utils/entityImage';

/**
 * Illustrazione di un frutto (One Piece: i Frutti del Diavolo) da una specifica
 * dichiarativa (`FruitLook`, scritta nei dati del mondo).
 *
 * Il disegno è ricostruito da DESCRIZIONI testuali (sagoma, colori, stelo,
 * dettagli) con forme geometriche proprie: nessuna immagine ufficiale è scaricata,
 * ricalcata o inclusa. Le parti di una sagoma sono unite in un'unica silhouette
 * (contorno comune), poi coperte dalle spirali tipiche e da un'ombreggiatura.
 *
 * Coordinate nel `viewBox="0 0 100 100"` di `EntityImage`.
 */

const INK = '#1c1a24';

/* ------------------------------ Primitive ------------------------------ */

const circ = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} A${r} ${r} 0 1 0 ${cx + r} ${cy} A${r} ${r} 0 1 0 ${cx - r} ${cy} Z`;
const ell = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx} ${cy} A${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;
const rr = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h - r} A${r} ${r} 0 0 1 ${x + w - r} ${y + h} ` +
  `H${x + r} A${r} ${r} 0 0 1 ${x} ${y + h - r} V${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`;
/** Goccia con la punta in alto. */
const tear = (x: number, y: number, s: number) =>
  `M${x} ${y - 9 * s} C${x + 5 * s} ${y - 3 * s} ${x + 7 * s} ${y + 2 * s} ${x + 6 * s} ${y + 5 * s} ` +
  `C${x + 4 * s} ${y + 9 * s} ${x - 4 * s} ${y + 9 * s} ${x - 6 * s} ${y + 5 * s} ` +
  `C${x - 7 * s} ${y + 2 * s} ${x - 5 * s} ${y - 3 * s} ${x} ${y - 9 * s} Z`;
const HEART =
  'M50 84 C34 72 24 62 24 48 C24 38 31 32 39 32 C45 32 48 35 50 39 C52 35 55 32 61 32 C69 32 76 38 76 48 C76 62 66 72 50 84 Z';
const PEAR =
  'M50 30 C58 30 60 38 61 44 C63 52 74 58 74 69 C74 80 63 86 50 86 C37 86 26 80 26 69 C26 58 37 52 39 44 C40 38 42 30 50 30 Z';
const APPLE =
  'M50 39 C56 32 72 30 76 46 C80 62 70 84 58 84 C54 84 52 82 50 82 C48 82 46 84 42 84 C30 84 20 62 24 46 C28 30 44 32 50 39 Z';

/** Spirale tipica dei Frutti del Diavolo (glifo centrato su 0,0). */
const SWIRL = 'M-3.4 1.6 C-3.8 -2.6 2.8 -3.6 3.4 -0.2 C3.8 2.2 1 3.2 -0.4 1.9 C-1.5 1 -0.6 -0.7 0.7 -0.2';

interface Part {
  d: string;
  /** 0 = color, 1 = color2, 2 = color3. */
  fill?: 0 | 1 | 2;
  transform?: string;
  /** Spirale propria della parte: [x, y, scala]. */
  swirl?: [number, number, number];
}

interface Colors {
  c: [string, string, string];
  swirl: string;
  uid: string;
}

interface Body {
  parts: Part[];
  /** Punto d'attacco dello stelo. */
  top: [number, number];
  /** Centro e raggio indicativi (per scintille, orecchie…). */
  center: [number, number, number];
  /** Spirali ripetute su tutta la silhouette (altrimenti solo quelle delle parti). */
  tile?: boolean;
  /** Spirali aggiuntive in posizioni fisse (colore principale). */
  swirls?: [number, number, number][];
  /** Disegno dentro la sagoma (sotto l'ombreggiatura). */
  inner?: (c: Colors) => ReactNode;
  /** Disegno sopra tutto (occhi, tagli, crepe…). */
  over?: (c: Colors) => ReactNode;
  /** Parti disegnate una per una, ognuna col suo contorno (caschi di banane). */
  separate?: boolean;
  /** Dettaglio subito sopra la parte `i` (solo con `separate`). */
  partOver?: (i: number, c: Colors) => ReactNode;
}

const sw = (x: number, y: number, s = 1): [number, number, number] => [x, y, s];

function Swirl({ x, y, s, color }: { x: number; y: number; s: number; color: string }) {
  return (
    <path
      d={SWIRL}
      transform={`translate(${x} ${y}) scale(${s})`}
      fill="none"
      stroke={color}
      strokeWidth={1.2 / s}
      strokeLinecap="round"
    />
  );
}

/* ------------------------------- Sagome ------------------------------- */

/** Grappolo di componenti, ognuno con la sua spirale. */
function cluster(points: [number, number][], make: (x: number, y: number) => string, s = 0.9): Part[] {
  return points.map(([x, y]) => ({ d: make(x, y), swirl: sw(x, y + 1, s) }));
}

/** Casco di sezioni allungate (banane) che salgono a ventaglio da un perno in basso. */
/** Dall'esterno al centro: la sezione centrale è disegnata per ultima, sopra le altre. */
const FAN_ANGLES = [-50, 50, -25, 25, 0];
function fan(pivot: [number, number], len: number, w: number): Part[] {
  const [px, py] = pivot;
  const r = w / 2;
  // Sezione a banana: stretta al perno, punta arrotondata, leggermente curva.
  const d =
    `M${px - 1.5} ${py} C${px - r - 2} ${py - len * 0.35} ${px - r - 1} ${py - len + r * 2} ${px - r} ${py - len + r} ` +
    `A${r} ${r} 0 0 1 ${px + r} ${py - len + r} C${px + r + 1} ${py - len + r * 2} ${px + r} ${py - len * 0.35} ${px + 1.5} ${py} Z`;
  return FAN_ANGLES.map((a) => {
    const rad = (a * Math.PI) / 180;
    const k = len - r - 1;
    return { d, transform: `rotate(${a} ${px} ${py})`, swirl: sw(px + Math.sin(rad) * k, py - Math.cos(rad) * k, 0.8) };
  });
}

const FLAME_POINTS: [number, number][] = [
  [43, 41], [57, 41], [34, 53], [50, 52], [66, 53], [39, 65], [55, 65], [69, 66], [31, 66], [46, 77], [60, 77],
];
const TEAR_POINTS: [number, number][] = [
  [42, 42], [58, 42], [34, 54], [50, 54], [66, 54], [38, 66], [52, 67], [65, 66], [45, 78], [58, 78],
];
const BERRY_POINTS: [number, number][] = [
  [44, 36], [56, 36], [38, 46], [50, 45], [62, 46], [35, 57], [47, 56], [59, 56], [67, 58],
  [39, 67], [51, 67], [62, 67], [45, 77], [56, 77],
];
const GRAPE_POINTS: [number, number][] = [
  [34, 44], [50, 42], [66, 44], [42, 58], [58, 58], [50, 72],
];

function bodyFor(look: FruitLook): Body {
  const has = (f: string) => look.features?.includes(f) ?? false;
  switch (look.body) {
    case 'melon':
      return { parts: [{ d: ell(50, 58, 27, 24) }], top: [50, 34], center: [50, 58, 26], tile: true };
    case 'persimmon':
      return { parts: [{ d: ell(50, 60, 29, 21) }], top: [50, 39], center: [50, 60, 26], tile: true };
    case 'pear':
      return { parts: [{ d: PEAR }], top: [50, 30], center: [50, 66, 22], tile: true };
    case 'heart':
      return { parts: [{ d: HEART }], top: [50, 38], center: [50, 56, 24], tile: true };
    case 'apple':
      return { parts: [{ d: APPLE }], top: [50, 38], center: [50, 60, 25], tile: true };
    case 'peach':
      return {
        parts: [{ d: 'M50 33 C62 30 77 40 76 58 C75 74 63 84 50 84 C37 84 25 74 24 58 C23 40 38 30 50 33 Z' }],
        top: [50, 33],
        center: [50, 58, 25],
        tile: true,
        over: (c) => (
          <path d="M50 34 C45 46 45 70 50 83" fill="none" stroke={shade(c.c[0], -0.3)} strokeWidth="1.4" />
        ),
      };
    case 'strawberry':
      return {
        parts: [{ d: 'M25 42 C25 32 75 32 75 42 C75 62 61 80 50 87 C39 80 25 62 25 42 Z' }],
        top: [50, 34],
        center: [50, 55, 24],
        tile: true,
      };
    case 'weight':
      return {
        parts: [{ d: 'M37 36 H63 C67 36 69 40 70 46 L74 78 C75 84 71 86 66 86 H34 C29 86 25 84 26 78 L30 46 C31 40 33 36 37 36 Z' }],
        top: [50, 36],
        center: [50, 62, 24],
        tile: true,
      };
    case 'mochi':
      return {
        parts: [
          {
            d: 'M50 30 C66 30 76 42 74 56 C73 64 64 68 62 72 C70 74 78 77 78 81 C78 86 64 88 50 88 C36 88 22 86 22 81 C22 77 30 74 38 72 C36 68 27 64 26 56 C24 42 34 30 50 30 Z',
          },
        ],
        top: [50, 30],
        center: [50, 52, 24],
        tile: true,
      };
    case 'skull':
      return {
        parts: [
          { d: circ(50, 52, 24) },
          { d: rr(33, 64, 8, 18, 4) },
          { d: rr(43, 66, 7, 18, 3.5) },
          { d: rr(51, 66, 7, 18, 3.5) },
          { d: rr(60, 64, 8, 18, 4) },
        ],
        top: [50, 28],
        center: [50, 52, 24],
        tile: true,
      };
    case 'cactus':
      return {
        parts: [
          { d: circ(50, 61, 23) },
          { d: rr(18, 38, 9, 26, 4.5) },
          { d: rr(18, 56, 16, 8, 4) },
          { d: rr(73, 38, 9, 26, 4.5) },
          { d: rr(66, 56, 16, 8, 4) },
        ],
        top: [50, 38],
        center: [50, 61, 23],
        tile: true,
      };
    case 'paw':
      return {
        parts: [{ d: circ(50, 62, 23) }, { d: circ(36, 41, 8.5) }, { d: circ(50, 35, 9) }, { d: circ(64, 41, 8.5) }],
        top: [50, 26],
        center: [50, 60, 24],
        tile: true,
      };
    case 'flower':
      return {
        parts: [
          ...[0, 72, 144, 216, 288].map(
            (a): Part => ({
              d: ell(50, 43, 10.5, 15),
              transform: `rotate(${a} 50 58)`,
              swirl: sw(50 + Math.sin((a * Math.PI) / 180) * 15, 58 - Math.cos((a * Math.PI) / 180) * 15, 1),
            }),
          ),
          { d: circ(50, 58, 9), fill: 1 },
        ],
        top: [50, 29],
        center: [50, 58, 28],
      };
    case 'mushroom':
      return {
        parts: [
          { d: rr(39, 56, 22, 30, 8), fill: 1 },
          { d: 'M20 61 C20 33 80 33 80 61 C72 66 28 66 20 61 Z' },
        ],
        swirls: [sw(36, 52), sw(50, 45), sw(64, 52), sw(44, 58, 0.8), sw(58, 58, 0.8)],
        top: [50, 39],
        center: [50, 52, 28],
      };
    case 'flames':
      return {
        parts: [{ d: circ(50, 60, 21) }, ...cluster(FLAME_POINTS, (x, y) => tear(x, y, 1.15), 0.85)],
        top: [50, 31],
        center: [50, 59, 26],
      };
    case 'tears':
      return {
        parts: [{ d: circ(50, 60, 21) }, ...cluster(TEAR_POINTS, (x, y) => tear(x, y, 1.05), 0.85)],
        top: [50, 32],
        center: [50, 59, 26],
      };
    case 'cloud':
      return {
        parts: [
          { d: circ(50, 59, 21) },
          ...cluster(
            [0, 45, 90, 135, 180, 225, 270, 315].map((a): [number, number] => [
              50 + Math.cos((a * Math.PI) / 180) * 18,
              59 + Math.sin((a * Math.PI) / 180) * 17,
            ]),
            (x, y) => circ(x, y, 9.5),
          ),
          { d: circ(50, 58, 9), swirl: sw(50, 59) },
        ],
        top: [50, 33],
        center: [50, 59, 27],
      };
    case 'berry':
      return {
        parts: [{ d: ell(50, 57, 19, 25) }, ...cluster(BERRY_POINTS, (x, y) => circ(x, y, 6.6), 0.62)],
        top: [50, 30],
        center: [50, 57, 24],
      };
    case 'grapes':
      return {
        parts: cluster(GRAPE_POINTS, (x, y) => circ(x, y, 9.5), 0.95),
        top: [50, 32],
        center: [50, 56, 24],
      };
    case 'fruitlets':
    case 'pineapple':
    case 'scales': {
      const kind = look.body;
      return {
        parts: [{ d: ell(50, 61, 22, 26) }],
        top: [50, 35],
        center: [50, 61, 24],
        inner: (c) => {
          const out: ReactNode[] = [];
          for (let row = 0; row < 6; row++) {
            const y = 40 + row * 8.5;
            for (let col = -2; col <= 2; col++) {
              const x = 50 + col * 10 + (row % 2 ? 5 : 0);
              const key = `${row}-${col}`;
              if (kind === 'scales') {
                out.push(
                  <g key={key}>
                    <path d={`M${x - 6} ${y - 3} C${x - 6} ${y + 6} ${x + 6} ${y + 6} ${x + 6} ${y - 3}`} fill={c.c[1]} stroke={INK} strokeWidth="0.8" />
                    <ellipse cx={x} cy={y + 1} rx="2.6" ry="3" fill={c.c[2]} />
                    <Swirl x={x} y={y + 1.4} s={0.45} color={c.c[1]} />
                  </g>,
                );
              } else if (kind === 'fruitlets') {
                out.push(
                  <g key={key}>
                    <circle cx={x} cy={y} r="5.4" fill={c.c[0]} stroke={INK} strokeWidth="0.8" />
                    <path d={`M${x - 1.6} ${y - 5} L${x} ${y - 8.5} L${x + 1.6} ${y - 5} Z`} fill={shade(c.c[0], 0.35)} stroke={INK} strokeWidth="0.5" />
                    <Swirl x={x} y={y + 0.5} s={0.6} color={c.swirl} />
                  </g>,
                );
              } else {
                out.push(
                  <g key={key}>
                    <path d={`M${x} ${y - 5} L${x + 5} ${y} L${x} ${y + 5} L${x - 5} ${y} Z`} fill={shade(c.c[0], 0.12)} stroke={INK} strokeWidth="0.8" />
                    <Swirl x={x} y={y + 0.4} s={0.55} color={c.swirl} />
                  </g>,
                );
              }
            }
          }
          return out;
        },
      };
    }
    case 'bananas':
    case 'ghosts':
    case 'blades':
      return {
        parts: fan([50, 87], 54, 11.5),
        separate: true,
        top: [50, 84],
        center: [50, 60, 26],
        partOver: (i, c) => {
          const a = FAN_ANGLES[i];
          if (look.body === 'ghosts')
            return (
              <g transform={`rotate(${a} 50 87)`}>
                <ellipse cx="48" cy="49" rx="1.1" ry="1.8" fill={INK} />
                <ellipse cx="52" cy="49" rx="1.1" ry="1.8" fill={INK} />
              </g>
            );
          if (look.body === 'blades')
            return (
              <g transform={`rotate(${a} 50 87)`}>
                <path d="M50 33 C53 33 55.7 36 55.7 39 C56.6 46 56.4 66 51.5 87 L50 87 Z" fill={c.c[1]} stroke={INK} strokeWidth="0.7" />
                <Swirl x={53} y={50} s={0.5} color={shade(c.c[1], 0.45)} />
                <Swirl x={52.6} y={63} s={0.5} color={shade(c.c[1], 0.45)} />
              </g>
            );
          return null;
        },
      };
    case 'twin':
      return {
        parts: [
          { d: circ(35, 65, 15) },
          { d: circ(65, 65, 15), fill: has('two_tone') ? 1 : 0 },
        ],
        top: [50, 30],
        center: [50, 65, 30],
        tile: true,
      };
    case 'twin_hearts':
      return {
        parts: [
          { d: HEART, transform: 'translate(13.5 36) scale(0.58)', swirl: sw(36, 62, 0.9) },
          { d: HEART, transform: 'translate(44.5 36) scale(0.58)', fill: 1, swirl: sw(64, 62, 0.9) },
        ],
        top: [50, 30],
        center: [50, 62, 30],
      };
    case 'jaws':
      return {
        parts: [{ d: ell(50, 58, 27, 24) }],
        top: [50, 34],
        center: [50, 58, 26],
        tile: true,
        over: (c) => (
          <path
            d="M23 57 L29 52 L34 59 L40 52 L45 59 L50 52 L55 59 L60 52 L66 59 L71 52 L77 57 L71 64 L66 58 L60 65 L55 58 L50 65 L45 58 L40 65 L34 58 L29 64 Z"
            fill={c.c[1]}
            stroke={INK}
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        ),
      };
    case 'segments':
      return {
        parts: [{ d: circ(50, 58, 25) }],
        top: [50, 33],
        center: [50, 58, 25],
        inner: (c) => {
          const fills = [c.c[0], c.c[1], c.c[2], shade(c.c[0], 0.25), shade(c.c[1], 0.25), shade(c.c[2], 0.25)];
          return fills.map((f, i) => {
            const a0 = (i * 60 * Math.PI) / 180;
            const a1 = ((i + 1) * 60 * Math.PI) / 180;
            const p = (a: number) => `${50 + Math.sin(a) * 26} ${58 - Math.cos(a) * 26}`;
            const mid = (a0 + a1) / 2;
            return (
              <g key={i}>
                <path d={`M50 58 L${p(a0)} A26 26 0 0 1 ${p(a1)} Z`} fill={f} />
                <Swirl x={50 + Math.sin(mid) * 15} y={58 - Math.cos(mid) * 15} s={0.85} color={shade(f, -0.35)} />
              </g>
            );
          });
        },
        over: () => (
          <g stroke={INK} strokeWidth="0.9" strokeLinecap="round">
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <g key={a} transform={`rotate(${a} 50 58)`}>
                <path d="M50 58 V33" />
                <path d="M48 38 L52 40 M48 45 L52 47 M48 52 L52 54" />
              </g>
            ))}
          </g>
        ),
      };
    case 'wheel':
      return {
        parts: [{ d: circ(50, 58, 25) }],
        top: [50, 33],
        center: [50, 58, 25],
        tile: true,
        over: (c) => (
          <g>
            <circle cx="50" cy="58" r="12.5" fill={c.c[1]} stroke={INK} strokeWidth="1.1" />
            <path
              d="M50 58 m-1.5 0 a1.5 1.5 0 1 1 3 0 a3.5 3.5 0 1 1 -7 0 a5.5 5.5 0 1 1 11 0 a7.5 7.5 0 1 1 -15 0 a9.5 9.5 0 1 1 19 0"
              fill="none"
              stroke={shade(c.c[1], -0.35)}
              strokeWidth="1.2"
            />
          </g>
        ),
      };
    case 'round':
    default:
      return { parts: [{ d: circ(50, 58, 25) }], top: [50, 33], center: [50, 58, 25], tile: true };
  }
}

/* --------------------------- Dettagli extra --------------------------- */

/** Parti aggiuntive che si uniscono alla silhouette (orecchie, escrescenze). */
function featureParts(look: FruitLook, b: Body): Part[] {
  const out: Part[] = [];
  const [cx, cy, r] = b.center;
  if (look.features?.includes('sparks')) {
    const angles = [200, 228, 256, 290, 318, 346, 20, 48, 80, 112, 140, 168];
    angles.forEach((a, i) => {
      const rad = (a * Math.PI) / 180;
      const len = 3.5 + (i % 3) * 2;
      const x = cx + Math.cos(rad) * (r - 2);
      const y = cy + Math.sin(rad) * (r - 2);
      const tx = cx + Math.cos(rad) * (r + len);
      const ty = cy + Math.sin(rad) * (r + len);
      const nx = -Math.sin(rad) * 2.2;
      const ny = Math.cos(rad) * 2.2;
      out.push({ d: `M${x + nx} ${y + ny} L${(x + tx) / 2 + nx * 1.4} ${(y + ty) / 2 + ny * 1.4} L${tx} ${ty} L${x - nx} ${y - ny} Z` });
    });
  }
  if (look.features?.includes('ears')) {
    out.push({ d: `M${cx - 21} ${cy - 10} L${cx - 22} ${cy - 33} L${cx - 6} ${cy - 22} Z`, swirl: sw(cx - 17, cy - 21, 0.7) });
    out.push({ d: `M${cx + 21} ${cy - 10} L${cx + 22} ${cy - 33} L${cx + 6} ${cy - 22} Z`, swirl: sw(cx + 17, cy - 21, 0.7) });
  }
  return out;
}

/** Dettagli disegnati sopra la sagoma. */
function featureOver(look: FruitLook, b: Body, c: Colors): ReactNode[] {
  const f = new Set(look.features ?? []);
  const [cx, cy, r] = b.center;
  const out: ReactNode[] = [];
  const dark = shade(c.c[0], -0.45);
  if (f.has('ribs'))
    out.push(
      <g key="ribs" fill="none" stroke={dark} strokeWidth="0.9" opacity="0.55">
        <path d={`M${cx} ${cy - r + 2} V${cy + r - 2}`} />
        <path d={`M${cx - 12} ${cy - r + 5} C${cx - 18} ${cy - 6} ${cx - 18} ${cy + 6} ${cx - 12} ${cy + r - 5}`} />
        <path d={`M${cx + 12} ${cy - r + 5} C${cx + 18} ${cy - 6} ${cx + 18} ${cy + 6} ${cx + 12} ${cy + r - 5}`} />
      </g>,
    );
  if (f.has('cracks'))
    out.push(
      <g key="cracks" fill="none" stroke={INK} strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round">
        <path d="M30 70 L38 72 L42 79 L49 77 L54 84" />
        <path d="M42 79 L40 86" />
        <path d="M54 66 L60 72 L58 78 L66 80" />
        <path d="M60 72 L69 70" />
        <path d="M27 63 L34 64" />
      </g>,
    );
  if (f.has('spots'))
    out.push(
      <g key="spots">
        {[
          [38, 52], [52, 47], [63, 56], [42, 66], [57, 70], [32, 60], [68, 67], [49, 59],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="3.2" fill="none" stroke={INK} strokeWidth="1.3" strokeDasharray="3 2" />
            <circle cx={x} cy={y} r="1.2" fill={shade(c.c[0], -0.3)} />
          </g>
        ))}
      </g>,
    );
  if (f.has('rings'))
    out.push(
      <g key="rings">
        {[
          [38, 50], [56, 46], [64, 62], [44, 68], [32, 62], [54, 76],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="4.6" fill={c.c[1]} stroke={INK} strokeWidth="0.8" />
            <circle cx={x} cy={y} r="2" fill={c.c[2]} />
          </g>
        ))}
      </g>,
    );
  if (f.has('horns'))
    out.push(
      <g key="horns" fill="#f4f0e4" stroke={INK} strokeWidth="1">
        <path d="M30 42 C20 40 16 30 19 22 C22 30 28 34 36 36 Z" />
        <path d="M70 42 C80 40 84 30 81 22 C78 30 72 34 64 36 Z" />
      </g>,
    );
  if (f.has('collar'))
    out.push(
      <g key="collar" fill={c.c[1]} stroke={INK} strokeWidth="1">
        <path d="M28 66 C18 60 16 48 22 40 C24 50 28 58 36 62 Z" />
        <path d="M72 66 C82 60 84 48 78 40 C76 50 72 58 64 62 Z" />
      </g>,
    );
  if (f.has('stripes'))
    out.push(
      <g key="stripes" fill="none" stroke={c.c[1]} strokeWidth="2.2" strokeLinecap="round">
        <path d="M27 56 C31 60 33 68 30 76 M35 51 C40 58 41 70 37 79 M57 56 C61 60 63 68 60 76 M65 51 C70 58 71 70 67 79" />
      </g>,
    );
  if (f.has('heart_pattern'))
    out.push(
      <g key="hp" fill={c.c[2]}>
        {[
          [30, 58], [40, 68], [60, 58], [70, 68], [36, 75], [64, 75],
        ].map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x} ${y + 3} C${x - 4} ${y} ${x - 4} ${y - 3} ${x - 2} ${y - 3} C${x - 1} ${y - 3} ${x} ${y - 2} ${x} ${y - 1.5} C${x} ${y - 2} ${x + 1} ${y - 3} ${x + 2} ${y - 3} C${x + 4} ${y - 3} ${x + 4} ${y} ${x} ${y + 3} Z`} />
        ))}
      </g>,
    );
  if (f.has('vine'))
    out.push(
      <path
        key="vine"
        d="M50 34 C60 38 70 40 66 48 C62 54 38 50 34 56 C30 62 52 64 58 66 C64 68 56 76 50 80"
        fill="none"
        stroke="#e8c84a"
        strokeWidth="2"
        strokeLinecap="round"
      />,
    );
  if (f.has('drips'))
    out.push(
      <g key="drips" fill={c.c[0]} stroke={INK} strokeWidth="1">
        <path d="M40 46 C40 52 42 56 43 56 C44.5 56 45 52 45 46 Z" />
        <path d="M51 46 C51 55 53 60 54.2 60 C55.6 60 56 55 56 46 Z" />
        <path d="M60 46 C60 50 61 53 62 53 C63 53 63.5 50 63.5 46 Z" />
      </g>,
    );
  return out;
}

/* ------------------------------- Steli ------------------------------- */

function stem(look: FruitLook, b: Body): ReactNode {
  const [x, y] = b.top;
  const col = look.stemColor ?? '#4f9a45';
  const line = (d: string, w = 2.6, color = col) => (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth={w + 1.6} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
  const leaf = (rot: number, len = 11, w = 4, fill = col, key?: string | number) => (
    <path
      key={key}
      d={`M${x} ${y} C${x - w} ${y - len * 0.5} ${x - w * 0.6} ${y - len * 0.9} ${x} ${y - len} C${x + w * 0.6} ${y - len * 0.9} ${x + w} ${y - len * 0.5} ${x} ${y} Z`}
      transform={`rotate(${rot} ${x} ${y})`}
      fill={fill}
      stroke={INK}
      strokeWidth="1"
    />
  );
  switch (look.stem ?? 'curl') {
    case 'none':
      return null;
    case 'T':
      return line(`M${x} ${y + 1} V${y - 6} M${x - 7} ${y - 6} H${x + 6} C${x + 9} ${y - 6} ${x + 10} ${y - 9} ${x + 8} ${y - 11}`);
    case 'leaves':
      return <g>{[-40, -20, 0, 20, 40].map((r, i) => leaf(r, i === 2 ? 14 : 11, 4, col, r))}</g>;
    case 'crown':
      return (
        <g>
          {[-34, -17, 0, 17, 34].map((r, i) => (
            <g key={r}>
              {leaf(r, i === 2 ? 26 : 20, 5, look.color2 ?? '#3a8ae0')}
              {leaf(r, i === 2 ? 16 : 12, 2.4, look.color3 ?? '#f2d040')}
            </g>
          ))}
        </g>
      );
    case 'fuse':
      return (
        <g>
          {line(`M${x} ${y + 1} C${x - 4} ${y - 4} ${x + 4} ${y - 8} ${x} ${y - 12} C${x - 3} ${y - 15} ${x + 2} ${y - 18} ${x + 1} ${y - 20}`, 3.2, '#e8c84a')}
          <path d={`M${x + 1} ${y - 20} l-3 -3 M${x + 1} ${y - 20} l1 -4 M${x + 1} ${y - 20} l4 -2`} stroke="#f08a2a" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      );
    case 'zigzag':
      return line(`M${x} ${y + 1} L${x + 3} ${y - 4} L${x - 3} ${y - 7} L${x + 3} ${y - 11} C${x + 8} ${y - 12} ${x + 9} ${y - 8} ${x + 6} ${y - 7.5}`);
    case 'needle':
      return (
        <g>
          {line(`M${x - 6} ${y + 10} L${x + 8} ${y - 16}`, 2.4, '#c9cdd6')}
          <ellipse cx={x + 7} cy={y - 13.5} rx="1.1" ry="2.2" transform={`rotate(28 ${x + 7} ${y - 13.5})`} fill={INK} />
          {line(`M${x + 2} ${y - 12} C${x + 6} ${y - 14} ${x + 9} ${y - 12} ${x + 13} ${y - 17}`, 1.6, col)}
        </g>
      );
    case 'drip':
      return (
        <g>
          {line(`M${x} ${y + 1} V${y - 6} M${x - 7} ${y - 6} H${x + 7}`)}
          <path d={`M${x - 8} ${y - 6} c0 2 -1.6 4 -1.6 5 a1.6 1.6 0 0 0 3.2 0 c0 -1 -1.6 -3 -1.6 -5 Z`} fill={col} stroke={INK} strokeWidth="0.8" />
          <path d={`M${x + 8} ${y - 6} c0 2 -1.6 4 -1.6 5 a1.6 1.6 0 0 0 3.2 0 c0 -1 -1.6 -3 -1.6 -5 Z`} fill={col} stroke={INK} strokeWidth="0.8" />
        </g>
      );
    case 'twin':
      return line(`M35 50 C38 40 44 33 ${x} ${y} C56 33 62 40 65 50 M${x} ${y} V${y - 6} C${x} ${y - 9} ${x + 4} ${y - 10} ${x + 5} ${y - 8}`, 2.2);
    case 'heart':
      return (
        <g>
          {line(`M36 47 C38 40 44 35 ${x} ${y} C56 35 62 40 64 47`, 2.2)}
          {line(`M${x} ${y} C${x - 7} ${y - 5} ${x - 6} ${y - 13} ${x} ${y - 9} C${x + 6} ${y - 13} ${x + 7} ${y - 5} ${x} ${y}`, 2)}
        </g>
      );
    case 'bush':
      return (
        <g>
          {leaf(-60, 10, 4, '#8a6a3a', 'a')}
          {leaf(60, 10, 4, '#8a6a3a', 'b')}
          {leaf(-20, 9, 3.5, '#8a6a3a', 'c')}
          {line(`M${x} ${y} C${x} ${y - 6} ${x - 2} ${y - 9} ${x - 6} ${y - 10} C${x - 10} ${y - 11} ${x - 11} ${y - 7} ${x - 8} ${y - 6}`, 2.4, look.stemColor ?? '#f2b05a')}
        </g>
      );
    case 'seven':
      return (
        <g>
          {[-45, -30, -15, 0, 15, 30, 45].map((r) => (
            <g key={r} transform={`rotate(${r} ${x} ${y})`}>
              {line(`M${x} ${y} V${y - 9}`, 1.8)}
              <path d={`M${x - 2.6} ${y - 9} L${x} ${y - 13} L${x + 2.6} ${y - 9} Z`} fill={col} stroke={INK} strokeWidth="0.8" strokeLinejoin="round" />
            </g>
          ))}
        </g>
      );
    case 'double':
      return (
        <g>
          {line(`M${x - 4} ${y + 1} C${x - 4} ${y - 6} ${x - 6} ${y - 9} ${x - 10} ${y - 10} C${x - 13} ${y - 10} ${x - 13} ${y - 7} ${x - 11} ${y - 6.5}`, 2.2)}
          {line(`M${x + 4} ${y + 1} C${x + 4} ${y - 6} ${x + 6} ${y - 9} ${x + 10} ${y - 10} C${x + 13} ${y - 10} ${x + 13} ${y - 7} ${x + 11} ${y - 6.5}`, 2.2)}
        </g>
      );
    case 'eight':
      return (
        <g>
          {line(`M${x} ${y + 1} V${y - 4}`, 3)}
          {line(`M${x} ${y - 9} C${x - 4} ${y - 14} ${x - 11} ${y - 13} ${x - 11} ${y - 9} C${x - 11} ${y - 5} ${x - 4} ${y - 4} ${x} ${y - 9} C${x + 4} ${y - 14} ${x + 11} ${y - 13} ${x + 11} ${y - 9} C${x + 11} ${y - 5} ${x + 4} ${y - 4} ${x} ${y - 9} Z`, 2.4)}
        </g>
      );
    case 'base':
      return (
        <g>
          <ellipse cx={x} cy={y} rx="7" ry="4" fill={col} stroke={INK} strokeWidth="1.2" />
          {line(`M${x} ${y + 3} V${y + 8}`, 2.6)}
        </g>
      );
    case 'curl':
    default:
      return line(`M${x} ${y + 1} C${x} ${y - 5} ${x + 2} ${y - 9} ${x + 6} ${y - 10} C${x + 10} ${y - 11} ${x + 11} ${y - 7} ${x + 8.4} ${y - 6} C${x + 6.4} ${y - 5.4} ${x + 5.8} ${y - 7.6} ${x + 7.4} ${y - 8}`);
  }
}

/* ------------------------------ Componente ------------------------------ */

const TILE: [number, number][] = (() => {
  const pts: [number, number][] = [];
  for (let row = 0; row < 9; row++)
    for (let col = 0; col < 9; col++) pts.push([12 + col * 10 + (row % 2 ? 5 : 0), 24 + row * 8.6]);
  return pts;
})();

export function FruitArt({ look, uid }: { look: FruitLook; uid: string }) {
  const body = bodyFor(look);
  const parts = [...featureParts(look, body), ...body.parts];
  const c: Colors = {
    c: [look.color, look.color2 ?? shade(look.color, 0.3), look.color3 ?? shade(look.color, -0.3)],
    swirl: look.swirl ?? shade(look.color, -0.42),
    uid,
  };
  const clip = `fc-${uid}`;
  const hi = `fh-${uid}`;
  const lo = `fl-${uid}`;
  const halfTile = look.features?.includes('half_swirls');
  const swirlFor = (p: Part) => (p.fill === 1 ? shade(c.c[1], -0.42) : p.fill === 2 ? shade(c.c[2], -0.42) : c.swirl);

  return (
    <g>
      <defs>
        <clipPath id={clip}>
          {parts.map((p, i) => (
            <path key={i} d={p.d} transform={p.transform} />
          ))}
        </clipPath>
        <radialGradient id={hi} cx="36%" cy="30%" r="55%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={lo} cx="70%" cy="82%" r="60%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="50" cy="90" rx="24" ry="3.6" fill="#000" opacity="0.28" />

      {body.separate ? (
        // Sezioni distinte: ognuna col suo contorno, la successiva sopra la precedente.
        parts.map((p, i) => (
          <g key={`p${i}`}>
            <path d={p.d} transform={p.transform} fill={c.c[p.fill ?? 0]} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
            {p.swirl && <Swirl x={p.swirl[0]} y={p.swirl[1]} s={p.swirl[2]} color={swirlFor(p)} />}
            {body.partOver?.(i, c)}
          </g>
        ))
      ) : (
        <>
          {/* Contorno comune: tutte le parti ingrossate in nero, poi riempite sopra. */}
          {parts.map((p, i) => (
            <path key={`o${i}`} d={p.d} transform={p.transform} fill={INK} stroke={INK} strokeWidth="3.2" strokeLinejoin="round" />
          ))}
          {parts.map((p, i) => (
            <path key={`f${i}`} d={p.d} transform={p.transform} fill={c.c[p.fill ?? 0]} />
          ))}
        </>
      )}

      <g clipPath={`url(#${clip})`}>
        {body.tile &&
          TILE.filter(([, y]) => !halfTile || y < body.center[1]).map(([x, y]) => (
            <Swirl key={`${x}-${y}`} x={x} y={y} s={1} color={c.swirl} />
          ))}
        {body.inner?.(c)}
      </g>
      {!body.separate &&
        parts.map((p, i) =>
          p.swirl ? <Swirl key={`s${i}`} x={p.swirl[0]} y={p.swirl[1]} s={p.swirl[2]} color={swirlFor(p)} /> : null,
        )}
      {body.swirls?.map(([x, y, k]) => <Swirl key={`b${x}-${y}`} x={x} y={y} s={k} color={c.swirl} />)}
      {body.over?.(c)}
      {featureOver(look, body, c)}

      <g clipPath={`url(#${clip})`}>
        <rect width="100" height="100" fill={`url(#${hi})`} />
        <rect width="100" height="100" fill={`url(#${lo})`} />
      </g>

      {stem(look, body)}
    </g>
  );
}
