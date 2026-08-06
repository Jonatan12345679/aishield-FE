import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { PixelCard } from '@pxlkit/ui-kit'

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
    <PixelCard 
      tone={isThreatActive ? 'red' : 'dark'} 
      className="p-5 bg-slate-900/90 border-2 border-slate-700 backdrop-blur"
    >
      {/* Header Chart */}
      <div className="flex items-center justify-between mb-6 border-b-2 border-slate-800 pb-3">
        <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-widest">
          Anomaly History (24H)
        </h3>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-400 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"></span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-rose-400 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"></span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Anomaly</span>
          </div>
        </div>
      </div>

      {/* Area Chart */}
      <div className="h-48 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="hour" 
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} 
              axisLine={{ stroke: '#334155', strokeWidth: 2 }} 
              tickLine={false}
            />
            <YAxis hide />
            
            {/* Tooltip*/}
            <Tooltip 
              cursor={{ fill: '#1e293b' }}
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                border: '2px solid #334155',
                borderRadius: '0px',
                fontFamily: 'monospace',
                fontSize: '11px',
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.6)' 
              }}
              itemStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
            />

            {/* Bar */}
            <Bar dataKey="value" radius={[0, 0, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isAnomaly ? '#fb7185' : '#34d399'} 
                  fillOpacity={1} // Dibuat solid (1) agar warna tegas seperti game 8-bit
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </PixelCard>
  )
}