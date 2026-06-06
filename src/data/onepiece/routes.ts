import type { Route } from '@/types';

/**
 * Percorsi narrativi di One Piece — il viaggio della ciurma, per mare.
 * East Blue: dalla partenza da Foosha fino all'ingresso nella Grand Line a
 * Reverse Mountain. Ogni step è ancorato a un luogo, un evento e un arco.
 */
export const onepieceRoutes: Route[] = [
  {
    id: 'route-op-eastblue',
    worldId: 'world-onepiece',
    type: 'narrative',
    name: 'East Blue — il primo viaggio',
    localizedName: {
      it: 'East Blue — il primo viaggio',
      en: 'East Blue — the first voyage',
    },
    description: {
      it: "Il viaggio dei Cappello di Paglia attraverso East Blue: da Foosha, dove Rufy salpa, alla raccolta dei primi compagni, fino all'ingresso nella Grand Line a Reverse Mountain.",
      en: "The Straw Hats' journey across East Blue: from Foosha, where Luffy sets sail, through gathering the first companions, to entering the Grand Line at Reverse Mountain.",
    },
    protagonistCharacterIds: [
      'char-op-luffy',
      'char-op-zoro',
      'char-op-nami',
      'char-op-usopp',
      'char-op-sanji',
    ],
    relatedArcIds: [
      'arc-op-romance-dawn',
      'arc-op-orange-town',
      'arc-op-syrup-village',
      'arc-op-baratie',
      'arc-op-arlong-park',
      'arc-op-loguetown',
    ],
    color: '#e23b3b',
    lineStyle: 'solid',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['east-blue', 'cappello-di-paglia'],
    steps: [
      {
        order: 1,
        locationId: 'loc-op-foosha-village',
        arcId: 'arc-op-romance-dawn',
        eventId: 'evt-op-luffy-sets-sail',
        title: { it: 'Partenza da Foosha', en: 'Departure from Foosha' },
        description: {
          it: 'Rufy salpa da solo, deciso a formare una ciurma.',
          en: 'Luffy sets sail alone, determined to form a crew.',
        },
      },
      {
        order: 2,
        locationId: 'loc-op-shells-town',
        arcId: 'arc-op-romance-dawn',
        eventId: 'evt-op-zoro-recruited',
        title: { it: 'Shells Town — Zoro', en: 'Shells Town — Zoro' },
        description: {
          it: 'Rufy libera Zoro e depone il capitano Morgan.',
          en: 'Luffy frees Zoro and deposes Captain Morgan.',
        },
      },
      {
        order: 3,
        locationId: 'loc-op-orange-town',
        arcId: 'arc-op-orange-town',
        eventId: 'evt-op-buggy-orange-town',
        title: { it: 'Orange Town — Bagy', en: 'Orange Town — Buggy' },
        description: {
          it: 'Sconfitta di Bagy il Clown; primo incontro con Nami.',
          en: 'Defeat of Buggy the Clown; first meeting with Nami.',
        },
      },
      {
        order: 4,
        locationId: 'loc-op-syrup-village',
        arcId: 'arc-op-syrup-village',
        eventId: 'evt-op-usopp-kuro',
        title: { it: 'Syrup Village — Usop', en: 'Syrup Village — Usopp' },
        description: {
          it: 'Sventato il piano di Kuro; la ciurma ottiene la Going Merry.',
          en: "Kuro's plan foiled; the crew obtains the Going Merry.",
        },
      },
      {
        order: 5,
        locationId: 'loc-op-baratie',
        arcId: 'arc-op-baratie',
        eventId: 'evt-op-baratie-krieg',
        title: { it: 'Baratie — Sanji', en: 'Baratie — Sanji' },
        description: {
          it: 'Scontro con Don Krieg e Mihawk; Sanji si unisce alla ciurma.',
          en: 'Clash with Don Krieg and Mihawk; Sanji joins the crew.',
        },
      },
      {
        order: 6,
        locationId: 'loc-op-arlong-park',
        arcId: 'arc-op-arlong-park',
        eventId: 'evt-op-arlong-liberation',
        title: { it: 'Arlong Park — Nami', en: 'Arlong Park — Nami' },
        description: {
          it: 'Caduta di Arlong; le Isole Conomi sono libere e Nami si unisce.',
          en: 'Arlong falls; the Conomi Islands are freed and Nami joins.',
        },
      },
      {
        order: 7,
        locationId: 'loc-op-loguetown',
        arcId: 'arc-op-loguetown',
        eventId: 'evt-op-loguetown-execution',
        title: { it: 'Loguetown', en: 'Loguetown' },
        description: {
          it: 'Rufy sfiora la morte sul patibolo di Roger; Dragon interviene.',
          en: "Luffy brushes death on Roger's scaffold; Dragon intervenes.",
        },
      },
      {
        order: 8,
        locationId: 'loc-op-reverse-mountain',
        arcId: 'arc-op-loguetown',
        eventId: 'evt-op-enter-grand-line',
        title: { it: 'Reverse Mountain', en: 'Reverse Mountain' },
        description: {
          it: 'La ciurma risale Reverse Mountain ed entra nella Grand Line.',
          en: 'The crew climbs Reverse Mountain and enters the Grand Line.',
        },
      },
    ],
  },
];
