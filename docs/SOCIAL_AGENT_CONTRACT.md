# Social Agent Contract

> The contract between a **content agent** (e.g. a ChatGPT agent) and the AniMapVerse
> **social-engine**. The **growth engine** chooses WHAT to produce (`catalog/next.json`), the agent queues it; the engine validates, renders,
> records and refuses anything unsafe or duplicated.
> Machine-readable twin: [`tools/social-engine/schemas/social-content.schema.json`](../tools/social-engine/schemas/social-content.schema.json)
> (JSON Schema 2020-12, generated from the TypeScript types — `npm run social:schema`).

## 0. The agent's whole job

The agent **never renders, never runs the engine, never builds journeys and never edits state**. It only:

1. **reads** `tools/social-engine/catalog/next.json` (the growth engine's decision, §0b) — plus
   `catalog.json` / `history.json` for context (default branch);
2. **creates** ONE queue JSON = `next.json` `request` in `tools/social-engine/content/queue/`
   (name `NNNN-<anime>_<subject>_<template>[_<segment>]_<locale>.json`, next free number), following §2;
3. **commits on a branch and opens a pull request** — the *Social validate* check must be green
   (it rejects invalid, duplicated or unrenderable requests);
4. after the merge, **waits for the *Social render* workflow run** on `main` triggered by that merge
   (GitHub API: workflow `social-render.yml`, event `push`, `head_sha` = the merge commit);
5. **reads `render-summary.json`** in the run's artifact `animapverse-social-render-<run_id>-<attempt>`
   (also exposed as the job output `artifact_name`) — `rendered[]` / `failed[]`;
6. **downloads** the artifact and takes `videos/<file>.mp4` (+ `manifests/<file>.manifest.json`
   for title/hook/page URL/series facts). A red run = at least one failure: read `failed[]`.

Never commit MP4s, never touch `history.json`, never set `allowRerender`.

> **Content Agent ≠ Publishing Agent.** This contract is the **Content Agent**: it decides what to
> produce and gets videos **rendered**. Scheduling/publishing already-rendered videos (Metricool →
> Instagram / Facebook / TikTok / YouTube) and reporting it back with *publication receipts* is the job of the
> **Publishing Agent**, under its own contract:
> [`docs/SOCIAL_PUBLISHING_CONTRACT.md`](SOCIAL_PUBLISHING_CONTRACT.md). The Content Agent never
> publishes and never writes receipts; `renderedLocales` / `renderedBefore` in the catalog mean
> "an MP4 exists", **not** "published". Before generating new content, the Publishing Agent's work
> list `catalog.publishing.ready` comes first (rendered videos still waiting to be scheduled).

## 0b. The daily run: the growth engine decides, the agent executes

**The agent NEVER chooses content.** Not "today a CharacterJourney", not a character, not a
format: the repository's **Social Growth Engine** (`growth/`, see
[`docs/SOCIAL_ENGINE.md` › Growth Engine](SOCIAL_ENGINE.md#growth-engine)) selects the next video
and writes it to `tools/social-engine/catalog/next.json`. The agent starts the day without knowing
what it will publish — a `character-journey`, a `guess-character` or a `character-versus` — and
executes what `next.json` returns.

1. **reconcile**: pending receipts / analytics PRs merged, `catalog.publishing.ready` checked
   (see the [publishing contract](SOCIAL_PUBLISHING_CONTRACT.md));
2. read `tools/social-engine/catalog/next.json` (default branch) and act on `status`:
   - `"backlog"` → **queue nothing**. `backlog.unpublished[]` is a rendered video never published:
     publish it (it is today's video). `backlog.inProgress[]` = a render is pending: wait for it.
   - `"blocked"` → **queue nothing** (fail-safe: no content respects the rotation today).
   - `"ready"` → write **one** queue file whose content is exactly `request` (you may add
     `"$schema": "../../schemas/social-content.schema.json"`; nothing else changes — template,
     subject/opponent/segment, hook, CTA, `hookType`, `hookId`, `ctaType`, `selection` included);
3. **one new video per run**, English feed (`locale: "en"`);
4. PR → *Social validate* → merge → *Social render* (renders it with the composition of its content
   type, plus a cover) → publish (Publishing Agent) → receipts → the plan is regenerated.

*Social validate* enforces this (**Editorial rules**, `social:editorial:check:selection`): a queued
EN video that is not `next.json`'s `request` (different video, or a rewritten hook / CTA / seed), a
second new video in the same PR, or any new video while the plan is `backlog` → **red PR**. If `main`
moved meanwhile (a render, receipts or analytics regenerated `next.json`) and the check says "not the
growth engine selection", re-read `next.json` and replace the queue file with the new `request`. Every
hard rule comes from `growth/config.ts` (the single source): **MAX SAME ANIME STREAK = 2** (after two
videos of an anime, a different anime is forced — whatever the scores), never the **same character
twice in a row** (any format), journey **parts in order** with **≥ 2 videos in between**. Format,
hook and CTA rotation and exploration/exploitation are applied by the selector. **Performance may
optimise the selection; it never overrides an editorial hard rule.** Analytics missing → the plan is
still `ready` (cold-start/editorial selection): never skip a day because metrics are unavailable.

`next.json` → `trace` (SelectionTrace) explains the decision: mode, score, recent anime/characters,
forced rotation, hard rules triggered, main excluded candidates with their reason. Use it for the
report. Local equivalent of the whole cycle (humans / CI): `npm run social:agent -- --dry-run`.

### Daily automation instructions (paste into the agent prompt)

```
Do not manually choose a CharacterJourney (or any content).
Run the Social Growth Engine selection: read tools/social-engine/catalog/next.json on main and
execute the returned valid content.

- status "backlog": queue nothing; publish backlog.unpublished[0] (it is today's video).
- status "blocked": queue nothing; report it.
- status "ready": create ONE queue file whose content is exactly `request` (+ "$schema"), open a PR.

Supported production content types:
- character-journey
- guess-character
- character-versus

Respect all hard editorial constraints from configuration and contracts (maxSameAnimeStreak = 2,
maxSameCharacterStreak = 1, journey parts in order with spacing). Performance may optimize
selection but may never override editorial hard rules. Never rewrite hook, CTA or captions:
publish with catalog.publishing.ready[].platformMetadata.
```

### Daily report

```
ANIMAPVERSE SOCIAL AGENT

Selected:      <trace.renderId> — <trace.contentType>      (or BACKLOG: <renderId> / BLOCKED)
Anime:         <titles of trace.animes>
Selection:     <trace.mode> · score <trace.score>
Why:           <trace.explanation, e.g. "Forced anime rotation: the last 2 items are naruto …">
Hook:          <request.hook>
CTA:           <request.cta>
Platforms:     Instagram · TikTok · YouTube · Facebook
Publication:   <scheduled time, Europe/Rome>
PR:            <queue PR url>
Render:        <Social render run url>
Artifact:      <artifact name>
Receipts:      <n>/4
Final state:   scheduled | published | backlog | blocked
```

On failure: `FAILED STEP` (queue / PR / render / publish / receipts), `REASON`, `RECOVERY STATE`
(what exists now: queued file, rendered artifact, which platforms are scheduled) — never retry blindly.

## 1. What the agent reads

| File | What it is |
| --- | --- |
| `tools/social-engine/catalog/catalog.json` | **The menu.** Every video the engine can really render, derived from the datasets, with its history status. Regenerated by `npm run social:catalog` and after every render run. **The catalog decides which videos and which parts exist.** |
| `tools/social-engine/history/history.json` | Every video ever queued/rendered (one record per `renderId`): status, dates, output, artifact, attempts, last error, publication state per platform (written only by the pipeline). |
| `tools/social-engine/catalog/excluded.json` | (optional) Subjects that can't be produced, with the reason. |

### Single journeys and series

A character with a short journey (≤ 8 places) has **one** catalog item (`series: null`).
A character with a long journey is a **series**: one catalog item **per part**, in chronological
order, each a separate video — *Goku's journey · Part 1 of 5*, *Part 2 of 5*… The engine builds
the parts from the story arcs (consecutive arcs, 5–7 places ideally, 8 at most). **The agent
never builds, merges, splits or renumbers parts**: it picks items from the catalog.

Single journey item:

```json
{
  "id": "character-journey:naruto:itachi-uchiha",
  "anime": "naruto", "animeTitle": "Naruto", "subject": "itachi-uchiha",
  "series": null,
  "displayName": { "en": "Itachi Uchiha", "it": "Itachi Uchiha" },
  "locales": ["en", "it"],
  "recommendedDurationSeconds": 27,
  "facts": { "importance": "major", "places": 5, "animatedStops": 5, "arcs": 4, "journeyArcs": 4 },
  "renderedLocales": ["en", "it"], "publishedLocales": [], "queuedLocales": [],
  "renderedBefore": true, "publishedBefore": false
}
```

Part of a series (real catalog data):

```json
{
  "id": "character-journey:dragonball:goku:part-02",
  "anime": "dragonball", "animeTitle": "Dragon Ball", "subject": "goku",
  "series": {
    "id": "character-journey:dragonball:goku",
    "segment": "part-02",
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
  "renderedLocales": [], "publishedLocales": [], "queuedLocales": [],
  "renderedBefore": false, "publishedBefore": false
}
```

- `locales`: languages whose text really exists for this video. **Only request these.**
- `series.segment`: the value to copy into the request's `segment` field.
- `series.partNumber/partCount/previousId/nextId`: the reading order of the series.
- `series.firstArc/lastArc/arcTitles`: the story range of the part (use it to write a hook).
- `series.legacyRenderedLocales` (rare): this subject was rendered as one whole-journey video
  before series existed; treat the subject as already covered in those locales.
- `facts.places` / `journeyArcs` = the full journey; `animatedStops` / `arcs` = this video.
- `recommendedDurationSeconds`: the length the engine will use (computed from the stops).
- `displayName` differs by language for some characters (Luffy / **Rufy**, Goku / **Son Goku**).
- `renderedLocales` / `queuedLocales` / `publishedLocales`: what already exists → avoid it (§5). (Items also carry `scheduledLocales` and `publication` — per-platform state, for the Publishing Agent.)

## 2. What the agent writes

**One JSON object per video**, either:

- as a file in `tools/social-engine/content/queue/` (name: `[A-Za-z0-9][A-Za-z0-9._-]*.json`, e.g.
  `0042-dragonball_goku_character-journey_part-02_en.json`; files are rendered in **name order**), or
- as an **array** of objects in one file, enqueued with
  `npm run social:queue -- --from proposal.json` (each item validated + de-duplicated, then written
  to the queue as a canonical file with every default made explicit). **Preferred.**

### Required fields

| Field | Type | Rule |
| --- | --- | --- |
| `template` | string | `"characterJourney"` (alias `"character-journey"`) |
| `anime` | string | catalog `anime` (`naruto`, `onepiece`, `hunterxhunter`, `dragonball`, `blackclover`, `bleach`, `attackontitan`, `jujutsukaisen`); URL slugs (`one-piece`, `hunter-x-hunter`, `dragon-ball`, `black-clover`, `attack-on-titan`, `jujutsu-kaisen`) also accepted |
| `subject` | string | catalog `subject` (e.g. `itachi-uchiha`). Ids (`char-itachi`) and **unique** short forms (`luffy`) are accepted and normalized |
| `segment` | string | **only for series, and then mandatory**: the item's `series.segment` (`part-01`, `part-02`…). Must be **omitted** for a single journey |

### Optional fields

| Field | Type | Default / rule |
| --- | --- | --- |
| `locale` | `"en"` \| `"it"` | `"en"`. Must be in the item's `locales` |
| `hook` | string, 1–90 chars | single: EN `Follow {name}'s journey across the {anime} world.` · IT `Segui il viaggio di {name} nel mondo di {anime}.` — series: EN `{name}'s journey begins / continues — Part {n} of {total}.`, last part `The last stretch of {name}'s journey — Part {n} of {total}.` · IT `Il viaggio di {name} comincia / continua — Parte {n} di {total}.`, `L'ultimo tratto del viaggio di {name} — Parte {n} di {total}.` Keep it ≤ ~70 chars (2 lines on a phone), in the video's `locale` |
| `cta` | string, 1–80 chars | `Explore the full journey on AniMapVerse` / `Esplora il percorso completo su AniMapVerse`; parts before the last of a series: `Continue the journey on AniMapVerse` / `Continua il viaggio su AniMapVerse` |
| `durationSeconds` | number 12–60 | **Omit it.** The engine computes the length from the stops (24–38 s). If it must be explicit, copy `recommendedDurationSeconds` **exactly** — never invent it |
| `variant` | slug `[a-z0-9-]`, ≤ 80 | none. **Required for a new edition** of a video that already exists (same content + locale) |
| `notes` | string ≤ 500 | why this content was chosen (stored, never rendered) |
| `id` | `"<template>:<anime>:<subject>[:<segment>]"` | the catalog `id`. If present it must match the other fields |
| `status` | `"queued"` | only this value is allowed (the engine owns every other state) |
| `journey` | `{ routeIds?, includeEvents?, maxStops? }` | expert tuning; **agents must omit it** |
| `highlights` | string[] ≤ 5 | recap locations; must be stops of the video; **agents must omit it** |
| `audio` | `{ src, volume? }` | local royalty-free file in `tools/social-engine/audio/`; **agents must omit it** |
| `allowRerender` | boolean | **human override only — agents must never set it** |
| `$schema` | string | ignored |

Any other field is an **error** (typos are never silently ignored).

### Rules for series (multi-part journeys)

- choose only parts that exist in the catalog; **never invent a segment**;
- copy `series.segment` as-is; never change `partNumber`, `arcIds` or the stops;
- never rebuild or re-order a journey, never ask for "the whole journey" of a series;
- prefer the parts **in order**: Part 1 before Part 2 (follow `previousId` / `nextId`); a part
  whose `previousId` hasn't been rendered in the same locale should normally wait;
- omit `journey.maxStops` and `durationSeconds` (or copy `recommendedDurationSeconds` exactly);
- never use `allowRerender`.

### Enums

- `template`: `characterJourney` · `guessCharacter` (`subject`, optional `places` 4–6) ·
  `characterVersus` (`subject` + `opponent: { anime, subject }`, copied from the catalog item `request`)
- growth fields (copy them from `catalog/next.json`, optional otherwise): `hookType`
  (`question` | `challenge` | `curiosity` | `fact` | `versus`), `hookId`, `ctaType`
  (`follow-next-part` | `comment-guess` | `comment-next-matchup` | `comment-pick-side` |
  `comment-missed-location` | `comment-next-journey` | `follow-for-more` | `site-visit` | `subscribe-next-part`),
  `selection` (`{ mode, score, seed }`)
- `locale`: `en`, `it`
- `anime`: `naruto`, `onepiece`, `hunterxhunter`, `dragonball`, `blackclover`, `bleach`, `attackontitan`, `jujutsukaisen` (+ URL slugs)
- `segment`: `part-NN` (from the catalog; a future engine version may emit `part-NN-vN`)
- `status` (input): `queued`
- history `renderStatus`: `queued` → `rendering` → `rendered` | `failed` (`failed` → `queued` on retry)
- history `publicationStatus` (derived, written by receipts only): `notPublished` | `scheduled` | `partiallyPublished` | `published` | `failed` — see the Publishing contract
- platforms: `instagram`, `facebook`, `tiktok`, `youtube` (state per platform: `notScheduled` | `scheduled` | `published` | `failed`)

## 3. Examples

Single journey (minimal):

```json
{ "template": "characterJourney", "anime": "naruto", "subject": "itachi-uchiha", "locale": "it" }
```

One part of a series:

```json
{
  "id": "character-journey:dragonball:goku:part-01",
  "template": "characterJourney",
  "anime": "dragonball",
  "subject": "goku",
  "segment": "part-01",
  "locale": "en",
  "hook": "Before he was a legend, Goku was a kid on a mountain. Part 1.",
  "notes": "Series start: Goku Part 1 of 5, never rendered."
}
```

A typical agent response (array, for `social:queue -- --from`) —
[`tools/social-engine/examples/agent-response.json`](../tools/social-engine/examples/agent-response.json)
(every example there is validated against the real data by the tests):

```json
[
  { "id": "character-journey:dragonball:goku:part-01", "template": "characterJourney", "anime": "dragonball",
    "subject": "goku", "segment": "part-01", "locale": "en",
    "hook": "Before he was a legend, Goku was a kid on a mountain. Part 1." },
  { "template": "characterJourney", "anime": "naruto", "subject": "itachi-uchiha", "locale": "it" },
  { "template": "characterJourney", "anime": "one-piece", "subject": "monkey-d-luffy", "segment": "part-02", "locale": "it" },
  { "template": "characterJourney", "anime": "hunterxhunter", "subject": "gon-freecss", "segment": "part-01",
    "locale": "en", "variant": "father-quest", "hook": "Gon crossed the world to find one man.",
    "cta": "Continue the journey on AniMapVerse" }
]
```

What the engine writes to the queue for `{ "template": "characterJourney", "anime": "dragonball", "subject": "goku", "segment": "part-02" }`:

```json
{
  "$schema": "../../schemas/social-content.schema.json",
  "id": "character-journey:dragonball:goku:part-02",
  "status": "queued",
  "template": "characterJourney",
  "anime": "dragonball",
  "subject": "goku",
  "segment": "part-02",
  "locale": "en",
  "durationSeconds": 30,
  "hook": "Goku's journey continues — Part 2 of 5.",
  "cta": "Continue the journey on AniMapVerse"
}
```

## 4. Identity

| Name | Format | Example |
| --- | --- | --- |
| content id | `<template>:<anime>:<subject>` (single) / `<template>:<anime>:<subject>:<segment>` (part) | `character-journey:naruto:itachi-uchiha`, `character-journey:dragonball:goku:part-02` |
| series id | the content id without the segment | `character-journey:dragonball:goku` |
| render id (one video) | `<contentId>@<locale>[+<variant>]` | `…:goku:part-02@en`, `…:goku:part-02@it+teaser` |
| files | `<anime>_<subject>_<template>[_<segment>]_<locale>[_<variant>]` | `dragonball_goku_character-journey_part-02_en.mp4` / `.manifest.json` |

Ids never depend on the date, the hook or the CTA; the content id doesn't depend on the language.
All parts are lowercase slugs, so no id can contain a path. `part-NN` belongs to segmentation
version 1 (`series.segmentationVersion`); a different algorithm would produce `part-NN-v2`, so
an id never silently changes meaning.

## 5. Duplicate policy

The unit of uniqueness is the **render id** (content — incl. the part — + locale + variant).

| Situation | Result |
| --- | --- |
| same render id already in the queue | **rejected** (`duplicate: … already queued`) |
| same render id already rendered (or published) | **rejected** (`duplicate: … already rendered`) → use a new `variant` for a genuinely new edition |
| same render id previously **failed** | accepted (it's a retry) |
| same content, other locale or other variant | accepted, with a note (`same content already rendered as: en`) |
| another part of the same series (Goku Part 2 EN after Part 1 EN) | accepted — a different video |
| two items of one proposal with the same render id | the first is accepted, the second rejected |

Agent guidance: prefer items with `renderedBefore: false` and no `queuedLocales`; go through a
series in order; don't propose a `variant` of something rendered recently unless the angle
(hook) is genuinely different.

## 6. Errors (what the engine answers)

`npm run social:queue -- --from …` prints one verdict per item and exits 1 if any is rejected;
`npm run social:validate:queue` (and the *Social validate* PR check) does the same for files
already in the queue. Typical errors:

| Error | Meaning / fix |
| --- | --- |
| `template: unknown template "x"` | use `characterJourney` |
| `anime: is required` / `Unknown anime "pokemon". Available: …` | use a catalog `anime` |
| `character "gon-frecss" not found … Did you mean: gon-freecss` | use the catalog `subject` |
| `the journey of "goku" is a series of 5 parts: set "segment" to one of part-01, …` | add `segment` from the catalog |
| `segment "part-09" does not exist for "goku" (parts: …)` | the catalog is the source of truth: re-read it |
| `the journey of "itachi-uchiha" is a single video: remove "segment"` | single journeys have no segment |
| `segment: must look like "part-01"` | copy `series.segment` exactly |
| `journey data missing for character "x"` / `only one place on the map` | subject not in the catalog |
| `locale: must be one of: en, it` | only `en`/`it` |
| `durationSeconds: must be between 12 and 60` | better: omit it |
| `hook: must be at most 90 characters` | shorten |
| `foo: unknown field` | remove it |
| `status: when present must be "queued"` | |
| `id mismatch: the config describes "…" but id says "…"` | omit `id` or copy it from the catalog |
| `duplicate: … already queued / already rendered` | see §5 |

Files dropped directly in the queue that fail validation are moved by the batch to
`content/failed/` with a `<file>.error.json` (`kind`: `invalid` | `data` | `duplicate` | `render`) —
never deleted.

## 7. What happens next (engine side)

```
PR (queue/*.json) ─► Social validate ─► merge ─► Social render (GitHub Actions, ubuntu)
   social:render:queue ─► videos/<stem>.mp4 + manifests/<stem>.manifest.json + render-summary.json  (artifact)
        │                 content/rendered/<file>.json · history: rendered        (bot commit [skip ci])
        └─ failure ──────► content/failed/<file>.json + .error.json · history: failed
```

`render-summary.json` lists every video with `renderId`, `contentId`, `seriesId`, `segment`,
`partNumber`, `partCount`, `title` ("Goku · Character Journey · Part 2 of 5"), `durationSeconds`,
`video`, `manifest`; the format is documented in docs/SOCIAL_ENGINE.md › Cloud rendering.
The agent never renders, moves files, edits history or publishes.
