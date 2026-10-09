import { factionKit, L, type FactionExtras } from '../shared/factionKit';

const { m, g, succ } = factionKit('char-bc-');
const cap = L('capitano', 'captain');

/** Organigrammi e successioni (scheda e pagina della fazione). */
export const bcStructure: Record<string, FactionExtras> = {
  'faction-bc-magic-knights': {
    structure: [
      g(L('Toro Nero', 'Black Bull'), [m('yami', cap)]),
      g(L('Alba Dorata', 'Golden Dawn'), [m('william', cap)]),
      g(L('Aquila d’Argento', 'Silver Eagle'), [m('nozel', cap)]),
      g(L('Leone Cremisi', 'Crimson Lion'), [m('fuegoleon', cap), m('mereoleona', L('capitano facente funzioni', 'acting captain'))]),
      g(L('Rosa Blu', 'Blue Rose'), [m('charlotte', cap)]),
      g(L('Mantide Verde', 'Green Mantis'), [m('jack', cap)]),
      g(L('Pavone Corallo', 'Coral Peacock'), [m('dorothy', cap)]),
      g(L('Orca Viola', 'Purple Orca'), [m('kaiser', cap)]),
      g(L('Cervo Acquatico', 'Aqua Deer'), [m('rill', cap)]),
    ],
  },
  'faction-bc-black-bulls': {
    structure: [
      g(L('Capitano', 'Captain'), [m('yami'), m('nacht', L('vicecapitano', 'vice-captain'))]),
      g(L('Membri', 'Members'), [m('asta'), m('noelle'), m('magna'), m('luck'), m('finral'), m('vanessa'), m('gauche'), m('grey'), m('gordon'), m('zora'), m('charmy'), m('henry'), m('secre')]),
    ],
  },
  'faction-bc-golden-dawn': {
    structure: [g(L('Membri', 'Members'), [m('william', cap), m('yuno'), m('langris', L('vicecapitano', 'vice-captain')), m('klaus'), m('mimosa'), m('alecdora'), m('hamon')])],
  },
  'faction-bc-silver-eagle': {
    structure: [g(L('Membri', 'Members'), [m('nozel', cap), m('solid'), m('nebra')])],
  },
  'faction-bc-crimson-lion': {
    structure: [g(L('Membri', 'Members'), [m('fuegoleon', cap), m('mereoleona'), m('leopold'), m('randall')])],
  },
  'faction-bc-dark-triad': {
    structure: [
      g(L('La Triade Oscura', 'The Dark Triad'), [m('dante', L('ospite di Lucifero', 'host of Lucifero')), m('vanica', L('ospite di Megicula', 'host of Megicula')), m('zenon', L('ospite di Beelzebub', 'host of Beelzebub'))]),
      g(L('Sopra la Triade', 'Above the Triad'), [m('lucius', L('il vero capo', 'the true leader'))]),
    ],
  },
  'faction-bc-wizard-kings': {
    succession: [succ(L("Imperatore Magico", 'Wizard King'), [m('lumiere', L('il primo', 'the first')), m('julius', L('il 28°', 'the 28th'))])],
  },
};
