import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { PxlKitIcon } from '@pxlkit/core'
import { Shield } from '@pxlkit/gamification'
import icon from '@/assets/img/icon.png'
import {
  PixelIconFrame,
  PixelBadge,
  PixelPulse
} from '@pxlkit/ui-kit'
import {
  ChevronDown,
  ShieldCheck,
  ScanFace
} from 'lucide-react'

export default function Header({ isThreatActive }) {
  const [time, setTime] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('id-ID', {
          hour12: false
        }) + ' WIB'
      )
    }

    update()

    const interval = setInterval(update, 1000)

    return () => clearInterval(interval)
  }, [])

  // Close dropdown ketika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
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

        {/* Logo */}
        <Link
          to="/"
          onClick={() => setIsMenuOpen(false)}
          className="group flex items-start gap-3 px-4 py-3 border-b border-slate-800 hover:bg-cyan-950/30 transition-colors"
        >
          <div className="flex items-center gap-3">
          
            <PixelIconFrame
              tone={isThreatActive ? 'red' : 'cyan'}
              icon={
                <img
                  src={icon}
                  alt="Logo"
                  width={50}
                  height={50}
                  className="pixel-render"
                />
              }
            />

            <div>
              <h1 className="text-xl font-bold tracking-widest text-cyan-400 uppercase">
                Aegis AI
              </h1>

              <p className="text-[10px] text-slate-500 font-mono tracking-widest">
                detect network anomalies & protect visual privacy
              </p>
            </div>
          </div>
        </Link>

        {/* Navigation + Status */}
        <div className="flex items-center gap-4">

          {/* Product Dropdown */}
          <div
            ref={dropdownRef}
            className="relative hidden sm:block"
          >
            <button
              type="button"
              onClick={() => setIsMenuOpen(prev => !prev)}
              className={`
                flex items-center gap-2
                px-3 py-2
                border
                font-mono text-xs
                tracking-wider
                transition-all duration-200
                ${
                  isMenuOpen
                    ? 'bg-slate-800 border-cyan-400 text-cyan-400'
                    : 'bg-slate-900/70 border-slate-700 text-slate-300 hover:border-cyan-500 hover:text-cyan-400'
                }
              `}
            >
              <ShieldCheck size={16} />

              <span>SECURITY TOOLS</span>

              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  isMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 border border-slate-700 bg-slate-950 shadow-2xl shadow-black/40">

                {/* AI Shield */}
                <Link
                  to="/aishield"
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex items-start gap-3 px-4 py-3 border-b border-slate-800 hover:bg-cyan-950/30 transition-colors"
                >
                  <div className="mt-0.5 text-cyan-400">
                    <ShieldCheck size={18} />
                  </div>

                  <div>
                    <div className="text-sm font-bold text-slate-200 group-hover:text-cyan-400">
                      AI-Shield
                    </div>

                    <div className="mt-1 text-[10px] text-slate-500 font-mono">
                      AI-powered cyber defense
                    </div>
                  </div>
                </Link>

                {/* Privacy Detection */}
                <Link
                  to="/blurai"
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex items-start gap-3 px-4 py-3 hover:bg-cyan-950/30 transition-colors"
                >
                  <div className="mt-0.5 text-cyan-400">
                    <ScanFace size={18} />
                  </div>

                  <div>
                    <div className="text-sm font-bold text-slate-200 group-hover:text-cyan-400">
                      Blur-AI
                    </div>

                    <div className="mt-1 text-[10px] text-slate-500 font-mono">
                      Detect & protect visual privacy
                    </div>
                  </div>
                </Link>

              </div>
            )}
          </div>

          {/* System Status */}
          <PixelPulse
            trigger={isThreatActive}
            duration={1200}
          >
            <PixelBadge tone={isThreatActive ? 'gold' : 'green'}>
              {isThreatActive
                ? 'THREAT ACTIVE'
                : 'SYSTEM ACTIVE'}
            </PixelBadge>
          </PixelPulse>

          {/* Clock */}
          <div className="text-xs text-slate-500 font-mono hidden md:block">
            {time}
          </div>

        </div>
      </div>
    </header>
  )
}