import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeSelector } from './ThemeSelector';
import { CodexaLogo } from './ui/CodexaLogo';
import {
  Compass,
  LayoutDashboard,
  Flame,
  Zap,
  Sparkles,
  LogOut,
  ShieldAlert,
  Search,
  User,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  onToggleAIMentor?: () => void;
  isAIMentorOpen?: boolean;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleAIMentor,
  isAIMentorOpen,
  onOpenSearch,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-subtle bg-surface/90 dark:bg-[#0b101b]/90 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Section: Logo & Nav Links */}
        <div className="flex items-center gap-6">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="md:hidden p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-elevated transition"
            aria-label="Toggle Navigation"
          >
            {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex items-center group">
            <CodexaLogo size="sm" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-mono">
            <Link
              to="/catalog"
              className={`flex items-center gap-1.5 h-8 px-3 rounded-lg transition ${
                isActive('/catalog')
                  ? 'bg-surface-elevated text-accent font-semibold border border-subtle'
                  : 'text-secondary hover:text-primary hover:bg-surface-elevated/50 font-medium'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>CURRICULA</span>
            </Link>

            {user && (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1.5 h-8 px-3 rounded-lg transition ${
                    isActive('/dashboard')
                      ? 'bg-surface-elevated text-accent font-semibold border border-subtle'
                      : 'text-secondary hover:text-primary hover:bg-surface-elevated/50 font-medium'
                  }`}
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>DASHBOARD</span>
                </Link>

                <Link
                  to="/profile"
                  className={`flex items-center gap-1.5 h-8 px-3 rounded-lg transition ${
                    isActive('/profile')
                      ? 'bg-surface-elevated text-accent font-semibold border border-subtle'
                      : 'text-secondary hover:text-primary hover:bg-surface-elevated/50 font-medium'
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  <span>DEVELOPER</span>
                </Link>

                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className={`flex items-center gap-1.5 h-8 px-3 rounded-lg transition ${
                      isActive('/admin')
                        ? 'bg-warning/15 text-warning font-semibold border border-warning/30'
                        : 'text-secondary hover:text-warning hover:bg-warning/10 font-medium'
                    }`}
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>STUDIO</span>
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>

        {/* Center: Global Search Bar Trigger (hidden on auth pages) */}
        {!isAuthPage && (
          <div className="flex-1 max-w-sm hidden sm:block">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between h-8 px-3 rounded-lg bg-surface border border-subtle text-muted hover:text-primary hover:border-border text-xs font-mono transition cursor-pointer"
            >
              <span className="flex items-center gap-2 truncate">
                <Search className="h-3.5 w-3.5 text-muted shrink-0" />
                <span className="truncate">Search curricula, docs, drills...</span>
              </span>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-elevated border border-subtle text-muted shrink-0">
                ⌘K
              </kbd>
            </button>
          </div>
        )}

        {/* Right Section: Stats, AI Mentor, Theme, User Menu */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button (hidden on auth pages) */}
          {!isAuthPage && (
            <button
              onClick={onOpenSearch}
              className="sm:hidden flex items-center justify-center h-8 w-8 rounded-lg text-secondary hover:text-primary hover:bg-surface-elevated transition"
              aria-label="Search"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Theme Selector */}
          <ThemeSelector variant="compact" />

          {user ? (
            <>
              {/* Gamification Stats */}
              <div className="hidden lg:flex items-center gap-2">
                <div
                  title="Daily Learning Streak"
                  className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono font-semibold"
                >
                  <Flame className="h-3.5 w-3.5 fill-amber-500/20 shrink-0" />
                  <span>{user.streak || 0}d</span>
                </div>
                <div
                  title="Total Experience Points"
                  className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-500 text-xs font-mono font-semibold"
                >
                  <Zap className="h-3.5 w-3.5 fill-sky-500/20 shrink-0" />
                  <span>{user.xp || 0} XP</span>
                </div>
              </div>

              {/* AI Mentor Trigger */}
              {onToggleAIMentor && (
                <button
                  onClick={onToggleAIMentor}
                  className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-mono font-semibold border transition cursor-pointer ${
                    isAIMentorOpen
                      ? 'bg-sky-500 text-white border-sky-400 shadow-xs'
                      : 'bg-surface-elevated text-sky-500 dark:text-sky-400 border-sky-500/30 hover:bg-sky-500/10 hover:border-sky-400'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden sm:inline">AI MENTOR</span>
                </button>
              )}

              {/* User Avatar Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 h-8 pl-2.5 pr-1.5 rounded-lg bg-surface-elevated border border-subtle hover:border-highlight transition cursor-pointer"
                >
                  <span className="text-xs font-mono font-semibold text-primary hidden sm:inline">
                    {user.name.split(' ')[0]}
                  </span>
                  <div className="h-5 w-5 rounded bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-[10px] font-mono shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted shrink-0" />
                </button>

                {isUserMenuOpen && (
                  <div
                    onClick={() => setIsUserMenuOpen(false)}
                    className="absolute right-0 mt-2 w-52 rounded-xl craft-card shadow-2xl p-1.5 space-y-1 z-50 text-xs font-mono"
                  >
                    <div className="px-3 py-2 border-b border-subtle">
                      <div className="font-bold text-primary truncate">{user.name}</div>
                      <div className="text-[10px] text-muted truncate">{user.email}</div>
                    </div>

                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-elevated transition"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-elevated transition"
                    >
                      <User className="h-3.5 w-3.5 text-sky-400" />
                      <span>Developer Profile</span>
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-amber-400 hover:bg-amber-500/10 transition"
                      >
                        <ShieldAlert className="h-3.5 w-3.5" />
                        <span>Curriculum Studio</span>
                      </Link>
                    )}

                    <div className="border-t border-subtle my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-danger hover:bg-danger/10 transition text-left cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 font-mono">
              <Link
                to="/login"
                className="flex items-center h-8 px-3 text-xs text-secondary hover:text-primary transition rounded-lg"
              >
                SIGN IN
              </Link>
              <Link
                to="/register"
                className="btn btn-primary h-8 px-3.5 text-xs flex items-center rounded-lg"
              >
                JOIN CODEXA
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileNavOpen && (
        <div className="md:hidden border-t border-subtle bg-surface px-4 py-4 space-y-2 animate-fade-in font-mono text-xs">
          <Link
            to="/catalog"
            onClick={() => setIsMobileNavOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-elevated"
          >
            <Compass className="h-4 w-4 text-sky-400" />
            <span>Curricula</span>
          </Link>

          {user && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsMobileNavOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-elevated"
              >
                <LayoutDashboard className="h-4 w-4 text-emerald-400" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsMobileNavOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-elevated"
              >
                <User className="h-4 w-4 text-purple-400" />
                <span>Developer Profile</span>
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-amber-400 hover:bg-amber-500/10"
                >
                  <ShieldAlert className="h-4 w-4" />
                  <span>Curriculum Studio</span>
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
