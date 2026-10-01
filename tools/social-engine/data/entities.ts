import { entityIdFromSlug, entitySlug } from '@/seo/slug';
import type { SeoCategory } from '@/seo/categories';
import type { WorldDataset } from '@/types';
import { getEntityDisplayName } from '@/utils/localization';

/**
 * Finds an entity id from what a human would type in a config:
 * the public SEO slug (`itachi-uchiha`), the id (`char-itachi`) or the id
 * without its prefix (`itachi`). Same slug source as the site (`src/seo/slug.ts`).
 */
export function resolveEntityId(
  dataset: WorldDataset,
  category: Extract<SeoCategory, 'characters' | 'locations'>,
  query: string,
): string | undefined {
  const entities: { id: string }[] = category === 'characters' ? dataset.characters : dataset.locations;
  const prefix = category === 'characters' ? 'char-' : 'loc-';
  const q = query.trim().toLowerCase();
  return (
    entities.find((e) => e.id === q)?.id ??
    entityIdFromSlug(dataset, category, q) ??
    entities.find((e) => e.id === `${prefix}${q}`)?.id
  );
}

/** Up to 5 "did you mean" suggestions (slug + name contain the query). */
export function suggestCharacters(dataset: WorldDataset, query: string): string[] {
  const parts = query.toLowerCase().split(/[-\s_]+/).filter((p) => p.length >= 3);
  if (!parts.length) return [];
  return dataset.characters
    .map((c) => ({ c, slug: entitySlug(dataset, 'characters', c.id) ?? c.id }))
    .filter(({ c, slug }) => parts.some((p) => slug.includes(p) || getEntityDisplayName(c, 'en').toLowerCase().includes(p)))
    .slice(0, 5)
    .map(({ c, slug }) => `${slug} (${c.id})`);
}
