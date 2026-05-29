import type { WorldDataset } from '@/types';
import { animeWorlds } from '@/data/worlds';
import { narutoLocations } from './locations';
import { narutoCharacters } from './characters';
import { narutoCharactersExtra } from './charactersExtra';
import { narutoCharactersBatch1 } from './charactersBatch1';
import { narutoCharactersBatch2 } from './charactersBatch2';
import { narutoClans } from './clans';
import { narutoFactions } from './factions';
import { narutoClansExtra, narutoFactionsExtra } from './factionsExtra';
import { narutoTeams } from './teams';
import { narutoTeamsBatch1 } from './teamsBatch1';
import { narutoArcs } from './arcs';
import { narutoArcsBatch1 } from './arcsBatch1';
import { narutoEvents } from './events';
import { narutoEventsBatch1 } from './eventsBatch1';
import { narutoRoutes } from './routes';
import { narutoCharacterRoutes } from './characterRoutes';
import { narutoAssets } from './assets';
import { narutoNations } from './nations';
import { narutoMapLevels } from './mapLevels';
import { narutoBoundaries } from './boundaries';
import { narutoJutsu } from './jutsu';
import { narutoJutsuBatch1 } from './jutsuBatch1';

const naruto = animeWorlds.find((w) => w.slug === 'naruto')!;

/** Dataset completo del mondo Naruto. */
export const narutoDataset: WorldDataset = {
  world: naruto,
  mapLevels: narutoMapLevels,
  nations: narutoNations,
  boundaries: narutoBoundaries,
  locations: narutoLocations,
  characters: [
    ...narutoCharacters,
    ...narutoCharactersExtra,
    ...narutoCharactersBatch1,
    ...narutoCharactersBatch2,
  ],
  // Per la pagina "Clans & Factions" uniamo clan + organizzazioni/eserciti/gruppi.
  factions: [...narutoClans, ...narutoClansExtra, ...narutoFactions, ...narutoFactionsExtra],
  teams: [...narutoTeams, ...narutoTeamsBatch1],
  arcs: [...narutoArcs, ...narutoArcsBatch1],
  events: [...narutoEvents, ...narutoEventsBatch1],
  // Percorsi narrativi + percorsi specifici dei personaggi
  routes: [...narutoRoutes, ...narutoCharacterRoutes],
  jutsu: [...narutoJutsu, ...narutoJutsuBatch1],
  assets: narutoAssets,
};

export { NARUTO_MAP_VIEWBOX, NARUTO_WORLD_MAP_SRC } from './mapConstants';
export {
  narutoDataQuality,
  narutoDataQualitySummary,
  narutoTranslationTodos,
} from './dataQuality';
