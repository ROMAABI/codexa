import mongoose from 'mongoose';
import { AIContextBuilder, BuiltAIContext } from './context.builder';
import { RAGEngine, RetrievedKnowledgeChunk } from './rag.engine';
import { ResponseGuard } from './response.guard';
import { AIProviderFactory } from './providers/provider.factory';
import { AIProviderMessage } from './providers/ai-provider.interface';
import { AIConversationModel } from '../../database/models/AIConversation';
import { AIMentorMode, AIAskRequestDTO, AIAskResponseDTO } from '@codexa/shared';
import { IntentClassifier } from './intent.classifier';

export class AIService {
  static async askMentor(
    userId: string,
    request: AIAskRequestDTO
  ): Promise<AIAskResponseDTO> {
    const { mode = 'explain', query = '', context } = request;
    const sanitizedQuery = ResponseGuard.sanitizeInput(query);

    // 1. Intent Analysis: Check for ambiguous inputs, gibberish, and casual greetings
    const intent = IntentClassifier.analyze(sanitizedQuery);

    if (intent.isAmbiguous && intent.clarificationResponse) {
      console.log(`[AI Gateway] Low-confidence/ambiguous query '${sanitizedQuery}' -> Clarification requested.`);
      return {
        message: intent.clarificationResponse,
        mode,
        groundedInLesson: false,
      };
    }

    if (intent.isGreeting && intent.greetingResponse) {
      console.log(`[AI Gateway] Greeting query '${sanitizedQuery}' -> Greeting response returned.`);
      return {
        message: intent.greetingResponse,
        mode,
        groundedInLesson: false,
      };
    }

    // 2. Build rich, scoped 360-degree context (fail-safe)
    let builtContext: BuiltAIContext;
    try {
      builtContext = await AIContextBuilder.build({
        userId,
        mode,
        courseId: context?.courseId,
        moduleId: context?.moduleId,
        lessonId: context?.lessonId,
        activityId: context?.activityId,
        challengeId: context?.challengeId,
        currentCode: context?.currentCode,
        runtimeError: context?.runtimeError,
        activeAssessmentId: context?.activeAssessmentId,
        stepName: context?.stepName,
        projectId: context?.projectId,
        activeFilePath: context?.activeFilePath,
        projectFiles: context?.projectFiles,
        terminalOutput: context?.terminalOutput,
        recentTestFailures: context?.recentTestFailures,
      });
    } catch (err) {
      console.warn('[AI Gateway] Non-critical context builder fallback:', err);
      builtContext = {
        studentName: 'Learner',
        studentProfile: 'Codexa Student',
        weakSkills: [],
        isAssessmentActive: Boolean(context?.activeAssessmentId),
        mode,
      };
    }

    // 3. Retrieve verified course knowledge (Scoped RAG, fail-safe)
    let ragChunks: RetrievedKnowledgeChunk[] = [];
    try {
      ragChunks = await RAGEngine.retrieveApprovedContent(
        sanitizedQuery,
        context?.lessonId
      );
    } catch (err) {
      console.warn('[AI Gateway] Non-critical RAG retrieval fallback:', err);
    }

    // 4. Construct structured system prompt and message array
    const systemPrompt = this.constructSystemPrompt(builtContext, ragChunks);
    const messages: AIProviderMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: sanitizedQuery },
    ];

    // 5. Generate completion via configured AI Provider with intelligent fallback
    const provider = AIProviderFactory.getProvider();
    let rawResponse = '';

    try {
      console.log(`[AI Gateway] Generating completion via primary provider '${provider.name}'...`);
      rawResponse = await provider.generateChatCompletion(messages, {
        temperature: mode === 'quiz_me' ? 0.4 : 0.2,
        maxTokens: 1024,
      });
    } catch (e: any) {
      console.warn(
        `[AI Gateway] Provider '${provider.name}' failed (${e.message}). Switching to local pedagogical fallback.`
      );
      try {
        const fallbackProvider = AIProviderFactory.getLocalProvider();
        rawResponse = await fallbackProvider.generateChatCompletion(messages);
      } catch (fallbackErr: any) {
        console.error('[AI Gateway] Local fallback also failed:', fallbackErr);
        rawResponse = "I'm here to help! Could you please restate or clarify your question?";
      }
    }

    // 6. Guard against answer leakage and format glitches
    const guardResult = ResponseGuard.validateResponse(
      rawResponse,
      builtContext.isAssessmentActive,
      mode
    );

    // 7. Save conversation history (fail-safe)
    try {
      if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        let conversation = await AIConversationModel.findOne({
          userId: new mongoose.Types.ObjectId(userId),
          'context.activityId': context?.activityId && mongoose.Types.ObjectId.isValid(context.activityId)
            ? new mongoose.Types.ObjectId(context.activityId)
            : undefined,
        });

        if (!conversation) {
          conversation = new AIConversationModel({
            userId: new mongoose.Types.ObjectId(userId),
            context: {
              activityId: context?.activityId && mongoose.Types.ObjectId.isValid(context.activityId)
                ? new mongoose.Types.ObjectId(context.activityId)
                : undefined,
            },
            messages: [],
          });
        }

        conversation.messages.push({
          role: 'user',
          content: sanitizedQuery,
          mode,
          timestamp: new Date(),
        });

        conversation.messages.push({
          role: 'assistant',
          content: guardResult.sanitizedResponse,
          mode,
          groundedInLesson: ragChunks.length > 0,
          timestamp: new Date(),
        });

        await conversation.save();
      }
    } catch (saveErr) {
      console.warn('[AI Gateway] Non-critical error saving conversation history:', saveErr);
    }

    return {
      message: guardResult.sanitizedResponse,
      mode,
      groundedInLesson: ragChunks.length > 0,
      hintsRemaining: builtContext.isAssessmentActive ? 2 : undefined,
    };
  }

  private static constructSystemPrompt(
    context: BuiltAIContext,
    ragChunks: RetrievedKnowledgeChunk[]
  ): string {
    const parts: string[] = [];
    parts.push(
      'You are the Codexa AI Learning Mentor, an expert senior software engineer and pedagogical mentor embedded in the Codexa platform.',
      'Your goal is to guide students to deep technical mastery through clear explanations, accurate mental models, and interactive guidance.\n'
    );

    parts.push('=== GENERAL BEHAVIOR & INTENT DIRECTIVES ===');
    parts.push('1. CONTEXT-AWARE, NOT CONTEXT-RESTRICTED: You have context about the student’s active course, but you MUST answer ANY technical, programming, or computer science question the student asks (e.g. Python, Docker, Linux, C++, SQL, Git, system architecture) even if it is unrelated to the current lesson.');
    parts.push('2. NEVER REFUSE GENERAL TECH QUESTIONS: Do NOT say "I am only allowed to answer questions about the current course." Answer general tech questions directly, accurately, and warmly.');
    parts.push('3. NATURAL & DIRECT STYLE: Speak naturally as a senior engineer. For simple questions (e.g. "What is Python?"), provide a direct, concise explanation with a clear code example. Do NOT output robotic role headers (like 🧠 **Conceptual Mentor**) or forced rigid sections.');
    parts.push('4. NO HALLUCINATION ON AMBIGUOUS INPUT: If an input is ambiguous, unclear, or incomplete, ask a brief clarifying question instead of inventing a fake technical concept.');
    parts.push('5. CLEAN CODE & FORMATTING: Use standard clean markdown. Always specify language tags on code blocks (```python, ```javascript, ```sql, ```bash). Never output broken symbols like `_*` or `*_`.');
    parts.push('6. ANTI-SPOILER: During active assessments or quizzes, guide the student with conceptual reasoning and edge cases rather than revealing direct multiple-choice options or dumping final answers.\n');

    // Context details
    parts.push('=== STUDENT & CURRICULUM CONTEXT (REFERENCE ONLY) ===');
    parts.push(`- Student: ${context.studentName} (${context.studentProfile})`);
    if (context.courseTitle) {
      parts.push(`- Active Course: ${context.courseTitle} [Domain: ${context.courseDomain || 'Engineering'}]`);
    }
    if (context.moduleTitle) {
      parts.push(`- Active Module: ${context.moduleTitle}`);
    }
    if (context.lessonTitle) {
      parts.push(`- Active Lesson: ${context.lessonTitle} (Order #${context.lessonOrder || 1})`);
    }
    if (context.currentStep) {
      parts.push(`- Active Learning Phase: ${context.currentStep}`);
    }

    if (context.challengeContext) {
      parts.push('\n=== ACTIVE CODE DRILL / SANDBOX STATE ===');
      parts.push(`- Drill Title: ${context.challengeContext.title}`);
      if (context.challengeContext.language) {
        parts.push(`- Language: ${context.challengeContext.language}`);
      }
      if (context.challengeContext.currentCode) {
        parts.push(`- Student Code:\n\`\`\`${context.challengeContext.language || ''}\n${context.challengeContext.currentCode.slice(0, 1000)}\n\`\`\``);
      }
      if (context.challengeContext.runtimeError) {
        parts.push(`- Runtime / Test Error:\n${context.challengeContext.runtimeError}`);
      }
    }

    if (context.projectContext) {
      parts.push('\n=== ACTIVE DEVELOPER IDE PROJECT WORKSPACE ===');
      if (context.projectContext.title) {
        parts.push(`- Project: ${context.projectContext.title}`);
      }
      if (context.projectContext.fileList && context.projectContext.fileList.length > 0) {
        parts.push(`- File Tree: [${context.projectContext.fileList.join(', ')}]`);
      }
      if (context.projectContext.activeFilePath) {
        parts.push(`- Active File: ${context.projectContext.activeFilePath}`);
      }
      if (context.projectContext.activeFileContent) {
        parts.push(`- Active Code Snippet:\n\`\`\`\n${context.projectContext.activeFileContent.slice(0, 1500)}\n\`\`\``);
      }
      if (context.projectContext.terminalOutput) {
        parts.push(`- Terminal Output:\n${context.projectContext.terminalOutput}`);
      }
      if (context.projectContext.recentTestFailures && context.projectContext.recentTestFailures.length > 0) {
        parts.push('- Recent Failed Tests:');
        context.projectContext.recentTestFailures.forEach((tf) => {
          parts.push(`  * ${tf.testName}: expected '${tf.expected || ''}', actual '${tf.actual || ''}' (Hint: ${tf.hint || 'None'})`);
        });
      }
    }

    if (context.notesSnippet) {
      parts.push(`\n=== IN-LESSON NOTES ===\n${context.notesSnippet}`);
    } else if (ragChunks.length > 0) {
      parts.push(`\n=== CURRICULUM KNOWLEDGE BASE ===\n${ragChunks.map((c) => `[${c.title}]: ${c.snippet}`).join('\n\n')}`);
    }

    if (context.isAssessmentActive) {
      parts.push('\n[ACTIVE_ASSESSMENT_SESSION: TRUE]');
    }

    return parts.join('\n');
  }
}
