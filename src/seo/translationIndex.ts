import type { SupportedLocale } from '@/types/i18n';
import { TRANSLATION_GAPS } from '@/data/translationIndex';
import type { SeoCategory } from './categories';

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
 * Formato compatto: per ogni mondo e lingua con un overlay registrato, la
 * lista delle entità NON tradotte per intero (`categoria:id`). Lingua assente
 * dall'indice = nessuna traduzione (mai dichiarare una lingua non verificata).
 * `test:seo` fallisce se l'indice non corrisponde ai dati (entità o testi
 * aggiunti senza rigenerarlo), quindi un indice obsoleto non arriva in build.
 */

export type TranslationGapIndex = Readonly<Record<string, Readonly<Partial<Record<SupportedLocale, readonly string[]>>>>>;

export const translationGapKey = (category: SeoCategory, id: string) => `${category}:${id}`;

const gapSets = new Map<string, Set<string>>();

function gapsFor(worldSlug: string, locale: SupportedLocale): Set<string> | undefined {
  const list = TRANSLATION_GAPS[worldSlug]?.[locale];
  if (!list) return undefined;
  const key = `${worldSlug}:${locale}`;
  let set = gapSets.get(key);
  if (!set) {
    set = new Set(list);
    gapSets.set(key, set);
  }
  return set;
}

/** L'entità ha OGNI testo tradotto in `locale` (lingua non sorgente)? */
export function isEntityFullyTranslated(
  worldSlug: string,
  category: SeoCategory,
  id: string,
  locale: SupportedLocale,
): boolean {
  const gaps = gapsFor(worldSlug, locale);
  return !!gaps && !gaps.has(translationGapKey(category, id));
}
