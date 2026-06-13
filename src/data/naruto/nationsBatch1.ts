import type { Nation } from '@/types';

/**
 * Nazioni Naruto · Batch 1 — Paese dei Vortici (patria Uzumaki).
 *
 * Nazione insulare distrutta prima della serie; il dataset ha già le sue
 * rovine (Uzushiogakure). La aggiungiamo come nazione a sé per coerenza
 * con l'archivio nazioni e i riferimenti al clan Uzumaki.
 */
export const narutoNationsBatch1: Nation[] = [
  {
    id: 'nation-whirlpools',
    worldId: 'world-naruto',
    name: 'Land of Whirlpools',
    localizedName: { it: 'Paese dei Vortici', en: 'Land of Whirlpools' },
    nameLocal: 'Uzu no Kuni',
    japaneseName: '渦の国',
    type: 'minor_nation',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    description: {
      it: 'Nazione insulare patria del clan Uzumaki e sede di Uzushiogakure. Maestri del fūinjutsu, gli Uzumaki furono temuti al punto da spingere più nazioni a distruggere il villaggio prima della serie.',
      en: 'Island nation, homeland of the Uzumaki clan and seat of Uzushiogakure. Masters of fūinjutsu, the Uzumaki were so feared that several nations destroyed the village before the series.',
    },
    hiddenVillageIds: ['loc-uzushio-ruins'],
    relatedLocationIds: ['loc-uzushio-ruins', 'loc-uzu-ruins-center', 'loc-uzu-sealing-shrine', 'loc-uzu-whirlpool'],
    tags: ['uzumaki', 'fuinjutsu', 'destroyed'],
  },
];
