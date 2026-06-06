import type { StoryArc } from '@/types';

/** Archi narrativi del New World: Punk Hazard e Dressrosa. */
export const onepieceArcsNewWorldSagas: StoryArc[] = [
  {
    id: 'arc-op-punk-hazard',
    worldId: 'world-onepiece',
    name: 'Punk Hazard',
    localizedName: { it: 'Punk Hazard', en: 'Punk Hazard' },
    saga: { it: 'Saga di Dressrosa', en: 'Dressrosa Saga' },
    period: { it: 'New World · isola di fuoco e ghiaccio', en: 'New World · fire-and-ice island' },
    order: 62,
    description: {
      it: "Sull'isola spaccata tra fuoco e ghiaccio la ciurma scopre gli esperimenti di Caesar Clown e stringe un'alleanza con Trafalgar Law per abbattere l'Imperatore Kaido. Catturato Caesar, si punta a Dressrosa per colpire Joker.",
      en: "On the island split between fire and ice the crew uncovers Caesar Clown's experiments and forges an alliance with Trafalgar Law to topple the Emperor Kaido. With Caesar captured, they head for Dressrosa to strike at Joker.",
    },
    locationIds: ['loc-op-punk-hazard'],
    nationIds: ['nation-op-grand-line-new-world'],
    characterIds: ['char-op-luffy', 'char-op-law', 'char-op-caesar', 'char-op-smoker', 'char-op-tashigi', 'char-op-chopper'],
    factionIds: ['faction-op-straw-hat-pirates', 'faction-op-heart-pirates', 'faction-op-donquixote-pirates', 'faction-op-marines'],
    eventIds: ['evt-op-ph-alliance'],
    canon: 'canon',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['new-world', 'punk-hazard', 'law', 'caesar'],
  },
  {
    id: 'arc-op-dressrosa',
    worldId: 'world-onepiece',
    name: 'Dressrosa',
    localizedName: { it: 'Dressrosa', en: 'Dressrosa' },
    saga: { it: 'Saga di Dressrosa', en: 'Dressrosa Saga' },
    period: { it: 'New World · regno dei giocattoli', en: 'New World · kingdom of toys' },
    order: 64,
    description: {
      it: "L'alleanza affronta il Corsaro Donquijote Doflamingo nel suo regno di giocattoli e gladiatori. Tra la famiglia Riku, i nani Tontatta e l'arrivo di Sabo, Rufy abbatte Doflamingo, libera Dressrosa e scuote l'equilibrio del Nuovo Mondo.",
      en: "The alliance confronts the Warlord Donquixote Doflamingo in his kingdom of toys and gladiators. Amid the Riku family, the Tontatta dwarves and Sabo's arrival, Luffy strikes down Doflamingo, frees Dressrosa and shakes the New World's balance.",
    },
    locationIds: ['loc-op-dressrosa', 'loc-op-green-bit'],
    nationIds: ['nation-op-grand-line-new-world'],
    characterIds: ['char-op-luffy', 'char-op-law', 'char-op-doflamingo', 'char-op-sabo', 'char-op-rebecca', 'char-op-kyros', 'char-op-trebol', 'char-op-pica', 'char-op-diamante', 'char-op-zoro'],
    factionIds: ['faction-op-straw-hat-pirates', 'faction-op-heart-pirates', 'faction-op-donquixote-pirates', 'faction-op-revolutionary-army'],
    eventIds: ['evt-op-doflamingo-defeat', 'evt-op-sabo-mera-mera'],
    canon: 'canon',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['new-world', 'dressrosa', 'doflamingo', 'sabo'],
  },
];
