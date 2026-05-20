import { Card } from '@/components/common/Card';

/** Piccola legenda sui simboli usati nei nodi e percorsi. */
export function MapLegend() {
  return (
    <Card soft className="p-3 text-[11px] text-ink-200 space-y-2 max-w-xs">
      <h4 className="font-display text-xs uppercase tracking-widest text-chakra-300">
        Legenda
      </h4>
      <ul className="space-y-1">
        <li>
          <span className="text-chakra-300 mr-2">⛩</span> Villaggio
        </li>
        <li>
          <span className="text-chakra-300 mr-2">◆</span> Landmark
        </li>
        <li>
          <span className="text-chakra-300 mr-2">⚔</span> Campo di battaglia
        </li>
        <li>
          <span className="text-chakra-300 mr-2">⌘</span> Luogo sacro
        </li>
        <li>
          <span className="text-chakra-300 mr-2">☖</span> Nascondiglio
        </li>
        <li className="text-ink-300">
          <span className="text-scroll-200 mr-2">⤢</span> Sottomappa
          disponibile
        </li>
      </ul>
      <hr className="border-ink-700/40" />
      <p className="text-ink-300">
        Linee tratteggiate = percorso narrativo selezionato.
      </p>
    </Card>
  );
}
