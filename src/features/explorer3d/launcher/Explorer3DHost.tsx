import { Component, Suspense, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import type { WorldDataset } from '@/types';
import { lazyWithPreload } from '@/lib/lazyWithPreload';
import { useOpenEntityRef } from '@/lib/useOpenEntityRef';
import { useUiStore } from '@/store';
import type { EntityRef } from '@/lib/graph';
import { findSceneById } from './registry';
import { useExplorer3dStore } from './store';

/**
 * The ONLY bridge from the site to the 3D code: a dynamic import, fired by an explicit click
 * (`Explorer3DButton`) or by opening the viewer. Never preloaded on hover/idle, never during SSR.
 */
const Viewer = lazyWithPreload(() => import('../viewer/Explorer3DViewer').then((m) => m.Explorer3DViewer));

export function preloadExplorerViewer(): Promise<void> {
  return Viewer.preload();
}

/** Full-screen shell shown while the 3D chunks download (and reused for load errors). */
function Shell({ children, busy }: { children: ReactNode; busy?: boolean }) {
  const { t } = useTranslation();
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-busy={busy || undefined}
      aria-label={t('explorer3d.dialogTitle')}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/95 p-4 text-ink-100"
    >
      <div className="panel max-w-sm p-5 text-center" role={busy ? 'status' : undefined}>
        {children}
      </div>
    </div>
  );
}

interface BoundaryProps {
  onClose: () => void;
  labels: { error: string; retry: string; close: string };
  children: ReactNode;
}

/** Catches a failed chunk download or a crash while building the scene: the site keeps working. */
class ViewerBoundary extends Component<BoundaryProps, { failed: boolean; attempt: number }> {
  state = { failed: false, attempt: 0 };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    const { labels, onClose, children } = this.props;
    if (!this.state.failed) return <div key={this.state.attempt}>{children}</div>;
    return (
      <Shell>
        <p className="text-sm">{labels.error}</p>
        <div className="mt-4 flex justify-center gap-2">
          <button
            type="button"
            className="btn-primary"
            onClick={() => this.setState((s) => ({ failed: false, attempt: s.attempt + 1 }))}
          >
            {labels.retry}
          </button>
          <button type="button" className="btn-ghost" onClick={onClose}>
            {labels.close}
          </button>
        </div>
      </Shell>
    );
  }
}

/**
 * Mounted once per world layout (inside `ModalRoot`). Renders nothing until a session is open, so ordinary
 * navigation has no 3D work at all: no chunk, no canvas, no animation loop.
 */
export function Explorer3DHost({ dataset }: { dataset: WorldDataset }) {
  const { t } = useTranslation();
  const session = useExplorer3dStore((s) => s.session);
  const closeSession = useExplorer3dStore((s) => s.close);
  const openLocation = useUiStore((s) => s.openLocationModal);
  const openRef = useOpenEntityRef();
  const { pathname } = useLocation();
  const openedAt = useRef<string | null>(null);

  // Leaving the page (browser back, a link) ends the session: the viewer never outlives its page.
  useEffect(() => {
    if (!session) {
      openedAt.current = null;
      return;
    }
    if (openedAt.current === null) openedAt.current = pathname;
    else if (openedAt.current !== pathname) closeSession();
  }, [session, pathname, closeSession]);

  const exit = useCallback(() => {
    const locationId = useExplorer3dStore.getState().session?.locationId;
    closeSession();
    if (locationId) openLocation(locationId);
  }, [closeSession, openLocation]);

  const openEntity = useCallback(
    (ref: EntityRef) => {
      closeSession();
      openRef(ref);
    },
    [closeSession, openRef],
  );

  const manifest = session ? findSceneById(session.sceneId) : undefined;
  const resolvable = !!manifest && manifest.worldId === dataset.world.id;
  // A session that cannot be shown here (other world, scene disabled) is closed, never left dangling.
  useEffect(() => {
    if (session && !resolvable) closeSession();
  }, [session, resolvable, closeSession]);

  if (!session || !manifest || !resolvable) return null;

  return (
    <ViewerBoundary
      onClose={exit}
      labels={{ error: t('explorer3d.errors.load'), retry: t('explorer3d.errors.retry'), close: t('explorer3d.close') }}
    >
      <Suspense
        fallback={
          <Shell busy>
            <p className="text-sm">{t('explorer3d.loading')}</p>
            <button type="button" className="btn-ghost mt-4" onClick={exit}>
              {t('explorer3d.close')}
            </button>
          </Shell>
        }
      >
        <Viewer dataset={dataset} manifest={manifest} onExit={exit} onOpenEntity={openEntity} />
      </Suspense>
    </ViewerBoundary>
  );
}
