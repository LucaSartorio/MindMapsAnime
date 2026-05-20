import type { AssetReference } from '@/types';
import { NARUTO_WORLD_MAP_SRC } from './mapConstants';

/**
 * Asset Naruto.
 *
 * IMPORTANTE: tutte le immagini ufficiali (logo, screen, scan) NON sono
 * incluse per motivi di copyright. Vengono usati placeholder SVG generati
 * localmente. Sostituire `url` con asset autorizzati seguendo la licenza
 * dichiarata.
 */
export const narutoAssets: AssetReference[] = [
  {
    id: 'naruto-cover-placeholder',
    worldId: 'world-naruto',
    name: 'Cover placeholder (Naruto)',
    kind: 'placeholder',
    license: 'placeholder/CC0',
    notes: 'SVG generato localmente, non è il logo ufficiale Naruto.',
  },
  /**
   * World map SVG di base.
   * Path: public/assets/worlds/naruto/maps/Naruto_World_Map.svg
   *
   * Il file presente è un placeholder dettagliato (CC0) con il viewBox
   * 1500 x 882.2204 richiesto. Quando si dispone di un asset autorizzato,
   * sostituire il file mantenendo lo stesso viewBox.
   */
  {
    id: 'naruto-world-map-svg',
    worldId: 'world-naruto',
    name: 'Naruto World Map',
    kind: 'map',
    url: NARUTO_WORLD_MAP_SRC,
    source: 'user_provided',
    license: 'to_verify',
    author: 'unknown',
    notes:
      'Mappa fornita dall\'utente. Verificare licenza prima della pubblicazione. Il file in repo è un placeholder CC0 con stesso viewBox (1500 x 882.2204).',
  },
  {
    id: 'naruto-konoha-background-placeholder',
    worldId: 'world-naruto',
    name: 'Konoha sub-map background (placeholder SVG)',
    kind: 'placeholder',
    license: 'placeholder/CC0',
    notes: 'Schema concettuale del villaggio, non corrisponde alla mappa ufficiale.',
  },
];
