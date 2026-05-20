import type {
  Location,
  MapFilters,
  TimelineEvent,
  WorldDataset,
} from '@/types';

/**
 * Funzioni pure di filtraggio.
 * Da usare con useMemo nei componenti per evitare ricalcoli inutili.
 */

export function filterLocations(
  locations: Location[],
  filters: MapFilters,
  dataset: WorldDataset,
): Location[] {
  return locations.filter((loc) => {
    if (
      filters.locationTypes.length > 0 &&
      !filters.locationTypes.includes(loc.type)
    ) {
      return false;
    }
    if (
      filters.nationIds.length > 0 &&
      (!loc.nationId || !filters.nationIds.includes(loc.nationId))
    ) {
      return false;
    }
    if (
      filters.arcIds.length > 0 &&
      !(loc.arcIds ?? []).some((id) => filters.arcIds.includes(id))
    ) {
      return false;
    }
    if (
      filters.characterIds.length > 0 &&
      !(loc.characterIds ?? []).some((id) => filters.characterIds.includes(id))
    ) {
      return false;
    }
    if (
      filters.factionIds.length > 0 &&
      !(loc.clanIds ?? []).some((id) => filters.factionIds.includes(id))
    ) {
      return false;
    }
    if (filters.importance.length > 0 && !filters.importance.includes(loc.importance)) {
      return false;
    }
    if (filters.canonOnly) {
      const events = (loc.eventIds ?? [])
        .map((id) => dataset.events.find((e) => e.id === id))
        .filter((e): e is TimelineEvent => !!e);
      const hasNonCanon = events.some((e) => e.canon !== 'canon');
      if (hasNonCanon && events.length > 0) {
        // Mantieni la location solo se *almeno* un evento è canon o se non ha eventi mappati.
        const hasCanon = events.some((e) => e.canon === 'canon');
        if (!hasCanon) return false;
      }
    }
    return true;
  });
}

export function filterEvents(
  events: TimelineEvent[],
  filters: MapFilters,
): TimelineEvent[] {
  return events.filter((ev) => {
    if (filters.arcIds.length > 0 && (!ev.arcId || !filters.arcIds.includes(ev.arcId))) {
      return false;
    }
    if (filters.periods.length > 0 && !filters.periods.includes(ev.period)) {
      return false;
    }
    if (
      filters.characterIds.length > 0 &&
      !(ev.characterIds ?? []).some((id) => filters.characterIds.includes(id))
    ) {
      return false;
    }
    if (
      filters.factionIds.length > 0 &&
      !(ev.factionIds ?? []).some((id) => filters.factionIds.includes(id))
    ) {
      return false;
    }
    if (filters.nationIds.length > 0) {
      // Mappa l'evento alla nazione attraverso la sua location.
      // Mantenuto soft: se l'evento non ha location, viene mantenuto.
      if (ev.locationId) {
        // Nessuna risoluzione qui per non far dipendere il filtro dal dataset.
        // Se serve, si gestisce a monte combinando filterEvents + dataset.
      }
    }
    if (filters.canonOnly && ev.canon !== 'canon') return false;
    return true;
  });
}
