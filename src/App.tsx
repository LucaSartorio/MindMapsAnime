import { AppRouter } from '@/routes/AppRouter';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { selectAnalyticsAllowed, useCookieConsent } from '@/store/useCookieConsent';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export default function App() {
  // Strumenti di analisi caricati SOLO previo consenso esplicito (GDPR/ePrivacy).
  // Il banner di consenso (CookieConsent) è montato dentro AppShell perché
  // usa <Link> e deve stare nel contesto del Router.
  const analyticsAllowed = useCookieConsent(selectAnalyticsAllowed);

  return (
    // Boundary di ultima istanza: un errore runtime non deve lasciare schermo
    // bianco. I boundary "section" più interni isolano i singoli pannelli.
    <ErrorBoundary>
      <AppRouter />
      {analyticsAllowed && (
        <>
          <SpeedInsights />
          <Analytics />
        </>
      )}
    </ErrorBoundary>
  );
}
