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
  },
  {
    id: 'world-hunterxhunter',
    slug: 'hunterxhunter',
    title: 'Hunter x Hunter',
    subtitle: {
      it: 'Un mondo di Hunter · In arrivo',
      en: 'A world of Hunters · Coming soon',
    },
    description: {
      it: 'Il mondo di Gon, Killua e degli Hunter è in arrivo. Esploreremo Yorknew, Greed Island, il Continente Oscuro e i territori conosciuti.',
      en: "Gon, Killua and the Hunters' world is coming. We'll explore Yorknew, Greed Island, the Dark Continent and the known territories.",
    },
    status: 'coming_soon',
    theme: {
      primary: '#1f9aff',
      accent: '#f06600',
      highlight: '#e10b0b',
    },
    availableMapLevelIds: [],
    tags: ['shonen', 'hunter', 'yoshihiro togashi', 'jump'],
    metadata: {
      author: 'Yoshihiro Togashi',
      publisher: 'Shueisha',
      yearStart: 1998,
    },
  },
  // Slot futuri: One Piece, Dragon Ball, Attack on Titan, Bleach, Jujutsu Kaisen.
];

/** Recupera un mondo tramite slug. */
export function findWorldBySlug(slug: string): AnimeWorld | undefined {
  return animeWorlds.find((w) => w.slug === slug);
}
