import { useEffect, useState } from 'react'
import { Activity, AlertTriangle, Percent } from 'lucide-react'
import { aiShieldApi } from '@/services/aiShieldApi'
import '@/assets/styles/StatCard.css'

const CARD_CONFIG = [
  { 
    key: 'total_events', 
    label: 'TOTAL EVENTS', 
    title: 'SYS.LOG', 
    tone: '', 
    icon: Activity 
  },
  { 
    key: 'total_anomalies', 
    label: 'ANOMALIES DETECTED', 
    title: 'THREAT.ALERT', 
    tone: 'rose', 
    icon: AlertTriangle 
  },
  { 
    key: 'anomaly_rate', 
    label: 'ANOMALY RATE', 
    title: 'STAT.RATE', 
    tone: 'amber', 
    icon: Percent, 
    suffix: '%' 
  },
]

export default function StatCards() {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    aiShieldApi
      .getDashboardSummary()
      .then(setSummary)
      .catch((err) => setError(err.message))
  }, [])

  if (error) {
    return (
      <div className="stat-cards__error">
        <span className="error-tag">[X] SYSTEM FAILURE</span>
        <p>Gagal narik data dashboard: <span className="error-msg">{error}</span></p>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="stat-cards">
        {CARD_CONFIG.map((c) => (
          <div key={c.key} className={`stat-card stat-card--skeleton ${c.tone}`}>
            <div className="stat-card__header">
              <span>LOADING...</span>
              <div className="stat-card__window-controls">
                <span className="stat-card__window-btn" />
                <span className="stat-card__window-btn" />
              </div>
            </div>
            <span className="stat-card__corner stat-card__corner--tl" />
            <span className="stat-card__corner stat-card__corner--tr" />
            <span className="stat-card__corner stat-card__corner--bl" />
            <span className="stat-card__corner stat-card__corner--br" />
            <div className="stat-card__body">
              <div className="stat-card__icon-box" />
              <div className="stat-card__content" />
            </div>
          </div>
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
            <div className="stat-card__header">
              <span>{c.title || c.label}</span>
              <div className="stat-card__window-controls">
                <span className="stat-card__window-btn" />
                <span className="stat-card__window-btn" />
              </div>
            </div>

            <span className="stat-card__corner stat-card__corner--tl" />
            <span className="stat-card__corner stat-card__corner--tr" />
            <span className="stat-card__corner stat-card__corner--bl" />
            <span className="stat-card__corner stat-card__corner--br" />
      
            <div className="stat-card__body">
              <div className="stat-card__icon-box">
                <Icon size={28} strokeWidth={2.5} />
              </div>
              <div className="stat-card__content">
                <p className="stat-card__label">{c.label}</p>
                <p className="stat-card__value">
                  {summary[c.key]}
                  {c.suffix && <span className="stat-card__suffix">{c.suffix}</span>}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}