import type { Faction } from '@/types';

/**
 * Fazioni aggiuntive che legano gli alleati e i nuovi personaggi: il Ducato di
 * Mokomo (i mink di Zou), la Cappello di Paglia Grand Fleet, la Cross Guild e
 * l'unità segreta SWORD della Marina.
 */
export const onepieceFactionsExtra: Faction[] = [
  {
    id: 'faction-op-mokomo',
    worldId: 'world-onepiece',
    type: 'organization',
    name: 'Mokomo Dukedom (Minks)',
    localizedName: { it: 'Ducato di Mokomo (Mink)', en: 'Mokomo Dukedom (Minks)' },
    description: {
      it: "La tribù guerriera dei mink che abita Zou, sul dorso dell'elefante Zunesha. Governata dai sovrani Inuarashi (di giorno) e Nekomamushi (di notte), antichi alleati di Kozuki Oden e poi della ciurma.",
      en: "The warrior mink tribe that lives on Zou, on the back of the elephant Zunesha. Ruled by Inuarashi (by day) and Nekomamushi (by night), ancient allies of Kozuki Oden and later of the crew.",
    },
    leaderIds: ['char-op-inuarashi', 'char-op-nekomamushi'],
    characterIds: ['char-op-inuarashi', 'char-op-nekomamushi', 'char-op-carrot', 'char-op-pedro'],
    locationIds: ['loc-op-zou'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['mink', 'zou', 'kozuki', 'sulong'],
  },
  {
    id: 'faction-op-straw-hat-grand-fleet',
    worldId: 'world-onepiece',
    type: 'organization',
    name: 'Straw Hat Grand Fleet',
    localizedName: { it: 'Cappello di Paglia Grand Fleet', en: 'Straw Hat Grand Fleet' },
    description: {
      it: "La grande flotta di sette ciurme alleate nata a Dressrosa, che ha giurato fedeltà a Rufy. Riunisce migliaia di pirati pronti ad accorrere al suo fianco, pur conservando la propria indipendenza.",
      en: "The grand fleet of seven allied crews born at Dressrosa, sworn to Luffy. It gathers thousands of pirates ready to rush to his side, while keeping their own independence.",
    },
    leaderIds: ['char-op-luffy'],
    characterIds: ['char-op-luffy', 'char-op-bartolomeo', 'char-op-cavendish'],
    locationIds: ['loc-op-dressrosa'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['alleanza', 'dressrosa', 'cappello-di-paglia'],
  },
  {
    id: 'faction-op-cross-guild',
    worldId: 'world-onepiece',
    type: 'organization',
    name: 'Cross Guild',
    localizedName: { it: 'Cross Guild', en: 'Cross Guild' },
    description: {
      it: "Organizzazione del nuovo era guidata (sulla carta) da Bagy ma di fatto da Crocodile e Mihawk, che mette taglie sulla testa dei marine ribaltando il sistema del Governo Mondiale.",
      en: "A new-era organization led (on paper) by Buggy but in fact by Crocodile and Mihawk, which puts bounties on Marines, turning the World Government's system on its head.",
    },
    leaderIds: ['char-op-buggy', 'char-op-crocodile', 'char-op-mihawk'],
    characterIds: ['char-op-buggy', 'char-op-crocodile', 'char-op-mihawk'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['cross-guild', 'nuova-era', 'imperatore'],
  },
  {
    id: 'faction-op-sword',
    worldId: 'world-onepiece',
    type: 'organization',
    name: 'SWORD',
    localizedName: { it: 'SWORD', en: 'SWORD' },
    description: {
      it: "Unità speciale e segreta della Marina, i cui membri agiscono ufficiosamente (anche dimettendosi sulla carta) per combattere i pirati con maggiore libertà. Vi militano Coby, X Drake e Smoker.",
      en: "A secret special Marine unit whose members operate unofficially (even resigning on paper) to fight pirates with greater freedom. Coby, X Drake and Smoker serve in it.",
    },
    characterIds: ['char-op-coby', 'char-op-drake', 'char-op-smoker'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['marina', 'sword', 'segreto'],
  },
];
