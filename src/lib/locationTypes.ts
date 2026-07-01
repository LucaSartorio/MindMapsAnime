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
  'planet',
  'dimension',
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
  planet: '●',
  dimension: '✧',
};

/**
 * Tipo di luogo → colore accento del marker.
 *
 * Ogni categoria ha una tinta distinta così i pin sono distinguibili a colpo
 * d'occhio. Il colore NON è mai l'unico indizio: l'icona (`LOCATION_TYPE_ICON`)
 * e l'etichetta restano il segnale primario (WCAG 1.4.1). Gli stati
 * selezionato / evidenziato / poneglyph hanno la precedenza sul colore di
 * categoria nel `MapNode`.
 */
export const LOCATION_TYPE_COLOR: Record<LocationType, string> = {
  village: '#4cb6ff', // chakra
  city: '#8b9bff', // indaco
  nation: '#f5b21a', // oro
  region: '#c084fc', // viola
  landmark: '#ff9f3f', // ambra
  battlefield: '#f2555a', // rosso
  hideout: '#9aa3b2', // grigio
  sacred_place: '#e879f9', // fucsia
  training_area: '#34d399', // smeraldo
  ruins: '#cbb26a', // pergamena
  bridge: '#38bdf8', // cielo
  forest: '#4ade80', // verde
  mountain: '#93a4bd', // ardesia
  cave: '#a78bfa', // pervinca
  planet: '#60a5fa', // blu
  dimension: '#f0abfc', // rosa
};

/**
 * Tipi di luogo effettivamente presenti in un insieme di location,
 * restituiti nell'ordine canonico. Usato per rendere dinamici filtri e legenda.
 */
export function presentLocationTypes(locations: Location[]): LocationType[] {
  const present = new Set(locations.map((l) => l.type));
  return LOCATION_TYPE_ORDER.filter((type) => present.has(type));
}
