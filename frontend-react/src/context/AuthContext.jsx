import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client.js';

const AuthContext = createContext();
const TOKEN_KEY = 'techvault_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => (typeof window === 'undefined' ? null : window.localStorage.getItem(TOKEN_KEY)));
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    api
      .getCurrentUser(token)
      .then((me) => {
        if (cancelled) return;
        setUser(me);
      })
      .catch((err) => {
        console.error('Failed to load session', err);
        if (cancelled) return;
        logout();
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!token || !user) {
      setProfile(null);
      return;
    }
    let cancelled = false;
    api
      .getProfile(token)
      .then((p) => {
        if (!cancelled) setProfile(p);
      })
      .catch((err) => console.warn('Profile load failed', err));
    return () => {
      cancelled = true;
    };
  }, [token, user?.id]);

  const persistToken = (newToken) => {
    setToken(newToken);
    if (typeof window !== 'undefined') {
      if (newToken) {
        window.localStorage.setItem(TOKEN_KEY, newToken);
      } else {
        window.localStorage.removeItem(TOKEN_KEY);
      }
    }
  };

  const login = async (email, password) => {
    setError(null);
    const res = await api.login({ email, password });
    persistToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (payload) => {
    setError(null);
    const res = await api.register(payload);
    persistToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    persistToken(null);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (!token) return null;
    const p = await api.getProfile(token);
    setProfile(p);
    return p;
  };

  const value = {
    token,
    user,
    profile,
    loading,
    error,
    setError,
    login,
    register,
    logout,
    refreshProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
