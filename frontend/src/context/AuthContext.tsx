'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<{ success: boolean; error?: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('shoption_jwt_token');
        const storedUser = localStorage.getItem('shoption_user_data');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verify & refresh profile with backend
          try {
            const res = await fetch('/api/auth/me', {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            });
            if (res.ok) {
              const freshUser: UserProfile = await res.json();
              setUser(freshUser);
              localStorage.setItem('shoption_user_data', JSON.stringify(freshUser));
            } else if (res.status === 401) {
              // Token expired
              logout();
            }
          } catch (fetchErr) {
            console.warn('Backend fetch failed during auth init, using cached user data', fetchErr);
          }
        }
      } catch (e) {
        console.error('Failed to parse stored auth session', e);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

function parseErrorMessage(detail: any, defaultMsg: string): string {
  if (!detail) return defaultMsg;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map((item: any) => (item?.msg ? `${item.loc ? item.loc.slice(-1)[0] + ': ' : ''}${item.msg}` : JSON.stringify(item))).join('; ');
  }
  if (typeof detail === 'object' && detail?.msg) {
    return String(detail.msg);
  }
  return defaultMsg;
}

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: parseErrorMessage(data.detail, 'Login failed. Please check your credentials.'),
        };
      }

      const authData = data as AuthResponse;
      setToken(authData.access_token);
      setUser(authData.user);

      localStorage.setItem('shoption_jwt_token', authData.access_token);
      localStorage.setItem('shoption_user_data', JSON.stringify(authData.user));

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Network error connecting to FastAPI backend.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: parseErrorMessage(data.detail, 'Registration failed. Please check your inputs.'),
        };
      }

      const authData = data as AuthResponse;
      setToken(authData.access_token);
      setUser(authData.user);

      localStorage.setItem('shoption_jwt_token', authData.access_token);
      localStorage.setItem('shoption_user_data', JSON.stringify(authData.user));

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Network error connecting to FastAPI backend.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('shoption_jwt_token');
    localStorage.removeItem('shoption_user_data');
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const freshUser: UserProfile = await res.json();
        setUser(freshUser);
        localStorage.setItem('shoption_user_data', JSON.stringify(freshUser));
      }
    } catch (e) {
      console.error('Failed to refresh user profile', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
