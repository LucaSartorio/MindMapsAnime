import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { FactionType, WorldDataset } from '@/types';
import { ClanFactionCard } from './ClanFactionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { SourceNotice } from '@/components/common/SourceNotice';
import { useUiStore } from '@/store';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';

interface ClansAndFactionsPageProps {
  dataset: WorldDataset;
}

const TYPE_KEYS: Array<{ value: FactionType | ''; tKey: string }> = [
  { value: '', tKey: 'clans.types.all' },
  { value: 'clan', tKey: 'clans.types.clan' },
  { value: 'organization', tKey: 'clans.types.organization' },
  { value: 'army', tKey: 'clans.types.army' },
  { value: 'group', tKey: 'clans.types.group' },
  { value: 'village', tKey: 'clans.types.village' },
];

export function ClansAndFactionsPage({ dataset }: ClansAndFactionsPageProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const [params] = useSearchParams();
  const initialId = params.get('id');
  const [filter, setFilter] = useState<FactionType | ''>('');
  const [query, setQuery] = useState('');
  const openFactionModal = useUiStore((s) => s.openFactionModal);

  useEffect(() => {
    if (initialId) openFactionModal(initialId);
  }, [initialId, openFactionModal]);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dataset.factions
      .filter((f) => {
        if (filter && f.type !== filter) return false;
        if (q) {
          const desc = getLocalizedText(f.description, locale).toLowerCase();
          if (!f.name.toLowerCase().includes(q) && !desc.includes(q))
            return false;
        }
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [dataset.factions, filter, query, locale]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-chakra-300">
          {dataset.world.title}
        </p>
        <h1 className="font-display text-3xl text-ink-100">
          {t('clans.archiveTitle')}
        </h1>
        <p className="text-sm text-ink-300 max-w-2xl">{t('clans.archiveLead')}</p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder={t('clans.searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="panel-soft px-3 py-2 text-sm flex-1 min-w-[200px]"
        />
        <div className="flex flex-wrap gap-1.5">
          {TYPE_KEYS.map((tk) => (
            <button
              key={tk.value}
              type="button"
              onClick={() => setFilter(tk.value)}
              aria-pressed={filter === tk.value}
              className={
                'px-3 py-1.5 rounded-full text-xs transition border ' +
                (filter === tk.value
                  ? 'bg-chakra-500 text-white border-chakra-300'
                  : 'border-ink-600/60 text-ink-200 hover:border-chakra-500/50')
              }
            >
              {t(tk.tKey)}
            </button>
          ))}
        </div>
      </div>

      <SourceNotice compact />

      {items.length === 0 ? (
        <EmptyState
          title={t('clans.empty')}
          description={t('clans.emptyDescription')}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <li key={f.id}>
              <ClanFactionCard
                faction={f}
                dataset={dataset}
                onClick={() => openFactionModal(f.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
