import type { SceneManifest } from '../types';

/**
 * Registry of the 3D scenes (metadata only, ships in the ordinary bundle: keep it tiny and three-free).
 *
 * Adding a scene = one entry here + one loader in `loaders.ts` + the scene folder
 * `src/features/explorer3d/worlds/<world>/<location>/{config,scene}.ts` (see `/create-3d-location`).
 * `npm run validate:3d` checks ids, dataset references, hotspots, provenance and the loader/flag wiring.
 */
export const SCENE_MANIFESTS: readonly SceneManifest[] = [
  {
    id: 'onepiece-baratie',
    worldId: 'world-onepiece',
    locationId: 'loc-op-baratie',
    // Public since 2026-11-27 by owner decision; rights not verified (provenance.publication in its config.ts).
    status: 'available',
  },
];
