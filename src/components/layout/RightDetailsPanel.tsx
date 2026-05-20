import { useMemo } from 'react';
import type { WorldDataset } from '@/types';
import { useMapStore } from '@/store';
import { LocationDetailCard } from '@/components/map/LocationDetailCard';
import { EmptyState } from '@/components/common/EmptyState';

interface RightDetailsPanelProps {
  dataset: WorldDataset;
  onClose: () => void;
}

export function RightDetailsPanel({ dataset, onClose }: RightDetailsPanelProps) {
  const selectedLocationId = useMapStore((s) => s.selectedLocationId);
  const setActiveMapLevel = useMapStore((s) => s.setActiveMapLevel);

  const location = useMemo(
    () =>
      selectedLocationId
        ? dataset.locations.find((l) => l.id === selectedLocationId)
        : undefined,
    [selectedLocationId, dataset.locations],
  );

  if (!location) {
    return (
      <div className="h-full grid place-items-center p-6">
        <EmptyState
          title="Seleziona un luogo"
          description="Clicca un nodo sulla mappa per vedere dettagli, personaggi collegati ed eventi."
        />
      </div>
    );
  }

  return (
    <LocationDetailCard
      location={location}
      dataset={dataset}
      onClose={onClose}
      onZoomIn={
        location.subMapLevelId
          ? () => setActiveMapLevel(location.subMapLevelId!)
          : undefined
      }
    />
  );
}
