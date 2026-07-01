import type { Nation } from '@/types';

/**
 * "Nazioni" Dragon Ball: qui il facet nazione/continente (vedi
 * `WorldConfig.nationTerm` in `worlds.ts`) è riusato per raggruppare i
 * luoghi per PIANETA/REGNO — la Terra, ma anche Namecc, il Pianeta Vegeta
 * (distrutto), il Pianeta di Beerus e l'Aldilà — così restano filtrabili
 * come per le altre opere, pur non essendo "nazioni" in senso stretto.
 */
export const dragonballNations: Nation[] = [
  {
    id: 'nation-dbz-earth',
    worldId: 'world-dragonball',
    name: 'Earth',
    localizedName: { it: 'Terra', en: 'Earth' },
    type: 'great_nation',
    description: {
      it: "Il pianeta natale di Goku (adottivo) e della maggior parte dei Guerrieri Z: sede della gran parte delle saghe, dal Torneo Tenkaichi ai Cell Games.",
      en: "The adopted homeworld of Goku and most of the Z Fighters: the setting for most sagas, from the Tenkaichi Budokai to the Cell Games.",
    },
    capitalLocationId: 'loc-dbz-west-city',
    relatedLocationIds: [
      'loc-dbz-goku-house',
      'loc-dbz-kame-house',
      'loc-dbz-capsule-corp',
      'loc-dbz-west-city',
      'loc-dbz-korin-tower',
      'loc-dbz-lookout',
      'loc-dbz-red-ribbon-hq',
      'loc-dbz-pilaf-castle',
      'loc-dbz-tenkaichi-arena',
      'loc-dbz-cell-games-arena',
      'loc-dbz-babidis-spaceship',
      'loc-dbz-gero-lab',
      'loc-dbz-satan-city',
      'loc-dbz-space-gate',
    ],
    relatedArcIds: [
      'arc-dbz-pilaf-saga',
      'arc-dbz-tenkaichi-tournament',
      'arc-dbz-red-ribbon',
      'arc-dbz-king-piccolo',
      'arc-dbz-piccolo-jr',
      'arc-dbz-saiyan-saga',
      'arc-dbz-androids',
      'arc-dbz-cell-saga',
      'arc-dbz-majin-buu',
    ],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['terra'],
  },
  {
    id: 'nation-dbz-namek',
    worldId: 'world-dragonball',
    name: 'Namek',
    localizedName: { it: 'Namecc', en: 'Namek' },
    type: 'neutral_land',
    description: {
      it: 'Pianeta natale della razza namecciana, teatro della saga di Namecc/Freezer.',
      en: 'Homeworld of the Namekian race, the setting of the Namek/Frieza saga.',
    },
    relatedLocationIds: ['loc-dbz-namek-planet'],
    relatedArcIds: ['arc-dbz-namek-frieza'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['namecciani'],
  },
  {
    id: 'nation-dbz-planet-vegeta',
    worldId: 'world-dragonball',
    name: 'Planet Vegeta',
    localizedName: { it: 'Pianeta Vegeta', en: 'Planet Vegeta' },
    type: 'neutral_land',
    description: {
      it: 'Pianeta natale dei Saiyan, distrutto da Freezer. Sede del prologo della saga dei Saiyan (Bardack, la vecchia guardia dei Saiyan).',
      en: "The Saiyans' homeworld, destroyed by Frieza. The setting of the Saiyan saga's prologue (Bardock and the old Saiyan guard).",
    },
    relatedLocationIds: ['loc-dbz-vegeta-planet'],
    relatedArcIds: ['arc-dbz-saiyan-saga'],
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['saiyan', 'pianeta-distrutto'],
  },
  {
    id: 'nation-dbz-beerus-planet',
    worldId: 'world-dragonball',
    name: "Beerus's Planet",
    localizedName: { it: 'Pianeta di Beerus', en: "Beerus's Planet" },
    type: 'neutral_land',
    description: {
      it: "Dimora del Dio della Distruzione dell'Universo 7 e del suo angelo Whis.",
      en: "Home of Universe 7's God of Destruction and his angel Whis.",
    },
    relatedLocationIds: ['loc-dbz-beerus-planet'],
    relatedArcIds: ['arc-dbz-battle-of-gods', 'arc-dbz-resurrection-f'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['universo-7'],
  },
  {
    id: 'nation-dbz-other-world',
    worldId: 'world-dragonball',
    name: 'Other World',
    localizedName: { it: 'Aldilà / Regno Celeste', en: 'Other World / Celestial Realm' },
    type: 'neutral_land',
    description: {
      it: "La dimensione dell'aldilà e i regni celesti a essa collegati: il Pianeta di Re Kaiō, raggiunto tramite la Via del Serpente, e il Mondo Sacro dei Kaiōshin.",
      en: "The realm of the afterlife and the celestial realms connected to it: King Kai's planet, reached via Snake Way, and the Sacred World of the Kais.",
    },
    relatedLocationIds: ['loc-dbz-other-world', 'loc-dbz-kaio-planet', 'loc-dbz-sacred-world-kais'],
    relatedArcIds: ['arc-dbz-saiyan-saga', 'arc-dbz-cell-saga', 'arc-dbz-majin-buu', 'arc-dbz-goku-black'],
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['aldila'],
  },
];
