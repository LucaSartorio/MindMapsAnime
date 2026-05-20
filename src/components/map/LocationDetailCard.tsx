import { useMemo } from 'react';
import type { Location, WorldDataset } from '@/types';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ReferencePill } from '@/components/common/StatusPill';
import { useMapStore } from '@/store';

interface LocationDetailCardProps {
  location: Location;
  dataset: WorldDataset;
  onClose: () => void;
  onZoomIn?: () => void;
}

/** Pannello dettaglio luogo. */
export function LocationDetailCard({
  location,
  dataset,
  onClose,
  onZoomIn,
}: LocationDetailCardProps) {
  const nation = location.nationId
    ? dataset.nations.find((n) => n.id === location.nationId)
    : undefined;
  const characters = useMemo(
    () =>
      (location.characterIds ?? [])
        .map((id) => dataset.characters.find((c) => c.id === id))
        .filter((c): c is NonNullable<typeof c> => !!c),
    [location.characterIds, dataset.characters],
  );
  const factions = useMemo(
    () =>
      (location.clanIds ?? [])
        .map((id) => dataset.factions.find((f) => f.id === id))
        .filter((c): c is NonNullable<typeof c> => !!c),
    [location.clanIds, dataset.factions],
  );
  const arcs = useMemo(
    () =>
      (location.arcIds ?? [])
        .map((id) => dataset.arcs.find((a) => a.id === id))
        .filter((c): c is NonNullable<typeof c> => !!c),
    [location.arcIds, dataset.arcs],
  );
  const events = useMemo(
    () =>
      dataset.events
        .filter((e) => e.locationId === location.id)
        .sort((a, b) => a.order - b.order),
    [location.id, dataset.events],
  );
  const routes = useMemo(
    () =>
      dataset.routes.filter((r) =>
        r.steps.some((s) => s.locationId === location.id),
      ),
    [location.id, dataset.routes],
  );

  const setSelectedRoute = useMapStore((s) => s.setSelectedRoute);

  return (
    <div className="flex flex-col h-full">
      <header className="px-4 py-3 border-b border-ink-700/60 flex items-start justify-between gap-3 shrink-0">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-chakra-300">
            {location.type.replace('_', ' ')}
          </div>
          <h2 className="font-display text-xl text-ink-100 mt-0.5">
            {location.name}
          </h2>
          {location.nameLocal && (
            <p className="text-xs text-ink-300 italic">{location.nameLocal}</p>
          )}
          {nation && (
            <div className="mt-1.5">
              <Badge variant="accent">{nation.name}</Badge>
            </div>
          )}
        </div>
        <button
          type="button"
          aria-label="Chiudi dettaglio"
          onClick={onClose}
          className="text-ink-300 hover:text-white text-xl leading-none"
        >
          ×
        </button>
      </header>

      <div className="flex-1 overflow-auto px-4 py-4 space-y-5 text-sm text-ink-200">
        <p className="leading-relaxed">{location.shortDescription}</p>
        {location.longDescription && (
          <p className="text-ink-300 leading-relaxed">{location.longDescription}</p>
        )}

        {(location.referenceStatus || location.mangaChapters || location.animeEpisodes) && (
          <Card soft className="p-3 text-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono uppercase tracking-widest text-ink-400">
                Riferimenti
              </span>
              {location.referenceStatus && (
                <ReferencePill status={location.referenceStatus} />
              )}
            </div>
            {(location.mangaChapters?.length ?? 0) > 0 && (
              <p className="text-ink-300">
                <strong>Manga:</strong>{' '}
                {location.mangaChapters?.join(', ')}
              </p>
            )}
            {(location.animeEpisodes?.length ?? 0) > 0 && (
              <p className="text-ink-300">
                <strong>Anime:</strong>{' '}
                {location.animeEpisodes?.join(', ')}
              </p>
            )}
            {(!location.mangaChapters?.length && !location.animeEpisodes?.length) && (
              <p className="text-yellow-300/80 text-xs italic">
                Capitoli/episodi non confermati. Dato da verificare.
              </p>
            )}
          </Card>
        )}

        {location.subMapLevelId && onZoomIn && (
          <Button onClick={onZoomIn} variant="ember">
            Zoom nel luogo →
          </Button>
        )}

        {events.length > 0 && (
          <section>
            <h3 className="font-display text-sm uppercase tracking-widest text-chakra-300 mb-2">
              Eventi qui
            </h3>
            <ul className="space-y-2">
              {events.map((e) => (
                <li key={e.id} className="panel-soft p-3 text-sm">
                  <p className="text-ink-100">{e.title}</p>
                  <p className="text-xs text-ink-400 mt-0.5">{e.period}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {characters.length > 0 && (
          <section>
            <h3 className="font-display text-sm uppercase tracking-widest text-chakra-300 mb-2">
              Personaggi collegati
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {characters.map((c) => (
                <Badge key={c.id} variant="default">
                  {c.name}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {factions.length > 0 && (
          <section>
            <h3 className="font-display text-sm uppercase tracking-widest text-chakra-300 mb-2">
              Clan / Fazioni
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {factions.map((f) => (
                <Badge key={f.id} variant="accent">
                  {f.name}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {arcs.length > 0 && (
          <section>
            <h3 className="font-display text-sm uppercase tracking-widest text-chakra-300 mb-2">
              Archi narrativi
            </h3>
            <ul className="space-y-1.5">
              {arcs.map((a) => (
                <li
                  key={a.id}
                  className="text-ink-200 text-sm flex items-center gap-2"
                >
                  <span className="text-ember-400">◆</span>
                  {a.name}
                </li>
              ))}
            </ul>
          </section>
        )}

        {routes.length > 0 && (
          <section>
            <h3 className="font-display text-sm uppercase tracking-widest text-chakra-300 mb-2">
              Percorsi che passano qui
            </h3>
            <div className="flex flex-wrap gap-2">
              {routes.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRoute(r.id)}
                  className="chip hover:border-chakra-500/70 hover:text-white"
                >
                  {r.name}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Galleria placeholder (no asset protetti) */}
        <section>
          <h3 className="font-display text-sm uppercase tracking-widest text-chakra-300 mb-2">
            Galleria
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                aria-hidden
                className="aspect-square rounded-lg border border-dashed border-ink-600/60 bg-ink-800/40 grid place-items-center text-[10px] text-ink-400 font-mono"
              >
                placeholder
              </div>
            ))}
          </div>
          <p className="text-[10px] text-ink-400 mt-1.5">
            Immagini ufficiali non incluse per copyright.
          </p>
        </section>
      </div>
    </div>
  );
}
