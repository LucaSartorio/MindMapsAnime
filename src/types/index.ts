// Tipi generici per Anime Interactive Maps
// Pensati per essere riutilizzabili da qualsiasi opera (Naruto, One Piece, HxH, ...)

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

export type FactionType =
  | 'clan'
  | 'organization'
  | 'village'
  | 'army'
  | 'group';

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
  descriptionShort: string;
  descriptionLong?: string;
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
  /** Note utili (es. "placeholder generato localmente") */
  notes?: string;
}

/* ------------------------------ Mondo / Anime ------------------------------ */

export interface AnimeWorld {
  id: string;
  /** Slug usato nelle rotte: /worlds/:slug */
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
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
  description?: string;
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
  description: string;
  descriptionLong?: string;
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
  nameLocal?: string;
  type: LocationType;
  /** Coordinate nella mappa (0..mapLevel.width) */
  x: number;
  y: number;
  shortDescription: string;
  longDescription?: string;
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
  nameLocal?: string;
  villageLocationId?: string;
  nationId?: string;
  clanIds?: string[];
  factionIds?: string[];
  rank?: string;
  firstMangaAppearance?: string;
  firstAnimeAppearance?: string;
  shortDescription: string;
  longDescription?: string;
  locationIds?: string[];
  eventIds?: string[];
  arcIds?: string[];
  /** Relazioni narrative principali (mentore, rivale, ...) */
  relationships?: CharacterRelationship[];
  assetIds?: string[];
  status: CharacterStatus;
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
  nameLocal?: string;
  nationId?: string;
  villageLocationId?: string;
  description: string;
  signatureAbilities?: string[];
  kekkeiGenkai?: string;
  characterIds?: string[];
  locationIds?: string[];
  eventIds?: string[];
  arcIds?: string[];
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
  saga?: string;
  description: string;
  /** Ordine cronologico narrativo */
  order: number;
  locationIds?: string[];
  characterIds?: string[];
  eventIds?: string[];
  mangaChapters?: string[];
  animeEpisodes?: string[];
  canon: CanonStatus;
  referenceStatus?: ReferenceStatus;
  tags?: string[];
}

/* ------------------------------ Timeline Event ------------------------------ */

export interface TimelineEvent {
  id: string;
  worldId: string;
  title: string;
  description: string;
  /** Periodo narrativo (es. "Naruto Parte I") */
  period: string;
  arcId?: string;
  locationId?: string;
  characterIds?: string[];
  factionIds?: string[];
  mangaChapters?: string[];
  animeEpisodes?: string[];
  /** Ordine cronologico numerico (più basso = prima) */
  order: number;
  canon: CanonStatus;
  referenceStatus: ReferenceStatus;
  tags?: string[];
}

/* ------------------------------ Routes / Percorsi ------------------------------ */

export interface RouteStep {
  /** Posizione nello step (1-indexed) */
  order: number;
  locationId: string;
  eventId?: string;
  label?: string;
  notes?: string;
}

export interface Route {
  id: string;
  worldId: string;
  name: string;
  description: string;
  /** Personaggio o gruppo protagonista del percorso */
  protagonistCharacterIds: string[];
  /** Arco narrativo principale */
  arcId?: string;
  steps: RouteStep[];
  color?: string;
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
  arcs: StoryArc[];
  events: TimelineEvent[];
  routes: Route[];
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
  | 'route';

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
  nationLabels: true,
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
