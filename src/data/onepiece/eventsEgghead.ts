import type { TimelineEvent } from '@/types';

/** Eventi della timeline della saga di Egghead. */
export const onepieceEventsEgghead: TimelineEvent[] = [
  {
    id: 'evt-op-egghead-attack',
    worldId: 'world-onepiece',
    mangaChapters: ["1093-1110"],
    animeEpisodes: ["1110-1122"],
    title: { it: "L'assalto a Egghead", en: 'The assault on Egghead' },
    description: {
      it: "Per zittire Vegapunk e i suoi segreti, il Governo Mondiale invia a Egghead l'ammiraglio Kizaru, la CP0 e l'Astro Saturn con le armi Seraphim. La ciurma e gli alleati resistono in una battaglia che intreccia scienza, tradimenti e i destini di Kuma e Bonney.",
      en: "To silence Vegapunk and his secrets, the World Government sends Admiral Kizaru, CP0 and the Elder Saturn with the Seraphim weapons to Egghead. The crew and allies hold out in a battle weaving science, betrayals and the fates of Kuma and Bonney.",
    },
    period: { it: 'New World · Egghead', en: 'New World · Egghead' },
    arcId: 'arc-op-egghead',
    locationId: 'loc-op-egghead',
    characterIds: ['char-op-luffy', 'char-op-saturn', 'char-op-kizaru', 'char-op-vegapunk', 'char-op-bonney', 'char-op-kuma'],
    factionIds: ['faction-op-five-elders', 'faction-op-marines', 'faction-op-straw-hat-pirates'],
    order: 72,
    canon: 'canon',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['egghead', 'cinque-astri', 'kizaru'],
  },
  {
    id: 'evt-op-vegapunk-message',
    worldId: 'world-onepiece',
    mangaChapters: ["1113-1116"],
    title: { it: 'Il messaggio di Vegapunk', en: "Vegapunk's message" },
    description: {
      it: "In punto di morte, Vegapunk avvia una trasmissione globale destinata a rivelare al mondo intero la verità nascosta dal Governo Mondiale, scuotendo alle fondamenta l'ordine costituito alla soglia del capitolo finale.",
      en: "On the brink of death, Vegapunk triggers a worldwide broadcast meant to reveal to the entire world the truth hidden by the World Government, shaking the established order to its foundations on the threshold of the final chapter.",
    },
    period: { it: 'New World · Egghead', en: 'New World · Egghead' },
    arcId: 'arc-op-egghead',
    locationId: 'loc-op-egghead',
    characterIds: ['char-op-vegapunk', 'char-op-saturn'],
    factionIds: ['faction-op-world-government'],
    order: 73,
    canon: 'canon',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['egghead', 'vegapunk', 'governo-mondiale'],
  },
];
