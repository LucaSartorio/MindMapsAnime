import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import { useMapStore } from '@/store';
import { cn } from '@/lib/cn';
import { useFilteredLocations } from '@/lib/mapSelectors';
import { useActiveFilterTokens, type ActiveFilterToken } from './useActiveFilterTokens';

interface ActiveFilterBarProps {
  dataset: WorldDataset;
  /**
   * `floating` = barra compatta sopra la mappa (nascosta se nessun filtro).
   * `inline`   = riepilogo dentro il drawer dei filtri (mostra anche lo stato
   *              "nessun filtro attivo").
   */
  variant: 'floating' | 'inline';
}

function RemovableChip({ token, removeLabel }: { token: ActiveFilterToken; removeLabel: string }) {
  return (
    <span className="active-chip">
      <span className="max-w-[12rem] truncate">{token.label}</span>
      <button
        type="button"
        onClick={token.remove}
        aria-label={removeLabel}
        className="active-chip-remove"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </span>
  );
}

/**
 * Barra dei filtri attivi + conteggio risultati.
 *
 * Rende evidenti i filtri impostati (WCAG: feedback dello stato), permette di
 * rimuoverne uno alla volta o azzerarli tutti, e annuncia il numero di
 * risultati via una live region (`aria-live="polite"`).
 */
export function ActiveFilterBar({ dataset, variant }: ActiveFilterBarProps) {
  const { t } = useTranslation();
  const tokens = useActiveFilterTokens(dataset);
  const count = useFilteredLocations(dataset).length;
  const resetFilters = useMapStore((s) => s.resetFilters);

  const clearAllBtn = (
    <button
      type="button"
      onClick={resetFilters}
      className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-ink-300 underline-offset-2 transition hover:text-white hover:underline"
    >
      {t('filters.clearAll')}
    </button>
  );

  const resultBadge = (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink-800/70 px-2 py-1 text-xs font-medium text-ink-200"
      title={t('filters.resultsCount', { count })}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-chakra-300" aria-hidden>
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
      </svg>
      <span className="tabular-nums">{count}</span>
    </span>
  );

  if (variant === 'floating') {
    if (tokens.length === 0) return null;
    return (
      <div
        role="region"
        aria-label={t('filters.active')}
        className="panel pointer-events-auto flex max-w-[min(92vw,46rem)] items-center gap-2 p-2 shadow-panel animate-fadeIn"
      >
        {resultBadge}
        <span className="sr-only" aria-live="polite">
          {t('filters.resultsCount', { count })}
        </span>
        <ul className="flex flex-1 items-center gap-1.5 overflow-x-auto scrollbar-none">
          {tokens.map((token) => (
            <li key={token.key} className="shrink-0">
              <RemovableChip token={token} removeLabel={t('filters.remove', { name: token.label })} />
            </li>
          ))}
        </ul>
        {clearAllBtn}
      </div>
    );
  }

  // variant === 'inline' (dentro il drawer)
  return (
    <div className={cn('rounded-xl border border-ink-700/50 bg-ink-950/40 p-3')}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink-300">
          {t('filters.active')}
          {tokens.length > 0 && <span className="count-badge">{tokens.length}</span>}
        </span>
        <span aria-live="polite" className="text-[11px] text-ink-400">
          {t('filters.resultsCount', { count })}
        </span>
      </div>
      {tokens.length === 0 ? (
        <p className="text-xs text-ink-400">{t('filters.noneActive')}</p>
      ) : (
        <>
          <ul className="flex flex-wrap gap-1.5">
            {tokens.map((token) => (
              <li key={token.key}>
                <RemovableChip token={token} removeLabel={t('filters.remove', { name: token.label })} />
              </li>
            ))}
          </ul>
          <div className="mt-2 flex justify-end">{clearAllBtn}</div>
        </>
      )}
    </div>
  );
}
