import type { AnimeWorld } from '@/types';
import { SOURCE_LOCALES, LOCALE_FALLBACKS, type SupportedLocale } from '@/types/i18n';

/**
 * Configurazione SEO centralizzata di AniMapVerse.
 *
 * È l'UNICA fonte di verità condivisa da:
 *  - il client (`<Seo>` → `applyHead`), per la navigazione SPA;
 *  - il pre-rendering statico (`src/entry-server.tsx` + `scripts/prerender.ts`);
 *  - sitemap, robots e test (`scripts/test-seo.ts`, `scripts/seo-check.ts`).
 *
 * Vedi `docs/SEO.md` per l'architettura completa.
 */

export const SITE = {
  /** Origine canonica: HTTPS, dominio apex, senza slash finale. */
  origin: 'https://animapverse.com',
  /** Nome del sito (brand). Usato ovunque: title, og:site_name, JSON-LD. */
  name: 'AniMapVerse',
  /** Separatore fra titolo di pagina e brand. */
  titleSeparator: ' | ',
  /** Immagine social di default (1200×630). */
  ogImage: '/og-image.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  logo: '/icon-512.png',
  themeColor: '#070709',
  author: 'Luca Sartorio',
  /**
   * Profili ufficiali REALI del progetto (gli stessi linkati nel footer).
   * Finiscono in `Organization.sameAs`: non aggiungere profili inesistenti.
   */
  sameAs: ['https://www.instagram.com/ani_map_verse', 'https://x.com/animapverse'],
} as const;

/**
 * Lingue con URL propri (`/it/...`, `/en/...`, `/es/...`).
 *
 * - `it`/`en` sono le lingue SORGENTE dei dataset (`SOURCE_LOCALES`): ogni
 *   mondo esiste in entrambe.
 * - Le lingue aggiuntive (oggi `es`) hanno home e pagine informative proprie
 *   (l'interfaccia è tradotta), ma un MONDO esiste in quella lingua solo se il
 *   suo dataset è tradotto (`AnimeWorld.translatedLocales` + overlay
 *   `src/data/<slug>/i18n/<lingua>.ts`). Per gli altri mondi i link ricadono
 *   sulla lingua sorgente della catena di fallback (`/en`): niente pagine
 *   quasi-duplicate con contenuti solo inglesi sotto `/es`.
 * - ja/fr/de restano lingue solo-UI applicate sugli URL `/en`.
 */
export const SEO_LOCALES = ['it', 'en', 'es', 'fr'] as const satisfies readonly SupportedLocale[];
export type SeoLocale = (typeof SEO_LOCALES)[number];

/** Lingua `x-default` (fallback internazionale). */
export const X_DEFAULT_LOCALE: SeoLocale = 'en';

export const SEO_LOCALE_META: Record<SeoLocale, { hreflang: string; ogLocale: string; htmlLang: string }> = {
  it: { hreflang: 'it', ogLocale: 'it_IT', htmlLang: 'it' },
  en: { hreflang: 'en', ogLocale: 'en_US', htmlLang: 'en' },
  es: { hreflang: 'es', ogLocale: 'es_ES', htmlLang: 'es' },
  fr: { hreflang: 'fr', ogLocale: 'fr_FR', htmlLang: 'fr' },
};

export function isSeoLocale(value: string | undefined | null): value is SeoLocale {
  return !!value && (SEO_LOCALES as readonly string[]).includes(value);
}

/** Il mondo ha pagine in questa lingua URL? (sorgenti sempre, le altre se tradotto). */
export function worldHasSeoLocale(world: Pick<AnimeWorld, 'translatedLocales'>, lang: SeoLocale): boolean {
  return (SOURCE_LOCALES as readonly string[]).includes(lang) || !!world.translatedLocales?.includes(lang);
}

/**
 * Lingua URL corrispondente a una lingua UI: la lingua stessa se ha URL
 * propri (e, se è indicato un mondo, se quel mondo è tradotto), altrimenti la
 * prima della sua catena di fallback che li ha (ja/fr/de → en; es su un
 * mondo non tradotto → en).
 */
export function seoLocaleFor(ui: SupportedLocale, world?: Pick<AnimeWorld, 'translatedLocales'>): SeoLocale {
  const ok = (l: SupportedLocale): l is SeoLocale => isSeoLocale(l) && (!world || worldHasSeoLocale(world, l));
  if (ok(ui)) return ui;
  for (const l of LOCALE_FALLBACKS[ui]) if (ok(l)) return l;
  return X_DEFAULT_LOCALE;
}

/** Direttive robots. */
export const ROBOTS_INDEX =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
/** Pagine utili agli utenti ma non da indicizzare: i link vanno comunque seguiti. */
export const ROBOTS_NOINDEX = 'noindex, follow';

/**
 * Prefissi riservati a route TECNICHE (future social card, share preview,
 * render video). Non sono mai indicizzabili: robots.txt le esclude, vercel.json
 * aggiunge `X-Robots-Tag: noindex` e la sitemap le ignora.
 */
export const TECHNICAL_PATH_PREFIXES = ['/og/', '/share/', '/social/', '/render/'] as const;

export function isTechnicalPath(path: string): boolean {
  return TECHNICAL_PATH_PREFIXES.some((p) => path === p.slice(0, -1) || path.startsWith(p));
}

/** Voci per pagina nelle directory paginate (luoghi, timeline). */
export const DIRECTORY_PAGE_SIZE = 180;
