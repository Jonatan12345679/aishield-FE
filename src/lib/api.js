const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.detail || `Request gagal: ${res.status}`)
  }

  return res.json()
}

export const api = {
  getDashboardSummary: () => request('/dashboard/summary'),

  getEvents: ({ page = 1, pageSize = 50, anomalyOnly = false, riskLevel } = {}) => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
      anomaly_only: String(anomalyOnly),
    })
    if (riskLevel) params.set('risk_level', riskLevel)
    return request(`/dashboard/events?${params}`)
  },

  getModelMetrics: () => request('/dashboard/model-metrics'),
}