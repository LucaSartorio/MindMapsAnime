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
 * Singolo path SVG di una nazione/regione.
 *
 * IMPORTANTE: la world map di base (PNG) disegna già i confini visibili.
 * Questo overlay è INVISIBILE di default e mostra un highlight solo su
 * hover/selezione, per non sovrapporsi ai confini già presenti nel PNG.
 *
 * Due comportamenti a seconda del tipo:
 * - GRANDI NAZIONI (`great_nation`): l'intera area è cliccabile
 *   (`pointer-events: all`) e apre la scheda della nazione; l'hover sull'area
 *   evidenzia il confine.
 * - REGIONI MINORI: il path è puramente visivo (`pointer-events: none`) e si
 *   rivela SOLO quando si passa sopra il suo punto di interesse (l'hover del
 *   pin imposta `hoveredBoundaryId` nello store) o quando è selezionato.
 */
function MapRegionPathBase({
  boundary,
  hovered,
  selected,
  onClick,
  onHoverChange,
}: MapRegionPathProps) {
  const color = boundary.color ?? '#1f9aff';
  const isGreat = boundary.type === 'great_nation';
  // Default invisibile; highlight solo su hover/selezione.
  const fillOpacity = selected ? 0.25 : hovered ? 0.18 : 0;
  const strokeOpacity = selected ? 0.95 : hovered ? 0.75 : 0;
  const strokeWidth = selected ? 2.5 : hovered ? 2 : 0;

  const path = (
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
        // Grandi nazioni: `all` cattura il click sull'intera area anche se
        // trasparente. Minori: `none`, così il pin sottostante resta hoverabile
        // e il confine non intercetta il puntatore.
        pointerEvents: isGreat ? 'all' : 'none',
      }}
    />
  );

  if (!isGreat) {
    return <g aria-hidden>{path}</g>;
  }

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
      {path}
    </g>
  );
}

export const MapRegionPath = memo(MapRegionPathBase);
