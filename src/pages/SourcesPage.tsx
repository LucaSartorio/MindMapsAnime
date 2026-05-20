import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import { Card } from '@/components/common/Card';
import { SourceNotice } from '@/components/common/SourceNotice';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';

interface SourcesPageProps {
  dataset: WorldDataset;
}

export function SourcesPage({ dataset }: SourcesPageProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const editorial = t('sources.editorialList', {
    returnObjects: true,
  }) as string[];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-chakra-300">
          {dataset.world.title}
        </p>
        <h1 className="font-display text-3xl text-ink-100">
          {t('sources.title')}
        </h1>
      </header>

      <SourceNotice />

      <Card className="overflow-hidden">
        <div className="px-4 py-3 border-b border-ink-700/60">
          <h2 className="font-display text-lg text-ink-100">
            {t('sources.sectionAssetsTitle')}
          </h2>
          <p className="text-xs text-ink-400">
            {t('sources.sectionAssetsLead')}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-300 uppercase tracking-widest">
              <tr className="border-b border-ink-700/60">
                <th className="px-4 py-2 text-left">{t('sources.columns.name')}</th>
                <th className="px-4 py-2 text-left">{t('sources.columns.kind')}</th>
                <th className="px-4 py-2 text-left">{t('sources.columns.author')}</th>
                <th className="px-4 py-2 text-left">{t('sources.columns.license')}</th>
                <th className="px-4 py-2 text-left">{t('sources.columns.url')}</th>
                <th className="px-4 py-2 text-left">{t('sources.columns.notes')}</th>
              </tr>
            </thead>
            <tbody>
              {dataset.assets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-ink-400">
                    {t('sources.noAssets')}
                  </td>
                </tr>
              )}
              {dataset.assets.map((a) => {
                const notes = getLocalizedText(a.notes, locale);
                return (
                  <tr
                    key={a.id}
                    className="border-b border-ink-800/60 hover:bg-ink-900/40"
                  >
                    <td className="px-4 py-3 text-ink-100">{a.name}</td>
                    <td className="px-4 py-3 text-ink-300 capitalize">{a.kind}</td>
                    <td className="px-4 py-3 text-ink-300">{a.author ?? '—'}</td>
                    <td className="px-4 py-3 text-ink-300">{a.license}</td>
                    <td className="px-4 py-3 text-ink-300">
                      {a.url ? (
                        <a
                          href={a.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-chakra-300 hover:underline break-all"
                        >
                          {a.url}
                        </a>
                      ) : a.source ? (
                        <span>{a.source}</span>
                      ) : (
                        <span className="text-ink-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-300">
                      {notes || <span className="text-ink-400">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4 text-sm text-ink-300 leading-relaxed space-y-2">
        <h2 className="font-display text-lg text-ink-100">
          {t('sources.editorialTitle')}
        </h2>
        <ul className="list-disc list-inside space-y-1">
          {editorial.map((line, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: line }} />
          ))}
        </ul>
      </Card>
    </div>
  );
}
