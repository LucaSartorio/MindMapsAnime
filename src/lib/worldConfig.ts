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
  getCharacterRoleLabel,
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

/**
 * Ordine di default dei gradi (Naruto). Usato quando il mondo non fornisce
 * `characterRank.options` proprie.
 */
const DEFAULT_RANK_ORDER: string[] = [
  'academy_student',
  'genin',
  'chunin',
  'tokubetsu_jonin',
  'jonin',
  'anbu',
  'sannin',
  'kage',
  'missing_nin',
  'other',
];

function labelFromOptions(
  options: LabeledOption[] | undefined,
  id: string,
  locale: SupportedLocale,
): string | undefined {
  if (!options) return undefined;
  const match = options.find((o) => o.id === id);
  return match ? getLocalizedText(match.label, locale) : undefined;
}

/**
 * Fallback finale per un id senza etichetta: "missing_nin" → "Missing nin",
 * "devil-fruit" → "Devil fruit". Garantisce che QUALSIASI mondo nuovo mostri
 * etichette leggibili anche senza config.
 */
export function humanizeId(id: string): string {
  const spaced = id.replace(/[-_]+/g, ' ').trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
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
  // Fallback: mappa globale (copre gli id noti di Naruto e Hunter x Hunter),
  // poi humanize per qualsiasi id sconosciuto di un mondo futuro.
  return getJutsuTypeLabel(category as JutsuType, locale) || humanizeId(category);
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
      // Fallback legacy (nature del chakra di Naruto), poi humanize.
      (getChakraNatureLabel(valueId as ChakraNature, locale) || humanizeId(valueId)),
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
      // Fallback legacy (gradi ninja di Naruto), poi humanize.
      (getNinjaRankLabel(id as NinjaRank, locale) || humanizeId(id)),
  };
}

/**
 * Ordine dei gradi del mondo: gli id delle `characterRank.options` se presenti
 * (definiscono anche l'ordine), altrimenti l'ordine noto di Naruto.
 */
export function getCharacterRankOrder(world: AnimeWorld | undefined): string[] {
  const options = world?.config?.characterRank?.options;
  if (options && options.length > 0) return options.map((o) => o.id);
  return DEFAULT_RANK_ORDER;
}

/**
 * Etichetta di un ruolo personaggio: config del mondo → ruoli universali
 * localizzati → humanize. Adattabile a ogni opera.
 */
export function getRoleLabel(
  world: AnimeWorld | undefined,
  role: string,
  locale: SupportedLocale,
): string {
  return (
    labelFromOptions(world?.config?.characterRoles, role, locale) ??
    (getCharacterRoleLabel(role, locale) || humanizeId(role))
  );
}

/** Lista curata "in evidenza" per una pagina archivio (vuota se non configurata). */
export function getFeaturedIds(
  world: AnimeWorld | undefined,
  kind: 'abilities' | 'factions',
): string[] {
  return world?.config?.featured?.[kind] ?? [];
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
