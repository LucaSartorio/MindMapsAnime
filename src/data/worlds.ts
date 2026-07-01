import type { AnimeWorld } from '@/types';

/**
 * Registro generico di tutti gli anime/manga supportati o pianificati.
 * Aggiungere qui una nuova voce per esporre la card in homepage.
 *
 * Per "available" è richiesto anche un dataset completo in src/data/<slug>/index.ts
 * e una registrazione in src/data/registry.ts.
 */
export const animeWorlds: AnimeWorld[] = [
  {
    id: 'world-naruto',
    slug: 'naruto',
    title: 'Naruto',
    subtitle: {
      it: 'Nazioni Elementali · Mondo Ninja',
      en: 'Elemental Nations · Ninja World',
    },
    description: {
      it: 'Esplora le Nazioni Elementali, i Cinque Villaggi Nascosti e i percorsi dei ninja più iconici. Dalle missioni nel Paese delle Onde alla Quarta Guerra Ninja.',
      en: 'Explore the Elemental Nations, the Five Hidden Villages and the journeys of the most iconic ninja. From the Land of Waves to the Fourth Shinobi World War.',
    },
    status: 'available',
    theme: {
      primary: '#f06600',
      accent: '#1f9aff',
      highlight: '#e10b0b',
      background: '#0c0d11',
      // Il logo Naruto ha margini interni ampi: lo "pareggiamo" agli altri.
      logoScale: 1.18,
    },
    defaultMapLevelId: 'naruto-map-world',
    availableMapLevelIds: ['naruto-map-world', 'naruto-map-konoha'],
    coverAssetId: 'naruto-cover-placeholder',
    tags: ['shonen', 'ninja', 'masashi kishimoto', 'jump'],
    metadata: {
      author: 'Masashi Kishimoto',
      publisher: 'Shueisha',
      yearStart: 1999,
      yearEnd: 2014,
    },
    config: {
      ability: {
        term: 'Jutsu',
        // Categorie e nature usano le mappe globali (id noti di Naruto).
        attribute: { term: { it: 'Natura del chakra', en: 'Chakra nature' } },
        showHandSeals: true,
        showRank: true,
      },
      characterRank: { term: { it: 'Grado ninja', en: 'Ninja rank' } },
      // Ruoli specifici di Naruto (quelli universali sono già localizzati).
      characterRoles: [
        { id: 'kage', label: 'Kage' },
        { id: 'jinchuriki', label: 'Jinchūriki' },
        { id: 'akatsuki', label: 'Akatsuki' },
      ],
      featured: {
        abilities: [
          'jutsu-rasengan',
          'jutsu-chidori',
          'jutsu-kamui',
          'jutsu-amaterasu',
          'jutsu-sage-mode-toad',
          'jutsu-chibaku-tensei',
        ],
        factions: [
          'clan-uchiha',
          'clan-senju',
          'clan-uzumaki',
          'clan-hyuga',
          'faction-akatsuki-original',
          'clan-nara',
          'clan-yamanaka',
          'clan-aburame',
          'clan-inuzuka',
          'clan-hatake',
        ],
      },
    },
  },
  {
    id: 'world-hunterxhunter',
    slug: 'hunterxhunter',
    title: 'Hunter x Hunter',
    subtitle: {
      it: 'Un mondo di Hunter',
      en: 'A world of Hunters',
    },
    description: {
      it: 'Il mondo di Gon, Killua e degli Hunter. Personaggi, tecniche Nen, fazioni, archi narrativi e la mappa del Mondo Conosciuto: continenti, nazioni, Lago Mobius e Continente Oscuro.',
      en: "Gon, Killua and the Hunters' world. Characters, Nen techniques, factions, story arcs and the map of the Known World: continents, nations, Lake Mobius and the Dark Continent.",
    },
    status: 'available',
    theme: {
      primary: '#1f9aff',
      accent: '#f06600',
      highlight: '#e10b0b',
    },
    defaultMapLevelId: 'hxh-map-world',
    availableMapLevelIds: [
      'hxh-map-world',
      'hxh-map-heavens-arena',
      'hxh-map-zoldyck',
      'hxh-map-greed-island',
      'hxh-map-east-gorteau',
    ],
    coverAssetId: 'hxh-cover-placeholder',
    tags: ['shonen', 'hunter', 'yoshihiro togashi', 'jump'],
    metadata: {
      author: 'Yoshihiro Togashi',
      publisher: 'Shueisha',
      yearStart: 1998,
    },
    config: {
      ability: {
        term: { it: 'Nen', en: 'Nen' },
        categoryTerm: { it: 'Categoria', en: 'Category' },
        // Niente `attribute`: il Nen non ha "natura del chakra".
        // Niente sigilli delle mani né rango ufficiale E…S.
      },
      // Niente `characterRank`: gli Hunter non hanno i gradi ninja.
      featured: {
        abilities: [
          'jutsu-hxh-jajanken',
          'jutsu-hxh-godspeed',
          'jutsu-hxh-chain-jail',
          'jutsu-hxh-bungee-gum',
          'jutsu-hxh-skill-hunter',
          'jutsu-hxh-100-type-guanyin',
        ],
        factions: [
          'faction-hxh-hunter-association',
          'faction-hxh-zoldyck',
          'faction-hxh-phantom-troupe',
          'faction-hxh-kurta',
          'faction-hxh-chimera-ants',
          'faction-hxh-zodiacs',
        ],
      },
    },
  },
  {
    id: 'world-onepiece',
    slug: 'onepiece',
    title: 'One Piece',
    subtitle: {
      it: 'Grand Line · Era della Pirateria',
      en: 'Grand Line · The Pirate Era',
    },
    description: {
      it: 'Il mondo di Rufy e della ciurma di Cappello di Paglia. Naviga la Grand Line, da East Blue a Wano, tra le isole dei quattro Mari, Paradise, il New World e la rotta verso il One Piece.',
      en: "Luffy and the Straw Hat crew's world. Sail the Grand Line, from East Blue to Wano, across the islands of the four Seas, Paradise, the New World and the route toward the One Piece.",
    },
    status: 'available',
    theme: {
      primary: '#e23b3b',
      accent: '#f5b21a',
      highlight: '#1f9aff',
    },
    defaultMapLevelId: 'op-map-world',
    availableMapLevelIds: [
      'op-map-world',
      'op-map-totland',
      'op-map-alabasta',
      'op-map-wano',
      'op-map-skypiea',
      'op-map-dressrosa',
      'op-map-sabaody',
      'op-map-marineford',
      'op-map-egghead',
      'op-map-fishman-island',
      'op-map-impel-down',
      'op-map-enies-lobby',
      'op-map-water-seven',
      'op-map-thriller-bark',
      'op-map-zou',
      'op-map-punk-hazard',
      'op-map-amazon-lily',
      'op-map-drum-island',
      'op-map-mary-geoise',
      'op-map-dawn-island',
      'op-map-loguetown',
      'op-map-jaya',
      'op-map-ohara',
      'op-map-elbaf',
      'op-map-god-valley',
      'op-map-germa-kingdom',
      'op-map-space',
    ],
    coverAssetId: 'op-cover-placeholder',
    tags: ['shonen', 'pirati', 'eiichiro oda', 'jump'],
    metadata: {
      author: 'Eiichiro Oda',
      publisher: 'Shueisha',
      yearStart: 1997,
    },
    config: {
      ability: {
        term: { it: 'Frutti del Diavolo', en: 'Devil Fruits' },
        categoryTerm: { it: 'Tipo di frutto', en: 'Fruit type' },
        categories: [
          { id: 'paramecia', label: 'Paramecia' },
          { id: 'zoan', label: 'Zoan' },
          { id: 'logia', label: 'Logia' },
          { id: 'haki', label: 'Ambizione (Haki)' },
        ],
      },
      nationTerm: { it: 'Mare / Isola', en: 'Sea / Island' },
      factionsTerm: { it: 'Ciurme & Fazioni', en: 'Crews & Factions' },
      placesTerm: { it: 'luoghi', en: 'places' },
      featured: {
        abilities: [
          'fruit-op-hito-hito-nika',
          'fruit-op-mera-mera',
          'fruit-op-ope-ope',
          'fruit-op-uo-uo',
          'fruit-op-yami-yami',
          'fruit-op-gura-gura',
        ],
      },
    },
  },
  {
    id: 'world-dragonball',
    slug: 'dragonball',
    title: 'Dragon Ball',
    subtitle: {
      it: 'Sfere del Drago · Arti Marziali',
      en: 'Dragon Balls · Martial Arts',
    },
    description: {
      it: 'Il mondo di Goku: dalla ricerca delle sette Sfere del Drago ai tornei di arti marziali, dagli scontri contro Freezer, Cell e Majin Bu fino al Torneo del Potere di Dragon Ball Super.',
      en: "Goku's world: from the search for the seven Dragon Balls to the martial arts tournaments, from the battles against Frieza, Cell and Majin Buu up to the Tournament of Power in Dragon Ball Super.",
    },
    status: 'available',
    theme: {
      primary: '#f5a01f',
      accent: '#2f7fe0',
      highlight: '#e10b0b',
    },
    defaultMapLevelId: 'dbz-map-world',
    availableMapLevelIds: ['dbz-map-world', 'dbz-map-cosmic', 'dbz-map-namek', 'dbz-map-gt-space'],
    coverAssetId: 'dbz-cover-placeholder',
    tags: ['shonen', 'arti marziali', 'akira toriyama', 'jump'],
    metadata: {
      author: 'Akira Toriyama',
      publisher: 'Shueisha',
      yearStart: 1984,
      yearEnd: 1995,
    },
    config: {
      ability: {
        term: { it: 'Tecniche', en: 'Techniques' },
        categoryTerm: { it: 'Tipo', en: 'Type' },
        categories: [
          { id: 'energy_blast', label: { it: 'Onda energetica', en: 'Energy blast' } },
          { id: 'power_up', label: { it: 'Power-up', en: 'Power-up' } },
          { id: 'movement', label: { it: 'Movimento', en: 'Movement' } },
          { id: 'support', label: { it: 'Supporto', en: 'Support' } },
          { id: 'seal', label: { it: 'Sigillo', en: 'Seal' } },
          { id: 'fusion', label: { it: 'Fusione', en: 'Fusion' } },
          { id: 'divine', label: { it: 'Divina', en: 'Divine' } },
        ],
      },
      nationTerm: { it: 'Pianeta / Regno', en: 'Planet / Realm' },
      factionsTerm: { it: 'Razze & Fazioni', en: 'Races & Factions' },
      placesTerm: { it: 'luoghi', en: 'places' },
      characterRoles: [],
      featured: {
        abilities: [
          'jutsu-dbz-kamehameha',
          'jutsu-dbz-genkidama',
          'jutsu-dbz-kaioken',
          'jutsu-dbz-instant-transmission',
          'jutsu-dbz-hakai',
          'jutsu-dbz-ultra-instinct',
        ],
        factions: [
          'faction-dbz-z-fighters',
          'faction-dbz-race-saiyan',
          'faction-dbz-race-namekian',
          'faction-dbz-frieza-force',
          'faction-dbz-race-majin',
          'faction-dbz-universe-7-team',
        ],
      },
    },
  },
  {
    id: 'world-attackontitan',
    slug: 'attackontitan',
    title: 'Attack on Titan',
    subtitle: {
      it: 'L\'attacco dei Giganti · Mura e Titani',
      en: 'Attack on Titan · Walls and Titans',
    },
    description: {
      it: 'Il mondo oltre le Mura è in arrivo. Seguiremo Eren e il Corpo di Ricerca tra i tre muri — Maria, Rose e Sina —, l\'isola di Paradis e Marley.',
      en: "The world beyond the Walls is coming. We'll follow Eren and the Survey Corps across the three walls — Maria, Rose and Sina —, Paradis Island and Marley.",
    },
    status: 'coming_soon',
    theme: {
      primary: '#6f7d4e',
      accent: '#b0823f',
      highlight: '#9e2b25',
      background: '#0c0d11',
    },
    availableMapLevelIds: [],
    tags: ['azione', 'titani', 'hajime isayama', 'kodansha'],
    metadata: {
      author: 'Hajime Isayama',
      publisher: 'Kodansha',
      yearStart: 2009,
      yearEnd: 2021,
    },
    config: {
      ability: {
        term: { it: 'Abilità', en: 'Abilities' },
        categoryTerm: { it: 'Tipo', en: 'Type' },
      },
      nationTerm: { it: 'Territorio', en: 'Territory' },
    },
  },
  // Slot futuri: Bleach, Jujutsu Kaisen, Demon Slayer.
];

/** Recupera un mondo tramite slug. */
export function findWorldBySlug(slug: string): AnimeWorld | undefined {
  return animeWorlds.find((w) => w.slug === slug);
}
