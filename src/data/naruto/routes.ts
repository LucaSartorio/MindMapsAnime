import type { Route } from '@/types';

/**
 * Percorsi narrativi seed di Naruto.
 * Le linee tracciate tra location sono concettuali, non distanze reali.
 *
 * Coordinate dei nodi sono prese dai luoghi (vedi `locations.ts`)
 * nel sistema del viewBox 1500 x 882.2204.
 */
export const narutoRoutes: Route[] = [
  {
    id: 'route-team7-waves',
    worldId: 'world-naruto',
    name: 'Team 7 · Missione nel Paese delle Onde',
    localizedName: { it: 'Team 7 · Missione nel Paese delle Onde', en: 'Team 7 · Mission to the Land of Waves' },
    description: {
      it: 'Naruto, Sasuke, Sakura e Kakashi scortano Tazuna nel Paese delle Onde.',
      en: 'Naruto, Sasuke, Sakura and Kakashi escort Tazuna to the Land of Waves.',
    },
    protagonistCharacterIds: [
      'char-naruto',
      'char-sasuke',
      'char-sakura',
      'char-kakashi',
    ],
    arcId: 'arc-prologue',
    mangaChapters: ['1-33'],
    animeEpisodes: ['ep. 1-19'],
    color: '#1f9aff',
    steps: [
      { order: 1, locationId: 'loc-konoha', label: {
        it: 'Partenza da Konoha',
        en: 'Departure from Konoha',
      } },
      {
        order: 2,
        locationId: 'loc-naruto-bridge',
        label: { it: 'Paese delle Onde', en: 'Land of Waves' },
        eventId: 'ev-waves-mission',
      },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-chunin-exams',
    worldId: 'world-naruto',
    name: 'Esami Chunin · spostamenti',
    localizedName: { it: 'Esami Chunin · spostamenti', en: 'Chunin Exams · movements' },
    description: {
      it: 'Spostamenti dei team per gli Esami Chunin a Konoha.',
      en: "The teams' movements for the Chunin Exams in Konoha.",
    },
    protagonistCharacterIds: ['char-naruto', 'char-sasuke', 'char-sakura'],
    arcId: 'arc-chunin-exams',
    mangaChapters: ['34-115'],
    animeEpisodes: ['ep. 20-67'],
    color: '#ff9f3f',
    steps: [
      { order: 1, locationId: 'loc-suna', label: {
        it: 'Suna arriva a Konoha',
        en: 'Suna arrives in Konoha',
      } },
      { order: 2, locationId: 'loc-konoha', label: { it: 'Prima fase', en: 'First stage' } },
      { order: 3, locationId: 'loc-forest-of-death', label: {
        it: 'Foresta della Morte',
        en: 'Forest of Death',
      }, eventId: 'ev-forest-of-death' },
      { order: 4, locationId: 'loc-konoha', label: { it: 'Torneo finale', en: 'Final tournament' }, eventId: 'ev-chunin-tournament' },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-konoha-crush',
    worldId: 'world-naruto',
    name: 'Invasione di Konoha',
    localizedName: { it: 'Invasione di Konoha', en: 'Invasion of Konoha' },
    description: {
      it: 'L\'invasione di Konoha orchestrata da Orochimaru con Suna e Oto.',
      en: 'The invasion of Konoha orchestrated by Orochimaru with Suna and Oto.',
    },
    protagonistCharacterIds: ['char-orochimaru', 'char-hiruzen'],
    arcId: 'arc-konoha-crush',
    mangaChapters: ['116-138'],
    animeEpisodes: ['ep. 68-80'],
    color: '#7d0606',
    steps: [
      { order: 1, locationId: 'loc-oto', label: {
        it: 'Preparativi a Otogakure',
        en: 'Preparations in Otogakure',
      } },
      { order: 2, locationId: 'loc-suna', label: {
        it: 'Alleanza con Suna',
        en: 'Alliance with Suna',
      } },
      { order: 3, locationId: 'loc-konoha', label: {
        it: 'Attacco a Konoha',
        en: 'Attack on Konoha',
      }, eventId: 'ev-konoha-crush' },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-search-tsunade',
    worldId: 'world-naruto',
    name: 'Ricerca di Tsunade',
    localizedName: { it: 'Ricerca di Tsunade', en: 'Search for Tsunade' },
    description: {
      it: 'Jiraiya e Naruto attraversano il Paese del Fuoco per trovare Tsunade.',
      en: 'Jiraiya and Naruto cross the Land of Fire to find Tsunade.',
    },
    protagonistCharacterIds: ['char-jiraiya', 'char-naruto', 'char-tsunade'],
    arcId: 'arc-search-tsunade',
    mangaChapters: ['139-171'],
    animeEpisodes: ['ep. 81-100'],
    color: '#86cdff',
    steps: [
      { order: 1, locationId: 'loc-konoha', label: { it: 'Partenza', en: 'Departure' } },
      { order: 2, locationId: 'loc-konoha-ichiraku', label: {
        it: 'Allenamento Rasengan',
        en: 'Rasengan training',
      } },
      { order: 3, locationId: 'loc-shikkotsu-forest', label: {
        it: 'Incontro con Tsunade',
        en: 'Meeting Tsunade',
      } },
      { order: 4, locationId: 'loc-konoha', label: {
        it: 'Ritorno a Konoha',
        en: 'Return to Konoha',
      }, eventId: 'ev-tsunade-hokage' },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-sasuke-defection',
    worldId: 'world-naruto',
    name: 'Sasuke · Fuga da Konoha',
    localizedName: { it: 'Sasuke · Fuga da Konoha', en: 'Sasuke · Leaving Konoha' },
    description: {
      it: 'Sasuke abbandona Konoha per cercare potere da Orochimaru.',
      en: 'Sasuke leaves Konoha to seek power from Orochimaru.',
    },
    protagonistCharacterIds: ['char-sasuke'],
    arcId: 'arc-sasuke-retrieval',
    mangaChapters: ['172-238'],
    animeEpisodes: ['ep. 107-135'],
    color: '#e10b0b',
    steps: [
      { order: 1, locationId: 'loc-konoha-main-gate', label: { it: 'Diserzione', en: 'Desertion' }, eventId: 'ev-sasuke-defection' },
      { order: 2, locationId: 'loc-valley-of-end', label: {
        it: 'Duello con Naruto',
        en: 'Duel with Naruto',
      }, eventId: 'ev-valley-end-1' },
      { order: 3, locationId: 'loc-orochimaru-hideout', label: {
        it: 'Nascondiglio di Orochimaru',
        en: "Orochimaru's hideout",
      } },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-sasuke-retrieval',
    worldId: 'world-naruto',
    name: 'Recupero di Sasuke',
    localizedName: { it: 'Recupero di Sasuke', en: 'Sasuke Recovery' },
    description: {
      it: 'Squadra Shikamaru inseguita dai Sound Four lungo il Paese del Fuoco.',
      en: "Shikamaru's squad pursued by the Sound Four across the Land of Fire.",
    },
    protagonistCharacterIds: [
      'char-naruto',
      'char-shikamaru',
      'char-neji',
      'char-rock-lee',
    ],
    arcId: 'arc-sasuke-retrieval',
    mangaChapters: ['172-238'],
    animeEpisodes: ['ep. 107-135'],
    color: '#f06600',
    steps: [
      { order: 1, locationId: 'loc-konoha-main-gate', label: { it: 'Partenza', en: 'Departure' }, eventId: 'ev-sound-four-pursuit' },
      { order: 2, locationId: 'loc-konoha-nara-forest', label: {
        it: 'Strategia di Shikamaru',
        en: "Shikamaru's strategy",
      } },
      { order: 3, locationId: 'loc-valley-of-end', label: {
        it: 'Naruto raggiunge Sasuke',
        en: 'Naruto catches up with Sasuke',
      } },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-kazekage-rescue',
    worldId: 'world-naruto',
    name: 'Salvataggio del Kazekage',
    localizedName: { it: 'Salvataggio del Kazekage', en: 'Kazekage Rescue' },
    description: {
      it: 'Team 7 e Team Guy partono da Konoha verso il Paese dei Fiumi.',
      en: 'Team 7 and Team Guy set out from Konoha towards the Land of Rivers.',
    },
    protagonistCharacterIds: [
      'char-naruto',
      'char-sakura',
      'char-kakashi',
      'char-gaara',
      'char-guy',
    ],
    arcId: 'arc-kazekage-rescue',
    mangaChapters: ['245-281'],
    animeEpisodes: ['Shippuden ep. 1-32'],
    color: '#d4be78',
    steps: [
      { order: 1, locationId: 'loc-konoha', label: {
        it: 'Allarme dalla Sabbia',
        en: 'Alarm from the Sand',
      } },
      { order: 2, locationId: 'loc-suna', label: {
        it: 'Suna · rapimento di Gaara',
        en: "Suna · Gaara's abduction",
      }, eventId: 'ev-gaara-kidnap' },
      { order: 3, locationId: 'loc-akatsuki-rivers', label: {
        it: 'Caverna di sigillamento',
        en: 'Sealing cave',
      }, eventId: 'ev-gaara-rescue' },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-tenchi-bridge',
    worldId: 'world-naruto',
    name: 'Ponte Tenchi',
    localizedName: { it: 'Ponte Tenchi', en: 'Tenchi Bridge' },
    description: {
      it: 'Team Kakashi incontra la spia di Sasori e scopre Sai.',
      en: "Team Kakashi meets Sasori's spy and discovers Sai.",
    },
    protagonistCharacterIds: ['char-naruto', 'char-sakura', 'char-orochimaru'],
    arcId: 'arc-tenchi-bridge',
    mangaChapters: ['282-310'],
    animeEpisodes: ['Shippuden ep. 33-53'],
    color: '#62b8c4',
    steps: [
      { order: 1, locationId: 'loc-konoha', label: { it: 'Partenza', en: 'Departure' } },
      { order: 2, locationId: 'loc-samurai-bridge', label: {
        it: 'Tenchi Bridge',
        en: 'Tenchi Bridge',
      }, eventId: 'ev-tenchi-bridge' },
      { order: 3, locationId: 'loc-orochimaru-hideout', label: {
        it: 'Nascondiglio',
        en: 'Hideout',
      } },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-itachi-pursuit',
    worldId: 'world-naruto',
    name: 'Ricerca di Itachi',
    localizedName: { it: 'Ricerca di Itachi', en: 'Search for Itachi' },
    description: {
      it: 'Sasuke insegue Itachi attraverso i nascondigli di Orochimaru.',
      en: "Sasuke pursues Itachi through Orochimaru's hideouts.",
    },
    protagonistCharacterIds: ['char-sasuke'],
    arcId: 'arc-itachi-pursuit',
    mangaChapters: ['343-369'],
    animeEpisodes: ['Shippuden ep. 113-118'],
    color: '#b00808',
    steps: [
      { order: 1, locationId: 'loc-orochimaru-hideout', label: { it: 'Hebi', en: 'Hebi' } },
      { order: 2, locationId: 'loc-orochimaru-hideout', label: {
        it: 'Scontro con Itachi',
        en: 'Clash with Itachi',
      }, eventId: 'ev-itachi-vs-sasuke' },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-akatsuki',
    worldId: 'world-naruto',
    name: 'Movimento Akatsuki',
    localizedName: { it: 'Movimento Akatsuki', en: 'Akatsuki movements' },
    description: {
      it: 'Spostamenti operativi dell\'Akatsuki ad Amegakure e oltre.',
      en: 'Akatsuki operational movements in Amegakure and beyond.',
    },
    protagonistCharacterIds: ['char-itachi', 'char-pain', 'char-obito'],
    mangaChapters: ['139-144', '245-281', '403-449'],
    animeEpisodes: ['ep. 83-84', 'Shippuden ep. 1-32', 'Shippuden ep. 152-175'],
    color: '#7d0606',
    steps: [
      { order: 1, locationId: 'loc-akatsuki-hq', label: {
        it: 'Quartier generale',
        en: 'Headquarters',
      } },
      { order: 2, locationId: 'loc-ame', label: { it: 'Amegakure', en: 'Amegakure' } },
      { order: 3, locationId: 'loc-suna', label: {
        it: 'Rapimento di Gaara',
        en: "Gaara's abduction",
      }, eventId: 'ev-gaara-kidnap' },
      { order: 4, locationId: 'loc-konoha', label: { it: 'Assalto di Pain', en: "Pain's Assault" }, eventId: 'ev-pain-attack' },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-jiraiya',
    worldId: 'world-naruto',
    name: 'Jiraiya verso Amegakure',
    localizedName: { it: 'Jiraiya verso Amegakure', en: 'Jiraiya to Amegakure' },
    description: {
      it: 'Dal Monte Myōboku alle ricerche su Akatsuki ad Amegakure.',
      en: 'From Mount Myōboku to investigating the Akatsuki in Amegakure.',
    },
    protagonistCharacterIds: ['char-jiraiya'],
    arcId: 'arc-jiraiya-gallant',
    mangaChapters: ['370-383'],
    animeEpisodes: ['Shippuden ep. 127-133'],
    color: '#86cdff',
    steps: [
      { order: 1, locationId: 'loc-konoha', label: { it: 'Konoha', en: 'Konoha' } },
      { order: 2, locationId: 'loc-mt-myoboku', label: { it: 'Mt. Myōboku', en: 'Mt. Myōboku' } },
      { order: 3, locationId: 'loc-ame', label: { it: 'Infiltrazione', en: 'Infiltration' }, eventId: 'ev-jiraiya-vs-pain' },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-pain-assault',
    worldId: 'world-naruto',
    name: 'Assalto di Pain',
    localizedName: { it: 'Assalto di Pain', en: "Pain's Assault" },
    description: {
      it: 'I sei corpi di Pain lasciano Amegakure per attaccare Konoha.',
      en: "Pain's six bodies leave Amegakure to attack Konoha.",
    },
    protagonistCharacterIds: ['char-pain'],
    arcId: 'arc-pain-assault',
    mangaChapters: ['403-449'],
    animeEpisodes: ['Shippuden ep. 152-175'],
    color: '#6aa8d8',
    steps: [
      { order: 1, locationId: 'loc-ame', label: {
        it: 'Partenza da Amegakure',
        en: 'Departure from Amegakure',
      } },
      { order: 2, locationId: 'loc-konoha', label: {
        it: 'Attacco a Konoha',
        en: 'Attack on Konoha',
      }, eventId: 'ev-pain-attack' },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-five-kage-summit',
    worldId: 'world-naruto',
    name: 'Summit dei Cinque Kage',
    localizedName: { it: 'Summit dei Cinque Kage', en: 'Five Kage Summit' },
    description: {
      it: 'I Kage convergono nel Paese del Ferro. Sasuke attacca il vertice.',
      en: 'The Kage converge on the Land of Iron. Sasuke attacks the summit.',
    },
    protagonistCharacterIds: ['char-sasuke'],
    arcId: 'arc-five-kage-summit',
    mangaChapters: ['450-483'],
    animeEpisodes: ['Shippuden ep. 197-214'],
    color: '#c8ccd6',
    steps: [
      { order: 1, locationId: 'loc-konoha', label: {
        it: 'Tsunade incapace · Danzo',
        en: 'Tsunade incapacitated · Danzo',
      } },
      { order: 2, locationId: 'loc-five-kage-meeting', label: { it: 'Summit', en: 'Summit' }, eventId: 'ev-five-kage-summit' },
      { order: 3, locationId: 'loc-five-kage-meeting', label: {
        it: 'Attacco di Sasuke',
        en: "Sasuke's attack",
      }, eventId: 'ev-iron-summit-attack' },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-turtle-island',
    worldId: 'world-naruto',
    name: 'Viaggio verso l\'Isola Tartaruga',
    localizedName: { it: "Viaggio verso l'Isola Tartaruga", en: 'Journey to Island Turtle' },
    description: {
      it: 'Naruto raggiunge l\'Isola Tartaruga per allenarsi a controllare Kurama.',
      en: 'Naruto reaches Island Turtle to train in controlling Kurama.',
    },
    protagonistCharacterIds: ['char-naruto'],
    arcId: 'arc-fourth-war-countdown',
    mangaChapters: ['484-515'],
    animeEpisodes: ['Shippuden ep. 215-222'],
    color: '#5dc1d6',
    steps: [
      { order: 1, locationId: 'loc-konoha', label: {
        it: 'Partenza segreta',
        en: 'Secret departure',
      } },
      { order: 2, locationId: 'loc-turtle-island', label: {
        it: 'Allenamento Kurama',
        en: 'Kurama training',
      }, eventId: 'ev-naruto-killer-b-train' },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-fourth-war',
    worldId: 'world-naruto',
    name: 'Quarta Guerra Ninja',
    localizedName: { it: 'Quarta Guerra Ninja', en: 'Fourth Shinobi World War' },
    description: {
      it: 'Spostamento dell\'Alleanza Shinobi sui fronti della guerra.',
      en: 'The Shinobi Alliance deploys to the war fronts.',
    },
    protagonistCharacterIds: [
      'char-naruto',
      'char-sasuke',
      'char-kakashi',
      'char-gaara',
    ],
    arcId: 'arc-fourth-war',
    mangaChapters: ['516-699'],
    animeEpisodes: ['Shippuden ep. 261-479'],
    color: '#ff8311',
    steps: [
      { order: 1, locationId: 'loc-konoha', label: {
        it: 'Dichiarazione di guerra',
        en: 'Declaration of war',
      }, eventId: 'ev-war-declaration' },
      { order: 2, locationId: 'loc-fourth-war-battlefield', label: {
        it: 'Fronti principali',
        en: 'Main fronts',
      }, eventId: 'ev-edo-tensei-army' },
      { order: 3, locationId: 'loc-kaguya-dimensions', label: {
        it: 'Dimensioni Kaguya',
        en: "Kaguya's dimensions",
      }, eventId: 'ev-team-7-vs-kaguya' },
      { order: 4, locationId: 'loc-valley-of-end', label: { it: 'Duello finale', en: 'Final duel' }, eventId: 'ev-valley-end-2' },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-obito',
    worldId: 'world-naruto',
    name: 'Obito · La maschera dietro Tobi',
    localizedName: { it: 'Obito · La maschera dietro Tobi', en: 'Obito · The mask behind Tobi' },
    description: {
      it: 'Dal ponte Kannabi al campo della Quarta Guerra.',
      en: 'From Kannabi Bridge to the battlefield of the Fourth War.',
    },
    protagonistCharacterIds: ['char-obito'],
    mangaChapters: ['243-244', '516-657'],
    animeEpisodes: ['Shippuden ep. 119-120', 'Shippuden ep. 261-375'],
    color: '#4cb6ff',
    steps: [
      { order: 1, locationId: 'loc-kannabi-bridge', label: { it: 'Kannabi', en: 'Kannabi' }, eventId: 'ev-kannabi-bridge' },
      { order: 2, locationId: 'loc-mountains-graveyard', label: {
        it: 'Mountains\' Graveyard · con Madara',
        en: "Mountains' Graveyard · with Madara",
      } },
      { order: 3, locationId: 'loc-konoha', label: {
        it: 'Attacco di Kurama',
        en: "Kurama's attack",
      }, eventId: 'ev-kurama-attack' },
      { order: 4, locationId: 'loc-akatsuki-hq', label: {
        it: 'Mente Akatsuki',
        en: 'Akatsuki mastermind',
      } },
      { order: 5, locationId: 'loc-fourth-war-battlefield', label: {
        it: 'Quarta Guerra',
        en: 'Fourth War',
      }, eventId: 'ev-obito-vs-kakashi' },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-itachi',
    worldId: 'world-naruto',
    name: 'Itachi · Doppio agente',
    localizedName: { it: 'Itachi · Doppio agente', en: 'Itachi · Double agent' },
    description: {
      it: 'Dalla strage Uchiha al confronto finale con Sasuke.',
      en: 'From the Uchiha massacre to the final confrontation with Sasuke.',
    },
    protagonistCharacterIds: ['char-itachi'],
    mangaChapters: ['222-225', '343-402'],
    animeEpisodes: ['Shippuden ep. 141-143', 'Shippuden ep. 113-143'],
    color: '#b00808',
    steps: [
      { order: 1, locationId: 'loc-konoha-uchiha-district', label: {
        it: 'Strage del clan',
        en: 'Clan massacre',
      }, eventId: 'ev-uchiha-massacre' },
      { order: 2, locationId: 'loc-akatsuki-hq', label: { it: 'Akatsuki', en: 'Akatsuki' } },
      { order: 3, locationId: 'loc-orochimaru-hideout', label: {
        it: 'Scontro con Sasuke',
        en: 'Clash with Sasuke',
      }, eventId: 'ev-itachi-vs-sasuke' },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-naruto-training',
    worldId: 'world-naruto',
    name: 'Naruto · Allenamenti principali',
    localizedName: { it: 'Naruto · Allenamenti principali', en: 'Naruto · Main training' },
    description: {
      it: 'Da Konoha a Mt. Myōboku passando per gli allenamenti con Jiraiya.',
      en: 'From Konoha to Mt. Myōboku, by way of training with Jiraiya.',
    },
    protagonistCharacterIds: ['char-naruto'],
    mangaChapters: ['1-515'],
    animeEpisodes: ['ep. 1-220', 'Shippuden ep. 1-256'],
    color: '#f06600',
    steps: [
      { order: 1, locationId: 'loc-konoha-training-7', label: {
        it: 'Team 7 / Prova dei sonagli',
        en: 'Team 7 / Bell test',
      }, eventId: 'ev-team-7-formed' },
      { order: 2, locationId: 'loc-konoha', label: {
        it: 'Allenamento Rasengan',
        en: 'Rasengan training',
      }, eventId: 'ev-rasengan-mastery' },
      { order: 3, locationId: 'loc-mt-myoboku', label: {
        it: 'Allenamento Sage Mode',
        en: 'Sage Mode training',
      }, eventId: 'ev-naruto-sage-mode' },
      { order: 4, locationId: 'loc-turtle-island', label: {
        it: 'Controllo Kurama',
        en: 'Controlling Kurama',
      }, eventId: 'ev-naruto-killer-b-train' },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-sasuke-arc',
    worldId: 'world-naruto',
    name: 'Sasuke · Hebi → Taka → Summit',
    localizedName: { it: 'Sasuke · Hebi → Taka → Summit', en: 'Sasuke · Hebi → Taka → Summit' },
    description: {
      it: 'Sasuke da Hebi a Taka, fino all\'attacco al Summit dei Kage.',
      en: 'Sasuke from Hebi to Taka, up to the attack on the Kage Summit.',
    },
    protagonistCharacterIds: ['char-sasuke'],
    mangaChapters: ['343-483'],
    animeEpisodes: ['Shippuden ep. 113-214'],
    color: '#7d0606',
    steps: [
      { order: 1, locationId: 'loc-orochimaru-hideout', label: {
        it: 'Sasuke supera Orochimaru',
        en: 'Sasuke overpowers Orochimaru',
      }, eventId: 'ev-sasuke-killing-orochimaru' },
      { order: 2, locationId: 'loc-akatsuki-hq', label: {
        it: 'Tobi rivela la verità',
        en: 'Tobi reveals the truth',
      }, eventId: 'ev-tobi-reveals-truth' },
      { order: 3, locationId: 'loc-five-kage-meeting', label: {
        it: 'Attacco al Summit',
        en: 'Attack on the Summit',
      }, eventId: 'ev-iron-summit-attack' },
    ],
    referenceStatus: 'verified',
  },
  {
    id: 'route-final-battle',
    worldId: 'world-naruto',
    name: 'Battaglia finale alla Valle della Fine',
    localizedName: { it: 'Battaglia finale alla Valle della Fine', en: 'Final battle at the Valley of the End' },
    description: {
      it: 'Dalla dimensione Kaguya al duello conclusivo Naruto vs Sasuke.',
      en: "From Kaguya's dimension to the final duel between Naruto and Sasuke.",
    },
    protagonistCharacterIds: ['char-naruto', 'char-sasuke'],
    arcId: 'arc-final-battle',
    mangaChapters: ['693-699'],
    animeEpisodes: ['Shippuden ep. 474-479'],
    color: '#e10b0b',
    steps: [
      { order: 1, locationId: 'loc-kaguya-dimensions', label: {
        it: 'Sigillamento Kaguya',
        en: 'Sealing Kaguya',
      }, eventId: 'ev-team-7-vs-kaguya' },
      { order: 2, locationId: 'loc-valley-of-end', label: { it: 'Duello finale', en: 'Final duel' }, eventId: 'ev-valley-end-2' },
    ],
    referenceStatus: 'verified',
  },
];
