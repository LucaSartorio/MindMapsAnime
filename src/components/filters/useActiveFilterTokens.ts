import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Series, WorldDataset } from '@/types';
import { useMapStore } from '@/store';
import { useLocaleStore } from '@/store/useLocaleStore';
import { buildIndexes } from '@/utils/buildIndexes';
import {
  getEntityDisplayName,
  getLocationTypeLabel,
} from '@/utils/localization';

export interface ActiveFilterToken {
  /** Chiave stabile per React. */
  key: string;
  /** Etichetta leggibile mostrata nel chip. */
  label: string;
  /** Rimuove SOLO questo valore, lasciando gli altri filtri intatti. */
  remove: () => void;
}

/**
 * Traduce lo stato dei filtri (`MapFilters`) in una lista di token rimovibili
 * con etichette localizzate. Ogni `remove()` toglie un singolo valore.
 *
 * Le etichette passano dagli helper di localizzazione, quindi anche gli id di
 * mondi futuri restano leggibili senza modifiche qui.
 */
export function useActiveFilterTokens(dataset: WorldDataset): ActiveFilterToken[] {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const filters = useMapStore((s) => s.filters);
  const setFilters = useMapStore((s) => s.setFilters);

  const idx = useMemo(() => buildIndexes(dataset), [dataset]);
  const { nations: nationsById, arcs: arcsById, characters: charactersById, factions: factionsById } = idx;

  return useMemo(() => {
    const tokens: ActiveFilterToken[] = [];

    filters.series.forEach((s) => {
      tokens.push({
        key: `series:${s}`,
        label: t(`filters.series${(s.charAt(0).toUpperCase() + s.slice(1)) as Capitalize<Series>}`),
        remove: () =>
          setFilters({ series: filters.series.filter((x) => x !== s) }),
      });
    });

    filters.locationTypes.forEach((type) => {
      tokens.push({
        key: `type:${type}`,
        label: getLocationTypeLabel(type, locale),
        remove: () =>
          setFilters({
            locationTypes: filters.locationTypes.filter((x) => x !== type),
          }),
      });
    });

    filters.nationIds.forEach((id) => {
      const nation = nationsById.get(id);
      tokens.push({
        key: `nation:${id}`,
        label: nation ? getEntityDisplayName(nation, locale) || nation.name : id,
        remove: () =>
          setFilters({ nationIds: filters.nationIds.filter((x) => x !== id) }),
      });
    });

    filters.arcIds.forEach((id) => {
      const arc = arcsById.get(id);
      tokens.push({
        key: `arc:${id}`,
        label: arc ? getEntityDisplayName(arc, locale) || arc.name : id,
        remove: () =>
          setFilters({ arcIds: filters.arcIds.filter((x) => x !== id) }),
      });
    });

    filters.characterIds.forEach((id) => {
      const character = charactersById.get(id);
      tokens.push({
        key: `character:${id}`,
        label: character ? getEntityDisplayName(character, locale) || character.name : id,
        remove: () =>
          setFilters({
            characterIds: filters.characterIds.filter((x) => x !== id),
          }),
      });
    });

    filters.factionIds.forEach((id) => {
      const faction = factionsById.get(id);
      tokens.push({
        key: `faction:${id}`,
        label: faction ? getEntityDisplayName(faction, locale) || faction.name : id,
        remove: () =>
          setFilters({
            factionIds: filters.factionIds.filter((x) => x !== id),
          }),
      });
    });

    filters.importance.forEach((imp) => {
      tokens.push({
        key: `importance:${imp}`,
        label: t(
          imp === 'main'
            ? 'filters.importanceMain'
            : imp === 'secondary'
              ? 'filters.importanceSecondary'
              : 'filters.importanceMinor',
        ),
        remove: () =>
          setFilters({ importance: filters.importance.filter((x) => x !== imp) }),
      });
    });

    filters.periods.forEach((period) => {
      tokens.push({
        key: `period:${period}`,
        label: period,
        remove: () =>
          setFilters({ periods: filters.periods.filter((x) => x !== period) }),
      });
    });

    // Interruttori globali: appaiono come token solo quando attivi (≠ default).
    if (filters.canonOnly) {
      tokens.push({
        key: 'flag:canonOnly',
        label: t('filters.canonOnly'),
        remove: () => setFilters({ canonOnly: false }),
      });
    }
    if (filters.showUnverified) {
      tokens.push({
        key: 'flag:showUnverified',
        label: t('filters.showUnverified'),
        remove: () => setFilters({ showUnverified: false }),
      });
    }
    if (filters.highlightPoneglyphs) {
      tokens.push({
        key: 'flag:highlightPoneglyphs',
        label: t('filters.highlightPoneglyphs'),
        remove: () => setFilters({ highlightPoneglyphs: false }),
      });
    }

    return tokens;
  }, [filters, setFilters, locale, t, nationsById, arcsById, charactersById, factionsById]);
}
