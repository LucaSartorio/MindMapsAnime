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

/** Path locale del PNG di riferimento (vive in public/, servito alla root). */
export const HXH_WORLD_MAP_SRC = '/assets/worlds/hunterxhunter/maps/hxh-world-map.png';

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
];
