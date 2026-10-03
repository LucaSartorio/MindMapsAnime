import type { MapLevel } from '@/types';
import {
  JJK_CAMPUS_VIEWBOX,
  JJK_JAPAN_VIEWBOX,
  JJK_KYOTO_VIEWBOX,
  JJK_SENDAI_VIEWBOX,
  JJK_SHIBUYA_VIEWBOX,
  JJK_TOKYO_VIEWBOX,
} from './mapConstants';

const W = 'world-jujutsukaisen';

/**
 * Map level di Jujutsu Kaisen. Il Giappone è la radice; Tokyo, Kyoto e Sendai si aprono
 * dai loro pin; Shibuya e l'istituto di arti occulte si aprono dalla mappa di Tokyo. Ogni
 * sotto-mappa ha un pin di RITORNO verso il livello superiore.
 */
export const jjkMapLevels: MapLevel[] = [
  {
    id: 'jjk-map-japan',
    worldId: W,
    slug: 'japan',
    name: 'Japan',
    localizedName: { it: 'Il Giappone', en: 'Japan', ja: '日本', fr: 'Le Japon', de: 'Japan', es: 'Japón' },
    description: {
      it: "Jujutsu Kaisen è ambientato nel Giappone di oggi. La mappa mostra le prefetture reali, le città dove si svolge la storia — Tokyo, Kyoto, Sendai — Okinawa, dove Gojo e Geto portano Riko Amanai, e le dieci colonie del Culling Game disposte in fila da Aomori a Kagoshima.",
      en: "Jujutsu Kaisen is set in present-day Japan. The map shows the real prefectures, the cities where the story unfolds — Tokyo, Kyoto, Sendai — Okinawa, where Gojo and Geto take Riko Amanai, and the ten Culling Game colonies lined up from Aomori to Kagoshima.",
    },
    backgroundAssetId: 'jjk-map-japan',
    width: JJK_JAPAN_VIEWBOX.width,
    height: JJK_JAPAN_VIEWBOX.height,
  },
  {
    id: 'jjk-map-tokyo',
    worldId: W,
    slug: 'tokyo',
    name: 'Tokyo',
    localizedName: { it: 'Tokyo e dintorni', en: 'Tokyo and surroundings', ja: '東京', fr: 'Tokyo et ses environs', de: 'Tokio und Umgebung', es: 'Tokio y alrededores' },
    description: {
      it: "La capitale e la sua cintura: l'istituto di arti occulte nelle colline boscose a ovest, Shibuya, Shinjuku, Harajuku e Roppongi lungo l'anello della Yamanote, le due colonie di Tokyo, Kawasaki e il ponte Yasohachi nelle valli di Saitama.",
      en: "The capital and its belt: the jujutsu high school in the wooded hills to the west, Shibuya, Shinjuku, Harajuku and Roppongi along the Yamanote loop, the two Tokyo colonies, Kawasaki and the Yasohachi Bridge in the valleys of Saitama.",
    },
    parentLevelId: 'jjk-map-japan',
    triggerLocationId: 'loc-jjk-tokyo',
    backgroundAssetId: 'jjk-map-tokyo',
    width: JJK_TOKYO_VIEWBOX.width,
    height: JJK_TOKYO_VIEWBOX.height,
  },
  {
    id: 'jjk-map-shibuya',
    worldId: W,
    slug: 'shibuya',
    name: 'Shibuya',
    localizedName: { it: 'Shibuya · l\'Incidente', en: 'Shibuya · the Incident', ja: '渋谷事変', fr: 'Shibuya · l\'Incident', de: 'Shibuya · der Vorfall', es: 'Shibuya · el Incidente' },
    description: {
      it: "La notte di Halloween del 2018 sulle strade reali di Shibuya: il Velo di 400 metri attorno alla stazione, il binario B5F della linea Fukutoshin dove Gojo viene sigillato, Meiji-jingumae, lo Shibuya Stream, lo Shibuya 109 e Dogenzaka, rasa al suolo dal Santuario Malefico.",
      en: "Halloween night 2018 on the real streets of Shibuya: the 400-metre Veil around the station, the B5F platform of the Fukutoshin Line where Gojo is sealed, Meiji-jingumae, Shibuya Stream, Shibuya 109 and Dogenzaka, razed by the Malevolent Shrine.",
    },
    parentLevelId: 'jjk-map-tokyo',
    triggerLocationId: 'loc-jjk-shibuya',
    backgroundAssetId: 'jjk-map-shibuya',
    width: JJK_SHIBUYA_VIEWBOX.width,
    height: JJK_SHIBUYA_VIEWBOX.height,
  },
  {
    id: 'jjk-map-campus',
    worldId: W,
    slug: 'jujutsu-high',
    name: 'Tokyo Jujutsu High',
    localizedName: { it: 'Istituto di arti occulte di Tokyo', en: 'Tokyo Jujutsu High', ja: '東京都立呪術高等専門学校', fr: 'Lycée d\'exorcisme de Tokyo', de: 'Jujutsu-Oberschule Tokio', es: 'Instituto de hechicería de Tokio' },
    description: {
      it: "Una pianta IMMAGINATA dell'istituto, che l'opera mostra come un complesso di edifici in stile tempio nascosto fra i boschi: l'ingresso, l'edificio principale, i dormitori, l'infermeria, il magazzino da cui spariscono le dita di Sukuna, il bosco della sfida con Kyoto e, sottoterra, la Tomba delle Stelle.",
      en: "An IMAGINED plan of the school, which the series shows as a complex of temple-style buildings hidden among the woods: the entrance, the main building, the dorms, the infirmary, the storehouse from which Sukuna's fingers vanish, the forest of the Kyoto exchange and, underground, the Tombs of the Star.",
    },
    parentLevelId: 'jjk-map-tokyo',
    triggerLocationId: 'loc-jjk-jujutsu-high',
    backgroundAssetId: 'jjk-map-campus',
    width: JJK_CAMPUS_VIEWBOX.width,
    height: JJK_CAMPUS_VIEWBOX.height,
  },
  {
    id: 'jjk-map-kyoto',
    worldId: W,
    slug: 'kyoto',
    name: 'Kyoto',
    localizedName: { it: 'Kyoto', en: 'Kyoto', ja: '京都', fr: 'Kyoto', de: 'Kyoto', es: 'Kioto' },
    description: {
      it: "L'antica capitale fra i fiumi Kamo e Katsura, con la sua città a scacchiera: la sede dell'istituto gemello, la città dei clan, uno dei bersagli della Parata della Notte e una delle colonie del Culling Game.",
      en: "The old capital between the Kamo and Katsura rivers, with its grid-plan city: home of the sister school, the city of the clans, one of the targets of the Night Parade and one of the Culling Game colonies.",
    },
    parentLevelId: 'jjk-map-japan',
    triggerLocationId: 'loc-jjk-kyoto',
    backgroundAssetId: 'jjk-map-kyoto',
    width: JJK_KYOTO_VIEWBOX.width,
    height: JJK_KYOTO_VIEWBOX.height,
  },
  {
    id: 'jjk-map-sendai',
    worldId: W,
    slug: 'sendai',
    name: 'Sendai',
    localizedName: { it: 'Sendai', en: 'Sendai', ja: '仙台', fr: 'Sendai', de: 'Sendai', es: 'Sendai' },
    description: {
      it: "La città di Yuji Itadori, sul fiume Hirose: il liceo dove mangia il primo dito di Sukuna, l'ospedale dove muore suo nonno e, mesi dopo, la colonia del Culling Game che copre quasi tutta la città.",
      en: "Yuji Itadori's city, on the Hirose river: the high school where he eats Sukuna's first finger, the hospital where his grandfather dies and, months later, the Culling Game colony that covers almost the whole city.",
    },
    parentLevelId: 'jjk-map-japan',
    triggerLocationId: 'loc-jjk-sendai',
    backgroundAssetId: 'jjk-map-sendai',
    width: JJK_SENDAI_VIEWBOX.width,
    height: JJK_SENDAI_VIEWBOX.height,
  },
];
