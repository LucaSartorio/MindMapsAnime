import type { StoryArc } from '@/types';

/**
 * Archi narrativi legati a West Blue: il backstory di Ohara (origine di Nico
 * Robin) e l'incidente di God Valley, entrambi rivelati in flashback.
 */
export const onepieceArcsWestBlue: StoryArc[] = [
  {
    id: 'arc-op-god-valley',
    worldId: 'world-onepiece',
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
