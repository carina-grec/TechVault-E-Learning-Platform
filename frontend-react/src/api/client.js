const computeDefaultGateway = () => {
  if (typeof window === 'undefined') return 'http://localhost:8081'
  try {
    const url = new URL(window.location.href)
    return `${url.protocol}//${url.hostname}:8081`
  } catch {
    return 'http://localhost:8081'
  }
}

const envBase = import.meta.env.VITE_API_BASE_URL
const currentOrigin = typeof window !== 'undefined' ? window.location.origin : ''
const shouldOverride =
  !envBase ||
  envBase.includes('api-gateway') ||
  envBase.includes('gateway:') ||
  envBase === currentOrigin

const API_BASE_URL = shouldOverride ? computeDefaultGateway() : envBase

async function request(path, { method = 'GET', body, token, headers = {} } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const errorBody = await safeJson(response)
    throw new Error(errorBody?.message || `Request failed with status ${response.status}`)
  }

  if (response.status === 204) {
    return null
  }

  return safeJson(response)
}

async function safeJson(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export const api = {
  login: (credentials) => request('/api/auth/login', { method: 'POST', body: credentials }),
  register: (payload) => request('/api/auth/register', { method: 'POST', body: payload }),
  getCurrentUser: (token) => request('/api/auth/me', { token }),
  getProfile: (token) => request('/api/users/me', { token }),

  getVaults: (params = {}, token) => {
    const query = new URLSearchParams(params).toString()
    return request(`/api/vaults${query ? `?${query}` : ''}`, { token })
  },
  getQuests: (params = {}, token) => {
    const query = new URLSearchParams(params).toString()
    return request(`/api/quests${query ? `?${query}` : ''}`, { token })
  },
  getVaultDetail: (vaultId, token) => request(`/api/vaults/${vaultId}`, { token }),
  getQuest: (questId, token) => request(`/api/quests/${questId}`, { token }),

  getLearnerProgressSummary: (token) => request('/api/learner/progress/summary', { token }),
  getLearnerVaultProgress: (token) => request('/api/learner/progress/vaults', { token }),
  getLearnerBadges: (token) => request('/api/learner/badges', { token }),
  getBadgeCatalog: () => request('/api/badges/catalog'),

  submitQuest: (token, payload) => request('/api/submissions', { method: 'POST', body: payload, token }),
  getSubmissions: (token, params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/api/submissions${query ? `?${query}` : ''}`, { token })
  },
  getSubmission: (token, submissionId) => request(`/api/submissions/${submissionId}`, { token }),
  getRecentSubmissions: (token, limit = 5) =>
    request(`/api/submissions/recent?limit=${limit}`, { token }),

  getAdminVaults: (token) => request('/api/admin/vaults', { token }),
  createVault: (token, payload) =>
    request('/api/admin/vaults', { method: 'POST', body: payload, token }),
  updateVault: (token, vaultId, payload) =>
    request(`/api/admin/vaults/${vaultId}`, { method: 'PUT', body: payload, token }),
  deleteVault: (token, vaultId) =>
    request(`/api/admin/vaults/${vaultId}`, { method: 'DELETE', token }),

  getAdminQuests: (token, params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/api/admin/quests${query ? `?${query}` : ''}`, { token })
  },
  createQuest: (token, payload) =>
    request('/api/admin/quests', { method: 'POST', body: payload, token }),
  updateQuest: (token, questId, payload) =>
    request(`/api/admin/quests/${questId}`, { method: 'PUT', body: payload, token }),
  deleteQuest: (token, questId) =>
    request(`/api/admin/quests/${questId}`, { method: 'DELETE', token }),
  getAdminMetrics: (token) => request('/api/admin/metrics/overview', { token }),

  getGuardianLearners: (token) => request('/api/guardians/me/learners', { token }),
  linkGuardianLearner: (token, payload) =>
    request('/api/guardians/me/learners', { method: 'POST', body: payload, token }),
  getGuardianLearnerProgress: (token, learnerId) =>
    request(`/api/guardian/learners/${learnerId}/progress`, { token }),
  getGuardianLearnerSubmissions: (token, learnerId, params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/api/guardian/learners/${learnerId}/submissions${query ? `?${query}` : ''}`, {
      token,
    })
  },

  updateProfile: (token, payload) =>
    request('/api/users/me', { method: 'PATCH', body: payload, token }),
  changePassword: (token, payload) =>
    request('/api/users/me/password', { method: 'PATCH', body: payload, token }),

  getAdminUsers: (token, params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/api/admin/users${query ? `?${query}` : ''}`, { token })
  },
}
