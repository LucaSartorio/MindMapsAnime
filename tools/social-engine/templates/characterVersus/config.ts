import { BASE_KEYS, Collector, isObj, rejectUnknown, parseBase, str, type Obj } from '../../config/schema';
import type { CharacterVersusConfig } from '../../config/types';

export function parseCharacterVersusConfig(o: Obj, c: Collector): CharacterVersusConfig {
  rejectUnknown(o, [...BASE_KEYS, 'subject', 'opponent'], c);
  let opponent = { anime: '', subject: '' };
  if (!isObj(o.opponent)) c.push('opponent', 'is required: { anime, subject } of the second character');
  else {
    rejectUnknown(o.opponent, ['anime', 'subject'], c, 'opponent.');
    opponent = { anime: str(o.opponent, 'anime', c, { required: true }) ?? '', subject: str(o.opponent, 'subject', c, { required: true }) ?? '' };
  }
  return { ...parseBase(o, c), template: 'characterVersus', subject: str(o, 'subject', c, { required: true }) ?? '', opponent };
}
