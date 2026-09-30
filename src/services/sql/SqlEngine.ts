import type { QueryContext, QueryResult } from "@/types/database";

export interface SqlEngine {
  readonly id: string;
  executeQuery(sql: string, context: QueryContext): Promise<QueryResult>;
  validateQuery(sql: string, context: QueryContext): Promise<{ valid: boolean; message?: string }>;
  explainQuery(sql: string, context: QueryContext): Promise<QueryResult>;
}
