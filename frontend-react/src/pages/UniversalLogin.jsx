import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function UniversalLogin({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState('LEARNER'); // Default for register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState('');
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();
  const { login, register, isAuthenticated, user, setError, error } = useAuth();

  const roleRedirect = {
    LEARNER: '/',
    GUARDIAN: '/guardian',
    ADMIN: '/admin/cms',
  };

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const isChildRegistration = React.useRef(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const isUnder13 = (user.age !== undefined && user.age !== null && Number(user.age) < 13) || isChildRegistration.current;
      const isPending = user.status === 'PENDING_CONSENT';

      if (isPending || isUnder13) {
        navigate('/coppa-verification');
      } else {
        navigate(roleRedirect[user.role] || '/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      if (mode === 'login') {
        await login(email, password);
        setStatus('Welcome back! Redirecting...');
      } else {
        const regAge = age ? Number(age) : null;

        // Flag as child registration before calling API to prevent race condition in useEffect
        if (regAge && regAge < 13) {
          isChildRegistration.current = true;
        }

        const res = await register({
          email,
          password,
          role,
          displayName,
          age: regAge,
          username: username || email,
        });

        // Manual COPPA check if backend doesn't set status immediately
        if (regAge && regAge < 13) {
          navigate('/coppa-verification');
          return;
        }

        setStatus('Account created. Redirecting...');
      }
    } catch (err) {
      console.error(err);
      setError?.(err);
      setStatus(err.message);
    }
  };

  const toggleMode = () => setMode(mode === 'login' ? 'register' : 'login');

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-indigo-50 p-4 font-display">
      <div className="layout-content-container w-full max-w-md flex-1 flex flex-col items-center justify-center">
        <div className="w-full rounded-xl border-2 border-slate-900 bg-white p-6 sm:p-8 shadow-[8px_8px_0px_#1e293b]">
          <div className="flex flex-col items-center gap-2 pb-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-4xl text-slate-900">pinch</span>
              <span className="font-display text-4xl font-bold text-slate-900">TechVault</span>
            </div>
            <h1 className="text-slate-900 tracking-tight text-2xl font-bold leading-tight text-center">
              {mode === 'login' ? 'Log in to your account' : 'Create an account'}
            </h1>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div>
                <p className="text-slate-900 text-base font-medium leading-normal pb-2 px-1">I am a...</p>
                <div className="flex p-1">
                  <div className="flex h-12 flex-1 items-center justify-center rounded-lg border-2 border-slate-900 bg-slate-100 p-1 shadow-[inset_2px_2px_0px_#e2e8f0]">
                    {['Learner', 'Guardian', 'Admin'].map((r) => {
                      const val = r.toUpperCase();
                      const isChecked = role === val;
                      return (
                        <label key={val} className={`flex cursor-pointer h-full grow items-center justify-center rounded-md px-2 text-slate-900 text-sm font-bold leading-normal transition-all duration-150 ease-in-out ${isChecked ? 'bg-lime-300 shadow-[4px_4px_0px_#0f172a] -translate-x-[2px] -translate-y-[2px] border-2 border-slate-900' : ''}`}>
                          <span className="truncate">{r}</span>
                          <input
                            className="invisible w-0 absolute"
                            type="radio"
                            name="role-selector"
                            value={val}
                            checked={isChecked}
                            onChange={() => setRole(val)}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div className="flex flex-col w-full gap-4">
                <label className="flex flex-col w-full">
                  <p className="text-slate-900 text-base font-medium leading-normal pb-2 px-1">Display Name</p>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-400 border-2 border-slate-900 bg-white h-14 placeholder:text-slate-500 p-[15px] text-base font-normal leading-normal shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#0f172a] transition-all"
                    placeholder="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </label>
                <label className="flex flex-col w-full">
                  <p className="text-slate-900 text-base font-medium leading-normal pb-2 px-1">Username</p>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-400 border-2 border-slate-900 bg-white h-14 placeholder:text-slate-500 p-[15px] text-base font-normal leading-normal shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#0f172a] transition-all"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </label>
                <label className="flex flex-col w-full">
                  <p className="text-slate-900 text-base font-medium leading-normal pb-2 px-1">Age</p>
                  <input
                    type="number"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-400 border-2 border-slate-900 bg-white h-14 placeholder:text-slate-500 p-[15px] text-base font-normal leading-normal shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#0f172a] transition-all"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </label>
              </div>
            )}

            <div className="flex w-full flex-col gap-4">
              <label className="flex flex-col w-full">
                <p className="text-slate-900 text-base font-medium leading-normal pb-2 px-1">Email</p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-400 border-2 border-slate-900 bg-white h-14 placeholder:text-slate-500 p-[15px] text-base font-normal leading-normal shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#0f172a] transition-all"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label className="flex flex-col w-full">
                <p className="text-slate-900 text-base font-medium leading-normal pb-2 px-1">Password</p>
                <input
                  type="password"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-400 border-2 border-slate-900 bg-white h-14 placeholder:text-slate-500 p-[15px] text-base font-normal leading-normal shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#0f172a] transition-all"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="flex h-14 w-full items-center justify-center rounded-lg border-2 border-slate-900 bg-lime-300 px-6 text-center text-base font-bold text-slate-900 shadow-[4px_4px_0px_#1e293b] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0px_#1e293b] transition-all"
              >
                <span>{mode === 'login' ? 'Log In' : 'Sign Up'}</span>
              </button>
            </div>

            {(status || error) && <span className="text-xs text-red-600 text-center">{status || error?.message}</span>}
          </form>

          <div className="flex flex-col items-center justify-center gap-3 pt-6 text-center">
            <button className="text-slate-900 text-sm font-medium underline hover:text-primary">Forgot your password?</button>
            <button onClick={toggleMode} className="text-slate-900 text-sm font-medium">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <span className="font-bold underline hover:text-primary">{mode === 'login' ? 'Sign up' : 'Log in'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
