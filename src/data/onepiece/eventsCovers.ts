import type { TimelineEvent } from '@/types';

/**
 * Le «cover story» di One Piece: le mini-storie disegnate da Oda sulle copertine
 * dei capitoli, che seguono i comprimari tra un arco e l'altro. Sono canoniche e
 * arricchiscono la timeline (la cover story di Enel — la Luna — sta in `eventsSpace`).
 */
const V = (
  id: string, tit: string, ten: string, sit: string, sen: string,
  lit: string, len: string, loc: string, chars: string[], manga: string,
  order: number, tags: string[], arcId?: string,
): TimelineEvent => ({
  id, worldId: 'world-onepiece',
  title: { it: tit, en: ten },
  description: { it: sit, en: sen },
  longDescription: { it: lit, en: len },
  period: { it: 'Cover story', en: 'Cover story' },
  ...(arcId ? { arcId } : {}),
  locationId: loc, characterIds: chars,
  mangaChapters: [manga], order,
  canon: 'canon', canonStatus: 'canon', referenceStatus: 'verified',
  tags: ['cover-story', ...tags],
});

export const onepieceEventsCovers: TimelineEvent[] = [
  V('evt-op-cover-buggy', 'La Grande Avventura della Ciurma di Bagy', "Buggy's Crew's Great Adventure",
    "Dispersa dopo Loguetown, la ciurma di Bagy dà la caccia al tesoro del Capitano John.",
    "Scattered after Loguetown, Buggy's crew hunts for Captain John's treasure.",
    "Bagy, Alvida e i loro uomini inseguono la mappa del tesoro del leggendario Capitano John, tra litigi e sventure comiche; la cover story prepara le future, fortunate ricomparse del pagliaccio.",
    "Buggy, Alvida and their men chase the treasure map of the legendary Captain John, amid quarrels and comic mishaps; the cover story sets up the clown's future, fortunate reappearances.",
    'loc-op-loguetown', ['char-op-buggy', 'char-op-alvida'], 'copertine 132-176', 13.0, ['bagy', 'alvida']),

  V('evt-op-cover-kobymeppo', 'Diario di Koby e Helmeppo', 'The Diary of Koby-Meppo',
    "Coby e Helmeppo si addestrano nella Marina sotto il duro Garp, crescendo da mozzi a soldati.",
    "Coby and Helmeppo train in the Marines under the harsh Garp, growing from chore-boys to soldiers.",
    "Arruolati come mozzi, Coby e Helmeppo subiscono l'addestramento brutale di Garp; entrano nell'unità d'élite Sword e maturano fino a meritarsi un posto in prima linea — fino a Marineford.",
    "Enlisted as chore-boys, Coby and Helmeppo endure Garp's brutal training; they join the elite Sword unit and grow until they earn a frontline place — all the way to Marineford.",
    'loc-op-marineford', ['char-op-coby', 'char-op-helmeppo', 'char-op-garp'], 'copertine 133-185', 13.1, ['coby', 'marina']),

  V('evt-op-cover-wapol', 'L’Onnivoro Hurrà di Wapol', "Wapol's Omnivorous Hurrah",
    "Spazzato via da Drum, Wapol approda altrove e, inventando giocattoli, diventa ricco e re.",
    "Blasted off Drum, Wapol washes ashore and, inventing toys, grows rich and becomes a king.",
    "Con il suo Frutto Mangia-tutto, Wapol fabbrica giocattoli di successo, fonda un nuovo regno e sposa una reginetta di bellezza: la rivincita grottesca del tiranno cacciato da Drum.",
    "With his eat-everything fruit, Wapol manufactures hit toys, founds a new kingdom and marries a beauty queen: the grotesque comeback of the tyrant driven out of Drum.",
    'loc-op-drum-island', ['char-op-wapol'], 'copertine 304-339', 12.8, ['wapol', 'drum']),

  V('evt-op-cover-jango', 'Il Dance Paradise di Jango', "Jango's Dance Paradise",
    "L’ex ipnotizzatore Jango, ora in Marina, gira con Fullbody sotto il comando del capitano Hina.",
    "The former hypnotist Jango, now a Marine, roams with Fullbody under Captain Hina's command.",
    "Passato dalla parte della legge, Jango porta scompiglio (e balli) tra le file della Marina insieme a Fullbody, sotto lo sguardo severo di Hina; una catena di comparse che intreccia vecchi volti di East Blue.",
    "Having crossed to the side of the law, Jango brings chaos (and dancing) to the Marine ranks alongside Fullbody, under Hina's stern eye; a chain of cameos weaving together old East Blue faces.",
    'loc-op-loguetown', ['char-op-jango', 'char-op-fullbody', 'char-op-hina'], 'copertine 196-302', 16.5, ['jango', 'marina']),

  V('evt-op-cover-gedatsu', 'Il Tour Marino Accidentale di Gedatsu', "Gedatsu's Accidental Blue-Sea Tour",
    "Lo svagato sacerdote Gedatsu precipita da Skypiea al Mare Blu e ne scopre le meraviglie.",
    "The absent-minded priest Gedatsu falls from Skypiea to the Blue Sea and discovers its wonders.",
    "Caduto dall'isola del cielo, Gedatsu vaga sbadato per il Mare Blu, mentre i superstiti dell'Armata di Dio si adattano alla nuova vita: il rovescio comico della saga di Skypiea.",
    "Having fallen from the sky island, the scatterbrained Gedatsu wanders the Blue Sea, while the survivors of God's Army adjust to a new life: the comic flip-side of the Skypiea saga.",
    'loc-op-skypiea', ['char-op-gedatsu'], 'copertine 326-372', 17.6, ['gedatsu', 'skypiea']),

  V('evt-op-cover-hatchan', 'La Passeggiata sui Fondali di Hatchan', "Hatchan's Sea-Floor Stroll",
    "L’uomo-pesce Hatchan apre una bancarella di takoyaki con la sirena Camie e la stella Pappag.",
    "The fish-man Hatchan opens a takoyaki stand with the mermaid Camie and the starfish Pappag.",
    "Tra i fondali e i Sabaody, Hatchan e gli amici Camie e Pappag mandano avanti il loro chiosco di polpo fritto, in una cover story che porta dritti all'incontro con la ciurma a Sabaody.",
    "Across the seabed and Sabaody, Hatchan and his friends Camie and Pappag run their fried-octopus stall, in a cover story that leads straight to meeting the crew at Sabaody.",
    'loc-op-fishman-island', ['char-op-hatchan', 'char-op-camie', 'char-op-pappag'], 'copertine 309-339', 21.0, ['hatchan', 'sabaody']),

  V('evt-op-cover-goldenweek', 'Operazione «Ritrovo della Baroque Works»', "Miss Goldenweek's 'Operation: Meet Baroque Works Again'",
    "Miss Goldenweek riunisce gli ex agenti superstiti della Baroque Works per un’ultima impresa.",
    "Miss Goldenweek gathers the surviving former Baroque Works agents for one last caper.",
    "Con la sua tavolozza che manipola gli animi, Miss Goldenweek libera e ricompatta i vecchi agenti — tra cui Mr. 3, Mr. 5 e Miss Valentine — in una scanzonata reunion della disciolta organizzazione di Crocodile.",
    "With her mood-bending palette, Miss Goldenweek frees and reunites the old agents — among them Mr. 3, Mr. 5 and Miss Valentine — in a lighthearted reunion of Crocodile's disbanded organization.",
    'loc-op-alabasta', ['char-op-miss-goldenweek', 'char-op-mr-3', 'char-op-mr-5', 'char-op-miss-valentine'], 'copertine 357-397', 19.0, ['baroque-works']),

  V('evt-op-cover-cp9', 'Rapporto Indipendente della CP9', "CP9's Independent Report",
    "Dopo Enies Lobby, gli agenti della CP9 sopravvivono, si riprendono e regolano i conti con Spandam.",
    "After Enies Lobby, the CP9 agents survive, recover and settle the score with Spandam.",
    "Feriti e radiati dopo la disfatta di Enies Lobby, Rob Lucci, Kaku, Kalifa e Jabra si rimettono in piedi, si vendicano del codardo Spandam e tornano in libertà — pronti a riemergere anni dopo nella CP0.",
    "Wounded and cast out after the Enies Lobby debacle, Rob Lucci, Kaku, Kalifa and Jabra get back on their feet, take revenge on the cowardly Spandam and walk free — ready to resurface years later in CP0.",
    'loc-op-water-seven', ['char-op-lucci', 'char-op-kaku', 'char-op-kalifa', 'char-op-jabra', 'char-op-spandam'], 'copertine 491-503', 26.5, ['cp9', 'cp0']),

  V('evt-op-cover-caribou', 'Il Kehihihi di Caribou nel Nuovo Mondo', "Caribou's Kehihihihi in the New World",
    "Lo «sgocciolante» Caribou inanella disavventure tra le isole e le ciurme del Nuovo Mondo.",
    "The 'wet-haired' Caribou stumbles through misadventures among the New World's islands and crews.",
    "Sopravvissuto a Fish-Man Island, Caribou tenta di prosperare nel Nuovo Mondo ma finisce sempre nei guai, incrociando marine e pirati ben più forti di lui: una comica galleria del mare più pericoloso.",
    "Having survived Fish-Man Island, Caribou tries to thrive in the New World but always lands in trouble, crossing Marines and pirates far stronger than he is: a comic tour of the most dangerous sea.",
    'loc-op-fishman-island', ['char-op-caribou'], 'copertine 654-699', 60.5, ['caribou', 'nuovo-mondo']),

  V('evt-op-cover-grandfleet', 'Le Storie della Flotta dei Cappello di Paglia', 'The Stories of the Self-Proclaimed Straw Hat Grand Fleet',
    "Le sette ciurme della Grand Fleet aiutano la gente nel nome di Rufy, nei mari del mondo.",
    "The seven crews of the Grand Fleet help people in Luffy's name across the world's seas.",
    "Dopo Dressrosa, Cavendish, Bartolomeo, Sai, Leo, Ideo, Hajrudin e Orlumbus seminano gesta eroiche (e comiche) ovunque, alimentando la leggenda dei Cappello di Paglia pur conservando la propria indipendenza.",
    "After Dressrosa, Cavendish, Bartolomeo, Sai, Leo, Ideo, Hajrudin and Orlumbus spread heroic (and comic) deeds everywhere, fueling the Straw Hats' legend while keeping their independence.",
    'loc-op-dressrosa', ['char-op-cavendish', 'char-op-bartolomeo', 'char-op-sai', 'char-op-leo', 'char-op-ideo', 'char-op-hajrudin', 'char-op-orlumbus'], 'copertine 795-801', 63.8, ['grand-fleet', 'dressrosa']),

  V('evt-op-cover-reverie', 'Dai Ponti del Mondo (verso la Reverie)', 'From the Decks of the World',
    "Mentre re e principi salpano per la Reverie a Mary Geoise, il mondo intero si mette in moto.",
    "As kings and princes set sail for the Reverie at Mary Geoise, the whole world stirs.",
    "La cover story segue i sovrani diretti alla Reverie — Vivi e Cobra di Alabasta, la famiglia Riku di Dressrosa — e i tanti volti del mondo: i Rivoluzionari di Sabo, Wapol in disgrazia, Bartolomeo e Bellamy. Un grande affresco che prepara lo storico Consiglio dei Re.",
    "The cover story follows the rulers bound for the Reverie — Vivi and Cobra of Alabasta, the Riku family of Dressrosa — and the world's many faces: Sabo's Revolutionaries, a disgraced Wapol, Bartolomeo and Bellamy. A grand fresco setting up the historic Council of Kings.",
    'loc-op-mary-geoise', ['char-op-vivi', 'char-op-cobra', 'char-op-sabo', 'char-op-wapol', 'char-op-rebecca', 'char-op-kyros', 'char-op-bartolomeo', 'char-op-bellamy'], 'copertine 904-908', 69.5, ['reverie', 'mary-geoise']),
];
