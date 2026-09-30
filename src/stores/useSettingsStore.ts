import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DatabaseEngine } from "@/types/database";

export type ThemePreference = "light" | "dark" | "system";

interface SettingsState {
  fontSize: number;
  theme: ThemePreference;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  defaultDatabase: DatabaseEngine;
  displayName: string;
  email: string;
  setFontSize: (fontSize: number) => void;
  setTheme: (theme: ThemePreference) => void;
  setTabSize: (tabSize: number) => void;
  setWordWrap: (wordWrap: boolean) => void;
  setMinimap: (minimap: boolean) => void;
  setDefaultDatabase: (defaultDatabase: DatabaseEngine) => void;
  setProfile: (patch: { displayName?: string; email?: string }) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      fontSize: 13,
      theme: "light",
      tabSize: 2,
      wordWrap: false,
      minimap: false,
      defaultDatabase: "sqlserver",
      displayName: "Alex Morgan",
      email: "alex@querylab.dev",
      setFontSize: (fontSize) => set({ fontSize }),
      setTheme: (theme) => set({ theme }),
      setTabSize: (tabSize) => set({ tabSize }),
      setWordWrap: (wordWrap) => set({ wordWrap }),
      setMinimap: (minimap) => set({ minimap }),
      setDefaultDatabase: (defaultDatabase) => set({ defaultDatabase }),
      setProfile: (patch) => set(patch),
    }),
    { name: "querylab-settings" },
  ),
);
