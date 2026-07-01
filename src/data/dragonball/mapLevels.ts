import type { MapLevel } from '@/types';
import { DRAGONBALL_COSMIC_VIEWBOX, DRAGONBALL_MAP_VIEWBOX } from './mapConstants';

/**
 * Map level Dragon Ball.
 *
 * - `dbz-map-world`: la Terra, mappa radice (poster di riferimento).
 * - `dbz-map-cosmic`: sotto-mappa "cosmica" concettuale che raccoglie i luoghi
 *   non rappresentabili sulla mappa terrestre — pianeti (Namecc, Vegeta,
 *   Beerus, Re Kaiō), l'Aldilà e l'arena del Torneo del Potere. Si apre con
 *   doppio clic sul pin "Spazio" sulla mappa della Terra (stesso pattern già
 *   usato per la sotto-mappa "Spazio" di One Piece); il pin "Terra" al suo
 *   interno riporta alla mappa principale.
 */
export const dbzMapLevels: MapLevel[] = [
  {
    id: 'dbz-map-world',
    worldId: 'world-dragonball',
    slug: 'world',
    name: 'World Map',
    localizedName: { it: 'Mappa della Terra', en: 'Earth Map' },
    description: {
      it: 'Mappa della Terra di Dragon Ball: dal Monte Paoz alla Kame House, dalla Torre di Karin alle città principali, fino ai luoghi chiave delle saghe di Red Ribbon, degli Androidi e di Majin Bu.',
      en: "Map of the Dragon Ball Earth: from Mt. Paozu to Kame House, from Korin's Tower to the main cities, up to the key locations of the Red Ribbon, Androids and Majin Buu sagas.",
    },
    backgroundAssetId: 'dbz-world-map-reference',
    width: DRAGONBALL_MAP_VIEWBOX.width,
    height: DRAGONBALL_MAP_VIEWBOX.height,
  },
  {
    id: 'dbz-map-cosmic',
    worldId: 'world-dragonball',
    slug: 'cosmic',
    name: 'Universe',
    localizedName: { it: 'Universo', en: 'Universe' },
    description: {
      it: "Sotto-mappa concettuale dei luoghi cosmici: Pianeta Namecc, Pianeta Vegeta (distrutto), il Pianeta di Re Kaiō, l'Aldilà, il Pianeta di Beerus, il Mondo Sacro dei Kaiōshin e il Mondo del Nulla del Torneo del Potere. Posizioni indicative, non una mappa in scala. Doppio clic su «Terra» per tornare alla mappa principale.",
      en: "Conceptual sub-map of the cosmic locations: Planet Namek, Planet Vegeta (destroyed), King Kai's planet, the Other World, Beerus's planet, the Sacred World of the Kais and the Tournament of Power's Null Realm. Indicative positions, not a scale map. Double-click 'Earth' to return to the main map.",
    },
    parentLevelId: 'dbz-map-world',
    triggerLocationId: 'loc-dbz-space-gate',
    backgroundAssetId: 'dbz-cosmic-map-placeholder',
    width: DRAGONBALL_COSMIC_VIEWBOX.width,
    height: DRAGONBALL_COSMIC_VIEWBOX.height,
  },
];
