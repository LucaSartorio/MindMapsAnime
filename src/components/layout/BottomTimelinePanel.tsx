import type { WorldDataset } from '@/types';
import { Timeline } from '@/components/timeline/Timeline';

interface BottomTimelinePanelProps {
  dataset: WorldDataset;
}

export function BottomTimelinePanel({ dataset }: BottomTimelinePanelProps) {
  return <Timeline dataset={dataset} />;
}
