import type { StoryArc } from '@/types';

/**
 * Archi narrativi Naruto · Batch 2 — saghe Boruto-era addizionali.
 *
 * Continuano la cronologia dopo `arc-code-omnipotence` (order 26):
 *  - arc-mujina-bandits      (order 27, anime-only Boruto saga 4)
 *  - arc-mitsuki-disappearance (order 28, anime canon)
 *  - arc-academy-mission      (order 29, manga Boruto: Kae & Hiruga brothers)
 *  - arc-funato-war           (order 30, anime-only big saga)
 *  - arc-two-blue-vortex      (order 31, manga sequel "Boruto: Two Blue Vortex")
 *
 * Tutti con `series: ['boruto']`. Solo `arc-mitsuki-disappearance` e
 * `arc-academy-mission` sono dichiarati canon. Gli archi anime-only
 * lasciano `canonStatus: 'anime_only'` come da convenzione del dataset.
 */
export const narutoArcsBatch2: StoryArc[] = [
  {
    id: 'arc-mujina-bandits',
    worldId: 'world-naruto',
    name: 'Mujina Bandits',
    localizedName: {
      it: 'I Banditi Mujina',
      en: 'Mujina Bandits',
    },
    saga: 'Boruto',
    order: 27,
    period: { it: 'Era Boruto', en: 'Boruto Era' },
    series: ['boruto'],
    description: {
      it: 'Una banda criminale che opera in tutto il continente attira l\'attenzione di Konoha. Boruto e Mitsuki indagano sulla Prigione Hozuki nº1.',
      en: 'A criminal gang operating across the continent draws Konoha\'s attention. Boruto and Mitsuki investigate Hozuki Prison nº1.',
    },
    characterIds: ['char-boruto', 'char-mitsuki', 'char-sarada'],
    canon: 'anime_only',
    canonStatus: 'anime_only',
    referenceStatus: 'verified',
    tags: ['boruto-era', 'anime-only'],
  },
  {
    id: 'arc-mitsuki-disappearance',
    worldId: 'world-naruto',
    name: 'Mitsuki\'s Disappearance',
    localizedName: {
      it: 'La Scomparsa di Mitsuki',
      en: 'Mitsuki\'s Disappearance',
    },
    saga: 'Boruto',
    order: 28,
    period: { it: 'Era Boruto', en: 'Boruto Era' },
    series: ['boruto'],
    description: {
      it: 'Mitsuki scompare da Konoha. Boruto e Sarada lo inseguono fino al Paese della Terra, scoprendo gli intrighi tra Iwa, Orochimaru e i resti dei Tsuchikage.',
      en: 'Mitsuki disappears from Konoha. Boruto and Sarada chase him to the Land of Earth, uncovering intrigues among Iwa, Orochimaru and the former Tsuchikage.',
    },
    nationIds: ['nation-earth'],
    characterIds: ['char-boruto', 'char-sarada', 'char-mitsuki', 'char-orochimaru'],
    canon: 'canon',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['boruto-era', 'mitsuki'],
  },
  {
    id: 'arc-academy-mission',
    worldId: 'world-naruto',
    name: 'Academy Mission',
    localizedName: {
      it: 'Missione dell\'Accademia',
      en: 'Academy Mission',
    },
    saga: 'Boruto',
    order: 29,
    period: { it: 'Era Boruto', en: 'Boruto Era' },
    series: ['boruto'],
    description: {
      it: 'La squadra di Boruto scorta la principessa Kae del Paese del Bambù all\'Accademia di Konoha, contrastando le incursioni dei fratelli Hiruga.',
      en: 'Boruto\'s team escorts Princess Kae of the Land of Bamboo to Konoha Academy, fending off raids by the Hiruga brothers.',
    },
    locationIds: ['loc-konoha', 'loc-konoha-academy'],
    nationIds: ['nation-fire'],
    characterIds: ['char-boruto', 'char-sarada', 'char-mitsuki', 'char-hiruga'],
    mangaChapters: ['Boruto 60-69'],
    canon: 'canon',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['boruto-era', 'manga', 'academy'],
  },
  {
    id: 'arc-funato-war',
    worldId: 'world-naruto',
    name: 'Funato War',
    localizedName: {
      it: 'Guerra dei Funato',
      en: 'Funato War',
    },
    saga: 'Boruto',
    order: 30,
    period: { it: 'Era Boruto', en: 'Boruto Era' },
    series: ['boruto'],
    description: {
      it: 'Saga marittima: il clan pirata Funato si ribella contro il Paese dell\'Acqua. Konoha invia il Team 7 in supporto a Chōjurō; Boruto stringe amicizia con il giovane Kobuna.',
      en: 'Maritime saga: the Funato pirate clan rebels against the Land of Water. Konoha sends Team 7 to support Chōjurō; Boruto befriends young Kobuna.',
    },
    locationIds: ['loc-kiri', 'loc-kiri-harbor'],
    nationIds: ['nation-water'],
    characterIds: [
      'char-boruto',
      'char-sarada',
      'char-mitsuki',
      'char-chojuro',
      'char-araumi',
      'char-isari',
      'char-kobuna',
    ],
    animeEpisodes: ['Boruto: NNG ep. 232-256'],
    canon: 'anime_only',
    canonStatus: 'anime_only',
    referenceStatus: 'verified',
    tags: ['boruto-era', 'anime-only', 'funato', 'water'],
  },
  {
    id: 'arc-two-blue-vortex',
    worldId: 'world-naruto',
    name: 'Two Blue Vortex',
    localizedName: {
      it: 'Two Blue Vortex',
      en: 'Two Blue Vortex',
    },
    saga: 'Boruto',
    order: 31,
    period: { it: 'Era Boruto', en: 'Boruto Era' },
    series: ['boruto'],
    description: {
      it: 'Sequel manga "Boruto: Two Blue Vortex". Boruto è cresciuto e braccato come "assassino" di Naruto. Kawaki, ora rivale dichiarato, lo cerca per ucciderlo prima che Code e i suoi Claws Grime distruggano il mondo.',
      en: 'Manga sequel "Boruto: Two Blue Vortex". A grown Boruto is hunted as Naruto\'s "killer". Kawaki, now an open rival, seeks him before Code and his Claws Grime devastate the world.',
    },
    locationIds: ['loc-konoha'],
    characterIds: ['char-boruto', 'char-kawaki', 'char-code', 'char-sarada', 'char-mitsuki', 'char-eida'],
    mangaChapters: ['Two Blue Vortex 1+'],
    canon: 'canon',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['boruto-era', 'two-blue-vortex', 'manga'],
  },
];
