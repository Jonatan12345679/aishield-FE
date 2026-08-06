import { PixelButton, PixelCard, PixelBadge } from '@pxlkit/ui-kit'
import { PxlKitIcon } from '@pxlkit/core'
import { CheckCircle, ShieldAlert } from '@pxlkit/feedback'
import { History } from '@pxlkit/ui';


export default function SimulationPanel({ onSimulateNormal, onSimulateThreat, onReset, isThreatActive }) {
  return (
    <PixelCard
      tone={isThreatActive ? 'red' : 'dark'}
      className="p-5 border-2 border-slate-700 bg-slate-900/80 backdrop-blur"
      >
        {/*Header*/}
        <div className="flex items-center justify-between     mb-4 border-b-2 border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <PixelBadge tone={isThreatActive ? 'red' : 'green'}>
                  {isThreatActive ? 'CRITICAL MODE' : 'MONITORING'}
                </PixelBadge>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Simulate Traffic
                </span>
              </div>
              <button 
          onClick={onReset}
          className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
        >
          <PxlKitIcon icon={History} size={16} appearance="tinted" color="#94a3b8" />
          <span>RESET</span>
        </button>
      </div>

      {/* Grid Tombol Simulasi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tombol Simulate Normal */}
        <PixelButton 
          onClick={onSimulateNormal}
          variant="primary"
          className="w-full h-auto! min-h-16! py-3! px-4! justify-start items-center gap-4 bg-emerald-900/30! border-emerald-600! hover:bg-emerald-900/50! transition-all"
        >
          <div className="shrink-0">
            <PxlKitIcon icon={CheckCircle} size={24} appearance="solid" color="#34d399" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <div className="text-sm font-bold text-emerald-300 leading-tight">
              SIMULATE NORMAL
            </div>
            <div className="text-[11px] text-emerald-400/80 font-mono leading-tight mt-0.5">
              Generate benign activity log
            </div>
          </div>
        </PixelButton>

        {/* Tombol Simulate Attack */}
        <PixelButton 
          onClick={onSimulateThreat}
          disabled={isThreatActive}
          variant="danger"
          className="w-full h-auto! min-h-16! py-3! px-4! justify-start items-center gap-4 bg-rose-900/30! border-rose-600! hover:bg-rose-900/50! transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="shrink-0">
            <PxlKitIcon icon={ShieldAlert} size={24} appearance="solid" color="#fb7185" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <div className="text-sm font-bold text-rose-300 leading-tight">
              SIMULATE ATTACK
            </div>
            <div className="text-[11px] text-rose-400/80 font-mono leading-tight mt-0.5">
              Trigger anomaly detection
            </div>
          </div>
        </PixelButton>
          </div>    
      </PixelCard>
      
  )
}