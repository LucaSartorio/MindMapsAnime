import type { Location } from '@/types';

/**
 * I «Tre Mondi» dei Testi Harley di Elbaf (One Piece, cap. 1138): l'antica
 * scrittura tradotta da Nico Robin divide la storia in tre ere/«Mondi». Lore
 * recentissima della Saga Finale. Tre pin separati in basso a destra sulla
 * mappa del mondo (piano viewBox 2000 × 1000).
 */
export const onepieceLocationsThreeWorlds: Location[] = [
  {
    id: 'loc-op-first-world',
    worldId: 'world-onepiece',
    mapLevelId: 'op-map-world',
    name: 'First World',
    localizedName: { it: 'Primo Mondo', en: 'First World' },
    type: 'sacred_place',
    x: 1960,
    y: 800,
    shortDescription: {
      it: "Il «Primo Mondo» dei Testi Harley: un'antichissima civiltà incredibilmente avanzata, in cui ardeva già la fonte di energia infinita — le «fiamme» — che secoli dopo Vegapunk inseguirà.",
      en: "The 'First World' of the Harley texts: an extremely ancient, incredibly advanced civilization where the infinite energy source — the 'flames' — that Vegapunk would later chase already burned.",
    },
    longDescription: {
      it: "Primo capitolo dei Testi Harley, l'antica scrittura di Elbaf tradotta da Nico Robin. Racconta di un'epoca remota in cui la Terra conobbe una civiltà tecnologicamente superiore alla nostra — di cui l'Antico Regno potrebbe essere un'erede — alimentata dal fuoco infinito, la stessa energia della «Mother Flame» bramata dal Governo Mondiale.",
      en: "The first chapter of the Harley texts, Elbaf's ancient scripture translated by Nico Robin. It tells of a remote age when the Earth knew a civilization more technologically advanced than ours — of which the Ancient Kingdom may be an heir — powered by infinite fire, the same energy as the 'Mother Flame' coveted by the World Government.",
    },
    characterIds: ['char-op-robin', 'char-op-vegapunk'],
    eventIds: ['evt-op-harley-texts'],
    importance: 'secondary',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['testi-harley', 'tre-mondi', 'elbaf', 'lore'],
  },
  {
    id: 'loc-op-second-world',
    worldId: 'world-onepiece',
    mapLevelId: 'op-map-world',
    name: 'Second World',
    localizedName: { it: 'Secondo Mondo', en: 'Second World' },
    type: 'sacred_place',
    x: 1960,
    y: 860,
    shortDescription: {
      it: "Il «Secondo Mondo»: il Secolo Vuoto. L'era di Joy Boy — il «Sole» Nika —, della Grande Guerra e del diluvio che sommerse e quasi distrusse il mondo.",
      en: "The 'Second World': the Void Century. The era of Joy Boy — the 'Sun' Nika —, of the Great War and the flood that submerged and nearly destroyed the world.",
    },
    longDescription: {
      it: "Secondo capitolo dei Testi Harley. Corrisponde al Secolo Vuoto: Joy Boy vi è chiamato «il Sole» che «diffuse le fiamme della guerra» — un'immagine ambigua che lascia intendere un ruolo controverso nello scatenarsi del conflitto. Quel mondo finì sommerso da un grande diluvio, lasciando solo i Poneglyph a custodirne la memoria.",
      en: "The second chapter of the Harley texts. It corresponds to the Void Century: Joy Boy is called 'the Sun' who 'spread the fires of war' — an ambiguous image hinting at a controversial role in igniting the conflict. That world ended submerged by a great flood, leaving only the Poneglyphs to keep its memory.",
    },
    characterIds: ['char-op-robin'],
    eventIds: ['evt-op-harley-texts'],
    importance: 'secondary',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['testi-harley', 'tre-mondi', 'secolo-vuoto', 'joy-boy', 'lore'],
  },
  {
    id: 'loc-op-third-world',
    worldId: 'world-onepiece',
    mapLevelId: 'op-map-world',
    name: 'Third World',
    localizedName: { it: 'Terzo Mondo', en: 'Third World' },
    type: 'sacred_place',
    x: 1960,
    y: 920,
    shortDescription: {
      it: "Il «Terzo Mondo»: la nostra era, segnata dal ritorno del Dio del Sole Nika. I Testi profetizzano che egli «danzerà e riderà guidando il mondo verso la sua fine».",
      en: "The 'Third World': the present era, marked by the return of the Sun God Nika. The texts foretell that he 'will dance and laugh as he leads the world to its end'.",
    },
    longDescription: {
      it: "Terzo e ultimo capitolo dei Testi Harley. È l'epoca attuale: con Rufy erede del Dio del Sole Nika, si profila la più grande guerra di sempre contro il Governo Mondiale e i Draghi Celesti guidati da Imu. La profezia annuncia un nuovo, decisivo scontro «quando i due si incontreranno».",
      en: "The third and final chapter of the Harley texts. It is the present age: with Luffy as heir to the Sun God Nika, the greatest war of all time looms against the World Government and the Celestial Dragons led by Imu. The prophecy heralds a new, decisive clash 'when the two shall meet'.",
    },
    characterIds: ['char-op-luffy', 'char-op-imu', 'char-op-robin'],
    eventIds: ['evt-op-harley-texts'],
    importance: 'secondary',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['testi-harley', 'tre-mondi', 'nika', 'imu', 'lore'],
  },
];
