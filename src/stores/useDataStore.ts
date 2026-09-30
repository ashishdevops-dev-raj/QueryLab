import { create } from "zustand";
import type { CellValue, TableData } from "@/types/database";
import { useProjectStore } from "./useProjectStore";
import { parseDbml } from "@/utils/dbml";
import { parseCsv } from "@/utils/csv";

interface DataState {
  activeTable: string;
  setActiveTable: (name: string) => void;
  updateCell: (tableName: string, rowIndex: number, column: string, value: CellValue) => void;
  addRow: (tableName: string) => void;
  deleteRow: (tableName: string, rowIndex: number) => void;
  duplicateRow: (tableName: string, rowIndex: number) => void;
  importCsv: (tableName: string, csv: string) => void;
  generateSample: (tableName: string) => void;
  applyDbml: (dbml: string) => string[];
  replaceTables: (tables: TableData[]) => void;
}

function nextId(table: TableData): number {
  const ids = table.rows
    .map((row) => Number(row.id))
    .filter((value) => Number.isFinite(value));
  return (ids.length ? Math.max(...ids) : 0) + 1;
}

export const useDataStore = create<DataState>((set, get) => ({
  activeTable: "users",
  setActiveTable: (name) => set({ activeTable: name }),
  updateCell: (tableName, rowIndex, column, value) => {
    const { activeProjectId, projects, updateProject } = useProjectStore.getState();
    const project = projects.find((item) => item.id === activeProjectId);
    if (!project) return;
    const tables = project.tables.map((table) => {
      if (table.tableName !== tableName) return table;
      const rows = table.rows.map((row, index) =>
        index === rowIndex ? { ...row, [column]: value } : row,
      );
      return { ...table, rows };
    });
    updateProject(project.id, { tables });
  },
  addRow: (tableName) => {
    const { activeProjectId, projects, updateProject } = useProjectStore.getState();
    const project = projects.find((item) => item.id === activeProjectId);
    if (!project) return;
    const tables = project.tables.map((table) => {
      if (table.tableName !== tableName) return table;
      const row: Record<string, CellValue> = {};
      for (const column of table.columns) {
        if (column.name === "id") row.id = nextId(table);
        else if (column.type === "int" || column.type === "decimal") row[column.name] = 0;
        else row[column.name] = "";
      }
      return { ...table, rows: [...table.rows, row] };
    });
    updateProject(project.id, { tables });
  },
  deleteRow: (tableName, rowIndex) => {
    const { activeProjectId, projects, updateProject } = useProjectStore.getState();
    const project = projects.find((item) => item.id === activeProjectId);
    if (!project) return;
    const tables = project.tables.map((table) =>
      table.tableName === tableName
        ? { ...table, rows: table.rows.filter((_, index) => index !== rowIndex) }
        : table,
    );
    updateProject(project.id, { tables });
  },
  duplicateRow: (tableName, rowIndex) => {
    const { activeProjectId, projects, updateProject } = useProjectStore.getState();
    const project = projects.find((item) => item.id === activeProjectId);
    if (!project) return;
    const tables = project.tables.map((table) => {
      if (table.tableName !== tableName) return table;
      const source = table.rows[rowIndex];
      if (!source) return table;
      const copy = { ...source, id: nextId(table) };
      const rows = [...table.rows];
      rows.splice(rowIndex + 1, 0, copy);
      return { ...table, rows };
    });
    updateProject(project.id, { tables });
  },
  importCsv: (tableName, csv) => {
    const parsed = parseCsv(csv);
    const { activeProjectId, projects, updateProject } = useProjectStore.getState();
    const project = projects.find((item) => item.id === activeProjectId);
    if (!project) return;
    const tables = project.tables.map((table) => {
      if (table.tableName !== tableName) return table;
      const rows = parsed.rows.map((row) => {
        const next: Record<string, CellValue> = {};
        for (const column of table.columns) {
          const raw = row[column.name];
          if (column.type === "int" || column.type === "decimal") next[column.name] = raw ? Number(raw) : null;
          else next[column.name] = raw ?? null;
        }
        return next;
      });
      return { ...table, rows };
    });
    updateProject(project.id, { tables });
  },
  generateSample: (tableName) => {
    const { addRow } = get();
    addRow(tableName);
    addRow(tableName);
  },
  applyDbml: (dbml) => {
    const { schema, errors } = parseDbml(dbml);
    if (errors.length) return errors;
    const { activeProjectId, projects, updateProject } = useProjectStore.getState();
    const project = projects.find((item) => item.id === activeProjectId);
    if (!project) return ["No active project."];
    const tables: TableData[] = schema.tables.map((table) => {
      const existing = project.tables.find((item) => item.tableName === table.name);
      return {
        tableName: table.name,
        columns: table.columns,
        rows: existing?.rows ?? [],
      };
    });
    updateProject(project.id, { dbml, schema, tables, tableCount: tables.length });
    if (tables[0]) set({ activeTable: tables[0].tableName });
    return [];
  },
  replaceTables: (tables) => {
    const { activeProjectId, updateProject } = useProjectStore.getState();
    updateProject(activeProjectId, { tables, tableCount: tables.length });
  },
}));
