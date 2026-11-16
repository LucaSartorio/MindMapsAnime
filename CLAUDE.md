# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**AniMapVerse** (https://animapverse.com; formerly "Mappe Interattive") — a frontend-only SPA,
statically pre-rendered page by page for SEO (see "SEO architecture" in `seo.md`), for exploring interactive
maps of narrative worlds (worlds, nations, regions, villages/landmarks, characters,
factions, arcs, timeline events, routes, and a per-world "power system"). Stack:
React 18 + TypeScript (strict) + Vite + Zustand + React Flow (`@xyflow/react`) +
Tailwind + React Router. Vercel Analytics + Speed Insights (mounted in `src/App.tsx`).
**No backend, no database** — all content lives in local TypeScript files under `src/data/`.

**Available worlds:** Naruto, Hunter x Hunter, One Piece, Dragon Ball, Black Clover, Bleach, Attack on Titan, Jujutsu Kaisen
(`status: 'available'`, full datasets). **Coming soon:** Fullmetal
Alchemist, Frieren, Toriko, Fairy Tail, Demon Slayer (registered in `worlds.ts`,
no dataset yet → render `ComingSoonWorldPage`, noindex).

The app is fully **dataset-driven and dynamic per world**: a new world = a dataset + a
`WorldConfig`, with zero component edits. Do NOT hardcode world-specific terms in shared
components (see "Per-world dynamic config" in `data-integrity.md`).

## How Claude works in this repo (development system)

Full guide: `docs/CLAUDE_DEVELOPMENT_SYSTEM.md`. The main session is the **orchestrator**: it classifies the
request, loads the matching skill, delegates only when it pays off, integrates and validates.

- **Classify first.** TRIVIAL (label, condition, typo) → do it directly, targeted check, no delegation.
  STANDARD (one feature/bug in one area) → at most one specialist, or none if the change is small.
  COMPLEX (multi-module, new map system, big content batch) → short plan, parallel *read-only* analysis,
  serialized edits, full gate. CRITICAL (security, CI/workflows, social production pipeline, global SEO, data
  migrations, shared components with wide impact) → deep analysis + an independent review + full gate; anything
  touching permissions, secrets, rulesets or production state needs the owner's explicit approval.
- **Delegate selectively** (`.claude/agents/`, never all of them): `lightweight-research` (haiku, cheap lookups) ·
  `frontend-specialist` · `map-engineer` · `anime-data-curator` · `seo-growth-engineer` · `qa-performance-engineer`
  · `social-engine-specialist` · `security-devops` (read-only) · `code-architect` (opus, read-only, only for
  complex/critical design). Specialists cannot spawn agents; only the orchestrator coordinates. Never let two
  agents edit the same files at once; parallelize analysis, serialize edits. Skip delegation when a script or a
  direct edit is cheaper (each delegation starts with ~20k tokens of context: a one-line lookup is cheaper with
  `rg`). Every agent answers with `STATUS / FILES / CHANGES / VALIDATION / RISKS / NEXT ACTION`.
- **Skills** (`.claude/skills/<name>/SKILL.md`, invoke as `/<name> [args]`): `add-anime-world <world>` ·
  `enrich-anime-world <world> [focus]` · `analyze-data-coverage [world]` · `optimize-map <world> [level|issue]` ·
  `seo-opportunities [world]` · `audit-animapverse [area]` · `fix-ticket <description>` ·
  `optimize-performance [target]` · `sync-translations <world> <locale>` · `social-engine-maintenance <task>` ·
  `review-pr <number|branch>` (manual) · `validate-release` (manual). If skills are not available (e.g. a Claude
  Code *Projects* cloud thread), read the SKILL.md file and follow it.
- **Models**: the owner picks the orchestrator's model/effort; `.claude/settings.json` never forces one. Agents
  carry their own `model`/`effort` in frontmatter. Do not set `CLAUDE_CODE_SUBAGENT_MODEL(_FORCE)` or
  `CLAUDE_CODE_EFFORT_LEVEL` globally: they override per-agent routing.
- **Tokens**: deterministic first (validators, `npm run data:coverage`, `rg`) before AI reasoning; read the parts
  of files you need, never whole datasets or `dist/` HTML; summarize logs (tail + error lines); don't re-read
  unchanged files; don't paste whole files into reports.

## Context map (path-scoped rules)

Detailed architecture lives in `.claude/rules/*.md`; each loads automatically when you touch matching files.
**If you are about to change an area and its rule is not in your context (e.g. Projects threads only load
rules without `paths`), Read the rule file first.**

| Rule | Covers |
| --- | --- |
| `frontend.md` | filters UX primitives, tool rail/header nav (`TopNav`, `WorldTabs`), docked schede + `Tabs`, Story/Relations mode, ⌘K search, focus management & a11y (UX-01/UX-02), Zustand stores + SSR gotchas |
| `maps.md` | React Flow composition, pins/clusters counter-scaling, coordinate planes per world, `mapgen` generators, map markers, story moment, tournaments, focus mode, route stepper, floating panels, timeline playback |
| `graph.md` | derived knowledge graph (`src/lib/graph/`), relation groups, `RelationsPanel`, search over relations |
| `entity-art.md` | per-world placeholders, ability art, fruit looks, detailed portraits (`appearance.ts`) |
| `data-integrity.md` | `WorldDataset` shape, registry & slugs, `WorldConfig`, battles/family/structure/journeys, data conventions, adding a world |
| `i18n.md` | six UI languages, `Localizable`, source vs UI languages, es/fr overlays, names per language |
| `seo.md` | URLs/path helpers, permanent slugs, `resolveSeoPath`, metadata, index/noindex, canonical, sitemap, structured data, SSR-safety, SEO checklist |
| `social-safety.md` | social engine (internal only): agents, growth engine, publication state, State Bot, workflows, social commands |
| `security.md` | Site CI, SEC-01/CODEOWNERS, workflow and dependency guardrails |
| `testing.md` | how tests are written here and what counts as verification |

## Commands

```bash
npm run dev              # Vite dev server → http://localhost:5173
npm run build            # validate:data && validate:i18n && tsc -b && test:seo && i18n:audit && vite build && build:ssr && prerender && seo:check (ALL blocking)
npm run test:ci-scope    # Site CI selection rules (which PRs are social-only), node --test
npm run build:ssr        # vite build --ssr src/entry-server.tsx → dist-server/ (build-only, gitignored)
npm run prerender        # SSG: one static HTML per public page + 404.html + sitemap*.xml + robots.txt + llms.txt
npm run test:seo         # SEO invariants on sources (slugs, URL round-trip, metadata, hreflang, sitemap)
npm run seo:check        # SEO checks on the generated dist/ HTML (canonical, hreflang, dup titles, broken links…)
npm run preview:static   # serve dist/ with Vercel semantics (redirects, real 404s) → :4173
npm run smoke            # build + browser smoke test (routes, hydration kept, language switch, 404, modals)
npm run preview          # Vite preview (NB: answers 200 to ANY path — use preview:static for HTTP tests)
npm run validate:data    # validate ALL registered datasets; exits 1 on integrity errors
npm run validate:i18n    # UI keys aligned in all 6 locales + every dataset Localizable field is { it, en } (blocking)
npm run seo:slugs        # freeze published SEO slugs into src/data/<world>/slugs.ts (`-- --check` = verify only)
npm run i18n:status      # dataset translation overlays (es, fr): coverage, missing, stale, orphan keys (docs/I18N.md)
npm run i18n:audit       # BLOCKING: every shown label/name exists in every URL language (`-- --locale de` = what a new language needs)
npm run i18n:extract -- --world naruto --locale es --out tmp/todo.json   # texts to translate (missing + stale)
npm run i18n:merge -- --world naruto --locale es --from tmp/es.json      # write src/data/<world>/i18n/es.ts + es.meta.json
npm run i18n:index       # regenerate src/data/translationIndex.ts after every i18n:merge (`-- --check` = verify only)
npm run extract:boundaries  # regenerate Naruto nation boundary SVG paths from the world PNG
npm run find:dots        # detect the red village-marker dots in the Naruto PNG, print flow coords
npm run data:coverage    # per-world gap report (thin pages, orphans, missing links/chapters); `-- <world> [--json]`
npm run claude:validate  # validate .claude/ agents, skills, rules, settings + CLAUDE.md budget (zero deps)
```

Social engine commands: `.claude/rules/social-safety.md` (and `docs/SOCIAL_ENGINE.md`).

- **There is no test framework** (the SEO tests use plain `node:assert` in `scripts/`) and
  `npm run lint` (`eslint .`) has no eslint config or dependency installed — do not rely on it.
  After any change, the gate is `npm run build` (validate:data + validate:i18n + tsc + SEO tests + prerender +
  seo:check: slug lock, slug collisions, thin content, IT/EN localization), and `npm run seo:slugs` +
  `npm run i18n:index` when you add entities or merge translations (`test:seo` fails on a stale slug lock or
  translation index).
- `npm install` is required first in a fresh checkout (node_modules is not committed).
- `scripts/*.ts` run under `tsx --tsconfig scripts/tsconfig.json` because they import `src/`
  via the `@/` alias. Besides the 4 npm scripts there is per-world tooling in `scripts/`
  (`hxh-extract-boundaries`, `hxh-overlay`, `optimize-hxh-map`, `onepiece-pins.ts`, and the
  `onepiece-*.py` overlay/snap helpers). Use the same `tsx` invocation for any new TS script.
- Import alias: `@/` → `src/` (configured in `vite.config.ts` and the tsconfigs).

## Core invariants (always apply — details in the rule files)

- **Dataset-driven, world-agnostic.** A new world = dataset + `WorldConfig`, zero component edits. Never hardcode a
  world's terms/ids in shared code: use `src/lib/worldConfig.ts` helpers, data-derived options, `humanizeId()`.
- **Entities reference each other by string `id`**; `npm run validate:data` must stay green. Uncertain data →
  `referenceStatus: 'needs_verification'`; non-manga content → the matching `canonStatus`. Never invent facts.
- **Text**: every narrative `Localizable` is `{ it, en }`; render it via `getLocalizedText`/`getEntityDisplayName`,
  never raw in JSX. Never hardcode a user-facing string (incl. `aria-label`) — add the key to all six
  `src/i18n/resources/*.ts`. IDs, slugs, tag values are never translated. es/fr dataset text only via overlays
  (`i18n:extract` → `i18n:merge` → `i18n:index`).
- **SEO**: URLs only from `src/seo/paths.ts` helpers (never `world.slug` in a URL); slugs are permanent (`slugs.ts`
  is generated by `npm run seo:slugs`, never hand-edited); existence = `resolveSeoPath` (real 404, never a soft
  redirect); metadata only from `buildPageMeta`; never lower quality thresholds to index thin pages; SEO relations
  are real `<a href>`. Run the SEO checklist in `seo.md` for every new page/entity type.
- **SSR-safety**: first render identical on server and client (no `window`/`localStorage` during render, browser-only
  UI behind `useHydrated`); new `ActiveModal` kinds must be registered in `ModalDeepLink`.
- **Generated files are never hand-edited**: `src/data/<world>/slugs.ts`, `src/data/translationIndex.ts`,
  `src/data/<world>/i18n/*.meta.json`, pin coordinates written by `scripts/mapgen/*.py` (edit the generator), social
  `catalog/`, `history/`, `publication/applied/`.
- **Social engine is internal only**: `src/` never imports `tools/social-engine` or Remotion; the repository never
  publishes; production state changes only through the pipeline (see `social-safety.md`).
- **Copyright**: no downloaded or traced official artwork, no copied wiki prose; every `AssetReference` carries
  `license`, `author`, `source`, `url`. Content is original text based on verified facts.

## Validation matrix (run what the change touches; all of it before a PR)

| Change | Minimum checks |
| --- | --- |
| UI component / page / store | `npx tsc -b` while iterating → `npm run build`; `npm run smoke` for visible/interaction changes |
| Map code or map data | as UI + exercise the map in `npm run smoke`; re-run the `mapgen` generator if you moved a landmark |
| Dataset content | `npm run validate:data` → `npm run validate:i18n` → `npm run seo:slugs` + `npm run i18n:index` if entities were added → `npm run build` |
| Translations / overlays | `npm run i18n:status` → `npm run i18n:index` → `npm run validate:i18n` + `npm run i18n:audit` → `npm run build` |
| SEO layer | `npm run test:seo` → `npm run build` (prerender + `seo:check`) |
| Social engine | `npm run social:validate` (+ `social:catalog`/`social:schema` if data/limits change, a `--dry-run`) → `npm run build` |
| Workflows / CI / package*.json | `security-devops` review + `npm run test:ci-scope` + `npm run build` |
| `.claude/` config | `npm run claude:validate` |

`npm run lint` is not configured (no eslint): never report it as a check. Report exactly what ran and its result.

## Git & delivery

Work on a feature branch, never push to `main`, never force-push, never merge or approve PRs, never rewrite
others' history, never disable or skip CI. Commit coherent units; open a PR only when the owner asks. The daily
social automations push state commits to `main` and open their own PRs — never touch their branches or files.
