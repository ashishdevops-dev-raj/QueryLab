import type { DatabaseEngine } from "@/types/database";
import type { SqlEngine } from "./SqlEngine";
import { mockSqlEngine } from "./MockSqlEngine";
import { mySqlEngine, postgresEngine, sqlServerEngine } from "./SqlServerEngine";

export function getSqlEngine(engine: DatabaseEngine): SqlEngine {
  switch (engine) {
    case "postgres":
      return postgresEngine;
    case "mysql":
      return mySqlEngine;
    case "sqlserver":
      return sqlServerEngine;
    default:
      return mockSqlEngine;
  }
}
