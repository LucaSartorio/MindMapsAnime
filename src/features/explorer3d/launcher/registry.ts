import type { SceneManifest } from '../types';
import { SCENE_MANIFESTS } from './manifests';
import { SCENE_LOADERS } from './loaders';

/** The enabled scene of a location, or `undefined` (no scene, or a prototype in a production build). */
export function findLocationScene(worldId: string, locationId: string): SceneManifest | undefined {
  return SCENE_MANIFESTS.find(
    (m) => m.worldId === worldId && m.locationId === locationId && SCENE_LOADERS[m.id] !== undefined,
  );
}

export function findSceneById(id: string): SceneManifest | undefined {
  return SCENE_MANIFESTS.find((m) => m.id === id && SCENE_LOADERS[m.id] !== undefined);
}

/**
 * Cheap WebGL capability probe, run on click BEFORE downloading the 3D chunks (so a device without WebGL never pays
 * for them). Browser-only: never call it during render.
 */
export function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}
