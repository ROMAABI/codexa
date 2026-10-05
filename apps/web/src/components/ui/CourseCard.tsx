import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { CourseDTO } from '@codexa/shared';
import { CourseThumbnail } from './CourseThumbnail';

interface CourseCardProps {
  course: CourseDTO | any;
  progressPercent?: number;
  featured?: boolean;
  className?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  progressPercent,
  featured = false,
  className = '',
}) => {
  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'ADVANCED':
        return 'text-danger border-danger/30 bg-danger/10';
      case 'INTERMEDIATE':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      default:
        return 'text-sky-400 border-sky-500/30 bg-sky-500/10';
    }
  };

  return (
    <Link
      to={`/courses/${course.slug}`}
      className={`group relative flex flex-col justify-between rounded-2xl bg-surface dark:bg-[#0e131d] border border-subtle dark:border-white/[0.09] hover:border-sky-500/40 dark:hover:border-sky-400/40 hover:shadow-lg dark:hover:shadow-[0_12px_36px_rgba(0,0,0,0.6),0_0_24px_rgba(56,189,248,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden shrink-0 ${
        featured ? 'w-[320px] sm:w-[360px]' : 'w-[280px] sm:w-[320px]'
      } ${className}`}
    >
      {/* Course Visual / Thumbnail */}
      <CourseThumbnail course={course} />

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-3">
          {/* Top Eyebrow & Level */}
          <div className="flex items-center justify-between gap-2 border-b border-subtle dark:border-white/[0.08] pb-2.5">
            <span className="kicker text-[10px] truncate dark:text-slate-400">
              › {course.domain || 'SYSTEMS'}
            </span>
            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border font-semibold ${getBadgeStyle(course.level)}`}>
              {course.level || 'Beginner'}
            </span>
          </div>

          {/* Title & Description */}
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-primary dark:text-slate-100 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition line-clamp-1">
              {course.title}
            </h3>
            <p className="text-xs text-secondary dark:text-slate-400 line-clamp-2 leading-relaxed font-sans">
              {course.description}
            </p>
          </div>

          {/* 4-Phase Mono Pipeline Badges */}
          <div className="grid grid-cols-4 gap-1 pt-1 font-mono text-[9px] text-center">
            <div className="py-1 rounded-md bg-surface-elevated dark:bg-[#151c2a] border border-subtle dark:border-white/[0.07] text-secondary dark:text-slate-400 font-semibold">01 VID</div>
            <div className="py-1 rounded-md bg-surface-elevated dark:bg-[#151c2a] border border-subtle dark:border-white/[0.07] text-secondary dark:text-slate-400 font-semibold">02 NOTE</div>
            <div className="py-1 rounded-md bg-surface-elevated dark:bg-[#151c2a] border border-subtle dark:border-white/[0.07] text-secondary dark:text-slate-400 font-semibold">03 CODE</div>
            <div className="py-1 rounded-md bg-surface-elevated dark:bg-[#151c2a] border border-subtle dark:border-white/[0.07] text-secondary dark:text-slate-400 font-semibold">04 QUIZ</div>
          </div>

          {/* Skills Covered */}
          {course.skillsCovered && course.skillsCovered.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {course.skillsCovered.slice(0, 3).map((skill: string) => (
                <span
                  key={skill}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface-elevated dark:bg-[#151c2a] text-secondary dark:text-slate-300 border border-subtle dark:border-white/[0.07] truncate max-w-[100px]"
                >
                  {skill}
                </span>
              ))}
              {course.skillsCovered.length > 3 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-surface-elevated dark:bg-[#151c2a] text-muted dark:text-slate-400 border border-subtle dark:border-white/[0.07]">
                  +{course.skillsCovered.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 mt-3 border-t border-subtle dark:border-white/[0.08]">
          {typeof progressPercent === 'number' && progressPercent > 0 ? (
            <div className="space-y-1.5 font-mono">
              <div className="flex justify-between text-[10px]">
                <span className="text-muted dark:text-slate-400">PROGRESS</span>
                <span className="text-primary dark:text-slate-100 font-bold">{progressPercent}%</span>
              </div>
              <div className="h-1 w-full rounded-full bg-surface-elevated dark:bg-[#151c2a] overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-[11px] font-mono text-muted dark:text-slate-400 group-hover:text-primary dark:group-hover:text-slate-200 transition">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-muted dark:text-slate-400" />
                ~{course.estimatedHours || 40}h · {course.modules?.length || 4} mod
              </span>
              <span className="text-primary dark:text-sky-400 flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>EXPLORE</span>
                <span>↗</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
