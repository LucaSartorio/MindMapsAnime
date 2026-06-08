import type { TimelineEvent } from '@/types';

/**
 * Eventi aggiuntivi: tappe canoniche finora assenti dalla timeline (esecuzione di
 * Roger, Laugh Tale, nascita di Ace, l'incidente di Sabo, la riunione dopo i due
 * anni, l'alleanza di Zou, la Reverie e l'ultima marcia di Kuma).
 */
const c = 'canon' as const;
const v = 'verified' as const;
const W = 'world-onepiece';

export const onepieceEventsExtra2: TimelineEvent[] = [
  {
    id: 'evt-op-roger-laugh-tale', worldId: W,
    title: { it: 'Roger raggiunge Laugh Tale', en: 'Roger reaches Laugh Tale' },
    description: {
      it: "L'equipaggio di Gol D. Roger è il primo a raggiungere l'ultima isola, Laugh Tale, e a scoprire il tesoro e la verità lasciati da Joy Boy alla fine del Secolo Vuoto.",
      en: "Gol D. Roger's crew is the first to reach the final island, Laugh Tale, and to discover the treasure and truth left by Joy Boy at the end of the Void Century.",
    },
    longDescription: {
      it: "Quasi 26 anni prima della storia, i Pirati di Roger — con Rayleigh, Oden e gli altri — completano il giro della Grand Line e approdano sull'ultima isola, che ribattezzano «Laugh Tale» per la risata che vi scoppiò scoprendone il segreto. Lì trovano il One Piece e la verità sul Secolo Vuoto e su Joy Boy; ma Roger, malato e «nato troppo presto», sceglie di non rovesciare il mondo allora.",
      en: "Almost 26 years before the story, Roger's Pirates — with Rayleigh, Oden and the others — complete the lap of the Grand Line and reach the final island, which they rename 'Laugh Tale' for the laughter that burst out on uncovering its secret. There they find the One Piece and the truth of the Void Century and Joy Boy; but Roger, ill and 'born too early', chooses not to overturn the world then.",
    },
    period: { it: 'Backstory · era di Roger', en: 'Backstory · Roger era' },
    locationId: 'loc-op-laugh-tale',
    characterIds: ['char-op-roger', 'char-op-rayleigh', 'char-op-oden'],
    factionIds: ['faction-op-roger-pirates'],
    mangaChapters: ['967'], animeEpisodes: ['967-968'],
    order: -22, canon: c, canonStatus: c, referenceStatus: v, tags: ['roger', 'laugh-tale', 'one-piece'],
  },
  {
    id: 'evt-op-roger-execution', worldId: W,
    title: { it: "L'esecuzione di Gol D. Roger", en: "Gol D. Roger's execution" },
    description: {
      it: "A Loguetown, consegnatosi alla Marina, il Re dei Pirati Gol D. Roger viene giustiziato. Le sue ultime parole sul One Piece danno inizio alla Grande Era della Pirateria.",
      en: "At Loguetown, having turned himself in, the Pirate King Gol D. Roger is executed. His final words about the One Piece begin the Great Pirate Era.",
    },
    longDescription: {
      it: "Malato e deciso a morire alle proprie condizioni, Roger si arrese alla Marina e fu giustiziato pubblicamente sul patibolo di Loguetown. Sorridendo, rivelò che il suo tesoro, il One Piece, era reale e a disposizione di chi l'avesse trovato: scoccò così la scintilla della Grande Era della Pirateria che avrebbe spinto in mare intere generazioni, Rufy compreso.",
      en: "Ill and determined to die on his own terms, Roger surrendered to the Marines and was publicly executed on the Loguetown scaffold. Smiling, he revealed that his treasure, the One Piece, was real and there for whoever found it: thus the spark of the Great Pirate Era was struck, sending whole generations to sea, Luffy included.",
    },
    period: { it: 'Backstory · era di Roger', en: 'Backstory · Roger era' },
    arcId: 'arc-op-loguetown', locationId: 'loc-op-loguetown',
    characterIds: ['char-op-roger', 'char-op-garp'],
    factionIds: ['faction-op-roger-pirates', 'faction-op-marines'],
    mangaChapters: ['1', '0'], animeEpisodes: ['1', '0'],
    order: -20, canon: c, canonStatus: c, referenceStatus: v, tags: ['roger', 'loguetown', 'pirateria'],
  },
  {
    id: 'evt-op-ace-birth', worldId: W,
    title: { it: 'La nascita di Ace', en: "Ace's birth" },
    description: {
      it: "Portgas D. Rouge trattiene la gravidanza per venti mesi pur di nascondere il figlio di Roger alla Marina, e dà alla luce Ace a costo della vita.",
      en: "Portgas D. Rouge holds her pregnancy for twenty months to hide Roger's son from the Marines, giving birth to Ace at the cost of her life.",
    },
    longDescription: {
      it: "Mentre la Marina dà la caccia a chiunque possa portare il sangue di Roger, l'amata del Re dei Pirati, Portgas D. Rouge, sopporta una gravidanza di venti mesi con pura forza di volontà per ingannare i sospetti. Dà alla luce Gol D. Ace e muore subito dopo; il neonato è affidato in segreto a Garp, che lo cresce sull'Isola di Dawn.",
      en: "As the Marines hunt anyone who might carry Roger's blood, the Pirate King's beloved, Portgas D. Rouge, endures a twenty-month pregnancy through sheer willpower to throw off suspicion. She gives birth to Gol D. Ace and dies right after; the newborn is secretly entrusted to Garp, who raises him on Dawn Island.",
    },
    period: { it: 'Backstory · era di Roger', en: 'Backstory · Roger era' },
    locationId: 'loc-op-dawn-island',
    characterIds: ['char-op-rouge', 'char-op-ace', 'char-op-garp'],
    mangaChapters: ['550-551'], animeEpisodes: ['457-458'],
    order: -19, canon: c, canonStatus: c, referenceStatus: v, tags: ['ace', 'rouge', 'backstory'],
  },
  {
    id: 'evt-op-sabo-shot', worldId: W,
    title: { it: 'Il colpo al sogno di Sabo', en: "The shot to Sabo's dream" },
    description: {
      it: "Sull'Isola di Dawn, la barca del piccolo Sabo che salpa verso la libertà viene incendiata da un Drago Celeste: i fratelli Rufy e Ace lo credono morto.",
      en: "On Dawn Island, young Sabo's boat setting off toward freedom is shot down by a Celestial Dragon: his brothers Luffy and Ace believe him dead.",
    },
    longDescription: {
      it: "Fratello giurato di Rufy e Ace e figlio ribelle di una famiglia nobile di Goa, Sabo decide di salpare da solo per non vivere nella menzogna del suo rango. La sua piccola barca incrocia per sbaglio la rotta di un Drago Celeste, che la incendia per puro capriccio. Creduto morto, Sabo sopravvive privo di memoria e sarà raccolto dall'Armata Rivoluzionaria di Dragon.",
      en: "Sworn brother of Luffy and Ace and the rebellious son of a noble Goa family, Sabo decides to sail off alone rather than live the lie of his rank. His little boat accidentally crosses a Celestial Dragon's path, who burns it on a whim. Believed dead, Sabo survives with no memory and is taken in by Dragon's Revolutionary Army.",
    },
    period: { it: 'Backstory · Isola di Dawn', en: 'Backstory · Dawn Island' },
    locationId: 'loc-op-goa-kingdom',
    characterIds: ['char-op-sabo', 'char-op-ace', 'char-op-luffy', 'char-op-dragon'],
    factionIds: ['faction-op-revolutionary-army'],
    mangaChapters: ['585'], animeEpisodes: ['497'],
    order: -10, canon: c, canonStatus: c, referenceStatus: v, tags: ['sabo', 'draghi-celesti', 'backstory'],
  },
  {
    id: 'evt-op-sabaody-reunion', worldId: W,
    title: { it: 'La riunione dopo due anni', en: 'The reunion after two years' },
    description: {
      it: "Compiuto l'allenamento, i nove Cappello di Paglia si ritrovano all'Arcipelago Sabaody, più forti che mai, pronti a ripartire verso il New World a bordo della Thousand Sunny.",
      en: "Their training complete, the nine Straw Hats reunite at the Sabaody Archipelago, stronger than ever, ready to set off for the New World aboard the Thousand Sunny.",
    },
    longDescription: {
      it: "Due anni dopo la dispersione, la ciurma torna a Sabaody uno a uno. Tra falsi Cappello di Paglia, l'agguato dei Pacifista e l'aiuto di Rayleigh che ricopre la Thousand Sunny per la discesa, i nove compagni si riabbracciano trasformati dall'addestramento e salpano insieme verso l'Isola degli Uomini-Pesce e il New World.",
      en: "Two years after the scattering, the crew returns to Sabaody one by one. Amid fake Straw Hats, a Pacifista ambush and Rayleigh's help coating the Thousand Sunny for the descent, the nine comrades reunite, transformed by their training, and set off together for Fish-Man Island and the New World.",
    },
    period: { it: 'Saga di Fish-Man Island', en: 'Fish-Man Island Saga' },
    arcId: 'arc-op-fishman-island', locationId: 'loc-op-sabaody',
    characterIds: ['char-op-luffy', 'char-op-zoro', 'char-op-nami', 'char-op-usopp', 'char-op-sanji', 'char-op-chopper', 'char-op-robin', 'char-op-franky', 'char-op-brook', 'char-op-rayleigh'],
    factionIds: ['faction-op-straw-hat-pirates'],
    mangaChapters: ['598-602'], animeEpisodes: ['517-522'],
    order: 58, canon: c, canonStatus: c, referenceStatus: v, tags: ['sabaody', 'timeskip', 'riunione'],
  },
  {
    id: 'evt-op-zou-alliance', worldId: W,
    title: { it: 'Zou e il patto con i mink', en: 'Zou and the pact with the minks' },
    description: {
      it: "Sul dorso dell'elefante Zunesha la ciurma scopre Zou, rifugio dei mink, e — saputo che «Raizo è salvo» — sigla l'alleanza tra Cappello di Paglia, Heart Pirates, mink e samurai Kozuki per Wano.",
      en: "On the back of the elephant Zunesha the crew finds Zou, refuge of the minks, and — learning that 'Raizo is safe' — seals the alliance of Straw Hats, Heart Pirates, minks and Kozuki samurai for Wano.",
    },
    longDescription: {
      it: "Devastata da Jack a caccia del ninja Raizo, Zou rivela ai Cappello di Paglia la tribù dei mink e il legame antico tra i loro sovrani Inuarashi e Nekomamushi e Kozuki Oden. Quando si scopre che «Raizo è salvo», nascosto da sempre dai mink, samurai, pirati e mink stringono il patto che porterà al raid di Onigashima; emerge inoltre il vero erede dei Kozuki, Momonosuke.",
      en: "Ravaged by Jack hunting the ninja Raizo, Zou reveals to the Straw Hats the mink tribe and the ancient bond between their rulers Inuarashi and Nekomamushi and Kozuki Oden. When it turns out 'Raizo is safe', long hidden by the minks, samurai, pirates and minks forge the pact that will lead to the Onigashima raid; the true Kozuki heir, Momonosuke, also emerges.",
    },
    period: { it: 'New World · Zou', en: 'New World · Zou' },
    locationId: 'loc-op-zou',
    characterIds: ['char-op-luffy', 'char-op-law', 'char-op-inuarashi', 'char-op-nekomamushi', 'char-op-kinemon', 'char-op-raizo', 'char-op-momonosuke'],
    factionIds: ['faction-op-kozuki', 'faction-op-heart-pirates', 'faction-op-straw-hat-pirates'],
    mangaChapters: ['802-824'], animeEpisodes: ['751-779'],
    order: 64.7, canon: c, canonStatus: c, referenceStatus: v, tags: ['zou', 'mink', 'kozuki', 'alleanza'],
  },
  {
    id: 'evt-op-reverie-cobra', worldId: W,
    title: { it: 'La Reverie e la fine di Re Cobra', en: 'The Reverie and the end of King Cobra' },
    description: {
      it: "Alla Reverie di Mary Geoise, dopo aver appreso un segreto sul Trono Vuoto, Re Cobra di Alabasta viene ucciso e Vivi sparisce; Sabo si scontra con gli ammiragli.",
      en: "At the Mary Geoise Reverie, after learning a secret of the Empty Throne, King Cobra of Alabasta is killed and Vivi vanishes; Sabo clashes with the admirals.",
    },
    longDescription: {
      it: "Durante il consiglio mondiale, Re Cobra Nefertari pone agli Astri di Saggezza una domanda proibita sul nome «D.» e sul potere che siede sul Trono Vuoto, Imu: pochi istanti dopo viene ucciso, e sua figlia Vivi scompare. Negli stessi giorni Sabo e i rivoluzionari liberano lo schiavo Kuma e affrontano gli ammiragli, mentre il mondo riceve la notizia (falsa) della morte di Sabo.",
      en: "During the world council, King Cobra Nefertari asks the Five Elders a forbidden question about the name 'D.' and the power on the Empty Throne, Imu: moments later he is killed, and his daughter Vivi disappears. In the same days Sabo and the revolutionaries free the slave Kuma and clash with the admirals, while the world receives the (false) news of Sabo's death.",
    },
    period: { it: 'Mary Geoise · Reverie', en: 'Mary Geoise · Reverie' },
    arcId: 'arc-op-reverie', locationId: 'loc-op-mary-geoise',
    characterIds: ['char-op-cobra', 'char-op-sabo', 'char-op-imu', 'char-op-kuma'],
    factionIds: ['faction-op-world-government', 'faction-op-revolutionary-army'],
    mangaChapters: ['905-908'], animeEpisodes: ['883-889'],
    order: 70.5, canon: c, canonStatus: c, referenceStatus: v, tags: ['reverie', 'cobra', 'imu', 'sabo'],
  },
  {
    id: 'evt-op-kuma-final-ride', worldId: W,
    title: { it: "L'ultima marcia di Kuma", en: "Kuma's final ride" },
    description: {
      it: "Mosso da un ultimo barlume di volontà, il Pacifista Bartholomew Kuma attraversa mezzo mondo per raggiungere la figlia Bonney a Egghead.",
      en: "Moved by a last flicker of will, the Pacifista Bartholomew Kuma travels half the world to reach his daughter Bonney on Egghead.",
    },
    longDescription: {
      it: "Ormai privo di volontà e dato per perso, Kuma riattiva un ultimo, miracoloso impulso del proprio cuore di padre: fugge dalla Marina e percorre in moto e in volo distanze enormi per raggiungere Bonney sull'isola di Egghead, riaccendendo il filo del suo destino proprio mentre il Governo Mondiale stringe l'assedio.",
      en: "Now will-less and given up for lost, Kuma reignites one last, miraculous impulse of his father's heart: he escapes the Marines and crosses immense distances by bike and by flight to reach Bonney on Egghead island, rekindling the thread of his fate just as the World Government closes its siege.",
    },
    period: { it: 'New World · Egghead', en: 'New World · Egghead' },
    arcId: 'arc-op-egghead', locationId: 'loc-op-egghead',
    characterIds: ['char-op-kuma', 'char-op-bonney'],
    factionIds: ['faction-op-revolutionary-army'],
    mangaChapters: ['1092-1102'], animeEpisodes: ['1118-1122'],
    order: 71.9, canon: c, canonStatus: c, referenceStatus: v, tags: ['egghead', 'kuma', 'bonney'],
  },
];
