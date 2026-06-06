import type { Faction } from '@/types';

/** Ciurme e fazioni legate a South Blue. */
export const onepieceFactionsSouthBlue: Faction[] = [
  {
    id: 'faction-op-bonney-pirates',
    worldId: 'world-onepiece',
    type: 'crew',
    name: 'Bonney Pirates',
    localizedName: { it: 'Pirati di Bonney', en: 'Bonney Pirates' },
    description: {
      it: "La ciurma di Jewelry Bonney, una delle Undici Supernove della Peggiore Generazione apparse a Sabaody. Originaria del Regno di Sorbet in South Blue.",
      en: "Jewelry Bonney's crew, one of the Eleven Supernovas of the Worst Generation who appeared at Sabaody. Hailing from the Sorbet Kingdom in South Blue.",
    },
    leaderIds: ['char-op-bonney'],
    characterIds: ['char-op-bonney'],
    locationIds: ['loc-op-sorbet-kingdom'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['ciurma', 'peggiore-generazione', 'south-blue'],
  },
];
