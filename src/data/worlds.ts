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
  {
    id: 'world-bleach',
    slug: 'bleach',
    title: 'Bleach',
    subtitle: {
      it: 'Soul Society · Shinigami',
      en: 'Soul Society · Soul Reapers',
    },
    description: {
      it: 'La mappa dei tre mondi di Bleach è in arrivo: Karakura e il Mondo dei Vivi, la Soul Society con il Seireitei e il Rukongai, Hueco Mundo e Las Noches. Ichigo, il Gotei 13, gli Espada e i Quincy.',
      en: "The map of Bleach's three worlds is coming: Karakura and the World of the Living, the Soul Society with the Seireitei and the Rukongai, Hueco Mundo and Las Noches. Ichigo, the Gotei 13, the Espada and the Quincy.",
    },
    status: 'coming_soon',
    theme: {
      primary: '#e8552d',
      accent: '#4fb3d9',
      highlight: '#c9d1d9',
      background: '#0c0d11',
    },
    availableMapLevelIds: [],
    tags: ['shonen', 'shinigami', 'tite kubo', 'jump'],
    metadata: {
      author: 'Tite Kubo',
      publisher: 'Shueisha',
      yearStart: 2001,
      yearEnd: 2016,
    },
    config: {
      ability: {
        term: { it: 'Zanpakutō & Poteri spirituali', en: 'Zanpakutō & Spiritual powers' },
        categoryTerm: { it: 'Tipo', en: 'Type' },
      },
      characterRank: { term: { it: 'Grado', en: 'Rank' } },
      nationTerm: { it: 'Mondo / Dimensione', en: 'World / Dimension' },
      factionsTerm: { it: 'Divisioni & Fazioni', en: 'Divisions & Factions' },
      placesTerm: { it: 'luoghi', en: 'places' },
    },
  },
  {
    id: 'world-fullmetalalchemist',
    slug: 'fullmetalalchemist',
    title: 'Fullmetal Alchemist',
    subtitle: {
      it: 'Amestris · Scambio Equivalente',
      en: 'Amestris · Equivalent Exchange',
    },
    description: {
      it: 'Il viaggio di Edward e Alphonse Elric è in arrivo: Amestris con Central, Resembool, Ishval e Briggs, il regno di Xing e la ricerca della Pietra Filosofale.',
      en: "Edward and Alphonse Elric's journey is coming: Amestris with Central, Resembool, Ishval and Briggs, the kingdom of Xing and the search for the Philosopher's Stone.",
    },
    status: 'coming_soon',
    theme: {
      primary: '#b8232f',
      accent: '#d4af37',
      highlight: '#4a90d9',
      background: '#0c0d11',
    },
    availableMapLevelIds: [],
    tags: ['shonen', 'alchimia', 'hiromu arakawa', 'square enix'],
    metadata: {
      author: 'Hiromu Arakawa',
      publisher: 'Square Enix',
      yearStart: 2001,
      yearEnd: 2010,
    },
    config: {
      ability: {
        term: { it: 'Alchimia', en: 'Alchemy' },
        categoryTerm: { it: 'Tipo', en: 'Type' },
      },
      characterRank: { term: { it: 'Grado militare', en: 'Military rank' } },
      nationTerm: { it: 'Nazione / Regione', en: 'Nation / Region' },
      factionsTerm: { it: 'Fazioni & Organizzazioni', en: 'Factions & Organizations' },
      placesTerm: { it: 'luoghi', en: 'places' },
    },
  },
  {
    id: 'world-frieren',
    slug: 'frieren',
    title: 'Frieren',
    subtitle: {
      it: 'Oltre la fine del viaggio',
      en: 'Beyond Journey’s End',
    },
    description: {
      it: 'Il lungo cammino di Frieren verso Aureole è in arrivo: le terre del Nord, le città e i villaggi attraversati dalla compagnia dell’Eroe, i demoni e le prove da Mago di Prima Classe.',
      en: "Frieren's long road to Aureole is coming: the northern lands, the towns and villages crossed by the Hero's party, the demons and the First-Class Mage exams.",
    },
    status: 'coming_soon',
    theme: {
      primary: '#66c2b5',
      accent: '#c9a7e0',
      highlight: '#f0e6d2',
      background: '#0c0d11',
    },
    availableMapLevelIds: [],
    tags: ['fantasy', 'magia', 'kanehito yamada', 'shogakukan'],
    metadata: {
      author: 'Kanehito Yamada',
      artist: 'Tsukasa Abe',
      publisher: 'Shogakukan',
      yearStart: 2020,
    },
    config: {
      ability: {
        term: { it: 'Magia', en: 'Magic' },
        categoryTerm: { it: 'Tipo di magia', en: 'Magic type' },
      },
      characterRank: { term: { it: 'Classe di Mago', en: 'Mage class' } },
      nationTerm: { it: 'Regione', en: 'Region' },
      factionsTerm: { it: 'Gruppi & Fazioni', en: 'Groups & Factions' },
      placesTerm: { it: 'luoghi', en: 'places' },
    },
  },
  {
    id: 'world-toriko',
    slug: 'toriko',
    title: 'Toriko',
    subtitle: {
      it: 'Gourmet World · Cacciatori di cibo',
      en: 'Gourmet World · Gourmet Hunters',
    },
    description: {
      it: 'L’era del Gourmet è in arrivo: il Mondo Umano e il Gourmet World, gli ingredienti leggendari, i Quattro Re Celesti e la caccia al GOD.',
      en: 'The Gourmet Age is coming: the Human World and the Gourmet World, the legendary ingredients, the Four Heavenly Kings and the hunt for GOD.',
    },
    status: 'coming_soon',
    theme: {
      primary: '#1fa37a',
      accent: '#f2a413',
      highlight: '#e0453e',
      background: '#0c0d11',
    },
    availableMapLevelIds: [],
    tags: ['shonen', 'gourmet', 'mitsutoshi shimabukuro', 'jump'],
    metadata: {
      author: 'Mitsutoshi Shimabukuro',
      publisher: 'Shueisha',
      yearStart: 2008,
      yearEnd: 2016,
    },
    config: {
      ability: {
        term: { it: 'Tecniche Gourmet', en: 'Gourmet techniques' },
        categoryTerm: { it: 'Tipo', en: 'Type' },
      },
      nationTerm: { it: 'Mondo / Regione', en: 'World / Region' },
      factionsTerm: { it: 'Organizzazioni & Fazioni', en: 'Organizations & Factions' },
      placesTerm: { it: 'luoghi', en: 'places' },
    },
  },
  {
    id: 'world-fairytail',
    slug: 'fairytail',
    title: 'Fairy Tail',
    subtitle: {
      it: 'Fiore · Gilde di maghi',
      en: 'Fiore · Wizard Guilds',
    },
    description: {
      it: 'Il continente di Ishgar è in arrivo: il regno di Fiore con Magnolia e la gilda di Fairy Tail, i Grandi Giochi Magici, Edolas e Alvarez.',
      en: 'The continent of Ishgar is coming: the kingdom of Fiore with Magnolia and the Fairy Tail guild, the Grand Magic Games, Edolas and Alvarez.',
    },
    status: 'coming_soon',
    theme: {
      primary: '#d2232a',
      accent: '#f5b21a',
      highlight: '#3aa0d9',
      background: '#0c0d11',
    },
    availableMapLevelIds: [],
    tags: ['shonen', 'gilde', 'hiro mashima', 'kodansha'],
    metadata: {
      author: 'Hiro Mashima',
      publisher: 'Kodansha',
      yearStart: 2006,
      yearEnd: 2017,
    },
    config: {
      ability: {
        term: { it: 'Magia', en: 'Magic' },
        categoryTerm: { it: 'Tipo di magia', en: 'Magic type' },
      },
      characterRank: { term: { it: 'Grado di mago', en: 'Wizard rank' } },
      nationTerm: { it: 'Regno / Regione', en: 'Kingdom / Region' },
      factionsTerm: { it: 'Gilde & Fazioni', en: 'Guilds & Factions' },
      placesTerm: { it: 'luoghi', en: 'places' },
    },
  },
  {
    id: 'world-jujutsukaisen',
    slug: 'jujutsukaisen',
    title: 'Jujutsu Kaisen',
    subtitle: {
      it: 'Stregoni & Spiriti Malefici',
      en: 'Sorcerers & Cursed Spirits',
    },
    description: {
      it: 'Il Giappone degli stregoni è in arrivo: gli istituti di arti occulte di Tokyo e Kyoto, Shibuya e Shinjuku, il Culling Game e le dita di Sukuna.',
      en: "The sorcerers' Japan is coming: the Tokyo and Kyoto jujutsu high schools, Shibuya and Shinjuku, the Culling Game and Sukuna's fingers.",
    },
    status: 'coming_soon',
    theme: {
      primary: '#5a4b9c',
      accent: '#3f7fb5',
      highlight: '#c0392b',
      background: '#0c0d11',
    },
    availableMapLevelIds: [],
    tags: ['shonen', 'stregoni', 'gege akutami', 'jump'],
    metadata: {
      author: 'Gege Akutami',
      publisher: 'Shueisha',
      yearStart: 2018,
      yearEnd: 2024,
    },
    config: {
      ability: {
        term: { it: 'Tecniche Malefiche', en: 'Cursed techniques' },
        categoryTerm: { it: 'Tipo', en: 'Type' },
      },
      characterRank: { term: { it: 'Grado stregone', en: 'Sorcerer grade' } },
      nationTerm: { it: 'Regione / Prefettura', en: 'Region / Prefecture' },
      factionsTerm: { it: 'Fazioni & Organizzazioni', en: 'Factions & Organizations' },
      placesTerm: { it: 'luoghi', en: 'places' },
    },
  },
  {
    id: 'world-demonslayer',
    slug: 'demonslayer',
    title: 'Demon Slayer',
    subtitle: {
      it: 'Kimetsu no Yaiba · Era Taishō',
      en: 'Kimetsu no Yaiba · Taishō Era',
    },
    description: {
      it: 'Il Giappone dell’era Taishō è in arrivo: il Monte Sagiri e la Selezione Finale, il Quartiere a Luci Rosse, il Villaggio dei Forgiatori, la Corporazione Ammazzademoni e le Lune Crescenti.',
      en: 'Taishō-era Japan is coming: Mount Sagiri and the Final Selection, the Entertainment District, the Swordsmith Village, the Demon Slayer Corps and the Twelve Kizuki.',
    },
    status: 'coming_soon',
    theme: {
      primary: '#1f7a5a',
      accent: '#c1272d',
      highlight: '#e8b647',
      background: '#0c0d11',
    },
    availableMapLevelIds: [],
    tags: ['shonen', 'demoni', 'koyoharu gotouge', 'jump'],
    metadata: {
      author: 'Koyoharu Gotouge',
      publisher: 'Shueisha',
      yearStart: 2016,
      yearEnd: 2020,
    },
    config: {
      ability: {
        term: { it: 'Respirazioni & Arti Demoniache', en: 'Breathing styles & Blood Demon Arts' },
        categoryTerm: { it: 'Tipo', en: 'Type' },
      },
      characterRank: { term: { it: 'Grado', en: 'Rank' } },
      nationTerm: { it: 'Regione', en: 'Region' },
      factionsTerm: { it: 'Fazioni & Organizzazioni', en: 'Factions & Organizations' },
      placesTerm: { it: 'luoghi', en: 'places' },
    },
  },
];

/** Recupera un mondo tramite slug. */
export function findWorldBySlug(slug: string): AnimeWorld | undefined {
  return animeWorlds.find((w) => w.slug === slug);
}
