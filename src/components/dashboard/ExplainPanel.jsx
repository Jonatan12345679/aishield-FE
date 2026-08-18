import { useEffect, useState } from 'react'
import { aiShieldApi } from '@/services/aiShieldApi'
import '@/assets/styles/ExplainPanel.css'

export default function ExplainPanel({ eventId }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setData(null)
    setError(null)

    aiShieldApi
      .explainEvent(eventId)
      .then((res) => !cancelled && setData(res))
      .catch((err) => !cancelled && setError(err.message))

    return () => {
      cancelled = true
    }
  }, [eventId])

  return (
    <div className="explain-panel">
      <div className="explain-panel__header">
        <span>▸ EXPLAIN.AI</span>
        <span>why this event flagged?</span>
      </div>

      {error && <p className="explain-panel__error">&gt; {error}</p>}

      {!error && !data && (
        <p className="explain-panel__loading">
          &gt; analyzing features<span className="explain-panel__dots">...</span>
        </p>
      )}

      {data && (
        <>
          <div className="explain-panel__meta">
            <span className={`explain-panel__verdict ${data.is_anomaly ? 'explain-panel__verdict--anomaly' : ''}`}>
              {data.is_anomaly ? 'ANOMALY' : 'NORMAL'}
            </span>
            <span>score {data.anomaly_score?.toFixed(3)}</span>
            <span>risk {data.risk_level}</span>
            <span>{data.attack_type}</span>
          </div>

          <div className="explain-panel__list">
            {data.contributors.map((c) => (
              <div key={c.feature} className="explain-panel__row">
                <span className="explain-panel__label">{c.label}</span>
                <div className="explain-panel__bar">
                  <div
                    className="explain-panel__bar-fill"
                    style={{ width: `${c.contribution}%` }}
                  />
                </div>
                <span className="explain-panel__pct">{c.contribution}%</span>
                <span className="explain-panel__detail">
                  {c.value} vs ≈{c.baseline}
                  {c.ratio != null && c.ratio >= 2 && <em> ({c.ratio}x normal)</em>}
                </span>
              </div>
            ))}
          </div>

          <p className="explain-panel__footnote">
            &gt; kontribusi = |z-score| fitur vs baseline traffic normal
          </p>
        </>
      )}
    </div>
  )
}