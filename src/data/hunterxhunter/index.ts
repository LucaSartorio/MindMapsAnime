import type { WorldDataset } from '@/types';
import { animeWorlds } from '@/data/worlds';
import { hxhMapLevels } from './mapLevels';
import { hxhNations } from './nations';
import { hxhBoundaries } from './boundaries';
import { hxhLocations } from './locations';
import { hxhLocationsBatch1 } from './locationsBatch1';
import { hxhSubmapLocations } from './submapLocations';
import { hxhCharacters } from './characters';
import { hxhCharactersBatch1 } from './charactersBatch1';
import { hxhCharactersBatch2 } from './charactersBatch2';
import { hxhCharactersBatch3 } from './charactersBatch3';
import { hxhCharactersBatch4 } from './charactersBatch4';
import { hxhCharactersBatch5 } from './charactersBatch5';
import { hxhCharactersBatch6 } from './charactersBatch6';
import { hxhFactions } from './factions';
import { hxhFactionsBatch1 } from './factionsBatch1';
import { hxhArcs } from './arcs';
import { hxhEvents } from './events';
import { hxhEventsBatch1 } from './eventsBatch1';
import { hxhEventsBatch2 } from './eventsBatch2';
import { hxhEventsBatch3 } from './eventsBatch3';
import { hxhRoutes } from './routes';
import { hxhRoutesBatch1 } from './routesBatch1';
import { hxhRoutesBatch2 } from './routesBatch2';
import { hxhNen } from './nen';
import { hxhNenBatch1 } from './nenBatch1';
import { hxhNenBatch2 } from './nenBatch2';
import { hxhAssets } from './assets';

const hunterxhunter = animeWorlds.find((w) => w.slug === 'hunterxhunter')!;

/**
 * Dataset Hunter x Hunter (in costruzione).
 *
 * Stato attuale: personaggi principali/maggiori, fazioni, archi narrativi,
 * tecniche Nen firma e la world map estesa del Mondo Conosciuto (nazioni,
 * continenti, confini cliccabili e luoghi iconici) su mappa di riferimento
 * fan-made.
 */
export const hunterxhunterDataset: WorldDataset = {
  world: hunterxhunter,
  mapLevels: hxhMapLevels,
  nations: hxhNations,
  boundaries: hxhBoundaries,
  locations: [...hxhLocations, ...hxhLocationsBatch1, ...hxhSubmapLocations],
  characters: [
    ...hxhCharacters,
    ...hxhCharactersBatch1,
    ...hxhCharactersBatch2,
    ...hxhCharactersBatch3,
    ...hxhCharactersBatch4,
    ...hxhCharactersBatch5,
    ...hxhCharactersBatch6,
  ],
  factions: [...hxhFactions, ...hxhFactionsBatch1],
  arcs: hxhArcs,
  events: [...hxhEvents, ...hxhEventsBatch1, ...hxhEventsBatch2, ...hxhEventsBatch3],
  routes: [...hxhRoutes, ...hxhRoutesBatch1, ...hxhRoutesBatch2],
  jutsu: [...hxhNen, ...hxhNenBatch1, ...hxhNenBatch2],
  assets: hxhAssets,
};

export { HXH_MAP_VIEWBOX } from './mapLevels';
