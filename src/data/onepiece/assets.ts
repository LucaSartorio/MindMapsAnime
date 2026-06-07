import type { AssetReference } from '@/types';

/**
 * Asset One Piece.
 *
 * IMPORTANTE copyright: nessuna immagine ufficiale (logo/screen/scan) è inclusa
 * nel repo. La world map qui referenziata è una mappa di riferimento fan-made
 * fornita dall'utente (presente nel repo al percorso indicato da `url`): va
 * trattata come materiale da verificare (`needs_verification`) e attribuita
 * all'autore originale. Il mondo rappresentato è © Eiichiro Oda / Shueisha.
 */
export const onepieceAssets: AssetReference[] = [
  {
    id: 'op-cover-placeholder',
    worldId: 'world-onepiece',
    name: 'Cover placeholder (One Piece)',
    kind: 'placeholder',
    license: 'placeholder/CC0',
    author: 'local',
    notes: {
      it: 'SVG generato localmente, non è il logo ufficiale di One Piece.',
      en: 'Locally generated SVG, not the official One Piece logo.',
    },
  },
  {
    id: 'op-world-map-reference',
    worldId: 'world-onepiece',
    name: 'One Piece world map (reference)',
    kind: 'map',
    // Copia qui l'immagine della mappa: il file non è incluso nel repo.
    url: '/assets/worlds/onepiece/maps/onepiece-world-map.jpeg',
    source: 'fan-made / reference map',
    license: 'fan-art / da verificare',
    author: 'da attribuire',
    notes: {
      it: "Mappa del mondo di One Piece (4096 × 2048 px) usata come riferimento geografico, mappata sul piano viewBox 2000 × 1000. Non è materiale ufficiale: il mondo rappresentato è © Eiichiro Oda / Shueisha. File incluso in public/assets/worlds/onepiece/maps/onepiece-world-map.jpeg.",
      en: 'One Piece world map (4096 × 2048 px) used as a geographic reference, mapped onto the 2000 × 1000 viewBox plane. Not official material: the depicted world is © Eiichiro Oda / Shueisha. File included at public/assets/worlds/onepiece/maps/onepiece-world-map.jpeg.',
    },
  },
  {
    id: 'op-totland-submap-placeholder',
    worldId: 'world-onepiece',
    name: 'Totland sub-map (placeholder SVG)',
    kind: 'placeholder',
    source: 'local',
    license: 'placeholder/CC0',
    author: 'local',
    notes: {
      it: 'Placeholder concettuale della sotto-mappa di Totland (schema, posizioni indicative).',
      en: 'Conceptual placeholder for the Totland sub-map (schematic, indicative positions).',
    },
  },
  {
    id: 'op-alabasta-submap-placeholder',
    worldId: 'world-onepiece',
    name: 'Alabasta sub-map (placeholder SVG)',
    kind: 'placeholder',
    source: 'local',
    license: 'placeholder/CC0',
    author: 'local',
    notes: {
      it: 'Placeholder concettuale della sotto-mappa di Alabasta.',
      en: 'Conceptual placeholder for the Alabasta sub-map.',
    },
  },
  {
    id: 'op-wano-submap-placeholder',
    worldId: 'world-onepiece',
    name: 'Wano sub-map (placeholder SVG)',
    kind: 'placeholder',
    source: 'local',
    license: 'placeholder/CC0',
    author: 'local',
    notes: {
      it: 'Placeholder concettuale della sotto-mappa di Wano.',
      en: 'Conceptual placeholder for the Wano sub-map.',
    },
  },
  {
    id: 'op-skypiea-submap-placeholder',
    worldId: 'world-onepiece',
    name: 'Skypiea sub-map (placeholder SVG)',
    kind: 'placeholder',
    source: 'local',
    license: 'placeholder/CC0',
    author: 'local',
    notes: {
      it: 'Placeholder concettuale della sotto-mappa di Skypiea.',
      en: 'Conceptual placeholder for the Skypiea sub-map.',
    },
  },
  {
    id: 'op-dressrosa-submap-placeholder',
    worldId: 'world-onepiece',
    name: 'Dressrosa sub-map (placeholder SVG)',
    kind: 'placeholder',
    source: 'local',
    license: 'placeholder/CC0',
    author: 'local',
    notes: {
      it: 'Placeholder concettuale della sotto-mappa di Dressrosa.',
      en: 'Conceptual placeholder for the Dressrosa sub-map.',
    },
  },
  {
    id: 'op-world-map-placeholder',
    worldId: 'world-onepiece',
    name: 'One Piece world map (placeholder SVG)',
    kind: 'placeholder',
    source: 'local',
    license: 'placeholder/CC0',
    author: 'local',
    notes: {
      it: 'Placeholder neutro del world map, usato come fallback se la mappa di riferimento non è disponibile.',
      en: 'Neutral world-map placeholder, used as a fallback when the reference map is unavailable.',
    },
  },
];
