import type { StoryArc } from '@/types';

/**
 * Archi narrativi legati a South Blue. A differenza di East Blue, South Blue non
 * ha una saga "in tempo reale": il suo filone principale è il backstory del
 * Regno di Sorbet (Kuma e Bonney), rivelato nei flashback della saga di Egghead.
 */
export const onepieceArcsSouthBlue: StoryArc[] = [
  {
    id: 'arc-op-sorbet',
    worldId: 'world-onepiece',
    name: 'Sorbet Kingdom (flashback)',
    localizedName: { it: 'Il Regno di Sorbet (flashback)', en: 'Sorbet Kingdom (flashback)' },
    saga: { it: 'Backstory · South Blue', en: 'Backstory · South Blue' },
    period: { it: 'Decenni prima della storia', en: 'Decades before the story' },
    order: 0,
    description: {
      it: "Il backstory del Regno di Sorbet in South Blue: la ribellione contro la tirannia, l'amicizia tra Kuma e Ginny, la nascita di Bonney e il lungo sacrificio di Kuma per salvarla, fino a diventare un Pacifista privo di volontà.",
      en: "The backstory of the Sorbet Kingdom in South Blue: the rebellion against tyranny, the friendship of Kuma and Ginny, the birth of Bonney and Kuma's long sacrifice to save her, up to becoming a will-less Pacifista.",
    },
    locationIds: ['loc-op-sorbet-kingdom'],
    nationIds: ['nation-op-south-blue'],
    characterIds: ['char-op-kuma', 'char-op-bonney'],
    factionIds: ['faction-op-revolutionary-army', 'faction-op-bonney-pirates'],
    eventIds: ['evt-op-sorbet-rebellion', 'evt-op-kuma-sacrifice'],
    canon: 'canon',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['south-blue', 'sorbet', 'kuma', 'bonney', 'flashback'],
  },
];
