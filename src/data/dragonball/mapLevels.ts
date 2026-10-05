import type { MapLevel } from '@/types';
import {
  DRAGONBALL_COSMIC_VIEWBOX,
  DRAGONBALL_GT_SPACE_VIEWBOX,
  DRAGONBALL_LOOKOUT_VIEWBOX,
  DRAGONBALL_MAP_VIEWBOX,
  DRAGONBALL_NAMEK_VIEWBOX,
  DRAGONBALL_OTHER_WORLD_VIEWBOX,
  DRAGONBALL_PAPAYA_VIEWBOX,
  DRAGONBALL_WEST_CITY_VIEWBOX,
} from './mapConstants';

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
      it: "Sotto-mappa concettuale dei luoghi cosmici: Pianeta Namecc, Pianeta Vegeta (distrutto), il Pianeta di Re Kaioh, l'Aldilà, il Pianeta di Beerus, il Mondo Sacro dei Kaiōshin e il Mondo del Nulla del Torneo del Potere. Posizioni indicative, non una mappa in scala. Doppio clic su «Terra» per tornare alla mappa principale.",
      en: "Conceptual sub-map of the cosmic locations: Planet Namek, Planet Vegeta (destroyed), King Kai's planet, the Other World, Beerus's planet, the Sacred World of the Kais and the Tournament of Power's Null Realm. Indicative positions, not a scale map. Double-click 'Earth' to return to the main map.",
    },
    parentLevelId: 'dbz-map-world',
    triggerLocationId: 'loc-dbz-space-gate',
    backgroundAssetId: 'dbz-cosmic-map',
    width: DRAGONBALL_COSMIC_VIEWBOX.width,
    height: DRAGONBALL_COSMIC_VIEWBOX.height,
  },
  {
    id: 'dbz-map-namek',
    worldId: 'world-dragonball',
    slug: 'namek',
    name: 'Namek',
    localizedName: { it: 'Namecc', en: 'Namek' },
    description: {
      it: "Sotto-mappa concettuale del Pianeta Namecc: i villaggi namecciani, la casa del Capo Anziano Guru, il punto di atterraggio di Vegeta, l'astronave di Freezer e i campi di battaglia della Saga di Namecc/Freezer. Posizioni indicative su un pianeta dalla geografia mai mostrata in scala nella serie. Doppio clic su «Universo» per tornare alla mappa cosmica.",
      en: "Conceptual sub-map of Planet Namek: the Namekian villages, Grand Elder Guru's house, Vegeta's landing site, Frieza's spaceship and the battlefields of the Namek/Frieza Saga. Indicative positions on a planet whose geography was never shown to scale in the series. Double-click 'Universe' to return to the cosmic map.",
    },
    parentLevelId: 'dbz-map-cosmic',
    triggerLocationId: 'loc-dbz-namek-planet',
    backgroundAssetId: 'dbz-namek-map',
    width: DRAGONBALL_NAMEK_VIEWBOX.width,
    height: DRAGONBALL_NAMEK_VIEWBOX.height,
  },
  {
    id: 'dbz-map-gt-space',
    worldId: 'world-dragonball',
    slug: 'gt-space',
    name: 'Space (GT)',
    localizedName: { it: 'Spazio (GT)', en: 'Space (GT)' },
    description: {
      it: "Dragon Ball GT: lo spazio profondo percorso da Goku, Trunks e Pan a bordo della nave spaziale nella caccia alle Sfere del Drago Nere — dal Pianeta Imecca al Pianeta Macchina M-2, da Gelbo (Luud) a Beehay e al Pianeta-ospedale Pital — più il Nuovo Pianeta Plant dei Tsufuru della Saga di Baby. Schema stellare, posizioni indicative. Doppio clic su «Terra» per tornare alla mappa principale.",
      en: "Dragon Ball GT: the deep space traveled by Goku, Trunks and Pan aboard their starship while hunting the Black Star Dragon Balls — from Planet Imecka to the Machine Planet M-2, from Gelbo (Luud) to Beehay and the hospital planet Pital — plus the Tuffles' New Planet Plant of the Baby Saga. Star chart, indicative positions. Double-click 'Earth' to return to the main map.",
    },
    parentLevelId: 'dbz-map-world',
    triggerLocationId: 'loc-dbz-gt-space-gate',
    backgroundAssetId: 'dbz-gt-space-map',
    width: DRAGONBALL_GT_SPACE_VIEWBOX.width,
    height: DRAGONBALL_GT_SPACE_VIEWBOX.height,
  },
  {
    id: 'dbz-map-other-world',
    worldId: 'world-dragonball',
    slug: 'other-world',
    name: 'Other World',
    localizedName: { it: 'Aldilà', en: 'Other World' },
    description: {
      it: "L'Aldilà di Dragon Ball: il palazzo di Re Yama dove le anime vengono giudicate, la Via del Serpente lunga un milione di chilometri, il palazzo della Principessa Serpente, il pianetino di Re Kaioh, il pianeta del Gran Kaiō con lo stadio del Torneo dell'Aldilà, il Paradiso e l'Inferno. Schema originale, posizioni indicative. Doppio clic su «Universo» per tornare alla mappa cosmica.",
      en: "Dragon Ball's Other World: King Yemma's palace where souls are judged, the million-kilometre Snake Way, Princess Snake's palace, King Kai's tiny planet, Grand Kai's planet with the Other World Tournament stadium, Heaven and Hell. Original diagram, indicative positions. Double-click 'Universe' to return to the cosmic map.",
    },
    parentLevelId: 'dbz-map-cosmic',
    triggerLocationId: 'loc-dbz-other-world',
    backgroundAssetId: 'dbz-other-world-map',
    width: DRAGONBALL_OTHER_WORLD_VIEWBOX.width,
    height: DRAGONBALL_OTHER_WORLD_VIEWBOX.height,
  },
  {
    id: 'dbz-map-lookout',
    worldId: 'world-dragonball',
    slug: 'lookout',
    name: "Kami's Lookout",
    localizedName: { it: 'Santuario di Dio e Torre di Karin', en: "Kami's Lookout & Korin Tower" },
    description: {
      it: "In verticale, dalla Terra Sacra di Karin al cielo: la foresta dove vivono Bora e Upa, la Torre di Karin con i fagioli di Balzar in cima, e sopra le nuvole il Santuario di Dio con il palazzo e la Stanza dello Spirito e del Tempo. Schema originale. Doppio clic su «Terra» per tornare alla mappa principale.",
      en: "Vertically, from Korin's Holy Land to the sky: the forest where Bora and Upa live, Korin Tower with the Senzu beans at its top, and above the clouds Kami's Lookout with the palace and the Hyperbolic Time Chamber. Original diagram. Double-click 'Earth' to return to the main map.",
    },
    parentLevelId: 'dbz-map-world',
    triggerLocationId: 'loc-dbz-lookout',
    backgroundAssetId: 'dbz-lookout-map',
    width: DRAGONBALL_LOOKOUT_VIEWBOX.width,
    height: DRAGONBALL_LOOKOUT_VIEWBOX.height,
  },
  {
    id: 'dbz-map-papaya',
    worldId: 'world-dragonball',
    slug: 'papaya-island',
    name: 'Papaya Island',
    localizedName: { it: 'Isola di Papaya · Torneo Tenkaichi', en: 'Papaya Island · World Martial Arts Tournament' },
    description: {
      it: "L'isola che ospita il Torneo Tenkaichi: il porto dei traghetti, la cittadina, il portale d'ingresso, la sala delle eliminatorie e il ring di pietra dove si sono affrontati Goku, Jackie Chun, Tensing, Piccolo e, anni dopo, Gohan e Majin Vegeta. Schema originale. Doppio clic su «Terra» per tornare alla mappa principale.",
      en: "The island that hosts the World Martial Arts Tournament: the ferry port, the town, the entrance gate, the preliminaries hall and the stone ring where Goku, Jackie Chun, Tien, Piccolo and, years later, Gohan and Majin Vegeta fought. Original diagram. Double-click 'Earth' to return to the main map.",
    },
    parentLevelId: 'dbz-map-world',
    triggerLocationId: 'loc-dbz-tenkaichi-arena',
    backgroundAssetId: 'dbz-papaya-map',
    width: DRAGONBALL_PAPAYA_VIEWBOX.width,
    height: DRAGONBALL_PAPAYA_VIEWBOX.height,
  },
  {
    id: 'dbz-map-west-city',
    worldId: 'world-dragonball',
    slug: 'west-city',
    name: 'West City',
    localizedName: { it: "Città dell'Ovest · Capsule Corporation", en: 'West City · Capsule Corporation' },
    description: {
      it: "La metropoli della famiglia Brief: il complesso a cupola della Capsule Corporation, il laboratorio dove Bulma costruisce il radar del drago e la Macchina del Tempo, la stanza della gravità di Vegeta e il giardino di casa. Schema originale. Doppio clic su «Terra» per tornare alla mappa principale.",
      en: "The Briefs family's metropolis: the domed Capsule Corporation compound, the lab where Bulma builds the Dragon Radar and the Time Machine, Vegeta's gravity room and the home garden. Original diagram. Double-click 'Earth' to return to the main map.",
    },
    parentLevelId: 'dbz-map-world',
    triggerLocationId: 'loc-dbz-west-city',
    backgroundAssetId: 'dbz-west-city-map',
    width: DRAGONBALL_WEST_CITY_VIEWBOX.width,
    height: DRAGONBALL_WEST_CITY_VIEWBOX.height,
  },
];
