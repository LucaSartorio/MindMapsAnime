import { Suspense, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import { findWorldByUrlSlug } from '@/data/worlds';
import { getLoadedWorldDataset, loadWorldDataset } from '@/data/registry';
import { WorldLayout } from '@/components/layout/WorldLayout';
import { ComingSoonWorldPage } from '@/pages/ComingSoonWorldPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { Seo } from '@/components/seo/Seo';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ModalDeepLink } from '@/components/modals/ModalDeepLink';
import { resolveSeoPath, type ResolvedPage } from '@/seo/metadata';
import {
  CharactersPage,
  ClansAndFactionsPage,
  JutsuPage,
  SeoPages,
  StoryArcsPage,
} from './lazyPages';

function LazyFallback({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  return (
    <ErrorBoundary variant="section">
      <Suspense
        fallback={
          <div className="flex-1 grid place-items-center text-ink-300 text-sm">
            {t('common.loading')}
          </div>
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

/**
 * Router del singolo mondo (`/{lang}/{world}/...`). Risolve il dataset (chunk
 * lazy per mondo, vedi `src/data/registry.ts`), poi delega TUTTA la decisione
 * "questa pagina esiste?" a `resolveSeoPath` — la stessa funzione usata dal
 * pre-rendering e dalla sitemap. Path sconosciuto → 404 vero (non un redirect
 * silenzioso alla mappa: eviterebbe soft-404).
 */
export function WorldRoute() {
  const { t } = useTranslation();
  const { worldSlug } = useParams();
  const location = useLocation();
  const world = worldSlug ? findWorldByUrlSlug(worldSlug) : undefined;
  const slug = world?.status === 'available' ? world.slug : undefined;

  // Sync se già in cache (navigazioni successive, idratazione), altrimenti fetch.
  const [dataset, setDataset] = useState<WorldDataset | undefined>(() =>
    slug ? getLoadedWorldDataset(slug) : undefined,
  );
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const cached = getLoadedWorldDataset(slug);
    if (cached) {
      setDataset(cached);
      return;
    }
    let cancelled = false;
    setDataset(undefined);
    setFailed(false);
    loadWorldDataset(slug)
      .then((d) => {
        if (!cancelled) setDataset(d);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const resolved = useMemo<ResolvedPage | null>(
    () =>
      dataset || !slug
        ? resolveSeoPath(location.pathname, (s) => (s === dataset?.world.slug ? dataset : undefined))
        : null,
    [location.pathname, dataset, slug],
  );

  if (!world) return <NotFoundPage />;
  if (world.status !== 'available' || failed) {
    // I mondi "in arrivo" hanno solo la landing.
    return resolved?.page.kind === 'world' ? <ComingSoonWorldPage world={world} /> : <NotFoundPage />;
  }
  if (!dataset) {
    return (
      <div className="flex-1 grid place-items-center text-ink-300 text-sm">
        {t('common.loading')}
      </div>
    );
  }
  if (!resolved) return <NotFoundPage />;
  // Slug precedente / forma non canonica → URL canonico.
  if (resolved.path !== location.pathname.replace(/\/+$/, '')) {
    return <Navigate to={`${resolved.path}${location.search}${location.hash}`} replace />;
  }

  const kind = resolved.page.kind;
  const archiveCategory = kind === 'category' && resolved.page.kind === 'category' ? resolved.page.category : null;

  let content: ReactNode;
  switch (archiveCategory) {
    case 'characters':
      content = <CharactersPage dataset={dataset} resolved={resolved} />;
      break;
    case 'factions':
      content = <ClansAndFactionsPage dataset={dataset} resolved={resolved} />;
      break;
    case 'arcs':
      content = <StoryArcsPage dataset={dataset} resolved={resolved} />;
      break;
    case 'abilities':
      content = <JutsuPage dataset={dataset} resolved={resolved} />;
      break;
    default:
      content = <SeoPages resolved={resolved} />;
  }

  return (
    <>
      <Seo resolved={resolved} />
      <ModalDeepLink dataset={dataset} />
      <WorldLayout dataset={dataset} mapOverlays={kind === 'map'}>
        <LazyFallback>{content}</LazyFallback>
      </WorldLayout>
    </>
  );
}
