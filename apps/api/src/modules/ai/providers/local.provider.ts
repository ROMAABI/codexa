import { IAIProvider, AIProviderMessage, AIProviderOptions } from './ai-provider.interface';

export class LocalProvider implements IAIProvider {
  readonly name = 'local';

  isAvailable(): boolean {
    return true;
  }

  async generateChatCompletion(
    messages: AIProviderMessage[],
    _options?: AIProviderOptions
  ): Promise<string> {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
    const systemPrompt = messages.find((m) => m.role === 'system')?.content || '';

    // Check if assessment context is active in system prompt or message
    const isAssessment =
      /\[ACTIVE_ASSESSMENT_SESSION: TRUE\]/i.test(systemPrompt) ||
      /\b(which option|choose option|correct option|answer to this quiz|solution to this assessment)\b/i.test(
        lastUserMessage
      );

    if (isAssessment) {
      return (
        `💡 **Assessment Hint**\n\n` +
        `🧠 **Conceptual Mentor**\n\n` +
        `During active assessments, my role is to help you reason through problems independently.\n\n` +
        `Reflect on the foundational concept: consider how the state changes, what data structures are in play, and whether edge cases (like empty arrays or null values) are handled.\n\n` +
        `*Guiding Principle:* What is the exact contract expected by the consumer?`
      );
    }

    if (/debug|error|fail/i.test(lastUserMessage)) {
      return (
        `🔍 **Debug Assistant**\n\n` +
        `Let's analyze the issue step-by-step:\n\n` +
        `1. Check the variable types and exported symbols.\n` +
        `2. Ensure base cases and boundary conditions are handled before processing.\n` +
        `3. Verify whether asynchronous operations are properly awaited.`
      );
    }

    if (/quiz|test me/i.test(lastUserMessage)) {
      return (
        `🎯 **Quick Check Question**\n\n` +
        `To test your grasp: *What is the primary trade-off of this architectural pattern compared to standard procedural execution?*\n\n` +
        `Think through memory overhead and execution order, and reply when ready!`
      );
    }

    if (/hint/i.test(lastUserMessage)) {
      return (
        `💡 **Step-by-Step Hint**\n\n` +
        `- Step 1: Break the problem into small, single-responsibility functions.\n` +
        `- Step 2: Formulate the transformation step (input → intermediate representation → output).\n` +
        `- Step 3: Run the local test suite to inspect intermediate state.`
      );
    }

    return (
      `📘 **Pedagogical Explanation**\n\n` +
      `When approaching **"${lastUserMessage}"**, keep in mind that software systems rely on explicit contracts and predictability.\n\n` +
      `1. **Core Mechanism**: Input parameters are evaluated and transformed without mutating shared outer scope.\n` +
      `2. **Best Practice**: Validate inputs early and handle failure modes explicitly.\n` +
      `3. **Mental Model**: Break down the flow into discrete steps: Receive → Validate → Process → Return.`
    );
  }
}
