import type { StoryArc } from '@/types';

/**
 * Archi narrativi legati a West Blue: il backstory di Ohara (origine di Nico
 * Robin) e l'incidente di God Valley, entrambi rivelati in flashback.
 */
export const onepieceArcsWestBlue: StoryArc[] = [
  {
    id: 'arc-op-god-valley',
    worldId: 'world-onepiece',
    mangaChapters: ["957", "1095-1096"],
    animeEpisodes: ["958-959"],
    longDescription: {
      it: "Evento cancellato dalla storia ufficiale e narrato per frammenti: 38 anni prima, sull'isola di God Valley in West Blue, si tenne il crudele gioco di caccia dei Draghi Celesti. Lì il giovane Gol D. Roger e il viceammiraglio Garp strinsero un'alleanza irripetibile e annientarono i Pirati di Rocks di Rocks D. Xebec — la ciurma che riuniva i futuri Imperatori Barbabianca, Big Mom e Kaido. La sparizione dell'isola e la verità sui Draghi Celesti restano tra i segreti meglio custoditi del mondo.",
      en: "An event erased from official history, told only in fragments: 38 years ago, on God Valley island in West Blue, the Celestial Dragons held their cruel hunting game. There the young Gol D. Roger and Vice Admiral Garp formed a one-time alliance and annihilated Rocks D. Xebec's Rocks Pirates — the crew that gathered the future Emperors Whitebeard, Big Mom and Kaido. The island's disappearance and the truth about the Celestial Dragons remain among the world's best-kept secrets.",
    },
    name: 'God Valley Incident',
    localizedName: { it: "L'incidente di God Valley", en: 'God Valley Incident' },
    saga: { it: 'Backstory · West Blue', en: 'Backstory · West Blue' },
    period: { it: '38 anni prima della storia', en: '38 years before the story' },
    order: 0,
    description: {
      it: "Sull'isola di God Valley, in West Blue, l'alleanza inedita tra il futuro Re dei Pirati Gol D. Roger e il marine Garp annienta i Pirati di Rocks di Xebec, evento cancellato dalla storia ufficiale.",
      en: "On God Valley island in West Blue, the unprecedented alliance of the future Pirate King Gol D. Roger and the Marine Garp annihilates Xebec's Rocks Pirates — an event erased from official history.",
    },
    locationIds: ['loc-op-god-valley'],
    nationIds: ['nation-op-west-blue'],
    characterIds: ['char-op-rocks', 'char-op-garp'],
    factionIds: ['faction-op-rocks-pirates'],
    eventIds: ['evt-op-god-valley-incident'],
    canon: 'canon',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['west-blue', 'god-valley', 'rocks', 'flashback'],
  },
  {
    id: 'arc-op-ohara',
    worldId: 'world-onepiece',
    mangaChapters: ["391-398"],
    animeEpisodes: ["274-278"],
    longDescription: {
      it: "Il flashback di Enies Lobby racconta la fine di Ohara, l'isola degli studiosi in West Blue. Avendo decifrato i Poneglyph e sfiorato la verità del Secolo Vuoto, gli archeologi guidati dal professor Clover sono dichiarati nemici del mondo. Il Governo Mondiale scatena un Buster Call che incenerisce l'isola e la sua biblioteca, l'Albero della Conoscenza. L'archeologa Nico Olvia e il gigante Jaguar D. Saul si sacrificano per salvare la piccola Nico Robin, unica sopravvissuta, che eredita la capacità di leggere i Poneglyph e una taglia da bambina.",
      en: "The Enies Lobby flashback tells of the end of Ohara, the scholars' island in West Blue. Having deciphered the Poneglyphs and brushed the truth of the Void Century, the archaeologists led by Professor Clover are branded enemies of the world. The World Government unleashes a Buster Call that incinerates the island and its library, the Tree of Knowledge. The archaeologist Nico Olvia and the giant Jaguar D. Saul sacrifice themselves to save little Nico Robin, the sole survivor, who inherits the ability to read Poneglyphs and a bounty as a child.",
    },
    name: 'Ohara & the Buster Call',
    localizedName: { it: 'Ohara e il Buster Call', en: 'Ohara & the Buster Call' },
    saga: { it: 'Backstory · West Blue', en: 'Backstory · West Blue' },
    period: { it: '22 anni prima della storia', en: '22 years before the story' },
    order: 0,
    description: {
      it: "La distruzione di Ohara: per aver decifrato i Poneglyph e il Secolo Vuoto, il Governo Mondiale scatena un Buster Call che rade al suolo l'isola degli studiosi. Sopravvive solo la piccola Nico Robin, salvata dal gigante Saul.",
      en: "The destruction of Ohara: for deciphering the Poneglyphs and the Void Century, the World Government unleashes a Buster Call that razes the scholars' island. Only young Nico Robin survives, saved by the giant Saul.",
    },
    locationIds: ['loc-op-ohara'],
    nationIds: ['nation-op-west-blue'],
    characterIds: ['char-op-robin', 'char-op-olvia', 'char-op-clover', 'char-op-saul'],
    factionIds: ['faction-op-ohara-scholars', 'faction-op-world-government'],
    eventIds: ['evt-op-ohara-buster-call'],
    canon: 'canon',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['west-blue', 'ohara', 'robin', 'buster-call', 'flashback'],
  },
];
