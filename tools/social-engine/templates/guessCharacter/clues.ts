import type { Character, WorldDataset } from '@/types';
import { getEntityDisplayName } from '@/utils/localization';
import { GUESS_MAX_PLACES, GUESS_MIN_PLACES } from '../../config/defaults';
import type { VideoLocale } from '../../config/types';
import { distinctPlaces, nameTokens, revealsName, shortPlaceName, type DistinctPlace } from '../../data/characters';
import { buildCharacterJourney, sampleStops } from '../../data/journey';

/**
 * The clues of a guess video — shared by the catalog scan and the renderer, so
 * "available" means renderable. Distinct world-map places of the character's
 * journey (same builder as CharacterJourney), in journey order, WITHOUT any
 * place whose name (in either language) contains the character's name.
 */
export type GuessClues = { places: DistinctPlace[]; journeyPlaces: number; removedForSpoilers: number };

export function guessClues(dataset: WorldDataset, character: Character, count?: number): GuessClues {
  const journey = buildCharacterJourney(dataset, character);
  const all = distinctPlaces(journey.stops);
  const tokens = nameTokens(character);
  const locById = new Map(dataset.locations.map((l) => [l.id, l]));
  const safe = all.filter((p) =>
    (['en', 'it'] as VideoLocale[]).every(
      (l) => !revealsName(getEntityDisplayName(locById.get(p.locationId), l), tokens) && !revealsName(getEntityDisplayName(locById.get(p.anchorLocationId), l), tokens),
    ),
  );
  const n = Math.min(count ?? GUESS_MAX_PLACES, safe.length);
  return { places: n >= GUESS_MIN_PLACES ? sampleStops(safe, n) : safe, journeyPlaces: all.length, removedForSpoilers: all.length - safe.length };
}

export function clueName(dataset: WorldDataset, locationId: string, locale: VideoLocale): string {
  return shortPlaceName(getEntityDisplayName(dataset.locations.find((l) => l.id === locationId), locale));
}
