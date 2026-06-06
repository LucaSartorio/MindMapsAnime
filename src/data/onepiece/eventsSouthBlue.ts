import type { TimelineEvent } from '@/types';

/**
 * Eventi della timeline legati a South Blue (backstory del Regno di Sorbet).
 * Gli `order` li collocano fuori dalla sequenza di East Blue (1–12): la
 * ribellione decenni prima (order 0), il sacrificio di Kuma intorno alla saga
 * di Sabaody (order 50).
 */
export const onepieceEventsSouthBlue: TimelineEvent[] = [
  {
    id: 'evt-op-sorbet-rebellion',
    worldId: 'world-onepiece',
    title: { it: 'La ribellione del Regno di Sorbet', en: 'The Sorbet Kingdom rebellion' },
    description: {
      it: "Nel Regno di Sorbet, in South Blue, gli abitanti oppressi si ribellano alla tirannia. Tra loro crescono Bartholomew Kuma e l'amica Ginny, segnati da povertà e ingiustizia.",
      en: "In the Sorbet Kingdom of South Blue, the oppressed people rise against tyranny. Among them grow Bartholomew Kuma and his friend Ginny, marked by poverty and injustice.",
    },
    period: { it: 'Backstory · Regno di Sorbet', en: 'Backstory · Sorbet Kingdom' },
    arcId: 'arc-op-sorbet',
    locationId: 'loc-op-sorbet-kingdom',
    characterIds: ['char-op-kuma'],
    factionIds: ['faction-op-revolutionary-army'],
    order: 0,
    canon: 'canon',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['south-blue', 'sorbet', 'kuma'],
  },
  {
    id: 'evt-op-kuma-sacrifice',
    worldId: 'world-onepiece',
    title: { it: 'Il sacrificio di Kuma', en: "Kuma's sacrifice" },
    description: {
      it: "Per salvare la figlia adottiva Bonney, Kuma si offre come cavia del programma Pacifista di Vegapunk, accettando di perdere progressivamente memoria e volontà fino a diventare un'arma umana del Governo Mondiale.",
      en: "To save his adoptive daughter Bonney, Kuma volunteers as a test subject for Vegapunk's Pacifista programme, accepting the gradual loss of memory and will until he becomes a human weapon of the World Government.",
    },
    period: { it: 'Saga di Sabaody · pre-timeskip', en: 'Sabaody Saga · pre-timeskip' },
    arcId: 'arc-op-sorbet',
    locationId: 'loc-op-sorbet-kingdom',
    characterIds: ['char-op-kuma', 'char-op-bonney'],
    factionIds: ['faction-op-revolutionary-army', 'faction-op-world-government'],
    order: 50,
    canon: 'canon',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['south-blue', 'sorbet', 'kuma', 'pacifista'],
  },
];
