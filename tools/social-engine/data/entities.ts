import { entityIdFromSlug, entitySlug } from '@/seo/slug';
import type { SeoCategory } from '@/seo/categories';
import type { WorldDataset } from '@/types';
import { getEntityDisplayName } from '@/utils/localization';

/**
 * Finds an entity id from what a human would type in a config:
 * the public SEO slug (`itachi-uchiha`), the id (`char-itachi`), the id
 * without its prefix (`itachi`) or a unique short form (`luffy`). Same slug
 * source as the site (`src/seo/slug.ts`). Ambiguous short forms resolve to nothing.
 */
export function resolveEntityId(
  dataset: WorldDataset,
  category: Extract<SeoCategory, 'characters' | 'locations'>,
  query: string,
): string | undefined {
  const entities: { id: string }[] = category === 'characters' ? dataset.characters : dataset.locations;
  const prefix = category === 'characters' ? 'char-' : 'loc-';
  const q = query.trim().toLowerCase();
  const exact =
    entities.find((e) => e.id === q)?.id ??
    entityIdFromSlug(dataset, category, q) ??
    entities.find((e) => e.id === `${prefix}${q}`)?.id;
  if (exact || !/^[a-z0-9-]+$/.test(q)) return exact;
  // Short forms ("luffy" → char-op-luffy / monkey-d-luffy), only when UNIQUE.
  const matches = entities.filter((e) => {
    const slug = entitySlug(dataset, category, e.id) ?? '';
    return e.id.endsWith(`-${q}`) || slug.endsWith(`-${q}`);
  });
  return matches.length === 1 ? matches[0].id : undefined;
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
