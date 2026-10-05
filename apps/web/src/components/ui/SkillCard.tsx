import React from 'react';
import { UserSkillDTO } from '@codexa/shared';

interface SkillCardProps {
  skill: UserSkillDTO | any;
  className?: string;
}

export const SkillCard: React.FC<SkillCardProps> = ({ skill, className = '' }) => {
  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'MASTER':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'PROFICIENT':
        return 'text-sky-400 border-sky-500/30 bg-sky-500/10';
      case 'COMPETENT':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      default:
        return 'text-muted border-subtle bg-surface-elevated';
    }
  };

  const masteryScore = skill.masteryScore ?? 50;

  return (
    <div
      className={`rounded-xl craft-card-interactive border border-subtle hover:border-highlight p-4 sm:p-5 flex flex-col justify-between space-y-3 transition-all duration-200 w-[240px] sm:w-[260px] shrink-0 ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="kicker text-[10px]">
          › {skill.category || 'SKILL'}
        </span>
        <span
          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border font-semibold ${getBadgeStyle(
            skill.level || 'COMPETENT'
          )}`}
        >
          {skill.level || 'COMPETENT'}
        </span>
      </div>

      <div className="space-y-0.5">
        <h4 className="text-sm font-bold text-primary truncate">
          {skill.skillName || skill.skillSlug || skill.name || 'Skill'}
        </h4>
        <p className="text-[11px] font-mono text-muted">
          Quizzes & code drills
        </p>
      </div>

      {/* Progress Gauge */}
      <div className="space-y-1.5 pt-2 border-t border-subtle font-mono">
        <div className="flex justify-between text-[10px]">
          <span className="text-muted">MASTERY</span>
          <span className="text-primary font-bold">{masteryScore}%</span>
        </div>
        <div className="h-1 w-full rounded-full bg-surface-elevated overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${masteryScore}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted pt-0.5">
          <span>{skill.evidenceCount || 1} checkpoints</span>
          <span className="text-emerald-400 font-semibold">✓ Verified</span>
        </div>
      </div>
    </div>
  );
};
