import { Component, type ErrorInfo, type ReactNode } from 'react';
import { I18N_STORAGE_KEY } from '@/i18n';

/**
 * Error boundary applicativo. React richiede un class component per
 * `componentDidCatch` / `getDerivedStateFromError`, quindi le stringhe non
 * passano da react-i18next (fuori dal ciclo hook): leggiamo la lingua scelta
 * direttamente dal localStorage, con fallback all'italiano (locale di default).
 *
 * - `variant="fullscreen"` (default): schermata intera, usata a livello app.
 * - `variant="section"`: riquadro inline, isola il crash di una singola pagina
 *   (es. la mappa) lasciando intatti header, nav e footer.
 */
type Variant = 'fullscreen' | 'section';

interface ErrorBoundaryProps {
  children: ReactNode;
  variant?: Variant;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

const STRINGS = {
  it: {
    title: 'Qualcosa è andato storto',
    body: 'Si è verificato un errore imprevisto. Puoi riprovare a caricare la pagina o tornare alla home.',
    retry: 'Riprova',
    home: 'Torna alla home',
  },
  en: {
    title: 'Something went wrong',
    body: 'An unexpected error occurred. You can try reloading the page or go back home.',
    retry: 'Try again',
    home: 'Back to home',
  },
} as const;

function currentLocale(): 'it' | 'en' {
  try {
    return localStorage.getItem(I18N_STORAGE_KEY) === 'en' ? 'en' : 'it';
  } catch {
    return 'it';
  }
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Nessun servizio di error-tracking configurato: log in console per il
    // debug locale. Sostituibile con Sentry/Vercel se aggiunto in futuro.
    console.error('ErrorBoundary ha catturato un errore:', error, info);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    const t = STRINGS[currentLocale()];
    const fullscreen = (this.props.variant ?? 'fullscreen') === 'fullscreen';

    return (
      <div
        role="alert"
        className={
          fullscreen
            ? 'grid min-h-dvh place-items-center bg-ink-950 px-4 text-center'
            : 'grid flex-1 place-items-center px-4 py-16 text-center'
        }
      >
        <div className="max-w-md">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-ember-500/15 text-2xl text-ember-400">
            ⚠
          </div>
          <h1 className="mb-2 font-display text-xl text-ink-100">{t.title}</h1>
          <p className="mb-6 text-sm text-ink-300">{t.body}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleRetry}
              className="rounded-lg bg-chakra-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-chakra-400"
            >
              {t.retry}
            </button>
            <a
              href="/"
              className="rounded-lg border border-ink-700 px-4 py-2 text-sm text-ink-200 transition hover:border-ink-500 hover:text-white"
            >
              {t.home}
            </a>
          </div>
        </div>
      </div>
    );
  }
}
