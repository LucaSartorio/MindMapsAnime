import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import { CharacterCard } from './CharacterCard';
import { FeaturedStrip, type FeaturedTile } from './FeaturedStrip';
import { EntityImage } from '@/components/common/EntityImage';
import { EmptyState } from '@/components/common/EmptyState';
import { SourceNotice } from '@/components/common/SourceNotice';
import { useMapStore, useUiStore } from '@/store';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';
import { getCharacterRankOrder, getCharacterRankSystem } from '@/lib/worldConfig';
import { filterCharactersBySeries } from '@/lib/filters';

interface CharactersPageProps {
  dataset: WorldDataset;
}

export function CharactersPage({ dataset }: CharactersPageProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const [params] = useSearchParams();
  const initialId = params.get('id');
  const [query, setQuery] = useState('');
  // Differita: i tasti dipingono subito, il refiltro delle card (centinaia su
  // One Piece) avviene in un render a bassa priorità → INP basso.
  const deferredQuery = useDeferredValue(query);
  const [filterVillage, setFilterVillage] = useState<string>('');
  const [filterRank, setFilterRank] = useState<string>('');
  const openCharacterModal = useUiStore((s) => s.openCharacterModal);
  const filters = useMapStore((s) => s.filters);

  useEffect(() => {
    if (initialId) openCharacterModal(initialId);
  }, [initialId, openCharacterModal]);

  const villages = useMemo(
    () =>
      dataset.locations
        .filter((l) => l.type === 'village')
        .sort((a, b) => a.name.localeCompare(b.name)),
    [dataset.locations],
  );

  // Sistema di gradi dinamico: presente solo se il mondo lo configura e se
  // esistono personaggi con un grado. HxH (nessun grado ninja) non lo mostra.
  const rankSystem = useMemo(
    () => getCharacterRankSystem(dataset.world, locale),
    [dataset.world, locale],
  );
  const ranks = useMemo(() => {
    if (!rankSystem) return [];
    const present = new Set(
      dataset.characters
        .map((c) => c.ninjaRank)
        .filter((r): r is string => !!r),
    );
    return getCharacterRankOrder(dataset.world).filter((r) => present.has(r));
  }, [dataset.characters, dataset.world, rankSystem]);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    const bySeries = filterCharactersBySeries(dataset.characters, filters, dataset);
    return bySeries
      .filter((c) => {
        if (q) {
          const desc = getLocalizedText(c.shortDescription, locale).toLowerCase();
          if (!c.name.toLowerCase().includes(q) && !desc.includes(q))
            return false;
        }
        if (filterVillage && c.villageLocationId !== filterVillage)
          return false;
        if (filterRank && c.ninjaRank !== filterRank)
          return false;
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [dataset, filters, deferredQuery, filterVillage, filterRank, locale]);

  /** Vetrina iniziale: i sei "main" più rappresentativi (filtrati per serie,
   * ignorando ricerca/filtri locali — non vogliamo che cambi sotto le mani
   * scrivendo nella search box). Quando l'utente cerca o filtra, la nasconde
   * per dare priorità ai risultati. */
  const featuredItems: FeaturedTile[] = useMemo(() => {
    if (deferredQuery.trim() || filterVillage || filterRank) return [];
    const bySeries = filterCharactersBySeries(dataset.characters, filters, dataset);
    const ranked = bySeries
      .filter((c) => c.importance === 'main' || c.importance === 'major')
      .sort((a, b) => {
        // Priorità ai 'main', poi ordine alfabetico per stabilità.
        if (a.importance !== b.importance) return a.importance === 'main' ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 6);
    return ranked.map((c) => {
      const v = c.villageLocationId
        ? dataset.locations.find((l) => l.id === c.villageLocationId)
        : undefined;
      return {
        id: c.id,
        title: c.name,
        subtitle: v
          ? getLocalizedText(v.localizedName, locale) || v.name
          : undefined,
        caption:
          rankSystem && c.ninjaRank ? rankSystem.label(c.ninjaRank) : undefined,
        image: (
          <EntityImage
            kind="character"
            id={c.id}
            name={c.name}
            villageId={c.villageLocationId}
            fit="cover"
          />
        ),
        onClick: () => openCharacterModal(c.id),
      };
    });
  }, [dataset, filters, locale, deferredQuery, filterVillage, filterRank, openCharacterModal]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-chakra-300">
          {dataset.world.title}
        </p>
        <h1 className="font-display text-3xl text-ink-100">
          {t('characters.archiveTitle')}
        </h1>
        <p className="text-sm text-ink-300 max-w-2xl">
          {t('characters.archiveLead')}
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder={t('characters.searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="panel-soft px-3 py-2 text-sm flex-1 min-w-[200px]"
        />
        <select
          value={filterVillage}
          onChange={(e) => setFilterVillage(e.target.value)}
          className="panel-soft px-3 py-2 text-sm"
          aria-label={t('characters.villageFilterAria')}
        >
          <option value="">{t('characters.villageFilter')}</option>
          {villages.map((v) => (
            <option key={v.id} value={v.id}>
              {getLocalizedText(v.localizedName, locale) || v.name}
            </option>
          ))}
        </select>
        {ranks.length > 0 && rankSystem && (
          <select
            value={filterRank}
            onChange={(e) => setFilterRank(e.target.value)}
            className="panel-soft px-3 py-2 text-sm"
            aria-label={rankSystem.term}
          >
            <option value="">{t('characters.rankFilter')}</option>
            {ranks.map((r) => (
              <option key={r} value={r}>
                {rankSystem.label(r)}
              </option>
            ))}
          </select>
        )}
      </div>

      <SourceNotice compact />

      <FeaturedStrip
        title={t('characters.featuredTitle')}
        hint={t('characters.featuredHint')}
        items={featuredItems}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title={t('characters.empty')}
          description={t('characters.emptyDescription')}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((c) => (
            <li key={c.id}>
              <CharacterCard
                character={c}
                dataset={dataset}
                onClick={() => openCharacterModal(c.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
