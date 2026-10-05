import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AIMentorDrawer } from '../components/AIMentorDrawer';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { VideoPlayer } from '../components/VideoPlayer';
import { CompletionModal } from '../components/ui/CompletionModal';
import { LessonSkeleton } from '../components/ui/Skeletons';
import { TryItModal } from '../components/TryItModal';
import { InteractiveExerciseView } from '../components/InteractiveExerciseView';
import { DebuggingChallengeView } from '../components/DebuggingChallengeView';
import { ReferenceView } from '../components/ReferenceView';
import {
  PlayCircle,
  FileText,
  HelpCircle,
  Code2,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Terminal,
  Play,
  Send,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  ArrowLeft,
  Check,
  Info,
  Award,
  Zap,
  Bug,
  Menu,
  X,
} from 'lucide-react';

import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const LessonWorkspacePage: React.FC = () => {
  const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activityParam = searchParams.get('activity');
  const { user, refreshUser } = useAuth();
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<any>(null);
  useDocumentTitle(lesson?.title ? `${lesson.title} · Practice` : 'Workspace');
  const [currentActivity, setCurrentActivity] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});
  const [quizResult, setQuizResult] = useState<any>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);

  // Coding Challenge / Code Example State
  const [code, setCode] = useState<string>('');
  const [challenge, setChallenge] = useState<any>(null);
  const [executingCode, setExecutingCode] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [codeError, setCodeError] = useState<string | null>(null);

  // Try It Modal State
  const [tryItModal, setTryItModal] = useState<{
    isOpen: boolean;
    code: string;
    language: string;
  }>({
    isOpen: false,
    code: '',
    language: 'javascript',
  });

  // Completion Modal State
  const [completionModal, setCompletionModal] = useState<{
    isOpen: boolean;
    title: string;
    type: 'CHALLENGE' | 'QUIZ' | 'LESSON';
    xpAwarded: number;
    skillsDemonstrated: string[];
    nextActivityTitle?: string;
    onContinue: () => void;
  }>({
    isOpen: false,
    title: '',
    type: 'LESSON',
    xpAwarded: 25,
    skillsDemonstrated: [],
    onContinue: () => {},
  });

  // AI Mentor Drawer State
  const [isAIMentorOpen, setIsAIMentorOpen] = useState(false);

  useEffect(() => {
    async function loadWorkspace() {
      try {
        const [lessonData, courseData] = await Promise.all([
          apiFetch<any>(`/courses/lessons/${lessonId}`),
          apiFetch<any>(`/courses/${slug}`),
        ]);

        setLesson(lessonData);
        setCourse(courseData);

        if (courseData?._id) {
          const prog = await apiFetch<any>(`/progress/course/${courseData._id}`).catch(() => null);
          setProgress(prog);
        }

        // Set active activity
        const activities = lessonData.activities || [];
        const active = activityParam
          ? activities.find((a: any) => a._id === activityParam)
          : activities[0];

        if (active) {
          setCurrentActivity(active);
          // Mark as started
          if (courseData?._id) {
            apiFetch('/progress/start', {
              method: 'POST',
              body: JSON.stringify({ courseId: courseData._id, activityId: active._id }),
            }).catch(() => {});
          }

          // If coding challenge, practice, exercise, or debugging, fetch details
          if (
            (active.type === 'CODING_CHALLENGE' ||
              active.type === 'PRACTICE' ||
              active.type === 'INTERACTIVE_EXERCISE' ||
              active.type === 'DEBUGGING_CHALLENGE') &&
            active.challengeRef
          ) {
            if (typeof active.challengeRef === 'object' && active.challengeRef.title) {
              setChallenge(active.challengeRef);
              setCode(active.challengeRef.starterCode || '');
            } else {
              const chId = active.challengeRef._id || active.challengeRef.id || active.challengeRef;
              const chData = await apiFetch<any>(`/challenges/${chId}`).catch(() => null);
              if (chData) {
                setChallenge(chData);
                setCode(chData.starterCode || '');
              }
            }
          } else if (active.type === 'CODE_EXAMPLE') {
            setCode(active.content || '// Interactive Code Example\nconsole.log("Hello from Codexa Sandbox!");');
          }
        }
      } catch (err) {
        console.error('Failed to load workspace:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWorkspace();
  }, [lessonId, slug, activityParam]);

  const selectActivity = async (act: any) => {
    setCurrentActivity(act);
    setSearchParams({ activity: act._id });
    setQuizResult(null);
    setQuizError(null);
    setExecutionResult(null);
    setCodeError(null);
    setSidebarOpen(false);

    if (course?._id) {
      apiFetch('/progress/start', {
        method: 'POST',
        body: JSON.stringify({ courseId: course._id, activityId: act._id }),
      }).catch(() => {});
    }

    if (
      (act.type === 'CODING_CHALLENGE' ||
        act.type === 'PRACTICE' ||
        act.type === 'INTERACTIVE_EXERCISE' ||
        act.type === 'DEBUGGING_CHALLENGE') &&
      act.challengeRef
    ) {
      if (typeof act.challengeRef === 'object' && act.challengeRef.title) {
        setChallenge(act.challengeRef);
        setCode(act.challengeRef.starterCode || '');
      } else {
        const chId = act.challengeRef._id || act.challengeRef.id || act.challengeRef;
        const chData = await apiFetch<any>(`/challenges/${chId}`).catch(() => null);
        if (chData) {
          setChallenge(chData);
          setCode(chData.starterCode || '');
        }
      }
    } else if (act.type === 'CODE_EXAMPLE') {
      setCode(act.content || '// Interactive Code Example\nconsole.log("Hello from Codexa Sandbox!");');
    }
  };

  const allLessonsInCourse =
    course?.modules?.flatMap((m: any) => m.lessons || []) || [];
  const currentLessonIndex = allLessonsInCourse.findIndex(
    (l: any) => (l._id || l.id) === lessonId
  );
  const nextLessonInCourse =
    currentLessonIndex !== -1 && currentLessonIndex < allLessonsInCourse.length - 1
      ? allLessonsInCourse[currentLessonIndex + 1]
      : null;

  const handleNextStep = () => {
    if (!lesson?.activities) return;
    const currentIndex = lesson.activities.findIndex((a: any) => a._id === currentActivity?._id);
    if (currentIndex !== -1 && currentIndex < lesson.activities.length - 1) {
      selectActivity(lesson.activities[currentIndex + 1]);
    } else if (nextLessonInCourse) {
      navigate(`/courses/${slug}/lesson/${nextLessonInCourse._id || nextLessonInCourse.id}`);
    } else {
      navigate(`/courses/${slug}`);
    }
  };

  const handleCompleteActivity = async (actId?: string) => {
    const targetId = actId || currentActivity?._id;
    if (!targetId || !course?._id) return;

    try {
      const updated = await apiFetch<any>('/progress/complete', {
        method: 'POST',
        body: JSON.stringify({ courseId: course._id, activityId: targetId }),
      });
      setProgress(updated);
      await refreshUser();

      const idx = lesson.activities.findIndex((a: any) => a._id === targetId);
      const nextAct = idx !== -1 && idx < lesson.activities.length - 1 ? lesson.activities[idx + 1] : null;

      const isLastStepInLesson = idx === lesson.activities.length - 1;

      setCompletionModal({
        isOpen: true,
        title: currentActivity?.title || 'Activity Completed',
        type: isLastStepInLesson ? 'LESSON' : 'LESSON',
        xpAwarded: 10,
        skillsDemonstrated: course?.skillsCovered?.slice(0, 2) || [],
        nextActivityTitle: nextAct
          ? nextAct.title
          : nextLessonInCourse
          ? `Next Lesson: ${nextLessonInCourse.title}`
          : 'Course Syllabus Complete',
        onContinue: () => {
          setCompletionModal((prev) => ({ ...prev, isOpen: false }));
          if (nextAct) {
            selectActivity(nextAct);
          } else if (nextLessonInCourse) {
            navigate(`/courses/${slug}/lesson/${nextLessonInCourse._id || nextLessonInCourse.id}`);
          } else {
            navigate(`/courses/${slug}`);
          }
        },
      });
    } catch (err) {
      console.error('Failed to complete activity:', err);
    }
  };

  const handleSubmitQuiz = async () => {
    const assessmentId = currentActivity?.assessmentRef?._id || currentActivity?.assessmentRef;
    if (!assessmentId) return;

    setSubmittingQuiz(true);
    setQuizError(null);
    try {
      const attempt = await apiFetch<any>(`/assessments/${assessmentId}/attempt`, {
        method: 'POST',
        body: JSON.stringify({ answers: quizAnswers, timeSpentSeconds: 60 }),
      });
      setQuizResult(attempt);

      if (attempt.passed && course?._id) {
        const updated = await apiFetch<any>('/progress/complete', {
          method: 'POST',
          body: JSON.stringify({ courseId: course._id, activityId: currentActivity._id }),
        });
        setProgress(updated);
        await refreshUser();

        const idx = lesson.activities.findIndex((a: any) => a._id === currentActivity._id);
        const nextAct = idx !== -1 && idx < lesson.activities.length - 1 ? lesson.activities[idx + 1] : null;

        setCompletionModal({
          isOpen: true,
          title: `Assessment Passed with ${attempt.score}%!`,
          type: 'QUIZ',
          xpAwarded: 20,
          skillsDemonstrated: attempt.skillsDemonstrated || course?.skillsCovered?.slice(0, 2) || [],
          nextActivityTitle: nextAct
            ? nextAct.title
            : nextLessonInCourse
            ? `Next Lesson: ${nextLessonInCourse.title}`
            : 'Course Syllabus Complete',
          onContinue: () => {
            setCompletionModal((prev) => ({ ...prev, isOpen: false }));
            if (nextAct) {
              selectActivity(nextAct);
            } else if (nextLessonInCourse) {
              navigate(`/courses/${slug}/lesson/${nextLessonInCourse._id || nextLessonInCourse.id}`);
            } else {
              navigate(`/courses/${slug}`);
            }
          },
        });
      }
    } catch (err: any) {
      setQuizError(err.message || 'Quiz submission failed. Please check your answers and retry.');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleRunCode = async (isSubmission = false) => {
    setExecutingCode(true);
    setCodeError(null);

    try {
      const chId =
        challenge?._id ||
        challenge?.id ||
        currentActivity?.challengeRef?._id ||
        currentActivity?.challengeRef?.id ||
        (typeof currentActivity?.challengeRef === 'string' ? currentActivity?.challengeRef : undefined);

      if (chId) {
        const endpoint = isSubmission
          ? `/challenges/${chId}/submit`
          : `/challenges/${chId}/run`;

        const result = await apiFetch<any>(endpoint, {
          method: 'POST',
          body: JSON.stringify({ code }),
        });

        setExecutionResult(result);

        if (result.status === 'PASSED' && course?._id && isSubmission) {
          const updated = await apiFetch<any>('/progress/complete', {
            method: 'POST',
            body: JSON.stringify({ courseId: course._id, activityId: currentActivity._id }),
          });
          setProgress(updated);
          await refreshUser();

          const idx = lesson.activities.findIndex((a: any) => a._id === currentActivity._id);
          const nextAct = idx !== -1 && idx < lesson.activities.length - 1 ? lesson.activities[idx + 1] : null;

          setCompletionModal({
            isOpen: true,
            title: challenge?.title || 'Challenge Solved!',
            type: 'CHALLENGE',
            xpAwarded: 25,
            skillsDemonstrated: [challenge?.language || 'JavaScript', ...(course?.skillsCovered?.slice(0, 2) || [])],
            nextActivityTitle: nextAct
              ? nextAct.title
              : nextLessonInCourse
              ? `Next Lesson: ${nextLessonInCourse.title}`
              : 'Course Syllabus Complete',
            onContinue: () => {
              setCompletionModal((prev) => ({ ...prev, isOpen: false }));
              if (nextAct) {
                selectActivity(nextAct);
              } else if (nextLessonInCourse) {
                navigate(`/courses/${slug}/lesson/${nextLessonInCourse._id || nextLessonInCourse.id}`);
              } else {
                navigate(`/courses/${slug}`);
              }
            },
          });
        }
      } else {
        const result = await apiFetch<any>('/challenges/run-snippet', {
          method: 'POST',
          body: JSON.stringify({
            code,
            language: challenge?.language || 'javascript',
          }),
        });
        setExecutionResult(result);
      }
    } catch (err: any) {
      setCodeError(err.message || 'Execution error in sandbox.');
    } finally {
      setExecutingCode(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <LessonSkeleton />
      </div>
    );
  }

  const parentModule = course?.modules?.find((m: any) =>
    m.lessons?.some((l: any) => l._id === lessonId || l.id === lessonId)
  );

  const activities = lesson?.activities || [];
  const currentActivityIndex = activities.findIndex((a: any) => a._id === currentActivity?._id);
  const isCurrentCompleted = progress?.completedActivities?.includes(currentActivity?._id);
  const cleanLessonTitle = (lesson?.title || '').replace(/^Lesson\s*\d+[:.\s-]*/i, '');

  const getActivityTypeLabel = (type: string, index?: number) => {
    switch (type) {
      case 'VIDEO':
        return '01 Think';
      case 'NOTES':
      case 'ARTICLE':
        return '02 Design';
      case 'CODING_CHALLENGE':
      case 'PRACTICE':
      case 'INTERACTIVE_EXERCISE':
      case 'CODE_EXAMPLE':
        return '03 Build';
      case 'QUIZ':
      case 'ASSESSMENT':
        return '04 Ship';
      case 'RESOURCE':
      case 'REFERENCE':
        return 'Reference';
      default:
        return index !== undefined ? `0${index + 1} Step` : 'Step';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <PlayCircle className="h-3.5 w-3.5 text-primary shrink-0" />;
      case 'NOTES':
      case 'ARTICLE':
        return <FileText className="h-3.5 w-3.5 text-secondary shrink-0" />;
      case 'CODE_EXAMPLE':
      case 'CODING_CHALLENGE':
      case 'PRACTICE':
        return <Code2 className="h-3.5 w-3.5 text-primary shrink-0" />;
      case 'INTERACTIVE_EXERCISE':
        return <Zap className="h-3.5 w-3.5 text-sky-400 shrink-0" />;
      case 'DEBUGGING_CHALLENGE':
        return <Bug className="h-3.5 w-3.5 text-amber-400 shrink-0" />;
      case 'QUIZ':
      case 'ASSESSMENT':
        return <HelpCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />;
      case 'RESOURCE':
      case 'REFERENCE':
        return <BookOpen className="h-3.5 w-3.5 text-secondary shrink-0" />;
      default:
        return <FileText className="h-3.5 w-3.5 text-muted shrink-0" />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden bg-main text-primary">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar: Curriculum / Lesson Navigator */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-subtle bg-surface flex flex-col shrink-0 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 top-14' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Breadcrumb Navigation Header */}
        <div className="p-4 border-b border-subtle space-y-2.5">
          <div className="flex items-center justify-between">
            <Link
              to={`/courses/${slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-primary transition group"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>‹ SYLLABUS</span>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded text-muted hover:text-primary md:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div>
            <span className="text-xs font-semibold text-accent block truncate">
              {parentModule ? parentModule.title : 'Active Module'}
            </span>
            <h2 className="text-sm font-bold text-primary tracking-tight truncate mt-0.5" title={cleanLessonTitle}>
              {cleanLessonTitle}
            </h2>
          </div>

          {/* Lesson Mini Progress */}
          <div className="pt-1">
            <div className="flex items-center justify-between text-xs text-muted mb-1.5">
              <span>Steps</span>
              <span className="font-bold text-primary">
                {activities.filter((a: any) => progress?.completedActivities?.includes(a._id)).length} /{' '}
                {activities.length}
              </span>
            </div>
            <div className="w-full h-1 rounded-full bg-surface-elevated overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{
                  width: `${
                    activities.length > 0
                      ? (activities.filter((a: any) => progress?.completedActivities?.includes(a._id)).length /
                          activities.length) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="text-xs font-semibold text-muted px-2 py-1 uppercase tracking-wider">
            Pipeline Steps
          </div>

          {activities.map((act: any, idx: number) => {
            const isActCompleted = progress?.completedActivities?.includes(act._id);
            const isCurrent = currentActivity?._id === act._id;
            return (
              <button
                key={act._id}
                onClick={() => selectActivity(act)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition-all duration-150 border ${
                  isCurrent
                    ? 'bg-surface-elevated text-primary font-bold border-highlight'
                    : isActCompleted
                    ? 'bg-transparent text-secondary hover:text-primary hover:bg-surface-elevated border-transparent'
                    : 'text-muted hover:text-primary hover:bg-surface-elevated border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  {isActCompleted ? (
                    <div className="h-4 w-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="h-2.5 w-2.5" />
                    </div>
                  ) : (
                    getActivityIcon(act.type)
                  )}
                  <div className="truncate">
                    <div className="truncate text-xs font-semibold text-primary">{act.title}</div>
                    <div className="text-xs text-muted">
                      {getActivityTypeLabel(act.type, idx)}
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <span className="text-xs shrink-0 ml-2">
                  {isActCompleted ? (
                    <span className="text-emerald-400 font-bold">✓</span>
                  ) : isCurrent ? (
                    <span className="text-primary font-bold">●</span>
                  ) : (
                    <span className="text-muted">○</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* AI Mentor Quick Launch Footer */}
        <div className="p-3 border-t border-subtle bg-surface">
          <button
            onClick={() => setIsAIMentorOpen(true)}
            className="btn btn-secondary w-full py-2 text-xs inline-flex items-center justify-center gap-2"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Mentor</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Activity Top Navigation & Step Indicator Bar */}
        <div className="h-14 border-b border-subtle px-4 sm:px-6 flex items-center justify-between bg-main shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg border border-subtle bg-surface text-secondary hover:text-primary md:hidden"
              aria-label="Open syllabus navigation"
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* 4-Step Segmented Stepper */}
            <div className="hidden sm:flex items-center gap-1 p-0.5 rounded-full bg-surface border border-subtle">
              {activities.map((act: any, idx: number) => {
                const isActDone = progress?.completedActivities?.includes(act._id);
                const isActActive = currentActivity?._id === act._id;
                return (
                  <button
                    key={act._id}
                    onClick={() => selectActivity(act)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all duration-150 ${
                      isActActive
                        ? 'bg-primary text-main font-bold'
                        : isActDone
                        ? 'text-emerald-400 hover:text-primary'
                        : 'text-muted hover:text-primary'
                    }`}
                  >
                    {isActDone && !isActActive ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : null}
                    <span>{getActivityTypeLabel(act.type, idx)}</span>
                  </button>
                );
              })}
            </div>

            <div className="truncate">
              <span className="text-xs text-muted block">
                Step 0{currentActivityIndex + 1} of 0{activities.length}
              </span>
              <h1 className="text-xs sm:text-sm font-bold text-primary truncate">
                {currentActivity?.title || cleanLessonTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Contextual AI Trigger */}
            <button
              onClick={() => setIsAIMentorOpen(true)}
              className="btn btn-secondary text-xs px-3 py-1 hidden sm:inline-flex items-center gap-1.5"
              title="Open AI Mentor context drawer"
            >
              <Sparkles className="h-3 w-3" />
              <span>AI Mentor</span>
            </button>

            {isCurrentCompleted ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-400 text-xs hidden sm:inline-flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Done
                </span>
                {currentActivityIndex < activities.length - 1 ? (
                  <button
                    onClick={handleNextStep}
                    className="btn btn-primary text-xs px-3 py-1 inline-flex items-center gap-1"
                  >
                    <span>Next Step</span>
                    <span>↗</span>
                  </button>
                ) : nextLessonInCourse ? (
                  <button
                    onClick={handleNextStep}
                    className="btn btn-primary text-xs px-3.5 py-1 inline-flex items-center gap-1"
                  >
                    <span>Next Lesson</span>
                    <span>↗</span>
                  </button>
                ) : null}
              </div>
            ) : (
              <button
                onClick={() => handleCompleteActivity()}
                className="btn btn-primary text-xs px-4 py-1.5 inline-flex items-center gap-1.5"
                title="Mark this activity completed and advance"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Complete Step</span>
                <span>↗</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Activity Player */}
        <div className="flex-1 overflow-y-auto">
          {/* ========================================================================= */}
          {/* 1. VIDEO ACTIVITY */}
          {/* ========================================================================= */}
          {currentActivity?.type === 'VIDEO' && (
            <div className="max-w-4xl mx-auto p-6 sm:p-8 space-y-6">
              <div className="craft-card p-4 space-y-1">
                <span className="text-xs font-semibold text-accent block">Phase 01 · Concept Masterclass</span>
                <p className="text-xs text-secondary leading-relaxed">
                  Watch the lecture below to understand core mechanics and system invariants before reviewing notes and writing code.
                </p>
              </div>

              <div className="rounded-xl overflow-hidden craft-card p-1 border border-subtle">
                <VideoPlayer
                  url={currentActivity.resourceRef?.canonicalUrl}
                  embedUrl={currentActivity.resourceRef?.embedUrl}
                  externalId={currentActivity.resourceRef?.externalId}
                  title={currentActivity.resourceRef?.title || currentActivity.title}
                  provider={currentActivity.resourceRef?.provider || 'YouTube'}
                  attribution={currentActivity.resourceRef?.attribution}
                />
              </div>

              {currentActivity.content && (
                <div className="pt-6 border-t border-subtle space-y-3">
                  <span className="text-xs font-semibold text-accent block">
                    Key Takeaways & Summary
                  </span>
                  <div className="reading-surface craft-card p-6">
                    <MarkdownRenderer
                      content={currentActivity.content}
                      onTryIt={(c, l) => setTryItModal({ isOpen: true, code: c, language: l })}
                    />
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-subtle flex items-center justify-between">
                <span className="text-xs text-muted">Ready to proceed to tutorial notes?</span>
                <button
                  onClick={() => handleCompleteActivity()}
                  className="btn btn-primary inline-flex items-center gap-2 text-xs px-5 py-2"
                >
                  <span>Complete & Continue</span>
                  <span>↗</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. CODEXA IN-DEPTH NOTES & TUTORIAL */}
          {/* ========================================================================= */}
          {(currentActivity?.type === 'NOTES' || currentActivity?.type === 'ARTICLE') && (
            <div className="max-w-4xl mx-auto p-6 sm:p-10 space-y-8">
              {/* Tutorial Header Banner */}
              <div className="border-b border-subtle pb-6 space-y-2">
                <span className="text-xs font-semibold text-accent block">
                  Phase 02 · Interactive Notes & Mental Models
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-primary tracking-tight">
                  {currentActivity.title}
                </h1>
                <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                  Study the core invariants, syntax patterns, and runnable snippets. Once ready, proceed to 03 Build to write code in the live sandbox.
                </p>
              </div>

              {/* Complete In-Lesson Tutorial Content */}
              <div className="reading-surface space-y-4 craft-card p-6 sm:p-8">
                <MarkdownRenderer
                  content={currentActivity.content}
                  onTryIt={(c, l) => setTryItModal({ isOpen: true, code: c, language: l })}
                />
              </div>

              {/* Attached Official Documentation & Deeper Reading */}
              {(currentActivity.resourceRef || (currentActivity.resourceRefs && currentActivity.resourceRefs.length > 0)) && (
                <div className="mt-10 pt-8 border-t border-subtle space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-accent block">
                      Primary References & Sources
                    </span>
                    <span className="tag-badge text-xs">
                      Reference
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {(currentActivity.resourceRefs || [currentActivity.resourceRef]).map((res: any, idx: number) => {
                      if (!res) return null;
                      return (
                        <a
                          key={res._id || idx}
                          href={res.canonicalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="craft-card-interactive p-4 transition group flex items-start justify-between"
                        >
                          <div className="space-y-1 overflow-hidden pr-2">
                            <span className="text-xs text-muted block font-medium">
                              {res.provider || 'Documentation'}
                            </span>
                            <div className="text-xs font-bold text-primary group-hover:text-sky-400 truncate mt-1">
                              {res.title}
                            </div>
                            <div className="text-xs text-muted">
                              License: {res.license || 'Open Docs'}
                            </div>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted group-hover:text-primary shrink-0 mt-1 transition" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bottom Action / Progression CTA */}
              <div className="pt-8 border-t border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 craft-card p-6">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-accent block">
                    Ready for Hands-On Drills?
                  </span>
                  <p className="text-xs text-secondary font-medium">
                    Apply this concept immediately in the live browser Monaco code editor.
                  </p>
                </div>

                <button
                  onClick={() => handleCompleteActivity()}
                  className="btn btn-primary inline-flex items-center justify-center gap-2 text-xs shrink-0 px-6 py-2.5"
                >
                  <span>Continue to 03 Build</span>
                  <span>↗</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. CODE EXAMPLES */}
          {/* ========================================================================= */}
          {currentActivity?.type === 'CODE_EXAMPLE' && (
            <div className="max-w-4xl mx-auto p-6 sm:p-8 space-y-6">
              <div className="border-b border-subtle pb-4 space-y-1">
                <span className="text-xs font-semibold text-accent block">
                  Phase 03 · Interactive Snippet
                </span>
                <h2 className="text-2xl font-bold text-primary tracking-tight">{currentActivity.title}</h2>
                <p className="text-xs text-secondary mt-1">
                  Modify the code example below and run it directly in the isolated sandbox.
                </p>
              </div>

              {/* Interactive Code Editor Box */}
              <div className="craft-card p-0 overflow-hidden">
                <div className="h-10 px-4 border-b border-subtle bg-surface-elevated flex items-center justify-between">
                  <span className="text-xs font-bold text-muted">example.js</span>
                  <button
                    onClick={() => handleRunCode(false)}
                    disabled={executingCode}
                    className="btn btn-secondary text-xs px-3 py-1 inline-flex items-center gap-1.5"
                  >
                    {executingCode ? (
                      <Sparkles className="h-3 w-3 animate-spin" />
                    ) : (
                      <Play className="h-3 w-3 fill-current" />
                    )}
                    <span>Run Code</span>
                  </button>
                </div>

                <div className="h-60">
                  <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    theme={resolvedTheme === 'dark' ? 'vs-dark' : 'vs'}
                    value={code}
                    onChange={(val) => setCode(val || '')}
                    options={{
                      fontSize: 13,
                      fontFamily: "'JetBrains Mono', monospace",
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      tabSize: 2,
                    }}
                  />
                </div>

                {codeError && (
                  <div className="p-3 border-t border-danger/20 bg-danger/10 text-danger text-xs font-mono">
                    {codeError}
                  </div>
                )}

                {executionResult && (
                  <div className="p-4 border-t border-subtle bg-surface space-y-2 font-mono text-xs">
                    <span className="text-muted font-bold block text-[10px]">SANDBOX OUTPUT:</span>
                    {executionResult.stdout ? (
                      <div className="p-3 rounded-lg bg-surface-elevated border border-subtle text-primary whitespace-pre-wrap">
                        {executionResult.stdout}
                      </div>
                    ) : (
                      <div className="text-muted">Code executed successfully with zero stdout output.</div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-subtle flex items-center justify-between">
                <span className="text-xs text-muted">Ready to practice what you learned?</span>
                <button
                  onClick={() => handleCompleteActivity()}
                  className="btn btn-primary inline-flex items-center gap-2 text-xs"
                >
                  <span>Complete & Continue</span>
                  <span>↗</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. INTERACTIVE EXERCISES */}
          {/* ========================================================================= */}
          {currentActivity?.type === 'INTERACTIVE_EXERCISE' && (
            <InteractiveExerciseView
              activity={currentActivity}
              challenge={challenge}
              onComplete={() => handleCompleteActivity()}
              isCompleted={isCurrentCompleted}
            />
          )}

          {/* ========================================================================= */}
          {/* 5. DEBUGGING CHALLENGES */}
          {/* ========================================================================= */}
          {currentActivity?.type === 'DEBUGGING_CHALLENGE' && (
            <DebuggingChallengeView
              activity={currentActivity}
              challenge={challenge}
              onComplete={() => handleCompleteActivity()}
              isCompleted={isCurrentCompleted}
            />
          )}

          {/* ========================================================================= */}
          {/* 6. REFERENCES & DOCUMENTATION */}
          {/* ========================================================================= */}
          {(currentActivity?.type === 'REFERENCE' || currentActivity?.type === 'RESOURCE') && (
            <ReferenceView
              activity={currentActivity}
              onComplete={() => handleCompleteActivity()}
              onTryIt={(c, l) => setTryItModal({ isOpen: true, code: c, language: l })}
              isCompleted={isCurrentCompleted}
            />
          )}

          {/* ========================================================================= */}
          {/* 7. QUIZ ASSESSMENT */}
          {/* ========================================================================= */}
          {currentActivity?.type === 'QUIZ' && (
            <div className="max-w-3xl mx-auto p-6 sm:p-8 space-y-6">
              <div className="border-b border-subtle pb-4 space-y-1">
                <span className="text-xs font-semibold text-accent block">
                  Phase 04 · Knowledge Assessment
                </span>
                <h2 className="text-2xl font-bold text-primary tracking-tight">
                  {currentActivity.assessmentRef?.title || currentActivity.title}
                </h2>
                <p className="text-xs text-secondary">
                  {currentActivity.assessmentRef?.description ||
                    'Answer the conceptual and code-prediction questions below to test your understanding. Passing with 70%+ marks this step complete.'}
                </p>
              </div>

              {quizError && (
                <div className="p-3.5 rounded-lg bg-danger/10 border border-danger/30 text-xs text-danger flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{quizError}</span>
                </div>
              )}

              {currentActivity.assessmentRef?.questions?.map((q: any, idx: number) => {
                const qKey = q._id || q.id || String(idx);
                const isMultiSelect = q.type === 'MULTIPLE_SELECT';

                return (
                  <div
                    key={qKey}
                    className="craft-card p-6 space-y-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-semibold text-accent shrink-0 mt-0.5">
                        0{idx + 1}
                      </span>
                      <div className="space-y-2 flex-1">
                        <h3 className="text-sm font-bold text-primary leading-relaxed">
                          {q.question}
                        </h3>

                        {/* Code Snippet if applicable */}
                        {q.codeSnippet && (
                          <div className="p-3 rounded-lg code-frame text-xs text-primary overflow-x-auto">
                            <code>{q.codeSnippet}</code>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      {q.options?.map((opt: string, optIdx: number) => {
                        const isSelected = isMultiSelect
                          ? Array.isArray(quizAnswers[qKey]) && quizAnswers[qKey].includes(optIdx)
                          : quizAnswers[qKey] === optIdx;

                        return (
                          <button
                            key={optIdx}
                            onClick={() => {
                              if (isMultiSelect) {
                                const currentArr: number[] = Array.isArray(quizAnswers[qKey])
                                  ? [...quizAnswers[qKey]]
                                  : [];
                                const newArr = currentArr.includes(optIdx)
                                  ? currentArr.filter((i) => i !== optIdx)
                                  : [...currentArr, optIdx];
                                setQuizAnswers((prev) => ({ ...prev, [qKey]: newArr }));
                              } else {
                                setQuizAnswers((prev) => ({ ...prev, [qKey]: optIdx }));
                              }
                            }}
                            className={`w-full text-left px-4 py-3 rounded-lg border text-xs transition flex items-center justify-between ${
                              isSelected
                                ? 'bg-primary text-main font-semibold border-primary'
                                : 'bg-surface-elevated border-subtle text-secondary hover:text-primary hover:border-highlight'
                            }`}
                          >
                            <span>{opt}</span>
                            <span
                              className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                                isSelected ? 'border-main bg-main' : 'border-subtle'
                              }`}
                            >
                              {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Quiz Result Banner */}
              {quizResult && (
                <div
                  className={`p-6 rounded-xl border ${
                    quizResult.passed
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  } space-y-3`}
                >
                  <div className="flex items-center gap-3">
                    {quizResult.passed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-primary">
                        {quizResult.passed ? 'Assessment Passed' : 'Knowledge Review Required'}
                      </h4>
                      <p className="text-xs opacity-90 mt-0.5">
                        Score: {quizResult.score}% • Bar: 70%
                      </p>
                    </div>
                  </div>

                  {quizResult.mistakes?.length > 0 && (
                    <div className="pt-3 space-y-2 text-xs border-t border-current/15">
                      <p className="font-bold text-primary">Items to Review:</p>
                      {quizResult.mistakes.map((m: any, i: number) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-surface border border-subtle text-secondary space-y-1"
                        >
                          <p className="font-semibold text-primary">{m.questionText || m.questionId}</p>
                          <p className="text-amber-400">{m.explanation}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button & Subtext */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-subtle">
                <div className="text-xs text-muted flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-primary" />
                  <span>Passing score required: 70%</span>
                </div>

                <button
                  onClick={handleSubmitQuiz}
                  disabled={submittingQuiz || Object.keys(quizAnswers).length === 0}
                  className="btn btn-primary w-full sm:w-auto text-xs px-6 py-2.5"
                >
                  <span>{submittingQuiz ? 'Evaluating answers...' : 'Submit Assessment'}</span>
                  <span>↗</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 8. CODING CHALLENGE (Monaco Editor + Isolated Sandbox) */}
          {/* ========================================================================= */}
          {(currentActivity?.type === 'CODING_CHALLENGE' || currentActivity?.type === 'PRACTICE') && (
            (() => {
              const activeChallenge = challenge || (typeof currentActivity?.challengeRef === 'object' ? currentActivity.challengeRef : null) || {
                title: currentActivity.title || 'Code Practice',
                description: currentActivity.content || 'Write and test your solution in the interactive sandbox.',
                starterCode: '// Write your solution here\n',
                language: 'javascript',
                testCases: [],
              };

              return (
                <div className="flex h-full flex-col lg:flex-row overflow-hidden">
                  {/* Left Column: Problem Spec & Test Cases */}
                  <div className="w-full lg:w-[45%] border-r border-subtle flex flex-col overflow-y-auto p-6 space-y-6 bg-surface">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="tag-badge text-xs text-primary">
                          {activeChallenge.difficulty || 'Beginner'}
                        </span>
                        <span className="text-xs text-muted">
                          Language: {activeChallenge.language || 'JavaScript'}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-primary tracking-tight mt-2">{activeChallenge.title}</h2>
                    </div>

                    <div className="space-y-3">
                      <span className="text-xs font-semibold text-accent block">
                        Task Specification
                      </span>
                      <div className="reading-surface">
                        <MarkdownRenderer content={activeChallenge.description || ''} />
                      </div>
                    </div>

                    {/* Expected Test Cases */}
                    {activeChallenge.testCases && activeChallenge.testCases.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-accent block">
                            Target Test Cases ({activeChallenge.testCases.length})
                          </span>
                          <span className="text-xs text-muted">Sandbox Verified</span>
                        </div>

                        <div className="space-y-2">
                          {activeChallenge.testCases.map((tc: any, i: number) => (
                            <div
                              key={tc.id || i}
                              className="p-3.5 rounded-lg bg-surface-elevated border border-subtle space-y-1.5 text-xs"
                            >
                              <div className="text-primary font-bold flex items-center gap-1.5">
                                <span className="text-primary">#{i + 1}</span>
                                {tc.description}
                              </div>
                              <div className="text-muted truncate">Input: {tc.input}</div>
                              <div className="text-emerald-400 truncate">
                                Expected: {tc.expectedOutput}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hints */}
                    {activeChallenge.hints && activeChallenge.hints.length > 0 && (
                      <div className="p-4 rounded-xl border border-subtle bg-surface-elevated space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                          <Sparkles className="h-3.5 w-3.5 text-primary" />
                          Guided Hints
                        </div>
                        <ul className="list-disc list-inside text-xs text-secondary space-y-1">
                          {activeChallenge.hints.map((hint: string, hIdx: number) => (
                            <li key={hIdx}>{hint}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Monaco Code Editor & Terminal */}
                  <div className="flex-1 flex flex-col overflow-hidden bg-surface-elevated">
                    {/* Editor Action Bar */}
                    <div className="h-12 border-b border-subtle px-4 flex items-center justify-between bg-surface shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary">solution.js</span>
                        <span className="tag-badge text-xs">
                          Sandbox
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Reset Code */}
                        <button
                          onClick={() => setCode(activeChallenge.starterCode || '')}
                          className="btn btn-secondary text-xs px-2.5 py-1 hidden sm:inline-flex items-center gap-1"
                          title="Reset code to original starter template"
                        >
                          <span>Reset</span>
                        </button>

                        {/* Run Code Button */}
                        <button
                          onClick={() => handleRunCode(false)}
                          disabled={executingCode}
                          title="Run against sample tests in isolated sandbox."
                          className="btn btn-secondary text-xs px-3 py-1 inline-flex items-center gap-1.5"
                        >
                          <Play className="h-3 w-3 fill-current" />
                          <span>Run Code</span>
                        </button>

                        {/* Submit Solution Button */}
                        <button
                          onClick={() => handleRunCode(true)}
                          disabled={executingCode}
                          title="Submit solution for official evaluation & mark complete."
                          className="btn btn-primary text-xs px-3.5 py-1 inline-flex items-center gap-1.5"
                        >
                          <Send className="h-3 w-3" />
                          <span>Submit</span>
                          <span>↗</span>
                        </button>
                      </div>
                    </div>

                    {/* Monaco Editor */}
                    <div className="flex-1 min-h-[300px]">
                      <Editor
                        height="100%"
                        defaultLanguage={activeChallenge.language || 'javascript'}
                        theme={resolvedTheme === 'dark' ? 'vs-dark' : 'vs'}
                        value={code}
                        onChange={(val) => setCode(val || '')}
                        options={{
                          fontSize: 13,
                          fontFamily: "'JetBrains Mono', monospace",
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          tabSize: 2,
                        }}
                      />
                    </div>

                    {/* Test Output & Console */}
                    <div className="h-56 border-t border-subtle bg-surface flex flex-col shrink-0 font-mono text-xs">
                      <div className="px-4 py-2 border-b border-subtle flex items-center justify-between text-muted text-[11px] bg-surface-elevated">
                        <span className="flex items-center gap-1.5 font-bold">
                          <Terminal className="h-3.5 w-3.5 text-primary" />
                          EXECUTION TERMINAL
                        </span>
                        {executionResult && (
                          <span
                            className={`font-bold ${
                              executionResult.status === 'PASSED'
                                ? 'text-emerald-400'
                                : 'text-danger'
                            }`}
                          >
                            {executionResult.status} ({executionResult.passedCount}/
                            {executionResult.totalCount} passed in {executionResult.executionTimeMs}ms)
                          </span>
                        )}
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {codeError && (
                          <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-xs">
                            {codeError}
                          </div>
                        )}

                        {/* Passed Success Action Banner */}
                        {executionResult?.status === 'PASSED' && (
                          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>All test assertions passed! Ready to advance.</span>
                            </div>
                            <button
                              onClick={() => handleCompleteActivity()}
                              className="btn btn-primary text-xs px-3 py-1 inline-flex items-center gap-1"
                            >
                              <span>Complete Step</span>
                              <span>↗</span>
                            </button>
                          </div>
                        )}

                        {executingCode ? (
                          <div className="flex items-center gap-2 text-primary p-2">
                            <Sparkles className="h-4 w-4 animate-spin" />
                            <span>Executing in isolated sandbox...</span>
                          </div>
                        ) : executionResult ? (
                          <div className="space-y-3">
                            {executionResult.results?.map((res: any, idx: number) => (
                              <div
                                key={idx}
                                className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                                  res.passed
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                    : 'bg-danger/10 border-danger/30 text-danger'
                                }`}
                              >
                                {res.passed ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-danger shrink-0 mt-0.5" />
                                )}
                                <div className="space-y-1 overflow-hidden font-mono">
                                  <div className="font-bold text-primary">{res.description}</div>
                                  {res.errorMessage && (
                                    <div className="text-danger">{res.errorMessage}</div>
                                  )}
                                  {!res.passed && res.expectedOutput && (
                                    <div className="text-muted text-[11px]">
                                      Expected: <span className="text-emerald-400">{res.expectedOutput}</span> | Received: <span className="text-danger">{res.actualOutput || 'null'}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}

                            {executionResult.stdout && (
                              <div className="p-3 rounded-lg bg-surface-elevated border border-subtle text-secondary whitespace-pre-wrap font-mono">
                                <span className="text-muted font-bold block mb-1">Standard Output (stdout):</span>
                                {executionResult.stdout}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-2">
                            <div className="flex items-center gap-2 text-muted">
                              <Info className="h-4 w-4 text-primary shrink-0" />
                              <span>
                                Click <strong>Run Code</strong> to test sample inputs, or <strong>Submit</strong> to evaluate and record your score.
                              </span>
                            </div>
                            <button
                              onClick={() => handleCompleteActivity()}
                              className="btn btn-ghost text-xs px-3 py-1 text-muted hover:text-primary shrink-0"
                              title="Skip and mark step complete"
                            >
                              <span>Skip & Complete Step ↗</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      </main>

      {/* Try It Yourself Sandbox Modal */}
      <TryItModal
        isOpen={tryItModal.isOpen}
        onClose={() => setTryItModal((prev) => ({ ...prev, isOpen: false }))}
        initialCode={tryItModal.code}
        language={tryItModal.language}
      />

      {/* Completion Modal */}
      <CompletionModal
        isOpen={completionModal.isOpen}
        onClose={() => setCompletionModal((prev) => ({ ...prev, isOpen: false }))}
        title={completionModal.title}
        type={completionModal.type}
        xpAwarded={completionModal.xpAwarded}
        skillsDemonstrated={completionModal.skillsDemonstrated}
        nextActivityTitle={completionModal.nextActivityTitle}
        onContinue={completionModal.onContinue}
      />

      {/* Slide-over Contextual AI Mentor */}
      <AIMentorDrawer
        isOpen={isAIMentorOpen}
        onClose={() => setIsAIMentorOpen(false)}
        currentContext={{
          courseId: course?._id,
          lessonId,
          activityId: currentActivity?._id,
          challengeId: currentActivity?.challengeRef?._id || currentActivity?.challengeRef,
          currentCode: code,
          runtimeError: executionResult?.error,
          activeAssessmentId: currentActivity?.assessmentRef?._id || currentActivity?.assessmentRef,
          stepName: currentActivity?.type === 'VIDEO'
            ? 'VIDEO'
            : currentActivity?.type === 'NOTES'
            ? 'NOTES'
            : (currentActivity?.type === 'PRACTICE' || currentActivity?.type === 'CODING_CHALLENGE')
            ? 'PRACTICE'
            : (currentActivity?.type === 'QUIZ' || currentActivity?.type === 'ASSESSMENT')
            ? 'ASSESSMENT'
            : undefined,
        }}
      />
    </div>
  );
};
