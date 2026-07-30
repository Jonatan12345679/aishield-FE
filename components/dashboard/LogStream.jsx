import { Activity } from 'lucide-react'

export default function LogStream({ logs }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-400">LIVE LOG STREAM</h3>
        <span className="flex items-center gap-1.5 text-xs text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          LIVE
        </span>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {logs.map((log) => (
          <div 
            key={log.id}
            className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs animate-slide-in ${
              log.type === 'threat' 
                ? 'bg-rose-500/5 border-rose-500/20' 
                : 'bg-emerald-500/5 border-emerald-500/20'
            }`}
          >
            <span className="font-mono text-slate-500 text-[10px]">{log.time}</span>
            <span className={`font-bold ${log.type === 'threat' ? 'text-rose-400' : 'text-emerald-400'}`}>
              {log.type === 'threat' ? '⚠' : '✓'}
            </span>
            <span className={`truncate ${log.type === 'threat' ? 'text-rose-300' : 'text-slate-300'}`}>
              {log.msg}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}