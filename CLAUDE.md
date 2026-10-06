# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**AniMapVerse** (https://animapverse.com; formerly "Mappe Interattive") — a frontend-only SPA,
statically pre-rendered page by page for SEO (see "SEO architecture"), for exploring interactive
maps of narrative worlds (worlds, nations, regions, villages/landmarks, characters,
factions, arcs, timeline events, routes, and a per-world "power system"). Stack:
React 18 + TypeScript (strict) + Vite + Zustand + React Flow (`@xyflow/react`) +
Tailwind + React Router. Vercel Analytics + Speed Insights (mounted in `src/App.tsx`).
**No backend, no database** — all content lives in local TypeScript files under `src/data/`.

**Available worlds:** Naruto, Hunter x Hunter, One Piece, Dragon Ball, Black Clover, Bleach, Attack on Titan, Jujutsu Kaisen
(`status: 'available'`, full datasets). **Coming soon:** Fullmetal
Alchemist, Frieren, Toriko, Fairy Tail, Demon Slayer (registered in `worlds.ts`,
no dataset yet → render `ComingSoonWorldPage`, noindex).

The app is fully **dataset-driven and dynamic per world**: a new world = a dataset + a
`WorldConfig`, with zero component edits. Do NOT hardcode world-specific terms in shared
components (see "Per-world dynamic config").

## Commands

```bash
npm run dev              # Vite dev server → http://localhost:5173
npm run build            # tsc -b && test:seo && i18n:audit && vite build && build:ssr && prerender && seo:check (ALL blocking)
npm run build:ssr        # vite build --ssr src/entry-server.tsx → dist-server/ (build-only, gitignored)
npm run prerender        # SSG: one static HTML per public page + 404.html + sitemap*.xml + robots.txt + llms.txt
npm run test:seo         # SEO invariants on sources (slugs, URL round-trip, metadata, hreflang, sitemap)
npm run seo:check        # SEO checks on the generated dist/ HTML (canonical, hreflang, dup titles, broken links…)
npm run preview:static   # serve dist/ with Vercel semantics (redirects, real 404s) → :4173
npm run smoke            # build + browser smoke test (routes, hydration kept, language switch, 404, modals)
npm run preview          # Vite preview (NB: answers 200 to ANY path — use preview:static for HTTP tests)
npm run validate:data    # validate ALL registered datasets; exits 1 on integrity errors
npm run validate:i18n    # UI keys aligned in all 6 locales + every dataset Localizable field is { it, en } (blocking)
npm run seo:slugs        # freeze published SEO slugs into src/data/<world>/slugs.ts (`-- --check` = verify only)
npm run i18n:status      # dataset translation overlays (es): coverage, missing, stale, orphan keys (docs/I18N.md)
npm run i18n:audit       # BLOCKING: every shown label/name exists in it/en/es (`-- --locale fr` = what a new language needs)
npm run i18n:extract -- --world naruto --locale es --out tmp/todo.json   # texts to translate (missing + stale)
npm run i18n:merge -- --world naruto --locale es --from tmp/es.json      # write src/data/<world>/i18n/es.ts + es.meta.json
npm run extract:boundaries  # regenerate Naruto nation boundary SVG paths from the world PNG
npm run find:dots        # detect the red village-marker dots in the Naruto PNG, print flow coords
npm run social:validate  # INTERNAL social video engine: typecheck + engine/pipeline tests (see "Social engine")
npm run social:catalog   # what can be produced → tools/social-engine/catalog/catalog.json
npm run social:queue -- --template character-journey --anime dragonball --character goku --segment part-01 --locale en
npm run social:validate:queue          # check queued content, render nothing
npm run social:render:queue -- --dry-run   # then without --dry-run: batch render → MP4 + manifest + history
npm run social:retry:failed            # failed content → queue → render
npm run social:render:queue:dry        # dry run without npm argument forwarding (CI / npm 11 on Windows)
npm run social:ci:report               # artifact folder + step summary from the last batch (used by GitHub Actions)
npm run social:render -- --config tools/social-engine/examples/itachi-character-journey.json   # ad-hoc preview
npm run social:studio    # Remotion Studio (local preview of the video templates)
npm run social:publication:validate    # publication receipts in publication/pending/: check only (the repo never publishes)
npm run social:publication:apply:dry   # renderId · platform · old → new
npm run social:publication:apply       # all-or-nothing: history + catalog updated, pending → applied/ (audit trail)
npm run social:publication:list        # rendered videos × instagram/facebook/tiktok/youtube state (+ artifact)
npm run social:agent -- --dry-run      # the daily cycle (12 steps) on the real state: selector + SelectionTrace, writes nothing
npm run social:next                    # growth engine: the next video (rotation-safe) = catalog/next.json + trace report
npm run social:editorial:check         # queue vs the HARD editorial rules (render gate)
npm run social:editorial:check:selection   # + a queued video must BE the growth engine selection (PR gate)
npm run social:analytics:apply         # analytics snapshots → metrics.json → performance.json + next.json
npm run social:performance             # scores per anime / character / format / hook / duration / platform
```

- **There is no test framework** (the SEO tests use plain `node:assert` in `scripts/`) and
  `npm run lint` (`eslint .`) has no eslint config or dependency installed — do not rely on it.
  After any change, the gate is `npm run build` (tsc + SEO tests + prerender + seo:check), plus
  `npm run validate:data` + `npm run validate:i18n` whenever you touch `src/data/` (slug lock,
  slug collisions, thin content, IT/EN localization), and `npm run seo:slugs` when you add entities.
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
- `src/data/registry.ts` — lazy loaders keyed by the INTERNAL slug (`loadWorldDataset(slug)`,
  `getLoadedWorldDataset(slug)`): naruto, hunterxhunter, onepiece, dragonball, blackclover, bleach,
  attackontitan, jujutsukaisen.
- A world has two slugs: `slug` (internal, permanent: data dirs, assets, store, registry) and
  `urlSlug` (public URL segment, e.g. `hunter-x-hunter`; `getWorldUrlSlug`/`findWorldByUrlSlug`).
  Never build a URL from `world.slug` — use the path builders in `src/seo/paths.ts`.
- `src/routes/WorldRoute.tsx` (a lazy chunk) resolves the world from `/{lang}/:worldSlug`, loads
  the dataset, then delegates "does this page exist?" to `resolveSeoPath` (→ real 404 otherwise)
  and mounts the page for its kind (landing, map, archive, directory, entity, timeline).
  `coming_soon` worlds only have a (noindex) landing → `ComingSoonWorldPage`. Everything
  downstream (map, filters, legend, timeline, archives, search) is dataset-driven.

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
  **Constant screen size**: React Flow scales nodes with the zoom, so pin labels grew with the
  zoom and always overlapped (zooming never separated close pins). `MapNode`/`MapClusterNode`
  **counter-scale by `1/zoom`** (`useStore` reading the viewport zoom, quantized to limit
  re-renders) so pins+labels stay a fixed screen size — zooming genuinely spreads the pins and
  labels stop piling up. A CSS counter-scale doesn't shrink the *layout* box, so the RF node
  wrapper stays huge and would block clicks over a big transparent area; the wrappers are
  `pointer-events:none !important` (globals.css) with only the visible content `pointer-events:auto`
  (clicks still bubble to `onNodeClick`). The a11y audit clicks that visible content, not the wrapper.
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

**Header navigation (`TopNav`) — 3 zones, never two rows.** Canonical order: **Logo → Anime selector →
Divider → Section navigation → Utilities** (spacing: logo 16px selector 12px │ 12px tabs; every control —
selector, tabs, "More", search/info/report icons, language — is **36px (`h-9`) and vertically centred by
flex**, no offsets/transforms). The anime selector is **neutral** (ink border/bg, never blue): blue is
reserved for the active tab (selector = current world, tab = current section). Its menu is left-anchored
under it (`left-0 top-full mt-1.5`, `min-w-full w-max`, opaque), current world = neutral highlight + ✓,
WAI-ARIA menu button (↑/↓/Home/End, Esc returns focus, Tab/click-outside close, focus starts on the current
world). The divider (`[data-nav-divider]`) is shown only where tabs are (≥md). LEFT (`shrink-0`): logo + `WorldSwitcher`;
CENTER (`flex-1 min-w-0`): `WorldTabs` (`src/components/layout/WorldTabs.tsx`); RIGHT (`shrink-0`): compact
search icon (→ popover `GlobalSearchDropdown`), About/Report icon buttons (`aria-label` + `title`), language,
mobile ☰. The zones can never overlap, so no tab can slide under the search. Space adapts **in CSS only**
(no ResizeObserver / DOM measuring): header gap/padding are `clamp()` vars (`.topnav-bar` in globals.css), then
tab padding shrinks, then the last tabs fold into an accessible **"Altro/More"** disclosure — driven by
`@container worldtabs` rules generated by `worldTabsCss()` (`src/lib/navOverflow.ts`) from a deterministic
Inter-14px width estimate of the labels (SSR-identical; Overview + Map always visible; "More" is highlighted
when the active tab is inside it). Measured: all tabs visible at 1920/1600/1440/1366 for every world (also
with German labels); "More" only kicks in ≤1280. Labels are `whitespace-nowrap`, never truncated. The
**active tab is derived from the route** (`activeWorldTabKey(parseSeoPath(...))`): landing → Overview, `/map`
→ Map, a category index *and all its entity pages* → that category (`regions` → Locations), timeline → none.
`npm run smoke` asserts this (5 routes × 6 viewports: one row, no overlap/clipping, correct active tab,
equal control heights + shared vertical centre, divider between selector and tabs, menu anchored to the selector).

**Anime selector rule**: choosing a world in `WorldSwitcher` ALWAYS opens that world's **Overview**
(`worldPath(lang, w)` = `/{lang}/{world}`) from any section, and resets the previous world's context
(map selections, filters, open modal, story). The rule applies only to that explicit action — deep links
(`/one-piece/map`, `/one-piece/characters/<slug>`) are never redirected.

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
- Bleach `BLEACH_WORLD_VIEWBOX` = 2000 × 1250; Karakura/Seireitei/Hueco Mundo 1600 × 1000, Reiōkyū
  1400 × 1000 (`src/data/bleach/mapConstants.ts`). Bleach has no official map: its 5 maps are original
  SVGs generated by `python3 scripts/bleach-maps.py` (deterministic) into
  `public/assets/worlds/bleach/maps/` — if you move a landmark there, move its pin too.
- Attack on Titan `AOT_WORLD_VIEWBOX` = 2000 × 950 (the Earth flipped vertically, from public-domain
  Natural Earth outlines in `scripts/mapgen/data/`); Paradis 1600 × 1100 (flipped Madagascar, stretched);
  Walls 1600 × 1240 (Sina 250 / Rose 380 / Maria 480 km to scale); Shiganshina/Trost/Liberio/Paths
  1400 × 1000 (`src/data/attackontitan/mapConstants.ts`). All 7 are original SVGs generated by
  `python3 scripts/mapgen/aot.py`, which also rewrites the pins (`apply_pins`).
- Jujutsu Kaisen `JJK_JAPAN_VIEWBOX` = 1800 × 1600 (Mercator on public-domain Natural Earth prefectures,
  Okinawa inset, the ten Culling Game colonies); Tokyo 2000 × 1400, Shibuya 1500 × 1700, Jujutsu High
  campus 1600 × 1100 (imagined: the series shows no plan), Kyoto 1500 × 1500, Sendai 1600 × 1100
  (`src/data/jujutsukaisen/mapConstants.ts`). All 6 are original SVGs generated by
  `python3 scripts/mapgen/jjk.py` (real street/station/river geometry for Tokyo/Shibuya/Kyoto/Sendai),
  which also rewrites the pins (`apply_pins`).
- **Every map level has an image.** Sub-maps without a usable official/reference map (Naruto's 9
  villages, HxH 8, One Piece 21, Dragon Ball 7, Black Clover 5) are **original SVG maps** generated by
  `python3 scripts/mapgen/<world>.py` (`naruto`, `hxh`, `onepiece`, `dragonball`, `blackclover`) on the
  shared toolkit `scripts/mapgen/kit.py`, wired as `kind: 'map'` assets via `originalMapAsset()`
  (`src/data/originalMapAssets.ts`; One Piece through `ONEPIECE_ORIGINAL_SUBMAPS`). Each map function
  declares its pins' positions and the script **rewrites those locations' `x`/`y` in `src/data/<world>/`**
  (`apply_pins`, idempotent, handles both `id:` objects and the compact `L(...)` form) — so edit the
  generator, not the coordinates, and re-run it. Deterministic (fixed seeds, `<use>` tree symbols to keep
  files ≤ ~280 KB). `PREVIEW_DIR=<dir>` also writes an HTML preview with the pins overlaid.

For Naruto the reference PNG is 990 × 579 px, so convert: `flowX = px_x / 990 * 1500`,
`flowY = px_y / 579 * 882.2204`. Sub-maps have their own width/height. If you replace a map image,
keep the same viewBox or all pins break. The PNG-reading scripts (`find-red-dots`, `extract-boundaries`,
via `pngjs`) emit coordinates already converted to the flow plane — paste their output into the data.

### Map markers & tournaments (world-agnostic)
- **Map markers** (`WorldConfig.mapMarkers`, `src/lib/mapMarkers.ts`): a marker is a *view on events*,
  not new data — a location is "marked" when it hosts an event tagged `eventTag` (Dragon Ball:
  `desiderio-del-drago` = every wish to a dragon). `FiltersDrawer` gets one toggle per marker present in
  the dataset (`filters.highlightMarkers`), marked pins turn red like One Piece's Poneglyphs
  (`MapNode.marked`), clusters containing one turn red too, and so do the pins that drill into a sub-map
  containing one. The location scheda/page lists the marker's events (`sectionTitle`). New world = add a
  config entry + tag the events; no component edits.
  Tags for events that already exist live in `src/data/<world>/markerTags.ts` (`withEventTags`). Markers today:
  `vita-e-morte` (deaths & resurrections, every world), dragon wishes + Dragon Ball hunts, Devil Fruits eaten (One
  Piece, besides the Poneglyph toggle), Sukuna's fingers, Tailed Beasts, Nine Titans, Hōgyoku, Ging's trail, devils.
- **Story moment** (`filters.untilArcId`, `src/lib/storyMoment.ts`): an anti-spoiler range slider in `FiltersDrawer`.
  A place exists from the first arc it appears in (its `arcIds` + its events' arcs), an event from its arc; places/events
  without arc info stay visible. Applied in `filterLocations`/`filterEvents`, so pins, count and timeline agree.
- **Tournaments** (`WorldDataset.tournaments`, `Tournament` in `src/types/index.ts`): rounds → matches →
  sides (characters or a label, e.g. a pseudonym like "Jackie Chun" with the real character linked).
  `format: 'bracket'` (each round has half the matches of the previous one — `validate:data` checks it)
  is drawn as an SVG bracket by `TournamentView` (`src/components/tournaments/`); `'rounds'` is a list.
  Shown in the **"Tornei" tab** of the hosting location's scheda (selector when several) and in the
  location's SEO page; a pin that opens a sub-map also shows the tournaments held inside it
  (`tournamentsAt`). Participants become graph relations of the location.

### Battles, family trees, faction structure, chapter coverage
- **Battles** (`TimelineEvent.battle`: `sides` of character ids + `winner` index, or `result: 'draw' | 'interrupted'`,
  optional `note`): written per world in `src/data/<world>/battles.ts` (`battleKit(prefix)` → `win/draw/stop`) and
  applied by the index (`applyBattles`/`withBattles`, which also adds fighters to `characterIds`). `src/lib/battles.ts`
  indexes them per character → `BattleList` (record + list with a textual result badge) in the character scheda and
  SEO page; `BattleOutcomeLine` in the event scheda. `validate:data` checks sides ⊂ `characterIds` and the winner range.
- **Family trees**: `Character.parents` / `Character.spouses` (one side is enough: children, siblings and co-parents are
  derived by `src/lib/familyTree.ts`), written in `src/data/<world>/family.ts` (`familyKit` → `withFamily`).
  `FamilyTreeSvg` draws grandparents → parents → siblings·self·spouses → children → grandchildren (boxes are real
  links; the scheda intercepts the click to open the modal). Shown only with ≥ 2 relatives.
- **Faction structure / succession**: `Faction.structure` (groups of members with a role — divisions, pairs, numbers,
  squads) and `Faction.succession` (holders of an office in order — Hokage, division captains, Nine Titans), written in
  `src/data/<world>/structure.ts` (`factionKit`: `m(id, role)` character, `x(label)` person without a scheda) and applied
  with `withFactionExtras`. Rendered by `FactionGroups`/`FactionSuccessions` in the faction scheda and SEO page.
- **Derived character journeys** (`src/data/shared/autoJourneys.ts`, applied by `loadWorldDataset` in the registry):
  every main/major character without a hand-written route gets `route-journey-<id>` (slug `<id>-journey`, group
  "Cammini dei personaggi") built from the locations of their canon events in order (≥ 3 distinct stops). Write a
  route by hand to replace it — a character who is a protagonist of any route is skipped.
- **Chapter coverage**: `npm run coverage:chapters [-- <world> --gap N]` (informative) parses `event.mangaChapters` and
  lists the uncovered chapter ranges per series — use it to find what's still missing in a world.

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
`npm run audit:a11y` (axe-core, WCAG 2.2 AA) — start `npm run preview:static` first (`BASE=http://localhost:4173`); the scenario list in
`scripts/a11y-audit.mjs` covers the map, filters drawer, docked schede and search overlay.

### State (Zustand, `src/store/`)
- `useWorldStore` — active world + dataset.
- `useMapStore` — active map level, selected location/route, `filters` (`MapFilters`),
  `visibleLayers` (`VisibleLayers`), `viewportResetKey`.
- `useUiStore` — a single `activeModal` (one modal at a time; opening a new one replaces it) plus
  floating panels / drawers / timeline bottom-sheet (map-first: panels float or stay hidden).
- `useLocaleStore` — current locale (note: not re-exported from `store/index.ts`). `setLocale` =
  explicit user choice (loads lazy resources, persists); `syncLocale` = align to the URL language
  without persisting; `setLocaleNow` = synchronous, for pre-render/boot.
- **SSR gotcha**: zustand 4.5 renders SSR *and hydration* from the store's INITIAL state. Stores
  that are set before the first render (`useLocaleStore`, `useWorldStore`) are built with
  `createSnapshotStore` (`src/store/snapshotStore.ts`) so the snapshot is the current state. Any
  other store read during the first render must keep its initial value identical on server and
  client (or be gated by `useHydrated`), otherwise hydration mismatches.

**Map interaction mode** (`src/lib/mapMode.ts`): `useMapMode()` is the single, **derived** source of truth
for the active mode — `story | relations | routes | timeline | explore` — computed from existing store
flags (`storyArcId`, `activeModal.kind === 'relations'`, `selectedRouteId`, `isTimelineOpen`; priority in
that order). No new state, no destructive refactor: components read the mode instead of re-checking flags.
`MapModeIndicator` (top overlay, mounted in `WorldLayout`) shows a **visible pill** for non-`explore`
modes and keeps a persistent `aria-live="polite"` region that **announces every mode change** (incl. return
to explore). Labels are generic `map.mode.*` keys → world-agnostic.

### i18n & the `Localizable` type
i18next + react-i18next. **Six UI languages**, listed in `SUPPORTED_LOCALES` (`src/types/i18n.ts`):
Italian (`it`, default) · English (`en`) · Japanese (`ja`) · French (`fr`) · German (`de`) ·
Spanish (`es`). Persistence: `localStorage` key `animeInteractiveMaps.locale` (`I18N_STORAGE_KEY`
in `src/i18n/index.ts`); on first visit the browser's preferred language is matched by base tag
(`fr-CA` → `fr`). UI strings live in `src/i18n/resources/<locale>.ts` — **keep keys in sync across
all six files**; `npm run validate:i18n` diffs every locale against `it` (the reference) and fails
on any missing or orphan key. `it`/`en` are bundled (they are the URL languages and the pre-render
needs them); `ja/fr/de/es` are lazy chunks loaded by `ensureLocaleResources` (`LAZY_RESOURCES` in
`src/i18n/index.ts`). The **URL language** (`/it`, `/en`) decides the content language; the stored
UI preference is applied only when compatible (e.g. `ja` on `/en`), see `src/main.tsx`.

**Source vs UI languages.** Datasets are authored only in the `SOURCE_LOCALES` (`it`/`en`); the four
newer languages translate the *interface* (Spanish also has dataset overlays for the worlds published in `/es`). `LOCALE_FALLBACKS` defines the per-language cascade
(`ja|fr|de|es` → `en` → `it`), so an untranslated dataset field renders in English rather than
Italian. The i18n validator therefore only requires `it`/`en` on `Localizable` fields.

**Data** strings use the `Localizable` type (`string | { it; en; ja?; fr?; de?; es? }` — `it`/`en`
required, the rest optional). Always resolve them through `getLocalizedText(value, locale)` /
`getEntityDisplayName(...)` (`src/utils/localization.ts`) — never place a `Localizable` object
directly in JSX (it would render `[object Object]` and fail type-checking). Enum labels (canon
status, location type, character role/rank, etc.) have localized helpers there, translated in all
six languages; world-specific labels go through `src/lib/worldConfig.ts`, not raw i18n keys.
**IDs, slugs, and keys are never translated.**

**Never hardcode a user-facing string in a component** — including `aria-label`s. Add a key to all
six resource files (or a local `LocalizedText` map resolved via `getLocalizedText`) instead.

**Names of works and entities.** `AnimeWorld.title` is `Localizable`: many titles change per language
(Attack on Titan → L'Attacco dei Giganti → 進撃の巨人), others don't (Naruto, One Piece) — a plain
string is fine there. `Character` now has `localizedName` like every other entity; populate it **only
when the name actually diverges** between dubs (Crilin / Krillin / Krilin), since identical names
resolve correctly through the fallback anyway. `getEntityDisplayName` resolves, in order: exact
`localizedName` for the locale → exact `name` → **`japaneseName` when the locale is `ja`** (the
datasets already carry it for ~690 entities) → the usual fallback cascade. So adding `japaneseName`
to an entity automatically gives it a real Japanese display name.

**Tags are keys, not text.** `series.ts` filters on `'boruto-era'` and search scores over tags, so
tag *values* are never translated. `getTagLabel(tag, locale)` (`src/lib/tagLabels.ts`) resolves the
displayed label: known-tag map → `humanizeId`. Tags that are SHOWN (nations, boundaries, worlds) must be in
`TAG_LABELS` (`i18n:audit` checks it); a proper noun is a plain string there (`akatsuki: 'Akatsuki'`), the same
in every language on purpose. Tags used only for search/filters need no label.

**Names per language.** Every displayed name is translatable in every language: character names, aliases/epithets,
descriptive ranks, kekkei genkai and member labels are `Localizable` (a plain string = same everywhere) and are
overlay keys too (`characters[id].name`, `.aliases[N]`, `.rank`…). Source-language (it/en) names that differ from
`name` — official dub/edition names (Crilin/Krillin, Terzo Raikage, Clan Uzumaki) — live in
`src/data/<world>/names.ts` with the same keys, applied by `withSourceNames` in the world's `index.ts`; Spanish
names go in the es overlay. Data-derived labels (types, races, roles, ranks, faction types, seals, classifications)
come from the world config or the exported `*_LABELS` maps in `src/utils/localization.ts`.

**Measuring coverage.** `npm run validate:i18n` prints, per world and per entity kind, how many
`Localizable` fields are translated in each language, plus how many entities carry a `japaneseName`.
Dataset coverage is *informative*, not blocking: narrative content is authored in IT/EN and the other
languages fall back to English. The UI-key check is the blocking part.

**Dataset translation overlays (es).** A non-source language with its own URLs gets its dataset text from
`src/data/<slug>/i18n/<locale>.ts` (key = path of the `Localizable`, array items addressed by `id`, e.g.
`characters[char-naruto].shortDescription`; plain descriptive names via `factions[clan-uchiha].name`), a lazy chunk
applied in place by `ensureWorldTranslation` (`src/data/registry.ts`, engine in `src/data/shared/translations.ts`) —
pre-render and scripts use `loadWorldDatasetWithTranslations`, the client applies it in `preloadRoute`/`WorldRoute`
before rendering. Never edit dataset files to add `es`; use `npm run i18n:extract` → translate → `npm run i18n:merge`
(`.meta.json` fingerprints the English source so `i18n:status` flags stale translations). An `/es` entity page is
indexable only if EVERY text of the entity is translated; thin-content is measured on the source text. Publishing a
world = 100% overlay + loader in `worldTranslationLoaders` + `translatedLocales: ['es']` in `worlds.ts`. Full guide:
`docs/I18N.md`.

**Adding a language:** add the code to `SUPPORTED_LOCALES` + its `LOCALE_META`/`LOCALE_FALLBACKS`
entries (`src/types/i18n.ts`), create `src/i18n/resources/<code>.ts`, register it in
`LAZY_RESOURCES` (`src/i18n/index.ts`) and in `UI_RESOURCES` (`src/utils/validateI18n.ts`), add its flag to
`src/components/i18n/Flags.tsx` + `LOCALE_FLAG`/`LOCALE_LABEL_KEY` in `LanguageSwitcher.tsx`, a
`languageSwitcher.<language>` key (the endonym) in every resource file, and an `ErrorBoundary`
`STRINGS` entry. A UI-only language gets NO URLs; giving a language its own indexable URLs
(`/xx/...`) requires authoring the datasets in it and adding it to `SOURCE_LOCALES`/`SeoLocale` +
`SEO_STRINGS` (see docs/SEO.md) — never expose URLs whose content is only a fallback.

### Entity images & per-world placeholders
`src/components/common/EntityImage.tsx` renders a themed SVG placeholder per entity. A real image is
used if a **drop-in** file named `<entityId>.<ext>` exists under
`src/assets/worlds/<slug>/{characters,jutsu,clans,locations,arcs}/` (auto-discovered at build time via
`import.meta.glob`, for ALL worlds). World logos: `src/assets/worlds/logos/<slug>.png`. World cursor:
`src/utils/worldCursor.ts`.

**The generated placeholders are per-world.** They used to be drawn on Naruto's visual codes (ninja
headband on characters, chakra swirl on techniques) and were reused for every world — a straw-hat
pirate got a forehead protector. Now each world declares its own symbols in the registry
`src/lib/worldPlaceholders.ts`:
- `WORLD_STYLES[slug]` picks a **motif** per kind — `character` (headband · straw hat · spiky hair ·
  Nen aura · grimoire · hood · blade · …), `ability` (chakra swirl · devil fruit · ki orb · Nen
  hexagram · magic circle · slash · …) and `emblem` (crest · Jolly Roger · dragon ball · Hunter badge ·
  squad banner · wings · …), drawn by `src/components/common/entityArt.tsx`. All shapes are **original
  geometry**, never official artwork (see Copyright below).
- `ink` is the world's signature colour used *inside* the motif (straw gold, ki orange, Nen cyan,
  grimoire gold), so the symbol stays recognisable whatever the entity's tint.
- Background tints derive from the world's own `theme` (`primary/accent/highlight` in `worlds.ts`) via
  `getWorldEntityColor`, with a per-kind slot (`DEFAULT_TINT`, overridable per world through `tint`)
  and a **narrow** deterministic hue jitter — entities differ from each other without leaving the
  world's palette.
- Per-entity colour overrides live in `WORLD_ENTITY_COLORS`, **scoped by world**: Naruto's chakra
  natures / villages / clans tint only Naruto (Dragon Ball reuses attribute ids like `wind` with a
  different meaning, and used to inherit Naruto's greens).

`EntityImage` resolves the world from `useWorldStore` (optional `worldSlug` prop overrides it for
cross-world cards), so call sites don't change. A world absent from the registry falls back to neutral
motifs but still gets its own palette — **adding an anime needs no component edits**; add an entry only
to give it dedicated symbols. Location silhouettes stay driven by `LocationType` (world-agnostic) and
cover `planet`/`dimension`/`ruins`/`hideout` too, so cosmic worlds don't render village rooftops.

## SEO architecture (MANDATORY — read `docs/SEO.md`)

AniMapVerse is **SEO-first**: every public page is pre-rendered (SSG) into real HTML with its own
metadata, and every indexable entity has a stable URL. The whole layer lives in `src/seo/` and is
**data-driven**: never hand-write SEO for a single world/entity/page.

- **URLs** (`src/seo/paths.ts`): `/{lang}/{world}/{category}/{slug}` with `lang ∈ it|en|es`
  (`SEO_LOCALES`; it/en = dataset source languages, every world exists in both; **es** has its own home/
  static pages but a world exists in `/es` only if listed in `AnimeWorld.translatedLocales` with a
  translation overlay — otherwise `worldPath('es', w)` falls back to `/en` and `/es/<world>` is a 404;
  ja/fr/de are UI-only and live on `/en`. See docs/I18N.md), English
  segments for both languages, lowercase, no trailing slash, no query. Build every internal link
  with the path helpers (`worldPath`, `mapPath`, `categoryPath`, `entityPath`, `refPath` for graph
  refs) + `useSeoLang()`. Never concatenate `/worlds/...` or use `world.slug` in a URL.
- **Slugs are permanent and language-independent** (same slug on `/it` and `/en`). `src/seo/slug.ts` is
  the only slug source: precedence `entity.slug` (pin) → the **published lock** `src/data/<world>/slugs.ts`
  (`SeoSlugLock`, wired as `seoSlugs` in the dataset; generated by `npm run seo:slugs`, never hand-edited) →
  derived from the English name (new entities only). Translating or renaming an entity therefore never
  moves its URL. To change a URL on purpose, set `slug: 'new'` and run `npm run seo:slugs` → the old slug
  becomes a permanent redirect in the lock (no chains; `test:seo` checks). Retired slugs stay reserved.
  After adding entities run `npm run seo:slugs` and commit `slugs.ts` (`validate:data` fails on
  `slug_not_locked`, `test:seo` on any unlocked entity).
- **IT/EN localization is mandatory for SEO content**: every narrative `Localizable` field is written
  `{ it, en }` (schema: `src/utils/localizableFields.ts` — `text` fields must be `{ it, en }`, `name` fields
  may stay plain when identical). A plain string counts as Italian-only → the `/en` page would be `noindex`.
  Blocking checks: `validate:i18n` (plain_string / missing_it / missing_en / empty), `test:seo`,
  `seo:check` (no indexable `/en` page with an Italian description). `noindexReason()` explains every
  exclusion (`legal_page`, `coming_soon`, `thin_content`, `not_translated`); prerender prints the per-language summary.
- **Canonical to another resource** (`canonicalTargetPath`, `src/seo/metadata.ts`): a page that is a projection of
  another indexable page keeps `index, follow` but its `rel=canonical` points to that page and it is excluded from
  sitemap + hreflang (never combine noindex with a cross-page canonical). Today: **derived journeys**
  (`isDerivedJourney`) → their protagonist's character page, which renders the same events in order. Hand-written
  journeys stay self-canonical. `seo:check` verifies the target exists, is indexable and self-canonical.
- **Sitemaps carry no `lastmod`**: there is no verifiable per-URL modification date (the old per-world git date
  marked every page of a world as changed, and in shallow CI clones became an unrelated commit's date). Only add
  it back with a per-URL source; `seo:check` fails on a sitemap whose URLs all share one `lastmod`.
- **Existence = `resolveSeoPath`** (`src/seo/metadata.ts`): the router, the pre-renderer and the
  sitemap all use it. Unknown paths must render `NotFoundPage` (real 404 via `404.html`) — never a
  silent `<Navigate>` to the map (soft-404).
- **Metadata** come only from `buildPageMeta` (title/description in `src/seo/strings.ts`, IT/EN),
  applied by `<Seo resolved=… />` on the client and `renderHeadHtml` at build. Do not add
  `<title>`/meta/canonical tags anywhere else (managed tags carry `data-seo`).
  **Browser-tab title** (`buildTabTitle`, `src/seo/tabTitle.ts`): after hydration `<Seo>` sets `document.title`
  to a short, per-section label in the UI language ("Mappe interattive" on the home, "Naruto — Mappa",
  "Naruto — Personaggi", same labels as the header tabs). Entity pages and 404 return `null` and keep the SEO
  title (a generic title repeated on hundreds of pages would be a duplicate for Google, which reads the JS title).
  The pre-rendered `<title>`, Open Graph and JSON-LD stay the descriptive `buildPageMeta` ones.
- **Index/noindex** (`isIndexable`, `src/seo/quality.ts`): entity pages are indexable only above a
  content threshold AND when their text truly exists in that language (a plain-string
  `Localizable` counts as Italian). hreflang lists only indexable versions (reciprocal); noindex
  pages are excluded from the sitemap. Legal pages, coming-soon worlds, 404 and query URLs are noindex.
- **Internal linking**: SEO-relevant relations must be real `<a href>` (`Link`), not `onClick`
  only. Archive cards use `CardLink` (href to the entity page, click still opens the modal).
  Graph relations → `RefLinks`/`refPath`. Every page renders `Breadcrumbs` (same trail as JSON-LD).
- **Structured data** (`src/seo/schema.ts`): only WebSite/Organization/WebPage/CollectionPage/
  AboutPage/BreadcrumbList + `about` (the work as `CreativeWorkSeries`, author/publisher only from
  `AnimeWorld.metadata`; entities as `Thing`). Never invent ratings, dates, authors or ownership:
  AniMapVerse is the site, the works belong to their owners.
- **SSR-safety**: page components must render identically on server and first client render
  (no `window`/`localStorage` during render, browser-only UI behind `useHydrated`). Route chunks are
  declared in `src/routes/lazyPages.tsx` with `lazyWithPreload` so `main.tsx`/`entry-server.tsx`
  preload them (hydration without fallback flashes). One `<h1>` per page (map page: sr-only).
- **Technical routes** (`/og/*`, `/share/*`, `/social/*`, `/render/*`) are reserved and never
  indexable (robots + X-Robots-Tag + excluded from sitemap). Put future social-card assets there.

**Checklist for EVERY new feature / entity type / page** — evaluate and implement:
SEO URL · metadata (title + description, IT/EN) · canonical · hreflang · sitemap inclusion ·
internal links (real anchors, breadcrumbs) · structured data (only if truthful) · index/noindex ·
SSR-safety of the first render. Then `npm run build` must pass (`test:seo` + `seo:check` are
blocking) and, for UI changes, `npm run smoke`.

## Social engine — INTERNAL ONLY (read `docs/SOCIAL_ENGINE.md` + `docs/SOCIAL_AGENT_CONTRACT.md` + `docs/SOCIAL_PUBLISHING_CONTRACT.md` + `docs/SOCIAL_ANALYTICS_CONTRACT.md`)

`tools/social-engine/` is a **private** Remotion tool + file-based content pipeline that renders vertical
videos (1080×1920 H.264, Shorts/TikTok/Reels) from the site's datasets. **SOCIAL ENGINE IS INTERNAL ONLY.**

**FINAL ARCHITECTURE** — two external ChatGPT Work agents, the repository is the source of truth:
- **Social (Content) Agent** → PR with queue JSON (`Social validate` workflow, read-only) → merge → `Social render`
  workflow (GitHub Actions = the cloud renderer, `ubuntu-latest`, same npm scripts as local) → Remotion → MP4
  **workflow artifact** `animapverse-social-render-<run_id>-<attempt>` (`videos/`, `manifests/`, `render-summary.json`)
  → state commit by `github-actions[bot]` (history record gets `artifact`: name, run, paths, sha256, expiresAt).
- **Publishing Agent** (ChatGPT Work + Metricool plugin) → reads `catalog.publishing.ready` → downloads the artifact →
  schedules/publishes via Metricool → PR adding a **publication receipt** in `publication/pending/` (`Social
  publication validate`, read-only) → merge → `Social publication state` workflow applies it → history `platforms[]`
  + catalog updated, receipt archived in `publication/applied/` → a render × platform is never scheduled twice.
- **Analyst Agent** (ChatGPT Work + Metricool) → PR adding **analytics snapshots** in `analytics/pending/` → same
  validate/state workflows → `analytics/metrics.json` → `catalog/performance.json` + `catalog/next.json`.

**GROWTH ENGINE** (`growth/`, docs/SOCIAL_ENGINE.md › Growth Engine) — the repo decides WHAT comes next, deterministically:
CONTENT → PUBLISH → ANALYTICS → PERFORMANCE → SELECTION + DIVERSITY RULES → NEXT CONTENT. The daily Content Agent copies
`catalog/next.json` `request` into ONE queue file (status `blocked` = queue nothing). Formats: `character-journey`,
`guess-character` (clues = journey places, never a place naming the answer; main/major only), `character-versus`
(real counts only: distinct world-map places, arcs break ties; no cross-map distances); `guess-location` /
`journey-comparison` declared, not implemented. Every render also gets a cover (`SocialCover` still).

**SOCIAL ENGINE ARCHITECTURE** — `data` (site datasets, read-only) → `social:catalog` (`catalog/catalog.json`:
what's really renderable + history status) → [future agent, not connected] → JSON requests in
`content/queue/` (contract: `schemas/social-content.schema.json`) → `social:render:queue` (validate → one
Remotion bundle → serial renders) → `output/<anime>_<subject>_<template>_<locale>.mp4` + `.manifest.json`,
content moved to `content/rendered|failed/`, every step in `history/history.json`. Ids:
`contentId = <template>:<anime>:<subject>`, `renderId = <contentId>@<locale>[+<variant>]`. Code: `templates/`
(registry + per-template config/resolve/scan/schema), `pipeline/` (ids, content, queue, enqueue, duplicates,
history, batch, catalog, manifest, lock, fs guards, schema, publication, historyMerge), `render/` (Remotion
session), `cli/`, `ci/` (shared state-commit script), `publication/` (pending/applied/failed receipts + schema), `tests/`.

Permanent rules:
- **Internal only**: no public UI, routes/pages, endpoints/APIs or links; never import `tools/social-engine`
  or `remotion`/`@remotion/*` from `src/` (`social:validate` fails if you do). Remotion stays in
  `devDependencies`, one exact version for all its packages. No public bundle impact.
- **Data-driven**: the engine reads the site's data/helpers through `@/` (registry, slugs, paths,
  `getEntityDisplayName`) and never duplicates or hand-lists content; the catalog is derived from the data
  with the same builder the renderer uses. If logic must be shared, extract it into `src/` without changing
  site behaviour.
- **Agent-ready JSON**: content requests follow `docs/SOCIAL_AGENT_CONTRACT.md` exactly; the JSON Schema is
  generated from the TS constants (`npm run social:schema`) and must stay in sync. Unknown fields are errors.
- **No external/paid APIs**: no OpenAI/Anthropic/other AI calls, no paid video/voice services. **The repository
  never publishes**: no Metricool/Instagram/Facebook/TikTok/YouTube API, SDK, OAuth, token, brand id, account or timezone in
  the repo — publishing is done outside by the Publishing Agent. Default copy = deterministic templates.
- **Publication state** (`pipeline/publication.ts`, docs/SOCIAL_ENGINE.md › Publication State): changed ONLY by
  publication receipts (one event × one platform — `instagram | facebook | tiktok | youtube`, all via Metricool;
  `scheduled | published | failed`; provider enum `metricool`; `providerPostUuid` allows one leading `-`;
  schema generated by `social:schema` into `publication/schemas/`; unknown fields, duplicate keys, bad timestamps/
  URLs are errors). Per-platform state machine: notScheduled → scheduled → published, scheduled → failed → scheduled
  (retry); scheduled → scheduled only for the same provider post (UUID, else id); published → scheduled/failed
  rejected; unknown renderId or renderStatus ≠ rendered rejected; an already-applied receipt id is a no-op.
  `publicationStatus` (`notPublished | scheduled | partiallyPublished | published | failed`) is DERIVED from
  `platforms[]`; scheduled is never published; series parts are independent render ids. Apply is all-or-nothing
  (invalid → `publication/failed/` + `.error.json`, nothing applied). `publication/applied/` is a versioned audit
  trail — never edit it. Old history formats (`platforms: [{platform, publishedAt, url}]`) are migrated on load.
- **Editorial rotation (HARD, never overridden by performance)**: one video per run, EN feed; max 2 consecutive videos
  of the same anime (a cross-world versus counts for both), never the same character twice in a row, journey parts
  in order with ≥ 2 videos between parts. Filters run BEFORE scoring (`growth/rules.ts` → `growth/selector.ts`); soft
  cooldowns (anime/format/character/hook/CTA) + exploration (30 %, seeded) / exploitation (shrunk performance
  estimates) only rank valid candidates; cold start below `minimumSamples`. All knobs in `growth/config.ts` — no
  magic numbers elsewhere. `social:editorial:check` gates renders (Social render); Social validate runs
  `social:editorial:check:selection`: a queued EN video must equal `catalog/next.json` `request` (else red PR).
- **The growth engine is the ONLY selector** (`planNext` in `growth/plan.ts`): no agent, CLI or workflow picks a
  format/character itself (no "today a CharacterJourney"); the daily automation executes `next.json`, whatever the
  content type, routed to its composition by `templateForContentType`. `next.json` statuses: `ready` (queue exactly
  `request`) · `backlog` (an EN render never published / a render in progress → publish it, no new content) ·
  `blocked` (fail-safe). Every decision carries a `SelectionTrace` (`trace`: mode, score, constraints, hard-rule codes,
  excluded candidates + reasons, explanation) — keep it secret-free. Analytics are optional: unreadable/missing
  `metrics.json` → cold start, never a blocker. Never add a second selector or hardcode a format in the agent flow.
- **Hooks / CTAs / captions**: deterministic banks (`growth/hooks.ts`, `growth/ctas.ts`, `growth/metadata.ts`), no AI
  text; engagement-first CTAs (next part always promised; site ≤ 1 in 5); per-network captions + `madeForKids: false`
  stored in history `social` (records older than it have `social: null` and are derived from their content id).
- **Deterministic rendering**: compositions are pure functions of `(data, frame)`; no randomness, no network
  assets, no official artwork or copyrighted music (optional audio = local royalty-free file in `audio/`).
- **History required**: every queued/rendered/failed video is recorded in `history/history.json` (versioned);
  render status and publication status are separate state machines — never edit them around the pipeline.
- **Duplicate prevention required**: the render id is unique; already queued/rendered → rejected, a new
  edition needs a `variant` (`allowRerender` is a human-only override). Never bypass it.
- **Filesystem safety**: paths are built only from validated slugs via `safeJoin`; content never picks a path.
- Templates are listed ONLY in `templates/registry.ts`; a template that lacks data throws `RenderDataError`
  (never renders an empty video). Never commit renders (`output/`, `.cache/`, `audio/*`, `*.mp4` are ignored).
- **GitHub workflows are the cloud renderer** (`.github/workflows/social-render.yml` on push to `main` touching
  `content/queue/**` + manual dispatch with `dry_run`; `social-validate.yml` on PRs, never renders). They call the
  existing npm scripts only — never put engine/validation logic in YAML, never add a second renderer. PRs never render;
  no `pull_request_target`, no secrets, no PAT (`GITHUB_TOKEN`, `contents: write` only on the render job).
- **MP4 never committed**: videos leave the runner only as workflow artifacts.
- **Queue JSON are untrusted input**: always validated by the engine (schema, data, duplicates, path guards).
- **History must persist**: the render job commits `history/`, `content/`, `catalog/` back (only those paths), also on
  partial failure; the publication-state job commits `history/`, `publication/`, `catalog/`. Both go through
  `ci/commit-state.sh`, which rebases with the field-level `history.json` merge driver (`.gitattributes`,
  `cli/merge-history.ts`) if the other workflow committed meanwhile — never hand-merge history.
- **No workflow loops**: state commits are pushed with `GITHUB_TOKEN` (never triggers workflows), carry
  `[skip social-render]` / `[skip social-publication]` + `[skip ci]`, and the jobs skip `github-actions[bot]` commits.
  Keep all three guards. Publication: own concurrency group `animapverse-social-publication-state`, no cancel;
  `social-publication-validate.yml` (PR, read-only) also enforces that a receipt PR only ADDS `publication/pending/*.json`.
- Fonts come only from the bundled `@fontsource` packages (all subsets), never the OS: Windows and Linux renders match.
- **CharacterJourney series**: a journey of ≤ 8 places (after projection + same-pin merge) is ONE video with the
  3-segment id; a longer one is a **chronological, arc-based series** (`data/segments.ts`: effective arc per stop →
  arc groups → global DP partition, target 6 stops, 5–7 ideal, 8 max, small arcs merged, no tiny tail, arcs > 8
  split internally) → `Part 1 / Part 2 / …`, each its own content `…:<subject>:part-NN` (series id = the 3-segment id).
  The catalog decides which parts exist; requests must name `segment` for a series. Never re-sample a whole journey,
  never hand-pick parts. `part-NN` belongs to `SEGMENTATION_VERSION` 1 — a new algorithm must bump the version
  (keys `part-NN-vN`) so old ids never change meaning. Route/camera/recap use only the part's stops.
- **Dynamic duration**: the engine computes it (`recommendedDurationSeconds` = round(13.5 + 2.75 × stops), 24–38 s;
  4→25 · 5→27 · 6→30 · 7→33 · 8→36); the timeline keeps hook/intro/CTA fixed and gives the rest to the stops
  (~2.8 s each). More places → more parts, never longer videos. Agents omit `durationSeconds`.
- After changing it: `npm run social:validate` (+ `social:catalog`/`social:schema` when data/limits change, and a
  `--dry-run`/`--still` render) and `npm run build` (the public build must stay unaffected).

## Data & content conventions

- When adding/removing an entity, update every referencing id array and run `validate:data`.
- **Write every new narrative text in both `it` and `en`** as `{ it: '…', en: '…' }` — never a plain
  string, never Italian-only (content is no longer authored "just in Italian"): an entity whose text exists
  only in one language gets a `noindex` page in the other and `validate:i18n` / `test:seo` fail. Keep
  canonical names (Uchiha, Akatsuki, Konohagakure, Rasengan); add `localizedName: { it, en }` only when the
  name really differs between dubs. New `Localizable` fields must be added to `LOCALIZABLE_FIELDS`.
- `canonStatus` / `referenceStatus`: mark uncertain data `referenceStatus: 'needs_verification'`
  and anime/movie-only content with the matching `canonStatus`. Never present uncertain data as
  hard canon.
- **Copyright**: do not download or embed copyrighted images. Use locally-generated SVG
  placeholders or clearly-licensed assets only. Every `AssetReference` must carry `license`,
  `author`, `source`, and `url`. Narrative data are "seed" content to be verified before publishing.

## Adding a new world

1. Register the world in `src/data/worlds.ts` (id, slug, **`urlSlug`** — kebab-case, permanent —,
   `status`, `theme`, map level ids, real `metadata.author/publisher`) and add its
   `config: WorldConfig` (power-system `term`/categories, ranks, roles, facet terms, featured).
2. Create `src/data/<slug>/` with the entity files (`assets`, `mapLevels`, `mapConstants`, `nations`,
   `boundaries`, `locations`, `characters`, `factions`/`clans`, `arcs`, `events`, `routes`, abilities…)
   and an `index.ts` exporting `<slug>Dataset: WorldDataset`.
3. Add its loader in `src/data/registry.ts` and flip `status` to `'available'` in `worlds.ts`.
   Write all narrative fields as `{ it, en }`.
4. Run `npm run seo:slugs`, import the generated `slugs.ts` in the dataset (`seoSlugs: <slug>Slugs`), then
   `npm run validate:data`, `npm run validate:i18n` and `npm run build` (all must pass). No SEO work is needed: landing,
   map, indexes, entity pages, timeline, IT/EN metadata, hreflang, `sitemap-<world>.xml`, header and
   home links and `llms.txt` are generated from the data.
