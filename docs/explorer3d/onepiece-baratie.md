# Baratie (One Piece) — 3D scene ledger

- scene id: `onepiece-baratie` · location id: `loc-op-baratie` · status: **prototype** · rights: **pending-owner-review**
- files: `src/features/explorer3d/worlds/onepiece/baratie/{config,scene}.ts`

## Milestones
| # | Milestone | State | Notes |
|---|---|---|---|
| 1 | sources + scope | done | dataset links checked; fandom wiki unreachable (HTTP 402), textual secondary sources used |
| 2 | exterior + observation | done | 4 visual iterations (head winding, loft caps, ocean strokes) |
| 3 | interiors + exploration | done | ground floor (hall, corridor, kitchen, stairs) + upper floor, zone-loaded; plinth bug found by raycast |
| 4 | hotspots + integration | done | 7 hotspots, all on ids linked to `loc-op-baratie` |
| 5 | optimization + budgets | done | see measurements; real-device FPS still to measure |

## Sources (textual)
- Dataset: `loc-op-baratie`, `arc-op-baratie` (ch. 43-68), `evt-op-baratie-krieg`, `evt-op-zoro-vs-mihawk`,
  `evt-op-baratie-sanji-intro`; characters linked by the location.
- Ch. 53 "Mackerel Head" summaries: the fish-head prow is the detachable Sabagashira No. 1.
- Krieg battle summaries: the chefs raise the restaurant's two side fins as a battle platform; a mast is broken in
  the fight.
- Ship descriptions (news and model-kit listings): restaurant ship with a fish-head front piece; cannons hidden in
  the mouth (model-kit description, treated as interpretive detail).

## Canon vs interpretive
| Element | Status | Why |
|---|---|---|
| Floating restaurant ship, fish-head prow, two side fins as battle deck, mast | canon | sources above |
| Dining hall, kitchen | canon | the arc happens there |
| Colours (blue-green striped "mackerel" head, timber/cream building, red roofs) | interpretive | chosen from the name Sabagashira and the general style |
| Tail fin at the stern, rooftop terrace, exterior and kitchen stairs, corridor, upper-floor lounge | interpretive | not documented in the sources used |
| Three cannon barrels in the mouth | interpretive | from a secondary description only |
| Hotspot placement inside the ship | interpretive | links are canon (dataset), positions are a choice |
| Sign | generic | shows the dataset name in a generic serif font, not the work's logo |

## Measurements (2026-11-27, flag-on build, SwiftShader, state-fingerprint `5bd14b165f9914e82912`)
| Metric | low | high | method |
|---|---|---|---|
| Draw calls (exterior) | 14 | 20 | `test:3d` |
| Triangles (exterior) | 8,822 | 74,790 | `test:3d` |
| Triangles (interior, ground floor) | 21,728 | — | `benchmark:3d` |
| Scene chunk | 37.7 KB raw · 14.1 KB gzip · 12.5 KB brotli | | `benchmark:3d:bundle` |
| Build (generation) | ~35 ms | ~66 ms (dev) | session timings |

## Open issues / next step
- Owner: decide on rights and publication (`available`), then run `/create-3d-location onepiece baratie optimize`
  on real phones/GPUs to measure FPS.
- Possible improvements: deployable/folded fin variants, Krieg's galleon as an optional prop, more interior props.
