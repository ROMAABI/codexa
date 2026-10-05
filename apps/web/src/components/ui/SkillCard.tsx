import React from 'react';
import { UserSkillDTO } from '@codexa/shared';

interface SkillCardProps {
  skill: UserSkillDTO | any;
  className?: string;
}

export const SkillCard: React.FC<SkillCardProps> = ({ skill, className = '' }) => {
  const isAssessed = Boolean(
    skill.isAssessed ||
    (skill.evidenceCount !== undefined && skill.evidenceCount > 0) ||
    (skill.masteryScore !== undefined && skill.masteryScore > 0)
  );

  const level = isAssessed ? (skill.level || 'NOVICE') : (skill.level || 'CORE TRACK');
  const masteryScore = typeof skill.masteryScore === 'number' ? skill.masteryScore : 0;
  const evidenceCount = typeof skill.evidenceCount === 'number' ? skill.evidenceCount : 0;

  const getBadgeStyle = (lvl: string) => {
    switch (lvl) {
      case 'MASTER':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'PROFICIENT':
        return 'text-sky-400 border-sky-500/30 bg-sky-500/10';
      case 'COMPETENT':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'NOVICE':
        return 'text-secondary border-subtle bg-surface-elevated';
      default:
        return 'text-muted border-subtle bg-surface-elevated';
    }
  };

  return (
    <div
      className={`rounded-xl craft-card-interactive border border-subtle hover:border-highlight p-4 sm:p-5 flex flex-col justify-between space-y-3 transition-all duration-200 w-[240px] sm:w-[260px] shrink-0 ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-medium text-muted uppercase tracking-wider">
          {skill.category || 'SKILL'}
        </span>
        <span
          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border font-semibold ${getBadgeStyle(
            level
          )}`}
        >
          {level}
        </span>
      </div>

      <div className="space-y-0.5">
        <h4 className="text-sm font-bold text-primary truncate" title={skill.skillName || skill.name || skill.skillSlug}>
          {skill.skillName || skill.name || skill.skillSlug || 'Skill'}
        </h4>
        <p className="text-[11px] font-mono text-muted line-clamp-1">
          {skill.description || 'Quizzes & code drills'}
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
            style={{ width: `${Math.min(100, Math.max(0, masteryScore))}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted pt-0.5">
          <span>{evidenceCount} checkpoint{evidenceCount === 1 ? '' : 's'}</span>
          {evidenceCount > 0 && masteryScore >= 40 ? (
            <span className="text-emerald-400 font-semibold">✓ Verified</span>
          ) : evidenceCount > 0 ? (
            <span className="text-amber-400 font-semibold">In Calibration</span>
          ) : (
            <span className="text-muted">Ready to calibrate</span>
          )}
        </div>
      </div>
    </div>
  );
};
