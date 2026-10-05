import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '../context/ThemeContext';
import { apiFetch } from '../api/client';
import {
  X,
  Play,
  Terminal,
  Sparkles,
  RotateCcw,
  Code2,
} from 'lucide-react';

interface TryItModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode: string;
  language?: string;
  title?: string;
}

export const TryItModal: React.FC<TryItModalProps> = ({
  isOpen,
  onClose,
  initialCode,
  language = 'javascript',
  title = 'Interactive Sandbox — Try It Yourself',
}) => {
  const { resolvedTheme } = useTheme();
  const [code, setCode] = useState(initialCode);
  const [executing, setExecuting] = useState(false);
  const [output, setOutput] = useState<{
    status: string;
    stdout?: string;
    stderr?: string;
    error?: string;
    executionTimeMs?: number;
  } | null>(null);

  // Sync state if initialCode changes
  React.useEffect(() => {
    setCode(initialCode);
    setOutput(null);
  }, [initialCode]);

  if (!isOpen) return null;

  const handleRun = async () => {
    setExecuting(true);
    try {
      const res = await apiFetch<any>('/challenges/run-snippet', {
        method: 'POST',
        body: JSON.stringify({
          code,
          language,
        }),
      });
      setOutput(res);
    } catch (err: any) {
      setOutput({
        status: 'ERROR',
        error: err.message || 'Execution error in sandbox',
      });
    } finally {
      setExecuting(false);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div
        className="craft-card rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scale-in backdrop-blur-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-14 px-6 border-b border-subtle bg-surface-elevated/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-surface border border-subtle text-accent flex items-center justify-center font-mono text-xs font-bold">
              <Code2 className="h-4 w-4" />
            </div>
            <div>
              <div className="kicker text-[10px]">› SANDBOX DRILL</div>
              <h2 className="text-sm font-bold text-primary flex items-center gap-2">
                {title}
                <span className="mono-tag text-[9px] py-0 px-2 uppercase font-mono">
                  {language}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="btn-pill text-xs px-3 py-1.5 cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>RESET</span>
            </button>

            <button
              onClick={handleRun}
              disabled={executing}
              className="btn-pill-primary text-xs px-4 py-1.5 cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
            >
              {executing ? (
                <Sparkles className="h-3 w-3 animate-spin" />
              ) : (
                <Play className="h-3 w-3 fill-current" />
              )}
              <span>{executing ? 'EXECUTING...' : 'RUN CODE'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted hover:text-primary bg-surface hover:bg-surface-elevated border border-subtle transition ml-2 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body: Split Editor & Console */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Monaco Editor */}
          <div className="flex-1 h-full min-h-[250px] border-b md:border-b-0 md:border-r border-subtle bg-surface">
            <Editor
              height="100%"
              defaultLanguage={language}
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

          {/* Output Terminal */}
          <div className="w-full md:w-[42%] h-full flex flex-col bg-surface-elevated/30 font-mono text-xs">
            <div className="h-10 px-4 border-b border-subtle flex items-center justify-between bg-surface text-muted text-[11px] shrink-0">
              <span className="flex items-center gap-1.5 font-bold text-accent">
                <Terminal className="h-3.5 w-3.5" />
                Console Output
              </span>
              {output?.executionTimeMs !== undefined && (
                <span className="mono-tag text-[9px] py-0 px-1.5 text-accent">
                  {output.executionTimeMs}ms
                </span>
              )}
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {executing ? (
                <div className="flex items-center gap-2 text-accent animate-pulse font-mono">
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>Executing in isolated sandbox...</span>
                </div>
              ) : output ? (
                <div className="space-y-3 animate-fade-in">
                  {output.stdout ? (
                    <div className="p-3.5 rounded-xl bg-surface border border-subtle text-primary whitespace-pre-wrap">
                      <span className="kicker block mb-1 text-[10px]">
                        › STANDARD OUTPUT:
                      </span>
                      {output.stdout}
                    </div>
                  ) : null}

                  {output.stderr ? (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 whitespace-pre-wrap">
                      <span className="font-bold block mb-1 text-[10px] uppercase tracking-wider font-mono">
                        › STANDARD ERROR:
                      </span>
                      {output.stderr}
                    </div>
                  ) : null}

                  {output.error ? (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 whitespace-pre-wrap">
                      <span className="font-bold block mb-1 text-[10px] uppercase tracking-wider font-mono">
                        › RUNTIME ERROR:
                      </span>
                      {output.error}
                    </div>
                  ) : null}

                  {!output.stdout && !output.stderr && !output.error && (
                    <div className="p-3.5 rounded-xl bg-surface border border-subtle text-muted text-center font-mono">
                      Execution finished with return code 0 (no stdout).
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-muted text-center py-8 space-y-2 font-mono text-xs">
                  <Terminal className="h-6 w-6 text-accent mx-auto opacity-40" />
                  <p>Execute code to inspect realtime output and assertion telemetry.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

