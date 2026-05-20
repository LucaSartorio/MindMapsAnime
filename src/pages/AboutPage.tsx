import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { SourceNotice } from '@/components/common/SourceNotice';

export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-chakra-300">
          About
        </p>
        <h1 className="font-display text-4xl text-ink-100">
          Anime Interactive Maps
        </h1>
        <p className="text-base text-ink-300 leading-relaxed">
          Una piattaforma frontend generica dedicata alle mappe interattive di
          anime e manga. Per ogni opera supportata puoi esplorare il mondo,
          le nazioni, i villaggi, i personaggi, gli archi narrativi e i
          percorsi dei protagonisti.
        </p>
      </header>

      <Card className="p-5 space-y-3 text-sm text-ink-300 leading-relaxed">
        <h2 className="font-display text-xl text-ink-100">Cosa offre</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Mappe interattive con pan, zoom, minimap e percorsi.</li>
          <li>Drill-down nei villaggi e nelle località principali.</li>
          <li>Timeline filtrabile per arco, periodo, personaggio.</li>
          <li>Archivi di personaggi, clan, fazioni e archi.</li>
          <li>Ricerca globale contestuale al mondo selezionato.</li>
        </ul>
      </Card>

      <Card className="p-5 space-y-3 text-sm text-ink-300 leading-relaxed">
        <h2 className="font-display text-xl text-ink-100">Architettura</h2>
        <p>
          Costruito in <strong>React + TypeScript</strong> con{' '}
          <strong>Vite</strong>, <strong>Zustand</strong>,{' '}
          <strong>React Flow</strong>, <strong>Tailwind CSS</strong> e{' '}
          <strong>React Router</strong>.
        </p>
        <p>
          Nessun backend: tutti i dati vivono in file TypeScript locali in{' '}
          <code className="font-mono">src/data/&lt;slug&gt;/</code>. Aggiungere
          un nuovo anime significa creare un nuovo dataset e registrarlo nel{' '}
          <code className="font-mono">registry.ts</code>.
        </p>
      </Card>

      <SourceNotice />

      <p className="text-sm text-ink-300 leading-relaxed">
        Per scoprire i mondi disponibili torna alla{' '}
        <Link to="/" className="text-chakra-300 hover:underline">
          homepage
        </Link>
        .
      </p>
    </div>
  );
}
