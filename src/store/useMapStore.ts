import { create } from 'zustand';
import { defaultFilters, type MapFilters } from '@/types';

/**
 * Store generico per la mappa interattiva.
 * Tiene selezioni, livello mappa attivo, filtri e route selezionata.
 */
interface MapState {
  activeMapLevelId: string | null;
  selectedLocationId: string | null;
  selectedRouteId: string | null;
  selectedTimelineEventId: string | null;
  selectedCharacterId: string | null;
  selectedArcId: string | null;
  filters: MapFilters;
  /** Chiave incrementale per forzare un fitView del canvas */
  viewportResetKey: number;
  setActiveMapLevel: (id: string | null) => void;
  setSelectedLocation: (id: string | null) => void;
  setSelectedRoute: (id: string | null) => void;
  setSelectedTimelineEvent: (id: string | null) => void;
  setSelectedCharacter: (id: string | null) => void;
  setSelectedArc: (id: string | null) => void;
  setFilters: (patch: Partial<MapFilters>) => void;
  resetFilters: () => void;
  resetViewport: () => void;
  resetSelections: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  activeMapLevelId: null,
  selectedLocationId: null,
  selectedRouteId: null,
  selectedTimelineEventId: null,
  selectedCharacterId: null,
  selectedArcId: null,
  filters: defaultFilters,
  viewportResetKey: 0,

  setActiveMapLevel: (id) =>
    set({
      activeMapLevelId: id,
      selectedLocationId: null,
      // Quando cambio mappa azzero la route per evitare incoerenze visive.
      selectedRouteId: null,
    }),
  setSelectedLocation: (id) => set({ selectedLocationId: id }),
  setSelectedRoute: (id) => set({ selectedRouteId: id }),
  setSelectedTimelineEvent: (id) => set({ selectedTimelineEventId: id }),
  setSelectedCharacter: (id) => set({ selectedCharacterId: id }),
  setSelectedArc: (id) => set({ selectedArcId: id }),
  setFilters: (patch) =>
    set((s) => ({ filters: { ...s.filters, ...patch } })),
  resetFilters: () => set({ filters: defaultFilters }),
  resetViewport: () =>
    set((s) => ({ viewportResetKey: s.viewportResetKey + 1 })),
  resetSelections: () =>
    set({
      selectedLocationId: null,
      selectedRouteId: null,
      selectedTimelineEventId: null,
      selectedCharacterId: null,
      selectedArcId: null,
    }),
}));
