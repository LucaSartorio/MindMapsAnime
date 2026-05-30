import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { FactionType, WorldDataset } from '@/types';
import { ClanFactionCard } from './ClanFactionCard';
import { FeaturedStrip, type FeaturedTile } from './FeaturedStrip';
import { EntityImage } from '@/components/common/EntityImage';
import { EmptyState } from '@/components/common/EmptyState';
import { SourceNotice } from '@/components/common/SourceNotice';
import { useMapStore, useUiStore } from '@/store';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';
import { filterFactionsBySeries } from '@/lib/filters';

/** Clan in evidenza: lista curata di id che "valgono la copertina" se il
 *  mondo li include. Stabile e prevedibile, senza pescare a caso. */
const CLAN_FEATURED_ORDER = [
  'clan-uchiha',
  'clan-senju',
  'clan-uzumaki',
  'clan-hyuga',
  'faction-akatsuki-original',
  'clan-nara',
  'clan-yamanaka',
  'clan-aburame',
  'clan-inuzuka',
  'clan-hatake',
];

interface ClansAndFactionsPageProps {
  dataset: WorldDataset;
}

const TYPE_KEYS: Array<{ value: FactionType | ''; tKey: string }> = [
  { value: '', tKey: 'clans.types.all' },
  { value: 'clan', tKey: 'clans.types.clan' },
  { value: 'organization', tKey: 'clans.types.organization' },
  { value: 'army', tKey: 'clans.types.army' },
  { value: 'group', tKey: 'clans.types.group' },
  { value: 'village', tKey: 'clans.types.village' },
];

export function ClansAndFactionsPage({ dataset }: ClansAndFactionsPageProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const [params] = useSearchParams();
  const initialId = params.get('id');
  const [filter, setFilter] = useState<FactionType | ''>('');
  const [query, setQuery] = useState('');
  const openFactionModal = useUiStore((s) => s.openFactionModal);
  const filters = useMapStore((s) => s.filters);

  useEffect(() => {
    if (initialId) openFactionModal(initialId);
  }, [initialId, openFactionModal]);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const bySeries = filterFactionsBySeries(dataset.factions, filters, dataset);
    return bySeries
      .filter((f) => {
        if (filter && f.type !== filter) return false;
        if (q) {
          const desc = getLocalizedText(f.description, locale).toLowerCase();
          if (!f.name.toLowerCase().includes(q) && !desc.includes(q))
            return false;
        }
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [dataset, filters, filter, query, locale]);

  /** Vetrina clan: prende dalla whitelist in ordine, intersecando con
   *  quanto è presente nel dataset filtrato per serie. Vuota se l'utente
   *  sta cercando o filtrando per tipo. */
  const featuredItems: FeaturedTile[] = useMemo(() => {
    if (query.trim() || filter) return [];
    const bySeries = filterFactionsBySeries(dataset.factions, filters, dataset);
    const map = new Map(bySeries.map((f) => [f.id, f]));
    const ranked = CLAN_FEATURED_ORDER
      .map((id) => map.get(id))
      .filter((f): f is NonNullable<typeof f> => !!f)
      .slice(0, 6);
    return ranked.map((f) => {
      const name = getLocalizedText(f.localizedName, locale) || f.name;
      const village = f.villageLocationId
        ? dataset.locations.find((l) => l.id === f.villageLocationId)
        : undefined;
      return {
        id: f.id,
        title: name,
        subtitle: village
          ? getLocalizedText(village.localizedName, locale) || village.name
          : undefined,
        caption: f.type.toUpperCase(),
        image: (
          <EntityImage
            kind="clan"
            id={f.id}
            name={name}
            villageId={f.villageLocationId}
            fit="cover"
          />
        ),
        onClick: () => openFactionModal(f.id),
      };
    });
  }, [dataset, filters, locale, query, filter, openFactionModal]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-chakra-300">
          {dataset.world.title}
        </p>
        <h1 className="font-display text-3xl text-ink-100">
          {t('clans.archiveTitle')}
        </h1>
        <p className="text-sm text-ink-300 max-w-2xl">{t('clans.archiveLead')}</p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder={t('clans.searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="panel-soft px-3 py-2 text-sm flex-1 min-w-[200px]"
        />
        <div className="flex flex-wrap gap-1.5">
          {TYPE_KEYS.map((tk) => (
            <button
              key={tk.value}
              type="button"
              onClick={() => setFilter(tk.value)}
              aria-pressed={filter === tk.value}
              className={
                'px-3 py-1.5 rounded-full text-xs transition border ' +
                (filter === tk.value
                  ? 'bg-chakra-500 text-white border-chakra-300'
                  : 'border-ink-600/60 text-ink-200 hover:border-chakra-500/50')
              }
            >
              {t(tk.tKey)}
            </button>
          ))}
        </div>
      </div>

      <SourceNotice compact />

      <FeaturedStrip
        title={t('clans.featuredTitle')}
        hint={t('clans.featuredHint')}
        items={featuredItems}
      />

      {items.length === 0 ? (
        <EmptyState
          title={t('clans.empty')}
          description={t('clans.emptyDescription')}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <li key={f.id}>
              <ClanFactionCard
                faction={f}
                dataset={dataset}
                onClick={() => openFactionModal(f.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
