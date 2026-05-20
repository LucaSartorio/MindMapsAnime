import { create } from 'zustand';

/**
 * Store dello stato UI (pannelli aperti/chiusi, drawer mobile...).
 */
interface UiState {
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  timelineOpen: boolean;
  mobileNavOpen: boolean;
  setLeftPanel: (open: boolean) => void;
  setRightPanel: (open: boolean) => void;
  setTimeline: (open: boolean) => void;
  setMobileNav: (open: boolean) => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  toggleTimeline: () => void;
  toggleMobileNav: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  leftPanelOpen: true,
  rightPanelOpen: false,
  timelineOpen: true,
  mobileNavOpen: false,
  setLeftPanel: (open) => set({ leftPanelOpen: open }),
  setRightPanel: (open) => set({ rightPanelOpen: open }),
  setTimeline: (open) => set({ timelineOpen: open }),
  setMobileNav: (open) => set({ mobileNavOpen: open }),
  toggleLeftPanel: () => set((s) => ({ leftPanelOpen: !s.leftPanelOpen })),
  toggleRightPanel: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),
  toggleTimeline: () => set((s) => ({ timelineOpen: !s.timelineOpen })),
  toggleMobileNav: () => set((s) => ({ mobileNavOpen: !s.mobileNavOpen })),
}));
