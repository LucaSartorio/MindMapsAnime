import type { StoryArc } from '@/types';

/**
 * Story arcs di Naruto.
 * I numeri di capitoli/episodi non vengono compilati senza verifica:
 * preferiamo lasciare campi vuoti e marcare `referenceStatus`.
 */
export const narutoArcs: StoryArc[] = [
  {
    id: 'arc-pre-series',
    worldId: 'world-naruto',
    name: 'Pre-series',
    saga: 'Pre-serie',
    order: 0,
    description:
      'Eventi precedenti all\'inizio della serie: Era dei Sengoku, fondazione di Konoha, Terza Guerra Ninja, attacco di Kurama.',
    canon: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['lore', 'pre-serie'],
  },
  {
    id: 'arc-prologue',
    worldId: 'world-naruto',
    name: 'Prologue · Land of Waves',
    saga: 'Naruto Parte I',
    order: 1,
    description:
      'Formazione del Team 7 e prima missione di rango C nel Paese delle Onde, contro Zabuza e Haku.',
    locationIds: ['loc-konoha', 'loc-waves'],
    characterIds: ['char-naruto', 'char-sasuke', 'char-sakura', 'char-kakashi'],
    canon: 'canon',
    referenceStatus: 'verified',
  },
  {
    id: 'arc-chunin-exams',
    worldId: 'world-naruto',
    name: 'Chunin Exams',
    saga: 'Naruto Parte I',
    order: 2,
    description:
      'Esami di promozione a chunin tenuti a Konoha. Introduzione di Gaara e Orochimaru.',
    locationIds: ['loc-konoha', 'loc-forest-of-death'],
    characterIds: ['char-naruto', 'char-sasuke', 'char-sakura', 'char-gaara', 'char-orochimaru', 'char-rock-lee', 'char-neji', 'char-shikamaru', 'char-hinata'],
    canon: 'canon',
    referenceStatus: 'verified',
  },
  {
    id: 'arc-konoha-crush',
    worldId: 'world-naruto',
    name: 'Konoha Crush',
    saga: 'Naruto Parte I',
    order: 3,
    description:
      'Invasione di Konoha da parte di Sunagakure e Otogakure orchestrata da Orochimaru. Morte di Hiruzen.',
    locationIds: ['loc-konoha'],
    characterIds: ['char-orochimaru', 'char-hiruzen', 'char-gaara'],
    canon: 'canon',
    referenceStatus: 'verified',
  },
  {
    id: 'arc-search-tsunade',
    worldId: 'world-naruto',
    name: 'Search for Tsunade',
    saga: 'Naruto Parte I',
    order: 4,
    description:
      'Jiraiya e Naruto cercano Tsunade per nominarla Quinto Hokage. Primo scontro con membri Akatsuki.',
    characterIds: ['char-jiraiya', 'char-naruto', 'char-tsunade', 'char-itachi'],
    canon: 'canon',
    referenceStatus: 'verified',
  },
  {
    id: 'arc-sasuke-retrieval',
    worldId: 'world-naruto',
    name: 'Sasuke Retrieval',
    saga: 'Naruto Parte I',
    order: 5,
    description:
      'Sasuke abbandona Konoha per Orochimaru. Missione di recupero dei "Sound Five" e duello alla Valle della Fine.',
    locationIds: ['loc-konoha', 'loc-valley-of-end'],
    characterIds: ['char-naruto', 'char-sasuke', 'char-shikamaru', 'char-neji'],
    canon: 'canon',
    referenceStatus: 'verified',
  },
  {
    id: 'arc-kazekage-rescue',
    worldId: 'world-naruto',
    name: 'Kazekage Rescue',
    saga: 'Naruto Shippuden',
    order: 6,
    description:
      'Akatsuki rapisce Gaara per estrarre Shukaku. Missione di salvataggio del Team 7 e Team Guy.',
    locationIds: ['loc-suna'],
    characterIds: ['char-naruto', 'char-sakura', 'char-kakashi', 'char-gaara', 'char-guy', 'char-rock-lee'],
    canon: 'canon',
    referenceStatus: 'verified',
  },
  {
    id: 'arc-tenchi-bridge',
    worldId: 'world-naruto',
    name: 'Tenchi Bridge',
    saga: 'Naruto Shippuden',
    order: 7,
    description:
      'Inseguimento di Sasuke su informazioni di una spia di Sasori. Comparsa di Sai e introduzione del Team 7 versione Shippuden.',
    locationIds: ['loc-samurai-bridge'],
    characterIds: ['char-naruto', 'char-sakura', 'char-orochimaru', 'char-sasuke'],
    canon: 'canon',
    referenceStatus: 'needs_verification',
  },
  {
    id: 'arc-akatsuki-suppression',
    worldId: 'world-naruto',
    name: 'Akatsuki Suppression',
    saga: 'Naruto Shippuden',
    order: 8,
    description:
      'Vari scontri tra membri Akatsuki e ninja della Foglia: Hidan/Kakuzu, Itachi, Deidara, Sasuke contro Orochimaru.',
    characterIds: ['char-itachi', 'char-sasuke', 'char-orochimaru'],
    canon: 'canon',
    referenceStatus: 'verified',
  },
  {
    id: 'arc-itachi-pursuit',
    worldId: 'world-naruto',
    name: 'Itachi Pursuit',
    saga: 'Naruto Shippuden',
    order: 9,
    description:
      'Sasuke insegue Itachi, scontro finale tra fratelli. Verità sul massacro Uchiha.',
    locationIds: ['loc-orochimaru-hideout'],
    characterIds: ['char-sasuke', 'char-itachi'],
    canon: 'canon',
    referenceStatus: 'verified',
  },
  {
    id: 'arc-pain-assault',
    worldId: 'world-naruto',
    name: 'Pain Assault on Konoha',
    saga: 'Naruto Shippuden',
    order: 10,
    description:
      'Pain attacca Konoha alla ricerca del jinchūriki di Kurama. Naruto in Sage Mode.',
    locationIds: ['loc-konoha'],
    characterIds: ['char-pain', 'char-naruto', 'char-tsunade', 'char-hinata'],
    canon: 'canon',
    referenceStatus: 'verified',
  },
  {
    id: 'arc-fourth-war',
    worldId: 'world-naruto',
    name: 'Fourth Shinobi World War',
    saga: 'Naruto Shippuden',
    order: 11,
    description:
      'Le cinque grandi nazioni si alleano contro Madara/Obito e l\'Akatsuki. Edo Tensei massiccio.',
    locationIds: ['loc-fourth-war-battlefield'],
    characterIds: ['char-naruto', 'char-sasuke', 'char-kakashi', 'char-madara', 'char-obito', 'char-gaara'],
    canon: 'canon',
    referenceStatus: 'verified',
  },
  {
    id: 'arc-kaguya-final',
    worldId: 'world-naruto',
    name: 'Kaguya · Final Battle',
    saga: 'Naruto Shippuden',
    order: 12,
    description:
      'Risveglio di Kaguya Ōtsutsuki, sigillamento finale. Duello conclusivo Naruto vs Sasuke alla Valle della Fine.',
    locationIds: ['loc-fourth-war-battlefield', 'loc-valley-of-end'],
    characterIds: ['char-naruto', 'char-sasuke', 'char-kakashi'],
    canon: 'canon',
    referenceStatus: 'verified',
  },
  {
    id: 'arc-post-war',
    worldId: 'world-naruto',
    name: 'Post-war Era',
    saga: 'Post-serie',
    order: 13,
    description:
      'Ricostruzione delle nazioni, ascesa di Kakashi come Sesto Hokage e poi Naruto come Settimo. Apre la strada a Boruto.',
    canon: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['boruto-bridge'],
  },
];
