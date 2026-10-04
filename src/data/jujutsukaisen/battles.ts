import type { BattleOutcome } from '@/types';
import { battleKit } from '../shared/battleKit';

const { win, stop } = battleKit('char-jjk-');
const L = (it: string, en: string) => ({ it, en });

/** Esiti degli scontri di Jujutsu Kaisen (bilancio nella scheda personaggio). */
export const jjkBattles: Record<string, BattleOutcome> = {
  'evt-jjk-toji-ambush': win(['toji'], ['gojo']),
  'evt-jjk-riko-death': win(['toji'], ['geto']),
  'evt-jjk-gojo-awakening': win(['gojo'], ['toji']),
  'evt-jjk-yuta-vs-geto': win(['yuta'], ['geto']),
  'evt-jjk-eishu': stop(['sukuna'], ['megumi'], L('Sukuna restituisce il corpo a Yuji, che muore.', 'Sukuna hands the body back to Yuji, who dies.')),
  'evt-jjk-gojo-vs-jogo': win(['gojo'], ['jogo'], L('Jogo sopravvive come testa mozzata, salvato da Hanami.', 'Jogo survives as a severed head, saved by Hanami.')),
  'evt-jjk-nanami-vs-mahito': stop(['nanami'], ['mahito'], L('Mahito si ritira.', 'Mahito withdraws.')),
  'evt-jjk-junpei-death': stop(['yuji', 'nanami'], ['mahito'], L('Mahito fugge nelle fogne.', 'Mahito escapes into the sewers.')),
  'evt-jjk-todo-vs-yuji': stop(['todo'], ['yuji'], L("Il duello diventa un allenamento e poi è interrotto dall'attacco di Hanami.", "The duel turns into training and is then cut short by Hanami's attack.")),
  'evt-jjk-hanami-attack': stop(['yuji', 'todo'], ['hanami'], L('Hanami si ritira quando Gojo spezza il Velo.', 'Hanami retreats when Gojo breaks the Veil.')),
  'evt-jjk-yasohachi': win(['yuji', 'nobara'], ['eso', 'kechizu']),
  'evt-jjk-mechamaru-betrayal': win(['mahito'], ['mechamaru']),
  'evt-jjk-gojo-b5f': win(['gojo'], ['hanami']),
  'evt-jjk-yuji-vs-choso': win(['choso'], ['yuji']),
  'evt-jjk-dagon': win(['toji', 'naobito', 'maki', 'nanami', 'megumi'], ['dagon'], L('Il colpo di grazia lo dà Toji.', 'Toji deals the final blow.')),
  'evt-jjk-sukuna-vs-jogo': win(['sukuna'], ['jogo']),
  'evt-jjk-toji-vs-megumi': stop(['toji'], ['megumi'], L('Saputo il nome di Megumi, Toji si toglie la vita.', "On learning Megumi's name, Toji takes his own life.")),
  'evt-jjk-mahoraga': win(['megumi'], ['haruta']),
  'evt-jjk-nobara-falls': win(['mahito'], ['nobara']),
  'evt-jjk-yuji-todo-vs-mahito': win(['yuji', 'todo'], ['mahito']),
  'evt-jjk-yuta-vs-yuji': win(['yuta'], ['yuji'], L('Yuta finge di ucciderlo per salvarlo dalla condanna.', 'Yuta fakes killing him to save him from the sentence.')),
  'evt-jjk-zenin-massacre': win(['maki'], ['ogi', 'naoya']),
  'evt-jjk-yuji-vs-higuruma': win(['yuji'], ['higuruma'], L('Higuruma rinuncia e gli cede i suoi punti.', 'Higuruma gives up and hands him his points.')),
  'evt-jjk-megumi-vs-reggie': win(['megumi'], ['reggie']),
  'evt-jjk-yuta-sendai': win(['yuta'], ['ryu', 'dhruv', 'kurourushi']),
  'evt-jjk-hakari-vs-kashimo': win(['hakari'], ['kashimo']),
  'evt-jjk-sakurajima': win(['maki'], ['naoya']),
  'evt-jjk-tengen-battle': win(['kenjaku'], ['yuki', 'choso']),
  'evt-jjk-gojo-vs-sukuna': win(['sukuna'], ['gojo']),
  'evt-jjk-kashimo-death': win(['sukuna'], ['kashimo']),
  'evt-jjk-higuruma-shinjuku': win(['sukuna'], ['higuruma', 'yuji', 'kusakabe']),
  'evt-jjk-kenjaku-death': win(['yuta', 'takaba', 'todo'], ['kenjaku']),
  'evt-jjk-sukuna-defeated': win(['yuji', 'yuta', 'maki', 'todo'], ['sukuna']),
  'evt-jjk-nobara-vs-haruta': win(['nanami', 'nobara'], ['haruta']),
  'evt-jjk-uraume-rescues-sukuna': stop(['yuji', 'maki'], ['sukuna'], L('Uraume porta via Sukuna.', 'Uraume carries Sukuna away.')),
  'evt-jjk-sukuna-vs-yorozu': win(['sukuna'], ['yorozu']),
  'evt-jjk-yuta-vs-sukuna': win(['sukuna'], ['yuta']),
};
