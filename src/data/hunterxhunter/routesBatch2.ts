import type { Route } from '@/types';

/**
 * Percorsi narrativi di Hunter x Hunter — batch 2 (completamento).
 *
 * Coprono i fili rimasti: Leorio, l'ascesa delle Formiche Chimera, l'ultima
 * missione di Netero, la parabola di Meruem e Komugi, la guerra di
 * successione di Kakin e le lezioni di Nen di Kurapika sulla Black Whale.
 * Ogni step usa `locationId` ed `eventId` già esistenti nel dataset.
 */
export const hxhRoutesBatch2: Route[] = [
  /* ===================== LEORIO ===================== */
  {
    id: 'route-hxh-leorio-path',
    worldId: 'world-hunterxhunter',
    type: 'character',
    name: 'Il cammino di Leorio',
    localizedName: { it: 'Il cammino di Leorio', en: "Leorio's path" },
    description: {
      it: "Da aspirante medico all'Esame fino al gesto che lo rende celebre durante l'elezione: il pugno a Ging davanti a tutti gli Hunter.",
      en: 'From aspiring doctor at the Exam to the act that makes him famous during the election: punching Ging before all the Hunters.',
    },
    protagonistCharacterIds: ['char-hxh-leorio'],
    relatedCharacterIds: ['char-hxh-gon', 'char-hxh-kurapika', 'char-hxh-ging'],
    color: '#0a8754',
    lineStyle: 'solid',
    steps: [
      { order: 1, locationId: 'loc-hxh-zaban-city', label: { it: "All'Esame per Hunter", en: 'At the Hunter Exam' }, eventId: 'ev-hxh-exam-begins' },
      { order: 2, locationId: 'loc-hxh-zaban-city', label: { it: 'Elezione: il pugno a Ging', en: 'Election: punching Ging' }, eventId: 'ev-hxh-leorio-punches-ging' },
    ],
    arcId: 'arc-hxh-election',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['leorio', 'elezione'],
  },

  /* ===================== KURAPIKA (Black Whale) ===================== */
  {
    id: 'route-hxh-kurapika-blackwhale',
    worldId: 'world-hunterxhunter',
    type: 'character',
    name: 'Kurapika sulla Black Whale',
    localizedName: { it: 'Kurapika sulla Black Whale', en: 'Kurapika aboard the Black Whale' },
    description: {
      it: "Guardia della principessa Woble, Kurapika istruisce le guardie reali nel Nen e dà la caccia agli Occhi Scarlatti del principe Tserriednich.",
      en: "Princess Woble's bodyguard, Kurapika trains the royal guards in Nen and hunts the Scarlet Eyes held by Prince Tserriednich.",
    },
    protagonistCharacterIds: ['char-hxh-kurapika'],
    relatedCharacterIds: ['char-hxh-woble', 'char-hxh-oito', 'char-hxh-bill', 'char-hxh-tserriednich'],
    color: '#c0392b',
    lineStyle: 'dashed',
    steps: [
      { order: 1, locationId: 'loc-hxh-kakin', label: { it: 'Guardia di Woble', en: "Woble's guard" }, eventId: 'ev-hxh-kurapika-woble' },
      { order: 2, locationId: 'loc-hxh-kakin', label: { it: 'Lezioni di Nen', en: 'Nen lessons' }, eventId: 'ev-hxh-kurapika-nen-lessons' },
      { order: 3, locationId: 'loc-hxh-kakin', label: { it: 'Gli Occhi di Tserriednich', en: "Tserriednich's Eyes" }, eventId: 'ev-hxh-tserriednich-eyes' },
    ],
    arcId: 'arc-hxh-succession-contest',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['kurapika', 'successione', 'woble'],
  },

  /* ===================== FORMICHE CHIMERA (ascesa) ===================== */
  {
    id: 'route-hxh-chimera-rise',
    worldId: 'world-hunterxhunter',
    type: 'faction',
    name: "L'ascesa delle Formiche Chimera",
    localizedName: { it: "L'ascesa delle Formiche Chimera", en: 'The rise of the Chimera Ants' },
    description: {
      it: "Dalla Regina approdata nella NGL alla conquista di East Gorteau e alla nascita del Re Meruem con le sue Guardie Reali.",
      en: 'From the Queen washed ashore in the NGL to the takeover of East Gorteau and the birth of King Meruem with his Royal Guard.',
    },
    protagonistCharacterIds: ['char-hxh-meruem'],
    relatedCharacterIds: ['char-hxh-colt', 'char-hxh-neferpitou', 'char-hxh-shaiapouf', 'char-hxh-menthuthuyoupi'],
    color: '#6c3483',
    lineStyle: 'solid',
    steps: [
      { order: 1, locationId: 'loc-hxh-ngl', label: { it: 'La Regina approda', en: 'The Queen arrives' }, eventId: 'ev-hxh-queen-washes-ashore' },
      { order: 2, locationId: 'loc-hxh-ngl', label: { it: 'Nascita del Re', en: 'Birth of the King' }, eventId: 'ev-hxh-king-born' },
      { order: 3, locationId: 'loc-hxh-east-gorteau', label: { it: 'Conquista di East Gorteau', en: 'East Gorteau takeover' }, eventId: 'ev-hxh-king-takes-gorteau' },
      { order: 4, locationId: 'loc-hxh-east-gorteau', label: { it: 'La Selezione', en: 'The Selection' }, eventId: 'ev-hxh-selection-broadcast' },
    ],
    arcId: 'arc-hxh-chimera-ant',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['chimera-ant', 'meruem'],
  },

  /* ===================== NETERO (ultima missione) ===================== */
  {
    id: 'route-hxh-netero-last-mission',
    worldId: 'world-hunterxhunter',
    type: 'war_front',
    name: "L'ultima missione di Netero",
    localizedName: { it: "L'ultima missione di Netero", en: "Netero's last mission" },
    description: {
      it: "Il Presidente forma la squadra di sterminio e guida l'assalto al palazzo, fino al sacrificio finale contro il Re con la Rosa del Povero.",
      en: 'The Chairman forms the extermination team and leads the palace assault, up to his final sacrifice against the King with the Poor Man\'s Rose.',
    },
    protagonistCharacterIds: ['char-hxh-netero'],
    relatedCharacterIds: ['char-hxh-zeno', 'char-hxh-morel', 'char-hxh-knov', 'char-hxh-meruem'],
    color: '#34495e',
    lineStyle: 'solid',
    steps: [
      { order: 1, locationId: 'loc-hxh-east-gorteau', label: { it: 'Squadra di sterminio', en: 'Extermination team' }, eventId: 'ev-hxh-extermination-team' },
      { order: 2, locationId: 'loc-hxh-east-gorteau', label: { it: 'Dragon Dive di Zeno', en: "Zeno's Dragon Dive" }, eventId: 'ev-hxh-zeno-dragon-dive' },
      { order: 3, locationId: 'loc-hxh-east-gorteau', label: { it: 'Netero contro il Re', en: 'Netero vs the King' }, eventId: 'ev-hxh-netero-vs-meruem' },
      { order: 4, locationId: 'loc-hxh-east-gorteau', label: { it: 'La Rosa del Povero', en: "The Poor Man's Rose" }, eventId: 'ev-hxh-rose-poison' },
    ],
    arcId: 'arc-hxh-chimera-ant',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['netero', 'chimera-ant'],
  },

  /* ===================== MERUEM & KOMUGI ===================== */
  {
    id: 'route-hxh-meruem-komugi',
    worldId: 'world-hunterxhunter',
    type: 'narrative',
    name: 'Meruem e Komugi',
    localizedName: { it: 'Meruem e Komugi', en: 'Meruem and Komugi' },
    description: {
      it: "La parabola umana del Re: dal disprezzo per l'umanità al gioco del Gungi con la cieca Komugi, fino agli ultimi istanti insieme avvolti dal veleno.",
      en: "The King's human arc: from contempt for humanity to games of Gungi with the blind Komugi, to their final moments together enveloped by poison.",
    },
    protagonistCharacterIds: ['char-hxh-meruem', 'char-hxh-komugi'],
    relatedCharacterIds: ['char-hxh-shaiapouf', 'char-hxh-neferpitou'],
    color: '#8e44ad',
    lineStyle: 'dotted',
    steps: [
      { order: 1, locationId: 'loc-hxh-east-gorteau', label: { it: 'Il gioco del Gungi', en: 'The game of Gungi' }, eventId: 'ev-hxh-meruem-komugi' },
      { order: 2, locationId: 'loc-hxh-east-gorteau', label: { it: 'Le manovre di Pouf', en: "Pouf's machinations" }, eventId: 'ev-hxh-pouf-clones' },
      { order: 3, locationId: 'loc-hxh-east-gorteau', label: { it: 'Il risveglio del Re', en: "The King's awakening" }, eventId: 'ev-hxh-meruem-awakens' },
      { order: 4, locationId: 'loc-hxh-east-gorteau', label: { it: "L'ultima partita", en: 'The last game' }, eventId: 'ev-hxh-king-death' },
    ],
    arcId: 'arc-hxh-chimera-ant',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['meruem', 'komugi'],
  },

  /* ===================== GUERRA DI SUCCESSIONE ===================== */
  {
    id: 'route-hxh-succession-war',
    worldId: 'world-hunterxhunter',
    type: 'war_front',
    name: 'La guerra di successione di Kakin',
    localizedName: { it: 'La guerra di successione di Kakin', en: 'The Kakin succession war' },
    description: {
      it: "Sulla Black Whale i quattordici principi si contendono il trono tra bestie-guardiane di Nen, l'esercito di Benjamin e la comunità Heil-Ly di Morena.",
      en: 'Aboard the Black Whale the fourteen princes vie for the throne amid Nen guardian beasts, Benjamin\'s army and Morena\'s Heil-Ly community.',
    },
    protagonistCharacterIds: ['char-hxh-benjamin', 'char-hxh-tserriednich'],
    relatedCharacterIds: ['char-hxh-woble', 'char-hxh-halkenburg', 'char-hxh-morena', 'char-hxh-hinrigh'],
    color: '#b7950b',
    lineStyle: 'solid',
    steps: [
      { order: 1, locationId: 'loc-hxh-kakin', label: { it: 'La Black Whale salpa', en: 'The Black Whale sets sail' }, eventId: 'ev-hxh-black-whale-departs' },
      { order: 2, locationId: 'loc-hxh-kakin', label: { it: "Esercito di Benjamin", en: "Benjamin's army" }, eventId: 'ev-hxh-benjamin-army' },
      { order: 3, locationId: 'loc-hxh-kakin', label: { it: 'Le prime vittime', en: 'The first victims' }, eventId: 'ev-hxh-momoze-killed' },
      { order: 4, locationId: 'loc-hxh-kakin', label: { it: 'Hisoka contro la Brigata', en: 'Hisoka vs the Troupe' }, eventId: 'ev-hxh-hisoka-vs-troupe' },
    ],
    arcId: 'arc-hxh-succession-contest',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['successione', 'kakin'],
  },
];
