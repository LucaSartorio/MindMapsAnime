import { useEffect, type CSSProperties, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import type { WorldDataset } from '@/types';
import { cn } from '@/lib/cn';
import { useMapStore, useUiStore, useWorldStore } from '@/store';
import { FiltersDrawer } from '@/components/drawers/FiltersDrawer';
import { LayersDrawer } from '@/components/drawers/LayersDrawer';
import { ModalRoot } from '@/components/modals/ModalRoot';
import { MapLevelSwitcher } from '@/components/map/MapLevelSwitcher';
import { ToolRail } from '@/components/map/ToolRail';
import { MapLegendFloating } from '@/components/map/MapLegendFloating';
import { RoutesFloatingPanel } from '@/components/map/RoutesFloatingPanel';
import { MapFocusBreadcrumb } from '@/components/map/MapFocusBreadcrumb';
import { MapModeIndicator } from '@/components/map/MapModeIndicator';
import { StoryModePanel } from '@/components/map/StoryModePanel';
import { ActiveFilterBar } from '@/components/filters/ActiveFilterBar';
import { TimelineBottomSheet } from '@/components/timeline/TimelineBottomSheet';
import { OnboardingOverlay } from '@/components/onboarding/OnboardingOverlay';
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
  const { worldSlug } = useParams();
  const setActiveWorld = useWorldStore((s) => s.setActiveWorld);
  const setActiveMapLevel = useMapStore((s) => s.setActiveMapLevel);
  const activeMapLevelId = useMapStore((s) => s.activeMapLevelId);
  // Su mobile i pannelli galleggianti (legenda/timeline/percorsi) si mostrano
  // SOLO quando aperti dalla bottom nav: da chiusi restano nascosti così non
  // coprono la mappa (su desktop restano invece i pill sempre visibili).
  const isLegendOpen = useUiStore((s) => s.isLegendOpen);
  const isTimelineOpen = useUiStore((s) => s.isTimelineOpen);
  const isRoutesOpen = useUiStore((s) => s.isRoutesPanelOpen);

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
      useUiStore.getState().closeLayersDrawer();
      useUiStore.getState().closeStory();
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

        {/* Tool rail (desktop, sinistra) + bottom nav (mobile): home unica e
            accessibile degli strumenti mappa. */}
        <ToolRail />

        {/* Overlay floating sopra la mappa.
            pointer-events-none sul layer; pointer-events-auto sui figli.
            Padding bottom extra su mobile per non finire sotto la bottom nav. */}
        <div
          aria-hidden={false}
          className="pointer-events-none absolute inset-0 flex flex-col gap-3 px-3 pt-3 pb-24 sm:px-4 sm:pt-4 md:pb-4"
        >
          {/* Top: selettore del livello mappa (centro) + breadcrumb focus. */}
          <div className="flex flex-col items-center gap-2">
            <div className="pointer-events-auto">
              <MapLevelSwitcher
                levels={dataset.mapLevels}
                activeId={activeMapLevelId}
                onChange={setActiveMapLevel}
              />
            </div>
            <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2">
              <MapModeIndicator />
              <MapFocusBreadcrumb dataset={dataset} />
            </div>
          </div>

          {/* Barra dei filtri attivi: appare solo quando c'è almeno un filtro,
              così di default non copre la mappa. */}
          <div className="flex">
            <ActiveFilterBar dataset={dataset} variant="floating" />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom row: legenda (sinistra) · timeline (centro) · percorsi (destra)
              Solo i singoli pannelli ricevono pointer events, l'area attorno
              resta trasparente per permettere pan/zoom della mappa. */}
          <div className="flex items-end justify-between gap-3 flex-wrap">
            {/* ml su desktop: la legenda parte a destra della tool rail verticale
                (che è ancorata a sinistra), così non si sovrappongono mai.
                max-md:hidden da chiusa: su mobile non ingombra la mappa. */}
            <div
              className={cn('pointer-events-auto md:ml-16', !isLegendOpen && 'max-md:hidden')}
            >
              <MapLegendFloating dataset={dataset} />
            </div>
            <div
              className={cn(
                'flex-1 min-w-[280px] max-w-3xl mx-auto flex',
                !isTimelineOpen && 'max-md:hidden',
              )}
            >
              {/* TimelineBottomSheet ha già pointer-events-auto sulla section */}
              <TimelineBottomSheet dataset={dataset} />
            </div>
            <div className={cn('pointer-events-auto', !isRoutesOpen && 'max-md:hidden')}>
              <RoutesFloatingPanel dataset={dataset} />
            </div>
          </div>
        </div>
      </div>

      {/* Drawer e modali globali */}
      <FiltersDrawer dataset={dataset} />
      <LayersDrawer dataset={dataset} />
      <StoryModePanel dataset={dataset} />
      <ModalRoot dataset={dataset} />
      <OnboardingOverlay />
    </div>
  );
}
