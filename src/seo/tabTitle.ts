import type { AnimeWorld } from '@/types';
import type { SupportedLocale } from '@/types/i18n';
import { getLocalizedText } from '@/utils/localization';
import { getAbilityTerm, getFactionsTerm } from '@/lib/worldConfig';
import { SITE } from './config';
import type { ResolvedPage } from './metadata';
import type { SeoCategory } from './categories';
import type { StaticPage } from './paths';

/** Risolutore delle chiavi UI (i18next `t`, nella lingua dell'interfaccia). */
type Translate = (key: string) => string;

const SEP = ' — ';

const STATIC_LABEL_KEY: Record<StaticPage, string> = {
  about: 'nav.about',
  support: 'footer.support',
  privacy: 'footer.privacy',
  'cookie-policy': 'footer.cookiePolicy',
};

/** Etichetta di sezione: la STESSA delle tab dell'header (`TopNav`), regioni comprese. */
function sectionLabel(world: AnimeWorld, section: SeoCategory | 'map' | 'timeline', locale: SupportedLocale, t: Translate): string {
  switch (section) {
    case 'factions':
      return getFactionsTerm(world, locale, t('nav.clansFactions'));
    case 'abilities':
      return getAbilityTerm(world, locale);
    default:
      return t(`nav.${section}`);
  }
}

/**
 * Titolo della SCHEDA DEL BROWSER (`document.title`), nella lingua
 * dell'interfaccia scelta dall'utente (anche ja/fr/de, che non hanno URL).
 *
 * È volutamente generico per sezione — "Naruto — Mappa", "Naruto — Personaggi",
 * "AniMapVerse — Mappe interattive" — e non cambia con la scheda aperta sulla
 * mappa. Le pagine ENTITÀ (e la 404) restituiscono `null` e tengono il title SEO
 * di `buildPageMeta`: Google legge il title anche dopo il JS, e un titolo
 * generico ripetuto su centinaia di pagine distinte sarebbe un duplicato.
 *
 * Solo client (applicato da `<Seo>` dopo l'idratazione): l'HTML pre-renderizzato,
 * Open Graph e JSON-LD restano quelli descrittivi di `buildPageMeta`.
 */
export function buildTabTitle(resolved: ResolvedPage, locale: SupportedLocale, t: Translate): string | null {
  const { page } = resolved;
  const worldName = (w: AnimeWorld) => getLocalizedText(w.title, locale);
  switch (page.kind) {
    case 'home':
      return `${SITE.name}${SEP}${t('app.tabTagline')}`;
    case 'static':
      return `${SITE.name}${SEP}${t(STATIC_LABEL_KEY[page.page])}`;
    case 'world':
      return `${worldName(page.world)}${SEP}${t('nav.overview')}`;
    case 'map':
    case 'timeline':
      return `${worldName(page.dataset.world)}${SEP}${sectionLabel(page.dataset.world, page.kind, locale, t)}`;
    case 'category':
      return `${worldName(page.dataset.world)}${SEP}${sectionLabel(page.dataset.world, page.category, locale, t)}`;
    case 'entity':
      return null;
  }
}
