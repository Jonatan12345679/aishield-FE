import { useEffect, useState } from 'react'
import { aiShieldApi } from '@/services/aiShieldApi'
import '@/assets/styles/ModelCard.css'

const ATTACK_LABELS = {
  port_scan: 'PORT SCAN',
  brute_force: 'BRUTE FORCE',
  ddos: 'DDOS',
  data_exfiltration: 'EXFILTRATION',
  unknown_anomaly: 'UNKNOWN',
}

function toPct(val) {
  if (typeof val !== 'number' || Number.isNaN(val)) return null
  return val <= 1 ? val * 100 : val
}

export default function ModelCard() {
  const [metrics, setMetrics] = useState(null)
  const [error, setError] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    let cancelled = false
    aiShieldApi
      .getModelMetrics()
      .then((res) => !cancelled && setMetrics(res))
      .catch((err) => !cancelled && setError(err.message))
    return () => {
      cancelled = true
    }
  }, [])

  // ===== mapping presisi sesuai format metrics.json =====
  let derived = null
  if (metrics) {
    const bm = metrics.binary_metrics ?? {}
    const cr = metrics.classification_report ?? {}
    const cm = metrics.confusion_matrix ?? {}

    const precision = toPct(bm.precision)
    const recall = toPct(bm.recall)
    const f1 = toPct(bm.f1_score ?? bm.f1)
    const accuracy = toPct(cr.accuracy)

    const binaryRows = [
      { label: 'PRECISION', pct: precision, detail: null },
      { label: 'RECALL', pct: recall, detail: null },
      { label: 'F1', pct: f1, detail: null },
      { label: 'ACCURACY', pct: accuracy, detail: null },
    ].filter((r) => r.pct != null)

    const attackRows = Object.entries(metrics.per_attack_type_recall ?? {})
      .map(([key, val]) => {
        const v = typeof val === 'object' ? val : {}
        return {
          key,
          pct: toPct(v.recall ?? (typeof val === 'number' ? val : undefined)),
          detail:
            v.detected != null && v.total != null
              ? `${v.detected}/${v.total}`
              : null,
        }
      })
      .filter((r) => r.pct != null)

    derived = { f1, binaryRows, attackRows, cm }
  }

  return (
    <div className={`model-card ${isExpanded ? 'model-card--expanded' : ''}`}>
      <span className="model-card__corner model-card__corner--tl" />
      <span className="model-card__corner model-card__corner--tr" />
      <span className="model-card__corner model-card__corner--bl" />
      <span className="model-card__corner model-card__corner--br" />

      <div
        className="model-card__header"
        onClick={() => setIsExpanded((v) => !v)}
        role="button"
      >
        <div className="model-card__header-left">
          <span className="model-card__status-dot" />
          <span>MODEL.CARD</span>
          <span className="model-card__title">Isolation Forest</span>
        </div>
        <div className="model-card__header-right">
          <span className="model-card__toggle">
            {isExpanded ? '▲ COLLAPSE' : '▼ DETAILS'}
          </span>
          <div className="model-card__window-controls">
            <span className="model-card__window-btn" />
            <span className="model-card__window-btn" />
          </div>
        </div>
      </div>

      {!isExpanded && (
        <div className="model-card__summary">
          <span className="model-card__summary-item">
            <span className="model-card__summary-label">TRAIN ROWS</span>
            <span className="model-card__summary-value">
              {metrics?.train_rows?.toLocaleString() ?? '—'}
            </span>
          </span>
          <span className="model-card__summary-divider">|</span>
          <span className="model-card__summary-item">
            <span className="model-card__summary-label">F1</span>
            <span className="model-card__summary-value model-card__summary-value--accent">
              {derived?.f1 != null ? `${derived.f1.toFixed(1)}%` : '—'}
            </span>
          </span>
          <span className="model-card__summary-divider">|</span>
          <span className="model-card__summary-item">
            <span className="model-card__summary-label">ESTIMATORS</span>
            <span className="model-card__summary-value">
              {metrics?.n_estimators ?? '—'}
            </span>
          </span>
          <span className="model-card__summary-divider">|</span>
          <span className="model-card__summary-item">
            <span className="model-card__summary-label">CLICK</span>
            <span className="model-card__summary-value model-card__summary-value--hint">▶</span>
          </span>
        </div>
      )}

      {isExpanded && (
        <div className="model-card__body">
          {error && (
            <div className="model-card__error">
              <span className="model-card__error-tag">[!] ERR</span>
              <p>Gagal memuat metrics: <span className="error-msg">{error}</span></p>
            </div>
          )}

          {!error && !metrics && (
            <div className="model-card__loading">
              <span className="model-card__loading-text">LOADING METRICS...</span>
            </div>
          )}

          {metrics && derived && (
            <>
              <div className="model-card__section">
                <div className="model-card__section-title">▸ TRAINING STATS</div>
                <div className="model-card__stats-grid">
                  <div className="model-card__stat">
                    <span className="model-card__stat-label">N_ESTIMATORS</span>
                    <span className="model-card__stat-value">{metrics.n_estimators}</span>
                  </div>
                  <div className="model-card__stat">
                    <span className="model-card__stat-label">CONTAMINATION</span>
                    <span className="model-card__stat-value">
                      {(metrics.contamination * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="model-card__stat">
                    <span className="model-card__stat-label">TRAIN ROWS</span>
                    <span className="model-card__stat-value">
                      {metrics.train_rows.toLocaleString()}
                    </span>
                  </div>
                  <div className="model-card__stat">
                    <span className="model-card__stat-label">TEST ROWS</span>
                    <span className="model-card__stat-value">
                      {metrics.test_rows.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="model-card__section">
                <div className="model-card__section-title">▸ BINARY METRICS</div>
                <div className="model-card__bars">
                  {derived.binaryRows.map((row) => (
                    <div key={row.label} className="model-card__bar-row">
                      <span className="model-card__bar-label">{row.label}</span>
                      <div className="model-card__bar">
                        <div
                          className="model-card__bar-fill"
                          style={{ width: `${Math.min(row.pct, 100)}%` }}
                        />
                      </div>
                      <span className="model-card__bar-detail">{row.detail ?? ''}</span>
                      <span className="model-card__bar-pct">{row.pct.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {derived.attackRows.length > 0 && (
                <div className="model-card__section">
                  <div className="model-card__section-title">▸ RECALL BY ATTACK TYPE</div>
                  <div className="model-card__bars">
                    {derived.attackRows.map((row) => (
                      <div key={row.key} className="model-card__bar-row">
                        <span className="model-card__bar-label">
                          {ATTACK_LABELS[row.key] || row.key.toUpperCase()}
                        </span>
                        <div className="model-card__bar">
                          <div
                            className="model-card__bar-fill model-card__bar-fill--alt"
                            style={{ width: `${Math.min(row.pct, 100)}%` }}
                          />
                        </div>
                        <span className="model-card__bar-detail">{row.detail ?? ''}</span>
                        <span className="model-card__bar-pct">{row.pct.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {derived.cm?.matrix && (
                <div className="model-card__section">
                  <div className="model-card__section-title">▸ CONFUSION MATRIX</div>
                  <div className="model-card__cm">
                    <div className="model-card__cm-cell model-card__cm-cell--good">
                      <span className="model-card__cm-label">TN</span>
                      <span className="model-card__cm-value">{derived.cm.matrix[0][0]}</span>
                      <span className="model-card__cm-sub">normal → normal</span>
                    </div>
                    <div className="model-card__cm-cell model-card__cm-cell--bad">
                      <span className="model-card__cm-label">FP</span>
                      <span className="model-card__cm-value">{derived.cm.matrix[0][1]}</span>
                      <span className="model-card__cm-sub">normal → anomaly</span>
                    </div>
                    <div className="model-card__cm-cell model-card__cm-cell--bad">
                      <span className="model-card__cm-label">FN</span>
                      <span className="model-card__cm-value">{derived.cm.matrix[1][0]}</span>
                      <span className="model-card__cm-sub">anomaly → normal</span>
                    </div>
                    <div className="model-card__cm-cell model-card__cm-cell--good">
                      <span className="model-card__cm-label">TP</span>
                      <span className="model-card__cm-value">{derived.cm.matrix[1][1]}</span>
                      <span className="model-card__cm-sub">anomaly → anomaly</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="model-card__note">
                &gt; Model dilatih di data synthetic realistis. Evaluasi pada{' '}
                {metrics.test_rows.toLocaleString()} event unseen. Explainability
                via z-score fitur vs baseline normal.
              </div>
            </>
          )}
        </div>
      )}

      <div className="model-card__footer">
        <span>TRANSPARENT.AI</span>
        <span>{derived?.f1 != null ? `F1 = ${derived.f1.toFixed(1)}%` : '—'}</span>
      </div>
    </div>
  )
}