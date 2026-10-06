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
growth engine ──► catalog/next.json                 next video: rotation rules + analytics (see Growth Engine)
        ↓
[ Content Agent — ChatGPT Work ]                   copies next.request into ONE queue file per run
        ↓                                           contract: docs/SOCIAL_AGENT_CONTRACT.md
social:queue / drop JSON ──► content/queue/*.json  validated, de-duplicated, canonical
        ↓
social:render:queue ──► template → Remotion ──► output/<stem>.mp4 + <stem>.manifest.json
        ↓                                           (failures → content/failed/ + .error.json)
history/history.json                               render status + publication state per platform
        ↓
[ Publishing Agent — external, ChatGPT Work + Metricool ]   downloads the artifact, schedules/publishes
        ↓                                           contract: docs/SOCIAL_PUBLISHING_CONTRACT.md
publication/pending/*.json (receipt PR) ──► social:publication:apply ──► history + catalog
```

The same engine runs locally (Windows/macOS/Linux) and in the cloud
(**GitHub Actions**, see [Cloud rendering](#cloud-rendering)): no second renderer,
no CI-specific logic. **No AI/API is called and the repository never publishes**: publishing is
done outside by the Publishing Agent, which reports back with receipts ([Publication State](#publication-state)).

## Commands

```bash
# discover
npm run social:catalog                 # scan the datasets → catalog/catalog.json + excluded.json (+ summary)

# queue
npm run social:queue -- --template character-journey --anime naruto --character itachi-uchiha --locale en
npm run social:queue -- --template character-journey --anime dragonball --character goku --segment part-01 --locale en
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
npm run social:schema                            # regenerate the content + publication-receipt JSON Schemas
npm run social:validate                          # typecheck + engine/pipeline/publication tests
npm run social:ci:report                         # artifact folder + report from the last batch (CI; works locally too)

# growth engine (see "Growth Engine")
npm run social:agent -- --dry-run                # the daily cycle in 12 steps on the real state (selector + trace), writes nothing
npm run social:next                              # the next video to queue (rotation-safe, hook + CTA + captions) + SelectionTrace report
npm run social:performance                       # performance report · social:analytics:* = metric snapshots
npm run social:editorial:check                   # queue vs the hard editorial rules (render gate)
npm run social:editorial:check:selection         # + the queued video must be the growth engine selection (PR gate)

# publication state (the repo never publishes — see "Publication State")
npm run social:publication:validate              # check publication/pending/*.json receipts, change nothing
npm run social:publication:apply:dry             # renderId · platform · old → new
npm run social:publication:apply                 # all-or-nothing: history + catalog, pending → applied/
npm run social:publication:list                  # rendered videos × instagram/facebook/tiktok/youtube state
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

- Name: `<anime>_<subject>_<template>[_<segment>]_<locale>[_<variant>]` — built only from
  validated slugs, e.g. `naruto_itachi-uchiha_character-journey_en.mp4` (single journey) and
  `dragonball_goku_character-journey_part-02_en.mp4` (part 2 of a series).
- 1080×1920 (9:16), 30 fps, H.264 High, `yuv420p`, CRF 18, no audio track unless configured.
- Manifest: content/render ids, template, anime, subject, locale, variant, **`segment`** (series
  facts: `seriesId`, `segment`, `partNumber`, `partCount`, `arcIds`, `arcTitles`, `firstArc`,
  `lastArc`, `segmentStopCount`, `fullJourneyStopCount`, `segmentationVersion`, `fingerprint`;
  `null` for a single video), duration, frames, resolution, `renderedAt`, file size + sha256,
  publication facts (title incl. "Part 2 of 5", hook, CTA, page URL, stops, arc range) and the
  source config — what a future publisher/analytics step needs.
- Same request + same data → same video (no randomness, no network, no AI; verified
  byte-identical across runs).

## Architecture

```
tools/social-engine/
  index.ts · Root.tsx · remotion.config.ts · tsconfig.json     Remotion entry / Studio
  config/        shared types, defaults, deterministic copy (en/it), schema helpers
  data/          read-only adapters over the site data (world registry, slugs, sub-map
                 projection, journey builder, arc-based segmentation `segments.ts`)
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
  "segment": "part-02",
  "locale": "en",
  "hook": "How far did Itachi actually travel?",
  "cta": "Explore the full journey on AniMapVerse",
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
| `segment` | for series | `part-01`, `part-02`… as listed in the catalog (`series.segment`). Required when the journey is a series, rejected when it's a single video, rejected if the part doesn't exist |
| `locale` | | `en` · also `it` (the datasets' source languages) |
| `hook` | | single: `Follow {name}'s journey across the {anime} world.` / `Segui il viaggio di {name} nel mondo di {anime}.` · series: `{name}'s journey begins / continues — Part {n} of {total}.`, `The last stretch of {name}'s journey — Part {n} of {total}.` (IT: `Il viaggio di {name} comincia / continua — Parte {n} di {total}.`, `L'ultimo tratto del viaggio di {name} — …`) (≤ 90 chars) |
| `cta` | | `Explore the full journey on AniMapVerse` / `Esplora il percorso completo su AniMapVerse`; parts before the last: `Continue the journey on AniMapVerse` / `Continua il viaggio su AniMapVerse` (≤ 80 chars) |
| `durationSeconds` | | **automatic** from the stops (see Dynamic duration), 12–60 if explicit |
| `journey.routeIds` | | the character's own routes |
| `journey.includeEvents` | | `true` |
| `journey.maxStops` | | expert cap (2–8) on the stops of this video; default: all stops of the part (≤ 8). Also capped when an explicit duration is too short (≥ 1.6 s per stop) |
| `highlights` | | auto: the 3–5 most important stops (ids or SEO slugs; must be on the journey) |
| `audio` | | none. A file inside `tools/social-engine/audio/` only (path-checked), never copyrighted OSTs |
| `variant` | | none. Editorial edition (slug); needed to re-do a video already rendered |
| `notes` | | free text (≤ 500), stored, never rendered |

Default texts are deterministic templates in `config/copy.ts` — no generated text.

## CharacterJourney

A short journey (≤ 8 places on the map) is **one video**. A long one becomes a
**series**: chronological, arc-based parts — *Goku's journey · Part 1 of 5*, *Part 2 of 5*… —
each an independent content with its own id, catalog item, render and history.

Scenes (the plan in `templates/characterJourney/timeline.ts` follows the stop count):

| Scene | Length | Content |
| --- | --- | --- |
| **Hook** | 2.6 s (fixed) | kicker (`Dragon Ball · Part 2 of 5` / `Naruto · Character Journey`), big 1–2 line text, red underline; blurred map behind |
| **Establishing map** | 2.8 s (fixed) | map out of the blur, header (brand, monogram, name, `CHARACTER JOURNEY` + a discreet `PART 2 OF 5` pill), map name, **arc range of the part** (`Tenkaichi Budokai → Red Ribbon Army Saga`, one line, shrinks/ellipsizes), stats of this video |
| **Journey** | ≈ 2.8 s **per stop** | camera flies (zoomed from the distance to the previous stop), the route of **this part only** draws itself (travel 42 %), the numbered pin pops and pulses, place label + stop card (title, place, arc, progress) during the dwell (58 %) |
| **Recap** | 3.4 s + 0.15 s/stop | camera frames this part's route, 3–5 key locations **of this part** |
| **CTA** | 3.2 s (fixed) | AniMapVerse mark, `Next: Part 3 of 5` (series, not on the last part), CTA, `animapverse.com` + the character's page |

### Dynamic duration

The engine owns the length: `recommendedDurationSeconds(stops) = clamp(round(13.5 + 2.75 × stops), 24, 38)`.

| Animated stops | 2–3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- |
| Duration | 24 s | 25 s | 27 s | 30 s | 33 s | 36 s |

Fixed scenes keep their length; everything else goes to the journey, so every stop
gets ≈ 2.8–3 s (a stop never gets more than 3.4 s — spare time on very short journeys
goes to intro/recap/CTA). More places never make a longer video: they make **more parts**.
An explicit `durationSeconds` (12–60) is still honoured; if it's too short for the stops
(< 1.6 s each) the part is sampled down (first/last kept).

### How the journey is built

`data/journey.ts`, generic for every world — unchanged by the segmentation:

1. Routes: the character's `routeIds`, routes of `type: 'character'` featuring
   them, or routes whose only protagonist they are (group routes are skipped).
   Steps keep their authored order; steps without an arc take their
   neighbour's position; a route that can't be dated at all is skipped when
   other routes are dated.
2. Events: the character's timeline events with a location extend the journey
   into story arcs the routes don't cover.
3. Everything is sorted by arc order, projected on the world map (sub-map
   places such as the Uchiha District → the Konoha pin) and consecutive stops on
   the same pin are merged — stop counts are always counted AFTER this.

### Segmentation (series)

`data/segments.ts` takes that chronological journey and never re-orders it:

1. **Arc grouping** — each stop gets an *effective arc* (its own; a stop without arc takes
   the previous stop's; leading ones the first known arc) and consecutive stops of the same
   arc form a group. Arcs without visible stops simply don't exist here.
2. **≤ 8 stops → single video** (`SINGLE_MAX_STOPS`), never split artificially.
3. **> 8 stops → optimal partition** by dynamic programming over all cut positions,
   minimising a penalty (globally, not greedily — so no `6, 6, 2` tails):

   | Part size | 1 | 2 | 3 | 4 | 5 | **6** | 7 | 8 | > 8 |
   | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
   | Penalty | 1000 | 60 | 25 | 6 | 1 | **0** | 1 | 4 | impossible |

   plus +15 when the **last** part has 1–3 stops, +200 for a cut **inside** an arc that
   would fit in one part (only when nothing else works), +3 for a cut inside an arc
   bigger than 8 (huge arcs are split evenly: `[14] → 7 + 7`). Cuts at arc boundaries
   are free, so consecutive arcs are merged (`[1,2,3] → 6`), small arcs never stand
   alone, and arcs are never mixed out of order. Ties resolve deterministically.

   Examples: `[1,2,3,2,4,1,3,3] → 6 · 6 · 7` · `[6,6,2] → 6 · 8` · `[6,1,1] → 8` ·
   `[3,3,3] → 3 · 6` · `[2,2,2,2,2] → 4 · 6` · `[20] → 6 · 7 · 7`.
4. Each part knows its `partNumber/partCount`, key `part-NN`, stop range, ordered arc ids,
   a **fingerprint** (hash of its stops + arcs) and the `segmentationVersion`.

The route, camera, labels and recap of a part use **only that part's stops** — Part 1 never
shows the road of Part 4. The header shows the series position, the intro the arc range.

**Real data** (segmentation v1):

| Character | Journey | Parts |
| --- | --- | --- |
| Goku | 32 places · 16 arcs | 1: Pilaf Saga · 4 stops · 25 s — 2: Tenkaichi Budokai → Red Ribbon Army · 6 · 30 s — 3: King Piccolo → Saiyan Saga · 7 · 33 s — 4: Namek/Frieza → Battle of Gods · 7 · 33 s — 5: Goku Black → Other World Tournament · 8 · 36 s |
| Sasuke | 15 · 10 | 1: Pre-series → Sasuke Retrieval · 8 · 36 s — 2: Fated Battle Between Brothers → Momoshiki · 7 · 33 s |
| Luffy | 29 · 22 | 5 parts: 5 · 6 · 6 · 5 · 7 stops |
| Asta | 16 · 12 | 3 parts: 5 · 5 · 6 |
| Gon / Killua | 9 · 7 / 9 · 6 | 2 parts: 4 · 5 |
| Itachi / Gaara / Kushina | 5 / 8 / 2 | single video |

### Series identity

| | single journey | part of a series |
| --- | --- | --- |
| content id | `character-journey:naruto:itachi-uchiha` (unchanged) | `character-journey:dragonball:goku:part-02` |
| series id | — | `character-journey:dragonball:goku` |
| render id | `…:itachi-uchiha@en` | `…:goku:part-02@en`, `…:goku:part-02@it+teaser` |
| file stem | `naruto_itachi-uchiha_character-journey_en` | `dragonball_goku_character-journey_part-02_en` |

Duplicates are per part and locale: Part 1 EN twice ✗ · Part 2 EN ✓ · Part 1 IT ✓ ·
Part 1 EN + `variant` ✓. History records carry `segment` and `segmentFingerprint`.

**Stability.** `part-01` is defined by segmentation **version 1**. A future algorithm gets
its own keys (`part-01-v2`), so an old `part-01` never silently changes meaning; the
fingerprint additionally shows when the data behind a part changed since it was rendered.

**Backward compatibility.** Short journeys keep their old ids (Itachi, Kushina history stays
valid). A subject that is now a series (Luffy, Gon) keeps its old whole-journey record in
history; its parts are new contents, and each catalog part reports the old render in
`series.legacyRenderedLocales`.

If there is no journey (no route, no located event) or only one place, the
render fails with e.g.
`Cannot render CharacterJourney: journey data missing for character "char-teuchi"` —
an empty video is never produced. Today 180 characters have a renderable journey,
which makes **206 videos** (43 of them parts of 17 series).

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
  world              characters  videos  series  excluded
  Naruto                     29      33       4       221
  Hunter x Hunter            30      32       2       126
  One Piece                  50      60       5       367
  Dragon Ball                21      26       2        82
  Black Clover               50      55       4        87
  total 180 characters → 206 videos (43 are parts of a series) · 206 in en+it · 3 already rendered
  excluded:
     632 no_journey_data
     251 single_location
publishing: 6 rendered (6 notPublished) · 1 ready to publish (MP4 downloadable) · 5 without a downloadable MP4
```

**Every part is an item.** A multi-part item (`series` is `null` for a single video):

```json
{
  "id": "character-journey:dragonball:goku:part-02",
  "anime": "dragonball", "animeTitle": "Dragon Ball", "subject": "goku",
  "series": {
    "id": "character-journey:dragonball:goku", "segment": "part-02",
    "partNumber": 2, "partCount": 5,
    "previousId": "character-journey:dragonball:goku:part-01",
    "nextId": "character-journey:dragonball:goku:part-03",
    "arcIds": ["arc-dbz-tenkaichi-tournament", "arc-dbz-red-ribbon"],
    "arcTitles": { "en": ["Tenkaichi Budokai", "Red Ribbon Army Saga"], "it": ["Torneo Tenkaichi", "Saga del Red Ribbon"] },
    "firstArc": "Tenkaichi Budokai", "lastArc": "Red Ribbon Army Saga",
    "segmentationVersion": 1, "fingerprint": "de509287"
  },
  "displayName": { "en": "Goku", "it": "Son Goku" },
  "locales": ["en", "it"],
  "recommendedDurationSeconds": 30,
  "facts": { "importance": "main", "places": 32, "animatedStops": 6, "arcs": 2, "journeyArcs": 16 },
  "renderedLocales": ["en"], "scheduledLocales": ["en"], "publishedLocales": [], "queuedLocales": [],
  "renderedBefore": true, "publishedBefore": false,
  "publication": [
    { "renderId": "character-journey:dragonball:goku:part-02@en", "locale": "en", "variant": null,
      "status": "scheduled", "platforms": { "instagram": "scheduled", "facebook": "notScheduled", "tiktok": "notScheduled", "youtube": "notScheduled" } }
  ]
}
```

`renderedBefore` / `renderedLocales` mean **an MP4 exists — never "published"**. Publication
facts are separate: `scheduledLocales`, `publishedLocales`, and `publication` (one entry per
rendered video, every platform listed). The catalog also has a top-level **`publishing`**
section — the Publishing Agent's work list, see [Publication State](#publication-state).

`facts.places` / `journeyArcs` = the full journey; `animatedStops` / `arcs` = this video.
Parts are listed in chronological order and linked with `previousId` / `nextId`.

Each template scans every world with the **same builder the renderer uses** (`template.scan`),
so "available" means renderable — `social:validate` resolves every catalog item in every
declared locale to prove it. Exclusion reasons: `no_journey_data`, `single_location`,
`missing_coordinates`, `missing_slug`, `missing_translation` (`catalog/excluded.json`).
Locale availability is strict: a locale is listed only if every animated stop's text is
authored in it (no fallback). History columns (`renderedLocales`, `queuedLocales`,
`scheduledLocales`, `publishedLocales`, `renderedBefore`, `publishedBefore`, `publication`,
`publishing`) come from history + queue; the
catalog is refreshed after every batch and `social:validate` fails if the committed one is stale.

### Queue

`content/queue/*.json`, one request per file, rendered in **file-name order**. Two ways in:

```bash
npm run social:queue -- --template character-journey --anime naruto --character sasuke-uchiha --segment part-01 --locale en
#   ✔ queued character-journey:naruto:sasuke-uchiha:part-01@en
#     file: tools/social-engine/content/queue/0009-naruto_sasuke-uchiha_character-journey_part-01_en.json
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
   are never rendered in parallel — a 30 s video takes ~2 min on 4 cores), `--no-catalog`.

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
  "segment": null, "segmentFingerprint": null,
  "durationSeconds": 22, "attempts": 1, "lastError": null,
  "artifact": {
    "name": "animapverse-social-render-36996948068-1", "runId": "36996948068", "runAttempt": "1",
    "runUrl": "https://github.com/LucaSartorio/MindMapsAnime/actions/runs/36996948068",
    "video": "videos/dragonball_goku_character-journey_part-01_en.mp4",
    "manifest": "manifests/dragonball_goku_character-journey_part-01_en.manifest.json",
    "sha256": "…", "expiresAt": "2026-11-01T10:45:48Z"
  },
  "publicationStatus": "notPublished", "publishedAt": null, "platforms": []
}
```

Two separate state machines: `renderStatus` (`queued → rendering → rendered | failed`,
`failed → queued` on retry, `rendering → queued` for crash recovery, `rendered → queued`
only for a forced re-render) and the **publication state per platform** (`platforms[]`, changed
only by publication receipts; `publicationStatus` / `publishedAt` are derived from it) — see
[Publication State](#publication-state). Illegal moves throw. `artifact` (set by CI renders)
says which workflow artifact holds the MP4 and until when (`expiresAt` = render time + the
artifact retention); it is `null` for local renders and records older than this field. The MP4 itself is not versioned: history says it was produced; the file
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
| [`social-publication-validate.yml`](../.github/workflows/social-publication-validate.yml) | pull request touching `tools/social-engine/publication/pending/**` | receipt PR scope → `social:publication:validate` → publication tests. **Never writes.** | `contents: read`, no secrets |
| [`social-publication-state.yml`](../.github/workflows/social-publication-state.yml) | push to `main` changing `publication/pending/**` (= a merged receipt PR) · manual (`dry_run`) | validate → apply all-or-nothing → state commit | `contents: write` on the apply job only |

```
PR with queue JSON ──► Social validate (red if invalid / duplicate / unrenderable)
        │ merge
        ▼
push to main ──► Social render
  Checkout repository          branch HEAD (sees the previous run's state commit)
  Decide run mode              render | dry (dispatch dry_run, or a non-default branch) · queue count
  Setup Node.js / Install      Node 22, npm cache, `npm ci`            (skipped when the queue is empty)
  Restore / Install / Save Chrome Headless Shell   `npx remotion browser ensure`, cached per Remotion version
  Generate social catalog      npm run social:catalog
  Validate social queue        npm run social:validate:queue          (informative: invalid → failed/)
  Render queued videos         npm run social:render:queue            (≤ 12 per run, one at a time)
  Prepare render artifact      npm run social:ci:report               (artifact dir + step summary + outputs)
  Upload rendered videos       actions/upload-artifact                (also on partial failure)
  Persist social history       commit history/content/catalog back    ([skip ci], GITHUB_TOKEN)
  Fail when a video failed     red run if ≥ 1 item failed
```

**Verified on GitHub** (temporarily enabled on the feature branch, then removed):
[run #1](https://github.com/LucaSartorio/MindMapsAnime/actions/runs/36840522088) — Sasuke (en)
rendered + a deliberately invalid item: red run, artifact with 1 video + manifest + summary
uploaded, invalid item in `content/failed/`, state committed after an automatic rebase
(the branch had moved during the render), no new run triggered;
[run #2](https://github.com/LucaSartorio/MindMapsAnime/actions/runs/36840979141) — Sasuke (it):
green, Chrome cache saved, state committed, no loop. `npm ci` ≈ 8 s, browser ≈ 3 s, ~2 min per
22 s video on `ubuntu-latest`. Fixtures to replay it: `tools/social-engine/examples/tests/`.

> Those runs (and run #3, the first ChatGPT Work → PR → merge test: Goku EN) produced
> **pre-series** test videos. Their history records and `content/rendered/` files were
> removed when series were introduced, so Sasuke and Goku are renderable again; the old
> artifacts only expire (30 days) or can be deleted by hand (run page → Artifacts → 🗑).
> They never influence the catalog, history or duplicate detection.

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
  "rendered": [{ "renderId": "character-journey:naruto:sasuke-uchiha:part-01@en", "contentId": "…",
                 "template": "characterJourney", "anime": "naruto", "subject": "sasuke-uchiha",
                 "locale": "en", "variant": null,
                 "seriesId": "character-journey:naruto:sasuke-uchiha", "segment": "part-01",
                 "partNumber": 1, "partCount": 2,
                 "title": "Sasuke Uchiha · Character Journey · Part 1 of 2",
                 "durationSeconds": 36, "sha256": "…",
                 "video": "videos/naruto_sasuke-uchiha_character-journey_part-01_en.mp4",
                 "manifest": "manifests/naruto_sasuke-uchiha_character-journey_part-01_en.manifest.json",
                 "sourceFile": "0006-naruto_sasuke-uchiha_character-journey_part-01_en.json" }],
  "failed": [{ "file": "0007-….json", "kind": "data", "renderId": null, "template": "characterJourney",
               "anime": "naruto", "subject": "sasuke-uchia", "segment": "part-01", "contentId": null,
               "errors": ["…Did you mean…"] }],
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
(author `github-actions[bot]`), rebasing and retrying if the branch moved meanwhile. The commit
is done by [`tools/social-engine/ci/commit-state.sh`](../tools/social-engine/ci/commit-state.sh),
shared with Social publication state: if the other workflow committed in between, the rebase
merges `history.json` **field by field** (`.gitattributes` → `merge=social-history`, driver
`cli/merge-history.ts`: render fields from one side, `platforms` from the other; the same field
changed on both sides fails instead of guessing) and regenerates the catalog. It runs
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
- **"Node.js 20 is deprecated" warning** on `actions/*@v4` → harmless (GitHub runs them on
  Node 24); bump the action majors when convenient.

## Publication State

The repository is the **source of truth for publication state** — but it never publishes, holds no
provider token and makes no social/Metricool API call. Responsibilities are split:

| Who | Does |
| --- | --- |
| Social engine (this repo) | knows a video exists (render, artifact, history) |
| **Publishing Agent** (external: ChatGPT Work + Metricool plugin) | downloads the artifact, schedules/publishes through Metricool |
| **Publication receipt** (JSON in a PR) | tells the repository what happened, one event · one platform |
| Repository (`social:publication:apply`, CI) | validates the receipt and records the state in history + catalog |

```
catalog.publishing.ready ──► Publishing Agent ──► GitHub artifact (render-summary → manifest → MP4)
                                    │
                                    ▼ Metricool: schedule / publish → post id · UUID · planner URL · time
             receipt JSON in publication/pending/ ──► PR ──► Social publication validate
                                    ──► merge ──► Social publication state (apply all-or-nothing)
                                    ──► history.json platforms[] + catalog ──► never scheduled twice
```

Contract for the agent: [`docs/SOCIAL_PUBLISHING_CONTRACT.md`](SOCIAL_PUBLISHING_CONTRACT.md) ·
schema: `publication/schemas/publication-receipt.schema.json` (generated by `social:schema`) ·
code: `pipeline/publication.ts` (receipts + state machine), `pipeline/history.ts` (model).

### Receipts

```
tools/social-engine/publication/
  pending/   receipts to apply (added ONLY by the agent's PR)
  applied/   audit trail: <receiptId>.json = original receipt + transition + run (versioned, never edited)
  failed/    rejected receipts + .error.json (renderId, platform, current/requested state, error)
  schemas/   publication-receipt.schema.json
```

One JSON object per file (`[A-Za-z0-9][A-Za-z0-9._-]*.json`, ≤ 16 KB, regular file — no symlink):

```json
{
  "receiptVersion": 1,
  "renderId": "character-journey:dragonball:goku:part-01@en",
  "platform": "instagram",
  "provider": "metricool",
  "status": "scheduled",
  "scheduledFor": "2026-10-05T10:00:00+02:00",
  "providerPostId": "123456",
  "providerPostUuid": "0b8e4c1a-…",
  "plannerUrl": "https://app.metricool.com/…",
  "recordedAt": "2026-10-02T12:00:00Z",
  "recordedBy": "chatgpt-work-publishing-agent"
}
```

| status | required (besides `receiptVersion renderId platform provider status recordedAt`) | also allowed |
| --- | --- | --- |
| `scheduled` | `scheduledFor` | `providerPostId providerPostUuid plannerUrl recordedBy notes` |
| `published` | `publishedAt` | the above + `scheduledFor publicUrl` |
| `failed` | `error` | `providerPostId providerPostUuid plannerUrl scheduledFor recordedBy notes` |

Rules (parser = schema + more): unknown fields and fields not allowed for the status are errors;
duplicate JSON keys are errors; timestamps are full ISO 8601 **with seconds and offset** and real
calendar dates — stored **exactly as given** (the original offset of `scheduledFor` is kept; comparisons
use the absolute instant); URLs are `https`, no credentials, ≤ 2048 chars; provider ids are opaque tokens
(`providerPostId`: `[A-Za-z0-9][A-Za-z0-9._:-]{0,127}`; `providerPostUuid`: the same with ONE optional
leading `-`, `^-?[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$`, for Metricool's signed numeric UUIDs like
`-2035779932044177791`), never paths. `platform ∈ instagram | facebook | tiktok | youtube`,
`provider ∈ metricool` (enum, extensible in `PUBLICATION_PROVIDERS`). `plannerUrl` (Metricool back office)
and `publicUrl` (the live post) are different things and never mixed; `providerPostId` and
`providerPostUuid` are kept apart (Metricool may change the id; the UUID is stable).

**Receipt id** (idempotency key, derived — the agent doesn't compute it):
`<fileStem>.<platform>.<status>.<sha256(event)[0..12]>`, e.g.
`dragonball_goku_character-journey_part-01_en.instagram.scheduled.6498ac9125bb`. The hash covers every
fact of the event (incl. `recordedAt`), not the file name, `recordedBy` or `notes`.

### Model

`history.json` records keep `platforms[]` — now one **complete entry per platform that has a state**:

```json
"platforms": [{
  "platform": "instagram", "provider": "metricool", "status": "scheduled",
  "scheduledFor": "2026-10-05T10:00:00+02:00", "scheduledAt": "2026-10-02T12:00:00Z",
  "publishedAt": null, "failedAt": null,
  "providerPostId": "123456", "providerPostUuid": "0b8e4c1a-…",
  "plannerUrl": "https://app.metricool.com/…", "publicUrl": null,
  "lastError": null, "attempts": 1,
  "receipts": ["dragonball_goku_character-journey_part-01_en.instagram.scheduled.6498ac9125bb"],
  "updatedAt": "2026-10-02T12:31:07.000Z"
}]
```

A platform without an entry is **`notScheduled`**. `publicationStatus` is **derived** (never written by
hand) from the platforms that have a state — platforms never touched don't count:

| platforms | `publicationStatus` |
| --- | --- |
| none | `notPublished` |
| ≥ 1 scheduled, none published (failures may exist) | `scheduled` |
| all published | `published` (e.g. only Instagram, published) |
| ≥ 1 published + ≥ 1 scheduled/failed | `partiallyPublished` (e.g. IG published + TikTok scheduled) |
| only failed | `failed` |

`publishedAt` = earliest platform `publishedAt`. **`scheduled` is never `published`.** Every part of a
series is its own render id, so Goku Part 1 scheduled says nothing about Part 2.

**Backward compatibility**: `loadHistory` accepts every older format — records without `segment*` or
`artifact`, and the pre-receipt `platforms: [{ platform, publishedAt, url }]`, migrated in memory to a
`published` entry (`provider: null`, `publicUrl: url`); the aggregate is always re-derived.

### Lifecycle (state machine per render × platform)

```
notScheduled ──scheduled──► scheduled ──published──► published ──(same post: enrich / no-op)
     │  └──published (immediate / import)──────────────▲
     └──failed──► failed ◄──failed── scheduled
                    └──scheduled (retry: new post, attempts + 1)──► scheduled
```

| from \ receipt | scheduled | published | failed |
| --- | --- | --- | --- |
| notScheduled | ✔ | ✔ (flagged "without a scheduled receipt") | ✔ |
| scheduled | only the **same provider post** (UUID, else id, matches): identical = no-op, new `scheduledFor` = reschedule; a different / unprovable post = **rejected** | ✔ unless it names another post | ✔ unless it names another post |
| failed | ✔ retry | ✔ | ✔ (new error) |
| published | **rejected** | same post and no conflicting `publishedAt`/`publicUrl` = enrich / no-op; otherwise rejected | **rejected** |

Also rejected: an unknown `renderId`, and any video whose `renderStatus` is not `rendered`
(`queued`, `rendering`, `failed`) — nothing unrendered can be scheduled.

### Duplicate prevention

- **Same render + platform can't be scheduled twice**: once `scheduled` or `published`, a `scheduled`
  receipt for another post (or one that can't be matched to the recorded post) is refused — two
  identical Reels can never both be recorded. `failed` reopens it (retry).
- **Same receipt twice = no-op**: an already-applied receipt id is ignored; a re-sent event with the
  same values is detected as "already recorded". History is byte-identical (no timestamp bump, no
  duplicate entry); the audit file is still written (`outcome: "unchanged"`).
- The receipt PR is validated against the current history **before** merge, and the state workflow
  runs one at a time (concurrency group), so two receipts can't race.
- The agent must still check `catalog.publishing.ready` / history **before** calling Metricool — the
  repository can refuse a duplicate record, but only the agent can avoid creating the duplicate post.

### Commands

```bash
npm run social:publication:validate      # pending receipts: contract + history + transitions; writes nothing
npm run social:publication:apply:dry     # the plan: renderId · platform · old → new
npm run social:publication:apply         # ALL valid → history + catalog, pending → applied/ ; else NONE (invalid → failed/), exit 1
npm run social:publication:list          # rendered videos × platform states (+ artifact)
npm run social:publication:list -- --pending --platform instagram
npm run social:publication:test          # publication-state tests only (also part of social:validate)
```
```
✔ character-journey:dragonball:goku:part-01@en
  instagram  notScheduled → scheduled
  provider: metricool · uuid 0b8e4c1a-test · id 123456
  scheduled: 2026-10-05T10:00:00+02:00
  receipt: goku-p1-instagram.json → dragonball_goku_character-journey_part-01_en.instagram.scheduled.6498ac9125bb
```

**Atomic batch**: every pending receipt is validated and simulated (in event order: `recordedAt`, then
scheduled → failed → published) on a copy of the history first. If one is invalid, **nothing** is
applied, history is untouched, the invalid receipts move to `failed/` with a `.error.json`, the valid
ones stay in `pending/` (applied by the next run) and the command exits 1. Writes are ordered audit →
history → pending removal, so a crash mid-apply is harmless (a re-run sees the receipts as applied).
The apply holds the same lock as the batch render (one writer of history.json at a time).

### Workflows

- **Social publication validate** (`social-publication-validate.yml`) — PRs touching
  `publication/pending/**`: `npm ci` → `social:publication:check-scope` (a receipt PR may **only add**
  `publication/pending/*.json`: no history, catalog, audit trail or code edits) →
  `social:publication:validate` → `social:publication:test`. `contents: read`, `pull_request`, no secrets.
- **Social publication state** (`social-publication-state.yml`) — push to `main` changing
  `publication/pending/**` (+ manual run with `dry_run`): validate → apply → commit
  `chore(social): record publication state [skip social-publication] [skip ci]` (history, publication/,
  catalog only) via `ci/commit-state.sh`. Concurrency group `animapverse-social-publication-state`
  (`cancel-in-progress: false`); `contents: write` on the job only, `GITHUB_TOKEN` only. The run goes red
  if a receipt was rejected (after committing the quarantine).
- **Loop prevention** (the bot commit deletes files in `pending/`, which matches the trigger): pushes
  with `GITHUB_TOKEN` never start workflows; `[skip ci]` in the message; the job skips
  `github-actions[bot]` and `[skip social-publication]`. The commit never touches `content/queue/**`,
  so it can't trigger a render either.
- **Render ↔ publication**: separate concurrency groups (a publication never waits for a 10-minute
  render); if both commit state at the same time, `commit-state.sh` rebases with the field-level
  `history.json` merge driver (see [History persistence](#history-persistence-the-runner-is-ephemeral)).

### Artifacts → MP4 (for the agent)

`history.records[renderId].artifact` (also in `catalog.publishing.ready[]`) names the workflow artifact
(`animapverse-social-render-<runId>-<attempt>`, run URL, expiry) and the paths inside it. Inside:
`render-summary.json` → `rendered[]` entry with that **renderId** → `video` + `manifest` (+ `sha256`)
→ the MP4. The manifest has the title, hook, CTA, page URL and series facts for the caption; it is never
updated with publication state (that lives only in history). Records with `artifact: null` (local
renders, renders before this field) or an expired artifact are listed in `catalog.publishing.unavailable`:
they need a new render before they can be published.

## Growth Engine

The engine evolved from an automatic publisher into an **autonomous content + growth loop**:

```
CONTENT ──► PUBLISH ──► ANALYTICS ──► PERFORMANCE ──► SELECTION + DIVERSITY RULES ──► NEXT CONTENT ─┐
   ▲                                                                                               │
   └───────────────────────────────────────────────────────────────────────────────────────────────┘
```

**PERFORMANCE OPTIMIZES THE EDITORIAL PLAN. PERFORMANCE DOES NOT CONTROL IT.** A format, anime or
character that performs gets more room over the week — never a monotonous feed.

Everything is **in the repository, deterministic and file-based** (no AI text, no API call); the
external agents only read files and open PRs:

| Role | Reads | Writes (via PR) | Contract |
| --- | --- | --- | --- |
| Content Agent (publisher side) | `catalog/next.json` | one queue file = `next.request` (never its own pick) | [SOCIAL_AGENT_CONTRACT](SOCIAL_AGENT_CONTRACT.md) |
| Publishing Agent | `catalog.publishing.ready` (captions, cover, `waitFor`) | publication receipts | [SOCIAL_PUBLISHING_CONTRACT](SOCIAL_PUBLISHING_CONTRACT.md) |
| Analyst Agent | history (published posts) | analytics snapshots | [SOCIAL_ANALYTICS_CONTRACT](SOCIAL_ANALYTICS_CONTRACT.md) |

Code: `growth/` (`config.ts` — every knob · `feed.ts` · `rules.ts` · `selector.ts` · `plan.ts` ·
`report.ts` · `hooks.ts` · `ctas.ts` · `metadata.ts` · `performance.ts` · `contentTypes.ts` · `rng.ts`),
`cli/agent.ts` (the daily cycle, `social:agent`),
`pipeline/analytics.ts`, templates `guessCharacter/`, `characterVersus/`, `components/Cover.tsx`.
Outputs regenerated with the catalog (after every render, publication or analytics commit):
`catalog/next.json` (the next video) and `catalog/performance.json` (scores).

### Content Types

| type (= content id prefix) | template | status | what |
| --- | --- | --- | --- |
| `character-journey` | CharacterJourney | ✅ | the journey on the world map, multi-part when long (unchanged) |
| `guess-character` | GuessCharacter | ✅ | hook → places revealed one by one (clue cards, route) → countdown → **reveal** → CTA (19–24 s) |
| `character-versus` | CharacterVersus | ✅ | "Who travelled more?" — side A on its map, side B on its map, bars, **winner reveal** → CTA (22 s) |
| `guess-location` | — | declared | planned (`growth/contentTypes.ts`, `implemented: false`) |
| `journey-comparison` | — | declared | planned |

- **GuessCharacter** uses the SAME journey builder as CharacterJourney: distinct world-map places in
  journey order, sampled to 4–6 clues; a place whose name (EN or IT) contains a name token of the
  character is **never** a clue (no spoiler); only `main` / `major` characters are offered (guessable).
  Captions link the world map, not the character page, and never name the answer.
- **CharacterVersus** compares only real numbers: **distinct places on the world map** (story arcs
  break ties; equal arcs = tie). Distances are NOT compared: maps of different worlds have different
  scales. The catalog lists cross-world match-ups between the best journeys of each world
  (`VERSUS_TOP_PER_WORLD` = 3, main characters first) — they also help the anime rotation. Content id:
  `character-versus:<animeA>:<slugA>-vs-<animeB>-<slugB>`; the queue request keeps both characters
  (`subject` + `opponent: { anime, subject }`, copied from the catalog item `request`).
- Shared components: `Hook`, `CallToAction` (now **engagement first**: the CTA is the headline, the
  site a small signature), `Reveal`, `Progress` (`StepDots`, `Countdown`), `Versus` (`CountUp`,
  `VersusBars`), `Cover`, plus the existing map stack (`MapStage`, `RouteLayer`, `LocationMarker`…).

### Covers

Every queued render also produces a **cover** still (`<stem>.cover.png`, 1080×1920) through the
`SocialCover` composition: AniMapVerse identity (ink, grid, Cinzel, brand mark) + the world's theme
colour as accent + a format pill (JOURNEY red · GUESS amber · VERSUS blue) and layout (versus = split
map). Journeys keep the naming "Goku's Journey" + "Part 2 of 6" badge + arc range. The cover travels in
the artifact (`covers/`), its path is in the manifest, the history `artifact.cover` and the run summary.
A cover failure never fails the video (logged; `cover: null`). Preview: `npm run social:render -- … --cover`.

### Content Selection

`selectNext` (growth/selector.ts) — one video per run, English feed. Candidates = every producible
EN catalog item (all implemented formats) not already queued/rendered. Order of priorities:

1. **validity & sequence** — renderable, parts in order (Part N only after N − 1), spacing between parts
2. **anti-duplication** — a renderId already in the feed / history is never proposed again
3. **rotation** — anime and character streaks (HARD)
4. **cooldowns** — soft penalties (same anime / format as the previous video, character seen recently…)
5. **exploration / exploitation** — seeded per run
6. **performance** — shrunk estimates per format, anime, character, duration bucket

Steps 1–3 **filter**, steps 4–6 only **rank** what survived: the selector never picks "the best" and
then tries to fix it. If nothing survives the filters, the plan is `blocked` and nothing is queued.

**One source of truth.** `planNext` (growth/plan.ts) is the ONLY place that decides what comes next.
`catalog/next.json`, `social:next`, `social:agent` and the CI gate all call it; nobody else chooses a
format. The daily automation does not know in advance whether today is a CharacterJourney, a
GuessCharacter or a CharacterVersus: it executes the returned `request`, whatever its `template`.

### The Daily Cycle

```
LOAD STATE → RECONCILE BACKLOG → GROWTH SELECTOR → GENERATE CONTENT → VALIDATE → RENDER → PUBLISH → RECEIPTS → ANALYTICS / HISTORY
```

`npm run social:agent -- --dry-run` runs it on the REAL state and prints one line block per step
(where a run stopped is obvious); `--json` prints the machine-readable result. Without `--dry-run` it
also writes the ONE queue file of the day (no git, no history: commit + PR are the agent's job).

| step | what | stops the run when |
| --- | --- | --- |
| 1 Reconciliation | pending receipts + analytics snapshots applied **in memory** (the state workflow applies them on `main`) | — (invalid ones are reported and ignored) |
| 2 Catalog/History Load | catalog, history, feed, **backlog** | — |
| 3 Analytics Load | `metrics.json` → performance; unavailable/corrupt → **cold-start/editorial selection** | never (analytics optimise, they don't gate) |
| 4 Candidate Generation | every producible EN item of every implemented format | — |
| 5 Editorial Filtering | HARD rules → `hardRulesTriggered`, `constraints` | — |
| 6 Performance Scoring | soft cooldowns + exploration/exploitation, valid candidates only | — |
| 7 Content Selection | the pick + SelectionTrace — or **BACKLOG** / **BLOCKED** | backlog / blocked = nothing new today |
| 8 Queue | generic queue item (`enqueueMany`, any format): schema, data, duplicates, rules | invalid → FAILED STEP |
| 9 Render | content type → template → composition (`templateForContentType`); the *Social render* workflow renders | no composition |
| 10 Publish | the growth `platformMetadata` the Publishing Agent uses verbatim (the repo never publishes) | no metadata |
| 11 Receipts | 4/4 receipts expected (instagram, facebook, tiktok, youtube) | — |
| 12 Final State | dry run: unchanged · otherwise: queued file | — |

A failure prints `FAILED STEP` / `REASON` / `RECOVERY STATE` and exits 1 (nothing written).

**Backlog first** (`planBacklog`): before any new selection, `next.json` checks the feed —
an EN render with a downloadable MP4 and **no** platform scheduled/published (`backlog.unpublished`),
or a render in progress (history `queued`/`rendering`, files in `content/queue/` →
`backlog.inProgress`) → `status: "backlog"`, no `request`: publish that video, it is today's output.
Publications already started (≥ 1 platform scheduled/published, others `notScheduled`/`failed`) are
`backlog.unfinished`: the Publishing Agent completes them, but they don't block new content (correcting
receipts of published videos is not "today's video").

**SelectionTrace** (`next.json` → `trace`, `selector.ts`): `selectedId`, `renderId`, `contentType`,
`animes`, `characters`, `mode`, `seed`, `score`, `base`, `reasons`, `analytics` (samples, cold start),
`recent` (last 6 feed items), `constraints` (`sameAnimeStreak`, **`forcedAnimeRotation`**,
`blockedAnimes`, `blockedCharacters`, `characterCooldown`, `contentTypeStreak`),
`hardRulesTriggered` (counts per code: `MAX_SAME_ANIME_STREAK`, `MAX_SAME_CHARACTER_STREAK`,
`JOURNEY_PART_SPACING`, `JOURNEY_PART_ORDER`, `DUPLICATE`), `candidates` (per format considered /
eligible), `excluded` (≤ 10, rotation rules first, each with `reasons` + the `potentialScore` it would
have had — e.g. Kakashi 100 excluded by `MAX_SAME_ANIME_STREAK`), `ranked` (best valid ones) and
`explanation` (one sentence per fact). Ids, rules and numbers only — no secret. `growth/report.ts`
turns it into the human "SOCIAL CONTENT SELECTION" report (`social:next`, `social:agent`).

The **feed** (growth/feed.ts) = English videos that are queued/rendering, scheduled or published
somewhere, or rendered with a downloadable MP4 — in creation order. Old local renders that can never be
published and other locales are not in the feed.

### Editorial Rotation & Anti-Repetition Rules

| rule | value | kind |
| --- | --- | --- |
| one new video per run · locale EN | `videosPerRun` 1 · `feedLocale` en | hard |
| same anime consecutively | **`maxSameAnimeStreak` = 2** → the 3rd MUST be another anime | **hard (beats any score)** |
| same character consecutively | `maxSameCharacterStreak` = 1 (never twice in a row, any format) | hard |
| journey parts | Part N never before N − 1; `minItemsBetweenJourneyParts` = 2 | hard |
| preferred spacing between parts | `preferredItemsBetweenJourneyParts` = 3 (penalty below) | soft |
| same anime as the previous video | penalty `sameAnimeAsLast` (avoided when alternatives exist) | soft |
| character seen recently | `characterCooldown` = 6 items | soft |
| same format as the previous video | content-type cooldown: `sameContentTypeAsLast` (12) + `contentTypeStreak` (8) per extra item of the streak (Journey × 4 → −36) + format mix 50 % journey / 25 % guess / 25 % versus | soft (a preference: a lone valid format is still selectable) |
| hook template / hook type | `hookCooldown` = 4 items (template), previous type avoided | soft |
| CTA type | `ctaCooldown` = 2; site CTA at most once every 5 videos | soft |
| started series | `journeyPartCooldown` = 3 → continuation bonus (the CTA promised the next part) | soft |
| main characters preferred | `importanceBonus` (main 12, major 7, supporting 2) | soft |

A cross-world versus counts for **both** anime (Naruto → Naruto → Naruto-vs-Luffy is a 3rd Naruto).
Example: Naruto → Naruto → **One Piece** is allowed and chosen even if a 3rd Naruto would score
higher; Naruto → Naruto → Naruto can never happen.

The same hard rules gate the pipeline: `npm run social:editorial:check` runs before rendering in
**Social render** (fail-safe), and **Social validate** runs `social:editorial:check:selection`
(`--require-selection`): a queue PR is red when it breaks a rule **or** when its new feed video is not
the growth engine's selection — identity (renderId), `locale`, `hook`, `hookType`, `hookId`, `cta`,
`ctaType` and `selection.seed` must equal `catalog/next.json` `request` (or the plan recomputed from the
committed state, queue ignored). Also red: a 2nd new feed video in the same PR, and any new video
while the plan is `backlog`. Retries of a failed render and non-EN items are exempt.

### Hook Engine

`growth/hooks.ts` — a typed bank of deterministic templates per format and role (single / Part 1 /
continuation / last part): `question` · `challenge` · `curiosity` · `fact` · `versus`, e.g.
"Can you name every place {character} visited?", "Only real {anime} fans know all these places.",
"{character} visited {places} places across {anime}.", "Who travelled more: {characterA} or {characterB}?".
A template is used only if every placeholder is known and the text fits the video (≤ 90 chars); guess
hooks never contain the answer. Rotation: templates used in the last `hookCooldown` videos are skipped,
the previous hook type is avoided; exploit = best hook type by performance, explore / cold start = least
recently used type. History stores `hookType`, `hookId`, `hook`.

### CTA Engine

`growth/ctas.ts` — engagement first. A non-final part ALWAYS ends with "Follow for Part N." (the
strongest follow reason); otherwise rotate: guess → "Did you get it right?" / "How many places did you
recognize?"; versus → "Who should compete next?" / "{A} or {B}? Tell us."; journey → "Which location did
we miss?" / "Which journey should we map next?" / "Follow for the next journey." / rarely "See every place
on AniMapVerse." (≥ 5 videos apart). The video CTA is network-neutral; captions adapt it per network
("Subscribe for Part 2." on YouTube). History stores `ctaType` + `cta`.

### Platform Metadata

`growth/metadata.ts` builds, at render time, `instagramCaption` (question + CTA + save prompt + ≤ 8
hashtags), `tiktokCaption` (short, ≤ 5 hashtags), `youtubeTitle` (searchable, ≤ 100 chars, e.g.
"Every Place Naruto Uzumaki Visited 🍥 | Naruto Journey Part 1 of 2"), `youtubeDescription`,
`facebookCaption`, `hashtags`, `madeForKids: false`. Per-world emoji/hashtags live in `WORLD_SOCIAL`
(config, not components). Stored in history `social.platformMetadata`, the manifest (`social`), and
exposed in `catalog.publishing.ready[]`. AI-disclosure flags stay those the Publishing Agent sets.

### History (social block)

Every record created from now on carries `social`: `contentType`, `animes`, `characters`
(`anime:slug`), `characterNames`, `part`, `partCount`, `hookType`, `hookId`, `hook`, `ctaType`, `cta`,
`durationSeconds`, `selection` (`mode`, `score`, `seed`) and `platformMetadata`. **Migration**: none
needed — older records load with `social: null` and the feed derives the same facts from their content
id (format, anime, character, part); receipts, artifacts and publication state are untouched.

### Analytics

`pipeline/analytics.ts` — **analytics snapshots** (Analyst Agent → `analytics/pending/` → PR), applied
all-or-nothing by the *Social publication state* workflow (`npm run social:analytics:apply`) into
`analytics/metrics.json` (latest values per render × platform; audit in `analytics/applied/`). Only
published posts are accepted. Values: number ≥ 0 or `null` = not available; a missing key keeps the
previous value (delayed metrics); older snapshots are no-ops. Schema:
`analytics/schemas/analytics-snapshot.schema.json`. Contract: [SOCIAL_ANALYTICS_CONTRACT](SOCIAL_ANALYTICS_CONTRACT.md).

### Performance Scoring

`growth/performance.ts`:

- per post: normalized rates — shares/views, comments/views, likes/views, saves/views,
  (followers|subscribers)/views, retention (direct rate, else average watch time / duration); each
  divided by a reference "very good" rate (`referenceRates`), capped (`ratioCap`), weighted by
  `performanceWeights` = retention 35 % · shares 20 % · comments 15 % · follows 15 % · saves 10 % ·
  likes 5 %; missing metrics drop out and the weights re-normalize; < `minViewsForScore` views → unscored;
- per content: weighted mean over platforms (`platformWeights`: Instagram/TikTok/YouTube 1, **Facebook 0**),
  metrics younger than `matureAfterHours` (48 h) weigh `immatureWeight` (0.5);
- per content / character / anime / contentType / hookType / durationBucket / platform: mean, n and a
  **shrunk estimate** `(n·mean + k·globalMean)/(n + k)` with k = `minimumSamples`.

### Exploration vs Exploitation

Each run draws a seeded number: `explorationRate` (30 %) of runs **explore** (novelty: anime and formats
the recent feed showed least, + jitter), the others **exploit** (predicted performance from the shrunk
estimates). Same state → same seed → same decision (auditable, testable). Variety rules apply in both modes.

### Cold Start

Until `minimumSamples` (8) videos are scored, the mode is `coldstart`: no optimisation on 1–2 videos —
strong variety, main characters favoured, formats and hooks distributed (least recently used).
Shrinkage keeps one lucky video from dominating even after.

### Failure Handling

Prefer **not publishing** to publishing something wrong:

- plan `blocked` (no valid candidate) → nothing queued;
- plan `backlog` (unpublished render / render in progress) → nothing new queued, the existing video is published;
- analytics missing or unreadable → `analytics.status: "unavailable"`, cold-start/editorial selection
  (never a blocker);
- a queue PR that is not the growth engine's selection → red (Editorial rules);
- invalid request / duplicate / rotation violation → red PR (Social validate + Editorial rules); the
  render workflow re-checks the rules before rendering;
- render failure / missing video → the item fails, nothing is in `publishing.ready`;
- series order: `publishing.ready[].waitFor` blocks Part N on a platform until Part N − 1 is
  scheduled/published there;
- receipts and snapshots are validated against history and applied all-or-nothing (idempotent ids);
- Metricool validation errors are the Publishing Agent's `failed` receipts (retry = new scheduled receipt).

### Commands

```bash
npm run social:agent -- --dry-run   # the daily cycle, 12 steps, on the real state — writes nothing
npm run social:agent                # same + writes the ONE queue file of the day (no git)
npm run social:next                 # SOCIAL CONTENT SELECTION report (trace) + request to queue
npm run social:performance          # scores per anime / character / format / hook / duration / platform
npm run social:editorial:check      # queue files vs the hard rules (render gate)
npm run social:editorial:check:selection  # + must be the growth engine selection (PR gate)
npm run social:analytics:validate   # analytics/pending snapshots (contract + history), change nothing
npm run social:analytics:apply      # all-or-nothing → metrics.json + performance.json + next.json
npm run social:analytics:list       # latest metrics per published post
npm run social:growth:test          # growth engine tests
```

### Config

`growth/config.ts` (`GROWTH_CONFIG`) centralizes `explorationRate`, `minimumSamples`,
`maxSameAnimeStreak`, `maxSameCharacterStreak`, `characterCooldown`, `animeCooldown`,
`journeyPartCooldown`, `minItemsBetweenJourneyParts`, `preferredItemsBetweenJourneyParts`,
`contentTypeCooldown`, `hookCooldown`, `ctaCooldown`, `videosPerRun`, `feedLocale`, `contentTypeMix`, `importanceBonus`, `penalties`,
`performanceWeights`, `referenceRates`, `ratioCap`, `platformWeights`, `matureAfterHours`,
`immatureWeight`, `minViewsForScore`, `durationBuckets`. Template limits stay in `config/defaults.ts`
(`GUESS_MIN/MAX_PLACES`, `VERSUS_MIN_PLACES`, `VERSUS_TOP_PER_WORLD`).

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
