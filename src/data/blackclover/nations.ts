import type { Nation } from '@/types';
import { BLACKCLOVER_KINGDOM_COLORS } from './mapConstants';

/**
 * "Nazioni" di Black Clover: i quattro regni che danno il nome ai semi delle
 * carte (Clover, Diamond, Spade, Heart), più i territori neutrali fra di
 * essi, il villaggio elfico di Elysia, il Paese del Sole e l'Inframondo dei
 * diavoli (usato dalla sotto-mappa). Il facet è etichettato "Regno / Regione"
 * via `WorldConfig.nationTerm` in `worlds.ts`.
 *
 * `labelPosition` è in coordinate del piano `bc-map-world` (1500 × 1057): la
 * mappa di riferimento marca i regni solo con il simbolo del seme, quindi il
 * layer "nomi delle nazioni" (disattivo di default) aggiunge i nomi accanto a
 * ciascun simbolo senza coprire nulla di disegnato.
 */
export const blackcloverNations: Nation[] = [
  {
    id: 'nation-bc-clover',
    worldId: 'world-blackclover',
    name: 'Clover Kingdom',
    localizedName: {
      it: 'Regno di Clover',
      en: 'Clover Kingdom',
      ja: 'クローバー王国',
      fr: 'Royaume de Clover',
      de: 'Königreich Clover',
      es: 'Reino del Trébol',
    },
    japaneseName: 'クローバー王国',
    type: 'great_nation',
    description: {
      it: "Il regno protagonista della storia: retto dal Re Augustus Kira Clover XIII ma difeso davvero dai nove ordini dei Cavalieri Magici, guidati dall'Imperatore Magico.",
      en: "The kingdom at the heart of the story: nominally ruled by King Augustus Kira Clover XIII but actually defended by the nine Magic Knight squads, led by the Wizard King.",
    },
    descriptionLong: {
      it: "Diviso in tre fasce sociali rigidissime — Regno Nobile, Regno Comune e Regno Abbandonato — il Regno di Clover fa della quantità di mana la misura del valore di una persona. È il paese dove Asta, nato senza magia nel villaggio più povero del confine, e Yuno, prodigio del vento cresciuto nello stesso orfanotrofio, decidono di diventare Imperatore Magico. Nella Capitale Reale si trovano il castello, il Parlamento Magico e la Torre dei Grimori, dove ogni quindicenne riceve il proprio grimorio.",
      en: "Split into three rigid social bands — the Noble Realm, the Common Realm and the Forsaken Realm — the Clover Kingdom measures a person's worth by the amount of mana they hold. It is the country where Asta, born without magic in the poorest border village, and Yuno, a wind prodigy raised in the same orphanage, both set out to become Wizard King. The Royal Capital holds the castle, the Magic Parliament and the Grimoire Tower, where every fifteen-year-old receives their grimoire.",
    },
    capitalLocationId: 'loc-bc-royal-capital',
    labelPosition: { x: 672, y: 706 },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    color: BLACKCLOVER_KINGDOM_COLORS.clover,
    tags: ['regno', 'clover', 'cavalieri-magici'],
  },
  {
    id: 'nation-bc-diamond',
    worldId: 'world-blackclover',
    name: 'Diamond Kingdom',
    localizedName: {
      it: 'Regno di Diamond',
      en: 'Diamond Kingdom',
      ja: 'ダイヤモンド王国',
      fr: 'Royaume de Diamond',
      de: 'Königreich Diamond',
      es: 'Reino del Diamante',
    },
    japaneseName: 'ダイヤモンド王国',
    type: 'great_nation',
    description: {
      it: 'Stato militarista a est di Clover, retto da un re assente e dai suoi otto Maghi Guerrieri: cresce i propri maghi come armi e attacca ciclicamente la città di confine di Kiten.',
      en: 'A militarist state east of Clover, ruled by an absent king and his eight Mage Warriors: it raises its mages as weapons and periodically attacks the border city of Kiten.',
    },
    descriptionLong: {
      it: "Il Regno di Diamond costruisce la propria forza su un programma di potenziamento spietato: bambini strappati alle famiglie, addestrati in accademie militari e modificati nei laboratori del ricercatore Moris Libardirt. Da qui vengono Mars e Fana, Ladros e i Maghi Guerrieri; da qui è fuggito Fanzell Kruger, ex istruttore capo che ha disertato dopo aver capito che stava fabbricando armi, non maghi.",
      en: "The Diamond Kingdom builds its strength on a ruthless enhancement program: children taken from their families, trained in military academies and modified in the laboratories of the researcher Moris Libardirt. Mars and Fana, Ladros and the Mage Warriors all come from here — and from here Fanzell Kruger fled, the former head instructor who defected once he realised he was manufacturing weapons, not mages.",
    },
    capitalLocationId: 'loc-bc-diamond-capital',
    labelPosition: { x: 1008, y: 626 },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    color: BLACKCLOVER_KINGDOM_COLORS.diamond,
    tags: ['regno', 'diamond', 'maghi-guerrieri'],
  },
  {
    id: 'nation-bc-spade',
    worldId: 'world-blackclover',
    name: 'Spade Kingdom',
    localizedName: {
      it: 'Regno di Spade',
      en: 'Spade Kingdom',
      ja: 'スペード王国',
      fr: 'Royaume de Spade',
      de: 'Königreich Spade',
      es: 'Reino de Picas',
    },
    japaneseName: 'スペード王国',
    type: 'great_nation',
    description: {
      it: 'Il regno più a nord, caduto nelle mani della Triade Oscura: i fratelli Zogratis, ognuno legato per patto a uno dei diavoli di rango più alto dell\'Inframondo.',
      en: 'The northernmost kingdom, fallen into the hands of the Dark Triad: the Zogratis siblings, each bound by pact to one of the Underworld\'s highest-ranking devils.',
    },
    descriptionLong: {
      it: "Un tempo monarchia come le altre, Spade è stata rovesciata dal colpo di stato dei fratelli Zogratis — Dante, Vanica e Zenon — che ne hanno sterminato la casa reale (compresa la famiglia Grinberryall, da cui proviene Yuno) e trasformato il paese in un cantiere per l'Albero di Qliphoth, il rituale che deve aprire la porta dell'Inframondo. La popolazione è ridotta in miseria e i prigionieri vengono usati come carburante magico.",
      en: "Once a monarchy like the others, Spade was overthrown in the Zogratis siblings' coup — Dante, Vanica and Zenon — who wiped out its royal house (including the Grinberryall family Yuno comes from) and turned the country into a worksite for the Tree of Qliphoth, the ritual meant to open the gate to the Underworld. The population is left in destitution and prisoners are used as magical fuel.",
    },
    capitalLocationId: 'loc-bc-spade-castle',
    labelPosition: { x: 655, y: 210 },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    color: BLACKCLOVER_KINGDOM_COLORS.spade,
    tags: ['regno', 'spade', 'triade-oscura'],
  },
  {
    id: 'nation-bc-heart',
    worldId: 'world-blackclover',
    name: 'Heart Kingdom',
    localizedName: {
      it: 'Regno di Heart',
      en: 'Heart Kingdom',
      ja: 'ハート王国',
      fr: 'Royaume de Heart',
      de: 'Königreich Heart',
      es: 'Reino del Corazón',
    },
    japaneseName: 'ハート王国',
    type: 'great_nation',
    description: {
      it: "Regno a ovest immerso in una Zona Magica Suprema che moltiplica il mana: governato dalla principessa Lolopechka e difeso dai suoi Spirit Guardian, ciascuno legato a uno spirito elementale.",
      en: 'A western kingdom immersed in a Grand Magic Zone that multiplies mana: ruled by Princess Lolopechka and defended by her Spirit Guardians, each bound to an elemental spirit.',
    },
    descriptionLong: {
      it: "L'enorme concentrazione di mana del suo territorio rende Heart il posto ideale per allenarsi, e per questo Lolopechka stringe alleanza con il Regno di Clover in funzione anti-Spade. La principessa porta addosso la maledizione di Megicula, il diavolo che le ha già ucciso la madre e le lascia pochi anni di vita: liberarsene è il vero motore della sua alleanza.",
      en: "The huge mana concentration of its territory makes Heart the ideal place to train, which is why Lolopechka allies with the Clover Kingdom against Spade. The princess carries Megicula's curse — the devil that already killed her mother and leaves her only a few years to live: breaking it is the real driver behind her alliance.",
    },
    capitalLocationId: 'loc-bc-heart-capital',
    labelPosition: { x: 243, y: 622 },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    color: BLACKCLOVER_KINGDOM_COLORS.heart,
    tags: ['regno', 'heart', 'spirit-guardian'],
  },
  {
    id: 'nation-bc-elysia',
    worldId: 'world-blackclover',
    name: 'Elysia',
    localizedName: { it: 'Elysia', en: 'Elysia' },
    japaneseName: 'エリシア',
    type: 'neutral_land',
    description: {
      it: "Il villaggio nascosto dove vivono gli elfi tornati in vita dopo la Reincarnazione: un rifugio neutrale, fuori dai confini dei quattro regni.",
      en: 'The hidden village where the elves live after coming back to life following the Reincarnation: a neutral refuge, outside the borders of the four kingdoms.',
    },
    descriptionLong: {
      it: "Fondato da Licht e Patry con i bambini elfici riportati in vita da Secre e dal Chiaro di Luna, Elysia è insieme casa e campo di prova: chi vuole allenarsi lì deve prima superare i giochi degli elfi. È qui che Magna Swing passa il proprio addestramento prima dell'invasione del Regno di Spade.",
      en: "Founded by Licht and Patry with the elf children brought back to life by Secre and the Moonlight, Elysia is both a home and a proving ground: whoever wants to train there must first get through the elves' games. It is here that Magna Swing spends his training before the invasion of the Spade Kingdom.",
    },
    capitalLocationId: 'loc-bc-elysia',
    labelPosition: { x: 200, y: 302 },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    color: BLACKCLOVER_KINGDOM_COLORS.neutral,
    tags: ['elfi', 'villaggio-nascosto'],
  },
  {
    id: 'nation-bc-hino',
    worldId: 'world-blackclover',
    name: 'Land of the Sun',
    localizedName: {
      it: 'Paese del Sole (Hino)',
      en: 'Land of the Sun (Hino)',
      ja: '日ノ国',
      fr: 'Pays du Soleil',
      de: 'Land der Sonne',
      es: 'País del Sol',
    },
    japaneseName: '日ノ国',
    type: 'minor_nation',
    description: {
      it: "Paese isolato a oriente, patria di Yami Sukehiro: protetto da una barriera, coltiva l'arte del ki e della spada invece della magia dei grimori.",
      en: "An isolated country to the east, Yami Sukehiro's homeland: shielded by a barrier, it cultivates the art of ki and the sword instead of grimoire magic.",
    },
    descriptionLong: {
      it: "Retto dallo shōgun Ryūya Ryūdō e difeso dai Sette Ryūzen, il Paese del Sole percepisce il ki degli avversari e combatte con tecniche di spada anziché con incantesimi. Asta vi arriva quasi morto dopo la sconfitta contro Dante e vi impara lo Zetten, la tecnica che gli permetterà di tagliare la magia con il proprio corpo.",
      en: "Ruled by Shogun Ryuya Ryudo and defended by the Ryuzen Seven, the Land of the Sun reads its opponents' ki and fights with sword techniques rather than spells. Asta arrives there half-dead after his defeat by Dante and learns Zetten, the technique that will let him cut magic with his own body.",
    },
    capitalLocationId: 'loc-bc-hino-country',
    labelPosition: { x: 1120, y: 742 },
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    color: BLACKCLOVER_KINGDOM_COLORS.neutral,
    tags: ['paese-del-sole', 'ki', 'yami'],
  },
  {
    id: 'nation-bc-neutral',
    worldId: 'world-blackclover',
    name: 'Neutral territories',
    localizedName: {
      it: 'Territori neutrali',
      en: 'Neutral territories',
      ja: '中立地帯',
      fr: 'Territoires neutres',
      de: 'Neutrale Gebiete',
      es: 'Territorios neutrales',
    },
    type: 'neutral_land',
    description: {
      it: 'Le terre di nessuno fra i quattro regni: la Foresta delle Streghe, il Tempio Sottomarino e i dungeon, antiche rovine piene di magia e di trappole.',
      en: "The no-man's-lands between the four kingdoms: the Witches' Forest, the Undersea Temple and the dungeons, ancient ruins full of magic and traps.",
    },
    descriptionLong: {
      it: "Nessuno dei quattro regni controlla davvero questi luoghi: la Foresta delle Streghe è uno stato a sé retto dalla Regina delle Streghe, il Tempio Sottomarino vive isolato in fondo al mare da secoli, e i dungeon — costruzioni antichissime piene di tesori e magia — compaiono e vengono contesi ogni volta che se ne scopre uno.",
      en: "None of the four kingdoms truly controls these places: the Witches' Forest is a state of its own under the Witch Queen, the Undersea Temple has lived isolated at the bottom of the sea for centuries, and the dungeons — extremely ancient structures full of treasure and magic — are fought over every time one is discovered.",
    },
    labelPosition: { x: 452, y: 792 },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    color: BLACKCLOVER_KINGDOM_COLORS.neutral,
    tags: ['neutrale', 'dungeon', 'streghe'],
  },
  {
    id: 'nation-bc-underworld',
    worldId: 'world-blackclover',
    name: 'Underworld',
    localizedName: {
      it: 'Inframondo',
      en: 'Underworld',
      ja: '冥界',
      fr: 'Monde souterrain',
      de: 'Unterwelt',
      es: 'Inframundo',
    },
    japaneseName: '冥界',
    type: 'uncertain',
    description: {
      it: 'Il regno dei diavoli oltre la porta: sette livelli di potere crescente, dal primo dei diavoli minori al settimo, dominio di Lucifero.',
      en: "The devils' realm beyond the gate: seven levels of increasing power, from the first of the lesser devils to the seventh, Lucifero's domain.",
    },
    descriptionLong: {
      it: "Separato dal mondo umano da una porta che solo rituali come l'Albero di Qliphoth possono forzare, l'Inframondo è organizzato in una gerarchia rigida: più alto è il livello, più potente è il diavolo che vi risiede. Da lì provengono Liebe, il diavolo dell'anti-magia legato ad Asta, e i tre diavoli di vertice — Lucifero, Beelzebub e Astaroth — che i fratelli Zogratis richiamano nel mondo umano.",
      en: "Separated from the human world by a gate that only rituals like the Tree of Qliphoth can force open, the Underworld is organised in a strict hierarchy: the higher the level, the more powerful the devil who lives there. From it come Liebe, the anti-magic devil bound to Asta, and the three highest devils — Lucifero, Beelzebub and Astaroth — that the Zogratis siblings summon into the human world.",
    },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    color: BLACKCLOVER_KINGDOM_COLORS.underworld,
    tags: ['diavoli', 'inframondo'],
  },
];
