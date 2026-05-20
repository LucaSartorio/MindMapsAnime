import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { WorldDataset } from '@/types';
import { CharacterCard } from './CharacterCard';
import { EmptyState } from '@/components/common/EmptyState';
import { SourceNotice } from '@/components/common/SourceNotice';

interface CharactersPageProps {
  dataset: WorldDataset;
}

export function CharactersPage({ dataset }: CharactersPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeId = searchParams.get('id');
  const [query, setQuery] = useState('');
  const [filterVillage, setFilterVillage] = useState<string>('');

  const villages = useMemo(
    () =>
      dataset.locations
        .filter((l) => l.type === 'village')
        .sort((a, b) => a.name.localeCompare(b.name)),
    [dataset.locations],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dataset.characters
      .filter((c) => {
        if (
          q &&
          !c.name.toLowerCase().includes(q) &&
          !c.shortDescription.toLowerCase().includes(q)
        )
          return false;
        if (filterVillage && c.villageLocationId !== filterVillage)
          return false;
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [dataset.characters, query, filterVillage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-chakra-300">
          {dataset.world.title}
        </p>
        <h1 className="font-display text-3xl text-ink-100">
          Archivio personaggi
        </h1>
        <p className="text-sm text-ink-300 max-w-2xl">
          Schede sintetiche dei personaggi principali del mondo. Clicca una
          card per vederne i dettagli.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Cerca un personaggio…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="panel-soft px-3 py-2 text-sm flex-1 min-w-[200px]"
        />
        <select
          value={filterVillage}
          onChange={(e) => setFilterVillage(e.target.value)}
          className="panel-soft px-3 py-2 text-sm"
          aria-label="Filtra per villaggio"
        >
          <option value="">Tutti i villaggi</option>
          {villages.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      <SourceNotice compact />

      {filtered.length === 0 ? (
        <EmptyState
          title="Nessun personaggio"
          description="Nessun risultato per i filtri attivi."
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((c) => (
            <li key={c.id}>
              <CharacterCard
                character={c}
                dataset={dataset}
                active={c.id === activeId}
                onClick={() => setSearchParams({ id: c.id })}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
