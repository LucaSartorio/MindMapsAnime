import type { ReactNode } from 'react';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { CookieConsent } from '@/components/cookie/CookieConsent';

interface AppShellProps {
  children: ReactNode;
}

/**
 * Shell di base dell'app:
 *  - TopNav sticky
 *  - main area scrollabile (è il contenitore di scroll; la mappa la riempie)
 *  - Footer sottile sempre visibile in fondo a ogni pagina
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="h-dvh flex flex-col">
      <TopNav />
      <main className="flex-1 flex flex-col min-h-0 overflow-auto">{children}</main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
