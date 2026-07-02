import type { WorldDataset } from '@/types';
import type { SupportedLocale } from '@/types/i18n';
import { sagaKey, type EntityRef } from '@/lib/graph';
import {
  findArc,
  findCharacter,
  findFaction,
  findJutsu,
  findLocation,
  findNation,
  findRoute,
} from '@/lib/entities';
import {
  getEntityDisplayName,
  getLocalizedText,
  getRaceLabel,
} from '@/utils/localization';
import { humanizeId } from '@/lib/worldConfig';

/**
 * Adapter UI: risolve un `EntityRef` del grafo nel suo nome visualizzabile,
 * usando le entità reali del dataset (nessun dato duplicato). Le azioni di
 * apertura restano nei componenti (hanno gli opener dello store).
 */
export function entityRefLabel(
  dataset: WorldDataset,
  ref: EntityRef,
  locale: SupportedLocale,
): string {
  switch (ref.type) {
    case 'place': {
      const l = findLocation(dataset, ref.id);
      return l ? getLocalizedText(l.localizedName, locale) || l.name : ref.id;
    }
    case 'character': {
      const c = findCharacter(dataset, ref.id);
      return c ? getEntityDisplayName(c, locale) || c.name : ref.id;
    }
    case 'event': {
      const e = dataset.events.find((x) => x.id === ref.id);
      return e ? getLocalizedText(e.title, locale) : ref.id;
    }
    case 'arc': {
      const a = findArc(dataset, ref.id);
      return a ? getLocalizedText(a.localizedName, locale) || a.name : ref.id;
    }
    case 'faction': {
      const f = findFaction(dataset, ref.id);
      return f ? getEntityDisplayName(f, locale) || f.name : ref.id;
    }
    case 'route': {
      const r = findRoute(dataset, ref.id);
      return r ? getLocalizedText(r.localizedName, locale) || r.name : ref.id;
    }
    case 'nation': {
      const n = findNation(dataset, ref.id);
      return n ? getLocalizedText(n.localizedName, locale) || n.name : ref.id;
    }
    case 'technique': {
      const j = findJutsu(dataset, ref.id);
      return j ? getLocalizedText(j.localizedName, locale) || j.name : ref.id;
    }
    case 'race':
      // `race` è un id libero (es. 'saiyan'): etichetta nota → humanize fallback.
      return getRaceLabel(ref.id, locale) || humanizeId(ref.id);
    case 'saga': {
      // Nodo derivato: risolvo l'etichetta localizzata dal primo arco della saga.
      const arc = dataset.arcs.find((a) => a.saga && sagaKey(a.saga) === ref.id);
      return arc?.saga ? getLocalizedText(arc.saga, locale) : humanizeId(ref.id);
    }
    default:
      return ref.id;
  }
}
