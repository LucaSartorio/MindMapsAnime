import { create } from 'zustand';

/** Stato del modale "Segnala un bug / Proponi una miglioria". */
interface ReportState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useReportStore = create<ReportState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
