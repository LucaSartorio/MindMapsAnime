import type { ReactNode } from 'react';
import type { AbilityMotif } from '@/lib/worldPlaceholders';
import type { AbilityArt, AbilityElement, AbilityForm } from '@/lib/abilityArt';
import { AbilityMotifArt } from '@/components/common/entityArt';

/**
 * Disegni delle tecniche: una FORMA (categoria) + un GLIFO d'elemento.
 *
 * Come il resto di `entityArt.tsx` sono forme ORIGINALI e geometriche (un
 * pugno, un occhio, un frutto con le orecchie…), mai simboli o artwork ufficiali.
 * Quale forma/elemento usare lo decide `resolveAbilityArt` (`src/lib/abilityArt.ts`),
 * dai dati della tecnica.
 */

const WHITE = 'rgba(255,255,255,0.95)';
const SOFT = 'rgba(255,255,255,0.18)';

interface Colors {
  dark: string;
  ink: string;
}

/** Dove va il glifo dell'elemento: al centro della forma o in un badge d'angolo. */
interface Anchor {
  cx: number;
  cy: number;
  r: number;
}

const BADGE: Anchor = { cx: 77, cy: 23, r: 11 };
const CENTER: Anchor = { cx: 50, cy: 50, r: 12 };

/* ------------------------------ Glifi ------------------------------ */

/** Glifo in coordinate locali centrate su (0,0), raggio ~10. */
function glyph(element: AbilityElement, fill: string, dark: string): ReactNode {
  const stroke = {
    fill: 'none',
    stroke: fill,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (element) {
    case 'fire':
      return (
        <path
          d="M0 -10 C4 -5 8 -2 7 4 C6 8 3 10 0 10 C-3 10 -6 8 -7 4 C-8 -1 -4 -3 -3 -7 C-1 -4 0 -3 0 -1 C1 -4 1 -7 0 -10 Z"
          fill={fill}
        />
      );
    case 'water':
      return <path d="M0 -10 C4 -4 7 0 7 4 A7 7 0 0 1 -7 4 C-7 0 -4 -4 0 -10 Z" fill={fill} />;
    case 'blood':
      return (
        <>
          <path d="M-2 -10 C2 -4 5 0 5 4 A7 6 0 0 1 -9 4 C-9 0 -6 -4 -2 -10 Z" fill={fill} />
          <path d="M7 -1 C9 2 10 4 10 6 A3 3 0 0 1 4 6 C4 4 5 2 7 -1 Z" fill={fill} />
        </>
      );
    case 'ice':
      return (
        <g {...stroke}>
          <path d="M0 -10 V10 M-8.7 -5 L8.7 5 M-8.7 5 L8.7 -5" />
          <path d="M-3 -8 L0 -5 L3 -8 M-3 8 L0 5 L3 8" />
        </g>
      );
    case 'lightning':
      return <path d="M2 -10 L-6 2 L-1 2 L-3 10 L6 -3 L1 -3 Z" fill={fill} />;
    case 'wind':
      return (
        <g {...stroke}>
          <path d="M-9 -4 H4 A3 3 0 1 0 1 -7" />
          <path d="M-9 1 H7 A3 3 0 1 1 4 4" />
          <path d="M-7 6 H1" />
        </g>
      );
    case 'earth':
      return (
        <>
          <path d="M-10 8 L-4 -4 L0 2 L4 -8 L10 8 Z" fill={fill} />
          <path d="M2 -4 L4 -8 L6 -4" fill={dark} />
        </>
      );
    case 'plant':
      return (
        <>
          <path d="M-7 8 C-8 -2 -2 -9 8 -9 C8 1 2 8 -7 8 Z" fill={fill} />
          <path d="M-7 8 L3 -3" stroke={dark} strokeWidth="1.4" strokeLinecap="round" />
        </>
      );
    case 'sand':
      return (
        <>
          <path {...stroke} d="M-10 3 C-6 -1 -2 -1 0 3 C2 7 6 7 10 3" />
          <g fill={fill}>
            <circle cx="-5" cy="-6" r="1.5" />
            <circle cx="1" cy="-8" r="1.5" />
            <circle cx="6" cy="-4" r="1.5" />
            <circle cx="-1" cy="-3" r="1.2" />
          </g>
        </>
      );
    case 'magma':
      return (
        <>
          <path d="M-10 9 L-4 -1 L4 -1 L10 9 Z" fill={fill} />
          <g fill={fill}>
            <circle cx="0" cy="-5" r="2" />
            <circle cx="-4" cy="-9" r="1.4" />
            <circle cx="4" cy="-9" r="1.4" />
          </g>
        </>
      );
    case 'light':
      return (
        <>
          <circle r="4.5" fill={fill} />
          <g {...stroke}>
            <path d="M0 -10 V-7 M0 7 V10 M-10 0 H-7 M7 0 H10 M-7 -7 L-5 -5 M5 5 L7 7 M7 -7 L5 -5 M-5 5 L-7 7" />
          </g>
        </>
      );
    case 'dark':
      return <path d="M3 -9.5 A9.5 9.5 0 1 0 9.5 3 A7 7 0 1 1 3 -9.5 Z" fill={fill} />;
    case 'smoke':
      return (
        <path
          d="M-8 6 A4 4 0 0 1 -7 -1 A5 5 0 0 1 2 -5 A5 5 0 0 1 9 2 A3 3 0 0 1 7 6 Z"
          fill={fill}
        />
      );
    case 'poison':
      return (
        <>
          <circle cx="-3" cy="3" r="5.5" fill={fill} />
          <circle cx="5" cy="-4" r="3.5" fill={fill} />
          <circle cx="-2" cy="-8" r="2" fill={fill} />
          <circle cx="-4" cy="2" r="1.6" fill={dark} />
        </>
      );
    case 'metal':
      return (
        <>
          <path d="M-5 -9 H5 L10 0 L5 9 H-5 L-10 0 Z" fill={fill} />
          <circle r="3.6" fill={dark} />
        </>
      );
    case 'crystal':
      return (
        <>
          <path d="M0 -10 L7 -2 L0 10 L-7 -2 Z" fill={fill} />
          <path d="M-7 -2 H7 M0 -10 L-2.5 -2 L0 10 L2.5 -2 Z" stroke={dark} strokeWidth="0.9" fill="none" />
        </>
      );
    case 'gravity':
      return (
        <>
          <circle cy="-5" r="4" fill={fill} />
          <g {...stroke}>
            <path d="M-10 9 H10" />
            <path d="M-6 1 V6 M-8 4 L-6 6 L-4 4 M6 1 V6 M4 4 L6 6 L8 4" />
          </g>
        </>
      );
    case 'space':
      return (
        <path
          {...stroke}
          d="M0 0 A2 2 0 0 1 4 0 A4 4 0 0 1 -4 0 A6 6 0 0 1 8 0 A8 8 0 0 1 -8 0"
        />
      );
    case 'time':
      return (
        <g {...stroke}>
          <circle r="9" />
          <path d="M0 -5 V0 L4 3" />
        </g>
      );
    case 'bone':
      return (
        <g transform="rotate(-40)" fill={fill}>
          <rect x="-7" y="-1.8" width="14" height="3.6" />
          <circle cx="-7.5" cy="-2" r="2.6" />
          <circle cx="-7.5" cy="2" r="2.6" />
          <circle cx="7.5" cy="-2" r="2.6" />
          <circle cx="7.5" cy="2" r="2.6" />
        </g>
      );
    case 'soul':
      return (
        <path
          d="M3 9 A6 6 0 0 1 -3 0 C-3 -5 -6 -8 -9 -10 C-1 -10 9 -5 9 3 A6 6 0 0 1 3 9 Z"
          fill={fill}
        />
      );
    case 'sound':
      return (
        <>
          <ellipse cx="-4" cy="6" rx="4" ry="3" fill={fill} transform="rotate(-20 -4 6)" />
          <path {...stroke} d="M-0.5 5 V-9 C3 -7 7 -6 8 -2" />
        </>
      );
    case 'thread':
      return (
        <g {...stroke}>
          <ellipse cx="-3.5" cy="-3.5" rx="6" ry="3.2" transform="rotate(45 -3.5 -3.5)" />
          <ellipse cx="3.5" cy="3.5" rx="6" ry="3.2" transform="rotate(45 3.5 3.5)" />
        </g>
      );
    case 'star':
      return (
        <path
          d="M0 -10 L2.9 -4 L9.5 -3.1 L4.7 1.5 L5.9 8.1 L0 5 L-5.9 8.1 L-4.7 1.5 L-9.5 -3.1 L-2.9 -4 Z"
          fill={fill}
        />
      );
    case 'explosion':
      return (
        <path
          d="M0 -10 L2.5 -4 L8 -7 L5 -1.5 L10 1 L4.5 3 L6 9 L1 5 L-3 10 L-3 4 L-9 5 L-5 0 L-9 -5 L-3 -3.5 Z"
          fill={fill}
        />
      );
    case 'yin':
      return (
        <>
          <circle r="9" fill="none" stroke={fill} strokeWidth="1.6" />
          <path d="M0 -9 A9 9 0 0 0 0 9 Z" fill={fill} />
        </>
      );
    case 'yang':
      return (
        <>
          <circle r="9" fill="none" stroke={fill} strokeWidth="1.2" strokeDasharray="2 2" />
          <circle r="5.5" fill={fill} />
        </>
      );
    case 'yin_yang':
      return (
        <>
          <circle r="9.5" fill="none" stroke={fill} strokeWidth="1.4" />
          <path d="M0 -9.5 A9.5 9.5 0 0 1 0 9.5 A4.75 4.75 0 0 1 0 0 A4.75 4.75 0 0 0 0 -9.5 Z" fill={fill} />
          <circle cy="-4.75" r="1.5" fill={dark} />
          <circle cy="4.75" r="1.5" fill={fill} />
        </>
      );
    case 'magnet':
      return (
        <>
          <path d="M-6 -8 V1 A6 6 0 0 0 6 1 V-8" fill="none" stroke={fill} strokeWidth="4" />
          <path d="M-8 -9 H-4 M4 -9 H8" stroke={dark} strokeWidth="2" />
        </>
      );
    case 'void':
    default:
      return (
        <g {...stroke}>
          <circle r="8.5" />
          <path d="M-6 6 L6 -6" />
        </g>
      );
  }
}

/** Disco scuro con cornice nel colore firma + glifo bianco. */
function ElementMark({
  element,
  anchor,
  dark,
  ink,
}: Colors & { element: AbilityElement; anchor: Anchor }) {
  const scale = (anchor.r - 2.2) / 10;
  return (
    <g>
      <circle cx={anchor.cx} cy={anchor.cy} r={anchor.r} fill={dark} stroke={ink} strokeWidth="1.4" />
      <g transform={`translate(${anchor.cx} ${anchor.cy}) scale(${scale})`}>
        {glyph(element, WHITE, dark)}
      </g>
    </g>
  );
}

function Label({ children }: { children: string }) {
  return (
    <text
      x="50"
      y="86"
      textAnchor="middle"
      fontFamily="Cinzel, serif"
      fontSize="13"
      fontWeight="700"
      fill={WHITE}
    >
      {children}
    </text>
  );
}

/* ------------------------------ Forme ------------------------------ */

interface FormDef {
  anchor: Anchor;
  draw: (c: Colors & { hasElement: boolean }) => ReactNode;
}

/** Forme nuove (le altre sono i motivi-base dei mondi, in `entityArt.tsx`). */
const FORMS: Partial<Record<AbilityForm, FormDef>> = {
  // One Piece — Zoan: frutto con orecchie e impronta.
  fruit_beast: {
    anchor: BADGE,
    draw: ({ dark, ink }) => (
      <>
        <path d="M34 42 L30 24 L45 34 Z M66 42 L70 24 L55 34 Z" fill={dark} stroke={ink} strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="50" cy="53" r="21" fill={dark} stroke={ink} strokeWidth="1.6" />
        <g fill={ink}>
          <ellipse cx="50" cy="59" rx="7" ry="5.5" />
          <circle cx="40.5" cy="50" r="2.8" />
          <circle cx="46" cy="45" r="2.8" />
          <circle cx="54" cy="45" r="2.8" />
          <circle cx="59.5" cy="50" r="2.8" />
        </g>
      </>
    ),
  },
  // One Piece — Logia: frutto che si scioglie nel suo elemento.
  fruit_elemental: {
    anchor: { cx: 50, cy: 51, r: 11.5 },
    draw: ({ dark, ink }) => (
      <>
        <path d="M29 51 A21 21 0 0 1 71 51" fill={dark} stroke={ink} strokeWidth="1.6" />
        <path
          d="M29 51 C31 60 36 64 40 70 M71 51 C69 60 64 64 60 70 M43 72 C46 76 54 76 57 72"
          fill="none"
          stroke={ink}
          strokeWidth="1.6"
          strokeDasharray="3 3"
          strokeLinecap="round"
        />
        <path d="M29 51 C34 64 66 64 71 51 Z" fill={dark} opacity="0.55" />
        <g fill={ink} opacity="0.85">
          <circle cx="24" cy="64" r="2" />
          <circle cx="76" cy="64" r="2" />
          <circle cx="30" cy="74" r="1.4" />
          <circle cx="70" cy="74" r="1.4" />
        </g>
        <path d="M50 30 C52 23 57 20 61 20 C58 26 55 29 50 30 Z" fill={ink} />
      </>
    ),
  },
  fist: {
    anchor: BADGE,
    draw: ({ dark, ink }) => (
      <>
        <g stroke={ink} strokeWidth="2" strokeLinecap="round" opacity="0.8">
          <path d="M20 40 L26 42 M18 52 L25 52 M20 64 L26 61 M80 40 L74 42 M82 52 L75 52" />
        </g>
        <g fill={WHITE} stroke={dark} strokeWidth="1.2">
          <rect x="34" y="47" width="32" height="22" rx="6" />
          <rect x="33" y="33" width="9" height="17" rx="4.5" />
          <rect x="41.5" y="31" width="9" height="19" rx="4.5" />
          <rect x="50" y="31" width="9" height="19" rx="4.5" />
          <rect x="58.5" y="33" width="9" height="17" rx="4.5" />
          <path d="M34 54 C42 52 48 54 50 60 C44 61 38 60 34 58 Z" />
          <rect x="40" y="67" width="20" height="9" rx="2" />
        </g>
      </>
    ),
  },
  eye: {
    anchor: { cx: 50, cy: 50, r: 11 },
    draw: ({ dark, ink, hasElement }) => (
      <>
        <path d="M16 50 C30 29 70 29 84 50 C70 71 30 71 16 50 Z" fill={WHITE} />
        <circle cx="50" cy="50" r="14" fill={ink} />
        <circle cx="50" cy="50" r="14" fill="none" stroke={dark} strokeWidth="1.4" />
        {!hasElement && (
          <>
            <circle cx="50" cy="50" r="5.5" fill={dark} />
            <circle cx="45" cy="45" r="2.4" fill={WHITE} />
          </>
        )}
        <path d="M16 50 C30 29 70 29 84 50 C70 71 30 71 16 50 Z" fill="none" stroke={dark} strokeWidth="1.6" />
      </>
    ),
  },
  seal: {
    anchor: CENTER,
    draw: ({ dark, ink }) => (
      <>
        <circle cx="50" cy="50" r="27" fill={dark} opacity="0.35" />
        <g fill="none" stroke={ink} strokeLinecap="round">
          <circle cx="50" cy="50" r="27" strokeWidth="1.6" />
          <circle cx="50" cy="50" r="21" strokeWidth="1" strokeDasharray="2 3" />
          <rect x="35" y="35" width="30" height="30" strokeWidth="1.4" transform="rotate(45 50 50)" />
          <rect x="37" y="37" width="26" height="26" strokeWidth="1.2" />
        </g>
        <circle cx="50" cy="50" r="4" fill={WHITE} />
      </>
    ),
  },
  scroll: {
    anchor: CENTER,
    draw: ({ dark, ink }) => (
      <>
        <rect x="26" y="34" width="48" height="32" rx="2" fill={WHITE} opacity="0.9" />
        <g stroke={dark} strokeWidth="1.4" strokeLinecap="round" opacity="0.45">
          <path d="M31 41 V59 M35 41 V55 M65 41 V57 M69 41 V59" />
        </g>
        <g fill={ink} stroke={dark} strokeWidth="1">
          <rect x="19" y="29" width="8" height="42" rx="3" />
          <rect x="73" y="29" width="8" height="42" rx="3" />
        </g>
        <circle cx="50" cy="50" r="4" fill={dark} />
      </>
    ),
  },
  illusion: {
    anchor: CENTER,
    draw: ({ ink }) => (
      <>
        <g fill="none" stroke={ink} strokeLinecap="round">
          <path d="M50 22 C66 22 80 34 78 50 C76 66 62 78 48 77 C32 76 21 64 23 49 C25 35 37 25 50 26" strokeWidth="1.6" />
          <path d="M50 30 C62 30 71 40 70 51 C69 63 58 70 48 69 C37 68 30 59 31 49 C32 39 41 33 50 34" strokeWidth="1.3" opacity="0.8" />
          <path d="M50 38 C58 38 63 44 62 51 C61 58 55 62 49 61" strokeWidth="1.1" opacity="0.6" />
        </g>
        <circle cx="50" cy="50" r="4" fill={WHITE} />
      </>
    ),
  },
  beast: {
    anchor: BADGE,
    draw: ({ ink }) => (
      <>
        <g fill={WHITE}>
          <path d="M50 50 C60 50 68 58 66 66 C64 73 56 70 50 70 C44 70 36 73 34 66 C32 58 40 50 50 50 Z" />
          <ellipse cx="31" cy="46" rx="5.5" ry="7" transform="rotate(-20 31 46)" />
          <ellipse cx="42" cy="34" rx="5.5" ry="7.5" transform="rotate(-6 42 34)" />
          <ellipse cx="58" cy="34" rx="5.5" ry="7.5" transform="rotate(6 58 34)" />
          <ellipse cx="69" cy="46" rx="5.5" ry="7" transform="rotate(20 69 46)" />
        </g>
        <g stroke={ink} strokeWidth="1.8" strokeLinecap="round">
          <path d="M28 37 L26 32 M41 25 L41 20 M59 25 L59 20 M72 37 L74 32" />
        </g>
      </>
    ),
  },
  heal: {
    anchor: BADGE,
    draw: ({ dark, ink }) => (
      <>
        <circle cx="50" cy="52" r="24" fill="none" stroke={ink} strokeWidth="1.4" opacity="0.7" />
        <path
          d="M44 32 H56 V46 H70 V58 H56 V72 H44 V58 H30 V46 H44 Z"
          fill={WHITE}
          stroke={dark}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <g fill={ink}>
          <path d="M24 30 l1.5 3.5 l3.5 1.5 l-3.5 1.5 l-1.5 3.5 l-1.5 -3.5 l-3.5 -1.5 l3.5 -1.5 Z" />
          <path d="M76 70 l1.2 2.8 l2.8 1.2 l-2.8 1.2 l-1.2 2.8 l-1.2 -2.8 l-2.8 -1.2 l2.8 -1.2 Z" />
        </g>
      </>
    ),
  },
  bow: {
    anchor: BADGE,
    draw: ({ ink }) => (
      <>
        <path d="M36 20 C62 32 62 68 36 80" fill="none" stroke={WHITE} strokeWidth="3.2" strokeLinecap="round" />
        <path d="M36 20 L36 80" stroke={ink} strokeWidth="1" />
        <g stroke={ink} strokeWidth="2" strokeLinecap="round">
          <path d="M24 50 H76" />
          <path d="M24 50 L20 46 M24 50 L20 54 M28 50 L24 46 M28 50 L24 54" />
        </g>
        <path d="M76 50 L69 45.5 L69 54.5 Z" fill={WHITE} />
      </>
    ),
  },
  mask: {
    anchor: BADGE,
    draw: ({ dark, ink }) => (
      <>
        <path
          d="M30 30 C30 22 70 22 70 30 L70 54 C70 66 62 76 50 76 C38 76 30 66 30 54 Z"
          fill={WHITE}
          stroke={dark}
          strokeWidth="1.2"
        />
        <path d="M34 40 L45 44 L44 49 L35 47 Z M66 40 L55 44 L56 49 L65 47 Z" fill={dark} />
        <path d="M40 62 H60 M43 59 V66 M47 59 V67 M53 59 V67 M57 59 V66" stroke={dark} strokeWidth="1.4" />
        <path d="M58 26 C60 34 60 40 58 44" stroke={ink} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  transformation: {
    anchor: BADGE,
    draw: ({ dark, ink }) => (
      <>
        <path
          d="M50 16 C56 26 66 26 70 34 C76 44 74 58 80 70 L20 70 C26 58 24 44 30 34 C34 26 44 26 50 16 Z"
          fill={ink}
          opacity="0.3"
        />
        <path
          d="M50 16 C56 26 66 26 70 34 C76 44 74 58 80 70 M50 16 C44 26 34 26 30 34 C24 44 26 58 20 70"
          fill="none"
          stroke={ink}
          strokeWidth="1.6"
        />
        <path d="M30 76 C30 62 38 57 50 57 C62 57 70 62 70 76 Z" fill={dark} />
        <circle cx="50" cy="44" r="10" fill={dark} />
        <g stroke={WHITE} strokeWidth="2" strokeLinecap="round">
          <path d="M24 56 V46 M21 49 L24 46 L27 49 M76 56 V46 M73 49 L76 46 L79 49" />
        </g>
      </>
    ),
  },
  item: {
    anchor: BADGE,
    draw: ({ dark, ink }) => (
      <>
        <path d="M28 46 H72 V72 H28 Z" fill={WHITE} opacity="0.92" />
        <path d="M28 46 C28 34 72 34 72 46 Z" fill={ink} stroke={dark} strokeWidth="1.2" />
        <path d="M28 46 H72 M38 38 V72 M62 38 V72" stroke={dark} strokeWidth="1.4" fill="none" />
        <rect x="45" y="44" width="10" height="11" rx="2" fill={ink} stroke={dark} strokeWidth="1.2" />
        <circle cx="50" cy="49" r="1.6" fill={dark} />
      </>
    ),
  },
  domain: {
    anchor: { cx: 50, cy: 52, r: 11 },
    draw: ({ dark, ink }) => (
      <>
        <path d="M20 68 A30 30 0 0 1 80 68 Z" fill={dark} opacity="0.55" />
        <g fill="none" stroke={ink} strokeLinecap="round">
          <path d="M20 68 A30 30 0 0 1 80 68" strokeWidth="1.8" />
          <path d="M30 68 A20 30 0 0 1 70 68" strokeWidth="1" opacity="0.6" />
          <path d="M14 68 H86" strokeWidth="2" />
        </g>
        <g fill={WHITE}>
          <circle cx="34" cy="50" r="1.2" />
          <circle cx="66" cy="48" r="1.2" />
          <circle cx="58" cy="34" r="1" />
          <circle cx="42" cy="36" r="1" />
        </g>
        <circle cx="50" cy="52" r="4" fill={WHITE} />
      </>
    ),
  },
  divine: {
    anchor: { cx: 50, cy: 54, r: 11 },
    draw: ({ ink }) => (
      <>
        <ellipse cx="50" cy="26" rx="16" ry="5" fill="none" stroke={ink} strokeWidth="2.4" />
        <g stroke={ink} strokeWidth="1.6" strokeLinecap="round" opacity="0.8">
          <path d="M50 70 V78 M30 54 H22 M70 54 H78 M36 40 L31 35 M64 40 L69 35 M36 68 L31 73 M64 68 L69 73" />
        </g>
        <circle cx="50" cy="54" r="15" fill={SOFT} />
        <circle cx="50" cy="54" r="5" fill={WHITE} />
      </>
    ),
  },
  movement: {
    anchor: { cx: 60, cy: 50, r: 11 },
    draw: ({ ink }) => (
      <>
        <g stroke={WHITE} strokeLinecap="round">
          <path d="M18 40 H42" strokeWidth="2.6" opacity="0.9" />
          <path d="M14 50 H44" strokeWidth="3" opacity="0.9" />
          <path d="M20 60 H42" strokeWidth="2.6" opacity="0.9" />
        </g>
        <circle cx="47" cy="50" r="12" fill={ink} opacity="0.2" />
        <circle cx="53" cy="50" r="13" fill={ink} opacity="0.35" />
        <circle cx="60" cy="50" r="14" fill={ink} />
        <circle cx="60" cy="50" r="5" fill={WHITE} />
      </>
    ),
  },
  fusion: {
    anchor: { cx: 50, cy: 50, r: 9 },
    draw: ({ ink }) => (
      <>
        <circle cx="40" cy="50" r="18" fill={SOFT} stroke={WHITE} strokeWidth="1.8" />
        <circle cx="60" cy="50" r="18" fill={SOFT} stroke={WHITE} strokeWidth="1.8" />
        <path d="M50 35 A18 18 0 0 1 50 65 A18 18 0 0 1 50 35 Z" fill={ink} />
      </>
    ),
  },
  aura: {
    anchor: { cx: 50, cy: 56, r: 11 },
    draw: ({ ink }) => (
      <>
        <path
          d="M50 18 C54 28 62 26 64 34 C70 30 70 40 74 46 C80 56 76 74 62 78 L38 78 C24 74 20 56 26 46 C30 40 30 30 36 34 C38 26 46 28 50 18 Z"
          fill={ink}
          opacity="0.32"
        />
        <path
          d="M50 30 C53 37 58 36 60 42 C64 46 66 54 64 62 C62 70 56 72 50 72 C44 72 38 70 36 62 C34 54 36 46 40 42 C42 36 47 37 50 30 Z"
          fill={ink}
          opacity="0.55"
        />
        <circle cx="50" cy="56" r="5" fill={WHITE} />
      </>
    ),
  },
  crown: {
    anchor: BADGE,
    draw: ({ dark, ink }) => (
      <>
        <path
          d="M26 66 L22 34 L36 46 L50 26 L64 46 L78 34 L74 66 Z"
          fill={ink}
          stroke={dark}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <rect x="26" y="66" width="48" height="8" rx="1.5" fill={ink} stroke={dark} strokeWidth="1.4" />
        <g fill={WHITE}>
          <circle cx="50" cy="56" r="3.6" />
          <circle cx="38" cy="58" r="2.4" />
          <circle cx="62" cy="58" r="2.4" />
          <circle cx="22" cy="33" r="2.2" />
          <circle cx="50" cy="25" r="2.2" />
          <circle cx="78" cy="33" r="2.2" />
        </g>
      </>
    ),
  },
};

/** Ancoraggio del glifo per i motivi-base dei mondi. */
const MOTIF_ANCHOR: Record<AbilityMotif, Anchor> = {
  spark: CENTER,
  chakra: CENTER,
  devilfruit: BADGE,
  ki: { cx: 50, cy: 50, r: 11 },
  nen: { cx: 50, cy: 51, r: 10 },
  magic_circle: CENTER,
  slash: BADGE,
  curse: { cx: 50, cy: 51, r: 11 },
  gourmet: BADGE,
};

/** Vertici dell'esagramma Nen di `AbilityMotifArt` (dall'alto, senso orario). */
const NEN_VERTICES: [number, number][] = [
  [50, 28],
  [69, 41],
  [69, 61],
  [50, 74],
  [31, 61],
  [31, 41],
];

function NenHighlight({ index, ink }: { index: number; ink: string }) {
  const [x, y] = NEN_VERTICES[index];
  return (
    <>
      <circle cx={x} cy={y} r="8" fill={ink} opacity="0.35" />
      <circle cx={x} cy={y} r="4.5" fill={WHITE} stroke={ink} strokeWidth="1.4" />
    </>
  );
}

/**
 * Immagine completa di una tecnica: forma della categoria + elemento + iniziali.
 * Da usare dentro l'`<svg viewBox="0 0 100 100">` di `EntityImage`.
 */
export function AbilityArtSvg({
  art,
  initials,
  dark,
  ink,
}: Colors & { art: AbilityArt; initials: string }) {
  const def = FORMS[art.form];
  const hasElement = Boolean(art.element);
  const anchor = def ? def.anchor : MOTIF_ANCHOR[art.form as AbilityMotif] ?? CENTER;

  return (
    <>
      {def ? (
        <>
          {def.draw({ dark, ink, hasElement })}
          <Label>{initials}</Label>
        </>
      ) : (
        <AbilityMotifArt
          motif={art.form as AbilityMotif}
          initials={initials}
          dark={dark}
          ink={ink}
        />
      )}
      {art.nenIndex !== undefined && <NenHighlight index={art.nenIndex} ink={ink} />}
      {art.element && (
        <ElementMark element={art.element} anchor={anchor} dark={dark} ink={ink} />
      )}
    </>
  );
}
