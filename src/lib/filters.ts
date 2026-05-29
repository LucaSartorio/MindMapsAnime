import type {
  Character,
  Faction,
  Jutsu,
  Location,
  MapFilters,
  Team,
  TimelineEvent,
  WorldDataset,
} from '@/types';
import { getLocalizedText } from '@/utils/localization';
import {
  characterSeries,
  eventSeries,
  factionSeries,
  jutsuSeries,
  locationSeries,
  matchesSelectedSeries,
  teamSeries,
} from '@/lib/series';

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
    // Elementi "da verificare": nascosti di default, mostrabili dal filtro.
    if (!filters.showUnverified && loc.referenceStatus === 'needs_verification') {
      return false;
    }
    if (!matchesSelectedSeries(locationSeries(loc, dataset), filters.series)) {
      return false;
    }
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
  dataset?: WorldDataset,
): TimelineEvent[] {
  return events.filter((ev) => {
    if (filters.arcIds.length > 0 && (!ev.arcId || !filters.arcIds.includes(ev.arcId))) {
      return false;
    }
    if (dataset && !matchesSelectedSeries(eventSeries(ev, dataset), filters.series)) {
      return false;
    }
    if (filters.periods.length > 0) {
      // Match in either locale: il filtro contiene la stringa nella lingua attiva
      // al momento del click, ma confrontiamo entrambe per non perdere eventi.
      const periodIt = getLocalizedText(ev.period, 'it');
      const periodEn = getLocalizedText(ev.period, 'en');
      const match =
        filters.periods.includes(periodIt) ||
        filters.periods.includes(periodEn);
      if (!match) return false;
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

/**
 * Filtra i personaggi per il solo filtro Serie (`filters.series`).
 * Pensato per le pagine archivio / ricerca: gli altri filtri della mappa
 * non hanno semantica utile sui personaggi al di fuori della mappa.
 */
export function filterCharactersBySeries(
  characters: Character[],
  filters: MapFilters,
  dataset: WorldDataset,
): Character[] {
  if (filters.series.length === 0) return characters;
  return characters.filter((c) =>
    matchesSelectedSeries(characterSeries(c, dataset), filters.series),
  );
}

export function filterJutsuBySeries(
  jutsu: Jutsu[],
  filters: MapFilters,
  dataset: WorldDataset,
): Jutsu[] {
  if (filters.series.length === 0) return jutsu;
  return jutsu.filter((j) =>
    matchesSelectedSeries(jutsuSeries(j, dataset), filters.series),
  );
}

export function filterFactionsBySeries(
  factions: Faction[],
  filters: MapFilters,
  dataset: WorldDataset,
): Faction[] {
  if (filters.series.length === 0) return factions;
  return factions.filter((f) =>
    matchesSelectedSeries(factionSeries(f, dataset), filters.series),
  );
}

export function filterTeamsBySeries(
  teams: Team[],
  filters: MapFilters,
  dataset: WorldDataset,
): Team[] {
  if (filters.series.length === 0) return teams;
  return teams.filter((t) =>
    matchesSelectedSeries(teamSeries(t, dataset), filters.series),
  );
}
