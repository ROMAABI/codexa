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
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-primary">
              Build your technical track record.
            </h1>
            <p className="text-xs lg:text-sm text-secondary leading-relaxed">
              Join engineers leveling up with hands-on practice, verified masterclasses, and real-time guidance from our anti-spoiler AI Mentor.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <div className="craft-card p-3 flex items-start gap-3.5">
              <span className="text-xs font-semibold text-accent mt-0.5 shrink-0">01</span>
              <div>
                <h4 className="text-xs font-semibold text-primary">Industry Curricula</h4>
                <p className="text-xs text-muted">Full-stack, backend architecture, algorithms, and cloud systems</p>
              </div>
            </div>

            <div className="craft-card p-3 flex items-start gap-3.5">
              <span className="text-xs font-semibold text-accent mt-0.5 shrink-0">02</span>
              <div>
                <h4 className="text-xs font-semibold text-primary">Monaco Sandbox</h4>
                <p className="text-xs text-muted">Write and run code in isolated sandboxes directly in your browser</p>
              </div>
            </div>

            <div className="craft-card p-3 flex items-start gap-3.5">
              <span className="text-xs font-semibold text-accent mt-0.5 shrink-0">03</span>
              <div>
                <h4 className="text-xs font-semibold text-primary">NVIDIA NIM AI Mentor</h4>
                <p className="text-xs text-muted">Socratic debugging hints powered by NVIDIA NIM without spoiling answers</p>
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
              <span className="absolute px-3 bg-surface dark:bg-[#0c121e] text-xs text-muted">
                or with email
              </span>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-xs text-danger animate-fade-in">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-secondary">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="Alex Morgan"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-secondary">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="alex@example.com"
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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-secondary">Primary Learning Goal</label>
                <select
                  value={learningGoal}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  className="input-field text-xs"
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
                className="btn btn-primary w-full py-2.5 text-xs font-bold inline-flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Creating account...' : 'Begin Learning'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-muted">
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
