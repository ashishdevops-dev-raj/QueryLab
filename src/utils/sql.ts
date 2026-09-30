const KEYWORDS = [
  "select",
  "from",
  "where",
  "join",
  "inner",
  "left",
  "right",
  "full",
  "outer",
  "on",
  "group",
  "by",
  "having",
  "order",
  "limit",
  "offset",
  "as",
  "and",
  "or",
  "not",
  "in",
  "distinct",
  "union",
  "all",
  "insert",
  "into",
  "update",
  "set",
  "delete",
  "create",
  "table",
  "values",
  "case",
  "when",
  "then",
  "else",
  "end",
  "fetch",
  "next",
  "row",
  "rows",
  "only",
  "with",
];

export function stripSqlComments(sql: string): string {
  return sql
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .trim();
}

export function normalizeSql(sql: string): string {
  return stripSqlComments(sql)
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s*=\s*/g, " = ")
    .trim()
    .toLowerCase();
}

export function formatSql(sql: string): string {
  const keywords = KEYWORDS.join("|");
  const pattern = new RegExp(`\\b(${keywords})\\b`, "gi");
  let formatted = sql.replace(pattern, (match) => match.toUpperCase());
  formatted = formatted.replace(/\s+/g, " ").trim();
  formatted = formatted
    .replace(/\s+(SELECT|FROM|WHERE|JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|GROUP BY|HAVING|ORDER BY|LIMIT|OFFSET|UNION)\b/g, "\n$1")
    .replace(/,\s+/g, ",\n    ");
  return formatted;
}

export function translateDialect(sql: string): string {
  let translated = sql;
  translated = translated.replace(/OFFSET\s+(\d+)\s+ROWS?/gi, "OFFSET $1");
  translated = translated.replace(/FETCH\s+(?:FIRST|NEXT)\s+(\d+)\s+ROWS?\s+ONLY/gi, "LIMIT $1");
  translated = translated.replace(/::\w+/g, "");
  translated = translated.replace(/NVL\(/gi, "IFNULL(");
  translated = translated.replace(/ISNULL\(/gi, "IFNULL(");
  return translated;
}

export function extractSyntaxError(message: string): { line?: number; column?: number; message: string } {
  const lineMatch = message.match(/line[:\s]+(\d+)/i);
  const colMatch = message.match(/col(?:umn)?[:\s]+(\d+)/i);
  const nearMatch = message.match(/near ['"`]?([^'"`\s]+)['"`]?/i);
  return {
    line: lineMatch ? Number(lineMatch[1]) : undefined,
    column: colMatch ? Number(colMatch[1]) : undefined,
    message: nearMatch ? `Incorrect syntax near '${nearMatch[1]}'` : message,
  };
}

export const DEFAULT_SQL = `-- Get all users and related posts

SELECT
    u.id,
    u.username,
    u.role,
    p.title,
    p.body,
    p.user_id,
    p.status
FROM users u
JOIN posts p
    ON u.id = p.user_id;`;
