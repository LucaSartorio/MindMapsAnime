import type { MapLevel } from '@/types';

export const narutoMapLevels: MapLevel[] = [
  {
    id: 'naruto-map-world',
    worldId: 'world-naruto',
    slug: 'world',
    name: 'Elemental Nations',
    description:
      'Mappa del continente principale. Cinque grandi nazioni e i loro Villaggi Nascosti.',
    backgroundAssetId: 'naruto-world-background-placeholder',
    width: 1600,
    height: 1000,
  },
  {
    id: 'naruto-map-konoha',
    worldId: 'world-naruto',
    slug: 'konoha',
    name: 'Konohagakure',
    description:
      'Sotto-mappa del Villaggio Nascosto della Foglia. Posizioni concettuali.',
    parentLevelId: 'naruto-map-world',
    triggerLocationId: 'loc-konoha',
    backgroundAssetId: 'naruto-konoha-background-placeholder',
    width: 1200,
    height: 800,
  },
];
