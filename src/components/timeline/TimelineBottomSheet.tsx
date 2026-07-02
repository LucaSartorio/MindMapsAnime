import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import { useMapStore, useUiStore } from '@/store';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';
import { filterEvents } from '@/lib/filters';
import { findLocation } from '@/lib/entities';
import { TimelineEventCard } from './TimelineEventCard';
import { EmptyState } from '@/components/common/EmptyState';

interface TimelineBottomSheetProps {
  dataset: WorldDataset;
}

/** Eventi = testo da leggere → avanzamento lento (come la story mode). */
const PLAY_INTERVAL = 3400;

/**
 * Timeline narrativa "snella": niente filtri, solo l'elenco eventi + un tasto
 * Riproduci che ripercorre TUTTI gli eventi uno per uno (come una story mode
 * dell'intera cronologia). A ogni tappa centra la mappa sul luogo dell'evento e
 * lo evidenzia. Durante la riproduzione il pannello collassa in una barra
 * compatta con Pausa/Riprendi + Stop (visibile solo se è partita la play).
 */
export function TimelineBottomSheet({ dataset }: TimelineBottomSheetProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const open = useUiStore((s) => s.isTimelineOpen);
  const toggle = useUiStore((s) => s.toggleTimeline);
  const filters = useMapStore((s) => s.filters);
  const selectedEventId = useMapStore((s) => s.selectedTimelineEventId);
  const selectedRouteId = useMapStore((s) => s.selectedRouteId);
  const setSelectedRoute = useMapStore((s) => s.setSelectedRoute);
  const setSelectedLocation = useMapStore((s) => s.setSelectedLocation);
  const setActiveMapLevel = useMapStore((s) => s.setActiveMapLevel);
  const setSelectedTimelineEvent = useMapStore((s) => s.setSelectedTimelineEvent);

  const [playbackActive, setPlaybackActive] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);

  const route = useMemo(
    () =>
      selectedRouteId
        ? dataset.routes.find((r) => r.id === selectedRouteId)
        : undefined,
    [dataset.routes, selectedRouteId],
  );

  // Lista stabile (non dipende dal luogo selezionato, che la play stessa imposta
  // a ogni tappa): rispetta i filtri mappa globali e lo scope sul percorso.
  const events = useMemo(() => {
    let base = filterEvents(dataset.events, filters, dataset);
    if (route) {
      const ids = new Set(
        route.steps.map((s) => s.eventId).filter(Boolean) as string[],
      );
      const locIds = new Set(route.steps.map((s) => s.locationId));
      base = base.filter(
        (e) =>
          ids.has(e.id) ||
          (e.locationId !== undefined && locIds.has(e.locationId)),
      );
    }
    return base.sort((a, b) => a.order - b.order);
  }, [dataset.events, filters, route, dataset]);

  const go = useCallback(
    (i: number) => {
      if (events.length === 0) return;
      const clamped = Math.max(0, Math.min(i, events.length - 1));
      setIndex(clamped);
      const ev = events[clamped];
      const loc = findLocation(dataset, ev.locationId);
      if (loc) {
        setActiveMapLevel(loc.mapLevelId);
        setSelectedLocation(loc.id);
      }
      setSelectedTimelineEvent(ev.id);
    },
    [events, dataset, setActiveMapLevel, setSelectedLocation, setSelectedTimelineEvent],
  );

  // Play: avanza da solo, si ferma all'ultima tappa (resta in modalità così
  // l'utente vede Riprendi/Stop).
  useEffect(() => {
    if (!playing) return;
    if (index >= events.length - 1) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => go(index + 1), PLAY_INTERVAL);
    return () => clearTimeout(id);
  }, [playing, index, go, events.length]);

  // Se la timeline si chiude o resta senza eventi, esci dalla riproduzione.
  useEffect(() => {
    if ((!open || events.length === 0) && playbackActive) {
      setPlaybackActive(false);
      setPlaying(false);
    }
  }, [open, events.length, playbackActive]);

  const startPlayback = () => {
    if (events.length === 0) return;
    setPlaybackActive(true);
    setIndex(0);
    go(0);
    setPlaying(true);
  };
  const stopPlayback = () => {
    setPlaybackActive(false);
    setPlaying(false);
    setIndex(0);
  };
  const atEnd = index >= events.length - 1;
  const current = events[index];
  const currentName = current ? getLocalizedText(current.title, locale) : '';

  // --- Barra compatta di riproduzione (collassata) --------------------------
  if (playbackActive) {
    return (
      <section
        aria-label={t('map.timeline.nowPlaying')}
        className="panel pointer-events-auto flex w-full items-center gap-2 px-3 py-2 shadow-panel animate-fadeIn"
      >
        <span aria-hidden className="shrink-0 text-chakra-300">
          ⌛
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-ink-100" aria-live="polite">
            <span className="font-mono text-[11px] tabular-nums text-ink-500">
              {index + 1}/{events.length}
            </span>{' '}
            · {currentName}
          </p>
          <div
            className="mt-1 h-1 overflow-hidden rounded-full bg-ink-700/60"
            role="progressbar"
            aria-label={t('map.timeline.nowPlaying')}
            aria-valuemin={1}
            aria-valuemax={Math.max(1, events.length)}
            aria-valuenow={index + 1}
          >
            <div
              className="h-full rounded-full bg-chakra-500 transition-all"
              style={{ width: `${((index + 1) / Math.max(1, events.length)) * 100}%` }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (atEnd) go(0);
            setPlaying((p) => !p);
          }}
          aria-pressed={playing}
          className="btn-primary shrink-0 !py-1.5 text-xs"
        >
          {playing ? t('map.timeline.pause') : t('map.timeline.resume')}
        </button>
        <button
          type="button"
          onClick={stopPlayback}
          aria-label={t('map.timeline.stop')}
          title={t('map.timeline.stop')}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-ink-600/70 text-ink-100 transition hover:bg-ink-800/70"
        >
          <span aria-hidden className="block h-2.5 w-2.5 rounded-[2px] bg-current" />
        </button>
      </section>
    );
  }

  // --- Timeline snella (disclosure) -----------------------------------------
  return (
    <section
      aria-label={t('map.timeline.title')}
      className="panel pointer-events-auto flex w-full flex-col overflow-hidden"
    >
      <header>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="timeline-body"
          onClick={toggle}
          className="flex w-full select-none items-center justify-between gap-3 px-3 py-1.5 text-left"
        >
          <span className="flex min-w-0 items-center gap-2">
            <span aria-hidden className="text-chakra-300">
              ⌛
            </span>
            <span className="font-display text-[11px] uppercase tracking-widest text-chakra-300">
              {t('map.timeline.title')}
            </span>
            <span className="shrink-0 text-[10px] text-ink-400">
              {t('map.timeline.events', { count: events.length })}
            </span>
            {route && (
              <span className="hidden truncate text-[10px] text-ember-300 sm:inline">
                · {t('map.timeline.filteredOnRoute', {
                  name: getLocalizedText(route.localizedName, locale) || route.name,
                })}
              </span>
            )}
          </span>
          <span aria-hidden className="btn-ghost shrink-0 !px-2 !py-0.5 text-[11px]">
            {open ? t('map.timeline.collapse') : t('map.timeline.expand')}
          </span>
        </button>
      </header>
      {open && (
        <div id="timeline-body" className="flex max-h-[40dvh] flex-col gap-2 px-3 pb-3">
          {events.length === 0 ? (
            <EmptyState
              title={t('map.timeline.empty')}
              description={t('map.timeline.emptyDescription')}
            />
          ) : (
            <>
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={startPlayback}
                  className="btn-primary !py-1.5 text-xs"
                >
                  ▶ {t('map.timeline.play')}
                </button>
                {route && (
                  <button
                    type="button"
                    onClick={() => setSelectedRoute(null)}
                    className="rounded px-2 py-0.5 text-[11px] text-ink-300 hover:text-white"
                  >
                    {t('map.timeline.showAll')}
                  </button>
                )}
              </div>
              <ol
                aria-label={t('map.timeline.title')}
                className="flex snap-x gap-3 overflow-x-auto pb-2"
              >
                {events.map((e) => (
                  <li key={e.id}>
                    <TimelineEventCard
                      event={e}
                      dataset={dataset}
                      active={e.id === selectedEventId}
                    />
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      )}
    </section>
  );
}
