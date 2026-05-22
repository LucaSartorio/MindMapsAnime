// Tipi generici per Anime Interactive Maps
// Pensati per essere riutilizzabili da qualsiasi opera (Naruto, One Piece, HxH, ...)

import type { Localizable } from './i18n';

export type { Localizable } from './i18n';
export type { LocalizedText, SupportedLocale } from './i18n';

export type WorldStatus = 'available' | 'coming_soon' | 'hidden';

export type LocationType =
  | 'village'
  | 'city'
  | 'nation'
  | 'landmark'
  | 'battlefield'
  | 'hideout'
  | 'sacred_place'
  | 'training_area'
  | 'region'
  | 'ruins'
  | 'bridge'
  | 'forest'
  | 'mountain'
  | 'cave';

export type Importance = 'main' | 'secondary' | 'minor';

export type CanonStatus =
  | 'canon'
  | 'anime_only'
  | 'movie'
  | 'filler'
  | 'novel'
  | 'uncertain';

export type ReferenceStatus =
  | 'verified'
  | 'needs_verification'
  | 'unknown';

export type CharacterStatus =
  | 'alive'
  | 'deceased'
  | 'unknown'
  | 'varies_by_era';

/**
 * Importanza del personaggio nell'opera.
 * Usata per filtri e gerarchia visiva nell'archivio.
 */
export type CharacterImportance =
  | 'main'
  | 'major'
  | 'supporting'
  | 'minor'
  | 'background';

/**
 * Ruoli narrativi (cumulativi: un personaggio può ricoprirne più di uno).
 */
export type CharacterRole =
  | 'protagonist'
  | 'antagonist'
  | 'supporting'
  | 'mentor'
  | 'kage'
  | 'jinchuriki'
  | 'akatsuki'
  | 'villain'
  | 'ally'
  | 'neutral'
  | 'background';

export type FactionType =
  | 'clan'
  | 'organization'
  | 'village'
  | 'army'
  | 'group';

/* ------------------------------ Jutsu ------------------------------ */

export type JutsuType =
  | 'ninjutsu'
  | 'taijutsu'
  | 'genjutsu'
  | 'fuinjutsu'
  | 'senjutsu'
  | 'kenjutsu'
  | 'ijutsu'
  | 'hiden'
  | 'doujutsu'
  | 'tailed_beast'
  | 'cooperation';

export type ChakraNature =
  | 'fire'
  | 'water'
  | 'earth'
  | 'lightning'
  | 'wind'
  | 'yin'
  | 'yang'
  | 'yin_yang'
  | 'wood'
  | 'ice'
  | 'lava'
  | 'boil'
  | 'magnet'
  | 'explosion'
  | 'storm'
  | 'dust'
  | 'scorch'
  | 'crystal'
  | 'dark'
  | 'swift'
  | 'steel'
  | 'shadow'
  | 'sand';

export type HandSeal =
  | 'Bird'
  | 'Boar'
  | 'Dog'
  | 'Dragon'
  | 'Hare'
  | 'Horse'
  | 'Monkey'
  | 'Ox'
  | 'Ram'
  | 'Rat'
  | 'Serpent'
  | 'Tiger'
  | 'Tiger-Horse-Dog'
  | 'None';

export type JutsuClassification =
  | 'kekkei_genkai'
  | 'kekkei_mora'
  | 'space_time'
  | 'medical'
  | 'barrier'
  | 'clone'
  | 'transformation'
  | 'summoning'
  | 'sealing'
  | 'cursed_seal'
  | 'senjutsu'
  | 'tailed_beast'
  | 'dojutsu'
  | 'reincarnation'
  | 'supplementary'
  | 'offensive'
  | 'defensive';

/* ------------------------------ Boundaries / Regioni ------------------------------ */

export type BoundaryType =
  | 'great_nation'
  | 'minor_nation'
  | 'region'
  | 'island'
  | 'special_area'
  | 'unknown';

/**
 * MapBoundary: path SVG cliccabile per una nazione/regione del mondo.
 * Coordinate nel sistema del viewBox della mappa di riferimento
 * (per Naruto: 1500 x 882.2204).
 */
export interface MapBoundary {
  id: string;
  worldId: string;
  mapLevelId: string;
  /** Slug usato per chiavi/lookup */
  slug: string;
  name: string;
  /** Nome localizzato per UI (opzionale). */
  localizedName?: Localizable;
  japaneseName?: string;
  type: BoundaryType;
  canonStatus: CanonStatus;
  referenceStatus: ReferenceStatus;
  /** Attributo `d` del path SVG che delimita il territorio */
  svgPathD: string;
  /** Punto consigliato per la label/centratura, in coord. viewBox */
  labelPosition: { x: number; y: number };
  /** Eventuale riferimento alla `Nation` corrispondente */
  nationId?: string;
  relatedLocationIds?: string[];
  relatedCharacterIds?: string[];
  relatedArcIds?: string[];
  relatedEventIds?: string[];
  descriptionShort: Localizable;
  descriptionLong?: Localizable;
  /** Colore principale del territorio (riempimento overlay) */
  color?: string;
  tags?: string[];
}

/* ------------------------------ Tema mondo ------------------------------ */

export interface WorldTheme {
  /** Colore primario CSS (es. hex o nome tailwind custom) */
  primary: string;
  /** Colore secondario di accento */
  accent: string;
  /** Colore alert/evidenza */
  highlight: string;
  /** Colore sfondo specifico (opzionale, fallback al tema dark globale) */
  background?: string;
}

/* ------------------------------ Asset ------------------------------ */

export interface AssetReference {
  id: string;
  worldId: string;
  /** Nome leggibile dell'asset */
  name: string;
  /** Tipo asset */
  kind: 'image' | 'svg' | 'audio' | 'map' | 'icon' | 'placeholder';
  /** Path locale (es. /assets/worlds/naruto/...) o esterno */
  url?: string;
  /** Autore o studio */
  author?: string;
  /** Licenza (es. CC-BY, fair use, placeholder) */
  license: string;
  /** Sorgente originale */
  source?: string;
  /** Note (localizzabili). */
  notes?: Localizable;
}

/* ------------------------------ Mondo / Anime ------------------------------ */

export interface AnimeWorld {
  id: string;
  /** Slug usato nelle rotte: /worlds/:slug */
  slug: string;
  title: string;
  /** Sottotitolo. Può essere stringa o LocalizedText. */
  subtitle?: Localizable;
  /** Descrizione del mondo. Può essere stringa o LocalizedText. */
  description: Localizable;
  status: WorldStatus;
  /** Asset di copertina (id di un AssetReference) */
  coverAssetId?: string;
  /** Tema visivo specifico del mondo */
  theme: WorldTheme;
  /** Map level di default da aprire */
  defaultMapLevelId?: string;
  /** Lista dei map level supportati */
  availableMapLevelIds: string[];
  tags: string[];
  metadata?: Record<string, string | number | boolean | null>;
}

/* ------------------------------ Map Level ------------------------------ */

export interface MapLevel {
  id: string;
  worldId: string;
  /** Slug locale (es. "world", "konoha") */
  slug: string;
  name: string;
  localizedName?: Localizable;
  description?: Localizable;
  /** Mappa "padre" — utile per drill-down (world > nation > village) */
  parentLevelId?: string;
  /** Eventuale luogo che apre questo livello (es. Konoha apre sottomappa) */
  triggerLocationId?: string;
  /** Asset di sfondo opzionale */
  backgroundAssetId?: string;
  /** Dimensioni logiche del piano (per coordinate) */
  width: number;
  height: number;
}

/* ------------------------------ Nation ------------------------------ */

export interface Nation {
  id: string;
  worldId: string;
  name: string;
  /** Nome localizzato visualizzato in UI (opzionale, fallback su `name`). */
  localizedName?: Localizable;
  nameLocal?: string;
  japaneseName?: string;
  /** Classificazione canon per la nazione */
  type?:
    | 'great_nation'
    | 'minor_nation'
    | 'neutral_land'
    | 'anime_only'
    | 'movie_only'
    | 'uncertain';
  description: Localizable;
  descriptionLong?: Localizable;
  capitalLocationId?: string;
  /** Villaggi nascosti che appartengono a questa nazione */
  hiddenVillageIds?: string[];
  relatedLocationIds?: string[];
  relatedArcIds?: string[];
  relatedEventIds?: string[];
  /** Boundary cliccabile associato (path SVG) */
  boundaryId?: string;
  canonStatus?: CanonStatus;
  referenceStatus?: ReferenceStatus;
  color?: string;
  tags?: string[];
}

/* ------------------------------ Location ------------------------------ */

export interface Location {
  id: string;
  worldId: string;
  mapLevelId: string;
  name: string;
  /** Nome localizzato per UI. */
  localizedName?: Localizable;
  nameLocal?: string;
  type: LocationType;
  /** Coordinate nella mappa (0..mapLevel.width) */
  x: number;
  y: number;
  shortDescription: Localizable;
  longDescription?: Localizable;
  nationId?: string;
  clanIds?: string[];
  characterIds?: string[];
  eventIds?: string[];
  arcIds?: string[];
  importance: Importance;
  /** Riferimenti manga/anime opzionali */
  mangaChapters?: string[];
  animeEpisodes?: string[];
  canonStatus?: CanonStatus;
  referenceStatus?: ReferenceStatus;
  /** Eventuale boundary di appartenenza */
  boundaryId?: string;
  /** Eventuale sottomappa esplorabile */
  subMapLevelId?: string;
  assetIds?: string[];
  tags?: string[];
}

/* ------------------------------ Character ------------------------------ */

export interface Character {
  id: string;
  worldId: string;
  name: string;
  /** Soprannomi/varianti (es. "Yellow Flash", "Kyuubi no Naruto") */
  aliases?: string[];
  nameLocal?: string;
  japaneseName?: string;
  /** Importanza narrativa (filtra archivio personaggi) */
  importance?: CharacterImportance;
  /** Ruoli narrativi (uno o più) */
  role?: CharacterRole[];
  villageLocationId?: string;
  nationId?: string;
  clanIds?: string[];
  factionIds?: string[];
  /** Team specifici (Team 7, Team Guy, Sound Four, ...) */
  teamIds?: string[];
  rank?: string;
  /** Generazione narrativa (es. "Konoha 11", "Sannin", "Founders") */
  generation?: string;
  gender?: string;
  firstMangaAppearance?: string;
  firstAnimeAppearance?: string;
  shortDescription: Localizable;
  longDescription?: Localizable;
  /** Abilità o tecniche caratteristiche (free-text legacy) */
  abilities?: string[];
  /** Kekkei Genkai posseduti */
  kekkeiGenkai?: string[];
  /** Jutsu noti (riferimenti a Jutsu.id) */
  jutsuIds?: string[];
  /** Contratti di evocazione */
  summons?: string[];
  /** Maestri */
  teachers?: string[];
  /** Allievi */
  students?: string[];
  /** Famiglia (parenti) */
  family?: string[];
  /** Alleati ricorrenti */
  allies?: string[];
  /** Nemici principali */
  enemies?: string[];
  locationIds?: string[];
  eventIds?: string[];
  arcIds?: string[];
  /** Route principali in cui il personaggio è coinvolto */
  routeIds?: string[];
  /** Relazioni narrative principali (mentore, rivale, ...) */
  relationships?: CharacterRelationship[];
  assetIds?: string[];
  status: CharacterStatus;
  canonStatus?: CanonStatus;
  referenceStatus?: ReferenceStatus;
  tags?: string[];
}

export interface CharacterRelationship {
  targetCharacterId: string;
  label: string;
  notes?: string;
}

/* ------------------------------ Clan / Faction ------------------------------ */

export interface Faction {
  id: string;
  worldId: string;
  type: FactionType;
  name: string;
  localizedName?: Localizable;
  nameLocal?: string;
  japaneseName?: string;
  nationId?: string;
  villageLocationId?: string;
  description: Localizable;
  longDescription?: Localizable;
  signatureAbilities?: string[];
  kekkeiGenkai?: string;
  /** Jutsu / tecniche firma del clan o fazione (riferimenti a Jutsu.id) */
  jutsuIds?: string[];
  /** Leader / capi noti */
  leaderIds?: string[];
  characterIds?: string[];
  locationIds?: string[];
  eventIds?: string[];
  arcIds?: string[];
  /** Route collegate (route di fazione, es. spostamenti dell'Akatsuki) */
  routeIds?: string[];
  canonStatus?: CanonStatus;
  referenceStatus?: ReferenceStatus;
  tags?: string[];
}

/** Alias semantico: "clans" è solo una vista filtrata di Faction.type==='clan' */
export type Clan = Faction;

/* ------------------------------ Story Arc ------------------------------ */

export interface StoryArc {
  id: string;
  worldId: string;
  name: string;
  localizedName?: Localizable;
  saga?: Localizable;
  period?: Localizable;
  description: Localizable;
  longDescription?: Localizable;
  /** Ordine cronologico narrativo */
  order: number;
  locationIds?: string[];
  nationIds?: string[];
  boundaryIds?: string[];
  characterIds?: string[];
  clanIds?: string[];
  factionIds?: string[];
  eventIds?: string[];
  routeIds?: string[];
  mangaChapters?: string[];
  animeEpisodes?: string[];
  /** Alias di compatibilità: usare `canonStatus` preferibilmente. */
  canon: CanonStatus;
  canonStatus?: CanonStatus;
  referenceStatus?: ReferenceStatus;
  tags?: string[];
}

/* ------------------------------ Timeline Event ------------------------------ */

export interface TimelineEvent {
  id: string;
  worldId: string;
  title: Localizable;
  description: Localizable;
  longDescription?: Localizable;
  /** Periodo narrativo (es. "Naruto Parte I") */
  period: Localizable;
  arcId?: string;
  /** Luogo principale (legacy). */
  locationId?: string;
  /** Tutti i luoghi coinvolti se l'evento si svolge in più posti. */
  locationIds?: string[];
  boundaryIds?: string[];
  nationIds?: string[];
  characterIds?: string[];
  clanIds?: string[];
  factionIds?: string[];
  routeIds?: string[];
  mangaChapters?: string[];
  animeEpisodes?: string[];
  /** Ordine cronologico numerico (più basso = prima) */
  order: number;
  /** Alias legacy; preferire `canonStatus`. */
  canon: CanonStatus;
  canonStatus?: CanonStatus;
  referenceStatus: ReferenceStatus;
  tags?: string[];
}

/* ------------------------------ Routes / Percorsi ------------------------------ */

export interface RouteStep {
  /** Posizione nello step (1-indexed) */
  order: number;
  locationId: string;
  /** id step opzionale per riferimento esterno */
  id?: string;
  eventId?: string;
  arcId?: string;
  label?: Localizable;
  /** Titolo dello step in UI; se assente usa label */
  title?: Localizable;
  description?: Localizable;
  approximateTimeLabel?: Localizable;
  canonStatus?: CanonStatus;
  referenceStatus?: ReferenceStatus;
  notes?: Localizable;
}

export type RouteType =
  | 'narrative'
  | 'character'
  | 'faction'
  | 'war_front'
  | 'training'
  | 'mission';

export type RouteLineStyle = 'solid' | 'dashed' | 'dotted';

export interface Route {
  id: string;
  worldId: string;
  type?: RouteType;
  name: string;
  localizedName?: Localizable;
  description: Localizable;
  longDescription?: Localizable;
  /** Personaggio o gruppo protagonista del percorso (legacy). */
  protagonistCharacterIds: string[];
  /** Alias semantico per `protagonistCharacterIds` quando preferito. */
  primaryCharacterIds?: string[];
  relatedCharacterIds?: string[];
  /** Arco narrativo principale */
  arcId?: string;
  relatedArcIds?: string[];
  relatedEventIds?: string[];
  relatedLocationIds?: string[];
  steps: RouteStep[];
  color?: string;
  lineStyle?: RouteLineStyle;
  canonStatus?: CanonStatus;
  referenceStatus?: ReferenceStatus;
  tags?: string[];
}

/* ------------------------------ Teams ------------------------------ */

/**
 * Team: piccolo gruppo operativo (es. Team 7, Team Guy, Sound Four).
 * È una specializzazione di Faction con type='group' ma rappresentato
 * come entità a sé per chiarezza semantica.
 */
export interface Team {
  id: string;
  worldId: string;
  name: string;
  localizedName?: Localizable;
  japaneseName?: string;
  description: Localizable;
  longDescription?: Localizable;
  /** Sensei o leader del team */
  leaderId?: string;
  memberIds: string[];
  villageLocationId?: string;
  nationId?: string;
  arcIds?: string[];
  eventIds?: string[];
  routeIds?: string[];
  canonStatus?: CanonStatus;
  referenceStatus?: ReferenceStatus;
  tags?: string[];
}

/* ------------------------------ Jutsu ------------------------------ */

export interface Jutsu {
  id: string;
  worldId: string;
  name: string;
  localizedName?: Localizable;
  japaneseName?: string;
  /** Tipo principale (ninjutsu, taijutsu, genjutsu, …) */
  type: JutsuType;
  /** Classificazioni aggiuntive (kekkei_genkai, space_time, medical, …) */
  classification?: JutsuClassification[];
  /** Natura/e del chakra richieste */
  chakraNature?: ChakraNature[];
  /** Sequenza di sigilli delle mani (in ordine) */
  handSeals?: HandSeal[];
  /** Rango ufficiale D/C/B/A/S */
  rank?: 'D' | 'C' | 'B' | 'A' | 'S';
  /** Personaggi che usano/possiedono questo jutsu */
  characterIds?: string[];
  /** Clan a cui questa tecnica è associata (hiden, kekkei genkai, …) */
  clanIds?: string[];
  shortDescription: Localizable;
  longDescription?: Localizable;
  canonStatus?: CanonStatus;
  referenceStatus?: ReferenceStatus;
  tags?: string[];
}

/* ------------------------------ WorldDataset ------------------------------ */

/**
 * Aggregato completo dei dati per un singolo mondo/anime.
 * Ogni nuovo anime aggiunto deve esporre un WorldDataset
 * dalla propria cartella src/data/<slug>/index.ts.
 */
export interface WorldDataset {
  world: AnimeWorld;
  mapLevels: MapLevel[];
  nations: Nation[];
  /** Boundary path cliccabili (overlay SVG). Opzionale per mondi senza mappa con regioni. */
  boundaries?: MapBoundary[];
  locations: Location[];
  characters: Character[];
  factions: Faction[];
  /** Team specifici (Team 7, Sound Four, ...) — opzionale. */
  teams?: Team[];
  arcs: StoryArc[];
  events: TimelineEvent[];
  routes: Route[];
  /** Tecniche ninja (ninjutsu, taijutsu, genjutsu, …). Opzionale. */
  jutsu?: Jutsu[];
  assets: AssetReference[];
}

/* ------------------------------ Ricerca ------------------------------ */

export type SearchResultKind =
  | 'world'
  | 'location'
  | 'character'
  | 'faction'
  | 'arc'
  | 'event'
  | 'nation'
  | 'boundary'
  | 'route'
  | 'jutsu';

export interface SearchResult {
  id: string;
  worldId?: string;
  kind: SearchResultKind;
  title: string;
  subtitle?: string;
  score: number;
  /** Tag che hanno matchato, utile per debug/UX */
  matchedTags?: string[];
}

/* ------------------------------ Filtri ------------------------------ */

export interface MapFilters {
  locationTypes: LocationType[];
  nationIds: string[];
  arcIds: string[];
  characterIds: string[];
  factionIds: string[];
  periods: string[];
  importance: Importance[];
  canonOnly: boolean;
  showRoutes: boolean;
  showEvents: boolean;
  showFactions: boolean;
}

/**
 * Layer visibili sulla mappa.
 * Ogni layer è indipendente; default sensato per non sovraccaricare l'utente.
 */
export interface VisibleLayers {
  boundaries: boolean;
  nationLabels: boolean;
  mainVillages: boolean;
  minorVillages: boolean;
  specialPlaces: boolean;
  routesCanon: boolean;
  routesNonCanon: boolean;
  eventsCanon: boolean;
  eventsNonCanon: boolean;
  arcsCanon: boolean;
  arcsNonCanon: boolean;
}

export const defaultFilters: MapFilters = {
  locationTypes: [],
  nationIds: [],
  arcIds: [],
  characterIds: [],
  factionIds: [],
  periods: [],
  importance: [],
  canonOnly: false,
  showRoutes: true,
  showEvents: true,
  showFactions: true,
};

export const defaultLayers: VisibleLayers = {
  boundaries: true,
  // La world map PNG ha già le etichette delle nazioni stampate sopra:
  // di default NON sovrapponiamo le label dell'overlay (evita duplicati).
  // L'utente può riattivarle dai filtri.
  nationLabels: false,
  mainVillages: true,
  minorVillages: true,
  specialPlaces: true,
  routesCanon: true,
  routesNonCanon: false,
  eventsCanon: true,
  eventsNonCanon: false,
  arcsCanon: true,
  arcsNonCanon: false,
};
