import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ensureLocaleResources, initialLocale } from './i18n'; // inizializza i18next
import { setLocaleNow } from './store/useLocaleStore';
import { preloadRoute } from './routes/lazyPages';
import { langFromPath } from './seo/paths';
import { seoLocaleFor } from './seo/config';
import type { SupportedLocale } from './types/i18n';
// Font self-hosted (privacy: nessuna richiesta a Google Fonts CDN → nessun IP
// trasmesso a terzi). I family name combaciano con tailwind.config.
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/cinzel/500.css';
import '@fontsource/cinzel/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import './styles/globals.css';

/**
 * Lingua del primo render:
 *  - l'URL (`/it`, `/en`) decide la lingua dei CONTENUTI;
 *  - la preferenza salvata (o del browser) vale se è compatibile con l'URL
 *    (es. giapponese su `/en/...`, perché ja ricade sull'inglese);
 *  - altrimenti si usa la lingua dell'URL, senza sovrascrivere la preferenza.
 */
function initialUiLocale(): SupportedLocale {
  const urlLang = langFromPath(window.location.pathname);
  const preferred = initialLocale();
  if (!urlLang) return preferred;
  return seoLocaleFor(preferred) === urlLang ? preferred : urlLang;
}

async function boot() {
  const locale = initialUiLocale();
  // Risorse lingua + chunk/dataset della rotta PRIMA del primo render: così il
  // primo render client coincide con l'HTML pre-renderizzato (idratazione).
  await Promise.all([
    ensureLocaleResources(locale).catch(() => undefined),
    preloadRoute(window.location.pathname),
  ]);
  setLocaleNow(locale);

  const container = document.getElementById('root')!;
  const app = (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  if (container.firstElementChild) {
    // Pagina pre-renderizzata: idratiamo invece di ricreare il DOM. Un
    // eventuale mismatch (es. lingua UI diversa da quella dell'URL) è
    // recuperabile: React ri-renderizza lato client senza rompere nulla.
    ReactDOM.hydrateRoot(container, app, {
      onRecoverableError: (err) => {
        if (import.meta.env.DEV) console.warn('[hydrate]', err);
      },
    });
  } else {
    ReactDOM.createRoot(container).render(app);
  }
}

void boot();
