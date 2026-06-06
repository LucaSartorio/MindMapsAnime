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
    availableMapLevelIds: ['hxh-map-world'],
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
    availableMapLevelIds: ['op-map-world'],
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
        ],
      },
      nationTerm: { it: 'Mare / Isola', en: 'Sea / Island' },
      factionsTerm: { it: 'Ciurme & Fazioni', en: 'Crews & Factions' },
      placesTerm: { it: 'luoghi', en: 'places' },
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
      it: 'Il mondo di Goku è in arrivo. Dalla ricerca delle sette Sfere del Drago ai tornei di arti marziali, fino agli scontri contro Freezer, Cell e Majin Bu.',
      en: "Goku's world is coming. From the search for the seven Dragon Balls to the martial arts tournaments, up to the battles against Frieza, Cell and Majin Buu.",
    },
    status: 'coming_soon',
    theme: {
      primary: '#f5a01f',
      accent: '#2f7fe0',
      highlight: '#e10b0b',
    },
    availableMapLevelIds: [],
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
