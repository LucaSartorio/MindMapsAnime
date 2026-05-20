import { Card } from './Card';

/**
 * Disclaimer ricorrente sui dati e sugli asset.
 * Va mostrato nelle pagine di archivio, mappa, sources, ecc.
 */
export function SourceNotice({ compact }: { compact?: boolean }) {
  return (
    <Card soft className={compact ? 'p-3 text-xs' : 'p-4 text-sm'}>
      <p className="text-ink-300 leading-relaxed">
        <span className="font-semibold text-ink-100">Nota fonti.</span> I dati narrativi
        sono <em>seed iniziali</em> da verificare prima della pubblicazione. Riferimenti a
        capitoli/episodi specifici sono marcati come{' '}
        <span className="text-yellow-300">Da verificare</span> quando non confermati.
        Le immagini ufficiali (logo, screen, scan) <strong>non</strong> sono incluse:
        vengono usati placeholder SVG generati localmente.
      </p>
    </Card>
  );
}
