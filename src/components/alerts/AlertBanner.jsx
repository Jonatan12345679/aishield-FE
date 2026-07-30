import { AlertTriangle } from 'lucide-react'

export default function AlertBanner({ data }) {
  return (
    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 animate-slide-in">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center animate-pulse">
          <AlertTriangle className="w-6 h-6 text-rose-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-rose-400 font-bold text-lg">THREAT DETECTED</h4>
          <p className="text-sm text-rose-300/80">{data.message}</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-rose-400/60">RISK INCREASED</div>
          <div className="text-2xl font-bold text-rose-400">+{data.oldScore - data.newScore}</div>
        </div>
      </div>
      
      {/* Explainable AI Panel */}
      <div className="mt-4 pt-4 border-t border-rose-500/20">
        <div className="text-xs text-rose-400/60 mb-2 font-semibold uppercase tracking-wider">AI Analysis</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {data.explanations.map((exp, i) => (
            <div key={i} className="bg-rose-500/5 rounded-lg p-3 border border-rose-500/10">
              <div className="text-xs text-slate-400">{exp.label}</div>
              <div className="text-sm font-semibold text-rose-300">{exp.value}</div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-rose-400 h-1.5 rounded-full transition-all duration-1000" 
                  style={{ width: `${exp.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}