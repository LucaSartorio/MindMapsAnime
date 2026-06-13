import type { Faction } from '@/types';

/**
 * Fazioni / organizzazioni canoniche aggiuntive di Hunter x Hunter — batch 1.
 *
 * Solo riferimenti a personaggi già esistenti nel dataset come leader/membri,
 * per non rompere l'integrità referenziale (validate:data).
 */
export const hxhFactionsBatch1: Faction[] = [
  /* ===================== YORKNEW · mafia ===================== */
  {
    id: 'faction-hxh-ten-dons',
    worldId: 'world-hunterxhunter',
    type: 'organization',
    name: 'Ten Dons',
    localizedName: { it: 'I Dieci Boss (Ten Dons)', en: 'The Ten Dons' },
    description: {
      it: 'I dieci boss che guidano collettivamente la Comunità Mafiosa, ciascuno padrone di un territorio continentale; si riuniscono ogni anno per l\'asta di Yorknew.',
      en: 'The ten bosses who collectively lead the Mafia Community, each ruling a continental territory; they gather yearly for the Yorknew auction.',
    },
    arcIds: ['arc-hxh-yorknew-city'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['mafia', 'yorknew'],
  },
  {
    id: 'faction-hxh-shadow-beasts',
    worldId: 'world-hunterxhunter',
    type: 'group',
    name: 'Shadow Beasts',
    localizedName: { it: "Bestie d'Ombra", en: 'Shadow Beasts' },
    description: {
      it: 'I dieci Nen-user più forti al servizio dei Ten Dons (a tema animale: Gufo, Verme, Sanguisuga, Porcospino…); inviati a uccidere la Brigata Fantasma, vengono sterminati in una sola notte.',
      en: 'The ten strongest Nen users serving the Ten Dons (animal-themed: Owl, Worm, Leech, Porcupine…); sent to kill the Phantom Troupe, they are wiped out in a single night.',
    },
    arcIds: ['arc-hxh-yorknew-city'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['mafia', 'yorknew', 'brigata-fantasma'],
  },

  /* ===================== GREED ISLAND ===================== */
  {
    id: 'faction-hxh-bombers',
    worldId: 'world-hunterxhunter',
    type: 'group',
    name: 'The Bombers',
    localizedName: { it: 'I Bomber', en: 'The Bombers' },
    japaneseName: '爆弾魔（ボマー）',
    description: {
      it: 'Trio di giocatori di Greed Island — Genthru, Sub e Bara — deciso a completare il gioco uccidendo e ricattando gli altri per le carte; il Nen-bomba di Genthru li lega in una detonazione collettiva.',
      en: 'A Greed Island trio — Genthru, Sub and Bara — set on clearing the game by killing and blackmailing others for cards; Genthru\'s bomb-Nen links them in a collective detonation.',
    },
    leaderIds: ['char-hxh-genthru'],
    characterIds: ['char-hxh-genthru', 'char-hxh-sub', 'char-hxh-bara'],
    arcIds: ['arc-hxh-greed-island'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['greed-island', 'bomber'],
  },

  /* ===================== CHIMERA ANT · operazione Hunter ===================== */
  {
    id: 'faction-hxh-extermination-team',
    worldId: 'world-hunterxhunter',
    type: 'group',
    name: 'Extermination Team',
    localizedName: { it: 'Squadra di Sterminio', en: 'Extermination Team' },
    description: {
      it: 'La squadra d\'assalto dell\'Associazione Hunter inviata a East Gorteau contro il Re e le Guardie Reali: Netero, Morel, Knuckle, Shoot, Knov, più Gon, Killua e l\'alleato Meleoron.',
      en: 'The Hunter Association strike team sent to East Gorteau against the King and Royal Guard: Netero, Morel, Knuckle, Shoot, Knov, plus Gon, Killua and ally Meleoron.',
    },
    leaderIds: ['char-hxh-netero'],
    characterIds: ['char-hxh-netero', 'char-hxh-morel', 'char-hxh-knuckle', 'char-hxh-shoot', 'char-hxh-knov', 'char-hxh-gon', 'char-hxh-killua', 'char-hxh-meleoron'],
    arcIds: ['arc-hxh-chimera-ant'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['chimera-ant', 'hunter'],
  },

  /* ===================== CONTINENTE OSCURO ===================== */
  {
    id: 'faction-hxh-expedition-team',
    worldId: 'world-hunterxhunter',
    type: 'group',
    name: 'Dark Continent Expedition Team',
    localizedName: { it: 'Spedizione del Continente Oscuro', en: 'Dark Continent Expedition Team' },
    description: {
      it: 'La spedizione guidata da Beyond Netero per raggiungere il Continente Oscuro, imbarcata sulla Black Whale; include il team di Beyond (con Ging e Pariston), gli Zodiac, la Famiglia Reale di Kakin e la Brigata Fantasma clandestina.',
      en: 'The expedition led by Beyond Netero to reach the Dark Continent aboard the Black Whale; it includes Beyond\'s team (with Ging and Pariston), the Zodiacs, the Kakin Royal Family and the stowaway Phantom Troupe.',
    },
    leaderIds: ['char-hxh-beyond'],
    characterIds: ['char-hxh-beyond', 'char-hxh-pariston', 'char-hxh-ging', 'char-hxh-saiyu'],
    arcIds: ['arc-hxh-succession-contest'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['continente-oscuro', 'spedizione'],
  },

  /* ===================== SUCCESSIONE · mafie di Kakin ===================== */
  {
    id: 'faction-hxh-heil-ly',
    worldId: 'world-hunterxhunter',
    type: 'group',
    name: 'Heil-Ly Family',
    localizedName: { it: 'Famiglia Heil-Ly', en: 'Heil-Ly Family' },
    description: {
      it: 'Comunità mafiosa di Kakin (23 membri) guidata da Morena Prudo, figlia illegittima del Re; alimenta il Nen dei propri membri con gli omicidi e tradisce il principe Tserriednich.',
      en: 'Kakin mafia community (23 members) led by Morena Prudo, the King\'s illegitimate daughter; it fuels its members\' Nen with killings and betrays Prince Tserriednich.',
    },
    leaderIds: ['char-hxh-morena'],
    characterIds: ['char-hxh-morena', 'char-hxh-hinrigh'],
    arcIds: ['arc-hxh-succession-contest'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['successione', 'mafia', 'heil-ly'],
  },
  {
    id: 'faction-hxh-xi-yu',
    worldId: 'world-hunterxhunter',
    type: 'group',
    name: 'Xi-Yu Family',
    localizedName: { it: 'Famiglia Xi-Yu', en: 'Xi-Yu Family' },
    description: {
      it: 'La più grande delle tre comunità mafiose di Kakin, sostenitrice del 3° principe Zhang Lei; si allea con Cha-R e la Brigata Fantasma per annientare la Heil-Ly.',
      en: 'The largest of Kakin\'s three mafia communities, backing 3rd Prince Zhang Lei; it allies with Cha-R and the Phantom Troupe to crush Heil-Ly.',
    },
    characterIds: ['char-hxh-zhang-lei'],
    arcIds: ['arc-hxh-succession-contest'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['successione', 'mafia', 'xi-yu'],
  },
  {
    id: 'faction-hxh-cha-r',
    worldId: 'world-hunterxhunter',
    type: 'group',
    name: 'Cha-R Family',
    localizedName: { it: 'Famiglia Cha-R', en: 'Cha-R Family' },
    description: {
      it: 'La terza comunità mafiosa di Kakin, sponsorizzata da un principe; alleata con la Xi-Yu e la Brigata Fantasma contro la Heil-Ly.',
      en: 'The third Kakin mafia community, sponsored by a prince; allied with Xi-Yu and the Phantom Troupe against Heil-Ly.',
    },
    arcIds: ['arc-hxh-succession-contest'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['successione', 'mafia', 'cha-r'],
  },
];
