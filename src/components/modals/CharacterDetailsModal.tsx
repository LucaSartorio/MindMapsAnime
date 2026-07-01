import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import { useLocaleStore } from '@/store/useLocaleStore';
import {
  getChakraNatureLabel,
  getCharacterImportanceLabel,
  getCharacterStatusLabel,
  getLocalizedText,
  getRaceLabel,
  getTransformationKindLabel,
} from '@/utils/localization';
import { CHAKRA_COLORS } from '@/utils/entityImage';
import { getCharacterChakraNatures } from '@/lib/characterChakra';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { EntityImage } from '@/components/common/EntityImage';
import { ReferencePill } from '@/components/common/StatusPill';
import { useMapStore, useUiStore } from '@/store';
import {
  findCharacter,
  findFaction,
  findJutsu,
  findLocation,
  findNation,
} from '@/lib/entities';
import {
  getAbilityCategoryLabel,
  getAbilityCategoryTerm,
  getAbilityTerm,
  getCharacterRankSystem,
  getRoleLabel,
  humanizeId,
} from '@/lib/worldConfig';

interface CharacterDetailsModalProps {
  dataset: WorldDataset;
  characterId: string;
}

export function CharacterDetailsModal({
  dataset,
  characterId,
}: CharacterDetailsModalProps) {
  const locale = useLocaleStore((s) => s.locale);
  const { t } = useTranslation();
  const character = findCharacter(dataset, characterId);
  const close = useUiStore((s) => s.closeModal);
  const openLocation = useUiStore((s) => s.openLocationModal);
  const openFaction = useUiStore((s) => s.openFactionModal);
  const openArc = useUiStore((s) => s.openArcModal);
  const openRoute = useUiStore((s) => s.openRouteModal);
  const openCharacter = useUiStore((s) => s.openCharacterModal);
  const openEvent = useUiStore((s) => s.openEventModal);
  const openJutsu = useUiStore((s) => s.openJutsuModal);
  const setActiveMapLevel = useMapStore((s) => s.setActiveMapLevel);
  const setSelectedLocation = useMapStore((s) => s.setSelectedLocation);
  const navigate = useNavigate();

  if (!character) {
    return (
      <Modal open onClose={close} title={t("modals.notFound")} size="sm">
        <p>{t("modals.invalidRef")}</p>
      </Modal>
    );
  }

  const village = findLocation(dataset, character.villageLocationId);
  const nation = findNation(dataset, character.nationId);
  const clans = (character.clanIds ?? [])
    .map((id) => findFaction(dataset, id))
    .filter((c): c is NonNullable<typeof c> => !!c);
  const jutsu = (character.jutsuIds ?? [])
    .map((id) => findJutsu(dataset, id))
    .filter((j): j is NonNullable<typeof j> => !!j);
  // Archi: discover bidirezionale (sia char.arcIds sia arc.characterIds).
  const arcIdSet = new Set(character.arcIds ?? []);
  const arcs = dataset.arcs
    .filter((a) => arcIdSet.has(a.id) || (a.characterIds ?? []).includes(character.id))
    .sort((a, b) => a.order - b.order);
  const chakraNatures = getCharacterChakraNatures(character, dataset);
  const events = dataset.events
    .filter((e) => (e.characterIds ?? []).includes(character.id))
    .sort((a, b) => a.order - b.order);
  const locations = (character.locationIds ?? [])
    .map((id) => findLocation(dataset, id))
    .filter((l): l is NonNullable<typeof l> => !!l);
  const charRoutes = dataset.routes.filter(
    (r) =>
      r.protagonistCharacterIds.includes(character.id) ||
      (r.primaryCharacterIds ?? []).includes(character.id) ||
      (r.relatedCharacterIds ?? []).includes(character.id),
  );

  const rankSystem = getCharacterRankSystem(dataset.world, locale);
  const raceLabel = character.race
    ? getRaceLabel(character.race, locale) || humanizeId(character.race)
    : undefined;
  const transformations = [...(character.transformations ?? [])].sort(
    (a, b) => a.order - b.order,
  );

  const statusVariant: 'success' | 'danger' | 'default' =
    character.status === 'alive'
      ? 'success'
      : character.status === 'deceased'
        ? 'danger'
        : 'default';

  return (
    <Modal
      open
      onClose={close}
      media={
        <EntityImage
          kind="character"
          id={character.id}
          name={character.name}
          villageId={character.villageLocationId}
          fit="cover"
        />
      }
      eyebrow={t("modals.character")}
      title={character.name}
      badges={
        <>
          {raceLabel && <Badge variant="danger">{raceLabel}</Badge>}
          {character.ninjaRank && rankSystem && (
            <Badge variant="accent">
              {rankSystem.label(character.ninjaRank)}
            </Badge>
          )}
          {character.rank && (
            <Badge className="capitalize">{character.rank}</Badge>
          )}
          {character.importance && (
            <Badge>{getCharacterImportanceLabel(character.importance, locale)}</Badge>
          )}
          {(character.role ?? []).map((r) => (
            <Badge key={r} variant="ember">
              {getRoleLabel(dataset.world, r, locale)}
            </Badge>
          ))}
          {character.abilityCategory && (
            <Badge variant="accent">
              {getAbilityCategoryTerm(dataset.world, locale, locale === 'it' ? 'Categoria' : 'Category')}:{' '}
              {getAbilityCategoryLabel(dataset.world, character.abilityCategory, locale)}
            </Badge>
          )}
          {village && <Badge>{getLocalizedText(village.localizedName, locale) || village.name}</Badge>}
          {nation && <Badge>{getLocalizedText(nation.localizedName, locale) || nation.name}</Badge>}
          <Badge variant={statusVariant}>
            {getCharacterStatusLabel(character.status, locale)}
          </Badge>
          {character.referenceStatus && (
            <ReferencePill status={character.referenceStatus} />
          )}
        </>
      }
      footer={
        <>
          {village && (
            <Button
              variant="ghost"
              onClick={() => {
                setActiveMapLevel(village.mapLevelId);
                setSelectedLocation(village.id);
                navigate(`/worlds/${dataset.world.slug}`);
                close();
              }}
            >
              {t("modals.showVillage")}
            </Button>
          )}
          <Button variant="primary" onClick={close}>
            {t("modals.close")}
          </Button>
        </>
      }
    >
      {character.nameLocal && (
        <p className="text-xs text-ink-300 italic -mt-2">
          {character.nameLocal}
        </p>
      )}
      {character.aliases && character.aliases.length > 0 && (
        <p className="text-xs text-ink-400 italic">
          {t('modals.aliases', { aliases: character.aliases.join(' · ') })}
        </p>
      )}
      <p className="leading-relaxed">
        {getLocalizedText(character.shortDescription, locale)}
      </p>
      {character.longDescription && (
        <p className="text-ink-300 leading-relaxed">
          {getLocalizedText(character.longDescription, locale)}
        </p>
      )}

      {transformations.length > 0 && (
        <Section title={t('modals.transformations')}>
          <ol className="space-y-1.5">
            {transformations.map((tr) => (
              <li
                key={tr.id}
                className="flex items-start justify-between gap-2 panel-soft px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-sm text-ink-100">
                    <span className="text-ink-500 font-mono text-[11px] mr-1.5">
                      #{tr.order}
                    </span>
                    {getLocalizedText(tr.localizedName, locale) || tr.name}
                  </p>
                  {tr.description && (
                    <p className="text-xs text-ink-400 mt-0.5">
                      {getLocalizedText(tr.description, locale)}
                    </p>
                  )}
                </div>
                {tr.kind && (
                  <Badge variant="ember" className="shrink-0">
                    {getTransformationKindLabel(tr.kind, locale)}
                  </Badge>
                )}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {(character.bounties ?? []).length > 0 && (
        <Section title={t('modals.bounty')}>
          <ol className="space-y-1.5">
            {character.bounties!.map((b, i) => {
              const last = i === character.bounties!.length - 1;
              const refs = [
                b.mangaChapter ? `Manga ${b.mangaChapter}` : null,
                b.animeEpisode ? `Anime ${b.animeEpisode}` : null,
              ].filter(Boolean);
              return (
                <li
                  key={i}
                  className="flex items-baseline justify-between gap-2 text-sm"
                >
                  <span className="flex items-baseline gap-2 min-w-0">
                    <span
                      className={
                        'font-mono font-semibold ' +
                        (last ? 'text-ember-300' : 'text-ink-300')
                      }
                    >
                      ฿{b.amount}
                    </span>
                    {b.note && (
                      <span className="text-[11px] text-ink-400 truncate">
                        {getLocalizedText(b.note, locale)}
                      </span>
                    )}
                  </span>
                  {refs.length > 0 && (
                    <span className="text-[10px] text-ink-500 font-mono shrink-0">
                      {refs.join(' · ')}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </Section>
      )}

      {(character.trivia ?? []).length > 0 && (
        <Section title={t('modals.trivia')}>
          <ul className="space-y-1.5">
            {character.trivia!.map((tv, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink-200 leading-relaxed">
                <span className="text-chakra-300 shrink-0" aria-hidden>›</span>
                <span>{getLocalizedText(tv, locale)}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {(character.abilities ?? []).length > 0 && (
        <Section title={t("modals.abilities")}>
          <div className="flex flex-wrap gap-1.5">
            {character.abilities!.map((a) => (
              <Badge key={a} variant="ember">
                {a}
              </Badge>
            ))}
          </div>
        </Section>
      )}

      {(character.kekkeiGenkai ?? []).length > 0 && (
        <Section title={t("modals.kekkeiGenkai")}>
          <div className="flex flex-wrap gap-1.5">
            {character.kekkeiGenkai!.map((k) => (
              <Badge key={k} variant="danger">
                {k}
              </Badge>
            ))}
          </div>
        </Section>
      )}

      {chakraNatures.length > 0 && (
        <Section title={t('modals.chakraNature')}>
          <div className="flex flex-wrap gap-1.5">
            {chakraNatures.map((n) => (
              <span
                key={n}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-700/60 bg-ink-900/70 px-2.5 py-1 text-xs text-ink-100"
              >
                <span
                  aria-hidden
                  className="inline-block h-2.5 w-2.5 rounded-full ring-1 ring-black/30"
                  style={{ backgroundColor: CHAKRA_COLORS[n] }}
                />
                {getChakraNatureLabel(n, locale)}
              </span>
            ))}
          </div>
        </Section>
      )}

      {(character.family ?? []).length > 0 && (
        <Section title={t("modals.family")}>
          <div className="flex flex-wrap gap-1.5">
            {character.family!.map((id) => {
              const f = findCharacter(dataset, id);
              if (!f) return null;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => openCharacter(id)}
                  className="chip hover:border-chakra-500/70 hover:text-white"
                >
                  {f.name}
                </button>
              );
            })}
          </div>
        </Section>
      )}

      {(character.teachers ?? []).length > 0 && (
        <Section title={t("modals.teachers")}>
          <div className="flex flex-wrap gap-1.5">
            {character.teachers!.map((id) => {
              const f = findCharacter(dataset, id);
              if (!f) return null;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => openCharacter(id)}
                  className="chip hover:border-chakra-500/70 hover:text-white"
                >
                  {f.name}
                </button>
              );
            })}
          </div>
        </Section>
      )}

      {(character.students ?? []).length > 0 && (
        <Section title={t("modals.students")}>
          <div className="flex flex-wrap gap-1.5">
            {character.students!.map((id) => {
              const f = findCharacter(dataset, id);
              if (!f) return null;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => openCharacter(id)}
                  className="chip hover:border-chakra-500/70 hover:text-white"
                >
                  {f.name}
                </button>
              );
            })}
          </div>
        </Section>
      )}

      {((character.allies ?? []).length > 0 ||
        (character.enemies ?? []).length > 0) && (
        <Section title={t("modals.alliesEnemies")}>
          <div className="flex flex-wrap gap-1.5">
            {(character.allies ?? []).map((id) => {
              const f = findCharacter(dataset, id);
              if (!f) return null;
              return (
                <button
                  key={`ally-${id}`}
                  type="button"
                  onClick={() => openCharacter(id)}
                  className="chip border-emerald-700/50 bg-emerald-900/30 text-emerald-200 hover:text-white"
                >
                  + {f.name}
                </button>
              );
            })}
            {(character.enemies ?? []).map((id) => {
              const f = findCharacter(dataset, id);
              if (!f) return null;
              return (
                <button
                  key={`enemy-${id}`}
                  type="button"
                  onClick={() => openCharacter(id)}
                  className="chip border-red-700/50 bg-red-900/30 text-red-200 hover:text-white"
                >
                  − {f.name}
                </button>
              );
            })}
          </div>
        </Section>
      )}

      {clans.length > 0 && (
        <Section title={t("modals.relatedClans")}>
          <div className="flex flex-wrap gap-1.5">
            {clans.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => openFaction(c.id)}
                className="chip-accent hover:border-chakra-300 hover:text-white"
              >
                {c.name}
              </button>
            ))}
          </div>
        </Section>
      )}

      {jutsu.length > 0 && (
        <Section title={t('modals.relatedJutsu', { term: getAbilityTerm(dataset.world, locale) })}>
          <div className="flex flex-wrap gap-1.5">
            {jutsu.map((j) => (
              <button
                key={j.id}
                type="button"
                onClick={() => openJutsu(j.id)}
                className="chip hover:border-chakra-500/70 hover:text-white"
              >
                {getLocalizedText(j.localizedName, locale) || j.name}
              </button>
            ))}
          </div>
        </Section>
      )}

      {character.relationships && character.relationships.length > 0 && (
        <Section title={t("modals.relationships")}>
          <ul className="space-y-1.5">
            {character.relationships.map((r) => {
              const target = findCharacter(dataset, r.targetCharacterId);
              if (!target) return null;
              return (
                <li
                  key={r.targetCharacterId}
                  className="flex items-center justify-between gap-2 panel-soft px-3 py-2"
                >
                  <button
                    type="button"
                    onClick={() => openCharacter(target.id)}
                    className="text-left text-ink-100 hover:text-chakra-200"
                  >
                    {target.name}
                  </button>
                  <span className="text-xs text-ink-300">{r.label}</span>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {locations.length > 0 && (
        <Section title={t("modals.relatedLocations")}>
          <div className="flex flex-wrap gap-1.5">
            {locations.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => openLocation(l.id)}
                className="chip hover:border-chakra-500/70 hover:text-white"
              >
                {l.name}
              </button>
            ))}
          </div>
        </Section>
      )}

      {arcs.length > 0 && (
        <Section title={t("modals.relatedArcs")}>
          <ul className="space-y-1.5">
            {arcs.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => openArc(a.id)}
                  className="text-left text-ink-100 hover:text-chakra-200 inline-flex items-center gap-2"
                >
                  <span className="text-ember-400">◆</span>
                  {a.name}
                </button>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {charRoutes.length > 0 && (
        <Section title={t('modals.routes', { count: charRoutes.length })}>
          <div className="flex flex-wrap gap-1.5">
            {charRoutes.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => openRoute(r.id)}
                className="chip hover:border-chakra-500/70 hover:text-white"
              >
                <span
                  aria-hidden
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: r.color ?? '#1f9aff' }}
                />
                {r.name}
              </button>
            ))}
          </div>
        </Section>
      )}

      {events.length > 0 && (
        <Section title={t("modals.relatedEvents")}>
          <ul className="grid sm:grid-cols-2 gap-2">
            {events.slice(0, 8).map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => openEvent(e.id)}
                  className="text-left w-full panel-soft p-3 hover:border-chakra-500/60 transition"
                >
                  <p className="text-ink-100 text-sm">
                    {getLocalizedText(e.title, locale)}
                  </p>
                  <p className="text-[11px] text-ink-400 mt-0.5">
                    #{e.order} · {getLocalizedText(e.period, locale)}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </Modal>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="font-display text-[11px] uppercase tracking-widest text-chakra-300 mb-2">
        {title}
      </h3>
      {children}
    </section>
  );
}
