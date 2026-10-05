import React from 'react';
import { CheckCircle2, ArrowRight, Zap, Sparkles, X } from 'lucide-react';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  type?: 'CHALLENGE' | 'QUIZ' | 'LESSON' | 'MILESTONE';
  xpAwarded?: number;
  skillsDemonstrated?: string[];
  nextActivityTitle?: string;
  onContinue: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  onClose,
  title = 'Challenge Complete',
  type = 'CHALLENGE',
  xpAwarded = 25,
  skillsDemonstrated = [],
  nextActivityTitle,
  onContinue,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="card w-full max-w-md p-6 sm:p-8 space-y-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md text-muted hover:text-primary transition"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-success/15 border border-success/30 flex items-center justify-center text-success shrink-0">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="chip text-[10px] text-success border-success/30 font-semibold">
                {type} PASSED
              </span>
              {xpAwarded > 0 && (
                <span className="text-[11px] font-mono text-warning font-semibold flex items-center gap-0.5">
                  <Zap className="h-3 w-3 fill-current" />
                  +{xpAwarded} XP
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-primary tracking-tight mt-1">{title}</h3>
          </div>
        </div>

        {/* Skills Demonstrated Feedback */}
        {skillsDemonstrated.length > 0 && (
          <div className="space-y-2 p-3.5 rounded-lg bg-surface-elevated border border-subtle">
            <div className="eyebrow flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-accent" />
              Verified Competencies Demonstrated
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {skillsDemonstrated.map((skill) => (
                <span
                  key={skill}
                  className="chip text-xs font-mono font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-success font-mono pt-1">
              ✓ Skill telemetry recorded
            </p>
          </div>
        )}

        {/* Next Step Teaser */}
        {nextActivityTitle && (
          <div className="space-y-1">
            <div className="eyebrow">
              Next in Syllabus:
            </div>
            <div className="text-xs font-semibold text-primary truncate">
              {nextActivityTitle}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              onClose();
              onContinue();
            }}
            className="btn-primary w-full py-2.5 text-xs inline-flex items-center justify-center gap-2"
          >
            <span>Continue Learning</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
