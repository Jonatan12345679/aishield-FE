
import { request } from './apiClient'

export const aiShieldApi = {
  getDashboardSummary: () => request('/dashboard/summary'),

  getRiskScore: () => request('/dashboard/risk-score'),

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


  triggerSimulation: (attackType, count) =>
    request('/simulation/trigger', {
      method: 'POST',
      body: JSON.stringify({ attack_type: attackType, count: count || null }),
    }),

     explainEvent: (eventId) => request(`/dashboard/events/${eventId}/explain`),

  getTopAttackers: () => request('/dashboard/top-attackers'),

    blockIp: (ip) =>
      request('/dashboard/blocklist', {
        method: 'POST',
        body: JSON.stringify({ ip }),
      }),

    unblockIp: (ip) =>
      request(`/dashboard/blocklist/${encodeURIComponent(ip)}`, { method: 'DELETE' }),
}