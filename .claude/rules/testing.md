---
paths:
  - "scripts/{smoke,test-seo,seo-check,a11y-audit,a11y-contrast,ci-site-scope.test,validate-claude-config}.{ts,mjs}"
  - "tools/social-engine/tests/**"
  - ".claude/hooks/*.test.mjs"
---

# Testing conventions

- No test framework: tests are plain `node:assert` scripts (`scripts/test-seo.ts`) or `node --test` files
  (`scripts/ci-site-scope.test.mjs`, `tools/social-engine/ci/*.test.mjs`). Add tests in the same style; do not add
  Jest/Vitest/ESLint for a single change.
- Prefer a deterministic check in an existing script (`validate-data`, `test-seo`, `seo-check`, `smoke`) over a new
  harness. A test must fail on the bug it guards (check it once against the unfixed code when practical).
- `npm run smoke` builds and drives Chromium (Playwright is pre-installed in cloud sessions, never reinstall it);
  `audit:a11y` / `audit:contrast` need `npm run preview:static` running (`BASE=http://localhost:4173`).
  `npm run preview` (Vite) answers 200 to ANY path: use `preview:static` for HTTP/404 tests.
- Report what ran and its result; a passing build is not proof a feature works — exercise the changed path
  (smoke scenario, a dry run, or a targeted script).
