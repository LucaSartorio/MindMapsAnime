import type { TimelineEvent } from '@/types';
import { ev } from './eventHelpers';
import { P } from './periods';

/**
 * Eventi aggiunti per completezza, inseriti nella stessa sequenza (`order`) delle
 * due timeline principali. Il tag `dito-di-sukuna` accende il luogo sulla mappa
 * con il filtro «Evidenzia le dita di Sukuna» (WorldConfig.mapMarkers): le venti
 * dita, da quella di Sugisawa all'ultima, nata con Yuji.
 */
export const jjkEventsMore: TimelineEvent[] = [
  ev({
    id: 'evt-jjk-secret-training',
    title: { it: "L'allenamento segreto", en: 'The secret training' },
    description: {
      it: "Gojo nasconde a tutti — anche a Megumi e Nobara — che Yuji è tornato in vita. Per controllare l'energia malefica Yuji guarda film tenendo in braccio un cadavere maledetto creato dal preside Yaga, che lo colpisce appena il flusso vacilla.",
      en: "Gojo hides from everyone — even Megumi and Nobara — that Yuji is alive again. To learn to control his cursed energy Yuji watches films while holding a cursed corpse made by principal Yaga, which punches him the moment his flow wavers.",
    },
    period: P.y2018,
    arcId: 'arc-jjk-vs-mahito',
    locationId: 'loc-jjk-jujutsu-high',
    characterIds: ['char-jjk-yuji', 'char-jjk-gojo', 'char-jjk-yaga'],
    mangaChapters: ['~10-17'],
    animeEpisodes: ['ep. 5-8'],
    order: 355,
    tags: ['allenamento'],
  }),
  ev({
    id: 'evt-jjk-nanami-vs-mahito',
    title: { it: 'Nanami contro Mahito', en: 'Nanami vs Mahito' },
    description: {
      it: "Seguendo le tracce dei cadaveri deformati del caso del cinema, Nanami raggiunge Mahito nelle gallerie fognarie sotto la città. Scopre la Trasfigurazione inattiva, la tecnica che rimodella l'anima, ed è Mahito a ritirarsi.",
      en: "Following the trail of the deformed corpses from the cinema case, Nanami reaches Mahito in the sewer tunnels under the city. He discovers Idle Transfiguration, the technique that reshapes the soul, and it is Mahito who withdraws.",
    },
    period: P.y2018,
    arcId: 'arc-jjk-vs-mahito',
    characterIds: ['char-jjk-nanami', 'char-jjk-mahito'],
    factionIds: ['faction-jjk-disaster-curses'],
    mangaChapters: ['~21-24'],
    animeEpisodes: ['ep. 9-10'],
    order: 415,
    tags: ['scontro', 'mahito'],
  }),
  ev({
    id: 'evt-jjk-yuji-returns',
    title: { it: 'Yuji è vivo', en: 'Yuji is alive' },
    description: {
      it: "All'incontro con la delegazione di Kyoto Gojo presenta un «regalo»: dalla cassa salta fuori Yuji, che tutti credevano morto a Eishu. Megumi e Nobara, che lo avevano pianto, non la prendono bene.",
      en: "At the meeting with the Kyoto delegation Gojo presents a 'gift': out of the crate jumps Yuji, whom everyone believed had died at Eishu. Megumi and Nobara, who had mourned him, do not take it well.",
    },
    period: P.y2018,
    arcId: 'arc-jjk-goodwill',
    locationId: 'loc-jjk-jujutsu-high',
    characterIds: ['char-jjk-yuji', 'char-jjk-gojo', 'char-jjk-megumi', 'char-jjk-nobara'],
    mangaChapters: ['~32'],
    animeEpisodes: ['ep. 14'],
    order: 502,
    tags: ['scambio-kyoto'],
  }),
  ev({
    id: 'evt-jjk-fifth-finger',
    title: { it: 'Il quinto dito', en: 'The fifth finger' },
    description: {
      it: "Dopo lo scontro con Choso, Yuji perde i sensi. Mimiko e Nanako, le figlie adottive di Geto, gli fanno ingoiare un dito di Sukuna — il quinto — sperando che il Re delle Maledizioni uccida chi ha rubato il corpo del loro padre.",
      en: "After the fight with Choso, Yuji passes out. Mimiko and Nanako, Geto's adopted daughters, make him swallow one of Sukuna's fingers — the fifth — hoping the King of Curses will kill whoever stole their father's body.",
    },
    period: P.shibuya,
    arcId: 'arc-jjk-shibuya',
    locationId: 'loc-jjk-shibuya-station',
    characterIds: ['char-jjk-yuji', 'char-jjk-mimiko', 'char-jjk-nanako', 'char-jjk-sukuna'],
    factionIds: ['faction-jjk-geto-family'],
    mangaChapters: ['111'],
    animeEpisodes: ['ep. 40'],
    order: 748,
    tags: ['shibuya', 'dito-di-sukuna'],
  }),
  ev({
    id: 'evt-jjk-uraume-fingers',
    title: { it: 'Diciannove dita', en: 'Nineteen fingers' },
    description: {
      it: "Nel corpo di Megumi, Sukuna riceve da Uraume le dita rimaste ancora disperse: prima dello scontro con Gojo ne ha mangiate diciannove. Ne manca una sola, che nessuno trova.",
      en: "In Megumi's body, Sukuna receives from Uraume the fingers still scattered: before the fight with Gojo he has eaten nineteen. Only one is missing, and no one can find it.",
    },
    period: P.culling,
    arcId: 'arc-jjk-culling-game',
    locationId: 'loc-jjk-tokyo',
    characterIds: ['char-jjk-sukuna', 'char-jjk-uraume', 'char-jjk-megumi'],
    factionIds: ['faction-jjk-sukuna-retinue'],
    mangaChapters: ['~221-222'],
    order: 1085,
    referenceStatus: 'needs_verification',
    tags: ['sukuna', 'dito-di-sukuna'],
  }),
  ev({
    id: 'evt-jjk-twentieth-finger',
    title: { it: "L'ultimo dito", en: 'The last finger' },
    description: {
      it: "Durante la battaglia di Shinjuku si scopre dove si trova il ventesimo dito: Yuji è nato con il dito di Sukuna sigillato dentro di sé. È l'origine del suo fisico fuori dal comune e della sua capacità di tenere a bada il Re delle Maledizioni.",
      en: "During the Shinjuku battle the whereabouts of the twentieth finger come out: Yuji was born with Sukuna's finger sealed inside him. It is the root of his extraordinary physique and of his ability to keep the King of Curses in check.",
    },
    period: P.shinjuku,
    arcId: 'arc-jjk-shinjuku-showdown',
    locationId: 'loc-jjk-shinjuku',
    characterIds: ['char-jjk-yuji', 'char-jjk-sukuna', 'char-jjk-kenjaku', 'char-jjk-jin'],
    mangaChapters: ['~257'],
    order: 1135,
    tags: ['shinjuku', 'origini', 'dito-di-sukuna'],
  }),
  ev({
    id: 'evt-jjk-yuta-gojo-body',
    title: { it: 'Yuta nel corpo di Gojo', en: "Yuta in Gojo's body" },
    description: {
      it: "Ferito a morte e portato nell'infermeria di Shoko accanto al corpo di Gojo, Yuta usa la tecnica copiata da Kenjaku: trasferisce il proprio cervello nel corpo del suo maestro e torna a combattere Sukuna con i Sei Occhi e l'Illimitato, per un tempo limitato.",
      en: "Mortally wounded and carried to Shoko's medical bay next to Gojo's body, Yuta uses the technique copied from Kenjaku: he transfers his own brain into his teacher's body and goes back to fight Sukuna with the Six Eyes and Limitless, for a limited time.",
    },
    period: P.shinjuku,
    arcId: 'arc-jjk-shinjuku-showdown',
    locationId: 'loc-jjk-shinjuku',
    characterIds: ['char-jjk-yuta', 'char-jjk-gojo', 'char-jjk-shoko', 'char-jjk-sukuna'],
    mangaChapters: ['261'],
    order: 1145,
    tags: ['shinjuku', 'scontro'],
  }),
];
