import { MAX_HIGHLIGHTS, MAX_STOPS, MIN_STOPS } from '../../config/defaults';
import { BASE_KEYS, Collector, int, isObj, parseBase, rejectUnknown, str, strArray, type Obj } from '../../config/schema';
import type { CharacterJourneyConfig, CharacterJourneyOptions } from '../../config/types';

export function parseCharacterJourneyConfig(o: Obj, c: Collector): CharacterJourneyConfig {
  rejectUnknown(o, [...BASE_KEYS, 'subject', 'journey', 'highlights'], c);
  let journey: CharacterJourneyOptions | undefined;
  if (o.journey !== undefined) {
    if (!isObj(o.journey)) c.push('journey', 'must be an object');
    else {
      const j = o.journey;
      rejectUnknown(j, ['routeIds', 'includeEvents', 'maxStops'], c, 'journey.');
      if (j.includeEvents !== undefined && typeof j.includeEvents !== 'boolean') {
        c.push('journey.includeEvents', 'must be a boolean');
      }
      const maxStops = int(j, 'maxStops', c, MIN_STOPS, MAX_STOPS, 'journey.maxStops');
      if (maxStops !== undefined && !Number.isInteger(maxStops)) c.push('journey.maxStops', 'must be an integer');
      journey = {
        routeIds: strArray(j, 'routeIds', c, 20, 'journey.routeIds'),
        includeEvents: typeof j.includeEvents === 'boolean' ? j.includeEvents : undefined,
        maxStops,
      };
    }
  }
  return {
    ...parseBase(o, c),
    template: 'characterJourney',
    subject: str(o, 'subject', c, { required: true }) ?? '',
    journey,
    highlights: strArray(o, 'highlights', c, MAX_HIGHLIGHTS),
  };
}
