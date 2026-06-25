import type { WorldDataset } from '@/types';
import { animeWorlds } from '@/data/worlds';
import { narutoLocations } from './locations';
import { narutoLocationsBatch1 } from './locationsBatch1';
import { narutoLocationsBatch2 } from './locationsBatch2';
import { narutoCharacters } from './characters';
import { narutoCharactersExtra } from './charactersExtra';
import { narutoCharactersBatch1 } from './charactersBatch1';
import { narutoCharactersBatch2 } from './charactersBatch2';
import { narutoCharactersBatch3 } from './charactersBatch3';
import { narutoCharactersBatch4 } from './charactersBatch4';
import { narutoCharactersBatch5 } from './charactersBatch5';
import { narutoCharactersBatch6 } from './charactersBatch6';
import { narutoCharactersBatch7 } from './charactersBatch7';
import { NARUTO_CHAKRA_OVERRIDES } from './charactersChakraOverrides';
import { NARUTO_RELATION_OVERRIDES } from './charactersRelationOverrides';
import { narutoClans } from './clans';
import { narutoFactions } from './factions';
import { narutoClansExtra, narutoFactionsExtra } from './factionsExtra';
import { narutoTeams } from './teams';
import { narutoTeamsBatch1 } from './teamsBatch1';
import { narutoArcs } from './arcs';
import { narutoArcsBatch1 } from './arcsBatch1';
import { narutoArcsBatch2 } from './arcsBatch2';
import { narutoEvents } from './events';
import { narutoEventsBatch1 } from './eventsBatch1';
import { narutoRoutes } from './routes';
import { narutoCharacterRoutes } from './characterRoutes';
import { narutoAssets } from './assets';
import { narutoNations } from './nations';
import { narutoNationsBatch1 } from './nationsBatch1';
import { narutoMapLevels } from './mapLevels';
import { narutoBoundaries } from './boundaries';
import { narutoJutsu } from './jutsu';
import { narutoJutsuBatch1 } from './jutsuBatch1';
import { narutoJutsuBatch2 } from './jutsuBatch2';
import { narutoJutsuBatch3 } from './jutsuBatch3';
import { narutoJutsuBatch4 } from './jutsuBatch4';
import { densifyCrossLinks } from '@/lib/crossLinks';

const naruto = animeWorlds.find((w) => w.slug === 'naruto')!;

const characters = [
  ...narutoCharacters,
  ...narutoCharactersExtra,
  ...narutoCharactersBatch1,
  ...narutoCharactersBatch2,
  ...narutoCharactersBatch3,
  ...narutoCharactersBatch4,
  ...narutoCharactersBatch5,
  ...narutoCharactersBatch6,
  ...narutoCharactersBatch7,
].map((c) => {
  const chakra = NARUTO_CHAKRA_OVERRIDES[c.id];
  const rel = NARUTO_RELATION_OVERRIDES[c.id];
  const next = { ...c };
  // Chakra override vince sull'esplicito; [] significa "esplicitamente
  // niente nature ninja" (Lee, Guy, Mifune).
  if (chakra !== undefined) next.chakraNatures = chakra;
  // Relation override fa l'UNION con i campi esistenti, non li sostituisce.
  if (rel) {
    if (rel.family) next.family = Array.from(new Set([...(c.family ?? []), ...rel.family]));
    if (rel.allies) next.allies = Array.from(new Set([...(c.allies ?? []), ...rel.allies]));
    if (rel.enemies) next.enemies = Array.from(new Set([...(c.enemies ?? []), ...rel.enemies]));
    if (rel.teachers) next.teachers = Array.from(new Set([...(c.teachers ?? []), ...rel.teachers]));
    if (rel.students) next.students = Array.from(new Set([...(c.students ?? []), ...rel.students]));
  }
  return next;
});

/** Dataset completo del mondo Naruto. */
export const narutoDataset: WorldDataset = densifyCrossLinks({
  world: naruto,
  mapLevels: narutoMapLevels,
  nations: [...narutoNations, ...narutoNationsBatch1],
  boundaries: narutoBoundaries,
  locations: [...narutoLocations, ...narutoLocationsBatch1, ...narutoLocationsBatch2],
  characters,
  // Per la pagina "Clans & Factions" uniamo clan + organizzazioni/eserciti/gruppi.
  factions: [...narutoClans, ...narutoClansExtra, ...narutoFactions, ...narutoFactionsExtra],
  teams: [...narutoTeams, ...narutoTeamsBatch1],
  arcs: [...narutoArcs, ...narutoArcsBatch1, ...narutoArcsBatch2],
  events: [...narutoEvents, ...narutoEventsBatch1],
  // Percorsi narrativi + percorsi specifici dei personaggi
  routes: [...narutoRoutes, ...narutoCharacterRoutes],
  jutsu: [...narutoJutsu, ...narutoJutsuBatch1, ...narutoJutsuBatch2, ...narutoJutsuBatch3, ...narutoJutsuBatch4],
  assets: narutoAssets,
});

export { NARUTO_MAP_VIEWBOX, NARUTO_WORLD_MAP_SRC } from './mapConstants';
export {
  narutoDataQuality,
  narutoDataQualitySummary,
  narutoTranslationTodos,
} from './dataQuality';
