import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { api } from '../../lib/api'
import '@/assets/styles/AnomalyChart.css'

const ATTACK_COLORS = {
  port_scan: '#22d3ee',
  brute_force: '#facc15',
  ddos: '#ff5c8a',
  data_exfiltration: '#b06df5',
  unknown_anomaly: '#8fa3bd',
}

const ATTACK_LABELS = {
  port_scan: 'PORT SCAN',
  brute_force: 'BRUTE FORCE',
  ddos: 'DDOS',
  data_exfiltration: 'EXFILTRATION',
  unknown_anomaly: 'UNKNOWN',
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="anomaly-chart__tooltip">
      <div className="anomaly-chart__tooltip-header">
        <span>[DATA]</span>
        <span className="anomaly-chart__tooltip-close">×</span>
      </div>
      <div className="anomaly-chart__tooltip-body">
        <p className="anomaly-chart__tooltip-label">{item.payload.label}</p>
        <p className="anomaly-chart__tooltip-value">
          <span style={{ color: item.payload.color }}>■</span> {item.value} event
        </p>
      </div>
    </div>
  )
}

export default function AnomalyChart() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .getDashboardSummary()
      .then((summary) => {
        const chartData = Object.entries(summary.attack_type_distribution)
          .map(([key, count]) => ({
            key,
            label: ATTACK_LABELS[key] || key,
            count,
            color: ATTACK_COLORS[key] || '#8fa3bd',
          }))
          .filter((d) => d.count > 0)
          .sort((a, b) => b.count - a.count)
        setData(chartData)
      })
      .catch((err) => setError(err.message))
  }, [])

  const total = data?.reduce((acc, d) => acc + d.count, 0) || 0

  return (
    <div className="anomaly-chart">
      <span className="anomaly-chart__corner anomaly-chart__corner--tl" />
      <span className="anomaly-chart__corner anomaly-chart__corner--tr" />
      <span className="anomaly-chart__corner anomaly-chart__corner--bl" />
      <span className="anomaly-chart__corner anomaly-chart__corner--br" />

      <div className="anomaly-chart__header">
        <div className="anomaly-chart__header-left">
          <span className="anomaly-chart__status-indicator">●</span>
          <span className="anomaly-chart__title">ATTACK.TYPE.DIST</span>
        </div>
        <div className="anomaly-chart__window-controls">
          <span className="anomaly-chart__window-btn" />
          <span className="anomaly-chart__window-btn" />
          <span className="anomaly-chart__window-btn" />
        </div>
      </div>

      <div className="anomaly-chart__body">
        {error && (
          <div className="anomaly-chart__error">
            <span className="anomaly-chart__error-tag">[!] ERR</span>
            <p>Gagal narik data: <span className="error-msg">{error}</span></p>
          </div>
        )}

        {!error && !data && (
          <div className="anomaly-chart__empty">
            <div className="anomaly-chart__empty-loader">
              <span />
              <span />
              <span />
            </div>
            <span className="anomaly-chart__empty-text">LOADING DATA...</span>
          </div>
        )}

        {!error && data && data.length === 0 && (
          <div className="anomaly-chart__empty">
            <span className="anomaly-chart__empty-icon">⚠</span>
            <span className="anomaly-chart__empty-text">NO ANOMALY DETECTED</span>
          </div>
        )}

        {!error && data && data.length > 0 && (
          <>
            <div className="anomaly-chart__canvas">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 16, right: 16, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#1c2940" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{
                      fill: '#8fa3bd',
                      fontSize: 9,
                      fontFamily: "'Press Start 2P', 'JetBrains Mono', monospace",
                    }}
                    axisLine={{ stroke: '#1c2940', strokeWidth: 2 }}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis
                    tick={{
                      fill: '#8fa3bd',
                      fontSize: 10,
                      fontFamily: "'VT323', 'JetBrains Mono', monospace",
                    }}
                    axisLine={{ stroke: '#1c2940', strokeWidth: 2 }}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(34, 211, 238, 0.04)' }} />
                  <Bar dataKey="count" radius={[0, 0, 0, 0]}>
                    {data.map((d) => (
                      <Cell key={d.key} fill={d.color} stroke={d.color} strokeWidth={2} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="anomaly-chart__legend">
              <div className="anomaly-chart__legend-title">
                <span>▸ BREAKDOWN BY TYPE</span>
                <span>{data.length} TYPES</span>
              </div>
              {data.map((d) => {
                const pct = total > 0 ? Math.round((d.count / total) * 100) : 0
                return (
                  <div key={d.key} className="anomaly-chart__legend-row">
                    <span
                      className="anomaly-chart__legend-swatch"
                      style={{ background: d.color }}
                    />
                    <span className="anomaly-chart__legend-label">{d.label}</span>
                    <div className="anomaly-chart__legend-bar">
                      <div
                        className="anomaly-chart__legend-bar-fill"
                        style={{ width: `${pct}%`, '--bar-color': d.color }}
                      />
                    </div>
                    <span className="anomaly-chart__legend-count">{d.count}</span>
                    <span className="anomaly-chart__legend-pct">{pct}%</span>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      <div className="anomaly-chart__footer">
        <span>MODEL: ISOLATION FOREST</span>
        <span>{total} TOTAL</span>
      </div>
    </div>
  )
}