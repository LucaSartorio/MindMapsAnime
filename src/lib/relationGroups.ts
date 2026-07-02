import type { WorldDataset } from '@/types';
import type { SupportedLocale } from '@/types/i18n';
import {
  buildWorldGraph,
  coMembers,
  getGraphContextForEntity,
  relatedPlaceIds,
  type EntityRef,
  type EntityType,
} from '@/lib/graph';
import { getAbilityTerm } from '@/lib/worldConfig';

/**
 * Livello "relazioni" world-agnostic condiviso da tutte le schede.
 *
 * Costruisce, a partire dal knowledge graph, i gruppi di entità collegate a una
 * qualsiasi entità — bucketizzati per tipo e già ordinati per tipo di scheda.
 * I gruppi vuoti vengono scartati, quindi razze/saghe (o qualsiasi campo assente
 * in un mondo) semplicemente non compaiono: nessun termine hardcoded per opera.
 */
export interface RelationGroup {
  key: string;
  title: string;
  refs: EntityRef[];
}

type Translate = (key: string, opts?: Record<string, unknown>) => string;

export type GroupKind =
  | 'connectedPlaces'
  | 'places'
  | 'characters'
  | 'sameRace'
  | 'factions'
  | 'arcs'
  | 'sameSaga'
  | 'routes'
  | 'techniques'
  | 'nations'
  | 'events';

// Quali gruppi mostrare per ciascun tipo di entità, e in quale ordine. I gruppi
// specifici di un campo (sameRace/sameSaga) sono inclusi ovunque abbiano senso e
// restano vuoti — quindi invisibili — nei mondi che non li valorizzano.
const GROUPS_BY_TYPE: Partial<Record<EntityType, GroupKind[]>> = {
  place: ['connectedPlaces', 'arcs', 'factions', 'nations'],
  character: ['places', 'sameRace', 'factions', 'arcs', 'techniques', 'routes'],
  faction: ['characters', 'places', 'arcs', 'routes', 'techniques', 'nations'],
  arc: ['characters', 'places', 'factions', 'routes', 'sameSaga', 'events'],
  event: ['places', 'characters', 'factions', 'arcs'],
  route: ['places', 'characters', 'arcs', 'factions'],
  nation: ['places', 'factions'],
  technique: ['characters', 'factions'],
};

export function buildRelationGroups(
  dataset: WorldDataset,
  entity: EntityRef,
  t: Translate,
  locale: SupportedLocale,
  /** Gruppi già mostrati esplicitamente dalla scheda: evita ridondanza inline. */
  exclude?: GroupKind[],
): RelationGroup[] {
  const graph = buildWorldGraph(dataset);
  const ctx = getGraphContextForEntity(graph, entity);
  const groups: RelationGroup[] = [];
  const add = (key: GroupKind, title: string, refs: EntityRef[]) => {
    if (refs.length > 0) groups.push({ key, title, refs });
  };

  for (const kind of GROUPS_BY_TYPE[entity.type] ?? []) {
    if (exclude?.includes(kind)) continue;
    switch (kind) {
      case 'connectedPlaces':
        add(
          kind,
          t('modals.connectedPlaces'),
          [...relatedPlaceIds(graph, entity.id)]
            .filter((id) => id !== entity.id)
            .map((id) => ({ type: 'place' as const, id })),
        );
        break;
      case 'places':
        add(kind, t('modals.connectedPlaces'), ctx.places);
        break;
      case 'characters':
        add(kind, t('modals.relatedCharacters'), ctx.characters);
        break;
      case 'sameRace':
        add(kind, t('modals.sameRace'), coMembers(graph, entity, 'race', 'character'));
        break;
      case 'factions':
        add(kind, t('modals.relatedFactions'), ctx.factions);
        break;
      case 'arcs':
        add(kind, t('modals.relatedArcs'), ctx.arcs);
        break;
      case 'sameSaga':
        add(kind, t('modals.sameSaga'), coMembers(graph, entity, 'saga', 'arc'));
        break;
      case 'routes':
        add(kind, t('modals.relatedRoutes'), ctx.routes);
        break;
      case 'techniques':
        add(
          kind,
          t('modals.relatedJutsu', { term: getAbilityTerm(dataset.world, locale) }),
          ctx.techniques,
        );
        break;
      case 'nations':
        add(kind, t('modals.relatedNation'), ctx.nations);
        break;
      case 'events':
        add(kind, t('modals.relatedEvents'), ctx.events);
        break;
    }
  }
  return groups;
}

/** Numero totale di entità collegate (per il badge del tab/della sezione). */
export function relationGroupsCount(groups: RelationGroup[]): number {
  return groups.reduce((n, g) => n + g.refs.length, 0);
}
