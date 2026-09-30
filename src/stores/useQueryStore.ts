import { create } from "zustand";
import type { QueryResult } from "@/types/database";
import { getSqlEngine } from "@/services/sql/engineFactory";
import { useProjectStore } from "./useProjectStore";
import { useHistoryStore } from "./useHistoryStore";
import { formatSql } from "@/utils/sql";

interface QueryState {
  result: QueryResult | null;
  isRunning: boolean;
  lastSql: string;
  runQuery: (sql?: string) => Promise<QueryResult>;
  explainQuery: (sql?: string) => Promise<QueryResult>;
  validateQuery: (sql?: string) => Promise<{ valid: boolean; message?: string }>;
  formatCurrent: () => string;
  clearResult: () => void;
}

export const useQueryStore = create<QueryState>((set, get) => ({
  result: null,
  isRunning: false,
  lastSql: "",
  runQuery: async (sql) => {
    const { projects, activeProjectId, updateProject } = useProjectStore.getState();
    const project = projects.find((item) => item.id === activeProjectId);
    if (!project) {
      const empty: QueryResult = {
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: 0,
        status: "error",
        error: { message: "No active project." },
      };
      set({ result: empty, isRunning: false });
      return empty;
    }
    const query = sql ?? project.sql;
    set({ isRunning: true, lastSql: query });
    const engine = getSqlEngine(project.engine);
    const result = await engine.executeQuery(query, {
      schema: project.schema,
      tables: project.tables,
      engine: project.engine,
    });
    useHistoryStore.getState().addEntry({
      query,
      projectId: project.id,
      projectName: project.name,
      database: project.engine,
      executionTimeMs: result.executionTimeMs,
      rowsReturned: result.rowCount,
      status: result.status,
      errorMessage: result.error?.message,
    });
    updateProject(project.id, { queryCount: project.queryCount + 1, sql: query });
    set({ result, isRunning: false });
    return result;
  },
  explainQuery: async (sql) => {
    const { projects, activeProjectId } = useProjectStore.getState();
    const project = projects.find((item) => item.id === activeProjectId);
    if (!project) return get().result ?? { columns: [], rows: [], rowCount: 0, executionTimeMs: 0, status: "error", error: { message: "No active project." } };
    set({ isRunning: true });
    const engine = getSqlEngine(project.engine);
    const result = await engine.explainQuery(sql ?? project.sql, {
      schema: project.schema,
      tables: project.tables,
      engine: project.engine,
    });
    set({ result, isRunning: false });
    return result;
  },
  validateQuery: async (sql) => {
    const { projects, activeProjectId } = useProjectStore.getState();
    const project = projects.find((item) => item.id === activeProjectId);
    if (!project) return { valid: false, message: "No active project." };
    const engine = getSqlEngine(project.engine);
    return engine.validateQuery(sql ?? project.sql, {
      schema: project.schema,
      tables: project.tables,
      engine: project.engine,
    });
  },
  formatCurrent: () => {
    const { projects, activeProjectId, updateProject } = useProjectStore.getState();
    const project = projects.find((item) => item.id === activeProjectId);
    if (!project) return "";
    const formatted = formatSql(project.sql);
    updateProject(project.id, { sql: formatted });
    return formatted;
  },
  clearResult: () => set({ result: null }),
}));
