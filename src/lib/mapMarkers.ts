import type { MapMarkerConfig, TimelineEvent, WorldDataset } from '@/types';

/**
 * Marcatori mappa derivati dagli eventi (`WorldConfig.mapMarkers`).
 *
 * Un marcatore non è un dato a sé: è una vista sugli eventi già presenti. Un
 * luogo è "marcato" se ospita almeno un evento con il tag del marcatore (es.
 * `desiderio-del-drago`). Così basta taggare l'evento giusto e il luogo si
 * accende sulla mappa, senza duplicare informazioni nei luoghi.
 */

/** Luoghi di un evento: il principale più quelli secondari. */
function eventPlaces(e: TimelineEvent): string[] {
  return [...new Set([...(e.locationId ? [e.locationId] : []), ...(e.locationIds ?? [])])];
}

/** Eventi per marcatore e per luogo, memoizzati per dataset. */
const cache = new WeakMap<WorldDataset, Map<string, Map<string, TimelineEvent[]>>>();

function markerIndex(dataset: WorldDataset): Map<string, Map<string, TimelineEvent[]>> {
  const hit = cache.get(dataset);
  if (hit) return hit;
  const index = new Map<string, Map<string, TimelineEvent[]>>();
  for (const marker of dataset.world.config?.mapMarkers ?? []) {
    const byPlace = new Map<string, TimelineEvent[]>();
    for (const e of dataset.events) {
      if (!e.tags?.includes(marker.eventTag)) continue;
      for (const placeId of eventPlaces(e)) {
        byPlace.set(placeId, [...(byPlace.get(placeId) ?? []), e]);
      }
    }
    for (const list of byPlace.values()) list.sort((a, b) => a.order - b.order);
    index.set(marker.id, byPlace);
  }
  cache.set(dataset, index);
  return index;
}

/** Marcatori del mondo che hanno almeno un luogo nel dataset. */
export function presentMapMarkers(dataset: WorldDataset): MapMarkerConfig[] {
  const index = markerIndex(dataset);
  return (dataset.world.config?.mapMarkers ?? []).filter((m) => (index.get(m.id)?.size ?? 0) > 0);
}

/**
 * Id dei luoghi marcati da almeno uno dei marcatori attivi. Si accende anche il
 * pin che apre una sotto-mappa contenente un luogo marcato (es. Namecc sulla
 * mappa del cosmo, se il desiderio è stato espresso su Namecc), così dalla
 * mappa principale si vede dove entrare.
 */
export function markedPlaceIds(dataset: WorldDataset, markerIds: readonly string[]): Set<string> {
  const index = markerIndex(dataset);
  const out = new Set<string>();
  for (const id of markerIds) for (const placeId of index.get(id)?.keys() ?? []) out.add(placeId);
  if (out.size === 0) return out;
  const levelOf = new Map(dataset.locations.map((l) => [l.id, l.mapLevelId]));
  // Solo i pin che scendono in una sotto-mappa (non quelli "torna indietro").
  const parentOf = new Map(dataset.mapLevels.map((m) => [m.id, m.parentLevelId]));
  const triggers = dataset.locations.filter(
    (l) => l.subMapLevelId && parentOf.get(l.subMapLevelId) === l.mapLevelId,
  );
  let grew = true;
  while (grew) {
    grew = false;
    const markedLevels = new Set([...out].map((placeId) => levelOf.get(placeId)));
    for (const tr of triggers) {
      if (!out.has(tr.id) && markedLevels.has(tr.subMapLevelId)) {
        out.add(tr.id);
        grew = true;
      }
    }
  }
  return out;
}

/** Eventi di un marcatore avvenuti in un luogo (ordine cronologico). */
export function markerEventsAt(dataset: WorldDataset, markerId: string, placeId: string): TimelineEvent[] {
  return markerIndex(dataset).get(markerId)?.get(placeId) ?? [];
}
