import type { WorldDataset } from '@/types';
import type { EntityRef } from '@/lib/graph';
import type { RelationGroup } from '@/lib/relationGroups';
import { entityRefLabel } from '@/lib/graphRefs';
import { useLocaleStore } from '@/store/useLocaleStore';

interface RelationsPanelProps {
  dataset: WorldDataset;
  groups: RelationGroup[];
  /** Apre la scheda dell'entità cliccata: il componente NON conosce lo store. */
  onOpen: (ref: EntityRef) => void;
  className?: string;
}

/**
 * Vista presentazionale delle relazioni (alimentata dal knowledge graph via
 * `buildRelationGroups`): gruppi di chip cliccabili per tipo. Riusata sia come
 * tab "Relazioni" (scheda luogo) sia come sezione in coda alle schede a scroll
 * (personaggio, fazione, arco). Nessuna logica di dominio qui dentro.
 */
export function RelationsPanel({ dataset, groups, onOpen, className }: RelationsPanelProps) {
  const locale = useLocaleStore((s) => s.locale);
  if (groups.length === 0) return null;
  return (
    <div className={className ?? 'space-y-4'}>
      {groups.map((group) => (
        <section key={group.key}>
          <h3 className="mb-2 font-display text-[11px] uppercase tracking-widest text-chakra-300">
            {group.title}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {group.refs.map((ref) => (
              <button
                key={`${ref.type}:${ref.id}`}
                type="button"
                onClick={() => onOpen(ref)}
                className="chip hover:border-chakra-500/70 hover:text-white"
              >
                {entityRefLabel(dataset, ref, locale)}
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
