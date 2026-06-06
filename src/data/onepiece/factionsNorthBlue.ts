import type { Faction } from '@/types';

/** Ciurme e fazioni legate a North Blue. */
export const onepieceFactionsNorthBlue: Faction[] = [
  {
    id: 'faction-op-donquixote-pirates',
    worldId: 'world-onepiece',
    type: 'crew',
    name: 'Donquixote Pirates',
    localizedName: { it: 'Pirati di Donquijote', en: 'Donquixote Pirates' },
    description: {
      it: "La ciurma di Donquijote Doflamingo, nata in North Blue dai resti della famiglia di Draghi Celesti decaduti. Da qui Doflamingo costruì l'impero criminale di «Joker» che culminerà a Dressrosa.",
      en: "Donquixote Doflamingo's crew, born in North Blue from the remnants of a fallen Celestial Dragon family. From here Doflamingo built the 'Joker' criminal empire that would culminate in Dressrosa.",
    },
    leaderIds: ['char-op-doflamingo'],
    characterIds: ['char-op-doflamingo', 'char-op-corazon'],
    locationIds: ['loc-op-minion-island', 'loc-op-dressrosa'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['ciurma', 'donquijote', 'north-blue'],
  },
  {
    id: 'faction-op-heart-pirates',
    worldId: 'world-onepiece',
    type: 'crew',
    name: 'Heart Pirates',
    localizedName: { it: 'Pirati di Heart', en: 'Heart Pirates' },
    description: {
      it: "La ciurma di Trafalgar Law, una delle Undici Supernove apparse a Sabaody. Riconoscibile dal sommergibile giallo, diventa alleata dei Cappello di Paglia nel New World.",
      en: "Trafalgar Law's crew, one of the Eleven Supernovas who appeared at Sabaody. Recognisable by its yellow submarine, it becomes an ally of the Straw Hats in the New World.",
    },
    leaderIds: ['char-op-law'],
    characterIds: ['char-op-law'],
    nationId: 'nation-op-north-blue',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['ciurma', 'peggiore-generazione', 'north-blue'],
  },
];
