import type { WorldDataset } from '@/types';
import { animeWorlds } from '@/data/worlds';
import { hxhMapLevels } from './mapLevels';
import { hxhNations } from './nations';
import { hxhLocations } from './locations';
import { hxhCharacters } from './characters';
import { hxhCharactersBatch1 } from './charactersBatch1';
import { hxhFactions } from './factions';
import { hxhArcs } from './arcs';
import { hxhNen } from './nen';
import { hxhAssets } from './assets';

const hunterxhunter = animeWorlds.find((w) => w.slug === 'hunterxhunter')!;

/**
 * Dataset Hunter x Hunter (in costruzione).
 *
 * Stato attuale: personaggi principali/maggiori, fazioni, archi narrativi e
 * tecniche Nen firma. La mappa geografica è volutamente accantonata
 * (solo un world map placeholder); eventi e percorsi verranno aggiunti
 * nei prossimi batch.
 */
export const hunterxhunterDataset: WorldDataset = {
  world: hunterxhunter,
  mapLevels: hxhMapLevels,
  nations: hxhNations,
  locations: hxhLocations,
  characters: [...hxhCharacters, ...hxhCharactersBatch1],
  factions: hxhFactions,
  arcs: hxhArcs,
  events: [],
  routes: [],
  jutsu: hxhNen,
  assets: hxhAssets,
};

export { HXH_MAP_VIEWBOX } from './mapLevels';
