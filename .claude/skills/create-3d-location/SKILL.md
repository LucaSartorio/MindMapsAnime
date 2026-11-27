---
name: create-3d-location
description: Build, extend, make more faithful or optimize a procedural 3D explorable scene for an existing location (Three.js from code, no models), reference-driven, in resumable milestones with screenshot iterations, budgets and gates. Use for "crea il 3D di <luogo>", "esplora in 3D <location>", "rendi il 3D più fedele", "ottimizza la scena 3D", or to resume one.
argument-hint: <world> <location> [exterior|explorable|fidelity|optimize|resume]
---

# 3D location: $ARGUMENTS

`$0` = world slug (`src/data/worlds.ts`), `$1` = location (dataset id `loc-…` or its slug), mode `$2`:
`exterior` (default: exterior + observation), `explorable` (interiors, walking, collisions), `fidelity` (make an
existing scene closer to the work: references → iterations → before/after), `optimize` (budgets only), `resume`
(continue from the ledger). Rules: `.claude/rules/explorer-3d.md`; reference: `docs/3D_EXPLORER.md`.
Never auto-run from `/enrich-anime-world`: 3D scenes are created only on explicit request.

## 0. Resume or start (cheap, deterministic)
- Scene id = `<world>-<location-slug>`. Ledger `docs/explorer3d/<scene-id>.md` (template in
  `docs/explorer3d/README.md`): milestones, references, decisions, open issues, last numbers and the
  `node scripts/state-fingerprint.mjs` value they were taken at (same value → reuse the numbers, else re-measure only
  what changed). `npm run validate:3d` for the registry state. Do not reread the engine: `docs/3D_EXPLORER.md`
  lists the primitives.

## 1. Identify the location (no new data for rendering)
`rg -n "id: '$1'" src/data/$0/` → the entity; note `characterIds`, `arcIds`, `eventIds`, events with
`locationId: '$1'`, factions with it in `locationIds`, `referenceStatus`. Hotspots may only use those ids. If a
link is missing in the dataset, stop and propose a data change (`anime-data-curator`), never patch it in the scene.

## 2. References & rights (all modes that create or reshape geometry)
- Priority: the original anime > the manga > official merchandise (model kits: stylized, compressed proportions,
  supplementary) > games/fan art (not used) > live action (excluded unless the owner asks). Owner-provided images
  are first-class references.
- Legitimately accessible only: pages and images served normally to a visitor or a crawler (search results, review
  sites, owner uploads). Never bypass a paywall, an anti-bot challenge, a login or a blocked page through another
  endpoint; if a source answers 402/403/challenge, drop it and ask the owner for images instead.
- Images are downloaded only to the scratchpad and only to be LOOKED at (Read). Never commit, embed, trace, sample
  colours pixel-by-pixel into textures, or ship them; the scene stays procedural code.
- Write a reference table in the ledger: source (URL or "owner"), what it shows, what was taken from it
  (silhouette, proportions, colours, layout), confidence. Mark what no reference shows as `interpretive`.
- Never claim a comparison with an image you could not open, and never give similarity percentages.
- Rights: a new scene is `status: 'prototype'`, `provenance.rights: 'pending-owner-review'`. Publishing only on
  the owner's explicit request: manifest `available`, ungated loader, `rights: 'owner-approved'` +
  `provenance.publication` (date, reference, unresolved questions) unless a verified clearance exists (`'cleared'`).

## 3. Scope & plan (5-10 lines in the ledger)
Element list from the references (exterior masses, signature details, palette, interior zones — only documented
rooms are `canon`), walkable areas, hotspot placement, target budgets (`docs/3D_EXPLORER.md` §Budgets), reusable
primitives vs genuinely new ones (new engine code only if no primitive fits — world-agnostic, unit-tested if pure).

## 4. Build (delegate to `3d-world-engineer` for screenshot-heavy iterations; one agent per file set)
1. `worlds/$0/<location>/config.ts`: plan constants (single source for builder, zones, spawns, tests),
   `definition` (seed, camera, bounds, zones with `reconstruction`/`footprint`, named spawns incl. one at the bottom of
   every stair flight, hotspots, provenance). 2. `scene.ts`: `build(ctx)` with batches, colliders from the same
   primitive calls, `details`, `interiors` (zone loading), `animate`. 3. Register in `launcher/manifests.ts` +
   flag-gated loader in `launcher/loaders.ts`. 4. `npm run validate:3d && npm run test:3d:unit && npx tsc -b`.

## 5. Visual QA loop (mandatory in exterior, explorable, fidelity)
`npm run dev`, then `npm run capture:3d -- <scene-id> --out <scratch>/itN --base http://localhost:5173` (fixed views:
hero, bow, side, rear, top, sea + one per spawn; prints draw calls/triangles). For each iteration: look at the
captures next to the references → list the 2-4 largest differences (silhouette and proportions first, then palette,
then details) → fix geometry/materials/lighting → recapture the same views → keep the change only if it is a visible
improvement without regressions. Probe oddities (raycast in the page) before changing code. Note each iteration
(what changed, why, evidence) in the ledger. Check `low` too (`--quality low`).

## 6. Exploration (`explorable`)
Walk every zone: doors passable, walls block, every stair flight reaches its level, edges cannot be crossed, spawns
valid, reset works. `scripts/test-3d.ts` derives its routes from the scene's config (spawn ids, levels): keep
them in sync there instead of hardcoding coordinates.

## 7. Fidelity (`fidelity`, on an existing scene)
1. Baseline captures BEFORE any change (`capture:3d … --out <scratch>/before`). 2. References (§2) and a
difference table (element → reference → current → planned change). 3. Iterate §5 until no concrete, sustainable
improvement remains (at least two rounds); rebuild proportions from the references instead of keeping values only
because they work. 4. `npm run capture:3d -- --compare-only <before> <after> --out <scratch>/cmp` → before/after
sheet for the report. 5. Re-run §8 numbers; update provenance notes and the ledger (references, canon vs
interpretive, iterations).

## 8. Optimize & measure (`optimize`, and closing every mode)
`npm run test:3d` (flag-on full build + browser scenarios) then `npm run benchmark:3d` (reuses it) and
`npm run benchmark:3d:bundle`: draw calls/triangles per level, scene chunk gzip, build ms, open ms. Over budget →
fewer curve segments on low, props to `details`, merge batches, instance repeats, split interiors; never raise a
threshold. Record numbers + fingerprint in the ledger.

## 9. Close
`npm run claude:validate` if `.claude/` changed; `npm run smoke` (full production build: public scenes open,
prototypes are dropped, ordinary pages request no 3D chunk). Update `docs/3D_EXPLORER.md` only for new reusable
primitives or limits. One commit per milestone. Report: STATUS, milestones, files, before/after sheet, numbers vs
budgets, references used and blocked, interpretive parts, rights status, checks run/skipped, next step.

**Cloud vs local**: same commands; Cloud has Chromium at `/opt/pw-browsers/chromium` (SwiftShader: correctness,
relative numbers and screenshots only). Real-device FPS (phones, GPUs) is a manual step for the owner.
