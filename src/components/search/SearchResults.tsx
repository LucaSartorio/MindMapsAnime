import { Fragment, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { SearchResult } from '@/types';
import { cn } from '@/lib/cn';
import { EmptyState } from '@/components/common/EmptyState';

interface SearchResultsProps {
  results: SearchResult[];
  onSelect: (r: SearchResult) => void;
  /** Termine per le tecniche del mondo attivo (es. "Nen" per HxH). */
  techniqueTerm?: string;
  /** Indice attualmente evidenziato (navigazione da tastiera). */
  activeIndex?: number;
  /** Costruisce l'id di ciascuna opzione per `aria-activedescendant`. */
  optionId?: (index: number) => string;
  /** Aggiorna l'indice attivo al passaggio del mouse. */
  onActiveIndexChange?: (index: number) => void;
}

export function SearchResults({
  results,
  onSelect,
  techniqueTerm,
  activeIndex = 0,
  optionId,
  onActiveIndexChange,
}: SearchResultsProps) {
  const { t } = useTranslation();
  const listRef = useRef<HTMLDivElement>(null);

  // Tiene l'opzione attiva sempre visibile durante la navigazione da tastiera.
  useEffect(() => {
    listRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, results]);

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
    <div
      ref={listRef}
      id="search-listbox"
      role="listbox"
      className="divide-y divide-ink-700/40"
    >
      {results.map((r, i) => {
        const active = i === activeIndex;
        // Intestazione "Correlate a …" prima del primo risultato di relazione.
        const showRelatedHeader = !!r.relatedTo && !results[i - 1]?.relatedTo;
        return (
          <Fragment key={`${r.kind}-${r.id}`}>
            {showRelatedHeader && (
              <div
                role="presentation"
                className="bg-ink-900/50 px-3 py-1.5 text-[10px] font-display uppercase tracking-widest text-ink-400"
              >
                {t('search.relatedTo', { title: r.relatedTo })}
              </div>
            )}
            <button
              id={optionId?.(i)}
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => onSelect(r)}
              onMouseMove={() => onActiveIndexChange?.(i)}
              className={cn(
                'flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left',
                active ? 'bg-chakra-500/20' : 'hover:bg-chakra-500/10',
              )}
            >
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm text-ink-100">{r.title}</span>
                {r.subtitle && (
                  <span className="truncate text-xs text-ink-400">{r.subtitle}</span>
                )}
              </span>
              <span className="chip text-[10px] uppercase tracking-widest">
                {t(`search.kinds.${r.kind}`, { term: techniqueTerm ?? 'Jutsu' })}
              </span>
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}
