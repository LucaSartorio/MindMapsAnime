import { entitySlug } from '@/seo/slug';
import { isLocalizedText, type Localizable } from '@/types/i18n';
import { getEntityDisplayName } from '@/utils/localization';
import { DEFAULT_DURATION_SECONDS, DEFAULT_MAX_STOPS } from '../../config/defaults';
import { VIDEO_LOCALES, type VideoLocale } from '../../config/types';
import { buildCharacterJourney, sampleStops } from '../../data/journey';
import type { LoadedWorld } from '../../data/world';
import type { CatalogCandidate, CatalogExclusion, CatalogScan } from '../types';
import { maxStopsForDuration } from './timeline';

/** A stop label is "authored" in a locale when it has a real text for it (a plain string = Italian only, like the site's i18n rules). */
function labelIn(label: Localizable | undefined, locale: VideoLocale): boolean {
  if (label === undefined) return true; // falls back to the place name
  if (typeof label === 'string') return locale === 'it';
  return isLocalizedText(label) && typeof label[locale] === 'string' && label[locale]!.trim().length > 0;
}

/** Suggested length: ~2 s per animated stop on top of hook/intro/recap/CTA. */
export function recommendedDuration(animatedStops: number): number {
  return Math.min(30, Math.max(15, Math.round(11 + animatedStops * 2)));
}

/**
 * Every character of a world, classified for CharacterJourney with the same
 * builder the renderer uses — so "available" in the catalog means renderable.
 */
export function scanCharacterJourney({ dataset }: LoadedWorld): CatalogScan {
  const candidates: CatalogCandidate[] = [];
  const excluded: CatalogExclusion[] = [];
  const maxStops = Math.min(DEFAULT_MAX_STOPS, maxStopsForDuration(DEFAULT_DURATION_SECONDS));

  for (const character of dataset.characters) {
    const name = getEntityDisplayName(character, 'en');
    const slug = entitySlug(dataset, 'characters', character.id) ?? null;
    const exclude = (reason: CatalogExclusion['reason'], detail?: string) =>
      excluded.push({ subject: slug, subjectId: character.id, displayName: name, reason, ...(detail ? { detail } : {}) });
    if (!slug) {
      exclude('missing_slug');
      continue;
    }
    const journey = buildCharacterJourney(dataset, character);
    if (journey.stops.length === 0) {
      if (journey.unmappedCount > 0) exclude('missing_coordinates', `${journey.unmappedCount} place(s) not on the world map`);
      else exclude('no_journey_data');
      continue;
    }
    if (journey.stops.length < 2) {
      exclude('single_location', journey.unmappedCount ? `${journey.unmappedCount} other place(s) not on the world map` : undefined);
      continue;
    }
    const sampled = sampleStops(journey.stops, maxStops);
    const locales = VIDEO_LOCALES.filter((l) => sampled.every((s) => labelIn(s.label, l)));
    if (!locales.length) {
      exclude('missing_translation');
      continue;
    }
    candidates.push({
      subject: slug,
      subjectId: character.id,
      displayName: { en: name, it: getEntityDisplayName(character, 'it') },
      locales,
      recommendedDurationSeconds: recommendedDuration(sampled.length),
      facts: {
        importance: character.importance ?? 'unknown',
        places: journey.stops.length,
        animatedStops: sampled.length,
        arcs: new Set(journey.stops.map((s) => s.arcId).filter(Boolean)).size,
      },
    });
  }
  return { candidates, excluded };
}
