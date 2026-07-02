import type { WorldDataset } from '@/types';

/**
 * Knowledge graph DERIVATO (non migrato) di un mondo.
 *
 * È una *proiezione* del `WorldDataset` esistente: nessun dato duplicato, i file
 * dati restano l'unica fonte di verità. Il grafo viene costruito una volta e
 * memoizzato per-dataset (WeakMap), come `buildIndexes`/`eventsByIdCache`.
 *
 * Obiettivo: un motore semantico UNICO per le relazioni contestuali, così la
 * logica oggi duplicata (focus mode nella mappa, grafo relazioni, schede) legge
 * tutta da qui. Il grafo NON si mostra mai globale: si interroga in modo
 * contestuale (`relatedPlaceIds`, `characterConnections`, `neighbors`).
 */
export type EntityType =
  | 'character'
  | 'place'
  | 'event'
  | 'arc'
  | 'faction'
  | 'route'
  | 'nation'
  | 'technique';

export type RelationType =
  | 'located_in'
  | 'appears_at'
  | 'happened_at'
  | 'in_arc'
  | 'present_at'
  | 'passes_through'
  | 'travels'
  | 'member_of'
  | 'uses'
  | 'involves'
  | 'family'
  | 'mentor'
  | 'student'
  | 'ally'
  | 'enemy'
  | 'related';

export interface EntityRef {
  type: EntityType;
  id: string;
}

export interface GraphEdge {
  /** Chiave `type:id` del nodo di partenza. */
  from: string;
  /** Chiave `type:id` del nodo di arrivo. */
  to: string;
  type: RelationType;
  /** Etichetta libera (es. label di `character.relationships`). */
  label?: string;
}

export interface WorldGraph {
  /** nodeKey → archi uscenti (gli archi sono memorizzati in entrambe le direzioni). */
  adjacency: Map<string, GraphEdge[]>;
}

/** Tipo di legame personaggio↔personaggio esposto alla UI Relazioni. */
export type RelKind = 'family' | 'mentor' | 'student' | 'ally' | 'enemy' | 'other';

export interface CharConnection {
  targetId: string;
  kind: RelKind;
  /** Etichetta specifica (da `relationships`) quando `kind === 'other'`. */
  label?: string;
}

export function entityKey(type: EntityType, id: string): string {
  return `${type}:${id}`;
}
export function parseKey(k: string): EntityRef {
  const i = k.indexOf(':');
  return { type: k.slice(0, i) as EntityType, id: k.slice(i + 1) };
}

/** Inverso semantico per le relazioni direzionali; le altre sono simmetriche. */
const INVERSE: Partial<Record<RelationType, RelationType>> = {
  mentor: 'student',
  student: 'mentor',
};

const cache = new WeakMap<WorldDataset, WorldGraph>();

export function buildWorldGraph(dataset: WorldDataset): WorldGraph {
  const cached = cache.get(dataset);
  if (cached) return cached;

  const adjacency = new Map<string, GraphEdge[]>();
  const seen = new Set<string>();

  const push = (from: string, edge: GraphEdge) => {
    const arr = adjacency.get(from);
    if (arr) arr.push(edge);
    else adjacency.set(from, [edge]);
  };

  const link = (
    aType: EntityType,
    aId: string | undefined | null,
    bType: EntityType,
    bId: string | undefined | null,
    type: RelationType,
    opts?: { directed?: boolean; label?: string },
  ) => {
    if (!aId || !bId) return;
    const from = entityKey(aType, aId);
    const to = entityKey(bType, bId);
    if (from === to) return;
    const k1 = `${from}|${to}|${type}`;
    if (!seen.has(k1)) {
      seen.add(k1);
      push(from, { from, to, type, label: opts?.label });
    }
    if (opts?.directed) return;
    const inv = INVERSE[type] ?? type;
    const k2 = `${to}|${from}|${inv}`;
    if (!seen.has(k2)) {
      seen.add(k2);
      push(to, { from: to, to: from, type: inv, label: opts?.label });
    }
  };

  for (const l of dataset.locations) {
    link('place', l.id, 'nation', l.nationId, 'located_in');
    for (const id of l.characterIds ?? []) link('place', l.id, 'character', id, 'appears_at');
    for (const id of l.arcIds ?? []) link('place', l.id, 'arc', id, 'in_arc');
    for (const id of l.clanIds ?? []) link('place', l.id, 'faction', id, 'present_at');
    for (const id of l.eventIds ?? []) link('place', l.id, 'event', id, 'happened_at');
  }

  for (const e of dataset.events) {
    link('event', e.id, 'place', e.locationId, 'happened_at');
    link('event', e.id, 'arc', e.arcId, 'in_arc');
    for (const id of e.characterIds ?? []) link('event', e.id, 'character', id, 'involves');
    for (const id of e.factionIds ?? []) link('event', e.id, 'faction', id, 'involves');
  }

  for (const c of dataset.characters) {
    link('character', c.id, 'place', c.villageLocationId, 'appears_at');
    for (const id of c.locationIds ?? []) link('character', c.id, 'place', id, 'appears_at');
    for (const id of c.clanIds ?? []) link('character', c.id, 'faction', id, 'member_of');
    for (const id of c.arcIds ?? []) link('character', c.id, 'arc', id, 'in_arc');
    for (const id of c.jutsuIds ?? []) link('character', c.id, 'technique', id, 'uses');
    for (const id of c.family ?? []) link('character', c.id, 'character', id, 'family');
    // target è il MIO maestro → reverse: io sono il suo allievo
    for (const id of c.teachers ?? []) link('character', c.id, 'character', id, 'mentor');
    for (const id of c.students ?? []) link('character', c.id, 'character', id, 'student');
    for (const id of c.allies ?? []) link('character', c.id, 'character', id, 'ally');
    for (const id of c.enemies ?? []) link('character', c.id, 'character', id, 'enemy');
    for (const r of c.relationships ?? [])
      link('character', c.id, 'character', r.targetCharacterId, 'related', {
        directed: true,
        label: r.label,
      });
  }

  for (const f of dataset.factions) {
    for (const id of f.characterIds ?? []) link('faction', f.id, 'character', id, 'member_of');
    for (const id of f.leaderIds ?? []) link('faction', f.id, 'character', id, 'member_of');
    for (const id of f.locationIds ?? []) link('faction', f.id, 'place', id, 'present_at');
    link('faction', f.id, 'place', f.villageLocationId, 'present_at');
    for (const id of f.arcIds ?? []) link('faction', f.id, 'arc', id, 'in_arc');
    for (const id of f.routeIds ?? []) link('faction', f.id, 'route', id, 'travels');
    for (const id of f.jutsuIds ?? []) link('faction', f.id, 'technique', id, 'uses');
    link('faction', f.id, 'nation', f.nationId, 'located_in');
  }

  for (const r of dataset.routes) {
    for (const s of r.steps) link('route', r.id, 'place', s.locationId, 'passes_through');
    link('route', r.id, 'arc', r.arcId, 'in_arc');
    for (const id of r.protagonistCharacterIds ?? []) link('route', r.id, 'character', id, 'travels');
    for (const id of r.primaryCharacterIds ?? []) link('route', r.id, 'character', id, 'travels');
    for (const id of r.relatedCharacterIds ?? []) link('route', r.id, 'character', id, 'travels');
  }

  for (const a of dataset.arcs) {
    for (const id of a.characterIds ?? []) link('arc', a.id, 'character', id, 'in_arc');
    for (const id of a.locationIds ?? []) link('arc', a.id, 'place', id, 'in_arc');
  }

  const graph: WorldGraph = { adjacency };
  cache.set(dataset, graph);
  return graph;
}

export function neighbors(graph: WorldGraph, key: string): GraphEdge[] {
  return graph.adjacency.get(key) ?? [];
}

/**
 * Luoghi "collegati" a un luogo, per il focus mode: stesso arco, stessi
 * personaggi, stessa rotta (2 hop verso altri place). Include il luogo stesso.
 * Sostituisce il calcolo inline duplicato in `InteractiveWorldMap`.
 */
export function relatedPlaceIds(graph: WorldGraph, placeId: string): Set<string> {
  const start = entityKey('place', placeId);
  const result = new Set<string>([placeId]);
  for (const e of neighbors(graph, start)) {
    const ref = parseKey(e.to);
    if (ref.type === 'place') {
      result.add(ref.id);
    } else if (ref.type === 'arc' || ref.type === 'character' || ref.type === 'route') {
      for (const e2 of neighbors(graph, e.to)) {
        const r2 = parseKey(e2.to);
        if (r2.type === 'place') result.add(r2.id);
      }
    }
  }
  return result;
}

const CHAR_PRIORITY: RelationType[] = [
  'family',
  'mentor',
  'student',
  'ally',
  'enemy',
  'related',
];
function toRelKind(type: RelationType): RelKind {
  return type === 'related' ? 'other' : (type as RelKind);
}

/**
 * Legami personaggio↔personaggio di un personaggio, deduplicati per target
 * (priorità famiglia > maestro > allievo > alleato > nemico > altro).
 * Sostituisce la costruzione inline in `RelationsGraphModal`.
 */
export function characterConnections(graph: WorldGraph, characterId: string): CharConnection[] {
  const start = entityKey('character', characterId);
  const byTarget = new Map<string, { type: RelationType; label?: string }>();
  for (const e of neighbors(graph, start)) {
    const ref = parseKey(e.to);
    if (ref.type !== 'character') continue;
    const existing = byTarget.get(ref.id);
    if (!existing || CHAR_PRIORITY.indexOf(e.type) < CHAR_PRIORITY.indexOf(existing.type)) {
      byTarget.set(ref.id, { type: e.type, label: e.label });
    }
  }
  return [...byTarget.entries()]
    .map(([targetId, v]) => ({ targetId, kind: toRelKind(v.type), label: v.label }))
    .sort(
      (a, b) =>
        CHAR_PRIORITY.indexOf(a.kind === 'other' ? 'related' : a.kind) -
        CHAR_PRIORITY.indexOf(b.kind === 'other' ? 'related' : b.kind),
    );
}

/* ---------------------------------------------------------------- *
 * API di query generiche (pure, testabili) — sezione 7 del brief.
 * Interrogano il grafo in modo contestuale (mai globale) e alimentano
 * focus mode, scheda dettaglio, ricerca e viste relazioni.
 * ---------------------------------------------------------------- */

export function getConnectedEntities(graph: WorldGraph, ref: EntityRef): EntityRef[] {
  const seen = new Set<string>();
  const out: EntityRef[] = [];
  for (const e of neighbors(graph, entityKey(ref.type, ref.id))) {
    if (seen.has(e.to)) continue;
    seen.add(e.to);
    out.push(parseKey(e.to));
  }
  return out;
}

export function getConnectedEntitiesByType(
  graph: WorldGraph,
  ref: EntityRef,
  type: EntityType,
): EntityRef[] {
  return getConnectedEntities(graph, ref).filter((r) => r.type === type);
}

/** Contesto-grafo di profondità 1 di un'entità, raggruppato per tipo. */
export interface EntityGraphContext {
  entity: EntityRef;
  places: EntityRef[];
  characters: EntityRef[];
  events: EntityRef[];
  arcs: EntityRef[];
  factions: EntityRef[];
  routes: EntityRef[];
  nations: EntityRef[];
  techniques: EntityRef[];
  /** Archi (relazioni) diretti, per etichette/tipi. */
  relations: GraphEdge[];
}

export function getGraphContextForEntity(
  graph: WorldGraph,
  ref: EntityRef,
): EntityGraphContext {
  const edges = neighbors(graph, entityKey(ref.type, ref.id));
  const buckets: Record<EntityType, EntityRef[]> = {
    character: [],
    place: [],
    event: [],
    arc: [],
    faction: [],
    route: [],
    nation: [],
    technique: [],
  };
  const seen: Partial<Record<EntityType, Set<string>>> = {};
  for (const e of edges) {
    const r = parseKey(e.to);
    const set = (seen[r.type] ??= new Set<string>());
    if (set.has(r.id)) continue;
    set.add(r.id);
    buckets[r.type].push(r);
  }
  return {
    entity: ref,
    places: buckets.place,
    characters: buckets.character,
    events: buckets.event,
    arcs: buckets.arc,
    factions: buckets.faction,
    routes: buckets.route,
    nations: buckets.nation,
    techniques: buckets.technique,
    relations: edges,
  };
}
