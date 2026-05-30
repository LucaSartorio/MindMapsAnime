import type { MapLevel } from '@/types';

/**
 * Map levels Hunter x Hunter.
 *
 * In questa fase la mappa è accantonata: esiste solo un world map level
 * placeholder (sfondo neutro generato localmente) per rendere il mondo
 * navigabile. La geografia reale (continenti, Continente Oscuro, ecc.)
 * verrà aggiunta in seguito mantenendo lo stesso viewBox.
 */
export const HXH_MAP_VIEWBOX = { width: 1500, height: 900 } as const;

export const hxhMapLevels: MapLevel[] = [
  {
    id: 'hxh-map-world',
    worldId: 'world-hunterxhunter',
    slug: 'world',
    name: 'Known World',
    localizedName: { it: 'Mondo Conosciuto', en: 'Known World' },
    description: {
      it: 'Mappa del mondo conosciuto di Hunter x Hunter (placeholder). Geografia in arrivo.',
      en: 'Map of the known Hunter x Hunter world (placeholder). Geography coming soon.',
    },
    backgroundAssetId: 'hxh-world-map-placeholder',
    width: HXH_MAP_VIEWBOX.width,
    height: HXH_MAP_VIEWBOX.height,
  },
];
