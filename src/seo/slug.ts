import type { WorldDataset } from '@/types';
import { getEntityDisplayName } from '@/utils/localization';
import { SEO_CATEGORIES, categoryEntities, type SeoCategory, type SeoEntity } from './categories';

/**
 * Sistema di slug CENTRALIZZATO, deterministico e STABILE. Tutte le funzioni
 * che producono o risolvono un URL di entità passano da qui: nessun altro
 * modulo deve calcolare slug per conto proprio.
 *
 * Precedenza (per ogni entità):
 *  1. `entity.slug` — pin esplicito nei dati (rinomina VOLUTA dell'URL: lo
 *     slug pubblicato precedente diventa automaticamente un redirect);
 *  2. **lock pubblicato** `dataset.seoSlugs` (`src/data/<world>/slugs.ts`,
 *     generato da `npm run seo:slugs`): una volta pubblicato uno slug è
 *     CONGELATO — tradurre, correggere o rinominare `name`/`localizedName` non
 *     cambia più l'URL, in nessuna lingua;
 *  3. solo per entità NUOVE (non ancora nel lock): derivazione dal nome inglese
 *     (`getEntityDisplayName(e, 'en')`), poi da congelare con `npm run seo:slugs`
 *     (`validate:data`/`test:seo` falliscono finché il lock non è aggiornato).
 *
 * Derivazione: ASCII kebab-case, apostrofi rimossi (`Goku's House` →
 * `gokus-house`), diacritici normalizzati, `&` → `and`; nome non latino → id
 * senza prefisso di tipo. Collisioni: suffisso derivato dall'id. Gli slug del
 * lock di entità rimosse restano RISERVATI (non vengono mai riassegnati a
 * un'altra entità: un vecchio URL non punterà mai a una cosa diversa).
 * Lo slug è condiviso da tutte le lingue (`/it/...` e `/en/...`).
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
  /** Collisioni risolte con suffisso fra slug DERIVATI (per `validate:data`). */
  collisions: { category: SeoCategory; slug: string; ids: string[] }[];
  /** Entità con slug solo derivato: vanno congelate con `npm run seo:slugs`. */
  unlocked: { category: SeoCategory; id: string; slug: string }[];
  /** Voci del lock senza entità (entità rimossa): slug riservato, mai riusato. */
  stale: { category: SeoCategory; id: string; slug: string }[];
  /** Pin `entity.slug` che hanno sostituito uno slug pubblicato. */
  renamed: { category: SeoCategory; id: string; from: string; to: string }[];
}

const cache = new WeakMap<WorldDataset, SlugIndex>();

function derivedSlug(entity: SeoEntity): string {
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
  const unlocked: SlugIndex['unlocked'] = [];
  const stale: SlugIndex['stale'] = [];
  const renamed: SlugIndex['renamed'] = [];

  for (const category of SEO_CATEGORIES) {
    const ids = new Map<string, string>();
    const slugs = new Map<string, string>();
    const moved = new Map<string, string>();
    const clashes = new Map<string, string[]>();
    const locked = dataset.seoSlugs?.slugs[category] ?? {};
    const lockedRedirects = dataset.seoSlugs?.redirects?.[category] ?? {};
    const entities = categoryEntities(dataset, category);
    const present = new Set(entities.map((e) => e.id));
    // Slug non assegnabili: quelli di entità rimosse e i redirect storici.
    const reserved = new Set<string>([
      ...Object.entries(locked)
        .filter(([id]) => !present.has(id))
        .map(([, s]) => s),
      ...Object.keys(lockedRedirects),
    ]);
    const taken = (s: string) => slugs.has(s) || reserved.has(s) || RESERVED_SLUGS.has(s);
    const assign = (id: string, slug: string) => {
      ids.set(id, slug);
      slugs.set(slug, id);
    };

    // 1–2. Pin espliciti e slug pubblicati (hanno la precedenza su tutto).
    for (const entity of entities) {
      const lockedSlug = locked[entity.id];
      const pinned = entity.slug ? slugify(entity.slug) : undefined;
      const slug = pinned ?? lockedSlug;
      if (!slug) continue;
      assign(entity.id, slug);
      if (pinned && lockedSlug && pinned !== lockedSlug) {
        renamed.push({ category, id: entity.id, from: lockedSlug, to: pinned });
        moved.set(lockedSlug, pinned);
      }
    }
    // 3. Entità nuove: slug derivato, disambiguato contro tutto ciò che esiste.
    for (const entity of entities) {
      if (ids.has(entity.id)) continue;
      let slug = derivedSlug(entity);
      if (taken(slug)) {
        if (slugs.has(slug)) {
          const list = clashes.get(slug) ?? [slugs.get(slug)!];
          list.push(entity.id);
          clashes.set(slug, list);
        }
        const suffix = slugFromId(entity.id);
        // Suffisso dall'id: se l'id contiene già lo slug base lo usiamo da solo.
        slug = suffix.startsWith(`${slug}-`) ? suffix : `${slug}-${suffix}`;
        let n = 2;
        const base = slug;
        while (taken(slug)) slug = `${base}-${n++}`;
      }
      assign(entity.id, slug);
      unlocked.push({ category, id: entity.id, slug });
    }
    // Redirect: storici del lock + `previousSlugs` dei dati (mai sopra uno slug attivo).
    for (const [prev, id] of Object.entries(lockedRedirects)) {
      const current = ids.get(id);
      if (current && prev !== current && !slugs.has(prev)) moved.set(prev, current);
    }
    for (const entity of entities) {
      for (const prev of entity.previousSlugs ?? []) {
        const p = slugify(prev);
        const current = ids.get(entity.id)!;
        if (p && p !== current && !slugs.has(p)) moved.set(p, current);
      }
    }
    for (const [id, slug] of Object.entries(locked)) {
      if (!present.has(id)) stale.push({ category, id, slug });
    }
    for (const [slug, list] of clashes) collisions.push({ category, slug, ids: list });

    byId[category] = ids;
    bySlug[category] = slugs;
    redirects[category] = moved;
  }

  const index: SlugIndex = { byId, bySlug, redirects, collisions, unlocked, stale, renamed };
  cache.set(dataset, index);
  return index;
}

/**
 * Lock aggiornato per un dataset (usato da `npm run seo:slugs`): conserva
 * TUTTE le voci pubblicate (anche di entità rimosse), aggiunge le nuove,
 * registra come redirect gli slug sostituiti da un pin `entity.slug`.
 */
export function nextSlugLock(dataset: WorldDataset): { slugs: Record<string, Record<string, string>>; redirects: Record<string, Record<string, string>> } {
  const idx = getSlugIndex(dataset);
  const slugs: Record<string, Record<string, string>> = {};
  const redirects: Record<string, Record<string, string>> = {};
  for (const category of SEO_CATEGORIES) {
    const prev = dataset.seoSlugs?.slugs[category] ?? {};
    const current = Object.fromEntries(idx.byId[category]);
    slugs[category] = { ...prev, ...current };
    const r: Record<string, string> = { ...(dataset.seoSlugs?.redirects?.[category] ?? {}) };
    for (const x of idx.renamed.filter((y) => y.category === category)) r[x.from] = x.id;
    if (Object.keys(r).length) redirects[category] = r;
  }
  return { slugs, redirects };
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
