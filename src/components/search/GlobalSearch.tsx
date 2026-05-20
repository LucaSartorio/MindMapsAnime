import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SearchResult, WorldDataset } from '@/types';
import { searchDataset } from '@/lib/search';
import { useMapStore } from '@/store';
import { SearchResults } from './SearchResults';

interface GlobalSearchProps {
  dataset: WorldDataset;
}

/**
 * Search bar contestuale al mondo corrente.
 * Click su un risultato:
 *  - location: porta sulla mappa e centra il nodo
 *  - character: naviga all'archivio personaggi
 *  - faction: naviga a /clans
 *  - arc: naviga a /arcs
 *  - event: porta sulla mappa, evidenzia evento e location
 *  - route: porta sulla mappa, attiva route
 */
export function GlobalSearch({ dataset }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results = useMemo(
    () => (query ? searchDataset(query, dataset).slice(0, 10) : []),
    [query, dataset],
  );

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

  function handleSelect(r: SearchResult) {
    const slug = dataset.world.slug;
    setOpen(false);
    setQuery('');
    switch (r.kind) {
      case 'location': {
        const loc = dataset.locations.find((l) => l.id === r.id);
        if (loc) {
          useMapStore.getState().setActiveMapLevel(loc.mapLevelId);
          useMapStore.getState().setSelectedLocation(loc.id);
          navigate(`/worlds/${slug}`);
        }
        break;
      }
      case 'character':
        navigate(`/worlds/${slug}/characters?id=${r.id}`);
        break;
      case 'faction':
        navigate(`/worlds/${slug}/clans?id=${r.id}`);
        break;
      case 'arc':
        navigate(`/worlds/${slug}/arcs?id=${r.id}`);
        break;
      case 'event': {
        const ev = dataset.events.find((e) => e.id === r.id);
        if (ev) {
          useMapStore.getState().setSelectedTimelineEvent(ev.id);
          if (ev.locationId) {
            const loc = dataset.locations.find((l) => l.id === ev.locationId);
            if (loc) {
              useMapStore.getState().setActiveMapLevel(loc.mapLevelId);
              useMapStore.getState().setSelectedLocation(loc.id);
            }
          }
          navigate(`/worlds/${slug}`);
        }
        break;
      }
      case 'route':
        useMapStore.getState().setSelectedRoute(r.id);
        navigate(`/worlds/${slug}`);
        break;
      case 'nation':
        navigate(`/worlds/${slug}`);
        break;
      default:
        break;
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <label htmlFor="global-search" className="sr-only">
        Cerca nel mondo
      </label>
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
        placeholder={`Cerca in ${dataset.world.title}…`}
        className="w-full panel-soft px-3 py-2 text-sm placeholder-ink-400 focus:border-chakra-500"
        aria-autocomplete="list"
        aria-expanded={open && results.length > 0}
        aria-controls="search-listbox"
      />
      {open && query && (
        <div className="absolute mt-2 left-0 right-0 panel max-h-96 overflow-auto z-40">
          <SearchResults results={results} onSelect={handleSelect} />
        </div>
      )}
    </div>
  );
}
