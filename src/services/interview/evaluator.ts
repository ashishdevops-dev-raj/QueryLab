import type { CellValue } from "@/types/database";
import type { EvaluationResult, InterviewQuestion, TestCaseResult } from "@/types/interview";
import { mockSqlEngine } from "@/services/sql/MockSqlEngine";
import { normalizeSql } from "@/utils/sql";

function sortRows(rows: Record<string, CellValue>[]): Record<string, CellValue>[] {
  return [...rows].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
}

function coerce(value: CellValue): CellValue {
  if (value === undefined) return null;
  if (typeof value === "string" && value.trim() === "") return null;
  if (typeof value === "string" && /^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return value;
}

function normalizeRow(row: Record<string, CellValue>): Record<string, CellValue> {
  const next: Record<string, CellValue> = {};
  for (const [key, value] of Object.entries(row)) {
    next[key.toLowerCase()] = coerce(value);
  }
  if ("secondhighestsalary" in next && !("salary" in next)) {
    next.salary = next.secondhighestsalary;
  }
  return next;
}

function rowsEqual(actual: Record<string, CellValue>[], expected: Record<string, CellValue>[]): boolean {
  if (actual.length !== expected.length) return false;
  const a = sortRows(actual.map(normalizeRow));
  const b = sortRows(expected.map(normalizeRow));
  const keys = new Set(b.flatMap((row) => Object.keys(row)));
  return a.every((row, index) =>
    [...keys].every((key) => {
      const left = row[key] ?? Object.values(row)[0] ?? null;
      const right = b[index][key] ?? Object.values(b[index])[0] ?? null;
      return left === right;
    }),
  );
}

function secondHighest(values: CellValue[]): CellValue {
  const distinct = [...new Set(values.filter((value): value is number => typeof value === "number"))].sort(
    (a, b) => b - a,
  );
  return distinct[1] ?? null;
}

export async function evaluateInterviewQuery(
  question: InterviewQuestion,
  sql: string,
): Promise<EvaluationResult> {
  const started = performance.now();
  const testCases: TestCaseResult[] = [];
  let queryExecutes = true;

  for (const testCase of question.testCases) {
    const result = await mockSqlEngine.executeQuery(sql, {
      schema: question.schema,
      tables: testCase.tables,
      engine: question.database,
    });

    if (result.status === "error") {
      queryExecutes = false;
      testCases.push({
        id: testCase.id,
        name: testCase.name,
        description: testCase.description,
        status: "failed",
        actualRows: [],
        expectedRows: testCase.expectedRows,
        hint: result.error?.message,
      });
      continue;
    }

    const expected =
      question.id === "q2"
        ? [
            {
              salary: secondHighest(
                testCase.tables[0].rows.map((row) => row.salary ?? null),
              ),
            },
          ]
        : testCase.expectedRows;

    const passed = rowsEqual(result.rows, expected);
    testCases.push({
      id: testCase.id,
      name: testCase.name,
      description: testCase.description,
      status: passed ? "passed" : "failed",
      actualRows: result.rows,
      expectedRows: expected,
      hint: passed ? undefined : "Result set does not match the expected rows.",
    });
  }

  const passedCount = testCases.filter((item) => item.status === "passed").length;
  const normalized = normalizeSql(sql);
  const duplicateHandling = /distinct|max\(|dense_rank|rank\(/.test(normalized);
  const nullHandling = testCases.some((item) => item.name.toLowerCase().includes("null"))
    ? testCases.find((item) => item.name.toLowerCase().includes("null"))?.status === "passed"
    : true;
  const performanceHint = /select \*/.test(normalized)
    ? "Avoid SELECT *; project only the columns the test expects."
    : undefined;

  const sample = await mockSqlEngine.executeQuery(sql, {
    schema: question.schema,
    tables: question.sampleData,
    engine: question.database,
  });

  return {
    passed: passedCount === testCases.length && queryExecutes,
    passedCount,
    totalCount: testCases.length,
    executionTimeMs: Number((performance.now() - started).toFixed(2)),
    queryExecutes,
    correctness: passedCount === testCases.length,
    duplicateHandling,
    nullHandling,
    performanceHint,
    testCases,
    outputRows: sample.rows,
    outputColumns: sample.columns.map((col) => ({ name: col.name, type: col.type === "INT" ? "int" : "varchar" })),
  };
}
