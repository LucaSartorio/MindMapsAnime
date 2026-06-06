import type { AssetReference } from '@/types';

/**
 * Asset One Piece.
 *
 * IMPORTANTE copyright: nessuna immagine ufficiale (logo/screen/scan) è inclusa
 * nel repo. La world map qui referenziata è una mappa di riferimento fornita
 * dall'utente: va trattata come materiale da verificare (`needs_verification`)
 * e attribuita all'autore originale. Il file binario NON è committato: va
 * copiato manualmente nel percorso indicato da `url` (vedi `WorldMapBackground`,
 * che mostra uno stato neutro finché manca).
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
    url: '/assets/worlds/onepiece/maps/onepiece-world-map.jpg',
    source: 'fan-made / reference map',
    license: 'fan-art / da verificare',
    author: 'da attribuire',
    notes: {
      it: "Mappa del mondo di One Piece usata come riferimento geografico (viewBox 2000 × 1000). Non è materiale ufficiale: il mondo rappresentato è © Eiichiro Oda / Shueisha. Il file va copiato manualmente in public/assets/worlds/onepiece/maps/onepiece-world-map.jpg.",
      en: 'One Piece world map used as a geographic reference (viewBox 2000 × 1000). Not official material: the depicted world is © Eiichiro Oda / Shueisha. The file must be copied manually into public/assets/worlds/onepiece/maps/onepiece-world-map.jpg.',
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
