import type { MapLevel } from '@/types';

/**
 * Map levels Hunter x Hunter.
 *
 * La world map usa come sfondo la mappa di riferimento (fan-made) del
 * "Known World". Tutte le coordinate di `location.x/y`, dei `svgPathD` dei
 * boundary e dei `labelPosition` sono espresse nel piano viewBox
 * 2000 × 1187, che corrisponde all'aspect ratio del PNG di riferimento
 * (5921 × 3513 px ≈ 1.685).
 *
 * Se sostituisci il PNG con uno di proporzioni diverse, aggiorna
 * width/height mantenendo lo stesso aspect ratio per non disallineare i pin.
 */
export const HXH_MAP_VIEWBOX = { width: 2000, height: 1187 } as const;

/** Path locale dell'immagine di riferimento (vive in public/, servita alla root). */
export const HXH_WORLD_MAP_SRC = '/assets/worlds/hunterxhunter/maps/hxh-world-map.webp';

export const hxhMapLevels: MapLevel[] = [
  {
    id: 'hxh-map-world',
    worldId: 'world-hunterxhunter',
    slug: 'world',
    name: 'Known World',
    localizedName: { it: 'Mondo Conosciuto', en: 'Known World' },
    description: {
      it: 'Mappa del mondo conosciuto di Hunter x Hunter: i continenti del Mondo Conosciuto entro il confine, il Lago Mobius e il Continente Oscuro che lo circonda.',
      en: 'Map of the Hunter x Hunter known world: the Known World continents within the border, Lake Mobius and the surrounding Dark Continent.',
    },
    backgroundAssetId: 'hxh-world-map-reference',
    width: HXH_MAP_VIEWBOX.width,
    height: HXH_MAP_VIEWBOX.height,
  },

  /* ===================== SOTTO-MAPPE (drill-down) ===================== */
  // Mappe SVG originali (scripts/mapgen/hxh.py) su un piano dedicato. Si aprono
  // con doppio click sul pin "trigger" della world map (subMapLevelId).
  {
    id: 'hxh-map-heavens-arena',
    worldId: 'world-hunterxhunter',
    slug: 'heavens-arena',
    name: 'Heavens Arena',
    localizedName: { it: 'Torre Celeste · i piani', en: 'Heavens Arena · the floors' },
    description: {
      it: 'Sotto-mappa schematica della Torre Celeste: i piani-chiave dove si combatte e si impara il Nen. Posizioni concettuali.',
      en: 'Schematic sub-map of Heavens Arena: the key floors where one fights and learns Nen. Conceptual positions.',
    },
    parentLevelId: 'hxh-map-world',
    triggerLocationId: 'loc-hxh-heavens-arena',
    backgroundAssetId: 'hxh-heavens-arena-map',
    width: 1000,
    height: 1400,
  },
  {
    id: 'hxh-map-zoldyck',
    worldId: 'world-hunterxhunter',
    slug: 'zoldyck-estate',
    name: 'Kukuroo Mountain',
    localizedName: { it: 'Monte Kukuroo · Tenuta Zoldyck', en: 'Kukuroo Mountain · Zoldyck Estate' },
    description: {
      it: 'Sotto-mappa della tenuta degli Zoldyck sul Monte Kukuroo: dalla Porta della Prova alla residenza. Posizioni concettuali.',
      en: 'Sub-map of the Zoldyck estate on Kukuroo Mountain: from the Testing Gate to the residence. Conceptual positions.',
    },
    parentLevelId: 'hxh-map-world',
    triggerLocationId: 'loc-hxh-zoldyck-estate',
    backgroundAssetId: 'hxh-zoldyck-estate-map',
    width: 1200,
    height: 900,
  },
  {
    id: 'hxh-map-greed-island',
    worldId: 'world-hunterxhunter',
    slug: 'greed-island',
    name: 'Greed Island',
    localizedName: { it: 'Greed Island · il gioco', en: 'Greed Island · the game' },
    description: {
      it: 'Sotto-mappa del mondo-gioco di Greed Island: le città-carta principali. Posizioni concettuali.',
      en: 'Sub-map of the Greed Island game world: the main card-towns. Conceptual positions.',
    },
    parentLevelId: 'hxh-map-world',
    triggerLocationId: 'loc-hxh-greed-island',
    backgroundAssetId: 'hxh-greed-island-map',
    width: 1300,
    height: 900,
  },
  {
    id: 'hxh-map-east-gorteau',
    worldId: 'world-hunterxhunter',
    slug: 'east-gorteau-palace',
    name: 'East Gorteau Palace',
    localizedName: { it: 'Palazzo di East Gorteau', en: 'East Gorteau Palace' },
    description: {
      it: 'Sotto-mappa del palazzo reale di East Gorteau: le aree dello scontro finale con le Formiche Chimera. Posizioni concettuali.',
      en: 'Sub-map of the East Gorteau royal palace: the areas of the final clash with the Chimera Ants. Conceptual positions.',
    },
    parentLevelId: 'hxh-map-world',
    triggerLocationId: 'loc-hxh-east-gorteau',
    backgroundAssetId: 'hxh-east-gorteau-palace-map',
    width: 1200,
    height: 900,
  },
  {
    id: 'hxh-map-yorknew',
    worldId: 'world-hunterxhunter',
    slug: 'yorknew',
    name: 'Yorknew City',
    localizedName: { it: 'Città di Yorknew', en: 'Yorknew City' },
    description: {
      it: "Sotto-mappa originale di Yorknew durante l'asta di settembre: il Cemetery Building, il centro, il mercato libero, il covo della Brigata, il deserto e l'aeroporto di Lingon. Posizioni concettuali.",
      en: "Original sub-map of Yorknew during the September auction: the Cemetery Building, downtown, the free market, the Troupe's hideout, the wasteland and Lingon Airport. Conceptual positions.",
    },
    parentLevelId: 'hxh-map-world',
    triggerLocationId: 'loc-hxh-yorknew',
    backgroundAssetId: 'hxh-yorknew-map',
    width: 1400,
    height: 1000,
  },
  {
    id: 'hxh-map-whale-island',
    worldId: 'world-hunterxhunter',
    slug: 'whale-island',
    name: 'Whale Island',
    localizedName: { it: 'Isola Balena', en: 'Whale Island' },
    description: {
      it: "Sotto-mappa originale dell'isola natale di Gon: il porto, la casa di Mito, la foresta e il lago del Signore del Lago. Posizioni concettuali.",
      en: "Original sub-map of Gon's home island: the harbor, Mito's house, the forest and the Lake of the Lord. Conceptual positions.",
    },
    parentLevelId: 'hxh-map-world',
    triggerLocationId: 'loc-hxh-whale-island',
    backgroundAssetId: 'hxh-whale-island-map',
    width: 1200,
    height: 900,
  },
  {
    id: 'hxh-map-ngl',
    worldId: 'world-hunterxhunter',
    slug: 'ngl',
    name: 'NGL',
    localizedName: { it: 'NGL · Neo-Green Life', en: 'NGL · Neo-Green Life' },
    description: {
      it: "Sotto-mappa originale della regione autonoma NGL nell'arco delle Formiche Chimera: posto di confine, costa, nido della Regina e radura dell'ultimo scontro di Kite. Posizioni concettuali.",
      en: "Original sub-map of the NGL autonomous region in the Chimera Ant arc: border checkpoint, shore, the Queen's nest and the clearing of Kite's last stand. Conceptual positions.",
    },
    parentLevelId: 'hxh-map-world',
    triggerLocationId: 'loc-hxh-ngl',
    backgroundAssetId: 'hxh-ngl-map',
    width: 1300,
    height: 900,
  },
  {
    id: 'hxh-map-black-whale',
    worldId: 'world-hunterxhunter',
    slug: 'black-whale',
    name: 'Black Whale 1',
    localizedName: { it: 'Black Whale 1 · i Tier', en: 'Black Whale 1 · the Tiers' },
    description: {
      it: 'Sezione schematica originale della nave reale di Kakin: il Tier 1 dei reali, i ponti intermedi e quelli inferiori. Posizioni concettuali.',
      en: "Original schematic cross-section of the Kakin royal ship: the royals' Tier 1, the middle decks and the lower decks. Conceptual positions.",
    },
    parentLevelId: 'hxh-map-world',
    triggerLocationId: 'loc-hxh-black-whale',
    backgroundAssetId: 'hxh-black-whale-map',
    width: 1400,
    height: 900,
  },
];
