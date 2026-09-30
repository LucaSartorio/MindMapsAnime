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
 * Lingue con URL indicizzabili (`/it/...`, `/en/...`).
 *
 * Coincidono con le lingue SORGENTE dei dataset (`SOURCE_LOCALES`): solo lì il
 * contenuto narrativo è scritto davvero. Le altre lingue dell'interfaccia
 * (ja/fr/de/es) traducono la UI ma ricadono sull'inglese per i contenuti: dare
 * loro un URL creerebbe pagine quasi-duplicate della versione inglese. Restano
 * quindi una preferenza client-side applicata sugli URL `/en/...`.
 */
export const SEO_LOCALES = SOURCE_LOCALES as readonly SeoLocale[];
export type SeoLocale = 'it' | 'en';

/** Lingua `x-default` (fallback internazionale). */
export const X_DEFAULT_LOCALE: SeoLocale = 'en';

export const SEO_LOCALE_META: Record<SeoLocale, { hreflang: string; ogLocale: string; htmlLang: string }> = {
  it: { hreflang: 'it', ogLocale: 'it_IT', htmlLang: 'it' },
  en: { hreflang: 'en', ogLocale: 'en_US', htmlLang: 'en' },
};

export function isSeoLocale(value: string | undefined | null): value is SeoLocale {
  return !!value && (SEO_LOCALES as readonly string[]).includes(value);
}

/**
 * Lingua URL corrispondente a una lingua UI: la lingua stessa se ha URL
 * propri, altrimenti la prima della sua catena di fallback che li ha
 * (ja/fr/de/es → en).
 */
export function seoLocaleFor(ui: SupportedLocale): SeoLocale {
  if (isSeoLocale(ui)) return ui;
  for (const l of LOCALE_FALLBACKS[ui]) if (isSeoLocale(l)) return l;
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
