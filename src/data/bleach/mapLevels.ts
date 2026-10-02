import type { MapLevel } from '@/types';
import {
  BLEACH_HUECO_MUNDO_VIEWBOX,
  BLEACH_KARAKURA_VIEWBOX,
  BLEACH_REIOKYU_VIEWBOX,
  BLEACH_SEIREITEI_VIEWBOX,
  BLEACH_WORLD_VIEWBOX,
} from './mapConstants';

/**
 * Map level di Bleach.
 *
 * - `bl-map-world`: «I Tre Mondi», la mappa radice. Bleach non è un mondo
 *   geografico ma COSMOLOGICO: la Soul Society (Seireitei circondato dai 320
 *   distretti del Rukongai), il Mondo dei Vivi, Hueco Mundo, e i passaggi fra
 *   loro (Dangai, Garganta), con il Reiōkyū sopra e il Jigoku sotto.
 * - quattro sotto-mappe, aperte con doppio clic sul pin corrispondente:
 *   Karakura, il Seireitei, Hueco Mundo (Las Noches) e il Reiōkyū.
 *
 * Ogni sotto-mappa contiene un pin di RITORNO (`subMapLevelId` verso la world
 * map): senza quello il doppio clic non risale.
 */
export const bleachMapLevels: MapLevel[] = [
  {
    id: 'bl-map-world',
    worldId: 'world-bleach',
    slug: 'world',
    name: 'The Three Worlds',
    localizedName: { it: 'I Tre Mondi', en: 'The Three Worlds', ja: '三界', fr: 'Les Trois Mondes', de: 'Die drei Welten', es: 'Los Tres Mundos' },
    description: {
      it: "Ricostruzione cosmologica dei mondi di Bleach: la Soul Society con il Seireitei e i quattro quadranti del Rukongai, il Reiōkyū che vi galleggia sopra, il Dangai che la collega al Mondo dei Vivi e a Karakura, la Garganta che porta a Hueco Mundo e a Las Noches, e il Jigoku in fondo a tutto. Schema originale AniMapVerse, non in scala: l'opera non ha mai mostrato una mappa dei suoi mondi.",
      en: "A cosmological reconstruction of Bleach's worlds: the Soul Society with the Seireitei and the four quadrants of the Rukongai, the Reiōkyū floating above it, the Dangai linking it to the World of the Living and Karakura, the Garganta leading to Hueco Mundo and Las Noches, and Hell at the very bottom. An original AniMapVerse diagram, not to scale: the series has never shown a map of its worlds.",
    },
    backgroundAssetId: 'bl-map-three-worlds',
    width: BLEACH_WORLD_VIEWBOX.width,
    height: BLEACH_WORLD_VIEWBOX.height,
  },
  {
    id: 'bl-map-karakura',
    worldId: 'world-bleach',
    slug: 'karakura',
    name: 'Karakura Town',
    localizedName: { it: 'Karakura', en: 'Karakura Town', ja: '空座町' },
    description: {
      it: "Pianta concettuale di Karakura, la città di Ichigo: la Clinica Kurosaki, il liceo, il Negozio Urahara con la sua enorme sala d'allenamento sotterranea, il fiume dove morì Masaki, la collina del cimitero, e il perimetro della Karakura replica in cui si combatte la battaglia contro Aizen. Disposizione coerente con la storia, non una planimetria in scala. Doppio clic su «Torna ai Tre Mondi» per risalire.",
      en: "A conceptual plan of Karakura, Ichigo's town: the Kurosaki Clinic, the high school, the Urahara Shop with its huge underground training room, the river where Masaki died, the cemetery hill, and the outline of the replica Karakura where the battle against Aizen is fought. A layout consistent with the story, not a scale plan. Double-click 'Back to the Three Worlds' to go back up.",
    },
    parentLevelId: 'bl-map-world',
    triggerLocationId: 'loc-bl-karakura',
    backgroundAssetId: 'bl-map-karakura',
    width: BLEACH_KARAKURA_VIEWBOX.width,
    height: BLEACH_KARAKURA_VIEWBOX.height,
  },
  {
    id: 'bl-map-seireitei',
    worldId: 'world-bleach',
    slug: 'seireitei',
    name: 'Seireitei',
    localizedName: { it: 'Seireitei', en: 'Seireitei', ja: '瀞霊廷' },
    description: {
      it: "Il Seireitei, la città degli Shinigami racchiusa dalle mura di sekkiseki: le caserme delle tredici Divisioni del Gotei 13, la collina del Sōkyoku e il Senzaikyū, il recinto della Central 46 con il Muken sotto, la villa dei Kuchiki, l'Accademia Shin'ō e le ombre da cui emerge il Wandenreich. Le posizioni sono indicative: l'opera non fornisce una pianta della città. Doppio clic su «Torna ai Tre Mondi» per risalire.",
      en: "The Seireitei, the Soul Reapers' city enclosed by the sekkiseki walls: the barracks of the Gotei 13's thirteen Divisions, Sōkyoku Hill and the Senzaikyū, the Central 46 compound with Muken beneath it, the Kuchiki manor, the Shin'ō Academy and the shadows the Wandenreich emerges from. Positions are indicative: the series gives no plan of the city. Double-click 'Back to the Three Worlds' to go back up.",
    },
    parentLevelId: 'bl-map-world',
    triggerLocationId: 'loc-bl-seireitei',
    backgroundAssetId: 'bl-map-seireitei',
    width: BLEACH_SEIREITEI_VIEWBOX.width,
    height: BLEACH_SEIREITEI_VIEWBOX.height,
  },
  {
    id: 'bl-map-hueco-mundo',
    worldId: 'world-bleach',
    slug: 'hueco-mundo',
    name: 'Hueco Mundo · Las Noches',
    localizedName: { it: 'Hueco Mundo · Las Noches', en: 'Hueco Mundo · Las Noches', ja: '虚圏・虚夜宮' },
    description: {
      it: "Il deserto bianco di Hueco Mundo sotto una luna che non tramonta, e la fortezza di Las Noches con la sua cupola: dentro, un cielo artificiale, la sala del trono di Aizen, i palazzi degli Espada e le arene degli scontri della missione di salvataggio di Orihime. Schema concettuale, posizioni indicative. Doppio clic sulla Garganta per tornare ai Tre Mondi.",
      en: "The white desert of Hueco Mundo under a moon that never sets, and the fortress of Las Noches with its dome: inside, an artificial sky, Aizen's throne room, the Espada's palaces and the arenas of the fights of the mission to rescue Orihime. Conceptual diagram, indicative positions. Double-click the Garganta to go back to the Three Worlds.",
    },
    parentLevelId: 'bl-map-world',
    triggerLocationId: 'loc-bl-las-noches',
    backgroundAssetId: 'bl-map-hueco-mundo',
    width: BLEACH_HUECO_MUNDO_VIEWBOX.width,
    height: BLEACH_HUECO_MUNDO_VIEWBOX.height,
  },
  {
    id: 'bl-map-reiokyu',
    worldId: 'world-bleach',
    slug: 'reiokyu',
    name: 'Reiōkyū',
    localizedName: { it: 'Reiōkyū', en: 'Reiōkyū (Soul King Palace)', ja: '霊王宮' },
    description: {
      it: "Il Reiōkyū, il Palazzo del Re delle Anime sospeso sopra la Soul Society: il bozzolo dove riposa il Re delle Anime e le città-disco dei membri della Divisione Zero (Kirinden, Gatonden, Hōōden, il palazzo di Senjumaru e quello di Ichibē), che Ichigo attraversa per prepararsi alla guerra contro il Wandenreich. Schema concettuale. Doppio clic su «Torna ai Tre Mondi» per risalire.",
      en: "The Reiōkyū, the Soul King Palace floating above the Soul Society: the cocoon where the Soul King rests and the disc-cities of the Royal Guard members (Kirinden, Gatonden, Hōōden, Senjumaru's palace and Ichibē's), which Ichigo passes through to prepare for the war against the Wandenreich. Conceptual diagram. Double-click 'Back to the Three Worlds' to go back up.",
    },
    parentLevelId: 'bl-map-world',
    triggerLocationId: 'loc-bl-reiokyu',
    backgroundAssetId: 'bl-map-reiokyu',
    width: BLEACH_REIOKYU_VIEWBOX.width,
    height: BLEACH_REIOKYU_VIEWBOX.height,
  },
];
