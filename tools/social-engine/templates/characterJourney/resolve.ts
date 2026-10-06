import { SITE } from '@/seo/config';
import { entityPath } from '@/seo/paths';
import { entitySlug } from '@/seo/slug';
import { getEntityDisplayName, getLocalizedText } from '@/utils/localization';
import { VIDEO_COPY, fillTemplate } from '../../config/copy';
import { DEFAULT_HIGHLIGHTS, DEFAULT_LOCALE } from '../../config/defaults';
import type { CharacterJourneyConfig } from '../../config/types';
import { resolveEntityId, suggestCharacters } from '../../data/entities';
import { buildCharacterJourney, pickHighlights, sampleStops } from '../../data/journey';
import { SOFT_MAX_STOPS, effectiveArcs, fingerprint, segmentJourney } from '../../data/segments';
import { getBaseMapLevel } from '../../data/projection';
import { loadWorld } from '../../data/world';
import { RenderDataError } from '../../lib/errors';
import { maxStopsForDuration, recommendedDurationSeconds } from './timeline';
import type { CharacterJourneyData, JourneyStopView } from './types';

const TEMPLATE = 'CharacterJourney';

/** "Konohagakure · Hidden Leaf Village" → "Konohagakure" (compact labels on the map). */
const shortName = (name: string) => name.split(' · ')[0].trim() || name;

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * config → fully localized, serializable video data, read from the SAME
 * datasets/helpers as the site. Throws `RenderDataError` (clear message) when
 * the data can't make a real video: never an empty render.
 */
export async function resolveCharacterJourney(config: CharacterJourneyConfig): Promise<CharacterJourneyData> {
  const locale = config.locale ?? DEFAULT_LOCALE;
  const copy = VIDEO_COPY[locale];
  const { world, dataset } = await loadWorld(config.anime);
  const worldTitle = getLocalizedText(world.title, locale);

  // --- character -------------------------------------------------------------
  const characterId = resolveEntityId(dataset, 'characters', config.subject);
  const character = dataset.characters.find((c) => c.id === characterId);
  if (!character) {
    const hints = suggestCharacters(dataset, config.subject);
    throw new RenderDataError(
      TEMPLATE,
      `character "${config.subject}" not found in "${world.slug}".` +
        (hints.length ? `\n  Did you mean: ${hints.join(', ')}?` : '\n  Use an SEO slug (itachi-uchiha) or an id (char-itachi).'),
    );
  }
  const name = getEntityDisplayName(character, locale);

  // --- map -------------------------------------------------------------------
  const level = getBaseMapLevel(dataset);
  if (!level || !(level.width > 0) || !(level.height > 0)) {
    throw new RenderDataError(TEMPLATE, `map data missing for "${world.slug}" (no world map level with width/height).`);
  }
  const bgUrl = dataset.assets.find((a) => a.id === level.backgroundAssetId)?.url;
  // Only local assets already shipped by the site (never remote images).
  const backgroundSrc = bgUrl && bgUrl.startsWith('/') ? bgUrl.replace(/^\/+/, '') : undefined;

  // --- journey ---------------------------------------------------------------
  if (config.journey?.routeIds) {
    const missing = config.journey.routeIds.filter((id) => !dataset.routes.some((r) => r.id === id));
    if (missing.length) throw new RenderDataError(TEMPLATE, `unknown route id(s): ${missing.join(', ')}`);
  }
  const journey = buildCharacterJourney(dataset, character, config.journey);
  if (journey.stops.length === 0) {
    throw new RenderDataError(
      TEMPLATE,
      `journey data missing for character "${config.subject}" (no personal route and no located timeline events).`,
    );
  }
  if (journey.stops.length < 2) {
    const only = dataset.locations.find((l) => l.id === journey.stops[0].anchorLocationId);
    throw new RenderDataError(
      TEMPLATE,
      `journey data too short for character "${config.subject}": only one place on the map (${getEntityDisplayName(only, locale)}). At least 2 are needed.`,
    );
  }
  // --- segmentation: long journeys are a series of arc-based parts ---------------
  const segmentation = segmentJourney(journey.stops);
  const keys = segmentation.segments.map((seg) => seg.key);
  let segment = segmentation.segments[0];
  if (segmentation.mode === 'series') {
    if (!config.segment) {
      throw new RenderDataError(
        TEMPLATE,
        `the journey of "${config.subject}" is a series of ${keys.length} parts: set "segment" to one of ${keys.join(', ')} (see the catalog).`,
      );
    }
    const found = segmentation.segments.find((seg) => seg.key === config.segment);
    if (!found) {
      throw new RenderDataError(TEMPLATE, `segment "${config.segment}" does not exist for "${config.subject}" (parts: ${keys.join(', ')}).`);
    }
    segment = found;
  } else if (config.segment) {
    throw new RenderDataError(TEMPLATE, `the journey of "${config.subject}" is a single video: remove "segment" (got "${config.segment}").`);
  }
  // Only the stops (and therefore route, camera, recap) of THIS part.
  const partStops = journey.stops.slice(segment.start, segment.end);
  const partArcs = effectiveArcs(journey.stops).slice(segment.start, segment.end);
  const durationSeconds = config.durationSeconds ?? recommendedDurationSeconds(partStops.length);
  const maxStops = Math.min(config.journey?.maxStops ?? SOFT_MAX_STOPS, maxStopsForDuration(durationSeconds));
  const sampled = sampleStops(partStops, maxStops);

  const locById = new Map(dataset.locations.map((l) => [l.id, l]));
  const arcById = new Map(dataset.arcs.map((a) => [a.id, a]));
  const stops: JourneyStopView[] = sampled.map((s) => {
    const placeName = getEntityDisplayName(locById.get(s.locationId), locale);
    const regionName = s.anchorLocationId !== s.locationId ? shortName(getEntityDisplayName(locById.get(s.anchorLocationId), locale)) : undefined;
    const arc = s.arcId ? arcById.get(s.arcId) : undefined;
    return {
      locationId: s.locationId,
      anchorLocationId: s.anchorLocationId,
      point: s.point,
      title: getLocalizedText(s.label, locale) || placeName,
      placeName,
      shortName: shortName(placeName),
      ...(regionName ? { regionName } : {}),
      ...(arc ? { arcName: getEntityDisplayName(arc, locale) } : {}),
      source: s.source,
      score: s.score,
    };
  });

  // --- highlights ------------------------------------------------------------
  let highlights: number[];
  if (config.highlights?.length) {
    highlights = config.highlights.map((query) => {
      const id = resolveEntityId(dataset, 'locations', query);
      const index = stops.findIndex((s) => s.locationId === id || s.anchorLocationId === id);
      if (!id || index < 0) {
        throw new RenderDataError(TEMPLATE, `highlight "${query}" is not a stop of this journey (stops: ${stops.map((s) => s.locationId).join(', ')}).`);
      }
      return index;
    });
    highlights = [...new Set(highlights)].sort((a, b) => a - b);
  } else {
    highlights = pickHighlights(stops, Math.min(DEFAULT_HIGHLIGHTS, stops.length));
  }

  // --- copy & links ----------------------------------------------------------
  const factions = (character.factionIds ?? [])
    .map((id) => dataset.factions.find((f) => f.id === id))
    .filter((f): f is NonNullable<typeof f> => Boolean(f))
    .slice(0, 2)
    .map((f) => getEntityDisplayName(f, locale));
  const tagline = factions.length ? factions.join(' · ') : getLocalizedText(character.rank, locale);
  const site = SITE.origin.replace(/^https?:\/\//, '');
  const path = entityPath(locale, dataset, 'characters', character.id);
  const journeyArcs = new Set(effectiveArcs(journey.stops).filter(Boolean)).size;
  const arcIds = segment.arcIds;
  const arcNames = arcIds.map((id) => getEntityDisplayName(arcById.get(id), locale)).filter(Boolean);
  const partVars = { name, anime: worldTitle, n: String(segment.partNumber), total: String(segment.partCount) };
  const series =
    segmentation.mode === 'series'
      ? {
          key: segment.key,
          partNumber: segment.partNumber,
          partCount: segment.partCount,
          isLast: segment.partNumber === segment.partCount,
          arcIds,
          arcNames,
          arcRange: arcNames.length > 1 ? `${arcNames[0]} → ${arcNames[arcNames.length - 1]}` : (arcNames[0] ?? ''),
          segmentationVersion: segmentation.version,
          fingerprint: fingerprint([...partStops.map((st) => st.anchorLocationId), ...arcIds]),
          label: fillTemplate(copy.partLabel, partVars),
          ...(segment.partNumber < segment.partCount
            ? { nextLabel: fillTemplate(copy.nextPart, { n: String(segment.partNumber + 1), total: String(segment.partCount) }) }
            : {}),
        }
      : null;
  const defaultHook = !series
    ? copy.hook
    : series.partNumber === 1
      ? copy.hookPartFirst
      : series.isLast
        ? copy.hookPartLast
        : copy.hookPartMiddle;
  const defaultCta = series && !series.isLast ? copy.ctaContinue : copy.cta;

  return {
    locale,
    copy,
    world: { slug: world.slug, urlSlug: world.urlSlug ?? world.slug, title: worldTitle, ...(world.theme?.primary ? { accent: world.theme.primary } : {}) },
    character: {
      id: character.id,
      slug: entitySlug(dataset, 'characters', character.id) ?? character.id,
      name,
      initials: initials(name),
      ...(tagline ? { tagline } : {}),
    },
    map: {
      name: getEntityDisplayName(level, locale),
      width: level.width,
      height: level.height,
      ...(backgroundSrc ? { backgroundSrc } : {}),
      // The map image already draws its own borders (approximate boundary paths would
      // fight with it): outlines are only drawn for worlds without a map image.
      boundaries: backgroundSrc
        ? []
        : (dataset.boundaries ?? []).filter((b) => b.mapLevelId === level.id && b.svgPathD).map((b) => b.svgPathD),
    },
    stops,
    highlights,
    series,
    stats: {
      stops: partStops.length,
      arcs: new Set(partArcs.filter(Boolean)).size,
      journeyStops: journey.stops.length,
      journeyArcs,
    },
    hook: config.hook ?? fillTemplate(defaultHook, partVars),
    cta: config.cta ?? defaultCta,
    siteLabel: site,
    pageLabel: path ? `${site}${path}` : site,
    durationSeconds,
  };
}
