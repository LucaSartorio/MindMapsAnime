import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ChakraNature, JutsuType, WorldDataset } from '@/types';
import { JutsuCard } from './JutsuCard';
import { EmptyState } from '@/components/common/EmptyState';
import { SourceNotice } from '@/components/common/SourceNotice';
import { useUiStore } from '@/store';
import { useLocaleStore } from '@/store/useLocaleStore';
import {
  getChakraNatureLabel,
  getJutsuTypeLabel,
  getLocalizedText,
} from '@/utils/localization';

interface JutsuPageProps {
  dataset: WorldDataset;
}

export function JutsuPage({ dataset }: JutsuPageProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const [params] = useSearchParams();
  const initialId = params.get('id');
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterNature, setFilterNature] = useState<string>('');
  const openJutsuModal = useUiStore((s) => s.openJutsuModal);

  const allJutsu = useMemo(() => dataset.jutsu ?? [], [dataset.jutsu]);

  useEffect(() => {
    if (initialId) openJutsuModal(initialId);
  }, [initialId, openJutsuModal]);

  const types = useMemo(() => {
    const set = new Set<JutsuType>();
    for (const j of allJutsu) set.add(j.type);
    return [...set].sort();
  }, [allJutsu]);

  const natures = useMemo(() => {
    const set = new Set<ChakraNature>();
    for (const j of allJutsu) for (const n of j.chakraNature ?? []) set.add(n);
    return [...set].sort();
  }, [allJutsu]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allJutsu
      .filter((j) => {
        if (q) {
          const name = (
            getLocalizedText(j.localizedName, locale) || j.name
          ).toLowerCase();
          const desc = getLocalizedText(j.shortDescription, locale).toLowerCase();
          if (
            !name.includes(q) &&
            !j.name.toLowerCase().includes(q) &&
            !desc.includes(q)
          )
            return false;
        }
        if (filterType && j.type !== filterType) return false;
        if (filterNature && !(j.chakraNature ?? []).includes(filterNature as ChakraNature))
          return false;
        return true;
      })
      .sort((a, b) =>
        (getLocalizedText(a.localizedName, locale) || a.name).localeCompare(
          getLocalizedText(b.localizedName, locale) || b.name,
        ),
      );
  }, [allJutsu, query, filterType, filterNature, locale]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-chakra-300">
          {dataset.world.title}
        </p>
        <h1 className="font-display text-3xl text-ink-100">
          {t('jutsu.archiveTitle')}
        </h1>
        <p className="text-sm text-ink-300 max-w-2xl">{t('jutsu.archiveLead')}</p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder={t('jutsu.searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="panel-soft px-3 py-2 text-sm flex-1 min-w-[200px]"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="panel-soft px-3 py-2 text-sm"
          aria-label={t('jutsu.typeFilterAria')}
        >
          <option value="">{t('jutsu.typeFilterAll')}</option>
          {types.map((ty) => (
            <option key={ty} value={ty}>
              {getJutsuTypeLabel(ty, locale)}
            </option>
          ))}
        </select>
        <select
          value={filterNature}
          onChange={(e) => setFilterNature(e.target.value)}
          className="panel-soft px-3 py-2 text-sm"
          aria-label={t('jutsu.natureFilterAria')}
        >
          <option value="">{t('jutsu.natureFilterAll')}</option>
          {natures.map((n) => (
            <option key={n} value={n}>
              {getChakraNatureLabel(n, locale)}
            </option>
          ))}
        </select>
      </div>

      <SourceNotice compact />

      {filtered.length === 0 ? (
        <EmptyState
          title={t('jutsu.empty')}
          description={t('jutsu.emptyDescription')}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((j) => (
            <li key={j.id}>
              <JutsuCard
                jutsu={j}
                dataset={dataset}
                onClick={() => openJutsuModal(j.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
