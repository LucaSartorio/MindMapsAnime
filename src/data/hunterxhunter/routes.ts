import type { Route } from '@/types';

/**
 * Percorsi narrativi seed di Hunter x Hunter.
 * Le linee tra i luoghi sono concettuali (la mappa geografica reale è
 * rimandata): collegano i luoghi-chiave nell'ordine in cui la storia li tocca.
 */
export const hxhRoutes: Route[] = [
  {
    id: 'route-hxh-gon-journey',
    worldId: 'world-hunterxhunter',
    type: 'character',
    name: 'Il viaggio di Gon',
    localizedName: { it: 'Il viaggio di Gon', en: "Gon's journey" },
    description: {
      it: 'Dal villaggio natale fino alla resa dei conti con le Formiche Chimera, sulle tracce del padre Ging.',
      en: 'From his home village to the showdown with the Chimera Ants, following his father Ging.',
    },
    protagonistCharacterIds: ['char-hxh-gon', 'char-hxh-killua'],
    color: '#1f9aff',
    lineStyle: 'solid',
    steps: [
      { order: 1, locationId: 'loc-hxh-whale-island', label: { it: 'Isola della Balena', en: 'Whale Island' }, eventId: 'ev-hxh-gon-departs' },
      { order: 2, locationId: 'loc-hxh-zaban-city', label: { it: 'Esame per Hunter', en: 'Hunter Exam' }, eventId: 'ev-hxh-exam-begins' },
      { order: 3, locationId: 'loc-hxh-zoldyck-estate', label: { it: 'Liberare Killua', en: 'Freeing Killua' }, eventId: 'ev-hxh-kukuroo-climb' },
      { order: 4, locationId: 'loc-hxh-heavens-arena', label: { it: 'Imparare il Nen', en: 'Learning Nen' }, eventId: 'ev-hxh-learn-nen' },
      { order: 5, locationId: 'loc-hxh-yorknew', label: { it: 'Yorknew', en: 'Yorknew' }, eventId: 'ev-hxh-chrollo-captured' },
      { order: 6, locationId: 'loc-hxh-greed-island', label: { it: 'Greed Island', en: 'Greed Island' }, eventId: 'ev-hxh-enter-greed-island' },
      { order: 7, locationId: 'loc-hxh-ngl', label: { it: 'NGL · morte di Kite', en: 'NGL · Kite\'s death' }, eventId: 'ev-hxh-kite-killed' },
      { order: 8, locationId: 'loc-hxh-east-gorteau', label: { it: 'East Gorteau', en: 'East Gorteau' }, eventId: 'ev-hxh-palace-assault' },
    ],
    arcId: 'arc-hxh-hunter-exam',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['gon', 'viaggio'],
  },
  {
    id: 'route-hxh-kurapika-revenge',
    worldId: 'world-hunterxhunter',
    type: 'character',
    name: 'La vendetta di Kurapika',
    localizedName: { it: 'La vendetta di Kurapika', en: "Kurapika's revenge" },
    description: {
      it: 'La caccia di Kurapika alla Brigata Fantasma e agli Occhi Scarlatti, da Yorknew fino a Kakin.',
      en: "Kurapika's hunt for the Phantom Troupe and the Scarlet Eyes, from Yorknew to Kakin.",
    },
    protagonistCharacterIds: ['char-hxh-kurapika'],
    color: '#e10b0b',
    lineStyle: 'dashed',
    steps: [
      { order: 1, locationId: 'loc-hxh-zaban-city', label: { it: 'Diventa Hunter', en: 'Becomes a Hunter' }, eventId: 'ev-hxh-exam-begins' },
      { order: 2, locationId: 'loc-hxh-yorknew', label: { it: 'Scontro con la Brigata', en: 'Clash with the Troupe' }, eventId: 'ev-hxh-kurapika-vs-uvogin' },
      { order: 3, locationId: 'loc-hxh-kakin', label: { it: 'Verso il Continente Oscuro', en: 'Toward the Dark Continent' }, eventId: 'ev-hxh-black-whale-departs' },
    ],
    arcId: 'arc-hxh-yorknew-city',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['kurapika', 'vendetta'],
  },
  {
    id: 'route-hxh-chimera-campaign',
    worldId: 'world-hunterxhunter',
    type: 'war_front',
    name: 'Campagna contro le Formiche Chimera',
    localizedName: { it: 'Campagna contro le Formiche Chimera', en: 'Chimera Ant campaign' },
    description: {
      it: 'L\'avanzata degli Hunter dalla NGL al palazzo di East Gorteau per fermare il Re Meruem.',
      en: 'The Hunters\' advance from NGL to the East Gorteau palace to stop King Meruem.',
    },
    protagonistCharacterIds: ['char-hxh-netero', 'char-hxh-morel', 'char-hxh-knuckle'],
    relatedCharacterIds: ['char-hxh-gon', 'char-hxh-killua', 'char-hxh-knov', 'char-hxh-shoot'],
    color: '#f06600',
    lineStyle: 'solid',
    steps: [
      { order: 1, locationId: 'loc-hxh-ngl', label: { it: 'NGL · la minaccia', en: 'NGL · the threat' }, eventId: 'ev-hxh-queen-ngl' },
      { order: 2, locationId: 'loc-hxh-east-gorteau', label: { it: 'Assalto al palazzo', en: 'Palace assault' }, eventId: 'ev-hxh-palace-assault' },
    ],
    arcId: 'arc-hxh-chimera-ant',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['chimera-ant', 'hunter'],
  },
];
