import { useMemo } from 'react';
import type { MapLevel, WorldDataset } from '@/types';
import { useMapStore } from '@/store';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';

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
  const locale = useLocaleStore((s) => s.locale);
  const boundaries = dataset.boundaries ?? [];

  const levelBoundaries = useMemo(
    () => boundaries.filter((b) => b.mapLevelId === level.id),
    [boundaries, level.id],
  );

  // Fallback per i mondi senza boundary (es. One Piece): nomi delle nazioni/mari
  // posizionati via `nation.labelPosition`. Solo sul livello world (top).
  const nationLabels = useMemo(
    () =>
      level.parentLevelId
        ? []
        : dataset.nations.filter((n) => n.labelPosition),
    [dataset.nations, level.parentLevelId],
  );

  if (
    !visibleLayers.nationLabels ||
    (levelBoundaries.length === 0 && nationLabels.length === 0)
  )
    return null;

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
        const label = getLocalizedText(b.localizedName, locale) || b.name;
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
              {label}
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
              {label}
            </text>
          </g>
        );
      })}
      {nationLabels.map((n) => {
        const pos = n.labelPosition!;
        const label = getLocalizedText(n.localizedName, locale) || n.name;
        const color = n.color ?? '#cdd3e3';
        return (
          <g key={`nation-label-${n.id}`}>
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              fontFamily="Cinzel, serif"
              fontSize={20}
              fontWeight={700}
              fill="rgba(7,7,9,0.85)"
              stroke="rgba(7,7,9,0.85)"
              strokeWidth={5}
              strokeLinejoin="round"
              opacity={0.92}
            >
              {label}
            </text>
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              fontFamily="Cinzel, serif"
              fontSize={20}
              fontWeight={700}
              fill={color}
              opacity={0.95}
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
