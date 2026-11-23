import type { Character } from '@/types';
import { ch } from './characterHelpers';

/**
 * Fullmetal Alchemist · personaggi del regno di Xing: il principe Ling Yao, la sua guardia del
 * corpo Lan Fan e la principessa May Chang (alcahestria). Nazioni e luoghi arrivano nei batch
 * successivi; i riferimenti puntano solo a personaggi del dataset.
 */
export const fmaCharactersXing: Character[] = [
  ch({
    id: 'char-fma-ling-yao',
    name: 'Ling Yao',
    japaneseName: 'リン・ヤオ',
    importance: 'major',
    role: ['xingese', 'ally'],
    rank: { it: 'Principe di Xing', en: 'Prince of Xing' },
    gender: 'male',
    status: 'alive',
    allies: ['char-fma-lan-fan', 'char-fma-alphonse-elric', 'char-fma-greed'],
    enemies: ['char-fma-father'],
    relationships: [
      { targetCharacterId: 'char-fma-lan-fan', label: { it: 'Guardia del corpo e fedele compagna', en: 'Bodyguard and loyal companion' } },
      { targetCharacterId: 'char-fma-greed', label: { it: 'Homunculus che si impossessa del suo corpo; i due finiscono per collaborare', en: 'Homunculus that takes over his body; the two end up cooperating' } },
    ],
    shortDescription: {
      it: "Principe di Xing in cerca dell'immortalità per assicurarsi il trono, e per un periodo ospite dell'homunculus Greed.",
      en: 'Prince of Xing seeking immortality to secure the throne, and for a time host of the homunculus Greed.',
    },
    longDescription: {
      it: "Ling arriva ad Amestris in cerca di una Pietra Filosofale che gli garantisca il diritto al trono di Xing. Il suo corpo diventa il contenitore di Greed, ma alla fine Greed si sacrifica per salvarlo e Ling riceve una Pietra Filosofale. Nell'epilogo torna a Xing, dove si prepara a diventare imperatore, con Lan Fan e May.",
      en: "Ling comes to Amestris seeking a Philosopher's Stone to secure his claim to the throne of Xing. His body becomes the vessel of Greed, but in the end Greed sacrifices himself to save him and Ling receives a Philosopher's Stone. In the epilogue he returns to Xing, where he prepares to become emperor, together with Lan Fan and May.",
    },
    tags: ['xing', 'principe'],
  }),
  ch({
    id: 'char-fma-lan-fan',
    name: 'Lan Fan',
    japaneseName: 'ランファン',
    importance: 'major',
    role: ['xingese', 'ally'],
    gender: 'female',
    status: 'alive',
    allies: ['char-fma-ling-yao'],
    enemies: ['char-fma-king-bradley', 'char-fma-gluttony'],
    relationships: [
      { targetCharacterId: 'char-fma-ling-yao', label: { it: 'Principe che protegge, fino a perdere un braccio', en: 'Prince she protects, to the point of losing an arm' } },
      { targetCharacterId: 'char-fma-king-bradley', label: { it: 'Perde il braccio combattendo contro di lui', en: 'Loses her arm fighting him' } },
    ],
    shortDescription: {
      it: "Guardia del corpo del principe Ling, nipote di Fu: perde un braccio per proteggerlo e riceve un automail.",
      en: "Bodyguard of Prince Ling and Fu's granddaughter: she loses an arm protecting him and receives automail.",
    },
    longDescription: {
      it: "Lan Fan è la guardia del corpo di Ling Yao e nipote del suo servitore Fu. Combattiva e prontissima ad attaccare chi insulta il suo principe, il che a volte è una debolezza in battaglia. Perde un braccio contro King Bradley, ma dopo l'intervento con un automail torna a proteggere Ling. Alla fine rientra a Xing con lui e May.",
      en: "Lan Fan is Ling Yao's bodyguard and the granddaughter of his retainer Fu. Combative and quick to attack anyone who insults her prince, which is sometimes a weakness in battle. She loses an arm to King Bradley, but after an automail operation she returns to protect Ling. In the end she goes back to Xing with him and May.",
    },
    tags: ['xing', 'guardia-del-corpo'],
  }),
  ch({
    id: 'char-fma-may-chang',
    name: 'May Chang',
    japaneseName: 'メイ・チャン',
    importance: 'major',
    role: ['xingese', 'ally'],
    rank: { it: 'Principessa di Xing', en: 'Princess of Xing' },
    gender: 'female',
    status: 'alive',
    allies: ['char-fma-alphonse-elric', 'char-fma-scar', 'char-fma-ling-yao'],
    relationships: [
      { targetCharacterId: 'char-fma-alphonse-elric', label: { it: 'Compagno di squadra, che si affeziona a lei', en: 'Teammate who grows fond of her' } },
      { targetCharacterId: 'char-fma-scar', label: { it: 'Compagno di squadra nella prima parte della storia', en: 'Teammate in the earlier part of the story' } },
    ],
    shortDescription: {
      it: "Principessa di Xing e utilizzatrice di alcahestria, alleata prima di Scar e poi di Alphonse.",
      en: 'Princess of Xing and alkahestry user, partnered first with Scar and then with Alphonse.',
    },
    longDescription: {
      it: "May è una principessa di Xing che usa l'alcahestria, l'arte del suo paese affine all'alchimia. Nella storia fa squadra prima con Scar e poi con Alphonse, che si affeziona a lei. Appare nella foto di famiglia dell'epilogo e nel finale si trova a Xing con Ling, rassicurata dalla promessa che non punirà le altre famiglie.",
      en: "May is a princess of Xing who masters alkahestry, her country's art akin to alchemy. In the story she teams up first with Scar and then with Alphonse, who grows fond of her. She appears in the epilogue's group photo and in the finale is with Ling, reassured by his promise not to punish the other families.",
    },
    tags: ['xing', 'alcahestria'],
  }),
];
