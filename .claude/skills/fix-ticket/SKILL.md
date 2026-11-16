---
name: fix-ticket
description: Implement a scoped bug fix or small feature in AniMapVerse end to end - reproduce, locate, fix with the right specialist, verify with the validation matrix, commit. Use for concrete requests like "correggi il bug del filtro", "the language switch breaks on X", "aggiungi un pulsante che…", GitHub issue numbers or pasted error messages.
argument-hint: <description | issue number | error message>
---

# Fix ticket: $ARGUMENTS

1. **Understand**: if an issue number is given, read it (GitHub MCP `issue_read`); restate the expected vs actual
   behaviour in 1-3 lines. Ask only if two readings would lead to different code.
2. **Classify** (CLAUDE.md): TRIVIAL → fix directly. STANDARD → you or one specialist. COMPLEX/CRITICAL → plan first
   (`code-architect` only if the design is genuinely open).
3. **Locate cheaply**: `rg` for the visible string's i18n key, component, store flag or id; `lightweight-research`
   only when the search space is wide.
4. **Reproduce** before fixing when the bug is behavioural (smoke scenario, Playwright script in the scratchpad,
   a `tsx` one-off on the dataset). If you cannot reproduce, say so and explain the evidence for the fix.
5. **Fix** the root cause, minimal diff, existing primitives/helpers, no world-specific branches in shared code,
   new strings in all six locale files. Specialist routing: UI → `frontend-specialist`; map → `map-engineer`;
   data → `anime-data-curator`; SEO → `seo-growth-engineer`; social → `social-engine-specialist`; CI/deps →
   `security-devops` review.
6. **Verify** with the validation-matrix rows for the touched files (CLAUDE.md), and re-run the reproduction.
   Add a proportional regression check if an existing script can host it.
7. **Deliver**: commit `fix(<area>): <what>` on the working branch; report cause, fix, files, checks + results,
   risks. PR only if the owner asks.
