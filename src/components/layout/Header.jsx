import { useState, useEffect } from 'react'
import { PxlKitIcon } from '@pxlkit/core'
import { Shield } from '@pxlkit/gamification'
import { PixelIconFrame, PixelBadge, PixelPulse } from '@pxlkit/ui-kit'
import { Navigate } from 'react-router-dom'

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
    <header
      className={`border-b-4 backdrop-blur sticky top-0 z-50 transition-colors duration-300 ${
        isThreatActive
          ? 'bg-rose-950/90 border-rose-500'
          : 'bg-slate-900/90 border-slate-700'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PixelIconFrame
            tone={isThreatActive ? 'red' : 'cyan'}
            icon={
              <PxlKitIcon
                icon={Shield}
                size={24}
                appearance="tinted"
                color={isThreatActive ? '#fb7185' : '#22d3ee'}
              />
            }
          />
          <div>
            <h1 className="text-xl font-bold tracking-widest text-cyan-400 uppercase">
              AIShield
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest">
              AI-Powered Cyber Defense
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <PixelPulse trigger={isThreatActive} duration={1200}>
            <PixelBadge tone={isThreatActive ? 'gold' : 'green'}>
              {isThreatActive ? 'THREAT ACTIVE' : 'SYSTEM ACTIVE'}
            </PixelBadge>
          </PixelPulse>
          <div className="text-xs text-slate-500 font-mono hidden sm:block">
            {time}
          </div>
        </div>
      </div>
    </header>
  )
}
