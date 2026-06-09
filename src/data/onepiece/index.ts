import type { Location, WorldDataset } from '@/types';
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
import { onepieceRoutes } from './routes';
import { onepieceRoutesGrandLine } from './routesGrandLine';
import { onepieceRoutesExtra } from './routesExtra';
import { onepieceDevilFruits } from './devilFruits';
import { onepieceDevilFruitsExtra } from './devilFruitsExtra';
import { onepieceDevilFruitsExtra2 } from './devilFruitsExtra2';
import { onepieceAssets } from './assets';
import { onepieceBounties } from './bounties';
import { withCharacterLinks } from './characterLinks';

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

export const onepieceDataset: WorldDataset = {
  world: onepiece,
  mapLevels: onepieceMapLevels,
  nations: onepieceNations,
  locations: withSubmapPins(withVerifiedSubmaps([
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
  ])),
  characters: withCharacterLinks(
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
    ].map((c) => (onepieceBounties[c.id] ? { ...c, bounties: onepieceBounties[c.id] } : c)),
  ),
  factions: [
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
  ],
  arcs: [
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
  ],
  events: [
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
  ],
  routes: [...onepieceRoutes, ...onepieceRoutesGrandLine, ...onepieceRoutesExtra],
  jutsu: [...onepieceDevilFruits, ...onepieceDevilFruitsExtra, ...onepieceDevilFruitsExtra2],
  assets: onepieceAssets,
};

export { ONEPIECE_MAP_VIEWBOX } from './mapLevels';
