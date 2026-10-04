import { factionKit, L, type FactionExtras } from '../shared/factionKit';

const { m, x, g, succ } = factionKit('char-bl-');
const cap = L('capitano', 'captain');
const lt = L('luogotenente', 'lieutenant');
const division = (k: number) => L(`${k}ª Divisione`, `Division ${k}`);
const captains = (k: number, ...holders: ReturnType<typeof m>[]) => ({
  succession: [succ(L(`Capitano della ${k}ª Divisione`, `Captain of Division ${k}`), holders)],
});
const espada = (k: number) => L(`Espada n. ${k}`, `Espada no. ${k}`);
const letter = (l: string, it: string, en: string) => L(`«${l}» · ${it}`, `"${l}" · ${en}`);

/** Organigrammi e successioni (scheda e pagina della fazione). */
export const bleachStructure: Record<string, FactionExtras> = {
  'faction-bl-gotei-13': {
    structure: [
      g(division(1), [m('yamamoto', L('capitano comandante', 'captain-commander')), m('sasakibe', lt)]),
      g(division(2), [m('soi-fon', cap), m('omaeda', lt)]),
      g(division(3), [m('gin', cap), m('kira', lt)]),
      g(division(4), [m('unohana', cap), m('isane', lt)]),
      g(division(5), [m('aizen', cap), m('hinamori', lt)]),
      g(division(6), [m('byakuya', cap), m('renji', lt)]),
      g(division(7), [m('komamura', cap), m('iba', lt)]),
      g(division(8), [m('kyoraku', cap), m('nanao', lt)]),
      g(division(9), [m('tosen', cap), m('hisagi', lt)]),
      g(division(10), [m('hitsugaya', cap), m('rangiku', lt)]),
      g(division(11), [m('kenpachi', cap), m('yachiru', lt)]),
      g(division(12), [m('mayuri', cap), m('nemu', lt)]),
      g(division(13), [m('ukitake', cap), m('rukia', L('membro, poi luogotenente', 'member, later lieutenant'))]),
    ],
  },
  'faction-bl-division-1': captains(1, m('yamamoto'), m('kyoraku')),
  'faction-bl-division-2': captains(2, m('yoruichi'), m('soi-fon')),
  'faction-bl-division-3': captains(3, m('rose'), m('gin'), m('rose')),
  'faction-bl-division-4': captains(4, m('unohana'), m('isane')),
  'faction-bl-division-5': captains(5, m('shinji'), m('aizen'), m('shinji')),
  'faction-bl-division-6': captains(6, m('ginrei'), m('byakuya')),
  'faction-bl-division-7': captains(7, m('love'), m('komamura'), m('iba')),
  'faction-bl-division-8': captains(8, m('kyoraku'), m('lisa')),
  'faction-bl-division-9': captains(9, m('kensei'), m('tosen'), m('kensei')),
  'faction-bl-division-10': captains(10, m('isshin'), m('hitsugaya')),
  'faction-bl-division-11': captains(11, m('unohana', L('il primo Kenpachi', 'the first Kenpachi')), x('Kiganjō'), m('kenpachi')),
  'faction-bl-division-12': captains(12, m('kirio'), m('urahara'), m('mayuri')),
  'faction-bl-division-13': captains(13, m('ukitake'), m('rukia')),
  'faction-bl-espada': {
    structure: [
      g(L('Le dieci Espada', 'The ten Espada'), [
        m('yammy', L('Espada n. 10, n. 0 in Resurrección', 'Espada no. 10, no. 0 in Resurrección')),
        m('starrk', espada(1)),
        m('barragan', espada(2)),
        m('harribel', espada(3)),
        m('ulquiorra', espada(4)),
        m('nnoitra', espada(5)),
        m('grimmjow', espada(6)),
        m('zommari', espada(7)),
        m('szayelaporro', espada(8)),
        m('aaroniero', espada(9)),
      ]),
      g(L('Ex Espada', 'Former Espada'), [m('nelliel', L('ex n. 3', 'former no. 3'))]),
    ],
  },
  'faction-bl-royal-guard': {
    structure: [g(L('Divisione Zero', 'Squad Zero'), [m('ichibe', L('capo', 'leader')), m('tenjiro'), m('kirio'), m('senjumaru'), m('nimaiya')])],
  },
  'faction-bl-visored': {
    structure: [g(L('Membri', 'Members'), [m('shinji', L('capo', 'leader')), m('hiyori'), m('lisa'), m('love'), m('rose'), m('kensei'), m('mashiro'), m('hachigen')])],
  },
  'faction-bl-sternritter': {
    structure: [
      g(L('Imperatore e Gran Maestro', 'Emperor and Grand Master'), [m('yhwach', L('imperatore', 'emperor')), m('haschwalth', letter('B', 'L’Equilibrio', 'The Balance'))]),
      g(L('Sternritter'), [
        m('pernida', letter('C', 'L’Obbligo', 'The Compulsory')),
        m('askin', letter('D', 'Il Letale', 'The Deathdealing')),
        m('bambietta', letter('E', 'L’Esplosione', 'The Explode')),
        m('as-nodt', letter('F', 'La Paura', 'The Fear')),
        m('liltotto', letter('G', 'Il Ghiottone', 'The Glutton')),
        m('bazz-b', letter('H', 'Il Calore', 'The Heat')),
        m('cang-du', letter('I', 'Il Ferro', 'The Iron')),
        m('quilge', letter('J', 'La Prigione', 'The Jail')),
        m('bg9', letter('K', 'La Conoscenza', 'The Knowledge')),
        m('gerard', letter('M', 'Il Miracolo', 'The Miracle')),
        m('driscoll', letter('O', 'L’Eccesso', 'The Overkill')),
        m('meninas', letter('P', 'La Potenza', 'The Power')),
        m('mask', letter('S', 'La Superstar', 'The Superstar')),
        m('candice', letter('T', 'Il Fulmine', 'The Thunderbolt')),
        m('gremmy', letter('V', 'Il Visionario', 'The Visionary')),
        m('lille-barro', letter('X', 'L’Asse X', 'The X-Axis')),
        m('royd', letter('Y', 'Te Stesso', 'The Yourself')),
        m('giselle', letter('Z', 'Lo Zombie', 'The Zombie')),
      ]),
    ],
  },
};
