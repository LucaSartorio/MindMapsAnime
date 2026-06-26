import type { ComponentType, SVGProps } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCookieConsent } from '@/store/useCookieConsent';
import { DiscordIcon, InstagramIcon, XIcon } from './SocialIcons';

/**
 * Link social. Lo spazio è predisposto per Instagram, Discord e X: le icone
 * sono sempre visibili. Imposta l'URL reale in `href` per renderle cliccabili;
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
  { key: 'discord', label: 'Discord', href: '', Icon: DiscordIcon },
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
 */
export function Footer() {
  const { t } = useTranslation();
  const openPreferences = useCookieConsent((s) => s.openPreferences);

  return (
    <footer className="shrink-0 border-t border-ink-700/60 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:justify-between">
        <p className="order-2 text-xs text-ink-400 sm:order-1">
          © {CURRENT_YEAR} {OWNER}. {t('footer.rights')}
        </p>

        <div className="order-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:order-2">
          <Link
            to="/supporta"
            className="inline-flex items-center gap-1 text-xs font-medium text-ember-300 hover:text-ember-200 hover:underline"
          >
            <span aria-hidden>♥</span> {t('footer.support')}
          </Link>

          <ul className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ key, label, href, Icon }) =>
              href ? (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="inline-flex text-ink-300 transition hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ) : (
                // Placeholder: spazio predisposto, non ancora collegato.
                <li key={key}>
                  <span
                    aria-label={`${label} — ${t('footer.socialSoon')}`}
                    title={`${label} — ${t('footer.socialSoon')}`}
                    className="inline-flex text-ink-500/70"
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                </li>
              ),
            )}
          </ul>

          <nav
            aria-label={t('footer.legalNav')}
            className="flex items-center gap-2 text-[11px] text-ink-400"
          >
            <Link to="/privacy" className="hover:text-chakra-300 hover:underline">
              {t('footer.privacy')}
            </Link>
            <span aria-hidden className="text-ink-600">
              ·
            </span>
            <Link
              to="/cookie-policy"
              className="hover:text-chakra-300 hover:underline"
            >
              {t('footer.cookiePolicy')}
            </Link>
            <span aria-hidden className="text-ink-600">
              ·
            </span>
            <button
              type="button"
              onClick={openPreferences}
              className="hover:text-chakra-300 hover:underline"
            >
              {t('footer.manageCookies')}
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
