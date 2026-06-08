import type { Character, CharacterImportance, CharacterStatus } from '@/types';

/**
 * Ottava ondata di personaggi: i volti ancora mancanti del mondo di One Piece
 * (ciurma del Rosso, Pirati Buggy, Heart Pirates, Gifter e funzionari di Wano,
 * viceammiragli, giganti della Grand Fleet, ecc.). A differenza delle ondate
 * precedenti, ogni personaggio nasce già «agganciato» alla tela: fazioni, luoghi,
 * archi, eventi, alleati, nemici e parenti — così il grafo del dataset resta
 * completamente connesso.
 */
interface Seed {
  id: string;
  name: string;
  aliases?: string[];
  importance: CharacterImportance;
  role: string[];
  gender: string;
  status: CharacterStatus;
  factionIds?: string[];
  locationIds?: string[];
  arcIds?: string[];
  eventIds?: string[];
  allies?: string[];
  enemies?: string[];
  family?: string[];
  relationships?: { targetCharacterId: string; label: string }[];
  fm?: string;
  fa?: string;
  it: string;
  en: string;
  lit: string;
  len: string;
  tags: string[];
}

const C = (s: Seed): Character => ({
  id: s.id,
  worldId: 'world-onepiece',
  name: s.name,
  ...(s.aliases ? { aliases: s.aliases } : {}),
  importance: s.importance,
  role: s.role,
  gender: s.gender,
  ...(s.factionIds ? { factionIds: s.factionIds } : {}),
  ...(s.locationIds ? { locationIds: s.locationIds } : {}),
  ...(s.arcIds ? { arcIds: s.arcIds } : {}),
  ...(s.eventIds ? { eventIds: s.eventIds } : {}),
  ...(s.allies ? { allies: s.allies } : {}),
  ...(s.enemies ? { enemies: s.enemies } : {}),
  ...(s.family ? { family: s.family } : {}),
  ...(s.relationships ? { relationships: s.relationships } : {}),
  ...(s.fm ? { firstMangaAppearance: s.fm } : {}),
  ...(s.fa ? { firstAnimeAppearance: s.fa } : {}),
  shortDescription: { it: s.it, en: s.en },
  longDescription: { it: s.lit, en: s.len },
  status: s.status,
  canonStatus: 'canon',
  referenceStatus: 'verified',
  tags: s.tags,
});

export const onepieceCharactersExtra8: Character[] = [
  /* ---------------------- Ciurma di Shanks (Pirati del Rosso) ---------------------- */
  C({
    id: 'char-op-benn-beckman', name: 'Benn Beckman', importance: 'minor', role: ['ally'], gender: 'male', status: 'alive',
    factionIds: ['faction-op-red-hair-pirates'], locationIds: ['loc-op-foosha-village'],
    arcIds: ['arc-op-romance-dawn', 'arc-op-marineford'], eventIds: ['evt-op-shanks-hat', 'evt-op-mf-shanks-ends-war'],
    allies: ['char-op-shanks', 'char-op-yasopp', 'char-op-lucky-roux'], relationships: [{ targetCharacterId: 'char-op-shanks', label: 'Capitano' }],
    fm: '1', fa: '4',
    it: "Primo ufficiale dei Pirati del Rosso, mente strategica e braccio destro di Shanks.",
    en: "First mate of the Red-Hair Pirates, the strategic mind and right hand of Shanks.",
    lit: "Benn Beckman, lucidissimo vicecapitano della ciurma di Shanks, è ritenuto fra gli uomini più intelligenti dei mari; bastò la sua presenza a fermare un ammiraglio durante la Guerra al Vertice.",
    len: "Benn Beckman, the razor-sharp first mate of Shanks's crew, is reckoned among the smartest men on the seas; his mere presence was enough to halt an admiral during the Summit War.",
    tags: ['rosso', 'east-blue'],
  }),
  C({
    id: 'char-op-yasopp', name: 'Yasopp', importance: 'minor', role: ['ally'], gender: 'male', status: 'alive',
    factionIds: ['faction-op-red-hair-pirates'], locationIds: ['loc-op-syrup-village', 'loc-op-foosha-village'],
    arcIds: ['arc-op-romance-dawn', 'arc-op-syrup-village'], eventIds: ['evt-op-shanks-hat'],
    allies: ['char-op-shanks', 'char-op-benn-beckman'], family: ['char-op-usopp', 'char-op-banchina'],
    relationships: [{ targetCharacterId: 'char-op-usopp', label: 'Figlio' }, { targetCharacterId: 'char-op-shanks', label: 'Capitano' }],
    fm: '27', fa: '10',
    it: "Cecchino infallibile dei Pirati del Rosso e padre di Usop, partito per il mare quando il figlio era piccolo.",
    en: "The unerring sniper of the Red-Hair Pirates and Usopp's father, who left for the sea when his son was small.",
    lit: "Yasopp, tiratore scelto capace di colpire le antenne di una formica senza sfiorarne il corpo, lasciò Syrup Village e la moglie Banchina per seguire Shanks; il figlio Usop ne ereditò il talento e il sogno.",
    len: "Yasopp, a marksman able to shoot the antennae off an ant without grazing its body, left Syrup Village and his wife Banchina to follow Shanks; his son Usopp inherited his talent and his dream.",
    tags: ['rosso', 'east-blue', 'cecchino'],
  }),
  C({
    id: 'char-op-lucky-roux', name: 'Lucky Roux', importance: 'background', role: ['ally'], gender: 'male', status: 'alive',
    factionIds: ['faction-op-red-hair-pirates'], locationIds: ['loc-op-foosha-village'],
    arcIds: ['arc-op-romance-dawn'], eventIds: ['evt-op-shanks-hat'],
    allies: ['char-op-shanks', 'char-op-benn-beckman', 'char-op-yasopp'], relationships: [{ targetCharacterId: 'char-op-shanks', label: 'Capitano' }],
    fm: '1', fa: '4',
    it: "Corpulento e gioviale membro dei Pirati del Rosso, sempre con una coscia di carne in mano.",
    en: "The rotund, jovial member of the Red-Hair Pirates, ever with a leg of meat in hand.",
    lit: "Lucky Roux, allegro pistolero della ciurma di Shanks, freddò il bandito Higuma per salvare il piccolo Rufy, mostrando la lealtà spietata che si cela dietro il sorriso dei Pirati del Rosso.",
    len: "Lucky Roux, the cheerful gunman of Shanks's crew, shot the bandit Higuma to save young Luffy, showing the ruthless loyalty hidden behind the Red-Hair Pirates' smiles.",
    tags: ['rosso', 'east-blue'],
  }),

  /* ---------------------- Pirati di Buggy / Alvida ---------------------- */
  C({
    id: 'char-op-alvida', name: 'Alvida', aliases: ['Alvida la Mazza Chiodata'], importance: 'minor', role: ['antagonist'], gender: 'female', status: 'alive',
    factionIds: ['faction-op-buggy-pirates'], locationIds: ['loc-op-orange-town'],
    arcIds: ['arc-op-romance-dawn', 'arc-op-loguetown'], eventIds: ['evt-op-rd-coby-alvida', 'evt-op-loguetown-execution'],
    allies: ['char-op-buggy', 'char-op-coby'], enemies: ['char-op-luffy'], relationships: [{ targetCharacterId: 'char-op-coby', label: 'Ex sottoposto' }],
    fm: '2', fa: '1',
    it: "Prima nemica di Rufy, piratessa che dopo il Frutto Sdrucciola divenne bellissima e si alleò con Buggy.",
    en: "Luffy's first foe, a pirate who, after the Slip-Slip Fruit, became beautiful and allied with Buggy.",
    lit: "Alvida «la Mazza Chiodata», crudele capitano che teneva Coby in schiavitù, fu il primo avversario di Rufy; mangiato il Frutto Sube Sube divenne liscia e affascinante, unendosi a Buggy nella caccia ai Cappello di Paglia.",
    len: "Alvida 'the Iron Mace', the cruel captain who kept Coby enslaved, was Luffy's first opponent; after eating the Slip-Slip Fruit she became smooth and alluring, joining Buggy in the hunt for the Straw Hats.",
    tags: ['east-blue', 'buggy'],
  }),
  C({
    id: 'char-op-mohji', name: 'Mohji', aliases: ['il Domatore'], importance: 'background', role: ['antagonist'], gender: 'male', status: 'alive',
    factionIds: ['faction-op-buggy-pirates'], locationIds: ['loc-op-orange-town'],
    arcIds: ['arc-op-orange-town'], eventIds: ['evt-op-buggy-orange-town', 'evt-op-fight-luffy-buggy'],
    allies: ['char-op-buggy', 'char-op-cabaji'], enemies: ['char-op-luffy'], relationships: [{ targetCharacterId: 'char-op-buggy', label: 'Capitano' }],
    fm: '9', fa: '4',
    it: "Domatore di bestie dei Pirati di Buggy, sempre accompagnato dal leone Richie.",
    en: "The beast-tamer of the Buggy Pirates, always accompanied by the lion Richie.",
    lit: "Mohji «il Domatore», stravagante ufficiale di Buggy che combatte insieme al leone Richie, fu sconfitto da Rufy a Orange Town durante l'assalto del pagliaccio al villaggio.",
    len: "Mohji 'the Beast Tamer', an eccentric Buggy officer who fights alongside the lion Richie, was beaten by Luffy at Orange Town during the clown's assault on the village.",
    tags: ['east-blue', 'buggy'],
  }),
  C({
    id: 'char-op-cabaji', name: 'Cabaji', aliases: ['l\'Acrobata'], importance: 'background', role: ['antagonist'], gender: 'male', status: 'alive',
    factionIds: ['faction-op-buggy-pirates'], locationIds: ['loc-op-orange-town'],
    arcIds: ['arc-op-orange-town'], eventIds: ['evt-op-buggy-orange-town', 'evt-op-fight-luffy-buggy'],
    allies: ['char-op-buggy', 'char-op-mohji'], enemies: ['char-op-zoro'], relationships: [{ targetCharacterId: 'char-op-buggy', label: 'Capitano' }],
    fm: '11', fa: '5',
    it: "Spadaccino acrobata dei Pirati di Buggy, che combatte in equilibrio su un monociclo.",
    en: "The acrobat swordsman of the Buggy Pirates, who fights balanced on a unicycle.",
    lit: "Cabaji «l'Acrobata», abile schermidore al servizio di Buggy, sfidò Zoro a Orange Town con i suoi trucchi da circo, ma fu battuto nonostante le ferite dello spadaccino.",
    len: "Cabaji 'the Acrobat', a skilled fencer in Buggy's service, challenged Zoro at Orange Town with his circus tricks, but was beaten despite the swordsman's wounds.",
    tags: ['east-blue', 'buggy'],
  }),

  /* ---------------------- Heart Pirates (ciurma di Law) ---------------------- */
  C({
    id: 'char-op-bepo', name: 'Bepo', importance: 'minor', role: ['ally'], gender: 'male', status: 'alive',
    factionIds: ['faction-op-heart-pirates'], locationIds: ['loc-op-sabaody', 'loc-op-zou'],
    arcIds: ['arc-op-sabaody', 'arc-op-punk-hazard', 'arc-op-dressrosa', 'arc-op-zou'], eventIds: ['evt-op-zou-alliance'],
    allies: ['char-op-law', 'char-op-luffy', 'char-op-inuarashi', 'char-op-nekomamushi'], relationships: [{ targetCharacterId: 'char-op-law', label: 'Capitano' }],
    fm: '498', fa: '392',
    it: "Navigatore mink orso polare degli Heart Pirates, fedelissimo amico di Trafalgar Law.",
    en: "The polar-bear mink navigator of the Heart Pirates, Trafalgar Law's most loyal friend.",
    lit: "Bepo, timido ma fortissimo mink della tribù degli orsi e maestro di arti marziali, è il navigatore della ciurma di Law fin dalla giovinezza; originario di Zou, vi fece ritorno con i compagni durante l'alleanza con Rufy.",
    len: "Bepo, the shy but immensely strong bear-tribe mink and martial artist, has been Law's navigator since their youth; a native of Zou, he returned there with his crewmates during the alliance with Luffy.",
    tags: ['heart', 'mink', 'supernova'],
  }),
  C({
    id: 'char-op-shachi', name: 'Shachi', importance: 'background', role: ['ally'], gender: 'male', status: 'alive',
    factionIds: ['faction-op-heart-pirates'], locationIds: ['loc-op-sabaody', 'loc-op-zou'],
    arcIds: ['arc-op-sabaody', 'arc-op-dressrosa', 'arc-op-zou'],
    allies: ['char-op-law', 'char-op-bepo', 'char-op-penguin'], relationships: [{ targetCharacterId: 'char-op-law', label: 'Capitano' }],
    fm: '594', fa: '510',
    it: "Veterano membro degli Heart Pirates, inseparabile compagno di Penguin.",
    en: "A veteran member of the Heart Pirates, Penguin's inseparable partner.",
    lit: "Shachi, energico sottoposto di Trafalgar Law presente fin dai primi giorni della ciurma, condivide con Penguin e Bepo la cieca devozione per il capitano.",
    len: "Shachi, an energetic subordinate of Trafalgar Law present from the crew's earliest days, shares with Penguin and Bepo a blind devotion to their captain.",
    tags: ['heart', 'supernova'],
  }),
  C({
    id: 'char-op-penguin', name: 'Penguin', importance: 'background', role: ['ally'], gender: 'male', status: 'alive',
    factionIds: ['faction-op-heart-pirates'], locationIds: ['loc-op-sabaody', 'loc-op-zou'],
    arcIds: ['arc-op-sabaody', 'arc-op-dressrosa', 'arc-op-zou'],
    allies: ['char-op-law', 'char-op-bepo', 'char-op-shachi'], relationships: [{ targetCharacterId: 'char-op-law', label: 'Capitano' }],
    fm: '594', fa: '510',
    it: "Membro storico degli Heart Pirates, sempre col berretto su cui è scritto il suo nome.",
    en: "A long-standing member of the Heart Pirates, ever wearing the cap with his name on it.",
    lit: "Penguin, leale uomo di Law e compagno di Shachi, fa parte del nucleo originario degli Heart Pirates; combatté al fianco della ciurma nell'alleanza contro Doflamingo e Kaido.",
    len: "Penguin, a loyal man of Law and Shachi's partner, is part of the Heart Pirates' original core; he fought alongside the crew in the alliance against Doflamingo and Kaido.",
    tags: ['heart', 'supernova'],
  }),

  /* ---------------------- Giganti / Grand Fleet ---------------------- */
  C({
    id: 'char-op-hajrudin', name: 'Hajrudin', importance: 'minor', role: ['ally'], gender: 'male', status: 'alive',
    factionIds: ['faction-op-straw-hat-grand-fleet'], locationIds: ['loc-op-dressrosa', 'loc-op-elbaf'],
    arcIds: ['arc-op-dressrosa'], eventIds: ['evt-op-dr-colosseum', 'evt-op-doflamingo-defeat'],
    allies: ['char-op-luffy', 'char-op-dorry', 'char-op-brogy'], relationships: [{ targetCharacterId: 'char-op-luffy', label: 'Ammiraglio della Grand Fleet' }],
    fm: '713', fa: '649',
    it: "Giovane mercenario gigante di Elbaf che, ispirato da Rufy, divenne capitano della Flotta dei Sette.",
    en: "A young giant mercenary of Elbaf who, inspired by Luffy, became a captain of the Grand Fleet.",
    lit: "Hajrudin, gigante guerriero che combatté al Colosseo di Dressrosa, fu conquistato dalla determinazione di Rufy; giurò fedeltà ai Cappello di Paglia con i Nuovi Giganti, sognando di erigere un nuovo regno di Elbaf.",
    len: "Hajrudin, a giant warrior who fought in the Dressrosa Colosseum, was won over by Luffy's resolve; he pledged loyalty to the Straw Hats with the New Giant Warriors, dreaming of raising a new kingdom of Elbaf.",
    tags: ['dressrosa', 'giganti', 'elbaf', 'grand-fleet'],
  }),
  C({
    id: 'char-op-kamakiri', name: 'Kamakiri', importance: 'background', role: ['ally'], gender: 'male', status: 'alive',
    factionIds: ['faction-op-shandia'], locationIds: ['loc-op-skypiea', 'loc-op-upper-yard'],
    arcIds: ['arc-op-skypiea'], eventIds: ['evt-op-fight-wiper-enel', 'evt-op-skypiea-bell'],
    allies: ['char-op-wiper', 'char-op-calgara', 'char-op-aisa'], enemies: ['char-op-enel'],
    fm: '238', fa: '157',
    it: "Valoroso guerriero Shandia, fedele luogotenente di Wiper nella guerra per Upper Yard.",
    en: "A brave Shandia warrior, Wiper's loyal lieutenant in the war for the Upper Yard.",
    lit: "Kamakiri, fiero combattente del popolo Shandia, lottò al fianco di Wiper per riconquistare la terra ancestrale dai cieli di Skypiea e contro la tirannia di Enel.",
    len: "Kamakiri, a proud fighter of the Shandia people, battled alongside Wiper to reclaim their ancestral land in the skies of Skypiea and against Enel's tyranny.",
    tags: ['skypiea', 'shandia'],
  }),

  /* ---------------------- Wano: Gifter, Numbers, funzionari ---------------------- */
  C({
    id: 'char-op-babanuki', name: 'Babanuki', importance: 'background', role: ['antagonist'], gender: 'male', status: 'alive',
    factionIds: ['faction-op-beasts-pirates'], locationIds: ['loc-op-wano', 'loc-op-onigashima'],
    arcIds: ['arc-op-wano'], eventIds: ['evt-op-onigashima-war'],
    allies: ['char-op-queen', 'char-op-kaido'], enemies: ['char-op-luffy'], relationships: [{ targetCharacterId: 'char-op-queen', label: 'Superiore' }],
    fm: '925', fa: '930',
    it: "Headliner dei Pirati delle Cento Bestie e direttore della prigione di Udon, con uno SMILE dell'elefante.",
    en: "A Headliner of the Beasts Pirates and warden of the Udon prison, with an elephant SMILE.",
    lit: "Babanuki, gifter dall'enorme corpo capace di trasformarsi in elefante e sparare proiettili, sorvegliava i prigionieri ai lavori forzati di Udon, dove incrociò Rufy e il vecchio boss Hyogoro.",
    len: "Babanuki, a gifter whose huge body can turn into an elephant and fire shells, oversaw the forced-labor prisoners of Udon, where he crossed paths with Luffy and the old boss Hyogoro.",
    tags: ['wano', 'cento-bestie', 'gifter'],
  }),
  C({
    id: 'char-op-speed', name: 'Speed', importance: 'background', role: ['neutral'], gender: 'female', status: 'alive',
    factionIds: ['faction-op-beasts-pirates'], locationIds: ['loc-op-kuri', 'loc-op-wano'],
    arcIds: ['arc-op-wano'], eventIds: ['evt-op-fight-luffy-zoro-holdem'],
    allies: ['char-op-tama', 'char-op-luffy'], enemies: ['char-op-holdem'], relationships: [{ targetCharacterId: 'char-op-tama', label: 'Ammansita dai dango' }],
    fm: '914', fa: '903',
    it: "Gifter dei Pirati delle Cento Bestie con uno SMILE del cavallo, ammansita dai poteri di Otama.",
    en: "A Beasts Pirates gifter with a horse SMILE, tamed by Otama's powers.",
    lit: "Speed, ex sottoposta di Holdem dal corpo metà donna metà pony, fu addomesticata dai dango di Otama e portò Rufy e Tama in salvo, passando dalla parte della rivolta di Wano.",
    len: "Speed, a former Holdem subordinate with a half-woman, half-pony body, was tamed by Otama's dango and carried Luffy and Tama to safety, crossing over to the Wano rebellion.",
    tags: ['wano', 'cento-bestie', 'gifter'],
  }),
  C({
    id: 'char-op-bao-huang', name: 'Bao Huang', importance: 'background', role: ['antagonist'], gender: 'female', status: 'alive',
    factionIds: ['faction-op-beasts-pirates'], locationIds: ['loc-op-onigashima'],
    arcIds: ['arc-op-wano'], eventIds: ['evt-op-onigashima-war'],
    allies: ['char-op-kaido', 'char-op-orochi'], enemies: ['char-op-luffy'],
    fm: '979', fa: '1021',
    it: "Tobiroppo onoraria dei Pirati delle Cento Bestie con uno SMILE del coniglio, dalla vista a distanza.",
    en: "An honorary Tobiroppo of the Beasts Pirates with a rabbit SMILE and long-range sight.",
    lit: "Bao Huang, gifter che con i suoi occhi-coniglio sparsi per Onigashima fungeva da sorveglianza e altoparlante di Kaido, annunciò a tutta l'isola lo scontro finale per Wano.",
    len: "Bao Huang, a gifter whose rabbit-eyes scattered across Onigashima served as Kaido's surveillance and loudspeaker, broadcast the final battle for Wano to the whole island.",
    tags: ['wano', 'cento-bestie', 'gifter'],
  }),
  C({
    id: 'char-op-hatcha', name: 'Hatcha', aliases: ['Number Eight'], importance: 'background', role: ['antagonist'], gender: 'male', status: 'alive',
    factionIds: ['faction-op-beasts-pirates'], locationIds: ['loc-op-onigashima'],
    arcIds: ['arc-op-wano'], eventIds: ['evt-op-onigashima-war'],
    allies: ['char-op-kaido', 'char-op-king', 'char-op-queen'], enemies: ['char-op-luffy'],
    fm: '991', fa: '1035',
    it: "Uno dei Numbers, i giganti artificiali dei Pirati delle Cento Bestie nati da esperimenti con gli SMILE.",
    en: "One of the Numbers, the artificial giants of the Beasts Pirates born from SMILE experiments.",
    lit: "Hatcha «Number Eight», colosso ottuso e ghiottone tra i Numbers di Kaido, devastò Onigashima durante la guerra finché non fu fermato dall'alleanza dei samurai.",
    len: "Hatcha 'Number Eight', a dull and gluttonous colossus among Kaido's Numbers, rampaged through Onigashima during the war until stopped by the samurai alliance.",
    tags: ['wano', 'cento-bestie', 'numbers'],
  }),
  C({
    id: 'char-op-otsuru', name: 'Tsuru', aliases: ['O-Tsuru'], importance: 'minor', role: ['ally'], gender: 'female', status: 'alive',
    locationIds: ['loc-op-kuri', 'loc-op-wano'],
    arcIds: ['arc-op-wano'],
    allies: ['char-op-luffy', 'char-op-tama', 'char-op-hyogoro'], relationships: [{ targetCharacterId: 'char-op-tama', label: 'Figura materna' }],
    fm: '911', fa: '901',
    it: "Gentile proprietaria della casa da tè di Okobore a Wano, che sfama gli affamati nonostante la miseria.",
    en: "The kind owner of the Okobore tea house in Wano, who feeds the hungry despite her own poverty.",
    lit: "O-Tsuru, anziana e generosa locandiera della Città degli Avanzi, accolse Rufy e custodì la piccola Tama; incarna la dignità del popolo di Wano oppresso da Orochi e Kaido.",
    len: "O-Tsuru, the elderly and generous innkeeper of Okobore Town, took in Luffy and looked after little Tama; she embodies the dignity of Wano's people oppressed by Orochi and Kaido.",
    tags: ['wano', 'kozuki'],
  }),

  /* ---------------------- Marina: viceammiragli e ufficiali ---------------------- */
  C({
    id: 'char-op-bastille', name: 'Bastille', aliases: ['Bambù del Diavolo'], importance: 'background', role: ['neutral'], gender: 'male', status: 'alive',
    factionIds: ['faction-op-marines'], locationIds: ['loc-op-dressrosa'],
    arcIds: ['arc-op-dressrosa'], eventIds: ['evt-op-doflamingo-defeat'],
    allies: ['char-op-fujitora', 'char-op-tsuru'], enemies: ['char-op-luffy', 'char-op-law'], relationships: [{ targetCharacterId: 'char-op-fujitora', label: 'Superiore' }],
    fm: '700', fa: '629',
    it: "Viceammiraglio della Marina dall'elmo cornuto, schierato a Dressrosa sotto l'ammiraglio Fujitora.",
    en: "A horned-helmet Marine vice admiral, deployed in Dressrosa under Admiral Fujitora.",
    lit: "Bastille «Bambù del Diavolo», imponente spadaccino della Marina, partecipò all'operazione di Dressrosa e tentò invano di catturare Rufy e Law nella fuga dall'isola di Doflamingo.",
    len: "Bastille 'Devil Bamboo', an imposing Marine swordsman, took part in the Dressrosa operation and tried in vain to capture Luffy and Law during the escape from Doflamingo's island.",
    tags: ['marina', 'dressrosa'],
  }),
  C({
    id: 'char-op-t-bone', name: 'T-Bone', aliases: ['l\'Uomo Forte'], importance: 'background', role: ['neutral'], gender: 'male', status: 'alive',
    factionIds: ['faction-op-marines'], locationIds: ['loc-op-water-seven'],
    arcIds: ['arc-op-enies-lobby'], eventIds: ['evt-op-robin-rescue'],
    enemies: ['char-op-zoro', 'char-op-sanji'], relationships: [{ targetCharacterId: 'char-op-smoker', label: 'Collega della Marina' }],
    fm: '375', fa: '263',
    it: "Capitano della Marina dallo scheletrico aspetto e dal forte senso di giustizia, affrontato sul Sea Train.",
    en: "A skeletal-looking Marine captain with a strong sense of justice, fought on the Sea Train.",
    lit: "T-Bone «l'Uomo Forte», integerrimo ufficiale della Marina, difese il convoglio per Enies Lobby sul ponte ferroviario, dove incrociò le lame con Zoro durante la corsa per salvare Robin.",
    len: "T-Bone 'the Strong Arm', an upright Marine officer, defended the Enies Lobby convoy on the railway bridge, where he crossed blades with Zoro during the race to save Robin.",
    tags: ['marina', 'enies-lobby'],
  }),
  C({
    id: 'char-op-jango', name: 'Jango', importance: 'background', role: ['neutral'], gender: 'male', status: 'alive',
    factionIds: ['faction-op-marines', 'faction-op-black-cat-pirates'], locationIds: ['loc-op-syrup-village'],
    arcIds: ['arc-op-syrup-village'], eventIds: ['evt-op-usopp-kuro'],
    allies: ['char-op-fullbody', 'char-op-hina'], enemies: ['char-op-usopp'], relationships: [{ targetCharacterId: 'char-op-kuro', label: 'Ex capitano' }],
    fm: '26', fa: '9',
    it: "Ipnotizzatore col disco, ex vicecomandante dei Gatti Neri di Kuro, poi arruolato nella Marina.",
    en: "A chakram-wielding hypnotist, former second of Kuro's Black Cats, later enlisted in the Marines.",
    lit: "Jango, comico ma pericoloso ipnotizzatore al servizio di Kuro a Syrup Village, finì col passare dalla parte della legge entrando nella Marina sotto il capitano Hina insieme a Fullbody.",
    len: "Jango, the comical yet dangerous hypnotist in Kuro's service at Syrup Village, ended up crossing to the side of the law, joining the Marines under Captain Hina alongside Fullbody.",
    tags: ['east-blue', 'marina', 'gatti-neri'],
  }),
  C({
    id: 'char-op-kong', name: 'Kong', importance: 'background', role: ['neutral'], gender: 'male', status: 'alive',
    factionIds: ['faction-op-world-government', 'faction-op-marines'], locationIds: ['loc-op-mary-geoise'],
    arcIds: ['arc-op-marineford', 'arc-op-reverie'],
    allies: ['char-op-sengoku', 'char-op-garp'], relationships: [{ targetCharacterId: 'char-op-sengoku', label: 'Successore come Grand\'Ammiraglio' }],
    fm: '233', fa: '151',
    it: "Comandante in capo delle forze armate del Governo Mondiale ed ex Grand'Ammiraglio della Marina.",
    en: "Commander-in-chief of the World Government's armed forces and a former Marine Fleet Admiral.",
    lit: "Kong, veterano che guidò la Marina prima di Sengoku, salì al vertice delle forze del Governo Mondiale; rappresenta la continuità del potere militare tra l'epoca di Roger e quella attuale.",
    len: "Kong, the veteran who led the Marines before Sengoku, rose to the head of the World Government's forces; he represents the continuity of military power from Roger's era to the present.",
    tags: ['marina', 'governo'],
  }),

  /* ---------------------- New Fish-Man Pirates ---------------------- */
  C({
    id: 'char-op-zeo', name: 'Zeo', importance: 'background', role: ['antagonist'], gender: 'male', status: 'alive',
    factionIds: ['faction-op-new-fishman-pirates'], locationIds: ['loc-op-fishman-island'],
    arcIds: ['arc-op-fishman-island'], eventIds: ['evt-op-fishman-island', 'evt-op-fight-luffy-hody'],
    allies: ['char-op-hody'], enemies: ['char-op-luffy', 'char-op-brook'], relationships: [{ targetCharacterId: 'char-op-hody', label: 'Capitano' }],
    fm: '634', fa: '552',
    it: "Ufficiale dei Nuovi Pirati Uomini-Pesce, fanatico razzista al servizio di Hody Jones.",
    en: "An officer of the New Fish-Man Pirates, a racist fanatic in the service of Hody Jones.",
    lit: "Zeo, uomo-pesce dell'arcipelago, fu uno degli ufficiali del golpe di Hody contro la famiglia reale Ryugu; combatté i Cappello di Paglia nella battaglia per l'Isola degli Uomini-Pesce.",
    len: "Zeo, a fish-man of the archipelago, was one of the officers in Hody's coup against the Ryugu royal family; he fought the Straw Hats in the battle for Fish-Man Island.",
    tags: ['fish-man-island', 'new-fishman'],
  }),
  C({
    id: 'char-op-ikaros-much', name: 'Ikaros Much', importance: 'background', role: ['antagonist'], gender: 'male', status: 'alive',
    factionIds: ['faction-op-new-fishman-pirates'], locationIds: ['loc-op-fishman-island'],
    arcIds: ['arc-op-fishman-island'], eventIds: ['evt-op-fishman-island', 'evt-op-fight-luffy-hody'],
    allies: ['char-op-hody', 'char-op-zeo'], enemies: ['char-op-luffy', 'char-op-usopp'], relationships: [{ targetCharacterId: 'char-op-hody', label: 'Capitano' }],
    fm: '634', fa: '552',
    it: "Ufficiale calamaro dei Nuovi Pirati Uomini-Pesce, armato di lance di ghiaccio essiccato.",
    en: "A squid officer of the New Fish-Man Pirates, armed with dried-squid lances.",
    lit: "Ikaros Much, gigantesco uomo-pesce calamaro, servì Hody Jones nel tentativo di soggiogare l'Isola degli Uomini-Pesce; fu sconfitto durante l'insurrezione respinta da Rufy e dalla ciurma.",
    len: "Ikaros Much, a giant squid fish-man, served Hody Jones in the bid to subjugate Fish-Man Island; he was defeated during the uprising repelled by Luffy and the crew.",
    tags: ['fish-man-island', 'new-fishman'],
  }),

  /* ---------------------- CP9 / Water Seven (restanti) ---------------------- */
  C({
    id: 'char-op-nero', name: 'Nero', importance: 'background', role: ['antagonist'], gender: 'male', status: 'alive',
    factionIds: ['faction-op-cp9'], locationIds: ['loc-op-water-seven'],
    arcIds: ['arc-op-water-seven'], eventIds: ['evt-op-ws-cp9-reveal'],
    allies: ['char-op-lucci', 'char-op-kaku', 'char-op-blueno'], enemies: ['char-op-luffy'], relationships: [{ targetCharacterId: 'char-op-lucci', label: 'Superiore' }],
    fm: '375', fa: '264',
    it: "Recluta della CP9 priva del sesto addestramento Rokushiki, uccisa da Rob Lucci per la sua debolezza.",
    en: "A CP9 rookie lacking the sixth Rokushiki training, killed by Rob Lucci for his weakness.",
    lit: "Nero, agente novizio della CP9 che padroneggiava solo cinque delle sei tecniche del Rokushiki, fu freddato senza pietà da Lucci a bordo della Puffing Tom, simbolo della spietatezza dell'unità segreta.",
    len: "Nero, a rookie CP9 agent who had mastered only five of the six Rokushiki techniques, was mercilessly struck down by Lucci aboard the Puffing Tom — a symbol of the secret unit's ruthlessness.",
    tags: ['water-seven', 'cp9'],
  }),
  C({
    id: 'char-op-zambai', name: 'Zambai', importance: 'background', role: ['ally'], gender: 'male', status: 'alive',
    locationIds: ['loc-op-water-seven'],
    arcIds: ['arc-op-water-seven', 'arc-op-enies-lobby'], eventIds: ['evt-op-el-merry-funeral'],
    allies: ['char-op-franky', 'char-op-iceburg'], relationships: [{ targetCharacterId: 'char-op-franky', label: 'Capo (Franky Family)' }],
    fm: '329', fa: '233',
    it: "Vicecapo della Franky Family di Water Seven, fedele braccio destro di Cutty Flam (Franky).",
    en: "The second-in-command of Water Seven's Franky Family, loyal right hand of Cutty Flam (Franky).",
    lit: "Zambai, capo dei recuperatori e cacciatori di taglie della Franky Family, guidò gli uomini di Franky nell'assalto a Enies Lobby e nella costruzione della Thousand Sunny.",
    len: "Zambai, the head of the Franky Family's salvagers and bounty hunters, led Franky's men in the assault on Enies Lobby and the building of the Thousand Sunny.",
    tags: ['water-seven', 'franky-family'],
  }),
  C({
    id: 'char-op-chimney', name: 'Chimney', importance: 'background', role: ['ally'], gender: 'female', status: 'alive',
    locationIds: ['loc-op-water-seven'],
    arcIds: ['arc-op-water-seven', 'arc-op-enies-lobby'],
    family: ['char-op-kokoro'], allies: ['char-op-luffy'], relationships: [{ targetCharacterId: 'char-op-kokoro', label: 'Nonna' }],
    fm: '349', fa: '247',
    it: "Vivace bambina di Water Seven, nipote della capostazione Kokoro, accompagnata dal coniglio-gatto Gonbe.",
    en: "A lively Water Seven child, granddaughter of stationmaster Kokoro, with her cat-rabbit Gonbe.",
    lit: "Chimney, intraprendente nipotina di Kokoro, seguì la ciurma fino a Enies Lobby aiutandola a muoversi tra i binari del Sea Train e la cascata della Porta della Giustizia.",
    len: "Chimney, the plucky little granddaughter of Kokoro, followed the crew all the way to Enies Lobby, helping them navigate the Sea Train tracks and the Gate of Justice waterfall.",
    tags: ['water-seven'],
  }),

  /* ---------------------- Alabasta: Karoo ---------------------- */
  C({
    id: 'char-op-karoo', name: 'Karoo', importance: 'background', role: ['ally'], gender: 'male', status: 'alive',
    locationIds: ['loc-op-alabasta'],
    arcIds: ['arc-op-alabasta'], eventIds: ['evt-op-alabasta-war', 'evt-op-vivi-farewell'],
    allies: ['char-op-vivi', 'char-op-luffy'], relationships: [{ targetCharacterId: 'char-op-vivi', label: 'Cavalcatura e amico' }],
    fm: '127', fa: '78',
    it: "Super-anatra Spot-Billed e fedele cavalcatura della principessa Vivi, membro onorario della ciurma.",
    en: "A Spot-Billed super-duck and loyal mount of Princess Vivi, an honorary crew member.",
    lit: "Karoo, coraggioso super-spot capitano della Squadra Anatre Reali di Alabasta, accompagnò Vivi e i Cappello di Paglia in tutte le loro avventure nel regno del deserto, mettendo a rischio la vita per la principessa.",
    len: "Karoo, the brave Spot-Billed leader of Alabasta's Super Spot-Billed Duck Squad, accompanied Vivi and the Straw Hats through all their adventures in the desert kingdom, risking his life for the princess.",
    tags: ['alabasta'],
  }),
];
