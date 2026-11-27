import { create } from 'zustand';

/**
 * Viewer state (three-free). Deliberately separate from `useUiStore.activeModal`: the viewer is not a scheda, has
 * no deep link and no SEO surface. Initial state is closed on server and client (hydration-safe).
 */
interface Explorer3dState {
  /** Open scene and the location scheda to return to on exit. */
  session: { sceneId: string; locationId: string } | null;
  open: (sceneId: string, locationId: string) => void;
  close: () => void;
}

export const useExplorer3dStore = create<Explorer3dState>((set) => ({
  session: null,
  open: (sceneId, locationId) => set({ session: { sceneId, locationId } }),
  close: () => set({ session: null }),
}));
