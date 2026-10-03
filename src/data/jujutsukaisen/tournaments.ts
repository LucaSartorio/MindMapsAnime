import type { Tournament } from '@/types';
import { L, tournamentKit } from '../shared/tournamentKit';

/** L'incontro di scambio fra le scuole di Tokyo e Kyoto. */
const { side, match } = tournamentKit('char-jjk-');

export const jjkTournaments: Tournament[] = [
  {
    id: 'tourn-jjk-goodwill-event',
    worldId: 'world-jujutsukaisen',
    name: 'Kyoto Sister School Goodwill Event',
    localizedName: L("L'incontro di scambio con Kyoto", 'Kyoto Sister School Goodwill Event'),
    locationId: 'loc-jjk-jh-sports-field',
    arcId: 'arc-jjk-goodwill',
    order: 1,
    format: 'rounds',
    description: L(
      "La sfida annuale fra gli istituti di arti occulte di Tokyo e Kyoto, ospitata quell'anno a Tokyo. Il primo giorno è una gara a squadre per esorcizzare gli spiriti nel bosco della scuola, interrotta dall'attacco di Hanami e dei suoi alleati; il secondo giorno Gojo impone una partita di baseball.",
      "The annual contest between the Tokyo and Kyoto jujutsu schools, hosted that year in Tokyo. Day one is a team race to exorcise curses in the school forest, interrupted by the attack of Hanami and her allies; on day two Gojo imposes a baseball game.",
    ),
    rounds: [
      {
        name: L('Primo giorno · gara a squadre', 'Day one · team battle'),
        matches: [
          match(
            side(['yuji', 'megumi', 'nobara', 'maki', 'panda', 'toge'], L('Istituto di Tokyo', 'Tokyo school')),
            side(['todo', 'mai', 'momo', 'noritoshi', 'miwa', 'mechamaru'], L('Istituto di Kyoto', 'Kyoto school')),
            undefined,
            { eventId: 'evt-jjk-hanami-attack', note: L("Interrotta dall'attacco degli spiriti maledetti.", 'Interrupted by the cursed spirits’ attack.') },
          ),
        ],
      },
      {
        name: L('Secondo giorno · baseball', 'Day two · baseball'),
        matches: [
          match(
            side(['yuji', 'megumi', 'nobara', 'maki', 'panda', 'toge'], L('Istituto di Tokyo', 'Tokyo school')),
            side(['todo', 'mai', 'momo', 'noritoshi', 'miwa'], L('Istituto di Kyoto', 'Kyoto school')),
            0,
            { eventId: 'evt-jjk-baseball' },
          ),
        ],
      },
    ],
    outcome: L('Vince Tokyo.', 'Tokyo wins.'),
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['goodwill', 'kyoto'],
  },
];
