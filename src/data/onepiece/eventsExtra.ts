import type { TimelineEvent } from '@/types';

/**
 * Eventi "atomici" aggiuntivi: spezzano i grandi archi nei loro passaggi chiave
 * (es. la Guerra al Vertice in più momenti separati). Gli `order` usano valori
 * frazionari per inserirsi tra gli eventi-cardine già definiti negli altri file.
 * Ogni evento porta i capitoli del manga e gli episodi dell'anime.
 */
const c = 'canon' as const;
const v = 'verified' as const;
const W = 'world-onepiece';

export const onepieceEventsExtra: TimelineEvent[] = [
  /* ============================ East Blue ============================ */
  {
    id: 'evt-op-rd-gomu-gomu', worldId: W,
    title: { it: 'Rufy mangia il Frutto Gom Gom', en: 'Luffy eats the Gum-Gum Fruit' },
    description: {
      it: "Da bambino, a Foosha, Rufy mangia per sbaglio il Frutto del Diavolo Gom Gom lasciato dai Pirati del Rosso: il suo corpo diventa di gomma, ma perde per sempre la capacità di nuotare.",
      en: "As a child at Foosha, Luffy accidentally eats the Gum-Gum Devil Fruit left by the Red-Hair Pirates: his body turns to rubber, but he loses the ability to swim forever.",
    },
    period: { it: 'East Blue', en: 'East Blue' },
    arcId: 'arc-op-romance-dawn', locationId: 'loc-op-foosha-village',
    characterIds: ['char-op-luffy', 'char-op-shanks'], factionIds: ['faction-op-red-hair-pirates'],
    mangaChapters: ['1'], animeEpisodes: ['1', '4'],
    order: 0.5, canon: c, canonStatus: c, referenceStatus: v, tags: ['east-blue', 'gom-gom'],
  },
  {
    id: 'evt-op-rd-coby-alvida', worldId: W,
    title: { it: 'Coby e la caduta di Alvida', en: "Coby and Alvida's fall" },
    description: {
      it: "Salpato da solo, Rufy finisce sulla nave della piratessa Alvida e fa amicizia con il timido mozzo Coby, che sogna di entrare in Marina. Rufy abbatte Alvida e i due fuggono verso Shells Town.",
      en: "Setting off alone, Luffy ends up on the pirate Alvida's ship and befriends the timid cabin boy Coby, who dreams of joining the Marines. Luffy beats Alvida and the two flee toward Shells Town.",
    },
    period: { it: 'East Blue', en: 'East Blue' },
    arcId: 'arc-op-romance-dawn', locationId: 'loc-op-shells-town',
    characterIds: ['char-op-luffy', 'char-op-coby'], factionIds: ['faction-op-straw-hat-pirates'],
    mangaChapters: ['1-2'], animeEpisodes: ['1-2'],
    order: 2.5, canon: c, canonStatus: c, referenceStatus: v, tags: ['east-blue', 'coby', 'alvida'],
  },
  {
    id: 'evt-op-baratie-sanji-intro', worldId: W,
    title: { it: 'Sanji e il debito con Zeff', en: "Sanji and his debt to Zeff" },
    description: {
      it: "Sul Baratie il cuoco Sanji nutre di nascosto chiunque abbia fame, anche i nemici: un flashback rivela come Zeff gli salvò la vita dandogli tutto il cibo su uno scoglio deserto.",
      en: "On the Baratie the cook Sanji secretly feeds anyone who is hungry, even enemies: a flashback reveals how Zeff saved his life by giving him all the food on a barren rock.",
    },
    period: { it: 'East Blue', en: 'East Blue' },
    arcId: 'arc-op-baratie', locationId: 'loc-op-baratie',
    characterIds: ['char-op-sanji', 'char-op-zeff'], factionIds: ['faction-op-straw-hat-pirates'],
    mangaChapters: ['43-68'], animeEpisodes: ['20-30'],
    order: 6.5, canon: c, canonStatus: c, referenceStatus: v, tags: ['east-blue', 'sanji', 'zeff'],
  },
  {
    id: 'evt-op-arlong-nami-past', worldId: W,
    title: { it: 'Il passato di Nami e Bell-mère', en: "Nami and Bell-mère's past" },
    description: {
      it: "Un flashback svela come la marine Bell-mère adottò Nami e Nojiko e fu uccisa da Arlong, e come Nami fu costretta a disegnare mappe per la sua banda pur di ricomprare il villaggio.",
      en: "A flashback reveals how the Marine Bell-mère adopted Nami and Nojiko and was killed by Arlong, and how Nami was forced to draw maps for his gang to buy back her village.",
    },
    period: { it: 'East Blue', en: 'East Blue' },
    arcId: 'arc-op-arlong-park', locationId: 'loc-op-cocoyashi-village',
    characterIds: ['char-op-nami', 'char-op-bellemere', 'char-op-arlong'], factionIds: ['faction-op-arlong-pirates'],
    mangaChapters: ['77-79'], animeEpisodes: ['37-39'],
    order: 8.5, canon: c, canonStatus: c, referenceStatus: v, tags: ['east-blue', 'nami', 'bell-mere'],
  },
  {
    id: 'evt-op-loguetown-zoro-swords', worldId: W,
    title: { it: 'Le nuove spade di Zoro e Tashigi', en: "Zoro's new swords and Tashigi" },
    description: {
      it: "A Loguetown Zoro acquista due nuove lame, tra cui la maledetta Sandai Kitetsu, e incontra il sergente Tashigi, sosia della sua amica d'infanzia Kuina, prima dell'arrivo di Smoker.",
      en: "At Loguetown Zoro buys two new blades, including the cursed Sandai Kitetsu, and meets Sergeant Tashigi, the spitting image of his childhood friend Kuina, before Smoker arrives.",
    },
    period: { it: 'East Blue', en: 'East Blue' },
    arcId: 'arc-op-loguetown', locationId: 'loc-op-loguetown',
    characterIds: ['char-op-zoro', 'char-op-tashigi', 'char-op-smoker'], factionIds: ['faction-op-marines'],
    mangaChapters: ['97-98'], animeEpisodes: ['48-49'],
    order: 10.5, canon: c, canonStatus: c, referenceStatus: v, tags: ['east-blue', 'zoro', 'tashigi'],
  },

  /* ====================== Whisky Peak / Little Garden ====================== */
  {
    id: 'evt-op-whisky-peak', worldId: W,
    title: { it: 'Whisky Peak e la Baroque Works', en: 'Whisky Peak and Baroque Works' },
    description: {
      it: "La «città dell'accoglienza» di Whisky Peak è una trappola di cacciatori di taglie della Baroque Works. Zoro li sgomina e si scopre che la regina Vivi e Igaram indagano in incognito sull'organizzazione di Crocodile.",
      en: "Whisky Peak, the 'town of welcome', is a trap of Baroque Works bounty hunters. Zoro routs them, and it is revealed that Princess Vivi and Igaram are investigating Crocodile's organisation undercover.",
    },
    period: { it: 'Paradise · Saga di Alabasta', en: 'Paradise · Alabasta Saga' },
    arcId: 'arc-op-alabasta', locationId: 'loc-op-whisky-peak',
    characterIds: ['char-op-zoro', 'char-op-vivi', 'char-op-nami'], factionIds: ['faction-op-baroque-works'],
    mangaChapters: ['106-114'], animeEpisodes: ['64-67'],
    order: 12.2, canon: c, canonStatus: c, referenceStatus: v, tags: ['paradise', 'whisky-peak', 'vivi'],
  },
  {
    id: 'evt-op-little-garden', worldId: W,
    title: { it: 'Little Garden: i giganti Dorry e Brogy', en: 'Little Garden: the giants Dorry and Brogy' },
    description: {
      it: "Sull'isola preistorica di Little Garden la ciurma incontra i giganti Dorry e Brogy, duellanti da cent'anni, e sventa i piani di Mr. 3 della Baroque Works che cerca di pietrificarli.",
      en: "On the prehistoric island of Little Garden the crew meets the giants Dorry and Brogy, who have dueled for a hundred years, and foils Baroque Works' Mr. 3, who tries to petrify them.",
    },
    period: { it: 'Paradise · Saga di Alabasta', en: 'Paradise · Alabasta Saga' },
    arcId: 'arc-op-alabasta', locationId: 'loc-op-little-garden',
    characterIds: ['char-op-luffy', 'char-op-vivi'], factionIds: ['faction-op-baroque-works'],
    mangaChapters: ['115-129'], animeEpisodes: ['70-77'],
    order: 12.4, canon: c, canonStatus: c, referenceStatus: v, tags: ['paradise', 'little-garden', 'giganti'],
  },

  /* ============================ Drum Island ============================ */
  {
    id: 'evt-op-drum-wapol', worldId: W,
    title: { it: 'La caduta del tiranno Wapol', en: "The fall of the tyrant Wapol" },
    description: {
      it: "Tornato per riprendersi Drum, il re Wapol viene umiliato e spazzato via dal «Gom Gom Bazooka» di Rufy. Il regno torna libero e prende il nome di Sakura, in onore dell'illusione di fiori di Hiluluk e Chopper.",
      en: "Returning to reclaim Drum, King Wapol is humiliated and blasted away by Luffy's 'Gum-Gum Bazooka'. The kingdom is freed and renamed Sakura, in honour of Hiluluk and Chopper's blossom illusion.",
    },
    period: { it: 'Paradise · Drum Island', en: 'Paradise · Drum Island' },
    arcId: 'arc-op-drum', locationId: 'loc-op-drum-island',
    characterIds: ['char-op-luffy', 'char-op-wapol', 'char-op-dalton'], factionIds: ['faction-op-wapol-pirates'],
    mangaChapters: ['147-149'], animeEpisodes: ['88-90'],
    order: 13.5, canon: c, canonStatus: c, referenceStatus: v, tags: ['drum', 'wapol', 'sakura'],
  },

  /* ============================ Alabasta ============================ */
  {
    id: 'evt-op-al-rainbase', worldId: W,
    title: { it: 'La trappola di Rain Dinners', en: 'The Rain Dinners trap' },
    description: {
      it: "A Rainbase, Crocodile intrappola la ciurma nella gabbia del suo casinò Rain Dinners insieme a Smoker. Sopraffatto, Rufy è salvato dalla sabbia e da Vivi, mentre comincia la corsa verso Alubarna.",
      en: "At Rainbase, Crocodile traps the crew in the cage of his Rain Dinners casino along with Smoker. Overpowered, Luffy is saved by the sand and by Vivi as the race to Alubarna begins.",
    },
    period: { it: 'Paradise · Alabasta', en: 'Paradise · Alabasta' },
    arcId: 'arc-op-alabasta', locationId: 'loc-op-rainbase',
    characterIds: ['char-op-luffy', 'char-op-crocodile', 'char-op-smoker', 'char-op-vivi'], factionIds: ['faction-op-baroque-works'],
    mangaChapters: ['170-181'], animeEpisodes: ['102-110'],
    order: 14.4, canon: c, canonStatus: c, referenceStatus: v, tags: ['alabasta', 'crocodile', 'rainbase'],
  },
  {
    id: 'evt-op-al-pell-sacrifice', worldId: W,
    title: { it: 'Il sacrificio di Pell', en: "Pell's sacrifice" },
    description: {
      it: "Per salvare Alubarna, la guardia reale Pell, uomo-falco, vola in cielo con la bomba della Baroque Works e la fa esplodere lontano dalla folla, sopravvivendo per miracolo.",
      en: "To save Alubarna, the royal guard Pell, a falcon-man, flies skyward with Baroque Works' bomb and detonates it far from the crowd, surviving by a miracle.",
    },
    period: { it: 'Paradise · Alabasta', en: 'Paradise · Alabasta' },
    arcId: 'arc-op-alabasta', locationId: 'loc-op-alubarna',
    characterIds: ['char-op-pell', 'char-op-vivi', 'char-op-cobra'],
    mangaChapters: ['209-211'], animeEpisodes: ['126-127'],
    order: 15.5, canon: c, canonStatus: c, referenceStatus: v, tags: ['alabasta', 'pell'],
  },
  {
    id: 'evt-op-al-robin-joins', worldId: W,
    title: { it: 'Nico Robin si unisce alla ciurma', en: 'Nico Robin joins the crew' },
    description: {
      it: "Sconfitto Crocodile, l'ex vicepresidente della Baroque Works Nico Robin si imbarca di nascosto sulla Going Merry e chiede a Rufy di farla vivere, entrando nella ciurma come archeologa.",
      en: "With Crocodile defeated, the former Baroque Works vice-president Nico Robin slips aboard the Going Merry and asks Luffy to let her live, joining the crew as archaeologist.",
    },
    period: { it: 'Paradise · Alabasta', en: 'Paradise · Alabasta' },
    arcId: 'arc-op-alabasta', locationId: 'loc-op-alabasta',
    characterIds: ['char-op-robin', 'char-op-luffy', 'char-op-crocodile'], factionIds: ['faction-op-straw-hat-pirates'],
    mangaChapters: ['216-217'], animeEpisodes: ['129-130'],
    order: 15.8, canon: c, canonStatus: c, referenceStatus: v, tags: ['alabasta', 'robin'],
  },

  /* ============================ Jaya / Skypiea ============================ */
  {
    id: 'evt-op-jaya-bellamy', worldId: W,
    title: { it: 'Jaya: Mock Town e Bellamy', en: 'Jaya: Mock Town and Bellamy' },
    description: {
      it: "A Mock Town, sull'isola di Jaya, Rufy e Zoro incassano in silenzio le umiliazioni del pirata Bellamy, che deride i sogni. Mont Blanc Cricket aiuta poi la ciurma a puntare verso il cielo.",
      en: "In Mock Town on Jaya, Luffy and Zoro silently take the humiliations of the pirate Bellamy, who mocks dreams. Mont Blanc Cricket then helps the crew aim for the sky.",
    },
    period: { it: 'Paradise · Skypiea', en: 'Paradise · Skypiea' },
    arcId: 'arc-op-skypiea', locationId: 'loc-op-mock-town',
    characterIds: ['char-op-luffy', 'char-op-zoro'],
    mangaChapters: ['223-236'], animeEpisodes: ['145-152'],
    order: 16.2, canon: c, canonStatus: c, referenceStatus: v, tags: ['jaya', 'bellamy', 'mock-town'],
  },
  {
    id: 'evt-op-sky-knock-up', worldId: W,
    title: { it: 'La Knock-Up Stream verso il cielo', en: 'The Knock-Up Stream to the sky' },
    description: {
      it: "Cavalcando la colonna d'acqua della Knock-Up Stream, la Going Merry è scagliata a 10.000 metri d'altitudine fino al «Mare Bianco», raggiungendo l'isola del cielo di Skypiea.",
      en: "Riding the column of water of the Knock-Up Stream, the Going Merry is launched 10,000 metres up to the 'White Sea', reaching the sky island of Skypiea.",
    },
    period: { it: 'Paradise · Skypiea', en: 'Paradise · Skypiea' },
    arcId: 'arc-op-skypiea', locationId: 'loc-op-jaya',
    characterIds: ['char-op-luffy', 'char-op-nami'], factionIds: ['faction-op-straw-hat-pirates'],
    mangaChapters: ['236-238'], animeEpisodes: ['153-155'],
    order: 16.4, canon: c, canonStatus: c, referenceStatus: v, tags: ['skypiea', 'knock-up-stream'],
  },
  {
    id: 'evt-op-sky-survival', worldId: W,
    title: { it: 'Il gioco mortale di «Dio»', en: "God's deadly survival game" },
    description: {
      it: "Nell'Upper Yard, Enel impone la sua Ordalia: chi sopravvive è «innocente». Tra i Shandia di Wiper e il cavaliere del cielo Gan Fall, i superstiti si riducono di ora in ora.",
      en: "In the Upper Yard, Enel imposes his Survival Game: whoever lives is 'innocent'. Among Wiper's Shandia and the sky knight Gan Fall, the survivors dwindle hour by hour.",
    },
    period: { it: 'Paradise · Skypiea', en: 'Paradise · Skypiea' },
    arcId: 'arc-op-skypiea', locationId: 'loc-op-upper-yard',
    characterIds: ['char-op-luffy', 'char-op-enel', 'char-op-wiper', 'char-op-gan-fall'], factionIds: ['faction-op-shandia'],
    mangaChapters: ['256-279'], animeEpisodes: ['166-184'],
    order: 16.6, canon: c, canonStatus: c, referenceStatus: v, tags: ['skypiea', 'enel', 'upper-yard'],
  },

  /* ============================ Water Seven ============================ */
  {
    id: 'evt-op-ws-usopp-duel', worldId: W,
    title: { it: 'Il duello tra Rufy e Usop', en: 'The duel between Luffy and Usopp' },
    description: {
      it: "Dichiarata irreparabile la Going Merry, Usop si oppone e sfida Rufy a duello per la nave. Rufy vince ma lascia la Merry all'amico: la ciurma si spacca nel dolore.",
      en: "With the Going Merry declared beyond repair, Usopp objects and challenges Luffy to a duel for the ship. Luffy wins but leaves the Merry to his friend: the crew splits in grief.",
    },
    period: { it: 'Paradise · Water Seven', en: 'Paradise · Water Seven' },
    arcId: 'arc-op-water-seven', locationId: 'loc-op-water-seven',
    characterIds: ['char-op-luffy', 'char-op-usopp'], factionIds: ['faction-op-straw-hat-pirates'],
    mangaChapters: ['331-334'], animeEpisodes: ['236-237'],
    order: 18.6, canon: c, canonStatus: c, referenceStatus: v, tags: ['water-seven', 'usop', 'going-merry'],
  },
  {
    id: 'evt-op-ws-cp9-reveal', worldId: W,
    title: { it: 'La CP9 si smaschera', en: 'CP9 unmasks itself' },
    description: {
      it: "Lucci, Kaku, Blueno e gli altri agenti infiltrati nella Galley-La gettano la maschera: sono la CP9, l'unità segreta del Governo Mondiale. Pugnalano Iceburg e portano via Robin e Franky.",
      en: "Lucci, Kaku, Blueno and the other agents embedded in Galley-La drop their disguise: they are CP9, the World Government's secret unit. They stab Iceburg and take away Robin and Franky.",
    },
    period: { it: 'Paradise · Water Seven', en: 'Paradise · Water Seven' },
    arcId: 'arc-op-water-seven', locationId: 'loc-op-water-seven',
    characterIds: ['char-op-lucci', 'char-op-kaku', 'char-op-blueno', 'char-op-iceburg', 'char-op-robin'], factionIds: ['faction-op-cp9'],
    mangaChapters: ['341-348'], animeEpisodes: ['243-252'],
    order: 18.8, canon: c, canonStatus: c, referenceStatus: v, tags: ['water-seven', 'cp9', 'robin'],
  },

  /* ============================ Enies Lobby ============================ */
  {
    id: 'evt-op-el-gates-justice', worldId: W,
    title: { it: 'Lo sfondamento delle Porte della Giustizia', en: 'Breaking the Gates of Justice' },
    description: {
      it: "La ciurma e i loro alleati irrompono a Enies Lobby attraversando le Porte della Giustizia e superano la fila dei giganti guardiani per raggiungere la torre dove è tenuta Robin.",
      en: "The crew and their allies storm Enies Lobby through the Gates of Justice and break past the line of giant guards to reach the tower where Robin is held.",
    },
    period: { it: 'Paradise · Enies Lobby', en: 'Paradise · Enies Lobby' },
    arcId: 'arc-op-enies-lobby', locationId: 'loc-op-enies-lobby',
    characterIds: ['char-op-luffy', 'char-op-zoro', 'char-op-sanji', 'char-op-franky'], factionIds: ['faction-op-straw-hat-pirates', 'faction-op-world-government'],
    mangaChapters: ['376-385'], animeEpisodes: ['265-273'],
    order: 19.6, canon: c, canonStatus: c, referenceStatus: v, tags: ['enies-lobby', 'assalto'],
  },
  {
    id: 'evt-op-el-lucci-fight', worldId: W,
    title: { it: 'Rufy contro Rob Lucci: Gear Second e Third', en: 'Luffy vs Rob Lucci: Gear Second and Third' },
    description: {
      it: "Nel cuore della torre Rufy affronta Rob Lucci, l'uomo-leopardo più letale della CP9. Spinto all'estremo, sblocca il Gear Second e il Gear Third e lo abbatte per riprendersi Robin.",
      en: "In the heart of the tower Luffy faces Rob Lucci, CP9's deadliest leopard-man. Pushed to the limit, he unlocks Gear Second and Gear Third and beats him to take Robin back.",
    },
    period: { it: 'Paradise · Enies Lobby', en: 'Paradise · Enies Lobby' },
    arcId: 'arc-op-enies-lobby', locationId: 'loc-op-enies-lobby',
    characterIds: ['char-op-luffy', 'char-op-lucci'], factionIds: ['faction-op-cp9'],
    mangaChapters: ['419-424'], animeEpisodes: ['305-307'],
    order: 20.5, canon: c, canonStatus: c, referenceStatus: v, tags: ['enies-lobby', 'lucci', 'gear-second'],
  },
  {
    id: 'evt-op-el-merry-funeral', worldId: W,
    title: { it: "L'addio alla Going Merry", en: 'Farewell to the Going Merry' },
    description: {
      it: "Sfuggiti al Buster Call, la ciurma dà l'ultimo saluto alla Going Merry, ormai a pezzi: lo spirito della nave ringrazia i compagni per averla portata fin lì, e arde tra le fiamme di un funerale vichingo.",
      en: "Having escaped the Buster Call, the crew gives the broken Going Merry a final farewell: the ship's spirit thanks the crew for carrying her this far, and burns in a Viking funeral.",
    },
    period: { it: 'Paradise · Water Seven', en: 'Paradise · Water Seven' },
    arcId: 'arc-op-enies-lobby', locationId: 'loc-op-water-seven',
    characterIds: ['char-op-luffy', 'char-op-usopp'], factionIds: ['faction-op-straw-hat-pirates'],
    mangaChapters: ['429-430'], animeEpisodes: ['312'],
    order: 21.5, canon: c, canonStatus: c, referenceStatus: v, tags: ['water-seven', 'going-merry'],
  },

  /* ============================ Thriller Bark ============================ */
  {
    id: 'evt-op-tb-oars', worldId: W,
    title: { it: "Il gigante Oars e l'ombra di Rufy", en: "The giant Oars and Luffy's shadow" },
    description: {
      it: "Moria ruba l'ombra di Rufy per animare il gigantesco zombie Oars. La ciurma combatte il colosso, mentre la fantasma Perona e il cavaliere Absalom seminano il panico per Thriller Bark.",
      en: "Moria steals Luffy's shadow to animate the giant zombie Oars. The crew battles the colossus, while the ghost Perona and the knight Absalom spread panic across Thriller Bark.",
    },
    period: { it: 'Paradise · Thriller Bark', en: 'Paradise · Thriller Bark' },
    arcId: 'arc-op-thriller-bark', locationId: 'loc-op-thriller-bark',
    characterIds: ['char-op-luffy', 'char-op-moria', 'char-op-perona'], factionIds: ['faction-op-thriller-bark-pirates'],
    mangaChapters: ['463-472'], animeEpisodes: ['357-367'],
    order: 25.6, canon: c, canonStatus: c, referenceStatus: v, tags: ['thriller-bark', 'oars'],
  },
  {
    id: 'evt-op-tb-nothing-happened', worldId: W,
    title: { it: 'Zoro e Kuma: «Non è successo nulla»', en: "Zoro and Kuma: 'Nothing happened'" },
    description: {
      it: "Il Corsaro Bartholomew Kuma offre di risparmiare la ciurma in cambio della testa di Rufy. Zoro si offre al suo posto e si carica in segreto di tutto il dolore del capitano, sopravvivendo a stento.",
      en: "The Warlord Bartholomew Kuma offers to spare the crew in exchange for Luffy's head. Zoro offers himself instead and secretly takes on all of the captain's pain, barely surviving.",
    },
    period: { it: 'Paradise · Thriller Bark', en: 'Paradise · Thriller Bark' },
    arcId: 'arc-op-thriller-bark', locationId: 'loc-op-thriller-bark',
    characterIds: ['char-op-zoro', 'char-op-kuma', 'char-op-luffy'], factionIds: ['faction-op-shichibukai'],
    mangaChapters: ['483-485'], animeEpisodes: ['377'],
    order: 27.5, canon: c, canonStatus: c, referenceStatus: v, tags: ['thriller-bark', 'zoro', 'kuma'],
  },

  /* ============================ Sabaody ============================ */
  {
    id: 'evt-op-sab-celestial', worldId: W,
    title: { it: 'Il pugno al Drago Celeste', en: 'The punch to the Celestial Dragon' },
    description: {
      it: "Per salvare la sirena Camie dal mercato di schiavi, Rufy colpisce in pieno volto il Nobile Mondiale Saint Charloss davanti a tutti: un atto che chiama un ammiraglio sull'arcipelago.",
      en: "To save the mermaid Camie from the slave market, Luffy punches the World Noble Saint Charloss in the face before everyone: an act that summons an admiral to the archipelago.",
    },
    period: { it: 'Saga di Sabaody', en: 'Sabaody Saga' },
    arcId: 'arc-op-sabaody', locationId: 'loc-op-sabaody',
    characterIds: ['char-op-luffy', 'char-op-rayleigh'], factionIds: ['faction-op-straw-hat-pirates'],
    mangaChapters: ['501-503'], animeEpisodes: ['394-396'],
    order: 29.6, canon: c, canonStatus: c, referenceStatus: v, tags: ['sabaody', 'draghi-celesti'],
  },
  {
    id: 'evt-op-sab-kizaru', worldId: W,
    title: { it: 'Kizaru e i Pacifista attaccano', en: 'Kizaru and the Pacifistas attack' },
    description: {
      it: "L'ammiraglio Kizaru, i Pacifista e il Corsaro Bartholomew Kuma piombano su Sabaody. Rayleigh appare per coprire la ciurma, ma è impossibile vincere: la separazione è inevitabile.",
      en: "Admiral Kizaru, the Pacifistas and the Warlord Bartholomew Kuma descend on Sabaody. Rayleigh appears to cover the crew, but victory is impossible: the separation is inevitable.",
    },
    period: { it: 'Saga di Sabaody', en: 'Sabaody Saga' },
    arcId: 'arc-op-sabaody', locationId: 'loc-op-sabaody',
    characterIds: ['char-op-luffy', 'char-op-kizaru', 'char-op-kuma', 'char-op-rayleigh'], factionIds: ['faction-op-marines'],
    mangaChapters: ['506-512'], animeEpisodes: ['397-404'],
    order: 29.8, canon: c, canonStatus: c, referenceStatus: v, tags: ['sabaody', 'kizaru', 'kuma'],
  },

  /* ============================ Impel Down ============================ */
  {
    id: 'evt-op-id-descent', worldId: W,
    title: { it: 'La discesa nei livelli infernali', en: 'The descent into the infernal levels' },
    description: {
      it: "Introdotto di nascosto da Hancock, Rufy scende tra i sei livelli di Impel Down e ritrova vecchi nemici diventati alleati: Bagy, Mr. 3 e l'ex Corsaro Crocodile, rinchiuso nel gelido Livello 6.",
      en: "Smuggled in by Hancock, Luffy descends Impel Down's six levels and reunites with old enemies turned allies: Buggy, Mr. 3 and the former Warlord Crocodile, locked in the freezing Level 6.",
    },
    period: { it: 'Saga di Marineford', en: 'Marineford Saga' },
    arcId: 'arc-op-impel-down', locationId: 'loc-op-impel-down',
    characterIds: ['char-op-luffy', 'char-op-buggy', 'char-op-crocodile'],
    mangaChapters: ['526-532'], animeEpisodes: ['423-430'],
    order: 37.6, canon: c, canonStatus: c, referenceStatus: v, tags: ['impel-down', 'crocodile'],
  },
  {
    id: 'evt-op-id-magellan', worldId: W,
    title: { it: 'Avvelenato dal direttore Magellan', en: 'Poisoned by Warden Magellan' },
    description: {
      it: "Il direttore Magellan, utente del Frutto Veleno, sconfigge Rufy e lo avvelena quasi a morte. In fin di vita, Rufy viene trascinato verso il Livello 6 dai compagni di prigionia.",
      en: "Warden Magellan, user of the Venom Fruit, defeats Luffy and poisons him nearly to death. Dying, Luffy is dragged toward Level 6 by his fellow prisoners.",
    },
    period: { it: 'Saga di Marineford', en: 'Marineford Saga' },
    arcId: 'arc-op-impel-down', locationId: 'loc-op-impel-down',
    characterIds: ['char-op-luffy', 'char-op-magellan', 'char-op-ivankov'],
    mangaChapters: ['533-537'], animeEpisodes: ['431-435'],
    order: 37.7, canon: c, canonStatus: c, referenceStatus: v, tags: ['impel-down', 'magellan'],
  },
  {
    id: 'evt-op-id-ivankov-cure', worldId: W,
    title: { it: 'La cura di Ivankov e la rivolta', en: "Ivankov's cure and the revolt" },
    description: {
      it: "La regina dei travestiti Emporio Ivankov salva Rufy con i suoi ormoni. Saputo che Ace è già a Marineford, Rufy, Jinbe, Crocodile e un esercito di evasi forzano l'uscita dalla prigione.",
      en: "The queen of cross-dressers Emporio Ivankov saves Luffy with her hormones. Learning Ace is already at Marineford, Luffy, Jinbe, Crocodile and an army of escapees force their way out of the prison.",
    },
    period: { it: 'Saga di Marineford', en: 'Marineford Saga' },
    arcId: 'arc-op-impel-down', locationId: 'loc-op-impel-down',
    characterIds: ['char-op-luffy', 'char-op-ivankov', 'char-op-jinbe', 'char-op-crocodile'], factionIds: ['faction-op-revolutionary-army'],
    mangaChapters: ['538-549'], animeEpisodes: ['436-452'],
    order: 37.8, canon: c, canonStatus: c, referenceStatus: v, tags: ['impel-down', 'ivankov', 'evasione'],
  },
  {
    id: 'evt-op-id-blackbeard', worldId: W,
    title: { it: 'Barbanera al Livello 6', en: 'Blackbeard at Level 6' },
    description: {
      it: "Mentre Rufy fugge, Marshall D. Teach «Barbanera» entra a Impel Down, sconfigge il direttore Magellan e recluta dal Livello 6 i criminali più mostruosi del mondo per la sua ciurma.",
      en: "As Luffy escapes, Marshall D. Teach 'Blackbeard' enters Impel Down, defeats Warden Magellan and recruits the world's most monstrous criminals from Level 6 for his crew.",
    },
    period: { it: 'Saga di Marineford', en: 'Marineford Saga' },
    arcId: 'arc-op-impel-down', locationId: 'loc-op-impel-down',
    characterIds: ['char-op-blackbeard', 'char-op-magellan'], factionIds: ['faction-op-blackbeard-pirates'],
    mangaChapters: ['540-543'], animeEpisodes: ['440-441'],
    order: 37.85, canon: c, canonStatus: c, referenceStatus: v, tags: ['impel-down', 'barbanera'],
  },

  /* ============================ Marineford ============================ */
  {
    id: 'evt-op-mf-whitebeard-arrives', worldId: W,
    title: { it: "L'arrivo di Barbabianca", en: "Whitebeard's arrival" },
    description: {
      it: "Mentre Sengoku schiera tre ammiragli e i Corsari attorno al patibolo di Ace, Edward Newgate «Barbabianca» irrompe nella baia di Marineford con la sua flotta e gli equipaggi alleati: la guerra può cominciare.",
      en: "As Sengoku arrays three admirals and the Warlords around Ace's scaffold, Edward Newgate 'Whitebeard' bursts into Marineford bay with his fleet and allied crews: the war can begin.",
    },
    period: { it: 'Red Line · Marineford', en: 'Red Line · Marineford' },
    arcId: 'arc-op-marineford', locationId: 'loc-op-marineford',
    characterIds: ['char-op-whitebeard', 'char-op-sengoku', 'char-op-akainu', 'char-op-ace'], factionIds: ['faction-op-whitebeard-pirates', 'faction-op-marines'],
    mangaChapters: ['552-554'], animeEpisodes: ['459-461'],
    order: 39.6, canon: c, canonStatus: c, referenceStatus: v, tags: ['marineford', 'barbabianca'],
  },
  {
    id: 'evt-op-mf-luffy-arrives', worldId: W,
    title: { it: 'Rufy irrompe nella baia', en: 'Luffy bursts into the bay' },
    description: {
      it: "Calato dal cielo con gli evasi di Impel Down — Jinbe, Ivankov e Bagy — Rufy cade nella baia di Marineford gridando il nome del fratello e si getta nella mischia per raggiungere il patibolo.",
      en: "Dropping from the sky with the Impel Down escapees — Jinbe, Ivankov and Buggy — Luffy crashes into Marineford bay screaming his brother's name and throws himself into the fray to reach the scaffold.",
    },
    period: { it: 'Red Line · Marineford', en: 'Red Line · Marineford' },
    arcId: 'arc-op-marineford', locationId: 'loc-op-marineford',
    characterIds: ['char-op-luffy', 'char-op-ace', 'char-op-ivankov', 'char-op-jinbe'], factionIds: ['faction-op-straw-hat-pirates'],
    mangaChapters: ['558-562'], animeEpisodes: ['465-468'],
    order: 39.8, canon: c, canonStatus: c, referenceStatus: v, tags: ['marineford', 'rufy'],
  },
  {
    id: 'evt-op-mf-ace-freed', worldId: W,
    title: { it: 'Ace liberato dal patibolo', en: 'Ace freed from the scaffold' },
    description: {
      it: "Con la chiave consegnata e l'aiuto del padre Barbabianca, Rufy raggiunge il patibolo e libera Ace dalle manette di pietra marina. Per un istante i due fratelli combattono fianco a fianco.",
      en: "With the key delivered and his father Whitebeard's help, Luffy reaches the scaffold and frees Ace from the seastone cuffs. For a moment the two brothers fight side by side.",
    },
    period: { it: 'Red Line · Marineford', en: 'Red Line · Marineford' },
    arcId: 'arc-op-marineford', locationId: 'loc-op-marineford',
    characterIds: ['char-op-luffy', 'char-op-ace', 'char-op-garp'], factionIds: ['faction-op-whitebeard-pirates'],
    mangaChapters: ['568-573'], animeEpisodes: ['477-483'],
    order: 40.5, canon: c, canonStatus: c, referenceStatus: v, tags: ['marineford', 'ace'],
  },
  {
    id: 'evt-op-mf-shanks-ends-war', worldId: W,
    title: { it: 'Shanks pone fine alla guerra', en: 'Shanks ends the war' },
    description: {
      it: "Mentre la carneficina prosegue e Barbanera mostra il suo nuovo potere, Shanks arriva con i suoi a Marineford e impone la fine della guerra, raccogliendo i corpi di Ace e Barbabianca.",
      en: "As the carnage continues and Blackbeard reveals his new power, Shanks arrives at Marineford with his crew and forces the war to end, taking in the bodies of Ace and Whitebeard.",
    },
    period: { it: 'Red Line · Marineford', en: 'Red Line · Marineford' },
    arcId: 'arc-op-marineford', locationId: 'loc-op-marineford',
    characterIds: ['char-op-shanks', 'char-op-blackbeard', 'char-op-sengoku', 'char-op-coby'], factionIds: ['faction-op-red-hair-pirates'],
    mangaChapters: ['579-580'], animeEpisodes: ['488-489'],
    order: 42.5, canon: c, canonStatus: c, referenceStatus: v, tags: ['marineford', 'shanks'],
  },

  /* ============================ Fish-Man Island ============================ */
  {
    id: 'evt-op-fmi-otohime', worldId: W,
    title: { it: 'Il sogno della regina Otohime', en: "Queen Otohime's dream" },
    description: {
      it: "Un flashback racconta la regina sirena Otohime, che lottò per la pace tra umani e uomini-pesce raccogliendo firme per trasferire il popolo in superficie, fino al suo assassinio.",
      en: "A flashback tells of the mermaid queen Otohime, who fought for peace between humans and fish-men by gathering signatures to move her people to the surface, until her assassination.",
    },
    period: { it: 'Saga di Fish-Man Island', en: 'Fish-Man Island Saga' },
    arcId: 'arc-op-fishman-island', locationId: 'loc-op-fishman-island',
    characterIds: ['char-op-shirahoshi', 'char-op-jinbe'],
    mangaChapters: ['621-626'], animeEpisodes: ['541-545'],
    order: 59.5, canon: c, canonStatus: c, referenceStatus: v, tags: ['fish-man-island', 'otohime'],
  },
  {
    id: 'evt-op-fmi-noah', worldId: W,
    title: { it: "Shirahoshi, Poseidon e l'Arca Noah", en: "Shirahoshi, Poseidon and the Ark Noah" },
    description: {
      it: "Quando Hody tenta di scagliare l'Arca Noah sull'isola, si rivela che la principessa Shirahoshi è Poseidon, una delle armi ancestrali. Rufy ferma Hody e protegge l'isola dalla distruzione.",
      en: "When Hody tries to hurl the Ark Noah onto the island, it is revealed that Princess Shirahoshi is Poseidon, one of the ancient weapons. Luffy stops Hody and protects the island from destruction.",
    },
    period: { it: 'Saga di Fish-Man Island', en: 'Fish-Man Island Saga' },
    arcId: 'arc-op-fishman-island', locationId: 'loc-op-fishman-island',
    characterIds: ['char-op-luffy', 'char-op-shirahoshi', 'char-op-hody', 'char-op-jinbe'], factionIds: ['faction-op-new-fishman-pirates'],
    mangaChapters: ['644-648'], animeEpisodes: ['564-568'],
    order: 60.5, canon: c, canonStatus: c, referenceStatus: v, tags: ['fish-man-island', 'poseidon', 'noah'],
  },

  /* ============================ Punk Hazard ============================ */
  {
    id: 'evt-op-ph-dragon', worldId: W,
    title: { it: 'Il dragone, i centauri e i samurai', en: 'The dragon, the centaurs and the samurai' },
    description: {
      it: "Sbarcata sull'isola di fuoco e ghiaccio, la ciurma trova un dragone, soldati-centauro e il samurai a pezzi Kinemon in cerca del figlio. Iniziano scambi di corpi e una fragile collaborazione con Law.",
      en: "Landing on the fire-and-ice island, the crew finds a dragon, centaur soldiers and the dismembered samurai Kinemon searching for his son. Body-swaps begin, and a fragile cooperation with Law.",
    },
    period: { it: 'New World · Punk Hazard', en: 'New World · Punk Hazard' },
    arcId: 'arc-op-punk-hazard', locationId: 'loc-op-punk-hazard',
    characterIds: ['char-op-luffy', 'char-op-law', 'char-op-smoker', 'char-op-tashigi', 'char-op-kinemon'],
    mangaChapters: ['655-665'], animeEpisodes: ['579-589'],
    order: 61.5, canon: c, canonStatus: c, referenceStatus: v, tags: ['punk-hazard', 'kinemon', 'law'],
  },
  {
    id: 'evt-op-ph-caesar-gas', worldId: W,
    title: { it: 'Il gas Shinokuni e i bambini giganti', en: 'The Shinokuni gas and the giant children' },
    description: {
      it: "Caesar Clown scatena la sua arma a gas Shinokuni e tradisce i suoi ospiti. La ciurma e Law salvano i bambini-cavia ingiganti dalle droghe e mettono lo scienziato alle strette.",
      en: "Caesar Clown unleashes his Shinokuni gas weapon and betrays his guests. The crew and Law rescue the drug-enlarged child test-subjects and corner the scientist.",
    },
    period: { it: 'New World · Punk Hazard', en: 'New World · Punk Hazard' },
    arcId: 'arc-op-punk-hazard', locationId: 'loc-op-punk-hazard',
    characterIds: ['char-op-luffy', 'char-op-caesar', 'char-op-chopper', 'char-op-law'],
    mangaChapters: ['675-690'], animeEpisodes: ['600-617'],
    order: 61.8, canon: c, canonStatus: c, referenceStatus: v, tags: ['punk-hazard', 'caesar', 'shinokuni'],
  },

  /* ============================ Dressrosa ============================ */
  {
    id: 'evt-op-dr-colosseum', worldId: W,
    title: { it: 'Il torneo del Colosseo Corrida', en: 'The Corrida Colosseum tournament' },
    description: {
      it: "Travestito da gladiatore «Lucy», Rufy entra nel torneo per il Frutto Mera Mera e stringe alleanze con Bartolomeo, Cavendish e i guerrieri dell'arena, fino a ritrovarvi il fratello Sabo.",
      en: "Disguised as the gladiator 'Lucy', Luffy enters the tournament for the Flame-Flame Fruit and forges alliances with Bartolomeo, Cavendish and the arena's warriors, until he finds his brother Sabo there.",
    },
    period: { it: 'New World · Dressrosa', en: 'New World · Dressrosa' },
    arcId: 'arc-op-dressrosa', locationId: 'loc-op-dr-corrida-colosseum',
    characterIds: ['char-op-luffy', 'char-op-sabo', 'char-op-rebecca', 'char-op-diamante'],
    mangaChapters: ['704-737'], animeEpisodes: ['632-680'],
    order: 63.2, canon: c, canonStatus: c, referenceStatus: v, tags: ['dressrosa', 'colosseo', 'mera-mera'],
  },
  {
    id: 'evt-op-dr-tontatta', worldId: W,
    title: { it: 'I nani Tontatta e la fabbrica di SMILE', en: 'The Tontatta dwarves and the SMILE factory' },
    description: {
      it: "Sotto Dressrosa i nani Tontatta, schiavizzati da Doflamingo, guidano la ciurma alla fabbrica clandestina di Frutti SMILE che rifornisce la ciurma di Kaido. Law rivela il suo legame con Corazon.",
      en: "Beneath Dressrosa the Tontatta dwarves, enslaved by Doflamingo, lead the crew to the secret SMILE Fruit factory that supplies Kaido's crew. Law reveals his bond with Corazon.",
    },
    period: { it: 'New World · Dressrosa', en: 'New World · Dressrosa' },
    arcId: 'arc-op-dressrosa', locationId: 'loc-op-dr-flower-field',
    characterIds: ['char-op-luffy', 'char-op-law', 'char-op-doflamingo'], factionIds: ['faction-op-donquixote-pirates'],
    mangaChapters: ['711-745'], animeEpisodes: ['654-695'],
    order: 63.4, canon: c, canonStatus: c, referenceStatus: v, tags: ['dressrosa', 'tontatta', 'smile'],
  },
  {
    id: 'evt-op-dr-birdcage', worldId: W,
    title: { it: "Pica, la Gabbia d'Uccello e l'altopiano", en: "Pica, the Birdcage and the plateau" },
    description: {
      it: "Doflamingo imprigiona l'intera isola nella sua Gabbia d'Uccello e aizza gli abitanti gli uni contro gli altri. Sull'altopiano del Re, Zoro affronta il gigante di pietra Pica mentre l'alleanza tiene il fronte.",
      en: "Doflamingo cages the whole island in his Birdcage and turns the people against one another. On the King's Plateau, Zoro faces the stone giant Pica while the alliance holds the line.",
    },
    period: { it: 'New World · Dressrosa', en: 'New World · Dressrosa' },
    arcId: 'arc-op-dressrosa', locationId: 'loc-op-dr-riku-plateau',
    characterIds: ['char-op-luffy', 'char-op-zoro', 'char-op-pica', 'char-op-trebol', 'char-op-doflamingo'], factionIds: ['faction-op-donquixote-pirates'],
    mangaChapters: ['750-790'], animeEpisodes: ['700-731'],
    order: 63.6, canon: c, canonStatus: c, referenceStatus: v, tags: ['dressrosa', 'pica', 'birdcage'],
  },

  /* ============================ Whole Cake Island ============================ */
  {
    id: 'evt-op-wci-vinsmoke', worldId: W,
    title: { it: 'Il riscatto di Sanji e i Vinsmoke', en: "Sanji's reckoning and the Vinsmoke" },
    description: {
      it: "Sanji ritrova la famiglia Vinsmoke (il Germa 66) e il padre Judge, che lo umiliò da bambino. Tradito e legato al matrimonio con Pudding, sceglie comunque la ciurma sopra il sangue.",
      en: "Sanji reunites with the Vinsmoke family (Germa 66) and his father Judge, who tormented him as a child. Betrayed and bound to the marriage with Pudding, he still chooses the crew over blood.",
    },
    period: { it: 'New World · Whole Cake Island', en: 'New World · Whole Cake Island' },
    arcId: 'arc-op-whole-cake', locationId: 'loc-op-whole-cake-island',
    characterIds: ['char-op-sanji', 'char-op-judge', 'char-op-pudding', 'char-op-luffy'], factionIds: ['faction-op-germa-66'],
    mangaChapters: ['832-862'], animeEpisodes: ['793-825'],
    order: 65.5, canon: c, canonStatus: c, referenceStatus: v, tags: ['whole-cake', 'sanji', 'germa'],
  },
  {
    id: 'evt-op-wci-wedding', worldId: W,
    title: { it: 'Il matrimonio e il crollo di Big Mom', en: "The wedding and Big Mom's collapse" },
    description: {
      it: "Al banchetto di nozze il piano di Big Mom per sterminare i Vinsmoke salta; alla vista di una foto e al ricordo di Mother Carmel, l'Imperatrice crolla in un urlo distruttivo che scuote Totland.",
      en: "At the wedding feast Big Mom's plan to wipe out the Vinsmoke falls apart; at the sight of a photo and the memory of Mother Carmel, the Empress collapses into a destructive scream that rocks Totland.",
    },
    period: { it: 'New World · Whole Cake Island', en: 'New World · Whole Cake Island' },
    arcId: 'arc-op-whole-cake', locationId: 'loc-op-tl-sweet-city',
    characterIds: ['char-op-luffy', 'char-op-big-mom', 'char-op-sanji', 'char-op-pudding'], factionIds: ['faction-op-big-mom-pirates'],
    mangaChapters: ['863-871'], animeEpisodes: ['826-836'],
    order: 66.2, canon: c, canonStatus: c, referenceStatus: v, tags: ['whole-cake', 'big-mom', 'matrimonio'],
  },
  {
    id: 'evt-op-wci-pedro', worldId: W,
    title: { it: 'Il sacrificio di Pedro', en: "Pedro's sacrifice" },
    description: {
      it: "Per garantire la fuga della ciurma da Cacao Island, il mink Pedro si fa esplodere contro Charlotte Perospero, scommettendo la vita sulla nuova generazione e su Rufy.",
      en: "To secure the crew's escape from Cacao Island, the mink Pedro blows himself up against Charlotte Perospero, betting his life on the new generation and on Luffy.",
    },
    period: { it: 'New World · Whole Cake Island', en: 'New World · Whole Cake Island' },
    arcId: 'arc-op-whole-cake', locationId: 'loc-op-tl-cacao',
    characterIds: ['char-op-pedro', 'char-op-luffy', 'char-op-katakuri'], factionIds: ['faction-op-big-mom-pirates'],
    mangaChapters: ['878-880'], animeEpisodes: ['846-848'],
    order: 66.5, canon: c, canonStatus: c, referenceStatus: v, tags: ['whole-cake', 'pedro', 'mink'],
  },

  /* ============================ Wano ============================ */
  {
    id: 'evt-op-wano-act1', worldId: W,
    title: { it: 'Atto 1: i samurai e la rivolta di Kuri', en: 'Act 1: the samurai and the Kuri uprising' },
    description: {
      it: "Sbarcata a Wano sotto mentite spoglie, la ciurma ritrova Kinemon e i samurai Kozuki, scopre la miseria sotto Orochi e Kaido e raccoglie l'eredità del clan per preparare il complotto di Onigashima.",
      en: "Landing in Wano in disguise, the crew reunites with Kinemon and the Kozuki samurai, sees the misery under Orochi and Kaido, and takes up the clan's legacy to prepare the Onigashima plot.",
    },
    period: { it: 'New World · Wano', en: 'New World · Wano' },
    arcId: 'arc-op-wano', locationId: 'loc-op-kuri',
    characterIds: ['char-op-luffy', 'char-op-zoro', 'char-op-kinemon', 'char-op-law'], factionIds: ['faction-op-kozuki'],
    mangaChapters: ['909-925'], animeEpisodes: ['892-916'],
    order: 66.6, canon: c, canonStatus: c, referenceStatus: v, tags: ['wano', 'kozuki', 'kuri'],
  },
  {
    id: 'evt-op-wano-roof', worldId: W,
    title: { it: 'Lo scontro sul tetto: cinque contro due Imperatori', en: 'The rooftop clash: five against two Emperors' },
    description: {
      it: "Sul tetto della cupola di Onigashima, i cinque capitani dell'alleanza — Rufy, Law, Kid, Zoro e Killer — affrontano insieme gli Imperatori Kaido e Big Mom nel duello che deciderà Wano.",
      en: "Atop the dome of Onigashima, the alliance's five captains — Luffy, Law, Kid, Zoro and Killer — together face the Emperors Kaido and Big Mom in the duel that will decide Wano.",
    },
    period: { it: 'New World · Onigashima', en: 'New World · Onigashima' },
    arcId: 'arc-op-wano', locationId: 'loc-op-onigashima',
    characterIds: ['char-op-luffy', 'char-op-law', 'char-op-kaido', 'char-op-big-mom', 'char-op-zoro'], factionIds: ['faction-op-beasts-pirates', 'faction-op-heart-pirates'],
    mangaChapters: ['1000-1010'], animeEpisodes: ['1049-1062'],
    order: 68.5, canon: c, canonStatus: c, referenceStatus: v, tags: ['wano', 'onigashima', 'imperatori'],
  },
  {
    id: 'evt-op-wano-gear5', worldId: W,
    title: { it: 'Il risveglio: Gear 5 (Nika)', en: 'The awakening: Gear 5 (Nika)' },
    description: {
      it: "Apparentemente ucciso da Kaido, Rufy risorge: il suo Frutto si risveglia rivelandosi l'Hito Hito no Mi modello Nika, il «Dio Sole». In Gear 5 piega la realtà e ribalta lo scontro con l'Imperatore.",
      en: "Seemingly killed by Kaido, Luffy rises again: his fruit awakens, revealed as the Hito Hito no Mi Model Nika, the 'Sun God'. In Gear 5 he bends reality and turns the fight with the Emperor around.",
    },
    period: { it: 'New World · Onigashima', en: 'New World · Onigashima' },
    arcId: 'arc-op-wano', locationId: 'loc-op-onigashima',
    characterIds: ['char-op-luffy', 'char-op-kaido'], factionIds: ['faction-op-straw-hat-pirates'],
    mangaChapters: ['1043-1047'], animeEpisodes: ['1071-1074'],
    order: 68.8, canon: c, canonStatus: c, referenceStatus: v, tags: ['wano', 'gear-5', 'nika'],
  },

  /* ============================ Egghead ============================ */
  {
    id: 'evt-op-egg-satellites', worldId: W,
    title: { it: 'I satelliti e la verità sul Frutto di Rufy', en: "The satellites and the truth about Luffy's fruit" },
    description: {
      it: "La ciurma incontra i sei satelliti del dottor Vegapunk sull'isola del futuro. Vegapunk rivela che il vero nome del Frutto di Rufy è Hito Hito no Mi, modello Nika, temuto e nascosto dal Governo Mondiale.",
      en: "The crew meets Dr. Vegapunk's six satellites on the island of the future. Vegapunk reveals that the true name of Luffy's fruit is the Hito Hito no Mi, Model Nika, feared and hidden by the World Government.",
    },
    period: { it: 'New World · Egghead', en: 'New World · Egghead' },
    arcId: 'arc-op-egghead', locationId: 'loc-op-egghead',
    characterIds: ['char-op-luffy', 'char-op-vegapunk', 'char-op-bonney'], factionIds: ['faction-op-straw-hat-pirates'],
    mangaChapters: ['1061-1071'], animeEpisodes: ['1089-1100'],
    order: 71.5, canon: c, canonStatus: c, referenceStatus: v, tags: ['egghead', 'vegapunk', 'nika'],
  },
  {
    id: 'evt-op-egg-kuma-bonney', worldId: W,
    title: { it: 'Il passato di Kuma e Bonney', en: "Kuma and Bonney's past" },
    description: {
      it: "Toccando i ricordi del padre, Bonney rivive l'intera storia di Bartholomew Kuma: l'amore per Ginny, la nascita di lei e il sacrificio che ridusse Kuma a un Pacifista senza volontà.",
      en: "Touching her father's memories, Bonney relives the whole story of Bartholomew Kuma: his love for Ginny, her own birth and the sacrifice that reduced Kuma to a will-less Pacifista.",
    },
    period: { it: 'New World · Egghead', en: 'New World · Egghead' },
    arcId: 'arc-op-egghead', locationId: 'loc-op-egghead',
    characterIds: ['char-op-bonney', 'char-op-kuma', 'char-op-saturn'],
    mangaChapters: ['1093-1103'],
    order: 71.8, canon: c, canonStatus: c, referenceStatus: v, tags: ['egghead', 'kuma', 'bonney'],
  },
  {
    id: 'evt-op-egg-kizaru-saturn', worldId: W,
    title: { it: "Kizaru e l'Astro Saturn sbarcano", en: 'Kizaru and Elder Saturn land' },
    description: {
      it: "Il Governo Mondiale ordina di cancellare Vegapunk: arrivano l'ammiraglio Kizaru, la CP0 e l'Astro di Saggezza Saturn in persona con le armi Seraphim. Sull'isola del futuro divampa una battaglia disperata.",
      en: "The World Government orders Vegapunk erased: Admiral Kizaru, CP0 and the Elder of Wisdom Saturn himself arrive with the Seraphim weapons. A desperate battle erupts on the island of the future.",
    },
    period: { it: 'New World · Egghead', en: 'New World · Egghead' },
    arcId: 'arc-op-egghead', locationId: 'loc-op-egghead',
    characterIds: ['char-op-kizaru', 'char-op-saturn', 'char-op-vegapunk', 'char-op-luffy'], factionIds: ['faction-op-marines', 'faction-op-five-elders', 'faction-op-cp0'],
    mangaChapters: ['1092-1110'], animeEpisodes: ['1108-1122'],
    order: 72.5, canon: c, canonStatus: c, referenceStatus: v, tags: ['egghead', 'kizaru', 'saturn'],
  },
];
