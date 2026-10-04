import { factionKit, L, type FactionExtras } from '../shared/factionKit';

const { m, g, succ } = factionKit('char-aot-');

/** Organigrammi e successioni (scheda e pagina della fazione). */
export const aotStructure: Record<string, FactionExtras> = {
  'faction-aot-eldian-empire': {
    succession: [
      succ(L('Gigante Fondatore', 'Founding Titan'), [m('ymir-fritz'), m('karl-fritz', L('145° re, alza le Mura', '145th king, raises the Walls')), m('uri-reiss'), m('frieda-reiss'), m('grisha', L('lo ruba a Frieda', 'steals it from Frieda')), m('eren')]),
      succ(L('Gigante d’Attacco', 'Attack Titan'), [m('kruger'), m('grisha'), m('eren')]),
      succ(L('Gigante Corazzato', 'Armored Titan'), [m('reiner')]),
      succ(L('Gigante Colossale', 'Colossal Titan'), [m('bertolt'), m('armin')]),
      succ(L('Gigante Femmina', 'Female Titan'), [m('annie')]),
      succ(L('Gigante Mascella', 'Jaw Titan'), [m('marcel'), m('ymir'), m('porco'), m('falco')]),
      succ(L('Gigante Carro', 'Cart Titan'), [m('pieck')]),
      succ(L('Gigante Bestia', 'Beast Titan'), [m('ksaver'), m('zeke')]),
      succ(L('Gigante Martello', 'War Hammer Titan'), [m('lara-tybur'), m('eren')]),
    ],
  },
  'faction-aot-survey-corps': {
    succession: [succ(L('Comandante', 'Commander'), [m('shadis', L('12°', '12th')), m('erwin', L('13°', '13th')), m('hange', L('14°', '14th')), m('armin', L('15°', '15th'))])],
  },
  'faction-aot-levi-squad': {
    structure: [
      g(L('Prima squadra', 'First squad'), [m('levi', L('caposquadra', 'squad leader')), m('petra'), m('oluo'), m('eld'), m('gunther'), m('eren')]),
      g(L('Nuova squadra Levi', 'New Levi Squad'), [m('levi', L('caposquadra', 'squad leader')), m('eren'), m('mikasa'), m('armin'), m('jean'), m('connie'), m('sasha'), m('historia')]),
    ],
  },
  'faction-aot-warriors': {
    structure: [
      g(L('Guerrieri', 'Warriors'), [
        m('zeke', L('capo dei Guerrieri, Bestia', 'Warrior chief, Beast')),
        m('reiner', L('Corazzato', 'Armored')),
        m('bertolt', L('Colossale', 'Colossal')),
        m('annie', L('Femmina', 'Female')),
        m('marcel', L('Mascella', 'Jaw')),
        m('porco', L('Mascella, dopo Ymir', 'Jaw, after Ymir')),
        m('pieck', L('Carro', 'Cart')),
      ]),
      g(L('Candidati', 'Candidates'), [m('gabi'), m('falco'), m('udo'), m('zofia')]),
      g(L('Comando', 'Command'), [m('magath', L('comandante', 'commander'))]),
    ],
  },
};
