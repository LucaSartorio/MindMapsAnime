import { factionKit, L, type FactionExtras } from '../shared/factionKit';

const { m, x, g } = factionKit('char-fma-');

/**
 * Organigrammi (scheda e pagina della fazione). `m()` = personaggio del dataset; `x()` = persona senza scheda
 * (solo il nome; dal batch 10 restano `x()` solo Xiao Mei, la panda di May, che non ha una scheda). Gradi come in `characters*.ts` (fonte S9).
 */
export const fmaStructure: Record<string, FactionExtras> = {
  'faction-fma-state-military': {
    structure: [
      g(L('Vertice', 'Leadership'), [m('king-bradley', L('Führer', 'Führer'))]),
      g(L('Ufficiali', 'Officers'), [
        m('olivier-mira-armstrong', L('maggiore generale', 'Major General')),
        m('maes-hughes', L('tenente colonnello, servizi informativi', 'Lieutenant Colonel, intelligence')),
        m('roy-mustang', L('colonnello', 'Colonel')),
        m('alex-louis-armstrong', L('maggiore', 'Major')),
        m('solf-j-kimblee', L('maggiore', 'Major')),
      ]),
      g(L('Ufficiali subalterni', 'Junior officers'), [
        m('riza-hawkeye', L('tenente', 'First Lieutenant')),
        m('jean-havoc', L('sottotenente', 'Second Lieutenant')),
      ]),
    ],
  },
  'faction-fma-state-alchemists': {
    structure: [
      g(L('Membri e titoli', 'Members and titles'), [
        m('edward-elric', L("Alchimista d'Acciaio · il più giovane", 'Fullmetal Alchemist · the youngest')),
        m('roy-mustang', L('Alchimista di Fuoco', 'Flame Alchemist')),
        m('alex-louis-armstrong', L('Alchimista del Braccio Forte', 'Strong Arm Alchemist')),
        m('solf-j-kimblee', L('Alchimista Cremisi', 'Crimson Alchemist')),
        m('shou-tucker', L('titolo ottenuto creando una chimera parlante', 'title earned by creating a talking chimera')),
      ]),
    ],
  },
  'faction-fma-mustang-squadron': {
    structure: [
      g(L('Comandante', 'Commander'), [m('roy-mustang')]),
      g(L('Subordinati', 'Subordinates'), [
        m('riza-hawkeye', L('tenente', 'First Lieutenant')),
        m('jean-havoc', L('sottotenente', 'Second Lieutenant')),
        m('vato-falman', L('sottufficiale', 'Warrant Officer')),
        m('heymans-breda', L('sottotenente', 'Second Lieutenant')),
        m('kain-fuery', L('sergente maggiore', 'Sergeant Major')),
      ]),
    ],
  },
  'faction-fma-briggs-garrison': {
    structure: [
      g(L('Comandante', 'Commander'), [m('olivier-mira-armstrong', L('maggiore generale', 'Major General'))]),
      g(L('Ufficiali e soldati', 'Officers and soldiers'), [
        m('miles', L('per un quarto ishvaliano', 'a quarter Ishvalan')),
        m('buccaneer', L('muore combattendo Bradley', 'dies fighting Bradley')),
        m('vato-falman', L('trasferito a Briggs', 'transferred to Briggs')),
      ]),
    ],
  },
  'faction-fma-homunculi': {
    structure: [
      g(L('Il creatore', 'The creator'), [m('father', L('capo', 'leader'))]),
      g(L('I sette peccati', 'The seven sins'), [
        m('pride', L('Superbia', 'Pride')),
        m('king-bradley', L('Ira · Wrath, il Führer', 'Wrath · the Führer')),
        m('envy', L('Invidia', 'Envy')),
        m('greed', L('Avarizia · si ribella', 'Greed · rebels')),
        m('gluttony', L('Gola', 'Gluttony')),
        m('sloth', L('Accidia', 'Sloth')),
        m('lust', L('Lussuria', 'Lust')),
      ]),
    ],
  },
  'faction-fma-greeds-gang': {
    structure: [
      g(L('Capo', 'Leader'), [m('greed')]),
      g(L('Seguaci', 'Followers'), [
        m('dolcetto', L('chimera umana (cane)', 'human chimera (dog)')),
        m('loa', L('chimera umana (bue)', 'human chimera (ox)')),
        m('martel', L('chimera umana (serpente)', 'human chimera (snake)')),
        m('bido', L('chimera umana (geco)', 'human chimera (gecko)')),
      ], L('Altri membri, come Ulchi, non sono elencati.', 'Other members, such as Ulchi, are not listed.')),
    ],
  },
  'faction-fma-yao-clan': {
    structure: [
      g(L('Rappresentante e fedeli', 'Representative and retainers'), [
        m('ling-yao', L('dodicesimo principe, rappresenta il clan', 'twelfth prince, represents the clan')),
        m('lan-fan', L('guardia del corpo', 'bodyguard')),
        m('fu', L('guardia del corpo, nonno di Lan Fan', "bodyguard, Lan Fan's grandfather")),
      ]),
    ],
  },
  'faction-fma-chang-clan': {
    structure: [
      g(L('Rappresentante', 'Representative'), [
        m('may-chang', L('diciassettesima principessa, rappresenta il clan', 'seventeenth princess, represents the clan')),
        x(L('Xiao Mei'), L('la sua panda', 'her pet panda')),
      ]),
    ],
  },
  'faction-fma-milos-black-bats': {
    structure: [
      g(L('Resistenza di Milos', 'Milosian resistance'), [
        m('julia-crichton', L('alchimista cresciuta dalla resistenza', 'alchemist raised by the resistance')),
        m('miranda', L('comandante dei Pipistrelli Neri, uccisa da Atlas', 'commander of the Black Bats, killed by Atlas')),
      ]),
    ],
  },
  'faction-fma-cretan-army-milos': {
    structure: [g(L('Comando', 'Command'), [m('ashleigh-crichton', L('colonnello Herschel', 'Colonel Herschel'))])],
  },
};
