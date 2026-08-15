import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, ScanFace, ChevronDown, Menu } from 'lucide-react'
import icon from '@/assets/img/icon.png'
import '@/assets/styles/Header.css'

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
    <header className="aishield-header">
      <span className="aishield-header__corner aishield-header__corner--tl" />
      <span className="aishield-header__corner aishield-header__corner--tr" />
      <span className="aishield-header__corner aishield-header__corner--bl" />
      <span className="aishield-header__corner aishield-header__corner--br" />

      <div className="aishield-header__container">
        <Link
          to="/"
          onClick={() => setIsMenuOpen(false)}
          className="aishield-header__logo"
        >
          <div className="aishield-header__logo-icon">
            <img
              src={icon}
              alt="Logo"
              className="aishield-header__logo-img"
            />
          </div>
          <div className="aishield-header__logo-text">
            <h1 className="aishield-header__title">AEGIS AI</h1>
            <p className="aishield-header__subtitle">
              AI-POWERED CYBER DEFENSE
            </p>
          </div>
        </Link>

        <div className="aishield-header__right">
          <div ref={dropdownRef} className="aishield-header__dropdown">
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className={`aishield-header__dropdown-btn ${
                isMenuOpen ? 'aishield-header__dropdown-btn--active' : ''
              }`}
            >
              <ShieldCheck size={14} />
              <span>TOOLS</span>
              <ChevronDown
                size={12}
                className={`aishield-header__dropdown-chevron ${
                  isMenuOpen ? 'aishield-header__dropdown-chevron--open' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="aishield-header__dropdown-menu">
                {/* Dropdown Header */}
                <div className="aishield-header__dropdown-menu-header">
                  <span>[SELECT MODULE]</span>
                  <button
                    className="aishield-header__dropdown-close"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ×
                  </button>
                </div>

                {/* AI Shield */}
                <Link
                  to="/aishield"
                  onClick={() => setIsMenuOpen(false)}
                  className="aishield-header__dropdown-item"
                >
                  <div className="aishield-header__dropdown-item-icon">
                    <ShieldCheck size={16} />
                  </div>
                  <div className="aishield-header__dropdown-item-content">
                    <div className="aishield-header__dropdown-item-title">
                      AI-SHIELD
                    </div>
                    <div className="aishield-header__dropdown-item-desc">
                      Network anomaly detection
                    </div>
                  </div>
                </Link>

                {/* Blur Ai */}
                <Link
                  to="/blurai"
                  onClick={() => setIsMenuOpen(false)}
                  className="aishield-header__dropdown-item"
                >
                  <div className="aishield-header__dropdown-item-icon">
                    <ScanFace size={16} />
                  </div>
                  <div className="aishield-header__dropdown-item-content">
                    <div className="aishield-header__dropdown-item-title">
                      BLUR-AI
                    </div>
                    <div className="aishield-header__dropdown-item-desc">
                      Visual privacy protection
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <div className="aishield-header__status">
            <div className="aishield-header__status-item">
              <span
                className={`aishield-header__status-dot ${
                  isThreatActive
                    ? 'aishield-header__status-dot--threat'
                    : ''
                }`}
              />
              <span className="aishield-header__status-text">
                {isThreatActive ? 'THREAT DETECTED' : 'SYSTEM NORMAL'}
              </span>
            </div>
          </div>

          <div className="aishield-header__clock">
            <span className="aishield-header__clock-label">SYS.TIME</span>
            <span className="aishield-header__clock-value">{time}</span>
          </div>

          <button
            className="aishield-header__mobile-menu"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}