import { useMemo } from 'react';
import type { MapLevel, WorldDataset } from '@/types';
import { useMapStore } from '@/store';

interface MapLabelsLayerProps {
  dataset: WorldDataset;
  level: MapLevel;
}

/**
 * Layer testuale (nomi delle nazioni) come SVG sovrapposto al background.
 * Le label sono posizionate dalle `labelPosition` dei boundary.
 *
 * Scalano insieme al background perché condividono lo stesso viewBox.
 * Non interferiscono con i pin di React Flow (z-index più basso).
 */
export function MapLabelsLayer({ dataset, level }: MapLabelsLayerProps) {
  const visibleLayers = useMapStore((s) => s.visibleLayers);
  const boundaries = dataset.boundaries ?? [];

  const levelBoundaries = useMemo(
    () => boundaries.filter((b) => b.mapLevelId === level.id),
    [boundaries, level.id],
  );

  if (!visibleLayers.nationLabels || levelBoundaries.length === 0) return null;

  return (
    <svg
      viewBox={`0 0 ${level.width} ${level.height}`}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full pointer-events-none"
      aria-hidden
    >
      {levelBoundaries.map((b) => {
        // priorità tipografica in base al tipo
        const isMain = b.type === 'great_nation';
        const fontSize = isMain ? 18 : 12;
        const color = b.color ?? '#b6bbcb';
        return (
          <g key={`label-${b.id}`}>
            {/* Pillola di sfondo per leggibilità */}
            <text
              x={b.labelPosition.x}
              y={b.labelPosition.y}
              textAnchor="middle"
              fontFamily="Cinzel, serif"
              fontSize={fontSize}
              fontWeight={isMain ? 700 : 500}
              fill="rgba(7,7,9,0.85)"
              stroke="rgba(7,7,9,0.85)"
              strokeWidth={4}
              strokeLinejoin="round"
              opacity={0.92}
            >
              {b.name}
            </text>
            <text
              x={b.labelPosition.x}
              y={b.labelPosition.y}
              textAnchor="middle"
              fontFamily="Cinzel, serif"
              fontSize={fontSize}
              fontWeight={isMain ? 700 : 500}
              fill={color}
              opacity={isMain ? 0.95 : 0.8}
            >
              {b.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
