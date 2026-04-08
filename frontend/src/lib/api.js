const BASE = '/api/expenses'

async function request(url, options) {
  const res = await fetch(url, options)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

export const api = {
  getExpenses(filters = {}) {
    const params = new URLSearchParams()
    if (filters.category) params.append('category', filters.category)
    if (filters.search) params.append('search', filters.search)
    return request(`${BASE}?${params}`)
  },

  getSummary() {
    return request(`${BASE}/summary`)
  },

  createExpense(data) {
    return request(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  },

  updateExpense(id, data) {
    return request(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  },

  deleteExpense(id) {
    return request(`${BASE}/${id}`, { method: 'DELETE' })
  },
}
