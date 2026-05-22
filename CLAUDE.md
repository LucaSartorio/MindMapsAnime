# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Anime Interactive Maps — a frontend-only SPA for exploring interactive anime/manga
maps (worlds, nations, villages, characters, arcs, timeline events, routes). Stack:
React 18 + TypeScript (strict) + Vite + Zustand + React Flow (`@xyflow/react`) +
Tailwind + React Router. **No backend, no database** — all content lives in local
TypeScript files under `src/data/`. Naruto is the only `available` world; Hunter x
Hunter is a `coming_soon` placeholder.

## Commands

```bash
npm run dev              # Vite dev server → http://localhost:5173
npm run build            # tsc -b && vite build  (the tsc step is the real correctness gate)
npm run preview          # serve the built bundle
npm run validate:data    # validate the Naruto dataset; exits 1 on integrity errors
npm run validate:i18n    # report missing/empty UI translations
npm run extract:boundaries  # regenerate nation boundary SVG paths from the world PNG
npm run find:dots        # detect the red village-marker dots in the world PNG, print flow coords
```

- **There is no test framework** and `npm run lint` (`eslint .`) has no eslint config or
  dependency installed — do not rely on it. After any change, the gate is `npx tsc -b`
  (or `npm run build`), plus `npm run validate:data` whenever you touch `src/data/`.
- The `scripts/*.ts` tools run under `tsx --tsconfig scripts/tsconfig.json` because they
  import `src/` via the `@/` alias. Use that invocation for any new script.
- Import alias: `@/` → `src/` (configured in both `vite.config.ts` and the tsconfigs).

## Architecture

### Multi-world dataset system
Each world is a single `WorldDataset` object (shape defined in `src/types/index.ts`):
`world`, `mapLevels`, `nations`, `boundaries`, `locations`, `characters`, `factions`,
`teams`, `arcs`, `events`, `routes`, `assets`. The flow is:

- `src/data/worlds.ts` — world metadata registry (`animeWorlds`), incl. `status` and theme.
- `src/data/<slug>/index.ts` — assembles and exports `<slug>Dataset: WorldDataset`. (Naruto's
  index merges `clans + factions` into `factions`, and `routes + characterRoutes` into `routes`.)
- `src/data/registry.ts` — `worldDatasets` map keyed by slug; `getWorldDataset(slug)` resolves it.
- `src/routes/WorldRoute.tsx` resolves the dataset from `:worldSlug`; `coming_soon` worlds render
  `ComingSoonWorldPage`. Everything downstream (map, filters, timeline, archives, search) is
  dataset-driven and adapts automatically.

**Entities cross-reference each other by string `id`** (e.g. `location.characterIds`,
`character.clanIds`, `route.steps[].locationId`). `npm run validate:data` checks for broken
refs, duplicate ids, out-of-range coordinates, etc. `src/utils/buildIndexes.ts` builds
`Map<id, entity>` lookups (use with `useMemo`) to avoid repeated `.find()` in render.

### Map rendering (React Flow)
`src/components/map/InteractiveWorldMap.tsx` composes the map from two kinds of nodes:
- **Three non-interactive "layer" nodes** (`MapLayerNode`) at fixed `(0,0)` with
  `pointer-events: none` and negative `zIndex`: background image, boundary overlay, labels.
- **One interactive pin node** (`MapNode`) per visible location.

`WorldMapBackground` renders the map level's `backgroundAssetId` as an `<img>` when the asset
has a `url` (the live world map is the PNG `naruto-world-map-reference-expanded`), otherwise it
falls back to locally-generated SVG placeholders. Boundaries (`MapBoundaryOverlay` /
`MapRegionPath`) are transparent clickable SVG paths that highlight on hover/selection. Clicking
a pin opens its location modal; double-clicking a pin with `subMapLevelId` drills into the
sub-map. Layer node ids are prefixed `__layer-` and ignored by click handlers.

### Coordinate system (important)
World-map coordinates live in a **viewBox plane of 1500 × 882.2204** (`NARUTO_MAP_VIEWBOX` in
`src/data/naruto/mapConstants.ts`, equal to the world `MapLevel.width`/`height`). All
`location.x/y`, boundary `svgPathD`, and `labelPosition` values use this plane. The reference
PNG is **990 × 579 px**, so convert: `flowX = px_x / 990 * 1500`, `flowY = px_y / 579 * 882.2204`.
Sub-maps have their own width/height. If you replace the map image, keep the same viewBox or all
pins break. The PNG-reading scripts (`find-red-dots`, `extract-boundaries`, both via `pngjs`)
emit coordinates already converted to this flow plane — paste their output into the data files.

### State (Zustand, `src/store/`)
- `useWorldStore` — active world.
- `useMapStore` — active map level, selected location/route, `filters` (`MapFilters`),
  `visibleLayers` (`VisibleLayers`), `viewportResetKey`.
- `useUiStore` — a single `activeModal` (one modal at a time, opening a new one replaces it) plus
  floating panels / drawers / timeline bottom-sheet (map-first: panels float or stay hidden).
- `useLocaleStore` — current locale (note: not re-exported from `store/index.ts`).

### i18n & the `Localizable` type
i18next + react-i18next. Default locale **Italian (`it`)**, plus English (`en`). Persistence:
`localStorage` key `animeInteractiveMaps.locale` (`I18N_STORAGE_KEY` in `src/i18n/index.ts`).
UI strings live in `src/i18n/resources/{it,en}.ts`.

**Data** strings use the `Localizable` type (`string | { it; en }`). Always resolve them through
`getLocalizedText(value, locale)` / `getEntityDisplayName(...)` (`src/utils/localization.ts`) —
never place a `Localizable` object directly in JSX (it would render `[object Object]` and fail
type-checking). Enum labels (canon status, location type, etc.) also have localized helpers there.
**IDs, slugs, and keys are never translated.**

## Data & content conventions

- When adding/removing an entity, update every referencing id array and run `validate:data`.
- `canonStatus` / `referenceStatus`: mark uncertain data `referenceStatus: 'needs_verification'`
  and anime/movie-only content with the matching `canonStatus`. Never present uncertain data as
  hard canon.
- **Copyright**: do not download or embed copyrighted images. Use locally-generated SVG
  placeholders or clearly-licensed assets only. Every `AssetReference` must carry `license`,
  `author`, `source`, and `url`. Narrative data are "seed" content to be verified before publishing.

## Adding a new world

1. Register the world in `src/data/worlds.ts` (id, slug, `status`, theme, map level ids).
2. Create `src/data/<slug>/` with the entity files (`assets`, `nations`, `mapLevels`,
   `locations`, `characters`, `clans`, `factions`, `arcs`, `events`, `routes`, …) and an
   `index.ts` exporting `<slug>Dataset: WorldDataset`.
3. Add it to `worldDatasets` in `src/data/registry.ts`.
