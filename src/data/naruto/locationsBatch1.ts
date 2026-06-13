import type { Location } from '@/types';

/**
 * Luoghi Naruto · Batch 1 — completamento canonico della mappa.
 *
 * Tre sotto-luoghi di Konoha (sotto-mappa schematica `naruto-map-konoha`,
 * piazzati accanto ai pin logici già esistenti) e tre luoghi sul world map
 * ancorati alla nazione corretta.
 *
 * NB: come gli altri pin di Konoha, le coordinate della sotto-mappa sono
 * schematiche (la sotto-mappa non è una pianta rilevata).
 */
export const narutoLocationsBatch1: Location[] = [
  /* --- Sotto-mappa di Konoha --- */
  {
    id: 'loc-konoha-naka-shrine',
    worldId: 'world-naruto',
    mapLevelId: 'naruto-map-konoha',
    name: 'Naka Shrine',
    localizedName: { it: 'Tempio Naka', en: 'Naka Shrine' },
    type: 'sacred_place',
    x: 300,
    y: 690,
    nationId: 'nation-fire',
    shortDescription: {
      it: 'Tempio nel Quartiere Uchiha. Sotto il settimo tatami si cela la Tavoletta di Pietra del clan, leggibile solo con lo Sharingan e il Rinnegan.',
      en: 'Shrine in the Uchiha District. Beneath the seventh tatami lies the clan\'s Stone Tablet, readable only with the Sharingan and Rinnegan.',
    },
    clanIds: ['clan-uchiha'],
    characterIds: ['char-itachi', 'char-sasuke', 'char-obito'],
    importance: 'secondary',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['konoha', 'uchiha', 'stone-tablet'],
  },
  {
    id: 'loc-konoha-hot-springs',
    worldId: 'world-naruto',
    mapLevelId: 'naruto-map-konoha',
    name: 'Konoha Hot Springs',
    localizedName: { it: 'Terme di Konoha', en: 'Konoha Hot Springs' },
    type: 'landmark',
    x: 160,
    y: 560,
    nationId: 'nation-fire',
    shortDescription: {
      it: 'Bagni termali del villaggio, luogo di relax e — tristemente noto — dei "sopralluoghi" di Jiraiya per le sue ricerche.',
      en: 'The village hot springs, a place of relaxation and — infamously — Jiraiya\'s "research" peeping spot.',
    },
    characterIds: ['char-jiraiya'],
    importance: 'minor',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['konoha', 'leisure'],
  },
  {
    id: 'loc-konoha-root-hq',
    worldId: 'world-naruto',
    mapLevelId: 'naruto-map-konoha',
    name: 'Root Headquarters',
    localizedName: { it: 'Quartier Generale della Radice', en: 'Root Headquarters' },
    type: 'hideout',
    x: 1100,
    y: 300,
    nationId: 'nation-fire',
    shortDescription: {
      it: 'Base sotterranea segreta della Radice (Ne), l\'organizzazione ANBU dissolta di Danzō. Vi venivano addestrati agenti privati di emozioni.',
      en: 'Secret underground base of Root (Ne), Danzō\'s disbanded ANBU branch, where emotionless agents were trained.',
    },
    clanIds: ['faction-root'],
    characterIds: ['char-danzo', 'char-sai'],
    importance: 'secondary',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['konoha', 'root', 'danzo', 'underground'],
  },

  /* --- World map --- */
  {
    id: 'loc-tanzaku-town',
    worldId: 'world-naruto',
    mapLevelId: 'naruto-map-world',
    name: 'Tanzaku Town',
    localizedName: { it: 'Tanzaku', en: 'Tanzaku Town' },
    type: 'city',
    x: 560,
    y: 470,
    nationId: 'nation-fire',
    shortDescription: {
      it: 'Vivace città di castello del Paese del Fuoco, nota per il gioco d\'azzardo. Qui Jiraiya e Naruto ritrovano Tsunade e affrontano Orochimaru.',
      en: 'A lively castle town in the Land of Fire known for gambling. Here Jiraiya and Naruto find Tsunade and confront Orochimaru.',
    },
    characterIds: ['char-tsunade', 'char-jiraiya', 'char-naruto', 'char-orochimaru'],
    arcIds: ['arc-search-tsunade'],
    importance: 'secondary',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['land-of-fire', 'town'],
  },
  {
    id: 'loc-hozuki-castle',
    worldId: 'world-naruto',
    mapLevelId: 'naruto-map-world',
    name: 'Hōzuki Castle (Blood Prison)',
    localizedName: { it: 'Castello Hōzuki (Prigione di Sangue)', en: 'Hōzuki Castle (Blood Prison)' },
    type: 'hideout',
    x: 370,
    y: 520,
    nationId: 'nation-grass',
    shortDescription: {
      it: 'Prigione di massima sicurezza nota come "Prigione di Sangue", sigillata da una potente barriera. Teatro del film in cui Naruto vi è rinchiuso ingiustamente.',
      en: 'A maximum-security prison known as the "Blood Prison", sealed by a powerful barrier. Setting of the film in which Naruto is unjustly imprisoned.',
    },
    characterIds: ['char-naruto'],
    importance: 'minor',
    canonStatus: 'movie',
    referenceStatus: 'verified',
    tags: ['prison', 'movie', 'barrier'],
  },
  {
    id: 'loc-iron-capital',
    worldId: 'world-naruto',
    mapLevelId: 'naruto-map-world',
    name: 'Land of Iron Capital',
    localizedName: { it: 'Capitale del Paese del Ferro', en: 'Land of Iron Capital' },
    type: 'city',
    x: 790,
    y: 120,
    nationId: 'nation-iron',
    shortDescription: {
      it: 'Città fortificata fra le montagne nevose, retta dai samurai del generale Mifune. Ospita il Summit dei Cinque Kage, terra neutrale ai shinobi.',
      en: 'A fortified city among snowy mountains, governed by General Mifune\'s samurai. Hosts the Five Kage Summit on land neutral to shinobi.',
    },
    characterIds: ['char-mifune'],
    arcIds: ['arc-five-kage-summit'],
    importance: 'secondary',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['land-of-iron', 'samurai', 'neutral'],
  },
];
