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
 *
 * IMPORTANTE: la world map di base (PNG) disegna già i confini visibili.
 * Questo overlay quindi è INVISIBILE di default (fill/stroke trasparenti)
 * e mostra un highlight solo su hover/selezione. Resta cliccabile grazie a
 * `pointer-events: all`, che cattura il click anche sull'area non dipinta.
 */
function MapRegionPathBase({
  boundary,
  hovered,
  selected,
  onClick,
  onHoverChange,
}: MapRegionPathProps) {
  const color = boundary.color ?? '#1f9aff';
  // Default invisibile; highlight solo su hover/selezione per non sovrapporsi
  // ai confini già presenti nel PNG.
  const fillOpacity = selected ? 0.25 : hovered ? 0.15 : 0;
  const strokeOpacity = selected ? 0.95 : hovered ? 0.7 : 0;
  const strokeWidth = selected ? 2.5 : hovered ? 2 : 0;

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${boundary.name} (${boundary.type.replace('_', ' ')})`}
      className="cursor-pointer outline-none"
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
          transition: 'fill-opacity 160ms ease-out, stroke-opacity 160ms ease-out',
          // `all` cattura il click sull'intera area del path anche quando
          // è trasparente (a differenza di `auto`/`visiblePainted`).
          pointerEvents: 'all',
        }}
      />
    </g>
  );
}

export const MapRegionPath = memo(MapRegionPathBase);
