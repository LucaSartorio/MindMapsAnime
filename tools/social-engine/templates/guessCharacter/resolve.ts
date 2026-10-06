import { SITE } from '@/seo/config';
import { entityPath } from '@/seo/paths';
import { getEntityDisplayName, getLocalizedText } from '@/utils/localization';
import { fillTemplate } from '../../config/copy';
import { DEFAULT_LOCALE, GUESS_MIN_PLACES } from '../../config/defaults';
import type { GuessCharacterConfig } from '../../config/types';
import { characterSlug, findCharacter, mapViewOf } from '../../data/characters';
import { loadWorld } from '../../data/world';
import { RenderDataError } from '../../lib/errors';
import { COLORS } from '../../lib/theme';
import { clueName, guessClues } from './clues';
import { GUESS_COPY } from './copy';
import { guessDurationSeconds } from './timeline';
import type { GuessCharacterData } from './types';

const TEMPLATE = 'GuessCharacter';

export async function resolveGuessCharacter(config: GuessCharacterConfig): Promise<GuessCharacterData> {
  const locale = config.locale ?? DEFAULT_LOCALE;
  const copy = GUESS_COPY[locale];
  const { world, dataset } = await loadWorld(config.anime);
  const worldTitle = getLocalizedText(world.title, locale);
  const character = findCharacter(dataset, config.subject, TEMPLATE, world.slug);
  const slug = characterSlug(dataset, character);
  if (!slug) throw new RenderDataError(TEMPLATE, `character "${config.subject}" has no public page (no SEO slug).`);
  const map = mapViewOf(dataset, locale);
  if (!map) throw new RenderDataError(TEMPLATE, `map data missing for "${world.slug}".`);
  const clues = guessClues(dataset, character, config.places);
  if (clues.places.length < GUESS_MIN_PLACES) {
    throw new RenderDataError(
      TEMPLATE,
      `"${config.subject}" is not guessable: ${clues.places.length} usable places on the map (min ${GUESS_MIN_PLACES}; ${clues.removedForSpoilers} removed because their name gives the answer away).`,
    );
  }
  const places = clues.places.map((p) => {
    const name = clueName(dataset, p.locationId, locale);
    const region = p.anchorLocationId !== p.locationId ? clueName(dataset, p.anchorLocationId, locale) : undefined;
    return { point: p.point, name, ...(region && region !== name ? { region } : {}) };
  });
  const site = SITE.origin.replace(/^https?:\/\//, '');
  const path = entityPath(locale, dataset, 'characters', character.id);
  const name = getEntityDisplayName(character, locale);
  const factions = (character.factionIds ?? []).map((id) => dataset.factions.find((f) => f.id === id)).filter((f): f is NonNullable<typeof f> => Boolean(f)).slice(0, 1).map((f) => getEntityDisplayName(f, locale));
  return {
    locale,
    copy,
    world: { slug: world.slug, title: worldTitle, accent: world.theme?.primary ?? COLORS.red500 },
    answer: { slug, name, ...(factions[0] ? { tagline: factions[0] } : {}) },
    map,
    places,
    journeyPlaces: clues.journeyPlaces,
    hook: config.hook ?? fillTemplate(copy.hook, { anime: worldTitle, count: String(places.length) }),
    cta: config.cta ?? copy.cta,
    siteLabel: site,
    pageLabel: path ? `${site}${path}` : site,
    durationSeconds: config.durationSeconds ?? guessDurationSeconds(places.length),
  };
}
