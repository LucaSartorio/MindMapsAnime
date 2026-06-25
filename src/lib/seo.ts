import type { Localizable } from '@/types';
import { animeWorlds } from '@/data/worlds';
import { getAbilityTerm, getFactionsTerm } from '@/lib/worldConfig';

/**
 * Configurazione SEO centralizzata — unica fonte di verità condivisa tra:
 *  - il componente client `<Seo>` (react-helmet-async), per la navigazione SPA;
 *  - lo script di pre-rendering `scripts/prerender.ts`, che inietta i meta tag
 *    statici in un file HTML per ogni rotta (così i crawler che NON eseguono
 *    JavaScript — social, alcune anteprime — leggono comunque i meta corretti).
 */

export const SITE = {
  url: 'https://mindmapsanime.vercel.app',
  name: 'Mappe Interattive',
  shortName: 'Mappe Interattive',
  defaultTitle: 'Mappe Interattive — Atlante interattivo di anime e manga',
  /** Suffisso applicato ai titoli di pagina (eccetto la home). */
  titleSuffix: 'Mappe Interattive',
  description:
    'Esplora i mondi dei tuoi anime e manga preferiti attraverso mappe interattive, timeline, personaggi, fazioni, archi narrativi e percorsi. Naruto, Hunter x Hunter, One Piece e altri.',
  locale: 'it_IT',
  altLocale: 'en_US',
  /** Lingua di default del contenuto pre-renderizzato. */
  lang: 'it',
  ogImage: '/og-image.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  author: 'Luca Sartorio',
  themeColor: '#070709',
} as const;

export interface RouteSeo {
  /** Path assoluto della rotta, es. '/about' o '/worlds/naruto'. */
  path: string;
  /** Contenuto completo del tag <title>. */
  title: string;
  description: string;
  /** Immagine OG (root-relative o assoluta). Default: SITE.ogImage. */
  image?: string;
  type?: 'website' | 'article';
  /** Esclude la pagina dall'indicizzazione (es. 404). */
  noindex?: boolean;
  /** Frequenza/priorità per la sitemap. */
  changefreq?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority?: number;
  /** Blocchi JSON-LD (schema.org) da iniettare. */
  jsonLd?: Record<string, unknown>[];
}

/** Risolve una stringa localizzata sul locale di default (it). */
function it(value: Localizable | undefined, fallback = ''): string {
  if (value == null) return fallback;
  if (typeof value === 'string') return value;
  return value.it ?? value.en ?? fallback;
}

/** Costruisce un URL assoluto a partire da un path root-relative. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const clean = path === '/' ? '' : path.replace(/\/$/, '');
  return `${SITE.url}${clean}`;
}

/** Compone il titolo finale aggiungendo il suffisso del sito. */
export function pageTitle(title: string): string {
  return title === SITE.defaultTitle ? title : `${title} · ${SITE.titleSuffix}`;
}

function breadcrumb(
  items: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

const websiteJsonLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.name,
  alternateName: 'Interactive Maps · Anime',
  url: SITE.url,
  description: SITE.description,
  inLanguage: ['it-IT', 'en'],
  author: { '@type': 'Person', name: SITE.author },
};

/**
 * Genera la lista completa delle rotte indicizzabili con i relativi metadati.
 * Usata sia per la sitemap che per il pre-rendering.
 */
export function getAllRoutes(): RouteSeo[] {
  const routes: RouteSeo[] = [];

  // --- Home ---
  routes.push({
    path: '/',
    title: SITE.defaultTitle,
    description: SITE.description,
    type: 'website',
    changefreq: 'weekly',
    priority: 1,
    jsonLd: [websiteJsonLd],
  });

  // --- Pagine statiche ---
  routes.push({
    path: '/about',
    title: 'Informazioni sul progetto',
    description:
      'Cos’è Mappe Interattive: un atlante interattivo, dataset-driven, dei mondi narrativi di anime e manga. Architettura, fonti e obiettivi del progetto.',
    changefreq: 'monthly',
    priority: 0.6,
    jsonLd: [
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Informazioni', path: '/about' },
      ]),
    ],
  });
  routes.push({
    path: '/supporta',
    title: 'Supportaci',
    description:
      'Supporta Mappe Interattive: un atlante interattivo gratuito e senza pubblicità su anime e manga. Una donazione aiuta a coprire i costi e a sviluppare nuovi mondi e funzionalità.',
    changefreq: 'monthly',
    priority: 0.5,
    jsonLd: [
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Supportaci', path: '/supporta' },
      ]),
    ],
  });
  routes.push({
    path: '/privacy',
    title: 'Informativa sulla Privacy',
    description:
      'Informativa sulla privacy di Mappe Interattive ai sensi del GDPR (Reg. UE 2016/679): titolare, dati trattati, finalità, diritti dell’interessato.',
    changefreq: 'yearly',
    priority: 0.2,
  });
  routes.push({
    path: '/cookie-policy',
    title: 'Cookie Policy',
    description:
      'Cookie Policy di Mappe Interattive: cookie tecnici e di analisi, gestione del consenso e dei tuoi diritti in conformità a GDPR ed ePrivacy.',
    changefreq: 'yearly',
    priority: 0.2,
  });

  // --- Mondi ---
  for (const world of animeWorlds) {
    const worldName = world.title;
    const desc = it(world.description, SITE.description);
    const worldPath = `/worlds/${world.slug}`;
    const crumbs = [
      { name: 'Home', path: '/' },
      { name: worldName, path: worldPath },
    ];

    routes.push({
      path: worldPath,
      title:
        world.status === 'available'
          ? `${worldName} — Mappa interattiva`
          : `${worldName} — In arrivo`,
      description: desc,
      type: 'article',
      changefreq: 'weekly',
      priority: world.status === 'available' ? 0.9 : 0.4,
      jsonLd: [breadcrumb(crumbs)],
    });

    if (world.status !== 'available') continue;

    // Sottopagine archivio (solo mondi disponibili).
    const abilityTerm = getAbilityTerm(world, SITE.lang);
    const factionsTerm = getFactionsTerm(world, SITE.lang, 'Clan & Fazioni');
    const subPages: { seg: string; label: string; desc: string }[] = [
      {
        seg: 'characters',
        label: 'Personaggi',
        desc: `Tutti i personaggi di ${worldName}: profili, ruoli, affiliazioni e relazioni nel mondo narrativo.`,
      },
      {
        seg: 'clans',
        label: factionsTerm,
        desc: `${factionsTerm} di ${worldName}: gruppi, organizzazioni e affiliazioni con i relativi membri.`,
      },
      {
        seg: 'jutsu',
        label: abilityTerm,
        desc: `${abilityTerm} di ${worldName}: abilità e tecniche del sistema di poteri del mondo.`,
      },
      {
        seg: 'arcs',
        label: 'Archi narrativi',
        desc: `Archi narrativi e timeline di ${worldName}: cronologia degli eventi e degli archi della storia.`,
      },
    ];

    for (const sp of subPages) {
      routes.push({
        path: `${worldPath}/${sp.seg}`,
        title: `${sp.label} di ${worldName}`,
        description: sp.desc,
        type: 'article',
        changefreq: 'monthly',
        priority: 0.7,
        jsonLd: [
          breadcrumb([...crumbs, { name: sp.label, path: `${worldPath}/${sp.seg}` }]),
        ],
      });
    }
  }

  return routes;
}

/** Mappa path → RouteSeo per lookup veloce (client). */
export function getRouteSeoMap(): Map<string, RouteSeo> {
  const map = new Map<string, RouteSeo>();
  for (const r of getAllRoutes()) map.set(r.path, r);
  return map;
}
