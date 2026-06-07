import type { Nation } from '@/types';

/**
 * Mari e macro-regioni di One Piece.
 *
 * La geografia del mondo è organizzata attorno a due assi: la Red Line (il
 * continente-anello che taglia il globo in verticale) e la Grand Line (la rotta
 * che lo taglia in orizzontale, perpendicolare alla Red Line). I loro incroci
 * dividono il mare in quattro Mari: North, East, South e West Blue. La Grand
 * Line è a sua volta divisa in Paradise (prima metà) e New World (seconda metà),
 * affiancata dalle due fasce invalicabili di Calm Belt.
 *
 * Qui i Mari/regioni sono modellati come `Nation` (macro-aree): le singole isole
 * sono `Location` collegate via `nationId`.
 */
export const onepieceNations: Nation[] = [
  {
    id: 'nation-op-east-blue',
    worldId: 'world-onepiece',
    name: 'East Blue',
    localizedName: { it: 'East Blue', en: 'East Blue' },
    type: 'neutral_land',
    description: {
      it: 'Il più debole e pacifico dei quattro Mari, nel quadrante nord-est. Patria di Monkey D. Rufy e culla della ciurma di Cappello di Paglia: qui si trovano Dawn Island, Shells Town, Orange Town, Syrup Village, il Baratie e le Isole Conomi.',
      en: "The weakest and most peaceful of the four Seas, in the north-east quadrant. Monkey D. Luffy's homeland and the cradle of the Straw Hat crew: it holds Dawn Island, Shells Town, Orange Town, Syrup Village, the Baratie and the Conomi Islands.",
    },
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    color: '#2f7fe0',
    labelPosition: { x: 1620, y: 45 },
    tags: ['mare', 'east-blue'],
  },
  {
    id: 'nation-op-north-blue',
    worldId: 'world-onepiece',
    name: 'North Blue',
    localizedName: { it: 'North Blue', en: 'North Blue' },
    type: 'neutral_land',
    description: {
      it: 'Il Mare settentrionale, nel quadrante nord-ovest. Mare natale di numerosi personaggi (Law, Bellamy, Hawkins) e teatro della tragedia di Flevance, il Regno Bianco distrutto dal Saturnismo ambrato.',
      en: 'The northern Sea, in the north-west quadrant. Birthplace of many characters (Law, Bellamy, Hawkins) and stage of the Flevance tragedy, the White Kingdom destroyed by Amber Lead Syndrome.',
    },
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    color: '#2f7fe0',
    labelPosition: { x: 380, y: 45 },
    tags: ['mare', 'north-blue'],
  },
  {
    id: 'nation-op-west-blue',
    worldId: 'world-onepiece',
    name: 'West Blue',
    localizedName: { it: 'West Blue', en: 'West Blue' },
    type: 'neutral_land',
    description: {
      it: 'Il Mare occidentale, nel quadrante sud-ovest. Comprende Ohara — l\'isola degli studiosi distrutta dal Buster Call — e God Valley, teatro dell\'incidente che legò Garp e Roger contro Rocks D. Xebec.',
      en: "The western Sea, in the south-west quadrant. It includes Ohara — the scholars' island destroyed by the Buster Call — and God Valley, stage of the incident that bound Garp and Roger against Rocks D. Xebec.",
    },
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    color: '#2f7fe0',
    labelPosition: { x: 360, y: 965 },
    tags: ['mare', 'west-blue'],
  },
  {
    id: 'nation-op-south-blue',
    worldId: 'world-onepiece',
    name: 'South Blue',
    localizedName: { it: 'South Blue', en: 'South Blue' },
    type: 'neutral_land',
    description: {
      it: 'Il Mare meridionale, nel quadrante sud-est. Mare d\'origine di molti membri della ciurma e di interi popoli, ricco di regni e isole sparse fino ai confini della mappa.',
      en: 'The southern Sea, in the south-east quadrant. Home sea of many crew members and entire peoples, dotted with kingdoms and islands stretching to the edges of the map.',
    },
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    color: '#2f7fe0',
    labelPosition: { x: 1640, y: 965 },
    tags: ['mare', 'south-blue'],
  },
  {
    id: 'nation-op-grand-line-paradise',
    worldId: 'world-onepiece',
    name: 'Grand Line — Paradise',
    localizedName: { it: 'Grand Line — Paradise', en: 'Grand Line — Paradise' },
    type: 'neutral_land',
    description: {
      it: 'La prima metà della Grand Line, da Reverse Mountain fino alla Red Line. Soprannominata "Paradise" con ironia dagli abitanti del New World: comprende Whisky Peak, Little Garden, Drum Island, Alabasta, Jaya, Skypiea, Water Seven, Enies Lobby, Thriller Bark e l\'Arcipelago Sabaody.',
      en: 'The first half of the Grand Line, from Reverse Mountain to the Red Line. Ironically nicknamed "Paradise" by New World dwellers: it includes Whisky Peak, Little Garden, Drum Island, Alabasta, Jaya, Skypiea, Water Seven, Enies Lobby, Thriller Bark and the Sabaody Archipelago.',
    },
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    color: '#3fbf8f',
    labelPosition: { x: 1180, y: 452 },
    tags: ['grand-line', 'paradise'],
  },
  {
    id: 'nation-op-grand-line-new-world',
    worldId: 'world-onepiece',
    name: 'Grand Line — New World',
    localizedName: { it: 'Grand Line — New World', en: 'Grand Line — New World' },
    type: 'neutral_land',
    description: {
      it: 'La seconda e più letale metà della Grand Line, oltre la Red Line, dove regnano gli Imperatori. Comprende Fish-Man Island (sotto la Red Line), Punk Hazard, Dressrosa, Zou, Whole Cake Island, Wano e il leggendario traguardo finale: Laugh Tale.',
      en: 'The second and deadliest half of the Grand Line, beyond the Red Line, ruled by the Emperors. It includes Fish-Man Island (beneath the Red Line), Punk Hazard, Dressrosa, Zou, Whole Cake Island, Wano and the legendary final goal: Laugh Tale.',
    },
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    color: '#9e2b8f',
    labelPosition: { x: 150, y: 452 },
    tags: ['grand-line', 'new-world'],
  },
  {
    id: 'nation-op-calm-belt',
    worldId: 'world-onepiece',
    name: 'Calm Belt',
    localizedName: { it: 'Calm Belt', en: 'Calm Belt' },
    type: 'uncertain',
    description: {
      it: 'Le due fasce di mare immobile che affiancano la Grand Line: niente vento né correnti, e tane dei Re del Mare. Quasi invalicabili senza navi rivestite o l\'uso del fondale marino. Vi sorgono Amazon Lily e Impel Down.',
      en: "The two belts of dead-calm sea flanking the Grand Line: no wind, no currents, and the nests of the Sea Kings. Nearly impassable without coated ships or the sea floor. Amazon Lily and Impel Down rise within them.",
    },
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    color: '#7fb8d8',
    labelPosition: { x: 700, y: 432 },
    tags: ['calm-belt'],
  },
  {
    id: 'nation-op-red-line',
    worldId: 'world-onepiece',
    name: 'Red Line',
    localizedName: { it: 'Red Line', en: 'Red Line' },
    type: 'neutral_land',
    description: {
      it: 'Il continente-anello che cinge il mondo in verticale, intersecando la Grand Line. Sulla sua sommità sorge Mary Geoise, capitale del Governo Mondiale; alla base, Reverse Mountain (l\'unico accesso alla Grand Line dai quattro Mari) e, sotto il mare, Fish-Man Island.',
      en: 'The ring-continent girdling the world vertically, intersecting the Grand Line. Mary Geoise, the World Government capital, sits at its summit; at its base lie Reverse Mountain (the only gateway to the Grand Line from the four Seas) and, beneath the sea, Fish-Man Island.',
    },
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    color: '#c0392b',
    labelPosition: { x: 975, y: 250 },
    tags: ['red-line'],
  },
];
