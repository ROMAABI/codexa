import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';
import { GoogleAuthButton } from '../components/GoogleAuthButton';
import { CodexaLogo } from '../components/ui/CodexaLogo';
import {
  ArrowRight,
  PlayCircle,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Terminal,
  Flame,
  Zap,
} from 'lucide-react';

import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const LoginPage: React.FC = () => {
  useDocumentTitle('Sign In');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiFetch<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative animate-fade-in">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left: Platform Overview / 4-Step Loop */}
        <div className="space-y-6 hidden md:block pr-4">
          <div className="space-y-3">
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-primary">
              Engineering craft for practitioners.
            </h1>
            <p className="text-xs lg:text-sm text-secondary leading-relaxed">
              A four-stage learning loop: verified masterclasses, mental model notes, Monaco sandbox execution, and calibrated skill assessments.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <div className="craft-card p-3 flex items-center gap-3.5">
              <span className="text-xs font-semibold text-accent shrink-0">01</span>
              <div>
                <h4 className="text-xs font-semibold text-primary">Think / Masterclasses</h4>
                <p className="text-xs text-muted">Mental models and systems architecture walkthroughs</p>
              </div>
            </div>

            <div className="craft-card p-3 flex items-center gap-3.5">
              <span className="text-xs font-semibold text-accent shrink-0">02</span>
              <div>
                <h4 className="text-xs font-semibold text-primary">Design / Interactive Notes</h4>
                <p className="text-xs text-muted">Original tutorials with live syntax and code examples</p>
              </div>
            </div>

            <div className="craft-card p-3 flex items-center gap-3.5">
              <span className="text-xs font-semibold text-accent shrink-0">03</span>
              <div>
                <h4 className="text-xs font-semibold text-primary">Build / Monaco Practice</h4>
                <p className="text-xs text-muted">Browser Monaco sandbox with live test assertions</p>
              </div>
            </div>

            <div className="craft-card p-3 flex items-center gap-3.5">
              <span className="text-xs font-semibold text-accent shrink-0">04</span>
              <div>
                <h4 className="text-xs font-semibold text-primary">Ship / Assessments</h4>
                <p className="text-xs text-muted">Skill calibrations and capstone multi-file projects</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sign-In Card */}
        <div className="space-y-4">
          <div className="space-y-1.5 md:text-left text-center">
            <div className="flex items-center md:justify-start justify-center mb-1">
              <CodexaLogo size="sm" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-primary">Sign in to Codexa</h2>
            <p className="text-xs text-muted">
              Access your enrolled tracks, coding challenges, and AI mentor
            </p>
          </div>

          <div className="craft-card p-6 md:p-8 space-y-4">
            {/* Google OAuth Button */}
            <GoogleAuthButton mode="signin" />

            {/* Subtle Divider */}
            <div className="relative flex items-center justify-center my-2">
              <div className="w-full border-t border-slate-200/80 dark:border-white/10" />
              <span className="absolute px-3 bg-surface dark:bg-[#0c121e] text-xs text-muted">
                or with email
              </span>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-xs text-danger animate-fade-in">
                  {error}
                </div>
              )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-secondary">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="alex@codexa.dev"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-secondary">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-2.5 text-xs font-bold inline-flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
          </div>

          <p className="text-center text-xs text-muted">
            New to Codexa?{' '}
            <Link to="/register" className="text-primary underline font-semibold transition">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
