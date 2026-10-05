import { CourseModel } from '../../models/Course';
import { ModuleModel } from '../../models/Module';
import { LessonModel } from '../../models/Lesson';
import { ActivityModel } from '../../models/Activity';
import { AssessmentModel } from '../../models/Assessment';
import { ChallengeModel } from '../../models/Challenge';

export async function seedWebDevelopmentCourses(resourceMap: Map<string, any>) {
  const getRes = (titlePrefix: string) => {
    for (const [title, r] of resourceMap.entries()) {
      if (title.toLowerCase().includes(titlePrefix.toLowerCase())) return r;
    }
    return undefined;
  };

  // =========================================================================
  // 1. MERN STACK DEVELOPMENT (4 MODULES, 8 LESSONS)
  // =========================================================================
  const mernCourse = await CourseModel.create({
    slug: 'mern-stack-development',
    title: 'Full-Stack MERN Architecture & Engineering',
    description: 'Master end-to-end full-stack web applications with MongoDB, Express, React, and Node.js with production security, JWT authentication, and isolated sandbox execution.',
    domain: 'Web Development',
    level: 'BEGINNER',
    status: 'PUBLISHED',
    estimatedHours: 45,
    skillsCovered: ['javascript-fundamentals', 'async-javascript', 'nodejs-core', 'express-apis', 'mongodb-queries', 'react-state', 'rest-architecture'],
    prerequisites: ['Basic HTML/CSS and introductory programming'],
    modules: [],
  });

  const mernMod1 = await ModuleModel.create({
    courseId: mernCourse._id,
    title: `Module 1: Modern JavaScript & Async Pipelines`,
    description: `Functional programming patterns, array transformations, promises, and the event loop.`,
    order: 1,
    lessons: [],
  });

  // --- Lesson 1: Pure Functions & Array Pipelines ---
  const mernL1 = await LessonModel.create({
    moduleId: mernMod1._id,
    courseId: mernCourse._id,
    title: `Pure Functions & Array Pipelines`,
    description: `Learn functional transformations using filter, map, and reduce for immutable data pipelines.`,
    order: 1,
    activities: [],
  });

  const mernL1_Video = await ActivityModel.create({
    lessonId: mernL1._id,
    type: 'VIDEO',
    title: `Video: Functional Array Pipelines in JavaScript`,
    order: 1,
    resourceRef: getRes('JavaScript Array filter Method in Tamil')?._id,
    content: `# Key Takeaways:\\n- Pure functions produce zero side-effects and return predictable outputs.\\n- Array pipelines (filter -> map -> reduce) eliminate imperative state mutation.`,
  });

  const mernL1_Notes = await ActivityModel.create({
    lessonId: mernL1._id,
    type: 'NOTES',
    title: `Codexa Notes: Pure Functions & Array Pipelines`,
    order: 2,
    content: `# Pure Functions & Array Pipelines

Learn functional transformations using filter, map, and reduce for immutable data pipelines.

In modern JavaScript and full-stack development, managing state immutably prevents race conditions and UI bugs.

---

### Pure Function Principles
1. **Deterministic**: Same input arguments ALWAYS return the same output.
2. **Zero Side Effects**: Does not modify global state, input arguments, or perform unexpected I/O.

\`\`\`javascript
// Pure Transformation
const doubleScores = (scores) => scores.map(s => s * 2);
\`\`\`

### Array Transformation Pipeline
Chain high-order functions together to process complex collections declaratively:
- \`filter()\`: Selects elements matching a predicate.
- \`map()\`: Transforms each element into a new shape.
- \`reduce()\`: Accumulates array elements into a single aggregate value.

\`\`\`javascript
const activeUserScores = users
  .filter(u => u.active)
  .map(u => u.score * 2)
  .reduce((sum, curr) => sum + curr, 0);
\`\`\`

## Why Pure Functions & Array Pipelines Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Filter active === true first

> ⚠️ **Common Mistake**: Pure functions are deterministic and produce no side-effects.

## Real-World Production Scenario

In production engineering, **Pure Functions & Array Pipelines** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Pure Functions & Array Pipelines. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MDN Web Docs: Array Transformations')?._id,
  });

  const mernL1_Challenge = await ChallengeModel.create({
    title: `Transform Active Users Pipeline`,
    description: `Implement the pure function \`calculateActiveUserScores(users)\`.

### Requirements:
1. Filter only users with \`active === true\`.
2. Double each active user's \`score\`.
3. Sum and return the total aggregate score. If no active users exist, return \`0\`.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function calculateActiveUserScores(users) {
  // Your code here
  return 0;
}

module.exports = calculateActiveUserScores;
`,
    solutionCode: `function calculateActiveUserScores(users) {
  if (!Array.isArray(users)) return 0;
  return users
    .filter(u => u && u.active === true)
    .map(u => u.score * 2)
    .reduce((sum, curr) => sum + curr, 0);
}

module.exports = calculateActiveUserScores;
`,
    hints: ["Filter active === true first", "Use reduce to sum mapped scores"],
    skills: [{"skillId": "javascript-fundamentals", "weight": 1.0}],
    testCases: [{"input": "[[{\"id\": 1, \"active\": true, \"score\": 50}, {\"id\": 2, \"active\": false, \"score\": 90}]]", "expectedOutput": "100", "description": "Calculates active user score total", "hidden": false}, {"input": "[[{\"id\": 1, \"active\": false, \"score\": 100}]]", "expectedOutput": "0", "description": "Returns 0 when no active users", "hidden": false}],
  });

  const mernL1_Practice = await ActivityModel.create({
    lessonId: mernL1._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Transform Active Users Pipeline`,
    order: 3,
    challengeRef: mernL1_Challenge._id,
    content: `# Code Practice: Transform Active Users Pipeline\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  mernL1_Challenge.activityId = mernL1_Practice._id;
  await mernL1_Challenge.save();

  const mernL1_Quiz = await AssessmentModel.create({
    title: `Assessment: Pure Functions & Array Pipelines`,
    description: `Demonstrate your understanding of immutable array transformations and pure function characteristics.`,
    passingScore: 70,
    skills: [{"skillId": "javascript-fundamentals", "weight": 1.0}],
    questions: [
    {
        "question": "What is the primary characteristic of a pure JavaScript function?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "It modifies its input arguments directly",
            "Given identical inputs, it always returns the exact same output without side-effects",
            "It must execute asynchronously using Promise",
            "It connects directly to MongoDB"
        ],
        "correctOption": 1,
        "explanation": "Pure functions are deterministic and produce no side-effects.",
        "points": 10
    },
    {
        "question": "Which array method transforms elements into a brand-new array without mutating the original input array?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Array.prototype.push()",
            "Array.prototype.map()",
            "Array.prototype.splice()",
            "Array.prototype.reverse()"
        ],
        "correctOption": 1,
        "explanation": "Array.prototype.map() applies a projection function and returns a new transformed array immutably.",
        "points": 10
    },
    {
        "question": "Why should side-effects (like global mutations) be avoided inside pure functional pipelines?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "They increase CSS parse times",
            "They introduce non-deterministic state dependencies and potential race conditions",
            "JavaScript engine throws a syntax error",
            "They disable garbage collection"
        ],
        "correctOption": 1,
        "explanation": "Side-effects introduce hidden state dependencies that compromise predictability and testability.",
        "points": 10
    }
],
  });

  const mernL1_Assessment = await ActivityModel.create({
    lessonId: mernL1._id,
    type: 'QUIZ',
    title: `Assessment: Pure Functions & Array Pipelines`,
    order: 4,
    assessmentRef: mernL1_Quiz._id,
  });
  mernL1_Quiz.activityId = mernL1_Assessment._id;
  await mernL1_Quiz.save();

  mernL1.activities = [
    mernL1_Video._id,
    mernL1_Notes._id,
    mernL1_Practice._id,
    mernL1_Assessment._id,
  ] as any;
  await mernL1.save();

  // --- Lesson 2: Asynchronous JavaScript & Event Loop Mechanics ---
  const mernL2 = await LessonModel.create({
    moduleId: mernMod1._id,
    courseId: mernCourse._id,
    title: `Asynchronous JavaScript & Event Loop Mechanics`,
    description: `Master JavaScript execution contexts, call stack, microtask queue, and Promise lifecycle.`,
    order: 2,
    activities: [],
  });

  const mernL2_Video = await ActivityModel.create({
    lessonId: mernL2._id,
    type: 'VIDEO',
    title: `Video: The JavaScript Event Loop & Microtask Queue`,
    order: 1,
    resourceRef: getRes('The JavaScript Event Loop and Microtask Queue')?._id,
    content: `# Key Takeaways:\\n- Synchronous code runs on the Call Stack.\\n- Microtasks (Promises) resolve before Macrotasks (setTimeout).`,
  });

  const mernL2_Notes = await ActivityModel.create({
    lessonId: mernL2._id,
    type: 'NOTES',
    title: `Codexa Notes: Asynchronous JavaScript & Event Loop Mechanics`,
    order: 2,
    content: `# Asynchronous JavaScript & Event Loop Mechanics

Master JavaScript execution contexts, call stack, microtask queue, and Promise lifecycle.

JavaScript is single-threaded. It achieves non-blocking asynchronous execution through the Event Loop, Call Stack, Microtask Queue, and Callback Queue.

---

### Execution Order:
1. **Call Stack**: Executes synchronous operations immediately.
2. **Microtask Queue**: Promises (\`.then()\`, \`await\`), \`queueMicrotask\` (Executes immediately after call stack empties).
3. **Macrotask Queue**: \`setTimeout\`, \`setInterval\`, I/O events.

\`\`\`javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Output: 1, 4, 3, 2
\`\`\`

## Why Asynchronous JavaScript & Event Loop Mechanics Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use Promise.allSettled to catch both resolved and rejected promises.

> ⚠️ **Common Mistake**: The Microtask Queue is drained completely before the event loop picks the next macrotask.

## Real-World Production Scenario

In production engineering, **Asynchronous JavaScript & Event Loop Mechanics** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Asynchronous JavaScript & Event Loop Mechanics. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MDN Web Docs: JavaScript Event Loop')?._id,
  });

  const mernL2_Challenge = await ChallengeModel.create({
    title: `Async Batch Result Aggregator`,
    description: `Implement \`async function fetchAndAggregate(promises)\` that waits for all promises to settle and returns an object \`{ passed: number, failed: number }\`.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `async function fetchAndAggregate(promiseList) {
  // Your code here
  return { passed: 0, failed: 0 };
}

module.exports = fetchAndAggregate;
`,
    solutionCode: `async function fetchAndAggregate(promiseList) {
  const results = await Promise.allSettled(promiseList);
  let passed = 0;
  let failed = 0;
  for (const r of results) {
    if (r.status === 'fulfilled') passed++;
    else failed++;
  }
  return { passed, failed };
}

module.exports = fetchAndAggregate;
`,
    hints: ["Use Promise.allSettled to catch both resolved and rejected promises."],
    skills: [{"skillId": "async-javascript", "weight": 1.0}],
    testCases: [{"input": "[[]]", "expectedOutput": "{\"passed\":0,\"failed\":0}", "description": "Handles empty promise array", "hidden": false}],
  });

  const mernL2_Practice = await ActivityModel.create({
    lessonId: mernL2._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Async Batch Result Aggregator`,
    order: 3,
    challengeRef: mernL2_Challenge._id,
    content: `# Code Practice: Async Batch Result Aggregator\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  mernL2_Challenge.activityId = mernL2_Practice._id;
  await mernL2_Challenge.save();

  const mernL2_Quiz = await AssessmentModel.create({
    title: `Assessment: Event Loop & Microtasks`,
    description: `Verify execution order knowledge for asynchronous JavaScript runtime.`,
    passingScore: 70,
    skills: [{"skillId": "async-javascript", "weight": 1.0}],
    questions: [
    {
        "question": "Which queue has priority when the Call Stack becomes empty?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Macrotask (setTimeout) Queue",
            "Microtask (Promise) Queue",
            "Timer Queue",
            "Network Queue"
        ],
        "correctOption": 1,
        "explanation": "The Microtask Queue is drained completely before the event loop picks the next macrotask.",
        "points": 10
    }
],
  });

  const mernL2_Assessment = await ActivityModel.create({
    lessonId: mernL2._id,
    type: 'QUIZ',
    title: `Assessment: Event Loop & Microtasks`,
    order: 4,
    assessmentRef: mernL2_Quiz._id,
  });
  mernL2_Quiz.activityId = mernL2_Assessment._id;
  await mernL2_Quiz.save();

  mernL2.activities = [
    mernL2_Video._id,
    mernL2_Notes._id,
    mernL2_Practice._id,
    mernL2_Assessment._id,
  ] as any;
  await mernL2.save();

  mernMod1.lessons = [mernL1._id, mernL2._id] as any;
  await mernMod1.save();

  const mernMod2 = await ModuleModel.create({
    courseId: mernCourse._id,
    title: `Module 2: Node.js & Express RESTful APIs`,
    description: `Server architecture, middleware pipelines, routing, and controller design.`,
    order: 2,
    lessons: [],
  });

  // --- Lesson 1: Express Middleware Chains & Request Lifecycles ---
  const mernL3 = await LessonModel.create({
    moduleId: mernMod2._id,
    courseId: mernCourse._id,
    title: `Express Middleware Chains & Request Lifecycles`,
    description: `Understand request-response flow, custom middlewares, and next() chaining.`,
    order: 1,
    activities: [],
  });

  const mernL3_Video = await ActivityModel.create({
    lessonId: mernL3._id,
    type: 'VIDEO',
    title: `Video: Node.js and Express.js Backend Architecture`,
    order: 1,
    resourceRef: getRes('Express.js REST API and Middleware Architecture')?._id,
    content: `# Middleware Architecture:\\n- Middleware functions have access to req, res, and next.\\n- Always call next() or send a response to avoid hanging requests.`,
  });

  const mernL3_Notes = await ActivityModel.create({
    lessonId: mernL3._id,
    type: 'NOTES',
    title: `Codexa Notes: Express Middleware Chains & Request Lifecycles`,
    order: 2,
    content: `# Express Middleware Chains & Request Lifecycles

Understand request-response flow, custom middlewares, and next() chaining.

Middleware functions execute sequentially in the request-response cycle.

\`\`\`javascript
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  next();
};
\`\`\`

## Why Express Middleware Chains & Request Lifecycles Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Call next() to advance to the subsequent middleware.

> ⚠️ **Common Mistake**: If next() is not called and no response is sent, the client connection stays open until it times out.

## Real-World Production Scenario

In production engineering, **Express Middleware Chains & Request Lifecycles** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Express Middleware Chains & Request Lifecycles. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Express.js Guide: Middleware')?._id,
  });

  const mernL3_Challenge = await ChallengeModel.create({
    title: `Build Middleware Chain Simulator`,
    description: `Implement \`runMiddlewareChain(req, res, middlewares)\` that executes an array of middleware functions \`(req, res, next)\` sequentially.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function runMiddlewareChain(req, res, middlewares) {
  let index = 0;
  function next() {
    if (index < middlewares.length) {
      const current = middlewares[index++];
      current(req, res, next);
    }
  }
  next();
  return res;
}

module.exports = runMiddlewareChain;
`,
    solutionCode: `function runMiddlewareChain(req, res, middlewares) {
  let index = 0;
  function next() {
    if (index < middlewares.length) {
      const current = middlewares[index++];
      current(req, res, next);
    }
  }
  next();
  return res;
}

module.exports = runMiddlewareChain;
`,
    hints: ["Call next() to advance to the subsequent middleware."],
    skills: [{"skillId": "express-apis", "weight": 1.0}],
    testCases: [{"input": "[{}, {}, []]", "expectedOutput": "{}", "description": "Runs empty middleware list", "hidden": false}],
  });

  const mernL3_Practice = await ActivityModel.create({
    lessonId: mernL3._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Build Middleware Chain Simulator`,
    order: 3,
    challengeRef: mernL3_Challenge._id,
    content: `# Code Practice: Build Middleware Chain Simulator\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  mernL3_Challenge.activityId = mernL3_Practice._id;
  await mernL3_Challenge.save();

  const mernL3_Quiz = await AssessmentModel.create({
    title: `Assessment: Express Middleware Execution`,
    description: `Test understanding of Express middleware flow control.`,
    passingScore: 70,
    skills: [{"skillId": "express-apis", "weight": 1.0}],
    questions: [
    {
        "question": "What happens if a middleware neither calls next() nor terminates the response with res.send()?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Express automatically returns 200 OK",
            "The client request hangs until timeout",
            "The server crashes with fatal error",
            "Express skips to the next route handler"
        ],
        "correctOption": 1,
        "explanation": "If next() is not called and no response is sent, the client connection stays open until it times out.",
        "points": 10
    }
],
  });

  const mernL3_Assessment = await ActivityModel.create({
    lessonId: mernL3._id,
    type: 'QUIZ',
    title: `Assessment: Express Middleware Execution`,
    order: 4,
    assessmentRef: mernL3_Quiz._id,
  });
  mernL3_Quiz.activityId = mernL3_Assessment._id;
  await mernL3_Quiz.save();

  mernL3.activities = [
    mernL3_Video._id,
    mernL3_Notes._id,
    mernL3_Practice._id,
    mernL3_Assessment._id,
  ] as any;
  await mernL3.save();

  // --- Lesson 2: REST API Controller Design & Input Validation ---
  const mernL4 = await LessonModel.create({
    moduleId: mernMod2._id,
    courseId: mernCourse._id,
    title: `REST API Controller Design & Input Validation`,
    description: `Build scalable REST endpoints with schema validation and standardized JSON responses.`,
    order: 2,
    activities: [],
  });

  const mernL4_Video = await ActivityModel.create({
    lessonId: mernL4._id,
    type: 'VIDEO',
    title: `Video: RESTful API Controller Best Practices`,
    order: 1,
    resourceRef: getRes('Node.js and Express Full Backend Course')?._id,
    content: `# REST API Design:\\n- Use proper HTTP verbs (GET, POST, PUT, DELETE).\\n- Return standardized response payloads.`,
  });

  const mernL4_Notes = await ActivityModel.create({
    lessonId: mernL4._id,
    type: 'NOTES',
    title: `Codexa Notes: REST API Controller Design & Input Validation`,
    order: 2,
    content: `# REST API Controller Design & Input Validation

Build scalable REST endpoints with schema validation and standardized JSON responses.

Follow HTTP standards for predictable client-server communication:
- \`200 OK\`: Successful retrieval or update.
- \`201 Created\`: Resource successfully created.
- \`400 Bad Request\`: Validation failure.
- \`401 / 403\`: Authentication / Authorization failure.
- \`404 Not Found\`: Resource does not exist.
- \`500 Internal Error\`: Unhandled server exception.

## Why REST API Controller Design & Input Validation Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`javascript
function createApiResponse(success, data = null, errorMsg = null, statusCode = 200) {
  return {
    success: Boolean(success),
    data: data,
    error: errorMsg,
    status: statusCode,
    timestamp: new Date().toISOString()
  };
}

module.exports = createApiResponse;
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Format response payload consistently.

> ⚠️ **Common Mistake**: 201 Created indicates the request succeeded and led to resource creation.

## Real-World Production Scenario

In production engineering, **REST API Controller Design & Input Validation** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of REST API Controller Design & Input Validation. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Express.js Guide: Middleware')?._id,
  });

  const mernL4_Challenge = await ChallengeModel.create({
    title: `Format REST Response Helper`,
    description: `Implement \`createApiResponse(success, data, errorMsg, statusCode)\` returning \`{ success, data, error: errorMsg, status: statusCode, timestamp: string }\`.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function createApiResponse(success, data = null, errorMsg = null, statusCode = 200) {
  // Your code here
  return null;
}

module.exports = createApiResponse;
`,
    solutionCode: `function createApiResponse(success, data = null, errorMsg = null, statusCode = 200) {
  return {
    success: Boolean(success),
    data: data,
    error: errorMsg,
    status: statusCode,
    timestamp: new Date().toISOString()
  };
}

module.exports = createApiResponse;
`,
    hints: ["Format response payload consistently."],
    skills: [{"skillId": "express-apis", "weight": 1.0}],
    testCases: [{"input": "[true, {\"id\": 1}, null, 200]", "expectedOutput": "true", "description": "Returns success response shape", "hidden": false}],
  });

  const mernL4_Practice = await ActivityModel.create({
    lessonId: mernL4._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Format REST Response Helper`,
    order: 3,
    challengeRef: mernL4_Challenge._id,
    content: `# Code Practice: Format REST Response Helper\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  mernL4_Challenge.activityId = mernL4_Practice._id;
  await mernL4_Challenge.save();

  const mernL4_Quiz = await AssessmentModel.create({
    title: `Assessment: HTTP Status Codes & REST Design`,
    description: `Test comprehension of REST conventions.`,
    passingScore: 70,
    skills: [{"skillId": "express-apis", "weight": 1.0}],
    questions: [
    {
        "question": "Which HTTP status code is most appropriate after creating a new resource in a POST request?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "200 OK",
            "201 Created",
            "202 Accepted",
            "204 No Content"
        ],
        "correctOption": 1,
        "explanation": "201 Created indicates the request succeeded and led to resource creation.",
        "points": 10
    }
],
  });

  const mernL4_Assessment = await ActivityModel.create({
    lessonId: mernL4._id,
    type: 'QUIZ',
    title: `Assessment: HTTP Status Codes & REST Design`,
    order: 4,
    assessmentRef: mernL4_Quiz._id,
  });
  mernL4_Quiz.activityId = mernL4_Assessment._id;
  await mernL4_Quiz.save();

  mernL4.activities = [
    mernL4_Video._id,
    mernL4_Notes._id,
    mernL4_Practice._id,
    mernL4_Assessment._id,
  ] as any;
  await mernL4.save();

  mernMod2.lessons = [mernL3._id, mernL4._id] as any;
  await mernMod2.save();

  const mernMod3 = await ModuleModel.create({
    courseId: mernCourse._id,
    title: `Module 3: MongoDB Document Modeling & Mongoose`,
    description: `Schema definition, relationships, indexes, and aggregation pipelines.`,
    order: 3,
    lessons: [],
  });

  // --- Lesson 1: Mongoose Schema Design & Data Validation ---
  const mernL5 = await LessonModel.create({
    moduleId: mernMod3._id,
    courseId: mernCourse._id,
    title: `Mongoose Schema Design & Data Validation`,
    description: `Define typed document schemas with field validations, defaults, and timestamps.`,
    order: 1,
    activities: [],
  });

  const mernL5_Video = await ActivityModel.create({
    lessonId: mernL5._id,
    type: 'VIDEO',
    title: `Video: MongoDB Database Modeling with Mongoose`,
    order: 1,
    resourceRef: getRes('MongoDB Complete Tutorial in Tamil')?._id,
    content: `# Mongoose Schemas:\\n- Schemas enforce structure over dynamic MongoDB documents.\\n- Built-in validation prevents corrupted data persistence.`,
  });

  const mernL5_Notes = await ActivityModel.create({
    lessonId: mernL5._id,
    type: 'NOTES',
    title: `Codexa Notes: Mongoose Schema Design & Data Validation`,
    order: 2,
    content: `# Mongoose Schema Design & Data Validation

Define typed document schemas with field validations, defaults, and timestamps.

Mongoose provides schema-based modeling for MongoDB:

\`\`\`javascript
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  age: { type: Number, min: 18 },
  role: { type: String, enum: ['STUDENT', 'ADMIN'], default: 'STUDENT' }
}, { timestamps: true });
\`\`\`

## Why Mongoose Schema Design & Data Validation Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Check email string and age >= 18

> ⚠️ **Common Mistake**: Application-level validation prevents malformed records from polluting collections.

## Real-World Production Scenario

In production engineering, **Mongoose Schema Design & Data Validation** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Mongoose Schema Design & Data Validation. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MongoDB Manual: Document Model')?._id,
  });

  const mernL5_Challenge = await ChallengeModel.create({
    title: `Validate Document Payload`,
    description: `Implement \`validateUserPayload(payload)\` checking required fields: \`email\` (string containing '@') and \`age\` (number >= 18). Return \`{ valid: boolean, error?: string }\`.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function validateUserPayload(payload) {
  // Your code here
  return { valid: false };
}

module.exports = validateUserPayload;
`,
    solutionCode: `function validateUserPayload(payload) {
  if (!payload || typeof payload !== 'object') return { valid: false, error: 'Payload missing' };
  if (!payload.email || typeof payload.email !== 'string' || !payload.email.includes('@')) {
    return { valid: false, error: 'Invalid email' };
  }
  if (typeof payload.age !== 'number' || payload.age < 18) {
    return { valid: false, error: 'Age must be at least 18' };
  }
  return { valid: true };
}

module.exports = validateUserPayload;
`,
    hints: ["Check email string and age >= 18"],
    skills: [{"skillId": "mongodb-queries", "weight": 1.0}],
    testCases: [{"input": "[{\"email\": \"alex@codexa.dev\", \"age\": 22}]", "expectedOutput": "{\"valid\":true}", "description": "Validates proper payload", "hidden": false}],
  });

  const mernL5_Practice = await ActivityModel.create({
    lessonId: mernL5._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Validate Document Payload`,
    order: 3,
    challengeRef: mernL5_Challenge._id,
    content: `# Code Practice: Validate Document Payload\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  mernL5_Challenge.activityId = mernL5_Practice._id;
  await mernL5_Challenge.save();

  const mernL5_Quiz = await AssessmentModel.create({
    title: `Assessment: MongoDB Schema Design`,
    description: `Test understanding of Mongoose schema constraints.`,
    passingScore: 70,
    skills: [{"skillId": "mongodb-queries", "weight": 1.0}],
    questions: [
    {
        "question": "Why is schema validation beneficial in Mongoose despite MongoDB being schema-flexible?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "It increases network speed by 10x",
            "It guarantees application-layer data consistency and integrity before saving to DB",
            "It removes the need for database indexes",
            "It allows MongoDB to run without RAM"
        ],
        "correctOption": 1,
        "explanation": "Application-level validation prevents malformed records from polluting collections.",
        "points": 10
    }
],
  });

  const mernL5_Assessment = await ActivityModel.create({
    lessonId: mernL5._id,
    type: 'QUIZ',
    title: `Assessment: MongoDB Schema Design`,
    order: 4,
    assessmentRef: mernL5_Quiz._id,
  });
  mernL5_Quiz.activityId = mernL5_Assessment._id;
  await mernL5_Quiz.save();

  mernL5.activities = [
    mernL5_Video._id,
    mernL5_Notes._id,
    mernL5_Practice._id,
    mernL5_Assessment._id,
  ] as any;
  await mernL5.save();

  // --- Lesson 2: MongoDB Document Queries & Filtering ---
  const mernL6 = await LessonModel.create({
    moduleId: mernMod3._id,
    courseId: mernCourse._id,
    title: `MongoDB Document Queries & Filtering`,
    description: `Execute complex find queries with operators: $gt, $in, $and, and projection.`,
    order: 2,
    activities: [],
  });

  const mernL6_Video = await ActivityModel.create({
    lessonId: mernL6._id,
    type: 'VIDEO',
    title: `Video: MongoDB Query Operators & Projections`,
    order: 1,
    resourceRef: getRes('MongoDB Queries on Embedded Documents in Tamil')?._id,
    content: `# Query Operators:\\n- $eq, $gt, $in filter document arrays.\\n- Projections select only necessary fields to reduce network payload.`,
  });

  const mernL6_Notes = await ActivityModel.create({
    lessonId: mernL6._id,
    type: 'NOTES',
    title: `Codexa Notes: MongoDB Document Queries & Filtering`,
    order: 2,
    content: `# MongoDB Document Queries & Filtering

Execute complex find queries with operators: $gt, $in, $and, and projection.

Query operators enable expressive document filtering:

\`\`\`javascript
// Find active users with score > 80
db.users.find({
  active: true,
  score: { $gt: 80 }
}, { name: 1, email: 1, _id: 0 });
\`\`\`

## Why MongoDB Document Queries & Filtering Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Iterate over doc keys and match exact or $gt values.

> ⚠️ **Common Mistake**: $in matches any value contained in the specified array.

## Real-World Production Scenario

In production engineering, **MongoDB Document Queries & Filtering** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of MongoDB Document Queries & Filtering. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MongoDB Manual: Document Model')?._id,
  });

  const mernL6_Challenge = await ChallengeModel.create({
    title: `Simulate Mongo Query Filter`,
    description: `Implement \`simulateMongoFilter(docs, query)\` that supports exact match \`{ field: val }\` and \`{ field: { $gt: num } }\`.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function simulateMongoFilter(docs, query) {
  // Your code here
  return [];
}

module.exports = simulateMongoFilter;
`,
    solutionCode: `function simulateMongoFilter(docs, query) {
  return docs.filter(doc => {
    for (const [key, filterVal] of Object.entries(query)) {
      if (typeof filterVal === 'object' && filterVal !== null && '$gt' in filterVal) {
        if (!(doc[key] > filterVal.$gt)) return false;
      } else {
        if (doc[key] !== filterVal) return false;
      }
    }
    return true;
  });
}

module.exports = simulateMongoFilter;
`,
    hints: ["Iterate over doc keys and match exact or $gt values."],
    skills: [{"skillId": "mongodb-queries", "weight": 1.0}],
    testCases: [{"input": "[[{\"score\": 90}, {\"score\": 50}], {\"score\": {\"$gt\": 60}}]", "expectedOutput": "[{\"score\":90}]", "description": "Filters with $gt operator", "hidden": false}],
  });

  const mernL6_Practice = await ActivityModel.create({
    lessonId: mernL6._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Simulate Mongo Query Filter`,
    order: 3,
    challengeRef: mernL6_Challenge._id,
    content: `# Code Practice: Simulate Mongo Query Filter\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  mernL6_Challenge.activityId = mernL6_Practice._id;
  await mernL6_Challenge.save();

  const mernL6_Quiz = await AssessmentModel.create({
    title: `Assessment: MongoDB Query Operators`,
    description: `Test understanding of MongoDB filter queries.`,
    passingScore: 70,
    skills: [{"skillId": "mongodb-queries", "weight": 1.0}],
    questions: [
    {
        "question": "Which MongoDB operator is used to check if a field value matches any item in a provided array?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "$has",
            "$in",
            "$matches",
            "$contains"
        ],
        "correctOption": 1,
        "explanation": "$in matches any value contained in the specified array.",
        "points": 10
    }
],
  });

  const mernL6_Assessment = await ActivityModel.create({
    lessonId: mernL6._id,
    type: 'QUIZ',
    title: `Assessment: MongoDB Query Operators`,
    order: 4,
    assessmentRef: mernL6_Quiz._id,
  });
  mernL6_Quiz.activityId = mernL6_Assessment._id;
  await mernL6_Quiz.save();

  mernL6.activities = [
    mernL6_Video._id,
    mernL6_Notes._id,
    mernL6_Practice._id,
    mernL6_Assessment._id,
  ] as any;
  await mernL6.save();

  mernMod3.lessons = [mernL5._id, mernL6._id] as any;
  await mernMod3.save();

  const mernMod4 = await ModuleModel.create({
    courseId: mernCourse._id,
    title: `Module 4: React Frontend Integration & State Flow`,
    description: `Connect React component trees to Express APIs, manage state, and handle authentication.`,
    order: 4,
    lessons: [],
  });

  // --- Lesson 1: React Component Trees & Props Flow ---
  const mernL7 = await LessonModel.create({
    moduleId: mernMod4._id,
    courseId: mernCourse._id,
    title: `React Component Trees & Props Flow`,
    description: `Understand functional components, JSX structure, and unidirectional props passing.`,
    order: 1,
    activities: [],
  });

  const mernL7_Video = await ActivityModel.create({
    lessonId: mernL7._id,
    type: 'VIDEO',
    title: `Video: Modern React Components & State Flow`,
    order: 1,
    resourceRef: getRes('Props and PropTypes in React JS in Tamil')?._id,
    content: `# React Unidirectional Flow:\\n- Props pass data downward from parent to child components.\\n- Re-renders occur predictably when state changes.`,
  });

  const mernL7_Notes = await ActivityModel.create({
    lessonId: mernL7._id,
    type: 'NOTES',
    title: `Codexa Notes: React Component Trees & Props Flow`,
    order: 2,
    content: `# React Component Trees & Props Flow

Understand functional components, JSX structure, and unidirectional props passing.

Components are pure functions mapping props and state to UI:

\`\`\`jsx
function UserCard({ user, onSelect }) {
  return (
    <div className="card" onClick={() => onSelect(user.id)}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}
\`\`\`

## Why React Component Trees & Props Flow Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Return fresh object instead of mutating state.

> ⚠️ **Common Mistake**: React detects changes via shallow reference equality; immutable state updates trigger re-renders.

## Real-World Production Scenario

In production engineering, **React Component Trees & Props Flow** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of React Component Trees & Props Flow. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('React.dev: Describing the UI')?._id,
  });

  const mernL7_Challenge = await ChallengeModel.create({
    title: `Pure State Reducer for Counter`,
    description: `Implement \`counterReducer(state, action)\` where action types are 'INCREMENT', 'DECREMENT', 'RESET'.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function counterReducer(state = { count: 0 }, action) {
  // Your code here
  return state;
}

module.exports = counterReducer;
`,
    solutionCode: `function counterReducer(state = { count: 0 }, action) {
  if (!action) return state;
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: Math.max(0, state.count - 1) };
    case 'RESET':
      return { count: 0 };
    default:
      return state;
  }
}

module.exports = counterReducer;
`,
    hints: ["Return fresh object instead of mutating state."],
    skills: [{"skillId": "react-state", "weight": 1.0}],
    testCases: [{"input": "[{\"count\": 5}, {\"type\": \"INCREMENT\"}]", "expectedOutput": "{\"count\":6}", "description": "Increments state count", "hidden": false}],
  });

  const mernL7_Practice = await ActivityModel.create({
    lessonId: mernL7._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Pure State Reducer for Counter`,
    order: 3,
    challengeRef: mernL7_Challenge._id,
    content: `# Code Practice: Pure State Reducer for Counter\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  mernL7_Challenge.activityId = mernL7_Practice._id;
  await mernL7_Challenge.save();

  const mernL7_Quiz = await AssessmentModel.create({
    title: `Assessment: React Component Architecture`,
    description: `Test understanding of React unidirectional data flow.`,
    passingScore: 70,
    skills: [{"skillId": "react-state", "weight": 1.0}],
    questions: [
    {
        "question": "Why should React state never be mutated directly (e.g. state.count = 5)?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "It crashes the browser immediately",
            "Direct mutation does not trigger React virtual DOM diffing and re-rendering",
            "It causes database connection errors",
            "JavaScript forbids object mutation"
        ],
        "correctOption": 1,
        "explanation": "React detects changes via shallow reference equality; immutable state updates trigger re-renders.",
        "points": 10
    }
],
  });

  const mernL7_Assessment = await ActivityModel.create({
    lessonId: mernL7._id,
    type: 'QUIZ',
    title: `Assessment: React Component Architecture`,
    order: 4,
    assessmentRef: mernL7_Quiz._id,
  });
  mernL7_Quiz.activityId = mernL7_Assessment._id;
  await mernL7_Quiz.save();

  mernL7.activities = [
    mernL7_Video._id,
    mernL7_Notes._id,
    mernL7_Practice._id,
    mernL7_Assessment._id,
  ] as any;
  await mernL7.save();

  // --- Lesson 2: Full-Stack JWT Authentication & API Integration ---
  const mernL8 = await LessonModel.create({
    moduleId: mernMod4._id,
    courseId: mernCourse._id,
    title: `Full-Stack JWT Authentication & API Integration`,
    description: `Authenticate users securely with JWT tokens, headers, and protected React routes.`,
    order: 2,
    activities: [],
  });

  const mernL8_Video = await ActivityModel.create({
    lessonId: mernL8._id,
    type: 'VIDEO',
    title: `Video: Full Stack JWT Authentication Flow`,
    order: 1,
    resourceRef: getRes('Node.js JWT Authentication and Security Hardening')?._id,
    content: `# Full Stack Auth:\\n- Backend signs JWT with secret key.\\n- Client sends token in Authorization: Bearer <token> header.`,
  });

  const mernL8_Notes = await ActivityModel.create({
    lessonId: mernL8._id,
    type: 'NOTES',
    title: `Codexa Notes: Full-Stack JWT Authentication & API Integration`,
    order: 2,
    content: `# Full-Stack JWT Authentication & API Integration

Authenticate users securely with JWT tokens, headers, and protected React routes.

1. **Login**: User submits credentials -> Server verifies password hash -> Returns signed JWT.
2. **Persistence**: Client stores JWT in HTTP-Only cookies or memory/storage.
3. **Protected Requests**: Client includes \`Authorization: Bearer <token>\` header with API requests.
4. **Verification**: Express middleware verifies JWT signature before handling request.

\`\`\`javascript
// Express JWT Verification Middleware
const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};
\`\`\`

## Why Full-Stack JWT Authentication & API Integration Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Split header by space and verify parts[0] === 'Bearer'.

> ⚠️ **Common Mistake**: Passwords must always be hashed with strong algorithms (e.g. bcrypt/Argon2) before persistence.

## Real-World Production Scenario

In production engineering, **Full-Stack JWT Authentication & API Integration** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Full-Stack JWT Authentication & API Integration. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Express.js Guide: Middleware')?._id,
  });

  const mernL8_Challenge = await ChallengeModel.create({
    title: `Extract Bearer Token Helper`,
    description: `Implement \`extractBearerToken(authHeader)\` that extracts token from \`Bearer <token>\` string, returning \`null\` if invalid.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function extractBearerToken(authHeader) {
  // Your code here
  return null;
}

module.exports = extractBearerToken;
`,
    solutionCode: `function extractBearerToken(authHeader) {
  if (!authHeader || typeof authHeader !== 'string') return null;
  const parts = authHeader.trim().split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer' && parts[1].length > 0) {
    return parts[1];
  }
  return null;
}

module.exports = extractBearerToken;
`,
    hints: ["Split header by space and verify parts[0] === 'Bearer'."],
    skills: [{"skillId": "rest-architecture", "weight": 1.0}],
    testCases: [{"input": "[\"Bearer eyJhbGciOi...\"]", "expectedOutput": "\"eyJhbGciOi...\"", "description": "Extracts valid bearer token", "hidden": false}],
  });

  const mernL8_Practice = await ActivityModel.create({
    lessonId: mernL8._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Extract Bearer Token Helper`,
    order: 3,
    challengeRef: mernL8_Challenge._id,
    content: `# Code Practice: Extract Bearer Token Helper\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  mernL8_Challenge.activityId = mernL8_Practice._id;
  await mernL8_Challenge.save();

  const mernL8_Quiz = await AssessmentModel.create({
    title: `Assessment: Full Stack JWT Security`,
    description: `Test comprehension of token authentication architecture.`,
    passingScore: 70,
    skills: [{"skillId": "rest-architecture", "weight": 1.0}],
    questions: [
    {
        "question": "Where should sensitive user passwords NEVER be stored in plain text?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Anywhere in the application or database (passwords must always be salted and hashed)",
            "In the database, but they are okay in localStorage",
            "In the frontend only",
            "In server memory during startup"
        ],
        "correctOption": 0,
        "explanation": "Passwords must always be hashed with strong algorithms (e.g. bcrypt/Argon2) before persistence.",
        "points": 10
    }
],
  });

  const mernL8_Assessment = await ActivityModel.create({
    lessonId: mernL8._id,
    type: 'QUIZ',
    title: `Assessment: Full Stack JWT Security`,
    order: 4,
    assessmentRef: mernL8_Quiz._id,
  });
  mernL8_Quiz.activityId = mernL8_Assessment._id;
  await mernL8_Quiz.save();

  mernL8.activities = [
    mernL8_Video._id,
    mernL8_Notes._id,
    mernL8_Practice._id,
    mernL8_Assessment._id,
  ] as any;
  await mernL8.save();

  mernMod4.lessons = [mernL7._id, mernL8._id] as any;
  await mernMod4.save();

  mernCourse.modules = [mernMod1._id, mernMod2._id, mernMod3._id, mernMod4._id] as any;
  await mernCourse.save();

  // =========================================================================
  // 2. NEXT.JS 14 APP ROUTER (GOLD STANDARD)
  // =========================================================================
  const nextCourse = await CourseModel.create({
    slug: 'next-js',
    title: 'Full-Stack Next.js 14 App Router Mastery',
    description: 'Master production-grade Next.js with React Server Components, App Router layouts, Server Actions, route handlers, and streaming SSR.',
    domain: 'Web Development',
    level: 'INTERMEDIATE',
    status: 'PUBLISHED',
    estimatedHours: 50,
    skillsCovered: ['nextjs-app-router', 'react-state', 'react-hooks', 'rest-architecture'],
    prerequisites: ['Solid understanding of React components and modern JavaScript'],
    modules: [],
  });

  const nextMod1 = await ModuleModel.create({
    courseId: nextCourse._id,
    title: `Module 1: Next.js Foundations & Architecture`,
    description: `Next.js advantages, project scaffolding, App Router structure, layouts and pages.`,
    order: 1,
    lessons: [],
  });

  // --- Lesson 1: What is Next.js & App Router Architecture? ---
  const nextL1 = await LessonModel.create({
    moduleId: nextMod1._id,
    courseId: nextCourse._id,
    title: `What is Next.js & App Router Architecture?`,
    description: `Understand hybrid rendering, React Server Components by default, and filesystem routing.`,
    order: 1,
    activities: [],
  });

  const nextL1_Video = await ActivityModel.create({
    lessonId: nextL1._id,
    type: 'VIDEO',
    title: `Video: Next.js 14 App Router Architecture Overview`,
    order: 1,
    resourceRef: getRes('Next.js Introduction and Core Features in Tamil')?._id,
    content: `# Next.js Foundations:\\n- Next.js is a React framework providing SSR, SSG, and Server Components.\\n- The app/ directory maps folder hierarchy directly to URL routes.`,
  });

  const nextL1_Notes = await ActivityModel.create({
    lessonId: nextL1._id,
    type: 'NOTES',
    title: `Codexa Notes: What is Next.js & App Router Architecture?`,
    order: 2,
    content: `# What is Next.js & App Router Architecture?

Understand hybrid rendering, React Server Components by default, and filesystem routing.

Next.js provides a production framework on top of React:

### Core Benefits:
- **Zero Configuration Bundling**: Built on Turbopack / Webpack.
- **Server Components (RSC)**: Code runs on the server with zero client bundle overhead.
- **File-System Routing**: Every folder inside \`app/\` with a \`page.tsx\` becomes an active route.
- **Optimized Assets**: Built-in \`<Image>\`, \`<Link>\`, and Font optimization.

## Why What is Next.js & App Router Architecture? Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`javascript
function validateNextRoutePath(filePath) {
  if (!filePath || typeof filePath !== 'string') return false;
  return filePath.endsWith('/page.tsx') || filePath.endsWith('/page.js') || filePath === 'page.tsx' || filePath === 'page.js';
}

module.exports = validateNextRoutePath;
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Check if the file ends with page.tsx or page.js

> ⚠️ **Common Mistake**: In Next.js App Router, page.tsx defines the unique UI for that route segment.

## Real-World Production Scenario

In production engineering, **What is Next.js & App Router Architecture?** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of What is Next.js & App Router Architecture?. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Next.js Documentation: App Router')?._id,
  });

  const nextL1_Challenge = await ChallengeModel.create({
    title: `Validate Next.js Route Structure`,
    description: `Implement \`validateNextRoutePath(folderPath)\` that returns \`true\` if path ends in \`page.tsx\` or \`page.js\`, else \`false\`.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function validateNextRoutePath(filePath) {
  // Your code here
  return false;
}

module.exports = validateNextRoutePath;
`,
    solutionCode: `function validateNextRoutePath(filePath) {
  if (!filePath || typeof filePath !== 'string') return false;
  return filePath.endsWith('/page.tsx') || filePath.endsWith('/page.js') || filePath === 'page.tsx' || filePath === 'page.js';
}

module.exports = validateNextRoutePath;
`,
    hints: ["Check if the file ends with page.tsx or page.js"],
    skills: [{"skillId": "nextjs-app-router", "weight": 1.0}],
    testCases: [{"input": "[\"app/dashboard/page.tsx\"]", "expectedOutput": "true", "description": "Validates page route", "hidden": false}],
  });

  const nextL1_Practice = await ActivityModel.create({
    lessonId: nextL1._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Validate Next.js Route Structure`,
    order: 3,
    challengeRef: nextL1_Challenge._id,
    content: `# Code Practice: Validate Next.js Route Structure\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  nextL1_Challenge.activityId = nextL1_Practice._id;
  await nextL1_Challenge.save();

  const nextL1_Quiz = await AssessmentModel.create({
    title: `Assessment: Next.js Foundations`,
    description: `Verify core architectural understanding of Next.js.`,
    passingScore: 70,
    skills: [{"skillId": "nextjs-app-router", "weight": 1.0}],
    questions: [
    {
        "question": "What is the primary file required inside an app/ folder to make it a publicly accessible URL route?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "index.html",
            "page.tsx / page.js",
            "route.config.js",
            "app.tsx"
        ],
        "correctOption": 1,
        "explanation": "In Next.js App Router, page.tsx defines the unique UI for that route segment.",
        "points": 10
    }
],
  });

  const nextL1_Assessment = await ActivityModel.create({
    lessonId: nextL1._id,
    type: 'QUIZ',
    title: `Assessment: Next.js Foundations`,
    order: 4,
    assessmentRef: nextL1_Quiz._id,
  });
  nextL1_Quiz.activityId = nextL1_Assessment._id;
  await nextL1_Quiz.save();

  nextL1.activities = [
    nextL1_Video._id,
    nextL1_Notes._id,
    nextL1_Practice._id,
    nextL1_Assessment._id,
  ] as any;
  await nextL1.save();

  // --- Lesson 2: Root Layouts, Template & Page Hierarchy ---
  const nextL2 = await LessonModel.create({
    moduleId: nextMod1._id,
    courseId: nextCourse._id,
    title: `Root Layouts, Template & Page Hierarchy`,
    description: `Master layout nesting, shared navigation bars, and persistent state across page transitions.`,
    order: 2,
    activities: [],
  });

  const nextL2_Video = await ActivityModel.create({
    lessonId: nextL2._id,
    type: 'VIDEO',
    title: `Video: Next.js Layouts & Nested Templates`,
    order: 1,
    resourceRef: getRes('Next.js App Router Setup and Structure in Tamil')?._id,
    content: `# Layout Hierarchy:\\n- Root layout (app/layout.tsx) wraps all pages.\\n- Layouts preserve state and do not re-render on navigation.`,
  });

  const nextL2_Notes = await ActivityModel.create({
    lessonId: nextL2._id,
    type: 'NOTES',
    title: `Codexa Notes: Root Layouts, Template & Page Hierarchy`,
    order: 2,
    content: `# Root Layouts, Template & Page Hierarchy

Master layout nesting, shared navigation bars, and persistent state across page transitions.

- \`layout.tsx\`: Wraps child pages and preserves state across route transitions.
- \`template.tsx\`: Similar to layout, but creates a new instance on navigation (re-mounts).
- \`loading.tsx\`: Instant fallback UI using React Suspense.
- \`error.tsx\`: React Error Boundary for isolated segment error handling.

## Why Root Layouts, Template & Page Hierarchy Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`javascript
function wrapWithLayout(layoutName, content) {
  return \`<\${layoutName}>\${content}</\${layoutName}>\`;
}

module.exports = wrapWithLayout;
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Format string with JSX tags.

> ⚠️ **Common Mistake**: Templates create a fresh instance on navigation, re-running effects and resetting state.

## Real-World Production Scenario

In production engineering, **Root Layouts, Template & Page Hierarchy** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Root Layouts, Template & Page Hierarchy. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Next.js Documentation: App Router')?._id,
  });

  const nextL2_Challenge = await ChallengeModel.create({
    title: `Nest Layout Elements Simulator`,
    description: `Implement \`wrapWithLayout(layoutName, content)\` returning \`<\${layoutName}>\${content}</\${layoutName}>\`.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function wrapWithLayout(layoutName, content) {
  // Your code here
  return '';
}

module.exports = wrapWithLayout;
`,
    solutionCode: `function wrapWithLayout(layoutName, content) {
  return \`<\${layoutName}>\${content}</\${layoutName}>\`;
}

module.exports = wrapWithLayout;
`,
    hints: ["Format string with JSX tags."],
    skills: [{"skillId": "nextjs-app-router", "weight": 1.0}],
    testCases: [{"input": "[\"RootLayout\", \"<h1>Home</h1>\"]", "expectedOutput": "\"<RootLayout><h1>Home</h1></RootLayout>\"", "description": "Wraps content in layout tags", "hidden": false}],
  });

  const nextL2_Practice = await ActivityModel.create({
    lessonId: nextL2._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Nest Layout Elements Simulator`,
    order: 3,
    challengeRef: nextL2_Challenge._id,
    content: `# Code Practice: Nest Layout Elements Simulator\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  nextL2_Challenge.activityId = nextL2_Practice._id;
  await nextL2_Challenge.save();

  const nextL2_Quiz = await AssessmentModel.create({
    title: `Assessment: Next.js Layout Mechanics`,
    description: `Test understanding of layout persistence and nesting.`,
    passingScore: 70,
    skills: [{"skillId": "nextjs-app-router", "weight": 1.0}],
    questions: [
    {
        "question": "What is the key difference between layout.tsx and template.tsx in Next.js App Router?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "layout.tsx runs only on client; template runs on server",
            "layout.tsx preserves state on navigation, while template.tsx re-mounts on every route change",
            "layout.tsx is deprecated",
            "template.tsx cannot receive children"
        ],
        "correctOption": 1,
        "explanation": "Templates create a fresh instance on navigation, re-running effects and resetting state.",
        "points": 10
    }
],
  });

  const nextL2_Assessment = await ActivityModel.create({
    lessonId: nextL2._id,
    type: 'QUIZ',
    title: `Assessment: Next.js Layout Mechanics`,
    order: 4,
    assessmentRef: nextL2_Quiz._id,
  });
  nextL2_Quiz.activityId = nextL2_Assessment._id;
  await nextL2_Quiz.save();

  nextL2.activities = [
    nextL2_Video._id,
    nextL2_Notes._id,
    nextL2_Practice._id,
    nextL2_Assessment._id,
  ] as any;
  await nextL2.save();

  nextMod1.lessons = [nextL1._id, nextL2._id] as any;
  await nextMod1.save();

  const nextMod2 = await ModuleModel.create({
    courseId: nextCourse._id,
    title: `Module 2: Routing, Dynamic Segments & Navigation`,
    description: `Static routes, dynamic segments [slug], catch-all routes [...slug], route groups and Link prefetching.`,
    order: 2,
    lessons: [],
  });

  // --- Lesson 1: Dynamic Routes & Parameter Extraction ---
  const nextL3 = await LessonModel.create({
    moduleId: nextMod2._id,
    courseId: nextCourse._id,
    title: `Dynamic Routes & Parameter Extraction`,
    description: `Extract route parameters using [id] and [slug] folder naming conventions.`,
    order: 1,
    activities: [],
  });

  const nextL3_Video = await ActivityModel.create({
    lessonId: nextL3._id,
    type: 'VIDEO',
    title: `Video: Next.js Dynamic Route Segments`,
    order: 1,
    resourceRef: getRes('Next.js 15 File-System Routing in Tamil')?._id,
    content: `# Dynamic Segments:\\n- Folder [id] passes params.id to page props.\\n- Catch-all [...slug] matches multiple path levels.`,
  });

  const nextL3_Notes = await ActivityModel.create({
    lessonId: nextL3._id,
    type: 'NOTES',
    title: `Codexa Notes: Dynamic Routes & Parameter Extraction`,
    order: 2,
    content: `# Dynamic Routes & Parameter Extraction

Extract route parameters using [id] and [slug] folder naming conventions.

To create dynamic routes based on IDs or slugs:
- \`app/blog/[slug]/page.tsx\` -> Matches \`/blog/first-post\`, \`/blog/nextjs-guide\`.
- Page component receives \`params\`:

\`\`\`tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>Post: {params.slug}</h1>;
}
\`\`\`

## Why Dynamic Routes & Parameter Extraction Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Split pattern and url by '/' and extract matching brackets.

> ⚠️ **Common Mistake**: [...slug] captures all subsequent route segments as an array of strings.

## Real-World Production Scenario

In production engineering, **Dynamic Routes & Parameter Extraction** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Dynamic Routes & Parameter Extraction. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Next.js Documentation: App Router')?._id,
  });

  const nextL3_Challenge = await ChallengeModel.create({
    title: `Extract Dynamic Route Parameters`,
    description: `Implement \`extractRouteParams(pattern, url)\` where pattern \`'/courses/[courseId]/lessons/[lessonId]'\` and url \`'/courses/next-js/lessons/intro'\` returns \`{ courseId: 'next-js', lessonId: 'intro' }\`.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function extractRouteParams(pattern, url) {
  // Your code here
  return {};
}

module.exports = extractRouteParams;
`,
    solutionCode: `function extractRouteParams(pattern, url) {
  const pParts = pattern.split('/').filter(Boolean);
  const uParts = url.split('/').filter(Boolean);
  if (pParts.length !== uParts.length) return null;
  const params = {};
  for (let i = 0; i < pParts.length; i++) {
    if (pParts[i].startsWith('[') && pParts[i].endsWith(']')) {
      const key = pParts[i].slice(1, -1);
      params[key] = uParts[i];
    } else if (pParts[i] !== uParts[i]) {
      return null;
    }
  }
  return params;
}

module.exports = extractRouteParams;
`,
    hints: ["Split pattern and url by '/' and extract matching brackets."],
    skills: [{"skillId": "nextjs-app-router", "weight": 1.0}],
    testCases: [{"input": "[\"/courses/[slug]\", \"/courses/nextjs\"]", "expectedOutput": "{\"slug\":\"nextjs\"}", "description": "Extracts slug param", "hidden": false}],
  });

  const nextL3_Practice = await ActivityModel.create({
    lessonId: nextL3._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Extract Dynamic Route Parameters`,
    order: 3,
    challengeRef: nextL3_Challenge._id,
    content: `# Code Practice: Extract Dynamic Route Parameters\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  nextL3_Challenge.activityId = nextL3_Practice._id;
  await nextL3_Challenge.save();

  const nextL3_Quiz = await AssessmentModel.create({
    title: `Assessment: Dynamic Route Segments`,
    description: `Test parameter handling in Next.js routes.`,
    passingScore: 70,
    skills: [{"skillId": "nextjs-app-router", "weight": 1.0}],
    questions: [
    {
        "question": "What folder name is used in Next.js to match catch-all route segments (e.g. /docs/a/b/c)?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "(docs)",
            "[...slug]",
            "[slug]*",
            "/*slug/"
        ],
        "correctOption": 1,
        "explanation": "[...slug] captures all subsequent route segments as an array of strings.",
        "points": 10
    }
],
  });

  const nextL3_Assessment = await ActivityModel.create({
    lessonId: nextL3._id,
    type: 'QUIZ',
    title: `Assessment: Dynamic Route Segments`,
    order: 4,
    assessmentRef: nextL3_Quiz._id,
  });
  nextL3_Quiz.activityId = nextL3_Assessment._id;
  await nextL3_Quiz.save();

  nextL3.activities = [
    nextL3_Video._id,
    nextL3_Notes._id,
    nextL3_Practice._id,
    nextL3_Assessment._id,
  ] as any;
  await nextL3.save();

  // --- Lesson 2: Route Groups & Client Navigation with next/link ---
  const nextL4 = await LessonModel.create({
    moduleId: nextMod2._id,
    courseId: nextCourse._id,
    title: `Route Groups & Client Navigation with next/link`,
    description: `Organize routes without affecting URLs using (group) and optimize navigation with Link prefetching.`,
    order: 2,
    activities: [],
  });

  const nextL4_Video = await ActivityModel.create({
    lessonId: nextL4._id,
    type: 'VIDEO',
    title: `Video: Next.js Route Groups & Link Prefetching`,
    order: 1,
    resourceRef: getRes('Next.js Nested Routing and Layout Hierarchies in Tamil')?._id,
    content: `# Route Groups & Links:\\n- (marketing) groups routes without adding '/marketing' to the URL.\\n- <Link> automatically prefetches route code when in viewport.`,
  });

  const nextL4_Notes = await ActivityModel.create({
    lessonId: nextL4._id,
    type: 'NOTES',
    title: `Codexa Notes: Route Groups & Client Navigation with next/link`,
    order: 2,
    content: `# Route Groups & Client Navigation with next/link

Organize routes without affecting URLs using (group) and optimize navigation with Link prefetching.

- \`(marketing)/about/page.tsx\` -> URL is \`/about\`.
- \`(dashboard)/analytics/page.tsx\` -> URL is \`/analytics\`.
- \`<Link href="/dashboard">\`: Performs client-side transitions with automatic background prefetching.

## Why Route Groups & Client Navigation with next/link Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`javascript
function cleanRouteGroupPath(path) {
  if (!path) return '';
  return path.split('/').filter(p => !p.startsWith('(') || !p.endsWith(')')).join('/') || '/';
}

module.exports = cleanRouteGroupPath;
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Filter out segments starting with ( and ending with )

> ⚠️ **Common Mistake**: Route groups let you group files without affecting the URL structure.

## Real-World Production Scenario

In production engineering, **Route Groups & Client Navigation with next/link** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Route Groups & Client Navigation with next/link. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Next.js Documentation: App Router')?._id,
  });

  const nextL4_Challenge = await ChallengeModel.create({
    title: `Strip Route Groups from URL`,
    description: `Implement \`cleanRouteGroupPath(path)\` that strips parenthesized segments (e.g. \`'/(marketing)/about'\` -> \`'/about'\`).`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function cleanRouteGroupPath(path) {
  // Your code here
  return '';
}

module.exports = cleanRouteGroupPath;
`,
    solutionCode: `function cleanRouteGroupPath(path) {
  if (!path) return '';
  return path.split('/').filter(p => !p.startsWith('(') || !p.endsWith(')')).join('/') || '/';
}

module.exports = cleanRouteGroupPath;
`,
    hints: ["Filter out segments starting with ( and ending with )"],
    skills: [{"skillId": "nextjs-app-router", "weight": 1.0}],
    testCases: [{"input": "[\"/(marketing)/about\"]", "expectedOutput": "\"/about\"", "description": "Strips route group", "hidden": false}],
  });

  const nextL4_Practice = await ActivityModel.create({
    lessonId: nextL4._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Strip Route Groups from URL`,
    order: 3,
    challengeRef: nextL4_Challenge._id,
    content: `# Code Practice: Strip Route Groups from URL\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  nextL4_Challenge.activityId = nextL4_Practice._id;
  await nextL4_Challenge.save();

  const nextL4_Quiz = await AssessmentModel.create({
    title: `Assessment: Route Groups & Links`,
    description: `Test route organization knowledge.`,
    passingScore: 70,
    skills: [{"skillId": "nextjs-app-router", "weight": 1.0}],
    questions: [
    {
        "question": "What is the primary purpose of route groups named with parentheses like (admin)?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "To password protect pages",
            "To organize routes and layouts without adding the group name to URL path",
            "To disable server-side rendering",
            "To enable web workers"
        ],
        "correctOption": 1,
        "explanation": "Route groups let you group files without affecting the URL structure.",
        "points": 10
    }
],
  });

  const nextL4_Assessment = await ActivityModel.create({
    lessonId: nextL4._id,
    type: 'QUIZ',
    title: `Assessment: Route Groups & Links`,
    order: 4,
    assessmentRef: nextL4_Quiz._id,
  });
  nextL4_Quiz.activityId = nextL4_Assessment._id;
  await nextL4_Quiz.save();

  nextL4.activities = [
    nextL4_Video._id,
    nextL4_Notes._id,
    nextL4_Practice._id,
    nextL4_Assessment._id,
  ] as any;
  await nextL4.save();

  nextMod2.lessons = [nextL3._id, nextL4._id] as any;
  await nextMod2.save();

  const nextMod3 = await ModuleModel.create({
    courseId: nextCourse._id,
    title: `Module 3: Server vs Client Components`,
    description: `React Server Components mental model, client boundaries, 'use client', and serialization.`,
    order: 3,
    lessons: [],
  });

  // --- Lesson 1: React Server Components (RSC) vs Client Components ---
  const nextL5 = await LessonModel.create({
    moduleId: nextMod3._id,
    courseId: nextCourse._id,
    title: `React Server Components (RSC) vs Client Components`,
    description: `Understand why Server Components stay on the server and how client components opt-in with 'use client'.`,
    order: 1,
    activities: [],
  });

  const nextL5_Video = await ActivityModel.create({
    lessonId: nextL5._id,
    type: 'VIDEO',
    title: `Video: Server vs Client Components Deep Dive`,
    order: 1,
    resourceRef: getRes('Next.js 14 Full Course: Server Components & Actions')?._id,
    content: `# Server vs Client:\\n- Server Components render on the server, have direct DB access, and send 0KB JS bundle.\\n- Client Components use 'use client' for browser events (onClick) and hooks (useState).`,
  });

  const nextL5_Notes = await ActivityModel.create({
    lessonId: nextL5._id,
    type: 'NOTES',
    title: `Codexa Notes: React Server Components (RSC) vs Client Components`,
    order: 2,
    content: `# React Server Components (RSC) vs Client Components

Understand why Server Components stay on the server and how client components opt-in with 'use client'.

By default, all components inside the \`app/\` directory are **Server Components**.

| Feature | Server Component | Client Component |
|---|---|---|
| Direct DB / Secret Access | Yes | No |
| Bundle size sent to client | 0 KB | Included |
| \`useState\`, \`useEffect\` | No | Yes |
| \`onClick\`, \`onChange\` events | No | Yes |
| Directive | Default | \`'use client'\` |

## Why React Server Components (RSC) vs Client Components Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`javascript
function classifyComponent(code) {
  if (!code || typeof code !== 'string') return 'SERVER';
  if (code.includes('use client') || code.includes('useState') || code.includes('useEffect') || code.includes('onClick')) {
    return 'CLIENT';
  }
  return 'SERVER';
}

module.exports = classifyComponent;
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Check for 'use client' or browser hooks.

> ⚠️ **Common Mistake**: 'use client' must sit at the top of the file before any imports to designate the boundary.

## Real-World Production Scenario

In production engineering, **React Server Components (RSC) vs Client Components** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of React Server Components (RSC) vs Client Components. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Next.js Documentation: App Router')?._id,
  });

  const nextL5_Challenge = await ChallengeModel.create({
    title: `Classify Component Execution Target`,
    description: `Implement \`classifyComponent(code)\` that checks if code contains \`'use client'\` or uses \`useState/useEffect\`, returning \`'CLIENT'\` or \`'SERVER'\`.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function classifyComponent(code) {
  // Your code here
  return 'SERVER';
}

module.exports = classifyComponent;
`,
    solutionCode: `function classifyComponent(code) {
  if (!code || typeof code !== 'string') return 'SERVER';
  if (code.includes('use client') || code.includes('useState') || code.includes('useEffect') || code.includes('onClick')) {
    return 'CLIENT';
  }
  return 'SERVER';
}

module.exports = classifyComponent;
`,
    hints: ["Check for 'use client' or browser hooks."],
    skills: [{"skillId": "nextjs-app-router", "weight": 1.0}],
    testCases: [{"input": "[\"'use client'; export default function Button() { return <button onClick={()=>{}}>Click</button>; }\"]", "expectedOutput": "\"CLIENT\"", "description": "Detects client component", "hidden": false}],
  });

  const nextL5_Practice = await ActivityModel.create({
    lessonId: nextL5._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Classify Component Execution Target`,
    order: 3,
    challengeRef: nextL5_Challenge._id,
    content: `# Code Practice: Classify Component Execution Target\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  nextL5_Challenge.activityId = nextL5_Practice._id;
  await nextL5_Challenge.save();

  const nextL5_Quiz = await AssessmentModel.create({
    title: `Assessment: Server & Client Components`,
    description: `Test boundary rules between RSC and Client components.`,
    passingScore: 70,
    skills: [{"skillId": "nextjs-app-router", "weight": 1.0}],
    questions: [
    {
        "question": "Where does the 'use client' directive belong in a Client Component file?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Inside package.json",
            "At the very top of the file, before any imports",
            "Inside the export statement",
            "At the bottom of layout.tsx"
        ],
        "correctOption": 1,
        "explanation": "'use client' must sit at the top of the file before any imports to designate the boundary.",
        "points": 10
    }
],
  });

  const nextL5_Assessment = await ActivityModel.create({
    lessonId: nextL5._id,
    type: 'QUIZ',
    title: `Assessment: Server & Client Components`,
    order: 4,
    assessmentRef: nextL5_Quiz._id,
  });
  nextL5_Quiz.activityId = nextL5_Assessment._id;
  await nextL5_Quiz.save();

  nextL5.activities = [
    nextL5_Video._id,
    nextL5_Notes._id,
    nextL5_Practice._id,
    nextL5_Assessment._id,
  ] as any;
  await nextL5.save();

  // --- Lesson 2: Passing Props Across the Server-Client Boundary ---
  const nextL6 = await LessonModel.create({
    moduleId: nextMod3._id,
    courseId: nextCourse._id,
    title: `Passing Props Across the Server-Client Boundary`,
    description: `Serialize props, pass children to client components, and maintain composition patterns.`,
    order: 2,
    activities: [],
  });

  const nextL6_Video = await ActivityModel.create({
    lessonId: nextL6._id,
    type: 'VIDEO',
    title: `Video: Composition Patterns with Server and Client Components`,
    order: 1,
    resourceRef: getRes('Next.js 14 Full Course: Server Components & Actions')?._id,
    content: `# Boundary Composition:\\n- Pass Server Components as children into Client Components.\\n- Props across boundary must be serializable.`,
  });

  const nextL6_Notes = await ActivityModel.create({
    lessonId: nextL6._id,
    type: 'NOTES',
    title: `Codexa Notes: Passing Props Across the Server-Client Boundary`,
    order: 2,
    content: `# Passing Props Across the Server-Client Boundary

Serialize props, pass children to client components, and maintain composition patterns.

You cannot import a Server Component directly into a Client Component. Instead, pass it as a \`children\` prop:

\`\`\`tsx
// ClientWrapper.tsx ('use client')
export default function ClientWrapper({ children }) {
  const [open, setOpen] = useState(false);
  return <div>{open && children}</div>;
}

// page.tsx (Server Component)
export default function Page() {
  return (
    <ClientWrapper>
      <ServerDatabaseList />
    </ClientWrapper>
  );
}
\`\`\`

## Why Passing Props Across the Server-Client Boundary Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Functions cannot be passed across server-client boundaries.

> ⚠️ **Common Mistake**: Non-serializable values like standard functions cannot cross the RSC boundary.

## Real-World Production Scenario

In production engineering, **Passing Props Across the Server-Client Boundary** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Passing Props Across the Server-Client Boundary. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Next.js Documentation: App Router')?._id,
  });

  const nextL6_Challenge = await ChallengeModel.create({
    title: `Validate Serializable Boundary Props`,
    description: `Implement \`isSerializableProp(val)\` that returns \`true\` for primitives, plain objects and arrays, but \`false\` for functions or class instances.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function isSerializableProp(val) {
  // Your code here
  return false;
}

module.exports = isSerializableProp;
`,
    solutionCode: `function isSerializableProp(val) {
  if (typeof val === 'function' || typeof val === 'symbol') return false;
  try {
    JSON.stringify(val);
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = isSerializableProp;
`,
    hints: ["Functions cannot be passed across server-client boundaries."],
    skills: [{"skillId": "nextjs-app-router", "weight": 1.0}],
    testCases: [{"input": "[{\"title\": \"Next.js\", \"id\": 10}]", "expectedOutput": "true", "description": "Serializes plain object", "hidden": false}],
  });

  const nextL6_Practice = await ActivityModel.create({
    lessonId: nextL6._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Validate Serializable Boundary Props`,
    order: 3,
    challengeRef: nextL6_Challenge._id,
    content: `# Code Practice: Validate Serializable Boundary Props\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  nextL6_Challenge.activityId = nextL6_Practice._id;
  await nextL6_Challenge.save();

  const nextL6_Quiz = await AssessmentModel.create({
    title: `Assessment: Server/Client Boundary Rules`,
    description: `Test boundary composition rules.`,
    passingScore: 70,
    skills: [{"skillId": "nextjs-app-router", "weight": 1.0}],
    questions: [
    {
        "question": "Can you pass an async JavaScript function prop directly from a Server Component to a Client Component?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Yes, all functions serialize over JSON",
            "No, functions cannot be serialized across the server/client boundary unless declared as Server Actions",
            "Yes, but only in development mode",
            "Only with Redux"
        ],
        "correctOption": 1,
        "explanation": "Non-serializable values like standard functions cannot cross the RSC boundary.",
        "points": 10
    }
],
  });

  const nextL6_Assessment = await ActivityModel.create({
    lessonId: nextL6._id,
    type: 'QUIZ',
    title: `Assessment: Server/Client Boundary Rules`,
    order: 4,
    assessmentRef: nextL6_Quiz._id,
  });
  nextL6_Quiz.activityId = nextL6_Assessment._id;
  await nextL6_Quiz.save();

  nextL6.activities = [
    nextL6_Video._id,
    nextL6_Notes._id,
    nextL6_Practice._id,
    nextL6_Assessment._id,
  ] as any;
  await nextL6.save();

  nextMod3.lessons = [nextL5._id, nextL6._id] as any;
  await nextMod3.save();

  const nextMod4 = await ModuleModel.create({
    courseId: nextCourse._id,
    title: `Module 4: Data Fetching, Caching & Server Actions`,
    description: `Async Server Components, fetch caching options, on-demand revalidation, and Server Actions for form mutations.`,
    order: 4,
    lessons: [],
  });

  // --- Lesson 1: Data Fetching in Server Components & Caching ---
  const nextL7 = await LessonModel.create({
    moduleId: nextMod4._id,
    courseId: nextCourse._id,
    title: `Data Fetching in Server Components & Caching`,
    description: `Fetch data directly in async components with fetch caching: force-cache vs no-store.`,
    order: 1,
    activities: [],
  });

  const nextL7_Video = await ActivityModel.create({
    lessonId: nextL7._id,
    type: 'VIDEO',
    title: `Video: Next.js 14 Data Fetching & Caching Explained`,
    order: 1,
    resourceRef: getRes('Next.js 14 Full Course: Server Components & Actions')?._id,
    content: `# Data Fetching:\\n- Server Components can be async functions.\\n- Next.js extends native fetch with { cache: 'no-store' } or { next: { revalidate: 60 } }.`,
  });

  const nextL7_Notes = await ActivityModel.create({
    lessonId: nextL7._id,
    type: 'NOTES',
    title: `Codexa Notes: Data Fetching in Server Components & Caching`,
    order: 2,
    content: `# Data Fetching in Server Components & Caching

Fetch data directly in async components with fetch caching: force-cache vs no-store.

Server Components allow direct async/await data fetching:

\`\`\`tsx
export default async function ProductsPage() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 } // Revalidate every hour
  });
  const products = await res.json();
  return <div>{products.map(p => <div key={p.id}>{p.name}</div>)}</div>;
}
\`\`\`

## Why Data Fetching in Server Components & Caching Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Return appropriate cache or next.revalidate object.

> ⚠️ **Common Mistake**: cache: 'no-store' disables caching and fetches fresh data on every request.

## Real-World Production Scenario

In production engineering, **Data Fetching in Server Components & Caching** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Data Fetching in Server Components & Caching. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Next.js Documentation: App Router')?._id,
  });

  const nextL7_Challenge = await ChallengeModel.create({
    title: `Build Cache Header Configuration`,
    description: `Implement \`getFetchConfig(strategy, revalidateSeconds)\` returning \`{ cache: 'no-store' }\` for 'dynamic', \`{ cache: 'force-cache' }\` for 'static', and \`{ next: { revalidate: N } }\` for 'isr'.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function getFetchConfig(strategy, revalidateSeconds = 60) {
  // Your code here
  return {};
}

module.exports = getFetchConfig;
`,
    solutionCode: `function getFetchConfig(strategy, revalidateSeconds = 60) {
  if (strategy === 'dynamic') return { cache: 'no-store' };
  if (strategy === 'static') return { cache: 'force-cache' };
  if (strategy === 'isr') return { next: { revalidate: revalidateSeconds } };
  return { cache: 'force-cache' };
}

module.exports = getFetchConfig;
`,
    hints: ["Return appropriate cache or next.revalidate object."],
    skills: [{"skillId": "nextjs-app-router", "weight": 1.0}],
    testCases: [{"input": "[\"dynamic\"]", "expectedOutput": "{\"cache\":\"no-store\"}", "description": "Returns dynamic cache config", "hidden": false}],
  });

  const nextL7_Practice = await ActivityModel.create({
    lessonId: nextL7._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Build Cache Header Configuration`,
    order: 3,
    challengeRef: nextL7_Challenge._id,
    content: `# Code Practice: Build Cache Header Configuration\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  nextL7_Challenge.activityId = nextL7_Practice._id;
  await nextL7_Challenge.save();

  const nextL7_Quiz = await AssessmentModel.create({
    title: `Assessment: Next.js Fetch Caching`,
    description: `Test understanding of fetch cache strategies.`,
    passingScore: 70,
    skills: [{"skillId": "nextjs-app-router", "weight": 1.0}],
    questions: [
    {
        "question": "Which fetch option ensures fresh data is fetched on every incoming user request?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "{ cache: 'force-cache' }",
            "{ cache: 'no-store' }",
            "{ next: { tags: ['all'] } }",
            "{ method: 'CACHE' }"
        ],
        "correctOption": 1,
        "explanation": "cache: 'no-store' disables caching and fetches fresh data on every request.",
        "points": 10
    }
],
  });

  const nextL7_Assessment = await ActivityModel.create({
    lessonId: nextL7._id,
    type: 'QUIZ',
    title: `Assessment: Next.js Fetch Caching`,
    order: 4,
    assessmentRef: nextL7_Quiz._id,
  });
  nextL7_Quiz.activityId = nextL7_Assessment._id;
  await nextL7_Quiz.save();

  nextL7.activities = [
    nextL7_Video._id,
    nextL7_Notes._id,
    nextL7_Practice._id,
    nextL7_Assessment._id,
  ] as any;
  await nextL7.save();

  // --- Lesson 2: Server Actions & Form Mutations ---
  const nextL8 = await LessonModel.create({
    moduleId: nextMod4._id,
    courseId: nextCourse._id,
    title: `Server Actions & Form Mutations`,
    description: `Mutate server state with 'use server' functions without manual API routes.`,
    order: 2,
    activities: [],
  });

  const nextL8_Video = await ActivityModel.create({
    lessonId: nextL8._id,
    type: 'VIDEO',
    title: `Video: Next.js Server Actions Full Guide`,
    order: 1,
    resourceRef: getRes('Next.js 14 Full Course: Server Components & Actions')?._id,
    content: `# Server Actions:\\n- Functions marked with 'use server' execute securely on the backend.\\n- Call revalidatePath('/route') after mutations to update cached UI.`,
  });

  const nextL8_Notes = await ActivityModel.create({
    lessonId: nextL8._id,
    type: 'NOTES',
    title: `Codexa Notes: Server Actions & Form Mutations`,
    order: 2,
    content: `# Server Actions & Form Mutations

Mutate server state with 'use server' functions without manual API routes.

Server Actions are asynchronous server functions invoked from forms or event handlers:

\`\`\`tsx
// actions.ts
'use server';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  await db.post.create({ data: { title } });
  revalidatePath('/posts');
}
\`\`\`

## Why Server Actions & Form Mutations Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Iterate over entries and assign trimmed strings.

> ⚠️ **Common Mistake**: revalidatePath and revalidateTag clear server cache for specified paths/tags.

## Real-World Production Scenario

In production engineering, **Server Actions & Form Mutations** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Server Actions & Form Mutations. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Next.js Documentation: App Router')?._id,
  });

  const nextL8_Challenge = await ChallengeModel.create({
    title: `Parse Form Data in Server Action`,
    description: `Implement \`parseFormData(entries)\` that converts an array of \`[key, val]\` tuples into an object with trimmed string values.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function parseFormData(entries) {
  // Your code here
  return {};
}

module.exports = parseFormData;
`,
    solutionCode: `function parseFormData(entries) {
  const result = {};
  if (!Array.isArray(entries)) return result;
  for (const [k, v] of entries) {
    result[k] = typeof v === 'string' ? v.trim() : v;
  }
  return result;
}

module.exports = parseFormData;
`,
    hints: ["Iterate over entries and assign trimmed strings."],
    skills: [{"skillId": "nextjs-app-router", "weight": 1.0}],
    testCases: [{"input": "[[[\"title\", \" Next.js \"]]]", "expectedOutput": "{\"title\":\"Next.js\"}", "description": "Trims form entry values", "hidden": false}],
  });

  const nextL8_Practice = await ActivityModel.create({
    lessonId: nextL8._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Parse Form Data in Server Action`,
    order: 3,
    challengeRef: nextL8_Challenge._id,
    content: `# Code Practice: Parse Form Data in Server Action\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  nextL8_Challenge.activityId = nextL8_Practice._id;
  await nextL8_Challenge.save();

  const nextL8_Quiz = await AssessmentModel.create({
    title: `Assessment: Server Actions`,
    description: `Test understanding of Server Actions and cache revalidation.`,
    passingScore: 70,
    skills: [{"skillId": "nextjs-app-router", "weight": 1.0}],
    questions: [
    {
        "question": "What function is called inside a Server Action to purge cached pages and refresh data on client screens?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "router.refresh()",
            "revalidatePath() / revalidateTag()",
            "window.location.reload()",
            "cache.clear()"
        ],
        "correctOption": 1,
        "explanation": "revalidatePath and revalidateTag clear server cache for specified paths/tags.",
        "points": 10
    }
],
  });

  const nextL8_Assessment = await ActivityModel.create({
    lessonId: nextL8._id,
    type: 'QUIZ',
    title: `Assessment: Server Actions`,
    order: 4,
    assessmentRef: nextL8_Quiz._id,
  });
  nextL8_Quiz.activityId = nextL8_Assessment._id;
  await nextL8_Quiz.save();

  nextL8.activities = [
    nextL8_Video._id,
    nextL8_Notes._id,
    nextL8_Practice._id,
    nextL8_Assessment._id,
  ] as any;
  await nextL8.save();

  nextMod4.lessons = [nextL7._id, nextL8._id] as any;
  await nextMod4.save();

  const nextMod5 = await ModuleModel.create({
    courseId: nextCourse._id,
    title: `Module 5: Route Handlers & Full-Stack Deployment`,
    description: `API Route Handlers route.ts, GET/POST methods, cookies, headers, and production deployment.`,
    order: 5,
    lessons: [],
  });

  // --- Lesson 1: API Route Handlers (GET, POST, PATCH, DELETE) ---
  const nextL9 = await LessonModel.create({
    moduleId: nextMod5._id,
    courseId: nextCourse._id,
    title: `API Route Handlers (GET, POST, PATCH, DELETE)`,
    description: `Build backend endpoints using standard Web Request and NextResponse objects.`,
    order: 1,
    activities: [],
  });

  const nextL9_Video = await ActivityModel.create({
    lessonId: nextL9._id,
    type: 'VIDEO',
    title: `Video: Next.js 14 API Route Handlers`,
    order: 1,
    resourceRef: getRes('Next.js 14 Full Course: Server Components & Actions')?._id,
    content: `# Route Handlers:\\n- route.ts exports named functions: GET, POST, PUT, DELETE.\\n- Use NextResponse.json() to return typed JSON responses.`,
  });

  const nextL9_Notes = await ActivityModel.create({
    lessonId: nextL9._id,
    type: 'NOTES',
    title: `Codexa Notes: API Route Handlers (GET, POST, PATCH, DELETE)`,
    order: 2,
    content: `# API Route Handlers (GET, POST, PATCH, DELETE)

Build backend endpoints using standard Web Request and NextResponse objects.

Create RESTful APIs inside \`app/api/route.ts\`:

\`\`\`typescript
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  return NextResponse.json({ query, status: 'OK' });
}
\`\`\`

## Why API Route Handlers (GET, POST, PATCH, DELETE) Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use new URL(urlStr).searchParams

> ⚠️ **Common Mistake**: Route.ts and page.tsx cannot occupy the same route level because both attempt to handle the root URL.

## Real-World Production Scenario

In production engineering, **API Route Handlers (GET, POST, PATCH, DELETE)** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of API Route Handlers (GET, POST, PATCH, DELETE). In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Next.js Documentation: App Router')?._id,
  });

  const nextL9_Challenge = await ChallengeModel.create({
    title: `Build Route Handler URL Query Parser`,
    description: `Implement \`parseNextUrlQuery(urlStr)\` that extracts searchParams into a key-value object.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function parseNextUrlQuery(urlStr) {
  // Your code here
  return {};
}

module.exports = parseNextUrlQuery;
`,
    solutionCode: `function parseNextUrlQuery(urlStr) {
  try {
    const u = new URL(urlStr);
    const obj = {};
    u.searchParams.forEach((v, k) => { obj[k] = v; });
    return obj;
  } catch (err) {
    return {};
  }
}

module.exports = parseNextUrlQuery;
`,
    hints: ["Use new URL(urlStr).searchParams"],
    skills: [{"skillId": "nextjs-app-router", "weight": 1.0}],
    testCases: [{"input": "[\"https://codexa.dev/api/search?q=nextjs&page=2\"]", "expectedOutput": "{\"q\":\"nextjs\",\"page\":\"2\"}", "description": "Parses URL query parameters", "hidden": false}],
  });

  const nextL9_Practice = await ActivityModel.create({
    lessonId: nextL9._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Build Route Handler URL Query Parser`,
    order: 3,
    challengeRef: nextL9_Challenge._id,
    content: `# Code Practice: Build Route Handler URL Query Parser\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  nextL9_Challenge.activityId = nextL9_Practice._id;
  await nextL9_Challenge.save();

  const nextL9_Quiz = await AssessmentModel.create({
    title: `Assessment: Route Handlers`,
    description: `Test Route Handler architecture.`,
    passingScore: 70,
    skills: [{"skillId": "nextjs-app-router", "weight": 1.0}],
    questions: [
    {
        "question": "Can a page.tsx and a route.ts file exist at the exact same route segment level (e.g. app/users/)?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Yes, they work together automatically",
            "No, page.tsx and route.ts at the same folder level cause a route conflict error",
            "Yes, but only for GET requests",
            "Only in production"
        ],
        "correctOption": 1,
        "explanation": "Route.ts and page.tsx cannot occupy the same route level because both attempt to handle the root URL.",
        "points": 10
    }
],
  });

  const nextL9_Assessment = await ActivityModel.create({
    lessonId: nextL9._id,
    type: 'QUIZ',
    title: `Assessment: Route Handlers`,
    order: 4,
    assessmentRef: nextL9_Quiz._id,
  });
  nextL9_Quiz.activityId = nextL9_Assessment._id;
  await nextL9_Quiz.save();

  nextL9.activities = [
    nextL9_Video._id,
    nextL9_Notes._id,
    nextL9_Practice._id,
    nextL9_Assessment._id,
  ] as any;
  await nextL9.save();

  // --- Lesson 2: Production Builds, Environment Variables & Edge Deployment ---
  const nextL10 = await LessonModel.create({
    moduleId: nextMod5._id,
    courseId: nextCourse._id,
    title: `Production Builds, Environment Variables & Edge Deployment`,
    description: `Configure environment variables, analyze production build outputs, and deploy to Vercel/Node servers.`,
    order: 2,
    activities: [],
  });

  const nextL10_Video = await ActivityModel.create({
    lessonId: nextL10._id,
    type: 'VIDEO',
    title: `Video: Next.js Production Build Optimization & Deployment`,
    order: 1,
    resourceRef: getRes('Next.js 14 Full Course: Server Components & Actions')?._id,
    content: `# Production Deployment:\\n- Run next build to generate static pages and optimized server bundles.\\n- Prefix client variables with NEXT_PUBLIC_.`,
  });

  const nextL10_Notes = await ActivityModel.create({
    lessonId: nextL10._id,
    type: 'NOTES',
    title: `Codexa Notes: Production Builds, Environment Variables & Edge Deployment`,
    order: 2,
    content: `# Production Builds, Environment Variables & Edge Deployment

Configure environment variables, analyze production build outputs, and deploy to Vercel/Node servers.

- \`NEXT_PUBLIC_API_URL\`: Exposed to the browser/client components.
- \`DATABASE_URL\`, \`SECRET_KEY\`: Kept strictly on the server (never exposed to client bundle).
- \`next build\`: Generates static pages (○) and dynamic server-rendered routes (λ).

## Why Production Builds, Environment Variables & Edge Deployment Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`javascript
function filterClientEnvVars(envObj) {
  const result = {};
  if (!envObj || typeof envObj !== 'object') return result;
  for (const [k, v] of Object.entries(envObj)) {
    if (k.startsWith('NEXT_PUBLIC_')) {
      result[k] = v;
    }
  }
  return result;
}

module.exports = filterClientEnvVars;
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Filter keys starting with NEXT_PUBLIC_

> ⚠️ **Common Mistake**: NEXT_PUBLIC_ is the official Next.js prefix to safely expose variables to client components.

## Real-World Production Scenario

In production engineering, **Production Builds, Environment Variables & Edge Deployment** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Production Builds, Environment Variables & Edge Deployment. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Next.js Documentation: App Router')?._id,
  });

  const nextL10_Challenge = await ChallengeModel.create({
    title: `Sanitize Public Environment Variables`,
    description: `Implement \`filterClientEnvVars(envObj)\` that returns only keys starting with \`NEXT_PUBLIC_\`.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function filterClientEnvVars(envObj) {
  // Your code here
  return {};
}

module.exports = filterClientEnvVars;
`,
    solutionCode: `function filterClientEnvVars(envObj) {
  const result = {};
  if (!envObj || typeof envObj !== 'object') return result;
  for (const [k, v] of Object.entries(envObj)) {
    if (k.startsWith('NEXT_PUBLIC_')) {
      result[k] = v;
    }
  }
  return result;
}

module.exports = filterClientEnvVars;
`,
    hints: ["Filter keys starting with NEXT_PUBLIC_"],
    skills: [{"skillId": "nextjs-app-router", "weight": 1.0}],
    testCases: [{"input": "[{\"NEXT_PUBLIC_SITE\": \"Codexa\", \"DB_SECRET\": \"supersecret\"}]", "expectedOutput": "{\"NEXT_PUBLIC_SITE\":\"Codexa\"}", "description": "Filters client-safe env vars", "hidden": false}],
  });

  const nextL10_Practice = await ActivityModel.create({
    lessonId: nextL10._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Sanitize Public Environment Variables`,
    order: 3,
    challengeRef: nextL10_Challenge._id,
    content: `# Code Practice: Sanitize Public Environment Variables\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  nextL10_Challenge.activityId = nextL10_Practice._id;
  await nextL10_Challenge.save();

  const nextL10_Quiz = await AssessmentModel.create({
    title: `Assessment: Production Deployment & Env Security`,
    description: `Test security and build knowledge.`,
    passingScore: 70,
    skills: [{"skillId": "nextjs-app-router", "weight": 1.0}],
    questions: [
    {
        "question": "What prefix is required for an environment variable to be bundled into client-side browser JavaScript in Next.js?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "REACT_APP_",
            "NEXT_PUBLIC_",
            "CLIENT_ENV_",
            "PUBLIC_"
        ],
        "correctOption": 1,
        "explanation": "NEXT_PUBLIC_ is the official Next.js prefix to safely expose variables to client components.",
        "points": 10
    }
],
  });

  const nextL10_Assessment = await ActivityModel.create({
    lessonId: nextL10._id,
    type: 'QUIZ',
    title: `Assessment: Production Deployment & Env Security`,
    order: 4,
    assessmentRef: nextL10_Quiz._id,
  });
  nextL10_Quiz.activityId = nextL10_Assessment._id;
  await nextL10_Quiz.save();

  nextL10.activities = [
    nextL10_Video._id,
    nextL10_Notes._id,
    nextL10_Practice._id,
    nextL10_Assessment._id,
  ] as any;
  await nextL10.save();

  nextMod5.lessons = [nextL9._id, nextL10._id] as any;
  await nextMod5.save();

  nextCourse.modules = [nextMod1._id, nextMod2._id, nextMod3._id, nextMod4._id, nextMod5._id] as any;
  await nextCourse.save();

  // =========================================================================
  // 3. FRONTEND ENGINEERING FOUNDATIONS
  // =========================================================================
  const frontendCourse = await CourseModel.create({
    slug: 'frontend-development',
    title: 'Modern Frontend Engineering & Web Standards',
    description: 'Master HTML5 semantic architecture, modern CSS Flexbox and Grid layouts, responsive design, DOM events, and Web APIs.',
    domain: 'Web Development',
    level: 'BEGINNER',
    status: 'PUBLISHED',
    estimatedHours: 35,
    skillsCovered: ['html-css-semantics', 'dom-browser-apis', 'javascript-fundamentals'],
    prerequisites: ['Basic computer literacy'],
    modules: [],
  });

  const feMod1 = await ModuleModel.create({
    courseId: frontendCourse._id,
    title: `Module 1: Semantic HTML5 & Modern Layouts`,
    description: `Semantic markup, CSS Flexbox and CSS Grid layout engines.`,
    order: 1,
    lessons: [],
  });

  // --- Lesson 1: HTML5 Semantic Structure & Accessibility ---
  const feL1 = await LessonModel.create({
    moduleId: feMod1._id,
    courseId: frontendCourse._id,
    title: `HTML5 Semantic Structure & Accessibility`,
    description: `Master header, main, section, article, nav, and ARIA attributes for accessible web structure.`,
    order: 1,
    activities: [],
  });

  const feL1_Video = await ActivityModel.create({
    lessonId: feL1._id,
    type: 'VIDEO',
    title: `Video: HTML & Modern CSS Full Course for Beginners`,
    order: 1,
    resourceRef: getRes('Getting Started with HTML5 & VS Code in Tamil')?._id,
    content: `# Semantic HTML:\\n- Use <main>, <nav>, <article>, <aside> instead of generic <div> tags.\\n- Semantic tags enhance accessibility and search engine ranking.`,
  });

  const feL1_Notes = await ActivityModel.create({
    lessonId: feL1._id,
    type: 'NOTES',
    title: `Codexa Notes: HTML5 Semantic Structure & Accessibility`,
    order: 2,
    content: `# HTML5 Semantic Structure & Accessibility

Master header, main, section, article, nav, and ARIA attributes for accessible web structure.

Semantic elements clearly describe their meaning to both the browser and developer:
- \`<header>\`: Introduces a page or section.
- \`<nav>\`: Major navigation links.
- \`<main>\`: Primary content unique to the document.
- \`<article>\`: Self-contained, syndicatable content (e.g. blog post).
- \`<aside>\`: Tangentially related content (e.g. sidebar).
- \`<footer>\`: Author, copyright, or footer links.

## Why HTML5 Semantic Structure & Accessibility Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`javascript
function calculateSemanticScore(tags) {
  if (!Array.isArray(tags)) return 0;
  const semantics = new Set(['header', 'nav', 'main', 'article', 'aside', 'footer', 'section']);
  let score = 0;
  for (const t of tags) {
    if (semantics.has(t.toLowerCase())) score += 10;
    else if (t.toLowerCase() === 'div') score += 1;
  }
  return score;
}

module.exports = calculateSemanticScore;
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Count 10 for semantic elements and 1 for div.

> ⚠️ **Common Mistake**: <main> provides an accessible landmark for screen readers and SEO crawlers.

## Real-World Production Scenario

In production engineering, **HTML5 Semantic Structure & Accessibility** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of HTML5 Semantic Structure & Accessibility. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MDN Web Docs: HTML5 Semantic Elements')?._id,
  });

  const feL1_Challenge = await ChallengeModel.create({
    title: `Calculate Semantic Depth Score`,
    description: `Implement \`calculateSemanticScore(htmlTags)\` where semantic tags (\`['header','nav','main','article','aside','footer']\`) earn 10 points each, while generic \`div\` earns 1 point.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function calculateSemanticScore(tags) {
  // Your code here
  return 0;
}

module.exports = calculateSemanticScore;
`,
    solutionCode: `function calculateSemanticScore(tags) {
  if (!Array.isArray(tags)) return 0;
  const semantics = new Set(['header', 'nav', 'main', 'article', 'aside', 'footer', 'section']);
  let score = 0;
  for (const t of tags) {
    if (semantics.has(t.toLowerCase())) score += 10;
    else if (t.toLowerCase() === 'div') score += 1;
  }
  return score;
}

module.exports = calculateSemanticScore;
`,
    hints: ["Count 10 for semantic elements and 1 for div."],
    skills: [{"skillId": "html-css-semantics", "weight": 1.0}],
    testCases: [{"input": "[[\"header\", \"main\", \"div\"]]", "expectedOutput": "21", "description": "Scores semantic elements higher", "hidden": false}],
  });

  const feL1_Practice = await ActivityModel.create({
    lessonId: feL1._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Calculate Semantic Depth Score`,
    order: 3,
    challengeRef: feL1_Challenge._id,
    content: `# Code Practice: Calculate Semantic Depth Score\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  feL1_Challenge.activityId = feL1_Practice._id;
  await feL1_Challenge.save();

  const feL1_Quiz = await AssessmentModel.create({
    title: `Assessment: Semantic HTML5`,
    description: `Verify understanding of accessible page structure.`,
    passingScore: 70,
    skills: [{"skillId": "html-css-semantics", "weight": 1.0}],
    questions: [
    {
        "question": "Why should <main> be used instead of a generic <div> for central page content?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "It forces dark mode on the page",
            "Screen readers and search engines use it as a landmark to navigate to primary content directly",
            "It prevents JavaScript errors",
            "It automatically caches images"
        ],
        "correctOption": 1,
        "explanation": "<main> provides an accessible landmark for screen readers and SEO crawlers.",
        "points": 10
    }
],
  });

  const feL1_Assessment = await ActivityModel.create({
    lessonId: feL1._id,
    type: 'QUIZ',
    title: `Assessment: Semantic HTML5`,
    order: 4,
    assessmentRef: feL1_Quiz._id,
  });
  feL1_Quiz.activityId = feL1_Assessment._id;
  await feL1_Quiz.save();

  feL1.activities = [
    feL1_Video._id,
    feL1_Notes._id,
    feL1_Practice._id,
    feL1_Assessment._id,
  ] as any;
  await feL1.save();

  // --- Lesson 2: CSS Flexbox & 2D Grid Layout Engines ---
  const feL2 = await LessonModel.create({
    moduleId: feMod1._id,
    courseId: frontendCourse._id,
    title: `CSS Flexbox & 2D Grid Layout Engines`,
    description: `Build fluid, responsive layouts with flex-direction, justify-content, align-items, and grid-template-columns.`,
    order: 2,
    activities: [],
  });

  const feL2_Video = await ActivityModel.create({
    lessonId: feL2._id,
    type: 'VIDEO',
    title: `Video: CSS Flexbox and Grid Mastery`,
    order: 1,
    resourceRef: getRes('HTML and CSS Web Development Intro in Tamil')?._id,
    content: `# Flexbox vs Grid:\\n- Flexbox is 1-dimensional (row or column alignment).\\n- Grid is 2-dimensional (simultaneous rows and columns).`,
  });

  const feL2_Notes = await ActivityModel.create({
    lessonId: feL2._id,
    type: 'NOTES',
    title: `Codexa Notes: CSS Flexbox & 2D Grid Layout Engines`,
    order: 2,
    content: `# CSS Flexbox & 2D Grid Layout Engines

Build fluid, responsive layouts with flex-direction, justify-content, align-items, and grid-template-columns.

### Flexbox (1D)
\`\`\`css
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
\`\`\`

### CSS Grid (2D)
\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
\`\`\`

## Why CSS Flexbox & 2D Grid Layout Engines Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Calculate how many column widths plus gaps fit in container.

> ⚠️ **Common Mistake**: align-items aligns items along the cross axis.

## Real-World Production Scenario

In production engineering, **CSS Flexbox & 2D Grid Layout Engines** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of CSS Flexbox & 2D Grid Layout Engines. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MDN Web Docs: CSS Flexbox Layout Guide')?._id,
  });

  const feL2_Challenge = await ChallengeModel.create({
    title: `Compute Grid Columns Count`,
    description: `Implement \`getGridColumns(containerWidth, minColumnWidth, gap)\` that computes how many columns fit in a CSS auto-fit grid.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function getGridColumns(containerWidth, minColumnWidth, gap = 16) {
  // Your code here
  return 1;
}

module.exports = getGridColumns;
`,
    solutionCode: `function getGridColumns(containerWidth, minColumnWidth, gap = 16) {
  if (containerWidth <= 0 || minColumnWidth <= 0) return 0;
  let cols = 1;
  while ((cols + 1) * minColumnWidth + cols * gap <= containerWidth) {
    cols++;
  }
  return cols;
}

module.exports = getGridColumns;
`,
    hints: ["Calculate how many column widths plus gaps fit in container."],
    skills: [{"skillId": "html-css-semantics", "weight": 1.0}],
    testCases: [{"input": "[1000, 300, 20]", "expectedOutput": "3", "description": "Computes fitting grid columns", "hidden": false}],
  });

  const feL2_Practice = await ActivityModel.create({
    lessonId: feL2._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Compute Grid Columns Count`,
    order: 3,
    challengeRef: feL2_Challenge._id,
    content: `# Code Practice: Compute Grid Columns Count\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  feL2_Challenge.activityId = feL2_Practice._id;
  await feL2_Challenge.save();

  const feL2_Quiz = await AssessmentModel.create({
    title: `Assessment: Flexbox & Grid`,
    description: `Test CSS layout positioning mechanics.`,
    passingScore: 70,
    skills: [{"skillId": "html-css-semantics", "weight": 1.0}],
    questions: [
    {
        "question": "Which CSS property aligns Flexbox items along the cross axis (vertical by default in row layout)?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "justify-content",
            "align-items",
            "flex-wrap",
            "content-align"
        ],
        "correctOption": 1,
        "explanation": "align-items aligns items along the cross axis.",
        "points": 10
    }
],
  });

  const feL2_Assessment = await ActivityModel.create({
    lessonId: feL2._id,
    type: 'QUIZ',
    title: `Assessment: Flexbox & Grid`,
    order: 4,
    assessmentRef: feL2_Quiz._id,
  });
  feL2_Quiz.activityId = feL2_Assessment._id;
  await feL2_Quiz.save();

  feL2.activities = [
    feL2_Video._id,
    feL2_Notes._id,
    feL2_Practice._id,
    feL2_Assessment._id,
  ] as any;
  await feL2.save();

  feMod1.lessons = [feL1._id, feL2._id] as any;
  await feMod1.save();

  const feMod2 = await ModuleModel.create({
    courseId: frontendCourse._id,
    title: `Module 2: Responsive Design & DOM Manipulation`,
    description: `Media queries, mobile-first design, event delegation, and DOM APIs.`,
    order: 2,
    lessons: [],
  });

  // --- Lesson 1: Mobile-First Responsive Design & Breakpoints ---
  const feL3 = await LessonModel.create({
    moduleId: feMod2._id,
    courseId: frontendCourse._id,
    title: `Mobile-First Responsive Design & Breakpoints`,
    description: `Structure CSS using mobile-first @media queries and relative units (rem, em, clamp).`,
    order: 1,
    activities: [],
  });

  const feL3_Video = await ActivityModel.create({
    lessonId: feL3._id,
    type: 'VIDEO',
    title: `Video: Mobile First Responsive Web Design`,
    order: 1,
    resourceRef: getRes('HTML Lists and Data Structuring in Tamil')?._id,
    content: `# Responsive Principles:\\n- Design for mobile screens first with min-width media queries.\\n- Use fluid typography with clamp(1rem, 2.5vw, 2rem).`,
  });

  const feL3_Notes = await ActivityModel.create({
    lessonId: feL3._id,
    type: 'NOTES',
    title: `Codexa Notes: Mobile-First Responsive Design & Breakpoints`,
    order: 2,
    content: `# Mobile-First Responsive Design & Breakpoints

Structure CSS using mobile-first @media queries and relative units (rem, em, clamp).

Mobile-first stylesheets write base rules for small viewports and scale up using \`min-width\` queries:

\`\`\`css
/* Base: Mobile (default) */
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
\`\`\`

## Why Mobile-First Responsive Design & Breakpoints Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Check pixel thresholds in order.

> ⚠️ **Common Mistake**: Mobile-first builds lightweight baseline styles and progressively enhances them on wider viewports.

## Real-World Production Scenario

In production engineering, **Mobile-First Responsive Design & Breakpoints** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Mobile-First Responsive Design & Breakpoints. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MDN Web Docs: HTML5 Semantic Elements')?._id,
  });

  const feL3_Challenge = await ChallengeModel.create({
    title: `Determine Active Breakpoint`,
    description: `Implement \`getBreakpoint(width)\`: \`< 640\`: 'sm', \`640..767\`: 'md', \`768..1023\`: 'lg', \`>= 1024\`: 'xl'.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function getBreakpoint(width) {
  // Your code here
  return 'sm';
}

module.exports = getBreakpoint;
`,
    solutionCode: `function getBreakpoint(width) {
  if (width < 640) return 'sm';
  if (width < 768) return 'md';
  if (width < 1024) return 'lg';
  return 'xl';
}

module.exports = getBreakpoint;
`,
    hints: ["Check pixel thresholds in order."],
    skills: [{"skillId": "html-css-semantics", "weight": 1.0}],
    testCases: [{"input": "[800]", "expectedOutput": "\"lg\"", "description": "Matches lg viewport", "hidden": false}],
  });

  const feL3_Practice = await ActivityModel.create({
    lessonId: feL3._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Determine Active Breakpoint`,
    order: 3,
    challengeRef: feL3_Challenge._id,
    content: `# Code Practice: Determine Active Breakpoint\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  feL3_Challenge.activityId = feL3_Practice._id;
  await feL3_Challenge.save();

  const feL3_Quiz = await AssessmentModel.create({
    title: `Assessment: Responsive Design & Breakpoints`,
    description: `Test responsive strategy knowledge.`,
    passingScore: 70,
    skills: [{"skillId": "html-css-semantics", "weight": 1.0}],
    questions: [
    {
        "question": "Why is a mobile-first CSS strategy generally preferred over desktop-first?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Mobile devices cannot process CSS",
            "It reduces code overriding and optimizes initial load performance for mobile devices",
            "Desktop screens do not support media queries",
            "It disables browser caching"
        ],
        "correctOption": 1,
        "explanation": "Mobile-first builds lightweight baseline styles and progressively enhances them on wider viewports.",
        "points": 10
    }
],
  });

  const feL3_Assessment = await ActivityModel.create({
    lessonId: feL3._id,
    type: 'QUIZ',
    title: `Assessment: Responsive Design & Breakpoints`,
    order: 4,
    assessmentRef: feL3_Quiz._id,
  });
  feL3_Quiz.activityId = feL3_Assessment._id;
  await feL3_Quiz.save();

  feL3.activities = [
    feL3_Video._id,
    feL3_Notes._id,
    feL3_Practice._id,
    feL3_Assessment._id,
  ] as any;
  await feL3.save();

  // --- Lesson 2: DOM Manipulation, Events & Event Delegation ---
  const feL4 = await LessonModel.create({
    moduleId: feMod2._id,
    courseId: frontendCourse._id,
    title: `DOM Manipulation, Events & Event Delegation`,
    description: `Select elements, listen to events, and optimize memory with parent event delegation.`,
    order: 2,
    activities: [],
  });

  const feL4_Video = await ActivityModel.create({
    lessonId: feL4._id,
    type: 'VIDEO',
    title: `Video: JavaScript DOM Manipulation and Event Delegation`,
    order: 1,
    resourceRef: getRes('HTML Forms and User Inputs in Tamil')?._id,
    content: `# Event Delegation:\\n- Attach a single listener to a common ancestor instead of hundreds of child listeners.\\n- Use event.target.matches('.item') to identify triggered children.`,
  });

  const feL4_Notes = await ActivityModel.create({
    lessonId: feL4._id,
    type: 'NOTES',
    title: `Codexa Notes: DOM Manipulation, Events & Event Delegation`,
    order: 2,
    content: `# DOM Manipulation, Events & Event Delegation

Select elements, listen to events, and optimize memory with parent event delegation.

Instead of adding separate click handlers to 1,000 list items:

\`\`\`javascript
document.querySelector('#item-list').addEventListener('click', (event) => {
  const button = event.target.closest('.delete-btn');
  if (button) {
    const id = button.dataset.id;
    deleteItem(id);
  }
});
\`\`\`

## Why DOM Manipulation, Events & Event Delegation Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Compare tag names and class names against selector.

> ⚠️ **Common Mistake**: Event delegation reduces memory overhead and automatically handles dynamically inserted child elements.

## Real-World Production Scenario

In production engineering, **DOM Manipulation, Events & Event Delegation** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of DOM Manipulation, Events & Event Delegation. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MDN Web Docs: JavaScript Functions')?._id,
  });

  const feL4_Challenge = await ChallengeModel.create({
    title: `Simulate Event Delegation Matching`,
    description: `Implement \`matchesDelegation(targetTag, targetClass, selector)\` checking if target matches \`'TAG.class'\` or \`'.class'\` or \`'TAG'\`.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function matchesDelegation(targetTag, targetClass, selector) {
  // Your code here
  return false;
}

module.exports = matchesDelegation;
`,
    solutionCode: `function matchesDelegation(targetTag, targetClass, selector) {
  if (!selector) return false;
  const tag = (targetTag || '').toLowerCase();
  const cls = (targetClass || '').split(' ');
  if (selector.startsWith('.')) {
    return cls.includes(selector.slice(1));
  }
  if (selector.includes('.')) {
    const [sTag, sCls] = selector.split('.');
    return tag === sTag.toLowerCase() && cls.includes(sCls);
  }
  return tag === selector.toLowerCase();
}

module.exports = matchesDelegation;
`,
    hints: ["Compare tag names and class names against selector."],
    skills: [{"skillId": "dom-browser-apis", "weight": 1.0}],
    testCases: [{"input": "[\"BUTTON\", \"btn delete-btn\", \".delete-btn\"]", "expectedOutput": "true", "description": "Matches class selector", "hidden": false}],
  });

  const feL4_Practice = await ActivityModel.create({
    lessonId: feL4._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Simulate Event Delegation Matching`,
    order: 3,
    challengeRef: feL4_Challenge._id,
    content: `# Code Practice: Simulate Event Delegation Matching\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  feL4_Challenge.activityId = feL4_Practice._id;
  await feL4_Challenge.save();

  const feL4_Quiz = await AssessmentModel.create({
    title: `Assessment: DOM & Event Delegation`,
    description: `Test DOM memory management and event mechanics.`,
    passingScore: 70,
    skills: [{"skillId": "dom-browser-apis", "weight": 1.0}],
    questions: [
    {
        "question": "What is the primary performance benefit of using event delegation?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "It increases CPU clock frequency",
            "It conserves memory by attaching a single event listener to a parent rather than many listeners to child nodes",
            "It disables browser garbage collection",
            "It makes CSS animations run in 120 FPS"
        ],
        "correctOption": 1,
        "explanation": "Event delegation reduces memory overhead and automatically handles dynamically inserted child elements.",
        "points": 10
    }
],
  });

  const feL4_Assessment = await ActivityModel.create({
    lessonId: feL4._id,
    type: 'QUIZ',
    title: `Assessment: DOM & Event Delegation`,
    order: 4,
    assessmentRef: feL4_Quiz._id,
  });
  feL4_Quiz.activityId = feL4_Assessment._id;
  await feL4_Quiz.save();

  feL4.activities = [
    feL4_Video._id,
    feL4_Notes._id,
    feL4_Practice._id,
    feL4_Assessment._id,
  ] as any;
  await feL4.save();

  feMod2.lessons = [feL3._id, feL4._id] as any;
  await feMod2.save();

  const feMod3 = await ModuleModel.create({
    courseId: frontendCourse._id,
    title: `Module 3: Web APIs & Storage Architecture`,
    description: `Fetch API, LocalStorage/SessionStorage, and asynchronous UI updates.`,
    order: 3,
    lessons: [],
  });

  // --- Lesson 1: Fetch API, HTTP Headers & Error Handling ---
  const feL5 = await LessonModel.create({
    moduleId: feMod3._id,
    courseId: frontendCourse._id,
    title: `Fetch API, HTTP Headers & Error Handling`,
    description: `Perform REST API requests using fetch(), inspect response.ok, and handle HTTP network errors.`,
    order: 1,
    activities: [],
  });

  const feL5_Video = await ActivityModel.create({
    lessonId: feL5._id,
    type: 'VIDEO',
    title: `Video: Modern Fetch API & Async Request Handling`,
    order: 1,
    resourceRef: getRes('JavaScript Array map Method in Tamil')?._id,
    content: `# Fetch API:\\n- fetch() only rejects on network failure, NOT on 404/500 HTTP errors.\\n- Always check if (!response.ok) before parsing body.`,
  });

  const feL5_Notes = await ActivityModel.create({
    lessonId: feL5._id,
    type: 'NOTES',
    title: `Codexa Notes: Fetch API, HTTP Headers & Error Handling`,
    order: 2,
    content: `# Fetch API, HTTP Headers & Error Handling

Perform REST API requests using fetch(), inspect response.ok, and handle HTTP network errors.

\`\`\`javascript
async function fetchUserData(userId) {
  try {
    const res = await fetch(\`/api/users/\${userId}\`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) {
      throw new Error(\`HTTP error: \${res.status}\`);
    }
    return await res.json();
  } catch (err) {
    console.error('Network or parsing error:', err);
    throw err;
  }
}
\`\`\`

## Why Fetch API, HTTP Headers & Error Handling Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Encode keys and values with encodeURIComponent.

> ⚠️ **Common Mistake**: fetch() resolves normally for HTTP error statuses (4xx, 5xx); it only rejects on true network or DNS failure.

## Real-World Production Scenario

In production engineering, **Fetch API, HTTP Headers & Error Handling** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Fetch API, HTTP Headers & Error Handling. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MDN Web Docs: JavaScript Functions')?._id,
  });

  const feL5_Challenge = await ChallengeModel.create({
    title: `Format Fetch Query URL`,
    description: `Implement \`buildFetchUrl(baseEndpoint, params)\` that appends URLSearchParams cleanly.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function buildFetchUrl(baseEndpoint, params) {
  // Your code here
  return baseEndpoint;
}

module.exports = buildFetchUrl;
`,
    solutionCode: `function buildFetchUrl(baseEndpoint, params) {
  if (!params || Object.keys(params).length === 0) return baseEndpoint;
  const query = Object.entries(params)
    .map(([k, v]) => \`\${encodeURIComponent(k)}=\${encodeURIComponent(v)}\`)
    .join('&');
  const separator = baseEndpoint.includes('?') ? '&' : '?';
  return \`\${baseEndpoint}\${separator}\${query}\`;
}

module.exports = buildFetchUrl;
`,
    hints: ["Encode keys and values with encodeURIComponent."],
    skills: [{"skillId": "dom-browser-apis", "weight": 1.0}],
    testCases: [{"input": "[\"/api/users\", {\"page\": 1, \"limit\": 10}]", "expectedOutput": "\"/api/users?page=1&limit=10\"", "description": "Constructs query URL", "hidden": false}],
  });

  const feL5_Practice = await ActivityModel.create({
    lessonId: feL5._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Format Fetch Query URL`,
    order: 3,
    challengeRef: feL5_Challenge._id,
    content: `# Code Practice: Format Fetch Query URL\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  feL5_Challenge.activityId = feL5_Practice._id;
  await feL5_Challenge.save();

  const feL5_Quiz = await AssessmentModel.create({
    title: `Assessment: Fetch API Error Handling`,
    description: `Test understanding of fetch error semantics.`,
    passingScore: 70,
    skills: [{"skillId": "dom-browser-apis", "weight": 1.0}],
    questions: [
    {
        "question": "What happens when a fetch() request receives an HTTP 404 or 500 status code from the server?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "The Promise immediately rejects into the catch block",
            "The Promise resolves successfully, but response.ok is false",
            "The browser reloads the page",
            "The response body is nullified"
        ],
        "correctOption": 1,
        "explanation": "fetch() resolves normally for HTTP error statuses (4xx, 5xx); it only rejects on true network or DNS failure.",
        "points": 10
    }
],
  });

  const feL5_Assessment = await ActivityModel.create({
    lessonId: feL5._id,
    type: 'QUIZ',
    title: `Assessment: Fetch API Error Handling`,
    order: 4,
    assessmentRef: feL5_Quiz._id,
  });
  feL5_Quiz.activityId = feL5_Assessment._id;
  await feL5_Quiz.save();

  feL5.activities = [
    feL5_Video._id,
    feL5_Notes._id,
    feL5_Practice._id,
    feL5_Assessment._id,
  ] as any;
  await feL5.save();

  // --- Lesson 2: Web Storage: LocalStorage & SessionStorage ---
  const feL6 = await LessonModel.create({
    moduleId: feMod3._id,
    courseId: frontendCourse._id,
    title: `Web Storage: LocalStorage & SessionStorage`,
    description: `Persist user settings, theme preferences, and tokens safely with Web Storage APIs.`,
    order: 2,
    activities: [],
  });

  const feL6_Video = await ActivityModel.create({
    lessonId: feL6._id,
    type: 'VIDEO',
    title: `Video: Web Storage APIs in JavaScript`,
    order: 1,
    resourceRef: getRes('JavaScript Array reduce Method in Tamil')?._id,
    content: `# Web Storage:\\n- localStorage persists across browser restarts.\\n- sessionStorage clears when the tab is closed.`,
  });

  const feL6_Notes = await ActivityModel.create({
    lessonId: feL6._id,
    type: 'NOTES',
    title: `Codexa Notes: Web Storage: LocalStorage & SessionStorage`,
    order: 2,
    content: `# Web Storage: LocalStorage & SessionStorage

Persist user settings, theme preferences, and tokens safely with Web Storage APIs.

- \`localStorage.setItem('theme', 'dark')\`: Synchronous key-value storage (approx 5MB limit).
- \`localStorage.getItem('theme')\`
- \`localStorage.removeItem('theme')\`
- All values stored in Web Storage MUST be strings; use \`JSON.stringify()\` and \`JSON.parse()\`.

\`\`\`javascript
// Type-safe LocalStorage helper
function saveUserPref(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Storage quota exceeded');
  }
}
\`\`\`

## Why Web Storage: LocalStorage & SessionStorage Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Wrap JSON.stringify in try-catch.

> ⚠️ **Common Mistake**: sessionStorage lifespan is bound to the active browser tab session.

## Real-World Production Scenario

In production engineering, **Web Storage: LocalStorage & SessionStorage** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Web Storage: LocalStorage & SessionStorage. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MDN Web Docs: Array Transformations')?._id,
  });

  const feL6_Challenge = await ChallengeModel.create({
    title: `Safe JSON Storage Serializer`,
    description: `Implement \`safeSerialize(data)\` that converts data to JSON string or returns fallback \`"null"\` if invalid/circular.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function safeSerialize(data) {
  // Your code here
  return 'null';
}

module.exports = safeSerialize;
`,
    solutionCode: `function safeSerialize(data) {
  try {
    return JSON.stringify(data);
  } catch (err) {
    return 'null';
  }
}

module.exports = safeSerialize;
`,
    hints: ["Wrap JSON.stringify in try-catch."],
    skills: [{"skillId": "dom-browser-apis", "weight": 1.0}],
    testCases: [{"input": "[{\"theme\": \"dark\", \"active\": true}]", "expectedOutput": "{\"theme\":\"dark\",\"active\":true}", "description": "Serializes valid object", "hidden": false}],
  });

  const feL6_Practice = await ActivityModel.create({
    lessonId: feL6._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Safe JSON Storage Serializer`,
    order: 3,
    challengeRef: feL6_Challenge._id,
    content: `# Code Practice: Safe JSON Storage Serializer\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  feL6_Challenge.activityId = feL6_Practice._id;
  await feL6_Challenge.save();

  const feL6_Quiz = await AssessmentModel.create({
    title: `Assessment: Web Storage`,
    description: `Test understanding of browser storage differences.`,
    passingScore: 70,
    skills: [{"skillId": "dom-browser-apis", "weight": 1.0}],
    questions: [
    {
        "question": "What is the key difference between localStorage and sessionStorage in web browsers?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "sessionStorage can store binary blobs, localStorage cannot",
            "localStorage persists until explicitly cleared, while sessionStorage is cleared when the browser tab closes",
            "localStorage has no size limit",
            "sessionStorage is shared across different origins"
        ],
        "correctOption": 1,
        "explanation": "sessionStorage lifespan is bound to the active browser tab session.",
        "points": 10
    }
],
  });

  const feL6_Assessment = await ActivityModel.create({
    lessonId: feL6._id,
    type: 'QUIZ',
    title: `Assessment: Web Storage`,
    order: 4,
    assessmentRef: feL6_Quiz._id,
  });
  feL6_Quiz.activityId = feL6_Assessment._id;
  await feL6_Quiz.save();

  feL6.activities = [
    feL6_Video._id,
    feL6_Notes._id,
    feL6_Practice._id,
    feL6_Assessment._id,
  ] as any;
  await feL6.save();

  feMod3.lessons = [feL5._id, feL6._id] as any;
  await feMod3.save();

  frontendCourse.modules = [feMod1._id, feMod2._id, feMod3._id] as any;
  await frontendCourse.save();

  // =========================================================================
  // 4. NODE.JS BACKEND ARCHITECTURE
  // =========================================================================
  const backendCourse = await CourseModel.create({
    slug: 'backend-development-nodejs',
    title: 'Node.js Backend Architecture & Systems',
    description: 'Master asynchronous Node.js, event-driven runtime mechanics, Express middleware pipelines, RESTful controllers, JWT authentication, and security hardening.',
    domain: 'Web Development',
    level: 'INTERMEDIATE',
    status: 'PUBLISHED',
    estimatedHours: 40,
    skillsCovered: ['nodejs-core', 'express-apis', 'rest-architecture'],
    prerequisites: ['JavaScript Fundamentals & Async programming'],
    modules: [],
  });

  const beMod1 = await ModuleModel.create({
    courseId: backendCourse._id,
    title: `Module 1: Node.js Runtime & Event-Driven Core`,
    description: `Event loop, asynchronous I/O, Buffer, and File System streams.`,
    order: 1,
    lessons: [],
  });

  // --- Lesson 1: Node.js Event-Driven Architecture & Event Emitter ---
  const beL1 = await LessonModel.create({
    moduleId: beMod1._id,
    courseId: backendCourse._id,
    title: `Node.js Event-Driven Architecture & Event Emitter`,
    description: `Understand non-blocking I/O, worker threads, and event-driven patterns with EventEmitter.`,
    order: 1,
    activities: [],
  });

  const beL1_Video = await ActivityModel.create({
    lessonId: beL1._id,
    type: 'VIDEO',
    title: `Video: Node.js Architecture & Event Emitter Core`,
    order: 1,
    resourceRef: getRes('Node.js Complete Architecture in Tamil')?._id,
    content: `# Node.js Event Loop:\\n- Node.js handles thousands of concurrent connections using a single-threaded event loop backed by libuv.\\n- EventEmitter enables decoupled pub/sub messaging inside services.`,
  });

  const beL1_Notes = await ActivityModel.create({
    lessonId: beL1._id,
    type: 'NOTES',
    title: `Codexa Notes: Node.js Event-Driven Architecture & Event Emitter`,
    order: 2,
    content: `# Node.js Event-Driven Architecture & Event Emitter

Understand non-blocking I/O, worker threads, and event-driven patterns with EventEmitter.

Node.js executes JavaScript on Chrome's V8 engine with asynchronous I/O provided by \`libuv\`.

### EventEmitter Pattern
\`\`\`javascript
const EventEmitter = require('events');
class OrderService extends EventEmitter {}

const orders = new OrderService();
orders.on('orderCreated', (order) => {
  console.log('Sending confirmation email for order:', order.id);
});

orders.emit('orderCreated', { id: 101, total: 49.99 });
\`\`\`

## Why Node.js Event-Driven Architecture & Event Emitter Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Store callback functions in an array keyed by event name.

> ⚠️ **Common Mistake**: libuv manages the event loop, thread pool, and asynchronous I/O operations.

## Real-World Production Scenario

In production engineering, **Node.js Event-Driven Architecture & Event Emitter** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Node.js Event-Driven Architecture & Event Emitter. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Node.js Official Documentation: HTTP')?._id,
  });

  const beL1_Challenge = await ChallengeModel.create({
    title: `Build Event Emitter Observer`,
    description: `Implement class \`SimpleEventEmitter\` with methods \`on(event, cb)\` and \`emit(event, data)\` that triggers all registered callbacks in order.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `class SimpleEventEmitter {
  constructor() {
    this.events = {};
  }
  on(event, cb) {
    // Your code here
  }
  emit(event, data) {
    // Your code here
  }
}

module.exports = SimpleEventEmitter;
`,
    solutionCode: `class SimpleEventEmitter {
  constructor() {
    this.events = {};
  }
  on(event, cb) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(cb);
  }
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(data));
    }
  }
}

module.exports = SimpleEventEmitter;
`,
    hints: ["Store callback functions in an array keyed by event name."],
    skills: [{"skillId": "nodejs-core", "weight": 1.0}],
    testCases: [{"input": "[]", "expectedOutput": "true", "description": "Registers and invokes event callbacks", "hidden": false}],
  });

  const beL1_Practice = await ActivityModel.create({
    lessonId: beL1._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Build Event Emitter Observer`,
    order: 3,
    challengeRef: beL1_Challenge._id,
    content: `# Code Practice: Build Event Emitter Observer\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  beL1_Challenge.activityId = beL1_Practice._id;
  await beL1_Challenge.save();

  const beL1_Quiz = await AssessmentModel.create({
    title: `Assessment: Node.js Runtime`,
    description: `Test understanding of Node.js non-blocking I/O.`,
    passingScore: 70,
    skills: [{"skillId": "nodejs-core", "weight": 1.0}],
    questions: [
    {
        "question": "What C++ library provides the underlying cross-platform asynchronous I/O and thread pool for Node.js?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "libuv",
            "V8 engine",
            "glibc",
            "Boost"
        ],
        "correctOption": 0,
        "explanation": "libuv manages the event loop, thread pool, and asynchronous I/O operations.",
        "points": 10
    }
],
  });

  const beL1_Assessment = await ActivityModel.create({
    lessonId: beL1._id,
    type: 'QUIZ',
    title: `Assessment: Node.js Runtime`,
    order: 4,
    assessmentRef: beL1_Quiz._id,
  });
  beL1_Quiz.activityId = beL1_Assessment._id;
  await beL1_Quiz.save();

  beL1.activities = [
    beL1_Video._id,
    beL1_Notes._id,
    beL1_Practice._id,
    beL1_Assessment._id,
  ] as any;
  await beL1.save();

  // --- Lesson 2: Buffers, Streams & File System Pipeline ---
  const beL2 = await LessonModel.create({
    moduleId: beMod1._id,
    courseId: backendCourse._id,
    title: `Buffers, Streams & File System Pipeline`,
    description: `Process large files efficiently with Readable/Writable streams and pipe().`,
    order: 2,
    activities: [],
  });

  const beL2_Video = await ActivityModel.create({
    lessonId: beL2._id,
    type: 'VIDEO',
    title: `Video: Node.js Streams & Buffer Management`,
    order: 1,
    resourceRef: getRes('Node.js CLI Arguments and HTTP Module in Tamil')?._id,
    content: `# Streams & Buffers:\\n- Buffers hold raw binary data in memory.\\n- Streams process data chunk-by-chunk without loading entire files into RAM.`,
  });

  const beL2_Notes = await ActivityModel.create({
    lessonId: beL2._id,
    type: 'NOTES',
    title: `Codexa Notes: Buffers, Streams & File System Pipeline`,
    order: 2,
    content: `# Buffers, Streams & File System Pipeline

Process large files efficiently with Readable/Writable streams and pipe().

When handling multi-gigabyte files or HTTP responses, streams process chunks incrementally:

\`\`\`javascript
const fs = require('fs');
const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');

readStream.pipe(writeStream);
\`\`\`

## Why Buffers, Streams & File System Pipeline Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use Math.ceil(totalBytes / chunkSize)

> ⚠️ **Common Mistake**: Streaming minimizes memory footprint by transferring chunks directly as they are read.

## Real-World Production Scenario

In production engineering, **Buffers, Streams & File System Pipeline** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Buffers, Streams & File System Pipeline. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Node.js Official Documentation: HTTP')?._id,
  });

  const beL2_Challenge = await ChallengeModel.create({
    title: `Calculate Stream Buffer Chunks`,
    description: `Implement \`calculateChunkCount(totalBytes, chunkSize)\` that returns how many chunks are generated for a given stream size.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function calculateChunkCount(totalBytes, chunkSize = 65536) {
  // Your code here
  return 0;
}

module.exports = calculateChunkCount;
`,
    solutionCode: `function calculateChunkCount(totalBytes, chunkSize = 65536) {
  if (totalBytes <= 0 || chunkSize <= 0) return 0;
  return Math.ceil(totalBytes / chunkSize);
}

module.exports = calculateChunkCount;
`,
    hints: ["Use Math.ceil(totalBytes / chunkSize)"],
    skills: [{"skillId": "nodejs-core", "weight": 1.0}],
    testCases: [{"input": "[150000, 65536]", "expectedOutput": "3", "description": "Calculates buffer chunk count", "hidden": false}],
  });

  const beL2_Practice = await ActivityModel.create({
    lessonId: beL2._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Calculate Stream Buffer Chunks`,
    order: 3,
    challengeRef: beL2_Challenge._id,
    content: `# Code Practice: Calculate Stream Buffer Chunks\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  beL2_Challenge.activityId = beL2_Practice._id;
  await beL2_Challenge.save();

  const beL2_Quiz = await AssessmentModel.create({
    title: `Assessment: Node.js Streams`,
    description: `Test stream and buffer architecture.`,
    passingScore: 70,
    skills: [{"skillId": "nodejs-core", "weight": 1.0}],
    questions: [
    {
        "question": "Why is pipe() preferred over fs.readFile() when serving large files over HTTP?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "pipe() encrypts files automatically",
            "pipe() streams chunks without loading the entire multi-GB file into server RAM",
            "readFile() is deprecated in Node.js",
            "pipe() bypasses network interfaces"
        ],
        "correctOption": 1,
        "explanation": "Streaming minimizes memory footprint by transferring chunks directly as they are read.",
        "points": 10
    }
],
  });

  const beL2_Assessment = await ActivityModel.create({
    lessonId: beL2._id,
    type: 'QUIZ',
    title: `Assessment: Node.js Streams`,
    order: 4,
    assessmentRef: beL2_Quiz._id,
  });
  beL2_Quiz.activityId = beL2_Assessment._id;
  await beL2_Quiz.save();

  beL2.activities = [
    beL2_Video._id,
    beL2_Notes._id,
    beL2_Practice._id,
    beL2_Assessment._id,
  ] as any;
  await beL2.save();

  beMod1.lessons = [beL1._id, beL2._id] as any;
  await beMod1.save();

  const beMod2 = await ModuleModel.create({
    courseId: backendCourse._id,
    title: `Module 2: Express Server & Routing Engine`,
    description: `Routing parameters, error handling middleware, and controller separation.`,
    order: 2,
    lessons: [],
  });

  // --- Lesson 1: Modular Express Routers & Controller Layer ---
  const beL3 = await LessonModel.create({
    moduleId: beMod2._id,
    courseId: backendCourse._id,
    title: `Modular Express Routers & Controller Layer`,
    description: `Organize routes using express.Router() and separate business logic into controllers.`,
    order: 1,
    activities: [],
  });

  const beL3_Video = await ActivityModel.create({
    lessonId: beL3._id,
    type: 'VIDEO',
    title: `Video: Express.js Routing & Controller Patterns`,
    order: 1,
    resourceRef: getRes('Node.js Module System CommonJS & ESM in Tamil')?._id,
    content: `# Express Modular Routing:\\n- Use express.Router() for isolated domain routers (e.g. /api/users, /api/products).\\n- Controllers handle request/response orchestration.`,
  });

  const beL3_Notes = await ActivityModel.create({
    lessonId: beL3._id,
    type: 'NOTES',
    title: `Codexa Notes: Modular Express Routers & Controller Layer`,
    order: 2,
    content: `# Modular Express Routers & Controller Layer

Organize routes using express.Router() and separate business logic into controllers.

\`\`\`javascript
// routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);

module.exports = router;
\`\`\`

## Why Modular Express Routers & Controller Layer Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Treat segments starting with : as wildcards.

> ⚠️ **Common Mistake**: Routers isolate routes, parameters, and middleware per domain module.

## Real-World Production Scenario

In production engineering, **Modular Express Routers & Controller Layer** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Modular Express Routers & Controller Layer. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Express.js Guide: Middleware')?._id,
  });

  const beL3_Challenge = await ChallengeModel.create({
    title: `Match Express Route Pattern`,
    description: `Implement \`matchRoutePattern(routePattern, requestedPath)\` returning \`true\` if paths match.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function matchRoutePattern(routePattern, requestedPath) {
  // Your code here
  return false;
}

module.exports = matchRoutePattern;
`,
    solutionCode: `function matchRoutePattern(routePattern, requestedPath) {
  const pParts = routePattern.split('/').filter(Boolean);
  const rParts = requestedPath.split('/').filter(Boolean);
  if (pParts.length !== rParts.length) return false;
  for (let i = 0; i < pParts.length; i++) {
    if (pParts[i].startsWith(':')) continue;
    if (pParts[i] !== rParts[i]) return false;
  }
  return true;
}

module.exports = matchRoutePattern;
`,
    hints: ["Treat segments starting with : as wildcards."],
    skills: [{"skillId": "express-apis", "weight": 1.0}],
    testCases: [{"input": "[\"/users/:id\", \"/users/42\"]", "expectedOutput": "true", "description": "Matches dynamic param route", "hidden": false}],
  });

  const beL3_Practice = await ActivityModel.create({
    lessonId: beL3._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Match Express Route Pattern`,
    order: 3,
    challengeRef: beL3_Challenge._id,
    content: `# Code Practice: Match Express Route Pattern\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  beL3_Challenge.activityId = beL3_Practice._id;
  await beL3_Challenge.save();

  const beL3_Quiz = await AssessmentModel.create({
    title: `Assessment: Express Routers`,
    description: `Test modular routing architecture.`,
    passingScore: 70,
    skills: [{"skillId": "express-apis", "weight": 1.0}],
    questions: [
    {
        "question": "What is the primary benefit of dividing an Express application into multiple express.Router() files?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "It increases single-threaded throughput",
            "It organizes domain endpoints cleanly and allows modular middleware attachment",
            "It eliminates database latency",
            "It allows running PHP scripts"
        ],
        "correctOption": 1,
        "explanation": "Routers isolate routes, parameters, and middleware per domain module.",
        "points": 10
    }
],
  });

  const beL3_Assessment = await ActivityModel.create({
    lessonId: beL3._id,
    type: 'QUIZ',
    title: `Assessment: Express Routers`,
    order: 4,
    assessmentRef: beL3_Quiz._id,
  });
  beL3_Quiz.activityId = beL3_Assessment._id;
  await beL3_Quiz.save();

  beL3.activities = [
    beL3_Video._id,
    beL3_Notes._id,
    beL3_Practice._id,
    beL3_Assessment._id,
  ] as any;
  await beL3.save();

  // --- Lesson 2: Global Error-Handling Middleware & Async Wrappers ---
  const beL4 = await LessonModel.create({
    moduleId: beMod2._id,
    courseId: backendCourse._id,
    title: `Global Error-Handling Middleware & Async Wrappers`,
    description: `Catch asynchronous exceptions centrally with 4-parameter error middleware (err, req, res, next).`,
    order: 2,
    activities: [],
  });

  const beL4_Video = await ActivityModel.create({
    lessonId: beL4._id,
    type: 'VIDEO',
    title: `Video: Express Centralized Error Handling`,
    order: 1,
    resourceRef: getRes('Express.js REST API and Middleware Architecture')?._id,
    content: `# Error Handling Middleware:\\n- Error handlers must accept exactly 4 arguments: (err, req, res, next).\\n- Wrap async routes in try/catch or an asyncHandler wrapper.`,
  });

  const beL4_Notes = await ActivityModel.create({
    lessonId: beL4._id,
    type: 'NOTES',
    title: `Codexa Notes: Global Error-Handling Middleware & Async Wrappers`,
    order: 2,
    content: `# Global Error-Handling Middleware & Async Wrappers

Catch asynchronous exceptions centrally with 4-parameter error middleware (err, req, res, next).

In Express, error handling middleware is defined with 4 arguments:

\`\`\`javascript
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});
\`\`\`

## Why Global Error-Handling Middleware & Async Wrappers Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use Promise.resolve(fn(req, res, next)).catch(next)

> ⚠️ **Common Mistake**: Express checks function.length === 4 to distinguish error handlers from regular middleware.

## Real-World Production Scenario

In production engineering, **Global Error-Handling Middleware & Async Wrappers** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Global Error-Handling Middleware & Async Wrappers. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Express.js Guide: Middleware')?._id,
  });

  const beL4_Challenge = await ChallengeModel.create({
    title: `Create Async Handler Wrapper`,
    description: `Implement \`asyncHandler(fn)\` that wraps an async route handler and catches errors, passing them to \`next(err)\`.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function asyncHandler(fn) {
  return function(req, res, next) {
    // Your code here
  };
}

module.exports = asyncHandler;
`,
    solutionCode: `function asyncHandler(fn) {
  return function(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
`,
    hints: ["Use Promise.resolve(fn(req, res, next)).catch(next)"],
    skills: [{"skillId": "express-apis", "weight": 1.0}],
    testCases: [{"input": "[]", "expectedOutput": "true", "description": "Catches async rejection and forwards to next", "hidden": false}],
  });

  const beL4_Practice = await ActivityModel.create({
    lessonId: beL4._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Create Async Handler Wrapper`,
    order: 3,
    challengeRef: beL4_Challenge._id,
    content: `# Code Practice: Create Async Handler Wrapper\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  beL4_Challenge.activityId = beL4_Practice._id;
  await beL4_Challenge.save();

  const beL4_Quiz = await AssessmentModel.create({
    title: `Assessment: Express Error Handling`,
    description: `Test error propagation mechanics.`,
    passingScore: 70,
    skills: [{"skillId": "express-apis", "weight": 1.0}],
    questions: [
    {
        "question": "How does Express identify a middleware as a dedicated Error Handler?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "By its function name (e.g. function errorHandler)",
            "By having an arity of 4 parameters: (err, req, res, next)",
            "By returning a 500 status code",
            "By placing it in an errors.js file"
        ],
        "correctOption": 1,
        "explanation": "Express checks function.length === 4 to distinguish error handlers from regular middleware.",
        "points": 10
    }
],
  });

  const beL4_Assessment = await ActivityModel.create({
    lessonId: beL4._id,
    type: 'QUIZ',
    title: `Assessment: Express Error Handling`,
    order: 4,
    assessmentRef: beL4_Quiz._id,
  });
  beL4_Quiz.activityId = beL4_Assessment._id;
  await beL4_Quiz.save();

  beL4.activities = [
    beL4_Video._id,
    beL4_Notes._id,
    beL4_Practice._id,
    beL4_Assessment._id,
  ] as any;
  await beL4.save();

  beMod2.lessons = [beL3._id, beL4._id] as any;
  await beMod2.save();

  const beMod3 = await ModuleModel.create({
    courseId: backendCourse._id,
    title: `Module 3: Security, JWT & Production Hardening`,
    description: `Password hashing with bcrypt, JWT authorization, rate limiting, and CORS headers.`,
    order: 3,
    lessons: [],
  });

  // --- Lesson 1: JWT Token Creation, Verification & Refreshing ---
  const beL5 = await LessonModel.create({
    moduleId: beMod3._id,
    courseId: backendCourse._id,
    title: `JWT Token Creation, Verification & Refreshing`,
    description: `Sign JWT payloads with expiration, verify signatures, and protect API routes.`,
    order: 1,
    activities: [],
  });

  const beL5_Video = await ActivityModel.create({
    lessonId: beL5._id,
    type: 'VIDEO',
    title: `Video: Node.js JWT Authentication Architecture`,
    order: 1,
    resourceRef: getRes('Node.js JWT Authentication and Security Hardening')?._id,
    content: `# JWT Security:\\n- Store user ID and role in JWT payload (never passwords or credit cards).\\n- Set reasonable token expiration (e.g. 15m - 7d).`,
  });

  const beL5_Notes = await ActivityModel.create({
    lessonId: beL5._id,
    type: 'NOTES',
    title: `Codexa Notes: JWT Token Creation, Verification & Refreshing`,
    order: 2,
    content: `# JWT Token Creation, Verification & Refreshing

Sign JWT payloads with expiration, verify signatures, and protect API routes.

JWT structure: \`Header.Payload.Signature\`

\`\`\`javascript
const jwt = require('jsonwebtoken');

// Sign Token
const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);
\`\`\`

## Why JWT Token Creation, Verification & Refreshing Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Check userId exists and exp is in the future.

> ⚠️ **Common Mistake**: JWT payloads are signed, not encrypted; anyone who views the token can read the decoded payload.

## Real-World Production Scenario

In production engineering, **JWT Token Creation, Verification & Refreshing** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of JWT Token Creation, Verification & Refreshing. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Express.js Guide: Middleware')?._id,
  });

  const beL5_Challenge = await ChallengeModel.create({
    title: `Build JWT Payload Mock Validator`,
    description: `Implement \`validateJwtPayload(payload)\` ensuring payload contains \`userId\` (string) and \`exp\` (timestamp in the future).`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function validateJwtPayload(payload) {
  // Your code here
  return false;
}

module.exports = validateJwtPayload;
`,
    solutionCode: `function validateJwtPayload(payload) {
  if (!payload || typeof payload !== 'object') return false;
  if (!payload.userId || typeof payload.userId !== 'string') return false;
  if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) return false;
  return true;
}

module.exports = validateJwtPayload;
`,
    hints: ["Check userId exists and exp is in the future."],
    skills: [{"skillId": "rest-architecture", "weight": 1.0}],
    testCases: [{"input": "[{\"userId\": \"user_123\", \"exp\": 2000000000}]", "expectedOutput": "true", "description": "Validates active JWT payload", "hidden": false}],
  });

  const beL5_Practice = await ActivityModel.create({
    lessonId: beL5._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Build JWT Payload Mock Validator`,
    order: 3,
    challengeRef: beL5_Challenge._id,
    content: `# Code Practice: Build JWT Payload Mock Validator\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  beL5_Challenge.activityId = beL5_Practice._id;
  await beL5_Challenge.save();

  const beL5_Quiz = await AssessmentModel.create({
    title: `Assessment: JWT Security`,
    description: `Test token encryption and storage security.`,
    passingScore: 70,
    skills: [{"skillId": "rest-architecture", "weight": 1.0}],
    questions: [
    {
        "question": "Why should sensitive information (such as raw passwords or secret API keys) NEVER be placed inside a JWT payload?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "JWTs cannot be decrypted by servers",
            "The JWT payload is only Base64Url-encoded and can be decoded by anyone with access to the token",
            "It slows down MongoDB queries",
            "JWTs have a 10-byte size limit"
        ],
        "correctOption": 1,
        "explanation": "JWT payloads are signed, not encrypted; anyone who views the token can read the decoded payload.",
        "points": 10
    }
],
  });

  const beL5_Assessment = await ActivityModel.create({
    lessonId: beL5._id,
    type: 'QUIZ',
    title: `Assessment: JWT Security`,
    order: 4,
    assessmentRef: beL5_Quiz._id,
  });
  beL5_Quiz.activityId = beL5_Assessment._id;
  await beL5_Quiz.save();

  beL5.activities = [
    beL5_Video._id,
    beL5_Notes._id,
    beL5_Practice._id,
    beL5_Assessment._id,
  ] as any;
  await beL5.save();

  // --- Lesson 2: Rate Limiting, Helmet Security & CORS Hardening ---
  const beL6 = await LessonModel.create({
    moduleId: beMod3._id,
    courseId: backendCourse._id,
    title: `Rate Limiting, Helmet Security & CORS Hardening`,
    description: `Protect Express backend servers from brute-force attacks, XSS, and CORS violations.`,
    order: 2,
    activities: [],
  });

  const beL6_Video = await ActivityModel.create({
    lessonId: beL6._id,
    type: 'VIDEO',
    title: `Video: Production Security Hardening in Node.js`,
    order: 1,
    resourceRef: getRes('Node.js and Express Full Backend Course')?._id,
    content: `# Security Hardening:\\n- Use helmet to set security HTTP headers (CSP, HSTS, X-Frame-Options).\\n- Apply express-rate-limit to mitigate brute force and DoS attacks.`,
  });

  const beL6_Notes = await ActivityModel.create({
    lessonId: beL6._id,
    type: 'NOTES',
    title: `Codexa Notes: Rate Limiting, Helmet Security & CORS Hardening`,
    order: 2,
    content: `# Rate Limiting, Helmet Security & CORS Hardening

Protect Express backend servers from brute-force attacks, XSS, and CORS violations.

\`\`\`javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

app.use(helmet());
app.use(cors({ origin: 'https://codexa.dev', credentials: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requests per IP
});
app.use('/api/', limiter);
\`\`\`

## Why Rate Limiting, Helmet Security & CORS Hardening Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Increment count in ipMap and compare against maxRequests.

> ⚠️ **Common Mistake**: Helmet configures HTTP headers (e.g. X-Content-Type-Options, X-Frame-Options) for defense-in-depth.

## Real-World Production Scenario

In production engineering, **Rate Limiting, Helmet Security & CORS Hardening** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Rate Limiting, Helmet Security & CORS Hardening. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Express.js Guide: Middleware')?._id,
  });

  const beL6_Challenge = await ChallengeModel.create({
    title: `Build IP Rate Limiter Mock`,
    description: `Implement \`checkRateLimit(ipMap, ip, maxRequests)\` that records requests per IP and returns \`true\` if within limit, \`false\` if exceeded.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function checkRateLimit(ipMap, ip, maxRequests = 5) {
  // Your code here
  return true;
}

module.exports = checkRateLimit;
`,
    solutionCode: `function checkRateLimit(ipMap, ip, maxRequests = 5) {
  if (!ipMap || !ip) return true;
  const count = (ipMap[ip] || 0) + 1;
  ipMap[ip] = count;
  return count <= maxRequests;
}

module.exports = checkRateLimit;
`,
    hints: ["Increment count in ipMap and compare against maxRequests."],
    skills: [{"skillId": "rest-architecture", "weight": 1.0}],
    testCases: [{"input": "[{}, \"192.168.1.1\", 2]", "expectedOutput": "true", "description": "Allows request within limit", "hidden": false}],
  });

  const beL6_Practice = await ActivityModel.create({
    lessonId: beL6._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Build IP Rate Limiter Mock`,
    order: 3,
    challengeRef: beL6_Challenge._id,
    content: `# Code Practice: Build IP Rate Limiter Mock\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  beL6_Challenge.activityId = beL6_Practice._id;
  await beL6_Challenge.save();

  const beL6_Quiz = await AssessmentModel.create({
    title: `Assessment: Backend Security Hardening`,
    description: `Test security header and rate limiting concepts.`,
    passingScore: 70,
    skills: [{"skillId": "rest-architecture", "weight": 1.0}],
    questions: [
    {
        "question": "What is the primary role of the helmet package in an Express application?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "It compresses responses using Gzip",
            "It sets sensible HTTP security headers to protect against common web vulnerabilities like XSS and clickjacking",
            "It speeds up database writes",
            "It generates SSL certificates automatically"
        ],
        "correctOption": 1,
        "explanation": "Helmet configures HTTP headers (e.g. X-Content-Type-Options, X-Frame-Options) for defense-in-depth.",
        "points": 10
    }
],
  });

  const beL6_Assessment = await ActivityModel.create({
    lessonId: beL6._id,
    type: 'QUIZ',
    title: `Assessment: Backend Security Hardening`,
    order: 4,
    assessmentRef: beL6_Quiz._id,
  });
  beL6_Quiz.activityId = beL6_Assessment._id;
  await beL6_Quiz.save();

  beL6.activities = [
    beL6_Video._id,
    beL6_Notes._id,
    beL6_Practice._id,
    beL6_Assessment._id,
  ] as any;
  await beL6.save();

  beMod3.lessons = [beL5._id, beL6._id] as any;
  await beMod3.save();

  backendCourse.modules = [beMod1._id, beMod2._id, beMod3._id] as any;
  await backendCourse.save();

  // =========================================================================
  // 5. REACT DEEP DIVE & PERFORMANCE
  // =========================================================================
  const reactCourse = await CourseModel.create({
    slug: 'react-js',
    title: 'React Deep Dive & Component Performance',
    description: 'Master component architecture, virtual DOM reconciliation, state immutability, custom hooks, and performance tuning with useMemo and useCallback.',
    domain: 'Web Development',
    level: 'BEGINNER',
    status: 'PUBLISHED',
    estimatedHours: 40,
    skillsCovered: ['react-state', 'react-hooks', 'javascript-fundamentals'],
    prerequisites: ['JavaScript Fundamentals'],
    modules: [],
  });

  const reactMod1 = await ModuleModel.create({
    courseId: reactCourse._id,
    title: `Module 1: React Fundamentals & Virtual DOM`,
    description: `JSX transformations, component hierarchies, props, and virtual DOM diffing.`,
    order: 1,
    lessons: [],
  });

  // --- Lesson 1: JSX Transformations & Virtual DOM Reconciliation ---
  const reactL1 = await LessonModel.create({
    moduleId: reactMod1._id,
    courseId: reactCourse._id,
    title: `JSX Transformations & Virtual DOM Reconciliation`,
    description: `Understand how JSX compiles to React.createElement and how virtual DOM diffing optimizes rendering.`,
    order: 1,
    activities: [],
  });

  const reactL1_Video = await ActivityModel.create({
    lessonId: reactL1._id,
    type: 'VIDEO',
    title: `Video: React.js Full Course for Beginners`,
    order: 1,
    resourceRef: getRes('JSX and Virtual DOM in React JS in Tamil')?._id,
    content: `# Virtual DOM Reconciliation:\\n- React creates a virtual DOM tree in memory.\\n- On state change, diffing algorithms compute minimal real DOM mutations.`,
  });

  const reactL1_Notes = await ActivityModel.create({
    lessonId: reactL1._id,
    type: 'NOTES',
    title: `Codexa Notes: JSX Transformations & Virtual DOM Reconciliation`,
    order: 2,
    content: `# JSX Transformations & Virtual DOM Reconciliation

Understand how JSX compiles to React.createElement and how virtual DOM diffing optimizes rendering.

JSX is syntactic sugar for \`React.createElement\`:

\`\`\`jsx
// JSX
const element = <h1 className="title">Hello Codexa</h1>;

// Compiles to:
const element = React.createElement('h1', { className: 'title' }, 'Hello Codexa');
\`\`\`

## Why JSX Transformations & Virtual DOM Reconciliation Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Convert camelCase to kebab-case and join with semicolons.

> ⚠️ **Common Mistake**: Keys allow React's diffing algorithm to match elements across renders without recreating entire DOM subtrees.

## Real-World Production Scenario

In production engineering, **JSX Transformations & Virtual DOM Reconciliation** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of JSX Transformations & Virtual DOM Reconciliation. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('React.dev: Describing the UI')?._id,
  });

  const reactL1_Challenge = await ChallengeModel.create({
    title: `Convert Props Object to Style String`,
    description: `Implement \`propsToStyleString(props)\` converting \`{ color: 'red', fontSize: '14px' }\` to \`'color: red; font-size: 14px;'\`.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function propsToStyleString(props) {
  // Your code here
  return '';
}

module.exports = propsToStyleString;
`,
    solutionCode: `function propsToStyleString(props) {
  if (!props || typeof props !== 'object') return '';
  return Object.entries(props)
    .map(([k, v]) => {
      const kebab = k.replace(/([A-Z])/g, '-$1').toLowerCase();
      return \`\${kebab}: \${v};\`;
    })
    .join(' ');
}

module.exports = propsToStyleString;
`,
    hints: ["Convert camelCase to kebab-case and join with semicolons."],
    skills: [{"skillId": "react-state", "weight": 1.0}],
    testCases: [{"input": "[{\"color\": \"red\", \"fontSize\": \"14px\"}]", "expectedOutput": "\"color: red; font-size: 14px;\"", "description": "Converts props to style string", "hidden": false}],
  });

  const reactL1_Practice = await ActivityModel.create({
    lessonId: reactL1._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Convert Props Object to Style String`,
    order: 3,
    challengeRef: reactL1_Challenge._id,
    content: `# Code Practice: Convert Props Object to Style String\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  reactL1_Challenge.activityId = reactL1_Practice._id;
  await reactL1_Challenge.save();

  const reactL1_Quiz = await AssessmentModel.create({
    title: `Assessment: Virtual DOM Reconciliation`,
    description: `Test understanding of React virtual DOM.`,
    passingScore: 70,
    skills: [{"skillId": "react-state", "weight": 1.0}],
    questions: [
    {
        "question": "Why are key props necessary when rendering dynamic lists in React?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "To apply CSS styles to list items",
            "To give React a stable identity to differentiate which items changed, moved, or were deleted across re-renders",
            "To enable local database indexing",
            "To make the list scrollable"
        ],
        "correctOption": 1,
        "explanation": "Keys allow React's diffing algorithm to match elements across renders without recreating entire DOM subtrees.",
        "points": 10
    }
],
  });

  const reactL1_Assessment = await ActivityModel.create({
    lessonId: reactL1._id,
    type: 'QUIZ',
    title: `Assessment: Virtual DOM Reconciliation`,
    order: 4,
    assessmentRef: reactL1_Quiz._id,
  });
  reactL1_Quiz.activityId = reactL1_Assessment._id;
  await reactL1_Quiz.save();

  reactL1.activities = [
    reactL1_Video._id,
    reactL1_Notes._id,
    reactL1_Practice._id,
    reactL1_Assessment._id,
  ] as any;
  await reactL1.save();

  // --- Lesson 2: Component Props & Pure Rendering Patterns ---
  const reactL2 = await LessonModel.create({
    moduleId: reactMod1._id,
    courseId: reactCourse._id,
    title: `Component Props & Pure Rendering Patterns`,
    description: `Keep React components pure, avoid mutations, and structure reusable UI building blocks.`,
    order: 2,
    activities: [],
  });

  const reactL2_Video = await ActivityModel.create({
    lessonId: reactL2._id,
    type: 'VIDEO',
    title: `Video: Pure Components & Props Contract in React`,
    order: 1,
    resourceRef: getRes('Props and PropTypes in React JS in Tamil')?._id,
    content: `# Pure Components:\\n- Given the same props, a component should always render the same JSX.\\n- Never mutate variables declared outside the component during render.`,
  });

  const reactL2_Notes = await ActivityModel.create({
    lessonId: reactL2._id,
    type: 'NOTES',
    title: `Codexa Notes: Component Props & Pure Rendering Patterns`,
    order: 2,
    content: `# Component Props & Pure Rendering Patterns

Keep React components pure, avoid mutations, and structure reusable UI building blocks.

React assumes components are pure functions:
1. It minds its own business: it does not change any objects or variables that existed before rendering.
2. Same inputs, same output: Given the same props and state, a component should always return the same JSX.

## Why Component Props & Pure Rendering Patterns Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`javascript
function filterValidChildren(children) {
  if (!Array.isArray(children)) return [];
  return children.filter(c => c !== null && c !== undefined && c !== false);
}

module.exports = filterValidChildren;
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Filter out null, undefined, and false.

> ⚠️ **Common Mistake**: Side effects like HTTP calls or global mutations must be placed inside useEffect or event handlers, never in the render body.

## Real-World Production Scenario

In production engineering, **Component Props & Pure Rendering Patterns** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Component Props & Pure Rendering Patterns. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('React.dev: Describing the UI')?._id,
  });

  const reactL2_Challenge = await ChallengeModel.create({
    title: `Filter Valid Child Components`,
    description: `Implement \`filterValidChildren(childrenArray)\` that removes \`null\`, \`undefined\`, and \`false\` values from child arrays.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function filterValidChildren(children) {
  // Your code here
  return [];
}

module.exports = filterValidChildren;
`,
    solutionCode: `function filterValidChildren(children) {
  if (!Array.isArray(children)) return [];
  return children.filter(c => c !== null && c !== undefined && c !== false);
}

module.exports = filterValidChildren;
`,
    hints: ["Filter out null, undefined, and false."],
    skills: [{"skillId": "react-state", "weight": 1.0}],
    testCases: [{"input": "[[\"Header\", null, false, \"Footer\"]]", "expectedOutput": "[\"Header\",\"Footer\"]", "description": "Filters out invalid children", "hidden": false}],
  });

  const reactL2_Practice = await ActivityModel.create({
    lessonId: reactL2._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Filter Valid Child Components`,
    order: 3,
    challengeRef: reactL2_Challenge._id,
    content: `# Code Practice: Filter Valid Child Components\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  reactL2_Challenge.activityId = reactL2_Practice._id;
  await reactL2_Challenge.save();

  const reactL2_Quiz = await AssessmentModel.create({
    title: `Assessment: Component Purity`,
    description: `Test comprehension of React rendering purity.`,
    passingScore: 70,
    skills: [{"skillId": "react-state", "weight": 1.0}],
    questions: [
    {
        "question": "What is a side effect in React that must NEVER occur directly during the render phase?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Returning JSX markup",
            "Mutating a global variable or triggering an HTTP request directly in the component body",
            "Destructuring props",
            "Creating local constants"
        ],
        "correctOption": 1,
        "explanation": "Side effects like HTTP calls or global mutations must be placed inside useEffect or event handlers, never in the render body.",
        "points": 10
    }
],
  });

  const reactL2_Assessment = await ActivityModel.create({
    lessonId: reactL2._id,
    type: 'QUIZ',
    title: `Assessment: Component Purity`,
    order: 4,
    assessmentRef: reactL2_Quiz._id,
  });
  reactL2_Quiz.activityId = reactL2_Assessment._id;
  await reactL2_Quiz.save();

  reactL2.activities = [
    reactL2_Video._id,
    reactL2_Notes._id,
    reactL2_Practice._id,
    reactL2_Assessment._id,
  ] as any;
  await reactL2.save();

  reactMod1.lessons = [reactL1._id, reactL2._id] as any;
  await reactMod1.save();

  const reactMod2 = await ModuleModel.create({
    courseId: reactCourse._id,
    title: `Module 2: State Management & useEffect Lifecycle`,
    description: `useState, state immutability, useEffect subscriptions, and cleanup functions.`,
    order: 2,
    lessons: [],
  });

  // --- Lesson 1: useState & Immutable State Updates ---
  const reactL3 = await LessonModel.create({
    moduleId: reactMod2._id,
    courseId: reactCourse._id,
    title: `useState & Immutable State Updates`,
    description: `Manage reactive state and update arrays and objects immutably using the spread operator (...).`,
    order: 1,
    activities: [],
  });

  const reactL3_Video = await ActivityModel.create({
    lessonId: reactL3._id,
    type: 'VIDEO',
    title: `Video: Managing State in React with useState`,
    order: 1,
    resourceRef: getRes('useState Hook and State Batching in Tamil')?._id,
    content: `# State Immutability:\\n- Treat state as read-only.\\n- Always create a fresh object or array using spread syntax (...state) when updating.`,
  });

  const reactL3_Notes = await ActivityModel.create({
    lessonId: reactL3._id,
    type: 'NOTES',
    title: `Codexa Notes: useState & Immutable State Updates`,
    order: 2,
    content: `# useState & Immutable State Updates

Manage reactive state and update arrays and objects immutably using the spread operator (...).

\`\`\`jsx
// Updating an object in state
setUser(prev => ({
  ...prev,
  name: 'Alex Rivera'
}));

// Updating an array in state
setItems(prev => [...prev, newItem]);
\`\`\`

## Why useState & Immutable State Updates Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use map to return updated objects immutably.

> ⚠️ **Common Mistake**: React checks Object.is(oldState, newState); since the array reference hasn't changed, React skips re-rendering.

## Real-World Production Scenario

In production engineering, **useState & Immutable State Updates** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of useState & Immutable State Updates. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('React.dev: Managing State')?._id,
  });

  const reactL3_Challenge = await ChallengeModel.create({
    title: `Immutable Array Item Updater`,
    description: `Implement \`updateItemInArray(arr, targetId, updatedFields)\` returning a new array with the target object updated without mutating the original array.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function updateItemInArray(arr, targetId, updatedFields) {
  // Your code here
  return arr;
}

module.exports = updateItemInArray;
`,
    solutionCode: `function updateItemInArray(arr, targetId, updatedFields) {
  if (!Array.isArray(arr)) return [];
  return arr.map(item => item.id === targetId ? { ...item, ...updatedFields } : item);
}

module.exports = updateItemInArray;
`,
    hints: ["Use map to return updated objects immutably."],
    skills: [{"skillId": "react-state", "weight": 1.0}],
    testCases: [{"input": "[[{\"id\": 1, \"title\": \"Old\"}, {\"id\": 2, \"title\": \"Keep\"}], 1, {\"title\": \"New\"}]", "expectedOutput": "[{\"id\":1,\"title\":\"New\"},{\"id\":2,\"title\":\"Keep\"}]", "description": "Updates target item immutably", "hidden": false}],
  });

  const reactL3_Practice = await ActivityModel.create({
    lessonId: reactL3._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Immutable Array Item Updater`,
    order: 3,
    challengeRef: reactL3_Challenge._id,
    content: `# Code Practice: Immutable Array Item Updater\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  reactL3_Challenge.activityId = reactL3_Practice._id;
  await reactL3_Challenge.save();

  const reactL3_Quiz = await AssessmentModel.create({
    title: `Assessment: State Immutability`,
    description: `Test React state updating principles.`,
    passingScore: 70,
    skills: [{"skillId": "react-state", "weight": 1.0}],
    questions: [
    {
        "question": "Why does calling array.push(item) followed by setList(array) often fail to re-render a React component?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "React does not support arrays",
            "React compares previous and new state by shallow reference; mutating the same array does not change its reference",
            "push is not valid JavaScript",
            "It causes a compiler warning"
        ],
        "correctOption": 1,
        "explanation": "React checks Object.is(oldState, newState); since the array reference hasn't changed, React skips re-rendering.",
        "points": 10
    }
],
  });

  const reactL3_Assessment = await ActivityModel.create({
    lessonId: reactL3._id,
    type: 'QUIZ',
    title: `Assessment: State Immutability`,
    order: 4,
    assessmentRef: reactL3_Quiz._id,
  });
  reactL3_Quiz.activityId = reactL3_Assessment._id;
  await reactL3_Quiz.save();

  reactL3.activities = [
    reactL3_Video._id,
    reactL3_Notes._id,
    reactL3_Practice._id,
    reactL3_Assessment._id,
  ] as any;
  await reactL3.save();

  // --- Lesson 2: useEffect Lifecycle, Dependencies & Cleanup ---
  const reactL4 = await LessonModel.create({
    moduleId: reactMod2._id,
    courseId: reactCourse._id,
    title: `useEffect Lifecycle, Dependencies & Cleanup`,
    description: `Synchronize with external systems, manage dependency arrays, and prevent memory leaks with cleanup functions.`,
    order: 2,
    activities: [],
  });

  const reactL4_Video = await ActivityModel.create({
    lessonId: reactL4._id,
    type: 'VIDEO',
    title: `Video: Synchronizing with Effects & Cleanup`,
    order: 1,
    resourceRef: getRes('useEffect Hook Deep Dive in Tamil')?._id,
    content: `# useEffect Rules:\\n- Include all reactive values used inside the effect in the dependency array.\\n- Always return a cleanup function for timers, sockets, or event listeners.`,
  });

  const reactL4_Notes = await ActivityModel.create({
    lessonId: reactL4._id,
    type: 'NOTES',
    title: `Codexa Notes: useEffect Lifecycle, Dependencies & Cleanup`,
    order: 2,
    content: `# useEffect Lifecycle, Dependencies & Cleanup

Synchronize with external systems, manage dependency arrays, and prevent memory leaks with cleanup functions.

\`\`\`jsx
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);

  // Cleanup subscription on unmount
  return () => window.removeEventListener('resize', handleResize);
}, []); // Empty dependency array: runs once on mount
\`\`\`

## Why useEffect Lifecycle, Dependencies & Cleanup Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Compare corresponding elements in arrays using Object.is.

> ⚠️ **Common Mistake**: Cleanup functions run prior to re-executing the effect and upon component unmounting.

## Real-World Production Scenario

In production engineering, **useEffect Lifecycle, Dependencies & Cleanup** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of useEffect Lifecycle, Dependencies & Cleanup. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('React.dev: Managing State')?._id,
  });

  const reactL4_Challenge = await ChallengeModel.create({
    title: `Simulate Effect Dependency Trigger`,
    description: `Implement \`shouldEffectRun(prevDeps, nextDeps)\` returning \`true\` if any dependency value changed (shallow equality), else \`false\`.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function shouldEffectRun(prevDeps, nextDeps) {
  // Your code here
  return false;
}

module.exports = shouldEffectRun;
`,
    solutionCode: `function shouldEffectRun(prevDeps, nextDeps) {
  if (!prevDeps || !nextDeps) return true;
  if (prevDeps.length !== nextDeps.length) return true;
  for (let i = 0; i < prevDeps.length; i++) {
    if (!Object.is(prevDeps[i], nextDeps[i])) return true;
  }
  return false;
}

module.exports = shouldEffectRun;
`,
    hints: ["Compare corresponding elements in arrays using Object.is."],
    skills: [{"skillId": "react-hooks", "weight": 1.0}],
    testCases: [{"input": "[[1, \"active\"], [1, \"inactive\"]]", "expectedOutput": "true", "description": "Triggers effect on dependency change", "hidden": false}],
  });

  const reactL4_Practice = await ActivityModel.create({
    lessonId: reactL4._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Simulate Effect Dependency Trigger`,
    order: 3,
    challengeRef: reactL4_Challenge._id,
    content: `# Code Practice: Simulate Effect Dependency Trigger\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  reactL4_Challenge.activityId = reactL4_Practice._id;
  await reactL4_Challenge.save();

  const reactL4_Quiz = await AssessmentModel.create({
    title: `Assessment: useEffect Dependencies`,
    description: `Test understanding of effect triggers and cleanup.`,
    passingScore: 70,
    skills: [{"skillId": "react-hooks", "weight": 1.0}],
    questions: [
    {
        "question": "When does the cleanup function returned by a useEffect hook execute?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Only when the application crashes",
            "Before the effect re-runs with new dependencies and when the component unmounts",
            "Immediately before the initial render",
            "Whenever any global variable changes"
        ],
        "correctOption": 1,
        "explanation": "Cleanup functions run prior to re-executing the effect and upon component unmounting.",
        "points": 10
    }
],
  });

  const reactL4_Assessment = await ActivityModel.create({
    lessonId: reactL4._id,
    type: 'QUIZ',
    title: `Assessment: useEffect Dependencies`,
    order: 4,
    assessmentRef: reactL4_Quiz._id,
  });
  reactL4_Quiz.activityId = reactL4_Assessment._id;
  await reactL4_Quiz.save();

  reactL4.activities = [
    reactL4_Video._id,
    reactL4_Notes._id,
    reactL4_Practice._id,
    reactL4_Assessment._id,
  ] as any;
  await reactL4.save();

  reactMod2.lessons = [reactL3._id, reactL4._id] as any;
  await reactMod2.save();

  const reactMod3 = await ModuleModel.create({
    courseId: reactCourse._id,
    title: `Module 3: Custom Hooks & Performance Optimization`,
    description: `Extract reusable logic into custom hooks and optimize renders with useMemo, useCallback, and React.memo.`,
    order: 3,
    lessons: [],
  });

  // --- Lesson 1: Building Reusable Custom React Hooks ---
  const reactL5 = await LessonModel.create({
    moduleId: reactMod3._id,
    courseId: reactCourse._id,
    title: `Building Reusable Custom React Hooks`,
    description: `Extract complex component state logic into reusable functions prefixed with use*.`,
    order: 1,
    activities: [],
  });

  const reactL5_Video = await ActivityModel.create({
    lessonId: reactL5._id,
    type: 'VIDEO',
    title: `Video: Building Reusable Custom Hooks in React`,
    order: 1,
    resourceRef: getRes('React Custom Hooks and useReducer in Tamil')?._id,
    content: `# Custom Hooks:\\n- Custom hooks must start with 'use' (e.g. useLocalStorage, useWindowSize).\\n- They share stateful logic between components, not actual state instances.`,
  });

  const reactL5_Notes = await ActivityModel.create({
    lessonId: reactL5._id,
    type: 'NOTES',
    title: `Codexa Notes: Building Reusable Custom React Hooks`,
    order: 2,
    content: `# Building Reusable Custom React Hooks

Extract complex component state logic into reusable functions prefixed with use*.

Custom hooks let you extract component logic into reusable functions:

\`\`\`jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue];
}
\`\`\`

## Why Building Reusable Custom React Hooks Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Check name starts with 'use' and char at index 3 is uppercase.

> ⚠️ **Common Mistake**: Custom hooks reuse stateful logic; every component call gets an isolated state instance.

## Real-World Production Scenario

In production engineering, **Building Reusable Custom React Hooks** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Building Reusable Custom React Hooks. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('React.dev: Managing State')?._id,
  });

  const reactL5_Challenge = await ChallengeModel.create({
    title: `Hook Name Validator`,
    description: `Implement \`isValidHookName(name)\` returning \`true\` if name starts with 'use' followed by an uppercase letter (e.g. 'useAuth', 'useFetch').`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function isValidHookName(name) {
  // Your code here
  return false;
}

module.exports = isValidHookName;
`,
    solutionCode: `function isValidHookName(name) {
  if (!name || typeof name !== 'string') return false;
  if (!name.startsWith('use') || name.length < 4) return false;
  return name[3] === name[3].toUpperCase() && name[3] !== name[3].toLowerCase();
}

module.exports = isValidHookName;
`,
    hints: ["Check name starts with 'use' and char at index 3 is uppercase."],
    skills: [{"skillId": "react-hooks", "weight": 1.0}],
    testCases: [{"input": "[\"useFetch\"]", "expectedOutput": "true", "description": "Validates proper custom hook name", "hidden": false}],
  });

  const reactL5_Practice = await ActivityModel.create({
    lessonId: reactL5._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Hook Name Validator`,
    order: 3,
    challengeRef: reactL5_Challenge._id,
    content: `# Code Practice: Hook Name Validator\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  reactL5_Challenge.activityId = reactL5_Practice._id;
  await reactL5_Challenge.save();

  const reactL5_Quiz = await AssessmentModel.create({
    title: `Assessment: Custom Hooks`,
    description: `Test rules of hooks and custom hook composition.`,
    passingScore: 70,
    skills: [{"skillId": "react-hooks", "weight": 1.0}],
    questions: [
    {
        "question": "If two separate components invoke the same custom hook useToggle(), do they share the same state variable value?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Yes, custom hooks are global singletons",
            "No, custom hooks share stateful logic, but each component call receives its own independent state",
            "Only if wrapped in a Context Provider",
            "Yes, but only in production"
        ],
        "correctOption": 1,
        "explanation": "Custom hooks reuse stateful logic; every component call gets an isolated state instance.",
        "points": 10
    }
],
  });

  const reactL5_Assessment = await ActivityModel.create({
    lessonId: reactL5._id,
    type: 'QUIZ',
    title: `Assessment: Custom Hooks`,
    order: 4,
    assessmentRef: reactL5_Quiz._id,
  });
  reactL5_Quiz.activityId = reactL5_Assessment._id;
  await reactL5_Quiz.save();

  reactL5.activities = [
    reactL5_Video._id,
    reactL5_Notes._id,
    reactL5_Practice._id,
    reactL5_Assessment._id,
  ] as any;
  await reactL5.save();

  // --- Lesson 2: Performance Tuning: useMemo, useCallback & React.memo ---
  const reactL6 = await LessonModel.create({
    moduleId: reactMod3._id,
    courseId: reactCourse._id,
    title: `Performance Tuning: useMemo, useCallback & React.memo`,
    description: `Avoid redundant expensive calculations and unnecessary child re-renders with memoization.`,
    order: 2,
    activities: [],
  });

  const reactL6_Video = await ActivityModel.create({
    lessonId: reactL6._id,
    type: 'VIDEO',
    title: `Video: React Performance Optimization & Memoization`,
    order: 1,
    resourceRef: getRes('React.js Complete Tutorial in Tamil')?._id,
    content: `# Memoization Strategies:\\n- useMemo caches calculated values.\\n- useCallback caches function definitions to prevent breaking child React.memo.`,
  });

  const reactL6_Notes = await ActivityModel.create({
    lessonId: reactL6._id,
    type: 'NOTES',
    title: `Codexa Notes: Performance Tuning: useMemo, useCallback & React.memo`,
    order: 2,
    content: `# Performance Tuning: useMemo, useCallback & React.memo

Avoid redundant expensive calculations and unnecessary child re-renders with memoization.

- \`useMemo(() => computeExpensiveValue(a, b), [a, b])\`: Memoizes calculation results.
- \`useCallback((id) => handleClick(id), [])\`: Memoizes callback references across renders.
- \`React.memo(Component)\`: Prevents re-rendering if incoming props have not changed.

## Why Performance Tuning: useMemo, useCallback & React.memo Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`javascript
function createMemoizedFunction(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

module.exports = createMemoizedFunction;
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Use JSON.stringify(args) as cache key in Map.

> ⚠️ **Common Mistake**: useCallback preserves function reference equality, preventing memoized child components from re-rendering.

## Real-World Production Scenario

In production engineering, **Performance Tuning: useMemo, useCallback & React.memo** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Performance Tuning: useMemo, useCallback & React.memo. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('React.dev: Managing State')?._id,
  });

  const reactL6_Challenge = await ChallengeModel.create({
    title: `Simple Memoization Cache`,
    description: `Implement \`createMemoizedFunction(fn)\` that caches the results of function calls based on arguments.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function createMemoizedFunction(fn) {
  const cache = new Map();
  return function(...args) {
    // Your code here
    return null;
  };
}

module.exports = createMemoizedFunction;
`,
    solutionCode: `function createMemoizedFunction(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

module.exports = createMemoizedFunction;
`,
    hints: ["Use JSON.stringify(args) as cache key in Map."],
    skills: [{"skillId": "react-hooks", "weight": 1.0}],
    testCases: [{"input": "[]", "expectedOutput": "true", "description": "Caches computation result", "hidden": false}],
  });

  const reactL6_Practice = await ActivityModel.create({
    lessonId: reactL6._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Simple Memoization Cache`,
    order: 3,
    challengeRef: reactL6_Challenge._id,
    content: `# Code Practice: Simple Memoization Cache\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  reactL6_Challenge.activityId = reactL6_Practice._id;
  await reactL6_Challenge.save();

  const reactL6_Quiz = await AssessmentModel.create({
    title: `Assessment: React Memoization`,
    description: `Test optimization patterns.`,
    passingScore: 70,
    skills: [{"skillId": "react-hooks", "weight": 1.0}],
    questions: [
    {
        "question": "When is useCallback primarily beneficial in a React application?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "On every single function in the codebase",
            "When passing callback functions to child components wrapped in React.memo to prevent unnecessary re-renders",
            "To speed up CSS styling",
            "To connect to backend databases"
        ],
        "correctOption": 1,
        "explanation": "useCallback preserves function reference equality, preventing memoized child components from re-rendering.",
        "points": 10
    }
],
  });

  const reactL6_Assessment = await ActivityModel.create({
    lessonId: reactL6._id,
    type: 'QUIZ',
    title: `Assessment: React Memoization`,
    order: 4,
    assessmentRef: reactL6_Quiz._id,
  });
  reactL6_Quiz.activityId = reactL6_Assessment._id;
  await reactL6_Quiz.save();

  reactL6.activities = [
    reactL6_Video._id,
    reactL6_Notes._id,
    reactL6_Practice._id,
    reactL6_Assessment._id,
  ] as any;
  await reactL6.save();

  reactMod3.lessons = [reactL5._id, reactL6._id] as any;
  await reactMod3.save();

  reactCourse.modules = [reactMod1._id, reactMod2._id, reactMod3._id] as any;
  await reactCourse.save();

  return [mernCourse, frontendCourse, backendCourse, reactCourse, nextCourse];
}
