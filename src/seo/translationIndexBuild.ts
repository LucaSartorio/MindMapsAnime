import type { AnimeWorld, WorldDataset } from '@/types';
import { worldTranslationLocales } from '@/data/registry';
import type { SupportedLocale } from '@/types/i18n';
import { isFullyTranslated } from '@/data/shared/translations';
import { SEO_CATEGORIES, categoryEntities } from './categories';
import { seoEntityCount, translationGapKey, type TranslationGapEntry, type TranslationGapIndex } from './translationIndex';

/**
 * Calcolo dell'indice di `translationIndex.ts` (solo script e test: il client
 * legge l'indice già generato e non importa questo modulo).
 *
 * `dataset` deve avere applicati TUTTI gli overlay di `locales`
 * (`loadWorldDatasetWithTranslations`); `locales` = le lingue PUBBLICATE del
 * mondo (`translatedLocales`). Per ogni lingua: numero di entità con pagina e
 * quelle che NON hanno ogni testo tradotto.
 */
export function computeTranslationGaps(
  dataset: WorldDataset,
  locales: readonly SupportedLocale[],
): Partial<Record<SupportedLocale, TranslationGapEntry>> {
  const out: Partial<Record<SupportedLocale, TranslationGapEntry>> = {};
  for (const locale of [...locales].sort()) {
    const gaps: string[] = [];
    for (const category of SEO_CATEGORIES) {
      for (const e of categoryEntities(dataset, category)) {
        if (!isFullyTranslated(e, locale)) gaps.push(translationGapKey(category, e.id));
      }
    }
    out[locale] = { entities: seoEntityCount(dataset), gaps: gaps.sort() };
  }
  return out;
}

/** Lingue indicizzate per il mondo: pubblicate (`translatedLocales`) E con un overlay registrato. */
export function publishedTranslationLocales(world: AnimeWorld): SupportedLocale[] {
  return worldTranslationLocales(world.slug).filter((l) => world.translatedLocales?.includes(l));
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
