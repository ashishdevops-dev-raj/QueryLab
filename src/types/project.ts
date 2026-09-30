import type { DatabaseEngine, DatabaseSchema, TableData } from "./database";

export type ProjectKind = "playground" | "interview" | "replica" | "analytics";

export interface Project {
  id: string;
  name: string;
  description: string;
  engine: DatabaseEngine;
  kind: ProjectKind;
  owner: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  lastEditedLabel: string;
  queryCount: number;
  tableCount: number;
  dbml: string;
  sql: string;
  schema: DatabaseSchema;
  tables: TableData[];
  share?: {
    visibility: "private" | "anyone";
    permission: "view" | "edit";
    url: string;
  };
}
