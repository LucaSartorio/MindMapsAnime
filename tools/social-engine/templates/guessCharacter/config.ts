import { GUESS_MAX_PLACES, GUESS_MIN_PLACES } from '../../config/defaults';
import { BASE_KEYS, Collector, int, rejectUnknown, parseBase, str, type Obj } from '../../config/schema';
import type { GuessCharacterConfig } from '../../config/types';

export function parseGuessCharacterConfig(o: Obj, c: Collector): GuessCharacterConfig {
  rejectUnknown(o, [...BASE_KEYS, 'subject', 'places'], c);
  const places = int(o, 'places', c, GUESS_MIN_PLACES, GUESS_MAX_PLACES);
  if (places !== undefined && !Number.isInteger(places)) c.push('places', 'must be an integer');
  return { ...parseBase(o, c), template: 'guessCharacter', subject: str(o, 'subject', c, { required: true }) ?? '', places };
}
