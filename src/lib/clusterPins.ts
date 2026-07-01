import type { Location } from '@/types';

export interface PinCluster {
  /** Id nodo React Flow, prefisso `__cluster-` (ignorato dagli handler pin). */
  id: string;
  /** Centroide (coordinate mondo) su cui posizionare il badge. */
  x: number;
  y: number;
  count: number;
  /** Bounding box dei membri: usato per lo zoom-to-fit al click. */
  bbox: { x: number; y: number; width: number; height: number };
}

export type ClusterEntry =
  | { kind: 'pin'; location: Location }
  | { kind: 'cluster'; cluster: PinCluster };

/**
 * Clustering a griglia in spazio-mondo per ridurre il caos quando ci sono
 * molti pin ravvicinati.
 *
 * La dimensione della cella è `targetPx / zoom`: a zoom basso le celle sono
 * grandi (i pin vicini si fondono in un cluster con conteggio), a zoom alto
 * ogni pin torna singolo. Essendo ancorata a (0,0) in coordinate mondo, la
 * clusterizzazione dipende solo dallo zoom, non dal pan → niente ricalcoli
 * mentre si trascina la mappa.
 *
 * `keepIds` resta sempre come pin singoli (luogo selezionato, tappe del
 * percorso attivo) così la scheda aperta e gli archi del percorso non
 * "spariscono" dentro un cluster.
 */
export function clusterLocations(
  locations: Location[],
  zoom: number,
  keepIds: Set<string>,
  targetPx = 54,
): ClusterEntry[] {
  const cell = targetPx / Math.max(zoom, 0.001);
  const cells = new Map<string, Location[]>();
  const out: ClusterEntry[] = [];

  for (const loc of locations) {
    if (keepIds.has(loc.id)) {
      out.push({ kind: 'pin', location: loc });
      continue;
    }
    const key = `${Math.floor(loc.x / cell)}:${Math.floor(loc.y / cell)}`;
    const arr = cells.get(key);
    if (arr) arr.push(loc);
    else cells.set(key, [loc]);
  }

  for (const [key, members] of cells) {
    if (members.length === 1) {
      out.push({ kind: 'pin', location: members[0] });
      continue;
    }
    let sx = 0;
    let sy = 0;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const m of members) {
      sx += m.x;
      sy += m.y;
      if (m.x < minX) minX = m.x;
      if (m.y < minY) minY = m.y;
      if (m.x > maxX) maxX = m.x;
      if (m.y > maxY) maxY = m.y;
    }
    const n = members.length;
    out.push({
      kind: 'cluster',
      cluster: {
        id: `__cluster-${key}`,
        x: sx / n,
        y: sy / n,
        count: n,
        bbox: {
          x: minX,
          y: minY,
          width: Math.max(maxX - minX, 1),
          height: Math.max(maxY - minY, 1),
        },
      },
    });
  }

  return out;
}
