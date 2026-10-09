import { factionKit, L, type FactionExtras } from '../shared/factionKit';

const { m, g, succ } = factionKit('char-hxh-');
const n = (k: number) => L(`n. ${k}`, `no. ${k}`);

/** Organigrammi e successioni (scheda e pagina della fazione). */
export const hxhStructure: Record<string, FactionExtras> = {
  'faction-hxh-phantom-troupe': {
    structure: [
      g(L('Capo', 'Head'), [m('chrollo', L('n. 0', 'no. 0'))]),
      g(L('I dodici ragni', 'The twelve spiders'), [
        m('nobunaga', n(1)),
        m('feitan', n(2)),
        m('machi', n(3)),
        m('kalluto', L('n. 4, dopo Hisoka', 'no. 4, after Hisoka')),
        m('phinks', n(5)),
        m('shalnark', n(6)),
        m('franklin', n(7)),
        m('shizuku', n(8)),
        m('pakunoda', n(9)),
        m('bonolenov', n(10)),
        m('uvogin', n(11)),
        m('kortopi', n(12)),
      ]),
      g(L('Ex membri', 'Former members'), [m('hisoka', L('n. 4, infiltrato', 'no. 4, infiltrator')), m('omokage', L('n. 4 prima di Hisoka', 'no. 4 before Hisoka'))]),
    ],
  },
  'faction-hxh-zodiacs': {
    structure: [
      g(L('I dodici segni', 'The twelve signs'), [
        m('pariston', L('Topo', 'Rat')),
        m('mizaistom', L('Bue', 'Ox')),
        m('kanzai', L('Tigre', 'Tiger')),
        m('piyon', L('Coniglio', 'Rabbit')),
        m('botobai', L('Drago', 'Dragon')),
        m('gel', L('Serpente', 'Snake')),
        m('saccho', L('Cavallo', 'Horse')),
        m('ginta', L('Pecora', 'Sheep')),
        m('saiyu', L('Scimmia', 'Monkey')),
        m('cluck', L('Gallo', 'Rooster')),
        m('cheadle', L('Cane', 'Dog')),
        m('ging', L('Cinghiale, poi Leorio', 'Boar, then Leorio')),
      ]),
    ],
  },
  'faction-hxh-hunter-association': {
    succession: [succ(L('Presidente', 'Chairman'), [m('netero', L('12°', '12th')), m('pariston', L('13°, si dimette', '13th, resigns')), m('cheadle', L('14°', '14th'))])],
  },
  'faction-hxh-royal-guard': {
    structure: [g(L('Guardie reali del Re Meruem', "King Meruem's Royal Guards"), [m('neferpitou'), m('shaiapouf'), m('menthuthuyoupi')])],
  },
  'faction-hxh-zoldyck': {
    structure: [
      g(L('Famiglia', 'Family'), [m('maha', L('bisnonno', 'great-grandfather')), m('zeno', L('nonno', 'grandfather')), m('silva', L('capofamiglia', 'head of the family')), m('kikyo')]),
      g(L('Figli', 'Children'), [m('illumi'), m('milluki'), m('killua', L('erede designato', 'designated heir')), m('alluka'), m('kalluto')]),
    ],
  },
};
