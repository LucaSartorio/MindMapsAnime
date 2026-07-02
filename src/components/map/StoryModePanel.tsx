import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import { useMapStore, useUiStore } from '@/store';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';
import { findCharacter, findLocation } from '@/lib/entities';

interface StoryModePanelProps {
  dataset: WorldDataset;
}

/** Eventi = testo da leggere → avanzamento più lento del route stepper. */
const PLAY_INTERVAL = 3400;

/**
 * Story Mode guidata: accompagna l'utente evento per evento lungo un arco.
 *
 * A ogni tappa imposta `selectedLocation` (la mappa centra + il focus mode
 * evidenzia il collegato) e mostra una card narrativa. Prev/Next + Play. È un
 * pannello persistente NON modale (niente scrim): la mappa resta esplorabile e
 * fa da "palcoscenico". Esc esce.
 */
export function StoryModePanel({ dataset }: StoryModePanelProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const storyArcId = useUiStore((s) => s.storyArcId);
  const closeStory = useUiStore((s) => s.closeStory);
  const openCharacter = useUiStore((s) => s.openCharacterModal);
  const openLocation = useUiStore((s) => s.openLocationModal);
  const openEvent = useUiStore((s) => s.openEventModal);
  const setActiveMapLevel = useMapStore((s) => s.setActiveMapLevel);
  const setSelectedLocation = useMapStore((s) => s.setSelectedLocation);
  const setSelectedTimelineEvent = useMapStore((s) => s.setSelectedTimelineEvent);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const arc = storyArcId ? dataset.arcs.find((a) => a.id === storyArcId) : undefined;
  const events = useMemo(
    () =>
      arc
        ? dataset.events.filter((e) => e.arcId === arc.id).sort((a, b) => a.order - b.order)
        : [],
    [dataset.events, arc],
  );

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

  // All'apertura / cambio arco: riparte dal primo evento e centra la mappa.
  useEffect(() => {
    setIndex(0);
    setPlaying(false);
    if (events.length > 0) go(0);
    // Vogliamo rieseguire solo quando cambia l'arco in riproduzione.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyArcId]);

  useEffect(() => {
    if (!playing) return;
    if (index >= events.length - 1) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => go(index + 1), PLAY_INTERVAL);
    return () => clearTimeout(id);
  }, [playing, index, go, events.length]);

  useEffect(() => {
    if (!storyArcId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeStory();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [storyArcId, closeStory]);

  if (!storyArcId || !arc) return null;

  const arcName = getLocalizedText(arc.localizedName, locale) || arc.name;
  const ev = events[index];
  const loc = ev ? findLocation(dataset, ev.locationId) : undefined;
  const chars = ev
    ? (ev.characterIds ?? [])
        .map((id) => findCharacter(dataset, id))
        .filter((c): c is NonNullable<typeof c> => !!c)
        .slice(0, 8)
    : [];
  const atStart = index === 0;
  const atEnd = index === events.length - 1;

  return (
    <section
      aria-label={t('map.story.title')}
      className="panel pointer-events-auto fixed z-[55] flex flex-col shadow-pop inset-x-0 bottom-0 max-h-[72vh] rounded-t-2xl border-t animate-slideUp sm:inset-x-auto sm:right-0 sm:top-0 sm:bottom-0 sm:h-full sm:max-h-none sm:w-[22rem] sm:rounded-none sm:rounded-l-2xl sm:border-l sm:border-t-0 sm:animate-slideInRight"
    >
      <header className="flex shrink-0 items-start justify-between gap-3 border-b border-ink-700/60 px-4 py-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-chakra-300">
            {t('map.story.title')}
          </p>
          <h2 className="truncate font-display text-base text-ink-100">{arcName}</h2>
        </div>
        <button
          type="button"
          onClick={closeStory}
          aria-label={t('map.story.close')}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-ink-300 transition hover:bg-ink-800/70 hover:text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </header>

      {events.length === 0 || !ev ? (
        <div className="flex-1 p-4 text-sm text-ink-300">{t('map.story.empty')}</div>
      ) : (
        <div className="flex-1 overflow-auto px-4 py-4" aria-live="polite">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-400">
            #{ev.order} · {getLocalizedText(ev.period, locale)}
          </p>
          <h3 className="mt-1 font-display text-lg leading-tight text-ink-100">
            {getLocalizedText(ev.title, locale)}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-200">
            {getLocalizedText(ev.description, locale)}
          </p>

          {loc && (
            <button
              type="button"
              onClick={() => openLocation(loc.id)}
              className="chip mt-3 hover:border-chakra-500/70 hover:text-white"
            >
              <span aria-hidden className="text-chakra-300">⌖</span>{' '}
              {getLocalizedText(loc.localizedName, locale) || loc.name}
            </button>
          )}
          {!loc && (
            <p className="mt-3 text-[11px] italic text-ink-400">{t('map.story.noLocation')}</p>
          )}

          {chars.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {chars.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => openCharacter(c.id)}
                  className="chip hover:border-chakra-500/70 hover:text-white"
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => openEvent(ev.id)}
            className="mt-4 text-xs text-chakra-300 underline-offset-2 hover:text-chakra-200 hover:underline"
          >
            {t('modals.eventLink')} →
          </button>
        </div>
      )}

      <footer className="shrink-0 space-y-2 border-t border-ink-700/60 px-4 py-3">
        <div
          className="h-1 overflow-hidden rounded-full bg-ink-700/60"
          role="progressbar"
          aria-label={t('map.story.title')}
          aria-valuemin={1}
          aria-valuemax={Math.max(1, events.length)}
          aria-valuenow={index + 1}
        >
          <div
            className="h-full rounded-full bg-chakra-500 transition-all"
            style={{ width: `${((index + 1) / Math.max(1, events.length)) * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="mr-auto tabular-nums text-[11px] text-ink-400">
            {index + 1} / {events.length}
          </span>
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={atStart}
            aria-label={t('map.story.prev')}
            className="grid h-8 w-8 place-items-center rounded-md border border-ink-600/70 text-ink-100 transition hover:bg-ink-800/70 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden>‹</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (atEnd) go(0);
              setPlaying((p) => !p);
            }}
            aria-pressed={playing}
            className="btn-primary !py-1.5 text-xs"
          >
            {playing ? t('map.story.pause') : t('map.story.play')}
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            disabled={atEnd}
            aria-label={t('map.story.next')}
            className="grid h-8 w-8 place-items-center rounded-md border border-ink-600/70 text-ink-100 transition hover:bg-ink-800/70 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden>›</span>
          </button>
        </div>
      </footer>
    </section>
  );
}
