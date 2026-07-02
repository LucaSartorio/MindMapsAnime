import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Route, WorldDataset } from '@/types';
import { useMapStore } from '@/store';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';
import { findLocation } from '@/lib/entities';

interface RouteStepperProps {
  dataset: WorldDataset;
  routeId: string;
  /** Tappe già ordinate per `order`. */
  steps: Route['steps'];
}

/** Intervallo (ms) tra una tappa e l'altra in modalità "Play". */
const PLAY_INTERVAL = 1600;

/**
 * "Segui il percorso": stepper che fa camminare la mappa tappa per tappa lungo
 * una rotta. Prev/Next e un Play che avanza da solo fino all'ultima tappa.
 *
 * Non centra la mappa direttamente (è fuori dal ReactFlowProvider): imposta la
 * selezione nello store (`setSelectedRoute` + `setSelectedLocation`), e il
 * canvas reagisce centrando/evidenziando la tappa corrente. Così l'esperienza
 * è quella di seguire il viaggio del personaggio.
 */
export function RouteStepper({ dataset, routeId, steps }: RouteStepperProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const setSelectedRoute = useMapStore((s) => s.setSelectedRoute);
  const setSelectedLocation = useMapStore((s) => s.setSelectedLocation);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const go = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(i, steps.length - 1));
      setIndex(clamped);
      setSelectedRoute(routeId);
      const loc = findLocation(dataset, steps[clamped]?.locationId);
      if (loc) setSelectedLocation(loc.id);
    },
    [dataset, routeId, steps, setSelectedRoute, setSelectedLocation],
  );

  // All'apertura: assicura che la rotta sia disegnata e centra sulla prima tappa.
  useEffect(() => {
    go(0);
  }, [go]);

  // Play: avanza da solo, si ferma all'ultima tappa.
  useEffect(() => {
    if (!playing) return;
    if (index >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => go(index + 1), PLAY_INTERVAL);
    return () => clearTimeout(id);
  }, [playing, index, go, steps.length]);

  if (steps.length === 0) return null;

  const current = steps[index];
  const currentLoc = findLocation(dataset, current.locationId);
  const currentName =
    getLocalizedText(current.title ?? current.label, locale) ||
    (currentLoc ? getLocalizedText(currentLoc.localizedName, locale) || currentLoc.name : '');
  const atStart = index === 0;
  const atEnd = index === steps.length - 1;

  return (
    <div className="panel-soft space-y-2 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-chakra-300">
          {t('modals.stepperTitle')}
        </span>
        <span className="tabular-nums text-[11px] text-ink-400">
          {index + 1} / {steps.length}
        </span>
      </div>

      <p className="truncate text-sm text-ink-100">
        <span className="mr-1.5 font-mono text-[11px] text-ink-500">#{current.order}</span>
        {currentName}
      </p>

      <div
        className="h-1 overflow-hidden rounded-full bg-ink-700/60"
        role="progressbar"
        aria-label={t('modals.stepperTitle')}
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-valuenow={index + 1}
      >
        <div
          className="h-full rounded-full bg-chakra-500 transition-all"
          style={{ width: `${((index + 1) / steps.length) * 100}%` }}
        />
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={atStart}
          aria-label={t('modals.stepperPrev')}
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
          className="btn-primary flex-1 !py-1.5 text-xs"
        >
          {playing ? t('modals.stepperPause') : t('modals.stepperPlay')}
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={atEnd}
          aria-label={t('modals.stepperNext')}
          className="grid h-8 w-8 place-items-center rounded-md border border-ink-600/70 text-ink-100 transition hover:bg-ink-800/70 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span aria-hidden>›</span>
        </button>
      </div>
    </div>
  );
}
