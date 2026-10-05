import type { Jutsu, Localizable } from '@/types';

type Kind = Jutsu['chakraNature'];

const ab = (
  id: string,
  name: string,
  type: string,
  chakraNature: Kind,
  characterIds: string[],
  shortDescription: Localizable,
  extra: Partial<Jutsu> = {},
): Jutsu => ({
  id: `zan-bl-${id}`,
  worldId: 'world-bleach',
  name,
  type,
  chakraNature,
  characterIds: characterIds.map((c) => `char-bl-${c}`),
  shortDescription,
  canonStatus: 'canon',
  referenceStatus: 'verified',
  ...extra,
});

const SB: Kind = ['shikai', 'bankai'];
const S: Kind = ['shikai'];
const R: Kind = ['resurreccion'];
const SCHRIFT: Kind = ['schrift'];

/**
 * Poteri di Bleach (`WorldDataset.jutsu`, termine UI «Zanpakutō & Poteri
 * spirituali»). Due facet, definiti in `config.ts`:
 *  - `type` = la FONTE del potere (Zanpakutō, Kidō, Hollow, Quincy, Fullbring…);
 *  - `chakraNature` = lo STADIO o la classe: Shikai, Bankai, Resurrección,
 *    Vollständig, Schrift, Hadō, Bakudō… Una Zanpakutō con entrambi i
 *    rilasci noti porta `['shikai', 'bankai']`.
 *
 * Ogni Zanpakutō è una scheda sola, con il nome della spada, il comando di
 * rilascio originale (con traduzione) e il nome del Bankai. Gli stadi sono
 * mostrati anche sulla scheda del personaggio, in «Trasformazioni & Power-up».
 */
export const bleachAbilities: Jutsu[] = [
  /* ============================ ZANPAKUTŌ ============================ */
  ab('zangetsu', 'Zangetsu', 'zanpakuto', SB, ['ichigo', 'zangetsu', 'white'], {
    it: "La spada di Ichigo, sempre rilasciata: una mannaia nera senza guardia (Shikai). Bankai: Tensa Zangetsu, una katana nera che comprime tutta la potenza in velocità. Dopo la guerra rinasce come due lame, una Shinigami-Hollow e una Quincy.",
    en: "Ichigo's sword, always released: a black guardless cleaver (Shikai). Bankai: Tensa Zangetsu, a black katana that compresses all its power into speed. After the war it is reborn as two blades, one Shinigami-Hollow and one Quincy.",
  }, {
    japaneseName: '斬月',
    longDescription: {
      it: "Per gran parte della serie Ichigo crede che lo spirito della sua spada sia il «vecchio» in nero; solo al Hōōden scopre che quell'uomo è il suo potere Quincy e che il vero Zangetsu è il Hollow interiore. La tecnica firma è il Getsuga Tenshō; la forma suprema, il Mugetsu.",
      en: "For most of the series Ichigo believes his sword's spirit is the 'old man' in black; only at the Hōōden does he learn that this man is his Quincy power and that the true Zangetsu is his inner Hollow. Its signature technique is the Getsuga Tenshō; its ultimate form, the Mugetsu.",
    },
  }),
  ab('sode-no-shirayuki', 'Sode no Shirayuki', 'zanpakuto', SB, ['rukia'], {
    it: "«Mae, Sode no Shirayuki» — «Danza». Considerata la Zanpakutō più bella della Soul Society, interamente bianca, con le danze del ghiaccio Tsukishiro, Hakuren e Shirafune. Bankai: Hakka no Togame, che porta Rukia allo zero assoluto.",
    en: '"Mae, Sode no Shirayuki" — "Dance". Considered the most beautiful Zanpakutō in the Soul Society, pure white, with its ice dances Tsukishiro, Hakuren and Shirafune. Bankai: Hakka no Togame, which takes Rukia to absolute zero.',
  }, { japaneseName: '袖白雪' }),
  ab('zabimaru', 'Zabimaru', 'zanpakuto', SB, ['renji'], {
    it: "«Hoero, Zabimaru» — «Ruggisci»: una spada-frusta segmentata. Bankai: Hihiō Zabimaru, un serpente di ossa con testa di babbuino; dopo l'insegnamento di Ichibē, il vero Bankai Sōō Zabimaru.",
    en: '"Hoero, Zabimaru" — "Roar": a segmented whip-sword. Bankai: Hihiō Zabimaru, a bone snake with a baboon\'s head; after Ichibē\'s teaching, the true Bankai Sōō Zabimaru.',
  }, { japaneseName: '蛇尾丸' }),
  ab('senbonzakura', 'Senbonzakura', 'zanpakuto', SB, ['byakuya', 'as-nodt'], {
    it: "«Chire, Senbonzakura» — «Disperditi»: la lama si dissolve in mille frammenti come petali di ciliegio. Bankai: Senbonzakura Kageyoshi, cento milioni di lame; le forme Senkei e Shūkei: Hakuteiken. Äs Nödt lo ruba nella guerra dei Quincy.",
    en: '"Chire, Senbonzakura" — "Scatter": the blade dissolves into a thousand cherry-blossom fragments. Bankai: Senbonzakura Kageyoshi, a hundred million blades; the Senkei and Shūkei: Hakuteiken forms. Äs Nödt steals it in the Quincy war.',
  }, { japaneseName: '千本桜' }),
  ab('hyorinmaru', 'Hyōrinmaru', 'zanpakuto', SB, ['hitsugaya', 'cang-du'], {
    it: "«Sōten ni zase, Hyōrinmaru» — «Siedi sui cieli gelati»: la più potente Zanpakutō di ghiaccio, che controlla anche il meteo. Bankai: Daiguren Hyōrinmaru, ali di ghiaccio e tredici fiori; nella forma completa Hitsugaya appare adulto.",
    en: '"Sōten ni zase, Hyōrinmaru" — "Sit upon the frozen heavens": the most powerful ice Zanpakutō, which also controls the weather. Bankai: Daiguren Hyōrinmaru, ice wings and thirteen flowers; in its complete form Hitsugaya appears adult.',
  }, { japaneseName: '氷輪丸' }),
  ab('haineko', 'Haineko', 'zanpakuto', S, ['rangiku'], {
    it: "«Unare, Haineko» — «Ringhia»: la lama si dissolve in una nube di cenere tagliente che Rangiku dirige agitando l'elsa. Avvolge e lacera l'avversario da ogni lato.",
    en: '"Unare, Haineko" — "Growl": the blade dissolves into a cloud of cutting ash that Rangiku steers by waving the hilt. It engulfs and shreds the opponent from every side.',
  }, { japaneseName: '灰猫' }),
  ab('ryujin-jakka', 'Ryūjin Jakka', 'zanpakuto', SB, ['yamamoto', 'yhwach'], {
    it: "«Banshō issai kaijin to nase, Ryūjin Jakka» — «Riduci in cenere ogni cosa del creato»: la più antica e potente Zanpakutō di fuoco. Bankai: Zanka no Tachi, che concentra nella lama il calore del sole. Yhwach lo ruba alla morte di Yamamoto.",
    en: '"Banshō issai kaijin to nase, Ryūjin Jakka" — "Reduce all creation to ash": the oldest and most powerful fire Zanpakutō. Bankai: Zanka no Tachi, which condenses the heat of the sun into the blade. Yhwach steals it when Yamamoto dies.',
  }, { japaneseName: '流刃若火' }),
  ab('katen-kyokotsu', 'Katen Kyōkotsu', 'zanpakuto', SB, ['kyoraku'], {
    it: "Due spade che impongono al combattimento le regole dei giochi dei bambini: ombre, colori, nascondino. Bankai: Katen Kyōkotsu: Karamatsu Shinjū, un dramma tragico in più atti che coinvolge chiunque gli sia accanto.",
    en: "Two swords that impose the rules of children's games on combat: shadows, colours, hide-and-seek. Bankai: Katen Kyōkotsu: Karamatsu Shinjū, a tragic drama in several acts that drags in anyone near him.",
  }, { japaneseName: '花天狂骨' }),
  ab('sogyo-no-kotowari', 'Sōgyo no Kotowari', 'zanpakuto', S, ['ukitake'], {
    it: "Due lame unite da una corda con talismani: assorbe un attacco con una spada e lo restituisce, modificato, con l'altra. Il suo Bankai non viene mai mostrato.",
    en: "Two blades joined by a rope with talismans: it absorbs an attack with one sword and returns it, altered, through the other. Its Bankai is never shown.",
  }, { japaneseName: '双魚理' }),
  ab('kyoka-suigetsu', 'Kyōka Suigetsu', 'zanpakuto', S, ['aizen'], {
    it: "«Kudakero, Kyōka Suigetsu» — «Frantumati»: ipnosi completa di tutti i sensi per chiunque abbia visto il rilascio. Aizen la presenta come una spada d'acqua; in realtà è lo strumento con cui inganna l'intera Soul Society.",
    en: '"Kudakero, Kyōka Suigetsu" — "Shatter": complete hypnosis of every sense for anyone who has seen the release. Aizen passes it off as a water sword; in truth it is the tool with which he deceives the entire Soul Society.',
  }, {
    japaneseName: '鏡花水月',
    longDescription: {
      it: "L'unica difesa è non averne mai visto il rilascio: per questo Aizen lo mostra a tutti i capitani tranne Tōsen, cieco. Alla fine della serie, l'illusione che Aizen proietta su Ichigo è ciò che gli permette di colpire Yhwach.",
      en: "The only defence is never having seen its release: which is why Aizen shows it to every captain except the blind Tōsen. At the end of the series, the illusion Aizen casts over Ichigo is what lets him strike Yhwach.",
    },
  }),
  ab('shinso', 'Shinsō', 'zanpakuto', SB, ['gin'], {
    it: "«Ikorose, Shinsō» — «Uccidi»: una lama corta che si allunga e si ritrae in un istante. Bankai: Kamishini no Yari, che si dice raggiunga tredici chilometri; il vero segreto è una tossina che dissolve le cellule.",
    en: '"Ikorose, Shinsō" — "Shoot to kill": a short blade that extends and retracts in an instant. Bankai: Kamishini no Yari, said to reach thirteen kilometres; its true secret is a toxin that dissolves cells.',
  }, { japaneseName: '神鎗' }),
  ab('suzumushi', 'Suzumushi', 'zanpakuto', SB, ['tosen'], {
    it: "«Nake, Suzumushi» — «Frinisci»: un suono acutissimo che fa perdere i sensi. Bankai: Suzumushi Tsuishiki: Enma Kōrogi, una cupola dove nessuno vede, sente o percepisce nulla tranne Tōsen.",
    en: '"Nake, Suzumushi" — "Cry": a piercing sound that knocks people unconscious. Bankai: Suzumushi Tsuishiki: Enma Kōrogi, a dome where nobody sees, hears or senses anything except Tōsen.',
  }, { japaneseName: '清虫' }),
  ab('tenken', 'Tenken', 'zanpakuto', SB, ['komamura', 'bambietta'], {
    it: "«Todoroke, Tenken» — «Rimbomba»: ogni fendente è ripetuto da un braccio e una lama giganti. Bankai: Kokujō Tengen Myō'ō, un gigante in armatura legato al corpo del capitano.",
    en: '"Todoroke, Tenken" — "Roar": every slash is repeated by a giant arm and blade. Bankai: Kokujō Tengen Myō\'ō, an armoured giant bound to the captain\'s body.',
  }, { japaneseName: '天譴' }),
  ab('suzumebachi', 'Suzumebachi', 'zanpakuto', SB, ['soi-fon', 'bg9'], {
    it: "«Jinsatsu, Suzumebachi» — «Pungi a morte i nemici»: un pungiglione d'oro sul dito; due colpi nello stesso punto uccidono (Nigeki Kessatsu). Bankai: Jakuhō Raikōben, un gigantesco missile.",
    en: '"Jinsatsu, Suzumebachi" — "Sting all enemies to death": a golden stinger on the finger; two strikes in the same spot kill (Nigeki Kessatsu). Bankai: Jakuhō Raikōben, a gigantic missile.',
  }, { japaneseName: '雀蜂' }),
  ab('ashisogi-jizo', 'Ashisogi Jizō', 'zanpakuto', SB, ['mayuri'], {
    it: "«Kakere, Ashisogi Jizō» — «Graffia»: un tridente con un volto di neonato, il cui veleno paralizza gli arti ma lascia sentire il dolore. Bankai: Konjiki Ashisogi Jizō, un bruco gigante che esala veleno.",
    en: '"Kakere, Ashisogi Jizō" — "Rip": a trident with an infant\'s face, whose poison paralyses the limbs but leaves the pain. Bankai: Konjiki Ashisogi Jizō, a giant caterpillar that breathes poison.',
  }, { japaneseName: '疋殺地蔵' }),
  ab('minazuki', 'Minazuki', 'zanpakuto', SB, ['unohana'], {
    it: "Shikai: una creatura simile a una manta che trasporta e cura i feriti. Bankai: anch'esso Minazuki, una lama grondante sangue che rivela la vera natura del primo Kenpachi.",
    en: 'Shikai: a manta-like creature that carries and heals the wounded. Bankai: also called Minazuki, a blood-dripping blade that reveals the true nature of the first Kenpachi.',
  }, { japaneseName: '肉雫唼' }),
  ab('nozarashi', 'Nozarashi', 'zanpakuto', SB, ['kenpachi', 'yachiru'], {
    it: "«Nomikome, Nozarashi» — «Divora»: la spada che Kenpachi ha ignorato per tutta la vita diventa un'ascia gigantesca capace di tagliare ogni cosa. Il suo Bankai, senza nome, lo trasforma in un demone.",
    en: '"Nomikome, Nozarashi" — "Drink": the sword Kenpachi ignored all his life becomes a gigantic axe able to cut anything. Its nameless Bankai turns him into a demon.',
  }, { japaneseName: '野晒' }),
  ab('hozukimaru', 'Hōzukimaru', 'zanpakuto', SB, ['ikkaku'], {
    it: "«Nobiro, Hōzukimaru» — «Allungati»: una lancia che si divide in tre sezioni come un nunchaku. Bankai: Ryūmon Hōzukimaru, tre armi giganti con un drago che si colora man mano che la battaglia si accende.",
    en: '"Nobiro, Hōzukimaru" — "Extend": a spear that splits into three sections like a nunchaku. Bankai: Ryūmon Hōzukimaru, three giant weapons with a dragon that fills with colour as the battle heats up.',
  }, { japaneseName: '鬼灯丸' }),
  ab('ruriiro-kujaku', "Ruri'iro Kujaku", 'zanpakuto', S, ['yumichika'], {
    it: "Chiamata con il falso nome di Fuji Kujaku, è una spada a quattro punte. Con il vero nome, Ruri'iro Kujaku, diventa viticci di pavone che legano il nemico e ne assorbono l'energia spirituale.",
    en: "Called by the false name of Fuji Kujaku, it is a four-pronged sword. By its true name, Ruri'iro Kujaku, it becomes peacock vines that bind the enemy and drain their spiritual energy.",
  }, { japaneseName: '瑠璃色孔雀' }),
  ab('tobiume', 'Tobiume', 'zanpakuto', S, ['hinamori'], {
    it: "«Hajike, Tobiume» — «Scoppia»: una lama dentellata che lancia sfere di fuoco esplosive. È una Zanpakutō di tipo Kidō, adatta a una maga come Hinamori.",
    en: '"Hajike, Tobiume" — "Snap": a serrated blade that fires explosive fireballs. It is a Kidō-type Zanpakutō, well suited to a spellcaster like Hinamori.',
  }, { japaneseName: '飛梅' }),
  ab('wabisuke', 'Wabisuke', 'zanpakuto', S, ['kira'], {
    it: "«Omote o agero, Wabisuke» — «Alza la testa»: la lama si piega a uncino quadrato e raddoppia il peso di tutto ciò che colpisce, finché l'avversario non china il capo.",
    en: '"Omote o agero, Wabisuke" — "Raise your head": the blade bends into a square hook and doubles the weight of whatever it hits, until the opponent bows their head.',
  }, { japaneseName: '侘助' }),
  ab('kazeshini', 'Kazeshini', 'zanpakuto', SB, ['hisagi'], {
    it: "«Kare, Kazeshini» — «Mieti»: due falci a doppia lama legate da una catena, che Hisagi teme per la loro forma da arma di morte. Il Bankai, Fushi no Kōjō, compare nel romanzo «Can't Fear Your Own World».",
    en: '"Kare, Kazeshini" — "Reap": two double-bladed sickles joined by a chain, which Hisagi fears for their death-weapon shape. Its Bankai, Fushi no Kōjō, appears in the novel \'Can\'t Fear Your Own World\'.',
  }, { japaneseName: '風死' }),
  ab('itegumo', 'Itegumo', 'zanpakuto', S, ['isane'], {
    it: "«Ute, Itegumo» — «Colpisci»: la spada della vicecapitana della Quarta Divisione, una lama dalle tre punte poco vista in combattimento.",
    en: '"Ute, Itegumo" — "Strike": the sword of the Fourth Division lieutenant, a three-pronged blade rarely seen in combat.',
  }, { japaneseName: '凍雲', referenceStatus: 'needs_verification' }),
  ab('gegetsuburi', 'Gegetsuburi', 'zanpakuto', S, ['omaeda'], {
    it: "La Zanpakutō di Ōmaeda: in Shikai diventa una mazza chiodata su catena, pesante e brutale come il suo proprietario è vanitoso.",
    en: "Ōmaeda's Zanpakutō: in Shikai it becomes a spiked flail on a chain, as heavy and brutal as its owner is vain.",
  }, { japaneseName: '五形頭' }),
  ab('gonryomaru', 'Gonryōmaru', 'zanpakuto', SB, ['sasakibe', 'driscoll'], {
    it: "La spada di Sasakibe, una lama sottile che conduce il fulmine. Bankai: Kōkō Gonryō Rikyū, un anello di spade che scatena tempeste; rubato dal Wandenreich e usato da Driscoll contro Yamamoto.",
    en: "Sasakibe's sword, a thin blade that channels lightning. Bankai: Kōkō Gonryō Rikyū, a ring of swords that unleashes storms; stolen by the Wandenreich and used by Driscoll against Yamamoto.",
  }, { japaneseName: '厳霊丸' }),
  ab('sakanade', 'Sakanade', 'zanpakuto', S, ['shinji'], {
    it: "«Taose, Sakanade» — «Cadi»: un anello sull'elsa che diffonde un profumo e rovescia i sensi di chi lo respira: alto e basso, destra e sinistra, perfino la direzione da cui vede arrivare i colpi.",
    en: '"Taose, Sakanade" — "Collapse": a ring on the hilt that spreads a scent and inverts the senses of whoever breathes it: up and down, left and right, even the direction blows seem to come from.',
  }, { japaneseName: '逆撫' }),
  ab('tachikaze', 'Tachikaze', 'zanpakuto', SB, ['kensei'], {
    it: "Un pugnale da combattimento che scaglia lame di vento. Bankai: Tekken Tachikaze, due grandi tirapugni-lama che esplodono a ogni pugno.",
    en: 'A combat knife that hurls blades of wind. Bankai: Tekken Tachikaze, two large knuckle-blades that explode with every punch.',
  }, { japaneseName: '断風' }),
  ab('kinshara', 'Kinshara', 'zanpakuto', SB, ['rose'], {
    it: "Una frusta dorata suonata come uno strumento. Bankai: Kinshara Butōdan, un'orchestra di illusioni che ferisce davvero chiunque ne ascolti la musica.",
    en: 'A golden whip played like an instrument. Bankai: Kinshara Butōdan, an orchestra of illusions that truly wounds anyone who hears its music.',
  }, { japaneseName: '金沙羅' }),
  ab('tengumaru', 'Tengumaru', 'zanpakuto', S, ['love'], {
    it: "La Zanpakutō di Love Aikawa: in Shikai diventa un gigantesco kanabō nero coperto di spine, più alto del doppio di lui, capace di sputare fuoco.",
    en: "Love Aikawa's Zanpakutō: in Shikai it becomes a gigantic black kanabō covered in spikes, more than twice his height, able to spit fire.",
  }, { japaneseName: '天狗丸' }),
  ab('haguro-tonbo', 'Haguro Tonbo', 'zanpakuto', S, ['lisa'], {
    it: "La Zanpakutō di Lisa Yadōmaru, che in Shikai diventa una lunga arma a pala usata come una lancia.",
    en: "Lisa Yadōmaru's Zanpakutō, which in Shikai becomes a long spade-headed weapon wielded like a spear.",
  }, { japaneseName: '鉄漿蜻蛉' }),
  ab('kubikiri-orochi', 'Kubikiri Orochi', 'zanpakuto', S, ['hiyori'], {
    it: "La Zanpakutō di Hiyori: in Shikai una grande lama seghettata, brutale e diretta come la sua proprietaria.",
    en: "Hiyori's Zanpakutō: in Shikai a large serrated blade, as brutal and direct as its owner.",
  }, { japaneseName: '馘大蛇' }),
  ab('nejibana', 'Nejibana', 'zanpakuto', S, ['kaien', 'aaroniero'], {
    it: "«Suiten sakamake, Nejibana» — «Ribolli, cielo e mare»: un tridente che controlla l'acqua e ne moltiplica la forza a ogni rotazione. Aaroniero la usa con il volto di Kaien.",
    en: '"Suiten sakamake, Nejibana" — "Rankle the seas and the skies": a trident that controls water and multiplies its force with every spin. Aaroniero wields it wearing Kaien\'s face.',
  }, { japaneseName: '捩花' }),
  ab('engetsu', 'Engetsu', 'zanpakuto', S, ['isshin'], {
    it: "«Moero, Engetsu» — «Brucia»: la spada di Isshin, che ricopre la lama di fiamme. Isshin lancia con lei un Getsuga Tenshō, la tecnica che il figlio erediterà.",
    en: '"Moero, Engetsu" — "Burn": Isshin\'s sword, which wreathes the blade in flame. With it Isshin unleashes a Getsuga Tenshō, the technique his son will inherit.',
  }, { japaneseName: '剡月' }),
  ab('benihime', 'Benihime', 'zanpakuto', SB, ['urahara'], {
    it: "«Okiro, Benihime» — «Svegliati»: la spada nascosta nel bastone di Urahara, che scaglia lame scarlatte e crea scudi. Bankai: Kannonbiraki Benihime Aratame, che ricuce e ricompone tutto ciò che tocca.",
    en: '"Okiro, Benihime" — "Awaken": the sword hidden in Urahara\'s cane, which fires crimson blades and creates shields. Bankai: Kannonbiraki Benihime Aratame, which restitches and reshapes everything it touches.',
  }, { japaneseName: '紅姫' }),
  ab('ichimonji', 'Ichimonji', 'zanpakuto', SB, ['ichibe'], {
    it: "Un enorme pennello: l'inchiostro cancella il nome, e quindi il potere, di ciò che tocca. Bankai: Shirafude Ichimonji, il pennello bianco che assegna un nuovo nome — e una nuova forza — a ciò che era stato cancellato.",
    en: 'A huge brush: its ink erases the name, and therefore the power, of whatever it touches. Bankai: Shirafude Ichimonji, the white brush that assigns a new name — and a new strength — to what had been erased.',
  }, { japaneseName: '一文字' }),
  ab('shigarami-no-tsuji', 'Shatatsu Karagara Shigarami no Tsuji', 'zanpakuto', ['bankai'], ['senjumaru'], {
    it: "Il Bankai di Senjumaru Shutara: un gigantesco telaio che tesse la realtà del campo di battaglia attorno ai nemici. Liberato contro la Schutzstaffel di Yhwach all'assalto del Reiōkyū.",
    en: "Senjumaru Shutara's Bankai: a gigantic loom that weaves the reality of the battlefield around her enemies. Unleashed against Yhwach's Schutzstaffel during the assault on the Reiōkyū.",
  }, { japaneseName: '娑闥迦羅骸刺絡辻' }),
  ab('hakkyoken', 'Shinken Hakkyōken', 'zanpakuto', [], ['nanao'], {
    it: "La spada sacra della famiglia Ise, che riflette e restituisce i poteri divini. Kyōraku la tenne nascosta a Nanao finché, contro Lille Barro, non fu lei a impugnarla.",
    en: 'The sacred sword of the Ise family, which reflects and returns divine powers. Kyōraku kept it from Nanao until, against Lille Barro, she was the one to wield it.',
  }, { japaneseName: '神剣・八鏡剣' }),
  ab('hisagomaru', 'Hisagomaru', 'zanpakuto', S, ['hanataro'], {
    it: "La Zanpakutō curativa di Hanatarō: guarisce le ferite che taglia e ne accumula l'energia, finché, carica, non la restituisce in un unico colpo.",
    en: "Hanatarō's healing Zanpakutō: it heals the wounds it cuts and stores their energy until, once charged, it releases it in a single blow.",
  }, { japaneseName: '瓠丸' }),

  /* ===================== TECNICHE DI ICHIGO ===================== */
  ab('getsuga-tensho', 'Getsuga Tenshō', 'zanpakuto', ['technique'], ['ichigo', 'isshin', 'white', 'zangetsu'], {
    it: "La «zanna della luna che squarcia il cielo»: Zangetsu assorbe l'energia spirituale di Ichigo e la libera come un'onda a mezzaluna. Nera con il Bankai, rossa e nera con la maschera Hollow; l'aveva usata prima Isshin.",
    en: "The 'moon fang heaven-piercer': Zangetsu absorbs Ichigo's spiritual pressure and releases it as a crescent wave. Black with Bankai, red and black with the Hollow mask; Isshin had used it before him.",
  }, { japaneseName: '月牙天衝' }),
  ab('mugetsu', 'Mugetsu (Final Getsuga Tenshō)', 'zanpakuto', ['technique'], ['ichigo', 'zangetsu'], {
    it: "L'Ultimo Getsuga Tenshō: Ichigo diventa il Getsuga stesso, con un potere che supera Aizen fuso con lo Hōgyoku. Il prezzo è la perdita di tutti i poteri da Shinigami. Il colpo finale si chiama Mugetsu, «senza luna».",
    en: "The Final Getsuga Tenshō: Ichigo becomes the Getsuga itself, with a power surpassing Aizen fused with the Hōgyoku. The price is losing all his Soul Reaper powers. The final strike is called Mugetsu, 'moonless'.",
  }, { japaneseName: '無月' }),

  /* ============================== KIDŌ ============================== */
  ab('hado', 'Hadō (Way of Destruction)', 'kido', ['hado'], ['rukia', 'aizen', 'hinamori', 'urahara', 'tessai', 'yamamoto', 'byakuya'], {
    it: "Il Kidō offensivo, numerato da 1 a 99: dal Byakurai (#4) e lo Shakkahō (#31) al Raikōhō (#63) e al Kurohitsugi (#90). Più alto il numero, più potente l'incantesimo; i maestri lo usano senza recitare la formula.",
    en: 'Offensive Kidō, numbered from 1 to 99: from Byakurai (#4) and Shakkahō (#31) to Raikōhō (#63) and Kurohitsugi (#90). The higher the number, the stronger the spell; masters cast it without reciting the incantation.',
  }, { japaneseName: '破道' }),
  ab('bakudo', 'Bakudō (Way of Binding)', 'kido', ['bakudo'], ['rukia', 'urahara', 'tessai', 'hachigen', 'nanao', 'hinamori', 'aizen', 'byakuya'], {
    it: "Il Kidō di vincolo e difesa: catene di luce come il Rikujōkōrō (#61), barriere come il Danku (#81) e sigilli. Fondamentale per Tessai, Hachigen e Urahara, ed è con un Kidō innestato che Aizen viene sigillato.",
    en: 'Kidō of binding and defence: chains of light like Rikujōkōrō (#61), barriers like Danku (#81) and seals. Essential for Tessai, Hachigen and Urahara, and it is with a planted Kidō that Aizen is sealed.',
  }, { japaneseName: '縛道' }),
  ab('kaido', 'Kaidō (healing)', 'kido', ['kaido'], ['unohana', 'isane', 'hanataro', 'tessai', 'hachigen'], {
    it: "Il Kidō curativo, specialità della Quarta Divisione: riversa energia spirituale nelle ferite per richiuderle. Unohana ne è la massima esperta, avendolo imparato per poter combattere più a lungo.",
    en: "Healing Kidō, the Fourth Division's specialty: it pours spiritual energy into wounds to close them. Unohana is its greatest expert, having learned it so she could fight longer.",
  }, { japaneseName: '回道' }),
  ab('kurohitsugi', 'Hadō #90: Kurohitsugi', 'kido', ['hado'], ['aizen'], {
    it: "La «bara nera»: un parallelepipedo di energia oscura che avvolge e trafigge l'avversario da ogni lato. Aizen la lancia senza incantesimo contro Komamura, e alla Karakura replica, con la formula completa, contro Ichigo.",
    en: "The 'black coffin': a box of dark energy that encloses and pierces the opponent from every side. Aizen casts it without incantation against Komamura, and at the replica Karakura, with the full incantation, against Ichigo.",
  }, { japaneseName: '黒棺' }),
  ab('itto-kaso', 'Hadō #96: Ittō Kasō', 'kido', ['hado', 'kinjutsu'], ['yamamoto'], {
    it: "Una tecnica proibita che richiede il sacrificio di una parte del corpo: Yamamoto si brucia un braccio per evocare una lama di fuoco gigante e annientare Wonderweiss, nel tentativo di colpire anche Aizen.",
    en: 'A forbidden technique that requires sacrificing part of the body: Yamamoto burns away an arm to summon a giant blade of fire and annihilate Wonderweiss, while trying to strike Aizen too.',
  }, { japaneseName: '一刀火葬' }),

  /* ========================== HOHŌ / HAKUDA ========================== */
  ab('shunpo', 'Shunpo (Flash Step)', 'hoho', ['technique'], ['yoruichi', 'byakuya', 'ichigo', 'soi-fon', 'urahara', 'yamamoto', 'kyoraku', 'gin', 'hitsugaya', 'aizen'], {
    it: "Il «passo lampo»: la tecnica di movimento degli Shinigami per coprire grandi distanze in un istante. Yoruichi, la «Dea del Lampo», ne è la massima maestra; gli equivalenti sono il Sonído degli Arrancar e lo Hirenkyaku dei Quincy.",
    en: "The 'flash step': the Soul Reapers' movement technique to cover great distances in an instant. Yoruichi, the 'Flash Goddess', is its greatest master; its equivalents are the Arrancar's Sonído and the Quincy's Hirenkyaku.",
  }, { japaneseName: '瞬歩' }),
  ab('shunko', 'Shunkō', 'hakuda', ['technique'], ['yoruichi', 'soi-fon'], {
    it: "La fusione segreta di Hakuda e Kidō: l'energia si concentra su schiena e spalle ed esplode nei colpi a mani nude, strappando la divisa. Yoruichi la mostra a Soi Fon sul Sōkyoku; nella sua forma finale diventa Shunkō: Raijin Senki.",
    en: "The secret fusion of Hakuda and Kidō: energy gathers on the back and shoulders and explodes in bare-handed strikes, tearing the uniform. Yoruichi shows it to Soi Fon on the Sōkyoku; in its final form it becomes Shunkō: Raijin Senki.",
  }, { japaneseName: '瞬閧' }),

  /* =========================== HOLLOW / ARRANCAR =========================== */
  ab('cero', 'Cero', 'hollow', ['technique'], ['ulquiorra', 'grimmjow', 'starrk', 'yammy', 'nnoitra', 'barragan', 'harribel', 'ichigo', 'white', 'shinji', 'nelliel', 'szayelaporro'], {
    it: "Il «colpo a zero»: un raggio di energia spirituale concentrata sparato dalla bocca, dalle mani o dalle corna. Ogni Hollow superiore lo possiede; il Cero Oscuras degli Espada e il Cero di Ichigo Hollow sono fra i più devastanti.",
    en: "The 'zero blast': a beam of concentrated spiritual energy fired from the mouth, hands or horns. Every advanced Hollow has it; the Espada's Cero Oscuras and Hollow Ichigo's Cero are among the most devastating.",
  }, { japaneseName: '虚閃' }),
  ab('gran-rey-cero', 'Gran Rey Cero', 'hollow', ['technique'], ['grimmjow', 'ulquiorra'], {
    it: "Il «Cero del Gran Re», esclusivo degli Espada: il Cero mescolato al loro stesso sangue, così potente da deformare lo spazio. Il suo uso dentro Las Noches è proibito.",
    en: "The 'Great King's Cero', exclusive to the Espada: a Cero mixed with their own blood, so powerful it warps space. Its use inside Las Noches is forbidden.",
  }, { japaneseName: '王虚の閃光' }),
  ab('bala', 'Bala', 'hollow', ['technique'], ['yammy'], {
    it: "Il «proiettile»: energia spirituale compressa e sparata dal pugno, meno potente del Cero ma venti volte più rapida. Yammy ne fa un uso brutale.",
    en: "The 'bullet': spiritual energy compressed and fired from the fist, weaker than a Cero but twenty times faster. Yammy makes brutal use of it.",
  }, { japaneseName: '虚弾' }),
  ab('sonido', 'Sonído', 'hollow', ['technique'], ['ulquiorra', 'grimmjow', 'starrk', 'zommari'], {
    it: "Lo spostamento ultra-rapido degli Arrancar, equivalente allo Shunpo. Zommari lo spinge fino a creare cinque immagini residue contemporaneamente.",
    en: 'The Arrancar\'s ultra-fast movement, equivalent to Shunpo. Zommari pushes it as far as creating five afterimages at once.',
  }, { japaneseName: '響転' }),
  ab('hierro', 'Hierro', 'hollow', ['technique'], ['nnoitra', 'yammy'], {
    it: "La «pelle di ferro» degli Arrancar: energia spirituale condensata sotto la pelle che respinge le lame. Nnoitra si vanta di avere la più dura di tutti gli Espada — finché non incontra Kenpachi.",
    en: "The Arrancar's 'iron skin': spiritual energy condensed beneath the skin that repels blades. Nnoitra boasts of having the toughest of all the Espada — until he meets Kenpachi.",
  }, { japaneseName: '鋼皮' }),
  ab('hollowfication', 'Hollowfication (Hollow mask)', 'hollow', ['hollowfication'], ['ichigo', 'shinji', 'hiyori', 'lisa', 'love', 'rose', 'kensei', 'mashiro', 'hachigen', 'tosen', 'white'], {
    it: "Il potere dei Visored: indossare la maschera del proprio Hollow interiore per oltrepassare i limiti di uno Shinigami. Nato dagli esperimenti di Aizen, Ichigo lo domina nel magazzino dei Visored; Tōsen lo usa per liberare una Resurrección.",
    en: "The Visored's power: donning the mask of one's inner Hollow to go beyond a Soul Reaper's limits. Born from Aizen's experiments, Ichigo masters it in the Visored's warehouse; Tōsen uses it to unleash a Resurrección.",
  }, { japaneseName: '虚化' }),
  ab('los-lobos', 'Los Lobos', 'hollow', R, ['starrk', 'lilynette'], {
    it: "«Kechirase, Los Lobos» — «Disperdili a calci»: la Resurrección di Starrk, in cui Lilynette diventa due pistole capaci di raffiche di Cero e un branco di lupi esplosivi.",
    en: '"Kechirase, Los Lobos" — "Kick about": Starrk\'s Resurrección, in which Lilynette becomes two pistols able to fire volleys of Ceros and a pack of exploding wolves.',
  }),
  ab('arrogante', 'Arrogante', 'hollow', R, ['barragan'], {
    it: "«Kuchiro, Arrogante» — «Marcisci»: la Resurrección di Barragan, uno scheletro coronato avvolto nel Respira, il miasma che fa invecchiare e disfare tutto ciò che tocca.",
    en: '"Kuchiro, Arrogante" — "Rot": Barragan\'s Resurrección, a crowned skeleton wrapped in Respira, the miasma that ages and decays everything it touches.',
  }),
  ab('tiburon', 'Tiburón', 'hollow', R, ['harribel'], {
    it: "«Ute, Tiburón» — «Distruggi»: la Resurrección di Harribel, una lama a forma di squalo e il pieno controllo dell'acqua, fino a inondare il campo con la Cascada.",
    en: '"Ute, Tiburón" — "Destroy": Harribel\'s Resurrección, a shark-shaped blade and full command of water, to the point of flooding the field with Cascada.',
  }),
  ab('murcielago', 'Murciélago', 'hollow', ['resurreccion', 'segunda_etapa'], ['ulquiorra'], {
    it: "«Tozase, Murciélago» — «Rinchiudi»: ali nere da pipistrello e la lancia Luz de la Luna. Unico fra gli Espada, Ulquiorra possiede una Segunda Etapa, con la Lanza del Relámpago.",
    en: '"Tozase, Murciélago" — "Enclose": black bat wings and the Luz de la Luna lance. Uniquely among the Espada, Ulquiorra has a Segunda Etapa, with the Lanza del Relámpago.',
  }),
  ab('santa-teresa', 'Santa Teresa', 'hollow', R, ['nnoitra'], {
    it: "«Inore, Santa Teresa» — «Prega»: la Resurrección di Nnoitra, simile a una mantide religiosa con sei braccia armate di falci.",
    en: '"Inore, Santa Teresa" — "Pray": Nnoitra\'s Resurrección, like a praying mantis with six arms armed with scythes.',
  }),
  ab('pantera', 'Pantera', 'hollow', R, ['grimmjow'], {
    it: "«Kishire, Pantera» — «Stridi»: la Resurrección di Grimmjow, un corpo felino con artigli, frecce dagli avambracci e la Desgarrón, cinque artigli di energia che lacerano lo spazio.",
    en: '"Kishire, Pantera" — "Grind": Grimmjow\'s Resurrección, a feline body with claws, darts from the forearms and Desgarrón, five claws of energy that tear through space.',
  }),
  ab('brujeria', 'Brujería', 'hollow', R, ['zommari'], {
    it: "«Shizumare, Brujería» — «Placati»: la Resurrección di Zommari, un corpo coperto di cinquanta occhi; con l'Amor ognuno prende il controllo della parte del corpo che fissa.",
    en: '"Shizumare, Brujería" — "Suppress": Zommari\'s Resurrección, a body covered in fifty eyes; with Amor each one takes control of whatever body part it stares at.',
  }),
  ab('fornicaras', 'Fornicarás', 'hollow', R, ['szayelaporro'], {
    it: "«Sasure, Fornicarás» — «Sorseggia»: la Resurrección di Szayelaporro, ali-tentacoli che inglobano il nemico per crearne copie e bambole voodoo dei suoi organi.",
    en: '"Sasure, Fornicarás" — "Sip": Szayelaporro\'s Resurrección, tentacle-wings that engulf the enemy to make copies and voodoo dolls of their organs.',
  }, { referenceStatus: 'needs_verification' }),
  ab('gloteneria', 'Glotonería', 'hollow', R, ['aaroniero'], {
    it: "«Kuitsukuse, Glotonería» — «Divora tutto»: la Resurrección di Aaroniero, una massa colossale formata dalle decine di migliaia di Hollow che ha divorato, di cui conserva forme e poteri.",
    en: '"Kuitsukuse, Glotonería" — "Devour": Aaroniero\'s Resurrección, a colossal mass formed from the tens of thousands of Hollows he has devoured, whose shapes and powers he keeps.',
  }),
  ab('ira', 'Ira', 'hollow', R, ['yammy'], {
    it: "«Ikare, Ira» — «Infuriati»: la Resurrección di Yammy, che cresce senza limite con la sua rabbia; il suo numero passa da 10 a 0.",
    en: '"Ikare, Ira" — "Enrage": Yammy\'s Resurrección, which grows without limit with his rage; his number changes from 10 to 0.',
  }),
  ab('gamuza', 'Gamuza', 'hollow', R, ['nelliel'], {
    it: "«Utae, Gamuza» — «Canta»: la Resurrección di Nelliel, un corpo da centauro e la lancia a doppia punta Lanzador Verde.",
    en: '"Utae, Gamuza" — "Declare": Nelliel\'s Resurrección, a centaur\'s body and the double-pointed lance Lanzador Verde.',
  }),

  /* ============================== QUINCY ============================== */
  ab('heilig-pfeil', 'Heilig Pfeil', 'quincy', ['technique'], ['uryu', 'ryuken', 'soken', 'masaki', 'yhwach', 'haschwalth'], {
    it: "La «freccia sacra»: il colpo base dei Quincy, una freccia di reishi assorbito dall'ambiente e scoccata con un arco spirituale. Uryū arriva a scoccarne migliaia in un istante.",
    en: "The 'holy arrow': the Quincy's basic attack, an arrow of reishi absorbed from the surroundings and loosed from a spirit bow. Uryū comes to fire thousands in an instant.",
  }, { japaneseName: '神聖滅矢' }),
  ab('hirenkyaku', 'Hirenkyaku', 'quincy', ['technique'], ['uryu', 'ryuken', 'haschwalth'], {
    it: "La tecnica di movimento dei Quincy: si corre su una piattaforma di reishi che scorre sotto i piedi, l'equivalente dello Shunpo degli Shinigami.",
    en: "The Quincy's movement technique: one rides a platform of reishi flowing beneath the feet, the equivalent of the Soul Reapers' Shunpo.",
  }, { japaneseName: '飛廉脚' }),
  ab('blut', 'Blut', 'quincy', ['technique'], ['yhwach', 'masaki', 'haschwalth'], {
    it: "Il reishi fatto scorrere nei vasi sanguigni: Blut Vene per la difesa, Blut Arterie per l'attacco. Non si possono usare insieme, tranne che da Yhwach.",
    en: 'Reishi flowing through the blood vessels: Blut Vene for defence, Blut Arterie for attack. They cannot be used together, except by Yhwach.',
  }, { japaneseName: '血装' }),
  ab('letzt-stil', 'Quincy: Letzt Stil', 'quincy', ['technique'], ['uryu'], {
    it: "La «forma finale» dei Quincy: un guanto rilascia ogni limite e concede un potere enorme per un breve tempo, al prezzo della perdita dei poteri. Uryū la usa contro Mayuri.",
    en: "The Quincy's 'final form': a glove releases every limit and grants enormous power for a short time, at the cost of losing one's powers. Uryū uses it against Mayuri.",
  }, { japaneseName: '滅却師最終形態' }),
  ab('vollstandig', 'Quincy: Vollständig', 'quincy', ['vollstandig'], ['quilge', 'askin', 'lille-barro', 'candice'], {
    it: "La forma suprema dei Quincy moderni: ali e aureola di reishi, nomi angelici e poteri amplificati. Quilge, Askin, Lille Barro e Candice la mostrano nella guerra di mille anni.",
    en: 'The ultimate form of modern Quincy: wings and a halo of reishi, angelic names and amplified powers. Quilge, Askin, Lille Barro and Candice display it in the thousand-year war.',
  }, { japaneseName: '滅却師完聖体' }),
  ab('schrift', 'Schrift', 'quincy', SCHRIFT, ['yhwach', 'haschwalth', 'uryu', 'askin'], {
    it: "La lettera dell'alfabeto che Yhwach incide nell'anima di uno Sternritter, risvegliando un potere unico legato a essa: dalla «A» di The Almighty alla «Z» di The Zombie.",
    en: "The letter of the alphabet Yhwach engraves into a Sternritter's soul, awakening a unique power tied to it: from 'A' for The Almighty to 'Z' for The Zombie.",
  }, { japaneseName: '聖文字' }),
  ab('auswahlen', 'Auswählen', 'quincy', ['technique'], ['yhwach', 'masaki', 'katagiri', 'bazz-b'], {
    it: "La «selezione sacra» di Yhwach: strappa la vita e i poteri ai Quincy che giudica indegni per trasferirli a sé e ai prescelti. Sei anni prima della storia uccide Masaki e Kanae; a Wahrwelt colpisce gli stessi Sternritter.",
    en: "Yhwach's 'holy selection': it tears life and power from the Quincy he deems unworthy, transferring them to himself and the chosen. Six years before the story it kills Masaki and Kanae; at Wahrwelt it strikes the Sternritter themselves.",
  }, { japaneseName: '聖別' }),
  ab('medallion', 'Bankai-stealing medallion', 'quincy', ['technique'], ['yhwach', 'as-nodt', 'bambietta', 'bg9', 'cang-du', 'driscoll'], {
    it: "Il medaglione a forma di stella che gli Sternritter usano per sigillare e rubare i Bankai dei capitani nella prima invasione. Non funziona sui Bankai di chi ha un Hollow dentro, come Ichigo.",
    en: "The star-shaped medallion the Sternritter use to seal and steal the captains' Bankai in the first invasion. It does not work on the Bankai of those with a Hollow inside, like Ichigo.",
  }, { localizedName: { it: 'Medaglione ruba-Bankai', en: 'Bankai-stealing medallion' } }),
  ab('almighty', 'The Almighty', 'quincy', SCHRIFT, ['yhwach'], {
    it: "Lo Schrift «A» di Yhwach: vedere ogni futuro possibile e, dopo aver assorbito il Re delle Anime, riscriverlo. È il potere che rende Yhwach quasi invincibile fino alla freccia d'argento di Uryū.",
    en: "Yhwach's Schrift 'A': seeing every possible future and, after absorbing the Soul King, rewriting it. It is the power that makes Yhwach nearly invincible until Uryū's silver arrow.",
  }),
  ab('balance', 'The Balance', 'quincy', SCHRIFT, ['haschwalth'], {
    it: "Lo Schrift «B» di Haschwalth: redistribuisce fortuna e sfortuna, deviando sull'avversario le ferite che riceve. Mentre Yhwach dorme, Haschwalth ne custodisce anche i poteri.",
    en: "Haschwalth's Schrift 'B': it redistributes fortune and misfortune, diverting onto his opponent the wounds he receives. While Yhwach sleeps, Haschwalth also holds his powers.",
  }),
  ab('antithesis', 'The Antithesis', 'quincy', SCHRIFT, ['uryu'], {
    it: "Lo Schrift «A» donato a Uryū come successore di Yhwach: inverte ciò che è accaduto fra due punti, scambiando le ferite fra sé e l'avversario.",
    en: "The Schrift 'A' bestowed on Uryū as Yhwach's successor: it reverses what happened between two points, swapping wounds between himself and his opponent.",
  }),
  ab('explode', 'The Explode', 'quincy', SCHRIFT, ['bambietta'], {
    it: "Lo Schrift «E» di Bambietta: qualunque cosa venga colpita dalla sua energia esplode. Con questo potere e il medaglione mette in difficoltà Komamura.",
    en: "Bambietta's Schrift 'E': anything struck by her energy explodes. With this power and the medallion she puts Komamura in trouble.",
  }),
  ab('deathdealing', 'The Deathdealing', 'quincy', SCHRIFT, ['askin'], {
    it: "Lo Schrift «D» di Askin: conosce e manipola la dose letale di ogni sostanza, rendendosi immune a ciò che lo ha già ferito una volta.",
    en: "Askin's Schrift 'D': he knows and manipulates the lethal dose of any substance, making himself immune to whatever has already hurt him once.",
  }),
  ab('heat', 'The Heat', 'quincy', SCHRIFT, ['bazz-b'], {
    it: "Lo Schrift «H» di Bazz-B: fiamme di intensità crescente controllate con il numero di dita sollevate. Le usa contro Haschwalth nella sua ultima ribellione.",
    en: "Bazz-B's Schrift 'H': flames of rising intensity controlled by the number of raised fingers. He uses them against Haschwalth in his final rebellion.",
  }),
  ab('x-axis', 'The X-Axis', 'quincy', SCHRIFT, ['lille-barro'], {
    it: "Lo Schrift «X» di Lille Barro: il suo fucile trafigge qualunque cosa si trovi sulla linea di tiro, senza eccezioni. Con la Vollständig Jilliel diventa una figura angelica.",
    en: "Lille Barro's Schrift 'X': his rifle pierces anything on its line of fire, without exception. With his Vollständig Jilliel he becomes an angelic figure.",
  }),
  ab('miracle', 'The Miracle', 'quincy', SCHRIFT, ['gerard'], {
    it: "Lo Schrift «M» di Gerard Valkyrie: le ferite ricevute si trasformano in forza, facendolo crescere fino a dimensioni colossali.",
    en: "Gerard Valkyrie's Schrift 'M': the wounds he receives turn into strength, making him grow to colossal size.",
  }),
  ab('compulsory', 'The Compulsory', 'quincy', SCHRIFT, ['pernida'], {
    it: "Lo Schrift «C» di Pernida: nervi che si insinuano nel corpo del nemico e lo piegano a forza. Mayuri lo studia mentre lo combatte.",
    en: "Pernida's Schrift 'C': nerves that burrow into the enemy's body and bend it by force. Mayuri studies it while fighting it.",
  }),
  ab('fear', 'The Fear', 'quincy', SCHRIFT, ['as-nodt'], {
    it: "Lo Schrift «F» di Äs Nödt: spine che iniettano paura pura nel corpo del nemico. Non basta contro il Bankai di Rukia, che congela perfino la paura.",
    en: "Äs Nödt's Schrift 'F': thorns that inject pure fear into the enemy's body. It is not enough against Rukia's Bankai, which freezes even fear.",
  }),
  ab('jail', 'The Jail', 'quincy', SCHRIFT, ['quilge'], {
    it: "Lo Schrift «J» di Quilge Opie: una prigione di reishi che si può spezzare solo dall'interno. Trattiene Ichigo a Hueco Mundo mentre Yamamoto muore.",
    en: "Quilge Opie's Schrift 'J': a prison of reishi that can only be broken from the inside. It holds Ichigo in Hueco Mundo while Yamamoto dies.",
  }),
  ab('superstar', 'The Superstar', 'quincy', SCHRIFT, ['mask'], {
    it: "Lo Schrift «S» di Mask De Masculine: diventa più forte quanto più il suo assistente lo acclama, come un eroe del wrestling.",
    en: "Mask De Masculine's Schrift 'S': he grows stronger the more his assistant cheers him on, like a wrestling hero.",
  }),
  ab('iron', 'The Iron', 'quincy', SCHRIFT, ['cang-du'], {
    it: "Lo Schrift «I» di Cang Du: rende la sua pelle dura come l'acciaio. È lui a rubare il Bankai di Hitsugaya.",
    en: "Cang Du's Schrift 'I': it makes his skin as hard as steel. He is the one who steals Hitsugaya's Bankai.",
  }),
  ab('overkill', 'The Overkill', 'quincy', SCHRIFT, ['driscoll'], {
    it: "Lo Schrift «O» di Driscoll Berci: più nemici uccide, più diventa forte. Non basta a salvarlo dalla furia di Yamamoto.",
    en: "Driscoll Berci's Schrift 'O': the more enemies he kills, the stronger he becomes. It is not enough to save him from Yamamoto's fury.",
  }),
  ab('yourself', 'The Yourself', 'quincy', SCHRIFT, ['royd'], {
    it: "Lo Schrift «Y» dei gemelli Lloyd: copiano l'aspetto, i ricordi e parte dei poteri di chiunque. Royd impersona Yhwach per ingannare Yamamoto.",
    en: "The Lloyd twins' Schrift 'Y': they copy the appearance, memories and part of the powers of anyone. Royd impersonates Yhwach to deceive Yamamoto.",
  }),
  ab('visionary', 'The Visionary', 'quincy', SCHRIFT, ['gremmy'], {
    it: "Lo Schrift «V» di Gremmy: tutto ciò che immagina diventa reale. Il limite è la sua stessa immaginazione, ed è lì che Kenpachi lo batte.",
    en: "Gremmy's Schrift 'V': anything he imagines becomes real. The limit is his own imagination, and that is where Kenpachi beats him.",
  }),
  ab('thunderbolt', 'The Thunderbolt', 'quincy', SCHRIFT, ['candice'], {
    it: "Lo Schrift «T» di Candice Catnipp: fulmini scagliati a volontà e, con la Vollständig, una forma alata di pura elettricità.",
    en: "Candice Catnipp's Schrift 'T': lightning hurled at will and, with her Vollständig, a winged form of pure electricity.",
  }),
  ab('glutton', 'The Glutton', 'quincy', SCHRIFT, ['liltotto'], {
    it: "Lo Schrift «G» di Liltotto: la sua bocca si spalanca fino a divorare qualsiasi cosa, compresi gli avversari.",
    en: "Liltotto's Schrift 'G': her mouth opens wide enough to devour anything, opponents included.",
  }),
  ab('zombie', 'The Zombie', 'quincy', SCHRIFT, ['giselle'], {
    it: "Lo Schrift «Z» di Giselle: chi viene contaminato dal suo sangue diventa uno zombie obbediente, capitani compresi.",
    en: "Giselle's Schrift 'Z': anyone contaminated by her blood becomes an obedient zombie, captains included.",
  }),
  ab('power', 'The Power', 'quincy', SCHRIFT, ['meninas'], {
    it: "Lo Schrift «P» di Meninas McAllon: una forza fisica smisurata in un corpo minuto.",
    en: "Meninas McAllon's Schrift 'P': immense physical strength in a petite body.",
  }),

  /* ======================= POTERI UMANI E FULLBRING ======================= */
  ab('shun-shun-rikka', 'Shun Shun Rikka', 'spiritual', ['technique'], ['orihime'], {
    it: "I sei spiriti delle forcine di Orihime: Santen Kesshun (scudo), Sōten Kisshun (che «rifiuta» le ferite riportando le cose a com'erano) e Koten Zanshun (attacco). Un potere che, secondo Aizen, invade il dominio degli dèi.",
    en: "The six spirits of Orihime's hairpins: Santen Kesshun (shield), Sōten Kisshun (which 'rejects' wounds, returning things to how they were) and Koten Zanshun (attack). A power that, according to Aizen, trespasses on the domain of the gods.",
  }, { japaneseName: '盾舜六花' }),
  ab('brazo', 'Brazo Derecha de Gigante / Brazo Izquierda del Diablo', 'fullbring', ['technique'], ['chad'], {
    it: "Il potere di Chad: il braccio destro del gigante per difendere, il braccio sinistro del diavolo per attaccare (con il colpo «La Muerte»). Solo più tardi si scopre che è un Fullbring.",
    en: "Chad's power: the giant's right arm to defend, the devil's left arm to attack (with the 'La Muerte' strike). Only later is it revealed to be a Fullbring.",
  }, { localizedName: { it: 'Brazo Derecha de Gigante / Brazo Izquierda del Diablo', en: 'Brazo Derecha de Gigante / Brazo Izquierda del Diablo' } }),
  ab('ichigo-fullbring', "Ichigo's Fullbring", 'fullbring', ['technique'], ['ichigo', 'ginjo'], {
    it: "Attivato attraverso il distintivo di Sostituto Shinigami con l'aiuto dell'Xcution: un'armatura di energia che ricorda il Bankai. Ginjō glielo ruba; Ichigo lo riassorbe tornando Shinigami.",
    en: "Awakened through the Substitute Soul Reaper badge with Xcution's help: an armour of energy reminiscent of Bankai. Ginjō steals it; Ichigo absorbs it back when he becomes a Soul Reaper again.",
  }),
  ab('cross-of-scaffold', 'Cross of Scaffold', 'fullbring', ['technique'], ['ginjo'], {
    it: "Il Fullbring di Kūgo Ginjō: il ciondolo a croce diventa uno spadone che assorbe ed emette energia, e con cui ruba il Fullbring di Ichigo.",
    en: "Kūgo Ginjō's Fullbring: the cross pendant becomes a greatsword that absorbs and releases energy, with which he steals Ichigo's Fullbring.",
  }),
  ab('book-of-the-end', 'Book of the End', 'fullbring', ['technique'], ['tsukishima'], {
    it: "Il segnalibro di Tsukishima che diventa una spada: chi ne viene tagliato ha Tsukishima inserito nel proprio passato, come un amico o un nemico di sempre.",
    en: "Tsukishima's bookmark that becomes a sword: whoever it cuts has Tsukishima inserted into their past, as a lifelong friend or enemy.",
  }),
  ab('dollhouse', 'Dollhouse', 'fullbring', ['technique'], ['riruka'], {
    it: "Il Fullbring di Riruka: rinchiude ciò che «ama» dentro oggetti e case di bambola, purché il bersaglio accetti di entrare.",
    en: "Riruka's Fullbring: it traps whatever she 'loves' inside objects and dollhouses, provided the target agrees to enter.",
  }),
  ab('invaders-must-die', 'Invaders Must Die', 'fullbring', ['technique'], ['yukio'], {
    it: "Il Fullbring di Yukio: la sua console crea mondi virtuali in cui intrappolare gli avversari e dei quali decide le regole.",
    en: "Yukio's Fullbring: his console creates virtual worlds in which he traps opponents and whose rules he decides.",
  }),
  ab('time-tells-no-lies', 'Time Tells No Lie', 'fullbring', ['technique'], ['giriko'], {
    it: "Il Fullbring di Giriko: il suo orologio stringe contratti a tempo; chi non li rispetta subisce la punizione stabilita.",
    en: "Giriko's Fullbring: his watch binds timed contracts; whoever breaks them suffers the agreed punishment.",
  }),
  ab('dirty-boots', 'Dirty Boots', 'fullbring', ['technique'], ['jackie'], {
    it: "Il Fullbring di Jackie Tristan: i suoi stivali la rendono tanto più forte quanto più sono sporchi.",
    en: "Jackie Tristan's Fullbring: her boots make her stronger the dirtier they get.",
  }),

  /* ============================== ARTEFATTI ============================== */
  ab('hogyoku', 'Hōgyoku', 'artifact', [], ['urahara', 'aizen', 'rukia', 'ichigo'], {
    it: "La sfera creata da Urahara (e, indipendentemente, da Aizen) che dissolve il confine fra Shinigami e Hollow e realizza i desideri di chi la circonda. Nascosta nell'anima di Rukia, è il pezzo mancante del piano di Aizen.",
    en: "The orb created by Urahara (and, independently, by Aizen) that dissolves the boundary between Soul Reaper and Hollow and grants the wishes of those around it. Hidden in Rukia's soul, it is the missing piece of Aizen's plan.",
  }, {
    japaneseName: '崩玉',
    longDescription: {
      it: "Fuso nel petto di Aizen, lo fa evolvere oltre ogni limite; ma quando Ichigo lo supera con il Mugetsu, lo Hōgyoku «decide» di abbandonarlo, permettendo al sigillo di Urahara di attivarsi.",
      en: "Fused into Aizen's chest, it makes him evolve beyond every limit; but when Ichigo surpasses him with the Mugetsu, the Hōgyoku 'decides' to abandon him, allowing Urahara's seal to activate.",
    },
  }),
];
