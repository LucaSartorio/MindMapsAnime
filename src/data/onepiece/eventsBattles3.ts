import type { TimelineEvent } from '@/types';

/**
 * Ulteriori scontri «X vs Y» a completamento della timeline: duelli iconici delle
 * saghe che mancavano ancora (Baratie, Drum, Skypiea, Water Seven, Thriller Bark,
 * Punk Hazard, Dressrosa, Whole Cake, Wano…). Referenziano solo personaggi e
 * luoghi già presenti nel dataset.
 */
const B = (
  id: string, tit: string, ten: string, pit: string, pen: string,
  loc: string, chars: string[], manga: string[], anime: string[], order: number,
  sit: string, sen: string, lit: string, len: string, tags: string[], arcId?: string,
): TimelineEvent => ({
  id, worldId: 'world-onepiece',
  title: { it: tit, en: ten },
  description: { it: sit, en: sen },
  longDescription: { it: lit, en: len },
  period: { it: pit, en: pen },
  ...(arcId ? { arcId } : {}),
  locationId: loc, characterIds: chars,
  mangaChapters: manga, animeEpisodes: anime, order,
  canon: 'canon', canonStatus: 'canon', referenceStatus: 'verified',
  tags: ['scontro', ...tags],
});

export const onepieceEventsBattles3: TimelineEvent[] = [
  /* ============================ East Blue ============================ */
  B('evt-op-fight-zoro-mihawk', 'Zoro vs Dracule Mihawk', 'Zoro vs Dracule Mihawk', 'East Blue · Baratie', 'East Blue · Baratie',
    'loc-op-baratie', ['char-op-zoro', 'char-op-mihawk'], ['50-52'], ['24-25'], 7.5,
    "Al Baratie Zoro sfida il più grande spadaccino del mondo Mihawk e subisce la prima, cocente sconfitta.",
    "At the Baratie Zoro challenges the world's greatest swordsman Mihawk and suffers his first, bitter defeat.",
    "Per dimostrare di poter diventare il più forte, Zoro affronta Mihawk, che lo umilia con una sola, piccola lama; sfregiato al petto, Zoro giura davanti a Rufy di non perdere mai più, segnando l'inizio del suo cammino.",
    "To prove he can become the strongest, Zoro faces Mihawk, who humbles him with a single tiny blade; scarred across the chest, Zoro swears before Luffy never to lose again, marking the start of his path.",
    ['east-blue', 'mihawk', 'spadaccino'], 'arc-op-baratie'),
  B('evt-op-fight-luffy-don-krieg', 'Rufy vs Don Krieg', 'Luffy vs Don Krieg', 'East Blue · Baratie', 'East Blue · Baratie',
    'loc-op-baratie', ['char-op-luffy', 'char-op-don-krieg'], ['62-68'], ['29-30'], 7.6,
    "Rufy difende il Baratie dall'armata corazzata di Don Krieg, il pirata più crudele di East Blue.",
    "Luffy defends the Baratie from Don Krieg's armored fleet, the cruelest pirate of East Blue.",
    "Reduce dal naufragio nella Rotta Maggiore, Don Krieg ripaga l'ospitalità del Baratie tentando di rubarlo con il suo arsenale di armi nascoste; Rufy lo affronta in mare e, incassando bombe e lame, lo schianta nell'acqua salvando il ristorante galleggiante.",
    "Back from his shipwreck on the Grand Line, Don Krieg repays the Baratie's hospitality by trying to steal it with his arsenal of hidden weapons; Luffy faces him at sea and, taking bombs and blades, slams him into the water, saving the floating restaurant.",
    ['east-blue', 'don-krieg'], 'arc-op-baratie'),

  /* ============================ Drum Island ============================ */
  B('evt-op-fight-luffy-wapol', 'Rufy vs Wapol', 'Luffy vs Wapol', 'Paradise · Drum', 'Paradise · Drum',
    'loc-op-drum-island', ['char-op-luffy', 'char-op-wapol'], ['148-153'], ['85-88'], 12.5,
    "Rufy scaccia il tiranno Wapol dal regno di Drum con un solo, gigantesco pugno gonfiato a pistola.",
    "Luffy drives the tyrant Wapol from the Drum Kingdom with a single, giant balloon-pumped punch.",
    "Tornato per riprendersi con la forza il regno che aveva abbandonato, il re-mangiatutto Wapol viene affrontato da Rufy: con il «Bazooka» della sua nuova tecnica a gomma gonfiata, lo scaglia oltre l'orizzonte, ridando libertà alla gente delle nevi.",
    "Returned to seize back by force the kingdom he had abandoned, the eat-everything king Wapol is faced by Luffy: with the 'Bazooka' of his new balloon-rubber technique, he launches him beyond the horizon, giving the snow country's people their freedom back.",
    ['drum', 'wapol'], 'arc-op-drum'),

  /* ============================== Skypiea ============================== */
  B('evt-op-fight-luffy-enel', 'Rufy vs «Dio» Enel', "Luffy vs 'God' Enel", 'Paradise · Skypiea', 'Paradise · Skypiea',
    'loc-op-upper-yard', ['char-op-luffy', 'char-op-enel'], ['294-297'], ['190-195'], 16.9,
    "Sull'arca Maxim, l'unico immune ai fulmini — Rufy di gomma — affronta il «Dio» Enel per salvare l'isola del cielo.",
    "Aboard the Maxim ark, the only one immune to lightning — the rubber Luffy — faces 'God' Enel to save the sky island.",
    "Mentre Enel vuole incenerire Skypiea e raggiungere la «terra senza fine», Rufy scopre che il suo corpo di gomma annulla il Frutto Fulmine: con un pugno d'oro colossale abbatte il falso dio e fa suonare di nuovo la campana d'oro di Shandora.",
    "As Enel aims to incinerate Skypiea and reach the 'endless land', Luffy finds his rubber body nullifies the Rumble-Rumble Fruit: with a colossal golden punch he downs the false god and rings Shandora's golden bell once again.",
    ['skypiea', 'enel'], 'arc-op-skypiea'),

  /* ======================= Long Ring Long Land ======================= */
  B('evt-op-fight-luffy-aokiji', 'Rufy vs Aokiji', 'Luffy vs Aokiji', 'Paradise · Long Ring Long Land', 'Paradise · Long Ring Long Land',
    'loc-op-long-ring-long-land', ['char-op-luffy', 'char-op-aokiji'], ['319-321'], ['225-227'], 18.3,
    "L'ammiraglio Aokiji intercetta la ciurma e mette Rufy davanti alla schiacciante potenza della Marina.",
    "Admiral Aokiji intercepts the crew and shows Luffy the crushing power of the Marines.",
    "Venuto a giudicare di persona Nico Robin, l'ammiraglio del ghiaccio Aokiji congela Rufy in pochi istanti: il capitano scopre per la prima volta l'abisso che lo separa dai vertici del mondo, in uno scontro che lo segnerà.",
    "Come to judge Nico Robin in person, the ice admiral Aokiji freezes Luffy in moments: the captain glimpses for the first time the gulf separating him from the world's strongest, in a clash that will leave its mark.",
    ['long-ring', 'aokiji', 'ammiragli'], 'arc-op-long-ring'),

  /* ========================= Water Seven ========================= */
  B('evt-op-fight-luffy-usopp', 'Rufy vs Usop: il duello', 'Luffy vs Usopp: the duel', 'Paradise · Water Seven', 'Paradise · Water Seven',
    'loc-op-water-seven', ['char-op-luffy', 'char-op-usopp'], ['331-333'], ['236-237'], 18.6,
    "Sul molo di Water Seven Rufy e Usop si sfidano a duello per il destino della Going Merry e dell'amicizia.",
    "On the Water Seven docks Luffy and Usopp duel over the fate of the Going Merry and their friendship.",
    "Ferito dalla decisione di abbandonare la Going Merry, Usop sfida il proprio capitano: in un doloroso duello tra compagni, Rufy lo batte rispettandone l'orgoglio, in uno strappo che si ricucirà soltanto a Enies Lobby.",
    "Hurt by the decision to abandon the Going Merry, Usopp challenges his own captain: in a painful duel between comrades, Luffy beats him while honoring his pride, a rift that will only heal at Enies Lobby.",
    ['water-seven', 'usop'], 'arc-op-water-seven'),

  /* ========================== Enies Lobby ========================== */
  B('evt-op-fight-luffy-lucci', 'Rufy vs Rob Lucci', 'Luffy vs Rob Lucci', 'Paradise · Enies Lobby', 'Paradise · Enies Lobby',
    'loc-op-enies-lobby', ['char-op-luffy', 'char-op-lucci'], ['419-427'], ['305-312'], 20.5,
    "Per riprendersi Robin, Rufy affronta il più forte agente della CP9, Rob Lucci, e il suo Zoan del leopardo.",
    "To take Robin back, Luffy faces the strongest CP9 agent, Rob Lucci, and his leopard Zoan.",
    "Nel duello decisivo di Enies Lobby, Rufy spinge il Gear Second e il Gear Third oltre ogni limite contro la potenza letale di Lucci; svenuto in piedi, trova la forza per un ultimo «Bazooka» a raffica e abbatte l'agente, riprendendosi Nico Robin.",
    "In the decisive Enies Lobby duel, Luffy pushes Gear Second and Gear Third past every limit against Lucci's lethal power; fainting on his feet, he finds the strength for one last barrage 'Bazooka' and downs the agent, reclaiming Nico Robin.",
    ['enies-lobby', 'cp9', 'lucci'], 'arc-op-enies-lobby'),

  /* ========================= Thriller Bark ========================= */
  B('evt-op-fight-luffy-moria', 'Rufy vs Gecko Moria', 'Luffy vs Gecko Moria', 'Paradise · Thriller Bark', 'Paradise · Thriller Bark',
    'loc-op-thriller-bark', ['char-op-luffy', 'char-op-moria'], ['473-482'], ['363-372'], 26.0,
    "Per riprendersi le ombre rubate, Rufy affronta il Corsaro Gecko Moria e il suo esercito di zombie.",
    "To reclaim the stolen shadows, Luffy faces the Warlord Gecko Moria and his army of zombies.",
    "Recuperate cento ombre dei propri compagni e nemici, Rufy gonfia il corpo fino alla forma «Nightmare Luffy» e travolge Moria, che si nasconde tra mille ombre rubate; all'alba la sua sconfitta libera Thriller Bark e restituisce le ombre ai prigionieri.",
    "Having absorbed a hundred shadows of friends and foes, Luffy bloats his body into 'Nightmare Luffy' and overwhelms Moria, who hides among a thousand stolen shadows; at dawn his defeat frees Thriller Bark and returns the shadows to the captives.",
    ['thriller-bark', 'moria'], 'arc-op-thriller-bark'),

  /* ============================ Marineford ============================ */
  B('evt-op-fight-crocodile-whitebeard', 'Crocodile vs Barbabianca', 'Crocodile vs Whitebeard', 'Red Line · Marineford', 'Red Line · Marineford',
    'loc-op-marineford', ['char-op-crocodile', 'char-op-whitebeard'], ['561-564'], ['469-472'], 40.5,
    "Liberato da Impel Down, Crocodile sceglie di rivolgere il Frutto Sabbia contro la Marina e sfida persino Barbabianca.",
    "Freed from Impel Down, Crocodile turns the Sand Fruit against the Marines and even challenges Whitebeard.",
    "Con vecchi conti in sospeso, l'ex Corsaro Crocodile tenta di colpire Barbabianca nel caos di Marineford, ma viene fermato da Jozu; ironia della guerra, finisce per combattere fianco a fianco con i pirati contro il Governo Mondiale.",
    "With old scores to settle, the former Warlord Crocodile tries to strike Whitebeard amid the Marineford chaos but is stopped by Jozu; in the irony of war, he ends up fighting alongside the pirates against the World Government.",
    ['marineford', 'crocodile', 'barbabianca'], 'arc-op-marineford'),

  /* ===================== Akainu vs Aokiji (Punk Hazard) ===================== */
  B('evt-op-fight-akainu-aokiji', 'Akainu vs Aokiji', 'Akainu vs Aokiji', 'Backstory · Punk Hazard', 'Backstory · Punk Hazard',
    'loc-op-punk-hazard', ['char-op-akainu', 'char-op-aokiji'], ['594'], ['510'], 42.0,
    "Per decidere chi guiderà la Marina dopo la guerra, Akainu e Aokiji si battono per dieci giorni su Punk Hazard.",
    "To decide who will lead the Marines after the war, Akainu and Aokiji battle for ten days on Punk Hazard.",
    "Promossi entrambi candidati al grado di Grand'Ammiraglio, il magma di Akainu e il ghiaccio di Aokiji si scontrano in un duello leggendario che dura dieci giorni e spezza in due il clima dell'isola; Akainu vince, Aokiji lascia la Marina e Punk Hazard resta per sempre divisa tra fuoco e gelo.",
    "Both named candidates for Fleet Admiral, Akainu's magma and Aokiji's ice clash in a legendary ten-day duel that splits the island's climate in two; Akainu wins, Aokiji leaves the Marines, and Punk Hazard is forever divided between fire and frost.",
    ['punk-hazard', 'akainu', 'aokiji', 'ammiragli']),

  /* ============================ Punk Hazard ============================ */
  B('evt-op-fight-sanji-vergo', 'Sanji vs Vergo', 'Sanji vs Vergo', 'New World · Punk Hazard', 'New World · Punk Hazard',
    'loc-op-punk-hazard', ['char-op-sanji', 'char-op-vergo'], ['676-678'], ['603-606'], 61.5,
    "Sul ponte di Punk Hazard Sanji affronta a calci la spia di Doflamingo Vergo, maestro d'Ambizione.",
    "On the Punk Hazard bridge Sanji takes on Doflamingo's spy Vergo, a Haki master, with his kicks.",
    "Per coprire la fuga dei bambini e di Nami, Sanji incrocia i suoi calci infuocati con l'Ambizione di Vergo; pur senza vincere, lo trattiene abbastanza da spezzare i piani del laboratorio, prima che Law chiuda i conti con la spia.",
    "To cover the escape of the children and Nami, Sanji crosses his flaming kicks with Vergo's Haki; though he doesn't win, he holds him long enough to disrupt the lab's plans, before Law settles the score with the spy.",
    ['punk-hazard', 'sanji', 'vergo'], 'arc-op-punk-hazard'),
  B('evt-op-fight-smoker-vergo', 'Smoker vs Vergo', 'Smoker vs Vergo', 'New World · Punk Hazard', 'New World · Punk Hazard',
    'loc-op-punk-hazard', ['char-op-smoker', 'char-op-vergo'], ['679-684'], ['606-610'], 61.55,
    "Il commodoro Smoker scopre il traditore Vergo nella Marina e lo affronta per recuperare il cuore di Law.",
    "Commodore Smoker uncovers the traitor Vergo within the Marines and fights him to recover Law's heart.",
    "Quando capisce che Vergo è una spia dei Donquijote infiltrata nella G-5, Smoker lo affronta con il suo Frutto Fumo e il manganello d'acciaio marino, ma l'Ambizione del nemico ha la meglio: a salvarlo arriverà Law, che riprende il proprio cuore.",
    "Realizing Vergo is a Donquixote spy embedded in G-5, Smoker fights him with his Smoke Fruit and Seastone jutte, but the enemy's Haki prevails: Law will save him, retaking his own heart.",
    ['punk-hazard', 'smoker', 'vergo'], 'arc-op-punk-hazard'),

  /* ============================ Dressrosa ============================ */
  B('evt-op-fight-sabo-burgess', 'Sabo vs Burgess', 'Sabo vs Burgess', 'New World · Dressrosa', 'New World · Dressrosa',
    'loc-op-dressrosa', ['char-op-sabo', 'char-op-burgess'], ['731-739'], ['680-686'], 62.5,
    "Travestito da Lucy al Colosseo Corrida, Sabo affronta il campione dei Pirati di Barbanera Jesus Burgess.",
    "Disguised as Lucy at the Corrida Colosseum, Sabo faces the Blackbeard Pirates' champion, Jesus Burgess.",
    "Sostituito Rufy nel torneo per il Frutto Fiamma, Sabo respinge l'irruenza di Burgess e ne smaschera la missione per conto di Barbanera; conquistato il Mera Mera no Mi, eredita il potere del fratello Ace davanti agli occhi del mondo.",
    "Having replaced Luffy in the tournament for the Flame Fruit, Sabo repels Burgess's fury and exposes his mission for Blackbeard; winning the Mera Mera no Mi, he inherits his brother Ace's power before the eyes of the world.",
    ['dressrosa', 'sabo', 'burgess', 'colosseo'], 'arc-op-dressrosa'),
  B('evt-op-fight-kyros-diamante', 'Kyros vs Diamante', 'Kyros vs Diamante', 'New World · Dressrosa', 'New World · Dressrosa',
    'loc-op-dressrosa', ['char-op-kyros', 'char-op-diamante'], ['743-749'], ['695-702'], 63.6,
    "Il leggendario gladiatore Kyros affronta Diamante, l'uomo che uccise sua moglie Scarlett, nell'arena di Dressrosa.",
    "The legendary gladiator Kyros faces Diamante, the man who killed his wife Scarlett, in the Dressrosa arena.",
    "Liberato dalla maledizione del Frutto Giocattolo, l'ex gladiatore Kyros chiude i conti di dieci anni di tirannia: con una sola gamba affronta l'ufficiale Diamante per vendicare Scarlett e proteggere la figlia Rebecca, abbattendolo nello stadio.",
    "Freed from the Hobby Fruit's curse, the former gladiator Kyros settles ten years of tyranny: with a single leg he faces officer Diamante to avenge Scarlett and protect his daughter Rebecca, cutting him down in the stadium.",
    ['dressrosa', 'kyros', 'donquijote'], 'arc-op-dressrosa'),

  /* ======================= Whole Cake Island ======================= */
  B('evt-op-fight-luffy-katakuri', 'Rufy vs Katakuri', 'Luffy vs Katakuri', 'New World · Whole Cake Island', 'New World · Whole Cake Island',
    'loc-op-whole-cake-island', ['char-op-luffy', 'char-op-katakuri'], ['882-896'], ['850-871'], 66.5,
    "Nella Sala degli Specchi Rufy affronta l'imbattuto Comandante dei Dolci Katakuri, maestro dell'Ambizione dell'Osservazione.",
    "In the Mirro-World Luffy faces the undefeated Sweet Commander Katakuri, master of Observation Haki.",
    "Il più forte dei comandanti di Big Mom prevede ogni mossa di Rufy con un'Ambizione che vede nel futuro; per stargli al passo Rufy affina il proprio Haki e raggiunge il Gear Fourth «Snakeman», fino a battere Katakuri in un duello d'onore che entrambi affrontano in piedi e da pari.",
    "Big Mom's strongest commander foresees Luffy's every move with a Haki that sees the future; to keep up, Luffy hones his own Haki and reaches Gear Fourth 'Snakeman', finally beating Katakuri in a duel of honor both face standing and as equals.",
    ['whole-cake', 'katakuri', 'gear-fourth'], 'arc-op-whole-cake'),

  /* ============================== Wano ============================== */
  B('evt-op-fight-oden-kaido', 'Oden vs Kaido', 'Oden vs Kaido', 'Backstory · Wano', 'Backstory · Wano',
    'loc-op-kuri', ['char-op-oden', 'char-op-kaido'], ['969-972'], ['972-975'], 63.9,
    "Vent'anni prima, il daimyo Kozuki Oden sfida l'Imperatore Kaido per liberare Wano dalla sua tirannia.",
    "Twenty years earlier, daimyo Kozuki Oden challenges Emperor Kaido to free Wano from his tyranny.",
    "Alla testa dei suoi nove vassalli, Oden ferisce Kaido come nessun altro era riuscito a fare; tradito e catturato, affronta il supplizio del calderone bollente reggendo i compagni sulle spalle, e con la sua morte semina la promessa di una rivolta vent'anni dopo.",
    "At the head of his nine retainers, Oden wounds Kaido as no one else had managed; betrayed and captured, he endures the boiling-cauldron execution holding his comrades on his shoulders, and with his death sows the promise of a revolt twenty years later.",
    ['wano', 'kozuki', 'kaido'], 'arc-op-wano'),
  B('evt-op-fight-sanji-page-one', 'Sanji vs Page One', 'Sanji vs Page One', 'New World · Wano', 'New World · Wano',
    'loc-op-wano', ['char-op-sanji', 'char-op-page-one'], ['930-933'], ['921-924'], 66.7,
    "Per proteggere Otama e Komurasaki, Sanji affronta il Tobiroppo Page One e il suo Zoan dello spinosauro nella Capitale dei Fiori.",
    "To protect Otama and Komurasaki, Sanji faces the Tobiroppo Page One and his spinosaurus Zoan in the Flower Capital.",
    "Quando il dinosauro-SMILE Page One minaccia gli amici, Sanji indossa il Raid Suit invisibile costruito da Judge e lo abbatte con i suoi calci, costretto però a rivelare il proprio legame con la famiglia Vinsmoke davanti a Wano.",
    "When the SMILE-dinosaur Page One threatens his friends, Sanji dons the invisible Raid Suit built by Judge and downs him with his kicks, though forced to reveal his ties to the Vinsmoke family before Wano.",
    ['wano', 'sanji', 'tobiroppo'], 'arc-op-wano'),
];
