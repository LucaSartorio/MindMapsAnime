/**
 * Contract of the 3D explorer (types only — importing this file never pulls three.js).
 *
 * A scene is split in three layers, each with one responsibility:
 *  - `SceneManifest` (launcher/manifests.ts): which location has a scene and whether it is public. Ships in the
 *    ordinary bundle, so it must stay tiny and three-free.
 *  - `SceneDefinition` (worlds/<world>/<location>/config.ts): typed DATA — camera, spawns, zones, hotspots,
 *    provenance. No geometry, no narrative text (hotspots point at dataset ids; labels come from the dataset).
 *  - `SceneModule` (worlds/<world>/<location>/scene.ts): the procedural builder, loaded on demand.
 */
import type { EntityRef } from '@/lib/graph';

export type Vec3 = readonly [number, number, number];

/** `prototype` = only in builds with `VITE_EXPLORER_3D=1` (and `npm run dev`); `available` = public. */
export type SceneStatus = 'prototype' | 'available';

export interface SceneManifest {
  /** Stable scene id, `<world-slug>-<location-slug>`. */
  id: string;
  /** `WorldConfig`/dataset world id (e.g. `world-onepiece`). */
  worldId: string;
  /** Existing location id in that dataset. */
  locationId: string;
  status: SceneStatus;
}

export type QualityLevel = 'low' | 'medium' | 'high';
export type QualityPreference = 'auto' | QualityLevel;

/** Generic architectural zone kinds: their labels are UI keys (`explorer3d.zoneKinds.*`), reusable by any scene. */
export type ZoneKind =
  | 'exterior'
  | 'deck'
  | 'bow'
  | 'stern'
  | 'finDeck'
  | 'terrace'
  | 'diningHall'
  | 'kitchen'
  | 'corridor'
  | 'stairs'
  | 'upperFloor';

/**
 * `canon` = the element is shown in the work (shape may still be stylized);
 * `interpretive` = not documented in the work: an explicit reconstruction, labelled as such in the UI.
 */
export type ReconstructionStatus = 'canon' | 'interpretive';

/** Axis-aligned box in scene units (metres): [minX, minY, minZ] → [maxX, maxY, maxZ]. */
export interface Box3Def {
  min: Vec3;
  max: Vec3;
}

export interface ZoneDef {
  id: string;
  kind: ZoneKind;
  /** Exterior zones exist from the first frame; interior zones are generated on first entry (zone loading). */
  interior: boolean;
  reconstruction: ReconstructionStatus;
  /** Used for "which zone am I in" and to decide which interior groups are visible. */
  bounds: Box3Def;
}

export interface SpawnDef {
  id: string;
  zone: string;
  /** Feet position. */
  position: Vec3;
  /** Heading in radians (0 = looking towards -Z, rotating counter-clockwise seen from above). */
  yaw: number;
}

/** Entity types a hotspot may open: the ones the existing schede (modals) handle. */
export type HotspotEntityType = Extract<EntityRef['type'], 'character' | 'event' | 'arc' | 'place' | 'faction'>;

export interface HotspotDef {
  id: string;
  /** Dataset entity opened through the existing `useOpenEntityRef` dispatcher. Never duplicated text. */
  entity: { type: HotspotEntityType; id: string };
  position: Vec3;
  zone: string;
}

export interface SourceRef {
  kind: 'manga' | 'anime' | 'reference';
  /** Short citation (chapter/episode range, page title): no copied prose. */
  label: string;
  url?: string;
}

export interface ProvenanceDef {
  /** Always `procedural`: no imported model, no downloaded texture, no traced artwork. */
  method: 'procedural';
  author: string;
  license: string;
  sources: SourceRef[];
  /** Rights review of distributing this reconstruction: `available` scenes require `cleared`. */
  rights: 'pending-owner-review' | 'cleared';
  /** Free-form notes (English, for maintainers): which parts are interpretive and why. */
  notes: string[];
}

export interface CameraDef {
  position: Vec3;
  target: Vec3;
  minDistance: number;
  maxDistance: number;
}

export interface SceneDefinition {
  id: string;
  worldId: string;
  locationId: string;
  /** Scene seed: every pseudo-random choice in the builder derives from it (deterministic output). */
  seed: number;
  camera: CameraDef;
  /** Hard limits of the walkable/visible world (camera and player are clamped inside). */
  bounds: Box3Def;
  zones: ZoneDef[];
  spawns: SpawnDef[];
  /** Spawn used when entering exploration mode or resetting the position. */
  defaultSpawn: string;
  hotspots: HotspotDef[];
  provenance: ProvenanceDef;
}
