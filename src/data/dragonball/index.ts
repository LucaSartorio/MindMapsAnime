import type { WorldDataset } from '@/types';
import { animeWorlds } from '@/data/worlds';
import { dbzMapLevels } from './mapLevels';
import { dragonballNations } from './nations';
import { dragonballLocations } from './locations';
import { dragonballCharacters } from './characters';
import { dragonballCharactersBatch1 } from './charactersBatch1';
import { dragonballCharactersFriezaSaga } from './charactersFriezaSaga';
import { dragonballFactions } from './factions';
import { dragonballArcs } from './arcs';
import { dragonballEvents } from './events';
import { dragonballRoutes } from './routes';
import { dragonballJutsu } from './jutsu';
import { dragonballAssets } from './assets';

const dragonball = animeWorlds.find((w) => w.slug === 'dragonball')!;

/**
 * Dataset Dragon Ball (prima versione).
 *
 * Copre il nucleo storico dei Guerrieri Z, i grandi archi da Dragon Ball a
 * Dragon Ball Super/GT-adjacent, le razze (come fazioni `type: 'race'` +
 * `character.race`), le trasformazioni/power-up per personaggio
 * (`character.transformations`), le tecniche principali e i luoghi chiave —
 * sia sulla mappa della Terra sia nella sotto-mappa cosmica per i luoghi non
 * rappresentabili su di essa (pianeti, Aldilà, Torneo del Potere).
 * Estendibile con nuovi personaggi/archi senza modifiche strutturali.
 */
export const dragonballDataset: WorldDataset = {
  world: dragonball,
  mapLevels: dbzMapLevels,
  nations: dragonballNations,
  locations: dragonballLocations,
  characters: [...dragonballCharacters, ...dragonballCharactersBatch1, ...dragonballCharactersFriezaSaga],
  factions: dragonballFactions,
  arcs: dragonballArcs,
  events: dragonballEvents,
  routes: dragonballRoutes,
  jutsu: dragonballJutsu,
  assets: dragonballAssets,
};

export { DRAGONBALL_MAP_VIEWBOX, DRAGONBALL_COSMIC_VIEWBOX } from './mapConstants';
