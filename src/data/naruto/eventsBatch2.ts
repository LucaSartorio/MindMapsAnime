import type { Localizable, TimelineEvent } from '@/types';

/**
 * Eventi timeline Naruto · Batch 2 — revisione di completezza.
 *
 * Copre i buchi del primo inventario: le origini (cercoteri, morte di Tobirama,
 * Rin, l'incidente Hyūga), gli scontri di Parte I e Shippuden rimasti senza
 * evento (i Sannin a Tanzaku, Kimimaro, Kakuzu, Hebi, Kakashi contro Pain, la
 * confessione di Hinata, Kisame, gli Hokage riportati in vita, lo Tsukuyomi
 * Infinito) e l'era Boruto fino a Two Blue Vortex. L'`order` definitivo è
 * assegnato dalla cronologia in `eventsChronology.ts`.
 */
const ev = (
  e: Omit<TimelineEvent, 'worldId' | 'canon' | 'canonStatus' | 'referenceStatus' | 'order'> & {
    canon?: TimelineEvent['canon'];
    referenceStatus?: TimelineEvent['referenceStatus'];
  },
): TimelineEvent => {
  const canon = e.canon ?? 'canon';
  return { worldId: 'world-naruto', referenceStatus: 'verified', order: 0, ...e, canon, canonStatus: canon };
};

const PRE: Localizable = { it: 'Pre-serie', en: 'Pre-series' };
const P1: Localizable = { it: 'Naruto Parte I', en: 'Naruto Part I' };
const P2: Localizable = { it: 'Naruto Shippuden', en: 'Naruto Shippuden' };
const WAR: Localizable = { it: 'Quarta Guerra Ninja', en: 'Fourth Shinobi World War' };
const BORUTO: Localizable = { it: 'Era Boruto', en: 'Boruto Era' };
const TBV: Localizable = { it: 'Boruto: Two Blue Vortex', en: 'Boruto: Two Blue Vortex' };

export const narutoEventsBatch2: TimelineEvent[] = [
  /* ================================ ORIGINI ================================ */
  ev({
    id: 'ev-tailed-beasts-captured',
    title: { it: 'Hashirama cattura i cercoteri', en: 'Hashirama captures the Tailed Beasts' },
    description: {
      it: "Con il Mokuton Hashirama doma i cercoteri e li distribuisce alle grandi nazioni per mantenere l'equilibrio fra i villaggi. Dopo la battaglia con Madara, la Volpe a Nove Code viene sigillata nella moglie Mito Uzumaki, prima jinchūriki di Kurama.",
      en: "With Wood Release Hashirama tames the Tailed Beasts and distributes them among the great nations to keep the balance between villages. After the battle with Madara, the Nine-Tailed Fox is sealed inside his wife Mito Uzumaki, Kurama's first jinchūriki.",
    },
    period: PRE,
    arcId: 'arc-pre-series',
    locationId: 'loc-konoha',
    characterIds: ['char-hashirama', 'char-mito', 'char-madara', 'char-kurama'],
    tags: ['cercoteri', 'jinchuriki', 'cercoterio'],
  }),
  ev({
    id: 'ev-tobirama-death',
    title: { it: 'La morte di Tobirama', en: "Tobirama's death" },
    description: {
      it: "Durante un'imboscata dei Fratelli d'Oro e d'Argento di Kumo, Tobirama resta indietro per coprire la fuga della sua squadra e nomina Hiruzen Sarutobi suo successore come Terzo Hokage.",
      en: "During an ambush by Kumo's Gold and Silver Brothers, Tobirama stays behind to cover his team's escape and names Hiruzen Sarutobi his successor as Third Hokage.",
    },
    period: PRE,
    arcId: 'arc-pre-series',
    characterIds: ['char-tobirama', 'char-hiruzen', 'char-danzo', 'char-koharu', 'char-homura', 'char-kinkaku', 'char-ginkaku'],
    tags: ['hokage'],
  }),
  ev({
    id: 'ev-rin-death',
    title: { it: 'La morte di Rin', en: "Rin's death" },
    description: {
      it: "Kirigakure sigilla il Tre Code dentro Rin perché esploda a Konoha. Rin si getta sul Mille Falchi di Kakashi per impedirlo. Obito, testimone della scena, risveglia il Mangekyō, stermina i ninja della Nebbia e si consegna a Madara.",
      en: "Kirigakure seals the Three-Tails inside Rin so that she will unleash it on Konoha. Rin throws herself onto Kakashi's Chidori to prevent it. Obito, witnessing the scene, awakens his Mangekyō, slaughters the Mist ninja and gives himself to Madara.",
    },
    period: PRE,
    arcId: 'arc-pre-series',
    characterIds: ['char-rin', 'char-kakashi', 'char-obito', 'char-isobu', 'char-madara'],
    tags: ['team-minato', 'lutto'],
  }),
  ev({
    id: 'ev-hyuga-affair',
    title: { it: "L'incidente Hyūga", en: 'The Hyūga Affair' },
    description: {
      it: "Un capo ninja di Kumo, in visita per la pace, tenta di rapire la piccola Hinata; Hiashi lo uccide. Per evitare la guerra Kumo pretende il corpo di Hiashi, e il fratello gemello Hizashi del ramo cadetto si sacrifica al suo posto: è l'origine del rancore di Neji.",
      en: "A Kumo head ninja, visiting for peace, tries to kidnap little Hinata; Hiashi kills him. To avoid war Kumo demands Hiashi's body, and his twin brother Hizashi of the branch family sacrifices himself in his place: it is the root of Neji's resentment.",
    },
    period: PRE,
    arcId: 'arc-pre-series',
    locationId: 'loc-konoha-hyuga-compound',
    characterIds: ['char-hiashi', 'char-hizashi', 'char-hinata', 'char-neji'],
    tags: ['hyuga'],
  }),
  ev({
    id: 'ev-pain-kills-hanzo',
    title: { it: 'Pain conquista Amegakure', en: 'Pain takes over Amegakure' },
    description: {
      it: "Dopo la morte di Yahiko, Nagato — con le Sei Vie di Pain — si vendica di Hanzo della Salamandra e ne stermina il clan. Ame passa sotto il controllo di Pain e Konan, che la governano come un dio e il suo angelo.",
      en: "After Yahiko's death, Nagato — with the Six Paths of Pain — takes revenge on Hanzo of the Salamander and wipes out his clan. Ame falls under the control of Pain and Konan, who rule it as a god and his angel.",
    },
    period: PRE,
    arcId: 'arc-pre-series',
    locationId: 'loc-ame',
    characterIds: ['char-nagato', 'char-pain', 'char-konan', 'char-hanzo'],
    tags: ['akatsuki', 'ame'],
  }),
  /* ================================ PARTE I ================================ */
  ev({
    id: 'ev-sannin-battle-tanzaku',
    title: { it: 'La battaglia dei Sannin', en: 'The battle of the Sannin' },
    description: {
      it: "A Tanzaku Orochimaru chiede a Tsunade di curargli le braccia in cambio della resurrezione del fratello e dell'amato. Tsunade sceglie Naruto: i tre Ninja Leggendari si affrontano con le loro evocazioni, e Naruto colpisce Kabuto con il primo Rasengan.",
      en: "In Tanzaku Orochimaru asks Tsunade to heal his arms in exchange for bringing back her brother and her lover. Tsunade chooses Naruto: the three Legendary Ninja clash with their summons, and Naruto hits Kabuto with his first Rasengan.",
    },
    period: P1,
    arcId: 'arc-search-tsunade',
    locationId: 'loc-tanzaku-town',
    characterIds: ['char-tsunade', 'char-jiraiya', 'char-orochimaru', 'char-kabuto', 'char-naruto', 'char-shizune', 'char-gamabunta', 'char-manda', 'char-katsuyu'],
    mangaChapters: ['~161-170'],
    animeEpisodes: ['ep. 92-94'],
    tags: ['sannin', 'scontro'],
  }),
  ev({
    id: 'ev-kimimaro-vs-lee-gaara',
    title: { it: 'Rock Lee e Gaara contro Kimimaro', en: 'Rock Lee and Gaara vs Kimimaro' },
    description: {
      it: "Durante l'inseguimento di Sasuke, Rock Lee — appena operato — e Gaara affrontano Kimimaro, l'ultimo del clan Kaguya, che combatte con le proprie ossa. Lo sconfiggono a stento: Kimimaro muore per la malattia che lo divorava.",
      en: "During the pursuit of Sasuke, Rock Lee — just out of surgery — and Gaara face Kimimaro, the last of the Kaguya clan, who fights with his own bones. They barely defeat him: Kimimaro dies of the illness that was consuming him.",
    },
    period: P1,
    arcId: 'arc-sasuke-retrieval',
    characterIds: ['char-rock-lee', 'char-gaara', 'char-kimimaro'],
    mangaChapters: ['~210-217'],
    animeEpisodes: ['ep. 120-126'],
    tags: ['scontro'],
  }),
  /* =============================== SHIPPUDEN =============================== */
  ev({
    id: 'ev-kakuzu-defeated',
    title: { it: 'Il Rasen Shuriken contro Kakuzu', en: 'The Rasenshuriken against Kakuzu' },
    description: {
      it: "Naruto arriva sul campo con il Futon: Rasen Shuriken appena completato e lo scaglia contro Kakuzu, distruggendone i cuori di riserva. Kakashi finisce l'immortale dell'Akatsuki con il Taglio del Fulmine.",
      en: "Naruto arrives on the battlefield with the freshly completed Wind Release: Rasenshuriken and hurls it at Kakuzu, destroying his spare hearts. Kakashi finishes off the Akatsuki immortal with the Lightning Blade.",
    },
    period: P2,
    arcId: 'arc-akatsuki-suppression',
    characterIds: ['char-naruto', 'char-kakuzu', 'char-kakashi', 'char-yamato', 'char-sai', 'char-sakura', 'char-choji', 'char-ino'],
    mangaChapters: ['~338-342'],
    animeEpisodes: ['ep. 87-88'],
    tags: ['akatsuki', 'scontro', 'rasenshuriken'],
  }),
  ev({
    id: 'ev-hebi-formed',
    title: { it: 'Nasce il team Hebi', en: 'Team Hebi is formed' },
    description: {
      it: "Dopo aver assorbito Orochimaru, Sasuke libera Suigetsu dalla vasca in cui era tenuto, recluta Karin e convince Jugo a seguirlo: il team Hebi parte a caccia di Itachi.",
      en: "After absorbing Orochimaru, Sasuke frees Suigetsu from the tank he was kept in, recruits Karin and persuades Jugo to follow him: Team Hebi sets off to hunt Itachi.",
    },
    period: P2,
    arcId: 'arc-itachi-pursuit',
    locationId: 'loc-orochimaru-hideout',
    characterIds: ['char-sasuke', 'char-suigetsu', 'char-karin', 'char-jugo'],
    mangaChapters: ['~345-352'],
    animeEpisodes: ['ep. 113-117'],
    tags: ['hebi', 'taka'],
  }),
  ev({
    id: 'ev-kakashi-dies-pain',
    title: { it: 'Kakashi contro Pain', en: 'Kakashi vs Pain' },
    description: {
      it: "Durante l'assalto a Konoha Kakashi affronta i Cammini di Pain, esaurisce il chakra con il Kamui e muore proteggendo Choji. Incontra lo spirito del padre Sakumo; tornerà in vita grazie al Rinne Tensei di Nagato.",
      en: "During the assault on Konoha Kakashi faces Pain's Paths, exhausts his chakra with Kamui and dies protecting Choji. He meets his father Sakumo's spirit; he will come back to life thanks to Nagato's Samsara of Heavenly Life.",
    },
    period: P2,
    arcId: 'arc-pain-assault',
    locationId: 'loc-konoha',
    characterIds: ['char-kakashi', 'char-pain', 'char-choji', 'char-choza', 'char-sakumo'],
    mangaChapters: ['~422-425'],
    animeEpisodes: ['ep. 159-161'],
    tags: ['pain', 'scontro'],
  }),
  ev({
    id: 'ev-hinata-confession',
    title: { it: 'La confessione di Hinata', en: "Hinata's confession" },
    description: {
      it: "Naruto è inchiodato a terra da Pain. Hinata si frappone, gli confessa di amarlo e viene trafitta: la rabbia di Naruto libera fino a otto code di Kurama. Il sigillo lasciato da Minato lo riporta in sé.",
      en: "Naruto is pinned to the ground by Pain. Hinata steps in, confesses her love and is run through: Naruto's rage unleashes up to eight of Kurama's tails. The seal left by Minato brings him back to himself.",
    },
    period: P2,
    arcId: 'arc-pain-assault',
    locationId: 'loc-konoha',
    characterIds: ['char-hinata', 'char-naruto', 'char-pain', 'char-kurama', 'char-minato'],
    mangaChapters: ['~437-440'],
    animeEpisodes: ['ep. 166-168'],
    tags: ['pain', 'kurama'],
  }),
  ev({
    id: 'ev-kisame-captured',
    title: { it: 'La fine di Kisame', en: "Kisame's end" },
    description: {
      it: "Kisame si nasconde dentro Samehada per infiltrarsi fra gli Alleati, ma Might Guy lo smaschera e lo cattura sull'Isola Tartaruga. Per non rivelare segreti dell'Akatsuki, Kisame si fa divorare dai suoi squali.",
      en: "Kisame hides inside Samehada to infiltrate the Allies, but Might Guy exposes and captures him on Turtle Island. To avoid revealing Akatsuki secrets, Kisame has himself devoured by his own sharks.",
    },
    period: P2,
    arcId: 'arc-fourth-war-countdown',
    locationId: 'loc-turtle-island',
    characterIds: ['char-kisame', 'char-guy', 'char-killer-b', 'char-aoba', 'char-yamato'],
    mangaChapters: ['~506-508'],
    animeEpisodes: ['ep. 251-252'],
    tags: ['akatsuki', 'scontro', 'cercoterio'],
  }),
  /* ============================ QUARTA GUERRA ============================ */
  ev({
    id: 'ev-mifune-vs-hanzo',
    title: { it: 'Mifune contro Hanzo', en: 'Mifune vs Hanzo' },
    description: {
      it: "Sul fronte della Quinta Divisione il generale samurai Mifune duella con Hanzo della Salamandra, riportato in vita da Kabuto. Le parole di Mifune risvegliano l'onore del vecchio ninja di Ame, che si lascia sconfiggere.",
      en: "On the Fifth Division's front the samurai general Mifune duels Hanzo of the Salamander, reanimated by Kabuto. Mifune's words reawaken the old Ame ninja's honour, and he allows himself to be defeated.",
    },
    period: WAR,
    arcId: 'arc-fourth-war',
    locationId: 'loc-fourth-war-battlefield',
    characterIds: ['char-mifune', 'char-hanzo', 'char-kabuto'],
    mangaChapters: ['~538-540'],
    referenceStatus: 'needs_verification',
    tags: ['quarta-guerra', 'scontro'],
  }),
  ev({
    id: 'ev-gaara-vs-rasa',
    title: { it: 'Gaara e suo padre', en: 'Gaara and his father' },
    description: {
      it: "Il Quarto Kazekage Rasa, riportato in vita con l'Edo Tensei, scopre che il figlio Gaara guida l'esercito alleato. Gli rivela che la sabbia che lo proteggeva era l'amore della madre Karura, e se ne va riconciliato.",
      en: "The Fourth Kazekage Rasa, reanimated with Edo Tensei, discovers that his son Gaara leads the Allied army. He tells him that the sand that protected him was his mother Karura's love, and departs reconciled.",
    },
    period: WAR,
    arcId: 'arc-fourth-war',
    locationId: 'loc-fourth-war-battlefield',
    characterIds: ['char-gaara', 'char-rasa', 'char-third-raikage'],
    mangaChapters: ['~547'],
    animeEpisodes: ['ep. 298'],
    tags: ['quarta-guerra', 'edo-tensei'],
  }),
  ev({
    id: 'ev-itachi-nagato',
    title: { it: 'Itachi e Naruto contro Nagato', en: 'Itachi and Naruto vs Nagato' },
    description: {
      it: "Itachi, riportato in vita da Kabuto, si libera del suo controllo grazie al corvo con l'occhio di Shisui. Insieme a Naruto e Killer B ferma Nagato, anche lui rianimato, e lo sigilla con la Spada di Totsuka.",
      en: "Itachi, reanimated by Kabuto, frees himself from his control thanks to the crow carrying Shisui's eye. Together with Naruto and Killer B he stops Nagato, also reanimated, and seals him with the Totsuka Blade.",
    },
    period: WAR,
    arcId: 'arc-fourth-war',
    locationId: 'loc-fourth-war-battlefield',
    characterIds: ['char-itachi', 'char-naruto', 'char-nagato', 'char-killer-b', 'char-shisui', 'char-kabuto'],
    mangaChapters: ['~547-552'],
    animeEpisodes: ['ep. 298-301'],
    tags: ['quarta-guerra', 'edo-tensei', 'scontro'],
  }),
  ev({
    id: 'ev-ten-tails-revived',
    title: { it: 'Il risveglio delle Dieci Code', en: 'The Ten-Tails revived' },
    description: {
      it: "Obito e Madara usano il chakra parziale dell'Otto Code e del Nove Code per far rinascere le Dieci Code dal Gedo Mazo. La bestia, ancora incompleta, scatena la sua furia contro l'Alleanza.",
      en: "Obito and Madara use partial chakra from the Eight-Tails and Nine-Tails to revive the Ten-Tails from the Gedo Statue. The beast, still incomplete, unleashes its fury on the Alliance.",
    },
    period: WAR,
    arcId: 'arc-fourth-war-climax',
    locationId: 'loc-fourth-war-battlefield',
    characterIds: ['char-obito', 'char-madara', 'char-ten-tails', 'char-gedo-mazo', 'char-naruto', 'char-killer-b'],
    mangaChapters: ['~597-600'],
    tags: ['quarta-guerra', 'dieci-code', 'cercoterio'],
  }),
  ev({
    id: 'ev-hq-destroyed',
    title: { it: 'La caduta del quartier generale', en: 'The fall of headquarters' },
    description: {
      it: "Una sfera di chakra delle Dieci Code colpisce il quartier generale dell'Alleanza. Shikaku Nara e Inoichi Yamanaka, sapendo di dover morire, trasmettono fino all'ultimo il piano di battaglia ai figli Shikamaru e Ino.",
      en: "A Ten-Tails chakra bomb strikes the Allied headquarters. Shikaku Nara and Inoichi Yamanaka, knowing they are about to die, relay the battle plan to their children Shikamaru and Ino until the very last moment.",
    },
    period: WAR,
    arcId: 'arc-fourth-war-climax',
    characterIds: ['char-shikaku', 'char-inoichi', 'char-shikamaru', 'char-ino', 'char-ten-tails'],
    mangaChapters: ['~612-613'],
    tags: ['quarta-guerra', 'lutto'],
  }),
  ev({
    id: 'ev-hokages-revived',
    title: { it: 'I quattro Hokage tornano in vita', en: 'The four Hokage return' },
    description: {
      it: "Sasuke cerca le risposte sul villaggio: Orochimaru, liberato dal corpo di Kabuto, riporta in vita con l'Edo Tensei Hashirama, Tobirama, Hiruzen e Minato. Hashirama racconta la storia di Madara, e i quattro Hokage si uniscono alla guerra insieme a Sasuke.",
      en: "Sasuke seeks answers about the village: Orochimaru, freed from Kabuto's body, reanimates Hashirama, Tobirama, Hiruzen and Minato with Edo Tensei. Hashirama tells Madara's story, and the four Hokage join the war alongside Sasuke.",
    },
    period: WAR,
    arcId: 'arc-fourth-war-climax',
    locationId: 'loc-konoha-naka-shrine',
    characterIds: ['char-orochimaru', 'char-sasuke', 'char-hashirama', 'char-tobirama', 'char-hiruzen', 'char-minato', 'char-suigetsu', 'char-jugo'],
    mangaChapters: ['~619-631'],
    animeEpisodes: ['ep. 366-370'],
    referenceStatus: 'needs_verification',
    tags: ['quarta-guerra', 'edo-tensei', 'hokage'],
  }),
  ev({
    id: 'ev-madara-jinchuriki',
    title: { it: 'Madara jinchūriki delle Dieci Code', en: 'Madara becomes the Ten-Tails jinchūriki' },
    description: {
      it: "Madara torna in vita con il Rinne Tensei, riprende il Rinnegan, estrae le Dieci Code da Obito e ne diventa il jinchūriki, raggiungendo la Modalità dell'Eremita delle Sei Vie. I cinque Kage vengono travolti.",
      en: "Madara comes back to life through Samsara of Heavenly Life, retrieves the Rinnegan, extracts the Ten-Tails from Obito and becomes its jinchūriki, reaching the Sage of Six Paths Mode. The five Kage are overwhelmed.",
    },
    period: WAR,
    arcId: 'arc-fourth-war-climax',
    locationId: 'loc-fourth-war-battlefield',
    characterIds: ['char-madara', 'char-obito', 'char-black-zetsu', 'char-ten-tails', 'char-guy'],
    mangaChapters: ['~656-664'],
    tags: ['quarta-guerra', 'dieci-code', 'cercoterio'],
  }),
  ev({
    id: 'ev-infinite-tsukuyomi',
    title: { it: 'Lo Tsukuyomi Infinito', en: 'The Infinite Tsukuyomi' },
    description: {
      it: "Madara proietta lo Tsukuyomi Infinito sulla luna: tutto il mondo cade in un sogno ed è catturato dalle radici del Dio Albero. Solo chi è protetto dal Susanoo di Sasuke resta sveglio — Naruto, Sakura, Kakashi e Obito.",
      en: "Madara casts the Infinite Tsukuyomi onto the moon: the whole world falls into a dream and is captured by the God Tree's roots. Only those shielded by Sasuke's Susanoo stay awake — Naruto, Sakura, Kakashi and Obito.",
    },
    period: WAR,
    arcId: 'arc-kaguya-final',
    locationId: 'loc-fourth-war-battlefield',
    characterIds: ['char-madara', 'char-sasuke', 'char-naruto', 'char-sakura', 'char-kakashi', 'char-obito'],
    mangaChapters: ['677-678'],
    animeEpisodes: ['ep. 424-425'],
    tags: ['quarta-guerra', 'tsukuyomi'],
  }),
  /* ================================ ERA BORUTO ================================ */
  ev({
    id: 'ev-mujina-bandits',
    title: { it: 'La banda Mujina', en: 'The Mujina Bandits' },
    description: {
      it: "Una banda criminale che opera in tutto il continente attira l'attenzione di Konoha: il team di Boruto e Konohamaru si mette sulle sue tracce e scopre che i briganti stanno cercando di liberare un loro capo prigioniero.",
      en: "A criminal gang operating across the continent draws Konoha's attention: Boruto's team and Konohamaru follow its trail and discover that the bandits are trying to free one of their imprisoned leaders.",
    },
    period: BORUTO,
    arcId: 'arc-mujina-bandits',
    characterIds: ['char-boruto', 'char-sarada', 'char-mitsuki', 'char-konohamaru', 'char-sasuke'],
    canon: 'anime_only',
    referenceStatus: 'needs_verification',
    tags: ['boruto-era', 'anime'],
  }),
  ev({
    id: 'ev-mitsuki-search',
    title: { it: 'Sulle tracce di Mitsuki', en: 'On Mitsuki\'s trail' },
    description: {
      it: "Mitsuki lascia improvvisamente Konoha. Boruto, Sarada, Shikadai e Inojin lo inseguono fino al Paese della Terra, dove scoprono un complotto legato al vecchio Tsuchikage e a un esercito di esseri artificiali.",
      en: "Mitsuki suddenly leaves Konoha. Boruto, Sarada, Shikadai and Inojin chase him into the Land of Earth, where they uncover a plot tied to the old Tsuchikage and an army of artificial beings.",
    },
    period: BORUTO,
    arcId: 'arc-mitsuki-disappearance',
    locationId: 'loc-iwa',
    characterIds: ['char-mitsuki', 'char-boruto', 'char-sarada', 'char-shikadai', 'char-inojin', 'char-onoki', 'char-orochimaru'],
    canon: 'anime_only',
    referenceStatus: 'needs_verification',
    tags: ['boruto-era', 'anime'],
  }),
  ev({
    id: 'ev-academy-mission-kae',
    title: { it: 'La scorta della principessa', en: "The princess's escort" },
    description: {
      it: "Minacciata da un complotto di corte, la giovane principessa Kae del Paese del Bambù viene mandata all'Accademia di Konoha come studentessa di scambio: Kawaki, iscritto come allievo, la protegge in incognito con Boruto finché lei può tornare a casa.",
      en: "Threatened by a court plot, young Princess Kae of the Land of Bamboo is sent to Konoha Academy as an exchange student: Kawaki, enrolled as a pupil, protects her undercover with Boruto until she can return home.",
    },
    period: BORUTO,
    arcId: 'arc-academy-mission',
    characterIds: ['char-boruto', 'char-kawaki'],
    canon: 'anime_only',
    referenceStatus: 'needs_verification',
    tags: ['boruto-era', 'anime'],
  }),
  ev({
    id: 'ev-funato-war',
    title: { it: 'La guerra dei Funato', en: 'The Funato war' },
    description: {
      it: "Il clan pirata dei Funato si ribella contro il Paese dell'Acqua. Boruto e i suoi compagni vengono coinvolti nel conflitto marittimo accanto a Kagura e ai ninja della Nebbia.",
      en: "The Funato pirate clan rebels against the Land of Water. Boruto and his companions are drawn into the maritime conflict alongside Kagura and the Mist ninja.",
    },
    period: BORUTO,
    arcId: 'arc-funato-war',
    locationId: 'loc-kiri',
    characterIds: ['char-boruto', 'char-kagura', 'char-chojuro'],
    canon: 'anime_only',
    referenceStatus: 'needs_verification',
    tags: ['boruto-era', 'anime'],
  }),
  ev({
    id: 'ev-kawaki-seals-naruto',
    title: { it: 'Kawaki sigilla Naruto', en: 'Kawaki seals Naruto' },
    description: {
      it: "Ossessionato dall'idea di proteggere Naruto, Kawaki usa il Daikokuten per sigillare lui e Hinata in una dimensione separata, deciso ad affrontare da solo gli Ōtsutsuki e a uccidere Boruto, ormai vaso di Momoshiki.",
      en: "Obsessed with protecting Naruto, Kawaki uses Daikokuten to seal him and Hinata in a separate dimension, determined to face the Ōtsutsuki alone and kill Boruto, now Momoshiki's vessel.",
    },
    period: BORUTO,
    arcId: 'arc-code-omnipotence',
    locationId: 'loc-konoha',
    characterIds: ['char-kawaki', 'char-naruto', 'char-hinata', 'char-boruto', 'char-momoshiki'],
    mangaChapters: ['Boruto ~76'],
    tags: ['boruto-era'],
  }),
  ev({
    id: 'ev-eida-omnipotence',
    title: { it: "L'Onnipotenza di Eida", en: "Eida's Omnipotence" },
    description: {
      it: "Eida, spinta dal fratello Daemon, riscrive la percezione di tutto il mondo: ora Kawaki è il figlio di Naruto e Boruto il traditore che lo ha ucciso. Solo Sarada e pochi altri ricordano la verità. Boruto fugge da Konoha con Sasuke, che durante la fuga viene trasformato in un albero.",
      en: "Eida, egged on by her brother Daemon, rewrites the whole world's perception: now Kawaki is Naruto's son and Boruto the traitor who killed him. Only Sarada and a few others remember the truth. Boruto flees Konoha with Sasuke, who is turned into a tree during the escape.",
    },
    period: BORUTO,
    arcId: 'arc-code-omnipotence',
    locationId: 'loc-konoha',
    characterIds: ['char-eida', 'char-daemon', 'char-boruto', 'char-kawaki', 'char-sasuke', 'char-sarada', 'char-code'],
    mangaChapters: ['Boruto ~77-80'],
    tags: ['boruto-era', 'onnipotenza'],
  }),
  ev({
    id: 'ev-tbv-boruto-returns',
    title: { it: 'Il ritorno di Boruto', en: "Boruto's return" },
    description: {
      it: "Tre anni dopo, Boruto — cresciuto, con il Rasengan Uzuhiko e lo spadone di Sasuke — torna a Konoha per salvare Sarada da Code. Il villaggio lo considera ancora l'assassino del Settimo Hokage.",
      en: "Three years later Boruto — grown up, wielding the Rasengan Uzuhiko and Sasuke's blade — returns to Konoha to save Sarada from Code. The village still sees him as the Seventh Hokage's murderer.",
    },
    period: TBV,
    arcId: 'arc-two-blue-vortex',
    locationId: 'loc-konoha',
    characterIds: ['char-boruto', 'char-sarada', 'char-code', 'char-kawaki', 'char-sumire'],
    mangaChapters: ['TBV 1-4'],
    tags: ['boruto-era', 'two-blue-vortex'],
  }),
  ev({
    id: 'ev-tbv-shinju',
    title: { it: 'Gli Alberi Divini prendono coscienza', en: 'The God Trees awaken' },
    description: {
      it: "Gli Alberi Divini liberati da Code acquisiscono coscienza: nascono i Shinju, esseri dalle sembianze umane modellati sui ninja che hanno assorbito — Hidari da Sasuke, Matsuri da Moegi — guidati da Jura, manifestazione delle Dieci Code.",
      en: "The God Trees unleashed by Code gain consciousness: the Shinju are born, humanlike beings modelled on the ninja they absorbed — Hidari from Sasuke, Matsuri from Moegi — led by Jura, the manifestation of the Ten-Tails.",
    },
    period: TBV,
    arcId: 'arc-two-blue-vortex',
    characterIds: ['char-jura', 'char-hidari', 'char-matsuri', 'char-code', 'char-sasuke', 'char-moegi'],
    mangaChapters: ['TBV ~5-10'],
    referenceStatus: 'needs_verification',
    tags: ['boruto-era', 'two-blue-vortex', 'shinju'],
  }),
  ev({
    id: 'ev-tbv-jura-konoha',
    title: { it: 'Jura a Konoha', en: 'Jura in Konoha' },
    description: {
      it: "Jura cerca Naruto per divorarne il chakra e finisce per scambiare per lui Himawari, che ora ospita Kurama. Kawaki, privo dei poteri Ōtsutsuki, viene sconfitto da uno dei Shinju.",
      en: "Jura seeks Naruto to devour his chakra and ends up mistaking Himawari, who now hosts Kurama, for him. Kawaki, stripped of his Ōtsutsuki powers, is defeated by one of the Shinju.",
    },
    period: TBV,
    arcId: 'arc-two-blue-vortex',
    locationId: 'loc-konoha',
    characterIds: ['char-jura', 'char-himawari', 'char-kawaki', 'char-kurama'],
    mangaChapters: ['TBV ~8'],
    referenceStatus: 'needs_verification',
    tags: ['boruto-era', 'two-blue-vortex', 'shinju'],
  }),
  ev({
    id: 'ev-tbv-boruto-kawaki-vs-jura',
    title: { it: 'Boruto e Kawaki contro Jura', en: 'Boruto and Kawaki vs Jura' },
    description: {
      it: "I due rivali, che fino a quel momento si cercavano per uccidersi, finiscono per unire le forze contro Jura, il Shinju più pericoloso.",
      en: 'The two rivals, who until then had been hunting each other, end up joining forces against Jura, the most dangerous of the Shinju.',
    },
    period: TBV,
    arcId: 'arc-two-blue-vortex',
    characterIds: ['char-boruto', 'char-kawaki', 'char-jura'],
    mangaChapters: ['TBV ~24'],
    referenceStatus: 'needs_verification',
    tags: ['boruto-era', 'two-blue-vortex', 'scontro'],
  }),
];
