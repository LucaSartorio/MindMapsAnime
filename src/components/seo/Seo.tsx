import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useLocaleStore } from '@/store/useLocaleStore';
import {
  SITE,
  absoluteUrl,
  getRouteSeoMap,
  pageTitle,
  type RouteSeo,
} from '@/lib/seo';

interface SeoProps {
  /** Override del path da indicizzare (default: location corrente). */
  path?: string;
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: Record<string, unknown>[];
}

/**
 * Imposta i meta tag SEO della pagina corrente (client-side, per la SPA e per
 * i crawler che eseguono JS). Gli stessi metadati sono pre-renderizzati in
 * HTML statico al build da `scripts/prerender.ts`, usando `src/lib/seo.ts`.
 *
 * Risolve i default dalla configurazione per-rotta; ogni prop esplicita ha la
 * precedenza, così le pagine possono passare titoli/descrizioni localizzati.
 */
export function Seo(props: SeoProps) {
  const location = useLocation();
  const locale = useLocaleStore((s) => s.locale);

  const path = props.path ?? location.pathname;
  const map = useMemo(() => getRouteSeoMap(), []);
  const route: RouteSeo | undefined = map.get(path);

  const rawTitle = props.title ?? route?.title ?? SITE.defaultTitle;
  const title = pageTitle(rawTitle);
  const description = props.description ?? route?.description ?? SITE.description;
  const image = absoluteUrl(props.image ?? route?.image ?? SITE.ogImage);
  const type = props.type ?? route?.type ?? 'website';
  const noindex = props.noindex ?? route?.noindex ?? false;
  const canonical = absoluteUrl(path);
  const jsonLd = props.jsonLd ?? route?.jsonLd;
  const ogLocale = locale === 'en' ? 'en_US' : 'it_IT';
  const ogAltLocale = locale === 'en' ? 'it_IT' : 'en_US';

  return (
    <Helmet htmlAttributes={{ lang: locale }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta
        name="robots"
        content={
          noindex
            ? 'noindex, nofollow'
            : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        }
      />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content={String(SITE.ogImageWidth)} />
      <meta property="og:image:height" content={String(SITE.ogImageHeight)} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content={ogAltLocale} />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd?.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}
