import { useState } from 'react';
import SectionCard from './SectionCard';
import { useAuth } from '../context/AuthContext';

const defaultRegister = {
  email: '',
  password: '',
  role: 'LEARNER',
  displayName: '',
  age: 10,
  username: '',
};

function AuthPanel() {
  const { login, register, request, auth } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState(defaultRegister);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [me, setMe] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    setStatus('');
    setError('');
    try {
      const result = await login(loginForm);
      setStatus(`Welcome back, ${result.user.displayName || result.user.email}!`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setStatus('');
    setError('');
    try {
      const payload = {
        ...registerForm,
        age: registerForm.age ? Number(registerForm.age) : null,
      };
      const result = await register(payload);
      setStatus(`Registered ${result.user.email} as ${result.user.role}`);
      setRegisterForm(defaultRegister);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchMe = async () => {
    setStatus('');
    setError('');
    try {
      const profile = await request('/api/auth/me');
      setMe(profile);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <SectionCard title="Authentication" description="Register, login, and inspect the current JWT session.">
      <form onSubmit={handleLogin}>
        <h3>Login</h3>
        <input
          placeholder="Email"
          type="email"
          value={loginForm.email}
          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          value={loginForm.password}
          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
        />
        <button className="btn" type="submit">
          Login
        </button>
      </form>

      <form onSubmit={handleRegister} style={{ marginTop: '1rem' }}>
        <h3>Register</h3>
        <input
          placeholder="Email"
          type="email"
          value={registerForm.email}
          onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          value={registerForm.password}
          onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
        />
        <input
          placeholder="Display name"
          value={registerForm.displayName}
          onChange={(e) => setRegisterForm({ ...registerForm, displayName: e.target.value })}
        />
        <input
          placeholder="Username"
          value={registerForm.username}
          onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
        />
        <input
          placeholder="Age"
          type="number"
          min={5}
          value={registerForm.age}
          onChange={(e) => setRegisterForm({ ...registerForm, age: e.target.value })}
        />
        <select
          value={registerForm.role}
          onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
        >
          <option value="LEARNER">Learner</option>
          <option value="GUARDIAN">Guardian</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button className="btn secondary" type="submit">
          Register & Login
        </button>
      </form>

      <div className="button-row" style={{ marginTop: '0.75rem' }}>
        <button className="btn" onClick={fetchMe} disabled={!auth?.token}>
          Call /api/auth/me
        </button>
      </div>

      {status && <p className="success-text">{status}</p>}
      {error && <p className="error-text">{error}</p>}
      {me && (
        <div className="json-preview">
          <pre>{JSON.stringify(me, null, 2)}</pre>
        </div>
      )}
    </SectionCard>
  );
}

export default AuthPanel;
