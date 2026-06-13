import type { Location } from '@/types';

/**
 * Luoghi Naruto · Batch 2 — coda di completamento.
 *
 * Due sotto-luoghi storici di Konoha + il castello del Paese della Neve
 * (poi Paese della Primavera) ancorato a Yukigakure sul world map.
 */
export const narutoLocationsBatch2: Location[] = [
  {
    id: 'loc-konoha-senju-compound',
    worldId: 'world-naruto',
    mapLevelId: 'naruto-map-konoha',
    name: 'Senju Compound',
    localizedName: { it: 'Residenza Senju', en: 'Senju Compound' },
    type: 'region',
    x: 320,
    y: 340,
    nationId: 'nation-fire',
    shortDescription: {
      it: 'Quartiere storico del clan Senju, co-fondatore di Konoha insieme agli Uchiha. Casa di Hashirama, Tobirama e in seguito di Tsunade.',
      en: 'Historic district of the Senju clan, co-founders of Konoha alongside the Uchiha. Home of Hashirama, Tobirama and later Tsunade.',
    },
    clanIds: ['clan-senju'],
    characterIds: ['char-hashirama', 'char-tobirama', 'char-tsunade'],
    importance: 'secondary',
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['konoha', 'senju', 'founders'],
  },
  {
    id: 'loc-konoha-orphanage',
    worldId: 'world-naruto',
    mapLevelId: 'naruto-map-konoha',
    name: 'Konoha Orphanage',
    localizedName: { it: 'Orfanotrofio di Konoha', en: 'Konoha Orphanage' },
    type: 'landmark',
    x: 1080,
    y: 640,
    nationId: 'nation-fire',
    shortDescription: {
      it: 'Istituto del villaggio per i bambini rimasti orfani — molti dalla guerra. Vi crebbero figure come Kabuto prima del reclutamento nella Radice.',
      en: 'The village institute for orphaned children — many from the war. Figures such as Kabuto grew up here before being recruited by Root.',
    },
    characterIds: ['char-kabuto'],
    importance: 'minor',
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['konoha', 'orphanage'],
  },
  {
    id: 'loc-snow-castle',
    worldId: 'world-naruto',
    mapLevelId: 'naruto-map-world',
    name: 'Snow Castle (Land of Spring)',
    localizedName: { it: 'Castello della Neve (Paese della Primavera)', en: 'Snow Castle (Land of Spring)' },
    type: 'city',
    x: 250,
    y: 96,
    nationId: 'nation-snow',
    shortDescription: {
      it: 'Roccaforte reale del Paese della Neve, governato dalla famiglia Kazahana. Dopo la liberazione da parte di Koyuki diventa il prospero Paese della Primavera.',
      en: 'Royal stronghold of the Land of Snow, ruled by the Kazahana family. After Koyuki\'s liberation it becomes the prosperous Land of Spring.',
    },
    characterIds: ['char-koyuki'],
    importance: 'minor',
    canonStatus: 'movie',
    referenceStatus: 'verified',
    tags: ['movie', 'snow', 'castle'],
  },
];
