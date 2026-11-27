---
name: create-3d-location
description: Build, extend or optimize a procedural 3D explorable scene for an existing location (Three.js from code, no models), in resumable milestones with visual QA, budgets and gates. Use for "crea il 3D di <luogo>", "esplora in 3D <location>", "ottimizza la scena 3D", or to resume one.
argument-hint: <world> <location> [exterior|explorable|optimize|resume]
---

# 3D location: $ARGUMENTS

`$0` = world slug (`src/data/worlds.ts`), `$1` = location (dataset id `loc-…` or its slug), mode `$2`:
`exterior` (default: exterior + observation), `explorable` (interiors, walking, collisions), `optimize` (budgets
only), `resume` (continue from the ledger). Rules: `.claude/rules/explorer-3d.md`; reference: `docs/3D_EXPLORER.md`.
Never auto-run from `/enrich-anime-world`: 3D scenes are created only on explicit request.

## 0. Resume or start (cheap, deterministic)
- Scene id = `<world>-<location-slug>`. Ledger `docs/explorer3d/<scene-id>.md` (template in
  `docs/explorer3d/README.md`). If it exists, read it: milestones done, sources, decisions, open issues, last
  measured numbers and the `state-fingerprint` they were taken at. If `node scripts/state-fingerprint.mjs` prints the
  same value, reuse those numbers instead of re-measuring; otherwise re-run only what the changed files affect.
- `npm run validate:3d` (registry state). Do not reread the whole engine: `docs/3D_EXPLORER.md` lists the primitives.

## 1. Identify the location (no new data for rendering)
`rg -n "id: '$1'" src/data/$0/` → the entity; note `characterIds`, `arcIds`, `eventIds`, events with
`locationId: '$1'`, factions with it in `locationIds`, `referenceStatus`. Hotspots may only use those ids. If a
link is missing in the dataset, stop and propose a data change (`anime-data-curator`), never patch it in the scene.

## 2. Sources & rights
Textual sources only (wiki/summary pages via WebSearch/WebFetch or the harness `web-fetch` agent; chapter/episode
references): shape, parts, colours, rooms. No images downloaded, traced or embedded. Record in the ledger what is
canon vs interpretive and why. The scene starts as `status: 'prototype'` with `provenance.rights:
'pending-owner-review'`; only the owner can approve `available`.

## 3. Scope & plan (5-10 lines in the ledger)
Exterior parts, interior zones (only documented rooms are `canon`), walkable areas, hotspot placement, target
budgets (`docs/3D_EXPLORER.md` §Budgets), reusable primitives vs genuinely new ones (new engine code only if no
primitive fits — then it must be world-agnostic and unit-tested if it is pure logic).

## 4. Build (delegate to `3d-world-engineer` when the iteration needs many screenshots; one agent per file set)
1. `worlds/$0/<location>/config.ts`: `definition` (seed, camera, bounds, zones with `reconstruction`, spawns,
   hotspots, provenance). 2. `scene.ts`: `build(ctx)` with batches, colliders from the same primitive calls,
   `details`, `interiors` (zone loading), `animate`. 3. Register: `launcher/manifests.ts` entry + flag-gated loader
   in `launcher/loaders.ts`. 4. `npm run validate:3d && npm run test:3d:unit && npx tsc -b`.

## 5. Visual QA (mandatory, iterate on evidence)
`npm run dev` → Playwright in the scratchpad: open the location scheda, click "Explore in 3D", capture hero, front,
side, rear, top and low angles + walking views of every zone (`window.__explorer3d.session` exists in prototype
builds). Check proportions, silhouette, materials, lighting, interior readability, interpenetrations, navigability.
Diagnose oddities with a raycast probe before changing code. Note each iteration in the ledger.

## 6. Exploration (`explorable`)
Walk every zone in `test:3d`-style probes: doors passable, walls block, stairs reach their landing, edges cannot be
crossed, spawns valid, reset works. Extend `scripts/test-3d.ts` only with checks that apply to every scene or add a
scene-specific block guarded by its id.

## 7. Optimize & measure (`optimize`)
`npm run test:3d` (flag-on full build + 28 scenarios) then `npm run benchmark:3d` (reuses it) and
`npm run benchmark:3d:bundle`: draw calls/triangles per level, scene chunk gzip, build ms, open ms. Over budget →
fewer curve segments on low, move props to `details`, merge batches, instance repeats, split interiors; never raise
a threshold. Record numbers + fingerprint in the ledger.

## 8. Close
`npm run claude:validate` if `.claude/` changed; `npm run smoke` (full prod build: proves the prototype is dropped
and ordinary pages request no 3D chunk). Update `docs/3D_EXPLORER.md` only for new reusable primitives or limits.
One commit per milestone. Report: STATUS, milestones done, files, numbers vs budgets, interpretive parts,
rights status, checks run/skipped, next milestone.

**Cloud vs local**: both run the same commands; Cloud has Chromium at `/opt/pw-browsers/chromium` (SwiftShader:
correctness and relative numbers only). Real-device FPS (phones, GPUs) can only be measured locally by the owner:
list it as a manual step.
