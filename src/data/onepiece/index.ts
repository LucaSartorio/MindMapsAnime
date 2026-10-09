import { onepieceSlugs } from './slugs';
import { onepieceMarkerTags } from './markerTags';
import { withEventTags } from '../shared/eventTagKit';
import { onepieceBattles } from './battles';
import { withBattles } from '../shared/battleKit';
import { onepieceFamily } from './family';
import { withFamily } from '../shared/familyKit';
import { onepieceStructure } from './structure';
import { withFactionExtras } from '../shared/factionKit';
import type { Character, Faction, Jutsu, Location, PoneglyphRef, StoryArc, TimelineEvent, WorldDataset } from '@/types';
import { animeWorlds } from '@/data/worlds';
import { onepieceMapLevels } from './mapLevels';
import { onepieceNations } from './nations';
import { onepieceLocationsEastBlue } from './locations';
import { onepieceLocationsParadise } from './locationsParadise';
import { onepieceLocationsRedLine } from './locationsRedLine';
import { onepieceLocationsNewWorld } from './locationsNewWorld';
import { onepieceLocationsBlues } from './locationsBlues';
import { onepieceLocationsExtra } from './locationsExtra';
import { onepieceLocationsTotland } from './locationsTotland';
import { onepieceLocationsSubmaps } from './locationsSubmaps';
import { onepieceLocationsSubmaps2 } from './locationsSubmaps2';
import { onepieceLocationsSubmaps3 } from './locationsSubmaps3';
import { onepieceLocationsSubmapsExtra } from './locationsSubmapsExtra';
import { onepieceLocationsSubmaps4 } from './locationsSubmaps4';
import { onepieceLocationsSubmaps5 } from './locationsSubmaps5';
import { onepieceLocationsExtra2 } from './locationsExtra2';
import { onepieceLocationsSpace } from './locationsSpace';
import { onepieceLocationsThreeWorlds } from './locationsThreeWorlds';
import { onepieceLocationsExtra3 } from './locationsExtra3';
import { onepieceFactions } from './factions';
import { onepieceFactionsSouthBlue } from './factionsSouthBlue';
import { onepieceFactionsNorthBlue } from './factionsNorthBlue';
import { onepieceFactionsWestBlue } from './factionsWestBlue';
import { onepieceFactionsRedLine } from './factionsRedLine';
import { onepieceFactionsParadise } from './factionsParadise';
import { onepieceFactionsParadise2 } from './factionsParadise2';
import { onepieceFactionsWholeCakeWano } from './factionsWholeCakeWano';
import { onepieceFactionsEgghead } from './factionsEgghead';
import { onepieceFactionsSupernovas } from './factionsSupernovas';
import { onepieceFactionsExtra } from './factionsExtra';
import { onepieceFactionsWeapons } from './factionsWeapons';
import { onepieceFactionsExtra2 } from './factionsExtra2';
import { onepieceFactionsConcepts } from './factionsConcepts';
import { onepieceFactionsShips } from './factionsShips';
import { onepieceCharactersEastBlue } from './characters';
import { onepieceCharactersParadise } from './charactersParadise';
import { onepieceCharactersParadise2 } from './charactersParadise2';
import { onepieceCharactersNewWorldSagas } from './charactersNewWorldSagas';
import { onepieceCharactersWholeCakeWano } from './charactersWholeCakeWano';
import { onepieceCharactersEgghead } from './charactersEgghead';
import { onepieceCharactersSouthBlue } from './charactersSouthBlue';
import { onepieceCharactersNorthBlue } from './charactersNorthBlue';
import { onepieceCharactersWestBlue } from './charactersWestBlue';
import { onepieceCharactersRedLine } from './charactersRedLine';
import { onepieceCharactersSupernovas } from './charactersSupernovas';
import { onepieceCharactersExtra } from './charactersExtra';
import { onepieceCharactersExtra2 } from './charactersExtra2';
import { onepieceCharactersExtra3 } from './charactersExtra3';
import { onepieceCharactersExtra4 } from './charactersExtra4';
import { onepieceCharactersExtra5 } from './charactersExtra5';
import { onepieceCharactersExtra6 } from './charactersExtra6';
import { onepieceCharactersExtra7 } from './charactersExtra7';
import { onepieceCharactersExtra8 } from './charactersExtra8';
import { onepieceCharactersGrandFleet } from './charactersGrandFleet';
import { onepieceCharactersFilms } from './charactersFilms';
import { onepieceCharactersExtra9 } from './charactersExtra9';
import { onepieceCharactersExtra10 } from './charactersExtra10';
import { onepieceCharactersCompletion } from './charactersCompletion';
import { onepieceArcs } from './arcs';
import { onepieceArcsSouthBlue } from './arcsSouthBlue';
import { onepieceArcsNorthBlue } from './arcsNorthBlue';
import { onepieceArcsWestBlue } from './arcsWestBlue';
import { onepieceArcsRedLine } from './arcsRedLine';
import { onepieceArcsParadise } from './arcsParadise';
import { onepieceArcsParadise2 } from './arcsParadise2';
import { onepieceArcsNewWorldSagas } from './arcsNewWorldSagas';
import { onepieceArcsWholeCakeWano } from './arcsWholeCakeWano';
import { onepieceArcsEgghead } from './arcsEgghead';
import { onepieceArcsExtra } from './arcsExtra';
import { onepieceArcsCompletion } from './arcsCompletion';
import { onepieceEvents } from './events';
import { onepieceEventsSouthBlue } from './eventsSouthBlue';
import { onepieceEventsNorthBlue } from './eventsNorthBlue';
import { onepieceEventsWestBlue } from './eventsWestBlue';
import { onepieceEventsRedLine } from './eventsRedLine';
import { onepieceEventsParadise } from './eventsParadise';
import { onepieceEventsParadise2 } from './eventsParadise2';
import { onepieceEventsNewWorldSagas } from './eventsNewWorldSagas';
import { onepieceEventsWholeCakeWano } from './eventsWholeCakeWano';
import { onepieceEventsEgghead } from './eventsEgghead';
import { onepieceEventsExtra } from './eventsExtra';
import { onepieceEventsExtra2 } from './eventsExtra2';
import { onepieceEventsBattles } from './eventsBattles';
import { onepieceEventsBattles2 } from './eventsBattles2';
import { onepieceEventsBattles3 } from './eventsBattles3';
import { onepieceEventsExtra3 } from './eventsExtra3';
import { onepieceEventsSpace } from './eventsSpace';
import { onepieceEventsThreeWorlds } from './eventsThreeWorlds';
import { onepieceEventsCovers } from './eventsCovers';
import { onepieceEventsExtra4 } from './eventsExtra4';
import { onepieceEventsCompletion } from './eventsCompletion';
import { onepieceEventsFruits } from './eventsFruits';
import { onepieceEventsGaps } from './eventsGaps';
import { onepieceRoutes } from './routes';
import { onepieceRoutesGrandLine } from './routesGrandLine';
import { onepieceRoutesExtra } from './routesExtra';
import { onepieceDevilFruits } from './devilFruits';
import { onepieceDevilFruitsExtra } from './devilFruitsExtra';
import { onepieceDevilFruitsExtra2 } from './devilFruitsExtra2';
import { onepieceDevilFruitsExtra3 } from './devilFruitsExtra3';
import { onepieceAssets } from './assets';
import { onepieceBounties } from './bounties';
import { onepieceTrivia } from './trivia';
import { withCharacterLinks } from './characterLinks';
import { ONEPIECE_FRUIT_LONG, ONEPIECE_LOCATION_LONG } from './fruitsEnrichment';
import { onepieceTournaments } from './tournaments';
import { withSourceNames } from '@/data/shared/translations';
import { onepieceNames } from './names';

const onepiece = animeWorlds.find((w) => w.slug === 'onepiece')!;

/**
 * Dataset One Piece (in costruzione).
 *
 * Fase attuale — GEOGRAFIA COMPLETA: i quattro Mari e la Grand Line (Paradise +
 * New World) come `Nation`, e tutte le isole / punti di interesse della mappa
 * del mondo come `Location` (East Blue, Paradise, Red Line/Calm Belt, New World,
 * North/West/South Blue). Coordinate poste sul piano viewBox 2000 × 1000 e
 * marcate `needs_verification` finché non si rifiniscono sull'immagine ad alta
 * risoluzione.
 *
 * EAST BLUE COMPLETO: POI verificati (allineati sulla mappa), le ciurme e i
 * personaggi della Saga di East Blue (i 5 Cappello di Paglia + alleati,
 * Marina e antagonisti), i 6 archi narrativi, la timeline degli eventi e il
 * percorso della ciurma da Foosha a Reverse Mountain.
 *
 * Fasi successive (in ordine): South Blue, North Blue, West Blue, Calm Belt,
 * Red Line — POI verificati, percorsi, archi e timeline per ciascuno — e i
 * Frutti del Diavolo come `jutsu`/abilità.
 */
/**
 * I luoghi delle sotto-mappe sono quasi tutti posti canonici realmente esistenti
 * (es. il Patibolo di Roger a Loguetown, i livelli di Impel Down, la Torre della
 * Giustizia di Enies Lobby): vanno quindi marcati `verified`. Restano
 * `needs_verification` solo i pochi luoghi davvero dubbi — interni di God Valley
 * (isola distrutta e mai mappata), dettagli di Elbaf non ancora mostrati e alcune
 * stanze speculative — elencati qui sotto.
 */
const onepieceStillUnverifiedSubmapLocs = new Set<string>([
  // God Valley: l'isola fu distrutta ~38 anni fa, la sua geografia interna è ignota.
  'loc-op-gv-hunt', 'loc-op-gv-village', 'loc-op-gv-landing', 'loc-op-gv-forest',
  // Elbaf: dettagli non ancora canonicamente mostrati/posizionati.
  'loc-op-eb-dueling-ground', 'loc-op-eb-forge', 'loc-op-eb-hall',
  // Stanze/luoghi specifici speculativi.
  'loc-op-gk-sora', // Camera della Regina Sora (Germa)
  'loc-op-oh-olvia-lab', // Studio personale di Nico Olvia (Ohara)
  'loc-op-mg-national-treasure', // Camera del Tesoro Nazionale (Mary Geoise, mistero irrisolto)
  'loc-op-eg-kuma-room', // Camera di Kuma (Egghead)
]);

/**
 * Marca `verified` i luoghi delle sotto-mappe che sono canonici e realmente
 * esistenti, lasciando `needs_verification` solo quelli nel set dei dubbi.
 * I luoghi della mappa del mondo (`op-map-world`) non vengono toccati.
 */
function withVerifiedSubmaps(locations: Location[]): Location[] {
  return locations.map((l) =>
    l.mapLevelId !== 'op-map-world' &&
    l.referenceStatus === 'needs_verification' &&
    !onepieceStillUnverifiedSubmapLocs.has(l.id)
      ? { ...l, referenceStatus: 'verified' }
      : l,
  );
}

/**
 * Posizioni dei pin (in pixel dell'immagine) sulle sotto-mappe che hanno una
 * mappa reale: ricavate leggendo le etichette dell'immagine (Alabasta, Jaya),
 * l'ordine canonico verticale (Enies Lobby) o la disposizione delle regioni
 * (Wano). Sovrascrivono le coordinate concettuali dei file di definizione.
 */
const onepieceSubmapPinOverrides: Record<string, { x: number; y: number }> = {
  /* --- Alabasta (1192 × 670) --- */
  'loc-op-rainbase': { x: 350, y: 325 },
  'loc-op-al-rain-dinners': { x: 300, y: 355 },
  'loc-op-alubarna': { x: 560, y: 305 },
  'loc-op-al-royal-palace': { x: 575, y: 270 },
  'loc-op-al-tomb': { x: 610, y: 285 },
  'loc-op-tamarisk': { x: 845, y: 330 },
  'loc-op-al-sandora': { x: 515, y: 370 },
  'loc-op-al-desert': { x: 705, y: 415 },
  'loc-op-yuba': { x: 360, y: 465 },
  'loc-op-al-spiders-cafe': { x: 325, y: 580 },
  'loc-op-erumalu': { x: 500, y: 580 },
  'loc-op-katorea': { x: 655, y: 562 },
  'loc-op-nanohana': { x: 600, y: 620 },

  /* --- Jaya (1192 × 670) --- */
  'loc-op-jy-mock-town': { x: 322, y: 240 },
  'loc-op-jy-bar': { x: 372, y: 290 },
  'loc-op-jy-cricket-house': { x: 846, y: 157 },
  'loc-op-jy-south-half': { x: 787, y: 415 },
  'loc-op-jy-knock-up': { x: 660, y: 560 },

  /* --- Enies Lobby (469 × 600), stack verticale dal basso (arrivo) all'alto --- */
  'loc-op-el-station': { x: 160, y: 520 },
  'loc-op-el-plaza': { x: 250, y: 460 },
  'loc-op-el-courthouse': { x: 235, y: 320 },
  'loc-op-el-tower': { x: 235, y: 200 },
  'loc-op-el-gates': { x: 235, y: 110 },
  'loc-op-el-bridge': { x: 225, y: 32 },

  /* --- Wano (2000 × 1406): regioni a petalo + Onigashima staccata sotto --- */
  'loc-op-flower-capital': { x: 1000, y: 470 },
  'loc-op-kuri': { x: 360, y: 600 },
  'loc-op-wn-kibi': { x: 700, y: 300 },
  'loc-op-wn-ringo': { x: 1300, y: 290 },
  'loc-op-wn-hakumai': { x: 1560, y: 450 },
  'loc-op-wn-udon': { x: 820, y: 740 },
  'loc-op-onigashima': { x: 1000, y: 1170 },
  'loc-op-wn-oden-castle': { x: 300, y: 470 },
  'loc-op-wn-mt-atama': { x: 180, y: 440 },
  'loc-op-wn-amigasa': { x: 260, y: 720 },
  'loc-op-wn-bakura': { x: 520, y: 650 },
  'loc-op-wn-okobore': { x: 700, y: 600 },
};

/** Applica le posizioni dei pin delle sotto-mappe con immagine reale. */
function withSubmapPins(locations: Location[]): Location[] {
  return locations.map((l) => {
    const p = onepieceSubmapPinOverrides[l.id];
    return p ? { ...l, x: p.x, y: p.y } : l;
  });
}

/**
 * Poneglyph di One Piece, collocati nei luoghi dove sono stati trovati / letti /
 * rubati. Marcati sia sull'isola della mappa del mondo (per evidenziarla con il
 * filtro) sia sul punto preciso della relativa sotto-mappa.
 *  - `road`        → i 4 Road Poneglyph rossi che triangolano Laugh Tale
 *  - `information` → Poneglyph storici sul Secolo Vuoto
 *  - `rio`         → il Rio Poneglyph, la storia completa (Laugh Tale)
 */
const onepiecePoneglyphs: Record<string, PoneglyphRef> = {
  // Alabasta — Poneglyph informativo (Plutone), letto da Robin
  'loc-op-alabasta': { kind: 'information', note: { it: "Poneglyph informativo nella Tomba Reale di Alubarna: Nico Robin vi lesse l'ubicazione dell'arma ancestrale Plutone.", en: "Information Poneglyph in the Royal Tomb of Alubarna: Nico Robin read on it the location of the Ancient Weapon Pluton." }, inscription: { it: "Rivela il nascondiglio dell'arma ancestrale Plutone, la corazzata capace di radere al suolo un'isola. Robin scoprì in seguito che giace nel Paese di Wano.", en: "Reveals the hiding place of the Ancient Weapon Pluton, the battleship able to raze an island. Robin later learned it lies in the Wano Country." } },
  'loc-op-al-tomb': { kind: 'information', note: { it: "Robin vi lesse di nascosto l'indizio sull'arma ancestrale Plutone.", en: "Robin secretly read here the clue to the Ancient Weapon Pluton." }, inscription: { it: "Indica dove è celata l'arma ancestrale Plutone, l'antica nave da guerra.", en: "Points to where the Ancient Weapon Pluton, the ancient battleship, is hidden." } },
  // Skypiea — Poneglyph informativo con il messaggio di Roger
  'loc-op-skypiea': { kind: 'information', note: { it: "Poneglyph informativo tra le rovine di Shandora: Robin vi trovò un messaggio inciso da Gol D. Roger.", en: "Information Poneglyph among the ruins of Shandora: Robin found a message engraved by Gol D. Roger." }, inscription: { it: "Menziona l'arma ancestrale Poseidon e ne indica l'ubicazione. Vi è inciso anche il messaggio di Gol D. Roger: «Sono giunto fin qui, e porterò questo testo fino ai confini del mondo».", en: "Mentions the Ancient Weapon Poseidon and points to its whereabouts. It also bears Gol D. Roger's engraved message: 'I made it here, and I will carry this text to the very ends of the earth.'" } },
  'loc-op-sky-shandora': { kind: 'information', note: { it: "Sull'altare d'oro di Shandora; recava le parole lasciate da Gol D. Roger.", en: "On Shandora's golden altar; it bore the words left by Gol D. Roger." }, inscription: { it: "Rivela l'esistenza e l'ubicazione dell'arma ancestrale Poseidon; reca il messaggio di passaggio di Roger.", en: "Reveals the existence and location of the Ancient Weapon Poseidon; bears Roger's passing message." } },
  // Fish-Man Island — Poneglyph delle scuse di Joy Boy (Foresta Marina), non un Road Poneglyph
  'loc-op-fishman-island': { kind: 'information', note: { it: "Poneglyph storico nella Foresta Marina, noto come le scuse di Joy Boy; Robin lo decifrò.", en: "Historical Poneglyph in the Sea Forest, known as Joy Boy's apology; Robin deciphered it." }, inscription: { it: "La lettera con cui Joy Boy, nel Secolo Vuoto, chiese scusa a Poseidon per non aver mantenuto la loro promessa. Non è un Road Poneglyph: non indica alcuna coordinata per Laugh Tale.", en: "Joy Boy's letter apologizing to Poseidon for failing to keep their promise during the Void Century. It is not a Road Poneglyph: it gives no coordinates to Laugh Tale." } },
  'loc-op-fm-sea-forest': { kind: 'information', note: { it: "Qui sorge il Poneglyph delle scuse di Joy Boy, che Robin decifrò.", en: "Joy Boy's apology Poneglyph stands here; Robin deciphered it." }, inscription: { it: "Le scuse di Joy Boy alla Principessa Sirena Poseidon per non aver mantenuto la loro promessa.", en: "Joy Boy's apology to the Mermaid Princess Poseidon for failing to keep their promise." } },
  // Zou — Road Poneglyph custodito dai Mink
  'loc-op-zou': { kind: 'road', note: { it: "Road Poneglyph custodito per secoli dai Mink sul dorso di Zunesha; Robin ne prese un calco.", en: "Road Poneglyph guarded for centuries by the Minks on Zunesha's back; Robin took a rubbing." }, inscription: { it: "Una delle quattro coordinate che, unite, tracciano la rotta finale verso Laugh Tale.", en: "One of the four coordinates that, combined, chart the final route to Laugh Tale." } },
  'loc-op-zo-poneglyph': { kind: 'road', note: { it: "Custodito nel cuore di Zunesha; Robin ne realizzò un calco da portare a Rufy.", en: "Kept in the heart of Zunesha; Robin made a rubbing of it for Luffy." }, inscription: { it: "Coordinata verso Laugh Tale (1 di 4).", en: "A coordinate toward Laugh Tale (1 of 4)." } },
  // Whole Cake Island — Road Poneglyph di Big Mom, rubato (calco) da Brook
  'loc-op-whole-cake-island': { kind: 'road', note: { it: "Road Poneglyph nella sala del tesoro di Big Mom; Brook ne rubò di nascosto un calco.", en: "Road Poneglyph in Big Mom's treasure room; Brook secretly stole a rubbing of it." }, inscription: { it: "Una delle quattro coordinate per Laugh Tale, custodita tra i tesori di Big Mom.", en: "One of the four coordinates to Laugh Tale, kept among Big Mom's treasures." } },
  'loc-op-tl-chateau': { kind: 'road', note: { it: "Nella stanza-tesoro del Whole Cake Château; calco rubato da Brook durante la festa del tè.", en: "In the treasure room of Whole Cake Château; rubbing stolen by Brook during the tea party." }, inscription: { it: "Coordinata verso Laugh Tale (1 di 4).", en: "A coordinate toward Laugh Tale (1 of 4)." } },
  // Wano / Onigashima — Road Poneglyph di Kaido; patria dei Kozuki costruttori dei Poneglyph
  'loc-op-wano': { kind: 'road', note: { it: "Road Poneglyph di Kaido a Onigashima; Robin ne prese un calco durante l'assalto. Wano è la patria dei Kozuki, i costruttori dei Poneglyph.", en: "Kaido's Road Poneglyph on Onigashima; Robin took a rubbing during the raid. Wano is the homeland of the Kozuki, makers of the Poneglyphs." }, inscription: { it: "Una delle quattro coordinate per Laugh Tale. Furono proprio i Kozuki, secoli fa, a forgiare i Poneglyph in pietra indistruttibile.", en: "One of the four coordinates to Laugh Tale. It was the Kozuki who, centuries ago, forged the Poneglyphs from indestructible stone." } },
  'loc-op-onigashima': { kind: 'road', note: { it: "Custodito da Kaido; Robin ne fece un calco nel caos della guerra di Onigashima.", en: "Kept by Kaido; Robin took a rubbing of it amid the chaos of the Onigashima war." }, inscription: { it: "Coordinata verso Laugh Tale (1 di 4).", en: "A coordinate toward Laugh Tale (1 of 4)." } },
  // Ohara — Poneglyph studiato dagli archeologi, causa del Buster Call
  'loc-op-ohara': { kind: 'information', note: { it: "Gli archeologi di Ohara decifravano i Poneglyph: il professor Clover ne lesse uno durante il Buster Call che rase al suolo l'isola.", en: "The Ohara archaeologists deciphered Poneglyphs: Professor Clover read one during the Buster Call that razed the island." }, inscription: { it: "Dalle sue incisioni il professor Clover dedusse l'esistenza di un Regno scomparso, il cui nome il Governo Mondiale ha cancellato dalla storia: la verità che provocò il Buster Call su Ohara.", en: "From its inscriptions Professor Clover deduced the existence of a vanished Kingdom whose name the World Government erased from history: the truth that triggered the Buster Call on Ohara." } },
  'loc-op-oh-tree': { kind: 'information', note: { it: "Studiato all'ombra dell'Albero della Conoscenza dagli studiosi di Ohara.", en: "Studied in the shade of the Tree of Knowledge by the Ohara scholars." }, inscription: { it: "Le sue iscrizioni accennano al Regno scomparso del Secolo Vuoto, conoscenza proibita dal Governo Mondiale.", en: "Its inscriptions hint at the vanished Kingdom of the Void Century, knowledge forbidden by the World Government." } },
  // Laugh Tale — Rio Poneglyph, la storia completa
  'loc-op-laugh-tale': { kind: 'rio', note: { it: "Rio Poneglyph: l'unione di tutti i Poneglyph informativi, la vera storia del Secolo Vuoto. Letto solo da Roger e dalla sua ciurma.", en: "Rio Poneglyph: the union of all Information Poneglyphs, the true history of the Void Century. Read only by Roger and his crew." }, inscription: { it: "La storia completa e proibita del Secolo Vuoto: l'Antico Regno e i suoi ideali, annientato dall'alleanza dei Venti Regni divenuta Governo Mondiale, le tre armi ancestrali e l'eredità di Joy Boy.", en: "The complete, forbidden history of the Void Century: the Ancient Kingdom and its ideals, destroyed by the alliance of Twenty Kingdoms that became the World Government, the three Ancient Weapons and the legacy of Joy Boy." } },
};

/** Aggancia ai luoghi il riferimento al Poneglyph eventualmente presente. */
function withPoneglyphs(locations: Location[]): Location[] {
  return locations.map((l) => {
    const withText = !l.longDescription && ONEPIECE_LOCATION_LONG[l.id] ? { ...l, longDescription: ONEPIECE_LOCATION_LONG[l.id] } : l;
    return onepiecePoneglyphs[l.id] ? { ...withText, poneglyph: onepiecePoneglyphs[l.id] } : withText;
  });
}


/* ----------------------------- Revisione di completezza ----------------------------- */

/** Archi corretti per eventi rimasti senza arco o assegnati all'arco sbagliato. */
const EVENT_ARC_OVERRIDES: Record<string, string> = {
  'evt-op-whisky-peak': 'arc-op-whisky-peak',
  'evt-op-little-garden': 'arc-op-little-garden',
  'evt-op-fight-luffy-foxy': 'arc-op-long-ring',
  'evt-op-sabaody-reunion': 'arc-op-return-to-sabaody',
  'evt-op-zou-alliance': 'arc-op-zou',
  'evt-op-fight-jack-minks': 'arc-op-zou',
  'evt-op-harley-texts': 'arc-op-elbaf',
  'evt-op-elbaf-war': 'arc-op-elbaf',
  'evt-op-cross-guild': 'arc-op-egghead',
  'evt-op-lulusia-destruction': 'arc-op-egghead',
};

/**
 * Doppioni: la stessa scena era registrata due volte (racconto + «scontro»).
 * Resta la prima; della seconda si conservano tag e personaggi.
 */
const DUPLICATE_EVENTS: Record<string, string> = {
  'evt-op-fight-zoro-mihawk': 'evt-op-zoro-vs-mihawk',
  'evt-op-fight-luffy-usopp': 'evt-op-ws-usopp-duel',
  'evt-op-fight-luffy-lucci': 'evt-op-el-lucci-fight',
  'evt-op-fight-luffy-katakuri': 'evt-op-katakuri-duel',
  'evt-op-lulusia-erased': 'evt-op-lulusia-destruction',
};

/** Utilizzatori dei Frutti del Diavolo che nel dataset risultavano senza personaggio. */
const FRUIT_USERS: Record<string, string[]> = {
  'fruit-op-bomu-bomu': ['char-op-mr-5'],
  'fruit-op-kilo-kilo': ['char-op-miss-valentine'],
  'fruit-op-doru-doru': ['char-op-mr-3'],
  'fruit-op-supa-supa': ['char-op-daz-bones'],
  'fruit-op-toge-toge': ['char-op-miss-doublefinger'],
  'fruit-op-woshu-woshu': ['char-op-tsuru'],
  'fruit-op-fuwa-fuwa': ['char-op-shiki'],
  'fruit-op-nui-nui': ['char-op-leo'],
  'fruit-op-giro-giro': ['char-op-viola'],
  'fruit-op-kuri-kuri': ['char-op-opera'],
  'fruit-op-buku-buku': ['char-op-mont-dor'],
  'fruit-op-kuku-kuku': ['char-op-streusen'],
  'fruit-op-juku-juku': ['char-op-shinobu'],
  'fruit-op-inu-inu-jackal': ['char-op-chaka'],
  'fruit-op-uma-uma': ['char-op-pierre'],
  'fruit-op-mogu-mogu': ['char-op-miss-merry-christmas'],
  'fruit-op-hito-hito-onyudo': ['char-op-onimaru'],
  'fruit-op-mushi-mushi-kabuto': ['char-op-kabu'],
  'fruit-op-mushi-mushi-suzumebachi': ['char-op-bian'],
  'fruit-op-tori-tori-albatross': ['char-op-morgans'],
  'fruit-op-guru-guru': ['char-op-buffalo'],
};

const rawEvents: TimelineEvent[] = [
  ...onepieceEvents,
  ...onepieceEventsSouthBlue,
  ...onepieceEventsNorthBlue,
  ...onepieceEventsWestBlue,
  ...onepieceEventsRedLine,
  ...onepieceEventsParadise,
  ...onepieceEventsParadise2,
  ...onepieceEventsNewWorldSagas,
  ...onepieceEventsWholeCakeWano,
  ...onepieceEventsEgghead,
  ...onepieceEventsExtra,
  ...onepieceEventsExtra2,
  ...onepieceEventsBattles,
  ...onepieceEventsBattles2,
  ...onepieceEventsBattles3,
  ...onepieceEventsExtra3,
  ...onepieceEventsSpace,
  ...onepieceEventsThreeWorlds,
  ...onepieceEventsCovers,
  ...onepieceEventsExtra4,
  ...onepieceEventsCompletion,
  ...onepieceEventsFruits,
  ...onepieceEventsGaps,
];

const rawArcs: StoryArc[] = [
  ...onepieceArcs,
  ...onepieceArcsSouthBlue,
  ...onepieceArcsNorthBlue,
  ...onepieceArcsWestBlue,
  ...onepieceArcsRedLine,
  ...onepieceArcsParadise,
  ...onepieceArcsParadise2,
  ...onepieceArcsNewWorldSagas,
  ...onepieceArcsWholeCakeWano,
  ...onepieceArcsEgghead,
  ...onepieceArcsExtra,
  ...onepieceArcsCompletion,
];

/** Arco di un evento: override esplicito → `arcId` → l'arco che lo elenca in `eventIds`. */
const arcListing = new Map<string, string>();
for (const a of rawArcs) for (const id of a.eventIds ?? []) if (!arcListing.has(id)) arcListing.set(id, a.id);

const merged = new Map<string, TimelineEvent>();
for (const ev of rawEvents) {
  const arcId = EVENT_ARC_OVERRIDES[ev.id] ?? ev.arcId ?? arcListing.get(ev.id);
  merged.set(ev.id, arcId ? { ...ev, arcId } : ev);
}
for (const [dup, keep] of Object.entries(DUPLICATE_EVENTS)) {
  const d = merged.get(dup);
  const k = merged.get(keep);
  if (!d || !k) continue;
  merged.set(keep, {
    ...k,
    characterIds: [...new Set([...(k.characterIds ?? []), ...(d.characterIds ?? [])])],
    tags: [...new Set([...(k.tags ?? []), ...(d.tags ?? [])])],
  });
  merged.delete(dup);
}
const events: TimelineEvent[] = [...merged.values()].sort((a, b) => a.order - b.order);

/** Gli archi elencano tutti gli eventi che li dichiarano (e mai un doppione rimosso). */
const arcs: StoryArc[] = rawArcs.map((a) => ({
  ...a,
  eventIds: [
    ...new Set([...(a.eventIds ?? []), ...events.filter((e) => e.arcId === a.id).map((e) => e.id)].map((id) => DUPLICATE_EVENTS[id] ?? id)),
  ].filter((id) => merged.has(id)),
}));

const jutsu: Jutsu[] = [...onepieceDevilFruits, ...onepieceDevilFruitsExtra, ...onepieceDevilFruitsExtra2, ...onepieceDevilFruitsExtra3].map(
  (f) => {
    const withUsers = FRUIT_USERS[f.id] && !(f.characterIds?.length) ? { ...f, characterIds: FRUIT_USERS[f.id] } : f;
    return !withUsers.longDescription && ONEPIECE_FRUIT_LONG[f.id] ? { ...withUsers, longDescription: ONEPIECE_FRUIT_LONG[f.id] } : withUsers;
  },
);

const characters: Character[] = withCharacterLinks(
    [
      ...onepieceCharactersEastBlue,
      ...onepieceCharactersSouthBlue,
      ...onepieceCharactersNorthBlue,
      ...onepieceCharactersWestBlue,
      ...onepieceCharactersRedLine,
      ...onepieceCharactersParadise,
      ...onepieceCharactersParadise2,
      ...onepieceCharactersNewWorldSagas,
      ...onepieceCharactersWholeCakeWano,
      ...onepieceCharactersEgghead,
      ...onepieceCharactersSupernovas,
      ...onepieceCharactersExtra,
      ...onepieceCharactersExtra2,
      ...onepieceCharactersExtra3,
      ...onepieceCharactersExtra4,
      ...onepieceCharactersExtra5,
      ...onepieceCharactersExtra6,
      ...onepieceCharactersExtra7,
      ...onepieceCharactersExtra8,
      ...onepieceCharactersGrandFleet,
      ...onepieceCharactersFilms,
      ...onepieceCharactersExtra9,
      ...onepieceCharactersExtra10,
      ...onepieceCharactersCompletion,
    ].map((c) => {
      const b = onepieceBounties[c.id];
      const t = onepieceTrivia[c.id];
      // I frutti dichiarano i propri utilizzatori: il personaggio li riceve in `jutsuIds`.
      const fruits = jutsu.filter((f) => f.characterIds?.includes(c.id)).map((f) => f.id);
      const jutsuIds = [...new Set([...(c.jutsuIds ?? []), ...fruits])];
      const next = jutsuIds.length ? { ...c, jutsuIds } : c;
      return b || t ? { ...next, ...(b ? { bounties: b } : {}), ...(t ? { trivia: t } : {}) } : next;
    }),
);

/**
 * Le fazioni ricevono in `jutsuIds` i frutti dei propri membri (da `character.factionIds`
 * o da `faction.characterIds`/`leaderIds`): così ogni frutto è collegato anche alla ciurma
 * o all'organizzazione di chi lo usa.
 */
const factions: Faction[] = [
    ...onepieceFactions,
    ...onepieceFactionsSouthBlue,
    ...onepieceFactionsNorthBlue,
    ...onepieceFactionsWestBlue,
    ...onepieceFactionsRedLine,
    ...onepieceFactionsParadise,
    ...onepieceFactionsParadise2,
    ...onepieceFactionsWholeCakeWano,
    ...onepieceFactionsEgghead,
    ...onepieceFactionsSupernovas,
    ...onepieceFactionsExtra,
    ...onepieceFactionsWeapons,
    ...onepieceFactionsExtra2,
    ...onepieceFactionsConcepts,
    ...onepieceFactionsShips,
].map((f) => {
  const members = new Set([...(f.characterIds ?? []), ...(f.leaderIds ?? [])]);
  for (const c of characters) if (c.factionIds?.includes(f.id) || c.clanIds?.includes(f.id)) members.add(c.id);
  const fruits = jutsu.filter((j) => j.characterIds?.some((id) => members.has(id))).map((j) => j.id);
  const jutsuIds = [...new Set([...(f.jutsuIds ?? []), ...fruits])];
  return jutsuIds.length ? { ...f, jutsuIds } : f;
});

export const onepieceDataset: WorldDataset = withSourceNames(withEventTags(withFactionExtras(withFamily(withBattles({
  // Slug SEO pubblicati (congelati): vedi src/seo/slug.ts e `npm run seo:slugs`.
  seoSlugs: onepieceSlugs,
  world: onepiece,
  mapLevels: onepieceMapLevels,
  nations: onepieceNations,
  locations: withPoneglyphs(withSubmapPins(withVerifiedSubmaps([
    ...onepieceLocationsEastBlue,
    ...onepieceLocationsParadise,
    ...onepieceLocationsRedLine,
    ...onepieceLocationsNewWorld,
    ...onepieceLocationsBlues,
    ...onepieceLocationsExtra,
    ...onepieceLocationsTotland,
    ...onepieceLocationsSubmaps,
    ...onepieceLocationsSubmaps2,
    ...onepieceLocationsSubmaps3,
    ...onepieceLocationsSubmapsExtra,
    ...onepieceLocationsSubmaps4,
    ...onepieceLocationsSubmaps5,
    ...onepieceLocationsExtra2,
    ...onepieceLocationsSpace,
    ...onepieceLocationsThreeWorlds,
    ...onepieceLocationsExtra3,
  ]))),
  characters,
  factions,
  arcs,
  events,
  routes: [...onepieceRoutes, ...onepieceRoutesGrandLine, ...onepieceRoutesExtra],
  jutsu,
  tournaments: onepieceTournaments,
  assets: onepieceAssets,
}, onepieceBattles), onepieceFamily, 'char-op-'), onepieceStructure), onepieceMarkerTags), onepieceNames);

export { ONEPIECE_MAP_VIEWBOX } from './mapLevels';
