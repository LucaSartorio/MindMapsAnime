# 3D scene ledgers

One file per scene: `docs/explorer3d/<scene-id>.md` (`<scene-id>` = `SceneManifest.id`, e.g. `onepiece-baratie`).
It is the persistent state of `/create-3d-location`: milestones, sources, canon vs interpretive decisions, last
measurements (with the `node scripts/state-fingerprint.mjs` value they were taken at) and open issues, so a later
session resumes without redoing analysis. Update it in the same commit as each milestone. Never paste copyrighted
prose or images; cite and summarize.

## Template

```markdown
# <Location> (<World>) — 3D scene ledger

- scene id: `<world>-<location>` · location id: `<loc-id>` · status: prototype | available · rights: pending-owner-review | cleared
- files: `src/features/explorer3d/worlds/<world>/<location>/{config,scene}.ts`

## Milestones
| # | Milestone | State | Commit / notes |
|---|---|---|---|
| 1 | sources + scope | done/next | |
| 2 | exterior + observation | | |
| 3 | interiors + exploration | | |
| 4 | hotspots + integration | | |
| 5 | optimization + budgets | | |

## References (looked at only — never committed, embedded or traced)
| Source (URL or "owner") | Kind (anime / manga / official model / text) | Shows | Used for | Confidence |
|---|---|---|---|---|

Blocked or unreadable sources (and why):

## Visual iterations
| # | Captures (scratch dir) | Main differences vs references | Changes | Result |
|---|---|---|---|---|

## Canon vs interpretive
| Element | Status | Why |
|---|---|---|

## Measurements (fingerprint `<value>`)
| Metric | low | high | method |
|---|---|---|---|

## Open issues / next step
```
