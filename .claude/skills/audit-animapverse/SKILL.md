---
name: audit-animapverse
description: Audit AniMapVerse health (data, SEO, i18n, a11y, perf, security, social, config) with ranked verified findings, or run the full pre-release gate ("release"). Use for "verifica se ci sono bug", "audit", "is it ready to release?".
argument-hint: [all|data|seo|i18n|a11y|perf|security|social|config|code|release]
---

# AniMapVerse audit: $ARGUMENTS

Default `all`. The audit reports; it changes nothing unless the owner then asks for fixes. Never weaken a check to
get green. Keep only summaries and failing lines of the logs.

## Release gate (`release`) — run in order, stop at the first blocking failure, answer GO / NO-GO
1. `git status` clean or explained; `git diff origin/main --stat` (flag `dist/`, `*.mp4`, state JSON, `.env*`, lockfile churn).
2. `npm ci` first if `package-lock.json` changed. Cheap gates: `npm run claude:validate` · `npm run test:ci-scope` · `npm run social:validate` if
   `tools/social-engine/` or data/shared `src/` used by the engine changed.
3. `npm run smoke`: it runs the full `npm run build` first (record
   duration, prerender per-language summary and chunk sizes from that output) and then the browser test. Never run a
   separate `npm run build` before it: it would build the same tree twice.
4. `npm run preview:static` (background, serves the `dist/` of step 3) → `BASE=http://localhost:4173 npm run audit:a11y`
   and `npm run audit:contrast`; stop the server.
5. Dependency or shared-UI changes: compare entry and map-route chunk sizes with `origin/main`.

## Area audit (any other argument)
| Area | Deterministic baseline |
|---|---|
| data | `npm run validate:data` (errors/warnings per world), `npm run data:coverage` |
| i18n | `npm run validate:i18n`, `npm run i18n:audit`, `npm run i18n:status` |
| seo | `npm run test:seo`; for `all`/`seo` `npm run build` (prerender + `seo:check`) |
| a11y | step 4 of the release gate (needs a `dist/`: reuse the build of this audit) |
| perf | chunk sizes from the `vite build` output, largest `dist/assets/*.js` |
| security | `npm run test:ci-scope`, `.github/workflows/*` review |
| config | `npm run claude:validate` (Claude Code agents, skills, rules, settings, hooks) |
| social | `npm run social:validate`, `npm run social:editorial:check` (read-only) |
| code | `rg -n "slug === '" src/components src/lib` (hardcoded worlds), duplicated helpers, unused exports |

With several areas (`all`), build once: its output serves seo, perf and the a11y server; never rebuild per area.
Then, only for areas where the baseline shows something suspicious, delegate read-only analysis in ONE message:
`security-devops` (workflows, deps, settings), `seo-growth-engineer` (SEO), `qa-performance-engineer` (perf, a11y,
regressions); use the built-in `Plan` agent for a design-level look at `code`. For an independent review of a
diff or PR use the built-in `/code-review <PR|branch>`.

Report: findings ranked critical → low (area · file:line or command · evidence · impact · fix · verified vs suspected),
checks run with results, what was not checked and why, suggested next skill. A clean build is not proof of no bugs.
