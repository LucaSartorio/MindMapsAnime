import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUiStore, useWorldStore } from '@/store';
import { useReportStore } from '@/store/useReportStore';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getAbilityTerm, getFactionsTerm } from '@/lib/worldConfig';
import { cn } from '@/lib/cn';
import { GlobalSearchDropdown } from '@/components/search/GlobalSearchDropdown';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';

interface NavItem {
  to: string;
  label: string;
}

/**
 * Top navigation bar (i18n-aware).
 */
export function TopNav() {
  const { t } = useTranslation();
  const worldSlug = useWorldStore((s) => s.worldSlug);
  const dataset = useWorldStore((s) => s.dataset);
  const locale = useLocaleStore((s) => s.locale);
  const location = useLocation();
  const isMobileNavOpen = useUiStore((s) => s.isMobileNavOpen);
  const toggleMobileNav = useUiStore((s) => s.toggleMobileNav);
  const openReport = useReportStore((s) => s.open);
  const [searchOpen, setSearchOpen] = useState(false);
  // Stati per l'animazione apertura/chiusura: `mounted` tiene l'elemento nel
  // DOM durante l'uscita, `shown` pilota le classi di transizione.
  const [searchMounted, setSearchMounted] = useState(false);
  const [searchShown, setSearchShown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const inWorld = location.pathname.startsWith('/worlds/') && worldSlug;

  // Chiudi la ricerca quando cambia pagina.
  useEffect(() => {
    setSearchOpen(false);
  }, [location.pathname]);

  // Mount/animate in & out (durata ~150ms; ridotta da prefers-reduced-motion).
  useEffect(() => {
    if (searchOpen) {
      setSearchMounted(true);
      const id = requestAnimationFrame(() => setSearchShown(true));
      return () => cancelAnimationFrame(id);
    }
    setSearchShown(false);
    const id = setTimeout(() => setSearchMounted(false), 160);
    return () => clearTimeout(id);
  }, [searchOpen]);

  // Click fuori dal dropdown di ricerca → chiude.
  useEffect(() => {
    if (!searchOpen) return;
    function onDown(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [searchOpen]);

  // Scorciatoia "/" per aprire la ricerca, Esc per chiuderla (solo nei mondi).
  useEffect(() => {
    if (!inWorld) return;
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (
        e.key === '/' &&
        tag !== 'INPUT' &&
        tag !== 'TEXTAREA' &&
        !e.metaKey &&
        !e.ctrlKey
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [inWorld]);

  const worldItems: NavItem[] = inWorld
    ? [
        { to: `/worlds/${worldSlug}`, label: t('nav.map') },
        {
          to: `/worlds/${worldSlug}/characters`,
          label: t('nav.characters'),
        },
        {
          to: `/worlds/${worldSlug}/clans`,
          label: getFactionsTerm(dataset?.world, locale, t('nav.clansFactions')),
        },
        { to: `/worlds/${worldSlug}/jutsu`, label: getAbilityTerm(dataset?.world, locale) },
        { to: `/worlds/${worldSlug}/arcs`, label: t('nav.arcs') },
      ]
    : [];

  return (
    <header className="sticky top-0 z-30 border-b border-ink-700/60 bg-ink-950/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-2.5 flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-3 shrink-0"
          aria-label={`${t('app.title')} · ${t('nav.home')}`}
        >
          <img
            src="/favicon.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 object-contain"
          />
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="font-display text-base text-ink-100">
              {t('app.title')}
            </span>
            {inWorld && dataset && (
              <span className="font-mono text-[10px] uppercase tracking-widest text-chakra-300">
                · {dataset.world.title}
              </span>
            )}
          </span>
        </Link>

        {/* Nav desktop — flessibile: occupa lo spazio tra logo e cluster destro
            e, se troppo lunga, scorre in orizzontale invece di sovrapporsi
            alla ricerca (che resta a dimensione fissa). */}
        <nav
          className="hidden md:flex items-center gap-1 ml-2 min-w-0 flex-1 overflow-x-auto scrollbar-none"
          aria-label={t('nav.openMobileNav')}
        >
          {worldItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                cn(
                  'px-2.5 py-1.5 rounded-md text-sm whitespace-nowrap transition',
                  isActive
                    ? 'bg-chakra-500/20 text-chakra-100 border border-chakra-500/40'
                    : 'text-ink-200 hover:text-white hover:bg-ink-800/70',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right cluster: search + about + report + language + mobile toggle.
            shrink-0: non si restringe mai → la ricerca non viene mai coperta. */}
        <div className="ml-auto flex items-center gap-2 shrink-0">
          {inWorld && dataset && (
            <div ref={searchRef} className="relative">
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                aria-expanded={searchOpen}
                aria-label={t('search.label', { world: dataset.world.title })}
                title={t('search.kbHint')}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-ink-700/70 text-ink-200 hover:text-white hover:border-chakra-500/60"
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  className="h-[18px] w-[18px]"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>

              {/* Dropdown di ricerca in sovraimpressione, ancorato sotto la lente. */}
              {searchMounted && (
                <div
                  className={cn(
                    'absolute right-0 top-full z-50 mt-2 w-[min(88vw,20rem)] origin-top-right transition duration-150 ease-out',
                    searchShown
                      ? 'opacity-100 scale-100 translate-y-0'
                      : 'pointer-events-none opacity-0 scale-95 -translate-y-1',
                  )}
                >
                  <GlobalSearchDropdown
                    dataset={dataset}
                    autoFocus
                    showKbHint
                    onClose={() => setSearchOpen(false)}
                  />
                </div>
              )}
            </div>
          )}
          <Link
            to="/about"
            className="hidden md:inline-block px-3 py-1.5 rounded-md text-sm text-ink-300 hover:text-white"
          >
            {t('nav.about')}
          </Link>
          <button
            type="button"
            onClick={openReport}
            title={t('nav.reportTitle')}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border border-ink-700/70 text-ink-200 hover:text-white hover:border-chakra-500/60"
          >
            <span aria-hidden>🐛</span>
            {t('nav.report')}
          </button>
          <LanguageSwitcher />
          <button
            type="button"
            onClick={toggleMobileNav}
            aria-expanded={isMobileNavOpen}
            aria-controls="mobile-world-nav"
            aria-label={t('nav.openMobileNav')}
            className="md:hidden h-9 w-9 grid place-items-center rounded-md border border-ink-700/70 text-ink-100"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Menu mobile: voci del mondo (se presente) + About + Segnala. */}
      {isMobileNavOpen && (
        <nav
          id="mobile-world-nav"
          aria-label={t('nav.openMobileNav')}
          className="md:hidden border-t border-ink-700/60 bg-ink-950/95"
        >
          <ul className="px-2 py-2 grid grid-cols-2 gap-1">
            {worldItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end
                  onClick={() => toggleMobileNav()}
                  className={({ isActive }) =>
                    cn(
                      'block px-3 py-2 rounded-md text-sm',
                      isActive
                        ? 'bg-chakra-500/20 text-chakra-100'
                        : 'text-ink-200 hover:text-white hover:bg-ink-800/70',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link
                to="/about"
                onClick={() => toggleMobileNav()}
                className="block px-3 py-2 rounded-md text-sm text-ink-300 hover:text-white hover:bg-ink-800/70"
              >
                {t('nav.about')}
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  toggleMobileNav();
                  openReport();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-sm text-ink-300 hover:text-white hover:bg-ink-800/70"
              >
                🐛 {t('nav.report')}
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
