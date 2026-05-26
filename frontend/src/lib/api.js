const EXPENSES_BASE = '/api/expenses'
const AUTH_BASE = '/api/auth'
const ADMIN_BASE = '/api/admin'

function getToken() {
  return localStorage.getItem('token')
}

async function request(url, options = {}) {
  const token = getToken()
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

export const api = {
  // Auth
  register(data) {
    return request(`${AUTH_BASE}/register`, { method: 'POST', body: JSON.stringify(data) })
  },
  login(data) {
    return request(`${AUTH_BASE}/login`, { method: 'POST', body: JSON.stringify(data) })
  },
  logout() {
    return request(`${AUTH_BASE}/logout`, { method: 'POST' })
  },

  // Expenses
  getExpenses(filters = {}) {
    const params = new URLSearchParams()
    if (filters.category) params.append('category', filters.category)
    if (filters.search) params.append('search', filters.search)
    return request(`${EXPENSES_BASE}?${params}`)
  },
  getSummary() {
    return request(`${EXPENSES_BASE}/summary`)
  },
  createExpense(data) {
    return request(EXPENSES_BASE, { method: 'POST', body: JSON.stringify(data) })
  },
  updateExpense(id, data) {
    return request(`${EXPENSES_BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  },
  deleteExpense(id) {
    return request(`${EXPENSES_BASE}/${id}`, { method: 'DELETE' })
  },

  // Admin
  getUsers() {
    return request(`${ADMIN_BASE}/users`)
  },
  getUserActivity(id) {
    return request(`${ADMIN_BASE}/users/${id}/activity`)
  },
  deleteUser(id) {
    return request(`${ADMIN_BASE}/users/${id}`, { method: 'DELETE' })
  },
}
