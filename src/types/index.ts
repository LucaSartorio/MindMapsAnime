// Tipi generici per Mappe Interattive
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
 * Ruoli narrativi universali. Le `Character.role` sono `string` libere: questi
 * sono i ruoli "noti" con etichetta localizzata di default (vedi
 * `getCharacterRoleLabel`). I ruoli specifici di un'opera (es. Naruto: kage,
 * jinchuriki, akatsuki) si etichettano via `WorldConfig.characterRoles`.
 */
export type CharacterRole =
  | 'protagonist'
  | 'antagonist'
  | 'supporting'
  | 'mentor'
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

/* --------------------------- Ninja Rank ---------------------------- */

/**
 * Gradi "noti" di Naruto, usati come etichette di default da
 * `getNinjaRankLabel`. Il campo `Character.ninjaRank` è una `string` libera:
 * ogni mondo definisce il proprio sistema di gradi via
 * `WorldConfig.characterRank`.
 */
export type NinjaRank =
  | 'academy_student'
  | 'genin'
  | 'chunin'
  | 'tokubetsu_jonin'
  | 'jonin'
  | 'anbu'
  | 'sannin'
  | 'kage'
  | 'missing_nin'
  | 'other';

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
  | 'cooperation'
  // --- Hunter x Hunter · Nen ---
  // Categoria di Nen ("Hatsu") + un valore generico per i fondamentali
  // (Ten, Zetsu, Ren, Hatsu, Gyo, In, En, Shu, Ko, Ken, Ryu).
  | 'nen'
  | 'enhancement'
  | 'transmutation'
  | 'conjuration'
  | 'emission'
  | 'manipulation'
  | 'specialization';

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
  /**
   * Fattore di scala del logo sulla card della homepage (default 1).
   * Serve a uniformare l'impatto visivo di loghi con margini interni
   * diversi: es. un logo con molto spazio trasparente attorno può usare
   * 1.15-1.3 per "pareggiare" gli altri. Non incide sul layout, è solo
   * un transform: scale() applicato all'immagine.
   */
  logoScale?: number;
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
  /**
   * Configurazione dinamica per-mondo (sistema di poteri, gradi, facet).
   * Rende la UI adattabile a ogni anime senza hardcoding di Naruto.
   */
  config?: WorldConfig;
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
  /**
   * Posizione consigliata per la label di nazione sull'overlay (coord. viewBox
   * del world map). Usata dal layer "nomi nazioni" quando il mondo non ha
   * boundary con labelPosition (es. One Piece: i nomi dei Mari).
   */
  labelPosition?: { x: number; y: number };
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
  /** Macro-serie / blocchi narrativi in cui compare il luogo. */
  series?: Series[];
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
  /**
   * Ruoli narrativi (uno o più). String libera per essere adattabile a ogni
   * opera; etichetta risolta via `getCharacterRoleLabel` / `WorldConfig`.
   */
  role?: string[];
  villageLocationId?: string;
  nationId?: string;
  clanIds?: string[];
  factionIds?: string[];
  /** Team specifici (Team 7, Team Guy, Sound Four, ...) */
  teamIds?: string[];
  rank?: string;
  /**
   * Id del grado del personaggio (Naruto: grado ninja). String libera: ogni
   * mondo definisce i propri gradi e le etichette via `WorldConfig.characterRank`.
   */
  ninjaRank?: string;
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
  /** Macro-serie / blocchi narrativi in cui appare il personaggio. */
  series?: Series[];
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
  /** Tipo di fazione. String libera per nuovi mondi; i tipi "noti" sono in `FactionType`. */
  type: FactionType | (string & {});
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
  /** Macro-serie / blocchi narrativi in cui è attivo il clan/fazione. */
  series?: Series[];
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
  /** Macro-serie / blocchi narrativi a cui appartiene l'arco. */
  series?: Series[];
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
  /** Link YouTube dello scontro (mostra un player nel modale evento). */
  battleVideoUrl?: string;
  /** Ordine cronologico numerico (più basso = prima) */
  order: number;
  /** Alias legacy; preferire `canonStatus`. */
  canon: CanonStatus;
  canonStatus?: CanonStatus;
  referenceStatus: ReferenceStatus;
  /** Macro-serie / blocchi narrativi in cui rientra l'evento. */
  series?: Series[];
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
  mangaChapters?: string[];
  animeEpisodes?: string[];
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
  /** Macro-serie / blocchi narrativi in cui opera il team. */
  series?: Series[];
  tags?: string[];
}

/* ------------------------------ Jutsu ------------------------------ */

export interface Jutsu {
  id: string;
  worldId: string;
  name: string;
  localizedName?: Localizable;
  japaneseName?: string;
  /**
   * Categoria principale della tecnica. String libera (Naruto: ninjutsu…;
   * HxH: enhancement…; altri mondi: i propri id). Etichetta risolta via
   * `getAbilityCategoryLabel` / `WorldConfig.ability.categories`.
   * I valori "noti" sono in `JutsuType`.
   */
  type: JutsuType | (string & {});
  /** Classificazioni aggiuntive (libere; note in `JutsuClassification`). */
  classification?: (JutsuClassification | (string & {}))[];
  /**
   * Attributo secondario (Naruto: natura del chakra). String libera: ogni mondo
   * lo definisce via `WorldConfig.ability.attribute`. Noti in `ChakraNature`.
   */
  chakraNature?: (ChakraNature | (string & {}))[];
  /** Sequenza di sigilli delle mani (in ordine, specifico di Naruto) */
  handSeals?: HandSeal[];
  /** Rango ufficiale E/D/C/B/A/S */
  rank?: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  /** Personaggi che usano/possiedono questo jutsu */
  characterIds?: string[];
  /** Clan a cui questa tecnica è associata (hiden, kekkei genkai, …) */
  clanIds?: string[];
  shortDescription: Localizable;
  longDescription?: Localizable;
  canonStatus?: CanonStatus;
  referenceStatus?: ReferenceStatus;
  /** Macro-serie / blocchi narrativi in cui appare la tecnica. */
  series?: Series[];
  tags?: string[];
}

/* ------------------------------ World Config ------------------------------ */

/** Coppia `id → etichetta localizzata`, riusabile per categorie, gradi, opzioni. */
export interface LabeledOption {
  id: string;
  label: Localizable;
}

/**
 * Attributo secondario di una tecnica.
 * Naruto: natura del chakra. Altri mondi possono usarlo per "tipo di frutto",
 * "elemento", ecc. Omettere l'intero attributo nasconde il relativo filtro.
 */
export interface AbilityAttributeConfig {
  /** Etichetta del facet (es. "Natura del chakra", "Tipo di frutto"). */
  term: Localizable;
  /** Etichette esplicite dei valori; se assenti si usa il fallback legacy. */
  options?: LabeledOption[];
}

/**
 * Sistema di "poteri" di un mondo, reso dinamico per anime.
 *  - Naruto → Jutsu
 *  - Hunter x Hunter → Nen
 *  - Dragon Ball → Tecniche
 *  - One Piece → Frutti del Diavolo
 * IDs/slug degli oggetti tecnica restano invariati: cambia solo la UI.
 */
export interface AbilitySystemConfig {
  /** Termine UI del sistema (nav, modali, titolo archivio). */
  term: Localizable;
  /** Etichetta del filtro categoria nell'archivio (default: "Tipo"). */
  categoryTerm?: Localizable;
  /** Etichette per id-categoria; se assenti, fallback alla mappa globale. */
  categories?: LabeledOption[];
  /** Attributo secondario (natura del chakra, …). Omesso = facet nascosto. */
  attribute?: AbilityAttributeConfig;
  /** Mostra la sequenza di sigilli delle mani (specifico di Naruto). */
  showHandSeals?: boolean;
  /** Mostra il badge del rango ufficiale E…S. */
  showRank?: boolean;
}

/**
 * Sistema di gradi dei personaggi (Naruto: gradi ninja; altri: Hunter, ecc.).
 * Le `options`, se presenti, definiscono anche l'ORDINE di presentazione del
 * filtro; se assenti si usa l'ordine noto di Naruto.
 */
export interface RankSystemConfig {
  /** Etichetta del facet (es. "Grado ninja", "Grado Hunter"). */
  term: Localizable;
  /** Etichette+ordine per id-grado; se assenti, fallback alla mappa globale. */
  options?: LabeledOption[];
}

/** Liste curate "in evidenza" mostrate nelle pagine archivio. */
export interface WorldFeaturedConfig {
  /** Id tecniche da mettere in vetrina nell'archivio tecniche. */
  abilities?: string[];
  /** Id clan/fazioni da mettere in vetrina nell'archivio fazioni. */
  factions?: string[];
}

/**
 * Configurazione per-mondo: centralizza tutte le "voci" che cambiano da un
 * anime all'altro (sistema di poteri, gradi, ruoli, vetrine, etichette dei
 * facet), così la UI resta generica e adattabile a ogni opera. Tutti i campi
 * sono opzionali: in assenza si applicano default generici.
 */
export interface WorldConfig {
  /** Sistema di poteri/tecniche del mondo. */
  ability?: AbilitySystemConfig;
  /** Sistema di gradi dei personaggi. */
  characterRank?: RankSystemConfig;
  /**
   * Etichette dei ruoli specifici dell'opera (es. Naruto: kage, jinchuriki,
   * akatsuki). I ruoli universali sono già localizzati di default.
   */
  characterRoles?: LabeledOption[];
  /** Etichetta del facet "nazione" (es. "Nazione", "Continente", "Mare"). */
  nationTerm?: Localizable;
  /**
   * Etichetta del facet "luoghi/villaggi" (sezione filtro e toggle layer).
   * Naruto: "villaggi"; One Piece: "luoghi". Minuscolo: i titoli di sezione lo
   * rendono maiuscolo via CSS, i toggle lo usano in frase. Fallback i18n.
   */
  placesTerm?: Localizable;
  /**
   * Etichetta dell'archivio fazioni / voce di navigazione (es. Naruto:
   * "Clan & Fazioni"; One Piece: "Ciurme & Fazioni"). Se assente si usa
   * l'etichetta i18n generica.
   */
  factionsTerm?: Localizable;
  /** Liste curate per le vetrine delle pagine archivio. */
  featured?: WorldFeaturedConfig;
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

/**
 * Macro-serie / blocchi narrativi di Naruto. Usati come filtro globale:
 * "voglio vedere solo Naruto Parte 1", "solo Boruto", "tutti i film", ecc.
 * Una stessa entità può appartenere a più serie (es. Naruto e Shippuden).
 *  - 'naruto'    → Naruto (Parte 1, archi 1-9 circa)
 *  - 'shippuden' → Naruto Shippuden (Parte 2)
 *  - 'boruto'    → Boruto: Naruto Next Generations / Two Blue Vortex
 *  - 'movies'    → Lungometraggi (The Last, Boruto: Naruto the Movie, ecc.)
 */
export type Series = 'naruto' | 'shippuden' | 'boruto' | 'movies';

export const ALL_SERIES: Series[] = ['naruto', 'shippuden', 'boruto', 'movies'];

export interface MapFilters {
  locationTypes: LocationType[];
  nationIds: string[];
  arcIds: string[];
  characterIds: string[];
  factionIds: string[];
  periods: string[];
  importance: Importance[];
  /** Serie / blocco narrativo. Vuoto = nessun filtro (tutte le serie). */
  series: Series[];
  canonOnly: boolean;
  /** Mostra anche gli elementi con referenceStatus 'needs_verification'
   * (nascosti di default sulla mappa). */
  showUnverified: boolean;
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
  series: [],
  canonOnly: false,
  showUnverified: false,
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
