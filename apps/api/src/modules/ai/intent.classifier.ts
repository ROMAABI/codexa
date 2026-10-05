export type IntentConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export interface IntentAnalysisResult {
  isAmbiguous: boolean;
  isGreeting: boolean;
  confidence: IntentConfidence;
  clarificationResponse?: string;
  greetingResponse?: string;
  normalizedQuery: string;
}

const VALID_SHORT_TECH_TERMS = new Set([
  'c',
  'r',
  'go',
  'js',
  'ts',
  'py',
  'ui',
  'ux',
  'db',
  'ip',
  'os',
  'ai',
  'ml',
  'ci',
  'cd',
  'io',
  'id',
  'vm',
  'sh',
  'css',
  'sql',
  'api',
  'jwt',
  'dom',
  'npm',
  'git',
  'tcp',
  'udp',
  'ssh',
  'aws',
  'gcp',
  'orm',
  'mvc',
  'dry',
  'oop',
  'fp',
  'ast',
]);

const GREETING_PATTERNS = [
  /^hi(\s*there)?$/i,
  /^hello(\s*there)?$/i,
  /^hey(\s*there)?$/i,
  /^good\s*(morning|afternoon|evening|day)$/i,
  /^greetings$/i,
  /^howdy$/i,
  /^sup$/i,
];

const BARE_QUESTION_WORDS: Record<string, string> = {
  what: 'What would you like me to explain?',
  'what?': 'What would you like me to explain?',
  'what is it?': 'What would you like me to explain?',
  'what is this?': 'What would you like me to explain about this code or lesson?',
  why: 'What concept or code behavior are you wondering about?',
  'why?': 'What concept or code behavior are you wondering about?',
  how: 'What would you like to know how to do?',
  'how?': 'What would you like to know how to do?',
  who: 'Who would you like to know about?',
  'who?': 'Who would you like to know about?',
  where: 'What location or file path are you looking for?',
  'where?': 'What location or file path are you looking for?',
  when: 'What event or timing are you asking about?',
  'when?': 'What event or timing are you asking about?',
  help: "I'm here to help! What concept, exercise, or code are you working on?",
  'help?': "I'm here to help! What concept, exercise, or code are you working on?",
  'help me': "I'm happy to help! Let me know what specific part is giving you trouble.",
  'help me?': "I'm happy to help! Let me know what specific part is giving you trouble.",
};

export class IntentClassifier {
  static analyze(rawQuery: string): IntentAnalysisResult {
    const trimmed = (rawQuery || '').trim();
    const lower = trimmed.toLowerCase();

    // 1. Check for empty or whitespace query
    if (!trimmed) {
      return {
        isAmbiguous: true,
        isGreeting: false,
        confidence: 'LOW',
        clarificationResponse: 'How can I help you with your coding today?',
        normalizedQuery: '',
      };
    }

    // 2. Check for bare question words
    if (BARE_QUESTION_WORDS[lower]) {
      return {
        isAmbiguous: true,
        isGreeting: false,
        confidence: 'LOW',
        clarificationResponse: BARE_QUESTION_WORDS[lower],
        normalizedQuery: trimmed,
      };
    }

    // 3. Check for natural greetings
    for (const pattern of GREETING_PATTERNS) {
      if (pattern.test(lower)) {
        return {
          isAmbiguous: false,
          isGreeting: true,
          confidence: 'HIGH',
          greetingResponse:
            "Hi! I am your Codexa AI Learning Mentor. Ask me anything about programming concepts, debugging, exercises, or project architecture.",
          normalizedQuery: trimmed,
        };
      }
    }

    // 4. Check for punctuation-only / symbol-only queries (e.g. "???", "...", "!", "$#@")
    if (/^[\p{P}\p{S}\s]+$/u.test(trimmed)) {
      return {
        isAmbiguous: true,
        isGreeting: false,
        confidence: 'LOW',
        clarificationResponse: 'Could you rephrase your question with a bit more detail?',
        normalizedQuery: trimmed,
      };
    }

    // 5. Check for single character / short token ambiguity
    if (trimmed.length <= 2 && !VALID_SHORT_TECH_TERMS.has(lower)) {
      return {
        isAmbiguous: true,
        isGreeting: false,
        confidence: 'LOW',
        clarificationResponse: `Could you clarify what you mean by '${trimmed}'?`,
        normalizedQuery: trimmed,
      };
    }

    // 6. Check for common keyboard smashes / gibberish (e.g. "asdf", "asdfgh", "qwerty", "zxcv", "jkl;", "alksdjf")
    const isKeyboardSmash =
      /^(asdf+|qwert+|zxcv+|hjkl+|jkl+|lkjh+|dfgh+|mnbv+|poiuy+|asdfghjkl+)$/i.test(lower) ||
      /^[asdfjkl;]{4,}$/i.test(lower) ||
      /^(.)\1{3,}$/i.test(lower); // Repeated single character: "aaaa", "xxxx"

    if (isKeyboardSmash) {
      return {
        isAmbiguous: true,
        isGreeting: false,
        confidence: 'LOW',
        clarificationResponse: `I'm not sure what you mean by '${trimmed}'. Could you rephrase it?`,
        normalizedQuery: trimmed,
      };
    }

    // 7. Check for ambiguous single-word expressions that are not programming concepts
    const ambiguousSingleWords = new Set([
      'ho',
      'yo',
      'ha',
      'huh',
      'um',
      'uh',
      'eh',
      'wat',
      'wut',
      'k',
      'ok',
      'okay',
      'cool',
      'nice',
      'yeah',
      'yes',
      'no',
      'nope',
      'nah',
      'idk',
    ]);

    if (ambiguousSingleWords.has(lower)) {
      if (lower === 'ok' || lower === 'okay' || lower === 'cool' || lower === 'nice' || lower === 'yeah' || lower === 'yes') {
        return {
          isAmbiguous: false,
          isGreeting: false,
          confidence: 'MEDIUM',
          clarificationResponse: 'Great! Let me know if you have any questions or want to review any concept.',
          normalizedQuery: trimmed,
        };
      }
      return {
        isAmbiguous: true,
        isGreeting: false,
        confidence: 'LOW',
        clarificationResponse: `Could you clarify what you mean by '${trimmed}'?`,
        normalizedQuery: trimmed,
      };
    }

    // Normal understandable question or command
    return {
      isAmbiguous: false,
      isGreeting: false,
      confidence: 'HIGH',
      normalizedQuery: trimmed,
    };
  }
}
