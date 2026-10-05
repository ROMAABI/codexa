import React from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import {
  BookOpen,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface ReferenceViewProps {
  activity: any;
  onComplete: () => void;
  onTryIt?: (code: string, language: string) => void;
  isCompleted?: boolean;
}

export const ReferenceView: React.FC<ReferenceViewProps> = ({
  activity,
  onComplete,
  onTryIt,
  isCompleted = false,
}) => {
  // Collect resources
  const resources: any[] = [];
  if (activity.resourceRef) resources.push(activity.resourceRef);
  if (activity.resourceRefs && Array.isArray(activity.resourceRefs)) {
    activity.resourceRefs.forEach((r: any) => {
      if (r && !resources.some((ex) => (ex._id || ex.id) === (r._id || r.id))) {
        resources.push(r);
      }
    });
  }

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="border-b border-subtle pb-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-accent font-semibold">
          <BookOpen className="h-4 w-4" />
          <span>SYNTAX & METHOD REFERENCE</span>
        </div>
        <h2 className="text-2xl font-bold text-primary tracking-tight">{activity.title}</h2>
        <p className="text-xs text-muted">
          Concise, practical syntax lookup and cheat-sheet. Reference whenever you need a quick reminder.
        </p>
      </div>

      {/* Main Content Render */}
      <div className="reading-surface space-y-6">
        <MarkdownRenderer content={activity.content || ''} onTryIt={onTryIt} />
      </div>

      {/* Attached Official Documentation References */}
      {resources.length > 0 && (
        <div className="mt-8 pt-6 border-t border-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-primary flex items-center gap-1.5">
              <ExternalLink className="h-4 w-4 text-accent" />
              Verified Official Reference Documentation
            </h3>
            <span className="text-[10px] font-mono text-success font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Verified License
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {resources.map((res: any, idx: number) => (
              <a
                key={res._id || idx}
                href={res.canonicalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card p-4 hover:border-accent/40 transition group flex items-start justify-between"
              >
                <div className="space-y-1 overflow-hidden pr-2">
                  <span className="chip text-[10px]">
                    {res.provider || 'Official Doc'}
                  </span>
                  <div className="text-xs font-semibold text-primary group-hover:text-accent truncate mt-1">
                    {res.title}
                  </div>
                  <div className="text-[11px] text-muted font-mono">
                    License: {res.license || 'Open Documentation'}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted group-hover:text-accent shrink-0 mt-1 transition" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="pt-6 border-t border-subtle flex items-center justify-between">
        <span className="text-xs text-muted font-mono">Finished reviewing this reference?</span>
        <button
          onClick={onComplete}
          className="btn-primary text-xs inline-flex items-center gap-1.5"
        >
          <span>{isCompleted ? 'Next Step' : 'Mark Reviewed & Continue'}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
