import { useEffect, useMemo, useState } from 'react'
import { MascotBubble } from '../components/MascotBubble'

export function LearnerDashboard({
  user,
  quests = [],
  vaults = [],
  submissions = [],
  badges = [],
  navigate,
  mascot,
  progress,
}) {
  const recentSubmissions = submissions.slice().reverse().slice(0, 3)
  const lastQuest = useMemo(() => {
    if (!recentSubmissions.length) return null
    const submission = recentSubmissions[0]
    return quests.find((quest) => quest.id === submission.questId)
  }, [recentSubmissions, quests])
  const xpPercent = progress?.xpPercent ?? 0
  const streakDays = progress?.streakDays ?? 0

  return (
    <div className="content-shell">
      <section className="card">
        <p className="pill">Welcome back</p>
        <h2>Hey {user?.name ?? 'Adventurer'}!</h2>
        <div className="grid two">
          <article>
            <p>XP progress</p>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${xpPercent}%` }} />
            </div>
            <small>{xpPercent}% to the next badge burst</small>
          </article>
          <article>
            <p>Daily streak</p>
            <strong style={{ fontSize: '2rem' }}>{streakDays} days</strong>
            <small>Keep it up for extra SparklePink XP!</small>
          </article>
        </div>
        {lastQuest ? (
          <div className="grid two" style={{ marginTop: '1rem' }}>
            <article className="card">
              <h3>Continue quest</h3>
              <p>{lastQuest.title}</p>
              <button className="btn btn-primary" onClick={() => navigate(`/app/quests/${lastQuest.id}`)}>
                Resume
              </button>
            </article>
            <article>
              <MascotBubble
                mascot={mascot}
                mood="thinking"
                message="Pixel saved your last quest. Want me to trail some hints?"
              />
            </article>
          </div>
        ) : (
          <article style={{ marginTop: '1rem' }}>
            <MascotBubble
              mascot={mascot}
              mood="idle"
              message="Pick any vault card below to start a shiny new story."
            />
          </article>
        )}
      </section>

      <section>
        <div className="grid two">
          {vaults.slice(0, 3).map((vault) => (
            <article key={vault.id} className="card">
              <div className="pill">{vault.category}</div>
              <h3>{vault.title}</h3>
              <p>{vault.description}</p>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${Math.round((vault.completedQuests / vault.totalQuests) * 100)}%`,
                  }}
                />
              </div>
              <div className="form-actions" style={{ justifyContent: 'space-between' }}>
                <small>
                  {vault.completedQuests}/{vault.totalQuests} quests
                </small>
                <button className="btn btn-secondary" onClick={() => navigate(`/app/vaults/${vault.id}`)}>
                  View Vault
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>Recent submissions</h3>
        {recentSubmissions.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Quest</th>
                <th>Status</th>
                <th>Score</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {recentSubmissions.map((submission) => (
                <tr key={submission.id}>
                  <td>{submission.questTitle}</td>
                  <td>
                    <span className={`status-pill ${submission.status.toLowerCase()}`}>
                      {submission.status === 'PENDING' ? 'Pending' : submission.result}
                    </span>
                  </td>
                  <td>{submission.score ?? '--'}</td>
                  <td>{new Date(submission.submittedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">No submissions yet.</div>
        )}
      </section>

      <section className="card">
        <h3>Badges</h3>
        <div className="badge-grid">
          {badges.map((badge) => (
            <article key={badge.id} className={`badge-card ${badge.unlocked ? '' : 'locked'}`}>
              <h4>{badge.name}</h4>
              <p>{badge.requirement}</p>
              <span className={`status-pill ${badge.unlocked ? 'completed' : 'pending'}`}>
                {badge.unlocked ? 'Unlocked' : 'Locked'}
              </span>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export function VaultsPage({ vaults = [], navigate }) {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('all')

  const filteredVaults = vaults.filter((vault) => {
    const matchesSearch = vault.title.toLowerCase().includes(search.toLowerCase())
    const matchesDifficulty = difficulty === 'all' || vault.difficulty === difficulty
    return matchesSearch && matchesDifficulty
  })

  return (
    <div className="content-shell">
      <section className="card">
        <h2>All vaults</h2>
        <p>Each vault is its own mini world with themed quests, art, and mascots.</p>
        <div className="grid two">
          <div className="form-group">
            <label htmlFor="vault-search">Search</label>
            <input
              id="vault-search"
              placeholder="Search by name or keyword"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="vault-difficulty">Difficulty</label>
            <select
              id="vault-difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="all">All</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </section>

      <section className="grid two">
        {filteredVaults.map((vault) => {
          const iconLabel = vault.category.slice(0, 2).toUpperCase()
          return (
            <article key={vault.id} className="card">
              <div className="quest-row">
                <div className="quest-icon">{iconLabel}</div>
              <div>
                <div className={`pill ${vault.difficulty.toLowerCase()}`}>{vault.difficulty}</div>
                <h3>{vault.title}</h3>
                <p>{vault.description}</p>
              </div>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${Math.round((vault.completedQuests / vault.totalQuests) * 100)}%`,
                }}
              />
            </div>
              <div className="form-actions" style={{ justifyContent: 'space-between' }}>
                <small>Guide: {vault.mascot}</small>
                <button className="btn btn-secondary" onClick={() => navigate(`/app/vaults/${vault.id}`)}>
                  Enter world
                </button>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}

export function VaultDetailPage({ vault, quests = [], submissions = [], navigate }) {
  if (!vault) {
    return (
      <div className="content-shell">
        <div className="empty-state">Vault not found.</div>
      </div>
    )
  }
  const items = quests.filter((quest) => quest.vaultId === vault.id)
  const iconLabel = vault.category.slice(0, 2).toUpperCase()
  return (
    <div className="content-shell">
      <section className="card">
        <div className="quest-row">
          <div className="quest-icon">{iconLabel}</div>
          <div>
            <p className="pill">{vault.category}</p>
            <h2>{vault.title}</h2>
            <p>{vault.description}</p>
          </div>
        </div>
        <p>{vault.heroHighlight}</p>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{
              width: `${Math.round((vault.completedQuests / vault.totalQuests) * 100)}%`,
            }}
          />
        </div>
        <small>Guided by: {vault.mascot}</small>
      </section>

      <section className="grid two">
        {items.map((quest) => {
          const submission = submissions.find((sub) => sub.questId === quest.id)
          const status = submission?.status === 'PENDING' ? 'pending' : submission?.result ? submission.result?.toLowerCase() : 'draft'
          return (
            <article key={quest.id} className="card">
              <div className="form-actions" style={{ justifyContent: 'space-between' }}>
                <div className={`pill ${quest.difficulty.toLowerCase()}`}>{quest.difficulty}</div>
                <span className={`status-pill ${status}`}>{submission ? submission.status === 'PENDING' ? 'Pending' : submission.result : 'Not started'}</span>
              </div>
              <h3>{quest.title}</h3>
              <p>{quest.description}</p>
              <button className="btn btn-primary" onClick={() => navigate(`/app/quests/${quest.id}`)}>
                {submission ? 'Resume' : 'Start Quest'}
              </button>
            </article>
          )
        })}
      </section>
    </div>
  )
}

export function QuestDetailPage({
  quest,
  submissions = [],
  onSubmit,
  isSubmitting,
  navigate,
  vault,
  mascot,
}) {
  const [activeTab, setActiveTab] = useState('description')
  const [code, setCode] = useState(quest?.starterCode ?? '')
  useEffect(() => {
    setCode(quest?.starterCode ?? '')
    setActiveTab('description')
  }, [quest])
  if (!quest) {
    return (
      <div className="content-shell">
        <div className="empty-state">Quest not found.</div>
      </div>
    )
  }
  const questSubmissions = submissions.filter((sub) => sub.questId === quest.id).reverse()
  const latestSubmission = questSubmissions[0]
  const mascotMood =
    latestSubmission?.status === 'PENDING'
      ? 'pending'
      : latestSubmission?.result === 'PASSED'
        ? 'success'
        : 'thinking'
  return (
    <div className="content-shell">
      <section className="card">
        <button className="btn btn-ghost" onClick={() => navigate(`/app/vaults/${quest.vaultId}`)}>
          &larr; Back to Vault
        </button>
        <div className="form-actions" style={{ justifyContent: 'space-between' }}>
          <div>
            <h2>{quest.title}</h2>
            <div className="chips">
              <span className={`pill ${quest.difficulty.toLowerCase()}`}>{quest.difficulty}</span>
              <span className="pill">{quest.type}</span>
              <span className="pill">{quest.language}</span>
            </div>
          </div>
          <div>
            <p>Estimated: {quest.estimatedTime}</p>
            <small>Guide: {vault?.mascot ?? 'Pixel Fox'}</small>
          </div>
        </div>
        {latestSubmission && (
          <div className={`inline-banner ${latestSubmission.status === 'PENDING' ? '' : 'success'}`}>
            {latestSubmission.status === 'PENDING'
              ? 'Submission sent. We are grading your code now. Status: PENDING'
              : `Last result: ${latestSubmission.result} (score ${latestSubmission.score ?? 'N/A'})`}
          </div>
        )}
        <MascotBubble
          mascot={mascot}
          mood={mascotMood}
          message={
            latestSubmission?.status === 'PENDING'
              ? 'Echo cube is humming while grading. Feel free to explore other quests!'
              : 'Need a hint? Try reading the examples tab or reset the starter code.'
          }
        />
        <div className="tabs">
          <button className={`tab ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>
            Description
          </button>
          <button className={`tab ${activeTab === 'submissions' ? 'active' : ''}`} onClick={() => setActiveTab('submissions')}>
            Submissions
          </button>
        </div>
        {activeTab === 'description' ? (
          <>
            <p>{quest.description}</p>
            {quest.examples?.length ? (
              quest.examples.map((example, index) => (
                <div key={`${quest.id}-example-${index}`} className="card" style={{ background: '#0f172a', color: '#f8fafc' }}>
                  <strong>Example {index + 1}</strong>
                  <pre>{example.input}</pre>
                  <pre>{example.output}</pre>
                </div>
              ))
            ) : null}
          </>
        ) : (
          <div>
            {questSubmissions.length ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Score</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {questSubmissions.map((sub) => (
                    <tr key={sub.id}>
                      <td>
                        <span className={`status-pill ${sub.status === 'PENDING' ? 'pending' : sub.result?.toLowerCase() ?? 'draft'}`}>
                          {sub.status === 'PENDING' ? 'Pending' : sub.result}
                        </span>
                      </td>
                      <td>{sub.score ?? '--'}</td>
                      <td>{new Date(sub.submittedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">No submissions yet.</div>
            )}
          </div>
        )}
      </section>

      <section className="card">
        <h3>Editor</h3>
        <textarea className="editor" value={code} onChange={(e) => setCode(e.target.value)} />
        <div className="form-actions">
          <button className="btn btn-secondary" type="button" onClick={() => setCode(quest.starterCode ?? '')}>
            Reset code
          </button>
          <button className="btn btn-primary" disabled={isSubmitting} onClick={() => onSubmit(quest.id, code)}>
            {isSubmitting ? 'Submitting...' : 'Submit for grading'}
          </button>
        </div>
      </section>
    </div>
  )
}

export function SubmissionsPage({ submissions = [], refreshPending, mascot }) {
  const [statusFilter, setStatusFilter] = useState('all')
  const filtered = submissions.filter((submission) => {
    if (statusFilter === 'pending') return submission.status === 'PENDING'
    if (statusFilter === 'completed') return submission.status === 'COMPLETED'
    if (statusFilter === 'failed') return submission.result === 'FAILED'
    return true
  })
  return (
    <div className="content-shell">
      <section className="card">
        <div className="form-actions" style={{ justifyContent: 'space-between' }}>
          <h2>Submissions</h2>
          <button className="btn btn-secondary" type="button" onClick={refreshPending}>
            Refresh
          </button>
        </div>
        <MascotBubble
          mascot={mascot}
          mood="pending"
          message="Pending items shimmer yellow until the grading owls finish. Hit refresh or explore other quests."
        />
        <div className="form-group">
          <label htmlFor="submission-filter">Status</label>
          <select id="submission-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </section>
      <section className="card">
        {filtered.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Quest</th>
                <th>Status</th>
                <th>Score</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((submission) => (
                <tr key={submission.id}>
                  <td>{submission.questTitle}</td>
                  <td>
                    <span className={`status-pill ${submission.status === 'PENDING' ? 'pending' : submission.result?.toLowerCase() ?? 'draft'}`}>
                      {submission.status === 'PENDING' ? 'Pending' : submission.result}
                    </span>
                  </td>
                  <td>{submission.score ?? '--'}</td>
                  <td>{new Date(submission.submittedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">No submissions match the selected filter.</div>
        )}
      </section>
    </div>
  )
}

export function ProgressPage({ overview, badges = [], vaults = [] }) {
  return (
    <div className="content-shell">
      <section className="stat-grid">
        <article className="stat-card">
          <span>Total quests</span>
          <strong>{overview?.questsCompleted ?? 0}</strong>
        </article>
        <article className="stat-card">
          <span>Active vaults</span>
          <strong>{overview?.activeVaults ?? 0}</strong>
        </article>
        <article className="stat-card">
          <span>Badges</span>
          <strong>{overview?.totalBadges ?? 0}</strong>
        </article>
      </section>

      <section className="card">
        <h3>XP Journey</h3>
        <div className="grid two">
          <article>
            <p>Next badge progress</p>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${overview?.xpPercent ?? 0}%` }} />
            </div>
            <small>{overview?.xpPercent ?? 0}% until the next celebration</small>
          </article>
          <article>
            <p>Streak</p>
            <strong style={{ fontSize: '2rem' }}>{overview?.streakDays ?? 0} days</strong>
            <small>Daily quests keep your streak alive.</small>
          </article>
        </div>
        <div className="grid five" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {overview?.weeklyData?.map((entry) => (
            <div key={entry.label}>
              <strong>{entry.value}</strong>
              <p>{entry.label}</p>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${entry.value * 20}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>Badges</h3>
        <div className="badge-grid">
          {badges.map((badge) => (
            <article key={badge.id} className={`badge-card ${badge.unlocked ? '' : 'locked'}`}>
              <h4>{badge.name}</h4>
              <p>{badge.requirement}</p>
              <span className={`status-pill ${badge.unlocked ? 'completed' : 'pending'}`}>
                {badge.unlocked ? 'Unlocked' : 'Locked'}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>Vault progress</h3>
        <div className="grid two">
          {vaults.map((vault) => (
            <article key={vault.id}>
              <strong>{vault.title}</strong>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${Math.round((vault.completedQuests / vault.totalQuests) * 100)}%` }}
                />
              </div>
              <small>
                {vault.completedQuests}/{vault.totalQuests} quests
              </small>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>Timeline</h3>
        <div className="timeline">
          {overview?.timeline?.map((entry) => (
            <div key={entry.id}>
              <strong>{entry.title}</strong>
              <p>{entry.detail}</p>
              <small>{entry.date}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export function ProfilePage({ user, onUpdateProfile }) {
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    timezone: user?.timezone ?? 'UTC',
    notifications: user?.notifications ?? true,
    bio: user?.bio ?? '',
  })
  const [saved, setSaved] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdateProfile(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="content-shell">
      <section className="card">
        <h2>Profile</h2>
        {saved && <div className="inline-banner success">Profile updated.</div>}
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="profile-name">Name</label>
            <input
              id="profile-name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="profile-email">Email</label>
            <input id="profile-email" type="email" value={form.email} disabled />
          </div>
          <div className="form-group">
            <label htmlFor="profile-timezone">Timezone</label>
            <select
              id="profile-timezone"
              value={form.timezone}
              onChange={(e) => setForm((prev) => ({ ...prev, timezone: e.target.value }))}
            >
              <option value="UTC">UTC</option>
              <option value="EST">EST</option>
              <option value="PST">PST</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="profile-bio">Bio</label>
            <textarea
              id="profile-bio"
              rows={4}
              value={form.bio}
              onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
            />
          </div>
          <label>
            <input
              type="checkbox"
              checked={form.notifications}
              onChange={(e) => setForm((prev) => ({ ...prev, notifications: e.target.checked }))}
            />
            Receive progress notifications
          </label>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit">
              Save
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
