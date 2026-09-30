import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUiStore, useWorldStore } from '@/store';
import { useReportStore } from '@/store/useReportStore';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';
import { getAbilityTerm, getFactionsTerm } from '@/lib/worldConfig';
import { cn } from '@/lib/cn';
import { GlobalSearchDropdown } from '@/components/search/GlobalSearchDropdown';
import { WorldSwitcher } from '@/components/layout/WorldSwitcher';
import { WorldTabs, type WorldTab } from '@/components/layout/WorldTabs';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { useSeoLang } from '@/seo/useSeoLang';
import { categoryPath, homePath, langFromPath, mapPath, parseSeoPath, staticPagePath, worldPath } from '@/seo/paths';
import { worldHasCategory } from '@/seo/metadata';

type ParsedPath = ReturnType<typeof parseSeoPath>;

/**
 * Tab attiva derivata dalla ROUTE (non dal prefisso dell'URL): la landing
 * accende Panoramica, `/map` Mappa, un indice e tutte le sue schede la tab
 * della categoria (`/characters/*` → Personaggi). Le regioni sono luoghi; la
 * timeline non ha una tab propria.
 */
export function activeWorldTabKey(parsed: ParsedPath): string | null {
  switch (parsed.kind) {
    case 'world':
      return 'overview';
    case 'map':
      return 'map';
    case 'category':
    case 'entity':
      return parsed.category === 'regions' ? 'locations' : parsed.category;
    default:
      return null;
  }
}

const iconClass =
  'inline-flex h-9 w-9 items-center justify-center rounded-md border border-ink-700/70 text-ink-200 transition hover:border-chakra-500/60 hover:text-white';

/**
 * Header a 3 zone:
 *  - SINISTRA (non si restringe): logo + selettore dell'anime;
 *  - CENTRO (`min-width: 0`, flessibile): tab del mondo (`WorldTabs`), che
 *    riducono padding e poi usano "Altro" solo quando lo spazio manca davvero;
 *  - DESTRA (non si restringe): ricerca compatta (icona → popup), info,
 *    segnalazione, lingua, menu mobile.
 * Le zone non si sovrappongono mai: nessuna tab può finire sotto la ricerca.
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

  const lang = useSeoLang();
  const parsed = parseSeoPath(location.pathname);
  const inWorld =
    'world' in parsed &&
    !!dataset &&
    parsed.world.slug === worldSlug &&
    !!langFromPath(location.pathname);

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
      // ⌘K / Ctrl+K: apre la ricerca da qualsiasi punto del mondo (funziona
      // anche mentre si è dentro un input, come nei palette da tastiera).
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [inWorld]);

  // Navigazione del mondo: link HTML reali (crawlabili) verso landing, mappa e
  // indici — solo le categorie che il mondo possiede davvero.
  const worldItems: WorldTab[] =
    inWorld && dataset
      ? [
          { key: 'overview', to: worldPath(lang, dataset), label: t('nav.overview') },
          { key: 'map', to: mapPath(lang, dataset), label: t('nav.map') },
          { key: 'characters', to: categoryPath(lang, dataset, 'characters'), label: t('nav.characters') },
          { key: 'locations', to: categoryPath(lang, dataset, 'locations'), label: t('nav.locations') },
          {
            key: 'factions',
            to: categoryPath(lang, dataset, 'factions'),
            label: getFactionsTerm(dataset.world, locale, t('nav.clansFactions')),
          },
          ...(worldHasCategory(dataset, 'abilities')
            ? [{ key: 'abilities', to: categoryPath(lang, dataset, 'abilities'), label: getAbilityTerm(dataset.world, locale) }]
            : []),
          { key: 'arcs', to: categoryPath(lang, dataset, 'arcs'), label: t('nav.arcs') },
          ...(worldHasCategory(dataset, 'journeys')
            ? [{ key: 'journeys', to: categoryPath(lang, dataset, 'journeys'), label: t('nav.journeys') }]
            : []),
        ]
      : [];
  const activeKey = inWorld ? activeWorldTabKey(parsed) : null;

  return (
    <header className="sticky top-0 z-30 border-b border-ink-700/60 bg-ink-950/85 backdrop-blur-md">
      <div className="topnav-bar mx-auto flex w-full max-w-[1920px] items-center py-2.5">
        {/* SINISTRA: logo + selettore universo (mai compressi). */}
        <div className="flex shrink-0 items-center gap-[var(--hdr-gap)]">
          <Link
            to={homePath(lang)}
            className="flex shrink-0 items-center gap-3"
            aria-label={`${t('app.title')} · ${t('nav.home')}`}
          >
            <img
              src="/favicon.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 object-contain"
            />
            {/* Wordmark: nascosto su tablet (md–lg) per lasciare spazio alle tab. */}
            <span className={cn('hidden flex-col leading-tight sm:flex', inWorld && 'md:hidden lg:flex')}>
              <span className="font-display text-base text-ink-100 whitespace-nowrap">
                {t('app.title')}
              </span>
            </span>
          </Link>

          {inWorld && worldSlug && (
            <div className="hidden shrink-0 sm:block">
              <WorldSwitcher currentSlug={worldSlug} />
            </div>
          )}
        </div>

        {/* CENTRO: tab del mondo (desktop/tablet). */}
        {inWorld ? <WorldTabs tabs={worldItems} activeKey={activeKey} /> : <div className="flex-1" />}

        {/* DESTRA: ricerca + utility compatte + lingua + menu mobile. */}
        <div className="flex shrink-0 items-center gap-1.5">
          {inWorld && dataset && (
            <div ref={searchRef} className="relative">
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                aria-expanded={searchOpen}
                aria-label={t('search.label', { world: getLocalizedText(dataset.world.title, locale) })}
                title={t('search.kbHint')}
                className={iconClass}
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
            to={staticPagePath(lang, 'about')}
            aria-label={t('nav.about')}
            title={t('nav.about')}
            className={cn(iconClass, 'max-md:hidden')}
          >
            <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-[18px] w-[18px]">
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="11" x2="12" y2="16.5" />
              <circle cx="12" cy="7.75" r="0.6" fill="currentColor" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={openReport}
            aria-label={t('nav.report')}
            title={t('nav.reportTitle')}
            className={cn(iconClass, 'max-md:hidden')}
          >
            <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
              <path d="M5 21V4h11l-1.5 4L16 12H5" />
            </svg>
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
              <li key={item.key}>
                <Link
                  to={item.to}
                  aria-current={item.key === activeKey ? 'page' : undefined}
                  onClick={() => toggleMobileNav()}
                  className={cn(
                    'block px-3 py-2 rounded-md text-sm',
                    item.key === activeKey
                      ? 'bg-chakra-500/20 text-chakra-100'
                      : 'text-ink-200 hover:text-white hover:bg-ink-800/70',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to={staticPagePath(lang, 'about')}
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
