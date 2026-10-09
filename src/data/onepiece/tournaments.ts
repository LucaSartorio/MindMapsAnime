import type { Tournament } from '@/types';
import { L, tournamentKit } from '../shared/tournamentKit';

/**
 * Competizioni di One Piece: il Davy Back Fight contro i Pirati di Foxy a
 * Long Ring Long Land e il torneo del Colosseo Corrida di Dressrosa, il cui
 * premio è il Frutto Foco Foco appartenuto ad Ace.
 */
const { side, group, match } = tournamentKit('char-op-');

export const onepieceTournaments: Tournament[] = [
  {
    id: 'tourn-op-davy-back-fight',
    worldId: 'world-onepiece',
    name: 'Davy Back Fight',
    localizedName: L('Davy Back Fight', 'Davy Back Fight'),
    locationId: 'loc-op-long-ring-long-land',
    arcId: 'arc-op-long-ring',
    order: 1,
    format: 'rounds',
    description: L(
      "Il gioco dei pirati in cui le ciurme si sfidano in prove e chi vince prende un membro o la bandiera della ciurma avversaria. Foxy lo propone ai Cappello di Paglia: si disputano tre prove, la Corsa delle Ciambelle, il Groggy Ring e lo scontro finale fra i due capitani.",
      "The pirate game in which crews compete in trials and the winner takes a member or the flag of the losing crew. Foxy challenges the Straw Hats: three trials are held, the Donut Race, the Groggy Ring and the final fight between the two captains.",
    ),
    rounds: [
      {
        name: L('Le prove', 'The trials'),
        matches: [
          match(side(['nami', 'usopp', 'robin']), group(L('Pirati di Foxy', 'Foxy Pirates')), 1, { note: L('Corsa delle Ciambelle: Foxy prende Chopper.', 'Donut Race: Foxy takes Chopper.') }),
          match(side(['zoro', 'sanji']), group(L('Groggy Monsters', 'Groggy Monsters')), 0, { note: L('Groggy Ring: i Cappello di Paglia si riprendono Chopper.', 'Groggy Ring: the Straw Hats take Chopper back.') }),
          match(side('luffy'), side('foxy'), 0, { eventId: 'evt-op-fight-luffy-foxy', note: L('Rufy vince e si prende la bandiera di Foxy.', "Luffy wins and takes Foxy's flag.") }),
        ],
      },
    ],
    outcome: L('Vincono i Cappello di Paglia.', 'The Straw Hats win.'),
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['davy-back-fight'],
  },
  {
    id: 'tourn-op-corrida-colosseum',
    worldId: 'world-onepiece',
    name: 'Corrida Colosseum Tournament',
    localizedName: L('Il torneo del Colosseo Corrida', 'Corrida Colosseum Tournament'),
    locationId: 'loc-op-dr-corrida-colosseum',
    arcId: 'arc-op-dressrosa',
    order: 2,
    format: 'rounds',
    description: L(
      "Doflamingo mette in palio il Frutto Foco Foco di Ace. Quattro battaglie reali, i blocchi A, B, C e D, scelgono i finalisti che affronteranno il campione del colosseo, Diamante. Rufy partecipa sotto il nome di «Lucy»; quando lascia il colosseo per affrontare Doflamingo, è Sabo a prendere il suo posto con lo stesso travestimento.",
      "Doflamingo puts Ace's Flame-Flame Fruit up as the prize. Four battle royales, blocks A, B, C and D, pick the finalists who will face the colosseum's champion, Diamante. Luffy enters under the name 'Lucy'; when he leaves the colosseum to go after Doflamingo, Sabo takes his place in the same disguise.",
    ),
    rounds: [
      {
        name: L('Battaglie reali dei blocchi', 'Block battle royales'),
        matches: [
          match(side('burgess'), group(L('Blocco A', 'Block A')), 0),
          match(side('bartolomeo'), group(L('Blocco B', 'Block B')), 0),
          match(side('luffy', L('Lucy')), group(L('Blocco C', 'Block C')), 0, { eventId: 'evt-op-dr-colosseum' }),
          match(side('rebecca'), group(L('Blocco D', 'Block D')), 0, { note: L('Nel blocco D combatte anche Cavendish.', 'Cavendish also fights in Block D.') }),
        ],
      },
      {
        name: L('Finale', 'Final'),
        matches: [
          {
            sides: [side('sabo', L('Lucy')), side('burgess'), side('rebecca'), side('diamante')],
            winner: 0,
            eventId: 'evt-op-sabo-mera-mera',
            note: L('Sabo mangia il Frutto Foco Foco e ne ottiene i poteri.', 'Sabo eats the Flame-Flame Fruit and gains its powers.'),
          },
        ],
      },
    ],
    winnerIds: ['char-op-sabo'],
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['dressrosa', 'colosseo'],
  },
];
