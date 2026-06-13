import type { Nation } from '@/types';

/**
 * Nazioni / macro-regioni di Hunter x Hunter.
 *
 * Geografia tratta dalla mappa di riferimento del "Known World": i continenti
 * Yorbian (sud-ovest) e Azian (est), gli stati del nord-ovest, le isole
 * centrali, il Continente Oscuro che circonda il Lago Mobius e il Nuovo
 * Continente. La geografia di HxH è poco dettagliata nell'opera: confini e
 * appartenenze restano `needs_verification`.
 *
 * `boundaryId` collega ogni nazione al relativo path cliccabile (boundaries.ts).
 */
export const hxhNations: Nation[] = [
  /* ============= CONTINENTI / MACRO-REGIONI ============= */
  {
    id: 'nation-hxh-yorbian',
    worldId: 'world-hunterxhunter',
    name: 'Yorbian Continent',
    localizedName: { it: 'Continente di Yorbian', en: 'Yorbian Continent' },
    type: 'neutral_land',
    description: {
      it: 'Continente sud-occidentale del Mondo Conosciuto, che comprende gli Stati Uniti di Saherta e la Mitene Union.',
      en: 'South-western continent of the Known World, comprising the United States of Saherta and the Mitene Union.',
    },
    boundaryId: 'boundary-hxh-yorbian',
    relatedLocationIds: ['loc-hxh-yorknew'],
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['continente', 'yorbian'],
  },
  {
    id: 'nation-hxh-azian',
    worldId: 'world-hunterxhunter',
    name: 'Azian Continent',
    localizedName: { it: 'Continente di Azian', en: 'Azian Continent' },
    type: 'neutral_land',
    description: {
      it: 'Vasto continente orientale del Mondo Conosciuto, che comprende il Regno di Kakin e la Federazione di Ochima.',
      en: 'Large eastern continent of the Known World, comprising the Kingdom of Kakin and the Federation of Ochima.',
    },
    boundaryId: 'boundary-hxh-azian',
    relatedLocationIds: ['loc-hxh-kakin'],
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['continente', 'azian'],
  },
  {
    id: 'nation-hxh-new-continent',
    worldId: 'world-hunterxhunter',
    name: 'New Continent',
    localizedName: { it: 'Nuovo Continente', en: 'New Continent' },
    type: 'uncertain',
    description: {
      it: 'Terra emersa ai margini orientali del Mondo Conosciuto, oltre il confine, separata dal Lago Mobius.',
      en: 'Landmass at the eastern edge of the Known World, beyond the border, separated by Lake Mobius.',
    },
    boundaryId: 'boundary-hxh-new-continent',
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['nuovo-continente'],
  },
  {
    id: 'nation-hxh-dark-continent',
    worldId: 'world-hunterxhunter',
    name: 'Dark Continent',
    localizedName: { it: 'Continente Oscuro', en: 'Dark Continent' },
    type: 'uncertain',
    description: {
      it: 'Vasta terra inesplorata che circonda il Lago Mobius e il Mondo Conosciuto, dimora delle cinque grandi calamità e di creature leggendarie.',
      en: 'Vast unexplored land encircling Lake Mobius and the Known World, home to the five great calamities and legendary creatures.',
    },
    boundaryId: 'boundary-hxh-dark-continent',
    relatedLocationIds: ['loc-hxh-dark-continent'],
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['continente-oscuro', 'calamita'],
  },

  /* ============= NORD-OVEST (gruppo Kukan'yu / Padokia) ============= */
  {
    id: 'nation-hxh-padokia',
    worldId: 'world-hunterxhunter',
    name: 'Republic of Padokia',
    localizedName: { it: 'Repubblica di Padokia', en: 'Republic of Padokia' },
    type: 'minor_nation',
    description: {
      it: 'Repubblica che ospita il Monte Kukuroo, sede della tenuta della famiglia Zoldyck.',
      en: 'Republic home to Kukuroo Mountain, site of the Zoldyck family estate.',
    },
    boundaryId: 'boundary-hxh-padokia',
    relatedLocationIds: ['loc-hxh-zoldyck-estate'],
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['zoldyck'],
  },
  {
    id: 'nation-hxh-mimbo',
    worldId: 'world-hunterxhunter',
    name: 'Mimbo Republic',
    localizedName: { it: 'Repubblica di Mimbo', en: 'Mimbo Republic' },
    type: 'minor_nation',
    description: {
      it: 'Repubblica del Mondo Conosciuto nel gruppo di terre nord-occidentali, vicino alla Torre Celeste.',
      en: 'Republic of the Known World in the north-western landmass group, near Heavens Arena.',
    },
    boundaryId: 'boundary-hxh-mimbo',
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['mimbo'],
  },
  {
    id: 'nation-hxh-kukanyu',
    worldId: 'world-hunterxhunter',
    name: "Kukan'yu Kingdom",
    localizedName: { it: "Regno di Kukan'yu", en: "Kukan'yu Kingdom" },
    type: 'minor_nation',
    description: {
      it: "Regno nord-occidentale del Mondo Conosciuto che ospita la Città di Zaban, sede della fase finale dell'Esame per Hunter.",
      en: "North-western kingdom of the Known World, home to Zaban City, site of the Hunter Exam's final phase.",
    },
    boundaryId: 'boundary-hxh-kukanyu',
    relatedLocationIds: ['loc-hxh-zaban-city'],
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['kukanyu', 'hunter-exam'],
  },

  /* ============= YORBIAN (sud-ovest) ============= */
  {
    id: 'nation-hxh-saherta',
    worldId: 'world-hunterxhunter',
    name: 'United States of Saherta',
    localizedName: { it: 'Stati Uniti di Saherta', en: 'United States of Saherta' },
    type: 'great_nation',
    description: {
      it: 'Grande federazione del continente di Yorbian, una delle potenze del Mondo Conosciuto.',
      en: 'Large federation of the Yorbian continent, one of the powers of the Known World.',
    },
    boundaryId: 'boundary-hxh-saherta',
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['saherta', 'yorbian'],
  },
  {
    id: 'nation-hxh-mitene',
    worldId: 'world-hunterxhunter',
    name: 'Mitene Union',
    localizedName: { it: 'Unione di Mitene', en: 'Mitene Union' },
    type: 'great_nation',
    description: {
      it: "Unione di stati nel sud del continente di Yorbian. Al suo interno si trova la regione autonoma NGL.",
      en: 'Union of states in the south of the Yorbian continent. The NGL autonomous region lies within it.',
    },
    boundaryId: 'boundary-hxh-mitene',
    relatedLocationIds: ['loc-hxh-ngl'],
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['mitene', 'ngl'],
  },
  {
    id: 'nation-hxh-ngl',
    worldId: 'world-hunterxhunter',
    name: 'Neo-Green Life Autonomous Region',
    localizedName: { it: 'Regione Autonoma Neo-Green Life (NGL)', en: 'Neo-Green Life Autonomous Region (NGL)' },
    type: 'minor_nation',
    description: {
      it: 'Nazione che rifiuta la tecnologia, in realtà fronte per il traffico di droga. Luogo di nascita della regina delle Formiche Chimera. Situata nella Mitene Union.',
      en: 'A technology-rejecting nation, secretly a drug-trafficking front. Birthplace of the Chimera Ant Queen. Located within the Mitene Union.',
    },
    relatedLocationIds: ['loc-hxh-ngl'],
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['chimera-ant'],
  },

  /* ============= AZIAN (est) ============= */
  {
    id: 'nation-hxh-kakin',
    worldId: 'world-hunterxhunter',
    name: 'Kingdom of Kakin',
    localizedName: { it: 'Regno di Kakin', en: 'Kingdom of Kakin' },
    type: 'great_nation',
    description: {
      it: 'Monarchia emergente del continente di Azian, guidata da Re Nasubi Hui Guo Rou. Promuove la spedizione verso il Continente Oscuro.',
      en: 'Emerging monarchy of the Azian continent, led by King Nasubi Hui Guo Rou. Sponsor of the expedition toward the Dark Continent.',
    },
    boundaryId: 'boundary-hxh-kakin',
    relatedLocationIds: ['loc-hxh-kakin'],
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['kakin', 'successione'],
  },
  {
    id: 'nation-hxh-ochima',
    worldId: 'world-hunterxhunter',
    name: 'Federation of Ochima',
    localizedName: { it: 'Federazione di Ochima', en: 'Federation of Ochima' },
    type: 'great_nation',
    description: {
      it: 'Federazione del sud del continente di Azian, una delle grandi potenze del Mondo Conosciuto.',
      en: 'Federation in the south of the Azian continent, one of the great powers of the Known World.',
    },
    boundaryId: 'boundary-hxh-ochima',
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['ochima'],
  },
  {
    id: 'nation-hxh-east-gorteau',
    worldId: 'world-hunterxhunter',
    name: 'Republic of East Gorteau',
    localizedName: { it: 'Repubblica di East Gorteau', en: 'Republic of East Gorteau' },
    type: 'great_nation',
    description: {
      it: 'Stato dittatoriale isolazionista del continente di Azian, teatro della crisi delle Formiche Chimera e del loro Re.',
      en: 'Isolationist dictatorship of the Azian continent, stage of the Chimera Ant crisis and their King.',
    },
    relatedLocationIds: ['loc-hxh-east-gorteau'],
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['chimera-ant'],
  },

  /* ============= ISOLE CENTRO-MERIDIONALI ============= */
  {
    id: 'nation-hxh-begerosse',
    worldId: 'world-hunterxhunter',
    name: 'Begerossé Union',
    localizedName: { it: 'Unione di Begerossé', en: 'Begerossé Union' },
    type: 'minor_nation',
    description: {
      it: 'Unione insulare al centro-sud del Mondo Conosciuto, fra i continenti di Yorbian e Azian.',
      en: 'Island union in the south-central Known World, between the Yorbian and Azian continents.',
    },
    boundaryId: 'boundary-hxh-begerosse',
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['begerosse'],
  },

  /* ============= MITENE UNION · repubbliche membri ============= */
  {
    id: 'nation-hxh-rokario',
    worldId: 'world-hunterxhunter',
    name: 'Republic of Rokario',
    localizedName: { it: 'Repubblica di Rokario', en: 'Republic of Rokario' },
    type: 'minor_nation',
    description: {
      it: 'Repubblica della Mitene Union confinante con la NGL; ospita la Fiera del Continente Oscuro indetta dalla V6 e il porto di partenza della Black Whale.',
      en: 'Mitene Union republic bordering the NGL; hosts the V6 Dark Continent Expo and the departure port of the Black Whale.',
    },
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['mitene', 'continente-oscuro'],
  },
  {
    id: 'nation-hxh-hass',
    worldId: 'world-hunterxhunter',
    name: 'Republic of Hass',
    localizedName: { it: 'Repubblica di Hass', en: 'Republic of Hass' },
    type: 'minor_nation',
    description: {
      it: 'Repubblica della Mitene Union, confinante a est con la Repubblica di Rokario.',
      en: 'Mitene Union republic, bordering the Republic of Rokario to the east.',
    },
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['mitene'],
  },
  {
    id: 'nation-hxh-west-gorteau',
    worldId: 'world-hunterxhunter',
    name: 'Republic of West Gorteau',
    localizedName: { it: 'Repubblica di West Gorteau', en: 'Republic of West Gorteau' },
    type: 'minor_nation',
    description: {
      it: 'Repubblica della Mitene Union, controparte occidentale della dittatura di East Gorteau.',
      en: 'Mitene Union republic, the western counterpart to the East Gorteau dictatorship.',
    },
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['mitene'],
  },
];
