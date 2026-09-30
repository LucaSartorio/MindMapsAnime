import type { AnimeWorld } from '@/types';
import { getLocalizedText } from '@/utils/localization';
import { SITE, SEO_LOCALE_META, type SeoLocale } from './config';
import { absoluteUrl } from './paths';

/**
 * Structured data (JSON-LD, schema.org) — SOLO tipi semanticamente corretti.
 *
 *  - `Organization` + `WebSite`: identità del sito AniMapVerse (nome, logo,
 *    profili social reali). AniMapVerse è il PROGETTO: le opere restano dei
 *    rispettivi autori/editori e compaiono solo come `about` delle pagine.
 *  - `WebPage` / `CollectionPage` + `BreadcrumbList` sulle pagine interne.
 *  - Niente Article (non ci sono autori/date di pubblicazione reali), niente
 *    rating/review/prezzi, niente SearchAction (sitelinks search box ritirata).
 */
type Json = Record<string, unknown>;

const ORG_ID = `${SITE.origin}/#organization`;
const SITE_ID = `${SITE.origin}/#website`;

export function organizationLd(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    url: `${SITE.origin}/`,
    logo: { '@type': 'ImageObject', url: absoluteUrl(SITE.logo), width: 512, height: 512 },
    sameAs: [...SITE.sameAs],
    founder: { '@type': 'Person', name: SITE.author },
  };
}

export function websiteLd(lang: SeoLocale, description: string): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    name: SITE.name,
    url: `${SITE.origin}/`,
    description,
    inLanguage: SEO_LOCALE_META[lang].htmlLang,
    publisher: { '@id': ORG_ID },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbLd(crumbs: Crumb[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/**
 * L'OPERA di cui parla una pagina, con autore/editore SOLO se presenti nei
 * metadati del registro mondi (`AnimeWorld.metadata`). Nessun dato inventato.
 */
export function creativeWorkLd(world: AnimeWorld, lang: SeoLocale): Json {
  const md = world.metadata ?? {};
  const work: Json = {
    '@type': 'CreativeWorkSeries',
    name: getLocalizedText(world.title, lang),
  };
  if (typeof md.author === 'string') work.author = { '@type': 'Person', name: md.author };
  if (typeof md.publisher === 'string') work.publisher = { '@type': 'Organization', name: md.publisher };
  return work;
}

export function webPageLd(opts: {
  type: 'WebPage' | 'CollectionPage' | 'AboutPage';
  path: string;
  name: string;
  description: string;
  lang: SeoLocale;
  about?: Json | Json[];
  image?: string;
}): Json {
  const url = absoluteUrl(opts.path);
  const ld: Json = {
    '@context': 'https://schema.org',
    '@type': opts.type,
    '@id': `${url}#webpage`,
    url,
    name: opts.name,
    description: opts.description,
    inLanguage: SEO_LOCALE_META[opts.lang].htmlLang,
    isPartOf: { '@id': SITE_ID },
  };
  if (opts.about) ld.about = opts.about;
  if (opts.image) ld.primaryImageOfPage = { '@type': 'ImageObject', url: absoluteUrl(opts.image) };
  return ld;
}

/**
 * Soggetto di una pagina entità. Personaggi e luoghi sono di FINZIONE: usiamo
 * `Thing` (non Person/Place, che implicherebbero entità reali).
 */
export function thingLd(name: string, description: string): Json {
  const ld: Json = { '@type': 'Thing', name };
  if (description) ld.description = description;
  return ld;
}
