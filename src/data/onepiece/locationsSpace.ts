import type { Location } from '@/types';

/**
 * «Spazio» e «Isola dei Cecchini»: due chicche della lore di One Piece collocate
 * sulla Red Line (le strisce rosse ai bordi della mappa del mondo).
 *
 * - SPAZIO: porta alla sotto-mappa dello spazio, che riprende le «Grandi
 *   Operazioni Spaziali di Enel» (cover story dopo Skypiea): la Luna, l'antica
 *   città lunare di Birka, i Pirati Spaziali e la Stella Polare. Dalla sotto-mappa
 *   il pin «Terra» riporta alla mappa principale.
 * - ISOLA DEI CECCHINI: la leggendaria patria di «Sogeking», alter ego di Usop.
 *
 * Coordinate sul piano viewBox 2000 × 1000 (mappa del mondo) e 1200 × 800 (Spazio).
 */
export const onepieceLocationsSpace: Location[] = [
  /* ----------------------- Mappa del mondo (Red Line) ----------------------- */
  {
    id: 'loc-op-space',
    worldId: 'world-onepiece',
    mapLevelId: 'op-map-world',
    name: 'Space',
    localizedName: { it: 'Spazio', en: 'Space' },
    type: 'sacred_place',
    x: 30,
    y: 80,
    shortDescription: {
      it: "Oltre il cielo del Pianeta Blu si apre lo spazio. Doppio clic per esplorare la Luna, l'antica città di Birka e le rotte percorse da Enel dopo Skypiea.",
      en: "Beyond the Blue Planet's sky lies space. Double-click to explore the Moon, the ancient city of Birka and the routes Enel took after Skypiea.",
    },
    longDescription: {
      it: "Nelle «Grandi Operazioni Spaziali di Enel» (la cover story successiva a Skypiea), il «Dio» Enel raggiunge la Luna a bordo dell'arca Maxim e vi scopre le proprie radici. Questa sotto-mappa raccoglie quei luoghi: la Luna, Birka, i Pirati Spaziali e la Stella Polare.",
      en: "In 'Enel's Great Space Operations' (the cover story following Skypiea), the self-proclaimed 'God' Enel reaches the Moon aboard the Maxim ark and discovers his own roots. This sub-map gathers those places: the Moon, Birka, the Space Pirates and the Polar Star.",
    },
    subMapLevelId: 'op-map-space',
    characterIds: ['char-op-enel'],
    arcIds: ['arc-op-skypiea'],
    importance: 'secondary',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['spazio', 'enel', 'luna', 'cover-story'],
  },
  {
    id: 'loc-op-sniper-island',
    worldId: 'world-onepiece',
    mapLevelId: 'op-map-world',
    name: 'Sniper Island',
    localizedName: { it: 'Isola dei Cecchini', en: 'Sniper Island' },
    type: 'landmark',
    x: 30,
    y: 905,
    shortDescription: {
      it: "La leggendaria isola da cui proverrebbe «Sogeking», il misterioso eroe mascherato dei cecchini… in realtà Usop sotto mentite spoglie.",
      en: "The legendary island said to be home to 'Sogeking', the mysterious masked hero of snipers… in truth Usopp in disguise.",
    },
    longDescription: {
      it: "Quando a Water Seven Usop si separa dalla ciurma, riappare a Enies Lobby con la maschera di «Sogeking», dichiarando di venire dall'Isola dei Cecchini. È lui a incendiare la bandiera del Governo Mondiale, sancendo la dichiarazione di guerra dei Cappello di Paglia. Una delle gag più amate della serie.",
      en: "After parting from the crew at Water Seven, Usopp reappears at Enies Lobby wearing the 'Sogeking' mask, claiming to hail from Sniper Island. It is he who burns the World Government flag, sealing the Straw Hats' declaration of war. One of the series' most beloved gags.",
    },
    characterIds: ['char-op-usopp'],
    eventIds: ['evt-op-declaration-war'],
    arcIds: ['arc-op-enies-lobby'],
    importance: 'secondary',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['sogeking', 'usop', 'gag', 'enies-lobby'],
  },

  /* ----------------------------- Sotto-mappa Spazio ----------------------------- */
  {
    id: 'loc-op-space-terra',
    worldId: 'world-onepiece',
    mapLevelId: 'op-map-space',
    name: 'Earth',
    localizedName: { it: 'Terra', en: 'Earth' },
    type: 'landmark',
    x: 600,
    y: 660,
    shortDescription: {
      it: "Il Pianeta Blu, il mondo di One Piece visto dallo spazio. Doppio clic per tornare alla mappa principale.",
      en: "The Blue Planet, the world of One Piece seen from space. Double-click to return to the main map.",
    },
    longDescription: {
      it: "Dalla Luna, gli antichi popoli (Skypiani, Shandia e Birkani) calarono sul Pianeta Blu quando le risorse del loro mondo si esaurirono. Questo pin riporta alla mappa principale del mondo.",
      en: "From the Moon, the ancient peoples (Skypieans, Shandia and Birkans) descended to the Blue Planet when their world's resources ran out. This pin returns you to the main world map.",
    },
    subMapLevelId: 'op-map-world',
    importance: 'main',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['spazio', 'pianeta-blu', 'ritorno'],
  },
  {
    id: 'loc-op-space-luna',
    worldId: 'world-onepiece',
    mapLevelId: 'op-map-space',
    name: 'Moon',
    localizedName: { it: 'Luna', en: 'Moon' },
    type: 'sacred_place',
    x: 500,
    y: 400,
    shortDescription: {
      it: "La Luna. Enel vi giunse sull'arca Maxim dopo Skypiea, scoprendo sotto la sua crosta una città in rovina e antichi automi.",
      en: "The Moon. Enel reached it on the Maxim ark after Skypiea, finding a ruined city and ancient automata beneath its crust.",
    },
    longDescription: {
      it: "Inseguendo il sogno della «Fairy Vearth», la terra infinita, Enel volò sulla Luna. Lì le sue scariche del Frutto Gomu… del Frutto Fulmine risvegliarono gli automi e l'intera città lunare, rivelandogli le sue vere origini.",
      en: "Chasing the dream of the 'Fairy Vearth', the endless land, Enel flew to the Moon. There the discharges of his Rumble-Rumble Fruit reawakened the automata and the whole lunar city, revealing his true origins.",
    },
    characterIds: ['char-op-enel'],
    eventIds: ['evt-op-enel-moon'],
    arcIds: ['arc-op-skypiea'],
    importance: 'secondary',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['spazio', 'luna', 'enel', 'automi'],
  },
  {
    id: 'loc-op-space-birka',
    worldId: 'world-onepiece',
    mapLevelId: 'op-map-space',
    name: 'Birka',
    localizedName: { it: 'Birka', en: 'Birka' },
    type: 'ruins',
    x: 685,
    y: 400,
    shortDescription: {
      it: "L'antica città lunare da cui discendono Skypiani, Shandia e Birkani (gli antenati di Enel), che la lasciarono per il Pianeta Blu.",
      en: "The ancient lunar city from which the Skypieans, Shandia and Birkans (Enel's ancestors) descend, who left it for the Blue Planet.",
    },
    longDescription: {
      it: "Birka è il nome della città sepolta sotto la crosta lunare e, insieme, dell'isola del cielo natale di Enel — che egli stesso distrusse. Un murale lunare raffigura i popoli alati che, esaurite le risorse, scesero verso il mare e i cieli del Pianeta Blu.",
      en: "Birka is the name of the city buried beneath the Moon's crust and, at the same time, of Enel's home sky island — which he himself destroyed. A lunar mural depicts the winged peoples who, their resources depleted, descended toward the sea and skies of the Blue Planet.",
    },
    characterIds: ['char-op-enel'],
    eventIds: ['evt-op-enel-moon'],
    arcIds: ['arc-op-skypiea'],
    importance: 'secondary',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['spazio', 'birka', 'luna', 'enel'],
  },
  {
    id: 'loc-op-space-polar-star',
    worldId: 'world-onepiece',
    mapLevelId: 'op-map-space',
    name: 'Polar Star',
    localizedName: { it: 'Stella Polare', en: 'Polar Star' },
    type: 'landmark',
    x: 490,
    y: 165,
    shortDescription: {
      it: "La Stella Polare, eterno punto di riferimento dei naviganti del Pianeta Blu. Dà il nome alle Isole della Stella Polare del Nuovo Mondo, dove sorge Drum.",
      en: "The Polar Star, the eternal reference point of the Blue Planet's navigators. It lends its name to the New World's Polestar Islands, home of Drum.",
    },
    longDescription: {
      it: "Mentre il Log Pose segue il magnetismo delle isole, la Stella Polare resta il riferimento celeste immutabile dei marinai. Le «Polestar Islands» del Nuovo Mondo — tra cui Drum/Sakura — prendono il nome da essa.",
      en: "While the Log Pose follows the islands' magnetism, the Polar Star remains the sailors' unchanging celestial reference. The New World's 'Polestar Islands' — among them Drum/Sakura — are named after it.",
    },
    importance: 'minor',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['spazio', 'stella-polare', 'navigazione'],
  },
  {
    id: 'loc-op-space-pirates',
    worldId: 'world-onepiece',
    mapLevelId: 'op-map-space',
    name: 'Space Pirates',
    localizedName: { it: 'Pirati Spaziali', en: 'Space Pirates' },
    type: 'hideout',
    x: 880,
    y: 160,
    shortDescription: {
      it: "Una spietata banda di Pirati Spaziali che minacciava gli automi della Luna: Enel li annientò con incredibile facilità.",
      en: "A vicious band of Space Pirates that threatened the Moon's automata: Enel wiped them out with incredible ease.",
    },
    longDescription: {
      it: "Nelle Operazioni Spaziali di Enel, i Pirati Spaziali scavano sulla Luna per depredarne i tesori, minacciando gli automi appena risvegliati. Enel li sbaraglia e accetta la fedeltà degli automi, diventando il signore del suo nuovo esercito lunare.",
      en: "In Enel's Space Operations, the Space Pirates dig on the Moon to plunder its treasures, threatening the newly awakened automata. Enel routs them and accepts the automata's loyalty, becoming lord of his new lunar army.",
    },
    characterIds: ['char-op-enel'],
    eventIds: ['evt-op-enel-moon'],
    arcIds: ['arc-op-skypiea'],
    importance: 'minor',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['spazio', 'pirati-spaziali', 'enel'],
  },
];
