import type { WorldDataset } from '@/types';
import { animeWorlds } from '@/data/worlds';
import { hxhMapLevels } from './mapLevels';
import { hxhNations } from './nations';
import { hxhBoundaries } from './boundaries';
import { hxhLocations } from './locations';
import { hxhCharacters } from './characters';
import { hxhCharactersBatch1 } from './charactersBatch1';
import { hxhCharactersBatch2 } from './charactersBatch2';
import { hxhCharactersBatch3 } from './charactersBatch3';
import { hxhCharactersBatch4 } from './charactersBatch4';
import { hxhFactions } from './factions';
import { hxhArcs } from './arcs';
import { hxhEvents } from './events';
import { hxhRoutes } from './routes';
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
  locations: hxhLocations,
  characters: [
    ...hxhCharacters,
    ...hxhCharactersBatch1,
    ...hxhCharactersBatch2,
    ...hxhCharactersBatch3,
    ...hxhCharactersBatch4,
  ],
  factions: hxhFactions,
  arcs: hxhArcs,
  events: hxhEvents,
  routes: hxhRoutes,
  jutsu: [...hxhNen, ...hxhNenBatch1, ...hxhNenBatch2],
  assets: hxhAssets,
};

export { HXH_MAP_VIEWBOX } from './mapLevels';
