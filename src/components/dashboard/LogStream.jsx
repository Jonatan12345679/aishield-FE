import { PixelCard } from '@pxlkit/ui-kit'
import { PxlKitIcon } from '@pxlkit/core'
import { CheckCircle, ShieldAlert } from '@pxlkit/feedback'

export default function LogStream({ logs }) {
  return (
    <PixelCard 
      tone="dark" 
      className="p-6 bg-slate-900/90 border-2 border-slate-700 backdrop-blur h-full"
    >
      {/* Header*/}
      <div className="flex items-center justify-between mb-4 border-b-2 border-slate-800 pb-3">
        <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-widest">
          Live Log Stream
        </h3>
        
        <span className="flex items-center gap-2 text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-widest">
          <span className="w-2 h-2 bg-emerald-400 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] animate-pulse"></span>
          LIVE
        </span>
      </div>

      <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        {logs.map((log) => {
          const isThreat = log.type === 'threat'
          
          return (
            <div 
              key={log.id}
              className={`flex items-start gap-3 p-2.5 border-2 rounded-none animate-slide-in shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] ${
                isThreat 
                  ? 'bg-rose-950/40 border-rose-900/80' 
                  : 'bg-slate-800/40 border-slate-700/80'
              }`}
            >
              {/* Timestamp */}
              <span className="font-mono text-slate-500 text-[10px] mt-0.5 shrink-0 w-12">
                [{log.time}]
              </span>
              
              <div className="shrink-0 mt-0.5">
                <PxlKitIcon 
                  icon={isThreat ? ShieldAlert : CheckCircle} 
                  size={16} 
                  appearance="solid" 
                  color={isThreat ? '#fb7185' : '#34d399'} 
                />
              </div>
              
              {/* Pesan Log */}
              <span className={`font-mono text-xs leading-relaxed ${isThreat ? 'text-rose-300 font-bold' : 'text-emerald-300'}`}>
                {isThreat ? '>> WARNING: ' : '> '}
                <span className={isThreat ? 'text-rose-200' : 'text-slate-300'}>
                  {log.msg}
                </span>
              </span>
            </div>
          )
        })}
      </div>
    </PixelCard>
  )
}