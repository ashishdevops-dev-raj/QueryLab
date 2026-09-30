import type { QueryContext, QueryResult } from "@/types/database";
import type { SqlEngine } from "./SqlEngine";
import { apiClient } from "@/services/api/client";
import { mockSqlEngine } from "./MockSqlEngine";

const useMock = import.meta.env.VITE_USE_MOCK_API !== "false";

class RemoteSqlEngine implements SqlEngine {
  constructor(
    readonly id: string,
    private readonly dialect: string,
  ) {}

  async executeQuery(sql: string, context: QueryContext): Promise<QueryResult> {
    if (useMock) return mockSqlEngine.executeQuery(sql, context);
    return apiClient.post<QueryResult>("/query/execute", {
      sql,
      dialect: this.dialect,
      engine: context.engine,
      projectTables: context.tables,
    });
  }

  async validateQuery(sql: string, context: QueryContext) {
    if (useMock) return mockSqlEngine.validateQuery(sql, context);
    return apiClient.post<{ valid: boolean; message?: string }>("/query/validate", { sql, dialect: this.dialect });
  }

  async explainQuery(sql: string, context: QueryContext): Promise<QueryResult> {
    if (useMock) return mockSqlEngine.explainQuery(sql, context);
    return apiClient.post<QueryResult>("/query/explain", { sql, dialect: this.dialect });
  }
}

export class SqlServerEngine extends RemoteSqlEngine {
  constructor() {
    super("sqlserver", "tsql");
  }
}

export class PostgresEngine extends RemoteSqlEngine {
  constructor() {
    super("postgres", "postgres");
  }
}

export class MySqlEngine extends RemoteSqlEngine {
  constructor() {
    super("mysql", "mysql");
  }
}

export const sqlServerEngine = new SqlServerEngine();
export const postgresEngine = new PostgresEngine();
export const mySqlEngine = new MySqlEngine();
