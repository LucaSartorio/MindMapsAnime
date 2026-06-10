# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Interactive Maps ("Mappe Interattive") — a frontend-only SPA for exploring interactive
maps of narrative worlds (worlds, nations, regions, villages/landmarks, characters,
factions, arcs, timeline events, routes, and a per-world "power system"). Stack:
React 18 + TypeScript (strict) + Vite + Zustand + React Flow (`@xyflow/react`) +
Tailwind + React Router. Vercel Analytics + Speed Insights (mounted in `src/App.tsx`).
**No backend, no database** — all content lives in local TypeScript files under `src/data/`.

**Available worlds:** Naruto, Hunter x Hunter, One Piece (`status: 'available'`, full
datasets). **Coming soon:** Dragon Ball, Attack on Titan (registered in `worlds.ts`,
no dataset yet → render `ComingSoonWorldPage`).

The app is fully **dataset-driven and dynamic per world**: a new world = a dataset + a
`WorldConfig`, with zero component edits. Do NOT hardcode world-specific terms in shared
components (see "Per-world dynamic config").

## Commands

```bash
npm run dev              # Vite dev server → http://localhost:5173
npm run build            # tsc -b && vite build  (the tsc step is the real correctness gate)
npm run preview          # serve the built bundle
npm run validate:data    # validate ALL registered datasets; exits 1 on integrity errors
npm run validate:i18n    # report missing/empty UI translations between it.ts and en.ts
npm run extract:boundaries  # regenerate Naruto nation boundary SVG paths from the world PNG
npm run find:dots        # detect the red village-marker dots in the Naruto PNG, print flow coords
```

- **There is no test framework** and `npm run lint` (`eslint .`) has no eslint config or
  dependency installed — do not rely on it. After any change, the gate is `npx tsc -b`
  (or `npm run build`), plus `npm run validate:data` whenever you touch `src/data/`.
- `npm install` is required first in a fresh checkout (node_modules is not committed).
- `scripts/*.ts` run under `tsx --tsconfig scripts/tsconfig.json` because they import `src/`
  via the `@/` alias. Besides the 4 npm scripts there is per-world tooling in `scripts/`
  (`hxh-extract-boundaries`, `hxh-overlay`, `optimize-hxh-map`, `onepiece-pins.ts`, and the
  `onepiece-*.py` overlay/snap helpers). Use the same `tsx` invocation for any new TS script.
- Import alias: `@/` → `src/` (configured in `vite.config.ts` and the tsconfigs).

## Architecture

### Multi-world dataset system
Each world is a single `WorldDataset` object (shape in `src/types/index.ts`): `world`,
`mapLevels`, `nations`, `boundaries?`, `locations`, `characters`, `factions`, `teams?`,
`arcs`, `events`, `routes`, `jutsu?`, `assets`. The flow:

- `src/data/worlds.ts` — world metadata registry (`animeWorlds`): `status`, `theme`, and the
  per-world `config: WorldConfig`.
- `src/data/<slug>/index.ts` — assembles and exports `<slug>Dataset: WorldDataset`. (Naruto's
  index merges `clans + factions` into `factions`, and `routes + characterRoutes` into `routes`.)
- `src/data/registry.ts` — `worldDatasets` map keyed by slug; `getWorldDataset(slug)` resolves it.
  Currently registers `naruto`, `hunterxhunter`, `onepiece`.
- `src/routes/WorldRoute.tsx` resolves the dataset from `:worldSlug`; `coming_soon` worlds render
  `ComingSoonWorldPage`. Everything downstream (map, filters, legend, timeline, archives, search)
  is dataset-driven and adapts automatically.

**Entities cross-reference each other by string `id`** (e.g. `location.characterIds`,
`character.clanIds`, `route.steps[].locationId`). `npm run validate:data` checks every
registered dataset for broken refs, duplicate ids, out-of-range coordinates, etc.
`src/utils/buildIndexes.ts` builds `Map<id, entity>` lookups (use with `useMemo`) to avoid
repeated `.find()` in render; `src/lib/filters.ts` caches an events-by-id map per dataset (WeakMap).

### Per-world dynamic config (`WorldConfig`) — IMPORTANT
Everything that varies per work is centralized in `AnimeWorld.config` (`WorldConfig` in
`src/types/index.ts`) and resolved via helpers in `src/lib/worldConfig.ts`. Components pass
`dataset.world` and get localized labels back. Never hardcode a world's terminology in shared UI.

- **Power system** (`config.ability`): `term` (Jutsu / Nen / Frutti del Diavolo / Tecniche…),
  `categories`, `attribute` (Naruto chakra nature — omit to hide that filter), `showHandSeals`,
  `showRank`, `featured`. Helpers: `getAbilityTerm`, `getAbilityCategoryLabel`, `getAbilityAttribute`,
  `worldShowsHandSeals`, `worldShowsAbilityRank`, `getFeaturedIds`.
- **Ranks / roles / facet terms**: `characterRank`, `characterRoles`, `nationTerm`, `placesTerm`,
  `factionsTerm`. Helpers: `getCharacterRankSystem`, `getCharacterRankOrder`, `getRoleLabel`,
  `getNationTerm`, `getPlacesTerm`, `getFactionsTerm`.
- **Label resolution cascade**: world config → "known" map (Naruto/HxH label functions in
  `src/utils/localization.ts`) → `humanizeId()`. So an unknown id from a future world still renders
  a readable label without editing any global union or label map.
- **Widened enum fields**: `Jutsu.type`, `Jutsu.chakraNature`, `Jutsu.classification`,
  `Character.role`, `Character.ninjaRank`, `Faction.type` accept free strings. The named unions
  (`JutsuType`, `NinjaRank`, `FactionType`, …) remain only as known-id reference/autocomplete.
- **Data-derived options**: filter lists and the map legend show only the values actually present
  in the active dataset — see `src/lib/locationTypes.ts` (`presentLocationTypes`, `LOCATION_TYPE_ICON`,
  shared by `MapNode`, `FiltersDrawer`, `MapLegendFloating`).

### Map rendering (React Flow)
`src/components/map/InteractiveWorldMap.tsx` composes the map from two kinds of nodes:
- **Non-interactive "layer" nodes** (`MapLayerNode`) at fixed `(0,0)` with `pointer-events: none`
  and negative `zIndex`: background image, boundary overlay, labels. Layer node ids are prefixed
  `__layer-` and ignored by click handlers.
- **One interactive pin node** (`MapNode`) per visible location.

`WorldMapBackground` renders the map level's `backgroundAssetId` as an `<img>` when the asset has a
`url`, otherwise falls back to locally-generated SVG placeholders. Boundaries (`MapBoundaryOverlay` /
`MapRegionPath`) are transparent clickable SVG paths that highlight on hover/selection — but some
worlds use a fan-made map that already draws its own borders, so `src/lib/worldMapPrefs.ts`
(`worldShowsBoundaryHighlight`) disables the highlight overlay for them (e.g. HxH) while keeping pins
clickable. Clicking a pin opens its location modal; double-clicking a pin with `subMapLevelId` drills
into the sub-map.

### Coordinate system (important)
Each world has its OWN viewBox plane equal to its world-map `MapLevel.width`/`height`. All
`location.x/y`, boundary `svgPathD`, and `labelPosition` values use that plane:
- Naruto `NARUTO_MAP_VIEWBOX` = 1500 × 882.2204 (`src/data/naruto/mapConstants.ts`)
- Hunter x Hunter `HXH_MAP_VIEWBOX` = 2000 × 1187 (`src/data/hunterxhunter/mapLevels.ts`)
- One Piece `ONEPIECE_MAP_VIEWBOX` = 2000 × 1000 (`src/data/onepiece/mapLevels.ts`)

For Naruto the reference PNG is 990 × 579 px, so convert: `flowX = px_x / 990 * 1500`,
`flowY = px_y / 579 * 882.2204`. Sub-maps have their own width/height. If you replace a map image,
keep the same viewBox or all pins break. The PNG-reading scripts (`find-red-dots`, `extract-boundaries`,
via `pngjs`) emit coordinates already converted to the flow plane — paste their output into the data.

### State (Zustand, `src/store/`)
- `useWorldStore` — active world + dataset.
- `useMapStore` — active map level, selected location/route, `filters` (`MapFilters`),
  `visibleLayers` (`VisibleLayers`), `viewportResetKey`.
- `useUiStore` — a single `activeModal` (one modal at a time; opening a new one replaces it) plus
  floating panels / drawers / timeline bottom-sheet (map-first: panels float or stay hidden).
- `useLocaleStore` — current locale (note: not re-exported from `store/index.ts`).

### i18n & the `Localizable` type
i18next + react-i18next. Default locale **Italian (`it`)**, plus English (`en`). Persistence:
`localStorage` key `animeInteractiveMaps.locale` (`I18N_STORAGE_KEY` in `src/i18n/index.ts`).
UI strings live in `src/i18n/resources/{it,en}.ts` — keep keys in sync across both files.

**Data** strings use the `Localizable` type (`string | { it; en }`). Always resolve them through
`getLocalizedText(value, locale)` / `getEntityDisplayName(...)` (`src/utils/localization.ts`) —
never place a `Localizable` object directly in JSX (it would render `[object Object]` and fail
type-checking). Enum labels (canon status, location type, character role/rank, etc.) have localized
helpers there; world-specific labels go through `src/lib/worldConfig.ts`, not raw i18n keys.
**IDs, slugs, and keys are never translated.**

### Entity images
`src/components/common/EntityImage.tsx` renders a themed SVG placeholder per entity. A real image is
used if a **drop-in** file named `<entityId>.<ext>` exists under
`src/assets/worlds/<slug>/{characters,jutsu,clans,locations,arcs}/` (auto-discovered at build time via
`import.meta.glob`, for ALL worlds). World logos: `src/assets/worlds/logos/<slug>.png`. World cursor:
`src/utils/worldCursor.ts`.

## Data & content conventions

- When adding/removing an entity, update every referencing id array and run `validate:data`.
- `canonStatus` / `referenceStatus`: mark uncertain data `referenceStatus: 'needs_verification'`
  and anime/movie-only content with the matching `canonStatus`. Never present uncertain data as
  hard canon.
- **Copyright**: do not download or embed copyrighted images. Use locally-generated SVG
  placeholders or clearly-licensed assets only. Every `AssetReference` must carry `license`,
  `author`, `source`, and `url`. Narrative data are "seed" content to be verified before publishing.

## Adding a new world

1. Register the world in `src/data/worlds.ts` (id, slug, `status`, `theme`, map level ids) and add
   its `config: WorldConfig` (power-system `term`/categories, ranks, roles, facet terms, featured).
2. Create `src/data/<slug>/` with the entity files (`assets`, `mapLevels`, `mapConstants`, `nations`,
   `boundaries`, `locations`, `characters`, `factions`/`clans`, `arcs`, `events`, `routes`, abilities…)
   and an `index.ts` exporting `<slug>Dataset: WorldDataset`.
3. Add it to `worldDatasets` in `src/data/registry.ts` and flip `status` to `'available'` in `worlds.ts`.
4. Run `npx tsc -b` and `npm run validate:data` (both must pass).
