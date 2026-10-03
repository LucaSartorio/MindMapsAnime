import type { MapLevel } from '@/types';
import {
  AOT_LIBERIO_VIEWBOX,
  AOT_PARADIS_VIEWBOX,
  AOT_PATHS_VIEWBOX,
  AOT_SHIGANSHINA_VIEWBOX,
  AOT_TROST_VIEWBOX,
  AOT_WALLS_VIEWBOX,
  AOT_WORLD_VIEWBOX,
} from './mapConstants';

const W = 'world-attackontitan';

/**
 * Map level di Attack on Titan. Il Mondo è la radice; Paradis si apre dal pin
 * dell'isola, le Mura dal pin al centro di Paradis, Shiganshina e Trost dai loro
 * distretti; Liberio e i Sentieri si aprono dalla mappa del mondo. Ogni sotto-mappa ha
 * un pin di RITORNO verso il livello superiore.
 */
export const aotMapLevels: MapLevel[] = [
  {
    id: 'aot-map-world',
    worldId: W,
    slug: 'world',
    name: 'The World',
    localizedName: { it: 'Il Mondo', en: 'The World', ja: '世界', fr: 'Le Monde', de: 'Die Welt', es: 'El Mundo' },
    description: {
      it: "Il mondo di Attack on Titan è la nostra Terra capovolta, come ha spiegato lo stesso Isayama: il continente di Marley è l'Africa rovesciata, l'isola di Paradis è il Madagascar, Hizuru il Giappone e le nazioni del Medio Oriente la penisola arabica. Mappa originale AniMapVerse disegnata sui contorni reali ribaltati.",
      en: "The world of Attack on Titan is our Earth turned upside down, as Isayama himself explained: the Marleyan mainland is Africa flipped over, Paradis Island is Madagascar, Hizuru is Japan and the Mid-East nations are the Arabian peninsula. An original AniMapVerse map drawn on the real coastlines, flipped.",
    },
    backgroundAssetId: 'aot-map-world',
    width: AOT_WORLD_VIEWBOX.width,
    height: AOT_WORLD_VIEWBOX.height,
  },
  {
    id: 'aot-map-paradis',
    worldId: W,
    slug: 'paradis',
    name: 'Paradis Island',
    localizedName: { it: 'Isola di Paradis', en: 'Paradis Island', ja: 'パラディ島', fr: 'Île du Paradis', de: 'Insel Paradis', es: 'Isla Paradis' },
    description: {
      it: "L'isola dove il re Karl Fritz si ritirò con gli Eldiani dopo la Grande Guerra dei Giganti: le tre Mura al centro, le terre dei Giganti tutt'intorno, e sulla costa occidentale, rivolta verso Marley, la rupe dove gli Eldiani del continente vengono trasformati in Giganti e il porto costruito dopo l'850.",
      en: "The island to which King Karl Fritz withdrew with the Eldians after the Great Titan War: the three Walls at its centre, the Titans' lands all around, and on the west coast, facing Marley, the cliff where mainland Eldians are turned into Titans and the port built after 850.",
    },
    parentLevelId: 'aot-map-world',
    triggerLocationId: 'loc-aot-paradis',
    backgroundAssetId: 'aot-map-paradis',
    width: AOT_PARADIS_VIEWBOX.width,
    height: AOT_PARADIS_VIEWBOX.height,
  },
  {
    id: 'aot-map-walls',
    worldId: W,
    slug: 'walls',
    name: 'Within the Walls',
    localizedName: { it: 'Dentro le Mura', en: 'Within the Walls', ja: '壁の内側', fr: 'À l’intérieur des Murs', de: 'Innerhalb der Mauern', es: 'Dentro de los Muros' },
    description: {
      it: "Le tre Mura in scala — Sina a 250 km dal centro, Rose a 380, Maria a 480 — con i distretti che sporgono all'esterno di ogni muro sui punti cardinali, la capitale Mitras, la Città Sotterranea, i villaggi, i castelli e la Foresta degli Alberi Giganti.",
      en: "The three Walls to scale — Sina 250 km from the centre, Rose 380, Maria 480 — with the districts jutting outward from each wall at the cardinal points, the capital Mitras, the Underground City, the villages, the castles and the Forest of Giant Trees.",
    },
    parentLevelId: 'aot-map-paradis',
    triggerLocationId: 'loc-aot-walls',
    backgroundAssetId: 'aot-map-walls',
    width: AOT_WALLS_VIEWBOX.width,
    height: AOT_WALLS_VIEWBOX.height,
  },
  {
    id: 'aot-map-shiganshina',
    worldId: W,
    slug: 'shiganshina',
    name: 'Shiganshina District',
    localizedName: { it: 'Distretto di Shiganshina', en: 'Shiganshina District', ja: 'シガンシナ区', fr: 'District de Shiganshina', de: 'Bezirk Shiganshina', es: 'Distrito de Shiganshina' },
    description: {
      it: "Il distretto più a sud di Wall Maria, dove tutto comincia e dove l'umanità torna cinque anni dopo: la casa degli Jaeger con la cantina di Grisha, il cancello esterno sfondato dal Colossale, il cancello interno, e oltre le mura il campo della carica di Erwin.",
      en: "Wall Maria's southernmost district, where everything begins and where humanity returns five years later: the Yeager house with Grisha's basement, the outer gate smashed by the Colossal Titan, the inner gate, and beyond the walls the field of Erwin's charge.",
    },
    parentLevelId: 'aot-map-walls',
    triggerLocationId: 'loc-aot-shiganshina',
    backgroundAssetId: 'aot-map-shiganshina',
    width: AOT_SHIGANSHINA_VIEWBOX.width,
    height: AOT_SHIGANSHINA_VIEWBOX.height,
  },
  {
    id: 'aot-map-trost',
    worldId: W,
    slug: 'trost',
    name: 'Trost District',
    localizedName: { it: 'Distretto di Trost', en: 'Trost District', ja: 'トロスト区', fr: 'District de Trost', de: 'Bezirk Trost', es: 'Distrito de Trost' },
    description: {
      it: "Il distretto sud di Wall Rose, teatro della prima vittoria dell'umanità: il cancello esterno sfondato dal Colossale e sigillato dal Gigante d'Attacco con un macigno, il quartier generale dei rifornimenti, le retrovie e il cancello interno.",
      en: "Wall Rose's southern district, the stage of humanity's first victory: the outer gate smashed by the Colossal Titan and sealed by the Attack Titan with a boulder, the supply headquarters, the rearguard and the inner gate.",
    },
    parentLevelId: 'aot-map-walls',
    triggerLocationId: 'loc-aot-trost',
    backgroundAssetId: 'aot-map-trost',
    width: AOT_TROST_VIEWBOX.width,
    height: AOT_TROST_VIEWBOX.height,
  },
  {
    id: 'aot-map-liberio',
    worldId: W,
    slug: 'liberio',
    name: 'Liberio',
    localizedName: { it: 'Liberio', en: 'Liberio', ja: 'レベリオ', fr: 'Liberio', de: 'Liberio', es: 'Liberio' },
    description: {
      it: "La città marleyana sulla costa nord-orientale del continente: il quartiere marleyano con il quartier generale dei Guerrieri, la zona d'internamento dove vivono gli Eldiani del continente, il palco della dichiarazione di Willy Tybur e il porto militare.",
      en: "The Marleyan city on the north-eastern coast of the mainland: the Marleyan quarter with the Warriors' headquarters, the internment zone where the mainland Eldians live, the stage of Willy Tybur's declaration and the naval port.",
    },
    parentLevelId: 'aot-map-world',
    triggerLocationId: 'loc-aot-liberio',
    backgroundAssetId: 'aot-map-liberio',
    width: AOT_LIBERIO_VIEWBOX.width,
    height: AOT_LIBERIO_VIEWBOX.height,
  },
  {
    id: 'aot-map-paths',
    worldId: W,
    slug: 'paths',
    name: 'The Paths',
    localizedName: { it: 'I Sentieri', en: 'The Paths', ja: '道', fr: 'Les Chemins', de: 'Die Pfade', es: 'Los Caminos' },
    description: {
      it: "La dimensione senza tempo in cui tutti gli Eldiani sono collegati: un deserto sotto un cielo stellato, l'albero di luce da cui partono i Sentieri e il punto delle Coordinate, dove Ymir plasma i corpi dei Giganti con la sabbia. Schema originale, non una mappa geografica.",
      en: "The timeless dimension in which all Eldians are connected: a desert under a starry sky, the tree of light from which the Paths branch out and the Coordinate, where Ymir shapes the Titans' bodies out of sand. An original diagram, not a geographic map.",
    },
    parentLevelId: 'aot-map-world',
    triggerLocationId: 'loc-aot-paths-gate',
    backgroundAssetId: 'aot-map-paths',
    width: AOT_PATHS_VIEWBOX.width,
    height: AOT_PATHS_VIEWBOX.height,
  },
];
