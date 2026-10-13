import type { CharacterAppearance } from '@/types';
import { portraitColor, resolvePortrait, type ResolvedPortrait } from '@/lib/portrait';
import { shade } from '@/utils/entityImage';

/**
 * Ritratto DETTAGLIATO di un personaggio (quando `appearance.face` è presente).
 *
 * Disegno proprio, ricostruito dalle descrizioni testuali dell'aspetto: volto
 * anime (forma, occhi, sopracciglia, naso, bocca), abito, capigliatura con sagoma
 * scritta nei dati (`hairFront`/`hairBack`) e segni distintivi. Nessuna immagine
 * ufficiale è scaricata o ricalcata.
 *
 * Coordinate nel `viewBox="0 0 100 100"`: testa da y≈21 a y≈66, occhi a y=46
 * (x 43 e 57), spalle da y≈72. Sinistra/destra = lato di chi guarda.
 */

const INK = '#1b1a22';
const WHITE = '#ffffff';
const SCAR = '#a34848';
const STRAW = '#f0c454';

const FACES: Record<string, string> = {
  male:
    'M33.5 40 C33.5 28 41 21 50 21 C59 21 66.5 28 66.5 40 L66.2 47 C65.8 55 61 61.5 55 65 ' +
    'C52.6 66.5 47.4 66.5 45 65 C39 61.5 34.2 55 33.8 47 Z',
  female:
    'M34 40 C34 28 41 21.5 50 21.5 C59 21.5 66 28 66 40 L65.8 46 C65.3 53 60.5 59.5 54.5 63 ' +
    'C52.3 64.2 47.7 64.2 45.5 63 C39.5 59.5 34.7 53 34.2 46 Z',
  round:
    'M33 41 C33 28 41 21 50 21 C59 21 67 28 67 41 C67 55 60 65 50 65 C40 65 33 55 33 41 Z',
  square:
    'M33 39 C33 27 41 20.5 50 20.5 C59 20.5 67 27 67 39 L67 50 C67 58 63 63 57 65.5 ' +
    'L43 65.5 C37 63 33 58 33 50 Z',
  long:
    'M34.5 40 C34.5 27 41.5 20 50 20 C58.5 20 65.5 27 65.5 40 L65.2 50 C64.6 59 60 65.5 54 68 ' +
    'C51.8 69 48.2 69 46 68 C40 65.5 35.4 59 34.8 50 Z',
};

/* -------------------------------- Corpo -------------------------------- */

const TORSO = 'M7 100 C8 86 17 78 31 75 L42 72 L58 72 L69 75 C83 78 92 86 93 100 Z';

function Body({ a, p }: { a: CharacterAppearance; p: ResolvedPortrait }) {
  const c1 = p.outfit;
  const c2 = portraitColor(a.outfit2, '#f1f1f1');
  const c3 = portraitColor(a.outfit3, '#22232b');
  const skin = p.skin;
  const fold = shade(c1, -0.28);
  const line = { stroke: INK, strokeWidth: 1, strokeLinejoin: 'round' as const };
  switch (a.clothes) {
    // Gilet aperto sul petto nudo (Rufy).
    case 'vest_open':
      return (
        <>
          <path d={TORSO} fill={skin} {...line} />
          <path d="M7 100 C8 86 17 78 31 75 L41 72.5 C39 82 37 92 36 100 Z" fill={c1} {...line} />
          <path d="M93 100 C92 86 83 78 69 75 L59 72.5 C61 82 63 92 64 100 Z" fill={c1} {...line} />
          <path d="M31 75 C30 84 31 92 33 100 M69 75 C70 84 69 92 67 100" stroke={fold} strokeWidth="1" fill="none" />
        </>
      );
    // Veste incrociata (kimono, vestaglia) aperta a V.
    case 'robe':
      return (
        <>
          <path d={TORSO} fill={c1} {...line} />
          <path d="M42 72 L50 96 L58 72 Z" fill={skin} {...line} />
          <path d="M42 72 L50 96 M58 72 L50 96" stroke={shade(c1, 0.25)} strokeWidth="2.6" />
          <path d="M42 72 L50 96 L58 72" fill="none" {...line} />
          <path d="M24 80 C27 88 28 94 27 100 M76 80 C73 88 72 94 73 100" stroke={fold} strokeWidth="1" fill="none" />
        </>
      );
    // Canotta / top con spalline.
    case 'tank':
      return (
        <>
          <path d={TORSO} fill={skin} {...line} />
          <path d="M27 100 C27 90 30 84 35 82 C40 86 60 86 65 82 C70 84 73 90 73 100 Z" fill={c1} {...line} />
          <path d="M35 82 L37 74 M65 82 L63 74" stroke={c1} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M35 82 L37 74 M65 82 L63 74" stroke={INK} strokeWidth="0.6" fill="none" />
        </>
      );
    // Salopette a bretelle sul torso nudo (Usopp).
    case 'overalls':
      return (
        <>
          <path d={TORSO} fill={skin} {...line} />
          <path d="M33 100 L35 90 L65 90 L67 100 Z" fill={c1} {...line} />
          <path d="M31 75.5 L38 90 L43 90 L37 74 Z M69 75.5 L62 90 L57 90 L63 74 Z" fill={c1} {...line} />
          <circle cx="40.5" cy="88" r="1.3" fill="#e8c84a" stroke={INK} strokeWidth="0.5" />
          <circle cx="59.5" cy="88" r="1.3" fill="#e8c84a" stroke={INK} strokeWidth="0.5" />
        </>
      );
    // Completo: giacca (c1), camicia (c2), cravatta (c3).
    case 'suit':
      return (
        <>
          <path d={TORSO} fill={c1} {...line} />
          <path d="M42 72 L50 92 L58 72 Z" fill={c2} {...line} />
          <path d="M48.2 77 L51.8 77 L53 92 L50 96 L47 92 Z" fill={c3} {...line} />
          <path d="M47.6 73.5 L52.4 73.5 L51.8 77 L48.2 77 Z" fill={c3} {...line} />
          <path d="M42 72 L38 80 L45 82 L50 96 M58 72 L62 80 L55 82 L50 96" fill="none" stroke={INK} strokeWidth="1" />
          <path d="M43 72 L46 76 L50 74 L54 76 L57 72" fill={c2} {...line} />
          <circle cx="42" cy="93" r="1.2" fill="#e8c84a" />
          <circle cx="58" cy="93" r="1.2" fill="#e8c84a" />
        </>
      );
    // Cappotto/mantello con colletto rialzato.
    case 'coat':
      return (
        <>
          <path d={TORSO} fill={c1} {...line} />
          <path d="M42 72 L50 90 L58 72 Z" fill={c2} {...line} />
          <path d="M37 66 L42 72 L50 90 L40 78 Z M63 66 L58 72 L50 90 L60 78 Z" fill={shade(c1, 0.12)} {...line} />
        </>
      );
    // T-shirt / maglia girocollo.
    case 'tshirt':
    default:
      return (
        <>
          <path d={TORSO} fill={c1} {...line} />
          <path d="M42 72 C44 77 56 77 58 72" fill={skin} {...line} />
          <path d="M24 80 C27 88 28 94 27 100 M76 80 C73 88 72 94 73 100" stroke={fold} strokeWidth="1" fill="none" />
        </>
      );
  }
}

/* -------------------------------- Volto -------------------------------- */

function Eye({ cx, style, color, side }: { cx: number; style: string; color: string; side: 'l' | 'r' }) {
  const cy = 46;
  const dir = side === 'l' ? 1 : -1; // verso il naso
  switch (style) {
    case 'hidden':
      return null;
    case 'closed':
      return <path d={`M${cx - 4.4} ${cy + 0.5} Q${cx} ${cy + 2.2} ${cx + 4.4} ${cy + 0.5}`} fill="none" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />;
    case 'sharp':
      return (
        <g>
          <path d={`M${cx - 5} ${cy + 0.6} C${cx - 3} ${cy - 2.2} ${cx + 3} ${cy - 2.4} ${cx + 5} ${cy - 0.6} C${cx + 3} ${cy + 1.8} ${cx - 3} ${cy + 2.3} ${cx - 5} ${cy + 0.6} Z`} fill={WHITE} />
          <circle cx={cx + dir * 0.4} cy={cy} r="2" fill={color} />
          <circle cx={cx + dir * 0.4} cy={cy} r="0.9" fill={INK} />
          <path d={`M${cx - 5.4} ${cy + 0.8} C${cx - 3} ${cy - 2.6} ${cx + 3} ${cy - 2.8} ${cx + 5.4} ${cy - 1.2}`} fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
        </g>
      );
    case 'big':
      return (
        <g>
          <ellipse cx={cx} cy={cy} rx="4.2" ry="4.6" fill={WHITE} />
          <ellipse cx={cx + dir * 0.3} cy={cy + 0.4} rx="3" ry="3.9" fill={color} />
          <ellipse cx={cx + dir * 0.3} cy={cy - 1} rx="3" ry="2" fill={shade(color, -0.35)} opacity="0.7" />
          <circle cx={cx + dir * 0.3} cy={cy + 0.6} r="1.4" fill={INK} />
          <circle cx={cx + dir * 0.3 + 1} cy={cy - 0.8} r="0.9" fill={WHITE} />
          <path d={`M${cx - 4.8} ${cy - 1.2} C${cx - 3} ${cy - 5} ${cx + 3} ${cy - 5} ${cx + 4.8} ${cy - 1.2}`} fill="none" stroke={INK} strokeWidth="1.7" strokeLinecap="round" />
          {/* Ciglia: piccolo guizzo all'angolo esterno. */}
          <path d={`M${cx - dir * 4.8} ${cy - 1.2} l${-dir * 1.6} ${-1.8}`} stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
          <path d={`M${cx - 3} ${cy + 4.3} Q${cx} ${cy + 5.2} ${cx + 3} ${cy + 4.3}`} fill="none" stroke={INK} strokeWidth="0.6" />
        </g>
      );
    case 'small':
      return (
        <g>
          <ellipse cx={cx} cy={cy} rx="4" ry="3.8" fill={WHITE} />
          <circle cx={cx} cy={cy + 0.3} r="1.5" fill={INK} />
          <path d={`M${cx - 4.4} ${cy - 0.8} C${cx - 3} ${cy - 4.2} ${cx + 3} ${cy - 4.2} ${cx + 4.4} ${cy - 0.8}`} fill="none" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
        </g>
      );
    case 'narrow':
      return (
        <g>
          <path d={`M${cx - 4.6} ${cy} Q${cx} ${cy - 2.4} ${cx + 4.6} ${cy} Q${cx} ${cy + 1.6} ${cx - 4.6} ${cy} Z`} fill={WHITE} />
          <circle cx={cx} cy={cy} r="1.5" fill={color} />
          <path d={`M${cx - 4.8} ${cy} Q${cx} ${cy - 2.8} ${cx + 4.8} ${cy}`} fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );
    // Rotondo, iride grande (default).
    case 'round':
    default:
      return (
        <g>
          <ellipse cx={cx} cy={cy} rx="4" ry="4.4" fill={WHITE} />
          <ellipse cx={cx + dir * 0.4} cy={cy + 0.5} rx="2.9" ry="3.4" fill={color} />
          <circle cx={cx + dir * 0.4} cy={cy + 0.6} r="1.4" fill={INK} />
          <circle cx={cx + dir * 0.4 + 1} cy={cy - 0.7} r="0.85" fill={WHITE} />
          <path d={`M${cx - 4.4} ${cy - 1} C${cx - 3} ${cy - 4.8} ${cx + 3} ${cy - 4.8} ${cx + 4.4} ${cy - 1}`} fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );
  }
}

function Brows({ style, color, eyeL, eyeR }: { style: string; color: string; eyeL: string; eyeR: string }) {
  const sw = { fill: 'none', stroke: color, strokeLinecap: 'round' as const };
  const show = (e: string) => e !== 'hidden';
  const pair = (l: string, r: string, w: number) => (
    <g {...sw} strokeWidth={w}>
      {show(eyeL) && <path d={l} />}
      {show(eyeR) && <path d={r} />}
    </g>
  );
  switch (style) {
    case 'none':
      return null;
    case 'thick':
      return pair('M38.5 39.6 C41 38.2 45 38.2 47.5 39.4', 'M52.5 39.4 C55 38.2 59 38.2 61.5 39.6', 2.2);
    case 'angry':
      return pair('M38.5 37.8 C41.5 38.4 45 39.6 47.8 41.2', 'M52.2 41.2 C55 39.6 58.5 38.4 61.5 37.8', 2.2);
    case 'thin':
      return pair('M39 39.4 C41.5 38 45 38 47.4 39', 'M52.6 39 C55 38 58.5 38 61 39.4', 1);
    case 'raised':
      return pair('M39 38.6 C41.5 36 45 36 47.4 37.6', 'M52.6 37.6 C55 36 58.5 36 61 38.6', 1.6);
    // Sopracciglio a spirale (Sanji): la spirale è all'estremità interna di quello di destra.
    case 'spiral':
      return (
        <g {...sw} strokeWidth="1.6">
          {show(eyeL) && <path d="M39 39.6 C41.5 38 45 38 47.4 39" />}
          {show(eyeR) && <path d="M61.5 39.8 C59 38 55.5 38 53.5 39 C51.6 40 51.8 42.2 53.4 42.2 C54.8 42.2 55 40.6 53.8 40.4" />}
        </g>
      );
    case 'normal':
    default:
      return pair('M39 39.4 C41.5 37.8 45 37.8 47.4 39', 'M52.6 39 C55 37.8 58.5 37.8 61 39.4', 1.6);
  }
}

function Nose({ style, skin }: { style: string; skin: string }) {
  const sh = shade(skin, -0.32);
  switch (style) {
    case 'none':
      return null;
    // Naso lungo (Usopp): sporge in avanti, visto di tre quarti verso destra.
    case 'long':
      return (
        <g>
          <path d="M48.5 49 C50 48 52 48.4 54 49.4 L70.5 55.4 C73 56.4 72.6 59.6 70 59.4 L52.5 56.4 C49.5 56 48 54 48.5 49 Z" fill={skin} stroke={INK} strokeWidth="1" strokeLinejoin="round" />
          <path d="M52.5 54.4 L69 58" stroke={sh} strokeWidth="1.2" strokeLinecap="round" />
        </g>
      );
    case 'flat':
      return <path d="M47.8 53.6 Q50 55 52.2 53.6" fill="none" stroke={sh} strokeWidth="1" strokeLinecap="round" />;
    case 'small':
    default:
      return <path d="M50.4 48.8 L49.2 53.4 L51.2 53.8" fill="none" stroke={sh} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />;
  }
}

function Mouth({ style, skin }: { style: string; skin: string }) {
  const lip = shade(skin, -0.5);
  switch (style) {
    // Sorriso enorme a bocca aperta (Rufy).
    case 'grin':
      return (
        <g>
          <path d="M40.5 55.5 C44 64.5 56 64.5 59.5 55.5 Z" fill="#7a2a2e" stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
          <path d="M41.3 56 L58.7 56 C58.3 57.4 57.6 58.4 56.8 59.2 L43.2 59.2 C42.4 58.4 41.7 57.4 41.3 56 Z" fill={WHITE} />
          <path d="M45 62 C47.5 60.6 52.5 60.6 55 62" fill="#d8606a" />
        </g>
      );
    case 'smile':
      return <path d="M45.4 57.2 Q50 60.4 54.6 57.2" fill="none" stroke={lip} strokeWidth="1.1" strokeLinecap="round" />;
    case 'smirk':
      return <path d="M46 58.4 Q50.5 59 54.6 56.6" fill="none" stroke={lip} strokeWidth="1.1" strokeLinecap="round" />;
    case 'open':
      return <path d="M46.5 57 Q50 62 53.5 57 Z" fill="#7a2a2e" stroke={INK} strokeWidth="0.8" />;
    // Labbra pronunciate (Usopp).
    case 'lips':
      return (
        <g>
          <path d="M44.6 58.6 C47 56.6 53 56.6 55.4 58.6 C53 61.6 47 61.6 44.6 58.6 Z" fill={shade(skin, -0.22)} stroke={INK} strokeWidth="0.9" />
          <path d="M44.8 58.6 Q50 59.6 55.2 58.6" fill="none" stroke={INK} strokeWidth="0.8" />
        </g>
      );
    case 'neutral':
    default:
      return <path d="M46.6 58.2 Q50 58.9 53.4 58.2" fill="none" stroke={lip} strokeWidth="1" strokeLinecap="round" />;
  }
}

/* ------------------------- Segni e accessori ------------------------- */

function SkinMarks({ m, p }: { m: Set<string>; p: ResolvedPortrait }) {
  return (
    <>
      {/* Cicatrice con due punti sotto l'occhio di destra (Rufy). */}
      {m.has('scar_cheek') && (
        <path d="M54.3 52.2 Q57 53.4 59.8 52.2 M55.8 51 L55.6 53.8 M58.2 51 L58.4 53.6" fill="none" stroke={SCAR} strokeWidth="0.8" strokeLinecap="round" />
      )}
      {/* Cicatrice verticale sull'occhio di destra (Zoro, dopo il salto temporale). */}
      {m.has('scar_eye') && (
        <path d="M56.6 38.5 L57.6 54" fill="none" stroke={SCAR} strokeWidth="1.2" strokeLinecap="round" />
      )}
      {/* Grande cicatrice a X sul petto (Rufy). */}
      {m.has('chest_x_scar') && (
        <g stroke={SCAR} strokeWidth="1.6" strokeLinecap="round">
          <path d="M43 80 L57 96 M57 80 L43 96" />
        </g>
      )}
      {/* Cicatrice diagonale dalla spalla al fianco (Zoro). */}
      {m.has('chest_scar') && <path d="M57 74 L45 96" stroke={SCAR} strokeWidth="1.6" strokeLinecap="round" />}
      {/* Tatuaggio sulla spalla di destra: girandola e mandarino (Nami). */}
      {m.has('shoulder_tattoo') && (
        <g stroke={p.hasAccent ? p.accent : '#2c5aa8'} strokeWidth="0.8" strokeLinejoin="round" fill="none">
          {/* Girandola a quattro pale… */}
          <path d="M74 84 L74 80.6 L76.2 82.4 Z M74 84 L77.4 84 L75.6 86.2 Z M74 84 L74 87.4 L71.8 85.6 Z M74 84 L70.6 84 L72.4 81.8 Z" fill={p.hasAccent ? p.accent : '#2c5aa8'} />
          {/* …e mandarino con foglia. */}
          <circle cx="80.6" cy="86.4" r="2.4" />
          <path d="M80.6 84 C81.4 82.6 83 82.4 83.6 83 C82.8 84 81.6 84.2 80.6 84 Z" />
        </g>
      )}
      {/* Pizzetto (Sanji). */}
      {m.has('goatee') && <path d="M48.4 63.4 Q50 66.4 51.6 63.4 Z" fill={p.hair} stroke={INK} strokeWidth="0.5" />}
    </>
  );
}

function OverMarks({ m }: { m: Set<string> }) {
  return (
    <>
      {/* Tre orecchini d'oro sull'orecchio di destra (Zoro). */}
      {m.has('earrings3') && (
        <g fill="none" stroke="#e8c14a" strokeWidth="0.9">
          <circle cx="67.4" cy="49" r="1.1" />
          <circle cx="67.6" cy="51.4" r="1.1" />
          <circle cx="67.4" cy="53.8" r="1.1" />
        </g>
      )}
      {m.has('earrings') && (
        <g fill="#e8c14a">
          <circle cx="33.4" cy="51.4" r="1.2" />
          <circle cx="66.6" cy="51.4" r="1.2" />
        </g>
      )}
      {/* Occhialoni da cecchino sollevati sulla fronte (Usopp). */}
      {m.has('goggles') && (
        <g>
          <path d="M31 30 C40 26 60 26 69 30" fill="none" stroke={INK} strokeWidth="2.4" />
          <path d="M31 30 C40 26 60 26 69 30" fill="none" stroke="#6b4a2e" strokeWidth="1.4" />
          <circle cx="42" cy="26.5" r="5.6" fill="#f2b23a" stroke={INK} strokeWidth="1.4" />
          <circle cx="58" cy="26.5" r="5.6" fill="#f2b23a" stroke={INK} strokeWidth="1.4" />
          <circle cx="40.4" cy="25" r="1.6" fill={WHITE} opacity="0.7" />
          <circle cx="56.4" cy="25" r="1.6" fill={WHITE} opacity="0.7" />
          <path d="M47.6 26.5 H52.4" stroke={INK} strokeWidth="1.6" />
        </g>
      )}
      {/* Sigaretta all'angolo della bocca, con filo di fumo (Sanji). */}
      {m.has('cigarette') && (
        <g>
          <path d="M53 58.6 L61.5 56.4" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M53 58.6 L61.5 56.4" stroke="#f4f0e6" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="61.8" cy="56.3" r="0.9" fill="#e85a2a" />
          <path d="M62.5 55 C61 52 64.5 50 63 47 C61.8 44.6 64 42.6 63.4 40.4" fill="none" stroke={WHITE} strokeWidth="0.9" opacity="0.7" strokeLinecap="round" />
        </g>
      )}
      {/* Cappello di paglia con nastro rosso (Rufy). */}
      {m.has('strawhat') && (
        <g>
          <ellipse cx="50" cy="31.5" rx="31" ry="7.2" fill={shade(STRAW, -0.2)} stroke={INK} strokeWidth="1.2" />
          <ellipse cx="50" cy="30.6" rx="30" ry="6.4" fill={STRAW} />
          <path d="M34.5 31 C34 13.5 66 13.5 65.5 31 Z" fill={STRAW} stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M34.7 25.5 C42 27 58 27 65.3 25.5 L65.5 30.4 C58 32 42 32 34.5 30.4 Z" fill="#cc2f36" stroke={INK} strokeWidth="1" />
          <g stroke={shade(STRAW, -0.28)} strokeWidth="0.6" fill="none" opacity="0.8">
            <path d="M40 22 C44 20.5 56 20.5 60 22 M38 17.5 C44 16 56 16 62 17.5" />
            <path d="M24 32 C32 36 68 36 76 32 M28 35 C36 38.4 64 38.4 72 35" />
          </g>
        </g>
      )}
    </>
  );
}

/** Ritratto dettagliato; usato da `PortraitArt` quando l'aspetto ha `face`. */
export function DetailedPortrait({ appearance: a }: { appearance: CharacterAppearance }) {
  const p = resolvePortrait(a);
  const f = a.face ?? {};
  const m = p.marks;
  const eyes = f.eyes ?? 'round';
  const eyeL = f.eyeL ?? eyes;
  const eyeR = f.eyeR ?? eyes;
  const skinShadow = shade(p.skin, -0.16);
  const face = FACES[f.shape ?? 'male'] ?? FACES.male;
  const hairDark = shade(p.hair, -0.32);
  const hairHi = shade(p.hair, 0.28);

  return (
    <g>
      {a.hairBack && <path d={a.hairBack} fill={p.hair} stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />}
      <Body a={a} p={p} />
      <path d="M43.5 58 L43.5 73 C46 76 54 76 56.5 73 L56.5 58 Z" fill={skinShadow} />
      <ellipse cx="33.8" cy="46.5" rx="2.8" ry="4.4" fill={p.skin} stroke={INK} strokeWidth="0.9" />
      <ellipse cx="66.2" cy="46.5" rx="2.8" ry="4.4" fill={p.skin} stroke={INK} strokeWidth="0.9" />
      <path d={face} fill={p.skin} stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
      {/* Ombra sul lato destro del volto: dà volume. */}
      <path d="M60 30 C66 36 66.5 50 61 60 C58 63.6 55.5 65 53 65.8 C59 58 62 46 60 30 Z" fill={skinShadow} opacity="0.35" />
      <SkinMarks m={m} p={p} />
      <Eye cx={43} style={eyeL} color={p.eyes} side="l" />
      <Eye cx={57} style={eyeR} color={p.eyes} side="r" />
      <Brows style={f.brows ?? 'normal'} color={hairDark} eyeL={eyeL} eyeR={eyeR} />
      <Mouth style={f.mouth ?? 'neutral'} skin={p.skin} />
      <Nose style={f.nose ?? 'small'} skin={p.skin} />
      {a.hairFront && (
        <g>
          <path d={a.hairFront} fill={p.hair} stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
          {a.hairDetail && (
            <path d={a.hairDetail} fill="none" stroke={hairDark} strokeWidth="0.8" strokeLinecap="round" opacity="0.85" />
          )}
          {/* Riflesso: una passata più chiara sulla calotta. */}
          <path d="M40 27 C44 24.5 50 24 54 25" fill="none" stroke={hairHi} strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
        </g>
      )}
      <OverMarks m={m} />
    </g>
  );
}

