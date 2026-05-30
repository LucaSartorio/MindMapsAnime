import type { AssetReference } from '@/types';

/**
 * Asset Hunter x Hunter.
 *
 * IMPORTANTE copyright: nessuna immagine ufficiale (logo/screen/scan) è
 * inclusa nel repo. La world map qui referenziata è una mappa amatoriale
 * (fan-made) fornita dall'utente: va trattata come materiale da verificare
 * (`needs_verification`) e attribuita all'autore originale. Il file binario
 * NON è committato: va copiato manualmente nel percorso indicato da `url`
 * (vedi `WorldMapBackground`, che mostra uno stato neutro finché manca).
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
    id: 'hxh-world-map-reference',
    worldId: 'world-hunterxhunter',
    name: 'Hunter x Hunter world map (fan-made reference)',
    kind: 'map',
    // Copia qui il PNG della mappa: il file non è incluso nel repo.
    url: '/assets/worlds/hunterxhunter/maps/hxh-world-map.png',
    source: 'fan-made map (Sharpsider)',
    license: 'fan-art / da verificare',
    author: 'Sharpsider',
    notes: {
      it: 'Mappa amatoriale del mondo conosciuto di Hunter x Hunter ("Made by Sharpsider"). Usata come riferimento geografico (viewBox 2000 × 1180). Non è materiale ufficiale: il mondo rappresentato è © Yoshihiro Togashi / Shueisha. Il file PNG va copiato manualmente in public/assets/worlds/hunterxhunter/maps/hxh-world-map.png.',
      en: 'Fan-made map of the Hunter x Hunter known world ("Made by Sharpsider"). Used as a geographic reference (viewBox 2000 × 1180). Not official material: the depicted world is © Yoshihiro Togashi / Shueisha. The PNG must be copied manually into public/assets/worlds/hunterxhunter/maps/hxh-world-map.png.',
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
      it: 'Placeholder neutro del world map, usato come fallback se la mappa di riferimento non è disponibile.',
      en: 'Neutral world-map placeholder, used as a fallback when the reference map is unavailable.',
    },
  },
];
