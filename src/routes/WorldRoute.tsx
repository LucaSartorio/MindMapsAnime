import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { findWorldBySlug } from '@/data/worlds';
import { getWorldDataset } from '@/data/registry';
import { WorldLayout } from '@/components/layout/WorldLayout';
import { WorldMapPage } from '@/pages/WorldMapPage';
import { ComingSoonWorldPage } from '@/pages/ComingSoonWorldPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

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
    <Suspense
      fallback={
        <div className="flex-1 grid place-items-center text-ink-300 text-sm">
          Caricamento…
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

/**
 * Router del singolo mondo. Risolve il dataset dallo slug,
 * mostra la pagina coming-soon o 404 in caso contrario.
 */
export function WorldRoute() {
  const { worldSlug } = useParams();
  const world = worldSlug ? findWorldBySlug(worldSlug) : undefined;

  if (!world) {
    return <NotFoundPage />;
  }
  if (world.status !== 'available') {
    return <ComingSoonWorldPage world={world} />;
  }
  const dataset = getWorldDataset(world.slug);
  if (!dataset) {
    return <ComingSoonWorldPage world={world} />;
  }

  return (
    <Routes>
      <Route
        index
        element={
          <WorldLayout dataset={dataset} mapOverlays>
            <WorldMapPage dataset={dataset} />
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
  );
}
