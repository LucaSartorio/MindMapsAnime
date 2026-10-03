import type { Jutsu, Localizable } from '@/types';

type Lineage = Jutsu['chakraNature'];

const ab = (
  id: string,
  name: string,
  type: string,
  lineage: Lineage,
  characterIds: string[],
  shortDescription: Localizable,
  extra: Partial<Jutsu> = {},
): Jutsu => ({
  id: `tec-jjk-${id}`,
  worldId: 'world-jujutsukaisen',
  name,
  type,
  chakraNature: lineage,
  characterIds: characterIds.map((c) => `char-jjk-${c}`),
  shortDescription,
  canonStatus: 'canon',
  referenceStatus: 'verified',
  ...extra,
});

const GOJO: Lineage = ['gojo_clan'];
const ZENIN: Lineage = ['zenin_clan'];
const KAMO: Lineage = ['kamo_clan'];
const SUKUNA: Lineage = ['sukuna'];
const SPIRIT: Lineage = ['cursed_spirit'];
const USER: Lineage = ['curse_user'];
const REINC: Lineage = ['reincarnated'];
const SORC: Lineage = ['sorcerer'];

/**
 * Tecniche di Jujutsu Kaisen (`WorldDataset.jutsu`, termine UI «Tecniche Malefiche»).
 * Due facet, definiti in `config.ts`:
 *  - `type` = la CATEGORIA: tecnica innata, estensione, espansione del dominio, arti
 *    dell'energia malefica, barriere, vincolo celeste, shikigami, strumenti e oggetti maledetti;
 *  - `chakraNature` = la STIRPE o FONTE: i clan Gojo, Zen'in e Kamo, Sukuna, gli spiriti
 *    maledetti, gli utilizzatori di maledizioni, gli stregoni reincarnati, gli stregoni.
 */
export const jjkAbilities: Jutsu[] = [
  /* ============================ LE BASI DELL'OCCULTO ============================ */
  ab('cursed-energy', 'Cursed energy', 'fundamental', SORC, ['yuji', 'gojo', 'megumi', 'nobara', 'nanami', 'yuta', 'sukuna'], {
    it: "L'energia che nasce dalle emozioni negative degli esseri umani. Chi non sa controllarla genera spiriti maledetti senza volerlo; gli stregoni la incanalano per combattere e per alimentare la propria tecnica.",
    en: 'The energy born from human beings\' negative emotions. Those who cannot control it give rise to cursed spirits without meaning to; sorcerers channel it to fight and to power their technique.',
  }, { localizedName: { it: 'Energia malefica', en: 'Cursed energy', ja: '呪力' }, japaneseName: '呪力', tags: ['basi'] }),
  ab('reverse-cursed-technique', 'Reverse Cursed Technique', 'fundamental', SORC, ['gojo', 'shoko', 'sukuna', 'yuta', 'kenjaku'], {
    it: "Moltiplicare l'energia malefica per sé stessa per ottenere energia positiva: rigenera il corpo. Pochissimi la padroneggiano, e solo Shoko e Yuta sanno usarla anche sugli altri.",
    en: 'Multiplying cursed energy by itself to obtain positive energy: it regenerates the body. Very few master it, and only Shoko and Yuta can use it on others as well.',
  }, { localizedName: { it: 'Tecnica malefica inversa', en: 'Reverse Cursed Technique', ja: '反転術式' }, japaneseName: '反転術式', tags: ['basi', 'guarigione'] }),
  ab('black-flash', 'Black Flash', 'fundamental', SORC, ['yuji', 'todo', 'nanami', 'mahito', 'sukuna', 'yuta'], {
    it: "Quando l'energia malefica colpisce entro un milionesimo di secondo dall'impatto, lo spazio si distorce e il colpo vale 2,5 volte: la scintilla diventa nera. Nessuno sa farlo a comando; chi ci riesce entra in uno stato di grazia.",
    en: 'When cursed energy hits within a millionth of a second of the impact, space distorts and the blow lands at 2.5 times its power: the spark turns black. No one can do it on command; those who succeed enter a state of grace.',
  }, { localizedName: { it: 'Black Flash', en: 'Black Flash', ja: '黒閃' }, japaneseName: '黒閃', tags: ['basi'] }),
  ab('domain-expansion', 'Domain Expansion', 'domain', SORC, ['gojo', 'sukuna', 'megumi', 'mahito', 'jogo', 'hakari', 'higuruma', 'yuta', 'yuji', 'kenjaku', 'dagon'], {
    it: "L'apice dell'occulto: lo stregone proietta il proprio mondo interiore in una barriera, e dentro la sua tecnica colpisce senza mai mancare il bersaglio. Due domini che si incontrano lottano per la supremazia.",
    en: 'The pinnacle of jujutsu: the sorcerer projects their inner world into a barrier, and within it their technique strikes without ever missing. Two domains that meet fight for supremacy.',
  }, { localizedName: { it: 'Espansione del dominio', en: 'Domain Expansion', ja: '領域展開' }, japaneseName: '領域展開', tags: ['domini'] }),
  ab('simple-domain', 'Simple Domain', 'barrier', SORC, ['miwa', 'kusakabe'], {
    it: "Un piccolo spazio difensivo che neutralizza l'effetto di colpo certo di un dominio nemico: inventato per i deboli, si tramanda nella scuola della Nuova Ombra.",
    en: "A small defensive space that neutralises an enemy domain's sure-hit effect: invented for the weak, it is handed down in the New Shadow School.",
  }, { localizedName: { it: 'Dominio semplice', en: 'Simple Domain', ja: '簡易領域' }, japaneseName: '簡易領域', tags: ['barriere', 'nuova-ombra'] }),
  ab('curtain', 'Curtain', 'barrier', SORC, ['ijichi', 'kenjaku', 'tengen'], {
    it: "Il Velo: una barriera nera che nasconde i combattimenti agli occhi della gente. A Shibuya Kenjaku ne usa una versione che lascia entrare i civili e non li fa uscire.",
    en: 'The Veil: a black barrier that hides fights from people\'s eyes. At Shibuya Kenjaku uses a version that lets civilians in and does not let them out.',
  }, { localizedName: { it: 'Velo', en: 'Curtain', ja: '帳' }, japaneseName: '帳', tags: ['barriere', 'shibuya'] }),
  ab('binding-vow', 'Binding Vow', 'fundamental', SORC, ['yuji', 'sukuna', 'nanami', 'mechamaru', 'kenjaku'], {
    it: "Un patto con sé stessi o con altri che dà potere in cambio di una restrizione — e punisce chi lo infrange. È con un vincolo estorto a Yuji che Sukuna riesce a prendersi il corpo di Megumi.",
    en: "A pact with oneself or with others that grants power in exchange for a restriction — and punishes those who break it. It is through a vow extorted from Yuji that Sukuna manages to take Megumi's body.",
  }, { localizedName: { it: 'Vincolo', en: 'Binding Vow', ja: '縛り' }, japaneseName: '縛り', tags: ['basi'] }),
  ab('heavenly-restriction', 'Heavenly Restriction', 'heavenly_restriction', SORC, ['toji', 'maki', 'mechamaru'], {
    it: "Un vincolo imposto dalla nascita: si perde qualcosa e si guadagna altro. Toji e Maki rinunciano all'energia malefica per un corpo sovrumano; Mechamaru ha un corpo fragilissimo e un'energia enorme.",
    en: 'A restriction imposed from birth: one loses something and gains something else. Toji and Maki give up cursed energy for a superhuman body; Mechamaru has an extremely frail body and enormous energy.',
  }, { localizedName: { it: 'Vincolo celeste', en: 'Heavenly Restriction', ja: '天与呪縛' }, japaneseName: '天与呪縛', tags: ['vincolo-celeste'] }),
  /* ================================ GOJO ================================ */
  ab('limitless', 'Limitless', 'innate', GOJO, ['gojo', 'yuta'], {
    it: "La tecnica ereditaria del clan Gojo, che porta nel mondo reale il concetto di infinito. Senza i Sei Occhi è quasi impossibile da controllare; con essi rende Gojo intoccabile.",
    en: 'The Gojo clan\'s hereditary technique, which brings the concept of infinity into the real world. Without the Six Eyes it is almost impossible to control; with them it makes Gojo untouchable.',
  }, { localizedName: { it: 'Illimitato', en: 'Limitless', ja: '無下限呪術' }, japaneseName: '無下限呪術', tags: ['gojo'] }),
  ab('six-eyes', 'Six Eyes', 'innate', GOJO, ['gojo'], {
    it: "Gli occhi che vedono l'energia malefica nei minimi dettagli e permettono di usarla con un'efficienza quasi perfetta. Gojo li copre con una benda: vedono troppo.",
    en: 'The eyes that see cursed energy in the finest detail and allow it to be used with almost perfect efficiency. Gojo covers them with a blindfold: they see too much.',
  }, { localizedName: { it: 'Sei Occhi', en: 'Six Eyes', ja: '六眼' }, japaneseName: '六眼', tags: ['gojo'] }),
  ab('infinity', 'Infinity', 'extension', GOJO, ['gojo'], {
    it: "Uno spazio infinito fra Gojo e ciò che si avvicina: tutto rallenta fino a non arrivare mai. Solo un dominio che lo raggiunga, o una tecnica che lo annulli, può toccarlo.",
    en: 'An infinite space between Gojo and whatever approaches: everything slows until it never arrives. Only a domain that reaches him, or a technique that cancels it, can touch him.',
  }, { localizedName: { it: 'Infinito', en: 'Infinity', ja: '無下限' }, japaneseName: '無下限', tags: ['gojo', 'difesa'] }),
  ab('blue', 'Blue', 'extension', GOJO, ['gojo'], {
    it: "L'infinito «amplificato» in un punto: una forza che attira tutto verso di sé. Gojo lo usa anche per spostarsi a velocità impossibili.",
    en: "Infinity 'amplified' at a point: a force that pulls everything towards itself. Gojo also uses it to move at impossible speeds.",
  }, { localizedName: { it: 'Blu', en: 'Blue', ja: '術式順転「蒼」' }, japaneseName: '術式順転「蒼」', tags: ['gojo'] }),
  ab('red', 'Red', 'extension', GOJO, ['gojo'], {
    it: "La tecnica inversa applicata all'Illimitato: una forza che respinge con violenza tutto ciò che incontra. Gojo la ottiene padroneggiando la tecnica inversa nel 2006.",
    en: 'The reverse technique applied to Limitless: a force that violently repels everything it meets. Gojo obtains it by mastering the reverse technique in 2006.',
  }, { localizedName: { it: 'Rosso', en: 'Red', ja: '術式反転「赫」' }, japaneseName: '術式反転「赫」', tags: ['gojo'] }),
  ab('hollow-purple', 'Hollow Purple', 'extension', GOJO, ['gojo', 'yuta'], {
    it: "Blu e Rosso fusi in una massa immaginaria che cancella tutto ciò che attraversa. Gojo la usa per uccidere Toji e, nella forma a 200%, contro Sukuna.",
    en: 'Blue and Red fused into an imaginary mass that erases everything in its path. Gojo uses it to kill Toji and, in its 200% form, against Sukuna.',
  }, { localizedName: { it: 'Viola cavo', en: 'Hollow Purple', ja: '虚式「茈」' }, japaneseName: '虚式「茈」', tags: ['gojo'] }),
  ab('unlimited-void', 'Unlimited Void', 'domain', GOJO, ['gojo'], {
    it: "Il dominio di Gojo: un vuoto infinito che inonda chi è dentro di informazioni senza fine, paralizzandolo. A Shibuya lo apre per soli 0,2 secondi per non uccidere i civili.",
    en: "Gojo's domain: an infinite void that floods those inside with endless information, paralysing them. At Shibuya he opens it for just 0.2 seconds so as not to kill the civilians.",
  }, { localizedName: { it: 'Vuoto Infinito', en: 'Unlimited Void', ja: '無量空処' }, japaneseName: '無量空処', tags: ['gojo', 'domini'] }),
  /* ================================ SUKUNA ================================ */
  ab('shrine', 'Shrine (Dismantle and Cleave)', 'innate', SUKUNA, ['sukuna', 'yuji'], {
    it: "La tecnica di Sukuna: Smantellamento, un fendente a distanza, e Fendente, un taglio che si adatta alla resistenza del bersaglio. Alla fine Yuji, il cui corpo ne porta l'impronta, impara a usarla.",
    en: "Sukuna's technique: Dismantle, a ranged slash, and Cleave, a cut that adapts to the target's toughness. In the end Yuji, whose body bears its imprint, learns to use it.",
  }, { localizedName: { it: 'Santuario (Smantellamento e Fendente)', en: 'Shrine (Dismantle and Cleave)', ja: '御廚子（解・捌）' }, japaneseName: '御廚子', tags: ['sukuna'] }),
  ab('malevolent-shrine', 'Malevolent Shrine', 'domain', SUKUNA, ['sukuna'], {
    it: "Il dominio di Sukuna, che non ha bisogno di una barriera: un tempio di bocche e ossa che taglia senza sosta tutto ciò che si trova nel suo raggio. A Shibuya rade al suolo il quartiere.",
    en: "Sukuna's domain, which needs no barrier: a shrine of mouths and bones that ceaselessly slashes everything within its range. At Shibuya it razes the ward.",
  }, { localizedName: { it: 'Santuario Malefico', en: 'Malevolent Shrine', ja: '伏魔御廚子' }, japaneseName: '伏魔御廚子', tags: ['sukuna', 'domini'] }),
  ab('fuga', 'Fuga (Divine Flame)', 'extension', SUKUNA, ['sukuna'], {
    it: "La fiamma con cui Sukuna chiude i combattimenti più importanti: una freccia di fuoco che incenerisce il bersaglio. Uccide Mahoraga a Shibuya; a Shinjuku Choso muore facendone da scudo a Yuji.",
    en: 'The flame with which Sukuna ends his most important fights: an arrow of fire that incinerates the target. It kills Mahoraga at Shibuya; in Shinjuku Choso dies shielding Yuji from it.',
  }, { localizedName: { it: 'Fuga (Fiamma divina)', en: 'Fuga (Divine Flame)', ja: '竈・開' }, japaneseName: '竈', tags: ['sukuna', 'fuoco'] }),
  ab('world-cutting-slash', 'World-Cutting Slash', 'extension', SUKUNA, ['sukuna'], {
    it: "Un fendente che non taglia il bersaglio ma lo spazio stesso, e quindi attraversa anche l'Infinito. Sukuna lo trova osservando come Mahoraga si adattava all'Infinito, e con esso uccide Gojo.",
    en: 'A slash that cuts not the target but space itself, and so passes through Infinity as well. Sukuna finds it by observing how Mahoraga adapted to Infinity, and with it he kills Gojo.',
  }, { localizedName: { it: 'Fendente che taglia il mondo', en: 'World-Cutting Slash', ja: '世界を断つ斬撃' }, tags: ['sukuna', 'shinjuku'] }),
  /* =============================== DIECI OMBRE =============================== */
  ab('ten-shadows', 'Ten Shadows Technique', 'innate', ZENIN, ['megumi', 'sukuna'], {
    it: "La tecnica ereditaria più ambita degli Zen'in: con le mani si evocano dieci shikigami dall'ombra. Uno shikigami distrutto passa i suoi poteri ai successivi. Sukuna vuole Megumi proprio per lei.",
    en: "The Zen'in's most coveted hereditary technique: hand signs summon ten shikigami from the shadows. A destroyed shikigami passes its powers to the next ones. Sukuna wants Megumi precisely for it.",
  }, { localizedName: { it: 'Tecnica delle Dieci Ombre', en: 'Ten Shadows Technique', ja: '十種影法術' }, japaneseName: '十種影法術', tags: ['zenin', 'shikigami'] }),
  ab('divine-dogs', 'Divine Dogs', 'shikigami', ZENIN, ['megumi'], {
    it: "I primi shikigami di Megumi, un cane bianco e uno nero. Quando il bianco viene distrutto, il nero ne eredita la forza; più tardi diventano il Cane divino: Totalità.",
    en: "Megumi's first shikigami, a white dog and a black one. When the white one is destroyed, the black inherits its strength; later they become Divine Dog: Totality.",
  }, { localizedName: { it: 'Cani divini', en: 'Divine Dogs', ja: '玉犬' }, japaneseName: '玉犬', tags: ['shikigami'] }),
  ab('nue', 'Nue', 'shikigami', ZENIN, ['megumi'], {
    it: "Lo shikigami alato delle Dieci Ombre: porta Megumi in volo e colpisce con scariche elettriche.",
    en: 'The winged shikigami of the Ten Shadows: it carries Megumi through the air and strikes with electric discharges.',
  }, { localizedName: { it: 'Nue', en: 'Nue', ja: '鵺' }, japaneseName: '鵺', tags: ['shikigami'] }),
  ab('max-elephant', 'Max Elephant', 'shikigami', ZENIN, ['megumi'], {
    it: "Un elefante che riversa sul nemico enormi quantità d'acqua, abbastanza da travolgere e schiacciare un avversario: uno degli shikigami più pesanti di Megumi.",
    en: 'An elephant that pours huge quantities of water onto the enemy, enough to sweep away and crush an opponent: one of Megumi\'s heaviest shikigami.',
  }, { localizedName: { it: 'Max Elephant', en: 'Max Elephant', ja: '満象' }, japaneseName: '満象', tags: ['shikigami'] }),
  ab('mahoraga', 'Eight-Handled Sword Divergent Sila Divine General Mahoraga', 'shikigami', ZENIN, ['megumi', 'sukuna'], {
    it: "Il più potente degli shikigami delle Dieci Ombre, che nessun Zen'in ha mai domato: si adatta a qualunque fenomeno. Megumi lo evoca a Shibuya per morire insieme al nemico; Sukuna lo distrugge, poi lo usa contro Gojo.",
    en: "The most powerful of the Ten Shadows' shikigami, which no Zen'in has ever tamed: it adapts to any phenomenon. Megumi summons it at Shibuya to die together with his enemy; Sukuna destroys it, then uses it against Gojo.",
  }, { localizedName: { it: 'Mahoraga', en: 'Mahoraga', ja: '八握剣異戒神将魔虚羅' }, japaneseName: '八握剣異戒神将魔虚羅', tags: ['shikigami', 'adattamento'] }),
  ab('chimera-shadow-garden', 'Chimera Shadow Garden', 'domain', ZENIN, ['megumi'], {
    it: "Il dominio incompleto di Megumi: inonda lo spazio d'ombra da cui può evocare più shikigami e copie di sé. A Shibuya lo apre dentro il dominio di Dagon, e il varco permette a Toji di entrare.",
    en: "Megumi's incomplete domain: it floods the space with shadow from which he can summon several shikigami and copies of himself. At Shibuya he opens it inside Dagon's domain, and the gap lets Toji in.",
  }, { localizedName: { it: 'Giardino delle Ombre Chimera', en: 'Chimera Shadow Garden', ja: '嵌合暗翳庭' }, japaneseName: '嵌合暗翳庭', tags: ['domini'] }),
  /* ============================ STUDENTI DI TOKYO ============================ */
  ab('divergent-fist', 'Divergent Fist', 'fundamental', SORC, ['yuji'], {
    it: "Il colpo di Yuji: il corpo è così veloce che l'energia malefica arriva un attimo dopo il pugno, con un secondo impatto. Nasce da un difetto e diventa la sua firma.",
    en: "Yuji's blow: his body is so fast that the cursed energy arrives a moment after the punch, with a second impact. Born from a flaw, it becomes his signature.",
  }, { longDescription: { it: "Todo gli insegna che è un'abitudine da superare: solo quando energia e colpo arrivano insieme si apre la strada al Black Flash, che Yuji raggiunge durante l'Evento di Scambio contro Hanami.", en: "Todo teaches him it is a habit to overcome: only when energy and blow land together does the way open to Black Flash, which Yuji reaches during the Goodwill Event against Hanami." }, localizedName: { it: 'Pugno divergente', en: 'Divergent Fist', ja: '逕庭拳' }, japaneseName: '逕庭拳', tags: ['yuji'] }),
  ab('straw-doll', 'Straw Doll Technique', 'innate', SORC, ['nobara'], {
    it: "Chiodi, martello e una bambola di paglia: Nobara pianta i chiodi caricati di energia malefica, e la Risonanza colpisce l'anima del nemico attraverso un pezzo del suo corpo. Il Fermaglio fa esplodere i chiodi.",
    en: "Nails, hammer and a straw doll: Nobara drives in nails charged with cursed energy, and Resonance strikes the enemy's soul through a piece of its body. Hairpin makes the nails explode.",
  }, { longDescription: { it: "Nobara la usa contro Eso e Kechizu al ponte Yasohachi e, a Shinjuku, attraverso un dito di Sukuna.", en: "Nobara uses it against Eso and Kechizu at Yasohachi Bridge and, in Shinjuku, through one of Sukuna's fingers." }, localizedName: { it: 'Tecnica della bambola di paglia', en: 'Straw Doll Technique', ja: '芻霊呪法' }, japaneseName: '芻霊呪法', tags: ['nobara'] }),
  ab('cursed-speech', 'Cursed Speech', 'innate', SORC, ['toge'], {
    it: "La tecnica ereditaria del clan Inumaki: ogni parola diventa un ordine — «fermati», «esplodi», «dormi». Ordini troppo forti per il bersaglio feriscono la gola di chi li pronuncia.",
    en: "The Inumaki clan's hereditary technique: every word becomes a command — 'stop', 'explode', 'sleep'. Commands too strong for the target hurt the speaker's throat.",
  }, { longDescription: { it: "Per non maledire nessuno per sbaglio Toge parla solo con ingredienti di onigiri. A Shibuya perde il braccio sinistro.", en: "So as not to curse anyone by mistake, Toge speaks only in rice-ball fillings. At Shibuya he loses his left arm." }, localizedName: { it: 'Discorso maledetto', en: 'Cursed Speech', ja: '呪言' }, japaneseName: '呪言', tags: ['toge'] }),
  ab('cursed-corpse', 'Abrupt Mutated Cursed Corpse', 'innate', SORC, ['panda', 'yaga'], {
    it: "I fantocci animati dall'energia malefica che il preside Yaga sa creare; Panda è l'unico con una coscienza propria, grazie a tre nuclei che si influenzano a vicenda.",
    en: 'The puppets animated by cursed energy that principal Yaga knows how to create; Panda is the only one with a consciousness of its own, thanks to three cores that influence one another.',
  }, { localizedName: { it: 'Corpo maledetto mutante', en: 'Abrupt Mutated Cursed Corpse', ja: '突然変異呪骸' }, japaneseName: '突然変異呪骸', tags: ['panda', 'yaga'] }),
  ab('copy', 'Copy', 'innate', SORC, ['yuta'], {
    it: "La tecnica di Yuta: copia la tecnica degli altri attraverso Rika. Gli permette di usare il Discorso maledetto, la tecnica inversa sugli altri e perfino quella di Kenjaku per entrare nel corpo di Gojo.",
    en: "Yuta's technique: it copies others' techniques through Rika. It lets him use Cursed Speech, the reverse technique on others and even Kenjaku's to enter Gojo's body.",
  }, { longDescription: { it: "Alla fine del prequel si scopre che era stato Yuta a maledire Rika, non il contrario: è un lontano discendente di Sugawara no Michizane, come Gojo.", en: "At the end of the prequel it turns out that Yuta had cursed Rika, not the other way round: he is a distant descendant of Sugawara no Michizane, like Gojo." }, localizedName: { it: 'Copia', en: 'Copy', ja: '模倣' }, japaneseName: '模倣', tags: ['yuta'] }),
  ab('authentic-mutual-love', 'Authentic Mutual Love', 'domain', SORC, ['yuta'], {
    it: "Il dominio di Yuta: un campo di spade conficcate nel terreno, ciascuna con una delle tecniche che ha copiato, pronte a essere usate.",
    en: "Yuta's domain: a field of swords stuck in the ground, each holding one of the techniques he has copied, ready to be used.",
  }, { longDescription: { it: "Yuta lo espande durante lo Scontro di Shinjuku contro Sukuna, quando gli stregoni lo affrontano a turno dopo la morte di Gojo.", en: "Yuta expands it during the Shinjuku Showdown against Sukuna, when the sorcerers face him in turns after Gojo's death." }, localizedName: { it: 'Amore reciproco autentico', en: 'Authentic Mutual Love', ja: '真贋相愛' }, japaneseName: '真贋相愛', tags: ['yuta', 'domini'] }),
  ab('ratio', 'Ratio Technique', 'innate', SORC, ['nanami'], {
    it: "Nanami divide il bersaglio in dieci parti con una linea immaginaria: un colpo nel punto dei 7 a 3 diventa critico. Dopo l'orario di lavoro, con il vincolo dello Straordinario, diventa ancora più forte.",
    en: 'Nanami divides the target into ten parts with an imaginary line: a blow at the 7:3 point becomes critical. After working hours, through the Overtime vow, he becomes even stronger.',
  }, { longDescription: { it: "Con l'estensione Crollo distrugge le strutture colpendone il punto debole e seppellisce il nemico sotto le macerie.", en: "With the Collapse extension he destroys structures by striking their weak point and buries the enemy under the rubble." }, localizedName: { it: 'Tecnica del rapporto', en: 'Ratio Technique', ja: '十劃呪法' }, japaneseName: '十劃呪法', tags: ['nanami'] }),
  ab('idle-death-gamble', 'Idle Death Gamble', 'domain', SORC, ['hakari'], {
    it: "Il dominio di Hakari è una slot machine con le regole di un manga sul pachinko: al jackpot ottiene energia malefica infinita e quattro minuti e undici secondi in cui guarisce da qualunque ferita.",
    en: "Hakari's domain is a slot machine with the rules of a pachinko manga: on a jackpot he gains infinite cursed energy and four minutes and eleven seconds in which he heals from any wound.",
  }, { longDescription: { it: "Il colpo certo del dominio non ferisce: trasmette le regole del gioco nella mente di chi ci sta dentro.", en: "The domain's sure-hit does not wound: it transmits the rules of the game into the mind of whoever is inside." }, localizedName: { it: 'Azzardo mortale', en: 'Idle Death Gamble', ja: '坐殺博徒' }, japaneseName: '坐殺博徒', tags: ['hakari', 'domini'] }),
  ab('auspicious-beasts', 'Auspicious Beasts Summon', 'innate', SORC, ['ino'], {
    it: "Ino indossa un passamontagna e incanala quattro bestie sacre — fra cui il kirin, che annulla il dolore — numerate in ordine.",
    en: 'Ino puts on a balaclava and channels four sacred beasts — among them the kirin, which cancels pain — numbered in order.',
  }, { longDescription: { it: "Takuma Ino ammira Kento Nanami come modello. Le quattro bestie — Kaichi, Reiki, Kirin e Ryu — hanno ciascuna un effetto diverso.", en: "Takuma Ino looks up to Kento Nanami as a role model. The four beasts — Kaichi, Reiki, Kirin and Ryu — each have a different effect." }, localizedName: { it: 'Evocazione delle bestie propizie', en: 'Auspicious Beasts Summon', ja: '来訪瑞獣' }, japaneseName: '来訪瑞獣', tags: ['ino'] }),
  ab('black-bird-manipulation', 'Black Bird Manipulation', 'innate', SORC, ['mei-mei'], {
    it: "Mei Mei comanda i corvi e vede attraverso i loro occhi; con il Bird Strike ne lancia uno contro il nemico in un attacco suicida potentissimo.",
    en: 'Mei Mei commands crows and sees through their eyes; with Bird Strike she hurls one at the enemy in an extremely powerful suicide attack.',
  }, { longDescription: { it: "Mei Mei è una stregona di primo grado che lavora per denaro; a Shibuya combatte con il fratello Ui Ui, capace di teletrasportarla.", en: "Mei Mei is a grade 1 sorcerer who works for money; at Shibuya she fights alongside her brother Ui Ui, who can teleport her." }, localizedName: { it: 'Manipolazione dei corvi', en: 'Black Bird Manipulation', ja: '黒鳥操術' }, japaneseName: '黒鳥操術', tags: ['mei-mei'] }),
  ab('star-rage', 'Star Rage', 'innate', SORC, ['yuki'], {
    it: "La tecnica di Yuki aggiunge una massa virtuale al suo corpo e ai suoi colpi. Contro Kenjaku la porta all'estremo e diventa un buco nero.",
    en: "Yuki's technique adds virtual mass to her body and her blows. Against Kenjaku she takes it to the extreme and becomes a black hole.",
  }, { longDescription: { it: "Yuki Tsukumo, stregona di grado speciale, ha passato anni all'estero a studiare come creare un mondo senza maledizioni, eliminando l'energia malefica alla radice.", en: "Yuki Tsukumo, a special-grade sorcerer, spent years abroad studying how to create a world without curses by eliminating cursed energy at its root." }, localizedName: { it: 'Ira delle stelle', en: 'Star Rage', ja: '星の怒り' }, japaneseName: '星の怒り', tags: ['yuki'] }),
  ab('love-rendezvous', 'Love Rendezvous', 'innate', SORC, ['kirara'], {
    it: "Kirara marca i bersagli con le stelle di una costellazione: chi porta una stella non può avvicinarsi a un'altra se non nell'ordine giusto.",
    en: 'Kirara marks targets with the stars of a constellation: those bearing a star cannot approach another except in the right order.',
  }, { longDescription: { it: "Kirara Hoshi, al terzo anno con Hakari, lo affianca nel giro di incontri clandestini e poi nella guerra contro Kenjaku e Sukuna.", en: "Kirara Hoshi, a third-year with Hakari, backs him up in the underground fight ring and later in the war against Kenjaku and Sukuna." }, localizedName: { it: 'Appuntamento d\'amore', en: 'Love Rendezvous', ja: '星間飛行' }, japaneseName: '星間飛行', tags: ['kirara'] }),
  /* ============================ KYOTO E CLAN ============================ */
  ab('boogie-woogie', 'Boogie Woogie', 'innate', SORC, ['todo'], {
    it: "Battendo le mani Todo scambia di posto due oggetti dotati di energia malefica: semplice, e devastante nelle mani giuste. A Shibuya, perduta una mano, perde anche la tecnica.",
    en: 'By clapping his hands Todo swaps the places of two things with cursed energy: simple, and devastating in the right hands. At Shibuya, having lost a hand, he also loses the technique.',
  }, { longDescription: { it: "Todo usa anche il battito di mani come finta: il nemico non sa mai se lo scambio avverrà davvero.", en: "Todo also uses the clap as a feint: the enemy never knows whether the swap will really happen." }, localizedName: { it: 'Boogie Woogie', en: 'Boogie Woogie', ja: '不義遊戯' }, japaneseName: '不義遊戯', tags: ['todo'] }),
  ab('construction', 'Construction', 'innate', ['zenin_clan', 'reincarnated'], ['mai', 'yorozu'], {
    it: "Creare oggetti dal nulla con l'energia malefica. Per Mai significa un proiettile al giorno, a costo di un enorme sforzo; Yorozu la usa con un metallo liquido.",
    en: 'Creating objects from nothing with cursed energy. For Mai it means one bullet a day, at enormous effort; Yorozu uses it with a liquid metal.',
  }, { localizedName: { it: 'Costruzione', en: 'Construction', ja: '構築術式' }, japaneseName: '構築術式', tags: ['mai', 'yorozu'] }),
  ab('projection-sorcery', 'Projection Sorcery', 'innate', ZENIN, ['naobito', 'naoya'], {
    it: "Divide un secondo in ventiquattro fotogrammi e fa muovere chi la usa secondo i movimenti tracciati in anticipo: chi viene toccato senza rispettare le regole resta congelato in un fotogramma.",
    en: 'It divides one second into twenty-four frames and moves its user along pre-traced motions: anyone touched who does not follow the rules is frozen in a frame.',
  }, { localizedName: { it: 'Stregoneria della proiezione', en: 'Projection Sorcery', ja: '投射呪法' }, japaneseName: '投射呪法', tags: ['zenin'] }),
  ab('blood-manipulation', 'Blood Manipulation', 'innate', KAMO, ['noritoshi', 'choso'], {
    it: "La tecnica ereditaria dei Kamo: comandare il proprio sangue. Choso, che lo produce senza limiti, la porta al massimo con il Sangue perforante, un raggio più veloce del suono.",
    en: "The Kamo clan's hereditary technique: commanding one's own blood. Choso, who produces it without limit, takes it to its peak with Piercing Blood, a beam faster than sound.",
  }, { localizedName: { it: 'Manipolazione del sangue', en: 'Blood Manipulation', ja: '赤血操術' }, japaneseName: '赤血操術', tags: ['kamo', 'sangue'] }),
  ab('puppet-manipulation', 'Puppet Manipulation', 'innate', SORC, ['mechamaru'], {
    it: "Kokichi Muta comanda a distanza i fantocci Mechamaru: il suo vincolo celeste gli dà un raggio d'azione che copre tutto il Giappone.",
    en: 'Kokichi Muta remotely commands the Mechamaru puppets: his heavenly restriction gives him a range covering all of Japan.',
  }, { longDescription: { it: "In cambio di un corpo sano, guarito da Mahito, Muta passa informazioni agli spiriti; poi li sfida con il Mechamaru Modalità Assoluta e muore.", en: "In exchange for a healthy body, healed by Mahito, Muta passes information to the curses; then he challenges them with Ultimate Mechamaru Mode Absolute and dies." }, localizedName: { it: 'Manipolazione dei fantocci', en: 'Puppet Manipulation', ja: '傀儡操術' }, japaneseName: '傀儡操術', tags: ['mechamaru'] }),
  ab('new-shadow-style', 'New Shadow School', 'barrier', SORC, ['miwa', 'kusakabe'], {
    it: "La scuola di spada che insegna il Dominio semplice: chi entra nel cerchio viene colpito d'istinto, con una velocità da fulmine.",
    en: 'The sword school that teaches the Simple Domain: anyone who enters the circle is struck by instinct, with lightning speed.',
  }, { localizedName: { it: 'Scuola della Nuova Ombra', en: 'New Shadow School', ja: 'シン・陰流' }, japaneseName: 'シン・陰流', tags: ['nuova-ombra'] }),
  ab('solo-forbidden-area', 'Solo Forbidden Area', 'innate', SORC, ['utahime'], {
    it: "Una danza rituale con cui Utahime amplifica l'energia malefica dei compagni: una tecnica di supporto più che di attacco, preziosa nelle battaglie di gruppo.",
    en: "A ritual dance with which Utahime amplifies her comrades' cursed energy: a support technique rather than an attacking one, invaluable in group battles.",
  }, { longDescription: { it: "Allo Scontro di Shinjuku la sua danza amplifica l'energia di Gojo e porta il Viola cavo al 200% contro Sukuna.", en: "At the Shinjuku Showdown her dance amplifies Gojo's energy and brings Hollow Purple to 200% against Sukuna." }, localizedName: { it: 'Zona proibita solitaria', en: 'Solo Forbidden Area', ja: '単独禁区' }, japaneseName: '単独禁区', tags: ['utahime'] }),
  /* ================================ I NEMICI ================================ */
  ab('cursed-spirit-manipulation', 'Cursed Spirit Manipulation', 'innate', USER, ['geto', 'kenjaku'], {
    it: "Geto sconfigge gli spiriti maledetti, li riduce a una sfera e li ingoia per comandarli. Kenjaku, nel suo corpo, ne eredita la tecnica e la usa per assorbire Mahito e Tengen.",
    en: 'Geto defeats cursed spirits, reduces them to a sphere and swallows them to command them. Kenjaku, in his body, inherits the technique and uses it to absorb Mahito and Tengen.',
  }, { localizedName: { it: 'Manipolazione degli spiriti maledetti', en: 'Cursed Spirit Manipulation', ja: '呪霊操術' }, japaneseName: '呪霊操術', tags: ['geto', 'kenjaku'] }),
  ab('maximum-uzumaki', 'Maximum: Uzumaki', 'extension', USER, ['geto', 'kenjaku'], {
    it: "Geto comprime insieme tutti gli spiriti che possiede in un unico colpo devastante. La usa contro Yuta e Rika nel 2017.",
    en: 'Geto compresses all the spirits he owns into a single devastating blow. He uses it against Yuta and Rika in 2017.',
  }, { localizedName: { it: 'Massimo: Uzumaki', en: 'Maximum: Uzumaki', ja: '極ノ番「うずまき」' }, japaneseName: '極ノ番「うずまき」', tags: ['geto'] }),
  ab('brain-transplant', 'Body hopping', 'innate', USER, ['kenjaku', 'yuta'], {
    it: "La tecnica di Kenjaku: trapiantando il proprio cervello in un cadavere ne prende il corpo e la tecnica. Ha indossato Noritoshi Kamo, Kaori Itadori, Suguru Geto. Yuta la copia per entrare nel corpo di Gojo.",
    en: "Kenjaku's technique: by transplanting his own brain into a corpse he takes its body and its technique. He has worn Noritoshi Kamo, Kaori Itadori, Suguru Geto. Yuta copies it to enter Gojo's body.",
  }, { localizedName: { it: 'Cambio di corpo', en: 'Body hopping', ja: '肉体を渡る術式' }, tags: ['kenjaku'] }),
  ab('anti-gravity', 'Anti-Gravity System', 'innate', USER, ['kenjaku', 'kaori'], {
    it: "La tecnica di Kaori Itadori, che Kenjaku ha ereditato con il suo corpo e usa contro Yuki e Choso.",
    en: "Kaori Itadori's technique, which Kenjaku inherited with her body and uses against Yuki and Choso.",
  }, { localizedName: { it: 'Sistema antigravità', en: 'Anti-Gravity System', ja: '反重力機構' }, japaneseName: '反重力機構', tags: ['kenjaku'] }),
  ab('womb-profusion', 'Womb Profusion', 'domain', USER, ['kenjaku'], {
    it: "Il dominio di Kenjaku, che espande contro Yuki: un luogo popolato di feti, specchio dei suoi esperimenti.",
    en: 'Kenjaku\'s domain, which he expands against Yuki: a place populated by foetuses, a mirror of his experiments.',
  }, { longDescription: { it: "Kenjaku usa anche la gravità ereditata dal corpo di Kaori e, dopo averlo assorbito, la Trasfigurazione inerte di Mahito.", en: "Kenjaku also uses the gravity inherited from Kaori's body and, after absorbing him, Mahito's Idle Transfiguration." }, localizedName: { it: 'Profusione del grembo', en: 'Womb Profusion', ja: '胎蔵遍野' }, japaneseName: '胎蔵遍野', tags: ['kenjaku', 'domini'] }),
  ab('idle-transfiguration', 'Idle Transfiguration', 'innate', SPIRIT, ['mahito', 'kenjaku'], {
    it: "Mahito tocca l'anima e rimodella il corpo a piacere: trasforma le persone in mostri, cura sé stesso, assume qualunque forma. Funziona su chiunque tranne su Yuji, che sente Sukuna dentro di sé.",
    en: 'Mahito touches the soul and reshapes the body at will: he turns people into monsters, heals himself, takes any shape. It works on anyone except Yuji, who has Sukuna inside him.',
  }, { localizedName: { it: 'Trasfigurazione inerte', en: 'Idle Transfiguration', ja: '無為転変' }, japaneseName: '無為転変', tags: ['mahito'] }),
  ab('self-embodiment-of-perfection', 'Self-Embodiment of Perfection', 'domain', SPIRIT, ['mahito'], {
    it: "Il dominio di Mahito: dentro, la sua tecnica tocca l'anima di chiunque senza bisogno di contatto. Contro Nanami e Yuji lo apre per la prima volta, ma Sukuna lo scaccia dall'anima di Yuji.",
    en: "Mahito's domain: inside, his technique touches anyone's soul without contact. He opens it for the first time against Nanami and Yuji, but Sukuna drives him out of Yuji's soul.",
  }, { localizedName: { it: 'Autoincarnazione della perfezione', en: 'Self-Embodiment of Perfection', ja: '自閉円頓裹' }, japaneseName: '自閉円頓裹', tags: ['mahito', 'domini'] }),
  ab('disaster-flames', 'Disaster Flames', 'innate', SPIRIT, ['jogo'], {
    it: "Le fiamme e la lava di Jogo, che bruciano a migliaia di gradi; con il colpo massimo, Meteora, fa cadere una roccia infuocata gigantesca.",
    en: "Jogo's flames and lava, burning at thousands of degrees; with his ultimate move, Meteor, he drops a gigantic burning rock.",
  }, { localizedName: { it: 'Fiamme del disastro', en: 'Disaster Flames', ja: '火礫蟲・極ノ番「隕」' }, tags: ['jogo', 'fuoco'] }),
  ab('coffin-of-the-iron-mountain', 'Coffin of the Iron Mountain', 'domain', SPIRIT, ['jogo'], {
    it: "Il dominio di Jogo, l'interno di un vulcano in cui tutto prende fuoco all'istante. Contro Gojo viene sopraffatto dal Vuoto Infinito.",
    en: "Jogo's domain, the inside of a volcano where everything instantly catches fire. Against Gojo it is overwhelmed by the Unlimited Void.",
  }, { localizedName: { it: 'Bara della montagna di ferro', en: 'Coffin of the Iron Mountain', ja: '蓋棺鉄囲山' }, japaneseName: '蓋棺鉄囲山', tags: ['jogo', 'domini'] }),
  ab('disaster-plants', 'Disaster Plants', 'innate', SPIRIT, ['hanami'], {
    it: "Hanami manipola le piante: radici che trafiggono, semi che si nutrono dell'energia malefica e fiori che placano la volontà di combattere.",
    en: 'Hanami manipulates plants: roots that impale, seeds that feed on cursed energy and flowers that sap the will to fight.',
  }, { localizedName: { it: 'Piante del disastro', en: 'Disaster Plants', ja: '植物操術' }, tags: ['hanami'] }),
  ab('horizon-of-the-captivating-skandha', 'Horizon of the Captivating Skandha', 'domain', SPIRIT, ['dagon'], {
    it: "Il dominio di Dagon: una spiaggia tropicale infinita da cui sciami di pesci si avventano sui nemici senza mai mancarli.",
    en: "Dagon's domain: an endless tropical beach from which swarms of fish lunge at the enemies without ever missing.",
  }, { localizedName: { it: "Orizzonte dello Skandha seducente", en: 'Horizon of the Captivating Skandha', ja: '蕩蘊平線' }, japaneseName: '蕩蘊平線', tags: ['dagon', 'domini'] }),
  ab('ice-formation', 'Ice Formation', 'innate', SUKUNA, ['uraume'], {
    it: "La tecnica di Uraume, che congela tutto ciò che tocca e scaglia stalattiti di ghiaccio. Servitore di Sukuna fin dall'era Heian.",
    en: "Uraume's technique, which freezes everything it touches and hurls ice spikes. Sukuna's servant since the Heian era.",
  }, { localizedName: { it: 'Formazione del ghiaccio', en: 'Ice Formation', ja: '氷凝呪法' }, japaneseName: '氷凝呪法', tags: ['uraume', 'ghiaccio'] }),
  /* ============================ IL CULLING GAME ============================ */
  ab('deadly-sentencing', 'Deadly Sentencing', 'domain', SORC, ['higuruma'], {
    it: "Il dominio di Higuruma è un tribunale con un giudice-shikigami: l'imputato è processato per un suo crimine. Se colpevole perde la tecnica, oppure Higuruma ottiene la Spada del boia, che uccide con un solo colpo.",
    en: "Higuruma's domain is a courtroom with a shikigami judge: the defendant is tried for one of their crimes. If guilty they lose their technique, or Higuruma obtains the Executioner's Sword, which kills with a single blow.",
  }, { localizedName: { it: 'Sentenza capitale', en: 'Deadly Sentencing', ja: '誅伏賜死' }, japaneseName: '誅伏賜死', tags: ['higuruma', 'domini', 'tribunale'] }),
  ab('mythical-beast-amber', 'Mythical Beast Amber', 'innate', REINC, ['kashimo'], {
    it: "La tecnica innata di Kashimo, che si può usare una sola volta: trasforma il suo corpo nell'elettricità stessa, a costo della vita. La usa contro Sukuna.",
    en: "Kashimo's innate technique, which can only be used once: it turns his body into electricity itself, at the cost of his life. He uses it against Sukuna.",
  }, { localizedName: { it: 'Bestia mitica Ambra', en: 'Mythical Beast Amber', ja: '幻獣琥珀' }, japaneseName: '幻獣琥珀', tags: ['kashimo', 'elettricita'] }),
  ab('jacobs-ladder', "Jacob's Ladder", 'extension', REINC, ['hana'], {
    it: "La tecnica dell'Angelo, la stregona reincarnata in Hana Kurusu: una luce che cancella qualunque tecnica. È la chiave per aprire il Reame della Prigione e liberare Gojo.",
    en: "The technique of the Angel, the sorceress reincarnated in Hana Kurusu: a light that erases any technique. It is the key to opening the Prison Realm and freeing Gojo.",
  }, { localizedName: { it: 'Scala di Giacobbe', en: "Jacob's Ladder", ja: '邪去侮の梯子' }, japaneseName: '邪去侮の梯子', tags: ['angelo'] }),
  ab('granite-blast', 'Granite Blast', 'innate', REINC, ['ryu'], {
    it: "Ryu Ishigori spara la sua immensa riserva di energia malefica come un raggio di potenza devastante: a Sendai la usa contro Yuta.",
    en: 'Ryu Ishigori fires his immense reserve of cursed energy as a beam of devastating power: in Sendai he uses it against Yuta.',
  }, { localizedName: { it: 'Granite Blast', en: 'Granite Blast', ja: 'グラニテブラスト' }, tags: ['ryu'] }),
  ab('sky-manipulation', 'Sky Manipulation', 'innate', REINC, ['uro'], {
    it: "Takako Uro tratta il cielo come una superficie: lo afferra, lo piega e lo spezza come una lastra di vetro.",
    en: 'Takako Uro treats the sky as a surface: she grabs it, bends it and shatters it like a pane of glass.',
  }, { localizedName: { it: 'Manipolazione del cielo', en: 'Sky Manipulation', ja: '宇守羅彈' }, tags: ['uro'] }),
  ab('comedian', 'Comedian', 'innate', SORC, ['takaba'], {
    it: "Finché Takaba trova una cosa divertente, la sua tecnica la rende reale: nemmeno lui sa di averla. Kenjaku, intrappolato nella sua comicità, non può fargli del male.",
    en: 'As long as Takaba finds something funny, his technique makes it real: he does not even know he has it. Kenjaku, trapped in his comedy, cannot hurt him.',
  }, { longDescription: { it: "Fumihiko Takaba è un comico che non ha mai sfondato, risvegliato a forza da Kenjaku e gettato nel Culling Game.", en: "Fumihiko Takaba is a comedian who never made it, forcibly awakened by Kenjaku and thrown into the Culling Game." }, localizedName: { it: 'Comedian', en: 'Comedian', ja: '超人' }, tags: ['takaba'] }),
  /* ======================== STRUMENTI E OGGETTI MALEDETTI ======================== */
  ab('sukuna-fingers', "Sukuna's fingers", 'cursed_object', SUKUNA, ['sukuna', 'yuji', 'jogo', 'mimiko', 'nanako'], {
    it: "Le venti dita di Sukuna, oggetti maledetti indistruttibili sparsi per il Giappone: ognuna contiene una parte del suo potere. Yuji ne ingoia la prima a Sendai e via via le altre.",
    en: "Sukuna's twenty fingers, indestructible cursed objects scattered across Japan: each holds part of his power. Yuji swallows the first in Sendai and the others one after another.",
  }, { localizedName: { it: 'Le dita di Sukuna', en: "Sukuna's fingers", ja: '宿儺の指' }, japaneseName: '宿儺の指', tags: ['sukuna', 'oggetti-maledetti'] }),
  ab('prison-realm', 'Prison Realm', 'cursed_object', ['sorcerer', 'curse_user'], ['gojo', 'kenjaku', 'hana'], {
    it: "Un cubo che è il resto mortale del monaco Genshin: sigilla tutto ciò che resta nel suo raggio per un minuto nella mente. Kenjaku lo usa per imprigionare Gojo a Shibuya.",
    en: "A cube that is the mortal remains of the monk Genshin: it seals anything that stays within its range for one minute in the mind. Kenjaku uses it to imprison Gojo at Shibuya.",
  }, { localizedName: { it: 'Reame della Prigione', en: 'Prison Realm', ja: '獄門疆' }, japaneseName: '獄門疆', tags: ['oggetti-maledetti', 'gojo'] }),
  ab('death-paintings', 'Death Painting Wombs', 'cursed_object', USER, ['choso', 'eso', 'kechizu', 'kenjaku'], {
    it: "I nove feti maledetti creati nell'era Meiji da Kenjaku, nel corpo di Noritoshi Kamo. Custoditi all'istituto, vengono rubati durante l'incontro con Kyoto; i primi tre si incarnano.",
    en: 'The nine cursed foetuses created in the Meiji era by Kenjaku, in the body of Noritoshi Kamo. Kept at the school, they are stolen during the Kyoto exchange; the first three incarnate.',
  }, { localizedName: { it: 'Dipinti della Morte', en: 'Death Painting Wombs', ja: '呪胎九相図' }, japaneseName: '呪胎九相図', tags: ['oggetti-maledetti'] }),
  ab('inverted-spear-of-heaven', 'Inverted Spear of Heaven', 'cursed_tool', SORC, ['toji'], {
    it: "Il pugnale maledetto che annulla qualunque tecnica tocchi: con esso Toji supera l'Infinito di Gojo e lo trafigge.",
    en: "The cursed dagger that cancels any technique it touches: with it Toji gets past Gojo's Infinity and stabs him.",
  }, { longDescription: { it: "Toji la tiene, con il resto dell'arsenale, nel corpo di uno spirito maledetto che porta avvolto addosso e che i sensori non rilevano.", en: "Toji keeps it, with the rest of his arsenal, inside a cursed spirit he wears wrapped around his body, which sensors do not detect." }, localizedName: { it: 'Lancia celeste rovesciata', en: 'Inverted Spear of Heaven', ja: '天逆鉾' }, japaneseName: '天逆鉾', tags: ['strumenti-maledetti', 'toji'] }),
  ab('playful-cloud', 'Playful Cloud', 'cursed_tool', SORC, ['toji', 'maki'], {
    it: "Un bastone a tre sezioni di grado speciale che non ha poteri propri: la sua forza dipende tutta da chi lo impugna. Passa da Toji a Maki.",
    en: 'A special-grade three-section staff with no powers of its own: its strength depends entirely on its wielder. It passes from Toji to Maki.',
  }, { localizedName: { it: 'Nuvola giocosa', en: 'Playful Cloud', ja: '游雲' }, japaneseName: '游雲', tags: ['strumenti-maledetti'] }),
  ab('split-soul-katana', 'Split Soul Katana', 'cursed_tool', SORC, ['toji'], {
    it: "La spada che taglia direttamente l'anima, ignorando la durezza del corpo: è uno degli strumenti dell'arsenale di Toji nel 2006.",
    en: "The sword that cuts the soul directly, ignoring the body's toughness: it is one of the tools in Toji's arsenal in 2006.",
  }, { longDescription: { it: "Con questa lama Toji taglia il drago arcobaleno evocato da Geto durante lo scontro del 2006.", en: "With this blade Toji cuts through the rainbow dragon summoned by Geto during their 2006 fight." }, localizedName: { it: 'Katana che taglia l\'anima', en: 'Split Soul Katana', ja: '釈魂刀' }, japaneseName: '釈魂刀', tags: ['strumenti-maledetti'] }),
];
