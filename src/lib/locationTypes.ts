import type { Location, LocationType } from '@/types';

/**
 * Sorgente unica per icone e ordine dei tipi di luogo, condivisa da
 * pin della mappa (`MapNode`), filtri (`FiltersDrawer`) e legenda
 * (`MapLegendFloating`). Così la legenda mostra esattamente le icone dei pin
 * e ogni mondo espone solo i tipi che usa davvero.
 */

/** Ordine canonico di presentazione dei tipi di luogo. */
export const LOCATION_TYPE_ORDER: LocationType[] = [
  'village',
  'city',
  'nation',
  'region',
  'landmark',
  'battlefield',
  'hideout',
  'sacred_place',
  'training_area',
  'ruins',
  'bridge',
  'forest',
  'mountain',
  'cave',
];

/** Tipo di luogo → icona testuale (nessun asset esterno). */
export const LOCATION_TYPE_ICON: Record<LocationType, string> = {
  village: '⛩',
  city: '◉',
  nation: '✦',
  landmark: '◆',
  battlefield: '⚔',
  hideout: '☖',
  sacred_place: '⌘',
  training_area: '✺',
  region: '◇',
  ruins: '⌬',
  bridge: '═',
  forest: '❅',
  mountain: '▲',
  cave: '◯',
};

/**
 * Tipi di luogo effettivamente presenti in un insieme di location,
 * restituiti nell'ordine canonico. Usato per rendere dinamici filtri e legenda.
 */
export function presentLocationTypes(locations: Location[]): LocationType[] {
  const present = new Set(locations.map((l) => l.type));
  return LOCATION_TYPE_ORDER.filter((type) => present.has(type));
}
