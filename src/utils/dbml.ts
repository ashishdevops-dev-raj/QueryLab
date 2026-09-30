import type { ColumnType, DatabaseSchema, TableDefinition } from "@/types/database";

const TYPE_MAP: Record<string, ColumnType> = {
  int: "int",
  integer: "int",
  varchar: "varchar",
  text: "text",
  decimal: "decimal",
  numeric: "decimal",
  boolean: "boolean",
  timestamp: "timestamp",
};

export function parseDbml(source: string): { schema: DatabaseSchema; errors: string[] } {
  const errors: string[] = [];
  const tables: TableDefinition[] = [];
  const relationships: DatabaseSchema["relationships"] = [];

  const tableRegex = /Table\s+([A-Za-z_][\w]*)\s*\{([^}]*)\}/g;
  let tableMatch = tableRegex.exec(source);
  while (tableMatch) {
    const name = tableMatch[1];
    const body = tableMatch[2];
    const columns = body
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("//"))
      .map((line) => {
        const parts = line.split(/\s+/);
        const colName = parts[0];
        const rawType = (parts[1] ?? "varchar").toLowerCase();
        const type = TYPE_MAP[rawType] ?? "varchar";
        const attrs = line.slice(line.indexOf("["));
        return {
          name: colName,
          type,
          primaryKey: /\[.*\bpk\b/i.test(attrs),
          increment: /increment/i.test(attrs),
        };
      });
    tables.push({ name, columns });
    tableMatch = tableRegex.exec(source);
  }

  const refRegex = /Ref:\s*([A-Za-z_][\w]*)\.([A-Za-z_][\w]*)\s*[>-]\s*([A-Za-z_][\w]*)\.([A-Za-z_][\w]*)/g;
  let refMatch = refRegex.exec(source);
  while (refMatch) {
    relationships.push({
      fromTable: refMatch[1],
      fromColumn: refMatch[2],
      toTable: refMatch[3],
      toColumn: refMatch[4],
    });
    const fromTable = tables.find((table) => table.name === refMatch?.[1]);
    const column = fromTable?.columns.find((col) => col.name === refMatch?.[2]);
    if (column) {
      column.foreignKey = { table: refMatch[3], column: refMatch[4] };
    }
    refMatch = refRegex.exec(source);
  }

  if (tables.length === 0) {
    errors.push("No tables found in DBML.");
  }

  return { schema: { tables, relationships }, errors };
}

export function formatDbml(source: string): string {
  return source
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim() + "\n";
}

export const DEFAULT_DBML = `// Use DBML to define your database structure

Table users {
  id int [pk, increment]
  username varchar
  role varchar
  age int
}

Table posts {
  id int [pk, increment]
  user_id int
  title varchar
  body text
  status varchar
}

Ref: posts.user_id > users.id
`;
