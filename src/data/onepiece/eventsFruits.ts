import type { TimelineEvent } from '@/types';

/**
 * Frutti del Diavolo mangiati: il tag `frutto-del-diavolo` (anche su eventi già
 * presenti: Rufy a Foosha, Law a Minion, Sabo al Colosseo, Barbanera) accende i
 * luoghi con il filtro «Evidenzia dove sono stati mangiati i Frutti del Diavolo».
 */
const c = 'canon' as const;
const v = 'verified' as const;
const W = 'world-onepiece';

export const onepieceEventsFruits: TimelineEvent[] = [
  {
    id: 'evt-op-robin-hana-hana', worldId: W,
    title: { it: 'Robin mangia il Frutto Fior Fior', en: 'Robin eats the Flower-Flower Fruit' },
    description: {
      it: "Da bambina, a Ohara, Nico Robin mangia il Frutto Fior Fior, che le permette di far sbocciare parti del proprio corpo su qualunque superficie. Gli abitanti del villaggio la temono per questo, mentre gli studiosi dell'Albero della Conoscenza la accolgono.",
      en: 'As a child on Ohara, Nico Robin eats the Flower-Flower Fruit, which lets her sprout copies of her body parts on any surface. The villagers fear her for it, while the scholars of the Tree of Knowledge take her in.',
    },
    period: { it: 'Backstory · 22 anni prima', en: 'Backstory · 22 years before' },
    arcId: 'arc-op-ohara', locationId: 'loc-op-ohara',
    characterIds: ['char-op-robin'],
    mangaChapters: ['392'],
    order: -8.5, canon: c, canonStatus: c, referenceStatus: v, tags: ['frutto-del-diavolo', 'ohara'],
  },
  {
    id: 'evt-op-chopper-hito-hito', worldId: W,
    title: { it: 'Chopper mangia il Frutto Homo Homo', en: 'Chopper eats the Human-Human Fruit' },
    description: {
      it: "Sull'isola di Drum una giovane renna dal naso blu, scacciata dal branco, mangia il Frutto Homo Homo e acquista intelligenza e forma umana. Né renne né uomini lo accettano, finché non lo accoglie il dottor Hiluluk.",
      en: 'On Drum Island a young blue-nosed reindeer, cast out by its herd, eats the Human-Human Fruit and gains intelligence and a human form. Neither reindeer nor humans accept him, until Dr. Hiluluk takes him in.',
    },
    period: { it: 'Paradise · Drum Island', en: 'Paradise · Drum Island' },
    arcId: 'arc-op-drum', locationId: 'loc-op-drum-island',
    characterIds: ['char-op-chopper'],
    mangaChapters: ['142'],
    order: 12.8, canon: c, canonStatus: c, referenceStatus: v, tags: ['frutto-del-diavolo', 'drum'],
  },
];
