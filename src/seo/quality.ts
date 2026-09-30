import type { Localizable, WorldDataset } from '@/types';
import { buildWorldGraph, getConnectedEntities } from '@/lib/graph';
import { getLocalizedText } from '@/utils/localization';
import type { SeoLocale } from './config';
import { CATEGORY_ENTITY_TYPE, categoryEntities, type SeoCategory } from './categories';

/**
 * Strategia index / noindex delle pagine entità (SEO programmatico "di
 * qualità": 100 pagine utili valgono più di 10.000 pagine vuote).
 *
 * Ogni pagina entità viene SEMPRE generata (è raggiungibile dagli utenti e dai
 * link interni), ma è indicizzabile — e quindi in sitemap — solo se ha abbastanza
 * contenuto REALE nel dataset: testo descrittivo + collegamenti nel knowledge
 * graph. Sotto soglia → `noindex, follow` (i crawler seguono comunque i link).
 *
 * Le soglie sono deterministiche e documentate in docs/SEO.md. Quando un'entità
 * viene arricchita nei dati, supera la soglia e diventa indicizzabile da sola.
 */

export interface EntityQuality {
  /** Caratteri di testo descrittivo nella lingua della pagina (con fallback). */
  textLength: number;
  /** Entità collegate distinte (vicini di profondità 1 nel grafo). */
  relations: number;
  indexable: boolean;
}

/** Soglie per categoria: indicizzabile se soddisfa ALMENO una regola. */
const RULES: Record<SeoCategory, { text: number; relations: number }[]> = {
  // Personaggi: la categoria più numerosa e con più comparse "di passaggio".
  characters: [
    { text: 220, relations: 0 },
    { text: 90, relations: 3 },
    { text: 40, relations: 8 },
  ],
  locations: [
    { text: 160, relations: 0 },
    { text: 60, relations: 3 },
    { text: 30, relations: 6 },
  ],
  factions: [
    { text: 160, relations: 0 },
    { text: 60, relations: 3 },
  ],
  arcs: [
    { text: 120, relations: 0 },
    { text: 40, relations: 3 },
  ],
  journeys: [
    { text: 80, relations: 2 },
    { text: 0, relations: 4 },
  ],
  abilities: [
    { text: 200, relations: 0 },
    { text: 90, relations: 2 },
  ],
  regions: [
    { text: 160, relations: 0 },
    { text: 40, relations: 3 },
  ],
};

type Describable = {
  shortDescription?: Localizable;
  description?: Localizable;
  longDescription?: Localizable;
  trivia?: Localizable[];
  steps?: { description?: Localizable; title?: Localizable; label?: Localizable }[];
};

function textOf(entity: Describable, lang: SeoLocale): number {
  let n =
    getLocalizedText(entity.shortDescription ?? entity.description, lang).length +
    getLocalizedText(entity.longDescription, lang).length;
  for (const t of entity.trivia ?? []) n += getLocalizedText(t, lang).length;
  for (const s of entity.steps ?? []) n += getLocalizedText(s.description, lang).length;
  return n;
}

const cache = new WeakMap<WorldDataset, Map<string, EntityQuality>>();

export function entityQuality(
  dataset: WorldDataset,
  category: SeoCategory,
  id: string,
  lang: SeoLocale,
): EntityQuality {
  let perDataset = cache.get(dataset);
  if (!perDataset) {
    perDataset = new Map();
    cache.set(dataset, perDataset);
  }
  const key = `${category}:${id}:${lang}`;
  const hit = perDataset.get(key);
  if (hit) return hit;

  const entity = categoryEntities(dataset, category).find((e) => e.id === id) as
    | Describable
    | undefined;
  if (!entity) {
    const empty = { textLength: 0, relations: 0, indexable: false };
    perDataset.set(key, empty);
    return empty;
  }
  const graph = buildWorldGraph(dataset);
  const relations = getConnectedEntities(graph, { type: CATEGORY_ENTITY_TYPE[category], id }).filter(
    (r) => r.type !== 'race' && r.type !== 'saga',
  ).length;
  const textLength = textOf(entity, lang);
  const indexable = RULES[category].some((r) => textLength >= r.text && relations >= r.relations);
  const q = { textLength, relations, indexable };
  perDataset.set(key, q);
  return q;
}
