import { AppRouter } from '@/routes/AppRouter';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { CookieConsent } from '@/components/cookie/CookieConsent';
import { selectAnalyticsAllowed, useCookieConsent } from '@/store/useCookieConsent';

export default function App() {
  // Strumenti di analisi caricati SOLO previo consenso esplicito (GDPR/ePrivacy).
  const analyticsAllowed = useCookieConsent(selectAnalyticsAllowed);

  return (
    <>
      <AppRouter />
      {analyticsAllowed && (
        <>
          <SpeedInsights />
          <Analytics />
        </>
      )}
      <CookieConsent />
    </>
  );
}
