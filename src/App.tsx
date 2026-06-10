import { AppRouter } from '@/routes/AppRouter';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <>
      <AppRouter />
      <Analytics />
    </>
  );
}
