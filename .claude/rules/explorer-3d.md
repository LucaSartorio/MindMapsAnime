---
paths:
  - "src/features/explorer3d/**"
  - "scripts/{validate-3d,test-3d,test-3d-units,explorer3d-lab}.ts"
  - "scripts/explorer3d-bundle-report.mjs"
  - "scripts/vite/explorer3dGuard.ts"
  - "docs/3D_EXPLORER.md"
  - "docs/explorer3d/**"
---

# 3D explorer — constraints

How it works, budgets, how to add a location: `docs/3D_EXPLORER.md`. Procedure: `/create-3d-location`.

- **Procedural only**: geometry, materials and textures come from TypeScript (`primitives/`, canvas/data textures).
  No glb/gltf/fbx/obj, no downloaded or traced artwork/textures, no three.js loaders, no remote URL, no AI-generated
  models. `validate:3d` (repo + AST) and the build guard (emitted files) enforce it.
- **Isolation**: ordinary code imports only `src/features/explorer3d/launcher/**` and `types.ts`; everything else
  (engine, viewer, primitives, scenes, `three`) is reached only through the `import()` in `launcher/`. Never add a
  static import, a preload/prefetch, an idle/hover prefetch or an SSR path to it. Gates: `validate:3d` (sources) +
  build guard (chunk graph, fails `vite build`) + `test:3d` / smoke (no 3D request on ordinary pages).
- **Launcher stays tiny and three-free**; `manifests.ts` is metadata only. A `prototype` loader is wrapped in
  `__EXPLORER_3D_PROTOTYPES__ ? … : undefined` (production drops its code); `available` needs owner approval,
  `provenance.rights: 'cleared'` and a public world.
- **World-agnostic engine**: no world/location names, ids or colours in `engine/`, `primitives/`, `materials/`,
  `viewer/`; per-scene data lives in `worlds/<world>/<location>/config.ts`, geometry in `scene.ts`.
- **No duplicated narrative**: hotspots reference existing dataset ids that the dataset already ties to the location
  (`validate:3d` checks); labels come from the dataset; zone names are generic `explorer3d.zoneKinds.*` keys;
  undocumented parts are `reconstruction: 'interpretive'` and listed in `provenance.notes`.
- **Resources**: every geometry/material/texture/light goes through the session `ResourceTracker`; shared objects are
  tracked once; `dispose()` stops the loop, removes listeners, frees GPU memory and loses the context. No
  per-frame allocations or React state updates; render on demand; interiors built on zone entry.
- **Budgets** (docs/3D_EXPLORER.md §Budgets): never raise a threshold to pass — document the deviation and measure.
- **SSR/a11y/i18n**: no `window`/`document`/WebGL outside effects or click handlers; viewer is a modal dialog with
  focus, Esc, an accessible hotspot list (the non-WebGL path), `prefers-reduced-motion`, touch joystick and safe
  areas; every string in the six `src/i18n/resources/*.ts`.

Checks: `npm run validate:3d` · `npm run test:3d:unit` · `npx tsc -b` → `npm run test:3d` (flag-on build + browser,
visual changes also need screenshots from several angles) → `npm run smoke` before delivery.
