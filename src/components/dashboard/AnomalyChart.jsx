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
      {item.payload.label}: <b>{item.value}</b> event
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

  return (
    <div className="anomaly-chart">
      <div className="anomaly-chart__header">
        <span className="anomaly-chart__title">Attack Type Distribution</span>
        <span className="anomaly-chart__subtitle">by anomaly count</span>
      </div>

      {error && <div className="anomaly-chart__error">Gagal narik data: {error}</div>}

      {!error && !data && <div className="anomaly-chart__empty">Loading...</div>}

      {!error && data && data.length === 0 && (
        <div className="anomaly-chart__empty">Belum ada anomali terdeteksi.</div>
      )}

      {!error && data && data.length > 0 && (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1c2940" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#8fa3bd', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
              axisLine={{ stroke: '#1c2940' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#8fa3bd', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
              axisLine={{ stroke: '#1c2940' }}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar dataKey="count" radius={[2, 2, 0, 0]}>
              {data.map((d) => (
                <Cell key={d.key} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}