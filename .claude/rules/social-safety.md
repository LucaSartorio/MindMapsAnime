---
paths:
  - "tools/social-engine/**"
  - ".github/workflows/social-*.yml"
  - "docs/SOCIAL_*.md"
---

# Social engine — INTERNAL ONLY — production safety

The contracts win over any generic instruction: `docs/SOCIAL_ENGINE.md`, `docs/SOCIAL_AGENT_CONTRACT.md`,
`docs/SOCIAL_PUBLISHING_CONTRACT.md`, `docs/SOCIAL_ANALYTICS_CONTRACT.md`, `docs/SOCIAL_STATE_BOT.md`. Architecture
summary and commands: `docs/ARCHITECTURE.md` › Social engine. Production runs daily through external agents (queue
PRs, publication receipts, analytics snapshots) and GitHub workflows; the repository is the source of truth.

**Never, unless the owner explicitly asks in this conversation**: edit `history/history.json`, `catalog/*.json`,
`publication/applied|failed/**`, `analytics/metrics.json`, `content/rendered|failed/**` by hand; queue, render (non-dry)
or apply receipts/snapshots for real; change `growth/config.ts` knobs, the HARD editorial rules or `next.json`
semantics; add a second selector; touch the State Bot workflows, `secrets: inherit`, skip markers, bot-login guards,
concurrency groups or the state allowlists; touch the agents' branches or daily files. Develop with `--dry-run`.

Permanent rules:
- **Internal only**: no public UI/route/page/endpoint/link; `src/` never imports `tools/social-engine` or
  `remotion`/`@remotion/*` (`social:validate` fails). Remotion stays in devDependencies, one exact version.
- **Data-driven**: read the site's data/helpers through `@/` (registry, slugs, paths, `getEntityDisplayName`), never
  duplicate or hand-list content; shared logic is extracted into `src/` without changing site behaviour.
- **The repository never publishes**: no Metricool/Instagram/Facebook/TikTok/YouTube API, SDK, OAuth, token, account
  or timezone; no AI or paid APIs; default copy and hooks/CTAs/captions come from deterministic banks.
- **Agent-ready JSON**: requests follow `docs/SOCIAL_AGENT_CONTRACT.md`; the JSON Schemas are generated from the TS
  constants (`npm run social:schema`, keep in sync); unknown fields are errors; queue JSON is untrusted input
  (schema, data, duplicates, path guards via `safeJoin`).
- **State machines**: render status and publication status are separate; publication state changes ONLY through
  receipts (all-or-nothing apply, `publication/applied/` is an audit trail); `publicationStatus` is derived from
  `platforms[]`; a render × platform is never scheduled twice. History is required and versioned; duplicates are
  rejected by render id (a new edition needs a `variant`; `allowRerender` is human-only).
- **The growth engine is the ONLY selector** (`planNext`): agents and workflows execute `catalog/next.json`
  (`ready | backlog | blocked`); editorial rotation rules are HARD and run before scoring; every decision carries a
  secret-free `SelectionTrace`; missing analytics = cold start, never a blocker. Knobs only in `growth/config.ts`.
- **Deterministic rendering**: compositions are pure functions of (data, frame); no randomness, network assets,
  official artwork or copyrighted music; fonts only from bundled `@fontsource`. Templates only in `templates/registry.ts`;
  missing data throws `RenderDataError` (never an empty video). Journey series ids (`part-NN`) belong to
  `SEGMENTATION_VERSION` 1 — a new algorithm bumps the version; durations are computed by the engine.
- **Workflows are the cloud renderer**: they call existing npm scripts only (no logic in YAML, no second renderer),
  PRs never render, no `pull_request_target`, no PAT, read-only `GITHUB_TOKEN`; the State Bot key is used only by
  `social-state-persist.yml` jobs in the `social-state` environment (callers pass `secrets: inherit`); no npm/app code in
  a job holding the App token; state commits carry the skip markers. MP4 and renders are never committed.

Checks: `npm run social:validate` (+ `social:growth:test`, `social:publication:test` when relevant; `social:catalog` /
`social:schema` when data or limits change; `npm run social:render:queue:dry` or `npm run social:agent -- --dry-run`)
→ `npm run build` (the public site must be unaffected). **Engine-only exception**: when every changed file is under
`tools/social-engine/` (commit, then `git diff --name-only origin/main...HEAD | grep -v '^tools/social-engine/'` prints
nothing), skip the build: nothing in the site build reads `tools/`, `social:validate` fails if `src/`
imports the engine, and Site CI skips it for the same PR. Any other file (`src/` shared logic, `package*.json`,
`scripts/`, workflows, data) → full build.
