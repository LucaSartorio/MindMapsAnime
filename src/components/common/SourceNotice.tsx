import { useTranslation } from 'react-i18next';
import { Card } from './Card';

/**
 * Disclaimer ricorrente sui dati e sugli asset.
 * Tradotto via i18n.
 */
export function SourceNotice({ compact }: { compact?: boolean }) {
  const { t } = useTranslation();
  return (
    <Card soft className={compact ? 'p-3 text-xs' : 'p-4 text-sm'}>
      <p className="text-ink-300 leading-relaxed">
        <span className="font-semibold text-ink-100">
          {t('sources.sourceNoticeShort')}
        </span>{' '}
        {t('sources.sourceNotice')}
      </p>
    </Card>
  );
}
