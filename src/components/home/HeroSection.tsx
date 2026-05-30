import { useTranslation } from 'react-i18next';

export function HeroSection() {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden">
      {/* Strato grafico decorativo */}
      <div
        aria-hidden
        className="absolute inset-0 grid-bg opacity-40 animate-drift"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-950/40 to-ink-950"
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16 sm:pt-32 sm:pb-24 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-chakra-300 mb-4">
          {t('app.eyebrow')}
        </p>
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold text-ink-100 leading-tight">
          {t('app.title')}
        </h1>
        <p className="mt-6 text-base sm:text-lg md:text-xl text-ink-200 max-w-2xl mx-auto leading-relaxed">
          {t('app.tagline')}
        </p>
      </div>
    </section>
  );
}
