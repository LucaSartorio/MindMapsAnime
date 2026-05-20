import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { AnimeWorld } from '@/types';
import { Card } from '@/components/common/Card';
import { ComingSoonBadge } from './ComingSoonBadge';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';

interface WorldCardProps {
  world: AnimeWorld;
}

/** SVG placeholder personalizzato per il singolo mondo. */
function WorldCover({ world }: { world: AnimeWorld }) {
  const { primary, accent, highlight } = world.theme;
  // Generiamo un placeholder visivamente coerente col tema del mondo.
  // Ogni mondo ha un proprio "look", senza usare asset protetti.
  return (
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <radialGradient id={`g-${world.id}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={primary} stopOpacity="0.85" />
          <stop offset="60%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor="#070709" stopOpacity="1" />
        </radialGradient>
        <pattern id={`p-${world.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 40 L40 0" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="400" height="240" fill={`url(#g-${world.id})`} />
      <rect width="400" height="240" fill={`url(#p-${world.id})`} />
      {/* Cerchio centrale = "mappa" */}
      <g transform="translate(200 120)">
        <circle r="64" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
        <circle r="42" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.7" />
        <circle r="22" fill={highlight} opacity="0.85" />
        <path
          d="M-64 0 L64 0 M0 -64 L0 64"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
        {/* Punti sulla "mappa" */}
        <circle cx="-30" cy="-20" r="3.5" fill="#fff" />
        <circle cx="22" cy="14" r="3.5" fill="#fff" />
        <circle cx="-12" cy="32" r="3.5" fill="#fff" />
        <circle cx="40" cy="-26" r="3.5" fill="#fff" />
      </g>
    </svg>
  );
}

export function WorldCard({ world }: WorldCardProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const isAvailable = world.status === 'available';
  const description = getLocalizedText(world.description, locale);
  const inner = (
    <Card interactive className="relative overflow-hidden h-full">
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-xl">
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
      <div className="p-5 flex flex-col gap-4">
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
        className="block focus:outline-none"
      >
        {inner}
      </Link>
    );
  }

  return (
    <Link
      to={`/worlds/${world.slug}`}
      aria-label={`${t('worldCard.explore')} · ${world.title}`}
      className="block focus:outline-none"
    >
      {inner}
    </Link>
  );
}
