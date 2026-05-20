import type { WorldDataset } from '@/types';
import { InteractiveWorldMap } from '@/components/map/InteractiveWorldMap';

interface WorldMapPageProps {
  dataset: WorldDataset;
}

/**
 * Pagina principale del mondo: la mappa interattiva full-screen.
 * Il canvas occupa tutta l'area del WorldLayout (sotto la TopNav).
 * I floating panel (filtri, percorsi, timeline, legenda, ricerca) sono
 * renderizzati dal WorldLayout.
 */
export function WorldMapPage({ dataset }: WorldMapPageProps) {
  return (
    <div className="absolute inset-0">
      <InteractiveWorldMap dataset={dataset} />
    </div>
  );
}
