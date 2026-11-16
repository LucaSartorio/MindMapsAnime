---
name: audit-animapverse
description: Technical audit of AniMapVerse - integrity, build health, SEO invariants, i18n, accessibility, performance, security of workflows/dependencies, social engine safety - with verified findings ranked by severity. Use for "verifica se ci sono bug", "audit del progetto", "check the project health".
argument-hint: [area: all|data|seo|i18n|a11y|perf|security|social|code]
---

# AniMapVerse audit: $ARGUMENTS

Default area = `all`. The audit **reports**; it changes nothing unless the owner asks for fixes afterwards.

## 1. Deterministic baseline (run, keep only summaries/failing lines)
| Area | Commands |
|---|---|
| data | `npm run validate:data` (errors/warnings count per world), `npm run data:coverage` |
| i18n | `npm run validate:i18n`, `npm run i18n:audit`, `npm run i18n:status` |
| code + seo | `npx tsc -b`, `npm run test:seo`; for `all`/`seo`: `npm run build` (prerender + seo:check, several minutes) |
| a11y | after a build: `npm run preview:static` in background, then `BASE=http://localhost:4173 npm run audit:a11y` and `audit:contrast` |
| perf | chunk sizes from the `vite build` output; largest `dist/assets/*.js` |
| security | `npm run test:ci-scope`, `node --test .claude/hooks/*.test.mjs`, review of `.github/workflows/*` |
| social | `npm run social:validate`, `npm run social:editorial:check` (read-only) |
| config | `npm run claude:validate` |

## 2. Targeted review (parallel, read-only, only for the requested areas)
Delegate in ONE message, each with the baseline output relevant to it: `security-devops` (workflows, deps,
settings), `seo-growth-engineer` (SEO findings), `qa-performance-engineer` (perf/a11y/regressions),
`code-architect` only for `code`/`all` (duplication, coupling, hardcoded world logic in shared code:
`rg -n "slug === '" src/components src/lib`). Skip agents whose area had nothing suspicious.

## 3. Report
Findings ranked critical → low, each: area · file:line or command · evidence · impact · suggested fix ·
verified (reproduced/measured) vs suspected. Then: checks run with results, what was NOT checked and why,
suggested next skills (`/fix-ticket`, `/optimize-performance`, `/enrich-anime-world`…). Never present a clean
build as proof of no bugs.
