import type {
  AnimeWorld,
  ChakraNature,
  JutsuType,
  LabeledOption,
  Localizable,
  NinjaRank,
  SupportedLocale,
} from '@/types';
import {
  getChakraNatureLabel,
  getJutsuTypeLabel,
  getLocalizedText,
  getNinjaRankLabel,
} from '@/utils/localization';

/**
 * Helper per leggere la configurazione dinamica di un mondo (`world.config`).
 *
 * Obiettivo: tutte le "voci" che cambiano da un anime all'altro — il nome del
 * sistema di poteri (Jutsu / Nen / Tecniche / Frutti del Diavolo), le categorie,
 * l'attributo secondario (natura del chakra, …) e i gradi dei personaggi —
 * vengono risolte qui, con fallback alle mappe globali legacy (Naruto/HxH).
 *
 * I componenti non devono mai hardcodare termini specifici di un'opera: passano
 * `world` (`dataset.world`) e ottengono etichette già localizzate.
 */

/** Termine di default quando un mondo non dichiara un `ability.term`. */
const DEFAULT_ABILITY_TERM: Localizable = { it: 'Tecniche', en: 'Techniques' };

function labelFromOptions(
  options: LabeledOption[] | undefined,
  id: string,
  locale: SupportedLocale,
): string | undefined {
  if (!options) return undefined;
  const match = options.find((o) => o.id === id);
  return match ? getLocalizedText(match.label, locale) : undefined;
}

/** Termine UI del sistema di poteri (es. "Jutsu", "Nen", "Frutti del Diavolo"). */
export function getAbilityTerm(
  world: AnimeWorld | undefined,
  locale: SupportedLocale,
): string {
  return getLocalizedText(world?.config?.ability?.term ?? DEFAULT_ABILITY_TERM, locale);
}

/** Etichetta del facet "categoria" nell'archivio tecniche (default: "Tipo"). */
export function getAbilityCategoryTerm(
  world: AnimeWorld | undefined,
  locale: SupportedLocale,
  fallback: string,
): string {
  const term = world?.config?.ability?.categoryTerm;
  return term ? getLocalizedText(term, locale) : fallback;
}

/** Etichetta di una categoria-tecnica, dal config del mondo o dalla mappa globale. */
export function getAbilityCategoryLabel(
  world: AnimeWorld | undefined,
  category: string,
  locale: SupportedLocale,
): string {
  const fromConfig = labelFromOptions(
    world?.config?.ability?.categories,
    category,
    locale,
  );
  if (fromConfig) return fromConfig;
  // Fallback: mappa globale (copre gli id noti di Naruto e Hunter x Hunter).
  return getJutsuTypeLabel(category as JutsuType, locale);
}

/** Attributo secondario risolto (natura del chakra, …), o `null` se il mondo non lo usa. */
export interface ResolvedAbilityAttribute {
  /** Etichetta del facet/sezione. */
  term: string;
  /** Etichetta localizzata di un singolo valore. */
  label: (valueId: string) => string;
}

export function getAbilityAttribute(
  world: AnimeWorld | undefined,
  locale: SupportedLocale,
): ResolvedAbilityAttribute | null {
  const attribute = world?.config?.ability?.attribute;
  if (!attribute) return null;
  return {
    term: getLocalizedText(attribute.term, locale),
    label: (valueId) =>
      labelFromOptions(attribute.options, valueId, locale) ??
      // Fallback legacy: nature del chakra di Naruto.
      getChakraNatureLabel(valueId as ChakraNature, locale),
  };
}

/** Vero se il mondo usa i sigilli delle mani (Naruto). */
export function worldShowsHandSeals(world: AnimeWorld | undefined): boolean {
  return world?.config?.ability?.showHandSeals ?? false;
}

/** Vero se il mondo usa il rango ufficiale E…S sulle tecniche (Naruto). */
export function worldShowsAbilityRank(world: AnimeWorld | undefined): boolean {
  return world?.config?.ability?.showRank ?? false;
}

/** Sistema di gradi dei personaggi risolto, o `null` se il mondo non lo usa. */
export interface ResolvedRankSystem {
  /** Etichetta del facet (es. "Grado ninja"). */
  term: string;
  /** Etichetta localizzata di un singolo grado. */
  label: (id: string) => string;
}

export function getCharacterRankSystem(
  world: AnimeWorld | undefined,
  locale: SupportedLocale,
): ResolvedRankSystem | null {
  const rank = world?.config?.characterRank;
  if (!rank) return null;
  return {
    term: getLocalizedText(rank.term, locale),
    label: (id) =>
      labelFromOptions(rank.options, id, locale) ??
      // Fallback legacy: gradi ninja di Naruto.
      getNinjaRankLabel(id as NinjaRank, locale),
  };
}

/** Etichetta del facet "nazione", con fallback all'etichetta i18n generica. */
export function getNationTerm(
  world: AnimeWorld | undefined,
  locale: SupportedLocale,
  fallback: string,
): string {
  const term = world?.config?.nationTerm;
  return term ? getLocalizedText(term, locale) : fallback;
}
