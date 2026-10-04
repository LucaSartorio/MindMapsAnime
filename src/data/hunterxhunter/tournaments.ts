import type { Tournament } from '@/types';
import { L, tournamentKit } from '../shared/tournamentKit';

/**
 * Tornei di Hunter x Hunter: la fase finale del 287° Esame (un torneo in cui
 * chi perde passa al turno successivo, finché resta un solo bocciato) e la
 * sfida a dodgeball di Greed Island contro Razor.
 */
const { side, match } = tournamentKit('char-hxh-');

export const hxhTournaments: Tournament[] = [
  {
    id: 'tourn-hxh-287th-exam-final',
    worldId: 'world-hunterxhunter',
    name: '287th Hunter Exam · Final Phase',
    localizedName: L('287° Esame per Hunter · fase finale', '287th Hunter Exam · Final Phase'),
    locationId: 'loc-hxh-zaban-city',
    arcId: 'arc-hxh-hunter-exam',
    order: 1,
    format: 'rounds',
    description: L(
      "Un torneo rovesciato ideato da Netero: chi vince è promosso Hunter, chi perde torna a combattere, e alla fine un solo candidato viene bocciato. Si vince facendo dire all'avversario «mi arrendo»; uccidere significa la squalifica.",
      "An upside-down tournament devised by Netero: whoever wins becomes a Hunter, whoever loses fights again, and in the end only one candidate fails. You win by making your opponent say 'I give up'; killing means disqualification.",
    ),
    rounds: [
      {
        name: L('Gli incontri, in ordine', 'The matches, in order'),
        matches: [
          match(side('gon'), side('hanzo'), 0, { eventId: 'ev-hxh-gon-vs-hanzo', note: L('Hanzo, che non riesce a piegarlo, si arrende.', "Hanzo, unable to break him, gives up.") }),
          match(side('kurapika'), side('hisoka'), 0, { note: L('Hisoka si arrende dopo avergli sussurrato qualcosa sulla Brigata.', 'Hisoka gives up after whispering something to him about the Troupe.') }),
          match(side('hanzo'), side('pokkle'), 0),
          match(side('hisoka'), side('bodoro'), 0),
          match(side('pokkle'), side('killua'), 0, { note: L('Killua si ritira senza combattere.', 'Killua withdraws without fighting.') }),
          match(side('illumi', L('Gittarackur')), side('killua'), 0, { note: L('Illumi si rivela e spezza la volontà del fratello.', "Illumi reveals himself and breaks his brother's will.") }),
          match(side('leorio'), side('bodoro'), 0, { eventId: 'ev-hxh-final-phase', note: L('Killua uccide Bodoro all’improvviso e viene squalificato: Leorio passa.', 'Killua suddenly kills Bodoro and is disqualified: Leorio passes.') }),
        ],
      },
    ],
    outcome: L(
      'Promossi Gon, Kurapika, Leorio, Hanzo, Hisoka, Illumi e Pokkle; Killua è l’unico bocciato.',
      'Gon, Kurapika, Leorio, Hanzo, Hisoka, Illumi and Pokkle pass; Killua is the only one to fail.',
    ),
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['esame', 'torneo'],
  },
  {
    id: 'tourn-hxh-soufrabi-dodgeball',
    worldId: 'world-hunterxhunter',
    name: 'Soufrabi Dodgeball Match',
    localizedName: L('La sfida a dodgeball di Soufrabi', 'Soufrabi Dodgeball Match'),
    locationId: 'loc-hxh-gi-soufrabi',
    arcId: 'arc-hxh-greed-island',
    order: 2,
    format: 'rounds',
    description: L(
      "Per ottenere la carta di Soufrabi Gon deve battere i pirati di Razor in una serie di sfide, fino alla partita a dodgeball contro Razor e i suoi diavoli di Nen. Nella squadra di Gon giocano anche Killua, Biscuit, Hisoka, Goreinu e la squadra di Tsezguerra.",
      "To get the Soufrabi card Gon must beat Razor's pirates in a series of challenges, up to the dodgeball match against Razor and his Nen devils. Gon's team also includes Killua, Biscuit, Hisoka, Goreinu and Tsezguerra's team.",
    ),
    rounds: [
      {
        name: L('Partita finale', 'Final match'),
        matches: [
          match(
            side(['gon', 'killua', 'biscuit', 'hisoka', 'goreinu', 'tsezguerra'], L('Squadra di Gon', "Gon's team")),
            side(['razor'], L('Razor e i Quattordici Diavoli', 'Razor and the Fourteen Devils')),
            0,
            { eventId: 'ev-hxh-dodgeball-razor', note: L('Gon chiude la partita con un tiro Jajanken, aiutato da Killua e Hisoka.', 'Gon ends the match with a Jajanken throw, helped by Killua and Hisoka.') },
          ),
        ],
      },
    ],
    winnerIds: ['char-hxh-gon'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['greed-island', 'dodgeball'],
  },
];
