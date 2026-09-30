import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { animeWorlds } from '@/data/worlds';
import { useLocaleStore } from '@/store/useLocaleStore';
import { useMapStore, useUiStore } from '@/store';
import { getLocalizedText } from '@/utils/localization';
import { cn } from '@/lib/cn';
import { worldPath } from '@/seo/paths';
import { useSeoLang } from '@/seo/useSeoLang';

interface WorldSwitcherProps {
  currentSlug: string;
}

/**
 * Selettore di universo nell'header: cambia anime senza tornare alla home.
 *
 * Regola di navigazione: scegliere un anime porta SEMPRE alla sua Panoramica
 * (`/{lang}/{world}`), da qualunque sezione ci si trovi (mappa, scheda,
 * indice…): il contesto del mondo precedente non ha senso nel nuovo. Vale solo
 * per questa azione esplicita — i deep link (`/one-piece/map`,
 * `/one-piece/characters/luffy`) restano validi e non vengono reindirizzati.
 *
 * Menu accessibile (pattern WAI-ARIA "menu button"): `aria-haspopup`,
 * `aria-expanded`/`aria-controls`; all'apertura il focus va sul mondo
 * corrente, ↑/↓/Home/End scorrono i mondi disponibili, Esc chiude e riporta il
 * focus sul pulsante, Tab o click fuori chiudono. I mondi "in arrivo" sono
 * visibili ma disabilitati (non focalizzabili).
 *
 * Aspetto: pulsante NEUTRO alto 36px come tab e utility (il blu è riservato
 * alla tab attiva: selettore = contesto, tab = sezione); il menu è ancorato
 * al bordo sinistro del pulsante, largo almeno quanto lui.
 */
export function WorldSwitcher({ currentSlug }: WorldSwitcherProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const lang = useSeoLang();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const current = animeWorlds.find((w) => w.slug === currentSlug);
  const currentTitle = current ? getLocalizedText(current.title, locale) : currentSlug;

  // Cambio anime = nuovo contesto: selezioni, filtri e schede del mondo
  // precedente (id che non esistono nel nuovo) vengono azzerati.
  const choose = (slug: string) => {
    setOpen(false);
    if (slug === currentSlug) return;
    const map = useMapStore.getState();
    map.resetSelections();
    map.resetFilters();
    const ui = useUiStore.getState();
    ui.closeModal();
    ui.closeStory();
  };

  const items = () => [...(menuRef.current?.querySelectorAll<HTMLAnchorElement>('a[role="menuitem"]') ?? [])];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    const id = requestAnimationFrame(() => {
      const list = items();
      (list.find((a) => a.getAttribute('aria-current') === 'page') ?? list[0])?.focus();
    });
    return () => {
      document.removeEventListener('mousedown', onDown);
      cancelAnimationFrame(id);
    };
  }, [open]);

  const onMenuKeyDown = (e: KeyboardEvent) => {
    const list = items();
    const i = list.indexOf(document.activeElement as HTMLAnchorElement);
    const move = (next: number) => {
      e.preventDefault();
      list[(next + list.length) % list.length]?.focus();
    };
    if (e.key === 'ArrowDown') move(i + 1);
    else if (e.key === 'ArrowUp') move(i - 1);
    else if (e.key === 'Home') move(0);
    else if (e.key === 'End') move(list.length - 1);
    else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    } else if (e.key === 'Tab') setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        // Il nome accessibile contiene il testo visibile (WCAG 2.5.3).
        aria-label={`${t('nav.switchWorld')}: ${currentTitle}`}
        className="inline-flex h-9 max-w-[13rem] items-center gap-2 rounded-md border border-ink-700/70 bg-ink-900/60 px-3 text-ink-100 transition hover:border-ink-500/80 hover:bg-ink-800/70 hover:text-white aria-expanded:border-ink-500/80 aria-expanded:bg-ink-800/70"
      >
        <span className="truncate font-display text-[13px] leading-none">
          {currentTitle}
        </span>
        <svg
          aria-hidden
          viewBox="0 0 12 12"
          className={cn('h-3 w-3 shrink-0 text-ink-400 transition-transform', open && 'rotate-180')}
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={t('nav.switchWorld')}
          onKeyDown={onMenuKeyDown}
          className="absolute left-0 top-full z-50 mt-1.5 max-h-[min(70vh,32rem)] w-max min-w-full max-w-[18rem] overflow-y-auto rounded-xl border border-ink-700/80 bg-ink-900 p-1 shadow-pop animate-popIn"
        >
          {animeWorlds.map((w) => {
            const available = w.status === 'available';
            const isCurrent = w.slug === currentSlug;
            const title = getLocalizedText(w.title, locale);
            if (!available) {
              return (
                <span
                  key={w.id}
                  role="menuitem"
                  aria-disabled
                  className="flex h-9 items-center justify-between gap-3 rounded-md px-3 text-sm whitespace-nowrap text-ink-400"
                >
                  {title}
                  <span className="rounded-full bg-ink-800 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-ink-300">
                    {t('nav.comingSoon')}
                  </span>
                </span>
              );
            }
            return (
              <Link
                key={w.id}
                to={worldPath(lang, w)}
                role="menuitem"
                onClick={() => choose(w.slug)}
                aria-current={isCurrent ? 'page' : undefined}
                className={cn(
                  'flex h-9 items-center justify-between gap-3 rounded-md px-3 text-sm whitespace-nowrap transition',
                  isCurrent
                    ? 'bg-ink-800/80 font-medium text-white'
                    : 'text-ink-200 hover:bg-ink-800/60 hover:text-white focus-visible:bg-ink-800/60',
                )}
              >
                {title}
                {isCurrent && (
                  <svg aria-hidden viewBox="0 0 12 12" className="h-3 w-3 shrink-0 text-chakra-300">
                    <path d="M2.5 6.5 5 9l4.5-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
