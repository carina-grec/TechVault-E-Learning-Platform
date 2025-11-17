import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { useHashLocation } from './hooks/useHashLocation'
import { api } from './api/client'
import { landingSections, mascotRoster } from './data/mockData'
import { LandingPage, LegalPage, LoginPage, RegisterPage } from './pages/PublicPages'
import {
  LearnerDashboard,
  ProfilePage,
  ProgressPage,
  QuestDetailPage,
  SubmissionsPage,
  VaultDetailPage,
  VaultsPage,
} from './pages/LearnerPages'
import {
  AdminDashboard,
  AdminQuestForm,
  AdminQuestsPage,
  AdminUsersPage,
  AdminVaultForm,
  AdminVaultsPage,
} from './pages/AdminPages'
import { GuardianDashboard, GuardianLearnerPage } from './pages/GuardianPages'

const routes = [
  { path: '/', key: 'landing', guard: 'public' },
  { path: '/login', key: 'login', guard: 'public' },
  { path: '/register', key: 'register', guard: 'public' },
  { path: '/legal/terms', key: 'terms', guard: 'public', extra: { type: 'terms' } },
  { path: '/legal/privacy', key: 'privacy', guard: 'public', extra: { type: 'privacy' } },
  { path: '/app/dashboard', key: 'learner-dashboard', guard: 'LEARNER' },
  { path: '/app/vaults', key: 'vaults', guard: 'LEARNER' },
  { path: '/app/vaults/:vaultId', key: 'vault-detail', guard: 'LEARNER' },
  { path: '/app/quests/:questId', key: 'quest-detail', guard: 'LEARNER' },
  { path: '/app/submissions', key: 'submissions', guard: 'LEARNER' },
  { path: '/app/progress', key: 'progress', guard: 'LEARNER' },
  { path: '/app/profile', key: 'profile', guard: 'auth' },
  { path: '/admin/dashboard', key: 'admin-dashboard', guard: 'ADMIN' },
  { path: '/admin/vaults', key: 'admin-vaults', guard: 'ADMIN' },
  { path: '/admin/vaults/new', key: 'admin-vault-new', guard: 'ADMIN' },
  { path: '/admin/vaults/:vaultId/edit', key: 'admin-vault-edit', guard: 'ADMIN' },
  { path: '/admin/quests', key: 'admin-quests', guard: 'ADMIN' },
  { path: '/admin/quests/new', key: 'admin-quest-new', guard: 'ADMIN' },
  { path: '/admin/quests/:questId/edit', key: 'admin-quest-edit', guard: 'ADMIN' },
  { path: '/admin/users', key: 'admin-users', guard: 'ADMIN' },
  { path: '/guardian/dashboard', key: 'guardian-dashboard', guard: 'GUARDIAN' },
  { path: '/guardian/learners/:learnerId', key: 'guardian-learner', guard: 'GUARDIAN' },
]

const matchPath = (pathname, routePattern) => {
  const cleanPath = pathname.replace(/\/+$/, '') || '/'
  const cleanPattern = routePattern.replace(/\/+$/, '') || '/'
  const pathSegments = cleanPath.split('/').filter(Boolean)
  const patternSegments = cleanPattern.split('/').filter(Boolean)

  if (patternSegments.length === 0 && pathSegments.length === 0) {
    return {}
  }

  if (patternSegments.length !== pathSegments.length) {
    return null
  }

  const params = {}
  for (let i = 0; i < patternSegments.length; i += 1) {
    const patternSegment = patternSegments[i]
    const pathSegment = pathSegments[i]
    if (patternSegment.startsWith(':')) {
      params[patternSegment.slice(1)] = decodeURIComponent(pathSegment)
    } else if (patternSegment !== pathSegment) {
      return null
    }
  }
  return params
}

const guardAllows = (guard, user) => {
  if (guard === 'public') return true
  if (!user) return false
  if (guard === 'auth') return true
  return user.role === guard
}

const normalizeVaults = (items = [], progressEntries = []) => {
  const progressMap = new Map(progressEntries.map((entry) => [entry.vaultId, entry]))
  return items.map((item) => {
    const progress = progressMap.get(item.id) ?? {}
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category ?? item.theme ?? 'World',
      difficulty: item.difficulty ?? 'Beginner',
      totalQuests: progress.totalQuests ?? item.questCount ?? 0,
      completedQuests: progress.completedQuests ?? 0,
      featured: item.featured,
      status: (item.status ?? 'DRAFT').toLowerCase(),
      heroHighlight: item.heroHighlight ?? '',
      mascot: item.mascotName ?? mascotRoster.featured.name,
    }
  })
}

const normalizeBadges = (catalog = [], unlocked = []) => {
  const unlockedMap = new Map(unlocked.map((entry) => [entry.badge?.id, entry]))
  return catalog.map((badge) => ({
    id: badge.id,
    name: badge.name,
    requirement: badge.description,
    unlocked: unlockedMap.has(badge.id),
  }))
}

const normalizeSubmissions = (items = [], questLookup = {}) =>
  items.map((submission) => {
    const quest = questLookup[submission.questId]
    return {
      id: submission.submissionId,
      questId: submission.questId,
      questTitle: quest?.title ?? submission.questId,
      status: submission.status,
      result: submission.success ? 'PASSED' : submission.status === 'PENDING' ? null : 'FAILED',
      score: submission.success ? 100 : null,
      feedback: submission.stderr || submission.stdout || 'Processing...',
      submittedAt: submission.timestamp,
    }
  })

function App() {
  const [path, navigate] = useHashLocation()
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('tv_token'))
  const [currentUser, setCurrentUser] = useState(null)
  const [baseVaults, setBaseVaults] = useState([])
  const [vaultProgressDetails, setVaultProgressDetails] = useState([])
  const [quests, setQuests] = useState([])
  const [questMap, setQuestMap] = useState({})
  const [submissions, setSubmissions] = useState([])
  const [badges, setBadges] = useState([])
  const [learnerProgress, setLearnerProgress] = useState(null)
  const [guardianLearnerData, setGuardianLearnerData] = useState([])
  const [adminStatsState, setAdminStatsState] = useState(null)
  const [adminUsers, setAdminUsers] = useState([])
  const [toasts, setToasts] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const primaryMascot = mascotRoster.featured

  const vaults = useMemo(
    () => normalizeVaults(baseVaults, vaultProgressDetails),
    [baseVaults, vaultProgressDetails],
  )

  const routeMatch = useMemo(() => {
    for (const route of routes) {
      const params = matchPath(path, route.path)
      if (params !== null) {
        return { ...route, params }
      }
    }
    return null
  }, [path])

  useEffect(() => {
    const loadPublic = async () => {
      try {
        const [vaultResponse, badgesResponse] = await Promise.all([api.getVaults(), api.getBadgeCatalog()])
        setBaseVaults(vaultResponse)
        setBadges(normalizeBadges(badgesResponse, []))
      } catch (error) {
        console.error('Failed to load public data', error)
      } finally {
        setIsBootstrapping(false)
      }
    }
    loadPublic()
  }, [])

  useEffect(() => {
    if (!authToken) {
      setCurrentUser(null)
      return
    }
    const loadUser = async () => {
      try {
        const user = await api.getCurrentUser(authToken)
        setCurrentUser(user)
      } catch (error) {
        console.error('Failed to fetch session', error)
        setAuthToken(null)
        localStorage.removeItem('tv_token')
      }
    }
    loadUser()
  }, [authToken])

  useEffect(() => {
    if (!currentUser || !authToken) return
    const loadRoleData = async () => {
      try {
        if (currentUser.role === 'LEARNER') {
          await loadLearnerData(authToken)
        } else if (currentUser.role === 'ADMIN') {
          await loadAdminData(authToken)
        } else if (currentUser.role === 'GUARDIAN') {
          await loadGuardianData(authToken)
        }
      } catch (error) {
        console.error('Failed to load role data', error)
      }
    }
    loadRoleData()
  }, [currentUser, authToken])

  const loadLearnerData = async (token) => {
    const [summary, vaultProgress, learnerBadges, questList, submissionsPage, catalog] = await Promise.all([
      api.getLearnerProgressSummary(token),
      api.getLearnerVaultProgress(token),
      api.getLearnerBadges(token),
      api.getQuests({}, token),
      api.getSubmissions(token),
      api.getBadgeCatalog(),
    ])

    setVaultProgressDetails(vaultProgress)
    setQuests(questList)
    const questLookup = Object.fromEntries(questList.map((quest) => [quest.id, quest]))
    setQuestMap(questLookup)
    setSubmissions(normalizeSubmissions(submissionsPage?.content ?? [], questLookup))
    setLearnerProgress({
      xpPercent: summary?.xp ?? 0,
      streakDays: summary?.streak ?? 0,
      questsCompleted: summary?.completedQuests ?? 0,
      activeVaults: vaultProgress.length,
      totalBadges: learnerBadges.length,
      overview: summary,
      timeline: [],
    })
    setBadges(normalizeBadges(catalog, learnerBadges))
  }

  const loadAdminData = async (token) => {
    const [adminVaults, adminQuests, metrics, usersPage] = await Promise.all([
      api.getAdminVaults(token),
      api.getAdminQuests(token),
      api.getAdminMetrics(token),
      api.getAdminUsers(token),
    ])
    setBaseVaults(adminVaults)
    setQuests(adminQuests)
    setQuestMap(Object.fromEntries(adminQuests.map((quest) => [quest.id, quest])))
    setAdminUsers(
      (usersPage?.content ?? []).map((user) => ({
        id: user.id,
        name: user.displayName ?? user.email,
        email: user.email,
        role: user.role,
      })),
    )
    setAdminStatsState({
      vaults: adminVaults.length,
      quests: adminQuests.length,
      submissionsToday: metrics.submissionsToday,
      activeLearners: metrics.completedSubmissions,
    })
  }

  const loadGuardianData = async (token) => {
    const guardians = await api.getGuardianLearners(token)
    const hydrated = await Promise.all(
      guardians.map(async (learner) => {
        const [progress, submissionPage] = await Promise.all([
          api.getGuardianLearnerProgress(token, learner.id),
          api.getGuardianLearnerSubmissions(token, learner.id),
        ])
        return {
          id: learner.id,
          name: learner.displayName,
          focus: learner.username,
          badgesUnlocked: learner.xp ?? 0,
          vaultProgress: (progress?.vaults ?? []).map((entry) => ({
            vaultId: entry.vaultId,
            title: entry.vaultId,
            completed: entry.completedQuests,
            total: entry.totalQuests,
          })),
          submissions: normalizeSubmissions(submissionPage?.content ?? [], questMap),
          nextBadge: 'On track',
        }
      }),
    )
    setGuardianLearnerData(hydrated)
  }

  const addToast = (message) => {
    const toast = { id: `${Date.now()}-${Math.random()}`, message }
    setToasts((prev) => [...prev, toast])
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== toast.id))
    }, 4000)
  }

  const navigateByRole = (role) => {
    if (role === 'LEARNER') return navigate('/app/dashboard')
    if (role === 'ADMIN') return navigate('/admin/dashboard')
    if (role === 'GUARDIAN') return navigate('/guardian/dashboard')
    return navigate('/')
  }

  const handleLogin = async ({ email, password }) => {
    try {
      const result = await api.login({ email, password })
      localStorage.setItem('tv_token', result.token)
      setAuthToken(result.token)
      setCurrentUser(result.user)
      addToast(`Welcome back, ${result.user.displayName ?? result.user.email}`)
      navigateByRole(result.user.role)
      return { success: true, message: `Logged in as ${result.user.role.toLowerCase()}.` }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

    const handleRegister = async ({ name, email, password, role, username, age }) => {
      try {
        const result = await api.register({
          displayName: name,
          email,
          password,
          role,
          username,
          age,
        })
        localStorage.setItem('tv_token', result.token)
        setAuthToken(result.token)
        setCurrentUser(result.user)
      addToast('Account created.')
      navigateByRole(role)
      return { success: true, message: 'Account created.' }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setAuthToken(null)
    localStorage.removeItem('tv_token')
    navigate('/login')
    addToast('Signed out.')
  }

  const handleProfileUpdate = async (payload) => {
    if (!currentUser || !authToken) return
    try {
      const updated = await api.updateProfile(authToken, {
        displayName: payload.name,
      })
      setCurrentUser((prev) => ({ ...prev, ...updated }))
      addToast('Profile updated.')
    } catch (error) {
      addToast(error.message)
    }
  }

  const handleQuestSubmit = async (questId, code) => {
    if (!authToken) return
    try {
      setIsSubmitting(true)
      const submission = await api.submitQuest(authToken, {
        questId,
        submittedCode: code,
        language: 'JAVASCRIPT',
      })
      setSubmissions((prev) => [...normalizeSubmissions([submission], questMap), ...prev])
      addToast('Submission queued for grading.')
    } catch (error) {
      addToast(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const refreshPending = async () => {
    if (!authToken) return
    addToast('Refreshing submission status...')
    try {
      const page = await api.getSubmissions(authToken)
      setSubmissions(normalizeSubmissions(page?.content ?? [], questMap))
    } catch (error) {
      addToast(error.message)
    }
  }

  const saveVault = async (payload) => {
    if (!authToken) return
    try {
      if (payload.id) {
        await api.updateVault(authToken, payload.id, payload)
      } else {
        await api.createVault(authToken, payload)
      }
      await loadAdminData(authToken)
      addToast('Vault saved.')
      navigate('/admin/vaults')
    } catch (error) {
      addToast(error.message)
    }
  }

  const saveQuest = async (payload) => {
    if (!authToken) return
    try {
      if (payload.id) {
        await api.updateQuest(authToken, payload.id, payload)
      } else {
        await api.createQuest(authToken, payload)
      }
      await loadAdminData(authToken)
      addToast('Quest saved.')
      navigate('/admin/quests')
    } catch (error) {
      addToast(error.message)
    }
  }

  const guardAllowed = guardAllows(routeMatch?.guard ?? 'public', currentUser)

  const renderContent = () => {
    if (!routeMatch) {
      return <NotFound navigate={navigate} />
    }
    if (!guardAllowed) {
      return (
        <GuardMessage
          title="Please log in to view this area."
          actionLabel={currentUser ? 'Go home' : 'Go to login'}
          onAction={() => (currentUser ? navigateByRole(currentUser.role) : navigate('/login'))}
        />
      )
    }

    switch (routeMatch.key) {
      case 'landing':
        return (
          <LandingPage
            navigate={navigate}
            vaults={vaults}
            steps={landingSections.steps}
            adminCTA={landingSections.adminCTA}
            mascot={primaryMascot}
          />
        )
      case 'login':
        return <LoginPage onLogin={handleLogin} />
      case 'register':
        return <RegisterPage onRegister={handleRegister} />
      case 'terms':
      case 'privacy':
        return <LegalPage type={routeMatch.extra?.type} />
      case 'learner-dashboard':
        return (
          <LearnerDashboard
            user={currentUser}
            quests={quests}
            vaults={vaults}
            submissions={submissions}
            badges={badges}
            navigate={navigate}
            mascot={primaryMascot}
            progress={learnerProgress}
          />
        )
      case 'vaults':
        return <VaultsPage vaults={vaults} navigate={navigate} />
      case 'vault-detail': {
        const vault = vaults.find((item) => item.id === routeMatch.params.vaultId)
        return (
          <VaultDetailPage
            vault={vault}
            quests={quests}
            submissions={submissions}
            navigate={navigate}
          />
        )
      }
      case 'quest-detail': {
        const quest = quests.find((item) => item.id === routeMatch.params.questId)
        const questVault = quest ? vaults.find((vault) => vault.id === quest.vaultId) : null
        return (
          <QuestDetailPage
            quest={quest}
            vault={questVault}
            submissions={submissions}
            onSubmit={handleQuestSubmit}
            isSubmitting={isSubmitting}
            navigate={navigate}
            mascot={primaryMascot}
          />
        )
      }
      case 'submissions':
        return <SubmissionsPage submissions={submissions} refreshPending={refreshPending} mascot={primaryMascot} />
      case 'progress':
        return <ProgressPage overview={learnerProgress} badges={badges} vaults={vaults} />
      case 'profile':
        return <ProfilePage user={currentUser} onUpdateProfile={handleProfileUpdate} />
      case 'admin-dashboard':
        return (
          <AdminDashboard
            stats={
              adminStatsState ?? {
                vaults: vaults.length,
                quests: quests.length,
                submissionsToday: submissions.length,
                activeLearners: submissions.length,
              }
            }
            submissions={submissions}
            navigate={navigate}
          />
        )
      case 'admin-vaults':
        return <AdminVaultsPage vaults={vaults} navigate={navigate} />
      case 'admin-vault-new':
        return <AdminVaultForm mode="create" onSubmit={saveVault} />
      case 'admin-vault-edit': {
        const vault = vaults.find((item) => item.id === routeMatch.params.vaultId)
        return <AdminVaultForm mode="edit" vault={vault} onSubmit={saveVault} />
      }
      case 'admin-quests':
        return <AdminQuestsPage quests={quests} vaults={vaults} navigate={navigate} />
      case 'admin-quest-new':
        return <AdminQuestForm mode="create" vaults={vaults} onSubmit={saveQuest} />
      case 'admin-quest-edit': {
        const quest = quests.find((item) => item.id === routeMatch.params.questId)
        return <AdminQuestForm mode="edit" quest={quest} vaults={vaults} onSubmit={saveQuest} />
      }
      case 'admin-users':
        return <AdminUsersPage users={adminUsers} />
      case 'guardian-dashboard':
        return <GuardianDashboard learners={guardianLearnerData} navigate={navigate} />
      case 'guardian-learner': {
        const learner = guardianLearnerData.find((item) => item.id === routeMatch.params.learnerId)
        return <GuardianLearnerPage learner={learner} />
      }
      default:
        return <NotFound navigate={navigate} />
    }
  }

  return (
    <div className="app-shell">
      <TopNav
        path={path}
        user={currentUser}
        onLogout={handleLogout}
        navigate={navigate}
        xpPercent={learnerProgress?.xpPercent ?? 0}
      />
      <main className="max-width">{renderContent()}</main>
      <FooterSection />
      <ToastStack items={toasts} />
    </div>
  )
}

const navItemsByRole = {
  public: [
    { path: '/', label: 'Home' },
    { path: '/login', label: 'Login' },
    { path: '/register', label: 'Register' },
  ],
  LEARNER: [
    { path: '/app/dashboard', label: 'Dashboard' },
    { path: '/app/vaults', label: 'Vaults' },
    { path: '/app/submissions', label: 'Submissions' },
    { path: '/app/progress', label: 'Progress' },
  ],
  ADMIN: [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/vaults', label: 'Vaults' },
    { path: '/admin/quests', label: 'Quests' },
    { path: '/admin/users', label: 'Users' },
  ],
  GUARDIAN: [
    { path: '/guardian/dashboard', label: 'Dashboard' },
  ],
}

function TopNav({ user, path, onLogout, navigate, xpPercent = 0 }) {
  const navItems = user ? navItemsByRole[user.role] : navItemsByRole.public
  const xpValue = Math.min(100, Math.round(xpPercent ?? 0))
  return (
    <header className="top-nav">
      <a className="nav-brand" href="#/">
        TechVault <span>Kids</span>
      </a>
      <nav className="nav-links">
        {navItems.map((item) => (
          <a
            key={item.path}
            href={`#${item.path}`}
            className={`nav-link ${
              path === item.path || path.startsWith(`${item.path}/`) ? 'active' : ''
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="nav-actions">
        {user ? (
          <>
            {user.role === 'LEARNER' ? (
              <div className="xp-bar">
                <span>XP</span>
                <div className="xp-bar-track">
                  <div className="xp-bar-fill" style={{ width: `${xpValue}%` }} />
                </div>
                <span>{xpValue}%</span>
              </div>
            ) : null}
            <button className="btn btn-secondary" onClick={() => navigate('/app/profile')}>
              {user.name}
            </button>
            <button className="btn btn-primary" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-secondary" onClick={() => navigate('/login')}>
              Log In
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/register')}>
              Get Started
            </button>
          </>
        )}
      </div>
    </header>
  )
}

function FooterSection() {
  return (
    <footer>
      <div className="max-width">
        <div>TechVault Labs {new Date().getFullYear()}</div>
        <div>
          <a href="#/legal/terms">Terms</a> | <a href="#/legal/privacy">Privacy</a>
        </div>
      </div>
    </footer>
  )
}

function ToastStack({ items }) {
  return (
    <div className="toast-stack">
      {items.map((toast) => (
        <div key={toast.id} className="toast">
          {toast.message}
        </div>
      ))}
    </div>
  )
}

function GuardMessage({ title, actionLabel, onAction }) {
  return (
    <div className="content-shell">
      <section className="card">
        <h3>{title}</h3>
        <button className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      </section>
    </div>
  )
}

function NotFound({ navigate }) {
  return (
    <div className="content-shell">
      <section className="card">
        <h2>Page not found</h2>
        <p>The page you are looking for does not exist.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Go home
        </button>
      </section>
    </div>
  )
}

export default App
