import type { ComponentType, SVGProps } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCookieConsent } from '@/store/useCookieConsent';
import { DiscordIcon, InstagramIcon, XIcon } from './SocialIcons';

/**
 * Link social. Spazio già predisposto: sostituire `href` con gli URL
 * reali quando disponibili (placeholder `#` finché non configurati).
 */
interface SocialLink {
  key: string;
  label: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const SOCIAL_LINKS: SocialLink[] = [
  { key: 'instagram', label: 'Instagram', href: '#', Icon: InstagramIcon },
  { key: 'discord', label: 'Discord', href: '#', Icon: DiscordIcon },
  { key: 'x', label: 'X', href: '#', Icon: XIcon },
];

const CURRENT_YEAR = new Date().getFullYear();
const OWNER = 'Luca Sartorio';

/**
 * Footer globale del sito: social, copyright e link a privacy / cookie.
 */
export function Footer() {
  const { t } = useTranslation();
  const openPreferences = useCookieConsent((s) => s.openPreferences);

  return (
    <footer className="mt-16 border-t border-ink-700/60 bg-ink-950/40">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col items-center gap-5 text-center">
        <ul className="flex items-center gap-3">
          {SOCIAL_LINKS.map(({ key, label, href, Icon }) => {
            const isPlaceholder = href === '#';
            return (
              <li key={key}>
                <a
                  href={href}
                  target={isPlaceholder ? undefined : '_blank'}
                  rel={isPlaceholder ? undefined : 'noopener noreferrer'}
                  aria-label={label}
                  title={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-700/70 text-ink-200 transition hover:border-chakra-500/60 hover:text-white hover:bg-ink-800/70"
                >
                  <Icon className="h-5 w-5" />
                </a>
              </li>
            );
          })}
        </ul>

        <p className="text-sm text-ink-300">
          © {CURRENT_YEAR} {OWNER}. {t('footer.rights')}
        </p>

        <nav
          aria-label={t('footer.legalNav')}
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-ink-400"
        >
          <Link to="/privacy" className="hover:text-chakra-300 hover:underline">
            {t('footer.privacy')}
          </Link>
          <span aria-hidden className="text-ink-600">
            |
          </span>
          <Link to="/cookie-policy" className="hover:text-chakra-300 hover:underline">
            {t('footer.cookiePolicy')}
          </Link>
          <span aria-hidden className="text-ink-600">
            |
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
    </footer>
  );
}
