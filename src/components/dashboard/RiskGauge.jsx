import { PixelCard } from '@pxlkit/ui-kit'

export default function RiskGauge({ score, isThreatActive }) {
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  
  const getColor = () => {
    if (score >= 80) return { 
      stroke: '#34d399', 
      text: 'text-emerald-400', 
      label: 'SYSTEM SAFE', 
      indicator: 'bg-emerald-400' 
    }
    if (score >= 50) return { 
      stroke: '#fbbf24', 
      text: 'text-amber-400', 
      label: 'WARNING', 
      indicator: 'bg-amber-400' 
    }
    return { 
      stroke: '#fb7185', 
      text: 'text-rose-400', 
      label: 'CRITICAL', 
      indicator: 'bg-rose-400' 
    }
  }

  const colors = getColor()

  return (
    <PixelCard 
      tone={score < 50 || isThreatActive ? 'red' : 'dark'} 
      className="p-6 bg-slate-900/90 border-2 border-slate-700 backdrop-blur h-full flex flex-col justify-between"
    >
      {/* Header */}
      <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-widest mb-6 border-b-2 border-slate-800 pb-3">
        Risk Score
      </h3>
      
      <div className="flex items-center justify-center flex-1">
        <div className="relative w-40 h-40">
          <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
            <circle 
              cx="60" cy="60" r={radius} 
              fill="none" 
              stroke="#1e293b" 
              strokeWidth="12"
            />
            <circle 
              cx="60" cy="60" r={radius} 
              fill="none" 
              stroke={colors.stroke} 
              strokeWidth="12" 
              strokeDasharray={circumference} 
              strokeDashoffset={offset} 
              className="transition-all duration-700 ease-in-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-black font-mono ${colors.text}`}>
              {score}
            </span>
            <span className="text-[10px] text-slate-500 mt-1 font-mono tracking-widest border-t-2 border-slate-800 pt-1 w-12 text-center">
              /100
            </span>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-6">
        <div className="inline-flex items-center gap-3 px-3 py-1.5 border-2 border-slate-700 bg-slate-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <span 
            className={`w-2.5 h-2.5 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${colors.indicator} ${isThreatActive ? 'animate-pulse' : ''}`}
          ></span>
          <span className={`text-xs font-bold font-mono uppercase tracking-widest ${colors.text}`}>
            {colors.label}
          </span>
        </div>
      </div>
    </PixelCard>
  )
}