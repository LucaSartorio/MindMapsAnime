import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { WorldDataset } from '@/types';
import { useMapStore, useUiStore, useWorldStore } from '@/store';
import { Drawer } from '@/components/common/Drawer';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { LeftFiltersPanel } from './LeftFiltersPanel';
import { RightDetailsPanel } from './RightDetailsPanel';
import { BottomTimelinePanel } from './BottomTimelinePanel';

interface WorldLayoutProps {
  dataset: WorldDataset;
  /** Contenuto principale (mappa o pagina interna del mondo) */
  children: React.ReactNode;
  /** Mostra timeline in basso (default true). */
  showTimeline?: boolean;
}

/**
 * Layout condiviso da tutte le pagine all'interno di un singolo mondo.
 * - sidebar filtri a sinistra (drawer su mobile)
 * - dettaglio a destra (drawer su mobile)
 * - timeline collassabile in basso
 * - search bar contestuale
 */
export function WorldLayout({
  dataset,
  children,
  showTimeline = true,
}: WorldLayoutProps) {
  const { worldSlug } = useParams();
  const setActiveWorld = useWorldStore((s) => s.setActiveWorld);
  const setActiveMapLevel = useMapStore((s) => s.setActiveMapLevel);
  const leftOpen = useUiStore((s) => s.leftPanelOpen);
  const rightOpen = useUiStore((s) => s.rightPanelOpen);
  const setLeft = useUiStore((s) => s.setLeftPanel);
  const setRight = useUiStore((s) => s.setRightPanel);
  const toggleLeft = useUiStore((s) => s.toggleLeftPanel);

  // Quando il dataset cambia, sincronizziamo store globale + map level di default.
  useEffect(() => {
    setActiveWorld(worldSlug ?? null, dataset);
    if (dataset.world.defaultMapLevelId) {
      setActiveMapLevel(dataset.world.defaultMapLevelId);
    } else if (dataset.mapLevels[0]) {
      setActiveMapLevel(dataset.mapLevels[0].id);
    }
    return () => setActiveWorld(null, null);
  }, [worldSlug, dataset, setActiveWorld, setActiveMapLevel]);

  return (
    <div className="relative flex-1 flex flex-col">
      {/* Toolbar superiore del mondo */}
      <div className="border-b border-ink-700/40 bg-ink-950/60 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleLeft}
              aria-label="Mostra/nascondi filtri"
              className="btn-ghost !py-1.5 !px-2.5 text-xs"
            >
              ☰ Filtri
            </button>
            <span className="text-xs text-ink-400 hidden sm:inline">
              {dataset.world.title}
            </span>
          </div>
          <GlobalSearch dataset={dataset} />
        </div>
      </div>

      <div className="relative flex-1 grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[300px_1fr_380px] min-h-0">
        {/* Sidebar filtri desktop */}
        <aside
          className={
            'hidden md:flex border-r border-ink-700/40 bg-ink-900/40 ' +
            (leftOpen ? '' : 'md:hidden')
          }
        >
          <LeftFiltersPanel dataset={dataset} />
        </aside>

        {/* Sidebar filtri mobile (drawer) */}
        <Drawer
          open={leftOpen}
          side="left"
          onClose={() => setLeft(false)}
          ariaLabel="Filtri mappa"
          className="md:hidden"
        >
          <LeftFiltersPanel dataset={dataset} />
        </Drawer>

        {/* Contenuto principale */}
        <section className="relative min-h-0 flex flex-col">
          <div className="flex-1 min-h-0 relative">{children}</div>
          {showTimeline && <BottomTimelinePanel dataset={dataset} />}
        </section>

        {/* Pannello dettagli desktop */}
        <aside className="hidden lg:flex border-l border-ink-700/40 bg-ink-900/40">
          <RightDetailsPanel
            dataset={dataset}
            onClose={() => setRight(false)}
          />
        </aside>
      </div>

      {/* Pannello dettagli mobile/tablet (drawer) */}
      <Drawer
        open={rightOpen}
        side="right"
        onClose={() => setRight(false)}
        ariaLabel="Dettaglio luogo"
        className="lg:hidden"
      >
        <RightDetailsPanel
          dataset={dataset}
          onClose={() => setRight(false)}
        />
      </Drawer>
    </div>
  );
}
