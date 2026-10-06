import { entitySlug } from '@/seo/slug';
import type { Character, WorldDataset } from '@/types';
import { getEntityDisplayName } from '@/utils/localization';
import type { VideoLocale, WorldPoint } from '../config/types';
import { RenderDataError } from '../lib/errors';
import { resolveEntityId, suggestCharacters } from './entities';
import { buildCharacterJourney, type JourneyStop } from './journey';
import { getBaseMapLevel } from './projection';
import { effectiveArcs } from './segments';

/**
 * Shared character/map facts for the templates built on journeys
 * (GuessCharacter, CharacterVersus): the SAME journey builder as
 * CharacterJourney, so every number shown is the one the journey video shows.
 */
export function findCharacter(dataset: WorldDataset, query: string, template: string, worldSlug: string): Character {
  const id = resolveEntityId(dataset, 'characters', query);
  const character = dataset.characters.find((c) => c.id === id);
  if (!character) {
    const hints = suggestCharacters(dataset, query);
    throw new RenderDataError(template, `character "${query}" not found in "${worldSlug}".${hints.length ? `\n  Did you mean: ${hints.join(', ')}?` : ''}`);
  }
  return character;
}

export const characterSlug = (dataset: WorldDataset, character: Character) => entitySlug(dataset, 'characters', character.id) ?? null;

export type MapViewData = { name: string; width: number; height: number; backgroundSrc?: string; boundaries: string[] };

/** The world map as drawn by the videos (local image when the site ships one, else vector outlines). */
export function mapViewOf(dataset: WorldDataset, locale: VideoLocale): MapViewData | null {
  const level = getBaseMapLevel(dataset);
  if (!level || !(level.width > 0) || !(level.height > 0)) return null;
  const bgUrl = dataset.assets.find((a) => a.id === level.backgroundAssetId)?.url;
  const backgroundSrc = bgUrl && bgUrl.startsWith('/') ? bgUrl.replace(/^\/+/, '') : undefined;
  return {
    name: getEntityDisplayName(level, locale),
    width: level.width,
    height: level.height,
    ...(backgroundSrc ? { backgroundSrc } : {}),
    boundaries: backgroundSrc ? [] : (dataset.boundaries ?? []).filter((b) => b.mapLevelId === level.id && b.svgPathD).map((b) => b.svgPathD),
  };
}

/** One distinct world-map pin of a journey (first visit order), with the most important place seen there. */
export type DistinctPlace = { anchorLocationId: string; locationId: string; point: WorldPoint; score: number; arcId?: string };

export function distinctPlaces(stops: JourneyStop[]): DistinctPlace[] {
  const byAnchor = new Map<string, DistinctPlace>();
  for (const s of stops) {
    const prev = byAnchor.get(s.anchorLocationId);
    if (!prev) byAnchor.set(s.anchorLocationId, { anchorLocationId: s.anchorLocationId, locationId: s.locationId, point: s.point, score: s.score, arcId: s.arcId });
    else if (s.score > prev.score) byAnchor.set(s.anchorLocationId, { ...prev, locationId: s.locationId, score: s.score });
  }
  return [...byAnchor.values()];
}

/** Travel facts of a character: distinct places on the world map + story arcs (the versus metrics). */
export function journeyFacts(dataset: WorldDataset, character: Character) {
  const journey = buildCharacterJourney(dataset, character);
  const places = distinctPlaces(journey.stops);
  return { journey, places, placeCount: places.length, arcCount: new Set(effectiveArcs(journey.stops).filter(Boolean)).size };
}

/** "Konohagakure · Hidden Leaf Village" → "Konohagakure". */
export const shortPlaceName = (name: string) => name.split(' · ')[0].trim() || name;

export function initialsOf(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
}

/** Name tokens a place name must not contain in a guess video (it would give the answer away). */
export function nameTokens(character: Character): string[] {
  const names = [getEntityDisplayName(character, 'en'), getEntityDisplayName(character, 'it')].join(' ');
  return [...new Set(names.toLowerCase().normalize('NFD').replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter((t) => t.length >= 4))];
}

export function revealsName(text: string, tokens: string[]): boolean {
  const t = text.toLowerCase().normalize('NFD').replace(/[^\p{L}\p{N}\s]/gu, ' ');
  return tokens.some((token) => new RegExp(`(^|\\s)${token}(\\s|$)`).test(t));
}

export const IMPORTANCE_RANK: Record<string, number> = { main: 4, major: 3, supporting: 2, minor: 1, background: 0 };
