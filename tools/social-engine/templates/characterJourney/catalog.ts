import { entitySlug } from '@/seo/slug';
import { isLocalizedText, type Localizable } from '@/types/i18n';
import { getEntityDisplayName } from '@/utils/localization';
import { VIDEO_LOCALES, type VideoLocale } from '../../config/types';
import { buildCharacterJourney } from '../../data/journey';
import { effectiveArcs, fingerprint, segmentJourney } from '../../data/segments';
import type { LoadedWorld } from '../../data/world';
import type { CatalogCandidate, CatalogExclusion, CatalogScan } from '../types';
import { recommendedDurationSeconds } from './timeline';

/** A stop label is "authored" in a locale when it has a real text for it (a plain string = Italian only, like the site's i18n rules). */
function labelIn(label: Localizable | undefined, locale: VideoLocale): boolean {
  if (label === undefined) return true; // falls back to the place name
  if (typeof label === 'string') return locale === 'it';
  return isLocalizedText(label) && typeof label[locale] === 'string' && label[locale]!.trim().length > 0;
}

/**
 * Every character of a world, classified for CharacterJourney with the SAME
 * journey builder + segmentation the renderer uses — "available" in the catalog
 * means renderable. A long journey yields one candidate per part, in order.
 */
export function scanCharacterJourney({ dataset }: LoadedWorld): CatalogScan {
  const candidates: CatalogCandidate[] = [];
  const excluded: CatalogExclusion[] = [];
  const arcById = new Map(dataset.arcs.map((a) => [a.id, a]));

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
    const segmentation = segmentJourney(journey.stops);
    const allArcs = effectiveArcs(journey.stops);
    const journeyArcs = new Set(allArcs.filter(Boolean)).size;
    for (const seg of segmentation.segments) {
      const stops = journey.stops.slice(seg.start, seg.end);
      const locales = VIDEO_LOCALES.filter((l) => stops.every((s) => labelIn(s.label, l)));
      if (!locales.length) {
        exclude('missing_translation', segmentation.mode === 'series' ? seg.key : undefined);
        continue;
      }
      const arcTitlesByLocale = Object.fromEntries(
        VIDEO_LOCALES.map((l) => [l, seg.arcIds.map((id) => getEntityDisplayName(arcById.get(id), l))]),
      ) as Record<VideoLocale, string[]>;
      candidates.push({
        subject: slug,
        subjectId: character.id,
        segment:
          segmentation.mode === 'series'
            ? {
                segment: seg.key,
                partNumber: seg.partNumber,
                partCount: seg.partCount,
                arcIds: seg.arcIds,
                arcTitles: arcTitlesByLocale.en,
                arcTitlesByLocale,
                firstArc: arcTitlesByLocale.en[0] ?? null,
                lastArc: arcTitlesByLocale.en[arcTitlesByLocale.en.length - 1] ?? null,
                segmentStopCount: stops.length,
                fullJourneyStopCount: journey.stops.length,
                segmentationVersion: segmentation.version,
                fingerprint: fingerprint([...stops.map((s) => s.anchorLocationId), ...seg.arcIds]),
              }
            : null,
        displayName: { en: name, it: getEntityDisplayName(character, 'it') },
        locales,
        recommendedDurationSeconds: recommendedDurationSeconds(stops.length),
        facts: {
          importance: character.importance ?? 'unknown',
          places: journey.stops.length,
          animatedStops: stops.length,
          arcs: new Set(allArcs.slice(seg.start, seg.end).filter(Boolean)).size,
          journeyArcs,
        },
      });
    }
  }
  return { candidates, excluded };
}
