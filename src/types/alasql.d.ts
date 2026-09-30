declare module "alasql" {
  interface AlaSQL {
    (sql: string, params?: unknown[]): unknown;
    tables: Record<string, { data: unknown[] }>;
  }

  const alasql: AlaSQL;
  export default alasql;
}
