import type { Localizable, TimelineEvent } from '@/types';

/**
 * I desideri espressi ai draghi (Shenron, Porunga, Super Shenron, il drago di
 * Cereal, le Sfere del Regno dei Demoni…), come eventi della timeline con il
 * tag `WISH_TAG`. Il tag li rende un marcatore della mappa
 * (`WorldConfig.mapMarkers` in worlds.ts): il filtro «Evidenzia i desideri del
 * Drago» accende in rosso i luoghi dove sono stati espressi.
 *
 * Qui stanno i desideri che non avevano ancora un evento; quelli già presenti
 * (Oolong, Porunga su Namecc, C-17, Pilaf in GT, Gomah e Glorio in DAIMA, la
 * Terra ricreata in GT) ricevono il tag in index.ts tramite `TAGGED_WISH_EVENTS`.
 */
export const WISH_TAG = 'desiderio-del-drago';

/** Eventi già presenti che raccontano un desiderio. */
export const TAGGED_WISH_EVENTS = [
  'evt-dbz-oolong-wish',
  'evt-dbz-porunga-wishes',
  'evt-dbz-17-wish',
  'evt-dbz-gt-black-star-scattered',
  'evt-dbz-gt-earth-restored',
  'evt-dbz-daima-shrunk',
  'evt-dbz-daima-restored',
];

const w = (
  o: Omit<TimelineEvent, 'worldId' | 'canon' | 'canonStatus' | 'referenceStatus' | 'period'> & {
    period: Localizable;
    canon?: TimelineEvent['canon'];
    referenceStatus?: TimelineEvent['referenceStatus'];
  },
): TimelineEvent => {
  const canon = o.canon ?? 'canon';
  return {
    worldId: 'world-dragonball',
    referenceStatus: 'verified',
    ...o,
    canon,
    canonStatus: canon,
    tags: [...new Set([WISH_TAG, 'sfere-del-drago', ...(o.tags ?? [])])],
  };
};

const DB = { it: 'Dragon Ball', en: 'Dragon Ball' };
const DBZ = { it: 'Dragon Ball Z', en: 'Dragon Ball Z' };
const DBS = { it: 'Dragon Ball Super', en: 'Dragon Ball Super' };

export const dragonballWishes: TimelineEvent[] = [
  w({
    id: 'evt-dbz-wish-bora',
    title: { it: 'Upa riporta in vita Bora', en: 'Upa brings Bora back to life' },
    description: {
      it: "Sconfitto il Red Ribbon e trovata l'ultima sfera grazie a Baba la Veggente, Goku riunisce le sette Sfere e cede il desiderio a Upa: Shenron riporta in vita suo padre Bora, ucciso da Tao Pai Pai ai piedi della Torre di Karin.",
      en: "With the Red Ribbon defeated and the last ball found thanks to Fortuneteller Baba, Goku gathers all seven Dragon Balls and gives the wish to Upa: Shenron brings back his father Bora, killed by Tao Pai Pai at the foot of Korin Tower.",
    },
    period: DB,
    arcId: 'arc-dbz-red-ribbon',
    locationId: 'loc-dbz-korin-tower',
    characterIds: ['char-dbz-goku', 'char-dbz-upa', 'char-dbz-bora', 'char-dbz-shenron'],
    order: 5.15,
    tags: ['shenron'],
  }),
  w({
    id: 'evt-dbz-wish-king-piccolo-youth',
    title: { it: 'Il Grande Mago Piccolo ritrova la giovinezza', en: 'King Piccolo regains his youth' },
    description: {
      it: "Con le Sfere raccolte dalla banda di Pilaf, il Grande Mago Piccolo chiede a Shenron di restituirgli la giovinezza. Appena esaudito il desiderio uccide il drago, perché nessun altro possa più usarlo.",
      en: "With the Dragon Balls gathered by Pilaf's gang, King Piccolo asks Shenron to restore his youth. As soon as the wish is granted he kills the dragon, so that no one else can ever use it.",
    },
    period: DB,
    arcId: 'arc-dbz-king-piccolo',
    characterIds: ['char-dbz-king-piccolo', 'char-dbz-shenron', 'char-dbz-pilaf', 'char-dbz-mai', 'char-dbz-shu'],
    order: 7.05,
    tags: ['shenron', 'morte'],
  }),
  w({
    id: 'evt-dbz-wish-king-piccolo-victims',
    title: { it: 'Tornano in vita le vittime del Grande Mago Piccolo', en: "King Piccolo's victims return to life" },
    description: {
      it: "Dopo la sconfitta del Grande Mago Piccolo, il Supremo ricrea Shenron. Il primo desiderio riporta in vita chi era stato ucciso da Piccolo e dai suoi demoni, tra cui Crilin, il Genio delle Tartarughe e Jiaozi.",
      en: "After King Piccolo's defeat, Kami recreates Shenron. The first wish brings back those killed by Piccolo and his demons, including Krillin, Master Roshi and Chiaotzu.",
    },
    period: DB,
    arcId: 'arc-dbz-piccolo-jr',
    characterIds: ['char-dbz-goku', 'char-dbz-kami', 'char-dbz-shenron', 'char-dbz-krillin', 'char-dbz-master-roshi', 'char-dbz-chaozu'],
    order: 8.15,
    referenceStatus: 'needs_verification',
    tags: ['shenron', 'resurrezione'],
  }),
  w({
    id: 'evt-dbz-wish-frieza-victims',
    title: { it: 'Shenron riporta in vita le vittime di Freezer', en: "Shenron revives Frieza's victims" },
    description: {
      it: "Con il Supremo di nuovo in vita grazie a Porunga, le Sfere della Terra tornano attive. Mentre Goku combatte Freezer su Namecc, Shenron riporta in vita tutti coloro che Freezer e i suoi uomini avevano ucciso: anche Vegeta, Dende e il Grande Anziano Guru, e con lui le Sfere di Namecc.",
      en: "With Kami alive again thanks to Porunga, Earth's Dragon Balls are active once more. While Goku fights Frieza on Namek, Shenron brings back everyone Frieza and his men had killed: Vegeta, Dende and Grand Elder Guru too, and with him Namek's Dragon Balls.",
    },
    period: DBZ,
    arcId: 'arc-dbz-namek-frieza',
    characterIds: ['char-dbz-shenron', 'char-dbz-vegeta', 'char-dbz-dende', 'char-dbz-guru', 'char-dbz-mr-popo'],
    order: 31.5,
    tags: ['shenron', 'resurrezione'],
  }),
  w({
    id: 'evt-dbz-wish-namek-evacuation',
    title: { it: 'Tutti sulla Terra, tranne Goku e Freezer', en: 'Everyone to Earth, except Goku and Frieza' },
    description: {
      it: "Su indicazione di Guru e di Re Kaioh, Dende evoca di nuovo Porunga e chiede, nella lingua di Namecc, di trasportare sulla Terra tutti gli abitanti del pianeta tranne Freezer. Goku chiede di restare per finire lo scontro: Porunga lascia su Namecc solo lui e Freezer.",
      en: "On Guru's and King Kai's instructions, Dende summons Porunga again and asks, in the Namekian language, to transport everyone on the planet to Earth except Frieza. Goku asks to stay and finish the fight: Porunga leaves only him and Frieza on Namek.",
    },
    period: DBZ,
    arcId: 'arc-dbz-namek-frieza',
    locationId: 'loc-dbz-namek-porunga-site',
    characterIds: ['char-dbz-dende', 'char-dbz-porunga', 'char-dbz-guru', 'char-dbz-king-kai', 'char-dbz-goku', 'char-dbz-frieza'],
    order: 31.6,
    tags: ['porunga', 'namecc'],
  }),
  w({
    id: 'evt-dbz-wish-west-city-porunga',
    title: { it: 'Porunga a West City: Crilin e Yamcha tornano', en: 'Porunga in West City: Krillin and Yamcha return' },
    description: {
      it: "Centotrenta giorni dopo, sulla Terra, i Namecciani evocano Porunga a West City. Crilin torna in vita, ma il drago rivela che Goku è vivo e non vuole tornare: verrà da solo. L'ultimo desiderio riporta in vita Yamcha.",
      en: "A hundred and thirty days later, on Earth, the Namekians summon Porunga in West City. Krillin returns to life, but the dragon reveals that Goku is alive and does not want to come back: he will return on his own. The last wish brings back Yamcha.",
    },
    period: DBZ,
    arcId: 'arc-dbz-namek-frieza',
    locationId: 'loc-dbz-west-city',
    locationIds: ['loc-dbz-west-city', 'loc-dbz-wc-capsule-hq'],
    characterIds: ['char-dbz-porunga', 'char-dbz-krillin', 'char-dbz-yamcha', 'char-dbz-goku', 'char-dbz-bulma', 'char-dbz-dende'],
    order: 32.15,
    tags: ['porunga', 'resurrezione'],
  }),
  w({
    id: 'evt-dbz-wish-tien-chiaotzu',
    title: { it: 'Tenshinhan e Jiaozi tornano in vita', en: 'Tien and Chiaotzu return to life' },
    description: {
      it: "Dopo altri centotrenta giorni le Sfere di Namecc sono di nuovo pronte: i primi due desideri riportano in vita Tenshinhan e Jiaozi, caduti contro Nappa.",
      en: "After another hundred and thirty days Namek's Dragon Balls are ready again: the first two wishes bring back Tien and Chiaotzu, who fell against Nappa.",
    },
    period: DBZ,
    arcId: 'arc-dbz-namek-frieza',
    locationId: 'loc-dbz-west-city',
    characterIds: ['char-dbz-porunga', 'char-dbz-tenshinhan', 'char-dbz-chaozu'],
    order: 32.18,
    referenceStatus: 'needs_verification',
    tags: ['porunga', 'resurrezione'],
  }),
  w({
    id: 'evt-dbz-wish-cell-victims',
    title: { it: 'Le vittime di Cell e le bombe dei cyborg', en: "Cell's victims and the androids' bombs" },
    description: {
      it: "Al Palazzo del Supremo i guerrieri evocano Shenron: il primo desiderio riporta in vita tutti gli uccisi da Cell. Crilin chiede di trasformare C-17 e C-18 in esseri umani, ma è oltre il potere del drago: ottiene invece che vengano rimosse le bombe nei loro corpi.",
      en: "At Kami's Lookout the fighters summon Shenron: the first wish brings back everyone Cell killed. Krillin asks for Androids 17 and 18 to be turned into humans, but it is beyond the dragon's power: instead he has the bombs inside them removed.",
    },
    period: DBZ,
    arcId: 'arc-dbz-cell-saga',
    locationId: 'loc-dbz-lookout',
    locationIds: ['loc-dbz-lookout', 'loc-dbz-lk-palace'],
    characterIds: ['char-dbz-shenron', 'char-dbz-krillin', 'char-dbz-android-17', 'char-dbz-android-18', 'char-dbz-dende', 'char-dbz-gohan'],
    order: 47.05,
    tags: ['shenron', 'resurrezione'],
  }),
  w({
    id: 'evt-dbz-wish-buu-porunga',
    title: { it: 'I tre desideri di Porunga contro Majin Bu', en: "Porunga's three wishes against Majin Buu" },
    description: {
      it: "Mentre Goku e Vegeta affrontano Kid Bu, Dende sul Nuovo Namecc esprime a Porunga i desideri dettati da Vegeta: ripristinare la Terra, riportare in vita tutti i non malvagi morti dalla mattina del Torneo Tenkaichi e restituire a Goku tutta la sua energia.",
      en: "While Goku and Vegeta face Kid Buu, Dende on New Namek makes the wishes Vegeta dictated to Porunga: restore the Earth, bring back every non-evil person who died since the morning of the World Martial Arts Tournament, and restore Goku's full energy.",
    },
    period: DBZ,
    arcId: 'arc-dbz-majin-buu',
    locationId: 'loc-dbz-new-namek',
    characterIds: ['char-dbz-porunga', 'char-dbz-dende', 'char-dbz-vegeta', 'char-dbz-goku', 'char-dbz-king-kai'],
    order: 56.5,
    tags: ['porunga', 'resurrezione'],
  }),
  w({
    id: 'evt-dbz-wish-erase-buu-memories',
    title: { it: 'Il mondo dimentica Majin Bu', en: 'The world forgets Majin Buu' },
    description: {
      it: "Sconfitto Kid Bu, Shenron cancella il ricordo di Majin Bu dalla memoria di tutti gli abitanti della Terra, tranne gli amici e la famiglia di Goku: così il Bu buono può vivere con Mr. Satan senza terrorizzare nessuno.",
      en: "With Kid Buu defeated, Shenron erases Majin Buu from the memory of everyone on Earth except Goku's friends and family: so the good Buu can live with Mr. Satan without terrifying anyone.",
    },
    period: DBZ,
    arcId: 'arc-dbz-majin-buu',
    characterIds: ['char-dbz-shenron', 'char-dbz-majin-buu', 'char-dbz-mr-satan', 'char-dbz-dende'],
    order: 57.05,
    tags: ['shenron'],
  }),
  w({
    id: 'evt-dbz-wish-universe-6-earth',
    title: { it: 'Super Shenron e la Terra dell\'Universo 6', en: "Super Shenron and Universe 6's Earth" },
    description: {
      it: "Al termine del torneo fra Universo 6 e Universo 7 vengono evocate per la prima volta le Super Sfere del Drago: il desiderio riporta in vita la Terra dell'Universo 6, distrutta molto tempo prima.",
      en: "At the end of the tournament between Universe 6 and Universe 7 the Super Dragon Balls are summoned for the first time: the wish restores Universe 6's Earth, destroyed long before.",
    },
    period: DBS,
    arcId: 'arc-dbz-universe-6',
    locationId: 'loc-dbz-nameless-planet',
    characterIds: ['char-dbz-super-shenron', 'char-dbz-beerus', 'char-dbz-champa', 'char-dbz-whis', 'char-dbz-vados'],
    order: 63.05,
    referenceStatus: 'needs_verification',
    tags: ['super-shenron'],
  }),
  w({
    id: 'evt-dbz-wish-cheelai',
    title: { it: 'Cheelai salva Broly', en: 'Cheelai saves Broly' },
    description: {
      it: "Mentre Gogeta sta per finire Broly, Cheelai usa le Sfere del Drago raccolte dall'esercito di Freezer e chiede a Shenron di riportare l'amico sul pianeta Vampa, mettendolo in salvo.",
      en: "As Gogeta is about to finish Broly off, Cheelai uses the Dragon Balls gathered by the Frieza Force and asks Shenron to send her friend back to planet Vampa, bringing him to safety.",
    },
    period: DBS,
    arcId: 'arc-dbz-broly-movie',
    characterIds: ['char-dbz-cheelai', 'char-dbz-broly', 'char-dbz-shenron', 'char-dbz-gogeta'],
    canon: 'movie',
    order: 73.05,
    tags: ['shenron', 'broly'],
  }),
  w({
    id: 'evt-dbz-wish-moro',
    title: { it: 'I desideri di Moro', en: "Moro's wishes" },
    description: {
      it: "Sul Nuovo Namecc Moro costringe Porunga a esaudirlo: il primo desiderio gli restituisce la magia che gli era stata sigillata, il secondo libera tutti i detenuti della Prigione Galattica, che diventano il suo esercito.",
      en: "On New Namek Moro forces Porunga to grant his wishes: the first restores the magic that had been sealed away from him, the second frees every inmate of the Galactic Prison, who become his army.",
    },
    period: DBS,
    arcId: 'arc-dbz-moro',
    locationId: 'loc-dbz-new-namek',
    characterIds: ['char-dbz-moro', 'char-dbz-porunga'],
    order: 73.7,
    tags: ['porunga', 'manga'],
  }),
  w({
    id: 'evt-dbz-wish-granolah',
    title: { it: 'Il desiderio di Granolah', en: "Granolah's wish" },
    description: {
      it: "Sul pianeta Cereal, Granolah usa le Sfere del Drago dei Cereal e chiede di diventare il guerriero più forte dell'universo, per vendicare il suo popolo sterminato. Il drago lo avverte che il prezzo è la sua vita, che si accorcia drasticamente.",
      en: "On planet Cereal, Granolah uses the Cerealian Dragon Balls and asks to become the strongest warrior in the universe, to avenge his exterminated people. The dragon warns him that the price is his life, which is drastically shortened.",
    },
    period: DBS,
    arcId: 'arc-dbz-granolah',
    locationId: 'loc-dbz-planet-cereal',
    characterIds: ['char-dbz-granolah', 'char-dbz-monaito'],
    order: 76.5,
    tags: ['manga'],
  }),
];
