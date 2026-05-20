import type { Route } from '@/types';

/**
 * Percorsi narrativi seed di Naruto.
 * Le linee tracciate tra location sono concettuali, non distanze reali.
 */
export const narutoRoutes: Route[] = [
  {
    id: 'route-team7-waves',
    worldId: 'world-naruto',
    name: 'Team 7 · Missione nel Paese delle Onde',
    description:
      'Naruto, Sasuke, Sakura e Kakashi scortano Tazuna nel Paese delle Onde.',
    protagonistCharacterIds: ['char-naruto', 'char-sasuke', 'char-sakura', 'char-kakashi'],
    arcId: 'arc-prologue',
    color: '#1f9aff',
    steps: [
      { order: 1, locationId: 'loc-konoha', label: 'Partenza da Konoha' },
      { order: 2, locationId: 'loc-waves', label: 'Arrivo al Paese delle Onde', eventId: 'ev-waves-mission' },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-sasuke-defection',
    worldId: 'world-naruto',
    name: 'Sasuke · Fuga da Konoha',
    description:
      'Sasuke abbandona Konoha per cercare potere da Orochimaru.',
    protagonistCharacterIds: ['char-sasuke'],
    arcId: 'arc-sasuke-retrieval',
    color: '#e10b0b',
    steps: [
      { order: 1, locationId: 'loc-konoha', label: 'Diserzione', eventId: 'ev-sasuke-defection' },
      { order: 2, locationId: 'loc-valley-of-end', label: 'Duello con Naruto', eventId: 'ev-valley-end-1' },
      { order: 3, locationId: 'loc-orochimaru-hideout', label: 'Nascondiglio di Orochimaru' },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-naruto-training',
    worldId: 'world-naruto',
    name: 'Naruto · Allenamenti principali',
    description:
      'Da Konoha a Mt. Myōboku passando per gli allenamenti con Jiraiya.',
    protagonistCharacterIds: ['char-naruto'],
    color: '#f06600',
    steps: [
      { order: 1, locationId: 'loc-konoha-training-7', label: 'Team 7 / Prova dei sonagli', eventId: 'ev-team-7-formed' },
      { order: 2, locationId: 'loc-konoha', label: 'Allenamento Rasengan' },
      { order: 3, locationId: 'loc-mt-myoboku', label: 'Allenamento Sage Mode' },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-akatsuki',
    worldId: 'world-naruto',
    name: 'Akatsuki · Movimenti',
    description:
      'Spostamenti operativi dell\'Akatsuki ad Amegakure e oltre.',
    protagonistCharacterIds: ['char-itachi', 'char-pain', 'char-obito'],
    color: '#7d0606',
    steps: [
      { order: 1, locationId: 'loc-akatsuki-hq', label: 'Quartier generale' },
      { order: 2, locationId: 'loc-ame', label: 'Amegakure' },
      { order: 3, locationId: 'loc-suna', label: 'Rapimento di Gaara', eventId: 'ev-gaara-kidnap' },
      { order: 4, locationId: 'loc-konoha', label: 'Assalto di Pain', eventId: 'ev-pain-attack' },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-fourth-war',
    worldId: 'world-naruto',
    name: 'Quarta Guerra Ninja',
    description:
      'Spostamento dell\'Alleanza Shinobi sui fronti della guerra.',
    protagonistCharacterIds: ['char-naruto', 'char-sasuke', 'char-kakashi', 'char-gaara'],
    arcId: 'arc-fourth-war',
    color: '#ff8311',
    steps: [
      { order: 1, locationId: 'loc-konoha', label: 'Dichiarazione di guerra', eventId: 'ev-war-declaration' },
      { order: 2, locationId: 'loc-fourth-war-battlefield', label: 'Fronti principali', eventId: 'ev-edo-tensei-army' },
      { order: 3, locationId: 'loc-valley-of-end', label: 'Duello finale', eventId: 'ev-valley-end-2' },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-jiraiya',
    worldId: 'world-naruto',
    name: 'Jiraiya · Sentiero del Sennin',
    description:
      'Dai rospi di Mt. Myōboku alle ricerche su Akatsuki ad Amegakure.',
    protagonistCharacterIds: ['char-jiraiya'],
    color: '#86cdff',
    steps: [
      { order: 1, locationId: 'loc-konoha', label: 'Konoha' },
      { order: 2, locationId: 'loc-mt-myoboku', label: 'Mt. Myōboku' },
      { order: 3, locationId: 'loc-ame', label: 'Infiltrazione ad Amegakure', eventId: 'ev-jiraiya-vs-pain' },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-itachi',
    worldId: 'world-naruto',
    name: 'Itachi · Doppio agente',
    description:
      'Dalla strage Uchiha al confronto finale col fratello.',
    protagonistCharacterIds: ['char-itachi'],
    color: '#b00808',
    steps: [
      { order: 1, locationId: 'loc-konoha-uchiha-district', label: 'Strage del clan', eventId: 'ev-uchiha-massacre' },
      { order: 2, locationId: 'loc-akatsuki-hq', label: 'Akatsuki' },
      { order: 3, locationId: 'loc-orochimaru-hideout', label: 'Scontro con Sasuke', eventId: 'ev-itachi-vs-sasuke' },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-obito',
    worldId: 'world-naruto',
    name: 'Obito · La maschera dietro Tobi',
    description:
      'Dal ponte Kannabi al campo della Quarta Guerra.',
    protagonistCharacterIds: ['char-obito'],
    color: '#4cb6ff',
    steps: [
      { order: 1, locationId: 'loc-konoha-uchiha-district', label: 'Infanzia Uchiha' },
      { order: 2, locationId: 'loc-konoha', label: 'Attacco di Kurama', eventId: 'ev-kurama-attack' },
      { order: 3, locationId: 'loc-akatsuki-hq', label: 'Mente Akatsuki' },
      { order: 4, locationId: 'loc-fourth-war-battlefield', label: 'Quarta Guerra', eventId: 'ev-obito-vs-kakashi' },
    ],
    referenceStatus: 'verified',
  },
];
