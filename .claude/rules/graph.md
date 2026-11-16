---
paths:
  - "src/lib/graph/**"
  - "src/lib/{relationGroups,graphRefs,search,crossLinks,entities,useOpenEntityRef}.{ts,tsx}"
  - "src/components/common/RelationsPanel.tsx"
  - "src/components/modals/**"
  - "src/components/search/**"
---

# Knowledge graph & relations layer

Moved verbatim from `CLAUDE.md`.

### Knowledge graph (derived semantic layer)
`src/lib/graph/` builds a **derived** knowledge graph — a *projection* of the existing
`WorldDataset`, NOT a migration: no data duplication, the data files stay the single source of
truth. `buildWorldGraph(dataset)` walks the existing id-arrays (`location.characterIds/arcIds/…`,
`event.locationId/…`, `character.family/teachers/allies/relationships/…`, `route.steps`, `faction.*`,
`arc.*`) and emits typed, bidirectional edges into an adjacency map, **memoized per-dataset**
(WeakMap, like `buildIndexes`). Nodes are keyed `type:id` (`entityKey`/`parseKey`); relation types
are semantic (`appears_at`, `happened_at`, `in_arc`, `member_of`, `family|mentor|student|ally|enemy`,
`uses`, `passes_through`…). The graph is **queried contextually, never shown globally**.

**Derived group-nodes (world-agnostic)**: besides the entity nodes, the graph emits *group* nodes from
free per-world fields — `race` (from `character.race`, via `of_race`) and `saga` (from `arc.saga`, via
`in_saga`, keyed by `sagaKey()` so localized/variant spellings collapse to one node). They're emitted
**only where the field exists** (e.g. `race` only in Dragon Ball), so no world hardcodes anything. Group
nodes have no scheda of their own: consumers surface their *members* via `coMembers(graph, ref, via,
memberType)` (2-hop, e.g. "same race" characters, "same saga" arcs) — a generic helper, not per-field code.

It's the single engine for relation logic that was previously duplicated inline:
- `relatedPlaceIds(graph, placeId)` → focus mode's "related places" set (`InteractiveWorldMap`).
- `characterConnections(graph, characterId)` → the `RelationsGraphModal` connections (deduped by
  priority family > mentor > student > ally > enemy > other).
- `MapRelationsOverlay` draws **contextual** place→place connectors (≤12, dashed, `aria-hidden`) from
  the selected place to its related places — a layer node under the pins, only while a place is
  selected. Reinforces the focus dimming; bounded so it never becomes a global web.

**Generic query API** (pure, memoization-friendly; feeds schede + search): `getConnectedEntities(graph,
ref)` returns the depth-1 neighbour `EntityRef[]` of any entity (deduped); `getConnectedEntitiesByType`
filters that to one `EntityType`; `getGraphContextForEntity(graph, ref)` returns an `EntityGraphContext`
— the same depth-1 neighbours **bucketed by type** (`places/characters/events/arcs/factions/routes/
nations/techniques`) plus the raw `relations` edges. Everything takes/returns `EntityRef`s (`{type,id}`),
so consumers never touch dataset internals. The UI adapter `entityRefLabel(dataset, ref, locale)`
(`src/lib/graphRefs.ts`) resolves a ref to its localized display name via the existing `find*` helpers —
opening actions stay in the components (they own the store openers).

**Shared relations layer (every scheda)**: `buildRelationGroups(dataset, entity, t, locale, exclude?)`
(`src/lib/relationGroups.ts`) turns the graph context into localized, per-entity-type groups of clickable
refs — a `GROUPS_BY_TYPE` map decides which groups (and order) each entity kind shows; empty groups are
dropped, so race/saga (or any absent field) simply don't appear. `RelationsPanel`
(`src/components/common/RelationsPanel.tsx`) renders those groups as chip sections and is **presentational
only** — it takes an `onOpen(ref)` dispatched by `useOpenEntityRef()` (`src/lib/useOpenEntityRef.ts`), the
single type→store-opener switch reused everywhere. Consumers:
- `LocationDetailsModal` → the **"Relazioni" tab** (badge-counted, shown only when non-empty).
- `Character/Faction/StoryArc` schede (which still scroll) → a graph-fed **section** appended to the
  existing content, passing `exclude` for the groups the scheda already renders explicitly, so the panel
  only adds what's new (e.g. **same-race** on a Character, **same-saga** on an Arc, nation/routes on a
  Faction). Extend other modals the same way.

Adding a new relation = emit more edges in `buildWorldGraph` from the fields that already exist;
consumers (focus, relations overlay, the schede's relations layer, and search) read from the same graph
via these queries — no per-consumer traversal.

**Search over relations** (`src/lib/search.ts` `relatedResults` + `GlobalSearchDropdown`): when the top
⌘K hit is a strong match (name score ≥ 70), the dropdown appends that entity's graph neighbours as extra
navigable `SearchResult`s marked `relatedTo`, rendered under a "Correlate a …" header (`search.relatedTo`)
in the same listbox (keyboard nav unchanged). Turns search into a relation explorer, world-agnostic.
