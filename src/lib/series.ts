import type {
  Character,
  Faction,
  Jutsu,
  Location,
  Series,
  StoryArc,
  Team,
  TimelineEvent,
  WorldDataset,
} from '@/types';

/**
 * Mappa esplicita arc → serie per gli archi del mondo Naruto.
 * Centralizza l'unico "ground truth" del filtro Serie: tutto il resto
 * (personaggi, jutsu, location, eventi) viene dedotto da qui o dai tag.
 *
 * Convenzione:
 *  - Naruto Parte 1 (anime episodi 1-220)   → 'naruto'      arc-order 0-5
 *  - Naruto Shippuden  (Parte 2)            → 'shippuden'   arc-order 6-22
 *  - Boruto (Next Generations / TBV)        → 'boruto'      arc-order 23+
 *  - Film standalone                        → 'movies'      canonStatus 'movie'
 *
 * Per gli archi cuspide (es. arc-the-last è movie ma narrato nel periodo
 * Shippuden / Boruto-prequel) si elencano più serie.
 */
const ARC_SERIES_OVERRIDES: Record<string, Series[]> = {
  // The Last è un film ma cronologicamente è ponte tra Shippuden e Boruto.
  'arc-the-last': ['movies', 'shippuden', 'boruto'],
  // Naruto Hokage e Post-war preparano l'era Boruto.
  'arc-naruto-hokage': ['shippuden', 'boruto'],
  'arc-post-war': ['shippuden', 'boruto'],
};

/** Restituisce le serie di un singolo arco. */
export function arcSeries(arc: Pick<StoryArc, 'id' | 'order' | 'canonStatus' | 'canon'>): Series[] {
  if (ARC_SERIES_OVERRIDES[arc.id]) return ARC_SERIES_OVERRIDES[arc.id];
  const set: Series[] = [];
  if (arc.order <= 5) set.push('naruto');
  else if (arc.order <= 22) set.push('shippuden');
  else set.push('boruto');
  const status = arc.canonStatus ?? arc.canon;
  if (status === 'movie' && !set.includes('movies')) set.push('movies');
  return set;
}

/**
 * Cache per mappa `arcId → Series[]` di un dataset.
 * Costruita lazy nelle funzioni di filtraggio.
 */
function buildArcSeriesIndex(dataset: WorldDataset): Map<string, Series[]> {
  const index = new Map<string, Series[]>();
  for (const arc of dataset.arcs) {
    index.set(arc.id, arcSeries(arc));
  }
  return index;
}

/** Cache WeakMap così l'indice viene riusato senza ricalcolarlo. */
const arcIndexCache = new WeakMap<WorldDataset, Map<string, Series[]>>();
function arcIndexFor(dataset: WorldDataset): Map<string, Series[]> {
  let idx = arcIndexCache.get(dataset);
  if (!idx) {
    idx = buildArcSeriesIndex(dataset);
    arcIndexCache.set(dataset, idx);
  }
  return idx;
}

/**
 * Deduce le serie di un'entità con `arcIds` (Character, Location, Team, Faction).
 *  - se `series` è già impostato a mano, vince
 *  - altrimenti unione delle serie dei suoi `arcIds`
 *  - se `canonStatus === 'movie'` aggiunge 'movies'
 *  - se nulla è inferibile → tutte le serie (entità trasversale: non viene mai filtrata via)
 */
function deriveFromArcs(
  entity: {
    series?: Series[];
    arcIds?: string[];
    canonStatus?: import('@/types').CanonStatus;
    tags?: string[];
  },
  arcIndex: Map<string, Series[]>,
): Series[] {
  if (entity.series && entity.series.length > 0) return entity.series;
  const set = new Set<Series>();
  for (const arcId of entity.arcIds ?? []) {
    const s = arcIndex.get(arcId);
    if (s) s.forEach((x) => set.add(x));
  }
  // Tag manuali rapidi: i nuovi batch usano 'boruto-era'.
  if ((entity.tags ?? []).includes('boruto-era')) set.add('boruto');
  if (entity.canonStatus === 'movie') set.add('movies');
  // Fallback: trasversale → tutte le serie (non viene filtrato via).
  if (set.size === 0) return ['naruto', 'shippuden', 'boruto', 'movies'];
  return Array.from(set);
}

/** Serie di un personaggio. */
export function characterSeries(
  character: Character,
  dataset: WorldDataset,
): Series[] {
  return deriveFromArcs(character, arcIndexFor(dataset));
}

/** Serie di una location. */
export function locationSeries(
  location: Location,
  dataset: WorldDataset,
): Series[] {
  return deriveFromArcs(
    {
      series: location.series,
      arcIds: location.arcIds,
      canonStatus: location.canonStatus,
      tags: location.tags,
    },
    arcIndexFor(dataset),
  );
}

/** Serie di un evento. */
export function eventSeries(
  event: TimelineEvent,
  dataset: WorldDataset,
): Series[] {
  if (event.series && event.series.length > 0) return event.series;
  const arcIds = event.arcId ? [event.arcId] : [];
  return deriveFromArcs(
    {
      series: undefined,
      arcIds,
      canonStatus: event.canonStatus ?? event.canon,
      tags: event.tags,
    },
    arcIndexFor(dataset),
  );
}

/** Serie di un jutsu. Deduce dai personaggi che lo usano. */
export function jutsuSeries(jutsu: Jutsu, dataset: WorldDataset): Series[] {
  if (jutsu.series && jutsu.series.length > 0) return jutsu.series;
  const arcIndex = arcIndexFor(dataset);
  const set = new Set<Series>();
  for (const cid of jutsu.characterIds ?? []) {
    const ch = dataset.characters.find((c) => c.id === cid);
    if (!ch) continue;
    for (const s of deriveFromArcs(ch, arcIndex)) set.add(s);
  }
  if ((jutsu.tags ?? []).includes('boruto-era')) set.add('boruto');
  if (jutsu.canonStatus === 'movie') set.add('movies');
  if (set.size === 0) return ['naruto', 'shippuden', 'boruto', 'movies'];
  return Array.from(set);
}

/** Serie di una fazione/clan. */
export function factionSeries(
  faction: Faction,
  dataset: WorldDataset,
): Series[] {
  return deriveFromArcs(faction, arcIndexFor(dataset));
}

/** Serie di un team. */
export function teamSeries(team: Team, dataset: WorldDataset): Series[] {
  return deriveFromArcs(
    {
      series: team.series,
      arcIds: team.arcIds,
      canonStatus: team.canonStatus,
      tags: team.tags,
    },
    arcIndexFor(dataset),
  );
}

/**
 * `selected` è il filtro UI (vuoto = nessun filtro).
 * Restituisce true se `entitySeries` interseca `selected`.
 */
export function matchesSelectedSeries(
  entitySeries: Series[],
  selected: Series[],
): boolean {
  if (selected.length === 0) return true;
  return entitySeries.some((s) => selected.includes(s));
}
