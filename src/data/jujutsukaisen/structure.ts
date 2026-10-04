import { factionKit, L, type FactionExtras } from '../shared/factionKit';

const { m, g, succ } = factionKit('char-jjk-');

/** Organigrammi e successioni (scheda e pagina della fazione). */
export const jjkStructure: Record<string, FactionExtras> = {
  'faction-jjk-tokyo-high': {
    structure: [
      g(L('Direzione e insegnanti', 'Staff and teachers'), [m('yaga', L('preside', 'principal')), m('gojo', L('insegnante', 'teacher')), m('kusakabe', L('insegnante', 'teacher')), m('shoko', L('medico', 'doctor')), m('ijichi', L('supervisore', 'assistant manager')), m('akari-nitta', L('supervisore', 'assistant manager'))]),
      g(L('Primo anno', 'First years'), [m('yuji'), m('megumi'), m('nobara')]),
      g(L('Secondo anno', 'Second years'), [m('maki'), m('toge'), m('panda'), m('yuta', L('grado speciale', 'special grade'))]),
      g(L('Terzo anno', 'Third years'), [m('hakari'), m('kirara')]),
    ],
  },
  'faction-jjk-kyoto-high': {
    structure: [
      g(L('Direzione e insegnanti', 'Staff and teachers'), [m('gakuganji', L('preside', 'principal')), m('utahime', L('insegnante', 'teacher'))]),
      g(L('Studenti', 'Students'), [m('todo', L('terzo anno', 'third year')), m('noritoshi', L('terzo anno', 'third year')), m('mai', L('secondo anno', 'second year')), m('momo', L('secondo anno', 'second year')), m('mechamaru', L('secondo anno', 'second year')), m('miwa', L('secondo anno', 'second year')), m('arata-nitta', L('primo anno', 'first year'))]),
    ],
  },
  'faction-jjk-disaster-curses': {
    structure: [
      g(L('Spiriti calamità', 'Disaster curses'), [m('jogo', L('vulcani', 'volcanoes')), m('hanami', L('foreste', 'forests')), m('dagon', L('mare', 'sea')), m('mahito', L('l’odio fra gli esseri umani', 'humans’ hatred of one another'))]),
      g(L('Alleato', 'Ally'), [m('kenjaku', L('la mente del piano', 'the mastermind'))]),
    ],
  },
  'faction-jjk-death-paintings': {
    structure: [g(L('I primi tre fratelli', 'The first three brothers'), [m('choso', L('primo', 'first')), m('eso', L('secondo', 'second')), m('kechizu', L('terzo', 'third'))], L('Sono nove in tutto: gli altri sei restano senza nome.', 'There are nine in all: the other six remain unnamed.'))],
  },
  'faction-jjk-geto-family': {
    structure: [g(L('Membri', 'Members'), [m('geto', L('capo', 'leader')), m('mimiko'), m('nanako'), m('miguel'), m('larue')])],
  },
  'faction-jjk-zenin-clan': {
    succession: [succ(L('Capo clan', 'Clan head'), [m('naobito'), m('megumi', L('designato nel testamento di Naobito', "named in Naobito's will"))])],
  },
};
