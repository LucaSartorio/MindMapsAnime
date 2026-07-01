import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

export interface MapClusterNodeData {
  count: number;
  bbox: { x: number; y: number; width: number; height: number };
  [key: string]: unknown;
}

/**
 * Marker "cluster": raggruppa N pin vicini in un badge col conteggio.
 * Cliccandolo si fa zoom sul bounding box dei membri (gestito nel canvas),
 * quindi il cluster si apre naturalmente nei singoli pin.
 */
function MapClusterNodeBase({ data }: NodeProps) {
  const d = data as MapClusterNodeData;
  const size = d.count >= 25 ? 42 : d.count >= 10 ? 34 : 28;
  return (
    <div
      className="grid cursor-pointer select-none place-items-center rounded-full border border-chakra-300/70 bg-ink-900/85 font-semibold text-chakra-50 shadow-panel backdrop-blur-sm transition hover:border-chakra-200 hover:bg-chakra-600/50"
      style={{
        width: size,
        height: size,
        transform: 'translate(-50%, -50%)',
        fontSize: size >= 34 ? 13 : 11,
      }}
      title={String(d.count)}
    >
      <Handle type="target" position={Position.Left} className="!pointer-events-none !opacity-0" />
      <Handle type="source" position={Position.Right} className="!pointer-events-none !opacity-0" />
      {d.count}
    </div>
  );
}

export const MapClusterNode = memo(MapClusterNodeBase);
