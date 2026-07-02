import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';
import { useMapStore, useUiStore } from '@/store';

/** Icone stroke minimali (24x24), coerenti col resto della UI. */
const IconFilters = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <line x1="4" y1="6" x2="20" y2="6" /><line x1="7" y1="12" x2="17" y2="12" /><line x1="10" y1="18" x2="14" y2="18" />
  </svg>
);
const IconLayers = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
    <path d="M12 3 3 8l9 5 9-5-9-5Z" /><path d="M3 13l9 5 9-5" /><path d="M3 18l9 5 9-5" />
  </svg>
);
const IconLegend = <span aria-hidden className="text-[15px]">⌖</span>;
const IconTimeline = <span aria-hidden className="text-[15px]">⌛</span>;
const IconRoutes = <span aria-hidden className="text-[16px]">↯</span>;
const IconReset = <span aria-hidden className="text-[16px]">⤾</span>;
const IconDeselect = <span aria-hidden className="text-[15px]">⊘</span>;
const IconHelp = <span aria-hidden className="text-[15px] font-semibold">?</span>;

interface Tool {
  key: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  /** Presente solo per i tool che aprono un pannello (stato toggle). */
  active?: boolean;
}

/**
 * Tool rail: home unica e accessibile per gli strumenti mappa.
 * - Desktop: barra verticale flottante a sinistra (icon-only + tooltip/aria).
 * - Mobile: bottom nav con i tool "drawer" (icona + etichetta, target ≥ 44px).
 *
 * Ogni tool che apre un pannello espone `aria-pressed` con lo stato reale (i
 * drawer Filtri/Livelli sono mutuamente esclusivi via lo store).
 */
export function ToolRail() {
  const { t } = useTranslation();
  const isFiltersOpen = useUiStore((s) => s.isFiltersDrawerOpen);
  const toggleFilters = useUiStore((s) => s.toggleFiltersDrawer);
  const isLayersOpen = useUiStore((s) => s.isLayersDrawerOpen);
  const toggleLayers = useUiStore((s) => s.toggleLayersDrawer);
  const isLegendOpen = useUiStore((s) => s.isLegendOpen);
  const toggleLegend = useUiStore((s) => s.toggleLegend);
  const isTimelineOpen = useUiStore((s) => s.isTimelineOpen);
  const toggleTimeline = useUiStore((s) => s.toggleTimeline);
  const isRoutesOpen = useUiStore((s) => s.isRoutesPanelOpen);
  const toggleRoutes = useUiStore((s) => s.toggleRoutesPanel);
  const isHelpOpen = useUiStore((s) => s.isHelpOpen);
  const toggleHelp = useUiStore((s) => s.toggleHelp);
  const resetViewport = useMapStore((s) => s.resetViewport);
  const resetSelections = useMapStore((s) => s.resetSelections);

  const panelTools: Tool[] = [
    { key: 'filters', label: t('map.tools.filters'), icon: IconFilters, onClick: toggleFilters, active: isFiltersOpen },
    { key: 'layers', label: t('map.tools.layers'), icon: IconLayers, onClick: toggleLayers, active: isLayersOpen },
    { key: 'legend', label: t('map.tools.legend'), icon: IconLegend, onClick: toggleLegend, active: isLegendOpen },
    { key: 'timeline', label: t('map.tools.timeline'), icon: IconTimeline, onClick: toggleTimeline, active: isTimelineOpen },
    { key: 'routes', label: t('map.tools.routes'), icon: IconRoutes, onClick: toggleRoutes, active: isRoutesOpen },
  ];
  const actionTools: Tool[] = [
    { key: 'resetView', label: t('map.tools.resetView'), icon: IconReset, onClick: resetViewport },
    { key: 'resetSel', label: t('map.tools.resetSelections'), icon: IconDeselect, onClick: resetSelections },
    { key: 'help', label: t('map.tools.help'), icon: IconHelp, onClick: toggleHelp, active: isHelpOpen },
  ];

  return (
    <>
      {/* Desktop: rail verticale a sinistra, centrata */}
      <nav
        aria-label={t('map.tools.rail')}
        className="pointer-events-auto absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 md:block"
      >
        <div className="panel flex flex-col gap-1 p-1 shadow-panel">
          {panelTools.map((tool) => (
            <RailButton key={tool.key} tool={tool} />
          ))}
          <hr className="my-1 border-ink-700/60" />
          {actionTools.map((tool) => (
            <RailButton key={tool.key} tool={tool} />
          ))}
        </div>
      </nav>

      {/* Mobile: bottom nav con i tool "drawer" (icona + etichetta) */}
      <nav
        aria-label={t('map.tools.rail')}
        className="pointer-events-auto fixed inset-x-0 bottom-2 z-30 flex justify-center md:hidden"
      >
        <div className="panel flex items-center gap-1 rounded-2xl p-1 shadow-panel">
          {[panelTools[0], panelTools[1], actionTools[0], actionTools[2]].map((tool) => (
            <button
              key={tool.key}
              type="button"
              onClick={tool.onClick}
              aria-label={tool.label}
              {...(tool.active !== undefined ? { 'aria-pressed': tool.active } : {})}
              className={cn(
                'flex h-14 min-w-[4rem] flex-col items-center justify-center gap-0.5 rounded-xl px-2 transition',
                tool.active
                  ? 'bg-chakra-500/25 text-chakra-100'
                  : 'text-ink-200 hover:bg-ink-800/70 hover:text-white',
              )}
            >
              <span className="grid h-5 place-items-center">{tool.icon}</span>
              <span className="text-[10px] font-medium">{tool.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}

function RailButton({ tool }: { tool: Tool }) {
  return (
    <button
      type="button"
      onClick={tool.onClick}
      title={tool.label}
      aria-label={tool.label}
      {...(tool.active !== undefined ? { 'aria-pressed': tool.active } : {})}
      className={cn(
        'grid h-11 w-11 place-items-center rounded-lg transition',
        tool.active
          ? 'bg-chakra-500/25 text-chakra-100 ring-1 ring-chakra-400/50'
          : 'text-ink-200 hover:bg-ink-800/70 hover:text-white',
      )}
    >
      {tool.icon}
    </button>
  );
}
