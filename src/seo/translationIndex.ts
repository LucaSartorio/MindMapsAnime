import type { WorldDataset } from '@/types';
import type { SupportedLocale } from '@/types/i18n';
import { TRANSLATION_GAPS } from '@/data/translationIndex';
import { SEO_CATEGORIES, categoryEntities, type SeoCategory } from './categories';

/**
 * Disponibilità delle traduzioni (lingue NON sorgente: es, fr) per pagina
 * entità, CONDIVISA fra prerender e client.
 *
 * Perché esiste: una pagina `/es` di un'entità è indicizzabile (e quindi
 * dichiarata negli hreflang di TUTTE le versioni linguistiche) solo se ogni
 * suo testo è tradotto (`isFullyTranslated`). Quel controllo richiede
 * l'overlay della lingua applicato al dataset: il prerender li applica tutti,
 * il browser solo quello della lingua dell'URL. Calcolato sul dataset del
 * browser, `/it` e `/en` perdevano gli hreflang es/fr dopo l'idratazione
 * (SEO-01). L'indice è derivato dagli stessi dati con TUTTI gli overlay
 * applicati (`npm run i18n:index`) ed è letto allo stesso modo ovunque: il
 * risultato non dipende più da quali overlay il client ha caricato.
 *
 * Formato compatto, solo per le lingue PUBBLICATE di ogni mondo
 * (`AnimeWorld.translatedLocales`, che per regola sono tradotte al 100%):
 * numero di entità con pagina al momento della generazione + lista di quelle
 * NON tradotte per intero (`categoria:id`). Sicuro per difetto: lingua assente
 * dall'indice, oppure numero di entità diverso dai dati (entità aggiunte o
 * rimosse senza rigenerarlo) → nessuna traduzione dichiarata. `test:seo`
 * fallisce comunque se l'indice non corrisponde ai dati.
 */

export interface TranslationGapEntry {
  /** Entità con pagina SEO (tutte le categorie) quando l'indice è stato generato. */
  readonly entities: number;
  /** Entità con almeno un testo non tradotto, come `categoria:id`. */
  readonly gaps: readonly string[];
}

export type TranslationGapIndex = Readonly<Record<string, Readonly<Partial<Record<SupportedLocale, TranslationGapEntry>>>>>;

export const translationGapKey = (category: SeoCategory, id: string) => `${category}:${id}`;

const entityCounts = new WeakMap<WorldDataset, number>();

/** Numero di entità con pagina SEO del dataset (stesso insieme in prerender e client). */
export function seoEntityCount(dataset: WorldDataset): number {
  let n = entityCounts.get(dataset);
  if (n === undefined) {
    n = SEO_CATEGORIES.reduce((sum, c) => sum + categoryEntities(dataset, c).length, 0);
    entityCounts.set(dataset, n);
  }
  return n;
}

const gapSets = new Map<string, Set<string>>();

/** L'entità ha OGNI testo tradotto in `locale` (lingua non sorgente)? */
export function isEntityFullyTranslated(
  dataset: WorldDataset,
  category: SeoCategory,
  id: string,
  locale: SupportedLocale,
): boolean {
  const slug = dataset.world.slug;
  const entry = TRANSLATION_GAPS[slug]?.[locale];
  if (!entry || entry.entities !== seoEntityCount(dataset)) return false;
  const key = `${slug}:${locale}`;
  let gaps = gapSets.get(key);
  if (!gaps) {
    gaps = new Set(entry.gaps);
    gapSets.set(key, gaps);
  }
  return !gaps.has(translationGapKey(category, id));
}
