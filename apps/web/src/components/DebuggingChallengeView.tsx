import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '../context/ThemeContext';
import { apiFetch } from '../api/client';
import { MarkdownRenderer } from './MarkdownRenderer';
import {
  Bug,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  Terminal,
  AlertTriangle,
} from 'lucide-react';

interface DebuggingChallengeViewProps {
  activity: any;
  challenge?: any;
  onComplete: () => void;
  isCompleted?: boolean;
}

export const DebuggingChallengeView: React.FC<DebuggingChallengeViewProps> = ({
  activity,
  challenge,
  onComplete,
  isCompleted = false,
}) => {
  const { resolvedTheme } = useTheme();
  const [code, setCode] = useState(challenge?.starterCode || activity?.content || '');
  const [showHint, setShowHint] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<any>(null);

  React.useEffect(() => {
    if (challenge?.starterCode) {
      setCode(challenge.starterCode);
    }
  }, [challenge]);

  const handleRun = async () => {
    setExecuting(true);
    try {
      const chId = challenge?._id || challenge?.id;
      if (chId) {
        const res = await apiFetch<any>(`/challenges/${chId}/submit`, {
          method: 'POST',
          body: JSON.stringify({ code }),
        });
        setResult(res);
        if (res.status === 'PASSED') {
          onComplete();
        }
      } else {
        const res = await apiFetch<any>('/challenges/run-snippet', {
          method: 'POST',
          body: JSON.stringify({
            code,
            language: challenge?.language || 'javascript',
          }),
        });
        setResult(res);
      }
    } catch (err: any) {
      setResult({
        status: 'ERROR',
        error: err.message || 'Execution error in sandbox',
      });
    } finally {
      setExecuting(false);
    }
  };

  const handleReset = () => {
    setCode(challenge?.starterCode || '');
    setResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-8 space-y-6">
      {/* Debugging Header */}
      <div className="border-b border-subtle pb-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-warning font-semibold">
          <Bug className="h-4 w-4" />
          <span>DEBUGGING CHALLENGE</span>
        </div>
        <h2 className="text-2xl font-bold text-primary tracking-tight">
          {challenge?.title || activity?.title}
        </h2>
        <p className="text-xs text-muted">
          The starter code below contains a subtle defect. Inspect the symptoms, diagnose the root cause, and fix the code to pass all test assertions.
        </p>
      </div>

      {/* Bug Symptom Card */}
      <div className="card p-5 border-warning/30 bg-warning/5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-warning">
          <AlertTriangle className="h-4 w-4" />
          <span>Reported Bug Behavior</span>
        </div>

        <div className="reading-surface text-sm">
          <MarkdownRenderer content={challenge?.description || activity?.content || ''} />
        </div>
      </div>

      {/* Code Editor & Test Case Area */}
      <div className="card overflow-hidden">
        {/* Editor Toolbar */}
        <div className="h-12 px-4 border-b border-subtle bg-surface flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-primary">buggy_module.js</span>
            <span className="chip text-[10px] text-warning">
              Fix Bug & Verify
            </span>
          </div>

          <div className="flex items-center gap-2">
            {challenge?.hints && challenge.hints.length > 0 && (
              <button
                onClick={() => setShowHint(!showHint)}
                className={`btn-secondary text-xs px-2.5 py-1.5 inline-flex items-center gap-1 ${
                  showHint ? 'border-warning/40 text-warning' : ''
                }`}
              >
                <Lightbulb className="h-3.5 w-3.5 text-warning" />
                <span>{showHint ? 'Hide Diagnostic Hint' : 'Diagnostic Hint'}</span>
              </button>
            )}

            <button
              onClick={handleReset}
              className="btn-secondary text-xs px-2.5 py-1.5 inline-flex items-center gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Code</span>
            </button>

            <button
              onClick={handleRun}
              disabled={executing}
              className="btn-primary text-xs px-3.5 py-1.5 inline-flex items-center gap-1.5"
            >
              {executing ? (
                <Sparkles className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
              <span>{executing ? 'Testing Fix...' : 'Test Fix & Submit'}</span>
            </button>
          </div>
        </div>

        {/* Hints Banner */}
        {showHint && challenge?.hints && (
          <div className="p-4 bg-warning/10 border-b border-warning/20 text-xs text-warning space-y-1">
            <span className="font-semibold flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              Root Cause Hint:
            </span>
            <ul className="list-disc list-inside space-y-0.5 pl-2 text-secondary">
              {challenge.hints.map((h: string, idx: number) => (
                <li key={idx}>{h}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Monaco Editor */}
        <div className="h-64">
          <Editor
            height="100%"
            defaultLanguage={challenge?.language || 'javascript'}
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

        {/* Results & Feedback Box */}
        {result && (
          <div className="p-4 border-t border-subtle bg-surface space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary">
                Automated Test Verification
              </span>
              <span
                className={`font-semibold px-2 py-0.5 rounded ${
                  result.status === 'PASSED'
                    ? 'bg-success/10 text-success border border-success/30'
                    : 'bg-danger/10 text-danger border border-danger/30'
                }`}
              >
                {result.status === 'PASSED' ? '✓ Bug Fixed & Verified' : '✕ Test Assertions Failed'}
              </span>
            </div>

            {result.results?.map((res: any, idx: number) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border flex items-start gap-2.5 ${
                  res.passed
                    ? 'bg-success/10 border-success/30 text-success'
                    : 'bg-danger/10 border-danger/30 text-danger'
                }`}
              >
                {res.passed ? (
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-danger shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold text-primary">{res.description}</div>
                  {!res.passed && res.expectedOutput && (
                    <div className="text-muted text-[11px] mt-0.5">
                      Expected: <span className="text-success">{res.expectedOutput}</span> | Received: <span className="text-danger">{res.actualOutput || 'null'}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {result.stdout && (
              <div className="p-2.5 rounded-lg bg-surface-elevated border border-subtle text-secondary whitespace-pre-wrap">
                <span className="text-muted font-semibold block mb-1">Sandbox Logs:</span>
                {result.stdout}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Completion CTA */}
      {(result?.status === 'PASSED' || isCompleted) && (
        <div className="p-4 rounded-xl bg-success/10 border border-success/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-success font-semibold text-xs font-mono">
            <CheckCircle2 className="h-5 w-5" />
            <span>Bug successfully identified and resolved!</span>
          </div>
          <button
            onClick={onComplete}
            className="btn-primary text-xs inline-flex items-center gap-1.5"
          >
            <span>Continue to Next Step</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
