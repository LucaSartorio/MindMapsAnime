import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { WorldDataset } from '@/types';
import { StoryArcCard } from './StoryArcCard';
import { EmptyState } from '@/components/common/EmptyState';
import { SourceNotice } from '@/components/common/SourceNotice';

interface StoryArcsPageProps {
  dataset: WorldDataset;
}

export function StoryArcsPage({ dataset }: StoryArcsPageProps) {
  const [params, setParams] = useSearchParams();
  const activeId = params.get('id');
  const [query, setQuery] = useState('');
  const [saga, setSaga] = useState('');

  const sagas = useMemo(
    () => Array.from(new Set(dataset.arcs.map((a) => a.saga).filter(Boolean))),
    [dataset.arcs],
  ) as string[];

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...dataset.arcs]
      .sort((a, b) => a.order - b.order)
      .filter((a) => {
        if (saga && a.saga !== saga) return false;
        if (
          q &&
          !a.name.toLowerCase().includes(q) &&
          !a.description.toLowerCase().includes(q)
        )
          return false;
        return true;
      });
  }, [dataset.arcs, query, saga]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-chakra-300">
          {dataset.world.title}
        </p>
        <h1 className="font-display text-3xl text-ink-100">Archi narrativi</h1>
        <p className="text-sm text-ink-300 max-w-2xl">
          Lista cronologica degli archi narrativi del mondo. Ogni card mostra
          il numero di eventi e di luoghi coinvolti.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Cerca un arco…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="panel-soft px-3 py-2 text-sm flex-1 min-w-[200px]"
        />
        <select
          value={saga}
          onChange={(e) => setSaga(e.target.value)}
          className="panel-soft px-3 py-2 text-sm"
          aria-label="Filtra per saga"
        >
          <option value="">Tutte le saghe</option>
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
          title="Nessun arco"
          description="Nessun arco corrisponde ai filtri."
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <li key={a.id}>
              <StoryArcCard
                arc={a}
                dataset={dataset}
                active={a.id === activeId}
                onClick={() => setParams({ id: a.id })}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
