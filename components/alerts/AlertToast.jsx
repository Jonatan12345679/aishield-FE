import { Info } from 'lucide-react'

export default function AlertToast({ title, message }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-in">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-xl p-4 shadow-2xl shadow-cyan-500/10 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
            <Info className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-200">{title}</div>
            <div className="text-xs text-slate-500 mt-1">{message}</div>
          </div>
        </div>
      </div>
    </div>
  )
}