import { useEffect } from 'react';
import type { WorldDataset } from '@/types';
import { InteractiveWorldMap } from '@/components/map/InteractiveWorldMap';
import { useUiStore } from '@/store';

interface WorldMapPageProps {
  dataset: WorldDataset;
}

/** Pagina principale del mondo: la mappa interattiva. */
export function WorldMapPage({ dataset }: WorldMapPageProps) {
  const setRight = useUiStore((s) => s.setRightPanel);
  // Quando arrivi sulla mappa, manteniamo il pannello dettagli chiuso di default
  // su mobile, ma sui desktop la sidebar destra è sempre visibile (CSS).
  useEffect(() => {
    setRight(false);
  }, [setRight]);

  return (
    <div className="absolute inset-0">
      <InteractiveWorldMap dataset={dataset} />
    </div>
  );
}
