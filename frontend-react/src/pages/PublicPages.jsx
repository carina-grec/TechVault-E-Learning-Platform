import { useState } from 'react'
import { MascotBubble } from '../components/MascotBubble'

export function LandingPage({ navigate, vaults = [], steps = [], adminCTA, mascot }) {
  const featured = vaults.filter((vault) => vault.featured).slice(0, 3)
  return (
    <div className="content-shell">
      <section className="hero">
        <p className="pill">Kid-friendly coding quests</p>
        <h1>TechVault Kids turns code lessons into magical adventures.</h1>
        <p>
          Explore Pixel Forest, Algorithm Ocean, and Matrix Mountain while solving quests guided by
          playful mascots, sparkly XP bars, and safe async grading moments.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => navigate('/register')}>
            Start a quest
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/login')}>
            I already have a map
          </button>
        </div>
        <div className="mascot-chip">Streak-safe, auto-saving progress</div>
      </section>

      <MascotBubble mascot={mascot} mood="idle" message="Hi! I am Pixel. Pick a vault and I will trail sparkles on your code." />

      <section className="grid two">
        {featured.map((vault) => {
          const iconLabel = vault.category.slice(0, 2).toUpperCase()
          return (
            <article key={vault.id} className="card">
              <div className="quest-row">
                <div className="quest-icon">{iconLabel}</div>
                <div>
                  <h3>{vault.title}</h3>
                  <p>{vault.description}</p>
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${Math.round((vault.completedQuests / vault.totalQuests) * 100)}%` }}
                />
              </div>
              <small>
                {vault.completedQuests}/{vault.totalQuests} quests complete | Guide: {vault.mascot}
              </small>
            </article>
          )
        })}
      </section>

      <section className="card">
        <h3>How TechVault Kids works</h3>
        <div className="grid three">
          {steps.map((step) => (
            <article key={step.id}>
              <div className="pill">{step.title}</div>
              <p>{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <p className="pill">Control room</p>
        <h3>{adminCTA?.title}</h3>
        <p>{adminCTA?.detail}</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>
          Launch admin console
        </button>
      </section>
    </div>
  )
}

export function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = onLogin(form)
    setIsError(!result.success)
    setMessage(result.message)
  }

  return (
    <div className="content-shell">
      <section className="card" style={{ maxWidth: 520, margin: '2rem auto' }}>
        <h2>Welcome back adventurer</h2>
        <p>Pixel Fox saved your XP. Log in to continue the quest.</p>
        {message && (
          <div className={`inline-banner ${isError ? 'error' : 'success'}`}>{message}</div>
        )}
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            />
          </div>
          <button className="btn btn-primary" type="submit">
            Log in
          </button>
        </form>
      </section>
    </div>
  )
}

export function RegisterPage({ onRegister }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'LEARNER',
    username: '',
    age: '',
  })
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const normalizedAge =
      form.role === 'LEARNER' ? Number.parseInt(form.age, 10) || 0 : null
    const result = onRegister({ ...form, age: normalizedAge })
    setIsError(!result.success)
    setMessage(result.message)
    if (result.success) {
      setForm({ name: '', email: '', password: '', role: 'LEARNER', username: '', age: '' })
    }
  }

  return (
    <div className="content-shell">
      <section className="card" style={{ maxWidth: 560, margin: '2rem auto' }}>
        <h2>Join TechVault Kids</h2>
        <p>Choose learner or guardian mode. Mascots unlock instantly after sign-up.</p>
        {message && (
          <div className={`inline-banner ${isError ? 'error' : 'success'}`}>{message}</div>
        )}
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="register-name">Full name</label>
            <input
              id="register-name"
              value={form.name}
              required
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="register-role">Role</label>
            <select
              id="register-role"
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
            >
              <option value="LEARNER">Learner</option>
              <option value="GUARDIAN">Guardian</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="register-username">Username</label>
            <input
              id="register-username"
              required
              value={form.username}
              onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
            />
            <small>Visible in leaderboards and guardian dashboards.</small>
          </div>
          {form.role === 'LEARNER' ? (
            <div className="form-group">
              <label htmlFor="register-age">Age</label>
              <input
                id="register-age"
                type="number"
                min="0"
                max="120"
                required
                value={form.age}
                onChange={(e) => setForm((prev) => ({ ...prev, age: e.target.value }))}
              />
              <small>We use age to determine if guardian consent is required.</small>
            </div>
          ) : null}
          <button className="btn btn-primary" type="submit">
            Create account
          </button>
        </form>
      </section>
    </div>
  )
}

export function LegalPage({ type = 'terms' }) {
  const title = type === 'privacy' ? 'Privacy & Safety' : 'Community Rules'
  return (
    <div className="content-shell legal">
      <h2>{title}</h2>
      <p>
        TechVault Kids collects only the data we need to save quests, award XP, and keep guardians
        in the loop. Your projects stay private and we never sell learner information.
      </p>
      <p>
        By exploring the vaults you agree to keep feedback kind, keep solutions respectful, and ask
        a guardian before sharing screenshots outside the app.
      </p>
      <p>
        Questions? Reach out at <a href="mailto:crew@techvaultkids.io">crew@techvaultkids.io</a>.
      </p>
    </div>
  )
}
