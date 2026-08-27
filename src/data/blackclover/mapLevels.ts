import type { MapLevel } from '@/types';
import {
  BLACKCLOVER_MAP_VIEWBOX,
  BLACKCLOVER_UNDERWORLD_VIEWBOX,
} from './mapConstants';

/**
 * Map level di Black Clover.
 *
 * - `bc-map-world`: il continente dei quattro regni (Clover, Diamond, Spade,
 *   Heart) più i territori neutrali — mappa radice.
 * - `bc-map-underworld`: sotto-mappa concettuale dell'Inframondo, il regno dei
 *   diavoli diviso in sette livelli di potere crescente. Si apre con doppio
 *   clic sul pin «Porta dell'Inframondo»; il pin «Ritorno al mondo umano» al
 *   suo interno riporta alla mappa principale.
 */
export const blackcloverMapLevels: MapLevel[] = [
  {
    id: 'bc-map-world',
    worldId: 'world-blackclover',
    slug: 'world',
    name: 'World of Black Clover',
    localizedName: { it: 'Mondo di Black Clover', en: 'World of Black Clover' },
    description: {
      it: 'Il continente dei quattro regni: Clover a sud con la Capitale Reale e il villaggio di Hage, Diamond a est, Spade a nord, Heart a ovest, più i territori neutrali, i dungeon e il villaggio elfico di Elysia.',
      en: 'The continent of the four kingdoms: Clover to the south with the Royal Capital and the village of Hage, Diamond to the east, Spade to the north, Heart to the west, plus the neutral territories, the dungeons and the elf village of Elysia.',
    },
    backgroundAssetId: 'bc-world-map-reference',
    width: BLACKCLOVER_MAP_VIEWBOX.width,
    height: BLACKCLOVER_MAP_VIEWBOX.height,
  },
  {
    id: 'bc-map-underworld',
    worldId: 'world-blackclover',
    slug: 'underworld',
    name: 'Underworld',
    localizedName: { it: 'Inframondo', en: 'Underworld' },
    description: {
      it: "Sotto-mappa concettuale dell'Inframondo: i sette livelli del regno dei diavoli, dal primo (i diavoli di rango inferiore) al settimo, dominio di Lucifero. Schema a livelli di potere crescente, non una mappa in scala: la geografia dell'Inframondo non è mai stata mostrata come tale nell'opera. Doppio clic su «Ritorno al mondo umano» per tornare alla mappa principale.",
      en: "Conceptual sub-map of the Underworld: the seven levels of the devils' realm, from the first (low-ranking devils) to the seventh, Lucifero's domain. A diagram of increasing power levels, not a scale map — the Underworld's geography is never shown as such in the series. Double-click 'Back to the human world' to return to the main map.",
    },
    parentLevelId: 'bc-map-world',
    triggerLocationId: 'loc-bc-underworld-gate',
    backgroundAssetId: 'bc-underworld-map-placeholder',
    width: BLACKCLOVER_UNDERWORLD_VIEWBOX.width,
    height: BLACKCLOVER_UNDERWORLD_VIEWBOX.height,
  },
];
