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

1. Get the diff: for a PR number prefer the GitHub MCP tools (`pull_request_read`: files + diff); otherwise
   `git fetch origin pull/<n>/head` (no local branch) and `git diff origin/main...FETCH_HEAD`. For a branch:
   `git fetch origin <branch>` then `git diff origin/main...FETCH_HEAD`. Start from `--stat`, then per-file hunks.
2. Read only the changed hunks plus the context needed; read the `.claude/rules/*.md` of the touched areas.
3. Check, in this order: correctness bugs (logic, edge cases, null/empty data, other worlds) · hydration/SSR
   parity · hardcoded world logic or strings (missing i18n keys in the six locales) · SEO (URLs via path helpers,
   slug changes, index/noindex, metadata only via buildPageMeta) · data integrity (ids, refs, `{ it, en }`,
   canon flags, generated files hand-edited) · social contracts/state files · workflows/permissions/secrets ·
   tests/validation missing for the risk · needless complexity or duplication.
4. Verify claims where cheap (`rg`, `npx tsc -b` is acceptable; no full builds unless needed to confirm a finding).

Report: verdict (approve-ready / changes needed / blocking), then findings ranked blocking → nit, each with
file:line, the concrete failure scenario, and a suggested fix. List what you did not check. Keep it under ~40 lines.
