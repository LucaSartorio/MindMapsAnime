---
paths:
  - "tools/social-engine/**"
  - ".github/workflows/social-*.yml"
  - "docs/SOCIAL_*.md"
---

# Social engine — production safety

Moved verbatim from `CLAUDE.md`. The contracts in `docs/SOCIAL_*.md` win over any generic instruction.
**Never** (unless the owner explicitly asks in this conversation): edit `history/history.json`,
`publication/applied/**`, `catalog/*.json`, `analytics/metrics.json` by hand; queue, render or apply receipts
for real; change `growth/config.ts` knobs or the editorial rules; touch the State Bot workflows' credentials,
`secrets: inherit`, skip markers or concurrency groups. Develop with `--dry-run` / `social:validate`.

## Social commands

```bash
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
  no `pull_request_target`, no PAT; every job has a read-only `GITHUB_TOKEN` and the only secret is the State Bot key,
  used solely by `social-state-persist.yml` jobs that run in the `social-state` environment (main only).
- **MP4 never committed**: videos leave the runner only as workflow artifacts.
- **Queue JSON are untrusted input**: always validated by the engine (schema, data, duplicates, path guards).
- **State Bot (SEC-01, `docs/SOCIAL_STATE_BOT.md`)**: state commits are pushed by the GitHub App "AniMapVerse State
  Bot", never by `GITHUB_TOKEN`: the work job (render / apply) exports a state bundle
  (`tools/social-engine/ci/state-bundle.mjs`, zero dependencies, exact allowlist per profile), an unprivileged job
  prepares it (merge driver + catalog, `prepare-state.sh`) and a privileged job (environment `social-state`, no npm, no
  app code) pushes it. Never run npm/app code in a job that holds the App token, never widen the allowlist without a
  test, never add a fallback to other credentials. The callers (`state`/`state-retry` jobs) MUST pass `secrets: inherit`:
  an environment secret never reaches a reusable workflow otherwise (incident 2026-11-11); verify the real path with
  Social render → Run workflow `dry_run` (job *State Bot credentials*). Tests: `npm run social:state:test` (part of `social:validate`).
- **History must persist**: Social render persists `history/`, `content/`, `catalog/` (only those paths), also on
  partial failure; Social publication state persists `history/`, `publication/`, `analytics/`, `catalog/`. Both go
  through `social-state-persist.yml`: `prepare-state.sh` rebases with the field-level `history.json` merge driver
  (`.gitattributes`, `cli/merge-history.ts`) if the other workflow committed meanwhile, the persist job pushes without
  force (per-path check; `conflict` → a second round re-prepares on the newer main) — never hand-merge history.
  `ci/commit-state.sh` is the legacy path, kept until the migration is validated (rollback = revert).
- **No workflow loops**: the State Bot's pushes DO trigger workflows (unlike `GITHUB_TOKEN`), so state commits carry
  `[skip social-render]` / `[skip social-publication]` + `[skip ci]` (subjects in `state-bundle.mjs`), and the jobs skip
  both `github-actions[bot]` and the App login (repository variable `STATE_BOT_LOGIN`). Keep all guards. Publication: own concurrency group `animapverse-social-publication-state`, no cancel;
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
