import { getEntityDisplayName } from '@/utils/localization';
import { VIDEO_LOCALES, type VideoLocale } from '../../config/types';
import type { LoadedWorld } from '../../data/world';
import type { CatalogCandidate, CatalogScan } from '../types';
import { versusPairs } from './sides';
import { VERSUS_DURATION_SECONDS } from './timeline';

/**
 * Match-ups listed in the catalog: cross-world pairs of each world's best
 * journeys (favouring rotation between anime). Same-world rivalries can still
 * be queued by hand. Each pair appears once, under the first world.
 */
export function scanCharacterVersus(world: LoadedWorld, context: { worlds: LoadedWorld[] }): CatalogScan {
  const candidates: CatalogCandidate[] = versusPairs(world, context.worlds).map(({ a, bWorld, b, subject }) => ({
    subject,
    subjectId: `${a.character.id}+${b.character.id}`,
    segment: null,
    displayName: Object.fromEntries(
      VIDEO_LOCALES.map((l) => [l, `${getEntityDisplayName(a.character, l)} vs ${getEntityDisplayName(b.character, l)}`]),
    ) as Record<VideoLocale, string>,
    locales: [...VIDEO_LOCALES],
    recommendedDurationSeconds: VERSUS_DURATION_SECONDS,
    facts: {
      importance: a.importance,
      opponentImportance: b.importance,
      opponentAnime: bWorld.world.slug,
      opponentSubject: b.slug,
      placesA: a.places,
      placesB: b.places,
    },
    request: { subject: a.slug, opponent: { anime: bWorld.world.slug, subject: b.slug } },
  }));
  return { candidates, excluded: [] };
}
