import { Link, NavLink, useLocation } from 'react-router-dom';
import { useWorldStore } from '@/store';
import { cn } from '@/lib/cn';

interface NavItem {
  to: string;
  label: string;
}

export function TopNav() {
  const worldSlug = useWorldStore((s) => s.worldSlug);
  const worldTitle = useWorldStore((s) => s.dataset?.world.title);
  const location = useLocation();

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
    <header className="sticky top-0 z-30 border-b border-ink-700/60 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-3 group"
          aria-label="Vai alla homepage di Anime Interactive Maps"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-chakra-500 to-ember-500 text-white font-bold font-display">
            A
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-base text-ink-100">
              Anime Interactive Maps
            </span>
            {inWorld && worldTitle && (
              <span className="font-mono text-[10px] uppercase tracking-widest text-chakra-300">
                · {worldTitle}
              </span>
            )}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
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
          <Link
            to="/about"
            className="ml-2 px-3 py-1.5 rounded-md text-sm text-ink-300 hover:text-white"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
