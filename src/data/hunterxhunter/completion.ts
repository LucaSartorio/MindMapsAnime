import type { Character, Faction, Location, TimelineEvent } from '@/types';

/**
 * Hunter x Hunter — completamento del dataset.
 *
 * - Luoghi delle quattro nuove sotto-mappe (Yorknew, Whale Island, NGL,
 *   Black Whale 1) disegnate da scripts/mapgen/hxh.py: le coordinate x/y sono
 *   riscritte dallo script (apply_pins), non vanno editate a mano.
 * - Personaggi canonici mancanti (Izunavi, i Kiriko, Sarasa, la squadra di
 *   Kite) e la Brigata «del film» (Omokage, `canonStatus: 'movie'`).
 * - Fazioni mancanti (maggiordomi Zoldyck, Shingen-ryu, Game Master di Greed
 *   Island, squadra di Kite).
 * - Eventi mancanti: le origini di Gon a Whale Island, le guide Kiriko, la
 *   scatola di Ging, l'apprendistato di Kurapika, Yorknew, le origini della
 *   Brigata a Meteor City e lo scontro Hisoka–Chrollo.
 */

const W = 'world-hunterxhunter';

/* ============================================================== LUOGHI */

type LocIn = Omit<Location, 'worldId' | 'canonStatus' | 'referenceStatus'> &
  Partial<Pick<Location, 'referenceStatus'>>;
const loc = (l: LocIn): Location => ({ worldId: W, canonStatus: 'canon', referenceStatus: 'verified', ...l });

export const hxhCompletionLocations: Location[] = [
  /* ===================== YORKNEW CITY ===================== */
  loc({
    id: 'loc-hxh-yk-cemetery-building',
    mapLevelId: 'hxh-map-yorknew',
    name: 'Cemetery Building',
    localizedName: { it: 'Cemetery Building', en: 'Cemetery Building' },
    type: 'landmark',
    x: 560,
    y: 330,
    shortDescription: {
      it: "Il grattacielo che sorge accanto a un cimitero e ospita l'asta sotterranea della mafia: la Brigata Fantasma vi massacra i partecipanti e Chrollo vi affronta Silva e Zeno Zoldyck.",
      en: 'The skyscraper standing beside a cemetery that hosts the mafia\'s underground auction: the Phantom Troupe slaughters its bidders there and Chrollo fights Silva and Zeno Zoldyck inside it.',
    },
    longDescription: {
      it: "Durante la grande asta di settembre a Yorknew, la sala sotterranea è riservata alla mafia e protetta dai Dieci Padrini. La Brigata svuota il caveau e uccide i presenti; più tardi, quando i Padrini ingaggiano gli Zoldyck, l'edificio diventa il teatro dello scontro a tre tra Chrollo, Silva e Zeno.",
      en: 'During Yorknew\'s great September auction, the underground hall is reserved for the mafia and guarded by the Ten Dons. The Troupe empties the vault and kills everyone present; later, when the Dons hire the Zoldycks, the building becomes the stage of the three-way fight between Chrollo, Silva and Zeno.',
    },
    nationId: 'nation-hxh-saherta',
    importance: 'main',
    arcIds: ['arc-hxh-yorknew-city'],
    characterIds: ['char-hxh-chrollo', 'char-hxh-silva', 'char-hxh-zeno', 'char-hxh-uvogin', 'char-hxh-nobunaga'],
    tags: ['yorknew', 'asta', 'brigata-fantasma'],
  }),
  loc({
    id: 'loc-hxh-yk-downtown',
    mapLevelId: 'hxh-map-yorknew',
    name: 'Downtown Yorknew',
    localizedName: { it: 'Centro di Yorknew', en: 'Downtown Yorknew' },
    type: 'city',
    x: 720,
    y: 500,
    shortDescription: {
      it: "Il cuore di grattacieli della metropoli. Durante un blackout sotto la pioggia, Kurapika sfrutta il diversivo di Gon e Killua e cattura Chrollo con la Catena del Giudizio.",
      en: 'The skyscraper heart of the metropolis. During a blackout in the rain, Kurapika uses Gon and Killua\'s diversion and captures Chrollo with his Judgment Chain.',
    },
    nationId: 'nation-hxh-saherta',
    importance: 'secondary',
    arcIds: ['arc-hxh-yorknew-city'],
    characterIds: ['char-hxh-kurapika', 'char-hxh-chrollo', 'char-hxh-gon', 'char-hxh-killua', 'char-hxh-leorio', 'char-hxh-melody'],
    tags: ['yorknew', 'kurapika'],
  }),
  loc({
    id: 'loc-hxh-yk-market',
    mapLevelId: 'hxh-map-yorknew',
    name: 'Yorknew Free Market',
    localizedName: { it: 'Mercato libero di Yorknew', en: 'Yorknew Free Market' },
    type: 'city',
    x: 850,
    y: 660,
    shortDescription: {
      it: "Le strade-mercato dove, durante l'asta, chiunque vende di tutto: Gon e Killua vi cercano oggetti sottovalutati per finanziare l'acquisto di Greed Island, aprono un banco di braccio di ferro e conoscono il perito Zepile.",
      en: 'The market streets where, during the auction, anyone sells anything: Gon and Killua hunt for undervalued items there to fund buying Greed Island, run an arm-wrestling stall and meet the appraiser Zepile.',
    },
    nationId: 'nation-hxh-saherta',
    importance: 'minor',
    arcIds: ['arc-hxh-yorknew-city'],
    characterIds: ['char-hxh-gon', 'char-hxh-killua', 'char-hxh-leorio', 'char-hxh-zepile'],
    tags: ['yorknew', 'mercato'],
  }),
  loc({
    id: 'loc-hxh-yk-hideout',
    mapLevelId: 'hxh-map-yorknew',
    name: 'Phantom Troupe Hideout',
    localizedName: { it: 'Covo della Brigata Fantasma', en: 'Phantom Troupe Hideout' },
    type: 'hideout',
    x: 1110,
    y: 250,
    shortDescription: {
      it: "Un edificio in rovina alla periferia di Yorknew che la Brigata usa come base: vi vengono trattenuti Gon e Killua, e qui Pakunoda trasmette i suoi ricordi ai compagni prima di morire.",
      en: 'A ruined building on the outskirts of Yorknew that the Troupe uses as its base: Gon and Killua are held there, and here Pakunoda passes her memories to her comrades before dying.',
    },
    nationId: 'nation-hxh-saherta',
    importance: 'secondary',
    arcIds: ['arc-hxh-yorknew-city'],
    characterIds: ['char-hxh-chrollo', 'char-hxh-pakunoda', 'char-hxh-nobunaga', 'char-hxh-machi', 'char-hxh-gon', 'char-hxh-killua'],
    tags: ['yorknew', 'brigata-fantasma', 'covo'],
  }),
  loc({
    id: 'loc-hxh-yk-wasteland',
    mapLevelId: 'hxh-map-yorknew',
    name: 'Yorknew Wasteland',
    localizedName: { it: 'Deserto fuori Yorknew', en: 'Yorknew Wasteland' },
    type: 'battlefield',
    x: 1250,
    y: 720,
    shortDescription: {
      it: "La distesa rocciosa oltre la città. Uvogin vi annienta i sicari della mafia; poco dopo Kurapika lo porta qui, lo affronta con la Catena Prigione e la Catena del Giudizio e lo uccide.",
      en: 'The rocky expanse beyond the city. Uvogin wipes out the mafia\'s hitmen here; soon after, Kurapika brings him here, fights him with the Chain Jail and the Judgment Chain and kills him.',
    },
    importance: 'secondary',
    arcIds: ['arc-hxh-yorknew-city'],
    characterIds: ['char-hxh-uvogin', 'char-hxh-kurapika'],
    tags: ['yorknew', 'kurapika', 'uvogin'],
  }),
  loc({
    id: 'loc-hxh-yk-airport',
    mapLevelId: 'hxh-map-yorknew',
    name: 'Lingon Airport',
    localizedName: { it: 'Aeroporto di Lingon', en: 'Lingon Airport' },
    type: 'landmark',
    x: 250,
    y: 800,
    shortDescription: {
      it: "Lo scalo per dirigibili di Yorknew dove Kurapika fissa lo scambio degli ostaggi: Chrollo, legato dalla Catena del Giudizio, contro Gon e Killua. Pakunoda vi accetta le condizioni e Chrollo lascia la città sigillato.",
      en: 'Yorknew\'s airship port where Kurapika sets the hostage exchange: Chrollo, bound by the Judgment Chain, for Gon and Killua. Pakunoda accepts the terms there and Chrollo leaves the city sealed.',
    },
    nationId: 'nation-hxh-saherta',
    importance: 'minor',
    arcIds: ['arc-hxh-yorknew-city'],
    characterIds: ['char-hxh-kurapika', 'char-hxh-chrollo', 'char-hxh-pakunoda', 'char-hxh-hisoka', 'char-hxh-gon', 'char-hxh-killua'],
    tags: ['yorknew', 'scambio'],
  }),

  /* ===================== WHALE ISLAND ===================== */
  loc({
    id: 'loc-hxh-wi-port',
    mapLevelId: 'hxh-map-whale-island',
    name: 'Whale Island Harbor',
    localizedName: { it: "Porto dell'Isola Balena", en: 'Whale Island Harbor' },
    type: 'landmark',
    x: 930,
    y: 650,
    shortDescription: {
      it: "Il molo del villaggio di pescatori da cui Gon, a dodici anni, si imbarca per raggiungere l'Esame per Hunter e cercare il padre Ging.",
      en: 'The fishing village pier from which twelve-year-old Gon boards a ship to reach the Hunter Exam and look for his father Ging.',
    },
    importance: 'secondary',
    arcIds: ['arc-hxh-hunter-exam'],
    characterIds: ['char-hxh-gon', 'char-hxh-mito'],
    tags: ['whale-island', 'gon'],
  }),
  loc({
    id: 'loc-hxh-wi-mito-house',
    mapLevelId: 'hxh-map-whale-island',
    name: "Mito's House",
    localizedName: { it: 'Casa di Mito', en: "Mito's House" },
    type: 'village',
    x: 760,
    y: 560,
    shortDescription: {
      it: "La casa-locanda dove la zia Mito ha cresciuto Gon. Gon vi torna con Killua dopo la Torre Celeste per aprire la scatola lasciata da Ging, e di nuovo alla fine della serie, quando ha perso il Nen.",
      en: "The house and inn where Aunt Mito raised Gon. Gon returns there with Killua after Heavens Arena to open the box Ging left, and again at the end of the series, after losing his Nen.",
    },
    importance: 'main',
    arcIds: ['arc-hxh-hunter-exam', 'arc-hxh-yorknew-city', 'arc-hxh-election'],
    characterIds: ['char-hxh-gon', 'char-hxh-mito', 'char-hxh-killua'],
    tags: ['whale-island', 'gon', 'mito'],
  }),
  loc({
    id: 'loc-hxh-wi-forest',
    mapLevelId: 'hxh-map-whale-island',
    name: 'Whale Island Forest',
    localizedName: { it: "Foresta dell'Isola Balena", en: 'Whale Island Forest' },
    type: 'forest',
    x: 430,
    y: 360,
    shortDescription: {
      it: "Il bosco dove Gon è cresciuto tra gli animali. Qui, da bambino, viene salvato da Kite dall'attacco di una volpe-orso e scopre che suo padre Ging è un grande Hunter ancora vivo.",
      en: 'The woods where Gon grew up among the animals. Here, as a child, he is saved by Kite from a foxbear attack and learns that his father Ging is a great Hunter who is still alive.',
    },
    importance: 'secondary',
    arcIds: ['arc-hxh-hunter-exam'],
    characterIds: ['char-hxh-gon', 'char-hxh-kite'],
    tags: ['whale-island', 'kite', 'gon'],
  }),
  loc({
    id: 'loc-hxh-wi-lake',
    mapLevelId: 'hxh-map-whale-island',
    name: 'Lake of the Lord',
    localizedName: { it: 'Lago del Signore del Lago', en: 'Lake of the Lord' },
    type: 'landmark',
    x: 300,
    y: 560,
    shortDescription: {
      it: "Lo stagno dell'isola dove vive il gigantesco pesce chiamato «il Signore del Lago», che nessun adulto è mai riuscito a pescare: Gon lo cattura per convincere Mito a lasciarlo partire per l'Esame.",
      en: "The island pond home to the giant fish called 'the Lord of the Lake', which no adult has ever caught: Gon reels it in to persuade Mito to let him leave for the Exam.",
    },
    importance: 'minor',
    arcIds: ['arc-hxh-hunter-exam'],
    characterIds: ['char-hxh-gon', 'char-hxh-mito'],
    tags: ['whale-island', 'gon'],
  }),

  /* ===================== NGL ===================== */
  loc({
    id: 'loc-hxh-ngl-gate',
    mapLevelId: 'hxh-map-ngl',
    name: 'NGL Border Checkpoint',
    localizedName: { it: 'Posto di confine della NGL', en: 'NGL Border Checkpoint' },
    type: 'landmark',
    x: 1080,
    y: 470,
    shortDescription: {
      it: "L'ingresso della regione autonoma che rifiuta ogni tecnologia: i visitatori devono consegnare macchinari, metalli e perfino vestiti sintetici. Il team di Kite lo attraversa per seguire le Formiche Chimera.",
      en: 'The entrance to the autonomous region that rejects all technology: visitors must hand over machines, metals and even synthetic clothes. Kite\'s team goes through it to follow the Chimera Ants.',
    },
    nationId: 'nation-hxh-ngl',
    importance: 'secondary',
    arcIds: ['arc-hxh-chimera-ant'],
    characterIds: ['char-hxh-kite', 'char-hxh-gon', 'char-hxh-killua'],
    tags: ['ngl', 'formiche-chimera'],
  }),
  loc({
    id: 'loc-hxh-ngl-coast',
    mapLevelId: 'hxh-map-ngl',
    name: 'NGL Shore',
    localizedName: { it: 'Costa della NGL', en: 'NGL Shore' },
    type: 'region',
    x: 240,
    y: 700,
    shortDescription: {
      it: "La spiaggia su cui approda, ferita e grande come un essere umano, la Regina delle Formiche Chimera: comincia nutrendosi di piccoli animali e pesci, poi di esseri umani.",
      en: 'The beach where the Chimera Ant Queen washes ashore, injured and as large as a human: she starts by feeding on small animals and fish, then on humans.',
    },
    nationId: 'nation-hxh-ngl',
    importance: 'minor',
    arcIds: ['arc-hxh-chimera-ant'],
    characterIds: [],
    tags: ['ngl', 'regina', 'formiche-chimera'],
  }),
  loc({
    id: 'loc-hxh-ngl-nest',
    mapLevelId: 'hxh-map-ngl',
    name: 'Chimera Ant Nest',
    localizedName: { it: 'Nido delle Formiche Chimera', en: 'Chimera Ant Nest' },
    type: 'hideout',
    x: 560,
    y: 380,
    shortDescription: {
      it: "Il gigantesco formicaio costruito nella giungla della NGL: la Regina vi genera soldati e comandanti nutrendoli di esseri umani, e qui nascono le tre Guardie Reali e il Re Meruem.",
      en: 'The giant anthill built in the NGL jungle: the Queen breeds soldiers and squadron leaders there by feeding them humans, and here the three Royal Guards and King Meruem are born.',
    },
    longDescription: {
      it: "Nel nido si consuma la fine di Pokkle e Ponzu, catturati durante le loro indagini; il comandante Colt vi difende la Regina e poi chiede aiuto agli Hunter per salvarla. Dopo la nascita del Re la colonia si disperde e il nido viene abbandonato.",
      en: 'Pokkle and Ponzu meet their end in the nest after being captured during their investigation; squadron leader Colt defends the Queen there and later asks the Hunters for help to save her. After the King\'s birth the colony scatters and the nest is abandoned.',
    },
    nationId: 'nation-hxh-ngl',
    importance: 'main',
    arcIds: ['arc-hxh-chimera-ant'],
    characterIds: ['char-hxh-meruem', 'char-hxh-neferpitou', 'char-hxh-shaiapouf', 'char-hxh-menthuthuyoupi', 'char-hxh-colt', 'char-hxh-pokkle', 'char-hxh-ponzu'],
    tags: ['ngl', 'formiche-chimera', 'nido'],
  }),
  loc({
    id: 'loc-hxh-ngl-forest',
    mapLevelId: 'hxh-map-ngl',
    name: "Kite's Last Stand",
    localizedName: { it: "La radura dell'ultimo scontro di Kite", en: "Kite's Last Stand" },
    type: 'battlefield',
    x: 780,
    y: 600,
    shortDescription: {
      it: "La radura nella giungla dove Neferpitou, appena nata, piomba sul gruppo: Kite resta indietro perché Gon e Killua possano fuggire, e la Guardia Reale lo uccide.",
      en: 'The jungle clearing where the newborn Neferpitou falls upon the group: Kite stays behind so that Gon and Killua can flee, and the Royal Guard kills him.',
    },
    nationId: 'nation-hxh-ngl',
    importance: 'secondary',
    arcIds: ['arc-hxh-chimera-ant'],
    characterIds: ['char-hxh-kite', 'char-hxh-neferpitou', 'char-hxh-gon', 'char-hxh-killua'],
    tags: ['ngl', 'kite', 'neferpitou'],
  }),

  /* ===================== BLACK WHALE 1 ===================== */
  loc({
    id: 'loc-hxh-bw-tier1',
    mapLevelId: 'hxh-map-black-whale',
    name: 'Tier 1 · Royal Quarters',
    localizedName: { it: 'Tier 1 · alloggi reali', en: 'Tier 1 · Royal Quarters' },
    type: 'landmark',
    x: 700,
    y: 250,
    shortDescription: {
      it: "Il ponte più alto della nave, una sovrastruttura di lusso riservata alla famiglia reale di Kakin e alla nobiltà: qui i quattordici principi, ciascuno con la sua Bestia Guardiana, combattono la guerra di successione.",
      en: 'The ship\'s highest deck, a luxury superstructure reserved for the Kakin royal family and the nobility: here the fourteen princes, each with their Guardian Spirit Beast, wage the succession war.',
    },
    longDescription: {
      it: "Kurapika vi lavora come guardia del corpo della principessa Woble e vi tiene il suo corso di Nen per le guardie degli altri principi. Nelle stanze del Tier 1 cadono le prime vittime (la principessa Momoze), si muovono l'esercito privato di Benjamin e i piani del principe Tserriednich, che custodisce gli Occhi Scarlatti.",
      en: 'Kurapika works there as Princess Woble\'s bodyguard and holds his Nen course for the other princes\' guards. The first victims fall in the Tier 1 rooms (Princess Momoze), and Benjamin\'s private army and the schemes of Prince Tserriednich, who keeps a pair of Scarlet Eyes, play out there.',
    },
    nationId: 'nation-hxh-kakin',
    importance: 'main',
    arcIds: ['arc-hxh-succession-contest'],
    characterIds: ['char-hxh-kurapika', 'char-hxh-woble', 'char-hxh-oito', 'char-hxh-tserriednich', 'char-hxh-benjamin', 'char-hxh-momoze', 'char-hxh-halkenburg'],
    tags: ['black-whale', 'successione', 'kakin'],
  }),
  loc({
    id: 'loc-hxh-bw-middle-tiers',
    mapLevelId: 'hxh-map-black-whale',
    name: 'Tiers 2–3',
    localizedName: { it: 'Tier 2–3 · ceti medi', en: 'Tiers 2–3 · Middle Classes' },
    type: 'city',
    x: 700,
    y: 450,
    shortDescription: {
      it: "I ponti intermedi della nave-città, abitati dalle classi agiate e medie di Kakin: comodità e una sicurezza meno rigida, che li rende più permeabili ai traffici della mafia e agli intrighi di bordo.",
      en: "The ship-city's middle decks, home to Kakin's well-off and middle classes: comfort and looser security, which makes them more open to mafia dealings and shipboard intrigue.",
    },
    nationId: 'nation-hxh-kakin',
    importance: 'minor',
    arcIds: ['arc-hxh-succession-contest'],
    characterIds: [],
    referenceStatus: 'needs_verification',
    tags: ['black-whale', 'kakin'],
  }),
  loc({
    id: 'loc-hxh-bw-lower-tiers',
    mapLevelId: 'hxh-map-black-whale',
    name: 'Tiers 4–5',
    localizedName: { it: 'Tier 4–5 · ponti inferiori', en: 'Tiers 4–5 · Lower Decks' },
    type: 'city',
    x: 700,
    y: 640,
    shortDescription: {
      it: "I ponti più bassi, dove viaggia la maggior parte dei passeggeri di Kakin, separati dall'impianto di trattamento dei rifiuti: informazione e sicurezza sono strettamente controllate e la gente ignora la guerra che si combatte sopra.",
      en: "The lowest decks, where most of Kakin's passengers travel, separated by the waste-processing plant: information and security are tightly controlled and people are unaware of the war being fought above them.",
    },
    nationId: 'nation-hxh-kakin',
    importance: 'minor',
    arcIds: ['arc-hxh-succession-contest'],
    characterIds: [],
    tags: ['black-whale', 'kakin'],
  }),
];

/** Pin della world map che aprono le nuove sotto-mappe (doppio click). */
export const HXH_NEW_SUBMAP_TRIGGERS: Record<string, string> = {
  'loc-hxh-yorknew': 'hxh-map-yorknew',
  'loc-hxh-whale-island': 'hxh-map-whale-island',
  'loc-hxh-ngl': 'hxh-map-ngl',
  'loc-hxh-black-whale': 'hxh-map-black-whale',
};

/* ========================================================== PERSONAGGI */

type CharIn = Omit<Character, 'worldId' | 'canonStatus' | 'referenceStatus'> &
  Partial<Pick<Character, 'referenceStatus' | 'canonStatus'>>;
const char = (c: CharIn): Character => ({ worldId: W, canonStatus: 'canon', referenceStatus: 'verified', ...c });

const KITE_TEAM_LONG = {
  it: "Faceva parte del gruppo di giovani studiosi e cacciatori al seguito di Kite, impegnati in una ricerca naturalistica sul campo. Il gruppo si imbatte nelle tracce delle Formiche Chimera e ne segue l'espansione fino alla NGL.",
  en: "Part of the group of young researchers and hunters following Kite on a field survey of the natural world. The group stumbles upon the traces of the Chimera Ants and follows their spread all the way to the NGL.",
};

const kiteMember = (id: string, name: string): Character =>
  char({
    id,
    name,
    importance: 'background',
    role: ['ally'],
    factionIds: ['faction-hxh-kite-team'],
    rank: 'Team di Kite',
    shortDescription: {
      it: `${name} è un membro della squadra di ricerca di Kite durante l'arco delle Formiche Chimera.`,
      en: `${name} is a member of Kite's research team during the Chimera Ant arc.`,
    },
    longDescription: KITE_TEAM_LONG,
    arcIds: ['arc-hxh-chimera-ant'],
    status: 'alive',
    tags: ['kite', 'formiche-chimera'],
  });

export const hxhCompletionCharacters: Character[] = [
  char({
    id: 'char-hxh-izunavi',
    name: 'Izunavi',
    japaneseName: 'イズナビ',
    importance: 'supporting',
    role: ['mentor'],
    factionIds: ['faction-hxh-hunter-association'],
    rank: 'Hunter',
    gender: 'M',
    shortDescription: {
      it: "L'Hunter che insegna il Nen a Kurapika dopo l'Esame. Lo vede creare le sue catene e lo mette in guardia dal prezzo del Giuramento e Limitazione che lega la Catena del Giudizio alla Brigata.",
      en: 'The Hunter who teaches Kurapika Nen after the Exam. He watches him create his chains and warns him about the price of the Vow and Limitation binding the Judgment Chain to the Troupe.',
    },
    longDescription: {
      it: "Izunavi compare nei ricordi di Kurapika all'inizio dell'arco di Yorknew: l'addestramento è rapido e durissimo, e il maestro capisce subito che l'abilità del ragazzo, nata dall'odio per la Brigata Fantasma, rischia di consumarlo. Kurapika gli chiede come diventare più forte senza limiti; Izunavi gli spiega che ogni promessa del Nen ha un costo.",
      en: "Izunavi appears in Kurapika's memories at the start of the Yorknew arc: the training is fast and brutal, and the master immediately sees that the boy's ability, born of hatred for the Phantom Troupe, could consume him. Kurapika asks him how to grow stronger without limits; Izunavi explains that every Nen vow has a cost.",
    },
    arcIds: ['arc-hxh-yorknew-city'],
    status: 'alive',
    tags: ['kurapika', 'maestro', 'nen'],
  }),
  char({
    id: 'char-hxh-kiriko',
    name: 'Kiriko',
    japaneseName: 'キリコ',
    importance: 'minor',
    role: ['supporting'],
    factionIds: ['faction-hxh-hunter-association'],
    rank: 'Navigatori dell\'Esame',
    shortDescription: {
      it: "Famiglia di bestie magiche capaci di assumere forma umana che fa da guida ai candidati verso la sede del 287° Esame. Mettono alla prova Gon, Kurapika e Leorio e li portano a Zaban City.",
      en: 'A family of magical beasts able to take human form who guide candidates to the site of the 287th Exam. They test Gon, Kurapika and Leorio and take them to Zaban City.',
    },
    longDescription: {
      it: "Nel bosco oltre il porto di Dolle, i Kiriko si fingono una famiglia aggredita da un mostro per osservare come reagiscono i viaggiatori: Gon riconosce subito marito e moglie, Leorio soccorre la donna ferita e Kurapika capisce il trucco. Soddisfatti, li accompagnano in volo fino a Zaban.",
      en: 'In the woods beyond Dolle Harbor, the Kiriko pose as a family attacked by a monster to see how travellers react: Gon immediately tells husband and wife apart, Leorio tends to the wounded woman and Kurapika sees through the trick. Satisfied, they fly the three to Zaban.',
    },
    arcIds: ['arc-hxh-hunter-exam'],
    status: 'alive',
    tags: ['esame', 'bestie-magiche'],
  }),
  char({
    id: 'char-hxh-sarasa',
    name: 'Sarasa',
    japaneseName: 'サラサ',
    importance: 'minor',
    role: ['supporting'],
    factionIds: [],
    rank: 'Bambina di Meteor City',
    gender: 'F',
    shortDescription: {
      it: "Bambina di Meteor City, amica d'infanzia di Chrollo e dei futuri membri della Brigata, con cui recitava e doppiava i cartoni animati. Il suo brutale assassinio segna per sempre quei ragazzi.",
      en: 'A Meteor City girl, childhood friend of Chrollo and the future Troupe members, with whom she acted and dubbed cartoons. Her brutal murder marks those children forever.',
    },
    longDescription: {
      it: "Il flashback sulle origini della Brigata, nel pieno dell'arco della Successione, mostra Sarasa nel gruppo teatrale dei bambini della discarica: adora doppiare il personaggio di Orange. La sua morte per mano di sconosciuti venuti da fuori è il punto di svolta da cui nasce la Brigata Fantasma.",
      en: "The flashback on the Troupe's origins, in the middle of the Succession arc, shows Sarasa in the junkyard children's theatre group: she loves dubbing the character Orange. Her death at the hands of outsiders is the turning point from which the Phantom Troupe is born.",
    },
    arcIds: ['arc-hxh-succession-contest'],
    status: 'deceased',
    tags: ['meteor-city', 'brigata-fantasma', 'flashback'],
  }),
  char({
    id: 'char-hxh-omokage',
    name: 'Omokage',
    japaneseName: 'オモカゲ',
    importance: 'minor',
    role: ['antagonist'],
    factionIds: ['faction-hxh-phantom-troupe'],
    rank: 'Ex membro n. 4 della Brigata (film)',
    gender: 'M',
    shortDescription: {
      it: "Antagonista del film «Phantom Rouge» (2013): ex membro numero 4 della Brigata Fantasma, sostituito da Hisoka. Crea bambole animate e ruba gli occhi, tra cui quelli di Kurapika.",
      en: "Antagonist of the film 'Phantom Rouge' (2013): the Phantom Troupe's former member number 4, replaced by Hisoka. He creates living dolls and steals eyes, including Kurapika's.",
    },
    longDescription: {
      it: "Personaggio esclusivo del film, al di fuori della continuità del manga: le sue bambole possono usare le abilità di chi ha fornito loro gli occhi. Gon e Killua aiutano Kurapika a recuperare la vista affrontandolo con un'alleanza temporanea con alcuni Ragni.",
      en: 'A film-only character outside the manga continuity: his dolls can use the abilities of whoever supplied their eyes. Gon and Killua help Kurapika recover his sight, fighting him in a temporary alliance with some Spiders.',
    },
    arcIds: [],
    status: 'deceased',
    canonStatus: 'movie',
    tags: ['film', 'brigata-fantasma'],
  }),
  kiteMember('char-hxh-banana-kavaro', 'Banana Kavaro'),
  kiteMember('char-hxh-stick-dinner', 'Stick Dinner'),
  kiteMember('char-hxh-lin-koshi', 'Lin Koshi'),
  kiteMember('char-hxh-monta-yuras', 'Monta Yuras'),
  kiteMember('char-hxh-podungo-lapoy', 'Podungo Lapoy'),
];

/* ============================================================ FAZIONI */

export const hxhCompletionFactions: Faction[] = [
  {
    id: 'faction-hxh-zoldyck-butlers',
    worldId: W,
    type: 'organization',
    name: 'Zoldyck Butlers',
    localizedName: { it: 'Maggiordomi degli Zoldyck', en: 'Zoldyck Butlers' },
    japaneseName: 'ゾルディック家執事',
    description: {
      it: "Il personale armato che vive sul Monte Kukuroo al servizio della famiglia di assassini: sorvegliano la tenuta, mettono alla prova i visitatori e scortano i membri della famiglia.",
      en: 'The armed staff living on Kukuroo Mountain in the service of the assassin family: they guard the estate, test visitors and escort family members.',
    },
    longDescription: {
      it: "Guidati da Gotoh, i maggiordomi accolgono Gon, Kurapika e Leorio con la sfida delle monete; Canary sorveglia il sentiero oltre la Porta della Prova. Durante il ritorno di Killua con Alluka, Tsubone e Amane fanno da scorta e da controllo per conto della famiglia.",
      en: 'Led by Gotoh, the butlers greet Gon, Kurapika and Leorio with the coin challenge; Canary guards the path past the Testing Gate. When Killua leaves with Alluka, Tsubone and Amane act as escort and watch on the family\'s behalf.',
    },
    leaderIds: ['char-hxh-gotoh'],
    characterIds: ['char-hxh-gotoh', 'char-hxh-canary', 'char-hxh-tsubone', 'char-hxh-amane'],
    locationIds: ['loc-hxh-zoldyck-estate', 'loc-hxh-zd-butlers'],
    arcIds: ['arc-hxh-zoldyck-family', 'arc-hxh-election'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['zoldyck', 'maggiordomi'],
  },
  {
    id: 'faction-hxh-shingen-ryu',
    worldId: W,
    type: 'school',
    name: 'Shingen-ryu Kung Fu',
    localizedName: { it: 'Scuola Shingen-ryu', en: 'Shingen-ryu Kung Fu' },
    japaneseName: '心源流拳法',
    description: {
      it: "La scuola di arti marziali a cui appartengono Wing, il suo allievo Zushi e la maestra di Wing, Biscuit Krueger: un insegnamento metodico del Nen che parte dai fondamenti.",
      en: "The martial arts school to which Wing, his pupil Zushi and Wing's own teacher Biscuit Krueger belong: a methodical teaching of Nen that starts from the fundamentals.",
    },
    longDescription: {
      it: "Alla Torre Celeste Wing introduce Gon e Killua al Nen secondo il metodo Shingen-ryu, con le quattro tecniche base e il rispetto per il pericolo dell'aura; su Greed Island Biscuit, maestra della stessa scuola, ne completa l'addestramento con Gyo, Ko, Ken e Ryu. Anche il presidente Netero è un maestro di questa scuola.",
      en: "At Heavens Arena Wing introduces Gon and Killua to Nen through the Shingen-ryu method, with the four basic techniques and respect for aura's dangers; on Greed Island Biscuit, a master of the same school, completes their training with Gyo, Ko, Ken and Ryu. Chairman Netero is also a master of the school.",
    },
    leaderIds: ['char-hxh-biscuit'],
    characterIds: ['char-hxh-netero', 'char-hxh-biscuit', 'char-hxh-wing', 'char-hxh-zushi'],
    locationIds: ['loc-hxh-heavens-arena', 'loc-hxh-greed-island'],
    arcIds: ['arc-hxh-heavens-arena', 'arc-hxh-greed-island'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['nen', 'arti-marziali'],
  },
  {
    id: 'faction-hxh-game-masters',
    worldId: W,
    type: 'group',
    name: 'Greed Island Game Masters',
    localizedName: { it: 'Game Master di Greed Island', en: 'Greed Island Game Masters' },
    description: {
      it: "Il gruppo di utenti Nen, amici di Ging, che ha creato e gestisce dall'interno il gioco di Greed Island: ne custodiscono le regole, le carte e il castello di Limeiro.",
      en: 'The group of Nen users, friends of Ging, who created Greed Island and run the game from the inside: they keep its rules, its cards and Limeiro castle.',
    },
    longDescription: {
      it: "Razor affronta Gon e i suoi a dodgeball con la sua squadra di ex detenuti per la carta di Soufrabi; Dwun e List seguono il gioco da Limeiro. Quando Gon completa il gioco, i Game Master gli consegnano i premi e il messaggio di Ging.",
      en: "Razor faces Gon's group at dodgeball with his team of former convicts for the Soufrabi card; Dwun and List follow the game from Limeiro. When Gon clears the game, the Game Masters hand him the rewards and Ging's message.",
    },
    leaderIds: ['char-hxh-ging'],
    characterIds: ['char-hxh-ging', 'char-hxh-razor', 'char-hxh-dwun', 'char-hxh-list'],
    locationIds: ['loc-hxh-greed-island', 'loc-hxh-gi-limeiro', 'loc-hxh-gi-soufrabi'],
    arcIds: ['arc-hxh-greed-island'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['greed-island', 'ging'],
  },
  {
    id: 'faction-hxh-kite-team',
    worldId: W,
    type: 'group',
    name: "Kite's Team",
    localizedName: { it: 'Squadra di Kite', en: "Kite's Team" },
    description: {
      it: "Il gruppo di ricerca guidato da Kite, l'allievo di Ging: indaga sui resti di una gigantesca formica e segue le Formiche Chimera fino alla NGL, con Gon e Killua al seguito.",
      en: "The research group led by Kite, Ging's pupil: it investigates the remains of a giant ant and follows the Chimera Ants to the NGL, with Gon and Killua in tow.",
    },
    longDescription: {
      it: "Kite entra nella NGL con Gon e Killua e viene ucciso dalla neonata Guardia Reale Neferpitou. La minaccia delle Formiche spinge l'Associazione Hunter a inviare il presidente Netero, Morel e Knov alla guida della squadra di sterminio.",
      en: 'Kite enters the NGL with Gon and Killua and is killed by the newborn Royal Guard Neferpitou. The Ant threat drives the Hunter Association to send Chairman Netero, Morel and Knov at the head of the extermination team.',
    },
    leaderIds: ['char-hxh-kite'],
    characterIds: [
      'char-hxh-kite', 'char-hxh-spinner-clow', 'char-hxh-banana-kavaro', 'char-hxh-stick-dinner',
      'char-hxh-lin-koshi', 'char-hxh-monta-yuras', 'char-hxh-podungo-lapoy',
    ],
    locationIds: ['loc-hxh-ngl', 'loc-hxh-ngl-gate'],
    arcIds: ['arc-hxh-chimera-ant'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['kite', 'formiche-chimera'],
  },
];

/* ============================================================= EVENTI */

const P = {
  exam: { it: 'Esame per Hunter', en: 'Hunter Exam' },
  yorknew: { it: 'Città di Yorknew', en: 'Yorknew City' },
  election: { it: 'Elezione del 13° Presidente', en: '13th Chairman Election' },
  succession: { it: 'Guerra di Successione di Kakin', en: 'Kakin Succession War' },
} as const;

type EvIn = Omit<TimelineEvent, 'worldId' | 'canon' | 'referenceStatus'> & Partial<Pick<TimelineEvent, 'referenceStatus'>>;
const ev = (e: EvIn): TimelineEvent => ({ worldId: W, canon: 'canon', canonStatus: 'canon', referenceStatus: 'verified', ...e });

export const hxhCompletionEvents: TimelineEvent[] = [
  ev({
    id: 'ev-hxh-gon-meets-kite',
    title: { it: 'Kite salva Gon nella foresta', en: 'Kite saves Gon in the forest' },
    description: {
      it: "Da bambino Gon si avventura nella foresta di Whale Island e viene attaccato da una volpe-orso: lo salva Kite, che gli rivela che suo padre Ging è vivo ed è uno dei più grandi Hunter del mondo. Gon decide che diventerà Hunter per trovarlo.",
      en: 'As a child Gon ventures into the Whale Island forest and is attacked by a foxbear: Kite saves him and reveals that his father Ging is alive and one of the greatest Hunters in the world. Gon decides to become a Hunter to find him.',
    },
    period: P.exam,
    arcId: 'arc-hxh-hunter-exam',
    locationId: 'loc-hxh-wi-forest',
    characterIds: ['char-hxh-gon', 'char-hxh-kite'],
    mangaChapters: ['1'],
    animeEpisodes: ['1'],
    order: 0.5,
    tags: ['gon', 'kite', 'origini'],
  }),
  ev({
    id: 'ev-hxh-lord-of-the-lake',
    title: { it: 'Gon pesca il Signore del Lago', en: 'Gon catches the Lord of the Lake' },
    description: {
      it: "Mito accetta di lasciar partire Gon per l'Esame solo se riuscirà a pescare il leggendario Signore del Lago, che nessuno ha mai preso. Dopo giorni di tentativi Gon ci riesce, e la zia mantiene la promessa.",
      en: 'Mito agrees to let Gon leave for the Exam only if he catches the legendary Lord of the Lake, which nobody has ever landed. After days of trying Gon succeeds, and his aunt keeps her promise.',
    },
    period: P.exam,
    arcId: 'arc-hxh-hunter-exam',
    locationId: 'loc-hxh-wi-lake',
    characterIds: ['char-hxh-gon', 'char-hxh-mito'],
    mangaChapters: ['1'],
    animeEpisodes: ['1'],
    order: 0.8,
    tags: ['gon', 'mito', 'origini'],
  }),
  ev({
    id: 'ev-hxh-kiriko-navigators',
    title: { it: 'La prova dei Kiriko', en: 'The Kiriko test' },
    description: {
      it: "Sulla strada per Zaban, Gon, Kurapika e Leorio superano il quiz della vecchia del villaggio e incontrano i Kiriko, bestie magiche navigatrici che li mettono alla prova fingendosi una famiglia in pericolo, prima di accompagnarli alla sede dell'Esame.",
      en: "On the way to Zaban, Gon, Kurapika and Leorio pass the village crone's quiz and meet the Kiriko, magical navigator beasts who test them by posing as a family in danger before escorting them to the Exam site.",
    },
    period: P.exam,
    arcId: 'arc-hxh-hunter-exam',
    locationIds: ['loc-hxh-dolle-harbor', 'loc-hxh-zaban-city'],
    characterIds: ['char-hxh-gon', 'char-hxh-kurapika', 'char-hxh-leorio', 'char-hxh-kiriko'],
    mangaChapters: ['3-4'],
    animeEpisodes: ['2'],
    order: 1.7,
    tags: ['esame', 'kiriko'],
  }),
  ev({
    id: 'ev-hxh-ging-box',
    title: { it: 'La scatola di Ging', en: "Ging's box" },
    description: {
      it: "Dopo la Torre Celeste Gon torna a Whale Island con Killua. Mito gli consegna la scatola lasciata da Ging, che si apre solo con il Nen: dentro ci sono un anello, una cassetta con un messaggio del padre e una scheda di memoria del gioco Greed Island.",
      en: "After Heavens Arena Gon returns to Whale Island with Killua. Mito gives him the box Ging left, which opens only with Nen: inside are a ring, a cassette tape with a message from his father and a memory card for the game Greed Island.",
    },
    period: P.exam,
    arcId: 'arc-hxh-heavens-arena',
    locationId: 'loc-hxh-wi-mito-house',
    characterIds: ['char-hxh-gon', 'char-hxh-killua', 'char-hxh-mito', 'char-hxh-ging'],
    order: 8.3,
    tags: ['gon', 'ging', 'greed-island'],
  }),
  ev({
    id: 'ev-hxh-kurapika-izunavi',
    title: { it: "L'apprendistato di Kurapika", en: "Kurapika's apprenticeship" },
    description: {
      it: "Dopo l'Esame Kurapika impara il Nen dall'Hunter Izunavi. Materializza le sue catene e lega la Catena del Giudizio a un Giuramento: userà quel potere solo contro la Brigata Fantasma, pena la morte.",
      en: 'After the Exam Kurapika learns Nen from the Hunter Izunavi. He materialises his chains and binds the Judgment Chain to a Vow: he will use that power only against the Phantom Troupe, on pain of death.',
    },
    period: P.yorknew,
    arcId: 'arc-hxh-yorknew-city',
    characterIds: ['char-hxh-kurapika', 'char-hxh-izunavi'],
    order: 8.45,
    tags: ['kurapika', 'nen', 'giuramento'],
  }),
  ev({
    id: 'ev-hxh-yorknew-market',
    title: { it: 'Gon e Killua al mercato di Yorknew', en: 'Gon and Killua at the Yorknew market' },
    description: {
      it: "Per comprare Greed Island all'asta, Gon e Killua cercano affari tra i banchi del mercato libero e aprono una sfida di braccio di ferro a pagamento. Il perito Zepile insegna loro a riconoscere i falsi e diventa un prezioso alleato.",
      en: 'To buy Greed Island at the auction, Gon and Killua hunt for bargains among the free-market stalls and run a paid arm-wrestling challenge. The appraiser Zepile teaches them to spot fakes and becomes a valuable ally.',
    },
    period: P.yorknew,
    arcId: 'arc-hxh-yorknew-city',
    locationId: 'loc-hxh-yk-market',
    characterIds: ['char-hxh-gon', 'char-hxh-killua', 'char-hxh-leorio', 'char-hxh-zepile'],
    order: 9.7,
    tags: ['yorknew', 'greed-island'],
  }),
  ev({
    id: 'ev-hxh-troupe-origins',
    title: { it: 'Le origini della Brigata: la morte di Sarasa', en: "The Troupe's origins: Sarasa's death" },
    description: {
      it: "Nella discarica di Meteor City un gruppo di bambini, tra cui Chrollo, Pakunoda, Uvogin, Machi, Phinks e Feitan, recita e doppia cartoni animati insieme a Sarasa. Il suo brutale assassinio per mano di estranei venuti da fuori li spinge, anni dopo, a fondare la Brigata Fantasma.",
      en: 'In the Meteor City junkyard a group of children, including Chrollo, Pakunoda, Uvogin, Machi, Phinks and Feitan, acts and dubs cartoons together with Sarasa. Her brutal murder by outsiders drives them, years later, to found the Phantom Troupe.',
    },
    period: P.succession,
    arcId: 'arc-hxh-succession-contest',
    locationId: 'loc-hxh-meteor-city',
    characterIds: [
      'char-hxh-sarasa', 'char-hxh-chrollo', 'char-hxh-pakunoda', 'char-hxh-uvogin', 'char-hxh-machi',
      'char-hxh-phinks', 'char-hxh-feitan', 'char-hxh-nobunaga', 'char-hxh-franklin', 'char-hxh-shalnark',
    ],
    factionIds: ['faction-hxh-phantom-troupe'],
    mangaChapters: ['395-400'],
    // Flashback: mostrato durante l'arco della Successione, ambientato anni prima.
    order: 0.2,
    referenceStatus: 'needs_verification',
    tags: ['brigata-fantasma', 'meteor-city', 'flashback'],
  }),
  ev({
    id: 'ev-hxh-gon-returns-home',
    title: { it: 'Gon torna a Whale Island', en: 'Gon returns to Whale Island' },
    description: {
      it: "Dopo aver finalmente parlato con Ging in cima all'Albero del Mondo, Gon — che ha perso la capacità di vedere e usare il Nen — torna a casa da Mito, mentre Killua parte in viaggio con Alluka. I due amici si separano con la promessa di ritrovarsi.",
      en: 'After finally talking with Ging atop the World Tree, Gon — who has lost the ability to see and use Nen — goes home to Mito, while Killua sets off travelling with Alluka. The two friends part ways promising to meet again.',
    },
    period: P.election,
    arcId: 'arc-hxh-election',
    locationId: 'loc-hxh-wi-mito-house',
    characterIds: ['char-hxh-gon', 'char-hxh-mito', 'char-hxh-killua', 'char-hxh-alluka'],
    order: 28.25,
    tags: ['gon', 'killua', 'epilogo'],
  }),
  ev({
    id: 'ev-hxh-hisoka-vs-chrollo',
    title: { it: 'Hisoka contro Chrollo', en: 'Hisoka vs Chrollo' },
    description: {
      it: "Liberato dal sigillo di Kurapika, Chrollo accetta finalmente il duello con Hisoka in un'arena della Torre Celeste. Con le abilità prese in prestito da Shalnark e Kortopi, Chrollo lo mette all'angolo e lo uccide con le esplosioni delle sue marionette; Hisoka però ha affidato il proprio Nen alla morte e risorge.",
      en: "Freed from Kurapika's seal, Chrollo finally accepts the duel with Hisoka in a Heavens Arena ring. Using abilities borrowed from Shalnark and Kortopi, Chrollo corners him and kills him with his puppets' explosions; but Hisoka had entrusted his Nen to death, and he comes back to life.",
    },
    period: P.succession,
    arcId: 'arc-hxh-succession-contest',
    locationId: 'loc-hxh-heavens-arena',
    characterIds: ['char-hxh-hisoka', 'char-hxh-chrollo', 'char-hxh-shalnark', 'char-hxh-kortopi', 'char-hxh-machi'],
    mangaChapters: ['352-357'],
    order: 28.35,
    tags: ['hisoka', 'chrollo', 'torre-celeste'],
  }),
];

/* ====================================================== RICOLLEGAMENTI */

/**
 * Luogo preciso degli eventi già esistenti: le sotto-mappe nuove (Yorknew,
 * Whale Island, NGL, Black Whale) e i luoghi dell'Esame/elezione che prima
 * mancavano. Sostituisce `locationId` (e `locationIds`, se presente).
 */
export const HXH_EVENT_LOCATIONS: Record<string, string> = {
  'ev-hxh-gon-departs': 'loc-hxh-wi-port',
  'ev-hxh-swindlers-swamp': 'loc-hxh-milsy-wetlands',
  'ev-hxh-trick-tower': 'loc-hxh-trick-tower',
  'ev-hxh-killua-vs-johness': 'loc-hxh-trick-tower',
  'ev-hxh-zevil-island': 'loc-hxh-zevil-island',
  'ev-hxh-greed-island-auction': 'loc-hxh-yorknew',
  'ev-hxh-troupe-gathers': 'loc-hxh-yk-hideout',
  'ev-hxh-auction-massacre': 'loc-hxh-yk-cemetery-building',
  'ev-hxh-zeno-silva-vs-chrollo': 'loc-hxh-yk-cemetery-building',
  'ev-hxh-kurapika-vs-uvogin': 'loc-hxh-yk-wasteland',
  'ev-hxh-uvogin-death': 'loc-hxh-yk-wasteland',
  'ev-hxh-gon-killua-captured': 'loc-hxh-yk-hideout',
  'ev-hxh-kurapika-vs-chrollo': 'loc-hxh-yk-downtown',
  'ev-hxh-chrollo-captured': 'loc-hxh-yk-downtown',
  'ev-hxh-hostage-exchange': 'loc-hxh-yk-airport',
  'ev-hxh-pakunoda-sacrifice': 'loc-hxh-yk-hideout',
  'ev-hxh-queen-washes-ashore': 'loc-hxh-ngl-coast',
  'ev-hxh-queen-ngl': 'loc-hxh-ngl-nest',
  'ev-hxh-kite-team-ngl': 'loc-hxh-ngl-gate',
  'ev-hxh-pokkle-ponzu-death': 'loc-hxh-ngl-nest',
  'ev-hxh-kite-killed': 'loc-hxh-ngl-forest',
  'ev-hxh-colt-defects': 'loc-hxh-ngl-nest',
  'ev-hxh-king-born': 'loc-hxh-ngl-nest',
  'ev-hxh-royal-guard-born': 'loc-hxh-ngl-nest',
  'ev-hxh-chairman-election': 'loc-hxh-swardani-city',
  'ev-hxh-leorio-punches-ging': 'loc-hxh-swardani-city',
  'ev-hxh-election': 'loc-hxh-swardani-city',
  'ev-hxh-pariston-wins': 'loc-hxh-swardani-city',
  'ev-hxh-gon-meets-ging': 'loc-hxh-world-tree',
  'ev-hxh-kurapika-woble': 'loc-hxh-bw-tier1',
  'ev-hxh-kurapika-nen-lessons': 'loc-hxh-bw-tier1',
  'ev-hxh-tserriednich-eyes': 'loc-hxh-bw-tier1',
  'ev-hxh-momoze-killed': 'loc-hxh-bw-tier1',
  'ev-hxh-benjamin-army': 'loc-hxh-bw-tier1',
  'ev-hxh-succession-war': 'loc-hxh-bw-tier1',
  'ev-hxh-guardian-beasts': 'loc-hxh-bw-tier1',
  'ev-hxh-kurapika-little-eye': 'loc-hxh-bw-tier1',
  'ev-hxh-tserriednich-awakening': 'loc-hxh-bw-tier1',
};

/**
 * Utilizzatori delle tecniche FONDAMENTALI del Nen (prima senza utenti):
 * chi le impara o le usa in modo esplicito nel manga.
 */
export const HXH_BASIC_NEN_USERS: Record<string, string[]> = {
  'jutsu-hxh-nen': ['gon', 'killua', 'kurapika', 'leorio', 'hisoka', 'wing', 'biscuit', 'netero', 'zushi'],
  'jutsu-hxh-ten': ['gon', 'killua', 'zushi', 'wing', 'kurapika'],
  'jutsu-hxh-zetsu': ['gon', 'killua', 'zushi', 'wing', 'meleoron'],
  'jutsu-hxh-ren': ['gon', 'killua', 'zushi', 'biscuit', 'hisoka', 'knuckle'],
  'jutsu-hxh-hatsu': ['gon', 'killua', 'kurapika', 'hisoka', 'chrollo', 'wing'],
  'jutsu-hxh-gyo': ['gon', 'killua', 'biscuit', 'kurapika', 'knuckle'],
  'jutsu-hxh-in': ['hisoka', 'biscuit'],
  'jutsu-hxh-en': ['gon', 'killua', 'zeno', 'neferpitou', 'netero'],
  'jutsu-hxh-shu': ['gon', 'killua', 'hisoka'],
  'jutsu-hxh-ko': ['gon', 'killua', 'biscuit'],
  'jutsu-hxh-ken': ['gon', 'killua', 'biscuit'],
  'jutsu-hxh-ryu': ['gon', 'killua', 'biscuit'],
  'jutsu-hxh-vow-limitation': ['kurapika', 'gon', 'chrollo'],
  'jutsu-hxh-nen-after-death': ['hisoka', 'neferpitou'],
};
