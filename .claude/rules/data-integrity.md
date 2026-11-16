---
paths:
  - "src/data/**"
  - "src/types/**"
  - "src/utils/{validateDataset,buildIndexes}.ts"
  - "src/lib/{worldConfig,battles,familyTree,series}.ts"
  - "scripts/{validate-data,chapter-coverage,data-coverage}.ts"
  - "docs/world-pipeline/**"
---

# Datasets — constraints

How it works: `docs/ARCHITECTURE.md` › Datasets. Content is **seed data to verify**: never invent facts; sources and
progress of a world live in `docs/world-pipeline/<slug>.md` (README there). Deterministic checks first:
`npm run validate:data`, `npm run data:coverage -- <slug>`, `npm run coverage:chapters -- <slug>`.

- **Shape and registration**: `WorldDataset` (`src/types/index.ts`); world metadata + `config: WorldConfig` in
  `src/data/worlds.ts`; `src/data/<slug>/index.ts` exports `<slug>Dataset`; lazy loader in `src/data/registry.ts`
  (internal slug). Two permanent slugs: `slug` (data, assets, registry) and `urlSlug` (public URL) — never build a URL
  from `world.slug`. A world under construction = `status: 'coming_soon'` + a loader: private everywhere (site,
  sitemap, social catalog require `available`) but validated by `validate:data` (integrity; SEO slug checks only after
  publication) and `validate:i18n`.
- **References by string `id`**: when adding/removing an entity update every referencing array; never rename an id
  (slugs and URLs derive from it). Use `buildIndexes` maps instead of repeated `.find()` in render.
- **`WorldConfig` holds everything that varies per work** (power-system term/categories/attribute, hand seals, rank,
  ranks, roles, nation/places/factions terms, featured, map markers), resolved through `src/lib/worldConfig.ts`;
  label cascade config → known maps (`localization.ts`) → `humanizeId()`. Widened enum fields (`Jutsu.type`,
  `chakraNature`, `classification`, `Character.role`, `ninjaRank`, `Faction.type`) take free strings: never extend a
  global union for one world. Filter/legend options are derived from the data.
- **Per-world kits — follow how the world already does it**: `battles.ts` (`battleKit` → `withBattles`; sides ⊂
  `characterIds`), `family.ts` (`familyKit` → `withFamily`; one side of parents/spouses is enough), `structure.ts`
  (`factionKit` `m()`/`x()` → `withFactionExtras`), `markerTags.ts` (`withEventTags`), `names.ts` (`withSourceNames`:
  official it/en names that differ), `appearance.ts` (applied last). Large kinds are split in several files merged in
  `index.ts`. Derived journeys (`autoJourneys.ts`) exist for main/major characters without a hand-written route.

## Data & content conventions

- When adding/removing an entity, update every referencing id array and run `validate:data`.
- **Write every new narrative text in both `it` and `en`** as `{ it: '…', en: '…' }` — never a plain
  string, never Italian-only: an entity whose text exists only in one language gets a `noindex` page in the other
  and `validate:i18n` / `test:seo` fail. Keep canonical names (Uchiha, Akatsuki, Konohagakure, Rasengan); add
  `localizedName: { it, en }` only when the name really differs between dubs. New `Localizable` fields must be added
  to `LOCALIZABLE_FIELDS`.
- `canonStatus` (`canon | anime_only | movie | filler | novel | uncertain`) / `referenceStatus` (`verified |
  needs_verification | unknown`): mark uncertain data `needs_verification` and anime/movie-only content with the
  matching `canonStatus`. Never present uncertain data as hard canon.
- **Copyright**: do not download or embed copyrighted images. Use locally-generated SVG placeholders or
  clearly-licensed assets only. Every `AssetReference` must carry `license`, `author`, `source`, and `url`.

## Adding a new world (use `/add-anime-world`, which runs these steps in resumable batches)

1. Register the world in `src/data/worlds.ts` (id, slug, **`urlSlug`** — kebab-case, permanent —, `status`, `theme`,
   map level ids, real `metadata.author/publisher`) and its `config: WorldConfig`.
2. Create `src/data/<slug>/` with the entity files and an `index.ts` exporting `<slug>Dataset: WorldDataset`.
3. Add its loader in `src/data/registry.ts`; flip `status` to `'available'` only when the world is ready and the
   owner approves. Write all narrative fields as `{ it, en }`.
4. Run `npm run seo:slugs`, import the generated `slugs.ts` (`seoSlugs: <slug>Slugs`), then `npm run validate:data`,
   `npm run validate:i18n` and `npm run build`. No SEO work is needed: pages, metadata, hreflang, sitemap, header and
   home links and `llms.txt` are generated from the data.

Checks: `validate:data` → `validate:i18n` → `seo:slugs` + `i18n:index` after adding entities → `build`.
