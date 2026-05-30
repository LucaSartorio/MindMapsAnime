import type { MapBoundary } from '@/types';

/**
 * Confini cliccabili per la world map Hunter x Hunter.
 *
 * Tutti i `svgPathD` sono nel viewBox 2000 × 1187 e tracciano le regioni
 * della mappa di riferimento (fan-made) del Mondo Conosciuto. Sono
 * poligoni approssimati che fungono da aree cliccabili + highlight su
 * hover/selezione (vedi MapRegionPath); l'overlay è invisibile di default
 * perché il PNG porta già etichette e confini disegnati.
 *
 * Ordine: prima le macro-regioni (Mondo Conosciuto, continenti) così che le
 * hot-zone delle singole nazioni, definite dopo, restino cliccabili sopra.
 *
 * TODO: se sostituisci il PNG, rivedi `svgPathD` e `labelPosition`.
 */
export const hxhBoundaries: MapBoundary[] = [
  /* ============= MACRO-REGIONI ============= */
  {
    id: 'boundary-hxh-known-world',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'known-world',
    name: 'Known World',
    localizedName: { it: 'Mondo Conosciuto', en: 'Known World' },
    type: 'special_area',
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    svgPathD:
      'M 530 309 L 1450 309 L 1450 973 L 530 973 Z',
    labelPosition: { x: 970, y: 560 },
    color: '#7fb2c8',
    descriptionShort: {
      it: 'La porzione esplorata e mappata del mondo di Hunter x Hunter, racchiusa dal confine tratteggiato in mezzo al Lago Mobius.',
      en: 'The explored, charted portion of the Hunter x Hunter world, enclosed by the dashed border amid Lake Mobius.',
    },
    tags: ['known-world'],
  },
  {
    id: 'boundary-hxh-dark-continent',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'dark-continent',
    name: 'Dark Continent',
    localizedName: { it: 'Continente Oscuro', en: 'Dark Continent' },
    type: 'region',
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    svgPathD:
      'M 0 0 L 2000 0 L 2000 250 L 1500 205 L 1000 160 L 500 205 L 0 250 Z',
    labelPosition: { x: 980, y: 70 },
    nationId: 'nation-hxh-dark-continent',
    color: '#3a3326',
    descriptionShort: {
      it: 'La terra inesplorata che circonda il Lago Mobius e il Mondo Conosciuto, dimora delle Cinque Calamità.',
      en: 'The unexplored land encircling Lake Mobius and the Known World, home to the Five Calamities.',
    },
    tags: ['continente-oscuro', 'calamita'],
  },
  {
    id: 'boundary-hxh-yorbian',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'yorbian',
    name: 'Yorbian Continent',
    localizedName: { it: 'Continente di Yorbian', en: 'Yorbian Continent' },
    type: 'region',
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    svgPathD:
      'M 600 640 L 730 615 L 850 645 L 905 700 L 920 760 L 885 820 L 905 860 L 840 877 L 740 860 L 650 815 L 585 740 L 575 680 Z',
    labelPosition: { x: 754, y: 720 },
    nationId: 'nation-hxh-yorbian',
    color: '#9ec27a',
    descriptionShort: {
      it: 'Il continente sud-occidentale del Mondo Conosciuto: Stati Uniti di Saherta e Mitene Union.',
      en: 'The south-western continent of the Known World: United States of Saherta and Mitene Union.',
    },
    tags: ['continente', 'yorbian'],
  },
  {
    id: 'boundary-hxh-azian',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'azian',
    name: 'Azian Continent',
    localizedName: { it: 'Continente di Azian', en: 'Azian Continent' },
    type: 'region',
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    svgPathD:
      'M 1150 440 L 1290 405 L 1410 440 L 1446 510 L 1430 600 L 1380 690 L 1320 770 L 1260 700 L 1200 620 L 1135 540 L 1124 480 Z',
    labelPosition: { x: 1280, y: 480 },
    nationId: 'nation-hxh-azian',
    color: '#9ec27a',
    descriptionShort: {
      it: 'Il vasto continente orientale del Mondo Conosciuto: Regno di Kakin e Federazione di Ochima.',
      en: 'The large eastern continent of the Known World: Kingdom of Kakin and Federation of Ochima.',
    },
    tags: ['continente', 'azian'],
  },
  {
    id: 'boundary-hxh-new-continent',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'new-continent',
    name: 'New Continent',
    localizedName: { it: 'Nuovo Continente', en: 'New Continent' },
    type: 'region',
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    svgPathD:
      'M 1545 365 L 1620 375 L 1660 430 L 1650 500 L 1610 555 L 1560 540 L 1535 470 L 1538 405 Z',
    labelPosition: { x: 1582, y: 462 },
    nationId: 'nation-hxh-new-continent',
    color: '#c9b896',
    descriptionShort: {
      it: 'Terra emersa oltre il confine orientale del Mondo Conosciuto, separata dal Lago Mobius.',
      en: 'Landmass beyond the eastern border of the Known World, separated by Lake Mobius.',
    },
    tags: ['nuovo-continente'],
  },

  /* ============= NORD-OVEST (Padokia / Mimbo / Kukan'yu) ============= */
  {
    id: 'boundary-hxh-padokia',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'padokia',
    name: 'Republic of Padokia',
    localizedName: { it: 'Repubblica di Padokia', en: 'Republic of Padokia' },
    type: 'minor_nation',
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    svgPathD:
      'M 690 315 L 770 305 L 815 330 L 810 375 L 760 395 L 700 385 L 680 350 Z',
    labelPosition: { x: 744, y: 347 },
    nationId: 'nation-hxh-padokia',
    color: '#a7c98a',
    descriptionShort: {
      it: 'Repubblica nord-occidentale che ospita il Monte Kukuroo, sede della famiglia Zoldyck.',
      en: 'North-western republic home to Kukuroo Mountain, seat of the Zoldyck family.',
    },
    tags: ['zoldyck'],
  },
  {
    id: 'boundary-hxh-mimbo',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'mimbo',
    name: 'Mimbo Republic',
    localizedName: { it: 'Repubblica di Mimbo', en: 'Mimbo Republic' },
    type: 'minor_nation',
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    svgPathD:
      'M 690 365 L 760 365 L 790 395 L 760 420 L 705 422 L 678 398 Z',
    labelPosition: { x: 732, y: 392 },
    nationId: 'nation-hxh-mimbo',
    color: '#a7c98a',
    descriptionShort: {
      it: 'Repubblica del gruppo di terre nord-occidentali, vicina alla Torre Celeste.',
      en: 'Republic of the north-western landmass group, near Heavens Arena.',
    },
    tags: ['mimbo'],
  },
  {
    id: 'boundary-hxh-kukanyu',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'kukanyu',
    name: "Kukan'yu Kingdom",
    localizedName: { it: "Regno di Kukan'yu", en: "Kukan'yu Kingdom" },
    type: 'minor_nation',
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    svgPathD:
      'M 590 420 L 670 415 L 695 450 L 670 485 L 615 495 L 585 460 Z',
    labelPosition: { x: 634, y: 452 },
    nationId: 'nation-hxh-kukanyu',
    color: '#a7c98a',
    descriptionShort: {
      it: "Regno nord-occidentale che ospita la Città di Zaban, sede della fase finale dell'Esame per Hunter.",
      en: "North-western kingdom home to Zaban City, site of the Hunter Exam's final phase.",
    },
    tags: ['kukanyu', 'hunter-exam'],
  },

  /* ============= YORBIAN (Saherta / Mitene) ============= */
  {
    id: 'boundary-hxh-saherta',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'saherta',
    name: 'United States of Saherta',
    localizedName: { it: 'Stati Uniti di Saherta', en: 'United States of Saherta' },
    type: 'great_nation',
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    svgPathD:
      'M 615 645 L 715 640 L 745 670 L 720 705 L 645 708 L 610 678 Z',
    labelPosition: { x: 666, y: 673 },
    nationId: 'nation-hxh-saherta',
    color: '#8fbf6e',
    descriptionShort: {
      it: 'Grande federazione del continente di Yorbian, fra le potenze del Mondo Conosciuto.',
      en: 'Large federation of the Yorbian continent, among the powers of the Known World.',
    },
    tags: ['saherta', 'yorbian'],
  },
  {
    id: 'boundary-hxh-mitene',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'mitene',
    name: 'Mitene Union',
    localizedName: { it: 'Unione di Mitene', en: 'Mitene Union' },
    type: 'great_nation',
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    svgPathD:
      'M 720 880 L 820 870 L 855 905 L 835 950 L 760 962 L 705 925 Z',
    labelPosition: { x: 784, y: 912 },
    nationId: 'nation-hxh-mitene',
    color: '#8fbf6e',
    descriptionShort: {
      it: 'Unione di stati nel sud di Yorbian; al suo interno la regione autonoma NGL.',
      en: 'Union of states in southern Yorbian; the NGL autonomous region lies within it.',
    },
    tags: ['mitene', 'ngl'],
  },

  /* ============= AZIAN (Kakin / Ochima) ============= */
  {
    id: 'boundary-hxh-kakin',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'kakin',
    name: 'Kingdom of Kakin',
    localizedName: { it: 'Regno di Kakin', en: 'Kingdom of Kakin' },
    type: 'great_nation',
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    svgPathD:
      'M 1160 490 L 1260 485 L 1290 525 L 1260 565 L 1185 570 L 1150 530 Z',
    labelPosition: { x: 1210, y: 525 },
    nationId: 'nation-hxh-kakin',
    color: '#8fbf6e',
    descriptionShort: {
      it: 'Monarchia emergente del continente di Azian, da cui salpa la spedizione verso il Continente Oscuro.',
      en: 'Emerging monarchy of the Azian continent, from which the Dark Continent expedition sets sail.',
    },
    tags: ['kakin', 'successione'],
  },
  {
    id: 'boundary-hxh-ochima',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'ochima',
    name: 'Federation of Ochima',
    localizedName: { it: 'Federazione di Ochima', en: 'Federation of Ochima' },
    type: 'great_nation',
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    svgPathD:
      'M 1255 610 L 1370 605 L 1410 650 L 1380 700 L 1300 715 L 1250 670 Z',
    labelPosition: { x: 1308, y: 655 },
    nationId: 'nation-hxh-ochima',
    color: '#8fbf6e',
    descriptionShort: {
      it: 'Federazione del sud del continente di Azian, fra le grandi potenze del Mondo Conosciuto.',
      en: 'Federation in southern Azian, among the great powers of the Known World.',
    },
    tags: ['ochima'],
  },

  /* ============= ISOLE CENTRO-MERIDIONALI ============= */
  {
    id: 'boundary-hxh-begerosse',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'begerosse',
    name: 'Begerossé Union',
    localizedName: { it: 'Unione di Begerossé', en: 'Begerossé Union' },
    type: 'island',
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    svgPathD:
      'M 1055 770 L 1170 760 L 1215 805 L 1190 865 L 1110 895 L 1040 855 L 1035 805 Z',
    labelPosition: { x: 1118, y: 815 },
    nationId: 'nation-hxh-begerosse',
    color: '#8fbf6e',
    descriptionShort: {
      it: 'Unione insulare al centro-sud del Mondo Conosciuto, fra Yorbian e Azian.',
      en: 'Island union in the south-central Known World, between Yorbian and Azian.',
    },
    tags: ['begerosse'],
  },
];
