import type { DatabaseEngine } from "./database";

export type QueryStatus = "success" | "error";

export interface HistoryEntry {
  id: string;
  query: string;
  projectId: string;
  projectName: string;
  database: DatabaseEngine;
  executionTimeMs: number;
  rowsReturned: number;
  timestamp: string;
  status: QueryStatus;
  errorMessage?: string;
}
