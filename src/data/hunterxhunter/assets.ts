import type { AssetReference } from '@/types';

/**
 * Asset Hunter x Hunter.
 *
 * IMPORTANTE copyright: nessuna immagine ufficiale (logo/screen/scan) è
 * inclusa nel repo. Tutti gli asset qui sotto sono placeholder generati
 * localmente. Ogni AssetReference documenta source/license/author/notes.
 *
 * La mappa è volutamente accantonata in questa fase: esiste solo un
 * placeholder neutro per il world map level.
 */
export const hxhAssets: AssetReference[] = [
  {
    id: 'hxh-cover-placeholder',
    worldId: 'world-hunterxhunter',
    name: 'Cover placeholder (Hunter x Hunter)',
    kind: 'placeholder',
    license: 'placeholder/CC0',
    author: 'local',
    notes: {
      it: 'SVG generato localmente, non è il logo ufficiale di Hunter x Hunter.',
      en: 'Locally generated SVG, not the official Hunter x Hunter logo.',
    },
  },
  {
    id: 'hxh-world-map-placeholder',
    worldId: 'world-hunterxhunter',
    name: 'Hunter x Hunter world map (placeholder SVG)',
    kind: 'placeholder',
    source: 'local',
    license: 'placeholder/CC0',
    author: 'local',
    notes: {
      it: 'Placeholder neutro del world map. La mappa geografica reale è rimandata a una fase successiva.',
      en: 'Neutral world-map placeholder. The real geographic map is deferred to a later phase.',
    },
  },
];
