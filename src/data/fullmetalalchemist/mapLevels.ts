import type { MapLevel } from '@/types';
import { FMA_MAP_VIEWBOX } from './mapConstants';

/**
 * Map level di Fullmetal Alchemist.
 *
 * - `fma-map-world`: Amestris e i paesi confinanti — mappa radice, schematica. Nessuna sotto-mappa:
 *   non esiste una planimetria documentata di Central City o delle altre città.
 */
export const fmaMapLevels: MapLevel[] = [
  {
    id: 'fma-map-world',
    worldId: 'world-fullmetalalchemist',
    slug: 'world',
    name: 'Amestris and neighbouring lands',
    localizedName: { it: 'Amestris e i paesi vicini', en: 'Amestris and neighbouring lands' },
    description: {
      it: "Mappa schematica di Amestris, paese senza sbocco sul mare diviso in cinque aree — Centrale con la capitale Central City, Nord, Est, Sud e Ovest — con i vicini mostrati in parte ai bordi: Drachma a nord oltre i Monti Briggs, Creta a ovest, Aerugo a sud e Xing a est oltre un grande deserto. Il profilo dei confini è indicativo, non canonico.",
      en: 'Schematic map of Amestris, a landlocked country divided into five areas — Central with the capital Central City, North, East, South and West — with its neighbours partly shown at the edges: Drachma to the north beyond the Briggs Mountains, Creta to the west, Aerugo to the south and Xing to the east beyond a large desert. The border outlines are indicative, not canon.',
    },
    backgroundAssetId: 'fma-world-map',
    width: FMA_MAP_VIEWBOX.width,
    height: FMA_MAP_VIEWBOX.height,
  },
];
