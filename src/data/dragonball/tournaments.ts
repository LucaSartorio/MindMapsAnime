import type { Character, Localizable, Tournament, TournamentMatch, TournamentSide } from '@/types';

/**
 * Tornei di Dragon Ball con il loro tabellone. Si vedono nella scheda del
 * luogo che li ospita (il ring di Papaya per i Tenkaichi Budokai, l'arena dei
 * Cell Game, il Pianeta senza nome, l'arena del Torneo del Potere…) e nella
 * scheda del pin che apre la sotto-mappa.
 *
 * Partecipanti senza una scheda propria: i combattenti minori sono aggiunti in
 * `dragonballTournamentFighters`; gli pseudonimi (Jackie Chun, Shen, Ma Junior,
 * Mighty Mask) sono un'etichetta sul lato, con il personaggio vero collegato.
 */

const t = (o: Omit<Tournament, 'worldId' | 'canonStatus' | 'referenceStatus'> & Partial<Pick<Tournament, 'canonStatus' | 'referenceStatus'>>): Tournament => ({
  worldId: 'world-dragonball',
  canonStatus: 'canon',
  referenceStatus: 'verified',
  ...o,
});

const C = (id: string) => `char-dbz-${id}`;
/** Un lato: uno o più personaggi, con un'etichetta facoltativa (pseudonimo, squadra). */
const s = (ids: string | string[], label?: Localizable): TournamentSide => ({
  characterIds: (Array.isArray(ids) ? ids : [ids]).map(C),
  ...(label ? { label } : {}),
});
const m = (a: TournamentSide, b: TournamentSide, winner?: 0 | 1, extra?: Partial<TournamentMatch>): TournamentMatch => ({
  sides: [a, b],
  ...(winner !== undefined ? { winner } : {}),
  ...extra,
});
const L = (it: string, en = it): Localizable => ({ it, en });

const JACKIE = L('Jackie Chun');
const SHEN = L('Shen');
const MA_JUNIOR = L('Ma Junior');
const MIGHTY_MASK = L('Mighty Mask');
const QF = L('Quarti di finale', 'Quarterfinals');
const SF = L('Semifinali', 'Semifinals');
const FINAL = L('Finale', 'Final');

export const dragonballTournaments: Tournament[] = [
  t({
    id: 'tourn-dbz-21st-budokai',
    name: '21st World Martial Arts Tournament',
    localizedName: L('21° Torneo Tenkaichi', '21st World Martial Arts Tournament'),
    locationId: 'loc-dbz-pp-ring',
    arcId: 'arc-dbz-tenkaichi-tournament',
    order: 21,
    format: 'bracket',
    description: L(
      "Il primo torneo di Goku e Crilin, dopo otto mesi di allenamento con il Genio delle Tartarughe. Il Genio partecipa travestito da «Jackie Chun» per impedire che i suoi allievi vincano troppo presto e si montino la testa: batte Goku in finale per un soffio.",
      "Goku and Krillin's first tournament, after eight months of training with Master Roshi. Roshi enters disguised as 'Jackie Chun' to stop his pupils from winning too soon and getting big-headed: he beats Goku in the final by a hair.",
    ),
    rounds: [
      {
        name: QF,
        matches: [
          m(s('master-roshi', JACKIE), s('yamcha'), 0),
          m(s('nam'), s('ranfan'), 0),
          m(s('krillin'), s('bacterian'), 0, { note: L('Crilin non ha il naso: la puzza di Bacterian non lo tocca.', "Krillin has no nose: Bacterian's stench can't touch him.") }),
          m(s('goku'), s('giran'), 0),
        ],
      },
      {
        name: SF,
        matches: [m(s('master-roshi', JACKIE), s('nam'), 0), m(s('krillin'), s('goku'), 1)],
      },
      {
        name: FINAL,
        matches: [
          m(s('master-roshi', JACKIE), s('goku'), 0, { eventId: 'evt-dbz-goku-vs-jackie-chun' }),
        ],
      },
    ],
    winnerIds: [C('master-roshi')],
    mangaChapters: ['~33-54'],
    animeEpisodes: ['DB ep. ~19-28'],
    tags: ['tenkaichi'],
  }),
  t({
    id: 'tourn-dbz-22nd-budokai',
    name: '22nd World Martial Arts Tournament',
    localizedName: L('22° Torneo Tenkaichi', '22nd World Martial Arts Tournament'),
    locationId: 'loc-dbz-pp-ring',
    arcId: 'arc-dbz-king-piccolo',
    order: 22,
    format: 'bracket',
    description: L(
      "Tre anni dopo, la Scuola della Gru di Tensing e Jiaozi sfida quella della Tartaruga. Tensing spezza una gamba a Yamcha e batte Jackie Chun; in finale lui e Goku escono dal ring quasi insieme, ma Goku tocca terra per primo.",
      "Three years later, Tien and Chiaotzu's Crane School challenges the Turtle School. Tien breaks Yamcha's leg and beats Jackie Chun; in the final he and Goku fall out of the ring almost together, but Goku lands first.",
    ),
    rounds: [
      {
        name: QF,
        matches: [
          m(s('tenshinhan'), s('yamcha'), 0, { note: L('Tensing spezza una gamba a Yamcha.', "Tien breaks Yamcha's leg.") }),
          m(s('master-roshi', JACKIE), s('man-wolf'), 0),
          m(s('krillin'), s('chaozu'), 0),
          m(s('goku'), s('pamput'), 0),
        ],
      },
      {
        name: SF,
        matches: [m(s('tenshinhan'), s('master-roshi', JACKIE), 0), m(s('krillin'), s('goku'), 1)],
      },
      {
        name: FINAL,
        matches: [
          m(s('tenshinhan'), s('goku'), 0, {
            eventId: 'evt-dbz-goku-vs-tenshinhan',
            note: L('Entrambi cadono fuori dal ring: Goku tocca terra un istante prima.', 'Both fall out of the ring: Goku lands a moment earlier.'),
          }),
        ],
      },
    ],
    winnerIds: [C('tenshinhan')],
    mangaChapters: ['~113-134'],
    animeEpisodes: ['DB ep. ~84-101'],
    tags: ['tenkaichi'],
  }),
  t({
    id: 'tourn-dbz-23rd-budokai',
    name: '23rd World Martial Arts Tournament',
    localizedName: L('23° Torneo Tenkaichi', '23rd World Martial Arts Tournament'),
    locationId: 'loc-dbz-pp-ring',
    arcId: 'arc-dbz-piccolo-jr',
    order: 23,
    format: 'bracket',
    description: L(
      "Dopo tre anni di allenamento con il Supremo, Goku torna al torneo, dove si iscrivono anche il Supremo stesso sotto il nome di Shen e il figlio del Grande Mago Piccolo, Ma Junior. Goku sposa Chichi dopo averla battuta e vince la finale contro Piccolo.",
      "After three years of training with Kami, Goku returns to the tournament, where Kami himself enters as 'Shen' along with King Piccolo's son, Ma Junior. Goku agrees to marry Chi-Chi after beating her and wins the final against Piccolo.",
    ),
    rounds: [
      {
        name: QF,
        matches: [
          m(s('goku'), s('chichi'), 0, { note: L('Goku promette di sposarla.', 'Goku promises to marry her.') }),
          m(s('tenshinhan'), s('tao-pai-pai', L('Mercenario Tao', 'Mercenary Tao')), 0),
          m(s('kami', SHEN), s('yamcha'), 0),
          m(s('piccolo', MA_JUNIOR), s('krillin'), 0),
        ],
      },
      {
        name: SF,
        matches: [
          m(s('goku'), s('tenshinhan'), 0),
          m(s('piccolo', MA_JUNIOR), s('kami', SHEN), 0, {
            note: L('Il Supremo tenta di sigillare Piccolo, ma finisce lui stesso intrappolato.', 'Kami tries to seal Piccolo away but ends up trapped himself.'),
          }),
        ],
      },
      {
        name: FINAL,
        matches: [m(s('goku'), s('piccolo', MA_JUNIOR), 0, { eventId: 'evt-dbz-piccolo-jr-tournament' })],
      },
    ],
    winnerIds: [C('goku')],
    mangaChapters: ['~165-194'],
    animeEpisodes: ['DB ep. ~133-153'],
    tags: ['tenkaichi'],
  }),
  t({
    id: 'tourn-dbz-cell-games',
    name: 'Cell Games',
    localizedName: L('Cell Game', 'Cell Games'),
    locationId: 'loc-dbz-cell-games-arena',
    arcId: 'arc-dbz-cell-saga',
    order: 24,
    format: 'rounds',
    description: L(
      "Il torneo indetto da Cell perfetto su un ring costruito da lui stesso: chiunque può sfidarlo, uno alla volta, e se nessuno lo batte distruggerà la Terra. Mr. Satan viene spazzato via, Goku si arrende e designa Gohan, che risveglia il Super Saiyan 2 e vince.",
      "The tournament Perfect Cell announces on a ring he built himself: anyone may challenge him, one at a time, and if no one beats him he will destroy the Earth. Mr. Satan is swatted away, Goku gives up and names Gohan, who awakens Super Saiyan 2 and wins.",
    ),
    rounds: [
      {
        name: L('Gli sfidanti', 'The challengers'),
        matches: [
          m(s('mr-satan'), s('cell'), 1, { note: L('Cell lo scaglia contro una montagna con uno schiaffo.', 'Cell slaps him into a mountainside.') }),
          m(s('goku'), s('cell'), undefined, { eventId: 'evt-dbz-goku-vs-perfect-cell', note: L('Goku si arrende e lascia il posto a Gohan.', 'Goku gives up and hands over to Gohan.') }),
          m(s('gohan'), s('cell'), 0, { eventId: 'evt-dbz-gohan-defeats-cell', note: L('La Kamehameha padre-figlio.', 'The father-son Kamehameha.') }),
        ],
      },
    ],
    winnerIds: [C('gohan')],
    outcome: L('Il mondo, però, attribuisce la vittoria a Mr. Satan.', 'The world, however, credits Mr. Satan with the victory.'),
    mangaChapters: ['~388-420'],
    animeEpisodes: ['DBZ ep. 166-194'],
    tags: ['cell'],
  }),
  t({
    id: 'tourn-dbz-25th-budokai',
    name: '25th World Martial Arts Tournament',
    localizedName: L('25° Torneo Tenkaichi', '25th World Martial Arts Tournament'),
    locationId: 'loc-dbz-pp-ring',
    arcId: 'arc-dbz-majin-buu',
    order: 25,
    format: 'rounds',
    description: L(
      "Il torneo a cui Goku partecipa per un giorno dall'Aldilà. Nel torneo dei ragazzi Trunks batte Goten; in quello degli adulti si presentano il Supremo Kaioh e Kibito, Gohan nei panni del Great Saiyaman e i seguaci di Babidi, che sottraggono l'energia a Gohan e fanno saltare il torneo. Rimasti in pochi, C-18 lascia vincere Mr. Satan in cambio di denaro.",
      "The tournament Goku attends for one day from the Other World. In the junior division Trunks beats Goten; the adult division sees the Supreme Kai and Kibito, Gohan as the Great Saiyaman and Babidi's minions, who drain Gohan's energy and derail the tournament. With few left, Android 18 lets Mr. Satan win in exchange for money.",
    ),
    rounds: [
      {
        name: L('Torneo dei ragazzi · finale', 'Junior division · final'),
        matches: [m(s('trunks'), s('goten'), 0), m(s('trunks'), s('mr-satan'), 0, { note: L('Incontro di esibizione contro il campione.', 'Exhibition match against the champion.') })],
      },
      {
        name: L('Torneo degli adulti · primo turno', 'Adult division · first round'),
        matches: [
          m(s('krillin'), s('pintar'), 0),
          m(s('supreme-kai'), s('piccolo'), 0, { note: L('Piccolo si ritira, intimorito dal Supremo Kaioh.', 'Piccolo withdraws, intimidated by the Supreme Kai.') }),
          m(s('videl'), s('spopovich'), 1),
          m(s('kibito'), s('gohan'), undefined, { eventId: 'evt-dbz-gohan-drained', note: L('Interrotto: Spopovich e Yamu sottraggono l’energia a Gohan.', 'Interrupted: Spopovich and Yamu drain Gohan’s energy.') }),
          m(s('android-18'), s(['goten', 'trunks'], MIGHTY_MASK), 0, { note: L('Smascherati, Goten e Trunks vengono squalificati.', 'Unmasked, Goten and Trunks are disqualified.') }),
        ],
      },
      {
        name: FINAL,
        matches: [m(s('android-18'), s('mr-satan'), 1, { note: L('C-18 si lascia battere in cambio di un compenso.', 'Android 18 lets herself be beaten for a fee.') })],
      },
    ],
    winnerIds: [C('mr-satan')],
    mangaChapters: ['~429-447'],
    animeEpisodes: ['DBZ ep. 202-215'],
    referenceStatus: 'needs_verification',
    tags: ['tenkaichi'],
  }),
  t({
    id: 'tourn-dbz-other-world-tournament',
    name: 'Other World Tournament',
    localizedName: L("Torneo dell'Aldilà", 'Other World Tournament'),
    locationId: 'loc-dbz-ow-grand-kai',
    arcId: 'arc-dbz-filler-other-world-tournament',
    order: 26,
    format: 'rounds',
    description: L(
      "Torneo dell'anime organizzato dal Gran Kaioh fra i guerrieri morti dei quattro quadranti. In finale Goku affronta Pikkon: durante lo scontro entrambi toccano il soffitto della cupola, una regola vietata, e vengono squalificati.",
      "Anime-original tournament hosted by Grand Kai among the dead warriors of the four quadrants. In the final Goku faces Pikkon: during the fight both touch the dome's ceiling, which the rules forbid, and both are disqualified.",
    ),
    rounds: [
      {
        name: FINAL,
        matches: [m(s('goku'), s('pikkon'), undefined, { eventId: 'evt-dbz-filler-other-world-tournament', note: L('Entrambi squalificati.', 'Both disqualified.') })],
      },
    ],
    outcome: L('Nessun vincitore: Goku e Pikkon sono squalificati.', 'No winner: Goku and Pikkon are disqualified.'),
    animeEpisodes: ['DBZ ep. ~195-199 (filler)'],
    canonStatus: 'filler',
    tags: ['aldila', 'filler'],
  }),
  t({
    id: 'tourn-dbz-28th-budokai',
    name: '28th World Martial Arts Tournament',
    localizedName: L('28° Torneo Tenkaichi', '28th World Martial Arts Tournament'),
    locationId: 'loc-dbz-pp-ring',
    arcId: 'arc-dbz-majin-buu',
    order: 28,
    format: 'rounds',
    description: L(
      "Dieci anni dopo la sconfitta di Kid Bu, Goku si iscrive per incontrare Uub, la reincarnazione buona di Majin Bu. Lo provoca finché il ragazzo non mostra il suo vero potenziale, poi lascia il torneo per portarlo con sé ad allenarsi.",
      "Ten years after Kid Buu's defeat, Goku enters to meet Uub, Majin Buu's good reincarnation. He goads him until the boy shows his true potential, then leaves the tournament to take him away for training.",
    ),
    rounds: [
      {
        name: L('Primo turno', 'First round'),
        matches: [m(s('goku'), s('gt-majuub'), undefined, { eventId: 'evt-dbz-28th-tournament', note: L('Goku abbandona il torneo con Uub.', 'Goku leaves the tournament with Uub.') })],
      },
    ],
    outcome: L('Il torneo prosegue senza di loro: la serie si chiude con la partenza di Goku e Uub.', 'The tournament goes on without them: the series ends with Goku and Uub leaving.'),
    mangaChapters: ['517-519'],
    animeEpisodes: ['DBZ ep. 288-291'],
    tags: ['tenkaichi'],
  }),
  t({
    id: 'tourn-dbz-universe-6-vs-7',
    name: 'Universe 6 vs Universe 7 Tournament',
    localizedName: L('Torneo fra Universo 6 e Universo 7', 'Universe 6 vs Universe 7 Tournament'),
    locationId: 'loc-dbz-nameless-planet',
    arcId: 'arc-dbz-universe-6',
    order: 30,
    format: 'rounds',
    description: L(
      "Bills e Champa, i Dei della Distruzione gemelli, si sfidano con cinque guerrieri per parte; il premio sono le Super Sfere del Drago. Gli incontri sono a eliminazione: chi vince resta sul ring contro il lottatore successivo.",
      "Beerus and Champa, the twin Gods of Destruction, face off with five warriors each; the prize is the Super Dragon Balls. Matches are knockout: the winner stays in the ring against the next fighter.",
    ),
    rounds: [
      {
        name: L('Gli incontri', 'The matches'),
        matches: [
          m(s('goku'), s('botamo'), 0, { note: L('Botamo è immune ai colpi: Goku lo butta fuori dal ring.', 'Botamo is immune to blows: Goku throws him out of the ring.') }),
          m(s('goku'), s('frost'), 1, { eventId: 'evt-dbz-goku-vs-frost', note: L('Frost bara con un ago avvelenato.', 'Frost cheats with a poisoned needle.') }),
          m(s('piccolo'), s('frost'), 1, { note: L('Altro ago avvelenato: Frost viene poi smascherato.', 'Another poisoned needle: Frost is then exposed.') }),
          m(s('vegeta'), s('frost'), 0),
          m(s('vegeta'), s('magetta'), 0),
          m(s('vegeta'), s('cabba'), 0, { eventId: 'evt-dbz-vegeta-vs-cabba', note: L('Vegeta spinge Cabba a diventare Super Saiyan.', 'Vegeta pushes Cabba to become a Super Saiyan.') }),
          m(s('vegeta'), s('hit'), 1),
          m(s('goku'), s('hit'), 1, { eventId: 'evt-dbz-goku-vs-hit', note: L('Goku esce dal ring di sua volontà.', 'Goku steps out of the ring of his own accord.') }),
          m(s('monaka'), s('hit'), 0, { eventId: 'evt-dbz-universe-6-tournament-end', note: L('Hit si lascia spingere fuori dal ring dal debole pugno di Monaka.', "Hit lets Monaka's weak punch push him out of the ring.") }),
        ],
      },
    ],
    outcome: L("Vince l'Universo 7.", 'Universe 7 wins.'),
    animeEpisodes: ['DBS ep. 28-46'],
    mangaChapters: ['DBS ch. 15-18'],
    tags: ['super', 'universo-6'],
  }),
  t({
    id: 'tourn-dbz-tournament-of-power',
    name: 'Tournament of Power',
    localizedName: L('Torneo del Potere', 'Tournament of Power'),
    locationId: 'loc-dbz-tournament-arena',
    arcId: 'arc-dbz-tournament-of-power',
    order: 31,
    format: 'rounds',
    description: L(
      "Battaglia reale di 48 minuti fra dieci guerrieri per ciascuno degli otto universi più deboli, voluta da Zeno: gli universi sconfitti vengono cancellati. Si viene eliminati cadendo dal ring, senza uccidere.",
      "A 48-minute battle royale between ten warriors from each of the eight weakest universes, called by Zeno: the losing universes are erased. Fighters are eliminated by falling off the ring, with no killing allowed.",
    ),
    rounds: [
      {
        name: L('Scontri decisivi', 'Decisive clashes'),
        matches: [
          m(s('goku'), s('kefla'), 0, { eventId: 'evt-dbz-goku-vs-kefla' }),
          m(s('vegeta'), s('toppo'), 0, { eventId: 'evt-dbz-vegeta-vs-toppo' }),
          {
            sides: [s(['goku', 'frieza', 'android-17']), s('jiren')],
            eventId: 'evt-dbz-goku-frieza-17-vs-jiren',
            note: L('Goku e Freezer cadono dal ring trascinando con sé Jiren; C-17 resta l’ultimo in piedi.', 'Goku and Frieza fall off the ring taking Jiren with them; Android 17 is the last one standing.'),
          },
        ],
      },
    ],
    winnerIds: [C('android-17')],
    outcome: L("Vince l'Universo 7: C-17 usa le Super Sfere per riportare indietro gli universi cancellati.", 'Universe 7 wins: Android 17 uses the Super Dragon Balls to bring back the erased universes.'),
    animeEpisodes: ['DBS ep. 97-131'],
    referenceStatus: 'needs_verification',
    tags: ['super', 'torneo-del-potere'],
  }),
];

const fighter = (c: Omit<Character, 'worldId' | 'status' | 'canonStatus' | 'referenceStatus' | 'importance' | 'role'> & Partial<Pick<Character, 'status' | 'importance'>>): Character => ({
  worldId: 'world-dragonball',
  status: 'alive',
  canonStatus: 'canon',
  referenceStatus: 'verified',
  importance: 'minor',
  role: ['supporting'],
  ...c,
});

/** Combattenti dei tornei che non avevano una scheda. */
export const dragonballTournamentFighters: Character[] = [
  fighter({
    id: C('bacterian'),
    name: 'Bacterian',
    japaneseName: 'バクテリアン',
    arcIds: ['arc-dbz-tenkaichi-tournament'],
    locationIds: ['loc-dbz-pp-ring'],
    shortDescription: L(
      "Un lottatore che non si lava da anni e stordisce gli avversari con la sua puzza. Al 21° Torneo Tenkaichi affronta Crilin, che non avendo il naso non ne risente e lo batte.",
      "A fighter who hasn't washed in years and stuns opponents with his stench. At the 21st World Martial Arts Tournament he faces Krillin, who, having no nose, is unaffected and beats him.",
    ),
    tags: ['tenkaichi'],
  }),
  fighter({
    id: C('ranfan'),
    name: 'Ranfan',
    japaneseName: 'ランファン',
    gender: 'F',
    arcIds: ['arc-dbz-tenkaichi-tournament'],
    locationIds: ['loc-dbz-pp-ring'],
    shortDescription: L(
      "Lottatrice del 21° Torneo Tenkaichi che cerca di distrarre gli avversari spogliandosi. Nam non si lascia distrarre e la batte.",
      "A fighter at the 21st World Martial Arts Tournament who tries to distract opponents by undressing. Nam is not distracted and beats her.",
    ),
    tags: ['tenkaichi'],
  }),
  fighter({
    id: C('giran'),
    name: 'Giran',
    japaneseName: 'ギラン',
    race: 'monster',
    arcIds: ['arc-dbz-tenkaichi-tournament'],
    locationIds: ['loc-dbz-pp-ring'],
    shortDescription: L(
      "Un mostro alato del 21° Torneo Tenkaichi che immobilizza gli avversari con una gomma sputata dalla bocca. Goku si libera e lo butta fuori dal ring afferrandolo con la coda.",
      "A winged monster at the 21st World Martial Arts Tournament who traps opponents with gum spat from his mouth. Goku breaks free and throws him out of the ring by grabbing him with his tail.",
    ),
    tags: ['tenkaichi'],
  }),
  fighter({
    id: C('nam'),
    name: 'Nam',
    japaneseName: 'ナム',
    arcIds: ['arc-dbz-tenkaichi-tournament'],
    locationIds: ['loc-dbz-pp-ring', 'loc-dbz-nams-village'],
    shortDescription: L(
      "Un guerriero che partecipa al 21° Torneo Tenkaichi per vincere il premio e comprare l'acqua per il suo villaggio, colpito dalla siccità. Batte Ranfan ma perde in semifinale contro Jackie Chun.",
      "A warrior who enters the 21st World Martial Arts Tournament to win the prize money and buy water for his drought-stricken village. He beats Ranfan but loses the semifinal to Jackie Chun.",
    ),
    tags: ['tenkaichi'],
  }),
  fighter({
    id: C('man-wolf'),
    name: 'Man-Wolf',
    japaneseName: 'オオカミ男',
    localizedName: L('Uomo Lupo', 'Man-Wolf'),
    arcIds: ['arc-dbz-king-piccolo'],
    locationIds: ['loc-dbz-pp-ring'],
    shortDescription: L(
      "Un lottatore uomo-lupo che ai quarti del 22° Torneo Tenkaichi affronta Jackie Chun, il Genio delle Tartarughe travestito, e viene sconfitto.",
      "A werewolf fighter who faces Jackie Chun, Master Roshi in disguise, in the 22nd World Martial Arts Tournament quarterfinals and is defeated.",
    ),
    tags: ['tenkaichi'],
  }),
  fighter({
    id: C('pamput'),
    name: 'Pamput',
    japaneseName: 'パンプット',
    arcIds: ['arc-dbz-king-piccolo'],
    locationIds: ['loc-dbz-pp-ring'],
    shortDescription: L(
      "Celebre lottatore e star del cinema d'azione, favorito del pubblico al 22° Torneo Tenkaichi. Goku lo mette fuori combattimento con un solo colpo.",
      "A famous fighter and action-film star, the crowd's favourite at the 22nd World Martial Arts Tournament. Goku knocks him out with a single blow.",
    ),
    tags: ['tenkaichi'],
  }),
  fighter({
    id: C('pintar'),
    name: 'Pintar',
    japaneseName: 'ピンター',
    arcIds: ['arc-dbz-majin-buu'],
    locationIds: ['loc-dbz-pp-ring'],
    shortDescription: L(
      "Un lottatore muscoloso e spaccone che apre il torneo degli adulti al 25° Torneo Tenkaichi contro Crilin, che lo batte in un istante.",
      "A muscular, boastful fighter who opens the adult division of the 25th World Martial Arts Tournament against Krillin, who beats him in an instant.",
    ),
    tags: ['tenkaichi'],
  }),
  fighter({
    id: C('botamo'),
    name: 'Botamo',
    japaneseName: 'ボタモ',
    arcIds: ['arc-dbz-universe-6'],
    locationIds: ['loc-dbz-nameless-planet'],
    shortDescription: L(
      "Guerriero dell'Universo 6 dall'aspetto di orso, immune a qualunque colpo. Primo avversario di Goku nel torneo fra Universo 6 e 7: Goku lo vince sollevandolo e scagliandolo fuori dal ring.",
      "A bear-like Universe 6 warrior immune to any blow. Goku's first opponent in the Universe 6 vs 7 tournament: Goku beats him by lifting him and hurling him out of the ring.",
    ),
    tags: ['universo-6'],
  }),
  fighter({
    id: C('magetta'),
    name: 'Magetta',
    japaneseName: 'マゲッタ',
    arcIds: ['arc-dbz-universe-6'],
    locationIds: ['loc-dbz-nameless-planet'],
    shortDescription: L(
      "Guerriero metallico dell'Universo 6 che sputa magma, fortissimo ma sensibile agli insulti. Vegeta lo batte nel torneo fra Universo 6 e 7.",
      "A metallic Universe 6 warrior who spits magma, very strong but sensitive to insults. Vegeta beats him in the Universe 6 vs 7 tournament.",
    ),
    tags: ['universo-6'],
  }),
  fighter({
    id: C('monaka'),
    name: 'Monaka',
    japaneseName: 'モナカ',
    arcIds: ['arc-dbz-universe-6'],
    locationIds: ['loc-dbz-nameless-planet'],
    shortDescription: L(
      "Il «guerriero più forte dell'Universo 7» secondo Bills, che in realtà è un fattorino debolissimo. Nell'ultimo incontro del torneo fra Universo 6 e 7 Hit si lascia buttare fuori dal ring dal suo pugno.",
      "The 'strongest warrior in Universe 7' according to Beerus, who is actually a very weak delivery man. In the last match of the Universe 6 vs 7 tournament Hit lets himself be knocked out of the ring by his punch.",
    ),
    tags: ['universo-7'],
  }),
];
