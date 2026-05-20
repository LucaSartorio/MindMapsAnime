import type {
  Character,
  Faction,
  Location,
  Route,
  StoryArc,
  TimelineEvent,
  WorldDataset,
} from '@/types';

/**
 * Helper puri per recuperare entità per id da un dataset.
 * Restituiscono undefined quando l'id non esiste — niente eccezioni.
 */

export const findLocation = (
  dataset: WorldDataset,
  id?: string | null,
): Location | undefined => dataset.locations.find((l) => l.id === id);

export const findCharacter = (
  dataset: WorldDataset,
  id?: string | null,
): Character | undefined => dataset.characters.find((c) => c.id === id);

export const findFaction = (
  dataset: WorldDataset,
  id?: string | null,
): Faction | undefined => dataset.factions.find((f) => f.id === id);

export const findArc = (
  dataset: WorldDataset,
  id?: string | null,
): StoryArc | undefined => dataset.arcs.find((a) => a.id === id);

export const findEvent = (
  dataset: WorldDataset,
  id?: string | null,
): TimelineEvent | undefined => dataset.events.find((e) => e.id === id);

export const findRoute = (
  dataset: WorldDataset,
  id?: string | null,
): Route | undefined => dataset.routes.find((r) => r.id === id);

export const findNation = (dataset: WorldDataset, id?: string | null) =>
  dataset.nations.find((n) => n.id === id);
