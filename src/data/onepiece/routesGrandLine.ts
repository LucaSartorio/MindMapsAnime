import type { Route } from '@/types';

/**
 * Percorsi della Grand Line — il viaggio dei Cappello di Paglia oltre East Blue,
 * ispirato alla rotta canonica disegnata sulle mappe del mondo. Tre segmenti:
 * Paradise (Reverse Mountain → Sabaody), la deviazione di Rufy per la Guerra al
 * Vertice, e il New World (da Fish-Man Island in poi).
 *
 * I protagonisti elencati sono i membri della ciurma già presenti nel dataset;
 * gli altri (Chopper, Franky, Brook) si aggiungeranno con le rispettive saghe.
 */
const CREW = [
  'char-op-luffy',
  'char-op-zoro',
  'char-op-nami',
  'char-op-usopp',
  'char-op-sanji',
  'char-op-chopper',
  'char-op-robin',
  'char-op-franky',
  'char-op-brook',
];

export const onepieceRoutesGrandLine: Route[] = [
  {
    id: 'route-op-paradise',
    worldId: 'world-onepiece',
    type: 'narrative',
    name: 'Paradise — la prima metà della Grand Line',
    localizedName: {
      it: 'Paradise — la prima metà della Grand Line',
      en: 'Paradise — the first half of the Grand Line',
    },
    description: {
      it: "Il viaggio della ciurma da Reverse Mountain fino all'Arcipelago Sabaody, attraverso le isole di Paradise: Whisky Peak, Little Garden, Drum, Alabasta, Jaya, Skypiea, Water Seven, Enies Lobby e Thriller Bark.",
      en: "The crew's voyage from Reverse Mountain to the Sabaody Archipelago, across the islands of Paradise: Whisky Peak, Little Garden, Drum, Alabasta, Jaya, Skypiea, Water Seven, Enies Lobby and Thriller Bark.",
    },
    protagonistCharacterIds: CREW,
    color: '#3fbf8f',
    lineStyle: 'solid',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['paradise', 'grand-line', 'cappello-di-paglia'],
    steps: [
      { order: 1, locationId: 'loc-op-reverse-mountain', title: { it: 'Reverse Mountain', en: 'Reverse Mountain' } },
      { order: 2, locationId: 'loc-op-whisky-peak', title: { it: 'Whisky Peak', en: 'Whisky Peak' } },
      { order: 3, locationId: 'loc-op-little-garden', title: { it: 'Little Garden', en: 'Little Garden' } },
      { order: 4, locationId: 'loc-op-drum-island', title: { it: 'Drum Island — Chopper', en: 'Drum Island — Chopper' } },
      { order: 5, locationId: 'loc-op-alabasta', arcId: 'arc-op-sabaody', title: { it: 'Alabasta — Vivi', en: 'Alabasta — Vivi' } },
      { order: 6, locationId: 'loc-op-long-ring-long-land', title: { it: 'Long Ring Long Land', en: 'Long Ring Long Land' } },
      { order: 7, locationId: 'loc-op-jaya', title: { it: 'Jaya', en: 'Jaya' } },
      { order: 8, locationId: 'loc-op-skypiea', title: { it: 'Skypiea', en: 'Skypiea' } },
      { order: 9, locationId: 'loc-op-water-seven', title: { it: 'Water Seven — Franky', en: 'Water Seven — Franky' } },
      { order: 10, locationId: 'loc-op-enies-lobby', title: { it: 'Enies Lobby — Robin', en: 'Enies Lobby — Robin' } },
      { order: 11, locationId: 'loc-op-thriller-bark', title: { it: 'Thriller Bark — Brook', en: 'Thriller Bark — Brook' } },
      { order: 12, locationId: 'loc-op-sabaody', arcId: 'arc-op-sabaody', eventId: 'evt-op-sabaody-scatter', title: { it: 'Sabaody — la dispersione', en: 'Sabaody — the scattering' } },
    ],
  },
  {
    id: 'route-op-war-detour',
    worldId: 'world-onepiece',
    type: 'character',
    name: 'Rufy — la corsa per salvare Ace',
    localizedName: {
      it: 'Rufy — la corsa per salvare Ace',
      en: "Luffy — the race to save Ace",
    },
    description: {
      it: "La deviazione di Rufy durante la separazione: scaraventato ad Amazon Lily, irrompe a Impel Down e si getta nella Guerra al Vertice di Marineford per salvare il fratello Ace.",
      en: "Luffy's detour during the separation: flung to Amazon Lily, he breaks into Impel Down and throws himself into the Marineford Summit War to save his brother Ace.",
    },
    protagonistCharacterIds: ['char-op-luffy'],
    relatedCharacterIds: ['char-op-hancock', 'char-op-jinbe', 'char-op-ivankov', 'char-op-ace'],
    color: '#e23b3b',
    lineStyle: 'dashed',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['marineford', 'guerra-al-vertice', 'rufy'],
    steps: [
      { order: 1, locationId: 'loc-op-sabaody', title: { it: 'Sabaody', en: 'Sabaody' } },
      { order: 2, locationId: 'loc-op-amazon-lily', arcId: 'arc-op-amazon-lily', eventId: 'evt-op-luffy-amazon', title: { it: 'Amazon Lily — Hancock', en: 'Amazon Lily — Hancock' } },
      { order: 3, locationId: 'loc-op-impel-down', arcId: 'arc-op-impel-down', eventId: 'evt-op-impel-breakout', title: { it: 'Impel Down — evasione', en: 'Impel Down — breakout' } },
      { order: 4, locationId: 'loc-op-marineford', arcId: 'arc-op-marineford', eventId: 'evt-op-marineford-war', title: { it: 'Marineford — la Guerra al Vertice', en: 'Marineford — the Summit War' } },
    ],
  },
  {
    id: 'route-op-newworld',
    worldId: 'world-onepiece',
    type: 'narrative',
    name: 'New World — la seconda metà della Grand Line',
    localizedName: {
      it: 'New World — la seconda metà della Grand Line',
      en: 'New World — the second half of the Grand Line',
    },
    description: {
      it: "Il viaggio della ciurma nel New World, da Fish-Man Island in poi: Punk Hazard, Dressrosa, Zou, Whole Cake Island e Wano, verso il traguardo finale di Laugh Tale.",
      en: "The crew's voyage in the New World, from Fish-Man Island onward: Punk Hazard, Dressrosa, Zou, Whole Cake Island and Wano, toward the final goal of Laugh Tale.",
    },
    protagonistCharacterIds: [...CREW, 'char-op-jinbe'],
    color: '#9e2b8f',
    lineStyle: 'solid',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['new-world', 'grand-line', 'cappello-di-paglia'],
    steps: [
      { order: 1, locationId: 'loc-op-fishman-island', arcId: 'arc-op-fishman-island', eventId: 'evt-op-fishman-island', title: { it: 'Fish-Man Island', en: 'Fish-Man Island' } },
      { order: 2, locationId: 'loc-op-punk-hazard', title: { it: 'Punk Hazard', en: 'Punk Hazard' } },
      { order: 3, locationId: 'loc-op-dressrosa', title: { it: 'Dressrosa — Doflamingo', en: 'Dressrosa — Doflamingo' } },
      { order: 4, locationId: 'loc-op-zou', title: { it: 'Zou', en: 'Zou' } },
      { order: 5, locationId: 'loc-op-whole-cake-island', title: { it: 'Whole Cake Island — Big Mom', en: 'Whole Cake Island — Big Mom' } },
      { order: 6, locationId: 'loc-op-wano', title: { it: 'Wano — Kaido', en: 'Wano — Kaido' } },
    ],
  },
];
