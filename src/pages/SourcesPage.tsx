import type { WorldDataset } from '@/types';
import { Card } from '@/components/common/Card';
import { SourceNotice } from '@/components/common/SourceNotice';

interface SourcesPageProps {
  dataset: WorldDataset;
}

export function SourcesPage({ dataset }: SourcesPageProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-chakra-300">
          {dataset.world.title}
        </p>
        <h1 className="font-display text-3xl text-ink-100">Fonti &amp; asset</h1>
      </header>

      <SourceNotice />

      <Card className="overflow-hidden">
        <div className="px-4 py-3 border-b border-ink-700/60">
          <h2 className="font-display text-lg text-ink-100">Asset registrati</h2>
          <p className="text-xs text-ink-400">
            Ogni asset è documentato con autore, licenza e URL. I placeholder
            sono generati localmente e possono essere sostituiti con asset
            autorizzati.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-300 uppercase tracking-widest">
              <tr className="border-b border-ink-700/60">
                <th className="px-4 py-2 text-left">Nome</th>
                <th className="px-4 py-2 text-left">Tipo</th>
                <th className="px-4 py-2 text-left">Autore</th>
                <th className="px-4 py-2 text-left">Licenza</th>
                <th className="px-4 py-2 text-left">URL / Source</th>
                <th className="px-4 py-2 text-left">Note</th>
              </tr>
            </thead>
            <tbody>
              {dataset.assets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-ink-400">
                    Nessun asset registrato.
                  </td>
                </tr>
              )}
              {dataset.assets.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-ink-800/60 hover:bg-ink-900/40"
                >
                  <td className="px-4 py-3 text-ink-100">{a.name}</td>
                  <td className="px-4 py-3 text-ink-300 capitalize">
                    {a.kind}
                  </td>
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
                    {a.notes ?? <span className="text-ink-400">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4 text-sm text-ink-300 leading-relaxed space-y-2">
        <h2 className="font-display text-lg text-ink-100">
          Note editoriali
        </h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            I dati narrativi sono <strong>seed</strong> iniziali: vanno verificati
            su fonti ufficiali prima della pubblicazione finale.
          </li>
          <li>
            I riferimenti a capitoli manga ed episodi anime sono marcati come{' '}
            <em>Da verificare</em> se non confermati.
          </li>
          <li>
            Le immagini ufficiali non sono incluse: per ogni asset deve essere
            valutata la licenza prima dell'inserimento.
          </li>
          <li>
            Sostituire i placeholder con asset autorizzati aggiornando i campi
            <code className="font-mono mx-1">url</code>, <code className="font-mono">license</code>,
            <code className="font-mono mx-1">author</code>, <code className="font-mono">source</code> nei file
            <code className="font-mono mx-1">src/data/&lt;slug&gt;/assets.ts</code>.
          </li>
        </ul>
      </Card>
    </div>
  );
}
