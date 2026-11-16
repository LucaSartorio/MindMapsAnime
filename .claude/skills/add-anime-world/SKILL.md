---
name: add-anime-world
description: Create a new anime/manga world in resumable, verified batches (sources, canon perimeter, dataset, map, IT/EN, private until approved). Use for "aggiungi <anime>", "add <manga> world", or to resume one.
argument-hint: <world slug, url slug or title> [resume]
---

# Add an anime world: $ARGUMENTS

Goal: maximum **verifiable** coverage, never an artificial 100 %. The site must stay green after every batch and
the world stays unpublished (`status: 'coming_soon'`) until the publication gate (batch 12) passes.

## 0. Resolve and resume
1. Resolve the world against `src/data/worlds.ts` (`slug`, `urlSlug` or title). If it is registered as
   `coming_soon`, reuse its `slug`/`urlSlug` (permanent - never change them). If it is not registered, propose
   `slug` (lowercase, no dashes) + `urlSlug` (kebab-case) and confirm with the owner before writing.
2. Open `docs/world-pipeline/<slug>.md`. If it exists, **resume** from its first batch not marked `done`; never redo a
   `done` batch. If it does not exist, create it from `docs/world-pipeline/README.md` (template section).
3. `npm run data:coverage -- <slug>` shows whether a dataset already exists.
4. While the world is `coming_soon` **with a loader in `registry.ts`** it is "in progress": private everywhere (site,
   sitemap, social catalog all require `status: 'available'`), but `npm run validate:data` and `npm run validate:i18n`
   already check it (integrity + IT/EN), so `main` stays green batch after batch. SEO slug locks and thin-content
   checks start at publication (batch 12). If the world is already registered (e.g. `fullmetalalchemist`), extend its
   entry: keep `id`/`slug`/`urlSlug`, review `config`/`theme`, fill `availableMapLevelIds`/default level in batch 2.

## 1. Discovery (no data written yet) → manifest sections "Scope" and "Sources"
- Identify the work: original title, Japanese title, author, publisher, years, adaptations (manga, anime series,
  reboots such as FMA 2003 vs Brotherhood, films, spin-offs). **Pick one canon perimeter** (usually the manga) and
  record how adaptations are flagged (`canonStatus`). Never merge incompatible continuities.
- Map the work onto the real model (`src/types/index.ts`, `.claude/rules/data-integrity.md`): power system term
  and categories (`config.ability`), rank system, roles, nation/places/factions terms, map levels needed, which
  optional kinds make sense (teams, tournaments, battles, family, structure). Skip categories with no real use.
- Sources (preference order): official material → databooks/editorial → official adaptation material →
  reputable secondary sources → community wikis for discovery only. Respect licences, robots, rate limits; never
  bypass protections; never copy prose or images. Model memory is never a source.
- Research tools: delegate research to `anime-data-curator` (its allowlist has WebSearch + WebFetch; a tool missing
  on the current surface is silently dropped, so check what it actually used). If web tools are unavailable, in
  Claude Code Cloud the orchestrator may read pages with the harness-provided `web-fetch` agent type (present only
  where WebFetch is missing; it is not a repo agent) and hand URLs + extracted facts to the curator. Otherwise
  stop at a source plan and say so: no data without a consulted source.

## 2. Batches (default order; adapt per world, one batch per step, each resumable)
| # | Batch | Owner | Exit check |
|---|---|---|---|
| 1 | `worlds.ts` entry (status stays `coming_soon`), `WorldConfig`, theme, `metadata.author/publisher`, `src/data/<slug>/` skeleton + `index.ts` + loader in `registry.ts` | orchestrator (built-in `Plan` agent if config needs new shapes) | `npx tsc -b`, `npm run validate:data` |
| 2 | Map levels + map plan: original SVG via a new `scripts/mapgen/<slug>.py` on `kit.py` (or a clearly licensed asset) | map-engineer | generator runs, preview checked, viewBox recorded in `mapConstants.ts` |
| 3 | Main characters (main/major) | anime-data-curator | validate:data + validate:i18n |
| 4 | Places, nations/regions (pins from the generator) | anime-data-curator + map-engineer | validate:data, coordinates in range |
| 5 | Arcs/sagas in order | anime-data-curator | validate:data |
| 6 | Timeline events (with `mangaChapters`) | anime-data-curator | validate:data, `coverage:chapters -- <slug>` |
| 7 | Factions/teams/structure, relations, family | anime-data-curator | validate:data |
| 8 | Battles, tournaments, map markers (`markerTags.ts`) | anime-data-curator | validate:data |
| 9 | Power system (abilities) | anime-data-curator | validate:data |
| 10 | Routes/journeys, secondary characters, enrichment, `appearance.ts` portraits for main/major | curator + frontend for art checks | data:coverage gaps reviewed |
| 11 | Translations: `{ it, en }` everywhere; es/fr overlays only if the owner wants the world on /es /fr (`/sync-translations`) | curator | validate:i18n, i18n:audit |
| 12 | Publication gate: `npm run seo:slugs` + import `slugs.ts`, `npm run i18n:index`, flip `status: 'available'` **only with owner approval**, full `npm run build` + `npm run smoke`, `seo-growth-engineer` spot check | qa-performance-engineer + seo-growth-engineer | build + smoke green |

Batch rules: write ids with the world prefix (`char-<abbr>-…`), never rename an existing id, every narrative
text `{ it, en }`, uncertain → `referenceStatus: 'needs_verification'`, filler/anime-only/movie → `canonStatus`.
Allowed values (`src/types/index.ts`): `canonStatus` = `canon | anime_only | movie | filler | novel | uncertain`;
`referenceStatus` = `verified | needs_verification | unknown`.
Large kinds go in several files (`charactersBatch1.ts`…) merged in `index.ts`, like existing worlds.

## 3. Checkpoint after EVERY batch (this is what makes the work resumable)
Update `docs/world-pipeline/<slug>.md`: batch status (`done` / `in-progress` / `blocked`), entity counts,
sources used, ledger entries for disputed/unverified facts, open errors, next step. Commit the batch
(`feat(<slug>): batch N - <what>`). A Cloud session can end at any time: the manifest + git history are the
state, never the conversation.

## 4. Done / report
Report: entity counts per kind (from `npm run data:coverage -- <slug>`), verified vs needs_verification, sources,
gaps and disputes, map status, languages, SEO pages indexable vs noindex, checks run with results, residual issues.
Do not mark the world complete just because it compiles. Never publish (flip `status`) without the owner's go-ahead.
