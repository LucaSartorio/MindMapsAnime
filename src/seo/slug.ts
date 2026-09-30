import type { WorldDataset } from '@/types';
import { getEntityDisplayName } from '@/utils/localization';
import { SEO_CATEGORIES, categoryEntities, type SeoCategory, type SeoEntity } from './categories';

/**
 * Sistema di slug CENTRALIZZATO e deterministico. Tutte le funzioni che
 * producono o risolvono un URL di entità passano da qui: nessun altro modulo
 * deve calcolare slug per conto proprio.
 *
 * Regole:
 *  - lo slug è ASCII kebab-case, derivato dal nome INGLESE dell'entità
 *    (`getEntityDisplayName(e, 'en')`) ed è condiviso da tutte le lingue;
 *  - apostrofi/virgolette spariscono (`Goku's House` → `gokus-house`),
 *    diacritici normalizzati (`Jinchūriki` → `jinchuriki`), `&` → `and`;
 *  - se il nome non produce caratteri latini (es. solo giapponese) si usa
 *    l'id dell'entità, ripulito dal prefisso di tipo;
 *  - `entity.slug` (se presente) ha sempre la precedenza: serve a FISSARE uno
 *    slug quando il nome cambia; `entity.previousSlugs` genera redirect;
 *  - collisioni nella stessa categoria dello stesso mondo: la prima entità
 *    (ordine del dataset, che è append-only) tiene lo slug base, le altre
 *    ricevono un suffisso derivato dal proprio id (univoco per definizione).
 *    `npm run validate:data` segnala le collisioni così si può fissare `slug`.
 */

/** Slug riservati: non possono essere slug di entità (collidono con le rotte). */
export const RESERVED_SLUGS = new Set(['page', 'map', 'index', 'new', 'edit']);

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['’‘`´"“”]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 80)
    .replace(/-+$/g, '');
}

/** Prefissi di tipo/mondo degli id (`char-op-`, `loc-hxh-`, `fruit-op-`…). */
const ID_PREFIX = /^(char|loc|faction|clan|arc|route|jutsu|fruit|magic|nation|team|event|region)-(?:(op|hxh|dbz|bc|db)-)?/;

/** Slug derivato dall'id (fallback e disambiguazione). */
export function slugFromId(id: string): string {
  return slugify(id.replace(ID_PREFIX, '')) || slugify(id);
}

export interface SlugIndex {
  /** categoria → (id → slug) */
  byId: Record<SeoCategory, Map<string, string>>;
  /** categoria → (slug → id), include anche i `previousSlugs`. */
  bySlug: Record<SeoCategory, Map<string, string>>;
  /** categoria → (slug precedente → slug attuale) per i redirect. */
  redirects: Record<SeoCategory, Map<string, string>>;
  /** Collisioni risolte con suffisso (per `validate:data`). */
  collisions: { category: SeoCategory; slug: string; ids: string[] }[];
}

const cache = new WeakMap<WorldDataset, SlugIndex>();

function baseSlug(entity: SeoEntity): string {
  if (entity.slug) return slugify(entity.slug);
  const name = getEntityDisplayName(entity as Parameters<typeof getEntityDisplayName>[0], 'en');
  const s = slugify(name);
  return s || slugFromId(entity.id);
}

/** Indice slug ↔ id di un dataset, memoizzato per-dataset (WeakMap). */
export function getSlugIndex(dataset: WorldDataset): SlugIndex {
  const hit = cache.get(dataset);
  if (hit) return hit;

  const byId = {} as SlugIndex['byId'];
  const bySlug = {} as SlugIndex['bySlug'];
  const redirects = {} as SlugIndex['redirects'];
  const collisions: SlugIndex['collisions'] = [];

  for (const category of SEO_CATEGORIES) {
    const ids = new Map<string, string>();
    const slugs = new Map<string, string>();
    const moved = new Map<string, string>();
    const clashes = new Map<string, string[]>();

    for (const entity of categoryEntities(dataset, category)) {
      let slug = baseSlug(entity);
      if (RESERVED_SLUGS.has(slug)) slug = `${slug}-${slugFromId(entity.id)}`;
      if (slugs.has(slug)) {
        const list = clashes.get(slug) ?? [slugs.get(slug)!];
        list.push(entity.id);
        clashes.set(slug, list);
        const suffix = slugFromId(entity.id);
        // Suffisso dall'id: se l'id contiene già lo slug base lo usiamo da solo.
        slug = suffix.startsWith(`${slug}-`) ? suffix : `${slug}-${suffix}`;
        let n = 2;
        while (slugs.has(slug)) slug = `${slug}-${n++}`;
      }
      ids.set(entity.id, slug);
      slugs.set(slug, entity.id);
    }
    // Slug precedenti (dopo aver assegnato quelli attuali, così non li rubano).
    for (const entity of categoryEntities(dataset, category)) {
      for (const prev of entity.previousSlugs ?? []) {
        const p = slugify(prev);
        const current = ids.get(entity.id)!;
        if (p && p !== current && !slugs.has(p)) {
          moved.set(p, current);
        }
      }
    }
    for (const [slug, list] of clashes) collisions.push({ category, slug, ids: list });

    byId[category] = ids;
    bySlug[category] = slugs;
    redirects[category] = moved;
  }

  const index: SlugIndex = { byId, bySlug, redirects, collisions };
  cache.set(dataset, index);
  return index;
}

export function entitySlug(dataset: WorldDataset, category: SeoCategory, id: string): string | undefined {
  return getSlugIndex(dataset).byId[category].get(id);
}

export function entityIdFromSlug(
  dataset: WorldDataset,
  category: SeoCategory,
  slug: string,
): string | undefined {
  return getSlugIndex(dataset).bySlug[category].get(slug);
}

/** Slug di un evento della timeline, usato come ancora `#event-<slug>`. */
export function eventAnchor(eventId: string): string {
  return `event-${slugFromId(eventId)}`;
}
