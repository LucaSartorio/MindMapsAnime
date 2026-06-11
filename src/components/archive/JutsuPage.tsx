import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import { JutsuCard } from './JutsuCard';
import { FeaturedStrip, type FeaturedTile } from './FeaturedStrip';
import { EntityImage } from '@/components/common/EntityImage';
import { EmptyState } from '@/components/common/EmptyState';
import { SourceNotice } from '@/components/common/SourceNotice';
import { useMapStore, useUiStore } from '@/store';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';
import {
  getAbilityAttribute,
  getAbilityCategoryLabel,
  getAbilityCategoryTerm,
  getAbilityTerm,
  getFeaturedIds,
} from '@/lib/worldConfig';
import { filterJutsuBySeries } from '@/lib/filters';

interface JutsuPageProps {
  dataset: WorldDataset;
}

export function JutsuPage({ dataset }: JutsuPageProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const term = getAbilityTerm(dataset.world, locale);
  // Attributo secondario (per Naruto: natura del chakra). `null` se il mondo
  // non lo usa: in quel caso il filtro e i badge relativi spariscono.
  const attribute = useMemo(
    () => getAbilityAttribute(dataset.world, locale),
    [dataset.world, locale],
  );
  const [params] = useSearchParams();
  const initialId = params.get('id');
  const [query, setQuery] = useState('');
  // Differita: i tasti dipingono subito, il refiltro pesante gira a bassa priorità.
  const deferredQuery = useDeferredValue(query);
  const [filterType, setFilterType] = useState<string>('');
  const [filterNature, setFilterNature] = useState<string>('');
  const openJutsuModal = useUiStore((s) => s.openJutsuModal);
  const filters = useMapStore((s) => s.filters);

  const allJutsu = useMemo(
    () => filterJutsuBySeries(dataset.jutsu ?? [], filters, dataset),
    [dataset, filters],
  );

  useEffect(() => {
    if (initialId) openJutsuModal(initialId);
  }, [initialId, openJutsuModal]);

  const featuredOrder = useMemo(
    () => getFeaturedIds(dataset.world, 'abilities'),
    [dataset.world],
  );

  const types = useMemo(() => {
    const set = new Set<string>();
    for (const j of allJutsu) set.add(j.type);
    return [...set].sort();
  }, [allJutsu]);

  const natures = useMemo(() => {
    const set = new Set<string>();
    for (const j of allJutsu) for (const n of j.chakraNature ?? []) set.add(n);
    return [...set].sort();
  }, [allJutsu]);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return allJutsu
      .filter((j) => {
        if (q) {
          const name = (
            getLocalizedText(j.localizedName, locale) || j.name
          ).toLowerCase();
          const desc = getLocalizedText(j.shortDescription, locale).toLowerCase();
          if (
            !name.includes(q) &&
            !j.name.toLowerCase().includes(q) &&
            !desc.includes(q)
          )
            return false;
        }
        if (filterType && j.type !== filterType) return false;
        if (filterNature && !(j.chakraNature ?? []).includes(filterNature))
          return false;
        return true;
      })
      .sort((a, b) =>
        (getLocalizedText(a.localizedName, locale) || a.name).localeCompare(
          getLocalizedText(b.localizedName, locale) || b.name,
        ),
      );
  }, [allJutsu, deferredQuery, filterType, filterNature, locale]);

  /** Vetrina jutsu: prende dalla whitelist in ordine, intersecando con
   * quanto è presente nel dataset filtrato per serie. Nascosta se l'utente
   * sta cercando o filtrando per tipo/natura. */
  const featuredItems: FeaturedTile[] = useMemo(() => {
    if (deferredQuery.trim() || filterType || filterNature) return [];
    const map = new Map(allJutsu.map((j) => [j.id, j]));
    const ranked = featuredOrder
      .map((id) => map.get(id))
      .filter((j): j is NonNullable<typeof j> => !!j)
      .slice(0, 6);
    return ranked.map((j) => {
      const n = getLocalizedText(j.localizedName, locale) || j.name;
      const nature =
        attribute && j.chakraNature?.[0]
          ? attribute.label(j.chakraNature[0])
          : undefined;
      return {
        id: j.id,
        title: n,
        subtitle: nature,
        caption: j.rank ? `RANK ${j.rank}` : undefined,
        image: (
          <EntityImage
            kind="jutsu"
            id={j.id}
            name={n}
            chakraNature={j.chakraNature?.[0]}
            fit="cover"
          />
        ),
        onClick: () => openJutsuModal(j.id),
      };
    });
  }, [allJutsu, locale, deferredQuery, filterType, filterNature, openJutsuModal, attribute, featuredOrder]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-chakra-300">
          {dataset.world.title}
        </p>
        <h1 className="font-display text-3xl text-ink-100">
          {t('jutsu.archiveTitle', { term })}
        </h1>
        <p className="text-sm text-ink-300 max-w-2xl">{t('jutsu.archiveLead')}</p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder={t('jutsu.searchPlaceholder', { term })}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="panel-soft px-3 py-2 text-sm flex-1 min-w-[200px]"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="panel-soft px-3 py-2 text-sm"
          aria-label={getAbilityCategoryTerm(
            dataset.world,
            locale,
            t('jutsu.typeFilterAria', { term }),
          )}
        >
          <option value="">{t('jutsu.typeFilterAll')}</option>
          {types.map((ty) => (
            <option key={ty} value={ty}>
              {getAbilityCategoryLabel(dataset.world, ty, locale)}
            </option>
          ))}
        </select>
        {attribute && natures.length > 0 && (
          <select
            value={filterNature}
            onChange={(e) => setFilterNature(e.target.value)}
            className="panel-soft px-3 py-2 text-sm"
            aria-label={attribute.term}
          >
            <option value="">{t('jutsu.natureFilterAll')}</option>
            {natures.map((n) => (
              <option key={n} value={n}>
                {attribute.label(n)}
              </option>
            ))}
          </select>
        )}
      </div>

      <SourceNotice compact />

      <FeaturedStrip
        title={t('jutsu.featuredTitle')}
        hint={t('jutsu.featuredHint')}
        items={featuredItems}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title={t('jutsu.empty')}
          description={t('jutsu.emptyDescription')}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((j) => (
            <li key={j.id} className="cv-auto">
              <JutsuCard
                jutsu={j}
                dataset={dataset}
                onSelect={openJutsuModal}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
