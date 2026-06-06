import type { WorldDataset } from '@/types';
import { animeWorlds } from '@/data/worlds';
import { onepieceMapLevels } from './mapLevels';
import { onepieceNations } from './nations';
import { onepieceLocationsEastBlue } from './locations';
import { onepieceLocationsParadise } from './locationsParadise';
import { onepieceLocationsRedLine } from './locationsRedLine';
import { onepieceLocationsNewWorld } from './locationsNewWorld';
import { onepieceLocationsBlues } from './locationsBlues';
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
 * Fasi successive (da popolare): personaggi (ciurma di Cappello di Paglia,
 * Imperatori, Marina, Corsari…), fazioni, archi narrativi, eventi della
 * timeline, rotte (il viaggio della ciurma) e i Frutti del Diavolo come
 * `jutsu`/abilità.
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
  characters: [],
  factions: [],
  arcs: [],
  events: [],
  routes: [],
  assets: onepieceAssets,
};

export { ONEPIECE_MAP_VIEWBOX } from './mapLevels';
