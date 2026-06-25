import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { CookieConsent } from '@/components/cookie/CookieConsent';
import { ReportModal } from '@/components/report/ReportModal';

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
  return (
    <div className="h-dvh flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[80] focus:rounded-md focus:bg-chakra-500 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
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
      <ReportModal />
    </div>
  );
}
