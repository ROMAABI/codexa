import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';
import { RecommendationDTO } from '@codexa/shared';
import { ContentRail } from '../components/ui/ContentRail';
import { CourseCard } from '../components/ui/CourseCard';
import { SkillCard } from '../components/ui/SkillCard';
import { ProjectCard } from '../components/ui/ProjectCard';
import { EmptyState } from '../components/ui/EmptyState';
import { DashboardSkeleton } from '../components/ui/Skeletons';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Play,
  Terminal,
  Compass,
} from 'lucide-react';

import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const DashboardPage: React.FC = () => {
  useDocumentTitle('Developer Dashboard');
  const { user } = useAuth();
  const [recommendation, setRecommendation] = useState<RecommendationDTO | null>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [recData, enrollData, skillData, projectData] = await Promise.all([
          apiFetch<RecommendationDTO>('/recommendations/next').catch(() => null),
          apiFetch<any[]>('/progress/my-courses').catch(() => []),
          apiFetch<any[]>('/skills/my-skills').catch(() => []),
          apiFetch<any[]>('/projects').catch(() => []),
        ]);
        setRecommendation(recData);
        setEnrollments(enrollData || []);
        setSkills(skillData || []);
        setProjects(projectData || []);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const primaryEnrollment = enrollments[0];
  const primaryCourse = primaryEnrollment?.courseId;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10 animate-fade-in">
      {/* 1. GREETING & METRIC STRIP */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-subtle pb-6">
          <div className="space-y-2">
            <span className="kicker block">
              › 01 / WORKBENCH · AT THE MACHINE
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-primary tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Developer'}.
            </h1>
            <p className="text-xs sm:text-sm text-secondary flex items-center gap-2 font-mono">
              <span className="text-muted">FOCUS:</span>
              <span className="text-primary font-semibold">
                {user?.preferences?.learningGoal || 'Full Stack Software Engineer'}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/catalog"
              className="btn-pill text-xs"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>BROWSE CURRICULA</span>
            </Link>
          </div>
        </div>

        {/* 4-Metric Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="craft-card p-4 space-y-1">
            <span className="kicker text-[10px]">› TRACKS</span>
            <div className="text-2xl font-bold font-mono text-primary">{enrollments.length}</div>
            <span className="text-[11px] text-muted font-mono">Enrolled Curricula</span>
          </div>
          <div className="craft-card p-4 space-y-1">
            <span className="kicker text-[10px]">› STREAK</span>
            <div className="text-2xl font-bold font-mono text-amber-400">{user?.streak || 0}d</div>
            <span className="text-[11px] text-muted font-mono">Consecutive Days</span>
          </div>
          <div className="craft-card p-4 space-y-1">
            <span className="kicker text-[10px]">› REPUTATION</span>
            <div className="text-2xl font-bold font-mono text-sky-400">{user?.xp || 0} XP</div>
            <span className="text-[11px] text-muted font-mono">Calibrated Skills</span>
          </div>
          <div className="craft-card p-4 space-y-1">
            <span className="kicker text-[10px]">› VERIFIED</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">{skills.length}</div>
            <span className="text-[11px] text-muted font-mono">Skill Checkpoints</span>
          </div>
        </div>
      </div>

      {/* 2. CONTINUE LEARNING HERO */}
      {primaryCourse ? (
        <div className="craft-card p-6 sm:p-8 space-y-6 border border-subtle hover:border-highlight transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3.5 max-w-2xl">
              <span className="kicker">
                › IN PROGRESS TRACK · 01 THINK · 02 DESIGN · 03 BUILD · 04 SHIP
              </span>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
                  {primaryCourse.title}
                </h2>
                <p className="text-xs sm:text-sm text-secondary mt-1.5 leading-relaxed line-clamp-2">
                  {primaryCourse.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-1 max-w-lg font-mono">
                <div className="flex justify-between text-xs">
                  <span className="text-muted">CURRICULUM COMPLETION</span>
                  <span className="text-primary font-bold">
                    {primaryEnrollment.percentComplete || 0}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-elevated overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${primaryEnrollment.percentComplete || 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center shrink-0">
              <Link
                to={`/courses/${primaryCourse.slug}`}
                className="btn-pill-primary px-6 py-2.5 text-xs inline-flex items-center gap-2"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>RESUME TRACK</span>
                <span>↗</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No Active Curricula"
          description="Select an engineering track to begin hands-on lessons, notes, and coding drills."
          actionLabel="Browse Course Catalog"
          actionUrl="/catalog"
        />
      )}

      {/* 3. EXPLAINABLE RECOMMENDATION */}
      {recommendation && (
        <div className="craft-card p-6 space-y-3 border border-subtle bg-surface-elevated/40">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <span className="kicker">
                › RECOMMENDED NEXT DRILL
              </span>
              <h3 className="text-base sm:text-lg font-bold text-primary">
                {recommendation.title}
              </h3>
              <div className="flex items-start gap-2 text-xs text-secondary bg-surface p-3 rounded-lg border border-subtle font-mono">
                <span className="text-primary font-bold shrink-0">WHY:</span>
                <span>{recommendation.reason}</span>
              </div>
            </div>

            <Link
              to={recommendation.actionUrl}
              className="btn-pill-primary shrink-0 self-start lg:self-center text-xs"
            >
              <span>START DRILL</span>
              <span>↗</span>
            </Link>
          </div>
        </div>
      )}

      {/* 4. SKILLS CONFIDENCE BREAKDOWN */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-primary tracking-wide font-mono flex items-center gap-2">
              <Zap className="h-4 w-4 text-sky-400" />
              VERIFIABLE SKILL CONFIDENCE PROFILE
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Calibrated from quizzes and isolated sandbox coding drills.
            </p>
          </div>
          <Link
            to="/profile"
            className="text-xs font-mono text-primary hover:underline shrink-0 font-semibold"
          >
            VIEW PROFILE →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.length > 0 ? (
            skills.map((s) => (
              <SkillCard key={s._id || s.skillSlug} skill={s} className="w-full" />
            ))
          ) : (
            <div className="col-span-full p-8 text-center text-muted text-xs font-mono border border-dashed border-subtle rounded-xl craft-card">
              Complete quizzes and coding drills to generate verified skill evidence.
            </div>
          )}
        </div>
      </div>

      {/* 5. CAPSTONE ENGINEERING PROJECTS */}
      {projects.length > 0 && (
        <ContentRail
          title="Capstone Engineering Projects"
          subtitle="Combine your skills into production-ready software architectures"
          icon={<Terminal className="h-4 w-4 text-primary" />}
          badge="PROVE"
        >
          {projects.map((proj) => (
            <ProjectCard key={proj.slug || proj._id} project={proj} />
          ))}
        </ContentRail>
      )}
    </div>
  );
};
