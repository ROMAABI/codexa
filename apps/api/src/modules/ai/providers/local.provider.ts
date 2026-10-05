import { IAIProvider, AIProviderMessage, AIProviderOptions } from './ai-provider.interface';
import { IntentClassifier } from '../intent.classifier';

export class LocalProvider implements IAIProvider {
  readonly name = 'local';

  isAvailable(): boolean {
    return true;
  }

  async generateChatCompletion(
    messages: AIProviderMessage[],
    _options?: AIProviderOptions
  ): Promise<string> {
    const lastUserMessage = ([...messages].reverse().find((m) => m.role === 'user')?.content || '').trim();
    const systemPrompt = messages.find((m) => m.role === 'system')?.content || '';
    const lower = lastUserMessage.toLowerCase();

    // 1. Check intent ambiguity or greeting
    const intent = IntentClassifier.analyze(lastUserMessage);
    if (intent.isAmbiguous && intent.clarificationResponse) {
      return intent.clarificationResponse;
    }
    if (intent.isGreeting && intent.greetingResponse) {
      return intent.greetingResponse;
    }

    // 2. Assessment anti-cheat guard
    const isAssessment =
      /\[ACTIVE_ASSESSMENT_SESSION:\s*TRUE\]/i.test(systemPrompt) ||
      /\b(which option|choose option|correct option|answer to this quiz|solution to this assessment)\b/i.test(
        lower
      );

    if (isAssessment) {
      return (
        "During assessments, I want to help you reason through the logic on your own rather than giving the direct answer.\n\n" +
        "Consider what the code is doing step-by-step. What data types are passed in, and how does each candidate choice handle edge cases like empty inputs or undefined values?"
      );
    }

    // 3. Domain Knowledge Base for General & Programming Questions (Context-Aware, not Context-Restricted)
    if (/\b(what is|what's|explain|overview of)\s+python\b/i.test(lower) || lower === 'python') {
      return (
        "Python is a high-level, interpreted programming language known for its simple syntax and readability. It's widely used for web development, automation, data science, and AI.\n\n" +
        "For example:\n\n" +
        "```python\n" +
        "def greet(name):\n" +
        "    return f\"Hello, {name}!\"\n\n" +
        "print(greet(\"World\"))\n" +
        "```"
      );
    }

    if (/\b(what is|what's|explain)\s+docker\b/i.test(lower) || lower === 'docker') {
      return (
        "Docker is an open-source containerization platform that packages applications and all their dependencies into standardized units called **containers**.\n\n" +
        "Containers ensure your code runs consistently across development, staging, and production environments without the overhead of full virtual machines.\n\n" +
        "Example `Dockerfile`:\n\n" +
        "```dockerfile\n" +
        "FROM node:20-alpine\n" +
        "WORKDIR /app\n" +
        "COPY package*.json ./\n" +
        "RUN npm install\n" +
        "COPY . .\n" +
        "CMD [\"node\", \"server.js\"]\n" +
        "```"
      );
    }

    if (/\b(who created|who built|creator of)\s+linux\b/i.test(lower) || /\blinux creator\b/i.test(lower)) {
      return (
        "Linux was created by **Linus Torvalds** in **1991** while he was a computer science student at the University of Helsinki. It is now the world's most widely used open-source operating system kernel, powering servers, cloud infrastructure, Android devices, and supercomputers."
      );
    }

    if (/\b(what is|what's|explain)\s+git\b/i.test(lower) || lower === 'git') {
      return (
        "Git is a distributed version control system that tracks changes in source code over time. It allows multiple developers to collaborate, branch off features, and merge changes seamlessly.\n\n" +
        "Common commands:\n" +
        "```bash\n" +
        "git init\n" +
        "git add .\n" +
        "git commit -m \"feat: initial commit\"\n" +
        "git push origin main\n" +
        "```"
      );
    }

    if (/\b(what is|what's|explain)\s+(react|jsx)\b/i.test(lower)) {
      return (
        "React is a popular JavaScript library created by Meta for building component-based user interfaces. It uses a virtual DOM and declarative state management to efficiently re-render UI elements when data changes.\n\n" +
        "Example component:\n\n" +
        "```jsx\n" +
        "import React, { useState } from 'react';\n\n" +
        "export function Counter() {\n" +
        "  const [count, setCount] = useState(0);\n" +
        "  return (\n" +
        "    <button onClick={() => setCount(count + 1)}>\n" +
        "      Clicked {count} times\n" +
        "    </button>\n" +
        "  );\n" +
        "}\n" +
        "```"
      );
    }

    if (/\b(what is|what's|explain)\s+(sql|database|rdbms)\b/i.test(lower)) {
      return (
        "SQL (Structured Query Language) is the standard language for storing, querying, and managing relational databases like PostgreSQL, MySQL, and SQLite.\n\n" +
        "Example query:\n\n" +
        "```sql\n" +
        "SELECT users.name, COUNT(orders.id) AS total_orders\n" +
        "FROM users\n" +
        "JOIN orders ON orders.user_id = users.id\n" +
        "GROUP BY users.name\n" +
        "HAVING COUNT(orders.id) > 5;\n" +
        "```"
      );
    }

    // 4. Pedagogical Modes
    if (/debug|error|fail|why did my test fail/i.test(lower)) {
      return (
        "Let's trace this issue systematically:\n\n" +
        "1. **Check the inputs and types**: Verify that function arguments match expected types and shapes.\n" +
        "2. **Check boundary conditions**: Confirm edge cases like empty arrays, null values, or zero.\n" +
        "3. **Inspect the return contract**: Make sure your function explicitly returns the expected value rather than undefined.\n\n" +
        "If you have a specific error message or code snippet, share it and we'll pinpoint the exact line!"
      );
    }

    if (/quiz|test me|ask me/i.test(lower)) {
      return (
        "Here is a quick conceptual question to test your understanding:\n\n" +
        "**What is the difference between synchronous execution and asynchronous execution in modern event loops?**\n\n" +
        "Think about thread blocking, call stacks, and callback queues. What are your thoughts?"
      );
    }

    if (/hint/i.test(lower)) {
      return (
        "Here is a targeted hint to guide your next step:\n\n" +
        "- **Decompose the flow**: Break down the task into small, isolated functions.\n" +
        "- **Identify the invariant**: What condition must always remain true before and after each step?\n" +
        "- **Verify intermediate output**: Log or return the value after each step to see where behavior diverges."
      );
    }

    // 5. Default natural direct response
    return (
      `To work with **${lastUserMessage}**, the key is maintaining clean, predictable contracts:\n\n` +
      `- **Understand the Goal**: Identify the expected inputs, side effects, and return values.\n` +
      `- **Keep Functions Pure**: Whenever possible, avoid mutating outside state directly.\n` +
      `- **Test Edge Cases**: Always verify with empty inputs, extreme values, and unexpected error states.\n\n` +
      `Let me know what specific part of this you'd like to explore further!`
    );
  }
}
