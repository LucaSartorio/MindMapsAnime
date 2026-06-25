/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Access key di Web3Forms per il modulo "Segnala un bug / Proponi miglioria".
   * Ottienila gratis su https://web3forms.com (ti arriva via email) e impostala
   * in `.env` (sviluppo) e nelle Environment Variables di Vercel (produzione).
   */
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
