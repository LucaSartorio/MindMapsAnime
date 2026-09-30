import { useLocation } from 'react-router-dom';
import { useLocaleStore } from '@/store/useLocaleStore';
import { seoLocaleFor, type SeoLocale } from './config';
import { langFromPath } from './paths';

/**
 * Lingua URL corrente (`/it` | `/en`) per costruire i link interni. Fuori da
 * una rotta con prefisso (es. 404 legacy) ricade sulla lingua UI.
 */
export function useSeoLang(): SeoLocale {
  const { pathname } = useLocation();
  const ui = useLocaleStore((s) => s.locale);
  return langFromPath(pathname) ?? seoLocaleFor(ui);
}
