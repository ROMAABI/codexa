import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserDTO } from '@codexa/shared';
import { apiFetch } from '../api/client';

interface AuthContextType {
  user: UserDTO | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: UserDTO) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('codexa_token'));
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const userData = await apiFetch<any>('/auth/me');
      setUser({
        id: userData._id || userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        xp: userData.xp,
        streak: userData.streak,
        createdAt: userData.createdAt,
      });
    } catch (err) {
      console.error('Failed to fetch user:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, [token]);

  const login = (newToken: string, newUser: UserDTO) => {
    localStorage.setItem('codexa_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('codexa_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
