import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { AnimeWorld } from '@/types';
import { Card } from '@/components/common/Card';
import { ComingSoonBadge } from './ComingSoonBadge';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';
import { resolveWorldLogo } from '@/utils/entityImage';
import { loadWorldDataset } from '@/data/registry';

interface WorldCardProps {
  world: AnimeWorld;
}

/**
 * Copertina del mondo: sfondo tematico + logo del manga.
 * Il logo si aggiunge come drop-in in `src/assets/worlds/logos/<slug>.<ext>`;
 * in assenza resta il solo sfondo tematico.
 */
function WorldCover({ world }: { world: AnimeWorld }) {
  const { primary, accent } = world.theme;
  const logo = resolveWorldLogo(world.slug);
  return (
    <div className="absolute inset-0">
      <svg
        viewBox="0 0 400 240"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <radialGradient id={`g-${world.id}`} cx="50%" cy="40%" r="62%">
            <stop offset="0%" stopColor={primary} stopOpacity="0.85" />
            <stop offset="60%" stopColor={accent} stopOpacity="0.32" />
            <stop offset="100%" stopColor="#070709" stopOpacity="1" />
          </radialGradient>
          <pattern id={`p-${world.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 40 L40 0" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="400" height="240" fill={`url(#g-${world.id})`} />
        <rect width="400" height="240" fill={`url(#p-${world.id})`} />
      </svg>
      {logo && (
        <div className="absolute inset-0 flex items-center justify-center px-7 pt-6 pb-14">
          <img
            src={logo}
            alt={`${world.title} logo`}
            style={
              world.theme.logoScale
                ? { transform: `scale(${world.theme.logoScale})` }
                : undefined
            }
            className="h-auto w-auto max-h-[72%] max-w-[86%] object-contain drop-shadow-[0_2px_14px_rgba(0,0,0,0.65)]"
          />
        </div>
      )}
    </div>
  );
}

export function WorldCard({ world }: WorldCardProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const isAvailable = world.status === 'available';
  const description = getLocalizedText(world.description, locale);
  const inner = (
    <Card interactive className="relative overflow-hidden flex flex-1 flex-col">
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-xl shrink-0">
        <WorldCover world={world} />
        {world.status === 'coming_soon' && <ComingSoonBadge />}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-ink-950/95 via-ink-950/70 to-transparent">
          <p className="font-display text-2xl text-white drop-shadow-lg">
            {world.title}
          </p>
          {world.subtitle && (
            <p className="text-xs font-mono text-ink-200 tracking-wide">
              {getLocalizedText(world.subtitle, locale)}
            </p>
          )}
        </div>
      </div>
      <div className="p-5 flex flex-1 flex-col gap-4">
        <p className="text-sm text-ink-300 leading-relaxed line-clamp-3">
          {description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {world.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="chip text-[10px] uppercase">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between">
          {isAvailable ? (
            <span className="btn-primary px-4 py-2 text-sm">
              {t('worldCard.explore')}
            </span>
          ) : (
            <span className="btn-disabled px-4 py-2 text-sm">
              {t('worldCard.inArrivo')}
            </span>
          )}
          <span className="text-[10px] uppercase tracking-widest font-mono text-ink-400">
            /{world.slug}
          </span>
        </div>
      </div>
    </Card>
  );

  if (!isAvailable) {
    return (
      <Link
        to={`/worlds/${world.slug}`}
        aria-label={`${world.title} · ${t('coming.badge')}`}
        className="flex flex-1 flex-col focus:outline-none"
      >
        {inner}
      </Link>
    );
  }

  // Prefetch del chunk dataset al primo hover/touch: al click la mappa
  // apre senza attesa (il loader ha cache + dedup, chiamarlo più volte è ok).
  const prefetch = () => void loadWorldDataset(world.slug).catch(() => {});

  return (
    <Link
      to={`/worlds/${world.slug}`}
      aria-label={`${t('worldCard.explore')} · ${world.title}`}
      className="flex flex-1 flex-col focus:outline-none"
      onMouseEnter={prefetch}
      onTouchStart={prefetch}
      onFocus={prefetch}
    >
      {inner}
    </Link>
  );
}
