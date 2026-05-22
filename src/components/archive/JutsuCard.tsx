import type { Jutsu, WorldDataset } from '@/types';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { ReferencePill } from '@/components/common/StatusPill';
import { cn } from '@/lib/cn';
import { useLocaleStore } from '@/store/useLocaleStore';
import {
  getChakraNatureLabel,
  getJutsuTypeLabel,
  getLocalizedText,
} from '@/utils/localization';

interface JutsuCardProps {
  jutsu: Jutsu;
  dataset: WorldDataset;
  active?: boolean;
  onClick?: () => void;
}

export function JutsuCard({ jutsu, active, onClick }: JutsuCardProps) {
  const locale = useLocaleStore((s) => s.locale);

  return (
    <Card
      interactive
      className={cn(
        'cursor-pointer p-4 h-full flex flex-col gap-3',
        active && 'border-ember-500/70 shadow-ember',
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex flex-col gap-3 text-left w-full"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg text-ink-100">
              {getLocalizedText(jutsu.localizedName, locale) || jutsu.name}
            </h3>
            {jutsu.japaneseName && (
              <p className="text-xs text-ink-300 italic">{jutsu.japaneseName}</p>
            )}
          </div>
          {jutsu.referenceStatus && (
            <ReferencePill status={jutsu.referenceStatus} />
          )}
        </div>
        <p className="text-sm text-ink-300 leading-relaxed">
          {getLocalizedText(jutsu.shortDescription, locale)}
        </p>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="accent">{getJutsuTypeLabel(jutsu.type, locale)}</Badge>
          {jutsu.rank && <Badge variant="ember">{jutsu.rank}</Badge>}
          {(jutsu.chakraNature ?? []).map((n) => (
            <Badge key={n} variant="danger">
              {getChakraNatureLabel(n, locale)}
            </Badge>
          ))}
        </div>
      </button>
    </Card>
  );
}
