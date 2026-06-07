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
    longDescription: {
      it: "Nel Regno di Sorbet, in South Blue, i poveri sono oppressi da nobili crudeli. Tra loro crescono Bartholomew Kuma e l'amica Ginny, segnati dall'ingiustizia: la rivolta che ne nasce e l'incontro con l'Armata Rivoluzionaria di Dragon plasmeranno il destino di entrambi.",
      en: "In the Sorbet Kingdom of South Blue, the poor are crushed by cruel nobles. Among them grow Bartholomew Kuma and his friend Ginny, marked by injustice: the uprising that follows and the encounter with Dragon's Revolutionary Army will shape both their fates.",
    },
    mangaChapters: ["1094-1096"],
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
    longDescription: {
      it: "Quando la figlia adottiva Bonney si ammala dello stesso male di Ginny, Kuma accetta di diventare cavia del programma Pacifista di Vegapunk: in cambio delle cure per la bambina, perde progressivamente corpo, memoria e volontà, finché del «Tiranno» non resta che un'arma del Governo Mondiale.",
      en: "When his adoptive daughter Bonney falls ill with the same affliction as Ginny, Kuma agrees to become a test subject for Vegapunk's Pacifista programme: in exchange for the child's cure, he gradually loses body, memory and will, until nothing of the 'Tyrant' remains but a World Government weapon.",
    },
    mangaChapters: ["1097-1102"],
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
