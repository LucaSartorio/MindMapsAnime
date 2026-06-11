import type { TimelineEvent } from '@/types';

/**
 * «Le Grandi Operazioni Spaziali di Enel»: la cover story che, dopo Skypiea,
 * segue Enel sulla Luna. È materiale canonico (disegnato da Oda nelle copertine
 * dei capitoli) e dà senso ai luoghi della sotto-mappa «Spazio».
 */
export const onepieceEventsSpace: TimelineEvent[] = [
  {
    id: 'evt-op-enel-moon',
    worldId: 'world-onepiece',
    title: { it: 'Le Grandi Operazioni Spaziali di Enel', en: "Enel's Great Space Operations" },
    description: {
      it: "Dopo la sconfitta a Skypiea, Enel raggiunge la Luna con l'arca Maxim e vi scopre l'antica città di Birka, gli automi e i propri antenati.",
      en: "After his defeat at Skypiea, Enel reaches the Moon with the Maxim ark and discovers the ancient city of Birka, the automata and his own ancestors.",
    },
    longDescription: {
      it: "Inseguendo la «Fairy Vearth», Enel vola sulla Luna. Sotto la crosta trova la città in rovina di Birka: le sue scariche elettriche risvegliano gli automi e l'intera città. Un murale gli rivela che Skypiani, Shandia e Birkani discendono dai lunari, emigrati sul Pianeta Blu quando le risorse si esaurirono. Quando i Pirati Spaziali minacciano gli automi, Enel li annienta e ne accetta la fedeltà, ergendosi a signore del suo nuovo esercito lunare.",
      en: "Chasing the 'Fairy Vearth', Enel flies to the Moon. Beneath its crust he finds the ruined city of Birka: his electric discharges reawaken the automata and the whole city. A mural reveals that the Skypieans, Shandia and Birkans descend from the lunar people, who emigrated to the Blue Planet when resources ran out. When the Space Pirates threaten the automata, Enel wipes them out and accepts their loyalty, rising as lord of his new lunar army.",
    },
    period: { it: 'Dopo Skypiea · cover story', en: 'After Skypiea · cover story' },
    arcId: 'arc-op-skypiea',
    locationId: 'loc-op-space-luna',
    characterIds: ['char-op-enel'],
    mangaChapters: ['copertine 366-489'],
    order: 17.5,
    canon: 'canon',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['spazio', 'luna', 'enel', 'birka', 'pirati-spaziali', 'cover-story'],
  },
];
