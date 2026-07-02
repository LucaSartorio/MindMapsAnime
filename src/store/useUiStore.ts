import { create } from 'zustand';

/**
 * Tipo di modale attiva.
 * Una sola modale per volta: aprire una nuova chiude la precedente.
 */
export type ActiveModal =
  | { kind: 'location'; id: string }
  | { kind: 'character'; id: string }
  | { kind: 'event'; id: string }
  | { kind: 'arc'; id: string }
  | { kind: 'faction'; id: string }
  | { kind: 'route'; id: string }
  | { kind: 'boundary'; id: string }
  | { kind: 'nation'; id: string }
  | { kind: 'jutsu'; id: string }
  | { kind: 'relations'; id: string }
  | null;

/**
 * Store dello stato UI: modali, drawer filtri, panel floating,
 * timeline collassata, legenda.
 *
 * Approccio map-first: tutti i pannelli sono floating o nascosti
 * di default. La mappa è sempre la protagonista.
 */
interface UiState {
  /** Modale attualmente aperta (null = nessuna) */
  activeModal: ActiveModal;
  /** Drawer dei filtri */
  isFiltersDrawerOpen: boolean;
  /** Drawer dei layer (visibilità sulla mappa), separato dai filtri */
  isLayersDrawerOpen: boolean;
  /** Pannello floating dei percorsi (in basso a destra) */
  isRoutesPanelOpen: boolean;
  /** Legenda compatta (in basso a sinistra) */
  isLegendOpen: boolean;
  /** Bottom sheet timeline */
  isTimelineOpen: boolean;
  /** Nav mobile */
  isMobileNavOpen: boolean;
  /** Overlay di onboarding / aiuto (come usare la mappa) */
  isHelpOpen: boolean;
  /** Story Mode guidata: id dell'arco in riproduzione (null = inattiva) */
  storyArcId: string | null;

  // Modali — apertura tipizzata
  openLocationModal: (id: string) => void;
  openCharacterModal: (id: string) => void;
  openEventModal: (id: string) => void;
  openArcModal: (id: string) => void;
  openFactionModal: (id: string) => void;
  openRouteModal: (id: string) => void;
  openBoundaryModal: (id: string) => void;
  openNationModal: (id: string) => void;
  openJutsuModal: (id: string) => void;
  openRelationsModal: (id: string) => void;
  closeModal: () => void;

  // Story Mode guidata
  openStory: (arcId: string) => void;
  closeStory: () => void;

  // Drawer / pannelli floating
  openFiltersDrawer: () => void;
  closeFiltersDrawer: () => void;
  toggleFiltersDrawer: () => void;

  openLayersDrawer: () => void;
  closeLayersDrawer: () => void;
  toggleLayersDrawer: () => void;

  toggleRoutesPanel: () => void;
  setRoutesPanel: (open: boolean) => void;

  toggleLegend: () => void;
  setLegend: (open: boolean) => void;

  toggleTimeline: () => void;
  setTimeline: (open: boolean) => void;

  toggleMobileNav: () => void;
  setMobileNav: (open: boolean) => void;

  openHelp: () => void;
  closeHelp: () => void;
  toggleHelp: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  activeModal: null,
  isFiltersDrawerOpen: false,
  isLayersDrawerOpen: false,
  isRoutesPanelOpen: false,
  isLegendOpen: false,
  isTimelineOpen: false,
  isMobileNavOpen: false,
  isHelpOpen: false,
  storyArcId: null,

  openLocationModal: (id) => set({ activeModal: { kind: 'location', id } }),
  openCharacterModal: (id) => set({ activeModal: { kind: 'character', id } }),
  openEventModal: (id) => set({ activeModal: { kind: 'event', id } }),
  openArcModal: (id) => set({ activeModal: { kind: 'arc', id } }),
  openFactionModal: (id) => set({ activeModal: { kind: 'faction', id } }),
  openRouteModal: (id) => set({ activeModal: { kind: 'route', id } }),
  openBoundaryModal: (id) => set({ activeModal: { kind: 'boundary', id } }),
  openNationModal: (id) => set({ activeModal: { kind: 'nation', id } }),
  openJutsuModal: (id) => set({ activeModal: { kind: 'jutsu', id } }),
  openRelationsModal: (id) => set({ activeModal: { kind: 'relations', id } }),
  closeModal: () => set({ activeModal: null }),

  // Story Mode: apre l'overlay narrativo per un arco e chiude eventuali modali.
  openStory: (arcId) => set({ storyArcId: arcId, activeModal: null }),
  closeStory: () => set({ storyArcId: null }),

  // Filtri e Layer sono drawer mutuamente esclusivi: aprirne uno chiude l'altro
  // (un solo drawer alla volta → niente pannelli sovrapposti a caso).
  openFiltersDrawer: () =>
    set({ isFiltersDrawerOpen: true, isLayersDrawerOpen: false }),
  closeFiltersDrawer: () => set({ isFiltersDrawerOpen: false }),
  toggleFiltersDrawer: () =>
    set((s) => ({
      isFiltersDrawerOpen: !s.isFiltersDrawerOpen,
      isLayersDrawerOpen: false,
    })),

  openLayersDrawer: () =>
    set({ isLayersDrawerOpen: true, isFiltersDrawerOpen: false }),
  closeLayersDrawer: () => set({ isLayersDrawerOpen: false }),
  toggleLayersDrawer: () =>
    set((s) => ({
      isLayersDrawerOpen: !s.isLayersDrawerOpen,
      isFiltersDrawerOpen: false,
    })),

  toggleRoutesPanel: () =>
    set((s) => ({ isRoutesPanelOpen: !s.isRoutesPanelOpen })),
  setRoutesPanel: (open) => set({ isRoutesPanelOpen: open }),

  toggleLegend: () => set((s) => ({ isLegendOpen: !s.isLegendOpen })),
  setLegend: (open) => set({ isLegendOpen: open }),

  toggleTimeline: () => set((s) => ({ isTimelineOpen: !s.isTimelineOpen })),
  setTimeline: (open) => set({ isTimelineOpen: open }),

  toggleMobileNav: () => set((s) => ({ isMobileNavOpen: !s.isMobileNavOpen })),
  setMobileNav: (open) => set({ isMobileNavOpen: open }),

  openHelp: () => set({ isHelpOpen: true }),
  closeHelp: () => set({ isHelpOpen: false }),
  toggleHelp: () => set((s) => ({ isHelpOpen: !s.isHelpOpen })),
}));
