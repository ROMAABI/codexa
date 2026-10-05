import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  CheckCircle2,
  PlayCircle,
  FileText,
  HelpCircle,
  Code2,
  Layers,
  ArrowRight,
  Play,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
  Terminal,
} from 'lucide-react';
import { CourseVisual } from '../components/ui/CourseVisual';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  useDocumentTitle(course?.title);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadCourse() {
      try {
        const courseData = await apiFetch<any>(`/courses/${slug}`);
        setCourse(courseData);

        if (courseData?.modules) {
          const initExp: Record<string, boolean> = {};
          courseData.modules.forEach((m: any) => {
            initExp[m._id] = true;
          });
          setExpandedModules(initExp);
        }

        if (user && courseData) {
          const progressData = await apiFetch<any>(`/progress/course/${courseData._id}`).catch(() => null);
          setProgress(progressData);
        }
      } catch (err) {
        console.error('Failed to load course details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [slug, user]);

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-muted font-mono text-xs">
        <Sparkles className="h-4 w-4 animate-spin text-accent mr-2" />
        Loading course syllabus...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-3">
        <h2 className="text-xl font-bold text-primary">Course Not Found</h2>
        <Link to="/catalog" className="text-accent text-xs font-mono inline-block hover:underline font-semibold">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <PlayCircle className="h-3.5 w-3.5 text-cyan-400 shrink-0" />;
      case 'QUIZ':
        return <HelpCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />;
      case 'CODING_CHALLENGE':
        return <Code2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />;
      default:
        return <FileText className="h-3.5 w-3.5 text-blue-400 shrink-0" />;
    }
  };

  const firstModule = course.modules?.[0];
  const firstLesson = firstModule?.lessons?.[0];
  const firstActivity = firstLesson?.activities?.[0];
  const startUrl = firstLesson
    ? `/courses/${course.slug}/lesson/${firstLesson._id}${firstActivity ? `?activity=${firstActivity._id}` : ''}`
    : '#';

  const completedCount = progress?.completedActivities?.length || 0;
  const totalLessons =
    course.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0) || 0;
  const totalActivitiesCount =
    course.modules?.reduce(
      (sum: number, m: any) =>
        sum + (m.lessons?.reduce((lSum: number, l: any) => lSum + (l.activities?.length || 0), 0) || 0),
      0
    ) || 0;

  const percentComplete = totalActivitiesCount > 0 ? Math.round((completedCount / totalActivitiesCount) * 100) : 0;

  return (
    <div className="space-y-12 pb-20 animate-fade-in">
      {/* 1. HERO BANNER (Architectural Craft Header) */}
      <div className="border-b border-subtle py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-4 max-w-2xl flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-accent font-semibold">
                  {course.domain || 'Systems'}
                </span>
                <span className="text-muted">/</span>
                <span className="text-secondary">
                  {course.level || 'Beginner'}
                </span>
                <span className="text-muted">/</span>
                <span className="text-secondary">
                  ~{course.estimatedHours || 40}h
                </span>
                <span className="text-muted">/</span>
                <span className="text-secondary">
                  {totalLessons} Lessons
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-primary tracking-tight">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-secondary leading-relaxed max-w-2xl">
                {course.description}
              </p>

              {/* Progress Bar if logged in */}
              {user && (
                <div className="p-4 rounded-xl craft-card max-w-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted">Track Completion</span>
                    <span className="text-primary font-bold">
                      {percentComplete}% ({completedCount} / {totalActivitiesCount} done)
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-surface-elevated overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${percentComplete}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  to={startUrl}
                  className="btn btn-primary px-6 py-2.5 text-xs inline-flex items-center gap-2"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>{percentComplete > 0 ? 'Resume Track' : 'Start First Lesson'}</span>
                  <span>↗</span>
                </Link>
              </div>
            </div>

            {/* Course Technology Emblem Visual */}
            <div className="w-full sm:w-80 lg:w-96 shrink-0 rounded-2xl overflow-hidden border border-subtle dark:border-white/[0.09] shadow-md dark:shadow-[0_12px_36px_rgba(0,0,0,0.6)]">
              <CourseVisual course={course} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. SYLLABUS & CURRICULUM */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Skills Covered */}
        {course.skillsCovered && course.skillsCovered.length > 0 && (
          <div className="craft-card space-y-3 p-5 sm:p-6">
            <span className="text-xs font-semibold text-accent block">
              Verified Competencies Built in this Track
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {course.skillsCovered.map((skill: string) => (
                <span
                  key={skill}
                  className="tag-badge"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Curriculum Accordion */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-bold font-mono tracking-wide text-primary flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              CURRICULUM SYLLABUS & MODULES
            </h2>
            <p className="text-xs text-muted font-sans">
              Each lesson incorporates a 4-step loop: 01 Think (Video) → 02 Design (Notes) → 03 Build (Code Practice) → 04 Ship (Assessment).
            </p>
          </div>

          <div className="space-y-4">
            {course.modules?.map((mod: any, mIdx: number) => {
              const isExpanded = expandedModules[mod._id] !== false;
              return (
                <div
                  key={mod._id}
                  className="rounded-xl craft-card overflow-hidden transition-all duration-200"
                >
                  {/* Module Header */}
                  <div
                    onClick={() => toggleModule(mod._id)}
                    className="p-4 sm:p-5 border-b border-subtle flex items-center justify-between cursor-pointer hover:bg-surface-elevated transition"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-accent block">
                        Module 0{mIdx + 1}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-primary">{mod.title}</h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted">
                        {mod.lessons?.length || 0} Lessons
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted" />
                      )}
                    </div>
                  </div>

                  {/* Lessons List */}
                  {isExpanded && (
                    <div className="divide-y divide-subtle">
                      {mod.lessons?.map((lesson: any, lIdx: number) => {
                        const cleanLessonTitle = (lesson.title || '').replace(/^Lesson\s*\d+[:.\s-]*/i, '');
                        const allActCompleted =
                          lesson.activities?.length > 0 &&
                          lesson.activities.every((a: any) => progress?.completedActivities?.includes(a._id));

                        return (
                          <div key={lesson._id} className="p-4 sm:p-5 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-primary font-semibold px-2 py-0.5 rounded bg-surface-elevated border border-subtle">
                                    Lesson {lIdx + 1}
                                  </span>
                                  {allActCompleted ? (
                                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                                      <CheckCircle2 className="h-3 w-3" />
                                      Completed
                                    </span>
                                  ) : (
                                    <span className="text-xs text-muted">
                                      In progress
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-sm font-bold text-primary pt-0.5">
                                  {cleanLessonTitle}
                                </h4>
                              </div>

                              <Link
                                to={`/courses/${course.slug}/lesson/${lesson._id}`}
                                className="btn btn-secondary text-xs self-start sm:self-auto inline-flex items-center gap-1.5"
                              >
                                <span>{allActCompleted ? 'Review' : 'Open'}</span>
                                <span>↗</span>
                              </Link>
                            </div>

                            {/* 4-Activity Progression Pills */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                              {lesson.activities?.map((act: any, aIdx: number) => {
                                const isCompleted = progress?.completedActivities?.includes(act._id);
                                const getStepLabel = (type: string, stepIndex: number) => {
                                  switch (type) {
                                    case 'VIDEO':
                                      return '01 Video';
                                    case 'NOTES':
                                    case 'ARTICLE':
                                      return '02 Notes';
                                    case 'CODING_CHALLENGE':
                                    case 'PRACTICE':
                                    case 'INTERACTIVE_EXERCISE':
                                    case 'CODE_EXAMPLE':
                                      return '03 Code';
                                    case 'QUIZ':
                                    case 'ASSESSMENT':
                                      return '04 Quiz';
                                    default:
                                      return `0${stepIndex + 1} Step`;
                                  }
                                };

                                return (
                                  <Link
                                    key={act._id}
                                    to={`/courses/${course.slug}/lesson/${lesson._id}?activity=${act._id}`}
                                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition ${
                                      isCompleted
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                        : 'bg-surface-elevated border-subtle text-secondary hover:text-primary hover:border-highlight'
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5 truncate">
                                      {isCompleted ? (
                                        <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                                      ) : (
                                        getActivityIcon(act.type)
                                      )}
                                      <span className="text-xs truncate">
                                        {getStepLabel(act.type, aIdx)}
                                      </span>
                                    </div>
                                    <span className="text-xs shrink-0 ml-1">
                                      {isCompleted ? '✓' : '○'}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* CAPSTONE PROJECT */}
            {course.finalProject && (
              <div className="craft-card space-y-4 p-6 border border-subtle">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-subtle pb-4">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-accent block">
                      Capstone Project
                    </span>
                    <h3 className="text-base sm:text-xl font-bold text-primary">
                      {course.finalProject.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => navigate(`/projects/${course.finalProject.slug}`)}
                    className="btn btn-primary text-xs self-start sm:self-auto inline-flex items-center gap-1.5"
                  >
                    <span>Launch Project</span>
                    <span>↗</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-secondary leading-relaxed font-sans">
                  {course.finalProject.description}
                </p>

                {/* Milestones Preview */}
                {course.finalProject.milestones && (
                  <div className="space-y-2 pt-1 font-mono">
                    <span className="text-[10px] text-muted uppercase tracking-wider block">
                      Milestones
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {course.finalProject.milestones.map((m: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-lg bg-surface-elevated border border-subtle space-y-1"
                        >
                          <div className="flex items-center gap-2 text-xs font-bold text-primary">
                            <span className="text-primary font-mono">M{idx + 1}:</span>
                            <span className="truncate">{m.title}</span>
                          </div>
                          <p className="text-[11px] text-muted line-clamp-2 leading-relaxed font-sans">
                            {m.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
