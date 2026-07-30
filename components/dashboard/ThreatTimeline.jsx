import { Shield, AlertTriangle, Info, CheckCircle } from 'lucide-react'

export default function ThreatTimeline({ events }) {
  const icons = {
    safe: CheckCircle,
    threat: AlertTriangle,
    info: Info
  }

  const colors = {
    safe: 'bg-emerald-400',
    threat: 'bg-rose-400',
    info: 'bg-cyan-400'
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-sm font-medium text-slate-400 mb-4">THREAT TIMELINE</h3>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-800"></div>
        <div className="space-y-4">
          {events.map((event) => {
            const Icon = icons[event.type]
            return (
              <div key={event.id} className="flex items-start gap-4 relative">
                <div className={`w-8 h-8 rounded-full ${colors[event.type]} flex items-center justify-center flex-shrink-0 z-10`}>
                  <Icon className="w-4 h-4 text-slate-900" />
                </div>
                <div className="flex-1 pb-4">
                  <div className="text-xs text-slate-500 font-mono">{event.time}</div>
                  <div className="text-sm font-semibold text-slate-200 mt-0.5">{event.title}</div>
                  <div className="text-xs text-slate-500 mt-1">{event.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}