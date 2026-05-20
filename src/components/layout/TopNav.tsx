import { Link, NavLink, useLocation } from 'react-router-dom';
import { useUiStore, useWorldStore } from '@/store';
import { cn } from '@/lib/cn';
import { GlobalSearchDropdown } from '@/components/search/GlobalSearchDropdown';

interface NavItem {
  to: string;
  label: string;
}

/**
 * Top navigation bar.
 * - Sempre visibile.
 * - In contesto mondo: mostra link interni (Mappa/Personaggi/...) + search.
 * - Mobile: nav items collassati dietro un toggle.
 */
export function TopNav() {
  const worldSlug = useWorldStore((s) => s.worldSlug);
  const dataset = useWorldStore((s) => s.dataset);
  const location = useLocation();
  const isMobileNavOpen = useUiStore((s) => s.isMobileNavOpen);
  const toggleMobileNav = useUiStore((s) => s.toggleMobileNav);

  const inWorld = location.pathname.startsWith('/worlds/') && worldSlug;

  const worldItems: NavItem[] = inWorld
    ? [
        { to: `/worlds/${worldSlug}`, label: 'Mappa' },
        { to: `/worlds/${worldSlug}/characters`, label: 'Personaggi' },
        { to: `/worlds/${worldSlug}/clans`, label: 'Clan & Fazioni' },
        { to: `/worlds/${worldSlug}/arcs`, label: 'Archi' },
        { to: `/worlds/${worldSlug}/sources`, label: 'Fonti' },
      ]
    : [];

  return (
    <header className="sticky top-0 z-30 border-b border-ink-700/60 bg-ink-950/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-2.5 flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-3 shrink-0"
          aria-label="Anime Interactive Maps · homepage"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-chakra-500 to-ember-500 text-white font-bold font-display">
            A
          </span>
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="font-display text-base text-ink-100">
              Anime Interactive Maps
            </span>
            {inWorld && dataset && (
              <span className="font-mono text-[10px] uppercase tracking-widest text-chakra-300">
                · {dataset.world.title}
              </span>
            )}
          </span>
        </Link>

        {/* Nav desktop */}
        <nav
          className="hidden md:flex items-center gap-1 ml-2"
          aria-label="Navigazione mondo"
        >
          {worldItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                cn(
                  'px-3 py-1.5 rounded-md text-sm transition',
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

        {/* Right cluster: search + about + mobile toggle */}
        <div className="ml-auto flex items-center gap-2 min-w-0 flex-1 justify-end">
          {inWorld && dataset && (
            <div className="hidden sm:block w-full max-w-xs">
              <GlobalSearchDropdown dataset={dataset} showKbHint />
            </div>
          )}
          <Link
            to="/about"
            className="hidden md:inline-block px-3 py-1.5 rounded-md text-sm text-ink-300 hover:text-white"
          >
            About
          </Link>
          {inWorld && (
            <button
              type="button"
              onClick={toggleMobileNav}
              aria-expanded={isMobileNavOpen}
              aria-controls="mobile-world-nav"
              aria-label="Apri navigazione mondo"
              className="md:hidden h-9 w-9 grid place-items-center rounded-md border border-ink-700/70 text-ink-100"
            >
              ☰
            </button>
          )}
        </div>
      </div>

      {/* Sub-bar search mobile */}
      {inWorld && dataset && (
        <div className="sm:hidden px-4 pb-2">
          <GlobalSearchDropdown dataset={dataset} />
        </div>
      )}

      {/* Mobile world nav */}
      {inWorld && isMobileNavOpen && (
        <nav
          id="mobile-world-nav"
          aria-label="Navigazione mondo (mobile)"
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
                About
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
