---
name: review-pr
description: Independent, focused code review of an AniMapVerse pull request or branch against the project invariants (dataset-driven, i18n, SEO, SSR, maps, social safety, security). Invoke explicitly with a PR number or branch.
argument-hint: <pr-number | branch> [focus]
disable-model-invocation: true
context: fork
agent: code-architect
---

# Review: $ARGUMENTS

You are reviewing from a fresh context. Read-only: do not edit, push, comment on GitHub or approve.

1. Get the diff (read-only: never checkout, never create branches; the Bash policy enforces it).
   - **GitHub MCP read tools, if they are in your tool list** (Cloud sessions with the GitHub integration;
     load them with ToolSearch `select:mcp__github__pull_request_read`): `pull_request_read` with `get`
     (state, base/head), `get_files`, then `get_diff`. They may be absent (headless runs, local setups without the
     GitHub MCP): then use git, which works everywhere the repo has an `origin` remote.
   - **git** (only updates `FETCH_HEAD`/remote-tracking refs, never the work tree or local branches):
     `git fetch origin main` and `git fetch origin pull/<n>/head` (a branch: `git fetch origin <branch>`), then
     `git rev-parse FETCH_HEAD` and `git merge-base origin/main FETCH_HEAD`.
     - Different hashes (open PR, squash-merged PR, branch): diff `git diff <merge-base> FETCH_HEAD`.
     - Same hash (PR merged with a merge commit): find it with
       `git log --merges --ancestry-path --format=%H FETCH_HEAD..origin/main | tail -1` = `M`, then
       `git diff $(git merge-base M^1 FETCH_HEAD) FETCH_HEAD`.
   - Start from `--stat`, then read per-file hunks (`git diff <base> FETCH_HEAD -- <file>`).
2. Read only the changed hunks plus the context needed; read the `.claude/rules/*.md` of the touched areas.
3. Check, in this order: correctness bugs (logic, edge cases, null/empty data, other worlds) · hydration/SSR
   parity · hardcoded world logic or strings (missing i18n keys in the six locales) · SEO (URLs via path helpers,
   slug changes, index/noindex, metadata only via buildPageMeta) · data integrity (ids, refs, `{ it, en }`,
   canon flags, generated files hand-edited) · social contracts/state files · workflows/permissions/secrets ·
   tests/validation missing for the risk · needless complexity or duplication.
4. Verify claims where cheap (`rg`, `npx tsc -b` is acceptable; no full builds unless needed to confirm a finding).

Report: verdict (approve-ready / changes needed / blocking), then findings ranked blocking → nit, each with
file:line, the concrete failure scenario, and a suggested fix. List what you did not check. Keep it under ~40 lines.
