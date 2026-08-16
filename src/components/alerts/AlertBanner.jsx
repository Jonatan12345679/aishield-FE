import { AlertTriangle, X } from 'lucide-react'
import '@/assets/styles/AlertBanner.css'

export default function AlertBanner({ data, onDismiss }) {
  const isLegacy = data.explanations && data.explanations.length > 0
  const threatColor = '#ff5c8a'

  const anomalyRatio =
    !isLegacy && data.totalGenerated > 0
      ? Math.round((data.anomaliesDetected / data.totalGenerated) * 100)
      : 0

  const scoreDiff =
    isLegacy && data.oldScore != null && data.newScore != null
      ? data.oldScore - data.newScore
      : null

  return (
    <div
      className={`alert-banner ${isLegacy ? 'alert-banner--legacy' : ''}`}
      style={{ '--threat-color': threatColor }}
    >
      <span className="alert-banner__corner alert-banner__corner--tl" />
      <span className="alert-banner__corner alert-banner__corner--tr" />
      <span className="alert-banner__corner alert-banner__corner--bl" />
      <span className="alert-banner__corner alert-banner__corner--br" />

      <div className="alert-banner__header">
        <div className="alert-banner__header-left">
          <span className="alert-banner__header-dot" />
          <AlertTriangle size={14} strokeWidth={2.5} />
          <span className="alert-banner__header-title">
            THREAT DETECTED
          </span>
        </div>
        <button
          onClick={onDismiss}
          className="alert-banner__close"
          aria-label="Dismiss"
        >
          <X size={14} strokeWidth={3} />
        </button>
      </div>

      <div className="alert-banner__body">
        <div className="alert-banner__message">
          <span className="alert-banner__prefix">&gt;</span>
          {data.message}
        </div>

        {!isLegacy && (
          <div className="alert-banner__stats">
            <div className="alert-banner__stat">
              <span className="alert-banner__stat-label">TYPE</span>
              <span className="alert-banner__stat-value alert-banner__stat-value--type">
                {(data.attackType || 'unknown')
                  .replace('_', ' ')
                  .toUpperCase()}
              </span>
            </div>

            <div className="alert-banner__stat">
              <span className="alert-banner__stat-label">GENERATED</span>
              <span className="alert-banner__stat-value">
                {data.totalGenerated}
              </span>
            </div>

            <div className="alert-banner__stat alert-banner__stat--highlight">
              <span className="alert-banner__stat-label">ANOMALIES</span>
              <span className="alert-banner__stat-value alert-banner__stat-value--danger">
                {data.anomaliesDetected}
              </span>
            </div>

            <div className="alert-banner__stat">
              <span className="alert-banner__stat-label">DURATION</span>
              <span className="alert-banner__stat-value">
                {data.durationSec}s
              </span>
            </div>
          </div>
        )}

        {!isLegacy && data.totalGenerated > 0 && (
          <div className="alert-banner__ratio">
            <div className="alert-banner__ratio-header">
              <span>DETECTION RATIO</span>
              <span>{anomalyRatio}%</span>
            </div>
            <div className="alert-banner__ratio-bar">
              <div
                className="alert-banner__ratio-fill"
                style={{ width: `${anomalyRatio}%` }}
              />
            </div>
          </div>
        )}

        {isLegacy && (
          <div className="alert-banner__ai">
            <div className="alert-banner__ai-title">
              <span>▸ AI ANALYSIS</span>
              {scoreDiff != null && (
                <span className="alert-banner__ai-score">
                  RISK ↓ {scoreDiff}
                </span>
              )}
            </div>
            <div className="alert-banner__ai-grid">
              {data.explanations.map((exp, i) => (
                <div key={i} className="alert-banner__ai-item">
                  <div className="alert-banner__ai-label">{exp.label}</div>
                  <div className="alert-banner__ai-value">{exp.value}</div>
                  <div className="alert-banner__ai-bar">
                    <div
                      className="alert-banner__ai-bar-fill"
                      style={{ width: `${exp.percent}%` }}
                    />
                  </div>
                  <span className="alert-banner__ai-pct">{exp.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="alert-banner__footer">
        <span>⚠ IMMEDIATE ACTION REQUIRED</span>
        <span>{new Date().toLocaleTimeString('id-ID', { hour12: false })}</span>
      </div>
    </div>
  )
}