import type { StoryArc } from '@/types';

/** Arco narrativo della saga di Egghead. */
export const onepieceArcsEgghead: StoryArc[] = [
  {
    id: 'arc-op-egghead',
    worldId: 'world-onepiece',
    mangaChapters: ["1058-1125"],
    animeEpisodes: ["1086-1122"],
    longDescription: {
      it: "Sull'isola del futuro la ciurma incontra i sei satelliti del dottor Vegapunk e scopre verità sconvolgenti: il vero nome del Frutto di Rufy (Hito Hito no Mi, modello Nika), la storia di Kuma e dei giganti del Regno di Sorbet, l'eredità di Ohara e la profezia di Joy Boy. Il Governo Mondiale ordina di cancellare Vegapunk: arrivano la CP0, l'ammiraglio Kizaru, l'Astro Saturn e le armi Seraphim. Tra la corsa al Labo-Phase, il sacrificio dei cloni e la rotta finale di Kuma, Vegapunk avvia un messaggio in mondovisione destinato a rivelare la verità nascosta del mondo, alla soglia del capitolo finale.",
      en: "On the island of the future the crew meets Dr. Vegapunk's six satellites and uncovers staggering truths: the true name of Luffy's fruit (Hito Hito no Mi, Model Nika), the story of Kuma and the giants of the Sorbet Kingdom, the legacy of Ohara and the prophecy of Joy Boy. The World Government orders Vegapunk erased: CP0, Admiral Kizaru, Elder Saturn and the Seraphim weapons arrive. Amid the race to the Labo-Phase, the sacrifice of the clones and Kuma's final ride, Vegapunk triggers a worldwide broadcast meant to reveal the world's hidden truth, on the threshold of the final saga.",
    },
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
    eventIds: ['evt-op-egghead-attack', 'evt-op-vegapunk-message', 'evt-op-egg-satellites', 'evt-op-egg-kuma-bonney', 'evt-op-egg-kizaru-saturn'],
    canon: 'canon',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['new-world', 'egghead', 'vegapunk', 'cinque-astri'],
  },
];
