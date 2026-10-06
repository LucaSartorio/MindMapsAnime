import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLoadedWorldDataset } from '@/data/registry';
import { LOCALE_META } from '@/types/i18n';
import {
  buildPageMeta,
  notFoundMeta,
  resolveSeoPath,
  type ResolvedPage,
} from '@/seo/metadata';
import { applyHead } from '@/seo/head';
import { buildTabTitle } from '@/seo/tabTitle';
import { useSeoLang } from '@/seo/useSeoLang';

interface SeoProps {
  /** Pagina già risolta (le pagine di mondo la passano); altrimenti dal pathname. */
  resolved?: ResolvedPage | null;
  /** Forza i metadati 404 (noindex, nessuna canonical). */
  notFound?: boolean;
}

/**
 * Sincronizza il `<head>` con la pagina corrente durante la navigazione SPA.
 *
 * NON contiene logica SEO propria: i metadati arrivano da `buildPageMeta`
 * (`src/seo/metadata.ts`), la stessa funzione che il pre-rendering usa per
 * scrivere l'HTML statico — quindi title/canonical/hreflang coincidono sempre
 * fra HTML iniziale e DOM renderizzato. Non renderizza nulla.
 */
export function Seo({ resolved, notFound }: SeoProps) {
  const { pathname } = useLocation();
  const lang = useSeoLang();
  const uiLocale = useLocaleStore((s) => s.locale);
  const { t } = useTranslation();

  const page = useMemo(() => {
    if (notFound) return null;
    return resolved === undefined ? resolveSeoPath(pathname, getLoadedWorldDataset) : resolved;
  }, [notFound, resolved, pathname]);
  const meta = useMemo(() => (page ? buildPageMeta(page) : notFoundMeta(lang)), [page, lang]);
  // Titolo della scheda del browser: breve, per sezione, nella lingua UI.
  const tabTitle = useMemo(() => (page ? buildTabTitle(page, uiLocale, t) : null), [page, uiLocale, t]);

  useEffect(() => {
    // `lang` dell'<html>: la lingua in cui l'utente legge l'interfaccia.
    applyHead(meta, LOCALE_META[uiLocale].htmlLang, tabTitle);
  }, [meta, uiLocale, tabTitle]);

  return null;
}
