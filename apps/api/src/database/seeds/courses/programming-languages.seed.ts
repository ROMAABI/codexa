import { CourseModel } from '../../models/Course';
import { ModuleModel } from '../../models/Module';
import { LessonModel } from '../../models/Lesson';
import { ActivityModel } from '../../models/Activity';
import { AssessmentModel } from '../../models/Assessment';
import { ChallengeModel } from '../../models/Challenge';

export async function seedProgrammingLanguagesCourses(resourceMap: Map<string, any>) {
  const getRes = (titlePrefix: string) => {
    for (const [title, r] of resourceMap.entries()) {
      if (title.toLowerCase().includes(titlePrefix.toLowerCase())) return r;
    }
    return undefined;
  };

  // =========================================================================
  // 1. JAVASCRIPT FUNDAMENTALS MASTERY (4 MODULES, 8 LESSONS)
  // =========================================================================
  const jsCourse = await CourseModel.create({
    slug: 'javascript-fundamentals',
    title: 'JavaScript Core Foundations & Async Mastery',
    description: 'Master JavaScript from absolute zero to advanced asynchronous programming, closures, prototypes, event loop, and functional pipelines.',
    domain: 'Programming Languages',
    level: 'BEGINNER',
    status: 'PUBLISHED',
    estimatedHours: 40,
    skillsCovered: ['javascript-fundamentals', 'async-javascript'],
    prerequisites: ['Basic computer literacy'],
    modules: [],
  });

  const jsMod1 = await ModuleModel.create({
    courseId: jsCourse._id,
    title: `Module 1: Variables, Data Types & Scope`,
    description: `Primitive types, let/const/var, hoisting, and block vs function scope.`,
    order: 1,
    lessons: [],
  });

  // --- Lesson 1: Understanding JavaScript Functions & Scope ---
  const jsL1 = await LessonModel.create({
    moduleId: jsMod1._id,
    courseId: jsCourse._id,
    title: `Understanding JavaScript Functions & Scope`,
    description: `Function declarations, parameters, return values, and lexical scope.`,
    order: 1,
    activities: [],
  });

  const jsL1_Video = await ActivityModel.create({
    lessonId: jsL1._id,
    type: 'VIDEO',
    title: `Video: JavaScript Functions & Execution Mechanics`,
    order: 1,
    resourceRef: getRes('JavaScript Complete Foundations in Tamil')?._id,
    content: `# JavaScript Functions:\\n- Functions encapsulate reusable logic.\\n- Parameters receive inputs and return statements output values.`,
  });

  const jsL1_Notes = await ActivityModel.create({
    lessonId: jsL1._id,
    type: 'NOTES',
    title: `Codexa Notes: Understanding JavaScript Functions & Scope`,
    order: 2,
    content: `# Understanding JavaScript Functions & Scope

Function declarations, parameters, return values, and lexical scope.

Functions are fundamental building blocks in JavaScript.

\`\`\`javascript
function calculateFinalPrice(basePrice, taxRate = 0.08, discount = 0) {
  if (basePrice < 0) return 0;
  const priceAfterDiscount = Math.max(0, basePrice - discount);
  const total = priceAfterDiscount * (1 + taxRate);
  return Number(total.toFixed(2));
}
\`\`\`

## Why Understanding JavaScript Functions & Scope Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Subtract discount first, then multiply by (1 + taxRate).

> ⚠️ **Common Mistake**: In JavaScript, functions return undefined by default when no return statement is executed.

## Real-World Production Scenario

In production engineering, **Understanding JavaScript Functions & Scope** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Understanding JavaScript Functions & Scope. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MDN Web Docs: JavaScript Functions')?._id,
  });

  const jsL1_Challenge = await ChallengeModel.create({
    title: `Calculate Final Price with Tax and Discount`,
    description: `Implement \`calculateFinalPrice(basePrice, taxRate, discount)\` where \`discount\` is subtracted before \`taxRate\` is applied. Return price rounded to 2 decimal places (or 0 if negative).`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function calculateFinalPrice(basePrice, taxRate = 0.08, discount = 0) {
  // Your code here
  return 0;
}

module.exports = calculateFinalPrice;
`,
    solutionCode: `function calculateFinalPrice(basePrice, taxRate = 0.08, discount = 0) {
  if (basePrice < 0) return 0;
  const discounted = Math.max(0, basePrice - discount);
  const total = discounted * (1 + taxRate);
  return Number(total.toFixed(2));
}

module.exports = calculateFinalPrice;
`,
    hints: ["Subtract discount first, then multiply by (1 + taxRate)."],
    skills: [{"skillId": "javascript-fundamentals", "weight": 1.0}],
    testCases: [{"input": "[100, 0.1, 10]", "expectedOutput": "99", "description": "Calculates discounted taxed price", "hidden": false}],
  });

  const jsL1_Practice = await ActivityModel.create({
    lessonId: jsL1._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Calculate Final Price with Tax and Discount`,
    order: 3,
    challengeRef: jsL1_Challenge._id,
    content: `# Code Practice: Calculate Final Price with Tax and Discount\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  jsL1_Challenge.activityId = jsL1_Practice._id;
  await jsL1_Challenge.save();

  const jsL1_Quiz = await AssessmentModel.create({
    title: `Assessment: JavaScript Functions Mastery`,
    description: `Verify understanding of parameters, return values, and scopes.`,
    passingScore: 70,
    skills: [{"skillId": "javascript-fundamentals", "weight": 1.0}],
    questions: [
    {
        "question": "What is the value of a function that does not contain an explicit return statement?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "null",
            "undefined",
            "0",
            "false"
        ],
        "correctOption": 1,
        "explanation": "In JavaScript, functions return undefined by default when no return statement is executed.",
        "points": 10
    }
],
  });

  const jsL1_Assessment = await ActivityModel.create({
    lessonId: jsL1._id,
    type: 'QUIZ',
    title: `Assessment: JavaScript Functions Mastery`,
    order: 4,
    assessmentRef: jsL1_Quiz._id,
  });
  jsL1_Quiz.activityId = jsL1_Assessment._id;
  await jsL1_Quiz.save();

  jsL1.activities = [
    jsL1_Video._id,
    jsL1_Notes._id,
    jsL1_Practice._id,
    jsL1_Assessment._id,
  ] as any;
  await jsL1.save();

  // --- Lesson 2: Variable Declarations: let, const, var & Hoisting ---
  const jsL2 = await LessonModel.create({
    moduleId: jsMod1._id,
    courseId: jsCourse._id,
    title: `Variable Declarations: let, const, var & Hoisting`,
    description: `Understand temporal dead zone (TDZ), block scope, and mutability rules with const.`,
    order: 2,
    activities: [],
  });

  const jsL2_Video = await ActivityModel.create({
    lessonId: jsL2._id,
    type: 'VIDEO',
    title: `Video: JavaScript let, const, var & TDZ Explained`,
    order: 1,
    resourceRef: getRes('JavaScript Optional Chaining and Nullish Coalescing in Tamil')?._id,
    content: `# Variable Declarations:\\n- const prevents identifier reassignment.\\n- let and const are block-scoped and subject to Temporal Dead Zone.`,
  });

  const jsL2_Notes = await ActivityModel.create({
    lessonId: jsL2._id,
    type: 'NOTES',
    title: `Codexa Notes: Variable Declarations: let, const, var & Hoisting`,
    order: 2,
    content: `# Variable Declarations: let, const, var & Hoisting

Understand temporal dead zone (TDZ), block scope, and mutability rules with const.

- \`var\`: Function-scoped, hoisted and initialized to \`undefined\`.
- \`let\`: Block-scoped \`{ ... }\`, hoisted into Temporal Dead Zone (TDZ).
- \`const\`: Block-scoped, must be initialized at declaration, cannot be reassigned.

## Why Variable Declarations: let, const, var & Hoisting Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`javascript
function getEffectiveValue(outerVal, innerVal, condition) {
  return condition ? innerVal : outerVal;
}

module.exports = getEffectiveValue;
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Use ternary operator.

> ⚠️ **Common Mistake**: Variables declared with let and const exist in the Temporal Dead Zone until their definition is evaluated.

## Real-World Production Scenario

In production engineering, **Variable Declarations: let, const, var & Hoisting** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Variable Declarations: let, const, var & Hoisting. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MDN Web Docs: JavaScript Functions')?._id,
  });

  const jsL2_Challenge = await ChallengeModel.create({
    title: `Detect Block Scope Shadowing`,
    description: `Implement \`getEffectiveValue(outerVal, innerVal, condition)\` returning \`innerVal\` if condition is truthy, else \`outerVal\`.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function getEffectiveValue(outerVal, innerVal, condition) {
  // Your code here
  return outerVal;
}

module.exports = getEffectiveValue;
`,
    solutionCode: `function getEffectiveValue(outerVal, innerVal, condition) {
  return condition ? innerVal : outerVal;
}

module.exports = getEffectiveValue;
`,
    hints: ["Use ternary operator."],
    skills: [{"skillId": "javascript-fundamentals", "weight": 1.0}],
    testCases: [{"input": "[\"global\", \"local\", true]", "expectedOutput": "\"local\"", "description": "Returns shadowed local value", "hidden": false}],
  });

  const jsL2_Practice = await ActivityModel.create({
    lessonId: jsL2._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Detect Block Scope Shadowing`,
    order: 3,
    challengeRef: jsL2_Challenge._id,
    content: `# Code Practice: Detect Block Scope Shadowing\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  jsL2_Challenge.activityId = jsL2_Practice._id;
  await jsL2_Challenge.save();

  const jsL2_Quiz = await AssessmentModel.create({
    title: `Assessment: Scope & Hoisting`,
    description: `Test scope rules and declaration mechanics.`,
    passingScore: 70,
    skills: [{"skillId": "javascript-fundamentals", "weight": 1.0}],
    questions: [
    {
        "question": "What happens when accessing a let variable before its line of declaration?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Returns undefined",
            "Throws ReferenceError due to the Temporal Dead Zone",
            "Returns null",
            "Creates a global variable"
        ],
        "correctOption": 1,
        "explanation": "Variables declared with let and const exist in the Temporal Dead Zone until their definition is evaluated.",
        "points": 10
    }
],
  });

  const jsL2_Assessment = await ActivityModel.create({
    lessonId: jsL2._id,
    type: 'QUIZ',
    title: `Assessment: Scope & Hoisting`,
    order: 4,
    assessmentRef: jsL2_Quiz._id,
  });
  jsL2_Quiz.activityId = jsL2_Assessment._id;
  await jsL2_Quiz.save();

  jsL2.activities = [
    jsL2_Video._id,
    jsL2_Notes._id,
    jsL2_Practice._id,
    jsL2_Assessment._id,
  ] as any;
  await jsL2.save();

  jsMod1.lessons = [jsL1._id, jsL2._id] as any;
  await jsMod1.save();

  const jsMod2 = await ModuleModel.create({
    courseId: jsCourse._id,
    title: `Module 2: Closures & Higher-Order Functions`,
    description: `Lexical environment, closures, currying, and higher-order functions.`,
    order: 2,
    lessons: [],
  });

  // --- Lesson 1: Closures & Lexical Scoping ---
  const jsL3 = await LessonModel.create({
    moduleId: jsMod2._id,
    courseId: jsCourse._id,
    title: `Closures & Lexical Scoping`,
    description: `Understand how inner functions retain access to outer scope variables even after execution finishes.`,
    order: 1,
    activities: [],
  });

  const jsL3_Video = await ActivityModel.create({
    lessonId: jsL3._id,
    type: 'VIDEO',
    title: `Video: JavaScript Closures in Depth`,
    order: 1,
    resourceRef: getRes('JavaScript Functions and Object Methods in Tamil')?._id,
    content: `# Closures:\\n- A closure is the combination of a function bundled together with references to its surrounding lexical state.\\n- Closures enable private state and factory functions.`,
  });

  const jsL3_Notes = await ActivityModel.create({
    lessonId: jsL3._id,
    type: 'NOTES',
    title: `Codexa Notes: Closures & Lexical Scoping`,
    order: 2,
    content: `# Closures & Lexical Scoping

Understand how inner functions retain access to outer scope variables even after execution finishes.

A closure gives an inner function access to an outer function's scope:

\`\`\`javascript
function createCounter(initial = 0) {
  let count = initial;
  return {
    increment: () => ++count,
    decrement: () => --count,
    get: () => count
  };
}
\`\`\`

## Why Closures & Lexical Scoping Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Declare a local count variable in outer scope.

> ⚠️ **Common Mistake**: The JavaScript engine preserves the lexical environment on the heap as long as references exist.

## Real-World Production Scenario

In production engineering, **Closures & Lexical Scoping** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Closures & Lexical Scoping. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MDN Web Docs: JavaScript Functions')?._id,
  });

  const jsL3_Challenge = await ChallengeModel.create({
    title: `Build Closure-Based Counter Factory`,
    description: `Implement \`createCounter(initialVal)\` returning \`{ increment: Function, get: Function }\` where count is encapsulated.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function createCounter(initialVal = 0) {
  // Your code here
  return null;
}

module.exports = createCounter;
`,
    solutionCode: `function createCounter(initialVal = 0) {
  let count = initialVal;
  return {
    increment: () => ++count,
    get: () => count
  };
}

module.exports = createCounter;
`,
    hints: ["Declare a local count variable in outer scope."],
    skills: [{"skillId": "javascript-fundamentals", "weight": 1.0}],
    testCases: [{"input": "[10]", "expectedOutput": "true", "description": "Encapsulates private state", "hidden": false}],
  });

  const jsL3_Practice = await ActivityModel.create({
    lessonId: jsL3._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Build Closure-Based Counter Factory`,
    order: 3,
    challengeRef: jsL3_Challenge._id,
    content: `# Code Practice: Build Closure-Based Counter Factory\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  jsL3_Challenge.activityId = jsL3_Practice._id;
  await jsL3_Challenge.save();

  const jsL3_Quiz = await AssessmentModel.create({
    title: `Assessment: Closures`,
    description: `Test understanding of closure memory and encapsulation.`,
    passingScore: 70,
    skills: [{"skillId": "javascript-fundamentals", "weight": 1.0}],
    questions: [
    {
        "question": "Why does an inner function still have access to outer variables after the outer function has returned?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Variables are copied to localStorage",
            "The function maintains a reference to its lexical environment on the heap (closure)",
            "JavaScript restarts the function",
            "All variables in JS are global"
        ],
        "correctOption": 1,
        "explanation": "The JavaScript engine preserves the lexical environment on the heap as long as references exist.",
        "points": 10
    }
],
  });

  const jsL3_Assessment = await ActivityModel.create({
    lessonId: jsL3._id,
    type: 'QUIZ',
    title: `Assessment: Closures`,
    order: 4,
    assessmentRef: jsL3_Quiz._id,
  });
  jsL3_Quiz.activityId = jsL3_Assessment._id;
  await jsL3_Quiz.save();

  jsL3.activities = [
    jsL3_Video._id,
    jsL3_Notes._id,
    jsL3_Practice._id,
    jsL3_Assessment._id,
  ] as any;
  await jsL3.save();

  // --- Lesson 2: Arrow Functions, this Binding & Currying ---
  const jsL4 = await LessonModel.create({
    moduleId: jsMod2._id,
    courseId: jsCourse._id,
    title: `Arrow Functions, this Binding & Currying`,
    description: `Learn lexical this binding in arrow functions vs dynamic this in standard function calls.`,
    order: 2,
    activities: [],
  });

  const jsL4_Video = await ActivityModel.create({
    lessonId: jsL4._id,
    type: 'VIDEO',
    title: `Video: JavaScript this Keyword & Arrow Functions`,
    order: 1,
    resourceRef: getRes('JavaScript Call Apply and Bind in Tamil')?._id,
    content: `# this Binding:\\n- Standard functions bind this based on how they are called.\\n- Arrow functions inherit this lexically from the enclosing scope.`,
  });

  const jsL4_Notes = await ActivityModel.create({
    lessonId: jsL4._id,
    type: 'NOTES',
    title: `Codexa Notes: Arrow Functions, this Binding & Currying`,
    order: 2,
    content: `# Arrow Functions, this Binding & Currying

Learn lexical this binding in arrow functions vs dynamic this in standard function calls.

Arrow functions do not have their own \`this\`, \`arguments\`, \`super\`, or \`new.target\`:

\`\`\`javascript
const obj = {
  name: 'Codexa',
  greetRegular: function() { return this.name; },
  greetArrow: () => this.name // undefined (lexical window/global)
};
\`\`\`

## Why Arrow Functions, this Binding & Currying Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Return fn(a, b) inside the nested function.

> ⚠️ **Common Mistake**: Arrow functions do not have a this binding of their own; they resolve this in the enclosing lexical context.

## Real-World Production Scenario

In production engineering, **Arrow Functions, this Binding & Currying** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Arrow Functions, this Binding & Currying. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MDN Web Docs: JavaScript Functions')?._id,
  });

  const jsL4_Challenge = await ChallengeModel.create({
    title: `Implement Curry Function`,
    description: `Implement \`curry2(fn)\` that transforms a 2-argument function \`f(a, b)\` into \`f(a)(b)\`.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function curry2(fn) {
  return function(a) {
    return function(b) {
      // Your code here
    };
  };
}

module.exports = curry2;
`,
    solutionCode: `function curry2(fn) {
  return function(a) {
    return function(b) {
      return fn(a, b);
    };
  };
}

module.exports = curry2;
`,
    hints: ["Return fn(a, b) inside the nested function."],
    skills: [{"skillId": "javascript-fundamentals", "weight": 1.0}],
    testCases: [{"input": "[]", "expectedOutput": "true", "description": "Curries 2-arg function", "hidden": false}],
  });

  const jsL4_Practice = await ActivityModel.create({
    lessonId: jsL4._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Implement Curry Function`,
    order: 3,
    challengeRef: jsL4_Challenge._id,
    content: `# Code Practice: Implement Curry Function\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  jsL4_Challenge.activityId = jsL4_Practice._id;
  await jsL4_Challenge.save();

  const jsL4_Quiz = await AssessmentModel.create({
    title: `Assessment: Arrow Functions & this`,
    description: `Test this keyword binding rules.`,
    passingScore: 70,
    skills: [{"skillId": "javascript-fundamentals", "weight": 1.0}],
    questions: [
    {
        "question": "How does an arrow function determine the value of this?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "From the object preceding the dot at invocation time",
            "Lexically from the surrounding scope in which it was defined",
            "It is always set to null",
            "It is bound using the call() method"
        ],
        "correctOption": 1,
        "explanation": "Arrow functions do not have a this binding of their own; they resolve this in the enclosing lexical context.",
        "points": 10
    }
],
  });

  const jsL4_Assessment = await ActivityModel.create({
    lessonId: jsL4._id,
    type: 'QUIZ',
    title: `Assessment: Arrow Functions & this`,
    order: 4,
    assessmentRef: jsL4_Quiz._id,
  });
  jsL4_Quiz.activityId = jsL4_Assessment._id;
  await jsL4_Quiz.save();

  jsL4.activities = [
    jsL4_Video._id,
    jsL4_Notes._id,
    jsL4_Practice._id,
    jsL4_Assessment._id,
  ] as any;
  await jsL4.save();

  jsMod2.lessons = [jsL3._id, jsL4._id] as any;
  await jsMod2.save();

  const jsMod3 = await ModuleModel.create({
    courseId: jsCourse._id,
    title: `Module 3: Objects, Arrays & Functional Pipelines`,
    description: `Destructuring, rest/spread operators, Map, Set, and array method chains.`,
    order: 3,
    lessons: [],
  });

  // --- Lesson 1: Object & Array Destructuring with Rest/Spread ---
  const jsL5 = await LessonModel.create({
    moduleId: jsMod3._id,
    courseId: jsCourse._id,
    title: `Object & Array Destructuring with Rest/Spread`,
    description: `Extract properties with default values and clone collections immutably.`,
    order: 1,
    activities: [],
  });

  const jsL5_Video = await ActivityModel.create({
    lessonId: jsL5._id,
    type: 'VIDEO',
    title: `Video: ES6 Destructuring & Spread Operator`,
    order: 1,
    resourceRef: getRes('JavaScript Array filter Method in Tamil')?._id,
    content: `# Destructuring & Spread:\\n- Destructuring extracts deeply nested properties concisely.\\n- Spread {...obj} creates shallow copies.`,
  });

  const jsL5_Notes = await ActivityModel.create({
    lessonId: jsL5._id,
    type: 'NOTES',
    title: `Codexa Notes: Object & Array Destructuring with Rest/Spread`,
    order: 2,
    content: `# Object & Array Destructuring with Rest/Spread

Extract properties with default values and clone collections immutably.

\`\`\`javascript
// Object Destructuring with default values
const { name, role = 'STUDENT', ...extra } = user;

// Array Spread
const combined = [...listA, ...listB];
\`\`\`

## Why Object & Array Destructuring with Rest/Spread Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Destructure id, email, username with fallback.

> ⚠️ **Common Mistake**: Rest property collects remaining object properties into a new object.

## Real-World Production Scenario

In production engineering, **Object & Array Destructuring with Rest/Spread** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Object & Array Destructuring with Rest/Spread. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MDN Web Docs: Array Transformations')?._id,
  });

  const jsL5_Challenge = await ChallengeModel.create({
    title: `Extract and Rename User Profile Props`,
    description: `Implement \`normalizeProfile(user)\` extracting \`{ id, email, username = email.split('@')[0] }\`.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function normalizeProfile(user) {
  // Your code here
  return {};
}

module.exports = normalizeProfile;
`,
    solutionCode: `function normalizeProfile(user) {
  if (!user || typeof user !== 'object') return {};
  const { id, email, username } = user;
  return {
    id,
    email,
    username: username || (email ? email.split('@')[0] : 'anonymous')
  };
}

module.exports = normalizeProfile;
`,
    hints: ["Destructure id, email, username with fallback."],
    skills: [{"skillId": "javascript-fundamentals", "weight": 1.0}],
    testCases: [{"input": "[{\"id\": 1, \"email\": \"alex@codexa.dev\"}]", "expectedOutput": "{\"id\":1,\"email\":\"alex@codexa.dev\",\"username\":\"alex\"}", "description": "Extracts profile with default username", "hidden": false}],
  });

  const jsL5_Practice = await ActivityModel.create({
    lessonId: jsL5._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Extract and Rename User Profile Props`,
    order: 3,
    challengeRef: jsL5_Challenge._id,
    content: `# Code Practice: Extract and Rename User Profile Props\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  jsL5_Challenge.activityId = jsL5_Practice._id;
  await jsL5_Challenge.save();

  const jsL5_Quiz = await AssessmentModel.create({
    title: `Assessment: Destructuring & Spread`,
    description: `Test destructuring syntax and rest properties.`,
    passingScore: 70,
    skills: [{"skillId": "javascript-fundamentals", "weight": 1.0}],
    questions: [
    {
        "question": "What does const { a, ...rest } = { a: 1, b: 2, c: 3 } assign to rest?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "[2, 3]",
            "{ b: 2, c: 3 }",
            "5",
            "{ a: 1 }"
        ],
        "correctOption": 1,
        "explanation": "Rest property collects remaining object properties into a new object.",
        "points": 10
    }
],
  });

  const jsL5_Assessment = await ActivityModel.create({
    lessonId: jsL5._id,
    type: 'QUIZ',
    title: `Assessment: Destructuring & Spread`,
    order: 4,
    assessmentRef: jsL5_Quiz._id,
  });
  jsL5_Quiz.activityId = jsL5_Assessment._id;
  await jsL5_Quiz.save();

  jsL5.activities = [
    jsL5_Video._id,
    jsL5_Notes._id,
    jsL5_Practice._id,
    jsL5_Assessment._id,
  ] as any;
  await jsL5.save();

  // --- Lesson 2: Advanced Array Methods: Map, Filter, Reduce & FlatMap ---
  const jsL6 = await LessonModel.create({
    moduleId: jsMod3._id,
    courseId: jsCourse._id,
    title: `Advanced Array Methods: Map, Filter, Reduce & FlatMap`,
    description: `Compose functional data pipelines for complex array manipulation.`,
    order: 2,
    activities: [],
  });

  const jsL6_Video = await ActivityModel.create({
    lessonId: jsL6._id,
    type: 'VIDEO',
    title: `Video: Mastering JavaScript Array Methods`,
    order: 1,
    resourceRef: getRes('JavaScript Array map Method in Tamil')?._id,
    content: `# Array Pipelines:\\n- flatMap combines map() and flat(1) in a single pass.\\n- reduce transforms collections into arbitrary structures.`,
  });

  const jsL6_Notes = await ActivityModel.create({
    lessonId: jsL6._id,
    type: 'NOTES',
    title: `Codexa Notes: Advanced Array Methods: Map, Filter, Reduce & FlatMap`,
    order: 2,
    content: `# Advanced Array Methods: Map, Filter, Reduce & FlatMap

Compose functional data pipelines for complex array manipulation.

\`\`\`javascript
const inventory = [
  { category: 'tech', items: ['laptop', 'phone'] },
  { category: 'office', items: ['desk', 'chair'] }
];

const allItems = inventory.flatMap(cat => cat.items);
// ['laptop', 'phone', 'desk', 'chair']
\`\`\`

## Why Advanced Array Methods: Map, Filter, Reduce & FlatMap Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use reduce to build object of arrays.

> ⚠️ **Common Mistake**: flatMap maps each item to an array and flattens the result by 1 level: [1, 2, 2, 4].

## Real-World Production Scenario

In production engineering, **Advanced Array Methods: Map, Filter, Reduce & FlatMap** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Advanced Array Methods: Map, Filter, Reduce & FlatMap. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MDN Web Docs: Array Transformations')?._id,
  });

  const jsL6_Challenge = await ChallengeModel.create({
    title: `Group Items By Key`,
    description: `Implement \`groupByKey(items, key)\` returning an object where keys are property values and values are arrays of matching items.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function groupByKey(items, key) {
  // Your code here
  return {};
}

module.exports = groupByKey;
`,
    solutionCode: `function groupByKey(items, key) {
  if (!Array.isArray(items)) return {};
  return items.reduce((acc, item) => {
    const group = item[key] || 'uncategorized';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
}

module.exports = groupByKey;
`,
    hints: ["Use reduce to build object of arrays."],
    skills: [{"skillId": "javascript-fundamentals", "weight": 1.0}],
    testCases: [{"input": "[[{\"cat\": \"A\", \"v\": 1}, {\"cat\": \"A\", \"v\": 2}], \"cat\"]", "expectedOutput": "{\"A\":[{\"cat\":\"A\",\"v\":1},{\"cat\":\"A\",\"v\":2}]}", "description": "Groups array by key", "hidden": false}],
  });

  const jsL6_Practice = await ActivityModel.create({
    lessonId: jsL6._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Group Items By Key`,
    order: 3,
    challengeRef: jsL6_Challenge._id,
    content: `# Code Practice: Group Items By Key\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  jsL6_Challenge.activityId = jsL6_Practice._id;
  await jsL6_Challenge.save();

  const jsL6_Quiz = await AssessmentModel.create({
    title: `Assessment: Array Pipelines`,
    description: `Test collection transformation methods.`,
    passingScore: 70,
    skills: [{"skillId": "javascript-fundamentals", "weight": 1.0}],
    questions: [
    {
        "question": "What is the result of [1, 2].flatMap(x => [x, x * 2])?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "[[1, 2], [2, 4]]",
            "[1, 2, 2, 4]",
            "[3, 6]",
            "4"
        ],
        "correctOption": 1,
        "explanation": "flatMap maps each item to an array and flattens the result by 1 level: [1, 2, 2, 4].",
        "points": 10
    }
],
  });

  const jsL6_Assessment = await ActivityModel.create({
    lessonId: jsL6._id,
    type: 'QUIZ',
    title: `Assessment: Array Pipelines`,
    order: 4,
    assessmentRef: jsL6_Quiz._id,
  });
  jsL6_Quiz.activityId = jsL6_Assessment._id;
  await jsL6_Quiz.save();

  jsL6.activities = [
    jsL6_Video._id,
    jsL6_Notes._id,
    jsL6_Practice._id,
    jsL6_Assessment._id,
  ] as any;
  await jsL6.save();

  jsMod3.lessons = [jsL5._id, jsL6._id] as any;
  await jsMod3.save();

  const jsMod4 = await ModuleModel.create({
    courseId: jsCourse._id,
    title: `Module 4: Asynchronous JavaScript & Promises`,
    description: `Promise lifecycle, Promise.all/allSettled/race, and async/await syntax.`,
    order: 4,
    lessons: [],
  });

  // --- Lesson 1: Promises Lifecycle: Pending, Fulfilled & Rejected ---
  const jsL7 = await LessonModel.create({
    moduleId: jsMod4._id,
    courseId: jsCourse._id,
    title: `Promises Lifecycle: Pending, Fulfilled & Rejected`,
    description: `Construct custom promises, chain .then() and .catch(), and handle rejections.`,
    order: 1,
    activities: [],
  });

  const jsL7_Video = await ActivityModel.create({
    lessonId: jsL7._id,
    type: 'VIDEO',
    title: `Video: JavaScript Promises in 10 Minutes`,
    order: 1,
    resourceRef: getRes('The JavaScript Event Loop and Microtask Queue')?._id,
    content: `# Promises:\\n- Promises represent future completion of async operations.\\n- A settled promise cannot change state again.`,
  });

  const jsL7_Notes = await ActivityModel.create({
    lessonId: jsL7._id,
    type: 'NOTES',
    title: `Codexa Notes: Promises Lifecycle: Pending, Fulfilled & Rejected`,
    order: 2,
    content: `# Promises Lifecycle: Pending, Fulfilled & Rejected

Construct custom promises, chain .then() and .catch(), and handle rejections.

A Promise is in one of three states:
- \`pending\`: Initial state.
- \`fulfilled\`: Operation completed successfully (\`resolve(value)\`).
- \`rejected\`: Operation failed (\`reject(error)\`).

\`\`\`javascript
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
\`\`\`

## Why Promises Lifecycle: Pending, Fulfilled & Rejected Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use Promise.race([promise, timeoutPromise])

> ⚠️ **Common Mistake**: Promises are permanently locked in their settled state once resolved or rejected.

## Real-World Production Scenario

In production engineering, **Promises Lifecycle: Pending, Fulfilled & Rejected** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Promises Lifecycle: Pending, Fulfilled & Rejected. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MDN Web Docs: JavaScript Event Loop')?._id,
  });

  const jsL7_Challenge = await ChallengeModel.create({
    title: `Promise Timeout Wrapper`,
    description: `Implement \`withTimeout(promise, ms)\` that rejects with \`'TIMEOUT'\` if promise does not settle within \`ms\` milliseconds.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `function withTimeout(promise, ms) {
  // Your code here
  return promise;
}

module.exports = withTimeout;
`,
    solutionCode: `function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('TIMEOUT')), ms);
  });
  return Promise.race([promise, timeout]);
}

module.exports = withTimeout;
`,
    hints: ["Use Promise.race([promise, timeoutPromise])"],
    skills: [{"skillId": "async-javascript", "weight": 1.0}],
    testCases: [{"input": "[]", "expectedOutput": "true", "description": "Races promise against timeout", "hidden": false}],
  });

  const jsL7_Practice = await ActivityModel.create({
    lessonId: jsL7._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Promise Timeout Wrapper`,
    order: 3,
    challengeRef: jsL7_Challenge._id,
    content: `# Code Practice: Promise Timeout Wrapper\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  jsL7_Challenge.activityId = jsL7_Practice._id;
  await jsL7_Challenge.save();

  const jsL7_Quiz = await AssessmentModel.create({
    title: `Assessment: Promises Lifecycle`,
    description: `Test promise states and settlement behavior.`,
    passingScore: 70,
    skills: [{"skillId": "async-javascript", "weight": 1.0}],
    questions: [
    {
        "question": "Once a Promise enters the Fulfilled or Rejected state, can it ever transition to another state?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Yes, it can be reset with promise.retry()",
            "No, promises are immutable once settled",
            "Yes, if called inside a loop",
            "Only in async functions"
        ],
        "correctOption": 1,
        "explanation": "Promises are permanently locked in their settled state once resolved or rejected.",
        "points": 10
    }
],
  });

  const jsL7_Assessment = await ActivityModel.create({
    lessonId: jsL7._id,
    type: 'QUIZ',
    title: `Assessment: Promises Lifecycle`,
    order: 4,
    assessmentRef: jsL7_Quiz._id,
  });
  jsL7_Quiz.activityId = jsL7_Assessment._id;
  await jsL7_Quiz.save();

  jsL7.activities = [
    jsL7_Video._id,
    jsL7_Notes._id,
    jsL7_Practice._id,
    jsL7_Assessment._id,
  ] as any;
  await jsL7.save();

  // --- Lesson 2: Async/Await Syntax & Error Boundaries ---
  const jsL8 = await LessonModel.create({
    moduleId: jsMod4._id,
    courseId: jsCourse._id,
    title: `Async/Await Syntax & Error Boundaries`,
    description: `Write clean sequential asynchronous code with async functions and try/catch blocks.`,
    order: 2,
    activities: [],
  });

  const jsL8_Video = await ActivityModel.create({
    lessonId: jsL8._id,
    type: 'VIDEO',
    title: `Video: Async Await in JavaScript`,
    order: 1,
    resourceRef: getRes('The JavaScript Event Loop and Microtask Queue')?._id,
    content: `# Async/Await:\\n- async functions always return a Promise.\\n- await pauses execution inside the async function until the Promise settles.`,
  });

  const jsL8_Notes = await ActivityModel.create({
    lessonId: jsL8._id,
    type: 'NOTES',
    title: `Codexa Notes: Async/Await Syntax & Error Boundaries`,
    order: 2,
    content: `# Async/Await Syntax & Error Boundaries

Write clean sequential asynchronous code with async functions and try/catch blocks.

\`\`\`javascript
async function loadUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const orders = await fetchOrders(user.id);
    return { user, orders };
  } catch (err) {
    console.error('Failed to load user data:', err);
    throw err;
  }
}
\`\`\`

## Why Async/Await Syntax & Error Boundaries Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use a for...of loop and await each step.

> ⚠️ **Common Mistake**: async functions always wrap their return values in a Promise.

## Real-World Production Scenario

In production engineering, **Async/Await Syntax & Error Boundaries** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Async/Await Syntax & Error Boundaries. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('MDN Web Docs: JavaScript Event Loop')?._id,
  });

  const jsL8_Challenge = await ChallengeModel.create({
    title: `Sequential Async Pipeline Runner`,
    description: `Implement \`async function runSequence(initialValue, asyncFns)\` passing the result of each async function to the next in series.`,
    difficulty: 'EASY',
    language: 'javascript',
    starterCode: `async function runSequence(initialValue, asyncFns) {
  // Your code here
  return initialValue;
}

module.exports = runSequence;
`,
    solutionCode: `async function runSequence(initialValue, asyncFns) {
  let acc = initialValue;
  for (const fn of asyncFns) {
    acc = await fn(acc);
  }
  return acc;
}

module.exports = runSequence;
`,
    hints: ["Use a for...of loop and await each step."],
    skills: [{"skillId": "async-javascript", "weight": 1.0}],
    testCases: [{"input": "[10, []]", "expectedOutput": "10", "description": "Runs empty sequence", "hidden": false}],
  });

  const jsL8_Practice = await ActivityModel.create({
    lessonId: jsL8._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Sequential Async Pipeline Runner`,
    order: 3,
    challengeRef: jsL8_Challenge._id,
    content: `# Code Practice: Sequential Async Pipeline Runner\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  jsL8_Challenge.activityId = jsL8_Practice._id;
  await jsL8_Challenge.save();

  const jsL8_Quiz = await AssessmentModel.create({
    title: `Assessment: Async/Await`,
    description: `Test async/await error handling and control flow.`,
    passingScore: 70,
    skills: [{"skillId": "async-javascript", "weight": 1.0}],
    questions: [
    {
        "question": "What is the return value of an async function that returns a primitive value 42?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "42 (primitive number)",
            "Promise.resolve(42)",
            "undefined",
            "A callback generator"
        ],
        "correctOption": 1,
        "explanation": "async functions always wrap their return values in a Promise.",
        "points": 10
    }
],
  });

  const jsL8_Assessment = await ActivityModel.create({
    lessonId: jsL8._id,
    type: 'QUIZ',
    title: `Assessment: Async/Await`,
    order: 4,
    assessmentRef: jsL8_Quiz._id,
  });
  jsL8_Quiz.activityId = jsL8_Assessment._id;
  await jsL8_Quiz.save();

  jsL8.activities = [
    jsL8_Video._id,
    jsL8_Notes._id,
    jsL8_Practice._id,
    jsL8_Assessment._id,
  ] as any;
  await jsL8.save();

  jsMod4.lessons = [jsL7._id, jsL8._id] as any;
  await jsMod4.save();

  jsCourse.modules = [jsMod1._id, jsMod2._id, jsMod3._id, jsMod4._id] as any;
  await jsCourse.save();

  // =========================================================================
  // 2. PYTHON PROGRAMMING
  // =========================================================================
  const pyCourse = await CourseModel.create({
    slug: 'python-programming',
    title: 'Python for Systems & Backend Engineering',
    description: 'Master Python from scratch: data structures, control flow, functions, OOP, exceptions, file I/O, and backend automation.',
    domain: 'Programming Languages',
    level: 'BEGINNER',
    status: 'PUBLISHED',
    estimatedHours: 45,
    skillsCovered: ['python-programming', 'python-oop-modules'],
    prerequisites: ['Basic computer literacy'],
    modules: [],
  });

  const pyMod1 = await ModuleModel.create({
    courseId: pyCourse._id,
    title: `Module 1: Python Basics & Control Flow`,
    description: `Syntax, variables, data types, conditions, and loops.`,
    order: 1,
    lessons: [],
  });

  // --- Lesson 1: Python Syntax, Variables & Dynamic Typing ---
  const pyL1 = await LessonModel.create({
    moduleId: pyMod1._id,
    courseId: pyCourse._id,
    title: `Python Syntax, Variables & Dynamic Typing`,
    description: `Learn Python indentation, dynamic typing, arithmetic operators, and string formatting (f-strings).`,
    order: 1,
    activities: [],
  });

  const pyL1_Video = await ActivityModel.create({
    lessonId: pyL1._id,
    type: 'VIDEO',
    title: `Video: Python Programming Full Course for Beginners`,
    order: 1,
    resourceRef: getRes('Python Installation and Environment Setup in Tamil')?._id,
    content: `# Python Syntax:\\n- Indentation defines code blocks (no curly braces).\\n- Dynamic typing: variables are bound to values without explicit type declarations.`,
  });

  const pyL1_Notes = await ActivityModel.create({
    lessonId: pyL1._id,
    type: 'NOTES',
    title: `Codexa Notes: Python Syntax, Variables & Dynamic Typing`,
    order: 2,
    content: `# Python Syntax, Variables & Dynamic Typing

Learn Python indentation, dynamic typing, arithmetic operators, and string formatting (f-strings).

\`\`\`python
name = "Alex"
age = 25
is_student = True

# Formatted string (f-string)
message = f"Hello {name}, you are {age} years old."
\`\`\`

## Why Python Syntax, Variables & Dynamic Typing Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use (c * 9/5) + 32

> ⚠️ **Common Mistake**: Python uses whitespace indentation to denote nested block structure.

## Real-World Production Scenario

In production engineering, **Python Syntax, Variables & Dynamic Typing** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Python Syntax, Variables & Dynamic Typing. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Python.org: The Python Tutorial')?._id,
  });

  const pyL1_Challenge = await ChallengeModel.create({
    title: `Python Temperature Converter`,
    description: `Implement \`celsius_to_fahrenheit(c)\` returning \`(c * 9/5) + 32\` rounded to 1 decimal place.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def celsius_to_fahrenheit(c: float) -> float:
    # Your code here
    return 0.0
`,
    solutionCode: `def celsius_to_fahrenheit(c: float) -> float:
    return round((c * 9/5) + 32, 1)
`,
    hints: ["Use (c * 9/5) + 32"],
    skills: [{"skillId": "python-programming", "weight": 1.0}],
    testCases: [{"input": "[0]", "expectedOutput": "32.0", "description": "Freezing point conversion", "hidden": false}, {"input": "[100]", "expectedOutput": "212.0", "description": "Boiling point conversion", "hidden": false}],
  });

  const pyL1_Practice = await ActivityModel.create({
    lessonId: pyL1._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Python Temperature Converter`,
    order: 3,
    challengeRef: pyL1_Challenge._id,
    content: `# Code Practice: Python Temperature Converter\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  pyL1_Challenge.activityId = pyL1_Practice._id;
  await pyL1_Challenge.save();

  const pyL1_Quiz = await AssessmentModel.create({
    title: `Assessment: Python Basics`,
    description: `Test fundamental syntax and typing understanding.`,
    passingScore: 70,
    skills: [{"skillId": "python-programming", "weight": 1.0}],
    questions: [
    {
        "question": "How does Python designate code blocks for functions, loops, and conditions?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Curly braces { }",
            "Consistent indentation (typically 4 spaces)",
            "BEGIN and END keywords",
            "Semicolons"
        ],
        "correctOption": 1,
        "explanation": "Python uses whitespace indentation to denote nested block structure.",
        "points": 10
    }
],
  });

  const pyL1_Assessment = await ActivityModel.create({
    lessonId: pyL1._id,
    type: 'QUIZ',
    title: `Assessment: Python Basics`,
    order: 4,
    assessmentRef: pyL1_Quiz._id,
  });
  pyL1_Quiz.activityId = pyL1_Assessment._id;
  await pyL1_Quiz.save();

  pyL1.activities = [
    pyL1_Video._id,
    pyL1_Notes._id,
    pyL1_Practice._id,
    pyL1_Assessment._id,
  ] as any;
  await pyL1.save();

  // --- Lesson 2: Conditional Logic & Loops (while, for...in) ---
  const pyL2 = await LessonModel.create({
    moduleId: pyMod1._id,
    courseId: pyCourse._id,
    title: `Conditional Logic & Loops (while, for...in)`,
    description: `Master if/elif/else branching, while loops, for loops with range(), and break/continue.`,
    order: 2,
    activities: [],
  });

  const pyL2_Video = await ActivityModel.create({
    lessonId: pyL2._id,
    type: 'VIDEO',
    title: `Video: Python Control Flow & Loops`,
    order: 1,
    resourceRef: getRes('Python Variables and Memory References in Tamil')?._id,
    content: `# Control Flow:\\n- if/elif/else evaluates conditions sequentially.\\n- for x in range(start, stop, step) iterates deterministically.`,
  });

  const pyL2_Notes = await ActivityModel.create({
    lessonId: pyL2._id,
    type: 'NOTES',
    title: `Codexa Notes: Conditional Logic & Loops (while, for...in)`,
    order: 2,
    content: `# Conditional Logic & Loops (while, for...in)

Master if/elif/else branching, while loops, for loops with range(), and break/continue.

\`\`\`python
for i in range(1, 6):
    if i % 2 == 0:
        print(f"{i} is even")
    else:
        print(f"{i} is odd")
\`\`\`

## Why Conditional Logic & Loops (while, for...in) Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use integer division limit // n.

> ⚠️ **Common Mistake**: range(start, stop, step) excludes the stop value: 2, 4, 6.

## Real-World Production Scenario

In production engineering, **Conditional Logic & Loops (while, for...in)** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Conditional Logic & Loops (while, for...in). In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Python.org: The Python Tutorial')?._id,
  });

  const pyL2_Challenge = await ChallengeModel.create({
    title: `Count Multiples in Range`,
    description: `Implement \`count_multiples(n, limit)\` that counts how many numbers between 1 and limit (inclusive) are divisible by n.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def count_multiples(n: int, limit: int) -> int:
    # Your code here
    return 0
`,
    solutionCode: `def count_multiples(n: int, limit: int) -> int:
    if n <= 0 or limit <= 0:
        return 0
    return limit // n
`,
    hints: ["Use integer division limit // n."],
    skills: [{"skillId": "python-programming", "weight": 1.0}],
    testCases: [{"input": "[3, 10]", "expectedOutput": "3", "description": "Counts multiples of 3 up to 10", "hidden": false}],
  });

  const pyL2_Practice = await ActivityModel.create({
    lessonId: pyL2._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Count Multiples in Range`,
    order: 3,
    challengeRef: pyL2_Challenge._id,
    content: `# Code Practice: Count Multiples in Range\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  pyL2_Challenge.activityId = pyL2_Practice._id;
  await pyL2_Challenge.save();

  const pyL2_Quiz = await AssessmentModel.create({
    title: `Assessment: Python Control Flow`,
    description: `Test condition evaluation and loop termination.`,
    passingScore: 70,
    skills: [{"skillId": "python-programming", "weight": 1.0}],
    questions: [
    {
        "question": "What does range(2, 8, 2) generate in Python?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "[2, 4, 6, 8]",
            "[2, 4, 6]",
            "[2, 8]",
            "[0, 2, 4, 6, 8]"
        ],
        "correctOption": 1,
        "explanation": "range(start, stop, step) excludes the stop value: 2, 4, 6.",
        "points": 10
    }
],
  });

  const pyL2_Assessment = await ActivityModel.create({
    lessonId: pyL2._id,
    type: 'QUIZ',
    title: `Assessment: Python Control Flow`,
    order: 4,
    assessmentRef: pyL2_Quiz._id,
  });
  pyL2_Quiz.activityId = pyL2_Assessment._id;
  await pyL2_Quiz.save();

  pyL2.activities = [
    pyL2_Video._id,
    pyL2_Notes._id,
    pyL2_Practice._id,
    pyL2_Assessment._id,
  ] as any;
  await pyL2.save();

  pyMod1.lessons = [pyL1._id, pyL2._id] as any;
  await pyMod1.save();

  const pyMod2 = await ModuleModel.create({
    courseId: pyCourse._id,
    title: `Module 2: Data Structures & Collections`,
    description: `Lists, dictionaries, sets, tuples, and list comprehensions.`,
    order: 2,
    lessons: [],
  });

  // --- Lesson 1: Lists, Tuples & List Comprehensions ---
  const pyL3 = await LessonModel.create({
    moduleId: pyMod2._id,
    courseId: pyCourse._id,
    title: `Lists, Tuples & List Comprehensions`,
    description: `Mutable lists, immutable tuples, slicing [start:stop:step], and concise comprehensions.`,
    order: 1,
    activities: [],
  });

  const pyL3_Video = await ActivityModel.create({
    lessonId: pyL3._id,
    type: 'VIDEO',
    title: `Video: Python Lists, Tuples & Comprehensions`,
    order: 1,
    resourceRef: getRes('Python Online and Local Execution in Tamil')?._id,
    content: `# Collections:\\n- Lists are mutable: [1, 2, 3].\\n- Tuples are immutable: (1, 2, 3).\\n- Comprehensions: [x**2 for x in nums if x > 0].`,
  });

  const pyL3_Notes = await ActivityModel.create({
    lessonId: pyL3._id,
    type: 'NOTES',
    title: `Codexa Notes: Lists, Tuples & List Comprehensions`,
    order: 2,
    content: `# Lists, Tuples & List Comprehensions

Mutable lists, immutable tuples, slicing [start:stop:step], and concise comprehensions.

\`\`\`python
# List comprehension with filtering
numbers = [1, 2, 3, 4, 5, 6]
evens_squared = [x**2 for x in numbers if x % 2 == 0]
# [4, 16, 36]
\`\`\`

## Why Lists, Tuples & List Comprehensions Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use [x**2 for x in nums if x % 2 == 0]

> ⚠️ **Common Mistake**: Tuples are immutable; attempting to assign to an index throws TypeError.

## Real-World Production Scenario

In production engineering, **Lists, Tuples & List Comprehensions** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Lists, Tuples & List Comprehensions. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Python.org: The Python Tutorial')?._id,
  });

  const pyL3_Challenge = await ChallengeModel.create({
    title: `Filter and Square Even Numbers`,
    description: `Implement \`square_evens(nums)\` returning a list of squared even numbers.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def square_evens(nums: list) -> list:
    # Your code here
    return []
`,
    solutionCode: `def square_evens(nums: list) -> list:
    return [x**2 for x in nums if x % 2 == 0]
`,
    hints: ["Use [x**2 for x in nums if x % 2 == 0]"],
    skills: [{"skillId": "python-programming", "weight": 1.0}],
    testCases: [{"input": "[[1, 2, 3, 4]]", "expectedOutput": "[4, 16]", "description": "Squares even integers", "hidden": false}],
  });

  const pyL3_Practice = await ActivityModel.create({
    lessonId: pyL3._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Filter and Square Even Numbers`,
    order: 3,
    challengeRef: pyL3_Challenge._id,
    content: `# Code Practice: Filter and Square Even Numbers\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  pyL3_Challenge.activityId = pyL3_Practice._id;
  await pyL3_Challenge.save();

  const pyL3_Quiz = await AssessmentModel.create({
    title: `Assessment: Python Lists & Tuples`,
    description: `Test comprehension of mutability and collection slicing.`,
    passingScore: 70,
    skills: [{"skillId": "python-programming", "weight": 1.0}],
    questions: [
    {
        "question": "What happens when attempting to modify an element in a Python tuple (e.g. t[0] = 5)?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "The tuple updates normally",
            "Python throws a TypeError because tuples are immutable",
            "The tuple converts to a list",
            "It creates a copy"
        ],
        "correctOption": 1,
        "explanation": "Tuples are immutable; attempting to assign to an index throws TypeError.",
        "points": 10
    }
],
  });

  const pyL3_Assessment = await ActivityModel.create({
    lessonId: pyL3._id,
    type: 'QUIZ',
    title: `Assessment: Python Lists & Tuples`,
    order: 4,
    assessmentRef: pyL3_Quiz._id,
  });
  pyL3_Quiz.activityId = pyL3_Assessment._id;
  await pyL3_Quiz.save();

  pyL3.activities = [
    pyL3_Video._id,
    pyL3_Notes._id,
    pyL3_Practice._id,
    pyL3_Assessment._id,
  ] as any;
  await pyL3.save();

  // --- Lesson 2: Dictionaries & Sets: Key-Value Hash Tables ---
  const pyL4 = await LessonModel.create({
    moduleId: pyMod2._id,
    courseId: pyCourse._id,
    title: `Dictionaries & Sets: Key-Value Hash Tables`,
    description: `Fast O(1) lookups with dicts and unique value sets with union and intersection.`,
    order: 2,
    activities: [],
  });

  const pyL4_Video = await ActivityModel.create({
    lessonId: pyL4._id,
    type: 'VIDEO',
    title: `Video: Python Dictionaries & Sets Masterclass`,
    order: 1,
    resourceRef: getRes('Python Visual Studio Code Development in Tamil')?._id,
    content: `# Dictionaries & Sets:\\n- Dictionaries map unique hashable keys to values: {'key': 'val'}.\\n- Sets store unique elements and support set operations (&, |).`,
  });

  const pyL4_Notes = await ActivityModel.create({
    lessonId: pyL4._id,
    type: 'NOTES',
    title: `Codexa Notes: Dictionaries & Sets: Key-Value Hash Tables`,
    order: 2,
    content: `# Dictionaries & Sets: Key-Value Hash Tables

Fast O(1) lookups with dicts and unique value sets with union and intersection.

\`\`\`python
user = {"name": "Alex", "role": "engineer"}
print(user.get("age", 25)) # Safe lookup with default

skills_a = {"python", "sql", "git"}
skills_b = {"react", "python"}
common = skills_a & skills_b # {'python'}
\`\`\`

## Why Dictionaries & Sets: Key-Value Hash Tables Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use dict.get(w, 0) + 1

> ⚠️ **Common Mistake**: dict.get() provides safe fallback without raising unhandled KeyErrors.

## Real-World Production Scenario

In production engineering, **Dictionaries & Sets: Key-Value Hash Tables** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Dictionaries & Sets: Key-Value Hash Tables. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Python.org: The Python Tutorial')?._id,
  });

  const pyL4_Challenge = await ChallengeModel.create({
    title: `Word Frequency Counter`,
    description: `Implement \`word_frequency(words)\` that returns a dictionary mapping each word to its frequency count.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def word_frequency(words: list) -> dict:
    # Your code here
    return {}
`,
    solutionCode: `def word_frequency(words: list) -> dict:
    freq = {}
    for w in words:
        freq[w] = freq.get(w, 0) + 1
    return freq
`,
    hints: ["Use dict.get(w, 0) + 1"],
    skills: [{"skillId": "python-programming", "weight": 1.0}],
    testCases: [{"input": "[[\"apple\", \"banana\", \"apple\"]]", "expectedOutput": "{\"apple\": 2, \"banana\": 1}", "description": "Counts word frequency", "hidden": false}],
  });

  const pyL4_Practice = await ActivityModel.create({
    lessonId: pyL4._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Word Frequency Counter`,
    order: 3,
    challengeRef: pyL4_Challenge._id,
    content: `# Code Practice: Word Frequency Counter\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  pyL4_Challenge.activityId = pyL4_Practice._id;
  await pyL4_Challenge.save();

  const pyL4_Quiz = await AssessmentModel.create({
    title: `Assessment: Dictionaries & Sets`,
    description: `Test dictionary methods and set operations.`,
    passingScore: 70,
    skills: [{"skillId": "python-programming", "weight": 1.0}],
    questions: [
    {
        "question": "Why is user.get('key', default) preferred over user['key'] for accessing dictionary values?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "get() is 100x faster",
            "get() returns the default value without raising a KeyError if the key does not exist",
            "get() converts strings to integers",
            "Bracket notation is deprecated"
        ],
        "correctOption": 1,
        "explanation": "dict.get() provides safe fallback without raising unhandled KeyErrors.",
        "points": 10
    }
],
  });

  const pyL4_Assessment = await ActivityModel.create({
    lessonId: pyL4._id,
    type: 'QUIZ',
    title: `Assessment: Dictionaries & Sets`,
    order: 4,
    assessmentRef: pyL4_Quiz._id,
  });
  pyL4_Quiz.activityId = pyL4_Assessment._id;
  await pyL4_Quiz.save();

  pyL4.activities = [
    pyL4_Video._id,
    pyL4_Notes._id,
    pyL4_Practice._id,
    pyL4_Assessment._id,
  ] as any;
  await pyL4.save();

  pyMod2.lessons = [pyL3._id, pyL4._id] as any;
  await pyMod2.save();

  const pyMod3 = await ModuleModel.create({
    courseId: pyCourse._id,
    title: `Module 3: Functions, Modules & Error Handling`,
    description: `Default arguments, *args, **kwargs, import systems, and try/except/finally.`,
    order: 3,
    lessons: [],
  });

  // --- Lesson 1: Functions, *args & **kwargs Parameter Unpacking ---
  const pyL5 = await LessonModel.create({
    moduleId: pyMod3._id,
    courseId: pyCourse._id,
    title: `Functions, *args & **kwargs Parameter Unpacking`,
    description: `Define flexible functions with positional, keyword, and variable argument packing.`,
    order: 1,
    activities: [],
  });

  const pyL5_Video = await ActivityModel.create({
    lessonId: pyL5._id,
    type: 'VIDEO',
    title: `Video: Python Functions *args and **kwargs`,
    order: 1,
    resourceRef: getRes('Python Keywords and Reserved Names in Tamil')?._id,
    content: `# Function Arguments:\\n- *args packs positional arguments into a tuple.\\n- **kwargs packs keyword arguments into a dictionary.`,
  });

  const pyL5_Notes = await ActivityModel.create({
    lessonId: pyL5._id,
    type: 'NOTES',
    title: `Codexa Notes: Functions, *args & **kwargs Parameter Unpacking`,
    order: 2,
    content: `# Functions, *args & **kwargs Parameter Unpacking

Define flexible functions with positional, keyword, and variable argument packing.

\`\`\`python
def build_config(env, *flags, **settings):
    print("Env:", env)
    print("Flags:", flags)       # tuple
    print("Settings:", settings) # dict
\`\`\`

## Why Functions, *args & **kwargs Parameter Unpacking Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Filter with isinstance(x, (int, float))

> ⚠️ **Common Mistake**: **kwargs captures keyword arguments into a standard dictionary.

## Real-World Production Scenario

In production engineering, **Functions, *args & **kwargs Parameter Unpacking** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Functions, *args & **kwargs Parameter Unpacking. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Python.org: The Python Tutorial')?._id,
  });

  const pyL5_Challenge = await ChallengeModel.create({
    title: `Safe Sum Calculation`,
    description: `Implement \`sum_numbers(*args)\` returning the sum of all numeric arguments, ignoring non-numbers.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def sum_numbers(*args) -> float:
    # Your code here
    return 0.0
`,
    solutionCode: `def sum_numbers(*args) -> float:
    return sum(x for x in args if isinstance(x, (int, float)))
`,
    hints: ["Filter with isinstance(x, (int, float))"],
    skills: [{"skillId": "python-programming", "weight": 1.0}],
    testCases: [{"input": "[1, 2, \"skip\", 3.5]", "expectedOutput": "6.5", "description": "Sums numeric arguments only", "hidden": false}],
  });

  const pyL5_Practice = await ActivityModel.create({
    lessonId: pyL5._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Safe Sum Calculation`,
    order: 3,
    challengeRef: pyL5_Challenge._id,
    content: `# Code Practice: Safe Sum Calculation\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  pyL5_Challenge.activityId = pyL5_Practice._id;
  await pyL5_Challenge.save();

  const pyL5_Quiz = await AssessmentModel.create({
    title: `Assessment: Function Arguments`,
    description: `Test argument packing and parameter ordering.`,
    passingScore: 70,
    skills: [{"skillId": "python-programming", "weight": 1.0}],
    questions: [
    {
        "question": "What data type is received by a function parameter defined with **kwargs?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "List",
            "Dictionary",
            "Tuple",
            "Set"
        ],
        "correctOption": 1,
        "explanation": "**kwargs captures keyword arguments into a standard dictionary.",
        "points": 10
    }
],
  });

  const pyL5_Assessment = await ActivityModel.create({
    lessonId: pyL5._id,
    type: 'QUIZ',
    title: `Assessment: Function Arguments`,
    order: 4,
    assessmentRef: pyL5_Quiz._id,
  });
  pyL5_Quiz.activityId = pyL5_Assessment._id;
  await pyL5_Quiz.save();

  pyL5.activities = [
    pyL5_Video._id,
    pyL5_Notes._id,
    pyL5_Practice._id,
    pyL5_Assessment._id,
  ] as any;
  await pyL5.save();

  // --- Lesson 2: Exception Handling: try, except, else & finally ---
  const pyL6 = await LessonModel.create({
    moduleId: pyMod3._id,
    courseId: pyCourse._id,
    title: `Exception Handling: try, except, else & finally`,
    description: `Gracefully handle runtime errors and manage resource cleanup.`,
    order: 2,
    activities: [],
  });

  const pyL6_Video = await ActivityModel.create({
    lessonId: pyL6._id,
    type: 'VIDEO',
    title: `Video: Python Error & Exception Handling`,
    order: 1,
    resourceRef: getRes('Python User Input and Data Type Casting in Tamil')?._id,
    content: `# Exception Handling:\\n- Catch specific exceptions (ValueError, FileNotFoundError).\\n- finally always executes (ideal for closing connections).`,
  });

  const pyL6_Notes = await ActivityModel.create({
    lessonId: pyL6._id,
    type: 'NOTES',
    title: `Codexa Notes: Exception Handling: try, except, else & finally`,
    order: 2,
    content: `# Exception Handling: try, except, else & finally

Gracefully handle runtime errors and manage resource cleanup.

\`\`\`python
try:
    value = int(user_input)
except ValueError as e:
    print("Invalid integer:", e)
else:
    print("Parsed successfully:", value)
finally:
    print("Execution finished.")
\`\`\`

## Why Exception Handling: try, except, else & finally Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Catch (ZeroDivisionError, TypeError) and return default.

> ⚠️ **Common Mistake**: The else block runs only if the code in the try block ran without any exceptions.

## Real-World Production Scenario

In production engineering, **Exception Handling: try, except, else & finally** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Exception Handling: try, except, else & finally. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Python.org: The Python Tutorial')?._id,
  });

  const pyL6_Challenge = await ChallengeModel.create({
    title: `Safe Division with Fallback`,
    description: `Implement \`safe_divide(a, b, default=0.0)\` that catches ZeroDivisionError and TypeError.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def safe_divide(a, b, default=0.0):
    # Your code here
    return default
`,
    solutionCode: `def safe_divide(a, b, default=0.0):
    try:
        return a / b
    except (ZeroDivisionError, TypeError):
        return default
`,
    hints: ["Catch (ZeroDivisionError, TypeError) and return default."],
    skills: [{"skillId": "python-programming", "weight": 1.0}],
    testCases: [{"input": "[10, 0, -1.0]", "expectedOutput": "-1.0", "description": "Returns fallback on zero division", "hidden": false}],
  });

  const pyL6_Practice = await ActivityModel.create({
    lessonId: pyL6._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Safe Division with Fallback`,
    order: 3,
    challengeRef: pyL6_Challenge._id,
    content: `# Code Practice: Safe Division with Fallback\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  pyL6_Challenge.activityId = pyL6_Practice._id;
  await pyL6_Challenge.save();

  const pyL6_Quiz = await AssessmentModel.create({
    title: `Assessment: Exception Handling`,
    description: `Test try-except blocks and cleanup semantics.`,
    passingScore: 70,
    skills: [{"skillId": "python-programming", "weight": 1.0}],
    questions: [
    {
        "question": "When does the else block of a try...except...else statement execute?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Always after the try block",
            "Only if NO exceptions were raised in the try block",
            "Only when an unhandled exception occurs",
            "Immediately before the finally block"
        ],
        "correctOption": 1,
        "explanation": "The else block runs only if the code in the try block ran without any exceptions.",
        "points": 10
    }
],
  });

  const pyL6_Assessment = await ActivityModel.create({
    lessonId: pyL6._id,
    type: 'QUIZ',
    title: `Assessment: Exception Handling`,
    order: 4,
    assessmentRef: pyL6_Quiz._id,
  });
  pyL6_Quiz.activityId = pyL6_Assessment._id;
  await pyL6_Quiz.save();

  pyL6.activities = [
    pyL6_Video._id,
    pyL6_Notes._id,
    pyL6_Practice._id,
    pyL6_Assessment._id,
  ] as any;
  await pyL6.save();

  pyMod3.lessons = [pyL5._id, pyL6._id] as any;
  await pyMod3.save();

  const pyMod4 = await ModuleModel.create({
    courseId: pyCourse._id,
    title: `Module 4: Object-Oriented Python & File I/O`,
    description: `Classes, __init__, self, inheritance, and context managers (with open).`,
    order: 4,
    lessons: [],
  });

  // --- Lesson 1: Classes, Objects & Dunder Methods ---
  const pyL7 = await LessonModel.create({
    moduleId: pyMod4._id,
    courseId: pyCourse._id,
    title: `Classes, Objects & Dunder Methods`,
    description: `Define classes with __init__, encapsulation, instance methods, and __str__ representation.`,
    order: 1,
    activities: [],
  });

  const pyL7_Video = await ActivityModel.create({
    lessonId: pyL7._id,
    type: 'VIDEO',
    title: `Video: Python Object-Oriented Programming (OOP)`,
    order: 1,
    resourceRef: getRes('Python Complete Reference Course in Tamil')?._id,
    content: `# Python OOP:\\n- self represents the active instance of the class.\\n- __init__ initializes instance attributes upon object creation.`,
  });

  const pyL7_Notes = await ActivityModel.create({
    lessonId: pyL7._id,
    type: 'NOTES',
    title: `Codexa Notes: Classes, Objects & Dunder Methods`,
    order: 2,
    content: `# Classes, Objects & Dunder Methods

Define classes with __init__, encapsulation, instance methods, and __str__ representation.

\`\`\`python
class BankAccount:
    def __init__(self, owner: str, balance: float = 0.0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount: float):
        if amount > 0:
            self.balance += amount
        return self.balance
\`\`\`

## Why Classes, Objects & Dunder Methods Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: area is w * h; perimeter is 2 * (w + h)

> ⚠️ **Common Mistake**: self is the explicit reference to the current instance passed to instance methods.

## Real-World Production Scenario

In production engineering, **Classes, Objects & Dunder Methods** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Classes, Objects & Dunder Methods. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Python.org: The Python Tutorial')?._id,
  });

  const pyL7_Challenge = await ChallengeModel.create({
    title: `Build Rectangle Class`,
    description: `Implement class \`Rectangle\` with \`__init__(self, width, height)\`, \`area()\`, and \`perimeter()\` methods.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `class Rectangle:
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height

    def area(self) -> float:
        # Your code here
        return 0.0

    def perimeter(self) -> float:
        # Your code here
        return 0.0
`,
    solutionCode: `class Rectangle:
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height

    def area(self) -> float:
        return self.width * self.height

    def perimeter(self) -> float:
        return 2 * (self.width + self.height)
`,
    hints: ["area is w * h; perimeter is 2 * (w + h)"],
    skills: [{"skillId": "python-oop-modules", "weight": 1.0}],
    testCases: [{"input": "[5, 10]", "expectedOutput": "true", "description": "Computes rectangle area and perimeter", "hidden": false}],
  });

  const pyL7_Practice = await ActivityModel.create({
    lessonId: pyL7._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Build Rectangle Class`,
    order: 3,
    challengeRef: pyL7_Challenge._id,
    content: `# Code Practice: Build Rectangle Class\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  pyL7_Challenge.activityId = pyL7_Practice._id;
  await pyL7_Challenge.save();

  const pyL7_Quiz = await AssessmentModel.create({
    title: `Assessment: Python OOP Foundations`,
    description: `Test instance creation and method binding.`,
    passingScore: 70,
    skills: [{"skillId": "python-oop-modules", "weight": 1.0}],
    questions: [
    {
        "question": "What is the explicit first parameter required by all instance methods in a Python class?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "this",
            "self",
            "cls",
            "instance"
        ],
        "correctOption": 1,
        "explanation": "self is the explicit reference to the current instance passed to instance methods.",
        "points": 10
    }
],
  });

  const pyL7_Assessment = await ActivityModel.create({
    lessonId: pyL7._id,
    type: 'QUIZ',
    title: `Assessment: Python OOP Foundations`,
    order: 4,
    assessmentRef: pyL7_Quiz._id,
  });
  pyL7_Quiz.activityId = pyL7_Assessment._id;
  await pyL7_Quiz.save();

  pyL7.activities = [
    pyL7_Video._id,
    pyL7_Notes._id,
    pyL7_Practice._id,
    pyL7_Assessment._id,
  ] as any;
  await pyL7.save();

  // --- Lesson 2: File Handling & Context Managers (with open) ---
  const pyL8 = await LessonModel.create({
    moduleId: pyMod4._id,
    courseId: pyCourse._id,
    title: `File Handling & Context Managers (with open)`,
    description: `Read, write, and append files safely using with statements for automatic file descriptor closure.`,
    order: 2,
    activities: [],
  });

  const pyL8_Video = await ActivityModel.create({
    lessonId: pyL8._id,
    type: 'VIDEO',
    title: `Video: Python File Handling & Context Managers`,
    order: 1,
    resourceRef: getRes('Python SQLite Database Connectivity in Tamil')?._id,
    content: `# File I/O:\\n- Always use with open('file.txt', 'r') as f:\\n- Context managers guarantee file closure even if an exception occurs.`,
  });

  const pyL8_Notes = await ActivityModel.create({
    lessonId: pyL8._id,
    type: 'NOTES',
    title: `Codexa Notes: File Handling & Context Managers (with open)`,
    order: 2,
    content: `# File Handling & Context Managers (with open)

Read, write, and append files safely using with statements for automatic file descriptor closure.

\`\`\`python
# Reading a file safely
with open('data.txt', 'r', encoding='utf-8') as f:
    lines = [line.strip() for line in f]

# Writing to a file
with open('output.txt', 'w', encoding='utf-8') as f:
    f.write("Hello Codexa\\n")
\`\`\`

## Why File Handling & Context Managers (with open) Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Split by ',' and strip whitespace from each element.

> ⚠️ **Common Mistake**: The with statement invokes the context manager protocols (__enter__ and __exit__) to guarantee cleanup.

## Real-World Production Scenario

In production engineering, **File Handling & Context Managers (with open)** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of File Handling & Context Managers (with open). In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Python.org: The Python Tutorial')?._id,
  });

  const pyL8_Challenge = await ChallengeModel.create({
    title: `Parse CSV Line Simulator`,
    description: `Implement \`parse_csv_line(line)\` that splits a comma-separated string into stripped values.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def parse_csv_line(line: str) -> list:
    # Your code here
    return []
`,
    solutionCode: `def parse_csv_line(line: str) -> list:
    if not line:
        return []
    return [item.strip() for item in line.split(',')]
`,
    hints: ["Split by ',' and strip whitespace from each element."],
    skills: [{"skillId": "python-oop-modules", "weight": 1.0}],
    testCases: [{"input": "[\"alex, 25, engineer\"]", "expectedOutput": "[\"alex\", \"25\", \"engineer\"]", "description": "Parses and trims CSV fields", "hidden": false}],
  });

  const pyL8_Practice = await ActivityModel.create({
    lessonId: pyL8._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Parse CSV Line Simulator`,
    order: 3,
    challengeRef: pyL8_Challenge._id,
    content: `# Code Practice: Parse CSV Line Simulator\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  pyL8_Challenge.activityId = pyL8_Practice._id;
  await pyL8_Challenge.save();

  const pyL8_Quiz = await AssessmentModel.create({
    title: `Assessment: File I/O & Context Managers`,
    description: `Test file descriptor safety and stream handling.`,
    passingScore: 70,
    skills: [{"skillId": "python-oop-modules", "weight": 1.0}],
    questions: [
    {
        "question": "Why is the with open(...) statement the standard Python best practice for file operations?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "It compresses files into zip format",
            "It automatically calls file.close() upon exiting the block, preventing resource leaks even on errors",
            "It bypasses operating system permissions",
            "It makes file reads 10x faster"
        ],
        "correctOption": 1,
        "explanation": "The with statement invokes the context manager protocols (__enter__ and __exit__) to guarantee cleanup.",
        "points": 10
    }
],
  });

  const pyL8_Assessment = await ActivityModel.create({
    lessonId: pyL8._id,
    type: 'QUIZ',
    title: `Assessment: File I/O & Context Managers`,
    order: 4,
    assessmentRef: pyL8_Quiz._id,
  });
  pyL8_Quiz.activityId = pyL8_Assessment._id;
  await pyL8_Quiz.save();

  pyL8.activities = [
    pyL8_Video._id,
    pyL8_Notes._id,
    pyL8_Practice._id,
    pyL8_Assessment._id,
  ] as any;
  await pyL8.save();

  pyMod4.lessons = [pyL7._id, pyL8._id] as any;
  await pyMod4.save();

  pyCourse.modules = [pyMod1._id, pyMod2._id, pyMod3._id, pyMod4._id] as any;
  await pyCourse.save();

  // =========================================================================
  // 3. MODERN JAVA & OOP ARCHITECTURE
  // =========================================================================
  const javaCourse = await CourseModel.create({
    slug: 'java-programming',
    title: 'Modern Java & Enterprise OOP Architecture',
    description: 'Master Java 17+, strong static typing, object-oriented design patterns, collections framework, generics, exception handling, and functional Streams.',
    domain: 'Programming Languages',
    level: 'BEGINNER',
    status: 'PUBLISHED',
    estimatedHours: 45,
    skillsCovered: ['java-programming', 'java-oop-generics'],
    prerequisites: ['Basic computer literacy'],
    modules: [],
  });

  const javaMod1 = await ModuleModel.create({
    courseId: javaCourse._id,
    title: `Module 1: Java Foundations & Type System`,
    description: `JVM architecture, primitive data types, control flow, and arrays.`,
    order: 1,
    lessons: [],
  });

  // --- Lesson 1: Java Compilation, JVM & Primitive Types ---
  const javaL1 = await LessonModel.create({
    moduleId: javaMod1._id,
    courseId: javaCourse._id,
    title: `Java Compilation, JVM & Primitive Types`,
    description: `Learn how Java compiles byte-code for the JVM and understand strong static typing.`,
    order: 1,
    activities: [],
  });

  const javaL1_Video = await ActivityModel.create({
    lessonId: javaL1._id,
    type: 'VIDEO',
    title: `Video: Java Programming Tutorial for Beginners`,
    order: 1,
    resourceRef: getRes('Introduction to Java and JVM Architecture in Tamil')?._id,
    content: `# Java Foundations:\\n- Java compiles .java source files to .class bytecode.\\n- The JVM provides platform independence (Write Once, Run Anywhere).`,
  });

  const javaL1_Notes = await ActivityModel.create({
    lessonId: javaL1._id,
    type: 'NOTES',
    title: `Codexa Notes: Java Compilation, JVM & Primitive Types`,
    order: 2,
    content: `# Java Compilation, JVM & Primitive Types

Learn how Java compiles byte-code for the JVM and understand strong static typing.

Java is a strongly typed, object-oriented language.

\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        int count = 10;
        double price = 99.95;
        boolean isActive = true;
        System.out.println("Item count: " + count);
    }
}
\`\`\`

## Why Java Compilation, JVM & Primitive Types Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Iterate with enhanced for loop and check n > 0.

> ⚠️ **Common Mistake**: The JVM interprets and JIT-compiles Java bytecode for the underlying operating system.

## Real-World Production Scenario

In production engineering, **Java Compilation, JVM & Primitive Types** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Java Compilation, JVM & Primitive Types. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Dev.java: Official Java Language')?._id,
  });

  const javaL1_Challenge = await ChallengeModel.create({
    title: `Java Sum Array Elements`,
    description: `Implement a method that sums all positive integers in an array.`,
    difficulty: 'EASY',
    language: 'java',
    starterCode: `public class ArrayHelper {
    public static int sumPositives(int[] nums) {
        // Your code here
        return 0;
    }
}
`,
    solutionCode: `public class ArrayHelper {
    public static int sumPositives(int[] nums) {
        if (nums == null) return 0;
        int sum = 0;
        for (int n : nums) {
            if (n > 0) sum += n;
        }
        return sum;
    }
}
`,
    hints: ["Iterate with enhanced for loop and check n > 0."],
    skills: [{"skillId": "java-programming", "weight": 1.0}],
    testCases: [{"input": "[1, -2, 3, 4]", "expectedOutput": "8", "description": "Sums positive numbers", "hidden": false}],
  });

  const javaL1_Practice = await ActivityModel.create({
    lessonId: javaL1._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Java Sum Array Elements`,
    order: 3,
    challengeRef: javaL1_Challenge._id,
    content: `# Code Practice: Java Sum Array Elements\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  javaL1_Challenge.activityId = javaL1_Practice._id;
  await javaL1_Challenge.save();

  const javaL1_Quiz = await AssessmentModel.create({
    title: `Assessment: Java Foundations`,
    description: `Test JVM architecture and primitive type concepts.`,
    passingScore: 70,
    skills: [{"skillId": "java-programming", "weight": 1.0}],
    questions: [
    {
        "question": "What is the primary role of the Java Virtual Machine (JVM)?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "To compile Java source code into C++",
            "To execute compiled Java bytecode (.class) on specific host hardware",
            "To format HTML documents",
            "To manage relational databases"
        ],
        "correctOption": 1,
        "explanation": "The JVM interprets and JIT-compiles Java bytecode for the underlying operating system.",
        "points": 10
    }
],
  });

  const javaL1_Assessment = await ActivityModel.create({
    lessonId: javaL1._id,
    type: 'QUIZ',
    title: `Assessment: Java Foundations`,
    order: 4,
    assessmentRef: javaL1_Quiz._id,
  });
  javaL1_Quiz.activityId = javaL1_Assessment._id;
  await javaL1_Quiz.save();

  javaL1.activities = [
    javaL1_Video._id,
    javaL1_Notes._id,
    javaL1_Practice._id,
    javaL1_Assessment._id,
  ] as any;
  await javaL1.save();

  // --- Lesson 2: Control Flow & Methods in Java ---
  const javaL2 = await LessonModel.create({
    moduleId: javaMod1._id,
    courseId: javaCourse._id,
    title: `Control Flow & Methods in Java`,
    description: `Master if/else, switch statements, while loops, and static method signatures.`,
    order: 2,
    activities: [],
  });

  const javaL2_Video = await ActivityModel.create({
    lessonId: javaL2._id,
    type: 'VIDEO',
    title: `Video: Java Methods and Control Flow`,
    order: 1,
    resourceRef: getRes('Java Variables and Primitive Data Types in Tamil')?._id,
    content: `# Java Methods:\\n- Methods require explicit return types, parameter types, and access modifiers (public, private).\\n- Static methods belong to the class rather than an instance.`,
  });

  const javaL2_Notes = await ActivityModel.create({
    lessonId: javaL2._id,
    type: 'NOTES',
    title: `Codexa Notes: Control Flow & Methods in Java`,
    order: 2,
    content: `# Control Flow & Methods in Java

Master if/else, switch statements, while loops, and static method signatures.

\`\`\`java
public class MathUtils {
    public static int max(int a, int b) {
        return (a >= b) ? a : b;
    }
}
\`\`\`

## Why Control Flow & Methods in Java Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Initialize max with nums[0] and compare in loop.

> ⚠️ **Common Mistake**: Java is strictly pass-by-value for both primitives and object references.

## Real-World Production Scenario

In production engineering, **Control Flow & Methods in Java** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Control Flow & Methods in Java. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Dev.java: Official Java Language')?._id,
  });

  const javaL2_Challenge = await ChallengeModel.create({
    title: `Find Maximum Value`,
    description: `Implement \`findMax(int[] nums)\` returning the largest integer in the array, or \`Integer.MIN_VALUE\` if empty.`,
    difficulty: 'EASY',
    language: 'java',
    starterCode: `public class MathUtils {
    public static int findMax(int[] nums) {
        // Your code here
        return 0;
    }
}
`,
    solutionCode: `public class MathUtils {
    public static int findMax(int[] nums) {
        if (nums == null || nums.length == 0) return Integer.MIN_VALUE;
        int maxVal = nums[0];
        for (int n : nums) {
            if (n > maxVal) maxVal = n;
        }
        return maxVal;
    }
}
`,
    hints: ["Initialize max with nums[0] and compare in loop."],
    skills: [{"skillId": "java-programming", "weight": 1.0}],
    testCases: [{"input": "[3, 7, 2, 9, 4]", "expectedOutput": "9", "description": "Finds maximum integer", "hidden": false}],
  });

  const javaL2_Practice = await ActivityModel.create({
    lessonId: javaL2._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Find Maximum Value`,
    order: 3,
    challengeRef: javaL2_Challenge._id,
    content: `# Code Practice: Find Maximum Value\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  javaL2_Challenge.activityId = javaL2_Practice._id;
  await javaL2_Challenge.save();

  const javaL2_Quiz = await AssessmentModel.create({
    title: `Assessment: Java Methods & Scope`,
    description: `Test method signatures and parameter passing.`,
    passingScore: 70,
    skills: [{"skillId": "java-programming", "weight": 1.0}],
    questions: [
    {
        "question": "Are Java primitive arguments passed by value or by reference?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Passed by reference",
            "Strictly passed by value (a copy of the primitive value is passed)",
            "Passed by pointer",
            "Dynamic depending on JVM settings"
        ],
        "correctOption": 1,
        "explanation": "Java is strictly pass-by-value for both primitives and object references.",
        "points": 10
    }
],
  });

  const javaL2_Assessment = await ActivityModel.create({
    lessonId: javaL2._id,
    type: 'QUIZ',
    title: `Assessment: Java Methods & Scope`,
    order: 4,
    assessmentRef: javaL2_Quiz._id,
  });
  javaL2_Quiz.activityId = javaL2_Assessment._id;
  await javaL2_Quiz.save();

  javaL2.activities = [
    javaL2_Video._id,
    javaL2_Notes._id,
    javaL2_Practice._id,
    javaL2_Assessment._id,
  ] as any;
  await javaL2.save();

  javaMod1.lessons = [javaL1._id, javaL2._id] as any;
  await javaMod1.save();

  const javaMod2 = await ModuleModel.create({
    courseId: javaCourse._id,
    title: `Module 2: Object-Oriented Architecture & Encapsulation`,
    description: `Classes, constructors, getters/setters, inheritance, and polymorphism.`,
    order: 2,
    lessons: [],
  });

  // --- Lesson 1: Classes, Constructors & Encapsulation ---
  const javaL3 = await LessonModel.create({
    moduleId: javaMod2._id,
    courseId: javaCourse._id,
    title: `Classes, Constructors & Encapsulation`,
    description: `Encapsulate fields with private access modifiers and provide public getters/setters.`,
    order: 1,
    activities: [],
  });

  const javaL3_Video = await ActivityModel.create({
    lessonId: javaL3._id,
    type: 'VIDEO',
    title: `Video: Java OOP Encapsulation & Classes`,
    order: 1,
    resourceRef: getRes('First Java Program and Class Structure in Tamil')?._id,
    content: `# Encapsulation:\\n- Private fields protect internal state from unauthorized modification.\\n- Constructors initialize valid state upon instantiation.`,
  });

  const javaL3_Notes = await ActivityModel.create({
    lessonId: javaL3._id,
    type: 'NOTES',
    title: `Codexa Notes: Classes, Constructors & Encapsulation`,
    order: 2,
    content: `# Classes, Constructors & Encapsulation

Encapsulate fields with private access modifiers and provide public getters/setters.

\`\`\`java
public class User {
    private String email;
    private int xp;

    public User(String email, int xp) {
        this.email = email;
        this.xp = Math.max(0, xp);
    }

    public String getEmail() { return this.email; }
    public int getXp() { return this.xp; }
}
\`\`\`

## Why Classes, Constructors & Encapsulation Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Check amount > 0 before incrementing balance.

> ⚠️ **Common Mistake**: Encapsulation prevents direct external tampering and allows validation logic inside mutators.

## Real-World Production Scenario

In production engineering, **Classes, Constructors & Encapsulation** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Classes, Constructors & Encapsulation. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Dev.java: Official Java Language')?._id,
  });

  const javaL3_Challenge = await ChallengeModel.create({
    title: `BankAccount Encapsulation`,
    description: `Implement \`deposit(double amount)\` and \`getBalance()\` preventing negative deposits.`,
    difficulty: 'EASY',
    language: 'java',
    starterCode: `public class BankAccount {
    private double balance;
    public BankAccount(double initialBalance) {
        this.balance = initialBalance;
    }
    public void deposit(double amount) {
        // Your code here
    }
    public double getBalance() {
        return this.balance;
    }
}
`,
    solutionCode: `public class BankAccount {
    private double balance;
    public BankAccount(double initialBalance) {
        this.balance = Math.max(0, initialBalance);
    }
    public void deposit(double amount) {
        if (amount > 0) this.balance += amount;
    }
    public double getBalance() {
        return this.balance;
    }
}
`,
    hints: ["Check amount > 0 before incrementing balance."],
    skills: [{"skillId": "java-oop-generics", "weight": 1.0}],
    testCases: [{"input": "[100.0, 50.0]", "expectedOutput": "150.0", "description": "Deposits valid amount", "hidden": false}],
  });

  const javaL3_Practice = await ActivityModel.create({
    lessonId: javaL3._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: BankAccount Encapsulation`,
    order: 3,
    challengeRef: javaL3_Challenge._id,
    content: `# Code Practice: BankAccount Encapsulation\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  javaL3_Challenge.activityId = javaL3_Practice._id;
  await javaL3_Challenge.save();

  const javaL3_Quiz = await AssessmentModel.create({
    title: `Assessment: Encapsulation`,
    description: `Test encapsulation and access modifier rules.`,
    passingScore: 70,
    skills: [{"skillId": "java-oop-generics", "weight": 1.0}],
    questions: [
    {
        "question": "What is the primary benefit of declaring class fields as private with public getters?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "It increases memory bandwidth",
            "It protects internal state from arbitrary modification and enforces validation rules",
            "It makes the class accessible over HTTP",
            "It disables garbage collection"
        ],
        "correctOption": 1,
        "explanation": "Encapsulation prevents direct external tampering and allows validation logic inside mutators.",
        "points": 10
    }
],
  });

  const javaL3_Assessment = await ActivityModel.create({
    lessonId: javaL3._id,
    type: 'QUIZ',
    title: `Assessment: Encapsulation`,
    order: 4,
    assessmentRef: javaL3_Quiz._id,
  });
  javaL3_Quiz.activityId = javaL3_Assessment._id;
  await javaL3_Quiz.save();

  javaL3.activities = [
    javaL3_Video._id,
    javaL3_Notes._id,
    javaL3_Practice._id,
    javaL3_Assessment._id,
  ] as any;
  await javaL3.save();

  // --- Lesson 2: Inheritance, Interfaces & Polymorphism ---
  const javaL4 = await LessonModel.create({
    moduleId: javaMod2._id,
    courseId: javaCourse._id,
    title: `Inheritance, Interfaces & Polymorphism`,
    description: `Master extends, implements, @Override, and dynamic method dispatch.`,
    order: 2,
    activities: [],
  });

  const javaL4_Video = await ActivityModel.create({
    lessonId: javaL4._id,
    type: 'VIDEO',
    title: `Video: Java Polymorphism & Interfaces`,
    order: 1,
    resourceRef: getRes('Java Scanner and User Console Input in Tamil')?._id,
    content: `# Polymorphism:\\n- Interfaces define contracts (what methods must exist).\\n- Subclasses provide specific implementations via @Override.`,
  });

  const javaL4_Notes = await ActivityModel.create({
    lessonId: javaL4._id,
    type: 'NOTES',
    title: `Codexa Notes: Inheritance, Interfaces & Polymorphism`,
    order: 2,
    content: `# Inheritance, Interfaces & Polymorphism

Master extends, implements, @Override, and dynamic method dispatch.

\`\`\`java
public interface PaymentGateway {
    boolean processPayment(double amount);
}

public class StripeGateway implements PaymentGateway {
    @Override
    public boolean processPayment(double amount) {
        // Stripe API integration
        return true;
    }
}
\`\`\`

## Why Inheritance, Interfaces & Polymorphism Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Return Math.PI * radius * radius

> ⚠️ **Common Mistake**: Java supports multiple interface inheritance while avoiding multiple class inheritance diamond problems.

## Real-World Production Scenario

In production engineering, **Inheritance, Interfaces & Polymorphism** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Inheritance, Interfaces & Polymorphism. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Dev.java: Official Java Language')?._id,
  });

  const javaL4_Challenge = await ChallengeModel.create({
    title: `Implement Shape Area Interface`,
    description: `Implement \`Circle\` implementing \`Shape\` interface with \`getArea()\` returning \`Math.PI * r * r\`.`,
    difficulty: 'EASY',
    language: 'java',
    starterCode: `interface Shape {
    double getArea();
}

public class Circle implements Shape {
    private double radius;
    public Circle(double radius) { this.radius = radius; }
    public double getArea() {
        // Your code here
        return 0.0;
    }
}
`,
    solutionCode: `interface Shape {
    double getArea();
}

public class Circle implements Shape {
    private double radius;
    public Circle(double radius) { this.radius = radius; }
    public double getArea() {
        return Math.PI * radius * radius;
    }
}
`,
    hints: ["Return Math.PI * radius * radius"],
    skills: [{"skillId": "java-oop-generics", "weight": 1.0}],
    testCases: [{"input": "[1.0]", "expectedOutput": "3.141592653589793", "description": "Computes circle area", "hidden": false}],
  });

  const javaL4_Practice = await ActivityModel.create({
    lessonId: javaL4._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Implement Shape Area Interface`,
    order: 3,
    challengeRef: javaL4_Challenge._id,
    content: `# Code Practice: Implement Shape Area Interface\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  javaL4_Challenge.activityId = javaL4_Practice._id;
  await javaL4_Challenge.save();

  const javaL4_Quiz = await AssessmentModel.create({
    title: `Assessment: Interfaces & Polymorphism`,
    description: `Test interface contracts and dynamic dispatch.`,
    passingScore: 70,
    skills: [{"skillId": "java-oop-generics", "weight": 1.0}],
    questions: [
    {
        "question": "Can a Java class implement multiple interfaces?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "No, Java forbids all multiple inheritance",
            "Yes, a class can implement multiple interfaces simultaneously",
            "Only abstract classes can",
            "Only in Java 5"
        ],
        "correctOption": 1,
        "explanation": "Java supports multiple interface inheritance while avoiding multiple class inheritance diamond problems.",
        "points": 10
    }
],
  });

  const javaL4_Assessment = await ActivityModel.create({
    lessonId: javaL4._id,
    type: 'QUIZ',
    title: `Assessment: Interfaces & Polymorphism`,
    order: 4,
    assessmentRef: javaL4_Quiz._id,
  });
  javaL4_Quiz.activityId = javaL4_Assessment._id;
  await javaL4_Quiz.save();

  javaL4.activities = [
    javaL4_Video._id,
    javaL4_Notes._id,
    javaL4_Practice._id,
    javaL4_Assessment._id,
  ] as any;
  await javaL4.save();

  javaMod2.lessons = [javaL3._id, javaL4._id] as any;
  await javaMod2.save();

  const javaMod3 = await ModuleModel.create({
    courseId: javaCourse._id,
    title: `Module 3: Java Collections Framework & Generics`,
    description: `List (ArrayList/LinkedList), Set (HashSet), Map (HashMap), and type-safe Generics.`,
    order: 3,
    lessons: [],
  });

  // --- Lesson 1: ArrayList, HashMap & HashSet Data Structures ---
  const javaL5 = await LessonModel.create({
    moduleId: javaMod3._id,
    courseId: javaCourse._id,
    title: `ArrayList, HashMap & HashSet Data Structures`,
    description: `Master dynamic arrays, key-value hashing, and unique value sets in java.util.`,
    order: 1,
    activities: [],
  });

  const javaL5_Video = await ActivityModel.create({
    lessonId: javaL5._id,
    type: 'VIDEO',
    title: `Video: Java Collections Framework Full Tutorial`,
    order: 1,
    resourceRef: getRes('Java Comments and String Literals in Tamil')?._id,
    content: `# Collections:\\n- ArrayList provides O(1) indexed access.\\n- HashMap provides average O(1) key-value lookups.`,
  });

  const javaL5_Notes = await ActivityModel.create({
    lessonId: javaL5._id,
    type: 'NOTES',
    title: `Codexa Notes: ArrayList, HashMap & HashSet Data Structures`,
    order: 2,
    content: `# ArrayList, HashMap & HashSet Data Structures

Master dynamic arrays, key-value hashing, and unique value sets in java.util.

\`\`\`java
import java.util.*;

List<String> names = new ArrayList<>();
names.add("Alex");

Map<String, Integer> scores = new HashMap<>();
scores.put("Alex", 150);
int score = scores.getOrDefault("Sarah", 0);
\`\`\`

## Why ArrayList, HashMap & HashSet Data Structures Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use new TreeSet<>(list) to remove duplicates and sort.

> ⚠️ **Common Mistake**: HashMap hash indexing gives average O(1) constant time lookups and insertions.

## Real-World Production Scenario

In production engineering, **ArrayList, HashMap & HashSet Data Structures** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of ArrayList, HashMap & HashSet Data Structures. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Dev.java: Official Java Language')?._id,
  });

  const javaL5_Challenge = await ChallengeModel.create({
    title: `Remove Duplicates with Set`,
    description: `Implement \`removeDuplicates(List<Integer> list)\` returning a new list with unique items in natural order.`,
    difficulty: 'EASY',
    language: 'java',
    starterCode: `import java.util.*;

public class CollectionHelper {
    public static List<Integer> removeDuplicates(List<Integer> list) {
        // Your code here
        return new ArrayList<>();
    }
}
`,
    solutionCode: `import java.util.*;

public class CollectionHelper {
    public static List<Integer> removeDuplicates(List<Integer> list) {
        if (list == null) return new ArrayList<>();
        Set<Integer> set = new TreeSet<>(list);
        return new ArrayList<>(set);
    }
}
`,
    hints: ["Use new TreeSet<>(list) to remove duplicates and sort."],
    skills: [{"skillId": "java-oop-generics", "weight": 1.0}],
    testCases: [{"input": "[[3, 1, 2, 1, 3]]", "expectedOutput": "[1, 2, 3]", "description": "Sorts and deduplicates list", "hidden": false}],
  });

  const javaL5_Practice = await ActivityModel.create({
    lessonId: javaL5._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Remove Duplicates with Set`,
    order: 3,
    challengeRef: javaL5_Challenge._id,
    content: `# Code Practice: Remove Duplicates with Set\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  javaL5_Challenge.activityId = javaL5_Practice._id;
  await javaL5_Challenge.save();

  const javaL5_Quiz = await AssessmentModel.create({
    title: `Assessment: Java Collections`,
    description: `Test collection complexity and method operations.`,
    passingScore: 70,
    skills: [{"skillId": "java-oop-generics", "weight": 1.0}],
    questions: [
    {
        "question": "What is the average time complexity of get(key) and put(key, val) in a Java HashMap?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "O(n)",
            "O(log n)",
            "O(1)",
            "O(n^2)"
        ],
        "correctOption": 2,
        "explanation": "HashMap hash indexing gives average O(1) constant time lookups and insertions.",
        "points": 10
    }
],
  });

  const javaL5_Assessment = await ActivityModel.create({
    lessonId: javaL5._id,
    type: 'QUIZ',
    title: `Assessment: Java Collections`,
    order: 4,
    assessmentRef: javaL5_Quiz._id,
  });
  javaL5_Quiz.activityId = javaL5_Assessment._id;
  await javaL5_Quiz.save();

  javaL5.activities = [
    javaL5_Video._id,
    javaL5_Notes._id,
    javaL5_Practice._id,
    javaL5_Assessment._id,
  ] as any;
  await javaL5.save();

  // --- Lesson 2: Type-Safe Generics & Generic Methods ---
  const javaL6 = await LessonModel.create({
    moduleId: javaMod3._id,
    courseId: javaCourse._id,
    title: `Type-Safe Generics & Generic Methods`,
    description: `Write flexible, compile-time verified generic classes <T> and bounded wildcards <? extends T>.`,
    order: 2,
    activities: [],
  });

  const javaL6_Video = await ActivityModel.create({
    lessonId: javaL6._id,
    type: 'VIDEO',
    title: `Video: Java Generics Explained`,
    order: 1,
    resourceRef: getRes('Java Relational and Logical Operators in Tamil')?._id,
    content: `# Generics:\\n- Generics enforce compile-time type safety and eliminate runtime ClassCastExceptions.\\n- Type erasure replaces generic types with Object/bounds at compile time.`,
  });

  const javaL6_Notes = await ActivityModel.create({
    lessonId: javaL6._id,
    type: 'NOTES',
    title: `Codexa Notes: Type-Safe Generics & Generic Methods`,
    order: 2,
    content: `# Type-Safe Generics & Generic Methods

Write flexible, compile-time verified generic classes <T> and bounded wildcards <? extends T>.

\`\`\`java
public class Box<T> {
    private T item;
    public void set(T item) { this.item = item; }
    public T get() { return this.item; }
}
\`\`\`

## Why Type-Safe Generics & Generic Methods Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Store typed fields key and value.

> ⚠️ **Common Mistake**: Type Erasure removes type arguments and inserts appropriate casts in generated bytecode.

## Real-World Production Scenario

In production engineering, **Type-Safe Generics & Generic Methods** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Type-Safe Generics & Generic Methods. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Dev.java: Official Java Language')?._id,
  });

  const javaL6_Challenge = await ChallengeModel.create({
    title: `Generic Pair Container`,
    description: `Implement generic class \`Pair<K, V>\` with \`getKey()\` and \`getValue()\`.`,
    difficulty: 'EASY',
    language: 'java',
    starterCode: `public class Pair<K, V> {
    private K key;
    private V value;
    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }
    public K getKey() { return this.key; }
    public V getValue() { return this.value; }
}
`,
    solutionCode: `public class Pair<K, V> {
    private K key;
    private V value;
    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }
    public K getKey() { return this.key; }
    public V getValue() { return this.value; }
}
`,
    hints: ["Store typed fields key and value."],
    skills: [{"skillId": "java-oop-generics", "weight": 1.0}],
    testCases: [{"input": "[\"id\", 101]", "expectedOutput": "true", "description": "Stores generic key-value pair", "hidden": false}],
  });

  const javaL6_Practice = await ActivityModel.create({
    lessonId: javaL6._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Generic Pair Container`,
    order: 3,
    challengeRef: javaL6_Challenge._id,
    content: `# Code Practice: Generic Pair Container\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  javaL6_Challenge.activityId = javaL6_Practice._id;
  await javaL6_Challenge.save();

  const javaL6_Quiz = await AssessmentModel.create({
    title: `Assessment: Generics & Type Safety`,
    description: `Test generic constraints and erasure mechanics.`,
    passingScore: 70,
    skills: [{"skillId": "java-oop-generics", "weight": 1.0}],
    questions: [
    {
        "question": "What process does the Java compiler perform on Generics to ensure backward compatibility with older JVM versions?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Dynamic Polymorphism",
            "Type Erasure",
            "Static Inlining",
            "Reflection Binding"
        ],
        "correctOption": 1,
        "explanation": "Type Erasure removes type arguments and inserts appropriate casts in generated bytecode.",
        "points": 10
    }
],
  });

  const javaL6_Assessment = await ActivityModel.create({
    lessonId: javaL6._id,
    type: 'QUIZ',
    title: `Assessment: Generics & Type Safety`,
    order: 4,
    assessmentRef: javaL6_Quiz._id,
  });
  javaL6_Quiz.activityId = javaL6_Assessment._id;
  await javaL6_Quiz.save();

  javaL6.activities = [
    javaL6_Video._id,
    javaL6_Notes._id,
    javaL6_Practice._id,
    javaL6_Assessment._id,
  ] as any;
  await javaL6.save();

  javaMod3.lessons = [javaL5._id, javaL6._id] as any;
  await javaMod3.save();

  const javaMod4 = await ModuleModel.create({
    courseId: javaCourse._id,
    title: `Module 4: Exceptions & Modern Streams API`,
    description: `Checked vs unchecked exceptions, try-with-resources, and Java 8+ Streams API pipelines.`,
    order: 4,
    lessons: [],
  });

  // --- Lesson 1: Exceptions Architecture & Try-With-Resources ---
  const javaL7 = await LessonModel.create({
    moduleId: javaMod4._id,
    courseId: javaCourse._id,
    title: `Exceptions Architecture & Try-With-Resources`,
    description: `Understand checked (IOException) vs unchecked (RuntimeException) exceptions and AutoCloseable.`,
    order: 1,
    activities: [],
  });

  const javaL7_Video = await ActivityModel.create({
    lessonId: javaL7._id,
    type: 'VIDEO',
    title: `Video: Java Exception Handling Best Practices`,
    order: 1,
    resourceRef: getRes('Java Bitwise Operators and Bit Shifting in Tamil')?._id,
    content: `# Exceptions:\\n- Checked exceptions must be declared in throws or handled in try-catch.\\n- Try-with-resources automatically closes AutoCloseable streams.`,
  });

  const javaL7_Notes = await ActivityModel.create({
    lessonId: javaL7._id,
    type: 'NOTES',
    title: `Codexa Notes: Exceptions Architecture & Try-With-Resources`,
    order: 2,
    content: `# Exceptions Architecture & Try-With-Resources

Understand checked (IOException) vs unchecked (RuntimeException) exceptions and AutoCloseable.

\`\`\`java
try (Scanner scanner = new Scanner(new File("data.txt"))) {
    while (scanner.hasNextLine()) {
        System.out.println(scanner.nextLine());
    }
} catch (FileNotFoundException e) {
    System.err.println("File not found: " + e.getMessage());
}
\`\`\`

## Why Exceptions Architecture & Try-With-Resources Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Wrap Integer.parseInt in try-catch.

> ⚠️ **Common Mistake**: Subclasses of RuntimeException are unchecked and do not require mandatory compile-time handling.

## Real-World Production Scenario

In production engineering, **Exceptions Architecture & Try-With-Resources** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Exceptions Architecture & Try-With-Resources. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Dev.java: Official Java Language')?._id,
  });

  const javaL7_Challenge = await ChallengeModel.create({
    title: `Safe String to Integer Parser`,
    description: `Implement \`parseIntSafe(String s, int fallback)\` that catches \`NumberFormatException\`.`,
    difficulty: 'EASY',
    language: 'java',
    starterCode: `public class NumberParser {
    public static int parseIntSafe(String s, int fallback) {
        // Your code here
        return fallback;
    }
}
`,
    solutionCode: `public class NumberParser {
    public static int parseIntSafe(String s, int fallback) {
        if (s == null) return fallback;
        try {
            return Integer.parseInt(s.trim());
        } catch (NumberFormatException e) {
            return fallback;
        }
    }
}
`,
    hints: ["Wrap Integer.parseInt in try-catch."],
    skills: [{"skillId": "java-programming", "weight": 1.0}],
    testCases: [{"input": "[\"123\", 0]", "expectedOutput": "123", "description": "Parses integer string", "hidden": false}, {"input": "[\"invalid\", -1]", "expectedOutput": "-1", "description": "Returns fallback on parse failure", "hidden": false}],
  });

  const javaL7_Practice = await ActivityModel.create({
    lessonId: javaL7._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Safe String to Integer Parser`,
    order: 3,
    challengeRef: javaL7_Challenge._id,
    content: `# Code Practice: Safe String to Integer Parser\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  javaL7_Challenge.activityId = javaL7_Practice._id;
  await javaL7_Challenge.save();

  const javaL7_Quiz = await AssessmentModel.create({
    title: `Assessment: Java Exceptions`,
    description: `Test checked vs unchecked exception hierarchy.`,
    passingScore: 70,
    skills: [{"skillId": "java-programming", "weight": 1.0}],
    questions: [
    {
        "question": "Which base class do all unchecked exceptions in Java inherit from?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "java.lang.Exception",
            "java.lang.RuntimeException",
            "java.lang.Throwable",
            "java.lang.Error"
        ],
        "correctOption": 1,
        "explanation": "Subclasses of RuntimeException are unchecked and do not require mandatory compile-time handling.",
        "points": 10
    }
],
  });

  const javaL7_Assessment = await ActivityModel.create({
    lessonId: javaL7._id,
    type: 'QUIZ',
    title: `Assessment: Java Exceptions`,
    order: 4,
    assessmentRef: javaL7_Quiz._id,
  });
  javaL7_Quiz.activityId = javaL7_Assessment._id;
  await javaL7_Quiz.save();

  javaL7.activities = [
    javaL7_Video._id,
    javaL7_Notes._id,
    javaL7_Practice._id,
    javaL7_Assessment._id,
  ] as any;
  await javaL7.save();

  // --- Lesson 2: Java Streams API & Functional Pipelines ---
  const javaL8 = await LessonModel.create({
    moduleId: javaMod4._id,
    courseId: javaCourse._id,
    title: `Java Streams API & Functional Pipelines`,
    description: `Transform collections with filter, map, collect, and reduce using method references and lambdas.`,
    order: 2,
    activities: [],
  });

  const javaL8_Video = await ActivityModel.create({
    lessonId: javaL8._id,
    type: 'VIDEO',
    title: `Video: Java 8 Streams API Masterclass`,
    order: 1,
    resourceRef: getRes('Java Arithmetic and Assignment Operators in Tamil')?._id,
    content: `# Streams API:\\n- Streams are lazy pipelines terminated by a terminal operation (collect, count, forEach).\\n- Avoid mutating state inside stream lambda expressions.`,
  });

  const javaL8_Notes = await ActivityModel.create({
    lessonId: javaL8._id,
    type: 'NOTES',
    title: `Codexa Notes: Java Streams API & Functional Pipelines`,
    order: 2,
    content: `# Java Streams API & Functional Pipelines

Transform collections with filter, map, collect, and reduce using method references and lambdas.

\`\`\`java
List<String> names = Arrays.asList("Alex", "Sarah", "Bob");
List<String> filtered = names.stream()
    .filter(n -> n.length() > 3)
    .map(String::toUpperCase)
    .collect(Collectors.toList());
// ["ALEX", "SARAH"]
\`\`\`

## Why Java Streams API & Functional Pipelines Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use list.stream().filter(n -> n > 0).count()

> ⚠️ **Common Mistake**: Intermediate operations (filter, map) are lazy and only execute when a terminal operation (collect, count) is invoked.

## Real-World Production Scenario

In production engineering, **Java Streams API & Functional Pipelines** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Java Streams API & Functional Pipelines. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Dev.java: Official Java Language')?._id,
  });

  const javaL8_Challenge = await ChallengeModel.create({
    title: `Filter and Count Positive Numbers`,
    description: `Implement \`countPositives(List<Integer> list)\` using Java Streams API.`,
    difficulty: 'EASY',
    language: 'java',
    starterCode: `import java.util.List;

public class StreamHelper {
    public static long countPositives(List<Integer> list) {
        // Your code here
        return 0;
    }
}
`,
    solutionCode: `import java.util.List;

public class StreamHelper {
    public static long countPositives(List<Integer> list) {
        if (list == null) return 0;
        return list.stream().filter(n -> n != null && n > 0).count();
    }
}
`,
    hints: ["Use list.stream().filter(n -> n > 0).count()"],
    skills: [{"skillId": "java-programming", "weight": 1.0}],
    testCases: [{"input": "[[1, -2, 3, 4, -5]]", "expectedOutput": "3", "description": "Counts positive integers", "hidden": false}],
  });

  const javaL8_Practice = await ActivityModel.create({
    lessonId: javaL8._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Filter and Count Positive Numbers`,
    order: 3,
    challengeRef: javaL8_Challenge._id,
    content: `# Code Practice: Filter and Count Positive Numbers\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  javaL8_Challenge.activityId = javaL8_Practice._id;
  await javaL8_Challenge.save();

  const javaL8_Quiz = await AssessmentModel.create({
    title: `Assessment: Java Streams API`,
    description: `Test functional stream operations.`,
    passingScore: 70,
    skills: [{"skillId": "java-programming", "weight": 1.0}],
    questions: [
    {
        "question": "What is the difference between intermediate and terminal operations in a Java Stream pipeline?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Intermediate operations execute in parallel, terminal execute sequentially",
            "Intermediate operations return a new Stream lazily; terminal operations execute the pipeline and produce a result",
            "Intermediate operations mutate the original list",
            "Terminal operations can be called multiple times"
        ],
        "correctOption": 1,
        "explanation": "Intermediate operations (filter, map) are lazy and only execute when a terminal operation (collect, count) is invoked.",
        "points": 10
    }
],
  });

  const javaL8_Assessment = await ActivityModel.create({
    lessonId: javaL8._id,
    type: 'QUIZ',
    title: `Assessment: Java Streams API`,
    order: 4,
    assessmentRef: javaL8_Quiz._id,
  });
  javaL8_Quiz.activityId = javaL8_Assessment._id;
  await javaL8_Quiz.save();

  javaL8.activities = [
    javaL8_Video._id,
    javaL8_Notes._id,
    javaL8_Practice._id,
    javaL8_Assessment._id,
  ] as any;
  await javaL8.save();

  javaMod4.lessons = [javaL7._id, javaL8._id] as any;
  await javaMod4.save();

  javaCourse.modules = [javaMod1._id, javaMod2._id, javaMod3._id, javaMod4._id] as any;
  await javaCourse.save();

  // =========================================================================
  // 4. C++ SYSTEMS PROGRAMMING
  // =========================================================================
  const cppCourse = await CourseModel.create({
    slug: 'cpp-programming',
    title: 'C++ Systems & High-Performance Architecture',
    description: 'Master modern C++ (C++17/20), raw pointers, memory allocation, RAII, smart pointers, Rule of 5, templates, and the STL.',
    domain: 'Programming Languages',
    level: 'INTERMEDIATE',
    status: 'PUBLISHED',
    estimatedHours: 50,
    skillsCovered: ['cpp-programming', 'cpp-systems-raii'],
    prerequisites: ['Basic programming knowledge in any language'],
    modules: [],
  });

  const cppMod1 = await ModuleModel.create({
    courseId: cppCourse._id,
    title: `Module 1: C++ Syntax, Pointers & Memory`,
    description: `Compilation, basic types, memory addresses, pointers, and references.`,
    order: 1,
    lessons: [],
  });

  // --- Lesson 1: C++ Compilation & Pointers vs References ---
  const cppL1 = await LessonModel.create({
    moduleId: cppMod1._id,
    courseId: cppCourse._id,
    title: `C++ Compilation & Pointers vs References`,
    description: `Understand direct memory addressing with raw pointers (*) and alias references (&).`,
    order: 1,
    activities: [],
  });

  const cppL1_Video = await ActivityModel.create({
    lessonId: cppL1._id,
    type: 'VIDEO',
    title: `Video: C++ Full Course for Beginners`,
    order: 1,
    resourceRef: getRes('Introduction to C++ and Compilation in Tamil')?._id,
    content: `# C++ Pointers:\\n- Pointers store the memory address of another variable (&var).\\n- References are immutable aliases that cannot be null.`,
  });

  const cppL1_Notes = await ActivityModel.create({
    lessonId: cppL1._id,
    type: 'NOTES',
    title: `Codexa Notes: C++ Compilation & Pointers vs References`,
    order: 2,
    content: `# C++ Compilation & Pointers vs References

Understand direct memory addressing with raw pointers (*) and alias references (&).

\`\`\`cpp
int x = 42;
int* ptr = &x;  // Pointer holds address of x
int& ref = x;   // Reference is an alias for x

*ptr = 100;     // Dereferencing modifies x
\`\`\`

## Why C++ Compilation & Pointers vs References Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use a temporary variable to hold *a.

> ⚠️ **Common Mistake**: References cannot be null and provide cleaner syntax without explicit dereferencing (*).

## Real-World Production Scenario

In production engineering, **C++ Compilation & Pointers vs References** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of C++ Compilation & Pointers vs References. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('ISO C++ / cppreference')?._id,
  });

  const cppL1_Challenge = await ChallengeModel.create({
    title: `Pointer Value Swapper`,
    description: `Implement \`swapValues(int* a, int* b)\` swapping the values stored at the two pointers.`,
    difficulty: 'EASY',
    language: 'cpp',
    starterCode: `void swapValues(int* a, int* b) {
    // Your code here
}
`,
    solutionCode: `void swapValues(int* a, int* b) {
    if (!a || !b) return;
    int temp = *a;
    *a = *b;
    *b = temp;
}
`,
    hints: ["Use a temporary variable to hold *a."],
    skills: [{"skillId": "cpp-programming", "weight": 1.0}],
    testCases: [{"input": "[10, 20]", "expectedOutput": "[20, 10]", "description": "Swaps values via pointers", "hidden": false}],
  });

  const cppL1_Practice = await ActivityModel.create({
    lessonId: cppL1._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Pointer Value Swapper`,
    order: 3,
    challengeRef: cppL1_Challenge._id,
    content: `# Code Practice: Pointer Value Swapper\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  cppL1_Challenge.activityId = cppL1_Practice._id;
  await cppL1_Challenge.save();

  const cppL1_Quiz = await AssessmentModel.create({
    title: `Assessment: Pointers & References`,
    description: `Test pointer dereferencing and reference semantics.`,
    passingScore: 70,
    skills: [{"skillId": "cpp-programming", "weight": 1.0}],
    questions: [
    {
        "question": "What is the key semantic difference between a C++ reference (int&) and a pointer (int*)?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "References can be null, pointers cannot",
            "A reference must be bound to an object at initialization and cannot be reseated or null; pointers can be null and reassigned",
            "Pointers are faster than references",
            "References are deprecated"
        ],
        "correctOption": 1,
        "explanation": "References cannot be null and provide cleaner syntax without explicit dereferencing (*).",
        "points": 10
    }
],
  });

  const cppL1_Assessment = await ActivityModel.create({
    lessonId: cppL1._id,
    type: 'QUIZ',
    title: `Assessment: Pointers & References`,
    order: 4,
    assessmentRef: cppL1_Quiz._id,
  });
  cppL1_Quiz.activityId = cppL1_Assessment._id;
  await cppL1_Quiz.save();

  cppL1.activities = [
    cppL1_Video._id,
    cppL1_Notes._id,
    cppL1_Practice._id,
    cppL1_Assessment._id,
  ] as any;
  await cppL1.save();

  // --- Lesson 2: Control Flow, Arrays & Header Guards ---
  const cppL2 = await LessonModel.create({
    moduleId: cppMod1._id,
    courseId: cppCourse._id,
    title: `Control Flow, Arrays & Header Guards`,
    description: `C-style arrays, pointer arithmetic, and #ifndef header inclusion guards.`,
    order: 2,
    activities: [],
  });

  const cppL2_Video = await ActivityModel.create({
    lessonId: cppL2._id,
    type: 'VIDEO',
    title: `Video: C++ Arrays & Header Architecture`,
    order: 1,
    resourceRef: getRes('C++ Standard Output with Cout in Tamil')?._id,
    content: `# C++ Arrays:\\n- Arrays decay to pointers when passed to functions.\\n- Use #pragma once or header guards to prevent duplicate definitions.`,
  });

  const cppL2_Notes = await ActivityModel.create({
    lessonId: cppL2._id,
    type: 'NOTES',
    title: `Codexa Notes: Control Flow, Arrays & Header Guards`,
    order: 2,
    content: `# Control Flow, Arrays & Header Guards

C-style arrays, pointer arithmetic, and #ifndef header inclusion guards.

\`\`\`cpp
#ifndef MATH_UTILS_H
#define MATH_UTILS_H

int sumArray(const int* arr, int size);

#endif
\`\`\`

## Why Control Flow, Arrays & Header Guards Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Sum elements and divide by (double)size.

> ⚠️ **Common Mistake**: Header guards ensure the preprocessor only includes header contents once per translation unit.

## Real-World Production Scenario

In production engineering, **Control Flow, Arrays & Header Guards** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Control Flow, Arrays & Header Guards. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('ISO C++ / cppreference')?._id,
  });

  const cppL2_Challenge = await ChallengeModel.create({
    title: `Calculate Array Mean`,
    description: `Implement \`double calculateMean(const int* arr, int size)\` returning average.`,
    difficulty: 'EASY',
    language: 'cpp',
    starterCode: `double calculateMean(const int* arr, int size) {
    // Your code here
    return 0.0;
}
`,
    solutionCode: `double calculateMean(const int* arr, int size) {
    if (!arr || size <= 0) return 0.0;
    double sum = 0;
    for (int i = 0; i < size; i++) sum += arr[i];
    return sum / size;
}
`,
    hints: ["Sum elements and divide by (double)size."],
    skills: [{"skillId": "cpp-programming", "weight": 1.0}],
    testCases: [{"input": "[[10, 20, 30], 3]", "expectedOutput": "20.0", "description": "Calculates array average", "hidden": false}],
  });

  const cppL2_Practice = await ActivityModel.create({
    lessonId: cppL2._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Calculate Array Mean`,
    order: 3,
    challengeRef: cppL2_Challenge._id,
    content: `# Code Practice: Calculate Array Mean\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  cppL2_Challenge.activityId = cppL2_Practice._id;
  await cppL2_Challenge.save();

  const cppL2_Quiz = await AssessmentModel.create({
    title: `Assessment: C++ Memory & Headers`,
    description: `Test array decay and preprocessor directives.`,
    passingScore: 70,
    skills: [{"skillId": "cpp-programming", "weight": 1.0}],
    questions: [
    {
        "question": "Why are header guards (#pragma once or #ifndef ... #endif) necessary in C++ header files?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "To encrypt source code",
            "To prevent compiler errors caused by duplicate type definitions when a header is included multiple times",
            "To allocate dynamic memory",
            "To enable garbage collection"
        ],
        "correctOption": 1,
        "explanation": "Header guards ensure the preprocessor only includes header contents once per translation unit.",
        "points": 10
    }
],
  });

  const cppL2_Assessment = await ActivityModel.create({
    lessonId: cppL2._id,
    type: 'QUIZ',
    title: `Assessment: C++ Memory & Headers`,
    order: 4,
    assessmentRef: cppL2_Quiz._id,
  });
  cppL2_Quiz.activityId = cppL2_Assessment._id;
  await cppL2_Quiz.save();

  cppL2.activities = [
    cppL2_Video._id,
    cppL2_Notes._id,
    cppL2_Practice._id,
    cppL2_Assessment._id,
  ] as any;
  await cppL2.save();

  cppMod1.lessons = [cppL1._id, cppL2._id] as any;
  await cppMod1.save();

  const cppMod2 = await ModuleModel.create({
    courseId: cppCourse._id,
    title: `Module 2: Dynamic Memory & RAII Architecture`,
    description: `Heap vs stack, new/delete, smart pointers (std::unique_ptr, std::shared_ptr), and RAII.`,
    order: 2,
    lessons: [],
  });

  // --- Lesson 1: Heap Allocation & RAII Resource Management ---
  const cppL3 = await LessonModel.create({
    moduleId: cppMod2._id,
    courseId: cppCourse._id,
    title: `Heap Allocation & RAII Resource Management`,
    description: `Resource Acquisition Is Initialization (RAII): tie heap lifetime to stack object scope.`,
    order: 1,
    activities: [],
  });

  const cppL3_Video = await ActivityModel.create({
    lessonId: cppL3._id,
    type: 'VIDEO',
    title: `Video: Modern C++ RAII and Memory Management`,
    order: 1,
    resourceRef: getRes('C++ Standard Input with Cin in Tamil')?._id,
    content: `# RAII Principle:\\n- Acquire resources in constructor; release in destructor.\\n- Guarantees zero memory leaks even when exceptions are thrown.`,
  });

  const cppL3_Notes = await ActivityModel.create({
    lessonId: cppL3._id,
    type: 'NOTES',
    title: `Codexa Notes: Heap Allocation & RAII Resource Management`,
    order: 2,
    content: `# Heap Allocation & RAII Resource Management

Resource Acquisition Is Initialization (RAII): tie heap lifetime to stack object scope.

\`\`\`cpp
class DynamicBuffer {
private:
    int* data;
    size_t size;
public:
    DynamicBuffer(size_t s) : size(s), data(new int[s]) {}
    ~DynamicBuffer() { delete[] data; } // RAII cleanup
};
\`\`\`

## Why Heap Allocation & RAII Resource Management Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Validate size > 0

> ⚠️ **Common Mistake**: RAII ties resource lifecycle to object lifetime, ensuring deterministic destruction.

## Real-World Production Scenario

In production engineering, **Heap Allocation & RAII Resource Management** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Heap Allocation & RAII Resource Management. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('ISO C++ / cppreference')?._id,
  });

  const cppL3_Challenge = await ChallengeModel.create({
    title: `Buffer Allocation Guard`,
    description: `Implement a function that allocates dynamic buffer and safely returns size.`,
    difficulty: 'EASY',
    language: 'cpp',
    starterCode: `int getBufferSize(int size) {
    // Your code here
    return size > 0 ? size : 0;
}
`,
    solutionCode: `int getBufferSize(int size) {
    return size > 0 ? size : 0;
}
`,
    hints: ["Validate size > 0"],
    skills: [{"skillId": "cpp-systems-raii", "weight": 1.0}],
    testCases: [{"input": "[1024]", "expectedOutput": "1024", "description": "Returns valid buffer size", "hidden": false}],
  });

  const cppL3_Practice = await ActivityModel.create({
    lessonId: cppL3._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Buffer Allocation Guard`,
    order: 3,
    challengeRef: cppL3_Challenge._id,
    content: `# Code Practice: Buffer Allocation Guard\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  cppL3_Challenge.activityId = cppL3_Practice._id;
  await cppL3_Challenge.save();

  const cppL3_Quiz = await AssessmentModel.create({
    title: `Assessment: RAII Principles`,
    description: `Test resource management and destructor execution.`,
    passingScore: 70,
    skills: [{"skillId": "cpp-systems-raii", "weight": 1.0}],
    questions: [
    {
        "question": "What is the core guarantee of the RAII idiom in C++?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Code executes 10x faster",
            "Resources (memory, file handles, mutex locks) are automatically released by destructors when objects go out of scope",
            "Pointers cannot be null",
            "It replaces the C++ compiler"
        ],
        "correctOption": 1,
        "explanation": "RAII ties resource lifecycle to object lifetime, ensuring deterministic destruction.",
        "points": 10
    }
],
  });

  const cppL3_Assessment = await ActivityModel.create({
    lessonId: cppL3._id,
    type: 'QUIZ',
    title: `Assessment: RAII Principles`,
    order: 4,
    assessmentRef: cppL3_Quiz._id,
  });
  cppL3_Quiz.activityId = cppL3_Assessment._id;
  await cppL3_Quiz.save();

  cppL3.activities = [
    cppL3_Video._id,
    cppL3_Notes._id,
    cppL3_Practice._id,
    cppL3_Assessment._id,
  ] as any;
  await cppL3.save();

  // --- Lesson 2: Smart Pointers: std::unique_ptr & std::shared_ptr ---
  const cppL4 = await LessonModel.create({
    moduleId: cppMod2._id,
    courseId: cppCourse._id,
    title: `Smart Pointers: std::unique_ptr & std::shared_ptr`,
    description: `Eliminate raw pointer bugs using unique_ptr for exclusive ownership and shared_ptr for reference counted ownership.`,
    order: 2,
    activities: [],
  });

  const cppL4_Video = await ActivityModel.create({
    lessonId: cppL4._id,
    type: 'VIDEO',
    title: `Video: C++ Smart Pointers Explained`,
    order: 1,
    resourceRef: getRes('C++ Variables and Data Types in Tamil')?._id,
    content: `# Smart Pointers:\\n- std::unique_ptr has zero runtime overhead over raw pointer.\\n- std::shared_ptr maintains an atomic reference count.`,
  });

  const cppL4_Notes = await ActivityModel.create({
    lessonId: cppL4._id,
    type: 'NOTES',
    title: `Codexa Notes: Smart Pointers: std::unique_ptr & std::shared_ptr`,
    order: 2,
    content: `# Smart Pointers: std::unique_ptr & std::shared_ptr

Eliminate raw pointer bugs using unique_ptr for exclusive ownership and shared_ptr for reference counted ownership.

\`\`\`cpp
#include <memory>

// Exclusive ownership (preferred)
auto uPtr = std::make_unique<Widget>();

// Shared ownership
auto sPtr = std::make_shared<Widget>();
\`\`\`

## Why Smart Pointers: std::unique_ptr & std::shared_ptr Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Check val > 0

> ⚠️ **Common Mistake**: unique_ptr has a deleted copy constructor to prevent double-free bugs.

## Real-World Production Scenario

In production engineering, **Smart Pointers: std::unique_ptr & std::shared_ptr** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Smart Pointers: std::unique_ptr & std::shared_ptr. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('ISO C++ / cppreference')?._id,
  });

  const cppL4_Challenge = await ChallengeModel.create({
    title: `Verify Exclusive Ownership`,
    description: `Implement a function returning 1 for unique_ptr and 0 for null.`,
    difficulty: 'EASY',
    language: 'cpp',
    starterCode: `int verifyPtr(int val) {
    // Your code here
    return val > 0 ? 1 : 0;
}
`,
    solutionCode: `int verifyPtr(int val) {
    return val > 0 ? 1 : 0;
}
`,
    hints: ["Check val > 0"],
    skills: [{"skillId": "cpp-systems-raii", "weight": 1.0}],
    testCases: [{"input": "[42]", "expectedOutput": "1", "description": "Verifies valid pointer value", "hidden": false}],
  });

  const cppL4_Practice = await ActivityModel.create({
    lessonId: cppL4._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Verify Exclusive Ownership`,
    order: 3,
    challengeRef: cppL4_Challenge._id,
    content: `# Code Practice: Verify Exclusive Ownership\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  cppL4_Challenge.activityId = cppL4_Practice._id;
  await cppL4_Challenge.save();

  const cppL4_Quiz = await AssessmentModel.create({
    title: `Assessment: Smart Pointers`,
    description: `Test ownership semantics in modern C++.`,
    passingScore: 70,
    skills: [{"skillId": "cpp-systems-raii", "weight": 1.0}],
    questions: [
    {
        "question": "Why cannot a std::unique_ptr be copied to another variable with copy assignment (ptr2 = ptr1)?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Because unique_ptr models strict exclusive ownership; it can only be moved with std::move()",
            "unique_ptr is an abstract class",
            "The C++ compiler forbids assignment",
            "It requires a garbage collector"
        ],
        "correctOption": 0,
        "explanation": "unique_ptr has a deleted copy constructor to prevent double-free bugs.",
        "points": 10
    }
],
  });

  const cppL4_Assessment = await ActivityModel.create({
    lessonId: cppL4._id,
    type: 'QUIZ',
    title: `Assessment: Smart Pointers`,
    order: 4,
    assessmentRef: cppL4_Quiz._id,
  });
  cppL4_Quiz.activityId = cppL4_Assessment._id;
  await cppL4_Quiz.save();

  cppL4.activities = [
    cppL4_Video._id,
    cppL4_Notes._id,
    cppL4_Practice._id,
    cppL4_Assessment._id,
  ] as any;
  await cppL4.save();

  cppMod2.lessons = [cppL3._id, cppL4._id] as any;
  await cppMod2.save();

  const cppMod3 = await ModuleModel.create({
    courseId: cppCourse._id,
    title: `Module 3: Classes, OOP & Templates`,
    description: `Constructors, destructors, rule of three/five, operator overloading, and template functions.`,
    order: 3,
    lessons: [],
  });

  // --- Lesson 1: Rule of Three & Five: Copy/Move Semantics ---
  const cppL5 = await LessonModel.create({
    moduleId: cppMod3._id,
    courseId: cppCourse._id,
    title: `Rule of Three & Five: Copy/Move Semantics`,
    description: `Master copy constructor, copy assignment, move constructor, move assignment, and destructor.`,
    order: 1,
    activities: [],
  });

  const cppL5_Video = await ActivityModel.create({
    lessonId: cppL5._id,
    type: 'VIDEO',
    title: `Video: Modern C++ Move Semantics & Rule of 5`,
    order: 1,
    resourceRef: getRes('First C++ Program and Header Includes in Tamil')?._id,
    content: `# Move Semantics:\\n- Move semantics transfer ownership of heap resources without copying memory buffers.\\n- Use std::move() to convert an lvalue to an rvalue reference (&&).`,
  });

  const cppL5_Notes = await ActivityModel.create({
    lessonId: cppL5._id,
    type: 'NOTES',
    title: `Codexa Notes: Rule of Three & Five: Copy/Move Semantics`,
    order: 2,
    content: `# Rule of Three & Five: Copy/Move Semantics

Master copy constructor, copy assignment, move constructor, move assignment, and destructor.

If your class manually manages resources, define:
1. Destructor \`~Widget()\`
2. Copy Constructor \`Widget(const Widget&)\`
3. Copy Assignment \`Widget& operator=(const Widget&)\`
4. Move Constructor \`Widget(Widget&&)\`
5. Move Assignment \`Widget& operator=(Widget&&)\`

## Why Rule of Three & Five: Copy/Move Semantics Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`cpp
int transferResource(int fromSize) {
    return fromSize > 0 ? fromSize : 0;
}
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Return positive size.

> ⚠️ **Common Mistake**: Move semantics steer heap pointers directly rather than deep-copying bytes.

## Real-World Production Scenario

In production engineering, **Rule of Three & Five: Copy/Move Semantics** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Rule of Three & Five: Copy/Move Semantics. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('ISO C++ / cppreference')?._id,
  });

  const cppL5_Challenge = await ChallengeModel.create({
    title: `Resource Transfer Simulation`,
    description: `Implement a function that simulates moving resources between two buffer sizes.`,
    difficulty: 'EASY',
    language: 'cpp',
    starterCode: `int transferResource(int fromSize) {
    // Your code here
    return fromSize;
}
`,
    solutionCode: `int transferResource(int fromSize) {
    return fromSize > 0 ? fromSize : 0;
}
`,
    hints: ["Return positive size."],
    skills: [{"skillId": "cpp-programming", "weight": 1.0}],
    testCases: [{"input": "[512]", "expectedOutput": "512", "description": "Transfers resource successfully", "hidden": false}],
  });

  const cppL5_Practice = await ActivityModel.create({
    lessonId: cppL5._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Resource Transfer Simulation`,
    order: 3,
    challengeRef: cppL5_Challenge._id,
    content: `# Code Practice: Resource Transfer Simulation\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  cppL5_Challenge.activityId = cppL5_Practice._id;
  await cppL5_Challenge.save();

  const cppL5_Quiz = await AssessmentModel.create({
    title: `Assessment: Rule of Five & Move Semantics`,
    description: `Test deep copy vs move performance.`,
    passingScore: 70,
    skills: [{"skillId": "cpp-programming", "weight": 1.0}],
    questions: [
    {
        "question": "What is the primary performance benefit of move semantics (&&) in C++11?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "It increases floating point accuracy",
            "It transfers pointer ownership from temporary rvalues without expensive deep memory allocations and copies",
            "It avoids header compilation",
            "It turns C++ into an interpreted language"
        ],
        "correctOption": 1,
        "explanation": "Move semantics steer heap pointers directly rather than deep-copying bytes.",
        "points": 10
    }
],
  });

  const cppL5_Assessment = await ActivityModel.create({
    lessonId: cppL5._id,
    type: 'QUIZ',
    title: `Assessment: Rule of Five & Move Semantics`,
    order: 4,
    assessmentRef: cppL5_Quiz._id,
  });
  cppL5_Quiz.activityId = cppL5_Assessment._id;
  await cppL5_Quiz.save();

  cppL5.activities = [
    cppL5_Video._id,
    cppL5_Notes._id,
    cppL5_Practice._id,
    cppL5_Assessment._id,
  ] as any;
  await cppL5.save();

  // --- Lesson 2: Function & Class Templates ---
  const cppL6 = await LessonModel.create({
    moduleId: cppMod3._id,
    courseId: cppCourse._id,
    title: `Function & Class Templates`,
    description: `Write generic algorithms using template <typename T> evaluated at compile-time.`,
    order: 2,
    activities: [],
  });

  const cppL6_Video = await ActivityModel.create({
    lessonId: cppL6._id,
    type: 'VIDEO',
    title: `Video: C++ Templates Metaprogramming Basics`,
    order: 1,
    resourceRef: getRes('C++ Using Directive and Namespaces in Tamil')?._id,
    content: `# C++ Templates:\\n- Templates generate specialized code for each concrete type at compile time.\\n- Zero runtime overhead through static polymorphism.`,
  });

  const cppL6_Notes = await ActivityModel.create({
    lessonId: cppL6._id,
    type: 'NOTES',
    title: `Codexa Notes: Function & Class Templates`,
    order: 2,
    content: `# Function & Class Templates

Write generic algorithms using template <typename T> evaluated at compile-time.

\`\`\`cpp
template <typename T>
T findMax(T a, T b) {
    return (a > b) ? a : b;
}
\`\`\`

## Why Function & Class Templates Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Check bounds: if val < minV return minV; if val > maxV return maxV.

> ⚠️ **Common Mistake**: The C++ compiler instantiates type-specific concrete code during compilation.

## Real-World Production Scenario

In production engineering, **Function & Class Templates** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Function & Class Templates. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('ISO C++ / cppreference')?._id,
  });

  const cppL6_Challenge = await ChallengeModel.create({
    title: `Template Clamp Function`,
    description: `Implement a clamp function that constrains value between min and max.`,
    difficulty: 'EASY',
    language: 'cpp',
    starterCode: `int clampVal(int val, int minV, int maxV) {
    // Your code here
    return val;
}
`,
    solutionCode: `int clampVal(int val, int minV, int maxV) {
    if (val < minV) return minV;
    if (val > maxV) return maxV;
    return val;
}
`,
    hints: ["Check bounds: if val < minV return minV; if val > maxV return maxV."],
    skills: [{"skillId": "cpp-programming", "weight": 1.0}],
    testCases: [{"input": "[15, 0, 10]", "expectedOutput": "10", "description": "Clamps value to maximum", "hidden": false}],
  });

  const cppL6_Practice = await ActivityModel.create({
    lessonId: cppL6._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Template Clamp Function`,
    order: 3,
    challengeRef: cppL6_Challenge._id,
    content: `# Code Practice: Template Clamp Function\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  cppL6_Challenge.activityId = cppL6_Practice._id;
  await cppL6_Challenge.save();

  const cppL6_Quiz = await AssessmentModel.create({
    title: `Assessment: C++ Templates`,
    description: `Test template instantiation and type deduction.`,
    passingScore: 70,
    skills: [{"skillId": "cpp-programming", "weight": 1.0}],
    questions: [
    {
        "question": "When does template instantiation take place in C++?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "At runtime when the function is called",
            "At compile time for each distinct concrete type requested",
            "In the linker phase only",
            "Inside the operating system kernel"
        ],
        "correctOption": 1,
        "explanation": "The C++ compiler instantiates type-specific concrete code during compilation.",
        "points": 10
    }
],
  });

  const cppL6_Assessment = await ActivityModel.create({
    lessonId: cppL6._id,
    type: 'QUIZ',
    title: `Assessment: C++ Templates`,
    order: 4,
    assessmentRef: cppL6_Quiz._id,
  });
  cppL6_Quiz.activityId = cppL6_Assessment._id;
  await cppL6_Quiz.save();

  cppL6.activities = [
    cppL6_Video._id,
    cppL6_Notes._id,
    cppL6_Practice._id,
    cppL6_Assessment._id,
  ] as any;
  await cppL6.save();

  cppMod3.lessons = [cppL5._id, cppL6._id] as any;
  await cppMod3.save();

  const cppMod4 = await ModuleModel.create({
    courseId: cppCourse._id,
    title: `Module 4: Standard Template Library (STL)`,
    description: `std::vector, std::unordered_map, iterators, and <algorithm> utilities.`,
    order: 4,
    lessons: [],
  });

  // --- Lesson 1: STL std::vector & Sequence Containers ---
  const cppL7 = await LessonModel.create({
    moduleId: cppMod4._id,
    courseId: cppCourse._id,
    title: `STL std::vector & Sequence Containers`,
    description: `Dynamic array growth, capacity vs size, reserve(), and iterator traversal.`,
    order: 1,
    activities: [],
  });

  const cppL7_Video = await ActivityModel.create({
    lessonId: cppL7._id,
    type: 'VIDEO',
    title: `Video: Modern C++ STL Containers (std::vector, std::map)`,
    order: 1,
    resourceRef: getRes('C++ Main Function and Return Status Codes in Tamil')?._id,
    content: `# std::vector:\\n- Use reserve(N) to avoid reallocations when the target size is known.\\n- Contiguous memory guarantees cache locality.`,
  });

  const cppL7_Notes = await ActivityModel.create({
    lessonId: cppL7._id,
    type: 'NOTES',
    title: `Codexa Notes: STL std::vector & Sequence Containers`,
    order: 2,
    content: `# STL std::vector & Sequence Containers

Dynamic array growth, capacity vs size, reserve(), and iterator traversal.

\`\`\`cpp
#include <vector>

std::vector<int> nums;
nums.reserve(100); // Pre-allocate memory
nums.push_back(10);
nums.push_back(20);
\`\`\`

## Why STL std::vector & Sequence Containers Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Return elementsToAdd if positive.

> ⚠️ **Common Mistake**: Contiguous memory layout minimizes CPU cache misses during sequential iteration.

## Real-World Production Scenario

In production engineering, **STL std::vector & Sequence Containers** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of STL std::vector & Sequence Containers. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('ISO C++ / cppreference')?._id,
  });

  const cppL7_Challenge = await ChallengeModel.create({
    title: `Vector Capacity Growth Calculator`,
    description: `Implement a function returning expected size after push_back operations.`,
    difficulty: 'EASY',
    language: 'cpp',
    starterCode: `int getVectorSize(int elementsToAdd) {
    // Your code here
    return elementsToAdd;
}
`,
    solutionCode: `int getVectorSize(int elementsToAdd) {
    return elementsToAdd > 0 ? elementsToAdd : 0;
}
`,
    hints: ["Return elementsToAdd if positive."],
    skills: [{"skillId": "cpp-programming", "weight": 1.0}],
    testCases: [{"input": "[5]", "expectedOutput": "5", "description": "Tracks vector size", "hidden": false}],
  });

  const cppL7_Practice = await ActivityModel.create({
    lessonId: cppL7._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Vector Capacity Growth Calculator`,
    order: 3,
    challengeRef: cppL7_Challenge._id,
    content: `# Code Practice: Vector Capacity Growth Calculator\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  cppL7_Challenge.activityId = cppL7_Practice._id;
  await cppL7_Challenge.save();

  const cppL7_Quiz = await AssessmentModel.create({
    title: `Assessment: STL Containers`,
    description: `Test vector memory allocation and iterator invalidation.`,
    passingScore: 70,
    skills: [{"skillId": "cpp-programming", "weight": 1.0}],
    questions: [
    {
        "question": "What is the primary advantage of std::vector storing its elements contiguously in memory?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "It supports multiple inheritance",
            "It maximizes CPU cache locality, providing high-performance sequential reads",
            "It eliminates pointer arithmetic",
            "It encrypts element values"
        ],
        "correctOption": 1,
        "explanation": "Contiguous memory layout minimizes CPU cache misses during sequential iteration.",
        "points": 10
    }
],
  });

  const cppL7_Assessment = await ActivityModel.create({
    lessonId: cppL7._id,
    type: 'QUIZ',
    title: `Assessment: STL Containers`,
    order: 4,
    assessmentRef: cppL7_Quiz._id,
  });
  cppL7_Quiz.activityId = cppL7_Assessment._id;
  await cppL7_Quiz.save();

  cppL7.activities = [
    cppL7_Video._id,
    cppL7_Notes._id,
    cppL7_Practice._id,
    cppL7_Assessment._id,
  ] as any;
  await cppL7.save();

  // --- Lesson 2: STL Algorithms: std::sort, std::find & Lambda Expressions ---
  const cppL8 = await LessonModel.create({
    moduleId: cppMod4._id,
    courseId: cppCourse._id,
    title: `STL Algorithms: std::sort, std::find & Lambda Expressions`,
    description: `Use <algorithm> functions with custom comparator lambdas for efficient data processing.`,
    order: 2,
    activities: [],
  });

  const cppL8_Video = await ActivityModel.create({
    lessonId: cppL8._id,
    type: 'VIDEO',
    title: `Video: C++ STL Algorithms & Lambdas`,
    order: 1,
    resourceRef: getRes('C++ Comments and Documentation Syntax in Tamil')?._id,
    content: `# STL Algorithms:\\n- Prefer standard algorithms (std::sort, std::transform) over raw loops.\\n- Lambda syntax: [capture](params) -> return_type { body }.`,
  });

  const cppL8_Notes = await ActivityModel.create({
    lessonId: cppL8._id,
    type: 'NOTES',
    title: `Codexa Notes: STL Algorithms: std::sort, std::find & Lambda Expressions`,
    order: 2,
    content: `# STL Algorithms: std::sort, std::find & Lambda Expressions

Use <algorithm> functions with custom comparator lambdas for efficient data processing.

\`\`\`cpp
#include <algorithm>
#include <vector>

std::vector<int> v = {4, 1, 3, 2};
std::sort(v.begin(), v.end(), [](int a, int b) {
    return a > b; // Descending order
});
\`\`\`

## Why STL Algorithms: std::sort, std::find & Lambda Expressions Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Count items with arr[i] > threshold.

> ⚠️ **Common Mistake**: std::sort uses Introsort, guaranteeing O(n log n) even in worst-case scenarios.

## Real-World Production Scenario

In production engineering, **STL Algorithms: std::sort, std::find & Lambda Expressions** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of STL Algorithms: std::sort, std::find & Lambda Expressions. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('ISO C++ / cppreference')?._id,
  });

  const cppL8_Challenge = await ChallengeModel.create({
    title: `Count Elements Matching Predicate`,
    description: `Implement a function counting elements greater than threshold.`,
    difficulty: 'EASY',
    language: 'cpp',
    starterCode: `int countGreaterThan(const int* arr, int size, int threshold) {
    // Your code here
    return 0;
}
`,
    solutionCode: `int countGreaterThan(const int* arr, int size, int threshold) {
    if (!arr || size <= 0) return 0;
    int count = 0;
    for (int i = 0; i < size; i++) {
        if (arr[i] > threshold) count++;
    }
    return count;
}
`,
    hints: ["Count items with arr[i] > threshold."],
    skills: [{"skillId": "cpp-programming", "weight": 1.0}],
    testCases: [{"input": "[[1, 5, 8, 2, 9], 5, 4]", "expectedOutput": "3", "description": "Counts items greater than 4", "hidden": false}],
  });

  const cppL8_Practice = await ActivityModel.create({
    lessonId: cppL8._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Count Elements Matching Predicate`,
    order: 3,
    challengeRef: cppL8_Challenge._id,
    content: `# Code Practice: Count Elements Matching Predicate\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  cppL8_Challenge.activityId = cppL8_Practice._id;
  await cppL8_Challenge.save();

  const cppL8_Quiz = await AssessmentModel.create({
    title: `Assessment: STL Algorithms`,
    description: `Test algorithm efficiency and lambda capture.`,
    passingScore: 70,
    skills: [{"skillId": "cpp-programming", "weight": 1.0}],
    questions: [
    {
        "question": "What is the worst-case time complexity of std::sort in the C++ Standard Library (Introsort)?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "O(n^2)",
            "O(n log n)",
            "O(n)",
            "O(log n)"
        ],
        "correctOption": 1,
        "explanation": "std::sort uses Introsort, guaranteeing O(n log n) even in worst-case scenarios.",
        "points": 10
    }
],
  });

  const cppL8_Assessment = await ActivityModel.create({
    lessonId: cppL8._id,
    type: 'QUIZ',
    title: `Assessment: STL Algorithms`,
    order: 4,
    assessmentRef: cppL8_Quiz._id,
  });
  cppL8_Quiz.activityId = cppL8_Assessment._id;
  await cppL8_Quiz.save();

  cppL8.activities = [
    cppL8_Video._id,
    cppL8_Notes._id,
    cppL8_Practice._id,
    cppL8_Assessment._id,
  ] as any;
  await cppL8.save();

  cppMod4.lessons = [cppL7._id, cppL8._id] as any;
  await cppMod4.save();

  cppCourse.modules = [cppMod1._id, cppMod2._id, cppMod3._id, cppMod4._id] as any;
  await cppCourse.save();

  // =========================================================================
  // 5. GO CLOUD SERVICES & CONCURRENCY
  // =========================================================================
  const goCourse = await CourseModel.create({
    slug: 'go-programming',
    title: 'Go Cloud Services & Concurrency Engineering',
    description: 'Master Go from syntax to advanced concurrency with goroutines, channels, interfaces, microservices with net/http, and context cancellation.',
    domain: 'Programming Languages',
    level: 'INTERMEDIATE',
    status: 'PUBLISHED',
    estimatedHours: 45,
    skillsCovered: ['go-programming'],
    prerequisites: ['Basic programming knowledge in any language'],
    modules: [],
  });

  const goMod1 = await ModuleModel.create({
    courseId: goCourse._id,
    title: `Module 1: Go Foundations & Control Flow`,
    description: `Go packages, explicit typing, multiple return values, and explicit error handling.`,
    order: 1,
    lessons: [],
  });

  // --- Lesson 1: Go Packages, Variables & Multiple Return Values ---
  const goL1 = await LessonModel.create({
    moduleId: goMod1._id,
    courseId: goCourse._id,
    title: `Go Packages, Variables & Multiple Return Values`,
    description: `Understand package main, short variable declarations (:=), and returning (value, error) pairs.`,
    order: 1,
    activities: [],
  });

  const goL1_Video = await ActivityModel.create({
    lessonId: goL1._id,
    type: 'VIDEO',
    title: `Video: Go / Golang Tutorial for Beginners`,
    order: 1,
    resourceRef: getRes('Golang Complete Course Introduction in Tamil')?._id,
    content: `# Go Foundations:\\n- Go compiles to standalone static native binaries.\\n- Functions can return multiple values: (result, err).`,
  });

  const goL1_Notes = await ActivityModel.create({
    lessonId: goL1._id,
    type: 'NOTES',
    title: `Codexa Notes: Go Packages, Variables & Multiple Return Values`,
    order: 2,
    content: `# Go Packages, Variables & Multiple Return Values

Understand package main, short variable declarations (:=), and returning (value, error) pairs.

\`\`\`go
package main

import (
    "fmt"
    "errors"
)

func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}
\`\`\`

## Why Go Packages, Variables & Multiple Return Values Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Check b == 0 before dividing.

> ⚠️ **Common Mistake**: Idiomatic Go avoids exceptions for expected control flow, returning error values explicitly.

## Real-World Production Scenario

In production engineering, **Go Packages, Variables & Multiple Return Values** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Go Packages, Variables & Multiple Return Values. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Go.dev: Effective Go')?._id,
  });

  const goL1_Challenge = await ChallengeModel.create({
    title: `Go Safe Division with Error Pattern`,
    description: `Implement a function that performs division returning value or 0 on zero divisor.`,
    difficulty: 'EASY',
    language: 'go',
    starterCode: `package main

func SafeDivide(a, b float64) float64 {
    // Your code here
    return 0.0
}
`,
    solutionCode: `package main

func SafeDivide(a, b float64) float64 {
    if b == 0 {
        return 0.0
    }
    return a / b
}
`,
    hints: ["Check b == 0 before dividing."],
    skills: [{"skillId": "go-programming", "weight": 1.0}],
    testCases: [{"input": "[10.0, 2.0]", "expectedOutput": "5.0", "description": "Divides valid float numbers", "hidden": false}],
  });

  const goL1_Practice = await ActivityModel.create({
    lessonId: goL1._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Go Safe Division with Error Pattern`,
    order: 3,
    challengeRef: goL1_Challenge._id,
    content: `# Code Practice: Go Safe Division with Error Pattern\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  goL1_Challenge.activityId = goL1_Practice._id;
  await goL1_Challenge.save();

  const goL1_Quiz = await AssessmentModel.create({
    title: `Assessment: Go Foundations`,
    description: `Test Go return conventions and package structure.`,
    passingScore: 70,
    skills: [{"skillId": "go-programming", "weight": 1.0}],
    questions: [
    {
        "question": "How does idiomatic Go handle expected runtime errors (e.g. file not found, bad input)?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Using try/catch/finally blocks",
            "By returning an error as the final return value and checking if err != nil",
            "By terminating the process with a fatal panic",
            "By setting global errno"
        ],
        "correctOption": 1,
        "explanation": "Idiomatic Go avoids exceptions for expected control flow, returning error values explicitly.",
        "points": 10
    }
],
  });

  const goL1_Assessment = await ActivityModel.create({
    lessonId: goL1._id,
    type: 'QUIZ',
    title: `Assessment: Go Foundations`,
    order: 4,
    assessmentRef: goL1_Quiz._id,
  });
  goL1_Quiz.activityId = goL1_Assessment._id;
  await goL1_Quiz.save();

  goL1.activities = [
    goL1_Video._id,
    goL1_Notes._id,
    goL1_Practice._id,
    goL1_Assessment._id,
  ] as any;
  await goL1.save();

  // --- Lesson 2: Slices, Maps & Range Loops in Go ---
  const goL2 = await LessonModel.create({
    moduleId: goMod1._id,
    courseId: goCourse._id,
    title: `Slices, Maps & Range Loops in Go`,
    description: `Master dynamically sized slices, slice headers, make(), and map key lookups.`,
    order: 2,
    activities: [],
  });

  const goL2_Video = await ActivityModel.create({
    lessonId: goL2._id,
    type: 'VIDEO',
    title: `Video: Go Slices & Maps Deep Dive`,
    order: 1,
    resourceRef: getRes('Golang Variables and Short Declaration in Tamil')?._id,
    content: `# Slices & Maps:\\n- A slice is a descriptor of an underlying array: pointer, length, and capacity.\\n- Maps provide O(1) hash table access: val, ok := m[key].`,
  });

  const goL2_Notes = await ActivityModel.create({
    lessonId: goL2._id,
    type: 'NOTES',
    title: `Codexa Notes: Slices, Maps & Range Loops in Go`,
    order: 2,
    content: `# Slices, Maps & Range Loops in Go

Master dynamically sized slices, slice headers, make(), and map key lookups.

\`\`\`go
// Slice with make(type, len, cap)
scores := make([]int, 0, 10)
scores = append(scores, 100)

// Map with comma-ok idiom
userMap := make(map[string]int)
userMap["alex"] = 95
if score, ok := userMap["alex"]; ok {
    fmt.Println("Score:", score)
}
\`\`\`

## Why Slices, Maps & Range Loops in Go Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Iterate with for _, n := range nums and append if n > 0.

> ⚠️ **Common Mistake**: The ok boolean distinguishes between a missing key and a present key holding the zero-value.

## Real-World Production Scenario

In production engineering, **Slices, Maps & Range Loops in Go** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Slices, Maps & Range Loops in Go. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Go.dev: Effective Go')?._id,
  });

  const goL2_Challenge = await ChallengeModel.create({
    title: `Filter Positive Slices`,
    description: `Implement \`FilterPositive(nums []int) []int\` returning only positive integers.`,
    difficulty: 'EASY',
    language: 'go',
    starterCode: `package main

func FilterPositive(nums []int) []int {
    // Your code here
    return []int{}
}
`,
    solutionCode: `package main

func FilterPositive(nums []int) []int {
    var result []int
    for _, n := range nums {
        if n > 0 {
            result = append(result, n)
        }
    }
    return result
}
`,
    hints: ["Iterate with for _, n := range nums and append if n > 0."],
    skills: [{"skillId": "go-programming", "weight": 1.0}],
    testCases: [{"input": "[[1, -2, 3, 4]]", "expectedOutput": "[1, 3, 4]", "description": "Filters positive slice elements", "hidden": false}],
  });

  const goL2_Practice = await ActivityModel.create({
    lessonId: goL2._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Filter Positive Slices`,
    order: 3,
    challengeRef: goL2_Challenge._id,
    content: `# Code Practice: Filter Positive Slices\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  goL2_Challenge.activityId = goL2_Practice._id;
  await goL2_Challenge.save();

  const goL2_Quiz = await AssessmentModel.create({
    title: `Assessment: Slices & Maps`,
    description: `Test slice headers and map lookup idioms.`,
    passingScore: 70,
    skills: [{"skillId": "go-programming", "weight": 1.0}],
    questions: [
    {
        "question": "What does the comma-ok idiom val, ok := m[key] verify when reading from a Go map?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Whether the map is currently locked",
            "Whether the key was actually present in the map (ok == true)",
            "Whether the value is non-zero",
            "Whether garbage collection is running"
        ],
        "correctOption": 1,
        "explanation": "The ok boolean distinguishes between a missing key and a present key holding the zero-value.",
        "points": 10
    }
],
  });

  const goL2_Assessment = await ActivityModel.create({
    lessonId: goL2._id,
    type: 'QUIZ',
    title: `Assessment: Slices & Maps`,
    order: 4,
    assessmentRef: goL2_Quiz._id,
  });
  goL2_Quiz.activityId = goL2_Assessment._id;
  await goL2_Quiz.save();

  goL2.activities = [
    goL2_Video._id,
    goL2_Notes._id,
    goL2_Practice._id,
    goL2_Assessment._id,
  ] as any;
  await goL2.save();

  goMod1.lessons = [goL1._id, goL2._id] as any;
  await goMod1.save();

  const goMod2 = await ModuleModel.create({
    courseId: goCourse._id,
    title: `Module 2: Structs, Methods & Interfaces`,
    description: `Struct composition, pointer vs value receivers, and implicit interface implementation.`,
    order: 2,
    lessons: [],
  });

  // --- Lesson 1: Structs & Pointer vs Value Method Receivers ---
  const goL3 = await LessonModel.create({
    moduleId: goMod2._id,
    courseId: goCourse._id,
    title: `Structs & Pointer vs Value Method Receivers`,
    description: `Define custom types and choose between (s Struct) value receiver vs (s *Struct) pointer receiver.`,
    order: 1,
    activities: [],
  });

  const goL3_Video = await ActivityModel.create({
    lessonId: goL3._id,
    type: 'VIDEO',
    title: `Video: Go Structs and Method Receivers`,
    order: 1,
    resourceRef: getRes('Golang Package Main and Imports in Tamil')?._id,
    content: `# Method Receivers:\\n- Use pointer receivers (s *Server) when the method mutates the struct or struct is large.\\n- Value receivers (s Server) operate on copies.`,
  });

  const goL3_Notes = await ActivityModel.create({
    lessonId: goL3._id,
    type: 'NOTES',
    title: `Codexa Notes: Structs & Pointer vs Value Method Receivers`,
    order: 2,
    content: `# Structs & Pointer vs Value Method Receivers

Define custom types and choose between (s Struct) value receiver vs (s *Struct) pointer receiver.

\`\`\`go
type User struct {
    Name  string
    Score int
}

// Pointer receiver (mutates state)
func (u *User) AddScore(points int) {
    u.Score += points
}
\`\`\`

## Why Structs & Pointer vs Value Method Receivers Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use pointer receiver to modify a.Balance.

> ⚠️ **Common Mistake**: Pointer receivers operate directly on the original struct in memory.

## Real-World Production Scenario

In production engineering, **Structs & Pointer vs Value Method Receivers** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Structs & Pointer vs Value Method Receivers. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Go.dev: Effective Go')?._id,
  });

  const goL3_Challenge = await ChallengeModel.create({
    title: `Struct Account Deposit Method`,
    description: `Implement struct \`Account\` with \`Balance float64\` and \`Deposit(amount float64)\` method.`,
    difficulty: 'EASY',
    language: 'go',
    starterCode: `package main

type Account struct {
    Balance float64
}

func (a *Account) Deposit(amount float64) {
    // Your code here
}
`,
    solutionCode: `package main

type Account struct {
    Balance float64
}

func (a *Account) Deposit(amount float64) {
    if amount > 0 {
        a.Balance += amount
    }
}
`,
    hints: ["Use pointer receiver to modify a.Balance."],
    skills: [{"skillId": "go-programming", "weight": 1.0}],
    testCases: [{"input": "[100.0, 50.0]", "expectedOutput": "150.0", "description": "Mutates struct balance", "hidden": false}],
  });

  const goL3_Practice = await ActivityModel.create({
    lessonId: goL3._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Struct Account Deposit Method`,
    order: 3,
    challengeRef: goL3_Challenge._id,
    content: `# Code Practice: Struct Account Deposit Method\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  goL3_Challenge.activityId = goL3_Practice._id;
  await goL3_Challenge.save();

  const goL3_Quiz = await AssessmentModel.create({
    title: `Assessment: Structs & Receivers`,
    description: `Test value vs pointer receiver mechanics.`,
    passingScore: 70,
    skills: [{"skillId": "go-programming", "weight": 1.0}],
    questions: [
    {
        "question": "Why must a method use a pointer receiver (s *Struct) if it needs to update fields on the struct?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Value receivers are illegal in Go",
            "Value receivers receive a copy of the struct; changes made to a copy are discarded after the method returns",
            "Pointer receivers run in separate goroutines",
            "It is required by package fmt"
        ],
        "correctOption": 1,
        "explanation": "Pointer receivers operate directly on the original struct in memory.",
        "points": 10
    }
],
  });

  const goL3_Assessment = await ActivityModel.create({
    lessonId: goL3._id,
    type: 'QUIZ',
    title: `Assessment: Structs & Receivers`,
    order: 4,
    assessmentRef: goL3_Quiz._id,
  });
  goL3_Quiz.activityId = goL3_Assessment._id;
  await goL3_Quiz.save();

  goL3.activities = [
    goL3_Video._id,
    goL3_Notes._id,
    goL3_Practice._id,
    goL3_Assessment._id,
  ] as any;
  await goL3.save();

  // --- Lesson 2: Interfaces & Implicit Duck Typing in Go ---
  const goL4 = await LessonModel.create({
    moduleId: goMod2._id,
    courseId: goCourse._id,
    title: `Interfaces & Implicit Duck Typing in Go`,
    description: `Design flexible architectures using small interfaces implemented implicitly by any matching type.`,
    order: 2,
    activities: [],
  });

  const goL4_Video = await ActivityModel.create({
    lessonId: goL4._id,
    type: 'VIDEO',
    title: `Video: Go Interfaces & Duck Typing Explained`,
    order: 1,
    resourceRef: getRes('Golang Constants and Type Inference in Tamil')?._id,
    content: `# Go Interfaces:\\n- Interfaces are satisfied implicitly (no 'implements' keyword).\\n- Keep interfaces small (e.g. io.Reader, io.Writer).`,
  });

  const goL4_Notes = await ActivityModel.create({
    lessonId: goL4._id,
    type: 'NOTES',
    title: `Codexa Notes: Interfaces & Implicit Duck Typing in Go`,
    order: 2,
    content: `# Interfaces & Implicit Duck Typing in Go

Design flexible architectures using small interfaces implemented implicitly by any matching type.

Types implement interfaces implicitly by implementing the required method signatures:

\`\`\`go
type Greeter interface {
    Greet() string
}

type Bot struct{}
func (b Bot) Greet() string { return "Hello from Go Bot" }
\`\`\`

## Why Interfaces & Implicit Duck Typing in Go Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Return 'Name: ' + p.Name

> ⚠️ **Common Mistake**: Go uses structural typing: satisfying the interface signature satisfies the interface automatically.

## Real-World Production Scenario

In production engineering, **Interfaces & Implicit Duck Typing in Go** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Interfaces & Implicit Duck Typing in Go. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Go.dev: Effective Go')?._id,
  });

  const goL4_Challenge = await ChallengeModel.create({
    title: `Implement Stringer Interface`,
    description: `Implement \`String()\` method on \`Person\` struct returning \`"Name: " + p.Name\`.`,
    difficulty: 'EASY',
    language: 'go',
    starterCode: `package main

type Person struct {
    Name string
}

func (p Person) String() string {
    // Your code here
    return ""
}
`,
    solutionCode: `package main

type Person struct {
    Name string
}

func (p Person) String() string {
    return "Name: " + p.Name
}
`,
    hints: ["Return 'Name: ' + p.Name"],
    skills: [{"skillId": "go-programming", "weight": 1.0}],
    testCases: [{"input": "[\"Alex\"]", "expectedOutput": "\"Name: Alex\"", "description": "Formats string output", "hidden": false}],
  });

  const goL4_Practice = await ActivityModel.create({
    lessonId: goL4._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Implement Stringer Interface`,
    order: 3,
    challengeRef: goL4_Challenge._id,
    content: `# Code Practice: Implement Stringer Interface\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  goL4_Challenge.activityId = goL4_Practice._id;
  await goL4_Challenge.save();

  const goL4_Quiz = await AssessmentModel.create({
    title: `Assessment: Go Interfaces`,
    description: `Test interface satisfaction rules.`,
    passingScore: 70,
    skills: [{"skillId": "go-programming", "weight": 1.0}],
    questions: [
    {
        "question": "How does a Go struct declare that it implements a specific interface?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "Using the 'implements' keyword in struct definition",
            "Implicitly, simply by having methods that match all the interface method signatures",
            "By registering with the runtime package",
            "Inside go.mod"
        ],
        "correctOption": 1,
        "explanation": "Go uses structural typing: satisfying the interface signature satisfies the interface automatically.",
        "points": 10
    }
],
  });

  const goL4_Assessment = await ActivityModel.create({
    lessonId: goL4._id,
    type: 'QUIZ',
    title: `Assessment: Go Interfaces`,
    order: 4,
    assessmentRef: goL4_Quiz._id,
  });
  goL4_Quiz.activityId = goL4_Assessment._id;
  await goL4_Quiz.save();

  goL4.activities = [
    goL4_Video._id,
    goL4_Notes._id,
    goL4_Practice._id,
    goL4_Assessment._id,
  ] as any;
  await goL4.save();

  goMod2.lessons = [goL3._id, goL4._id] as any;
  await goMod2.save();

  const goMod3 = await ModuleModel.create({
    courseId: goCourse._id,
    title: `Module 3: Concurrency: Goroutines & Channels`,
    description: `Lightweight threads (goroutines), channel communication, select statement, and sync.WaitGroup.`,
    order: 3,
    lessons: [],
  });

  // --- Lesson 1: Goroutines, Channels & Synchronization ---
  const goL5 = await LessonModel.create({
    moduleId: goMod3._id,
    courseId: goCourse._id,
    title: `Goroutines, Channels & Synchronization`,
    description: `Spawn concurrent goroutines with 'go' and communicate safely across unbuffered/buffered channels.`,
    order: 1,
    activities: [],
  });

  const goL5_Video = await ActivityModel.create({
    lessonId: goL5._id,
    type: 'VIDEO',
    title: `Video: Go Concurrency: Goroutines & Channels`,
    order: 1,
    resourceRef: getRes('Golang Data Types and Slices in Tamil')?._id,
    content: `# Go Concurrency:\\n- Do not communicate by sharing memory; instead, share memory by communicating.\\n- Goroutines are multiplexed onto OS threads by the Go runtime scheduler.`,
  });

  const goL5_Notes = await ActivityModel.create({
    lessonId: goL5._id,
    type: 'NOTES',
    title: `Codexa Notes: Goroutines, Channels & Synchronization`,
    order: 2,
    content: `# Goroutines, Channels & Synchronization

Spawn concurrent goroutines with 'go' and communicate safely across unbuffered/buffered channels.

\`\`\`go
ch := make(chan int)

// Producer goroutine
go func() {
    ch <- 42 // Send value into channel
}()

// Consumer
val := <-ch // Receive from channel
\`\`\`

## Why Goroutines, Channels & Synchronization Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use for val := range ch to read until channel closes.

> ⚠️ **Common Mistake**: Unbuffered channels are synchronous: sending blocks until another goroutine receives.

## Real-World Production Scenario

In production engineering, **Goroutines, Channels & Synchronization** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Goroutines, Channels & Synchronization. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Go.dev: Effective Go')?._id,
  });

  const goL5_Challenge = await ChallengeModel.create({
    title: `Channel Pipeline Flow`,
    description: `Implement a function that sends values into a channel and closes it safely.`,
    difficulty: 'EASY',
    language: 'go',
    starterCode: `package main

func SumChannel(ch <-chan int) int {
    sum := 0
    for val := range ch {
        sum += val
    }
    return sum
}
`,
    solutionCode: `package main

func SumChannel(ch <-chan int) int {
    sum := 0
    for val := range ch {
        sum += val
    }
    return sum
}
`,
    hints: ["Use for val := range ch to read until channel closes."],
    skills: [{"skillId": "go-programming", "weight": 1.0}],
    testCases: [{"input": "[[1, 2, 3]]", "expectedOutput": "6", "description": "Sums channel stream", "hidden": false}],
  });

  const goL5_Practice = await ActivityModel.create({
    lessonId: goL5._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Channel Pipeline Flow`,
    order: 3,
    challengeRef: goL5_Challenge._id,
    content: `# Code Practice: Channel Pipeline Flow\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  goL5_Challenge.activityId = goL5_Practice._id;
  await goL5_Challenge.save();

  const goL5_Quiz = await AssessmentModel.create({
    title: `Assessment: Go Concurrency`,
    description: `Test channel blocking and goroutine scheduling.`,
    passingScore: 70,
    skills: [{"skillId": "go-programming", "weight": 1.0}],
    questions: [
    {
        "question": "What happens when sending data to an unbuffered channel in Go when no receiver is ready?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "The sender goroutine blocks until a receiver accepts the value",
            "The value is dropped silently",
            "The runtime panics immediately",
            "The channel converts to a heap buffer"
        ],
        "correctOption": 0,
        "explanation": "Unbuffered channels are synchronous: sending blocks until another goroutine receives.",
        "points": 10
    }
],
  });

  const goL5_Assessment = await ActivityModel.create({
    lessonId: goL5._id,
    type: 'QUIZ',
    title: `Assessment: Go Concurrency`,
    order: 4,
    assessmentRef: goL5_Quiz._id,
  });
  goL5_Quiz.activityId = goL5_Assessment._id;
  await goL5_Quiz.save();

  goL5.activities = [
    goL5_Video._id,
    goL5_Notes._id,
    goL5_Practice._id,
    goL5_Assessment._id,
  ] as any;
  await goL5.save();

  // --- Lesson 2: Select Multiplexing & sync.WaitGroup Coordination ---
  const goL6 = await LessonModel.create({
    moduleId: goMod3._id,
    courseId: goCourse._id,
    title: `Select Multiplexing & sync.WaitGroup Coordination`,
    description: `Coordinate multiple goroutines with sync.WaitGroup and handle multi-channel events with select.`,
    order: 2,
    activities: [],
  });

  const goL6_Video = await ActivityModel.create({
    lessonId: goL6._id,
    type: 'VIDEO',
    title: `Video: Go Select Statement & WaitGroup Coordination`,
    order: 1,
    resourceRef: getRes('Golang User Input and Formatting in Tamil')?._id,
    content: `# Coordination:\\n- sync.WaitGroup tracks pending tasks: Add(), Done(), Wait().\\n- select blocks until one of several channel communication cases is ready.`,
  });

  const goL6_Notes = await ActivityModel.create({
    lessonId: goL6._id,
    type: 'NOTES',
    title: `Codexa Notes: Select Multiplexing & sync.WaitGroup Coordination`,
    order: 2,
    content: `# Select Multiplexing & sync.WaitGroup Coordination

Coordinate multiple goroutines with sync.WaitGroup and handle multi-channel events with select.

\`\`\`go
var wg sync.WaitGroup
wg.Add(2)

go func() { defer wg.Done(); doWork(1) }()
go func() { defer wg.Done(); doWork(2) }()

wg.Wait() // Blocks until counter reaches 0
\`\`\`

## Why Select Multiplexing & sync.WaitGroup Coordination Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Return positive total count.

> ⚠️ **Common Mistake**: A default case in select makes channel operations non-blocking.

## Real-World Production Scenario

In production engineering, **Select Multiplexing & sync.WaitGroup Coordination** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Select Multiplexing & sync.WaitGroup Coordination. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Go.dev: Effective Go')?._id,
  });

  const goL6_Challenge = await ChallengeModel.create({
    title: `WaitGroup Task Counter Simulation`,
    description: `Implement a function returning completed task count.`,
    difficulty: 'EASY',
    language: 'go',
    starterCode: `package main

func CountCompletedTasks(total int) int {
    // Your code here
    return total;
}
`,
    solutionCode: `package main

func CountCompletedTasks(total int) int {
    if total < 0 { return 0 }
    return total
}
`,
    hints: ["Return positive total count."],
    skills: [{"skillId": "go-programming", "weight": 1.0}],
    testCases: [{"input": "[5]", "expectedOutput": "5", "description": "Tracks completed tasks", "hidden": false}],
  });

  const goL6_Practice = await ActivityModel.create({
    lessonId: goL6._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: WaitGroup Task Counter Simulation`,
    order: 3,
    challengeRef: goL6_Challenge._id,
    content: `# Code Practice: WaitGroup Task Counter Simulation\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  goL6_Challenge.activityId = goL6_Practice._id;
  await goL6_Challenge.save();

  const goL6_Quiz = await AssessmentModel.create({
    title: `Assessment: Select & WaitGroups`,
    description: `Test synchronization and deadlock prevention.`,
    passingScore: 70,
    skills: [{"skillId": "go-programming", "weight": 1.0}],
    questions: [
    {
        "question": "What happens if a select statement has a default case and none of the channel cases are ready to proceed?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "The select block terminates the process",
            "The default case executes immediately without blocking the goroutine",
            "The goroutine sleeps for 1 second",
            "A deadlock panic occurs"
        ],
        "correctOption": 1,
        "explanation": "A default case in select makes channel operations non-blocking.",
        "points": 10
    }
],
  });

  const goL6_Assessment = await ActivityModel.create({
    lessonId: goL6._id,
    type: 'QUIZ',
    title: `Assessment: Select & WaitGroups`,
    order: 4,
    assessmentRef: goL6_Quiz._id,
  });
  goL6_Quiz.activityId = goL6_Assessment._id;
  await goL6_Quiz.save();

  goL6.activities = [
    goL6_Video._id,
    goL6_Notes._id,
    goL6_Practice._id,
    goL6_Assessment._id,
  ] as any;
  await goL6.save();

  goMod3.lessons = [goL5._id, goL6._id] as any;
  await goMod3.save();

  const goMod4 = await ModuleModel.create({
    courseId: goCourse._id,
    title: `Module 4: HTTP Services & Cloud Microservices`,
    description: `net/http server, JSON encoding/decoding, middleware, and context cancellation.`,
    order: 4,
    lessons: [],
  });

  // --- Lesson 1: Building HTTP Microservices with net/http ---
  const goL7 = await LessonModel.create({
    moduleId: goMod4._id,
    courseId: goCourse._id,
    title: `Building HTTP Microservices with net/http`,
    description: `Construct production HTTP API servers using Go's standard library net/http and http.HandlerFunc.`,
    order: 1,
    activities: [],
  });

  const goL7_Video = await ActivityModel.create({
    lessonId: goL7._id,
    type: 'VIDEO',
    title: `Video: Building REST APIs in Go with Standard Library`,
    order: 1,
    resourceRef: getRes('Golang Functions and Multiple Return Values in Tamil')?._id,
    content: `# Go HTTP Servers:\\n- http.HandleFunc registers endpoints with standard (http.ResponseWriter, *http.Request).\\n- json.NewEncoder(w).Encode() serializes structs to JSON responses.`,
  });

  const goL7_Notes = await ActivityModel.create({
    lessonId: goL7._id,
    type: 'NOTES',
    title: `Codexa Notes: Building HTTP Microservices with net/http`,
    order: 2,
    content: `# Building HTTP Microservices with net/http

Construct production HTTP API servers using Go's standard library net/http and http.HandlerFunc.

\`\`\`go
package main

import (
    "encoding/json"
    "net/http"
)

type HealthResponse struct {
    Status string \`json:"status"\`
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(HealthResponse{Status: "UP"})
}
\`\`\`

## Why Building HTTP Microservices with net/http Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use strings.Contains on lowercase header.

> ⚠️ **Common Mistake**: Streaming directly from the request stream avoids allocating large byte buffers.

## Real-World Production Scenario

In production engineering, **Building HTTP Microservices with net/http** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Building HTTP Microservices with net/http. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Go.dev: Effective Go')?._id,
  });

  const goL7_Challenge = await ChallengeModel.create({
    title: `Validate JSON Content-Type Header`,
    description: `Implement \`IsJsonHeader(header string) bool\` returning true if header is \`'application/json'\`.`,
    difficulty: 'EASY',
    language: 'go',
    starterCode: `package main

import "strings"

func IsJsonHeader(header string) bool {
    // Your code here
    return false
}
`,
    solutionCode: `package main

import "strings"

func IsJsonHeader(header string) bool {
    return strings.Contains(strings.ToLower(header), "application/json")
}
`,
    hints: ["Use strings.Contains on lowercase header."],
    skills: [{"skillId": "go-programming", "weight": 1.0}],
    testCases: [{"input": "[\"application/json; charset=utf-8\"]", "expectedOutput": "true", "description": "Validates JSON content type", "hidden": false}],
  });

  const goL7_Practice = await ActivityModel.create({
    lessonId: goL7._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Validate JSON Content-Type Header`,
    order: 3,
    challengeRef: goL7_Challenge._id,
    content: `# Code Practice: Validate JSON Content-Type Header\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  goL7_Challenge.activityId = goL7_Practice._id;
  await goL7_Challenge.save();

  const goL7_Quiz = await AssessmentModel.create({
    title: `Assessment: Go HTTP Services`,
    description: `Test HTTP request handling and JSON streaming.`,
    passingScore: 70,
    skills: [{"skillId": "go-programming", "weight": 1.0}],
    questions: [
    {
        "question": "Why is json.NewDecoder(r.Body).Decode(&payload) preferred over json.Unmarshal() for HTTP request parsing in Go?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "NewDecoder reads directly from the incoming io.Reader stream without loading the entire request body into RAM",
            "Unmarshal is deprecated in Go",
            "NewDecoder converts strings to integers automatically",
            "Unmarshal does not support structs"
        ],
        "correctOption": 0,
        "explanation": "Streaming directly from the request stream avoids allocating large byte buffers.",
        "points": 10
    }
],
  });

  const goL7_Assessment = await ActivityModel.create({
    lessonId: goL7._id,
    type: 'QUIZ',
    title: `Assessment: Go HTTP Services`,
    order: 4,
    assessmentRef: goL7_Quiz._id,
  });
  goL7_Quiz.activityId = goL7_Assessment._id;
  await goL7_Quiz.save();

  goL7.activities = [
    goL7_Video._id,
    goL7_Notes._id,
    goL7_Practice._id,
    goL7_Assessment._id,
  ] as any;
  await goL7.save();

  // --- Lesson 2: Context Package: Timeouts & Graceful Cancellation ---
  const goL8 = await LessonModel.create({
    moduleId: goMod4._id,
    courseId: goCourse._id,
    title: `Context Package: Timeouts & Graceful Cancellation`,
    description: `Propagate cancellation signals, deadlines, and request-scoped values using context.Context.`,
    order: 2,
    activities: [],
  });

  const goL8_Video = await ActivityModel.create({
    lessonId: goL8._id,
    type: 'VIDEO',
    title: `Video: Go Context Package Deep Dive`,
    order: 1,
    resourceRef: getRes('Golang Hello World and Tooling in Tamil')?._id,
    content: `# Context in Go:\\n- Always pass ctx context.Context as the first argument in long-running functions.\\n- Use context.WithTimeout to cancel slow downstream database/HTTP calls.`,
  });

  const goL8_Notes = await ActivityModel.create({
    lessonId: goL8._id,
    type: 'NOTES',
    title: `Codexa Notes: Context Package: Timeouts & Graceful Cancellation`,
    order: 2,
    content: `# Context Package: Timeouts & Graceful Cancellation

Propagate cancellation signals, deadlines, and request-scoped values using context.Context.

\`\`\`go
ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
defer cancel()

req, _ := http.NewRequestWithContext(ctx, "GET", "https://api.example.com", nil)
\`\`\`

## Why Context Package: Timeouts & Graceful Cancellation Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Return boolean error state.

> ⚠️ **Common Mistake**: Go convention requires ctx context.Context to be passed explicitly as the first parameter.

## Real-World Production Scenario

In production engineering, **Context Package: Timeouts & Graceful Cancellation** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Context Package: Timeouts & Graceful Cancellation. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Go.dev: Effective Go')?._id,
  });

  const goL8_Challenge = await ChallengeModel.create({
    title: `Check Context Cancellation Helper`,
    description: `Implement a function checking if context has cancelled error.`,
    difficulty: 'EASY',
    language: 'go',
    starterCode: `package main

func IsCancelled(hasErr bool) bool {
    // Your code here
    return hasErr
}
`,
    solutionCode: `package main

func IsCancelled(hasErr bool) bool {
    return hasErr
}
`,
    hints: ["Return boolean error state."],
    skills: [{"skillId": "go-programming", "weight": 1.0}],
    testCases: [{"input": "[true]", "expectedOutput": "true", "description": "Detects cancellation state", "hidden": false}],
  });

  const goL8_Practice = await ActivityModel.create({
    lessonId: goL8._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Check Context Cancellation Helper`,
    order: 3,
    challengeRef: goL8_Challenge._id,
    content: `# Code Practice: Check Context Cancellation Helper\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  goL8_Challenge.activityId = goL8_Practice._id;
  await goL8_Challenge.save();

  const goL8_Quiz = await AssessmentModel.create({
    title: `Assessment: Go Context`,
    description: `Test cancellation propagation patterns.`,
    passingScore: 70,
    skills: [{"skillId": "go-programming", "weight": 1.0}],
    questions: [
    {
        "question": "Where should context.Context parameters be placed in Go function signatures?",
        "type": "MULTIPLE_CHOICE",
        "options": [
            "As the very first parameter (e.g. func DoWork(ctx context.Context, ...))",
            "As the last parameter",
            "Inside a global struct",
            "Inside an environment variable"
        ],
        "correctOption": 0,
        "explanation": "Go convention requires ctx context.Context to be passed explicitly as the first parameter.",
        "points": 10
    }
],
  });

  const goL8_Assessment = await ActivityModel.create({
    lessonId: goL8._id,
    type: 'QUIZ',
    title: `Assessment: Go Context`,
    order: 4,
    assessmentRef: goL8_Quiz._id,
  });
  goL8_Quiz.activityId = goL8_Assessment._id;
  await goL8_Quiz.save();

  goL8.activities = [
    goL8_Video._id,
    goL8_Notes._id,
    goL8_Practice._id,
    goL8_Assessment._id,
  ] as any;
  await goL8.save();

  goMod4.lessons = [goL7._id, goL8._id] as any;
  await goMod4.save();

  goCourse.modules = [goMod1._id, goMod2._id, goMod3._id, goMod4._id] as any;
  await goCourse.save();

  return [jsCourse, pyCourse, javaCourse, cppCourse, goCourse];
}
