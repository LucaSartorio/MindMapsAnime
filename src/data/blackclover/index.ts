import type { WorldDataset } from '@/types';
import { animeWorlds } from '@/data/worlds';
import { blackcloverMapLevels } from './mapLevels';
import { blackcloverNations } from './nations';
import { blackcloverLocations } from './locations';
import { blackcloverCharacters } from './characters';
import { blackcloverCharactersMagicKnights } from './charactersMagicKnights';
import { blackcloverCharactersCloverRealm } from './charactersCloverRealm';
import { blackcloverCharactersElves } from './charactersElves';
import { blackcloverCharactersSpade } from './charactersSpade';
import { blackcloverCharactersOtherLands } from './charactersOtherLands';
import { blackcloverFactions } from './factions';
import { blackcloverArcs } from './arcs';
import { blackcloverEvents } from './events';
import { blackcloverRoutes } from './routes';
import { blackcloverMagic } from './magic';
import { blackcloverAssets } from './assets';

const blackclover = animeWorlds.find((w) => w.slug === 'blackclover')!;

/**
 * Dataset Black Clover (prima versione).
 *
 * Copre i quattro regni del continente (Clover, Diamond, Spade, Heart) più i
 * territori neutrali, Elysia e il Paese del Sole, la sotto-mappa dell'Inframondo,
 * le nove compagnie dei Cavalieri Magici con i loro capitani, l'Occhio Magico
 * della Notte Bianca e gli elfi, la Triade Oscura e i diavoli, e l'intera
 * timeline dal massacro degli elfi di cinquecento anni fa fino all'arco finale
 * di Lucius Zogratis.
 *
 * Il sistema di poteri (`WorldDataset.jutsu`, termine UI «Magia & Grimori») usa
 * due facet: `jutsu.type` è l'ATTRIBUTO MAGICO — in Black Clover ciò che
 * definisce un mago — e `jutsu.chakraNature` il TIPO di magia nella
 * classificazione dell'opera (d'attributo, composita, di creazione, degli
 * spiriti, di maledizione, proibita, diabolica, Stadio Arcano, tecnica di ki).
 * Entrambe le tassonomie vivono in `config.ts` e sono cablate nel `WorldConfig`
 * del mondo in `src/data/worlds.ts`.
 */
export const blackcloverDataset: WorldDataset = {
  world: blackclover,
  mapLevels: blackcloverMapLevels,
  nations: blackcloverNations,
  locations: blackcloverLocations,
  characters: [
    ...blackcloverCharacters,
    ...blackcloverCharactersMagicKnights,
    ...blackcloverCharactersCloverRealm,
    ...blackcloverCharactersElves,
    ...blackcloverCharactersSpade,
    ...blackcloverCharactersOtherLands,
  ],
  factions: blackcloverFactions,
  arcs: blackcloverArcs,
  events: blackcloverEvents,
  routes: blackcloverRoutes,
  jutsu: blackcloverMagic,
  assets: blackcloverAssets,
};

export { BLACKCLOVER_MAP_VIEWBOX, BLACKCLOVER_UNDERWORLD_VIEWBOX } from './mapConstants';
