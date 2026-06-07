import type { TimelineEvent } from '@/types';

/**
 * Eventi della timeline legati a North Blue (backstory di Flevance e Law).
 * `order` negativo: precedono la sequenza di East Blue (1–12) di circa 13 anni.
 */
const NORTH_BLUE_BACKSTORY = { it: 'Backstory · North Blue', en: 'Backstory · North Blue' } as const;

export const onepieceEventsNorthBlue: TimelineEvent[] = [
  {
    id: 'evt-op-flevance-tragedy',
    worldId: 'world-onepiece',
    longDescription: {
      it: "Flevance, la «Città Bianca», prosperava grazie al Piombo Ambrato ignorando che il minerale provoca un Saturnismo mortale. Quando il male esplode, le nazioni vicine — d'accordo col Governo Mondiale — sterminano gli abitanti col pretesto del contagio. Il giovane Law, malato e orfano, fugge solo e divorato dall'odio.",
      en: "Flevance, the 'White City', thrived on Amber Lead, unaware the ore causes a deadly lead poisoning. When the sickness erupts, the neighbouring nations — in league with the World Government — exterminate the people under the pretext of contagion. Young Law, sick and orphaned, flees alone and consumed by hatred.",
    },
    mangaChapters: ["760-763"],
    animeEpisodes: ["703-706"],
    title: { it: 'La tragedia di Flevance', en: 'The Flevance tragedy' },
    description: {
      it: "La «Città Bianca» di Flevance, arricchitasi con il Piombo Ambrato, scopre troppo tardi che il minerale provoca un Saturnismo mortale. Le nazioni vicine, temendo il contagio, sterminano gli abitanti: il giovane Law perde la famiglia e fugge, malato.",
      en: "Flevance, the 'White City' enriched by Amber Lead, learns too late that the ore causes a deadly lead poisoning. Fearing contagion, the neighbouring nations exterminate its people: young Law loses his family and flees, sick.",
    },
    period: NORTH_BLUE_BACKSTORY,
    arcId: 'arc-op-flevance',
    locationId: 'loc-op-flevance',
    characterIds: ['char-op-law'],
    order: -2,
    canon: 'canon',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['north-blue', 'flevance', 'law'],
  },
  {
    id: 'evt-op-law-ope-ope',
    worldId: 'world-onepiece',
    longDescription: {
      it: "Raccolto dalla famiglia Donquijote, Law trova in Corazon — fratello di Doflamingo e segreto ufficiale della Marina — una figura paterna. Su Minion Island Corazon ruba per lui il Frutto Ope Ope, lo cura dal Saturnismo e muore proteggendolo dal fratello, lasciandogli un nuovo nome e una ragione per vivere.",
      en: "Taken in by the Donquixote family, Law finds a father figure in Corazon — Doflamingo's brother and a secret Marine officer. On Minion Island Corazon steals the Ope Ope Fruit for him, cures his lead poisoning and dies shielding him from his brother, leaving him a new name and a reason to live.",
    },
    mangaChapters: ["764-767"],
    animeEpisodes: ["707-711"],
    title: { it: 'Il dono del Frutto Ope Ope', en: 'The gift of the Ope Ope Fruit' },
    description: {
      it: "A Minion Island, Corazon — ufficiale segreto della Marina infiltrato tra i Donquijote — sacrifica la vita per donare a Law il Frutto Ope Ope, curandolo dal Saturnismo e strappandolo all'odio del fratello Doflamingo.",
      en: "On Minion Island, Corazon — a secret Marine officer infiltrated among the Donquixote — gives his life to grant Law the Ope Ope Fruit, curing his lead poisoning and tearing him from his brother Doflamingo's hatred.",
    },
    period: NORTH_BLUE_BACKSTORY,
    arcId: 'arc-op-flevance',
    locationId: 'loc-op-minion-island',
    characterIds: ['char-op-law', 'char-op-corazon', 'char-op-doflamingo'],
    factionIds: ['faction-op-donquixote-pirates'],
    order: -1,
    canon: 'canon',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['north-blue', 'law', 'ope-ope', 'corazon'],
  },
];
