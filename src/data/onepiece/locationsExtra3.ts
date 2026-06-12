import type { Location } from '@/types';

/**
 * Luoghi leggendari/mitici. All Blue è il mare dei sogni di Sanji: la sua reale
 * esistenza e posizione non sono confermate, quindi è marcato `needs_verification`.
 */
export const onepieceLocationsExtra3: Location[] = [
  {
    id: 'loc-op-all-blue',
    worldId: 'world-onepiece',
    mapLevelId: 'op-map-world',
    name: 'All Blue',
    localizedName: { it: 'All Blue', en: 'All Blue' },
    type: 'sacred_place',
    x: 560,
    y: 250,
    shortDescription: {
      it: "Il leggendario mare in cui confluiscono i pesci di tutti e quattro i Blue: il sogno di ogni cuoco, e di Sanji. La sua esistenza e posizione non sono mai state confermate.",
      en: "The legendary sea where fish from all four Blues gather: the dream of every cook, and of Sanji. Its existence and location have never been confirmed.",
    },
    longDescription: {
      it: "Si dice che da qualche parte lungo la Rotta Maggiore esista un mare dove convivono le specie ittiche di North, East, West e South Blue. Zeff lo cercò per tutta la vita; Sanji ha fatto di esso il proprio sogno. Posizione segnata in modo puramente indicativo.",
      en: "It is said that somewhere along the Grand Line lies a sea where the fish species of the North, East, West and South Blue all coexist. Zeff sought it his whole life; Sanji has made it his dream. Position marked purely indicatively.",
    },
    characterIds: ['char-op-sanji', 'char-op-zeff'],
    importance: 'secondary',
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['leggenda', 'sanji', 'cuoco', 'mare'],
  },
];
