import { useTranslation } from 'react-i18next';
import { Button } from '@/components/common/Button';
import { useCookieConsent } from '@/store/useCookieConsent';
import { LegalPage, type LegalSection } from './LegalPage';

export function CookiePolicyPage() {
  const { t } = useTranslation();
  const openPreferences = useCookieConsent((s) => s.openPreferences);
  const sections = t('cookiePolicy.sections', {
    returnObjects: true,
  }) as LegalSection[];

  return (
    <LegalPage
      eyebrow={t('cookiePolicy.eyebrow')}
      title={t('cookiePolicy.title')}
      lastUpdated={t('cookiePolicy.lastUpdated')}
      intro={t('cookiePolicy.intro')}
      sections={sections}
    >
      <div className="flex justify-start">
        <Button variant="primary" onClick={openPreferences}>
          {t('footer.manageCookies')}
        </Button>
      </div>
    </LegalPage>
  );
}
