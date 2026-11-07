import type { WorldDataset } from '@/types';
import type { SupportedLocale } from '@/types/i18n';
import { isFullyTranslated } from '@/data/shared/translations';
import { SEO_CATEGORIES, categoryEntities } from './categories';
import { translationGapKey, type TranslationGapIndex } from './translationIndex';

/**
 * Calcolo dell'indice di `translationIndex.ts` (solo script e test: il client
 * legge l'indice già generato e non importa questo modulo).
 *
 * `dataset` deve avere applicati TUTTI gli overlay di `locales`
 * (`loadWorldDatasetWithTranslations`): l'indice dice, per ogni lingua, quali
 * entità con pagina SEO NON hanno ogni testo tradotto.
 */
export function computeTranslationGaps(
  dataset: WorldDataset,
  locales: readonly SupportedLocale[],
): Partial<Record<SupportedLocale, string[]>> {
  const out: Partial<Record<SupportedLocale, string[]>> = {};
  for (const locale of [...locales].sort()) {
    const gaps: string[] = [];
    for (const category of SEO_CATEGORIES) {
      for (const e of categoryEntities(dataset, category)) {
        if (!isFullyTranslated(e, locale)) gaps.push(translationGapKey(category, e.id));
      }
    }
    out[locale] = gaps.sort();
  }
  return out;
}

/** Sorgente TypeScript deterministica di `src/data/translationIndex.ts`. */
export function renderTranslationIndex(index: TranslationGapIndex): string {
  const sorted = Object.fromEntries(Object.entries(index).sort(([a], [b]) => a.localeCompare(b)));
  return [
    '/**',
    ' * Entità NON tradotte per intero nelle lingue non sorgente, per mondo — generato da',
    ' * `npm run i18n:index`. NON modificare a mano: rieseguire lo script dopo ogni',
    ' * `i18n:merge` o modifica dei testi. Vedi src/seo/translationIndex.ts.',
    ' */',
    "import type { TranslationGapIndex } from '@/seo/translationIndex';",
    '',
    `export const TRANSLATION_GAPS: TranslationGapIndex = ${JSON.stringify(sorted, null, 2)};`,
    '',
  ].join('\n');
}
