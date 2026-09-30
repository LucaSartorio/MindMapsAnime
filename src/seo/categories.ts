import type { Location, SeoSlugFields, WorldDataset } from '@/types';
import type { EntityType } from '@/lib/graph';

/**
 * Categorie di entità che hanno una pagina SEO dedicata
 * (`/{lang}/{world}/{category}/{slug}`) e un indice (`/{lang}/{world}/{category}`).
 *
 * I segmenti URL sono in inglese e IDENTICI per tutte le lingue: gli URL
 * alternati IT/EN differiscono solo nel prefisso di lingua, così hreflang è
 * sempre bidirezionale e non esistono mappe di traduzione degli slug da
 * mantenere. Aggiungere una categoria = una voce qui + la sua pagina.
 */
export const SEO_CATEGORIES = [
  'characters',
  'locations',
  'factions',
  'arcs',
  'journeys',
  'abilities',
  'regions',
] as const;

export type SeoCategory = (typeof SEO_CATEGORIES)[number];

export function isSeoCategory(value: string | undefined): value is SeoCategory {
  return !!value && (SEO_CATEGORIES as readonly string[]).includes(value);
}

/** Entità minima che possiede una pagina: id + campi slug opzionali. */
export interface SeoEntity extends SeoSlugFields {
  id: string;
}

/**
 * Pin di NAVIGAZIONE tra livelli di mappa ("Torna alla world map", il pianeta
 * Terra sulla mappa cosmica che riporta alla mappa principale…): sono controlli
 * della mappa, non luoghi, quindi non hanno una pagina SEO. Regola generica:
 * il pin apre il livello PADRE del proprio livello (o la mappa principale da un
 * livello secondario).
 */
export function isGatewayPin(dataset: WorldDataset, loc: Location): boolean {
  if (!loc.subMapLevelId) return false;
  const level = dataset.mapLevels.find((l) => l.id === loc.mapLevelId);
  if (level?.parentLevelId === loc.subMapLevelId) return true;
  const main = dataset.world.defaultMapLevelId ?? dataset.mapLevels[0]?.id;
  return loc.subMapLevelId === main && loc.mapLevelId !== main;
}

const placesCache = new WeakMap<WorldDataset, Location[]>();

/** Luoghi con pagina SEO (esclusi i pin di navigazione). */
export function seoLocations(dataset: WorldDataset): Location[] {
  let hit = placesCache.get(dataset);
  if (!hit) {
    hit = dataset.locations.filter((l) => !isGatewayPin(dataset, l));
    placesCache.set(dataset, hit);
  }
  return hit;
}

/** Entità del dataset appartenenti a una categoria. */
export function categoryEntities(dataset: WorldDataset, category: SeoCategory): SeoEntity[] {
  switch (category) {
    case 'characters':
      return dataset.characters;
    case 'locations':
      return seoLocations(dataset);
    case 'factions':
      return dataset.factions;
    case 'arcs':
      return dataset.arcs;
    case 'journeys':
      return dataset.routes;
    case 'abilities':
      return dataset.jutsu ?? [];
    case 'regions':
      return dataset.nations;
  }
}

/** Tipo di nodo nel knowledge graph (`src/lib/graph`) per ogni categoria. */
export const CATEGORY_ENTITY_TYPE: Record<SeoCategory, EntityType> = {
  characters: 'character',
  locations: 'place',
  factions: 'faction',
  arcs: 'arc',
  journeys: 'route',
  abilities: 'technique',
  regions: 'nation',
};

/** Inverso: tipo di nodo del grafo → categoria con pagina (se esiste). */
export function categoryForEntityType(type: EntityType): SeoCategory | undefined {
  return (Object.keys(CATEGORY_ENTITY_TYPE) as SeoCategory[]).find(
    (c) => CATEGORY_ENTITY_TYPE[c] === type,
  );
}

/**
 * Categorie il cui indice è una "directory" SEO leggera e paginata (le altre
 * riusano gli archivi interattivi esistenti, con filtri e schede).
 */
export const PAGINATED_CATEGORIES: readonly SeoCategory[] = ['locations'];
