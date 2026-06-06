import type { StoryArc } from '@/types';

/** Arco narrativo della saga di Egghead. */
export const onepieceArcsEgghead: StoryArc[] = [
  {
    id: 'arc-op-egghead',
    worldId: 'world-onepiece',
    name: 'Egghead',
    localizedName: { it: 'Egghead', en: 'Egghead' },
    saga: { it: 'Saga del Mondo Finale', en: 'Final Sea (Egghead) Saga' },
    period: { it: "New World · isola del futuro", en: 'New World · island of the future' },
    order: 72,
    description: {
      it: "Sull'isola-laboratorio di Vegapunk la ciurma scopre verità sconvolgenti sul Secolo Vuoto e su Joy Boy. Il Governo Mondiale scatena un attacco con i Cinque Astri, l'ammiraglio Kizaru e i Seraphim; tra tradimenti e sacrifici, il mondo si avvia verso il suo capitolo finale.",
      en: "On Vegapunk's laboratory island the crew uncovers shattering truths about the Void Century and Joy Boy. The World Government unleashes an assault with the Five Elders, Admiral Kizaru and the Seraphim; amid betrayals and sacrifices, the world heads toward its final chapter.",
    },
    locationIds: ['loc-op-egghead'],
    nationIds: ['nation-op-grand-line-new-world'],
    characterIds: ['char-op-luffy', 'char-op-vegapunk', 'char-op-saturn', 'char-op-kizaru', 'char-op-stussy', 'char-op-york', 'char-op-bonney', 'char-op-kuma'],
    factionIds: ['faction-op-straw-hat-pirates', 'faction-op-five-elders', 'faction-op-cp0', 'faction-op-marines', 'faction-op-world-government'],
    eventIds: ['evt-op-egghead-attack', 'evt-op-vegapunk-message'],
    canon: 'canon',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['new-world', 'egghead', 'vegapunk', 'cinque-astri'],
  },
];
