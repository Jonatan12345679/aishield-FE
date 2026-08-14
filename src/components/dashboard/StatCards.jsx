import { useEffect, useState } from 'react'
import { Activity, AlertTriangle, Percent } from 'lucide-react'
import { api } from '../../lib/api'
import '@/assets/styles/StatCard.css'

const CARD_CONFIG = [
  { key: 'total_events', label: 'TOTAL EVENTS', tone: '', icon: Activity },
  { key: 'total_anomalies', label: 'ANOMALIES DETECTED', tone: 'rose', icon: AlertTriangle },
  { key: 'anomaly_rate', label: 'ANOMALY RATE', tone: 'amber', icon: Percent, suffix: '%' },
]

export default function StatCards() {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .getDashboardSummary()
      .then(setSummary)
      .catch((err) => setError(err.message))
  }, [])

  if (error) {
    return <div className="stat-cards__error">Gagal narik data dashboard: {error}</div>
  }

  if (!summary) {
    return (
      <div className="stat-cards">
        {CARD_CONFIG.map((c) => (
          <div key={c.key} className="stat-card stat-card--skeleton" />
        ))}
      </div>
    )
  }

  return (
    <div className="stat-cards">
      {CARD_CONFIG.map((c) => {
        const Icon = c.icon
        return (
          <div key={c.key} className={`stat-card ${c.tone}`}>
            <div className="stat-card__icon">
              <Icon size={22} strokeWidth={2} />
            </div>
            <div className="stat-card__body">
              <p className="stat-card__label">{c.label}</p>
              <p className="stat-card__value">
                {summary[c.key]}
                {c.suffix || ''}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}