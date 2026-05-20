import { useTranslation } from 'react-i18next';
import { FloatingPanel } from '@/components/common/FloatingPanel';
import { useUiStore } from '@/store';

/** Legenda compatta in basso a sinistra: di default collassata. */
export function MapLegendFloating() {
  const { t } = useTranslation();
  const open = useUiStore((s) => s.isLegendOpen);
  const setOpen = useUiStore((s) => s.setLegend);

  return (
    <FloatingPanel
      title={t('map.legend.title')}
      icon={<span className="text-[12px]">⌖</span>}
      open={open}
      onOpenChange={setOpen}
      className="max-w-[260px]"
    >
      <div className="p-3 text-[11px] text-ink-200 space-y-2">
        <ul className="space-y-1">
          <li>
            <span className="text-chakra-300 mr-2">⛩</span>{' '}
            {t('map.legend.village')}
          </li>
          <li>
            <span className="text-chakra-300 mr-2">◆</span>{' '}
            {t('map.legend.landmark')}
          </li>
          <li>
            <span className="text-chakra-300 mr-2">⚔</span>{' '}
            {t('map.legend.battlefield')}
          </li>
          <li>
            <span className="text-chakra-300 mr-2">⌘</span>{' '}
            {t('map.legend.sacred')}
          </li>
          <li>
            <span className="text-chakra-300 mr-2">☖</span>{' '}
            {t('map.legend.hideout')}
          </li>
          <li>
            <span className="text-chakra-300 mr-2">✺</span>{' '}
            {t('map.legend.training')}
          </li>
          <li className="text-ink-300">
            <span className="text-scroll-200 mr-2">⤢</span>{' '}
            {t('map.legend.submap')}
          </li>
        </ul>
        <hr className="border-ink-700/40" />
        <p className="text-ink-300 leading-relaxed">{t('map.legend.hint')}</p>
      </div>
    </FloatingPanel>
  );
}
