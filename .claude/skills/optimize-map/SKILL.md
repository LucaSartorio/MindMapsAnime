---
name: optimize-map
description: Improve a world map or the map engine: pin collisions, clustering, zoom, sub-maps, legend/filters, routes, mobile, rendering performance. Use for "migliora la mappa di <anime>", "pins overlap", "map is slow".
argument-hint: <world|all> [map level id | issue]
---

# Optimize map: $ARGUMENTS

Owner: `map-engineer` (read `.claude/rules/maps.md`). Shared map code stays world-agnostic. Scope: the React Flow
maps only — 3D scenes of a location are `/create-3d-location` (`src/features/explorer3d`), never map code.

1. **Diagnose with facts**
   - Data: `npm run validate:data` (out-of-range coordinates), `npm run data:coverage -- $0` (places without events/
     arcs, gateway pins), map levels and viewBox in `src/data/<slug>/{mapLevels,mapConstants}.ts`.
   - Collisions: list pins of the level closer than ~1 % of the viewBox (quick `tsx` one-off in the scratchpad, not
     committed) and check `spreadOverlappingPins` / `CLUSTER_OFF_ZOOM` behaviour.
   - Rendering/perf: reproduce in `npm run smoke` or a Playwright script (scratchpad) on `/en/<urlSlug>/map`;
     measure before changing (render count, interaction latency, bundle chunk of the map route).
2. **Classify the fix**: data (coordinates → edit `scripts/mapgen/<slug>.py` pins and re-run it, never hand-edit
   generated coordinates) · map art (generator) · engine (shared component/lib) · config (`worldMapPrefs`,
   `WorldConfig.mapMarkers`).
3. **Implement** the smallest change; for engine changes check at least two other worlds with different maps
   (e.g. Naruto PNG + One Piece SVG + Bleach generated).
4. **Verify**: `npx tsc -b`, `npm run validate:data`, then `npm run smoke` (it runs the full build first: no separate
   `npm run build`); for generators open the
   `PREVIEW_DIR` HTML; compare before/after numbers when the goal was performance.
5. **Report**: problem → cause → fix → evidence (screens/metrics) → worlds checked → residual issues.
