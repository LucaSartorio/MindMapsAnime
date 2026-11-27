import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import type { EntityRef } from '@/lib/graph';
import { findCharacter, findLocation } from '@/lib/entities';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getEntityDisplayName, getLocalizedText } from '@/utils/localization';
import type { HotspotDef, QualityLevel, QualityPreference, SceneManifest, ZoneDef } from '../types';
import { SCENE_LOADERS } from '../launcher/loaders';
import { ExplorerSession, type ExplorerMode } from '../engine/ExplorerSession';
import { VirtualJoystick } from './VirtualJoystick';

declare const __EXPLORER_3D_PROTOTYPES__: boolean;

const QUALITY_KEY = 'animapverse:explorer3d:quality';
const PREFS: QualityPreference[] = ['auto', 'low', 'medium', 'high'];

function readPreference(): QualityPreference {
  try {
    const v = window.localStorage.getItem(QUALITY_KEY) as QualityPreference | null;
    return v && PREFS.includes(v) ? v : 'auto';
  } catch {
    return 'auto';
  }
}
function writePreference(p: QualityPreference): void {
  try {
    window.localStorage.setItem(QUALITY_KEY, p);
  } catch {
    /* storage blocked: preference lasts for this session only */
  }
}

interface ViewerProps {
  dataset: WorldDataset;
  manifest: SceneManifest;
  onExit: () => void;
  onOpenEntity: (ref: EntityRef) => void;
}

type Status = 'loading' | 'ready' | 'error' | 'contextLost';

function entityLabel(dataset: WorldDataset, h: HotspotDef, locale: ReturnType<typeof useLocaleStore.getState>['locale']): string {
  const { type, id } = h.entity;
  switch (type) {
    case 'character': {
      const c = findCharacter(dataset, id);
      return c ? getEntityDisplayName(c, locale) : id;
    }
    case 'event': {
      const e = dataset.events.find((x) => x.id === id);
      return e ? getLocalizedText(e.title, locale) : id;
    }
    case 'arc': {
      const a = dataset.arcs.find((x) => x.id === id);
      return a ? getEntityDisplayName(a, locale) : id;
    }
    case 'place': {
      const l = findLocation(dataset, id);
      return l ? getEntityDisplayName(l, locale) : id;
    }
    case 'faction': {
      const f = dataset.factions.find((x) => x.id === id);
      return f ? getEntityDisplayName(f, locale) : id;
    }
    default:
      return id;
  }
}

/**
 * Full-screen 3D viewer (lives in the lazy 3D chunk). React renders the controls and reacts to session EVENTS only;
 * the frame loop never goes through React. Unmount = `session.dispose()`: loop stopped, listeners removed, GPU
 * resources released, WebGL context lost on purpose, canvas removed.
 */
export function Explorer3DViewer({ dataset, manifest, onExit, onOpenEntity }: ViewerProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const host = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const session = useRef<ExplorerSession | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<Status>('loading');
  const [mode, setModeState] = useState<ExplorerMode>('observe');
  const [preference, setPreference] = useState<QualityPreference>(() => readPreference());
  const [level, setLevel] = useState<QualityLevel | null>(null);
  const [struggling, setStruggling] = useState(false);
  const [zone, setZone] = useState<ZoneDef | null>(null);
  const [locked, setLocked] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [definition, setDefinition] = useState<{ hotspots: HotspotDef[]; zones: ZoneDef[] } | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const coarse = useMemo(() => window.matchMedia?.('(pointer: coarse)').matches ?? false, []);
  const reducedMotion = useMemo(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false, []);
  const location = findLocation(dataset, manifest.locationId);
  const locationName = location ? getEntityDisplayName(location, locale) : manifest.locationId;
  const preferenceRef = useRef(preference);
  preferenceRef.current = preference;

  // Session lifecycle: load the scene chunk, build, dispose on unmount (or retry after a context loss).
  useEffect(() => {
    let cancelled = false;
    const el = host.current;
    const loader = SCENE_LOADERS[manifest.id];
    if (!el || !loader) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    const tLoad = performance.now();
    loader()
      .then((module) => {
        if (cancelled) return;
        const s = new ExplorerSession(el, module, {
          preference: preferenceRef.current,
          reducedMotion,
          locationName,
          events: {
            onZoneChange: setZone,
            onModeChange: setModeState,
            onPointerLockChange: setLocked,
            onQualityChange: (l, slow) => {
              setLevel(l);
              setStruggling(slow);
            },
            onSelect: setSelected,
            onContextLost: () => setStatus('contextLost'),
          },
        });
        session.current = s;
        s.view.canvas.setAttribute('role', 'application');
        s.view.canvas.setAttribute('aria-label', t('explorer3d.canvasLabel', { name: locationName }));
        s.view.canvas.setAttribute('aria-describedby', 'explorer3d-help');
        setLevel(s.level);
        setDefinition({ hotspots: module.definition.hotspots, zones: module.definition.zones });
        setStatus('ready');
        if (__EXPLORER_3D_PROTOTYPES__) {
          const open = performance.getEntriesByName('explorer3d:open').pop();
          (window as unknown as { __explorer3d?: unknown }).__explorer3d = {
            stats: () => s.stats(),
            timings: { ...s.timings, sceneChunkMs: Math.round(performance.now() - tLoad), sinceClickMs: open ? Math.round(performance.now() - open.startTime) : null },
            session: s,
          };
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
      session.current?.dispose();
      session.current = null;
      if (__EXPLORER_3D_PROTOTYPES__) delete (window as unknown as { __explorer3d?: unknown }).__explorer3d;
    };
    // locationName, reducedMotion and t are read once per session on purpose.
  }, [manifest.id, attempt]);

  // Focus the dialog on open; Esc leaves (unless the browser is using it to release the pointer lock).
  useEffect(() => {
    dialog.current?.focus();
  }, []);
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape' && !locked) {
        e.preventDefault();
        onExit();
        return;
      }
      if (e.key === 'Tab' && dialog.current) {
        const items = [...dialog.current.querySelectorAll<HTMLElement>('button:not([disabled]), select, [tabindex="0"]')].filter((x) => x.offsetParent !== null || x === document.activeElement);
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
      const s = session.current;
      if (s && mode === 'observe' && (e.target as HTMLElement).dataset?.explorer3d === 'canvas') {
        const step = 0.12;
        const map: Record<string, () => void> = {
          ArrowLeft: () => s.orbitNudge(step, 0),
          ArrowRight: () => s.orbitNudge(-step, 0),
          ArrowUp: () => s.orbitNudge(0, -step),
          ArrowDown: () => s.orbitNudge(0, step),
          '+': () => s.orbitNudge(0, 0, 0.88),
          '=': () => s.orbitNudge(0, 0, 0.88),
          '-': () => s.orbitNudge(0, 0, 1.14),
        };
        const fn = map[e.key];
        if (fn) {
          e.preventDefault();
          fn();
        }
      }
    },
    [locked, mode, onExit],
  );

  const setMode = (m: ExplorerMode) => session.current?.setMode(m);
  const changeQuality = (p: QualityPreference) => {
    setPreference(p);
    writePreference(p);
    session.current?.setQualityPreference(p);
  };
  const focusHotspot = (id: string) => {
    const s = session.current;
    if (!s) return;
    s.focusHotspot(id);
    setPanelOpen(false);
  };

  const hotspots = definition?.hotspots ?? [];
  const selectedHotspot = hotspots.find((h) => h.id === selected) ?? null;
  const zoneLabel = zone && zone.kind !== 'exterior' ? t(`explorer3d.zoneKinds.${zone.kind}`) : null;
  const help = mode === 'observe' ? t('explorer3d.help.observe') : coarse ? t('explorer3d.help.touch') : t('explorer3d.help.desktop');
  const levelLabel = level ? t(`explorer3d.quality.${level}`) : '';

  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={t('explorer3d.dialogLabel', { name: locationName })}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      data-explorer3d="viewer"
      data-status={status}
      data-mode={mode}
      className="fixed inset-0 z-[70] bg-ink-950 text-ink-100 outline-none"
    >
      <div ref={host} className="absolute inset-0" />

      {/* Top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="pointer-events-auto rounded-lg bg-ink-900/90 px-3 py-2 shadow">
          <h2 className="font-display text-sm uppercase tracking-widest text-white">{locationName}</h2>
          <p className="mt-0.5 text-[11px] text-ink-200">
            {manifest.status === 'prototype' && <span className="mr-1.5 rounded bg-ember-700 px-1 uppercase text-white">{t('explorer3d.prototypeBadge')}</span>}
            {t('explorer3d.sourceNote')}
          </p>
          {zoneLabel && (
            <p className="mt-1 text-xs text-ink-100" aria-live="polite">
              <span className="text-ink-300">{t('explorer3d.zone')}:</span> {zoneLabel}
              {zone?.reconstruction === 'interpretive' && (
                <span className="ml-1.5 rounded border border-yellow-500/60 px-1 text-[10px] text-yellow-200">{t('explorer3d.interpretive')}</span>
              )}
            </p>
          )}
        </div>
        <button type="button" className="btn-primary pointer-events-auto" onClick={onExit} data-explorer3d="close">
          <span aria-hidden className="mr-1">✕</span>
          {t('explorer3d.close')}
        </button>
      </div>

      {/* Status overlays */}
      {status === 'loading' && (
        <div role="status" className="absolute inset-0 flex items-center justify-center">
          <p className="rounded-lg bg-ink-900/90 px-4 py-3 text-sm">{t('explorer3d.building')}</p>
        </div>
      )}
      {(status === 'error' || status === 'contextLost') && (
        <div role="alert" className="absolute inset-0 flex items-center justify-center p-4">
          <div className="max-w-sm rounded-lg bg-ink-900/95 p-4 text-center text-sm">
            <p>{status === 'error' ? t('explorer3d.errors.load') : t('explorer3d.errors.contextLost')}</p>
            <div className="mt-3 flex justify-center gap-2">
              <button type="button" className="btn-primary" onClick={() => setAttempt((a) => a + 1)}>
                {t('explorer3d.errors.retry')}
              </button>
              <button type="button" className="btn-ghost" onClick={onExit}>
                {t('explorer3d.close')}
              </button>
            </div>
          </div>
        </div>
      )}
      {locked && <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/90" />}

      {status === 'ready' && (
        <>
          {/* Toolbar */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:flex-row md:items-end md:justify-between">
            <div className="pointer-events-auto flex flex-wrap items-center gap-2 rounded-lg bg-ink-900/90 p-2 shadow" role="toolbar" aria-label={t('explorer3d.toolbar')}>
              <div role="group" aria-label={t('explorer3d.modeGroup')} className="flex gap-1">
                {(['observe', 'explore'] as const).map((m) => (
                  <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={mode === m ? 'btn-primary' : 'btn-ghost'} data-explorer3d={`mode-${m}`}>
                    {t(`explorer3d.mode.${m}`)}
                  </button>
                ))}
              </div>
              <button type="button" className="btn-ghost" onClick={() => session.current?.resetView()} data-explorer3d="reset">
                {mode === 'observe' ? t('explorer3d.resetView') : t('explorer3d.resetPosition')}
              </button>
              <label className="flex items-center gap-1.5 text-xs text-ink-200">
                <span>{t('explorer3d.quality.label')}</span>
                <select className="field py-1 text-xs" value={preference} onChange={(e) => changeQuality(e.target.value as QualityPreference)} data-explorer3d="quality">
                  {PREFS.map((p) => (
                    <option key={p} value={p}>
                      {p === 'auto' ? t('explorer3d.quality.autoActive', { level: levelLabel }) : t(`explorer3d.quality.${p}`)}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" className="btn-ghost md:hidden" aria-expanded={panelOpen} aria-controls="explorer3d-hotspots" onClick={() => setPanelOpen((o) => !o)}>
                {t('explorer3d.hotspots')} <span className="count-badge">{hotspots.length}</span>
              </button>
            </div>
            {mode === 'explore' && coarse && (
              <div className="pointer-events-auto self-start md:order-first">
                <VirtualJoystick label={t('explorer3d.joystick')} onChange={(x, y) => session.current?.setJoystick(x, y)} />
              </div>
            )}
          </div>

          {/* Hotspot list: the accessible, non-WebGL path to the same content */}
          <aside
            id="explorer3d-hotspots"
            aria-label={t('explorer3d.hotspots')}
            className={`absolute right-3 top-28 max-h-[55vh] w-72 overflow-y-auto rounded-lg bg-ink-900/90 p-3 shadow max-md:inset-x-3 max-md:top-auto max-md:bottom-28 max-md:w-auto ${panelOpen ? '' : 'max-md:hidden'}`}
          >
            <h3 className="mb-2 font-display text-[11px] uppercase tracking-widest text-chakra-300">{t('explorer3d.hotspots')}</h3>
            <ul className="space-y-1">
              {hotspots.map((h) => (
                <li key={h.id}>
                  <button
                    type="button"
                    aria-pressed={selected === h.id}
                    onClick={() => focusHotspot(h.id)}
                    className={`w-full rounded px-2 py-1.5 text-left text-sm hover:bg-ink-800 ${selected === h.id ? 'bg-ink-800 text-white' : 'text-ink-100'}`}
                    data-explorer3d={`hotspot-${h.id}`}
                  >
                    <span className="block text-[10px] uppercase tracking-wide text-ink-300">{t(`explorer3d.entityTypes.${h.entity.type}`)}</span>
                    {entityLabel(dataset, h, locale)}
                  </button>
                </li>
              ))}
            </ul>
            {selectedHotspot && (
              <div className="mt-3 border-t border-ink-700 pt-3">
                <p className="text-sm text-white">{entityLabel(dataset, selectedHotspot, locale)}</p>
                <button type="button" className="btn-ember mt-2 w-full" onClick={() => onOpenEntity(selectedHotspot.entity)} data-explorer3d="open-entity">
                  {t('explorer3d.openEntity')}
                </button>
              </div>
            )}
          </aside>

          <p id="explorer3d-help" className="pointer-events-none absolute inset-x-0 bottom-[max(5.5rem,calc(env(safe-area-inset-bottom)+5rem))] mx-auto w-fit max-w-[92vw] rounded bg-ink-900/80 px-3 py-1 text-center text-xs text-ink-200 max-md:hidden">
            {mode === 'explore' && !coarse && !locked ? `${help} ${t('explorer3d.help.lockHint')}` : help}
          </p>
          {struggling && (
            <p role="status" className="absolute left-1/2 top-24 -translate-x-1/2 rounded bg-yellow-900/90 px-3 py-1.5 text-xs text-yellow-100">
              {t('explorer3d.errors.slow')}
            </p>
          )}
        </>
      )}
    </div>
  );
}
