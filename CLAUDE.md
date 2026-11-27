# CLAUDE.md

Guidance for Claude Code in this repository. Area details load on demand from `.claude/rules/` (by path) and
`docs/ARCHITECTURE.md` (how things work and why); the workflow guide is `docs/CLAUDE_DEVELOPMENT_SYSTEM.md`.

## Project

**AniMapVerse** (https://animapverse.com) — a frontend-only SPA, pre-rendered page by page for SEO, for exploring
interactive maps of narrative worlds (nations, regions, places, characters, factions, arcs, timeline events, routes,
a per-world power system). React 18 + TypeScript (strict) + Vite + Zustand + React Flow (`@xyflow/react`) + Tailwind +
React Router + i18next; Vercel. **No backend, no database**: all content is TypeScript under `src/data/`.
Worlds and their status (`available` | `coming_soon`) are registered in `src/data/worlds.ts`. The app is
**dataset-driven**: a new world = a dataset + a `WorldConfig`, zero component edits.
`tools/social-engine/` is a separate, internal Remotion video pipeline with daily production automations.
`src/features/explorer3d/` is an optional, lazy-loaded procedural 3D viewer of locations (plain Three.js; scenes are
code, no model files; prototype scenes only with `VITE_EXPLORER_3D=1` or `npm run dev`).

## Working here

- **Classify, then act** — risk outranks diff size:
  - **T0 direct** (find a file/id, read config, a deterministic check): `rg`/a validator yourself; no agent, no build.
  - **T1 scoped** (small UI bug, local edit, clear requirements): direct, or one specialist if isolation pays off;
    targeted checks while iterating, the matrix gate before delivery.
  - **T2 multi-part** (dataset enrichment, maps, multi-module feature, non-global SEO): 5-10 line plan, the matching
    skill, only the specialists needed, edits serialized; full matrix checks.
  - **T3 critical** (security, CI/workflows, global SEO, architecture, data migrations, social production state,
    widely shared components): risks + plan before editing, independent review (`/code-review`, `/security-review`),
    full gate; permissions, secrets, rulesets or production state need the owner's explicit approval.
  - **Re-classify** when exploration shows a wider blast radius (shared store, SSR hydration, SEO routes, CI, social
    state): upgrade the tier before editing.
- **Delegate only when it pays off.** Each sub-agent starts with ~20k tokens of context: a one-line lookup is cheaper
  with `rg`. Delegate to keep large outputs (logs, audits, research) out of this context, to use a cheaper model, or
  for a domain specialist; hand it the facts already gathered (paths, ids, failing output) so it does not re-explore.
  Specialists cannot spawn agents; never let two agents edit the same files at once.
- **A check fails → diagnose, then one move** (never retry without new information): missing context → read it, re-run
  that check · local implementation slip → one targeted fix, re-run the failed check · wrong reasoning with the right
  facts → escalate (higher effort or stronger model where the session allows, else say so) with the evidence gathered
  · same failure again, or critical → stop and report cause, evidence, options. Never work around a guard or a check.
- **Done = verified.** Close with `STATUS: PASS | FAIL | PARTIAL | BLOCKED`, files changed, checks run with real
  results, checks skipped and why, residual risks, manual steps for the owner. Edited code alone is not done.
- **Skills** (`.claude/skills/`) load on demand; where they are not available (Claude Code *Projects* threads), read
  the `SKILL.md` and follow it. **Models**: the owner picks the session model/effort; agents carry their own in
  frontmatter. Never set `CLAUDE_CODE_SUBAGENT_MODEL(_FORCE)` or `CLAUDE_CODE_EFFORT_LEVEL` globally.
- **Tokens**: deterministic checks before reasoning (validators, `npm run data:coverage`, `rg`); read only the part of
  a file you need, never whole datasets or `dist/` HTML; summarize logs (failing lines only); do not redo an analysis
  or re-run a check that is still valid for the same state (`node scripts/state-fingerprint.mjs` unchanged; else re-run).

## Context map (path-scoped rules)

Each rule loads automatically when you touch matching files. **If you are about to change an area and its rule is not
in your context (Projects threads load only rules without `paths`), read it first.**
`data-integrity.md` datasets, `WorldConfig`, kits, adding a world · `maps.md` React Flow, coordinates, mapgen,
markers, narrative modes · `frontend.md` UI primitives, header, store/SSR, a11y, contrast · `graph.md` knowledge graph
and relations · `entity-art.md` placeholders and portraits · `i18n.md` locales, `Localizable`, overlays · `seo.md`
URLs, slugs, metadata, indexing · `social-safety.md` social engine production safety · `security.md` CI, CODEOWNERS,
guardrails · `testing.md` how to test and report · `explorer-3d.md` 3D explorer (skill `/create-3d-location`, agent
`3d-world-engineer`).

## Commands

```bash
npm install              # first, in a fresh checkout
npm run dev              # Vite dev server → http://localhost:5173
npm run build            # validate:data → validate:i18n → validate:3d → test:3d:unit → tsc -b → test:seo → i18n:audit → vite (+3D chunk guard) → SSR → prerender → seo:check (ALL blocking)
npm run smoke            # build + browser smoke test (routes, hydration, language switch, 404, modals, header)
npm run validate:data    # integrity of every registered dataset (exit 1 on errors)
npm run validate:i18n    # UI keys aligned in all 6 locales + every dataset Localizable is { it, en }
npm run test:seo         # SEO invariants on sources (slugs, URL round-trip, metadata, hreflang, sitemap)
npm run seo:slugs        # freeze SEO slugs into src/data/<world>/slugs.ts (after adding entities)
npm run i18n:index       # regenerate src/data/translationIndex.ts (after adding entities or merging overlays)
npm run preview:static   # serve dist/ with Vercel semantics (real 404s) → :4173
npm run data:coverage    # per-world gap report; `-- <world> [--json]`
npm run claude:validate  # .claude/ config + hook tests (also in Site CI)
npm run test:3d          # 3D explorer: flag-on full build + Chromium scenarios (benchmark:3d reuses it)
```

Area commands live in their rules (i18n overlays, map scripts, social engine) and in `package.json`. There is no
test framework (`node:assert` / `node --test` scripts) and `npm run lint` is not configured: never report it as a
check. `scripts/*.ts` run with `tsx --tsconfig scripts/tsconfig.json` (they import `src/` via `@/` → `src/`).

## Core invariants

- **World-agnostic shared code**: per-world terms/behaviour come from `WorldConfig` (`src/lib/worldConfig.ts`), data
  and `humanizeId()`, never from hardcoded world ids or names.
- **Entities reference each other by string `id`**; `npm run validate:data` stays green. Never invent facts; uncertain
  data → `referenceStatus: 'needs_verification'`; non-manga content → the matching `canonStatus`.
- **Text**: every narrative `Localizable` is `{ it, en }`, rendered through `getLocalizedText`/`getEntityDisplayName`,
  never raw in JSX. No hardcoded user-facing string (incl. `aria-label`): keys in all six `src/i18n/resources/*.ts`.
  Ids, slugs and tag values are never translated; es/fr dataset text only through overlays.
- **SEO**: URLs only from the `src/seo/paths.ts` helpers (never `world.slug` in a URL); slugs are permanent; page
  existence = `resolveSeoPath` (real 404, never a soft redirect); metadata only from `buildPageMeta`; never lower
  quality thresholds to index thin pages; SEO relations are real `<a href>`.
- **SSR-safety**: the first render is identical on server and client (no `window`/`localStorage` during render,
  browser-only UI behind `useHydrated`); a new `ActiveModal` kind is registered in `ModalDeepLink`.
- **Generated files are never hand-edited**: `src/data/<world>/slugs.ts`, `src/data/translationIndex.ts`, overlay
  `*.meta.json`, pin coordinates written by `scripts/mapgen/*.py` (edit the generator), social `catalog/`,
  `history/`, `publication/applied/` (`.claude/settings.json` denies those edits).
- **Social engine is internal**: `src/` never imports `tools/social-engine` or Remotion; the repository never
  publishes; production state changes only through its pipeline (`social-safety.md`).
- **Copyright**: no downloaded or traced official artwork, no copied prose; every `AssetReference` has `license`,
  `author`, `source`, `url`.
- **3D stays optional**: ordinary code imports only `src/features/explorer3d/launcher/` (+ `types.ts`), never the
  engine or `three`; no 3D byte before an explicit click (`validate:3d` + build guard + `test:3d` enforce it).

## Validation matrix (run what the change touches; all of it before a PR)

| Change | Minimum checks |
| --- | --- |
| UI component / page / store | `npx tsc -b` while iterating → `npm run smoke` for visible/interaction changes, else `npm run build` |
| Map code or map data | `npx tsc -b` → `npm run smoke` (map scenarios); re-run the `mapgen` generator if a landmark moved |
| Dataset content | `validate:data` → `validate:i18n` → `seo:slugs` + `i18n:index` if entities were added → `social:catalog` + `social:validate` if an `available` world changed → `build` |
| Translations / overlays | `i18n:status` → `i18n:index` → `validate:i18n` + `i18n:audit` → `build` |
| SEO layer | `test:seo` → `build` (prerender + `seo:check`) |
| Social engine | `social:validate` (+ dry runs, see `social-safety.md`) → `build`, skipped only if every changed file is under `tools/social-engine/` (Site CI skips it too) |
| Workflows / CI / package*.json | `security-devops` review + `test:ci-scope` + `build` |
| 3D explorer (`src/features/explorer3d/`) | `validate:3d` + `test:3d:unit` → `npx tsc -b` → `test:3d` (+ screenshots for visual changes) → `smoke` |
| `.claude/` config | `claude:validate` |

Cheapest first, stop at the first failure. Supersets run once per tree state: `smoke` = `build` + browser (never
`build` then `smoke`); `build` already runs `validate:data`, `validate:i18n`, `tsc -b`, `test:seo`, `i18n:audit`, so a
batch loop runs the validators and one `build`/`smoke` closes the task. Report exactly what ran and its result.

## Git & delivery

Work on a feature branch; never push to `main`, never force-push, never merge or approve PRs, never rewrite others'
history, never disable or skip CI. Commit coherent units; open a PR only when the owner asks. The daily social
automations push state commits to `main` and open their own PRs — never touch their branches or files.
