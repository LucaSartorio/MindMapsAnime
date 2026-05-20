import {
  DEFAULT_LOCALE,
  isLocalizedText,
  type Localizable,
  type LocalizedText,
  type SupportedLocale,
} from '@/types/i18n';

/**
 * Risolve un campo `Localizable` nella stringa appropriata.
 *
 * - Se `value` è una stringa pura → la restituisce così com'è (legacy/data
 *   non ancora localizzata).
 * - Se è un oggetto `LocalizedText` → restituisce la versione nella `locale`
 *   richiesta; se assente, fallback alla `fallbackLocale` (default IT);
 *   se nessuna disponibile, prende la prima chiave valida.
 * - Se il valore è `undefined`/`null` → ritorna stringa vuota.
 */
export function getLocalizedText(
  value: Localizable | undefined | null,
  locale: SupportedLocale,
  fallbackLocale: SupportedLocale = DEFAULT_LOCALE,
): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (isLocalizedText(value)) {
    const v = (value as Partial<LocalizedText>)[locale];
    if (v && v.trim() !== '') return v;
    const fb = (value as Partial<LocalizedText>)[fallbackLocale];
    if (fb && fb.trim() !== '') return fb;
    // Ultima chance: qualsiasi valore non vuoto.
    for (const k of Object.keys(value) as SupportedLocale[]) {
      const candidate = (value as Partial<LocalizedText>)[k];
      if (candidate && candidate.trim() !== '') return candidate;
    }
  }
  return '';
}

/** Risolve un nome localizzato preferendo `localizedName` quando presente. */
export function getEntityDisplayName(
  entity:
    | {
        name?: Localizable;
        localizedName?: Localizable;
        title?: Localizable;
      }
    | undefined
    | null,
  locale: SupportedLocale,
): string {
  if (!entity) return '';
  const fromLocalized = getLocalizedText(entity.localizedName, locale);
  if (fromLocalized) return fromLocalized;
  const fromName = getLocalizedText(entity.name, locale);
  if (fromName) return fromName;
  return getLocalizedText(entity.title, locale);
}

/** Risolve in batch un array di stringhe localizzabili. */
export function getLocalizedArray(
  values: Localizable[] | undefined,
  locale: SupportedLocale,
): string[] {
  if (!values) return [];
  return values.map((v) => getLocalizedText(v, locale));
}

/* -------------- Helper specifici per enum di dominio -------------- */

import type {
  CanonStatus,
  CharacterImportance,
  CharacterStatus,
  LocationType,
  ReferenceStatus,
  WorldStatus,
} from '@/types';

export function getCanonStatusLabel(
  status: CanonStatus,
  locale: SupportedLocale,
): string {
  const map: Record<CanonStatus, LocalizedText> = {
    canon: { it: 'Canon', en: 'Canon' },
    anime_only: { it: 'Solo anime', en: 'Anime only' },
    movie: { it: 'Film', en: 'Movie' },
    filler: { it: 'Filler', en: 'Filler' },
    novel: { it: 'Novel', en: 'Novel' },
    uncertain: { it: 'Incerto', en: 'Uncertain' },
  };
  return getLocalizedText(map[status], locale);
}

export function getReferenceStatusLabel(
  status: ReferenceStatus,
  locale: SupportedLocale,
): string {
  const map: Record<ReferenceStatus, LocalizedText> = {
    verified: { it: 'Verificato', en: 'Verified' },
    needs_verification: { it: 'Da verificare', en: 'Needs verification' },
    unknown: { it: 'Sconosciuto', en: 'Unknown' },
  };
  return getLocalizedText(map[status], locale);
}

export function getWorldStatusLabel(
  status: WorldStatus,
  locale: SupportedLocale,
): string {
  const map: Record<WorldStatus, LocalizedText> = {
    available: { it: 'Disponibile', en: 'Available' },
    coming_soon: { it: 'In arrivo', en: 'Coming soon' },
    hidden: { it: 'Nascosto', en: 'Hidden' },
  };
  return getLocalizedText(map[status], locale);
}

export function getCharacterStatusLabel(
  status: CharacterStatus,
  locale: SupportedLocale,
): string {
  const map: Record<CharacterStatus, LocalizedText> = {
    alive: { it: 'Vivo', en: 'Alive' },
    deceased: { it: 'Deceduto', en: 'Deceased' },
    unknown: { it: 'Sconosciuto', en: 'Unknown' },
    varies_by_era: { it: "Varia per era", en: 'Varies by era' },
  };
  return getLocalizedText(map[status], locale);
}

export function getCharacterImportanceLabel(
  importance: CharacterImportance,
  locale: SupportedLocale,
): string {
  const map: Record<CharacterImportance, LocalizedText> = {
    main: { it: 'Principale', en: 'Main' },
    major: { it: 'Maggiore', en: 'Major' },
    supporting: { it: 'Secondario', en: 'Supporting' },
    minor: { it: 'Minore', en: 'Minor' },
    background: { it: 'Sfondo', en: 'Background' },
  };
  return getLocalizedText(map[importance], locale);
}

export function getLocationTypeLabel(
  type: LocationType,
  locale: SupportedLocale,
): string {
  const map: Record<LocationType, LocalizedText> = {
    village: { it: 'Villaggio', en: 'Village' },
    city: { it: 'Città', en: 'City' },
    nation: { it: 'Nazione', en: 'Nation' },
    landmark: { it: 'Punto di interesse', en: 'Landmark' },
    battlefield: { it: 'Campo di battaglia', en: 'Battlefield' },
    hideout: { it: 'Nascondiglio', en: 'Hideout' },
    sacred_place: { it: 'Luogo sacro', en: 'Sacred place' },
    training_area: { it: 'Area di addestramento', en: 'Training area' },
    region: { it: 'Regione', en: 'Region' },
    ruins: { it: 'Rovine', en: 'Ruins' },
    bridge: { it: 'Ponte', en: 'Bridge' },
    forest: { it: 'Foresta', en: 'Forest' },
    mountain: { it: 'Montagna', en: 'Mountain' },
    cave: { it: 'Caverna', en: 'Cave' },
  };
  return getLocalizedText(map[type], locale);
}
