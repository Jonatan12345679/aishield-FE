import { Shield, Activity } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Header({ isThreatActive }) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('id-ID', { hour12: false }) + ' WIB')
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className={`border-b backdrop-blur sticky top-0 z-50 transition-colors duration-500 ${
      isThreatActive 
        ? 'bg-rose-950/80 border-rose-500/30' 
        : 'bg-slate-900/80 border-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors duration-500 ${
            isThreatActive 
              ? 'bg-rose-500/20 border-rose-500/40' 
              : 'bg-cyan-500/20 border-cyan-500/40'
          }`}>
            <Shield className={`w-6 h-6 ${isThreatActive ? 'text-rose-400' : 'text-cyan-400'}`} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide text-cyan-400">AIShield</h1>
            <p className="text-xs text-slate-500 font-sans">AI-Powered Cyber Defense</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
            isThreatActive 
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            <Activity className={`w-3 h-3 ${isThreatActive ? '' : 'animate-pulse'}`} />
            <span className="text-xs font-medium">{isThreatActive ? 'THREAT ACTIVE' : 'SYSTEM ACTIVE'}</span>
          </div>
          <div className="text-xs text-slate-500 font-mono hidden sm:block">{time}</div>
        </div>
      </div>
    </header>
  )
}