/**
 * Entry del PRE-RENDERING (SSG). Compilato da `vite build --ssr` in
 * `dist-server/` e usato da `scripts/prerender.ts` per scrivere un file HTML
 * statico per ogni pagina pubblica.
 *
 * Rende lo STESSO albero React del client (`AppRoutes`) con `StaticRouter`,
 * dopo aver precaricato dataset e chunk lazy: il markup coincide con il primo
 * render client, che quindi idrata invece di ricreare il DOM.
 */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import type { WorldDataset } from '@/types';
import { ensureLocaleResources } from '@/i18n';
import { AppRoutes } from '@/routes/AppRouter';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { preloadAll } from '@/routes/lazyPages';
import { animeWorlds } from '@/data/worlds';
import { hasWorldDataset, loadWorldDatasetWithTranslations } from '@/data/registry';
import { setLocaleNow } from '@/store/useLocaleStore';
import { useWorldStore } from '@/store/useWorldStore';
import { SEO_LOCALES as LOCALES, type SeoLocale } from '@/seo/config';
import type { ResolvedPage } from '@/seo/metadata';

export { SITE, SEO_LOCALES, TECHNICAL_PATH_PREFIXES, X_DEFAULT_LOCALE } from '@/seo/config';
export { buildPageMeta, canonicalTargetPath, notFoundMeta, isIndexable, noindexReason, resolveSeoPath } from '@/seo/metadata';
export { renderHeadHtml } from '@/seo/head';
export { enumeratePages, enumerateSlugRedirects } from '@/seo/routes';
export { buildSitemaps } from '@/seo/sitemap';
export { absoluteUrl, worldPath, mapPath } from '@/seo/paths';
export { worldMapImage } from '@/seo/images';
export { getWorldUrlSlug } from '@/data/worlds';
export { getLocalizedText } from '@/utils/localization';

/**
 * Carica una volta tutti i dataset disponibili (con i loro overlay di
 * traduzione), le risorse UI di ogni lingua URL e tutti i chunk lazy.
 */
export async function setup(): Promise<Map<string, WorldDataset>> {
  await Promise.all([preloadAll(), ...LOCALES.map((l) => ensureLocaleResources(l))]);
  const datasets = new Map<string, WorldDataset>();
  for (const w of animeWorlds) {
    if (w.status !== 'available' || !hasWorldDataset(w.slug)) continue;
    const d = await loadWorldDatasetWithTranslations(w.slug);
    if (d) datasets.set(w.slug, d);
  }
  return datasets;
}

/**
 * HTML del `#root` per un URL. `resolved` (se c'è) fornisce il mondo attivo, da
 * impostare nello store come farà `preloadRoute` sul client.
 */
export function renderApp(url: string, lang: SeoLocale, resolved?: ResolvedPage | null): string {
  setLocaleNow(lang);
  const p = resolved?.page;
  const dataset = p && 'dataset' in p ? p.dataset : undefined;
  useWorldStore.setState({ worldSlug: dataset?.world.slug ?? null, dataset: dataset ?? null });
  return renderToString(
    <StrictMode>
      <ErrorBoundary>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </ErrorBoundary>
    </StrictMode>,
  );
}
