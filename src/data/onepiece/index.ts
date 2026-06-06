import type { WorldDataset } from '@/types';
import { animeWorlds } from '@/data/worlds';
import { onepieceMapLevels } from './mapLevels';
import { onepieceNations } from './nations';
import { onepieceLocationsEastBlue } from './locations';
import { onepieceLocationsParadise } from './locationsParadise';
import { onepieceLocationsRedLine } from './locationsRedLine';
import { onepieceLocationsNewWorld } from './locationsNewWorld';
import { onepieceLocationsBlues } from './locationsBlues';
import { onepieceFactions } from './factions';
import { onepieceFactionsSouthBlue } from './factionsSouthBlue';
import { onepieceFactionsNorthBlue } from './factionsNorthBlue';
import { onepieceFactionsWestBlue } from './factionsWestBlue';
import { onepieceCharactersEastBlue } from './characters';
import { onepieceCharactersSouthBlue } from './charactersSouthBlue';
import { onepieceCharactersNorthBlue } from './charactersNorthBlue';
import { onepieceCharactersWestBlue } from './charactersWestBlue';
import { onepieceArcs } from './arcs';
import { onepieceArcsSouthBlue } from './arcsSouthBlue';
import { onepieceArcsNorthBlue } from './arcsNorthBlue';
import { onepieceArcsWestBlue } from './arcsWestBlue';
import { onepieceEvents } from './events';
import { onepieceEventsSouthBlue } from './eventsSouthBlue';
import { onepieceEventsNorthBlue } from './eventsNorthBlue';
import { onepieceEventsWestBlue } from './eventsWestBlue';
import { onepieceRoutes } from './routes';
import { onepieceAssets } from './assets';

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
  ],
  characters: [
    ...onepieceCharactersEastBlue,
    ...onepieceCharactersSouthBlue,
    ...onepieceCharactersNorthBlue,
    ...onepieceCharactersWestBlue,
  ],
  factions: [
    ...onepieceFactions,
    ...onepieceFactionsSouthBlue,
    ...onepieceFactionsNorthBlue,
    ...onepieceFactionsWestBlue,
  ],
  arcs: [
    ...onepieceArcs,
    ...onepieceArcsSouthBlue,
    ...onepieceArcsNorthBlue,
    ...onepieceArcsWestBlue,
  ],
  events: [
    ...onepieceEvents,
    ...onepieceEventsSouthBlue,
    ...onepieceEventsNorthBlue,
    ...onepieceEventsWestBlue,
  ],
  routes: onepieceRoutes,
  assets: onepieceAssets,
};

export { ONEPIECE_MAP_VIEWBOX } from './mapLevels';
