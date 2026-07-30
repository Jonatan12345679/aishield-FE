export default function RiskGauge({ score, isThreatActive }) {
  const circumference = 2 * Math.PI * 50
  const offset = circumference - (score / 100) * circumference
  
  const getColor = () => {
    if (score >= 80) return { 
      stroke: '#22d3ee', 
      text: 'text-cyan-400', 
      bg: 'bg-emerald-500/10', 
      border: 'border-emerald-500/20', 
      label: 'SAFE', 
      dot: 'bg-emerald-400' 
    }
    if (score >= 50) return { 
      stroke: '#fbbf24', 
      text: 'text-amber-400', 
      bg: 'bg-amber-500/10', 
      border: 'border-amber-500/20', 
      label: 'WARNING', 
      dot: 'bg-amber-400' 
    }
    return { 
      stroke: '#fb7185', 
      text: 'text-rose-400', 
      bg: 'bg-rose-500/10', 
      border: 'border-rose-500/20', 
      label: 'CRITICAL', 
      dot: 'bg-rose-400' 
    }
  }

  const colors = getColor()

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl"></div>
      <h3 className="text-sm font-medium text-slate-400 mb-4 font-sans">RISK SCORE</h3>
      
      <div className="flex items-center justify-center">
        <div className="relative w-40 h-40">
          <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="8"/>
            <circle 
              cx="60" cy="60" r="50" fill="none" 
              stroke={colors.stroke} 
              strokeWidth="8" 
              strokeDasharray={circumference} 
              strokeDashoffset={offset} 
              strokeLinecap="round"
              className="gauge-transition"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${colors.text}`}>{score}</span>
            <span className="text-xs text-slate-500 mt-1 font-sans">/ 100</span>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-2">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} ${isThreatActive ? 'animate-pulse' : ''}`}></span>
          {colors.label}
        </span>
      </div>
    </div>
  )
}