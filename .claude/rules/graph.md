---
paths:
  - "src/lib/graph/**"
  - "src/lib/{relationGroups,graphRefs,search,crossLinks,entities,useOpenEntityRef}.{ts,tsx}"
  - "src/components/common/RelationsPanel.tsx"
  - "src/components/modals/**"
  - "src/components/search/**"
---

# Knowledge graph & relations — constraints

How it works: `docs/ARCHITECTURE.md` › Knowledge graph.

- `src/lib/graph` is a **derived projection** of the `WorldDataset`, memoized per dataset (WeakMap): never copy data
  into it or store graph state; the data files stay the source of truth.
- Relation logic lives only in the graph queries (`relatedPlaceIds`, `characterConnections`, `getConnectedEntities`
  (`ByType`), `getGraphContextForEntity`, `coMembers`). Consumers (focus mode, `MapRelationsOverlay` ≤ 12 connectors,
  `RelationsPanel`, search `relatedResults`) never traverse dataset arrays themselves. A new relation = new edges in
  `buildWorldGraph` from existing fields.
- Group nodes (`race`, `saga` via `sagaKey`) exist only where the field exists and have no scheda: surface their
  members with `coMembers`.
- UI: `entityRefLabel` (`graphRefs.ts`) for labels, `buildRelationGroups` + `GROUPS_BY_TYPE` for groups (pass `exclude`
  for what a scheda already renders), `RelationsPanel` is presentational, opening goes through `useOpenEntityRef`.
