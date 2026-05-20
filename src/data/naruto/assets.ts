import type { AssetReference } from '@/types';

/**
 * Asset Naruto.
 * IMPORTANTE: tutte le immagini ufficiali (logo, screen, scan) NON sono incluse
 * per motivi di copyright. Vengono usati placeholder SVG generati localmente.
 * Sostituire `url` con asset autorizzati seguendo la licenza dichiarata.
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
  {
    id: 'naruto-world-background-placeholder',
    worldId: 'world-naruto',
    name: 'World map background (placeholder SVG)',
    kind: 'placeholder',
    license: 'placeholder/CC0',
    notes:
      'Disegno indicativo delle Nazioni Elementali. Non è una mappa ufficiale. Sostituibile con asset autorizzato.',
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
