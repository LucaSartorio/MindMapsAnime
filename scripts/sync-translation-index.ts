/**
 * `npm run i18n:index` — rigenera `src/data/translationIndex.ts`: per ogni
 * mondo disponibile e ogni lingua con un overlay registrato, le entità con
 * pagina SEO che NON hanno ogni testo tradotto.
 *
 * L'indice rende la disponibilità delle traduzioni identica in prerender e nel
 * browser (che carica solo l'overlay della lingua dell'URL): da esso dipendono
 * gli hreflang e il noindex `not_translated` delle pagine `/es` e `/fr`.
 * Da eseguire dopo `i18n:merge` o dopo aver aggiunto/modificato entità.
 * `-- --check` verifica soltanto (exit 1 se l'indice è obsoleto); `test:seo`
 * esegue lo stesso controllo durante la build.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { animeWorlds } from '../src/data/worlds';
import { hasWorldDataset, loadWorldDatasetWithTranslations, worldTranslationLocales } from '../src/data/registry';
import { computeTranslationGaps, renderTranslationIndex } from '../src/seo/translationIndexBuild';
import type { TranslationGapIndex } from '../src/seo/translationIndex';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FILE = join(ROOT, 'src', 'data', 'translationIndex.ts');
const check = process.argv.includes('--check');

const index: Record<string, ReturnType<typeof computeTranslationGaps>> = {};
for (const world of animeWorlds) {
  if (world.status !== 'available' || !hasWorldDataset(world.slug)) continue;
  const locales = worldTranslationLocales(world.slug);
  if (!locales.length) continue;
  const dataset = await loadWorldDatasetWithTranslations(world.slug);
  if (!dataset) continue;
  index[world.slug] = computeTranslationGaps(dataset, locales);
}

const next = renderTranslationIndex(index as TranslationGapIndex);
const prev = existsSync(FILE) ? readFileSync(FILE, 'utf8') : '';
for (const [slug, perLocale] of Object.entries(index)) {
  const summary = Object.entries(perLocale)
    .map(([l, gaps]) => `${l}: ${gaps?.length ?? 0} non tradotte`)
    .join(' · ');
  console.log(`[i18n:index] ${slug} — ${summary}`);
}
if (prev === next) {
  console.log('[i18n:index] indice aggiornato');
} else if (check) {
  console.error('[i18n:index] ✗ src/data/translationIndex.ts non corrisponde ai dati → npm run i18n:index');
  process.exit(1);
} else {
  writeFileSync(FILE, next);
  console.log('[i18n:index] scritto src/data/translationIndex.ts');
}
