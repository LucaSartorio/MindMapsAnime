import { useEffect, type CSSProperties, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import { useMapStore, useUiStore, useWorldStore } from '@/store';
import { FiltersDrawer } from '@/components/drawers/FiltersDrawer';
import { ModalRoot } from '@/components/modals/ModalRoot';
import { MapLevelSwitcher } from '@/components/map/MapLevelSwitcher';
import { MapControls } from '@/components/map/MapControls';
import { MapLegendFloating } from '@/components/map/MapLegendFloating';
import { RoutesFloatingPanel } from '@/components/map/RoutesFloatingPanel';
import { TimelineBottomSheet } from '@/components/timeline/TimelineBottomSheet';
import { IconButton } from '@/components/common/IconButton';
import { resolveWorldCursor } from '@/utils/worldCursor';

interface WorldLayoutProps {
  dataset: WorldDataset;
  /** Contenuto principale (di solito la mappa full-screen) */
  children: ReactNode;
  /**
   * Se true (default) sovrappone i controlli mappa, timeline, percorsi.
   * Le pagine archive (characters/clans/arcs/sources) passano false.
   */
  mapOverlays?: boolean;
}

/**
 * Layout map-first del mondo.
 *
 * - Riempie tutto lo spazio sotto la TopNav.
 * - Il children (canvas mappa) occupa l'intera area.
 * - Tutti i controlli sono FLOATING, posizionati sopra il canvas.
 * - Modali e drawer sono renderizzati come fixed sopra tutto.
 */
export function WorldLayout({
  dataset,
  children,
  mapOverlays = true,
}: WorldLayoutProps) {
  const { t } = useTranslation();
  const { worldSlug } = useParams();
  const setActiveWorld = useWorldStore((s) => s.setActiveWorld);
  const setActiveMapLevel = useMapStore((s) => s.setActiveMapLevel);
  const activeMapLevelId = useMapStore((s) => s.activeMapLevelId);
  const openFilters = useUiStore((s) => s.openFiltersDrawer);

  // Cursore tematico del mondo (es. Naruto → vortice della Foglia).
  // Ibrido: il vortice è il cursore ambientale; gli elementi interattivi
  // mantengono i cursori funzionali via le regole `.world-cursor` in CSS.
  const worldCursor = resolveWorldCursor(worldSlug ?? dataset.world.slug);
  const cursorClass = worldCursor ? ' world-cursor' : '';
  const cursorStyle = worldCursor
    ? ({ '--world-cursor': worldCursor } as CSSProperties)
    : undefined;

  // Quando cambia il dataset/route, sincronizziamo store e map level di default.
  useEffect(() => {
    setActiveWorld(worldSlug ?? null, dataset);
    if (dataset.world.defaultMapLevelId) {
      setActiveMapLevel(dataset.world.defaultMapLevelId);
    } else if (dataset.mapLevels[0]) {
      setActiveMapLevel(dataset.mapLevels[0].id);
    }
    return () => setActiveWorld(null, null);
  }, [worldSlug, dataset, setActiveWorld, setActiveMapLevel]);

  // Chiudiamo modali e drawer al cambio mondo per ripartire puliti.
  useEffect(() => {
    return () => {
      useUiStore.getState().closeModal();
      useUiStore.getState().closeFiltersDrawer();
    };
  }, [worldSlug]);

  if (!mapOverlays) {
    // Modalità "pagina interna" (archivi, fonti): niente overlay mappa,
    // solo content + modali condivise.
    return (
      <div
        className={`relative flex-1 flex flex-col min-h-0${cursorClass}`}
        style={cursorStyle}
      >
        <div className="flex-1 min-h-0 overflow-auto">{children}</div>
        <FiltersDrawer dataset={dataset} />
        <ModalRoot dataset={dataset} />
      </div>
    );
  }

  return (
    <div
      className={`relative flex-1 flex flex-col min-h-0${cursorClass}`}
      style={cursorStyle}
    >
      {/* Canvas mappa: occupa tutto */}
      <div className="relative flex-1 min-h-0">
        {children}

        {/* Overlay floating sopra la mappa.
            pointer-events-none sul layer; pointer-events-auto sui figli. */}
        <div
          aria-hidden={false}
          className="pointer-events-none absolute inset-0 flex flex-col p-3 sm:p-4 gap-3"
        >
          {/* Top row: filtri (sinistra) · level switcher (centro) · controls (destra) */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="pointer-events-auto flex items-center gap-2">
              <IconButton
                aria-label={t('map.controls.filtersAria')}
                title={t('map.controls.filters')}
                onClick={openFilters}
              >
                <span aria-hidden>☰</span>
              </IconButton>
              <span className="panel hidden sm:inline-flex px-2.5 py-1.5 text-[11px] uppercase tracking-widest font-mono text-chakra-300">
                {dataset.world.title}
              </span>
            </div>

            <div className="pointer-events-auto">
              <MapLevelSwitcher
                levels={dataset.mapLevels}
                activeId={activeMapLevelId}
                onChange={setActiveMapLevel}
              />
            </div>

            <div className="pointer-events-auto">
              <MapControls />
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom row: legenda (sinistra) · timeline (centro) · percorsi (destra)
              Solo i singoli pannelli ricevono pointer events, l'area attorno
              resta trasparente per permettere pan/zoom della mappa. */}
          <div className="flex items-end justify-between gap-3 flex-wrap">
            <div className="pointer-events-auto">
              <MapLegendFloating />
            </div>
            <div className="flex-1 min-w-[280px] max-w-3xl mx-auto flex">
              {/* TimelineBottomSheet ha già pointer-events-auto sulla section */}
              <TimelineBottomSheet dataset={dataset} />
            </div>
            <div className="pointer-events-auto">
              <RoutesFloatingPanel dataset={dataset} />
            </div>
          </div>
        </div>
      </div>

      {/* Drawer e modali globali */}
      <FiltersDrawer dataset={dataset} />
      <ModalRoot dataset={dataset} />
    </div>
  );
}
