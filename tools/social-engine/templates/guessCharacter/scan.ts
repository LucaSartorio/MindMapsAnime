import { getEntityDisplayName } from '@/utils/localization';
import { GUESS_MIN_PLACES } from '../../config/defaults';
import { VIDEO_LOCALES, type VideoLocale } from '../../config/types';
import { characterSlug, IMPORTANCE_RANK } from '../../data/characters';
import type { LoadedWorld } from '../../data/world';
import type { CatalogCandidate, CatalogExclusion, CatalogScan } from '../types';
import { guessClues } from './clues';
import { guessDurationSeconds } from './timeline';

/**
 * Guessable characters: main or major characters (a minor one is not
 * guessable for most fans) with ≥ GUESS_MIN_PLACES spoiler-free places.
 */
export function scanGuessCharacter({ dataset }: LoadedWorld): CatalogScan {
  const candidates: CatalogCandidate[] = [];
  const excluded: CatalogExclusion[] = [];
  for (const character of dataset.characters) {
    const name = getEntityDisplayName(character, 'en');
    const slug = characterSlug(dataset, character);
    const exclude = (reason: CatalogExclusion['reason'], detail?: string) => excluded.push({ subject: slug, subjectId: character.id, displayName: name, reason, ...(detail ? { detail } : {}) });
    if (!slug) {
      exclude('missing_slug');
      continue;
    }
    // Policy filter, not a data problem: minor characters are simply not offered (not listed as exclusions).
    if ((IMPORTANCE_RANK[character.importance ?? ''] ?? 0) < IMPORTANCE_RANK.major) continue;
    const clues = guessClues(dataset, character);
    if (clues.places.length < GUESS_MIN_PLACES) {
      exclude(clues.journeyPlaces === 0 ? 'no_journey_data' : 'not_guessable', `${clues.places.length} spoiler-free places`);
      continue;
    }
    candidates.push({
      subject: slug,
      subjectId: character.id,
      segment: null,
      displayName: Object.fromEntries(VIDEO_LOCALES.map((l) => [l, getEntityDisplayName(character, l)])) as Record<VideoLocale, string>,
      locales: [...VIDEO_LOCALES],
      recommendedDurationSeconds: guessDurationSeconds(clues.places.length),
      facts: { importance: character.importance ?? 'unknown', places: clues.journeyPlaces, clues: clues.places.length },
    });
  }
  return { candidates, excluded };
}
