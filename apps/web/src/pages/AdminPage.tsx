import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { VideoPlayer } from '../components/VideoPlayer';
import { parseYouTubeId, isValidYouTubeUrl } from '@codexa/shared';
import {
  ShieldAlert,
  BookOpen,
  FileCheck,
  Activity,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Layers,
  FileText,
  PlayCircle,
  HelpCircle,
  Code2,
  Trash2,
  ExternalLink,
  Eye,
  Plus,
  X,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Selected Course and Module for Content Authoring
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string>('');
  const [selectedCourseData, setSelectedCourseData] = useState<any>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  // Feedback Messages
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Lesson & Activity Modal States
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDesc, setNewLessonDesc] = useState('');

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [activityType, setActivityType] = useState<string>('VIDEO');
  const [activityTitle, setActivityTitle] = useState('');
  const [activityContent, setActivityContent] = useState('');
  const [activityVideoUrl, setActivityVideoUrl] = useState('');

  // Quiz Builder State inside Activity Modal
  const [quizQuestions, setQuizQuestions] = useState<any[]>([
    {
      question: '',
      type: 'MULTIPLE_CHOICE',
      options: ['', '', '', ''],
      correctOption: 0,
      points: 10,
      explanation: '',
    },
  ]);

  // Challenge Builder State inside Activity Modal
  const [challengeDiff, setChallengeDiff] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('BEGINNER');
  const [challengeStarterCode, setChallengeStarterCode] = useState('function solution() {\n  // Code\n}\nmodule.exports = solution;\n');
  const [challengeTestCases, setChallengeTestCases] = useState<any[]>([
    { input: '[]', expectedOutput: '0', description: 'Base case', hidden: false },
  ]);

  // Resource Creation Modal
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [newResTitle, setNewResTitle] = useState('');
  const [newResProvider, setNewResProvider] = useState('Mozilla Developer Network');
  const [newResUrl, setNewResUrl] = useState('');
  const [newResLicense, setNewResLicense] = useState('CC-BY-SA 2.5');
  const [newResType, setNewResType] = useState('OFFICIAL_DOC');

  // Preview Toggle
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [cData, rData, aData] = await Promise.all([
          apiFetch<any[]>('/courses?includeDrafts=true').catch(() => []),
          apiFetch<any[]>('/resources/admin').catch(() => []),
          apiFetch<any>('/analytics/admin/summary').catch(() => null),
        ]);
        setCourses(cData || []);
        setResources(rData || []);
        setAnalytics(aData);

        if (cData && cData.length > 0) {
          setSelectedCourseSlug(cData[0].slug);
        }
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  // Fetch Full Course Hierarchy on course change
  useEffect(() => {
    if (!selectedCourseSlug) return;
    async function loadFullCourse() {
      try {
        const course = await apiFetch<any>(`/courses/${selectedCourseSlug}`);
        setSelectedCourseData(course);
        if (course?.modules?.length > 0) {
          setSelectedModuleId(course.modules[0]._id);
          if (course.modules[0].lessons?.length > 0) {
            setSelectedLesson(course.modules[0].lessons[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load full course tree:', err);
      }
    }
    loadFullCourse();
  }, [selectedCourseSlug]);

  if (user?.role !== 'ADMIN') {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center space-y-2">
        <h2 className="text-xl font-bold text-danger">Access Denied</h2>
        <p className="text-xs text-muted">
          Administrator privileges required to access this portal.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-muted font-mono text-xs">
        Loading admin console...
      </div>
    );
  }

  // --- HANDLERS ---

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModuleId || !newLessonTitle.trim()) return;

    try {
      await apiFetch(`/courses/modules/${selectedModuleId}/lessons`, {
        method: 'POST',
        body: JSON.stringify({
          title: newLessonTitle,
          description: newLessonDesc,
        }),
      });

      const updated = await apiFetch<any>(`/courses/${selectedCourseSlug}`);
      setSelectedCourseData(updated);
      setIsLessonModalOpen(false);
      setNewLessonTitle('');
      setNewLessonDesc('');
      setStatusMessage({ type: 'success', text: 'Lesson created successfully.' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Error creating lesson: ${err.message}` });
    }
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLesson?._id || !activityTitle.trim()) return;

    try {
      const payload: any = {
        type: activityType,
        title: activityTitle,
        content: activityContent,
      };

      if (activityType === 'VIDEO') {
        payload.videoUrl = activityVideoUrl;
      } else if (activityType === 'QUIZ') {
        payload.assessmentData = {
          title: activityTitle,
          passingScore: 70,
          questions: quizQuestions,
        };
      } else if (activityType === 'CODING_CHALLENGE') {
        payload.challengeData = {
          title: activityTitle,
          difficulty: challengeDiff,
          starterCode: challengeStarterCode,
          testCases: challengeTestCases,
        };
      }

      await apiFetch(`/courses/lessons/${selectedLesson._id}/activities`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const updated = await apiFetch<any>(`/courses/${selectedCourseSlug}`);
      setSelectedCourseData(updated);
      const activeMod = updated.modules.find((m: any) => m._id === selectedModuleId);
      const activeLess = activeMod?.lessons.find((l: any) => l._id === selectedLesson._id);
      if (activeLess) setSelectedLesson(activeLess);

      setIsActivityModalOpen(false);
      setActivityTitle('');
      setActivityContent('');
      setActivityVideoUrl('');
      setStatusMessage({ type: 'success', text: 'Activity added successfully.' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Error creating activity: ${err.message}` });
    }
  };

  const handleDeleteActivity = async (actId: string) => {
    try {
      await apiFetch(`/courses/activities/${actId}`, { method: 'DELETE' });
      const updated = await apiFetch<any>(`/courses/${selectedCourseSlug}`);
      setSelectedCourseData(updated);
      const activeMod = updated.modules.find((m: any) => m._id === selectedModuleId);
      const activeLess = activeMod?.lessons.find((l: any) => l._id === selectedLesson._id);
      if (activeLess) setSelectedLesson(activeLess);
      setStatusMessage({ type: 'success', text: 'Activity removed.' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Error deleting activity: ${err.message}` });
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch<any>('/resources', {
        method: 'POST',
        body: JSON.stringify({
          title: newResTitle,
          provider: newResProvider,
          canonicalUrl: newResUrl,
          license: newResLicense,
          type: newResType,
        }),
      });

      setResources((prev) => [res, ...prev]);
      setIsResourceModalOpen(false);
      setNewResTitle('');
      setNewResUrl('');
      setStatusMessage({ type: 'success', text: 'Official resource registered and verified.' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Error registering resource: ${err.message}` });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-subtle pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-amber-500 mb-2 inline-flex items-center gap-1.5 text-xs font-semibold">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Administrator Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            Curriculum Authoring & Lesson Studio
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsResourceModalOpen(true)}
            className="btn btn-primary text-xs inline-flex items-center gap-1.5 px-4 py-2 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Verify Resource</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between animate-fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="p-1 hover:opacity-75 cursor-pointer">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="craft-card p-6 space-y-2">
          <div className="flex items-center justify-between text-muted text-xs font-medium">
            <span>Total Curricula</span>
            <BookOpen className="h-4 w-4 text-accent" />
          </div>
          <div className="text-2xl font-extrabold text-primary">{courses.length}</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> All active & published
          </div>
        </div>

        <div className="craft-card p-6 space-y-2">
          <div className="flex items-center justify-between text-muted text-xs font-medium">
            <span>Verified Resources</span>
            <FileCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-primary">{resources.length}</div>
          <div className="text-xs text-muted">
            Open-license & embedded verified
          </div>
        </div>

        <div className="craft-card p-6 space-y-2">
          <div className="flex items-center justify-between text-muted text-xs font-medium">
            <span>Telemetry Events</span>
            <Activity className="h-4 w-4 text-accent" />
          </div>
          <div className="text-2xl font-extrabold text-primary">
            {analytics?.totalEvents || 0}
          </div>
          <div className="text-xs text-muted">Telemetry active</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COURSE & LESSON AUTHORING WORKBENCH */}
      {/* ========================================================================= */}
      <div className="craft-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-subtle pb-4">
          <div>
            <span className="text-xs font-semibold text-accent block">Curriculum Workbench</span>
            <h2 className="text-base font-bold text-primary flex items-center gap-2">
              <Layers className="h-4 w-4 text-accent" />
              Lesson Content Authoring Studio
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Configure video streams, editorial notes, interactive code sandboxes, and verification quizzes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedCourseSlug}
              onChange={(e) => setSelectedCourseSlug(e.target.value)}
              className="bg-surface-elevated border border-subtle rounded-lg px-3 py-1.5 text-xs text-primary focus:outline-none focus:border-accent"
            >
              {courses.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tree Layout: Modules & Lessons -> Lesson Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Modules & Lessons Navigator */}
          <div className="lg:col-span-4 border border-subtle rounded-xl bg-surface-elevated/20 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-accent block">
                Curriculum Hierarchy
              </span>
              <button
                onClick={() => setIsLessonModalOpen(true)}
                disabled={!selectedModuleId}
                className="inline-flex items-center gap-1 text-xs text-accent hover:underline font-bold disabled:opacity-50 cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add Lesson</span>
              </button>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {selectedCourseData?.modules?.map((mod: any) => (
                <div key={mod._id} className="space-y-1.5">
                  <div
                    onClick={() => setSelectedModuleId(mod._id)}
                    className={`p-2.5 rounded-lg text-xs font-bold cursor-pointer flex items-center justify-between border transition ${
                      selectedModuleId === mod._id
                        ? 'bg-accent/10 text-accent border-accent/40 font-mono'
                        : 'text-secondary hover:bg-surface-elevated border-transparent'
                    }`}
                  >
                    <span className="truncate">{mod.title}</span>
                    <span className="text-[10px] font-mono text-muted">
                      {mod.lessons?.length || 0} lessons
                    </span>
                  </div>

                  <div className="pl-3 space-y-1 border-l border-subtle ml-2">
                    {mod.lessons?.map((les: any) => (
                      <button
                        key={les._id}
                        onClick={() => setSelectedLesson(les)}
                        className={`w-full text-left p-2 rounded-lg text-xs transition flex items-center justify-between border cursor-pointer ${
                          selectedLesson?._id === les._id
                            ? 'bg-surface-elevated text-primary font-bold border-subtle'
                            : 'text-muted hover:text-primary hover:bg-surface-elevated/50 border-transparent'
                        }`}
                      >
                        <span className="truncate">{les.title}</span>
                        <span className="tag-badge text-xs py-0 px-1.5">
                          {les.activities?.length || 0} acts
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Selected Lesson Activities Editor */}
          <div className="lg:col-span-8 border border-subtle rounded-xl bg-surface-elevated/20 p-5 space-y-6">
            {selectedLesson ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-subtle pb-4">
                  <div>
                    <span className="text-xs font-semibold text-accent block">
                      Active Lesson
                    </span>
                    <h3 className="text-base font-bold text-primary mt-0.5">
                      {selectedLesson.title}
                    </h3>
                    <p className="text-xs text-muted">{selectedLesson.description}</p>
                  </div>

                  <button
                    onClick={() => setIsActivityModalOpen(true)}
                    className="btn btn-primary text-xs px-3.5 py-2 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Material</span>
                  </button>
                </div>

                {/* Activities List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">
                    Pipeline Sequence ({selectedLesson.activities?.length || 0})
                  </h4>

                  {selectedLesson.activities?.length === 0 ? (
                    <div className="p-8 text-center text-muted text-xs border border-dashed border-subtle rounded-xl bg-surface">
                      No activities configured yet. Click "Add Material" above to add video, notes, or assessments.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {selectedLesson.activities?.map((act: any, idx: number) => (
                        <div
                          key={act._id || idx}
                          className="craft-card p-4 flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1.5 overflow-hidden">
                            <div className="flex items-center gap-2">
                              <span className="tag-badge text-xs">
                                {act.type}
                              </span>
                              <span className="text-xs font-bold text-primary truncate">
                                {act.title}
                              </span>
                            </div>

                            {act.type === 'VIDEO' && act.resourceRef && (
                              <div className="text-xs text-muted flex items-center gap-1">
                                <PlayCircle className="h-3.5 w-3.5 text-accent" />
                                <span>YouTube ID: {act.resourceRef.externalId || 'Auto-parsed'}</span>
                              </div>
                            )}

                            {act.type === 'NOTES' && (
                              <div className="text-xs text-muted flex items-center gap-1">
                                <FileText className="h-3.5 w-3.5 text-accent" />
                                <span>Markdown notes attached</span>
                              </div>
                            )}

                            {act.type === 'QUIZ' && (
                              <div className="text-xs text-muted flex items-center gap-1">
                                <HelpCircle className="h-3.5 w-3.5 text-accent" />
                                <span>{act.assessmentData?.questions?.length || 0} questions configured</span>
                              </div>
                            )}

                            {act.type === 'CODING_CHALLENGE' && (
                              <div className="text-xs text-muted flex items-center gap-1">
                                <Code2 className="h-3.5 w-3.5 text-accent" />
                                <span>Difficulty: {act.challengeData?.difficulty || 'Beginner'}</span>
                              </div>
                            )}

                            {act.content && (
                              <p className="text-xs text-muted line-clamp-2">
                                {act.content}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleDeleteActivity(act._id)}
                              className="p-1.5 rounded-lg text-muted hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition cursor-pointer"
                              title="Delete Activity"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-muted text-xs">
                Select a lesson on the left to view and author its activities.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RESOURCE OWNERSHIP & VERIFICATION TABLE */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-accent block">Regulatory & Licensing Audit</span>
            <h2 className="text-base font-bold text-primary flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-accent" />
              External Content Ownership & Licensing Verification
            </h2>
          </div>
          <span className="text-xs text-muted">
            Audited against platform rights rules
          </span>
        </div>

        <div className="craft-card rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs text-secondary">
            <thead className="bg-surface-elevated/60 border-b border-subtle text-muted uppercase text-xs font-semibold">
              <tr>
                <th className="p-4">Title / Resource</th>
                <th className="p-4">Type</th>
                <th className="p-4">Provider</th>
                <th className="p-4">Ownership Class</th>
                <th className="p-4">License</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subtle">
              {resources.map((res) => (
                <tr key={res._id} className="hover:bg-surface-elevated/40 transition">
                  <td className="p-4 font-bold text-primary">
                    <div className="flex items-center gap-1.5">
                      <span>{res.title}</span>
                      {res.canonicalUrl && (
                        <a
                          href={res.canonicalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          <ExternalLink className="h-3 w-3 inline ml-1" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-muted">{res.type || 'OFFICIAL_DOC'}</td>
                  <td className="p-4 text-secondary">{res.provider}</td>
                  <td className="p-4">
                    <span className="tag-badge">
                      {res.ownershipClass}
                    </span>
                  </td>
                  <td className="p-4 text-secondary">{res.license}</td>
                  <td className="p-4">
                    <span className="tag-badge text-emerald-400 border-emerald-500/30 inline-flex items-center gap-1 py-0.5 px-2">
                      <CheckCircle2 className="h-3 w-3" />
                      {res.verificationStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CREATE LESSON */}
      {/* ========================================================================= */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="craft-card w-full max-w-md p-6 space-y-5 shadow-2xl rounded-2xl">
            <div className="flex items-center justify-between border-b border-subtle pb-3">
              <div>
                <span className="text-xs font-semibold text-accent block">New Unit</span>
                <h3 className="text-base font-bold text-primary">Create New Lesson</h3>
              </div>
              <button
                onClick={() => setIsLessonModalOpen(false)}
                className="p-1 rounded-lg text-muted hover:text-primary bg-surface hover:bg-surface-elevated border border-subtle cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  required
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  placeholder="e.g. Asynchronous JavaScript & Promises"
                  className="w-full bg-surface-elevated border border-subtle rounded-lg px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newLessonDesc}
                  onChange={(e) => setNewLessonDesc(e.target.value)}
                  placeholder="Brief summary of learning objectives"
                  className="w-full bg-surface-elevated border border-subtle rounded-lg px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLessonModalOpen(false)}
                  className="btn btn-secondary text-xs px-3 py-1.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs px-4 py-1.5 cursor-pointer"
                >
                  Create Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE ACTIVITY */}
      {/* ========================================================================= */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="craft-card w-full max-w-2xl p-6 space-y-5 shadow-2xl rounded-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-subtle pb-3">
              <div>
                <span className="text-xs font-semibold text-accent block">Lesson Pipeline</span>
                <h3 className="text-base font-bold text-primary">Add Lesson Material / Activity</h3>
                <p className="text-xs text-muted">Lesson: {selectedLesson?.title}</p>
              </div>
              <button
                onClick={() => setIsActivityModalOpen(false)}
                className="p-1 rounded-lg text-muted hover:text-primary bg-surface hover:bg-surface-elevated border border-subtle cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-4">
              {/* Activity Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-secondary mb-1.5">
                  Pipeline Stage
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { type: 'VIDEO', label: '01 Think (Vid)', icon: PlayCircle },
                    { type: 'NOTES', label: '02 Design (Note)', icon: FileText },
                    { type: 'CODING_CHALLENGE', label: '03 Build (Code)', icon: Code2 },
                    { type: 'QUIZ', label: '04 Ship (Quiz)', icon: HelpCircle },
                  ].map((t) => {
                    const IconComponent = t.icon;
                    return (
                      <button
                        key={t.type}
                        type="button"
                        onClick={() => setActivityType(t.type)}
                        className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 transition cursor-pointer ${
                          activityType === t.type
                            ? 'bg-accent/15 border-accent text-accent font-bold'
                            : 'bg-surface-elevated/40 border-subtle text-muted hover:text-primary'
                        }`}
                      >
                        <IconComponent className="h-4 w-4 shrink-0" />
                        <span className="truncate">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  Activity Title *
                </label>
                <input
                  type="text"
                  required
                  value={activityTitle}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  placeholder="e.g. Master Asynchronous Workflows with Promises"
                  className="w-full bg-surface-elevated border border-subtle rounded-lg px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent"
                />
              </div>

              {/* VIDEO SPECIFIC FIELDS */}
              {activityType === 'VIDEO' && (
                <div className="space-y-3 p-4 rounded-xl border border-subtle bg-surface-elevated/20">
                  <div>
                    <label className="block text-xs font-semibold text-secondary mb-1">
                      YouTube URL or 11-Char Video ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={activityVideoUrl}
                      onChange={(e) => setActivityVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      className="w-full bg-surface-elevated border border-subtle rounded-lg px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent"
                    />
                  </div>

                  {isValidYouTubeUrl(activityVideoUrl) ? (
                    <div className="space-y-2">
                      <div className="text-xs text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Valid YouTube stream detected (ID: {parseYouTubeId(activityVideoUrl)})
                      </div>
                      <div className="max-w-xs rounded-xl overflow-hidden border border-subtle">
                        <VideoPlayer url={activityVideoUrl} title={activityTitle || 'Preview'} />
                      </div>
                    </div>
                  ) : activityVideoUrl.trim() !== '' ? (
                    <div className="text-xs text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Invalid YouTube URL format
                    </div>
                  ) : null}
                </div>
              )}

              {/* NOTES / ARTICLE / GENERAL MARKDOWN FIELDS */}
              {(activityType === 'NOTES' || activityType === 'VIDEO') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-secondary">
                      {activityType === 'VIDEO' ? 'Accompanying Notes (Markdown)' : 'Lesson Notes (Markdown) *'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
                      className="text-xs text-accent hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="h-3 w-3" />
                      {showMarkdownPreview ? 'Edit Raw' : 'Preview Formatted'}
                    </button>
                  </div>

                  {showMarkdownPreview ? (
                    <div className="p-4 rounded-xl border border-subtle bg-surface min-h-[160px] max-h-[300px] overflow-y-auto reading-surface">
                      <MarkdownRenderer content={activityContent || '*No content entered yet*'} />
                    </div>
                  ) : (
                    <textarea
                      rows={6}
                      value={activityContent}
                      onChange={(e) => setActivityContent(e.target.value)}
                      placeholder="# Heading&#10;&#10;Explanation of core concepts...&#10;&#10;```javascript&#10;const example = true;&#10;```"
                      className="w-full bg-surface-elevated border border-subtle rounded-lg px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent"
                    />
                  )}
                </div>
              )}

              {/* QUIZ BUILDER FIELDS */}
              {activityType === 'QUIZ' && (
                <div className="space-y-3 p-4 rounded-xl border border-subtle bg-surface-elevated/20">
                  <span className="text-xs font-semibold text-accent block">
                    Quiz Questions (Passing threshold: 70%)
                  </span>
                  {quizQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-2 p-3 rounded-lg bg-surface border border-subtle">
                      <input
                        type="text"
                        placeholder={`Question ${qIdx + 1}`}
                        value={q.question}
                        onChange={(e) => {
                          const updated = [...quizQuestions];
                          updated[qIdx].question = e.target.value;
                          setQuizQuestions(updated);
                        }}
                        className="w-full bg-surface-elevated border border-subtle rounded px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:border-accent"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt: string, optIdx: number) => (
                          <input
                            key={optIdx}
                            type="text"
                            placeholder={`Option ${optIdx + 1}`}
                            value={opt}
                            onChange={(e) => {
                              const updated = [...quizQuestions];
                              updated[qIdx].options[optIdx] = e.target.value;
                              setQuizQuestions(updated);
                            }}
                            className="w-full bg-surface-elevated border border-subtle rounded px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:border-accent"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* CHALLENGE BUILDER FIELDS */}
              {activityType === 'CODING_CHALLENGE' && (
                <div className="space-y-3 p-4 rounded-xl border border-subtle bg-surface-elevated/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-accent block">Difficulty Rating</span>
                    <select
                      value={challengeDiff}
                      onChange={(e: any) => setChallengeDiff(e.target.value)}
                      className="bg-surface-elevated border border-subtle rounded px-2.5 py-1 text-xs text-primary focus:outline-none focus:border-accent"
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-secondary mb-1">Starter Code</label>
                    <textarea
                      rows={4}
                      value={challengeStarterCode}
                      onChange={(e) => setChallengeStarterCode(e.target.value)}
                      className="w-full bg-surface-elevated border border-subtle rounded-lg px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent code-frame"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-subtle">
                <button
                  type="button"
                  onClick={() => setIsActivityModalOpen(false)}
                  className="btn btn-secondary text-xs px-3 py-1.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs px-4 py-1.5 cursor-pointer"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VERIFY EXTERNAL RESOURCE */}
      {/* ========================================================================= */}
      {isResourceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="craft-card w-full max-w-md p-6 space-y-5 shadow-2xl rounded-2xl">
            <div className="flex items-center justify-between border-b border-subtle pb-3">
              <div>
                <span className="text-xs font-semibold text-accent block">Official Docs</span>
                <h3 className="text-base font-bold text-primary">Register & Verify Resource</h3>
              </div>
              <button
                onClick={() => setIsResourceModalOpen(false)}
                className="p-1 rounded-lg text-muted hover:text-primary bg-surface hover:bg-surface-elevated border border-subtle cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  value={newResTitle}
                  onChange={(e) => setNewResTitle(e.target.value)}
                  placeholder="e.g. MDN Web Docs: Promises"
                  className="w-full bg-surface-elevated border border-subtle rounded-lg px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  Provider *
                </label>
                <input
                  type="text"
                  required
                  value={newResProvider}
                  onChange={(e) => setNewResProvider(e.target.value)}
                  placeholder="e.g. Mozilla Developer Network or React Docs"
                  className="w-full bg-surface-elevated border border-subtle rounded-lg px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  Canonical URL *
                </label>
                <input
                  type="url"
                  required
                  value={newResUrl}
                  onChange={(e) => setNewResUrl(e.target.value)}
                  placeholder="https://developer.mozilla.org/..."
                  className="w-full bg-surface-elevated border border-subtle rounded-lg px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  License
                </label>
                <input
                  type="text"
                  value={newResLicense}
                  onChange={(e) => setNewResLicense(e.target.value)}
                  placeholder="CC-BY-SA 2.5 or MIT"
                  className="w-full bg-surface-elevated border border-subtle rounded-lg px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResourceModalOpen(false)}
                  className="btn btn-secondary text-xs px-3 py-1.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs px-4 py-1.5 cursor-pointer"
                >
                  Register & Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
