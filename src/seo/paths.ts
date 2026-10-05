import type { AnimeWorld, WorldDataset } from '@/types';
import { findWorldByUrlSlug, getWorldUrlSlug } from '@/data/worlds';
import { SEO_LOCALES, SITE, isSeoLocale, seoLocaleFor, type SeoLocale } from './config';
import { isSeoCategory, type SeoCategory } from './categories';
import { entitySlug } from './slug';

/**
 * Costruttori e parser degli URL pubblici. Convenzione (vedi docs/SEO.md):
 *
 *   /{lang}                                   home
 *   /{lang}/about | /support | /privacy | /cookie-policy
 *   /{lang}/{world}                           landing del mondo
 *   /{lang}/{world}/map                       mappa interattiva
 *   /{lang}/{world}/{category}                indice di categoria
 *   /{lang}/{world}/{category}/page/{n}       pagine successive (directory paginate)
 *   /{lang}/{world}/{category}/{slug}         pagina entità
 *   /{lang}/{world}/timeline[/page/{n}]       cronologia
 *
 * Minuscolo, senza slash finale, senza query. Gli URL sono PERMANENTI.
 */

export type StaticPage = 'about' | 'support' | 'privacy' | 'cookie-policy';
export const STATIC_PAGES: readonly StaticPage[] = ['about', 'support', 'privacy', 'cookie-policy'];

type WorldLike = AnimeWorld | WorldDataset;
const worldOf = (w: WorldLike): AnimeWorld => ('world' in w ? w.world : w);

export const homePath = (lang: SeoLocale) => `/${lang}`;
export const staticPagePath = (lang: SeoLocale, page: StaticPage) => `/${lang}/${page}`;
/**
 * Lingua URL effettiva di un mondo: `lang` se il mondo esiste in quella lingua,
 * altrimenti la sua lingua di fallback (`/es` su un mondo non tradotto → `/en`).
 * Tutti i path di mondo passano di qui, quindi un link costruito da una pagina
 * spagnola verso un mondo non tradotto non punta mai a una pagina inesistente.
 */
export const worldLang = (lang: SeoLocale, w: WorldLike): SeoLocale => seoLocaleFor(lang, worldOf(w));
export const worldPath = (lang: SeoLocale, w: WorldLike) => `/${worldLang(lang, w)}/${getWorldUrlSlug(worldOf(w))}`;
export const mapPath = (lang: SeoLocale, w: WorldLike) => `${worldPath(lang, w)}/map`;
export const timelinePath = (lang: SeoLocale, w: WorldLike, page = 1) =>
  `${worldPath(lang, w)}/timeline${page > 1 ? `/page/${page}` : ''}`;
export const categoryPath = (lang: SeoLocale, w: WorldLike, category: SeoCategory, page = 1) =>
  `${worldPath(lang, w)}/${category}${page > 1 ? `/page/${page}` : ''}`;

/** URL della pagina di un'entità; `undefined` se l'id non esiste. */
export function entityPath(
  lang: SeoLocale,
  dataset: WorldDataset,
  category: SeoCategory,
  id: string,
): string | undefined {
  const slug = entitySlug(dataset, category, id);
  return slug ? `${categoryPath(lang, dataset, category)}/${slug}` : undefined;
}

/**
 * Link "apri sulla mappa" con la scheda già aperta (`?location=…`): usa il
 * deep-link esistente di `ModalDeepLink`. Le query sono stati UI: la canonical
 * resta `/map` e robots.txt esclude gli URL con query dal crawling.
 */
export function mapDeepLink(
  lang: SeoLocale,
  w: WorldLike,
  kind: 'location' | 'character' | 'faction' | 'arc' | 'route' | 'jutsu' | 'nation' | 'event',
  id: string,
): string {
  return `${mapPath(lang, w)}?${kind}=${encodeURIComponent(id)}`;
}

/** URL assoluto canonico. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const clean = path === '/' ? '' : path.replace(/\/+$/, '');
  return `${SITE.origin}${clean}`;
}

const LANG_PREFIX = new RegExp(`^/(${SEO_LOCALES.join('|')})(?=/|$)`);

/** Sostituisce il prefisso di lingua di un path (per il selettore lingua / hreflang). */
export function swapLangInPath(path: string, lang: SeoLocale): string {
  const m = LANG_PREFIX.exec(path);
  return m ? `/${lang}${path.slice(m[0].length)}` : `/${lang}`;
}

/** Lingua dell'URL, se il path inizia con un prefisso di lingua valido. */
export function langFromPath(path: string): SeoLocale | undefined {
  const seg = path.split('/')[1];
  return isSeoLocale(seg) ? seg : undefined;
}

/** Mondo dell'URL (qualunque sottopagina), se il path ne indica uno. */
export function worldOfPath(pathname: string): AnimeWorld | undefined {
  const p = parseSeoPath(pathname);
  return 'world' in p ? p.world : undefined;
}

/* ----------------------------- Parsing ----------------------------- */

export type ParsedPath =
  | { kind: 'home'; lang: SeoLocale }
  | { kind: 'static'; lang: SeoLocale; page: StaticPage }
  | { kind: 'world'; lang: SeoLocale; world: AnimeWorld }
  | { kind: 'map'; lang: SeoLocale; world: AnimeWorld }
  | { kind: 'timeline'; lang: SeoLocale; world: AnimeWorld; page: number }
  | { kind: 'category'; lang: SeoLocale; world: AnimeWorld; category: SeoCategory; page: number }
  | { kind: 'entity'; lang: SeoLocale; world: AnimeWorld; category: SeoCategory; slug: string }
  | { kind: 'unknown'; lang?: SeoLocale };

function parsePage(seg: string | undefined): number | undefined {
  if (!seg || !/^[1-9]\d{0,4}$/.test(seg)) return undefined;
  return Number(seg);
}

/**
 * Riconosce la FORMA di un path (senza verificare che lo slug esista: quello
 * richiede il dataset). Query e hash vanno rimossi prima.
 */
export function parseSeoPath(pathname: string): ParsedPath {
  const segs = pathname.split('/').filter(Boolean);
  const lang = isSeoLocale(segs[0]) ? segs[0] : undefined;
  if (!lang) return { kind: 'unknown' };
  if (segs.length === 1) return { kind: 'home', lang };
  const [, a, b, c, d] = segs;
  if ((STATIC_PAGES as readonly string[]).includes(a) && segs.length === 2) {
    return { kind: 'static', lang, page: a as StaticPage };
  }
  const world = findWorldByUrlSlug(a);
  if (!world) return { kind: 'unknown', lang };
  if (segs.length === 2) return { kind: 'world', lang, world };
  if (b === 'map' && segs.length === 3) return { kind: 'map', lang, world };
  if (b === 'timeline') {
    if (segs.length === 3) return { kind: 'timeline', lang, world, page: 1 };
    const page = c === 'page' && segs.length === 5 ? parsePage(d) : undefined;
    if (page && page > 1) return { kind: 'timeline', lang, world, page };
    return { kind: 'unknown', lang };
  }
  if (isSeoCategory(b)) {
    if (segs.length === 3) return { kind: 'category', lang, world, category: b, page: 1 };
    if (c === 'page' && segs.length === 5) {
      const page = parsePage(d);
      if (page && page > 1) return { kind: 'category', lang, world, category: b, page };
      return { kind: 'unknown', lang };
    }
    if (segs.length === 4 && c) return { kind: 'entity', lang, world, category: b, slug: c };
  }
  return { kind: 'unknown', lang };
}
