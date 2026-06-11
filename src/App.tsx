import { AppRouter } from '@/routes/AppRouter';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <>
      <AppRouter />
      <SpeedInsights />
      <Analytics />
    </>
  );
}
