import { SITE } from '@/seo/config';
import { getLocalizedText } from '@/utils/localization';
import { getEntityDisplayName } from '@/utils/localization';
import { fillTemplate } from '../../config/copy';
import { DEFAULT_LOCALE, VERSUS_MIN_PLACES } from '../../config/defaults';
import type { CharacterVersusConfig, VideoLocale } from '../../config/types';
import { characterSlug, findCharacter, mapViewOf } from '../../data/characters';
import { loadWorld } from '../../data/world';
import { RenderDataError } from '../../lib/errors';
import { COLORS } from '../../lib/theme';
import { VERSUS_COPY } from './copy';
import { sideRoute } from './sides';
import { VERSUS_DURATION_SECONDS } from './timeline';
import type { CharacterVersusData, VersusSide } from './types';

const TEMPLATE = 'CharacterVersus';

async function resolveSide(anime: string, subject: string, locale: VideoLocale): Promise<VersusSide & { id: string }> {
  const { world, dataset } = await loadWorld(anime);
  const character = findCharacter(dataset, subject, TEMPLATE, world.slug);
  const slug = characterSlug(dataset, character);
  if (!slug) throw new RenderDataError(TEMPLATE, `character "${subject}" has no public page (no SEO slug).`);
  const map = mapViewOf(dataset, locale);
  if (!map) throw new RenderDataError(TEMPLATE, `map data missing for "${world.slug}".`);
  const { facts, route } = sideRoute(dataset, character);
  if (facts.placeCount < VERSUS_MIN_PLACES) {
    throw new RenderDataError(TEMPLATE, `"${subject}" has only ${facts.placeCount} places on the ${world.slug} map (min ${VERSUS_MIN_PLACES} for a match-up).`);
  }
  return {
    id: character.id,
    anime: world.slug,
    worldTitle: getLocalizedText(world.title, locale),
    accent: world.theme?.primary ?? COLORS.red500,
    slug,
    name: getEntityDisplayName(character, locale),
    places: facts.placeCount,
    arcs: facts.arcCount,
    map,
    route,
  };
}

/** Two real journeys, one metric: distinct places on the world map (arcs break ties). Distances are not compared: maps have different scales. */
export async function resolveCharacterVersus(config: CharacterVersusConfig): Promise<CharacterVersusData> {
  const locale = config.locale ?? DEFAULT_LOCALE;
  const copy = VERSUS_COPY[locale];
  const { id: idA, ...a } = await resolveSide(config.anime, config.subject, locale);
  const { id: idB, ...b } = await resolveSide(config.opponent.anime, config.opponent.subject, locale);
  if (a.anime === b.anime && idA === idB) throw new RenderDataError(TEMPLATE, 'a character cannot compete against themself.');
  const decidedBy = a.places !== b.places ? 'places' : a.arcs !== b.arcs ? 'arcs' : 'tie';
  const winner = decidedBy === 'places' ? (a.places > b.places ? 'a' : 'b') : decidedBy === 'arcs' ? (a.arcs > b.arcs ? 'a' : 'b') : 'tie';
  const site = SITE.origin.replace(/^https?:\/\//, '');
  return {
    locale,
    copy,
    a,
    b,
    winner,
    decidedBy,
    hook: config.hook ?? fillTemplate(copy.hook, { a: a.name, b: b.name }),
    cta: config.cta ?? copy.cta,
    siteLabel: site,
    pageLabel: site,
    durationSeconds: config.durationSeconds ?? VERSUS_DURATION_SECONDS,
  };
}
