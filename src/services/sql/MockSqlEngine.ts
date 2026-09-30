import alasql from "alasql";
import type { CellValue, ColumnType, QueryContext, QueryResult } from "@/types/database";
import type { SqlEngine } from "./SqlEngine";
import { extractSyntaxError, stripSqlComments, translateDialect } from "@/utils/sql";

function mapType(type: ColumnType): string {
  switch (type) {
    case "int":
      return "INT";
    case "decimal":
      return "NUMBER";
    case "boolean":
      return "BOOLEAN";
    default:
      return "STRING";
  }
}

function sqlLiteral(value: CellValue): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "NULL";
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function inferType(value: CellValue): string {
  if (typeof value === "number") return Number.isInteger(value) ? "INT" : "DECIMAL";
  if (typeof value === "boolean") return "BOOLEAN";
  return "VARCHAR";
}

function buildPlan(sql: string): string {
  const upper = sql.toUpperCase();
  const steps: string[] = ["Seq Scan"];
  if (upper.includes("JOIN")) steps.push("Hash Join");
  if (upper.includes("WHERE")) steps.push("Filter");
  if (upper.includes("GROUP BY")) steps.push("HashAggregate");
  if (upper.includes("ORDER BY")) steps.push("Sort");
  if (upper.includes("DISTINCT")) steps.push("Unique");
  return steps.join(" -> ");
}

export class MockSqlEngine implements SqlEngine {
  readonly id = "mock";

  private prepare(context: QueryContext): void {
    for (const table of context.tables) {
      alasql(`DROP TABLE IF EXISTS ${table.tableName}`);
      const defs = table.columns.map((col) => `${col.name} ${mapType(col.type)}`).join(", ");
      alasql(`CREATE TABLE ${table.tableName} (${defs})`);
      for (const row of table.rows) {
        const cols = table.columns.map((col) => col.name).join(", ");
        const values = table.columns.map((col) => sqlLiteral(row[col.name] ?? null)).join(", ");
        alasql(`INSERT INTO ${table.tableName} (${cols}) VALUES (${values})`);
      }
    }
  }

  async executeQuery(sql: string, context: QueryContext): Promise<QueryResult> {
    const started = performance.now();
    const cleaned = stripSqlComments(sql);
    if (!cleaned) {
      return {
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: 0,
        status: "error",
        error: { message: "Query is empty. Write a SELECT statement to run." },
      };
    }

    try {
      this.prepare(context);
      const translated = translateDialect(cleaned);
      const raw: unknown = alasql(translated);
      const executionTimeMs = Number((performance.now() - started).toFixed(2));
      const rows = (Array.isArray(raw) ? raw : []) as Record<string, CellValue>[];
      const first = rows[0];
      const columns = first
        ? Object.keys(first).map((name) => ({ name, type: inferType(first[name]) }))
        : [];
      return {
        columns,
        rows,
        rowCount: rows.length,
        executionTimeMs,
        status: "success",
        plan: buildPlan(translated),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Query failed";
      const parsed = extractSyntaxError(message);
      return {
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: Number((performance.now() - started).toFixed(2)),
        status: "error",
        error: {
          message: parsed.message,
          line: parsed.line,
          column: parsed.column,
          details: message,
        },
      };
    }
  }

  async validateQuery(sql: string, context: QueryContext): Promise<{ valid: boolean; message?: string }> {
    const result = await this.executeQuery(sql, context);
    if (result.status === "error") {
      return { valid: false, message: result.error?.message };
    }
    return { valid: true };
  }

  async explainQuery(sql: string, context: QueryContext): Promise<QueryResult> {
    const executed = await this.executeQuery(sql, context);
    if (executed.status === "error") return executed;
    return {
      ...executed,
      columns: [
        { name: "step", type: "VARCHAR" },
        { name: "detail", type: "VARCHAR" },
      ],
      rows: (executed.plan ?? "Seq Scan")
        .split(" -> ")
        .map((step, index) => ({ step: index + 1, detail: step })),
      rowCount: (executed.plan ?? "").split(" -> ").length,
    };
  }
}

export const mockSqlEngine = new MockSqlEngine();
