import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import { findWorldBySlug } from '@/data/worlds';
import { getLoadedWorldDataset, loadWorldDataset } from '@/data/registry';
import { WorldLayout } from '@/components/layout/WorldLayout';
import { ComingSoonWorldPage } from '@/pages/ComingSoonWorldPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { Seo } from '@/components/seo/Seo';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ModalDeepLink } from '@/components/modals/ModalDeepLink';

// Lazy: la pagina mappa porta con sé React Flow (~180KB) — non deve pesare
// sull'avvio dell'app (homepage) ma caricarsi solo entrando in un mondo.
const WorldMapPage = lazy(() =>
  import('@/pages/WorldMapPage').then((m) => ({ default: m.WorldMapPage })),
);

// Lazy load delle pagine archive
const CharactersPage = lazy(() =>
  import('@/components/archive/CharactersPage').then((m) => ({
    default: m.CharactersPage,
  })),
);
const ClansAndFactionsPage = lazy(() =>
  import('@/components/archive/ClansAndFactionsPage').then((m) => ({
    default: m.ClansAndFactionsPage,
  })),
);
const StoryArcsPage = lazy(() =>
  import('@/components/archive/StoryArcsPage').then((m) => ({
    default: m.StoryArcsPage,
  })),
);
const JutsuPage = lazy(() =>
  import('@/components/archive/JutsuPage').then((m) => ({
    default: m.JutsuPage,
  })),
);
const SourcesPage = lazy(() =>
  import('@/pages/SourcesPage').then((m) => ({ default: m.SourcesPage })),
);

function LazyFallback({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary variant="section">
      <Suspense
        fallback={
          <div className="flex-1 grid place-items-center text-ink-300 text-sm">
            Caricamento…
          </div>
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

/**
 * Router del singolo mondo. Risolve il dataset dallo slug — il dataset è
 * code-splittato per mondo e caricato in async (vedi `src/data/registry.ts`),
 * così il bundle iniziale resta leggero. Mostra coming-soon o 404 altrimenti.
 */
export function WorldRoute() {
  const { t } = useTranslation();
  const { worldSlug } = useParams();
  const world = worldSlug ? findWorldBySlug(worldSlug) : undefined;
  const slug = world?.status === 'available' ? world.slug : undefined;

  // Sync se già in cache (navigazioni successive), altrimenti fetch del chunk.
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

  if (!world) {
    return <NotFoundPage />;
  }
  if (world.status !== 'available') {
    return <ComingSoonWorldPage world={world} />;
  }
  if (failed) {
    return <ComingSoonWorldPage world={world} />;
  }
  if (!dataset) {
    return (
      <div className="flex-1 grid place-items-center text-ink-300 text-sm">
        {t('common.loading')}
      </div>
    );
  }

  return (
    <>
      <Seo />
      <ModalDeepLink dataset={dataset} />
      <Routes>
      <Route
        index
        element={
          <WorldLayout dataset={dataset} mapOverlays>
            <LazyFallback>
              <WorldMapPage dataset={dataset} />
            </LazyFallback>
          </WorldLayout>
        }
      />
      <Route
        path="characters"
        element={
          <WorldLayout dataset={dataset} mapOverlays={false}>
            <LazyFallback>
              <CharactersPage dataset={dataset} />
            </LazyFallback>
          </WorldLayout>
        }
      />
      <Route
        path="clans"
        element={
          <WorldLayout dataset={dataset} mapOverlays={false}>
            <LazyFallback>
              <ClansAndFactionsPage dataset={dataset} />
            </LazyFallback>
          </WorldLayout>
        }
      />
      <Route
        path="arcs"
        element={
          <WorldLayout dataset={dataset} mapOverlays={false}>
            <LazyFallback>
              <StoryArcsPage dataset={dataset} />
            </LazyFallback>
          </WorldLayout>
        }
      />
      <Route
        path="jutsu"
        element={
          <WorldLayout dataset={dataset} mapOverlays={false}>
            <LazyFallback>
              <JutsuPage dataset={dataset} />
            </LazyFallback>
          </WorldLayout>
        }
      />
      <Route
        path="sources"
        element={
          <WorldLayout dataset={dataset} mapOverlays={false}>
            <LazyFallback>
              <SourcesPage dataset={dataset} />
            </LazyFallback>
          </WorldLayout>
        }
      />
      <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </>
  );
}
