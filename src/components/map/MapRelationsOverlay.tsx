import type { Location } from '@/types';

interface MapRelationsOverlayProps {
  level: { width: number; height: number };
  /** Luogo selezionato: origine dei connettori. */
  fromId: string;
  /** Id dei luoghi collegati (dal knowledge graph). */
  relatedIds: Set<string>;
  /** Luoghi renderizzati (coordinate già "spread"). */
  locations: Location[];
}

/** Massimo di connettori: contestuale e leggibile, mai una ragnatela globale. */
const MAX_CONNECTORS = 12;

/**
 * Overlay delle relazioni CONTESTUALI: quando un luogo è selezionato, disegna
 * connettori sottili verso i luoghi collegati (stesso arco / personaggi / rotta,
 * dal `worldGraph`). Rafforza il focus-dimming già attivo. Non interattivo,
 * `aria-hidden` (indizio visivo; l'accesso ai collegamenti è nella scheda).
 */
export function MapRelationsOverlay({
  level,
  fromId,
  relatedIds,
  locations,
}: MapRelationsOverlayProps) {
  const from = locations.find((l) => l.id === fromId);
  if (!from) return null;
  const targets = locations
    .filter((l) => l.id !== fromId && relatedIds.has(l.id))
    .slice(0, MAX_CONNECTORS);
  if (targets.length === 0) return null;

  return (
    <svg
      width={level.width}
      height={level.height}
      viewBox={`0 0 ${level.width} ${level.height}`}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}
      aria-hidden
    >
      <g>
        {targets.map((t) => (
          <line
            key={t.id}
            x1={from.x}
            y1={from.y}
            x2={t.x}
            y2={t.y}
            stroke="rgba(76,182,255,0.4)"
            strokeWidth={1.4}
            strokeDasharray="5 6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
    </svg>
  );
}
