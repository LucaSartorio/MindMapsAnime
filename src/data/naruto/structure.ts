import { factionKit, L, type FactionExtras } from '../shared/factionKit';

const { m, x, g, succ } = factionKit('char-');

/** Organigrammi e successioni (scheda e pagina della fazione). */
export const narutoStructure: Record<string, FactionExtras> = {
  'faction-five-kage': {
    succession: [
      succ(L('Hokage (Konoha)'), [
        m('hashirama'),
        m('tobirama'),
        m('hiruzen', L('torna in carica dopo la morte di Minato', "returns to office after Minato's death")),
        m('minato'),
        m('tsunade'),
        m('kakashi'),
        m('naruto'),
      ]),
      succ(L('Kazekage (Suna)'), [x('Reto'), x('Shamon'), x(L('Terzo Kazekage', 'Third Kazekage')), m('rasa'), m('gaara')]),
      succ(L('Mizukage (Kiri)'), [x('Byakuren'), x('Gengetsu Hōzuki'), x(L('Terzo Mizukage', 'Third Mizukage')), m('yagura'), m('mei'), m('chojuro')]),
      succ(L('Raikage (Kumo)'), [x(L('Primo Raikage', 'First Raikage')), x(L('Secondo Raikage', 'Second Raikage')), x(L('Terzo Raikage', 'Third Raikage')), m('a'), m('darui')]),
      succ(L('Tsuchikage (Iwa)'), [x('Ishikawa'), x('Mū'), m('onoki'), m('kurotsuchi')]),
    ],
  },
  'faction-akatsuki': {
    structure: [
      g(L('Vertici', 'Leadership'), [
        m('pain', L('capo apparente', 'apparent leader')),
        m('konan', L('braccio destro di Pain', "Pain's right hand")),
        m('obito', L('capo nell’ombra, come «Tobi»', "leader in the shadows, as 'Tobi'")),
      ]),
      g(L('Coppie', 'Pairs'), [
        m('itachi', L('con Kisame', 'with Kisame')),
        m('kisame', L('con Itachi', 'with Itachi')),
        m('deidara', L('con Sasori, poi con Tobi', 'with Sasori, then with Tobi')),
        m('sasori', L('con Orochimaru, poi con Deidara', 'with Orochimaru, then with Deidara')),
        m('hidan', L('con Kakuzu', 'with Kakuzu')),
        m('kakuzu', L('con Hidan', 'with Hidan')),
      ]),
      g(L('Altri membri', 'Other members'), [
        m('zetsu', L('spia', 'spy')),
        m('orochimaru', L('ex membro, disertore', 'former member, defector')),
      ]),
    ],
  },
  'faction-konoha-12': {
    structure: [
      g(L('Team 7'), [m('kakashi', L('maestro', 'sensei')), m('naruto'), m('sasuke'), m('sakura')]),
      g(L('Team 8'), [m('kurenai', L('maestra', 'sensei')), m('hinata'), m('kiba'), m('shino')]),
      g(L('Team 10'), [m('asuma', L('maestro', 'sensei')), m('shikamaru'), m('ino'), m('choji')]),
      g(L('Team Guy'), [m('guy', L('maestro', 'sensei')), m('neji'), m('rock-lee'), m('tenten')]),
    ],
  },
  'faction-taka': {
    structure: [g(L('Membri', 'Members'), [m('sasuke', L('capo', 'leader')), m('suigetsu'), m('karin'), m('jugo')])],
  },
};
