import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AIMentorDrawer } from '../components/AIMentorDrawer';
import { FileExplorer } from '../components/ide/FileExplorer';
import { EditorTabs } from '../components/ide/EditorTabs';
import { IntegratedTerminal } from '../components/ide/IntegratedTerminal';
import { WebPreview } from '../components/ide/WebPreview';
import { TestRunnerPanel } from '../components/ide/TestRunnerPanel';
import {
  ProjectWorkspaceDTO,
  ProjectFile,
  ProjectRunResponse,
  ProjectSubmissionResponse,
  TerminalExecResponse,
} from '@codexa/shared';
import {
  Play,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Menu,
  X,
  Save,
  RotateCcw,
  Globe,
  Terminal,
  FileCheck2,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface TerminalLine {
  type: 'stdin' | 'stdout' | 'stderr' | 'system';
  text: string;
  timestamp: string;
}

function getLanguageForFile(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js':
    case 'jsx':
    case 'mjs':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'py':
      return 'python';
    case 'json':
      return 'json';
    case 'css':
    case 'scss':
      return 'css';
    case 'html':
      return 'html';
    case 'md':
      return 'markdown';
    case 'sh':
    case 'bash':
      return 'shell';
    default:
      return 'javascript';
  }
}

export const ProjectWorkspacePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, refreshUser } = useAuth();
  const { resolvedTheme } = useTheme();

  const [workspace, setWorkspace] = useState<ProjectWorkspaceDTO | null>(null);
  const [files, setFiles] = useState<Record<string, string>>({});
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('server.js');
  const [dirtyFiles, setDirtyFiles] = useState<Set<string>>(new Set());
  const [activeMilestone, setActiveMilestone] = useState<number>(1);
  const [rightPanelTab, setRightPanelTab] = useState<'specs' | 'tests' | 'preview'>('specs');

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionReport, setSubmissionReport] = useState<ProjectSubmissionResponse | null>(null);

  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAIMentorOpen, setIsAIMentorOpen] = useState(false);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Load user workspace from backend
  useEffect(() => {
    async function loadWorkspace() {
      if (!slug) return;
      try {
        setLoading(true);
        const ws = await apiFetch<ProjectWorkspaceDTO>(`/projects/${slug}/workspace`);
        setWorkspace(ws);

        const fileMap: Record<string, string> = {};
        ws.files.forEach((f) => {
          fileMap[f.path] = f.content || '';
        });
        setFiles(fileMap);

        const activePath = ws.activeFilePath || ws.files[0]?.path || 'server.js';
        setSelectedFile(activePath);
        setOpenFiles(ws.openFiles?.length > 0 ? ws.openFiles : [activePath]);
        setActiveMilestone(ws.activeMilestone || 1);
        if (ws.lastSavedAt) {
          setLastSavedTime(new Date(ws.lastSavedAt));
        }

        // Add welcome message to terminal
        setTerminalLines([
          {
            type: 'system',
            text: `Connected to Codexa isolated sandbox [${ws.title || ws.slug}]. Ready for execution.`,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      } catch (err: any) {
        console.error('Failed to load project workspace:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWorkspace();
  }, [slug]);

  // Convert files map to array format for backend APIs
  const getProjectFilesArray = useCallback((): ProjectFile[] => {
    return Object.entries(files).map(([path, content]) => ({
      path,
      content,
    }));
  }, [files]);

  // 2. Save workspace handler
  const handleSaveWorkspace = useCallback(async () => {
    if (!slug) return;
    setIsSaving(true);
    try {
      const payloadFiles = getProjectFilesArray();
      const updated = await apiFetch<ProjectWorkspaceDTO>(`/projects/${slug}/workspace`, {
        method: 'PUT',
        body: JSON.stringify({
          files: payloadFiles,
          activeMilestone,
          activeFilePath: selectedFile,
          openFiles,
        }),
      });
      setDirtyFiles(new Set());
      setLastSavedTime(new Date());
      setWorkspace(updated);
    } catch (err) {
      console.error('Failed to save workspace:', err);
    } finally {
      setIsSaving(false);
    }
  }, [slug, getProjectFilesArray, activeMilestone, selectedFile, openFiles]);

  // Debounced auto-save
  const triggerAutoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      handleSaveWorkspace();
    }, 2500);
  }, [handleSaveWorkspace]);

  // Handle editor code change
  const handleFileContentChange = (newVal?: string) => {
    if (!selectedFile) return;
    const val = newVal || '';
    setFiles((prev) => ({ ...prev, [selectedFile]: val }));
    setDirtyFiles((prev) => new Set(prev).add(selectedFile));
    triggerAutoSave();
  };

  // Switch active file
  const handleSelectFile = (filePath: string) => {
    setSelectedFile(filePath);
    setOpenFiles((prev) => (prev.includes(filePath) ? prev : [...prev, filePath]));
  };

  // Close tab
  const handleCloseTab = (filePath: string) => {
    setOpenFiles((prev) => {
      const filtered = prev.filter((p) => p !== filePath);
      if (selectedFile === filePath) {
        setSelectedFile(filtered[0] || '');
      }
      return filtered;
    });
  };

  // Create file
  const handleCreateFile = (filePath: string) => {
    const clean = filePath.replace(/^\/+/, '').trim();
    if (!clean) return;
    setFiles((prev) => ({ ...prev, [clean]: '' }));
    setSelectedFile(clean);
    setOpenFiles((prev) => (prev.includes(clean) ? prev : [...prev, clean]));
    setDirtyFiles((prev) => new Set(prev).add(clean));
    triggerAutoSave();
  };

  // Create folder placeholder
  const handleCreateFolder = (folderPath: string) => {
    const clean = folderPath.replace(/^\/+/, '').trim();
    if (!clean) return;
    const placeholder = `${clean}/.keep`;
    setFiles((prev) => ({ ...prev, [placeholder]: '' }));
    triggerAutoSave();
  };

  // Delete file
  const handleDeleteFile = (filePath: string) => {
    setFiles((prev) => {
      const next = { ...prev };
      delete next[filePath];
      return next;
    });
    setOpenFiles((prev) => prev.filter((p) => p !== filePath));
    if (selectedFile === filePath) {
      const remaining = Object.keys(files).filter((k) => k !== filePath);
      setSelectedFile(remaining[0] || '');
    }
    triggerAutoSave();
  };

  // Rename file
  const handleRenameFile = (oldPath: string, newPath: string) => {
    const clean = newPath.replace(/^\/+/, '').trim();
    if (!clean || clean === oldPath) return;

    setFiles((prev) => {
      const content = prev[oldPath] || '';
      const next = { ...prev };
      delete next[oldPath];
      next[clean] = content;
      return next;
    });

    setOpenFiles((prev) => prev.map((p) => (p === oldPath ? clean : p)));
    if (selectedFile === oldPath) {
      setSelectedFile(clean);
    }
    triggerAutoSave();
  };

  // 3. Run multi-file project in sandbox
  const handleRunProject = async () => {
    if (!slug || isRunning) return;
    setIsRunning(true);
    setIsTerminalCollapsed(false);

    const timeStr = new Date().toLocaleTimeString();
    setTerminalLines((prev) => [
      ...prev,
      { type: 'stdin', text: `run ${workspace?.entryFile || 'server.js'}`, timestamp: timeStr },
    ]);

    try {
      const payloadFiles = getProjectFilesArray();
      const res = await apiFetch<ProjectRunResponse>(`/projects/${slug}/run`, {
        method: 'POST',
        body: JSON.stringify({
          files: payloadFiles,
          entryFile: workspace?.entryFile || 'server.js',
          language: workspace?.language || 'javascript',
          command: workspace?.runCommand,
        }),
      });

      if (res.stdout) {
        setTerminalLines((prev) => [
          ...prev,
          { type: 'stdout', text: res.stdout, timestamp: new Date().toLocaleTimeString() },
        ]);
      }
      if (res.stderr) {
        setTerminalLines((prev) => [
          ...prev,
          { type: 'stderr', text: res.stderr, timestamp: new Date().toLocaleTimeString() },
        ]);
      }
      setTerminalLines((prev) => [
        ...prev,
        {
          type: 'system',
          text: `Process exited with code ${res.exitCode} (${res.executionTimeMs}ms)`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err: any) {
      setTerminalLines((prev) => [
        ...prev,
        { type: 'stderr', text: `Execution Error: ${err.message}`, timestamp: new Date().toLocaleTimeString() },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  // 4. Submit milestone evaluation against hidden test harness
  const handleSubmitMilestone = async () => {
    if (!slug || isSubmitting) return;
    setIsSubmitting(true);
    setRightPanelTab('tests');

    const timeStr = new Date().toLocaleTimeString();
    setTerminalLines((prev) => [
      ...prev,
      { type: 'stdin', text: `submit milestone ${activeMilestone}`, timestamp: timeStr },
    ]);

    try {
      const payloadFiles = getProjectFilesArray();
      const res = await apiFetch<ProjectSubmissionResponse>(`/projects/${slug}/submit`, {
        method: 'POST',
        body: JSON.stringify({
          milestoneOrder: activeMilestone,
          files: payloadFiles,
        }),
      });

      setSubmissionReport(res);

      if (res.stdout) {
        setTerminalLines((prev) => [
          ...prev,
          { type: 'stdout', text: res.stdout, timestamp: new Date().toLocaleTimeString() },
        ]);
      }
      if (res.stderr) {
        setTerminalLines((prev) => [
          ...prev,
          { type: 'stderr', text: res.stderr, timestamp: new Date().toLocaleTimeString() },
        ]);
      }

      setTerminalLines((prev) => [
        ...prev,
        {
          type: 'system',
          text: `Milestone ${activeMilestone} evaluation: ${res.passedCount}/${res.totalCount} tests passed (${res.score}% score). ${
            res.passed ? `+${res.xpAwarded} XP Awarded!` : ''
          }`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      if (res.passed) {
        refreshUser();
      }
    } catch (err: any) {
      setTerminalLines((prev) => [
        ...prev,
        { type: 'stderr', text: `Submission Error: ${err.message}`, timestamp: new Date().toLocaleTimeString() },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Interactive terminal command execution
  const handleExecuteTerminal = async (command: string) => {
    const clean = command.trim();
    if (!clean) return;

    if (clean === 'clear' || clean === 'cls') {
      setTerminalLines([]);
      return;
    }

    const timeStr = new Date().toLocaleTimeString();
    setTerminalLines((prev) => [
      ...prev,
      { type: 'stdin', text: clean, timestamp: timeStr },
    ]);

    setIsRunning(true);
    try {
      const payloadFiles = getProjectFilesArray();
      const res = await apiFetch<TerminalExecResponse>(`/projects/${slug}/terminal`, {
        method: 'POST',
        body: JSON.stringify({
          command: clean,
          files: payloadFiles,
          language: workspace?.language || 'javascript',
        }),
      });

      if (res.updatedFiles && Array.isArray(res.updatedFiles) && res.updatedFiles.length > 0) {
        const fileMap: Record<string, string> = {};
        res.updatedFiles.forEach((f) => {
          fileMap[f.path] = f.content || '';
        });
        setFiles(fileMap);
      }

      if (res.stdout) {
        setTerminalLines((prev) => [
          ...prev,
          { type: 'stdout', text: res.stdout, timestamp: new Date().toLocaleTimeString() },
        ]);
      }
      if (res.stderr) {
        setTerminalLines((prev) => [
          ...prev,
          { type: 'stderr', text: res.stderr, timestamp: new Date().toLocaleTimeString() },
        ]);
      }
      setTerminalLines((prev) => [
        ...prev,
        {
          type: 'system',
          text: `Command exited with code ${res.exitCode} (${res.durationMs}ms)`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err: any) {
      setTerminalLines((prev) => [
        ...prev,
        { type: 'stderr', text: `Terminal Error: ${err.message}`, timestamp: new Date().toLocaleTimeString() },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  // 6. Reset workspace
  const handleResetWorkspace = async () => {
    if (!confirm('Are you sure you want to reset the workspace? All local changes will be replaced with the starter template.')) {
      return;
    }
    try {
      setLoading(true);
      const ws = await apiFetch<ProjectWorkspaceDTO>(`/projects/${slug}/reset`, { method: 'POST' });
      setWorkspace(ws);
      const fileMap: Record<string, string> = {};
      ws.files.forEach((f) => {
        fileMap[f.path] = f.content || '';
      });
      setFiles(fileMap);
      setSelectedFile(ws.activeFilePath || 'server.js');
      setOpenFiles(ws.openFiles || ['server.js']);
      setDirtyFiles(new Set());
    } catch (err) {
      console.error('Failed to reset workspace:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-muted font-mono text-xs">
        <Sparkles className="h-4 w-4 animate-spin text-accent mr-2" />
        Mounting sandbox filesystem & loading project IDE...
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center space-y-3">
        <h2 className="text-xl font-bold text-primary">Project Workspace Not Found</h2>
        <Link to="/dashboard" className="btn-primary text-xs inline-flex items-center gap-1.5">
          <span>Return to Dashboard</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  const activeMilestoneSpec = workspace.milestones?.find((m) => m.order === activeMilestone);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-main text-primary relative animate-fade-in font-sans select-none">
      {/* Top IDE Toolbar */}
      <header className="h-12 border-b border-subtle bg-surface px-4 flex items-center justify-between shrink-0 select-none z-30">
        {/* Left Section: Back, Title, Milestone selector */}
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-primary transition group pr-2 border-r border-subtle"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 rounded-lg border border-subtle bg-surface-elevated text-secondary hover:text-primary md:hidden cursor-pointer"
            aria-label="Toggle Files Explorer"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            <h1 className="text-xs sm:text-sm font-bold text-primary truncate max-w-[180px] sm:max-w-[280px]">
              {workspace.title}
            </h1>

            {/* Milestone Badge Dropdown / Pills */}
            <div className="hidden lg:flex items-center gap-1 ml-2">
              {workspace.milestones?.map((m) => (
                <button
                  key={m.order}
                  onClick={() => setActiveMilestone(m.order)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition cursor-pointer ${
                    activeMilestone === m.order
                      ? 'bg-accent text-accent-contrast font-bold'
                      : 'bg-surface-elevated text-secondary hover:text-primary'
                  }`}
                  title={m.title}
                >
                  M{m.order}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: Actions (Run, Submit, Preview, Save, AI Mentor) */}
        <div className="flex items-center gap-2">
          {/* Save Status */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-muted font-mono pr-2">
            {isSaving ? (
              <span className="text-amber-400 animate-pulse">Saving...</span>
            ) : dirtyFiles.size > 0 ? (
              <span className="text-amber-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Unsaved ({dirtyFiles.size})
              </span>
            ) : (
              <span className="text-secondary">Saved</span>
            )}
          </div>

          <button
            onClick={handleSaveWorkspace}
            disabled={isSaving}
            className="p-1.5 rounded-lg border border-subtle bg-surface-elevated text-secondary hover:text-primary transition cursor-pointer"
            title="Save Project (Ctrl+S)"
          >
            <Save className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={handleResetWorkspace}
            className="p-1.5 rounded-lg border border-subtle bg-surface-elevated text-secondary hover:text-rose-400 transition cursor-pointer"
            title="Reset to Starter Template"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {/* AI Mentor */}
          <button
            onClick={() => setIsAIMentorOpen(true)}
            className="btn btn-secondary text-xs px-3 py-1.5 hidden md:inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>AI Mentor</span>
          </button>

          {/* Run Sandbox Button */}
          <button
            onClick={handleRunProject}
            disabled={isRunning}
            className="btn btn-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1.5 cursor-pointer font-mono"
            title="Execute project in sandbox"
          >
            <Play className={`h-3 w-3 ${isRunning ? 'animate-spin text-accent' : 'fill-current text-emerald-400'}`} />
            <span>{isRunning ? 'Running...' : 'Run'}</span>
          </button>

          {/* Submit Milestone Button */}
          <button
            onClick={handleSubmitMilestone}
            disabled={isSubmitting}
            className="btn btn-primary text-xs px-3.5 py-1.5 inline-flex items-center gap-1.5 cursor-pointer font-bold shadow-sm"
            title="Run automated verification on hidden test harness"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{isSubmitting ? 'Evaluating...' : `Submit M${activeMilestone}`}</span>
          </button>
        </div>
      </header>

      {/* Main IDE Workspace: 4-Pane Grid */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/80 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* PANE 1: Left File Explorer & Milestones Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-subtle bg-surface flex flex-col shrink-0 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0 top-12' : '-translate-x-full md:translate-x-0'
          }`}
        >
          {/* Milestones Mini Selector */}
          <div className="p-3 border-b border-subtle bg-surface-elevated/40 space-y-1.5 select-none">
            <span className="text-[10px] font-bold text-muted tracking-wider uppercase">
              Milestones
            </span>
            <div className="space-y-1">
              {workspace.milestones?.map((m) => {
                const isActive = activeMilestone === m.order;
                return (
                  <button
                    key={m.order}
                    onClick={() => {
                      setActiveMilestone(m.order);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition flex items-center justify-between border cursor-pointer ${
                      isActive
                        ? 'bg-surface text-primary font-bold border-highlight shadow-xs'
                        : 'text-secondary hover:text-primary hover:bg-surface border-transparent'
                    }`}
                  >
                    <span className="truncate">{m.title}</span>
                    <span className="text-[10px] text-accent font-bold ml-1 shrink-0">
                      M{m.order}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* File Explorer Tree */}
          <div className="flex-1 overflow-hidden">
            <FileExplorer
              files={files}
              selectedFile={selectedFile}
              dirtyFiles={dirtyFiles}
              onSelectFile={(path) => {
                handleSelectFile(path);
                setSidebarOpen(false);
              }}
              onCreateFile={handleCreateFile}
              onCreateFolder={handleCreateFolder}
              onDeleteFile={handleDeleteFile}
              onRenameFile={handleRenameFile}
            />
          </div>

          {/* Mobile AI Mentor button */}
          <div className="p-2 border-t border-subtle md:hidden">
            <button
              onClick={() => {
                setSidebarOpen(false);
                setIsAIMentorOpen(true);
              }}
              className="btn btn-secondary w-full py-2 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>Ask AI Mentor</span>
            </button>
          </div>
        </aside>

        {/* PANE 2 & 4: Center Code Editor + Bottom Integrated Terminal */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-surface-elevated">
          {/* Tab Bar */}
          <EditorTabs
            openFiles={openFiles}
            activeFile={selectedFile}
            dirtyFiles={dirtyFiles}
            onSelectTab={handleSelectFile}
            onCloseTab={handleCloseTab}
          />

          {/* Monaco Editor Container */}
          <div className="flex-1 overflow-hidden relative">
            {selectedFile ? (
              <Editor
                height="100%"
                language={getLanguageForFile(selectedFile)}
                theme={resolvedTheme === 'dark' ? 'vs-dark' : 'vs'}
                path={selectedFile}
                value={files[selectedFile] || ''}
                onChange={handleFileContentChange}
                options={{
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontLigatures: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  renderWhitespace: 'selection',
                  lineNumbers: 'on',
                  cursorBlinking: 'smooth',
                  smoothScrolling: true,
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted font-mono text-xs">
                No file selected. Open a file from the explorer on the left.
              </div>
            )}
          </div>

          {/* PANE 4: Bottom Integrated Terminal */}
          <div
            className={`transition-all duration-200 shrink-0 ${
              isTerminalCollapsed ? 'h-8' : 'h-48'
            }`}
          >
            <IntegratedTerminal
              lines={terminalLines}
              isRunning={isRunning}
              isCollapsed={isTerminalCollapsed}
              onExecuteCommand={handleExecuteTerminal}
              onClear={() => setTerminalLines([])}
              onToggleCollapse={() => setIsTerminalCollapsed(!isTerminalCollapsed)}
            />
          </div>
        </div>

        {/* PANE 3: Right Multi-Tab Inspector (Tests, Preview, Specs) */}
        <aside className="w-80 lg:w-96 border-l border-subtle bg-surface flex flex-col shrink-0 overflow-hidden">
          {/* Inspector Tab Switcher */}
          <div className="h-9 px-2 bg-surface-elevated border-b border-subtle flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setRightPanelTab('specs')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  rightPanelTab === 'specs'
                    ? 'bg-surface text-primary font-bold shadow-2xs'
                    : 'text-muted hover:text-primary'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Specs</span>
              </button>

              <button
                onClick={() => setRightPanelTab('tests')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  rightPanelTab === 'tests'
                    ? 'bg-surface text-primary font-bold shadow-2xs'
                    : 'text-muted hover:text-primary'
                }`}
              >
                <FileCheck2 className="h-3.5 w-3.5" />
                <span>Tests</span>
                {submissionReport && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      submissionReport.passed ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                )}
              </button>

              <button
                onClick={() => setRightPanelTab('preview')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  rightPanelTab === 'preview'
                    ? 'bg-surface text-primary font-bold shadow-2xs'
                    : 'text-muted hover:text-primary'
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Preview</span>
              </button>
            </div>
          </div>

          {/* Inspector Content Panes */}
          <div className="flex-1 overflow-hidden">
            {rightPanelTab === 'specs' && (
              <div className="h-full overflow-y-auto p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                      Milestone {activeMilestone} Specification
                    </span>
                    <span className="text-xs font-mono font-bold text-muted">
                      M{activeMilestone} of {workspace.milestones?.length || 1}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-primary">
                    {activeMilestoneSpec?.title || `Milestone ${activeMilestone}`}
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed font-sans">
                    {activeMilestoneSpec?.description}
                  </p>
                </div>

                {/* Required files */}
                {activeMilestoneSpec?.requiredFiles && activeMilestoneSpec.requiredFiles.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted uppercase tracking-wider block">
                      Target Files
                    </span>
                    <div className="space-y-1">
                      {activeMilestoneSpec.requiredFiles.map((rf) => (
                        <button
                          key={rf}
                          onClick={() => handleSelectFile(rf)}
                          className="w-full text-left px-2.5 py-1.5 rounded bg-surface-elevated hover:bg-surface border border-subtle text-xs font-mono text-secondary hover:text-primary transition flex items-center justify-between cursor-pointer"
                        >
                          <span className="truncate">{rf}</span>
                          <ChevronRight className="h-3 w-3 text-muted" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills tested */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider block">
                    Skills Demonstrated
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {workspace.skillsDemonstrated?.map((skill) => (
                      <span key={skill} className="tag-badge text-[11px]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick Submit Prompt */}
                <div className="p-3 rounded-xl bg-surface-elevated border border-subtle space-y-2">
                  <span className="text-xs font-bold text-primary block">Ready to verify?</span>
                  <p className="text-[11px] text-secondary">
                    Submit your implementation to test it against automated server-side verification suites.
                  </p>
                  <button
                    onClick={handleSubmitMilestone}
                    disabled={isSubmitting}
                    className="btn btn-primary w-full py-2 text-xs flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Run Verification (Submit)</span>
                  </button>
                </div>
              </div>
            )}

            {rightPanelTab === 'tests' && (
              <TestRunnerPanel
                submissionReport={submissionReport}
                isSubmitting={isSubmitting}
                activeMilestone={activeMilestone}
                milestoneTitle={activeMilestoneSpec?.title}
                milestoneDescription={activeMilestoneSpec?.description}
                skillsDemonstrated={workspace.skillsDemonstrated}
                onSubmitMilestone={handleSubmitMilestone}
              />
            )}

            {rightPanelTab === 'preview' && (
              <WebPreview
                files={files}
                previewPort={workspace.previewPort || 5000}
              />
            )}
          </div>
        </aside>
      </div>

      {/* AI Mentor Drawer with Full Project Context */}
      <AIMentorDrawer
        isOpen={isAIMentorOpen}
        onClose={() => setIsAIMentorOpen(false)}
        currentContext={{
          projectId: workspace.projectId || workspace.slug,
          activeFilePath: selectedFile,
          currentCode: files[selectedFile],
          projectFiles: Object.entries(files).map(([path, content]) => ({ path, content })),
          terminalOutput: terminalLines.map((l) => `${l.type === 'stdin' ? '$ ' : ''}${l.text}`).join('\n'),
          recentTestFailures: submissionReport?.testResults
            ?.filter((t) => !t.passed)
            .map((t) => ({
              testName: t.testName,
              expected: t.expectedOutput,
              actual: t.actualOutput,
              hint: t.hint,
            })),
          stepName: 'PROJECT',
        }}
      />
    </div>
  );
};
