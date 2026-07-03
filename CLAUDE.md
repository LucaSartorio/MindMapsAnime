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
npm run build            # tsc -b && vite build && npm run prerender  (the tsc step is the real correctness gate)
npm run prerender        # SEO: inject per-route meta/OG/JSON-LD into static HTML per route + write sitemap.xml
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
- **One interactive pin node** (`MapNode`) per visible location. Pins are tinted by
  category via `LOCATION_TYPE_COLOR` (`src/lib/locationTypes.ts`) — colour is never the only
  cue (the type icon + label stay), and the selected/highlighted/poneglyph states override it.
  The floating legend shows the same per-type colour swatches.
- **Cluster nodes** (`MapClusterNode`): when many pins crowd together, `clusterLocations`
  (`src/lib/clusterPins.ts`) merges them into a counted badge. It's grid clustering in **world
  space** (cell = `targetPx / zoom`, quantized), so it only recomputes on zoom, not pan; the
  selected pin and active-route steps are kept unclustered so schede/edges never break. Clicking a
  cluster `fitBounds` to its members (it "opens"). Near-coincident pins (e.g. One Piece
  Cocoyashi/Arlong, ~3 units apart) are nudged apart by `spreadOverlappingPins` (deterministic,
  tiny, non-destructive) so they never stack, and clustering **fully dissolves above
  `CLUSTER_OFF_ZOOM` (2.6)** — at (near) max zoom every pin is individually visible/clickable, so no
  cluster can get "stuck".

`WorldMapBackground` renders the map level's `backgroundAssetId` as an `<img>` when the asset has a
`url`, otherwise falls back to locally-generated SVG placeholders. Boundaries (`MapBoundaryOverlay` /
`MapRegionPath`) are transparent clickable SVG paths that highlight on hover/selection — but some
worlds use a fan-made map that already draws its own borders, so `src/lib/worldMapPrefs.ts`
(`worldShowsBoundaryHighlight`) disables the highlight overlay for them (e.g. HxH) while keeping pins
clickable. Clicking a pin opens its location modal; double-clicking a pin with `subMapLevelId` drills
into the sub-map.

### Filters UX & design-system primitives (AniMapVerse redesign)
The map-filters experience is built from small, reusable, accessible primitives in
`src/components/filters/` — reuse these instead of hand-rolling chips/toggles/sections:
- `FilterChip` — toggle pill with `aria-pressed` (state is never colour-only), optional count.
- `FilterSection` — collapsible group (`<button aria-expanded aria-controls>`) with an active-count badge.
- `FilterSearchField` — labelled `type="search"` used to filter long option lists in place
  (`SEARCH_THRESHOLD = 12` in `FiltersDrawer`).
- `ToggleRow` — accessible `role="switch"` row (used for map/story layer toggles).
- `ActiveFilterBar` — removable summary of active filters + live result count (`aria-live`), in two
  variants: `floating` (over the map in `WorldLayout`, hidden when no filters) and `inline` (top of
  `FiltersDrawer`). Its tokens come from `useActiveFilterTokens(dataset)`, which localizes every
  active value and exposes a per-token `remove()`.

`FiltersDrawer` composes these into grouped, collapsible sections (Series, Location type, Nation,
Places, Arcs, Characters, **Factions/Clans**, Importance, Options) and preserves the exact Zustand
wiring (`setFilters`, `resetFilters`). **Layer visibility lives in a separate `LayersDrawer`**, not
in the filters — see "Map shell" below.

### Map shell: tool rail & layer manager (immersive atlas)
`ToolRail` (`src/components/map/ToolRail.tsx`) is the single, accessible home for map tools:
a vertical floating rail on desktop (left, **top-anchored below the zoom `<Controls>`**, icon-only +
`aria-label`/tooltip) and a **bottom nav** on mobile (icon + label, ≥44px targets). Each panel tool
exposes `aria-pressed` reflecting its open state. It toggles the existing store state (filters, layers,
legend, timeline, routes) plus clear selection / help — so there's one predictable entry point instead
of scattered buttons. There is **no "reset view" tool**: the React Flow `<Controls>` fit-view square
already recenters, so it'd be a duplicate. `WorldLayout` mounts it and keeps only the level switcher
(centred) + `ActiveFilterBar` + `MapFocusBreadcrumb` in the top overlay; the React Flow zoom
`<Controls>` stay top-left, the floating panels bottom. The bottom-left legend gets a desktop-only
left offset (`md:ml-16`) so it sits to the right of the vertical rail and never overlaps it (its height
is capped + scrollable for type-heavy worlds like Dragon Ball). The header (`TopNav`) also gains a `WorldSwitcher` — an accessible dropdown to jump
between anime worlds without going back home.

**Mobile floating panels**: on desktop the legend/timeline/routes stay as always-visible collapsed pills
at the bottom corners; on **mobile** they'd stack and cover the map, so `WorldLayout` hides each closed
pill (`max-md:hidden` when its store flag is false) → the map is clean by default and those panels are
opened from the **full-width bottom nav** (which on mobile lists *all* panel tools + help). Mobile opens
**one floating panel at a time** — `ToolRail.onMobileToolClick` sets the tapped panel's flag and clears
the other two (desktop keeps independent toggles).

**Filters vs layers are separated** (clear mental model): `FiltersDrawer` = *which data* (chips +
options), `LayersDrawer` (`src/components/drawers/LayersDrawer.tsx`) = *what's visible* (map/story
layer toggles, moved out of filters). The two drawers are **mutually exclusive** in `useUiStore`
(`openFiltersDrawer`/`openLayersDrawer` each close the other) so only one is open at a time.

**Result count = single source of truth**: `selectVisibleLocations(dataset, levelId, filters, layers)`
in `src/lib/filters.ts` applies filters + per-importance layer gating; the map canvas and the
`useFilteredLocations(dataset)` hook (`src/lib/mapSelectors.ts`, used by the count/summary) both go
through it, so the number shown never diverges from the pins rendered.

Design tokens live in `tailwind.config.js` (`shadow-panel/pop/focus`, `animate-fadeIn/popIn`) and
reusable classes in `src/styles/globals.css` under `@layer components` (`.field`, `.count-badge`,
`.active-chip`). The existing `ink/chakra/ember/sharingan/scroll` palette, `.panel`, `.chip`, and
`.btn-*` classes are unchanged — new tokens are additive.

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

### Detail schede as a docked panel (tabbed)
`src/components/common/Modal.tsx` is the single shell behind every detail scheda (dispatched by
`ModalRoot` from `useUiStore.activeModal`). It defaults to `placement="docked"`: a right-anchored
side panel on desktop / bottom sheet on mobile, so opening a scheda **doesn't cover the map** (the
selected pin stays highlighted behind it). `placement="center"` restores the classic centered card.
Opening a location scheda syncs `selectedLocation` (in `LocationDetailsModal`) so the map re-centres
even when reached via a cross-link.

Long schede use `Tabs` (`src/components/common/Tabs.tsx`), an accessible WAI-ARIA tablist
(roving tabindex, ←/→/Home/End, `role="tabpanel"`). `LocationDetailsModal` is organised into
Overview / Events / Characters / Routes / Gallery tabs (each with a count badge, shown only when it
has content). Other modals still scroll — extend them with `Tabs` the same way when needed.

### Focus mode & route stepper (narrative interactions)
- **Focus mode**: when a location or route is selected, `InteractiveWorldMap` computes a "related"
  set (same arc / same characters / same route) and passes `dimmed` to the unrelated `MapNode`s, so
  the connected context stands out. `MapFocusBreadcrumb` shows what's in focus + an "exit" that
  clears the selection; clicking the map pane (`onPaneClick`) also exits.
- **Route stepper** (`src/components/map/RouteStepper.tsx`, embedded in `RouteDetailsModal`): "follow
  the route" — Prev/Next + auto **Play** walk the map through a route's steps by setting
  `selectedRoute` + `selectedLocation` in the store (the canvas centres/highlights each step). No
  React Flow access needed from the modal — it drives the shared store, the map reacts. The step
  **index is controlled by `RouteDetailsModal`** (`activeIndex`/`onActiveIndexChange`), so the
  scheda's steps-order list highlights the current step (`aria-current="step"`, glow) and marks the
  passed ones done (✓) as playback advances — you see at a glance where you've arrived.

### Knowledge graph (derived semantic layer)
`src/lib/graph/` builds a **derived** knowledge graph — a *projection* of the existing
`WorldDataset`, NOT a migration: no data duplication, the data files stay the single source of
truth. `buildWorldGraph(dataset)` walks the existing id-arrays (`location.characterIds/arcIds/…`,
`event.locationId/…`, `character.family/teachers/allies/relationships/…`, `route.steps`, `faction.*`,
`arc.*`) and emits typed, bidirectional edges into an adjacency map, **memoized per-dataset**
(WeakMap, like `buildIndexes`). Nodes are keyed `type:id` (`entityKey`/`parseKey`); relation types
are semantic (`appears_at`, `happened_at`, `in_arc`, `member_of`, `family|mentor|student|ally|enemy`,
`uses`, `passes_through`…). The graph is **queried contextually, never shown globally**.

**Derived group-nodes (world-agnostic)**: besides the entity nodes, the graph emits *group* nodes from
free per-world fields — `race` (from `character.race`, via `of_race`) and `saga` (from `arc.saga`, via
`in_saga`, keyed by `sagaKey()` so localized/variant spellings collapse to one node). They're emitted
**only where the field exists** (e.g. `race` only in Dragon Ball), so no world hardcodes anything. Group
nodes have no scheda of their own: consumers surface their *members* via `coMembers(graph, ref, via,
memberType)` (2-hop, e.g. "same race" characters, "same saga" arcs) — a generic helper, not per-field code.

It's the single engine for relation logic that was previously duplicated inline:
- `relatedPlaceIds(graph, placeId)` → focus mode's "related places" set (`InteractiveWorldMap`).
- `characterConnections(graph, characterId)` → the `RelationsGraphModal` connections (deduped by
  priority family > mentor > student > ally > enemy > other).
- `MapRelationsOverlay` draws **contextual** place→place connectors (≤12, dashed, `aria-hidden`) from
  the selected place to its related places — a layer node under the pins, only while a place is
  selected. Reinforces the focus dimming; bounded so it never becomes a global web.

**Generic query API** (pure, memoization-friendly; feeds schede + search): `getConnectedEntities(graph,
ref)` returns the depth-1 neighbour `EntityRef[]` of any entity (deduped); `getConnectedEntitiesByType`
filters that to one `EntityType`; `getGraphContextForEntity(graph, ref)` returns an `EntityGraphContext`
— the same depth-1 neighbours **bucketed by type** (`places/characters/events/arcs/factions/routes/
nations/techniques`) plus the raw `relations` edges. Everything takes/returns `EntityRef`s (`{type,id}`),
so consumers never touch dataset internals. The UI adapter `entityRefLabel(dataset, ref, locale)`
(`src/lib/graphRefs.ts`) resolves a ref to its localized display name via the existing `find*` helpers —
opening actions stay in the components (they own the store openers).

**Shared relations layer (every scheda)**: `buildRelationGroups(dataset, entity, t, locale, exclude?)`
(`src/lib/relationGroups.ts`) turns the graph context into localized, per-entity-type groups of clickable
refs — a `GROUPS_BY_TYPE` map decides which groups (and order) each entity kind shows; empty groups are
dropped, so race/saga (or any absent field) simply don't appear. `RelationsPanel`
(`src/components/common/RelationsPanel.tsx`) renders those groups as chip sections and is **presentational
only** — it takes an `onOpen(ref)` dispatched by `useOpenEntityRef()` (`src/lib/useOpenEntityRef.ts`), the
single type→store-opener switch reused everywhere. Consumers:
- `LocationDetailsModal` → the **"Relazioni" tab** (badge-counted, shown only when non-empty).
- `Character/Faction/StoryArc` schede (which still scroll) → a graph-fed **section** appended to the
  existing content, passing `exclude` for the groups the scheda already renders explicitly, so the panel
  only adds what's new (e.g. **same-race** on a Character, **same-saga** on an Arc, nation/routes on a
  Faction). Extend other modals the same way.

Adding a new relation = emit more edges in `buildWorldGraph` from the fields that already exist;
consumers (focus, relations overlay, the schede's relations layer, and search) read from the same graph
via these queries — no per-consumer traversal.

**Search over relations** (`src/lib/search.ts` `relatedResults` + `GlobalSearchDropdown`): when the top
⌘K hit is a strong match (name score ≥ 70), the dropdown appends that entity's graph neighbours as extra
navigable `SearchResult`s marked `relatedTo`, rendered under a "Correlate a …" header (`search.relatedTo`)
in the same listbox (keyboard nav unchanged). Turns search into a relation explorer, world-agnostic.

### Story Mode & Relations Mode
- **Story Mode** (`StoryModePanel`, `useUiStore.storyArcId` + `openStory`/`closeStory`): a guided,
  non-modal side panel (bottom sheet on mobile) that walks an arc's events in order. Started from
  `StoryArcDetailsModal` ("▶ Avvia storia guidata"). Each step sets `selectedLocation` +
  `selectedTimelineEvent`, so the map centres and focus mode dims the rest — the map is the stage.
  Prev/Next + Play; Esc exits. Mounted in `WorldLayout`, closed on world change.
- **Relations Mode** (`RelationsGraphModal`, modal kind `relations`): a navigable **React Flow**
  graph of a character's connections (family/mentor/student/ally/enemy + `relationships`), radial
  layout, colour+labelled edges, click a node/list-item to refocus. The graph is `aria-hidden`
  (non-focusable, `disableKeyboardA11y`); the **accessible path is the list below it**. Opened from
  `CharacterDetailsModal` ("Mappa delle relazioni"). Radius scales with connection count.
- **Gotcha**: any new `ActiveModal` kind must be registered in `ModalDeepLink.KINDS` (+ `entityExists`
  + `openModal`). That component syncs `activeModal` ↔ URL and **closes any modal whose kind it
  doesn't know** — an unregistered kind silently unmounts on open.

### Floating map panels (legend · routes · timeline)
The over-map panels share `FloatingPanel` (`src/components/common/FloatingPanel.tsx`), a WAI-ARIA
**disclosure**: one title button with `aria-expanded`/`aria-controls` + rotating chevron toggles the
content (state is announced, not just visual). `MapLegendFloating` is also an **interactive filter** —
each type row is an `aria-pressed` toggle bound to `filters.locationTypes` (same state as the drawer,
so no divergence), with per-type colour swatches and a "show all" reset. `RoutesFloatingPanel` marks
the active route with `aria-pressed` + a non-colour "Active" badge; `TimelineBottomSheet`'s header is
a single disclosure button (no mouse-only `div`), and its event strip is a labelled list.

**Timeline playback**: the timeline is deliberately **filter-free** (lean). Its "▶ Riproduci" button
starts a **play-all-events** walk (like a whole-world story mode): each tick sets `selectedTimelineEvent`
+ `selectedLocation` so the map centres/focuses event-by-event. While playing, the sheet **collapses to
a compact player bar** (progress + Pausa/Riprendi + Stop) shown only during playback; `isTimelineOpen`
stays true so `useMapMode` reports `timeline`. Playback walks a route-scoped-or-all list that is
independent of `selectedLocationId` (which the walk itself sets), so it never shrinks mid-play.

### Search & keyboard access (⌘K)
`GlobalSearchDropdown` (mounted in `TopNav`, per-world) is the keyboard entry point to every
entity: open with **⌘K / Ctrl+K** or `/`, type, then navigate results with ↑/↓ (Home/End), open with
Enter, close with Esc. It's a WAI-ARIA combobox — the input carries `aria-activedescendant` and each
`SearchResults` option has a stable id + `aria-selected`, and the active option scrolls into view.
Selecting a result opens the matching scheda and centres the map (for geolocated kinds). Reaching any
of the 80+ pins by keyboard goes through search rather than a Tab-trap over every marker.

### Focus management (a11y)
`Modal` and `Drawer` both trap Tab, close on Esc, and **restore focus to the trigger** on close
(WCAG 2.4.3). The closed `Drawer` is marked `inert` so its off-screen controls leave the tab order
and the a11y tree (prevents tabbing into a hidden panel / `aria-hidden-focus`). Verify with
`npm run audit:a11y` (axe-core, WCAG 2.2 AA) — start `npm run preview` first; the scenario list in
`scripts/a11y-audit.mjs` covers the map, filters drawer, docked schede and search overlay.

### State (Zustand, `src/store/`)
- `useWorldStore` — active world + dataset.
- `useMapStore` — active map level, selected location/route, `filters` (`MapFilters`),
  `visibleLayers` (`VisibleLayers`), `viewportResetKey`.
- `useUiStore` — a single `activeModal` (one modal at a time; opening a new one replaces it) plus
  floating panels / drawers / timeline bottom-sheet (map-first: panels float or stay hidden).
- `useLocaleStore` — current locale (note: not re-exported from `store/index.ts`).

**Map interaction mode** (`src/lib/mapMode.ts`): `useMapMode()` is the single, **derived** source of truth
for the active mode — `story | relations | routes | timeline | explore` — computed from existing store
flags (`storyArcId`, `activeModal.kind === 'relations'`, `selectedRouteId`, `isTimelineOpen`; priority in
that order). No new state, no destructive refactor: components read the mode instead of re-checking flags.
`MapModeIndicator` (top overlay, mounted in `WorldLayout`) shows a **visible pill** for non-`explore`
modes and keeps a persistent `aria-live="polite"` region that **announces every mode change** (incl. return
to explore). Labels are generic `map.mode.*` keys → world-agnostic.

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
