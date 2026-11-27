# Baratie (One Piece) — 3D scene ledger

- scene id: `onepiece-baratie` · location id: `loc-op-baratie` · status: **available** (public since 2026-11-27) ·
  rights: **owner-approved — not verified**
- files: `src/features/explorer3d/worlds/onepiece/baratie/{config,scene}.ts`

## Milestones
| # | Milestone | State | Notes |
|---|---|---|---|
| 1 | sources + scope | done | dataset links checked; fandom wiki unreachable (HTTP 402), textual secondary sources used |
| 2 | exterior + observation | done | 4 visual iterations (head winding, loft caps, ocean strokes) |
| 3 | interiors + exploration | done | ground floor (hall, corridor, kitchen, stairs) + upper floor, zone-loaded; plinth bug found by raycast |
| 4 | hotspots + integration | done | 7 hotspots, all on ids linked to `loc-op-baratie` |
| 5 | optimization + budgets | done | see measurements; real-device FPS still to measure |
| 6 | publication | done | owner request 2026-11-27: manifest `available`, loader ungated, `rights: 'owner-approved'` |
| 7 | fidelity upgrade | done | reference-driven rebuild, 6 iterations (below) |

## Publication (2026-11-27)
The owner asked to make the scene public on animapverse.com. Recorded as `rights: 'owner-approved'` with
`provenance.publication` in `config.ts`: a publication decision, **not** a rights clearance. Open questions:
- no licence or permission from the rights holders of One Piece has been requested or verified;
- no legal review of whether a recognizable 3D reconstruction of the setting fits the site's fan-reference use;
- the primary wiki description could not be read (HTTP 402): proportions rely on secondary textual sources;
- the location name appears on the sign (generic font, dataset text, not the official logo).
Moving to `rights: 'cleared'` requires these to be resolved by the owner. Rollback: set the manifest back to
`prototype`, re-gate the loader and `rights: 'pending-owner-review'` (one commit; the build drops the scene again).

## References (looked at only — never committed, embedded or traced)
| Source | Kind | Shows | Used for | Confidence |
|---|---|---|---|---|
| Dataset (`loc-op-baratie`, `arc-op-baratie` ch. 43-68, linked events/characters) | text | what happened where | hotspot links | high |
| Search summaries of fan wikis (sportskeeda, op-piratenation, fandom snippets) | text | oval ship, round bottom, four levels: dining (lower), kitchen (middle), cooks' quarters (upper), fins; cannons in the mouth and along the sides; Baratie No. 2 keeps "orange and light green" colouring and yellow/white striped sails | level order, palette, cannons, sails | medium (fan sources agree) |
| Ch. 53 "Mackerel Head" summaries | text | detachable fish-head prow (Sabagashira No. 1) | head as a separate part with a collar | high |
| [Dalong.net review of Bandai Grand Ship Collection #10 Baratie](https://www.dalong.net/reviews/etc/oc10/oc10_p_e.htm), photos 03, 05, 08, 11, 12, 16 | official model kit (stylized) | white ball head with orange duck lips + cannons, gold rim; round orange planked hull; mint tiers with blue arched windows, yellow frames, dark-red lattice bands with white crosses; octagonal middle tier with the name band + life rings; hip-roofed top house (orange, white top); two mint masts, dark ratlines, yellow/white striped sails; tall orange stern plate with yellow rim; wooden sea-deck fins | silhouette, masses, palette, details | medium-high for shapes/colours, LOW for proportions (the kit is compressed) |

Blocked or unreadable sources: onepiece.fandom.com pages (HTTP 402 / Cloudflare challenge to the fetcher); the
MediaWiki API route to the same content was refused by the session's permission policy as a bypass and was not
pursued; sportskeeda and one-piecewiki pages (HTTP 403). No anime screenshots were available: the original-anime
look is inferred from the model kit + text, so an owner-provided set of anime frames is the best next input.

## Visual iterations (2026-11-27, captures in the session scratchpad, SwiftShader)
| # | Main differences vs references | Changes | Result |
|---|---|---|---|
| 0 | baseline (text-only build): teal fish head, red roofs, cream walls, low freeboard, forked tail, teal fins, one mast | — | baseline captures (15 views) |
| 1 | palette and masses wrong; tiers missing | full rebuild: orange bowl hull, white head + lips, three mint tiers with lattice bands and arched windows, hip roof, two masts with striped sails, wooden fins, stern plate | structure matches the kit |
| 2 | hull barely visible (freeboard 3 m, fins too wide); head an elongated "sausage" | deck raised to 5 m, round ball head, smaller fins | orange hull dominant, head reads as in the kit |
| 3 | planks invisible (sparse vertex colours); lips too small | ink seam lines following the hull curvature, bigger duck lips | drawn plank look; head close to the kit |
| 4 | holes beside arched window heads; washed-out sign; harsh shade; shadow acne indoors | arch masonry closed + half-disc glass; sRGB canvas textures; softer toon ramp; shadow bias | clean arches, crisp sign, softer anime shading |
| 5 | arched doors blocked by full disc/ring; sails small vs kit | fanlight above a clear doorway, half-ring frames; larger sails, wider stripes | doors walkable and readable; sail mass as in the kit |
| 6 | interiors: more atmosphere (agent pass) | see below | see below |

## Measurements (2026-11-27, flag-on build, SwiftShader, state-fingerprint `5bd14b165f9914e82912`)
| Metric | low | high | method |
|---|---|---|---|
| Draw calls (exterior) | 14 | 20 | `test:3d` |
| Triangles (exterior) | 8,822 | 74,790 | `test:3d` |
| Triangles (interior, ground floor) | 21,728 | — | `benchmark:3d` |
| Scene chunk | 37.7 KB raw · 14.1 KB gzip · 12.5 KB brotli | | `benchmark:3d:bundle` |
| Build (generation) | ~35 ms | ~66 ms (dev) | session timings |

## Open issues / next step
- Owner: resolve the open rights questions above (or keep `owner-approved`), and measure FPS on real phones/GPUs
  (`/create-3d-location onepiece baratie optimize`).
- Possible improvements: deployable/folded fin variants, Krieg's galleon as an optional prop, more interior props.
