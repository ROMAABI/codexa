import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Lightbulb,
  Sparkles,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { ProjectSubmissionResponse, ProjectTestItemResult } from '@codexa/shared';

interface TestRunnerPanelProps {
  submissionReport: ProjectSubmissionResponse | null;
  isSubmitting: boolean;
  activeMilestone: number;
  milestoneTitle?: string;
  milestoneDescription?: string;
  skillsDemonstrated?: string[];
  onSubmitMilestone: () => void;
}

export const TestRunnerPanel: React.FC<TestRunnerPanelProps> = ({
  submissionReport,
  isSubmitting,
  activeMilestone,
  milestoneTitle,
  milestoneDescription,
  skillsDemonstrated = [],
  onSubmitMilestone,
}) => {
  return (
    <div className="flex flex-col h-full bg-surface overflow-y-auto p-4 space-y-4">
      {/* Milestone Overview Header */}
      <div className="p-3.5 rounded-xl bg-surface-elevated border border-subtle space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">
            Milestone {activeMilestone} Goals
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-bold">
            M{activeMilestone}
          </span>
        </div>
        <h3 className="text-sm font-bold text-primary">{milestoneTitle || `Milestone ${activeMilestone}`}</h3>
        {milestoneDescription && (
          <p className="text-xs text-secondary leading-relaxed">{milestoneDescription}</p>
        )}

        {skillsDemonstrated.length > 0 && (
          <div className="pt-2 flex flex-wrap gap-1.5">
            {skillsDemonstrated.map((s) => (
              <span key={s} className="tag-badge text-[10px]">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Evaluation State / Results */}
      {isSubmitting ? (
        <div className="p-8 rounded-xl border border-subtle bg-surface-elevated text-center space-y-3 animate-pulse">
          <Sparkles className="h-6 w-6 animate-spin text-accent mx-auto" />
          <h4 className="text-xs font-bold text-primary">Running Automated Hidden Tests</h4>
          <p className="text-xs text-secondary">
            Mounting project files in bubblewrap sandbox and executing verification harness...
          </p>
        </div>
      ) : submissionReport ? (
        <div className="space-y-4 animate-fade-in">
          {/* Score Header Card */}
          <div
            className={`p-4 rounded-xl border ${
              submissionReport.passed
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-amber-500/10 border-amber-500/30'
            } space-y-3`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {submissionReport.passed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
                )}
                <span className="text-sm font-bold text-primary">
                  {submissionReport.passed ? 'Milestone Complete!' : 'Milestone Incomplete'}
                </span>
              </div>

              <span className="text-base font-extrabold font-mono text-primary">
                {submissionReport.score}%
              </span>
            </div>

            {/* Score Progress Bar */}
            <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-subtle">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  submissionReport.passed
                    ? 'bg-emerald-500'
                    : submissionReport.score > 0
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${submissionReport.score}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-secondary pt-1">
              <span>
                {submissionReport.passedCount} of {submissionReport.totalCount} tests passed
              </span>
              {submissionReport.xpAwarded > 0 && (
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <Award className="h-3.5 w-3.5" />
                  <span>+{submissionReport.xpAwarded} XP Awarded</span>
                </span>
              )}
            </div>

            <p className="text-xs text-secondary pt-1 border-t border-subtle/50">
              {submissionReport.feedback}
            </p>
          </div>

          {/* Test Breakdown List */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider block px-1">
              Test Suite Breakdown ({submissionReport.testResults?.length || 0})
            </span>

            <div className="space-y-2">
              {submissionReport.testResults?.map((test: ProjectTestItemResult, idx: number) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs font-mono transition ${
                    test.passed
                      ? 'bg-surface-elevated/60 border-subtle hover:border-emerald-500/40'
                      : 'bg-rose-500/5 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      {test.passed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-bold text-primary block">{test.testName}</span>
                        {test.errorMessage && (
                          <span className="text-rose-400 text-[11px] block mt-1 break-words font-mono">
                            {test.errorMessage}
                          </span>
                        )}
                      </div>
                    </div>

                    {test.durationMs !== undefined && (
                      <span className="text-[10px] text-muted flex items-center gap-0.5 shrink-0">
                        <Clock className="h-2.5 w-2.5" />
                        {test.durationMs}ms
                      </span>
                    )}
                  </div>

                  {/* Actionable Hint for failed test */}
                  {!test.passed && test.hint && (
                    <div className="mt-2.5 p-2 rounded bg-surface border border-subtle/60 flex items-start gap-2 text-[11px] font-sans text-secondary">
                      <Lightbulb className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{test.hint}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="p-8 rounded-xl border border-subtle bg-surface-elevated text-center space-y-3">
          <div className="h-10 w-10 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto">
            <Sparkles className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-bold text-primary">Automated Test Verification</h4>
          <p className="text-xs text-secondary max-w-xs mx-auto leading-relaxed">
            Ready to test your code against the milestone specifications? Click <strong>Submit</strong> in the toolbar to run the isolated test suite.
          </p>
          <button
            onClick={onSubmitMilestone}
            className="btn btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5 cursor-pointer mt-2"
          >
            <span>Run Milestone Verification</span>
          </button>
        </div>
      )}
    </div>
  );
};
