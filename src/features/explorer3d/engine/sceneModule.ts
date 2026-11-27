import type { Object3D, Vector3 } from 'three';
import type { QualityLevel, SceneDefinition } from '../types';
import type { FloorRect, WallBox } from './collision';
import type { QualitySettings } from './quality';
import type { ResourceTracker } from './resources';
import type { MaterialKit } from '../materials/toon';

/** What a scene builder receives: every resource it creates must go through `tracker`. */
export interface BuildContext {
  level: QualityLevel;
  quality: QualitySettings;
  tracker: ResourceTracker;
  materials: MaterialKit;
  /** Seeded PRNG (`SceneDefinition.seed`). */
  random: () => number;
  reducedMotion: boolean;
  /** Display name of the location in the UI language (from the dataset, never hardcoded in the scene). */
  locationName: string;
}

export interface ColliderSet {
  floors: FloorRect[];
  walls: WallBox[];
}

/** A zone group built on demand (interiors): generated the first time it is needed, disposed with the session. */
export interface ZoneBuild {
  object: Object3D;
  colliders: ColliderSet;
}

export interface SceneBuild {
  /** Always-present content (exterior + environment). */
  root: Object3D;
  colliders: ColliderSet;
  /**
   * Small props hidden beyond `quality.detailDistance` from the camera (and on `low` they may be omitted when
   * building). Checked once per rendered frame at group level — not per object.
   */
  details: Array<{ object: Object3D; center: Vector3 }>;
  /**
   * Lazily built interiors, keyed by a group id: `build` runs the first time the player walks within a few metres
   * of one of `zones` (zone loading), never in observation mode.
   */
  interiors: Record<string, { zones: string[]; build: () => ZoneBuild }>;
  /** Per-frame hooks (water, flags). Called only on rendered frames. */
  animate: Array<(timeSeconds: number) => void>;
  /** Directional sun: the renderer updates its shadow when the quality preset changes. */
  sunDirection: Vector3;
}

export interface SceneModule {
  definition: SceneDefinition;
  build(ctx: BuildContext): SceneBuild;
}
