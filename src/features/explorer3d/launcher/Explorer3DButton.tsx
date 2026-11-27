import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/common/Button';
import { canUseWebGL, findLocationScene } from './registry';
import { useExplorer3dStore } from './store';
import { preloadExplorerViewer } from './Explorer3DHost';

interface Explorer3DButtonProps {
  worldId: string;
  locationId: string;
  /** Called right before the viewer opens (the location scheda closes: the viewer is full screen). */
  onOpen: () => void;
}

/**
 * "Explore in 3D" entry point. Renders nothing when the location has no enabled scene, so locations without 3D get
 * no dead button. The decision depends only on build-time data (same output on server and client). WebGL is probed
 * on click, before any 3D download; without it the scheda stays usable and a message explains why.
 */
export function Explorer3DButton({ worldId, locationId, onOpen }: Explorer3DButtonProps) {
  const { t } = useTranslation();
  const open = useExplorer3dStore((s) => s.open);
  const [unsupported, setUnsupported] = useState(false);
  const scene = findLocationScene(worldId, locationId);
  if (!scene) return null;

  return (
    <>
      <Button
        variant="ghost"
        aria-describedby={unsupported ? `explorer3d-unsupported-${scene.id}` : undefined}
        onClick={() => {
          if (!canUseWebGL()) {
            setUnsupported(true);
            return;
          }
          performance.mark('explorer3d:open');
          // Start the download on click (not on hover/idle: ordinary visits must not fetch any 3D byte).
          void preloadExplorerViewer();
          onOpen();
          open(scene.id, locationId);
        }}
      >
        <span aria-hidden className="mr-1">◈</span>
        {t('explorer3d.open')}
        {scene.status === 'prototype' && (
          <span className="ml-1.5 rounded bg-ember-700/80 px-1 text-[10px] uppercase tracking-wide text-white">
            {t('explorer3d.prototypeBadge')}
          </span>
        )}
      </Button>
      {unsupported && (
        <p id={`explorer3d-unsupported-${scene.id}`} role="status" className="basis-full text-xs text-yellow-200">
          {t('explorer3d.errors.webgl')}
        </p>
      )}
    </>
  );
}
