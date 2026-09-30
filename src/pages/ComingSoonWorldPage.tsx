import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { AnimeWorld } from '@/types';
import { Card } from '@/components/common/Card';
import { Seo } from '@/components/seo/Seo';
import { WorldStatusPill } from '@/components/common/StatusPill';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';
import { getWorldUrlSlug } from '@/data/worlds';
import { homePath } from '@/seo/paths';
import { useSeoLang } from '@/seo/useSeoLang';

interface ComingSoonWorldPageProps {
  world: AnimeWorld;
}

/** Landing di un mondo "in arrivo": raggiungibile ma `noindex` finché non ha dati. */
export function ComingSoonWorldPage({ world }: ComingSoonWorldPageProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const lang = useSeoLang();
  const description = getLocalizedText(world.description, locale);

  return (
    <div className="flex-1 grid place-items-center px-6 py-16">
      <Seo />
      <Card className="max-w-lg w-full p-8 text-center space-y-5">
        <p className="font-mono text-xs uppercase tracking-widest text-chakra-300">
          /{getWorldUrlSlug(world)}
        </p>
        <h1 className="font-display text-3xl text-ink-100">
          {getLocalizedText(world.title, locale)}
        </h1>
        <div className="flex justify-center">
          <WorldStatusPill status={world.status} />
        </div>
        <p className="text-sm text-ink-300 leading-relaxed">{description}</p>
        <p className="text-sm text-yellow-300/80">
          {t('comingSoonPage.notAvailable')}
        </p>
        <Link to={homePath(lang)} className="btn-primary inline-flex">
          {t('comingSoonPage.backHome')}
        </Link>
      </Card>
    </div>
  );
}
