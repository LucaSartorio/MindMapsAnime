import type { Character, Jutsu, Localizable, Location, TimelineEvent } from '@/types';

/**
 * Enciclopedia di Dragon Ball — seconda ondata di completezza: oggetti,
 * trasformazioni e tecniche che mancavano, i comprimari del Red Ribbon, dei
 * combattenti di Baba la Veggente e della prole del Grande Mago Piccolo, e le
 * morti che non avevano un evento.
 */

const L = (it: string, en: string): Localizable => ({ it, en });

const j = (
  id: string,
  name: string,
  type: string,
  users: string[],
  shortDescription: Localizable,
  extra: Partial<Jutsu> = {},
): Jutsu => ({
  id: `jutsu-dbz-${id}`,
  worldId: 'world-dragonball',
  name,
  type,
  characterIds: users.map((u) => `char-dbz-${u}`),
  shortDescription,
  canonStatus: 'canon',
  referenceStatus: 'verified',
  ...extra,
});

export const dragonballEncyclopediaJutsu: Jutsu[] = [
  /* ================================== OGGETTI ================================== */
  j('scouter', 'Scouter', 'item', ['raditz', 'nappa', 'vegeta', 'frieza', 'zarbon', 'dodoria', 'captain-ginyu'], L(
    "Il visore dell'esercito di Freezer che misura l'aura di combattimento di chi si ha davanti, la trasmette a distanza e funziona da radio. Quando Goku impara a nascondere e a far esplodere la sua aura gli scouter perdono valore, e Vegeta li abbandona su Namecc: i Saiyan imparano a percepire l'energia.",
    "The Frieza Force visor that measures the battle power of whoever stands in front of it, relays it at a distance and doubles as a radio. Once Goku learns to hide and spike his power the scouters lose their worth, and Vegeta abandons them on Namek: the Saiyans learn to sense energy.",
  ), { localizedName: L('Scouter', 'Scouter'), japaneseName: 'スカウター', tags: ['oggetto', 'esercito-di-freezer'] }),
  j('potara', 'Potara Earrings', 'item', ['goku', 'vegeta', 'supreme-kai', 'kibito', 'elder-kai', 'zamasu', 'goku-black', 'caulifla', 'kale'], L(
    "Gli orecchini dei Kaiohshin: indossandone uno a testa, sul lato opposto, due persone si fondono all'istante in un solo guerriero. Il Supremo Kaioh e Kibito si fondono per errore in Kibitoshin; il Vecchio Kaiohshin li consegna a Goku contro Super Bu, da cui nasce Vegito. In Super si scopre che per i mortali la fusione dura un'ora.",
    "The Supreme Kais' earrings: when two people each wear one, on opposite ears, they instantly fuse into a single warrior. The Supreme Kai and Kibito fuse by accident into Kibito Kai; the Elder Kai gives them to Goku against Super Buu, and Vegito is born. Super reveals that for mortals the fusion lasts an hour.",
  ), { localizedName: L('Orecchini Potara', 'Potara Earrings'), japaneseName: 'ポタラ', tags: ['oggetto', 'fusione', 'kaiohshin'] }),
  j('z-sword', 'Z Sword', 'item', ['gohan', 'supreme-kai', 'elder-kai'], L(
    "La spada leggendaria piantata nel Pianeta dei Kaiohshin: chi riesce a estrarla ottiene un potere enorme. Gohan la estrae e si allena a usarla, ma la spada si spezza contro un blocco di Katchin lanciato dal Supremo Kaioh, liberando il Vecchio Kaiohshin che vi era imprigionato da quindici generazioni.",
    "The legendary sword planted on the Sacred World of the Kai: whoever pulls it out gains enormous power. Gohan draws it and trains with it, but the sword snaps against a Katchin block thrown by the Supreme Kai, freeing the Elder Kai who had been imprisoned in it for fifteen generations.",
  ), { localizedName: L('Spada Z', 'Z Sword'), japaneseName: 'ゼットソード', tags: ['oggetto', 'kaiohshin'] }),
  j('super-dragon-balls', 'Super Dragon Balls', 'item', ['super-shenron', 'beerus', 'champa', 'zeno', 'android-17'], L(
    "Le sfere originali, grandi come pianeti e sparse fra l'Universo 6 e l'Universo 7: evocano Super Shenron, capace di esaudire qualunque desiderio. Sono il premio del torneo fra i due universi e del Torneo del Potere, dove C-17 le usa per riportare in vita gli universi cancellati.",
    "The original balls, as big as planets and scattered across Universes 6 and 7: they summon Super Shenron, who can grant any wish. They are the prize of the tournament between the two universes and of the Tournament of Power, where Android 17 uses them to bring back the erased universes.",
  ), { localizedName: L('Super Sfere del Drago', 'Super Dragon Balls'), japaneseName: '超ドラゴンボール', tags: ['oggetto', 'sfere-del-drago'] }),
  j('namekian-dragon-balls', 'Namekian Dragon Balls', 'item', ['porunga', 'guru', 'dende'], L(
    "Le Sfere del Drago di Namecc, grandi come palloni, create dal Grande Anziano Guru: evocano Porunga, che esaudisce tre desideri ma va chiamato nella lingua di Namecc. Possono riportare in vita la stessa persona più volte, e per questo diventano decisive dopo Freezer e contro Majin Bu.",
    "Namek's Dragon Balls, as big as footballs, created by Grand Elder Guru: they summon Porunga, who grants three wishes but must be addressed in the Namekian language. They can revive the same person more than once, which makes them decisive after Frieza and against Majin Buu.",
  ), { localizedName: L('Sfere del Drago di Namecc', 'Namekian Dragon Balls'), japaneseName: 'ナメック星のドラゴンボール', tags: ['oggetto', 'sfere-del-drago', 'namecc'] }),
  j('black-star-dragon-balls', 'Black Star Dragon Balls', 'item', ['pilaf', 'goku', 'gt-pan', 'trunks'], L(
    "Le Sfere del Drago Nere di Dragon Ball GT, create dal Supremo prima di separarsi da Piccolo. Dopo un desiderio si disperdono nello spazio e, se non vengono riportate sulla Terra entro un anno, il pianeta esplode: dopo il desiderio incauto di Pilaf Goku, Trunks e Pan partono per ritrovarle.",
    "Dragon Ball GT's Black Star Dragon Balls, created by Kami before he split from Piccolo. After a wish they scatter through space and, unless brought back to Earth within a year, the planet explodes: after Pilaf's careless wish Goku, Trunks and Pan set off to find them.",
  ), { localizedName: L('Sfere del Drago Nere', 'Black Star Dragon Balls'), japaneseName: '究極のドラゴンボール', canonStatus: 'anime_only', tags: ['oggetto', 'sfere-del-drago', 'gt'] }),
  j('sacred-water', 'Sacred Water', 'item', ['korin', 'goku'], L(
    "L'«acqua sacra» custodita da Karin in cima alla sua torre, che dovrebbe moltiplicare la forza di chi la beve. Goku passa giorni a cercare di strappargliela; quando ci riesce scopre che è acqua normale: la forza l'ha guadagnata con la scalata e l'inseguimento stesso.",
    "The 'sacred water' Korin keeps at the top of his tower, said to multiply the strength of whoever drinks it. Goku spends days trying to wrest it from him; when he finally does he finds it is ordinary water: the strength came from the climb and the chase themselves.",
  ), { localizedName: L('Acqua sacra di Karin', 'Sacred Water'), japaneseName: '超聖水', tags: ['oggetto', 'torre-di-karin'] }),
  j('saiyan-space-pod', 'Saiyan Space Pod', 'item', ['goku', 'raditz', 'nappa', 'vegeta', 'bardock', 'gine'], L(
    "Le capsule monoposto con cui i Saiyan raggiungono i pianeti da conquistare, dormendo in sonno indotto durante il viaggio. Goku arriva così sulla Terra da neonato; Radish, Nappa e Vegeta ci atterrano per attaccarla, e Bulma ne studia la tecnologia per la nave con cui Goku parte verso Namecc.",
    "The single-seat pods the Saiyans use to reach planets to conquer, sleeping in induced slumber during the trip. Goku reaches Earth in one as a newborn; Raditz, Nappa and Vegeta land in them to attack it, and Bulma studies their technology for the ship Goku takes to Namek.",
  ), { localizedName: L('Navicella dei Saiyan', 'Saiyan Space Pod'), japaneseName: 'アタックボール', tags: ['oggetto', 'saiyan'] }),
  j('gravity-machine', 'Gravity Machine', 'item', ['goku', 'vegeta', 'dr-brief', 'bulma'], L(
    "La macchina che moltiplica la gravità, costruita dal Dr. Brief nella navicella con cui Goku vola verso Namecc: durante il viaggio Goku si allena fino a cento volte la gravità terrestre. Vegeta ne ottiene poi una stanza alla Capsule Corporation, dove si allena per anni.",
    "The machine that multiplies gravity, built by Dr. Brief into the ship Goku flies to Namek: during the trip Goku trains up to a hundred times Earth's gravity. Vegeta later gets a whole room of it at Capsule Corporation, where he trains for years.",
  ), { localizedName: L('Macchina della gravità', 'Gravity Machine'), japaneseName: '重力装置', tags: ['oggetto', 'capsule-corporation'] }),
  j('medical-machine', 'Medical Machine', 'item', ['vegeta', 'goku', 'frieza'], L(
    "La vasca di rigenerazione dell'esercito di Freezer: immersi nel liquido, i soldati guariscono in poche ore anche da ferite gravissime. Su Namecc Vegeta la usa nella nave di Freezer, e dopo lo scontro con Ginew vi viene curato anche Goku.",
    "The Frieza Force's regeneration tank: submerged in its fluid, soldiers heal in hours even from the gravest wounds. On Namek Vegeta uses it aboard Frieza's ship, and after the fight with Ginyu Goku is healed in it too.",
  ), { localizedName: L('Vasca medica', 'Medical Machine'), japaneseName: 'メディカルマシーン', tags: ['oggetto', 'esercito-di-freezer'] }),
  j('electric-jar', 'Electric Jar', 'item', ['master-roshi', 'kami', 'piccolo'], L(
    "Il contenitore in cui va rinchiuso un nemico con il Mafuba. Il Genio delle Tartarughe usa un bollitore elettrico per riso contro il Grande Mago Piccolo, ma muore per lo sforzo e manca il bersaglio; anni dopo Dio tenta di sigillare Ma Junior in una bottiglia durante il torneo.",
    "The container an enemy must be shut into with the Evil Containment Wave. Master Roshi uses an electric rice cooker against King Piccolo, but dies from the strain and misses; years later Kami tries to seal Ma Junior into a bottle during the tournament.",
  ), { localizedName: L('Contenitore del Mafuba', 'Electric Jar'), japaneseName: '電子ジャー', tags: ['oggetto', 'mafuba'] }),
  j('bansho-fan', 'Bansho Fan', 'item', ['master-roshi', 'ox-king', 'chichi', 'goku'], L(
    "Il ventaglio magico capace di spegnere qualunque fuoco, che Goku va a chiedere al Genio delle Tartarughe per salvare il castello del Re Gyumao sul Monte Fry Pan. Il Genio l'ha però usato come sottopentola e buttato: spegne allora l'incendio distruggendo il monte con la Kamehameha.",
    "The magic fan able to put out any fire, which Goku goes to ask Master Roshi for in order to save the Ox-King's castle on Fire Mountain. Roshi, however, had used it as a pot holder and thrown it away: he puts the fire out by destroying the mountain with a Kamehameha.",
  ), { localizedName: L('Ventaglio Basho', 'Bansho Fan'), japaneseName: '芭蕉扇', tags: ['oggetto', 'kamehameha'] }),
  j('time-ring', 'Time Ring', 'item', ['zamasu', 'goku-black', 'beerus', 'whis'], L(
    "L'anello che permette di viaggiare nel tempo senza essere toccati dalle modifiche della linea temporale. Zamasu ne indossa uno, e lo stesso fa Goku Black: è grazie agli anelli che i due Zamasu possono incontrarsi nel futuro di Trunks.",
    "The ring that allows time travel while staying untouched by changes to the timeline. Zamasu wears one, and so does Goku Black: the rings are how the two Zamasus can meet in Trunks's future.",
  ), { localizedName: L('Anello del tempo', 'Time Ring'), japaneseName: '時の指輪', tags: ['oggetto', 'goku-black'] }),

  /* ============================== TRASFORMAZIONI ============================== */
  j('super-saiyan-grades', 'Ascended & Ultra Super Saiyan', 'transformation', ['vegeta', 'future-trunks', 'goku'], L(
    "I gradi oltre il Super Saiyan scoperti nella Stanza dello Spirito e del Tempo: il Super Saiyan «oltrepassato», più muscoloso, che Vegeta usa contro Cell semi-perfetto, e la forma ancora più massiccia di Trunks, potentissima ma lenta. Goku li prova e li scarta, scegliendo di padroneggiare il Super Saiyan normale.",
    "The grades beyond Super Saiyan discovered in the Hyperbolic Time Chamber: the bulkier 'ascended' Super Saiyan Vegeta uses against Semi-Perfect Cell, and Trunks's even more massive form, immensely powerful but slow. Goku tries them and discards them, choosing to master normal Super Saiyan instead.",
  ), { localizedName: L('Super Saiyan di secondo e terzo grado', 'Ascended & Ultra Super Saiyan'), japaneseName: '超サイヤ人第2・第3段階', tags: ['saiyan', 'cell'] }),
  j('super-saiyan-full-power', 'Full Power Super Saiyan', 'transformation', ['goku', 'gohan'], L(
    "Il Super Saiyan reso naturale: Goku e Gohan restano trasformati giorno e notte finché la forma non smette di consumarli e di agitarli. È così che si preparano ai Cell Games, ed è da questo stato calmo che Gohan arriva al Super Saiyan 2.",
    "Super Saiyan made natural: Goku and Gohan stay transformed day and night until the form no longer drains or agitates them. That is how they prepare for the Cell Games, and from this calm state Gohan reaches Super Saiyan 2.",
  ), { localizedName: L('Super Saiyan a pieno potere', 'Full Power Super Saiyan'), japaneseName: '超サイヤ人フルパワー', tags: ['saiyan', 'cell'] }),
  j('legendary-super-saiyan', 'Legendary Super Saiyan', 'transformation', ['broly'], L(
    "La trasformazione di Broly, il Saiyan dal potere fuori misura: una forma enorme e furiosa che continua a crescere durante lo scontro. Nel film Dragon Ball Super: Broly la raggiunge mentre combatte contro Vegeta e Goku, che riescono a fermarlo solo con la fusione in Gogeta.",
    "Broly's transformation, the Saiyan of boundless power: a huge, furious form that keeps growing during the fight. In the film Dragon Ball Super: Broly he reaches it while fighting Vegeta and Goku, who can only stop him by fusing into Gogeta.",
  ), { localizedName: L('Super Saiyan Leggendario', 'Legendary Super Saiyan'), japaneseName: '伝説の超サイヤ人', tags: ['saiyan', 'broly'] }),
  j('golden-great-ape', 'Golden Great Ape', 'transformation', ['goku', 'vegeta'], L(
    "Lo scimmione dal pelo dorato di Dragon Ball GT, la forma che un Saiyan assume trasformandosi in Super Saiyan da scimmione. Goku la raggiunge contro Baby e, ritrovata la ragione, ne esce come Super Saiyan 4; Vegeta passa per la stessa via grazie alla macchina di Bulma.",
    "Dragon Ball GT's golden-furred Great Ape, the form a Saiyan takes by going Super Saiyan while a Great Ape. Goku reaches it against Baby and, regaining his reason, emerges as a Super Saiyan 4; Vegeta goes the same way thanks to Bulma's machine.",
  ), { localizedName: L('Scimmione dorato', 'Golden Great Ape'), japaneseName: '黄金大猿', canonStatus: 'anime_only', tags: ['saiyan', 'gt'] }),
  j('super-saiyan-blue-kaioken', 'Super Saiyan Blue Kaioken', 'transformation', ['goku'], L(
    "La combinazione rischiosissima del Super Saiyan Blue con il Kaioken, possibile solo grazie al controllo perfetto dell'aura della forma divina. Goku la usa per la prima volta contro Hit e la spinge fino al limite contro Jiren nel Torneo del Potere.",
    "The extremely risky combination of Super Saiyan Blue with the Kaioken, possible only thanks to the divine form's perfect aura control. Goku first uses it against Hit and pushes it to the limit against Jiren in the Tournament of Power.",
  ), { localizedName: L('Super Saiyan Blue Kaioken', 'Super Saiyan Blue Kaioken'), japaneseName: '超サイヤ人ブルー界王拳', tags: ['saiyan', 'super'] }),
  j('super-saiyan-blue-evolved', 'Super Saiyan Blue Evolution', 'transformation', ['vegeta'], L(
    "L'evoluzione del Super Saiyan Blue raggiunta da Vegeta nel Torneo del Potere, superando i propri limiti: la sua aura si fa più intensa e scura. È la forma con cui affronta Toppo trasformato in Dio della Distruzione.",
    "The evolution of Super Saiyan Blue Vegeta reaches during the Tournament of Power by breaking his own limits: his aura grows deeper and darker. It is the form he uses against Toppo in his God of Destruction state.",
  ), { localizedName: L('Super Saiyan Blue Evolution', 'Super Saiyan Blue Evolution'), japaneseName: '超サイヤ人ブルー進化', canonStatus: 'anime_only', tags: ['saiyan', 'torneo-del-potere'] }),
  j('frieza-forms', "Frieza's Transformations", 'transformation', ['frieza', 'king-cold', 'cooler'], L(
    "La razza di Freezer trattiene il proprio potere in forme compatte. Su Namecc Freezer passa per la seconda forma, cornuta e gigantesca, per la terza, dal cranio allungato, e per la forma finale, liscia e minuta, che può spingere fino al cento per cento. Golden Freezer e Black Freezer arriveranno in Super.",
    "Frieza's race restrains its power in compact forms. On Namek Frieza goes through his second form, horned and huge, his third, with an elongated skull, and his smooth, small final form, which he can push to one hundred percent. Golden Frieza and Black Frieza will come in Super.",
  ), { localizedName: L('Trasformazioni di Freezer', "Frieza's Transformations"), japaneseName: 'フリーザの変身', tags: ['freezer', 'namecc'] }),
  j('cell-forms', "Cell's Forms", 'transformation', ['cell'], L(
    "Cell cresce assorbendo: prima è una larva, poi la forma imperfetta che succhia gli esseri umani con la coda; assorbendo C-17 diventa semi-perfetto e, con C-18, perfetto. Rigenerato dal nucleo dopo l'autodistruzione, si ripresenta come Super Perfect Cell, più forte e capace del Teletrasporto.",
    "Cell grows by absorbing: first a larva, then the imperfect form that drains humans with its tail; absorbing Android 17 makes him semi-perfect and, with Android 18, perfect. Regenerated from his core after self-destructing, he returns as Super Perfect Cell, stronger and able to use Instant Transmission.",
  ), { localizedName: L('Stadi di Cell', "Cell's Forms"), japaneseName: 'セルの形態', tags: ['cell'] }),
  j('buu-forms', "Buu's Forms", 'transformation', ['majin-buu', 'kid-buu'], L(
    "Majin Bu cambia forma in base a ciò che assorbe e alla sua parte malvagia: dal Bu grasso e infantile si separa il Bu malvagio, che assorbe il grasso e diventa Super Bu; assorbendo Gotenks, Piccolo e Gohan cambia ancora, finché, perse le persone assorbite, torna alla forma originale, Kid Bu.",
    "Majin Buu changes form depending on what he absorbs and on his evil side: from the fat, childish Buu splits off Evil Buu, who absorbs the fat one and becomes Super Buu; absorbing Gotenks, Piccolo and Gohan changes him again, until, having lost those he absorbed, he returns to his original form, Kid Buu.",
  ), { localizedName: L('Forme di Majin Bu', "Buu's Forms"), japaneseName: '魔人ブウの形態', tags: ['majin-bu'] }),
  j('namekian-giant-form', 'Giant Form', 'transformation', ['piccolo', 'lord-slug', 'king-piccolo'], L(
    "La capacità dei Namecciani di ingrandire il proprio corpo fino a dimensioni colossali. Il Grande Mago Piccolo la usa contro Goku; Piccolo la sfrutta più volte, e la riprende in Super Hero, dove diventa anche Piccolo Arancione gigante contro Cell Max.",
    "The Namekians' ability to enlarge their bodies to colossal size. King Piccolo uses it against Goku; Piccolo relies on it several times, and uses it again in Super Hero, where he also becomes a giant Orange Piccolo against Cell Max.",
  ), { localizedName: L('Forma gigante', 'Giant Form'), japaneseName: '巨大化', tags: ['namecc'] }),
  j('majin-mark', "Babidi's Majin Mark", 'support', ['babidi', 'vegeta', 'dabura', 'spopovich', 'yamu', 'pui-pui', 'yakon'], L(
    "La magia con cui Babidi prende il controllo di chi ha del male nel cuore, potenziandolo: la «M» sulla fronte segna i suoi servitori. Vegeta si lascia possedere di proposito per tornare spietato e affrontare Goku, ma il suo orgoglio resiste al controllo.",
    "The magic Babidi uses to take control of those with evil in their hearts, empowering them: the 'M' on the forehead marks his servants. Vegeta lets himself be possessed on purpose to become ruthless again and face Goku, but his pride resists the control.",
  ), { localizedName: L('Marchio Majin', 'Majin Mark'), japaneseName: '魔人の印', tags: ['majin-bu', 'babidi'] }),

  /* ================================== TECNICHE ================================== */
  j('spirit-sword', 'Spirit Sword', 'energy_blast', ['vegito'], L(
    "La lama di energia che Vegito fa uscire dalla mano contro Super Bu e, in Super, contro Zamasu fuso. Unisce l'aura di Goku e Vegeta in un'arma da taglio che Vegito usa come una spada vera.",
    "The energy blade Vegito extends from his hand against Super Buu and, in Super, against Fused Zamasu. It combines Goku's and Vegeta's aura into a cutting weapon that Vegito wields like a real sword.",
  ), { localizedName: L('Spada spirituale', 'Spirit Sword'), japaneseName: '気の剣', tags: ['fusione', 'vegito'] }),
  j('final-kamehameha', 'Final Kamehameha', 'energy_blast', ['vegito'], L(
    "L'onda che unisce la Kamehameha di Goku e il Final Flash di Vegeta: Vegito Blue la scaglia contro Zamasu fuso nel futuro di Trunks, spingendolo sull'orlo della sconfitta prima che la fusione si sciolga.",
    "The wave that merges Goku's Kamehameha and Vegeta's Final Flash: Vegito Blue fires it at Fused Zamasu in Trunks's future, pushing him to the brink of defeat before the fusion wears off.",
  ), { localizedName: L('Final Kamehameha', 'Final Kamehameha'), japaneseName: 'ファイナルかめはめ波', tags: ['fusione', 'vegito'] }),
  j('soul-punisher', 'Soul Punisher', 'energy_blast', ['gogeta'], L(
    "Il colpo con cui Gogeta Super Saiyan Blue chiude lo scontro con Broly nel film Dragon Ball Super: Broly. Una sfera di energia luminosa che non uccide l'avversario ma ne spazza via la furia.",
    "The blow with which Super Saiyan Blue Gogeta ends the fight with Broly in the film Dragon Ball Super: Broly. A sphere of shining energy that doesn't kill the opponent but sweeps away his rage.",
  ), { localizedName: L('Punitore delle anime', 'Soul Punisher'), japaneseName: 'ソウルパニッシャー', tags: ['fusione', 'gogeta'] }),
  j('time-freeze', 'Time Freeze', 'support', ['guldo'], L(
    "Il potere di Guldo della Squadra Ginew: trattenendo il respiro ferma il tempo per tutti tranne che per sé stesso. Lo usa contro Gohan e Crilin su Namecc, ma l'effetto dura solo finché ha fiato; Vegeta lo uccide prima che possa riprovarci.",
    "The power of Guldo of the Ginyu Force: by holding his breath he stops time for everyone but himself. He uses it against Gohan and Krillin on Namek, but the effect lasts only as long as his breath; Vegeta kills him before he can try again.",
  ), { localizedName: L('Blocco del tempo', 'Time Freeze'), japaneseName: '超能力（時間停止）', tags: ['squadra-ginew'] }),
  j('power-ball', 'Power Ball', 'support', ['vegeta', 'nappa'], L(
    "La luna artificiale dei Saiyan: una sfera di energia mescolata all'ossigeno del pianeta che emette onde Blutz come una luna piena. Vegeta la lancia nel cielo per trasformarsi in scimmione contro Goku, privato della coda.",
    "The Saiyans' artificial moon: a sphere of energy mixed with the planet's oxygen that emits Blutz waves like a full moon. Vegeta throws it into the sky to turn into a Great Ape against Goku, who had lost his tail.",
  ), { localizedName: L('Luna artificiale', 'Power Ball'), japaneseName: 'パワーボール', tags: ['saiyan', 'scimmione'] }),
  j('android-barrier', 'Barrier', 'support', ['android-17', 'cell', 'android-18'], L(
    "La barriera di energia sferica con cui C-17 respinge qualunque colpo: la usa contro Piccolo e, anni dopo, nel Torneo del Potere, dove la espande per proteggere i compagni e resiste fino all'ultimo. Cell la eredita dalle cellule di C-17.",
    "The spherical energy barrier Android 17 uses to repel any blow: he uses it against Piccolo and, years later, in the Tournament of Power, where he expands it to protect his teammates and holds out to the end. Cell inherits it from Android 17's cells.",
  ), { localizedName: L('Barriera', 'Barrier'), japaneseName: 'バリアー', tags: ['cyborg', 'torneo-del-potere'] }),
  j('hells-flash', "Hell's Flash", 'energy_blast', ['android-16'], L(
    "L'attacco di C-16: si stacca gli avambracci e spara dai cannoni nascosti nelle braccia un'enorme onda di energia. Lo usa contro Cell ai Cell Games, senza riuscire a fermarlo.",
    "Android 16's attack: he detaches his forearms and fires a huge energy wave from the cannons hidden in his arms. He uses it against Cell at the Cell Games, without managing to stop him.",
  ), { localizedName: L('Hell Flash', "Hell's Flash"), japaneseName: 'ヘルズフラッシュ', tags: ['cyborg', 'cell-games'] }),
  j('eraser-cannon', 'Eraser Cannon', 'energy_blast', ['broly'], L(
    "La sfera di energia verde che Broly lancia a una mano, capace di distruggere tutto ciò che incontra. È uno dei suoi colpi caratteristici, sia nei film degli anni Novanta sia in Dragon Ball Super: Broly.",
    "The green energy sphere Broly throws one-handed, able to destroy everything in its path. It is one of his signature blows, both in the 1990s films and in Dragon Ball Super: Broly.",
  ), { localizedName: L('Eraser Cannon', 'Eraser Cannon'), japaneseName: 'イレイザーキャノン', tags: ['broly'] }),
  j('petrifying-spit', 'Petrifying Spit', 'support', ['dabura'], L(
    "Lo sputo di Darbula, re del Regno dei Demoni: chi ne viene colpito si trasforma in pietra. Così Darbula pietrifica Piccolo e Crilin a bordo dell'astronave di Babidi; tornano normali solo quando Darbula muore.",
    "The spit of Dabura, king of the Demon Realm: whoever it hits turns to stone. That is how Dabura petrifies Piccolo and Krillin aboard Babidi's spaceship; they return to normal only when Dabura dies.",
  ), { localizedName: L('Sputo pietrificante', 'Petrifying Spit'), japaneseName: '石化の唾', tags: ['majin-bu', 'darbula'] }),
];

/* ================================= PERSONAGGI ================================= */

const ch = (c: Omit<Character, 'worldId' | 'status' | 'canonStatus' | 'referenceStatus'> & Partial<Pick<Character, 'status' | 'referenceStatus'>>): Character => ({
  worldId: 'world-dragonball',
  status: 'alive',
  canonStatus: 'canon',
  referenceStatus: 'verified',
  ...c,
});
const EARTH = 'nation-dbz-earth';
const RR = 'faction-dbz-red-ribbon-army';

export const dragonballEncyclopediaCharacters: Character[] = [
  ch({
    id: 'char-dbz-colonel-silver',
    name: 'Colonel Silver',
    localizedName: L('Colonnello Silver', 'Colonel Silver'),
    japaneseName: 'シルバー大佐',
    importance: 'minor',
    role: ['antagonist'],
    nationId: EARTH,
    factionIds: [RR],
    arcIds: ['arc-dbz-red-ribbon'],
    locationIds: ['loc-dbz-silver-platoon-base'],
    shortDescription: L(
      "Il primo ufficiale dell'Esercito del Red Ribbon che Goku incontra: guida il plotone che cerca le Sfere del Drago e viene messo fuori combattimento dal ragazzino che credeva di poter spaventare.",
      "The first Red Ribbon Army officer Goku meets: he leads the platoon hunting the Dragon Balls and is knocked out by the boy he thought he could scare.",
    ),
    tags: ['red-ribbon'],
  }),
  ch({
    id: 'char-dbz-general-white',
    name: 'General White',
    localizedName: L('Generale White', 'General White'),
    japaneseName: 'ホワイト将軍',
    importance: 'minor',
    role: ['antagonist'],
    nationId: EARTH,
    factionIds: [RR],
    arcIds: ['arc-dbz-red-ribbon'],
    locationIds: ['loc-dbz-muscle-tower', 'loc-dbz-jingle-village'],
    shortDescription: L(
      "Il comandante della Torre Muscolo, nel villaggio innevato di Jingle: mette contro Goku i suoi combattenti piano dopo piano, dal ninja Murasaki al cyborg C-8, che però si ribella e diventa amico di Goku.",
      "The commander of Muscle Tower, in the snowy Jingle Village: he sends his fighters against Goku floor after floor, from the ninja Murasaki to the cyborg Android 8, who instead rebels and befriends Goku.",
    ),
    tags: ['red-ribbon', 'torre-muscolo'],
  }),
  ch({
    id: 'char-dbz-murasaki',
    name: 'Ninja Murasaki',
    localizedName: L('Ninja Murasaki', 'Ninja Murasaki'),
    japaneseName: '忍者ムラサキ',
    importance: 'minor',
    role: ['antagonist'],
    nationId: EARTH,
    factionIds: [RR],
    arcIds: ['arc-dbz-red-ribbon'],
    locationIds: ['loc-dbz-muscle-tower'],
    shortDescription: L(
      "Il ninja della Torre Muscolo che affronta Goku con travestimenti, trucchi e i suoi «fratelli gemelli», cinque identici: Goku li smaschera e li sconfigge uno dopo l'altro.",
      "The Muscle Tower ninja who faces Goku with disguises, tricks and his identical 'twin brothers', five of them: Goku sees through them and beats them one after another.",
    ),
    tags: ['red-ribbon', 'torre-muscolo'],
  }),
  ch({
    id: 'char-dbz-android-8',
    name: 'Android 8',
    localizedName: L('C-8 (Hatchan)', 'Android 8 (Eighter)'),
    japaneseName: '人造人間8号',
    importance: 'minor',
    role: ['ally'],
    race: 'android',
    nationId: EARTH,
    factionIds: [RR],
    allies: ['char-dbz-goku'],
    arcIds: ['arc-dbz-red-ribbon'],
    locationIds: ['loc-dbz-muscle-tower', 'loc-dbz-jingle-village'],
    shortDescription: L(
      "Il gigantesco cyborg Frankenstein del Dr. Gero, tenuto all'ultimo piano della Torre Muscolo. È buono e non vuole combattere: Goku lo libera dal ricatto del Generale White e i due diventano amici; Hatchan resta poi a vivere nel villaggio di Jingle.",
      "Dr. Gero's giant Frankenstein-like cyborg, kept on the top floor of Muscle Tower. He is kind and doesn't want to fight: Goku frees him from General White's blackmail and the two become friends; Eighter then stays to live in Jingle Village.",
    ),
    tags: ['red-ribbon', 'torre-muscolo', 'cyborg'],
  }),
  ch({
    id: 'char-dbz-staff-officer-black',
    name: 'Staff Officer Black',
    localizedName: L('Comandante Black', 'Staff Officer Black'),
    japaneseName: 'ブラック補佐',
    importance: 'minor',
    role: ['antagonist'],
    nationId: EARTH,
    factionIds: [RR],
    arcIds: ['arc-dbz-red-ribbon'],
    locationIds: ['loc-dbz-red-ribbon-hq'],
    shortDescription: L(
      "Il braccio destro del Comandante Red. Quando scopre che Red cerca le Sfere solo per diventare più alto, lo uccide e prende il comando; affronta Goku in un'armatura da battaglia e viene sconfitto, segnando la fine del Red Ribbon.",
      "Commander Red's right-hand man. When he learns that Red wants the Dragon Balls only to become taller, he kills him and takes command; he faces Goku in a battle suit and is defeated, sealing the end of the Red Ribbon.",
    ),
    status: 'deceased',
    tags: ['red-ribbon'],
  }),
  ch({
    id: 'char-dbz-tambourine',
    name: 'Tambourine',
    localizedName: L('Tamburello', 'Tambourine'),
    japaneseName: 'タンバリン',
    importance: 'minor',
    role: ['antagonist'],
    race: 'demon',
    arcIds: ['arc-dbz-king-piccolo'],
    shortDescription: L(
      "Uno dei figli demoni del Grande Mago Piccolo, mandato a eliminare i lottatori più forti del Torneo Tenkaichi. Uccide Crilin dando inizio alla saga; Goku lo vendica sconfiggendolo.",
      "One of King Piccolo's demon sons, sent to wipe out the strongest fighters of the World Martial Arts Tournament. He kills Krillin, opening the saga; Goku avenges him by defeating him.",
    ),
    status: 'deceased',
    tags: ['grande-mago-piccolo'],
  }),
  ch({
    id: 'char-dbz-cymbal',
    name: 'Cymbal',
    localizedName: L('Cembalo', 'Cymbal'),
    japaneseName: 'シンバル',
    importance: 'minor',
    role: ['antagonist'],
    race: 'demon',
    arcIds: ['arc-dbz-king-piccolo'],
    shortDescription: L(
      "Figlio demone del Grande Mago Piccolo dalle sembianze di pterodattilo. Incontra Yajirobe vicino alla Torre di Karin e viene tagliato in due dalla sua spada, poi mangiato.",
      "King Piccolo's pterodactyl-like demon son. He runs into Yajirobe near Korin Tower and is cut in two by his sword, then eaten.",
    ),
    status: 'deceased',
    tags: ['grande-mago-piccolo'],
  }),
  ch({
    id: 'char-dbz-drum',
    name: 'Drum',
    localizedName: L('Tamburo', 'Drum'),
    japaneseName: 'ドラム',
    importance: 'minor',
    role: ['antagonist'],
    race: 'demon',
    arcIds: ['arc-dbz-king-piccolo'],
    shortDescription: L(
      "Il figlio demone più massiccio del Grande Mago Piccolo, generato per affrontare Goku e Tenshinhan nella battaglia finale. Goku, potenziato dall'acqua divina, lo uccide con un solo colpo.",
      "King Piccolo's most massive demon son, spawned to face Goku and Tien in the final battle. Goku, empowered by the divine water, kills him with a single blow.",
    ),
    status: 'deceased',
    tags: ['grande-mago-piccolo'],
  }),
  ch({
    id: 'char-dbz-piano',
    name: 'Piano',
    localizedName: L('Piano', 'Piano'),
    japaneseName: 'ピアノ',
    importance: 'minor',
    role: ['antagonist'],
    race: 'demon',
    arcIds: ['arc-dbz-king-piccolo'],
    shortDescription: L(
      "Il figlio demone più anziano del Grande Mago Piccolo, che fa da consigliere e maggiordomo al padre. Resta al suo fianco durante tutta la conquista del mondo.",
      "King Piccolo's oldest demon son, who serves his father as adviser and butler. He stays by his side throughout the conquest of the world.",
    ),
    status: 'unknown',
    referenceStatus: 'needs_verification',
    tags: ['grande-mago-piccolo'],
  }),
  ch({
    id: 'char-dbz-fangs',
    name: 'Fangs the Vampire',
    localizedName: L('Dracula Man', 'Fangs the Vampire'),
    japaneseName: 'ドラキュラマン',
    importance: 'minor',
    role: ['supporting'],
    arcIds: ['arc-dbz-red-ribbon'],
    locationIds: ['loc-dbz-fortuneteller-baba-palace'],
    shortDescription: L(
      "Uno dei cinque combattenti che Baba la Veggente schiera contro chi vuole un suo responso: un vampiro che si getta sul collo degli avversari. Goku e i suoi amici lo affrontano per farsi indicare l'ultima Sfera del Drago.",
      "One of the five fighters Fortuneteller Baba sets against those who want her reading: a vampire who goes for his opponents' throats. Goku and his friends face him to learn where the last Dragon Ball is.",
    ),
    referenceStatus: 'needs_verification',
    tags: ['baba-la-veggente'],
  }),
  ch({
    id: 'char-dbz-see-through',
    name: 'Invisible Man',
    localizedName: L("L'uomo invisibile", 'Invisible Man'),
    japaneseName: 'スケさん',
    importance: 'minor',
    role: ['supporting'],
    arcIds: ['arc-dbz-red-ribbon'],
    locationIds: ['loc-dbz-fortuneteller-baba-palace'],
    shortDescription: L(
      "Il combattente invisibile di Baba la Veggente: essendo impossibile da vedere, mette in grande difficoltà chi lo affronta, finché il gruppo di Goku non trova un modo per scoprire dove si trova.",
      "Fortuneteller Baba's invisible fighter: since he can't be seen, he gives his opponents a very hard time, until Goku's group finds a way to tell where he is.",
    ),
    referenceStatus: 'needs_verification',
    tags: ['baba-la-veggente'],
  }),
  ch({
    id: 'char-dbz-bandages',
    name: 'Bandages the Mummy',
    localizedName: L('La Mummia', 'Bandages the Mummy'),
    japaneseName: 'ミイラくん',
    importance: 'minor',
    role: ['supporting'],
    arcIds: ['arc-dbz-red-ribbon'],
    locationIds: ['loc-dbz-fortuneteller-baba-palace'],
    shortDescription: L(
      "La mummia gigante che combatte per Baba la Veggente: troppo forte per Yamcha e Crilin, viene sconfitta da Goku.",
      "The giant mummy who fights for Fortuneteller Baba: too strong for Yamcha and Krillin, he is beaten by Goku.",
    ),
    referenceStatus: 'needs_verification',
    tags: ['baba-la-veggente'],
  }),
  ch({
    id: 'char-dbz-spike',
    name: 'Spike the Devil Man',
    localizedName: L("L'Uomo Diavolo", 'Spike the Devil Man'),
    japaneseName: 'アックマン',
    importance: 'minor',
    role: ['supporting'],
    race: 'demon',
    arcIds: ['arc-dbz-red-ribbon'],
    locationIds: ['loc-dbz-fortuneteller-baba-palace'],
    shortDescription: L(
      "Il demone del Regno dei Demoni che combatte per Baba la Veggente: il suo raggio fa esplodere chiunque abbia il cuore malvagio. Su Goku non ha alcun effetto, e Goku lo vince.",
      "The Demon Realm devil who fights for Fortuneteller Baba: his beam makes anyone with an evil heart explode. It has no effect on Goku, who beats him.",
    ),
    tags: ['baba-la-veggente'],
  }),
  ch({
    id: 'char-dbz-sorbet',
    name: 'Sorbet',
    localizedName: L('Sorbet', 'Sorbet'),
    japaneseName: 'ソルベ',
    importance: 'minor',
    role: ['antagonist'],
    factionIds: ['faction-dbz-frieza-force'],
    arcIds: ['arc-dbz-resurrection-f'],
    shortDescription: L(
      "Il comandante dei resti dell'esercito di Freezer. Raccoglie le Sfere del Drago con l'aiuto forzato della banda di Pilaf e fa resuscitare Freezer, dando inizio a «La resurrezione di F».",
      "The commander of what remains of the Frieza Force. He gathers the Dragon Balls with the forced help of Pilaf's gang and has Frieza revived, setting off 'Resurrection F'.",
    ),
    status: 'deceased',
    tags: ['esercito-di-freezer', 'super'],
  }),
  ch({
    id: 'char-dbz-tagoma',
    name: 'Tagoma',
    localizedName: L('Tagoma', 'Tagoma'),
    japaneseName: 'タゴマ',
    importance: 'minor',
    role: ['antagonist'],
    factionIds: ['faction-dbz-frieza-force'],
    arcIds: ['arc-dbz-resurrection-f'],
    shortDescription: L(
      "Uno dei soldati più forti dell'esercito di Freezer, che accompagna Sorbet nella resurrezione dell'imperatore e combatte contro i guerrieri della Terra al suo ritorno.",
      "One of the strongest soldiers of the Frieza Force, who accompanies Sorbet in reviving the emperor and fights Earth's warriors upon his return.",
    ),
    tags: ['esercito-di-freezer', 'super'],
  }),
  ch({
    id: 'char-dbz-cheelai',
    name: 'Cheelai',
    localizedName: L('Cheelai', 'Cheelai'),
    japaneseName: 'チライ',
    importance: 'minor',
    role: ['ally'],
    factionIds: ['faction-dbz-frieza-force'],
    allies: ['char-dbz-broly'],
    arcIds: ['arc-dbz-broly-movie'],
    locationIds: ['loc-dbz-planet-vampa'],
    shortDescription: L(
      "Una disertrice dell'esercito di Freezer che, insieme a Lemo, trova Broly sul pianeta Vampa. Diventa sua amica e, alla fine del film, usa le Sfere per teletrasportarlo lontano dallo scontro, salvandolo.",
      "A Frieza Force deserter who, with Lemo, finds Broly on planet Vampa. She becomes his friend and, at the end of the film, uses the Dragon Balls to teleport him away from the fight, saving him.",
    ),
    tags: ['broly', 'super'],
  }),
  ch({
    id: 'char-dbz-lemo',
    name: 'Lemo',
    localizedName: L('Lemo', 'Lemo'),
    japaneseName: 'レモ',
    importance: 'minor',
    role: ['ally'],
    factionIds: ['faction-dbz-frieza-force'],
    allies: ['char-dbz-broly', 'char-dbz-cheelai'],
    arcIds: ['arc-dbz-broly-movie'],
    locationIds: ['loc-dbz-planet-vampa'],
    shortDescription: L(
      "Un veterano dell'esercito di Freezer che, con Cheelai, recupera Broly e Paragus su Vampa. Uomo pacato e leale, finisce per restare accanto a Broly dopo il film.",
      "A Frieza Force veteran who, with Cheelai, picks up Broly and Paragus on Vampa. A calm, loyal man, he ends up staying by Broly's side after the film.",
    ),
    tags: ['broly', 'super'],
  }),
];

/* =============================== MORTI MANCANTI =============================== */

const e = (o: Omit<TimelineEvent, 'worldId' | 'canon' | 'canonStatus' | 'referenceStatus'> & Partial<Pick<TimelineEvent, 'referenceStatus'>>): TimelineEvent => ({
  worldId: 'world-dragonball',
  canon: 'canon',
  canonStatus: 'canon',
  referenceStatus: 'verified',
  ...o,
});
const DBZ = L('Dragon Ball Z', 'Dragon Ball Z');

export const dragonballEncyclopediaEvents: TimelineEvent[] = [
  e({
    id: 'evt-dbz-android-16-death',
    title: L('La fine di C-16', "Android 16's end"),
    description: L(
      "Ai Cell Games C-16 tenta di autodistruggersi abbracciando Cell, ma la bomba gli era stata rimossa. Cell lo fa a pezzi e ne schiaccia la testa davanti a Gohan: è la spinta che fa scattare il Super Saiyan 2.",
      "At the Cell Games Android 16 tries to self-destruct while grabbing Cell, but his bomb had been removed. Cell tears him apart and crushes his head in front of Gohan: it is the push that triggers Super Saiyan 2.",
    ),
    period: DBZ,
    arcId: 'arc-dbz-cell-saga',
    locationId: 'loc-dbz-cell-games-arena',
    characterIds: ['char-dbz-android-16', 'char-dbz-cell', 'char-dbz-gohan'],
    order: 46.2,
    tags: ['morte', 'cell-games'],
  }),
  e({
    id: 'evt-dbz-trunks-killed-by-cell',
    title: L('Cell uccide Trunks', 'Cell kills Trunks'),
    description: L(
      "Rigenerato dal nucleo dopo l'autodistruzione che ha ucciso Goku, Super Perfect Cell torna sul ring e colpisce Trunks al petto con un raggio, uccidendolo. Vegeta, sconvolto, lo attacca alla cieca; Trunks tornerà in vita con le Sfere.",
      "Regenerated from his core after the self-destruction that killed Goku, Super Perfect Cell returns to the ring and shoots Trunks through the chest, killing him. A distraught Vegeta attacks blindly; Trunks will come back to life with the Dragon Balls.",
    ),
    period: DBZ,
    arcId: 'arc-dbz-cell-saga',
    locationId: 'loc-dbz-cell-games-arena',
    characterIds: ['char-dbz-cell', 'char-dbz-future-trunks', 'char-dbz-vegeta'],
    order: 46.7,
    tags: ['morte', 'cell-games'],
  }),
  e({
    id: 'evt-dbz-dabura-killed',
    title: L('Majin Bu trasforma Darbula in un biscotto', 'Majin Buu turns Dabura into a cookie'),
    description: L(
      "Appena risvegliato, Majin Bu non obbedisce a nessuno. Quando Darbula lo attacca, Bu lo trasforma in un biscotto con il suo raggio e lo mangia: con la sua morte Piccolo e Crilin, pietrificati dal suo sputo, tornano normali.",
      "Freshly awakened, Majin Buu obeys no one. When Dabura attacks him, Buu turns him into a cookie with his beam and eats him: with his death Piccolo and Krillin, petrified by his spit, return to normal.",
    ),
    period: DBZ,
    arcId: 'arc-dbz-majin-buu',
    characterIds: ['char-dbz-majin-buu', 'char-dbz-dabura', 'char-dbz-piccolo', 'char-dbz-krillin'],
    order: 51.05,
    tags: ['morte', 'majin-bu'],
  }),
  e({
    id: 'evt-dbz-babidi-killed',
    title: L('Majin Bu uccide Babidi', 'Majin Buu kills Babidi'),
    description: L(
      "Babidi tratta Majin Bu come un servo e lo minaccia di richiuderlo nel suo bozzolo. Il mostro, che non ha intenzione di obbedire a nessuno, gli si rivolta contro e lo uccide.",
      "Babidi treats Majin Buu like a servant and threatens to seal him back into his cocoon. The monster, who has no intention of obeying anyone, turns on him and kills him.",
    ),
    period: DBZ,
    arcId: 'arc-dbz-majin-buu',
    characterIds: ['char-dbz-majin-buu', 'char-dbz-babidi'],
    order: 52.05,
    referenceStatus: 'needs_verification',
    tags: ['morte', 'majin-bu'],
  }),
];

/* ================================ LUOGHI COSMICI ================================ */
// Pin della mappa del cosmo: coordinate riscritte da scripts/mapgen/dragonball.py.
const place = { worldId: 'world-dragonball', canonStatus: 'canon', referenceStatus: 'verified' } as const;

export const dragonballEncyclopediaLocations: Location[] = [
  {
    ...place,
    id: 'loc-dbz-zeno-palace',
    mapLevelId: 'dbz-map-cosmic',
    name: "Zeno's Palace",
    localizedName: L('Palazzo di Zeno', "Zeno's Palace"),
    type: 'dimension',
    x: 880,
    y: 60,
    shortDescription: L(
      "La reggia del Re di Tutto, al di sopra dei dodici universi, servita dal Gran Sacerdote e dalle guardie. Da qui Zeno, che può cancellare un universo con un gesto, decide il Torneo del Potere dopo aver conosciuto Goku.",
      "The palace of the Omni-King, above all twelve universes, served by the Grand Priest and the guards. From here Zeno, who can erase a universe with a gesture, decides on the Tournament of Power after meeting Goku.",
    ),
    characterIds: ['char-dbz-zeno', 'char-dbz-grand-priest', 'char-dbz-goku'],
    arcIds: ['arc-dbz-tournament-of-power'],
    importance: 'secondary',
    tags: ['zeno', 'super'],
  },
  {
    ...place,
    id: 'loc-dbz-sadala',
    mapLevelId: 'dbz-map-cosmic',
    name: 'Planet Sadala',
    localizedName: L('Pianeta Sadal', 'Planet Sadala'),
    type: 'planet',
    x: 1320,
    y: 360,
    shortDescription: L(
      "Il pianeta dei Saiyan dell'Universo 6, patria di Cabba, Caulifla e Kale. A differenza dei Saiyan dell'Universo 7 sono diventati difensori della giustizia, e non conoscevano il Super Saiyan finché Vegeta non lo insegna a Cabba.",
      "The homeworld of Universe 6's Saiyans, home of Cabba, Caulifla and Kale. Unlike Universe 7's Saiyans they have become defenders of justice, and didn't know Super Saiyan until Vegeta teaches it to Cabba.",
    ),
    characterIds: ['char-dbz-cabba', 'char-dbz-caulifla', 'char-dbz-kale'],
    arcIds: ['arc-dbz-universe-6', 'arc-dbz-tournament-of-power'],
    importance: 'minor',
    tags: ['saiyan', 'universo-6'],
  },
  {
    ...place,
    id: 'loc-dbz-u10-sacred-world',
    mapLevelId: 'dbz-map-cosmic',
    name: 'Sacred World of the Kai (Universe 10)',
    localizedName: L("Pianeta dei Kaiohshin dell'Universo 10", 'Sacred World of the Kai (Universe 10)'),
    type: 'sacred_place',
    x: 690,
    y: 830,
    shortDescription: L(
      "La casa del Kaiohshin Gowasu e del suo apprendista Zamasu nell'Universo 10. Qui Zamasu, convinto che i mortali siano un errore, uccide il maestro e prepara il piano «Zero Mortali» che porterà Goku Black nel futuro di Trunks.",
      "The home of Supreme Kai Gowasu and his apprentice Zamasu in Universe 10. Here Zamasu, convinced that mortals are a mistake, kills his master and prepares the 'Zero Mortals Plan' that will bring Goku Black into Trunks's future.",
    ),
    characterIds: ['char-dbz-zamasu', 'char-dbz-gowasu', 'char-dbz-goku-black'],
    arcIds: ['arc-dbz-goku-black'],
    importance: 'minor',
    tags: ['kaiohshin', 'goku-black'],
  },
];
