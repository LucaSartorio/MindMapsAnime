import { dragonballSlugs } from './slugs';
import { dragonballMarkerTags } from './markerTags';
import { withEventTags } from '../shared/eventTagKit';
import { dragonballBattles } from './battles';
import { withBattles } from '../shared/battleKit';
import { dragonballFamily } from './family';
import { withFamily } from '../shared/familyKit';
import { dragonballStructure } from './structure';
import { withFactionExtras } from '../shared/factionKit';
import type { Character, Faction, StoryArc, TimelineEvent, WorldDataset } from '@/types';
import { animeWorlds } from '@/data/worlds';
import { dbzMapLevels } from './mapLevels';
import { dragonballNations } from './nations';
import { dragonballLocations } from './locations';
import { dragonballLocationsExtra } from './locationsExtra';
import { dragonballCharacters } from './characters';
import { dragonballCharactersBatch1 } from './charactersBatch1';
import { dragonballCharactersFriezaSaga } from './charactersFriezaSaga';
import { dragonballCharactersGT } from './charactersGT';
import { dragonballCharactersMovies } from './charactersMovies';
import { dragonballCharactersFiller } from './charactersFiller';
import { dragonballCharactersSuper } from './charactersSuper';
import { dragonballCharactersSupporting } from './charactersSupporting';
import { dragonballCharactersExtra } from './charactersExtra';
import { dragonballFactions } from './factions';
import { dragonballArcs } from './arcs';
import { dragonballEvents } from './events';
import { dragonballEventsExtra } from './eventsExtra';
import { dragonballRoutes } from './routes';
import { dragonballRoutesExtra } from './routesExtra';
import { dragonballJutsu } from './jutsu';
import { dragonballJutsuExtra } from './jutsuExtra';
import { dragonballAssets } from './assets';
import { TAGGED_WISH_EVENTS, WISH_TAG, dragonballWishes } from './wishes';
import { dragonballTournamentFighters, dragonballTournaments } from './tournaments';
import { withSourceNames } from '@/data/shared/translations';
import { dragonballNames } from './names';
import {
  dragonballEncyclopediaCharacters,
  dragonballEncyclopediaEvents,
  dragonballEncyclopediaJutsu,
  dragonballEncyclopediaLocations,
} from './encyclopedia';

const dragonball = animeWorlds.find((w) => w.slug === 'dragonball')!;

const jutsu = [...dragonballJutsu, ...dragonballJutsuExtra, ...dragonballEncyclopediaJutsu];

const events: TimelineEvent[] = [...dragonballEvents, ...dragonballEventsExtra, ...dragonballWishes, ...dragonballEncyclopediaEvents]
  // I desideri già raccontati da un evento ricevono il tag del marcatore mappa.
  .map((e) => (TAGGED_WISH_EVENTS.includes(e.id) ? { ...e, tags: [...new Set([...(e.tags ?? []), WISH_TAG])] } : e))
  .sort((a, b) => a.order - b.order);

/** Gli `eventIds` di ogni arco includono tutti gli eventi che dichiarano quell'arco. */
const arcs: StoryArc[] = dragonballArcs.map((arc) => ({
  ...arc,
  eventIds: [...new Set([...(arc.eventIds ?? []), ...events.filter((e) => e.arcId === arc.id).map((e) => e.id)])],
}));

/** Le tecniche dichiarano i propri utilizzatori: la scheda del personaggio le riceve in `jutsuIds`. */
const characters: Character[] = [
  ...dragonballCharacters,
  ...dragonballCharactersBatch1,
  ...dragonballCharactersFriezaSaga,
  ...dragonballCharactersGT,
  ...dragonballCharactersMovies,
  ...dragonballCharactersFiller,
  ...dragonballCharactersSuper,
  ...dragonballCharactersSupporting,
  ...dragonballCharactersExtra,
  ...dragonballTournamentFighters,
  ...dragonballEncyclopediaCharacters,
].map((c) => {
  const derived = jutsu.filter((j) => j.characterIds?.includes(c.id)).map((j) => j.id);
  const jutsuIds = [...new Set([...(c.jutsuIds ?? []), ...derived])];
  return jutsuIds.length ? { ...c, jutsuIds } : c;
});

/** Razze e fazioni elencano anche i personaggi che le dichiarano in `clanIds`/`factionIds`. */
const factions: Faction[] = dragonballFactions.map((f) => {
  const members = characters.filter((c) => c.clanIds?.includes(f.id) || c.factionIds?.includes(f.id)).map((c) => c.id);
  return members.length ? { ...f, characterIds: [...new Set([...(f.characterIds ?? []), ...members])] } : f;
});

/**
 * Dataset Dragon Ball.
 *
 * Copre il nucleo storico dei Guerrieri Z, i grandi archi da Dragon Ball a
 * Dragon Ball Super/GT-adjacent, le razze (come fazioni `type: 'race'` +
 * `character.race`), le trasformazioni/power-up per personaggio
 * (`character.transformations`), le tecniche principali e i luoghi chiave —
 * sia sulla mappa della Terra sia nella sotto-mappa cosmica per i luoghi non
 * rappresentabili su di essa (pianeti, Aldilà, Torneo del Potere).
 * Estendibile con nuovi personaggi/archi senza modifiche strutturali.
 */
export const dragonballDataset: WorldDataset = withSourceNames(withEventTags(withFactionExtras(withFamily(withBattles({
  // Slug SEO pubblicati (congelati): vedi src/seo/slug.ts e `npm run seo:slugs`.
  seoSlugs: dragonballSlugs,
  world: dragonball,
  mapLevels: dbzMapLevels,
  nations: dragonballNations,
  locations: [...dragonballLocations, ...dragonballLocationsExtra, ...dragonballEncyclopediaLocations],
  characters,
  factions,
  arcs,
  events,
  routes: [...dragonballRoutes, ...dragonballRoutesExtra],
  jutsu,
  tournaments: dragonballTournaments,
  assets: dragonballAssets,
}, dragonballBattles), dragonballFamily, 'char-dbz-'), dragonballStructure), dragonballMarkerTags), dragonballNames);

export { DRAGONBALL_MAP_VIEWBOX, DRAGONBALL_COSMIC_VIEWBOX } from './mapConstants';
