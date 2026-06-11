import type { MapLevel } from '@/types';

/**
 * Map levels One Piece.
 *
 * La world map usa come sfondo la mappa del mondo di One Piece (i quattro Mari,
 * la Red Line, la Grand Line con Paradise e New World e le due fasce di Calm
 * Belt). Tutte le coordinate di `location.x/y`, dei `svgPathD` dei boundary e dei
 * `labelPosition` sono espresse nel piano viewBox 2000 × 1000, che corrisponde
 * all'aspect ratio ~2:1 della mappa di riferimento.
 *
 * Se sostituisci l'immagine con una di proporzioni diverse, aggiorna
 * width/height mantenendo lo stesso aspect ratio per non disallineare i pin.
 * Conversione px → flow:  flowX = px_x / imgW * 2000 ,  flowY = px_y / imgH * 1000.
 */
export const ONEPIECE_MAP_VIEWBOX = { width: 2000, height: 1000 } as const;

/**
 * Dimensioni native (px) delle sotto-mappe che hanno un'immagine reale: il piano
 * viewBox coincide con i pixel dell'immagine, così i pin si esprimono in pixel e
 * l'immagine non viene distorta. Le sotto-mappe ancora a placeholder usano il
 * default 1200 × 800.
 */
const SUBMAP_DIMS: Record<string, { width: number; height: number }> = {
  skypiea: { width: 1061, height: 797 },
  alabasta: { width: 1192, height: 670 },
  wano: { width: 2000, height: 1406 },
  'enies-lobby': { width: 469, height: 600 },
  jaya: { width: 1192, height: 670 },
};
const dims = (slug: string) => SUBMAP_DIMS[slug] ?? { width: 1200, height: 800 };

/** Path locale dell'immagine di riferimento (vive in public/, servita alla root). */
export const ONEPIECE_WORLD_MAP_SRC = '/assets/worlds/onepiece/maps/onepiece-world-map.jpeg';

export const onepieceMapLevels: MapLevel[] = [
  {
    id: 'op-map-world',
    worldId: 'world-onepiece',
    slug: 'world',
    name: 'World Map',
    localizedName: { it: 'Mappa del Mondo', en: 'World Map' },
    description: {
      it: 'Mappa del mondo di One Piece: i quattro Mari (North, East, West, South Blue), la Red Line con Mary Geoise e Reverse Mountain, la Grand Line divisa tra Paradise e New World, e le due fasce di Calm Belt.',
      en: "Map of the One Piece world: the four Seas (North, East, West, South Blue), the Red Line with Mary Geoise and Reverse Mountain, the Grand Line split between Paradise and the New World, and the two Calm Belt bands.",
    },
    backgroundAssetId: 'op-world-map-reference',
    width: ONEPIECE_MAP_VIEWBOX.width,
    height: ONEPIECE_MAP_VIEWBOX.height,
  },
  {
    id: 'op-map-totland',
    worldId: 'world-onepiece',
    slug: 'totland',
    name: 'Totland (Whole Cake Island)',
    localizedName: { it: 'Totland (Whole Cake Island)', en: 'Totland (Whole Cake Island)' },
    description: {
      it: "Sotto-mappa del territorio di Big Mom: l'arcipelago di Totland e le sue isole-dolce attorno a Whole Cake Island. Posizioni concettuali.",
      en: "Sub-map of Big Mom's domain: the Totland archipelago and its sweets-islands around Whole Cake Island. Conceptual positions.",
    },
    parentLevelId: 'op-map-world',
    triggerLocationId: 'loc-op-whole-cake-island',
    backgroundAssetId: 'op-totland-submap-placeholder',
    width: 1200,
    height: 800,
  },
  {
    id: 'op-map-alabasta',
    worldId: 'world-onepiece',
    slug: 'alabasta',
    name: 'Alabasta (Sandy Island)',
    localizedName: { it: 'Alabasta (Isola Sandy)', en: 'Alabasta (Sandy Island)' },
    description: {
      it: "Sotto-mappa del regno desertico di Alabasta: la capitale Alubarna e le città dell'isola. Posizioni concettuali.",
      en: "Sub-map of the desert kingdom of Alabasta: the capital Alubarna and the island's towns. Conceptual positions.",
    },
    parentLevelId: 'op-map-world',
    triggerLocationId: 'loc-op-alabasta',
    backgroundAssetId: 'op-alabasta-submap-placeholder',
    ...dims('alabasta'),
  },
  {
    id: 'op-map-wano',
    worldId: 'world-onepiece',
    slug: 'wano',
    name: 'Wano Country',
    localizedName: { it: 'Paese di Wano', en: 'Wano Country' },
    description: {
      it: "Sotto-mappa del Paese di Wano: la Capitale dei Fiori, le regioni di Kuri e l'isola di Onigashima. Posizioni concettuali.",
      en: "Sub-map of Wano Country: the Flower Capital, the Kuri regions and Onigashima island. Conceptual positions.",
    },
    parentLevelId: 'op-map-world',
    triggerLocationId: 'loc-op-wano',
    backgroundAssetId: 'op-wano-submap-placeholder',
    ...dims('wano'),
  },
  {
    id: 'op-map-skypiea',
    worldId: 'world-onepiece',
    slug: 'skypiea',
    name: 'Skypiea',
    localizedName: { it: 'Skypiea', en: 'Skypiea' },
    description: {
      it: "Sotto-mappa dell'isola del cielo di Skypiea: Angel Island, l'Upper Yard, il Santuario di Dio e le rovine di Shandora. Posizioni concettuali.",
      en: "Sub-map of the sky island of Skypiea: Angel Island, the Upper Yard, God's Shrine and the ruins of Shandora. Conceptual positions.",
    },
    parentLevelId: 'op-map-world',
    triggerLocationId: 'loc-op-skypiea',
    backgroundAssetId: 'op-skypiea-submap-placeholder',
    ...dims('skypiea'),
  },
  {
    id: 'op-map-dressrosa',
    worldId: 'world-onepiece',
    slug: 'dressrosa',
    name: 'Dressrosa Kingdom',
    localizedName: { it: 'Regno di Dressrosa', en: 'Dressrosa Kingdom' },
    description: {
      it: "Sotto-mappa del regno di Dressrosa: il Palazzo Reale, il Colosseo Corrida, la città di Acacia e l'altopiano di Re Riku. Posizioni concettuali.",
      en: "Sub-map of the kingdom of Dressrosa: the Royal Palace, the Corrida Colosseum, the town of Acacia and King Riku's Plateau. Conceptual positions.",
    },
    parentLevelId: 'op-map-world',
    triggerLocationId: 'loc-op-dressrosa',
    backgroundAssetId: 'op-dressrosa-submap-placeholder',
    width: 1200,
    height: 800,
  },
  {
    id: 'op-map-sabaody',
    worldId: 'world-onepiece',
    slug: 'sabaody',
    name: 'Sabaody Archipelago',
    localizedName: { it: 'Arcipelago Sabaody', en: 'Sabaody Archipelago' },
    description: {
      it: "Sotto-mappa dell'Arcipelago Sabaody: i 79 boschi di mangrovie, la Casa d'Aste, il bar di Shakky, il parco di divertimenti e la zona della Marina. Posizioni concettuali.",
      en: "Sub-map of the Sabaody Archipelago: the 79 mangrove groves, the Auction House, Shakky's bar, the amusement park and the Marine zone. Conceptual positions.",
    },
    parentLevelId: 'op-map-world',
    triggerLocationId: 'loc-op-sabaody',
    backgroundAssetId: 'op-sabaody-submap-placeholder',
    width: 1200,
    height: 800,
  },
  {
    id: 'op-map-marineford',
    worldId: 'world-onepiece',
    slug: 'marineford',
    name: 'Marineford',
    localizedName: { it: 'Marineford', en: 'Marineford' },
    description: {
      it: "Sotto-mappa di Marineford: il patibolo dell'esecuzione, la piazza Oris, il quartier generale della Marina, la baia e le mura. Posizioni concettuali.",
      en: "Sub-map of Marineford: the execution platform, Oris Plaza, the Marine headquarters, the bay and the walls. Conceptual positions.",
    },
    parentLevelId: 'op-map-world',
    triggerLocationId: 'loc-op-marineford',
    backgroundAssetId: 'op-marineford-submap-placeholder',
    width: 1200,
    height: 800,
  },
  {
    id: 'op-map-egghead',
    worldId: 'world-onepiece',
    slug: 'egghead',
    name: 'Egghead',
    localizedName: { it: 'Egghead', en: 'Egghead' },
    description: {
      it: "Sotto-mappa dell'isola del futuro Egghead: la Labophase, la Fabriophase, Punk Records e le strutture del dottor Vegapunk. Posizioni concettuali.",
      en: "Sub-map of the island of the future Egghead: the Labophase, the Fabriophase, Punk Records and Dr. Vegapunk's facilities. Conceptual positions.",
    },
    parentLevelId: 'op-map-world',
    triggerLocationId: 'loc-op-egghead',
    backgroundAssetId: 'op-egghead-submap-placeholder',
    width: 1200,
    height: 800,
  },
  {
    id: 'op-map-fishman-island',
    worldId: 'world-onepiece',
    slug: 'fishman-island',
    name: 'Fish-Man Island',
    localizedName: { it: 'Isola degli Uomini-Pesce', en: 'Fish-Man Island' },
    description: {
      it: "Sotto-mappa del regno sottomarino: il Palazzo Ryugu, la Piazza Gyoncorde, la Collina dei Coralli, il Quartiere degli Uomini-Pesce e la Foresta Marina. Posizioni concettuali.",
      en: "Sub-map of the underwater kingdom: Ryugu Palace, Gyoncorde Plaza, Coral Hill, the Fish-Man District and the Sea Forest. Conceptual positions.",
    },
    parentLevelId: 'op-map-world',
    triggerLocationId: 'loc-op-fishman-island',
    backgroundAssetId: 'op-fishman-submap-placeholder',
    width: 1200,
    height: 800,
  },
  ...([
    ['impel-down', 'loc-op-impel-down', 'Impel Down', 'Impel Down',
      "Sotto-mappa della prigione sottomarina: i sei livelli infernali, il Newkama Land e l'ingresso.",
      "Sub-map of the underwater prison: the six infernal levels, Newkama Land and the entrance."],
    ['enies-lobby', 'loc-op-enies-lobby', 'Enies Lobby', 'Enies Lobby',
      "Sotto-mappa dell'isola giudiziaria: la Torre della Giustizia, il tribunale, le Porte della Giustizia e il Ponte dell'Esitazione.",
      "Sub-map of the judicial island: the Tower of Justice, the courthouse, the Gates of Justice and the Bridge of Hesitation."],
    ['water-seven', 'loc-op-water-seven', 'Water Seven', 'Water Seven',
      "Sotto-mappa della città dell'acqua: la Galley-La, i cantieri, la stazione del Sea Train, la villa di Iceburg e Scrap Island.",
      "Sub-map of the city of water: Galley-La, the shipyards, the Sea Train station, Iceburg's mansion and Scrap Island."],
    ['thriller-bark', 'loc-op-thriller-bark', 'Thriller Bark', 'Thriller Bark',
      "Sotto-mappa dell'isola-galeone: la villa di Hogback, la foresta, il cimitero e il giardino di Perona.",
      "Sub-map of the galleon-island: Hogback's mansion, the forest, the graveyard and Perona's garden."],
    ['zou', 'loc-op-zou', 'Zou', 'Zou',
      "Sotto-mappa sul dorso di Zunesha: il Ducato di Mokomo, la Foresta della Balena e la Foresta del Ventre Destro.",
      "Sub-map on Zunesha's back: the Mokomo Dukedom, the Whale Forest and the Right Belly Forest."],
    ['punk-hazard', 'loc-op-punk-hazard', 'Punk Hazard', 'Punk Hazard',
      "Sotto-mappa dell'isola di fuoco e ghiaccio: il lato in fiamme, il lato gelato e il laboratorio di Caesar.",
      "Sub-map of the fire-and-ice island: the burning side, the frozen side and Caesar's lab."],
    ['amazon-lily', 'loc-op-amazon-lily', 'Amazon Lily', 'Amazon Lily',
      "Sotto-mappa dell'isola delle Kuja: il castello, l'arena, i bagni e il villaggio delle guerriere.",
      "Sub-map of the Kuja island: the castle, the arena, the bath house and the warriors' village."],
    ['drum-island', 'loc-op-drum-island', 'Drum Island', 'Drum Island (Sakura Kingdom)',
      "Sotto-mappa dell'isola invernale: il Castello di Drum, Bighorn e i villaggi del regno dei medici.",
      "Sub-map of the winter island: Drum Castle, Bighorn and the villages of the kingdom of doctors."],
  ] as const).map(([slug, trigger, nit, nen, dit, den]) => ({
    id: `op-map-${slug}`,
    worldId: 'world-onepiece',
    slug,
    name: nen,
    localizedName: { it: nit, en: nen },
    description: { it: dit, en: den },
    parentLevelId: 'op-map-world' as const,
    triggerLocationId: trigger,
    backgroundAssetId: `op-${slug}-submap-placeholder`,
    ...dims(slug),
  })),
  ...([
    ['mary-geoise', 'loc-op-mary-geoise', 'Mary Geoise', 'Mary Geoise',
      "Sotto-mappa della Terra Santa: il Pangea Castle, il Trono Vuoto, la sala della Reverie e il quartiere degli schiavi.",
      "Sub-map of the Holy Land: Pangaea Castle, the Empty Throne, the Reverie hall and the slave quarters."],
    ['dawn-island', 'loc-op-dawn-island', 'Dawn Island', 'Dawn Island',
      "Sotto-mappa dell'isola natale di Rufy: Foosha, il Regno di Goa, l'Alta Città, il Gray Terminal e il Monte Colubo.",
      "Sub-map of Luffy's home island: Foosha, the Goa Kingdom, High Town, the Gray Terminal and Mt. Colubo."],
    ['loguetown', 'loc-op-loguetown', 'Loguetown', 'Loguetown',
      "Sotto-mappa della «città dell'inizio e della fine»: il patibolo di Roger, la via principale e il negozio di spade.",
      "Sub-map of the 'town of the beginning and the end': Roger's scaffold, the main street and the sword shop."],
    ['jaya', 'loc-op-jaya', 'Jaya', 'Jaya',
      "Sotto-mappa dell'isola dei sogni: Mock Town, la casa di Mont Blanc Cricket e il punto della Knock-Up Stream.",
      "Sub-map of the island of dreams: Mock Town, Mont Blanc Cricket's house and the Knock-Up Stream site."],
    ['ohara', 'loc-op-ohara', 'Ohara', 'Ohara',
      "Sotto-mappa dell'isola degli studiosi: l'Albero della Conoscenza, la biblioteca e il porto, distrutti dal Buster Call.",
      "Sub-map of the scholars' island: the Tree of Knowledge, the library and the harbor, destroyed by the Buster Call."],
    ['elbaf', 'loc-op-elbaf', 'Elbaf', 'Elbaf',
      "Sotto-mappa della terra dei giganti: il villaggio dei guerrieri, l'albero sacro e il campo di battaglia dei duelli.",
      "Sub-map of the land of the giants: the warriors' village, the sacred tree and the dueling battlefield."],
    ['god-valley', 'loc-op-god-valley', 'God Valley', 'God Valley',
      "Sotto-mappa dell'isola scomparsa: il terreno di caccia dei Draghi Celesti, teatro dell'incidente di 38 anni fa.",
      "Sub-map of the vanished island: the Celestial Dragons' hunting ground, stage of the incident 38 years ago."],
    ['germa-kingdom', 'loc-op-germa-kingdom', 'Germa Kingdom', 'Germa Kingdom',
      "Sotto-mappa del regno militare itinerante: le navi-lumaca del Germa 66 e il laboratorio dei Vinsmoke.",
      "Sub-map of the roving militarist kingdom: the snail-ships of Germa 66 and the Vinsmoke laboratory."],
    ['space', 'loc-op-space', 'Spazio', 'Space',
      "Sotto-mappa dello spazio (Operazioni Spaziali di Enel): la Luna, l'antica città lunare di Birka, i Pirati Spaziali e la Stella Polare. Doppio clic su «Terra» per tornare alla mappa principale.",
      "Sub-map of space (Enel's Space Operations): the Moon, the ancient lunar city of Birka, the Space Pirates and the Polar Star. Double-click 'Earth' to return to the main map."],
  ] as const).map(([slug, trigger, nit, nen, dit, den]) => ({
    id: `op-map-${slug}`,
    worldId: 'world-onepiece',
    slug,
    name: nen,
    localizedName: { it: nit, en: nen },
    description: { it: dit, en: den },
    parentLevelId: 'op-map-world' as const,
    triggerLocationId: trigger,
    backgroundAssetId: `op-${slug}-submap-placeholder`,
    ...dims(slug),
  })),
];
