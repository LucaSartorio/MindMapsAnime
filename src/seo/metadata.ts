import type {
  AnimeWorld,
  Character,
  Faction,
  Jutsu,
  Localizable,
  Location,
  Nation,
  Route,
  StoryArc,
  WorldDataset,
} from '@/types';
import type { SupportedLocale } from '@/types/i18n';
import { findWorldByUrlSlug, getWorldUrlSlug } from '@/data/worlds';
import { getEntityDisplayName, getLocalizedText, getLocationTypeLabel } from '@/utils/localization';
import { getAbilityTerm, getFactionsTerm, humanizeId } from '@/lib/worldConfig';
import {
  DIRECTORY_PAGE_SIZE,
  ROBOTS_INDEX,
  ROBOTS_NOINDEX,
  SEO_LOCALES,
  SEO_LOCALE_META,
  SITE,
  X_DEFAULT_LOCALE,
  type SeoLocale,
} from './config';
import {
  PAGINATED_CATEGORIES,
  categoryEntities,
  type SeoCategory,
} from './categories';
import {
  absoluteUrl,
  categoryPath,
  entityPath,
  homePath,
  mapPath,
  parseSeoPath,
  staticPagePath,
  swapLangInPath,
  timelinePath,
  worldPath,
  type StaticPage,
} from './paths';
import { isDerivedJourney } from '@/data/shared/autoJourneys';
import { entityIdFromSlug, getSlugIndex } from './slug';
import { entityQuality } from './quality';
import { SEO_STRINGS } from './strings';
import {
  breadcrumbLd,
  creativeWorkLd,
  organizationLd,
  thingLd,
  webPageLd,
  websiteLd,
  type Crumb,
} from './schema';

/* ------------------------------------------------------------------ */
/* Pagine risolte                                                       */
/* ------------------------------------------------------------------ */

/** Una pagina pubblica, già validata contro i dati (slug esistente, pagina in range). */
export type SeoPage =
  | { kind: 'home' }
  | { kind: 'static'; page: StaticPage }
  | { kind: 'world'; world: AnimeWorld; dataset?: WorldDataset }
  | { kind: 'map'; dataset: WorldDataset }
  | { kind: 'timeline'; dataset: WorldDataset; page: number; pageCount: number }
  | { kind: 'category'; dataset: WorldDataset; category: SeoCategory; page: number; pageCount: number }
  | { kind: 'entity'; dataset: WorldDataset; category: SeoCategory; id: string };

export interface ResolvedPage {
  lang: SeoLocale;
  page: SeoPage;
  /** Path canonico (senza query/hash). */
  path: string;
}

export function pageCountFor(dataset: WorldDataset, category: SeoCategory | 'timeline'): number {
  if (category === 'timeline') return Math.max(1, Math.ceil(dataset.events.length / DIRECTORY_PAGE_SIZE));
  if (!PAGINATED_CATEGORIES.includes(category)) return 1;
  return Math.max(1, Math.ceil(categoryEntities(dataset, category).length / DIRECTORY_PAGE_SIZE));
}

/** Una categoria esiste (indice + pagine) solo se il mondo ha almeno un'entità. */
export function worldHasCategory(dataset: WorldDataset, category: SeoCategory): boolean {
  return categoryEntities(dataset, category).length > 0;
}

/** Path canonico di una pagina risolta. */
export function pathOf(lang: SeoLocale, page: SeoPage): string {
  switch (page.kind) {
    case 'home':
      return homePath(lang);
    case 'static':
      return staticPagePath(lang, page.page);
    case 'world':
      return worldPath(lang, page.world);
    case 'map':
      return mapPath(lang, page.dataset);
    case 'timeline':
      return timelinePath(lang, page.dataset, page.page);
    case 'category':
      return categoryPath(lang, page.dataset, page.category, page.page);
    case 'entity':
      return entityPath(lang, page.dataset, page.category, page.id)!;
  }
}

/**
 * Risolve un pathname in una pagina esistente, oppure `null` (→ 404 reale).
 * `getDataset` restituisce il dataset GIÀ caricato per un mondo disponibile.
 */
export function resolveSeoPath(
  pathname: string,
  getDataset: (slug: string) => WorldDataset | undefined,
): ResolvedPage | null {
  const parsed = parseSeoPath(pathname);
  if (parsed.kind === 'unknown') return null;
  const { lang } = parsed;
  const wrap = (page: SeoPage): ResolvedPage => ({ lang, page, path: pathOf(lang, page) });

  if (parsed.kind === 'home') return wrap({ kind: 'home' });
  if (parsed.kind === 'static') return wrap({ kind: 'static', page: parsed.page });

  const world = parsed.world;
  const dataset = world.status === 'available' ? getDataset(world.slug) : undefined;
  if (parsed.kind === 'world') return wrap({ kind: 'world', world, dataset });
  // Le sottopagine esistono solo per i mondi con dataset.
  if (!dataset) return null;

  switch (parsed.kind) {
    case 'map':
      return wrap({ kind: 'map', dataset });
    case 'timeline': {
      if (dataset.events.length === 0) return null;
      const pageCount = pageCountFor(dataset, 'timeline');
      if (parsed.page > pageCount) return null;
      return wrap({ kind: 'timeline', dataset, page: parsed.page, pageCount });
    }
    case 'category': {
      if (!worldHasCategory(dataset, parsed.category)) return null;
      const pageCount = pageCountFor(dataset, parsed.category);
      if (parsed.page > pageCount) return null;
      return wrap({ kind: 'category', dataset, category: parsed.category, page: parsed.page, pageCount });
    }
    case 'entity': {
      const idx = getSlugIndex(dataset);
      const current = idx.redirects[parsed.category].get(parsed.slug) ?? parsed.slug;
      const id = entityIdFromSlug(dataset, parsed.category, current);
      if (!id) return null;
      const page: SeoPage = { kind: 'entity', dataset, category: parsed.category, id };
      // Uno slug precedente risolve l'entità ma il path canonico è quello attuale.
      return wrap(page);
    }
  }
}

/* ------------------------------------------------------------------ */
/* Nomi & etichette                                                     */
/* ------------------------------------------------------------------ */

type AnyEntity = Character | Location | Faction | StoryArc | Route | Jutsu | Nation;

export function getSeoEntity(dataset: WorldDataset, category: SeoCategory, id: string): AnyEntity | undefined {
  return (categoryEntities(dataset, category) as AnyEntity[]).find((e) => e.id === id);
}

const dupCache = new WeakMap<WorldDataset, Map<string, Set<string>>>();

/** Nomi duplicati (stessa categoria, stessa lingua): servono a disambiguare i titoli. */
function duplicateNames(dataset: WorldDataset, category: SeoCategory, locale: SupportedLocale): Set<string> {
  let per = dupCache.get(dataset);
  if (!per) {
    per = new Map();
    dupCache.set(dataset, per);
  }
  const key = `${category}:${locale}`;
  const hit = per.get(key);
  if (hit) return hit;
  const seen = new Set<string>();
  const dups = new Set<string>();
  for (const e of categoryEntities(dataset, category) as AnyEntity[]) {
    const n = getEntityDisplayName(e, locale).toLowerCase();
    if (seen.has(n)) dups.add(n);
    seen.add(n);
  }
  per.set(key, dups);
  return dups;
}

/** Nome visualizzato di un'entità, disambiguato se un'altra della stessa categoria ha lo stesso nome. */
export function seoEntityName(
  dataset: WorldDataset,
  category: SeoCategory,
  id: string,
  locale: SupportedLocale,
): string {
  const e = getSeoEntity(dataset, category, id);
  if (!e) return id;
  const name = getEntityDisplayName(e, locale);
  if (!duplicateNames(dataset, category, locale).has(name.toLowerCase())) return name;
  let hint = '';
  if (category === 'locations') {
    const level = dataset.mapLevels.find((l) => l.id === (e as Location).mapLevelId);
    hint = level ? getLocalizedText(level.localizedName, locale) || level.name : '';
  }
  if (!hint) hint = humanizeId(getSlugIndex(dataset).byId[category].get(id)?.split('-').slice(-1)[0] ?? id);
  return `${name} (${hint})`;
}

/** Etichetta di una categoria nella lingua richiesta (usa i termini per-mondo). */
export function categoryLabel(
  world: AnimeWorld,
  category: SeoCategory | 'timeline' | 'map',
  locale: SupportedLocale,
  fallbacks: Record<SeoCategory | 'timeline' | 'map', string>,
): string {
  if (category === 'factions') return getFactionsTerm(world, locale, fallbacks.factions);
  if (category === 'abilities') return getAbilityTerm(world, locale);
  return fallbacks[category];
}

function seoCatLabel(world: AnimeWorld, category: SeoCategory | 'timeline' | 'map', lang: SeoLocale): string {
  const s = SEO_STRINGS[lang].cat;
  return categoryLabel(world, category, lang, { ...s, abilities: getAbilityTerm(world, lang) });
}

/* ------------------------------------------------------------------ */
/* Breadcrumb                                                            */
/* ------------------------------------------------------------------ */

export interface CrumbLabels {
  home: string;
  category: (world: AnimeWorld, category: SeoCategory | 'timeline' | 'map') => string;
  page: (n: number) => string;
}

/**
 * Traccia di breadcrumb di una pagina. Condivisa da JSON-LD (etichette nella
 * lingua dell'URL) e dal componente visibile `<Breadcrumbs>` (lingua UI).
 */
export function breadcrumbTrail(
  resolved: ResolvedPage,
  locale: SupportedLocale,
  labels: CrumbLabels,
): Crumb[] {
  const { lang, page } = resolved;
  const trail: Crumb[] = [{ name: labels.home, path: homePath(lang) }];
  const worldCrumb = (world: AnimeWorld) => ({
    name: getLocalizedText(world.title, locale),
    path: worldPath(lang, world),
  });
  switch (page.kind) {
    case 'home':
      return trail;
    case 'static':
      return trail;
    case 'world':
      return [...trail, worldCrumb(page.world)];
    case 'map':
      return [...trail, worldCrumb(page.dataset.world), { name: labels.category(page.dataset.world, 'map'), path: mapPath(lang, page.dataset) }];
    case 'timeline': {
      const t = [...trail, worldCrumb(page.dataset.world), { name: labels.category(page.dataset.world, 'timeline'), path: timelinePath(lang, page.dataset) }];
      if (page.page > 1) t.push({ name: labels.page(page.page), path: resolved.path });
      return t;
    }
    case 'category': {
      const t = [
        ...trail,
        worldCrumb(page.dataset.world),
        { name: labels.category(page.dataset.world, page.category), path: categoryPath(lang, page.dataset, page.category) },
      ];
      if (page.page > 1) t.push({ name: labels.page(page.page), path: resolved.path });
      return t;
    }
    case 'entity':
      return [
        ...trail,
        worldCrumb(page.dataset.world),
        { name: labels.category(page.dataset.world, page.category), path: categoryPath(lang, page.dataset, page.category) },
        { name: seoEntityName(page.dataset, page.category, page.id, locale), path: resolved.path },
      ];
  }
}

/* ------------------------------------------------------------------ */
/* Metadati                                                              */
/* ------------------------------------------------------------------ */

export interface HreflangAlternate {
  hreflang: string;
  href: string;
}

export interface PageMeta {
  lang: SeoLocale;
  path: string;
  /** Titolo completo (brand incluso). */
  title: string;
  description: string;
  canonical: string;
  robots: string;
  indexable: boolean;
  alternates: HreflangAlternate[];
  ogType: 'website' | 'article';
  image: string;
  imageAlt: string;
  jsonLd: Record<string, unknown>[];
}

export function withBrand(title: string): string {
  return title.includes(SITE.name) ? title : `${title}${SITE.titleSeparator}${SITE.name}`;
}

/** Taglia un testo al confine di parola, senza spezzare a metà. */
export function clip(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const at = cut.lastIndexOf(' ');
  return `${(at > max * 0.6 ? cut.slice(0, at) : cut).replace(/[\s,;:.–—-]+$/, '')}…`;
}

/** Descrizione = testo reale dell'entità (tagliato) + coda contestuale. */
function describe(summary: string, tail: string, max = 165): string {
  const s = summary.replace(/\s+/g, ' ').trim();
  if (!s) return tail;
  const end = (x: string) => (/[.!?…]$/.test(x) ? x : `${x}.`);
  // Testo breve: sempre testo reale + coda contestuale (anche se sfora di poco).
  if (s.length + tail.length + 1 <= max + 30) return `${end(s)} ${tail}`;
  const room = max - tail.length - 1;
  if (room < 60) return clip(s, max);
  return `${end(clip(s, room))} ${tail}`;
}

const summaryOf = (e: { shortDescription?: Localizable; description?: Localizable }, lang: SeoLocale) =>
  getLocalizedText(e.shortDescription ?? e.description, lang);

/** Immagine social della pagina (scalabile: in futuro card per-entità). */
function ogImageFor(): { image: string; alt: string } {
  return { image: SITE.ogImage, alt: SITE.name };
}

/**
 * Lingua in cui sono scritte le stringhe `Localizable` SEMPLICI (non oggetto)
 * dei dataset: il progetto è nato in italiano, quindi una `string` è testo
 * italiano non ancora tradotto (vedi `src/types/i18n.ts`).
 */
const PLAIN_STRING_LOCALE: SeoLocale = 'it';

/** Il testo principale dell'entità esiste DAVVERO in questa lingua (non per fallback)? */
export function isTranslatedIn(dataset: WorldDataset, category: SeoCategory, id: string, lang: SeoLocale): boolean {
  const e = getSeoEntity(dataset, category, id) as
    | { shortDescription?: Localizable; description?: Localizable }
    | undefined;
  const v = e?.shortDescription ?? e?.description;
  if (v == null) return lang === PLAIN_STRING_LOCALE;
  if (typeof v === 'string') return lang === PLAIN_STRING_LOCALE;
  const exact = (v as Partial<Record<SeoLocale, string>>)[lang];
  return !!exact && exact.trim() !== '';
}

/**
 * Indicizzabilità di una pagina risolta (strategia in docs/SEO.md).
 * Una pagina entità è indicizzabile in una lingua solo se (1) ha abbastanza
 * contenuto reale e (2) il suo testo è davvero scritto in quella lingua: una
 * pagina `/en` che mostrerebbe la descrizione italiana resta `noindex` (niente
 * finti duplicati "tradotti") finché il dataset non riceve la traduzione.
 */
export function isIndexable(resolved: ResolvedPage): boolean {
  return noindexReason(resolved) === null && canonicalTargetPath(resolved) === null;
}

/**
 * Pagine che sono una proiezione di un'altra risorsa: restano raggiungibili e
 * `index, follow` (niente segnali contraddittori noindex + canonical), ma la
 * loro `rel=canonical` punta alla risorsa principale e sono escluse da sitemap
 * e hreflang. Oggi: i percorsi DERIVATI (`isDerivedJourney`) → la pagina del
 * loro protagonista, che mostra gli stessi eventi e luoghi in ordine — solo se
 * quella pagina è a sua volta indicizzabile nella stessa lingua (una canonical
 * verso una pagina noindex è un errore). `null` = la pagina è canonica di sé.
 */
export function canonicalTargetPath(resolved: ResolvedPage): string | null {
  const { page, lang } = resolved;
  if (page.kind !== 'entity' || page.category !== 'journeys') return null;
  const route = page.dataset.routes.find((r) => r.id === page.id);
  if (!route || !isDerivedJourney(route)) return null;
  const characterId = route.protagonistCharacterIds[0];
  const target = characterId ? entityPath(lang, page.dataset, 'characters', characterId) : undefined;
  if (!target) return null;
  const targetPage: ResolvedPage = {
    lang,
    path: target,
    page: { kind: 'entity', dataset: page.dataset, category: 'characters', id: characterId },
  };
  return noindexReason(targetPage) === null ? target : null;
}

/** Perché una pagina è `noindex` (per report e test); `null` = indicizzabile. */
export type NoindexReason = 'legal_page' | 'coming_soon' | 'thin_content' | 'not_translated';

export function noindexReason(resolved: ResolvedPage): NoindexReason | null {
  const { page, lang } = resolved;
  switch (page.kind) {
    case 'static':
      return page.page === 'about' || page.page === 'support' ? null : 'legal_page';
    case 'world':
      return page.dataset ? null : 'coming_soon'; // i mondi "in arrivo" non hanno ancora contenuto
    case 'entity':
      if (!SEO_LOCALES.some((l) => entityQuality(page.dataset, page.category, page.id, l).indexable)) {
        return 'thin_content';
      }
      return isTranslatedIn(page.dataset, page.category, page.id, lang) ? null : 'not_translated';
    default:
      return null;
  }
}

/**
 * Alternative hreflang: SOLO le versioni linguistiche indicizzabili della
 * stessa pagina (reciprocità garantita: ogni versione calcola lo stesso
 * insieme). Una pagina noindex non dichiara alternative. `x-default` → la
 * versione inglese, o la prima disponibile.
 */
function alternatesFor(resolved: ResolvedPage, indexable: boolean): HreflangAlternate[] {
  if (!indexable) return [];
  const langs = SEO_LOCALES.filter((l) => isIndexable({ ...resolved, lang: l }));
  const xDefault = langs.includes(X_DEFAULT_LOCALE) ? X_DEFAULT_LOCALE : langs[0];
  return [
    ...langs.map((l) => ({ hreflang: SEO_LOCALE_META[l].hreflang, href: absoluteUrl(swapLangInPath(resolved.path, l)) })),
    { hreflang: 'x-default', href: absoluteUrl(swapLangInPath(resolved.path, xDefault)) },
  ];
}

export function buildPageMeta(resolved: ResolvedPage): PageMeta {
  const { lang, page, path } = resolved;
  const S = SEO_STRINGS[lang];
  const crumbs = breadcrumbTrail(resolved, lang, {
    home: S.crumbHome,
    category: (w, c) => seoCatLabel(w, c, lang),
    page: S.page,
  });
  const indexable = isIndexable(resolved);
  const og = ogImageFor();
  let title = '';
  let description = '';
  let ogType: PageMeta['ogType'] = 'website';
  const jsonLd: Record<string, unknown>[] = [];
  const pageSuffix = (n: number) => (n > 1 ? ` — ${S.page(n)}` : '');

  const worldName = (w: AnimeWorld) => getLocalizedText(w.title, lang);

  switch (page.kind) {
    case 'home': {
      title = S.home.title;
      description = S.home.description;
      jsonLd.push(websiteLd(lang, description), organizationLd());
      break;
    }
    case 'static': {
      const key = page.page === 'cookie-policy' ? 'cookies' : page.page;
      title = S[key].title;
      description = S[key].description;
      jsonLd.push(
        webPageLd({ type: page.page === 'about' ? 'AboutPage' : 'WebPage', path, name: title, description, lang }),
      );
      break;
    }
    case 'world': {
      const w = worldName(page.world);
      if (page.dataset) {
        title = S.world(w);
        description = S.worldDesc(w, clip(getLocalizedText(page.world.description, lang), 110));
      } else {
        title = S.worldSoon(w);
        description = S.worldSoonDesc(w);
      }
      jsonLd.push(
        webPageLd({ type: 'CollectionPage', path, name: title, description, lang, about: creativeWorkLd(page.world, lang) }),
      );
      break;
    }
    case 'map': {
      const w = worldName(page.dataset.world);
      title = S.map(w);
      description = S.mapDesc(w, categoryEntities(page.dataset, 'locations').length, page.dataset.routes.length);
      jsonLd.push(
        webPageLd({ type: 'WebPage', path, name: title, description, lang, about: creativeWorkLd(page.dataset.world, lang) }),
      );
      break;
    }
    case 'timeline': {
      const w = worldName(page.dataset.world);
      title = S.timeline(w) + pageSuffix(page.page);
      description = S.timelineDesc(w, page.dataset.events.length) + pageSuffix(page.page);
      jsonLd.push(webPageLd({ type: 'CollectionPage', path, name: title, description, lang, about: creativeWorkLd(page.dataset.world, lang) }));
      break;
    }
    case 'category': {
      const { dataset, category } = page;
      const w = worldName(dataset.world);
      const n = categoryEntities(dataset, category).length;
      const term = seoCatLabel(dataset.world, category, lang);
      const t: Record<SeoCategory, [string, string]> = {
        characters: [S.characters(w), S.charactersDesc(w, n)],
        locations: [S.locations(w), S.locationsDesc(w, n)],
        factions: [S.factions(w, term), S.factionsDesc(w, term, n)],
        arcs: [S.arcs(w), S.arcsDesc(w, n)],
        journeys: [S.journeys(w), S.journeysDesc(w, n)],
        abilities: [S.abilities(w, term), S.abilitiesDesc(w, term, n)],
        regions: [S.regions(w), S.regionsDesc(w, n)],
      };
      title = t[category][0] + pageSuffix(page.page);
      description = t[category][1] + pageSuffix(page.page);
      jsonLd.push(webPageLd({ type: 'CollectionPage', path, name: title, description, lang, about: creativeWorkLd(dataset.world, lang) }));
      break;
    }
    case 'entity': {
      const { dataset, category, id } = page;
      const e = getSeoEntity(dataset, category, id)!;
      const w = worldName(dataset.world);
      const fullName = seoEntityName(dataset, category, id, lang);
      // "Dragon Ball · Fusion Reborn" → "Fusion Reborn" nel title: il mondo
      // compare già nel template, ripeterlo allunga senza aggiungere senso.
      const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const name = fullName.replace(new RegExp(`^${escaped}\\s*[·:—–-]\\s*`, 'i'), '') || fullName;
      const summary = summaryOf(e as { shortDescription?: Localizable; description?: Localizable }, lang);
      ogType = 'article';
      switch (category) {
        case 'characters': {
          const c = e as Character;
          const hasJourney =
            (c.routeIds?.length ?? 0) > 0 ||
            dataset.routes.some((r) => r.protagonistCharacterIds.includes(c.id) || r.primaryCharacterIds?.includes(c.id));
          title = S.character(name, w, hasJourney);
          description = describe(summary, S.characterTail(name, w));
          break;
        }
        case 'locations': {
          const l = e as Location;
          title = S.location(name, getLocationTypeLabel(l.type, lang) || humanizeId(l.type), w);
          description = describe(summary, S.locationTail(name, w));
          break;
        }
        case 'factions': {
          const f = e as Faction;
          title = S.faction(name, humanizeId(String(f.type)), w);
          description = describe(summary, S.factionTail(name, w));
          break;
        }
        case 'arcs':
          title = S.arc(name, w);
          description = describe(summary, S.arcTail(name, w));
          break;
        case 'journeys':
          title = S.journey(name, w);
          description = describe(summary, S.journeyTail((e as Route).steps.length, w));
          break;
        case 'abilities':
          title = S.ability(name, getAbilityTerm(dataset.world, lang), w);
          description = describe(summary, S.abilityTail(name, w));
          break;
        case 'regions':
          title = S.region(name, w);
          description = describe(summary, S.regionTail(name, w));
          break;
      }
      jsonLd.push(
        webPageLd({
          type: 'WebPage',
          path,
          name: title,
          description,
          lang,
          about: [thingLd(fullName, clip(summary, 300)), creativeWorkLd(dataset.world, lang)],
        }),
      );
      break;
    }
  }

  if (crumbs.length > 1) jsonLd.push(breadcrumbLd(crumbs));

  return {
    lang,
    path,
    title: withBrand(title),
    description,
    canonical: absoluteUrl(canonicalTargetPath(resolved) ?? path),
    // Una pagina canonicalizzata altrove resta `index`: è la canonical a
    // consolidare i segnali, non un noindex (vedi `canonicalTargetPath`).
    robots: noindexReason(resolved) === null ? ROBOTS_INDEX : ROBOTS_NOINDEX,
    indexable,
    alternates: alternatesFor(resolved, indexable),
    ogType,
    image: absoluteUrl(og.image),
    imageAlt: og.alt,
    jsonLd,
  };
}

/** Metadati della pagina 404 (mai indicizzabile, nessuna canonical/hreflang). */
export function notFoundMeta(lang: SeoLocale): PageMeta {
  const S = SEO_STRINGS[lang];
  return {
    lang,
    path: '',
    title: withBrand(S.notFound.title),
    description: S.notFound.description,
    canonical: '',
    robots: 'noindex, follow',
    indexable: false,
    alternates: [],
    ogType: 'website',
    image: absoluteUrl(SITE.ogImage),
    imageAlt: SITE.name,
    jsonLd: [],
  };
}

/** Risolve un mondo dallo slug URL (re-export comodo per i consumer). */
export { findWorldByUrlSlug, getWorldUrlSlug };
