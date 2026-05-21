import type { MapLevel } from '@/types';

/**
 * Map levels Naruto.
 *
 * - `naruto-map-world`: world map, background = immagine PNG di riferimento
 *   fornita dall'utente (slot diretto, vedi assets.ts).
 * - sotto-mappe villaggio: ognuna ha un `triggerLocationId` (il pin sulla
 *   world map che apre il drill-down) e un `parentLevelId`.
 *
 * Coordinate POI nello spazio del rispettivo viewBox (width x height).
 */
export const narutoMapLevels: MapLevel[] = [
  {
    id: 'naruto-map-world',
    worldId: 'world-naruto',
    slug: 'world',
    name: 'Elemental Nations',
    localizedName: { it: 'Nazioni Elementali', en: 'Elemental Nations' },
    description: {
      it: 'Mappa del continente principale. Cinque grandi nazioni, nazioni minori e Villaggi Nascosti.',
      en: 'Map of the main continent. Five great nations, minor nations and Hidden Villages.',
    },
    backgroundAssetId: 'naruto-world-map-reference-expanded',
    width: 1500,
    height: 882.2204,
  },
  {
    id: 'naruto-map-konoha',
    worldId: 'world-naruto',
    slug: 'konoha',
    name: 'Konohagakure',
    localizedName: {
      it: 'Konohagakure · Villaggio della Foglia',
      en: 'Konohagakure · Hidden Leaf Village',
    },
    description: {
      it: 'Sotto-mappa del Villaggio Nascosto della Foglia. Posizioni concettuali.',
      en: 'Sub-map of the Hidden Leaf Village. Conceptual positions.',
    },
    parentLevelId: 'naruto-map-world',
    triggerLocationId: 'loc-konoha',
    backgroundAssetId: 'naruto-konoha-background-placeholder',
    width: 1200,
    height: 800,
  },
  {
    id: 'naruto-map-suna',
    worldId: 'world-naruto',
    slug: 'suna',
    name: 'Sunagakure',
    localizedName: {
      it: 'Sunagakure · Villaggio della Sabbia',
      en: 'Sunagakure · Hidden Sand Village',
    },
    description: {
      it: 'Sotto-mappa del Villaggio della Sabbia, nel Paese del Vento.',
      en: 'Sub-map of the Hidden Sand Village, in the Land of Wind.',
    },
    parentLevelId: 'naruto-map-world',
    triggerLocationId: 'loc-suna',
    backgroundAssetId: 'naruto-village-submap-placeholder',
    width: 1000,
    height: 700,
  },
  {
    id: 'naruto-map-kiri',
    worldId: 'world-naruto',
    slug: 'kiri',
    name: 'Kirigakure',
    localizedName: {
      it: 'Kirigakure · Villaggio della Nebbia',
      en: 'Kirigakure · Hidden Mist Village',
    },
    description: {
      it: 'Sotto-mappa del Villaggio della Nebbia, nel Paese dell\'Acqua.',
      en: 'Sub-map of the Hidden Mist Village, in the Land of Water.',
    },
    parentLevelId: 'naruto-map-world',
    triggerLocationId: 'loc-kiri',
    backgroundAssetId: 'naruto-village-submap-placeholder',
    width: 1000,
    height: 700,
  },
  {
    id: 'naruto-map-iwa',
    worldId: 'world-naruto',
    slug: 'iwa',
    name: 'Iwagakure',
    localizedName: {
      it: 'Iwagakure · Villaggio della Roccia',
      en: 'Iwagakure · Hidden Stone Village',
    },
    description: {
      it: 'Sotto-mappa del Villaggio della Roccia, nel Paese della Terra.',
      en: 'Sub-map of the Hidden Stone Village, in the Land of Earth.',
    },
    parentLevelId: 'naruto-map-world',
    triggerLocationId: 'loc-iwa',
    backgroundAssetId: 'naruto-village-submap-placeholder',
    width: 1000,
    height: 700,
  },
  {
    id: 'naruto-map-kumo',
    worldId: 'world-naruto',
    slug: 'kumo',
    name: 'Kumogakure',
    localizedName: {
      it: 'Kumogakure · Villaggio della Nuvola',
      en: 'Kumogakure · Hidden Cloud Village',
    },
    description: {
      it: 'Sotto-mappa del Villaggio della Nuvola, nel Paese del Fulmine.',
      en: 'Sub-map of the Hidden Cloud Village, in the Land of Lightning.',
    },
    parentLevelId: 'naruto-map-world',
    triggerLocationId: 'loc-kumo',
    backgroundAssetId: 'naruto-village-submap-placeholder',
    width: 1000,
    height: 700,
  },
  {
    id: 'naruto-map-ame',
    worldId: 'world-naruto',
    slug: 'ame',
    name: 'Amegakure',
    localizedName: {
      it: 'Amegakure · Villaggio della Pioggia',
      en: 'Amegakure · Hidden Rain Village',
    },
    description: {
      it: 'Sotto-mappa del Villaggio della Pioggia. Base storica dell\'Akatsuki.',
      en: 'Sub-map of the Hidden Rain Village. Historical base of the Akatsuki.',
    },
    parentLevelId: 'naruto-map-world',
    triggerLocationId: 'loc-ame',
    backgroundAssetId: 'naruto-village-submap-placeholder',
    width: 1000,
    height: 700,
  },
  {
    id: 'naruto-map-oto',
    worldId: 'world-naruto',
    slug: 'oto',
    name: 'Otogakure',
    localizedName: {
      it: 'Otogakure · Villaggio del Suono',
      en: 'Otogakure · Hidden Sound Village',
    },
    description: {
      it: 'Sotto-mappa del Villaggio del Suono e dei nascondigli di Orochimaru.',
      en: 'Sub-map of the Hidden Sound Village and Orochimaru\'s hideouts.',
    },
    parentLevelId: 'naruto-map-world',
    triggerLocationId: 'loc-oto',
    backgroundAssetId: 'naruto-village-submap-placeholder',
    width: 1000,
    height: 700,
  },
  {
    id: 'naruto-map-uzu',
    worldId: 'world-naruto',
    slug: 'uzu',
    name: 'Uzushiogakure',
    localizedName: {
      it: 'Uzushiogakure · Rovine del Vortice',
      en: 'Uzushiogakure · Eddy Village Ruins',
    },
    description: {
      it: 'Sotto-mappa delle rovine del villaggio del clan Uzumaki.',
      en: 'Sub-map of the ruins of the Uzumaki clan village.',
    },
    parentLevelId: 'naruto-map-world',
    triggerLocationId: 'loc-uzushio-ruins',
    backgroundAssetId: 'naruto-village-submap-placeholder',
    width: 1000,
    height: 700,
  },
  {
    id: 'naruto-map-taki',
    worldId: 'world-naruto',
    slug: 'taki',
    name: 'Takigakure',
    localizedName: {
      it: 'Takigakure · Villaggio della Cascata',
      en: 'Takigakure · Hidden Waterfall Village',
    },
    description: {
      it: 'Sotto-mappa del Villaggio della Cascata.',
      en: 'Sub-map of the Hidden Waterfall Village.',
    },
    parentLevelId: 'naruto-map-world',
    triggerLocationId: 'loc-taki',
    backgroundAssetId: 'naruto-village-submap-placeholder',
    width: 1000,
    height: 700,
  },
];
