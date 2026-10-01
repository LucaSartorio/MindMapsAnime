# Social Engine (internal video renderer)

> **INTERNAL ONLY.** A private developer tool that renders vertical videos
> (YouTube Shorts / TikTok / Instagram Reels) from the AniMapVerse datasets.
> It is **not** part of the public site: no routes, no UI, no endpoints, no code
> in the Vite bundle. It runs only through local npm scripts.

```
AniMapVerse data (src/data, src/seo, src/utils)   read-only, same registry/helpers as the site
        ↓
social:catalog ──► catalog/catalog.json            what can REALLY be produced (+ history status)
        ↓
[ future content agent — not connected ]           reads catalog + history, writes JSON requests
        ↓                                           contract: docs/SOCIAL_AGENT_CONTRACT.md
social:queue / drop JSON ──► content/queue/*.json  validated, de-duplicated, canonical
        ↓
social:render:queue ──► template → Remotion ──► output/<stem>.mp4 + <stem>.manifest.json
        ↓                                           (failures → content/failed/ + .error.json)
history/history.json                               render status (+ reserved publication fields)
```

The same engine runs locally (Windows/macOS/Linux) and in the cloud
(**GitHub Actions**, see [Cloud rendering](#cloud-rendering)): no second renderer,
no CI-specific logic. **No AI/API is called and nothing is published.**

## Commands

```bash
# discover
npm run social:catalog                 # scan the datasets → catalog/catalog.json + excluded.json (+ summary)

# queue
npm run social:queue -- --template character-journey --anime naruto --character sasuke-uchiha --locale en
npm run social:queue -- --from proposal.json     # one request or an ARRAY (agent output)
npm run social:queue -- --list                   # queue / failed / rendered / history counts
npm run social:validate:queue                    # check every queued file, render nothing

# render
npm run social:render:queue -- --dry-run         # plan only: nothing rendered, nothing changed
npm run social:render:queue:dry                  # same, without npm argument forwarding (npm 11 / Windows-safe)
npm run social:render:queue                      # render the whole queue, in order
npm run social:render:queue -- --id character-journey:naruto:itachi-uchiha@en --limit 1
npm run social:retry:failed                      # failed → queue → render (or --id <renderId>, --requeue-only)

# develop
npm run social:render -- --config tools/social-engine/examples/itachi-character-journey.json   # ad-hoc preview
npm run social:render -- --template character-journey --anime naruto --character itachi --still 40,200,520
npm run social:studio                            # Remotion Studio
npm run social:schema                            # regenerate schemas/social-content.schema.json
npm run social:validate                          # typecheck + 50 engine/pipeline tests
npm run social:ci:report                         # artifact folder + report from the last batch (CI; works locally too)
```

Ad-hoc `social:render` (flags: `--locale --hook --cta --duration --max-stops --variant --audio
--out --still --frames --concurrency --browser-executable --dry-run`) writes to
`output/preview/` and is **not recorded in history** — anything meant for publishing goes
through the queue.

Exit codes (all CLIs): `0` ok · `1` invalid content/data, rejected or failed items, render
failure · `2` usage error.

## Output

```
tools/social-engine/output/
  naruto_itachi-uchiha_character-journey_en.mp4
  naruto_itachi-uchiha_character-journey_en.manifest.json
  preview/…                                   (ad-hoc renders and stills)
```

- Name: `<anime>_<subject>_<template>_<locale>[_<variant>]` — built only from validated slugs.
- 1080×1920 (9:16), 30 fps, H.264 High, `yuv420p`, CRF 18, no audio track unless configured.
- Manifest: content/render ids, template, anime, subject, locale, variant, duration, frames,
  resolution, `renderedAt`, file size + sha256, publication facts (title, hook, CTA, page URL,
  stops) and the source config — what a future publisher/analytics step needs.
- Same request + same data → same video (no randomness, no network, no AI; verified
  byte-identical across runs).

## Architecture

```
tools/social-engine/
  index.ts · Root.tsx · remotion.config.ts · tsconfig.json     Remotion entry / Studio
  config/        shared types, defaults, deterministic copy (en/it), schema helpers
  data/          read-only adapters over the site data (world registry, slugs, sub-map
                 projection, journey builder + sampling)
  lib/ · components/    camera, easing, geometry, fonts, theme · shared video components
  templates/     registry.ts (THE list) · types.ts (contract) · characterJourney/
                 (config, resolve, catalog scan, timeline, camera, composition)
  pipeline/      ids · content (request parsing/planning) · queue · enqueue · duplicates ·
                 history · batch (+ retry) · catalog · manifest · lock · fs (path guards) ·
                 schema (JSON Schema generator) · dirs
  render/        paths · webpack alias · session (one shared Remotion bundle per run)
  cli/           render · catalog · queue · validate-queue · render-queue · schema · args · common
  tests/         harness · engine.test · pipeline.test · run
  ── source, versioned ───────────────────────────────────────────────
  catalog/       catalog.json (agent menu) · excluded.json (with reasons)
  content/       queue/ · rendered/ · failed/ (+ .error.json) · archive/
  history/       history.json
  schemas/       social-content.schema.json
  examples/      itachi-character-journey.json (Studio default) · agent-response.json
  ── runtime, git-ignored ────────────────────────────────────────────
  output/        MP4 + manifests (+ preview/)
  .cache/        Remotion bundle, staged public assets, queue.lock
  audio/         local royalty-free tracks (README versioned)
```

Key design points:

- **No duplicated data.** The engine imports the site's own modules through the
  `@/` alias: `src/data/registry.ts` (lazy datasets), `src/data/worlds.ts`,
  `src/seo/slug.ts` (public slugs), `src/seo/paths.ts` (the link shown in the
  CTA), `src/utils/localization.ts` (`getEntityDisplayName`, `getLocalizedText`).
  The site never imports the engine (checked by `social:validate`).
- **Resolve in Node, draw in React.** `template.resolve(config)` turns a config
  into fully localized, serializable data (or throws a clear `RenderDataError`).
  The composition is a pure function of `(data, frame)`. The CLI resolves in
  Node and passes the data as input props; the Studio resolves the same way in
  `calculateMetadata`.
- **Native map renderer, not a screenshot.** `MapStage` draws the world-map
  image of the base `MapLevel` in the SAME viewBox as the site's pins, with a
  camera (pan/zoom). The site's React Flow canvas is untouched (it is built for
  browser interaction, not frame rendering). Worlds without a map image fall
  back to their boundary paths on a dark plane.
- **Automatic camera.** Keyframes are generated from the stop coordinates:
  establishing shot → fly to each stop (zoom from the distance to the previous
  stop, slight zoom-out mid-flight, slow push-in while dwelling) → pull back to
  frame the whole route above the recap panel. Cameras are clamped so empty
  space past the map edge isn't shown, while keeping the subject in the safe area.
- **Performance.** Glows are stacked translucent strokes, not SVG/CSS blur
  filters (software rasterization made a 22 s render take 20+ min; now ~1.5 min).
- **One bundle per run.** A batch validates everything first, stages the union of the
  assets, bundles once and renders the videos one at a time.
- **Bundle isolation.** Remotion packages are `devDependencies`; nothing in
  `src/` imports them, so Vite never bundles them (verified on `dist/`).

## Config format

A content request = a video config (`SocialVideoConfig`, `config/types.ts`) + pipeline
fields (`id`, `variant`, `status`, `notes`, `allowRerender` — `pipeline/content.ts`). The
complete, normative description for agents is **[docs/SOCIAL_AGENT_CONTRACT.md](SOCIAL_AGENT_CONTRACT.md)**
and the JSON Schema `tools/social-engine/schemas/social-content.schema.json` (generated from
the TypeScript constants; `social:validate` fails if it drifts). Unknown fields are errors;
every problem is reported at once.

```json
{
  "template": "characterJourney",
  "anime": "naruto",
  "subject": "itachi-uchiha",
  "locale": "en",
  "hook": "How far did Itachi actually travel?",
  "cta": "Explore the full journey on AniMapVerse",
  "durationSeconds": 22,
  "journey": { "maxStops": 6, "includeEvents": true, "routeIds": ["route-itachi"] },
  "highlights": ["loc-akatsuki-hq", "orochimaru-hideout"],
  "audio": { "src": "path/to/royalty-free.mp3", "volume": 0.6 }
}
```

| Field | Required | Default / notes |
| --- | --- | --- |
| `template` | ✔ | `characterJourney` (CLI alias `character-journey`) |
| `anime` | ✔ | internal slug (`hunterxhunter`) or URL slug (`hunter-x-hunter`); must be `available` |
| `subject` | ✔ | SEO slug (`itachi-uchiha`), id (`char-itachi`), id without prefix (`itachi`) or a unique short form (`luffy`) — normalized to the slug |
| `locale` | | `en` · also `it` (the datasets' source languages) |
| `hook` | | `Follow {name}'s journey across the {anime} world.` / `Segui il viaggio di {name} nel mondo di {anime}.` (≤ 90 chars) |
| `cta` | | `Explore the full journey on AniMapVerse` / `Esplora il percorso completo su AniMapVerse` (≤ 80 chars) |
| `durationSeconds` | | `22` (12–60) |
| `journey.routeIds` | | the character's own routes |
| `journey.includeEvents` | | `true` |
| `journey.maxStops` | | `6` (2–8), further capped by the duration (~1.6 s per stop minimum) |
| `highlights` | | auto: the 3–5 most important stops (ids or SEO slugs; must be on the journey) |
| `audio` | | none. A file inside `tools/social-engine/audio/` only (path-checked), never copyrighted OSTs |
| `variant` | | none. Editorial edition (slug); needed to re-do a video already rendered |
| `notes` | | free text (≤ 500), stored, never rendered |

Default texts are deterministic templates in `config/copy.ts` — no generated text.

## CharacterJourney

Scenes (22 s default; the plan in `templates/characterJourney/timeline.ts` scales with the duration):

| Time | Scene |
| --- | --- |
| 0–2.4 s | **Hook**: kicker (`Naruto · Character Journey`), big 1–2 line text, red underline; blurred map behind |
| 2.4–5.1 s | **Establishing map**: map out of the blur, header (brand, monogram, name, factions), map name + stats |
| 5.1–15.4 s | **Journey**: per stop, the camera flies, the route draws itself, the numbered pin pops and pulses, place label + stop card (title, place, arc, progress) |
| 15.4–19.1 s | **Recap**: camera frames the whole route, 3–5 key locations listed and labelled |
| 19.1–22 s | **CTA**: AniMapVerse mark, CTA, `animapverse.com` + the character's real page path |

**How the journey is built** (`data/journey.ts`, generic for every world):

1. Routes: the character's `routeIds`, routes of `type: 'character'` featuring
   them, or routes whose only protagonist they are (group routes are skipped).
   Steps keep their authored order; steps without an arc take their
   neighbour's position; a route that can't be dated at all is skipped when
   other routes are dated.
2. Events: the character's timeline events with a location extend the journey
   into story arcs the routes don't cover.
3. Everything is sorted by arc order, projected on the world map (sub-map
   places such as the Uchiha District → the Konoha pin) and consecutive stops on
   the same pin are merged.
4. Too many stops → first and last are kept and the middle is split into
   chronological buckets, each keeping its most important stop (never the same
   pin twice in a row). Few stops → each is capped at 2.8 s and the spare time
   goes to the intro/recap/CTA.

If there is no journey (no route, no located event) or only one place, the
render fails with e.g.
`Cannot render CharacterJourney: journey data missing for character "char-teuchi"` —
an empty video is never produced. Today 180 characters across the 5 worlds have
a renderable journey (Itachi, Sasuke, Kakashi, Naruto, Luffy, Zoro, Gon, Killua, Asta…).

**Portraits.** Official artwork is never pulled in. The header uses a monogram
(initials) in the brand style, so the template works for every character.

## Adding a template

1. Create `templates/<id>/` with `config.ts` (parse its fields with the helpers
   in `config/schema.ts`), `resolve.ts` (config → serializable data, throwing
   `RenderDataError` when data is missing), the React composition, and an
   `index.tsx` exporting a `TemplateDefinition` (id, compositionId, cliName,
   example, parseConfig, resolve, Composition).
2. Add its config type to `SocialVideoConfig` / `TemplateId` (`config/types.ts`).
3. Implement the pipeline hooks of `TemplateDefinition`: `configKeys`, `configFor`
   (queue CLI), `scan` (catalog: candidates + exclusion reasons), `schema` (its JSON-Schema
   fields) and `resolve` returning an `identity` (canonical anime + subject slugs → ids,
   file names) and `manifest` facts.
4. Add one line to `TEMPLATES` in `templates/registry.ts`. The CLIs, catalog, queue,
   schema, Studio and `social:validate` pick it up from there (no switch elsewhere).
   Then `npm run social:schema && npm run social:catalog`.
5. Reuse `components/` and `lib/` (camera, easing, theme, fonts). Planned:
   LocationSpotlight, ArcTimeline, WorldComparison, FactionOverview, DidYouKnow.

## Adding an anime / using a new entity

- **New anime:** nothing to do in the engine. Once the world is `available`
  with a dataset in `src/data/registry.ts`, `--anime <slug>` works. For a nice
  map, give its base `MapLevel` a `backgroundAssetId` whose asset `url` is a
  local file under `public/` (remote URLs are ignored on purpose).
- **New character:** it needs ≥ 2 places on the world map, through a personal
  route (`Route.steps`, ideally with `arcId`s) and/or located timeline events
  (`TimelineEvent.characterIds` + `locationId`). Run `npm run social:catalog`: it appears
  in `catalog.json`, or in `excluded.json` with the reason.
- **Other entity kinds** (locations, arcs, factions…) belong to new templates:
  resolve them with `data/entities.ts` and the site's helpers.

## Content pipeline

### Catalog

```bash
npm run social:catalog
```
```
CharacterJourney:
  Naruto               29 available   (221 excluded)
  Hunter x Hunter      30 available   (126 excluded)
  One Piece            50 available   (367 excluded)
  Dragon Ball          21 available   (82 excluded)
  Black Clover         50 available   (87 excluded)
  total 180 available · 180 in en+it · 3 already rendered
  excluded:
     632 no_journey_data
     251 single_location
```

Each template scans every world with the **same builder the renderer uses** (`template.scan`),
so "available" means renderable — `social:validate` resolves every catalog item in every
declared locale to prove it. Exclusion reasons: `no_journey_data`, `single_location`,
`missing_coordinates`, `missing_slug`, `missing_translation` (`catalog/excluded.json`).
Locale availability is strict: a locale is listed only if every animated stop's text is
authored in it (no fallback). History columns (`renderedLocales`, `queuedLocales`,
`publishedLocales`, `renderedBefore`, `publishedBefore`) come from history + queue; the
catalog is refreshed after every batch and `social:validate` fails if the committed one is stale.

### Queue

`content/queue/*.json`, one request per file, rendered in **file-name order**. Two ways in:

```bash
npm run social:queue -- --template character-journey --anime naruto --character sasuke-uchiha --locale en
#   ✔ queued character-journey:naruto:sasuke-uchiha@en
#     file: tools/social-engine/content/queue/0006-naruto_sasuke-uchiha_character-journey_en.json
npm run social:queue -- --from proposal.json        # array of requests (agent output)
```

or drop a valid JSON file in the folder (what an agent can do directly). `social:queue`
validates schema → data → duplicates, normalizes the subject, writes every default
explicitly (`locale`, `durationSeconds`, `hook`, `cta`, `id`, `status`), numbers the file
(`NNNN-`, never reused) and records `queued` in history. Flags: `--variant`, `--notes`,
`--hook`, `--cta`, `--duration`, `--max-stops`, `--force` (= `allowRerender`, human only),
`--dry-run`, `--list`.

### Batch render

```bash
npm run social:validate:queue           # read-only check of every file
npm run social:render:queue -- --dry-run
npm run social:render:queue
```
```
──────── batch summary ────────
5 queued · 4 rendered · 1 failed
  ✔ character-journey:naruto:itachi-uchiha@it  →  tools/social-engine/output/naruto_itachi-uchiha_character-journey_it.mp4
  …
  ✖ 0005-agent-gon.json [data]: … character "gon-frecss" not found … Did you mean: gon-freecss
  → retry: npm run social:retry:failed
```

1. lock (`.cache/queue.lock`; a second batch is refused, a lock left by a dead process is taken over);
2. validate every file (same checks as `validate:queue`); invalid / duplicate files → `content/failed/`;
3. valid items → history `queued`; one Remotion bundle for all;
4. for each item, **one at a time, in order**: `rendering` → MP4 + manifest → `rendered`
   (file → `content/rendered/`) — or `failed` (file → `content/failed/` + `.error.json`,
   partial MP4 deleted). One failure never stops the batch; only a critical error (lock,
   bundling) aborts it, leaving items queued;
5. history saved after every step (a crash leaves `rendering`, recovered on the next run);
6. summary + catalog refresh. `--id`, `--limit`, `--concurrency` (frames per video; videos
   are never rendered in parallel — a 22 s video takes ~1.5 min on 4 cores), `--no-catalog`.

`--dry-run` reads, validates and prints the full plan (stops, hooks, notes) and changes nothing
(no lock, no history, no file moves).

### History

`history/history.json` (versioned — it's the pipeline's memory across machines), one record per
render id, keys sorted:

```json
"character-journey:naruto:itachi-uchiha@en": {
  "renderId": "character-journey:naruto:itachi-uchiha@en",
  "contentId": "character-journey:naruto:itachi-uchiha",
  "template": "characterJourney", "anime": "naruto", "subject": "itachi-uchiha",
  "locale": "en", "variant": null,
  "createdAt": "2026-10-01T07:03:40.123Z", "updatedAt": "…",
  "renderStatus": "rendered", "renderedAt": "…",
  "outputFile": "tools/social-engine/output/naruto_itachi-uchiha_character-journey_en.mp4",
  "manifestFile": "tools/social-engine/output/naruto_itachi-uchiha_character-journey_en.manifest.json",
  "sourceFile": "0002-naruto_itachi-uchiha_character-journey_en.json",
  "durationSeconds": 22, "attempts": 1, "lastError": null,
  "publicationStatus": "notPublished", "publishedAt": null, "platforms": []
}
```

Two separate state machines: `renderStatus` (`queued → rendering → rendered | failed`,
`failed → queued` on retry, `rendering → queued` for crash recovery, `rendered → queued`
only for a forced re-render) and `publicationStatus` (`notPublished | partiallyPublished |
published` + `platforms[]` — reserved for the publishing phase; nothing publishes today).
Illegal moves throw. The MP4 itself is not versioned: history says it was produced; the file
lives where it was rendered. To forget a test render, delete its record (and its
`content/rendered/` file) — it's plain JSON.

### Duplicates

Unit = render id (content + locale + variant): already queued or already rendered/published
→ **rejected**; previously failed → allowed (retry); same content in another locale/variant →
allowed with a note. A new edition of something rendered needs a `variant`; a human can force
a re-render with `--force`. Full table: [contract §5](SOCIAL_AGENT_CONTRACT.md#5-duplicate-policy).

### Failed & retry

Every failure keeps the original file in `content/failed/` plus `<file>.error.json`:

```json
{ "kind": "render", "renderId": "…@en", "contentId": "…", "errors": ["…"], "stack": "…",
  "failedAt": "…", "attempt": 1, "sourceFile": "0003-….json", "config": { … } }
```

(`kind`: `invalid` JSON/schema · `data` (subject/anime/journey) · `duplicate` · `render`.)
Fix the file in place if needed, then:

```bash
npm run social:retry:failed                       # all failed → queue → render them
npm run social:retry:failed -- --id character-journey:naruto:itachi-uchiha@en
npm run social:retry:failed -- --requeue-only     # just move them back
```

The `.error.json` is removed on requeue (a render error stays in history `lastError`,
`attempts` keeps counting).

### Filesystem safety

Content files never choose a path: ids and file names are built from validated slugs
(`[a-z0-9-]`), every join goes through `safeJoin` (no `..`, no absolute segment, must stay
inside its folder), queue scanning ignores symlinks and odd names, JSON files over 64 KB are
refused, `audio.src` must resolve to a regular file inside `audio/`, writes are atomic
(temp + rename) and moves never overwrite.

### Concurrency

Videos are rendered serially by design (a render already uses every core). The lock
(`.cache/queue.lock`) is the only concurrency control needed today: one batch at a time, and
`social:queue` / `social:retry:failed` (which also write history) refuse to run during a
batch. Dropping JSON files directly into `content/queue/` during a batch is safe: the batch
only touches the files it validated at start; new files wait for the next run.

### Source vs runtime

| Versioned (source) | Git-ignored (runtime) |
| --- | --- |
| `catalog/*.json`, `history/history.json`, `content/**/*.json`, `schemas/`, `examples/`, docs | `output/` (MP4, manifests, previews), `.cache/` (bundle, staged assets, lock), `audio/*` (except README), `*.tmp`, every `*.mp4/*.mov/*.webm` |

## Cloud rendering

GitHub Actions is the cloud renderer — it runs **exactly the npm scripts above**
on an `ubuntu-latest` runner. Two workflows:

| Workflow | Trigger | Does | Permissions |
| --- | --- | --- | --- |
| [`social-validate.yml`](../.github/workflows/social-validate.yml) | pull request touching `tools/social-engine/**` (or these workflows / package files) | `npm ci` → `social:validate:queue` → `social:render:queue:dry` → `social:validate` (tests). **Never renders.** | `contents: read`, no secrets, `pull_request` (not `_target`) |
| [`social-render.yml`](../.github/workflows/social-render.yml) | push to `main` changing `tools/social-engine/content/queue/**` (= a merged queue PR) · manual **Run workflow** (`dry_run` input) | validate → render → artifact → state commit | `contents: write` on the render job only |

```
PR with queue JSON ──► Social validate (red if invalid / duplicate / unrenderable)
        │ merge
        ▼
push to main ──► Social render
  Checkout repository          branch HEAD (sees the previous run's state commit)
  Decide run mode              render | dry (dispatch dry_run, or a non-default branch) · queue count
  Setup Node.js / Install      Node 22, npm cache, `npm ci`            (skipped when the queue is empty)
  Restore Chrome Headless Shell cache · Install Chrome Headless Shell (`npx remotion browser ensure`)
  Generate social catalog      npm run social:catalog
  Validate social queue        npm run social:validate:queue          (informative: invalid → failed/)
  Render queued videos         npm run social:render:queue            (≤ 12 per run, one at a time)
  Prepare render artifact      npm run social:ci:report               (artifact dir + step summary + outputs)
  Upload rendered videos       actions/upload-artifact                (also on partial failure)
  Persist social history       commit history/content/catalog back    ([skip ci], GITHUB_TOKEN)
  Fail when a video failed     red run if ≥ 1 item failed
```

### Artifact

Name: **`animapverse-social-render-<run_id>-<run_attempt>`** (prefix stable; find it via
the run's artifacts API). Retention 30 days. Content (nothing else — no source,
`node_modules`, cache, bundle or browser):

```
videos/<anime>_<subject>_<template>_<locale>.mp4
manifests/<anime>_<subject>_<template>_<locale>.manifest.json
render-summary.json
```

`render-summary.json` (`pipeline/runSummary.ts`, also written locally to `output/`):

```json
{
  "runVersion": 1,
  "generatedAt": "…", "dryRun": false,
  "github": { "runId": "…", "runNumber": "…", "runAttempt": "1", "sha": "…", "ref": "main",
              "workflow": "Social render", "artifactName": "animapverse-social-render-…-1" },
  "counts": { "considered": 2, "rendered": 1, "failed": 1, "planned": 1, "remainingInQueue": 0 },
  "rendered": [{ "renderId": "character-journey:naruto:sasuke-uchiha@en", "contentId": "…",
                 "template": "characterJourney", "anime": "naruto", "subject": "sasuke-uchiha",
                 "locale": "en", "variant": null, "title": "Sasuke Uchiha · Character Journey",
                 "durationSeconds": 22, "sha256": "…",
                 "video": "videos/naruto_sasuke-uchiha_character-journey_en.mp4",
                 "manifest": "manifests/naruto_sasuke-uchiha_character-journey_en.manifest.json",
                 "sourceFile": "0006-naruto_sasuke-uchiha_character-journey_en.json" }],
  "failed": [{ "file": "0007-….json", "kind": "data", "renderId": null, "template": "characterJourney",
               "anime": "naruto", "subject": "sasuke-uchia", "contentId": null, "errors": ["…Did you mean…"] }],
  "planned": []
}
```

Job outputs: `rendered_count`, `failed_count`, `artifact_name`. The run page also shows
a readable **step summary** (counts, videos, failures with the reason, artifact name).

### History persistence (the runner is ephemeral)

The batch updates the repository state (`history/history.json`, queue files moved to
`content/rendered/` or `content/failed/` + `.error.json`, refreshed `catalog/`). The
**Persist social history** step stages **only** those three paths and pushes one commit
to the same branch: `chore(social): record rendered content [skip social-render] [skip ci]`
(author `github-actions[bot]`), rebasing and retrying if the branch moved meanwhile. It runs
also after a partial failure, a timeout or a cancellation (`always()`), so whatever was
rendered is recorded and a crash mid-render is recovered by the next run. MP4s are never
committed (git-ignored, and never staged).

### Loop prevention

The state commit modifies `content/queue/**`, which matches the trigger — three independent guards:

1. it is pushed with `GITHUB_TOKEN`, and **pushes made with `GITHUB_TOKEN` never start workflow runs** (GitHub rule);
2. its message carries **`[skip ci]`** (GitHub skips push-triggered workflows for it);
3. the job condition skips commits by **`github-actions[bot]`** or containing **`[skip social-render]`**.

### Failures

One failed video never stops the others; the run ends **red** when ≥ 1 item failed, but the
successful videos and `render-summary.json` are uploaded first and the state (including
`content/failed/*.error.json`) is committed. The step summary and the "Render queued videos"
log show the render id (template · anime · subject · locale) and the error. To retry: fix the
file in `content/failed/` in a PR, then `npm run social:retry:failed` locally — or move it back
to `content/queue/` in that PR; the merge triggers a new render.

### Manual run

GitHub → **Actions → Social render → Run workflow** (branch `main`):
- `dry_run` unchecked → render the current queue (same as an automatic run);
- `dry_run` checked → catalog + validation + plan in the step summary; no video, no state change, no commit.

On any branch other than the default one, a manual run is always a dry run.

### Cost control

Public repository → standard runners are free. Runs only when queue files change on `main`
(path filter) or on demand; PRs never render; no cron; no matrix; videos rendered serially;
empty queue → the job stops after checkout (no install); npm cache; Chrome Headless Shell cached
per Remotion version; ≤ 12 videos per run (`SOCIAL_RENDER_LIMIT`, the rest stays queued — the
step summary says so); timeouts 45 min (render step) / 60 min (job). Measured: ~1.5 min per 22 s
video on a 4-core machine. The state commit lands on `main`: if the site's Vercel project builds
every push, it will redeploy an identical site (no harm); an *Ignored Build Step* such as
`git diff --quiet HEAD^ HEAD -- . ':(exclude)tools/social-engine'` avoids that (optional, Vercel settings).

### Cross-platform

Everything is Node (`path.join/resolve`, `fileURLToPath`, no shell commands, no drive letters);
YAML shell logic only uses the Linux runner. Fonts are the project's `@fontsource` packages
bundled by webpack (all subsets — latin-ext covers ō/ū/ā), and frame capture waits for the
glyphs each video uses; no glyph comes from the OS (a test fails if data ever needs one the
fonts don't cover). Same Remotion version → same Chrome Headless Shell (149.0.7790.0 for
4.0.530) on Windows and Linux. CLI flags are optional in CI: `social:render:queue:dry` and
`SOCIAL_RENDER_LIMIT` avoid npm argument forwarding (npm 11 on Windows).

### Troubleshooting (cloud)

- **"Install Chrome Headless Shell" fails** → the runner needs `https://remotion.media`
  (download host of Remotion 4.0.530). Re-run; the cache key is per Remotion version.
- **Browser fails to launch** (missing shared libraries) → add an `apt-get install` step with the
  libraries listed in Remotion's Linux docs (not needed on `ubuntu-latest` so far).
- **Persist step: push rejected** (branch protection) → allow `github-actions[bot]` to push to
  `main`, or switch the persist step to opening a PR. The videos are in the artifact either way;
  the queue items will be rendered again by the next run until the state is saved.
- **Nothing happens after a merge** → the merge must change `tools/social-engine/content/queue/**`
  on `main`; use **Run workflow** to process the queue as it is.
- **Job skipped** → the head commit was the bot's state commit (expected).

## Troubleshooting

- **`Browser executable not found` / Chrome download fails:** Remotion needs a
  headless Chromium. The CLI auto-detects a Playwright headless shell under
  `PLAYWRIGHT_BROWSERS_PATH`; otherwise pass `--browser-executable <path>` or set
  `SOCIAL_BROWSER_EXECUTABLE`. Without any of them, Remotion downloads its own
  Chrome Headless Shell (needs network).
- **Studio page fails with `getRenderQueue is not a function`:** the published
  `@remotion/cli@4.0.531` tarball ships an empty `render-queue/queue.js`.
  Remotion is pinned to the exact `4.0.530`; keep all `remotion` and `@remotion/*`
  packages on the same exact version when upgrading, and run `npm run social:studio` once.
- **Studio warning "Can't save default props":** harmless; edit props in the
  panel or change `examples/itachi-character-journey.json`.
- **Very slow renders:** avoid CSS `filter: blur()`, SVG `feGaussianBlur` and
  large blurred shadows in components; headless Chromium rasterizes them in software.
- **`Missing public asset`:** the map image referenced by the dataset is not in
  `public/`. Renders only use files already shipped by the site.
- **`Another batch render is running`:** wait, or — if that process is really gone on
  another machine — delete `tools/social-engine/.cache/queue.lock` (same-machine stale locks
  are detected automatically).
- **`social:validate` says the catalog is stale:** run `npm run social:catalog` (data or
  history changed without a batch).
- **Schema drift:** run `npm run social:schema` after changing config limits/fields.
- **"Detected differing memory amounts" warnings:** Remotion noise inside
  containers; harmless.
