import type { TimelineEvent } from '@/types';

/**
 * Eventi della timeline legati a West Blue (God Valley e Ohara).
 * `order` negativo: precedono la sequenza di East Blue (1–12) di decenni.
 */
export const onepieceEventsWestBlue: TimelineEvent[] = [
  {
    id: 'evt-op-god-valley-incident',
    worldId: 'world-onepiece',
    mangaChapters: ["1095-1096"],
    animeEpisodes: ["958-959"],
    title: { it: "L'incidente di God Valley", en: 'The God Valley Incident' },
    description: {
      it: "38 anni prima della storia, sull'isola di God Valley, Gol D. Roger e il marine Garp si alleano per la prima e unica volta e annientano i Pirati di Rocks, ponendo fine all'ascesa di Rocks D. Xebec.",
      en: "38 years before the story, on God Valley island, Gol D. Roger and the Marine Garp ally for the only time to annihilate the Rocks Pirates, ending the rise of Rocks D. Xebec.",
    },
    period: { it: 'Backstory · 38 anni prima', en: 'Backstory · 38 years before' },
    arcId: 'arc-op-god-valley',
    locationId: 'loc-op-god-valley',
    characterIds: ['char-op-rocks', 'char-op-garp'],
    factionIds: ['faction-op-rocks-pirates'],
    order: -10,
    canon: 'canon',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['west-blue', 'god-valley', 'rocks', 'garp'],
  },
  {
    id: 'evt-op-ohara-buster-call',
    worldId: 'world-onepiece',
    mangaChapters: ["391-398"],
    animeEpisodes: ["274-278"],
    title: { it: 'Il Buster Call su Ohara', en: 'The Buster Call on Ohara' },
    description: {
      it: "22 anni prima della storia il Governo Mondiale rade al suolo Ohara con un Buster Call, per impedire che gli studiosi rivelino la verità del Secolo Vuoto. Muoiono tutti gli archeologi; sopravvive solo Nico Robin, salvata dal gigante Saul.",
      en: "22 years before the story the World Government razes Ohara with a Buster Call to stop its scholars from revealing the truth of the Void Century. Every archaeologist dies; only Nico Robin survives, saved by the giant Saul.",
    },
    period: { it: 'Backstory · 22 anni prima', en: 'Backstory · 22 years before' },
    arcId: 'arc-op-ohara',
    locationId: 'loc-op-ohara',
    characterIds: ['char-op-robin', 'char-op-olvia', 'char-op-clover', 'char-op-saul'],
    factionIds: ['faction-op-world-government', 'faction-op-ohara-scholars'],
    order: -8,
    canon: 'canon',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['west-blue', 'ohara', 'robin', 'buster-call'],
  },
];
