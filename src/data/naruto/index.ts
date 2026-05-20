import type { WorldDataset } from '@/types';
import { animeWorlds } from '@/data/worlds';
import { narutoLocations } from './locations';
import { narutoCharacters } from './characters';
import { narutoClans } from './clans';
import { narutoFactions } from './factions';
import { narutoTeams } from './teams';
import { narutoArcs } from './arcs';
import { narutoEvents } from './events';
import { narutoRoutes } from './routes';
import { narutoCharacterRoutes } from './characterRoutes';
import { narutoAssets } from './assets';
import { narutoNations } from './nations';
import { narutoMapLevels } from './mapLevels';
import { narutoBoundaries } from './boundaries';

const naruto = animeWorlds.find((w) => w.slug === 'naruto')!;

/** Dataset completo del mondo Naruto. */
export const narutoDataset: WorldDataset = {
  world: naruto,
  mapLevels: narutoMapLevels,
  nations: narutoNations,
  boundaries: narutoBoundaries,
  locations: narutoLocations,
  characters: narutoCharacters,
  // Per la pagina "Clans & Factions" uniamo clan + organizzazioni/eserciti/gruppi.
  factions: [...narutoClans, ...narutoFactions],
  teams: narutoTeams,
  arcs: narutoArcs,
  events: narutoEvents,
  // Percorsi narrativi + percorsi specifici dei personaggi
  routes: [...narutoRoutes, ...narutoCharacterRoutes],
  assets: narutoAssets,
};

export { NARUTO_MAP_VIEWBOX, NARUTO_WORLD_MAP_SRC } from './mapConstants';
export { narutoDataQuality, narutoDataQualitySummary } from './dataQuality';
