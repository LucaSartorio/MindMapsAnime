---
name: social-engine-maintenance
description: Develop or fix the internal Remotion social engine (templates, growth engine code, pipeline, catalog, schemas, tests) without touching production state or the daily automations. Use for "ottimizza il Social Growth Engine", "fix the render pipeline", "add a video template", "social:validate fails".
argument-hint: <task description>
---

# Social engine task: $ARGUMENTS

Owner: `social-engine-specialist`. Read `.claude/rules/social-safety.md` and the contract(s) involved
(`docs/SOCIAL_ENGINE.md`, `docs/SOCIAL_AGENT_CONTRACT.md`, `docs/SOCIAL_PUBLISHING_CONTRACT.md`,
`docs/SOCIAL_ANALYTICS_CONTRACT.md`, `docs/SOCIAL_STATE_BOT.md`). Contracts win over this skill.

1. **Classify**: code-only (templates/pipeline/growth logic/tests) → STANDARD; anything touching workflows, state
   persistence, State Bot, receipts/analytics application, editorial rules or `growth/config.ts` → CRITICAL: get an
   explicit owner OK before editing, and a `security-devops` review for workflow changes.
2. **Baseline**: `npm run social:validate`; `npm run social:catalog` / `npm run social:next` are read-mostly but write
   `catalog/` — run them only when the task needs it, and never commit their regenerated state unless the task is
   about the catalog itself and the owner agreed.
3. **Implement** in code paths only. Forbidden by default: editing `history/`, `catalog/*.json`, `publication/applied|failed`,
   `analytics/metrics.json`, `content/rendered|failed`; real queue/render/apply runs; publishing APIs; AI/paid APIs;
   importing the engine or Remotion from `src/`.
4. **Verify**: `npm run social:validate` (+ `social:growth:test`, `social:publication:test` if relevant), a dry run
   (`npm run social:render:queue:dry` or `npm run social:agent -- --dry-run`), `npm run social:schema` when contracts
   changed (commit the regenerated schema), and `npm run build` to prove the public site is unaffected.
5. **Deliver** a PR-ready commit that touches only `tools/social-engine/**` (+ docs) when possible, so Site CI classifies it
   correctly; never push to the automations' branches or `main`.
