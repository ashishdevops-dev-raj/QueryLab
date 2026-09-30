import type { CellValue, ColumnDefinition, DatabaseEngine, DatabaseSchema, TableData } from "./database";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type InterviewCategory =
  | "SELECT"
  | "WHERE"
  | "JOIN"
  | "GROUP BY"
  | "HAVING"
  | "Subqueries"
  | "Window Functions"
  | "CTE"
  | "Indexes"
  | "Transactions";

export interface InterviewTestCase {
  id: string;
  name: string;
  description: string;
  tables: TableData[];
  expectedRows: Record<string, CellValue>[];
}

export interface InterviewQuestion {
  id: string;
  title: string;
  prompt: string;
  difficulty: Difficulty;
  category: InterviewCategory;
  database: DatabaseEngine;
  points: number;
  description: string;
  schema: DatabaseSchema;
  sampleData: TableData[];
  expectedResult: Record<string, CellValue>[];
  expectedColumn: string;
  testCases: InterviewTestCase[];
  solution: string;
  starterSql: string;
  track: string;
}

export type TestCaseStatus = "pending" | "passed" | "failed";

export interface TestCaseResult {
  id: string;
  name: string;
  description: string;
  status: TestCaseStatus;
  actualRows: Record<string, CellValue>[];
  expectedRows: Record<string, CellValue>[];
  hint?: string;
}

export interface EvaluationResult {
  passed: boolean;
  passedCount: number;
  totalCount: number;
  executionTimeMs: number;
  queryExecutes: boolean;
  correctness: boolean;
  duplicateHandling: boolean;
  nullHandling: boolean;
  performanceHint?: string;
  testCases: TestCaseResult[];
  outputRows: Record<string, CellValue>[];
  outputColumns: ColumnDefinition[];
}
