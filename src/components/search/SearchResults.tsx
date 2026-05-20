import type { SearchResult } from '@/types';
import { EmptyState } from '@/components/common/EmptyState';

interface SearchResultsProps {
  results: SearchResult[];
  onSelect: (r: SearchResult) => void;
}

const KIND_LABELS: Record<SearchResult['kind'], string> = {
  world: 'Mondo',
  location: 'Luogo',
  character: 'Personaggio',
  faction: 'Clan/Fazione',
  arc: 'Arco',
  event: 'Evento',
  nation: 'Nazione',
  route: 'Percorso',
};

export function SearchResults({ results, onSelect }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          title="Nessun risultato"
          description="Prova con un altro termine."
        />
      </div>
    );
  }
  return (
    <ul id="search-listbox" role="listbox" className="divide-y divide-ink-700/40">
      {results.map((r) => (
        <li key={`${r.kind}-${r.id}`}>
          <button
            type="button"
            role="option"
            aria-selected="false"
            onClick={() => onSelect(r)}
            className="w-full text-left flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-chakra-500/10"
          >
            <span className="flex flex-col min-w-0">
              <span className="text-sm text-ink-100 truncate">{r.title}</span>
              {r.subtitle && (
                <span className="text-xs text-ink-400 truncate">
                  {r.subtitle}
                </span>
              )}
            </span>
            <span className="chip text-[10px] uppercase tracking-widest">
              {KIND_LABELS[r.kind]}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
