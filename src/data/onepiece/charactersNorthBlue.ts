import type { Character } from '@/types';

/**
 * Personaggi legati a North Blue: la tragedia di Flevance e l'infanzia di
 * Trafalgar Law, intrecciata con la famiglia Donquijote (Doflamingo e Corazon)
 * e il Frutto Ope Ope ricevuto a Minion Island.
 */
export const onepieceCharactersNorthBlue: Character[] = [
  {
    id: 'char-op-law',
    worldId: 'world-onepiece',
    firstMangaAppearance: "498",
    firstAnimeAppearance: "392",
    longDescription: {
      it: "Trafalgar D. Water Law «il Chirurgo della Morte», capitano degli Heart Pirates ed ex Corsaro, utente del leggendario frutto Op Op. Salvato da bambino da Corazon, si alleò con Rufy per abbattere gli Imperatori.",
      en: "Trafalgar D. Water Law 'the Surgeon of Death', captain of the Heart Pirates and a former Warlord, user of the legendary Op-Op Fruit. Saved as a child by Corazon, he allied with Luffy to topple the Emperors.",
    },
    name: 'Trafalgar D. Water Law',
    aliases: ['Trafalgar Law', 'Il Chirurgo della Morte'],
    importance: 'major',
    role: ['ally', 'neutral'],
    gender: 'male',
    villageLocationId: 'loc-op-flevance',
    nationId: 'nation-op-north-blue',
    factionIds: ['faction-op-heart-pirates'],
    enemies: ['char-op-doflamingo'],
    jutsuIds: ['fruit-op-ope-ope'],
    relationships: [
      { targetCharacterId: 'char-op-corazon', label: 'Salvatore' },
    ],
    arcIds: ['arc-op-flevance', 'arc-op-punk-hazard', 'arc-op-dressrosa'],
    shortDescription: {
      it: "Capitano dei Pirati di Heart, originario di Flevance e sopravvissuto al suo sterminio. Utente del Frutto Ope Ope, dono di Corazon. Una delle Undici Supernove e poi alleato di Rufy contro Doflamingo e Kaido.",
      en: "Captain of the Heart Pirates, born in Flevance and a survivor of its extermination. User of the Ope Ope Fruit, Corazon's gift. One of the Eleven Supernovas and later Luffy's ally against Doflamingo and Kaido.",
    },
    status: 'alive',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['north-blue', 'peggiore-generazione', 'flevance', 'ope-ope'],
  },
  {
    id: 'char-op-doflamingo',
    worldId: 'world-onepiece',
    firstMangaAppearance: "233",
    firstAnimeAppearance: "151",
    longDescription: {
      it: "Donquijote Doflamingo «Joker», ex Drago Celeste, Corsaro e re ombra di Dressrosa, trafficante d'armi e di Frutti SMILE per Kaido. Utente del frutto Filo, fu abbattuto da Rufy in Gear Fourth.",
      en: "Donquixote Doflamingo 'Joker', a former Celestial Dragon, Warlord and shadow king of Dressrosa, an arms and SMILE-Fruit dealer for Kaido. User of the String-String Fruit, he was felled by Luffy in Gear Fourth.",
    },
    name: 'Donquijote Doflamingo',
    aliases: ['Joker', 'Doffy'],
    importance: 'major',
    role: ['antagonist', 'villain'],
    gender: 'male',
    locationIds: ['loc-op-minion-island', 'loc-op-dressrosa'],
    nationId: 'nation-op-north-blue',
    factionIds: ['faction-op-donquixote-pirates'],
    family: ['char-op-corazon'],
    enemies: ['char-op-law'],
    jutsuIds: ['fruit-op-ito-ito'],
    relationships: [
      { targetCharacterId: 'char-op-corazon', label: 'Fratello minore (da lui ucciso)' },
    ],
    arcIds: ['arc-op-flevance', 'arc-op-dressrosa'],
    shortDescription: {
      it: "Discendente di Draghi Celesti, ex re di Dressrosa ed ex Corsaro. Trafficante d'armi e di SMILE sotto lo pseudonimo «Joker», utente del Frutto Filo Filo. Uccise il fratello Corazon e diede la caccia a Law.",
      en: "A descendant of Celestial Dragons, former king of Dressrosa and ex-Warlord. An arms and SMILE trafficker under the alias 'Joker', user of the String-String Fruit. He killed his brother Corazon and hunted Law.",
    },
    status: 'alive',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['north-blue', 'donquijote', 'paramecia', 'antagonista'],
  },
  {
    id: 'char-op-corazon',
    worldId: 'world-onepiece',
    firstMangaAppearance: "761",
    firstAnimeAppearance: "703",
    longDescription: {
      it: "Donquijote Rosinante «Corazon», fratello di Doflamingo e ufficiale segreto della Marina, utente del frutto Quiete. Sacrificò la vita per curare e salvare il piccolo Law dal Saturnismo e dall'odio.",
      en: "Donquixote Rosinante 'Corazon', Doflamingo's brother and a secret Marine officer, user of the Calm-Calm Fruit. He gave his life to cure and save young Law from lead poisoning and hatred.",
    },
    name: 'Donquijote Rosinante',
    aliases: ['Corazon', 'Cora-san'],
    importance: 'major',
    role: ['ally', 'mentor'],
    gender: 'male',
    locationIds: ['loc-op-minion-island'],
    nationId: 'nation-op-north-blue',
    factionIds: ['faction-op-donquixote-pirates', 'faction-op-marines'],
    family: ['char-op-doflamingo'],
    relationships: [
      { targetCharacterId: 'char-op-law', label: 'Protetto come un figlio' },
    ],
    arcIds: ['arc-op-flevance'],
    shortDescription: {
      it: "Fratello minore di Doflamingo e ufficiale segreto della Marina, infiltrato nella ciurma Donquijote. Si sacrificò per donare a Law il Frutto Ope Ope, curandolo e liberandolo dall'odio del fratello.",
      en: "Doflamingo's younger brother and a secret Marine officer, infiltrated into the Donquixote crew. He sacrificed himself to give Law the Ope Ope Fruit, curing him and freeing him from his brother's hatred.",
    },
    status: 'deceased',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['north-blue', 'donquijote', 'marina'],
  },
];
