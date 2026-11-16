---
paths:
  - ".github/**"
  - "package.json"
  - "package-lock.json"
  - "vercel.json"
  - ".gitattributes"
  - "scripts/ci-site-scope*.mjs"
  - ".claude/settings.json"
  - ".claude/hooks/**"
  - "docs/SECURITY_*.md"
---

# Security, CI & repository protection

Full guide: `docs/SECURITY_SEC-01.md`, `docs/SOCIAL_STATE_BOT.md`; current state + ruleset proposal:
`docs/SECURITY_SEC-02.md`.

- **Site CI** (`.github/workflows/site-ci.yml`, on every PR to `main`): `npm ci` + `npm run build`. A PR whose files
  are ALL under `tools/social-engine/` (or `social-*.yml` workflows) is "social-only" and skips the build
  (`scripts/ci-site-scope.mjs`, rules read from the BASE branch — protects against mistakes, not hostile PRs, which
  need review of `.github/` + `package*.json`; tests: `npm run test:ci-scope`); the final
  `Site CI` job always concludes, so it can be a required check without blocking the daily social PRs.
  Keep it read-only (`pull_request`, `contents: read`, no secrets) and never put build logic in the YAML.
- **Repository security (SEC-01, `docs/SECURITY_SEC-01.md`)**: `.github/CODEOWNERS` owns `.github/`, `package*.json`,
  `.npmrc`, `vercel.json`, `.gitattributes`, the CI classifier, `CLAUDE.md`, `.claude/`, `docs/SOCIAL_*.md`, `docs/SECURITY_*.md`
  and all of `tools/social-engine/` except the `*.json` the agents add to `content/queue/`, `publication/pending/`,
  `analytics/pending/`. The only check that may become required is `Site CI` (it always concludes; it guards against
  mistakes, not against a PR that rewrites its own workflow). The bot's state commits are direct pushes to `main`:
  never enable "Require a pull request" / required checks before they push through a dedicated GitHub App in the
  ruleset bypass list, never require approvals (they would block the agents' daily PRs) and never add an admin bypass
  while agents and Claude act as the owner.

## Guardrails for every agent

- Never print, log, copy or commit a secret; never read `.env*` files (only `.env.example` is safe).
- Workflows: keep `pull_request` (never `pull_request_target`), least-privilege `permissions:`, pinned action SHAs,
  `persist-credentials: false`; never add `|| true`, `continue-on-error` or skipped steps to make CI green.
- Never change rulesets, branch protection, environments, secrets or App permissions from a session: write a
  proposal (owner applies it) compatible with the State Bot (`docs/SOCIAL_STATE_BOT.md`).
- New dependencies need a reason (no lighter alternative in the repo), an exact or caret version consistent with the
  existing ones, and `npm ci` must stay reproducible; Remotion packages share one exact version.
- `.claude/settings.json` is least-privilege: no `bypassPermissions`, no blanket `Bash(*)`, no model override.
- Every agent has an explicit `tools:` allowlist (no MCP write tools, never `Agent`); read-only agents are listed in
  `READ_ONLY_AGENTS` (`.claude/hooks/bash-policy.mjs`). `npm run claude:validate` (also in Site CI) enforces both.
- Hooks (`bash-policy.mjs`) are guard-rails for Claude Code sessions only, never a substitute for the ruleset.
