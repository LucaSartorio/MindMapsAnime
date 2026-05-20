import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { SearchResult, WorldDataset } from '@/types';
import { searchDataset } from '@/lib/search';
import { useMapStore, useUiStore } from '@/store';
import { useLocaleStore } from '@/store/useLocaleStore';
import { SearchResults } from './SearchResults';

interface GlobalSearchDropdownProps {
  dataset: WorldDataset;
  /** Mostra il bottone "/" hint nel placeholder se vero (desktop). */
  showKbHint?: boolean;
}

/**
 * Search globale contestuale al mondo attivo.
 * Risultati in dropdown sotto l'input → non sposta il layout.
 *
 * Click su risultato:
 *  - location → apre LocationDetailsModal + centra il nodo sulla mappa
 *  - character/event/arc/faction/route → apre la rispettiva modal
 *  - nation → naviga alla mappa
 */
export function GlobalSearchDropdown({
  dataset,
  showKbHint = false,
}: GlobalSearchDropdownProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo(
    () => (query ? searchDataset(query, dataset, locale).slice(0, 10) : []),
    [query, dataset, locale],
  );

  // Click fuori → chiude
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Scorciatoia "/" per mettere focus
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (
        e.key === '/' &&
        tag !== 'INPUT' &&
        tag !== 'TEXTAREA' &&
        !e.metaKey &&
        !e.ctrlKey
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
        setOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  function handleSelect(r: SearchResult) {
    const slug = dataset.world.slug;
    const ui = useUiStore.getState();
    const map = useMapStore.getState();
    setOpen(false);
    setQuery('');
    inputRef.current?.blur();

    switch (r.kind) {
      case 'location': {
        const loc = dataset.locations.find((l) => l.id === r.id);
        if (loc) {
          map.setActiveMapLevel(loc.mapLevelId);
          map.setSelectedLocation(loc.id);
          navigate(`/worlds/${slug}`);
          ui.openLocationModal(loc.id);
        }
        break;
      }
      case 'character':
        navigate(`/worlds/${slug}`);
        ui.openCharacterModal(r.id);
        break;
      case 'faction':
        navigate(`/worlds/${slug}`);
        ui.openFactionModal(r.id);
        break;
      case 'arc':
        navigate(`/worlds/${slug}`);
        ui.openArcModal(r.id);
        break;
      case 'event': {
        const ev = dataset.events.find((e) => e.id === r.id);
        if (ev) {
          if (ev.locationId) {
            const loc = dataset.locations.find((l) => l.id === ev.locationId);
            if (loc) {
              map.setActiveMapLevel(loc.mapLevelId);
              map.setSelectedLocation(loc.id);
            }
          }
          navigate(`/worlds/${slug}`);
          ui.openEventModal(ev.id);
        }
        break;
      }
      case 'route':
        map.setSelectedRoute(r.id);
        navigate(`/worlds/${slug}`);
        ui.openRouteModal(r.id);
        break;
      case 'nation':
        navigate(`/worlds/${slug}`);
        ui.openNationModal(r.id);
        break;
      case 'boundary': {
        const b = dataset.boundaries?.find((x) => x.id === r.id);
        if (b) {
          map.setActiveMapLevel(b.mapLevelId);
          map.setSelectedBoundary(b.id);
          navigate(`/worlds/${slug}`);
          ui.openBoundaryModal(b.id);
        }
        break;
      }
      default:
        break;
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <label htmlFor="global-search" className="sr-only">
        {t('search.label', { world: dataset.world.title })}
      </label>
      <div className="relative">
        <span
          aria-hidden
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
        >
          ⌕
        </span>
        <input
          ref={inputRef}
          id="global-search"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t('search.placeholder', { world: dataset.world.title })}
          className="w-full panel-soft pl-8 pr-10 py-2 text-sm placeholder-ink-400 focus:border-chakra-500"
          aria-autocomplete="list"
          aria-expanded={open && results.length > 0}
          aria-controls="search-listbox"
        />
        {showKbHint && !query && (
          <kbd
            aria-hidden
            className="hidden sm:inline-block absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-ink-400 border border-ink-700 px-1.5 py-0.5 rounded"
          >
            /
          </kbd>
        )}
      </div>
      {open && query && (
        <div className="absolute z-[55] mt-2 left-0 right-0 panel max-h-96 overflow-auto">
          <SearchResults results={results} onSelect={handleSelect} />
        </div>
      )}
    </div>
  );
}
