import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { FactionType, WorldDataset } from '@/types';
import { ClanFactionCard } from './ClanFactionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { SourceNotice } from '@/components/common/SourceNotice';
import { useUiStore } from '@/store';

interface ClansAndFactionsPageProps {
  dataset: WorldDataset;
}

const TYPES: { value: FactionType | ''; label: string }[] = [
  { value: '', label: 'Tutti' },
  { value: 'clan', label: 'Clan' },
  { value: 'organization', label: 'Organizzazioni' },
  { value: 'army', label: 'Eserciti' },
  { value: 'group', label: 'Gruppi' },
  { value: 'village', label: 'Villaggi' },
];

export function ClansAndFactionsPage({ dataset }: ClansAndFactionsPageProps) {
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
        if (
          q &&
          !f.name.toLowerCase().includes(q) &&
          !f.description.toLowerCase().includes(q)
        )
          return false;
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [dataset.factions, filter, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-chakra-300">
          {dataset.world.title}
        </p>
        <h1 className="font-display text-3xl text-ink-100">
          Clan &amp; Fazioni
        </h1>
        <p className="text-sm text-ink-300 max-w-2xl">
          Clan, organizzazioni, fazioni e gruppi che caratterizzano il mondo.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Cerca clan o fazione…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="panel-soft px-3 py-2 text-sm flex-1 min-w-[200px]"
        />
        <div className="flex flex-wrap gap-1.5">
          {TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setFilter(t.value)}
              aria-pressed={filter === t.value}
              className={
                'px-3 py-1.5 rounded-full text-xs transition border ' +
                (filter === t.value
                  ? 'bg-chakra-500 text-white border-chakra-300'
                  : 'border-ink-600/60 text-ink-200 hover:border-chakra-500/50')
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <SourceNotice compact />

      {items.length === 0 ? (
        <EmptyState
          title="Nessun clan o fazione"
          description="Nessun risultato per i filtri attuali."
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
