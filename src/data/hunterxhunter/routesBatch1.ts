import type { Route } from '@/types';

/**
 * Percorsi narrativi di Hunter x Hunter — batch 1 (espansione).
 *
 * Tracciati sui luoghi del Mondo Conosciuto nell'ordine in cui la storia li
 * tocca. Ogni step usa `locationId` ed `eventId` già esistenti nel dataset
 * (vedi locations.ts ed events*.ts), così i percorsi sono cliccabili e
 * collegati alla timeline.
 */
export const hxhRoutesBatch1: Route[] = [
  /* ===================== KILLUA ===================== */
  {
    id: 'route-hxh-killua-path',
    worldId: 'world-hunterxhunter',
    type: 'character',
    name: 'Il cammino di Killua',
    localizedName: { it: 'Il cammino di Killua', en: "Killua's path" },
    description: {
      it: "Dall'evasione dalla famiglia di assassini all'affrancamento definitivo dall'ago di Illumi, fino alla scelta di proteggere Alluka.",
      en: 'From escaping his assassin family to finally breaking free of Illumi\'s needle, and the choice to protect Alluka.',
    },
    protagonistCharacterIds: ['char-hxh-killua'],
    relatedCharacterIds: ['char-hxh-gon', 'char-hxh-illumi', 'char-hxh-alluka'],
    color: '#7c5cff',
    lineStyle: 'solid',
    steps: [
      { order: 1, locationId: 'loc-hxh-zaban-city', label: { it: 'Esame per Hunter', en: 'Hunter Exam' }, eventId: 'ev-hxh-exam-begins' },
      { order: 2, locationId: 'loc-hxh-zoldyck-estate', label: { it: 'Casa Zoldyck', en: 'Zoldyck home' }, eventId: 'ev-hxh-killua-family-room' },
      { order: 3, locationId: 'loc-hxh-heavens-arena', label: { it: 'Il Nen alla Torre Celeste', en: 'Nen at Heavens Arena' }, eventId: 'ev-hxh-learn-nen' },
      { order: 4, locationId: 'loc-hxh-greed-island', label: { it: 'Allenamento su Greed Island', en: 'Training on Greed Island' }, eventId: 'ev-hxh-ko-ken-training' },
      { order: 5, locationId: 'loc-hxh-east-gorteau', label: { it: "Via l'ago di Illumi", en: "Removing Illumi's needle" }, eventId: 'ev-hxh-killua-removes-needle' },
    ],
    arcId: 'arc-hxh-zoldyck-family',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['killua', 'zoldyck'],
  },

  /* ===================== HISOKA ===================== */
  {
    id: 'route-hxh-hisoka-hunt',
    worldId: 'world-hunterxhunter',
    type: 'character',
    name: 'La caccia di Hisoka',
    localizedName: { it: 'La caccia di Hisoka', en: "Hisoka's hunt" },
    description: {
      it: "Hisoka coltiva e insegue i frutti più promettenti: dall'Esame alla Torre Celeste, fino alla resa dei conti con la Brigata sulla Black Whale.",
      en: 'Hisoka cultivates and chases the most promising prey: from the Exam to Heavens Arena, to the reckoning with the Troupe aboard the Black Whale.',
    },
    protagonistCharacterIds: ['char-hxh-hisoka'],
    relatedCharacterIds: ['char-hxh-gon', 'char-hxh-chrollo'],
    color: '#e84393',
    lineStyle: 'dashed',
    steps: [
      { order: 1, locationId: 'loc-hxh-zaban-city', label: { it: "All'Esame per Hunter", en: 'At the Hunter Exam' }, eventId: 'ev-hxh-swindlers-swamp' },
      { order: 2, locationId: 'loc-hxh-heavens-arena', label: { it: 'Torre Celeste', en: 'Heavens Arena' }, eventId: 'ev-hxh-gon-vs-hisoka' },
      { order: 3, locationId: 'loc-hxh-yorknew', label: { it: 'Yorknew, tra i Ragni', en: 'Yorknew, among the Spiders' }, eventId: 'ev-hxh-troupe-gathers' },
      { order: 4, locationId: 'loc-hxh-kakin', label: { it: 'Black Whale', en: 'Black Whale' }, eventId: 'ev-hxh-hisoka-vs-troupe' },
    ],
    arcId: 'arc-hxh-heavens-arena',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['hisoka', 'brigata-fantasma'],
  },

  /* ===================== BRIGATA FANTASMA ===================== */
  {
    id: 'route-hxh-troupe-yorknew',
    worldId: 'world-hunterxhunter',
    type: 'faction',
    name: 'La Brigata Fantasma a Yorknew',
    localizedName: { it: 'La Brigata Fantasma a Yorknew', en: 'The Phantom Troupe in Yorknew' },
    description: {
      it: "Dalla città-discarica di Meteor City al colpo all'asta del Mercato Nero di Yorknew, fino allo scontro con gli Zoldyck e Kurapika.",
      en: 'From the junk-city of Meteor City to the Underground Auction heist in Yorknew, to the clash with the Zoldycks and Kurapika.',
    },
    protagonistCharacterIds: ['char-hxh-chrollo'],
    relatedCharacterIds: ['char-hxh-machi', 'char-hxh-nobunaga', 'char-hxh-feitan', 'char-hxh-uvogin', 'char-hxh-pakunoda'],
    color: '#b2bec3',
    lineStyle: 'solid',
    steps: [
      { order: 1, locationId: 'loc-hxh-meteor-city', label: { it: 'Meteor City', en: 'Meteor City' }, eventId: 'ev-hxh-troupe-gathers' },
      { order: 2, locationId: 'loc-hxh-yorknew', label: { it: "Asta del Mercato Nero", en: 'Underground Auction' }, eventId: 'ev-hxh-auction-massacre' },
      { order: 3, locationId: 'loc-hxh-yorknew', label: { it: 'Catturato da Kurapika', en: 'Captured by Kurapika' }, eventId: 'ev-hxh-chrollo-captured' },
    ],
    arcId: 'arc-hxh-yorknew-city',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['brigata-fantasma', 'yorknew'],
  },

  /* ===================== GREED ISLAND ===================== */
  {
    id: 'route-hxh-greed-island-quest',
    worldId: 'world-hunterxhunter',
    type: 'mission',
    name: 'La sfida di Greed Island',
    localizedName: { it: 'La sfida di Greed Island', en: 'The Greed Island quest' },
    description: {
      it: "L'avventura di Gon e Killua dentro il videogioco Nen: dall'ingresso all'allenamento con Bisky fino alla vittoria contro i Bomber e al messaggio di Ging.",
      en: 'Gon and Killua\'s adventure inside the Nen video game: from entry to training with Bisky, to the victory over the Bombers and Ging\'s message.',
    },
    protagonistCharacterIds: ['char-hxh-gon', 'char-hxh-killua'],
    relatedCharacterIds: ['char-hxh-biscuit', 'char-hxh-genthru', 'char-hxh-ging'],
    color: '#00b894',
    lineStyle: 'solid',
    steps: [
      { order: 1, locationId: 'loc-hxh-greed-island', label: { it: 'Ingresso nel gioco', en: 'Entering the game' }, eventId: 'ev-hxh-enter-greed-island' },
      { order: 2, locationId: 'loc-hxh-greed-island', label: { it: 'Allenamento con Bisky', en: 'Training with Bisky' }, eventId: 'ev-hxh-bisky-training' },
      { order: 3, locationId: 'loc-hxh-greed-island', label: { it: 'Gon contro Genthru', en: 'Gon vs Genthru' }, eventId: 'ev-hxh-gon-vs-genthru' },
      { order: 4, locationId: 'loc-hxh-greed-island', label: { it: 'Il messaggio di Ging', en: "Ging's message" }, eventId: 'ev-hxh-ging-message' },
    ],
    arcId: 'arc-hxh-greed-island',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['greed-island', 'gon', 'ging'],
  },

  /* ===================== ESAME PER HUNTER ===================== */
  {
    id: 'route-hxh-exam-phases',
    worldId: 'world-hunterxhunter',
    type: 'narrative',
    name: "Le fasi dell'Esame per Hunter",
    localizedName: { it: "Le fasi dell'Esame per Hunter", en: 'The Hunter Exam phases' },
    description: {
      it: "Il 287° Esame per Hunter passo dopo passo: la nave, la corsa di Satotz, la palude, la prova di cucina, la Torre del Tranello, l'Isola di Zevil e i duelli finali.",
      en: 'The 287th Hunter Exam step by step: the ship, Satotz\'s run, the swamp, the cooking trial, Trick Tower, Zevil Island and the final duels.',
    },
    protagonistCharacterIds: ['char-hxh-gon', 'char-hxh-killua', 'char-hxh-kurapika', 'char-hxh-leorio'],
    color: '#fdcb6e',
    lineStyle: 'dotted',
    steps: [
      { order: 1, locationId: 'loc-hxh-whale-island', label: { it: 'Partenza', en: 'Departure' }, eventId: 'ev-hxh-gon-departs' },
      { order: 2, locationId: 'loc-hxh-zaban-city', label: { it: 'Prima fase', en: 'First phase' }, eventId: 'ev-hxh-first-phase-run' },
      { order: 3, locationId: 'loc-hxh-zaban-city', label: { it: 'Seconda fase', en: 'Second phase' }, eventId: 'ev-hxh-second-phase-cooking' },
      { order: 4, locationId: 'loc-hxh-zaban-city', label: { it: 'Terza fase', en: 'Third phase' }, eventId: 'ev-hxh-trick-tower' },
      { order: 5, locationId: 'loc-hxh-zaban-city', label: { it: 'Quarta fase', en: 'Fourth phase' }, eventId: 'ev-hxh-zevil-island' },
      { order: 6, locationId: 'loc-hxh-zaban-city', label: { it: 'Fase finale', en: 'Final phase' }, eventId: 'ev-hxh-final-phase' },
    ],
    arcId: 'arc-hxh-hunter-exam',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['esame', 'fasi'],
  },

  /* ===================== SPEDIZIONE CONTINENTE OSCURO ===================== */
  {
    id: 'route-hxh-dark-continent-expedition',
    worldId: 'world-hunterxhunter',
    type: 'mission',
    name: 'La spedizione verso il Continente Oscuro',
    localizedName: { it: 'La spedizione verso il Continente Oscuro', en: 'The Dark Continent expedition' },
    description: {
      it: "Dal Regno di Kakin la nave Black Whale salpa oltre il Lago Mobius verso il Continente Oscuro, dimora delle Cinque Calamità.",
      en: 'From the Kingdom of Kakin the Black Whale sails beyond Lake Mobius toward the Dark Continent, home of the Five Calamities.',
    },
    protagonistCharacterIds: ['char-hxh-kurapika', 'char-hxh-ging', 'char-hxh-beyond'],
    relatedCharacterIds: ['char-hxh-pariston', 'char-hxh-cheadle'],
    color: '#2d3436',
    lineStyle: 'dashed',
    steps: [
      { order: 1, locationId: 'loc-hxh-kakin', label: { it: 'Partenza da Kakin', en: 'Departure from Kakin' }, eventId: 'ev-hxh-black-whale-departs' },
      { order: 2, locationId: 'loc-hxh-lake-mobius', label: { it: 'Attraversare il Lago Mobius', en: 'Crossing Lake Mobius' }, eventId: 'ev-hxh-succession-war' },
      { order: 3, locationId: 'loc-hxh-dark-continent', label: { it: 'Il Continente Oscuro', en: 'The Dark Continent' }, eventId: 'ev-hxh-black-whale-departs' },
    ],
    arcId: 'arc-hxh-succession-contest',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['continente-oscuro', 'spedizione'],
  },

  /* ===================== ELEZIONE / GUARIGIONE DI GON ===================== */
  {
    id: 'route-hxh-election-healing',
    worldId: 'world-hunterxhunter',
    type: 'narrative',
    name: 'Elezione e guarigione di Gon',
    localizedName: { it: 'Elezione e guarigione di Gon', en: "Election and Gon's healing" },
    description: {
      it: "Mentre l'Associazione elegge il 13° Presidente, Killua corre a salvare Gon: libera Alluka perché Nanika lo guarisca, aprendo la strada all'incontro col padre.",
      en: 'As the Association elects its 13th Chairman, Killua races to save Gon: he frees Alluka so Nanika can heal him, paving the way to meeting his father.',
    },
    protagonistCharacterIds: ['char-hxh-killua', 'char-hxh-gon'],
    relatedCharacterIds: ['char-hxh-alluka', 'char-hxh-nanika', 'char-hxh-ging', 'char-hxh-leorio'],
    color: '#0984e3',
    lineStyle: 'solid',
    steps: [
      { order: 1, locationId: 'loc-hxh-east-gorteau', label: { it: 'Gon in fin di vita', en: 'Gon near death' }, eventId: 'ev-hxh-gon-vs-pitou' },
      { order: 2, locationId: 'loc-hxh-zaban-city', label: { it: 'Nanika guarisce Gon', en: 'Nanika heals Gon' }, eventId: 'ev-hxh-alluka-heals-gon' },
      { order: 3, locationId: 'loc-hxh-whale-island', label: { it: 'Gon incontra Ging', en: 'Gon meets Ging' }, eventId: 'ev-hxh-gon-meets-ging' },
    ],
    arcId: 'arc-hxh-election',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['elezione', 'alluka', 'gon'],
  },
];
