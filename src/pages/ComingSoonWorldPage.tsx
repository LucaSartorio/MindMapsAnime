import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { AnimeWorld } from '@/types';
import { Card } from '@/components/common/Card';
import { Seo } from '@/components/seo/Seo';
import { WorldStatusPill } from '@/components/common/StatusPill';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';

interface ComingSoonWorldPageProps {
  world: AnimeWorld;
}

export function ComingSoonWorldPage({ world }: ComingSoonWorldPageProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const description = getLocalizedText(world.description, locale);

  return (
    <div className="flex-1 grid place-items-center px-6 py-16">
      <Seo path={`/worlds/${world.slug}`} />
      <Card className="max-w-lg w-full p-8 text-center space-y-5">
        <p className="font-mono text-xs uppercase tracking-widest text-chakra-300">
          /worlds/{world.slug}
        </p>
        <h1 className="font-display text-3xl text-ink-100">{world.title}</h1>
        <div className="flex justify-center">
          <WorldStatusPill status={world.status} />
        </div>
        <p className="text-sm text-ink-300 leading-relaxed">{description}</p>
        <p className="text-sm text-yellow-300/80">
          {t('comingSoonPage.notAvailable')}
        </p>
        <Link to="/" className="btn-primary inline-flex">
          {t('comingSoonPage.backHome')}
        </Link>
      </Card>
    </div>
  );
}
