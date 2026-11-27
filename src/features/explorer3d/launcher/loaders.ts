import type { SceneModule } from '../engine/sceneModule';

/**
 * Build-time switch for `prototype` scenes, injected by `vite.config.ts` (`define`): true in `npm run dev` and in
 * builds with `VITE_EXPLORER_3D=1`, false in production builds. It is a literal after replacement, so Rollup drops
 * the dynamic `import()` of a disabled scene: its code is not even emitted in `dist/`.
 */
declare const __EXPLORER_3D_PROTOTYPES__: boolean;

type SceneLoader = () => Promise<SceneModule>;

/**
 * One lazy loader per scene id (`manifests.ts`). A `prototype` scene's loader MUST be wrapped in
 * `__EXPLORER_3D_PROTOTYPES__ ? … : undefined`, an `available` one must not: `npm run validate:3d` checks this on
 * the syntax tree of this file. The `import()` here is the only path from the site to a scene's code.
 */
export const SCENE_LOADERS: Readonly<Record<string, SceneLoader | undefined>> = {
  // available (public): never gated. New scenes start as `__EXPLORER_3D_PROTOTYPES__ ? () => import(…) : undefined`.
  'onepiece-baratie': () => import('../worlds/onepiece/baratie/scene').then((m) => m.scene),
};
