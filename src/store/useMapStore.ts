import { create } from 'zustand';
import {
  defaultFilters,
  defaultLayers,
  type MapFilters,
  type VisibleLayers,
} from '@/types';

/**
 * Store generico della mappa interattiva.
 *
 * Tiene selezioni (luogo, percorso, evento, arco, personaggio, fazione,
 * boundary), hover boundary, map level attivo, filtri, layer visibili,
 * viewport reset key.
 */
interface MapState {
  activeMapLevelId: string | null;
  selectedLocationId: string | null;
  selectedRouteId: string | null;
  selectedTimelineEventId: string | null;
  selectedCharacterId: string | null;
  selectedArcId: string | null;
  selectedFactionId: string | null;
  selectedBoundaryId: string | null;
  hoveredBoundaryId: string | null;
  filters: MapFilters;
  visibleLayers: VisibleLayers;
  /** Chiave incrementale per forzare un fitView del canvas */
  viewportResetKey: number;
  setActiveMapLevel: (id: string | null) => void;
  setSelectedLocation: (id: string | null) => void;
  setSelectedRoute: (id: string | null) => void;
  setSelectedTimelineEvent: (id: string | null) => void;
  setSelectedCharacter: (id: string | null) => void;
  setSelectedArc: (id: string | null) => void;
  setSelectedFaction: (id: string | null) => void;
  setSelectedBoundary: (id: string | null) => void;
  setHoveredBoundary: (id: string | null) => void;
  setFilters: (patch: Partial<MapFilters>) => void;
  setVisibleLayer: <K extends keyof VisibleLayers>(
    layer: K,
    value: VisibleLayers[K],
  ) => void;
  setVisibleLayers: (patch: Partial<VisibleLayers>) => void;
  resetFilters: () => void;
  resetLayers: () => void;
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
  selectedFactionId: null,
  selectedBoundaryId: null,
  hoveredBoundaryId: null,
  filters: defaultFilters,
  visibleLayers: defaultLayers,
  viewportResetKey: 0,

  setActiveMapLevel: (id) =>
    set({
      activeMapLevelId: id,
      selectedLocationId: null,
      selectedRouteId: null,
      selectedBoundaryId: null,
    }),
  setSelectedLocation: (id) => set({ selectedLocationId: id }),
  setSelectedRoute: (id) => set({ selectedRouteId: id }),
  setSelectedTimelineEvent: (id) => set({ selectedTimelineEventId: id }),
  setSelectedCharacter: (id) => set({ selectedCharacterId: id }),
  setSelectedArc: (id) => set({ selectedArcId: id }),
  setSelectedFaction: (id) => set({ selectedFactionId: id }),
  setSelectedBoundary: (id) => set({ selectedBoundaryId: id }),
  setHoveredBoundary: (id) => set({ hoveredBoundaryId: id }),
  setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
  setVisibleLayer: (layer, value) =>
    set((s) => ({ visibleLayers: { ...s.visibleLayers, [layer]: value } })),
  setVisibleLayers: (patch) =>
    set((s) => ({ visibleLayers: { ...s.visibleLayers, ...patch } })),
  resetFilters: () => set({ filters: defaultFilters }),
  resetLayers: () => set({ visibleLayers: defaultLayers }),
  resetViewport: () =>
    set((s) => ({ viewportResetKey: s.viewportResetKey + 1 })),
  resetSelections: () =>
    set({
      selectedLocationId: null,
      selectedRouteId: null,
      selectedTimelineEventId: null,
      selectedCharacterId: null,
      selectedArcId: null,
      selectedFactionId: null,
      selectedBoundaryId: null,
      hoveredBoundaryId: null,
    }),
}));
