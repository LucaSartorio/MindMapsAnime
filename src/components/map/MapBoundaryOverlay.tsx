import { useMemo } from 'react';
import type { MapBoundary, MapLevel, WorldDataset } from '@/types';
import { useMapStore, useUiStore } from '@/store';
import { MapRegionPath } from './MapRegionPath';

interface MapBoundaryOverlayProps {
  dataset: WorldDataset;
  level: MapLevel;
}

/**
 * Layer SVG dei confini delle nazioni/regioni.
 * Renderizzato con lo STESSO viewBox della mappa di sfondo, in modo che i
 * path siano sempre allineati indipendentemente da zoom/pan di React Flow.
 *
 * NB: questo layer NON sta dentro React Flow — è un overlay assoluto sotto
 * i nodi React Flow ma sopra la `WorldMapBackground`. Quando l'utente
 * effettua pan/zoom, il movimento è sincronizzato perché React Flow
 * trasforma anche il contenitore degli overlay.
 *
 * Implementazione: usiamo `useStore`-style transform: l'overlay è
 * posizionato dentro il `<ReactFlow>` come `Background`-like layer.
 * Per semplicità, in questa versione lo posizioniamo come SVG full-size
 * sopra la WorldMapBackground (il viewBox lo rende stabile rispetto al
 * background), e in cima a tutto React Flow renderizza i nodi.
 */
export function MapBoundaryOverlay({ dataset, level }: MapBoundaryOverlayProps) {
  const boundaries = dataset.boundaries ?? [];
  const hoveredBoundaryId = useMapStore((s) => s.hoveredBoundaryId);
  const selectedBoundaryId = useMapStore((s) => s.selectedBoundaryId);
  const setHoveredBoundary = useMapStore((s) => s.setHoveredBoundary);
  const setSelectedBoundary = useMapStore((s) => s.setSelectedBoundary);
  const openBoundaryModal = useUiStore((s) => s.openBoundaryModal);
  const visibleLayers = useMapStore((s) => s.visibleLayers);

  // Solo boundaries del map level corrente
  const levelBoundaries = useMemo(
    () => boundaries.filter((b) => b.mapLevelId === level.id),
    [boundaries, level.id],
  );

  if (!visibleLayers.boundaries || levelBoundaries.length === 0) {
    return null;
  }

  function handleClick(b: MapBoundary) {
    setSelectedBoundary(b.id);
    openBoundaryModal(b.id);
  }

  return (
    <svg
      viewBox={`0 0 ${level.width} ${level.height}`}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
      aria-label="Confini delle nazioni"
    >
      {levelBoundaries.map((b) => (
        <MapRegionPath
          key={b.id}
          boundary={b}
          hovered={b.id === hoveredBoundaryId}
          selected={b.id === selectedBoundaryId}
          onClick={handleClick}
          onHoverChange={(boundary) =>
            setHoveredBoundary(boundary ? boundary.id : null)
          }
        />
      ))}
    </svg>
  );
}
