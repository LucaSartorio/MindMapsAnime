import type { AssetReference } from '@/types';
import { NARUTO_WORLD_MAP_SRC } from './mapConstants';

/**
 * Asset Naruto.
 *
 * IMPORTANTE copyright: nessuna immagine ufficiale (logo/screen/scan) è
 * inclusa nel repo. La world map di riferimento è fornita dall'utente e va
 * copiata localmente; finché non è presente, lo sfondo resta neutro.
 *
 * Ogni asset documenta source/license/author/url/notes. Gli asset immagine
 * dei villaggi sono placeholder finché non si dispone di immagini con
 * licenza chiara.
 */
export const narutoAssets: AssetReference[] = [
  {
    id: 'naruto-cover-placeholder',
    worldId: 'world-naruto',
    name: 'Cover placeholder (Naruto)',
    kind: 'placeholder',
    license: 'placeholder/CC0',
    notes: {
      it: 'SVG generato localmente, non è il logo ufficiale Naruto.',
      en: 'Locally generated SVG, not the official Naruto logo.',
    },
  },

  /**
   * World map di riferimento (PNG fornito dall'utente).
   *
   * Slot diretto: copiare il file in
   *   public/assets/worlds/naruto/maps/naruto_world_reference_expanded.png
   * Finché il file non esiste, WorldMapBackground mostra uno stato neutro
   * con istruzioni. Verificare la licenza prima della pubblicazione.
   */
  {
    id: 'naruto-world-map-reference-expanded',
    worldId: 'world-naruto',
    name: 'Naruto World Map (reference, expanded)',
    kind: 'map',
    url: '/assets/worlds/naruto/maps/naruto_world_reference_expanded.png',
    source: 'user_provided',
    license: 'to_verify',
    author: 'unknown',
    notes: {
      it: 'Mappa estesa fornita dall\'utente. Copiare il PNG nel percorso indicato. Licenza da verificare prima della pubblicazione.',
      en: 'Expanded map provided by the user. Copy the PNG to the indicated path. License to verify before publication.',
    },
  },
  {
    id: 'naruto-world-map-svg',
    worldId: 'world-naruto',
    name: 'Naruto World Map (SVG placeholder)',
    kind: 'placeholder',
    url: NARUTO_WORLD_MAP_SRC,
    source: 'local',
    license: 'placeholder/CC0',
    author: 'local',
    notes: {
      it: 'Placeholder SVG con viewBox 1500 x 882.2204. Usato come fallback se manca il PNG di riferimento.',
      en: 'SVG placeholder with viewBox 1500 x 882.2204. Used as fallback when the reference PNG is missing.',
    },
  },
  {
    id: 'naruto-konoha-background-placeholder',
    worldId: 'world-naruto',
    name: 'Konoha sub-map background (placeholder SVG)',
    kind: 'placeholder',
    license: 'placeholder/CC0',
    notes: {
      it: 'Schema concettuale del villaggio, non corrisponde alla mappa ufficiale.',
      en: 'Conceptual village schema, does not match the official map.',
    },
  },
  {
    id: 'naruto-village-submap-placeholder',
    worldId: 'world-naruto',
    name: 'Generic village sub-map background (placeholder SVG)',
    kind: 'placeholder',
    license: 'placeholder/CC0',
    notes: {
      it: 'Sfondo concettuale generico per le sotto-mappe dei villaggi. Sostituibile con asset autorizzati.',
      en: 'Generic conceptual background for village sub-maps. Replaceable with authorized assets.',
    },
  },

  /* ---------- Immagini villaggio (placeholder SVG locali) ---------- */
  ...villageImagePlaceholders(),
];

/**
 * Genera placeholder immagine per i villaggi principali.
 * Ogni placeholder è un asset locale (SVG generato) sostituibile con
 * un'immagine con licenza chiara aggiornando `url`.
 */
function villageImagePlaceholders(): AssetReference[] {
  const villages: { id: string; locId: string; it: string; en: string }[] = [
    { id: 'konoha', locId: 'loc-konoha', it: 'Konoha', en: 'Konoha' },
    { id: 'suna', locId: 'loc-suna', it: 'Suna', en: 'Suna' },
    { id: 'kiri', locId: 'loc-kiri', it: 'Kiri', en: 'Kiri' },
    { id: 'iwa', locId: 'loc-iwa', it: 'Iwa', en: 'Iwa' },
    { id: 'kumo', locId: 'loc-kumo', it: 'Kumo', en: 'Kumo' },
    { id: 'ame', locId: 'loc-ame', it: 'Amegakure', en: 'Amegakure' },
    { id: 'oto', locId: 'loc-oto', it: 'Otogakure', en: 'Otogakure' },
  ];
  return villages.map((v) => ({
    id: `naruto-img-${v.id}`,
    worldId: 'world-naruto',
    name: `${v.en} illustration (placeholder)`,
    kind: 'placeholder' as const,
    source: 'local',
    license: 'placeholder/CC0',
    author: 'local',
    notes: {
      it: `Placeholder illustrativo per ${v.it}. Sostituibile con immagine con licenza chiara.`,
      en: `Illustrative placeholder for ${v.en}. Replaceable with a clearly licensed image.`,
    },
  }));
}
