import type { Character, WorldDataset } from '@/types';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { EntityImage } from '@/components/common/EntityImage';
import { ReferencePill } from '@/components/common/StatusPill';
import { cn } from '@/lib/cn';
import { useLocaleStore } from '@/store/useLocaleStore';
import {
  getCharacterStatusLabel,
  getLocalizedText,
  getNinjaRankLabel,
} from '@/utils/localization';

interface CharacterCardProps {
  character: Character;
  dataset: WorldDataset;
  active?: boolean;
  onClick?: () => void;
}

export function CharacterCard({
  character,
  dataset,
  active,
  onClick,
}: CharacterCardProps) {
  const locale = useLocaleStore((s) => s.locale);
  const village = character.villageLocationId
    ? dataset.locations.find((l) => l.id === character.villageLocationId)
    : undefined;
  const clans =
    character.clanIds?.map((id) => dataset.factions.find((f) => f.id === id)) ?? [];

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
        {/* Riga superiore: miniatura quadrata + titolo (stesso linguaggio del modale) */}
        <div className="flex items-start gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-ink-700/60 bg-ink-900 shadow-md">
            <EntityImage
              kind="character"
              id={character.id}
              name={character.name}
              villageId={character.villageLocationId}
              fit="cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-lg text-ink-100 leading-tight line-clamp-2">
                {character.name}
              </h3>
              {character.referenceStatus && (
                <ReferencePill status={character.referenceStatus} />
              )}
            </div>
            {character.nameLocal && (
              <p className="text-xs text-ink-300 italic truncate mt-0.5">
                {character.nameLocal}
              </p>
            )}
          </div>
        </div>

        <p className="text-sm text-ink-300 leading-relaxed line-clamp-3">
          {getLocalizedText(character.shortDescription, locale)}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {character.ninjaRank ? (
            <Badge variant="accent">
              {getNinjaRankLabel(character.ninjaRank, locale)}
            </Badge>
          ) : character.rank ? (
            <Badge variant="accent">{character.rank}</Badge>
          ) : null}
          {village && (
            <Badge>
              {getLocalizedText(village.localizedName, locale) || village.name}
            </Badge>
          )}
          {clans.filter(Boolean).map(
            (c) =>
              c && (
                <Badge key={c.id} variant="ember">
                  {getLocalizedText(c.localizedName, locale) || c.name}
                </Badge>
              ),
          )}
          <Badge
            variant={
              character.status === 'alive'
                ? 'success'
                : character.status === 'deceased'
                  ? 'danger'
                  : 'default'
            }
            className="capitalize"
          >
            {getCharacterStatusLabel(character.status, locale)}
          </Badge>
        </div>
      </button>
    </Card>
  );
}
