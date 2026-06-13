import type { Jutsu } from '@/types';

/**
 * Tecniche Nen di Hunter x Hunter — batch 3 (completamento canonico).
 *
 * Hatsu canonici mancanti di personaggi già presenti. Stessa modellazione:
 * `type` = categoria Nen, `classification` generica, `characterIds` verso i
 * possessori.
 */
export const hxhNenBatch3: Jutsu[] = [
  /* ===================== BRIGATA FANTASMA ===================== */
  {
    id: 'jutsu-hxh-nen-stitches',
    worldId: 'world-hunterxhunter',
    name: 'Nen Stitches',
    localizedName: { it: 'Fili di Nen', en: 'Nen Stitches' },
    japaneseName: '念糸',
    type: 'transmutation',
    classification: ['supplementary'],
    characterIds: ['char-hxh-machi'],
    shortDescription: {
      it: 'Machi trasmuta la propria aura in fili quasi invisibili (fino a 1/1000 mm) per ricucire ferite, riattaccare arti e manovrare bersagli come marionette.',
      en: 'Machi transmutes her aura into near-invisible threads (down to 1/1000 mm) to stitch wounds, reattach limbs and control targets like puppets.',
    },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['machi', 'brigata-fantasma'],
  },

  /* ===================== ZOLDYCK ===================== */
  {
    id: 'jutsu-hxh-explosive-orbs',
    worldId: 'world-hunterxhunter',
    name: 'Explosive Aura Spheres',
    localizedName: { it: 'Sfere d\'Aura Esplosive', en: 'Explosive Aura Spheres' },
    type: 'emission',
    classification: ['offensive'],
    characterIds: ['char-hxh-silva'],
    shortDescription: {
      it: 'Silva Zoldyck scaglia sfere di aura compressa che detonano all\'impatto con potenza devastante.',
      en: 'Silva Zoldyck hurls spheres of compressed aura that detonate on impact with devastating force.',
    },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['silva', 'zoldyck'],
  },
  {
    id: 'jutsu-hxh-nanika',
    worldId: 'world-hunterxhunter',
    name: 'Nanika (Wish-granting)',
    localizedName: { it: 'Nanika (Esaudire i desideri)', en: 'Nanika (Wish-granting)' },
    japaneseName: 'ナニカ',
    type: 'specialization',
    classification: ['supplementary'],
    characterIds: ['char-hxh-alluka', 'char-hxh-nanika'],
    shortDescription: {
      it: 'Nanika, l\'entità in Alluka, esaudisce qualsiasi desiderio dopo che vengono soddisfatte tre richieste crescenti; rifiutarle scatena un contraccolpo letale a catena.',
      en: 'Nanika, the entity within Alluka, grants any wish after three escalating demands are met; refusing them triggers a lethal chain backlash.',
    },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['alluka', 'nanika', 'zoldyck', 'continente-oscuro'],
  },

  /* ===================== FORMICHE CHIMERA ===================== */
  {
    id: 'jutsu-hxh-queen-shot',
    worldId: 'world-hunterxhunter',
    name: 'Queen Shot',
    localizedName: { it: 'Queen Shot (Puntura della Regina)', en: 'Queen Shot' },
    type: 'manipulation',
    classification: ['supplementary'],
    characterIds: ['char-hxh-zazan'],
    shortDescription: {
      it: 'Zazan inietta col pungiglione un siero che muta gli umani in ibridi-formica a lei fedeli.',
      en: 'Zazan injects a serum with her stinger that mutates humans into Ant-hybrids loyal to her.',
    },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['zazan', 'chimera-ant'],
  },
  {
    id: 'jutsu-hxh-hospitality',
    worldId: 'world-hunterxhunter',
    name: 'Hospitality of the Lion',
    localizedName: { it: 'Ospitalità del Leone', en: 'Hospitality of the Lion' },
    type: 'specialization',
    classification: ['supplementary'],
    characterIds: ['char-hxh-leol'],
    shortDescription: {
      it: 'Leol "prende in prestito" le abilità Nen altrui stipulando condizioni; ne mente deliberatamente sul vero funzionamento.',
      en: 'Leol "borrows" others\' Nen abilities by setting conditions; he deliberately lies about its true mechanics.',
    },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['leol', 'chimera-ant'],
  },

  /* ===================== HEAVENS ARENA ===================== */
  {
    id: 'jutsu-hxh-doppelganger',
    worldId: 'world-hunterxhunter',
    name: 'Doppelganger',
    localizedName: { it: 'Doppelganger (Doppio)', en: 'Doppelganger' },
    type: 'conjuration',
    classification: ['offensive'],
    characterIds: ['char-hxh-kastro'],
    shortDescription: {
      it: 'Kastro evoca un proprio doppio che attacca in autonomia; l\'uso scorretto della tecnica gli costa la vita contro Hisoka.',
      en: 'Kastro conjures a double of himself that attacks independently; misusing the technique costs him his life against Hisoka.',
    },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['kastro', 'heavens-arena'],
  },
  {
    id: 'jutsu-hxh-tornado-top',
    worldId: 'world-hunterxhunter',
    name: 'Battle Waltz (Tornado Top)',
    localizedName: { it: 'Trottole d\'Aura', en: 'Battle Waltz (Tornado Top)' },
    type: 'emission',
    classification: ['offensive'],
    characterIds: ['char-hxh-gido'],
    shortDescription: {
      it: 'Gido alimenta con l\'aura delle trottole che attaccano da sole, mantenendole in rotazione perpetua.',
      en: 'Gido fuels spinning tops with aura that attack on their own, keeping them in perpetual spin.',
    },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['gido', 'heavens-arena'],
  },
  {
    id: 'jutsu-hxh-thunder-snake',
    worldId: 'world-hunterxhunter',
    name: 'Thunder Snake',
    localizedName: { it: 'Serpe di Tuono', en: 'Thunder Snake' },
    type: 'transmutation',
    classification: ['offensive'],
    characterIds: ['char-hxh-riehlvelt'],
    shortDescription: {
      it: 'Riehlvelt incanala l\'aura in fruste-medusa elettriche, amplificate dalla sua sedia a rotelle.',
      en: 'Riehlvelt channels aura into electric jellyfish-whips, amplified through his wheelchair.',
    },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['riehlvelt', 'heavens-arena'],
  },

  /* ===================== GREED ISLAND ===================== */
  {
    id: 'jutsu-hxh-fourteen-devils',
    worldId: 'world-hunterxhunter',
    name: 'A Reason to Smile (Fourteen Devils)',
    localizedName: { it: 'I Quattordici Diavoli', en: 'A Reason to Smile (Fourteen Devils)' },
    type: 'conjuration',
    classification: ['offensive'],
    characterIds: ['char-hxh-razor'],
    shortDescription: {
      it: 'Razor evoca quattordici diavoli di Nen, ciascuno specializzato in un gioco; il più forte potenzia i suoi lanci nella sfida a dodgeball.',
      en: 'Razor conjures fourteen Nen devils, each specialized in a game; the strongest empowers his throws in the dodgeball challenge.',
    },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['razor', 'greed-island'],
  },
  {
    id: 'jutsu-hxh-nen-exorcism',
    worldId: 'world-hunterxhunter',
    name: 'Nen Exorcism',
    localizedName: { it: 'Esorcismo del Nen', en: 'Nen Exorcism' },
    type: 'specialization',
    classification: ['supplementary'],
    characterIds: ['char-hxh-abengane'],
    shortDescription: {
      it: 'Abengane rimuove o trasferisce le abilità e le maledizioni Nen altrui con un rituale; cancella la condizione-bomba di Genthru.',
      en: 'Abengane removes or transfers others\' Nen abilities and curses through a ritual; he clears Genthru\'s bomb condition.',
    },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['abengane', 'greed-island'],
  },

  /* ===================== YORKNEW · Nostrade ===================== */
  {
    id: 'jutsu-hxh-lovely-ghostwriter',
    worldId: 'world-hunterxhunter',
    name: 'Lovely Ghostwriter',
    localizedName: { it: "Autobiografia dell'Angelo", en: "Lovely Ghostwriter (Angel's Autobiography)" },
    type: 'specialization',
    classification: ['supplementary'],
    characterIds: ['char-hxh-neon'],
    shortDescription: {
      it: 'Una volta al mese Neon compone in trance poesie che predicono con precisione il futuro di chi le viene indicato.',
      en: 'Once a month Neon writes, in a trance, poems that accurately predict the future of those pointed out to her.',
    },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['neon', 'nostrade', 'yorknew'],
  },

  /* ===================== SUCCESSIONE ===================== */
  {
    id: 'jutsu-hxh-death-god-march',
    worldId: 'world-hunterxhunter',
    name: 'Beat of the Death God March',
    localizedName: { it: 'Marcia del Dio della Morte', en: 'Beat of the Death God March' },
    type: 'specialization',
    classification: ['offensive', 'supplementary'],
    characterIds: ['char-hxh-tserriednich'],
    shortDescription: {
      it: 'Abilità di altissimo livello autodidatta del principe Tserriednich: evoca un dio della morte capace di riportare in vita ciò che è stato distrutto.',
      en: 'Prince Tserriednich\'s self-taught top-tier ability: it manifests a death-god able to revive what has been destroyed.',
    },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['tserriednich', 'successione'],
  },
  {
    id: 'jutsu-hxh-fugetsu-door',
    worldId: 'world-hunterxhunter',
    name: 'Guardian Spirit Beast (Nen Door)',
    localizedName: { it: 'Bestia Guardiana (Porta di Nen)', en: 'Guardian Spirit Beast (Nen Door)' },
    type: 'conjuration',
    classification: ['supplementary'],
    characterIds: ['char-hxh-fugetsu'],
    shortDescription: {
      it: 'La bestia-guardiana della principessa Fugetsu evoca una porta di Nen che permette il teletrasporto da un luogo all\'altro.',
      en: "Princess Fugetsu's guardian spirit beast conjures a Nen door allowing teleportation between places.",
    },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['fugetsu', 'successione', 'bestia-guardiana'],
  },
];
