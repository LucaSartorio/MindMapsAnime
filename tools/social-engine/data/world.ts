import { animeWorlds, findWorldBySlug, findWorldByUrlSlug, getWorldUrlSlug } from '@/data/worlds';
import { hasWorldDataset, loadWorldDataset } from '@/data/registry';
import type { AnimeWorld, WorldDataset } from '@/types';
import { SocialEngineError } from '../lib/errors';

/**
 * Loads a world through the SAME registry the public site uses
 * (`src/data/registry.ts`): no data is copied into the engine.
 */
export type LoadedWorld = { world: AnimeWorld; dataset: WorldDataset };

export function availableWorldSlugs(): string[] {
  return animeWorlds.filter((w) => w.status === 'available' && hasWorldDataset(w.slug)).map((w) => w.slug);
}

/** Accepts the internal slug (`hunterxhunter`) or the public URL slug (`hunter-x-hunter`). */
export function findWorld(anime: string): AnimeWorld | undefined {
  const key = anime.trim().toLowerCase();
  return findWorldBySlug(key) ?? findWorldByUrlSlug(key);
}

export async function loadWorld(anime: string): Promise<LoadedWorld> {
  const world = findWorld(anime);
  const available = availableWorldSlugs().join(', ');
  if (!world) {
    throw new SocialEngineError(`Unknown anime "${anime}". Available: ${available}`);
  }
  if (world.status !== 'available' || !hasWorldDataset(world.slug)) {
    throw new SocialEngineError(
      `Anime "${getWorldUrlSlug(world)}" has no dataset yet (status: ${world.status}). Available: ${available}`,
    );
  }
  const dataset = await loadWorldDataset(world.slug);
  if (!dataset) throw new SocialEngineError(`Dataset for "${world.slug}" could not be loaded.`);
  return { world, dataset };
}
