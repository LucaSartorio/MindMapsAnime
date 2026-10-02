import type { MapLevel } from '@/types';
import {
  BLACKCLOVER_CITY_VIEWBOX,
  BLACKCLOVER_MAP_VIEWBOX,
  BLACKCLOVER_UNDERWORLD_VIEWBOX,
} from './mapConstants';

/**
 * Map level di Black Clover.
 *
 * - `bc-map-world`: il continente dei quattro regni (Clover, Diamond, Spade,
 *   Heart) più i territori neutrali — mappa radice.
 * - `bc-map-royal-capital`, `bc-map-spade-castle`, `bc-map-heart-kingdom`,
 *   `bc-map-diamond-kingdom`: le quattro sotto-mappe delle capitali. La world
 *   map concentrava oltre quindici pin nel solo raggio della Capitale Reale:
 *   i luoghi INTERNI a una capitale vivono ora nella sua sotto-mappa, e sulla
 *   world map resta il pin della capitale come punto di ingresso (doppio clic).
 * - `bc-map-underworld`: sotto-mappa concettuale dell'Inframondo, il regno dei
 *   diavoli diviso in sette livelli di potere crescente. Si apre dalla «Porta
 *   dell'Inframondo», che sta dentro la fortezza di Spade: è quindi annidata
 *   sotto `bc-map-spade-castle` (world → fortezza → Inframondo).
 *
 * Ogni sotto-mappa contiene un pin di RITORNO con `subMapLevelId` verso il
 * livello padre: senza quello il doppio clic non risale (oltre al tab «←» del
 * `MapLevelSwitcher`).
 */
export const blackcloverMapLevels: MapLevel[] = [
  {
    id: 'bc-map-world',
    worldId: 'world-blackclover',
    slug: 'world',
    name: 'World of Black Clover',
    localizedName: { it: 'Mondo di Black Clover', en: 'World of Black Clover' },
    description: {
      it: 'Il continente dei quattro regni: Clover a sud con la Capitale Reale e il villaggio di Hage, Diamond a est, Spade a nord, Heart a ovest, più i territori neutrali, i dungeon e il villaggio elfico di Elysia.',
      en: 'The continent of the four kingdoms: Clover to the south with the Royal Capital and the village of Hage, Diamond to the east, Spade to the north, Heart to the west, plus the neutral territories, the dungeons and the elf village of Elysia.',
    },
    backgroundAssetId: 'bc-world-map-reference',
    width: BLACKCLOVER_MAP_VIEWBOX.width,
    height: BLACKCLOVER_MAP_VIEWBOX.height,
  },
  {
    id: 'bc-map-royal-capital',
    worldId: 'world-blackclover',
    slug: 'royal-capital',
    name: 'Royal Capital',
    localizedName: { it: 'Capitale Reale', en: 'Royal Capital' },
    description: {
      it: "Pianta concettuale della Capitale Reale del Regno di Clover: il castello dei Kira Clover al centro, il Quartier Generale dei Cavalieri Magici e il Parlamento Magico ai suoi lati, la Torre dei Grimori, la piazza del Festival dei Premi Stellari, i quartieri nobile e comune, e il Palazzo delle Ombre sepolto sotto la città. Disposizione coerente con quanto mostra l'opera, non una planimetria in scala. Doppio clic su «Torna alla world map» per risalire.",
      en: "Conceptual plan of the Clover Kingdom's Royal Capital: the Kira Clover castle at the centre, the Magic Knights Headquarters and the Magic Parliament flanking it, the Grimoire Tower, the Star Awards Festival square, the noble and common districts, and the Shadow Palace buried beneath the city. A layout consistent with what the series shows, not a scale plan. Double-click 'Back to the world map' to go back up.",
    },
    parentLevelId: 'bc-map-world',
    triggerLocationId: 'loc-bc-royal-capital',
    backgroundAssetId: 'bc-royal-capital-map',
    width: BLACKCLOVER_CITY_VIEWBOX.width,
    height: BLACKCLOVER_CITY_VIEWBOX.height,
  },
  {
    id: 'bc-map-spade-castle',
    worldId: 'world-blackclover',
    slug: 'spade-castle',
    name: 'Spade Kingdom fortress',
    localizedName: { it: 'Fortezza di Spade', en: 'Spade Kingdom fortress' },
    description: {
      it: "Schema della fortezza della Triade Oscura: la sala del trono, le tre ali in cui si combattono le tre battaglie parallele dell'assalto, le prigioni da cui si ricava il «carburante» del rituale, il laboratorio di Moris, l'Albero di Qliphoth e la Porta dell'Inframondo. Le ali non hanno un nome nell'opera: sono identificate dagli scontri che vi si svolgono. Doppio clic su «Torna alla world map» per risalire.",
      en: "Diagram of the Dark Triad's fortress: the throne room, the three wings where the assault's three parallel battles are fought, the prisons the ritual's 'fuel' comes from, Moris's laboratory, the Tree of Qliphoth and the Gate to the Underworld. The wings are unnamed in the series: they are identified by the fights that happen in them. Double-click 'Back to the world map' to go back up.",
    },
    parentLevelId: 'bc-map-world',
    triggerLocationId: 'loc-bc-spade-castle',
    backgroundAssetId: 'bc-spade-castle-map',
    width: BLACKCLOVER_CITY_VIEWBOX.width,
    height: BLACKCLOVER_CITY_VIEWBOX.height,
  },
  {
    id: 'bc-map-heart-kingdom',
    worldId: 'world-blackclover',
    slug: 'heart-kingdom',
    name: 'Heart Kingdom',
    localizedName: { it: 'Regno di Heart', en: 'Heart Kingdom' },
    description: {
      it: "Schema del Regno di Heart: il palazzo di Lolopechka, la sala degli Spirit Guardian e le quattro aree consacrate agli spiriti elementali in cui i Cavalieri Magici di Clover si addestrano prima dell'assalto al Regno di Spade. Doppio clic su «Torna alla world map» per risalire.",
      en: "Diagram of the Heart Kingdom: Lolopechka's palace, the Spirit Guardians' hall and the four grounds consecrated to the elemental spirits where Clover's Magic Knights train before the Spade Kingdom assault. Double-click 'Back to the world map' to go back up.",
    },
    parentLevelId: 'bc-map-world',
    triggerLocationId: 'loc-bc-heart-capital',
    backgroundAssetId: 'bc-heart-kingdom-map',
    width: BLACKCLOVER_CITY_VIEWBOX.width,
    height: BLACKCLOVER_CITY_VIEWBOX.height,
  },
  {
    id: 'bc-map-diamond-kingdom',
    worldId: 'world-blackclover',
    slug: 'diamond-kingdom',
    name: 'Diamond Kingdom',
    localizedName: { it: 'Regno di Diamond', en: 'Diamond Kingdom' },
    description: {
      it: "Schema della capitale del Regno di Diamond: il palazzo del re, la caserma dei Maghi Guerrieri, l'accademia militare con l'arena della selezione e il laboratorio di ricerca di Moris Libardirt, da cui escono Mars, Fana e Ladros. Doppio clic su «Torna alla world map» per risalire.",
      en: "Diagram of the Diamond Kingdom's capital: the king's palace, the Mage Warriors' barracks, the military academy with its selection arena and Moris Libardirt's research laboratory, where Mars, Fana and Ladros come from. Double-click 'Back to the world map' to go back up.",
    },
    parentLevelId: 'bc-map-world',
    triggerLocationId: 'loc-bc-diamond-capital',
    backgroundAssetId: 'bc-diamond-kingdom-map',
    width: BLACKCLOVER_CITY_VIEWBOX.width,
    height: BLACKCLOVER_CITY_VIEWBOX.height,
  },
  {
    id: 'bc-map-underworld',
    worldId: 'world-blackclover',
    slug: 'underworld',
    name: 'Underworld',
    localizedName: { it: 'Inframondo', en: 'Underworld' },
    description: {
      it: "Sotto-mappa concettuale dell'Inframondo: i sette livelli del regno dei diavoli, dal primo (i diavoli di rango inferiore) al settimo, dominio di Lucifero. Schema a livelli di potere crescente, non una mappa in scala: la geografia dell'Inframondo non è mai stata mostrata come tale nell'opera. Doppio clic su «Ritorno alla fortezza» per risalire al Regno di Spade.",
      en: "Conceptual sub-map of the Underworld: the seven levels of the devils' realm, from the first (low-ranking devils) to the seventh, Lucifero's domain. A diagram of increasing power levels, not a scale map — the Underworld's geography is never shown as such in the series. Double-click 'Back to the fortress' to go back up to the Spade Kingdom.",
    },
    parentLevelId: 'bc-map-spade-castle',
    triggerLocationId: 'loc-bc-underworld-gate',
    backgroundAssetId: 'bc-underworld-map',
    width: BLACKCLOVER_UNDERWORLD_VIEWBOX.width,
    height: BLACKCLOVER_UNDERWORLD_VIEWBOX.height,
  },
];
