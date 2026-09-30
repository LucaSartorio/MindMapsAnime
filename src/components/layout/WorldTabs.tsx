import { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';
import { worldTabsCss } from '@/lib/navOverflow';

export interface WorldTab {
  key: string;
  to: string;
  label: string;
}

interface WorldTabsProps {
  tabs: WorldTab[];
  /** Chiave della tab attiva (derivata dalla route), `null` se nessuna. */
  activeKey: string | null;
}

/**
 * Tab di navigazione del mondo nell'header desktop (zona CENTRALE).
 *
 * Tutte le tab sono link reali (crawlabili). Quando lo spazio non basta, le
 * ultime confluiscono nel menu "Altro": la decisione la prende il CSS
 * (`@container worldtabs`, regole generate da `worldTabsCss`), mai una misura
 * del DOM — quindi niente layout shift e markup identico in SSR e idratazione.
 * Il menu è una disclosure (`aria-expanded`/`aria-controls`): Esc lo chiude e
 * riporta il focus sul pulsante, click fuori lo chiude.
 */
export function WorldTabs({ tabs, activeKey }: WorldTabsProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const activeIndex = tabs.findIndex((tab) => tab.key === activeKey);
  const moreLabel = t('nav.more');
  const css = worldTabsCss(
    tabs.map((tab) => tab.label),
    moreLabel,
    activeIndex,
  );

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <nav className="world-tabs hidden min-w-0 flex-1 md:flex" aria-label={t('nav.worldSections')}>
      {/* Regole di overflow calcolate dalle etichette (solo numeri e classi fisse). */}
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <ul className="world-tabs__list -my-1 flex min-w-0 flex-initial items-center gap-0.5 overflow-hidden py-1">
        {tabs.map((tab, i) => {
          const active = tab.key === activeKey;
          return (
            <li key={tab.key} className={cn('shrink-0', `wt-i-${i}`)}>
              <Link
                to={tab.to}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'world-tab block rounded-md border py-1.5 text-sm whitespace-nowrap transition',
                  active
                    ? 'border-chakra-500/40 bg-chakra-500/20 text-chakra-100'
                    : 'border-transparent text-ink-200 hover:bg-ink-800/70 hover:text-white',
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div ref={wrapRef} className="relative ml-0.5 shrink-0 self-center">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={menuId}
          className="wt-more world-tab relative items-center gap-1 rounded-md border border-transparent py-1.5 text-sm whitespace-nowrap text-ink-200 transition hover:bg-ink-800/70 hover:text-white"
        >
          {/* Indicatore "la sezione attiva è qui dentro" (mostrato dal CSS). */}
          <span
            aria-hidden
            className="wt-more-current pointer-events-none absolute inset-0 rounded-md border border-chakra-500/40 bg-chakra-500/20"
          />
          <span className="relative">{moreLabel}</span>
          <svg
            aria-hidden
            viewBox="0 0 12 12"
            className={cn('relative h-3 w-3 text-ink-400 transition-transform', open && 'rotate-180')}
          >
            <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <ul
          id={menuId}
          hidden={!open}
          className="panel absolute right-0 top-full z-50 mt-2 min-w-[12rem] p-1 shadow-pop animate-popIn"
        >
          {tabs.map((tab, i) => {
            const active = tab.key === activeKey;
            return (
              <li key={tab.key} className={`wt-m wt-m-${i}`}>
                <Link
                  to={tab.to}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'block rounded-md px-3 py-2 text-sm whitespace-nowrap transition',
                    active ? 'bg-chakra-500/15 text-chakra-100' : 'text-ink-100 hover:bg-ink-800/70 hover:text-white',
                  )}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
