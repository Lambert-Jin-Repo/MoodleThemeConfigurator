// ── Toast Notification Store ──

import { create } from 'zustand';

interface ToastState {
  message: string | null;
  show: (message: string) => void;
  dismiss: () => void;
}

export const useToastStore = create<ToastState>()((set) => ({
  message: null,
  show: (message: string) => {
    set({ message });
    setTimeout(() => set({ message: null }), 3000);
  },
  dismiss: () => set({ message: null }),
}));
