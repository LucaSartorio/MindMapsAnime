import { useLocation } from 'react-router-dom';
import { useLocaleStore } from '@/store/useLocaleStore';
import { seoLocaleFor, type SeoLocale } from './config';
import { langFromPath, worldOfPath } from './paths';

/**
 * Lingua URL con cui costruire i link interni.
 *
 * Di norma è la lingua dell'URL corrente. Eccezione: chi naviga in una lingua
 * con URL propri (es) su una pagina che ne è priva (`/en/bleach`, mondo non
 * tradotto) mantiene quella lingua nei link — home e mondi tradotti tornano
 * su `/es`, mentre i link ai mondi non tradotti ricadono da soli su `/en`
 * (vedi `worldPath`). Fuori da una rotta con prefisso usa la lingua UI.
 */
export function useSeoLang(): SeoLocale {
  const { pathname } = useLocation();
  const ui = useLocaleStore((s) => s.locale);
  const urlLang = langFromPath(pathname);
  if (!urlLang) return seoLocaleFor(ui);
  return seoLocaleFor(ui, worldOfPath(pathname)) === urlLang ? seoLocaleFor(ui) : urlLang;
}
