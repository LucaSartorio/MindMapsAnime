import type { Character } from '@/types';
import { ch } from './characterHelpers';

/** Personaggi secondari aggiunti per completezza (famiglia di Yuji, supervisori, giocatori del Culling Game). */
export const jjkCharactersExtra: Character[] = [
  ch({ id: 'char-jjk-jin', name: 'Jin Itadori', japaneseName: '虎杖仁', importance: 'minor', role: ['civilian'], race: 'human', gender: 'male', nationId: 'nation-jjk-miyagi', family: ['char-jjk-yuji', 'char-jjk-wasuke', 'char-jjk-kaori'],
    referenceStatus: 'needs_verification',
    shortDescription: {
      it: "Il padre di Yuji e figlio del nonno Wasuke. Sposò Kaori; dopo la morte di lei, il corpo della moglie fu preso da Kenjaku e fu con lui che Jin ebbe Yuji. Le rivelazioni della battaglia di Shinjuku legano la sua anima al gemello che Sukuna divorò nel grembo materno.",
      en: "Yuji's father and son of grandfather Wasuke. He married Kaori; after her death his wife's body was taken over by Kenjaku, and it was with him that Jin had Yuji. The revelations of the Shinjuku battle tie his soul to the twin Sukuna devoured in the womb.",
    },
    status: 'unknown', tags: ['origini', 'famiglia-itadori'] }),
  ch({ id: 'char-jjk-akari-nitta', name: 'Akari Nitta', japaneseName: '新田明', importance: 'minor', role: ['assistant'], ninjaRank: 'assistant', race: 'human', gender: 'female', nationId: 'nation-jjk-tokyo', clanIds: ['faction-jjk-tokyo-high'], family: ['char-jjk-arata-nitta'], allies: ['char-jjk-yuji', 'char-jjk-nobara', 'char-jjk-megumi'],
    shortDescription: {
      it: "Supervisore dell'istituto di Tokyo: accompagna Yuji, Nobara e Megumi a Saitama per l'indagine sul ponte Yasohachi. Sorella maggiore di Arata Nitta.",
      en: 'An assistant manager of the Tokyo school: she escorts Yuji, Nobara and Megumi to Saitama for the Yasohachi Bridge investigation. Older sister of Arata Nitta.',
    },
    status: 'alive', tags: ['supervisore', 'dipinti-della-morte'] }),
  ch({ id: 'char-jjk-arata-nitta', name: 'Arata Nitta', japaneseName: '新田新', importance: 'minor', role: ['student_kyoto'], abilityCategory: 'innate', race: 'human', gender: 'male', nationId: 'nation-jjk-kyoto', clanIds: ['faction-jjk-kyoto-high'], family: ['char-jjk-akari-nitta'], allies: ['char-jjk-nobara', 'char-jjk-ino'],
    shortDescription: {
      it: "Studente del primo anno di Kyoto con una tecnica che non guarisce ma impedisce alle ferite di peggiorare. A Shibuya la usa su Nobara, colpita da Mahito, lasciando aperta la speranza di salvarla.",
      en: 'A Kyoto first-year whose technique does not heal but stops wounds from getting worse. At Shibuya he uses it on Nobara, struck by Mahito, keeping alive the hope of saving her.',
    },
    status: 'alive', tags: ['shibuya', 'cura'] }),
  ch({ id: 'char-jjk-dhruv', name: 'Dhruv Lakdawalla', japaneseName: 'ドルゥヴ・ラクダワラ', importance: 'minor', role: ['player', 'reincarnated'], abilityCategory: 'shikigami', race: 'incarnated', gender: 'male', nationId: 'nation-jjk-miyagi', clanIds: ['faction-jjk-culling-players'], enemies: ['char-jjk-yuta'],
    shortDescription: {
      it: "Stregone del passato reincarnato nella colonia di Sendai, uno dei quattro giocatori in stallo: i suoi shikigami lasciano scie che diventano il suo territorio. Yuta lo elimina al suo arrivo.",
      en: 'A sorcerer from the past reincarnated in the Sendai colony, one of the four players in deadlock: his shikigami leave trails that become his territory. Yuta eliminates him on arrival.',
    },
    status: 'deceased', tags: ['culling-game', 'sendai'] }),
  ch({ id: 'char-jjk-kurourushi', name: 'Kurourushi', japaneseName: '黒沐死', importance: 'minor', role: ['cursed_spirit', 'player'], race: 'cursed_spirit', gender: 'unknown', nationId: 'nation-jjk-miyagi', clanIds: ['faction-jjk-culling-players'], enemies: ['char-jjk-yuta'],
    shortDescription: {
      it: "Spirito maledetto di grado speciale nato dalla paura degli scarafaggi, uno dei quattro giocatori in stallo nella colonia di Sendai. Viene sconfitto da Yuta.",
      en: 'A special-grade cursed spirit born from the fear of cockroaches, one of the four players in deadlock in the Sendai colony. He is defeated by Yuta.',
    },
    status: 'deceased', tags: ['culling-game', 'sendai'] }),
  ch({ id: 'char-jjk-kogane', name: 'Kogane', japaneseName: 'コガネ', importance: 'minor', role: ['player'], race: 'shikigami', gender: 'unknown', clanIds: ['faction-jjk-culling-players'],
    shortDescription: {
      it: "Lo shikigami assegnato a ogni giocatore del Culling Game: annuncia le regole, i punti e le nuove regole aggiunte, e registra le richieste dei giocatori.",
      en: "The shikigami assigned to every Culling Game player: it announces the rules, the points and any newly added rules, and records the players' requests.",
    },
    status: 'unknown', tags: ['culling-game', 'regole'] }),
];
