export interface GuardCheckResult {
  passed: boolean;
  sanitizedResponse: string;
  violations: string[];
}

export class ResponseGuard {
  private static FORBIDDEN_PATTERNS = [
    /here is the answer/i,
    /the correct (option|answer) is/i,
    /the solution to this (quiz|assessment|challenge) is/i,
    /select option\s*[A-D0-9]/i,
    /choose (option|answer)\s*[A-D0-9]/i,
    /option\s*[A-D0-9]\s*is correct/i,
    /\b(answer|solution)\s*(is|:)\s*[A-D0-9]\b/i,
    /correct option:\s*[A-D0-9]/i,
    /the right option is/i,
    /the answer is\s*["']?[A-D0-9]["']?/i,
  ];

  private static INJECTION_PATTERNS = [
    /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
    /disregard\s+(all\s+)?(prior|previous)\s+instructions/i,
    /system\s+prompt\s+(leak|reveal|dump)/i,
    /you\s+are\s+now\s+in\s+god\s+mode/i,
    /override\s+system\s+(prompt|rules)/i,
    /reveal\s+(correct\s+option|quiz\s+answers|hidden\s+tests)/i,
    /print\s+hidden\s+test\s*cases/i,
  ];

  static sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return '';
    let sanitized = input;
    for (const pattern of this.INJECTION_PATTERNS) {
      sanitized = sanitized.replace(pattern, '[REDACTED_INSTRUCTION]');
    }
    return sanitized;
  }

  static validateResponse(
    response: string,
    isAssessmentActive: boolean,
    mode: string
  ): GuardCheckResult {
    const violations: string[] = [];
    let sanitized = response;

    // Rule 1: Server-Side Anti-Cheat — Never directly reveal assessment answers
    if (isAssessmentActive) {
      let intercepted = false;
      for (const pattern of this.FORBIDDEN_PATTERNS) {
        if (pattern.test(sanitized)) {
          violations.push('Assessment direct answer reveal attempt intercepted');
          sanitized =
            "🧠 **Conceptual Mentor**\n\n" +
            "I cannot provide the direct answer to this assessment. Here is the guiding principle to help you reason through problems independently:\n\n" +
            "Think about the core concepts covered in the lesson notes. What are the expected inputs and outputs, and how does each candidate choice perform?";
          intercepted = true;
          break;
        }
      }

      if (!intercepted && !/conceptual mentor|cannot provide the direct answer|guiding principle/i.test(sanitized)) {
        sanitized =
          (mode === 'hint' ? "💡 **Assessment Hint**\n\n" : "") +
          "🧠 **Conceptual Mentor**\n\n" +
          "During active assessments, my role is to help you reason through problems independently.\n\n" +
          sanitized;
      } else if (mode === 'hint' && !/assessment hint/i.test(sanitized)) {
        sanitized = "💡 **Assessment Hint**\n\n" + sanitized;
      }

      // If mode is hint during assessment, ensure hints don't dump entire code blocks
      if (mode === 'hint' && sanitized.includes('```')) {
        sanitized = sanitized.replace(
          /```[\s\S]*?```/g,
          '*(Code snippet withheld during active assessment: focus on the conceptual flow)*'
        );
      }
    }

    return {
      passed: violations.length === 0,
      sanitizedResponse: sanitized,
      violations,
    };
  }
}
