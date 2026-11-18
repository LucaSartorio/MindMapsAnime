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

## Working here

- **Classify, then act.** Trivial or single-area work: do it directly with a targeted check. Multi-module work: short
  plan, read-only analysis in parallel, edits serialized, full gate. Critical work (security, CI/workflows, social
  production, global SEO, data migrations, widely shared components): deeper analysis + an independent review
  (built-in `/code-review`) + full gate; permissions, secrets, rulesets or production state need the owner's
  explicit approval.
- **Delegate only when it pays off.** Each sub-agent starts with ~20k tokens of context: a one-line lookup is cheaper
  with `rg`. Delegate to keep large outputs (logs, audits, research) out of this context, to use a cheaper model, or
  for a domain specialist. Specialists cannot spawn agents; never let two agents edit the same files at once.
- **Skills** (`.claude/skills/`) load on demand; where they are not available (Claude Code *Projects* threads), read
  the `SKILL.md` and follow it. **Models**: the owner picks the session model/effort; agents carry their own in
  frontmatter. Never set `CLAUDE_CODE_SUBAGENT_MODEL(_FORCE)` or `CLAUDE_CODE_EFFORT_LEVEL` globally.
- **Tokens**: deterministic checks before reasoning (validators, `npm run data:coverage`, `rg`); read only the part of
  a file you need, never whole datasets or `dist/` HTML; summarize logs.

## Context map (path-scoped rules)

Each rule loads automatically when you touch matching files. **If you are about to change an area and its rule is not
in your context (Projects threads load only rules without `paths`), read it first.**
`data-integrity.md` datasets, `WorldConfig`, kits, adding a world · `maps.md` React Flow, coordinates, mapgen,
markers, narrative modes · `frontend.md` UI primitives, header, store/SSR, a11y, contrast · `graph.md` knowledge graph
and relations · `entity-art.md` placeholders and portraits · `i18n.md` locales, `Localizable`, overlays · `seo.md`
URLs, slugs, metadata, indexing · `social-safety.md` social engine production safety · `security.md` CI, CODEOWNERS,
guardrails · `testing.md` how to test and report.

## Commands

```bash
npm install              # first, in a fresh checkout
npm run dev              # Vite dev server → http://localhost:5173
npm run build            # validate:data → validate:i18n → tsc -b → test:seo → i18n:audit → vite → SSR → prerender → seo:check (ALL blocking)
npm run smoke            # build + browser smoke test (routes, hydration, language switch, 404, modals, header)
npm run validate:data    # integrity of every registered dataset (exit 1 on errors)
npm run validate:i18n    # UI keys aligned in all 6 locales + every dataset Localizable is { it, en }
npm run test:seo         # SEO invariants on sources (slugs, URL round-trip, metadata, hreflang, sitemap)
npm run seo:slugs        # freeze SEO slugs into src/data/<world>/slugs.ts (after adding entities)
npm run i18n:index       # regenerate src/data/translationIndex.ts (after adding entities or merging overlays)
npm run preview:static   # serve dist/ with Vercel semantics (real 404s) → :4173
npm run data:coverage    # per-world gap report; `-- <world> [--json]`
npm run claude:validate  # .claude/ config + hook tests (also in Site CI)
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

## Validation matrix (run what the change touches; all of it before a PR)

| Change | Minimum checks |
| --- | --- |
| UI component / page / store | `npx tsc -b` while iterating → `npm run build`; `npm run smoke` for visible/interaction changes |
| Map code or map data | as UI + the map in `npm run smoke`; re-run the `mapgen` generator if a landmark moved |
| Dataset content | `validate:data` → `validate:i18n` → `seo:slugs` + `i18n:index` if entities were added → `social:catalog` + `social:validate` if an `available` world changed → `build` |
| Translations / overlays | `i18n:status` → `i18n:index` → `validate:i18n` + `i18n:audit` → `build` |
| SEO layer | `test:seo` → `build` (prerender + `seo:check`) |
| Social engine | `social:validate` (+ dry runs, see `social-safety.md`) → `build` |
| Workflows / CI / package*.json | `security-devops` review + `test:ci-scope` + `build` |
| `.claude/` config | `claude:validate` |

Report exactly what ran and its result.

## Git & delivery

Work on a feature branch; never push to `main`, never force-push, never merge or approve PRs, never rewrite others'
history, never disable or skip CI. Commit coherent units; open a PR only when the owner asks. The daily social
automations push state commits to `main` and open their own PRs — never touch their branches or files.
