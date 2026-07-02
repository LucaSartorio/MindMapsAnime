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
 * Separa i pin (quasi) sovrapposti disponendoli su un piccolo cerchio attorno
 * al loro baricentro, così a zoom alto sono distinti e cliccabili.
 *
 * Alcuni luoghi hanno coordinate quasi identiche (es. in One Piece
 * Cocoyashi/Arlong Park distano ~3 unità): senza questo, a zoom massimo
 * resterebbero impilati e impossibili da separare. Lo scostamento è minimo
 * (pochi punti su un piano di migliaia) e deterministico (ordine per id), NON
 * modifica i dati sorgente e scala a qualsiasi mondo senza ritocchi manuali.
 */
export function spreadOverlappingPins(
  locations: Location[],
  mergeDist = 12,
  radius = 16,
): Location[] {
  if (locations.length < 2) return locations;
  const used = new Set<number>();
  const result: Location[] = [];
  for (let i = 0; i < locations.length; i++) {
    if (used.has(i)) continue;
    const group = [locations[i]];
    used.add(i);
    for (let j = i + 1; j < locations.length; j++) {
      if (used.has(j)) continue;
      if (Math.hypot(locations[j].x - locations[i].x, locations[j].y - locations[i].y) <= mergeDist) {
        group.push(locations[j]);
        used.add(j);
      }
    }
    if (group.length === 1) {
      result.push(group[0]);
      continue;
    }
    const cx = group.reduce((s, l) => s + l.x, 0) / group.length;
    const cy = group.reduce((s, l) => s + l.y, 0) / group.length;
    // Raggio che garantisce distanza adiacente sufficiente anche con molti membri.
    const r = Math.max(radius, 15 / Math.sin(Math.PI / group.length));
    [...group]
      .sort((a, b) => a.id.localeCompare(b.id))
      .forEach((loc, k) => {
        const angle = (2 * Math.PI * k) / group.length - Math.PI / 2;
        result.push({ ...loc, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
      });
  }
  return result;
}

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
