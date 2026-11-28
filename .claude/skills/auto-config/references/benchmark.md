# Auto-config benchmark

Two layers. The static one is free and deterministic; the live one spends tokens and runs only when the owner asks.

## 1. Static (every change): `npm run -s claude:bench -- --base <ref>`

Compares a base ref with the working tree: always-loaded context (CLAUDE.md + path-less rules + agent/skill listing
lines), per-component prompt sizes, privileges (writers, Bash, web, MCP tools, agents without allowlist, allow
rules), protections (deny/ask rules, hooks, read-only agents), duplicated instruction lines. Flags follow policy §7.
`≈tokens = chars/4` is an estimate for comparing versions, not a measurement.

## 2. Live (on request): tokens, turns, time, success

Method of `docs/CLAUDE_DEVELOPMENT_SYSTEM.md` §8 (fresh `claude -p` processes, same model, same `--allowedTools`,
≥ 3 runs per side, alternated; compare total input tokens incl. cache, not dollars). Swap the configuration in the
checkout, never in a copy (CLAUDE.md is not loaded outside the repository folder):

```bash
git checkout <base> -- CLAUDE.md .claude      # baseline configuration
claude -p --model sonnet --output-format json "<task>" > run-base-1.json
git checkout HEAD -- CLAUDE.md .claude        # new configuration
claude -p --model sonnet --output-format json "<task>" > run-head-1.json
node scripts/claude-usage-report.mjs --outcomes outcomes.json run-*.json
```

`outcomes.json` marks each run `pass` only after checking its result by hand. Cloud and local expose the same
`usage`/`modelUsage` fields; cache tokens depend on the cache state (alternate runs). Not measurable from the
transcript: output quality beyond the pass criterion, and the subscription cost (the report's cost is the list price).

## 3. Task suite (pass criteria fixed before running)

| # | Task (prompt) | Pass if |
|---|---|---|
| 1 | trivial turn: "OK" | measures configuration weight only (no pass criterion) |
| 2 | "Which file registers the world whose slug is 'bleach', and what is its status? path:line + status" | `src/data/worlds.ts`, the entry line, `available` |
| 3 | `/seo-opportunities bleach quick` (SEO audit) | findings cite real files/commands; nothing invented |
| 4 | replay a merged small UI fix on its base (bug fix) | matrix checks green, diff equivalent |
| 5 | `/audit-animapverse perf` (performance) | one build; chunk sizes = `vite build` output |
| 6 | `/analyze-data-coverage bleach` (data) | numbers = `npm run -s data:coverage -- bleach` |
| 7 | `/enrich-anime-world bleach verification` plan only (content update) | no fact without a source; batch plan only |
| 8 | `/security-review` on a branch that edits a workflow (security) | flags the change; edits nothing |
| 9 | `/code-review` on a merged PR (code review) | findings reproducible |
| 10 | `/auto-config create skill that summarises Search Console CSV exports` (new skill) | reuses `npm run seo:gsc` or extends `/seo-opportunities`; if a skill is created, `claude:validate` green and triggers file present |
| 11 | `/auto-config create agente specializzato nell'analisi delle regressioni SEO` (new agent) | reuse of `seo-growth-engineer` + `seo:baseline` considered first; no duplicate agent; validate green |
| 12 | `/auto-config audit` (multi-agent, read-only) | no file changed (`git status` identical), findings with evidence |

Trigger correctness for skills: `evals/triggers.json` (should / should-not prompts). The Anthropic `skill-creator`
(Apache-2.0; available as a built-in skill in claude.ai/Cloud sessions, or from github.com/anthropics/skills) has the
eval loop and the description optimizer (`claude -p` based, Python); use it instead of re-implementing them. It is
not vendored here: it would add Python scripts and an eval viewer that the repo does not need day to day.

## 4. Results so far

Recorded in `docs/claude-config/` (one file per measured change), with measured vs estimated values separated.
