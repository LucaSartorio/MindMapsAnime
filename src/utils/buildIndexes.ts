import type {
  Character,
  Faction,
  Location,
  MapBoundary,
  Nation,
  Route,
  StoryArc,
  Team,
  TimelineEvent,
  WorldDataset,
} from '@/types';

/**
 * Costruisce indici Map<id, entity> per il dataset.
 *
 * Lookup O(1) molto utile in render frequenti, evita `.find()` ripetuti
 * sui grandi array (eventi, character routes, ecc.).
 *
 * Uso consigliato:
 * ```ts
 * const idx = useMemo(() => buildIndexes(dataset), [dataset]);
 * const character = idx.characters.get(id);
 * ```
 */
export interface DatasetIndexes {
  characters: Map<string, Character>;
  factions: Map<string, Faction>;
  teams: Map<string, Team>;
  arcs: Map<string, StoryArc>;
  events: Map<string, TimelineEvent>;
  locations: Map<string, Location>;
  routes: Map<string, Route>;
  nations: Map<string, Nation>;
  boundaries: Map<string, MapBoundary>;
}

function toMap<T extends { id: string }>(items: T[] | undefined): Map<string, T> {
  const m = new Map<string, T>();
  if (!items) return m;
  for (const it of items) m.set(it.id, it);
  return m;
}

export function buildIndexes(dataset: WorldDataset): DatasetIndexes {
  return {
    characters: toMap(dataset.characters),
    factions: toMap(dataset.factions),
    teams: toMap(dataset.teams),
    arcs: toMap(dataset.arcs),
    events: toMap(dataset.events),
    locations: toMap(dataset.locations),
    routes: toMap(dataset.routes),
    nations: toMap(dataset.nations),
    boundaries: toMap(dataset.boundaries),
  };
}
