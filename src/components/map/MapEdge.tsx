import { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';

export interface MapEdgeData {
  color?: string;
  label?: string;
  order?: number;
  [key: string]: unknown;
}

/** Edge curvo personalizzato per i percorsi narrativi. */
function MapEdgeBase(props: EdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    markerEnd,
  } = props;
  const d = (data ?? {}) as MapEdgeData;
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });
  const color = d.color ?? '#1f9aff';

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerEnd={markerEnd}
        style={{
          stroke: color,
          strokeWidth: 2.5,
          strokeDasharray: '6 4',
          filter: `drop-shadow(0 0 6px ${color}88)`,
        }}
      />
      {d.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="pointer-events-auto chip text-[10px] uppercase tracking-widest"
          >
            {d.order !== undefined && (
              <span className="text-ember-300 mr-1">#{d.order}</span>
            )}
            {d.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const MapEdge = memo(MapEdgeBase);
