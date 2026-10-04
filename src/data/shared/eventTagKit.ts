import type { TimelineEvent } from '@/types';

/**
 * Tag aggiunti a eventi già esistenti, per tema (es. `vita-e-morte`): accendono
 * i luoghi con i marcatori mappa (`WorldConfig.mapMarkers`) senza riscrivere
 * gli eventi. Gli id inesistenti fanno fallire il caricamento del dataset.
 */
export function withEventTags<T extends { events: TimelineEvent[] }>(dataset: T, tags: Record<string, string[]>): T {
  const byEvent = new Map<string, string[]>();
  for (const [tag, ids] of Object.entries(tags))
    for (const id of ids) byEvent.set(id, [...(byEvent.get(id) ?? []), tag]);
  const missing = [...byEvent.keys()].filter((id) => !dataset.events.some((e) => e.id === id));
  if (missing.length) throw new Error(`eventTags: eventi inesistenti ${missing.join(', ')}`);
  return {
    ...dataset,
    events: dataset.events.map((e) =>
      byEvent.has(e.id) ? { ...e, tags: [...new Set([...(e.tags ?? []), ...byEvent.get(e.id)!])] } : e,
    ),
  };
}
