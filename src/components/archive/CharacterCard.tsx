import { memo } from 'react';
import type { Character, WorldDataset } from '@/types';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { EntityImage } from '@/components/common/EntityImage';
import { ReferencePill } from '@/components/common/StatusPill';
import { cn } from '@/lib/cn';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getCharacterStatusLabel, getChakraNatureLabel, getLocalizedText, getRaceLabel } from '@/utils/localization';
import { getAbilityCategoryLabel, getCharacterRankSystem, humanizeId } from '@/lib/worldConfig';
import { getCharacterChakraNatures } from '@/lib/characterChakra';
import { CHAKRA_COLORS } from '@/utils/entityImage';

interface CharacterCardProps {
  character: Character;
  dataset: WorldDataset;
  active?: boolean;
  onSelect: (id: string) => void;
}

function CharacterCardComponent({
  character,
  dataset,
  active,
  onSelect,
}: CharacterCardProps) {
  const locale = useLocaleStore((s) => s.locale);
  const rankSystem = getCharacterRankSystem(dataset.world, locale);
  const village = character.villageLocationId
    ? dataset.locations.find((l) => l.id === character.villageLocationId)
    : undefined;
  const clans =
    character.clanIds?.map((id) => dataset.factions.find((f) => f.id === id)) ?? [];
  const natures = getCharacterChakraNatures(character, dataset);
  const raceLabel = character.race
    ? getRaceLabel(character.race, locale) || humanizeId(character.race)
    : undefined;

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
        onClick={() => onSelect(character.id)}
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
            {natures.length > 0 && (
              <div
                className="mt-1 flex items-center gap-1"
                aria-label={natures
                  .map((n) => getChakraNatureLabel(n, locale))
                  .join(', ')}
                title={natures
                  .map((n) => getChakraNatureLabel(n, locale))
                  .join(' · ')}
              >
                {natures.slice(0, 6).map((n) => (
                  <span
                    key={n}
                    aria-hidden
                    className="inline-block h-2 w-2 rounded-full ring-1 ring-black/40"
                    style={{ backgroundColor: CHAKRA_COLORS[n] }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-ink-300 leading-relaxed line-clamp-3">
          {getLocalizedText(character.shortDescription, locale)}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {raceLabel && <Badge variant="danger">{raceLabel}</Badge>}
          {character.ninjaRank && rankSystem ? (
            <Badge variant="accent">
              {rankSystem.label(character.ninjaRank)}
            </Badge>
          ) : character.rank ? (
            <Badge variant="accent">{character.rank}</Badge>
          ) : null}
          {character.abilityCategory && (
            <Badge variant="default">
              {getAbilityCategoryLabel(dataset.world, character.abilityCategory, locale)}
            </Badge>
          )}
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

export const CharacterCard = memo(CharacterCardComponent);
