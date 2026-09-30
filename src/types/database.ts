export type DatabaseEngine =
  | "sqlserver"
  | "postgres"
  | "mysql"
  | "sqlite"
  | "duckdb";

export interface DatabaseEngineMeta {
  id: DatabaseEngine;
  label: string;
  version: string;
  defaultPort: number;
}

export const DATABASE_ENGINES: DatabaseEngineMeta[] = [
  { id: "sqlserver", label: "SQL Server 2022", version: "2022", defaultPort: 1433 },
  { id: "postgres", label: "PostgreSQL 16", version: "16", defaultPort: 5432 },
  { id: "mysql", label: "MySQL 8.4", version: "8.4", defaultPort: 3306 },
  { id: "sqlite", label: "SQLite 3", version: "3", defaultPort: 0 },
  { id: "duckdb", label: "DuckDB", version: "1.1", defaultPort: 0 },
];

export type ColumnType = "int" | "varchar" | "text" | "decimal" | "boolean" | "timestamp";

export interface ColumnDefinition {
  name: string;
  type: ColumnType;
  primaryKey?: boolean;
  foreignKey?: { table: string; column: string };
  increment?: boolean;
  nullable?: boolean;
}

export interface TableDefinition {
  name: string;
  columns: ColumnDefinition[];
}

export interface Relationship {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
}

export interface DatabaseSchema {
  tables: TableDefinition[];
  relationships: Relationship[];
}

export type CellValue = string | number | boolean | null;

export interface TableData {
  tableName: string;
  columns: ColumnDefinition[];
  rows: Record<string, CellValue>[];
}

export interface QueryError {
  message: string;
  line?: number;
  column?: number;
  details?: string;
}

export interface QueryResult {
  columns: { name: string; type: string }[];
  rows: Record<string, CellValue>[];
  rowCount: number;
  executionTimeMs: number;
  status: "success" | "error";
  error?: QueryError;
  plan?: string;
}

export interface QueryContext {
  schema: DatabaseSchema;
  tables: TableData[];
  engine: DatabaseEngine;
}
