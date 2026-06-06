import type { StoryArc } from '@/types';

/**
 * Archi narrativi legati a North Blue: il backstory di Flevance e dell'infanzia
 * di Trafalgar Law (rivelato nei flashback della saga di Dressrosa).
 */
export const onepieceArcsNorthBlue: StoryArc[] = [
  {
    id: 'arc-op-flevance',
    worldId: 'world-onepiece',
    name: "Flevance & Law's childhood",
    localizedName: { it: "Flevance e l'infanzia di Law", en: "Flevance & Law's childhood" },
    saga: { it: 'Backstory · North Blue', en: 'Backstory · North Blue' },
    period: { it: 'Circa 13 anni prima della storia', en: 'About 13 years before the story' },
    order: 0,
    description: {
      it: "La distruzione di Flevance, la «Città Bianca» sterminata per il Saturnismo del Piombo Ambrato, e la fuga del giovane Law. Raccolto dalla famiglia Donquijote, viene poi salvato da Corazon, che gli dona il Frutto Ope Ope al prezzo della propria vita.",
      en: "The destruction of Flevance, the 'White City' wiped out over Amber Lead poisoning, and young Law's escape. Taken in by the Donquixote family, he is saved by Corazon, who gives him the Ope Ope Fruit at the cost of his own life.",
    },
    locationIds: ['loc-op-flevance', 'loc-op-minion-island', 'loc-op-white-city'],
    nationIds: ['nation-op-north-blue'],
    characterIds: ['char-op-law', 'char-op-doflamingo', 'char-op-corazon'],
    factionIds: ['faction-op-donquixote-pirates', 'faction-op-heart-pirates'],
    eventIds: ['evt-op-flevance-tragedy', 'evt-op-law-ope-ope'],
    canon: 'canon',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['north-blue', 'flevance', 'law', 'donquijote', 'flashback'],
  },
];
