import type { Tournament } from '@/types';
import { L, tournamentKit } from '../shared/tournamentKit';

/**
 * Tornei di Naruto: l'esame dei Chūnin di Konoha (preliminari e torneo
 * finale) e quello dell'era Boruto. Si vedono nella scheda dell'Arena
 * dell'esame (sotto-mappa di Konoha) e del pin di Konoha.
 */
const { side, group, match } = tournamentKit('char-');

export const narutoTournaments: Tournament[] = [
  {
    id: 'tourn-chunin-exam-prelims',
    worldId: 'world-naruto',
    name: 'Chūnin Exam · Preliminaries',
    localizedName: L('Esame dei Chūnin · preliminari', 'Chūnin Exam · Preliminaries'),
    locationId: 'loc-konoha-exam-arena',
    arcId: 'arc-chunin-exams',
    order: 1,
    format: 'rounds',
    description: L(
      "Troppi candidati superano la Foresta della Morte: per sfoltirli si combattono duelli uno contro uno, sorteggiati da un tabellone elettronico. Kabuto si ritira prima di cominciare. Passano al torneo finale dieci ninja (nove dopo il doppio K.O. fra Sakura e Ino).",
      'Too many candidates make it through the Forest of Death: to thin them out, one-on-one duels are drawn by an electronic board. Kabuto withdraws before they begin. Ten ninja advance to the final tournament (nine after Sakura and Ino knock each other out).',
    ),
    rounds: [
      {
        name: L('Incontri preliminari', 'Preliminary matches'),
        matches: [
          match(side('sasuke'), group(L('Yoroi Akado')), 0, { note: L('Sasuke usa per la prima volta il Leone di Konoha.', 'Sasuke uses the Lion Combo for the first time.') }),
          match(side('shino'), side('zaku'), 0),
          match(side('kankuro'), group(L('Misumi Tsurugi')), 0),
          match(side('sakura'), side('ino'), undefined, { note: L('Doppio K.O.: nessuna delle due passa.', 'Double knockout: neither advances.') }),
          match(side('temari'), side('tenten'), 0),
          match(side('shikamaru'), side('kin'), 0),
          match(side('naruto'), side('kiba'), 0),
          match(side('neji'), side('hinata'), 0, { eventId: 'ev-neji-vs-hinata' }),
          match(side('gaara'), side('rock-lee'), 0, { eventId: 'ev-rock-lee-vs-gaara' }),
          match(side('dosu'), side('choji'), 0),
        ],
      },
    ],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['esame-chunin'],
  },
  {
    id: 'tourn-chunin-exam-finals',
    worldId: 'world-naruto',
    name: 'Chūnin Exam · Final Tournament',
    localizedName: L('Esame dei Chūnin · torneo finale', 'Chūnin Exam · Final Tournament'),
    locationId: 'loc-konoha-exam-arena',
    arcId: 'arc-chunin-exams',
    order: 2,
    format: 'rounds',
    description: L(
      "Un mese dopo, davanti ai daimyō e al pubblico, si combatte il torneo finale. Dosu, ucciso da Gaara la notte prima, non si presenta. Durante Sasuke contro Gaara scatta l'invasione di Suna e del Suono orchestrata da Orochimaru, e il torneo si interrompe; alla fine solo Shikamaru viene promosso chūnin.",
      'A month later, before the daimyō and the crowd, the final tournament is fought. Dosu, killed by Gaara the night before, never shows up. During Sasuke versus Gaara the invasion of the Sand and Sound orchestrated by Orochimaru begins, and the tournament stops; in the end only Shikamaru is promoted to chūnin.',
    ),
    rounds: [
      {
        name: L('Primo turno', 'First round'),
        matches: [
          match(side('naruto'), side('neji'), 0, { eventId: 'ev-chunin-tournament' }),
          match(side('sasuke'), side('gaara'), undefined, { note: L('Interrotto dall’invasione di Konoha.', 'Interrupted by the invasion of Konoha.') }),
          match(side('shino'), side('kankuro'), 0, { note: L('Kankuro si ritira.', 'Kankuro withdraws.') }),
          match(side('shikamaru'), side('temari'), 1, { note: L('Shikamaru la immobilizza, poi si arrende.', 'Shikamaru pins her down, then gives up.') }),
        ],
      },
    ],
    outcome: L('Torneo interrotto: solo Shikamaru viene promosso chūnin.', 'Tournament interrupted: only Shikamaru is promoted to chūnin.'),
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['esame-chunin'],
  },
  {
    id: 'tourn-boruto-chunin-exam',
    worldId: 'world-naruto',
    name: 'Chūnin Exam (Boruto era)',
    localizedName: L("Esame dei Chūnin dell'era Boruto", 'Chūnin Exam (Boruto era)'),
    locationId: 'loc-konoha-exam-arena',
    arcId: 'arc-momoshiki',
    order: 3,
    format: 'rounds',
    description: L(
      "L'esame congiunto dei cinque villaggi, con Naruto ormai Hokage. Nella terza prova Boruto vince usando di nascosto lo strumento scientifico di Katasuke, ma Naruto se ne accorge e lo squalifica; poco dopo Momoshiki e Kinshiki Ōtsutsuki attaccano l'arena. Lo svolgimento qui riportato segue la versione dell'anime.",
      'The joint exam of the five villages, with Naruto now Hokage. In the third stage Boruto wins by secretly using Katasuke\'s scientific tool, but Naruto notices and disqualifies him; soon after, Momoshiki and Kinshiki Ōtsutsuki attack the arena. The bouts listed here follow the anime version.',
    ),
    rounds: [
      {
        name: L('Terza prova · duelli', 'Third stage · duels'),
        matches: [
          match(side('boruto'), side('yurui'), 0),
          match(side('shikadai'), side('yodo'), 0),
          match(side('araya'), side('inojin'), 0),
          match(side('shinki'), side('chocho'), 0),
          match(side('boruto'), side('shikadai'), 0, { eventId: 'ev-boruto-chunin-exams', note: L('Boruto viene poi squalificato per lo strumento proibito.', 'Boruto is then disqualified for the forbidden tool.') }),
          match(side('sarada'), side('araya'), 0, { note: L('Araya combatteva tramite una marionetta.', 'Araya was fighting through a puppet.') }),
        ],
      },
    ],
    outcome: L("Interrotto dall'attacco degli Ōtsutsuki.", 'Interrupted by the Ōtsutsuki attack.'),
    canonStatus: 'anime_only',
    referenceStatus: 'needs_verification',
    tags: ['esame-chunin', 'boruto-era'],
  },
];

