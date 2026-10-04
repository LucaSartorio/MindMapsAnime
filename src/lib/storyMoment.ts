import type { Location, TimelineEvent, WorldDataset } from '@/types';

/**
 * "Momento della storia" (filtro anti-spoiler): fin dove è arrivato il lettore.
 * Ogni arco ha un rango (ordine cronologico); un luogo "esiste" dal primo arco
 * in cui compare (i suoi `arcIds` e gli archi degli eventi che ospita); un
 * evento dal suo arco. Senza informazioni d'arco l'elemento resta visibile:
 * la geografia di base non è uno spoiler.
 */
interface Index {
  rank: Map<string, number>;
  firstByLocation: Map<string, number>;
}

const cache = new WeakMap<WorldDataset, Index>();

function index(dataset: WorldDataset): Index {
  const hit = cache.get(dataset);
  if (hit) return hit;
  const rank = new Map([...dataset.arcs].sort((a, b) => a.order - b.order).map((a, i) => [a.id, i]));
  const firstByLocation = new Map<string, number>();
  const see = (locId: string | undefined, arcId: string | undefined) => {
    if (!locId || !arcId) return;
    const r = rank.get(arcId);
    if (r === undefined) return;
    firstByLocation.set(locId, Math.min(firstByLocation.get(locId) ?? Infinity, r));
  };
  for (const l of dataset.locations) for (const a of l.arcIds ?? []) see(l.id, a);
  for (const e of dataset.events) for (const l of [e.locationId, ...(e.locationIds ?? [])]) see(l, e.arcId);
  const idx = { rank, firstByLocation };
  cache.set(dataset, idx);
  return idx;
}

/** Archi in ordine cronologico (le tacche del cursore). */
export function storyArcs(dataset: WorldDataset) {
  return [...dataset.arcs].sort((a, b) => a.order - b.order);
}

export function locationAppearedBy(dataset: WorldDataset, loc: Location, untilArcId: string | null): boolean {
  if (!untilArcId) return true;
  const { rank, firstByLocation } = index(dataset);
  const limit = rank.get(untilArcId);
  const first = firstByLocation.get(loc.id);
  return limit === undefined || first === undefined || first <= limit;
}

export function eventHappenedBy(dataset: WorldDataset, ev: TimelineEvent, untilArcId: string | null): boolean {
  if (!untilArcId || !ev.arcId) return true;
  const { rank } = index(dataset);
  const limit = rank.get(untilArcId);
  const r = rank.get(ev.arcId);
  return limit === undefined || r === undefined || r <= limit;
}
