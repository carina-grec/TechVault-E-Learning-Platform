import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'techvault.auth';
const BASE_KEY = 'techvault.baseUrl';
const DEFAULT_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [baseUrl, setBaseUrlState] = useState(() => localStorage.getItem(BASE_KEY) || DEFAULT_BASE);
  const [auth, setAuthState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const persistAuth = useCallback((next) => {
    setAuthState(next);
    if (next && next.token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const setBaseUrl = useCallback((url) => {
    setBaseUrlState(url);
    localStorage.setItem(BASE_KEY, url);
  }, []);

  const request = useCallback(
    async (path, { method = 'GET', data, headers = {}, skipAuth = false } = {}) => {
      const finalHeaders = { ...headers };
      let body = data;

      const isFormData = data instanceof FormData;
      if (!isFormData && data !== undefined && data !== null) {
        finalHeaders['Content-Type'] = finalHeaders['Content-Type'] || 'application/json';
        body = typeof data === 'string' ? data : JSON.stringify(data);
      } else if (isFormData && finalHeaders['Content-Type']) {
        delete finalHeaders['Content-Type'];
      }

      if (!skipAuth && auth?.token) {
        finalHeaders.Authorization = `Bearer ${auth.token}`;
        if (auth?.user?.id) {
          finalHeaders['X-User-Id'] = auth.user.id;
        }
        if (auth?.user?.role) {
          finalHeaders['X-User-Role'] = auth.user.role;
        }
      }

      const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: finalHeaders,
        body: isFormData ? data : body,
      });

      if (!response.ok) {
        let message = await response.text();
        try {
          const parsed = JSON.parse(message);
          message = parsed.message || JSON.stringify(parsed);
        } catch {
          // keep plain text
        }
        throw new Error(message || `HTTP ${response.status}`);
      }

      if (response.status === 204) {
        return null;
      }

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return response.json();
      }
      return response.text();
    },
    [auth, baseUrl],
  );

  const login = useCallback(
    async (credentials) => {
      const result = await request('/api/auth/login', {
        method: 'POST',
        data: credentials,
        skipAuth: true,
      });
      persistAuth(result);
      return result;
    },
    [persistAuth, request],
  );

  const register = useCallback(
    async (payload) => {
      const result = await request('/api/auth/register', {
        method: 'POST',
        data: payload,
        skipAuth: true,
      });
      persistAuth(result);
      return result;
    },
    [persistAuth, request],
  );

  const logout = useCallback(() => persistAuth(null), [persistAuth]);

  const value = useMemo(
    () => ({
      auth,
      isAuthenticated: Boolean(auth?.token),
      baseUrl,
      setBaseUrl,
      login,
      register,
      logout,
      request,
    }),
    [auth, baseUrl, login, logout, register, request, setBaseUrl],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
