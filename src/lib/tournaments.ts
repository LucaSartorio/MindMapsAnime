import type { Location, Tournament, WorldDataset } from '@/types';

/**
 * Tornei da mostrare nella scheda di un luogo: quelli che ospita direttamente
 * e, se il luogo apre una sotto-mappa, quelli ospitati dai luoghi di quella
 * sotto-mappa (es. il pin "Isola di Papaya" mostra i tornei del suo ring).
 */
export function tournamentsAt(dataset: WorldDataset, location: Location): Tournament[] {
  const list = dataset.tournaments ?? [];
  if (list.length === 0) return [];
  const inSubMap = location.subMapLevelId
    ? new Set(dataset.locations.filter((l) => l.mapLevelId === location.subMapLevelId).map((l) => l.id))
    : undefined;
  return list
    .filter((tn) => tn.locationId === location.id || inSubMap?.has(tn.locationId))
    .sort((a, b) => a.order - b.order);
}
