import { useEffect, useState } from 'react'
import { aiShieldApi } from '@/services/aiShieldApi'
import { useWebSocket } from '@/hooks/useWebSocket'
import '@/assets/styles/RiskGauge.css'

const REFRESH_INTERVAL_MS = 5000

const LEVEL_COLORS = {
  safe: '#4ade80',
  watch: '#facc15',
  elevated: '#fb923c',
  critical: '#ff5c8a',
}

const LEVEL_LABELS = {
  safe: 'SECURE',
  watch: 'WATCH',
  elevated: 'ELEVATED',
  critical: 'CRITICAL',
}

export default function RiskGauge() {
  const [risk, setRisk] = useState(null)
  const [error, setError] = useState(null)
  const [prevScore, setPrevScore] = useState(null)
  const { lastMessage } = useWebSocket() 

  useEffect(() => {
    let cancelled = false

    function fetchRisk() {
      aiShieldApi
        .getRiskScore()
        .then((res) => {
          if (!cancelled) {
            setPrevScore(risk?.score ?? null)
            setRisk(res)
            setError(null)
          }
        })
        .catch((err) => {
          if (!cancelled) setError(err.message)
        })
    }

    fetchRisk()
    const interval = setInterval(fetchRisk, REFRESH_INTERVAL_MS)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [risk?.score])

  useEffect(() => {
    if (!lastMessage || lastMessage.type !== 'new_events') return
    aiShieldApi 
      .getRiskScore()
      .then((res) => {
        setPrevScore(risk?.score ?? null)
        setRisk(res)
      })
      .catch(() => {})
  }, [lastMessage])

  const isThreatActive = risk?.level === 'elevated' || risk?.level === 'critical'
  const levelColor = LEVEL_COLORS[risk?.level] || '#8fa3bd'
  const scoreChange = risk && prevScore ? risk.score - prevScore : 0

  return (
    <div
      className={`risk-gauge ${isThreatActive ? 'risk-gauge--threat' : ''} ${
        error ? 'risk-gauge--error' : ''
      }`}
      style={{ '--level-color': levelColor }}
    >
      <span className="risk-gauge__corner risk-gauge__corner--tl" />
      <span className="risk-gauge__corner risk-gauge__corner--tr" />
      <span className="risk-gauge__corner risk-gauge__corner--bl" />
      <span className="risk-gauge__corner risk-gauge__corner--br" />

      <div className="risk-gauge__header">
        {error ? (
          <span>[X] ERROR</span>
        ) : (
          <div className="risk-gauge__header-left">
            <span className="risk-gauge__status-dot" />
            <span>SYSTEM.RISK</span>
          </div>
        )}
        <div className="risk-gauge__window-controls">
          <span className="risk-gauge__window-btn" />
          <span className="risk-gauge__window-btn" />
          <span className="risk-gauge__window-btn" />
        </div>
      </div>

      {error && (
        <div className="risk-gauge__error-body">
          <span className="risk-gauge__error-icon">⚠</span>
          <p className="risk-gauge__error-text">
            Gagal narik risk score: <span className="error-msg">{error}</span>
          </p>
        </div>
      )}

      {!error && !risk && (
        <div className="risk-gauge__loading-body">
          <div className="risk-gauge__loader">
            <span />
            <span />
            <span />
          </div>
          <p className="risk-gauge__loading-text">CALCULATING RISK LEVEL...</p>
        </div>
      )}

      {!error && risk && (
        <>
          <div className="risk-gauge__body">
            <div className="risk-gauge__display">
              <svg className="risk-gauge__ring" viewBox="0 0 200 200">
                <circle
                  className="risk-gauge__ring-bg"
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  strokeWidth="8"
                />
                <circle
                  className="risk-gauge__ring-progress"
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  strokeWidth="8"
                  strokeDasharray={`${(risk.score / 100) * 534} 534`}
                  strokeLinecap="square"
                />
              </svg>

              <div className="risk-gauge__score-container">
                <span className="risk-gauge__score">{risk.score}</span>
                {scoreChange !== 0 && (
                  <span
                    className={`risk-gauge__score-change ${
                      scoreChange > 0
                        ? 'risk-gauge__score-change--up'
                        : 'risk-gauge__score-change--down'
                    }`}
                  >
                    {scoreChange > 0 ? '▲' : '▼'} {Math.abs(scoreChange)}
                  </span>
                )}
              </div>
            </div>

            <div className="risk-gauge__level">
              <span className="risk-gauge__level-text">
                {LEVEL_LABELS[risk.level] || risk.level.toUpperCase()}
              </span>
              {isThreatActive && (
                <span className="risk-gauge__threat-badge">⚠ THREAT DETECTED</span>
              )}
            </div>
          </div>

          <div className="risk-gauge__footer">
            <div className="risk-gauge__stats">
              <div className="risk-gauge__stat">
                <span className="risk-gauge__stat-label">SAMPLE</span>
                <span className="risk-gauge__stat-value">{risk.sample_size}</span>
              </div>
              {risk.critical_count > 0 && (
                <div className="risk-gauge__stat risk-gauge__stat--critical">
                  <span className="risk-gauge__stat-label">CRIT</span>
                  <span className="risk-gauge__stat-value">{risk.critical_count}</span>
                </div>
              )}
              {risk.high_count > 0 && (
                <div className="risk-gauge__stat risk-gauge__stat--high">
                  <span className="risk-gauge__stat-label">HIGH</span>
                  <span className="risk-gauge__stat-value">{risk.high_count}</span>
                </div>
              )}
            </div>
            <div className="risk-gauge__refresh">
              <span className="risk-gauge__refresh-dot" />
              <span>{REFRESH_INTERVAL_MS / 1000}s</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}