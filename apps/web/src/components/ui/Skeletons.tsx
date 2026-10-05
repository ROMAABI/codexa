import React from 'react';

export const CourseCardSkeleton: React.FC<{ featured?: boolean }> = ({ featured }) => (
  <div
    className={`rounded-2xl border border-subtle bg-surface p-0 flex flex-col justify-between overflow-hidden shrink-0 ${
      featured ? 'w-[340px] sm:w-[380px]' : 'w-[280px] sm:w-[320px]'
    }`}
  >
    <div className="h-36 w-full skeleton-shimmer" />
    <div className="p-4 sm:p-5 space-y-3">
      <div className="h-5 w-3/4 rounded-lg skeleton-shimmer" />
      <div className="space-y-1.5">
        <div className="h-3.5 w-full rounded skeleton-shimmer" />
        <div className="h-3.5 w-4/5 rounded skeleton-shimmer" />
      </div>
      <div className="flex gap-1.5 pt-2">
        <div className="h-5 w-16 rounded skeleton-shimmer" />
        <div className="h-5 w-16 rounded skeleton-shimmer" />
        <div className="h-5 w-12 rounded skeleton-shimmer" />
      </div>
      <div className="pt-3 border-t border-subtle flex justify-between items-center">
        <div className="h-4 w-20 rounded skeleton-shimmer" />
        <div className="h-4 w-16 rounded skeleton-shimmer" />
      </div>
    </div>
  </div>
);

export const SkillCardSkeleton: React.FC = () => (
  <div className="rounded-2xl border border-subtle bg-surface p-4 sm:p-5 flex flex-col justify-between space-y-4 w-[240px] sm:w-[260px] shrink-0">
    <div className="flex justify-between items-center">
      <div className="h-4 w-16 rounded skeleton-shimmer" />
      <div className="h-4 w-20 rounded-full skeleton-shimmer" />
    </div>
    <div className="space-y-2">
      <div className="h-4 w-3/4 rounded skeleton-shimmer" />
      <div className="h-3 w-1/2 rounded skeleton-shimmer" />
    </div>
    <div className="space-y-1.5 pt-1">
      <div className="flex justify-between">
        <div className="h-3 w-12 rounded skeleton-shimmer" />
        <div className="h-3 w-8 rounded skeleton-shimmer" />
      </div>
      <div className="h-1.5 w-full rounded-full skeleton-shimmer" />
    </div>
  </div>
);

export const ProjectCardSkeleton: React.FC = () => (
  <div className="rounded-2xl border border-subtle bg-surface p-5 flex flex-col justify-between space-y-4 w-[300px] sm:w-[340px] shrink-0">
    <div className="flex justify-between items-center">
      <div className="h-4 w-28 rounded-full skeleton-shimmer" />
      <div className="h-4 w-20 rounded skeleton-shimmer" />
    </div>
    <div className="space-y-2">
      <div className="h-5 w-4/5 rounded skeleton-shimmer" />
      <div className="h-3.5 w-full rounded skeleton-shimmer" />
      <div className="h-3.5 w-3/4 rounded skeleton-shimmer" />
    </div>
    <div className="flex gap-1.5">
      <div className="h-4 w-14 rounded skeleton-shimmer" />
      <div className="h-4 w-14 rounded skeleton-shimmer" />
      <div className="h-4 w-14 rounded skeleton-shimmer" />
    </div>
    <div className="pt-3 border-t border-subtle flex justify-between items-center">
      <div className="h-4 w-24 rounded skeleton-shimmer" />
      <div className="h-4 w-20 rounded skeleton-shimmer" />
    </div>
  </div>
);

export const RailSkeleton: React.FC<{ count?: number; type?: 'course' | 'skill' | 'project' }> = ({
  count = 4,
  type = 'course',
}) => (
  <div className="space-y-4">
    <div className="flex justify-between items-end px-1">
      <div className="space-y-2">
        <div className="h-6 w-48 rounded-lg skeleton-shimmer" />
        <div className="h-3.5 w-72 rounded skeleton-shimmer" />
      </div>
      <div className="hidden sm:flex gap-1.5">
        <div className="h-8 w-8 rounded-lg skeleton-shimmer" />
        <div className="h-8 w-8 rounded-lg skeleton-shimmer" />
      </div>
    </div>
    <div className="flex gap-4 overflow-hidden pb-3 pt-1 px-1">
      {Array.from({ length: count }).map((_, i) =>
        type === 'skill' ? (
          <SkillCardSkeleton key={i} />
        ) : type === 'project' ? (
          <ProjectCardSkeleton key={i} />
        ) : (
          <CourseCardSkeleton key={i} />
        )
      )}
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10">
    {/* Greeting Banner */}
    <div className="rounded-3xl border border-subtle bg-surface p-8 sm:p-10 space-y-4">
      <div className="h-4 w-32 rounded-full skeleton-shimmer" />
      <div className="h-9 w-2/3 rounded-xl skeleton-shimmer" />
      <div className="h-4 w-1/2 rounded skeleton-shimmer" />
    </div>

    {/* Recommendation Card */}
    <div className="rounded-2xl border border-subtle bg-surface p-6 sm:p-7 space-y-4">
      <div className="h-4 w-44 rounded-full skeleton-shimmer" />
      <div className="h-7 w-3/4 rounded-lg skeleton-shimmer" />
      <div className="h-12 w-full rounded-xl skeleton-shimmer" />
    </div>

    {/* Active Course */}
    <div className="space-y-3">
      <div className="h-5 w-32 rounded skeleton-shimmer" />
      <div className="rounded-2xl border border-subtle bg-surface p-6 sm:p-7 space-y-3">
        <div className="h-6 w-1/2 rounded-lg skeleton-shimmer" />
        <div className="h-4 w-3/4 rounded skeleton-shimmer" />
        <div className="h-2 w-1/3 rounded-full skeleton-shimmer" />
      </div>
    </div>

    {/* Skills Rail */}
    <RailSkeleton count={4} type="skill" />
  </div>
);

export const LessonSkeleton: React.FC = () => (
  <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden bg-main">
    <div className="w-64 border-r border-subtle bg-surface-elevated p-4 space-y-4 shrink-0">
      <div className="h-4 w-24 rounded skeleton-shimmer" />
      <div className="h-6 w-full rounded-lg skeleton-shimmer" />
      <div className="space-y-2 pt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 w-full rounded-lg skeleton-shimmer" />
        ))}
      </div>
    </div>
    <div className="flex-1 flex flex-col p-8 space-y-6 max-w-4xl mx-auto">
      <div className="h-8 w-2/3 rounded-xl skeleton-shimmer" />
      <div className="h-72 w-full rounded-2xl skeleton-shimmer" />
      <div className="space-y-3">
        <div className="h-4 w-full rounded skeleton-shimmer" />
        <div className="h-4 w-5/6 rounded skeleton-shimmer" />
        <div className="h-4 w-4/6 rounded skeleton-shimmer" />
      </div>
    </div>
  </div>
);
