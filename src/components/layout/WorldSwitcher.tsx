import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { animeWorlds } from '@/data/worlds';
import { cn } from '@/lib/cn';

interface WorldSwitcherProps {
  currentSlug: string;
}

/**
 * Selettore di universo nell'header: cambia anime senza tornare alla home.
 *
 * Disclosure accessibile: `aria-expanded`/`aria-controls`, chiusura con Esc e
 * click-fuori, focus al primo elemento all'apertura. I mondi "coming soon"
 * sono mostrati disabilitati.
 */
export function WorldSwitcher({ currentSlug }: WorldSwitcherProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement>(null);
  const menuId = useId();

  const current = animeWorlds.find((w) => w.slug === currentSlug);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    const id = requestAnimationFrame(() => firstItemRef.current?.focus());
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
      cancelAnimationFrame(id);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={t('nav.switchWorld')}
        className="inline-flex items-center gap-1.5 rounded-md border border-ink-700/70 px-2.5 py-1.5 text-sm text-ink-100 transition hover:border-chakra-500/60 hover:text-white"
      >
        <span className="font-display text-[13px]">{current?.title ?? currentSlug}</span>
        <span aria-hidden className={cn('text-ink-400 transition-transform', open && 'rotate-180')}>
          ▾
        </span>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={t('nav.switchWorld')}
          className="panel absolute left-0 top-full z-50 mt-2 w-48 overflow-hidden p-1 shadow-pop animate-popIn"
        >
          {animeWorlds.map((w, i) => {
            const available = w.status === 'available';
            const isCurrent = w.slug === currentSlug;
            if (!available) {
              return (
                <span
                  key={w.id}
                  role="menuitem"
                  aria-disabled
                  className="flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-ink-400"
                >
                  {w.title}
                  <span className="rounded-full bg-ink-800 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-ink-300">
                    {t('nav.comingSoon')}
                  </span>
                </span>
              );
            }
            return (
              <Link
                key={w.id}
                ref={i === 0 ? firstItemRef : undefined}
                to={`/worlds/${w.slug}`}
                role="menuitem"
                onClick={() => setOpen(false)}
                aria-current={isCurrent ? 'page' : undefined}
                className={cn(
                  'flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition',
                  isCurrent
                    ? 'bg-chakra-500/15 text-chakra-100'
                    : 'text-ink-100 hover:bg-ink-800/70 hover:text-white',
                )}
              >
                {w.title}
                {isCurrent && (
                  <span aria-hidden className="text-chakra-300">
                    ✓
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
