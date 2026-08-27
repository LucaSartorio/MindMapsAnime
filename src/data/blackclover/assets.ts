import type { AssetReference } from '@/types';
import { BLACKCLOVER_WORLD_MAP_SRC } from './mapConstants';

/**
 * Asset di Black Clover.
 *
 * IMPORTANTE copyright: nessuna immagine ufficiale (manga/anime) è inclusa nel
 * repo. La world map referenziata qui è una mappa fan-made ("World of Black
 * Clover") fornita dall'utente come riferimento geografico: non è materiale a
 * licenza libera e il file binario va copiato manualmente nel percorso indicato
 * da `url` (vedi `WorldMapBackground`, che mostra uno stato neutro finché il
 * file manca). Verifica di averne il diritto d'uso prima di pubblicare.
 */
export const blackcloverAssets: AssetReference[] = [
  {
    id: 'bc-cover-placeholder',
    worldId: 'world-blackclover',
    name: 'Cover placeholder (Black Clover)',
    kind: 'placeholder',
    license: 'placeholder/CC0',
    author: 'local',
    notes: {
      it: 'SVG generato localmente, non è materiale ufficiale Black Clover.',
      en: 'Locally generated SVG, not official Black Clover material.',
    },
  },
  {
    id: 'bc-world-map-reference',
    worldId: 'world-blackclover',
    name: 'Black Clover world map (fan-made reference)',
    kind: 'map',
    // Copia qui la mappa: il file non è incluso nel repo.
    url: BLACKCLOVER_WORLD_MAP_SRC,
    source: 'fan-made map ("World of Black Clover")',
    license: 'fan-art / da verificare — richiede autorizzazione prima della pubblicazione',
    author: 'sconosciuto / unknown',
    notes: {
      it: "Mappa amatoriale su pergamena del continente di Black Clover, con i simboli dei quattro semi (fiori, quadri, picche, cuori) a marcare i regni e le etichette di Elysia, Hage, Nean, Hecairo, Capitale Reale e Raquey. Usata come riferimento geografico (viewBox 1500 × 1057). Non è materiale ufficiale: il mondo rappresentato è © Yūki Tabata / Shueisha, il disegno della mappa è © del suo autore. Il file va copiato manualmente in public/assets/worlds/blackclover/maps/blackclover-world-map.png.",
      en: "Fan-made parchment map of the Black Clover continent, with the four card suits (clubs, diamonds, spades, hearts) marking the kingdoms and labels for Elysia, Hage, Nean, Hecairo, the Royal Capital and Raquey. Used as a geographic reference (viewBox 1500 × 1057). Not official material: the depicted world is © Yūki Tabata / Shueisha, the map artwork is © its author. The file must be copied manually into public/assets/worlds/blackclover/maps/blackclover-world-map.png.",
    },
  },
  {
    id: 'bc-underworld-map-placeholder',
    worldId: 'world-blackclover',
    name: 'Black Clover Underworld map (placeholder SVG)',
    kind: 'placeholder',
    source: 'local',
    license: 'placeholder/CC0',
    author: 'local',
    notes: {
      it: "Placeholder neutro per la sotto-mappa dell'Inframondo: schema dei sette livelli dei diavoli, non una mappa in scala.",
      en: "Neutral placeholder for the Underworld sub-map: a diagram of the devils' seven levels, not a scale map.",
    },
  },
];
