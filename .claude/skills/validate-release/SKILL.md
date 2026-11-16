---
name: validate-release
description: Full pre-release validation of AniMapVerse (all blocking gates, smoke, a11y/contrast, social engine, CI scope tests, config) with a go/no-go report. Invoke explicitly before merging a significant PR or releasing.
argument-hint: [quick]
disable-model-invocation: true
---

# Validate release $ARGUMENTS

Run sequentially; stop at the first blocking failure, report it with the failing lines, and do not "fix" checks
by weakening them. `quick` = steps 1-3 only.

1. `git status` clean or explained; `git log origin/main..HEAD --oneline`; `git diff origin/main --stat`
   (flag accidental files: `dist/`, `*.mp4`, state JSON, `.env*`, lockfile churn).
2. `npm ci` if `package-lock.json` changed, then `npm run build` (validate:data → validate:i18n → tsc → test:seo →
   i18n:audit → vite build → SSR → prerender → seo:check). Record duration and the prerender per-language summary.
3. `npm run claude:validate` · `npm run test:ci-scope` · `npm run social:validate` (only if `tools/social-engine/`,
   `src/data/` or shared `src/` used by the engine changed).
4. `npm run smoke` (rebuilds; Chromium is pre-installed).
5. `npm run preview:static` in background → `BASE=http://localhost:4173 npm run audit:a11y` and `npm run audit:contrast`;
   stop the server afterwards.
6. Compare bundle: main entry + map route chunk sizes from the vite output vs `origin/main` if the change touches
   dependencies or shared UI (build main in a scratch worktree only when needed).

Report: GO / NO-GO, table of step → command → result → duration, warnings worth attention, what was skipped and why.
