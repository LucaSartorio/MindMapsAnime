import type { Tournament } from '@/types';
import { L, tournamentKit } from '../shared/tournamentKit';

/** La selezione dei Royal Knights, il torneo a squadre indetto dal Re Mago. */
const { side, match } = tournamentKit('char-bc-');

export const blackcloverTournaments: Tournament[] = [
  {
    id: 'tourn-bc-royal-knights-exam',
    worldId: 'world-blackclover',
    name: 'Royal Knights Selection Exam',
    localizedName: L('La selezione dei Royal Knights', 'Royal Knights Selection Exam'),
    locationId: 'loc-bc-royal-knights-arena',
    arcId: 'arc-bc-royal-knights-exam',
    order: 1,
    format: 'rounds',
    description: L(
      "Julius Novachrono forma una squadra d'élite contro l'Occhio Magico della Notte Bianca: i Cavalieri Magici si sfidano in squadre da tre estratte a sorte, e vince chi distrugge il cristallo avversario. L'Imperatore Magico sceglie i Royal Knights guardando come hanno combattuto, non solo chi ha vinto.",
      "Julius Novachrono forms an elite squad against the Eye of the Midnight Sun: the Magic Knights compete in randomly drawn teams of three, and the winner is whoever breaks the opposing crystal. The Wizard King picks the Royal Knights by how they fought, not just by who won.",
    ),
    rounds: [
      {
        name: L('Alcuni incontri', 'Some of the matches'),
        matches: [
          match(side(['asta', 'mimosa', 'zora'], L('Squadra di Asta', "Asta's team")), side(['magna', 'sol', 'kirsch'], L('Squadra di Kirsch', "Kirsch's team")), 0, {
            note: L('Zora partecipa sotto il falso nome di Xerx Lugner.', 'Zora takes part under the false name of Xerx Lugner.'),
          }),
          match(side(['langris'], L('Squadra di Langris', "Langris's team")), side(['finral'], L('Squadra di Finral', "Finral's team")), 0, { eventId: 'evt-bc-langris-vs-finral' }),
          match(side(['asta', 'mimosa', 'zora'], L('Squadra di Asta', "Asta's team")), side(['langris'], L('Squadra di Langris', "Langris's team")), undefined, { eventId: 'evt-bc-royal-knights-final' }),
          match(side(['yuno'], L('Squadra di Yuno', "Yuno's team")), side(['rill'], L('Squadra di Rill', "Rill's team"))),
        ],
      },
    ],
    outcome: L("L'Imperatore Magico annuncia i membri dei Royal Knights.", 'The Wizard King announces the members of the Royal Knights.'),
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['royal-knights'],
  },
];
