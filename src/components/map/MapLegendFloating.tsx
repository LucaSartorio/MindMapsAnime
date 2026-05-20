import { FloatingPanel } from '@/components/common/FloatingPanel';
import { useUiStore } from '@/store';

/** Legenda compatta in basso a sinistra: di default collassata. */
export function MapLegendFloating() {
  const open = useUiStore((s) => s.isLegendOpen);
  const setOpen = useUiStore((s) => s.setLegend);

  return (
    <FloatingPanel
      title="Legenda"
      icon={<span className="text-[12px]">⌖</span>}
      open={open}
      onOpenChange={setOpen}
      className="max-w-[260px]"
    >
      <div className="p-3 text-[11px] text-ink-200 space-y-2">
        <ul className="space-y-1">
          <li>
            <span className="text-chakra-300 mr-2">⛩</span> Villaggio
          </li>
          <li>
            <span className="text-chakra-300 mr-2">◆</span> Landmark
          </li>
          <li>
            <span className="text-chakra-300 mr-2">⚔</span> Battaglia
          </li>
          <li>
            <span className="text-chakra-300 mr-2">⌘</span> Luogo sacro
          </li>
          <li>
            <span className="text-chakra-300 mr-2">☖</span> Nascondiglio
          </li>
          <li>
            <span className="text-chakra-300 mr-2">✺</span> Allenamento
          </li>
          <li className="text-ink-300">
            <span className="text-scroll-200 mr-2">⤢</span> Sottomappa
          </li>
        </ul>
        <hr className="border-ink-700/40" />
        <p className="text-ink-300 leading-relaxed">
          Nodi <span className="text-ember-300">arancioni</span> = selezionati o
          su un percorso attivo. Linee tratteggiate = percorso narrativo.
        </p>
      </div>
    </FloatingPanel>
  );
}
