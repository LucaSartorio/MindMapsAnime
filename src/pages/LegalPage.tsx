import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/common/Card';
import { Footer } from '@/components/layout/Footer';

export interface LegalSection {
  heading: string;
  /** Paragrafi di testo. */
  paragraphs?: string[];
  /** Elenco puntato opzionale. */
  bullets?: string[];
}

interface LegalPageProps {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  intro?: string;
  sections: LegalSection[];
  children?: ReactNode;
}

/**
 * Layout condiviso per le pagine legali (Privacy & Cookie Policy).
 * Renderizza sezioni con titolo, paragrafi ed elenchi a partire da dati i18n.
 */
export function LegalPage({
  eyebrow,
  title,
  lastUpdated,
  intro,
  sections,
  children,
}: LegalPageProps) {
  const { t } = useTranslation();

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <header className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-chakra-300">
            {eyebrow}
          </p>
          <h1 className="font-display text-4xl text-ink-100">{title}</h1>
          <p className="text-xs text-ink-400">{lastUpdated}</p>
          {intro && (
            <p className="text-base text-ink-300 leading-relaxed pt-2">{intro}</p>
          )}
        </header>

        {sections.map((section, i) => (
          <Card key={i} className="p-5 space-y-3 text-sm text-ink-300 leading-relaxed">
            <h2 className="font-display text-xl text-ink-100">{section.heading}</h2>
            {section.paragraphs?.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
            {section.bullets && (
              <ul className="list-disc list-inside space-y-1">
                {section.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            )}
          </Card>
        ))}

        {children}

        <p className="text-sm text-ink-300 leading-relaxed">
          <Link to="/" className="text-chakra-300 hover:underline">
            {t('about.backToHome')}
          </Link>
        </p>
      </div>
      <Footer />
    </div>
  );
}
