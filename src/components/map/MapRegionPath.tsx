import { memo } from 'react';
import type { MapBoundary } from '@/types';

interface MapRegionPathProps {
  boundary: MapBoundary;
  hovered?: boolean;
  selected?: boolean;
  onClick?: (boundary: MapBoundary) => void;
  onHoverChange?: (boundary: MapBoundary | null) => void;
}

/**
 * Singolo path SVG cliccabile per una nazione/regione.
 * - fill quasi trasparente per non oscurare la mappa sottostante
 * - stroke più visibile per indicare il bordo cliccabile
 * - hover / selected = riempimento più marcato
 */
function MapRegionPathBase({
  boundary,
  hovered,
  selected,
  onClick,
  onHoverChange,
}: MapRegionPathProps) {
  const color = boundary.color ?? '#1f9aff';
  // Calcolo opacità in base allo stato
  const fillOpacity = selected ? 0.32 : hovered ? 0.22 : 0.06;
  const strokeOpacity = selected ? 0.95 : hovered ? 0.85 : 0.45;
  const strokeWidth = selected ? 2.5 : hovered ? 2 : 1.4;

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${boundary.name} (${boundary.type.replace('_', ' ')})`}
      className="cursor-pointer outline-none focus-visible:opacity-100"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(boundary);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(boundary);
        }
      }}
      onMouseEnter={() => onHoverChange?.(boundary)}
      onMouseLeave={() => onHoverChange?.(null)}
      onFocus={() => onHoverChange?.(boundary)}
      onBlur={() => onHoverChange?.(null)}
    >
      <path
        d={boundary.svgPathD}
        fill={color}
        fillOpacity={fillOpacity}
        stroke={color}
        strokeOpacity={strokeOpacity}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        style={{
          transition: 'all 160ms ease-out',
          pointerEvents: 'auto',
        }}
      />
    </g>
  );
}

export const MapRegionPath = memo(MapRegionPathBase);
