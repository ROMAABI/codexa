// @codexa/shared — course-agnostic contracts (reconstructed stub)
// Covers every symbol imported from '@codexa/shared' across apps/api + apps/web.

// ---------- Roles ----------
export type Role = 'STUDENT' | 'ADMIN';

// ---------- Skills ----------
export type SkillLevel = 'NOVICE' | 'COMPETENT' | 'PROFICIENT' | 'MASTER';

// ---------- Learning / progress ----------
export type ActivityState = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export type ActivityType =
  | 'VIDEO'
  | 'ARTICLE'
  | 'NOTES'
  | 'CODE_EXAMPLE'
  | 'INTERACTIVE_EXERCISE'
  | 'DEBUGGING_CHALLENGE'
  | 'QUIZ'
  | 'CODING_CHALLENGE'
  | 'PROJECT_TASK'
  | 'RESOURCE'
  | 'REFERENCE'
  // Aliases used by frontend / context builder but not in mongoose enum
  | 'PRACTICE'
  | 'ASSESSMENT';

// ---------- Submissions / execution ----------
export type SubmissionStatus =
  | 'QUEUED'
  | 'RUNNING'
  | 'PASSED'
  | 'FAILED'
  | 'TIMEOUT'
  | 'ERROR';

export interface TestResultItem {
  testCaseId: string;
  description?: string;
  passed: boolean;
  actualOutput?: string | null;
  expectedOutput?: string;
  errorMessage?: string;
  durationMs?: number;
}

export type ProgrammingLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'sql'
  | 'java'
  | 'cpp'
  | 'go'
  | 'bash'
  | 'dockerfile'
  | 'yaml'
  | 'json'
  | 'html'
  | 'css'
  | 'markdown';

export type ChallengeDifficulty =
  | 'EASY'
  | 'MEDIUM'
  | 'HARD'
  // Frontend AdminPage uses BEGINNER/INTERMEDIATE/ADVANCED labels
  | 'BEGINNER'
  | 'INTERMEDIATE'
  | 'ADVANCED';

// ---------- Courses ----------
export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

// ---------- AI mentor ----------
export type AIMentorMode =
  | 'explain'
  | 'hint'
  | 'debug'
  | 'quiz_me'
  | 'practice'
  | 'review'
  | 'project_mentor';

// ---------- Resources ----------
export type OwnershipClass = 'OWNED' | 'EMBEDDED' | 'EXTERNAL_LINK' | 'OPEN_LICENSE';
export type VerificationStatus = 'VERIFIED' | 'NEEDS_REVIEW' | 'LICENSE_UNKNOWN' | 'UNAVAILABLE';
export type ResourceType = 'VIDEO' | 'OFFICIAL_DOC' | 'ARTICLE' | 'REFERENCE';

// ---------- Assessments ----------
export type QuestionType =
  | 'MULTIPLE_CHOICE'
  | 'MULTIPLE_SELECT'
  | 'CODE_SNIPPET'
  | 'TRUE_FALSE'
  | 'CODE_OUTPUT_PREDICTION'
  | 'CONCEPTUAL'
  | 'SHORT_ANSWER';

// ---------- System defaults ----------
export const SYSTEM_DEFAULTS = {
  EXECUTION_TIMEOUT_MS: 5000,
  XP_PER_CHALLENGE_PASS: 25,
  XP_PER_LESSON_COMPLETE: 10,
  XP_PER_QUIZ_PASS: 20,
} as const;

// ---------- DTOs ----------
export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: Role;
  xp: number;
  streak: number;
  createdAt?: string;
  avatarUrl?: string;
  preferences?: {
    learningGoal?: string;
    experienceLevel?: string;
    weeklyTargetHours?: number;
  };
}

export interface CourseDTO {
  id?: string;
  slug: string;
  title: string;
  description: string;
  domain: string;
  level?: CourseLevel | string;
  status?: CourseStatus | string;
  estimatedHours?: number;
  skillsCovered?: string[];
  prerequisites?: string[];
  modules?: unknown[];
}

export type RecommendationType =
  | 'REVIEW_FAILED_ASSESSMENT'
  | 'TARGETED_PRACTICE'
  | 'RESUME_LESSON'
  | 'NEXT_CURRICULUM_STEP';

export interface RecommendationDTO {
  type: RecommendationType;
  title: string;
  reason: string;
  actionUrl: string;
  courseId: string;
  activityId?: string;
  lessonId?: string;
  skillRef?: string;
  priority: number;
}

export interface UserSkillDTO {
  skillSlug?: string;
  skillName?: string;
  name?: string;
  category?: string;
  level?: SkillLevel | string;
  masteryScore?: number;
  evidenceCount?: number;
}

export interface AIMessageDTO {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  mode: AIMentorMode;
  timestamp: string;
  groundedInLesson?: boolean;
}

export interface AIAskRequestContext {
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
  activityId?: string;
  challengeId?: string;
  currentCode?: string;
  runtimeError?: string;
  activeAssessmentId?: string;
  stepName?: 'VIDEO' | 'NOTES' | 'PRACTICE' | 'ASSESSMENT' | 'PROJECT';
  // Project IDE context
  projectId?: string;
  activeFilePath?: string;
  projectFiles?: Array<{ path: string; content?: string }>;
  terminalOutput?: string;
  recentTestFailures?: Array<{ testName: string; expected?: string; actual?: string; hint?: string }>;
}

export interface AIAskRequestDTO {
  mode: AIMentorMode;
  query: string;
  context?: AIAskRequestContext;
}

export interface AIAskResponseDTO {
  message: string;
  mode: AIMentorMode;
  groundedInLesson?: boolean;
  hintsRemaining?: number;
}

// ---------- Project & Real IDE Contracts ----------
export interface ProjectFile {
  path: string;
  content: string;
  isBinary?: boolean;
}

export interface ProjectCheckpointDTO {
  id: string;
  milestone: number;
  savedAt: string;
  commitMessage?: string;
  fileCount: number;
}

export interface ProjectWorkspaceDTO {
  projectId: string;
  slug: string;
  title: string;
  description: string;
  language: ProgrammingLanguage;
  template?: string;
  entryFile?: string;
  runCommand?: string;
  testCommand?: string;
  previewType?: 'web' | 'terminal' | 'none';
  previewPort?: number;
  files: ProjectFile[];
  activeMilestone: number;
  activeFilePath: string;
  openFiles: string[];
  checkpoints?: ProjectCheckpointDTO[];
  lastSavedAt?: string;
  milestones: Array<{
    title: string;
    description: string;
    order: number;
    requiredFiles?: string[];
  }>;
  skillsDemonstrated?: string[];
}

export interface ProjectRunRequest {
  files: ProjectFile[];
  entryFile?: string;
  command?: string;
  language?: ProgrammingLanguage;
}

export interface ProjectRunResponse {
  status: 'PASSED' | 'FAILED' | 'TIMEOUT' | 'ERROR';
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs: number;
  previewUrl?: string;
}

export interface ProjectTestItemResult {
  testName: string;
  passed: boolean;
  expectedOutput?: string;
  actualOutput?: string;
  errorMessage?: string;
  hint?: string;
  durationMs?: number;
}

export interface ProjectSubmissionRequest {
  milestoneOrder: number;
  files: ProjectFile[];
}

export interface ProjectSubmissionResponse {
  submissionId: string;
  milestoneOrder: number;
  status: SubmissionStatus;
  passed: boolean;
  score: number;
  passedCount: number;
  totalCount: number;
  testResults: ProjectTestItemResult[];
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  xpAwarded: number;
  feedback: string;
}

export interface TerminalExecRequest {
  command: string;
  files: ProjectFile[];
  language?: ProgrammingLanguage;
}

export interface TerminalExecResponse {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
  updatedFiles?: ProjectFile[];
}

// ---------- YouTube helpers ----------
const YT_ID_RE = /^[A-Za-z0-9_-]{11}$/;

export function parseYouTubeId(input: string | null | undefined): string | null {
  if (!input || typeof input !== 'string') return null;
  const s = input.trim();
  if (!s) return null;
  if (YT_ID_RE.test(s)) return s;
  try {
    // Bare URL without protocol (e.g. youtube.com/watch?v=...)
    const withProto = /^https?:\/\//i.test(s) ? s : s.includes('youtube.com') || s.includes('youtu.be') ? `https://${s}` : s;
    const u = new URL(withProto);
    const host = u.hostname.toLowerCase().replace(/^www\./, '').replace(/^m\./, '');
    if (host === 'youtu.be') {
      const id = u.pathname.split('/').filter(Boolean)[0];
      if (id && YT_ID_RE.test(id)) return id;
    }
    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const v = u.searchParams.get('v');
      if (v && YT_ID_RE.test(v)) return v;
      const parts = u.pathname.split('/').filter(Boolean);
      const embedIdx = parts.findIndex((p) => p === 'embed' || p === 'shorts' || p === 'live' || p === 'v');
      if (embedIdx >= 0 && parts[embedIdx + 1] && YT_ID_RE.test(parts[embedIdx + 1])) {
        return parts[embedIdx + 1];
      }
    }
  } catch {
    // fall through to regex scan
  }
  const m = s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  return null;
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

export function getYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function isValidYouTubeUrl(url: string | null | undefined): boolean {
  return parseYouTubeId(url) !== null;
}
