import { narutoSlugs } from './slugs';
import type { StoryArc, TimelineEvent, WorldDataset } from '@/types';
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
import { narutoCharactersBatch8 } from './charactersBatch8';
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
import { narutoEventsBatch2 } from './eventsBatch2';
import { NARUTO_EVENT_CHRONOLOGY } from './eventsChronology';
import { narutoEventsBijuu } from './eventsBijuu';
import { narutoRoutes } from './routes';
import { narutoCharacterRoutes } from './characterRoutes';
import { narutoRoutesBatch2 } from './routesBatch2';
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
import { NARUTO_CHARACTER_LONG, NARUTO_JUTSU_LONG, NARUTO_LOCATION_LONG } from './contentEnrichment';
import { narutoTournaments } from './tournaments';

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
  ...narutoCharactersBatch8,
].map((c) => {
  const chakra = NARUTO_CHAKRA_OVERRIDES[c.id];
  const rel = NARUTO_RELATION_OVERRIDES[c.id];
  const next = { ...c };
  if (!next.longDescription && NARUTO_CHARACTER_LONG[c.id]) next.longDescription = NARUTO_CHARACTER_LONG[c.id];
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

/** Ordine cronologico: vedi `eventsChronology.ts` (posizione × 10). */
const chronoIndex = new Map(NARUTO_EVENT_CHRONOLOGY.map((id, i) => [id, (i + 1) * 10]));
const events: TimelineEvent[] = [...narutoEvents, ...narutoEventsBatch1, ...narutoEventsBatch2, ...narutoEventsBijuu]
  .map((e) => (chronoIndex.has(e.id) ? { ...e, order: chronoIndex.get(e.id)! } : e))
  .sort((a, b) => a.order - b.order);

/** Gli archi elencano anche tutti gli eventi che li dichiarano in `arcId`. */
const arcs: StoryArc[] = [...narutoArcs, ...narutoArcsBatch1, ...narutoArcsBatch2].map((arc) => ({
  ...arc,
  eventIds: [...new Set([...(arc.eventIds ?? []), ...events.filter((e) => e.arcId === arc.id).map((e) => e.id)])],
}));

/** Dataset completo del mondo Naruto. */
export const narutoDataset: WorldDataset = densifyCrossLinks({
  // Slug SEO pubblicati (congelati): vedi src/seo/slug.ts e `npm run seo:slugs`.
  seoSlugs: narutoSlugs,
  world: naruto,
  mapLevels: narutoMapLevels,
  nations: [...narutoNations, ...narutoNationsBatch1],
  boundaries: narutoBoundaries,
  locations: [...narutoLocations, ...narutoLocationsBatch1, ...narutoLocationsBatch2].map((l) =>
    !l.longDescription && NARUTO_LOCATION_LONG[l.id] ? { ...l, longDescription: NARUTO_LOCATION_LONG[l.id] } : l,
  ),
  characters,
  // Per la pagina "Clans & Factions" uniamo clan + organizzazioni/eserciti/gruppi.
  factions: [...narutoClans, ...narutoClansExtra, ...narutoFactions, ...narutoFactionsExtra],
  teams: [...narutoTeams, ...narutoTeamsBatch1],
  arcs,
  events,
  // Percorsi narrativi + percorsi specifici dei personaggi
  routes: [...narutoRoutes, ...narutoCharacterRoutes, ...narutoRoutesBatch2],
  jutsu: [...narutoJutsu, ...narutoJutsuBatch1, ...narutoJutsuBatch2, ...narutoJutsuBatch3, ...narutoJutsuBatch4].map((j) =>
    !j.longDescription && NARUTO_JUTSU_LONG[j.id] ? { ...j, longDescription: NARUTO_JUTSU_LONG[j.id] } : j,
  ),
  tournaments: narutoTournaments,
  assets: narutoAssets,
});

export { NARUTO_MAP_VIEWBOX, NARUTO_WORLD_MAP_SRC } from './mapConstants';
export {
  narutoDataQuality,
  narutoDataQualitySummary,
  narutoTranslationTodos,
} from './dataQuality';
