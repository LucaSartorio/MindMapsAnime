---
paths:
  - "src/data/**"
  - "src/types/**"
  - "src/utils/{validateDataset,buildIndexes}.ts"
  - "src/lib/{worldConfig,battles,familyTree,series}.ts"
  - "scripts/{validate-data,chapter-coverage,data-coverage}.ts"
  - "docs/world-pipeline/**"
---

# Datasets: structure, WorldConfig, integrity, conventions

Moved verbatim from `CLAUDE.md`. Content is **seed data to verify**: never invent facts, mark uncertain data
`referenceStatus: 'needs_verification'`, record sources in `docs/world-pipeline/<slug>.md` (see its README).
Deterministic checks first: `npm run validate:data`, `npm run data:coverage -- <slug>`, `npm run coverage:chapters -- <slug>`.
A world under construction = `status: 'coming_soon'` + a loader in `registry.ts`: private everywhere, but already
validated by `validate:data` (integrity; SEO slug checks only after publication) and `validate:i18n` (IT/EN).

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
