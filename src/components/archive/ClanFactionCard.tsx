import type { Faction, WorldDataset } from '@/types';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { EntityImage } from '@/components/common/EntityImage';
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
        'p-0 h-full overflow-hidden cursor-pointer',
        active && 'border-ember-500/70 shadow-ember',
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className="text-left w-full h-full flex flex-col p-4 gap-3"
      >
        <div className="flex items-start gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-ink-700/60 bg-ink-900 shadow-md">
            <EntityImage
              kind="clan"
              id={faction.id}
              name={name}
              villageId={faction.villageLocationId}
              fit="cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-lg text-ink-100 leading-tight line-clamp-2">
                {name}
              </h3>
              <Badge
                variant={
                  faction.type === 'clan'
                    ? 'accent'
                    : faction.type === 'organization'
                      ? 'ember'
                      : 'default'
                }
                className="capitalize shrink-0"
              >
                {faction.type}
              </Badge>
            </div>
            {faction.nameLocal && (
              <p className="text-xs text-ink-300 italic truncate mt-0.5">
                {faction.nameLocal}
              </p>
            )}
          </div>
        </div>

        <p className="text-sm text-ink-300 leading-relaxed line-clamp-3">
          {getLocalizedText(faction.description, locale)}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto">
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
