import { useId } from 'react';
import type { ChakraNature, LocationType } from '@/types';
import { cn } from '@/lib/cn';
import {
  CHAKRA_COLORS,
  CLAN_COLORS,
  VILLAGE_COLORS,
  getInitials,
  hashHue,
  resolveDropInImage,
  shade,
  type EntityImageKind,
} from '@/utils/entityImage';

interface EntityImageProps {
  kind: EntityImageKind;
  id: string;
  name: string;
  className?: string;
  /** Natura del chakra principale (jutsu). */
  chakraNature?: ChakraNature;
  /** Id della location del villaggio (personaggi/clan). */
  villageId?: string;
  /** Tipo di luogo (location). */
  locationType?: LocationType;
}

function hslBase(id: string): string {
  return `hsl(${hashHue(id)} 42% 46%)`;
}

/**
 * Immagine per una scheda entità. Se esiste un file drop-in
 * (`src/assets/worlds/naruto/<folder>/<id>.<ext>`) lo mostra, altrimenti
 * genera un placeholder SVG tematico e coerente con l'entità.
 */
export function EntityImage({
  kind,
  id,
  name,
  className,
  chakraNature,
  villageId,
  locationType,
}: EntityImageProps) {
  const uid = useId().replace(/:/g, '');
  const dropIn = resolveDropInImage(kind, id);

  if (dropIn) {
    return (
      <img
        src={dropIn}
        alt={name}
        loading="lazy"
        className={cn('w-full h-full object-cover', className)}
      />
    );
  }

  const initials = getInitials(name);

  let base: string;
  if (kind === 'jutsu') {
    base = chakraNature ? CHAKRA_COLORS[chakraNature] : hslBase(id);
  } else if (kind === 'character') {
    base = (villageId && VILLAGE_COLORS[villageId]) || hslBase(id);
  } else if (kind === 'clan') {
    base = CLAN_COLORS[id] || hslBase(id);
  } else if (kind === 'location') {
    base = (villageId && VILLAGE_COLORS[villageId]) || hslBase(id);
  } else {
    base = hslBase(id);
  }

  const light = shade(base, 0.28);
  const dark = shade(base, -0.55);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className={cn('w-full h-full', className)}
      role="img"
      aria-label={name}
    >
      <defs>
        <linearGradient id={`g-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <radialGradient id={`r-${uid}`} cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor={shade(base, 0.45)} />
          <stop offset="60%" stopColor={base} />
          <stop offset="100%" stopColor={dark} />
        </radialGradient>
      </defs>

      {kind === 'jutsu' && <JutsuArt uid={uid} initials={initials} />}
      {kind === 'character' && (
        <CharacterArt uid={uid} initials={initials} accent={light} />
      )}
      {kind === 'clan' && (
        <ClanArt uid={uid} initials={initials} accent={light} dark={dark} />
      )}
      {kind === 'location' && (
        <LocationArt uid={uid} type={locationType} accent={light} dark={dark} />
      )}
      {kind === 'arc' && (
        <ArcArt uid={uid} initials={initials} accent={light} />
      )}
    </svg>
  );
}

/* ------------------------------ Sub-art ------------------------------ */

function JutsuArt({ uid, initials }: { uid: string; initials: string }) {
  return (
    <>
      <rect width="100" height="100" fill={`url(#r-${uid})`} />
      {/* chakra swirl */}
      <g
        fill="none"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="2.4"
        strokeLinecap="round"
      >
        <path d="M50 50 m0 -22 a22 22 0 1 1 -15.5 6.4" opacity="0.9" />
        <path d="M50 50 m0 -12 a12 12 0 1 0 8.5 3.5" opacity="0.75" />
      </g>
      <circle cx="50" cy="50" r="4.5" fill="rgba(255,255,255,0.92)" />
      <text
        x="50"
        y="86"
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontSize="13"
        fontWeight="700"
        fill="rgba(255,255,255,0.92)"
      >
        {initials}
      </text>
    </>
  );
}

function CharacterArt({
  uid,
  initials,
  accent,
}: {
  uid: string;
  initials: string;
  accent: string;
}) {
  return (
    <>
      <rect width="100" height="100" fill={`url(#g-${uid})`} />
      {/* spalle */}
      <path
        d="M16 100 C16 78 32 70 50 70 C68 70 84 78 84 100 Z"
        fill="rgba(0,0,0,0.28)"
      />
      {/* testa */}
      <circle cx="50" cy="44" r="21" fill="rgba(255,255,255,0.16)" />
      {/* fascia / protettore frontale */}
      <rect x="29" y="33" width="42" height="8" rx="2" fill="rgba(0,0,0,0.5)" />
      <rect
        x="44"
        y="33.5"
        width="12"
        height="7"
        rx="1"
        fill={accent}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.6"
      />
      <text
        x="50"
        y="52"
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontSize="15"
        fontWeight="700"
        fill="rgba(255,255,255,0.95)"
      >
        {initials}
      </text>
    </>
  );
}

function ClanArt({
  uid,
  initials,
  accent,
  dark,
}: {
  uid: string;
  initials: string;
  accent: string;
  dark: string;
}) {
  return (
    <>
      <rect width="100" height="100" fill={`url(#g-${uid})`} />
      {/* stemma a scudo */}
      <path
        d="M50 18 L78 28 L78 52 C78 72 64 82 50 88 C36 82 22 72 22 52 L22 28 Z"
        fill={dark}
        stroke={accent}
        strokeWidth="2.4"
      />
      <path
        d="M50 26 L71 33.5 L71 52 C71 67 60 75.5 50 80.5 C40 75.5 29 67 29 52 L29 33.5 Z"
        fill="rgba(255,255,255,0.08)"
      />
      <text
        x="50"
        y="61"
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontSize="26"
        fontWeight="700"
        fill="rgba(255,255,255,0.95)"
      >
        {initials}
      </text>
    </>
  );
}

function LocationArt({
  uid,
  type,
  accent,
  dark,
}: {
  uid: string;
  type?: LocationType;
  accent: string;
  dark: string;
}) {
  return (
    <>
      <rect width="100" height="100" fill={`url(#g-${uid})`} />
      {/* sole/luna */}
      <circle cx="74" cy="26" r="9" fill="rgba(255,255,255,0.28)" />
      <LocationSilhouette type={type} accent={accent} dark={dark} />
    </>
  );
}

function LocationSilhouette({
  type,
  accent,
  dark,
}: {
  type?: LocationType;
  accent: string;
  dark: string;
}) {
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
          <path
            d="M30 100 C30 74 70 74 70 100 Z"
            fill="rgba(0,0,0,0.55)"
          />
        </g>
      );
    case 'bridge':
      return (
        <g fill={fill}>
          <rect x="0" y="62" width="100" height="6" />
          <path
            d="M0 62 C30 40 70 40 100 62"
            fill="none"
            stroke={stroke}
            strokeWidth="2.5"
          />
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
    case 'village':
    case 'city':
    default:
      return (
        <g fill={fill}>
          <rect x="0" y="80" width="100" height="20" />
          {/* tetti */}
          <path d="M8 80 L20 66 L32 80 Z" />
          <path d="M30 80 L46 60 L62 80 Z" />
          <path d="M60 80 L74 66 L88 80 Z" />
          {/* portale */}
          <rect x="42" y="70" width="16" height="10" fill={stroke} opacity="0.8" />
        </g>
      );
  }
}

function ArcArt({
  uid,
  initials,
  accent,
}: {
  uid: string;
  initials: string;
  accent: string;
}) {
  return (
    <>
      <rect width="100" height="100" fill={`url(#g-${uid})`} />
      <path d="M0 100 L100 64 L100 100 Z" fill="rgba(0,0,0,0.25)" />
      <path d="M0 100 L0 80 L100 44 L100 64 Z" fill={accent} opacity="0.35" />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontSize="30"
        fontWeight="700"
        fill="rgba(255,255,255,0.92)"
      >
        {initials}
      </text>
    </>
  );
}
