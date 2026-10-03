import type { Character } from '@/types';

/**
 * Personaggi Naruto · Batch 8 — Boruto: Two Blue Vortex.
 *
 * I Shinju (Alberi Divini senzienti) introdotti nel sequel manga. Dettagli in
 * evoluzione mentre il manga è in corso: marcati `needs_verification`.
 */
const shinju = (
  c: Omit<Character, 'worldId' | 'status' | 'canonStatus' | 'referenceStatus' | 'importance' | 'role' | 'series'> &
    Partial<Pick<Character, 'importance'>>,
): Character => ({
  worldId: 'world-naruto',
  importance: 'minor',
  role: ['antagonist'],
  series: ['boruto'],
  status: 'alive',
  canonStatus: 'canon',
  referenceStatus: 'needs_verification',
  ...c,
});

export const narutoCharactersBatch8: Character[] = [
  shinju({
    id: 'char-jura',
    name: 'Jura',
    japaneseName: 'ジュラ',
    importance: 'major',
    gender: 'male',
    enemies: ['char-boruto', 'char-kawaki'],
    shortDescription: {
      it: "Il capo dei Shinju di Boruto: Two Blue Vortex. A differenza degli altri non nasce da un ninja assorbito: è la manifestazione fisica delle Dieci Code un tempo controllate da Code. Cerca il chakra di Naruto e finisce per affrontare Boruto e Kawaki alleati.",
      en: "The leader of the Shinju in Boruto: Two Blue Vortex. Unlike the others he was not born from an absorbed ninja: he is the physical manifestation of the Ten-Tails once controlled by Code. He seeks Naruto's chakra and ends up facing Boruto and Kawaki as allies.",
    },
    tags: ['shinju', 'two-blue-vortex'],
  }),
  shinju({
    id: 'char-hidari',
    name: 'Hidari',
    japaneseName: 'ヒダリ',
    gender: 'male',
    family: ['char-sasuke'],
    enemies: ['char-boruto'],
    shortDescription: {
      it: "Uno dei Shinju di Two Blue Vortex, nato dall'Albero Divino che ha assorbito Sasuke Uchiha durante la fuga con Boruto: ne porta i tratti e una parte dei ricordi, e si interroga sulla propria natura.",
      en: "One of the Shinju of Two Blue Vortex, born from the God Tree that absorbed Sasuke Uchiha during his escape with Boruto: he bears his features and part of his memories, and questions his own nature.",
    },
    tags: ['shinju', 'two-blue-vortex'],
  }),
  shinju({
    id: 'char-matsuri',
    name: 'Matsuri',
    japaneseName: 'マツリ',
    gender: 'female',
    enemies: ['char-konohamaru'],
    shortDescription: {
      it: "Una dei Shinju più recenti di Two Blue Vortex, modellata su Moegi, la compagna di squadra di Konohamaru che il suo Albero Divino ha assorbito. Usa il legame con lei per mettere alle strette Konohamaru.",
      en: "One of the newest Shinju of Two Blue Vortex, modelled on Moegi, Konohamaru's teammate whom her God Tree absorbed. She uses that bond to corner Konohamaru.",
    },
    tags: ['shinju', 'two-blue-vortex'],
  }),
];
