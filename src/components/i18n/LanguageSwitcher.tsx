import { useEffect, useRef, useState, type ComponentType, type SVGProps } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocaleStore } from '@/store/useLocaleStore';
import type { SupportedLocale } from '@/types/i18n';
import { cn } from '@/lib/cn';
import { ItalyFlag, UkFlag } from './Flags';

interface LocaleOption {
  code: SupportedLocale;
  Flag: ComponentType<SVGProps<SVGSVGElement>>;
  short: string;
  label: string;
}

/** Bandiera SVG con contenitore arrotondato (resa identica su ogni OS). */
function Flag({ as: FlagSvg }: { as: ComponentType<SVGProps<SVGSVGElement>> }) {
  return (
    <span className="inline-block h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] ring-1 ring-white/15">
      <FlagSvg className="h-full w-full" />
    </span>
  );
}

/**
 * Selettore lingua per la TopNav.
 *
 * - bandiera + codice lingua (IT/EN) sul bottone
 * - dropdown con etichetta completa
 * - cambia lingua tramite store (sincronizza i18next + localStorage)
 * - accessibile: aria-label, ESC chiude, click fuori chiude, focus ring
 */
export function LanguageSwitcher() {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const options: LocaleOption[] = [
    {
      code: 'it',
      Flag: ItalyFlag,
      short: 'IT',
      label: t('languageSwitcher.italian'),
    },
    {
      code: 'en',
      Flag: UkFlag,
      short: 'EN',
      label: t('languageSwitcher.english'),
    },
  ];

  const current = options.find((o) => o.code === locale) ?? options[0];

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  function handleSelect(code: SupportedLocale) {
    setLocale(code);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('languageSwitcher.label')}
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm',
          'border border-ink-700/70 bg-ink-900/60 text-ink-100',
          'hover:bg-ink-800/80 hover:border-chakra-500/40 transition',
          'focus-visible:ring-2 focus-visible:ring-chakra-400',
        )}
      >
        <Flag as={current.Flag} />
        <span className="font-mono text-[11px] tracking-widest">
          {current.short}
        </span>
        <span aria-hidden className="text-ink-400 text-xs">
          ▾
        </span>
      </button>
      {open && (
        // role=listbox con figli role=option DIRETTI (niente <ul>/<li> che
        // romperebbero la relazione ARIA richiesta).
        <div
          role="listbox"
          aria-label={t('languageSwitcher.label')}
          className="absolute right-0 z-50 mt-1.5 min-w-[160px] panel overflow-hidden"
        >
          {options.map((o) => {
            const selected = o.code === locale;
            return (
              <button
                key={o.code}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => handleSelect(o.code)}
                className={cn(
                  'w-full text-left flex items-center gap-2 px-3 py-2 text-sm',
                  selected
                    ? 'bg-chakra-500/15 text-chakra-100'
                    : 'text-ink-200 hover:bg-ink-800/70',
                )}
              >
                <Flag as={o.Flag} />
                <span className="flex-1">{o.label}</span>
                <span className="font-mono text-[10px] tracking-widest text-ink-400">
                  {o.short}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
