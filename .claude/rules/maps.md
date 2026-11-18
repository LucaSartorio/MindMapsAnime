---
paths:
  - "src/components/map/**"
  - "src/components/timeline/**"
  - "src/components/tournaments/**"
  - "src/components/filters/**"
  - "src/components/drawers/**"
  - "src/lib/{clusterPins,locationTypes,mapMarkers,mapMode,mapSelectors,mapViewport,worldMapPrefs,storyMoment,filters,tournaments}.ts"
  - "src/data/*/{mapLevels,mapConstants,boundaries,markerTags,tournaments}.ts"
  - "src/data/*/locations*.ts"
  - "src/data/originalMapAssets.ts"
  - "src/pages/WorldMapPage.tsx"
  - "src/pages/seo/MapGuide.tsx"
  - "scripts/mapgen/**"
  - "scripts/*.py"
  - "scripts/{extract-boundaries,find-red-dots,hxh-extract-boundaries,hxh-overlay,optimize-hxh-map,onepiece-pins,image-size,optimize-images}.ts"
---

# Maps — constraints

How it works: `docs/ARCHITECTURE.md` › Maps. Shared map code is world-agnostic: per-world behaviour comes from data or
config (`worldMapPrefs`, `WorldConfig.mapMarkers`, `presentLocationTypes`), never `if (world.slug === …)`.

- **Composition**: layer nodes (`__layer-` ids, `pointer-events: none`, negative zIndex — click handlers ignore them),
  one `MapNode` pin per visible location, `MapClusterNode`. Pins and clusters counter-scale by `1/zoom` (quantized
  zoom from `useStore`); React Flow wrappers stay `pointer-events:none !important` and only the visible content is
  clickable (the a11y audit clicks it).
- **Colour is never the only cue** (`LOCATION_TYPE_COLOR` + type icon + label); selected/highlighted/poneglyph/marked
  states override it; the legend uses the same swatches and its rows are `aria-pressed` filters on `filters.locationTypes`.
- **Clustering** (`clusterPins.ts`): world-space grid recomputed on zoom only; the selected pin and active route
  steps are never clustered; clusters dissolve above `CLUSTER_OFF_ZOOM` (2.6); click = `fitBounds`; near-coincident
  pins are nudged by `spreadOverlappingPins` (deterministic, tiny).
- **Coordinates**: each map level has its own plane = `MapLevel.width/height` (`src/data/<world>/mapConstants.ts`);
  `x/y`, boundary `svgPathD`, `labelPosition` use it. Replacing an image keeps the viewBox or every pin breaks.
  Naruto PNG 990×579 → `flowX = px/990*1500`, `flowY = py/579*882.2204`; the PNG scripts (`npm run find:dots`,
  `npm run extract:boundaries`) already emit flow coordinates. Per-world tooling outside npm: `hxh-extract-boundaries`,
  `hxh-overlay`, `optimize-hxh-map`, `onepiece-pins.ts`, `onepiece-*.py` (run `.ts` with `tsx --tsconfig scripts/tsconfig.json`).
- **Generated maps**: every level has an image. Original SVGs come from `python3 scripts/mapgen/<world>.py` (shared
  `kit.py`; Bleach `scripts/bleach-maps.py`), which also rewrite pin `x/y` (`apply_pins`): move a pin by editing the
  generator and re-running it, never by hand. Deterministic (fixed seeds, `<use>` symbols, ≤ ~280 KB);
  `PREVIEW_DIR=<dir>` writes an HTML preview. Never download or trace official maps.
- **Markers** are views on events tagged `eventTag` (tags in `markerTags.ts` via `withEventTags`): a new marker = config
  entry + tags, no component edit. **Story moment** (`filters.untilArcId`) and all filters apply in
  `filterLocations`/`filterEvents`, so pins, count and timeline agree.
- **Narrative modes** (focus, route stepper, story mode, timeline playback) drive the shared store
  (`selectedLocation/Route/TimelineEvent`), never React Flow from a modal; the timeline stays filter-free and its
  playback list does not depend on `selectedLocationId`. Opening a location scheda syncs `selectedLocation`.
- **Tournaments**: `format: 'bracket'` halves the matches each round (`validate:data` checks it).

Checks: `npx tsc -b`; `npm run validate:data` after coordinate/data changes; `npm run smoke` (includes the full build); for an
engine change look at worlds with different maps (Naruto PNG, One Piece, a generated SVG world); generator preview.
