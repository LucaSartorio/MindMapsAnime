import type { ComponentType, SVGProps } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCookieConsent } from '@/store/useCookieConsent';
import { DiscordIcon, InstagramIcon, XIcon, YouTubeIcon } from './SocialIcons';
import { parseSeoPath, staticPagePath } from '@/seo/paths';
import { useSeoLang } from '@/seo/useSeoLang';

/**
 * Link social (Instagram, YouTube, Discord, X): le icone sono sempre visibili. Imposta l'URL reale in `href` per renderle cliccabili;
 * finché resta vuoto l'icona è un placeholder inerte (niente link morto).
 */
interface SocialLink {
  key: string;
  label: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    key: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/ani_map_verse',
    Icon: InstagramIcon,
  },
  {
    key: 'youtube',
    label: 'YouTube',
    href: 'https://www.youtube.com/@AnimeInteractiveWorlds',
    Icon: YouTubeIcon,
  },
  {
    key: 'discord',
    label: 'Discord',
    href: 'https://discord.gg/qS2bz9f5Tx',
    Icon: DiscordIcon,
  },
  {
    key: 'x',
    label: 'X',
    href: 'https://x.com/animapverse',
    Icon: XIcon,
  },
];

const CURRENT_YEAR = new Date().getFullYear();
const OWNER = 'Luca Sartorio';

/**
 * Footer globale sottile: una sola riga con copyright, social, link "Sostieni"
 * e link legali. `shrink-0` per restare sempre visibile in fondo alla shell.
 *
 * UX-02: sulla pagina mappa, sotto `md`, la bottom nav degli strumenti (fissa in
 * basso) copriva tutti i link del footer e il footer toglieva spazio alla mappa.
 * Lì il footer è nascosto e gli stessi link (privacy, cookie, gestione cookie,
 * sostieni) sono nel menu ☰ dell'header, raggiungibile da ogni pagina. Decisione
 * dal solo percorso → identica in pre-render e idratazione.
 */
export function Footer() {
  const { t } = useTranslation();
  const lang = useSeoLang();
  const openPreferences = useCookieConsent((s) => s.openPreferences);
  const onMapPage = parseSeoPath(useLocation().pathname).kind === 'map';

  return (
    <footer
      className={`shrink-0 border-t border-ink-700/60 bg-ink-950/80 backdrop-blur-md${onMapPage ? ' max-md:hidden' : ''}`}
    >
      <div className="mx-auto max-w-6xl px-4 py-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:justify-between">
        <p className="order-2 text-xs text-ink-300 sm:order-1">
          © {CURRENT_YEAR} {OWNER}. {t('footer.rights')}
        </p>

        <div className="order-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:order-2">
          <Link
            to={staticPagePath(lang, 'support')}
            className="inline-flex min-h-6 items-center gap-1 text-xs font-medium text-ember-300 hover:text-ember-200 hover:underline"
          >
            <span aria-hidden>♥</span> {t('footer.support')}
          </Link>

          <ul className="flex items-center gap-1">
            {SOCIAL_LINKS.map(({ key, label, href, Icon }) =>
              href ? (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="inline-flex rounded p-1 text-ink-300 transition hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ) : (
                // Placeholder: spazio predisposto, non ancora collegato.
                <li key={key}>
                  <span
                    role="img"
                    aria-label={`${label} — ${t('footer.socialSoon')}`}
                    title={`${label} — ${t('footer.socialSoon')}`}
                    className="inline-flex p-1 text-ink-400"
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                </li>
              ),
            )}
          </ul>

          <nav
            aria-label={t('footer.legalNav')}
            className="flex flex-wrap items-center justify-center gap-x-2 text-[11px] text-ink-300"
          >
            <Link to={staticPagePath(lang, 'about')} className="inline-flex min-h-6 items-center hover:text-chakra-300 hover:underline">
              {t('nav.about')}
            </Link>
            <span aria-hidden className="text-ink-600">
              ·
            </span>
            <Link to={staticPagePath(lang, 'privacy')} className="inline-flex min-h-6 items-center hover:text-chakra-300 hover:underline">
              {t('footer.privacy')}
            </Link>
            <span aria-hidden className="text-ink-600">
              ·
            </span>
            <Link
              to={staticPagePath(lang, 'cookie-policy')}
              className="inline-flex min-h-6 items-center hover:text-chakra-300 hover:underline"
            >
              {t('footer.cookiePolicy')}
            </Link>
            <span aria-hidden className="text-ink-600">
              ·
            </span>
            <button
              type="button"
              onClick={openPreferences}
              className="inline-flex min-h-6 items-center hover:text-chakra-300 hover:underline"
            >
              {t('footer.manageCookies')}
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
