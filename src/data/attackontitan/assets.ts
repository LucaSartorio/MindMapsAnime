import type { AssetReference } from '@/types';
import { originalMapAsset } from '../originalMapAssets';
import { AOT_MAP_SRC } from './mapConstants';

const map = (id: string, name: string, url: string) =>
  originalMapAsset({
    id,
    worldId: 'world-attackontitan',
    name: `Attack on Titan · ${name}`,
    url,
    script: 'scripts/mapgen/aot.py',
    owner: 'Hajime Isayama / Kodansha',
  });

/**
 * Asset di Attack on Titan. Nessuna immagine ufficiale: le sette mappe sono disegni
 * ORIGINALI (CC0) generati da `scripts/mapgen/aot.py`; i contorni del Mondo e di
 * Paradis derivano dai dati Natural Earth (dominio pubblico), ribaltati come nella serie.
 */
export const aotAssets: AssetReference[] = [
  {
    id: 'aot-cover-placeholder',
    worldId: 'world-attackontitan',
    name: 'Cover placeholder (Attack on Titan)',
    kind: 'placeholder',
    license: 'placeholder/CC0',
    author: 'local',
    source: 'local',
    notes: {
      it: 'SVG generato localmente, non è materiale ufficiale di Attack on Titan.',
      en: 'Locally generated SVG, not official Attack on Titan material.',
    },
  },
  map('aot-map-world', 'The World (Earth turned upside down)', AOT_MAP_SRC.world),
  map('aot-map-paradis', 'Paradis Island', AOT_MAP_SRC.paradis),
  map('aot-map-walls', 'Within the Walls', AOT_MAP_SRC.walls),
  map('aot-map-shiganshina', 'Shiganshina District', AOT_MAP_SRC.shiganshina),
  map('aot-map-trost', 'Trost District', AOT_MAP_SRC.trost),
  map('aot-map-liberio', 'Liberio', AOT_MAP_SRC.liberio),
  map('aot-map-paths', 'The Paths', AOT_MAP_SRC.paths),
];
