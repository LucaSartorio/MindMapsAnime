import type { WorldDataset } from '@/types';
import { animeWorlds } from '@/data/worlds';
import { SEO_LOCALES, worldHasSeoLocale, type SeoLocale } from './config';
import { SEO_CATEGORIES, categoryEntities, type SeoCategory } from './categories';
import { STATIC_PAGES, categoryPath } from './paths';
import { pageCountFor, pathOf, worldHasCategory, type ResolvedPage, type SeoPage } from './metadata';
import { getSlugIndex } from './slug';

/**
 * Enumerazione DATA-DRIVEN di tutte le pagine pubbliche: home, pagine statiche,
 * per ogni mondo landing/mappa/timeline, indici di categoria (con paginazione)
 * e una pagina per ogni entità. Aggiungere un mondo (dataset + registry) o
 * un'entità nei dati fa comparire automaticamente le sue pagine qui — e quindi
 * nel pre-rendering, nella sitemap e nei test.
 */
export function enumeratePages(datasets: Map<string, WorldDataset>): ResolvedPage[] {
  const pages: ResolvedPage[] = [];
  for (const lang of SEO_LOCALES) {
    const add = (page: SeoPage) => pages.push({ lang, page, path: pathOf(lang, page) });
    add({ kind: 'home' });
    for (const p of STATIC_PAGES) add({ kind: 'static', page: p });

    for (const world of animeWorlds) {
      if (world.status === 'hidden') continue;
      // Lingue aggiuntive (es): solo i mondi tradotti hanno pagine.
      if (!worldHasSeoLocale(world, lang)) continue;
      const dataset = world.status === 'available' ? datasets.get(world.slug) : undefined;
      add({ kind: 'world', world, dataset });
      if (!dataset) continue;
      add({ kind: 'map', dataset });
      if (dataset.events.length > 0) {
        const pageCount = pageCountFor(dataset, 'timeline');
        for (let page = 1; page <= pageCount; page++) add({ kind: 'timeline', dataset, page, pageCount });
      }
      for (const category of SEO_CATEGORIES) {
        if (!worldHasCategory(dataset, category)) continue;
        const pageCount = pageCountFor(dataset, category);
        for (let page = 1; page <= pageCount; page++) add({ kind: 'category', dataset, category, page, pageCount });
        for (const e of categoryEntities(dataset, category)) add({ kind: 'entity', dataset, category, id: e.id });
      }
    }
  }
  return pages;
}

/** Redirect da slug precedenti (`previousSlugs`) → pagina attuale. */
export function enumerateSlugRedirects(
  datasets: Map<string, WorldDataset>,
): { from: string; to: string; lang: SeoLocale }[] {
  const out: { from: string; to: string; lang: SeoLocale }[] = [];
  for (const dataset of datasets.values()) {
    const idx = getSlugIndex(dataset);
    for (const category of SEO_CATEGORIES as readonly SeoCategory[]) {
      for (const [prev, current] of idx.redirects[category]) {
        for (const lang of SEO_LOCALES) {
          if (!worldHasSeoLocale(dataset.world, lang)) continue;
          const base = categoryPath(lang, dataset, category);
          out.push({ from: `${base}/${prev}`, to: `${base}/${current}`, lang });
        }
      }
    }
  }
  return out;
}
