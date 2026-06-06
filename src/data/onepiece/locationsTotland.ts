import type { Location } from '@/types';

/**
 * Sotto-mappa di Totland (Whole Cake Island) — l'arcipelago di Big Mom.
 * Si apre dal pin di Whole Cake Island sulla world map (drill-down).
 * Coordinate concettuali nel piano 1200 × 800 (vedi mapLevels: op-map-totland);
 * i nomi delle isole-dolce sono presi dalla mappa di riferimento e restano
 * `needs_verification` (etichette minute, alcune non pienamente canoniche).
 */
export const onepieceLocationsTotland: Location[] = [
  {
    id: 'loc-op-tl-sweet-city',
    worldId: 'world-onepiece',
    mapLevelId: 'op-map-totland',
    name: 'Sweet City (Whole Cake Château)',
    localizedName: { it: 'Sweet City (Whole Cake Château)', en: 'Sweet City (Whole Cake Château)' },
    type: 'city',
    x: 600,
    y: 400,
    shortDescription: {
      it: "La capitale di Totland sull'isola-torta centrale: la città dei dolci e il castello di Big Mom, cuore del suo impero.",
      en: "Totland's capital on the central cake-island: the city of sweets and Big Mom's château, the heart of her empire.",
    },
    nationId: 'nation-op-grand-line-new-world',
    importance: 'secondary',
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['totland', 'big-mom', 'capitale'],
  },
  {
    id: 'loc-op-tl-cacao',
    worldId: 'world-onepiece',
    mapLevelId: 'op-map-totland',
    name: 'Cacao Island',
    localizedName: { it: 'Isola del Cacao', en: 'Cacao Island' },
    type: 'landmark',
    x: 850,
    y: 300,
    shortDescription: {
      it: "Isola di Totland dedita al cioccolato, teatro della fuga della ciurma e del ricongiungimento con la Thousand Sunny dopo il matrimonio di Sanji.",
      en: "A chocolate-making Totland island, stage of the crew's escape and reunion with the Thousand Sunny after Sanji's wedding.",
    },
    nationId: 'nation-op-grand-line-new-world',
    importance: 'secondary',
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['totland', 'cioccolato', 'sanji'],
  },
  { id: 'loc-op-tl-nuts', worldId: 'world-onepiece', mapLevelId: 'op-map-totland', name: 'Nuts Island', localizedName: { it: 'Isola delle Noci', en: 'Nuts Island' }, type: 'landmark', x: 380, y: 260, shortDescription: { it: 'Isola-dolce di Totland.', en: 'A sweets-island of Totland.' }, nationId: 'nation-op-grand-line-new-world', importance: 'minor', canonStatus: 'canon', referenceStatus: 'needs_verification', tags: ['totland', 'isola'] },
  { id: 'loc-op-tl-funwari', worldId: 'world-onepiece', mapLevelId: 'op-map-totland', name: 'Funwari Island', localizedName: { it: 'Isola di Funwari', en: 'Funwari Island' }, type: 'landmark', x: 520, y: 300, shortDescription: { it: 'Isola-dolce di Totland.', en: 'A sweets-island of Totland.' }, nationId: 'nation-op-grand-line-new-world', importance: 'minor', canonStatus: 'canon', referenceStatus: 'needs_verification', tags: ['totland', 'isola'] },
  { id: 'loc-op-tl-milenge', worldId: 'world-onepiece', mapLevelId: 'op-map-totland', name: 'Milenge Island', localizedName: { it: 'Isola di Milenge', en: 'Milenge Island' }, type: 'landmark', x: 690, y: 260, shortDescription: { it: 'Isola-dolce di Totland.', en: 'A sweets-island of Totland.' }, nationId: 'nation-op-grand-line-new-world', importance: 'minor', canonStatus: 'canon', referenceStatus: 'needs_verification', tags: ['totland', 'isola'] },
  { id: 'loc-op-tl-jam', worldId: 'world-onepiece', mapLevelId: 'op-map-totland', name: 'Jam Island', localizedName: { it: 'Isola della Marmellata', en: 'Jam Island' }, type: 'landmark', x: 300, y: 440, shortDescription: { it: 'Isola-dolce di Totland.', en: 'A sweets-island of Totland.' }, nationId: 'nation-op-grand-line-new-world', importance: 'minor', canonStatus: 'canon', referenceStatus: 'needs_verification', tags: ['totland', 'isola'] },
  { id: 'loc-op-tl-milk', worldId: 'world-onepiece', mapLevelId: 'op-map-totland', name: 'Milk Island', localizedName: { it: 'Isola del Latte', en: 'Milk Island' }, type: 'landmark', x: 440, y: 470, shortDescription: { it: 'Isola-dolce di Totland.', en: 'A sweets-island of Totland.' }, nationId: 'nation-op-grand-line-new-world', importance: 'minor', canonStatus: 'canon', referenceStatus: 'needs_verification', tags: ['totland', 'isola'] },
  { id: 'loc-op-tl-biscuits', worldId: 'world-onepiece', mapLevelId: 'op-map-totland', name: 'Biscuits Island', localizedName: { it: 'Isola dei Biscotti', en: 'Biscuits Island' }, type: 'landmark', x: 770, y: 500, shortDescription: { it: 'Isola-dolce di Totland.', en: 'A sweets-island of Totland.' }, nationId: 'nation-op-grand-line-new-world', importance: 'minor', canonStatus: 'canon', referenceStatus: 'needs_verification', tags: ['totland', 'isola'] },
  { id: 'loc-op-tl-candy', worldId: 'world-onepiece', mapLevelId: 'op-map-totland', name: 'Candy Island', localizedName: { it: 'Isola delle Caramelle', en: 'Candy Island' }, type: 'landmark', x: 560, y: 560, shortDescription: { it: 'Isola-dolce di Totland.', en: 'A sweets-island of Totland.' }, nationId: 'nation-op-grand-line-new-world', importance: 'minor', canonStatus: 'canon', referenceStatus: 'needs_verification', tags: ['totland', 'isola'] },
  { id: 'loc-op-tl-cheese', worldId: 'world-onepiece', mapLevelId: 'op-map-totland', name: 'Cheese Island', localizedName: { it: 'Isola del Formaggio', en: 'Cheese Island' }, type: 'landmark', x: 910, y: 470, shortDescription: { it: 'Isola-dolce di Totland.', en: 'A sweets-island of Totland.' }, nationId: 'nation-op-grand-line-new-world', importance: 'minor', canonStatus: 'canon', referenceStatus: 'needs_verification', tags: ['totland', 'isola'] },
  { id: 'loc-op-tl-komugi', worldId: 'world-onepiece', mapLevelId: 'op-map-totland', name: 'Komugi Island', localizedName: { it: 'Isola di Komugi', en: 'Komugi Island' }, type: 'landmark', x: 340, y: 580, shortDescription: { it: 'Isola-dolce di Totland.', en: 'A sweets-island of Totland.' }, nationId: 'nation-op-grand-line-new-world', importance: 'minor', canonStatus: 'canon', referenceStatus: 'needs_verification', tags: ['totland', 'isola'] },
  { id: 'loc-op-tl-flavor', worldId: 'world-onepiece', mapLevelId: 'op-map-totland', name: 'Flavor Island', localizedName: { it: 'Isola del Gusto', en: 'Flavor Island' }, type: 'landmark', x: 690, y: 600, shortDescription: { it: 'Isola-dolce di Totland.', en: 'A sweets-island of Totland.' }, nationId: 'nation-op-grand-line-new-world', importance: 'minor', canonStatus: 'canon', referenceStatus: 'needs_verification', tags: ['totland', 'isola'] },
  { id: 'loc-op-tl-kibi', worldId: 'world-onepiece', mapLevelId: 'op-map-totland', name: 'Kibi Island', localizedName: { it: 'Isola di Kibi', en: 'Kibi Island' }, type: 'landmark', x: 890, y: 610, shortDescription: { it: 'Isola-dolce di Totland.', en: 'A sweets-island of Totland.' }, nationId: 'nation-op-grand-line-new-world', importance: 'minor', canonStatus: 'canon', referenceStatus: 'needs_verification', tags: ['totland', 'isola'] },
  { id: 'loc-op-tl-margarine', worldId: 'world-onepiece', mapLevelId: 'op-map-totland', name: 'Margarine Island', localizedName: { it: 'Isola della Margarina', en: 'Margarine Island' }, type: 'landmark', x: 200, y: 360, shortDescription: { it: 'Isola-dolce di Totland.', en: 'A sweets-island of Totland.' }, nationId: 'nation-op-grand-line-new-world', importance: 'minor', canonStatus: 'canon', referenceStatus: 'needs_verification', tags: ['totland', 'isola'] },
];
