import React from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  actionUrl,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`rounded-xl border border-dashed border-subtle bg-surface/50 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3.5 max-w-lg mx-auto ${className}`}
    >
      <div className="h-12 w-12 rounded-xl bg-surface-elevated border border-subtle flex items-center justify-center text-muted shadow-xs">
        {icon || <Layers className="h-6 w-6 text-accent" />}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-primary">{title}</h3>
        <p className="text-xs text-muted leading-relaxed max-w-sm">{description}</p>
      </div>

      {actionLabel && (
        <div className="pt-2">
          {actionUrl ? (
            <Link
              to={actionUrl}
              className="btn btn-primary"
            >
              {actionLabel}
            </Link>
          ) : onAction ? (
            <button
              onClick={onAction}
              className="btn btn-primary"
            >
              {actionLabel}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

