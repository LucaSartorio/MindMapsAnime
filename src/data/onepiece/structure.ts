import { factionKit, L, type FactionExtras } from '../shared/factionKit';

const { m, x, g, succ } = factionKit('char-op-');
const ord = (k: number) => `${k}${k % 100 >= 11 && k % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[k % 10] ?? 'th'}`;
const div = (k: number) => L(`comandante della ${k}ª flotta`, `commander of the ${ord(k)} division`);

/** Organigrammi e successioni (scheda e pagina della fazione). */
export const onepieceStructure: Record<string, FactionExtras> = {
  'faction-op-straw-hat-pirates': {
    structure: [
      g(L('Ciurma', 'Crew'), [
        m('luffy', L('capitano', 'captain')),
        m('zoro', L('spadaccino', 'swordsman')),
        m('nami', L('navigatrice', 'navigator')),
        m('usopp', L('cecchino', 'sniper')),
        m('sanji', L('cuoco', 'cook')),
        m('chopper', L('medico', 'doctor')),
        m('robin', L('archeologa', 'archaeologist')),
        m('franky', L('carpentiere', 'shipwright')),
        m('brook', L('musicista', 'musician')),
        m('jinbe', L('timoniere', 'helmsman')),
      ]),
    ],
  },
  'faction-op-marines': {
    structure: [
      g(L('Ammiragli', 'Admirals'), [m('kizaru'), m('fujitora'), x('Ryokugyu')]),
      g(L('Ex ammiragli', 'Former admirals'), [m('aokiji', L('lascia la Marina', 'leaves the Navy')), m('akainu', L('promosso grand’ammiraglio', 'promoted to Fleet Admiral'))]),
      g(L('Eroe della Marina', 'Hero of the Navy'), [m('garp', L('viceammiraglio', 'vice admiral'))]),
    ],
    succession: [succ(L('Grand’ammiraglio', 'Fleet Admiral'), [m('kong'), m('sengoku'), m('akainu')])],
  },
  'faction-op-whitebeard-pirates': {
    structure: [
      g(L('Capitano', 'Captain'), [m('whitebeard')]),
      g(L('Comandanti di flotta', 'Division commanders'), [m('marco', div(1)), m('ace', div(2)), m('jozu', div(3)), m('thatch', div(4)), m('vista', div(5)), m('haruta', div(12)), m('izo', div(16))]),
    ],
  },
  'faction-op-beasts-pirates': {
    structure: [
      g(L('Governatore generale', 'Governor-General'), [m('kaido')]),
      g(L('Calamità (All-Stars)', 'Calamities (All-Stars)'), [m('king'), m('queen'), m('jack')]),
      g(L('Tobi Roppo'), [m('whos-who'), m('black-maria'), m('sasaki'), m('ulti'), m('page-one'), m('drake')]),
    ],
  },
  'faction-op-big-mom-pirates': {
    structure: [
      g(L('Capitana', 'Captain'), [m('big-mom')]),
      g(L('Generali dolci', 'Sweet Commanders'), [m('katakuri'), m('cracker'), m('smoothie'), m('snack', L('ex, sconfitto da Urouge', 'former, defeated by Urouge'))]),
    ],
  },
  'faction-op-five-elders': {
    structure: [g(L('I Cinque Astri', 'The Five Elders'), [m('saturn'), m('mars'), m('warcury'), m('nusjuro'), x('Ju Peter')])],
  },
  'faction-op-revolutionary-army': {
    structure: [
      g(L('Vertici', 'Leadership'), [m('dragon', L('comandante supremo', 'supreme commander')), m('sabo', L('capo di stato maggiore', 'chief of staff')), m('koala'), m('ivankov')]),
      g(L('Comandanti dei quattro eserciti', 'Commanders of the four armies'), [
        x('Belo Betty', L('Est', 'East')),
        m('morley', L('Ovest', 'West')),
        m('karasu', L('Nord', 'North')),
        m('lindbergh', L('Sud', 'South')),
      ]),
    ],
  },
  'faction-op-blackbeard-pirates': {
    structure: [
      g(L('Ammiraglio', 'Admiral'), [m('blackbeard')]),
      g(L('Capitani delle navi titaniche', 'Titanic Captains'), [m('burgess'), m('shiryu'), m('van-augur'), m('pizarro'), x('Laffitte'), m('vasco-shot'), m('catarina-devon'), m('sanjuan-wolf'), m('doc-q')]),
    ],
  },
  'faction-op-yonko': {
    structure: [
      g(L('Prima di Marineford', 'Before Marineford'), [m('whitebeard'), m('big-mom'), m('kaido'), m('shanks')]),
      g(L('Dopo Marineford', 'After Marineford'), [m('blackbeard', L('prende il posto di Barbabianca', "takes Whitebeard's place")), m('big-mom'), m('kaido'), m('shanks')]),
      g(L('Dopo Wano', 'After Wano'), [m('shanks'), m('blackbeard'), m('luffy'), m('buggy')]),
    ],
  },
  'faction-op-shichibukai': {
    structure: [
      g(L('Membri noti', 'Known members'), [
        m('mihawk'), m('crocodile'), m('doflamingo'), m('kuma'), m('moria'), m('hancock'), m('jinbe'),
        m('law'), m('buggy'), m('weevil'), m('blackbeard', L('per poco tempo', 'briefly')),
      ], L('Il sistema viene abolito dopo il Reverie.', 'The system is abolished after the Reverie.')),
    ],
  },
  'faction-op-red-hair-pirates': {
    structure: [g(L('Ciurma', 'Crew'), [m('shanks', L('capitano', 'captain')), m('benn-beckman', L('vicecapitano', 'first mate')), m('yasopp', L('cecchino', 'sniper')), x('Lucky Roux')])],
  },
  'faction-op-roger-pirates': {
    structure: [
      g(L('Ciurma', 'Crew'), [
        m('roger', L('capitano', 'captain')),
        m('rayleigh', L('vicecapitano', 'first mate')),
        m('scopper-gaban'),
        m('oden'),
        m('shanks', L('mozzo', 'cabin boy')),
        m('buggy', L('mozzo', 'cabin boy')),
      ]),
    ],
  },
};
