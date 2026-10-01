# Social Engine (internal video renderer)

> **INTERNAL ONLY.** A private developer tool that renders vertical videos
> (YouTube Shorts / TikTok / Instagram Reels) from the AniMapVerse datasets.
> It is **not** part of the public site: no routes, no UI, no endpoints, no code
> in the Vite bundle. It runs only through local npm scripts.

```
AniMapVerse data (src/data, src/seo, src/utils)
        ↓  read-only, same registry/helpers as the site
tools/social-engine  (config → validation → resolver)
        ↓
template (CharacterJourney)  →  Remotion  →  1080×1920 H.264 MP4
```

## Commands

```bash
npm run social:studio      # Remotion Studio (local preview, editable props) → http://localhost:3000
npm run social:validate    # typecheck the engine + 27 checks (schema, data, i18n, timing, isolation)
npm run social:render -- --config tools/social-engine/examples/itachi-character-journey.json
npm run social:render -- --template character-journey --anime naruto --character itachi-uchiha
npm run social:render -- --help
```

Useful render flags:

| Flag | Meaning |
| --- | --- |
| `--config <file>` | JSON config. Flags passed with it override its fields (e.g. `--locale it`). |
| `--template --anime --character` | Config from flags only (`--subject` = alias of `--character`). |
| `--locale en\|it` `--hook` `--cta` `--duration` `--max-stops` | Optional overrides. |
| `--audio <file> [--audio-volume 0..1]` | Optional local royalty-free soundtrack. |
| `--dry-run` | Validate + print the plan (stops, labels, link). Renders nothing. |
| `--still 40,200,520` | PNG stills of those frames (fast review, thumbnails). |
| `--frames 0-120` | Render only a frame range of the MP4. |
| `--out <file.mp4>` | Custom output path. |
| `--browser-executable <path>` | Headless Chromium to use (see Troubleshooting). |

Exit codes: `0` ok · `1` invalid config / missing data / render failure · `2` usage error.

## Output

`tools/social-engine/output/<subject>-<template>-<locale>.mp4`, e.g.
`tools/social-engine/output/itachi-uchiha-character-journey-en.mp4`.

- 1080×1920 (9:16), 30 fps, H.264 High, `yuv420p`, CRF 18, no audio track
  unless one is configured. Default 22 s (configurable 12–60 s).
- Same config + same data → same file (deterministic: no randomness, no
  network, no AI; verified byte-identical across runs).
- `output/` and `.cache/` are git-ignored, as are `*.mp4/*.mov/*.webm`
  anywhere. Never commit renders.

## Architecture

```
tools/social-engine/
  index.ts               Remotion bundle entry (fonts + registerRoot)
  Root.tsx               one <Composition> per registered template
  remotion.config.ts     Studio config (@/ alias, public dir, codec)
  tsconfig.json          isolated TS project (not part of `tsc -b`)
  config/                shared types, defaults, deterministic copy (it/en), schema helpers
  data/                  read-only adapters over the site data:
                         world.ts (registry loader), entities.ts (slug/id lookup),
                         projection.ts (sub-map → world-map), journey.ts (journey builder + sampling)
  lib/                   camera, easing, geometry (route arcs), fonts, theme (brand tokens), errors
  components/            shared video components: Hook, MapStage, RouteLayer, LocationMarker,
                         LocationLabel, StopCard, CharacterHeader, KeyLocations, CallToAction, …
  templates/
    types.ts             TemplateDefinition contract
    registry.ts          THE list of templates + parseSocialVideoConfig (dispatch by `template`)
    characterJourney/    config.ts · resolve.ts · timeline.ts · camera.ts · CharacterJourney.tsx · index.tsx
  render/                CLI (render.ts, args.ts, paths.ts, webpack.ts) + validate.ts
  examples/              reference configs (Itachi PoC — also the Studio default props)
  content/               queue of validated video configs (future: written by a content agent)
  output/                renders (git-ignored)
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
- **Bundle isolation.** Remotion packages are `devDependencies`; nothing in
  `src/` imports them, so Vite never bundles them (verified on `dist/`).

## Config format

`SocialVideoConfig` (`config/types.ts`) is validated by `parseSocialVideoConfig`
(`templates/registry.ts`). Unknown fields are errors; every problem is reported
at once.

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
| `subject` | ✔ | SEO slug (`itachi-uchiha`), id (`char-itachi`) or id without prefix (`itachi`) |
| `locale` | | `en` · also `it` (the datasets' source languages) |
| `hook` | | `Follow {name}'s journey across the {anime} world` / `Segui il viaggio di {name} nel mondo di {anime}` (≤ 90 chars) |
| `cta` | | `Explore the full journey on AniMapVerse` / `Esplora l'intero viaggio su AniMapVerse` (≤ 80 chars) |
| `durationSeconds` | | `22` (12–60) |
| `journey.routeIds` | | the character's own routes |
| `journey.includeEvents` | | `true` |
| `journey.maxStops` | | `6` (2–8), further capped by the duration (~1.6 s per stop minimum) |
| `highlights` | | auto: the 3–5 most important stops (ids or SEO slugs; must be on the journey) |
| `audio` | | none. Local file only, never copyrighted OSTs |

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
3. Add one line to `TEMPLATES` in `templates/registry.ts`. The CLI, the Studio
   and `social:validate` pick it up from there (no switch elsewhere).
4. Reuse `components/` and `lib/` (camera, easing, theme, fonts). Planned:
   LocationSpotlight, ArcTimeline, WorldComparison, FactionOverview, DidYouKnow.

## Adding an anime / using a new entity

- **New anime:** nothing to do in the engine. Once the world is `available`
  with a dataset in `src/data/registry.ts`, `--anime <slug>` works. For a nice
  map, give its base `MapLevel` a `backgroundAssetId` whose asset `url` is a
  local file under `public/` (remote URLs are ignored on purpose).
- **New character:** it needs ≥ 2 places on the world map, through a personal
  route (`Route.steps`, ideally with `arcId`s) and/or located timeline events
  (`TimelineEvent.characterIds` + `locationId`). Check with `--dry-run`.
- **Other entity kinds** (locations, arcs, factions…) belong to new templates:
  resolve them with `data/entities.ts` and the site's helpers.

## Content queue (phase 2 ready)

`tools/social-engine/content/*.json` holds video configs to render. They are
validated by `social:validate`. In phase 2 a content agent will write configs
here; nothing is connected yet (no OpenAI/Anthropic API, no paid service, no
auto-publishing).

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
- **"Detected differing memory amounts" warnings:** Remotion noise inside
  containers; harmless.
