import { memo } from 'react';
import type { StoryArc, WorldDataset } from '@/types';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { CanonPill, ReferencePill } from '@/components/common/StatusPill';
import { cn } from '@/lib/cn';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';
import { useTranslation } from 'react-i18next';

interface StoryArcCardProps {
  arc: StoryArc;
  dataset: WorldDataset;
  active?: boolean;
  onSelect: (id: string) => void;
}

function StoryArcCardComponent({
  arc,
  dataset,
  active,
  onSelect,
}: StoryArcCardProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const eventCount = dataset.events.filter((e) => e.arcId === arc.id).length;
  const locCount = (arc.locationIds ?? []).length;
  const charCount = (arc.characterIds ?? []).length;
  const name = getLocalizedText(arc.localizedName, locale) || arc.name;
  const saga = getLocalizedText(arc.saga, locale);

  return (
    <Card
      interactive
      className={cn(
        'p-4 h-full',
        active && 'border-ember-500/70 shadow-ember',
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(arc.id)}
        className="text-left w-full flex flex-col gap-3"
      >
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-ink-400 font-mono">
          <span>#{arc.order}</span>
          {saga && <span>{saga}</span>}
        </div>
        <h3 className="font-display text-lg text-ink-100">{name}</h3>
        <p className="text-sm text-ink-300 leading-relaxed line-clamp-3">
          {getLocalizedText(arc.description, locale)}
        </p>
        <div className="flex flex-wrap items-center gap-1.5 mt-1">
          <CanonPill canon={arc.canon} />
          {arc.referenceStatus && (
            <ReferencePill status={arc.referenceStatus} />
          )}
          <Badge>{t('modals.eventCount', { count: eventCount })}</Badge>
          {locCount > 0 && (
            <Badge>{t('modals.locationCount', { count: locCount })}</Badge>
          )}
          {charCount > 0 && (
            <Badge>{t('modals.characterCount', { count: charCount })}</Badge>
          )}
        </div>
      </button>
    </Card>
  );
}

export const StoryArcCard = memo(StoryArcCardComponent);
