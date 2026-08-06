import { PixelCard } from '@pxlkit/ui-kit'
import { PxlKitIcon } from '@pxlkit/core'
import { CheckCircle, ShieldAlert } from '@pxlkit/feedback'
import { InfoCircle } from '@pxlkit/feedback'

export default function ThreatTimeline({ events }) {
  const typeConfig = {
    safe: { icon: CheckCircle, hex: '#34d399', bg: 'bg-emerald-950/40', border: 'border-emerald-600' },
    threat: { icon: ShieldAlert, hex: '#fb7185', bg: 'bg-rose-950/40', border: 'border-rose-600' },
    info: { icon: InfoCircle, hex: '#22d3ee', bg: 'bg-cyan-950/40', border: 'border-cyan-600' }
  }

  return (
  <PixelCard 
      tone="dark" 
      className="p-6 bg-slate-900/90 border-2 border-slate-700 backdrop-blur h-full"
    >
    {/* Header */}
    <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-widest mb-6 border-b-2 border-slate-800 pb-3">
      Threat Timeline
    </h3>
    <div className="relative pl-2">
        <div className="absolute left-5.75 top-2 bottom-0 w-1 bg-slate-800 border-x border-slate-950"></div>
        <div className="space-y-6">
          {events.map((event) => {
            const config = typeConfig[event.type] || typeConfig.info
            return (
              <div key={event.id} className="flex items-start gap-5 relative">
                <div 
                  className={`w-9 h-9 rounded-none border-2 border-slate-800 flex items-center justify-center shrink-0 z-10 
                  ${config.bg} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5`}
                >
                  <PxlKitIcon 
                    icon={config.icon} 
                    size={20} 
                    appearance="solid" 
                    color={config.hex} 
                  />
                </div>
                
                {/*Timeline*/}
                <div className="flex-1 pt-0.5">
                  <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-700 inline-block"></span>
                    {event.time}
                  </div>
                  <div className="text-sm font-black font-mono text-slate-200 uppercase tracking-wide">
                    {event.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-mono leading-relaxed border-l-2 border-slate-800 pl-3 ml-0.5">
                    {event.desc}
                  </div>
                </div>
                
              </div>
            )
          })}
        </div>
      </div>
    </PixelCard>
  )
}