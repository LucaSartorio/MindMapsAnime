import { factionKit, L, type FactionExtras } from '../shared/factionKit';

const { m, g } = factionKit('char-dbz-');

/** Organigrammi (scheda e pagina della fazione). */
export const dragonballStructure: Record<string, FactionExtras> = {
  'faction-dbz-ginyu-force': {
    structure: [g(L('Membri', 'Members'), [m('captain-ginyu', L('capitano', 'captain')), m('jeice'), m('burter'), m('recoome'), m('guldo')])],
  },
  'faction-dbz-frieza-force': {
    structure: [
      g(L('Comandante', 'Commander'), [m('frieza')]),
      g(L('Guardie scelte', 'Elite guards'), [m('zarbon'), m('dodoria')]),
      g(L('Forze Speciali Ginew', 'Ginyu Force'), [m('captain-ginyu'), m('jeice'), m('burter'), m('recoome'), m('guldo')]),
    ],
  },
  'faction-dbz-red-ribbon-army': {
    structure: [
      g(L('Comando', 'Command'), [m('commander-red', L('comandante supremo', 'supreme commander')), m('staff-officer-black', L('capo di stato maggiore', 'chief of staff'))]),
      g(L('Ufficiali', 'Officers'), [m('general-white'), m('colonel-silver'), m('general-blue')]),
    ],
  },
  'faction-dbz-universe-7-team': {
    structure: [
      g(L('Torneo del Potere', 'Tournament of Power'), [
        m('goku'), m('vegeta'), m('gohan', L('capitano', 'leader')), m('piccolo'), m('android-17'),
        m('android-18'), m('krillin'), m('tenshinhan'), m('master-roshi'), m('frieza'),
      ]),
    ],
  },
  'faction-dbz-universe-6-team': {
    structure: [g(L('Torneo fra gli universi 6 e 7', 'Universe 6 vs 7 tournament'), [m('hit'), m('cabba'), m('frost'), m('botamo'), m('magetta')])],
  },
  'faction-dbz-race-god-of-destruction': {
    structure: [
      g(L('Universo 7', 'Universe 7'), [m('beerus', L('Dio della Distruzione', 'God of Destruction')), m('whis', L('angelo', 'angel'))]),
      g(L('Universo 6', 'Universe 6'), [m('champa', L('Dio della Distruzione', 'God of Destruction')), m('vados', L('angela', 'angel'))]),
      g(L('Universo 11', 'Universe 11'), [m('toppo', L('candidato Dio della Distruzione', 'God of Destruction candidate'))]),
      g(L('Sopra gli dei', 'Above the gods'), [m('zeno', L('Re di Tutto', 'King of Everything')), m('grand-priest', L('Gran Sacerdote', 'Grand Priest'))]),
    ],
  },
  'faction-dbz-race-kaioshin': {
    structure: [g(L('Universo 7', 'Universe 7'), [m('supreme-kai', L('Kaioshin dell’Est', 'East Supreme Kai')), m('kibito', L('assistente', 'attendant')), m('elder-kai', L('antenato di quindici generazioni prima', 'ancestor from fifteen generations back'))])],
  },
};
