import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { animeWorlds } from '@/data/worlds';
import { searchWorlds } from '@/lib/search';
import { HeroSection } from './HeroSection';
import { WorldGrid } from './WorldGrid';
import { EmptyState } from '@/components/common/EmptyState';
import { Card } from '@/components/common/Card';
import { useLocaleStore } from '@/store/useLocaleStore';

/** Quanti mondi mostrare prima del "Mostra tutti" (homepage compatta). */
const INITIAL_VISIBLE = 3;

export function HomePage() {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const filteredWorlds = useMemo(() => {
    if (!query.trim()) return animeWorlds;
    const results = searchWorlds(query, animeWorlds, locale);
    const ids = new Set(results.map((r) => r.id));
    return animeWorlds.filter((w) => ids.has(w.id));
  }, [query, locale]);

  // Durante una ricerca mostriamo tutti i risultati (il filtro non va limitato);
  // altrimenti solo i primi `INITIAL_VISIBLE` finché non si espande.
  const isSearching = query.trim().length > 0;
  const collapsed = !isSearching && !showAll;
  const visibleWorlds = collapsed
    ? filteredWorlds.slice(0, INITIAL_VISIBLE)
    : filteredWorlds;
  const canToggle = !isSearching && filteredWorlds.length > INITIAL_VISIBLE;

  return (
    <div>
      <HeroSection />

      <main className="max-w-6xl mx-auto px-6 pb-24">
        <section aria-labelledby="worlds-heading" className="flex flex-col gap-6">
          <header className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h2
                id="worlds-heading"
                className="font-display text-2xl md:text-3xl text-ink-100"
              >
                {t('home.worldsHeading')}
              </h2>
              <p className="text-sm text-ink-300 max-w-md">
                {t('home.worldsLead')}
              </p>
            </div>
            <div className="w-full sm:w-72">
              <label htmlFor="search-worlds" className="sr-only">
                {t('home.searchLabel')}
              </label>
              <input
                id="search-worlds"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('home.searchWorldsPlaceholder')}
                className="w-full panel-soft px-3 py-2 text-sm placeholder-ink-400 focus:border-chakra-500"
              />
            </div>
          </header>

          {filteredWorlds.length > 0 ? (
            <WorldGrid worlds={visibleWorlds} />
          ) : (
            <Card className="p-10">
              <EmptyState
                title={t('home.emptyTitle')}
                description={t('home.emptyDescription')}
              />
            </Card>
          )}

          {canToggle && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                aria-expanded={showAll}
                className="panel-soft px-5 py-2.5 text-sm text-ink-100 hover:border-chakra-500/60 hover:text-white transition inline-flex items-center gap-2"
              >
                {showAll
                  ? t('home.showLess')
                  : t('home.showAll', { count: filteredWorlds.length })}
                <span aria-hidden className="text-chakra-300">
                  {showAll ? '▲' : '▼'}
                </span>
              </button>
            </div>
          )}
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          <Card className="p-5">
            <h3 className="font-display text-lg text-ink-100 mb-2">
              {t('home.featureMapTitle')}
            </h3>
            <p className="text-sm text-ink-300 leading-relaxed">
              {t('home.featureMapBody')}
            </p>
          </Card>
          <Card className="p-5">
            <h3 className="font-display text-lg text-ink-100 mb-2">
              {t('home.featureTimelineTitle')}
            </h3>
            <p className="text-sm text-ink-300 leading-relaxed">
              {t('home.featureTimelineBody')}
            </p>
          </Card>
          <Card className="p-5">
            <h3 className="font-display text-lg text-ink-100 mb-2">
              {t('home.featureExtensibleTitle')}
            </h3>
            <p className="text-sm text-ink-300 leading-relaxed">
              {t('home.featureExtensibleBody')}
            </p>
          </Card>
        </section>

        <footer className="mt-16 text-center text-xs text-ink-400">
          <Link to="/about" className="text-chakra-300 hover:underline">
            {t('home.aboutCta')}
          </Link>
        </footer>
      </main>
    </div>
  );
}
