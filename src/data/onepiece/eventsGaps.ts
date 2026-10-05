import type { TimelineEvent } from '@/types';

/**
 * Eventi che coprono capitoli prima scoperti (vedi `npm run coverage:chapters`).
 * Dove la suddivisione dei capitoli è incerta i numeri sono marcati `~`.
 */
const c = 'canon' as const;
const v = 'verified' as const;
const W = 'world-onepiece';
const ev = (e: Omit<TimelineEvent, 'worldId' | 'canon' | 'canonStatus' | 'referenceStatus'>): TimelineEvent => ({
  worldId: W,
  canon: c,
  canonStatus: c,
  referenceStatus: v,
  ...e,
});

export const onepieceEventsGaps: TimelineEvent[] = [
  ev({
    id: 'evt-op-arlong-park-arrival',
    title: { it: 'Verso Arlong Park', en: 'Towards Arlong Park' },
    description: {
      it: "Inseguendo Nami, che è fuggita con la Going Merry, la ciurma raggiunge le isole di Conomi. Usop viene catturato dagli uomini-pesce e Nami sembra tradirli: è una dei Pirati di Arlong.",
      en: 'Chasing Nami, who has fled with the Going Merry, the crew reaches the Conomi Islands. Usopp is captured by the fish-men and Nami seems to betray them: she is one of the Arlong Pirates.',
    },
    period: { it: 'East Blue', en: 'East Blue' },
    arcId: 'arc-op-arlong-park', locationId: 'loc-op-arlong-park',
    characterIds: ['char-op-nami', 'char-op-usopp', 'char-op-zoro', 'char-op-arlong'],
    mangaChapters: ['~69-76'], order: 8.4, tags: ['east-blue'],
  }),
  ev({
    id: 'evt-op-drum-arrival',
    title: { it: "L'arrivo a Drum", en: 'Arrival at Drum' },
    description: {
      it: "Nami è gravemente malata. La ciurma incrocia Wapol, che divora un pezzo della Going Merry, e approda sull'isola di Drum: Rufy e Sanji si arrampicano sulla montagna per portarla dalla dottoressa Kureha.",
      en: 'Nami is gravely ill. The crew runs into Wapol, who eats a piece of the Going Merry, and lands on Drum Island: Luffy and Sanji climb the mountain to bring her to Dr. Kureha.',
    },
    period: { it: 'Paradiso · Isola di Drum', en: 'Paradise · Drum Island' },
    arcId: 'arc-op-drum', locationId: 'loc-op-drum-island',
    characterIds: ['char-op-nami', 'char-op-luffy', 'char-op-sanji', 'char-op-wapol'],
    mangaChapters: ['~130-139'], order: 12.4, tags: ['drum'],
  }),
  ev({
    id: 'evt-op-ace-nanohana',
    title: { it: 'Ace a Nanohana', en: 'Ace at Nanohana' },
    description: {
      it: "Nel porto di Nanohana, ad Alabasta, Rufy ritrova il fratello Ace, comandante della Seconda Flotta di Barbabianca, che sta dando la caccia a Barbanera. Ace ferma Smoker e affida a Rufy un pezzo della sua Vivre Card.",
      en: "In the port of Nanohana, in Alabasta, Luffy meets his brother Ace again, commander of Whitebeard's Second Division, who is hunting Blackbeard. Ace holds off Smoker and gives Luffy a piece of his Vivre Card.",
    },
    period: { it: 'Paradiso · Alabasta', en: 'Paradise · Alabasta' },
    arcId: 'arc-op-alabasta', locationId: 'loc-op-nanohana',
    characterIds: ['char-op-luffy', 'char-op-ace', 'char-op-smoker'],
    mangaChapters: ['~156-159'], order: 14.1, tags: ['alabasta', 'ace'],
  }),
  ev({
    id: 'evt-op-yuba',
    title: { it: 'Il pozzo di Yuba', en: 'The well of Yuba' },
    description: {
      it: "Nell'oasi di Yuba, sepolta dalla sabbia, il vecchio Toto scava da solo per ritrovare l'acqua. Rufy capisce che Vivi vuole salvare tutti senza perdere nessuno, e la costringe ad accettare che la battaglia avrà un prezzo.",
      en: 'In the oasis of Yuba, buried by sand, old Toto digs alone to find water again. Luffy understands that Vivi wants to save everyone without losing anyone, and forces her to accept that the fight will come at a cost.',
    },
    period: { it: 'Paradiso · Alabasta', en: 'Paradise · Alabasta' },
    arcId: 'arc-op-alabasta', locationId: 'loc-op-yuba',
    characterIds: ['char-op-luffy', 'char-op-vivi'],
    mangaChapters: ['~161-167'], order: 14.2, tags: ['alabasta'],
  }),
  ev({
    id: 'evt-op-usopp-chopper-vs-mr4',
    title: { it: 'Usop e Chopper contro Mr. 4', en: 'Usopp & Chopper vs Mr. 4' },
    description: {
      it: "Ad Alubarna Usop e Chopper affrontano Mr. 4, Miss Merry Christmas e il cane-bazooka Lassoo. Malconci, vincono grazie a un'idea di Usop e al Rumble Ball di Chopper.",
      en: 'In Alubarna Usopp and Chopper face Mr. 4, Miss Merry Christmas and the bazooka-dog Lassoo. Battered, they win thanks to an idea of Usopp\'s and Chopper\'s Rumble Ball.',
    },
    period: { it: 'Paradiso · Alabasta', en: 'Paradise · Alabasta' },
    arcId: 'arc-op-alabasta', locationId: 'loc-op-alubarna',
    characterIds: ['char-op-usopp', 'char-op-chopper', 'char-op-mr-4'],
    mangaChapters: ['~182-186'], order: 15.02, tags: ['alabasta', 'scontro'],
  }),
  ev({
    id: 'evt-op-nami-vs-doublefinger',
    title: { it: 'Nami contro Miss Doublefinger', en: 'Nami vs Miss Doublefinger' },
    description: {
      it: "Con il Clima Tact costruito da Usop, Nami impara a usarlo nel mezzo dello scontro e abbatte Miss Doublefinger con un fulmine.",
      en: 'With the Clima-Tact built by Usopp, Nami learns to use it in the middle of the fight and brings Miss Doublefinger down with a lightning bolt.',
    },
    period: { it: 'Paradiso · Alabasta', en: 'Paradise · Alabasta' },
    arcId: 'arc-op-alabasta', locationId: 'loc-op-alubarna',
    characterIds: ['char-op-nami', 'char-op-miss-doublefinger'],
    mangaChapters: ['~187-191'], order: 15.04, tags: ['alabasta', 'scontro'],
  }),
  ev({
    id: 'evt-op-zoro-vs-mr1',
    title: { it: 'Zoro contro Mr. 1', en: 'Zoro vs Mr. 1' },
    description: {
      it: "Contro Daz Bones, il cui corpo è una lama, Zoro impara a «tagliare l'acciaio» percependo il respiro delle cose, e lo sconfigge.",
      en: "Against Daz Bones, whose body is a blade, Zoro learns to 'cut steel' by sensing the breath of all things, and defeats him.",
    },
    period: { it: 'Paradiso · Alabasta', en: 'Paradise · Alabasta' },
    arcId: 'arc-op-alabasta', locationId: 'loc-op-alubarna',
    characterIds: ['char-op-zoro', 'char-op-daz-bones'],
    mangaChapters: ['~192-195'], order: 15.06, tags: ['alabasta', 'scontro'],
  }),
  ev({
    id: 'evt-op-upper-yard-ordeals',
    title: { it: "Le prove di Upper Yard", en: 'The ordeals of Upper Yard' },
    description: {
      it: "Sull'isola sacra di Upper Yard i sacerdoti di Ener tendono le loro prove: Satori sfida Rufy, Sanji e Usop nella Prova delle Sfere, mentre Gan Fall e gli Shandia combattono per la terra perduta.",
      en: "On the sacred island of Upper Yard, Enel's priests set their ordeals: Satori challenges Luffy, Sanji and Usopp in the Ordeal of Balls, while Gan Fall and the Shandia fight for their lost land.",
    },
    period: { it: 'Paradiso · Skypiea', en: 'Paradise · Skypiea' },
    arcId: 'arc-op-skypiea', locationId: 'loc-op-upper-yard',
    characterIds: ['char-op-luffy', 'char-op-sanji', 'char-op-usopp', 'char-op-satori', 'char-op-wiper'],
    mangaChapters: ['~239-255'], order: 16.5, tags: ['skypiea'],
  }),
  ev({
    id: 'evt-op-sanji-vs-wanze',
    title: { it: 'Sanji contro Wanze sul Sea Train', en: 'Sanji vs Wanze on the Sea Train' },
    description: {
      it: "Sul Puffing Tom diretto a Enies Lobby, Sanji e Franky si fanno strada fra le carrozze del governo. Sanji sconfigge l'agente Wanze e scopre perché Robin ha scelto di andarsene.",
      en: 'On the Puffing Tom bound for Enies Lobby, Sanji and Franky fight their way through the government cars. Sanji defeats the agent Wanze and learns why Robin chose to leave.',
    },
    period: { it: 'Paradiso · Water Seven', en: 'Paradise · Water Seven' },
    arcId: 'arc-op-water-seven',
    characterIds: ['char-op-sanji', 'char-op-franky', 'char-op-robin'],
    mangaChapters: ['~363-375'], order: 19.3, tags: ['water-seven', 'scontro'],
  }),
  ev({
    id: 'evt-op-luffy-meets-shirahoshi',
    title: { it: 'Rufy incontra Shirahoshi', en: 'Luffy meets Shirahoshi' },
    description: {
      it: "Nel Palazzo Ryugu, Rufy incontra Shirahoshi, la principessa-sirena gigante chiusa per dieci anni nella Torre del Guscio Duro per sfuggire a Vander Decken. Le promette di portarla a vedere la Foresta del Mare.",
      en: 'In the Ryugu Palace, Luffy meets Shirahoshi, the giant mermaid princess shut away for ten years in the Hard Shell Tower to escape Vander Decken. He promises to take her to see the Sea Forest.',
    },
    period: { it: 'Saga di Fish-Man Island', en: 'Fish-Man Island Saga' },
    arcId: 'arc-op-fishman-island', locationId: 'loc-op-fm-ryugu-palace',
    characterIds: ['char-op-luffy', 'char-op-shirahoshi'],
    mangaChapters: ['~608-616'], order: 59.3, tags: ['isola-uomini-pesce'],
  }),
];
