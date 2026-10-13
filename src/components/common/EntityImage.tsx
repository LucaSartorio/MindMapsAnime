import { useId } from 'react';
import type { CharacterAppearance, Jutsu, LocationType } from '@/types';
import { cn } from '@/lib/cn';
import { useWorldStore } from '@/store/useWorldStore';
import {
  getWorldEntityColor,
  getWorldPlaceholderStyle,
} from '@/lib/worldPlaceholders';
import { ELEMENT_COLORS, resolveAbilityArt } from '@/lib/abilityArt';
import { AbilityArtSvg } from '@/components/common/abilityFormArt';
import { PortraitArt } from '@/components/common/portraitArt';
import { FruitArt } from '@/components/common/fruitArt';
import {
  ArcArt,
  CharacterMotifArt,
  EmblemMotifArt,
  LocationSilhouette,
} from '@/components/common/entityArt';
import {
  getInitials,
  resolveDropInImage,
  shade,
  type EntityImageKind,
} from '@/utils/entityImage';

interface EntityImageProps {
  kind: EntityImageKind;
  id: string;
  name: string;
  className?: string;
  /** Attributo principale della tecnica (Naruto: natura del chakra). String libera. */
  chakraNature?: string;
  /**
   * Dati della tecnica (`kind="jutsu"`): categoria, natura e tag scelgono la
   * forma (frutto Zoan, pugno, occhio…) e l'elemento disegnati. Senza, resta il
   * motivo generico del mondo.
   */
  ability?: Pick<Jutsu, 'type' | 'chakraNature' | 'classification' | 'tags' | 'fruit'>;
  /**
   * Aspetto del personaggio (`kind="character"`): se presente il placeholder è
   * un ritratto composto (capelli, occhi, segni distintivi) invece del motivo
   * generico del mondo.
   */
  appearance?: CharacterAppearance;
  /** Id della location del villaggio (personaggi/clan). */
  villageId?: string;
  /** Tipo di luogo (location). */
  locationType?: LocationType;
  /**
   * Mondo di appartenenza. Di norma si risolve da solo dal mondo attivo: passalo
   * solo per mostrare entità di un mondo diverso da quello aperto.
   */
  worldSlug?: string;
  /**
   * Come adattare un'immagine reale al contenitore:
   * - `cover` (default): riempie e ritaglia.
   * - `contain`: mostra l'immagine intera ridimensionata, con sfondo
   *   sfocato a riempire lo spazio restante.
   */
  fit?: 'cover' | 'contain';
}

/**
 * Immagine per una scheda entità. Se esiste un file drop-in
 * (`src/assets/worlds/<slug>/<folder>/<id>.<ext>`) lo mostra, altrimenti genera
 * un placeholder SVG **a tema del mondo attivo**: i simboli arrivano dal registro
 * `src/lib/worldPlaceholders.ts` (fascia ninja per Naruto, cappello di paglia per
 * One Piece, capelli a punta per Dragon Ball, aura per HxH, grimorio per Black
 * Clover…) e i colori dal `theme` del mondo, così ogni opera resta riconoscibile.
 */
export function EntityImage({
  kind,
  id,
  name,
  className,
  chakraNature,
  ability,
  appearance,
  villageId,
  locationType,
  worldSlug,
  fit = 'cover',
}: EntityImageProps) {
  const uid = useId().replace(/:/g, '');
  const activeSlug = useWorldStore((s) => s.worldSlug);
  const slug = worldSlug ?? activeSlug;
  const dropIn = resolveDropInImage(kind, id);

  const initials = getInitials(name);
  const style = getWorldPlaceholderStyle(slug);
  const abilityArt =
    kind === 'jutsu'
      ? ability
        ? resolveAbilityArt(slug, ability)
        : { form: style.ability }
      : null;

  // La tinta arriva dalla palette del mondo attivo; se quel mondo dichiara
  // colori propri per l'attributo passato (Naruto: natura del chakra, villaggio,
  // clan) li applica il registro — così non tracimano sulle altre opere.
  const base = getWorldEntityColor(
    slug,
    kind,
    id,
    kind === 'jutsu' ? (chakraNature ?? ability?.chakraNature?.[0]) : villageId,
    // Un frutto illustrato ha già i suoi colori: lo sfondo resta quello del mondo.
    abilityArt?.element && !ability?.fruit ? ELEMENT_COLORS[abilityArt.element] : undefined,
  );

  const light = shade(base, 0.28);
  const dark = shade(base, -0.55);

  // Sfondo opaco tematico: i PNG con trasparenza non mostrano più il
  // "vuoto" (niente scacchiera/sfondo casuale) ma una tinta coerente
  // con l'entità.
  const themedBg = `linear-gradient(155deg, ${light} 0%, ${base} 45%, ${dark} 100%)`;

  if (dropIn) {
    if (fit === 'contain') {
      return (
        <div
          className={cn('relative overflow-hidden h-full w-full', className)}
          style={{ background: themedBg }}
        >
          <img
            src={dropIn}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover scale-110 blur-2xl opacity-45"
          />
          <img
            src={dropIn}
            alt={name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-contain"
          />
        </div>
      );
    }
    return (
      <img
        src={dropIn}
        alt={name}
        loading="lazy"
        style={{ background: themedBg }}
        className={cn('block w-full h-full object-cover', className)}
      />
    );
  }

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

      {abilityArt ? (
        <>
          <rect width="100" height="100" fill={`url(#r-${uid})`} />
          {ability?.fruit ? (
            <FruitArt look={ability.fruit} uid={uid} />
          ) : (
            <AbilityArtSvg
              art={abilityArt}
              initials={initials}
              dark={dark}
              ink={style.ink}
            />
          )}
        </>
      ) : (
        <rect width="100" height="100" fill={`url(#g-${uid})`} />
      )}

      {kind === 'character' && appearance && <PortraitArt appearance={appearance} ink={style.ink} uid={uid} />}
      {kind === 'character' && !appearance && (
        <CharacterMotifArt
          motif={style.character}
          initials={initials}
          accent={light}
          dark={dark}
          ink={style.ink}
        />
      )}
      {kind === 'clan' && (
        <EmblemMotifArt
          motif={style.emblem}
          initials={initials}
          dark={dark}
          ink={style.ink}
        />
      )}
      {kind === 'location' && (
        <>
          <circle cx="74" cy="26" r="9" fill="rgba(255,255,255,0.28)" />
          <LocationSilhouette type={locationType} accent={light} dark={dark} />
        </>
      )}
      {kind === 'arc' && <ArcArt initials={initials} accent={light} />}
    </svg>
  );
}
