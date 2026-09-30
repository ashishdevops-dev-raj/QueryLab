import { create } from "zustand";

interface EditorState {
  dbmlDirty: boolean;
  sqlDirty: boolean;
  savedAt: string | null;
  setDbmlDirty: (dirty: boolean) => void;
  setSqlDirty: (dirty: boolean) => void;
  markSaved: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  dbmlDirty: false,
  sqlDirty: false,
  savedAt: null,
  setDbmlDirty: (dbmlDirty) => set({ dbmlDirty }),
  setSqlDirty: (sqlDirty) => set({ sqlDirty }),
  markSaved: () => set({ dbmlDirty: false, sqlDirty: false, savedAt: new Date().toISOString() }),
}));
