import type { LocationType } from '@/types';
import type {
  AbilityMotif,
  CharacterMotif,
  EmblemMotif,
} from '@/lib/worldPlaceholders';

/**
 * Libreria di motivi SVG per i placeholder delle schede.
 *
 * Sono forme ORIGINALI e geometriche (nessuna immagine protetta): evocano i
 * codici visivi di ogni opera — la fascia ninja, il cappello di paglia, i
 * capelli a punta, l'aura, il grimorio… — senza riprodurre artwork ufficiale.
 * Quale motivo usare lo decide il registro `src/lib/worldPlaceholders.ts`, non
 * i componenti.
 */

interface ArtColors {
  /** Tinta chiara (accento) derivata dal colore dell'entità. */
  accent: string;
  /** Tinta scura (ombre/sagome). */
  dark: string;
  /** Colore "firma" dell'opera: la paglia, il ki, l'aura, l'oro del grimorio… */
  ink: string;
}

const WHITE = 'rgba(255,255,255,0.95)';
/**
 * Chioma a punte (Dragon Ball). Il bordo interno segue la fronte, quindi la
 * capigliatura "veste" la testa invece di fluttuarci sopra come una corona.
 */
const SAIYAN_HAIR =
  'M28 48 C28 34 32 26 37 21 L33 9 L42 19 L45 5 L51 17 L57 4 L61 18 L68 10 L65 23 ' +
  'C69 28 72 35 72 48 C72 38 64 34 50 34 C36 34 28 38 28 48 Z';
const SOFT = 'rgba(255,255,255,0.16)';
const SHADOW = 'rgba(0,0,0,0.28)';

/* ------------------------------ Personaggi ------------------------------ */

/** Busto condiviso: spalle + testa. I motivi ci aggiungono il segno distintivo. */
function Bust({ shoulders = SHADOW }: { shoulders?: string }) {
  return (
    <>
      <path d="M16 100 C16 78 32 70 50 70 C68 70 84 78 84 100 Z" fill={shoulders} />
      <circle cx="50" cy="44" r="21" fill={SOFT} />
    </>
  );
}

function Initials({
  children,
  y = 52,
  size = 15,
}: {
  children: string;
  y?: number;
  size?: number;
}) {
  return (
    <text
      x="50"
      y={y}
      textAnchor="middle"
      fontFamily="Cinzel, serif"
      fontSize={size}
      fontWeight="700"
      fill={WHITE}
    >
      {children}
    </text>
  );
}

export function CharacterMotifArt({
  motif,
  initials,
  accent,
  dark,
  ink,
}: ArtColors & { motif: CharacterMotif; initials: string }) {
  switch (motif) {
    // Naruto — protettore frontale con placca metallica.
    case 'headband':
      return (
        <>
          <Bust />
          <rect x="29" y="33" width="42" height="8" rx="2" fill="rgba(0,0,0,0.5)" />
          <rect
            x="44"
            y="33.5"
            width="12"
            height="7"
            rx="1"
            fill={ink}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="0.6"
          />
          <Initials>{initials}</Initials>
        </>
      );

    // One Piece — cappello di paglia (tesa larga + nastro).
    case 'strawhat':
      return (
        <>
          <Bust />
          <ellipse cx="50" cy="33" rx="31" ry="7.5" fill={dark} />
          <ellipse cx="50" cy="32" rx="31" ry="6.5" fill={ink} opacity="0.95" />
          <path d="M34 32 C35 17 65 17 66 32 Z" fill={ink} />
          <path d="M34 30.5 h32 v3.5 h-32 Z" fill="rgba(0,0,0,0.45)" />
          <Initials y={54}>{initials}</Initials>
        </>
      );

    // Dragon Ball — capigliatura a punte.
    case 'spiky':
      return (
        <>
          <Bust />
          {/* Capigliatura che avvolge la testa (non una corona sospesa): punte
              irregolari + alone che ricorda l'aura Super Saiyan. */}
          {/* Silhouette piena: senza rima metallica non sembra una corona. */}
          <path d={SAIYAN_HAIR} fill={dark} strokeLinejoin="round" opacity="0.96" />
          <Initials y={56}>{initials}</Initials>
        </>
      );

    // Hunter x Hunter — aura Nen attorno alla figura.
    case 'aura':
      return (
        <>
          <Bust />
          <g fill="none" stroke={ink} strokeLinecap="round">
            <circle cx="50" cy="44" r="26" strokeWidth="1.8" opacity="0.85" strokeDasharray="5 4" />
            <circle cx="50" cy="44" r="30.5" strokeWidth="1.1" opacity="0.4" strokeDasharray="3 6" />
          </g>
          <Initials>{initials}</Initials>
        </>
      );

    // Black Clover — grimorio aperto davanti al petto + quadrifoglio.
    case 'grimoire':
      return (
        <>
          <Bust />
          <g>
            <path d="M28 100 L28 76 L50 82 L72 76 L72 100 Z" fill={dark} />
            <path d="M50 82 L50 100" stroke={accent} strokeWidth="1.4" />
            <g fill={ink}>
              <circle cx="44" cy="87" r="2.6" />
              <circle cx="50" cy="83.4" r="2.6" />
              <circle cx="56" cy="87" r="2.6" />
              <circle cx="50" cy="90.6" r="2.6" />
            </g>
          </g>
          <Initials y={50}>{initials}</Initials>
        </>
      );

    // Attack on Titan — cappuccio del mantello.
    case 'hood':
      return (
        <>
          <Bust />
          <path
            d="M24 48 C24 24 76 24 76 48 C68 36 32 36 24 48 Z"
            fill={dark}
            stroke={ink}
            strokeWidth="1.2"
          />
          <path d="M30 72 L50 84 L70 72" fill="none" stroke={ink} strokeWidth="2" />
          <Initials y={56}>{initials}</Initials>
        </>
      );

    // Bleach — katana dietro la figura.
    case 'blade':
      return (
        <>
          <g stroke={ink} strokeWidth="2.6" strokeLinecap="round">
            <line x1="20" y1="76" x2="80" y2="20" />
          </g>
          <rect
            x="20"
            y="70"
            width="14"
            height="4"
            rx="1"
            transform="rotate(-43 27 72)"
            fill={dark}
          />
          <Bust />
          <Initials>{initials}</Initials>
        </>
      );

    // Fullmetal Alchemist — cerchio di trasmutazione dietro la figura.
    case 'transmutation':
      return (
        <>
          <g fill="none" stroke={ink} strokeWidth="1.4" opacity="0.9">
            <circle cx="50" cy="44" r="29" />
            <circle cx="50" cy="44" r="24" strokeWidth="0.9" />
            <path d="M50 20 L71 56 L29 56 Z" strokeWidth="1.1" />
          </g>
          <Bust />
          <Initials>{initials}</Initials>
        </>
      );

    // Frieren — orecchie a punta + bastone da mago.
    case 'elf':
      return (
        <>
          <Bust />
          <g fill={SOFT}>
            <path d="M31 42 L24 28 L36 36 Z" />
            <path d="M69 42 L76 28 L64 36 Z" />
          </g>
          <g stroke={ink} strokeWidth="2.2" strokeLinecap="round">
            <line x1="78" y1="96" x2="78" y2="42" />
          </g>
          <circle cx="78" cy="38" r="4" fill={ink} />
          <Initials>{initials}</Initials>
        </>
      );

    // Toriko — posate incrociate dietro la figura.
    case 'chef':
      return (
        <>
          <g stroke={ink} strokeWidth="2.4" strokeLinecap="round">
            <line x1="26" y1="80" x2="44" y2="26" />
            <line x1="74" y1="80" x2="56" y2="26" />
          </g>
          <g fill={ink}>
            <path d="M41 26 h6 v9 h-6 Z" />
            <path d="M53 26 l6 0 l-3 10 Z" />
          </g>
          <Bust />
          <Initials>{initials}</Initials>
        </>
      );

    // Fairy Tail — marchio della gilda sulla spalla.
    case 'guildmark':
      return (
        <>
          <Bust />
          <path
            d="M28 86 L34 74 L40 86 L34 94 Z"
            fill={ink}
            stroke={WHITE}
            strokeWidth="0.7"
          />
          <Initials>{initials}</Initials>
        </>
      );

    // Jujutsu Kaisen — benda sugli occhi.
    case 'blindfold':
      return (
        <>
          <Bust />
          <rect x="27" y="39" width="46" height="9" rx="1.5" fill="rgba(0,0,0,0.62)" />
          <path d="M27 41.5 h46 M27 45.5 h46" stroke={ink} strokeWidth="0.9" opacity="0.8" />
          <Initials y={62}>{initials}</Initials>
        </>
      );

    // Demon Slayer — haori a scacchi sulle spalle.
    case 'haori':
      return (
        <>
          <Bust />
          <g fill={ink} opacity="0.85">
            <rect x="20" y="80" width="9" height="9" />
            <rect x="38" y="80" width="9" height="9" />
            <rect x="56" y="80" width="9" height="9" />
            <rect x="29" y="89" width="9" height="9" />
            <rect x="47" y="89" width="9" height="9" />
            <rect x="65" y="89" width="9" height="9" />
          </g>
          <Initials>{initials}</Initials>
        </>
      );

    // Neutro (mondo senza motivo dedicato).
    case 'plain':
    default:
      return (
        <>
          <Bust />
          <Initials>{initials}</Initials>
        </>
      );
  }
}

/* ------------------------- Tecniche / abilità ------------------------- */

export function AbilityMotifArt({
  motif,
  initials,
  dark,
  ink,
}: Omit<ArtColors, 'accent'> & { motif: AbilityMotif; initials: string }) {
  const label = <Initials y={86} size={13}>{initials}</Initials>;
  switch (motif) {
    // Naruto — spirale di chakra.
    case 'chakra':
      return (
        <>
          <g fill="none" stroke={WHITE} strokeWidth="2.4" strokeLinecap="round">
            <path d="M50 50 m0 -22 a22 22 0 1 1 -15.5 6.4" opacity="0.9" />
            <path d="M50 50 m0 -12 a12 12 0 1 0 8.5 3.5" opacity="0.75" />
          </g>
          <circle cx="50" cy="50" r="26" fill="none" stroke={ink} strokeWidth="1" opacity="0.5" />
          <circle cx="50" cy="50" r="4.5" fill={WHITE} />
          {label}
        </>
      );

    // One Piece — Frutto del Diavolo (spirali sulla buccia + picciolo).
    case 'devilfruit':
      return (
        <>
          <circle cx="50" cy="52" r="21" fill={dark} stroke={ink} strokeWidth="1.6" />
          <g fill="none" stroke={ink} strokeWidth="1.8" strokeLinecap="round" opacity="0.95">
            <path d="M41 45 a5 5 0 1 1 -4.5 7" />
            <path d="M59 45 a5 5 0 1 0 4.5 7" />
            <path d="M50 60 a5 5 0 1 1 -4.5 7" />
          </g>
          <path d="M50 31 C52 24 57 21 61 21 C58 27 55 30 50 31 Z" fill={ink} />
          <rect x="49" y="27" width="2" height="6" rx="1" fill={dark} />
          {label}
        </>
      );

    // Dragon Ball — sfera di ki con raggi.
    case 'ki':
      return (
        <>
          <g stroke={ink} strokeWidth="2.4" strokeLinecap="round" opacity="0.95">
            <line x1="50" y1="18" x2="50" y2="28" />
            <line x1="50" y1="72" x2="50" y2="82" />
            <line x1="18" y1="50" x2="28" y2="50" />
            <line x1="72" y1="50" x2="82" y2="50" />
            <line x1="28" y1="28" x2="35" y2="35" />
            <line x1="65" y1="65" x2="72" y2="72" />
            <line x1="72" y1="28" x2="65" y2="35" />
            <line x1="35" y1="65" x2="28" y2="72" />
          </g>
          <circle cx="50" cy="50" r="16" fill={ink} opacity="0.5" />
          <circle cx="50" cy="50" r="10" fill={WHITE} />
          {label}
        </>
      );

    // Hunter x Hunter — esagramma del Nen.
    case 'nen':
      return (
        <>
          <g fill="none" stroke={ink} strokeWidth="1.8" strokeLinejoin="round">
            <path d="M50 28 L69 61 L31 61 Z" />
            <path d="M50 74 L31 41 L69 41 Z" />
            <circle cx="50" cy="51" r="24" strokeWidth="1" opacity="0.55" />
          </g>
          <circle cx="50" cy="51" r="5" fill={WHITE} />
          {label}
        </>
      );

    // Magia (Black Clover, FMA, Fairy Tail, Frieren) — cerchio runico.
    case 'magic_circle':
      return (
        <>
          <g fill="none" stroke={ink} strokeLinecap="round">
            <circle cx="50" cy="50" r="24" strokeWidth="1.6" />
            <circle cx="50" cy="50" r="17" strokeWidth="1" opacity="0.75" />
            <path d="M50 26 L71 62 L29 62 Z" strokeWidth="1.3" />
            <g strokeWidth="2" opacity="0.9">
              <line x1="50" y1="20" x2="50" y2="25" />
              <line x1="80" y1="50" x2="75" y2="50" />
              <line x1="50" y1="80" x2="50" y2="75" />
              <line x1="20" y1="50" x2="25" y2="50" />
            </g>
          </g>
          <circle cx="50" cy="50" r="4" fill={WHITE} />
          {label}
        </>
      );

    // Lame (Bleach, Demon Slayer, AoT) — fendenti incrociati.
    case 'slash':
      return (
        <>
          <g fill="none" stroke={WHITE} strokeLinecap="round" opacity="0.92">
            <path d="M24 30 C44 42 58 56 74 74" strokeWidth="4" />
            <path d="M76 30 C60 44 48 56 32 72" strokeWidth="2.4" opacity="0.7" />
          </g>
          <path d="M24 30 C44 42 58 56 74 74" fill="none" stroke={ink} strokeWidth="1.4" />
          {label}
        </>
      );

    // Jujutsu Kaisen — glifo di energia malefica.
    case 'curse':
      return (
        <>
          <path
            d="M50 24 L60 40 L78 44 L64 57 L68 76 L50 66 L32 76 L36 57 L22 44 L40 40 Z"
            fill={dark}
            stroke={ink}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="50" cy="50" r="5.5" fill={WHITE} />
          {label}
        </>
      );

    // Toriko — posate incrociate.
    case 'gourmet':
      return (
        <>
          <g stroke={ink} strokeWidth="3" strokeLinecap="round">
            <line x1="32" y1="76" x2="58" y2="26" />
            <line x1="68" y1="76" x2="42" y2="26" />
          </g>
          <g fill={WHITE}>
            <path d="M39 24 h6 v10 h-6 Z" />
            <path d="M55 24 l6 0 l-3 11 Z" />
          </g>
          {label}
        </>
      );

    // Neutro.
    case 'spark':
    default:
      return (
        <>
          <path
            d="M50 22 L57 43 L78 50 L57 57 L50 78 L43 57 L22 50 L43 43 Z"
            fill={ink}
            opacity="0.9"
          />
          <circle cx="50" cy="50" r="5" fill={WHITE} />
          {label}
        </>
      );
  }
}

/* --------------------------- Clan / fazioni --------------------------- */

export function EmblemMotifArt({
  motif,
  initials,
  dark,
  ink,
}: Omit<ArtColors, 'accent'> & { motif: EmblemMotif; initials: string }) {
  switch (motif) {
    // One Piece — Jolly Roger.
    case 'jolly':
      return (
        <>
          <g stroke={dark} strokeWidth="7" strokeLinecap="round" opacity="0.9">
            <line x1="26" y1="66" x2="74" y2="34" />
            <line x1="26" y1="34" x2="74" y2="66" />
          </g>
          <circle cx="50" cy="44" r="17" fill={WHITE} />
          <path d="M36 54 h28 v7 a6 6 0 0 1 -6 6 h-16 a6 6 0 0 1 -6 -6 Z" fill={WHITE} />
          <g fill={dark}>
            <circle cx="43.5" cy="43" r="4.2" />
            <circle cx="56.5" cy="43" r="4.2" />
            <rect x="47" y="49" width="6" height="4" rx="1" />
          </g>
          <Initials y={88} size={12}>{initials}</Initials>
        </>
      );

    // Dragon Ball — sfera con le stelle.
    case 'orb_stars':
      return (
        <>
          <circle cx="50" cy="48" r="26" fill={ink} />
          <circle cx="50" cy="48" r="26" fill="none" stroke={dark} strokeWidth="1.6" />
          <ellipse cx="41" cy="38" rx="7" ry="4.5" fill="rgba(255,255,255,0.45)" />
          <g fill={dark}>
            <Star cx={50} cy={38} r={5} />
            <Star cx={40} cy={54} r={5} />
            <Star cx={60} cy={54} r={5} />
          </g>
          <Initials y={90} size={12}>{initials}</Initials>
        </>
      );

    // Hunter x Hunter — placca da Hunter.
    case 'badge':
      return (
        <>
          <path
            d="M50 16 L80 33 L80 67 L50 84 L20 67 L20 33 Z"
            fill={dark}
            stroke={ink}
            strokeWidth="2.4"
          />
          <path d="M50 30 L64 50 L50 70 L36 50 Z" fill="rgba(255,255,255,0.12)" stroke={ink} strokeWidth="1.2" />
          <Initials y={57} size={20}>{initials}</Initials>
        </>
      );

    // Black Clover — stendardo della compagnia.
    case 'banner':
      return (
        <>
          <path d="M26 16 L74 16 L74 78 L50 66 L26 78 Z" fill={dark} stroke={ink} strokeWidth="2.2" />
          <g fill={ink} opacity="0.95">
            <circle cx="44" cy="34" r="3.4" />
            <circle cx="50" cy="29.2" r="3.4" />
            <circle cx="56" cy="34" r="3.4" />
            <circle cx="50" cy="38.8" r="3.4" />
          </g>
          <Initials y={58} size={18}>{initials}</Initials>
        </>
      );

    // Attack on Titan — ali.
    case 'wings':
      return (
        <>
          <g fill={ink}>
            <path d="M48 40 L16 30 L28 46 L14 44 L30 58 L48 56 Z" />
            <path d="M52 40 L84 30 L72 46 L86 44 L70 58 L52 56 Z" opacity="0.75" />
          </g>
          <Initials y={82} size={16}>{initials}</Initials>
        </>
      );

    // Fairy Tail — fiamma della gilda.
    case 'flame':
      return (
        <>
          <path
            d="M50 16 C60 32 72 38 66 54 C62 65 54 68 50 82 C46 68 38 65 34 54 C28 38 40 32 50 16 Z"
            fill={ink}
            stroke={dark}
            strokeWidth="1.6"
          />
          <Initials y={58} size={17}>{initials}</Initials>
        </>
      );

    // Stemma circolare con stella (Bleach, Frieren, JJK, Demon Slayer).
    case 'crest_star':
      return (
        <>
          <circle cx="50" cy="48" r="27" fill={dark} stroke={ink} strokeWidth="2.4" />
          <g fill={ink} opacity="0.55">
            <Star cx={50} cy={48} r={20} />
          </g>
          <Initials y={56} size={20}>{initials}</Initials>
        </>
      );

    // Scudo araldico (Naruto e default).
    case 'shield':
    default:
      return (
        <>
          <path
            d="M50 18 L78 28 L78 52 C78 72 64 82 50 88 C36 82 22 72 22 52 L22 28 Z"
            fill={dark}
            stroke={ink}
            strokeWidth="2.4"
          />
          <path
            d="M50 26 L71 33.5 L71 52 C71 67 60 75.5 50 80.5 C40 75.5 29 67 29 52 L29 33.5 Z"
            fill="rgba(255,255,255,0.08)"
          />
          <Initials y={61} size={26}>{initials}</Initials>
        </>
      );
  }
}

/** Stella a 5 punte centrata (usata dagli stemmi). */
function Star({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i += 1) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`);
  }
  return <polygon points={pts.join(' ')} />;
}

/* ------------------------------- Luoghi ------------------------------- */

/**
 * Sagoma del luogo: dipende dal TIPO (già world-agnostic), i colori dal mondo.
 */
export function LocationSilhouette({
  type,
  accent,
  dark,
}: Omit<ArtColors, 'ink'> & { type?: LocationType }) {
  const fill = dark;
  const stroke = accent;
  switch (type) {
    case 'forest':
    case 'training_area':
      return (
        <g fill={fill}>
          <path d="M0 100 L0 78 L14 56 L28 78 L28 100 Z" />
          <path d="M22 100 L22 70 L40 44 L58 70 L58 100 Z" />
          <path d="M52 100 L52 76 L70 52 L88 76 L88 100 Z" />
          <path d="M80 100 L80 72 L100 50 L100 100 Z" />
        </g>
      );
    case 'mountain':
      return (
        <g fill={fill}>
          <path d="M-2 100 L30 40 L52 100 Z" />
          <path d="M40 100 L72 32 L104 100 Z" />
          <path d="M64 50 L72 32 L80 50 Z" fill="rgba(255,255,255,0.7)" />
        </g>
      );
    case 'cave':
      return (
        <g fill={fill}>
          <rect x="0" y="64" width="100" height="36" />
          <path d="M30 100 C30 74 70 74 70 100 Z" fill="rgba(0,0,0,0.55)" />
        </g>
      );
    case 'bridge':
      return (
        <g fill={fill}>
          <rect x="0" y="62" width="100" height="6" />
          <path d="M0 62 C30 40 70 40 100 62" fill="none" stroke={stroke} strokeWidth="2.5" />
          <rect x="0" y="68" width="100" height="32" opacity="0.5" />
        </g>
      );
    case 'sacred_place':
      return (
        <g fill={fill}>
          <rect x="0" y="84" width="100" height="16" />
          <rect x="26" y="44" width="6" height="46" />
          <rect x="68" y="44" width="6" height="46" />
          <rect x="18" y="42" width="64" height="6" rx="1" />
          <rect x="22" y="52" width="56" height="4" />
        </g>
      );
    case 'battlefield':
      return (
        <g fill={fill}>
          <path d="M0 100 L0 82 L18 76 L40 84 L62 74 L82 82 L100 76 L100 100 Z" />
          <rect x="56" y="50" width="2.5" height="30" fill={stroke} />
          <path d="M58 50 L74 55 L58 60 Z" fill={stroke} />
        </g>
      );
    // Dragon Ball: pianeti e dimensioni/aldilà.
    case 'planet':
      return (
        <g>
          <circle cx="50" cy="62" r="30" fill={fill} />
          <ellipse
            cx="50"
            cy="62"
            rx="44"
            ry="11"
            fill="none"
            stroke={stroke}
            strokeWidth="2.6"
            opacity="0.9"
          />
          <g fill="rgba(255,255,255,0.16)">
            <circle cx="39" cy="54" r="6" />
            <circle cx="60" cy="68" r="8" />
          </g>
        </g>
      );
    case 'dimension':
      return (
        <g fill="none" stroke={stroke}>
          <rect x="0" y="70" width="100" height="30" fill={fill} stroke="none" />
          <g strokeWidth="2" opacity="0.85">
            <ellipse cx="50" cy="58" rx="26" ry="26" />
            <ellipse cx="50" cy="58" rx="17" ry="26" />
            <ellipse cx="50" cy="58" rx="8" ry="26" />
          </g>
        </g>
      );
    case 'ruins':
      return (
        <g fill={fill}>
          <rect x="0" y="84" width="100" height="16" />
          <rect x="14" y="52" width="9" height="34" />
          <rect x="34" y="44" width="9" height="42" />
          <rect x="58" y="58" width="9" height="28" />
          <rect x="78" y="48" width="9" height="38" />
          <rect x="10" y="46" width="38" height="6" rx="1" />
        </g>
      );
    case 'hideout':
      return (
        <g fill={fill}>
          <rect x="0" y="66" width="100" height="34" />
          <path d="M36 100 L36 80 C36 72 64 72 64 80 L64 100 Z" fill="rgba(0,0,0,0.6)" />
          <circle cx="50" cy="80" r="4" fill={stroke} opacity="0.8" />
        </g>
      );
    case 'village':
    case 'city':
    default:
      return (
        <g fill={fill}>
          <rect x="0" y="80" width="100" height="20" />
          <path d="M8 80 L20 66 L32 80 Z" />
          <path d="M30 80 L46 60 L62 80 Z" />
          <path d="M60 80 L74 66 L88 80 Z" />
          <rect x="42" y="70" width="16" height="10" fill={stroke} opacity="0.8" />
        </g>
      );
  }
}

/* -------------------------------- Archi -------------------------------- */

export function ArcArt({ initials, accent }: { initials: string; accent: string }) {
  return (
    <>
      <path d="M0 100 L100 64 L100 100 Z" fill="rgba(0,0,0,0.25)" />
      <path d="M0 100 L0 80 L100 44 L100 64 Z" fill={accent} opacity="0.35" />
      <Initials y={58} size={30}>{initials}</Initials>
    </>
  );
}
