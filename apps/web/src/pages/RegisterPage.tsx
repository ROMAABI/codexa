import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { GoogleAuthButton } from '../components/GoogleAuthButton';
import { CodexaLogo } from '../components/ui/CodexaLogo';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const RegisterPage: React.FC = () => {
  useDocumentTitle('Join Codexa');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [learningGoal, setLearningGoal] = useState('Full Stack Software Engineer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiFetch<any>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
          learningGoal,
        }),
      });
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative animate-fade-in">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left: Platform Value Proposition */}
        <div className="space-y-6 hidden md:block pr-4">
          <div className="space-y-3">
            <span className="kicker block">
              › 01 / ONBOARDING · PRACTITIONER PATH
            </span>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-primary">
              Build your technical track record.
            </h1>
            <p className="text-xs lg:text-sm text-secondary leading-relaxed font-sans">
              Join engineers leveling up with hands-on practice, verified masterclasses, and real-time guidance from our anti-spoiler AI Mentor.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <div className="craft-card p-3 flex items-start gap-3.5">
              <span className="step-index mt-0.5">01</span>
              <div>
                <h4 className="text-xs font-bold text-primary font-mono uppercase">Industry Curricula</h4>
                <p className="text-[11px] text-muted font-sans">Full-stack, backend architecture, algorithms, and cloud systems</p>
              </div>
            </div>

            <div className="craft-card p-3 flex items-start gap-3.5">
              <span className="step-index mt-0.5">02</span>
              <div>
                <h4 className="text-xs font-bold text-primary font-mono uppercase">Monaco Sandbox</h4>
                <p className="text-[11px] text-muted font-sans">Write and run code in isolated sandboxes directly in your browser</p>
              </div>
            </div>

            <div className="craft-card p-3 flex items-start gap-3.5">
              <span className="step-index mt-0.5">03</span>
              <div>
                <h4 className="text-xs font-bold text-primary font-mono uppercase">NVIDIA NIM AI Mentor</h4>
                <p className="text-[11px] text-muted font-sans">Socratic debugging hints powered by NVIDIA NIM without spoiling answers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Registration Form */}
        <div className="space-y-4">
          <div className="space-y-1.5 md:text-left text-center">
            <div className="flex items-center md:justify-start justify-center mb-1">
              <CodexaLogo size="sm" />
            </div>
            <span className="kicker block">› ONBOARDING</span>
            <h2 className="text-2xl font-bold tracking-tight text-primary">Create your Codexa Account</h2>
            <p className="text-xs text-muted">
              Start learning with interactive challenges and calibrated feedback
            </p>
          </div>

          <div className="craft-card p-6 md:p-8 space-y-4">
            {/* Google OAuth Button */}
            <GoogleAuthButton mode="signup" />

            {/* Subtle Divider */}
            <div className="relative flex items-center justify-center my-2">
              <div className="w-full border-t border-slate-200/80 dark:border-white/10" />
              <span className="absolute px-3 bg-surface dark:bg-[#0c121e] text-[10px] font-mono uppercase text-muted tracking-widest">
                or with email
              </span>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-xs text-danger font-mono animate-fade-in">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-secondary uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field font-mono"
                  placeholder="Alex Morgan"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-secondary uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field font-mono"
                  placeholder="alex@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-secondary uppercase">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field font-mono"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-secondary uppercase">Primary Learning Goal</label>
                <select
                  value={learningGoal}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  className="input-field font-mono text-xs"
                >
                  <option value="Full Stack Software Engineer">Full Stack Software Engineer</option>
                  <option value="Backend Systems Engineer">Backend Systems Engineer</option>
                  <option value="Frontend Specialist">Frontend Specialist</option>
                  <option value="Computer Science Student">Computer Science Student</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-pill-primary w-full py-2.5 text-xs font-bold inline-flex items-center justify-center gap-2"
              >
                <span>{loading ? 'CREATING ACCOUNT...' : 'BEGIN LEARNING'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-muted font-mono">
            Already have an account?{' '}
            <Link to="/login" className="text-primary underline font-semibold transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
