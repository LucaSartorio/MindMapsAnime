import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { CookieConsent } from '@/components/cookie/CookieConsent';
import { ReportModal } from '@/components/report/ReportModal';
import { useHydrated } from '@/lib/useHydrated';

interface AppShellProps {
  children: ReactNode;
}

/**
 * Shell di base dell'app:
 *  - skip link a11y (salta al contenuto)
 *  - TopNav sticky
 *  - main area scrollabile (è il contenitore di scroll; la mappa la riempie)
 *  - Footer sottile sempre visibile in fondo a ogni pagina
 */
export function AppShell({ children }: AppShellProps) {
  const { t } = useTranslation();
  // La modale segnalazioni dipende da stato solo-browser: montata dopo
  // l'idratazione. Il banner cookie invece è nell'HTML pre-renderizzato (LCP) e
  // gestisce da sé il consenso sconosciuto lato server (vedi CookieConsent).
  const hydrated = useHydrated();
  return (
    <div className="h-dvh flex flex-col">
      {/* Skip link: visibile al focus da tastiera, IN FLUSSO sopra l'header (UX-02).
          Prima era assoluto e copriva logo, ricerca e lingua mentre aveva il focus
          (WCAG 2.5.8: target parzialmente oscurati). */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:m-2 focus:self-start focus:rounded-md focus:bg-chakra-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
      >
        {t('a11y.skipToContent')}
      </a>
      <TopNav />
      <main
        id="main-content"
        className="flex-1 flex flex-col min-h-0 overflow-auto"
      >
        {children}
      </main>
      <Footer />
      <CookieConsent />
      {hydrated && <ReportModal />}
    </div>
  );
}
