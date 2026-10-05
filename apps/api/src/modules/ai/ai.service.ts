import mongoose from 'mongoose';
import { AIContextBuilder, BuiltAIContext } from './context.builder';
import { RAGEngine, RetrievedKnowledgeChunk } from './rag.engine';
import { ResponseGuard } from './response.guard';
import { AIProviderFactory } from './providers/provider.factory';
import { AIProviderMessage } from './providers/ai-provider.interface';
import { AIConversationModel } from '../../database/models/AIConversation';
import { AIMentorMode, AIAskRequestDTO, AIAskResponseDTO } from '@codexa/shared';

export class AIService {
  static async askMentor(
    userId: string,
    request: AIAskRequestDTO
  ): Promise<AIAskResponseDTO> {
    const { mode, query, context } = request;
    const sanitizedQuery = ResponseGuard.sanitizeInput(query);

    // 1. Build rich, scoped 360-degree context
    const builtContext = await AIContextBuilder.build({
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
    });

    // 2. Retrieve verified course knowledge (Scoped RAG)
    const ragChunks = await RAGEngine.retrieveApprovedContent(
      sanitizedQuery,
      context?.lessonId
    );

    // 3. Construct structured system prompt and message array
    const systemPrompt = this.constructSystemPrompt(builtContext, ragChunks);
    const messages: AIProviderMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: sanitizedQuery },
    ];

    // 4. Generate completion via configured AI Provider
    const provider = AIProviderFactory.getProvider();
    let rawResponse = '';

    try {
      rawResponse = await provider.generateChatCompletion(messages, {
        temperature: mode === 'quiz_me' ? 0.4 : 0.2,
        maxTokens: 1024,
      });
    } catch (e: any) {
      console.warn(
        `[AI Gateway] Provider '${provider.name}' failed (${e.message}), switching to local pedagogical fallback.`
      );
      const fallbackProvider = AIProviderFactory.getLocalProvider();
      rawResponse = await fallbackProvider.generateChatCompletion(messages);
    }

    // 5. Guard against answer leakage and safety
    const guardResult = ResponseGuard.validateResponse(
      rawResponse,
      builtContext.isAssessmentActive,
      mode
    );

    // 6. Save conversation history
    try {
      if (mongoose.Types.ObjectId.isValid(userId)) {
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
      console.warn('[AI Gateway] Could not save conversation history:', saveErr);
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
      'You are the Codexa AI Learning Mentor, an expert technical mentor embedded inside the Codexa interactive learning platform.',
      'Your mission is to guide students through technical mastery using pedagogical scaffolding, Socratic inquiry, and clear mental models.\n'
    );

    parts.push('=== CODEXA STUDENT & CURRICULUM CONTEXT ===');
    parts.push(`- Student: ${context.studentName} (${context.studentProfile})`);
    if (context.weakSkills.length > 0) {
      parts.push(`- Demonstrated Weak Skills: ${context.weakSkills.join(', ')}`);
    }
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
      parts.push(`- Current Learning Phase: ${context.currentStep}`);
    }
    if (context.progressSummary) {
      parts.push(`- Student Progress: ${context.progressSummary}`);
    }

    if (context.challengeContext) {
      parts.push('\n=== ACTIVE CODE DRILL / SANDBOX STATE ===');
      parts.push(`- Drill Title: ${context.challengeContext.title}`);
      if (context.challengeContext.language) {
        parts.push(`- Language: ${context.challengeContext.language}`);
      }
      if (context.challengeContext.currentCode) {
        parts.push(`- Student Editor Code:\n\`\`\`${context.challengeContext.language || ''}\n${context.challengeContext.currentCode.slice(0, 1000)}\n\`\`\``);
      }
      if (context.challengeContext.runtimeError) {
        parts.push(`- Runtime / Compiler / Test Error:\n${context.challengeContext.runtimeError}`);
      }
    }

    if (context.notesSnippet) {
      parts.push(`\n=== IN-LESSON NOTES (GROUND TRUTH) ===\n${context.notesSnippet}`);
    } else if (ragChunks.length > 0) {
      parts.push(`\n=== APPROVED CURRICULUM KNOWLEDGE ===\n${ragChunks.map((c) => `[${c.title}]: ${c.snippet}`).join('\n\n')}`);
    }

    if (context.isAssessmentActive) {
      parts.push('\n=== ACTIVE ASSESSMENT SESSION ===');
      parts.push('[ACTIVE_ASSESSMENT_SESSION: TRUE]');
    }

    parts.push('\n=== PEDAGOGICAL DIRECTIVES ===');
    parts.push('1. ANTI-SPOILER & ANTI-CHEAT: NEVER directly provide solutions or multiple choice options (A/B/C/D or 1/2/3/4) for assessments or quizzes.');
    parts.push('2. SOCRATIC SCAFFOLDING: Guide students toward solutions through leading questions and mental models instead of dumping full code answers.');
    parts.push('3. PEDAGOGICAL MODES:');
    parts.push('   - explain: Break down difficult concepts into intuitive, real-world mental models.');
    parts.push('   - hint: Offer a targeted clue or invariant to check without spoiling the answer.');
    parts.push('   - debug: Explain why the error occurred and guide the student to the root cause.');
    parts.push('   - quiz_me: Test student comprehension with a sharp conceptual check question.');
    parts.push('   - project_mentor: Guide file structure and architectural trade-offs for multi-file capstones.');
    parts.push('4. CONCISE & RIGOROUS: Keep responses structured with markdown, bullet points, and code formatting when helpful.');

    return parts.join('\n');
  }
}
