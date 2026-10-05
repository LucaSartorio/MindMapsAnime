import { getWorldUrlSlug } from '@/data/worlds';
import { isTechnicalPath } from './config';
import { absoluteUrl } from './paths';
import { buildPageMeta, type ResolvedPage } from './metadata';

/**
 * Sitemap XML generate dai dati (mai mantenute a mano).
 *
 *   /sitemap.xml              sitemap INDEX
 *   /sitemap-pages.xml        home + pagine informative (tutte le lingue)
 *   /sitemap-<world>.xml      tutte le pagine indicizzabili di un mondo
 *
 * Contengono SOLO URL canonici, indicizzabili (niente noindex, niente route
 * tecniche, niente query), con le alternative hreflang (`xhtml:link`).
 * `lastmod` è incluso solo se il chiamante fornisce una data REALE e
 * VERIFICABILE PER URL (ultima modifica significativa di QUELLA pagina): mai la
 * data della build né una data condivisa da un intero mondo. Oggi il
 * pre-rendering non ne passa (nessuna fonte per-URL affidabile).
 */
export interface SitemapFile {
  file: string;
  xml: string;
  urls: string[];
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function groupOf(r: ResolvedPage): string {
  const p = r.page;
  if (p.kind === 'home' || p.kind === 'static') return 'pages';
  if (p.kind === 'world') return getWorldUrlSlug(p.world);
  return getWorldUrlSlug(p.dataset.world);
}

export function buildSitemaps(
  pages: ResolvedPage[],
  lastmodFor: (r: ResolvedPage) => string | undefined = () => undefined,
): SitemapFile[] {
  const groups = new Map<string, ResolvedPage[]>();
  for (const r of pages) {
    const meta = buildPageMeta(r);
    if (!meta.indexable || isTechnicalPath(r.path) || meta.canonical !== absoluteUrl(r.path)) continue;
    const g = groupOf(r);
    groups.set(g, [...(groups.get(g) ?? []), r]);
  }

  const files: SitemapFile[] = [];
  for (const [group, list] of groups) {
    const urls: string[] = [];
    const entries = list.map((r) => {
      const meta = buildPageMeta(r);
      urls.push(meta.canonical);
      const lastmod = lastmodFor(r);
      const alts = meta.alternates
        .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${esc(a.href)}"/>`)
        .join('\n');
      return [
        '  <url>',
        `    <loc>${esc(meta.canonical)}</loc>`,
        ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
        alts,
        '  </url>',
      ].join('\n');
    });
    files.push({
      file: `sitemap-${group}.xml`,
      urls,
      xml:
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
        entries.join('\n') +
        '\n</urlset>\n',
    });
  }

  // "pages" per primo, poi i mondi in ordine alfabetico: output deterministico.
  files.sort((a, b) =>
    a.file === 'sitemap-pages.xml' ? -1 : b.file === 'sitemap-pages.xml' ? 1 : a.file.localeCompare(b.file),
  );
  const index =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    files.map((f) => `  <sitemap>\n    <loc>${absoluteUrl(`/${f.file}`)}</loc>\n  </sitemap>`).join('\n') +
    '\n</sitemapindex>\n';
  return [{ file: 'sitemap.xml', xml: index, urls: [] }, ...files];
}
