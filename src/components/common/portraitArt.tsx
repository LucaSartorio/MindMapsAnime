import type { ReactNode } from 'react';
import type { CharacterAppearance } from '@/types';
import { resolvePortrait, type ResolvedPortrait } from '@/lib/portrait';
import { shade } from '@/utils/entityImage';
import { DetailedPortrait } from '@/components/common/portraitDetailed';

/**
 * Ritratto SVG composto dai dati (`Character.appearance`): busto con l'abito,
 * testa con pelle/occhi, capigliatura e segni distintivi (fascia, cicatrice,
 * occhiali, corna…). Stile volutamente SIMBOLICO e geometrico — colori e sagome,
 * nessun tratto copiato dai design ufficiali.
 *
 * Coordinate nel `viewBox="0 0 100 100"` di `EntityImage`: testa centrata in
 * (50,47), viso 30×34, spalle da y≈73.
 */

const WHITE = '#ffffff';
const INK = '#1b1c24';
const SCAR = '#9a3f3f';
const STRAW = '#f2c14e';
const BONE = '#ece5cf';

/* ------------------------------ Capelli ------------------------------ */

/** Calotta con frangia: la base di quasi tutte le capigliature. */
const CAP =
  'M33.5 50 C32 34 40 27 50 27 C60 27 68 34 66.5 50 C64 42 61 39 58 38 ' +
  'C54 41 46 41 42 38 C39 39 36 42 33.5 50 Z';
const PART =
  'M33 52 C31 34 40 27 50 27 C60 27 69 34 67 52 C65 42 60 36 52 33 L50 37 L48 33 ' +
  'C40 36 35 42 33 52 Z';
const SLICK =
  'M34 44 C33 32 41 27 50 27 C59 27 67 32 66 44 C62 36 57 33 50 33 C43 33 38 36 34 44 Z';

/** Strato DIETRO la testa (code, chiome lunghe, afro…). */
function backHair(style: string, c: string): ReactNode {
  switch (style) {
    case 'long':
    case 'hime':
      return <path d="M31 44 C28 60 30 76 27 90 L73 90 C70 76 72 60 69 44 Z" fill={c} />;
    case 'long_spiky':
      return (
        <path
          d="M30 40 L21 50 L28 54 L19 66 L28 68 L22 84 L34 79 L37 90 L63 90 L66 79 L78 84 L72 68 L81 66 L72 54 L79 50 L70 40 Z"
          fill={c}
        />
      );
    case 'bob':
      return <path d="M31 42 C29 52 30 61 33 64 L67 64 C70 61 71 52 69 42 Z" fill={c} />;
    case 'ponytail':
      return (
        <>
          <path d="M60 31 C77 28 82 46 76 66 C74 54 70 45 63 40 Z" fill={c} />
          <circle cx="64" cy="33" r="2.4" fill={shade(c, -0.35)} />
        </>
      );
    case 'bun':
      return <circle cx="50" cy="24" r="8" fill={c} />;
    case 'twin_tails':
      return (
        <>
          <path d="M37 34 C25 38 22 58 27 76 C29 62 32 50 40 43 Z" fill={c} />
          <path d="M63 34 C75 38 78 58 73 76 C71 62 68 50 60 43 Z" fill={c} />
        </>
      );
    case 'swept':
      return <path d="M58 29 L75 23 L68 33 L78 36 L67 40 Z" fill={c} />;
    case 'afro':
      return <circle cx="50" cy="38" r="23" fill={c} />;
    case 'crest':
      return <path d="M32 44 L27 23 L40 30 L50 12 L60 30 L73 23 L68 44 Z" fill={c} />;
    default:
      return null;
  }
}

/** Strato DAVANTI (sopra il viso). */
function frontHair(style: string, c: string): ReactNode {
  const dark = shade(c, -0.28);
  switch (style) {
    case 'bald':
      return <ellipse cx="44" cy="35" rx="5" ry="2.4" fill={WHITE} opacity="0.25" />;
    case 'spiky':
      return (
        <>
          <path
            d="M31 46 L26 36 L33 37 L30 26 L38 31 L39 20 L45 27 L50 17 L55 27 L61 20 L62 31 L70 26 L67 37 L74 36 L69 46 C66 38 60 35 50 35 C40 35 34 38 31 46 Z"
            fill={c}
          />
          <path d="M37 35 L40 44 L44 37 L47 43 L50 36 L53 43 L56 37 L60 44 L63 35 Z" fill={c} />
        </>
      );
    case 'saiyan':
      return (
        <>
          <path
            d="M32 47 C31 36 33 30 37 26 L32 13 L42 22 L45 7 L51 19 L57 6 L60 20 L69 11 L66 26 C69 31 70 38 68 47 C65 39 58 36 50 36 C42 36 35 39 32 47 Z"
            fill={c}
          />
          <path d="M41 35 L44 46 L48 36 Z M52 36 L56 45 L59 35 Z" fill={c} />
        </>
      );
    case 'messy':
      return (
        <path
          d="M32 48 C30 38 33 30 39 27 L37 21 L44 25 L48 18 L52 24 L58 19 L60 26 L67 24 L65 31 C69 36 69 42 68 48 C65 41 62 38 58 37 L56 43 L53 37 L49 43 L46 37 L42 43 L40 38 C36 40 34 43 32 48 Z"
          fill={c}
        />
      );
    case 'swept':
      return (
        <>
          <path d={CAP} fill={c} />
          <path d="M34 39 C32 47 33 54 36 60 L39 45 Z M66 39 C68 47 67 54 64 60 L61 45 Z" fill={c} />
        </>
      );
    case 'long':
      return <path d={PART} fill={c} />;
    case 'long_spiky':
      return (
        <>
          <path d={PART} fill={c} />
          <path d="M36 35 L39 45 L43 37 L46 44 L49 36 Z M51 36 L54 44 L57 37 L61 45 L64 35 Z" fill={c} />
        </>
      );
    case 'hime':
      return (
        <>
          <path d="M33 44 C32 31 40 27 50 27 C60 27 68 31 67 44 Z" fill={c} />
          <path d="M33 40 H39 V60 H33 Z M61 40 H67 V60 H61 Z" fill={c} />
          <path d="M35 43.5 H65" stroke={dark} strokeWidth="0.8" />
        </>
      );
    case 'bob':
      return (
        <>
          <path d={CAP} fill={c} />
          <path d="M33 42 C32 50 33 57 35 62 L39 46 Z M67 42 C68 50 67 57 65 62 L61 46 Z" fill={c} />
        </>
      );
    case 'ponytail':
    case 'slick':
      return <path d={SLICK} fill={c} />;
    case 'buzz':
      return (
        <path
          d="M35.5 44 C35 33 42 29.5 50 29.5 C58 29.5 65 33 64.5 44 C61 38 56 36 50 36 C44 36 39 38 35.5 44 Z"
          fill={c}
          opacity="0.9"
        />
      );
    case 'mohawk':
      return <path d="M46 37 L43 20 L50 11 L57 20 L54 37 Z" fill={c} />;
    case 'afro':
      return <path d="M33 44 C33 33 41 29 50 29 C59 29 67 33 67 44 C62 38 56 37 50 37 C44 37 38 38 33 44 Z" fill={c} />;
    case 'dome':
      return (
        <>
          <path d="M33 50 C31 30 40 21 50 21 C60 21 69 30 67 50 C64 40 58 36 50 36 C42 36 36 40 33 50 Z" fill={c} />
          <ellipse cx="44" cy="28" rx="5" ry="2.2" fill={WHITE} opacity="0.35" />
        </>
      );
    case 'crest':
      return <path d={SLICK} fill={dark} />;
    case 'bun':
    case 'twin_tails':
    case 'short':
    default:
      return <path d={CAP} fill={c} />;
  }
}

/* ------------------------------- Volto ------------------------------- */

function Eye({ cx, color }: { cx: number; color: string }) {
  return (
    <g>
      <ellipse cx={cx} cy="49" rx="3.4" ry="2.6" fill={WHITE} />
      <circle cx={cx} cy="49.2" r="2.1" fill={color} />
      <circle cx={cx} cy="49.3" r="0.9" fill={INK} />
      <circle cx={cx + 0.7} cy="48.5" r="0.55" fill={WHITE} />
      <path d={`M${cx - 3.6} 48 Q${cx} 45.6 ${cx + 3.6} 48`} fill="none" stroke={INK} strokeWidth="0.9" />
    </g>
  );
}

function HumanFace({ p, marks }: { p: ResolvedPortrait; marks: Set<string> }) {
  const skinShadow = shade(p.skin, -0.14);
  const brow = p.hairStyle === 'bald' || p.hairStyle === 'dome' ? INK : shade(p.hair, -0.3);
  return (
    <>
      <rect x="44" y="58" width="12" height="17" fill={skinShadow} />
      <ellipse cx="35" cy="49" rx="2.6" ry="4" fill={skinShadow} />
      <ellipse cx="65" cy="49" rx="2.6" ry="4" fill={skinShadow} />
      <ellipse cx="50" cy="47" rx="15" ry="17" fill={p.skin} />
      {marks.has('split_face') && (
        <path d="M50 30 C42 30 35 37 35 47 C35 57 42 64 50 64 Z" fill={INK} opacity="0.88" />
      )}
      {marks.has('cyclops') ? (
        <g>
          <ellipse cx="50" cy="48" rx="7" ry="5" fill={WHITE} />
          <circle cx="50" cy="48" r="4" fill={p.eyes} />
          <circle cx="50" cy="48" r="1.6" fill={INK} />
        </g>
      ) : (
        <>
          <Eye cx={44.5} color={p.eyes} />
          <Eye cx={55.5} color={p.eyes} />
          <path d="M41 44.6 L47.5 43.8 M52.5 43.8 L59 44.6" stroke={brow} strokeWidth="1.2" strokeLinecap="round" />
        </>
      )}
      <path d="M47.2 58 Q50 59.6 52.8 58" fill="none" stroke={shade(p.skin, -0.5)} strokeWidth="0.9" strokeLinecap="round" />
    </>
  );
}

function BeastFace({ p }: { p: ResolvedPortrait }) {
  const fur = p.hair;
  const muzzle = shade(fur, 0.35);
  return (
    <>
      <path d="M33 40 L28 18 L45 32 Z M67 40 L72 18 L55 32 Z" fill={fur} />
      <path d="M34 36 L31 24 L41 32 Z M66 36 L69 24 L59 32 Z" fill={shade(fur, -0.3)} />
      <ellipse cx="50" cy="47" rx="18" ry="17" fill={fur} />
      <ellipse cx="50" cy="56" rx="9.5" ry="7" fill={muzzle} />
      <path d="M47 52.5 H53 L50 55.5 Z" fill={INK} />
      <path d="M50 55.5 V58 M46.5 59 Q50 61 53.5 59" stroke={INK} strokeWidth="0.9" fill="none" />
      <path d="M39 46 L47 48 L39 50.5 Z M61 46 L53 48 L61 50.5 Z" fill={p.eyes} stroke={INK} strokeWidth="0.8" />
      <circle cx="43" cy="48.2" r="0.9" fill={INK} />
      <circle cx="57" cy="48.2" r="0.9" fill={INK} />
    </>
  );
}

/* --------------------------- Segni distintivi --------------------------- */

/** Segni sotto i capelli davanti (pelle, sguardo). */
function faceMarks(m: Set<string>, p: ResolvedPortrait): ReactNode[] {
  const out: ReactNode[] = [];
  if (m.has('whiskers'))
    out.push(
      <path
        key="wh"
        d="M36.5 52.5 L42 53.5 M36.5 55 L42 55.3 M37 57.5 L42 57 M63.5 52.5 L58 53.5 M63.5 55 L58 55.3 M63 57.5 L58 57"
        stroke={INK}
        strokeWidth="0.8"
        strokeLinecap="round"
      />,
    );
  if (m.has('cheek_marks'))
    out.push(<path key="ck" d="M38.5 52 L42.5 52 L40.5 57.5 Z M57.5 52 L61.5 52 L59.5 57.5 Z" fill={p.accent} />);
  if (m.has('eye_lines'))
    out.push(
      <path key="el" d="M41.5 52 L42.5 56.5 M58.5 52 L57.5 56.5" stroke={p.accent} strokeWidth="1.1" strokeLinecap="round" />,
    );
  if (m.has('scar_eye'))
    out.push(
      <path key="se" d="M54 42.5 L57.5 55.5 M54 46 L56.5 45.4 M55 50 L57.5 49.4" stroke={SCAR} strokeWidth="1.1" strokeLinecap="round" />,
    );
  if (m.has('scar_cheek'))
    out.push(
      <path key="sc" d="M53.5 53.6 Q56 54.8 58.5 53.6 M54.6 52.6 L54.4 55 M56 53 L56 55.4 M57.4 52.6 L57.6 55" stroke={SCAR} strokeWidth="0.75" strokeLinecap="round" fill="none" />,
    );
  if (m.has('scar_nose'))
    out.push(<path key="sn" d="M41 52.5 L59 52.5" stroke={SCAR} strokeWidth="1.1" strokeLinecap="round" />);
  if (m.has('stitches'))
    out.push(
      <path
        key="st"
        d="M38 40 L62 58 M41 39.6 L40 42.6 M45 42.6 L44 45.6 M49 45.6 L48 48.6 M53 48.6 L52 51.6 M57 51.6 L56 54.6"
        stroke={INK}
        strokeWidth="0.75"
        strokeLinecap="round"
      />,
    );
  if (m.has('forehead_mark'))
    out.push(<path key="fm" d="M50 35.5 L52.2 38.5 L50 41.5 L47.8 38.5 Z" fill={p.hasAccent ? p.accent : '#8e5ad0'} />);
  if (m.has('forehead_tattoo'))
    out.push(<path key="ft" d="M38.5 36.5 L43 35 M40.5 34 L41 38.6 M39 38.4 L43 37.4" stroke="#c0303a" strokeWidth="1" strokeLinecap="round" />);
  if (m.has('third_eye'))
    out.push(
      <g key="te">
        <ellipse cx="50" cy="38.5" rx="2.8" ry="2" fill={WHITE} />
        <circle cx="50" cy="38.6" r="1.3" fill={p.eyes} />
      </g>,
    );
  if (m.has('bone_fragment'))
    out.push(
      <g key="bf">
        <path d="M51 55 C58 56 64 54 66 49 L66 59 C62 64 56 66 51 65 Z" fill={BONE} stroke={INK} strokeWidth="0.6" />
        <path d="M54 57.5 V61.5 M57 57.2 V61.8 M60 56.4 V61 M63 55 V59" stroke={INK} strokeWidth="0.6" />
      </g>,
    );
  return out;
}

/** Accessori sopra tutto (cappelli, fasce, occhiali, corna…). */
function overMarks(m: Set<string>, p: ResolvedPortrait, ink: string): ReactNode[] {
  const out: ReactNode[] = [];
  if (m.has('eyepatch'))
    out.push(
      <g key="ep">
        <path d="M38 41 L66 53" stroke={INK} strokeWidth="1" />
        <ellipse cx="55.5" cy="49" rx="4.4" ry="3.8" fill={INK} />
      </g>,
    );
  if (m.has('blindfold')) out.push(<rect key="bl" x="33.5" y="44.5" width="33" height="8" rx="1.5" fill={INK} />);
  if (m.has('glasses'))
    out.push(
      <g key="gl" fill="none" stroke={INK} strokeWidth="0.9">
        <circle cx="44.5" cy="49" r="4.3" />
        <circle cx="55.5" cy="49" r="4.3" />
        <path d="M48.8 48.6 H51.2 M40.2 48.4 L35.5 47.5 M59.8 48.4 L64.5 47.5" />
      </g>,
    );
  if (m.has('sunglasses'))
    out.push(
      <g key="sg">
        <rect x="39.5" y="45.8" width="9.5" height="6" rx="2.2" fill={INK} />
        <rect x="51" y="45.8" width="9.5" height="6" rx="2.2" fill={INK} />
        <path d="M49 48 H51 M39.5 47.5 L35.5 46.8 M60.5 47.5 L64.5 46.8" stroke={INK} strokeWidth="1" />
      </g>,
    );
  if (m.has('mask_lower'))
    out.push(
      <path key="ml" d="M34.6 51.5 C35 60 41 65.5 50 65.5 C59 65.5 65 60 65.4 51.5 L56 51.5 L50 53.5 L44 51.5 Z M43.5 63 H56.5 V75 H43.5 Z" fill={p.hasAccent ? p.accent : '#2c3346'} />,
    );
  if (m.has('beard'))
    out.push(
      <path key="bd" d="M35 52 C36 64 43 71 50 71 C57 71 64 64 65 52 C62 60 57 62.5 50 62.5 C43 62.5 38 60 35 52 Z" fill={p.hair} />,
    );
  if (m.has('mustache'))
    out.push(
      <path key="mu" d="M41 57.5 C44 53.5 48 54 50 55.6 C52 54 56 53.5 59 57.5 C55.5 56.6 53 57 50 57.6 C47 57 44.5 56.6 41 57.5 Z" fill={p.hair} />,
    );
  if (m.has('earrings'))
    out.push(
      <g key="er" fill="#e8c14a">
        <circle cx="35" cy="54.5" r="1.3" />
        <circle cx="65" cy="54.5" r="1.3" />
      </g>,
    );
  if (m.has('headband'))
    out.push(
      <g key="hb">
        <rect x="32.5" y="34" width="35" height="6" rx="1.5" fill="#26304a" />
        <rect x="44" y="34.5" width="12" height="5" rx="0.8" fill={ink} stroke={WHITE} strokeOpacity="0.5" strokeWidth="0.5" />
      </g>,
    );
  if (m.has('goggles'))
    out.push(
      <g key="go">
        <rect x="33" y="29" width="34" height="3" fill={INK} />
        <circle cx="43" cy="30.5" r="4.6" fill="#8fc6f0" stroke={INK} strokeWidth="1.2" />
        <circle cx="57" cy="30.5" r="4.6" fill="#8fc6f0" stroke={INK} strokeWidth="1.2" />
      </g>,
    );
  if (m.has('bandana'))
    out.push(
      <g key="ba">
        <path d="M33 42 C32 30 40 25 50 25 C60 25 68 30 67 42 C62 37 56 36 50 36 C44 36 38 37 33 42 Z" fill={p.accent} />
        <path d="M66 38 L74 42 L70 46 Z" fill={p.accent} />
      </g>,
    );
  if (m.has('strawhat'))
    out.push(
      <g key="sh">
        <ellipse cx="50" cy="33" rx="29" ry="6.5" fill={shade(STRAW, -0.25)} />
        <ellipse cx="50" cy="32" rx="29" ry="5.8" fill={STRAW} />
        <path d="M36 31.5 C37 17 63 17 64 31.5 Z" fill={STRAW} />
        <path d="M36.3 28.5 H63.7 V31.6 H36.3 Z" fill="#c8303a" />
      </g>,
    );
  if (m.has('hat'))
    out.push(
      <g key="ht">
        <ellipse cx="50" cy="32" rx="27" ry="5.5" fill={shade(p.accent, -0.2)} />
        <path d="M37 31.5 C37 18 63 18 63 31.5 Z" fill={p.accent} />
        <path d="M37.2 28.5 H62.8 V31.5 H37.2 Z" fill={shade(p.accent, -0.45)} />
      </g>,
    );
  if (m.has('horns'))
    out.push(
      <path key="ho" d="M39 33 C34 27 33 20 35 13 C39 20 42 25 44 30 Z M61 33 C66 27 67 20 65 13 C61 20 58 25 56 30 Z" fill={p.hasAccent ? p.accent : BONE} stroke={INK} strokeWidth="0.5" />,
    );
  if (m.has('antennae'))
    out.push(
      <g key="an" stroke={p.skin} strokeWidth="1.8" strokeLinecap="round">
        <path d="M45 30 L40 17 M55 30 L60 17" />
        <circle cx="40" cy="16.5" r="1.6" fill={p.skin} />
        <circle cx="60" cy="16.5" r="1.6" fill={p.skin} />
      </g>,
    );
  if (m.has('animal_ears'))
    out.push(
      <g key="ae">
        <path d="M34 35 L31 17 L45 28 Z M66 35 L69 17 L55 28 Z" fill={p.hair} />
        <path d="M35 31 L33.5 21.5 L41.5 28 Z M65 31 L66.5 21.5 L58.5 28 Z" fill="#f2a6b8" />
      </g>,
    );
  if (m.has('halo'))
    out.push(<ellipse key="hl" cx="50" cy="18" rx="13" ry="3.5" fill="none" stroke="#f3d36a" strokeWidth="2" />);
  if (m.has('crown'))
    out.push(
      <path key="cr" d="M39 30 L37 19 L44 24 L50 15 L56 24 L63 19 L61 30 Z" fill="#e8c14a" stroke={INK} strokeWidth="0.6" />,
    );
  return out;
}

function FurCollar({ color }: { color: string }) {
  const xs = [16, 23, 30, 37, 44, 56, 63, 70, 77, 84];
  return (
    <g fill={color}>
      {xs.map((x, i) => (
        <circle key={x} cx={x} cy={i < 5 ? 82 - i * 2 : 74 + (i - 5) * 2} r="6" />
      ))}
    </g>
  );
}

/** Ritratto completo; `ink` è il colore firma del mondo (placca della fascia…). */
export function PortraitArt({ appearance, ink, uid = 'p' }: { appearance: CharacterAppearance; ink: string; uid?: string }) {
  // Ritratto dettagliato (volto, abito e capelli disegnati per il personaggio).
  if (appearance.face) return <DetailedPortrait appearance={appearance} uid={uid} ink={ink} />;
  const p = resolvePortrait(appearance);
  const m = p.marks;
  const outfit = appearance.outfit ? p.outfit : p.beast ? shade(p.hair, -0.2) : p.outfit;
  return (
    // Leggero ingrandimento: nelle miniature il volto deve restare leggibile.
    <g transform="translate(50 56) scale(1.12) translate(-50 -56)">
      {p.beast ? null : backHair(p.hairStyle, p.hair)}
      <path d="M12 100 C12 82 28 73 50 73 C72 73 88 82 88 100 Z" fill={outfit} />
      {!p.beast && <path d="M43 73 L50 83 L57 73 Z" fill={shade(p.skin, -0.14)} />}
      {m.has('fur_collar') && <FurCollar color={p.accent} />}
      {p.beast ? (
        <BeastFace p={p} />
      ) : (
        <>
          <HumanFace p={p} marks={m} />
          {faceMarks(m, p)}
          {frontHair(p.hairStyle, p.hair)}
        </>
      )}
      {overMarks(m, p, ink)}
    </g>
  );
}
