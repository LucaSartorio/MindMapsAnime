import type { StoryArc } from '@/types';

/** Archi narrativi di Whole Cake Island e Wano. */
export const onepieceArcsWholeCakeWano: StoryArc[] = [
  {
    id: 'arc-op-whole-cake',
    worldId: 'world-onepiece',
    name: 'Whole Cake Island',
    localizedName: { it: 'Whole Cake Island', en: 'Whole Cake Island' },
    saga: { it: 'Saga di Whole Cake Island', en: 'Whole Cake Island Saga' },
    period: { it: 'New World · Totland', en: 'New World · Totland' },
    order: 66,
    description: {
      it: "Una squadra della ciurma entra nel territorio dell'Imperatrice Big Mom per riportare a casa Sanji, prigioniero di un matrimonio combinato con i Charlotte. Tra il tradimento del Germa, il duello con Katakuri e la fuga da Totland, Rufy sfida apertamente un Imperatore.",
      en: "Part of the crew enters Empress Big Mom's territory to bring Sanji home from an arranged marriage with the Charlotte. Amid Germa's betrayal, the duel with Katakuri and the escape from Totland, Luffy openly challenges an Emperor.",
    },
    locationIds: ['loc-op-whole-cake-island', 'loc-op-tl-sweet-city', 'loc-op-tl-cacao', 'loc-op-germa-kingdom'],
    nationIds: ['nation-op-grand-line-new-world'],
    characterIds: ['char-op-luffy', 'char-op-sanji', 'char-op-big-mom', 'char-op-katakuri', 'char-op-pudding', 'char-op-brulee', 'char-op-judge', 'char-op-pedro', 'char-op-jinbe'],
    factionIds: ['faction-op-straw-hat-pirates', 'faction-op-big-mom-pirates', 'faction-op-germa-66'],
    eventIds: ['evt-op-sanji-rescue', 'evt-op-katakuri-duel'],
    canon: 'canon',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['new-world', 'whole-cake', 'big-mom', 'sanji'],
  },
  {
    id: 'arc-op-wano',
    worldId: 'world-onepiece',
    name: 'Wano Country',
    localizedName: { it: 'Il Paese di Wano', en: 'Wano Country' },
    saga: { it: 'Saga di Wano', en: 'Wano Saga' },
    period: { it: 'New World · Wano', en: 'New World · Wano' },
    order: 68,
    description: {
      it: "Nel Paese chiuso di Wano la grande alleanza — ciurma, samurai Kozuki, mink e Heart Pirates — assalta Onigashima per rovesciare lo shogun Orochi e l'Imperatore Kaido. Tra l'eredità di Oden e i Nove Foderi Rossi, Rufy abbatte Kaido e diventa uno dei nuovi Imperatori.",
      en: "In the secluded country of Wano the grand alliance — crew, Kozuki samurai, minks and Heart Pirates — storms Onigashima to overthrow shogun Orochi and the Emperor Kaido. Amid Oden's legacy and the Nine Red Scabbards, Luffy strikes down Kaido and becomes one of the new Emperors.",
    },
    locationIds: ['loc-op-wano', 'loc-op-onigashima', 'loc-op-kuri', 'loc-op-flower-capital'],
    nationIds: ['nation-op-grand-line-new-world'],
    characterIds: ['char-op-luffy', 'char-op-law', 'char-op-kaido', 'char-op-big-mom', 'char-op-king', 'char-op-orochi', 'char-op-oden', 'char-op-momonosuke', 'char-op-yamato', 'char-op-kinemon', 'char-op-zoro'],
    factionIds: ['faction-op-straw-hat-pirates', 'faction-op-beasts-pirates', 'faction-op-kozuki', 'faction-op-heart-pirates', 'faction-op-big-mom-pirates'],
    eventIds: ['evt-op-oden-legacy', 'evt-op-onigashima-war', 'evt-op-kaido-defeat'],
    canon: 'canon',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['new-world', 'wano', 'kaido', 'kozuki'],
  },
];
