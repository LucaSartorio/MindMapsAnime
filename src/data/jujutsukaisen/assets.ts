import type { AssetReference } from '@/types';
import { originalMapAsset } from '../originalMapAssets';
import { JJK_MAP_SRC } from './mapConstants';

const map = (id: string, name: string, url: string) =>
  originalMapAsset({
    id,
    worldId: 'world-jujutsukaisen',
    name: `Jujutsu Kaisen · ${name}`,
    url,
    script: 'scripts/mapgen/jjk.py',
    owner: 'Gege Akutami / Shueisha',
  });

/**
 * Asset di Jujutsu Kaisen. Nessuna immagine ufficiale: le sei mappe sono disegni
 * ORIGINALI (CC0) generati da `scripts/mapgen/jjk.py`; coste e prefetture derivano dai
 * dati Natural Earth (dominio pubblico).
 */
export const jjkAssets: AssetReference[] = [
  {
    id: 'jjk-cover-placeholder',
    worldId: 'world-jujutsukaisen',
    name: 'Cover placeholder (Jujutsu Kaisen)',
    kind: 'placeholder',
    license: 'placeholder/CC0',
    author: 'local',
    source: 'local',
    notes: {
      it: 'SVG generato localmente, non è materiale ufficiale di Jujutsu Kaisen.',
      en: 'Locally generated SVG, not official Jujutsu Kaisen material.',
    },
  },
  map('jjk-map-japan', 'Japan', JJK_MAP_SRC.japan),
  map('jjk-map-tokyo', 'Tokyo and surroundings', JJK_MAP_SRC.tokyo),
  map('jjk-map-shibuya', 'Shibuya (the Shibuya Incident)', JJK_MAP_SRC.shibuya),
  map('jjk-map-campus', 'Tokyo Jujutsu High (imagined plan)', JJK_MAP_SRC.campus),
  map('jjk-map-kyoto', 'Kyoto', JJK_MAP_SRC.kyoto),
  map('jjk-map-sendai', 'Sendai', JJK_MAP_SRC.sendai),
];
