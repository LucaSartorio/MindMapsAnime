import type { Character } from '@/types';
import { ch } from './characterHelpers';

/**
 * Fullmetal Alchemist · personaggi del film «La Stella Sacra di Milos» (2011, originale dell'anime,
 * diretto da Kazuya Murata): inclusi per scelta del proprietario con `canonStatus: 'movie'`, mai
 * presentati come canon del manga. Fonte: Wikipedia, voce del film (S6) più la voce dei personaggi.
 * Contiene spoiler sulla trama del film.
 */
export const fmaCharactersMilos: Character[] = [
  ch({
    id: 'char-fma-julia-crichton',
    name: 'Julia Crichton',
    japaneseName: 'ジュリア・クライトン',
    canonStatus: 'movie',
    importance: 'major',
    role: ['protagonist', 'alchemist'],
    gender: 'female',
    status: 'alive',
    allies: ['char-fma-ashleigh-crichton'],
    enemies: ['char-fma-melvin-voyager'],
    relationships: [
      { targetCharacterId: 'char-fma-ashleigh-crichton', label: { it: 'Fratello maggiore, che crede disperso', en: 'Older brother, whom she believes missing' } },
      { targetCharacterId: 'char-fma-melvin-voyager', label: { it: 'Lo ritiene suo fratello, ma è un impostore', en: 'She takes him for her brother, but he is an impostor' } },
    ],
    shortDescription: {
      it: "Alchimista cretese cresciuta dalla resistenza di Milos, usa l'alchimia curativa e perde una gamba salvando il fratello.",
      en: 'Cretan alchemist raised by the Milosian resistance, she uses healing alchemy and loses a leg saving her brother.',
    },
    longDescription: {
      it: "Julia è un'alchimista di Creta la cui famiglia è stata uccisa dopo che i genitori furono bollati come traditori. Viene allevata dalla resistenza di Milos e usa l'alchimia curativa. Quando è arrestata per essere entrata a Table City, le sue tracce portano i fratelli Elric a Melvin Voyager. Alla fine usa la Pietra Filosofale per salvare il fratello e perde la gamba sinistra; Milos dichiara poi l'indipendenza.",
      en: "Julia is a Cretan alchemist whose family was killed after her parents were branded traitors. She is raised by the Milosian resistance and uses healing alchemy. When she is arrested for entering Table City, her trail leads the Elric brothers to Melvin Voyager. In the end she uses the Philosopher's Stone to save her brother and loses her left leg; Milos then declares independence.",
    },
    tags: ['film', 'milos'],
  }),
  ch({
    id: 'char-fma-ashleigh-crichton',
    name: 'Ashleigh Crichton',
    japaneseName: 'アシュレー・クライトン',
    aliases: [{ it: 'Colonnello Herschel', en: 'Colonel Herschel' }],
    canonStatus: 'movie',
    importance: 'major',
    role: ['ally'],
    gender: 'male',
    status: 'alive',
    allies: ['char-fma-julia-crichton'],
    enemies: ['char-fma-melvin-voyager'],
    relationships: [
      { targetCharacterId: 'char-fma-julia-crichton', label: { it: 'Sorella minore', en: 'Younger sister' } },
      { targetCharacterId: 'char-fma-melvin-voyager', label: { it: 'Lo uccide: l\'impostore aveva preso il suo volto', en: 'Kills him: the impostor had taken his face' } },
    ],
    shortDescription: {
      it: "Il vero fratello maggiore di Julia: sopravvissuto all'attacco di Atlas, ricompare come il Colonnello Herschel, comandante cretese mascherato.",
      en: "Julia's real older brother: having survived Atlas's attack, he returns as Colonel Herschel, the masked Cretan commander.",
    },
    longDescription: {
      it: "Ashleigh sopravvive all'attacco di Atlas, l'ex guardia dei Crichton che aveva ucciso i suoi genitori e preso il suo volto. Ricompare come il Colonnello Herschel, comandante cretese mascherato presso Table City, e nel finale uccide Atlas.",
      en: "Ashleigh survives the attack of Atlas, the former Crichton guard who had killed his parents and taken his face. He returns as Colonel Herschel, the masked Cretan commander near Table City, and in the finale kills Atlas.",
    },
    tags: ['film', 'milos'],
  }),
  ch({
    id: 'char-fma-melvin-voyager',
    name: 'Melvin Voyager',
    japaneseName: 'メルビン・ボイジャー',
    aliases: [{ it: 'Atlas', en: 'Atlas' }],
    canonStatus: 'movie',
    importance: 'major',
    role: ['antagonist', 'alchemist'],
    gender: 'male',
    status: 'deceased',
    enemies: ['char-fma-ashleigh-crichton', 'char-fma-julia-crichton'],
    relationships: [
      { targetCharacterId: 'char-fma-julia-crichton', label: { it: 'Si finge suo fratello', en: 'Poses as her brother' } },
      { targetCharacterId: 'char-fma-ashleigh-crichton', label: { it: 'Gli ha preso il volto; viene da lui ucciso', en: 'Took his face; is killed by him' } },
    ],
    shortDescription: {
      it: "L'alchimista evaso che si dice fratello di Julia: in realtà è Atlas, un'ex guardia dei Crichton, antagonista del film.",
      en: "The escaped alchemist who claims to be Julia's brother: in truth he is Atlas, a former Crichton guard, and the film's antagonist.",
    },
    longDescription: {
      it: "I fratelli Elric danno la caccia a Melvin Voyager, un condannato evaso che sostiene di essere il fratello scomparso di Julia Crichton. In realtà è Atlas, ex guardia dei Crichton, che ha ucciso i genitori di Julia, ha attaccato il vero Ashleigh e ne ha assunto il volto. Nel film è l'antagonista principale e uccide Miranda, comandante dei Pipistrelli Neri; viene infine ucciso dal vero Ashleigh.",
      en: "The Elric brothers track Melvin Voyager, an escaped convict who claims to be Julia Crichton's missing brother. In truth he is Atlas, a former Crichton guard, who killed Julia's parents, attacked the real Ashleigh and took his face. He is the film's main antagonist and kills Miranda, a commander of the Black Bats; he is finally killed by the real Ashleigh.",
    },
    tags: ['film', 'milos', 'impostore'],
  }),
];
