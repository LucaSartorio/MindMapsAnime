import type { AssetReference } from '@/types';
import { originalMapAsset } from '../originalMapAssets';
import { FMA_WORLD_MAP_SRC } from './mapConstants';

/**
 * Asset di Fullmetal Alchemist.
 *
 * Nessuna immagine ufficiale (manga/anime) è inclusa nel repo: la world map è uno schema originale
 * generato da `scripts/mapgen/fullmetalalchemist.py` (CC0), non una riproduzione di mappe dell'opera
 * né di mappe amatoriali. Il mondo rappresentato è © Hiromu Arakawa / Square Enix.
 */
export const fmaAssets: AssetReference[] = [
  originalMapAsset({
    id: 'fma-world-map',
    worldId: 'world-fullmetalalchemist',
    name: 'Fullmetal Alchemist · Amestris and neighbouring lands',
    url: FMA_WORLD_MAP_SRC,
    script: 'scripts/mapgen/fullmetalalchemist.py',
    owner: 'Hiromu Arakawa / Square Enix',
  }),
];
