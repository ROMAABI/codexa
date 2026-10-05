import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';
import { ThemeSelector } from '../components/ThemeSelector';
import {
  User,
  Zap,
  Flame,
  Award,
  BookOpen,
  Layers,
  Code2,
  CheckCircle2,
  Palette,
  Info,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const ProfilePage: React.FC = () => {
  useDocumentTitle('Developer Profile');
  const { user } = useAuth();
  const [skills, setSkills] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfileData() {
      try {
        const [sData, eData] = await Promise.all([
          apiFetch<any[]>('/skills/my-skills').catch(() => []),
          apiFetch<any[]>('/progress/my-courses').catch(() => []),
        ]);
        setSkills(sData || []);
        setEnrollments(eData || []);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfileData();
  }, []);

  const getSkillBadgeColor = (level: string) => {
    switch (level) {
      case 'MASTER':
        return 'text-success bg-success/10 border-success/30';
      case 'PROFICIENT':
        return 'text-accent bg-accent/10 border-accent/30';
      case 'COMPETENT':
        return 'text-warning bg-warning/10 border-warning/30';
      default:
        return 'text-muted bg-subtle border-subtle';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-10 animate-fade-in">
      {/* Developer Hero Card */}
      <div className="craft-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-surface-elevated border border-subtle text-primary flex items-center justify-center font-bold text-2xl font-mono shrink-0">
              {user?.name?.charAt(0) || 'D'}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                  {user?.name}
                </h1>
                <span className="tag-badge text-xs">
                  {user?.role || 'Developer'}
                </span>
              </div>
              <p className="text-xs text-muted flex flex-wrap items-center gap-2">
                <span className="text-primary">{user?.email}</span>
                <span>•</span>
                <span className="text-secondary">
                  Focus: {user?.preferences?.learningGoal || 'Full Stack Software Engineer'}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="craft-card px-5 py-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-bold">
                <Flame className="h-3.5 w-3.5" />
                <span>Streak</span>
              </div>
              <div className="text-xl font-bold text-primary mt-0.5">{user?.streak || 0}d</div>
              <span className="text-xs text-muted block mt-0.5">Consecutive</span>
            </div>

            <div className="craft-card px-5 py-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-sky-400 font-bold">
                <Zap className="h-3.5 w-3.5" />
                <span>Reputation</span>
              </div>
              <div className="text-xl font-bold text-primary mt-0.5">{user?.xp || 0} XP</div>
              <span className="text-xs text-muted block mt-0.5">Calibrated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Appearance & Theme Settings Section */}
      <div className="craft-card p-6 sm:p-8 space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-accent block">
            System Preferences
          </span>
          <h2 className="text-base font-bold text-primary flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            Appearance & Theme Preferences
          </h2>
          <p className="text-xs text-muted">
            Choose your preferred visual mode or let Codexa automatically match your operating system theme.
          </p>
        </div>

        {/* 3-Way Theme Selector Cards */}
        <ThemeSelector variant="cards" className="pt-2" />
      </div>

      {/* Grid: Skills + Projects & Active Tracks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Verified Skills Evidence */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-accent block">
                Verifiable Skill Confidence Profile
              </span>
              <span className="text-xs text-muted">EMA Calibrated</span>
            </div>
            <p className="text-xs text-muted font-sans">
              Confidence scores are dynamically recalculated based on your performance in quizzes and isolated sandbox coding challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skills.length > 0 ? (
              skills.map((s) => (
                <div
                  key={s._id}
                  className="craft-card-interactive p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted font-medium">
                      {s.category || 'Skill'}
                    </span>
                    <span
                      className={`text-xs uppercase px-2 py-0.5 rounded border font-semibold ${getSkillBadgeColor(
                        s.level
                      )}`}
                    >
                      {s.level}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-primary">{s.skillName || s.name || s.skillSlug}</h3>
                    <p className="text-xs text-muted mt-0.5">
                      {s.evidenceCount} verified checkpoint{s.evidenceCount === 1 ? '' : 's'}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">Mastery</span>
                      <span className="text-primary font-bold">{s.masteryScore}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-surface-elevated overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${s.masteryScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="sm:col-span-2 p-8 text-center text-muted text-xs border border-dashed border-subtle rounded-xl craft-card space-y-2">
                <Info className="h-5 w-5 text-primary mx-auto" />
                <p className="font-bold text-primary">No skill evidence recorded yet</p>
                <p>Complete quizzes and coding challenges in your enrolled courses to build your verified skill graph.</p>
              </div>
            )}
          </div>

          {/* Active Projects */}
          <div className="space-y-4 pt-4">
            <span className="text-xs font-semibold text-accent block">
              Capstone Projects
            </span>

            <div className="craft-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs text-muted block font-medium">
                  MERN Stack Capstone
                </span>
                <h3 className="text-sm font-bold text-primary">Full Stack Collaborative Task Platform</h3>
                <p className="text-xs text-secondary">
                  JWT authentication, MongoDB schema models, REST API security guards, and React frontend.
                </p>
              </div>

              <Link
                to="/projects/task-management-platform"
                className="btn btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5 shrink-0"
              >
                <span>Open Project IDE</span>
                <span>↗</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Enrolled Curricula */}
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-accent block">
              Active Tracks
            </span>
            <h2 className="text-sm font-bold text-primary flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              My Learning Tracks
            </h2>
            <p className="text-xs text-muted">Courses currently in progress</p>
          </div>

          <div className="space-y-3">
            {enrollments.length > 0 ? (
              enrollments.map((enr) => {
                const c = enr.courseId;
                if (!c) return null;
                return (
                  <div
                    key={enr._id}
                    className="craft-card-interactive p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted font-medium">
                        {c.level || 'Beginner'}
                      </span>
                      <span className="text-xs text-primary font-bold">
                        {enr.percentComplete || 0}%
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-primary">{c.title}</h3>

                    <div className="h-1 w-full rounded-full bg-surface-elevated overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${enr.percentComplete || 0}%` }}
                      />
                    </div>

                    <Link
                      to={`/courses/${c.slug}`}
                      className="btn btn-secondary w-full text-center text-xs block py-1.5 mt-2"
                    >
                      Resume Track
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-muted text-xs border border-dashed border-subtle rounded-xl craft-card space-y-3">
                <BookOpen className="h-5 w-5 text-primary mx-auto" />
                <p>No active courses yet.</p>
                <Link
                  to="/catalog"
                  className="btn btn-primary text-xs px-4 py-1.5 inline-flex items-center gap-1.5"
                >
                  <span>Browse Catalog</span>
                  <span>↗</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
