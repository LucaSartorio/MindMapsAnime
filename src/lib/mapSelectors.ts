import { useMemo } from 'react';
import type { Location, WorldDataset } from '@/types';
import { useMapStore } from '@/store';
import { selectVisibleLocations } from '@/lib/filters';

/**
 * Hook: luoghi attualmente visibili sulla mappa (stessi che vede il canvas).
 *
 * Riusa `selectVisibleLocations` così il conteggio mostrato nella barra dei
 * filtri attivi e nel footer del drawer combacia sempre con i pin renderizzati.
 */
export function useFilteredLocations(dataset: WorldDataset): Location[] {
  const activeMapLevelId = useMapStore((s) => s.activeMapLevelId);
  const filters = useMapStore((s) => s.filters);
  const layers = useMapStore((s) => s.visibleLayers);
  return useMemo(
    () => selectVisibleLocations(dataset, activeMapLevelId, filters, layers),
    [dataset, activeMapLevelId, filters, layers],
  );
}
