import { useTranslation } from 'react-i18next';
import type { SearchResult } from '@/types';
import { EmptyState } from '@/components/common/EmptyState';

interface SearchResultsProps {
  results: SearchResult[];
  onSelect: (r: SearchResult) => void;
  /** Termine per le tecniche del mondo attivo (es. "Nen" per HxH). */
  techniqueTerm?: string;
}

export function SearchResults({ results, onSelect, techniqueTerm }: SearchResultsProps) {
  const { t } = useTranslation();
  if (results.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          title={t('search.emptyTitle')}
          description={t('search.emptyDescription')}
        />
      </div>
    );
  }
  return (
    // role=listbox con figli role=option diretti (niente <ul>/<li>).
    <div id="search-listbox" role="listbox" className="divide-y divide-ink-700/40">
      {results.map((r) => (
        <button
          key={`${r.kind}-${r.id}`}
          type="button"
          role="option"
          aria-selected="false"
          onClick={() => onSelect(r)}
          className="w-full text-left flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-chakra-500/10"
        >
          <span className="flex flex-col min-w-0">
            <span className="text-sm text-ink-100 truncate">{r.title}</span>
            {r.subtitle && (
              <span className="text-xs text-ink-400 truncate">{r.subtitle}</span>
            )}
          </span>
          <span className="chip text-[10px] uppercase tracking-widest">
            {t(`search.kinds.${r.kind}`, { term: techniqueTerm ?? 'Jutsu' })}
          </span>
        </button>
      ))}
    </div>
  );
}
