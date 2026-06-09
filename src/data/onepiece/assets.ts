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
/**
 * Immagini reali delle sotto-mappe.
 *
 * Per dare a una sotto-mappa la sua immagine (al posto del placeholder SVG):
 *  1. metti il file in  `public/assets/worlds/onepiece/maps/`
 *     (nome consigliato: `onepiece-<slug>-submap.jpeg`, es. `onepiece-wano-submap.jpeg`);
 *  2. aggiungi qui una riga  `<slug>: '/assets/worlds/onepiece/maps/onepiece-<slug>-submap.jpeg'`.
 *
 * Lo `<slug>` è quello della sotto-mappa (vedi `slug` in `mapLevels.ts`, es.
 * `wano`, `alabasta`, `skypiea`, `dressrosa`, `loguetown`, `drum-island`, …):
 * coincide con la parte centrale dell'id dell'asset `op-<slug>-submap-placeholder`.
 * I pin della sotto-mappa usano il piano viewBox dato da `width`/`height` del
 * relativo MapLevel (default 1200 × 800): se l'immagine ha proporzioni diverse,
 * aggiorna width/height nel MapLevel mantenendo lo stesso aspect ratio.
 */
export const ONEPIECE_SUBMAP_IMAGE_URLS: Record<string, string> = {
  // wano: '/assets/worlds/onepiece/maps/onepiece-wano-submap.jpeg',
  // alabasta: '/assets/worlds/onepiece/maps/onepiece-alabasta-submap.jpeg',
};

const onepieceBaseAssets: AssetReference[] = [
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
    id: 'op-sabaody-submap-placeholder',
    worldId: 'world-onepiece',
    name: 'Sabaody sub-map (placeholder SVG)',
    kind: 'placeholder',
    source: 'local',
    license: 'placeholder/CC0',
    author: 'local',
    notes: {
      it: "Placeholder concettuale della sotto-mappa dell'Arcipelago Sabaody.",
      en: 'Conceptual placeholder for the Sabaody Archipelago sub-map.',
    },
  },
  {
    id: 'op-marineford-submap-placeholder',
    worldId: 'world-onepiece',
    name: 'Marineford sub-map (placeholder SVG)',
    kind: 'placeholder',
    source: 'local',
    license: 'placeholder/CC0',
    author: 'local',
    notes: {
      it: 'Placeholder concettuale della sotto-mappa di Marineford.',
      en: 'Conceptual placeholder for the Marineford sub-map.',
    },
  },
  {
    id: 'op-egghead-submap-placeholder',
    worldId: 'world-onepiece',
    name: 'Egghead sub-map (placeholder SVG)',
    kind: 'placeholder',
    source: 'local',
    license: 'placeholder/CC0',
    author: 'local',
    notes: {
      it: "Placeholder concettuale della sotto-mappa di Egghead.",
      en: 'Conceptual placeholder for the Egghead sub-map.',
    },
  },
  {
    id: 'op-fishman-submap-placeholder',
    worldId: 'world-onepiece',
    name: 'Fish-Man Island sub-map (placeholder SVG)',
    kind: 'placeholder',
    source: 'local',
    license: 'placeholder/CC0',
    author: 'local',
    notes: {
      it: "Placeholder concettuale della sotto-mappa dell'Isola degli Uomini-Pesce.",
      en: 'Conceptual placeholder for the Fish-Man Island sub-map.',
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
  ...['impel-down', 'enies-lobby', 'water-seven', 'thriller-bark', 'zou', 'punk-hazard', 'amazon-lily', 'drum-island'].map(
    (slug) => ({
      id: `op-${slug}-submap-placeholder`,
      worldId: 'world-onepiece',
      name: `${slug} sub-map (placeholder SVG)`,
      kind: 'placeholder' as const,
      source: 'local' as const,
      license: 'placeholder/CC0',
      author: 'local',
      notes: {
        it: `Placeholder concettuale della sotto-mappa di ${slug}.`,
        en: `Conceptual placeholder for the ${slug} sub-map.`,
      },
    }),
  ),
  ...['mary-geoise', 'dawn-island', 'loguetown', 'jaya', 'ohara', 'elbaf', 'god-valley', 'germa-kingdom'].map(
    (slug) => ({
      id: `op-${slug}-submap-placeholder`,
      worldId: 'world-onepiece',
      name: `${slug} sub-map (placeholder SVG)`,
      kind: 'placeholder' as const,
      source: 'local' as const,
      license: 'placeholder/CC0',
      author: 'local',
      notes: {
        it: `Placeholder concettuale della sotto-mappa di ${slug}.`,
        en: `Conceptual placeholder for the ${slug} sub-map.`,
      },
    }),
  ),
];

/**
 * Se per una sotto-mappa è stata fornita un'immagine reale in
 * `ONEPIECE_SUBMAP_IMAGE_URLS`, il relativo asset placeholder viene promosso a
 * `kind: 'map'` con la `url` indicata (così `WorldMapBackground` la disegna come
 * <img> invece del placeholder SVG). Altrimenti resta il placeholder.
 */
export const onepieceAssets: AssetReference[] = onepieceBaseAssets.map((a) => {
  const m = /^op-(.+)-submap-placeholder$/.exec(a.id);
  const url = m ? ONEPIECE_SUBMAP_IMAGE_URLS[m[1]] : undefined;
  return url ? { ...a, kind: 'map', url } : a;
});
