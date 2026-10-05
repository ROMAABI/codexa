import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { AIMentorDrawer } from './components/AIMentorDrawer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { DashboardPage } from './pages/DashboardPage';
import { CatalogPage } from './pages/CatalogPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { LessonWorkspacePage } from './pages/LessonWorkspacePage';
import { ProjectWorkspacePage } from './pages/ProjectWorkspacePage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="p-8 text-center text-xs font-mono text-muted">Authenticating...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [isAIMentorOpen, setIsAIMentorOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Cmd+K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-main text-primary relative overflow-x-hidden selection:bg-sky-500/20 selection:text-sky-200">
      {/* Ambient Atmospheric Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Top central aura */}
        <div className="absolute -top-[240px] left-1/2 -translate-x-1/2 w-[850px] h-[550px] rounded-full bg-gradient-to-b from-sky-500/20 via-blue-600/10 to-transparent blur-[120px] opacity-75 dark:opacity-40" />
        {/* Top-right subtle glow */}
        <div className="absolute top-[18%] -right-[150px] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-500/15 via-sky-500/10 to-transparent blur-[110px] opacity-60 dark:opacity-30" />
        {/* Bottom-left subtle glow */}
        <div className="absolute bottom-[12%] -left-[180px] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-cyan-500/15 via-blue-500/10 to-transparent blur-[120px] opacity-60 dark:opacity-30" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          onToggleAIMentor={user ? () => setIsAIMentorOpen((prev) => !prev) : undefined}
          isAIMentorOpen={isAIMentorOpen}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        <div className="flex-1">
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/catalog" replace />}
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/courses/:slug" element={<CourseDetailPage />} />
            <Route
              path="/courses/:slug/lesson/:lessonId"
              element={
                <ProtectedRoute>
                  <LessonWorkspacePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:slug"
              element={
                <ProtectedRoute>
                  <ProjectWorkspacePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>

        <AIMentorDrawer isOpen={isAIMentorOpen} onClose={() => setIsAIMentorOpen(false)} />
        <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
