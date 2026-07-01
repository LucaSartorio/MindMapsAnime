import type { AssetReference } from '@/types';
import { DRAGONBALL_WORLD_MAP_SRC } from './mapConstants';

/**
 * Asset Dragon Ball.
 *
 * IMPORTANTE copyright: nessuna immagine ufficiale (manga/anime) è inclusa nel
 * repo. La world map qui referenziata è il poster fan-made "Dragon Ball World
 * Map" (Kris Ambry per LocoDog.Store) fornito dall'utente come riferimento
 * geografico: NON è materiale con licenza libera (è merchandise fan-art, ©
 * dell'autore originale) e il file binario NON è committato in questo repo.
 * Prima di pubblicare il sito con questa immagine verifica di averne il
 * diritto d'uso (es. licenza dall'autore) — altrimenti sostituiscila con una
 * mappa generata localmente o un'illustrazione originale.
 * Il file va copiato manualmente nel percorso indicato da `url`
 * (vedi `WorldMapBackground`, che mostra uno stato neutro finché manca).
 */
export const dragonballAssets: AssetReference[] = [
  {
    id: 'dbz-cover-placeholder',
    worldId: 'world-dragonball',
    name: 'Cover placeholder (Dragon Ball)',
    kind: 'placeholder',
    license: 'placeholder/CC0',
    author: 'local',
    notes: {
      it: 'SVG generato localmente, non è materiale ufficiale Dragon Ball.',
      en: 'Locally generated SVG, not official Dragon Ball material.',
    },
  },
  {
    id: 'dbz-world-map-reference',
    worldId: 'world-dragonball',
    name: 'Dragon Ball world map (fan-made reference)',
    kind: 'map',
    // Copia qui il poster: il file non è incluso nel repo.
    url: DRAGONBALL_WORLD_MAP_SRC,
    source: 'fan-made map ("Dragon Ball World Map", LocoDog.Store)',
    license: 'fan-art / da verificare — richiede autorizzazione prima della pubblicazione',
    author: 'Kris Ambry',
    notes: {
      it: 'Mappa amatoriale della Terra di Dragon Ball. Usata come riferimento geografico (viewBox 1800 × 1200); le coordinate dei pin sono posizioni concettuali stimate dal layout del poster, da rifinire quando il file viene aggiunto. Non è materiale ufficiale: il mondo rappresentato è © Akira Toriyama / Shueisha, il disegno della mappa è © dell\'autore indicato. Il file va copiato manualmente in public/assets/worlds/dragonball/maps/dragonball-world-map.png.',
      en: 'Fan-made map of the Dragon Ball Earth. Used as a geographic reference (viewBox 1800 × 1200); pin coordinates are conceptual positions estimated from the poster layout, to refine once the file is added. Not official material: the depicted world is © Akira Toriyama / Shueisha, the map artwork is © the listed author. The file must be copied manually into public/assets/worlds/dragonball/maps/dragonball-world-map.png.',
    },
  },
  {
    id: 'dbz-cosmic-map-placeholder',
    worldId: 'world-dragonball',
    name: 'Dragon Ball cosmic map (placeholder SVG)',
    kind: 'placeholder',
    source: 'local',
    license: 'placeholder/CC0',
    author: 'local',
    notes: {
      it: 'Placeholder neutro per la sotto-mappa "Universo" (pianeti, Aldilà, Torneo del Potere): schema concettuale, non una mappa in scala.',
      en: 'Neutral placeholder for the "Universe" sub-map (planets, Other World, Tournament of Power): conceptual diagram, not a scale map.',
    },
  },
];
