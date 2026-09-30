import type { InterviewQuestion } from "@/types/interview";
import type { TableData } from "@/types/database";
import { parseDbml } from "@/utils/dbml";

const TRACK = "Senior Backend Engineer — Data Layer Evaluation";

const employeesDbml = `Table employees {
  id int [pk]
  name varchar
  department varchar
  salary decimal
}`;
const { schema: employeesSchema } = parseDbml(employeesDbml);

const usersPostsDbml = `Table users {
  id int [pk]
  username varchar
  role varchar
}

Table posts {
  id int [pk]
  user_id int
  title varchar
  status varchar
}

Ref: posts.user_id > users.id`;
const { schema: usersPostsSchema } = parseDbml(usersPostsDbml);

const catalogDbml = `Table products {
  id int [pk]
  sku varchar
  name varchar
  stock int
  reorder_level int
}

Table customers {
  id int [pk]
  name varchar
  country varchar
}

Table orders {
  id int [pk]
  customer_id int
  sku varchar
  amount decimal
  status varchar
}

Ref: orders.customer_id > customers.id`;
const { schema: catalogSchema } = parseDbml(catalogDbml);

const sessionsDbml = `Table sessions {
  id int [pk]
  user_id int
  active int
  minutes int
}`;
const { schema: sessionsSchema } = parseDbml(sessionsDbml);

const employees: TableData = {
  tableName: "employees",
  columns: employeesSchema.tables[0].columns,
  rows: [
    { id: 1, name: "Alice Cooper", department: "Engineering", salary: 95000 },
    { id: 2, name: "Bob Vance", department: "Engineering", salary: 120000 },
    { id: 3, name: "Charlie Day", department: "Product", salary: 110000 },
    { id: 4, name: "David Miller", department: "Design", salary: 85000 },
    { id: 5, name: "Eva Green", department: "Engineering", salary: 120000 },
  ],
};

const users: TableData = {
  tableName: "users",
  columns: usersPostsSchema.tables[0].columns,
  rows: [
    { id: 1, username: "John", role: "admin" },
    { id: 2, username: "Jane", role: "user" },
    { id: 3, username: "Milo", role: "user" },
  ],
};

const posts: TableData = {
  tableName: "posts",
  columns: usersPostsSchema.tables[1].columns,
  rows: [
    { id: 1, user_id: 1, title: "Hello World", status: "published" },
    { id: 2, user_id: 1, title: "Hello World", status: "published" },
    { id: 3, user_id: 2, title: "Draft notes", status: "draft" },
  ],
};

const products: TableData = {
  tableName: "products",
  columns: catalogSchema.tables[0].columns,
  rows: [
    { id: 1, sku: "SKU-100", name: "Widget", stock: 4, reorder_level: 10 },
    { id: 2, sku: "SKU-220", name: "Gadget", stock: 40, reorder_level: 8 },
    { id: 3, sku: "SKU-300", name: "Cable", stock: 2, reorder_level: 12 },
  ],
};

const customers: TableData = {
  tableName: "customers",
  columns: catalogSchema.tables[1].columns,
  rows: [
    { id: 1, name: "Acme", country: "US" },
    { id: 2, name: "Globex", country: "UK" },
    { id: 3, name: "Initech", country: "US" },
  ],
};

const catalogOrders: TableData = {
  tableName: "orders",
  columns: catalogSchema.tables[2].columns,
  rows: [
    { id: 1, customer_id: 1, sku: "SKU-100", amount: 400, status: "pending" },
    { id: 2, customer_id: 1, sku: "SKU-220", amount: 250, status: "shipped" },
    { id: 3, customer_id: 2, sku: "SKU-100", amount: 900, status: "pending" },
  ],
};

const sessions: TableData = {
  tableName: "sessions",
  columns: sessionsSchema.tables[0].columns,
  rows: [
    { id: 1, user_id: 1, active: 1, minutes: 42 },
    { id: 2, user_id: 2, active: 0, minutes: 8 },
    { id: 3, user_id: 2, active: 1, minutes: 15 },
    { id: 4, user_id: 3, active: 0, minutes: 3 },
  ],
};

function question(
  partial: Omit<InterviewQuestion, "track" | "database" | "prompt"> & { n: number },
): InterviewQuestion {
  const { n, ...rest } = partial;
  return {
    ...rest,
    prompt: `Question ${n}`,
    database: "postgres",
    track: TRACK,
  };
}

export const extraInterviewQuestions: InterviewQuestion[] = [
  question({
    n: 11,
    id: "q11",
    title: "Users without published posts",
    difficulty: "Medium",
    category: "JOIN",
    points: 150,
    description: "Return usernames of users who have no published posts. Include users with only drafts.",
    schema: usersPostsSchema,
    sampleData: [users, posts],
    expectedResult: [{ username: "Jane" }, { username: "Milo" }],
    expectedColumn: "username",
    starterSql: `SELECT u.username
FROM users u
LEFT JOIN posts p
  ON u.id = p.user_id AND p.status = 'published';`,
    solution: `SELECT u.username
FROM users u
LEFT JOIN posts p ON u.id = p.user_id AND p.status = 'published'
WHERE p.id IS NULL;`,
    testCases: [
      {
        id: "q11t1",
        name: "Basic case",
        description: "Draft-only and no-post users",
        tables: [users, posts],
        expectedRows: [{ username: "Jane" }, { username: "Milo" }],
      },
      {
        id: "q11t2",
        name: "All published",
        description: "Every user has a published post",
        tables: [
          {
            ...users,
            rows: [
              { id: 1, username: "John", role: "admin" },
              { id: 2, username: "Jane", role: "user" },
            ],
          },
          {
            ...posts,
            rows: [
              { id: 1, user_id: 1, title: "A", status: "published" },
              { id: 2, user_id: 2, title: "B", status: "published" },
            ],
          },
        ],
        expectedRows: [],
      },
    ],
  }),
  question({
    n: 12,
    id: "q12",
    title: "Salary band filter",
    difficulty: "Easy",
    category: "WHERE",
    points: 100,
    description: "Return employee names whose salary is between 90000 and 115000 inclusive.",
    schema: employeesSchema,
    sampleData: [employees],
    expectedResult: [{ name: "Alice Cooper" }, { name: "Charlie Day" }],
    expectedColumn: "name",
    starterSql: "SELECT name\nFROM employees\nWHERE salary >= 90000;",
    solution: "SELECT name FROM employees WHERE salary BETWEEN 90000 AND 115000;",
    testCases: [
      {
        id: "q12t1",
        name: "Basic case",
        description: "Inclusive band",
        tables: [employees],
        expectedRows: [{ name: "Alice Cooper" }, { name: "Charlie Day" }],
      },
    ],
  }),
  question({
    n: 13,
    id: "q13",
    title: "High-average departments",
    difficulty: "Medium",
    category: "HAVING",
    points: 150,
    description: "Return departments whose average salary is greater than 100000.",
    schema: employeesSchema,
    sampleData: [employees],
    expectedResult: [{ department: "Engineering" }, { department: "Product" }],
    expectedColumn: "department",
    starterSql: "SELECT department, AVG(salary) AS avg_salary\nFROM employees\nGROUP BY department;",
    solution:
      "SELECT department FROM employees GROUP BY department HAVING AVG(salary) > 100000;",
    testCases: [
      {
        id: "q13t1",
        name: "Basic case",
        description: "Average above 100k",
        tables: [employees],
        expectedRows: [{ department: "Engineering" }, { department: "Product" }],
      },
    ],
  }),
  question({
    n: 14,
    id: "q14",
    title: "Non-engineering employees",
    difficulty: "Medium",
    category: "Subqueries",
    points: 140,
    description: "Using a subquery, return names of employees whose department is not Engineering.",
    schema: employeesSchema,
    sampleData: [employees],
    expectedResult: [{ name: "Charlie Day" }, { name: "David Miller" }],
    expectedColumn: "name",
    starterSql: "SELECT name\nFROM employees\nWHERE department <> 'Engineering';",
    solution: "SELECT name FROM employees WHERE department NOT IN (SELECT department FROM employees WHERE department = 'Engineering');",
    testCases: [
      {
        id: "q14t1",
        name: "Basic case",
        description: "Exclude Engineering",
        tables: [employees],
        expectedRows: [{ name: "Charlie Day" }, { name: "David Miller" }],
      },
    ],
  }),
  question({
    n: 15,
    id: "q15",
    title: "Distinct departments",
    difficulty: "Easy",
    category: "SELECT",
    points: 90,
    description: "Return each distinct department name from employees.",
    schema: employeesSchema,
    sampleData: [employees],
    expectedResult: [{ department: "Design" }, { department: "Engineering" }, { department: "Product" }],
    expectedColumn: "department",
    starterSql: "SELECT department\nFROM employees;",
    solution: "SELECT DISTINCT department FROM employees;",
    testCases: [
      {
        id: "q15t1",
        name: "Basic case",
        description: "Unique department labels",
        tables: [employees],
        expectedRows: [{ department: "Design" }, { department: "Engineering" }, { department: "Product" }],
      },
      {
        id: "q15t2",
        name: "Duplicate handling",
        description: "Repeated Engineering rows",
        tables: [employees],
        expectedRows: [{ department: "Design" }, { department: "Engineering" }, { department: "Product" }],
      },
    ],
  }),
  question({
    n: 16,
    id: "q16",
    title: "Inactive sessions",
    difficulty: "Easy",
    category: "WHERE",
    points: 110,
    description: "Return user_id values from sessions where active = 0.",
    schema: sessionsSchema,
    sampleData: [sessions],
    expectedResult: [{ user_id: 2 }, { user_id: 3 }],
    expectedColumn: "user_id",
    starterSql: "SELECT user_id\nFROM sessions;",
    solution: "SELECT user_id FROM sessions WHERE active = 0;",
    testCases: [
      {
        id: "q16t1",
        name: "Basic case",
        description: "Inactive flags",
        tables: [sessions],
        expectedRows: [{ user_id: 2 }, { user_id: 3 }],
      },
    ],
  }),
  question({
    n: 17,
    id: "q17",
    title: "Top 3 salaries",
    difficulty: "Easy",
    category: "SELECT",
    points: 120,
    description: "Return the three highest employee salaries, including ties, ordered descending.",
    schema: employeesSchema,
    sampleData: [employees],
    expectedResult: [{ salary: 120000 }, { salary: 120000 }, { salary: 110000 }],
    expectedColumn: "salary",
    starterSql: "SELECT salary\nFROM employees\nORDER BY salary DESC;",
    solution: "SELECT salary FROM employees ORDER BY salary DESC LIMIT 3;",
    testCases: [
      {
        id: "q17t1",
        name: "Basic case",
        description: "Top three rows by salary",
        tables: [employees],
        expectedRows: [{ salary: 120000 }, { salary: 120000 }, { salary: 110000 }],
      },
    ],
  }),
  question({
    n: 18,
    id: "q18",
    title: "Pending order value",
    difficulty: "Easy",
    category: "Transactions",
    points: 120,
    description: "Sum the amount of orders still in pending status. Treat this as a read of uncommitted checkout work.",
    schema: catalogSchema,
    sampleData: [catalogOrders],
    expectedResult: [{ pending_total: 1300 }],
    expectedColumn: "pending_total",
    starterSql: "SELECT SUM(amount) AS pending_total\nFROM orders;",
    solution: "SELECT SUM(amount) AS pending_total FROM orders WHERE status = 'pending';",
    testCases: [
      {
        id: "q18t1",
        name: "Basic case",
        description: "Pending only",
        tables: [catalogOrders],
        expectedRows: [{ pending_total: 1300 }],
      },
      {
        id: "q18t2",
        name: "No pending",
        description: "All shipped",
        tables: [
          {
            ...catalogOrders,
            rows: [{ id: 1, customer_id: 1, sku: "SKU-100", amount: 50, status: "shipped" }],
          },
        ],
        expectedRows: [{ pending_total: null }],
      },
    ],
  }),
  question({
    n: 19,
    id: "q19",
    title: "Engineering peers",
    difficulty: "Medium",
    category: "JOIN",
    points: 150,
    description: "Using a self-join, return distinct employee names who share a department with Bob Vance (exclude Bob).",
    schema: employeesSchema,
    sampleData: [employees],
    expectedResult: [{ name: "Alice Cooper" }, { name: "Eva Green" }],
    expectedColumn: "name",
    starterSql: `SELECT a.name
FROM employees a
JOIN employees b
  ON a.department = b.department;`,
    solution: `SELECT DISTINCT a.name
FROM employees a
JOIN employees b ON a.department = b.department
WHERE b.name = 'Bob Vance' AND a.name <> 'Bob Vance';`,
    testCases: [
      {
        id: "q19t1",
        name: "Basic case",
        description: "Same department as Bob",
        tables: [employees],
        expectedRows: [{ name: "Alice Cooper" }, { name: "Eva Green" }],
      },
    ],
  }),
  question({
    n: 20,
    id: "q20",
    title: "Duplicate post titles",
    difficulty: "Medium",
    category: "GROUP BY",
    points: 140,
    description: "Return titles that appear more than once in posts.",
    schema: usersPostsSchema,
    sampleData: [posts],
    expectedResult: [{ title: "Hello World" }],
    expectedColumn: "title",
    starterSql: "SELECT title, COUNT(*) AS n\nFROM posts\nGROUP BY title;",
    solution: "SELECT title FROM posts GROUP BY title HAVING COUNT(*) > 1;",
    testCases: [
      {
        id: "q20t1",
        name: "Basic case",
        description: "Repeated Hello World",
        tables: [posts],
        expectedRows: [{ title: "Hello World" }],
      },
      {
        id: "q20t2",
        name: "No duplicates",
        description: "Unique titles only",
        tables: [
          {
            ...posts,
            rows: [
              { id: 1, user_id: 1, title: "A", status: "published" },
              { id: 2, user_id: 2, title: "B", status: "draft" },
            ],
          },
        ],
        expectedRows: [],
      },
    ],
  }),
  question({
    n: 21,
    id: "q21",
    title: "Reorder alerts",
    difficulty: "Easy",
    category: "WHERE",
    points: 110,
    description: "Return product names where stock is below reorder_level.",
    schema: catalogSchema,
    sampleData: [products],
    expectedResult: [{ name: "Cable" }, { name: "Widget" }],
    expectedColumn: "name",
    starterSql: "SELECT name, stock, reorder_level\nFROM products;",
    solution: "SELECT name FROM products WHERE stock < reorder_level;",
    testCases: [
      {
        id: "q21t1",
        name: "Basic case",
        description: "Stock vs reorder",
        tables: [products],
        expectedRows: [{ name: "Cable" }, { name: "Widget" }],
      },
    ],
  }),
  question({
    n: 22,
    id: "q22",
    title: "Customer spend",
    difficulty: "Medium",
    category: "JOIN",
    points: 150,
    description: "Return each customer name and their total order amount. Include customers with no orders as 0 or NULL.",
    schema: catalogSchema,
    sampleData: [customers, catalogOrders],
    expectedResult: [
      { name: "Acme", total: 650 },
      { name: "Globex", total: 900 },
      { name: "Initech", total: null },
    ],
    expectedColumn: "name",
    starterSql: `SELECT c.name, SUM(o.amount) AS total
FROM customers c
LEFT JOIN orders o
  ON c.id = o.customer_id
GROUP BY c.name;`,
    solution: `SELECT c.name, SUM(o.amount) AS total
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.name;`,
    testCases: [
      {
        id: "q22t1",
        name: "Basic case",
        description: "LEFT JOIN totals",
        tables: [customers, catalogOrders],
        expectedRows: [
          { name: "Acme", total: 650 },
          { name: "Globex", total: 900 },
          { name: "Initech", total: null },
        ],
      },
    ],
  }),
  question({
    n: 23,
    id: "q23",
    title: "Lowest salary by department",
    difficulty: "Easy",
    category: "GROUP BY",
    points: 120,
    description: "Return department and the minimum salary in that department.",
    schema: employeesSchema,
    sampleData: [employees],
    expectedResult: [
      { department: "Design", min_salary: 85000 },
      { department: "Engineering", min_salary: 95000 },
      { department: "Product", min_salary: 110000 },
    ],
    expectedColumn: "department",
    starterSql: "SELECT department, MIN(salary) AS min_salary\nFROM employees\nGROUP BY department;",
    solution: "SELECT department, MIN(salary) AS min_salary FROM employees GROUP BY department;",
    testCases: [
      {
        id: "q23t1",
        name: "Basic case",
        description: "MIN per group",
        tables: [employees],
        expectedRows: [
          { department: "Design", min_salary: 85000 },
          { department: "Engineering", min_salary: 95000 },
          { department: "Product", min_salary: 110000 },
        ],
      },
    ],
  }),
  question({
    n: 24,
    id: "q24",
    title: "Session minutes CTE",
    difficulty: "Medium",
    category: "CTE",
    points: 160,
    description: "Using a CTE, return user_id values whose total session minutes exceed 20.",
    schema: sessionsSchema,
    sampleData: [sessions],
    expectedResult: [{ user_id: 1 }],
    expectedColumn: "user_id",
    starterSql: `WITH totals AS (
  SELECT user_id, SUM(minutes) AS total_minutes
  FROM sessions
  GROUP BY user_id
)
SELECT user_id FROM totals;`,
    solution: `WITH totals AS (
  SELECT user_id, SUM(minutes) AS total_minutes
  FROM sessions
  GROUP BY user_id
)
SELECT user_id FROM totals WHERE total_minutes > 20;`,
    testCases: [
      {
        id: "q24t1",
        name: "Basic case",
        description: "CTE threshold",
        tables: [sessions],
        expectedRows: [{ user_id: 1 }],
      },
    ],
  }),
  question({
    n: 25,
    id: "q25",
    title: "Sargable SKU lookup",
    difficulty: "Medium",
    category: "Indexes",
    points: 130,
    description: "Select the product name for sku = 'SKU-220'. Keep the predicate sargable (no function on sku).",
    schema: catalogSchema,
    sampleData: [products],
    expectedResult: [{ name: "Gadget" }],
    expectedColumn: "name",
    starterSql: "SELECT name FROM products WHERE sku = 'SKU-220';",
    solution: "SELECT name FROM products WHERE sku = 'SKU-220';",
    testCases: [
      {
        id: "q25t1",
        name: "Basic case",
        description: "Equality lookup",
        tables: [products],
        expectedRows: [{ name: "Gadget" }],
      },
    ],
  }),
];
