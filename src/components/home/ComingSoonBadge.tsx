import { useTranslation } from 'react-i18next';

export function ComingSoonBadge() {
  const { t } = useTranslation();
  return (
    <span
      className="absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-mono uppercase tracking-widest bg-yellow-500/20 text-yellow-200 border border-yellow-500/40 backdrop-blur-sm"
      aria-label={t('coming.badge')}
    >
      {t('coming.badge')}
    </span>
  );
}
