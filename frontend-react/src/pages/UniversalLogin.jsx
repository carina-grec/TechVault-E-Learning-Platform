import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Card from '../components/Card.jsx';
import Input from '../components/Input.jsx';
import { Button } from '../components/Button.jsx';
import { Badge } from '../components/Badge.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const roleOptions = [
  { label: 'Learner', value: 'LEARNER' },
  { label: 'Guardian', value: 'GUARDIAN' },
  { label: 'Admin', value: 'ADMIN' },
];

const roleRedirect = {
  LEARNER: '/',
  GUARDIAN: '/guardian',
  ADMIN: '/admin/cms',
};

export default function UniversalLogin() {
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('LEARNER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState('');
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();
  const { login, register, isAuthenticated, user, setError, error } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(roleRedirect[user.role] || '/');
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
        await register({
          email,
          password,
          role,
          displayName,
          age: age ? Number(age) : null,
          username: username || email,
        });
        setStatus('Account created. Redirecting...');
      }
    } catch (err) {
      console.error(err);
      setError?.(err);
      setStatus(err.message);
    }
  };

  return (
    <MainLayout hideChrome>
      <div className="flex min-h-[80vh] flex-col items-center justify-center">
        <Card className="w-full max-w-xl shadow-depth border border-onyx/10">
          <div className="flex flex-col items-center gap-2 pb-6 text-center">
            <div className="flex items-center gap-2">
              <Badge variant="accent">Stitch</Badge>
              <p className="font-display text-2xl font-bold text-onyx dark:text-softGold">TechVault</p>
            </div>
            <h1 className="text-3xl font-display font-bold text-onyx dark:text-softGold">
              {mode === 'login' ? 'Log in to your account' : 'Create your account'}
            </h1>
            <p className="text-mutedSilver">Choose your role and continue.</p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <p className="mb-2 text-sm font-semibold text-onyx dark:text-softGold">I am a...</p>
              <div className="grid grid-cols-3 gap-2 rounded-lg border border-onyx/10 bg-stone/40 p-2 dark:border-mutedSilver/20 dark:bg-onyx">
                {roleOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={role === option.value ? 'accent' : 'secondary'}
                    className="w-full"
                    onClick={() => setRole(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Input id="login-email" label="Email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input id="login-password" type="password" label="Password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              {mode === 'register' && (
                <div className="space-y-3">
                  <Input id="display-name" label="Display name" placeholder="Alex Coder" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                  <Input id="username" label="Username" placeholder="@techvault" value={username} onChange={(e) => setUsername(e.target.value)} />
                  <Input id="age" label="Age" type="number" placeholder="12" value={age} onChange={(e) => setAge(e.target.value)} />
                </div>
              )}
            </div>
            <Button className="w-full" variant="success" type="submit">
              {mode === 'login' ? `Log In as ${role.toLowerCase()}` : `Sign Up as ${role.toLowerCase()}`}
            </Button>
            <div className="flex flex-col items-center gap-2 text-sm text-mutedSilver">
              <button type="button" className="underline hover:text-onyx dark:hover:text-softGold" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
                {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Log in'}
              </button>
              {(status || error) && <span className="text-xs text-accentRose">{status || error?.message}</span>}
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}
