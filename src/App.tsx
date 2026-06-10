import { AppRouter } from '@/routes/AppRouter';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  return (
    <>
      <AppRouter />
      <SpeedInsights />
    </>
  );
}
