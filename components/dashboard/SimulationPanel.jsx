import { CheckCircle, AlertTriangle, RotateCcw } from 'lucide-react'

export default function SimulationPanel({ onSimulateNormal, onSimulateThreat, onReset, isThreatActive }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-sm font-medium text-slate-400 mb-4">SIMULATION PANEL</h3>
      <div className="space-y-3">
        <button 
          onClick={onSimulateNormal}
          className="w-full group relative overflow-hidden rounded-xl bg-slate-800 border border-slate-700 p-4 text-left transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Simulate Normal</div>
              <div className="text-xs text-slate-500">Generate benign activity log</div>
            </div>
          </div>
        </button>

        <button 
          onClick={onSimulateThreat}
          disabled={isThreatActive}
          className={`w-full group relative overflow-hidden rounded-xl border p-4 text-left transition-all ${
            isThreatActive 
              ? 'bg-slate-800/50 border-slate-700 opacity-50 cursor-not-allowed' 
              : 'bg-slate-800 border-slate-700 hover:border-rose-500/50 hover:bg-rose-500/5'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              isThreatActive ? 'bg-slate-700' : 'bg-rose-500/10 group-hover:bg-rose-500/20'
            }`}>
              <AlertTriangle className={`w-5 h-5 ${isThreatActive ? 'text-slate-500' : 'text-rose-400'}`} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Simulate Attack</div>
              <div className="text-xs text-slate-500">Trigger anomaly detection</div>
            </div>
          </div>
        </button>

        <button 
          onClick={onReset}
          className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-center text-xs text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-3 h-3" />
          Reset Dashboard
        </button>
      </div>
    </div>
  )
}