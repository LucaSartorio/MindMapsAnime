import type { WorldDataset } from '@/types';
import type { EntityRef } from '@/lib/graph';
import type { SeoLocale } from './config';
import { DIRECTORY_PAGE_SIZE } from './config';
import { categoryForEntityType } from './categories';
import { entityPath, timelinePath } from './paths';
import { eventAnchor } from './slug';

/**
 * URL crawlabile di un nodo del knowledge graph: è il ponte fra il grafo
 * (`src/lib/graph`) e l'internal linking. Ogni relazione mostrata in una
 * pagina SEO diventa un vero `<a href>`; gli eventi puntano alla loro ancora
 * nella timeline. Ritorna `undefined` per nodi senza pagina (razze, saghe,
 * pin di navigazione).
 */
export function refPath(lang: SeoLocale, dataset: WorldDataset, ref: EntityRef): string | undefined {
  if (ref.type === 'event') return eventPath(lang, dataset, ref.id);
  const category = categoryForEntityType(ref.type);
  return category ? entityPath(lang, dataset, category, ref.id) : undefined;
}

const orderCache = new WeakMap<WorldDataset, Map<string, number>>();

/** Eventi in ordine cronologico (lo stesso ordine della pagina timeline). */
export function sortedEvents(dataset: WorldDataset) {
  return [...dataset.events].sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

export function eventPath(lang: SeoLocale, dataset: WorldDataset, eventId: string): string | undefined {
  let idx = orderCache.get(dataset);
  if (!idx) {
    idx = new Map(sortedEvents(dataset).map((e, i) => [e.id, i]));
    orderCache.set(dataset, idx);
  }
  const i = idx.get(eventId);
  if (i === undefined) return undefined;
  const page = Math.floor(i / DIRECTORY_PAGE_SIZE) + 1;
  return `${timelinePath(lang, dataset, page)}#${eventAnchor(eventId)}`;
}
