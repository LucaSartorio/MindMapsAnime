import type { Location, MapLevel, WorldDataset } from '@/types';
import type { WorldPoint } from '../config/types';

/**
 * Projects any location onto the world-map plane.
 *
 * Sub-map locations (e.g. Naruto's "Uchiha District" on the Konoha sub-map)
 * have coordinates in their own sub-level viewBox: on the world map they live
 * at the pin that opens that sub-map (`MapLevel.triggerLocationId`). We walk up
 * `parentLevelId` until we reach the base level, exactly like the site's
 * drill-down works in reverse.
 */
export type ProjectedLocation = {
  /** The original location (may be on a sub-map). */
  location: Location;
  /** The location actually drawn on the world map (== location when already there). */
  anchor: Location;
  point: WorldPoint;
};

export function getBaseMapLevel(dataset: WorldDataset): MapLevel | undefined {
  const preferred = dataset.world.defaultMapLevelId;
  return (
    dataset.mapLevels.find((l) => l.id === preferred) ??
    dataset.mapLevels.find((l) => !l.parentLevelId) ??
    dataset.mapLevels[0]
  );
}

export function createProjector(dataset: WorldDataset) {
  const base = getBaseMapLevel(dataset);
  const locations = new Map(dataset.locations.map((l) => [l.id, l]));
  const levels = new Map(dataset.mapLevels.map((l) => [l.id, l]));

  return function project(locationId: string): ProjectedLocation | undefined {
    const location = locations.get(locationId);
    if (!location || !base) return undefined;
    let anchor: Location | undefined = location;
    const seen = new Set<string>();
    while (anchor && anchor.mapLevelId !== base.id) {
      if (seen.has(anchor.mapLevelId)) return undefined; // malformed level graph
      seen.add(anchor.mapLevelId);
      const level = levels.get(anchor.mapLevelId);
      anchor = level?.triggerLocationId ? locations.get(level.triggerLocationId) : undefined;
    }
    if (!anchor || !Number.isFinite(anchor.x) || !Number.isFinite(anchor.y)) return undefined;
    if (anchor.x < 0 || anchor.y < 0 || anchor.x > base.width || anchor.y > base.height) return undefined;
    return { location, anchor, point: { x: anchor.x, y: anchor.y } };
  };
}
