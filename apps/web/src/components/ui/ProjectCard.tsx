import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, Terminal, Sparkles } from 'lucide-react';

interface ProjectCardProps {
  project: any;
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, className = '' }) => {
  return (
    <Link
      to={`/projects/${project.slug || 'task-management-platform'}`}
      className={`group rounded-xl craft-card-interactive border border-subtle hover:border-highlight p-4 sm:p-5 flex flex-col justify-between space-y-3.5 transition-all duration-200 w-[280px] sm:w-[320px] shrink-0 ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="kicker text-[10px]">
          › CAPSTONE
        </span>
        <span className="text-[11px] text-muted font-mono flex items-center gap-1">
          <Layers className="h-3 w-3 text-muted" />
          {project.milestones?.length || 3} MILESTONES
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-bold text-primary group-hover:text-sky-400 transition line-clamp-1">
          {project.title}
        </h3>
        <p className="text-xs text-secondary line-clamp-2 leading-relaxed font-sans">
          {project.description}
        </p>
      </div>

      {/* Skills demonstrated */}
      {project.skillsDemonstrated && (
        <div className="space-y-1 pt-1 font-mono">
          <span className="text-[10px] text-muted uppercase tracking-wider block">
            Skills Combined
          </span>
          <div className="flex flex-wrap gap-1">
            {project.skillsDemonstrated.slice(0, 4).map((s: string) => (
              <span
                key={s}
                className="text-[10px] px-2 py-0.5 rounded bg-surface-elevated text-secondary border border-subtle truncate max-w-[100px]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-3 border-t border-subtle flex items-center justify-between text-[11px] font-mono">
        <span className="text-muted flex items-center gap-1.5">
          <Terminal className="h-3 w-3" />
          MULTI-FILE
        </span>
        <span className="text-primary font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          <span>BUILD</span>
          <span>↗</span>
        </span>
      </div>
    </Link>
  );
};
