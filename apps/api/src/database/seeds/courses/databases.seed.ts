import { CourseModel } from '../../models/Course';
import { ModuleModel } from '../../models/Module';
import { LessonModel } from '../../models/Lesson';
import { ActivityModel } from '../../models/Activity';
import { AssessmentModel } from '../../models/Assessment';
import { ChallengeModel } from '../../models/Challenge';

export async function seedDatabaseCourses(resourceMap: Map<string, any>) {
  const getRes = (titlePrefix: string) => {
    for (const [title, r] of resourceMap.entries()) {
      if (title.toLowerCase().includes(titlePrefix.toLowerCase())) return r;
    }
    return undefined;
  };

  // =========================================================================
  // 1. SQL & RELATIONAL DATABASES (4 MODULES, 8 LESSONS)
  // =========================================================================
  const sqlCourse = await CourseModel.create({
    slug: 'sql-databases',
    title: 'SQL & Relational Database Engineering',
    description: 'Master relational schema modeling, 3NF normalization, complex multi-table joins, aggregations, window functions, B-tree indexes, and ACID transactions.',
    domain: 'Database & Data',
    level: 'BEGINNER',
    status: 'PUBLISHED',
    estimatedHours: 35,
    skillsCovered: ['sql-queries', 'relational-modeling', 'database-indexing', 'acid-transactions'],
    prerequisites: ['Basic tabular data comprehension'],
    modules: [],
  });

  const sqlMod1 = await ModuleModel.create({
    courseId: sqlCourse._id,
    title: `Module 1: Relational Modeling & Schema Design`,
    description: `Relational algebra, tables, columns, primary & foreign keys, data types, and 3NF normalization.`,
    order: 1,
    lessons: [],
  });

  // --- Lesson 1: Relational Foundations & Table Schema Design ---
  const sqlL1 = await LessonModel.create({
    moduleId: sqlMod1._id,
    courseId: sqlCourse._id,
    title: `Relational Foundations & Table Schema Design`,
    description: `Understand tables, primary keys, foreign keys, and DDL table creation.`,
    order: 1,
    activities: [],
  });

  const sqlL1_Video = await ActivityModel.create({
    lessonId: sqlL1._id,
    type: 'VIDEO',
    title: `Video: SQL Relational Foundations & Schema Design`,
    order: 1,
    resourceRef: getRes('What is SQL and Database Design in Tamil')?._id,
    content: `# Key Takeaways:
- RDBMS stores structured data in 2D tables with strict types.
- Primary keys uniquely identify rows; foreign keys enforce referential integrity.
- Normalization eliminates anomalies and duplicate records.`,
  });

  const sqlL1_Notes = await ActivityModel.create({
    lessonId: sqlL1._id,
    type: 'NOTES',
    title: `Codexa Notes: Relational Foundations & Table Schema Design`,
    order: 2,
    content: `# Relational Foundations & Table Schema Design

Understand tables, primary keys, foreign keys, and DDL table creation.

Relational Database Management Systems (RDBMS) like PostgreSQL and MySQL organize data into structured tables consisting of rows and columns.

---

### Core Relational Concepts
1. **Primary Key (PK)**: Unique, non-null identifier for each record.
2. **Foreign Key (FK)**: References a Primary Key in another table, enforcing referential integrity.
3. **Constraints**: \`NOT NULL\`, \`UNIQUE\`, \`CHECK\`, \`DEFAULT\`.

### CREATE TABLE Syntax
\`\`\`sql
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    salary NUMERIC(10, 2) NOT NULL CHECK (salary >= 0)
);
\`\`\`

## Why Relational Foundations & Table Schema Design Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use INTEGER PRIMARY KEY

> ⚠️ **Common Mistake**: Foreign keys enforce referential integrity between tables, ensuring that relationships between rows remain consistent.

## Real-World Production Scenario

In production engineering, **Relational Foundations & Table Schema Design** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Relational Foundations & Table Schema Design. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('PostgreSQL Documentation: SQL')?._id,
  });

  const sqlL1_Challenge = await ChallengeModel.create({
    title: `Design a Relational Table Schema`,
    description: `Write a SQL DDL statement to create a table named \`customers\` with \`id\` (INTEGER PRIMARY KEY), \`email\` (VARCHAR(100) UNIQUE NOT NULL), and \`balance\` (NUMERIC(10,2) DEFAULT 0.00).`,
    difficulty: 'EASY',
    language: 'sql',
    starterCode: `-- Write your CREATE TABLE statement below:
`,
    solutionCode: `CREATE TABLE customers (
    id INTEGER PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    balance NUMERIC(10, 2) DEFAULT 0.00
);`,
    hints: ["Use INTEGER PRIMARY KEY", "Add UNIQUE NOT NULL to email", "Specify DEFAULT 0.00 for balance"],
    skills: [{"skillId": "sql-queries", "weight": 1.0}],
    testCases: [{"input": "CREATE TABLE", "expectedOutput": "CREATE TABLE customers", "description": "Creates customers table with constraints", "hidden": false}],
  });

  const sqlL1_Practice = await ActivityModel.create({
    lessonId: sqlL1._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Design a Relational Table Schema`,
    order: 3,
    challengeRef: sqlL1_Challenge._id,
    content: `# Code Practice: Design a Relational Table Schema\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  sqlL1_Challenge.activityId = sqlL1_Practice._id;
  await sqlL1_Challenge.save();

  const sqlL1_Quiz = await AssessmentModel.create({
    title: `Assessment: Relational Schema & Keys`,
    description: `Test your mastery of primary keys, foreign keys, and normalization.`,
    passingScore: 70,
    skills: [{"skillId": "relational-modeling", "weight": 1.0}],
    questions: [
    {
        "question": "What is the primary purpose of a Foreign Key in a relational schema?",
        "options": [
            "To compress stored table data on disk",
            "To enforce referential integrity by ensuring child row values point to valid parent primary keys",
            "To index full-text strings for fuzzy search",
            "To auto-increment row IDs"
        ],
        "explanation": "Foreign keys enforce referential integrity between tables, ensuring that relationships between rows remain consistent.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    },
    {
        "question": "What requirement must a table satisfy to achieve Third Normal Form (3NF)?",
        "options": [
            "It must contain JSON columns for flexible attributes",
            "It must have no indexes defined on foreign keys",
            "It must satisfy 2NF and contain no transitive functional dependencies",
            "It must contain only one column per table"
        ],
        "explanation": "3NF requires a table to be in 2NF and have every non-key column depend directly and solely on the primary key, eliminating transitive dependencies.",
        "correctOption": 2,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const sqlL1_Assessment = await ActivityModel.create({
    lessonId: sqlL1._id,
    type: 'QUIZ',
    title: `Assessment: Relational Schema & Keys`,
    order: 4,
    assessmentRef: sqlL1_Quiz._id,
  });
  sqlL1_Quiz.activityId = sqlL1_Assessment._id;
  await sqlL1_Quiz.save();

  sqlL1.activities = [
    sqlL1_Video._id,
    sqlL1_Notes._id,
    sqlL1_Practice._id,
    sqlL1_Assessment._id,
  ] as any;
  await sqlL1.save();

  // --- Lesson 2: SQL Data Types & CHECK Constraints ---
  const sqlL2 = await LessonModel.create({
    moduleId: sqlMod1._id,
    courseId: sqlCourse._id,
    title: `SQL Data Types & CHECK Constraints`,
    description: `Learn exact numerics, character types, timestamps, and business validation constraints.`,
    order: 2,
    activities: [],
  });

  const sqlL2_Video = await ActivityModel.create({
    lessonId: sqlL2._id,
    type: 'VIDEO',
    title: `Video: SQL Data Types & Column Constraints`,
    order: 1,
    resourceRef: getRes('SQL DDL Commands CREATE ALTER DROP in Tamil')?._id,
    content: `# Key Takeaways:
- Use NUMERIC/DECIMAL for currency to prevent floating-point rounding errors.
- Enforce business validations at the database layer with CHECK constraints.
- Use TIMESTAMPTZ to store timestamps with timezone awareness.`,
  });

  const sqlL2_Notes = await ActivityModel.create({
    lessonId: sqlL2._id,
    type: 'NOTES',
    title: `Codexa Notes: SQL Data Types & CHECK Constraints`,
    order: 2,
    content: `# SQL Data Types & CHECK Constraints

Learn exact numerics, character types, timestamps, and business validation constraints.

Choosing the correct data type guarantees data integrity and prevents downstream application bugs.

---

### Numeric Data Types
- \`INT\` / \`BIGINT\`: Whole numbers.
- \`NUMERIC(precision, scale)\` / \`DECIMAL(p, s)\`: Exact fixed-point numeric calculations (mandatory for financial data).
- \`FLOAT\` / \`DOUBLE PRECISION\`: Inexact binary floating-point.

### Column Validation Constraints
\`\`\`sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## Why SQL Data Types & CHECK Constraints Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use CHECK (quantity >= 0)

> ⚠️ **Common Mistake**: IEEE 754 floating point numbers cannot precisely represent many fractional decimal numbers (like 0.1), causing cumulative rounding inaccuracies in financial computations.

## Real-World Production Scenario

In production engineering, **SQL Data Types & CHECK Constraints** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of SQL Data Types & CHECK Constraints. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('PostgreSQL Documentation: SQL')?._id,
  });

  const sqlL2_Challenge = await ChallengeModel.create({
    title: `Implement Inventory Table with CHECK Constraints`,
    description: `Write a SQL DDL statement to create a table \`inventory\` with \`sku\` (VARCHAR(30) PRIMARY KEY), \`quantity\` (INT NOT NULL CHECK (quantity >= 0)), and \`unit_cost\` (NUMERIC(8,2) NOT NULL CHECK (unit_cost > 0)).`,
    difficulty: 'EASY',
    language: 'sql',
    starterCode: `-- Write inventory table DDL with CHECK constraints:
`,
    solutionCode: `CREATE TABLE inventory (
    sku VARCHAR(30) PRIMARY KEY,
    quantity INT NOT NULL CHECK (quantity >= 0),
    unit_cost NUMERIC(8, 2) NOT NULL CHECK (unit_cost > 0)
);`,
    hints: ["Use CHECK (quantity >= 0)", "Use CHECK (unit_cost > 0)"],
    skills: [{"skillId": "sql-queries", "weight": 1.0}],
    testCases: [{"input": "CREATE TABLE", "expectedOutput": "CHECK (quantity >= 0)", "description": "Enforces non-negative quantity constraint", "hidden": false}],
  });

  const sqlL2_Practice = await ActivityModel.create({
    lessonId: sqlL2._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Implement Inventory Table with CHECK Constraints`,
    order: 3,
    challengeRef: sqlL2_Challenge._id,
    content: `# Code Practice: Implement Inventory Table with CHECK Constraints\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  sqlL2_Challenge.activityId = sqlL2_Practice._id;
  await sqlL2_Challenge.save();

  const sqlL2_Quiz = await AssessmentModel.create({
    title: `Assessment: SQL Data Types & Integrity`,
    description: `Validate knowledge of numeric precision, constraints, and time types.`,
    passingScore: 70,
    skills: [{"skillId": "relational-modeling", "weight": 1.0}],
    questions: [
    {
        "question": "Why should financial currency amounts never be stored as FLOAT or DOUBLE?",
        "options": [
            "FLOAT columns cannot be indexed in SQL",
            "Binary floating-point types cannot represent base-10 decimals exactly, accumulating catastrophic rounding errors",
            "FLOAT values cannot be updated",
            "SQL standard does not support arithmetic on FLOAT"
        ],
        "explanation": "IEEE 754 floating point numbers cannot precisely represent many fractional decimal numbers (like 0.1), causing cumulative rounding inaccuracies in financial computations.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const sqlL2_Assessment = await ActivityModel.create({
    lessonId: sqlL2._id,
    type: 'QUIZ',
    title: `Assessment: SQL Data Types & Integrity`,
    order: 4,
    assessmentRef: sqlL2_Quiz._id,
  });
  sqlL2_Quiz.activityId = sqlL2_Assessment._id;
  await sqlL2_Quiz.save();

  sqlL2.activities = [
    sqlL2_Video._id,
    sqlL2_Notes._id,
    sqlL2_Practice._id,
    sqlL2_Assessment._id,
  ] as any;
  await sqlL2.save();

  sqlMod1.lessons = [sqlL1._id, sqlL2._id] as any;
  await sqlMod1.save();

  const sqlMod2 = await ModuleModel.create({
    courseId: sqlCourse._id,
    title: `Module 2: Query Fundamentals & Data Manipulation`,
    description: `Master SELECT queries, WHERE filtering, ordering, pagination, and safe INSERT/UPDATE/DELETE mutations.`,
    order: 2,
    lessons: [],
  });

  // --- Lesson 1: SELECT Queries, WHERE Filtering & Ordering ---
  const sqlL3 = await LessonModel.create({
    moduleId: sqlMod2._id,
    courseId: sqlCourse._id,
    title: `SELECT Queries, WHERE Filtering & Ordering`,
    description: `Filter rows with comparison operators, pattern matching, null checks, and multi-column sorting.`,
    order: 1,
    activities: [],
  });

  const sqlL3_Video = await ActivityModel.create({
    lessonId: sqlL3._id,
    type: 'VIDEO',
    title: `Video: SQL SELECT, WHERE Predicates & ORDER BY`,
    order: 1,
    resourceRef: getRes('SQL DML Commands INSERT UPDATE DELETE in Tamil')?._id,
    content: `# Key Takeaways:
- WHERE filters rows before projection and ordering.
- Use IS NULL and IS NOT NULL for three-valued null comparisons.
- Combine conditions using AND, OR, and parentheses for precedence.`,
  });

  const sqlL3_Notes = await ActivityModel.create({
    lessonId: sqlL3._id,
    type: 'NOTES',
    title: `Codexa Notes: SELECT Queries, WHERE Filtering & Ordering`,
    order: 2,
    content: `# SELECT Queries, WHERE Filtering & Ordering

Filter rows with comparison operators, pattern matching, null checks, and multi-column sorting.

The \`SELECT\` statement retrieves rows matching specific criteria from one or more database tables.

---

### Query Anatomy
\`\`\`sql
SELECT column1, column2, price * 1.10 AS price_with_tax
FROM products
WHERE category = 'Electronics'
  AND price BETWEEN 50 AND 500
  AND stock > 0
ORDER BY price DESC, created_at ASC
LIMIT 20 OFFSET 0;
\`\`\`

### Three-Valued Logic & NULLs
In SQL, \`NULL = NULL\` evaluates to \`UNKNOWN\`, not \`TRUE\`.
Always use \`IS NULL\` or \`IS NOT NULL\`:
\`\`\`sql
SELECT id, email FROM users WHERE deleted_at IS NULL;
\`\`\`

## Why SELECT Queries, WHERE Filtering & Ordering Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Filter with WHERE is_active = TRUE AND price >= 99.00

> ⚠️ **Common Mistake**: In SQL three-valued logic, comparisons with NULL using standard equality operators yield UNKNOWN, so no rows match. You must write \`WHERE status IS NULL\`.

## Real-World Production Scenario

In production engineering, **SELECT Queries, WHERE Filtering & Ordering** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of SELECT Queries, WHERE Filtering & Ordering. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('PostgreSQL Documentation: SQL')?._id,
  });

  const sqlL3_Challenge = await ChallengeModel.create({
    title: `Filter Active High-Tier Subscriptions`,
    description: `Write a SQL query to select \`user_id\`, \`plan\`, and \`price\` from \`subscriptions\` where \`is_active = TRUE\` and \`price >= 99.00\`, ordered by \`price\` descending.`,
    difficulty: 'EASY',
    language: 'sql',
    starterCode: `-- Write your SELECT query:
`,
    solutionCode: `SELECT user_id, plan, price
FROM subscriptions
WHERE is_active = TRUE AND price >= 99.00
ORDER BY price DESC;`,
    hints: ["Filter with WHERE is_active = TRUE AND price >= 99.00", "Add ORDER BY price DESC"],
    skills: [{"skillId": "sql-queries", "weight": 1.0}],
    testCases: [{"input": "SELECT", "expectedOutput": "WHERE is_active = TRUE AND price >= 99.00", "description": "Selects active premium subscriptions", "hidden": false}],
  });

  const sqlL3_Practice = await ActivityModel.create({
    lessonId: sqlL3._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Filter Active High-Tier Subscriptions`,
    order: 3,
    challengeRef: sqlL3_Challenge._id,
    content: `# Code Practice: Filter Active High-Tier Subscriptions\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  sqlL3_Challenge.activityId = sqlL3_Practice._id;
  await sqlL3_Challenge.save();

  const sqlL3_Quiz = await AssessmentModel.create({
    title: `Assessment: SELECT & Logical Predicates`,
    description: `Assess query predicates, NULL semantics, and sorting rules.`,
    passingScore: 70,
    skills: [{"skillId": "sql-queries", "weight": 1.0}],
    questions: [
    {
        "question": "What is the result of evaluating `WHERE status = NULL` in SQL?",
        "options": [
            "Returns all rows where status is NULL",
            "Returns zero rows because equality with NULL evaluates to UNKNOWN (treated as false)",
            "Throws a syntax exception",
            "Returns all rows where status is an empty string"
        ],
        "explanation": "In SQL three-valued logic, comparisons with NULL using standard equality operators yield UNKNOWN, so no rows match. You must write `WHERE status IS NULL`.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const sqlL3_Assessment = await ActivityModel.create({
    lessonId: sqlL3._id,
    type: 'QUIZ',
    title: `Assessment: SELECT & Logical Predicates`,
    order: 4,
    assessmentRef: sqlL3_Quiz._id,
  });
  sqlL3_Quiz.activityId = sqlL3_Assessment._id;
  await sqlL3_Quiz.save();

  sqlL3.activities = [
    sqlL3_Video._id,
    sqlL3_Notes._id,
    sqlL3_Practice._id,
    sqlL3_Assessment._id,
  ] as any;
  await sqlL3.save();

  // --- Lesson 2: Safe Data Mutation: INSERT, UPDATE, & DELETE ---
  const sqlL4 = await LessonModel.create({
    moduleId: sqlMod2._id,
    courseId: sqlCourse._id,
    title: `Safe Data Mutation: INSERT, UPDATE, & DELETE`,
    description: `Mutate records safely with parameterized inputs, targeted WHERE clauses, and RETURNING syntax.`,
    order: 2,
    activities: [],
  });

  const sqlL4_Video = await ActivityModel.create({
    lessonId: sqlL4._id,
    type: 'VIDEO',
    title: `Video: Safe Data Mutations in SQL`,
    order: 1,
    resourceRef: getRes('SQL Practice Questions and Filtering in Tamil')?._id,
    content: `# Key Takeaways:
- Always specify a WHERE clause on UPDATE and DELETE statements.
- Use RETURNING to capture generated primary keys and mutated column values.
- Execute bulk inserts with multi-row VALUES lists.`,
  });

  const sqlL4_Notes = await ActivityModel.create({
    lessonId: sqlL4._id,
    type: 'NOTES',
    title: `Codexa Notes: Safe Data Mutation: INSERT, UPDATE, & DELETE`,
    order: 2,
    content: `# Safe Data Mutation: INSERT, UPDATE, & DELETE

Mutate records safely with parameterized inputs, targeted WHERE clauses, and RETURNING syntax.

Modifying database state requires strict safeguards against unintentional table-wide overwrites.

---

### 1. INSERT with RETURNING
\`\`\`sql
INSERT INTO users (username, email, role)
VALUES 
    ('spix', 'spix@codexa.dev', 'admin'),
    ('alex', 'alex@codexa.dev', 'member')
RETURNING id, created_at;
\`\`\`

### 2. Targeted UPDATEs
\`\`\`sql
UPDATE accounts
SET balance = balance + 150.00, updated_at = CURRENT_TIMESTAMP
WHERE id = 42 AND status = 'active';
\`\`\`

### 3. Safe DELETEs
\`\`\`sql
DELETE FROM login_attempts
WHERE attempted_at < CURRENT_TIMESTAMP - INTERVAL '30 days';
\`\`\`

## Why Safe Data Mutation: INSERT, UPDATE, & DELETE Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use SET salary = salary * 1.10

> ⚠️ **Common Mistake**: Without a WHERE clause, UPDATE applies the mutation to every record in the table.

## Real-World Production Scenario

In production engineering, **Safe Data Mutation: INSERT, UPDATE, & DELETE** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Safe Data Mutation: INSERT, UPDATE, & DELETE. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('PostgreSQL Documentation: SQL')?._id,
  });

  const sqlL4_Challenge = await ChallengeModel.create({
    title: `Update Employee Salaries by Department`,
    description: `Write a SQL statement to increase \`salary\` by 10% for all employees in \`department_id = 3\` whose \`is_active = TRUE\`.`,
    difficulty: 'EASY',
    language: 'sql',
    starterCode: `-- Write UPDATE statement:
`,
    solutionCode: `UPDATE employees
SET salary = salary * 1.10
WHERE department_id = 3 AND is_active = TRUE;`,
    hints: ["Use SET salary = salary * 1.10", "Filter by department_id = 3 AND is_active = TRUE"],
    skills: [{"skillId": "sql-queries", "weight": 1.0}],
    testCases: [{"input": "UPDATE", "expectedOutput": "SET salary = salary * 1.10", "description": "Applies targeted salary adjustment", "hidden": false}],
  });

  const sqlL4_Practice = await ActivityModel.create({
    lessonId: sqlL4._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Update Employee Salaries by Department`,
    order: 3,
    challengeRef: sqlL4_Challenge._id,
    content: `# Code Practice: Update Employee Salaries by Department\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  sqlL4_Challenge.activityId = sqlL4_Practice._id;
  await sqlL4_Challenge.save();

  const sqlL4_Quiz = await AssessmentModel.create({
    title: `Assessment: SQL Mutations`,
    description: `Test mutation safety and SQL UPDATE/DELETE behavior.`,
    passingScore: 70,
    skills: [{"skillId": "sql-queries", "weight": 1.0}],
    questions: [
    {
        "question": "What occurs when executing `UPDATE products SET price = 100;` without a WHERE clause?",
        "options": [
            "Only the first record is modified",
            "A syntax error is thrown",
            "Every single product in the entire table has its price set to 100",
            "The database prompts for interactive confirmation"
        ],
        "explanation": "Without a WHERE clause, UPDATE applies the mutation to every record in the table.",
        "correctOption": 2,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const sqlL4_Assessment = await ActivityModel.create({
    lessonId: sqlL4._id,
    type: 'QUIZ',
    title: `Assessment: SQL Mutations`,
    order: 4,
    assessmentRef: sqlL4_Quiz._id,
  });
  sqlL4_Quiz.activityId = sqlL4_Assessment._id;
  await sqlL4_Quiz.save();

  sqlL4.activities = [
    sqlL4_Video._id,
    sqlL4_Notes._id,
    sqlL4_Practice._id,
    sqlL4_Assessment._id,
  ] as any;
  await sqlL4.save();

  sqlMod2.lessons = [sqlL3._id, sqlL4._id] as any;
  await sqlMod2.save();

  const sqlMod3 = await ModuleModel.create({
    courseId: sqlCourse._id,
    title: `Module 3: Multi-Table Joins & Aggregations`,
    description: `Master INNER, LEFT, RIGHT, FULL OUTER joins, and summarize data with GROUP BY and HAVING.`,
    order: 3,
    lessons: [],
  });

  // --- Lesson 1: INNER, LEFT, RIGHT, and FULL OUTER JOINs ---
  const sqlL5 = await LessonModel.create({
    moduleId: sqlMod3._id,
    courseId: sqlCourse._id,
    title: `INNER, LEFT, RIGHT, and FULL OUTER JOINs`,
    description: `Connect relational tables using join predicates and handle null-padded outer joins.`,
    order: 1,
    activities: [],
  });

  const sqlL5_Video = await ActivityModel.create({
    lessonId: sqlL5._id,
    type: 'VIDEO',
    title: `Video: SQL Joins Mastery (Inner, Left, Right, Full)`,
    order: 1,
    resourceRef: getRes('SQL vs NoSQL Architecture Comparison in Tamil')?._id,
    content: `# Key Takeaways:
- INNER JOIN returns rows with matching keys in both tables.
- LEFT JOIN keeps all left rows, filling unmatched right columns with NULL.
- Join predicates in ON clauses control table relationship matching.`,
  });

  const sqlL5_Notes = await ActivityModel.create({
    lessonId: sqlL5._id,
    type: 'NOTES',
    title: `Codexa Notes: INNER, LEFT, RIGHT, and FULL OUTER JOINs`,
    order: 2,
    content: `# INNER, LEFT, RIGHT, and FULL OUTER JOINs

Connect relational tables using join predicates and handle null-padded outer joins.

Joins combine records from two or more tables based on related columns.

---

### Join Types
1. **INNER JOIN**: Only rows where the join condition is met in both tables.
2. **LEFT JOIN (OUTER)**: All rows from the left table, matched rows from the right (or NULL).
3. **RIGHT JOIN (OUTER)**: All rows from the right table, matched rows from the left.
4. **FULL OUTER JOIN**: All rows from both tables, with NULLs where no match exists.

\`\`\`sql
SELECT 
    orders.id AS order_id,
    customers.name AS customer_name,
    orders.total_amount,
    orders.created_at
FROM orders
INNER JOIN customers ON orders.customer_id = customers.id
WHERE orders.status = 'completed';
\`\`\`

## Why INNER, LEFT, RIGHT, and FULL OUTER JOINs Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use LEFT JOIN orders ON customers.id = orders.customer_id

> ⚠️ **Common Mistake**: LEFT JOIN preserves all rows from the left table, returning NULL for right-table columns when no match exists.

## Real-World Production Scenario

In production engineering, **INNER, LEFT, RIGHT, and FULL OUTER JOINs** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of INNER, LEFT, RIGHT, and FULL OUTER JOINs. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('PostgreSQL Documentation: SQL')?._id,
  });

  const sqlL5_Challenge = await ChallengeModel.create({
    title: `Join Customers with Orders Using LEFT JOIN`,
    description: `Write a SQL query to select \`customers.name\` and \`orders.total_amount\` using a \`LEFT JOIN\` between \`customers\` and \`orders\` on \`customers.id = orders.customer_id\`.`,
    difficulty: 'EASY',
    language: 'sql',
    starterCode: `-- Write LEFT JOIN query:
`,
    solutionCode: `SELECT customers.name, orders.total_amount
FROM customers
LEFT JOIN orders ON customers.id = orders.customer_id;`,
    hints: ["Use LEFT JOIN orders ON customers.id = orders.customer_id"],
    skills: [{"skillId": "sql-queries", "weight": 1.0}],
    testCases: [{"input": "LEFT JOIN", "expectedOutput": "LEFT JOIN orders ON customers.id = orders.customer_id", "description": "Joins customers and orders", "hidden": false}],
  });

  const sqlL5_Practice = await ActivityModel.create({
    lessonId: sqlL5._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Join Customers with Orders Using LEFT JOIN`,
    order: 3,
    challengeRef: sqlL5_Challenge._id,
    content: `# Code Practice: Join Customers with Orders Using LEFT JOIN\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  sqlL5_Challenge.activityId = sqlL5_Practice._id;
  await sqlL5_Challenge.save();

  const sqlL5_Quiz = await AssessmentModel.create({
    title: `Assessment: SQL Joins`,
    description: `Validate join selection and Venn semantics.`,
    passingScore: 70,
    skills: [{"skillId": "sql-queries", "weight": 1.0}],
    questions: [
    {
        "question": "Which join type returns all rows from the primary table even if no related rows exist in the joined table?",
        "options": [
            "INNER JOIN",
            "LEFT (OUTER) JOIN",
            "CROSS JOIN",
            "NATURAL JOIN"
        ],
        "explanation": "LEFT JOIN preserves all rows from the left table, returning NULL for right-table columns when no match exists.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const sqlL5_Assessment = await ActivityModel.create({
    lessonId: sqlL5._id,
    type: 'QUIZ',
    title: `Assessment: SQL Joins`,
    order: 4,
    assessmentRef: sqlL5_Quiz._id,
  });
  sqlL5_Quiz.activityId = sqlL5_Assessment._id;
  await sqlL5_Quiz.save();

  sqlL5.activities = [
    sqlL5_Video._id,
    sqlL5_Notes._id,
    sqlL5_Practice._id,
    sqlL5_Assessment._id,
  ] as any;
  await sqlL5.save();

  // --- Lesson 2: GROUP BY, HAVING, and Aggregate Functions ---
  const sqlL6 = await LessonModel.create({
    moduleId: sqlMod3._id,
    courseId: sqlCourse._id,
    title: `GROUP BY, HAVING, and Aggregate Functions`,
    description: `Summarize datasets with COUNT, SUM, AVG, MIN, MAX and filter groups with HAVING.`,
    order: 2,
    activities: [],
  });

  const sqlL6_Video = await ActivityModel.create({
    lessonId: sqlL6._id,
    type: 'VIDEO',
    title: `Video: SQL Aggregations, GROUP BY & HAVING`,
    order: 1,
    resourceRef: getRes('SQL Aggregate Functions COUNT SUM AVG in Tamil')?._id,
    content: `# Key Takeaways:
- Aggregate functions collapse multiple row values into a single summary.
- Any un-aggregated column in the SELECT must appear in GROUP BY.
- WHERE filters rows BEFORE grouping; HAVING filters groups AFTER aggregation.`,
  });

  const sqlL6_Notes = await ActivityModel.create({
    lessonId: sqlL6._id,
    type: 'NOTES',
    title: `Codexa Notes: GROUP BY, HAVING, and Aggregate Functions`,
    order: 2,
    content: `# GROUP BY, HAVING, and Aggregate Functions

Summarize datasets with COUNT, SUM, AVG, MIN, MAX and filter groups with HAVING.

Aggregate functions perform calculations on sets of values and return a single summary value.

---

### Core Aggregate Functions
- \`COUNT(*)\`: Total count of rows.
- \`SUM(col)\`: Total sum of numeric column.
- \`AVG(col)\`: Arithmetic mean.
- \`MIN(col)\` / \`MAX(col)\`: Extremes.

### GROUP BY and HAVING Syntax
\`\`\`sql
SELECT 
    department_id,
    COUNT(*) AS total_employees,
    AVG(salary) AS avg_salary,
    SUM(salary) AS total_payroll
FROM employees
WHERE is_active = TRUE
GROUP BY department_id
HAVING COUNT(*) >= 5 AND AVG(salary) > 75000
ORDER BY avg_salary DESC;
\`\`\`

## Why GROUP BY, HAVING, and Aggregate Functions Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Group by category

> ⚠️ **Common Mistake**: The WHERE clause filters individual rows before aggregation occurs. Filtering based on aggregate values like AVG(price) must be written in the HAVING clause.

## Real-World Production Scenario

In production engineering, **GROUP BY, HAVING, and Aggregate Functions** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of GROUP BY, HAVING, and Aggregate Functions. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('PostgreSQL Documentation: SQL')?._id,
  });

  const sqlL6_Challenge = await ChallengeModel.create({
    title: `Calculate Category Revenue Aggregations`,
    description: `Write a SQL query to select \`category\`, \`COUNT(*) AS item_count\`, and \`SUM(revenue) AS total_revenue\` from \`sales\` grouped by \`category\` having \`SUM(revenue) >= 50000\`.`,
    difficulty: 'EASY',
    language: 'sql',
    starterCode: `-- Write aggregation query:
`,
    solutionCode: `SELECT category, COUNT(*) AS item_count, SUM(revenue) AS total_revenue
FROM sales
GROUP BY category
HAVING SUM(revenue) >= 50000;`,
    hints: ["Group by category", "Filter aggregated sums with HAVING SUM(revenue) >= 50000"],
    skills: [{"skillId": "sql-queries", "weight": 1.0}],
    testCases: [{"input": "GROUP BY", "expectedOutput": "HAVING SUM(revenue) >= 50000", "description": "Aggregates revenue per category", "hidden": false}],
  });

  const sqlL6_Practice = await ActivityModel.create({
    lessonId: sqlL6._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Calculate Category Revenue Aggregations`,
    order: 3,
    challengeRef: sqlL6_Challenge._id,
    content: `# Code Practice: Calculate Category Revenue Aggregations\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  sqlL6_Challenge.activityId = sqlL6_Practice._id;
  await sqlL6_Challenge.save();

  const sqlL6_Quiz = await AssessmentModel.create({
    title: `Assessment: Aggregations & Grouping`,
    description: `Test mastery of aggregate filters and grouping constraints.`,
    passingScore: 70,
    skills: [{"skillId": "sql-queries", "weight": 1.0}],
    questions: [
    {
        "question": "Why does `SELECT category, AVG(price) FROM products WHERE AVG(price) > 50 GROUP BY category` cause a SQL syntax error?",
        "options": [
            "AVG is not a valid SQL function",
            "WHERE cannot filter aggregate results because it runs before grouping; HAVING must be used instead",
            "Category cannot be grouped",
            "Price must be cast to integer"
        ],
        "explanation": "The WHERE clause filters individual rows before aggregation occurs. Filtering based on aggregate values like AVG(price) must be written in the HAVING clause.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const sqlL6_Assessment = await ActivityModel.create({
    lessonId: sqlL6._id,
    type: 'QUIZ',
    title: `Assessment: Aggregations & Grouping`,
    order: 4,
    assessmentRef: sqlL6_Quiz._id,
  });
  sqlL6_Quiz.activityId = sqlL6_Assessment._id;
  await sqlL6_Quiz.save();

  sqlL6.activities = [
    sqlL6_Video._id,
    sqlL6_Notes._id,
    sqlL6_Practice._id,
    sqlL6_Assessment._id,
  ] as any;
  await sqlL6.save();

  sqlMod3.lessons = [sqlL5._id, sqlL6._id] as any;
  await sqlMod3.save();

  const sqlMod4 = await ModuleModel.create({
    courseId: sqlCourse._id,
    title: `Module 4: Window Functions, Indexing & Transactions`,
    description: `Write modular CTEs and Window Functions, create high-performance B-tree indexes, and safeguard ACID transactions.`,
    order: 4,
    lessons: [],
  });

  // --- Lesson 1: Common Table Expressions (CTEs) & Window Functions ---
  const sqlL7 = await LessonModel.create({
    moduleId: sqlMod4._id,
    courseId: sqlCourse._id,
    title: `Common Table Expressions (CTEs) & Window Functions`,
    description: `Structure complex multi-stage queries with WITH and compute rankings using OVER().`,
    order: 1,
    activities: [],
  });

  const sqlL7_Video = await ActivityModel.create({
    lessonId: sqlL7._id,
    type: 'VIDEO',
    title: `Video: Advanced SQL: CTEs and Window Functions`,
    order: 1,
    resourceRef: getRes('SQL GROUP BY HAVING and ORDER BY in Tamil')?._id,
    content: `# Key Takeaways:
- CTEs (WITH) improve readability and modularity over nested subqueries.
- Window functions compute aggregations across partitions without collapsing individual rows.
- Use ROW_NUMBER(), RANK(), and DENSE_RANK() for ranking.`,
  });

  const sqlL7_Notes = await ActivityModel.create({
    lessonId: sqlL7._id,
    type: 'NOTES',
    title: `Codexa Notes: Common Table Expressions (CTEs) & Window Functions`,
    order: 2,
    content: `# Common Table Expressions (CTEs) & Window Functions

Structure complex multi-stage queries with WITH and compute rankings using OVER().

Advanced SQL techniques enable clean modular query architecture and analytical computations.

---

### 1. Common Table Expressions (WITH)
\`\`\`sql
WITH regional_totals AS (
    SELECT region, SUM(amount) AS total_revenue
    FROM sales
    GROUP BY region
),
top_regions AS (
    SELECT region, total_revenue
    FROM regional_totals
    WHERE total_revenue > 100000
)
SELECT * FROM top_regions ORDER BY total_revenue DESC;
\`\`\`

### 2. Window Functions (\`OVER ()\`)
Unlike \`GROUP BY\`, window functions retain the identity of every single row:
\`\`\`sql
SELECT 
    id,
    department_id,
    salary,
    ROW_NUMBER() OVER(PARTITION BY department_id ORDER BY salary DESC) AS dept_rank,
    AVG(salary) OVER(PARTITION BY department_id) AS dept_avg_salary
FROM employees;
\`\`\`

## Why Common Table Expressions (CTEs) & Window Functions Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use DENSE_RANK() OVER(PARTITION BY category ORDER BY price DESC) AS price_rank

> ⚠️ **Common Mistake**: Window functions calculate values across a set of table rows related to the current row without grouping the results into a single output row.

## Real-World Production Scenario

In production engineering, **Common Table Expressions (CTEs) & Window Functions** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Common Table Expressions (CTEs) & Window Functions. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('PostgreSQL Documentation: SQL')?._id,
  });

  const sqlL7_Challenge = await ChallengeModel.create({
    title: `Rank Products within Category`,
    description: `Write a SQL query to select \`name\`, \`category\`, \`price\`, and \`DENSE_RANK() OVER(PARTITION BY category ORDER BY price DESC) AS price_rank\` from \`products\`.`,
    difficulty: 'EASY',
    language: 'sql',
    starterCode: `-- Write window function query:
`,
    solutionCode: `SELECT name, category, price, DENSE_RANK() OVER(PARTITION BY category ORDER BY price DESC) AS price_rank
FROM products;`,
    hints: ["Use DENSE_RANK() OVER(PARTITION BY category ORDER BY price DESC) AS price_rank"],
    skills: [{"skillId": "sql-queries", "weight": 1.0}],
    testCases: [{"input": "DENSE_RANK", "expectedOutput": "DENSE_RANK() OVER(PARTITION BY category ORDER BY price DESC)", "description": "Computes dense rank per category", "hidden": false}],
  });

  const sqlL7_Practice = await ActivityModel.create({
    lessonId: sqlL7._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Rank Products within Category`,
    order: 3,
    challengeRef: sqlL7_Challenge._id,
    content: `# Code Practice: Rank Products within Category\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  sqlL7_Challenge.activityId = sqlL7_Practice._id;
  await sqlL7_Challenge.save();

  const sqlL7_Quiz = await AssessmentModel.create({
    title: `Assessment: CTEs and Window Functions`,
    description: `Test your grasp of partition windows and Common Table Expressions.`,
    passingScore: 70,
    skills: [{"skillId": "sql-queries", "weight": 1.0}],
    questions: [
    {
        "question": "How does a Window Function differ fundamentally from a GROUP BY clause?",
        "options": [
            "Window functions only operate on integer columns",
            "Window functions perform aggregations across row subsets without collapsing the individual rows into a single summary row",
            "Window functions delete duplicate records",
            "Window functions require NoSQL databases"
        ],
        "explanation": "Window functions calculate values across a set of table rows related to the current row without grouping the results into a single output row.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const sqlL7_Assessment = await ActivityModel.create({
    lessonId: sqlL7._id,
    type: 'QUIZ',
    title: `Assessment: CTEs and Window Functions`,
    order: 4,
    assessmentRef: sqlL7_Quiz._id,
  });
  sqlL7_Quiz.activityId = sqlL7_Assessment._id;
  await sqlL7_Quiz.save();

  sqlL7.activities = [
    sqlL7_Video._id,
    sqlL7_Notes._id,
    sqlL7_Practice._id,
    sqlL7_Assessment._id,
  ] as any;
  await sqlL7.save();

  // --- Lesson 2: B-Tree Indexing, Execution Plans & ACID Transactions ---
  const sqlL8 = await LessonModel.create({
    moduleId: sqlMod4._id,
    courseId: sqlCourse._id,
    title: `B-Tree Indexing, Execution Plans & ACID Transactions`,
    description: `Optimize queries using B-Tree composite indexes, analyze query plans with EXPLAIN, and guarantee ACID atomicity.`,
    order: 2,
    activities: [],
  });

  const sqlL8_Video = await ActivityModel.create({
    lessonId: sqlL8._id,
    type: 'VIDEO',
    title: `Video: Database Indexing, EXPLAIN & ACID Transactions`,
    order: 1,
    resourceRef: getRes('MySQL Database Setup and CLI in Tamil')?._id,
    content: `# Key Takeaways:
- B-tree indexes reduce lookup time from O(N) full scans to O(log N) tree traversals.
- EXPLAIN ANALYZE reveals actual disk reads and execution bottlenecks.
- ACID guarantees atomicity (all-or-nothing), consistency, isolation, and durability.`,
  });

  const sqlL8_Notes = await ActivityModel.create({
    lessonId: sqlL8._id,
    type: 'NOTES',
    title: `Codexa Notes: B-Tree Indexing, Execution Plans & ACID Transactions`,
    order: 2,
    content: `# B-Tree Indexing, Execution Plans & ACID Transactions

Optimize queries using B-Tree composite indexes, analyze query plans with EXPLAIN, and guarantee ACID atomicity.

Optimizing high-throughput databases requires understanding physical disk access patterns and transaction guarantees.

---

### 1. B-Tree Indexes
\`\`\`sql
-- Single column index
CREATE INDEX idx_users_email ON users(email);

-- Composite index (Order matters: leftmost prefix matching)
CREATE INDEX idx_orders_customer_status ON orders(customer_id, status);
\`\`\`

### 2. ACID Transaction Guarantees
- **Atomicity**: All operations in a transaction succeed together or are completely rolled back.
- **Consistency**: The database transitions only between valid constraint-compliant states.
- **Isolation**: Concurrent transactions cannot corrupt or read partial state from each other.
- **Durability**: Committed data is safely written to write-ahead logs (WAL) on disk.

\`\`\`sql
BEGIN TRANSACTION;

UPDATE accounts SET balance = balance - 250 WHERE id = 1;
UPDATE accounts SET balance = balance + 250 WHERE id = 2;

COMMIT;
\`\`\`

## Why B-Tree Indexing, Execution Plans & ACID Transactions Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Start with BEGIN TRANSACTION;

> ⚠️ **Common Mistake**: Atomicity ensures an all-or-nothing guarantee: either all statements commit successfully, or the entire transaction aborts and rolls back completely.

## Real-World Production Scenario

In production engineering, **B-Tree Indexing, Execution Plans & ACID Transactions** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of B-Tree Indexing, Execution Plans & ACID Transactions. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('PostgreSQL Documentation: SQL')?._id,
  });

  const sqlL8_Challenge = await ChallengeModel.create({
    title: `Structure Atomic Money Transfer Transaction`,
    description: `Write a SQL script wrapped in \`BEGIN TRANSACTION;\` and \`COMMIT;\` that deducts 500 from \`accounts WHERE id = 10\` and credits 500 to \`accounts WHERE id = 20\`.`,
    difficulty: 'EASY',
    language: 'sql',
    starterCode: `-- Write transaction statements:
`,
    solutionCode: `BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 500 WHERE id = 10;
UPDATE accounts SET balance = balance + 500 WHERE id = 20;
COMMIT;`,
    hints: ["Start with BEGIN TRANSACTION;", "Include both UPDATE statements", "End with COMMIT;"],
    skills: [{"skillId": "acid-transactions", "weight": 1.0}],
    testCases: [{"input": "BEGIN TRANSACTION", "expectedOutput": "COMMIT;", "description": "Executes atomic transaction block", "hidden": false}],
  });

  const sqlL8_Practice = await ActivityModel.create({
    lessonId: sqlL8._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Structure Atomic Money Transfer Transaction`,
    order: 3,
    challengeRef: sqlL8_Challenge._id,
    content: `# Code Practice: Structure Atomic Money Transfer Transaction\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  sqlL8_Challenge.activityId = sqlL8_Practice._id;
  await sqlL8_Challenge.save();

  const sqlL8_Quiz = await AssessmentModel.create({
    title: `Assessment: Indexes & ACID Transactions`,
    description: `Assess indexing strategy and ACID guarantees.`,
    passingScore: 70,
    skills: [{"skillId": "database-indexing", "weight": 1.0}],
    questions: [
    {
        "question": "What is the primary benefit of the 'Atomicity' property in ACID database transactions?",
        "options": [
            "It ensures all queries execute simultaneously",
            "It ensures that if any statement inside a multi-operation transaction fails, all changes are rolled back with zero partial writes",
            "It compresses table storage automatically",
            "It creates automatic B-tree indexes"
        ],
        "explanation": "Atomicity ensures an all-or-nothing guarantee: either all statements commit successfully, or the entire transaction aborts and rolls back completely.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const sqlL8_Assessment = await ActivityModel.create({
    lessonId: sqlL8._id,
    type: 'QUIZ',
    title: `Assessment: Indexes & ACID Transactions`,
    order: 4,
    assessmentRef: sqlL8_Quiz._id,
  });
  sqlL8_Quiz.activityId = sqlL8_Assessment._id;
  await sqlL8_Quiz.save();

  sqlL8.activities = [
    sqlL8_Video._id,
    sqlL8_Notes._id,
    sqlL8_Practice._id,
    sqlL8_Assessment._id,
  ] as any;
  await sqlL8.save();

  sqlMod4.lessons = [sqlL7._id, sqlL8._id] as any;
  await sqlMod4.save();

  sqlCourse.modules = [sqlMod1._id, sqlMod2._id, sqlMod3._id, sqlMod4._id] as any;
  await sqlCourse.save();

  // =========================================================================
  // 2. MONGODB & NOSQL ARCHITECTURE (4 MODULES, 8 LESSONS)
  // =========================================================================
  const mongoCourse = await CourseModel.create({
    slug: 'mongodb-development',
    title: 'MongoDB & NoSQL Architecture',
    description: 'Master document database modeling, JSON/BSON storage mechanics, aggregation pipelines, compound indexes, replica sets, and transactional workflows.',
    domain: 'Database & Data',
    level: 'BEGINNER',
    status: 'PUBLISHED',
    estimatedHours: 35,
    skillsCovered: ['mongodb-queries', 'nosql-modeling', 'aggregation-pipeline', 'database-indexing'],
    prerequisites: ['Basic JavaScript / JSON comprehension'],
    modules: [],
  });

  const mongoMod1 = await ModuleModel.create({
    courseId: mongoCourse._id,
    title: `Module 1: Document Database Foundations & Architecture`,
    description: `Document vs relational data models, BSON serialization, ObjectId structure, and database connections.`,
    order: 1,
    lessons: [],
  });

  // --- Lesson 1: Document vs Relational Modeling & BSON Mechanics ---
  const mongoL1 = await LessonModel.create({
    moduleId: mongoMod1._id,
    courseId: mongoCourse._id,
    title: `Document vs Relational Modeling & BSON Mechanics`,
    description: `Understand semi-structured JSON/BSON documents, 16MB document limits, and ObjectId generation.`,
    order: 1,
    activities: [],
  });

  const mongoL1_Video = await ActivityModel.create({
    lessonId: mongoL1._id,
    type: 'VIDEO',
    title: `Video: MongoDB Architecture & BSON Mechanics`,
    order: 1,
    resourceRef: getRes('MongoDB Complete Tutorial in Tamil')?._id,
    content: `# Key Takeaways:
- MongoDB stores documents as BSON (Binary JSON) supporting rich data types.
- Documents are grouped into collections, eliminating rigid schema migrations.
- Every document is uniquely identified by a 12-byte ObjectId.`,
  });

  const mongoL1_Notes = await ActivityModel.create({
    lessonId: mongoL1._id,
    type: 'NOTES',
    title: `Codexa Notes: Document vs Relational Modeling & BSON Mechanics`,
    order: 2,
    content: `# Document vs Relational Modeling & BSON Mechanics

Understand semi-structured JSON/BSON documents, 16MB document limits, and ObjectId generation.

MongoDB is a document-oriented database designed for high availability, horizontal scalability, and developer productivity.

---

### JSON vs BSON
- **JSON**: Text-based, limited types (string, number, boolean, array, object, null).
- **BSON (Binary JSON)**: Binary serialization format extending JSON with \`ObjectId\`, \`Date\`, \`BinData\`, \`Decimal128\`, \`Int32\`, \`Int64\`.
- **Document Size Limit**: Maximum 16 MB per document.

### Document Example
\`\`\`json
{
  "_id": ObjectId("651a2b3c4d5e6f7a8b9c0d1e"),
  "username": "spix",
  "email": "spix@codexa.dev",
  "skills": ["mongodb", "nodejs", "typescript"],
  "profile": {
    "bio": "Full-Stack Engineer",
    "reputation": 4500
  },
  "createdAt": ISODate("2024-01-15T00:00:00Z")
}
\`\`\`

## Why Document vs Relational Modeling & BSON Mechanics Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Return object with username, email, skills

> ⚠️ **Common Mistake**: MongoDB limits individual BSON documents to 16 MB to prevent excessive memory consumption during in-RAM processing.

## Real-World Production Scenario

In production engineering, **Document vs Relational Modeling & BSON Mechanics** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Document vs Relational Modeling & BSON Mechanics. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MongoDB Manual: Document Model')?._id,
  });

  const mongoL1_Challenge = await ChallengeModel.create({
    title: `Structure a Polymorphic User Document`,
    description: `Write a JavaScript function \`createUserDocument(username, email, skills)\` that returns a MongoDB document object containing \`username\`, \`email\`, \`skills\` (array), and an embedded \`metadata\` object with \`isActive: true\` and \`createdAt\` date.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function createUserDocument(username, email, skills) {
  // Return document object
}
`,
    solutionCode: `function createUserDocument(username, email, skills) {
  return {
    username,
    email,
    skills: Array.isArray(skills) ? skills : [],
    metadata: {
      isActive: true,
      createdAt: new Date()
    }
  };
}`,
    hints: ["Return object with username, email, skills", "Embed metadata: { isActive: true, createdAt: new Date() }"],
    skills: [{"skillId": "nosql-modeling", "weight": 1.0}],
    testCases: [{"input": "createUserDocument('spix', 'spix@codexa.dev', ['nosql'])", "expectedOutput": "true", "description": "Returns structured BSON document", "hidden": false}],
  });

  const mongoL1_Practice = await ActivityModel.create({
    lessonId: mongoL1._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Structure a Polymorphic User Document`,
    order: 3,
    challengeRef: mongoL1_Challenge._id,
    content: `# Code Practice: Structure a Polymorphic User Document\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  mongoL1_Challenge.activityId = mongoL1_Practice._id;
  await mongoL1_Challenge.save();

  const mongoL1_Quiz = await AssessmentModel.create({
    title: `Assessment: Document Foundations & BSON`,
    description: `Test understanding of BSON types, document size limits, and ObjectIds.`,
    passingScore: 70,
    skills: [{"skillId": "nosql-modeling", "weight": 1.0}],
    questions: [
    {
        "question": "What is the maximum single document size limit in MongoDB?",
        "options": [
            "1 MB",
            "16 MB",
            "64 MB",
            "Unlimited"
        ],
        "explanation": "MongoDB limits individual BSON documents to 16 MB to prevent excessive memory consumption during in-RAM processing.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const mongoL1_Assessment = await ActivityModel.create({
    lessonId: mongoL1._id,
    type: 'QUIZ',
    title: `Assessment: Document Foundations & BSON`,
    order: 4,
    assessmentRef: mongoL1_Quiz._id,
  });
  mongoL1_Quiz.activityId = mongoL1_Assessment._id;
  await mongoL1_Quiz.save();

  mongoL1.activities = [
    mongoL1_Video._id,
    mongoL1_Notes._id,
    mongoL1_Practice._id,
    mongoL1_Assessment._id,
  ] as any;
  await mongoL1.save();

  // --- Lesson 2: MongoDB Architecture & Collection Management ---
  const mongoL2 = await LessonModel.create({
    moduleId: mongoMod1._id,
    courseId: mongoCourse._id,
    title: `MongoDB Architecture & Collection Management`,
    description: `Explore the mongod process, MongoDB Compass, connection URIs, and schema validators.`,
    order: 2,
    activities: [],
  });

  const mongoL2_Video = await ActivityModel.create({
    lessonId: mongoL2._id,
    type: 'VIDEO',
    title: `Video: MongoDB Architecture, Connections & Collections`,
    order: 1,
    resourceRef: getRes('MongoDB Complete Tutorial in Tamil')?._id,
    content: `# Key Takeaways:
- The mongod daemon manages data storage, cache memory, and I/O.
- Connection URIs configure clusters, authentication, and replica set preferences.
- JSON schema validators enforce document structural rules at the collection level.`,
  });

  const mongoL2_Notes = await ActivityModel.create({
    lessonId: mongoL2._id,
    type: 'NOTES',
    title: `Codexa Notes: MongoDB Architecture & Collection Management`,
    order: 2,
    content: `# MongoDB Architecture & Collection Management

Explore the mongod process, MongoDB Compass, connection URIs, and schema validators.

Understanding how MongoDB manages data in memory and on disk is critical for architecture design.

---

### Core Architecture Components
1. **mongod**: Primary storage and query engine daemon process.
2. **Database**: Logical namespace containing collections.
3. **Collection**: Schema-flexible container of documents.

### Connection URI Syntax
\`\`\`text
mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/codexa_db?retryWrites=true&w=majority
\`\`\`

### Collection Schema Validation
\`\`\`javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "username"],
      properties: {
        email: { bsonType: "string" },
        username: { bsonType: "string" }
      }
    }
  }
});
\`\`\`

## Why MongoDB Architecture & Collection Management Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Extract the path segment before query parameters

> ⚠️ **Common Mistake**: mongod is the core storage and query execution daemon in MongoDB deployments.

## Real-World Production Scenario

In production engineering, **MongoDB Architecture & Collection Management** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of MongoDB Architecture & Collection Management. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MongoDB Manual: Document Model')?._id,
  });

  const mongoL2_Challenge = await ChallengeModel.create({
    title: `Extract Database Name from MongoDB URI`,
    description: `Write a JavaScript function \`extractDbName(uri)\` that parses and returns the database name from a standard MongoDB URI like \`mongodb://localhost:27017/my_app_db?retryWrites=true\`.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function extractDbName(uri) {
  // Extract and return database name
}
`,
    solutionCode: `function extractDbName(uri) {
  const match = uri.match(/\\/([^/?]+)(\\?|$)/);
  return match ? match[1] : null;
}`,
    hints: ["Extract the path segment before query parameters", "Use regex or URL parsing"],
    skills: [{"skillId": "mongodb-queries", "weight": 1.0}],
    testCases: [{"input": "extractDbName('mongodb://localhost:27017/codexa_db?w=1')", "expectedOutput": "codexa_db", "description": "Extracts database name correctly", "hidden": false}],
  });

  const mongoL2_Practice = await ActivityModel.create({
    lessonId: mongoL2._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Extract Database Name from MongoDB URI`,
    order: 3,
    challengeRef: mongoL2_Challenge._id,
    content: `# Code Practice: Extract Database Name from MongoDB URI\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  mongoL2_Challenge.activityId = mongoL2_Practice._id;
  await mongoL2_Challenge.save();

  const mongoL2_Quiz = await AssessmentModel.create({
    title: `Assessment: MongoDB Architecture`,
    description: `Assess collection structures and mongod daemon concepts.`,
    passingScore: 70,
    skills: [{"skillId": "nosql-modeling", "weight": 1.0}],
    questions: [
    {
        "question": "Which process serves as the primary query and storage engine in MongoDB?",
        "options": [
            "mongos",
            "mongod",
            "mongo-router",
            "compass"
        ],
        "explanation": "mongod is the core storage and query execution daemon in MongoDB deployments.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const mongoL2_Assessment = await ActivityModel.create({
    lessonId: mongoL2._id,
    type: 'QUIZ',
    title: `Assessment: MongoDB Architecture`,
    order: 4,
    assessmentRef: mongoL2_Quiz._id,
  });
  mongoL2_Quiz.activityId = mongoL2_Assessment._id;
  await mongoL2_Quiz.save();

  mongoL2.activities = [
    mongoL2_Video._id,
    mongoL2_Notes._id,
    mongoL2_Practice._id,
    mongoL2_Assessment._id,
  ] as any;
  await mongoL2.save();

  mongoMod1.lessons = [mongoL1._id, mongoL2._id] as any;
  await mongoMod1.save();

  const mongoMod2 = await ModuleModel.create({
    courseId: mongoCourse._id,
    title: `Module 2: CRUD Operations & Query Operators`,
    description: `Master document insertion, query selectors ($gt, $in, $elemMatch), and atomic update modifiers.`,
    order: 2,
    lessons: [],
  });

  // --- Lesson 1: Query Filters, Comparison & Array Selectors ---
  const mongoL3 = await LessonModel.create({
    moduleId: mongoMod2._id,
    courseId: mongoCourse._id,
    title: `Query Filters, Comparison & Array Selectors`,
    description: `Filter collections using $eq, $gte, $in, $elemMatch, and field projection objects.`,
    order: 1,
    activities: [],
  });

  const mongoL3_Video = await ActivityModel.create({
    lessonId: mongoL3._id,
    type: 'VIDEO',
    title: `Video: MongoDB Query Operators & Array Filters`,
    order: 1,
    resourceRef: getRes('MongoDB Queries on Embedded Documents in Tamil')?._id,
    content: `# Key Takeaways:
- Use comparison selectors ($gt, $lte, $in) inside query filter objects.
- $elemMatch queries arrays containing embedded documents.
- Projections specify exactly which fields to return from the database.`,
  });

  const mongoL3_Notes = await ActivityModel.create({
    lessonId: mongoL3._id,
    type: 'NOTES',
    title: `Codexa Notes: Query Filters, Comparison & Array Selectors`,
    order: 2,
    content: `# Query Filters, Comparison & Array Selectors

Filter collections using $eq, $gte, $in, $elemMatch, and field projection objects.

Querying documents efficiently requires combining comparison, logical, and array selectors.

---

### Comparison & Logical Operators
\`\`\`javascript
// Find active electronics priced between $50 and $500
db.products.find(
  {
    category: "electronics",
    price: { $gte: 50, $lte: 500 },
    inStock: true
  },
  { title: 1, price: 1, category: 1, _id: 0 } // Projection
).sort({ price: -1 }).limit(10);
\`\`\`

### Array Queries & \`$elemMatch\`
\`\`\`javascript
// Query courses with a specific tag and high rating
db.courses.find({
  tags: { $in: ["javascript", "typescript"] },
  reviews: { $elemMatch: { rating: { $gte: 4.8 } } }
});
\`\`\`

## Why Query Filters, Comparison & Array Selectors Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use price: { $gte: minPrice, $lte: maxPrice }

> ⚠️ **Common Mistake**: $elemMatch matches documents that contain an array field with at least one element satisfying all specified filter criteria simultaneously.

## Real-World Production Scenario

In production engineering, **Query Filters, Comparison & Array Selectors** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Query Filters, Comparison & Array Selectors. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MongoDB Manual: Document Model')?._id,
  });

  const mongoL3_Challenge = await ChallengeModel.create({
    title: `Build a Price Range Query Object`,
    description: `Write a JavaScript function \`buildPriceRangeQuery(category, minPrice, maxPrice)\` that returns a MongoDB query filter object matching \`category\` and \`price: { $gte: minPrice, $lte: maxPrice }\`.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function buildPriceRangeQuery(category, minPrice, maxPrice) {
  // Return query filter
}
`,
    solutionCode: `function buildPriceRangeQuery(category, minPrice, maxPrice) {
  return {
    category,
    price: { $gte: minPrice, $lte: maxPrice }
  };
}`,
    hints: ["Use price: { $gte: minPrice, $lte: maxPrice }"],
    skills: [{"skillId": "mongodb-queries", "weight": 1.0}],
    testCases: [{"input": "buildPriceRangeQuery('tech', 20, 100)", "expectedOutput": "true", "description": "Constructs valid filter object", "hidden": false}],
  });

  const mongoL3_Practice = await ActivityModel.create({
    lessonId: mongoL3._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Build a Price Range Query Object`,
    order: 3,
    challengeRef: mongoL3_Challenge._id,
    content: `# Code Practice: Build a Price Range Query Object\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  mongoL3_Challenge.activityId = mongoL3_Practice._id;
  await mongoL3_Challenge.save();

  const mongoL3_Quiz = await AssessmentModel.create({
    title: `Assessment: Query Selectors`,
    description: `Test array filtering and projection mechanics.`,
    passingScore: 70,
    skills: [{"skillId": "mongodb-queries", "weight": 1.0}],
    questions: [
    {
        "question": "Which operator is required when matching documents containing an array of objects where a single object element must meet multiple criteria?",
        "options": [
            "$all",
            "$elemMatch",
            "$slice",
            "$size"
        ],
        "explanation": "$elemMatch matches documents that contain an array field with at least one element satisfying all specified filter criteria simultaneously.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const mongoL3_Assessment = await ActivityModel.create({
    lessonId: mongoL3._id,
    type: 'QUIZ',
    title: `Assessment: Query Selectors`,
    order: 4,
    assessmentRef: mongoL3_Quiz._id,
  });
  mongoL3_Quiz.activityId = mongoL3_Assessment._id;
  await mongoL3_Quiz.save();

  mongoL3.activities = [
    mongoL3_Video._id,
    mongoL3_Notes._id,
    mongoL3_Practice._id,
    mongoL3_Assessment._id,
  ] as any;
  await mongoL3.save();

  // --- Lesson 2: Atomic Updates ($set, $inc, $push, $addToSet) & Deletes ---
  const mongoL4 = await LessonModel.create({
    moduleId: mongoMod2._id,
    courseId: mongoCourse._id,
    title: `Atomic Updates ($set, $inc, $push, $addToSet) & Deletes`,
    description: `Safely mutate documents with atomic operators and avoid full-document overwrite bugs.`,
    order: 2,
    activities: [],
  });

  const mongoL4_Video = await ActivityModel.create({
    lessonId: mongoL4._id,
    type: 'VIDEO',
    title: `Video: Atomic Document Updates & Modifiers`,
    order: 1,
    resourceRef: getRes('MongoDB Queries on Embedded Documents in Tamil')?._id,
    content: `# Key Takeaways:
- Never overwrite entire documents; use update modifiers like $set and $inc.
- $addToSet appends to arrays only if the element is not already present.
- Atomic operators guarantee thread-safe mutations without race conditions.`,
  });

  const mongoL4_Notes = await ActivityModel.create({
    lessonId: mongoL4._id,
    type: 'NOTES',
    title: `Codexa Notes: Atomic Updates ($set, $inc, $push, $addToSet) & Deletes`,
    order: 2,
    content: `# Atomic Updates ($set, $inc, $push, $addToSet) & Deletes

Safely mutate documents with atomic operators and avoid full-document overwrite bugs.

MongoDB executes atomic updates at the single-document level without requiring heavy locks.

---

### Core Update Modifiers
- \`$set\`: Assigns new values to specified fields.
- \`$inc\`: Increments/decrements numeric fields atomically.
- \`$unset\`: Deletes a field from the document.
- \`$currentDate\`: Sets field to current timestamp.

### Array Modifiers
- \`$push\`: Appends an item to an array.
- \`$addToSet\`: Adds item only if it does not already exist.
- \`$pull\`: Removes matching items from array.

\`\`\`javascript
db.users.updateOne(
  { _id: ObjectId("651a2b3c4d5e6f7a8b9c0d1e") },
  {
    $inc: { loginCount: 1 },
    $addToSet: { badges: "early_adopter" },
    $set: { lastLoginAt: new Date() }
  }
);
\`\`\`

## Why Atomic Updates ($set, $inc, $push, $addToSet) & Deletes Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use $inc for karma

> ⚠️ **Common Mistake**: $addToSet treats array values as a unique set, adding elements only if they are not already present in the array.

## Real-World Production Scenario

In production engineering, **Atomic Updates ($set, $inc, $push, $addToSet) & Deletes** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Atomic Updates ($set, $inc, $push, $addToSet) & Deletes. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MongoDB Manual: Document Model')?._id,
  });

  const mongoL4_Challenge = await ChallengeModel.create({
    title: `Construct Atomic Counter & Skill Modifier`,
    description: `Write a JavaScript function \`buildProfileUpdate(newSkill, karmaIncrement)\` that returns an update document using \`$inc: { karma: karmaIncrement }\` and \`$addToSet: { skills: newSkill }\`.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function buildProfileUpdate(newSkill, karmaIncrement) {
  // Return update object
}
`,
    solutionCode: `function buildProfileUpdate(newSkill, karmaIncrement) {
  return {
    $inc: { karma: karmaIncrement },
    $addToSet: { skills: newSkill }
  };
}`,
    hints: ["Use $inc for karma", "Use $addToSet for skills"],
    skills: [{"skillId": "mongodb-queries", "weight": 1.0}],
    testCases: [{"input": "buildProfileUpdate('graphql', 10)", "expectedOutput": "true", "description": "Constructs atomic update modifier", "hidden": false}],
  });

  const mongoL4_Practice = await ActivityModel.create({
    lessonId: mongoL4._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Construct Atomic Counter & Skill Modifier`,
    order: 3,
    challengeRef: mongoL4_Challenge._id,
    content: `# Code Practice: Construct Atomic Counter & Skill Modifier\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  mongoL4_Challenge.activityId = mongoL4_Practice._id;
  await mongoL4_Challenge.save();

  const mongoL4_Quiz = await AssessmentModel.create({
    title: `Assessment: Update Modifiers`,
    description: `Assess atomic operators and array mutation semantics.`,
    passingScore: 70,
    skills: [{"skillId": "mongodb-queries", "weight": 1.0}],
    questions: [
    {
        "question": "What is the key advantage of $addToSet over $push when updating arrays?",
        "options": [
            "$addToSet works faster because it ignores sorting",
            "$addToSet prevents duplicate elements by ensuring the value is only added if it does not already exist",
            "$addToSet can only be used with numbers",
            "$push requires an index on the array"
        ],
        "explanation": "$addToSet treats array values as a unique set, adding elements only if they are not already present in the array.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const mongoL4_Assessment = await ActivityModel.create({
    lessonId: mongoL4._id,
    type: 'QUIZ',
    title: `Assessment: Update Modifiers`,
    order: 4,
    assessmentRef: mongoL4_Quiz._id,
  });
  mongoL4_Quiz.activityId = mongoL4_Assessment._id;
  await mongoL4_Quiz.save();

  mongoL4.activities = [
    mongoL4_Video._id,
    mongoL4_Notes._id,
    mongoL4_Practice._id,
    mongoL4_Assessment._id,
  ] as any;
  await mongoL4.save();

  mongoMod2.lessons = [mongoL3._id, mongoL4._id] as any;
  await mongoMod2.save();

  const mongoMod3 = await ModuleModel.create({
    courseId: mongoCourse._id,
    title: `Module 3: Aggregation Framework & Indexing Strategies`,
    description: `Master multi-stage pipelines ($match, $group, $project, $lookup), compound indexes, and query execution plans.`,
    order: 3,
    lessons: [],
  });

  // --- Lesson 1: The Aggregation Pipeline: $match, $group, & $project ---
  const mongoL5 = await LessonModel.create({
    moduleId: mongoMod3._id,
    courseId: mongoCourse._id,
    title: `The Aggregation Pipeline: $match, $group, & $project`,
    description: `Transform and aggregate data using pipeline stages, accumulators, and reshaped documents.`,
    order: 1,
    activities: [],
  });

  const mongoL5_Video = await ActivityModel.create({
    lessonId: mongoL5._id,
    type: 'VIDEO',
    title: `Video: MongoDB Aggregation Pipeline Mastery`,
    order: 1,
    resourceRef: getRes('MongoDB Array Queries and Operators in Tamil')?._id,
    content: `# Key Takeaways:
- Aggregation pipelines process documents through sequential transformative stages.
- Place $match stages early to filter data and leverage indexes.
- Use $group with accumulator expressions ($sum, $avg, $push) for summaries.`,
  });

  const mongoL5_Notes = await ActivityModel.create({
    lessonId: mongoL5._id,
    type: 'NOTES',
    title: `Codexa Notes: The Aggregation Pipeline: $match, $group, & $project`,
    order: 2,
    content: `# The Aggregation Pipeline: $match, $group, & $project

Transform and aggregate data using pipeline stages, accumulators, and reshaped documents.

The Aggregation Pipeline is a powerful data processing framework modeled after Unix data pipes.

---

### Pipeline Architecture
\`\`\`text
Documents ──► $match ──► $unwind ──► $group ──► $sort ──► $project ──► Output
\`\`\`

### Practical Pipeline Example
\`\`\`javascript
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.category",
      totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      itemCount: { $sum: "$items.quantity" }
    }
  },
  { $sort: { totalRevenue: -1 } },
  {
    $project: {
      category: "$_id",
      totalRevenue: { $round: ["$totalRevenue", 2] },
      itemCount: 1,
      _id: 0
    }
  }
]);
\`\`\`

## Why The Aggregation Pipeline: $match, $group, & $project Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Stage 1: { $match: { active: true } }

> ⚠️ **Common Mistake**: Placing $match early allows MongoDB to utilize indexes and filter out unnecessary documents, minimizing memory usage and processing overhead in downstream stages.

## Real-World Production Scenario

In production engineering, **The Aggregation Pipeline: $match, $group, & $project** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of The Aggregation Pipeline: $match, $group, & $project. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MongoDB Manual: Document Model')?._id,
  });

  const mongoL5_Challenge = await ChallengeModel.create({
    title: `Assemble Aggregation Pipeline for Role Statistics`,
    description: `Write a JavaScript function \`buildRoleStatsPipeline()\` that returns a 2-stage aggregation pipeline matching \`{ active: true }\` and grouping by \`$role\` with \`userCount: { $sum: 1 }\`.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function buildRoleStatsPipeline() {
  // Return pipeline array
}
`,
    solutionCode: `function buildRoleStatsPipeline() {
  return [
    { $match: { active: true } },
    { $group: { _id: '$role', userCount: { $sum: 1 } } }
  ];
}`,
    hints: ["Stage 1: { $match: { active: true } }", "Stage 2: { $group: { _id: '$role', userCount: { $sum: 1 } } }"],
    skills: [{"skillId": "aggregation-pipeline", "weight": 1.0}],
    testCases: [{"input": "buildRoleStatsPipeline()", "expectedOutput": "true", "description": "Returns valid aggregation pipeline stages", "hidden": false}],
  });

  const mongoL5_Practice = await ActivityModel.create({
    lessonId: mongoL5._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Assemble Aggregation Pipeline for Role Statistics`,
    order: 3,
    challengeRef: mongoL5_Challenge._id,
    content: `# Code Practice: Assemble Aggregation Pipeline for Role Statistics\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  mongoL5_Challenge.activityId = mongoL5_Practice._id;
  await mongoL5_Challenge.save();

  const mongoL5_Quiz = await AssessmentModel.create({
    title: `Assessment: Aggregation Framework`,
    description: `Validate aggregation pipeline stages and accumulator expressions.`,
    passingScore: 70,
    skills: [{"skillId": "aggregation-pipeline", "weight": 1.0}],
    questions: [
    {
        "question": "Why should $match stages be placed as early as possible in a MongoDB aggregation pipeline?",
        "options": [
            "To allow MongoDB to utilize indexes and reduce the number of documents passed to later stages",
            "Because $match cannot be used anywhere else in a pipeline",
            "To format string outputs",
            "To enforce schema validations"
        ],
        "explanation": "Placing $match early allows MongoDB to utilize indexes and filter out unnecessary documents, minimizing memory usage and processing overhead in downstream stages.",
        "correctOption": 0,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const mongoL5_Assessment = await ActivityModel.create({
    lessonId: mongoL5._id,
    type: 'QUIZ',
    title: `Assessment: Aggregation Framework`,
    order: 4,
    assessmentRef: mongoL5_Quiz._id,
  });
  mongoL5_Quiz.activityId = mongoL5_Assessment._id;
  await mongoL5_Quiz.save();

  mongoL5.activities = [
    mongoL5_Video._id,
    mongoL5_Notes._id,
    mongoL5_Practice._id,
    mongoL5_Assessment._id,
  ] as any;
  await mongoL5.save();

  // --- Lesson 2: Compound Indexes, ESR Rule & Execution Plans ---
  const mongoL6 = await LessonModel.create({
    moduleId: mongoMod3._id,
    courseId: mongoCourse._id,
    title: `Compound Indexes, ESR Rule & Execution Plans`,
    description: `Design compound indexes using the Equality-Sort-Range rule and diagnose query performance with explain().`,
    order: 2,
    activities: [],
  });

  const mongoL6_Video = await ActivityModel.create({
    lessonId: mongoL6._id,
    type: 'VIDEO',
    title: `Video: MongoDB Indexing Strategies & ESR Rule`,
    order: 1,
    resourceRef: getRes('MongoDB Full Course for Beginners')?._id,
    content: `# Key Takeaways:
- Indexes replace O(N) collection scans with O(log N) B-Tree lookups.
- Follow the ESR (Equality, Sort, Range) rule when designing compound index keys.
- Use explain('executionStats') to compare totalDocsExamined vs nReturned.`,
  });

  const mongoL6_Notes = await ActivityModel.create({
    lessonId: mongoL6._id,
    type: 'NOTES',
    title: `Codexa Notes: Compound Indexes, ESR Rule & Execution Plans`,
    order: 2,
    content: `# Compound Indexes, ESR Rule & Execution Plans

Design compound indexes using the Equality-Sort-Range rule and diagnose query performance with explain().

Indexes optimize query response times by creating sorted tree structures in memory.

---

### The ESR Rule (Equality, Sort, Range)
When structuring compound indexes for queries combining equalities, sorting, and range filters, order index fields:
1. **E**quality: Fields with exact equality matches (e.g. \`status: "active"\`).
2. **S**ort: Fields defining ordering (e.g. \`sort({ createdAt: -1 })\`).
3. **R**ange: Fields with range filters (e.g. \`price: { $gte: 100 }\`).

\`\`\`javascript
// Optimized index following ESR:
db.orders.createIndex({ status: 1, createdAt: -1, price: 1 });
\`\`\`

### Execution Stats Analysis
\`\`\`javascript
db.orders.find({ status: "active", price: { $gt: 50 } })
  .sort({ createdAt: -1 })
  .explain("executionStats");
\`\`\`
- \`IXSCAN\`: Index scan (efficient).
- \`COLLSCAN\`: Full collection scan (bottleneck).
- **Target**: \`totalDocsExamined\` ≈ \`nReturned\`.

## Why Compound Indexes, ESR Rule & Execution Plans Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Equality: storeId: 1

> ⚠️ **Common Mistake**: COLLSCAN represents a collection scan, meaning MongoDB inspected every document in the collection because no index was available to satisfy the query.

## Real-World Production Scenario

In production engineering, **Compound Indexes, ESR Rule & Execution Plans** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Compound Indexes, ESR Rule & Execution Plans. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MongoDB Manual: Document Model')?._id,
  });

  const mongoL6_Challenge = await ChallengeModel.create({
    title: `Generate ESR-Compliant Index Specification`,
    description: `Write a JavaScript function \`createESRIndex()\` that returns an index object for a query filtering \`storeId\` (Equality), sorting by \`timestamp\` descending (Sort), and filtering \`total\` (Range).`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function createESRIndex() {
  // Return ESR index object
}
`,
    solutionCode: `function createESRIndex() {
  return { storeId: 1, timestamp: -1, total: 1 };
}`,
    hints: ["Equality: storeId: 1", "Sort: timestamp: -1", "Range: total: 1"],
    skills: [{"skillId": "database-indexing", "weight": 1.0}],
    testCases: [{"input": "createESRIndex()", "expectedOutput": "true", "description": "Returns ESR index spec", "hidden": false}],
  });

  const mongoL6_Practice = await ActivityModel.create({
    lessonId: mongoL6._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Generate ESR-Compliant Index Specification`,
    order: 3,
    challengeRef: mongoL6_Challenge._id,
    content: `# Code Practice: Generate ESR-Compliant Index Specification\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  mongoL6_Challenge.activityId = mongoL6_Practice._id;
  await mongoL6_Challenge.save();

  const mongoL6_Quiz = await AssessmentModel.create({
    title: `Assessment: Indexing & Execution Plans`,
    description: `Test your mastery of compound indexes and execution stats.`,
    passingScore: 70,
    skills: [{"skillId": "database-indexing", "weight": 1.0}],
    questions: [
    {
        "question": "In a MongoDB explain('executionStats') report, what does a stage of 'COLLSCAN' indicate?",
        "options": [
            "A high-speed compound index was utilized",
            "The database scanned every single document in the collection sequentially due to the lack of a suitable index",
            "The query result was cached in memory",
            "The collection was successfully compressed"
        ],
        "explanation": "COLLSCAN represents a collection scan, meaning MongoDB inspected every document in the collection because no index was available to satisfy the query.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const mongoL6_Assessment = await ActivityModel.create({
    lessonId: mongoL6._id,
    type: 'QUIZ',
    title: `Assessment: Indexing & Execution Plans`,
    order: 4,
    assessmentRef: mongoL6_Quiz._id,
  });
  mongoL6_Quiz.activityId = mongoL6_Assessment._id;
  await mongoL6_Quiz.save();

  mongoL6.activities = [
    mongoL6_Video._id,
    mongoL6_Notes._id,
    mongoL6_Practice._id,
    mongoL6_Assessment._id,
  ] as any;
  await mongoL6.save();

  mongoMod3.lessons = [mongoL5._id, mongoL6._id] as any;
  await mongoMod3.save();

  const mongoMod4 = await ModuleModel.create({
    courseId: mongoCourse._id,
    title: `Module 4: Schema Design Patterns & Replica Sets`,
    description: `Master Embedding vs Referencing, bucket and subset patterns, replica set high availability, and multi-document transactions.`,
    order: 4,
    lessons: [],
  });

  // --- Lesson 1: Embedding vs Referencing & Production Schema Patterns ---
  const mongoL7 = await LessonModel.create({
    moduleId: mongoMod4._id,
    courseId: mongoCourse._id,
    title: `Embedding vs Referencing & Production Schema Patterns`,
    description: `Decide between embedded sub-documents and referencing, applying subset and bucket design patterns.`,
    order: 1,
    activities: [],
  });

  const mongoL7_Video = await ActivityModel.create({
    lessonId: mongoL7._id,
    type: 'VIDEO',
    title: `Video: MongoDB Schema Design Patterns & Best Practices`,
    order: 1,
    resourceRef: getRes('MongoDB Queries on Embedded Documents in Tamil')?._id,
    content: `# Key Takeaways:
- Embed data accessed together with 1-to-few relationships (< 100 items).
- Reference data with 1-to-many unbounded relationships to avoid the 16MB document limit.
- Use the Subset Pattern to embed recent activity while referencing historical logs.`,
  });

  const mongoL7_Notes = await ActivityModel.create({
    lessonId: mongoL7._id,
    type: 'NOTES',
    title: `Codexa Notes: Embedding vs Referencing & Production Schema Patterns`,
    order: 2,
    content: `# Embedding vs Referencing & Production Schema Patterns

Decide between embedded sub-documents and referencing, applying subset and bucket design patterns.

In NoSQL document design, schema structure is driven by application query access patterns.

---

### Embedding vs Referencing Rules
1. **Embed (1-to-Few)**: When child data is always queried with parent, has bounded size (< 100 items), and benefits from atomic updates.
2. **Reference (1-to-Many / 1-to-Squillions)**: When items grow without bound, are queried independently, or risk hitting 16MB.

### Production Patterns
- **Subset Pattern**: Store the top 5 most recent comments inside the post document; offload the rest to a \`comments\` collection.
- **Extended Reference Pattern**: Embed frequently accessed parent fields (e.g. \`author.name\`, \`author.avatar\`) directly in child documents to eliminate join lookups.
- **Bucket Pattern**: Group time-series IoT sensor data into hourly document buckets.

## Why Embedding vs Referencing & Production Schema Patterns Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`javascript
function createExtendedOrder(user, items, total) {
  return {
    customer: {
      customerId: user.id,
      customerName: user.name
    },
    items,
    total,
    createdAt: new Date()
  };
}
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Embed customer: { customerId: user.id, customerName: user.name }

> ⚠️ **Common Mistake**: Unbounded arrays grow indefinitely and will breach MongoDB's 16MB single document limit, requiring referencing or time-series bucket patterns.

## Real-World Production Scenario

In production engineering, **Embedding vs Referencing & Production Schema Patterns** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Embedding vs Referencing & Production Schema Patterns. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MongoDB Manual: Document Model')?._id,
  });

  const mongoL7_Challenge = await ChallengeModel.create({
    title: `Create Extended Reference Order Document`,
    description: `Write a JavaScript function \`createExtendedOrder(user, items, total)\` that returns an order document embedding \`{ customerId: user.id, customerName: user.name }\` alongside \`items\` and \`total\`.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function createExtendedOrder(user, items, total) {
  // Return order document
}
`,
    solutionCode: `function createExtendedOrder(user, items, total) {
  return {
    customer: {
      customerId: user.id,
      customerName: user.name
    },
    items,
    total,
    createdAt: new Date()
  };
}`,
    hints: ["Embed customer: { customerId: user.id, customerName: user.name }"],
    skills: [{"skillId": "nosql-modeling", "weight": 1.0}],
    testCases: [{"input": "createExtendedOrder({ id: '123', name: 'Spix' }, [], 99)", "expectedOutput": "true", "description": "Creates extended reference document", "hidden": false}],
  });

  const mongoL7_Practice = await ActivityModel.create({
    lessonId: mongoL7._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Create Extended Reference Order Document`,
    order: 3,
    challengeRef: mongoL7_Challenge._id,
    content: `# Code Practice: Create Extended Reference Order Document\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  mongoL7_Challenge.activityId = mongoL7_Practice._id;
  await mongoL7_Challenge.save();

  const mongoL7_Quiz = await AssessmentModel.create({
    title: `Assessment: Schema Design Patterns`,
    description: `Evaluate data modeling decisions for production workloads.`,
    passingScore: 70,
    skills: [{"skillId": "nosql-modeling", "weight": 1.0}],
    questions: [
    {
        "question": "Why should high-frequency IoT sensor telemetry readings not be embedded as an array inside a single device document?",
        "options": [
            "MongoDB does not support arrays of numbers",
            "Unbounded continuous readings will rapidly exceed the 16MB maximum document size limit",
            "IoT data requires relational schemas",
            "Sensor readings cannot be indexed"
        ],
        "explanation": "Unbounded arrays grow indefinitely and will breach MongoDB's 16MB single document limit, requiring referencing or time-series bucket patterns.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const mongoL7_Assessment = await ActivityModel.create({
    lessonId: mongoL7._id,
    type: 'QUIZ',
    title: `Assessment: Schema Design Patterns`,
    order: 4,
    assessmentRef: mongoL7_Quiz._id,
  });
  mongoL7_Quiz.activityId = mongoL7_Assessment._id;
  await mongoL7_Quiz.save();

  mongoL7.activities = [
    mongoL7_Video._id,
    mongoL7_Notes._id,
    mongoL7_Practice._id,
    mongoL7_Assessment._id,
  ] as any;
  await mongoL7.save();

  // --- Lesson 2: Replica Sets, High Availability & Multi-Document Transactions ---
  const mongoL8 = await LessonModel.create({
    moduleId: mongoMod4._id,
    courseId: mongoCourse._id,
    title: `Replica Sets, High Availability & Multi-Document Transactions`,
    description: `Configure primary/secondary replica set topologies and implement multi-document ACID transactions with sessions.`,
    order: 2,
    activities: [],
  });

  const mongoL8_Video = await ActivityModel.create({
    lessonId: mongoL8._id,
    type: 'VIDEO',
    title: `Video: MongoDB Replica Sets & ACID Transactions`,
    order: 1,
    resourceRef: getRes('MongoDB Full Course for Beginners')?._id,
    content: `# Key Takeaways:
- Replica sets provide high availability with automatic failover in < 10 seconds.
- Primary nodes accept all writes and record mutations to the oplog.
- Client sessions support distributed multi-document ACID transactions.`,
  });

  const mongoL8_Notes = await ActivityModel.create({
    lessonId: mongoL8._id,
    type: 'NOTES',
    title: `Codexa Notes: Replica Sets, High Availability & Multi-Document Transactions`,
    order: 2,
    content: `# Replica Sets, High Availability & Multi-Document Transactions

Configure primary/secondary replica set topologies and implement multi-document ACID transactions with sessions.

Enterprise MongoDB deployments provide high availability and ACID guarantees.

---

### 1. Replica Set Architecture
- **Primary**: Receives all write operations and writes to operation log (\`oplog\`).
- **Secondaries**: Replicate oplog asynchronously to maintain data redundancy.
- **Automatic Failover**: If primary fails, secondaries elect a new primary automatically.

### 2. Multi-Document ACID Transactions
\`\`\`javascript
const session = client.startSession();
session.startTransaction();

try {
  await accounts.updateOne({ _id: senderId }, { $inc: { balance: -100 } }, { session });
  await accounts.updateOne({ _id: receiverId }, { $inc: { balance: 100 } }, { session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  await session.endSession();
}
\`\`\`

## Why Replica Sets, High Availability & Multi-Document Transactions Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Start session and call session.startTransaction()

> ⚠️ **Common Mistake**: All write operations are routed to the Primary node in a replica set, which records mutations to its oplog before secondaries replicate them.

## Real-World Production Scenario

In production engineering, **Replica Sets, High Availability & Multi-Document Transactions** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Replica Sets, High Availability & Multi-Document Transactions. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MongoDB Manual: Document Model')?._id,
  });

  const mongoL8_Challenge = await ChallengeModel.create({
    title: `Wrap Logic in Session Transaction`,
    description: `Write an async JavaScript function \`executeTransaction(client, callback)\` that starts a session, starts a transaction, awaits \`callback(session)\`, commits the transaction, catches errors with \`abortTransaction()\`, and calls \`endSession()\` in finally.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `async function executeTransaction(client, callback) {
  // Wrap execution in ACID transaction
}
`,
    solutionCode: `async function executeTransaction(client, callback) {
  const session = client.startSession();
  session.startTransaction();
  try {
    const res = await callback(session);
    await session.commitTransaction();
    return res;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
}`,
    hints: ["Start session and call session.startTransaction()", "Catch error and call abortTransaction()", "Always call session.endSession() in finally block"],
    skills: [{"skillId": "mongodb-queries", "weight": 1.0}],
    testCases: [{"input": "executeTransaction", "expectedOutput": "true", "description": "Handles transactional commit and rollback", "hidden": false}],
  });

  const mongoL8_Practice = await ActivityModel.create({
    lessonId: mongoL8._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Wrap Logic in Session Transaction`,
    order: 3,
    challengeRef: mongoL8_Challenge._id,
    content: `# Code Practice: Wrap Logic in Session Transaction\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  mongoL8_Challenge.activityId = mongoL8_Practice._id;
  await mongoL8_Challenge.save();

  const mongoL8_Quiz = await AssessmentModel.create({
    title: `Assessment: High Availability & Transactions`,
    description: `Test replica set failover and transactional semantics.`,
    passingScore: 70,
    skills: [{"skillId": "nosql-modeling", "weight": 1.0}],
    questions: [
    {
        "question": "In a MongoDB Replica Set, which node is responsible for receiving write operations?",
        "options": [
            "Any Secondary node",
            "The Primary node",
            "The Arbiter node",
            "The Config Server"
        ],
        "explanation": "All write operations are routed to the Primary node in a replica set, which records mutations to its oplog before secondaries replicate them.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const mongoL8_Assessment = await ActivityModel.create({
    lessonId: mongoL8._id,
    type: 'QUIZ',
    title: `Assessment: High Availability & Transactions`,
    order: 4,
    assessmentRef: mongoL8_Quiz._id,
  });
  mongoL8_Quiz.activityId = mongoL8_Assessment._id;
  await mongoL8_Quiz.save();

  mongoL8.activities = [
    mongoL8_Video._id,
    mongoL8_Notes._id,
    mongoL8_Practice._id,
    mongoL8_Assessment._id,
  ] as any;
  await mongoL8.save();

  mongoMod4.lessons = [mongoL7._id, mongoL8._id] as any;
  await mongoMod4.save();

  mongoCourse.modules = [mongoMod1._id, mongoMod2._id, mongoMod3._id, mongoMod4._id] as any;
  await mongoCourse.save();

  return [sqlCourse, mongoCourse];
}
