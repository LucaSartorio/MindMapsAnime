import type { StoryArc } from '@/types';

/**
 * Archi canonici mancanti dal primo inventario: le tre tappe d'ingresso nella
 * Rotta Maggiore (Reverse Mountain, Whisky Peak, Little Garden), il dopo-Enies
 * Lobby, il ritorno a Sabaody dopo i due anni e l'arco di Elbaf (in corso).
 */
const arc = (a: Omit<StoryArc, 'worldId' | 'canon' | 'canonStatus' | 'referenceStatus'> & Partial<Pick<StoryArc, 'referenceStatus'>>): StoryArc => ({
  worldId: 'world-onepiece',
  canon: 'canon',
  canonStatus: 'canon',
  referenceStatus: 'verified',
  ...a,
});

const ALABASTA = { it: 'Saga di Alabasta', en: 'Alabasta Saga' };

export const onepieceArcsCompletion: StoryArc[] = [
  arc({
    id: 'arc-op-reverse-mountain',
    name: 'Reverse Mountain',
    localizedName: { it: 'Reverse Mountain', en: 'Reverse Mountain' },
    saga: ALABASTA,
    period: { it: 'Ingresso nella Rotta Maggiore', en: 'Entering the Grand Line' },
    order: 7,
    description: {
      it: "La Going Merry risale la corrente di Reverse Mountain ed entra nella Rotta Maggiore, finendo nello stomaco della balena Laboon. Il guardiano del faro Crocus racconta della balena che aspetta da cinquant'anni i pirati che le promisero di tornare; Rufy le promette una rivincita.",
      en: "The Going Merry rides the current up Reverse Mountain into the Grand Line and ends up in the stomach of the whale Laboon. The lighthouse keeper Crocus tells of the whale that has waited fifty years for the pirates who promised to return; Luffy promises it a rematch.",
    },
    locationIds: ['loc-op-reverse-mountain', 'loc-op-twin-cape'],
    characterIds: ['char-op-luffy', 'char-op-laboon', 'char-op-crocus', 'char-op-vivi', 'char-op-igaram'],
    factionIds: ['faction-op-straw-hat-pirates'],
    mangaChapters: ['101-105'],
    animeEpisodes: ['61-63'],
    tags: ['grand-line', 'laboon'],
  }),
  arc({
    id: 'arc-op-whisky-peak',
    name: 'Whisky Peak',
    localizedName: { it: 'Whisky Peak', en: 'Whisky Peak' },
    saga: ALABASTA,
    period: { it: 'Rotta Maggiore · Paradiso', en: 'Grand Line · Paradise' },
    order: 8,
    description: {
      it: "La città che accoglie i pirati con feste e alcol è un covo di cacciatori di taglie della Baroque Works. Zoro li sconfigge da solo; la ciurma scopre che la «Miss Wednesday» al loro servizio è la principessa Vivi di Alabasta e accetta di scortarla a casa.",
      en: "The town that welcomes pirates with parties and drink is a nest of Baroque Works bounty hunters. Zoro beats them single-handed; the crew discovers that 'Miss Wednesday' in their service is Princess Vivi of Alabasta and agrees to escort her home.",
    },
    locationIds: ['loc-op-whisky-peak'],
    characterIds: ['char-op-zoro', 'char-op-vivi', 'char-op-igaram', 'char-op-mr-5', 'char-op-miss-valentine', 'char-op-luffy', 'char-op-robin'],
    factionIds: ['faction-op-straw-hat-pirates'],
    mangaChapters: ['106-114'],
    animeEpisodes: ['64-67'],
    tags: ['grand-line', 'baroque-works'],
  }),
  arc({
    id: 'arc-op-little-garden',
    name: 'Little Garden',
    localizedName: { it: 'Little Garden', en: 'Little Garden' },
    saga: ALABASTA,
    period: { it: 'Rotta Maggiore · Paradiso', en: 'Grand Line · Paradise' },
    order: 10,
    description: {
      it: "Un'isola preistorica dove due giganti di Elbaf, Dorry e Brogy, combattono da cento anni un duello senza vincitori. Mr. 3 e Miss Goldenweek della Baroque Works sabotano il duello e intrappolano la ciurma nella cera; Usop e Rufy liberano tutti.",
      en: "A prehistoric island where two giants from Elbaf, Dorry and Brogy, have fought a winnerless duel for a hundred years. Baroque Works's Mr. 3 and Miss Goldenweek sabotage the duel and trap the crew in wax; Usopp and Luffy free everyone.",
    },
    locationIds: ['loc-op-little-garden'],
    characterIds: ['char-op-dorry', 'char-op-brogy', 'char-op-mr-3', 'char-op-mr-5', 'char-op-miss-valentine', 'char-op-luffy', 'char-op-usopp', 'char-op-nami', 'char-op-vivi'],
    factionIds: ['faction-op-straw-hat-pirates'],
    mangaChapters: ['115-129'],
    animeEpisodes: ['70-77'],
    tags: ['grand-line', 'giganti', 'baroque-works'],
  }),
  arc({
    id: 'arc-op-post-enies-lobby',
    name: 'Post-Enies Lobby',
    localizedName: { it: 'Dopo Enies Lobby', en: 'Post-Enies Lobby' },
    saga: { it: 'Saga di Water Seven', en: 'Water Seven Saga' },
    period: { it: 'Water Seven, dopo il salvataggio di Robin', en: 'Water Seven, after Robin\'s rescue' },
    order: 23,
    description: {
      it: "A Water Seven la ciurma riposa dopo il salvataggio di Robin. Garp arriva, rivela che il padre di Rufy è il rivoluzionario Dragon, e Coby e Helmeppo ritrovano Rufy. Arrivano le nuove taglie, Franky consegna la Thousand Sunny e Usop chiede scusa per tornare nella ciurma.",
      en: "In Water Seven the crew rests after Robin's rescue. Garp arrives, reveals that Luffy's father is the revolutionary Dragon, and Coby and Helmeppo meet Luffy again. The new bounties come out, Franky delivers the Thousand Sunny and Usopp apologises to rejoin the crew.",
    },
    locationIds: ['loc-op-water-seven', 'loc-op-ws-galley-la', 'loc-op-ws-franky-house'],
    characterIds: ['char-op-luffy', 'char-op-garp', 'char-op-coby', 'char-op-helmeppo', 'char-op-franky', 'char-op-usopp', 'char-op-dragon'],
    factionIds: ['faction-op-straw-hat-pirates'],
    mangaChapters: ['431-441'],
    animeEpisodes: ['313-325'],
    tags: ['water-seven', 'taglie'],
  }),
  arc({
    id: 'arc-op-return-to-sabaody',
    name: 'Return to Sabaody',
    localizedName: { it: 'Ritorno a Sabaody', en: 'Return to Sabaody' },
    saga: { it: 'Saga di Fish-Man Island', en: 'Fish-Man Island Saga' },
    period: { it: 'Due anni dopo', en: 'Two years later' },
    order: 58,
    description: {
      it: "Due anni dopo la Guerra al Vertice i Cappello di Paglia si ritrovano a Sabaody, cresciuti e allenati ognuno da un maestro diverso. Un impostore si spaccia per Rufy, la Marina arriva con i Pacifista e Sentomaru, e la ciurma salpa verso l'Isola degli Uomini-Pesce con la Sunny rivestita.",
      en: "Two years after the Summit War the Straw Hats reunite at Sabaody, each grown and trained by a different master. An impostor poses as Luffy, the Navy arrives with the Pacifistas and Sentomaru, and the crew sets sail for Fish-Man Island with the coated Sunny.",
    },
    locationIds: ['loc-op-sabaody', 'loc-op-sb-shakky-bar', 'loc-op-sb-grove-41'],
    characterIds: ['char-op-luffy', 'char-op-zoro', 'char-op-nami', 'char-op-sanji', 'char-op-rayleigh', 'char-op-shakky', 'char-op-sentomaru'],
    factionIds: ['faction-op-straw-hat-pirates'],
    mangaChapters: ['598-602'],
    animeEpisodes: ['517-522'],
    tags: ['sabaody', 'due-anni-dopo'],
  }),
  arc({
    id: 'arc-op-elbaf',
    name: 'Elbaf',
    localizedName: { it: 'Elbaf', en: 'Elbaf' },
    saga: { it: 'Saga del Mondo Finale', en: 'Final Sea (Egghead) Saga' },
    period: { it: 'Saga finale · la terra dei giganti', en: 'Final saga · the land of the giants' },
    order: 74,
    description: {
      it: "Fuggiti da Egghead con i Pirati Giganti Guerrieri, i Cappello di Paglia raggiungono Elbaf, la terra dei giganti. Robin ritrova Jaguar D. Saul, Rufy incontra il principe incatenato Loki, ritenuto l'assassino del padre Re Harald, e i Cavalieri Sacri del Governo Mondiale arrivano per sottomettere il regno.",
      en: "Having fled Egghead with the Giant Warrior Pirates, the Straw Hats reach Elbaf, the land of the giants. Robin reunites with Jaguar D. Saul, Luffy meets the chained prince Loki, believed to have murdered his father King Harald, and the World Government's Holy Knights arrive to subjugate the kingdom.",
    },
    locationIds: ['loc-op-elbaf', 'loc-op-eb-sacred-tree', 'loc-op-eb-village'],
    characterIds: ['char-op-luffy', 'char-op-robin', 'char-op-saul', 'char-op-loki', 'char-op-harald', 'char-op-hajrudin', 'char-op-shamrock', 'char-op-gunko', 'char-op-dorry', 'char-op-brogy'],
    factionIds: ['faction-op-straw-hat-pirates'],
    mangaChapters: ['1126-'],
    referenceStatus: 'needs_verification',
    tags: ['elbaf', 'giganti', 'saga-finale'],
  }),
];
