import type { Faction } from '@/types';

/**
 * Clan aggiuntivi di Naruto (extends clans.ts).
 * Questi clan completano il roster dei clan minori e semi-canonici
 * non inclusi nel file principale.
 */
export const narutoClansExtra: Faction[] = [
  /* ------------------------------------------------------------------ */
  /*  TERUMI CLAN                                                         */
  /* ------------------------------------------------------------------ */
  {
    id: 'clan-terumi',
    worldId: 'world-naruto',
    type: 'clan',
    name: 'Terumi Clan',
    nameLocal: 'Terumi Ichizoku',
    japaneseName: '照美一族',
    villageLocationId: 'loc-kiri',
    description: {
      it: 'Clan di Kirigakure legato alla linea dei Mizukage. Rarissima casata dotata di due kekkei genkai distinte: la Lava Release (Yoton) e la Boil Release (Futton).',
      en: 'Clan from Kirigakure linked to the Mizukage lineage. A rare bloodline endowed with two distinct kekkei genkai: Lava Release (Yoton) and Boil Release (Futton).',
    },
    longDescription: {
      it: 'Mei Terumi, quinta Mizukage, è il membro più noto del clan. È eccezionale anche tra i kekkei genkai perché ne padroneggia due contemporaneamente. Il clan è storicamente radicato a Kirigakure e ha contribuito alla stabilizzazione del Villaggio della Nebbia dopo le sanguinose purghe.',
      en: 'Mei Terumi, the Fifth Mizukage, is the most prominent known member of the clan. She is exceptional even among kekkei genkai users because she masters two simultaneously. The clan is historically rooted in Kirigakure and contributed to the village\'s stabilisation after the bloody purges.',
    },
    signatureAbilities: ['Lava Release', 'Boil Release'],
    kekkeiGenkai: 'Lava Release / Boil Release',
    jutsuIds: ['jutsu-lava-release', 'jutsu-boil-release'],
    leaderIds: ['char-mei'],
    characterIds: ['char-mei'],
    locationIds: ['loc-kiri'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['kiri', 'kekkei-genkai', 'dual-kkgi'],
  },

  /* ------------------------------------------------------------------ */
  /*  KURAMA CLAN (genjutsu)                                              */
  /* ------------------------------------------------------------------ */
  {
    id: 'clan-kurama-genjutsu',
    worldId: 'world-naruto',
    type: 'clan',
    name: 'Kurama Clan',
    nameLocal: 'Kurama Ichizoku',
    japaneseName: '鞍馬一族',
    villageLocationId: 'loc-konoha',
    description: {
      it: 'Clan di Konoha rinomato per la capacità di creare genjutsu di potenza letale. I membri più dotati generano illusioni così reali da causare la morte o la follia della vittima, senza possibilità di dispel ordinario.',
      en: 'Konoha clan renowned for crafting genjutsu of lethal potency. Their most gifted members generate illusions so real they can cause death or insanity in the victim, beyond ordinary dispel.',
    },
    longDescription: {
      it: 'Il kekkei genkai del clan si manifesta solo in alcuni individui ogni generazione. I portatori di questo dono sono temuti persino dai compagni di villaggio: il loro genjutsu non richiede contatto visivo e agisce a livello neurologico profondo. La tradizione del clan impone che tali individui siano sorvegliati con attenzione.',
      en: 'The clan\'s kekkei genkai manifests only in select individuals each generation. Bearers of this gift are feared even by fellow villagers: their genjutsu requires no eye contact and acts at a deep neurological level. Clan tradition mandates that such individuals be closely monitored.',
    },
    signatureAbilities: ['Kekkei Genkai Genjutsu (letale)', 'Illusioni profonde'],
    kekkeiGenkai: 'Genjutsu (advanced kekkei genkai)',
    locationIds: ['loc-konoha'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['konoha', 'genjutsu', 'kekkei-genkai'],
  },

  /* ------------------------------------------------------------------ */
  /*  FUMA CLAN                                                           */
  /* ------------------------------------------------------------------ */
  {
    id: 'clan-fuma',
    worldId: 'world-naruto',
    type: 'clan',
    name: 'Fuma Clan',
    nameLocal: 'Fūma Ichizoku',
    japaneseName: '風魔一族',
    description: {
      it: 'Antico clan di ninja noti per l\'uso del grande shuriken Fūma Shuriken e per le loro capacità di combattimento ravvicinato. Un ramo del clan decadde e si alleò con Orochimaru e il Villaggio del Suono.',
      en: 'Ancient clan of ninja known for their use of the large Fūma Shuriken and close-combat prowess. A branch of the clan fell into decline and allied itself with Orochimaru and the Sound Village.',
    },
    longDescription: {
      it: 'I Fūma erano una volta una forza formidabile. Dopo la caduta in disgrazia, i membri del ramo alleato con Oto eseguivano missioni per conto di Orochimaru. Il clan possiede tecniche di kenjutsu e shuriken-jutsu tramandate di generazione in generazione.',
      en: 'The Fūma were once a formidable force. After their decline, members of the Oto-aligned branch carried out missions on Orochimaru\'s behalf. The clan possesses kenjutsu and shuriken-jutsu techniques passed down through generations.',
    },
    signatureAbilities: ['Fūma Shuriken', 'Kenjutsu', 'Shuriken-jutsu'],
    characterIds: [],
    locationIds: ['loc-oto'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['oto', 'orochimaru', 'shuriken'],
  },

  /* ------------------------------------------------------------------ */
  /*  JUGO'S CLAN                                                         */
  /* ------------------------------------------------------------------ */
  {
    id: 'clan-jugo',
    worldId: 'world-naruto',
    type: 'clan',
    name: "Jūgo's Clan",
    description: {
      it: 'Clan senza nome ufficiale i cui membri nascono con la capacità innata di assorbire passivamente la Natura di Chakra Saggio dall\'ambiente. Questo provoca trasformazioni fisiche incontrollabili e accessi di violenza. I Sigilli Maledetti di Orochimaru sono derivati da questo kekkei genkai.',
      en: "Unnamed clan whose members are born with the innate ability to passively absorb Sage Chakra Nature from the environment. This triggers uncontrollable physical transformations and violent rages. Orochimaru's Cursed Seals are derived from this kekkei genkai.",
    },
    longDescription: {
      it: 'Jūgo è l\'unico membro sopravvissuto noto. La sua condizione è quella tipica del clan: assorbimento involontario di energia saggio naturale che porta a trasformazioni aggressive. Orochimaru sfruttò il corpo di Jūgo per isolare e replicare questa capacità nei Sigilli Maledetti distribuiti ai suoi seguaci.',
      en: "Jūgo is the only known surviving member. His condition is typical of the clan: involuntary absorption of natural sage energy leading to aggressive transformations. Orochimaru exploited Jūgo's body to isolate and replicate this ability in the Cursed Seals distributed to his followers.",
    },
    signatureAbilities: ['Passivo Assorbimento Energia Saggio', 'Trasformazione Cursed Seal', 'Potenziamento fisico innato'],
    kekkeiGenkai: 'Passive Natural Energy Absorption',
    leaderIds: [],
    characterIds: ['char-jugo'],
    locationIds: ['loc-oto'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['saggio', 'cursed-seal', 'orochimaru', 'trasformazione'],
  },

  /* ------------------------------------------------------------------ */
  /*  SHIMURA CLAN                                                        */
  /* ------------------------------------------------------------------ */
  {
    id: 'clan-shimura',
    worldId: 'world-naruto',
    type: 'clan',
    name: 'Shimura Clan',
    nameLocal: 'Shimura Ichizoku',
    japaneseName: '志村一族',
    villageLocationId: 'loc-konoha',
    description: {
      it: 'Clan di Konoha a cui appartiene Danzō Shimura, fondatore di Root e controverso candidato Hokage. Il clan non è celebre per un kekkei genkai specifico, ma per il peso politico e militare esercitato nelle ombre del villaggio.',
      en: 'Konoha clan to which Danzō Shimura belongs — founder of Root and controversial Hokage candidate. The clan is not notable for a specific kekkei genkai, but for the political and military weight it wielded in the shadows of the village.',
    },
    leaderIds: ['char-danzo'],
    characterIds: ['char-danzo'],
    locationIds: ['loc-konoha'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['konoha', 'root', 'politica'],
  },

  /* ------------------------------------------------------------------ */
  /*  YUHI CLAN                                                           */
  /* ------------------------------------------------------------------ */
  {
    id: 'clan-yuhi',
    worldId: 'world-naruto',
    type: 'clan',
    name: 'Yūhi Clan',
    nameLocal: 'Yūhi Ichizoku',
    japaneseName: '夕日一族',
    villageLocationId: 'loc-konoha',
    description: {
      it: 'Clan di Konoha di cui fa parte Kurenai Yūhi, jonin istruttrice del Team 8 e specialista di genjutsu. Il clan non è particolarmente rinomato, ma Kurenai è considerata tra i migliori utilizzatori di genjutsu del suo tempo.',
      en: 'Konoha clan to which Kurenai Yūhi belongs — jonin instructor of Team 8 and genjutsu specialist. The clan is not particularly renowned, but Kurenai is considered among the best genjutsu users of her generation.',
    },
    signatureAbilities: ['Genjutsu avanzato'],
    characterIds: [],
    locationIds: ['loc-konoha'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['konoha', 'genjutsu'],
  },

  /* ------------------------------------------------------------------ */
  /*  MAITO/MIGHT CLAN                                                    */
  /* ------------------------------------------------------------------ */
  {
    id: 'clan-maito',
    worldId: 'world-naruto',
    type: 'clan',
    name: 'Maito Clan',
    nameLocal: 'Maito Ichizoku',
    japaneseName: 'マイト一族',
    villageLocationId: 'loc-konoha',
    description: {
      it: 'Famiglia di Konoha cui appartiene Maito Gai. Privi di capacità particolari di natura chakra, i Maito si distinguono per un\'eccezionale dedizione al Taijutsu puro, portata ai limiti assoluti con i Gate of Opening.',
      en: 'Konoha family to which Maito Gai belongs. Lacking notable chakra nature abilities, the Maito distinguish themselves through extraordinary devotion to pure Taijutsu, pushed to absolute limits with the Eight Gates.',
    },
    longDescription: {
      it: 'Maito Gai, jonin di Konoha e istruttore del Team Guy, ha affinato il Taijutsu al massimo livello possibile per un essere umano. Con l\'apertura dell\'Ottava Porta (Hachimon Tonkō), Gai è riuscito a danneggiare Madara Uchiha nella sua forma di Jinchūriki del Sei-tails. Rock Lee, il suo allievo, segue la stessa via. Il padre di Gai, Maito Dai, introdusse la tecnica "Youthful Spring".',
      en: "Maito Gai, Konoha jonin and Team Guy instructor, refined Taijutsu to the highest level possible for a human. By opening the Eighth Gate (Hachimon Tonkō), Gai managed to wound Madara Uchiha in his Six-tails Jinchūriki form. Rock Lee, his student, follows the same path. Gai's father, Maito Dai, pioneered the 'Youthful Spring' technique.",
    },
    signatureAbilities: ['Taijutsu massimale', 'Eight Gates (Hachimon Tonkō)', 'Dynamic Entry', 'Morning Peacock'],
    leaderIds: ['char-guy'],
    characterIds: ['char-guy', 'char-rock-lee'],
    locationIds: ['loc-konoha'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['konoha', 'taijutsu', 'eight-gates'],
    jutsuIds: ['jutsu-eight-gates', 'jutsu-reverse-lotus'],
  },

  /* ------------------------------------------------------------------ */
  /*  KATOU CLAN                                                          */
  /* ------------------------------------------------------------------ */
  {
    id: 'clan-katou',
    worldId: 'world-naruto',
    type: 'clan',
    name: 'Katō Clan',
    nameLocal: 'Katō Ichizoku',
    japaneseName: '加藤一族',
    villageLocationId: 'loc-konoha',
    description: {
      it: 'Clan minore di Konoha a cui appartiene Dan Katō, jonin noto per la tecnica Spirit Transformation, e sua sorella Nawaki. Tsunade era legata sentimentalmente a Dan, la cui morte influenzò profondamente il suo futuro.',
      en: "Minor Konoha clan to which Dan Katō belongs — a jonin known for the Spirit Transformation Technique — and his sister Nawaki. Tsunade was romantically linked to Dan, whose death profoundly influenced her future.",
    },
    signatureAbilities: ['Spirit Transformation Technique'],
    characterIds: ['char-dan-kato'],
    locationIds: ['loc-konoha'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['konoha', 'minore'],
  },
];

/* ====================================================================== */
/*  FAZIONI / ORGANIZZAZIONI EXTRA                                         */
/* ====================================================================== */

/**
 * Fazioni/organizzazioni aggiuntive di Naruto (extends factions.ts).
 * Comprende gruppi, eserciti e collettivi narrativi non inclusi
 * nel file principale.
 */
export const narutoFactionsExtra: Faction[] = [
  /* ------------------------------------------------------------------ */
  /*  ORIGINAL AKATSUKI (Yahiko era)                                      */
  /* ------------------------------------------------------------------ */
  {
    id: 'faction-akatsuki-original',
    worldId: 'world-naruto',
    type: 'organization',
    name: 'Akatsuki (Original)',
    japaneseName: '暁（初代）',
    description: {
      it: 'La forma originaria dell\'Akatsuki, fondata da Yahiko, Nagato e Konan ad Amegakure. Un gruppo di resistenza pacifista che combatteva per porre fine alle guerre che affliggevano la Pioggia.',
      en: 'The original form of Akatsuki, founded by Yahiko, Nagato and Konan in Amegakure. A pacifist resistance group fighting to end the wars that afflicted the Rain.',
    },
    longDescription: {
      it: 'Fondato durante la Terza Guerra Ninja, il gruppo originale cercava di unire i paesi sotto una pace duratura usando la persuasione più che la violenza. Dopo la morte di Yahiko per mano di Hanzō e Danzō, Nagato assunse il controllo come "Pain" e trasformò l\'organizzazione in uno strumento di terrore al servizio di Obito/Madara.',
      en: 'Founded during the Third Ninja War, the original group sought to unite nations under lasting peace through persuasion rather than violence. After Yahiko\'s death at the hands of Hanzō and Danzō, Nagato took control as "Pain" and transformed the organisation into an instrument of terror in service to Obito/Madara.',
    },
    leaderIds: ['char-yahiko'],
    characterIds: ['char-yahiko', 'char-pain', 'char-konan'],
    locationIds: ['loc-ame'],
    arcIds: ['arc-fourth-war'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['ame', 'pacifismo', 'yahiko'],
  },

  /* ------------------------------------------------------------------ */
  /*  KONOHA 12                                                           */
  /* ------------------------------------------------------------------ */
  {
    id: 'faction-konoha-12',
    worldId: 'world-naruto',
    type: 'group',
    name: 'Konoha 12',
    description: {
      it: 'I dodici genin di Konoha appartenenti alla generazione di Naruto. Raggruppamento informale usato in contesti come l\'esame Chūnin, le missioni di recupero e la guerra.',
      en: 'The twelve Konoha genin belonging to Naruto\'s generation. An informal grouping used in contexts such as the Chūnin Exam, retrieval missions, and the war.',
    },
    longDescription: {
      it: 'Il gruppo include: Naruto Uzumaki, Sasuke Uchiha, Sakura Haruno, Hinata Hyuga, Neji Hyuga, Rock Lee, Tenten, Shikamaru Nara, Ino Yamanaka, Chōji Akimichi, Kiba Inuzuka e Shino Aburame.',
      en: 'The group includes: Naruto Uzumaki, Sasuke Uchiha, Sakura Haruno, Hinata Hyuga, Neji Hyuga, Rock Lee, Tenten, Shikamaru Nara, Ino Yamanaka, Chōji Akimichi, Kiba Inuzuka and Shino Aburame.',
    },
    characterIds: [
      'char-naruto',
      'char-sasuke',
      'char-sakura',
      'char-hinata',
      'char-neji',
      'char-rock-lee',
      'char-tenten',
      'char-shikamaru',
      'char-ino',
      'char-choji',
      'char-kiba',
      'char-shino',
    ],
    locationIds: ['loc-konoha'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['konoha', 'genin', 'generazione'],
  },

  /* ------------------------------------------------------------------ */
  /*  KONOHA 11 (excl. Sasuke)                                           */
  /* ------------------------------------------------------------------ */
  {
    id: 'faction-konoha-11',
    worldId: 'world-naruto',
    type: 'group',
    name: 'Konoha 11',
    description: {
      it: 'Undici dei dodici genin di Konoha, escluso Sasuke Uchiha dopo la sua defezione. Collaborano spesso durante la Quarta Guerra Ninja.',
      en: 'Eleven of the twelve Konoha genin, excluding Sasuke Uchiha after his defection. They frequently collaborate during the Fourth Ninja War.',
    },
    characterIds: [
      'char-naruto',
      'char-sakura',
      'char-hinata',
      'char-neji',
      'char-rock-lee',
      'char-tenten',
      'char-shikamaru',
      'char-ino',
      'char-choji',
      'char-kiba',
      'char-shino',
    ],
    locationIds: ['loc-konoha'],
    arcIds: ['arc-fourth-war'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['konoha', 'genin', 'senza-sasuke'],
  },

  /* ------------------------------------------------------------------ */
  /*  INO-SHIKA-CHO FORMATION                                            */
  /* ------------------------------------------------------------------ */
  {
    id: 'faction-ino-shika-cho',
    worldId: 'world-naruto',
    type: 'group',
    name: 'Ino-Shika-Chō',
    japaneseName: 'いのシカ蝶',
    description: {
      it: 'Formazione tri-clan tramandata di generazione in generazione tra i clan Yamanaka, Nara e Akimichi di Konoha. Combinano illusione mentale, cattura d\'ombra ed espansione corporea in una tattica di squadra letale.',
      en: 'Tri-clan formation passed down through generations among the Yamanaka, Nara and Akimichi clans of Konoha. They combine mental illusion, shadow capture and body expansion into a lethal team tactic.',
    },
    longDescription: {
      it: 'La formazione Ino-Shika-Chō prevede: Yamanaka (Ino) paralizza mentalmente il bersaglio; Nara (Shikamaru) lo immobilizza con le ombre; Akimichi (Chōji) infligge il colpo finale ampliato. Questa sinergia è stata portata avanti anche dalla generazione di Inoichi, Shikaku e Chōza durante le guerre precedenti.',
      en: 'The Ino-Shika-Chō formation involves: Yamanaka (Ino) mentally paralysing the target; Nara (Shikamaru) immobilising it with shadows; Akimichi (Chōji) delivering the amplified finishing blow. This synergy was also carried out by the generation of Inoichi, Shikaku and Chōza during earlier wars.',
    },
    signatureAbilities: ['Mind Body Switch', 'Kagemane', 'Multi-Size Technique'],
    jutsuIds: ['jutsu-mind-body-switch', 'jutsu-kagemane', 'jutsu-shadow-sewing', 'jutsu-multi-size', 'jutsu-butterfly-mode'],
    characterIds: ['char-ino', 'char-shikamaru', 'char-choji', 'char-inoichi', 'char-shikaku', 'char-choza'],
    locationIds: ['loc-konoha'],
    arcIds: ['arc-fourth-war'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['ino-shika-cho', 'konoha', 'formazione'],
  },

  /* ------------------------------------------------------------------ */
  /*  SAND SIBLINGS                                                       */
  /* ------------------------------------------------------------------ */
  {
    id: 'faction-suna-siblings',
    worldId: 'world-naruto',
    type: 'group',
    name: 'Sand Siblings',
    description: {
      it: 'Gaara, Temari e Kankurō come unità operativa. Inizialmente antagonisti durante l\'esame Chūnin, diventano alleati di Konoha e simbolo dell\'amicizia tra i villaggi.',
      en: 'Gaara, Temari and Kankurō as an operational unit. Initially antagonists during the Chūnin Exam, they become Konoha\'s allies and a symbol of friendship between villages.',
    },
    leaderIds: ['char-gaara'],
    characterIds: ['char-gaara', 'char-temari', 'char-kankuro'],
    locationIds: ['loc-suna'],
    arcIds: ['arc-fourth-war'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['suna', 'fratelli', 'gaara'],
  },

  /* ------------------------------------------------------------------ */
  /*  SIX PATHS OF PAIN                                                   */
  /* ------------------------------------------------------------------ */
  {
    id: 'faction-pains-six-paths',
    worldId: 'world-naruto',
    type: 'group',
    name: "Pain's Six Paths",
    japaneseName: '六道の Pain',
    description: {
      it: 'I sei corpi animati da Nagato attraverso il Rinnegan: Deva Path, Asura Path, Human Path, Animal Path, Hungry Ghost Path e Hell Path. Ogni corpo controllava uno degli Śṣaḍ-riga poteri del Rinnegan.',
      en: "The six bodies animated by Nagato through the Rinnegan: Deva Path, Asura Path, Human Path, Animal Path, Hungry Ghost Path and Hell Path. Each body controlled one of the six powers of the Rinnegan.",
    },
    longDescription: {
      it: 'Nagato usava i cadaveri di ex shinobi, tra cui Yahiko (come corpo principale del Deva Path), per proiettare la sua volontà a distanza. I sei corpi erano connessi telepaticamente attraverso dei chakra receiver. Questa tecnica è una manifestazione avanzata del Rinnegan.',
      en: 'Nagato used the corpses of former shinobi, including Yahiko (as the main Deva Path body), to project his will at a distance. The six bodies were telepathically connected through chakra receivers. This technique is an advanced manifestation of the Rinnegan.',
    },
    signatureAbilities: ['Rinnegan (sei poteri)', 'Chibaku Tensei', 'Shinra Tensei', 'Bansho Ten\'in'],
    jutsuIds: ['jutsu-rinnegan', 'jutsu-deva-path', 'jutsu-chibaku-tensei'],
    leaderIds: ['char-pain'],
    characterIds: ['char-pain', 'char-yahiko'],
    locationIds: ['loc-ame', 'loc-konoha'],
    arcIds: ['arc-pain-assault'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['pain', 'rinnegan', 'nagato'],
  },

  /* ------------------------------------------------------------------ */
  /*  TAILED BEASTS (Bijuu)                                              */
  /* ------------------------------------------------------------------ */
  {
    id: 'faction-tailed-beasts',
    worldId: 'world-naruto',
    type: 'group',
    name: 'Tailed Beasts',
    nameLocal: 'Bijū',
    japaneseName: '尾獣',
    description: {
      it: 'I nove spiriti di chakra puro creati dall\'Ōtsutsuki Hagoromo distribuendo la massa del Jūbi tra nove esseri distinti. Ogni Bijū porta un numero di code da uno a nove.',
      en: 'The nine pure chakra spirits created by Ōtsutsuki Hagoromo by distributing the mass of the Ten-Tails among nine distinct beings. Each Bijū bears a number of tails from one to nine.',
    },
    longDescription: {
      it: 'I Bijū non sono malvagi per natura: sono forze della natura dotate di intelletto. Vengono considerati strumenti dai ninja che li intrappolano nei Jinchūriki. Durante la Quarta Guerra Ninja, i Bijū si uniscono a Naruto per affrontare Madara e Kaguya. Il Kurama (Nove Code) è il più potente. Gli altri sono: Shukaku (1), Matatabi (2), Isobu (3), Son Gokū (4), Kokuō (5), Saiken (6), Chōmei (7), Gyūki (8).',
      en: 'The Bijū are not evil by nature: they are forces of nature endowed with intellect. They are regarded as tools by the ninja who trap them in Jinchūriki. During the Fourth Ninja War, the Bijū join Naruto to face Madara and Kaguya. The Kurama (Nine-Tails) is the most powerful. The others are: Shukaku (1), Matatabi (2), Isobu (3), Son Gokū (4), Kokuō (5), Saiken (6), Chōmei (7), Gyūki (8).',
    },
    signatureAbilities: ['Tailed Beast Ball', 'Chakra colossale', 'Trasformazione Bijū'],
    jutsuIds: ['jutsu-tailed-beast-ball'],
    characterIds: ['char-kurama', 'char-shukaku', 'char-gyuki', 'char-naruto', 'char-killer-b', 'char-gaara'],
    arcIds: ['arc-fourth-war', 'arc-fourth-war-climax'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['bijuu', 'jinchuuriki', 'chakra-puro'],
  },

  /* ------------------------------------------------------------------ */
  /*  EDO TENSEI ARMY (Fourth War Reanimated)                            */
  /* ------------------------------------------------------------------ */
  {
    id: 'faction-fourth-war-reanimated',
    worldId: 'world-naruto',
    type: 'army',
    name: 'Edo Tensei Army',
    japaneseName: '穢土転生の軍隊',
    description: {
      it: 'Esercito di shinobi rianimati da Kabuto Yakushi con la tecnica Impure World Reincarnation (Edo Tensei) durante la Quarta Guerra Ninja. Include alcuni dei ninja più potenti della storia.',
      en: "Army of shinobi reanimated by Kabuto Yakushi using the Impure World Reincarnation technique (Edo Tensei) during the Fourth Ninja War. Includes some of the most powerful ninja in history.",
    },
    longDescription: {
      it: 'Kabuto riportò in vita decine di shinobi celebri, tra cui Madara Uchiha, i precedenti Kage, Nagato, Itachi, e molti altri. Questa forza rappresentò una delle minacce più grandi per l\'Alleanza Shinobi. La tecnica fu infine invertita da Itachi prima della sua seconda morte.',
      en: 'Kabuto brought back dozens of famous shinobi, including Madara Uchiha, the previous Kage, Nagato, Itachi, and many others. This force represented one of the greatest threats to the Shinobi Alliance. The technique was ultimately reversed by Itachi before his second death.',
    },
    signatureAbilities: ['Impure World Reincarnation', 'Reanimazione infinita'],
    jutsuIds: ['jutsu-edo-tensei'],
    leaderIds: ['char-kabuto'],
    characterIds: [
      'char-kabuto',
      'char-madara',
      'char-itachi',
      'char-pain',
      'char-hashirama',
      'char-tobirama',
    ],
    arcIds: ['arc-fourth-war', 'arc-fourth-war-countdown'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['guerra', 'edo-tensei', 'kabuto'],
  },

  /* ------------------------------------------------------------------ */
  /*  KAZEKAGE GUARD                                                      */
  /* ------------------------------------------------------------------ */
  {
    id: 'faction-kazekage-guard',
    worldId: 'world-naruto',
    type: 'group',
    name: "Kazekage's Guard",
    description: {
      it: 'Guardia d\'élite di Sunagakure incaricata della protezione del Kazekage. Composta dai migliori shinobi di Suna.',
      en: "Sunagakure's elite guard charged with protecting the Kazekage. Composed of Suna's finest shinobi.",
    },
    leaderIds: ['char-gaara'],
    characterIds: ['char-gaara', 'char-temari', 'char-kankuro'],
    locationIds: ['loc-suna'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['suna', 'guardia', 'kazekage'],
  },

  /* ------------------------------------------------------------------ */
  /*  TEAM SAMUI (Kumo envoy)                                            */
  /* ------------------------------------------------------------------ */
  {
    id: 'faction-kumo-team-samui',
    worldId: 'world-naruto',
    type: 'group',
    name: 'Team Samui',
    description: {
      it: 'Squadra inviata da Kumogakure al Summit dei Cinque Kage: Samui (capoteam), Karui e Atsui. Successivamente coinvolta nelle ricerche di Killer B.',
      en: "Team dispatched by Kumogakure to the Five Kage Summit: Samui (team leader), Karui and Atsui. Later involved in the search for Killer B.",
    },
    leaderIds: ['char-samui'],
    characterIds: ['char-samui', 'char-karui', 'char-atsui'],
    locationIds: ['loc-kumo'],
    arcIds: ['arc-five-kage-summit'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['kumo', 'squadra'],
  },

  /* ------------------------------------------------------------------ */
  /*  SIX PATHS SAGE DISCIPLES                                           */
  /* ------------------------------------------------------------------ */
  {
    id: 'faction-six-paths-sages',
    worldId: 'world-naruto',
    type: 'group',
    name: 'Six Paths Sage Disciples',
    description: {
      it: 'Naruto Uzumaki e Sasuke Uchiha come eredi del potere di Hagoromo Ōtsutsuki. Ricevono rispettivamente il Yang e lo Yin Chakra del Saggio dei Sei Percorsi per affrontare Kaguya.',
      en: "Naruto Uzumaki and Sasuke Uchiha as heirs to Hagoromo Ōtsutsuki's power. They receive the Sage of Six Paths' Yang and Yin Chakra respectively to face Kaguya.",
    },
    longDescription: {
      it: 'Hagoromo appare nello spirito durante la Quarta Guerra e conferisce a Naruto il Yang Chakra (Verità del Cerchio) e a Sasuke lo Yin Chakra (Rinne Sharingan). Questa investitura li rende i nuovi reincarnati di Asura e Indra, rispettivamente, e consente loro di sigillare Kaguya.',
      en: "Hagoromo appears in spirit during the Fourth War and confers upon Naruto the Yang Chakra (Truth-Seeking Orbs) and upon Sasuke the Yin Chakra (Rinne Sharingan). This investiture makes them the new reincarnations of Asura and Indra respectively, enabling them to seal Kaguya.",
    },
    signatureAbilities: ['Truth-Seeking Orbs', 'Rinne Sharingan', 'Saggio dei Sei Percorsi'],
    jutsuIds: ['jutsu-truth-seeker-orbs', 'jutsu-rinnegan'],
    leaderIds: ['char-hagoromo'],
    characterIds: ['char-naruto', 'char-sasuke', 'char-hagoromo'],
    arcIds: ['arc-fourth-war-climax'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['sei-percorsi', 'hagoromo', 'naruto', 'sasuke'],
  },

  /* ------------------------------------------------------------------ */
  /*  SOUND VILLAGE                                                       */
  /* ------------------------------------------------------------------ */
  {
    id: 'faction-sound-village',
    worldId: 'world-naruto',
    type: 'village',
    name: 'Hidden Sound Village',
    nameLocal: 'Otogakure no Sato',
    japaneseName: '音隠れの里',
    description: {
      it: 'Villaggio della nebbia fondato da Orochimaru come base sperimentale e laboratorio per le sue ricerche sui corpi e sulle tecniche proibite. Non riconosciuto ufficialmente come Grande Villaggio Nascosto.',
      en: "Village founded by Orochimaru as an experimental base and laboratory for his research into bodies and forbidden techniques. Not officially recognised as a Great Hidden Village.",
    },
    longDescription: {
      it: 'Otogakure non ha un territorio fisso: è più una rete di basi sotterranee e castelli nascosti che un villaggio tradizionale. La sua forza militare è composta da shinobi esperimentati da Orochimaru, portatori di sigilli maledetti. Il villaggio partecipò all\'attacco di Konoha durante la fase finale dell\'esame Chūnin.',
      en: "Otogakure has no fixed territory: it is more a network of underground bases and hidden castles than a traditional village. Its military force is composed of shinobi experimented on by Orochimaru, bearers of cursed seals. The village participated in the attack on Konoha during the final phase of the Chūnin Exam.",
    },
    signatureAbilities: ['Sigilli Maledetti', 'Sperimentazione sui corpi', 'Sound-based jutsu'],
    leaderIds: ['char-orochimaru'],
    characterIds: ['char-orochimaru', 'char-kabuto', 'char-kimimaro'],
    locationIds: ['loc-oto'],
    arcIds: ['arc-konoha-crush', 'arc-sasuke-retrieval'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['oto', 'orochimaru', 'villaggio', 'sperimentazione'],
  },

  /* ------------------------------------------------------------------ */
  /*  KARA (era Boruto)                                                  */
  /* ------------------------------------------------------------------ */
  {
    id: 'faction-kara',
    worldId: 'world-naruto',
    type: 'organization',
    name: 'Kara',
    nameLocal: 'Kara',
    japaneseName: '殻',
    description: {
      it: 'Organizzazione segreta dell\'era Boruto guidata da Jigen (vaso di Isshiki Ōtsutsuki). Riunisce membri "Inner" potenziati da modifiche cibernetiche e Strumenti Ninja Scientifici, con l\'obiettivo di coltivare un Albero Divino e i suoi Frutti del Chakra.',
      en: 'Secret organization of the Boruto era led by Jigen (vessel of Isshiki Ōtsutsuki). It gathers "Inner" members enhanced with cybernetic modifications and Scientific Ninja Tools, aiming to cultivate a God Tree and its Chakra Fruit.',
    },
    longDescription: {
      it: 'Kara ("guscio") è strutturata in un nucleo di "Inner" contrassegnati da numeri romani e da una rete di "Outer" infiltrati nelle nazioni. Dietro la facciata religiosa, il vero scopo di Isshiki è far rinascere il proprio clan sacrificando il pianeta. Lo scienziato Amado e il clone Kashin Koji complottano dall\'interno per rovesciarlo.',
      en: 'Kara ("husk") is structured around a core of "Inners" marked with Roman numerals and a network of "Outers" embedded across the nations. Behind its cult-like facade, Isshiki\'s true goal is to revive his clan by sacrificing the planet. The scientist Amado and the clone Kashin Koji scheme from within to overthrow him.',
    },
    signatureAbilities: ['Karma', 'Strumenti Ninja Scientifici', 'Modifiche cibernetiche'],
    leaderIds: ['char-isshiki'],
    characterIds: [
      'char-isshiki',
      'char-kashin-koji',
      'char-amado',
      'char-delta',
      'char-boro',
      'char-code',
      'char-kawaki',
    ],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['kara', 'boruto-era', 'organizzazione', 'otsutsuki'],
  },

  /* ------------------------------------------------------------------ */
  /*  DODICI NINJA GUARDIANI                                             */
  /* ------------------------------------------------------------------ */
  {
    id: 'faction-twelve-guardian-ninja',
    worldId: 'world-naruto',
    type: 'organization',
    name: 'Twelve Guardian Ninja',
    nameLocal: 'Ninja Guardiani dei Dodici',
    japaneseName: '守護忍十二士',
    nationId: 'nation-fire',
    description: {
      it: 'Corpo d\'élite di dodici shinobi scelti fra i migliori di Konoha per proteggere il Daimyō del Paese del Fuoco. Asuma Sarutobi ne fece parte prima di tornare al villaggio.',
      en: 'Elite unit of twelve shinobi chosen among Konoha\'s best to protect the Daimyō of the Land of Fire. Asuma Sarutobi served among them before returning to the village.',
    },
    longDescription: {
      it: 'I Dodici Ninja Guardiani vigilavano sulla corte del Feudatario del Fuoco. Diversi membri, fra cui Asuma e Chiriku, finirono nella lista delle taglie cacciata da Kakuzu dell\'Akatsuki per il valore del loro chakra.',
      en: 'The Twelve Guardian Ninja watched over the Fire Daimyō\'s court. Several members, including Asuma and Chiriku, ended up on the bounty list hunted by the Akatsuki\'s Kakuzu for their valuable chakra.',
    },
    signatureAbilities: ['Guardia del Daimyō', 'Chakra Blades (Asuma)'],
    characterIds: ['char-asuma'],
    locationIds: ['loc-konoha'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['konoha', 'fire-daimyo', 'guardiani', 'asuma'],
  },

  /* ------------------------------------------------------------------ */
  /*  ARMATA DI ZETSU BIANCHI                                            */
  /* ------------------------------------------------------------------ */
  {
    id: 'faction-white-zetsu-army',
    worldId: 'world-naruto',
    type: 'army',
    name: 'White Zetsu Army',
    nameLocal: 'Armata degli Zetsu Bianchi',
    japaneseName: '白ゼツの軍勢',
    description: {
      it: 'Esercito di cloni Zetsu Bianchi generati dall\'Albero Divino e plasmati con le cellule di Hashirama, schierato da Madara e Obito nella Quarta Guerra Ninja.',
      en: 'Army of White Zetsu clones produced by the God Tree and shaped with Hashirama\'s cells, fielded by Madara and Obito in the Fourth Shinobi World War.',
    },
    longDescription: {
      it: 'Gli Zetsu Bianchi sono originariamente vittime umane assimilate dall\'Albero Divino di Kaguya. Capaci di trasformarsi e mimetizzarsi, infiltrarono l\'Alleanza Shinobi assumendo l\'aspetto dei soldati caduti.',
      en: 'The White Zetsu are originally human victims absorbed by Kaguya\'s God Tree. Able to transform and camouflage, they infiltrated the Shinobi Alliance by taking the forms of fallen soldiers.',
    },
    signatureAbilities: ['Trasformazione', 'Mimetismo', 'Fusione con il terreno'],
    leaderIds: ['char-madara', 'char-obito'],
    characterIds: ['char-zetsu'],
    arcIds: ['arc-fourth-war'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['fourth-war', 'zetsu', 'god-tree', 'esercito'],
  },

  /* ------------------------------------------------------------------ */
  /*  CLAN FUNATO (era Boruto · Funato War)                              */
  /* ------------------------------------------------------------------ */
  {
    id: 'faction-funato',
    worldId: 'world-naruto',
    type: 'clan',
    name: 'Funato Clan',
    nameLocal: 'Funato Ikka',
    japaneseName: '舟戸一家',
    nationId: 'nation-water',
    description: {
      it: 'Clan di pirati del Paese dell\'Acqua che si ribella a Kirigakure per il controllo dei mari durante l\'era Boruto.',
      en: 'A pirate clan of the Land of Water that rebels against Kirigakure for control of the seas during the Boruto era.',
    },
    longDescription: {
      it: 'Guidati dal patriarca Araumi, i Funato scatenano la "Guerra dei Funato" contro il Sesto Mizukage Chōjurō. Dominano la navigazione e usano bestie marine e artiglieria navale.',
      en: 'Led by patriarch Araumi, the Funato wage the "Funato War" against the Sixth Mizukage Chōjurō. They dominate seafaring and deploy sea beasts and naval artillery.',
    },
    leaderIds: ['char-araumi'],
    characterIds: ['char-araumi', 'char-isari', 'char-kobuna'],
    arcIds: ['arc-funato-war'],
    canonStatus: 'anime_only',
    referenceStatus: 'verified',
    tags: ['boruto-era', 'water', 'pirates', 'funato'],
  },

  /* ------------------------------------------------------------------ */
  /*  CULTO DI JASHIN                                                    */
  /* ------------------------------------------------------------------ */
  {
    id: 'faction-jashin-cult',
    worldId: 'world-naruto',
    type: 'organization',
    name: 'Cult of Jashin',
    nameLocal: 'Jashin-kyō',
    japaneseName: 'ジャシン教',
    description: {
      it: 'Religione che venera il dio malvagio Jashin e predica la morte totale come unica forma di completamento. Hidan dell\'Akatsuki ne è il fedele più noto.',
      en: 'A religion worshipping the evil god Jashin, preaching total death as the only true completion. The Akatsuki\'s Hidan is its most notorious devotee.',
    },
    longDescription: {
      it: 'I seguaci più devoti, come Hidan, ottengono una pseudo-immortalità tramite rituali di sangue che legano la propria vita a quella della vittima. Diffuso nel Paese degli Acquazzoni.',
      en: 'Its most devoted followers, like Hidan, gain a pseudo-immortality through blood rituals that bind their life to the victim\'s. Rooted in the Land of Hot Water.',
    },
    leaderIds: ['char-hidan'],
    characterIds: ['char-hidan'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['religion', 'hidan', 'immortality'],
  },

  /* ------------------------------------------------------------------ */
  /*  KAMINARIMON COMPANY (era Boruto)                                   */
  /* ------------------------------------------------------------------ */
  {
    id: 'faction-kaminarimon',
    worldId: 'world-naruto',
    type: 'organization',
    name: 'Kaminarimon Company',
    nameLocal: 'Kaminarimon Konpanī',
    japaneseName: '雷門カンパニー',
    nationId: 'nation-fire',
    villageLocationId: 'loc-konoha',
    description: {
      it: 'Grande conglomerato tecnologico di Konoha nell\'era Boruto, simbolo dell\'industrializzazione del villaggio. Famiglia di Denki Kaminarimon.',
      en: 'A major technology conglomerate of Konoha in the Boruto era, a symbol of the village\'s industrialization. The family business of Denki Kaminarimon.',
    },
    characterIds: ['char-denki'],
    locationIds: ['loc-konoha'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['boruto-era', 'konoha', 'technology', 'company'],
  },
];
