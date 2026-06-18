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
  // Schemi concettuali: posizioni indicative su un piano dedicato. Si aprono
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
    width: 1200,
    height: 900,
  },
];
