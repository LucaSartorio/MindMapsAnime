import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import { StoryArcCard } from './StoryArcCard';
import { EmptyState } from '@/components/common/EmptyState';
import { SourceNotice } from '@/components/common/SourceNotice';
import { useMapStore, useUiStore } from '@/store';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';
import { arcSeries, matchesSelectedSeries } from '@/lib/series';

interface StoryArcsPageProps {
  dataset: WorldDataset;
}

export function StoryArcsPage({ dataset }: StoryArcsPageProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const [params] = useSearchParams();
  const initialId = params.get('id');
  const [query, setQuery] = useState('');
  // Differita: i tasti dipingono subito, il refiltro gira a bassa priorità.
  const deferredQuery = useDeferredValue(query);
  const [saga, setSaga] = useState('');
  const openArcModal = useUiStore((s) => s.openArcModal);
  const filters = useMapStore((s) => s.filters);

  useEffect(() => {
    if (initialId) openArcModal(initialId);
  }, [initialId, openArcModal]);

  const sagas = useMemo(
    () =>
      Array.from(
        new Set(
          dataset.arcs
            .map((a) => getLocalizedText(a.saga, locale))
            .filter(Boolean),
        ),
      ),
    [dataset.arcs, locale],
  );

  const items = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return [...dataset.arcs]
      .sort((a, b) => a.order - b.order)
      .filter((a) => {
        if (!matchesSelectedSeries(arcSeries(a), filters.series)) return false;
        if (saga && getLocalizedText(a.saga, locale) !== saga) return false;
        if (q) {
          const desc = getLocalizedText(a.description, locale).toLowerCase();
          const name = (
            getLocalizedText(a.localizedName, locale) || a.name
          ).toLowerCase();
          if (!name.includes(q) && !desc.includes(q)) return false;
        }
        return true;
      });
  }, [dataset.arcs, filters.series, deferredQuery, saga, locale]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-chakra-300">
          {dataset.world.title}
        </p>
        <h1 className="font-display text-3xl text-ink-100">
          {t('arcs.archiveTitle')}
        </h1>
        <p className="text-sm text-ink-300 max-w-2xl">{t('arcs.archiveLead')}</p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder={t('arcs.searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="panel-soft px-3 py-2 text-sm flex-1 min-w-[200px]"
        />
        <select
          value={saga}
          onChange={(e) => setSaga(e.target.value)}
          className="panel-soft px-3 py-2 text-sm"
          aria-label={t('arcs.sagaFilterAria')}
        >
          <option value="">{t('arcs.sagaFilterAll')}</option>
          {sagas.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <SourceNotice compact />

      {items.length === 0 ? (
        <EmptyState
          title={t('arcs.empty')}
          description={t('arcs.emptyDescription')}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <li key={a.id}>
              <StoryArcCard
                arc={a}
                dataset={dataset}
                onClick={() => openArcModal(a.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
