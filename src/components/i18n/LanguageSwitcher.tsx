import { useEffect, useRef, useState, type ComponentType, type SVGProps } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { seoLocaleFor } from '@/seo/config';
import { langFromPath, swapLangInPath, worldOfPath } from '@/seo/paths';
import { useLocaleStore } from '@/store/useLocaleStore';
import { LOCALE_META, SUPPORTED_LOCALES, type SupportedLocale } from '@/types/i18n';
import { cn } from '@/lib/cn';
import {
  FranceFlag,
  GermanyFlag,
  ItalyFlag,
  JapanFlag,
  SpainFlag,
  UkFlag,
} from './Flags';

type FlagComponent = ComponentType<SVGProps<SVGSVGElement>>;

/** Bandiera per lingua. Aggiungere una lingua = aggiungere qui la sua bandiera. */
const LOCALE_FLAG: Record<SupportedLocale, FlagComponent> = {
  it: ItalyFlag,
  en: UkFlag,
  ja: JapanFlag,
  fr: FranceFlag,
  de: GermanyFlag,
  es: SpainFlag,
};

/** Chiave i18n dell'etichetta (il testo è l'endonimo, uguale in ogni lingua). */
const LOCALE_LABEL_KEY: Record<SupportedLocale, string> = {
  it: 'languageSwitcher.italian',
  en: 'languageSwitcher.english',
  ja: 'languageSwitcher.japanese',
  fr: 'languageSwitcher.french',
  de: 'languageSwitcher.german',
  es: 'languageSwitcher.spanish',
};

/** Bandiera SVG con contenitore arrotondato (resa identica su ogni OS). */
function Flag({ as: FlagSvg }: { as: FlagComponent }) {
  return (
    <span className="inline-block h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] ring-1 ring-white/15">
      <FlagSvg className="h-full w-full" />
    </span>
  );
}

/**
 * Selettore lingua per la TopNav.
 *
 * - bandiera + codice lingua (IT/EN/JA/FR/DE/ES) sul bottone
 * - dropdown con etichetta completa, generato da `SUPPORTED_LOCALES`: una
 *   nuova lingua compare automaticamente qui
 * - cambia lingua tramite store (sincronizza i18next + localStorage)
 * - accessibile: aria-label, ESC chiude, click fuori chiude, focus ring
 */
export function LanguageSwitcher() {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const options = SUPPORTED_LOCALES.map((code) => ({
    code,
    Flag: LOCALE_FLAG[code],
    short: LOCALE_META[code].short,
    label: t(LOCALE_LABEL_KEY[code]),
  }));

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
    // La lingua dei CONTENUTI è nell'URL (/it · /en · /es): se la lingua scelta
    // corrisponde a un altro prefisso PER QUESTA PAGINA (lo spagnolo solo sui
    // mondi tradotti), passa alla stessa pagina in quella lingua (è anche la
    // sua alternativa hreflang). Query e hash conservati.
    const target = seoLocaleFor(code, worldOfPath(location.pathname));
    const current = langFromPath(location.pathname);
    if (current && current !== target) {
      navigate(`${swapLangInPath(location.pathname, target)}${location.search}${location.hash}`);
    }
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
          'inline-flex h-9 items-center gap-1.5 px-2.5 rounded-md text-sm',
          'border border-ink-700/70 bg-ink-900/60 text-ink-100',
          'hover:bg-ink-800/80 hover:border-chakra-500/40 transition',
          'focus-visible:ring-2 focus-visible:ring-chakra-400',
        )}
      >
        <Flag as={current.Flag} />
        <span className="font-mono text-[11px] tracking-widest">
          {current.short}
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
        // role=listbox con figli role=option DIRETTI (niente <ul>/<li> che
        // romperebbero la relazione ARIA richiesta). La lista scrolla quando
        // le lingue non entrano nel viewport (es. mobile in orizzontale).
        <div
          role="listbox"
          aria-label={t('languageSwitcher.label')}
          className="absolute right-0 z-50 mt-1.5 min-w-[160px] max-h-[60vh] overflow-y-auto panel"
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
