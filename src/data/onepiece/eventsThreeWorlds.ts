import type { TimelineEvent } from '@/types';

/**
 * La traduzione dei Testi Harley di Elbaf (cap. 1138): Nico Robin rivela la
 * struttura in tre «Mondi» della storia. Evento a cui sono collegati i tre pin.
 */
export const onepieceEventsThreeWorlds: TimelineEvent[] = [
  {
    id: 'evt-op-harley-texts',
    worldId: 'world-onepiece',
    title: { it: 'I Testi Harley di Elbaf', en: 'The Harley Texts of Elbaf' },
    description: {
      it: "A Elbaf, Nico Robin traduce gli antichi Testi Harley: la storia del mondo vi è divisa in tre «Mondi», e affiora la natura ciclica delle sue catastrofi.",
      en: "On Elbaf, Nico Robin translates the ancient Harley texts: the world's history is divided into three 'Worlds', and the cyclical nature of its catastrophes surfaces.",
    },
    longDescription: {
      it: "I Testi Harley sono l'antica scrittura sacra di Elbaf, fonte originaria dei suoi miti (incluso Nika). Divisi in tre capitoli, descrivono il Primo Mondo (un'avanzatissima civiltà del fuoco infinito), il Secondo Mondo (il Secolo Vuoto, l'era di Joy Boy finita in un diluvio) e il Terzo Mondo (l'epoca attuale, il ritorno del Dio del Sole). Una profezia che pone Rufy e Imu agli estremi della guerra finale.",
      en: "The Harley texts are Elbaf's ancient sacred scripture, the original source of its myths (Nika included). Split into three chapters, they describe the First World (a hyper-advanced civilization of infinite fire), the Second World (the Void Century, Joy Boy's era ended by a flood) and the Third World (the present age, the return of the Sun God). A prophecy that sets Luffy and Imu at the opposite ends of the final war.",
    },
    period: { it: 'Saga Finale · Elbaf', en: 'Final Saga · Elbaf' },
    locationId: 'loc-op-elbaf',
    characterIds: ['char-op-robin', 'char-op-luffy', 'char-op-imu'],
    mangaChapters: ['1138'],
    order: 74,
    canon: 'canon',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['testi-harley', 'tre-mondi', 'elbaf', 'robin', 'lore'],
  },
];
