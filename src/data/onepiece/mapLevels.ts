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
    width: 1200,
    height: 800,
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
    width: 1200,
    height: 800,
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
    width: 1200,
    height: 800,
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
];
