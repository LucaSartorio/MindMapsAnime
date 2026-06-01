import type { Jutsu, WorldDataset } from '@/types';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { EntityImage } from '@/components/common/EntityImage';
import { ReferencePill } from '@/components/common/StatusPill';
import { cn } from '@/lib/cn';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';
import {
  getAbilityAttribute,
  getAbilityCategoryLabel,
  worldShowsAbilityRank,
} from '@/lib/worldConfig';

interface JutsuCardProps {
  jutsu: Jutsu;
  dataset: WorldDataset;
  active?: boolean;
  onClick?: () => void;
}

export function JutsuCard({ jutsu, dataset, active, onClick }: JutsuCardProps) {
  const locale = useLocaleStore((s) => s.locale);
  const world = dataset.world;
  const attribute = getAbilityAttribute(world, locale);

  const name = getLocalizedText(jutsu.localizedName, locale) || jutsu.name;

  return (
    <Card
      interactive
      className={cn(
        'cursor-pointer p-0 h-full overflow-hidden',
        active && 'border-ember-500/70 shadow-ember',
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex flex-col text-left w-full h-full p-4 gap-3"
      >
        <div className="flex items-start gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-ink-700/60 bg-ink-900 shadow-md">
            <EntityImage
              kind="jutsu"
              id={jutsu.id}
              name={name}
              chakraNature={jutsu.chakraNature?.[0]}
              fit="cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-lg text-ink-100 leading-tight line-clamp-2">
                {name}
              </h3>
              {jutsu.referenceStatus && (
                <ReferencePill status={jutsu.referenceStatus} />
              )}
            </div>
            {jutsu.japaneseName && (
              <p className="text-xs text-ink-300 italic truncate mt-0.5">{jutsu.japaneseName}</p>
            )}
          </div>
        </div>

        <p className="text-sm text-ink-300 leading-relaxed line-clamp-3">
          {getLocalizedText(jutsu.shortDescription, locale)}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          <Badge variant="accent">
            {getAbilityCategoryLabel(world, jutsu.type, locale)}
          </Badge>
          {worldShowsAbilityRank(world) && jutsu.rank && (
            <Badge variant="ember">{jutsu.rank}</Badge>
          )}
          {attribute &&
            (jutsu.chakraNature ?? []).map((n) => (
              <Badge key={n} variant="danger">
                {attribute.label(n)}
              </Badge>
            ))}
        </div>
      </button>
    </Card>
  );
}
