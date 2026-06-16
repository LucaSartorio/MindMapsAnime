import { useTranslation } from 'react-i18next';
import { LegalPage, type LegalSection } from './LegalPage';

export function PrivacyPolicyPage() {
  const { t } = useTranslation();
  const sections = t('privacyPolicy.sections', {
    returnObjects: true,
  }) as LegalSection[];

  return (
    <LegalPage
      eyebrow={t('privacyPolicy.eyebrow')}
      title={t('privacyPolicy.title')}
      lastUpdated={t('privacyPolicy.lastUpdated')}
      intro={t('privacyPolicy.intro')}
      sections={sections}
    />
  );
}
