import type { Localizable } from '@/types';

/**
 * Testi aggiuntivi (`longDescription`) per personaggi e tecniche che nel primo
 * inventario avevano solo una riga: l'index li applica quando l'entità non ha
 * già un `longDescription`. Tutto IT/EN, solo fatti del canone.
 */
export const NARUTO_CHARACTER_LONG: Record<string, Localizable> = {
  'char-tenten': {
    it: "Specialista di armi del Team Guy, con Neji e Rock Lee. Combatte evocando da pergamene decine di armi ninja e, nella Quarta Guerra, maneggia alcuni degli strumenti del Saggio dei Sei Cammini. Nell'era Boruto gestisce un negozio di armi a Konoha.",
    en: "The Team Guy weapons specialist, alongside Neji and Rock Lee. She fights by summoning dozens of ninja weapons from scrolls and, in the Fourth War, wields some of the Sage of Six Paths' tools. In the Boruto era she runs a weapons shop in Konoha.",
  },
  'char-iruka': {
    it: "Il maestro dell'Accademia che per primo riconosce Naruto: anche lui orfano dell'attacco della Volpe, lo difende da Mizuki quando il ragazzo ruba la Pergamena dei Sigilli. È lui a legare il suo coprifronte a Naruto, e anni dopo lo accompagna al matrimonio al posto del padre.",
    en: "The Academy teacher who first acknowledges Naruto: himself orphaned by the Fox's attack, he defends him from Mizuki when the boy steals the Scroll of Seals. He gives Naruto his own forehead protector, and years later stands in for his father at Naruto's wedding.",
  },
  'char-kurenai': {
    it: "La jōnin del Team 8 (Hinata, Kiba, Shino), esperta di genjutsu. È la compagna di Asuma Sarutobi: dopo la morte di lui per mano di Hidan dà alla luce la figlia Mirai, che Shikamaru promette di proteggere.",
    en: "Team 8's jōnin (Hinata, Kiba, Shino), a genjutsu expert. She is Asuma Sarutobi's partner: after his death at Hidan's hands she gives birth to their daughter Mirai, whom Shikamaru promises to protect.",
  },
  'char-anko': {
    it: "Ex allieva di Orochimaru, che le ha lasciato un Sigillo Maledetto, e proctor della seconda prova degli Esami Chūnin nella Foresta della Morte. In Shippuden dà la caccia a Kabuto; nell'era Boruto insegna all'Accademia.",
    en: "A former student of Orochimaru, who left her a Curse Mark, and proctor of the Chūnin Exams' second stage in the Forest of Death. In Shippuden she hunts Kabuto; in the Boruto era she teaches at the Academy.",
  },
  'char-shizune': {
    it: "L'assistente e allieva di Tsunade, nipote di Dan Katō, esperta di ninjutsu medico e veleni. Segue Tsunade negli anni di vagabondaggio e poi a Konoha come braccio destro del Quinto Hokage; Pain la uccide durante l'assalto, Nagato la riporta in vita.",
    en: "Tsunade's assistant and student, Dan Katō's niece, an expert in medical ninjutsu and poisons. She follows Tsunade through her wandering years and then to Konoha as the Fifth Hokage's right hand; Pain kills her during the assault, Nagato brings her back.",
  },
  'char-kankuro': {
    it: "Il fratello di Gaara e Temari, marionettista di Suna. Sfida Sasori per salvare Gaara e viene avvelenato; più tardi usa proprio la marionetta di Sasori, e nella Quarta Guerra imprigiona il Sasori riportato in vita con l'Edo Tensei.",
    en: "Gaara and Temari's brother, a Suna puppeteer. He challenges Sasori to save Gaara and is poisoned; later he uses Sasori's own puppet body, and in the Fourth War he traps the Sasori reanimated through Edo Tensei.",
  },
  'char-rasa': {
    it: "Il Quarto Kazekage, padre di Gaara, Temari e Kankurō, padrone della Sabbia d'Oro. Fa sigillare Shukaku nel figlio ancora non nato; viene ucciso da Orochimaru, che ne prende il posto per invadere Konoha. Nella Quarta Guerra si riconcilia con Gaara.",
    en: "The Fourth Kazekage, father of Gaara, Temari and Kankurō, master of Gold Dust. He has Shukaku sealed in his unborn son; Orochimaru kills him and takes his place to invade Konoha. In the Fourth War he reconciles with Gaara.",
  },
  'char-haku': {
    it: "Il compagno di Zabuza, ultimo del suo clan con l'arte dell'Hyōton: specchi di ghiaccio da cui colpisce con gli aghi. Considera la propria vita uno strumento al servizio di Zabuza e muore facendogli da scudo contro il Raikiri di Kakashi.",
    en: "Zabuza's companion, the last of his clan with the Ice Release: ice mirrors from which he strikes with needles. He sees his own life as a tool in Zabuza's service and dies shielding him from Kakashi's Lightning Blade.",
  },
  'char-chojuro': {
    it: "Uno dei Sette Spadaccini della Nebbia, portatore della spada Hiramekarei, guardia del corpo della Mizukage Mei al Summit. Timido ma affidabile, diventa il Sesto Mizukage nell'era Boruto.",
    en: "One of the Seven Swordsmen of the Mist, wielder of the Hiramekarei blade and bodyguard to Mizukage Mei at the Summit. Shy but dependable, he becomes the Sixth Mizukage in the Boruto era.",
  },
  'char-kurotsuchi': {
    it: "La nipote di Ōnoki, kunoichi di Iwa capace di usare lo Yōton (Arte della Calce). Accompagna il nonno al Summit dei Kage e combatte nella Quarta Guerra; nell'era Boruto è la Quarta Tsuchikage.",
    en: "Ōnoki's granddaughter, an Iwa kunoichi able to use Lava Release (quicklime). She accompanies her grandfather to the Kage Summit and fights in the Fourth War; in the Boruto era she is the Fourth Tsuchikage.",
  },
  'char-yugito': {
    it: "La jinchūriki del Due Code Matatabi, kunoichi di Kumo. Hidan e Kakuzu la catturano per l'Akatsuki, che estrae il cercoterio uccidendola; nella Quarta Guerra Kabuto la riporta in vita fra i jinchūriki di Obito.",
    en: "The Two-Tails Matatabi's jinchūriki, a Kumo kunoichi. Hidan and Kakuzu capture her for the Akatsuki, which extracts the beast and kills her; in the Fourth War she is reanimated among Obito's jinchūriki.",
  },
  'char-roshi': {
    it: "Il jinchūriki del Quattro Code Son Gokū, ninja di Iwa capace di usare lo Yōton. Catturato da Kisame, muore all'estrazione del cercoterio; Obito lo rianima nella Quarta Guerra come uno dei Sei Cammini.",
    en: "The Four-Tails Son Gokū's jinchūriki, an Iwa ninja able to use Lava Release. Captured by Kisame, he dies when the beast is extracted; Obito reanimates him in the Fourth War as one of his Six Paths.",
  },
  'char-han': {
    it: "Il jinchūriki del Cinque Code Kokuō, ninja di Iwa in armatura capace di usare il Futton. Catturato dall'Akatsuki e ucciso dall'estrazione, torna nella Quarta Guerra come Cammino di Obito.",
    en: "The Five-Tails Kokuō's jinchūriki, an armoured Iwa ninja able to use Boil Release. Captured by the Akatsuki and killed by the extraction, he returns in the Fourth War as one of Obito's Paths.",
  },
  'char-utakata': {
    it: "Il jinchūriki del Sei Code Saiken, ninja disertore della Nebbia che combatte con bolle di sapone. Viene catturato da Pain; nella Quarta Guerra è rianimato fra i jinchūriki di Obito.",
    en: "The Six-Tails Saiken's jinchūriki, a Mist deserter who fights with soap bubbles. Pain captures him; in the Fourth War he is reanimated among Obito's jinchūriki.",
  },
  'char-fu': {
    it: "La jinchūriki del Sette Code Chōmei, kunoichi di Takigakure allegra e solitaria. Kakuzu la cattura per l'Akatsuki; nella Quarta Guerra torna fra i jinchūriki rianimati da Obito.",
    en: "The Seven-Tails Chōmei's jinchūriki, a cheerful, lonely Takigakure kunoichi. Kakuzu captures her for the Akatsuki; in the Fourth War she returns among the jinchūriki reanimated by Obito.",
  },
  'char-mikoto': {
    it: "La madre di Itachi e Sasuke, moglie di Fugaku. Nella notte del massacro accetta il destino insieme al marito, chiedendo solo a Itachi di risparmiare il fratello: Itachi la uccide piangendo.",
    en: "Itachi and Sasuke's mother, Fugaku's wife. On the night of the massacre she accepts her fate alongside her husband, asking Itachi only to spare his brother: Itachi kills her in tears.",
  },
  'char-hamura': {
    it: "Il fratello minore di Hagoromo, figlio di Kaguya, con il Byakugan. Dopo aver sigillato la madre con il fratello si trasferisce sulla luna per custodirne il corpo: dalla sua stirpe discendono gli Hyūga e gli Ōtsutsuki lunari come Toneri.",
    en: "Hagoromo's younger brother, Kaguya's son, with the Byakugan. After sealing their mother with his brother he moves to the moon to guard her body: the Hyūga and the lunar Ōtsutsuki such as Toneri descend from him.",
  },
  'char-indra': {
    it: "Il figlio maggiore di Hagoromo, prodigio dagli occhi dello Sharingan e capostipite degli Uchiha. Quando il padre sceglie come erede il fratello Asura, si ribella: la sua rivalità si reincarna in Madara e in Sasuke.",
    en: "Hagoromo's elder son, a prodigy with the Sharingan's eyes and the forefather of the Uchiha. When his father chooses his brother Asura as heir, he rebels: his rivalry is reincarnated in Madara and in Sasuke.",
  },
  'char-asura': {
    it: "Il figlio minore di Hagoromo, che punta sulla collaborazione e sull'amore anziché sul talento: il padre lo nomina suo erede. Capostipite dei Senju e degli Uzumaki, si reincarna in Hashirama e in Naruto.",
    en: "Hagoromo's younger son, who relies on cooperation and love rather than talent: his father names him heir. The forefather of the Senju and the Uzumaki, he is reincarnated in Hashirama and in Naruto.",
  },
  'char-matatabi': {
    it: "Il Due Code, un gatto fatto di fiamme blu, sigillato in Yugito Nii di Kumo. Estratto dall'Akatsuki e imprigionato nel Gedo Mazo, viene liberato da Naruto nella Quarta Guerra insieme agli altri cercoteri.",
    en: "The Two-Tails, a cat made of blue flames, sealed in Kumo's Yugito Nii. Extracted by the Akatsuki and imprisoned in the Gedo Statue, it is freed by Naruto in the Fourth War along with the other Tailed Beasts.",
  },
  'char-izuna': {
    it: "Il fratello minore di Madara, con cui condivide lo Sharingan. Ferito a morte da Tobirama, lascia i propri occhi a Madara, che con essi ottiene il Mangekyō Eterno.",
    en: "Madara's younger brother, who shares his Sharingan. Mortally wounded by Tobirama, he leaves his eyes to Madara, who uses them to obtain the Eternal Mangekyō.",
  },
  'char-ebisu': {
    it: "Il tutore d'élite di Konohamaru, rigido e un po' vanitoso. Per qualche giorno allena anche Naruto al controllo del chakra prima che Jiraiya lo sostituisca; nell'era Boruto è ancora un jōnin di Konoha.",
    en: "Konohamaru's elite tutor, strict and a little vain. For a few days he also trains Naruto in chakra control before Jiraiya replaces him; in the Boruto era he is still a Konoha jōnin.",
  },
  'char-ibiki': {
    it: "Il capo della Squadra Torture e Interrogatori di Konoha, segnato da cicatrici in volto. È il proctor della prova scritta degli Esami Chūnin, che usa per mettere alla prova i nervi dei candidati più che le loro conoscenze.",
    en: "Head of Konoha's Torture and Interrogation Force, his face marked with scars. He proctors the written test of the Chūnin Exams, which he uses to test the candidates' nerves rather than their knowledge.",
  },
  'char-choza': {
    it: "Il padre di Chōji e capoclan degli Akimichi, compagno di Shikaku e Inoichi nel trio Ino-Shika-Chō. Combatte contro Pain durante l'assalto a Konoha e nella Quarta Guerra.",
    en: "Chōji's father and head of the Akimichi clan, Shikaku and Inoichi's partner in the Ino-Shika-Chō trio. He fights against Pain during the assault on Konoha and in the Fourth War.",
  },
  'char-hizashi': {
    it: "Il gemello minore di Hiashi e padre di Neji, del ramo cadetto degli Hyūga. Durante l'incidente con Kumo si sacrifica al posto del fratello; Neji scoprirà dalla sua lettera che fu una scelta libera.",
    en: "Hiashi's younger twin and Neji's father, of the Hyūga branch family. During the incident with Kumo he sacrifices himself in his brother's place; Neji will learn from his letter that it was a free choice.",
  },
  'char-yagura': {
    it: "Il Quarto Mizukage, jinchūriki del Tre Code. Sotto il suo governo Kiri diventa il «Villaggio della Nebbia Insanguinata»; in realtà era manipolato da Obito con lo Sharingan.",
    en: "The Fourth Mizukage, the Three-Tails' jinchūriki. Under his rule Kiri becomes the 'Village of the Bloody Mist'; in truth he was being manipulated by Obito with the Sharingan.",
  },
  'char-baki': {
    it: "Il jōnin di Suna che guida Gaara, Temari e Kankurō agli Esami Chūnin e coordina con Orochimaru l'invasione di Konoha. In seguito è uno dei consiglieri del Kazekage Gaara.",
    en: "The Suna jōnin who leads Gaara, Temari and Kankurō at the Chūnin Exams and coordinates the invasion of Konoha with Orochimaru. Later he is one of Kazekage Gaara's advisers.",
  },
  'char-yashamaru': {
    it: "Lo zio di Gaara, fratello della madre Karura, che lo accudisce da bambino. Su ordine del Kazekage tenta di ucciderlo e gli rivela di averlo sempre odiato: è il trauma che chiude Gaara in sé stesso.",
    en: "Gaara's uncle, brother of his mother Karura, who looks after him as a child. On the Kazekage's orders he tries to kill him and tells him he always hated him: the trauma that closes Gaara off.",
  },
  'char-ao': {
    it: "Il ninja sensore della Nebbia con il Byakugan rubato a uno Hyūga, guardia del corpo della Mizukage. Ricompare nell'era Boruto, trasformato in cyborg, al servizio di Kara.",
    en: "The Mist sensor ninja with a Byakugan stolen from a Hyūga, the Mizukage's bodyguard. He reappears in the Boruto era, turned into a cyborg, serving Kara.",
  },
  'char-mangetsu': {
    it: "Il fratello maggiore di Suigetsu, prodigio dei Sette Spadaccini della Nebbia capace di usare tutte le loro spade. Riportato in vita da Kabuto nella Quarta Guerra, viene sigillato dall'Alleanza.",
    en: "Suigetsu's elder brother, a prodigy of the Seven Swordsmen of the Mist able to wield all their blades. Reanimated by Kabuto in the Fourth War, he is sealed by the Alliance.",
  },
  'char-mu': {
    it: "Il Secondo Tsuchikage, maestro di Ōnoki, capace di rendersi invisibile e di usare l'Arte della Polvere. Riportato in vita nella Quarta Guerra, si divide in due per sfuggire a Gaara.",
    en: "The Second Tsuchikage, Ōnoki's master, able to turn invisible and use Dust Release. Reanimated in the Fourth War, he splits in two to escape Gaara.",
  },
  'char-c': {
    it: "Ninja sensore di Kumo, guardia del corpo del Raikage A insieme a Darui al Summit dei Kage nel Paese del Ferro. Nella Quarta Guerra usa il genjutsu di luce per fermare Naruto e Killer B.",
    en: "A Kumo sensor ninja and bodyguard to Raikage A, alongside Darui, at the Kage Summit in the Land of Iron. In the Fourth War he uses a light genjutsu to stop Naruto and Killer B.",
  },
  'char-akatsuchi': {
    it: "La robusta guardia del corpo dello Tsuchikage Ōnoki, sempre sorridente. Accompagna Ōnoki e Kurotsuchi al Summit dei Kage e combatte nella Quarta Guerra con i suoi golem di roccia; nell'era Boruto resta al fianco di Kurotsuchi.",
    en: "Tsuchikage Ōnoki's burly, ever-smiling bodyguard. He accompanies Ōnoki and Kurotsuchi to the Kage Summit and fights in the Fourth War with his rock golems; in the Boruto era he stays at Kurotsuchi's side.",
  },
  'char-ebizo': {
    it: "Il fratello minore di Chiyo, anziano consigliere di Suna. Accoglie il Team Kakashi a Suna insieme alla sorella, che parte con loro per salvare Gaara e affrontare il nipote Sasori.",
    en: "Chiyo's younger brother, an elder adviser of Suna. He welcomes Team Kakashi to Suna with his sister, who sets off with them to rescue Gaara and face her grandson Sasori.",
  },
  'char-chocho': {
    it: "La figlia di Chōji e Karui, membro del nuovo trio Ino-Shika-Chō con Shikadai e Inojin. Ironica e golosa come il padre, ne eredita le tecniche di espansione del corpo degli Akimichi.",
    en: "Chōji and Karui's daughter, part of the new Ino-Shika-Chō trio with Shikadai and Inojin. Witty and food-loving like her father, she inherits the Akimichi body-expansion techniques.",
  },
  'char-katasuke': {
    it: "Lo scienziato capo del reparto di ricerca degli Strumenti Ninja Scientifici di Konoha. È lui a fornire di nascosto a Boruto il guanto Kote con cui viene squalificato agli Esami Chūnin.",
    en: "Head scientist of Konoha's Scientific Ninja Tools research team. He is the one who secretly gives Boruto the Kote gauntlet that gets him disqualified at the Chūnin Exams.",
  },
  'char-shion': {
    it: "La sacerdotessa del Paese dei Demoni, capace di predire la morte altrui. Nel primo film di Shippuden Naruto la protegge e ribalta la sua profezia, aiutandola a sigillare il demone Mōryō.",
    en: "The priestess of the Land of Demons, able to foresee others' deaths. In the first Shippuden film Naruto protects her and overturns her prophecy, helping her seal the demon Mōryō.",
  },
  'char-teuchi': {
    it: "Il proprietario dell'Ichiraku Ramen, che tratta Naruto con gentilezza quando quasi tutto il villaggio lo evita. Il suo locale è il luogo dei festeggiamenti di Naruto e, anni dopo, di Boruto e dei suoi amici.",
    en: "The owner of Ichiraku Ramen, who treats Naruto kindly when almost the whole village shuns him. His shop is where Naruto celebrates and, years later, Boruto and his friends too.",
  },
  'char-ayame': {
    it: "La figlia di Teuchi, che lavora con lui all'Ichiraku. Accoglie Naruto con lo stesso affetto del padre fin da quando è un bambino solo, e gli regala spesso una porzione in più.",
    en: "Teuchi's daughter, who works with him at Ichiraku. She welcomes Naruto with her father's same warmth since he was a lonely child, and often gives him an extra serving.",
  },
  'char-pakkun': {
    it: "Il carlino ninja di Kakashi, capo dei suoi otto cani evocati: un fiuto infallibile e un carattere da vecchio saggio. Ritrova Sasuke e Gaara nelle missioni più disperate e salva più volte il Team 7.",
    en: "Kakashi's ninja pug, leader of his eight summoned dogs: an infallible nose and the temperament of an old sage. He tracks down Sasuke and Gaara in the most desperate missions and saves Team 7 several times.",
  },
  'char-kotetsu': {
    it: "Il chūnin di Konoha che fa coppia fissa con Izumo: guardiani della porta principale, assistenti di Tsunade e membri della squadra di Asuma contro Hidan e Kakuzu.",
    en: "The Konoha chūnin always paired with Izumo: guards of the main gate, Tsunade's assistants and members of Asuma's squad against Hidan and Kakuzu.",
  },
  'char-izumo': {
    it: "Il compagno inseparabile di Kotetsu, chūnin di Konoha. Insieme sorvegliano la porta principale, aiutano negli Esami Chūnin e partecipano alla missione contro Hidan e Kakuzu in cui muore Asuma.",
    en: "Kotetsu's inseparable partner, a Konoha chūnin. Together they guard the main gate, help at the Chūnin Exams and take part in the mission against Hidan and Kakuzu in which Asuma dies.",
  },
  'char-metal-lee': {
    it: "Il figlio di Rock Lee, compagno di squadra di Iwabe e Denki. Ha il talento del padre per il taijutsu ma soffre d'ansia nei momenti decisivi: quando riesce a superarla dimostra un potenziale enorme.",
    en: "Rock Lee's son, teammate of Iwabe and Denki. He has his father's taijutsu talent but struggles with nerves at decisive moments: when he overcomes them he shows enormous potential.",
  },
  'char-iwabe': {
    it: "Il compagno di classe di Boruto, ripetente all'Accademia, prima bullo e poi amico. Diventato genin, entra nella squadra con Metal Lee e Denki.",
    en: "Boruto's classmate, held back at the Academy, first a bully and then a friend. Once a genin, he joins the team with Metal Lee and Denki.",
  },
  'char-udon': {
    it: "Il compagno di Konohamaru e Moegi, bambino timido col naso sempre che cola. Diventa genin con loro e, nell'era Boruto, è un ninja adulto di Konoha al fianco degli ex compagni, mentre Konohamaru diventa maestro.",
    en: "Konohamaru and Moegi's companion, a shy boy with an ever-runny nose. He becomes a genin with them and, in the Boruto era, is an adult Konoha ninja alongside his old teammates, while Konohamaru becomes a teacher.",
  },
  'char-tajima': {
    it: "Il padre di Madara e Izuna, capo del clan Uchiha nell'epoca degli Stati Combattenti. Rivale di Butsuma Senju, cresce i figli nella guerra fra i due clan che precede la fondazione di Konoha.",
    en: "Madara and Izuna's father, head of the Uchiha clan in the Warring States era. A rival of Butsuma Senju, he raises his sons in the war between the two clans that precedes Konoha's founding.",
  },
};

export const NARUTO_JUTSU_LONG: Record<string, Localizable> = {
  'jutsu-rasenshuriken': {
    it: "Naruto lo completa con Yamato e Kakashi dopo la morte di Asuma, unendo il Futon al Rasengan con i cloni: il colpo ferisce le cellule a livello microscopico, e all'inizio danneggia anche il braccio di chi lo usa. Con il Sennin Mode impara a lanciarlo.",
    en: "Naruto completes it with Yamato and Kakashi after Asuma's death, adding Wind Release to the Rasengan with his clones: it damages cells at a microscopic level and at first harms the user's arm too. With Sage Mode he learns to throw it.",
  },
  'jutsu-sharingan': {
    it: "L'abilità oculare del clan Uchiha, che nasce da forti emozioni: legge e copia i movimenti, prevede gli attacchi e lancia genjutsu. Evolve nel Mangekyō dopo un trauma, e in quello Eterno con il trapianto degli occhi di un fratello.",
    en: "The Uchiha clan's ocular ability, born from strong emotions: it reads and copies movements, predicts attacks and casts genjutsu. It evolves into the Mangekyō after trauma, and into the Eternal one with a sibling's eyes.",
  },
  'jutsu-rinne-sharingan': {
    it: "L'occhio di Kaguya e del jinchūriki delle Dieci Code: Madara lo apre sulla fronte per proiettare lo Tsukuyomi Infinito sulla luna.",
    en: "The eye of Kaguya and of the Ten-Tails jinchūriki: Madara opens it on his forehead to cast the Infinite Tsukuyomi onto the moon.",
  },
  'jutsu-preta-path': {
    it: "Il Cammino del Preta di Pain assorbe qualsiasi ninjutsu basato sul chakra, persino il Rasengan; Naruto lo sconfigge in Sennin Mode, perché l'energia naturale non può essere assorbita senza conseguenze.",
    en: "Pain's Preta Path absorbs any chakra-based ninjutsu, even the Rasengan; Naruto beats it in Sage Mode, because natural energy cannot be absorbed without consequences.",
  },
  'jutsu-asura-path': {
    it: "Il Cammino di Asura trasforma il corpo di Pain in un arsenale meccanico di missili, lame e braccia aggiuntive: è il cammino più distruttivo durante l'assalto a Konoha.",
    en: "The Asura Path turns Pain's body into a mechanical arsenal of missiles, blades and extra arms: it is the most destructive path during the assault on Konoha.",
  },
  'jutsu-human-path': {
    it: "Il Cammino dell'Umano legge la mente di una persona toccandole la testa e ne strappa l'anima, uccidendola: Pain lo usa per interrogare i ninja di Konoha durante l'assalto.",
    en: "The Human Path reads a person's mind by touching their head and pulls out their soul, killing them: Pain uses it to interrogate Konoha ninja during the assault.",
  },
  'jutsu-animal-path': {
    it: "Il Cammino dell'Animale evoca creature giganti dotate del Rinnegan e gli altri corpi di Pain: è il cammino che apre l'attacco a Konoha.",
    en: "The Animal Path summons giant creatures bearing the Rinnegan, as well as Pain's other bodies: it is the path that opens the attack on Konoha.",
  },
  'jutsu-naraka-path': {
    it: "Il Cammino dell'Inferno evoca il Re dell'Inferno, che giudica le vittime e ripara i corpi danneggiati degli altri Cammini, rendendo Pain quasi invulnerabile in battaglia.",
    en: "The Naraka Path summons the King of Hell, which judges victims and repairs the damaged bodies of the other Paths, making Pain almost invulnerable in battle.",
  },
  'jutsu-katon-fireball': {
    it: "La tecnica che segna il passaggio all'età adulta nel clan Uchiha: Sasuke la impara da bambino dal padre Fugaku, e la usa fin dalla prima missione del Team 7.",
    en: "The technique that marks coming of age in the Uchiha clan: Sasuke learns it as a child from his father Fugaku, and uses it from Team 7's very first mission.",
  },
  'jutsu-bunshin': {
    it: "È la tecnica che Naruto non riesce a eseguire all'Accademia per eccesso di chakra: per questo viene bocciato tre volte, finché impara il Kage Bunshin dalla Pergamena dei Sigilli.",
    en: "It is the technique Naruto cannot perform at the Academy because of his excess chakra: that is why he fails three times, until he learns the Shadow Clone from the Scroll of Seals.",
  },
  'jutsu-henge': {
    it: "Naruto la trasforma nella sua «Sexy Jutsu», con cui stordisce perfino il Terzo Hokage e Jiraiya; in battaglia la usa per travestirsi da shuriken o da avversari.",
    en: "Naruto turns it into his 'Sexy Jutsu', which stuns even the Third Hokage and Jiraiya; in battle he uses it to disguise himself as shuriken or as opponents.",
  },
  'jutsu-kawarimi': {
    it: "Uno dei tre jutsu base dell'Accademia insieme al Bunshin e all'Henge: un tronco o un oggetto prende il posto del ninja nel momento dell'impatto.",
    en: "One of the Academy's three basic jutsu along with the Clone and Transformation: a log or object takes the ninja's place at the moment of impact.",
  },
  'jutsu-katon-phoenix-sage-fire': {
    it: "Sasuke la usa fin dagli Esami Chūnin, nascondendo shuriken dentro le fiamme per colpire l'avversario mentre schiva il fuoco.",
    en: "Sasuke uses it from the Chūnin Exams on, hiding shuriken inside the flames to strike the opponent while they dodge the fire.",
  },
  'jutsu-katon-dragon-flame': {
    it: "Sasuke la combina con i fili d'acciaio con cui immobilizza l'avversario: è così che mette alle strette Orochimaru nella Foresta della Morte.",
    en: "Sasuke combines it with the steel wires he uses to bind his opponent: that is how he corners Orochimaru in the Forest of Death.",
  },
  'jutsu-katon-great-fire-annihilation': {
    it: "Madara la scatena sull'Alleanza Shinobi durante la Quarta Guerra: serve l'Arte dell'Acqua di decine di ninja per contenerla.",
    en: "Madara unleashes it on the Shinobi Alliance during the Fourth War: it takes the Water Release of dozens of ninja to contain it.",
  },
  'jutsu-suiton-wall': {
    it: "Kakashi la usa per difendersi dalle tecniche di fuoco e di vento; Tobirama, maestro del Suiton capace di crearla anche senza una fonte d'acqua, ne è l'esempio più antico.",
    en: "Kakashi uses it to defend himself from fire and wind techniques; Tobirama, a Water Release master able to create it even without a water source, is its oldest example.",
  },
  'jutsu-suiton-great-shark': {
    it: "Kisame la usa contro Killer B e nei suoi scontri con Guy: il chakra assorbito da Samehada e dalle tecniche nemiche rende lo squalo sempre più grande.",
    en: "Kisame uses it against Killer B and in his fights with Guy: the chakra absorbed by Samehada and from enemy techniques makes the shark ever larger.",
  },
  'jutsu-suiton-exploding-wave': {
    it: "Kisame crea così un mare in mezzo alla terraferma, in cui combatte con i suoi squali: è l'inizio della sua prigione d'acqua contro Killer B e Guy.",
    en: "Kisame thus creates a sea on dry land, where he fights with his sharks: it is the start of his water prison against Killer B and Guy.",
  },
  'jutsu-doton-earth-wall': {
    it: "Una delle tecniche difensive più comuni: il Terzo Hokage e i ninja di Iwa la usano per bloccare attacchi di massa durante le guerre.",
    en: "One of the most common defensive techniques: the Third Hokage and Iwa ninja use it to block mass attacks during the wars.",
  },
  'jutsu-doton-swamp': {
    it: "Jiraiya la usa per intrappolare il serpente gigante di Orochimaru a Tanzaku: è il suo modo di immobilizzare anche le evocazioni più grandi.",
    en: "Jiraiya uses it to trap Orochimaru's giant snake at Tanzaku: it is his way of pinning down even the largest summons.",
  },
  'jutsu-raiton-thunderbolt': {
    it: "È la tecnica con cui i ninja di Kumo combinano velocità e fulmine; il Quarto Raikage e Killer B la usano nelle battaglie della Quarta Guerra.",
    en: "It is how Kumo ninja combine speed and lightning; the Fourth Raikage and Killer B use it in the battles of the Fourth War.",
  },
  'jutsu-raiton-false-darkness': {
    it: "Kakuzu, con il cuore rubato a un ninja di Kumo, la usa nello scontro contro Kakashi e i suoi compagni: è una delle tecniche più potenti del Raiton.",
    en: "Kakuzu, with a heart stolen from a Kumo ninja, uses it in his fight against Kakashi and his teammates: it is one of the strongest Lightning Release techniques.",
  },
  'jutsu-futon-breakthrough': {
    it: "Una delle tecniche di vento più semplici: Temari la potenzia con il ventaglio gigante, Asuma la combina con le sue lame di chakra.",
    en: "One of the simplest wind techniques: Temari boosts it with her giant fan, Asuma combines it with his chakra blades.",
  },
  'jutsu-futon-vacuum-wave': {
    it: "Una lama d'aria lanciata con il ventaglio gigante per colpire a distanza: è la variante più concentrata delle tecniche di vento di Temari.",
    en: "An air blade thrown with the giant fan to strike from a distance: it is the most focused variant of Temari's wind techniques.",
  },
  'jutsu-mokuton-wood-clone': {
    it: "Hashirama ne crea a centinaia per combattere Madara; Yamato la usa per seguire Naruto a distanza, e Danzo e Obito la ottengono grazie alle cellule di Hashirama.",
    en: "Hashirama creates hundreds of them to fight Madara; Yamato uses it to follow Naruto from afar, and Danzo and Obito gain it through Hashirama's cells.",
  },
  'jutsu-mokuton-wood-dragon': {
    it: "Hashirama la usa per imprigionare il Nove Code durante la battaglia alla Valle della Fine; è una delle tecniche che rendono il Mokuton capace di domare i cercoteri.",
    en: "Hashirama uses it to bind the Nine-Tails during the battle at the Valley of the End; it is one of the techniques that let Wood Release tame the Tailed Beasts.",
  },
  'jutsu-mokuton-four-pillars': {
    it: "Yamato la usa per imprigionare gli avversari e, nella variante della Casa dei Quattro Pilastri, per costruire in pochi istanti un rifugio di legno per la squadra.",
    en: "Yamato uses it to imprison opponents and, in the Four-Pillar House variant, to build a wooden shelter for the team in moments.",
  },
  'jutsu-lava-release': {
    it: "Mei Terumi la usa per sciogliere i nemici con la sua lava corrosiva; Rōshi, jinchūriki del Quattro Code, e Kurotsuchi ne mostrano altre varianti.",
    en: "Mei Terumi uses it to melt enemies with her corrosive lava; Rōshi, the Four-Tails jinchūriki, and Kurotsuchi show other variants of it.",
  },
  'jutsu-storm-release': {
    it: "Darui la eredita dal Terzo Raikage: raggi luminosi che si piegano a comando. La usa contro i Fratelli d'Oro e d'Argento nella Quarta Guerra.",
    en: "Darui inherits it from the Third Raikage: beams of light that bend at will. He uses it against the Gold and Silver Brothers in the Fourth War.",
  },
  'jutsu-adamantine-sealing-chains': {
    it: "Kushina le usa per trattenere Kurama la notte della nascita di Naruto, mentre Minato completa il sigillo; Naruto mostra catene simili nella Quarta Guerra.",
    en: "Kushina uses them to hold Kurama back on the night of Naruto's birth while Minato completes the seal; Naruto shows similar chains in the Fourth War.",
  },
  'jutsu-evil-sealing-method': {
    it: "Kakashi la applica al Sigillo Maledetto di Sasuke dopo l'incontro con Orochimaru nella Foresta della Morte: funziona finché Sasuke stesso non decide di cedere al sigillo.",
    en: "Kakashi applies it to Sasuke's Curse Mark after the encounter with Orochimaru in the Forest of Death: it works until Sasuke himself chooses to give in to the mark.",
  },
  'jutsu-mystical-palm': {
    it: "La base del ninjutsu medico: Tsunade la insegna a Sakura e Shizune, Kabuto la padroneggia a livelli rari, Ino la usa come ninja medico.",
    en: "The foundation of medical ninjutsu: Tsunade teaches it to Sakura and Shizune, Kabuto masters it to a rare degree, Ino uses it as a medical ninja.",
  },
  'jutsu-living-corpse-reincarnation': {
    it: "È il motivo per cui Orochimaru vuole il corpo di Sasuke e il suo Sharingan; quando prova a prenderselo, Sasuke ne ribalta la tecnica e lo assorbe.",
    en: "It is why Orochimaru wants Sasuke's body and his Sharingan; when he tries to take it, Sasuke turns the technique around and absorbs him.",
  },
  'jutsu-twin-lion-fists': {
    it: "Hinata la sviluppa da sola, senza il ramo principale degli Hyūga: la usa contro Pain per difendere Naruto e nella Quarta Guerra.",
    en: "Hinata develops it on her own, apart from the Hyūga main family: she uses it against Pain to defend Naruto and in the Fourth War.",
  },
  'jutsu-tenseigan': {
    it: "Toneri lo ottiene trapiantando gli occhi di Hanabi rapita: è il motore del suo piano per far cadere la luna sulla Terra in The Last.",
    en: "Toneri obtains it by transplanting the eyes of the kidnapped Hanabi: it powers his plan to drop the moon onto Earth in The Last.",
  },
  'jutsu-scorch-release': {
    it: "Pakura, eroina di Suna, viene tradita dal proprio villaggio e uccisa; Kabuto la riporta in vita nella Quarta Guerra con l'Edo Tensei.",
    en: "Pakura, a Suna heroine, is betrayed by her own village and killed; Kabuto reanimates her in the Fourth War with Edo Tensei.",
  },
  'jutsu-wind-cyclone-scythe': {
    it: "La tecnica più rappresentativa di Temari, che con un solo colpo spazza via Tayuya e i suoi demoni evocati durante il recupero di Sasuke.",
    en: "Temari's most representative technique, which with a single swing sweeps away Tayuya and her summoned demons during the Sasuke retrieval.",
  },
  'jutsu-dance-of-crescent-moon': {
    it: "Hayate Gekkō la usa per l'ultima volta contro Baki, mentre spia l'accordo fra Suna e Oto per l'invasione di Konoha: Baki lo uccide.",
    en: "Hayate Gekkō uses it for the last time against Baki, while spying on Suna and Oto's agreement to invade Konoha: Baki kills him.",
  },
  'jutsu-vanishing-rasengan': {
    it: "Boruto lo crea da solo durante gli Esami Chūnin; usato insieme al Rasengan gigante di Naruto, contribuisce a sconfiggere Momoshiki.",
    en: "Boruto creates it himself during the Chūnin Exams; combined with Naruto's giant Rasengan, it helps defeat Momoshiki.",
  },
  'jutsu-jougan': {
    it: "Si manifesta nell'occhio destro di Boruto fin da bambino: è legato alla sua natura di «vaso» e alle dimensioni degli Ōtsutsuki.",
    en: "It manifests in Boruto's right eye from childhood: it is tied to his nature as a 'vessel' and to the Ōtsutsuki dimensions.",
  },
  'jutsu-shrinking-jutsu': {
    it: "Isshiki rimpicciolisce gli oggetti per nasconderli e li riporta istantaneamente alle dimensioni originali: con essa schiaccia i nemici sotto massi e cubi.",
    en: "Isshiki shrinks objects to hide them and instantly restores their original size: with it he crushes enemies under boulders and cubes.",
  },
  'jutsu-daikokuten': {
    it: "Kawaki la eredita dal Karma di Isshiki e la usa per sigillare Naruto e Hinata in una dimensione separata, in cui il tempo non scorre.",
    en: "Kawaki inherits it from Isshiki's Karma and uses it to seal Naruto and Hinata in a separate dimension where time does not flow.",
  },
  'jutsu-claw-marks': {
    it: "Code, l'ultimo vaso con il Karma Bianco, la usa per muoversi fra i luoghi più lontani; dai suoi segni nascono anche i Claw Grime, creature che obbediscono ai suoi ordini.",
    en: "Code, the last vessel with the White Karma, uses it to travel between distant places; his marks also give rise to the Claw Grimes, creatures that obey his orders.",
  },
  'jutsu-amenotejikara': {
    it: "Sasuke la usa nella battaglia contro Madara e contro Kaguya, scambiando di posto sé stesso, gli alleati e i nemici per aprire varchi nelle loro difese.",
    en: "Sasuke uses it in the battle against Madara and against Kaguya, swapping places between himself, allies and enemies to open gaps in their defences.",
  },
  'jutsu-morning-peacock': {
    it: "Guy la usa contro Kisame e la insegna a Rock Lee, che la impara a sua volta: è la tecnica della Sesta Porta, che fa bruciare l'aria per attrito.",
    en: "Guy uses it against Kisame and teaches it to Rock Lee, who learns it too: it is the Sixth Gate technique, which sets the air ablaze through friction.",
  },
  'jutsu-daytime-tiger': {
    it: "Guy la usa contro Kisame e poi contro Madara nella Quarta Guerra, aprendo la Settima Porta prima della definitiva Ottava.",
    en: "Guy uses it against Kisame and then against Madara in the Fourth War, opening the Seventh Gate before the final Eighth.",
  },
  'jutsu-leaf-whirlwind': {
    it: "È la prima tecnica che Rock Lee mostra a Sasuke prima degli Esami Chūnin, battendolo nel duello: un calcio rotante insegnato da Guy.",
    en: "It is the first technique Rock Lee shows Sasuke before the Chūnin Exams, beating him in their duel: a spinning kick taught by Guy.",
  },
  'jutsu-chidori-sharp-spear': {
    it: "Sasuke la sviluppa nell'allenamento con Orochimaru, imparando a modellare il fulmine in forme diverse: lancia, spada e senbon.",
    en: "Sasuke develops it while training with Orochimaru, learning to shape lightning into different forms: spear, sword and senbon.",
  },
  'jutsu-wood-true-thousand-hands': {
    it: "Hashirama la evoca alla Valle della Fine contro il Susanoo di Madara e il Nove Code, e la riprende da Edo Tensei nella Quarta Guerra.",
    en: "Hashirama summons it at the Valley of the End against Madara's Susanoo and the Nine-Tails, and uses it again, reanimated, in the Fourth War.",
  },
  'jutsu-rashomon': {
    it: "Orochimaru può evocarne fino a tre in fila per fermare gli attacchi più devastanti; il Sound Four ne usa una variante per proteggere il suo maestro.",
    en: "Orochimaru can summon up to three in a row to stop the most devastating attacks; the Sound Four use a variant to protect their master.",
  },
  'jutsu-multi-shadow-clone': {
    it: "Naruto la impara dalla Pergamena dei Sigilli contro Mizuki, creandone centinaia al primo tentativo; è la base di quasi tutte le sue tecniche, dal Rasengan all'allenamento.",
    en: "Naruto learns it from the Scroll of Seals against Mizuki, creating hundreds at his first attempt; it underlies almost all his techniques, from the Rasengan to his training.",
  },
  'jutsu-tsuga': {
    it: "Kiba la esegue insieme al cane Akamaru nella variante a doppia zanna (Gatsūga); la usa negli Esami Chūnin contro Naruto e nel recupero di Sasuke.",
    en: "Kiba performs it with his dog Akamaru in the double-fang variant (Gatsūga); he uses it in the Chūnin Exams against Naruto and in the Sasuke retrieval.",
  },
};

/** Testi aggiuntivi per i luoghi (stessa regola: solo dove manca `longDescription`). */
export const NARUTO_LOCATION_LONG: Record<string, Localizable> = {
  'loc-kusa': {
    it: "Nel suo territorio, durante la Terza Guerra, si svolge la missione del Team Minato al ponte Kannabi. Karin è originaria di qui, e il villaggio partecipa agli Esami Chūnin di Konoha con una propria squadra.",
    en: "In its territory, during the Third War, Team Minato's mission at Kannabi Bridge takes place. Karin comes from here, and the village takes part in Konoha's Chūnin Exams with its own team.",
  },
  'loc-taki': {
    it: "Custodisce l'Acqua dell'Eroe e ospita la jinchūriki del Sette Code, Fū. Kakuzu fu uno dei suoi ninja migliori prima di tradire il villaggio e rubarne i segreti.",
    en: "It guards the Hero Water and hosts the Seven-Tails jinchūriki, Fū. Kakuzu was one of its finest ninja before betraying the village and stealing its secrets.",
  },
  'loc-yu': {
    it: "Un villaggio che ha rinunciato alla guerra per diventare una meta termale; Hidan, disgustato da questa pace, lo abbandona per unirsi al culto di Jashin e all'Akatsuki.",
    en: "A village that gave up war to become a hot-spring resort; Hidan, disgusted by this peace, leaves it to join the cult of Jashin and the Akatsuki.",
  },
  'loc-uzushio-ruins': {
    it: "Uzushio era alleata stretta di Konoha: il simbolo a spirale sui giubbotti della Foglia ne è il ricordo. Kushina, sopravvissuta, era arrivata a Konoha da bambina per diventare la jinchūriki del Nove Code.",
    en: "Uzushio was a close ally of Konoha: the spiral symbol on the Leaf's flak jackets is its legacy. Kushina, a survivor, had come to Konoha as a child to become the Nine-Tails' jinchūriki.",
  },
  'loc-shikkotsu-forest': {
    it: "È uno dei tre luoghi sacri dei saggi insieme al Monte Myōboku e alla Caverna di Ryūchi. Katsuyu, la lumaca gigante evocata da Tsunade, protegge gli abitanti di Konoha durante l'assalto di Pain.",
    en: "It is one of the three sacred sage lands along with Mount Myōboku and Ryūchi Cave. Katsuyu, the giant slug summoned by Tsunade, protects Konoha's people during Pain's assault.",
  },
  'loc-samurai-bridge': {
    it: "Il Team Kakashi guidato da Yamato vi si reca per incontrare la spia di Sasori dentro l'organizzazione di Orochimaru: è Kabuto, e al posto di Sasori si presenta Orochimaru. È qui che Naruto libera quattro code di Kurama e che Sai entra nella squadra.",
    en: "Team Kakashi, led by Yamato, goes there to meet Sasori's spy inside Orochimaru's organisation: it is Kabuto, and Orochimaru shows up instead of Sasori. Here Naruto releases four of Kurama's tails and Sai joins the team.",
  },
  'loc-demon': {
    it: "Il paese della sacerdotessa Shion, la cui famiglia sigilla da generazioni il demone Mōryō. Nel primo film di Shippuden Naruto la scorta per impedirne il risveglio.",
    en: "The land of the priestess Shion, whose family has sealed the demon Mōryō for generations. In the first Shippuden film Naruto escorts her to prevent its revival.",
  },
  'loc-konoha-ichiraku': {
    it: "Gestito da Teuchi e dalla figlia Ayame, è il luogo dove Iruka porta Naruto quando nessuno lo considera e dove il ragazzo festeggia ogni vittoria. Distrutto da Pain, viene ricostruito con il villaggio.",
    en: "Run by Teuchi and his daughter Ayame, it is where Iruka takes Naruto when no one else cares about him and where the boy celebrates every victory. Destroyed by Pain, it is rebuilt with the village.",
  },
  'loc-konoha-hospital': {
    it: "Qui finiscono Rock Lee dopo Gaara, Sasuke e Kakashi dopo Itachi, e Naruto dopo ogni battaglia. Sul tetto dell'ospedale si consuma il primo vero scontro fra Naruto e Sasuke, interrotto da Kakashi.",
    en: "Rock Lee ends up here after Gaara, Sasuke and Kakashi after Itachi, and Naruto after every battle. On the hospital roof Naruto and Sasuke have their first real fight, stopped by Kakashi.",
  },
  'loc-konoha-main-gate': {
    it: "Izumo e Kotetsu ne sono i guardiani storici. Da qui Sasuke se ne va di notte, salutato solo da Sakura, e da qui Naruto parte e rientra dopo i due anni e mezzo di allenamento con Jiraiya.",
    en: "Izumo and Kotetsu are its long-standing guards. Sasuke leaves through it at night, farewelled only by Sakura, and Naruto departs and returns through it after his two and a half years of training with Jiraiya.",
  },
  'loc-konoha-memorial': {
    it: "Sulla pietra sono incisi i nomi dei ninja caduti in servizio, compresi Obito e Rin: Kakashi vi passa ogni mattina, ed è per questo che arriva sempre in ritardo. Qui avviene anche la prova dei sonagli del Team 7.",
    en: "The names of ninja fallen in the line of duty are carved into it, including Obito and Rin: Kakashi visits every morning, which is why he is always late. Team 7's bell test also takes place here.",
  },
  'loc-konoha-intelligence': {
    it: "Durante l'assalto di Pain Inoichi e i suoi analizzano qui il corpo di uno dei Cammini catturati, scoprendone i segreti prima che il villaggio venga raso al suolo.",
    en: "During Pain's assault Inoichi and his team analyse the body of one of the captured Paths here, uncovering its secrets before the village is razed.",
  },
  'loc-konoha-cemetery': {
    it: "Qui si svolge il funerale del Terzo Hokage sotto la pioggia, dopo l'invasione di Konoha; più tardi vi riposano Asuma e i caduti della Quarta Guerra.",
    en: "The Third Hokage's funeral in the rain takes place here after the invasion of Konoha; later Asuma and the fallen of the Fourth War rest here.",
  },
  'loc-konoha-bbq': {
    it: "È il ristorante preferito di Chōji e del Team 10: Asuma vi porta i suoi allievi dopo le missioni, e dopo la sua morte Shikamaru, Chōji e Ino continuano a riunirsi lì.",
    en: "It is Chōji's and Team 10's favourite restaurant: Asuma takes his students there after missions, and after his death Shikamaru, Chōji and Ino keep meeting there.",
  },
  'loc-konoha-hot-springs': {
    it: "Qui Jiraiya incontra Naruto per la prima volta, mentre «raccoglie materiale» per i suoi romanzi, e accetta di insegnargli il controllo del chakra per l'esame finale.",
    en: "Here Jiraiya meets Naruto for the first time, while 'gathering material' for his novels, and agrees to teach him chakra control for the final exam.",
  },
  'loc-suna-kazekage-office': {
    it: "Gaara vi siede come Quinto Kazekage dopo gli anni di solitudine; da qui Deidara lo rapisce per l'Akatsuki, e i ninja di Suna, Temari e Kankurō in testa, si mobilitano per riprenderlo.",
    en: "Gaara sits there as Fifth Kazekage after years of loneliness; from here Deidara abducts him for the Akatsuki, and Suna's ninja, led by Temari and Kankurō, mobilise to get him back.",
  },
  'loc-suna-puppet-workshop': {
    it: "Le marionette sono la specialità di Suna: Chiyo ne fu maestra e insegnò l'arte al nipote Sasori, che ne fece un'arma per sé stesso trasformando il proprio corpo in una marionetta.",
    en: "Puppets are Suna's speciality: Chiyo was a master and taught the art to her grandson Sasori, who turned it into a weapon by making his own body a puppet.",
  },
  'loc-kiri-mizukage-office': {
    it: "Sotto il Quarto Mizukage Yagura, controllato da Obito, Kiri fu il «Villaggio della Nebbia Insanguinata»; la Quinta Mizukage Mei Terumi chiude quell'epoca, e Chōjūrō le succede come Sesto.",
    en: "Under the Fourth Mizukage Yagura, controlled by Obito, Kiri was the 'Village of the Bloody Mist'; the Fifth Mizukage Mei Terumi ends that era, and Chōjūrō succeeds her as the Sixth.",
  },
  'loc-kiri-swordsmen-hall': {
    it: "I Sette Spadaccini della Nebbia tramandano le spade leggendarie: Kubikiribōchō di Zabuza, Samehada di Kisame, Hiramekarei di Chōjūrō. Suigetsu sogna di raccoglierle tutte.",
    en: "The Seven Swordsmen of the Mist hand down the legendary blades: Zabuza's Kubikiribōchō, Kisame's Samehada, Chōjūrō's Hiramekarei. Suigetsu dreams of collecting them all.",
  },
  'loc-iwa-tsuchikage-office': {
    it: "Ōnoki, il Terzo Tsuchikage, vi ha governato per decenni con l'Arte della Polvere; alla Quarta Guerra si unisce all'Alleanza, e nell'era Boruto la nipote Kurotsuchi diventa la Quarta Tsuchikage.",
    en: "Ōnoki, the Third Tsuchikage, ruled from here for decades with Dust Release; in the Fourth War he joins the Alliance, and in the Boruto era his granddaughter Kurotsuchi becomes the Fourth Tsuchikage.",
  },
  'loc-kumo-main-tower': {
    it: "Ospita l'ufficio del Raikage: A, il Quarto, vi governa con il fratello adottivo Killer B, jinchūriki dell'Otto Code; dopo la guerra gli succede Darui come Quinto Raikage.",
    en: "It houses the Raikage's office: A, the Fourth, rules from here with his adoptive brother Killer B, the Eight-Tails jinchūriki; after the war Darui succeeds him as Fifth Raikage.",
  },
  'loc-ame-orphan-hideout': {
    it: "Durante la Seconda Guerra i tre orfani vivono qui con Jiraiya, che li allena per tre anni e scopre il Rinnegan di Nagato. Quando se ne va, li crede pronti a cambiare il mondo con la pace.",
    en: "During the Second War the three orphans live here with Jiraiya, who trains them for three years and discovers Nagato's Rinnegan. When he leaves, he believes them ready to change the world through peace.",
  },
  'loc-oto-lab-main': {
    it: "Qui Orochimaru conduce gli esperimenti con le cellule di Hashirama e prepara i corpi da occupare; dopo la sua sconfitta Sasuke libera i prigionieri, fra cui Suigetsu e Jūgo.",
    en: "Here Orochimaru carries out his experiments with Hashirama's cells and prepares the bodies he will occupy; after his defeat Sasuke frees the prisoners, including Suigetsu and Jūgo.",
  },
  'loc-uzu-sealing-shrine': {
    it: "Gli Uzumaki erano maestri del fūinjutsu, al punto che le grandi nazioni li temettero e ne distrussero il villaggio. Kushina e Mito ne ereditarono l'arte, che rese possibile sigillare Kurama.",
    en: "The Uzumaki were masters of fūinjutsu, so much so that the great nations feared them and destroyed their village. Kushina and Mito inherited the art, which made it possible to seal Kurama.",
  },
  'loc-taki-hero-water': {
    it: "Nell'episodio speciale di Takigakure Naruto aiuta il giovane capo Shibuki a difendere il villaggio da chi vuole rubare l'acqua; è un'aggiunta della serie animata.",
    en: "In the Takigakure special Naruto helps the young leader Shibuki defend the village from those who want to steal the water; it is an addition of the animated series.",
  },
};
