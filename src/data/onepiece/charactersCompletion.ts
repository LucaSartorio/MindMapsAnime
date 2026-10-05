import type { Character } from '@/types';

/** Personaggi aggiunti nella revisione di completezza. */
export const onepieceCharactersCompletion: Character[] = [
  {
    id: 'char-op-morgans',
    worldId: 'world-onepiece',
    name: 'Morgans',
    aliases: ['Big News Morgans'],
    importance: 'supporting',
    role: ['neutral'],
    gender: 'male',
    shortDescription: {
      it: "Il presidente del World Economy News Paper, un uomo-albatro grazie al Frutto Avis Avis modello Albatro. Vive per lo scoop: pubblica le notizie di Rufy e della sua ciurma, e diffonde il messaggio di Vegapunk e i segreti del Governo Mondiale.",
      en: "The president of the World Economy News Paper, an albatross-man thanks to the Bird-Bird Fruit, Model: Albatross. He lives for the scoop: he publishes news about Luffy and his crew, and spreads Vegapunk's message and the World Government's secrets.",
    },
    status: 'alive',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['giornale', 'zoan'],
  },
];
