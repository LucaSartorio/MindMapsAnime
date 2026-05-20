import type { Faction, WorldDataset } from '@/types';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { cn } from '@/lib/cn';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';

interface ClanFactionCardProps {
  faction: Faction;
  dataset: WorldDataset;
  active?: boolean;
  onClick?: () => void;
}

export function ClanFactionCard({
  faction,
  dataset,
  active,
  onClick,
}: ClanFactionCardProps) {
  const locale = useLocaleStore((s) => s.locale);
  const village = faction.villageLocationId
    ? dataset.locations.find((l) => l.id === faction.villageLocationId)
    : undefined;

  const name = getLocalizedText(faction.localizedName, locale) || faction.name;

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
        onClick={onClick}
        className="text-left w-full flex flex-col gap-2"
      >
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-lg text-ink-100">{name}</h3>
          <Badge
            variant={
              faction.type === 'clan'
                ? 'accent'
                : faction.type === 'organization'
                  ? 'ember'
                  : 'default'
            }
            className="capitalize"
          >
            {faction.type}
          </Badge>
        </div>
        {faction.nameLocal && (
          <p className="text-xs text-ink-300 italic">{faction.nameLocal}</p>
        )}
        <p className="text-sm text-ink-300 leading-relaxed">
          {getLocalizedText(faction.description, locale)}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {village && (
            <Badge>
              {getLocalizedText(village.localizedName, locale) || village.name}
            </Badge>
          )}
          {faction.kekkeiGenkai && (
            <Badge variant="danger">{faction.kekkeiGenkai}</Badge>
          )}
          {(faction.signatureAbilities ?? []).slice(0, 3).map((a) => (
            <Badge key={a} variant="ember">
              {a}
            </Badge>
          ))}
        </div>
      </button>
    </Card>
  );
}
