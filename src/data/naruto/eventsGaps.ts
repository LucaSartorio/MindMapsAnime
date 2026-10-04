import type { TimelineEvent } from '@/types';

/**
 * Eventi che coprono capitoli prima scoperti (vedi `npm run coverage:chapters`).
 * L'ordine cronologico è dato da `eventsChronology.ts`.
 */
const P1 = { it: 'Naruto Parte I', en: 'Naruto Part I' };
const SH = { it: 'Naruto Shippuden', en: 'Naruto Shippuden' };
const WAR = { it: 'Quarta Guerra Ninja', en: 'Fourth Shinobi World War' };
const base = { worldId: 'world-naruto', order: 0, canon: 'canon' as const, referenceStatus: 'verified' as const };

export const narutoEventsGaps: TimelineEvent[] = [
  {
    ...base,
    id: 'ev-hiruzen-vs-orochimaru',
    title: { it: 'Hiruzen contro Orochimaru', en: 'Hiruzen vs Orochimaru' },
    description: {
      it: "Sul tetto dello stadio, chiusi in una barriera, il Terzo Hokage affronta il suo ex allievo. Orochimaru richiama con l'Edo Tensei il Primo e il Secondo Hokage; Hiruzen usa il Sigillo del Mietitore: imprigiona i due Hokage e le braccia di Orochimaru, e muore.",
      en: 'On the stadium roof, sealed inside a barrier, the Third Hokage faces his former student. Orochimaru summons the First and Second Hokage with Edo Tensei; Hiruzen uses the Dead Demon Consuming Seal: he imprisons the two Hokage and Orochimaru\'s arms, and dies.',
    },
    period: P1,
    arcId: 'arc-konoha-crush',
    locationId: 'loc-konoha',
    characterIds: ['char-hiruzen', 'char-orochimaru', 'char-hashirama', 'char-tobirama'],
    mangaChapters: ['~121-138'],
    tags: ['invasione', 'scontro'],
  },
  {
    ...base,
    id: 'ev-sasuke-reunion-hideout',
    title: { it: 'Naruto ritrova Sasuke', en: 'Naruto finds Sasuke again' },
    description: {
      it: "Nel covo di Orochimaru, Sai rivela la sua vera missione per la Radice, poi sceglie di aiutare Naruto. Sasuke compare dopo due anni e mezzo, sovrasta il nuovo Team 7 e se ne va con Orochimaru e Kabuto.",
      en: "In Orochimaru's hideout, Sai reveals his true mission for Root, then chooses to help Naruto. Sasuke appears after two and a half years, overpowers the new Team 7 and leaves with Orochimaru and Kabuto.",
    },
    period: SH,
    arcId: 'arc-tenchi-bridge',
    locationId: 'loc-orochimaru-hideout',
    characterIds: ['char-naruto', 'char-sasuke', 'char-sakura', 'char-sai', 'char-yamato', 'char-orochimaru', 'char-kabuto'],
    mangaChapters: ['~304-310'],
    tags: ['sasuke'],
  },
  {
    ...base,
    id: 'ev-jiraiya-infiltrates-ame',
    title: { it: 'Jiraiya si infiltra ad Amegakure', en: 'Jiraiya infiltrates Amegakure' },
    description: {
      it: "Travestito, Jiraiya entra nel Villaggio della Pioggia, interroga due ninja e scopre che il villaggio venera un «dio» chiamato Pain. Konan lo individua e lo affronta.",
      en: 'In disguise, Jiraiya enters the Village Hidden by Rain, interrogates two ninja and learns the village worships a "god" called Pain. Konan spots him and confronts him.',
    },
    period: SH,
    arcId: 'arc-jiraiya-gallant',
    locationId: 'loc-ame',
    characterIds: ['char-jiraiya', 'char-konan', 'char-pain'],
    mangaChapters: ['~367-372'],
    tags: ['akatsuki'],
  },
  {
    ...base,
    id: 'ev-kakashi-vs-zabuza-haku-edo',
    title: { it: 'Kakashi contro Zabuza e Haku resuscitati', en: 'Kakashi vs the reanimated Zabuza and Haku' },
    description: {
      it: "Nella guerra, Kabuto schiera contro la divisione di Kakashi Zabuza e Haku riportati in vita con l'Edo Tensei. Haku si sacrifica di nuovo, Zabuza ritrova la propria volontà e Kakashi li sigilla.",
      en: "In the war, Kabuto sends Zabuza and Haku, brought back with Edo Tensei, against Kakashi's division. Haku sacrifices himself again, Zabuza regains his own will and Kakashi seals them.",
    },
    period: WAR,
    arcId: 'arc-fourth-war',
    locationId: 'loc-fourth-war-battlefield',
    characterIds: ['char-kakashi', 'char-zabuza', 'char-haku', 'char-kabuto'],
    mangaChapters: ['~522-526'],
    referenceStatus: 'needs_verification',
    tags: ['edo-tensei', 'scontro'],
  },
  {
    ...base,
    id: 'ev-darui-vs-gold-silver',
    title: { it: 'Darui contro i Fratelli d’Oro e d’Argento', en: 'Darui vs the Gold and Silver Brothers' },
    description: {
      it: "Kinkaku e Ginkaku, riportati in vita con l'Edo Tensei, travolgono la divisione di Darui con il chakra della Volpe a Nove Code e i tesori del Saggio. Darui li sigilla nei loro stessi strumenti.",
      en: "Kinkaku and Ginkaku, brought back with Edo Tensei, overwhelm Darui's division with the Nine-Tails' chakra and the Sage's treasures. Darui seals them inside their own tools.",
    },
    period: WAR,
    arcId: 'arc-fourth-war',
    locationId: 'loc-fourth-war-battlefield',
    characterIds: ['char-darui', 'char-kinkaku', 'char-ginkaku'],
    mangaChapters: ['~525-531'],
    referenceStatus: 'needs_verification',
    tags: ['edo-tensei', 'scontro'],
  },
  {
    ...base,
    id: 'ev-obito-ten-tails-jinchuriki',
    title: { it: 'Obito forza portante delle Dieci Code', en: 'Obito becomes the Ten-Tails jinchūriki' },
    description: {
      it: "Mentre Madara è ancora legato all'Edo Tensei, Obito sigilla in sé le Dieci Code e diventa la forza portante. Contro di lui si schierano i quattro Hokage, Naruto, Sasuke e l'Alleanza.",
      en: 'While Madara is still bound by Edo Tensei, Obito seals the Ten-Tails inside himself and becomes its jinchūriki. The four Hokage, Naruto, Sasuke and the Alliance stand against him.',
    },
    period: WAR,
    arcId: 'arc-ten-tails-jinchuriki',
    locationId: 'loc-fourth-war-battlefield',
    characterIds: ['char-obito', 'char-madara', 'char-naruto', 'char-sasuke', 'char-minato'],
    mangaChapters: ['~637-641'],
    tags: ['cercoterio', 'dieci-code'],
  },
];
