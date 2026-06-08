import type { WorldDataset } from '@/types';
import { animeWorlds } from '@/data/worlds';
import { onepieceMapLevels } from './mapLevels';
import { onepieceNations } from './nations';
import { onepieceLocationsEastBlue } from './locations';
import { onepieceLocationsParadise } from './locationsParadise';
import { onepieceLocationsRedLine } from './locationsRedLine';
import { onepieceLocationsNewWorld } from './locationsNewWorld';
import { onepieceLocationsBlues } from './locationsBlues';
import { onepieceLocationsExtra } from './locationsExtra';
import { onepieceLocationsTotland } from './locationsTotland';
import { onepieceLocationsSubmaps } from './locationsSubmaps';
import { onepieceLocationsSubmaps2 } from './locationsSubmaps2';
import { onepieceLocationsSubmaps3 } from './locationsSubmaps3';
import { onepieceLocationsSubmapsExtra } from './locationsSubmapsExtra';
import { onepieceLocationsSubmaps4 } from './locationsSubmaps4';
import { onepieceLocationsSubmaps5 } from './locationsSubmaps5';
import { onepieceLocationsExtra2 } from './locationsExtra2';
import { onepieceFactions } from './factions';
import { onepieceFactionsSouthBlue } from './factionsSouthBlue';
import { onepieceFactionsNorthBlue } from './factionsNorthBlue';
import { onepieceFactionsWestBlue } from './factionsWestBlue';
import { onepieceFactionsRedLine } from './factionsRedLine';
import { onepieceFactionsParadise } from './factionsParadise';
import { onepieceFactionsParadise2 } from './factionsParadise2';
import { onepieceFactionsWholeCakeWano } from './factionsWholeCakeWano';
import { onepieceFactionsEgghead } from './factionsEgghead';
import { onepieceFactionsSupernovas } from './factionsSupernovas';
import { onepieceFactionsExtra } from './factionsExtra';
import { onepieceCharactersEastBlue } from './characters';
import { onepieceCharactersParadise } from './charactersParadise';
import { onepieceCharactersParadise2 } from './charactersParadise2';
import { onepieceCharactersNewWorldSagas } from './charactersNewWorldSagas';
import { onepieceCharactersWholeCakeWano } from './charactersWholeCakeWano';
import { onepieceCharactersEgghead } from './charactersEgghead';
import { onepieceCharactersSouthBlue } from './charactersSouthBlue';
import { onepieceCharactersNorthBlue } from './charactersNorthBlue';
import { onepieceCharactersWestBlue } from './charactersWestBlue';
import { onepieceCharactersRedLine } from './charactersRedLine';
import { onepieceCharactersSupernovas } from './charactersSupernovas';
import { onepieceCharactersExtra } from './charactersExtra';
import { onepieceCharactersExtra2 } from './charactersExtra2';
import { onepieceCharactersExtra3 } from './charactersExtra3';
import { onepieceCharactersExtra4 } from './charactersExtra4';
import { onepieceCharactersExtra5 } from './charactersExtra5';
import { onepieceCharactersExtra6 } from './charactersExtra6';
import { onepieceCharactersExtra7 } from './charactersExtra7';
import { onepieceCharactersFilms } from './charactersFilms';
import { onepieceArcs } from './arcs';
import { onepieceArcsSouthBlue } from './arcsSouthBlue';
import { onepieceArcsNorthBlue } from './arcsNorthBlue';
import { onepieceArcsWestBlue } from './arcsWestBlue';
import { onepieceArcsRedLine } from './arcsRedLine';
import { onepieceArcsParadise } from './arcsParadise';
import { onepieceArcsParadise2 } from './arcsParadise2';
import { onepieceArcsNewWorldSagas } from './arcsNewWorldSagas';
import { onepieceArcsWholeCakeWano } from './arcsWholeCakeWano';
import { onepieceArcsEgghead } from './arcsEgghead';
import { onepieceArcsExtra } from './arcsExtra';
import { onepieceEvents } from './events';
import { onepieceEventsSouthBlue } from './eventsSouthBlue';
import { onepieceEventsNorthBlue } from './eventsNorthBlue';
import { onepieceEventsWestBlue } from './eventsWestBlue';
import { onepieceEventsRedLine } from './eventsRedLine';
import { onepieceEventsParadise } from './eventsParadise';
import { onepieceEventsParadise2 } from './eventsParadise2';
import { onepieceEventsNewWorldSagas } from './eventsNewWorldSagas';
import { onepieceEventsWholeCakeWano } from './eventsWholeCakeWano';
import { onepieceEventsEgghead } from './eventsEgghead';
import { onepieceEventsExtra } from './eventsExtra';
import { onepieceEventsExtra2 } from './eventsExtra2';
import { onepieceEventsBattles } from './eventsBattles';
import { onepieceEventsBattles2 } from './eventsBattles2';
import { onepieceEventsBattles3 } from './eventsBattles3';
import { onepieceEventsExtra3 } from './eventsExtra3';
import { onepieceRoutes } from './routes';
import { onepieceRoutesGrandLine } from './routesGrandLine';
import { onepieceRoutesExtra } from './routesExtra';
import { onepieceDevilFruits } from './devilFruits';
import { onepieceDevilFruitsExtra } from './devilFruitsExtra';
import { onepieceDevilFruitsExtra2 } from './devilFruitsExtra2';
import { onepieceAssets } from './assets';
import { onepieceBounties } from './bounties';

const onepiece = animeWorlds.find((w) => w.slug === 'onepiece')!;

/**
 * Dataset One Piece (in costruzione).
 *
 * Fase attuale — GEOGRAFIA COMPLETA: i quattro Mari e la Grand Line (Paradise +
 * New World) come `Nation`, e tutte le isole / punti di interesse della mappa
 * del mondo come `Location` (East Blue, Paradise, Red Line/Calm Belt, New World,
 * North/West/South Blue). Coordinate poste sul piano viewBox 2000 × 1000 e
 * marcate `needs_verification` finché non si rifiniscono sull'immagine ad alta
 * risoluzione.
 *
 * EAST BLUE COMPLETO: POI verificati (allineati sulla mappa), le ciurme e i
 * personaggi della Saga di East Blue (i 5 Cappello di Paglia + alleati,
 * Marina e antagonisti), i 6 archi narrativi, la timeline degli eventi e il
 * percorso della ciurma da Foosha a Reverse Mountain.
 *
 * Fasi successive (in ordine): South Blue, North Blue, West Blue, Calm Belt,
 * Red Line — POI verificati, percorsi, archi e timeline per ciascuno — e i
 * Frutti del Diavolo come `jutsu`/abilità.
 */
export const onepieceDataset: WorldDataset = {
  world: onepiece,
  mapLevels: onepieceMapLevels,
  nations: onepieceNations,
  locations: [
    ...onepieceLocationsEastBlue,
    ...onepieceLocationsParadise,
    ...onepieceLocationsRedLine,
    ...onepieceLocationsNewWorld,
    ...onepieceLocationsBlues,
    ...onepieceLocationsExtra,
    ...onepieceLocationsTotland,
    ...onepieceLocationsSubmaps,
    ...onepieceLocationsSubmaps2,
    ...onepieceLocationsSubmaps3,
    ...onepieceLocationsSubmapsExtra,
    ...onepieceLocationsSubmaps4,
    ...onepieceLocationsSubmaps5,
    ...onepieceLocationsExtra2,
  ],
  characters: [
    ...onepieceCharactersEastBlue,
    ...onepieceCharactersSouthBlue,
    ...onepieceCharactersNorthBlue,
    ...onepieceCharactersWestBlue,
    ...onepieceCharactersRedLine,
    ...onepieceCharactersParadise,
    ...onepieceCharactersParadise2,
    ...onepieceCharactersNewWorldSagas,
    ...onepieceCharactersWholeCakeWano,
    ...onepieceCharactersEgghead,
    ...onepieceCharactersSupernovas,
    ...onepieceCharactersExtra,
    ...onepieceCharactersExtra2,
    ...onepieceCharactersExtra3,
    ...onepieceCharactersExtra4,
    ...onepieceCharactersExtra5,
    ...onepieceCharactersExtra6,
    ...onepieceCharactersExtra7,
    ...onepieceCharactersFilms,
  ].map((c) => (onepieceBounties[c.id] ? { ...c, bounties: onepieceBounties[c.id] } : c)),
  factions: [
    ...onepieceFactions,
    ...onepieceFactionsSouthBlue,
    ...onepieceFactionsNorthBlue,
    ...onepieceFactionsWestBlue,
    ...onepieceFactionsRedLine,
    ...onepieceFactionsParadise,
    ...onepieceFactionsParadise2,
    ...onepieceFactionsWholeCakeWano,
    ...onepieceFactionsEgghead,
    ...onepieceFactionsSupernovas,
    ...onepieceFactionsExtra,
  ],
  arcs: [
    ...onepieceArcs,
    ...onepieceArcsSouthBlue,
    ...onepieceArcsNorthBlue,
    ...onepieceArcsWestBlue,
    ...onepieceArcsRedLine,
    ...onepieceArcsParadise,
    ...onepieceArcsParadise2,
    ...onepieceArcsNewWorldSagas,
    ...onepieceArcsWholeCakeWano,
    ...onepieceArcsEgghead,
    ...onepieceArcsExtra,
  ],
  events: [
    ...onepieceEvents,
    ...onepieceEventsSouthBlue,
    ...onepieceEventsNorthBlue,
    ...onepieceEventsWestBlue,
    ...onepieceEventsRedLine,
    ...onepieceEventsParadise,
    ...onepieceEventsParadise2,
    ...onepieceEventsNewWorldSagas,
    ...onepieceEventsWholeCakeWano,
    ...onepieceEventsEgghead,
    ...onepieceEventsExtra,
    ...onepieceEventsExtra2,
    ...onepieceEventsBattles,
    ...onepieceEventsBattles2,
    ...onepieceEventsBattles3,
    ...onepieceEventsExtra3,
  ],
  routes: [...onepieceRoutes, ...onepieceRoutesGrandLine, ...onepieceRoutesExtra],
  jutsu: [...onepieceDevilFruits, ...onepieceDevilFruitsExtra, ...onepieceDevilFruitsExtra2],
  assets: onepieceAssets,
};

export { ONEPIECE_MAP_VIEWBOX } from './mapLevels';
