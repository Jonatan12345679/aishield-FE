import { PixelCard } from '@pxlkit/ui-kit'
import { PxlKitIcon } from '@pxlkit/core'
import { CheckCircle, ShieldExclamation } from '@pxlkit/feedback'
import { Lightning } from '@pxlkit/gamification'
import { Edit } from '@pxlkit/ui'

export default function StatCards({ stats }) {
  const cards = [
    { label: 'TOTAL LOGS', value: stats.totalLogs.toLocaleString(), icon: Edit, textColor: 'text-slate-100', iconColor: '#f1f5f9', bg: 'bg-slate-800' },
    { label: 'NORMAL', value: stats.normalCount.toLocaleString(), icon: CheckCircle, textColor: 'text-emerald-400', iconColor: '#34d399', bg: 'bg-emerald-950/40' },
    { label: 'BLOCKED', value: stats.threatCount.toLocaleString(), icon: ShieldExclamation, textColor: 'text-rose-400', iconColor: '#fb7185', bg: 'bg-rose-950/40' },
    { label: 'LATENCY', value: stats.avgResponse, icon: Lightning, textColor: 'text-cyan-400', iconColor: '#22d3ee', bg: 'bg-cyan-950/40' },
  ]

  return (
    <PixelCard 
      tone="dark" 
      className="p-5 bg-slate-900/90 border-2 border-slate-700 backdrop-blur h-full"
    >
      {/* Header */}
      <div className="mb-5 border-b-2 border-slate-800 pb-3">
        <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-widest">
          Security Metrics
        </h3>
      </div>

      {/* Grid Kartu */}
      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, i) => (
          <div 
            key={i} 
            className={`
              relative p-4 border-2 border-slate-700 rounded-none ${card.bg}
              shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] 
              hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] 
              transition-all duration-150 cursor-default
            `}
          >
            <div className="mb-3">
              {/* Icon */}
              <PxlKitIcon 
                icon={card.icon} 
                size={24} 
                appearance="solid" 
                color={card.iconColor} 
              />
            </div>
            
            {/* Nilai Angka */}
            <div className={`text-2xl font-black font-mono ${card.textColor}`}>
              {card.value}
            </div>
            
            {/* Label */}
            <div className="text-[10px] text-slate-400 font-mono mt-1 uppercase tracking-widest font-bold">
              {card.label}
            </div>
          </div>
        ))}
      </div>
    </PixelCard>
  )
}