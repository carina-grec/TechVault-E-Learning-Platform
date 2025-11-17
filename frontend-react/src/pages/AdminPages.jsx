import { useMemo, useState } from 'react'

export function AdminDashboard({ stats = {}, submissions = [], navigate }) {
  const latest = submissions.slice().reverse().slice(0, 5)
  return (
    <div className="content-shell">
      <section className="stat-grid">
        <article className="stat-card">
          <span>Vaults</span>
          <strong>{stats.vaults ?? 0}</strong>
        </article>
        <article className="stat-card">
          <span>Quests</span>
          <strong>{stats.quests ?? 0}</strong>
        </article>
        <article className="stat-card">
          <span>Submissions today</span>
          <strong>{stats.submissionsToday ?? 0}</strong>
        </article>
        <article className="stat-card">
          <span>Active learners</span>
          <strong>{stats.activeLearners ?? 0}</strong>
        </article>
      </section>

      <section className="grid two">
        <article className="card">
          <h3>Create a vault</h3>
          <p>Define the learning path, assign categories, and publish.</p>
          <button className="btn btn-primary" onClick={() => navigate('/admin/vaults/new')}>
            New Vault
          </button>
        </article>
        <article className="card">
          <h3>Create a quest</h3>
          <p>Pick between CodeChallenge or Quiz and configure grading.</p>
          <button className="btn btn-primary" onClick={() => navigate('/admin/quests/new')}>
            New Quest
          </button>
        </article>
      </section>

      <section className="card">
        <h3>Latest submissions</h3>
        {latest.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Learner</th>
                <th>Quest</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {latest.map((sub) => (
                <tr key={sub.id}>
                  <td>{sub.learner ?? 'Ava Patel'}</td>
                  <td>{sub.questTitle}</td>
                  <td>
                    <span className={`status-pill ${sub.status === 'PENDING' ? 'pending' : sub.result?.toLowerCase() ?? 'draft'}`}>
                      {sub.status === 'PENDING' ? 'Pending' : sub.result}
                    </span>
                  </td>
                  <td>{new Date(sub.submittedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">No submissions yet.</div>
        )}
      </section>
    </div>
  )
}

export function AdminVaultsPage({ vaults = [], navigate }) {
  return (
    <div className="content-shell">
      <section className="card">
        <div className="form-actions" style={{ justifyContent: 'space-between' }}>
          <h2>Vaults</h2>
          <button className="btn btn-primary" onClick={() => navigate('/admin/vaults/new')}>
            Create vault
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Quests</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {vaults.map((vault) => (
              <tr key={vault.id}>
                <td>{vault.title}</td>
                <td>{vault.category}</td>
                <td>
                  {vault.completedQuests}/{vault.totalQuests}
                </td>
                <td>
                  <span className={`status-pill ${vault.status === 'draft' ? 'draft' : 'completed'}`}>
                    {vault.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary" onClick={() => navigate(`/admin/vaults/${vault.id}/edit`)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export function AdminVaultForm({ vault, mode = 'create', onSubmit }) {
  const [form, setForm] = useState(
    vault ?? {
      title: '',
      slug: '',
      description: '',
      category: 'General',
      difficulty: 'Beginner',
      status: 'draft',
      totalQuests: 0,
      completedQuests: 0,
    },
  )
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
    setMessage('Vault saved.')
  }

  return (
    <div className="content-shell">
      <section className="card">
        <h2>{mode === 'create' ? 'Create Vault' : 'Edit Vault'}</h2>
        {message && <div className="inline-banner success">{message}</div>}
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="vault-title">Title</label>
            <input
              id="vault-title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="vault-slug">Slug</label>
            <input
              id="vault-slug"
              value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="vault-description">Description</label>
            <textarea
              id="vault-description"
              rows={4}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="vault-category">Category</label>
            <input
              id="vault-category"
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="vault-difficulty">Difficulty</label>
            <select
              id="vault-difficulty"
              value={form.difficulty}
              onChange={(e) => setForm((prev) => ({ ...prev, difficulty: e.target.value }))}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="grid two">
            <div className="form-group">
              <label htmlFor="vault-total">Total Quests</label>
              <input
                id="vault-total"
                type="number"
                value={form.totalQuests}
                onChange={(e) => setForm((prev) => ({ ...prev, totalQuests: Number(e.target.value) }))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="vault-progress">Completed</label>
              <input
                id="vault-progress"
                type="number"
                value={form.completedQuests}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, completedQuests: Number(e.target.value) }))
                }
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="vault-status">Status</label>
            <select
              id="vault-status"
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
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

export function AdminQuestsPage({ quests = [], navigate, vaults = [] }) {
  const [filter, setFilter] = useState('all')
  const filtered = quests.filter((quest) => (filter === 'all' ? true : quest.type === filter))
  const vaultLookup = useMemo(() => Object.fromEntries(vaults.map((vault) => [vault.id, vault.title])), [vaults])
  return (
    <div className="content-shell">
      <section className="card">
        <div className="form-actions" style={{ justifyContent: 'space-between' }}>
          <h2>Quests</h2>
          <button className="btn btn-primary" onClick={() => navigate('/admin/quests/new')}>
            Create quest
          </button>
        </div>
        <div className="form-group">
          <label htmlFor="quest-filter">Quest type</label>
          <select id="quest-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="CodeChallenge">Code Challenge</option>
            <option value="Quiz">Quiz</option>
          </select>
        </div>
      </section>
      <section className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Vault</th>
              <th>Difficulty</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((quest) => (
              <tr key={quest.id}>
                <td>{quest.title}</td>
                <td>{quest.type}</td>
                <td>{vaultLookup[quest.vaultId] ?? '--'}</td>
                <td>{quest.difficulty}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => navigate(`/admin/quests/${quest.id}/edit`)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export function AdminQuestForm({ quest, mode = 'create', onSubmit, vaults = [] }) {
  const [step, setStep] = useState(quest ? 2 : 1)
  const [selectedType, setSelectedType] = useState(quest?.type ?? '')
  const [form, setForm] = useState(
    quest ?? {
      title: '',
      description: '',
      difficulty: 'Beginner',
      language: 'JavaScript',
      gradingStrategy: 'UNIT_TEST',
      type: '',
      estimatedTime: '30 min',
      starterCode: '',
      vaultId: vaults[0]?.id ?? '',
    },
  )
  const [message, setMessage] = useState('')

  const handleSave = (e) => {
    e.preventDefault()
    onSubmit({ ...form, type: selectedType || form.type })
    setMessage('Quest saved.')
  }

  return (
    <div className="content-shell">
      <section className="card">
        <h2>{mode === 'create' ? 'Create quest' : 'Edit quest'}</h2>
        <p>Step {step} of 2</p>
        {message && <div className="inline-banner success">{message}</div>}
        {step === 1 ? (
          <div className="grid two">
            {['CodeChallenge', 'Quiz'].map((type) => (
              <article key={type} className="card">
                <h3>{type}</h3>
                <p>{type === 'CodeChallenge' ? 'Inline code editor and auto tests.' : 'Multiple-choice questions.'}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSelectedType(type)
                    setForm((prev) => ({ ...prev, type }))
                    setStep(2)
                  }}
                >
                  Choose {type}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <form className="form-grid" onSubmit={handleSave}>
            <div className="form-group">
              <label htmlFor="quest-title">Title</label>
              <input
                id="quest-title"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="quest-description">Description</label>
              <textarea
                id="quest-description"
                rows={4}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="quest-difficulty">Difficulty</label>
              <select
                id="quest-difficulty"
                value={form.difficulty}
                onChange={(e) => setForm((prev) => ({ ...prev, difficulty: e.target.value }))}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            {selectedType === 'CodeChallenge' && (
              <>
                <div className="form-group">
                  <label htmlFor="quest-language">Language</label>
                  <select
                    id="quest-language"
                    value={form.language}
                    onChange={(e) => setForm((prev) => ({ ...prev, language: e.target.value }))}
                  >
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="Go">Go</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="quest-grading">Grading strategy</label>
                  <select
                    id="quest-grading"
                    value={form.gradingStrategy}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, gradingStrategy: e.target.value }))
                    }
                  >
                    <option value="UNIT_TEST">Unit test</option>
                    <option value="SNIPPET_COMPARE">Snippet compare</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="quest-starter">Starter code</label>
                  <textarea
                    id="quest-starter"
                    rows={6}
                    value={form.starterCode}
                    onChange={(e) => setForm((prev) => ({ ...prev, starterCode: e.target.value }))}
                  />
                </div>
              </>
            )}
            {selectedType === 'Quiz' && (
              <div className="form-group">
                <label htmlFor="quest-options">Answer options</label>
                <textarea
                  id="quest-options"
                  rows={4}
                  placeholder="Provide answer options, separated by commas"
                  value={form.options?.join(', ') ?? ''}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, options: e.target.value.split(',').map((item) => item.trim()) }))
                  }
                />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="quest-vault">Link to vault</label>
              <select
                id="quest-vault"
                value={form.vaultId}
                onChange={(e) => setForm((prev) => ({ ...prev, vaultId: e.target.value }))}
              >
                {vaults.map((vault) => (
                  <option key={vault.id} value={vault.id}>
                    {vault.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button className="btn btn-secondary" type="button" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="btn btn-primary" type="submit">
                Save quest
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}

export function AdminUsersPage({ users = [] }) {
  return (
    <div className="content-shell">
      <section className="card">
        <h2>Users</h2>
        {users.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="pill">{user.role}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">No users yet.</div>
        )}
      </section>
    </div>
  )
}
