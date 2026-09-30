import type { WorldDataset } from '@/types';

/**
 * Immagine della mappa principale di un mondo (se il livello ha un asset con
 * `url`), con dimensioni intrinseche note: serve all'anteprima della landing,
 * all'anteprima statica della rotta /map (candidata LCP, precaricata dal
 * pre-rendering) e alle dimensioni esplicite anti-CLS.
 */
export function worldMapImage(
  dataset: WorldDataset,
): { url: string; width: number; height: number } | undefined {
  const levelId = dataset.world.defaultMapLevelId ?? dataset.mapLevels[0]?.id;
  const level = dataset.mapLevels.find((l) => l.id === levelId);
  if (!level?.backgroundAssetId) return undefined;
  const asset = dataset.assets.find((a) => a.id === level.backgroundAssetId);
  if (!asset?.url) return undefined;
  return { url: asset.url, width: Math.round(level.width), height: Math.round(level.height) };
}
