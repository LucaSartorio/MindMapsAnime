import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { HomePage } from '@/components/home/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicyPage';
import { CookiePolicyPage } from '@/pages/CookiePolicyPage';
import { SupportPage } from '@/pages/SupportPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { WorldRoute } from './WorldRoute';

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/supporta" element={<SupportPage />} />
          <Route path="/worlds/:worldSlug/*" element={<WorldRoute />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
