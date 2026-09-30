import { create } from "zustand";

export type ModalName =
  | "import"
  | "share"
  | "fork"
  | "createProject"
  | "er"
  | "command"
  | "help"
  | "confirm";

interface UIState {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  activeModal: ModalName | null;
  confirmMessage: string;
  confirmAction: (() => void) | null;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  openModal: (modal: ModalName) => void;
  closeModal: () => void;
  askConfirm: (message: string, action: () => void) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  activeModal: null,
  confirmMessage: "",
  confirmAction: null,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  setMobileSidebarOpen: (mobileSidebarOpen) => set({ mobileSidebarOpen }),
  openModal: (activeModal) => set({ activeModal }),
  closeModal: () => set({ activeModal: null, confirmAction: null }),
  askConfirm: (confirmMessage, confirmAction) => set({ activeModal: "confirm", confirmMessage, confirmAction }),
}));
