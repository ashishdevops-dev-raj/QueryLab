import type { Project } from "@/types/project";
import { parseDbml, DEFAULT_DBML } from "@/utils/dbml";
import { DEFAULT_SQL } from "@/utils/sql";
import type { TableData } from "@/types/database";

const { schema } = parseDbml(DEFAULT_DBML);

export const defaultUsersTable: TableData = {
  tableName: "users",
  columns: schema.tables[0].columns,
  rows: [
    { id: 1, username: "John", role: "admin", age: 20 },
    { id: 2, username: "Jane", role: "user", age: 30 },
  ],
};

export const defaultPostsTable: TableData = {
  tableName: "posts",
  columns: schema.tables[1].columns,
  rows: [
    { id: 1, user_id: 1, title: "Hello World", body: "This is my first post", status: "published" },
    { id: 2, user_id: 1, title: "Hello World", body: "This is my second post", status: "published" },
    { id: 3, user_id: 2, title: "Hello World", body: "This is my third post", status: "published" },
  ],
};

const employeesDbml = `Table employees {
  id int [pk, increment]
  name varchar
  department varchar
  salary decimal
}
`;

const { schema: employeeSchema } = parseDbml(employeesDbml);

const employeesTable: TableData = {
  tableName: "employees",
  columns: employeeSchema.tables[0].columns,
  rows: [
    { id: 1, name: "Alice", department: "Engineering", salary: 120000 },
    { id: 2, name: "Bob", department: "Engineering", salary: 95000 },
    { id: 3, name: "Charlie", department: "Finance", salary: 110000 },
    { id: 4, name: "David", department: "Finance", salary: 85000 },
  ],
};

const inventoryDbml = `Table inventory {
  id int [pk]
  sku varchar
  reserved int
  available int
}

Table orders {
  id int [pk]
  sku varchar
  qty int
  status varchar
}

Ref: orders.sku > inventory.sku
`;

const { schema: inventorySchema } = parseDbml(inventoryDbml);

const payrollDbml = `Table employees {
  id int [pk]
  name varchar
  department varchar
  salary decimal
}

Table departments {
  id int [pk]
  name varchar
  budget decimal
}
`;

const { schema: payrollSchema } = parseDbml(payrollDbml);

export const seedProjects: Project[] = [
  {
    id: "proj_example_run",
    name: "Example Run",
    description: "Scratch environment testing window aggregation partitions across legacy ledger entries.",
    engine: "sqlserver",
    kind: "playground",
    owner: "Alex Morgan",
    tags: ["demo", "staging"],
    favorite: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    lastEditedLabel: "2 minutes ago",
    queryCount: 14,
    tableCount: 2,
    dbml: DEFAULT_DBML,
    sql: DEFAULT_SQL,
    schema,
    tables: [defaultUsersTable, defaultPostsTable],
  },
  {
    id: "proj_sql_interview",
    name: "SQL Interview",
    description: "Technical challenge evaluating recursive CTE algorithms, index cardinality, and locking mechanics.",
    engine: "postgres",
    kind: "interview",
    owner: "Alex Morgan",
    tags: ["interview", "candidate-eval"],
    favorite: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    lastEditedLabel: "1 hour ago",
    queryCount: 5,
    tableCount: 1,
    dbml: employeesDbml,
    sql: `SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
OFFSET 1 ROW
FETCH NEXT 1 ROW ONLY;`,
    schema: employeeSchema,
    tables: [employeesTable],
  },
  {
    id: "proj_prod_debug",
    name: "Production Debugging",
    description: "Investigating high write latency on the inventory reservations table during holiday checkout spikes.",
    engine: "mysql",
    kind: "replica",
    owner: "Alex Morgan",
    tags: ["incident-402", "high-priority"],
    favorite: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    lastEditedLabel: "yesterday",
    queryCount: 31,
    tableCount: 2,
    dbml: inventoryDbml,
    sql: `SELECT sku, SUM(qty) AS reserved
FROM orders
WHERE status = 'pending'
GROUP BY sku
ORDER BY reserved DESC;`,
    schema: inventorySchema,
    tables: [
      {
        tableName: "inventory",
        columns: inventorySchema.tables[0].columns,
        rows: [
          { id: 1, sku: "SKU-100", reserved: 12, available: 40 },
          { id: 2, sku: "SKU-220", reserved: 4, available: 18 },
        ],
      },
      {
        tableName: "orders",
        columns: inventorySchema.tables[1].columns,
        rows: [
          { id: 1, sku: "SKU-100", qty: 8, status: "pending" },
          { id: 2, sku: "SKU-100", qty: 4, status: "pending" },
          { id: 3, sku: "SKU-220", qty: 4, status: "shipped" },
        ],
      },
    ],
  },
  {
    id: "proj_employee_analytics",
    name: "Employee Analytics",
    description: "Analytical OLAP queries computing quarterly compensation equity curves across departments.",
    engine: "postgres",
    kind: "analytics",
    owner: "Alex Morgan",
    tags: ["bi", "adhoc"],
    favorite: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    lastEditedLabel: "3 days ago",
    queryCount: 22,
    tableCount: 2,
    dbml: payrollDbml,
    sql: `SELECT department, COUNT(*) AS employee_count, AVG(salary) AS avg_salary
FROM employees
GROUP BY department
ORDER BY avg_salary DESC;`,
    schema: payrollSchema,
    tables: [
      employeesTable,
      {
        tableName: "departments",
        columns: payrollSchema.tables[1].columns,
        rows: [
          { id: 1, name: "Engineering", budget: 900000 },
          { id: 2, name: "Finance", budget: 420000 },
        ],
      },
    ],
  },
];

export const seedHistory = [
  {
    id: "hist_1",
    query: "SELECT username, COUNT(*) FROM users GROUP BY username HAVING COUNT(*) > 1;",
    projectId: "proj_example_run",
    projectName: "Example Run",
    database: "sqlserver" as const,
    executionTimeMs: 1.4,
    rowsReturned: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    status: "success" as const,
  },
  {
    id: "hist_2",
    query: `SELECT DISTINCT salary FROM employees ORDER BY salary DESC OFFSET 1 ROW FETCH NEXT 1 ROW ONLY;`,
    projectId: "proj_sql_interview",
    projectName: "SQL Interview",
    database: "postgres" as const,
    executionTimeMs: 2.1,
    rowsReturned: 1,
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    status: "success" as const,
  },
  {
    id: "hist_3",
    query: "SELECT department, COUNT(*) FROM employees GROUP BY department;",
    projectId: "proj_employee_analytics",
    projectName: "Employee Analytics",
    database: "postgres" as const,
    executionTimeMs: 1.9,
    rowsReturned: 2,
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    status: "success" as const,
  },
  {
    id: "hist_4",
    query: "SELECT * FROM employees ORDER BY salary DESC LIMIT 3;",
    projectId: "proj_employee_analytics",
    projectName: "Employee Analytics",
    database: "postgres" as const,
    executionTimeMs: 1.1,
    rowsReturned: 3,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    status: "success" as const,
  },
  {
    id: "hist_5",
    query: "SELECT SUM(qty) FROM orders WHERE status = 'pending';",
    projectId: "proj_prod_debug",
    projectName: "Production Debugging",
    database: "mysql" as const,
    executionTimeMs: 3.4,
    rowsReturned: 1,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    status: "success" as const,
  },
  {
    id: "hist_6",
    query: "SELECT * FROM users WHERE last_login < NOW() - INTERVAL '90 days';",
    projectId: "proj_example_run",
    projectName: "Example Run",
    database: "sqlserver" as const,
    executionTimeMs: 0.8,
    rowsReturned: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: "error" as const,
    errorMessage: "Incorrect syntax near 'INTERVAL'",
  },
];
