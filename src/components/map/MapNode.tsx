import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { cn } from '@/lib/cn';
import { LOCATION_TYPE_ICON } from '@/lib/locationTypes';
import type { Importance, LocationType } from '@/types';

export interface MapNodeData {
  label: string;
  type: LocationType;
  importance: Importance;
  selected?: boolean;
  highlighted?: boolean;
  hasSubMap?: boolean;
  [key: string]: unknown;
}

const IMPORTANCE_SIZE: Record<Importance, string> = {
  main: 'w-4 h-4',
  secondary: 'w-3.5 h-3.5',
  minor: 'w-2.5 h-2.5',
};

const IMPORTANCE_TEXT: Record<Importance, string> = {
  main: 'text-sm font-semibold',
  secondary: 'text-xs font-medium',
  minor: 'text-[10px] font-medium',
};

/** Raggio (px) del pallino per importanza: serve ad ancorarne il centro. */
const IMPORTANCE_DOT_RADIUS: Record<Importance, number> = {
  main: 8,
  secondary: 7,
  minor: 5,
};

function MapNodeBase({ data }: NodeProps) {
  const d = data as MapNodeData;
  // React Flow posiziona il nodo dal suo angolo in alto a sinistra. Per far
  // combaciare il CENTRO del pallino con la coordinata (loc.x, loc.y) — quindi
  // con il puntino rosso della mappa — trasliamo la riga di mezza altezza e di
  // mezzo pallino in orizzontale.
  const dotRadius = IMPORTANCE_DOT_RADIUS[d.importance];
  return (
    <div
      className={cn(
        'group relative flex items-center gap-2 cursor-pointer select-none',
        d.highlighted && 'drop-shadow-[0_0_8px_rgba(255,131,17,0.7)]',
      )}
      style={{ transform: `translate(${-dotRadius}px, -50%)` }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!opacity-0 !pointer-events-none"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!opacity-0 !pointer-events-none"
      />
      <span
        className={cn(
          'rounded-full ring-2 transition',
          IMPORTANCE_SIZE[d.importance],
          d.selected
            ? 'bg-ember-400 ring-ember-200 shadow-ember'
            : d.highlighted
              ? 'bg-ember-500 ring-ember-300/70'
              : 'bg-chakra-400 ring-chakra-200/40 group-hover:ring-chakra-200',
        )}
        aria-hidden
      />
      <span
        className={cn(
          'whitespace-nowrap px-2 py-0.5 rounded-md backdrop-blur-sm border transition',
          IMPORTANCE_TEXT[d.importance],
          d.selected
            ? 'bg-ember-900/80 border-ember-500/70 text-ember-100'
            : d.highlighted
              ? 'bg-ember-900/40 border-ember-600/50 text-ember-100'
              : 'bg-ink-900/80 border-ink-600/60 text-ink-100 group-hover:border-chakra-500/60',
        )}
      >
        <span className="mr-1 text-chakra-300" aria-hidden>
          {LOCATION_TYPE_ICON[d.type]}
        </span>
        {d.label}
        {d.hasSubMap && (
          <span
            className="ml-1.5 text-[10px] text-scroll-200 font-mono"
            aria-label="ha una sottomappa esplorabile"
          >
            ⤢
          </span>
        )}
      </span>
    </div>
  );
}

export const MapNode = memo(MapNodeBase);

/**
 * Nodo "layer" che rende un'arbitraria slice JSX (SVG di sfondo, overlay
 * boundary, layer di labels) nello spazio coordinate React Flow.
 * - non draggable, non selectable, non zIndex-bound interattivo
 * - posizionato dal dataset
 */
export interface MapLayerNodeData {
  width: number;
  height: number;
  content: React.ReactNode;
  /** Z-index relativo a React Flow node container */
  z?: number;
  [key: string]: unknown;
}

function MapLayerNodeBase({ data }: NodeProps) {
  const d = data as MapLayerNodeData;
  // IMPORTANTE: pointer-events: none su tutto il container e sui figli,
  // così il pan/zoom di React Flow riceve gli eventi quando il cursore
  // è sull'SVG di sfondo. I singoli `<path>` cliccabili (boundary)
  // riattivano `pointer-events: auto` localmente.
  return (
    <div
      style={{
        width: d.width,
        height: d.height,
        pointerEvents: 'none',
        zIndex: d.z ?? 0,
      }}
    >
      {d.content}
    </div>
  );
}

export const MapLayerNode = memo(MapLayerNodeBase);
