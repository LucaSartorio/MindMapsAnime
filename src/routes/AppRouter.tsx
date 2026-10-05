import { Suspense, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppShell } from '@/components/layout/AppShell';
import { HomePage } from '@/components/home/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicyPage';
import { CookiePolicyPage } from '@/pages/CookiePolicyPage';
import { SupportPage } from '@/pages/SupportPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useLocaleStore } from '@/store/useLocaleStore';
import { findWorldBySlug } from '@/data/worlds';
import { isSeoLocale, seoLocaleFor } from '@/seo/config';
import { worldOfPath, worldPath } from '@/seo/paths';
import { useIsomorphicLayoutEffect } from '@/lib/useHydrated';
import { WorldRoute } from './lazyPages';

/**
 * Albero delle rotte (condiviso da client e pre-rendering: il router lo
 * fornisce il chiamante — `BrowserRouter` qui, `StaticRouter` al build).
 *
 * Convenzione URL in docs/SEO.md: tutto vive sotto `/{lang}` (it | en | es). Le
 * vecchie rotte (`/worlds/...`, `/about`, `/supporta`…) sono rediretti 308
 * da vercel.json; i `<Navigate>` qui sotto coprono dev server e link interni.
 */
export function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/about" element={<LegacyRedirect to="about" />} />
        <Route path="/supporta" element={<LegacyRedirect to="support" />} />
        <Route path="/privacy" element={<LegacyRedirect to="privacy" />} />
        <Route path="/cookie-policy" element={<LegacyRedirect to="cookie-policy" />} />
        <Route path="/worlds/:worldSlug/*" element={<LegacyWorldRedirect />} />
        <Route path="/:lang/*" element={<LangRoutes />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

/** `/` → lingua preferita (in produzione lo fa già vercel.json via Accept-Language). */
function RootRedirect() {
  const ui = useLocaleStore((s) => s.locale);
  const { search, hash } = useLocation();
  return <Navigate to={`/${seoLocaleFor(ui)}${search}${hash}`} replace />;
}

/** Le vecchie pagine erano in italiano: il redirect conserva quella lingua. */
function LegacyRedirect({ to }: { to: string }) {
  const { search, hash } = useLocation();
  return <Navigate to={`/it/${to}${search}${hash}`} replace />;
}

const LEGACY_SUBPAGE: Record<string, string> = {
  '': 'map',
  characters: 'characters',
  clans: 'factions',
  arcs: 'arcs',
  jutsu: 'abilities',
};

/** `/worlds/naruto/clans?id=x` → `/it/naruto/factions?id=x` (query conservata). */
function LegacyWorldRedirect() {
  const { worldSlug = '', '*': rest = '' } = useParams();
  const { search, hash } = useLocation();
  const world = findWorldBySlug(worldSlug);
  if (!world) return <NotFoundPage />;
  const base = worldPath('it', world);
  if (world.status !== 'available') return <Navigate to={`${base}${search}${hash}`} replace />;
  const sub = LEGACY_SUBPAGE[rest.replace(/\/+$/, '')];
  return <Navigate to={`${sub ? `${base}/${sub}` : `${base}/map`}${search}${hash}`} replace />;
}

function LazyBoundary({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  return (
    <ErrorBoundary variant="section">
      <Suspense
        fallback={
          <div className="flex-1 grid place-items-center text-ink-300 text-sm">{t('common.loading')}</div>
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

/**
 * Rotte sotto `/{lang}`. Allinea la lingua dell'interfaccia a quella dell'URL
 * (senza toccare la preferenza salvata); le lingue UI senza URL propri
 * (ja/fr/de, e es sui mondi non ancora tradotti) restano attive sugli URL `/en`.
 */
function LangRoutes() {
  const { lang } = useParams();
  const { pathname } = useLocation();
  const ui = useLocaleStore((s) => s.locale);
  const syncLocale = useLocaleStore((s) => s.syncLocale);
  const valid = isSeoLocale(lang);

  useIsomorphicLayoutEffect(() => {
    if (valid && seoLocaleFor(ui, worldOfPath(pathname)) !== lang) syncLocale(lang);
  }, [valid, lang, ui, pathname, syncLocale]);

  if (!valid) return <NotFoundPage />;
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="support" element={<SupportPage />} />
      <Route path="privacy" element={<PrivacyPolicyPage />} />
      <Route path="cookie-policy" element={<CookiePolicyPage />} />
      <Route
        path=":worldSlug/*"
        element={
          <LazyBoundary>
            <WorldRoute />
          </LazyBoundary>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
