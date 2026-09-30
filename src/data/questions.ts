import type { InterviewQuestion } from "@/types/interview";
import type { TableData } from "@/types/database";
import { parseDbml } from "@/utils/dbml";
import { extraInterviewQuestions } from "./more-questions";

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

const ordersDbml = `Table orders {
  id int [pk]
  customer varchar
  amount decimal
  month varchar
}`;

const { schema: ordersSchema } = parseDbml(ordersDbml);

const baseEmployees: TableData = {
  tableName: "employees",
  columns: employeesSchema.tables[0].columns,
  rows: [
    { id: 1, name: "Alice", department: "Engineering", salary: 120000 },
    { id: 2, name: "Bob", department: "Engineering", salary: 95000 },
    { id: 3, name: "Charlie", department: "Finance", salary: 110000 },
    { id: 4, name: "David", department: "Finance", salary: 85000 },
  ],
};

const duplicateEmployees: TableData = {
  ...baseEmployees,
  rows: [
    ...baseEmployees.rows,
    { id: 5, name: "Eva", department: "Engineering", salary: 120000 },
  ],
};

const nullEmployees: TableData = {
  ...baseEmployees,
  rows: [
    { id: 1, name: "Alice", department: "Engineering", salary: 120000 },
    { id: 2, name: "Bob", department: "Engineering", salary: null },
  ],
};

const coreInterviewQuestions: InterviewQuestion[] = [
  {
    id: "q1",
    title: "User Retention",
    prompt: "Question 1",
    difficulty: "Easy",
    category: "SELECT",
    database: "postgres",
    points: 100,
    track: "Senior Backend Engineer — Data Layer Evaluation",
    description: "Return every username from the users table ordered alphabetically.",
    schema: usersPostsSchema,
    sampleData: [
      {
        tableName: "users",
        columns: usersPostsSchema.tables[0].columns,
        rows: [
          { id: 1, username: "John", role: "admin" },
          { id: 2, username: "Jane", role: "user" },
        ],
      },
    ],
    expectedResult: [{ username: "Jane" }, { username: "John" }],
    expectedColumn: "username",
    starterSql: "SELECT username\nFROM users;",
    solution: "SELECT username FROM users ORDER BY username;",
    testCases: [
      {
        id: "q1t1",
        name: "Basic case",
        description: "Two users",
        tables: [
          {
            tableName: "users",
            columns: usersPostsSchema.tables[0].columns,
            rows: [
              { id: 1, username: "John", role: "admin" },
              { id: 2, username: "Jane", role: "user" },
            ],
          },
        ],
        expectedRows: [{ username: "Jane" }, { username: "John" }],
      },
    ],
  },
  {
    id: "q2",
    title: "Second highest salary",
    prompt: "Question 2",
    difficulty: "Medium",
    category: "Subqueries",
    database: "postgres",
    points: 150,
    track: "Senior Backend Engineer — Data Layer Evaluation",
    description:
      "Find the second highest salary from the employees table. If there is no distinct second highest salary, return NULL.",
    schema: employeesSchema,
    sampleData: [baseEmployees],
    expectedResult: [{ salary: 110000 }],
    expectedColumn: "salary",
    starterSql: `SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
OFFSET 1 ROW
FETCH NEXT 1 ROW ONLY;`,
    solution: `SELECT MAX(salary) AS salary
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);`,
    testCases: [
      {
        id: "q2t1",
        name: "Basic case",
        description: "Distinct salary tiers",
        tables: [baseEmployees],
        expectedRows: [{ salary: 110000 }],
      },
      {
        id: "q2t2",
        name: "Duplicate salary case",
        description: "Two employees share the top salary",
        tables: [duplicateEmployees],
        expectedRows: [{ salary: 110000 }],
      },
      {
        id: "q2t3",
        name: "NULL salary case",
        description: "Fewer than two distinct salaries",
        tables: [nullEmployees],
        expectedRows: [{ salary: null }],
      },
    ],
  },
  {
    id: "q3",
    title: "Engineering salaries",
    prompt: "Question 3",
    difficulty: "Easy",
    category: "WHERE",
    database: "postgres",
    points: 100,
    track: "Senior Backend Engineer — Data Layer Evaluation",
    description: "Return names of employees in Engineering earning more than 100000.",
    schema: employeesSchema,
    sampleData: [baseEmployees],
    expectedResult: [{ name: "Alice" }],
    expectedColumn: "name",
    starterSql: "SELECT name\nFROM employees\nWHERE department = 'Engineering';",
    solution: "SELECT name FROM employees WHERE department = 'Engineering' AND salary > 100000;",
    testCases: [
      {
        id: "q3t1",
        name: "Basic case",
        description: "Filter by department and salary",
        tables: [baseEmployees],
        expectedRows: [{ name: "Alice" }],
      },
    ],
  },
  {
    id: "q4",
    title: "Users with posts",
    prompt: "Question 4",
    difficulty: "Medium",
    category: "JOIN",
    database: "postgres",
    points: 150,
    track: "Senior Backend Engineer — Data Layer Evaluation",
    description: "Return usernames and post titles for published posts.",
    schema: usersPostsSchema,
    sampleData: [
      {
        tableName: "users",
        columns: usersPostsSchema.tables[0].columns,
        rows: [
          { id: 1, username: "John", role: "admin" },
          { id: 2, username: "Jane", role: "user" },
        ],
      },
      {
        tableName: "posts",
        columns: usersPostsSchema.tables[1].columns,
        rows: [
          { id: 1, user_id: 1, title: "Hello World", status: "published" },
          { id: 2, user_id: 2, title: "Draft notes", status: "draft" },
        ],
      },
    ],
    expectedResult: [{ username: "John", title: "Hello World" }],
    expectedColumn: "username",
    starterSql: "SELECT u.username, p.title\nFROM users u\nJOIN posts p ON u.id = p.user_id;",
    solution:
      "SELECT u.username, p.title FROM users u JOIN posts p ON u.id = p.user_id WHERE p.status = 'published';",
    testCases: [
      {
        id: "q4t1",
        name: "Basic case",
        description: "Inner join published posts",
        tables: [
          {
            tableName: "users",
            columns: usersPostsSchema.tables[0].columns,
            rows: [
              { id: 1, username: "John", role: "admin" },
              { id: 2, username: "Jane", role: "user" },
            ],
          },
          {
            tableName: "posts",
            columns: usersPostsSchema.tables[1].columns,
            rows: [
              { id: 1, user_id: 1, title: "Hello World", status: "published" },
              { id: 2, user_id: 2, title: "Draft notes", status: "draft" },
            ],
          },
        ],
        expectedRows: [{ username: "John", title: "Hello World" }],
      },
    ],
  },
  {
    id: "q5",
    title: "Department employee count",
    prompt: "Question 5",
    difficulty: "Easy",
    category: "GROUP BY",
    database: "postgres",
    points: 120,
    track: "Senior Backend Engineer — Data Layer Evaluation",
    description: "Count employees in each department.",
    schema: employeesSchema,
    sampleData: [baseEmployees],
    expectedResult: [
      { department: "Engineering", employee_count: 2 },
      { department: "Finance", employee_count: 2 },
    ],
    expectedColumn: "department",
    starterSql: "SELECT department, COUNT(*) AS employee_count\nFROM employees\nGROUP BY department;",
    solution: "SELECT department, COUNT(*) AS employee_count FROM employees GROUP BY department;",
    testCases: [
      {
        id: "q5t1",
        name: "Basic case",
        description: "Group count",
        tables: [baseEmployees],
        expectedRows: [
          { department: "Engineering", employee_count: 2 },
          { department: "Finance", employee_count: 2 },
        ],
      },
    ],
  },
  {
    id: "q6",
    title: "High-headcount departments",
    prompt: "Question 6",
    difficulty: "Medium",
    category: "HAVING",
    database: "postgres",
    points: 140,
    track: "Senior Backend Engineer — Data Layer Evaluation",
    description: "Return departments with more than one employee.",
    schema: employeesSchema,
    sampleData: [baseEmployees],
    expectedResult: [
      { department: "Engineering" },
      { department: "Finance" },
    ],
    expectedColumn: "department",
    starterSql: "SELECT department\nFROM employees\nGROUP BY department;",
    solution: "SELECT department FROM employees GROUP BY department HAVING COUNT(*) > 1;",
    testCases: [
      {
        id: "q6t1",
        name: "Basic case",
        description: "HAVING filter",
        tables: [baseEmployees],
        expectedRows: [{ department: "Engineering" }, { department: "Finance" }],
      },
    ],
  },
  {
    id: "q7",
    title: "Salary rank",
    prompt: "Question 7",
    difficulty: "Hard",
    category: "Window Functions",
    database: "postgres",
    points: 180,
    track: "Senior Backend Engineer — Data Layer Evaluation",
    description: "Return each employee name with a dense rank by salary descending.",
    schema: employeesSchema,
    sampleData: [baseEmployees],
    expectedResult: [
      { name: "Alice", rnk: 1 },
      { name: "Charlie", rnk: 2 },
      { name: "Bob", rnk: 3 },
      { name: "David", rnk: 4 },
    ],
    expectedColumn: "name",
    starterSql: "SELECT name, salary\nFROM employees;",
    solution:
      "SELECT name, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk FROM employees ORDER BY rnk, name;",
    testCases: [
      {
        id: "q7t1",
        name: "Basic case",
        description: "Dense rank",
        tables: [baseEmployees],
        expectedRows: [
          { name: "Alice", rnk: 1 },
          { name: "Charlie", rnk: 2 },
          { name: "Bob", rnk: 3 },
          { name: "David", rnk: 4 },
        ],
      },
    ],
  },
  {
    id: "q8",
    title: "Above-average salaries",
    prompt: "Question 8",
    difficulty: "Medium",
    category: "CTE",
    database: "postgres",
    points: 160,
    track: "Senior Backend Engineer — Data Layer Evaluation",
    description: "Using a CTE, return employees whose salary is above the company average.",
    schema: employeesSchema,
    sampleData: [baseEmployees],
    expectedResult: [{ name: "Alice" }, { name: "Charlie" }],
    expectedColumn: "name",
    starterSql: "WITH avg_sal AS (\n  SELECT AVG(salary) AS v FROM employees\n)\nSELECT name FROM employees;",
    solution:
      "WITH avg_sal AS (SELECT AVG(salary) AS v FROM employees) SELECT name FROM employees, avg_sal WHERE salary > v;",
    testCases: [
      {
        id: "q8t1",
        name: "Basic case",
        description: "CTE average filter",
        tables: [baseEmployees],
        expectedRows: [{ name: "Alice" }, { name: "Charlie" }],
      },
    ],
  },
  {
    id: "q9",
    title: "Index-friendly lookup",
    prompt: "Question 9",
    difficulty: "Medium",
    category: "Indexes",
    database: "postgres",
    points: 130,
    track: "Senior Backend Engineer — Data Layer Evaluation",
    description: "Select employee name by primary key id = 3. Keep the predicate sargable.",
    schema: employeesSchema,
    sampleData: [baseEmployees],
    expectedResult: [{ name: "Charlie" }],
    expectedColumn: "name",
    starterSql: "SELECT name FROM employees WHERE id = 3;",
    solution: "SELECT name FROM employees WHERE id = 3;",
    testCases: [
      {
        id: "q9t1",
        name: "Basic case",
        description: "PK lookup",
        tables: [baseEmployees],
        expectedRows: [{ name: "Charlie" }],
      },
    ],
  },
  {
    id: "q10",
    title: "Monthly revenue",
    prompt: "Question 10",
    difficulty: "Easy",
    category: "SELECT",
    database: "postgres",
    points: 110,
    track: "Senior Backend Engineer — Data Layer Evaluation",
    description: "Sum order amounts by month.",
    schema: ordersSchema,
    sampleData: [
      {
        tableName: "orders",
        columns: ordersSchema.tables[0].columns,
        rows: [
          { id: 1, customer: "Acme", amount: 400, month: "Jan" },
          { id: 2, customer: "Globex", amount: 250, month: "Jan" },
          { id: 3, customer: "Acme", amount: 900, month: "Feb" },
        ],
      },
    ],
    expectedResult: [
      { month: "Feb", revenue: 900 },
      { month: "Jan", revenue: 650 },
    ],
    expectedColumn: "month",
    starterSql: "SELECT month, SUM(amount) AS revenue\nFROM orders\nGROUP BY month;",
    solution: "SELECT month, SUM(amount) AS revenue FROM orders GROUP BY month ORDER BY revenue DESC;",
    testCases: [
      {
        id: "q10t1",
        name: "Basic case",
        description: "Monthly totals",
        tables: [
          {
            tableName: "orders",
            columns: ordersSchema.tables[0].columns,
            rows: [
              { id: 1, customer: "Acme", amount: 400, month: "Jan" },
              { id: 2, customer: "Globex", amount: 250, month: "Jan" },
              { id: 3, customer: "Acme", amount: 900, month: "Feb" },
            ],
          },
        ],
        expectedRows: [
          { month: "Feb", revenue: 900 },
          { month: "Jan", revenue: 650 },
        ],
      },
    ],
  },
];

export const interviewQuestions: InterviewQuestion[] = [
  ...coreInterviewQuestions,
  ...extraInterviewQuestions,
];
