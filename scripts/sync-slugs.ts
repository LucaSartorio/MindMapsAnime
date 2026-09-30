/**
 * `npm run seo:slugs` — congela gli slug SEO pubblicati in
 * `src/data/<world>/slugs.ts` (uno per mondo disponibile).
 *
 *  - conserva OGNI voce già presente (anche di entità rimosse: lo slug resta
 *    riservato e non verrà mai riassegnato);
 *  - aggiunge gli slug delle entità nuove (derivati dal nome inglese);
 *  - registra come redirect permanenti gli slug sostituiti da un pin
 *    `entity.slug` (rinomina voluta di un URL).
 *
 * Da eseguire dopo aver aggiunto entità o un nuovo mondo: `validate:data` e
 * `test:seo` falliscono finché il lock non copre tutte le entità con pagina.
 * Per un mondo nuovo il file viene creato: va poi importato una volta nel suo
 * `index.ts` come `seoSlugs` (lo script stampa l'istruzione esatta).
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { animeWorlds } from '../src/data/worlds';
import { hasWorldDataset, loadWorldDataset } from '../src/data/registry';
import { getSlugIndex, nextSlugLock } from '../src/seo/slug';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');

const sortObj = <T,>(o: Record<string, T>): Record<string, T> =>
  Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));

function render(varName: string, lock: ReturnType<typeof nextSlugLock>): string {
  const slugs = Object.fromEntries(Object.entries(lock.slugs).map(([c, m]) => [c, sortObj(m)]));
  const redirects = Object.fromEntries(Object.entries(lock.redirects).map(([c, m]) => [c, sortObj(m)]));
  return [
    '/**',
    ' * Slug SEO PUBBLICATI di questo mondo — generato da `npm run seo:slugs`.',
    ' * NON modificare a mano e non rimuovere voci: gli URL pubblicati sono',
    ' * permanenti. Per rinominare un URL impostare `slug` sull\'entità e rieseguire',
    ' * lo script (il vecchio slug diventa un redirect). Vedi src/seo/slug.ts.',
    ' */',
    "import type { SeoSlugLock } from '@/types';",
    '',
    `export const ${varName}: SeoSlugLock = ${JSON.stringify({ slugs, redirects }, null, 2)};`,
    '',
  ].join('\n');
}

let changed = 0;
let missingImport = 0;
for (const world of animeWorlds) {
  if (world.status !== 'available' || !hasWorldDataset(world.slug)) continue;
  const dataset = await loadWorldDataset(world.slug);
  if (!dataset) continue;
  const file = join(ROOT, 'src', 'data', world.slug, 'slugs.ts');
  const varName = `${world.slug}Slugs`;
  const next = render(varName, nextSlugLock(dataset));
  const prev = existsSync(file) ? readFileSync(file, 'utf8') : '';
  const idx = getSlugIndex(dataset);
  if (prev !== next) {
    changed++;
    if (check) {
      console.error(`✗ ${world.slug}: lock slug non aggiornato (${idx.unlocked.length} entità nuove) → npm run seo:slugs`);
    } else {
      writeFileSync(file, next, 'utf8');
      console.log(`✓ ${world.slug}: lock aggiornato (${idx.unlocked.length} nuovi, ${idx.renamed.length} rinominati)`);
    }
  } else {
    console.log(`= ${world.slug}: lock già aggiornato`);
  }
  if (!dataset.seoSlugs) {
    missingImport++;
    console.error(
      `! ${world.slug}: importa il lock in src/data/${world.slug}/index.ts →\n` +
        `    import { ${varName} } from './slugs';   …   seoSlugs: ${varName},`,
    );
  }
}
if (check && (changed || missingImport)) process.exit(1);
