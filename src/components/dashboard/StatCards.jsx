import { FileText, CheckCircle, AlertTriangle, Zap } from 'lucide-react'

export default function StatCards({ stats }) {
  const cards = [
    { label: 'Total Logs Analyzed', value: stats.totalLogs.toLocaleString(), icon: FileText, color: 'text-slate-100' },
    { label: 'Normal Activities', value: stats.normalCount.toLocaleString(), icon: CheckCircle, color: 'text-emerald-400' },
    { label: 'Threats Blocked', value: stats.threatCount.toLocaleString(), icon: AlertTriangle, color: 'text-rose-400' },
    { label: 'Avg Response Time', value: stats.avgResponse, icon: Zap, color: 'text-cyan-400' },
  ]

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
      <h3 className="text-sm font-medium text-slate-400">SECURITY METRICS</h3>
      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600 transition-colors">
            <card.icon className={`w-5 h-5 ${card.color} mb-2`} />
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            <div className="text-xs text-slate-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}