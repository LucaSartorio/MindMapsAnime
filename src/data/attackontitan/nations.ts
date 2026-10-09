import type { Nation } from '@/types';
import { AOT_COLORS } from './mapConstants';

const nat = (n: Omit<Nation, 'worldId' | 'canonStatus' | 'referenceStatus'>): Nation => ({
  worldId: 'world-attackontitan',
  canonStatus: 'canon',
  referenceStatus: 'verified',
  ...n,
});

/**
 * Territori di Attack on Titan (facet «Territorio»): i tre territori dentro le Mura,
 * l'isola di Paradis fuori dalle Mura, e le nazioni del continente e dell'Oriente.
 * `labelPosition` è sul piano della mappa del mondo (2000 × 950); i territori delle
 * Mura non ne hanno, perché la mappa delle Mura disegna già i loro nomi.
 */
export const aotNations: Nation[] = [
  nat({
    id: 'nation-aot-wall-maria',
    name: 'Wall Maria territory',
    localizedName: { it: 'Territorio di Wall Maria', en: 'Wall Maria territory', ja: 'ウォール・マリア', fr: 'Territoire du Mur Maria', de: 'Gebiet von Wall Maria', es: 'Territorio del Muro María' },
    japaneseName: 'ウォール・マリア',
    type: 'great_nation',
    description: {
      it: "La fascia più esterna dentro le Mura, cento chilometri fra Wall Maria e Wall Rose: campi, villaggi, la Foresta degli Alberi Giganti e i distretti di Shiganshina e Quinta. Cade nell'845, viene riconquistata nell'850.",
      en: 'The outermost belt inside the Walls, a hundred kilometres between Wall Maria and Wall Rose: fields, villages, the Forest of Giant Trees and the districts of Shiganshina and Quinta. It falls in 845 and is retaken in 850.',
    },
    descriptionLong: {
      it: "Quando il Colossale e il Corazzato sfondano Shiganshina, l'intero territorio va perduto: un quinto della popolazione viene sacrificato l'anno dopo in una finta «operazione di riconquista» per alleggerire la crisi alimentare. Cinque anni più tardi il Corpo di Ricerca sigilla la breccia con l'indurimento di Eren e riprende Wall Maria al prezzo di quasi tutti i suoi uomini e del comandante Erwin.",
      en: "When the Colossal and Armored Titans break through Shiganshina, the whole territory is lost: a fifth of the population is sacrificed the following year in a sham 'recapture operation' to ease the food crisis. Five years later the Survey Corps seals the breach with Eren's hardening and retakes Wall Maria at the cost of almost all its soldiers and of Commander Erwin.",
    },
    capitalLocationId: 'loc-aot-shiganshina',
    color: AOT_COLORS.wallMaria,
    tags: ['mura', 'wall-maria'],
  }),
  nat({
    id: 'nation-aot-wall-rose',
    name: 'Wall Rose territory',
    localizedName: { it: 'Territorio di Wall Rose', en: 'Wall Rose territory', ja: 'ウォール・ローゼ', fr: 'Territoire du Mur Rose', de: 'Gebiet von Wall Rose', es: 'Territorio del Muro Rose' },
    japaneseName: 'ウォール・ローゼ',
    type: 'great_nation',
    description: {
      it: "La fascia di mezzo, centotrenta chilometri fra Wall Rose e Wall Sina: dopo l'845 è la prima linea dell'umanità. Ci sono Trost, Karanes, Krolva e Utopia, i villaggi di Ragako e Dauper, il castello di Utgard e la cappella dei Reiss.",
      en: "The middle belt, a hundred and thirty kilometres between Wall Rose and Wall Sina: after 845 it is humanity's front line. It holds Trost, Karanes, Krolva and Utopia, the villages of Ragako and Dauper, Utgard Castle and the Reiss chapel.",
    },
    capitalLocationId: 'loc-aot-trost',
    color: AOT_COLORS.wallRose,
    tags: ['mura', 'wall-rose'],
  }),
  nat({
    id: 'nation-aot-wall-sina',
    name: 'Wall Sina territory',
    localizedName: { it: 'Territorio di Wall Sina', en: 'Wall Sina territory', ja: 'ウォール・シーナ', fr: 'Territoire du Mur Sina', de: 'Gebiet von Wall Sina', es: 'Territorio del Muro Sina' },
    japaneseName: 'ウォール・シーナ',
    type: 'great_nation',
    description: {
      it: "Il cerchio più interno, 250 chilometri di raggio: la capitale Mitras con il palazzo reale e la Città Sotterranea, e i distretti di Stohess, Ehrmich, Yarckel e Orvud. Ci vivono i nobili, il governo e la Gendarmeria.",
      en: 'The innermost circle, 250 kilometres in radius: the capital Mitras with the royal palace and the Underground City, and the districts of Stohess, Ehrmich, Yarckel and Orvud. Home of the nobility, the government and the Military Police.',
    },
    capitalLocationId: 'loc-aot-mitras',
    color: AOT_COLORS.wallSina,
    tags: ['mura', 'wall-sina', 'capitale'],
  }),
  nat({
    id: 'nation-aot-paradis',
    name: 'Paradis Island',
    localizedName: { it: 'Isola di Paradis', en: 'Paradis Island', ja: 'パラディ島', fr: 'Île du Paradis', de: 'Insel Paradis', es: 'Isla Paradis' },
    japaneseName: 'パラディ島',
    type: 'great_nation',
    description: {
      it: "L'isola degli Eldiani, chiamata «isola dei demoni» dal resto del mondo: il regno delle Mura al centro, le terre dei Giganti tutt'intorno, la costa da cui Marley getta i suoi prigionieri trasformati.",
      en: "The Eldians' island, called the 'island of devils' by the rest of the world: the kingdom of the Walls at its centre, the Titans' lands all around, and the coast where Marley throws its transformed prisoners.",
    },
    descriptionLong: {
      it: "Per cento anni gli abitanti delle Mura hanno creduto di essere gli ultimi esseri umani: il re Karl Fritz aveva cancellato la loro memoria con il potere del Fondatore. Dopo l'850 Paradis scopre il mondo esterno, si apre a Hizuru e ai volontari anti-Marley, costruisce un porto e una ferrovia — e diventa il bersaglio dell'intero mondo, fino al Boato della Terra.",
      en: "For a hundred years the people within the Walls believed they were the last humans: King Karl Fritz had erased their memory with the Founder's power. After 850 Paradis discovers the outside world, opens up to Hizuru and the anti-Marleyan volunteers, builds a port and a railway — and becomes the target of the whole world, until the Rumbling.",
    },
    capitalLocationId: 'loc-aot-mitras',
    labelPosition: { x: 1305, y: 352 },
    color: AOT_COLORS.paradis,
    tags: ['paradis', 'eldia', 'isola'],
  }),
  nat({
    id: 'nation-aot-marley',
    name: 'Marley',
    localizedName: { it: 'Marley', en: 'Marley', ja: 'マーレ', fr: 'Mahr', de: 'Marley', es: 'Marley' },
    japaneseName: 'マーレ',
    type: 'great_nation',
    description: {
      it: "La potenza che ha rovesciato l'Impero eldiano nella Grande Guerra dei Giganti e oggi domina il continente grazie ai Giganti che controlla: sette dei Nove, affidati ai Guerrieri eldiani cresciuti nelle sue zone d'internamento.",
      en: 'The power that overthrew the Eldian Empire in the Great Titan War and now dominates the mainland thanks to the Titans it controls: seven of the Nine, entrusted to Eldian Warriors raised in its internment zones.',
    },
    descriptionLong: {
      it: "Marley si racconta come la vittima di duemila anni di oppressione eldiana, salvata dall'eroe Helos — un mito costruito dalla famiglia Tybur, che in realtà aveva tradito l'Impero insieme a Karl Fritz. Gli Eldiani del continente vivono in zone d'internamento con fasce al braccio; i dissidenti vengono trasformati in Giganti puri sull'isola di Paradis. La costosa battaglia di Fort Slava e l'arrivo delle armi anti-Gigante convincono Marley che il tempo dei Giganti sta finendo: per questo vuole il Fondatore e le risorse di Paradis.",
      en: "Marley tells itself it is the victim of two thousand years of Eldian oppression, saved by the hero Helos — a myth built by the Tybur family, who had in fact betrayed the Empire together with Karl Fritz. Mainland Eldians live in internment zones wearing armbands; dissidents are turned into pure Titans on Paradis Island. The costly battle of Fort Slava and the arrival of anti-Titan weapons convince Marley that the age of Titans is ending: that is why it wants the Founder and Paradis's resources.",
    },
    capitalLocationId: 'loc-aot-liberio',
    labelPosition: { x: 1050, y: 520 },
    color: AOT_COLORS.marley,
    tags: ['marley', 'continente', 'guerrieri'],
  }),
  nat({
    id: 'nation-aot-mid-east',
    name: 'Mid-East Allied Forces',
    localizedName: { it: 'Alleanza del Medio Oriente', en: 'Mid-East Allied Forces', ja: '中東連合', fr: 'Forces alliées du Moyen-Orient', de: 'Allianz des Mittleren Ostens', es: 'Fuerzas Aliadas de Oriente Medio' },
    japaneseName: '中東連合',
    type: 'minor_nation',
    description: {
      it: "La coalizione di nazioni che fa guerra a Marley per quattro anni, fino alla battaglia di Fort Slava nell'854: le sue navi corazzate e i suoi cannoni dimostrano che le armi moderne possono ormai abbattere i Giganti.",
      en: 'The coalition of nations that wages war on Marley for four years, until the battle of Fort Slava in 854: its ironclads and its guns prove that modern weapons can now bring Titans down.',
    },
    labelPosition: { x: 1290, y: 600 },
    color: AOT_COLORS.midEast,
    tags: ['continente', 'guerra'],
  }),
  nat({
    id: 'nation-aot-hizuru',
    name: 'Hizuru',
    localizedName: { it: 'Hizuru', en: 'Hizuru', ja: 'ヒィズル国', fr: 'Hizuru', de: 'Hizuru', es: 'Hizuru' },
    japaneseName: 'ヒィズル国',
    type: 'minor_nation',
    description: {
      it: "La nazione dell'Oriente un tempo alleata dell'Impero eldiano, patria della famiglia Azumabito: la loro discendente Mikasa porta il loro stemma. Dopo l'850 Hizuru offre a Paradis un'alleanza per mettere le mani sulle sue risorse.",
      en: 'The Eastern nation once allied with the Eldian Empire, home of the Azumabito family: their descendant Mikasa bears their crest. After 850 Hizuru offers Paradis an alliance to get its hands on the island\'s resources.',
    },
    labelPosition: { x: 1770, y: 680 },
    color: AOT_COLORS.hizuru,
    tags: ['oriente', 'azumabito'],
  }),
  nat({
    id: 'nation-aot-paths',
    name: 'The Paths',
    localizedName: { it: 'I Sentieri', en: 'The Paths', ja: '道', fr: 'Les Chemins', de: 'Die Pfade', es: 'Los Caminos' },
    japaneseName: '道',
    type: 'neutral_land',
    description: {
      it: "Non un luogo ma una dimensione: il punto in cui tutti i Sentieri degli Eldiani convergono, dove il tempo non scorre e dove Ymir ha passato duemila anni a costruire Giganti.",
      en: 'Not a place but a dimension: the point where all the Eldians\' Paths converge, where time does not flow and where Ymir spent two thousand years building Titans.',
    },
    labelPosition: { x: 1835, y: 250 },
    color: AOT_COLORS.paths,
    tags: ['sentieri', 'coordinate', 'ymir'],
  }),
];
