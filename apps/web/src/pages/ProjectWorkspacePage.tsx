import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AIMentorDrawer } from '../components/AIMentorDrawer';
import {
  FolderKanban,
  CheckCircle2,
  FileCode,
  Sparkles,
  ArrowRight,
  Play,
  Folder,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';

export const ProjectWorkspacePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, refreshUser } = useAuth();
  const { resolvedTheme } = useTheme();

  const [project, setProject] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<string>('server.js');
  const [files, setFiles] = useState<Record<string, string>>({});
  const [activeMilestone, setActiveMilestone] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAIMentorOpen, setIsAIMentorOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionReport, setSubmissionReport] = useState<any>(null);

  useEffect(() => {
    async function loadProject() {
      try {
        const projectData = await apiFetch<any>(`/projects/${slug}`);
        setProject(projectData);

        const initialFiles: Record<string, string> = {};
        if (projectData.starterFiles) {
          projectData.starterFiles.forEach((f: any) => {
            initialFiles[f.path] = f.content || '';
          });
        }
        setFiles(initialFiles);
        if (projectData.starterFiles?.length > 0) {
          setSelectedFile(projectData.starterFiles[0].path);
        }
      } catch (err) {
        console.error('Failed to load project:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [slug]);

  const handleFileContentChange = (val?: string) => {
    if (selectedFile) {
      setFiles((prev) => ({ ...prev, [selectedFile]: val || '' }));
    }
  };

  const handleEvaluateMilestone = async () => {
    setSubmitting(true);
    // Simulate project milestone evaluation
    setTimeout(() => {
      setSubmissionReport({
        milestone: activeMilestone,
        passed: true,
        score: 100,
        testsRun: 4,
        testsPassed: 4,
        feedback: 'All architectural requirements and REST endpoint contracts met successfully!',
      });
      setSubmitting(false);
      refreshUser();
    }, 1200);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-muted font-mono text-xs">
        <Sparkles className="h-4 w-4 animate-spin text-accent mr-2" />
        Initializing multi-file project workspace...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center space-y-3">
        <h2 className="text-xl font-bold text-primary">Project Not Found</h2>
        <Link to="/dashboard" className="btn-primary text-xs inline-flex items-center gap-1.5">
          <span>Return to Dashboard</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  const fileList = Object.keys(files);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden bg-main text-primary relative animate-fade-in">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar: Milestones & File Tree */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-subtle bg-surface flex flex-col shrink-0 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 top-14' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Project Header */}
        <div className="p-4 border-b border-subtle space-y-2">
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-primary transition group"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>‹ DASHBOARD</span>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded text-muted hover:text-primary md:hidden cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div>
            <span className="kicker block">› CAPSTONE ARCHITECTURE</span>
            <h2 className="text-sm font-bold text-primary truncate mt-0.5" title={project.title}>
              {project.title}
            </h2>
          </div>
        </div>

        {/* Milestones Accordion */}
        <div className="p-3 border-b border-subtle space-y-2">
          <span className="kicker block px-1">
            › MILESTONES
          </span>
          <div className="space-y-1">
            {project.milestones?.map((m: any) => {
              const isActive = activeMilestone === m.order;
              return (
                <button
                  key={m._id || m.order}
                  onClick={() => {
                    setActiveMilestone(m.order);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition flex items-center justify-between border cursor-pointer ${
                    isActive
                      ? 'bg-surface-elevated text-primary font-bold border-highlight'
                      : 'text-secondary hover:text-primary hover:bg-surface-elevated border-transparent'
                  }`}
                >
                  <span className="truncate">{m.title}</span>
                  <span className="text-[10px] text-primary font-bold shrink-0 ml-1.5">
                    M{m.order}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Files Tree */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <span className="kicker flex items-center gap-1.5 px-1">
            <Folder className="h-3 w-3" />
            › WORKSPACE FILES
          </span>
          <div className="space-y-1">
            {fileList.map((filePath) => {
              const isSelected = selectedFile === filePath;
              return (
                <button
                  key={filePath}
                  onClick={() => {
                    setSelectedFile(filePath);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition flex items-center gap-2.5 border cursor-pointer ${
                    isSelected
                      ? 'bg-surface-elevated text-primary font-bold border-highlight'
                      : 'text-secondary hover:text-primary hover:bg-surface-elevated border-transparent'
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="truncate">{filePath}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Mentor Trigger */}
        <div className="p-3 border-t border-subtle bg-surface">
          <button
            onClick={() => setIsAIMentorOpen(true)}
            className="btn-pill w-full py-2 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI MENTOR</span>
          </button>
        </div>
      </aside>

      {/* Center & Right Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Workspace Action Bar */}
        <div className="h-14 border-b border-subtle px-4 sm:px-6 flex items-center justify-between bg-main shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg border border-subtle bg-surface text-secondary hover:text-primary md:hidden cursor-pointer"
              aria-label="Open files navigation"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 font-mono text-xs text-secondary">
              <span className="text-muted">FILE:</span>
              <span className="text-primary font-bold px-2 py-0.5 rounded bg-surface-elevated border border-subtle">{selectedFile}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAIMentorOpen(true)}
              className="btn-pill text-xs px-3 py-1 hidden sm:inline-flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI MENTOR</span>
            </button>

            <button
              onClick={handleEvaluateMilestone}
              disabled={submitting}
              className="btn-pill-primary text-xs px-4 py-1.5 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>{submitting ? 'EVALUATING...' : `EVALUATE M${activeMilestone}`}</span>
              <span>↗</span>
            </button>
          </div>
        </div>

        {/* Multi-Pane: Editor + Milestone Spec */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Editor */}
          <div className="flex-1 flex flex-col min-h-[350px] bg-surface-elevated">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme={resolvedTheme === 'dark' ? 'vs-dark' : 'vs'}
              path={selectedFile}
              value={files[selectedFile] || ''}
              onChange={handleFileContentChange}
              options={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                tabSize: 2,
              }}
            />
          </div>

          {/* Milestone Requirements & Output Panel */}
          <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-subtle flex flex-col bg-surface overflow-y-auto p-5 space-y-5 shrink-0">
            <div className="space-y-2">
              <span className="kicker block">
                › MILESTONE {activeMilestone} SPECIFICATION
              </span>
              <h3 className="text-sm font-bold text-primary">
                {project.milestones?.[activeMilestone - 1]?.title}
              </h3>
              <p className="text-xs text-secondary leading-relaxed font-sans">
                {project.milestones?.[activeMilestone - 1]?.description}
              </p>
            </div>

            {/* Skills demonstrated */}
            <div className="space-y-2 font-mono">
              <span className="text-[10px] text-muted uppercase tracking-wider block">
                Skills Tested
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.skillsDemonstrated?.map((s: string) => (
                  <span
                    key={s}
                    className="mono-tag"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Evaluation Report */}
            {submissionReport && (
              <div className="craft-card p-4 border border-emerald-500/30 bg-emerald-500/10 space-y-2 text-xs font-mono animate-fade-in">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Milestone Passed ({submissionReport.score}%)</span>
                </div>
                <p className="text-secondary font-sans">{submissionReport.feedback}</p>
                <div className="text-[11px] text-muted">
                  {submissionReport.testsPassed} of {submissionReport.testsRun} automated tests passed.
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* AI Mentor */}
      <AIMentorDrawer
        isOpen={isAIMentorOpen}
        onClose={() => setIsAIMentorOpen(false)}
        currentContext={{
          courseId: project?.courseId,
          lessonId: project?._id,
          currentCode: files[selectedFile],
          stepName: 'PROJECT',
        }}
      />
    </div>
  );
};
