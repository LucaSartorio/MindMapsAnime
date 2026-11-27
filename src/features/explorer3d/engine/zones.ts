import type { SceneDefinition, ZoneDef } from '../types';
import type { Feet } from './collision';

/**
 * Zone containing the point: interior zones win over exterior ones (a room is inside the deck that surrounds it),
 * then the smallest volume. Elliptic footprints exclude the corners of their bounding box (oval rooms).
 */
export function zoneAt(def: SceneDefinition, p: Feet): ZoneDef | null {
  let best: ZoneDef | null = null;
  let bestKey = Infinity;
  for (const z of def.zones) {
    const { min, max } = z.bounds;
    if (p.x < min[0] || p.x > max[0] || p.y < min[1] - 0.2 || p.y > max[1] || p.z < min[2] || p.z > max[2]) continue;
    if (z.footprint === 'ellipse') {
      const ex = (p.x - (min[0] + max[0]) / 2) / ((max[0] - min[0]) / 2);
      const ez = (p.z - (min[2] + max[2]) / 2) / ((max[2] - min[2]) / 2);
      if (ex * ex + ez * ez > 1) continue;
    }
    const vol = (max[0] - min[0]) * (max[1] - min[1]) * (max[2] - min[2]);
    const key = (z.interior ? 0 : 1e12) + vol;
    if (key < bestKey) {
      best = z;
      bestKey = key;
    }
  }
  return best;
}
