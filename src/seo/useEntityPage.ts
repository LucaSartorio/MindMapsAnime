import { useUiStore } from '@/store/useUiStore';
import { useWorldStore } from '@/store/useWorldStore';
import type { SeoCategory } from './categories';
import { entityPath } from './paths';
import { eventPath } from './links';
import { useSeoLang } from './useSeoLang';

const MODAL_CATEGORY: Partial<Record<string, SeoCategory>> = {
  location: 'locations',
  character: 'characters',
  faction: 'factions',
  arc: 'arcs',
  route: 'journeys',
  jutsu: 'abilities',
  nation: 'regions',
};

/**
 * Pagina SEO dell'entità della scheda modale aperta (se ne ha una). Collega il
 * sistema di schede sopra la mappa alle pagine indicizzabili: dalla scheda si
 * apre la pagina completa, dalla pagina si torna alla mappa con la scheda.
 */
export function useActiveEntityPagePath(enabled = true): string | undefined {
  const lang = useSeoLang();
  const modal = useUiStore((s) => s.activeModal);
  const dataset = useWorldStore((s) => s.dataset);
  if (!enabled || !modal || !dataset) return undefined;
  if (modal.kind === 'event') return eventPath(lang, dataset, modal.id);
  const category = MODAL_CATEGORY[modal.kind];
  return category ? entityPath(lang, dataset, category, modal.id) : undefined;
}
