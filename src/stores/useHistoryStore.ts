import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DatabaseEngine } from "@/types/database";
import type { HistoryEntry, QueryStatus } from "@/types/query";
import { seedHistory } from "@/data/seed";
import { uid } from "@/utils/format";

interface HistoryFilters {
  search: string;
  database: DatabaseEngine | "all";
  projectId: string | "all";
  status: QueryStatus | "all";
  date: "all" | "today" | "week";
}

interface HistoryState {
  entries: HistoryEntry[];
  filters: HistoryFilters;
  addEntry: (entry: Omit<HistoryEntry, "id" | "timestamp">) => void;
  deleteEntry: (id: string) => void;
  setFilters: (patch: Partial<HistoryFilters>) => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      entries: seedHistory,
      filters: {
        search: "",
        database: "all",
        projectId: "all",
        status: "all",
        date: "all",
      },
      addEntry: (entry) =>
        set((state) => ({
          entries: [
            {
              ...entry,
              id: uid("hist"),
              timestamp: new Date().toISOString(),
            },
            ...state.entries,
          ].slice(0, 200),
        })),
      deleteEntry: (id) => set((state) => ({ entries: state.entries.filter((entry) => entry.id !== id) })),
      setFilters: (patch) => set((state) => ({ filters: { ...state.filters, ...patch } })),
    }),
    { name: "querylab-history" },
  ),
);
