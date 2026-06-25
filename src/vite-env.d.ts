/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Access key di Web3Forms per il modulo "Segnala un bug / Proponi miglioria".
   * Ottienila gratis su https://web3forms.com (ti arriva via email) e impostala
   * in `.env` (sviluppo) e nelle Environment Variables di Vercel (produzione).
   */
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string;
  /**
   * URL della donazione PayPal (PayPal.me o bottone "Donate") per la pagina
   * "Supportaci". Impostalo in `.env` e nelle Environment Variables di Vercel.
   */
  readonly VITE_PAYPAL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
