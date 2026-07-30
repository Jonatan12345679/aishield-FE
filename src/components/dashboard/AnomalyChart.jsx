import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function AnomalyChart({ isThreatActive }) {
  const [data, setData] = useState(() => 
    Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      value: Math.floor(Math.random() * 80) + 10,
      isAnomaly: Math.random() > 0.85
    }))
  )

  useEffect(() => {
    if (isThreatActive) {
      setData(prev => {
        const newData = [...prev]
        newData[23] = { ...newData[23], value: 95, isAnomaly: true }
        return newData
      })
    }
  }, [isThreatActive])

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium text-slate-400">ANOMALY HISTORY (24H)</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs text-slate-500">Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            <span className="text-xs text-slate-500">Anomaly</span>
          </div>
        </div>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="hour" 
              tick={{ fill: '#64748b', fontSize: 10 }} 
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                border: '1px solid #334155',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              itemStyle={{ color: '#94a3b8' }}
            />
            <Bar dataKey="value" radius={[2, 2, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isAnomaly ? '#fb7185' : '#10b981'} 
                  fillOpacity={entry.isAnomaly ? 0.8 : 0.4}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}